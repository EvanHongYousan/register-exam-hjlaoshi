/**
 * Created by yantianyu on 2016/3/1.
 */

var app = angular.module('app', ['ngRoute', 'ngAnimate','ngTouch']);
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
        });

        //.otherwise('/home');

});
app.service('questionService',function(){
    this.data = [];
});
app.service('userSelections',function(){
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
app.controller('questionController',function($scope, $http, $routeParams, $rootScope, questionService, userSelections){
    $rootScope.activeIndex = $routeParams.questionId;
    $scope.question = questionService.data[$routeParams.questionId-1];
    $scope.selectedIndex = userSelections.data[$routeParams.questionId];
    $scope.toggle = function(index){
        userSelections.data[$routeParams.questionId] = index;
        $scope.selectedIndex = index;
    };
    $scope.swipe = function(e){
        console.log(e);
    };
});

app.controller('navbarController',function($scope, questionService, $location,$rootScope, userSelections){
    $scope.hover = '';
    $scope.questions = questionService;
    $scope.userSelections = userSelections.data;
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
        url:'./data/test_data.json'
    }).then(function(resp){
        questionService.data = resp.data;
    });
});