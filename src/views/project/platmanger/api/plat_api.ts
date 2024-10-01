import { defHttp } from '@/utils/http';
enum Api {
    getList = '/platmanager/plat/get_list',
    save = '/platmanager/plat/save',
    del = '/platmanager/plat/del',
    isPlatNameExist = '/platmanager/plat/isplatexist',
}


export function isPlatNameExist(params: object) {
    return defHttp.post({ url: Api.isPlatNameExist, params:params}, { errorMessageMode: 'message',isTransformResponse:false});
}
//列表数据
export function getPlatList(params: object) {
  return defHttp.get({ url: Api.getList, params:params }, { errorMessageMode: 'none' });
}
//提交数据
export function save(params: object) {
    return defHttp.post({ url: Api.save, params:params}, { errorMessageMode: 'message' });
}
//删除数据
export function delPlat(params: object) {
    return defHttp.delete({ url: Api.del, params:params}, { errorMessageMode: 'message' });
}
/**数据类型 */
export interface menuItem {
    id:number,
    remark: string;
    plat_name: string;
    order_id: number;
}
