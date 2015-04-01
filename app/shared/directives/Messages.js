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

/*
* A directive used to display messages
*/
var module = angular.module("bluelatex");

module.directive("blMessages", ["MessageService",
    function(MessageService) {
        "use strict";

        function link(scope) {
            scope.messages = MessageService.messages;
            scope.warnings = MessageService.warnings;
            scope.errors = MessageService.errors;

            scope.messagesSession = MessageService.messagesSession;
            scope.warningsSession = MessageService.warningsSession;
            scope.errorsSession = MessageService.errorsSession;

            scope.close = MessageService.close;
        }

        return {
            transclude: true,
            scope: {},
            templateUrl: "app/shared/layout/messages.html",
            link: link
        };
    }
]);
