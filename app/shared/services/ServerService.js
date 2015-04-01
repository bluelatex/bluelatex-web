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

module.service("ServerService", ["CONFIG", function (CONFIG) {
        "use strict";

        return {
            urlServer: (function () {
                var url = "";
                if(angular.isDefined(CONFIG.server) && CONFIG.server !== null) {
                    url += CONFIG.server;
                    if(angular.isDefined(CONFIG.port) && CONFIG.port !== null) {
                        url += ":" + CONFIG.port;
                    }
                    url += "/";
                }
                if(angular.isDefined(CONFIG.api_prefix) && CONFIG.api_prefix !== null) {
                    if(url === "") {
                        url += "/";
                    }
                    url += CONFIG.api_prefix;
                }
                return url;
            })()
        };
    }]);
