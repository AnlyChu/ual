/**
 * Created by Anly.Z on 16/6/24.
 */
import {Inject} from 'angular-es-utils';

@Inject('services', 'API')
class consulCtrl {
    constructor() {
        let consulScope = this;
        consulScope.consulAddModal = {
            consulName: '',
            address: ''
        };
        consulScope.getConsuls();
    }

    getConsuls() {
        let consulScope = this;
        let api = this._API;
        api.getConsuls.get({}, (data) => {
            consulScope.consul = data;s
        });
    }

    addConsul() {
        let consulScope = this;
        let api = this._API;
        let TipService = this._services.TipService;
        api.consul.save({},
            consulScope.consulAddModal, (data) => {
                if (data.status) {
                    TipService.setMessage('添加成功', 'success');
                } else {
                    TipService.setMessage('添加失败', 'danger');
                }
                consulScope.getConsuls();
                $('#consul').modal('hide');
            })
    }

    delConsul(consulId) {
        let consulScope = this;
        let api = this._API;
        let TipService = this._services.TipService;
        api.delConsul.delete({
            consulId: consulId
        }, (data) => {
            if (data.status) {
                TipService.setMessage('删除成功', 'success');
            } else {
                TipService.setMessage('删除失败', 'danger');
            }
            consulScope.getConsuls();
            $('#consul-del').modal('hide');
        })
    }

    getConsulId(index, type) {
        let consulScope = this;
        if (type == 'del') {
            consulScope.consulModal = consulScope.consul.consuls[index];
            $('#consul-del').modal('show');
        } else if (type == 'setting') {
            consulScope.consulModal = consulScope.consul.consuls[index];
            $('#consul-setting').modal('show');
        }
    }

    editConsul(consulModal) {
        let consulScope = this;
        let api = this._API;
        let TipService = this._services.TipService;
        api.consul.update({},
            consulModal, (data) => {
                consulScope.getConsuls();
                $('#consul-setting').modal('hide');
                if (data.status) {
                    TipService.setMessage('修改成功', 'success');
                } else {
                    TipService.setMessage('修改失败', 'danger');
                }

            })
    }
}

export default angular.module('ual.consulCtrl',[])
    .controller('consulCtrl', consulCtrl)
    .name;
