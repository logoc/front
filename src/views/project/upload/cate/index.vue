<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :isPadding="false" :footer="false" :loading="loading" width="1200px" @height-change="onHeightChange" :minHeight="modelHeight" :title="getTitle" >
    <div class="modalbox" :style="{'min-height':`${windHeight}px`}">
      <div class="table-content">
        <a-row style="margin-bottom: 15px; margin-top: 5px">
          <a-col :span="24" >
            <a-space>
            <a-input :style="{width:'200px'}" v-model="formModel.id" readonly>
              <template #prepend>
                编号:
              </template>
            </a-input>
            <a-input :style="{width:'360px'}" v-model="formModel.file_name" readonly>
              <template #prepend>
                文件名称:
              </template>
            </a-input>

            <a-input :style="{width:'160px'}" v-model="formModel.status" readonly>
              <template #prepend>
                审批:
              </template>
            </a-input>
            <a-input :style="{width:'360px'}" v-model="formModel.approve_note" readonly>
              <template #prepend>
                审批信息:
              </template>
            </a-input>
            </a-space>
          </a-col>
        </a-row>
    
        <a-table
          row-key="id"
          :loading="loading"
          :pagination="pagination"
          :columns="(columns as TableColumnData[])"
          :data="renderData"
          :bordered="{wrapper:true,cell:true}"
          size="medium"
          :default-expand-all-rows="true"
          ref="artable"
          @page-change="handlePaageChange" 
          @page-size-change="handlePaageSizeChange" 
        >
          <template #publish_link="{ record }">
            <a-link :href="record.publish_link" status="success" target="_blank">{{record.publish_link}}</a-link>
          </template>
          <template #operations="{ record }">
            <Icon icon="svgfont-bianji1" class="iconbtn" @click="handleEdit(record)" :size="18" color="#0960bd"></Icon>
            <a-divider direction="vertical" />
            <a-popconfirm content="您确定要删除吗?" @ok="handleDel(record)">
              <Icon icon="svgfont-icon7" class="iconbtn" :size="18" color="#ed6f6f"></Icon>
            </a-popconfirm>
        </template>
        </a-table>
      <!--表单-->
      </div>
    </div>
    <AddForm ref="addFormRef" @success="search"/>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref,reactive} from 'vue';
  import { BasicModal, useModalInner,useModal } from '/@/components/Modal';
  import useLoading from '@/hooks/loading';
  import { Pagination } from '@/types/global';

  import { cloneDeep } from 'lodash-es';
  //数据
  import { columns} from './data';
  import dayjs from 'dayjs';

  import AddForm from './AddForm.vue';

  import { Message } from '@arco-design/web-vue';
  //api
  import { getList} from './api';
  import { IconPicker ,Icon} from '@/components/Icon';
  export default defineComponent({
    name: 'cateindex',
    components: { BasicModal,IconPicker,Icon,AddForm },
    emits: ['success'],
    setup(_, { emit }) {
      const isUpdate = ref(false);
      const modelHeight= ref(620);
      const windHeight= ref(620);
      //表格
      const renderData = ref([]);
      const { loading, setLoading } = useLoading(true);
    

      //查询字段
      const generateFormModel = () => {
        return {
          id:"0",
          name: '1221',
          file_name: '1212',
          project_count: "11",
          approve_note: '',
          status: "",
        };
      };
      const formModel = ref(generateFormModel());
      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
          setModalProps({ confirmLoading: false });
          formModel.value=cloneDeep(data.record)
          if (data.record.approve_status == -1) {
            formModel.value.status = "未通过"
          }
          if (data.record.approve_status == 1) {
            formModel.value.status = "通过"
          }
          if (data.record.approve_status == 0) {
            formModel.value.status = "未审核"
          }
          fetchData()
      });
      //加载数据
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
      const getTitle = computed(() => ('Excel预览'));
     //点击确认
       //监听高度
       const onHeightChange=(val:any)=>{
        windHeight.value=val
      }
      //表格
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
   
      //编辑数据
      const addFormRef=ref()
      const handleEdit=async(record:any)=>{
        addFormRef.value.ShowModal({
          isUpdate: true,
          record:record
        })
      }
      //更新数据
      const handleData=async()=>{
        fetchData();
      }
       //查找
      const search = () => {
        fetchData();
      };
      return { 
        registerModal, 
        getTitle, 
        columns,
        loading,
        formModel,
        dayjs,
        modelHeight,
        onHeightChange,windHeight,
        pagination,handlePaageChange,handlePaageSizeChange,
        renderData,
        handleEdit, handleData,addFormRef,
        search,
      };
    },
  });
</script>
<style lang="less" scoped>
  .modalbox{
    padding: 10px;
    .table-content{

    }
  }
</style>

