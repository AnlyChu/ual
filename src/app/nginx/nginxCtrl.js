/**
 * Created by Anly.Z on 16/6/27.
 */

import {Inject} from 'angular-es-utils';

@Inject('services', 'API', '$rootScope')
class nginxCtrl {
	constructor() {
		this.getNginx();
	}

	getNginx(){
		let nginxScope = this;
		let api = this._API;
		api.getNginx.get({}, (data) => {
			nginxScope.nginxs = data.nginxs;
		});
	}

	getNginxId(index, type) {
		let nginxScope = this;
		if (type == 'setting') {
			nginxScope.nginxItem = nginxScope.nginxs[index];
			$('#nginx-edit').modal('show');
		} else if (type == 'del') {
			nginxScope.nginxItem = nginxScope.nginxs[index];
			nginxScope.nginxItem.nginxGroup.nginxGroupId = '';
			$('#nginx-del').modal('show');
		}
	}

	editNginx(nginxItem) {
		let nginxScope = this;
		let api = this._API;
		let TipService = this._services.TipService;
		api.nginx.update({
			nginxId: nginxItem.nginxId,
			hostName: nginxItem.hostName,
			nginxGroupId: nginxItem.nginxGroup.nginxGroupId
		}, (data) => {
			$('#nginx-edit').modal('hide');
			$('#nginx-del').modal('hide');
			nginxScope.getNginx();
			data.status ? TipService.setMessage('修改成功', 'success') : TipService.setMessage('修改失败', 'danger');
		}, () => {
			$('#nginx-del').modal('hide');
			$('#nginx-edit').modal('hide');
			TipService.setMessage('修改失败', 'danger');
		})
	}

}

export default angular.module('ual.nginx',[])
	.controller('nginxCtrl', nginxCtrl)
	.name;