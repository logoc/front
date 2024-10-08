<template>
  <div class="container" >
    <a-card class="general-card onelineCard" style="height: calc(100% - 50px);">
      <a-row style="margin-bottom: 10px">
        <a-col
          :span="12"
           style="text-align: left;"
        >
        <a-space>
          <a-button type="primary"  @click="createRule">
            <template #icon>
              <icon-plus />
            </template>
            新增
          </a-button>
          </a-space>
        </a-col>
        <a-col
          :span="12"
           style="text-align: right;"
        >
          <a-space> 
            <a-tooltip :content="$t('searchTable.actions.refresh')">
              <div class="action-icon" @click="search">
                <icon-refresh size="18"/>
              </div>
            </a-tooltip>
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
        <template #name="{ record }">
         {{ record.name }}<span v-if="record.nickname" style="padding-left: 5px;color: var(--color-neutral-4);">{{ record.nickname }}</span>
        </template>
        <template #mimetype="{ record }">
          <img
              v-if="record.mimetype.includes('image')||record.mimetype.includes('video')"
              :alt="record.title"
              style="height: 50px;border-radius: 5px;"
              :src="record.mimetype.includes('image')?record.url:record.cover_url"
            />
        </template>
        <template #createtime="{record,column}">
          {{dayjs(record[column.dataIndex]*1000).format("YYYY-MM-DD")}}
        </template>
        <template #cate_type="{ record }">
          {{getCateTypeName(record.cate_type)}}
        </template>
        <template #operations="{ record }">
          <Icon icon="svgfont-bianji1" class="iconbtn" @click="handleEdit(record)" :size="18" color="#0960bd"></Icon>
          <a-divider direction="vertical" />
          <a-popconfirm content="您确定要删除吗?" @ok="handleDel(record)">
            <Icon icon="svgfont-icon7" class="iconbtn" :size="18" color="#ed6f6f"></Icon>
          </a-popconfirm>
        </template>
      </a-table>
    </a-card>
    <!--表单-->
    <AddForm @register="registerModal" @success="handleData"/>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, reactive, watch, onMounted } from 'vue';
  import useLoading from '@/hooks/loading';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface';
  import cloneDeep from 'lodash/cloneDeep';
  import dayjs from 'dayjs';
  //api
  import { getList,del} from './api';
  //数据
  import { columns} from './data';
  //表单
  import { useModal } from '/@/components/Modal';
  import AddForm from './AddForm.vue';
  import { useI18n } from 'vue-i18n';
  import {Icon} from '@/components/Icon';
  import { Message } from '@arco-design/web-vue';
  import { Pagination } from '@/types/global';
  import { useRoute } from 'vue-router'
  const route = useRoute();
  const { t } = useI18n();
  const [registerModal, { openModal }] = useModal();
 
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
      cate_type: 'account_type',
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

  fetchData();
  const handleSelectDensity = (
    val: string | number | Record<string, any> | undefined,
    e: Event
  ) => {
    size.value = val as SizeProps;
  };

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

  //添加
  const createRule=()=>{
    openModal(true, {
      isUpdate: false,
      record:null
    });
  }
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

  //删除数据
  const handleDel=async(record:any)=>{
    try {
        Message.loading({content:"删除中",id:"upStatus"})
       const res = await del({id:record.id});
       if(res){
         Message.success({content:"删除成功",id:"upStatus"})
       }
       fetchData();
    }catch (error) {
      Message.clear("top")
    } 
}
  //状态
  const cateTypeOptions = computed<SelectOptionData[]>(() => [
    {
      label: "账号类型",
      value: "account_type",
    },
    {
      label: "合作平台",
      value: "platform",
    },
    {
      label: "合作形式",
      value: "cooperate_type",
    },
   
  ]);
  //存储单位换算
  const suffix = ['B', 'KB', 'MB', 'GB', 'TB'];
  const filesizeFont=(size:any)=>{
    const base = Math.floor(Math.log2(size) / 10);
    const index = clamp(base, 0, 4);
    return (size / 2 ** (10 * index)).toFixed(2) + suffix[index];
  }
  function clamp(v:any, min:any, max:any) {
    if (v < min) return min;
    if (v > max) return max;
    return v;
  }
  //获取type过滤
  const getCateTypeName=(val:string)=>{
        var text=""
        if(val=="platform"){
          text="合作平台"
        }else if(val=="cooperate_type"){
          text="合作形式"
        }else if(val=="account_type"){
          text="账号类型"
        }
        return text

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
