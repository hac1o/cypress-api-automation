import AuthApi from "../../support/api/auth.api";
import DeviceApi from "../../support/api/device.api";
import SharingApi from "../../support/api/sharing.api";

describe("Share Device Flow", () => {
  const sharedContext = {};

  before(() => {
    cy.login("parent");
  });

  it("Step 1: Parent should generate share device link", () => {
    DeviceApi.getDevices()
      .then((response) => {
        expect(response.status).to.eq(200);
        const devices = response.body.data.listDevices;

        const shareableDevice = devices.find((device) =>
          ["CSTM01", "BL02", "BM02"].includes(device.deviceTypeVersion),
        );
        expect(shareableDevice, "devices that can be shared").to.exist;

        const randomEmail = `child_${Date.now()}@shareDevice.com`;

        const payload = {
          assignee_email: randomEmail,
          devices_list: [
            {
              device_type_version: shareableDevice.deviceTypeVersion,
              device_created_at: shareableDevice.createdAt,
              device_id: shareableDevice.deviceId,
              device_name: shareableDevice.deviceName,
              duration: {
                end_timestamp: 0,
                is_permanent_access: 1,
                start_timestamp: Math.floor(Date.now() / 1000),
              },
              mac_address: shareableDevice.macAddress,
            },
          ],
          owner_name: shareableDevice.userId,
          version: 2,
        };

        // 2. SAVE DATA TO THE LOCAL OBJECT
        sharedContext.assigneeEmail = randomEmail;
        sharedContext.deviceId = shareableDevice.deviceId;
        sharedContext.macAddress = shareableDevice.macAddress;
        sharedContext.deviceTypeVersion = shareableDevice.deviceTypeVersion;
        sharedContext.owner_id = shareableDevice.userId;
        sharedContext.createdAt = shareableDevice.createdAt;
        sharedContext.device_name = shareableDevice.deviceName;

        return SharingApi.generateShareLink(payload);
      })
      .then((postResponse) => {
        expect(postResponse.status).to.eq(200);

        // 3. SAVE THE UID FROM THE RESPONSE
        sharedContext.uid = postResponse.body.data.uid;
        cy.log("Successfully generated share link!");

        sharedContext.linkCreatedAt = postResponse.body.data.createdAt;
      });
  });

  it("Step 2: Child should accept invitation", () => {
    cy.login("child").then((res) => {
      const childUserID = res.body.data.user.userId;
      sharedContext.childUserID = childUserID;

      const childUserName = res.body.data.user.userName;
      sharedContext.childUserName = childUserName;

      const payload = {
        link_status: 1,
        uid: sharedContext.uid,
        user_name: Cypress.env("childEmail"),
      };
      sharedContext.childEmail = payload.user_name;

      return SharingApi.acceptInvitation(payload).then((response) => {
        expect(response.status).to.eq(200);
        cy.log("Invitation accepted successfully!");
      });
    });
  });

  it("Step 3: Parent should GET shared device info", () => {
    cy.login("parent").then((res) => {
      return SharingApi.getSharedDevices().then((response) => {
        expect(response.status).to.eq(200);

        const membersArray = response.body.data.membersData;

        const sharedMember = membersArray.find((member) =>
          member.devicesList.some(
            (device) => device.deviceId === sharedContext.deviceId,
          ),
        );
        expect(sharedMember, "Shared member record").to.exist;

        const sharedDevice = sharedMember.devicesList.find(
          (device) => device.deviceId === sharedContext.deviceId,
        );

        sharedContext.policyId =
          sharedDevice.policyId || sharedDevice.policy_id;

        cy.log(`Policy ID saved: ${sharedContext.policyId}`);
      });
    });
  });

  it("Step 4: Add another device by Parent (Parent modifies shared devices)", () => {
    // Chain everything properly with .then()
    cy.login("parent").then((res) => {
      sharedContext.owner_name = res.body.data.user.userName;

      return DeviceApi.getDevices()
        .then((response) => {
          expect(response.status).to.eq(200);

          const devices = response.body.data.listDevices;

          // Find a New shareable device (NOT the one we already shared)
          const newShareableDevice = devices.find(
            (device) =>
              ["CSTM01", "BL02", "BM02"].includes(device.deviceTypeVersion) &&
              device.deviceId !== sharedContext.deviceId, // Exclude the already-shared device!
          );

          // Save the new device info to context
          sharedContext.newDeviceId = newShareableDevice.deviceId;
          sharedContext.newDeviceMacAddress = newShareableDevice.macAddress;
          sharedContext.newDeviceTypeVersion =
            newShareableDevice.deviceTypeVersion;
          sharedContext.newDeviceName = newShareableDevice.deviceName;
          sharedContext.newDeviceCreatedAt = newShareableDevice.createdAt;

          // Build the payload for adding a device to existing share
          const payload = {
            user_id: sharedContext.childUserID, // The child's user ID
            user_name: sharedContext.childUserName, // The child's email
            owner_id: sharedContext.owner_id, // The parent's user ID
            owner_name: sharedContext.owner_name, // The parent's name
            devices_list: [
              {
                device_created_at: sharedContext.newDeviceCreatedAt,
                device_id: sharedContext.newDeviceId,
                device_name: sharedContext.newDeviceName,
                policy_id: sharedContext.policyId, // Empty string or whatever your API expects
                duration: {
                  end_timestamp: 0,
                  is_permanent_access: 1,
                  start_timestamp: Math.floor(Date.now() / 1000),
                },
                mac_address: sharedContext.newDeviceMacAddress,
                device_type_version: sharedContext.newDeviceTypeVersion,
              },
              {
                device_created_at: sharedContext.createdAt,
                device_id: sharedContext.deviceId,
                device_name: sharedContext.device_name,
                policy_id: sharedContext.policyId,
                duration: {
                  end_timestamp: 0,
                  is_permanent_access: 1,
                  start_timestamp: Math.floor(Date.now() / 1000),
                },
                mac_address: sharedContext.macAddress,
                device_type_version: sharedContext.deviceTypeVersion,
              },
            ],
          };

          return SharingApi.updateSharedDevices(payload);
        })
        .then((response) => {
          expect(response.status).to.eq(200);
          cy.log("Parent successfully added another device to the share!");
        });
    });
  });

  it("Step 5: Revoke access of the recently shared device (Child revokes access)", () => {
    cy.login("child").then(() => {
      const payload = {
        device_type_version: sharedContext.newDeviceTypeVersion,
        mac_address: sharedContext.newDeviceMacAddress,
        owner_id: sharedContext.owner_id,
        version: 2,
      };
      return SharingApi.childRevoke(payload).then((response) => {
        expect(response.status).to.eq(200);
        cy.log(
          `Device ${sharedContext.newDeviceTypeVersion} -> ${sharedContext.newDeviceMacAddress} revoked by Child successfully!`,
        );
      });
    });
  });

  it("step 6: Parent removes all access", () => {
    cy.login("parent").then(() => {
      const payload = {
        uid: sharedContext.uid,
        email: sharedContext.childEmail,
        createdAt: sharedContext.linkCreatedAt,
        revokeType: 0,
      };

      return SharingApi.removeAllAccess(payload).then((response) => {
        expect(response.status).to.eq(200);
      });
    });
  });

  // BUG --> account having only shared device (one), when revoked the sessions logout (web)
  // Now add another object in PUT share devices API payload.
  // revoke child access of the newly added device.
});
