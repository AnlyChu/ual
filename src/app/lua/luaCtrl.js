/**
 * Created by Anly.Z on 16/6/27.
 */

import {Inject} from 'angular-es-utils';

@Inject('services', 'API')


class luaCtrl {
	constructor() {
		let luaScope = this;
		luaScope.luaEditInfo = {};
		luaScope.isEdit = true;
		luaScope.initLua();
		luaScope.getLuas();
	}

	getLuas(lua) {
		let luaScope = this;
		let leftNavText = this._services.leftNavText;
		let api = this._API;
		api.getLua.get({}, (data) => {
			luaScope.luas = data.luas;
			if (lua) {
				Object.assign(luaScope.luaAllInfo, lua);
				Object.assign(luaScope.luaEditInfo, lua);
			} else {
				Object.assign(luaScope.luaAllInfo, luaScope.luas[0]);
				Object.assign(luaScope.luaEditInfo, luaScope.luas[0]);
				leftNavText.setText(luaScope.luaAllInfo.name);
			}
		});
	}

	luaInfo(index, event) {
		let luaScope = this;
		let leftNavText = this._services.leftNavText;
		let other = document.querySelectorAll('.list-group-item');
		for (let i = 0, len = other.length; i < len; i++) {
			if (other[i] != event.target) {
				if (other[i].className.indexOf('active') > -1) {
					other[i].className = 'list-group-item lua';
				}
			}
		}

		leftNavText.setText($(event.target).text());
		$(event.target).addClass('active');
		Object.assign(luaScope.luaAllInfo, luaScope.luas[index]);
		Object.assign(luaScope.luaEditInfo, luaScope.luas[index]);
	}


	initLua() {
		let luaScope = this;

		luaScope.luaAllInfo = {
			name: '',
			fileName: '',
			descr: '',
			content: '',
			type: 'auth',
			stage: 'rewrite'
		};

		luaScope.luaItem = {
			name: '',
			fileName: '',
			descr: '',
			content: '',
			type: 'auth',
			stage: 'rewrite'
		};
	}

	addLua() {
		let luaScope = this;
		let api = this._API;
		let TipService = this._services.TipService;
		api.lua.save({},
			luaScope.luaItem, (data) => {
				$('#lua-add').modal('hide');
				if (data.status) {
					TipService.setMessage('添加成功', 'success');
				} else {
					TipService.setMessage('添加失败', 'danger');
				}
				luaScope.initLua();
				luaScope.getLuas();
			}
		)
	}

	delLua(luaAllInfo) {
		let luaScope = this;
		let api = this._API;
		let TipService = this._services.TipService;
		api.delLua.delete({
			luaId: luaAllInfo.luaId
		}, (data) => {
			if (data.status) {
				TipService.setMessage('删除成功', 'success');
			} else {
				TipService.setMessage('删除失败', 'danger');
			}
			luaScope.getLuas();
			$('#lua-del').modal('hide');
		})
	}

	editLua(luaEditInfo) {
		let luaScope = this;
		let api = this._API;
		let TipService = this._services.TipService;
		api.lua.update({},
			luaEditInfo, (data) => {
				$('#lua-edit').modal('hide');
				if (data.status) {
					TipService.setMessage('修改成功', 'success');
				} else {
					TipService.setMessage('修改失败', 'danger');
				}
				luaScope.getLuas(luaEditInfo);
			}, () => {
				$('#lua-edit').modal('hide');
				TipService.setMessage('修改失败', 'danger');
				luaScope.getLuas(luaEditInfo);
			})
	}

}

export default angular.module('ual.lua', [])
	.controller('luaCtrl', luaCtrl)
	.name;