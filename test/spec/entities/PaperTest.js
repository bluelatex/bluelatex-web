describe("Paper entity", function () {
    "use strict";

    var mockPaperResource, $httpBackend, ServerService;

    beforeEach(angular.mock.module("bluelatex"));

    beforeEach(function () {
        angular.mock.inject(function ($injector) {
            ServerService = $injector.get("ServerService");
            $httpBackend = $injector.get("$httpBackend");
            mockPaperResource = $injector.get("Paper");
        });
    });

    describe("create paper", function () {
        it("should create the paper", inject(function () {
            $httpBackend.expectPOST(ServerService.urlServer + "/papers")
                .respond("paperId");

            var result = mockPaperResource.save({
                "paper_name": "my_paper",
                "paper_title": "my_title"
            });

            $httpBackend.flush();
            expect(result.response).toEqual("paperId");
        }));
    });

    describe("delete paper", function () {
        it("should delete the paper with id", inject(function () {
            $httpBackend.expectDELETE(ServerService.urlServer + "/papers/paperId")
                .respond("true");

            mockPaperResource.remove({
                "paperId": "paperId"
            });

            $httpBackend.flush();
        }));
    });

    describe("get paper info", function () {
        it("should call getPaper with id", inject(function () {
            $httpBackend.expectGET(ServerService.urlServer + "/papers/123/info")
                .respond({
                    "name": "Writing Good Documentation",
                    "creation_date": "2014-06-20T17:57:21.902"
                }, {
                    "etag": "V1"
                });

            var result = mockPaperResource.get({
                paperId: "123"
            });

            $httpBackend.flush();

            expect(result.name).toEqual("Writing Good Documentation");
            expect(result["if-match"]).toEqual("V1");
        }));
    });

    describe("get papers from user", function () {
        it("should call getFromUser with id", inject(function () {
            $httpBackend.expectGET(ServerService.urlServer + "/users/username/papers")
                .respond([{
                    "id": "x1ac62d699a144a3",
                    "role": "author",
                    "name": "MSc Thesis",
                    "creation_date": "2014-12-22T08:47:18Z"
                }, {
                    "id": "x234fe328d50b4a1e",
                    "role": "author",
                    "name": "fsdgbsdg",
                    "creation_date": "2014-12-22T16:47:31Z"
                }]);

            var result = mockPaperResource.getFromUser({
                userId: "username"
            });

            $httpBackend.flush();

            expect(result[0].id).toEqual("x1ac62d699a144a3");
            expect(result[0].role).toEqual("author");
            expect(result[0].name).toEqual("MSc Thesis");
            expect(result[0].creation_date).toEqual(new Date("2014-12-22T08:47:18Z"));
            expect(result[0].creation_date.getMinutes()).toEqual(47);
        }));
    });

    describe("edit paper info", function () {
        it("should call getPaper with id", inject(function () {
            $httpBackend.expectPATCH(ServerService.urlServer + "/papers/123/info")
                .respond({
                    "name": "Writing Good Documentation",
                    "creation_date": "2014-06-20T17:57:21.902"
                }, {
                    "etag": "V2"
                });

            var result = mockPaperResource.patchInfo({
                paperId: "123"
            }, {
                "name": "Writing Good Documentation"
            });

            $httpBackend.flush();

            expect(result.name).toEqual("Writing Good Documentation");
            expect(result["if-match"]).toEqual("V2");
        }));
    });

    describe("join paper", function () {
        it("should call join with paper id", inject(function () {
            $httpBackend.expectPOST(ServerService.urlServer + "/papers/123/join/peerId")
                .respond("true");

            var result = mockPaperResource.join({
                "paperId": "123",
                "peerId": "peerId"
            }, {});

            $httpBackend.flush();
            expect(result.response).toEqual(true);
        }));
    });

    describe("part paper", function () {
        it("should call part with paper id", inject(function () {
            $httpBackend.expectPOST(ServerService.urlServer + "/papers/123/part/peerId")
                .respond("true");

            var result = mockPaperResource.part({
                "paperId": "123",
                "peerId": "peerId"
            }, {});

            $httpBackend.flush();
            expect(result.response).toEqual(true);
        }));
    });
});
