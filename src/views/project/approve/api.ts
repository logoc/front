import { defHttp } from '@/utils/http';

enum Api {
  getList = '/project/approve/get_list',
  del  = '/project/approve/del',

}
export function getList(params: object) {
  return defHttp.get({ url: Api.getList, params:params }, { errorMessageMode: 'none' });
}

export function del(params: object) {
  return defHttp.delete({ url: Api.del, params:params}, { errorMessageMode: 'message' });
}

