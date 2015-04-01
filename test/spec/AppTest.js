describe("Unit: Start application", function () {
    "use strict";

    it("The app must start", function () {
        expect(angular.module("bluelatex")).toBeDefined();
    });
});
