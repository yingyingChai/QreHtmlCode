var app = angular.module('RMADemos', []);
app.controller('RMACtrl', function ($scope, $http, $filter) {
    var user = getUser();
    $scope.DrafData = {
        DocumentNumber:'',
        Applican:user.Title,
        Date: $filter('date')(new Date(), 'yyyy-MM-dd'),
        Count: '',
        Unit: '',
        Device: '',
        Supplier: '',
        Subject: '',
        IssueDescription: '',
        ImpactSummary: '',
        SPRDRequest: '',
        Attachments: '',
        NotificationList:''
    }

});