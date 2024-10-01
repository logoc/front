import { computed } from 'vue';
import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  export const columns = computed<TableColumnData[]>(() => [
    {
      title: '账户(手机号)',
      dataIndex: 'username',
      slotName: 'username',
    },
    {
      title: '头像',
      dataIndex: 'avatar',
      slotName: 'avatar',
      align:"center"
    },
    {
      title: '角色',
      dataIndex: 'rolename',
    },
    {
      title: '用户名',
      dataIndex: 'name',
      slotName: 'name',
    },
    {
      title: '备注',
      dataIndex: 'remark',
      slotName: 'remark',
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