/**
 * Created by Anly.Z on 16/6/27.
 */

import {Inject} from 'angular-es-utils';

@Inject('services', 'API')


class luaCtrl {
	constructor() {
		let luaScope = this;
		luaScope.getLuas();
		luaScope.isEdit = false;
		luaScope.isAdd = false;
	}

	getLuas(lua) {
		let luaScope = this;
		let api = this._API;
		api.getLua.get({}, (data) => {
			luaScope.luas = data.luas;
			if (lua) {
				luaScope.luaAllInfo = lua;
			} else {
				luaScope.luaAllInfo = luaScope.luas[0];
			}
		});
	}

	luaInfo(index, event) {
		let luaScope = this;
		var other = document.querySelectorAll('.list-group-item');
		for (var i = 0, len = other.length; i < len; i++) {
			if (other[i] != event.target) {
				if (other[i].className.indexOf('active') > -1) {
					other[i].className = 'list-group-item';
				}
			}
		}
		$(event.target).addClass('active');
		luaScope.isEdit = false;
		luaScope.isAdd = false;
		luaScope.luaAllInfo = luaScope.luas[index];
	}


	initLua(type) {
		let luaScope = this;
		luaScope.isEdit = false;
		luaScope.isAdd = false;
		if (type === 'add') {
			luaScope.isAdd = true;
			luaScope.luaAllInfo = {
				fileName: '',
				descr: '',
				content: ''
			};
		} else if (type === 'edit') {
			luaScope.isEdit = true;
		} else if (type === 'esc') {
			luaScope.luaAllInfo = luaScope.luas[0];
		}
	}

	addLua() {
		let luaScope = this;
		let api = this._API;
		let TipService = this._services.TipService;
		api.lua.save({},
			luaScope.luaAllInfo, (data) => {
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

	editLua(luaAllInfo) {
		let luaScope = this;
		let api = this._API;
		let TipService = this._services.TipService;
		api.lua.update({},
			luaAllInfo, (data) => {
				if (data.status) {
					TipService.setMessage('修改成功', 'success');
				} else {
					TipService.setMessage('修改失败', 'danger');
				}
				luaScope.initLua();
				luaScope.getLuas(luaAllInfo);
			}, () => {
				TipService.setMessage('修改失败', 'danger');
				luaScope.getLuas();
			})
	}

}

export default angular.module('ual.lua',[])
	.controller('luaCtrl', luaCtrl)
	.name;