'use strict';

angular.module('thePoppingDeadApp')
  .controller('MainCtrl', function ($scope, $http, socket, $interval) {
    $scope.awesomeThings = [];
    L.mapbox.accessToken = 'pk.eyJ1IjoiY3R3aGl0ZSIsImEiOiJRTHJWenVFIn0.CrPgidHVhZvg-DZ8CK_4zA';
    var map,
        playerStart,
        playerTrail,
        trailArray,
        player;

    map = L.mapbox.map('map', 'ctwhite.l7618poc', {
      zoomControl: false
    });


  playerStart = L.latLng(35.60281152073829, -82.56827473640442);
  player = L.marker(playerStart);

  trailArray = [playerStart];




 $scope.moveCounter = 0;
 $scope.bombCount = 3;
 function getRandomColor() {
   var letters = '0123456789ABCDEF'.split('');
   var color = '#';
   for (var i = 0; i < 6; i++ ) {
     color += letters[Math.floor(Math.random() * 16)];
   }
   return color;
 }

  $scope.checkKey = function (e) {
    console.log(e);
    e = e || window.event;
    e.preventDefault()
    switch (e.keyCode){
      case 38:
        //up
      case 40:
        //down
      case 37:
        //left
      case 39:
        //right
        player.setLatLng(map.getCenter());
        if (trailArray.length === 2 && $scope.moveCounter === 1) {
          playerTrail = L.polyline(trailArray, {
            color: getRandomColor(),
            dashArray: '3 10'
          }
        );
        playerTrail.addTo(map);
        }
        else if (trailArray.length > 2){
          playerTrail.addLatLng(map.getCenter());
        }
        else {
          trailArray.push(map.getCenter());
        }
          $scope.moveCounter++;
        break;
      case 32:
        if ($scope.bombCount){
          $scope.bombCount--;
          $scope.bomb;
          $scope.bombRadius = 5;
          $scope.bomb = L.circle(map.getCenter(), $scope.bombRadius, {
            color: getRandomColor()
          }).addTo(map);
          $interval(function(){
            if ($scope.bomb.getRadius() < 20) {
              $scope.bombRadius+= 5;
              $scope.bomb.setStyle(getRandomColor());
              $scope.bomb.setRadius($scope.bombRadius);
            }
            else {
              $scope.bombRadius = 5;
              $scope.bomb.setRadius(0);
              map.removeLayer($scope.bomb);

            }

          }, 75, 5);
        }

      default:

    }

  };

  player.addTo(map);

    $http.get('/api/things').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
      socket.syncUpdates('thing', $scope.awesomeThings);
    });

    $scope.addThing = function() {
      if($scope.newThing === '') {
        return;
      }
      $http.post('/api/things', { name: $scope.newThing });
      $scope.newThing = '';
    };

    $scope.deleteThing = function(thing) {
      $http.delete('/api/things/' + thing._id);
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('thing');
    });
  });
