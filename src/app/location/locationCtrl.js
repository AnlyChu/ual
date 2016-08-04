/**
 * Created by Anly.Z on 16/6/27.
 */
import {Inject} from 'angular-es-utils';

@Inject('API', 'services')
class locationCtrl {
	constructor() {
		let locationScope = this;
		let api = this._API;
		locationScope.luasArray = [];
		locationScope.locationItem = {
			urimatch: '',
			internal: '',
			rewrite: '',
			upstreamId: '',
			luas: '',
			defaultType: '',
			excmd: '',
			auth: '',
			dynamic_proxy: '',
			proxyConf: '',
			include: '',
			locationName: ''
		};
		api.getUpstreams.get({}, (data) => {
			locationScope.upstreams = data.upstreams;
		});

		api.getLua.get({}, (data) => {
			locationScope.luas = data.luas;
		});

		locationScope.getLocation();

	}

	luasArrayChange() {
		let locationScope = this;
		locationScope.luasList = [];
		angular.forEach(locationScope.luasArray, function (item) {
			if (item) {
				angular.forEach(locationScope.luas, function (lua) {
					if (lua.luaId == item) {
						locationScope.luasList.push(lua);
					}
				})
			}
		})
	}

	initLocationModal() {
		let locationScope = this;
		locationScope.luasArray = [];
		locationScope.luasList = [];
		locationScope.locationModal = {
			urimatch: '',
			internal: '',
			rewrite: '',
			upstream: {},
			luas: '',
			defaultType: '',
			excmd: '',
			auth: '',
			dynamic_proxy: '',
			proxyConf: '',
			include: '',
			locationName: ''
		}
	}

	getLocation() {
		let locationScope = this;
		let api = this._API;
		locationScope.initLocationModal();
		api.getLocations.get({}, (data) => {
			locationScope.locations = data.locations;
			angular.forEach(locationScope.locations, function (item) {
				for (let i = 0, len = item.luas.length; i < len; i++) {
					if (item.luas[i].type == 'auth') {
						item.auth = item.luas[i].name;
					}
					if (item.luas[i].type == 'dynamic_proxy') {
						item.dynamic_proxy = item.luas[i].name;
					}
				}
			})
		})
	}

	addLocation() {
		let locationScope = this;
		let api = this._API;
		let TipService = this._services.TipService;
		locationScope.locationItem.luas = locationScope.luasArray.join();
		locationScope.locationItem.internal = locationScope.locationItem.internal === '' ? false : locationScope.locationItem.internal;
		api.location.save({},
			locationScope.locationItem, (data) => {
				data.status ? TipService.setMessage('添加成功', 'success') : TipService.setMessage('添加失败', 'danger');
				locationScope.getLocation();
				$('#location').modal('hide');
			})
	}


	delLocation(locationId) {
		let locationScope = this;
		let api = this._API;
		let TipService = this._services.TipService;
		api.delLocation.delete({
			locationId: locationId
		}, (data) => {
			data.status ? TipService.setMessage('删除成功', 'success') : TipService.setMessage('删除失败', 'danger');
			locationScope.getLocation();
			$('#location-del').modal('hide');
		})
	}

	getLocationId(index, type) {
		let locationScope = this;
		locationScope.initLocationModal();
		Object.assign(locationScope.locationModal, locationScope.locations[index]);
		locationScope.locationModal.upstreamId = locationScope.locationModal.upstream.upstreamId;
		if (locationScope.locationModal.auth) {
			for (let i = 0, len = locationScope.locationModal.luas.length; i < len; i++) {
				if (locationScope.locationModal.auth == locationScope.locationModal.luas[i].name) {
					locationScope.luasArray[0] = locationScope.locationModal.luas[i].luaId.toString();
				}
			}
		}
		if (locationScope.locationModal.dynamic_proxy) {
			for (let i = 0, len = locationScope.locationModal.luas.length; i < len; i++) {
				if (locationScope.locationModal.dynamic_proxy == locationScope.locationModal.luas[i].name) {
					locationScope.luasArray[1] = locationScope.locationModal.luas[i].luaId.toString();
				}
			}
		}
		type == 'setting' ? $('#location-setting').modal('show') : $('#location-del').modal('show');
	}

	editLocation(locationModal) {
		let locationScope = this;
		let api = this._API;
		let TipService = this._services.TipService;
		locationModal.luas = locationScope.luasArray.join();
		api.location.update({
			urimatch: locationModal.urimatch,
			internal: locationModal.internal,
			defaultType: locationModal.defaultType,
			excmd: locationModal.excmd,
			include: locationModal.include,
			locationId: locationModal.locationId,
			locationName: locationModal.locationName,
			rewrite: locationModal.rewrite,
			upstreamId: locationModal.upstreamId,
			proxyConf: locationModal.proxyConf,
			luas: locationModal.luas
		}, (data) => {
			locationScope.getLocation();
			$('#location-setting').modal('hide');
			locationScope.initLocationModal();
			data.status ? TipService.setMessage('修改成功', 'success') : TipService.setMessage('修改失败', 'danger');
		}, () => {
			locationScope.getLocation();
			$('#location-setting').modal('hide');
			TipService.setMessage('修改失败', 'danger');
		})
	}

	onChangeLua() {
		let locationScope = this;
		if (locationScope.luasArray[1]) {
			locationScope.haveDynamic = true;
			locationScope.locationModal.upstreamId = '';
		} else {
			locationScope.haveDynamic = false;

		}
	}


}

export default angular.module('ual.location', [])
	.controller('locationCtrl', locationCtrl)
	.name;