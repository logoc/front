ƒ<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :loading="loading" helpMessage="编辑和修改菜单" width="800px" :minHeight="260" :title="getTitle" @ok="handleSubmit">
    <a-form ref="formRef" :model="formData" auto-label-width>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item field="cate" label="名称" validate-trigger="input" :rules="[{required:true,message:'请填写合作平台'}]" style="margin-bottom:15px;">
            <a-input v-model="formData.cate" placeholder="请填类别名称" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item field="cate_type" label="类型" style="margin-bottom:15px;">
            <a-select v-model="formData.cate_type" placeholder="选择类型" :style="{width:'250px'}" >
              <a-option v-for="item in cateTypeList" :value="item.value">{{ item.label }}</a-option>
            </a-select>
            </a-form-item>
        </a-col>

        <a-col :span="12">
          <a-form-item field="cate_id" label="排序" validate-trigger="input" :rules="[{required:true,message:'请填排序'}]" style="margin-bottom:15px;">
            <a-input-number v-model="formData.cate_id" placeholder="请填排序" />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref} from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import useLoading from '@/hooks/loading';
  import { useI18n } from 'vue-i18n';
  import { cloneDeep } from 'lodash-es';
  //api
  import { save} from './api';
  import { IconPicker ,Icon} from '@/components/Icon';
  import { Message } from '@arco-design/web-vue';
  import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface';

  const cateTypeList = computed(() => [
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

  export default defineComponent({
    name: 'AddBook',
    components: { BasicModal,IconPicker,Icon },
    emits: ['success'],
    setup(_, { emit }) {
      const { t } = useI18n();
      const isUpdate = ref(false);
      //表单
      const formRef = ref<FormInstance>();
      //表单字段
      const basedata={
            id:0,
            cate_type: '',
            cate :"",
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
      const getTitle = computed(() => (!unref(isUpdate) ? '新增项目' : '编辑项目'));
     //点击确认
     const { loading, setLoading } = useLoading();
     const handleSubmit = async () => {
      try {
          const res = await formRef.value?.validate();
          if (!res) {
            setLoading(true);
            const resdata = await save(unref(formData));
            if (resdata) {
              Message.success({content:"更新成功",id:"upStatus"})
              closeModal()
              emit('success');
              setLoading(false);
            }
          }
        } catch (error) {
          setLoading(false);
          Message.clear("top")
        }
      };

      return { 
        registerModal, 
        getTitle, 
        handleSubmit,
        formRef,
        loading,
        formData,
        t,
        cateTypeList,
        OYoptions:[
          { label: '否', value: 0 },
          { label: '是', value: 1 },
        ],
   
      };
    },
  });

  //获取type过滤
  const getCateTypeName=(val:string)=>{
        var text=""
        if(val=="platform"){
          text="合作平台"
        }else if(val=="xxx"){
          text="插图"
        }else if(val=="xxx"){
          text="插图"
        }
        return text

  }
</script>
