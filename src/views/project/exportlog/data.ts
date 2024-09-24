import { computed } from 'vue';
import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
export const columns = computed<TableColumnData[]>(() => [

     {
      title:  '用户',
      dataIndex: 'name',
      slotName: 'name',
      width: 100,
      align:'center'
    },
    {
      title:  '下载条数',
      dataIndex: 'download_cnt',
      slotName: 'download_cnt',
      width: 80,
      align:'center'
    },
    {
      title:  '下载日期',
      dataIndex: 'createtime',
      slotName: 'createtime',
      width: 100,
      align:'center'
    },
    {
      title:  '下载文件链接',
      dataIndex: 'file_url',
      width: 120,
      align:'center'
    },
  ]);
