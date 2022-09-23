import "@/assets/elementui/element-#4877E8/index.css"; // #4877E8主题色：element自定义主题引入
import "@/assets/iconfont/iconfont.css";
import "@/assets/less/app.less";
import App from "@/App";
import Vue from "vue";
import Vuex from "vuex";
import VueCookies from "vue-cookies";
import router from "@/router";
/*import VueAnalytics from 'vue-analytics'*/
import store from "@/store";
import Axios from "axios";
import i18n from "@/i18n";
import ElementUI from "element-ui";
import Qs from "qs";
import VueMatomo from "vue-matomo";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import "../static/js/echarts_theme";
import "../static/js/trz_theme";
import "../static/js/westeros-global";
import func from "@/assets/js/func";
import "video.js/dist/video-js.css";
import GlobalMethods from "./components/common/GlobalMethods";
import VWaiting from "@/components/common/vWaiting";
import {
  Field,
  Icon,
  Button,
  Cell,
  CellGroup,
  DropdownMenu,
  DropdownItem
} from "vant";
import "vant/lib/index.less";

import md from "./md";
import NewProjectGuide from "@/components/common/newProjectGuide";
import Marqueekz from "@/components/common/marquee-kz";
// window.md = md;
Vue.component("NewProjectGuide", NewProjectGuide);
Vue.component("marquee-kz", Marqueekz);
Vue.use(Field);
Vue.use(Icon);
Vue.use(Button);
Vue.use(Cell)
  .use(CellGroup)
  .use(DropdownMenu)
  .use(DropdownItem);
Vue.use(VueCookies);
Vue.use(VWaiting);
import("vue-quill-editor").then(VueQuillEditor => {
  let ua = navigator.userAgent;
  if (/trident/i.test(ua)) {
    if (/msie/i.test(ua)) {
      console.log("IE11以下");
    } else {
      console.log("IE11");
      Vue.use(VueQuillEditor);
    }
  } else {
    Vue.use(VueQuillEditor);
  }
});

Vue.use(func);
Vue.use(Vuex);
Vue.use(ElementUI);
Vue.use(GlobalMethods);
//修改el弹出层默认z-index
Vue.prototype.$ELEMENT.zIndex = 3000;

Vue.use(VueMatomo, {
  host: "//mtmt.yaozh.com/", // 这里配置你自己的piwik服务器地址和网站ID
  siteId: window.location.host === "vip.yaozh.com" ? "3" : "2", //siteId值
  // 根据router自动注册
  router: router,
  // // 是否需要在发送追踪信息之前请求许可
  // // 默认false
  requireConsent: false,
  enableLinkTracking: true,
  // // 是否追踪初始页面
  // // 默认true
  trackInitialView: false,
  // // 最终的追踪js文件名
  // // 默认 'piwik'
  trackerFileName: "matomo",
  debug: false
});
// GA初始化
/*Vue.use(VueAnalytics, {
  id: 'UA-73321472-18', // 从配置中读取
  disableScriptLoader: true, // 必须在html中完成初始化，这里显式禁止去下载ga脚本
  Router, // 确保路由切换时可以自动统计
  autoTracking: {
    pageviewOnLoad: false // 当通过网址进来时已经GA在初始化时就发起一次pageview的统计，这里不要重复统计
  }
})*/

/*window._ = _
window.$ = $*/
window.Qs = Qs;
window.Echarts = echarts;
window.Store = store;
window.Axios = Axios;
window.Axios.defaults.headers["Cache-Control"] = "no-cache";

//提交日志 3小时提交一次
// setInterval(() => {
//   if (localStorage.getItem("indexDB")) {
//     Axios.post("/mlw/report", {
//       params: {
//         level: 2,
//         short_message: localStorage.getItem("indexDB") || ""
//       }
//     })
//       .then(function (response) {
//         console.log(response);
//       })
//       .catch(function (error) {
//         console.log(error);
//       });
//   }
// }, 1000 * 60 * 60 * 3); //1000*60*60*3

// document.domain = 'yaozh.com'

