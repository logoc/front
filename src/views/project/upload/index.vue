<template>
  <div class="container" >
    <Breadcrumb :items="[route.matched[0].meta.locale, route.meta.locale]" />
    <a-card class="general-card onelineCard" style="height: calc(100% - 50px);">
      <a-row style="margin-bottom: 10px">
        <a-col :span="8">
          <a-space>
            <a-upload
                :show-file-list="false"
                :multiple="true"
                :custom-request="customRequest"
            >
            <template #upload-button>
              <a-button type="primary">
                <template #icon>
                  <icon-upload />
                </template>批量上传
              </a-button>
            </template>
            </a-upload>

            <a-button @click="handleDownloadTemplate">
              <template #icon>
                <icon-download />
              </template>
              模版下载
            </a-button>
          </a-space>
        </a-col>

        <a-col
          :span="16"
           style="text-align: right;"
        >
        <a-space>
            <a-input :style="{width:'340px'}"  v-model="formModel.file_name" placeholder="文件名称" allow-clear >
              <template #prefix>
                文件名:
              </template>
            </a-input>
            <a-select :options="statusOptions" v-model="formModel.approve_status" :style="{width:'200px'}" >
              <template #prefix>
                审批状态:
              </template>
            </a-select>
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
        <template #create_time="{ record }">
            {{dayjs(record.create_time*1000).format("YYYY-MM-DD HH:mm:ss")}}
        </template> 
        <template #file_name="{ record }">
          <a-button type="text" @click="handleDownloadFile(record)">
            <template #icon>
              <icon-download />
            </template>
            {{record.file_name}}
          </a-button> 
        </template>
        <template #approve_status="{ record }">
          <span v-if="record.approve_status==0" :style="{color:'gray'}">未审批</span>
          <span v-if="record.approve_status==1" :style="{color:'orangered'}">通过</span>
          <span v-if="record.approve_status==-1" :style="{color:'black'}">不通过</span>
        </template>

        <template #operations="{ record }">
          <Icon icon="svgfont-chakan" class="iconbtn" @click="handleGroup(record)" :size="18" color="#0960bd"></Icon>
          <a-divider direction="vertical" v-if="record.approve_status !== 1" />
          <a-popconfirm  v-if="record.approve_status !== 1" content="您确定要删除吗?" @ok="handleDel(record)">
            <Icon icon="svgfont-icon7" class="iconbtn" :size="18" color="#ed6f6f"></Icon>
          </a-popconfirm>
        </template>
      </a-table>
    </a-card>
    <!--表单-->
    <CateIndex @register="registerCateIndexModal" @success="handleData"/>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, reactive, watch, onMounted } from 'vue';
  import useLoading from '@/hooks/loading';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import cloneDeep from 'lodash/cloneDeep';
  //api
  import { uploadExcelApi, getList, del} from '@/api/project/upfile';
  import { getResourceExcelFile} from '@/api/project/project';
  //数据
  import { columns} from './data';
  //表单
  import dayjs from 'dayjs';
  import { useModal } from '/@/components/Modal';
  import CateIndex from './cate/index.vue';
  import { useI18n } from 'vue-i18n';
  import {Icon} from '@/components/Icon';
  import { Message } from '@arco-design/web-vue';
  import type { RequestOption} from '@arco-design/web-vue/es/upload/interfaces';
  import { Pagination } from '@/types/global';
  import { useRoute } from 'vue-router';
  const route = useRoute();
  const { t } = useI18n();
  const [registerCateIndexModal, { openModal:cateModal }] = useModal();
  //上传文件
  const customRequest = (options: RequestOption) => {
      const controller = new AbortController();
        (async function requestWrap() {
          const {
            onProgress,
            onError,
            onSuccess,
            fileItem,
          } = options;
          onProgress(20);
          const onUploadProgress = (event: ProgressEvent) => {
            let percent;
            if (event.total > 0) {
              percent = (event.loaded / event.total) * 100;
            }
            onProgress(parseInt(String(percent), 10), event);
          };
          try {
            //开始手动上传
            const filename=fileItem?.name||""
            const resdata = await uploadExcelApi({ name: 'file', file: fileItem.file as Blob, filename},onUploadProgress);
            //更新图片
            if(resdata){
              if(resdata["code"]==0){
                  if(resdata["message"]=="文件已上传"){
                    Message.warning({content:"文件已上传",id:"upStatus",duration:3000})
                  } else {
                    Message.success({content:"上传成功",id:"upStatus",duration:2000})
                  }
              } else {
                Message.error({content:resdata["message"],id:"upStatus",duration:5000})
              }
              // onSuccess(resdata)
            }else{
              Message.error({content:resdata["message"],id:"upStatus",duration:2000})
            }
            fetchData();
          } catch (error) {
            onError(error);
            Message.error({content:"上传失败",id:"upStatus",duration:2000})
          }
        })();
        return {
          abort() {
            controller.abort();
          },
        };
  };

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
      createTime: '',
      approve_note:'',
      file_name: '',
      approve_status:"*",

    };
  };
  const formModel = ref(generateFormModel());
  const fetchData = async () => {
    setLoading(true);
    try {
      const data= await getList({page:pagination.current,pageSize:pagination.pageSize,...formModel.value});
      renderData.value = data.items;
      pagination.current = data.page;
      pagination.total = data.total;
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
    pagination.current = 1;
    fetchData();
  };

  const reset = () => {
    formModel.value = generateFormModel();
    fetchData();
  };

  const DOMAIN = window?.globalConfig.Main_url;
  const handleDownloadTemplate = () => {
    let a = document.createElement('a')
    a.href = `${DOMAIN}resource/staticfile/template.xlsx`
    a.click()
  }
  
  const handleDownloadFile = async(record:any) => {
    try {
      const upTime = dayjs(record.create_time*1000).format("YYYY-MM-DD")
      const res = await getResourceExcelFile(record);
      if (res.status == 200) {
        const blob = new Blob([res.data], {type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})
        const downloadUrl = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = downloadUrl
        link.download = upTime + "_" + record.file_name
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

  // 查看数据
  const handleGroup=async(record:any)=>{
    cateModal(true, {
      isUpdate: false,
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

  //删除数据
  const handleDel=async(record:any)=>{
    try {
        Message.loading({content:"删除中",id:"upStatus"})
       const res= await del({ids:[record.id]});
       if(res){
        fetchData();
         Message.success({content:"删除成功",id:"upStatus"})
       }
    }catch (error) {
      Message.clear("top")
    } 
}

  //状态
  const statusOptions = [
    {
      label: "全部",
      value: "*",
    },
    {
      label: "通过",
      value: "1",
    },
    {
      label: "未通过",
      value: "-1",
    },
    {
      label: "未审批",
      value: "0",
    },
  ];

</script>

<script lang="ts">
  export default {
    name: 'xx',
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
