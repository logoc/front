import { defHttp } from '@/utils/http';
import { UploadFileParams } from '/#/axios';
import { join } from 'lodash';
import axios from 'axios';
enum Api {
    getSearch = '/project/project/get_search',
    getSearchOwner = '/project/project/get_search_owner',
    getContent= '/project/project/get_content',
    save = '/project/project/save',
    update = '/project/project/update',
    upStatus = '/project/project/upStatus',
    exportData = '/project/project/get_export',
    exportDataOwner = '/project/project/get_export_owner',
    del = '/project/project/del',
    getExportLog = '/project/project/get_exportlog',
    getCateList = '/project/upconfig/get_list_nopage',
    
}

//列表数据
export function getCateList(params: object) {
  return defHttp.get({ url: Api.getCateList, params:params }, { errorMessageMode: 'none' });
}

export function getSearchOwner(params: object) {
  return defHttp.get({ url: Api.getSearchOwner, params:params }, { errorMessageMode: 'none' });
}
export function getSearch(params: object) {
  return defHttp.get({ url: Api.getSearch, params:params }, { errorMessageMode: 'none' });
}
//获取内容
export function getContent(params: object) {
  return defHttp.get({ url: Api.getContent, params:params }, { errorMessageMode: 'none' });
}
//提交数据
export function save(params: object) {
    return defHttp.post({ url: Api.save, params:params}, { errorMessageMode: 'message' });
}
//更新状态
export function upStatus(params: object) {
    return defHttp.post({ url: Api.upStatus, params:params}, { errorMessageMode: 'message' });
}

//更新状态
export function update(params: object) {
  return defHttp.post({ url: Api.update, params:params}, { errorMessageMode: 'message' });
}
//删除数据
export function del(params: object) {
    return defHttp.delete({ url: Api.del, params:params}, { errorMessageMode: 'message' });
}

//下载内容
export function exportData(params: object) {
  return defHttp.get({ url: Api.exportData, params:params, responseType:'arraybuffer' }, { isReturnNativeResponse: true });
}

//下载内容
export function exportDataOwner(params: object) {
  return defHttp.get({ url: Api.exportDataOwner, params:params, responseType:'arraybuffer' }, { isReturnNativeResponse: true });
}
export function getExportLog(params: object) {
  return defHttp.get({ url: Api.getExportLog, params:params }, { errorMessageMode: 'message' });
}


/**数据类型 */
export interface DataItem {
    id:number,
    name: string;
}

//上传文件
export interface UploadItem {
    id: number;
    name: string;
    response: string;
    status: string;
    time: number;
    uid: string;
    url: string;
  }
//获取配置中的上传文件路径
const DOMAIN =import.meta.env.VITE_APP_ENV=="production"? window?.globalConfig.Root_url: window?.globalConfig.Root_url_dev;
export function userUploadApi(
  params: UploadFileParams,
  onUploadProgress?: (progressEvent: any) => void
) {
  return defHttp.uploadFile<UploadItem>({ url:`${DOMAIN}/matter/picture/uploadFile`,onUploadProgress},params);
}

export interface CateItem {
  id:number,
  cate_type:string,
  cate: string;
}