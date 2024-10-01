import { defHttp } from '@/utils/http';
enum Api {
    getList = '/platmanager/account/get_list',
    save = '/platmanager/account/save',
    del = '/platmanager/account/del',

    isAccountTypeExist = '/platmanager/account/isaccounttypeexist',
}

export function isAccountTypeExist(params: object) {
    return defHttp.post({ url: Api.isAccountTypeExist, params:params}, { errorMessageMode: 'message',isTransformResponse:false});
}

//列表数据
export function getList(params: object) {
  return defHttp.get({ url: Api.getList, params:params }, { errorMessageMode: 'none' });
}
//提交数据
export function save(params: object) {
    return defHttp.post({ url: Api.save, params:params}, { errorMessageMode: 'message' });
}
//删除数据
export function del(params: object) {
    return defHttp.delete({ url: Api.del, params:params}, { errorMessageMode: 'message' });
}
/**数据类型 */
export interface DataItem {
    id:number,
    name: string;
}
