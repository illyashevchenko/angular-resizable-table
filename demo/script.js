angular.module('myApp', ['angularResizable'])
  .controller('TestController', function ($scope) {
    $scope.dynamicSize = {
      width : 350,
      height : 250
    };

    $scope.size = {};
    $scope.msg = 'Resize me.';

    $scope.events = [];
    $scope.$on("angular-resizable.resizeEnd", function (event, args) {
      $scope.msg = 'Resize me again.';
      $scope.events.unshift(event);
      $scope.size = args;
      if(args.width)
        $scope.dynamicSize.width = args.width;
      if(args.height)
        $scope.dynamicSize.height = args.height;
    });
    $scope.$on("angular-resizable.resizeStart", function (event, args) {
      $scope.msg = 'Woooohoooo!';
      $scope.events.unshift(event);
    });
  });
