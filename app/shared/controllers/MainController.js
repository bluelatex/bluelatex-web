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

module.controller("MainController", ["$timeout",
    "$mdSidenav",
    "$mdUtil",
    "$interval",
    "$rootScope",
    "ROLES",
    "AUTH_EVENTS",
    "CONFIG",
    "SessionService",
    "Session",
    "User",
    function ($timeout,
              $mdSidenav,
              $mdUtil,
              $interval,
              $rootScope,
              ROLES,
              AUTH_EVENTS,
              CONFIG,
              SessionService,
              Session,
              User) {
        "use strict";

        var vm = this;
        vm.currentUser = null;
        vm.userRoles = ROLES;
        vm.config = CONFIG;
        vm.isAuthorized = SessionService.isAuthorized;
        vm.isAuthenticated = SessionService.isAuthenticated;
        vm.pageTitle = "\\BlueLaTeX";

        vm.setCurrentUser = function (user) {
            vm.currentUser = user;
        };

        /**
         * Build handler to open/close a SideNav; when animation finishes
         * report completion in console
         */
        function buildToggler(navID) {
            var debounceFn = $mdUtil.debounce(function(){
                $mdSidenav(navID).toggle();
            }, 300);
            return debounceFn;
        }
        vm.toggleLeft = buildToggler("left");
        vm.toggleRight = buildToggler("right");

        /**
         * Retrieve the user session
         */
        vm.retrieveSession = function () {
            var session = new Session();
            session.$get().then(function () {
                var user = new User();
                user.$get({userId: session.name}).then(function () {
                    SessionService.create(user, session);
                    $rootScope.$broadcast(AUTH_EVENTS.autoLogin);
                });
            });
        };

        /**
         * Refresh the session in order to keep the user connected
         */
        function refreshSession() {
            var session = new Session();
            session.$get().then(function () {}, function () {
                $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
            });
        }

        /**
         * Update the current user with the new data
         */
        function updateUser () {
            vm.currentUser = SessionService.user;
        }

        // register user event
        $rootScope.$on(AUTH_EVENTS.loginSuccess, updateUser);
        $rootScope.$on(AUTH_EVENTS.logoutSuccess, updateUser);

        // register url change event
        $rootScope.$on("$stateChangeStart", function (event, next, nextParams) {
            // update the title of the page
            // TODO laucalize the title
            vm.pageTitle = next.data.title;
            if(angular.isDefined(nextParams.title)) {
                vm.pageTitle += " " + nextParams.title;
            } else if(angular.isDefined(nextParams.name)) {
                vm.pageTitle += " " + nextParams.name;
            }
        });

        // keep the session alive
        var sessionInterval = 1 /* min */ * 60 /* sec */ * 1000;/* nano-sec*/
        $interval(refreshSession, sessionInterval);

        // retreive the user session
        vm.retrieveSession();
    }]);
