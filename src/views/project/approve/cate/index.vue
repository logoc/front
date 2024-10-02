<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :isPadding="false" :footer="false" :loading="loading" width="1000px" @height-change="onHeightChange" :minHeight="modelHeight" :title="getTitle" >
    <div class="modalbox" :style="{'min-height':`${windHeight}px`}">
      <div class="table-content">
        <a-row style="margin-bottom: 10px">
          <a-col :span="24" >
            <a-space>
            <a-input :style="{width:'300px'}" v-model="formModel.name" readonly>
              <template #prepend>
                上传用户:
              </template>
            </a-input>
            <a-input :style="{width:'300px', 'color':'black'}" v-model="formModel.file_name" readonly>
              <template #prepend>
                文件名称:
              </template>
            </a-input>
            <a-input :style="{width:'300px', 'color':'red'}" v-model="formModel.project_count" readonly>
              <template #prepend>
                发文数:
              </template>
            </a-input>
            
            </a-space>

          </a-col>
        </a-row>
        <a-row style="margin-bottom: 10px">
        <a-col :span="18" >
          <a-space>
            <a-checkbox-group :max="1" v-model="formModel.status">
              <a-checkbox value="1">审批通过</a-checkbox>
              <a-checkbox value="-1">审批不通过</a-checkbox>
            </a-checkbox-group>
            <a-input :style="{width:'420px'}" default-value="通过" v-model="formModel.approve_note" allow-clear>
              <template #prepend>
                审批信息:
              </template>
            </a-input>
          </a-space>
        </a-col>
        <a-col
          :span="6"
           style="text-align: right;"
        >

        <a-space>
          <a-button type="primary" @click="handleApprove(formModel)">
            审批
          </a-button>
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
        </a-table>
      </div>
    </div>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, reactive} from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import useLoading from '@/hooks/loading';
  import { Pagination } from '@/types/global';

  import { cloneDeep } from 'lodash-es';
  //数据
  import { columns} from './data';
  import dayjs from 'dayjs';
  //api
  import { getList,save} from './api';
  import { IconPicker ,Icon} from '@/components/Icon';
  import { Message } from '@arco-design/web-vue';
  export default defineComponent({
    name: 'cateindex',
    components: { BasicModal,IconPicker,Icon },
    emits: ['success'],
    setup(_, { emit }) {
      const modelHeight= ref(620);
      const windHeight= ref(620);
      //表格
      const renderData = ref([]);
      const { loading, setLoading } = useLoading(true);
  
      //查询字段
      const generateFormModel = () => {
        return {
          id:0,
          name: '1221',
          file_name: '1212',
          project_count: "11",
          approve_status:0,
          status:["-1","1"],
          approve_note:"通过"
        };
      };
      const formModel = ref(generateFormModel());
      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
          setModalProps({ confirmLoading: false });
          formModel.value=cloneDeep(data.record)
          if (data.record.approve_status != 0) {
            formModel.value.status = [data.record.approve_status.toString()]
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

      const getTitle = computed(() => ('Excel预览审批'));
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

      //审批处理
      const handleApprove=async(record:any)=>{
        try {
          if (record.status == undefined || record.status.length <= 0) {
            Message.error({content:"请勾选审批状态！",id:"upStatus"});
          } else {
            const res = await save({id:record.id, status: record.status, note: record.approve_note});
            if(res){
              Message.success({content:"审批成功",id:"upStatus"});
              emit('success');
              closeModal()
            }
          }
        }catch (error) {
          Message.error({content:"审批失败",id:"upStatus"});
          Message.clear("top");
        }
        fetchData();
      }
      return { 
        registerModal, 
        getTitle, 
        columns,
        loading,
        formModel,
        dayjs,
        modelHeight,
        handleApprove,
        onHeightChange,windHeight,
        pagination,handlePaageChange,handlePaageSizeChange,
        renderData,
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

