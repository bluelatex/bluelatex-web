describe("File entity", function () {
    "use strict";

    var mockFileResource, $httpBackend, ServerService;

    beforeEach(angular.mock.module("bluelatex"));

    beforeEach(function () {
        angular.mock.inject(function ($injector) {
            ServerService = $injector.get("ServerService");
            $httpBackend = $injector.get("$httpBackend");
            mockFileResource = $injector.get("File");
        });
    });

    describe("get paper resources", function () {
        it("should call getResources with id", inject(function () {
            $httpBackend.expectGET(ServerService.urlServer + "/papers/123/files/resources")
                .respond(["filename.txt"]);

            var result = mockFileResource.query({
                paperId: "123"
            });

            $httpBackend.flush();

            var firstFile = result[0];
            expect(firstFile.title).toEqual("filename.txt");
            expect(firstFile.name).toEqual("filename");
            expect(firstFile.type).toEqual("text");
            expect(firstFile.extension).toEqual("txt");
        }));
    });

    describe("get paper resource", function () {
        it("should call getResource with id", inject(function () {
            $httpBackend.expectGET(ServerService.urlServer + "/papers/123/files/resources/filename")
                .respond();

            mockFileResource.get({
                paperId: "123",
                resourceId: "filename"
            });

            $httpBackend.flush();
        }));
    });

    describe("save paper resource", function () {
        it("should call saveResource with id", inject(function () {
            $httpBackend.expectPOST(ServerService.urlServer + "/papers/123/files/resources/1")
                .respond("true");

            var result = mockFileResource.save({
                paperId: "123",
                resourceId: "1"
            }, {});

            $httpBackend.flush();
            expect(result.response).toEqual(true);
        }));
    });

    describe("remove paper resource", function () {
        it("should call removeResource with paper id and resource id", inject(function () {
            $httpBackend.expectDELETE(ServerService.urlServer + "/papers/123/files/resources/1")
                .respond("true");

            mockFileResource.remove({
                paperId: "123",
                resourceId: "1"
            });

            $httpBackend.flush();
        }));
    });

    describe("get paper synchronized files", function () {
        it("should call getSynchronizedFiles with paper id", inject(function () {
            $httpBackend.expectGET(ServerService.urlServer + "/papers/123/files/synchronized")
                .respond(["references.bib", "main.tex"]);

            var result = mockFileResource.getSynchronized({
                paperId: "123"
            });

            $httpBackend.flush();

            var firstFile = result[0];
            expect(firstFile.title).toEqual("references.bib");
            expect(firstFile.name).toEqual("references");
            expect(firstFile.type).toEqual("text");
            expect(firstFile.extension).toEqual("bib");
        }));
    });

    describe("get paper zip", function () {
        it("should call getZip with paper id", inject(function () {
            $httpBackend.expectGET(ServerService.urlServer + "/papers/123/zip")
                .respond();

            mockFileResource.getZip({
                paperId: "123"
            });

            $httpBackend.flush();
        }));
    });
});
