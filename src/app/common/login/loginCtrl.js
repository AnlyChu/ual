/**
 * Created by Anly.Z on 16/6/24.
 */
'use strict';
angular.module('UAL')
	.controller('loginCtrl', ['$rootScope', '$scope', 'api', '$state', function ($rootScope, $scope, api, $state) {
		//$scope.loginData = {
		//	userName: '',
		//	password: '',
		//	status: '1'
		//};
		//$rootScope.operationName = "登录";
		//$scope.loginMethod = function () {
		//	api.login.get({
		//		username: $scope.loginData.userName,
		//		password: $scope.loginData.password,
		//		status: $scope.loginData.status
		//	}, function (data) {
		//		$rootScope.USERINFO = data;
		//		if (data.status == "辅导员") {
		//			//window.location.href = window.location.origin + '/counsellor/classSelect.jsp';
		//			$state.go('index', {});
		//		} else if (data.status == "书记") {
		//			//window.location.href = window.location.origin + '/admin/allClassInfo.jsp';
		//			$state.go('allClassInfo', {});
		//		}
		//	}, function () {
		//	});
		//};
	}]);
