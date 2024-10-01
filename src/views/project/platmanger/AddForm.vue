<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :isPadding="false" :loading="loading" width="700px" @height-change="onHeightChange" :minHeight="modelHeight" :title="getTitle" @ok="handleSubmit">
    <div class="addFormbox" :style="{'min-height':`${windHeight}px`}">
      <div class="tabs-content">
        <a-form ref="formRef" :model="formData" auto-label-width>
          <div class="content_box">
              <!--基础信息-->
              <a-scrollbar style="overflow: auto;" :style="{height:`${windHeight}px`}">
                <div class="besecontent" >
                  <a-row :gutter="16">
                    <a-col :span="14">
                      <a-form-item field="account_type" label="账号类型" validate-trigger="input" :rules="accountTypeRules" >
                        <a-input v-model="formData.account_type" placeholder="填写账号类型" :max-length="50" allow-clear show-word-limit />
                      </a-form-item>
                    </a-col>
                    <a-col :span="10">
                      <a-form-item field="order_id" label="排序" validate-trigger="input" style="margin-bottom:15px;">
                        <a-input-number  v-model="formData.order_id" placeholder="请填排序" />
                      </a-form-item>
                    </a-col>
                    <a-col :span="24">
                      <a-form-item field="remark" label="备注" style="margin-bottom:15px;">
                        <a-textarea v-model="formData.remark" placeholder="请填备注"  :max-length="200" allow-clear show-word-limit :auto-size="{minRows:3,maxRows:5}"/>
                      </a-form-item>
                    </a-col>
                  </a-row>
                </div>
              </a-scrollbar>
          </div>
        </a-form>
      </div>
    </div>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref} from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import useLoading from '@/hooks/loading';
  import { cloneDeep } from 'lodash-es';
  //api
  import { save, isAccountTypeExist } from './api/account_api';
  import { Message } from '@arco-design/web-vue';
  export default defineComponent({
    name: 'AddForm',
    components: { BasicModal },
    emits: ['success'],
    setup(_, { emit }) {
      const isUpdate = ref(false);
      const modelHeight= ref(200);
      const windHeight= ref(200);
      //表单
      const { loading, setLoading } = useLoading();
      const formRef = ref<FormInstance>();
      //表单字段
      const basedata={
            id: 0,
            account_type: '',
            plat_id: 0,
            createtime: '',
            remark: '',
            order_id: 0,
        }
      const formData = ref(basedata)
      //编辑器
      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
          formRef.value?.resetFields()
          setLoading(true);
          setModalProps({ confirmLoading: false });
          isUpdate.value = !!data?.isUpdate;
          if (unref(isUpdate)) {
            formData.value=cloneDeep(data.record)
          }else{
            formData.value=basedata
          }
          formData.value.plat_id=data.plat_id
          setLoading(false);
      });
      const getTitle = computed(() => (!unref(isUpdate) ? '新增数据' : '编辑数据'));
     //点击保存数据
     const handleSubmit = async () => {
      try {
          const res = await formRef.value?.validate();
          if (!res) {
            let savedata=cloneDeep(unref(formData))
            const resultdata = await save(savedata);
            console.log(resultdata);
            if(resultdata > 0){
              Message.success({ content: '创建成功', id:"saveData"});
              closeModal()
              emit('success');
            }else{
              Message.error({ content: '创建失败', id:"saveData"});
            }
           
          }
        } catch (error) {
          Message.error({ content: '创建失败,error', id:"saveData"});
          Message.clear("top")
        }
      };


      //验证账号唯一性
      const accountTypeRules = [{
         validator: (value:any, cb:any) => {
          return new Promise(async(resolve) => {
            if(!value){
              cb('请填写类型名称')
            }else{
              if (!isUpdate.value) {
                let sdata={account_type:value, plat_id:formData.value.plat_id}
                const resData = await isAccountTypeExist(sdata);
                if(resData.code==1){
                  cb(resData.message)
                }
              }
            }
            resolve(true)
          })
        }
      }];
       //监听高度
       const onHeightChange=(val:any)=>{
        windHeight.value=val
      }
      return { 
        registerModal, 
        getTitle, 
        handleSubmit,
        formRef,
        loading,
        formData,
        OYoptions:[
          { label: '正常', value: 0 },
          { label: '禁用', value: 1 },
          ],
        modelHeight,
        accountTypeRules,
        onHeightChange,windHeight,
      };
    },
  });
</script>
<style lang="less" scoped>
  @import '@/assets/style/formlayer.less';
  .tabs-content{
    padding: 0px 25px;
  }
  //上传图片
  .upimagebox{
    display: flex;
    .imagebtn{
      position: relative;
      width: 160px;
      height: 90px;
      background-color: var(--color-neutral-1);
      border-radius: 4px;
      overflow: hidden;
      -ms-flex-negative: 0;
      flex-shrink: 0;
      //预览
      .upload-show-picture{
        position: relative;
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        img{
          height: 100%;
        }
        &:hover{
          .upload-show-picture-mask{
             opacity: 1;
          }
        }
        .upload-show-picture-mask{
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            color: var(--color-white);
            font-size: 16px;
            line-height: 90px;
            text-align: center;
            background: rgba(0, 0, 0, 0.5);
            cursor: pointer;
            opacity: 0;
            transition: opacity 0.1s cubic-bezier(0, 0, 1, 1);
        }
      }
      .upload-picture-card{
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        .upload-picture-card-text{
           text-align: center;
           color:  var(--color-neutral-5);
        }
      }
    }
  }
</style>