// 获取cookie
let mainGetCookie = function (name) {
  let cookieArr = document.cookie.split("; "); //使用"; "分割Cookie
  let cva = [],
    temp;
  //循环的得到Cookie名称与值
  for (let i = 0; i < cookieArr.length; i++) {
    temp = cookieArr[i].split("="); //用"="分割Cookie的名称与值
    cva[temp[0]] = unescape(temp[1]);
  }
  if (name) {
    //如果有name则输出这个name的Cookie值
    return cva[name];
  } else {
    //如果没有name则输出空数组
    return cva;
  }
};

let GETCOOKIEFUN = (window.GETCOOKIEFUN = mainGetCookie);
// 删除cookie
let mainDelCookie = function (name) {
  let exp = new Date();
  exp.setTime(exp.getTime() - 1);
  let cval = GETCOOKIEFUN(name);
  if (cval != null) {
    document.cookie =
      name + "=" + cval + ";expires=" + exp.toGMTString() + ";path=/";
  }
};

Vue.prototype.getUrlParam = function (name) {
  // 未传参，返回空
  if (!name) return null;
  // 查询参数：先通过search取值，如果取不到就通过hash来取
  var after = window.location.search;
  after = after.substr(1) || window.location.hash.split("?")[1];
  // 地址栏URL没有查询参数，返回空
  if (!after) return null;
  // 如果查询参数中没有"name"，返回空
  if (after.indexOf(name) === -1) return null;

  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  // 当地址栏参数存在中文时，需要解码，不然会乱码
  var r = decodeURI(after).match(reg);
  // 如果url中"name"没有值，返回空
  if (!r) return null;
  return r[2];
};

// 导出Excel，防止被浏览器当成广告拦截
// 新增http的下载支持
Vue.prototype.downloadFile = function (url = "") {
  store.commit("listLoading", true);
  let a = document.createElement("a");
  a.setAttribute("href", url);
  a.setAttribute("style", "none");
  a.setAttribute("target", "_blank");
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  store.commit("listLoading", false);
};

// 中英文判断超出指定长度显示...
// 默认是七个字符
Vue.prototype.labelLenLimit = (value, maxLen = 7) => {
  let text = "";
  if (value) {
    let arr = value.split(""),
      count = maxLen;
    arr.length > 0 &&
      arr.forEach(item => {
        // 英文
        if (escape(item).indexOf("%u") < 0) {
          if (count > 0) {
            text += item;
            count -= 0.5;
          }
        } else {
          // 中文
          if (count > 0) {
            text += item;
            count -= 1;
          }
        }
      });
    text = count == 0 ? text + "..." : text;
  }
  return text;
};

// 每隔三位用逗号分隔开
Vue.prototype.thousandFormatter = value => {
  if (value) {
    var money =
      value.toString().indexOf(".") !== -1 ?
        value.toLocaleString() :
        value.toString().replace(/(\d)(?=(?:\d{3})+$)/g, "$1,");
    return money;
  } else return 0;
};

// 问卷引导
let questionnaireFun = function () {
  let gradeId = parseInt(localStorage.getItem("gradeId"));
  // console.log([55,62,63,64,68,84,85,86].some(e => e === gradeId), localStorage.getItem("accesstoken"))
  // 满足弹出对象
  if (
    [62, 63, 64, 68, 84, 85, 86].some(e => e === gradeId) &&
    GETCOOKIEFUN("accesstoken")
  ) {
    window
      .Axios({
        method: "get",
        url: "/api/usercenter/checkdialog",
        header: {
          "Cache-Control": "no-cache"
        },
        params: {
          accesstoken: GETCOOKIEFUN("accesstoken"),
          timestap: new Date().getTime()
        }
      })
      .then(res => {
        if (res.data.code == 200) {
          if (parseInt(res.data.data.is_pop)) {
            store.dispatch("UserCenter/questionDialogA", true);
          } else {
            store.dispatch("UserCenter/questionCloseA", true);
          }
        }
      });
  } else {
    store.dispatch("UserCenter/questionCloseA", true);
  }
};

