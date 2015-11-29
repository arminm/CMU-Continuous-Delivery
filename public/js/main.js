var app = angular.module('myApp',['ui.router', 'ngMessages', 'ui.bootstrap', 'MainService', 'UserService', 'socketService', 'MessageService', 'StatusService', 'MaintenanceService', 'AdminService']);

app.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: 'partials/index.jade'
        })
        .state('lobby', {
            url: '/lobby',
            templateUrl: 'partials/lobby.jade'
        })
        .state('wall', {
            url: '/lobby/wall',
            templateUrl: 'partials/lobby-message.jade'
        })
        .state('announcements', {
            url: '/lobby/announcements',
            templateUrl: 'partials/lobby-announcements.jade'
        })
        .state('chat', {
            url: '/lobby/chatbuddies?username',
            templateUrl: 'partials/lobby-message.jade'
        })
        .state('maintenance', {
            url: '/maintenance',
            templateUrl: 'partials/performance.jade'
        })
        .state('administer', {
            url: '/lobby/administer',
            templateUrl: 'partials/administer.jade'
        })
});

app.directive('serverError', function (){ 
 return {
    scope: false,
    link: function(scope, elem, attr) {
        elem.bind('keyup', function () {
            scope.loginForm.$setValidity('server', true);
            scope.formError.generic = '';
            scope.$apply();
        });
    }
 };
});

app.directive('editError', function (){ 
 return {
    scope: false,
    link: function(scope, elem, attr) {
        elem.bind('keyup', function () {
            scope.editForm.$setValidity('server', true);
            scope.$apply();
        });
    }
 };
});

app.directive('reservedUsername', function (){ 
   return {
      require: '?ngModel',
      link: function(scope, elem, attr, ngModel) {
          var reservedUsernames = ['about', 'access', 'account', 'accounts', 'add', 'address', 'adm', 'admin', 'administration', 'adult', 'advertising', 'affiliate', 'affiliates', 'ajax', 'analytics', 'android', 'anon', 'anonymous', 'api', 'app', 'apps', 'archive', 'atom', 'auth', 'authentication', 'avatar', 'backup', 'banner', 'banners', 'bin', 'billing', 'blog', 'blogs', 'board', 'bot', 'bots', 'business', 'chat', 'cache', 'cadastro', 'calendar', 'campaign', 'careers', 'cgi', 'client', 'cliente', 'code', 'comercial', 'compare', 'config', 'connect', 'contact', 'contest', 'create', 'code', 'compras', 'css', 'dashboard', 'data', 'db', 'design', 'delete', 'demo', 'design', 'designer', 'dev', 'devel', 'dir', 'directory', 'doc', 'docs', 'domain', 'download', 'downloads', 'edit', 'editor', 'email', 'ecommerce', 'forum', 'forums', 'faq', 'favorite', 'feed', 'feedback', 'flog', 'follow', 'file', 'files', 'free', 'ftp', 'gadget', 'gadgets', 'games', 'guest', 'group', 'groups', 'help', 'home', 'homepage', 'host', 'hosting', 'hostname', 'html', 'http', 'httpd', 'https', 'hpg', 'info', 'information', 'image', 'img', 'images', 'imap', 'index', 'invite', 'intranet', 'indice', 'ipad', 'iphone', 'irc', 'java', 'javascript', 'job', 'jobs', 'js', 'knowledgebase', 'log', 'login', 'logs', 'logout', 'list', 'lists', 'mail', 'mail1', 'mail2', 'mail3', 'mail4', 'mail5', 'mailer', 'mailing', 'mx', 'manager', 'marketing', 'master', 'me', 'media', 'message', 'microblog', 'microblogs', 'mine', 'mp3', 'msg', 'msn', 'mysql', 'messenger', 'mob', 'mobile', 'movie', 'movies', 'music', 'musicas', 'my', 'name', 'named', 'net', 'network', 'new', 'news', 'newsletter', 'nick', 'nickname', 'notes', 'noticias', 'ns', 'ns1', 'ns2', 'ns3', 'ns4', 'old', 'online', 'operator', 'order', 'orders', 'page', 'pager', 'pages', 'panel', 'password', 'perl', 'pic', 'pics', 'photo', 'photos', 'photoalbum', 'php', 'plugin', 'plugins', 'pop', 'pop3', 'post', 'postmaster', 'postfix', 'posts', 'profile', 'project', 'projects', 'promo', 'pub', 'public', 'python', 'random', 'register', 'registration', 'root', 'ruby', 'rss', 'sale', 'sales', 'sample', 'samples', 'script', 'scripts', 'secure', 'send', 'service', 'shop', 'sql', 'signup', 'signin', 'search', 'security', 'settings', 'setting', 'setup', 'site', 'sites', 'sitemap', 'smtp', 'soporte', 'ssh', 'stage', 'staging', 'start', 'subscribe', 'subdomain', 'suporte', 'support', 'stat', 'static', 'stats', 'status', 'store', 'stores', 'system', 'tablet', 'tablets', 'tech', 'telnet', 'test', 'test1', 'test2', 'test3', 'teste', 'tests', 'theme', 'themes', 'tmp', 'todo', 'task', 'tasks', 'tools', 'tv', 'talk', 'update', 'upload', 'url', 'user', 'username', 'usuario', 'usage', 'vendas', 'video', 'videos', 'visitor', 'win', 'ww', 'www', 'www1', 'www2', 'www3', 'www4', 'www5', 'www6', 'www7', 'wwww', 'wws', 'wwws', 'web', 'webmail', 'website', 'websites', 'webmaster', 'workshop', 'xxx', 'xpg', 'you', 'yourname', 'yourusername', 'yoursite', 'yourdomain'];
          ngModel.$parsers.unshift(function (value) {
             ngModel.$setValidity('reservedUsername', reservedUsernames.indexOf(value) === -1);
             return value;
          });
      }
   };
});

