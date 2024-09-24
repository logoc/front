<template>
  <div class="container">
    <!-- <Breadcrumb :items="['menu.user', 'menu.user.setting']" /> -->
    <Breadcrumb :items="[route.matched[0].meta.locale, route.meta.locale]" />
    <a-row style="margin-bottom: 16px">
      <a-col :span="24">
        <UserPanel :loading="loading" :formData="formData"/>
      </a-col>
    </a-row>
    <a-row class="wrapper">
      <a-col :span="24">
        <a-tabs default-active-key="1">
          <a-tab-pane key="1" >
            <template #title>
              <icon-calendar/> 平台类型
            </template>
            <PlatFormTab :loading="loading" :formData="formData"/>
          </a-tab-pane>
          <a-tab-pane key="2">
            <template #title>
              <icon-calendar/> 账号类型
            </template>
            <AccountTypeTab :loading="loading" :formData="formData"/>
          </a-tab-pane>
        </a-tabs>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
  import PlatFormTab from './platform.vue';
  import AccountTypeTab from './account_type.vue';
  import { useRoute } from 'vue-router'
  const route = useRoute();
</script>

<script lang="ts">
  export default {
    name: 'Setting',
  };
</script>

<style scoped lang="less">
  .container {
    padding: 0 20px 20px 20px;
  }

  .wrapper {
    padding: 20px 0 0 20px;
    min-height: 580px;
    background-color: var(--color-bg-2);
    border-radius: 4px;
  }

  :deep(.section-title) {
    margin-top: 0;
    margin-bottom: 16px;
    font-size: 14px;
  }
</style>