// 导航守卫
router.beforeEach((to, from, next) => {
  // TODO 企业版后续才放开注释，这个代码主要是为了进无权限页面也能带统计参数
  // if (to.path === "/login") {
  //   let params = {};
  //   if (Object.keys(from.params).length > 0) {
  //     Object.assign(params, from.params);
  //   } else if (Object.keys(from.query).length > 0) {
  //     Object.assign(params, from.query);
  //   }
  //   Object.assign(to.query, params);
  // }
  // console.error("修改后的路径：", to);
  if (to.path.includes('/qs')) {
    next();
  }
  if (to.meta.title) {
    /* let domUD = document.querySelector('.fix_box_udesk')
  domUD.className = to.path === '/introduce' ? 'fix_box_udesk fix_box_udesk_one' : 'fix_box_udesk'
  domUD.style.display = to.path === '/introduce' || to.path === '/login' ? 'block' : 'none' */
    window.document.title = to.meta.title;
  } else if (to.path == "/home" || to.path == "/login") {
    window.document.title = "药智数据企业版 - 智能决策，洞见未来";
  } else {
    if (store.state.Normal.names[String(to.path).split("/")[1]]) {
      window.document.title =
        store.state.Normal.names[String(to.path).split("/")[1]];
    }
  }

  // if (to.path == '/service') {
  //   window.document.title = `客服中心-${to.query.ga_name}-药智数据企业版`
  // }
  if (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|Mobile|Opera Mini/i.test(
      navigator.userAgent
    ) &&
    window.screen.width < 768
  ) {
    if (to.path === "/introducemobile") {
      next();
    } else if (to.path.includes('/qs')) {
      next();
    } else {
      const ga_name =
        navigator.userAgent.toLowerCase().match(/MicroMessenger/i) ==
          "micromessenger" ?
          "vip_mobile_wechat" :
          "vip_mobile_h5";
      next({
        path: "introducemobile",
        query: Object.assign({}, to.query, {
          ga_source: "vip",
          ga_name
        })
      });
    }
  } else {
    if (to.path === "/introduce") {
      if (from.path === "/") {
        store.dispatch("UserCenter/handleAccountAxios").then(() => {
          if (store.state.UserCenter.accountData.username) {
            if (![62, 63, 64, 65, 68, 84, 85, 86].some(
              e => e === store.state.UserCenter.accountData.grade_id
            )) {
              next({
                path: "home"
              });
            } else {
              next();
            }
          } else {
            next();
          }
        });
      } else {
        next();
      }
    } else {
      if (to.path) {
        if (window._hmt) {
          window._hmt.push(["_trackPageview", "/#" + to.fullPath]);
        }
      }
      next();
    }
  }

  // 医院销售数据放大测试版权限判断
  if (to.path === "/yyxsdata" && to.query.type_id) {
    window
      .Axios({
        method: "get",
        url: "/api/config/view?dbname=yyxs",
        params: {
          accesstoken: GETCOOKIEFUN("accesstoken")
        }
      })
      .then(res => {
        if (res.data.code === 200 && res.data.data) {
          let data = res.data.data;
          let flag =
            data.norules.exclusive.length > 0 &&
            data.norules.exclusive.every(
              item => item.action !== "yyxsdlfxenlarged_test"
            );
          if (data.norules.exclusive.length === 0) {
            flag = true;
          }
          Store.commit("UserCenter/isFangDa", flag);
          if (store.state.UserCenter.isFangDa === true) {
            next();
          } else {
            router.replace({
              path: "yyxs-large-no-permission"
            });
          }
        }
      });
  }

  if (to.path === "/dailiangcaigou/analysis") {
    window
      .Axios({
        method: "get",
        url: "/api/config/view?dbname=dailiangcaigou",
        params: {
          accesstoken: GETCOOKIEFUN("accesstoken")
        }
      })
      .then(res => {
        if (res.data.code === 200 && res.data.data) {
          let data = res.data.data;
          let flag = data.norules.exclusive.every(
            item => item.action !== "dailiangcaigoujzfx"
          );
          if (data.norules.exclusive.length === 0) {
            flag = true;
          }
          if (flag === true) {
            next();
          } else {
            router.replace({
              path: "/no-permission"
            });
          }
        }
      });
  }

  // if (to.name.includes("database_trz_rongzi_detail") == true) {
  //     let isIE = () => {
  //         if (!!window.ActiveXObject || "ActiveXObject" in window) {
  //             return true;
  //         } else {
  //             return false;
  //         }
  //     };
  //     console.log("是否是IE", isIE());
  //     // 除IE以外的浏览器
  //     if (isIE() == false) {
  //         next();
  //     } else {
  //         next({
  //             path: `trz/rongzi-ie/${to.params.id}`,
  //             params: to.params
  //         });
  //     }
  // }
  clearInterval(window.questCounter);
});

