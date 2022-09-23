<template>
  <div :class="['la-app', pageClass, { 'la-app-normal': showHeader }]">
    <el-scrollbar style="height: 100%">
      <Header v-if="showHeader"></Header>
      <HeaderGlobalDrugs v-if="$route.path.indexOf('globaldrugs') > -1 && $route.path.indexOf('pdf') == -1"></HeaderGlobalDrugs>
      <HeaderPolicies v-if="$route.path.indexOf('policies') > -1"></HeaderPolicies>
      <!-- <HeaderTrz
        v-if="$route.path.indexOf('/trz-no-permission') > -1 && !showHeader"
      ></HeaderTrz> -->
      <!-- <Menu v-if="showMenu"></Menu> -->
      <div class="la-app-main" :class="{
        'la-app-main-nomenu': !showMenu && showHeader,
        'la-app-main-noheader': showMenu && !showHeader,
        'la-app-main-nomenu-noheader': !showMenu && !showHeader,
      }">
        <!-- <transition name="main"> -->
        <!-- 2022-4-22 15:42分 和罗部长讨论缓存页面最大数为8个 -->
        <keep-alive>
          <router-view ref="mainBody" :max="8" v-if="isRouterAlive" :key="
            getFirstLevelRoute($route.path) + (needReborn() ? Date.now() : '')
          "></router-view>
        </keep-alive>
        <!-- </transition> -->

        <PressButton v-if="showPB"></PressButton>

        <!-- 权限tooltip（自定义） -->
        <div class="cursor-tooltip">
          对不起，您暂无该功能权限，需升级权限享用更多功能。请联系客服
          <span class="cursor-tooltip-phone">400-678-0778</span>
        </div>
        <div class="yyxs-cursor-tooltip">
          医院销售数据放大测试版正在开发中，敬请期待。如有疑问，请联系客服
          <span class="cursor-tooltip-phone">400-678-0778</span>
        </div>
      </div>

      <Footer v-if="showFooter"></Footer>
    </el-scrollbar>
    <!-- IE11 以下的浏览器更新提示 -->
    <div class="needUpgrade" :class="{ dn: !isIEAndLtIE11 }">
      <div class="container vm">
        <div class="content ma pr tc clearfix fs14">
          <div class="rocket"></div>
          <p>
            您的浏览器
            <span class="cl-blue">版本过旧</span> ，导致该网页无法正常显示
            <br />建议安装 Chrome、Firefox 等非IE内核浏览器或者升级IE浏览器
          </p>
          <div>
            <a href="https://www.google.cn/chrome/">
              <el-button type="primary" round>推荐Chrome浏览器</el-button>
            </a>
          </div>
          <a href="https://support.microsoft.com/zh-cn/help/17621" class="updateIE">升级IE</a>
        </div>
      </div>
    </div>
    <!-- 用户导引 -->
    <div class="guide" :style="{ top: showPromtNotice ? '30px' : 0 }" v-if="
      $route.path === '/home' &&
      stepNum > -1 &&
      stepNum < stepLists.length &&
      guideFlagShow
    ">
      <!-- 作为阴影遮罩bg -->
      <div :class="['bg', stepLists[stepNum]]"></div>
      <!-- 内容 -->
      <div class="content-box">
        <div :class="[
          'content',
          'clearfix',
          'pr',
          stepLists[stepNum],
          showPromtNotice ? `showPromtNoticeClass${stepNum}` : '',
        ]">
          <div class="pointer left" @click="guideLeft"></div>
          <div class="pointer right" @click="guideRight"></div>
          <div class="pointer btn-close pa" @click="guideClose" v-if="stepNum > 0 && stepNum < stepLists.length - 1">
          </div>
          <div class="arrow pa"></div>
        </div>
      </div>
      <!-- 指示性触摸按钮 -->
      <div :class="[
        'move-pointer',
        stepLists[stepNum],
        showPromtNotice ? `showPromtNoticeMovePointer${stepNum}` : '',
      ]"></div>
      <!-- 用img标签在要显示导引的情况下提前加载图片 -->
      <div class="hide">
        <img src="/static/imgs/guide/yindao_0.png" />
        <img src="/static/imgs/guide/yindao_1.png" />
        <img src="/static/imgs/guide/yindao_2.png" />
        <img src="/static/imgs/guide/yindao_3.png" />
        <img src="/static/imgs/guide/yindao_4.png" />
        <img src="/static/imgs/guide/yindao_5.png" />
        <img src="/static/imgs/guide/arrow_blue_0.png" />
        <img src="/static/imgs/guide/btn_close.png" />
        <img src="/static/imgs/guide/arrow_white_0.png" />
      </div>
    </div>
    <!-- 异地登录弹框 -->
    <RemoteLogin />
    <!-- 错误提示 -->
    <ErrorEducation :lineKEfuFunction="handleOutClick2" />
    <!-- 试用会员到期提示 -->
    <TrialMemberExpiresModal />

    <!-- 网络异常提示框 -->
    <!-- <el-dialog :visible="!onLine" @close="onLine = true" class="network-error-modal" width="579px"
      :modal-append-to-body="false" :close-on-click-modal="false">
      <div slot="title" class="dialog-header">提示</div>
      <div class="network-error">
        <img
          src="data:image/png;base64,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"
          alt />
        <div class="network-desc">
          <div class="network-desc-title">
            <div class="title1">网络中断！</div>
            <div class="title2">正在连接中......</div>
          </div>
          <div class="network-desc-content">您可以尝试一下连接或重启网络。</div>
          <div class="btn-area">
            <el-button type="primary" @click="onLine = true" class="close-btn" round>关闭提示</el-button>
            <el-button type="primary" @click="$router.go(0)" class="close-btn reload" round>手动刷新</el-button>
          </div>
        </div>
      </div>
    </el-dialog> -->

    <LoadingGif :loadFlag="$store.state.listLoading"></LoadingGif>

    <!-- udesk客服系统按钮 -->
    <div class="fix_box_udesk" :class="{ fix_box_udesk_one: $route.path === '/introduce' }" :style="{
      display:
        $route.path === '/introduce' || $route.path === '/login'
          ? 'block'
          : 'none',
    }" @click="fix_box_udesk">
      <a class="a3" id="btn_udesk_im" @click="handleOutClick2"></a>
    </div>
    <!-- 问卷引导 -->
    <div class="questionnaire" v-if="qDialog && guideRenewsFlags">
      <div class="q-box">
        <span class="q-close" @click="qCloseEvent"></span>
        <a class="q-box-btn" href="https://www.wenjuan.com/s/7fQn2aI/?user=popups&repeat=1" target="_blank"></a>
      </div>
    </div>

    <!-- 用户首次使用综合搜索扩展查询后，搜索引导 -->
    <div v-if="showSearchGuide && showSearchTip" class="search-guide">
      <div :class="['search-guide-bg', `search-guide-step${searchGuideStep}`]"></div>

      <!-- 第一部提示 -->
      <div v-if="searchGuideStep == 0" class="search-guide-content0 fadeInUp">
        <p>
          欢迎使用药智数据企业版，<br />
          在左侧可以继续输入查询条件，进一步筛选检索。
        </p>

        <div class="info-footer">
          <div @click="handleKnow">跳过引导</div>
          <div @click="handleNextStep(1)">下一步</div>
        </div>
      </div>

      <!-- 第二步提示 -->
      <div v-if="searchGuideStep == 1" class="search-guide-content1 fadeInUp">
        <p>若不再需要当前查询条件，可以在此处将其删除。</p>

        <div class="info-footer">
          <div @click="handleNextStep(0)">上一步</div>
          <div @click="handleKnow">知道了</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Header from "@/components/layouts/header";
