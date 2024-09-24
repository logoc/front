<template>
  <a-modal  v-model:visible="visibleModal" width="900px" title-align="start" :title="getTitle" @ok="handleSubmit">
    <a-form ref="formRef" :model="formData" auto-label-width>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item field="platform" label="合作平台" validate-trigger="input" :rules="[{required:true,message:'请填写合作平台'}]" style="margin-bottom:15px;">
            <a-input v-model="formData.platform" placeholder="请填合作平台" readonly/>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item field="cooperate_time" label="合作时间" style="margin-bottom:15px;" :rules="[{required:true}]" >
            <a-date-picker v-model="formData.cooperate_time" :style="{width:'200px'}" readonly/>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="账号类型" field="account_type" style="margin-bottom:15px;" :rules="[{required:true}]">
            <a-input v-model="formData.account_type" placeholder="请填账号类型" readonly />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item field="account_nikename" label="账号昵称" style="margin-bottom:15px;" :rules="[{required:true}]">
            <a-input v-model="formData.account_nikename" placeholder="请填账号昵称" readonly/>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item field="fanscnt" label="粉丝数" style="margin-bottom:15px;" :rules="[{required:true}]">
            <a-input v-model="formData.fanscnt" placeholder="请填粉丝数" readonly>
            <template #append>
            万
            </template>
            </a-input>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item field="publish_link" label="发布链接" validate-trigger="input" style="margin-bottom:15px;">
            <a-input v-model="formData.publish_link" placeholder="请填发布链接"/>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item field="cooperate_type" label="合作形式" style="margin-bottom:15px;" :rules="[{required:true}]">
            <a-input  v-model="formData.cooperate_type" placeholder="请填合作形式" readonly/>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item field="platform_price" label="平台价/刊例" style="margin-bottom:15px;" :rules="[{required:true}]">
            <a-input v-model="formData.platform_price" placeholder="请填平台价/刊例" readonly/>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item field="actual_price" label="执行价(含税)" style="margin-bottom:15px;" :rules="[{required:true}]">
            <a-input v-model="formData.actual_price" placeholder="请填执行价(含税)" readonly/>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item field="discount_note" label="折扣说明" style="margin-bottom:15px;" :rules="[{required:true,message:'请填折扣说明'}]">
            <a-input v-model="formData.discount_note" placeholder="请填折扣说明" readonly/>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item field="tax_rate" label="税率" style="margin-bottom:15px;" :rules="[{required:true,message:'请填税率'}]">
            <a-input v-model="formData.tax_rate" placeholder="请填税率" readonly/>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item field="department" label="事业部" style="margin-bottom:15px;" :rules="[{required:true}]">
            <a-input v-model="formData.department" placeholder="请填事业部" readonly/>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item field="projectno" label="项目号" style="margin-bottom:15px;" :rules="[{required:true}]">
            <a-input v-model="formData.projectno" placeholder="请填项目号" readonly/>
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <a-form-item field="project_name" label="项目名称" style="margin-bottom:15px;" :rules="[{required:true}]">
            <a-input v-model="formData.project_name" placeholder="请填项目名称" readonly/>
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <a-form-item field="payno" label="支付单号" style="margin-bottom:15px;" :rules="[{required:true}]">
            <a-input v-model="formData.payno" placeholder="请填支付单号" readonly/>
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <a-form-item field="supply_name" label="供应商名称" style="margin-bottom:15px;" :rules="[{required:true}]">
            <a-input v-model="formData.supply_name" placeholder="请填供应商名称" readonly/>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item field="contact" label="联系方式" style="margin-bottom:15px;" :rules="[{required:true}]">
            <a-input v-model="formData.contact" placeholder="请填联系方式" readonly/>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>

  </a-modal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref} from 'vue';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import useLoading from '@/hooks/loading';
  import { cloneDeep } from 'lodash-es';
  //api
  import { update} from '@/api/project/project';
  import { Message } from '@arco-design/web-vue';
  export default defineComponent({
    name: 'AddForm',
    components: {  },
    emits: ['success'],
    setup(_, { emit }) {
      const visibleModal = ref(false);
      const isUpdate = ref(false);
      const parntList = ref([]);
      //表单
      const formRef = ref<FormInstance>();
      //表单字段
      const basedata={
          id:0,
          platform: '',
          cooperate_time: '',
          account_type: '',
          account_nikename: "",
          fanscnt: "",
          publish_link: "",
          cooperate_type:"",
          platform_price:"",
          actual_price:"",//手机
          discount_note:"",//邮箱
          tax_rate:"%",//地址
          department:"",//城市
          projectno:"",//备注
          project_name:"",//公司
          payno:"",//公司
          supply_name:"",//公司
          contact:"",//公司
        }
      const formData = ref(basedata)
      const m_component=ref("")
      const ShowModal=async(data:any)=>{
        visibleModal.value=true
        isUpdate.value = !!data?.isUpdate;
          if (unref(isUpdate)) {
            m_component.value=data.record.component
            formData.value=cloneDeep(data.record)
          }else{
            formData.value=cloneDeep(basedata)
          }
      }
      const getTitle = computed(() => (!unref(isUpdate) ? '新增' : '编辑'));
     //点击确认
     const { loading, setLoading } = useLoading();
     const handleSubmit = async () => {
      try {
          const res = await formRef.value?.validate();
          if (!res) {
            setLoading(true);
            Message.loading({content:"更新中",id:"upStatus"})
            await update(unref(formData));
            Message.success({content:"更新成功",id:"upStatus"})
            emit('success');
            setLoading(false);
            visibleModal.value=false
          }
        } catch (error) {
          setLoading(false);
          Message.clear("top")
        }
      };
      return { 
        ShowModal, 
        getTitle, 
        handleSubmit,
        formRef,
        loading,
        formData,
        parntList,
        visibleModal,
        OYoptions:[
          { label: '否', value: 0 },
          { label: '是', value: 1 },
        ],
      };
    },
  });
</script>
