<template>
  <div>
    <div class="alert successSubmitTips">
      <!-- 提交成功 -->
      <div class="right right1" @click="hideRightAlerts()">
        <span>提交成功</span>
      </div>
      <!-- 请输入名称 -->
      <div class="wrong wrong1" @click="hideWrongAlerts()">
        <span>请输入问题描述</span>
      </div>
    </div>
    <div class="dialog-body1">
      <div class="dialog-content">
        <!-- <form id="formFankui"> -->
        <el-form :model="fankuiForm" :rules="fankuiRules" ref="fankuiForm" label-width="50px" id="formFankui">
          <div class="content">
            <div class="fankui-need">*</div>
            <div class="dialog_select1">请选择问题分类</div>
            <!-- <el-row class="select1_content">
              <el-button size="mini" round name="sjqs">数据缺少</el-button>
              <el-button size="mini" round name="sjbc">数据报错</el-button>
              <el-button size="mini" round name="zlbc">资料补充</el-button>
              <el-button size="mini" round name="qtwt">其它问题</el-button>
            </el-row> -->
            <el-radio-group v-model="fankuiForm.upfile" size="small">
              <el-radio-button label="1">数据缺少</el-radio-button>
              <el-radio-button label="2">数据报错</el-radio-button>
              <el-radio-button label="3">资料补充</el-radio-button>
              <el-radio-button label="5">其它问题</el-radio-button>
            </el-radio-group>
            <!-- <input type="text" name="upfile" v-model="question_type" style="width: 0px; height: 0px; opacity: 0"> -->
            <el-form-item prop="upfile" style="width: 0px; height: 0px; opacity: 0">
              <el-input v-model="fankuiForm.upfile"></el-input>
            </el-form-item>
          </div>
          <div class="content1">
            <div class="fankui-need">*</div>
            <div class="dialog_select1">请输入问题描述</div>
            <div id="active_name2" >
              <quill-editor
                ref="myTextEditor"
                v-model="fankuiForm.description"
                :options="editorOption"
                @blur="onEditorBlur($event)"
                @focus="onEditorFocus($event)"
                @ready="onEditorReady($event)">
              </quill-editor>
              <el-form-item prop="description" style="width: 0px; height: 0px; opacity: 0">
                <el-input v-model="fankuiForm.description"></el-input>
              </el-form-item>
              <!-- <input type="text" name="description" v-model="content" style="width: 0px; height: 0px; opacity: 0"> -->
              <!-- <el-upload class="upload-demo"
                :action="qnLocation"
                :before-upload='beforeUpload'
                :data="uploadData"
                :on-success='upScuccess'
                ref="upload" style="display:none">
              <el-button size="small" type="primary" id="imgInput" element-loading-text="插入中,请稍候">点击上传</el-button>
              </el-upload> -->
            </div>
          </div>
          <div class="active_beizhu">
            上传图片最大不超过5M
          </div>
          <div class="content2">
            <!-- <div class="content_phone">联系方式</div>
            <input type="text" placeholder="请输入手机号" class="active_name" name="phonenumber"> -->
            <el-form-item label="联系方式" prop="lxfs" label-width="120px">
              <el-input v-model="fankuiForm.phonenumber" placeholder="请输入联系方式" style="width: 200px"></el-input>
              <!-- <button type="button" class="wrap_button" @click="handleSubmit1('fankuiForm')">提交反馈</button> -->
              <el-button type="primary" class="wrap_button" @click="handleSubmit1('fankuiForm')" :disabled="nodisabled">提交反馈</el-button>
            </el-form-item>

          </div>
        </el-form>
        <!-- </form> -->
      </div>
    </div>
    <!-- <div class="dialog-body2">
      <div class="body2-title">
        <div class="active_question">常见问题</div>
        <div class="active_right">
          <span>更多数据库使用帮助</span>
          &nbsp;&nbsp;
          <router-link to="/help" style="color:#4A77E8">帮助中心</router-link>
        </div>
      </div>
      <ul class="body2-questions">
        <li class="questions-one">
          <p class="questions-mima">1、如何修改密码？</p>
          <p class="questions-answer">答：登录状态下，在首页点击设置>个人资料>我的账号>修改登录密码 ，点击提交即可。</p>
        </li>
        <li class="questions-one">
          <p class="questions-mima">2、上传身份认证资料遇到问题？</p>
          <p class="questions-answer">答：检查附件的格式是否符合要求，上传附件支持JPG,PNG,GIF，每个大小不超过10M ; 检查浏览器设置问题或更新浏览器的flash版</p>
        </li>
        <li class="questions-one">
          <p class="questions-mima">3、通过手机号注册时激活码输入错误怎么办？</p>
          <p class="questions-answer">答：通过手机号注册时，如果激活码输入错误，可以点击重新发送。</p>
        </li>
      </ul>
    </div> -->
  </div>
