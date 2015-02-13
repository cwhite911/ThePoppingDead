'use strict';

angular.module('thePoppingDeadApp')
  .controller('MainCtrl', function ($scope, $http, socket) {
    $scope.awesomeThings = [];
    L.mapbox.accessToken = 'pk.eyJ1IjoiY3R3aGl0ZSIsImEiOiJRTHJWenVFIn0.CrPgidHVhZvg-DZ8CK_4zA';
    var map = L.mapbox.map('map', 'ctwhite.l7618poc', {
      zoomControl: false
    });
    $scope.newPlayer = function (){
      var data = {
        "type": "FeatureCollection",
        "features": [
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "Point",
          "coordinates": [
          -82.56827473640442,
          35.60281152073829
          ]
        }
      }
      ]
    };
    L.geoJson(data, {
      onEachFeature: function (feature, layer) {
        console.log(layer.getLatLng())
        // map.panTo(layer.getLatLng());

      }
    }).addTo(map);
    // map.fitBounds([
    //   [35.60300779515903, -82.56853491067886],
    //   [35.602637054182395, -82.56800919771193]
    //   ]);
  }();



  $scope.checkKey = function (e) {
    console.log(e);
    e = e || window.event;

    if (e.keyCode === 38) {
      // up arrow
      e.preventDefault()
      console.log('up')
    }
    else if (e.keyCode === 40) {
      // down arrow
      e.preventDefault()
      console.log('down')
    }
    else if (e.keyCode === 37) {
      // left arrow
      e.preventDefault()
      console.log('left')
    }
    else if (e.keyCode === 39) {
      // right arrow
      e.preventDefault()
      console.log('right')
    }

  }

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
