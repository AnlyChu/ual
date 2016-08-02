/**
 * Created by Anly.Z on 16/6/6.
 */
import bootstrap from '../lib/bootstrap-3.3.5-dist/js/bootstrap.min.js';
import angular from 'angular';
import uiRouter from 'angular-ui-router';
import ngResource from 'angular-resource';
import services from './common/service.js';
import tip from './common/directive.js';
import API from './common/API/api.js';
import Router from './router.js';
import {Inject} from 'angular-es-utils';
import upstreamCtrl from './upstream/upstreamCtrl.js';
import locationCtrl from './location/locationCtrl.js';
import groupCtrl from './common/tmp/groupCtrl.js';
import nginxCtrl from './nginx/nginxCtrl.js';
import serverCtrl from './server/serverCtrl.js';
import luaCtrl from './lua/luaCtrl.js';
import consulCtrl from './consul/consulCtrl.js';
import leftCtrl from './common/left/leftCtrl.js';
import '../lib/bootstrap-3.3.5-dist/css/bootstrap.css';
import './ual.css';

@Inject('$rootScope', 'services', 'API')
class mainCtrl {
	constructor() {
		this.tipService = this._services.TipService;
	}
}

angular.module('UAL', [
	uiRouter,
	ngResource,
	services,
	upstreamCtrl,
	locationCtrl,
	nginxCtrl,
	groupCtrl,
	serverCtrl,
	luaCtrl,
	consulCtrl,
	API,
	tip,
	leftCtrl
])
	.controller('mainCtrl', mainCtrl)
	.config(Router);
