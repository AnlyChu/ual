/**
 * Created by Anly.Z on 16/7/5.
 */
import {Inject} from 'angular-es-utils';

@Inject('$rootScope', 'API', 'services')
class groupCtrl {
	constructor() {
		let rootScope = this._$rootScope;
		let api = this._API;
		rootScope.allGroup = true;
		this.getNginxGroup();
	}

	chooseGroup(nginxGroupId, event) {
		let rootScope = this._$rootScope;

		var other = document.querySelectorAll('.list-group-item');
		for (var i = 0, len = other.length; i < len; i++) {
			if (other[i] != event.target) {
				if (other[i].className.indexOf('active') > -1) {
					other[i].className = 'list-group-item';
				}
			}
		}
		$(event.target).addClass('active');
		if (nginxGroupId === 'all') {
			rootScope.allGroup = true;
		} else if (nginxGroupId === 'noGroup') {
			rootScope.allGroup = false;
			rootScope.chooseGroupId = undefined;
		} else {
			rootScope.allGroup = false;
			rootScope.chooseGroupId = nginxGroupId;
		}
	}

	upgradeNginxGroup(index) {
		let groupScope = this;
		let api = this._API;
		let TipService = this._services.TipService;
		groupScope.nginxGroupItem = groupScope.nginxGroups[index];
		api.upgradeGroup.update({
			groupName: groupScope.nginxGroupItem.groupName
		}, (data) => {
			$('#nginxGroup-upgrade').modal('hide');
			data.version ? TipService.setMessage('当前版本' + data.version, 'success') : TipService.setMessage('upgrade失败', 'danger');
		}, () => {
			$('#nginxGroup-upgrade').modal('hide');
			TipService.setMessage('upgrade失败', 'danger');
		})
	}

	addGroup() {
		let groupScope = this;
		groupScope.initGroup();
		$('#nginxGroup').modal('show');
	}

	initGroup() {
		let groupScope = this;
		groupScope.nginxGroupItem = {
			groupName: '',
			consulId: ''
		};
	}

	getNginxGroup() {
		let groupScope = this;
		let rootScope = this._$rootScope;
		let api = this._API;
		api.getNginxGroup.get({}, (data) => {
			rootScope.nginxGroups = data.nginxGroups;
		});

		api.getConsuls.get({}, (data) => {
			groupScope.consuls = data.consuls;
		});
	}

	addNginxGroup() {
		let groupScope = this;
		let api = this._API;
		let TipService = this._services.TipService;
		api.nginxGroup.save({},
			groupScope.nginxGroupItem, (data) => {
				groupScope.getNginxGroup();
				groupScope.initGroup();
				$('#nginxGroup').modal('hide');
				data.status ? TipService.setMessage('添加成功', 'success') : TipService.setMessage('添加失败', 'danger');

			}
		)
	}

	getGroupId(index, type, event) {
		event.stopPropagation();
		let groupScope = this;
		let rootScope = this._$rootScope;
		if (type == 'setting') {
			groupScope.nginxGroupItem = rootScope.nginxGroups[index];
			$('#nginxGroup-edit').modal('show');
		} else if (type == 'del') {
			groupScope.nginxGroupItem = rootScope.nginxGroups[index];
			$('#nginxGroup-del').modal('show');
		} else if (type == 'upgrade') {
			groupScope.nginxGroupItem = rootScope.nginxGroups[index];
			$('#nginxGroup-upgrade').modal('show');
		}
	}

	delNginxGroup(nginxGroupId) {
		let groupScope = this;
		let api = this._API;
		let TipService = this._services.TipService;
		api.delNginxGroup.delete({
			nginxGroupId: nginxGroupId
		}, (data) => {
			groupScope.getNginxGroup();
			$('#nginxGroup-del').modal('hide');
			data.status ? TipService.setMessage('删除成功', 'success') : TipService.setMessage('删除失败', 'danger');
		}, () => {
			groupScope.getNginxGroup();
			$('#nginxGroup-del').modal('hide');
			TipService.setMessage('删除失败', 'danger');
		})
	}

	editNginxGroup(nginxGroupItem) {
		let groupScope = this;
		let api = this._API;
		let TipService = this._services.TipService;
		api.nginxGroup.update({},
			nginxGroupItem, (data) => {
				groupScope.getNginxGroup();
				$('#nginxGroup-edit').modal('hide');
				data.status ? TipService.setMessage('修改成功', 'success') : TipService.setMessage('修改失败', 'danger');
			}, () => {
				$('#nginxGroup-edit').modal('hide');
				groupScope.getNginxGroup();
				TipService.setMessage('修改失败', 'danger');
			})
	}


}


export default angular.module('ual.groupCtrl',[])
	.controller('groupCtrl', groupCtrl)
	.name;