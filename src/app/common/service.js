/**
 * Created by Anly.Z on 16/6/12.
 */

import angular from 'angular';
import {Inject} from 'angular-es-utils';

@Inject('$timeout')
class services {
	constructor() {
		this.unique = (arr) => {
			var result = [], hash = {};
			for (var i = 0, elem; (elem = arr[i]) != null; i++) {
				if (!hash[elem]) {
					result.push(elem);
					hash[elem] = true;
				}
			}
			return result;
		};

		this.TipService = {
			message: null,
			type: null,
			setMessage: (msg, type) => {

				this.TipService.message = msg;
				this.TipService.type = type;

				//提示框显示最多3秒消失
				this._$timeout(() => {
					this.TipService.clear();
				}, 3000);
			},
			clear: () => {
				this.TipService.message = null;
				this.TipService.type = null;
			}
		};

		this.leftNavText = {
			text:null,
			setText:(txt) => {
				this.leftNavText.text = txt;
			}
		};
	}


}

export default angular.module('ual.services', [])
	.service('services', services)
	.name;

