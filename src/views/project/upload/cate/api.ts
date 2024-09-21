import { defHttp } from '@/utils/http';
enum Api {
    getList = '/project/project/get_list',
}

export function getList(params: object) {
  return defHttp.get({ url: Api.getList, params:params }, { errorMessageMode: 'none' });
}