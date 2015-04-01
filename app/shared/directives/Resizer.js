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

module.directive("blResize", ["$document",
    function($document) {
        "use strict";

        function link(scope, $element, $attrs) {
            var config = {
                orientation: "horizontal",
                resizerMax: "100"
            };
            config.orientation = ($attrs.layout === "row") ? "horizontal" : "vertical";

            var element = $element;
            var $resizers = [];
            var currentResizer = null;
            var nbElement = 0;

            function mousemove(event) {
                var clientRect = element[0].getBoundingClientRect();
                var next = angular.element(currentResizer.nextElementSibling);
                var prev = angular.element(currentResizer.previousElementSibling);
                var prevRect = prev[0].getBoundingClientRect();
                var nextRect = next[0].getBoundingClientRect();

                switch (config.orientation) {
                    case "horizontal":
                        var x = event.pageX;

                        var delta = x - prevRect.right;

                        var totalWidth = clientRect.width - 4 * (nbElement - 1);
                        next.css("flex", ((nextRect.width - delta) / totalWidth * 100) + "%");
                        prev.css("flex", ((prevRect.width + delta) / totalWidth * 100) + "%");
                        break;
                    case "vertical":
                        var y = event.pageY;

                        delta = y - prevRect.top;

                        var totalHeight = clientRect.height - 4 * (nbElement - 1);
                        next.css("flex", ((nextRect.height - delta) / totalHeight * 100) + "%");
                        prev.css("flex", ((prevRect.height + delta) / totalHeight * 100) + "%");
                        break;
                }
            }

            function mouseup() {
                $document.unbind("mousemove", mousemove);
                $document.unbind("mouseup", mouseup);

                currentResizer = null;
            }

            function resizermove(event) {
                event.preventDefault();
                currentResizer = this;

                $document.on("mousemove", mousemove);
                $document.on("mouseup", mouseup);
            }

            var inInit = false;
            function init(event) {
                if(inInit === true) {
                    return;
                }
                if(event != null && element[0] !== event.target.parentNode) {
                    return;
                }
                inInit = true;
                $element.unbind("DOMNodeInserted", init);
                while($resizers.length !== 0) {
                    var $resizer = $resizers.pop();
                    $resizer.unbind("mousedown", resizermove);
                    $resizer.remove();
                }
                var children = element.children();
                for (var i = children.length - 1; i >= 0; i--) {
                    var $child = angular.element(children[i]);
                    if($child.hasClass("resizer")) {
                        $child.remove();
                    }
                }
                children = element.children();
                nbElement = children.length;
                var clientRect = element[0].getBoundingClientRect();
                for (i = children.length - 1; i >= 0; i--) {
                    $child = angular.element(children[i]);
                    if($child.hasClass("resizer")) {
                        continue;
                    }
                    $child.css("flex", ((clientRect.width - 4 * children.length - 1) / children.length) + "px");
                    if(i === children.length - 1) {
                        continue;
                    }
                    var separator = "||";
                    if(config.orientation === "vertical") {
                        separator = "=";
                    }
                    $resizer = angular.element("<md-content class=\"resizer " + config.orientation + "\" layout=\"column\" flex  layout-align=\"center center\">" + separator + "</md-content>");
                    $child.after($resizer);

                    $resizers.push($resizer);

                    $resizer.on("mousedown", resizermove);
                }
                $element.on("DOMNodeInserted", init);
                inInit = false;
            }

            init();

            $element.on("DOMNodeInserted", init);
        }

        return {
            restrict: "A",
            link: link
        };
    }
]);
