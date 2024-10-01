<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :loading="loading" helpMessage="编辑和修改菜单" width="800px" :minHeight="320" :title="getTitle" @ok="handleSubmit">
    <a-form ref="formRef" :model="formData" auto-label-width>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item field="username" label="登录账号" style="margin-bottom:15px;"  :rules="usernameRules"
          :validate-trigger="['change', 'blur']" required>
            <a-input v-model="formData.username" placeholder="请填登录账号" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item field="name" label="用户名" validate-trigger="input" :rules="[{required:true,message:'请填写用户名'}]" style="margin-bottom:15px;">
            <a-input v-model="formData.name" placeholder="请填用户名" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="选择角色" field="pid" style="margin-bottom:15px;">
            <a-tree-select placeholder="选择角色" :data="roleList" 
            :fieldNames="{
                key: 'id',
                title: 'name',
                children: 'children'
              }"
              v-model="formData.roleid">
            </a-tree-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item field="password" label="登录密码" style="margin-bottom:15px;">
            <a-input v-model="formData.password" placeholder="登录密码(不修改则为空，默认密码God123@)" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item field="remark" label="备注" style="margin-bottom:15px;">
            <a-textarea v-model="formData.remark" placeholder="请填备注" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item field="avatar" label="头像" style="margin-bottom:15px;">
            <a-upload
                action="/"
                :show-file-list="false"
                @change="onChange"
                :custom-request="customRequest"
              >
                <template #upload-button>
                  <div
                    :class="`arco-upload-list-item`"
                  >
                    <div
                      class="arco-upload-list-picture custom-upload-avatar"
                      v-if="formData.avatar"
                    >
                      <img :src="formData.avatar" />
                      <div class="arco-upload-list-picture-mask">
                        <IconEdit />
                      </div>
                    </div>
                    <div class="arco-upload-picture-card" v-else>
                      <div class="arco-upload-picture-card-text">
                        <IconPlus />
                        <div style="margin-top: 10px; font-weight: 600">上传头像</div>
                      </div>
                    </div>
                  </div>
                </template>
              </a-upload>
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
  import { getRole, save,DataItem,isAccountexist} from '@/api/system/account';
  import { IconPicker ,Icon} from '@/components/Icon';
  import { Message } from '@arco-design/web-vue';
  import type { RequestOption} from '@arco-design/web-vue/es/upload/interfaces';
  import { userUploadApi } from '@/api/common';
  export default defineComponent({
    name: 'AddBook',
    components: { BasicModal,IconPicker,Icon },
    emits: ['success'],
    setup(_, { emit }) {
      const { t } = useI18n();
      const isUpdate = ref(false);
      const roleList = ref<DataItem[]>([]);
      const deptList = ref<DataItem[]>([]);
      //表单
      const formRef = ref<FormInstance>();
      //表单字段
      const basedata={
            id:0,
            name: '',
            roleid: [],
            username: "",
            password: "",
            avatar:"",
            remark:"",//备注
        }
      const formData = ref(basedata)
      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
          formRef.value?.resetFields()
          setModalProps({ confirmLoading: false });
          const resultdata = await getRole();
          if(resultdata){
            roleList.value=resultdata
          }else{
            roleList.value=[]
          }
          isUpdate.value = !!data?.isUpdate;
          if (unref(isUpdate)) {
            formData.value=cloneDeep(data.record)
          }else{
            formData.value=basedata
          }
      });
      const getTitle = computed(() => (!unref(isUpdate) ? '新增管理账号' : '编辑管理账号'));
     //点击确认
     const { loading, setLoading } = useLoading();
     const handleSubmit = async () => {
      try {
          const res = await formRef.value?.validate();
          if (!res) {
            setLoading(true);
            if(!unref(isUpdate)&&formData.value.password==""){
              formData.value.password="God123@"
            }
            Message.loading({content:"更新中",id:"upStatus"})
            await save(unref(formData));
            Message.success({content:"更新成功",id:"upStatus"})
            closeModal()
            emit('success');
            setLoading(false);
          }
        } catch (error) {
          setLoading(false);
          Message.clear("top")
        }
      };
      //上传附件改变
      const onChange=(fileList:any)=>{
        console.log("fileList",fileList)
      }
      //上传附件
      const customRequest = (options: RequestOption) => {
          // docs: https://axios-http.com/docs/cancellation
          const controller = new AbortController();
            (async function requestWrap() {
              const {
                onProgress,
                onError,
                onSuccess,
                fileItem,
              } = options;
              onProgress(20);
              const onUploadProgress = (event: ProgressEvent) => {
                let percent;
                if (event.total > 0) {
                  percent = (event.loaded / event.total) * 100;
                }
                onProgress(parseInt(String(percent), 10), event);
              };
              try {
                //开始手动上传
                const filename=fileItem?.name||""
                const resdata = await userUploadApi({ name: 'file', file: fileItem.file as Blob, filename,data:{cid:0}},onUploadProgress);
                //更新图片
                if(resdata){
                  formData.value.avatar=resdata.url
                }
              } catch (error) {
                onError(error);
              }
            })();
            return {
              abort() {
                controller.abort();
              },
            };
      };
      //验证账号唯一性
      const usernameRules = [{
        validator: (value:any, cb:any) => {
          return new Promise(async(resolve) => {
            if(!value){
              cb('请填写登录账号')
            }else{
              let sdata={username:value}
              if(formData.value.id>0){
                sdata=Object.assign({},sdata,{id:formData.value.id}) as any
              }
              const resData = await isAccountexist(sdata);
              if(resData.code==1){
                cb(resData.message)
              }
            }
            resolve(true)
          })
        }
      }];
      return { 
        registerModal, 
        getTitle, 
        handleSubmit,
        formRef,
        loading,
        formData,
        roleList,
        deptList,
        t,
        OYoptions:[
          { label: '否', value: 0 },
          { label: '是', value: 1 },
        ],
        onChange,
        customRequest,
        usernameRules,
      };
    },
  });
</script>
