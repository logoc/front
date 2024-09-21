<template>
  <a-spin :loading="loading" style="width: 100%">
  <a-form
    ref="formRef"
    :model="formData"
    class="form"
    :label-col-props="{ span: 8 }"
    :wrapper-col-props="{ span: 16 }"
  >
    <a-form-item
      field="name"
      :label="$t('userSetting.basicInfo.form.label.name')"
      :rules="[
        {
          required: true,
          message: $t('userSetting.form.error.name.required'),
        },
      ]"
    >
      <a-input
        v-model="formData.name"
        :placeholder="$t('userSetting.basicInfo.placeholder.name')"
      />
    </a-form-item>

    <a-form-item
      field="mobile"
      :label="$t('userSetting.basicInfo.form.label.mobile')"
      :rules="[
        {
          message: $t('userSetting.form.error.mobile.required'),
        },
      ]"
    >
      <a-input
        v-model="formData.mobile"
        :placeholder="$t('userSetting.basicInfo.placeholder.mobile')"
      />
    </a-form-item>

    <a-form-item
      field="profile"
      :label="$t('userSetting.basicInfo.form.label.profile')"
      :rules="[
        {
          maxLength: 200,
          message: $t('userSetting.form.error.profile.maxLength'),
        },
      ]"
      row-class="keep-margin"
    >
      <a-textarea
        v-model="formData.remark"
        :placeholder="$t('userSetting.basicInfo.placeholder.profile')"
      />
    </a-form-item>
    <a-form-item>
      <a-space>
        <a-button type="primary" @click="validate">
          {{ $t('userSetting.save') }}
        </a-button>
        <a-button type="secondary" @click="reset">
          {{ $t('userSetting.reset') }}
        </a-button>
      </a-space>
    </a-form-item>
  </a-form>
</a-spin>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import { getUser,saveInfo,BasicInfoModel } from '@/api/user-center';
  import { Message } from '@arco-design/web-vue';
  import useLoading from '@/hooks/loading';
  const formRef = ref<FormInstance>();
  const formData = ref<BasicInfoModel>({
    id: 0,
    name: "",
    nickname: "",
    mobile:"",
    remark:  "",
    createtime: "",
  });
  const { loading, setLoading } = useLoading(true);
  const fetchData = async () => {
    try {
      const resData = await getUser();
      formData.value= resData;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  fetchData();
  const validate = async () => {
    const res = await formRef.value?.validate();
    if (!res) {
      Message.loading({content:"更新中",id:"delaction"})
      const res = await saveInfo(formData.value)
      if(res){
        Message.success({content:"更新成功",id:"delaction"})
      }else{
        Message.clear()
      }
    }
  };
  const reset = async () => {
    await formRef.value?.resetFields();
  };
</script>

<style scoped lang="less">
  .form {
    width: 540px;
    margin: 0 auto;
  }
</style>
