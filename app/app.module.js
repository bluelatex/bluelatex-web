/*
 * This file is part of the \BlueLaTeX project.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
* Transform json to HTTP POST parameters
*/
var jsonToPostParameters = function (json) {
    "use strict";
    if(angular.isUndefined(json)) {
        return null;
    }
    return Object.keys(json).map(function(k) {
        return encodeURIComponent(k) + "=" + encodeURIComponent(json[k]);
    }).join("&");
};

angular.module("bluelatex", [
    "localization",
    "ui.router",
    "ui.ace",
    "vcRecaptcha",
    "autoFillSync",
    "ngResource",
    "ngMessages",
    "ngMaterial"
]).factory("RequestInterceptor", ["ServerService", function (ServerService) {
    "use strict";

    return {
        "request": function (request) {
            if(request.url.search(ServerService.urlServer) < 0) {
                return request;
            }
            if(request.url.search(/sync$/) >= 0) {
                return request;
            }
            if(angular.isDefined(request.data) && angular.isDefined(request.data["if-match"])) {
                request.headers["if-match"] = request.data["if-match"];
                delete request.data["if-match"];
            }
            if(request.method === "PATCH") {
                request.headers["Content-Type"] = "application/json-patch";
            } else {
                request.headers["Content-Type"] = "application/x-www-form-urlencoded";
                request.data = jsonToPostParameters(request.data);
            }
            return request;
        },
        "response": function (response) {
            if(response.config.url.search(ServerService.urlServer) < 0) {
                return response;
            }
            if(angular.isDefined(response.data)
                && ((angular.isDefined(response.data.search)
                && response.data.search(/[a-zA-Z0-9]+/) > -1) || typeof response.data === "boolean")) {
                var data;
                try {
                    data = angular.fromJson(response.data);
                } catch (err) {
                    data = response.data;
                }
                response.data = {
                    "response": data
                };
            } else if (angular.isDefined(response.data)) {
                // transform string date to date object
                if(angular.isDefined(response.data.length)) {
                    for (var i = 0; i < response.data.length; i++) {
                        for (var index in response.data[i]) {
                            if(index.search("date") > -1) {
                                response.data[i][index] = new Date(response.data[i][index]);
                            }
                        }
                    }
                } else {
                    for (index in response.data) {
                        if(index.search("date") > -1) {
                            response.data[index] = new Date(response.data[index]);
                        }
                    }
                }
            }
            var headers = response.headers();
            if(angular.isDefined(headers.etag)) {
                response.data["if-match"] = headers.etag;
            }
            return response;
        }
    };
}]).config(["$httpProvider", function ($httpProvider) {
    "use strict";

    $httpProvider.interceptors.push("RequestInterceptor");
}]);