import HeaderGlobalDrugs from "@/components/layouts/globaldrugs/header-globaldrugs";
import HeaderPolicies from "@/components/layouts/policies/header-policies";
import HeaderTrz from "@/components/layouts/trz/header";
import Menu from "@/components/layouts/menu";
import PressButton from "@/components/layouts/press-button";
import Footer from "@/components/layouts/footer";
import noLoginPages from "./config/noLoginPages";
import RemoteLogin from "@/components/common/RemoteLogin";
import ErrorEducation from "@/components/common/ErrorEducation";
import TrialMemberExpiresModal from "@/components/common/TrialMemberExpiresModal";
import sha1 from "sha1";
import UUID from "uuid-js";
import LoadingGif from "@/components/common/globalCom/loading-gif";
function isvueGetCookie(that) {
  let _this = that;

  // _this.vueSetCookie("openPath", _this.$route.path) // 为下列第2点做铺垫
  // console.info(123)
  // 1.将所有页面添加登录状态才能进入（以后的产品介绍页、关于我们等页面不需要登录）
  // 2.当未登录状态下访问某页面，直接返回到登录页，登录成功后返回之前的页面（第2点在login.vue组件中实现）
  // 3.当登录状态下访问登录页面，直接跳转到首页
  // console.log(_this.vueGetCookie("accesstoken"))
  noLoginPages(_this, function (flag, change, _Data) {
    if (flag) {
      if ("introduce" == change && _Data) {
        let arr = [62, 63, 64, 65, 84, 85, 86, 68];
        let flag = arr.includes(_Data.grade_id);
        // console.info(_Data.grade_id,flag)
        if (!flag) {
          window.open("/home", "_self");
        }
        //_Data.grade_id
      }
    } else {
      if (!_this.vueGetCookie("accesstoken") && _this.$route.path != "/login") {
        // 将谷歌统计参数带到登录页面，目的为了让运营统计是从哪些地方到的登录页面
        // window.open('/login', '_self')
        // if(location.search.indexOf('ga_source')>-1) {
        //   _this.$router.push({
        //     path: `/login?${location.search}`,
        //   });
        // } else {
        //   _this.$router.push({
        //     path: "/login",
        //   });
        // }
        _this.$router.push("/login");

      } else if (
        _this.vueGetCookie("accesstoken") &&
        _this.$route.path == "/login"
      ) {
        window.open("/home", "_self");
      }
    }
  });
}

