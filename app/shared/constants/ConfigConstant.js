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

module.constant("CONFIG", (function () {
    "use strict";

    var config = {
        "server": null,
        "port": null,
        "api_prefix": "api",
        "require_validation": false,
        "compilation_type": "explicit",
        "issues_url": null,
        "clone_url": null
    };
    function httpGet(theUrl) {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open( "GET", theUrl, false );
        xmlHttp.send( null );
        return xmlHttp.responseText;
    }
    try {
        var url = "";
        if(angular.isDefined(config.server) && config.server !== null) {
            url += config.server;
            if(angular.isDefined(config.port) && config.port !== null) {
                url += ":" + config.port;
            }
        }
        var serverConfig = angular.fromJson(httpGet(url + "/configuration"));
        angular.extend(config, serverConfig);
    } catch (e) {
        console.error(e);
    }
    return config;
})());
