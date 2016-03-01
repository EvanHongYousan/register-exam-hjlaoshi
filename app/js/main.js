/**
 * Created by yantianyu on 2016/3/1.
 */

var app = angular.module('app', ['ngRoute', 'ngAnimate']);
app.config(function ($routeProvider) {
    $routeProvider
        .when('/home', {
            templateUrl: './views/page-home.html',
            controller: 'mainController'
        })
        .when('/about', {
            templateUrl: './views/page-about.html',
            controller: 'aboutController'
        })
        .when('/contact', {
            templateUrl: './views/page-contact.html',
            controller: 'contactController'
        })
        .when('/question/:questionId',{
            templateUrl:'./views/question.html',
            controller:'questionController'
        })

        //.otherwise('/home');

});
app.service('questionService',function(){
    this.data = [];
});
app.controller('mainController', function ($scope) {
    $scope.pageClass = 'page-home';
});
app.controller('aboutController', function ($scope) {
    $scope.pageClass = 'page-about';
});
app.controller('contactController', function ($scope) {
    $scope.pageClass = 'page-contact';
});
app.controller('questionController',function($scope, $http, $routeParams, $rootScope, questionService){
    $rootScope.activeIndex = $routeParams.questionId;
    $scope.question = questionService.data[$routeParams.questionId-1];
    $scope.toggle = function(){};
});

app.controller('navbarController',function($scope, questionService, $location,$rootScope){
    $scope.hover = '';
    $scope.questions = questionService;
    $scope.toggleSerialCard = function(){
        if($scope.hover == ''){
            $scope.hover = 'hover';
        }
        else{
            $scope.hover = '';
        }
    };
    $scope.clearHover = function(){
        $scope.hover = '';
    };
    $scope.preQue = function(){
        $location.path('question/'+($rootScope.activeIndex-1));
    };
    $scope.nextQue = function(){
        $location.path('question/'+(parseInt($rootScope.activeIndex)+1));
    };
});

app.run(function($http,questionService){
    $http({
        method:'GET',
        url:'/data/test_data.json'
    }).then(function(resp){
        questionService.data = resp.data;
    });
});