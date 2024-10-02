<template>
  <div class="login-form-wrapper">
    <div class="login-form-title">{{ loginTitle }}</div>
    <div class="login-form-sub-title">
      {{ loginSubTitle }}
    </div>
    <div class="login-form-error-msg">{{ errorMessage }}</div>
    <a-form
      ref="loginForm"
      :model="userInfo"
      class="login-form"
      layout="vertical"
      @submit="handleSubmit"
    >
      <a-form-item
        field="mobile"
        :rules="[{ required: true, message: $t('login.form.userName.errMsg') }]"
        :validate-trigger="['change', 'blur']"
        hide-label
      >
        <a-input
          v-model="userInfo.mobile"
          :placeholder="$t('login.form.userName.placeholder')"
        >
          <template #prefix>
            <icon-phone />
          </template>
        </a-input>
      </a-form-item>

      <a-form-item
          field="code"
          :rules="[{ required: true, message: $t('login.form.verification.errMsg') }]"
          :validate-trigger="['change', 'blur']"
          hide-label
        >
          <a-input
            v-model="userInfo.code"
            :placeholder="$t('login.form.verification.placeholder')"
          >
            <template #prefix>
              验证码
            </template>
            <template #append>
              <a class="vbtn" @click="getVerification()"> {{ codeNum == 60 ? "发送验证码" : `(${codeNum})发送验证码` }}</a>
            </template>
          </a-input>
        </a-form-item>

      <a-space :size="16" direction="vertical">
          <div class="login-form-password-actions">
            <span></span>
            <a-link @click="GoToType('login')">密码登陆</a-link>
          </div>
        <a-button type="primary" html-type="submit" long :loading="loading">
          {{ $t('login.form.login') }}
        </a-button>
      </a-space>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import { useRouter } from 'vue-router';
  import { Message } from '@arco-design/web-vue';
  import { ValidatedError } from '@arco-design/web-vue/es/form/interface';
  import { useI18n } from 'vue-i18n';
  import { useUserStore } from '@/store';
  import useLoading from '@/hooks/loading';
  import { getCode, LoginMsgData } from '@/api/user';
  const emit = defineEmits(['reback'])
  const router = useRouter();
  const { t } = useI18n();
  //获取标题
  const loginTitle = window?.globalConfig.loginTitle
  const loginSubTitle = window?.globalConfig.loginSubTitle
  const errorMessage = ref('');
  const { loading, setLoading } = useLoading();
  const userStore = useUserStore();

  const generateFormModel = () => {
    return {
      mobile: "",
      code: "",
    };
  };
  const userInfo = ref(generateFormModel());
  //返回
  const GoToType=(keys:string)=>{
    emit('reback',keys)
  }
  
  const handleSubmit = async ({
    errors,
    values,
  }: {
    errors: Record<string, ValidatedError> | undefined;
    values: Record<string, any>;
  }) => {
    if (loading.value) return;
    if (!errors) {
      setLoading(true);
      try {
        await userStore.loginMsg(values as LoginMsgData);
        const { redirect, ...othersQuery } = router.currentRoute.value.query;
         var toURl=(redirect as string)
         if(toURl=="notFound"){
          toURl="home"
         }
        router.replace({
          name: toURl || 'home',
          query: {
            ...othersQuery,
          },
        });
        Message.success({content:t('login.form.login.success'),id:"menuNotice"})
      } catch (err) {
        errorMessage.value = (err as Error).message;
      } finally {
        setLoading(false);
      }
    }
  };

  // 定时器id
  let clearId=ref();
    // 倒计时时间
  const codeNum = ref(60);

  const regex = /^1[3456789]\d{9}$/;
  // 是否发送了验证码 防止连点
  const isClickSend = ref(false)
  const getVerification=async ()=>{
    if (!regex.test(userInfo.value.mobile)){
      errorMessage.value ="请输入正确手机号"
      return
    }
    if (userInfo.value.code){
      errorMessage.value ="请输入验证码"
      return
    }
    if (isClickSend.value || codeNum.value != 60)  {
      errorMessage.value ="60s后重试"
    } else {
        isClickSend.value = true;
        const res = await getCode({mobile:userInfo.value.mobile});
        clearId.value = setInterval(() => {
            codeNum.value--;
            if (codeNum.value == 0) {
            clearInterval(clearId.value);
            codeNum.value = 60;
            isClickSend.value = false;
            }
        }, 1000);
        console.log("sendCode", res);
      }
  }
</script>

<style lang="less" scoped>
  .login-form {
    &-wrapper {
      width: 360px;
    }

    &-title {
      color: var(--color-text-1);
      font-weight: 800;
      font-size: 28px;
      line-height: 32px;
    }

    &-sub-title {
      color: var(--color-text-3);
      font-size: 16px;
      line-height: 24px;
    }

    &-error-msg {
      height: 32px;
      color: rgb(var(--red-6));
      line-height: 32px;
    }

    &-password-actions {
      display: flex;
      justify-content: space-between;
    }

    &-register-btn {
      color: var(--color-text-3) !important;
    }
  }
  .vbtn{
        height: 100%;
        display: flex;
        align-items: center;
        padding-top: 2px;
        color: rgb(var(--arcoblue-5));
        cursor: pointer;
        user-select: none;
    }
</style>
