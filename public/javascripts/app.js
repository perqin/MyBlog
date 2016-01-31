angular.module('MyBlog', [])
    .controller('HeadController', ['$scope', 'PageInfo', function($scope, PageInfo) {
        $scope.pageTitle = PageInfo.pageTitle;
    }])
    .controller('TopBarController', ['$scope', 'UserInfo', function ($scope, UserInfo) {
        $scope.metaData = UserInfo.metaData;
        $scope.user = UserInfo.user;

        $scope.login = UserInfo.login;
        $scope.autoLogin = UserInfo.autoLogin;
        $scope.register = UserInfo.register;
        $scope.logout = UserInfo.logout;

        $scope.autoLogin();
    }])
    .controller('PostListController', ['$scope', 'PostsCenter', 'UserInfo', function ($scope, PostsCenter, UserInfo) {
        $scope.posts = PostsCenter.posts;
        $scope.metaData = PostsCenter.metaData;
        $scope.user = UserInfo.user;
        $scope.updatePosts = PostsCenter.getAllPosts;
        $scope.editPost = PostsCenter.updatePost;
        $scope.blockPost = PostsCenter.blockPost;
        $scope.deletePost = PostsCenter.deletePost;
        $scope.addNewComment = PostsCenter.addNewComment;
        $scope.updateComment = PostsCenter.updateComment;
        $scope.blockComment = PostsCenter.blockComment;
        $scope.deleteComment = PostsCenter.deleteComment;

        $scope.readMultiLine = function (text) {
            return text ? text.replace(/(?:\r\n|\r|\n)/g, '<br />') : text;
        };
        $scope.toAddNewPost = function () {
            $scope.metaData.newPostTitle = '';
            $scope.metaData.newPostBody = '';
            $scope.metaData.addingNewPost = true;
        };
        $scope.addNewPost = function () {
            PostsCenter.addNewPost($scope.metaData.newPostTitle, $scope.metaData.newPostBody);
            $scope.metaData.addingNewPost = false;
        };
        $scope.readMore = function (i) {
            $scope.posts[i].expanded = !$scope.posts[i].expanded;
            if ($scope.posts[i].expanded) {
                PostsCenter.readPostContent(i);
                PostsCenter.readPostComments($scope.posts[i].post_id);
            }
        };
        $scope.expandMore = function (i) {
            $scope.posts[i].expanded = true;
            PostsCenter.readPostContent(i);
            PostsCenter.readPostComments($scope.posts[i].post_id);
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
    .factory('UserInfo', ['$http', function ($http) {
        var uiInstance = {};

        uiInstance.metaData = {
            panelState: 'none'
        };
        uiInstance.user = {
            permission: 'guest',
            userId: -1,
            username: '',
            nickname: ''
        };

        uiInstance.login = function (un, pw) {
            $http.post('/api/login', { username: un, password: pw }).then(function (response) {
                if (response.data.error.code == 0) {
                    uiInstance.user.permission = response.data.data.permission;
                    uiInstance.user.userId  =response.data.data.user_id;
                    uiInstance.user.username = response.data.data.username;
                    uiInstance.user.nickname = response.data.data.nickname;
                }
            });
        };
        uiInstance.autoLogin = function () {
            uiInstance.login('', '');
        };
        uiInstance.register = function (un, pw, nn) {
            $http.post('/api/register', { username: un, password: pw, nickname: nn }).then(function (response) {
                if (response.data.error.code == 0) {
                    uiInstance.user.permission = response.data.data.permission;
                    uiInstance.user.userId  =response.data.data.user_id;
                    uiInstance.user.username = response.data.data.username;
                    uiInstance.user.nickname = response.data.data.nickname;
                }
            });
        };
        uiInstance.logout = function () {
            $http.post('/api/logout', {}).then(function (response) {
                if (response.data.error.code == 0) {
                    uiInstance.user.permission = 'guest';
                    uiInstance.user.userId = -1;
                    uiInstance.user.username = '';
                    uiInstance.user.nickname = '';
                }
            })
        };

        return uiInstance;
    }])
    .factory('PostsCenter', ['$http', function ($http) {
        var pcInstance = {};

        pcInstance.posts = [];
        pcInstance.metaData = {};
        pcInstance.metaData.editingIndex = -1;
        pcInstance.metaData.addingNewPost = false;
        pcInstance.metaData.newPostTitle = '';
        pcInstance.metaData.newPostBody = '';
        pcInstance.metaData.editingCommentIndex = -1;

        pcInstance.addNewPost = function (title, content) {
            $http.post('/api/post', { title: title, content: content }).then(function (response) {
                pcInstance.getAllPosts();
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
                    pcInstance.posts[i].content = '';
                    pcInstance.posts[i].comments = [];
                }
            });
        };
        pcInstance.readPostContent = function (i) {
            $http.get('/api/post/' + pcInstance.posts[i].post_id).then(function (response) {
                if (response.data.error.code == 0) {
                    pcInstance.posts[i].content = response.data.data.content;
                }
            })
        };
        pcInstance.readPostComments = function (pid) {
            $http.get('/api/comments?post_id=' + pid).then(function (response) {
                for (var i = 0; i < pcInstance.posts.length; ++i) {
                    if (pcInstance.posts[i].post_id == pid) {
                        while (pcInstance.posts[i].comments.length > 0) {
                            pcInstance.posts[i].comments.pop();
                        }
                        for (var j = 0; j < response.data.data.length; ++j) {
                            pcInstance.posts[i].comments.push(response.data.data[j]);
                        }
                    }
                }
            });
        };
        pcInstance.updatePost = function (i, nt, nc) {
            $http.put('/api/post/' + pcInstance.posts[i].post_id, { title: nt, content: nc }).then(function (response) {
                if (response.data.error.code == 0) {
                    pcInstance.getAllPosts();
                }
            });
        };
        pcInstance.blockPost = function (i, b) {
            $http.put('/api/post/' + pcInstance.posts[i].post_id, { blocked: b }).then(function (response) {
                if (response.data.error.code == 0) {
                    pcInstance.getAllPosts();
                }
            });
        };
        pcInstance.deletePost = function (i) {
            $http.delete('/api/post/' + pcInstance.posts[i].post_id).then(function (response) {
                if (response.data.error.code == 0) {
                    pcInstance.getAllPosts();
                }
            })
        };
        pcInstance.addNewComment = function (pid, author, author_id, content) {
            $http.post('/api/comments', { post_id: pid, author: author, author_id: author_id, content: content }).then(function (response) {
                if (response.data.error.code == 0) {
                    pcInstance.readPostComments(pid);
                }
            });
        };
        pcInstance.updateComment = function (pid, cid, content) {
            $http.put('/api/comments/' + cid, { content: content }).then(function (response) {
                if (response.data.error.code == 0) {
                    pcInstance.readPostComments(pid);
                }
            });
        };
        pcInstance.blockComment = function (pid, cid, b) {
            $http.put('/api/comments/' + cid, { blocked: b }).then(function (response) {
                if (response.data.error.code == 0) {
                    pcInstance.readPostComments(pid);
                }
            });
        };
        pcInstance.deleteComment = function (pid, cid) {
            $http.delete('/api/comments/' + cid).then(function (response) {
                if (response.data.error.code == 0) {
                    pcInstance.readPostComments(pid);
                }
            });
        };

        return pcInstance;
    }]);