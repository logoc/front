ƒ<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :loading="loading" helpMessage="编辑和修改菜单" width="800px" :minHeight="460" :title="getTitle" @ok="handleSubmit">
    <a-form ref="formRef" :model="formData" auto-label-width>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item field="name" label="合作平台" validate-trigger="input" :rules="[{required:true,message:'请填写合作平台'}]" style="margin-bottom:15px;">
            <a-input v-model="formData.name" placeholder="请填合作平台" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item field="nickname" label="合作时间" validate-trigger="input" style="margin-bottom:15px;" :rules="[{required:true}]">
            <a-date-picker v-model="formData.nickname" :style="{width:'200px'}" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="账号类型" field="pid" style="margin-bottom:15px;" :rules="[{required:true}]">
            <a-tree-select placeholder="选择账号类型" :data="roleList" 
            :fieldNames="{
                key: 'id',
                title: 'name',
                children: 'children'
              }"
              multiple   v-model="formData.roleid">
            </a-tree-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item field="dept_id" label="账号昵称" style="margin-bottom:15px;" :rules="[{required:true}]">
            <a-tree-select placeholder="选择部门" :data="deptList" 
            :fieldNames="{
                key: 'id',
                title: 'name',
                children: 'children'
              }"  v-model="formData.dept_id">
            </a-tree-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item field="粉丝数" label="粉丝数" style="margin-bottom:15px;" :validate-trigger="['change', 'blur']" :rules="[{required:true}]">
            <a-input-number v-model="formData.dept_id" placeholder="请填粉丝数" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item field="password" label="发布链接" validate-trigger="input" style="margin-bottom:15px;">
            <a-input v-model="formData.password" placeholder="请填发布链接"  />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item field="mobile" label="合作形式" style="margin-bottom:15px;" :rules="[{required:true}]">
            <a-input  v-model="formData.mobile" placeholder="请填合作形式" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item field="tel" label="平台价/刊例" style="margin-bottom:15px;" :rules="[{required:true}]">
            <a-input v-model="formData.tel" placeholder="请填平台价/刊例" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item field="email" label="执行价(含税)" style="margin-bottom:15px;" :rules="[{required:true}]">
            <a-input-number v-model="formData.dept_id" placeholder="请填执行价(含税)" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item field="address" label="折扣说明" style="margin-bottom:15px;" :rules="[{required:true,message:'请填折扣说明'}]">
            <a-input v-model="formData.address" placeholder="请填折扣说明" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item field="city" label="税率" style="margin-bottom:15px;" :rules="[{required:true,message:'请填税率'}]">
            <a-input-number v-model="formData.dept_id" placeholder="请填税率" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item field="company" label="事业部" style="margin-bottom:15px;" :rules="[{required:true}]">
            <a-input v-model="formData.company" placeholder="请填事业部" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item field="remark" label="项目号" style="margin-bottom:15px;" :rules="[{required:true}]">
            <a-input v-model="formData.company" placeholder="请填项目号" />
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <a-form-item field="remark" label="项目名称" style="margin-bottom:15px;" :rules="[{required:true}]">
            <a-input v-model="formData.company" placeholder="请填项目名称" />
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <a-form-item field="remark" label="支付单号" style="margin-bottom:15px;" :rules="[{required:true}]">
            <a-input v-model="formData.remark" placeholder="请填支付单号" />
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <a-form-item field="remark" label="供应商名称" style="margin-bottom:15px;" :rules="[{required:true}]">
            <a-input v-model="formData.remark" placeholder="请填供应商名称" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item field="remark" label="联系方式" style="margin-bottom:15px;" :rules="[{required:true}]">
            <a-input v-model="formData.remark" placeholder="请填联系方式" />
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
  import { getParent } from '@/api/system/dept';
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
            nickname: '',
            dept_id: 0,
            roleid: [],
            username: "",
            password: "",
            avatar:"",
            tel:"",
            mobile:"",//手机
            email:"",//邮箱
            address:"",//地址
            city:"",//城市
            remark:"",//备注
            company:"",//公司
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
          const deptdata = await getParent();
          const parntList_df : any=[{id: 0,name: "未选部门",pid: 0}];
          if(deptdata){
            deptList.value=parntList_df.concat(deptdata)
          }else{
            deptList.value=parntList_df
          }
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
            if(!unref(isUpdate)&&formData.value.password==""){
              formData.value.password="123456"
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
