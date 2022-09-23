<template>
  <div class="popbox">
    <!-- 问题反馈弹出框 -->
    <el-dialog :visible.sync="dialogFormVisible1" :modal-append-to-body="false" width="820px">
      <div slot="title" class="dialog-header">
        问题反馈
      </div>
      <DialogFeedback @closeDialog="closeDialogFeedback"></DialogFeedback>
    </el-dialog>
    <!-- 试用申请弹出框 -->
    <el-dialog :visible.sync="dialogFormVisible3" :modal-append-to-body="false" width="850px">
      <div slot="title" class="dialog-header">
        <span>试用申请</span>
      </div>
      <DialogProbation></DialogProbation>
    </el-dialog>
    <!-- 试用申请成功后的页面(现在包含在试用申请弹出框中v-if通过isHandled来切换) -->
    <!-- <el-dialog :visible.sync="dialogFormVisible30" :modal-append-to-body="false" width="820px">
      <div slot="title" class="dialog-header">
        <span>试用申请</span>
      </div>
      <DialogProbationAfter></DialogProbationAfter>
    </el-dialog> -->
    <!--首页显示的入口处按钮 -->
    <div class="la-pressButton">
      <el-button type="primary" class="iconfont" v-html="btnText"></el-button>
      <!-- <span v-html="btnText"  class="iconfont"></span> -->
      <div class="erwei" v-show="isQrCodeShow">
        <img src="~@/assets/imgs/scan_vipty_bottomrightcorner_2.png" />
        <p style="padding-top:10px;">扫码免费下载APP</p>
      </div>
      <div class="pressButton-box-ou">
        <div class="pressButton-box">
          <div class="pressButton-list" :class="{'pb-show': isShow}">
            <ul>
              <li>
                <a href="javascript:;" @click="handleOutClick1">
                  <i class="iconfont" style="font-size: 19px;">&#xe660;</i>问题反馈
                </a>
              </li>
              <li>
                <a @click="handleOutClick2()">
                  <i class="iconfont" style="font-size: 17px;">&#xe663;</i>在线咨询
                </a>
              </li>
              <li>
                <a @click="redirectToService">
                  <i class="iconfont" style="font-size: 16px;">&#xe699;</i>客服中心
                </a>
              </li>
              <!-- <li>
                <a href="javascript:;" @click="handleOutClick3">
                  <i class="iconfont" style="font-size: 19.5px;">&#xe89e;</i>试用
                </a>
              </li>-->
              <li>
                <a href="javascript:;" @click="handleOutClick4">
                  <i class="iconfont" style="font-size: 18.5px;">&#xe69c;</i>帮助中心
                </a>
              </li>
              <li>
                <a href="javascript:;" @mousemove="isQrCodeShow=true" @mouseout="isQrCodeShow=false"
                  @click="goAppDownload">
                  <i class="iconfont" style="font-size: 19px;">&#xe679;</i>APP下载
                </a>
              </li>
              <li>
                <a href="javascript:;" @click="handleOutClick5">
                  <i class="iconfont" style="font-size: 17px;">&#xe680;</i>产品手册
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import DialogProbation from '@/components/common/dialog-probation'
import DialogFeedback from '@/components/common/dialog-feedback'
// import { quillEditor } from 'vue-quill-editor'
import sha1 from "sha1"
import UUID from "uuid-js"
import { quillRedefine } from 'vue-quill-editor-upload'
import { mapState } from 'vuex'

