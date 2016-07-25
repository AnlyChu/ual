/**
 * Created by Anly.Z on 16/6/27.
 */
import {Inject} from 'angular-es-utils';

@Inject('$scope', '$location')
class leftCtrl {
	constructor() {
		this._$scope.navTxt = this._$location.$$url.split('/')[2];
		this._$scope.navHeader = (type) => this._$scope.navTxt = type;
	}
}


export default angular.module('ual.left', [])
	.controller('leftCtrl', leftCtrl)
	.name;