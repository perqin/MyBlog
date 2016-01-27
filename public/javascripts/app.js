angular.module('MyBlog', [])
    .controller('HeadController', ['$scope', 'PageInfo', function($scope, PageInfo) {
        $scope.pageTitle = PageInfo.pageTitle;
    }])
    .controller('TopBarController', ['$scope', 'UserInfo', function ($scope, UserInfo) {
        $scope.metaData = UserInfo.metaData;
        $scope.user = UserInfo.user;
    }])
    .controller('PostListController', ['$scope', 'PostsCenter', function ($scope, PostsCenter) {
        $scope.posts = PostsCenter.posts;
        $scope.metaData = PostsCenter.metaData;
        $scope.updatePosts = PostsCenter.getAllPosts;

        $scope.toAddNewPost = function () {
            $scope.metaData.newPostTitle = '';
            $scope.metaData.newPostBody = '';
            $scope.metaData.addingNewPost = true;
        };
        $scope.addNewPost = function () {
            PostsCenter.addNewPost($scope.metaData.newPostTitle, $scope.metaData.newPostBody);
            $scope.metaData.addingNewPost = false;
        };

        $scope.updatePosts();
    }])
    .factory('PageInfo', function () {
        var piInstance = {};

        piInstance.pageTitle = 'MyBlog';
        piInstance.setPageTitle = function (title) {
            piInstance.pageTitle = title;
        };

        return piInstance;
    })
    .factory('UserInfo', function () {
        var uiInstance = {};

        uiInstance.metaData = {
            panelState: 'none'
        };
        uiInstance.user = {
            permission: 'guest',
            username: '',
            nickname: ''
        };

        return uiInstance;
    })
    .factory('PostsCenter', ['$http', function ($http) {
        var pcInstance = {};

        pcInstance.posts = [];
        pcInstance.metaData = {};
        pcInstance.metaData.editingIndex = -1;
        pcInstance.metaData.addingNewPost = false;
        pcInstance.metaData.newPostTitle = '';
        pcInstance.metaData.newPostBody = '';

        pcInstance.addNewPost = function (title, content) {
            $http.post('/api/post', { title: title, content: content }).then(function (response) {
                pcInstance.getAllPosts();
            }, function (response) {
                // Error
            });
        };
        pcInstance.getAllPosts = function () {
            $http.get('/api/posts').then(function (response) {
                while (pcInstance.posts.length) {
                    pcInstance.posts.pop();
                }
                for (var i = 0; i < response.data.data.length; ++i) {
                    pcInstance.posts.push(response.data.data[i]);
                    pcInstance.posts[i].expanded = false;
                }
            });
        };

        return pcInstance;
    }]);