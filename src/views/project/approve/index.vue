<template>
  <div class="container" >
    <Breadcrumb :items="[route.matched[0].meta.locale, route.meta.locale]" />
    <a-card class="general-card onelineCard" style="height: calc(100% - 50px);">
      <a-row style="margin-bottom: 10px">
        <a-col :span="12" >
          <a-space>
            <a-input :style="{width:'220px'}" v-model="formModel.name" placeholder="用户名" allow-clear >
              <template #prefix>
                用户:
              </template>
            </a-input>
            <a-select :options="statusOptions" v-model="formModel.status" :style="{width:'200px'}" >
              <template #prefix>
                审批状态:
              </template>
            </a-select>
          </a-space>
        </a-col>

        <a-col
          :span="12"
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
          
          <a-tooltip :content="$t('searchTable.actions.refresh')">
            <div class="action-icon" @click="search"><icon-refresh size="18"/></div>
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
        <template #file_name="{ record }">
        <a-link :href="record.url" status="success" target="_blank">{{record.file_name}}</a-link>
        </template>
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
        <template #approve_time="{record,column}">
          {{dayjs(record[column.dataIndex]*1000).format("YYYY-MM-DD HH:mm")}}
        </template>
        <template #approve_status="{ record }">
          <span v-if="record.approve_status==0" :style="{color:'gray'}">未审批</span>
          <span v-if="record.approve_status==1" :style="{color:'orangered'}">通过</span>
          <span v-if="record.approve_status==-1" :style="{color:'black'}">不通过</span>
        </template>
        <template #operations="{ record }">
          <Icon icon="svgfont-shenpi" class="iconbtn" @click="handleGroup(record)" :size="18" color="#0960bd"> </Icon>
          <a-divider direction="vertical" />
          <a-popconfirm content="您确定要删除吗?" @ok="handleDel(record)">
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

  import dayjs from 'dayjs';
  //api
  import { getList} from './api';
  //数据
  import { columns} from './data';
  //表单
  import { useModalInner } from '/@/components/Modal';
  import CateIndex from './cate/index.vue';
  import { useModal } from '/@/components/Modal';
  import { useI18n } from 'vue-i18n';
  import {Icon} from '@/components/Icon';
  import { Message } from '@arco-design/web-vue';
  import { Pagination } from '@/types/global';
  import { useRoute } from 'vue-router'
  const route = useRoute();
  const { t } = useI18n();
  const [registerCateIndexModal, { openModal:cateModal }] = useModal();
  const densityList = computed(() => [
    {
      name: t('searchTable.size.mini'),
      value: 'mini',
    },
    {
      name: t('searchTable.size.small'),
      value: 'small',
    },
    {
      name: t('searchTable.size.medium'),
      value: 'medium',
    },
    {
      name: t('searchTable.size.large'),
      value: 'large',
    },
  ]);
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
      id: '',
      name: '',
      status : '*',
    };
  };
  const formModel = ref(generateFormModel());

  // const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
  //     setModalProps({ confirmLoading: false });
  //     formModel.value=cloneDeep(data.record)
  //     fetchData()
  // });

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
