/**
 * Created by Anly.Z on 16/6/27.
 */
import {Inject} from 'angular-es-utils';

@Inject('API', 'services')
class locationCtrl {
	constructor() {
		let locationScope = this;
		let api = this._API;
		locationScope.luasArray =[];
		locationScope.locationItem = {
			urimatch: '',
			internal: '',
			rewrite: '',
			upstreamId: '',
			luaId: '',
			defaultType: '',
			excmd: '',
			proxyConf:'',
			include: '',
			locationName:''
		};
		api.getUpstreams.get({}, (data) => {
			locationScope.upstreams = data.upstreams;
		});

		api.getLua.get({}, (data) => {
			locationScope.luas = data.luas;
		});

		locationScope.getLocation();
	}

	initLocationModal() {
		let locationScope = this;
		locationScope.locationModal = {
			urimatch: '',
			internal: '',
			rewrite: '',
			upstream: {},
			luas: {},
			defaultType: '',
			excmd: '',
			proxyConf:'',
			include: '',
			locationName:''
		}
	}

	getLocation() {
		let locationScope = this;
		let api = this._API;
		api.getLocations.get({}, (data) => {
			locationScope.locations = data.locations;
		})
	}

	addLocation() {
		let locationScope = this;
		let api = this._API;
		let TipService = this._services.TipService;
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
		locationScope.locationModal = locationScope.locations[index];
		type == 'setting' ? $('#location-setting').modal('show') : $('#location-del').modal('show');
	}

	editLocation(locationModal) {
		let locationScope = this;
		let api = this._API;
		let TipService = this._services.TipService;
		api.location.update({
			urimatch: locationModal.urimatch,
			internal: locationModal.internal,
			defaultType: locationModal.defaultType,
			excmd: locationModal.excmd,
			include: locationModal.include,
			locationId: locationModal.locationId,
			rewrite: locationModal.rewrite,
			upstreamId: locationModal.upstream.upstreamId,
			luaId: locationModal.lua.luaId
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


}

export default angular.module('ual.location', [])
	.controller('locationCtrl', locationCtrl)
	.name;