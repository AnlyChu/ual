/**
 * Created by Anly.Z on 16/6/27.
 */

import {Inject} from 'angular-es-utils';
import API from '../common/API/api.js';
import services from '../common/service.js';

@Inject('API', 'services')
class upstreamCtrl {
	constructor() {
		let upstreamScope = this;
		upstreamScope.getUpstreams();
	}

	initUpstream() {
		let upstreamScope = this;
		upstreamScope.upstreamItem = {
			serviceName: '',
			keepalive: '',
			nodes: '',
			balancing: ''
		};
		upstreamScope.nodeArray = [{
			address: '',
			port: '',
			weight: ''
		}];
		upstreamScope.nodeArrayItem = [{
			address: '',
			port: '',
			weight: ''
		}];
	}

	getUpstreams() {
		let upstreamScope = this;
		let api = upstreamScope._API;
		upstreamScope.initUpstream();
		api.getUpstreams.get({}, (data)=> {
			upstreamScope.upstreams = data.upstreams;
			angular.forEach(data.upstreams, function (item) {
				item.nodeList = item.nodes.split(',');
			})
		});
	}

	addUpstream() {
		let upstreamScope = this;
		let list = '';
		let api = upstreamScope._API;
		let TipService = this._services.TipService;
		angular.forEach(upstreamScope.nodeArrayItem, function (item, index) {
			if (index == upstreamScope.nodeArray.length - 1) {
				list += item.address + ':' + item.port + ':' + item.weight;
			} else {
				list += item.address + ':' + item.port + ':' + item.weight + ',';
			}
		});
		upstreamScope.upstreamItem.nodes = list;
		api.upstream.save({},
			upstreamScope.upstreamItem,(data) => {
			data.status ? TipService.setMessage('添加成功', 'success') : TipService.setMessage('添加失败', 'danger');
			upstreamScope.getUpstreams();
			$('#upstream').modal('hide');
		})
	}

	addNode(){
		let upstreamScope = this;
		upstreamScope.nodeArrayItem.push({
			address: '',
			port: '',
			weight: ''
		});
	}
	popNode(index){
		let upstreamScope = this;
		upstreamScope.nodeArrayItem.splice(index,1);
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
		upstreamScope.initUpstream();
		upstreamScope.upstreamModal = upstreamScope.upstreams[index];
		if(upstreamScope.upstreamModal.nodeList.length > 1){
			let len = upstreamScope.upstreamModal.nodeList.length;
			for(let i = 1;i < len;i++){
				upstreamScope.nodeArray.push({
					address: '',
					port: '',
					weight: ''
				});
			}
			angular.forEach(upstreamScope.upstreamModal.nodeList,function(item,index){
				let nodeList = upstreamScope.upstreamModal.nodeList[index].split(':');
				upstreamScope.nodeArray[index].address = nodeList[0];
				upstreamScope.nodeArray[index].port = nodeList[1];
				upstreamScope.nodeArray[index].weight = nodeList[2];
			});
		}

		type == 'setting' ? $('#upstream-setting').modal('show') : $('#upstream-del').modal('show');
	}

	editUpstream(upstreamModal) {
		let upstreamScope = this;
		let api = upstreamScope._API;
		let TipService = this._services.TipService;
		let list = '';
		angular.forEach(upstreamScope.nodeArray, function (item, index) {
			if (index == upstreamScope.nodeArray.length - 1) {
				list += item.address + ':' + item.port + ':' + item.weight;
			} else {
				list += item.address + ':' + item.port + ':' + item.weight + ',';
			}
		});
		upstreamModal.nodes = list;
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