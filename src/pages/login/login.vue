<template>
  <div class="la-content">
    <!-- 试用申请弹出框 -->
    <el-dialog :visible.sync="dialogProbationShow" :modal-append-to-body="false" width="850px">
      <div slot="title" class="dialog-header">
        <span>试用申请</span>
      </div>
      <DialogProbation :serviceGa="serviceGa"></DialogProbation>
    </el-dialog>

    <!-- 升级消息公告 -->
    <transition name="el-fade-in-linear">
      <marquee-kz v-if="noticeMsg.length > 0 && showPromtNotice" :noticeMsg="noticeMsg" @closeNotice="closeNotice">
      </marquee-kz>
    </transition>

    <section class="login-box">
      <div class="left-content">
        <!-- 会员登录的页面入口-->
        <div v-if="isVipIp === 1" class="login-vip">
          <img src="/static/imgs/login/much_user.png" />
          <span>*贵单位已开通VIP权限，相同IP内可免费共享使用。 </span>
        </div>
        <!-- 普通人进来的页面入口 -->
        <div v-else-if="isVipIp === 0" class="login-putong">
          <img src="/static/imgs/login/little_user.png" />
        </div>
      </div>
      <div class="right-content">
        <div class="right-wrap">
          <div class="right-logo">
            <img src="~@/assets/imgs/login-sign.jpg" alt class="logo-sign" />
          </div>
          <div class="right-word">
            <span v-if="isVipIp === 1">药智数据多用户版</span>
            <span v-else-if="isVipIp === 0">药智数据企业版</span>
            <span v-show="edition" class="one_banben">
              {{ edition }}
              <a class="banben_run" href="/updatelog?ga_source=vip&ga_name=login" target="_black">
                <img src="/static/imgs/login/logoHref.png" alt />
              </a>
            </span>
          </div>
          <div class="right-login">
            <el-tabs :tab-position="tabPosition">
              <el-tab-pane label="密码登录">
                <div class="password-login">
                  <!-- 账号登录 -->
                  <div class="password-wrap">
                    <form @submit.prevent="accountSubmit">
                      <div class="prompt" :class="{
                        'cl-red': acc.prompt.indexOf('成功') == -1,
                        'cl-green': acc.prompt.indexOf('成功') != -1
                      }">
                        <span v-html="acc.prompt"></span>
                      </div>
                      <div class="phone-point"></div>
                      <div class="phone-wrap" :style="{
                        border:
                          iptFocus.acc == true
                            ? '1px solid #4877e8'
                            : '1px solid #babbc1'
                      }">
                        <i class="iconfont">&#xe640;</i>
                        <el-input name="name" ref="foo" @focus="accountFocus" @blur="accountBlur" v-model="acc.account"
                          :readonly="pwdOnlyRead" class="phonenumber" placeholder="手机号/用户名/邮箱"></el-input>
                      </div>
                      <div class="prompt" :class="{
                        'cl-red': acc.promptPwd.indexOf('成功') == -1,
                        'cl-green': acc.promptPwd.indexOf('成功') != -1
                      }">
                        <span v-html="acc.promptPwd"></span>
                      </div>
                      <div class="passnumber-wrap" :style="{
                        border:
                          iptFocus.pwd == true
                            ? '1px solid #4877e8'
                            : '1px solid #babbc1'
                      }">
                        <i class="iconfont">&#xe61d;</i>
                        <el-input name="pwd" @focus="pwdFocus" v-model="acc.pwd" :readonly="pwdOnlyRead" t
                          :type="iptType" class="password" placeholder="密码"></el-input>
                        <i class="iconfont pwd-handler" v-show="iptType == 'password'"
                          @click="disPwd('password')">&#xe668;</i>
                        <i class="iconfont pwd-handler" v-show="iptType == 'text'" @click="disPwd('text')">&#xe908;</i>
                      </div>
                      <div class="forgetpassword memory-pwd clearfix">
                        <el-checkbox v-model="rememberPassword" class="fl" @change="rememberPass">记住密码</el-checkbox>
                        <a href="https://www.yaozh.com/login/forget/" class="fr" target="_blank">忘记密码?</a>
                      </div>
                      <el-button type="primary" native-type="submit" class="loginButton" :disabled="acc.btnEnable">{{
                          acc.btnText || this.t.a
                      }}</el-button>
                      <div class="forgetpassword handler-btn">
                        <a href="https://www.yaozh.com/register?ga_source=vip&ga_position=registered_1"
                          target="_blank">立即注册</a>
                        <a href="javascript:;" type="primary" @click="shenqing()">免费试用</a>
                      </div>
                    </form>
                  </div>
                </div>
              </el-tab-pane>
              <el-tab-pane label="短信验证码登录">
                <div class="password-login">
                  <!-- 短信登录 -->
                  <div class="password-wrap">
                    <div class="prompt" :class="{
                      'cl-red': sms.prompt.indexOf('成功') == -1,
                      'cl-green': sms.prompt.indexOf('成功') != -1
                    }">
                      <span v-html="sms.prompt"></span>
                    </div>
                    <form @submit.prevent="smsSubmit">
                      <div class="phone-wrap" :style="{
                        border:
                          iptFocus.sms == true
                            ? '1px solid #4877e8'
                            : '1px solid #babbc1'
                      }">
                        <i class="iconfont">&#xe687;</i>
                        <el-input name="mobile" @focus="smsFocus" @blur="smsBlur" v-model="sms.phone"
                          class="phonenumber" placeholder="手机号"></el-input>
                      </div>
                      <div class="prompt" :class="{
                        'cl-red': sms.prompt.indexOf('成功') == -1,
                        'cl-green': sms.prompt.indexOf('成功') != -1
                      }">
                        <span v-html="sms.promptCode"></span>
                      </div>
                      <div class="messages">
                        <i class="iconfont">&#xe88e;</i>
                        <el-input name="vcode" @focus="smsCodeFocus" v-model="sms.code" class="message"
                          placeholder="短信验证码"></el-input>
                        <!-- :disabled="sms.codeBtnBan" -->
                        <el-button type="primary" class="checkout" :disabled="sms.codeBtnBan" @click="sendCode">{{
                            sms.codeBtnText || this.t.b
                        }}</el-button>
                      </div>
                      <div class="forgetpassword">
                        <!-- <a href=""><p>忘记密码?</p></a> -->
                      </div>
                      <el-button type="primary" native-type="submit" class="loginButton" :disabled="sms.btnEnable">{{
                          sms.btnText || this.t.a
                      }}</el-button>
                      <div class="forgetpassword handler-btn">
                        <a href="https://www.yaozh.com/register?ga_source=vip&ga_position=registered_1"
                          target="_blank">立即注册</a>
                        <a href="javascript:;" type="primary" @click="shenqing()">免费试用</a>
                      </div>
                    </form>
                  </div>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </div>
      <div class="company-info">
        Copyright © 2009-2022 YAOZH.COM All Rights Reserved
      </div>
    </section>
  </div>
