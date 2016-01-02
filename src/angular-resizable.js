angular.module('angularResizable', [])
  .directive('resizable', function ($document, $timeout, $window) {
      var toCall;

      function throttle(fun) {
          if (!toCall) {
              toCall = fun;
              $timeout(function () {
                  toCall();
                  toCall = null;
              }, 100);
          } else {
              toCall = fun;
          }
      }


      return {
          restrict: 'A',
          scope: {
              rDirections: '=',
              rGrabber   : '@'
          },
          link: function ($scope, $element) {
              $element.addClass('resizable');

              var style = $window.getComputedStyle($element[0], null);
              var size;
              var axis;
              var start;
              var dir;
              var info = {};

              var updateInfo = function () {
                  var parameter = axis === 'x' ? 'width' : 'height';

                  info.width  = false;
                  info.height = false;
                  info.id     = $element[0].id;
                  info[parameter] = parseInt($element[0].style[parameter], 10);
              };

              var createGrabbers = function () {
                  var inner = $scope.rGrabber || '<span></span>';

                  $scope.rDirections.forEach(function (direction) {
                      var grabber = $document[0].createElement('div');

                      // add class for styling purposes
                      grabber.setAttribute('class', 'rg-' + direction);
                      grabber.innerHTML = inner;
                      $element[0].appendChild(grabber);

                      grabber.ondragstart = function () { return false; };
                      grabber.addEventListener('mousedown', dragStart.bind(null, direction), false);
                  });
              };


              var dragging = function (event) {
                  var offset = start - (axis === 'x' ? event.clientX : event.clientY);
                  $element[0].style[axis === 'x' ? 'width' : 'height'] = size + offset * dir + 'px';

                  updateInfo();
                  throttle(function () {
                      $scope.$emit('angular-resizable.resizing', info);
                  });
              };

              var dragEnd = function () {
                  updateInfo();
                  $scope.$emit('angular-resizable.resizeEnd', info);
                  $scope.$apply();

                  $document[0].removeEventListener('mouseup', dragEnd, false);
                  $document[0].removeEventListener('mousemove', dragging, false);

                  $element.removeClass('no-transition');
              };


              var dragStart = function (direction, event) {
                  axis  = direction === 'left'   || direction === 'right' ? 'x' : 'y';
                  dir   = direction === 'bottom' || direction === 'right' ? -1 : 1;

                  start = axis === 'x' ? event.clientX : event.clientY;
                  size  = parseInt(style.getPropertyValue(axis === 'x' ? 'width' : 'height'), 10);

                  //prevent transition while dragging
                  $element.addClass('no-transition');

                  $document[0].addEventListener('mouseup', dragEnd, false);
                  $document[0].addEventListener('mousemove', dragging, false);

                  // Disable highlighting while dragging
                  if (event.stopPropagation) { event.stopPropagation(); }
                  if (event.preventDefault) { event.preventDefault(); }
                  event.cancelBubble = true;
                  event.returnValue = false;

                  updateInfo();
                  $scope.$emit('angular-resizable.resizeStart', info);
                  $scope.$apply();
              };

              createGrabbers();
          }
      };
  });
