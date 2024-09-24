import { defHttp } from '@/utils/http';
enum Api {
    getList = '/project/upconfig/get_list',
    upConfig = '/project/upconfig/up_config',
    del = '/project/upconfig/del',
    save = '/project/upconfig/save',
    isExist = '/project/upconfig/get_exist',
}

export function save(params: object) {
  return defHttp.post({ url: Api.save, params:params }, { errorMessageMode: 'none' });
}

export function getList(params: object) {
  return defHttp.get({ url: Api.getList, params:params }, { errorMessageMode: 'none' });
}

export function upConfig(params: object) {
  return defHttp.get({ url: Api.upConfig, params:params }, { errorMessageMode: 'none' });
}
export function del(params: object) {
  return defHttp.delete({ url: Api.del, params:params }, { errorMessageMode: 'none' });
}

export function isExist(params: object) {
  return defHttp.get({ url: Api.isExist, params:params }, { errorMessageMode: 'none' });
}