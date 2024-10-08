<template>
  <div class="container" >
    <Breadcrumb :items="[route.matched[0].meta.locale, route.meta.locale]" />
    <a-card class="general-card onelineCard" style="height: calc(100% - 50px);">
      <a-row style="margin-bottom: 10px">
        <a-col :span="24" >
          <a-space size="large">
            <a-select v-model="formModel.platform" @change="handleChangePlat"  placeholder="不限" :style="{width:'220px'}">
              <template #prefix>平台类型:</template>
              <a-option v-for="item in platformList" :value="item.plat_name">{{ item.plat_name }}</a-option>
            </a-select>
            <a-select v-model="formModel.fansCnt" :options="fansCntOptions" placeholder="不限" :style="{width:'220px'}" >
              <template #prefix>粉丝数:</template>
            </a-select>
            <a-select v-model="formModel.priceRange" :options="pricesOptions" placeholder="不限" :style="{width:'250px'}" >
              <template #prefix>
                平台价:
              </template>
            </a-select>
          </a-space>
        </a-col>
      </a-row>

      <a-row style="margin-bottom: 10px">
        <a-col :span="24" >
          <a-checkbox-group v-model="formModel.accountType" >
            <a-tag size="large">账号类型:</a-tag>
            <template v-for="item in accountTypeList" :key="item" >
              <a-checkbox :value="item.account_type">
                <template #checkbox="{ checked }">
                  <a-tag size="large" :checked="checked" default-checked checkable color="arcoblue">{{ item.account_type }}</a-tag>
                </template>
              </a-checkbox>
            </template>
          </a-checkbox-group>
        </a-col>
      </a-row>

      <a-row style="margin-bottom: 10px">
      <a-col :span="14">
        <a-space>
          <a-input :style="{width:'300px'}" v-model="formModel.accountNikeName" placeholder="账号昵称" allow-clear >
            <template #prefix>账号昵称: </template>
          </a-input>
          <a-select :style="{width:'200px'}" :options="cooperateOptions" v-model="formModel.cooperateTime" placeholder="合作时间" >
            <template #prefix>合作时间: </template>
          </a-select>
        </a-space>
      </a-col>
      <a-col :span="10" style="text-align:right;">
        <a-space> 
          <a-button type="primary" @click="search">
            <template #icon>
              <icon-search />
            </template>
            查询
          </a-button>
          <a-button @click="reset">
            {{ $t('searchTable.form.reset') }}
          </a-button>
          <a-checkbox v-model="formModel.downloadAll">全选下载</a-checkbox>
          <a-button type="primary" @click="download">
            <template #icon>
              <icon-download />
            </template>导出
          </a-button>
        </a-space>
      </a-col>
      </a-row>

      <a-table
        :row-selection="rowSelection"
        v-model:selectedKeys="formModel.selectedKeys"
        row-key="id"
        :loading="loading"
        :pagination="pagination"
        :columns="(cloneColumns as TableColumnData[])"
        :data="renderData"
        :bordered="{wrapper:true,cell:true}"
        size="large"
        :scroll="{x:800}"
        :default-expand-all-rows="true"
        ref="artable"
        @page-change="handlePaageChange" 
        @page-size-change="handlePaageSizeChange" 
      >
        <template #cooperate_time="{ record }">
            {{dayjs(record.cooperate_time*1000).format("YYYY-MM-DD")}}
          </template> 
        <template #publish_link="{ record }">
          <a-link :href="record.publish_link" status="success" target="_blank">{{record.publish_link}}</a-link>
        </template>
        <template #operations="{ record }">
          <Icon icon="svgfont-chakan" class="iconbtn" @click="handleEdit(record)" :size="18" color="#0960bd"></Icon>
        </template>
      </a-table>
    </a-card>
    <!--表单-->
    <ViewForm @register="registerModal" @success="handleData"/>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, reactive, watch, onMounted } from 'vue';
  import useLoading from '@/hooks/loading';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import cloneDeep from 'lodash/cloneDeep';
  import dayjs from 'dayjs';
  //api
  import { getSearch, exportData, AccountItem, getPlatList, PlatItem, getAccountList} from '@/api/project/project';
  //数据
  import { columns } from './data';
  //表单
  import { useModal } from '/@/components/Modal';
  import ViewForm from './ViewForm.vue';
  import {Icon} from '@/components/Icon';
  import { Message } from '@arco-design/web-vue';
  import { Pagination } from '@/types/global';
  import { useRoute } from 'vue-router'
  const route = useRoute();
  const [registerModal, { openModal }] = useModal();
  const platformList = ref<PlatItem[]>([]);
  const accountTypeList = ref<AccountItem[]>([]);

  const rowSelection = reactive({
      type: 'checkbox',
      showCheckedAll: true,
      onlyCurrent: false,
    });

  //分页
  const basePagination: Pagination = {
    current: 1,
    pageSize: 10,
  };
  const pagination = reactive({
    ...basePagination,
    showTotal:true,
    showPageSize:true,
  });
  const boxheight=document.documentElement.clientHeight;//页面高度
  type SizeProps = 'mini' | 'small' | 'medium' | 'large';
  type Column = TableColumnData & { checked?: true };
  const { loading, setLoading } = useLoading(true);
  const renderData = ref([]);
  const cloneColumns = ref<Column[]>([]);
  const showColumns = ref<Column[]>([]);
  const size = ref<SizeProps>('large');
   //查询字段
   const generateFormModel = () => {
    return {
      platform: ['不限'],
      fansCnt: '0',
      priceRange: '0',
      accountType: ref(['不限']),
      projectNo: '',
      cooperateTime: 0,
      accountNikeName: "",
      downloadAll: false,
      selectedKeys: [],
    };
  };
  const formModel = ref(generateFormModel());
  const fetchData = async () => {
    setLoading(true);
    try {
      // alert(JSON.stringify(formModel.value));
      const data= await getSearch({page:pagination.current,pageSize:pagination.pageSize,...formModel.value});
      renderData.value = data.items;
      pagination.current = data.page;
      pagination.total = data.total;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };


  const fetchPlatList = async () => {
    try {
      platformList.value.push({plat_name:"不限",id:0, order_id:0})
      const data= await getPlatList({});
      accountTypeList.value.length = 0
      for (let item of data) {
        platformList.value.push(item)
      }
    } catch (err) {
      // you can report use errorHandler or other
    }
  };

  // 选择平台类型
  const handleChangePlat=async ()=>{
    try {
      const data= await getAccountList({plat_name:formModel.value.platform});
      accountTypeList.value.length = 0
      for (let item of data.items) {
        accountTypeList.value.push(item)
      }
      formModel.value.accountType = []
    } catch (err) {
      // you can report use errorHandler or other
    }
  };

  //组件挂载完成后执行的函数
  onMounted(()=>{
    })
  //查找
  const search = () => {  
    pagination.current = 1;
    fetchData();
  };
  const reset = () => {
    formModel.value = generateFormModel();
    fetchData();
  };
  var now = dayjs().format('YYYYMMDD_HHmmss')
  // const DOMAIN = window?.globalConfig.Main_url;
  const download = async () => {
    try {
      if (!formModel.value.downloadAll && formModel.value.selectedKeys.length == 0) {
        Message.warning({content:"请选择点选下载内容",id:"upStatus"})
        return
      }
      const res = await exportData(formModel.value);
      if (res.status == 200) {
        const blob = new Blob([res.data], {type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})
        const downloadUrl = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = downloadUrl
        link.download = '数据下载_'+now+'.xlsx'
        link.click()
      } else {
        Message.error({content:"下载失败!", id:"upStatus"})
      }
    } catch(error) {
      Message.error({content:"下载失败",id:"upStatus"})
    }
    // alert(JSON.stringify(formModel.value));
  };

  fetchData();
  fetchPlatList();
  watch(
    () => columns.value,
    (val) => {
      cloneColumns.value = cloneDeep(val);
      cloneColumns.value.forEach((item, index) => {
        item.checked = true;
      });
      showColumns.value = cloneDeep(cloneColumns.value);
    },
    { deep: true, immediate: true }
  );

  //编辑数据
  const handleEdit=async(record:any)=>{
    openModal(true, {
      isUpdate: true,
      record:record
    });
  }
  //更新数据
  const handleData=async()=>{
    fetchData();
  }
  //分页
  const handlePaageChange = (page:any) => {
    pagination.current=page
    fetchData();
  }
  //分页总数
  const handlePaageSizeChange = (pageSize:any) => {
    pagination.pageSize=pageSize
    fetchData();
  }

  //状态
  const platOptions = [
    {
      label: "不限",
      value: 0,
    },
    {
      label: "抖音",
      value: 1,
    },
    {
      label: "小红书",
      value: 2,
    },
    {
      label: "快手",
      value: 3,
    },
    {
      label: "视频号",
      value: 4,
    },
    {
      label: "微博",
      value: 5,
    },
    {
      label: "其他",
      value: 6,
    },
  ];

  //粉丝数目
  const fansCntOptions = [
    {
      label: "不限",
      value: "0",
    },
    {
      label: "1万以下",
      value: "0-10000",
    },
    {
      label: "1～5万",
      value: "1-50000",
    },
    {
      label: "5～10万",
      value: "50000-100000",
    },
  ];
  //粉丝数目
  const pricesOptions = [
    {
      label: "不限",
      value: "0",
    },
    {
      label: "1000元以下",
      value: "0-1000",
    },
    {
      label: "1000～5000元",
      value: "1000-5000",
    },
    {
      label: "5000～10000元",
      value: "5000-10000",
    },
    {
      label: "1万元～5万元",
      value: "100000-500000",
    },
    {
      label: "5万元～20万元",
      value: "500000-2000000",
    },
    {
      label: "20万元以上",
      value: "2000000-1000000000",
    },
  ];
  // 合作时间
  const cooperateOptions = [
  {
      label: "不限",
      value: 0,
    },
    {
      label: "近30天",
      value: 30,
    },
    {
      label: "近90天",
      value: 90,
    },
    {
      label: "近180天",
      value: 180,
    },
    {
      label: "近1年",
      value: 365,
    },
  ];

</script>

<script lang="ts">
  export default {
    name: 'article',
  };
</script>

<style scoped lang="less">
  .container {
    padding: 0 20px 20px 20px;
    height: 100%;
  }
  :deep(.arco-table-th) {
    &:last-child {
      .arco-table-th-item-title {
        margin-left: 16px;
      }
    }
  }
  .action-icon {
    margin-left: 12px;
    cursor: pointer;
  }
  .active {
    color: #0960bd;
    background-color: #e3f4fc;
  }
  .setting {
    display: flex;
    align-items: center;
    width: 200px;
    .title {
      margin-left: 12px;
      cursor: pointer;
    }
  }
  :deep(.general-card > .arco-card-header){
    padding: 10px 16px;
  }
  .iconbtn{
    user-select: none;
    cursor: pointer;
    opacity: .8;
    &:hover{
      opacity: 1;
    }
  }

  .tablebox{
    min-height: 496px;
      //分类标题背景色
      :deep(.arco-table-th){
        background-color: var(--color-neutral-3);
      }
      :deep(.arco-table-tr-checked .arco-table-td){
        color: rgb(var(--primary-6));
      }
  }

  .custom-checkbox-card-checked {
    border-color: antiquewhite;
  }

</style>
