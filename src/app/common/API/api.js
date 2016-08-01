/**
 * Created by Anly.Z on 16/6/12.
 */

import angular from 'angular';
import genResource, {setApiPrefix,defaultHttpConfigs} from 'angular-es-utils/rs-generator';
import services from '../service.js'

class API {
	constructor() {
		// 设置rest api前缀
		setApiPrefix('');

// 设置请求通用配置
		defaultHttpConfigs.headers = {
			'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
		};

		this.api = this.resourceAPI();
		return Object.assign(this.api);
	}

	requestInterceptor(obj) {
		var array = [];
		for (var p in obj)
			array.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
		return array.join("&");
	}

	resourceAPI(){
		let api = {
			/* consul */
			getConsuls: genResource('/v1/registrys',false, {}),

			delConsul: genResource('/v1/registry/:consulId',false, {
				consulId: '@consulId'
			}),

			consul: genResource('/v1/registry',false, {}, {
				save: {
					method: 'POST',
					
					transformRequest: this.requestInterceptor
				},
				update: {
					method: 'PUT',
					
					transformRequest: this.requestInterceptor
				}
			}),
			/* upstream */
			getUpstreams: genResource('/v1/upstreams',false, {}),

			upstream: genResource('/v1/upstream', false,{}, {
				save: {
					method: 'POST',
					
					transformRequest: this.requestInterceptor
				},
				update: {
					method: 'PUT',
					
					transformRequest: this.requestInterceptor
				}
			}),

			delUpstream: genResource('/v1/upstream/:upstreamId',false, {
				upstreamId: '@upstreamId'
			}),


			/* locations */
			getLocations: genResource('/v1/locations',false, {}),

			delLocation: genResource('/v1/location/:locationId',false, {
				locationId: '@locationId'
			}),

			location: genResource('/v1/location',false, {}, {
				save: {
					method: 'POST',
					
					transformRequest: this.requestInterceptor
				},
				update: {
					method: 'PUT',
					
					transformRequest: this.requestInterceptor
				}
			}),

			/* lua */
			getLua: genResource('/v1/luas',false, {}),

			delLua: genResource('/v1/lua/:luaId',false, {
				luaId: '@luaId'
			}),

			lua: genResource('/v1/lua',false, {}, {
				save: {
					method: 'POST',
					
					transformRequest: this.requestInterceptor
				},
				update: {
					method: 'PUT',
					
					transformRequest: this.requestInterceptor
				}
			}),

			/* nginx nginxGroup*/
			getNginx: genResource('/v1/nginxs',false, {}),

			nginx: genResource('/v1/nginx',false, {}, {
				update: {
					method: 'PUT',
					
					transformRequest: this.requestInterceptor
				}
			}),

			getNginxGroup: genResource('/v1/nginxGroups',false, {}),

			delNginxGroup: genResource('/v1/nginxGroup/:nginxGroupId',false, {
				nginxGroupId: '@nginxGroupId'
			}),

			nginxGroup: genResource('/v1/nginxGroup',false, {}, {
				save: {
					method: 'POST',
					
					transformRequest: this.requestInterceptor
				},
				update: {
					method: 'PUT',
					
					transformRequest: this.requestInterceptor
				}
			}),

			upgradeGroup: genResource('/v1/nginxGroup/version/next',false, {}, {
				update: {
					method: 'PUT',
					
					transformRequest: this.requestInterceptor
				}
			}),

			/* server */
			getServer: genResource('/v1/server/:serverId',false, {
				serverId: '@serverId'
			}),

			getAllServer: genResource('/v1/servers',false, {}),

			server: genResource('/v1/server',false, {}, {
				save: {
					method: 'POST',
					
					transformRequest: this.requestInterceptor
				},
				update: {
					method: 'PUT',
					
					transformRequest: this.requestInterceptor
				}
			}),

			delServer: genResource('/v1/server/:serverId',false, {
				serverId: '@serverId'
			}),

			bindLocation: genResource('/v1/server/location',false, {}, {
				save: {
					method: 'POST',
					transformRequest: this.requestInterceptor
				},
				update: {
					method: 'PUT',
					
					transformRequest: this.requestInterceptor
				}
			}),

			unBindLocation: genResource('/v1/server/location/:serverId/:locationId',false, {
				serverId: '@serverId',
				locationId: '@locationId'
			}, {
				save: {
					method: 'POST',
					
					transformRequest: this.requestInterceptor
				},
				update: {
					method: 'PUT',
					
					transformRequest: this.requestInterceptor
				}
			})


		};
		return api;
	}

}

export default angular.module('ual.api', [])
	.service('API', API)
	.name;