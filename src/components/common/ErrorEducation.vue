/*
  错误提示细分
 */
 <template>
  <div class="ErrorEducation">
    <el-dialog
      class="dialog-actions"
      @close="RemoteLoginClose"
      :modal-append-to-body="false"
      :visible="errorEducationShow"
    >
      <div slot="title" class="dialog-header">
        {{ codTips[`login${isErrorMsg}`]["tips"] }}
      </div>
      <div class="clearfix zjl_body">
        <div class="fl body_left">
          <img
            v-show="isErrorMsg == 2"
            src="/static/imgs/trz/trz_tips.png"
            alt
          />
          <img v-show="isErrorMsg !== 2" src="/static/imgs/nodata/db-nodata.png" alt />
        </div>
        <div class="fl body_right">
          <div class="right_info info_text">
            <!-- errorEducation.msg || -->
            {{ codTips[`login${isErrorMsg}`]["msg"] }}
          </div>
          <div class="right_info">
            <el-button @click="Submit" class="zjl_button" type="primary"
              >重新登录</el-button
            >
            <el-button @click="toKefu" class="ml50 zjl_button_g"
              >联系客服</el-button
            >
          </div>
        </div>
        <div v-show="loginErr" class="tc error">
          登录失败，请输入账号密码重新登录
        </div>
      </div>
      <div slot="footer" class="zjl_footer"></div>
    </el-dialog>
  </div>
</template>
 <script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      loginErr: false,
      needCode: [11043, 11044],
      codTips: {
        login1: { tips: "登录提示", msg: "账号登录信息已失效，请重新登录" },
        login2: {
          tips: "异常提示",
          msg: "系统异常，请尝试重新登录或联系客服反馈",
        },
        login3: {
          tips: "登录提示",
          msg: "账号登录信息已失效，请尝试重新登录或联系客服反馈",
        },
      },
    };
  },
  mounted() {},
  computed: {
    ...mapState({
      Code: (state) => state.UserCenter.errorEducation.code,
      errorEducation: (state) => state.UserCenter.errorEducation,
      errorEducationShow: (state) => state.UserCenter.errorEducation.show,
      RemoteLoginInfo: (state) => state.UserCenter.RemoteLoginInfo,
    }),
    isErrorMsg() {
      let code = this.Code;
      if (code === 11042) {
        return 3;
      }
      let _this = this;
      let includes = _this.needCode.includes(code);
      if (includes) {
        return 1;
      }

      return 2;
    },
  },
  props: {
    lineKEfuFunction: Function,
  },
  methods: {
    googleClick(flag) {
      var code = this.Code;
      if (code) {
        if (flag == "login") {
          var obj = {
            11042: "promp_token_not_exist_login_again",
            11043: "promp_token_expired_login_again",
            11044: "promp_signature_verification_failed_login_again",
            11005: "promp_other_login_again",
          };
        } else {
          var obj = {
            11042: "promp_token_not_exist_contact_customer_Servic",
            11043: "promp_token_expired_contact_customer_Servic",
            11044: "promp_signature_verification_failed_contact_customer_servic",
            11005: "promp_other_customer_again",
          };
        }
        if(obj[code]){
          window.ga("send", "event", "button", "click", obj[code]);
          window._paq.push(['trackEvent', 'button', 'click', obj[code], ])

        }
      }
    },
    toKefu() {
      this.lineKEfuFunction();
      this.RemoteLoginClose();
      this.googleClick();
    },
    RemoteLoginClose() {
      this.$store.commit("UserCenter/errorEducation", { show: false });
      // console.info()
      let flag = this.$route.path.includes("/login");
      this.vueBackToLogin(flag); //全局方法，清楚cookie
    },
    errTips(flag) {
      let _this = this;
      if (flag) {
        _this.RemoteLoginClose();
      } else {
        this.loginErr = true;
        setTimeout(() => {
          _this.RemoteLoginClose();
          _this.loginErr = false;
        }, 2000);
      }
    },
    Submit() {
      var userName = GETCOOKIEFUN("userName");
      let _this = this;
      this.googleClick("login");
      if (!userName || this.Code == 11043) {
        this.errTips(true);
        return;
      }

      let timeStamp = Date.now();
      let randStr = Math.random().toString(36).slice(2); // 生成随机字符串+
      let params = {
        name: userName,
        timeStamp: timeStamp,
        randStr: randStr,
        signature: this.getSignature([timeStamp + "", randStr, "newdb"]),
      };
      localStorage.setItem("forceLogin", JSON.stringify(params));
      //  try {
      //     this.frontEndLog("/api/user/forceLogin",{ //强制登录日志
      //       // _data:_data,
      //       params:params
      //     })
      //   } catch (error) {
      //     console.info(error)
      //   }
      // this.vueSetCookie("accesstoken", '');
      this.vueDelCookie("accesstoken");
      Axios.post("/api/user/forceLogin", params)
        .then((res) => {
          let _data = res.data;
          let code = _data.code;

          if (code == 200) {
            if(!res.data.data.accessToken) return
            // alert(res.data.data.accessToken)
            // 此处代码为 配合bbs论坛同步企业版登录，存储后端返回的script src地址，到APP.vue中动态添加到body里面
            res.data.data.items && res.data.data.items.length>0 && this.vueSetCookie('bbsScript', JSON.stringify(res.data.data.items))
            this.vueSetCookie("accesstoken", res.data.data.accessToken);
            this.vueSetCookie("userPicture", res.data.data.picture);
            this.vueSetCookie("userName", res.data.data.username);
            // 清除store中的状态
            this.$store.commit(
              "UserCenter/accountData",
              Object.assign(
                {},
                this.$store.state.UserCenter.accountData,
                res.data.data
              )
            );
            let flag = this.$route.path.includes("/login");
            let openPath = this.vueGetCookie("openPath");

            if (flag) {
              if (openPath == "/login") {
                window.open("/home", "_self");
              } else if (!openPath) {
                window.open("/home", "_self");
              } else {
                window.open(openPath, "_self");
              }
              this.vueDelCookie("openPath");
            } else {
              window.location.reload();
            }
          } else {
            this.errTips(true);
          }
        })
        .catch((err) => {
          console.info(err);
          this.errTips(true);
        });
    },
  },
};
</script>
 <style lang="less" scoped>