export default {
  components: {
    Header,
    HeaderGlobalDrugs,
    HeaderPolicies,
    HeaderTrz,
    Menu,
    PressButton,
    Footer,
    RemoteLogin,
    ErrorEducation,
    LoadingGif,
    TrialMemberExpiresModal,
  },
  provide() {
    //父组件中通过provide来提供变量，在子组件中通过inject来注入变量。
    return {
      reload: this.reload,
    };
  },
  data() {
    return {
      isRouterAlive: true, // 控制视图是否显示的变量
      guideRenewsFlags: false,
      qDialog: false,
      guideFlagShow: false, // 控制视频关闭显示引导
      routePath: this.$route.path.split("/")[1],
      // 用户导引步骤对应的 class
      stepLists: [
        "step0",
        "step1",
        "step2",
        "step3",
        "step4",
        "step5",
        "step6",
        "step7",
      ],
      stepNum: 0,
      showNetworkError: true,
      onLine: navigator.onLine, // 网络状态，在线-true，离线-false
      searchGuideStep: 0, // 搜索引导步骤数
    };
  },
  computed: {
    ...mapState({
      guideFlagsRenew: (state) => state.UserCenter.guideFlagsRenew,
      questionDialog: (state) => state.UserCenter.questionDialog,
      needGuideShow: (state) => state.UserCenter.needGuideShow,
      username: (state) => state.UserCenter.accountData.username,
      grade_name: (state) => state.UserCenter.accountData.grade_name,
      accountData: (state) => state.UserCenter.accountData,
      is_show_novice: (state) => state.UserCenter.accountData.is_show_novice,
      showPromtNotice: (state) => state.showPromtNotice,
      isFangDa: (state) => state.UserCenter.isFangDa,
      showSearchGuide: (state) => state.Search.isShowSearchGuide,
    }),
    pageClass() {
      var paths = this.$route.path.split("/").filter((item) => !!item);
      var pcs = [];
      for (var i = 1, j = paths.length + 1; i < j; i++) {
        pcs.push(["pc"].concat(paths.slice(0, i)).join("-"));
      }
      return pcs.join(" ");
    },
    showMenu() {
      if (
        this.$route.path.indexOf("/usercenter") === 0 ||
        this.$route.path.indexOf("/login") === 0 ||
        this.$route.path.indexOf("/help") === 0 ||
        this.$route.path.indexOf("/updatelog") === 0 ||
        this.$route.path.indexOf("/introduce") === 0 ||
        this.$route.path.indexOf("/service") === 0 ||
        this.$route.path.indexOf("/trz") === 0 ||
        this.$route.path.indexOf("/qs") === 0 ||
        this.$route.path.indexOf("/indicator") === 0
      ) {
        return false;
      } else {
        return true;
      }
    },
    showHeader() {
      if (
        this.$route.path.indexOf("/login") === 0 ||
        this.$route.path.indexOf("/help") === 0 ||
        this.$route.path.indexOf("/updatelog") === 0 ||
        this.$route.path.indexOf("/introduce") === 0 ||
        this.$route.path.indexOf("/service") === 0 ||
        this.$route.path.indexOf("/trz") === 0 ||
        this.$route.path.indexOf("/qs") === 0 ||
        this.$route.path.indexOf("/indicator") === 0 ||
        this.$route.path.indexOf("/globaldrugs") === 0 ||
        this.$route.path.indexOf("/policies") === 0
      ) {
        return false;
      } else {
        return true;
      }
    },
    showPB() {
      if (
        /*this.$route.path.indexOf("/home") === 0 || */ this.$route.path.indexOf(
        "/login"
      ) === 0 ||
        this.$route.path.indexOf("/help") === 0 ||
        this.$route.path.indexOf("/updatelog") === 0 ||
        this.$route.path.indexOf("/introduce") === 0 ||
        this.$route.path.indexOf("/service") === 0 ||
        this.$route.path.indexOf("/trz") === 0 ||
        this.$route.path.indexOf("/qs") === 0 ||
        this.$route.path.indexOf("/indicator") === 0
      ) {
        return false;
      } else {
        return true;
      }
    },
    showFooter() {
      if (this.$route.path.indexOf("/home") === 0) {
        return true;
      } else {
        return false;
      }
    },

    showSearchTip() {
      if (
        this.$route.path.indexOf("/home") === 0 ||
        this.$route.path.indexOf("/login") === 0 ||
        this.$route.path.indexOf("/help") === 0 ||
        this.$route.path.indexOf("/updatelog") === 0 ||
        this.$route.path.indexOf("/introduce") === 0 ||
        this.$route.path.indexOf("/service") === 0 ||
        this.$route.path.indexOf("/trz") === 0 ||
        this.$route.path.indexOf("/qs") === 0 ||
        this.$route.path.indexOf("/indicator") === 0
      ) {
        return false;
      } else {
        return true;
      }
    },
    // IE是否小于11
    isIEAndLtIE11() {
      let ua = navigator.userAgent;
      if (/trident/i.test(ua)) {
        if (/msie/i.test(ua)) {
          return true;
        } else {
          return false;
        }
      }
      return false;
    },
  },
  watch: {
    onLine(newVal, oldVal) {
      if (newVal == false) {
        setTimeout(
          () => {
            this.onLine = newVal;
          },
          newVal ? 0 : 5000
        );
      }
    },
    // 监听路由
    $route(to, from) {
      let toPath = to.path;
      let fromPath = from.path;
      this.vueSetCookie("openPath", from.fullPath); // 为下列第2点做铺垫
      if (toPath != fromPath) {
        isvueGetCookie(this);
      }

      this.$refs.mainBody.dialogFormVisible = false; //切换路由高级搜索框关闭

      let locationHash = window.location.pathname;
      sessionStorage.setItem("hashLocation", locationHash);
      this.loginToWWW(this.vueGetCookie("accesstoken"));
      // 1.将所有页面添加登录状态才能进入（以后的产品介绍页、关于我们等页面不需要登录）
      // 2.当未登录状态下访问某页面，直接返回到登录页，登录成功后返回之前的页面（第2点在login.vue组件中实现）
      // 3.当登录状态下访问登录页面，直接跳转到首页
      // if (!this.vueGetCookie("accesstoken") && toPath != "/login") {
      //   this.$router.push({
      //     path: "/login",
      //   })
      // } else if (this.vueGetCookie("accesstoken") && toPath == "/login") {
      //   this.$router.push({
      //     path: "/home",
      //   })
      // }
      localStorage.setItem(
        //newProjectGuide 组件需要的东西
        "newProjectGuideArr",
        JSON.stringify([])
      );
    },
    stepNum(newVal, oldVal) {
      if (this.stepNum > -1 && this.stepNum < this.stepLists.length) {
        $(".la-header-nav .header-nav-item").each((i, dom) => {
          var _this = $(dom);
          _this.removeClass("hover");
        });
        // 根据不同步骤导引，执行不同js
        switch (this.stepNum) {
          case 2:
            setTimeout(() => {
              this.guideRight();
            }, 1300);
            break;
          case 3:
            // $('.la-menu .menu-item').eq(0).addClass('hover');
            //栏目显示
            var arr = [];
            $(".la-header-nav .header-nav-item").each((i, dom) => {
              var _this = $(dom);
              if (_this.css("display") != "none") {
                arr.push(_this);
              }
            });
            arr[0].addClass("hover");
            // console.info()
            // 500ms 后显示图片
            setTimeout(() => {
              $(".guide .content").css("display", "block");
            }, 500);
            break;
          case 4:
            setTimeout(() => {
              this.guideRight();
            }, 1300);
            break;
          case 5:
            var arr = [];
            $(".la-header-nav .header-nav-item").each((i, dom) => {
              var _this = $(dom);
              if (_this.css("display") != "none") {
                arr.push(_this);
              }
            });
            arr[arr.length - 1].addClass("hover");
            // 500ms 后显示图片
            setTimeout(() => {
              $(".guide .content").css("display", "block");
            }, 500);
            break;
          case 6:
            // 显示消息通知
            this.$store.commit("Layouts/msgBellShow", true);
            // 计算亮度显示区域，jq控制
            this.$nextTick(() => {
              // let lightWidth = ($('.la-header-side').outerWidth() - 7)*2;
              let lightWidth = 340;
              let content = $(".guide .content");
              $(".guide .bg").css({
                width: lightWidth + "px",
                height: $(".msg-notice-popover").height() + 35 + 12 + 17 + "px",
                "margin-left": "calc(100vw - " + lightWidth + "px)",
              });
              content.css({
                "margin-left":
                  "calc(100vw - " +
                  lightWidth +
                  "px - " +
                  content.width() +
                  "px - " +
                  40 +
                  "px)",
              });
            });
            // 500ms 后显示图片
            setTimeout(() => {
              $(".guide .content").css("display", "block");
            }, 500);
            break;
          case 7:
            setTimeout(() => {
              let wn = $(".la-header-dropdown").outerWidth() + 20;
              if (wn < 130) wn = 130;
              $(".guide>.bg.step7").css({
                width: parseInt(wn) + "px",
                "margin-left": "calc(100vw - " + parseInt(wn) + "px" + ")",
              });
              $(".guide .content").css({
                "margin-left":
                  "calc(100vw - " + parseInt(568 + wn) + "px" + ")",
                display: "block",
              });
            }, 500);
            break;
        }
      } else {
        $(".la-header-nav .header-nav-item").each((i, dom) => {
          var _this = $(dom);
          _this.removeClass("hover");
        });
        this.guideSetCookie();
      }
      // 消除非当前步骤的js影响
      if (this.stepNum != 3) {
        $(".la-header-nav .header-nav-item").eq(0).removeClass("hover");
      }
      // 消除非当前步骤的js影响
      if (this.stepNum != 5) {
        $(".la-header-nav .header-nav-item").eq(7).removeClass("hover");
      }
      if (this.stepNum != 6) {
        this.$store.commit("Layouts/msgBellShow", false);
        $(".guide .bg").css({
          width: "",
          height: "",
          "margin-left": "",
        });
        $(".guide .content").css({
          "margin-left": "",
        });
      }
      // 去除js的影响，回归css
      $(".guide .content").css("display", "");
    },
    questionDialog: {
      handler(val) {
        if (val) {
          this.qDialog = true;
        }
      },
      immediate: true,
    },
    guideFlagsRenew: {
      handler(val) {
        if (val) {
          this.guideRenewsFlags = true;
        }
      },
      immediate: true,
    },
    is_show_novice: {
      handler(val) {
        if (val == 1) {
          this.guideFlagShow = true;
          this.stepNum = 0;
        } else {
          Store.dispatch("UserCenter/guideFlagsRenewA", true);
        }
      },
      // immediate: true
    },
    needGuideShow: {
      handler(val) {
        if (val) {
          this.guideFlagShow = true;
          this.stepNum = 0;
        }
      },
      // immediate: true
    },
    showPromtNotice: {
      handler(val) {
        document.querySelector(".la-app-main").style.marginTop = val
          ? "30px"
          : "0px";
      },
    },
    searchGuideStep: {
      handler(val) {
        if (val == 1) {
          this.$nextTick(() => {
            const h2 = $(".la-body-tab").outerHeight();
            let height = "88px",
              top = "160px";
            if (this.showPromtNotice) {
              if (h2) {
                height = "154px";
                top = "210px";
              } else {
                height = "118px";
                top = "190px";
              }
            } else {
              if (h2) {
                height = "124px";
                top = "180px";
              } else {
                height = "88px";
                top = "160px";
              }
            }

            $(".search-guide-step1").css({
              marginTop: height,
            });

            $(".search-guide-content1").css({
              top: top,
            });
          });
        }
      },
    },
  },
  methods: {
    reload() {
      this.isRouterAlive = false; // 先关闭
      this.$nextTick(function () {
        this.isRouterAlive = true; // 再打开
      });
    },
    // 网络状态变化监听
    networkStatusHandler(e) {
      const netWorkDownlink = navigator.connection.downlink, // 预估下载速度m/s
        that = this;
      if (navigator.connection && navigator.connection.onchange === null) {
        navigator.connection.onchange = () => {
          if (
            netWorkDownlink !== navigator.connection.downlink ||
            navigator.connection.rtt === 0
          ) {
            // 网络断开，5秒后才展示
            setTimeout(() => {
              that.showNetworkError = false;
            }, 5000);
          } else if (
            netWorkDownlink === navigator.connection.downlink ||
            navigator.connection.rtt !== 0
          ) {
            // 连接到网络
            that.showNetworkError = true;
            location.reload();
          }
        };
      }
    },
    editnovice(skipover, step) {
      window.Axios.get("/api/usercenter/editnovice", {
        params: {
          skipover,
          step,
        },
      });
    },
    qCloseEvent() {
      this.qDialog = false;
      Store.dispatch("UserCenter/questionCloseA", true);
    },
    setLogs(url, name) {
      var val = localStorage.getItem(name);
      if (!val) return;

      try {
        this.frontEndLog(url, {
          //强制登录日志
          // _data:_data,
          params: JSON.parse(val),
        });
      } catch (error) {
        console.info(error);
      }
      localStorage.removeItem(name);
    },
    getUrlTime(callback) { },
    changeCookieTime(name, value) {
      //用来改变企业版cookie时间
      let _this = this;
      return new Promise((resolve, reject) => {
        window
          .Axios({
            method: "get",
            url: "/api/user/getTime",
          })
          .then((res) => {
            // console.info(res);
            let data = res.data;
            if (data.code == 200) {
              let time = data.data.time;
              resolve(time);
              // callback(time);
            } else {
              reject();
            }
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    toyaozhpage(accesstoken) {
      return new Promise((resolve, reject) => {
        if (!accesstoken) {
          reject(false);
        }
        Axios.post("/api/synclogin/toyaozhpage", {
          accesstoken: accesstoken,
        })
          .then((res) => {
            if (!res || (res && res.data.code !== 11045)) {
              resolve();
            }
          })
          .catch((err) => {
            console.error(err);
          });
      });
    },
    loginToWWW(accesstoken) {
      //用来改变www cookie时间
      this.toyaozhpage(accesstoken)
        // .then(()=>{ //目前不需要获取后端时间，故影藏
        //   this.changeCookieTime('accesstoken', accesstoken);
        // })
        .then(() => {
          this.vueSetCookie("accesstoken", accesstoken);
          this.vueSetCookie("rememberType", true);
        })
        .catch((err) => {
          console.info(err);
        });
    },
    handleOutClick2() {
      // console.info(123)
      let _this = this;
      let isLogin = Number(sessionStorage.getItem("isLogin"));
      let random = UUID.create().toString();
      let times = new Date().getTime();
      let web_token = isLogin
        ? _this.accountData.email || _this.accountData.uid
        : "";
      let sign_str = `nonce=${random}&timestamp=${times}&web_token=${web_token}`;
      console.info(sign_str + "&2314e6df23cb93264629bbfa10e67c77");
      let sha1Result = sha1(
        sign_str + "&2314e6df23cb93264629bbfa10e67c77"
      ).toUpperCase();

      // (function(a,h,c,b,f,g){a["UdeskApiObject"]=f;a[f]=a[f]||function(){(a[f].d=a[f].d||[]).push(arguments)};g=h.createElement(c);g.async=1;g.charset="utf-8";g.src=b;c=h.getElementsByTagName(c)[0];c.parentNode.insertBefore(g,c)})(window,document,"script","https://assets-cli.udesk.cn/im_client/js/udeskApi.js","ud");
      // ud({
      //     "code": "4a67504g",
      //     "link": "https://1537030.udesk.cn/im_client/?web_plugin_id=103301&agent_id=208981&group_id=300631",
      //     "targetSelector": "#btn_udesk_im",
      //      "customer": {
      //         "c_desc":encodeURI(_this.grade_name || '暂无描述'),
      //         "c_name":encodeURI(_this.username || '该用户未登录'),
      //         "nonce": random,
      //         "signature": sha1Result,
      //         "timestamp": times,
      //         "web_token": web_token
      //     }
      // });
      window.open(
        `https://1537030.udesk.cn/im_client/?web_plugin_id=103301&agent_id=208981&group_id=300631&c_name=${isLogin ? encodeURI(_this.username) : "用户未登录"
        }&c_desc=${isLogin ? encodeURI(_this.grade_name) : "暂无描述"
        }&${sign_str}&signature=${sha1Result}`,
        "_blank"
      );
    },
    fix_box_udesk() {
      if (/login/.test(location.href)) {
        window.ga(
          "send",
          "event",
          "button",
          "click",
          "vip_login_corner_fankui"
        );
        window._paq.push([
          "trackEvent",
          "button",
          "click",
          "vip_login_corner_fankui",
        ]);
      }
      if (/introduce/.test(location.href)) {
        window.ga("send", "event", "button", "click", "vip_pc_introduce_kefu");
        window._paq.push([
          "trackEvent",
          "button",
          "click",
          "vip_pc_introduce_kefu",
        ]);
      }
    },
    needReborn() {
      let str = String(this.$route.matched[1].path);
      if (str.indexOf("/:dbname") == 0) {
        return true;
      } else {
        return false;
      }
    },
    // 用户导引
    guideLeft() {
      if ([3, 4, 5].indexOf(this.stepNum) != -1) {
        this.stepNum -= 2;
        return;
      }
      this.stepNum--;
      if (this.stepNum < 0) {
        this.editnovice(1, 0);
      }
    },
    guideRight() {
      this.stepNum++;
    },
    guideClose() {
      let num = this.stepNum;
      this.editnovice(1, num > 1 ? num - 1 : num);
      this.stepNum = -1;
    },
    guideSetCookie() {
      if (this.stepNum === 8) {
        this.editnovice(0, 5);
      }
      Store.dispatch("UserCenter/needGuideShowA", false);
      Store.dispatch("UserCenter/guideFlagsRenewA", true);
    },
    getFirstLevelRoute(route) {
      let path = route.split("/");
      if (path.length === 3 && (path[2] === "list" || path[2] === "analy"))
        return route.split("/")[1];
      return route;
    },
    updateOnlineStatus: _.throttle(function () {
      setTimeout(
        () => {
          this.onLine = navigator.onLine;
        },
        navigator.onLine ? 0 : 5000
      );
    }, 5000),

    // 搜索引导跳过引导
    handleKnow() {
      localStorage.setItem("showSearchGuide", "showSearchGuide");
      this.$store.commit("Search/showSearchGuide", false);
    },

    // 搜索引导步骤切换
    handleNextStep(val) {
      this.searchGuideStep = val;
    },
  },
  // updated(){

  // },
  beforeCreate() {
    isvueGetCookie(this);
  },
  beforeDestory() {
    window.removeEventListener("offline", this.updateOnlineStatus);
  },
  created() {
    if (this.is_show_novice) {
      this.guideFlagShow = true;
      this.stepNum = 0;
    }
    window.asd = this;
  },
  mounted() {
    console.log(navigator);
    // this.networkStatusHandler();// 网络状态变化监听
    window.addEventListener("online", this.updateOnlineStatus);
    window.addEventListener("offline", this.updateOnlineStatus);
    // 如果已经登录  直接 访问 login 会出现短暂的 login的闪现，然后跳转到 首页，所以事先隐藏body，延迟显示
    setTimeout(() => {
      $("body").show();

      // 此处代码为 配合bbs论坛同步企业版登录，将后端返回的script src地址，动态添加到body里面
      if (this.vueGetCookie("bbsScript")) {
        let bbsArr = JSON.parse(this.vueGetCookie("bbsScript"));
        for (let i = 0; i < bbsArr.length; i++) {
          let script = document.createElement("script");
          script.type = "text/javascript";
          script.src = bbsArr[i];
          window.document.body.appendChild(script);
        }

        // 只需要跑一次，所以用完后清除存储的cookie
        this.vueDelCookie("bbsScript");
      }
      // console.log(JSON.parse(this.vueGetCookie('bbsScript')));
    }, 200);
    this.loginToWWW(this.vueGetCookie("accesstoken"));
    //this.handleOutClick2 ();
    // setTimeout(() => {
    //   console.log($('.la-right').height())
    //   $('.la-right').css({
    //     'height': $(window).height()-238,
    //     'overflow': 'hidden'
    //   })
    // }, 4000)
    this.setLogs("/api/user/forceLogin", "forceLogin");
    /**
     *  在Dom节点渲染成后，进行字体文件加载（较大），不阻塞渲染进程。
     */
    this.$nextTick().then(() => {
      if (!(/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent))) {
        var d = document, g = d.createElement('script');
        g.type = 'text/javascript'; g.async = true; g.defer = true;
        g.src = 'https://zy.yaozh.com/source-han-sans-normal.js';
        d.body.appendChild(g);
        g.onload = () => {
          console.log('font-loaded');
          this.$store.commit('Layouts/fontLoaded');
          this.$root.$emit('font-loaded');
        }
      }
    })
  },
};
</script>

<style lang="less">
// IE11 以下浏览器升级、更换提示
.needUpgrade {
  position: fixed;
  left: 0;
  top: 0;
  background: rgba(102, 102, 102, 0.4);
  display: table;
  width: 100%;
  height: 100%;
  z-index: 1000;
  .container {
    display: table-cell;
  }

  .content {
    width: 520px;
    height: 366px;
    background: #fff;
    border-radius: 22px;
    box-shadow: 1px 1px 4px 1px rgba(212, 212, 212, 0.61);

    .rocket {
      width: 100%;
      height: 189px;
      margin-top: -69px;
      background: url(/static/imgs/rocket.png) center center no-repeat;
    }

    p {
      padding: 0 60px;
      margin: 53px 0 48px 0;
    }

    .updateIE {
      margin-top: 15px;
      display: inline-block;
      text-decoration: underline;
    }
  }
}

// 用户首次打开首页的用户导引，cookie 判断
.guide {
  @bg-step4-width: 343px;
  @content-step4-width: 568px;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9000;

  .bg {
    width: 1px;
    height: 1px;
    box-shadow: 0 0 0 10000px rgba(102, 102, 102, 0.5);

    &.step1 {
      width: 785px;
      height: 220px;
      margin-left: calc((100vw - 785px) / 2);
      margin-top: 194px;
      border-radius: 10px;
    }

    &.step2 {
      width: 68px;
      height: 48px;
      margin-left: 222px;
    }

    &.step3 {
      width: 231px;
      height: 518px;
      margin-left: 223px;
      border-radius: 10px;
    }

    &.step5 {
      width: 230px;
      height: 156px;
      margin-left: 798px;
      border-radius: 10px;
    }

    &.step6 {
      border-radius: 10px;
    }

    &.step7 {
      background: url(/static/imgs/guide/tishi.png) right bottom no-repeat;
      width: 130px;
      min-width: 130px;
      height: 400px;
      margin-left: calc(100vw - 130px);
      border-radius: 10px;
    }
  }

  .content-box {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
  }

  .content {
    background-repeat: no-repeat;
  }

  .move-pointer {
    width: 18px;
    height: 18px;
    border-radius: 18px;
    background: #4b79ec;
    position: fixed;
    top: -1000px;
    left: -1000px;
    transition: all 200ms;

    &:before {
      content: "";
      position: absolute;
      top: -6px;
      left: -6px;
      width: 30px;
      height: 30px;
      border-radius: 20px;
      opacity: 0.4;
      background: #4b79ec;
    }

    &.step2 {
      top: 372px;
      left: 455px;
      margin-left: -193px;
      margin-top: -356px;
      transition: margin 0.7s ease-out 0.5s;
    }

    &.showPromtNoticeMovePointer2 {
      margin-top: -326px;
    }

    &.step4 {
      top: 372px;
      left: 1015px;
      margin-left: -193px;
      margin-top: -356px;
      transition: margin 0.7s ease-out 0.5s;
    }

    &.showPromtNoticeMovePointer4 {
      margin-top: -326px;
    }
  }

  .content {
    &.step0 {
      background-image: url(/static/imgs/guide/yindao_0.png);
      background-repeat: no-repeat;
      width: 671px;
      height: 157px;
      // margin-left: calc((100vw - 300px - 671px) / 2 + 300px);
      margin-left: calc((100vw - 671px) / 2);
      margin-top: 400px;

      .left {
        top: 109px;
        left: 142px;
      }

      .right {
        top: 109px;
        left: 303px;
      }
    }

    &.showPromtNoticeClass0 {
      margin-top: 430px;
    }

    &.step1 {
      background-image: url(/static/imgs/guide/yindao_1.png);
      width: 683px;
      height: 154px;
      // margin-left: calc((100vw - 300px - 683px) / 2 + 300px);
      margin-left: calc((100vw - 636px) / 2);
      margin-top: 494px;

      .left {
        top: 107px;
        left: 184px;
      }

      .right {
        top: 107px;
        left: 345px;
      }

      .arrow {
        background-image: url(/static/imgs/guide/arrow_blue_0.png);
        width: 160px;
        height: 191px;
        left: 212px;
        top: -205px;
      }
    }

    &.showPromtNoticeClass1 {
      margin-top: 524px;
    }

    &.step3 {
      background-image: url(/static/imgs/guide/yindao_2.png);
      width: 548px;
      height: 161px;
      margin-left: 470px;
      margin-top: 288px;
      display: none;

      .left {
        top: 108px;
        left: 185px;
      }

      .right {
        top: 108px;
        left: 346px;
      }

      .arrow {
        width: 194px;
        height: 158px;
        left: -90px;
        top: -196px;
      }
    }

    &.showPromtNoticeClass3 {
      margin-top: 318px;
    }

    &.step5 {
      background-image: url(/static/imgs/guide/yindao_3.png);
      width: 676px;
      height: 156px;
      margin-left: 615px;
      margin-top: 274px;
      display: none;

      .left {
        top: 107px;
        left: 193px;
      }

      .right {
        top: 107px;
        left: 354px;
      }

      .arrow {
        width: 194px;
        height: 158px;
        left: 268px;
        top: -182px;
        // transform: rotate(-9deg);
      }
    }

    &.showPromtNoticeClass5 {
      margin-top: 304px;
    }

    &.step6 {
      background-image: url(/static/imgs/guide/yindao_4.png);
      width: @content-step4-width;
      height: 158px;
      margin-top: 235px;
      display: none;

      .left {
        top: 110px;
        left: 192px;
      }

      .right {
        top: 110px;
        left: 353px;
      }

      .arrow {
        width: 194px;
        height: 158px;
        left: 376px;
        top: -145px;
        transform: scale(-1, 1) rotate(-12deg);
      }
    }

    &.showPromtNoticeClass6 {
      margin-top: 265px;
    }

    &.step7 {
      background-image: url(/static/imgs/guide/yindao_5.png);
      width: 499px;
      height: 158px;
      margin-top: 465px;
      display: none;

      .left {
        top: 110px;
        left: 192px;
      }

      .right {
        top: 110px;
        left: 353px;
      }

      .arrow {
        width: 194px;
        height: 158px;
        left: 370px;
        top: -160px;
        transform: scale(-1, 1);
      }
    }

    &.showPromtNoticeClass7 {
      margin-top: 496px;
    }

    .left,
    .right {
      width: 116px;
      height: 46px;
      position: absolute;
    }

    .btn-close {
      width: 28px;
      height: 27px;
      right: -33px;
      top: -33px;
      background-image: url(/static/imgs/guide/btn_close.png);
    }

    .arrow {
      background-image: url(/static/imgs/guide/arrow_white_0.png);
    }
  }
}

@media screen and (max-width: 1049px) {
  .guide {
    .content {

      &.step0,
      &.step1 {
        margin-left: auto;
        margin-right: auto;
      }
    }
  }
}

@media screen and (max-width: 1197px) {
  .guide {
    .bg {
      &.step1 {
        width: calc(100vw - 335px);
        margin-left: 315px;
      }
    }
  }
}

.el-scrollbar__wrap {
  overflow-x: hidden;
}

// ie11样式兼容（新手教程）
@media screen and (-ms-high-contrast: active),
(-ms-high-contrast: none) {
  .guide {
    .bg {
      &.step3 {
        margin-left: 219px;
      }

      &.step5 {
        margin-left: 794px;
      }
    }
  }
}

@import "~@/assets/less/var.less";

.la-app {
  transform: translateZ(0); // 强制开启GPU加速渲染
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;

  /* 网络异常情况提示框 */
  .network-error-modal {
    font-family: "微软雅黑";

    .network-error {
      display: flex;
      padding: 40px 80px 43px 60px;

      img {
        margin-right: 35px;
      }

      .network-desc {
        display: flex;
        flex-flow: column;

        .network-desc-title {
          display: flex;

          .title1 {
            color: #545b6d;
            font-size: 18px;
            font-weight: 600;
          }

          .title2 {
            color: #acafb9;
            font-size: 13px;
            font-weight: 400;
          }
        }

        .network-desc-content {
          margin-top: 14px;
          color: #545b6d;
          font-size: 13px;
        }

        .btn-area {
          margin-top: 14px;
          display: flex;
          height: 30px;
          line-height: 30px;

          /deep/button {
            padding: 0 !important;
          }

          .close-btn {
            width: 146px;
            text-align: center;
            color: #545b6d;
            font-size: 13px;
            background: #f6f8fc;
            border: 1px solid #dfe5f1;
            border-radius: 4px;
            padding: 7px 32px;
          }

          .reload {
            background: #4877e8;
            color: #ffffff;
          }
        }
      }
    }
  }

  &.la-app-normal {
    padding-top: 48px;
  }

  .la-app-main {
    box-sizing: border-box;
    // margin-left: 51px;
    // box-sizing: border-box;
    width: 100%;
    height: calc(100% - 48px);
    min-width: 1280px;
    overflow-x: auto;
    background: #f0f2f9;

    // 没有左侧目录栏的布局样式
    &.la-app-main-nomenu {
      margin-left: 0px !important;
      width: 100%;
    }

    // 没有顶部栏的布局样式
    &.la-app-main-noheader {
      margin-top: 0px !important;
      height: 100%;
    }

    // 没有左侧目录栏 和 顶部栏的布局样式
    &.la-app-main-nomenu-noheader {
      margin-top: 0px !important;
      margin-left: 0px !important;
      width: 100%;
      height: 100vh;
      background-color: #fff;
    }
  }

  // 在首页
  &.pc-home {
    .la-app-main {
      width: 100%;
    }
  }
}

.top-help-wrap {
  line-height: 1;
  padding-top: 12px;
}

//顶部更新时间样式
.top-update-wrap {
  // line-height: 30px;
  text-align: right;
  color: #606266;
  // margin-right: 20px;
  display: flex;
  align-items: center;
}

.v-modal {
  background: rgba(102, 102, 102, 0.4);
}

.database-name-accessory {
  color: #999;
  font-size: 12px;
  line-height: 1;
}

.la-right {
  .sec1 {
    height: 40px !important;
    line-height: 40px !important;
    padding: 0 !important;

    .database-name {
      color: #545b6d !important;
      font-size: 18px !important;
      font-weight: bold !important;
    }
  }

  .onTrial-wrap {
    height: 100% !important;
  }

  .sec2 {
    .tab-nav {
      height: 36px !important;
    }
  }

  .sec1-onTrial {
    height: 72px !important;

    .onTrial-wrap {
      height: 52px;
    }
  }


}

// element权限样式 start
// el-tabs
.el-tabs__item {
  &.is-disabled {
    cursor: not-allowed !important;
  }
}

// el-checkbox
.el-checkbox {
  &.is-disabled.is-checked {

    // 选中且禁用
    .el-checkbox__label {
      // 仅label
      color: @PrimaryColor  !important;
    }
  }
}

.el-input-icon-lineHeight30 {
  .el-input__icon {
    line-height: 30px;
    padding-right: 6px;
  }
}

// el-input
.el-input__suffix {
  right: 4px;
  -webkit-transform-style: preserve-3d;
  -webkit-backface-visibility: hidden;
  z-index: 9;

  i {
    -webkit-transform-style: preserve-3d;
    -webkit-backface-visibility: hidden;
  }
}

.el-input__inner {
  height: 28px;
}

// el-tooltip
.el-tooltip__popper.is-light {
  border: 1px solid #ccc;
  // transition: all 300ms;
  border: none;
  box-shadow: @BoxShadow;

  &:hover {
    // transition: all 300ms;
    box-shadow: @BoxShadowHover;
  }
}

//el-tooltip再定义一个
.el-tooltip__popper.is-zhuce {
  border: 1px solid #ccc;
  background: #fff;
  border: none;
  box-shadow: @BoxShadow;

  &:hover {
    box-shadow: @BoxShadowHover;
  }
}

.el-select-group__wrap:not(:last-of-type) {
  padding-bottom: 3px;
}

.el-select-group__wrap:not(:last-of-type)::after {
  width: 100%;
  left: 0;
  bottom: 2px;
}

// 设置箭头样式
.el-tooltip__popper[x-placement^="right"] .popper__arrow {
  // 控制边框颜色
  border-right-color: #ccc !important;
}

.el-tooltip__popper[x-placement^="right"] .popper__arrow:after {
  border-right-color: #fff !important;
}

.el-tooltip__popper[x-placement^="left"] .popper__arrow {
  border-left-color: #ccc !important;
}

.el-tooltip__popper[x-placement^="left"] .popper__arrow:after {
  border-left-color: #fff !important;
}

.el-tooltip__popper[x-placement^="top"] .popper__arrow {
  border-top-color: #ccc !important;
}

.el-tooltip__popper[x-placement^="top"] .popper__arrow:after {
  border-top-color: #fff !important;
}

.el-tooltip__popper[x-placement^="bottom"] .popper__arrow {
  border-bottom-color: #ccc !important;
}

.el-tooltip__popper[x-placement^="bottom"] .popper__arrow:after {
  border-bottom-color: #fff !important;
}

.el-tooltip__popper {
  max-width: 240px;
  padding: 20px 14px 15px;
  line-height: 24px;

  .btn {
    display: inline-block;
    padding: 0px 10px;
    font-size: 12px;
    text-decoration: none;
    border-radius: 15px;
    margin-right: 10px;
    margin-top: 5px;

    &.primary {
      color: @White;
      background-color: @PrimaryColor;
    }

    &.default {
      color: @PrimaryColor;
      border: 1px solid @PrimaryColor;
      background-color: @White;
    }
  }
}

.is-useInfoDark {
  padding: 0px 5px !important;
  // color: @White;
  box-shadow: @BoxShadow;
  background-color: @White;
}

// el-breadcrumb
.el-breadcrumb {
  display: inline-block;
  margin-left: 30px;
}

.el-breadcrumb__inner {
  font-size: 12px;
  color: @FontColor;
  font-weight: normal;

  a {
    color: @PrimaryColor  !important;
    font-weight: normal;
    text-decoration: none;
    cursor: pointer !important;
  }
}

.el-breadcrumb {
  font-size: 12px;
}

.el-breadcrumb__separator[class*="icon"] {
  margin: 0px;
  color: #545b6d;
}

.el-breadcrumb__item:last-child .el-breadcrumb__inner,
.el-breadcrumb__item:last-child .el-breadcrumb__inner:hover {
  color: #545b6d;
}

//el-table
.el-table thead {
  color: @FontColor;
  font-size: 13px;
}

.el-table__body {
  // 使表格兼容safari，不错位
  width: 100%;
  table-layout: fixed !important;
}

.el-table--striped .el-table__body tr.el-table__row--striped td {
  background-color: @TdBackgroundColor;
}

.el-table--enable-row-hover .el-table__body tr:hover>td {
  background-color: #eff2fa;
}

.el-table th {
  padding: 0px;
  background-color: @ThBackgroundColor;
}

.el-table thead th>.cell {
  height: 28px;
  line-height: 28px;
  display: flex;
  align-items: center;
}

.el-table .caret-wrapper {
  height: 28px;
}

.el-table .sort-caret.ascending {
  top: 2px;
}

.el-table .sort-caret.descending {
  bottom: 3px;
}

.el-table td {
  padding: 8px 0px;
}

.el-table .cell {
  padding: 0 0 0 14px;
}

.el-table td .cell {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  /*! autoprefixer: off */
  -webkit-box-orient: vertical;

  // max-height: 36px;
  /* autoprefixer: on */
  // 多层div safari浏览器计算会导致文本消失，高度为-1
  >div {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    /*! autoprefixer: off */
    -webkit-box-orient: vertical;
    max-height: 35px;
    /* autoprefixer: on */
  }

  .dis {
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    max-height: 18px;
  }
}

.el-table tbody td {
  padding: 0;
}

.el-table tbody td>.cell {
  padding: 8px 0 8px 14px;
  line-height: 18px;
}

.el-table td,
.el-table th.is-leaf {
  border-bottom: unset;
}

.el-tabs__item {
  outline: none;
}

// ie浏览器有滚动条的情况最后一列数据会被滚动条遮挡，所以加上右边距
.el-table tbody tr td:last-child {
  padding-right: 16px;
}

@border: 8px;

.el-table__body-wrapper::-webkit-scrollbar {
  width: @border;
  height: @border;
  cursor: pointer;
}

// .el-table__body-wrapper:hover::-webkit-scrollbar {
//   width: 10px;
//   height: 10px;
//   cursor: pointer;
// }
.el-table__body-wrapper::-webkit-scrollbar-track {
  border-radius: @border;
  background-color: #eff2fa;
  cursor: pointer;
}

.el-table__body-wrapper::-webkit-scrollbar-thumb {
  border-radius: @border;
  background-color: #97a2bf;
  cursor: pointer;
}

.el-scrollbar__bar.is-horizontal>div {
  height: @border;
}

.el-table__body-wrapper::-webkit-scrollbar-thumb:hover {
  background-color: #4877e8;
  cursor: pointer !important;
}

// .el-table__body-wrapper::-webkit-scrollbar:hover {
//   width: 10px;
//   height: 10px;
// }

// // 不存在tab切换的页面table高度
// .la-list .el-table {
//   height: calc(100vh - 48px - 40px - 40px - 62px) !important; // 表格的高度为页面高度-导航-标题-显示导出-分页组件
// }

// .option-show + .iconfont + div .el-table {
//   height: calc(100vh - 48px - 40px - 40px - 40px - 62px) !important; // 表格的高度为页面高度-导航-搜索结果模块-标题-显示导出-分页组件
// }

//扩展表格
.el-table__expanded-cell {
  .el-table thead {
    color: @FontColor;
    font-size: 14px;
  }

  .el-table th {
    // padding: 2px 0px;
    background-color: @ThBackgroundColor;
  }

  .el-table td {
    background-color: #fcfcfc;
    border-bottom: 0px;
    border-bottom: 1px dashed #dfe5f1;
    // padding: 8px 0px;
  }

  .el-table th.is-leaf {
    // padding: 10px 0px;
    border-bottom: 1px solid #dfe5f1;
    background-color: #fafbfd;
  }

  .el-table td {}
}

.el-table__expanded-cell[class*="cell"] {
  padding: 0px;
  border-top: 1px solid @PrimaryColor;
  border-bottom: 1px solid @PrimaryColor;
}

.table-expand {
  .el-pagination {
    text-align: center;

    .btn-prev,
    .btn-next {
      margin: 0px 5px;
    }
  }
}

.el-pagination {
  padding: 10px 10px 14px 14px;

  .el-pager li {
    min-width: 24px;
    height: 24px;
    line-height: 24px;
    border: 1px solid @BorderColor;
    background-color: @PrimaryBackgroundColor;

    &.active {
      color: @White;
      background-color: @PrimaryColor;
    }
  }

  .btn-prev,
  .btn-next {
    height: 24px;
    line-height: 24px;
    padding-right: 0px;
    padding-left: 0px;
    border: 1px solid @BorderColor;
  }

  .el-input__inner {
    border-radius: 0px;
  }

  span:not([class*="suffix"]) {
    min-width: 24px;
    height: 24px;
    line-height: 24px;
  }

  button {
    min-width: 24px;
  }
}

.el-pagination .el-select .el-input .el-input__inner {
  height: 24px;
  line-height: 24px;
  padding-right: 18px;
}

.el-pagination .el-select .el-input {
  width: 82px;
}

// 处理el-tab组件蓝框样式问题
.el-tabs__item:focus.is-active.is-focus:not(:active) {
  box-shadow: none;
}

.textOverflow() {
  float: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.la-left-side {
  .el-select__tags {
    .el-tag:first-child {
      .el-select__tags-text {
        max-width: 90px;
        .textOverflow();
      }
    }
  }
}

.el-dialog {
  .el-select__tags {
    .el-tag:first-child {
      .el-select__tags-text {
        max-width: 180px;
        .textOverflow();
      }
    }
  }
}

// el-dialog
.el-dialog__wrapper {}

.el-dialog {
  margin: 0px !important;
  top: 50%;
  left: 50%;
  border-radius: 20px;
  transform: translate(-50%, -50%);

  .el-dialog__header {
    position: relative;
    height: 20px;
    line-height: 20px;

    .el-dialog__headerbtn {
      top: 0px;
      right: -24px;

      .el-dialog__close {
        color: #35384a;
        font-size: 20px;
        font-weight: bolder;

        &:hover {
          color: @PrimaryColor;
        }
      }
    }

    .dialog-header {
      position: relative;
      height: 20px;
      line-height: 20px;
      padding-left: 20px;
      color: @PrimaryColor;
      font-size: 15px;
      font-weight: bold;

      &::before {
        content: "";
        position: absolute;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background-color: @PrimaryColor;
        top: 50%;
        left: 2px;
        margin-top: -3px;
      }
    }

    &::after {
      content: "";
      height: 1px;
      width: 100%;
      background-color: @BorderColor;
      position: absolute;
      bottom: -1px;
      left: 0px;
    }
  }

  .el-dialog__body {
    padding: 10px 20px;
  }

  .dialog-footer {
    padding-top: 30px;

    .el-button.is-round {
      border-radius: 4px !important;
    }
  }
}

.el-cascader-menu__item {
  padding: 8px 30px 8px 20px;
  font-size: 12px;
}

.el-tabs__nav-wrap {
  margin-bottom: 0;
}

.el-tabs__nav-wrap::after {
  height: 0;
}

// 级联选择器和输入框远程搜索结果字号修改为12
.el-cascader__label,
.el-autocomplete-suggestion li {
  font-size: 12px;
}

// 显示及导出 dialog
.dialog-actions {
  .el-dialog {
    width: 455px;
  }

  .arrow-top,
  .arrow-down {
    display: inline-block;
    cursor: pointer;
    color: #848383;
    transition: all 100ms;

    &:hover {
      transition: all 100ms;
      color: @PrimaryColor;
    }

    &:active {
      color: Lighten(@PrimaryColor, 10%);
    }
  }

  .el-dialog__footer {
    text-align: left;
    border-top: 1px solid @BorderColor;

    .el-button {
      padding: 8px 50px;
      border-radius: 4px;
      // border-top: 1px solid @BorderColor;
      font-size: 13px;
    }
  }
}

// 保存条件 dialog
.dialog-saved {
  .el-dialog {
    width: 550px;
  }

  .el-dialog__footer {
    text-align: left;
    border-top: 1px solid @BorderColor;

    .el-button {
      padding: 8px 50px;
      border-radius: 15px;
      border-top: 1px solid @BorderColor;
      font-size: 13px;
    }
  }
}

/* 显示导出及弹出框 - 样式 start */
.la-list {
  position: relative;
  padding: 0px;
  background-color: #fff;
  border-radius: 4px;

  .actions {
    position: absolute;
    top: -30px;
    right: 10px;

    .action-btn {
      cursor: pointer;
      margin-right: 16px;
      font-size: 13px;

      &:hover {
        color: @PrimaryColor;
      }
    }
  }
}

/* 显示导出及弹出框 - 样式 end */

.el-scrollbar__thumb,
.el-scrollbar__thumb:hover {
  background-color: #97a2bf;
}

// element权限样式 end

// 直接使用类 start
.FontColor {
  color: @FontColor;
}

.link-blue {
  color: @PrimaryColor  !important;
}

.link-underline {
  cursor: pointer !important;
  text-decoration: underline !important;
  display: inline-block;
  // display: flex;
  // flex-wrap: wrap;
}

.link-underline_hover:hover {
  color: @PrimaryColor  !important;
}

.no_link-underline {
  cursor: default;
  text-decoration: none !important;
}

.text-overflow {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.hr-dashed {
  border: none;
  border-top: 1px dashed @BorderColor;
}

.no-underline {
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}

// 直接使用类 end

// 权限相关 - start
.abandon-click-method,
.yyxs-abandon-click-method {
  cursor: not-allowed !important;
  color: @NoPmsColor  !important;
  text-decoration: none !important;

  &:hover {
    color: @NoPmsColor  !important;
  }

  * {
    cursor: not-allowed !important;
  }
}

.cursor-tooltip,
.yyxs-cursor-tooltip {
  z-index: 99999;
  position: fixed;
  visibility: hidden;
  max-width: 250px;
  padding: 10px;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 5px;
  font-size: 12px;

  .cursor-tooltip-phone {
    color: @Orange;
  }
}

// 详情页遮罩部分样式
.detail-nopms {
  position: relative;

  .detail-nopms-describe {
    box-sizing: border-box;
    position: absolute;
    top: 50%;
    left: 50%;
    width: 360px;
    height: 160px;
    margin-left: -180px;
    margin-top: -80px;
    border-radius: 10px;
    border: 1px solid @BorderColor;
    background-color: #fff;
    text-align: center;

    img {
      display: inline-block;
      margin: 28px 0px 16px 0px;
    }

    p {
      margin: 0px;
    }
  }
}

// 条数超出1500条的提示显示类
.out-of-page {
  display: inline-block;
  display: none;
  position: absolute;
  bottom: -3px;
  left: 14px;
}

// 权限相关 - end

// 专用于每一处帮助tooltip中的内容
.tip-content {
  box-sizing: border-box;
  max-height: 160px;
  margin-bottom: 10px;
  padding-right: 6px;

  p {
    margin: 0px;
  }

  a {
    color: @PrimaryColor;
  }
}

// loading
.fullscreen-loading {
  z-index: 299;
  position: fixed;
  top: 48px;
  left: 0px;
  width: 100%;
  height: calc(100% - 48px);
  background: rgba(255, 255, 255, 0.7);
  text-align: center;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.normal-size-loading {
  width: 85px;
  height: 85px;
}

.list-in-loading {
  width: 100%;
  min-height: 300px;
  position: relative;
  background: rgba(255, 255, 255, 0.7);
}

.little-size-loading {
  width: 85px;
  height: 85px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -42.5px;
  margin-top: -42.5px;
}

/* 每个数据库左侧搜索按钮 - 样式 start */
.advanced-search {
  padding: 10px 14px 10px 10px;
  font-size: 14px;
  display: flex;
  justify-content: space-between;

  .adva-icon em,
  .adva-icon a {
    color: #4877e8;
    font-size: 14px;
  }

  .advanced-search-btn {
    display: inline-block;
    padding: 5px 0px;
    width: 94px !important; //避免全局影响，优化全局后删除
    box-sizing: border-box;
    border-radius: 4px;
  }

  .normal-search-btn {
    display: inline-block;
    padding: 5px 0px;
    width: 100% !important; //避免全局影响，优化全局后删除
    box-sizing: border-box;
    border-radius: 4px;
  }

  .fr {
    display: inline-block;
    height: 24px;
    line-height: 24px;
    position: relative;

    i {
      display: inline-block;
      padding: 0px;
      margin: 0px;
    }
  }
}

/* 每个数据库左侧搜索按钮 - 样式 end */

/* 数据库右侧视图导航栏 Nav - 样式 start */
.market_nav {
  width: 100%;
  height: 36px;
  display: flex;
  justify-content: space-between;
  background-color: #f6f8fc;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  overflow: hidden;

  .nav_one {
    cursor: pointer;
    display: inline-block;
    // width: 33.33%; // 宽度需要根据情况用百分比确定
    height: 36px;
    text-align: center;
    line-height: 36px;
    font-size: 16px;
    // border:1px #D5E0F8 solid;
    box-sizing: border-box;
    box-shadow: 0px 0px 10px 0px #c4d3f8;
    text-decoration: none;
    transition: all 300ms;
    background-color: #f6f8fc;
    overflow: hidden;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    position: relative;

    &:nth-of-type(1) {
      z-index: 11;
    }

    &:nth-of-type(2) {
      z-index: 12;
    }

    &:nth-of-type(3) {
      z-index: 13;
    }

    &:nth-of-type(4) {
      z-index: 14;
    }

    &:nth-of-type(5) {
      z-index: 15;
    }

    &.router-link-active {
      z-index: 21;
      position: relative;
      box-shadow: 0px 0px 10px 0px #dae3fa !important;

      .nav {
        color: @PrimaryColor;
        background-color: #fff;
        font-weight: 800;
      }

      &+.nav_one {
        z-index: 20 !important;

        &+.nav_one {
          z-index: 19 !important;

          &+.nav_one {
            z-index: 18 !important;

            &+.nav_one {
              z-index: 17 !important;
            }
          }
        }
      }
    }

    .nav {
      display: flex;
      justify-content: center;
      flex-wrap: nowrap;
      align-items: center;
      height: 100%;
      width: 100%;
      text-align: center;
      font-weight: 400;
    }

    &:hover {
      color: Lighten(@PrimaryColor, 10%);
      // background-color: Lighten(#f5f7fb, 5%);
      transition: all 300ms;
    }
  }
}

/* 数据库右侧视图导航栏 Nav - 样式 end */

/* 弹出全屏(如智能分析全屏、定量分析) - 公共样式 end */
.dialog {
  position: fixed;
  z-index: 1000;
  top: 48px;
  left: 0px;
  width: 100%;
  height: calc(100% - 48px);
  background-color: @PrimaryBackgroundColor;

  .menu {
    position: fixed;
    left: 0px;
    top: 48px;

    .nav {
      width: 220px;
      padding-left: 20px;
      line-height: 40px;
      border-left: 4px solid @PrimaryBackgroundColor;
      border-bottom: 1px dashed @BorderColor;
      cursor: pointer;

      &.active,
      &:hover {
        border-left: 4px solid @PrimaryColor;
        border-bottom: 0px;
        background-color: #fff;
        box-shadow: @BoxShadow;
      }
    }
  }
}

/* 弹出全屏(如智能分析全屏、定量分析) - 公共样式 end */
.yzxjd-btn {
  width: 80px;
  height: 20px;
  display: block;
  line-height: 21px;
  text-align: center;
  color: #fff;
  border-radius: 20px;
}

.yzxjd-btn-gray {
  background: #97a1be;
}

.yzxjd-btn-cbba {
  background: #9ab4f2;
}

.yzxjd-btn-beba {
  background: #7e9fef;
}

.yzxjd-btn-besy {
  background: #628aeb;
}

.yzxjd-btn-sb {
  background: #4776e8;
}

.yzxjd-btn-sttg {
  background: #a7d157;
}

.yzxjd-btn-tg {
  background: #91c332;
}

.el-cascader {
  .el-icon-arrow-down {
    line-height: 16px;
  }
}

.successSubmitTips {
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

.inp-group-pop {
  .el-select-group__title {
    font-size: 14px;
    color: @PrimaryColor;
  }
}

.list-tabs {
  .el-tabs__header {
    padding-left: 14px;
    margin: 0px;
  }

  .el-tabs__content {
    overflow: visible;
  }

  .el-tabs__active-bar {
    height: 3px;
    border-radius: 5px;
  }
}

.zhuce-table-zt-wrap {
  display: flex;
  align-items: center;
}

.zhuce-table-zt-l {
  width: 60%;
  padding-right: 5px;
}

.zhuce-table-zt-r {
  width: 40%;
  color: #fff;

  span {
    padding: 3px 7px;
    border-radius: 15px;
  }

  .sqlc {
    background: #91adf1;
  }

  .pzlc {
    background: #4877e8;
  }

  .sqss {
    background: #beea5f;
  }

  .pzss {
    background: #90c31f;
  }
}

.overflow-g {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
<style lang="less" scoped>
.video-wap {
  position: fixed;
  z-index: 3200;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  text-align: center;
  background: rgba(102, 102, 102, 0.4);

  .video-bg {
    position: relative;
    top: 23%;
    width: 660px;
    height: 380px;
    margin: 0 auto;
    padding-top: 10px;

    .video-close {
      position: relative;
      left: 50%;
      width: 330px;
      top: 0px;
      text-align: right;

      img {
        width: 20px;
      }
    }

    a {
      display: block;
      height: auto;
    }
  }
}
</style>
<style lang="less">
// 客服系统样式
.fix_box_udesk {
  position: fixed;
  right: 70px;
  bottom: 50px;
  z-index: 298;

  a {
    display: block;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: #fff;
    margin-bottom: 10px;
  }

  .a3 {
    background: #fff url("~@/assets/imgs/back5.png") center center no-repeat;
  }

  .a3:hover {
    background: #4b5af8 url("~@/assets/imgs/back4.png") center center no-repeat;
  }
}

.fix_box_udesk_one {
  right: 200px;
  bottom: 90px;
}

@media screen and (max-width: 1280px) {
  .fix_box_udesk_one {
    right: 20px;
  }
}

// @media screen and (max-width: 768px) {
//   .la-app .la-app-main {
//     min-width: 0;
//   }
// }
</style>
<style lang="less">
.questionnaire {
  background: rgba(102, 102, 102, 0.4);
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 8888;

  // display: none;
  .q-box {
    width: 548px;
    height: 620px;
    background: url("/static/imgs/question_bg.png") center no-repeat;
    position: relative;
    left: 50%;
    top: 50%;
    margin-left: -274px;
    margin-top: -310px;

    .q-box-btn {
      width: 228px;
      height: 54px;
      background: url("/static/imgs/question_btn.png") center no-repeat;
      display: block;
      position: absolute;
      bottom: 24px;
      left: 50%;
      margin-left: -114px;
    }

    .q-close {
      width: 17px;
      height: 16px;
      background: url("/static/imgs/question_close.png") center no-repeat;
      display: block;
      position: absolute;
      top: 11px;
      right: 0;
      cursor: pointer;
    }
  }
}

@media (max-height: 720px) and (max-height: 768px) {
  .questionnaire {
    .q-box {
      width: 513px;
      height: 502px;
      background: url("/static/imgs/question_bg2.png") center no-repeat;
      position: relative;
      left: 50%;
      top: 50%;
      margin-left: -256.5px;
      margin-top: -251px;

      .q-box-btn {
        width: 194px;
        height: 46px;
        background: url("/static/imgs/question_btn.png") center no-repeat;
        display: block;
        position: absolute;
        bottom: 24px;
        left: 50%;
        margin-left: -97px;
        border-radius: 25px;
      }

      .q-close {
        width: 13px;
        height: 12px;
        background: url("/static/imgs/question_close.png") center no-repeat;
        display: block;
        position: absolute;
        top: 11px;
        right: 0;
        cursor: pointer;
      }
    }
  }
}

.search-guide {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  min-width: 1280px;
  // background: rgba(0, 0, 0, 0.3)

  .fadeInUp {
    -webkit-animation-name: fadeInUp;
    animation-name: fadeInUp;
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      -webkit-transform: translate3d(0, 45%, 0);
      transform: translate3d(0, 45%, 0);
    }

    to {
      opacity: 1;
      -webkit-transform: none;
      transform: none;
    }
  }

  .search-guide-bg {
    box-shadow: 0 0 0 10000px rgba(0, 0, 0, 0.6);
    border-radius: 4px;
  }

  .search-guide-step0 {
    width: 288px;
    height: calc(100vh - 48px);
    margin-top: 48px !important;
  }

  .search-guide-content0,
  .search-guide-content1 {
    animation-duration: 1s;
    animation-fill-mode: forwards;
    position: absolute;
    top: 160px;
    left: 310px;

    p {
      font-size: 20px;
      font-weight: 600;
      color: #ffffff;
      line-height: 30px;
    }

    .info-footer {
      display: flex;
      align-items: center;
      margin-top: 20px;

      div {
        width: 100px;
        height: 36px;
        line-height: 36px;
        text-align: center;
        border-radius: 4px;
        border: 1px solid #ffffff;
        font-size: 16px;
        font-weight: 600;
        color: #ffffff;
        box-sizing: border-box;
        margin-right: 20px;
        cursor: pointer;
      }

      div:last-child {
        background: #4877e8;
        border: 1px solid #4877e8;
      }
    }
  }

  .search-guide-step1 {
    width: 500px;
    height: 48px;
    margin-left: 298px;
    margin-top: 88px;
  }

  .search-guide-content1 {
    left: 298px;
    top: 180px;
  }
}
</style>
