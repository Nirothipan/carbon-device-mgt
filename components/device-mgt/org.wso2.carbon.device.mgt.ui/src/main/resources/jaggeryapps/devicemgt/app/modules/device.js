/*
 * Copyright (c) 2016, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var deviceModule;
deviceModule = function () {
    var log = new Log("/app/modules/device.js");

    var utility = require('/app/modules/utility.js').utility;
    var constants = require('/app/modules/constants.js');
    var devicemgtProps = require('/app/conf/devicemgt-props.js').config();
    var serviceInvokers = require("/app/modules/backend-service-invoker.js").backendServiceInvoker;

    var ArrayList = Packages.java.util.ArrayList;
    var Properties = Packages.java.util.Properties;
    var DeviceIdentifier = Packages.org.wso2.carbon.device.mgt.common.DeviceIdentifier;
    var DeviceManagerUtil = Packages.org.wso2.carbon.device.mgt.core.util.DeviceManagerUtil;
    var SimpleOperation = Packages.org.wso2.carbon.device.mgt.core.operation.mgt.SimpleOperation;
    var ConfigOperation = Packages.org.wso2.carbon.device.mgt.core.operation.mgt.ConfigOperation;
    var CommandOperation = Packages.org.wso2.carbon.device.mgt.core.operation.mgt.CommandOperation;

    var deviceManagementService = utility.getDeviceManagementService();

    var publicMethods = {};
    var privateMethods = {};

    var deviceCloudService = devicemgtProps["httpsURL"] + "/common/device_manager";

    privateMethods.validateAndReturn = function (value) {
        return (value == undefined || value == null) ? constants.UNSPECIFIED : value;
    };

    /*
     @Deprecated
     */
    publicMethods.listDevices = function () {
        var carbonUser = session.get(constants.USER_SESSION_KEY);
        var utility = require('/app/modules/utility.js').utility;
        if (!carbonUser) {
            log.error("User object was not found in the session");
            throw constants.ERRORS.USER_NOT_FOUND;
        }
        try {
            utility.startTenantFlow(carbonUser);
            var deviceManagementService = utility.getDeviceManagementService();
            var devices = deviceManagementService.getAllDevices();
            var deviceList = [];
            var i, device, propertiesList, deviceObject;
            for (i = 0; i < devices.size(); i++) {
                device = devices.get(i);
                propertiesList = DeviceManagerUtil.convertDevicePropertiesToMap(device.getProperties());

                deviceObject = {};
                deviceObject[constants.DEVICE_IDENTIFIER] =
                    privateMethods.validateAndReturn(device.getDeviceIdentifier());
                deviceObject[constants.DEVICE_NAME] =
                    privateMethods.validateAndReturn(device.getName());
                deviceObject[constants.DEVICE_OWNERSHIP] =
                    privateMethods.validateAndReturn(device.getEnrolmentInfo().getOwnership());
                deviceObject[constants.DEVICE_OWNER] =
                    privateMethods.validateAndReturn(device.getEnrolmentInfo().getOwner());
                deviceObject[constants.DEVICE_TYPE] =
                    privateMethods.validateAndReturn(device.getType());
                deviceObject[constants.DEVICE_PROPERTIES] = {};
                if (device.getType() == constants.PLATFORM_IOS) {
                    deviceObject[constants.DEVICE_PROPERTIES][constants.DEVICE_MODEL] =
                        privateMethods.validateAndReturn(propertiesList.get(constants.DEVICE_PRODUCT));
                    deviceObject[constants.DEVICE_PROPERTIES][constants.DEVICE_VENDOR] = constants.VENDOR_APPLE;
                } else {
                    deviceObject[constants.DEVICE_PROPERTIES][constants.DEVICE_MODEL] =
                        privateMethods.validateAndReturn(propertiesList.get(constants.DEVICE_MODEL));
                    deviceObject[constants.DEVICE_PROPERTIES][constants.DEVICE_VENDOR] =
                        privateMethods.validateAndReturn(propertiesList.get(constants.DEVICE_VENDOR));
                }
                deviceObject[constants.DEVICE_PROPERTIES][constants.DEVICE_OS_VERSION] =
                    privateMethods.validateAndReturn(propertiesList.get(constants.DEVICE_OS_VERSION));

                deviceList.push(deviceObject);
            }
            return deviceList;
        } catch (e) {
            throw e;
        } finally {
            utility.endTenantFlow();
        }
    };

    /*
     @Deprecated
     */
    publicMethods.listDevicesForUser = function (username) {
        var carbonUser = session.get(constants.USER_SESSION_KEY);
        var utility = require('/app/modules/utility.js').utility;
        if (!carbonUser) {
            log.error("User object was not found in the session");
            throw constants.ERRORS.USER_NOT_FOUND;
        }
        try {
            utility.startTenantFlow(carbonUser);
            var deviceManagementService = utility.getDeviceManagementService();
            var devices = deviceManagementService.getDevicesOfUser(username);
            var deviceList = [];
            var i, device, propertiesList, deviceObject;
            for (i = 0; i < devices.size(); i++) {
                device = devices.get(i);
                propertiesList = DeviceManagerUtil.convertDevicePropertiesToMap(device.getProperties());

                deviceObject = {};
                deviceObject[constants.DEVICE_IDENTIFIER] =
                    privateMethods.validateAndReturn(device.getDeviceIdentifier());
                deviceObject[constants.DEVICE_NAME] =
                    privateMethods.validateAndReturn(device.getName());
                deviceObject[constants.DEVICE_OWNERSHIP] =
                    privateMethods.validateAndReturn(device.getEnrolmentInfo().getOwnership());
                deviceObject[constants.DEVICE_OWNER] =
                    privateMethods.validateAndReturn(device.getEnrolmentInfo().getOwner());
                deviceObject[constants.DEVICE_TYPE] =
                    privateMethods.validateAndReturn(device.getType());
                deviceObject[constants.DEVICE_PROPERTIES] = {};
                if (device.getType() == constants.PLATFORM_IOS) {
                    deviceObject[constants.DEVICE_PROPERTIES][constants.DEVICE_MODEL] =
                        privateMethods.validateAndReturn(propertiesList.get(constants.DEVICE_PRODUCT));
                    deviceObject[constants.DEVICE_PROPERTIES][constants.DEVICE_VENDOR] = constants.VENDOR_APPLE;
                } else {
                    deviceObject[constants.DEVICE_PROPERTIES][constants.DEVICE_MODEL] =
                        privateMethods.validateAndReturn(propertiesList.get(constants.DEVICE_MODEL));
                    deviceObject[constants.DEVICE_PROPERTIES][constants.DEVICE_VENDOR] =
                        privateMethods.validateAndReturn(propertiesList.get(constants.DEVICE_VENDOR));
                }
                deviceObject[constants.DEVICE_PROPERTIES][constants.DEVICE_OS_VERSION] =
                    privateMethods.validateAndReturn(propertiesList.get(constants.DEVICE_OS_VERSION));

                deviceList.push(deviceObject);
            }
            return deviceList;
        } catch (e) {
            throw e;
        } finally {
            utility.endTenantFlow();
        }
    };

    /*
     @Deprecated
     */
    /*
     Get the supported features by the device type
     */
    publicMethods.getFeatures = function (deviceType) {
        var carbonUser = session.get(constants.USER_SESSION_KEY);
        var utility = require('/app/modules/utility.js').utility;
        if (!carbonUser) {
            log.error("User object was not found in the session");
            throw constants.ERRORS.USER_NOT_FOUND;
        }
        try {
            utility.startTenantFlow(carbonUser);
            var deviceManagementService = utility.getDeviceManagementService();
            var features = deviceManagementService.getFeatureManager(deviceType).getFeatures();
            var featuresConverted = {};
            if (features) {
                var i, feature, featureObject;
                for (i = 0; i < features.size(); i++) {
                    feature = features.get(i);
                    featureObject = {};
                    featureObject[constants.FEATURE_NAME] = feature.getName();
                    featureObject[constants.FEATURE_DESCRIPTION] = feature.getDescription();
                    featuresConverted[feature.getName()] = featureObject;
                }
            }
            return featuresConverted;
        } catch (e) {
            throw e;
        } finally {
            utility.endTenantFlow();
        }
    };

    /*
     @Deprecated
     */
    publicMethods.performOperation = function (devices, operation) {
        var carbonUser = session.get(constants.USER_SESSION_KEY);
        var utility = require('/app/modules/utility.js').utility;
        if (!carbonUser) {
            log.error("User object was not found in the session");
            throw constants.ERRORS.USER_NOT_FOUND;
        }
        try {
            utility.startTenantFlow(carbonUser);
            var deviceManagementService = utility.getDeviceManagementService();
            var operationInstance;
            if (operation.type == "COMMAND") {
                operationInstance = new CommandOperation();
            } else if (operation.type == "CONFIG") {
                operationInstance = new ConfigOperation();
            } else {
                operationInstance = new SimpleOperation();
            }
            operationInstance.setCode(operation.featureName);
            var props = new Properties();
            var i, object;
            for (i = 0; i < operation.properties.length; i++) {
                object = properties[i];
                props.setProperty(object.key, object.value);
            }
            operationInstance.setProperties(props);
            var deviceList = new ArrayList();
            var j, device, deviceIdentifier;
            for (j = 0; j < devices.length; i++) {
                device = devices[j];
                deviceIdentifier = new DeviceIdentifier();
                deviceIdentifier.setId(device.id);
                deviceIdentifier.setType(device.type);
                deviceList.add(deviceIdentifier);
            }
            deviceManagementService.addOperation(operationInstance, deviceList);
        } catch (e) {
            throw e;
        } finally {
            utility.endTenantFlow();
        }
    };

    /*
     @Deprecated
     */
    privateMethods.getDevice = function (type, deviceId) {
        var carbonUser = session.get(constants.USER_SESSION_KEY);
        var utility = require('/app/modules/utility.js').utility;
        if (!carbonUser) {
            log.error("User object was not found in the session");
            throw constants.ERRORS.USER_NOT_FOUND;
        }
        try {
            utility.startTenantFlow(carbonUser);
            var deviceManagementService = utility.getDeviceManagementService();
            var deviceIdentifier = new DeviceIdentifier();
            deviceIdentifier.setType(type);
            deviceIdentifier.setId(deviceId);
            return deviceManagementService.getDevice(deviceIdentifier);
        } catch (e) {
            throw e;
        } finally {
            utility.endTenantFlow();
        }
    };

    /*
     @Updated
     */
    publicMethods.viewDevice = function (deviceType, deviceId) {
        var carbonUser = session.get(constants["USER_SESSION_KEY"]);
        if (!carbonUser) {
            log.error("User object was not found in the session");
            throw constants["ERRORS"]["USER_NOT_FOUND"];
        }
        var utility = require('/app/modules/utility.js')["utility"];
        try {
            utility.startTenantFlow(carbonUser);

            var url = devicemgtProps["httpsURL"] + constants.ADMIN_SERVICE_CONTEXT + "/devices/view?type=" + deviceType + "&id=" + deviceId;
            return serviceInvokers.XMLHttp.get(
                    url, function (responsePayload) {
                        var device = responsePayload.responseContent;
                        if (device) {
                            var propertiesList = device["properties"];
                            var properties = {};
                            for (var i = 0; i < propertiesList.length; i++) {
                                properties[propertiesList[i]["name"]] =
                                        propertiesList[i]["value"];
                            }
                            var deviceObject = {};
                            deviceObject[constants["DEVICE_IDENTIFIER"]] = device["deviceIdentifier"];
                            deviceObject[constants["DEVICE_NAME"]] = device["name"];
                            deviceObject[constants["DEVICE_OWNERSHIP"]] = device["enrolmentInfo"]["ownership"];
                            deviceObject[constants["DEVICE_OWNER"]] = device["enrolmentInfo"]["owner"];
                            deviceObject[constants["DEVICE_STATUS"]] = device["enrolmentInfo"]["status"];
                            deviceObject[constants["DEVICE_TYPE"]] = device["type"];
                            if (device["type"] == constants["PLATFORM_IOS"]) {
                                properties[constants["DEVICE_MODEL"]] = properties[constants["DEVICE_PRODUCT"]];
                                delete properties[constants["DEVICE_PRODUCT"]];
                                properties[constants["DEVICE_VENDOR"]] = constants["VENDOR_APPLE"];
                            }
                            deviceObject[constants["DEVICE_PROPERTIES"]] = properties;
                            return deviceObject;
                        }
                    }
                    ,
                    function (responsePayload) {
                        var response = {};
                        response["status"] = "error";
                        return response;
                    }
            );
        } catch (e) {
            throw e;
        } finally {
            utility.endTenantFlow();
        }
    };

    /*
     @Updated
     */
    publicMethods.getLicense = function (deviceType) {
        var url;
        var license;
        if (deviceType == "windows") {
            url = devicemgtProps["httpURL"] + "/mdm-windows-agent/services/device/license";
        } else if (deviceType == "ios") {
            url = devicemgtProps["httpsURL"] + "/ios-enrollment/license/";
        }

        if (url != null && url != undefined) {
            serviceInvokers.XMLHttp.get(url, function (responsePayload) {
                license = responsePayload.text;
            }, function (responsePayload) {
                return null;
            });
        }
        return license;
    };

    publicMethods.getOwnDevices = function () {
        var listAllDevicesEndPoint = deviceCloudService + "/device/user/" + user.username + "/all";
        var result = get(listAllDevicesEndPoint, {}, "json");
        var devices = result.data;
        var device;
        for (var d in devices){
            device = devices[d];
            device.assetId = publicMethods.getAssetId(device.deviceType);
        }
        return result;
    };

    publicMethods.getAllDevicesCount = function () {
        var url = devicemgtProps["httpsURL"] + constants.ADMIN_SERVICE_CONTEXT + "/devices/count";
        return serviceInvokers.XMLHttp.get(
                url, function (responsePayload) {
                    return responsePayload;
                }
                ,
                function (responsePayload) {
                    log.error(responsePayload);
                    return -1;
                }
        );
    };

    publicMethods.getAllPermittedDevices = function () {
        var groupModule = require("/app/modules/group.js").groupModule;

        var result = publicMethods.getUnGroupedDevices();
        var unGroupedDevices = result.data;
        var user_groups = groupModule.getGroups().data;
        var allDevices = [];
        var deviceCount = unGroupedDevices.length;
        for (var g in user_groups) {
            var deviceInGroup = user_groups[g].devices;
            deviceCount += deviceInGroup.length;
            if (deviceInGroup && deviceInGroup.length == 0) {
                delete user_groups[g]["devices"];
            }
            var device;
            for (var d in deviceInGroup){
                device = deviceInGroup[d];
                device.assetId = publicMethods.getAssetId(device.type);
            }
            allDevices.push(user_groups[g]);
        }
        allDevices.push({id: 0, devices: unGroupedDevices});
        result.data = allDevices;
        result.device_count = deviceCount;
        return result;
    };

    publicMethods.getDeviceTypes = function () {
        var deviceTypesEndPoint = deviceCloudService + "/device/type/all";
        return get(deviceTypesEndPoint, {}, "json");
    };

    publicMethods.removeDevice = function (deviceType, deviceId) {
        var carbonUser = session.get(constants.USER_SESSION_KEY);
        if (!carbonUser) {
            log.error("User object was not found in the session");
            throw constants.ERRORS.USER_NOT_FOUND;
        }
        try {
            utility.startTenantFlow(carbonUser);
            var deviceManagementService = utility.getDeviceManagementService();
            var deviceIdentifier = new DeviceIdentifier();
            deviceIdentifier.setType(deviceType);
            deviceIdentifier.setId(deviceId);
            return deviceManagementService.disenrollDevice(deviceIdentifier);
        } catch (e) {
            throw e;
        } finally {
            utility.endTenantFlow();
        }
    };

    publicMethods.updateDevice = function (deviceType, deviceId, deviceName) {
        var carbonUser = session.get(constants.USER_SESSION_KEY);
        if (!carbonUser) {
            log.error("User object was not found in the session");
            throw constants.ERRORS.USER_NOT_FOUND;
        }
        try {
            utility.startTenantFlow(carbonUser);
            var deviceManagementService = utility.getDeviceManagementService();
            var deviceIdentifier = new DeviceIdentifier();
            deviceIdentifier.setType(deviceType);
            deviceIdentifier.setId(deviceId);
            var device = deviceManagementService.getDevice(deviceIdentifier);
            device.setName(deviceName);
            return deviceManagementService.modifyEnrollment(device);
        } catch (e) {
            throw e;
        } finally {
            utility.endTenantFlow();
        }
    };

    return publicMethods;
}();
