/**
 * Created by Anly.Z on 16/6/27.
 */

import {Inject} from 'angular-es-utils';
import API from '../common/API/api.js';
import services from '../common/service.js';
import  showOrHide from '../common/slider.js';

@Inject('API', 'services')
class upstreamCtrl {
	constructor() {
		let upstreamScope = this;
		upstreamScope.getUpstreams();
	}

	showOrHide(index,event){
		var other = document.querySelectorAll('.tr-hover');
		for (var i = 0, len = other.length; i < len; i++) {
			if (other[i] != event.target) {
				if (other[i].className.indexOf('active') > -1) {
					other[i].className = '';
				}
			}
		}
		$(event.target.parentNode).addClass('active');
		showOrHide(index);
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
			upstreamScope.upstreamItem, (data) => {
				data.status ? TipService.setMessage('添加成功', 'success') : TipService.setMessage('添加失败', 'danger');
				upstreamScope.getUpstreams();
				$('#upstream').modal('hide');
			})
	}

	addNode(type) {
		let upstreamScope = this;
		if (type == 'add') {
			upstreamScope.nodeArrayItem.push({
				address: '',
				port: '',
				weight: ''
			});
		} else {
			upstreamScope.nodeArray.push({
				address: '',
				port: '',
				weight: ''
			});
		}
	}

	popNode(index, type) {
		let upstreamScope = this;
		type == 'add' ? upstreamScope.nodeArrayItem.splice(index, 1) : upstreamScope.nodeArray.splice(index, 1);
	}

	delUpstream(upstream, type) {
		let upstreamScope = this;
		let api = upstreamScope._API;
		let TipService = this._services.TipService;
		if (type == 'del-node') {
			upstreamScope.editUpstream(upstreamScope.nodes)
		} else {
			api.delUpstream.delete({
				upstreamId: upstream.upstreamId
			}, (data) => {
				data.status ? TipService.setMessage('删除成功', 'success') : TipService.setMessage('删除失败', 'danger');
				upstreamScope.getUpstreams();
				$('#upstream-del').modal('hide');
			})
		}
	}

	getUpstreamId(index, type, nodeUpstream,event) {
		event.stopPropagation();
		let upstreamScope = this;
		upstreamScope.initUpstream();
		upstreamScope.upstreamModal = angular.copy(upstreamScope.upstreams[index]);
		if (type == 'setting') {
			if (upstreamScope.upstreamModal.nodeList.length > 1) {
				let len = upstreamScope.upstreamModal.nodeList.length;
				for (let i = 1; i < len; i++) {
					upstreamScope.nodeArray.push({
						address: '',
						port: '',
						weight: ''
					});
				}
				angular.forEach(upstreamScope.upstreamModal.nodeList, function (item, index) {
					let nodeList = upstreamScope.upstreamModal.nodeList[index].split(':');
					upstreamScope.nodeArray[index].address = nodeList[0];
					upstreamScope.nodeArray[index].port = nodeList[1];
					upstreamScope.nodeArray[index].weight = nodeList[2];
				});
			} else {
				let nodeList = upstreamScope.upstreamModal.nodeList[0].split(':');
				upstreamScope.nodeArray[0].address = nodeList[0];
				upstreamScope.nodeArray[0].port = nodeList[1];
				upstreamScope.nodeArray[0].weight = nodeList[2];
			}
			$('#upstream-setting').modal('show')
		} else if (type == 'del') {
			$('#upstream-del').modal('show');
		} else {
			upstreamScope.upstreamModal = nodeUpstream;
			upstreamScope.nodeUpstream = nodeUpstream.nodeList[index];
			upstreamScope.nodes = angular.copy(nodeUpstream.nodeList).splice(index, 1);
			$('#upstream-del-node').modal('show');
		}
	}

	editUpstream(nodes) {
		let upstreamScope = this;
		let api = upstreamScope._API;
		let TipService = this._services.TipService;
		let list = '';
		if (!nodes) {
			angular.forEach(upstreamScope.nodeArray, function (item, index) {
				if (index == upstreamScope.nodeArray.length - 1) {
					list += item.address + ':' + item.port + ':' + item.weight;
				} else {
					list += item.address + ':' + item.port + ':' + item.weight + ',';
				}
			});
			upstreamScope.upstreamModal.nodes = list;
		} else {
			upstreamScope.upstreamModal.nodes = nodes;
		}
		api.upstream.update({
			upstreamId: upstreamScope.upstreamModal.upstreamId,
			serviceName: upstreamScope.upstreamModal.serviceName,
			nodes: upstreamScope.upstreamModal.nodes,
			balancing: upstreamScope.upstreamModal.balancing,
			keepalive: upstreamScope.upstreamModal.keepalive
		}, (data) => {
			data.status ? TipService.setMessage('修改成功', 'success') : TipService.setMessage('修改失败', 'danger');
			nodes ? upstreamScope.upstreamModal.nodeList = upstreamScope.nodes :  upstreamScope.getUpstreams();
			$('#upstream-setting').modal('hide');
			$('#upstream-del-node').modal('hide');
		})
	}
}

export default angular.module('upstream', [])
	.controller('upstreamCtrl', upstreamCtrl)
	.name;