router.afterEach(to => {
  //   ga处理方法
  function handleGa() {
    let cd1 = store.state.UserCenter.accountData.uid;
    let cd2 = store.state.UserCenter.accountData.username;
    let cd3 = store.state.UserCenter.accountData.grade_name;
    let cd4 = store.state.UserCenter.accountData.comname;
    let cd5 = store.state.UserCenter.accountData.mobile;
    let cd6 = store.state.UserCenter.accountData.endtime;
    let cd7 = store.state.UserCenter.accountData.email;
    if (window.ga) {
      if (cd1) {
        ga("set", "dimension1", cd1);
      } // 用户ID传值
      if (cd2) {
        ga("set", "dimension2", cd2);
      } // VIP等级传值
      if (cd3) {
        ga("set", "dimension3", cd3);
      } // 用户公司名称传值
      if (cd4) {
        ga("set", "dimension4", cd4);
      } // 用户电话传值
      if (cd5) {
        ga("set", "dimension5", cd5);
      } // 用户VIP到期日期传值
      if (cd6) {
        ga("set", "dimension6", cd6);
      } // 用户邮箱传值
      if (cd7) {
        ga("set", "dimension7", cd7);
      } // 用户邮箱传值
      if (cd1) {
        ga("set", "userId", cd1);
      }

      window.ga("set", "page", to.fullPath);
      window.ga("send", "pageview");
    }

    /**
     *  添加GA4跟踪代码
     */
    // 创建script标签，执行script内容
    let scriptId = document.getElementById('scriptGa');
    console.log(scriptId);
    if (!scriptId) {
      let script = document.createElement('script')
      let text = ''
      if (cd1 || cd2 || cd3 || cd4) {
        text = `
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          'user_id' : '${cd1}', //用户userid
          'user_name' : '${cd2}', //用户名
          'company': '${cd4}', // 用户公司名称
          'user_group': '${cd3}' // 会员等级
        });
        (function(w,d,s,l,i){
          w[l]=w[l]||[];
          w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
          var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
          j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
          f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-T87S4G2');`
      } else {
        text = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-T87S4G2');`
      }
      script.type = 'text/javascript'
      script.text = text
      script.id = 'scriptGa'
      document.getElementsByTagName('head')[0].appendChild(script)
    }
    /**
     *  添加GA4跟踪代码结束
     */

    if (_paq) {
      _paq.push(["setCustomDimension", 1, cd3]); // userGradeName
      _paq.push(["setCustomDimension", 2, cd2]); // userName
      _paq.push(["setCustomDimension", 3, cd4]); // userComname
      _paq.push(["setCustomDimension", 4, cd1]); // userID
      _paq.push(["setCustomDimension", 5, cd6]); // userEndtime
      _paq.push(["setUserId", cd1]); // userID
      _paq.push(["trackPageView"]);
      _paq.push(["enableLinkTracking"]);
    }
  }
  if (!store.state.UserCenter.accountData.uid) {
    // 没有获取到ga所需用户数据时，先进行一次请求获取
    store.dispatch("UserCenter/handleAccountAxios").then(() => {
      handleGa();
    });
  } else {
    handleGa();
  }
  /* Google Analytics - end */
  //引导问卷定时任务
  questionnaireFun();
});

