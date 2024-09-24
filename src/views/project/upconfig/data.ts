import { computed } from 'vue';
import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
export const columns = computed<TableColumnData[]>(() => [
     {
       title:  '编号',
       dataIndex: 'id',
       width: 100,
       align:'center'
     },
    {
      title:  '名称',
      dataIndex: 'cate',
      slotName: 'cate',
      width: 100,
      align:'center'
    },
    {
      title:  '类型',
      dataIndex: 'cate_type',
      slotName: 'cate_type',
      width: 100,
      align:'center'
    },
    {
      title:  '创建时间',
      dataIndex: 'createtime',
      slotName: 'createtime',
      width: 100,
      align:'center'
    },
    {
      title:  '排序',
      dataIndex: 'cate_id',
      slotName: 'cate_id',
      width: 80,
      align:'center'
    },
    {
      title: '操作',
      dataIndex: 'operations',
      slotName: 'operations',
      width: 100,
      fixed: 'right',
      align:"center"
    
    },
  ]);
