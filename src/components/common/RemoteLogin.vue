/* 账号异地登录提示 */
<template>
  <div class="RemoteLogin">
    <el-dialog
      class="dialog-actions"
      @close="RemoteLoginClose"
      :modal-append-to-body="false"
      :visible="RemoteLogin"
    >
      <div slot="title" class="dialog-header">登录提示</div>
      <div class="clearfix zjl_body">
        <div class="fl body_left">
          <img src="~@/assets/imgs/RemoteLogin/answer.png" alt />
        </div>
        <div class="fl body_right">
          <div class="right_user">
            {{ RemoteLoginInfo.inputname || "未知" }}
          </div>
          <div class="right_info">
            该账号已在另一设备登录，若不是本人操作，请登录后在个人中心（账号管理）处
            <a
              class="info_a"
              target="_black"
              href="https://www.yaozh.com/member/uppwd/"
              >修改密码</a
            >
          </div>
          <div class="right_info right_infoT mt15">
            ip :
            <span
              class="info_gray"
              :title="RemoteLoginInfo.login_ip || '未知'"
              >{{ RemoteLoginInfo.login_ip || "未知" }}</span
            >
          </div>
          <div class="right_info right_infoT">
            浏览器 :
            <span
              class="info_gray"
              :title="RemoteLoginInfo.browser || '未知'"
              >{{ RemoteLoginInfo.browser || "未知" }}</span
            >
          </div>
        </div>
      </div>
      <div slot="footer" class="zjl_footer">
        <div v-if="RemoteLoginR">
          <!-- <div v-if="isLoginPage"> -->
          <el-button @click="Submit" type="primary">继续登录</el-button>
          <el-button @click="RemoteLoginClose" class="ml50">取消登录</el-button>
        </div>
        <div v-else>
          <el-button @click="Submit" type="primary">重新登录</el-button>
          <!-- <el-button @click="RemoteLoginClose" type="primary">重新登录</el-button> -->
        </div>
        <div v-show="handlerRight(loginErr, code)" class="tc error">
          登录失败，请输入账号密码重新登录
        </div>
        <div
          v-show="!handlerRight(loginErr, code) && code !== 200"
          class="tc error"
        >
          {{ msg }}
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapState } from "vuex";
import crypto from "crypto-js";
export default {
  data() {
    return {
      isLoginPage: true,
      loginErr: false,
      code: 200,
      msg: ""
    };
  },
  mounted() {
    //  console.info(123)
    if (this.$route.path.indexOf("/login") == 0) {
      this.$set(this, "isLoginPage", true);
    } else {
      this.$set(this, "isLoginPage", false);
    }
  },
  watch: {
    //监听路由变化
    /*RemoteLogin( to , from ){
        // console.info(to)
        // console.info(from)
       if(to){
        let obj = ['/updatelog','/introduce','/service','/login'];
        let flag = false;
        obj.map((val)=>{
          if(this.$route.path.indexOf(val) == 0){
            flag = true;
          }
        })
        if(flag){
          this.$set(this,'isLoginPage',true);
        }else{
           this.$set(this,'isLoginPage',false);
        }
       }

     }*/
  },
  computed: {
    ...mapState({
      RemoteLoginR: state => state.UserCenter.RemoteLoginR,
      RemoteLogin: state => state.UserCenter.RemoteLogin,
      RemoteLoginInfo: state => state.UserCenter.RemoteLoginInfo
    })
  },
  methods: {
    handlerRight(loginErr, code) {
      return loginErr && code != 11047;
    },
    //关闭异地登录弹框
    /*RemoteLoginCloseCancer(){
       this.$store.commit("UserCenter/RemoteLogin",false);
    },*/
    RemoteLoginClose() {
      this.$store.commit("UserCenter/RemoteLogin", false);
      if (!this.isLoginPage && !this.RemoteLoginR) {
        let flag = this.$route.path.includes("/login");
        this.vueBackToLogin(flag); //全局方法，清楚cookie
        // this.$router.push({
        //   path: "/login",
        // });
      }
    },
    Submit() {
      if (!this.RemoteLoginInfo.inputname) {
        return;
      }

      let timeStamp = Date.now();
      let randStr = Math.random()
        .toString(36)
        .slice(2); // 生成随机字符串+
      let params = {
        name: this.RemoteLoginInfo.inputname,
        // name:'vernonn',
        timeStamp: timeStamp,
        randStr: randStr,
        signature: this.getSignature([timeStamp + "", randStr, "newdb"])
      };
      localStorage.setItem("forceLogin", JSON.stringify(params));
      // try {
      //     this.frontEndLog("/api/user/forceLogin",{ //强制登录日志
      //       // _data:_data,
      //       params:params
      //     })
      //   } catch (error) {
      //     console.info(error)
      //   }
      console.log(params);
      this.vueDelCookie("accesstoken");
      Axios.post("/api/user/forceLogin", params)
        .then(res => {
          let _data = res.data;
          let code = _data.code;
          this.code = code;
          this.msg = _data.msg;
          // try {
          //   this.frontEndLog("/api/user/forceLogin",{ //强制登录日志
          //     _data:_data,
          //     params:params
          //   })
          // } catch (error) {
          //   console.info(error)
          // }

          if (code == 200) {
            if(!res.data.data.accessToken) return
            // alert(res.data.data.accessToken)
            // 此处代码为 配合bbs论坛同步企业版登录，存储后端返回的script src地址，到APP.vue中动态添加到body里面
            res.data.data.items &&
              res.data.data.items.length > 0 &&
              this.vueSetCookie(
                "bbsScript",
                JSON.stringify(res.data.data.items)
              );

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
            let openPath = this.vueGetCookie("openPath");
            if (openPath == "/login") {
              this.vueDelCookie("openPath");
              // this.$router.push({
              //   path: '/home'
              // })
              window.open("/home", "_self");
            } else if (!openPath) {
              window.open("/home", "_self");
            } else {
              this.vueDelCookie("openPath");
              // this.$router.push({
              //   path: openPath
              // })
              window.open(openPath, "_self");
            }
          } else if (code == 11047) {
            this.loginErr = true;
            let _this = this;
            setTimeout(() => {
              _this.RemoteLoginClose();
              _this.loginErr = false;
            }, 2000);
          } else {
            this.loginErr = true;
            let _this = this;
            setTimeout(() => {
              _this.RemoteLoginClose();
              _this.loginErr = false;
            }, 2000);
          }
        })
        .catch(err => {
          this.loginErr = true;
          let _this = this;
          setTimeout(() => {
            _this.RemoteLoginClose();
            _this.loginErr = false;
          }, 2000);
        });
    }
    // 时间戳+随机字符串 生成签名
    /*getSignature (strArr) {
      let str = strArr.sort((a, b) => {
        a = a.charCodeAt(0);
        b = b.charCodeAt(0);
        return a-b;
      }).join('');
      return crypto.MD5(crypto.SHA1(str).toString()).toString().toUpperCase();
    },*/
  }
};
</script>
<style lang="less" scoped>
@import "~@/assets/less/var.less";
.RemoteLogin {
  /deep/.v-modal {
    background: rgba(102, 102, 102, 0.4);
  }

  /deep/.el-dialog {
    border-radius: 20px !important;
    width: 579px;
    height: 279px;
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
          line-height: 20px;
          width: 350px;
          font-size: 13px;
          color: #545b6d;
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
        .right_infoT {
          width: 350px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }
  /deep/.el-dialog__footer {
    border-top: none;
    .zjl_footer {
      margin-top: 20px;
      text-align: center;
      .ml50 {
        margin-left: 50px;
      }
      .error {
        color: red;
        margin-top: 5px;
      }
    }
  }
}
</style>
