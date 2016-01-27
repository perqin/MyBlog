angular.module('MyBlog', [])
    .controller('HeadController', ['$scope', 'PageInfo', function($scope, PageInfo) {
        $scope.pageTitle = PageInfo.pageTitle;
    }])
    .controller('PostListController', ['$scope', 'PostsCenter', function ($scope, PostsCenter) {
        $scope.posts = PostsCenter.posts;
        $scope.metaData = PostsCenter.metaData;

        $scope.toAddNewPost = function () {
            $scope.metaData.newPostTitle = '';
            $scope.metaData.newPostBody = '';
            $scope.metaData.addingNewPost = true;
        }
    }])
    .factory('PageInfo', function () {
        var piInstance = {};

        piInstance.pageTitle = 'MyBlog';
        piInstance.setPageTitle = function (title) {
            piInstance.pageTitle = title;
        };

        return piInstance;
    })
    .factory('PostsCenter', function () {
        var pcInstance = {};

        pcInstance.posts = [{expanded: true}, {expanded: false}];
        pcInstance.metaData = {};
        pcInstance.metaData.editingIndex = -1;
        pcInstance.metaData.addingNewPost = false;
        pcInstance.metaData.newPostTitle = '';
        pcInstance.metaData.newPostBody = '';

        return pcInstance;
    });