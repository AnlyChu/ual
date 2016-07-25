/**
 * Created by Anly.Z on 16/7/19.
 */


Router.$inject = ['$stateProvider','$urlRouterProvider'];
export default function Router($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.when("", "pageTab/upstream");
	$stateProvider
		.state('pageTab', {
			url: '/pageTab',
			templateUrl: 'pageTab.html'
		})
		//.state('login', {
		//	url: '/login',
		//	templateUrl: 'common/login/login.html',
		//	controller: 'loginCtrl'
		//})
		.state('pageTab.consul', {
			url: '/consul',
			templateUrl: 'consul/consul.html',
			controller: 'consulCtrl',
			controllerAs:'consulCtrl'
		})
		.state('pageTab.upstream', {
			url: '/upstream',
			templateUrl: 'upstream/upstream.html',
			controller: 'upstreamCtrl',
			controllerAs:'upstreamCtrl'
		})
		.state('pageTab.nginx', {
			url: '/nginx',
			templateUrl: 'nginx/nginx.html',
			controller: 'nginxCtrl',
			controllerAs:'nginxCtrl'
		})
		.state('pageTab.server', {
			url: '/server',
			templateUrl: 'server/server.html',
			controller: 'serverCtrl',
			controllerAs:'serverCtrl'
		})
		.state('pageTab.create_server', {
			url: '/create_server',
			templateUrl: 'server/create.server.html',
			controller: 'serverCtrl',
			controllerAs:'serverCtrl'
		})
		.state('pageTab.edit_server', {
			url: '/edit_server/:serverId',
			templateUrl: 'server/edit.server.html',
			controller: 'serverCtrl',
			controllerAs:'serverCtrl'
		})
		.state('pageTab.location', {
			url: '/location',
			templateUrl: 'location/location.html',
			controller: 'locationCtrl',
			controllerAs:'locationCtrl'
		})
		.state('pageTab.lua', {
			url: '/lua',
			templateUrl: 'lua/lua.html',
			controller: 'luaCtrl',
			controllerAs:'luaCtrl'
		})

	;

}