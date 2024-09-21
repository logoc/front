import { computed } from 'vue';
import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
export const columns = computed<TableColumnData[]>(() => [
    {
      title:  '编号',
      dataIndex: 'id',
      slotName: 'id',
      width: 60,
      align:'center'
    },
     {
       title:  '上传时间',
       dataIndex: 'create_time',
       slotName: 'create_time',
       width: 90,
       align:'center'
     },
     {
      title:  '发文数',
      dataIndex: 'project_count',
      slotName: 'project_count',
      width: 40,
      align:'center'
    },
    {
      title:  '文件名称',
      dataIndex: 'file_name',
      slotName: 'file_name',
      width: 150,
      align:'center'
    },
    {
      title:  '审批状态',
      dataIndex: 'approve_status',
      slotName: 'approve_status',
      width: 60,
      align:'center'
    },
    {
      title:  '审批信息',
      dataIndex: 'approve_note',
      slotName: 'approve_note',
      width: 100,
      align:'center'
    },
    {
      title: '操作',
      dataIndex: 'operations',
      slotName: 'operations',
      width: 80,
      fixed: 'right',
      align:"center"
    
    },
  ]);