app.directive('regExpRequire', function() {
    var regexp;
    return {
        restrict: "A",
        link: function(scope, elem, attrs) {
            regexp = eval(attrs.regExpRequire);
            var char;
            elem.on('keypress', function(event) {
                var key = event.which;
                // Do not prevent backspace or del
                if ((key != 8) && (key != 46)) {
                    char = String.fromCharCode(key)
                    if(!regexp.test(elem.val() + char)) {
                        event.preventDefault();
                    }
                }
            });
        }
    }
});

app.controller('mainController', function($scope, $rootScope, $location, $state, User, JoinCommunity, Socket, MessageFactory) {
    $scope.logout = function () {
        // When the user opts to logout, take them to home page and clear user data regardless the call's status
        JoinCommunity.logout(User.getUsername())
        .success(function(data, status, headers, config) {  
        })
        .error(function(data, status, headers, config) {
        });
        $location.path('/');
        User.reset();
        Socket.removeAllListeners('CHAT');
        Socket.removeAllListeners('ANNOUNCEMENTS');
        Socket.removeAllListeners('WALL');
    };

    $scope.disburseSocketMessage = function(data, type, access_key) {
        console.log('message: ' + JSON.stringify(data));
        if ((User.getUsername().length > 0) && (data.action === 'created')) {
            MessageFactory.get(data.id, access_key)
            .success(function(message, status, headers, config) {
                $scope.$broadcast('new message', message, type);
            })
            .error(function(data, status, headers, config) {
                // Cannot do anything here 
            });
        }
    };
    $scope.initializeSockets = function() {
        Socket.on('ANNOUNCEMENTS', function(data) {
            $scope.disburseSocketMessage(data, 'ANNOUNCEMENTS', User.getUsername());
        });

        Socket.on('WALL', function(data) {
            $scope.disburseSocketMessage(data, 'WALL', User.getUsername());
        });

        Socket.on('CHAT', function(data) {
            if ((User.getUsername().length > 0) && ($state.$current.url.sourcePath != '/lobby/chatbuddies')) { // If the user is logged in or the user state is present
                if (data.sender !== User.getUsername()) {
                    if (confirm("You have a new message from "+ data.sender + ". Go to chat?") == true) {
                        $state.go('chat',{ username: data.sender });
                    }
                }
            } else {
                $scope.disburseSocketMessage(data, 'CHAT', User.getUsername());
            }
        });
    };
});

function scrollToBottom(animated, id) {
    if ($(id)[0] != undefined) {  
        if (animated) {
            $(id).animate({ scrollTop: $(id)[0].scrollHeight}, 1000);
        } else {
            $(id).scrollTop($(id)[0].scrollHeight);
        }
    }
}
