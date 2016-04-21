angular.module('starter.controllers')
//HTTP FACTORY FOR BASIC CARD LOGIN WITH IONIC+ANGULAR
.factory('cardLogin',['$http', '$ionicPopup', "$q", function($http, $ionicPopup) {

    return ({
                getAuthString: getAuthString,
                authorize: authorize
    });
   
    function getAuthString (URI) {

        var appId = 'xyz';
        var method = 'GET'


        // Get the current time as Unix time
        var currentUnixTime = Math.round((new Date()).getTime() / 1000);

        var nonce = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < 20; i++) {

            nonce += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        var encodedUri = encodeURIComponent(URI).toLowerCase();


        var rawSignatureData = appId + method + encodedUri + currentUnixTime + nonce;
        var hash = CryptoJS.HmacSHA256(rawSignatureData, 'xyz', { asBytes: true });
        var sig = CryptoJS.enc.Base64.stringify(hash);
        return appId + ':' + sig + ':' + nonce + ':' + currentUnixTime;
       
    };
 
    function authorize (name, serial) {

       if(name === undefined || serial === undefined) {
              $ionicPopup.show({
              template: "<p>Please enter your name and card serial number<p/>",
              title: 'Error',      
              buttons: [
               { text: 'Try again' },
   
              ]
            }); 
       }
        var name = name.replace(" ", "");

        var requestURI = 'https://xyz.com/api/card=' + serial+ '&name=' + name;
        return $http({
            url: requestURI,
            method: "GET",                            
            headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Authorization': "amx " + getAuthString(requestURI)
            }

        })
        .then(function(res) {
            return res.data.accountToken;
            console.log("SUCCESS") ;
        },
        function(data, $scope) {
            $ionicPopup.show({
              template: "<p>The name or the serial number is incorrect<p/>",
              title: 'Error',
              scope: $scope,
              buttons: [
               { text: 'Please try again' },
              ]
            });
        }
        );
    }
    return;

}])