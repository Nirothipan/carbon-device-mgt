/*
 *   Copyright (c) 2017, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 *   WSO2 Inc. licenses this file to you under the Apache License,
 *   Version 2.0 (the "License"); you may not use this file except
 *   in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing,
 *   software distributed under the License is distributed on an
 *   "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 *   KIND, either express or implied.  See the License for the
 *   specific language governing permissions and limitations
 *   under the License.
 *
 */
package org.wso2.carbon.device.application.mgt.api.services;

import io.swagger.annotations.*;
import org.wso2.carbon.device.application.mgt.api.beans.ErrorResponse;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Path("/applications")
@Api(value = "Application Management", description = "This API carries all device management related operations " +
        "such as get all the available devices, etc.")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public interface ApplicationManagementService {

    public final static String SCOPE = "scope";

    @POST
    @Path("/")
    @Produces(MediaType.TEXT_PLAIN)
    @Consumes(MediaType.TEXT_PLAIN)
    @ApiOperation(
            consumes = MediaType.TEXT_PLAIN,
            produces = MediaType.TEXT_PLAIN,
            httpMethod = "POST",
            value = "Creates new application",
            notes = "This will create a new application",
            tags = "Application Management",
            extensions = {
                    @Extension(properties = {
                            @ExtensionProperty(name = SCOPE, value = "perm:create-application")
                    })
            }
    )
    @ApiResponses(
            value = {
                    @ApiResponse(
                            code = 200,
                            message = "OK. \n Successfully fetched the device location.",
                            response = String.class),
                    @ApiResponse(
                            code = 304,
                            message = "Not Modified. \n " +
                                    "Empty body because the client already has the latest version of the requested resource."),
                    @ApiResponse(
                            code = 500,
                            message = "Internal Server Error. \n Error occurred while retrieving signed certificate.",
                            response = ErrorResponse.class)
            })
    Response createApplication(
            @ApiParam(
                    name = "If-Modified-Since",
                    value = "Validates if the requested variant has not been modified since the time specified",
                    required = false)
            @HeaderParam("If-Modified-Since") String ifModifiedSince,
            String name);

    @GET
    @Path("/")
    @Produces(MediaType.TEXT_PLAIN)
    @Consumes(MediaType.TEXT_PLAIN)
    @ApiOperation(
            consumes = MediaType.TEXT_PLAIN,
            produces = MediaType.TEXT_PLAIN,
            httpMethod = "POST",
            value = "get all applications",
            notes = "This will get all applications",
            tags = "Application Management",
            extensions = {
                    @Extension(properties = {
                            @ExtensionProperty(name = SCOPE, value = "perm:get-application")
                    })
            }
    )
    @ApiResponses(
            value = {
                    @ApiResponse(
                            code = 200,
                            message = "OK. \n Successfully got application list.",
                            response = String.class),
                    @ApiResponse(
                            code = 304,
                            message = "Not Modified. \n " +
                                    "Empty body because the client already has the latest version of the requested resource."),
                    @ApiResponse(
                            code = 500,
                            message = "Internal Server Error. \n Error occurred while getting the application list.",
                            response = ErrorResponse.class)
            })
    Response getApplications(
            @ApiParam(
                    name = "If-Modified-Since",
                    value = "Validates if the requested variant has not been modified since the time specified",
                    required = false)
            @HeaderParam("If-Modified-Since") String ifModifiedSince);


}
