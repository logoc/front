<template>
  <div class="container" >
    <Breadcrumb :items="[route.matched[0].meta.locale, route.meta.locale]" />
    <a-card class="general-card onelineCard" style="height: calc(100% - 50px);">
      <div class="flexbox">
        <div class="menu">
          <div class="btn">
            <a-space>
              <a-button type="primary" @click="AddMenuData(1)">
                <icon-plus /><span style="padding-left: 3px;">添加</span>
              </a-button>
              <a-button type="primary" status="warning" @click="AddMenuData(2)">
                <icon-edit /><span style="padding-left: 3px;">修改</span>
              </a-button>
              <a-button type="primary" status="danger" @click="delMenuData">
                <icon-delete /><span style="padding-left: 3px;">删除</span>
              </a-button>
            </a-space>
          </div>
          <div class="tablebox">
            <a-table  :data="nenudata" row-key="id" @row-click="handleClickMenu" :selected-keys="selectedKeys" :scrollbar="true" :pagination="false" :bordered="{wrapper: true, cell: true}" style="margin-top: 10px">
              <template #columns>
                    <a-table-column title="" :width="50" data-index="order_id"></a-table-column>
                    <a-table-column  title="平台名称" data-index="plat_name">
                      <template #cell="{ record }">
                         <div class="titlebox">
                          <div class="text">{{ record.plat_name }}</div>
                          <div class="icon"><icon-right /></div>
                         </div>
                      </template>
                    </a-table-column>
                  </template>
            </a-table>
          </div>
        </div>
      <div class="content">
        <a-row style="margin-bottom: 10px;padding:0px 10px;">
          <a-col :span="16" >
            <a-space>
              <a-input :style="{width:'160px'}"  v-model="formModel.account_type" placeholder="账号类型" allow-clear />
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
          <a-col
            :span="8"
            style="text-align: right;"
          >
          <a-space>
            <a-button type="primary" @click="createAccount">
              <template #icon>
                <icon-plus />
              </template>
              {{ $t('searchTable.operation.create') }}
            </a-button>
            <a-tooltip :content="$t('searchTable.actions.refresh')">
              <div class="action-icon" @click="search"
                ><icon-refresh size="18"
              /></div>
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
          :size="size"
          :default-expand-all-rows="true"
          ref="artable"
          @page-change="handlePaageChange" 
          @page-size-change="handlePaageSizeChange" 
        >
          <template #createtime="{ record }">
            {{dayjs(record.createtime*1000).format("YYYY-MM-DD")}}
          </template>
          <template #operations="{ record }">
            <Icon icon="svgfont-bianji1" class="iconbtn" @click="handleEdit(record)" :size="18" color="#0960bd"></Icon>
            <a-divider direction="vertical" />
            <a-popconfirm content="您确定要删除吗?" @ok="handleDel(record)">
              <Icon icon="svgfont-icon7" class="iconbtn" :size="18" color="#ed6f6f"></Icon>
            </a-popconfirm>
          </template>
        </a-table>
    </div>
    </div>
    </a-card>
    <!--表单-->
    <AddForm @register="registerModal" @success="handleData"/>
    <AddPlat @register="registerAddMenuModal" @success="handleAddMenu"/>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, reactive, watch, onMounted,nextTick } from 'vue';
  import useLoading from '@/hooks/loading';
  //api
  import { getList,del} from './api/account_api';
  import { getPlatList,delPlat, menuItem} from "./api/plat_api"
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import cloneDeep from 'lodash/cloneDeep';
  import dayjs from 'dayjs';
  //数据
  import { columns} from './data';
  //表单
  import { useModal } from '/@/components/Modal';
  import AddForm from './AddForm.vue';
  import AddPlat from './AddPlat.vue';
  import { useI18n } from 'vue-i18n';
  import {Icon} from '@/components/Icon';
  import { Message ,Modal} from '@arco-design/web-vue';
  import { Pagination } from '@/types/global';
  import { useRoute } from 'vue-router'
  import { useUserStore } from '@/store';
  const userInfo = useUserStore();
  const route = useRoute();
  const { t } = useI18n();
  const [registerModal, { openModal }] = useModal();
  const [registerAddMenuModal, { openModal:openAddMenuModal }] = useModal();
 
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
  // const boxheight=document.documentElement.clientHeight;//页面高度
  type SizeProps = 'mini' | 'small' | 'medium' | 'large';
  type Column = TableColumnData & { checked?: true };
  const { loading, setLoading } = useLoading(true);
  const renderData = ref([]);
  const nenudata = ref<menuItem []>([]);
  const cloneColumns = ref<Column[]>([]);
  const showColumns = ref<Column[]>([]);
  const size = ref<SizeProps>('large');
   //查询字段
   const generateFormModel = () => {
    return {
      id: '',
      account_type: '',
      name: '',
      createdTime: [],
      status: '',
    };
  };
  const handlePlatName = ref("")
  const formModel = ref(generateFormModel());
  const fetchData = async () => {
    setLoading(true);
    try {
      const data= await getList({page:pagination.current,pageSize:pagination.pageSize,...formModel.value,plat_id:selectedKeys.value[0]});
      renderData.value = data.items;
      pagination.current = data.page;
      pagination.total = data.total;
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };
  //获取左边数据
  const Menuitem=ref<menuItem>()
  const getmenudata=async()=>{
    nenudata.value = await getPlatList({})
    if(nenudata.value&&nenudata.value.length>0){
        selectedKeys.value=[nenudata.value[0].id]
        Menuitem.value=nenudata.value[0]
        handlePlatName.value=nenudata.value[0].plat_name
         nextTick(()=>{
          fetchData();
         })
      }
  }
  //更新左边数据
  const handleAddMenu=()=>{
    getmenudata()
  }
  //选择菜单数据
  const selectedKeys=ref<number []>([])
  const handleClickMenu=(TableData:any)=>{
    renderData.value =[]
    pagination.current =1
    setLoading(true);
    selectedKeys.value=[TableData.id]
    handlePlatName.value=TableData.plat_name
    Menuitem.value=TableData
    fetchData();
  }
  //添加菜单数据
  const AddMenuData=(type:number)=>{
    console.log(Menuitem.value?.plat_name)
    if(type==2&&!Menuitem.value){
      Message.error("未选择编辑数据")
    }else{
      openAddMenuModal(true, {
        isUpdate: type==2?true:false,
        record:type==2?Menuitem:null
      });
    }
  }
  //删除菜单数据
  const delMenuData=()=>{
    if(!selectedKeys.value||selectedKeys.value.length==0){
      Message.error("未选择删除数据")
    }else{
       Modal.warning({
        title: '您确定要删除内容吗？',
        content: '删除后内容将无法恢复请谨慎操作！',
        cancelText:"取消",
        okText:"删除",
        titleAlign:"start",
        hideCancel:false,
        onOk:(async()=>{
          Message.loading({content:"删除中",id:"upStatus",duration:0})
          await delPlat({ids:selectedKeys.value})
          nextTick(()=>{
            Message.success({content:"删除成功",id:"upStatus",duration:200})
            getmenudata();
          })
          })
      });
    }
  }
  //组件挂载完成后执行的函数
  onMounted(()=>{
    getmenudata()
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
  //添加账户类型
  const createAccount=()=>{
    if(!selectedKeys.value||selectedKeys.value.length==0){
      Message.error("未选择字典数据")
    }else{
      openModal(true, {
        isUpdate: false,
        platname:handlePlatName.value,
        plat_id:selectedKeys.value[0],
        record:null
      });
    }
  }
  //编辑数据
  const handleEdit=async(record:any)=>{
    openModal(true, {
      isUpdate: true,
      platname:handlePlatName.value,
      plat_id:selectedKeys.value[0],
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
       const res= await del({ids:[record.id], plat_id:selectedKeys.value[0]});
       if(res){
        fetchData();
         Message.success({content:"删除成功",id:"upStatus"})
       }
    }catch (error) {
      Message.clear("top")
    } 
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
    .flexbox{
      display: flex;
      justify-content: space-between; // 替代原先的space-between布局方式
       height: 100%;
       .menu{
          width: 230px;
          margin-right: 10px;
          background-color: var(--color-neutral-1);
          padding: 10px 0px;
          .btn{
            text-align: center;
          }
        .tablebox{
           //分类标题背景色
           :deep(.arco-table-th){
              background-color: var(--color-neutral-3);
            }
            :deep(.arco-table-tr-checked .arco-table-td){
              color: rgb(var(--primary-6));
            }
          .titlebox{
            display: flex;
            .text{
              flex: 1;
            }
          }
        }
       }
       .content{
        flex: 1;
        min-width: 400px;
        background-color: var(--color-neutral-1);
        padding: 10px 0px;
        min-height: 650px;
       }
    }
  }
  :deep(.arco-btn-size-medium){
    padding: 0 10px;
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
</style>
