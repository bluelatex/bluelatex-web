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

module.service("MessageService", ["$rootScope", "localize", "$sce", "$timeout",
    function ($rootScope, localize, $sce, $timeout) {
        "use strict";

        var errorsSession = [],
            infosSession = [],
            warningsSession = [];
        var errors = [],
            infos = [],
            warnings = [];

        /**
         * Close a message
         */
        var closeMessage = function (message) {
            // if the message is an error
            if(errors.indexOf(message) >= 0) {
                errors.splice(errors.indexOf(message), 1);
                // if the message is a message
            } else if(infos.indexOf(message) >= 0) {
                infos.splice(infos.indexOf(message), 1);
                // if the message is a warning
            } else if(warnings.indexOf(message) >= 0) {
                warnings.splice(warnings.indexOf(message), 1);
            } else if(errorsSession.indexOf(message) >= 0) {
                errorsSession.splice(errorsSession.indexOf(message), 1);
            } else if(infosSession.indexOf(message) >= 0) {
                infosSession.splice(infosSession.indexOf(message), 1);
            } else if(warningsSession.indexOf(message) >= 0) {
                warningsSession.splice(warningsSession.indexOf(message), 1);
            }
        };

        /**
         * Translate the message
         */
        var getMessageLocalized = function (m) {
            var tempMessage = localize.getLocalizedString(m);
            if(tempMessage === "") {
                tempMessage = m.replace(/_/g, " ").trim();
            } else if(angular.isUndefined(tempMessage)) {
                return m;
            }
            return tempMessage;
        };

        /**
         * Translate and add the message in the array
         */
        function pushMessage(message) {
            message.content = $sce.trustAsHtml(getMessageLocalized(message.content));
            var array = infos;
            switch (message.type) {
                case "error":
                    if(angular.isDefined(message.timeout)) {
                        array = errorsSession;
                    } else {
                        array = errors;
                    }
                    break;
                case "warning":
                    if(angular.isDefined(message.timeout)) {
                        array = warningsSession;
                    } else {
                        array = warnings;
                    }
                    break;
                default:
                    if(angular.isDefined(message.timeout)) {
                        array = infosSession;
                    } else {
                        array = infos;
                    }
            }
            for (var i = array.length - 1; i >= 0; i--) {
                if(array[i].content.valueOf() === message.content.valueOf()) {
                    return;
                }
            }
            array.push(message);
            if(angular.isDefined(message.timeout)) {
                $timeout(function() {
                    closeMessage(message);
                }, message.timeout);
            }
        }
        /**
         * Add an error message
         */
        function error (m, timeout) {
            pushMessage({
                type: "error",
                content: m,
                timeout: timeout
            });
        }

        /**
         * Add a message
         */
        function info (m, timeout) {
            pushMessage({
                type: "info",
                content: m,
                timeout: timeout
            });
        }

        /**
         * Add a warning
         */
        function warning (m, timeout) {
            pushMessage({
                type: "warning",
                content: m,
                timeout: timeout
            });
        }

        /*
         * clear messages
         */
        function clearNotSession () {
            errors.splice(0, errors.length);
            infos.splice(0, infos.length);
            warnings.splice(0, warnings.length);
        }

        /*
         * clear session messages
         */
        function clearSession () {
            errorsSession.splice(0, errors.length);
            infosSession.splice(0, errors.length);
            warningsSession.splice(0, errors.length);
        }

        /**
         * Remove all messages
         */
        function clean () {
            clearNotSession();
            clearSession();
        }

        $rootScope.$on("$routeChangeSuccess", function () {
            clearNotSession();
        });

        return {
            error: error,
            info: info,
            warning: warning,
            clean: clean,
            clear: clean,
            errors: errors,
            errorsSession: errorsSession,
            infos: infos,
            infosSession: infosSession,
            warnings: warnings,
            warningsSession: warningsSession,
            close: closeMessage
        };
    }
]);
