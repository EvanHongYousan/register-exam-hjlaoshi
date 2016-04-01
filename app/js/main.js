/**
 * Created by yantianyu on 2016/3/1.
 */

var app = angular.module('app', ['ngRoute', 'ngAnimate', 'ngTouch']);
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
        .when('/question/:questionId', {
            templateUrl: './views/question.html',
            controller: 'questionController'
        })
        .when('/result', {
            templateUrl: './views/result.html',
            controller: 'resultController'
        })
        .when('/submit', {
            templateUrl: './views/submitPage.html',
            controller: 'submitController'
        })

        .otherwise('/home');

});
app.service('questionService', function () {
    this.data = [];
});
app.service('userSelections', function () {
    this.data = [];
});
app.factory('resultCollection', function (questionService, userSelections) {
    var answerArray = ['A', "B", "C", "D", "E", "F", "G"];
    var answerCount = [], i = 0, rightAnswerCount = 0;
    var isQualified = null, testScores = 0;

    function calculate() {
        for (i = 0; i < questionService.data.length; i++) {
            if (answerArray[userSelections.data[i]] == questionService.data[i]["right_answer"]) {
                answerCount[i] = true;
                rightAnswerCount++;
            } else {
                answerCount[i] = false;
            }
        }
        testScores = parseInt(100 * rightAnswerCount / questionService.data.length);

        isQualified = !(testScores < 80);
    }

    function reset() {
        userSelections.data = [];
        answerCount = [];
        rightAnswerCount = 0;
        isQualified = null;
        testScores = 0;
    }

    function getQualified() {
        if (isQualified == null) {
            calculate();
        }
        return isQualified;
    }

    function getTestScores() {
        if (testScores == 0) {
            calculate();
        }
        return testScores;
    }

    function getAnswerCount() {
        if (answerCount == []) {
            calculate();
        }
        return answerCount;
    }

    return {
        reset: reset,
        getQualified: getQualified,
        getTestScores: getTestScores,
        getAnswerCount: getAnswerCount
    }
});
app.controller('mainController', function ($scope, $rootScope, $location) {
    JSNativeBridge.send('js_msg_close_page_confirm_alert', {
        'is_active_confirm_alert': false,
        'alert_content_text': '',
        'alert_ok_btn_text': '',
        'alert_cancel_btn_text': ''
    });
    $rootScope.isResultPage = true;
    $scope.beginTest = function () {
        $location.path('question/1');
    };
});
app.controller('aboutController', function ($scope) {
    $scope.pageClass = 'page-about';
});
app.controller('contactController', function ($scope) {
    $scope.pageClass = 'page-contact';
});
app.controller('questionController', function ($scope, $http, $routeParams, $rootScope, questionService, userSelections, $location, $timeout) {
    JSNativeBridge.send('js_msg_close_page_confirm_alert', {
        'is_active_confirm_alert': true,
        'alert_content_text': '确定退出测试吗？',
        'alert_ok_btn_text': '退出',
        'alert_cancel_btn_text': '继续作答'
    });
    $rootScope.activeIndex = $routeParams.questionId;
    $rootScope.isResultPage = false;
    $scope.question = questionService.data[$routeParams.questionId - 1];
    $scope.questions = questionService;
    $scope.selectedIndex = userSelections.data[$routeParams.questionId - 1];
    $scope.toggle = function (index) {
        userSelections.data[$routeParams.questionId - 1] = index;
        $scope.selectedIndex = index;

        if ($rootScope.activeIndex < questionService.data.length) {
            $rootScope.slideMode = 'slide-left';
            $timeout(function () {
                $location.path('question/' + (parseInt($rootScope.activeIndex) + 1));
            }, 1000);
        } else {
            $rootScope.isResultPage = true;
            $location.path('submit');
        }
    };
    $scope.swipeLeft = function (e) {
        if ($rootScope.activeIndex == questionService.data.length) {
            return;
        }
        $rootScope.slideMode = 'slide-left';
        $timeout(function () {
            $location.path('question/' + (parseInt($rootScope.activeIndex) + 1));
        }, 10);
    };
    $scope.swipeRight = function (e) {
        if ($rootScope.activeIndex == 1) {
            return;
        }
        $rootScope.slideMode = 'slide-right';
        $timeout(function () {
            $location.path('question/' + (parseInt($rootScope.activeIndex) - 1));
        }, 10);
    };
});

