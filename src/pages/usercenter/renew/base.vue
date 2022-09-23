<template>
  <div class="renews">
    <el-dialog class="dialog-actions renewsJust" :visible="filedVisible" :modal-append-to-body=false :close-on-click-modal=false :before-close="close">
      <div slot="title" class="dialog-header1">
        请填写以下信息，我们将尽快与您联系。
      </div>
      <el-form ref="ruleForm" :model="ruleForm" label-width="50px" :rules="rules">
        <el-form-item label="姓名" prop="truename" style="width: 250px;">
          <el-input v-model="ruleForm.truename"></el-input>
        </el-form-item>
        <el-form-item label="职位" prop="position" style="width: 250px;">
          <el-input v-model="ruleForm.position"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email" style="width: 250px;">
          <el-input v-model="ruleForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile" style="width: 250px;">
          <el-input v-model="ruleForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer1">
        <el-button type="primary" @click="submitFormRule('ruleForm')">提 交</el-button>
      </div>
    </el-dialog>

    <!-- 提示 -->
    <div class="alert successSubmitTips" v-if="showTips">
      <div class="right right1" >
        <span>提交成功</span>
      </div>
    </div>
  </div>
</template>
<script>
  import Axios from 'axios'
  import { mapState } from "vuex"
export default {
  name:'RenewBase',
  props: {
    filedVisible: Boolean
  },
  data () {
    return {
      showTips: false,
      ruleForm: {
        truename: '',
        position: '',
        email: '',
        mobile: ''
      },
      rules: {
        truename:[
          {validator: (rule, value, callback) => {
            if (!value) {
              callback(new Error('姓名不能为空'))
            }else{
              let reg = /^\s*$/g
              if(!reg.test(value)){
                callback()
              }else{
                callback(new Error('请输入正确的姓名'))
              }
            }
          }, required: true, trigger: 'blur'}
        ],
         position: [
          {validator: (rule, value, callback) => {
            if (!value) {
              callback(new Error('职位不能为空'))
            }else{
              let reg = /^\s*$/g
              if(!reg.test(value)){
                callback()
              }else{
                callback(new Error('请输入正确的职位'))
              }
            }
          }, required: true, trigger: 'blur'}
        ],
        email: [
          { validator: (rule, value, callback) => {
            if (!value) {
              callback(new Error('邮箱地址不能为空'))
            } else {
              let reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
              if(reg.test(value)){
                callback()
              }else{
                callback(new Error('请输入正确的邮箱地址'))
              }
            }
          }, required: true, trigger: 'blur'}
        ],
        mobile: [
          { validator: (rule, value, callback) => {
            if (!value) {
              callback(new Error('电话号码不能为空'))
            } else {
              let reg = /^1[3456789]\d{9}$/
              if(reg.test(value)){
                callback()
              }else{
                callback(new Error('请输入正确的电话号码'))
              }
            }
          }, required: true, trigger: 'blur' }
        ],
      }
    }
  },
  computed:{
    ...mapState({
      accountData:state => state.UserCenter.accountData
    }),
  },
    watch: {
      accountData: {
        handler(val) {
          this.ruleForm.email = val.email
          this.ruleForm.truename = val.truename || "",
          // this.ruleForm.position = val.position || "",
          this.ruleForm.mobile = val.mobile
        },
        deep:true
      }
    },
  methods: {
    close () {
      this.$emit('closeD')
    },
    submitForm(){
      window.Axios({
        method: 'post',
        url: '/api/user/vipcontract',
        data: {
          uid: this.accountData.uid,
          username: this.accountData.username,
          position:this.ruleForm.position,
          truename:this.ruleForm.truename,
          email: this.ruleForm.email,
          mobile: this.ruleForm.mobile,
          endtime: this.accountData.endtime
        }
      }).then(res => {
        if(res.data.code === 200){

          this.showTips = true
          setTimeout(() => {
            this.showTips = false
            this.close()
            this.$emit('closeDs')
          }, 2000)
        }
      })
    },
    submitFormRule(formName) {
      console.info( this.$refs[formName])
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submitForm()
        } else {

          console.log('error submit!!');
          return false;
        }
      });
    },
  }
}
</script>

<style lang="less" scoped>
  .renews{
    .renewsJust{
      /deep/.el-dialog {
        border-radius: 20px!important;
        width: 400px;
        // height: 279px;
        box-shadow: -3px 2px 8px 0px rgba(188, 188, 188, 0.33);
      }
      /deep/.el-dialog__header{
        // padding: 0;
        // height: 0;
        // line-height: 0;
        // border: none;
      }
      /deep/.el-dialog__header:after{
        height: 0;
      }
      /deep/.el-dialog__footer{
        // padding: 10px 20px 20px;
        border-top: none;
      }
      /deep/.el-dialog__body{
        padding: 0 10px;
      }
      .el-form-item{
        margin-bottom: 15px;
      }
      /deep/.el-form-item__error{
        padding-left: 20px;
        padding-top: 0;
      }
      /deep/.v-modal{
        background: #ebebeb !important;
      }
      .el-form{
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
      }
    }

  }
  .dialog-header1{
    position: relative;
    height: 20px;
    line-height: 20px;
    text-align: center;
    color: #333;
    font-size: 15px;
    font-weight: bold;

  }
  .dialog-footer1{
    text-align: center;
  }
  .successSubmitTips{
    display: block;
    div{
      display: block;
    }
  }
</style>
