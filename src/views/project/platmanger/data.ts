import { computed } from 'vue';
import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  export const columns = computed<TableColumnData[]>(() => [
    {
      title: '排序',
      dataIndex: 'order_id',
      width:80,
      align:"center"
    },
    {
      title: '类型',
      dataIndex: 'account_type',
      align:"center"
    },
    {
      title: '说明',
      dataIndex: 'remark',
      align:"center"
    },
    {
      title: '创建时间',
      dataIndex: 'createtime',
      slotName: 'createtime',
      align:"center"
    },
    {
      title: '操作',
      dataIndex: 'operations',
      slotName: 'operations',
      align:"center"
    },
  ]);