</template>

<script>
// import { quillEditor } from 'vue-quill-editor'
import { quillRedefine } from 'vue-quill-editor-upload'
import { mapState } from 'vuex'
import md from '@/md'
export default {
  data () {
    // 必填
    let checkRequired = (rule, value, callback) => {
      if (value) {
        return callback()
      } else {
        callback(new Error(rule.message))
      }
    };
    return {
      editorOption: {},
      // 反馈建议
      fankuiForm: { // v-model对应
        upfile: '1',
        description: '',
        phonenumber: '',
      },
      fankuiRules: { // 验证规则
        upfile: [
          { validator: checkRequired, message: '请选择反馈类型', trigger: 'blur' },
        ],
        description: [
          { validator: checkRequired, message: '请输入反馈建议', trigger: 'blur' }
        ],
        phonenumber: [
          { required: false, trigger: 'blur' }
        ],
      },
      nodisabled:false,
    }
  },
  computed: {
    ...mapState({
      accountData:state => state.UserCenter.accountData
    })
  },
  methods: {
    toggleAlert(cls) { // 切换alert提示
      $('.alert').fadeIn()
      $('.alert').find('.' + cls).fadeIn()
      setTimeout(() => {
        $('.alert').fadeOut()
        $('.alert').find('.' + cls).fadeOut()
      }, 2000)
    },
    hideRightAlerts() {
      $('.alert').hide()
      this.$emit("closeDialog")
    },
    hideWrongAlerts() {
      $('.alert').hide()
    },
    // 反馈建议 - 提交按钮事件
    handleSubmit1(formName){
      if (this.fankuiForm.description) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.nodisabled=true;
            window.Axios({
              url: "/api/usercenter/feedback",
              method: "post",
              data: _.assign(this.fankuiForm, {
                username: this.vueGetCookie('userName'),
                platform: 13,
                accesstoken: this.vueGetCookie('accesstoken'),
              })
            }).then(res => {
              /*this.toggleAlert('right1')
              setTimeout(() => {
                this.nodisabled=false;
                this.$emit("closeDialog")
                // 提交成功后重置
                this.resetFankui = false
                this.fankuiForm = {
                  upfile: '1',
                  description: '',
                  phonenumber: '',
                }
              }, 2000)*/
              this.$Message.success('提交成功', () => {
                this.nodisabled=false;
                this.$emit("closeDialog")
                // 提交成功后重置
                this.resetFankui = false
                this.fankuiForm = {
                  upfile: '1',
                  description: '',
                  phonenumber: '',
                }
              })
            }).catch(err => {
              this.nodisabled=false;
              console.log(err)
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        })
      } else {
        //this.toggleAlert('wrong1')
        this.$Message.error('请输入问题描述')
      }
    },
    // 富文本框
    onEditorBlur(editor) {
      // console.log('editor blur!', editor)
    },
    onEditorFocus(editor) {
      // console.log('editor focus!', editor)
    },
    onEditorReady(editor) {
      // console.log('editor ready!', editor)
    },
  },
  created() {
    this.fankuiForm.phonenumber = this.accountData.mobile || this.accountData.email
    this.editorOption = quillRedefine(
      {
        // 图片上传的设置
        uploadConfig: {
          action: '/api/upload/uploadimage',  // 必填参数 图片上传地址
          // 必选参数  res是一个函数，函数接收的response为上传成功时服务器返回的数据
          // 你必须把返回的数据中所包含的图片地址 return 回去
          res: (response) => {
            // console.log(response)
            // console.log(response.data.url)
            return JSON.parse(md.decryptResponse(response.data, 'yaozh_vip2020')).url
          },
          methods: 'POST',  // 可选参数 图片上传方式  默认为post
          name: 'upfile' , // 图片上传参数名
          size: 5120,  // 可选参数   图片限制大小，单位为Kb, 1M = 1024Kb
          accept: 'image/png, image/gif, image/jpeg, image/bmp, image/x-icon',  // 可选参数 可上传的图片格式
          // start: () => { },  // 可选参数 接收一个函数 开始上传数据时会触发
          // end: () => { },  // 可选参数 接收一个函数 上传数据完成（成功或者失败）时会触发
          // success: () => {},  // 可选参数 接收一个函数 上传数据成功时会触发
          // error: () => { }  // 可选参数 接收一个函数 上传数据中断时会触发
        },
        placeholder: ' ',
        toolOptions: [['image']],  // 可选参数  选择工具栏的需要哪些功能  默认是全部
        // handlers: {},
        //可选参数 重定义的事件，比如link等事件
      }
    )
  },
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/app.less";
@import "~@/assets/less/var.less";
/deep/.ql-image {
  position: relative;
  &::before {
    content: "点击上传图片";
    position: absolute;
    width: 100px;
    top: 50%;
    left: 24px;
    margin-top: -12px;
  }
}
  .successSubmitTips {
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -52.5px;
    margin-left: -87.5px;
  }
  .dialog-body1{
    position:relative;
    height: 420px;
    .dialog-content{
      .content{
        width: 100%;
        float: left;
        .fankui-need {
          color: #f00;
          float: left;
          margin-top: 1px;
          margin-right: 5px;
        }
        .dialog_yuan{
          width: 5px;
          height: 5px;
          background: #FF0C0C;
          float:left;
          margin: 10px 10px 0 0;
          border-radius: 50%;
        }
        .dialog_select1{
          float: left;
          width: 100px;
          margin-right: 12px;
        }
        .select1_content{
          width: 360px;
          height: 20px;
          float: left;
          .el-button{
            padding: 2px 10px;
            width: 76px;
            height: 30px;
          }
        }
      }
      .content1{
        width: 100%;
        height: 300px;
        float: left;
        .fankui-need {
          color: #f00;
          float: left;
          margin-top: 16px;
          margin-right: 5px;
        }
        .dialog_yuan{
          width: 5px;
          height: 5px;
          background: #FF0C0C;
          float:left;
          margin: 20px 10px 0 0;
          border-radius: 50%;
        }
        .dialog_select1{
          float: left;
          width: 100px;
          margin-right: 12px;
          margin-top: 14px
        }
        #active_name2{
          width: 604px;
          border-radius: 4px!important;
          outline: none;
          float: left;
          margin-top: 18px;
          height: 146px;
          .quill-editor{
            height: 230px;
          }
        }
      }
      .active_beizhu{
        color:#97A2BF;
        width: 100%;
        height: 30px;
        float:left;
        padding-left: 126px;
        }
      .content2{
        float:left;
        width:100%;
        .content_phone{
          height: 30px;
          float: left;
          margin-left: 57px;
          line-height: 30px;
        }
        .active_name{
          width: 264px;
          height: 28px;
          margin-left: 15px;
          font-size: 13px;
          line-height: 28px;
          outline: none;
          border-radius: 4px;
          float:left;
          background: #fff;
          padding-left: 10px;
          border: 1px solid #ccc;
          &:focus {
            border-color: @PrimaryColor;
          }
        }
        .wrap_button {
          margin-left: 18px;
          border: none;
          border-radius: 4px;
          height: 30px;
          line-height: 30px;
          background-color: @PrimaryColor;
          color: #fff;
          padding: 0px 50px;
          transition: all 100ms;
          &:hover {
            background-color: Lighten(@PrimaryColor, 5%);
            transition: all 100ms;
          }
        }

      }
    }
  }
  .dialog-body2{
    position:relative;
    height: 210px;
    .body2-title{
      position: relative;
      box-sizing: border-box;
      padding-bottom: 5px;
      padding-left: 20px;
      // border-bottom: 1px solid @BorderColor;
      height: 28px;
      float: left;
      width: 100%;
      &::after {
        content: '';
        position: absolute;
        width: calc(100% + 40px);
        height: 1px;
        border-radius: 50%;
        background-color: @BorderColor;
        bottom: -1px;
        left: -20px;
      }
      &::before {
        content: '';
        position: absolute;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background-color: @PrimaryColor;
        top: 50%;
        left: 2px;
        margin-top: -3px;
      }
      .active_question {
        color: @PrimaryColor;
        float: left;
        height: 28px;
        line-height: 28px;
        font-size: 15px;
        font-weight: bold;
      }
      .active_right{
        float: right;
        height: 28px;
        line-height: 28px;
        .a{
          color: @PrimaryColor;
        }
      }
    }
    .body2-questions{
      width:100%;
      float: left;
      .questions-one{
        margin-top: 18px;
        margin-left: 20px;
        height: 35px;
        font-size: 12px;
        .questions-mima{
          margin-bottom:10px;
          height: 12px;
          line-height: 12px;
        }
        .questions-answer{
          height: 12px;
          line-height: 12px;
          color:#9AA2B4;
          margin-left:18px;
        }
      }

    }
  }
</style>
