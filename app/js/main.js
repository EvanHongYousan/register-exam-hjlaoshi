/**
 * Created by yantianyu on 2016/3/1.
 */

// define our application and pull in ngRoute and ngAnimate
var animateApp = angular.module('animateApp', ['ngRoute', 'ngAnimate']);

// ROUTING ===============================================
// set our routing for this application
// each route will pull in a different controller
animateApp.config(function ($routeProvider) {

    $routeProvider

        // home page
        .when('/home', {
            templateUrl: './views/page-home.html',
            controller: 'mainController'
        })

        // about page
        .when('/about', {
            templateUrl: './views/page-about.html',
            controller: 'aboutController'
        })

        // contact page
        .when('/contact', {
            templateUrl: './views/page-contact.html',
            controller: 'contactController'
        })

        .otherwise('/home');

});


// CONTROLLERS ============================================
// home page controller
animateApp.controller('mainController', function ($scope) {
    $scope.pageClass = 'page-home';
});

// about page controller
animateApp.controller('aboutController', function ($scope) {
    $scope.pageClass = 'page-about';
});

// contact page controller
animateApp.controller('contactController', function ($scope) {
    $scope.pageClass = 'page-contact';
});