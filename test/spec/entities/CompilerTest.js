describe("Permission entity", function () {
    "use strict";

    var mockCompilerResource, $httpBackend, ServerService;

    beforeEach(angular.mock.module("bluelatex"));

    beforeEach(function () {
        angular.mock.inject(function ($injector) {
            ServerService = $injector.get("ServerService");
            $httpBackend = $injector.get("$httpBackend");
            mockCompilerResource = $injector.get("Compiler");
        });
    });

    describe("get paper compiler", function () {
        it("should call get with id", inject(function () {
            $httpBackend.expectGET(ServerService.urlServer + "/papers/123/compiler")
                .respond({
                    "compiler": "pdflatex",
                    "synctex": true,
                    "timeout": 30,
                    "interval": 1
                });

            var result = mockCompilerResource.get({
                paperId: "123"
            });

            $httpBackend.flush();

            expect(result.compiler).toEqual("pdflatex");
        }));
    });

    describe("patch paper compiler", function () {
        it("should call patchPermissions with id", inject(function () {
            $httpBackend.expectPATCH(ServerService.urlServer + "/papers/123/compiler")
                .respond("true", {
                    "etag": "V2"
                });

            var result = mockCompilerResource.save({
                paperId: "123"
            }, {});

            $httpBackend.flush();

            expect(result["if-match"]).toEqual("V2");
        }));
    });
});
