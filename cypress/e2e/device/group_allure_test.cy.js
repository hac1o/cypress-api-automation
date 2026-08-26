import DeviceApi from "../../support/api/device.api";
import GroupApi from "../../support/api/group.api";
import * as allure from "allure-js-commons";

/*
 Group testing Flow
 1. Create Group
 2. Add device to Group
 3. remove device from Group
 4. Edit Group
 5. Delete Group
 */

describe("Group Flow", () => {
  const sharedContext = {};

  before(() => {
    cy.login("parent").then((response) => {
      sharedContext.userId = response.body.data.user.userId;
    });
  });

  // ==========================================
  // STEP 1: CREATE GROUP
  // ==========================================
  it("Step 1: Group Creation", () => {
    allure.feature("Groups");
    allure.story("Group Management");
    allure.description(
      "Verify that a parent user can successfully create a new device group",
    );
    allure.severity("critical");
    allure.owner("QA Team");
    allure.tag("api", "group");

    const payload = {
      groupName: "Test Group",
      imageId: 3,
      userId: sharedContext.userId,
    };

    allure.attachment(
      "Create Group - Request Payload",
      JSON.stringify(payload, null, 2),
      "application/json",
    );

    allure.step("Send POST request to create group", () => {
      return GroupApi.createGroup(payload).then((response) => {
        allure.attachment(
          "Create Group - Response Body",
          JSON.stringify(response.body, null, 2),
          "application/json",
        );
        expect(response.status).to.eq(200);
        sharedContext.groupId = response.body.data.groupId;
        cy.log(`Group Created with ID: ${sharedContext.groupId}`);
      });
    });
  });

  // ==========================================
  // STEP 2: ADD DEVICE TO GROUP
  // ==========================================
  it("Step 2: Device Added to Group", () => {
    allure.feature("Groups");
    allure.story("Device Grouping");
    allure.description(
      "Verify that a parent user can successfully add a supported device to an existing group",
    );
    allure.severity("critical");
    allure.owner("QA Team");
    allure.tag("api", "group", "device");

    const supportedTypes = ["CSTM01", "BL02", "BM02"];
    allure.parameter("Supported Device Types", supportedTypes.join(", "));

    allure
      .step("Fetch all devices", () => {
        return DeviceApi.getDevices();
      })
      .then((response) => {
        expect(response.status).to.eq(200);

        const devices = response.body.data.listDevices;
        allure.attachment(
          "GET Devices - Response Body",
          JSON.stringify(response.body, null, 2),
          "application/json",
        );

        const devicesForGroup = devices.find((device) =>
          supportedTypes.includes(device.deviceTypeVersion),
        );

        expect(devicesForGroup, "Supported device for Group").to.exist;
        cy.log(`Selected Device: ${devicesForGroup.deviceName}`);
        cy.log(`Type: ${devicesForGroup.deviceTypeVersion}`);
        cy.log(`MAC: ${devicesForGroup.macAddress}`);

        const payload = {
          devicesList: [
            {
              applianceType: devicesForGroup.applianceType,
              createdAt: devicesForGroup.createdAt,
              deviceId: devicesForGroup.deviceId,
              isFaren: devicesForGroup.isFaren,
              macAddress: devicesForGroup.macAddress,
              priority: devicesForGroup.priority,
            },
          ],
          groupId: sharedContext.groupId,
        };

        sharedContext.createdAt = devicesForGroup.createdAt;
        sharedContext.macAddress = devicesForGroup.macAddress;
        sharedContext.deviceId = devicesForGroup.deviceId;
        sharedContext.priority = devicesForGroup.priority;

        allure.attachment(
          "Add Device to Group - Request Payload",
          JSON.stringify(payload, null, 2),
          "application/json",
        );

        return allure
          .step("Add device to group via PUT request", () => {
            return GroupApi.addDeviceToGroup(payload);
          })
          .then((response) => {
            allure.attachment(
              "Add Device to Group - Response Body",
              JSON.stringify(response.body, null, 2),
              "application/json",
            );
            expect(response.status).to.eq(200);
            cy.log("Device successfully added to group!");
          });
      });
  });

  // ==========================================
  // STEP 3: REMOVE DEVICE FROM GROUP
  // ==========================================
  it("Step 3: Device Removed from Group", () => {
    allure.feature("Groups");
    allure.story("Device Grouping");
    allure.description(
      "Verify that a parent user can successfully remove a device from an existing group",
    );
    allure.severity("normal");
    allure.owner("QA Team");
    allure.tag("api", "group", "device");

    const payload = {
      devicesList: [
        {
          createdAt: sharedContext.createdAt,
          deviceId: sharedContext.deviceId,
          macAddress: sharedContext.macAddress,
          priority: sharedContext.priority,
        },
      ],
      groupId: sharedContext.groupId,
    };

    allure.attachment(
      "Remove Device from Group - Request Payload",
      JSON.stringify(payload, null, 2),
      "application/json",
    );

    allure.step("Send request to remove device from group", () => {
      return GroupApi.removeDeviceFromGroup(payload).then((response) => {
        allure.attachment(
          "Remove Device from Group - Response Body",
          JSON.stringify(response.body, null, 2),
          "application/json",
        );
        expect(response.status).to.eq(200);
        cy.log("Device successfully removed from group!");
      });
    });
  });

  // ==========================================
  // STEP 4: EDIT GROUP
  // ==========================================
  it("Step 4: Edit Group - Name & img changed", () => {
    allure.feature("Groups");
    allure.story("Group Management");
    allure.description(
      "Verify that a parent user can successfully edit the name and image of an existing group",
    );
    allure.severity("normal");
    allure.owner("QA Team");
    allure.tag("api", "group");

    const payload = {
      groupName: "Edited-Group",
      imageId: 2,
      groupId: sharedContext.groupId,
    };

    allure.attachment(
      "Edit Group - Request Payload",
      JSON.stringify(payload, null, 2),
      "application/json",
    );

    allure.step("Send PUT request to edit group", () => {
      return GroupApi.editGroup(payload).then((response) => {
        allure.attachment(
          "Edit Group - Response Body",
          JSON.stringify(response.body, null, 2),
          "application/json",
        );
        expect(response.status).to.eq(200);
        cy.log("Group edited successfully!");
      });
    });
  });

  // ==========================================
  // STEP 5: DELETE GROUP
  // ==========================================
  it("Step 5: Delete Group", () => {
    allure.feature("Groups");
    allure.story("Group Management");
    allure.description(
      "Verify that a parent user can successfully delete an existing group",
    );
    allure.severity("critical");
    allure.owner("QA Team");
    allure.tag("api", "group");

    const payload = {
      groupId: sharedContext.groupId,
    };

    allure.attachment(
      "Delete Group - Request Payload",
      JSON.stringify(payload, null, 2),
      "application/json",
    );

    allure.step("Send DELETE request to remove group", () => {
      return GroupApi.deleteGroup(payload).then((response) => {
        allure.attachment(
          "Delete Group - Response Body",
          JSON.stringify(response.body, null, 2),
          "application/json",
        );
        expect(response.status).to.eq(200);
        cy.log("Group deleted successfully!");
      });
    });
  });
});
