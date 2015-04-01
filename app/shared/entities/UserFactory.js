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

var module = angular.module("bluelatex");

module.factory("User", [
    "$resource",
    "ServerService",
    function ($resource, ServerService) {
        "use strict";

        return $resource(ServerService.urlServer + "/users/:userId", null, {
            "get": {
                url: ServerService.urlServer + "/users/:userId/info"
            },
            "create": {
                method: "POST",
                url: ServerService.urlServer + "/users/:userId"
            },
            "save": {
                method: "PATCH",
                url: ServerService.urlServer + "/users/:userId/info"
            },
            "resetPassword": {
                url: ServerService.urlServer + "/users/:userId/reset"
            },
            "changePassword": {
                method: "POST",
                url: ServerService.urlServer + "/users/:userId/reset"
            }
        });
    }
]);
