/**
 * Created by yantianyu on 2016/3/1.
 */
var app = angular.module('app', ['ngRoute', 'ngAnimate', 'ngTouch']);
app.config(function ($routeProvider) {
    $routeProvider
        .when('/home', {
            template: "<!-- page-home.html -->\r\n<section class=\"homePage\">\r\n    <p>欢迎参加上岗笔试。</p>\r\n\r\n    <p>上岗笔试将考查您对《上岗须知》的了解程度，笔试合格后，可立即开始接单辅导。</p>\r\n\r\n    <p>如果还未阅读《上岗须知》，请先退出笔试，仔细阅读后再开始答题。</p>\r\n\r\n    <p>本测试共20题，每题5分，80分视为合格，答题不限时。</p>\r\n\r\n    <span ng-click=\"beginTest()\">开始答题</span>\r\n</section>",
            controller: 'mainController'
        })
        .when('/about', {
            template: "<!-- page-about.html -->\r\n<h1>Animating Pages Is Fun</h1>\r\n<h2>About</h2>\r\n\r\n<a href=\"#home\" class=\"btn btn-primary btn-lg\">Home</a>\r\n<a href=\"#contact\" class=\"btn btn-danger btn-lg\">Contact</a>",
            controller: 'aboutController'
        })
        .when('/contact', {
            template: "<!-- page-about.html -->\r\n<h1>Animating Pages Is Fun</h1>\r\n<h2>About</h2>\r\n\r\n<a href=\"#home\" class=\"btn btn-primary btn-lg\">Home</a>\r\n<a href=\"#contact\" class=\"btn btn-danger btn-lg\">Contact</a>",
            controller: 'contactController'
        })
        .when('/question/:questionId', {
            template: "<section id=\"page\">\r\n    <section id=\"content\">\r\n        <div class=\"question\">\r\n            <div>\r\n                <p ng-repeat=\"text in question.question_text\">{{text}}</p>\r\n            </div>\r\n        </div>\r\n        <!---\r\n        <section class=\"line\"></section>\r\n        --->\r\n        <div class=\"answer\">\r\n            <ul>\r\n                <li class=\"right\" ng-repeat=\"(key,option) in question.options\" ng-click=\"toggle($index)\">\r\n                    <div class=\"contentInner\">\r\n                        <span><a ng-class=\"{active:$index===selectedIndex}\">{{key}}</a> {{option}}</span>\r\n                    </div>\r\n                </li>\r\n            </ul>\r\n        </div>\r\n    </section>\r\n</section>",
            controller: 'questionController'
        })
        .when('/result', {
            template: "<section class=\"resultPage\">\r\n    <h1>{{testScores}}\r\n        <small>分</small>\r\n    </h1>\r\n    <p class=\"p1\" ng-if=\"isQualified\">恭喜你，笔试合格！</p>\r\n\r\n    <p class=\"p1\" ng-if=\"!isQualified\">呃...未通过，请再考一次</p>\r\n\r\n    <p class=\"p2\" ng-if=\"isQualified\">快上线答疑吧</p>\r\n\r\n    <p class=\"p2\" ng-if=\"!isQualified\">答案在&lt;上岗须知&gt;里，请仔细阅读哦~</p>\r\n\r\n    <div class=\"circleContainer\">\r\n        <span ng-repeat=\"item in questions\"\r\n              ng-class=\"{selectright:answerCount[$index],selectwrong:!answerCount[$index]}\">{{$index+1}}</span>\r\n    </div>\r\n    <span class=\"okBtn\" ng-if=\"isQualified\" ng-click=\"over()\">好的</span>\r\n    <span class=\"okBtn\" ng-if=\"!isQualified\" ng-click=\"retest()\">再测一次</span>\r\n    <a ng-if=\"!isQualified\" href=\"\" ng-click=\"over()\">\r\n        <p>返回首页</p>\r\n    </a>\r\n</section>",
            controller: 'resultController'
        })
        .when('/submit', {
            template: "<section class=\"submitPage\">\r\n    <div class=\"circleContainer\">\r\n        <p ng-if=\"isFinished\">回答完成，交卷吧:)</p>\r\n\r\n        <p ng-if=\"!isFinished\">题目没有答完，确定交卷吗？</p>\r\n        <a href=\"#/question/{{$index+1}}\" ng-repeat=\"item in questions.data\" ng-click=\"clearHover()\"><span\r\n                ng-class=\"{finished:userSelections[$index] != undefined}\">{{$index + 1}}</span></a>\r\n    </div>\r\n\r\n    <span class=\"submitBtn\" ng-click=\"submit()\">交卷</span>\r\n    <a href=\"#/question/1\"><p>继续答题</p></a>\r\n</section>",
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
    window.scrollTo(0, 0);
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
        var targetIndex = $rootScope.activeIndex;
        userSelections.data[$routeParams.questionId - 1] = index;
        $scope.selectedIndex = index;

        if ($rootScope.activeIndex < questionService.data.length) {
            $rootScope.slideMode = 'slide-left';
            $timeout(function () {
                $location.path('question/' + (parseInt(targetIndex) + 1));
            }, 1000);
        } else {
            $rootScope.isResultPage = true;
            $timeout(function () {
                $location.path('submit');
            }, 1000);
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

app.controller('submitController', function ($scope, $rootScope, $timeout,questionService, userSelections, $location, $http, resultCollection) {
    window.scrollTo(0, 0);
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
                $location.path('result').replace();
            } else {
                $rootScope.alertMode = 'hover';
                $timeout(function(){
                    $rootScope.alertMode = '';
                },2000);
            }
        },function(error){
            $rootScope.alertMode = 'hover';
            $timeout(function(){
                $rootScope.alertMode = '';
            },2000);
        });
    };
});

app.controller('resultController', function ($scope, $rootScope, questionService, userSelections, $location, resultCollection) {
    window.scrollTo(0, 0);
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
    JSNativeBridge.send('js_msg_pretest_result', {'isQualified': resultCollection.getTestScores() > 79});
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