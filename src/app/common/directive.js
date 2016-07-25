/**
 * Created by Anly.Z on 16/6/27.
 */
import template from './tmp/tip.html';
import controller from './directiveCtrl.js';
import {FactoryCreator} from 'angular-es-utils';

class directive {
	constructor() {
		Object.assign(this, {
			restrict: 'E',
			template,
			controller,
			controllerAs: 'ctrl',
			bindToController: {
				message: "=",
				type: "="
			}
		})
	}
}

export default angular.module('tip',[])
	.directive('tip', FactoryCreator.create(directive))
	.name;

