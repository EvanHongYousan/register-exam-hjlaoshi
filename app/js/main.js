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
        })
        .when('/result',{
            templateUrl:'./views/result.html',
            controller:'resultController'
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
app.controller('questionController',function($scope, $http, $routeParams, $rootScope, questionService, userSelections, $location){
    $rootScope.activeIndex = $routeParams.questionId;
    $rootScope.isResultPage = false;
    $scope.question = questionService.data[$routeParams.questionId-1];
    $scope.questions = questionService;
    $scope.selectedIndex = userSelections.data[$routeParams.questionId-1];
    $scope.toggle = function(index){
        userSelections.data[$routeParams.questionId-1] = index;
        $scope.selectedIndex = index;

        if($rootScope.activeIndex < questionService.data.length){
            $rootScope.slideMode = 'slide-left';
            $location.path('question/'+(parseInt($rootScope.activeIndex)+1));
        }
    };
    $scope.swipeLeft = function(e){
        if($rootScope.activeIndex == questionService.data.length){
            return;
        }
        $rootScope.slideMode = 'slide-left';
        $location.path('question/'+(parseInt($rootScope.activeIndex)+1));
    };
    $scope.swipeRight = function(e){
        if($rootScope.activeIndex == 1){
            return;
        }
        $rootScope.slideMode = 'slide-right';
        $location.path('question/'+(parseInt($rootScope.activeIndex)-1));
    };
    $scope.submit = function(){
        $location.path('result').replace();
    };
});

app.controller('resultController', function($scope, $rootScope ,questionService, userSelections){
    var answerArray = ['A',"B","C","D","E","F","G"];
    var answerCount = [],i = 0,rightAnswerCount = 0;
    $rootScope.isResultPage = true;
    $scope.questions = questionService.data;
    $scope.userSelections = userSelections.data;
    console.log($scope.questions);
    console.log($scope.userSelections);
    for( i = 0;i<$scope.questions.length;i++){
        if(answerArray[$scope.userSelections[i]] == $scope.questions[i]["right_answer"]){
            answerCount[i] = true;
            rightAnswerCount++;
        }else{
            answerCount[i] = false;
        }
    }
    $scope.testScores = parseInt(100 * rightAnswerCount / $scope.questions.length);
    $scope.answerCount = answerCount;
    console.log(answerCount);
});

app.controller('navbarController',function($scope, questionService, $location,$rootScope, userSelections){
    $scope.hover = '';
    $scope.questions = questionService;
    $scope.userSelections = userSelections.data;
    $rootScope.slideMode = 'slide-left';
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
        $rootScope.slideMode = 'slide-right';
        $location.path('question/'+($rootScope.activeIndex-1));
    };
    $scope.nextQue = function(){
        $rootScope.slideMode = 'slide-left';
        $location.path('question/'+(parseInt($rootScope.activeIndex)+1));
    };
});

app.run(function($http,questionService,$rootScope){
    $http({
        method:'GET',
        url:'./data/que_data.json'
    }).then(function(resp){
        questionService.data = resp.data;
    });
    $rootScope.isResultPage = false;
});