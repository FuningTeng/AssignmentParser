var app = angular.module('myApp', []);
app.directive('scrolly', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var raw = element[0];
            element.bind('scroll', function () {
                if (raw.scrollTop + raw.offsetHeight > raw.scrollHeight + 10) {
                    scope.$apply(attrs.scrolly);
                }
                if (raw.scrollTop > 100) {
                    $('.scrollup').fadeIn();
                } else {
                    $('.scrollup').fadeOut();
                }
            });
        }
    };
});
app.controller('customersCtrl', function ($scope, $http) {
    $scope.questions = [];
    var page = 0, pagesize = 50;
    $scope.searchText = "";
    $scope.assignmentNo = "";
    $scope.loadMoreRecords = function () {
        var queryBase = "http://127.0.0.1/assignment/AssignmentParser/AssignmentParser/DBConnect.php?";
        var query = queryBase + "pagesize=" + pagesize + "&page=" + page;
        if ($scope.searchText && $scope.searchText.length >= 3) {
            query = queryBase + "pagesize=" + 500 + "&page=" + 0;
        }
        if ($scope.assignmentNo) {
            query = query + "&assignmentNO=" + $scope.assignmentNo;
        }
        $http.get(query)
        .then(function (response) {
            for (var i = 0; i < response.data.length; i++) {
                $scope.questions.push(response.data[i]);
            }
            page++;
            for (var i = 0; i < $scope.questions.length; i++) {
                $scope.$watch('questions[' + i + ']', function (newValue, oldValue) {
                    //console.log("http://127.0.0.1/assignment/AssignmentParser/AssignmentParser/DBupdate.php?questionid=" + newValue.id
                    //    + "&answerid=" + newValue.answerid
                    //    + "&needReview=" + newValue.needReview);
                    if (newValue) {
                        $http.get("http://127.0.0.1/assignment/AssignmentParser/AssignmentParser/DBupdate.php?questionid=" + newValue.id
                            + "&answerid=" + newValue.answerid
                            + "&needReview=" + newValue.needReview
                            )
                        .then(function (response) {});
                    }

                }, true);
            }
        });
    }
    $scope.loadMoreRecords();
    $scope.$watch('searchText', function (newValue, oldValue) {
        if (newValue != oldValue && newValue && newValue.length > 3) {
            $scope.questions = [];
            page = 0;
            $scope.loadMoreRecords();
        } else if (!newValue) {
            page = 0;
            $scope.loadMoreRecords();
        }
    });
    $scope.$watch('assignmentNo', function (newValue, oldValue) {
        if (newValue != oldValue && newValue) {
            $scope.questions = [];
            page = 0;
            $scope.loadMoreRecords();
        }
    });
});
$(document).ready(function () {

    $('.scrollup').click(function () {
        $(".items-wrap").animate({
            scrollTop: 0
        }, 600);
        return false;
    });

});