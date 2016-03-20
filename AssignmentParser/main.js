var app = angular.module('myApp', []);
var myApp;
myApp = myApp || (function () {
    var pleaseWaitDiv = $('<div class="modal hide" id="pleaseWaitDialog" data-backdrop="static" data-keyboard="false"></div>');
    return {
        showPleaseWait: function () {
            pleaseWaitDiv.modal();
        },
        hidePleaseWait: function () {
            pleaseWaitDiv.modal('hide');
        },
    };
})();
app.directive('scrolly', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var raw = element[0];
            console.log('loading directive');

            element.bind('scroll', function () {
                console.log('in scroll');
                console.log(raw.scrollTop + raw.offsetHeight);
                console.log(raw.scrollHeight);
                if (raw.scrollTop + raw.offsetHeight > raw.scrollHeight +10) {                  
                        scope.$apply(attrs.scrolly);                                      
                }
            });
        }
    };
});
app.controller('customersCtrl', function ($scope, $http) {
    $scope.questions = [];
    var page = 0, pagesize = 10;
    $scope.loadMoreRecords = function () {
        if (page > 0) {
            // myApp.showPleaseWait();
        }
        $http.get("http://127.0.0.1/assignment/AssignmentParser/AssignmentParser/DBConnect.php?pagesize=" + 10 + "&page=" + page)
        .then(function (response) {
            //myApp.hidePleaseWait();
            for (var i = 0; i < response.data.length; i++) {
                $scope.questions.push(response.data[i]);
            }
            page++;
            for (var i = 0; i < $scope.questions.length; i++) {
                $scope.$watch('questions[' + i + ']', function (newValue, oldValue) {
                    //myApp.showPleaseWait();
                    //console.log("http://127.0.0.1/assignment/AssignmentParser/AssignmentParser/DBupdate.php?questionid=" + newValue.id
                    //    + "&answerid=" + newValue.answerid
                    //    + "&needReview=" + newValue.needReview);
                    $http.get("http://127.0.0.1/assignment/AssignmentParser/AssignmentParser/DBupdate.php?questionid=" + newValue.id
                        + "&answerid=" + newValue.answerid
                        + "&needReview=" + newValue.needReview
                        )
                    .then(function (response) {
                        //myApp.hidePleaseWait();
                    });
                }, true);
            }
        });
    }
    $scope.loadMoreRecords();
});