//处理loading chunk问题
router.onError(error => {
  const pattern = /Loading chunk (\d)+ failed/g;
  const isChunkLoadFailed = error.message.match(pattern);

  if (isChunkLoadFailed) {
    window.location.reload();
  } else {
    console.log(error);
  }
});
/* Axios拦截器 - start */
// Axios.defaults.headers.common['Cathe-Control'] = 'max-age=315360000';
// 添加请求拦截器
const noeParams = [
  "/login",
  "/mobilelogin",
  "/forceLogin",
  "/api/user/usercheck"
]; // 不需要加参数得接口路径
Axios.interceptors.request.use(
  config => {
    const decrypt =
      location.hostname !== "vip.yaozh.com" &&
      location.hostname !== "vip-master.yaozh.com";
    if (decrypt)
      config.params = Object.assign({}, config.params, {
        is_laws: 1
      });

    let accesstoken = GETCOOKIEFUN("accesstoken");
    if (!accesstoken) return config;
    if (noeParams.some(val => config.url.includes(val))) return config;

    if (config.method === "get") {
      if (
        (config.params && config.params.accesstoken) ||
        config.url.includes("accesstoken")
      ) {
        // if(decrypt) config.params = Object.assign({},config.params,{is_laws:1})
        return config;
      }
      config.params = Object.assign({}, config.params, {
        accesstoken
      });
    } else if (config.method === "post") {
      //post请求也有params?
      let dataKey = config.params ? "params" : "data";
      if (config[dataKey] && config[dataKey].accesstoken) {
        return config;
      }
      config[dataKey] = Object.assign({}, config[dataKey], {
        accesstoken
      });
    }
    // 在发送请求之前做些什么
    return config;
  },
  error => {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

var loginout = function () {
  mainDelCookie("accesstoken");
  mainDelCookie("userPicture");
  mainDelCookie("userName");
  mainDelCookie("yaozh_logintime");

  // 清除store中的状态
  store.commit("UserCenter/accesstoken", "");
  store.commit("UserCenter/userName", "");
  store.commit("UserCenter/uid", "");
};
var ab2str = function (u, f) {
  var b = new Blob([u]);
  var r = new FileReader();
  r.readAsText(b, "utf-8");
  r.onload = function () {
    if (f) f.call(null, r.result);
  };
};
// 添加响应拦截器

let lanjieFunc = function (data, response) {
  //跨域接口没加密
  if (data) {
    if (
      location.hostname === "vip.yaozh.com" ||
      location.hostname === "vip-master.yaozh.com"
    ) {
      if (data.data && !(data.data instanceof Object))
        data.data = JSON.parse(md.decryptResponse(data.data, "VIP4.2.0"));
    }
    var CODE = data.code;
    if (CODE == 11029 || CODE == 11056) {
      let _data = data.data;
      store.commit("UserCenter/RemoteLogin", true);
      store.commit("UserCenter/RemoteLoginR", CODE == 11029 ? true : false);
      store.commit("UserCenter/RemoteLoginInfo", _data);
    } else if (CODE == 11016) {
      // if (!this.vueGetCookie('accesstoken')) {  //this用不了
      if (!GETCOOKIEFUN("accesstoken")) {
        router.push({
          path: "/login"
        });
        return;
      }
      console.log(CODE, router);
      if (
        response.request.responseURL.includes("devprocess") ||
        response.request.responseURL.includes("timeline")
      ) { } else {
        if (router.history.current.path.includes("/trz")) {
          router.push({
            path: "/trz-no-permission",
            query: {
              from: "trz"
            }
          });
        } else {
          router.replace({
            path: "/no-permission"
          });
        }
      }
    } else if (CODE == 11038 || CODE == 11039 || CODE == 11040) {
      //临时方案增加11040状态跳转404页面，应对不存在的数据
      Vue.prototype.$show404();
    } else if (CODE == 11015) {
      router.push({
        path: "/login"
      });
    }
     else if(
      CODE == 11042 ||
      CODE == 11043 ||
      CODE == 11044 ||
      CODE == 11005
    ) {
      let _data = data.data;
      if (!store.state.UserCenter.RemoteLogin) {
        let Payload = {
          code: CODE,
          msg: data.msg,
          show: true
        };
        console.info(console.info(Payload));
        store.commit("UserCenter/errorEducation", Payload);
      }
    } else {
      return response;
    }
  }
};

Axios.interceptors.response.use(
  response => {
    let data = response.data;
    if (data.byteLength && !response.headers["file_name_urlencode"]) {
      //导出功能失败的判断
      ab2str(response.data, function (str) {
        data = JSON.parse(str);
        return lanjieFunc(data, response);
      });
    } else {
      return lanjieFunc(data, response);
    }
  },
  error => {
    // 对响应错误做点什么
    let status = error.response.status;

    if (status === 404) {
      Vue.prototype.$show404();
    }
    return Promise.reject(status);
  }
);

/* Axios拦截器 - end */

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  i18n,
  store,
  components: {
    App
  }
});
