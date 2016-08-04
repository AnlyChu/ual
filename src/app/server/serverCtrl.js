/**
 * Created by Anly.Z on 16/6/27.
 */
import {Inject} from 'angular-es-utils';
import showOrHide from '../common/slider.js';


@Inject('services', 'API', '$state', '$stateParams')
class serverCtrl {
	constructor() {
		let serverScope = this;
		serverScope.locationItem = '';
		serverScope.locationsChoose = [];
		serverScope.serverId = this._$stateParams.serverId;
		serverScope.getServers();
		//serverScope.showOrHide = window.slideToggle.showOrHide;

	}

	showOrHide(index, event) {
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

	init() {
		let serverScope = this;
		serverScope.serverItem = {
			domain: '',
			env: '',
			port: '',
			nginxGroupId: '',
			compression: ''
		};
		serverScope.serverLocation = {
			type: 0,
			serverId: '',
			locationId: ''
		};
		serverScope.envList = [{
			key: '',
			value: ''
		}];
		serverScope.envListItem = [{
			key: '',
			value: ''
		}];
	}

	addNode(type) {
		let serverScope = this;
		if (type == 'add') {
			serverScope.envListItem.push({
				key: '',
				value: ''
			});
		} else {
			serverScope.envList.push({
				key: '',
				value: ''
			});
		}
	}

	popNode(index, type) {
		let serverScope = this;
		type == 'add' ? serverScope.envListItem.splice(index, 1) : serverScope.envList.splice(index, 1);
	}

	getServer() {
		let serverScope = this;
		let api = this._API;
		if (serverScope.serverId) {
			api.getServer.get({
				serverId: serverScope.serverId
			}, (data) => {
				serverScope.serverItem = data.server;
				serverScope.serverItem.nginxGroup.nginxGroupId = serverScope.serverItem.nginxGroup.nginxGroupId.toString();
			})
		}
	}

	getServers() {
		let api = this._API;
		let serverScope = this;
		api.getAllServer.get({}, (data) => {
			serverScope.servers = data.servers;
			serverScope.init();
			serverScope.getServer();
		});
		api.getNginxGroup.get({}, (data) => {
			serverScope.nginxGroups = data.nginxGroups;
		});
		api.getConsuls.get({}, (data) => {
			serverScope.consuls = data.consuls;
		});
		api.getLocations.get({}, (data) => {
			serverScope.locations = data.locations;
		});
		api.getUpstreams.get({}, (data) => {
			serverScope.upstreams = data.upstreams;
		});
		api.getLua.get({}, (data) => {
			serverScope.luas = data.luas;
		});
	}

	addServe() {
		let serverScope = this;
		let api = this._API;
		let TipService = this._services.TipService;
		let obj = {};
		angular.forEach(serverScope.envListItem, function (item) {
			if (item.key && item.value) {
				obj[item.key] = item.value;
			}
		})
		serverScope.serverItem.env = JSON.stringify(obj);
		serverScope.serverItem.compression = serverScope.serverItem.compression === '' ? false : serverScope.serverItem.compression;
		api.server.save({},
			serverScope.serverItem, (data) => {
				if (data.status) {
					serverScope.serverLocation.serverId = data.serverId;
					$('#server').modal('hide');
					TipService.setMessage('添加成功', 'success');
					serverScope.getServers();
				} else {
					$('#server').modal('hide');
					TipService.setMessage('添加失败', 'danger');
					serverScope.getServers();
				}
			}, () => {
				$('#server').modal('hide');
				TipService.setMessage('添加失败', 'danger');
				serverScope.getServers();
			})
	}

	goBack() {
		let serverScope = this;
		serverScope.bindLocation = false;
	}

	changeLocation(index) {
		let serverScope = this;
		serverScope.locationItem = serverScope.locations[index];
	}

	serverBindLocation() {
		let serverScope = this;
		let api = this._API;
		let TipService = this._services.TipService;
		serverScope.serverLocation.locationId = serverScope.locationItem.locationId;
		if (!serverScope.serverLocation.serverId) {
			serverScope.serverLocation.serverId = serverScope.serverItem.serverId;
		}
		api.bindLocation.save({},
			serverScope.serverLocation, (data) => {
				if (data.status) {
					serverScope.getServer();
					$('#server-location').modal('hide');
					$('#addLocation').modal('hide');
					serverScope.locationsChoose.push(serverScope.locationItem);
					TipService.setMessage('绑定成功', 'success');
				} else {
					TipService.setMessage('绑定失败', 'danger');
				}
			}, () => {
				$('#server-location').modal('hide');
				$('#addLocation').modal('hide');
			})
	}

	getServerId(index, type, event) {
		let serverScope = this;
		let state = this._$state;
		serverScope.objLen = 0;
		event.stopPropagation();
		if (type == 'setting') {
			serverScope.init();
			serverScope.serverItem = serverScope.servers[index];
			//如果不toString，浏览解析会报错，因为ng-model的值为number而option的值为string
			serverScope.serverItem.nginxGroup.nginxGroupId = serverScope.serverItem.nginxGroup.nginxGroupId.toString();
			let obj = JSON.parse(serverScope.serverItem.env);
			serverScope.arr = [];
			let i = 0;
			for (let o in obj) {
				serverScope.arr.push({ key: '', value: '' });
				serverScope.arr[i].key = o;
				serverScope.arr[i].value = obj[o];
				i++;
			}
			serverScope.arr.length >= 1 ? serverScope.envList = serverScope.arr : '';
			$('#server-edit').modal('show');
		} else if (type == 'del') {
			serverScope.serverItem = serverScope.servers[index];
			$('#server-del').modal('show');
		}
	}

	editServe() {
		let serverScope = this;
		let api = this._API;
		let TipService = this._services.TipService;
		let state = this._$state;
		api.server.update({
			domain: serverScope.serverItem.domain,
			env: serverScope.serverItem.env,
			port: serverScope.serverItem.port,
			nginxGroupId: serverScope.serverItem.nginxGroup.nginxGroupId,
			header: serverScope.serverItem.header,
			serverId: serverScope.serverItem.serverId
		}, (data) => {
			state.go('pageTab.server');
			if (data.status) {
				serverScope.init();
				TipService.setMessage('修改成功', 'success');
			} else {
				TipService.setMessage('修改失败', 'danger');
			}
		}, () => {
			state.go('.server');
			TipService.setMessage('添加失败', 'danger');
		})
	}


	delServer(serverId) {
		let api = this._API;
		let serverScope = this;
		let TipService = this._services.TipService;
		api.delServer.delete({
			serverId: serverId
		}, (data) => {
			serverScope.getServers();
			$('#server-del').modal('hide');
			if (data.status) {
				TipService.setMessage('删除成功', 'success');
			} else {
				TipService.setMessage('删除失败', 'danger');
			}
		}, () => {
			serverScope.getServers();
			$('#server-del').modal('hide');
			TipService.setMessage('删除失败', 'danger');
		})
	}

	getServerLocation(server, location, index, type) {
		let serverScope = this;
		if (type == 'unlock') {
			$('#unlock-location').modal('show');
			serverScope.unlockServer = server;
			serverScope.unlockLocation = location;
			serverScope.unlockLocationIndex = index;
		} else if (type == 'edit') {
			$('#server-location').modal('show');
			serverScope.unlockServer = server;
			serverScope.unlockLocation = location;
		}
	}

	locationFromServer(type) {
		let api = this._API;
		let serverScope = this;
		let TipService = this._services.TipService;
		if (type == 'unlock') {
			api.unBindLocation.delete({
				serverId: serverScope.unlockServer.serverId,
				locationId: serverScope.unlockLocation.locationId
			}, (data) => {
				serverScope.getServer();
				angular.forEach(serverScope.servers, (item) => {
					if (item.serverId = serverScope.unlockServer.serverId) {
						angular.forEach(item.locations, (locationItem, index) => {
							if (locationItem.locationId == serverScope.unlockLocation.locationId) {
								item.locations.splice(index, 1);
							}
						});
					}
				});
				$('#unlock-location').modal('hide');
				if (data.status) {
					TipService.setMessage('解绑成功', 'success');
				} else {
					TipService.setMessage('解绑失败', 'danger');
				}
			})
		} else if (type == 'edit') {
			api.bindLocation.update({
				serverId: serverScope.unlockServer.serverId,
				locationId: serverScope.unlockLocation.locationId,
				type: serverScope.unlockLocation.type
			}, (data) => {
				$('#server-location').modal('hide');
				if (data.status) {
					TipService.setMessage('修改成功', 'success');
				} else {
					TipService.setMessage('修改失败', 'danger');
				}
			}, () => {
				$('#server-location').modal('hide');
			})
		}
	}


};


export default angular.module('ual.serverCtrl', [])
	.controller('serverCtrl', serverCtrl)
	.name;