import { defHttp } from '@/utils/http';
import { UploadFileParams } from '/#/axios';

enum Api {
  getList = '/project/upfile/get_list',
  del = '/project/upfile/del',
}
export function getList(params: object) {
  return defHttp.get({ url: Api.getList, params:params }, { errorMessageMode: 'none' });
}

//删除数据
export function del(params: object) {
  return defHttp.delete({ url: Api.del, params:params}, { errorMessageMode: 'message' });
}
//上传文件
export interface UploadItem {
    id: number;
    name: string;
    response: string;
    status: string;
    time: number;
    uid: string;
  }
//获取配置中的上传文件路径
const DOMAIN =import.meta.env.VITE_APP_ENV=="production"? window?.globalConfig.Upinfile_url: window?.globalConfig.Upinfile_url_dev;
export function uploadExcelApi(
  params: UploadFileParams,
  onUploadProgress?: (progressEvent: any) => void
) {
  return defHttp.uploadFile<UploadItem>({ url:`${DOMAIN}/project/upfile/uploadExcel`,onUploadProgress},params);
}