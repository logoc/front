<template>
  <div class="container" >
    <Breadcrumb :items="[route.matched[0].meta.locale, route.meta.locale]" />
    <a-card class="general-card onelineCard" style="height: calc(100% - 50px);">
      <a-row style="margin-bottom: 10px">
        <a-col
          :span="14"
           style="text-align: left;"
        >
          <a-space>
            <a-input :style="{width:'300px'}" v-model="formModel.name" placeholder="用户名" allow-clear >
              <template #prefix>用户名: </template>
            </a-input>
            <a-range-picker v-model="formModel.createdtime" :style="{width:'400px'}" >
              <template #prefix>下载日期: </template>
            </a-range-picker>
          </a-space>
        </a-col>
        <a-col
          :span="10"
           style="text-align: right;"
        >
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
          </a-space>
        </a-col>
      </a-row>
      <a-table
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
        <template #createtime="{record,column}">
          {{dayjs(record[column.dataIndex]*1000).format("YYYY-MM-DD HH:mm:ss")}}
        </template>

        <template #file_path="{ record }">
          <a-button type="text" @click="handleDownloadFile(record)">
            <template #icon>
              <icon-download />
            </template>
          </a-button> 
        </template>
      </a-table>
    </a-card>
    <!--表单-->
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, reactive, watch, onMounted } from 'vue';
  import useLoading from '@/hooks/loading';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface';
  import { Message } from '@arco-design/web-vue';
  import cloneDeep from 'lodash/cloneDeep';
  import dayjs from 'dayjs';
  //api
  import { getExportLog, getResourceExcelFile } from '@/api/project/project';
  //数据
  import { columns} from './data';
  //表单

  import { useI18n } from 'vue-i18n';
  import { Pagination } from '@/types/global';
  import { useRoute } from 'vue-router'
  const route = useRoute();
  const { t } = useI18n();
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
      name: '',
      createdtime: '',
    };
  };
  const formModel = ref(generateFormModel());
  const fetchData = async () => {
    setLoading(true);
    try {
      const data= await getExportLog({page:pagination.current,pageSize:pagination.pageSize,...formModel.value});
      renderData.value = data.items;
      pagination.current = data.page;
      pagination.total = data.total;
      // nextTick(()=>{
      //   artable.value.expandAll()
      // })
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  //组件挂载完成后执行的函数
  onMounted(()=>{
    })
 //查找
 const search = () => {
    fetchData();
  };
  const reset = () => {
    formModel.value = generateFormModel();
    fetchData();
  };

  const handleDownloadFile = async(record:any) => {
    try {
      const upTime = dayjs(record.createtime*1000).format("YYYYMMDD_HHmmss")
      const res = await getResourceExcelFile(record);
      if (res.status == 200) {
        if (res.data.byteLength == 68) {
          Message.error({content:"下载失败,文件不存在!", id:"upStatus"})
          return
        }
        const blob = new Blob([res.data], {type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})
        const downloadUrl = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = downloadUrl
        link.download = upTime + "_" + record.username + ".xlsx"
        link.click()
      } else {
        Message.error({content:"下载失败!", id:"upStatus"})
      }
    } catch(error) {
      Message.error({content:"下载异常，请求失败,",id:"upStatus"})
    }
    // alert(JSON.stringify(formModel.value));
  };

  fetchData();

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
</style>
