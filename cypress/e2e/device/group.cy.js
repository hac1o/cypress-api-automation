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

    it("Group Creation", () => {
        const payload = {
            groupName: "Test Group",
            imageId: 3,
            userId: sharedContext.userId,
        };

        return GroupApi.createGroup(payload).then((response) => {
            expect(response.status).to.eq(200);
            sharedContext.groupId = response.body.data.groupId;
        });
    });

    it("Device Added to Group", () => {
        DeviceApi.getDevices().then((response) => {
            expect(response.status).to.eq(200);

            const devices = response.body.data.listDevices;

            console.table(devices);

            const supportedTypes = ["CSTM01", "BL02", "BM02"];

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

            return GroupApi.addDeviceToGroup(payload).then((response) => {
                expect(response.status).to.eq(200);
            });
        });
    });

    it("Device Removed from Group", () => {
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

        return GroupApi.removeDeviceFromGroup(payload).then((response) => {
            expect(response.status).to.eq(200);
        });
    });

    it("Edit Group - Name & img changed", () => {
        const payload = {
            groupName: "Edited-Group",
            imageId: 2,
            groupId: sharedContext.groupId,
        };
        return GroupApi.editGroup(payload).then((response) => {
            expect(response.status).to.eq(200);
        });
    });

    it("Delete Group", () => {
        const payload = {
            groupId: sharedContext.groupId,
        };
        return GroupApi.deleteGroup(payload).then((response) => {
            expect(response.status).to.eq(200);
        });
    });
});
