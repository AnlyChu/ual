/**
 * Created by Anly.Z on 16/6/27.
 */

import {Inject} from 'angular-es-utils';
import API from '../common/API/api.js';
import services from '../common/service.js';

@Inject('$scope', 'API', 'services')
class upstreamCtrl {
	constructor($scope) {
		let upstreamScope = this;
		let api = upstreamScope._API;
		upstreamScope.$scope = $scope;
		upstreamScope.upstreamBalancing = '';
		upstreamScope.upstreamName = '';
		upstreamScope.upstreamNodes = '';
		upstreamScope.getUpstreams();
	}

	getUpstreams() {
		let upstreamScope = this;
		let api = upstreamScope._API;
		api.getUpstreams.get({}).$promise.then((data)=> {
			upstreamScope.upstreams = data.upstreams;
		}).catch();
	}

	addUpstream() {
		let upstreamScope = this;
		let api = upstreamScope._API;
		let TipService = this._services.TipService;
		api.upstream.save({
			serviceName: upstreamScope.upstreamName,
			nodes: upstreamScope.upstreamNodes,
			balancing: upstreamScope.upstreamBalancing
		}, (data) => {
			data.status ? TipService.setMessage('添加成功', 'success') : TipService.setMessage('添加失败', 'danger');
			upstreamScope.getUpstreams();
			$('#upstream').modal('hide');
		})
	}

	delUpstream(upstreamId) {
		let upstreamScope = this;
		let api = upstreamScope._API;
		let TipService = this._services.TipService;
		api.delUpstream.delete({
			upstreamId: upstreamId
		}, (data) => {
			data.status ? TipService.setMessage('删除成功', 'success') : TipService.setMessage('删除失败', 'danger');
			upstreamScope.getUpstreams();
			$('#upstream-del').modal('hide');
		})
	}

	getUpstreamId(index, type) {
		let upstreamScope = this;
		upstreamScope.upstreamModal = upstreamScope.upstreams[index];
		console.log('aaa:' + upstreamScope.upstreamModal);
		type == 'setting' ? $('#upstream-setting').modal('show') : $('#upstream-del').modal('show');
	}

	editUpstream(upstreamModal) {
		let upstreamScope = this;
		let api = upstreamScope._API;
		let TipService = this._services.TipService;
		api.upstream.update({
			upstreamId: upstreamModal.upstreamId,
			serviceName: upstreamModal.serviceName,
			nodes: upstreamModal.nodes,
			balancing: upstreamModal.balancing
		}, (data) => {
			data.status ? TipService.setMessage('修改成功', 'success') : TipService.setMessage('修改失败', 'danger');
			upstreamScope.getUpstreams();
			$('#upstream-setting').modal('hide');
		})
	}
}

export default angular.module('upstream', [])
	.controller('upstreamCtrl', upstreamCtrl)
	.name;