@import "~@/assets/less/var.less";
.ErrorEducation {
  .ml50 {
    margin-left: 40px;
  }
  /deep/.v-modal {
    background: rgba(102, 102, 102, 0.4);
  }

  /deep/.el-dialog {
    border-radius: 20px !important;
    width: 579px;
    height: 225px;
    top: 50vh !important;
    box-shadow: -3px 2px 8px 0px rgba(188, 188, 188, 0.33);
  }
  /deep/.el-dialog__header {
    padding: 0px 20px;
    font-size: 15px;
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid @BorderColor;
    .dialog-header {
      height: 50px;
      line-height: 50px;
    }
  }
  /deep/.el-dialog__body {
    padding: 0px;
    .zjl_body {
      margin-top: 20px;
      .body_left {
        margin-left: 46px;
        margin-top: 10px;
      }
      .body_right {
        margin-left: 20px;
        .mt15 {
          margin-top: 15px;
        }
        .right_user {
          font-size: 16px;
          color: #fb5920;
        }
        .right_info {
          // margin: 5px 0px;
          text-align: center;
          .info_a {
            color: #4877e8;
          }
          .info_gray {
            // width: 300px;
            display: inline-block;
            vertical-align: top;
            color: #999999;
          }
        }
        .info_text {
          padding: 25px 0px;
          font-size: 16px;
          font-weight: bold;
          color: #545b6d;
        }
        .zjl_button_g {
          padding: 8px 40px;
          border-radius: 15px;
          font-size: 13px;
        }
        .zjl_button {
          padding: 8px 40px;
          border-radius: 15px;
          font-size: 13px;
          &:hover {
            background: #6d92ed;
            border-color: #6d92ed;
            color: #fff;
          }
        }
      }
    }
  }
  /deep/.el-dialog__footer {
    border-top: none;
    .zjl_footer {
      margin-top: 20px;
      text-align: center;
      .error {
        color: red;
        margin-top: 5px;
      }
    }
  }
}
</style>
