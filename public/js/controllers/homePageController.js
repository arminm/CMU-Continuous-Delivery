angular.module('myApp')
  .directive('reservedUsername', function (){ 
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
  })
  .directive('passwordEquality', function (){ 
   return {
      require: '?ngModel',
      link: function(scope, elem, attr, ngModel) {
          ngModel.$parsers.unshift(function (input1) {
             var input2 = attr.firstPassword;
             ngModel.$setValidity('passwordEquality', input1 === input2);
             return input1;
          });
      }
   };
  })
  .controller('homePageController', function($scope, $state, $location, JoinCommunity, User, Socket) {
    $scope.formData = {
      isRegistration: '',
      username: '',
      password: '',
      confirmPassword: '',
      fullName: ''
    };
    $scope.formError = {
      username: '',
      password: '',
      generic: ''
    };
    $scope.register = function () {
      if ($scope.formData.isRegistration) {
        // Call factory
        if ($scope.loginForm.$valid && ($scope.formData.passwordConfirm.length > 0)) {
          var registerData = {
            password: $scope.formData.password,
            fullName: $scope.formData.fullName,
            createdAt: Date.now()
          };
          JoinCommunity.register($scope.formData.username, registerData)
            .success(function(data, status, headers, config) {
              if (status == '201') {
                User.setFirstTimeUser((status == '201'));
                User.setUsername($scope.formData.username);
                User.setLastStatusUpdated(Date.now());
                User.setStatus('OK');
                Socket.emit('join', $scope.formData.username);
              } else {
                User.setUsername(data.username);
                User.setLastStatusUpdated(data.statusUpdatedAt);
                User.setStatus(data.statusCode);
                // Join a private room
                Socket.emit('join', data.username);
              }
              $location.path('/lobby');
            })
            .error(function(data, status, headers, config) {
              if (status == '401') {
                $scope.formError.username = "Please enter a different username";
                $scope.loginForm.username.$setValidity('server', false);
              } else {
                $scope.formError.generic = "Something went wrong. Please try again.";
                $scope.loginForm.$setValidity('server', false);
              }
            });
        }
      } else {
        $scope.formData.isRegistration = true;
      }
    };
    $scope.login = function () {
      $scope.formData.isRegistration = false;
      // Call factory
      if ($scope.loginForm.$valid) {
        var loginData = {
          password: $scope.formData.password,
          lastLoginAt: Date.now()
        };
        JoinCommunity.login($scope.formData.username, loginData)
          .success(function(data, status, headers, config) {
            // Join a private room
            Socket.emit('join', data.username);
            User.setUsername(data.username);
            User.setLastStatusUpdated(data.statusUpdatedAt);
            User.setStatus(data.statusCode);
            // Go to next page
            $location.path('/lobby');
          })
          .error(function(data, status, headers, config) {
              if (status == '401') {
                $scope.formError.password = "Your password is wrong";
                $scope.loginForm.password.$setValidity('server', false);
              } else if (status == '404') {
                $scope.formError.generic = "User not found.";
                $scope.loginForm.$setValidity('server', false);
              } else {
                $scope.formError.generic = "Something went wrong. Please try again.";
                $scope.loginForm.$setValidity('server', false);
              }
          });
      }

    };
  });

