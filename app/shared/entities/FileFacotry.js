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

module.factory("File", [
    "$resource",
    "$http",
    "ServerService",
    function ($resource, $http, ServerService) {
        "use strict";

        /*
        * Get the file name without the extension
        */
        function getFileNameExtension(filename) {
            var parts = filename.split(".");
            return parts[parts.length - 1];
        }

        /**
        * Get the file type of the file based on the extension
        */
        function getFileType(filename) {
            var ext = getFileNameExtension(filename);
            switch (ext.toLowerCase()) {
                case "jpg":
                case "jpeg":
                case "gif":
                case "bmp":
                case "png":
                    return "image";
                case "m4v":
                case "avi":
                case "mpg":
                case "mp4":
                    return "video";
                case "pdf":
                    return "pdf";
                case "txt":
                    return "text";
                case "tex":
                    return "latex";
            }
            return "text";
        }

        var transformResponse = [function (data) {
            var array = [];
            data = angular.fromJson(data);
            for (var i = 0; i < data.length; i++) {
                var resource = decodeURIComponent(data[i]);
                array.push({
                    title: resource,
                    name: resource.replace(/\.[^\.]+$/, ""),
                    type: getFileType(resource),
                    extension: getFileNameExtension(resource)
                });
            }
            return array;
        }].concat($http.defaults.transformResponse);

        return $resource(ServerService.urlServer + "/papers/:paperId/files/resources/:resourceId", null, {
            "query": {
                transformResponse: transformResponse,
                isArray: true
            },
            "saveResource": {
                method: "POST"
            },
            "removeResource": {
                method: "DELETE"
            },
            "getSynchronized": {
                url: ServerService.urlServer + "/papers/:paperId/files/synchronized",
                isArray: true,
                transformResponse: transformResponse
            },
            "getZip": {
                url: ServerService.urlServer + "/papers/:paperId/zip",
                responseType: "ArrayBuffer"
            }
        });
    }
]);
