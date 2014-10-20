var app = angular.module('myApp', []);
var apiKey = 'MDE3MDc1OTY3MDE0MTM0MTUzMzI4NjVmYw001'
var nprUrl = 'http://api.npr.org/query?id=61&fields=relatedLink,title,byline,text,audio,image,pullQuote,all&output=JSON';

app.directive('nprLink', function() {
    return {
        restrict: 'EA',
        require: ['^ngModel'],
        replace: true,
        scope: {
            ngModel: '=',
            play: '&'
        },
        templateURL: '/views/nprListItem.html',
        link: function(scope, ele, attr) {
            scope.duration = scope.ngModel.audio[0],duration.$text;
        }
    }
});

app.controller('PlayerController', ['$scope', function($scope, $http) {
    $scope.playing = false;
    var audio = document.createElement('audio');
    $scope.audio = audio;
 //   $scope.audio.src = '/media/npr.mp4';

    $scope.play = function() {
        $scope.audio.play();
        $scope.playing = true;
    };

    $scope.stop = function() {
        $scope.audio.pause();
        $scope.playing = false;
    };

    $scope.audio.addEventListener('ended', function() {
        $scope.$apply(function() {
            $scope.stop()
        });

    $http({
        method: 'JSONP',
        url: nprUrl + '&apiKey=' + apiKey + '&callback=JSON_CALLBACK'
      }).success(function(data, status) {
        // Now we have a list of the stories (data.list.story)
        // in the data object that the NPR API
        // returns in JSON that looks like:
        // data: { "list": {
        //   "title": ...
        //   "story": [
        //     { "id": ...
        //       "title": ...
        // Store the list of stories on the scope
        // from the NPR API response object (described above)
        $scope.programs = data.list.story;

      }).error(function(data, status) {
        // Some error occurred
      });

    });

    // format.mp4.$text is the route to the mpf file from the NPR api
    $scope.play = function(program) {
        if ($scope.playing) $scope.audio.pause();
        var url = program.audio[0].format.mp4.$text;
        audio.src = url;
        audio.play();
        // Store the state of the player as playing
        $scope.playing = true;
    }

}]);  // PlayerController

app.controller('RelatedController', ['$scope', function($scope) {
}]);

// Parent scope
app.controller('FrameController', function($scope) {
});
