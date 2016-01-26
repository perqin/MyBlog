angular.module('MyBlog', [])
    .controller('HeadController', ['$scope', 'PageInfo', function($scope, PageInfo) {
        $scope.pageTitle = PageInfo.pageTitle;
    }])
    .factory('PageInfo', function () {
        var piInstance = {};

        piInstance.pageTitle = 'MyBlog';
        piInstance.setPageTitle = function (title) {
            piInstance.pageTitle = title;
        };

        return piInstance;
    });