app.controller('submitController', function ($scope, questionService, userSelections, $location, $http, resultCollection) {

    JSNativeBridge.send('js_msg_close_page_confirm_alert', {
        'is_active_confirm_alert': true,
        'alert_content_text': '确定退出测试吗？',
        'alert_ok_btn_text': '退出',
        'alert_cancel_btn_text': '继续作答'
    });
    var isFinished = true, i = 0;
    $scope.questions = questionService;
    $scope.userSelections = userSelections.data;
    if ($scope.questions.data.length != $scope.userSelections.length) {
        isFinished = false;
    } else {
        for (i = 0; i < $scope.userSelections.length; i++) {
            if ($scope.userSelections[i] == undefined) {
                isFinished = false;
            }
        }
    }
    $scope.isFinished = isFinished;
    $scope.submit = function () {

        var user_id = null, domainName = 'http://guanli.hjlaoshi.com';

        function getReqPrm(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) {
                return unescape(r[2]);
            } else {
                return null;
            }
        }

        try {
            user_id = getReqPrm('parameter') ? JSON.parse(decodeURIComponent(getReqPrm('parameter'))).user_id : null;
        } catch (e) {
            console.log(e);
        }
        if (user_id === null) {
            user_id = '15800031138@xmpp.hjlaoshi.com';
        } else {
            user_id = user_id.split('@')[0];
        }

        if (/test\./.test(location.href)) {
            domainName = 'http://test.hjlaoshi.com';
        } else if (/\.233|\.231/.test(location.href)) {
            domainName = 'http://192.168.0.231';
        } else if (/guanli\./.test(location.href)) {
            domainName = 'http://guanli.hjlaoshi.com';
        }

        console.log('domainName:' + domainName);
        $http({
            method: 'JSONP',
            url: domainName + '/app/spread/activity?buss_id=written&u=' + user_id + '&s=' + resultCollection.getTestScores() + '&callback=JSON_CALLBACK'
        }).then(function (data) {
            console.log(data.data);
            if (data.status == 200) {
                JSNativeBridge.send('js_msg_pretest_result',{'isQualified':resultCollection.getTestScores()>79});
                $location.path('result').replace();
            } else {
                alert('提交失败');
            }
        });
    };
});

app.controller('resultController', function ($scope, $rootScope, questionService, userSelections, $location, resultCollection) {
    JSNativeBridge.send('js_msg_close_page_confirm_alert', {
        'is_active_confirm_alert': false,
        'alert_content_text': '',
        'alert_ok_btn_text': '',
        'alert_cancel_btn_text': ''
    });
    $rootScope.isResultPage = true;
    $scope.questions = questionService.data;
    $scope.userSelections = userSelections.data;
    $scope.isQualified = resultCollection.getQualified();
    $scope.testScores = resultCollection.getTestScores();
    $scope.answerCount = resultCollection.getAnswerCount();
    $scope.retest = function () {
        resultCollection.reset();
        $location.path('home');
    };
    $scope.over = function () {
        JSNativeBridge.send('js_msg_close_page', '');
    };
});

app.controller('navbarController', function ($scope, questionService, $location, $rootScope, userSelections, $timeout) {
    $scope.hover = '';
    $scope.questions = questionService;
    $scope.userSelections = userSelections.data;
    $rootScope.slideMode = 'slide-left';
    $scope.toggleSerialCard = function () {
        if ($scope.hover == '') {
            $scope.hover = 'hover';
        }
        else {
            $scope.hover = '';
        }
    };
    $scope.clearHover = function () {
        $scope.hover = '';
    };
    $scope.preQue = function () {
        $rootScope.slideMode = 'slide-right';
        $timeout(function () {
            $location.path('question/' + ($rootScope.activeIndex - 1));
        }, 10);
    };
    $scope.nextQue = function () {
        $rootScope.slideMode = 'slide-left';
        $timeout(function () {
            $location.path('question/' + (parseInt($rootScope.activeIndex) + 1));
        }, 10);
    };
    $scope.submit = function () {
        $rootScope.isResultPage = true;
        $scope.hover = '';
        $location.path('submit');
    };
});

app.run(function ($http, questionService, $rootScope) {
    $http({
        method: 'GET',
        url: './data/que_data.json'
    }).then(function (resp) {
        questionService.data = resp.data;
    });
    $rootScope.isResultPage = true;
    JSNativeBridge.init();
});