//Define app
var statApp = angular.module('statApp', ["firebase"]);

//Define Database (firebase)
statApp.config(function(){
  var config = {
    apiKey: "XXXX",
    authDomain: "XXXX.firebaseapp.com",
    databaseURL: "https://XXXX.firebaseio.com"
  };
  firebase.initializeApp(config);
});

statApp.controller("StatCtrl", ["$scope", "$firebaseObject",
  function($scope, $firebaseObject) {
     ref = firebase.database().ref();
     obj = $firebaseObject(ref);
     $scope.data = obj;
     //console.log($scope.data);

     //Functions to Update Player
     $scope.activePlayer = "";
     $scope.openEditPlayer = function(player){
       $scope.activePlayer = player;
       $("#openEditPlayer").modal('show');
     };
     $scope.savePlayer = function(player){
       if(player["id"] === "" || !player["id"]){ player["id"] = firebase.database().ref().child('players').push().key; }
       if(player["name"] === "" || !player["name"]){
         var errorElm = $('body').find('#playerError');
         errorElm[0].innerHTML = 'Name Data is missing.';
         return false;
       }
       firebase.database().ref('/players/' + player["id"] + '/').set(player, function(error){
          if (error) {
           var errorElm = $('body').find('#playerError');
           errorElm[0].innerHTML = 'Invalid or Missing Form Data.';
           console.log(error);
          } else {
            // Data saved successfully!
            $('#playerError').html('');
            $("#openEditPlayer").modal('hide');
          }
       });
     };

     //Functions to Update Team
     $scope.activeTeam = "";
     $scope.openEditTeam = function(team){
       $scope.activeTeam = team;
       $("#openEditTeam").modal('show');
     };
     $scope.saveTeam = function(team){
       if(team["id"] === "" || !team["id"]){ team["id"] = firebase.database().ref().child('teams').push().key; }
       firebase.database().ref('/teams/' + team["id"] + '/').set(team, function(error){
          if (error) {
           console.log(error);
          } else {
            // Data saved successfully!
            $("#openEditTeam").modal('hide');
          }
       });
     };

     //Functions to Save New Player
     $scope.openNewPlayer = function(){
       $scope.activePlayer = "";
       $("#openEditPlayer").modal('show');
     };

     //Functions to Save New Team
     $scope.openNewTeam = function(){
       // Get a key for firebase
       var key = firebase.database().ref().child('teams').push().key;
       $scope.activeTeam = "";
       $("#openEditTeam").modal('show');
     };
  }
]);

statApp.filter('teamRender', function() {
  return function(input) {
    return obj.teams[input]["name"];
  };
});
