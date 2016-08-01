/**
 * Created by Anly.Z on 16/6/27.
 */
import {Inject} from 'angular-es-utils';
// import  slideToggle from '../../lib/index.js';


@Inject('services', 'API', '$state', '$stateParams')
class serverCtrl {
	constructor() {
		let serverScope = this;
		serverScope.bindLocation = false;
		serverScope.serverPost = false;
		//serverScope.display = false;
		serverScope.locationItem = '';
		serverScope.locationsChoose = [];
		serverScope.serverId = this._$stateParams.serverId;
		serverScope.getServers();
		//serverScope.showOrHide = window.slideToggle.showOrHide;

	}

	init() {
		let serverScope = this;
		serverScope.serverItem = {
			domain: '',
			env: '',
			port: '',
			nginxGroupId: '',
			header: ''
		};
		serverScope.serverLocation = {
			type: 0,
			serverId: '',
			locationId: ''
		}
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
		if (serverScope.serverPost) {
			serverScope.bindLocation = true;
		} else {
			api.server.save({},
				serverScope.serverItem, (data) => {
					if (data.status) {
						serverScope.serverLocation.serverId = data.serverId;
						serverScope.bindLocation = true;
						serverScope.serverPost = true;
						TipService.setMessage('添加成功', 'success');
					} else {
						TipService.setMessage('添加失败', 'danger');
					}
				}, () => TipService.setMessage('添加失败', 'danger'))
		}
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
		event.stopPropagation();
		if (type == 'setting') {
			serverScope.serverItem = serverScope.servers[index];
			//如果不toString，浏览解析会报错，因为ng-model的值为number而option的值为string
			serverScope.serverItem.nginxGroup.nginxGroupId = serverScope.serverItem.nginxGroup.nginxGroupId.toString();
			state.go('pageTab.edit_server', {serverId: serverScope.serverItem.serverId});
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
			},  () => {
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
			},(data) => {
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
			},  (data) => {
				$('#server-location').modal('hide');
				if (data.status) {
					TipService.setMessage('修改成功', 'success');
				} else {
					TipService.setMessage('修改失败', 'danger');
				}
			},  () => {
				$('#server-location').modal('hide');
			})
		}
	}

	showOrHide(index) {
		var other = document.querySelectorAll('.showOrHide');
		for (var i = 0, len = other.length; i < len; i++) {
			if (other[i] != other[index]) {
				if (parseInt(other[i].style.height) > 0) {
					display = false;
					slideToggleTrans(i, display);
				}
			}
		}
		var ele = document.querySelectorAll('.showOrHide')[index];
		if (parseInt(ele.style.height) > 0) {
			display = true;
		}
		display = !display;
		slideToggleTrans(index, display);
		display = false;
	};

}
// 应用渐进使用transition交互的slideToggle效果
let slideToggleTrans = (index, display) => { //  display表示默认更多展开元素是显示状态还是隐藏
	var eleMore = document.querySelectorAll('.showOrHide')[index];
	eleMore && (eleMore.style.height = display ? (function () {
		var height = 0;
		Array.prototype.slice.call(eleMore.childNodes).forEach(function (child) {
			if (child.nodeType === 1) {
				var oStyle = window.getComputedStyle(child);
				height += child.clientHeight + (parseInt(oStyle.borderTopWidth) || 0) + (parseInt(oStyle.borderBottomWidth) || 0);
			}
		});
		return height;
	})() + "px" : "0px");
};


export default angular.module('ual.serverCtrl',[])
	.controller('serverCtrl', serverCtrl)
	.name;