import { defHttp } from '@/utils/http';
enum Api {
    save = '/project/approve/save',
    getList = '/project/project/get_list',
}

export function save(params: object) {
  return defHttp.post({ url: Api.save, params:params }, { errorMessageMode: 'none' });
}

export function getList(params: object) {
  return defHttp.get({ url: Api.getList, params:params }, { errorMessageMode: 'none' });
}