export default {
  components: {
    // quillEditor,
    quillRedefine,
    DialogProbation,
    DialogFeedback,
  },
  data() {
    // 必填
    let checkRequired = (rule, value, callback) => {
      if (value) {
        return callback()
      } else {
        callback(new Error(rule.message))
      }
    };
    // 申请试用 - 检验账号
    let checkName = (rule, value, callback) => {
      if (value) {
        window.Axios({
          method: 'post',
          url: '/api/user/usercheckForyaozh',
          params: {
            name: value
          },
        }).then((res) => {
          if (res.data.code == 200) {
            this.sqNameError = 0
            return callback()
          } else {
            this.sqNameError = 1
            callback(new Error())
          }
        }).catch((err) => {
          console.log(err)
        })
      } else {
        this.sqNameError = 2
        callback(new Error())
      }
    };
    // 申请试用 - 检验手机号
    let checkPhone = (rule, value, callback) => {
      let testPhoneReg = new RegExp(/^[1][3,4,5,6,7,8][0-9]{9}$/) // 验证手机号
      let isPhoneRight = testPhoneReg.test(value) // 手机号是否正确
      if (value) {
        if (isPhoneRight) {
          callback()
        } else {
          callback(new Error('请输入正确的手机号码'))
        }
      } else {
        callback(new Error('请输入手机号码'))
      }
    };
    // 申请试用 - 检验邮箱
    let checkEmail = (rule, value, callback) => {
      let testEmailReg = new RegExp(/^[0-9A-Za-z][\.-_0-9A-Za-z]*@[0-9A-Za-z]+(\.[0-9A-Za-z]+)+$/) // 验证邮箱格式
      let isEmailRight = testEmailReg.test(value) // 邮箱格式是否正确
      if (value) {
        if (isEmailRight) {
          callback()
        } else {
          callback(new Error('请输入正确的邮箱地址'))
        }
      } else {
        callback(new Error('请输入邮箱地址'))
      }
    };
    return {
      dialogFormVisible1: false,
      dialogFormVisible3: false,
      btnText: "&#xe756;",
      isShow: false,
      isQrCodeShow: false
    }
  },
  computed: {
    ...mapState({
      isLogin: (state) => !state.UserCenter.accountData.username,
      username: state => state.UserCenter.accountData.username,
      grade_name: state => state.UserCenter.accountData.grade_name,
      accountData: state => state.UserCenter.accountData
    })
  },
  watch: {

  },
  methods: {
    goAppDownload() {
      ga("send", "event", "button", "click", "vip_home_corner_app")
      window._paq.push(['trackEvent', 'button', 'click', "vip_home_corner_app",])

      window.open("https://db.yaozh.com/app?ga_source=vip&ga_name=vip_home_corner_app")
    },
    // emit事件
    closeDialogFeedback() {
      this.dialogFormVisible1 = false
    },
    // 点击左侧栏中的“反馈”触发的事件
    handleOutClick1() {
      window.ga("send", "event", "button", "click", "vip_home_corner_fankui")
      window._paq.push(['trackEvent', 'button', 'click', "vip_home_corner_fankui",])

      this.dialogFormVisible1 = true
      // this.dialogFormVisible2 = false
      this.dialogFormVisible3 = false
      // this.dialogFormVisible4 = false
    },
    // 点击左侧栏中的“客服”触发的事件 - 美洽客服
    handleOutClick2() {
      window.ga("send", "event", "button", "click", "vip_home_corner_zixun")
      window._paq.push(['trackEvent', 'button', 'click', "vip_home_corner_zixun",])

      let _this = this;
      let random = UUID.create().toString();
      let sign_str = `nonce=${random}&timestamp=${new Date().getTime()}&web_token=${_this.accountData.email || _this.accountData.uid}`
      console.info(sign_str + '&2314e6df23cb93264629bbfa10e67c77');
      let sha1Result = sha1(sign_str + '&2314e6df23cb93264629bbfa10e67c77').toUpperCase();

      window.open(`https://1537030.udesk.cn/im_client/?web_plugin_id=103301&agent_id=208981&group_id=300631&c_name=${encodeURI(_this.username || '咨询客户')}&c_desc=${encodeURI(_this.grade_name || '暂无描述')}&c_email=${_this.accountData.email}&${sign_str}&signature=${sha1Result}`, '_blank')
    },
    // 点击左侧栏中的“试用”触发的事件
    handleOutClick3() {
      this.dialogFormVisible1 = false
      // this.dialogFormVisible2 = false
      this.dialogFormVisible3 = true
      // this.dialogFormVisible4 = false
    },
    // 点击左侧栏中的“帮助”触发的事件
    handleOutClick4() {
      window.ga("send", "event", "button", "click", "vip_home_corner_bangzhu")
      window._paq.push(['trackEvent', 'button', 'click', "vip_home_corner_bangzhu",])

      const routeData = this.$router.resolve({
        path: "/help",
      })
      window.open(routeData.href, '_blank')
    },
    // 点击左侧栏中的“产品手册”触发的事件
    handleOutClick5() {
      if (this.isLogin) {
        // 没有登录就跳到登录页面
        this.$router.push({
          path: `/login`,
          query: {
            ga_source: 'vip',
            ga_name: 'introduce'
          }
        })
      } else {
        window.ga("send", "event", "button", "click", "vip_home_corner_shouce")
        window._paq.push(['trackEvent', 'button', 'click', "vip_home_corner_shouce",])

        // window.open('/static/imgs/pdf/product_manual.pdf')
        // 产品手册更换为服务器地址
        window.open('https://zy.yaozh.com/product_manual.pdf')
      }
    },
    redirectToService() {
      window.ga("send", "event", "button", "click", "vip_home_corner_kefu")
      window._paq.push(['trackEvent', 'button', 'click', "vip_home_corner_kefu",])

      let hosts = '';
      if ((window.location.host).indexOf('dev') > -1) {
        hosts = 'https://vip-dev.yaozh.com/service';
      } else {
        hosts = 'https://vip.yaozh.com/service';
      }
      window.open(hosts, '_blank');
    }
  },
  created() {
    this.editorOption = quillRedefine(
      {
        // 图片上传的设置
        uploadConfig: {
          action: '/api/upload/uploadimage',  // 必填参数 图片上传地址
          // 必选参数  res是一个函数，函数接收的response为上传成功时服务器返回的数据
          // 你必须把返回的数据中所包含的图片地址 return 回去
          res: (respnse) => {
            // console.log(respnse)
            // console.log(respnse.data.url)
            return respnse.data.url
          },
          methods: 'POST',  // 可选参数 图片上传方式  默认为post
          name: 'upfile', // 图片上传参数名
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
  mounted() {
    // 左下按钮hover事件
    $('.la-pressButton').hover(() => {
      this.isShow = true
    }, () => {
      this.isShow = false
    })
    this.$root.$on('handleOutClick1', () => {
      this.handleOutClick1()
    })
  },
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/app.less";
@import "~@/assets/less/var.less";

.popbox {
  .el-dialog {
    position: relative;

    .alert {
      z-index: 9999;
      display: none;
      width: 175px;
      height: 105px;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-top: -52.5px;
      margin-left: -87.5px;

      .right {
        position: relative;
        width: 175px;
        height: 105px;
        background: url("/static/imgs/usercenter/alert/right.png") no-repeat;

        span {
          position: absolute;
          bottom: 22px;
          left: 0px;
          width: 100%;
          text-align: center;
          color: #fff;
          font-size: 14px;
          font-weight: bold;
        }
      }

      .wrong {
        position: relative;
        width: 175px;
        height: 105px;
        background: url("/static/imgs/usercenter/alert/wrong.png") no-repeat;

        span {
          position: absolute;
          bottom: 22px;
          left: 0px;
          width: 100%;
          text-align: center;
          color: #fff;
          font-size: 14px;
          font-weight: bold;
        }
      }

      div {
        display: none;
      }
    }
  }

  .el-dialog__header {}

  .el-dialog__body {
    height: auto;

    .dialog-body1 {
      position: relative;
      height: 420px;

      .dialog-content {
        .content {
          width: 100%;
          float: left;

          .fankui-need {
            color: #f00;
            float: left;
            margin-top: 1px;
            margin-right: 5px;
          }

          .dialog_yuan {
            width: 5px;
            height: 5px;
            background: #FF0C0C;
            float: left;
            margin: 10px 10px 0 0;
            border-radius: 50%;
          }

          .dialog_select1 {
            float: left;
            width: 100px;
            margin-right: 12px;
          }

          .select1_content {
            width: 360px;
            height: 20px;
            float: left;

            .el-button {
              padding: 2px 10px;
              width: 76px;
              height: 30px;
            }
          }
        }

        .content1 {
          width: 100%;
          height: 300px;
          float: left;

          .fankui-need {
            color: #f00;
            float: left;
            margin-top: 16px;
            margin-right: 5px;
          }

          .dialog_yuan {
            width: 5px;
            height: 5px;
            background: #FF0C0C;
            float: left;
            margin: 20px 10px 0 0;
            border-radius: 50%;
          }

          .dialog_select1 {
            float: left;
            width: 100px;
            margin-right: 12px;
            margin-top: 14px
          }

          #active_name2 {
            width: 604px;
            border-radius: 4px !important;
            outline: none;
            float: left;
            margin-top: 18px;
            height: 146px;

            .quill-editor {
              height: 230px;
            }
          }
        }

        .active_beizhu {
          color: #97A2BF;
          width: 100%;
          height: 30px;
          float: left;
          padding-left: 126px;
        }

        .content2 {
          float: left;
          width: 100%;

          .content_phone {
            height: 30px;
            float: left;
            margin-left: 57px;
            line-height: 30px;
          }

          .active_name {
            width: 264px;
            height: 28px;
            margin-left: 15px;
            font-size: 13px;
            line-height: 28px;
            outline: none;
            border-radius: 4px;
            float: left;
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

    .dialog-body2 {
      position: relative;
      height: 200px;

      .body2-title {
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

        .active_right {
          float: right;
          height: 28px;
          line-height: 28px;

          .a {
            color: @PrimaryColor;
          }
        }
      }

      .body2-questions {
        width: 100%;
        float: left;

        .questions-one {
          margin-top: 18px;
          margin-left: 20px;
          height: 35px;
          font-size: 12px;

          .questions-mima {
            margin-bottom: 10px;
            height: 12px;
            line-height: 12px;
          }

          .questions-answer {
            height: 12px;
            line-height: 12px;
            color: #9AA2B4;
            margin-left: 18px;
          }
        }

      }
    }

    .dialog-body3 {
      height: 163px;

      .dialog-content {
        .content {
          width: 100%;
          float: left;
          padding-left: 47px;

          .img {
            width: 644px;
            height: 163px;
          }
        }
      }
    }

    .dialog-body4 {
      margin-top: 20px;
      height: 315px;

      .input-content {
        width: 734px;
        height: 60px;
        margin-left: 46px;
        margin-top: 20px;
        float: left;

        .input-sq-name-error {
          color: #f56c6c;
          font-size: 12px;
          line-height: 1;
          padding-top: 4px;
          position: absolute;
          top: 100%;
          left: 0;
        }

        .input-one {
          width: 100%;
          height: 30px;

          .input-box1 {
            position: relative;
            width: 309px;
            margin-right: 20px;
            height: 100%;
            float: left;

            .need-shenqing {
              position: absolute;
              top: 0px;
              left: 0px;
              color: #f00;
              height: 40px;
              line-height: 40px;
            }

            .input-xin {
              width: 5px;
              height: 5px;
              background-color: #FE0B0C;
              border-radius: 50%;
              margin-top: 10px;
              float: left;
            }

            .input-word {
              width: 42px;
              height: 28px;
              float: left;
              text-align: center;
              line-height: 28px;
            }

            .input-name {
              width: 262px;
              height: 30px;
              float: left;

              .name-one {
                width: 260px;
                height: 28px;
                outline: none;
              }

              .layui-input {
                width: 260px;
                height: 28px;
                outline: none;
              }

              .layui-input1 {
                width: 260px;
                height: 28px;
                outline: none;
              }

              .text-style {
                color: red;
              }
            }
          }
        }
      }

      .input-content1 {
        width: 734px;
        height: 60px;
        margin-left: 46px;
        float: left;

        .input-one {
          width: 100%;
          height: 30px;

          .input-box1 {
            position: relative;
            width: 309px;
            margin-right: 20px;
            height: 100%;
            float: left;

            .need-shenqing {
              position: absolute;
              top: 0px;
              left: 0px;
              color: #f00;
              height: 40px;
              line-height: 40px;
            }

            .input-xin {
              width: 5px;
              height: 5px;
              background-color: #FE0B0C;
              border-radius: 50%;
              margin-top: 10px;
              float: left;
            }

            .input-word {
              width: 42px;
              height: 28px;
              float: left;
              text-align: center;
              line-height: 28px;
            }

            .input-name {
              width: 262px;
              height: 30px;
              float: left;

              .name-one {
                width: 260px;
                height: 28px;
                outline: none;
              }

              .layui-input {
                width: 260px;
                height: 28px;
                outline: none;
              }

              .layui-input1 {
                width: 260px;
                height: 28px;
                outline: none;
              }

              .text-style {
                color: red;
              }
            }
          }
        }

        .content1-submit {
          width: 264px;
          height: 30px;
          background: @PrimaryColor;
          color: white;
          outline: none;
          line-height: 30px;
          text-align: center;
          border: none;
          border-radius: 15px;
          margin-left: 180px;
          margin-top: 8px;
          transition: all 100ms;

          &:hover {
            background-color: Lighten(@PrimaryColor, 5%);
            transition: all 100ms;
          }
        }
      }
    }

    .dialog-body5 {
      margin-top: 120px;
      height: 374px;

      .dialog-content {
        height: 200px;

        .content {
          width: 100%;
          height: 200px;
          float: left;
          padding-left: 47px;

          .picture {
            float: left;

            .img {
              width: 160px;
              height: 200px;
              float: left;
            }
          }

          .content-word {
            width: 452px;
            height: 140px;
            margin: 35px 0 0 20px;
            float: left;

            .words-one {
              height: 50px;

              .success-word {
                font-size: 34px;
                color: @PrimaryColor;
                line-height: 50px;
                font-weight: 800;
                margin-right: 10px;
              }

              .success-word-one {
                font-size: 18px;
                line-height: 50px;
              }
            }

            .word-two {
              height: 80px;
              padding-top: 22px;

              .success-word-one {
                height: 30px;

                .success-diot {
                  width: 6px;
                  height: 6px;
                  background-color: #555B6D;
                  border-radius: 50%;
                  margin-top: 10px;
                  float: left;
                }

                .success-words {
                  font-size: 14px;
                  line-height: 30px;
                  margin-left: 10px;
                  color: #555B6D;
                  float: left;
                }
              }

              .success-word-two {
                height: 60px;

                .success-diot {
                  width: 6px;
                  height: 6px;
                  border-radius: 50%;
                  background-color: #555B6D;
                  margin-top: 10px;
                  float: left;
                }

                .success-words {
                  width: 430px;
                  font-size: 14px;
                  line-height: 30px;
                  margin-left: 10px;
                  color: #555B6D;
                  float: left;
                }
              }
            }
          }
        }
      }
    }
  }

  .la-pressButton {
    position: fixed;
    bottom: 30px;
    right: 25px;
    // text-align: center;
    line-height: 45px;
    color: white;
    z-index: 999;

    .el-button {
      position: relative;
      width: 45px;
      height: 45px;
      border-radius: 50%;
      font-size: 20px;
      text-align: center;
      z-index: 100000;
      box-shadow: 0px 0px 5px @PrimaryColor;
    }

    .el-button::before {
      content: '';
      position: absolute;
      top: -1px;
      left: -1px;
      background: rgba(72, 119, 232, 0.2);
      height: 45px;
      width: 45px;
      z-index: -1;
      border-radius: 50%;
      transform: scale(1);
      animation: zoomIn 1s linear infinite alternate;
    }

    .pressButton-box-ou {
      padding: 5px 25px 5px 5px;
      position: fixed;
      right: 68px;
      bottom: 30px;
      overflow: hidden;
      z-index: 19999;
    }

    .pressButton-box {
      box-shadow: @BoxShadow;
      border-radius: 5px;
      overflow: hidden;

      &::after {
        content: '';
        position: absolute;
        right: 20px;
        bottom: 17px;
        box-shadow: 0px 0px 5px #c4d3f8;
        height: 12px;
        width: 12px;
        background: white;
        transform: rotate(45deg);
        z-index: 0;
      }

      .pressButton-list {
        position: relative;
        width: 0;
        height: 0;
        // width: 130px;
        // height: 240px;
        background-color: white;
        transition: all 500ms 100ms;
        z-index: 19998;

        &.pb-show {
          width: 130px;
          height: 240px;
        }

        li {
          box-sizing: border-box;
          // text-align: center;
          width: 100%;
          height: 40px;
          line-height: 40px;
          // padding-right: 10px;
          color: #606266;
          font-size: 16px !important;
          line-height: 18px;
          position: relative;
          transition: all 100ms;

          a {
            transition: all 100ms;
            // text-align: center;
            padding-left: 20px;
            text-decoration: none;
            display: block;
            // width: 100%;
            height: 40px;
            line-height: 40px;
            font-size: 13px;

            .iconfont {
              padding-right: 10px;
              font-size: 18px;
              // color: #e2e2e4;
            }
          }

          &:hover {
            color: #fff;
            background-color: Lighten(@PrimaryColor, 5%);
            transition: all 100ms;

            a {
              transition: all 100ms;
              color: #fff;
            }
          }

          &:active {
            color: #fff;
            background-color: Lighten(@PrimaryColor, 10%);
            transition: all 100ms;

            a {
              transition: all 100ms;
              color: #fff;
            }
          }
        }
      }
    }
  }

  .erwei {
    position: fixed;
    right: 224px;
    bottom: 110px;
    padding: 9px;
    box-sizing: border-box;
    text-align: center;
    line-height: 0;
    box-shadow: 0px 3px 14px 3px rgba(255, 255, 255, 0.6);
    background: #fff;
    z-index: 19990;

    img {
      width: 146px;
    }

    p {
      color: #545b6d;
      font-size: 13px;
    }

    @keyframes zoomIn {
      from {
        transform: scale(1);
      }

      to {
        transform: scale(1.5);
      }
    }
  }
}
</style>
