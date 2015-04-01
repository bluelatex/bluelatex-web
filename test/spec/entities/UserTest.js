describe("User entity", function () {
    "use strict";

    var mockUserResource, $httpBackend, ServerService;

    beforeEach(angular.mock.module("bluelatex"));

    beforeEach(function () {
        angular.mock.inject(function ($injector) {
            ServerService = $injector.get("ServerService");
            $httpBackend = $injector.get("$httpBackend");
            mockUserResource = $injector.get("User");
        });
    });

    describe("get user info", function () {
        it("should call get with username", inject(function () {
            $httpBackend.expectGET(ServerService.urlServer + "/users/username/info")
                .respond({
                    "name": "username",
                    "first_name": "first_name",
                    "last_name": "last_name",
                    "email": "username@bluelatex.org",
                    "affiliation": "test"
                }, {
                    "etag": "V2"
                });

            var result = mockUserResource.get({
                userId: "username"
            }, {

            });

            $httpBackend.flush();

            expect(result["if-match"]).toEqual("V2");
        }));
    });

    describe("save user info", function () {
        it("should call save with username", inject(function () {
            $httpBackend.expectPATCH(ServerService.urlServer + "/users/username/info")
                .respond("true", {
                    "etag": "V2"
                });

            var result = mockUserResource.save({
                "userId": "username"
            }, {
                "name": "username2"
            });

            $httpBackend.flush();

            expect(result["if-match"]).toEqual("V2");
        }));
    });

    describe("get users", function () {
        it("should call query", inject(function () {
            $httpBackend.expectGET(ServerService.urlServer + "/users")
                .respond([
                    "user1",
                    "user2",
                    "user3"
                ]);

            var result = mockUserResource.query();

            $httpBackend.flush();

            expect(result[0]).toEqual("user1");
        }));
    });

    describe("create user", function () {
        it("should call create", inject(function () {
            $httpBackend.expectPOST(ServerService.urlServer + "/users")
                .respond("true");

            var result = mockUserResource.create({
                "name": "username",
                "first_name": "first_name",
                "last_name": "last_name",
                "email": "username@bluelatex.org",
                "affiliation": "test"
            });

            $httpBackend.flush();

            expect(result.response).toEqual(true);
        }));
    });

    describe("reset user password", function () {
        it("should call reset with username", inject(function () {
            $httpBackend.expectGET(ServerService.urlServer + "/users/username/reset")
                .respond("true");

            var result = mockUserResource.resetPassword({
                "userId": "username"
            });

            $httpBackend.flush();

            expect(result.response).toEqual(true);
        }));
    });

    describe("change user password", function () {
        it("should call changePassword with username", inject(function () {
            $httpBackend.expectPOST(ServerService.urlServer + "/users/username/reset")
                .respond("true");

            var result = mockUserResource.changePassword({
                "userId": "username"
            }, {
                "reset_token": "reset_token",
                "new_password1": "new_password1",
                "new_password2": "new_password1"
            });

            $httpBackend.flush();

            expect(result.response).toEqual(true);
        }));
    });

    describe("remove user", function () {
        it("should call remove with username", inject(function () {
            $httpBackend.expectDELETE(ServerService.urlServer + "/users/username")
                .respond("true");

            var result = mockUserResource.remove({
                "userId": "username"
            });

            $httpBackend.flush();

            expect(result.response).toEqual(true);
        }));
    });
});