</template>

<script>
import CryptoJS from "crypto-js";
import DialogProbation from "@/components/common/dialog-probation";
import { mapState } from "vuex";
import Moment from "moment";

export default {
  components: {
    DialogProbation
  },
  data() {
    return {
      noticeMsgStr: "",
      noticeMsg: [],
      serviceGa: "vip_pc_applyforatrial_submit1",
      edition: null, //版本号
      dialogProbationShow: false, // 申请试用显示判断
      active: false,
      tabPosition: "top",
      isVipIp: -1, // 如果 IP 是VIP，则显示不同的登录界面
      // **********************************
      // 定义文字
      t: {
        a: "登录",
        b: "发送验证码",
        c:
          '该账号暂未开通药智数据企业版权限，<a href="javascript:void(0);" onclick="window.global.methods.showProbation()">申请试用</a> 或 <a href="https://vip.yaozh.com/service?ga_source=vip&ga_name=login_nopermission" target="_blank">联系客服</a>。',
        p:
          '账号不存在，点击<a href="https://www.yaozh.com/register?ga_source=vip&ga_position=registered_2" target="_blank">注册</a>',
        p3:
          '账号不存在，点击<a href="https://www.yaozh.com/register?ga_source=vip&ga_position=registered_3" target="_blank">注册</a>',
        d: "登录中...",
        e:
          '登录失败,<a href="javascript:void(0)" onclick="location.reload()">请刷新重试</a>',
        f: "正在发送...",
        g: "短信发送失败",
        h: "账户不能为空",
        i: "密码不符合规范",
        q: "请输入密码",
        j: "手机号不能为空",
        k: "手机号格式错误",
        l: "验证码不能为空",
        m: "验证码错误",
        n: "登录成功，正在跳转..."
        // o: '该账号暂未开通药智数据企业版权限，<a href="https://www.yaozh.com/register/" target="_blank">申请试用</a>或<a href="https://www.yaozh.com/register/" target="_blank">联系客服</a>',
      },
      pwdOnlyRead: true,
      acc: {
        account: this.vueGetCookie("uname") || "",
        pwd: this.base64(this.vueGetCookie("password") || ""),
        prompt: "",
        // 记录提示信息是为谁而提示的，比如账户，比如密码，方便在适当的时侯取消提示信息。
        promptFor: "",
        promptPwd: "",
        promptPwdFor: "",
        btnEnable: false,
        btnText: "",
        allowSubmit: {
          localAcc: true,
          localPwd: true,
          remoteAcc: true
        }
      },
      sms: {
        phone: "",
        code: "",
        // 记录提示信息是为谁而提示的，比如账户，比如密码，方便在适当的时侯取消提示信息。
        promptFor: "",
        prompt: "",
        promptCodeFor: "",
        promptCode: "",
        btnEnable: false,
        btnText: "",
        codeBtnBan: false,
        codeBtnText: "",
        codeBtn: false,
        allowSubmit: {
          localPhone: true,
          localCode: true,
          remotePhone: true
        }
      },
      iptType: "password",
      rememberPassword:
        this.vueGetCookie("rememberType") == "true" ? true : false,
      timeStamp: null,
      iptFocus: {
        acc: false,
        pwd: false,
        sms: false
      }
    };
  },
  computed: {
    ...mapState({
      showPromtNotice: state => state.showPromtNotice
    })
  },
  methods: {
    base64(val, flag) {
      let needval = null;
      if (flag) {
        needval = CryptoJS.AES.encrypt(val, "2020!").toString();
      } else {
        let bytes = CryptoJS.AES.decrypt(val, "2020!");
        needval = bytes.toString(CryptoJS.enc.Utf8);
      }
      return needval;
    },
    showProbation() {
      window.ga("send", "event", "button", "click", "viptrial_nopermission");
      window._paq.push([
        "trackEvent",
        "event",
        "button",
        "click",
        "viptrial_nopermission"
      ]);

      this.serviceGa = "vip_pc_applyforatrial_submit4";
      this.dialogProbationShow = true;
    },
    shenqing() {
      window.ga("send", "event", "button", "click", "viptrial_loginbackground");
      window._paq.push([
        "trackEvent",
        "event",
        "button",
        "click",
        "viptrial_loginbackground"
      ]);

      this.serviceGa = "vip_pc_applyforatrial_submit1";
      this.dialogProbationShow = true;
    },
    //http://apidb.yaozh.com/synclogin/toyaozh?accesstoken=xxxxxxxxxxxx
    // loginToWWW(accesstoken){//老板登陆保障
    //   setTimeout(()=>{
    //     Axios.post('/api/synclogin/toyaozh', {
    //       accesstoken: accesstoken
    //     }).then(res => {
    //       return true;
    //     }).catch(err => {
    //       console.error(err);
    //     })
    //   },2000)
    // },
    loginWWW() {
      //老版项目登录后
      let _this = this;
      let timeStamp = Number(
        Date.now()
          .toString()
          .slice(0, 10)
      );
      let randStr = Math.random()
        .toString(36)
        .slice(2); // 生成随机字符串
      Axios.post("/api/synclogin", {
        timeStamp: timeStamp,
        randStr: randStr,
        signature: this.getSignature([timeStamp + "", randStr, "newdb"])
      })
        .then(res => {
          // console.info(JSON.stringify(res));
          // alert(JSON.stringify(res));
          if (!res) {
            this.setAccountPrompt("submit-fail", this.t.e);
            this.acc.btnEnable = false;
            this.acc.btnText = this.t.a;
          } else {
            if (res.data.code == 200) {
              let _data = res.data.data;
              let accessToken = _data.accessToken;
              if (!accessToken) return
              // 此处代码为 配合bbs论坛同步企业版登录，存储后端返回的script src地址，到APP.vue中动态添加到body里面
              _data.items && _data.items.length > 0 && this.vueSetCookie('bbsScript', JSON.stringify(_data.items))
              // this.loginToWWW(accessToken)
              this.vueSetCookie("accesstoken", accessToken);
              this.vueSetCookie("userPicture", _data.picture);
              this.vueSetCookie("userName", _data.username);
              localStorage.setItem("accesstoken", accessToken);
              delete _data.accessToken;
              Store.commit(
                "UserCenter/accountData",
                Object.assign(
                  {},
                  this.$store.state.UserCenter.accountData,
                  _data
                )
              );

              let path = this.vueGetCookie("openPath"); //this.$route.path; //this.vueGetCookie("openPath")
              // console.info(this.$route);
              if (path && path == "/introduce") {
                //从产品介绍页登录 加谷歌代码统计
                window.open("/home?ga_source=vip&ga_name=introduce", "_self");
              } else if (path && path.indexOf("/login") == 0) {
                window.open("/home", "_self");
              } else {
                // let openpath = this.vueGetCookie("openPath");
                window.open(path || "/home", "_self");
              }
              this.vueDelCookie("openPath");
            } else if (res.data.code == 11032) {
              var _data = res.data.data;
              this.acc.account = _data.username;
              this.acc.pwd = "";
              this.setAccountPrompt("submit-fail", _this.t.c);
            } else if (res.data.code == 11041) {
              //不提示错误
              var _data = res.data.data;
              this.acc.account = _data.username;
              this.acc.pwd = "";
              // this.setAccountPrompt('submit-fail',_this.t.c);
            }
          }
        })
        .catch(err => {
          this.setAccountPrompt("submit-fail", this.t.e);
          this.acc.btnEnable = false;
          this.acc.btnText = this.t.a;
          console.error(err);
        });
    },

    // *** 供调用的方法 ***
    // 设置账户登录提示信息
    setAccountPrompt(to, p) {
      this.acc.promptFor = to;
      this.acc.prompt = p;
    },
    setAccountPromptPwd(to, p) {
      this.acc.promptPwdFor = to;
      this.acc.promptPwd = p;
    },
    // 设置短信登录提示信息
    setSmsPrompt(to, p) {
      this.sms.promptFor = to;
      this.sms.prompt = p;
    },
    setSmsPromptCode(to, p) {
      this.sms.promptCodeFor = to;
      this.sms.promptCode = p;
    },
    // 判断账户登录表单验证是否通过
    accPass() {
      return Object.values(this.acc.allowSubmit).find(a => {
        return !a;
      }) === undefined
        ? true
        : false;
    },
    // 判断短信登录表单验证是否通过
    smsPass() {
      return Object.values(this.sms.allowSubmit).find(a => {
        return !a;
      }) === undefined
        ? true
        : false;
    },
    // *** 触发的事件 ***
    // 账户登录-账户输入框聚焦
    accountFocus() {
      if (this.pwdOnlyRead) {
        this.pwdOnlyRead = false;
      }

      if (this.acc.promptFor == "acc") {
        this.setAccountPrompt("acc", "");
      }
      this.acc.allowSubmit.localAcc = true;
      this.acc.allowSubmit.remoteAcc = true;
      this.iptFocus.acc = true;
      this.iptFocus.pwd = false;
    },
    // 账户登录-账户输入框失焦
    accountBlur() {
      if (this.localAcc()) {
        // 如果本地账户验证通过
        this.remoteAccount(this);
      }
      this.iptFocus.acc = false;
    },
    // 账户登录-密码输入框聚焦
    pwdFocus() {
      if (this.pwdOnlyRead) {
        this.pwdOnlyRead = false;
      }
      if (this.acc.promptFor == "pwd") {
        this.setAccountPromptPwd("pwd", "");
      }
      this.acc.allowSubmit.localPwd = true;
      this.iptFocus.acc = false;
      this.iptFocus.pwd = true;
    },
    //请求接口获取版本号
    getBanben() {
      let _this = this;
      Axios.get("/api/usercenter/edition")
        .then(res => {
          let _data = res.data;
          let code = _data.code;
          let valD = _data.data;
          if (code == 200) {
            _this.edition = valD.edition;
          } else {
            _this.edition = null;
          }
        })
        .catch(err => {
          _this.edition = null;
          console.log(err);
        });
    },
    //获取后台时间戳，仅获取短信用
    getTimeStamp() {
      return Axios.get("/api/user/getTime", {
        params: {
          date: Date.parse(new Date())
        }
      }).then(res => {
        let data = res.data;
        console.log(data);
        if (data.code === 200) {
          this.timeStamp = data.data.time;
        }
      });
    },
    // 账户登录-提交
    accountSubmit() {
      let _this = this;
      this.acc.promptPwd = "";
      this.localAcc() &&
        this.localPwd() &&
        (() => {
          // 正在登录...
          this.setAccountPrompt("submit-start", "");
          this.acc.btnEnable = true;
          this.acc.btnText = this.t.d;
          return true;
        })() &&
        this.remoteAccount(this).then(res => {
          if (!res) {
            this.acc.btnEnable = false;
            this.acc.btnText = this.t.a;
            return false;
          }
          if (this.accPass()) {
            let timeStamp = Number(
              Date.now()
                .toString()
                .slice(0, 10)
            );
            let randStr = Math.random()
              .toString(36)
              .slice(2); // 生成随机字符串

            Axios.post("/api/user/login", {
              name: this.acc.account,
              pwd: this.acc.pwd,
              timeStamp: timeStamp,
              randStr: randStr,
              signature: this.getSignature([timeStamp + "", randStr, "newdb"]),
              client: "Android"
            })
              .then(res => {
                if (!res) {
                  this.setAccountPrompt("submit-fail", this.t.e);
                  this.acc.btnEnable = false;
                  this.acc.btnText = this.t.a;
                } else {
                  if (res.data.code == 200 && res.data.code == 200) {
                    let userdata = res.data.data;
                    if (!userdata.accessToken) return
                    // 此处代码为 配合bbs论坛同步企业版登录，存储后端返回的script src地址，到APP.vue中动态添加到body里面
                    userdata.items && userdata.items.length > 0 && this.vueSetCookie('bbsScript', JSON.stringify(userdata.items))

                    // this.loginToWWW(userdata.accessToken)
                    // 登陆成功，写入cookie，页面跳转
                    this.setAccountPrompt("submit-success", this.t.n);
                    // vueSetCookie 公共方法写在了 assets/js/func.js
                    this.vueSetCookie("accesstoken", userdata.accessToken);
                    this.vueSetCookie("userPicture", userdata.picture);
                    this.vueSetCookie("userName", userdata.username);
                    this.vueSetCookie("userComname", userdata.comname);
                    this.vueSetCookie("userGradeName", userdata.grade_name);
                    this.vueSetCookie(
                      "userEndtime",
                      this.vueTimestampToTime(userdata.endtime)
                    );
                    localStorage.setItem("accesstoken", userdata.accessToken);
                    if (this.rememberPassword) {
                      this.vueSetCookie(
                        "password",
                        this.base64(this.acc.pwd, true)
                      );
                      this.vueSetCookie("uname", this.acc.account);
                      this.vueSetCookie("rememberType", true);
                    } else {
                      this.vueDelCookie("password");
                      this.vueDelCookie("uname");
                      this.vueSetCookie("rememberType", false);
                    }
                    delete userdata.accessToken;
                    Store.commit(
                      "UserCenter/accountData",
                      Object.assign(
                        {},
                        this.$store.state.UserCenter.accountData,
                        res.data.data
                      )
                    );

                    //判断是否登录
                    sessionStorage.setItem("isLogin", 1);

                    setTimeout(() => {
                      let openPath = "";
                      if (this.vueGetCookie("openPath") == "/introduce") {
                        //从产品介绍页登录 加谷歌代码统计
                        this.vueDelCookie("openPath");
                        window.open(
                          "/home?ga_source=vip&ga_name=introduce",
                          "_self"
                        );
                      } else if (this.vueGetCookie("openPath") == "/login") {
                        this.vueDelCookie("openPath");
                        window.open("/home", "_self");
                      } else {
                        openPath = this.vueGetCookie("openPath");
                        this.vueDelCookie("openPath");
                        window.open(openPath || "/home", "_self");
                      }
                      // 提示清空
                      this.setAccountPrompt("submit-success", "");
                    }, 1500);
                  } else {
                    this.setAccountPrompt("submit-fail", res.data.msg);
                  }
                  this.acc.btnEnable = false;
                  this.acc.btnText = this.t.a;
                }
              })
              .catch(err => {
                this.setAccountPrompt("submit-fail", this.t.e);
                this.acc.btnEnable = false;
                this.acc.btnText = this.t.a;
                console.error(err);
              });
          }
        });
      this.iptFocus.acc = false;
      this.iptFocus.pwd = false;
    },
    // 短信登录-手机号输入框聚焦
    smsFocus() {
      if (this.sms.promptFor == "phone") {
        this.setSmsPrompt("phone", "");
      }
      this.sms.allowSubmit.localPhone = true;
      this.iptFocus.sms = true;
    },
    // 短信登录-手机号输入框失焦
    smsBlur() {
      if (this.localPhone()) {
        // 如果手机号格式正确
        //this.sms.codeBtnBan = true;
        this.remotePhone(this);
      }
      this.iptFocus.sms = false;
    },
    // 短信登录-验证码输入框聚焦
    smsCodeFocus() {
      this.sms.allowSubmit.localCode = true;
    },
    // 短信登录-发送短信验证码
    async sendCode() {
      let remoteAccount = await this.remotePhone(this);
      if (this.localPhone() && this.sms.codeBtn) {
        // 如果手机号格式正确
        await this.getTimeStamp();
        let timeStamp = this.timeStamp;
        let randStr = Math.random()
          .toString(36)
          .slice(2);
        this.sms.codeBtnBan = true;
        this.sms.codeBtnText = this.t.f;
        // alert(timeStamp)
        console.log(
          timeStamp,
          randStr,
          this.getSignature([timeStamp + "", randStr, "newdb"])
        );
        Axios.post("/api/user/postmobilecode", {
          mobile: this.sms.phone,
          timeStamp: timeStamp,
          randStr: randStr,
          signature: this.getSignature([timeStamp + "", randStr, "newdb"])
        })
          .then(res => {
            if (res.data.code == 200 && res.data.code == 200) {
              let t = 60;
              this.sms.codeBtnText = t + "s重新获取";
              let interval = setInterval(() => {
                t--;
                if (t > 0) {
                  this.sms.codeBtnText = t + "s重新获取";
                } else {
                  clearInterval(interval);
                  this.sms.codeBtnText = this.t.b;
                  this.sms.codeBtnBan = false;
                }
              }, 1000);
            } else {
              this.sms.prompt = res.data.msg;
              this.sms.codeBtnText = this.t.b;
              this.sms.codeBtnBan = false;
            }
          })
          .catch(err => {
            console.error(err);
            this.sms.prompt = this.t.g;
            this.sms.codeBtnText = this.t.b;
            this.sms.codeBtnBan = false;
          });
      }
    },
    // 短信登录-提交
    smsSubmit() {
      if (this.localPhone() && this.localCode()) {
        let timeStamp = Number(
          Date.now()
            .toString()
            .slice(0, 10)
        );
        let randStr = Math.random()
          .toString(36)
          .slice(2);
        this.setSmsPrompt("submit-start", "");
        this.sms.btnEnable = true;
        this.sms.btnText = this.t.d;
        Axios.post("/api/user/mobilelogin", {
          mobile: this.sms.phone,
          vcode: this.sms.code,
          timeStamp: timeStamp,
          randStr: randStr,
          signature: this.getSignature([timeStamp + "", randStr, "newdb"]),
          client: "Android"
        })
          .then(res => {
            if (res.data.code == 200 && res.data.code == 200) {
              // // 登陆成功，写入cookie，页面跳转
              // this.setSmsPrompt('submit-success', this.t.n);
              // // 10年后过期
              // let sec = 10*365*24*60*60;
              // document.cookie = 'accessToken='+res.data.data.accessToken+';path=/;expires='+(new Date(Date.now()+sec*1000).toGMTString())+';max-age='+sec;
              // setTimeout(() => {
              //   window.location = '/';
              // }, 1500)
              // 此处代码为 配合bbs论坛同步企业版登录，存储后端返回的script src地址，到APP.vue中动态添加到body里面
              res.data.data.items && res.data.data.items.length > 0 && this.vueSetCookie('bbsScript', JSON.stringify(res.data.data.items))
              // 登陆成功，写入cookie，页面跳转
              this.setAccountPrompt("submit-success", this.t.n);
              // vueSetCookie 公共方法写在了 assets/js/func.js
              let accessToken = res.data.data.accessToken;
              // this.loginToWWW(accessToken)
              this.vueSetCookie("accesstoken", accessToken);
              this.vueSetCookie("userPicture", res.data.data.picture);
              this.vueSetCookie("userName", res.data.data.username);
              localStorage.setItem("accesstoken", accessToken);
              delete res.data.data.accessToken;
              Store.commit(
                "UserCenter/accountData",
                Object.assign(
                  {},
                  this.$store.state.UserCenter.accountData,
                  res.data.data
                )
              );

              setTimeout(() => {
                let openPath = this.vueGetCookie("openPath") || "/home";
                if (openPath == "/introduce") {
                  this.vueDelCookie("openPath");
                  window.open("/home?ga_source=vip&ga_name=introduce", "_self");
                } else if (openPath == "/login") {
                  this.vueDelCookie("openPath");
                  // this.$router.push({
                  //   path: '/home'
                  // })
                  window.open("/home", "_self");
                } else {
                  this.vueDelCookie("openPath");
                  // this.$router.push({
                  //   path: openPath
                  // })
                  window.open(openPath, "_self");
                }
                // 提示清空
                this.setAccountPrompt("submit-success", "");
              }, 1500);
            } else {
              if (res.data.msg.indexOf("验证码") > -1) {
                this.setSmsPromptCode("submit-fail", res.data.msg);
              } else {
                this.setSmsPrompt("submit-fail", res.data.msg);
              }
            }
            this.sms.btnEnable = false;
            this.sms.btnText = this.t.a;
          })
          .catch(err => {
            this.setSmsPrompt("submit-fail", this.t.e);
            this.sms.btnEnable = false;
            this.sms.btnText = this.t.a;
          });
      }
    },
    // 验证
    localAcc() {
      if (this.acc.account.trim() == "") {
        this.setAccountPrompt("acc", this.t.h);
        this.acc.allowSubmit.localAcc = false;
      } else {
        return true;
      }
    },
    localPwd() {
      if (this.acc.pwd.length == 0) {
        this.setAccountPromptPwd("pwd", this.t.q);
        this.acc.allowSubmit.localPwd = false;
      }
      // 手机端的bug + 后端未对密码进行妥善的校验，导致密码可能出现3位数，暂时不限制密码位数。
      else if (this.acc.pwd.length <= 0) {
        this.setAccountPrompt("pwd", this.t.i);
        this.acc.allowSubmit.localPwd = false;
      } else {
        return true;
      }
    },
    localPhone() {
      if (this.sms.phone.trim() == "") {
        this.setSmsPrompt("phone", this.t.j);
        this.sms.allowSubmit.localPhone = false;
      } else if (!/^\d{11}$/.test(this.sms.phone)) {
        this.setSmsPrompt("phone", this.t.k);
        this.sms.allowSubmit.localPhone = false;
      } else {
        return true;
      }
    },
    localCode() {
      if (this.sms.code.trim() == "") {
        this.setSmsPromptCode("phone", this.t.l);
        this.sms.allowSubmit.localCode = false;
      } else if (!/^\d{6}$/.test(this.sms.code)) {
        this.setSmsPromptCode("phone", this.t.m);
        this.sms.allowSubmit.localCode = false;
      } else {
        return true;
      }
    },
    rememberPass(val) {
      this.rememberPassword = val;
    },
    // 远程校验---用户名/手机号/邮箱
    remoteAccount(that) {
      that.acc.allowSubmit.remoteAcc = false;
      return new Promise((resolve, reject) => {
        Axios.post("/api/user/usercheck", {
          name: that.acc.account
        })
          .then(res => {
            let datas = [];
            if (typeof res.data == "string") {
              datas = JSON.parse(res.data);
            } else {
              datas = res.data;
            }

            if (datas.code == 200) {
              // TODO 将resolve结果放在最后返回
              that.acc.allowSubmit.remoteAcc = true;
              resolve(true);
              /*if (res.data.code != 200) {
              that.acc.allowSubmit.remoteAcc = false;
              that.setAccountPrompt('acc', res.data.msg);
              this.acc.btnEnable = false;
              this.acc.btnText = this.t.a;
            }*/
            } else if (datas.code == 11019) {
              that.acc.allowSubmit.remoteAcc = true;
              resolve(false);
              that.setAccountPrompt("acc", that.t.c);
            } else if (datas.code == 11047) {
              that.acc.allowSubmit.remoteAcc = true;
              resolve(false);
              that.setAccountPrompt("acc", datas.msg);
            } else {
              that.acc.allowSubmit.remoteAcc = true;
              resolve(false);
              that.setAccountPrompt("acc", that.t.p);
            }
          })
          .catch(err => {
            that.acc.allowSubmit.remoteAcc = true;
          });
      });
    },

    // 远程校验---手机号
    remotePhone: _.debounce(
      function (that) {
        that.sms.allowSubmit.remotePhone = false;
        return Axios.post("/api/user/usercheck", {
          name: that.sms.phone
        })
          .then(res => {
            let datas = [];
            if (typeof res.data == "string") {
              datas = JSON.parse(res.data);
            } else {
              datas = res.data;
            }
            if (datas.code == 200) {
              that.sms.allowSubmit.remotePhone = true;
              // 启用 验证码发送按钮
              this.sms.codeBtn = true;
              if (datas.code != 200) {
                that.sms.allowSubmit.remotePhone = false;
                that.setSmsPrompt("phone", datas.msg);
                this.sms.btnEnable = false;
                this.sms.btnText = this.t.a;
              }
            } else if (datas.code === 11026) {
              that.setSmsPrompt("phone", that.t.p3);
              that.sms.allowSubmit.remotePhone = true;
            } else {
              that.setSmsPrompt("phone", datas.msg || that.t.c);
              that.sms.allowSubmit.remotePhone = true;
            }
          })
          .catch(err => {
            that.sms.allowSubmit.remotePhone = true;
          });
      },
      800,
      { leading: true }
    ),
    disPwd(itype) {
      this.iptType = itype == "password" ? "text" : "password";
    },
    closeNotice() {
      this.noticeMsg = [];
      this.noticeMsgStr = "";
      localStorage.isFirstNotice = true;
      this.$store.commit("showPromtNotice", false);
    },
    getNoticeMsg() {
      window.Axios.post("/api/config/notice")
        .then(res => {
          let data = res.data;
          if (data.code == 200) {
            let curTimeStamp = Moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.noticeMsg = [];
            data.data.forEach(item => {
              if (
                (Moment(curTimeStamp).isAfter(
                  Moment(item.time_start * 1000).format("YYYY-MM-DD HH:mm:ss")
                ) &&
                  Moment(curTimeStamp).isBefore(
                    Moment(item.time_end * 1000).format("YYYY-MM-DD HH:mm:ss")
                  )) ||
                Moment(curTimeStamp).isSame(
                  Moment(item.time_start * 1000).format("YYYY-MM-DD HH:mm:ss")
                ) ||
                Moment(curTimeStamp).isSame(
                  Moment(item.time_end * 1000).format("YYYY-MM-DD HH:mm:ss")
                )
              ) {
                this.noticeMsg.push(item);
              }
            });
            this.noticeMsgStr = "";
            this.noticeMsg.forEach(item => {
              this.noticeMsgStr +=
                "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
                item.content;
            });
            setTimeout(() => {
              // 第一次要弹
              if (!localStorage.noticeMsgStr) {
                localStorage.setItem("noticeMsgStr", JSON.stringify(data.data));
                this.$store.commit(
                  "showPromtNotice",
                  this.noticeMsg.length > 0
                );
                localStorage.isFirstNotice = false;
              } else {
                // 没点过关闭按钮的 要显示出来
                if (localStorage.isFirstNotice == "false") {
                  this.$store.commit(
                    "showPromtNotice",
                    this.noticeMsg.length > 0
                  );
                  console.log(2);
                } else {
                  // 点过关闭按钮的 但是有新的内容的 也要弹出来
                  // 如果有新的公告也要弹
                  if (JSON.stringify(data.data) !== localStorage.noticeMsgStr) {
                    localStorage.isFirstNotice = false;
                    localStorage.setItem(
                      "noticeMsgStr",
                      JSON.stringify(data.data)
                    );
                    this.$store.commit(
                      "showPromtNotice",
                      this.noticeMsg.length > 0
                    );
                    console.log(3);
                  }
                }
              }
            }, 100);
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  beforeCreate() { },
  created() {
    Axios.get("/api/user/isiplogin")
      .then(res => {
        if (res.status === 200 && res.data.data) {
          this.isVipIp = res.data.data.is_iplogin;
        } else {
          this.isVipIp = 0;
        }
      })
      .catch(err => {
        this.isVipIp = 0;
      });
    setTimeout(() => {
      const hashLocation = sessionStorage.getItem("hashLocation"); //缓存中获取当前页面的路由名称
      // 注意, 这里使用全路径匹配,在hash模式中,因为地址会携带#,所以页面报告中的url需要重新覆盖一下, 将#去除
      window._paq.push(["setCustomUrl", "https://" + hashLocation]); //覆盖页面报告的url，可以自定义页面url，加上本页面路由
      window._paq.push(["trackPageView", "登录注册"]); //页面名称,可以自定义页面名称
      window._paq.push(["setDocumentTitle", "登录注册"]);
    }, 1000);
  },
  mounted() {
    // this.getSignature([1597135051+'', '1357zfwxk99s', 'newdb']),
    // this.handleNavHover()
    // 类似登录时候的提示信息，是后期插入的html，如果想要触发vue的东西，需要交给全局
    let style = document.createElement("style");
    style.id = "marquee";
    document.getElementsByTagName("head")[0].appendChild(style);
    // 获取公告数据
    this.getNoticeMsg();
    window.global = {
      methods: {
        showProbation: this.showProbation
      }
    };
    this.getBanben(); //获取版本号
    let yaozh_mylogin = this.vueGetCookie("yaozh_mylogin");
    // console.info(yaozh_mylogin)
    // if(yaozh_mylogin){

    //如果其它平台未登录就不调用同步登录接口

    this.loginWWW();

    // }

    this.$nextTick(() => {
      setTimeout(() => {
        this.$refs.foo.$el.querySelector("input").focus();
      }, 500);
    });

    // 此处代码为 配合bbs论坛同步企业版登录，将后端返回的script src地址，动态添加到body里面
    if (this.vueGetCookie('bbsOutScript')) {
      let bbsArr = JSON.parse(this.vueGetCookie('bbsOutScript'))
      for (let i = 0; i < bbsArr.length; i++) {
        let script = document.createElement("script");
        script.type = "text/javascript";
        script.src = bbsArr[i];
        window.document.body.appendChild(script);
      }

      // 只需要跑一次，所以用完后清除存储的cookie
      this.vueDelCookie('bbsOutScript')
    }
  }
};
</script>

<style lang="less">
@import "~@/assets/less/var.less";
@import "~@/assets/less/app.less";

.la-app {
  .la-app-main {
    .la-content {
      margin: 0;
      width: 100vw;
      height: 100vh;
      position: relative;
      background: url(~@/assets/imgs/login_box_bg.png) no-repeat center 0;
      background-size: cover;

      .login-box {
        width: 1164px;
        height: 714px;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-top: -357px;
        margin-left: -582px;
        background: url(~@/assets/imgs/login_bg.png) no-repeat center 0;

        .company-info {
          position: fixed;
          bottom: 31px;
          left: 0;
          width: 100%;
          text-align: center;
          color: #a9adb7;
        }

        .left-content,
        .right-content {
          display: inline-block;
          height: 645px;
          vertical-align: top;
        }

        .left-content {
          width: 583px;

          .login-vip {
            img {
              margin: 150px 0 0 110px;
            }

            span {
              font-size: 12px;
              color: #fff;
              display: block;
              margin: 87px 0 0 57px;
            }
          }

          .login-putong {
            img {
              margin: 160px 0 0 110px;
            }
          }
        }

        .right-content {
          width: 375px;
          margin: 0 0 0 83px;

          .right-wrap {
            margin: 95px 0 0 0;
            text-align: center;

            .right-logo {
              text-align: center;

              img {
                width: 106px;
              }
            }

            .one_banben {
              color: #4877e8;

              .banben_run {
                position: absolute;
                right: 133px;
                top: 188px;

                img {
                  width: 86px;
                }
              }
            }
          }

          .right-word {
            font-size: 25px;
            color: #545b6d;
          }

          .right-login {
            width: 100%;
            min-height: 302px;
            margin-top: 42px;

            .ipt-focus {
              border: 1px solid #4877e8;
            }

            .el-tabs {
              .password-login {
                width: 100%;
                height: 260px;

                input:-webkit-autofill {
                  -webkit-box-shadow: 0 0 0px 1000px #f6f8fc inset;
                }

                .el-input {
                  font-size: 13px;
                }

                .prompt {
                  height: 19px;
                  line-height: 19px;
                  text-align: left;
                  font-size: 13px;

                  a {
                    .cl-blue;
                  }
                }

                .password-wrap {
                  width: 100%;
                  height: 100%;
                  margin-top: 15px;
                  text-align: left;

                  .phone-wrap {
                    width: 99.5%;
                    border: 1px solid #babbc1;
                    border-radius: 25px;

                    .phonenumber {
                      width: 282px;

                      .el-input__inner {
                        height: 42px;
                        border-radius: 0;
                        outline: none;
                        -webkit-appearance: none;
                        border: none;
                        color: #555b6d;
                      }
                    }

                    input::-webkit-input-placeholder {
                      /* WebKit browsers */
                      color: #595f71;
                    }

                    input:-moz-placeholder {
                      /* Mozilla Firefox 4 to 18 */
                      color: #595f71;
                    }

                    input::-moz-placeholder {
                      /* Mozilla Firefox 19+ */
                      color: #595f71;
                    }

                    input:-ms-input-placeholder {
                      /* Internet Explorer 10+ */
                      color: #595f71;
                    }

                    .iconfont {
                      margin-left: 18px;
                      width: 26px;
                      height: 42px;
                      color: #555b6d;
                    }
                  }

                  .passnumber-wrap {
                    width: 99.5%;
                    border: 1px solid #babbc1;
                    border-radius: 25px;
                    position: relative;

                    .password {
                      width: 282px;

                      .el-input__inner {
                        height: 42px;
                        border-radius: 0;
                        outline: none;
                        -webkit-appearance: none;
                        border: none;
                        color: #555b6d;
                      }
                    }

                    input::-webkit-input-placeholder {
                      /* WebKit browsers */
                      color: #595f71;
                    }

                    input:-moz-placeholder {
                      /* Mozilla Firefox 4 to 18 */
                      color: #595f71;
                    }

                    input::-moz-placeholder {
                      /* Mozilla Firefox 19+ */
                      color: #595f71;
                    }

                    input:-ms-input-placeholder {
                      /* Internet Explorer 10+ */
                      color: #595f71;
                    }

                    .iconfont {
                      margin-left: 18px;
                      width: 26px;
                      height: 42px;
                      color: #555b6d;
                    }
                  }

                  .forgetpassword {
                    height: 20px;
                    margin-top: 10px;
                    line-height: 14px;
                    font-size: 13px;
                    color: #555b6d;
                    margin-left: 4px;
                    overflow: hidden;
                  }

                  .handler-btn {
                    a:first-child {
                      float: left;
                      margin-left: 18px;
                    }

                    a:last-child {
                      float: right;
                      color: #4877e8;
                      margin-right: 18px;
                    }
                  }

                  .memory-pwd {
                    box-sizing: border-box;
                    padding: 0 18px;
                  }

                  .loginButton {
                    margin-top: 28px;
                    width: 100%;
                    border-radius: 25px;
                    font-size: 18px;
                    height: 40px;
                    letter-spacing: 8px;
                  }

                  .messages {
                    width: 100%;
                    height: 44px;
                    position: relative;

                    .message {
                      width: 224px;
                      float: left;

                      .el-input__inner {
                        width: 224px;
                        height: 44px;
                        border-radius: 25px;
                        outline: none;
                        -webkit-appearance: none;
                        padding-left: 54px;
                        border: none;
                        border: 1px solid #babbc1;
                        color: #555b6d;
                      }

                      .el-input__inner:hover {
                        border: 1px solid #4877e8;
                      }
                    }

                    input::-webkit-input-placeholder {
                      /* WebKit browsers */
                      color: #595f71;
                    }

                    input:-moz-placeholder {
                      /* Mozilla Firefox 4 to 18 */
                      color: #595f71;
                    }

                    input::-moz-placeholder {
                      /* Mozilla Firefox 19+ */
                      color: #595f71;
                    }

                    input:-ms-input-placeholder {
                      /* Internet Explorer 10+ */
                      color: #595f71;
                    }

                    .checkout {
                      width: 109px;
                      margin-left: 10px;
                      border-radius: 25px;
                      font-size: 14px;
                      height: 40px;
                      float: left;
                      padding: 0;
                      // color: #555B6D;
                    }

                    .is-disabled {
                      span {
                        cursor: not-allowed;
                      }
                    }

                    .iconfont {
                      margin-left: 18px;
                      width: 26px;
                      height: 44px;
                      color: #555b6d;
                      position: absolute;
                      top: 11px;
                      left: 2px;
                      z-index: 1;
                    }
                  }
                }
              }

              .el-tabs__nav {
                width: 100%;
                text-align: center;

                .el-tabs__item {
                  width: 50%;
                  font-size: 16px;
                }

                .el-tabs__active-bar {
                  &.is-top {
                    width: 187.5px !important;
                    margin: 0;
                    left: 0;
                    height: 5px;
                    border-radius: 5px;
                  }
                }
              }

              .el-tabs__header {
                padding: 0 !important;
              }
            }
          }
        }
      }
    }
  }

  .pwd-handler {
    position: absolute;
    top: 9px;
    right: 6px;
    cursor: pointer;
    font-size: 18px;
  }
}
</style>
