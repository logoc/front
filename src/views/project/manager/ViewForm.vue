<template>
  <ViewModal v-bind="$attrs" @register="registerModal" :loading="loading" helpMessage="预览" width="900px" :minHeight="450" :title="getTitle" @ok="handleSubmit">
    <a-form ref="formRef" :model="formData" auto-label-width>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item  label="合作平台" style="margin-bottom:15px;">
            <a-input v-model="formData.platform" placeholder="请填合作平台" disabled/>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item field="cooperate_time" label="合作时间" style="margin-bottom:15px;" :rules="[{required:true}]" >
            <a-date-picker v-model="formData.cooperate_time" :style="{width:'200px'}" disabled/>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="账号类型" field="account_type" style="margin-bottom:15px;" :rules="[{required:true}]">
            <a-input v-model="formData.account_type" placeholder="请填账号类型" disabled/>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item field="account_nikename" label="账号昵称" style="margin-bottom:15px;" :rules="[{required:true}]">
            <a-input v-model="formData.account_nikename" placeholder="请填账号昵称" disabled/>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item field="fanscnt" label="粉丝数" style="margin-bottom:15px;" :rules="[{required:true}]">
            <a-input-number v-model="formData.fanscnt" placeholder="请填粉丝数" disabled>
            <template #append>
            万
            </template>
            </a-input-number>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item field="publish_link" label="发布链接" validate-trigger="input" style="margin-bottom:15px;">
            <a-input v-model="formData.publish_link" placeholder="请填发布链接" disabled/>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item field="cooperate_type" label="合作形式" style="margin-bottom:15px;" :rules="[{required:true}]">
            <a-input  v-model="formData.cooperate_type" placeholder="请填合作形式" disabled/>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item field="platform_price" label="平台价/刊例" style="margin-bottom:15px;" :rules="[{required:true}]">
            <a-input-number v-model="formData.platform_price" placeholder="请填平台价/刊例" disabled/>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item field="actual_price" label="执行价(含税)" style="margin-bottom:15px;" :rules="[{required:true}]">
            <a-input-number v-model="formData.actual_price" placeholder="请填执行价(含税)" disabled/>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item field="discount_note" label="折扣说明" style="margin-bottom:15px;" :rules="[{required:true,message:'请填折扣说明'}]">
            <a-input v-model="formData.discount_note" placeholder="请填折扣说明" disabled/>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item field="tax_rate" label="税率" style="margin-bottom:15px;" :rules="[{required:true,message:'请填税率'}]">
            <a-input v-model="formData.tax_rate" placeholder="请填税率" disabled/>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item field="department" label="事业部" style="margin-bottom:15px;" :rules="[{required:true}]">
            <a-input v-model="formData.department" placeholder="请填事业部" disabled/>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item field="projectno" label="项目号" style="margin-bottom:15px;" :rules="[{required:true}]">
            <a-input v-model="formData.projectno" placeholder="请填项目号" disabled/>
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <a-form-item field="project_name" label="项目名称" style="margin-bottom:15px;" :rules="[{required:true}]">
            <a-input v-model="formData.project_name" placeholder="请填项目名称" disabled/>
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <a-form-item field="payno" label="支付单号" style="margin-bottom:15px;" :rules="[{required:true}]">
            <a-input v-model="formData.payno" placeholder="请填支付单号" disabled/>
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <a-form-item field="supply_name" label="供应商名称" style="margin-bottom:15px;" :rules="[{required:true}]">
            <a-input v-model="formData.supply_name" placeholder="请填供应商名称" disabled/>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item field="contact" label="联系方式" style="margin-bottom:15px;" :rules="[{required:true}]">
            <a-input v-model="formData.contact" placeholder="请填联系方式" disabled/>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </ViewModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref} from 'vue';
  import {  ViewModal, useModalInner } from '/@/components/Modal';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import useLoading from '@/hooks/loading';
  import { useI18n } from 'vue-i18n';
  import { cloneDeep } from 'lodash-es';
  //api
  import { update} from '@/api/project/project';
  import { IconPicker ,Icon} from '@/components/Icon';
  import { Message } from '@arco-design/web-vue';
  export default defineComponent({
    name: 'ViewForm',
    components: { ViewModal, IconPicker,Icon },
    emits: ['cancel'],
    setup(_, { emit }) {
      const { t } = useI18n();
      const isUpdate = ref(false);
      //表单
      const formRef = ref<FormInstance>();
      //表单字段
      const basedata={
            id:0,
            platform: '',
            cooperate_time: '',
            account_type: '',
            account_nikename: "",
            fanscnt: 0,
            publish_link: "",
            cooperate_type:"",
            platform_price:0,
            actual_price:0,//手机
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
      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
          formRef.value?.resetFields()
          setModalProps({ confirmLoading: false });
          isUpdate.value = !!data?.isUpdate;
          if (unref(isUpdate)) {
            formData.value=cloneDeep(data.record)
          }else{
            formData.value=basedata
          }
      });
      const getTitle = "查看";
     //点击确认
     const { loading, setLoading } = useLoading();
     const handleSubmit = async () => {
        closeModal()
        emit('cancel');
      };
      //上传附件改变
      const onChange=(fileList:any)=>{
        console.log("fileList",fileList)
      }

      return { 
        registerModal, 
        getTitle, 
        handleSubmit,
        formRef,
        loading,
        formData,
        t,
        OYoptions:[
          { label: '否', value: 0 },
          { label: '是', value: 1 },
        ],
        onChange,
      };
    },
  });
</script>
