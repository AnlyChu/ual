/**
 * Created by Anly.Z on 16/6/27.
 */
import {Inject} from 'angular-es-utils';

@Inject('$location','services')
class leftCtrl {
	constructor() {
		let text = this._$location.$$url.split('/')[2];
		if(text == 'nginx'){
			this.navTxt = '主机';
		} else if(text == 'location'){
			this.navTxt = '转发规则';
		} else if(text == 'consul'){
			this.navTxt = '集群';
		} else if(text == 'lua'){
			this.navTxt = '脚本';
		} else if(text == 'upstream'){
			this.navTxt = '后端服务';
		} else if(text == 'server'){
			this.navTxt = '监听器';
		}

		this.listText = this._services.leftNavText;
	}

	navHeader(type) {
		this.navTxt = type;
	}

}


export default angular.module('ual.left', [])
	.controller('leftCtrl', leftCtrl)
	.name;