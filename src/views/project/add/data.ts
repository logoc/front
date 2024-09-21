import { computed } from 'vue';
import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
export const columns = computed<TableColumnData[]>(() => [
     {
       title:  '合作平台',
       dataIndex: 'id',
       width: 100,
       align:'center'
     },
     {
      title:  '合作时间',
      dataIndex: 'mimetype',
      slotName: 'mimetype',
      width: 100,
      align:'center'
    },
     {
       title:  '账号类型',
       dataIndex: 'title',
       width: 100,
       align:'center'
     },
     {
      title:  '账号昵称',
      dataIndex: 'title',
      width: 100,
      align:'center'
    },
     {
      title:  '粉丝数',
      dataIndex: 'type',
      width: 100,
      slotName: 'type',
      align:'center'
     },
     {
       title:  '发布链接',
       dataIndex: 'catename',
       width: 120,
       align:'center'
     },
     {
       title:  '合作形式',
       dataIndex: 'filesize',
       slotName: 'filesize',
       width: 120,
       align:'center'
     },
     {
       title:  '平台价/刊例',
       dataIndex: 'status',
       slotName: 'status',
       width: 120,
       align:'center'
     },
     {
      title: '执行价（含税）',
      dataIndex: 'createtime',
      slotName: 'createtime',
      width: 130,
      align:"center"
    },
    {
      title: '折扣说明',
      dataIndex: 'createtime',
      slotName: 'createtime',
      width: 120,
      align:"center"
    },
    {
      title: '税率',
      dataIndex: 'createtime',
      slotName: 'createtime',
      width: 120,
      align:"center"
    },
    {
      title: '事业部',
      dataIndex: 'createtime',
      slotName: 'createtime',
      width: 120,
      align:"center"
    },
    {
      title: '项目号',
      dataIndex: 'createtime',
      slotName: 'createtime',
      width: 120,
      align:"center"
    },    
    {
      title: '项目名称',
      dataIndex: 'createtime',
      slotName: 'createtime',
      width: 120,
      align:"center"
    },
    {
      title: '支付单号',
      dataIndex: 'createtime',
      slotName: 'createtime',
      width: 120,
      align:"center"
    },
    {
      title: '供应商名称',
      dataIndex: 'createtime',
      slotName: 'createtime',
      width: 120,
      align:"center"
    },
    {
      title: '联系方式',
      dataIndex: 'createtime',
      slotName: 'createtime',
      width: 120,
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
