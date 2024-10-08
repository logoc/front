import { computed } from 'vue';
import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
export const columns = computed<TableColumnData[]>(() => [
     {
      title:  '用户',
      dataIndex: 'name',
      slotName: 'name',
      width: 80,
      align:'center'
    },
    {
      title:  '文件名',
      dataIndex: 'file_name',
      slotName: 'file_name',
      ellipsis: true,
      tooltip: {position: 'left'},
      width: 200,
      align:'center'
    },
    {
      title:  '条数',
      dataIndex: 'project_count',
      slotName: 'project_count',
      width: 50,
      align:'center'
    },
     {
       title:  '上传时间',
       dataIndex: 'create_time',
       slotName: 'create_time',
       width: 120,
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
      title:  '审批时间',
      dataIndex: 'approve_time',
      slotName: 'approve_time',
      width: 120,
      align:'center'
    },
    {
      title:  '审批人',
      dataIndex: 'approve_uid',
      slotName: 'approve_uid',
      width: 80,
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
