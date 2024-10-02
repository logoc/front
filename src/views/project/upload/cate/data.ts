import { computed } from 'vue';
import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
export const columns = computed<TableColumnData[]>(() => [
     {
       title:  '合作平台',
       dataIndex: 'platform',
       slotName: 'platform',
       width: 100,
       fixed: 'left',
       align:'center'
     },
     {
      title:  '合作时间',
      dataIndex: 'cooperate_time',
      slotName: 'cooperate_time',
      width: 120,
      align:'center'
    },
     {
       title:  '账号类型',
       dataIndex: 'account_type',
       slotName: 'account_type',
       width: 100,
       align:'center'
     },
     {
      title:  '账号昵称',
      dataIndex: 'account_nikename',
      slotName: 'account_nikename',
      tooltip: {position: 'left'},
      ellipsis: true,
      width: 160,
      align:'center'
    },
     {
      title:  '粉丝数(万)',
      dataIndex: 'fanscnt',
      slotName: 'fanscnt',
      width: 100,
      align:'center'
     },
     {
       title:  '发布链接',
       dataIndex: 'publish_link',
       slotName: 'publish_link',
       ellipsis: true,
       tooltip: {position: 'left'},
       width: 150,
       align:'center'
     },
     {
       title:  '合作形式',
       dataIndex: 'cooperate_type',
       slotName: 'cooperate_type',
       width: 120,
       align:'center'
     },
     {
       title:  '平台价/刊例',
       dataIndex: 'platform_price',
       slotName: 'platform_price',
       width: 120,
       align:'center'
     },
     {
      title: '执行价（含税）',
      dataIndex: 'actual_price',
      slotName: 'actual_price',
      width: 150,
      align:"center"
    },
    {
      title: '折扣说明',
      dataIndex: 'discount_note',
      slotName: 'discount_note',
      width: 100,
      align:"center"
    },
    {
      title: '税率',
      dataIndex: 'tax_rate',
      slotName: 'tax_rate',
      width: 120,
      align:"center"
    },
    {
      title: '事业部',
      dataIndex: 'department',
      slotName: 'department',
      width: 120,
      align:"center"
    },
    {
      title: '项目号',
      dataIndex: 'projectno',
      slotName: 'projectno',
      ellipsis: true,
      tooltip: true,
      width: 160,
      align:"center"
    },    
    {
      title: '项目名称',
      dataIndex: 'project_name',
      slotName: 'project_name',
      tooltip: true,
      ellipsis: true,
      width: 180,
      align:"center"
    },
    {
      title: '支付单号',
      dataIndex: 'payno',
      slotName: 'payno',
      ellipsis: true,
      tooltip: {position: 'left'},
      width: 160,
      align:"center"
    },
    {
      title: '供应商名称',
      dataIndex: 'supply_name',
      slotName: 'supply_name',
      ellipsis: true,
      tooltip: {position: 'left'},
      width: 160,
      align:"center"
    },
    {
      title: '联系方式',
      dataIndex: 'contact',
      slotName: 'contact',
      ellipsis: true,
      tooltip: {position: 'left'},
      width: 160,
      align:"center"
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
