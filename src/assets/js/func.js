import store from "@/store";
import crypto from "crypto-js";

import {
  debounce
} from "lodash";
import router from "@/router";

const PATAPI_PROXY_ALL =
  window.location.host.indexOf("dev") > -1 ? "/pat" : "/lineat";
const inpMaxLen = 50; //输入框最长长度限制
const inpMaxLenJq = 300; //精确输入框最长长度限制
const SPECIAL_API = [
  "/api/report/zhuce",
  "/api/report/zhucelist",
  "/api/report/clinicallist",
  "/api/report/sspzchina",
  "/api/report/sspzus",
  "/api/report/sspzeu",
  "/api/report/sspzjp",
  "/api/report/sspzcountries",
  "/api/report/drugStandard",
  "/api/report/ypxs",
  "/api/report/yyxs",
  "/api/report/ypxslist",
  "/api/report/yyxslist",
  "/api/report/yaopinzhongbiao",
  PATAPI_PROXY_ALL + "/dbgroups",
  PATAPI_PROXY_ALL + "/dbgroups",
  "/api/report/instruct"
]; //报错需要单独处理的api
let func = {};
const requestParams = {};
func.install = function (Vue, options) {
  Vue.prototype.PATAPI_PROXY = PATAPI_PROXY_ALL;
  Vue.prototype.SPECIAL_API = SPECIAL_API;
  Vue.prototype.inpMaxLen = inpMaxLen;
  Vue.prototype.inpMaxLenJq = inpMaxLenJq;
  Vue.prototype.insideUserList = [1, 23, 55]; // 内部用户id
  Vue.prototype.iconConfig = [{
    label: "常用数据库",
    icon: "&#xe63f;"
  },
  {
    label: "药品研发",
    icon: "&#xe70b;"
  },
  {
    label: "一致性评价",
    icon: "&#xeb4c;"
  },
  {
    label: "生产检验",
    icon: "&#xe672;"
  },
  {
    label: "市场信息",
    icon: "&#xe6a1;"
  },
  {
    label: "合理用药",
    icon: "&#xe649;"
  },
  {
    label: "医药化学",
    icon: "&#xe6a9;"
  },
  {
    label: "CHEMPHARM",
    icon: "&#xe6a9;"
  },
  {
    label: "医疗器械",
    icon: "&#xe63d;"
  },
  {
    label: "中药材",
    icon: "&#xe6f5;"
  },
  {
    label: "保健品",
    icon: "&#xe65b;"
  },
  {
    label: "VIP尊享",
    icon: "&#xe658;"
  },
  {
    label: "内部专用",
    icon: "&#xe657;"
  },
  {
    label: "其他",
    icon: "&#xe698;"
  },
  {
    label: "导航地图",
    icon: "&#xe601;"
  },
  {
    label: "化妆品",
    icon: "&#xe68d;"
  },
  {
    label: "食品",
    icon: "&#xe68e;"
  }
  ];

  function sortUser(a, b) {
    // console.info(a,b)
    var stra = a.split("");
    var strb = b.split("");
    let al = stra.length,
      bl = stra.length,
      len = 0,
      val = "",
      i = -1;
    al - bl > 0 ? (len = bl) : (len = al);
    while (i++ < len) {
      let aa = stra[i].charCodeAt(0),
        bb = strb[i].charCodeAt(0);
      if (aa != bb) {
        val = aa - bb;
        break;
      }
    }
    return val;
  }
  // 时间戳+随机字符串 生成签名
  (Vue.prototype.getSignature = function (strArr) {
    let _this = this;
    let str = strArr
      .sort((a, b) => {
        return sortUser(a, b);
      })
      .join("");
    // console.info(str)
    var md5 = crypto
      .MD5(crypto.SHA1(str).toString())
      .toString()
      .toUpperCase();
    console.info(md5);
    return md5;
  }),
    (Vue.prototype.isIE = function () {
      let ua = navigator.userAgent;
      return ua.indexOf("Trident") > -1;
    });
  // 设置cookie
  Vue.prototype.vueSetCookie = function (name, value, domain) {
    let Days = 5;
    let exp = new Date();
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    var doms = domain ? ";domain=" + domain : ";domain=.yaozh.com"; //设置dom
    document.cookie =
      name +
      "=" +
      escape(value) +
      ";expires=" +
      exp.toGMTString() +
      ";path=/" +
      doms;
  };
  // 获取cookie
  Vue.prototype.vueGetCookie = function (name) {
    let cookieArr = document.cookie.split("; "); //使用"; "分割Cookie
    let cva = [],
      temp;
    //循环的得到Cookie名称与值
    for (let i = 0; i < cookieArr.length; i++) {
      temp = cookieArr[i].split("="); //用"="分割Cookie的名称与值
      cva[temp[0]] = unescape(temp[1]);
    }
    // console.info(cookieArr)
    if (name) {
      //如果有name则输出这个name的Cookie值
      return cva[name];
    } else {
      //如果没有name则输出空数组
      return cva;
    }
  };
  // 删除cookie
  Vue.prototype.vueDelCookie = function (name, Domain) {
    let exp = new Date();
    exp.setTime(exp.getTime() - 1);
    let cval = this.vueGetCookie(name);
    if (cval != null) {
      let str = name + "=" + cval + ";expires=" + exp.toGMTString() + ";path=/";
      if (!Domain) {
        document.cookie = str + ";domain=.yaozh.com";
        document.cookie = str;
      } else {
        document.cookie = str + ";domain=" + Domain;
      }
    }
  };
  // 处理putong初始值
  Vue.prototype.vueHandleInitPutong = function (options) {
    // console.log(options)
    let _that = this;
    let inpArr = [];
    let putong;
    if (this.$route.path === '/globaldrugs/analysis') {
      putong = _that.putongAnaly;
    } else {
      putong = _that.putong
    }
    if (_.keys(putong).length) {
      // 不为空说明有路由参数name
      for (let item of options) {
        let ins = Object.assign({}, item);
        for (let key in putong) {
          if (key.indexOf(item.name) == 0 && !item.value) {
            ins.value = putong[key];
            if (key.indexOf("_eq") != -1) {
              ins.initAccurate = true;
            }
          }
        }
        inpArr.push(ins);
      }
    } else {
      inpArr = Object.assign({}, options);
    }
    return inpArr;
  };
  // 清除所有左侧框显示内容
  Vue.prototype.vueClearLeft = function () {
    let _that = this;
    let dom = _that.$refs.ileft;
    // console.log("所有项目：", dom)
    //删除所有input用户感知
    // $("input").val("")
    for (let i = 0; i < dom.length; i++) {
      let theDom = dom[i].$children[0];
      let arr = theDom.$children;
      let arrLen = arr.length;
      let dom_type = theDom.item.type ? theDom.item.type : "";
      // console.info($(dom[i].$el))
      $(dom[i].$el)
        .find("input")
        .val("");

      if (arrLen == 2 && dom_type == "text") {
        // 逻辑
        theDom.item.value = "";
        // 视觉
        arr[0].model = false;
        let arrChildren = arr[1].$children;
        let arrChildrenLen = arrChildren.length;
        if (arrChildrenLen == 2) {
          if (typeof arrChildren[0].currentValue == "string") {
            arrChildren[0].currentValue = "";
          } else {
            arrChildren[1].currentValue = "";
          }
        }
      } else if (arrLen == 2 && dom_type.indexOf("date") == 0) {
        for (let k = 0; k < arrLen; k++) {
          arr[k].value = "";
        }
      } else if (arrLen == 1 && dom_type == "text") {
        if (!arr[0].$children) {
          return false;
        }
        let arrChildren = arr[0].$children;
        let arrChildrenLen = arrChildren.length;
        if (arrChildrenLen == 2) {
          if (typeof arrChildren[0].currentValue == "string") {
            arrChildren[0].currentValue = "";
          } else {
            arrChildren[1].currentValue = "";
          }
        } else {
          //最后一个条件
          arr[0].value = "";
        }
      } else if (arrLen == 4) {
        for (let l = 0; l < arrLen; l++) {
          if (l < 2) {
            arr[l].value = false;
          } else {
            arr[l].value = "";
          }
        }
      } else if (dom_type == "fullselect") {
        // arr[0].currentLabels = []
        arr[0].currentValue = [];
        // arr[0].menu.activeValue = []
        // arr[0].menu.value = []
      } else if (dom_type == "select") {
        // arr[0].currentLabels = []
        arr[0].value = "";
        // arr[0].menu.activeValue = []
        // arr[0].menu.value = []
      } else {
        //第二个参数
        console.log("第二个参数:", arr);
        arr[0].value = "";
      }
      // console.log(arr)
    }
  };
  // 清除指定左侧框显示内容
  Vue.prototype.vueClearTheLeft = function (option) {
    let _that = this;
    let dom = _that.$refs.ileft;

    // 删除input用户感知数据
    for (let i = 0; i < $("input").length; i++) {
      let dname = $("input").eq(i);
      if (dname.attr("data-name") == option) {
        dname.val("");
      }
    }
    // console.log("单一项目：", option)
    for (let i = 0; i < dom.length; i++) {
      let theDom = dom[i].$children[0];
      let arr = theDom.$children;
      let arrLen = arr.length;
      let dom_name = theDom.item.name ? theDom.item.name : "";
      let dom_type = theDom.item.type ? theDom.item.type : "";

      if (option.indexOf(dom_name) === 0) {
        if (arrLen == 2 && dom_type == "text") {
          // 逻辑
          theDom.item.value = "";
          // 视觉
          arr[0].model = false;
          arr[1].currentValue = "";
        } else if (arrLen == 2 && dom_type.indexOf("date") == 0) {
          for (let k = 0; k < arrLen; k++) {
            arr[k].value = "";
          }
        } else if (arrLen == 1 && dom_type == "text") {
          if (!arr[0].$children) {
            return false;
          }

          let arrChildren = arr[0].$children;
          let arrChildrenLen = arrChildren.length;

          if (arrChildrenLen == 2) {
            if (typeof arrChildren[0].currentValue == "string") {
              arrChildren[0].currentValue = "";
            } else {
              arrChildren[1].currentValue = "";
            }
          } else {
            //第二个参数
            // console.log(arr)
            arr[0] = [];
          }
        } else if (arrLen == 4) {
          for (let l = 0; l < arrLen; l++) {
            if (l < 2) {
              arr[l].value = false;
            } else {
              arr[l].value = "";
            }
          }
        } else if (dom_type == "fullselect") {
          // arr[0].currentLabels = []
          arr[0].currentValue = [];
          // arr[0].menu.activeValue = []
          // arr[0].menu.value = []
        } else if (dom_type == "select") {
          // arr[0].currentLabels = []
          arr[0].value = "";
          // arr[0].menu.activeValue = []
          // arr[0].menu.value = []
        }
      }
    }
  };
  Vue.prototype.vueExtendTo = function (str) {
    let hrefArr = str.split("?");
    let routePath = hrefArr[0];
    let paramStr = hrefArr[1];
    let pathname = this.$route.path;

    window.ga(
      "send",
      "event",
      "button",
      "click",
      pathname.split("/")[1] + "_extend_" + routePath.substr(1)
    );
    window._paq.push([
      "trackEvent",
      "button",
      "cilick",
      pathname.split("/")[1] + "_extend_" + routePath.substr(1)
    ]);
    window.open(
      `${routePath}?fourth_condition=${encodeURIComponent(paramStr)}`,
      "_blank"
    );
  };
  Vue.prototype._paq = window._paq;
  Vue.prototype.vueRouteFrom = function (vuex_name) {
    let api_name =
      this.api_name || vuex_name === "Database" ?
        this.api_name :
        vuex_name.toLocaleLowerCase(); // 高级搜索接口

    let storeState = store.state[vuex_name];
    let path = "";
    let query = {}; //排除ga统计参数
    _.forIn(this.$route.query, (val, key) => {
      if (key.indexOf("ga_")) {
        query[key] = val;
      }
    });
    if (query.searchwords) {
      query.searchwords = unescape(query.searchwords);
    }
    // 初始化调用的普通/高级搜索接口
    window.Axios.all([
      store.dispatch(vuex_name + "/getFiled"),
      window.Axios({
        method: "get",
        url: `/api/config/high`,
        params: {
          dbname: api_name
        }
      })
    ]).then(
      window.Axios.spread((res, hres) => {
        if (hres && hres.data.code == 200 && hres.data.data.high.length) {
          store.commit(`${vuex_name}/advancedFiled`, hres.data.data.high);
          store.commit(`${vuex_name}/match_gaoji`, hres.data.data.high);
        }

        if (Boolean(Object.keys(query).length)) {
          // 关联查询跳转优先使用普通/高级搜索判断
          if (
            query.fourth_condition &&
            Object.keys(Qs.parse(query.fourth_condition)).some(
              d =>
                storeState.match_putong[d.replace("_eq", "")] ||
                (storeState.match_gaoji ?
                  storeState.match_gaoji[d.replace("_eq", "")] :
                  false)
            )
          ) {
            query = Qs.parse(query.fourth_condition);
            if (!localStorage.getItem("showSearchGuide")) {
              Store.commit("Search/showSearchGuide", true);
            }
          }

          let queryPush = [];
          let gaojiPush = [];
          let groupsPush = {};
          let hotPush = {};
          let fourthParams = [];
          // 路由参数区分是否同时存在普通和高级字段查询 有数据库无storeState.match_gaoji
          let flag = Object.keys(query)
            .filter(
              d =>
                storeState.match_putong[d.replace("_eq", "")] ||
                (storeState.match_gaoji ?
                  storeState.match_gaoji[d.replace("_eq", "")] :
                  false)
            )
            .every(v =>
              Object.keys(storeState.match_putong).some(
                v1 => v.replace("_eq", "") === v1
              )
            ) ?
            true :
            false;

          for (let key in query) {
            if (key === "saved_condition") {
              // 个人中心搜索记录跳转
              this.handleSearch(query[key], vuex_name, storeState);
              return; // 返回执行函数的搜索
            } else if (key === "filter_condition") {
              // 条件筛选
              groupsPush = JSON.parse(query[key]);
              // console.log(groupsPush);
              // let shaixuan = storeState.match_shaixuan_values;
              // for (let key in groupsPush) {
              //   shaixuan[key] = shaixuan[key] ? shaixuan[key] : {};
              //   groupsPush[key].map(v => {
              //     shaixuan[key][v] = v
              //   })
              // }
              // console.log(shaixuan);
              // store.commit(vuex_name + "/match_shaixuan_values",
              //   _.assign({}, storeState.match_shaixuan_values, shaixuan)
              // );
            } else if (key === "hot_condition") {
              // 热点搜索
              hotPush = JSON.parse(query[key]);
            } else if (key === "tabName") {
              //多种浏览方式的配置name
              Store.commit(vuex_name + "/tabname", query[key]);
              path = "/api/" + api_name + "/" + query[key];
            } else if (key === "searchwords" || key === "comprehensive") {
              // 综合搜索结果跳转
              queryPush.push({
                accurate: false,
                name: key,
                value: query[key]
              });
              if (!localStorage.getItem("showSearchGuide")) {
                Store.commit("Search/showSearchGuide", true);
              }
            } else if (key === "fourth_condition") {
              //关联查询跳转
              let paramObj = Qs.parse(query[key]);
              for (let fourth_key in paramObj) {
                fourthParams.push({
                  accurate: false,
                  logic: "_and",
                  name: fourth_key,
                  value: paramObj[fourth_key]
                });
              }
              if (!localStorage.getItem("showSearchGuide")) {
                Store.commit("Search/showSearchGuide", true);
              }
            } else if (key === 'globalapprovalSource') {
              // 全球上市条件筛选国家和地区特殊处理
              Store.commit(vuex_name + "/filtersSource", JSON.parse(query[key]))
            } else if (key === 'conditions2') {
              // 全球临床试验传参特殊处理
              console.log(query[key]);
              Store.commit(vuex_name + "/queryData", {
                'conditions2': query[key]
              })
            } else if (key === 'interventions2') {
              // 全球临床试验传参特殊处理
              console.log(query[key]);
              Store.commit(vuex_name + "/queryData", {
                'interventions2': query[key]
              })
            } else if (key === 'sponsor2') {
              // 全球临床试验传参特殊处理
              console.log(query[key]);
              Store.commit(vuex_name + "/queryData", {
                'sponsor2': query[key]
              })
            } else {
              // 普通/高级查询
              // 过滤路由参数普通查询undefined match_gaoji match_putong
              if (
                !storeState.match_putong[key.replace("_eq", "")] &&
                !(storeState.match_gaoji ?
                  storeState.match_gaoji[key.replace("_eq", "")] :
                  false)
              ) {
                continue;
              }

              if (flag) {
                queryPush.push({
                  name: key.replace("_eq", ""),
                  value: query[key],
                  accurate: key.includes("_eq") &&
                    Boolean(
                      storeState.nomal_filed.find(
                        v => v.name === key.replace("_eq", "")
                      ).accurate
                    )
                });
              } else {
                gaojiPush.push({
                  accurate: key.includes("_eq") &&
                    Boolean(
                      storeState.advanced_filed.find(
                        v => v.name === key.replace("_eq", "")
                      ).accurate
                    ),
                  logic: "_and",
                  name: key.replace("_eq", ""),
                  value: storeState.advanced_filed.find(
                    v => v.name === key.replace("_eq", "")
                  ).type === "select" ?
                    query[key].split(",") :
                    query[key]
                });
              }
            }
          }

          store.commit(vuex_name + "/query", queryPush);
          store.commit(vuex_name + "/queryStr", JSON.stringify(queryPush));
          store.commit(vuex_name + "/conditions", gaojiPush);
          store.commit(vuex_name + "/groups", groupsPush);


          store.commit(vuex_name + "/hot_checked", hotPush);
          store.commit(vuex_name + "/fourth", fourthParams);
          store.commit(vuex_name + "/fourth_checked", fourthParams);
        }
        // 政策法规首页不调用列表的接口
        if (this.$route.path.indexOf('/policies/home') > -1) return
        console.log(this.$route.path);
        if (this.$route.path.indexOf('analy') > -1 && vuex_name !== 'Yaopinxiaoshou') return
        store.dispatch(vuex_name + "/nomalSearch", {
          path: path,
          queryToPutong: true
        });
      })
    );
  };

  // 全球药物
  Vue.prototype.vueRouteFromGlobaldrugs = function (vuex_name) {
    console.log(1);
    let api_name =
      this.api_name || vuex_name === "Database" ?
        this.api_name :
        vuex_name.toLocaleLowerCase(); // 高级搜索接口

    let storeState = store.state[vuex_name];
    let path = "";
    let query = {}; //排除ga统计参数
    _.forIn(this.$route.query, (val, key) => {
      if (key.indexOf("ga_")) {
        query[key] = val;
      }
    });
    if (query.searchwords) {
      query.searchwords = unescape(query.searchwords);
    }
    // 初始化调用的普通/高级搜索接口
    window.Axios.all([
      store.dispatch(vuex_name + "/getFiled"),
      window.Axios({
        method: "get",
        url: `/api/config/high`,
        params: {
          dbname: api_name
        }
      })
    ]).then(
      window.Axios.spread((res, hres) => {
        if (hres && hres.data.code == 200 && hres.data.data.high.length) {
          store.commit(`${vuex_name}/advancedFiledAnaly`, hres.data.data.high);
          store.commit(`${vuex_name}/match_gaojiAnaly`, hres.data.data.high);
        }

        console.log(query);

        if (Boolean(Object.keys(query).length)) {
          // 关联查询跳转优先使用普通/高级搜索判断
          if (
            query.fourth_condition &&
            Object.keys(Qs.parse(query.fourth_condition)).some(
              d =>
                storeState.match_putongAnaly[d.replace("_eq", "")] ||
                (storeState.match_gaojiAnaly ?
                  storeState.match_gaojiAnaly[d.replace("_eq", "")] :
                  false)
            )
          ) {
            query = Qs.parse(query.fourth_condition);
            if (!localStorage.getItem("showSearchGuide")) {
              Store.commit("Search/showSearchGuide", true);
            }
          }

          let queryPush = [];
          let gaojiPush = [];
          let groupsPush = {};
          let hotPush = {};
          let fourthParams = [];

          // 路由参数区分是否同时存在普通和高级字段查询 有数据库无storeState.match_gaoji
          let flag = Object.keys(query)
            .filter(
              d =>
                storeState.match_putongAnaly[d.replace("_eq", "")] ||
                (storeState.match_gaojiAnaly ?
                  storeState.match_gaojiAnaly[d.replace("_eq", "")] :
                  false)
            )
            .every(v =>
              Object.keys(storeState.match_putongAnaly).some(
                v1 => v.replace("_eq", "") === v1
              )
            ) ?
            true :
            false;

          for (let key in query) {
            if (key === "saved_condition") {
              // 个人中心搜索记录跳转
              this.handleSearchGlobaldrugs(query[key], vuex_name, storeState);
              return; // 返回执行函数的搜索
            } else if (key === "filter_condition") {
              // 条件筛选
              groupsPush = JSON.parse(query[key]);
              console.log(groupsPush);
              let shaixuan = storeState.match_shaixuan_valuesAnaly;
              for (let key in groupsPush) {
                shaixuan[key] = shaixuan[key] ? shaixuan[key] : {};
                groupsPush[key].map(v => {
                  shaixuan[key][v] = v
                })
              }
              console.log(shaixuan);
              store.commit(vuex_name + "/match_shaixuan_valuesAnaly",
                _.assign({}, storeState.match_shaixuan_valuesAnaly, shaixuan)
              );
            } else if (key === "hot_condition") {
              // 热点搜索
              hotPush = JSON.parse(query[key]);
            } else if (key === "tabName") {
              //多种浏览方式的配置name
              Store.commit(vuex_name + "/tabname", query[key]);
              path = "/api/" + api_name + "/" + query[key];
            } else if (key === "searchwords" || key === "comprehensive") {
              // 综合搜索结果跳转
              queryPush.push({
                accurate: false,
                name: key,
                value: query[key]
              });
              if (!localStorage.getItem("showSearchGuide")) {
                Store.commit("Search/showSearchGuide", true);
              }
            } else if (key === "fourth_condition") {
              //关联查询跳转
              let paramObj = Qs.parse(query[key]);
              for (let fourth_key in paramObj) {
                fourthParams.push({
                  accurate: false,
                  logic: "_and",
                  name: fourth_key,
                  value: paramObj[fourth_key]
                });
              }
              if (!localStorage.getItem("showSearchGuide")) {
                Store.commit("Search/showSearchGuide", true);
              }
            } else if (key === 'globalapprovalSource') {
              // 全球上市条件筛选国家和地区特殊处理
              Store.commit(vuex_name + "/filtersSource", JSON.parse(query[key]))
            } else if (key === 'conditions2') {
              // 全球临床试验传参特殊处理
              console.log(query[key]);
              Store.commit(vuex_name + "/queryData", {
                'conditions2': query[key]
              })
            } else if (key === 'interventions2') {
              // 全球临床试验传参特殊处理
              console.log(query[key]);
              Store.commit(vuex_name + "/queryData", {
                'interventions2': query[key]
              })
            } else if (key === 'sponsor2') {
              // 全球临床试验传参特殊处理
              console.log(query[key]);
              Store.commit(vuex_name + "/queryData", {
                'sponsor2': query[key]
              })
            } else {
              // 普通/高级查询
              // 过滤路由参数普通查询undefined match_gaoji match_putong
              if (
                !storeState.match_putongAnaly[key.replace("_eq", "")] &&
                !(storeState.match_gaojiAnaly ?
                  storeState.match_gaojiAnaly[key.replace("_eq", "")] :
                  false)
              ) {
                continue;
              }

              if (flag) {
                queryPush.push({
                  name: key.replace("_eq", ""),
                  value: query[key],
                  accurate: key.includes("_eq") &&
                    Boolean(
                      storeState.nomal_filedAnaly.find(
                        v => v.name === key.replace("_eq", "")
                      ).accurate
                    )
                });
              } else {
                gaojiPush.push({
                  accurate: key.includes("_eq") &&
                    Boolean(
                      storeState.advanced_filedAnaly.find(
                        v => v.name === key.replace("_eq", "")
                      ).accurate
                    ),
                  logic: "_and",
                  name: key.replace("_eq", ""),
                  value: storeState.advanced_filedAnaly.find(
                    v => v.name === key.replace("_eq", "")
                  ).type === "select" ?
                    query[key].split(",") :
                    query[key]
                });
              }
            }
          }
          store.commit(vuex_name + "/queryAnaly", queryPush);
          store.commit(vuex_name + "/queryStrAnaly", JSON.stringify(queryPush));
          store.commit(vuex_name + "/conditionsAnaly", gaojiPush);
          store.commit(vuex_name + "/groupsAnaly", groupsPush);
          console.log(queryPush);
        }
        // if (this.$route.path.indexOf('analysis') > -1 && vuex_name !== 'Yaopinxiaoshou') return;

        store.dispatch(vuex_name + "/getKshRes", {
          path: path,
          queryToPutong: true
        });
      })
    )
  };

  // 投融资
  Vue.prototype.vueRouteFromTrz = function (vuex_name) {
    let api_name =
      this.api_name || vuex_name === "Database" ?
        this.api_name :
        vuex_name.toLocaleLowerCase(); // 高级搜索接口

    let storeState = store.state[vuex_name];
    let path = "";
    let query = {}; //排除ga统计参数
    _.forIn(this.$route.query, (val, key) => {
      if (key.indexOf("ga_")) {
        query[key] = val;
      }
    });
    if (query.searchwords) {
      query.searchwords = unescape(query.searchwords);
    }
    store.dispatch(vuex_name + "/getFiled");
    if (Boolean(Object.keys(query).length)) {
      // 关联查询跳转优先使用普通/高级搜索判断
      if (
        query.fourth_condition &&
        Object.keys(Qs.parse(query.fourth_condition)).some(
          d =>
            storeState.match_putong[d.replace("_eq", "")] ||
            (storeState.match_gaoji ?
              storeState.match_gaoji[d.replace("_eq", "")] :
              false)
        )
      ) {
        query = Qs.parse(query.fourth_condition);
      }

      let queryPush = [];
      let gaojiPush = [];
      let groupsPush = {};
      let hotPush = {};
      let fourthParams = [];
      // 路由参数区分是否同时存在普通和高级字段查询 有数据库无storeState.match_gaoji
      let flag = Object.keys(query)
        .filter(
          d =>
            storeState.match_putong[d.replace("_eq", "")] ||
            (storeState.match_gaoji ?
              storeState.match_gaoji[d.replace("_eq", "")] :
              false)
        )
        .every(v =>
          Object.keys(storeState.match_putong).some(
            v1 => v.replace("_eq", "") === v1
          )
        ) ?
        true :
        false;

      for (let key in query) {
        if (key === "saved_condition") {
          // 个人中心搜索记录跳转
          this.handleSearch(query[key], vuex_name, storeState);
          return; // 返回执行函数的搜索
        } else if (key === "filter_condition") {
          // 条件筛选
          groupsPush = JSON.parse(query[key]);
        } else if (key === "hot_condition") {
          // 热点搜索
          hotPush = JSON.parse(query[key]);
        } else if (key === "tabName") {
          //多种浏览方式的配置name
          Store.commit(vuex_name + "/tabname", query[key]);
          path = "/api/" + api_name + "/" + query[key];
        } else if (key === "searchwords" || key === "comprehensive") {
          // 综合搜索结果跳转
          queryPush.push({
            accurate: false,
            name: key,
            value: query[key]
          });
        } else if (key === "fourth_condition") {
          //关联查询跳转
          let paramObj = Qs.parse(query[key]);
          for (let fourth_key in paramObj) {
            fourthParams.push({
              accurate: false,
              logic: "_and",
              name: fourth_key,
              value: paramObj[fourth_key]
            });
          }
        } else {
          // 普通/高级查询
          // 过滤路由参数普通查询undefined match_gaoji match_putong
          if (
            !storeState.match_putong[key.replace("_eq", "")] &&
            !(storeState.match_gaoji ?
              storeState.match_gaoji[key.replace("_eq", "")] :
              false)
          ) {
            continue;
          }

          if (flag) {
            queryPush.push({
              name: key.replace("_eq", ""),
              value: query[key],
              accurate: key.includes("_eq") &&
                Boolean(
                  storeState.nomal_filed.find(
                    v => v.name === key.replace("_eq", "")
                  ).accurate
                )
            });
          } else {
            gaojiPush.push({
              accurate: key.includes("_eq") &&
                Boolean(
                  storeState.advanced_filed.find(
                    v => v.name === key.replace("_eq", "")
                  ).accurate
                ),
              logic: "_and",
              name: key.replace("_eq", ""),
              value: storeState.advanced_filed.find(
                v => v.name === key.replace("_eq", "")
              ).type === "select" ?
                query[key].split(",") :
                query[key]
            });
          }
        }
      }

      store.commit(vuex_name + "/query", queryPush);
      store.commit(vuex_name + "/queryStr", JSON.stringify(queryPush));
      store.commit(vuex_name + "/conditions", gaojiPush);
      store.commit(vuex_name + "/groups", groupsPush);
      store.commit(vuex_name + "/hot_checked", hotPush);
      store.commit(vuex_name + "/fourth", fourthParams);
      store.commit(vuex_name + "/fourth_checked", fourthParams);
    }
    store.dispatch(vuex_name + "/nomalSearch", {
      path: path,
      queryToPutong: true
    });
  };
  // 点击保存的条件搜索/点击个人中心搜索记录搜索
  Vue.prototype.handleSearch = function (option, vuex_name, storeState) {
    let keyword = option ? option : "";
    let obj_keyword = Qs.parse(decodeURIComponent(keyword), {
      decoder: str => str
    });
    console.log(obj_keyword);
    let obj_putong = _.omit(
      obj_keyword,
      "words",
      "filter_condition",
      "hot_condition",
      "fourth_condition",
      "searchname_zh",
      "searchnormal_zh",
      "searchhot_zh",
      "searchfilter_zh",
      "searchwords_zh",
      "atcs_sel"
    );
    let obj_gaoji = _.pick(obj_keyword, "words", "atcs_sel");
    let obj_hots = _.pick(obj_keyword, "hot_condition");
    let obj_fourth = _.pick(obj_keyword, "fourth_condition");
    let obj_shaixuan = _.pick(obj_keyword, "filter_condition");
    let searchParams = _.pick(
      obj_keyword,
      "searchname_zh",
      "searchnormal_zh",
      "searchhot_zh",
      "searchfilter_zh",
      "searchwords_zh"
    );
    searchParams = _.mapValues(searchParams, value => {
      return value || null;
    });
    store.commit(vuex_name + "/query", []);
    store.commit(vuex_name + "/queryStr", "");
    // 因为高级搜索和普通搜索互斥 所以我们先处理普通搜索
    if (_.keys(obj_putong).length > 0) {
      // 处理普通搜索
      let nomal_filed = storeState.nomal_filed;
      let arr_query = [];
      _.map(obj_putong, (value, key) => {
        let accurate = String(key).indexOf("_eq") != -1;
        let name = _.replace(key, "_eq", "");
        let findObj = nomal_filed ? _.find(nomal_filed, {
          name: name
        }) : {};
        let obj = {
          name: name,
          accurate: accurate,
          value: value,
          label: findObj ? findObj.label : null,
          type: findObj ? findObj.type : null
        };
        if (key === "atc") {
          let show = [];
          if (value.length === 1) {
            show = [value.substring(0, 1)];
          }
          if (value.length === 3) {
            show = [value.substring(0, 1), value.substring(0, 3)];
          }
          if (value.length === 4) {
            show = [
              value.substring(0, 1),
              value.substring(0, 3),
              value.substring(0, 4)
            ];
          }
          if (value.length === 5) {
            show = [
              value.substring(0, 1),
              value.substring(0, 3),
              value.substring(0, 4),
              value.substring(0, 5)
            ];
          }
          obj.show = show;
          if (obj_keyword.atcs_sel) {
            obj.atcs_sel = obj_keyword.atcs_sel;
          }
        }
        arr_query.push(obj);
      });
      storeState.query = arr_query;
      storeState.queryStr = JSON.stringify(arr_query);
      store.commit(vuex_name + "/putong", arr_query);
    } else {
      storeState.putong = {};
      storeState.query = [];
    }

    if (_.keys(obj_shaixuan).length > 0 && obj_shaixuan.filter_condition) {
      // 处理筛选条件
      let obj_filter = {};
      let arr_shaixuan = obj_shaixuan.filter_condition && _.split(obj_shaixuan.filter_condition, " _and ");
      console.log(arr_shaixuan);
      // 因为注册库百办理状态是由两个字段组成，传参跟其他条件筛选存在差异，所以这里需要单独做操作。
      let zhuangtaiStr = ''
      let zhuangtaiObj = {}
      let zhuangtaiArr = []
      arr_shaixuan.map(v => {
        if (v.indexOf('zhuangtaiStr=') > -1) {
          v = v.replace('zhuangtaiStr=', '')
          zhuangtaiStr = v.split(';')
          zhuangtaiStr.map(b => {
            b = b.split(':')
            b[1].split('ღ').map(c => {
              zhuangtaiObj = {}
              zhuangtaiObj.key = c
              zhuangtaiObj.label = c
              zhuangtaiObj.param = b[0]
              zhuangtaiArr.push(zhuangtaiObj)
            })
          })
        }
      })
      zhuangtaiArr.length > 0 && Store.commit(vuex_name + "/shaixuanNodes", zhuangtaiArr)

      // 注册库特殊处理结束

      _.map(arr_shaixuan, item => {
        // 因为注册库百办理状态是由两个字段组成，传参跟其他条件筛选存在差异，所以这里需要单独做操作。
        if (item.indexOf('zhuangtaiStr=zhuangtai:') > -1) {
          item = item.replace('zhuangtaiStr=zhuangtai:', 'zhuangtai=')
        }

        if (item.indexOf(';guifanzhuangtaizhongwen:') > -1) {
          item = item.replace(';guifanzhuangtaizhongwen:', 'ღ')
        }

        if (item.indexOf('zhuangtaiStr=guifanzhuangtaizhongwen:') > -1) {
          item = item.replace('zhuangtaiStr=guifanzhuangtaizhongwen:', 'zhuangtai=')
        }
        // 结束
        console.log(item);
        item = item.split("=");
        let name = item[0];
        let val = item[1];
        let arr_value = val.split("ღ");
        _.set(obj_filter, name, arr_value);
      });
      storeState.groups = obj_filter;
      console.log(storeState.groups);
      console.log(obj_filter);
      store.commit(vuex_name + "/shaixuan", obj_filter);
    } else {
      storeState.groups = {};
      storeState.shaixuan = {};
    }

    if (_.keys(obj_hots).length > 0) {
      // 处理热门搜索
      let hot_obj = {};
      let arr_hots = _.split(obj_hots.hot_condition, " _and ");
      _.map(arr_hots, item => {
        item = item.split("=");
        let name = item[0];
        let val = item[1];
        let arr_value = val.split("ღ");
        _.set(hot_obj, name, arr_value);
      });
      storeState.hot_checked = hot_obj;
    } else {
      storeState.hot_checked = {};
      storeState.hot = {};
    }

    if (_.keys(obj_fourth).length > 0) {
      // 处理关联查询
      let guanlian = " " + obj_fourth.fourth_condition;
      let guanlian_arr = guanlian.split(" _");
      guanlian_arr.splice(0, 1);

      let conditions_arr = [];
      for (let item of guanlian_arr) {
        let ilogic = "_and";
        if (item.indexOf("and") === 0) {
          ilogic = "_and";
          item = _.replace(item, "and ", "");
        } else if (item.indexOf("or") === 0) {
          ilogic = "_or";
          item = _.replace(item, "or ", "");
        } else if (item.indexOf("not") === 0) {
          ilogic = "_not";
          item = _.replace(item, "not ", "");
        }

        let iname = item.split("=")[0];
        let ivalue = item.split("=")[1];
        conditions_arr.push({
          logic: ilogic,
          name: iname,
          value: ivalue
        });
      }
      storeState.fourth_checked = conditions_arr;
      store.commit(vuex_name + "/fourth", conditions_arr);
    } else {
      storeState.fourth_checked = [];
      storeState.fourth = [];
    }

    if (_.keys(obj_gaoji).length > 0) {
      // 处理高级搜索
      let igaoji = " " + obj_gaoji.words;
      let gaoji_arr = igaoji.split(" _");
      gaoji_arr.splice(0, 1);
      let conditions_arr = [];
      for (let item of gaoji_arr) {
        let iaccurate = false;
        let ilogic = "_and";
        if (item.indexOf("and") === 0) {
          ilogic = "_and";
          item = _.replace(item, "and ", "");
        } else if (item.indexOf("or") === 0) {
          ilogic = "_or";
          item = _.replace(item, "or ", "");
        } else if (item.indexOf("not") === 0) {
          ilogic = "_not";
          item = _.replace(item, "not ", "");
        }

        let iname = item.split("=")[0];
        let ivalue = item.split("=")[1];
        for (let ad_option of storeState.advanced_filed) {
          let iname_no_eq = _.replace(iname, "_eq", "");
          if (iname_no_eq == ad_option.name) {
            if (ad_option.type == "select") {
              let ivalue_arr = ivalue.split("ღ");
              conditions_arr.push({
                accurate: iname.indexOf("_eq") !== -1 ? true : false,
                logic: ilogic,
                name: iname_no_eq,
                value: ivalue_arr,
                type: ad_option.type,
                label: ad_option.label
              });
            } else if (ad_option.type == "fullselect") {
              let show = [];
              if (ivalue.length === 1) {
                show = [ivalue.substring(0, 1)];
              }
              if (ivalue.length === 3) {
                show = [ivalue.substring(0, 1), ivalue.substring(0, 3)];
              }
              if (ivalue.length === 4) {
                show = [
                  ivalue.substring(0, 1),
                  ivalue.substring(0, 3),
                  ivalue.substring(0, 4)
                ];
              }
              if (ivalue.length === 5) {
                show = [
                  ivalue.substring(0, 1),
                  ivalue.substring(0, 3),
                  ivalue.substring(0, 4),
                  ivalue.substring(0, 5)
                ];
              }
              if (iname_no_eq === "mulu_high") {
                show = ivalue.split("⊙");
              }
              conditions_arr.push({
                accurate: iname.indexOf("_eq") !== -1 ? true : false,
                logic: ilogic,
                name: iname_no_eq,
                value: ivalue,
                show: show,
                type: ad_option.type,
                label: ad_option.label,
                atcs_sel: obj_gaoji.atcs_sel
              });
            } else {
              conditions_arr.push({
                accurate: iname.indexOf("_eq") !== -1 ? true : false,
                logic: ilogic,
                name: iname_no_eq,
                value: ivalue,
                type: ad_option.type,
                label: ad_option.label
              });
            }
          }
        }
      }
      storeState.conditions = conditions_arr;
      store.commit(vuex_name + "/gaoji", conditions_arr);
    } else {
      storeState.conditions = [];
    }
    let isSearch = Object.keys(searchParams).length > 0;
    let isAnaly = this.$route.path.indexOf("/analy") > -1;
    let isAnalyAmount = this.$route.path.indexOf("/analy_amount") > -1;
    if (vuex_name == 'Yyxs') {
      // 医院销售这里单独处理
      Store.dispatch(vuex_name + "/getKshRes",
        isAnalyAmount ? 2 : 1
      );
    } else if (vuex_name == 'Zhuce') {
      let isAnalyBreed = this.$route.path.indexOf("zhuce/analy_breed") > -1;
      if (vuex_name == 'Zhuce') {
        if (isAnalyBreed) {
          Store.dispatch(vuex_name + "/getKshRes_Breed");
        } else if (isAnaly) {
          Store.dispatch(vuex_name + "/getKshRes");
        } else {
          Store.dispatch(vuex_name + "/nomalSearch");
        }
      }
    } else {
      Store.dispatch(vuex_name + (isAnaly ? "/getKshRes" : "/nomalSearch"), {
        queryToPutong: true,
        params: isSearch ? searchParams : null,
        searchParams: isSearch
      });
    }
  };
  // 点击保存的条件搜索/点击个人中心搜索记录搜索
  Vue.prototype.handleSearchGlobaldrugs = function (option, vuex_name, storeState) {
    let keyword = option ? option : "";
    let obj_keyword = Qs.parse(decodeURIComponent(keyword), {
      decoder: str => str
    });
    console.log(obj_keyword);
    let obj_putong = _.omit(
      obj_keyword,
      "words",
      "filter_condition",
      "hot_condition",
      "fourth_condition",
      "searchname_zh",
      "searchnormal_zh",
      "searchhot_zh",
      "searchfilter_zh",
      "searchwords_zh",
      "atcs_sel"
    );
    let obj_gaoji = _.pick(obj_keyword, "words", "atcs_sel");
    let obj_hots = _.pick(obj_keyword, "hot_condition");
    let obj_fourth = _.pick(obj_keyword, "fourth_condition");
    let obj_shaixuan = _.pick(obj_keyword, "filter_condition");
    let searchParams = _.pick(
      obj_keyword,
      "searchname_zh",
      "searchnormal_zh",
      "searchhot_zh",
      "searchfilter_zh",
      "searchwords_zh"
    );
    searchParams = _.mapValues(searchParams, value => {
      return value || null;
    });
    store.commit(vuex_name + "/queryAnaly", []);
    store.commit(vuex_name + "/queryStrAnaly", "");
    // 因为高级搜索和普通搜索互斥 所以我们先处理普通搜索
    if (_.keys(obj_putong).length > 0) {
      // 处理普通搜索
      let nomal_filed = storeState.nomal_filedAnaly;
      let arr_query = [];
      _.map(obj_putong, (value, key) => {
        let accurate = String(key).indexOf("_eq") != -1;
        let name = _.replace(key, "_eq", "");
        let findObj = nomal_filed ? _.find(nomal_filed, {
          name: name
        }) : {};
        let obj = {
          name: name,
          accurate: accurate,
          value: value,
          label: findObj ? findObj.label : null,
          type: findObj ? findObj.type : null
        };
        if (key === "atc") {
          let show = [];
          if (value.length === 1) {
            show = [value.substring(0, 1)];
          }
          if (value.length === 3) {
            show = [value.substring(0, 1), value.substring(0, 3)];
          }
          if (value.length === 4) {
            show = [
              value.substring(0, 1),
              value.substring(0, 3),
              value.substring(0, 4)
            ];
          }
          if (value.length === 5) {
            show = [
              value.substring(0, 1),
              value.substring(0, 3),
              value.substring(0, 4),
              value.substring(0, 5)
            ];
          }
          obj.show = show;
          if (obj_keyword.atcs_sel) {
            obj.atcs_sel = obj_keyword.atcs_sel;
          }
        }
        arr_query.push(obj);
      });
      storeState.queryAnaly = arr_query;
      storeState.queryStrAnaly = JSON.stringify(arr_query);
      store.commit(vuex_name + "/putongAnaly", arr_query);
    } else {
      storeState.putongAnaly = {};
      storeState.queryAnaly = [];
    }

    if (_.keys(obj_shaixuan).length > 0 && obj_shaixuan.filter_condition) {
      // 处理筛选条件
      let obj_filter = {};
      let arr_shaixuan = obj_shaixuan.filter_condition && _.split(obj_shaixuan.filter_condition, " _and ");
      console.log(arr_shaixuan);
      // 因为注册库百办理状态是由两个字段组成，传参跟其他条件筛选存在差异，所以这里需要单独做操作。
      let zhuangtaiStr = ''
      let zhuangtaiObj = {}
      let zhuangtaiArr = []
      arr_shaixuan.map(v => {
        if (v.indexOf('zhuangtaiStr=') > -1) {
          v = v.replace('zhuangtaiStr=', '')
          zhuangtaiStr = v.split(';')
          zhuangtaiStr.map(b => {
            b = b.split(':')
            b[1].split('ღ').map(c => {
              zhuangtaiObj = {}
              zhuangtaiObj.key = c
              zhuangtaiObj.label = c
              zhuangtaiObj.param = b[0]
              zhuangtaiArr.push(zhuangtaiObj)
            })
          })
        }
      })
      zhuangtaiArr.length > 0 && Store.commit(vuex_name + "/shaixuanNodesAnaly", zhuangtaiArr)

      // 注册库特殊处理结束

      _.map(arr_shaixuan, item => {
        // 因为注册库百办理状态是由两个字段组成，传参跟其他条件筛选存在差异，所以这里需要单独做操作。
        if (item.indexOf('zhuangtaiStr=zhuangtai:') > -1) {
          item = item.replace('zhuangtaiStr=zhuangtai:', 'zhuangtai=')
        }

        if (item.indexOf(';guifanzhuangtaizhongwen:') > -1) {
          item = item.replace(';guifanzhuangtaizhongwen:', 'ღ')
        }

        if (item.indexOf('zhuangtaiStr=guifanzhuangtaizhongwen:') > -1) {
          item = item.replace('zhuangtaiStr=guifanzhuangtaizhongwen:', 'zhuangtai=')
        }
        // 结束
        console.log(item);
        item = item.split("=");
        let name = item[0];
        let val = item[1];
        let arr_value = val.split("ღ");
        _.set(obj_filter, name, arr_value);
      });
      storeState.groupsAnaly = obj_filter;
      console.log(storeState.groups);
      console.log(obj_filter);
      store.commit(vuex_name + "/shaixuanAnaly", obj_filter);
    } else {
      storeState.groupsAnaly = {};
      storeState.shaixuanAnaly = {};
    }

    if (_.keys(obj_hots).length > 0) {
      // 处理热门搜索
      let hot_obj = {};
      let arr_hots = _.split(obj_hots.hot_condition, " _and ");
      _.map(arr_hots, item => {
        item = item.split("=");
        let name = item[0];
        let val = item[1];
        let arr_value = val.split("ღ");
        _.set(hot_obj, name, arr_value);
      });
      storeState.hot_checkedAnaly = hot_obj;
    } else {
      storeState.hot_checkedAnaly = {};
      storeState.hotAnaly = {};
    }

    if (_.keys(obj_fourth).length > 0) {
      // 处理关联查询
      let guanlian = " " + obj_fourth.fourth_condition;
      let guanlian_arr = guanlian.split(" _");
      guanlian_arr.splice(0, 1);

      let conditions_arr = [];
      for (let item of guanlian_arr) {
        let ilogic = "_and";
        if (item.indexOf("and") === 0) {
          ilogic = "_and";
          item = _.replace(item, "and ", "");
        } else if (item.indexOf("or") === 0) {
          ilogic = "_or";
          item = _.replace(item, "or ", "");
        } else if (item.indexOf("not") === 0) {
          ilogic = "_not";
          item = _.replace(item, "not ", "");
        }

        let iname = item.split("=")[0];
        let ivalue = item.split("=")[1];
        conditions_arr.push({
          logic: ilogic,
          name: iname,
          value: ivalue
        });
      }
      storeState.fourth_checkedAnaly = conditions_arr;
      store.commit(vuex_name + "/fourthAnaly", conditions_arr);
    } else {
      storeState.fourth_checkedAnaly = [];
      storeState.fourthAnaly = [];
    }

    if (_.keys(obj_gaoji).length > 0) {
      // 处理高级搜索
      let igaoji = " " + obj_gaoji.words;
      let gaoji_arr = igaoji.split(" _");
      gaoji_arr.splice(0, 1);
      let conditions_arr = [];
      for (let item of gaoji_arr) {
        let iaccurate = false;
        let ilogic = "_and";
        if (item.indexOf("and") === 0) {
          ilogic = "_and";
          item = _.replace(item, "and ", "");
        } else if (item.indexOf("or") === 0) {
          ilogic = "_or";
          item = _.replace(item, "or ", "");
        } else if (item.indexOf("not") === 0) {
          ilogic = "_not";
          item = _.replace(item, "not ", "");
        }

        let iname = item.split("=")[0];
        let ivalue = item.split("=")[1];
        for (let ad_option of storeState.advanced_filedAnaly) {
          let iname_no_eq = _.replace(iname, "_eq", "");
          if (iname_no_eq == ad_option.name) {
            if (ad_option.type == "select") {
              let ivalue_arr = ivalue.split("ღ");
              conditions_arr.push({
                accurate: iname.indexOf("_eq") !== -1 ? true : false,
                logic: ilogic,
                name: iname_no_eq,
                value: ivalue_arr,
                type: ad_option.type,
                label: ad_option.label
              });
            } else if (ad_option.type == "fullselect") {
              let show = [];
              if (ivalue.length === 1) {
                show = [ivalue.substring(0, 1)];
              }
              if (ivalue.length === 3) {
                show = [ivalue.substring(0, 1), ivalue.substring(0, 3)];
              }
              if (ivalue.length === 4) {
                show = [
                  ivalue.substring(0, 1),
                  ivalue.substring(0, 3),
                  ivalue.substring(0, 4)
                ];
              }
              if (ivalue.length === 5) {
                show = [
                  ivalue.substring(0, 1),
                  ivalue.substring(0, 3),
                  ivalue.substring(0, 4),
                  ivalue.substring(0, 5)
                ];
              }
              if (iname_no_eq === "mulu_high") {
                show = ivalue.split("⊙");
              }
              conditions_arr.push({
                accurate: iname.indexOf("_eq") !== -1 ? true : false,
                logic: ilogic,
                name: iname_no_eq,
                value: ivalue,
                show: show,
                type: ad_option.type,
                label: ad_option.label,
                atcs_sel: obj_gaoji.atcs_sel
              });
            } else {
              conditions_arr.push({
                accurate: iname.indexOf("_eq") !== -1 ? true : false,
                logic: ilogic,
                name: iname_no_eq,
                value: ivalue,
                type: ad_option.type,
                label: ad_option.label
              });
            }
          }
        }
      }
      storeState.conditionsAnaly = conditions_arr;
      store.commit(vuex_name + "/gaojiAnaly", conditions_arr);
    } else {
      storeState.conditionsAnaly = [];
    }
    let isSearch = Object.keys(searchParams).length > 0;
    let isAnaly = this.$route.path.indexOf("/analy") > -1;
    let isAnalyAmount = this.$route.path.indexOf("/analy_amount") > -1;
    if (vuex_name == 'Yyxs') {
      // 医院销售这里单独处理
      Store.dispatch(vuex_name + "/getKshRes",
        isAnalyAmount ? 2 : 1
      );
    } else if (vuex_name == 'Zhuce') {
      let isAnalyBreed = this.$route.path.indexOf("zhuce/analy_breed") > -1;
      if (vuex_name == 'Zhuce') {
        if (isAnalyBreed) {
          Store.dispatch(vuex_name + "/getKshRes_Breed");
        } else if (isAnaly) {
          Store.dispatch(vuex_name + "/getKshRes");
        } else {
          Store.dispatch(vuex_name + "/nomalSearch");
        }
      }
    } else {
      Store.dispatch(vuex_name + (isAnaly ? "/getKshRes" : "/nomalSearch"), {
        queryToPutong: true,
        params: isSearch ? searchParams : null,
        searchParams: isSearch
      });
    }
  };
  Vue.prototype.vueFormatNumber = function (val) {
    val = parseInt(val);
    return val.toString().replace(/(\d)(?=(\d{3})+$)/g, "$1,");
  };
  Vue.prototype.vueTimestampToTime = function (timestamp) {
    timestamp = parseInt(timestamp);
    let date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000（本项目约定好是10位）
    let Y = date.getFullYear() + "-";
    let M =
      (date.getMonth() + 1 < 10 ?
        "0" + (date.getMonth() + 1) :
        date.getMonth() + 1) + "-";
    let D = date.getDate() + " ";
    // let h = date.getHours() + ':'
    // let m = date.getMinutes() + ':'
    // let s = date.getSeconds()
    return Y + M + D;
  };
  // 提示权限的tooltip在hover时切换
  Vue.prototype.vueTogglePmsTooltip = function () {
    let _that = this;
    _that.$nextTick(() => {
      // 普遍
      // $('.abandon-click-method').hover((event) => {
      //   let wWidth = window.innerWidth
      //   let wHeight = window.innerHeight
      //   if (wWidth - event.clientX > 250) {
      //     $('.cursor-tooltip').css({
      //       'visibility': 'visible',
      //       'top': event.clientY - 20,
      //       'left': event.clientX + 10,
      //     })
      //   } else {
      //     $('.cursor-tooltip').css({
      //       'visibility': 'visible',
      //       'top': event.clientY - 20,
      //       'left': event.clientX - 280,
      //     })
      //   }
      // }, (event) => {
      //   $('.cursor-tooltip').css({
      //     'visibility': 'hidden',
      //   })
      // })
      let abandon = $("body");

      abandon.on("mousemove", ".abandon-click-method", function (e) {
        let wWidth = window.innerWidth;
        let wHeight = window.innerHeight;

        if (wWidth - event.clientX > 250) {
          $(".cursor-tooltip").css({
            visibility: "visible",
            top: event.clientY - 20,
            left: event.clientX + 30
          });
        } else {
          $(".cursor-tooltip").css({
            visibility: "visible",
            top: event.clientY - 20,
            left: event.clientX - 290
          });
        }
      });

      abandon.on("mouseleave", ".abandon-click-method", event => {
        $(".cursor-tooltip").css({
          visibility: "hidden"
        });
      });

      abandon.on("mousemove", ".yyxs-abandon-click-method", function (e) {
        let wWidth = window.innerWidth;
        let wHeight = window.innerHeight;

        if (wWidth - event.clientX > 250) {
          $(".yyxs-cursor-tooltip").css({
            visibility: "visible",
            top: event.clientY - 20,
            left: event.clientX + 30
          });
        } else {
          $(".yyxs-cursor-tooltip").css({
            visibility: "visible",
            top: event.clientY - 20,
            left: event.clientX - 290
          });
        }
      });

      abandon.on("mouseleave", ".yyxs-abandon-click-method", event => {
        $(".yyxs-cursor-tooltip").css({
          visibility: "hidden"
        });
      });
      // tabs
      $(".el-tabs__item.is-disabled").hover(
        event => {
          let wWidth = window.innerWidth;
          let wHeight = window.innerHeight;
          if (wWidth - event.clientX > 250) {
            $(".cursor-tooltip").css({
              visibility: "visible",
              top: event.clientY - 20,
              left: event.clientX + 10
            });
          } else {
            $(".cursor-tooltip").css({
              visibility: "visible",
              top: event.clientY - 20,
              left: event.clientX - 280
            });
          }
        },
        event => {
          $(".cursor-tooltip").css({
            visibility: "hidden"
          });
        }
      );
    });
  };
  // 跳转到无权限全屏页
  Vue.prototype.vueRouteToNoPms = function (checkPms) {
    let _that = this;
    _that.$nextTick(() => {
      if (checkPms) {
        // alert(1)
        // alert(_that.$route.path)
        if (_that.$route.path == "/login") {
          return;
        } else {
          _that.$router.push({
            path: "/no-permission"
          });
        }
      }
    });
  };
  // 检查列表具体项权限
  Vue.prototype.vueCheckListPms = function (vuex_name, label) {
    let _that = this;
    let storeState = store.state[vuex_name];
    let hasPermission = true;
    if (storeState.nopms.list && storeState.nopms.list.length) {
      for (let item of storeState.nopms.list) {
        if (label == item.name) {
          hasPermission = false;
        }
      }
      return hasPermission;
    } else {
      return hasPermission;
    }
  };
  // 检查列表具体项权限
  Vue.prototype.vueCheckDetailPms = function (vuex_name, label) {
    let _that = this;
    let storeState = store.state[vuex_name];
    let hasPermission = true;
    if (storeState.nopms.detail && storeState.nopms.detail.length) {
      for (let item of storeState.nopms.detail) {
        if (label == item.name) {
          hasPermission = false;
        }
      }
      return hasPermission;
    } else {
      return hasPermission;
    }
  };
  (Vue.prototype.deletewwwLoginVal = function () {
    //删除www。yaozh.com/login登录后cookie存的值
    this.vueDelCookie("yaozh_logintime", ".yaozh.com"); //删除老版登录
    // this.vueDelCookie('yaozh_user','.yaozh.com')//删除老版登录
    // this.vueDelCookie('yaozh_userId','.yaozh.com')//删除老版登录
  }),
    // 清除用户的accesstoken并返回登录页
    (Vue.prototype.vueBackToLogin = function (flag) {
      let _that = this;
      this.vueDelCookie("accesstoken");
      this.vueDelCookie("userPicture");
      this.vueDelCookie("userName");
      this.vueDelCookie("openPath");

      this.deletewwwLoginVal();
      // 清除store中的状态
      store.commit("UserCenter/accesstoken", "");
      store.commit("UserCenter/userName", "");
      store.commit("UserCenter/uid", "");

      //判断是否登录
      sessionStorage.setItem("isLogin", 0);
      if (!flag) {
        _that.$router.push({
          path: "/login"
        });
      }
    });
  Vue.prototype.vueFormulationsFormatter = function (value) {
    let val = value;
    return typeof val == "string" ? val.replace(/\d+/g, "<sub>$&</sub>") : "";
  };

  //字符串超过length的长度用type代替
  Vue.prototype.overflowEclips = function (value, length, type) {
    if (typeof value == "string" && length) {
      let len = Number(length);
      if (value.length > len) {
        return value.slice(0, len) + (type || "...");
      } else {
        return value;
      }
    } else {
      return value;
    }
  };

  //获取最近n天日期
  Vue.prototype.vueGetDate = function (day) {
    var today = new Date();
    var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;
    today.setTime(targetday_milliseconds);
    var tYear = today.getFullYear();
    var tMonth = today.getMonth();
    var tDate = today.getDate();
    this.doHandleMonth = function (month) {
      var m = month;
      if (month.toString().length == 1) {
        m = "0" + month;
      }
      return m;
    };
    tMonth = this.doHandleMonth(tMonth + 1);
    tDate = this.doHandleMonth(tDate);
    return tYear.toString() + tMonth.toString() + tDate.toString();
  };

  //echart横纵坐标单位转换
  Vue.prototype.echartsUnitTransform = function (value) {
    if (value >= 1000 && value < 1000000) {
      return value / 1000 + "K";
    } else if (value >= 1000000) {
      return value / 1000000 + "M";
    } else {
      return value;
    }
  };

  //echart Tooltip位置相对固定在左上方，防止超出可视区域，只针对横向柱状图
  Vue.prototype.echartsTooltipPositionX = (point, params, dom, rect, size) => {
    var x = 0; // x坐标位置
    var y = 0; // y坐标位置
    // 当前鼠标位置
    var pointX = point[0];
    var pointY = point[1];
    // 提示框大小
    var boxWidth = size.contentSize[0];
    var boxHeight = size.contentSize[1];
    // boxWidth > pointX 说明鼠标左边放不下提示框
    if (boxWidth > pointX) {
      x = 5;
    } else {
      // 左边放的下
      x = pointX - boxWidth;
    }
    // boxHeight > pointY 说明鼠标上边放不下提示框
    if (boxHeight > pointY) {
      y = 5;
    } else {
      // 上边放得下
      y = pointY - boxHeight;
    }
    return [x, y];
  };

  //格式化金额（保留两位小数，每3位逗号间隔）
  Vue.prototype.echartsTooltipMoney = (num, isInt) => {
    var isNegative = false;
    if (num < 0) {
      num = Math.abs(num);
      isNegative = true;
    }
    if (isInt && (num == 0 || num == undefined || num == null)) {
      return '-'
    }
    this.echartsToFixed = (num, s) => {
      var times = Math.pow(10, s);
      var des = num * times + 0.5;
      des = parseInt(des, 10) / times;
      return des + "";
    };
    if (num < 1 && num >= 0) {
      num = Number(num).toPrecision(2);
      return isNegative ? `-${num}` : num;
    } else {
      num = this.echartsToFixed(num, 2);
      num = (num + "").replace(/[^0-9+-Ee.]/g, "");
      var n = !isFinite(+num) ? 0 : +num,
        prec = !isFinite(+2) ? 0 : Math.abs(2),
        sep = ",",
        dec = ".",
        s = "",
        s = (prec ? this.echartsToFixed(n, prec) : "" + Math.floor(n)).split(
          "."
        );
      var re = /(-?\d+)(\d{3})/;
      while (re.test(s[0])) {
        s[0] = s[0].replace(re, "$1" + sep + "$2");
      }

      if ((s[1] || "").length < prec) {
        s[1] = s[1] || "";
        s[1] += new Array(prec - s[1].length + 1).join("0");
      }
      var comVal = s.join(dec);
      if (isInt) {
        return (isNegative ? `-${comVal}` : comVal).split('.')[0];
      } else {
        return isNegative ? `-${comVal}` : comVal;
      }
    }
  };

  // 格式化金额(千分位逗号隔开，只操作整数部分)
  function formattedNumber(num) {
    // flag用于判断数字是正数还是负数（true负数）
    let flag = false;
    if (!num) {
      return "";
    }
    if (num < 0) {
      num = Math.abs(num);
      flag = true;
    }
    var num = num.toString();
    let numArry = num.split(".");
    let intPart = Math.trunc(num); // 获取整数部分
    let intPartFormat = intPart
      .toString()
      .replace(/(\d)(?=(?:\d{3})+$)/g, "$1,"); // 将整数部分逢三一断
    var result = "";
    console.log();
    if (numArry[1]) {
      result = intPartFormat + `.${numArry[1]}`;
    } else {
      result = intPartFormat;
    }
    return flag ? `-${result}` : result;
  }

  /**
   * @method 千分位配置方法
   * @param {Array} data: 列表数据源
   * @param {String} vuex_name: 数据库状态管理name
   */
  Vue.prototype.thousandSet = (data, vuex_name) => {
    return new Promise(resolve => {
      console.log(store.state[vuex_name].tableconf);
      let configArr = []; // 用于存储过滤后的tableconf配置数据
      // 过滤tableconf配置数据,只需要千分位配置项的数据源。防止遍历死循环
      store.state[vuex_name].tableconf.forEach(val => {
        if (val.thousands === "1") {
          configArr.push(val);
        }
      });
      // 遍历配置项数据
      configArr.forEach((val, j) => {
        // 遍历列表数据
        data.map((item, i) => {
          // 当列表数据对象的kes值和配置数据项的prop值相等的时候，就需要做千分位的操作
          for (let a in item) {
            if (a == val.field) {
              // 判断是number类型才做转换
              if (!isNaN(item[a])) {
                item[a] = formattedNumber(item[a]);
              }
            }
          }
        });
      });
      resolve(data);
    });
  };

  Vue.prototype.changeTableHeader = (_this, list) => {
    _this.tableHead = list.reduce((res, item) => {
      if (item.checked && !item.hide) {
        res.push(item);
      }
      return res;
    }, []);
    _this.show_table = false;
    setTimeout(() => {
      _this.show_table = true;
    }, 20);
  };
  // 后台控制表格宽度，数据处理函数
  Vue.prototype.tableheaderCombain = (line, local) => {
    let obj = {};
    line.forEach((item, index) => {
      // item.field_width = 100;
      obj[item.field] = item;
    });
    local.forEach((item, index) => {
      let objO = obj[item.prop];
      // 以后要删用来测试
      // if(index == 1 ){
      //   item.field_width = 60;
      // }
      //排序以后台配置为准
      item.sort = false;
      if (objO) {
        if (Number(objO.order)) {
          item.sort = "custom";
          item.order_field = objO.order_field ? objO.order_field : objO.field;
        }

        item.field_width = objO.field_width;
        // Object.assign({},obj[item.prop],item)
        // console.info(item)
      }
    });
    return local;
  };
  /* 修改el内部属性使鼠标移出下拉框隐藏，注意el组件添加对应ref属性 开始 */
  //date组件
  Vue.prototype.datePopMouseleave = _this => {
    $("body").on("mouseleave", ".el-picker-panel", () => {
      _this.$nextTick(() => {
        if (_this.$refs.popoverStart) {
          _this.$refs.popoverStart.pickerVisible = false;
        }
        if (_this.$refs.popoverEnd) {
          _this.$refs.popoverEnd.pickerVisible = false;
        }
      });
    });
  };
  //input组件
  Vue.prototype.inputPopMouseleave = _this => {
    $("body").on("mouseleave", ".el-autocomplete-suggestion", () => {
      _this.$nextTick(() => {
        if (_this.$refs.popoverAutoInput) {
          _this.$refs.popoverAutoInput.activated = false;
          _this.$refs.popoverAutoInput.$refs.input.blur();
        }
      });
    });
  };
  //select组件
  Vue.prototype.selectPopMouseleave = _this => {
    $("body").on("mouseleave", ".el-select-dropdown", () => {
      _this.$nextTick(() => {
        if (_this.$refs.popoverSelect) {
          _this.$refs.popoverSelect.visible = false;
          _this.$refs.popoverSelect.blur();
        }
      });
    });
  };
  //cascader组件
  Vue.prototype.cascaderPopMouseleave = _this => {
    $("body").on("mouseleave", ".el-cascader-menus", () => {
      _this.$nextTick(() => {
        if (_this.$refs.popoverCascader) {
          _this.$refs.popoverCascader.menuVisible = false;
        }
      });
    });
  };
  /* 修改el内部属性使鼠标移出下拉框隐藏 结束 */
  //搜索词统计方法（公共部分改为后台统计，暂勿删）
  Vue.prototype.searchKeywords = (state, Payload) => {
    //搜索框限制长度方法
    if (Payload) {
      return false;
    }
    let obj = {};
    if (state.query) {
      _.forEach(state.query, item => {
        obj[item.accurate ? item.name + "_eq" : item.name] = getValMax(item);
      });
    }
    if (state.gaoji && state.gaoji.words) {
      let gaoji = "";
      _.forEach(state.conditions, item => {
        let type = typeof item.value;
        if (item.value) {
          item.value = item.value.slice(
            0,
            item.accurate ? inpMaxLenJq : inpMaxLen
          );
          gaoji += `${item.logic} ${item.name}${item.accurate ? "_eq" : ""}=${type === "object" ? item.value.join("ღ") : item.value
            } `;
        }
      });
      obj = _.assign(obj, {
        words: gaoji.slice(0, gaoji.length - 1)
      });
    }
    return obj;

    function getValMax(obj) {
      return String(obj.value).slice(0, obj.accurate ? inpMaxLenJq : inpMaxLen);
    }

    function getSearchData(key, query) {
      let keywords = [];
      let obj = {};
      let emptyObj = false;
      query.forEach(item => {
        if (key === "searchnormal_zh" && !item.type) {
          emptyObj = true;
        }
        if (item.value) {
          let value =
            typeof item.value === "string" ?
              item.value.replace("⊙", ">") :
              item.value;

          //处理高级搜索多选数据
          if (key === "searchwords_zh") {
            let wordsObj = _.find(state.advanced_filed, {
              name: item.name
            });
            if (wordsObj.type === "select") {
              value = value.map((item, i) => {
                let selectItem = _.find(wordsObj.value, {
                  value: item
                });
                return selectItem.label;
              });
            }
          }

          if (key === "searchname_zh") {
            keywords.push(
              `${item.name}=${item.label},${value}${additional(item)}`
            );
          } else if (key === "searchhot_zh") {
            keywords.push(`${item.selectLabel || value}`);
          } else {
            if (item.label) {
              keywords.push(
                `${item.label}=${item.selectLabel || value}${additional(item)}`
              );
            }
          }
        }
      });
      obj[key] = keywords.join("$") || null;
      return emptyObj ? {} : obj;
    }

    function getFilterData(obj, allObj) {
      if (allObj && !Object.keys(allObj).length) {
        return [];
      }
      let filterArray = [];
      for (let key in obj) {
        let item = allObj[key];
        let itemChecked = obj[key];
        let varray = [];
        if (itemChecked.length > 0) {
          itemChecked.forEach(items => {
            let _obj = _.find(item.data || item, {
              key: items
            });
            if (_obj) {
              varray.push(_obj.label);
            }
          });
          console.log(state.match_shaixuan);
          filterArray.push({
            label: state.match_shaixuan[key] || "",
            value: varray.join(",")
          });
        }
      }
      return filterArray;
    }

    function additional(item) {
      return `${item.accurate ? "（精确）" : ""}${item.atcs_sel ? "（多分类）" : ""
        }`;
    }
  };
  Vue.prototype.ypxsNuitChange = (nuit, value) => {
    let changBefore = value / nuit;
    return changBefore;
  };
  Vue.prototype.isEqual = isEqual;
  //条件筛选和热点搜索
  Vue.prototype.getSearchParams = (dbname, state, Payload, listType, Param) => {
    // if (router.currentRoute.path == '/globaldrugs/analysis') {
    //   store.commit("Globaldrugs/filtersAnalyLoading", true);
    // }
    let HandleHotList = data => {
      let HotListObj = {};
      let HotListArray = [];
      for (let key in data) {
        for (let i = 0; i < data[key].length; i++) {
          let item = data[key][i];
          item.key = item.key.toString();
          HotListObj[item.param] = [];
          HotListArray.push(item);
        }
      }
      for (let i = 0; i < HotListArray.length; i++) {
        for (let key in HotListObj) {
          if (key === HotListArray[i].param) {
            HotListObj[key].push(HotListArray[i]);
          }
        }
      }
      return HotListObj;
    };
    let params = {};
    let paramsList = ["linchuangshiyan", "yaopinzhongbiao"];
    if (paramsList.indexOf(dbname) > -1) {
      params.list_type = listType || state.state.tabname;
    }

    // 第二次查询走的分支
    if (Param && Param.tabs && state.state.isGetCount) {
      getCount(dbname, state, Payload);
    }

    //本次搜索与上次搜索参数相同不需要更新筛选列表
    if (isEqual(dbname, Payload) && !state.state.refreshFilter) {
      if (router.currentRoute.path === "/globaldrugs/analysis") {
        state.commit("filtersAnalyLoading", false);
      }
      return;
    }
    let pageType = location.pathname.split("/")[2];
    if (state.state.isGetCount && pageType != "analy") {
      if (router.currentRoute.query.ylbm) {
        router.currentRoute.query.ylbm.replace("_eq", "");
        Payload.words =
          Payload.words.split("ylbm")[0] +
          "ylbm_eq" +
          Payload.words.split("ylbm")[1];
      }
      getCount(dbname, state, Payload);
    }

    store.commit("searchLoading", true);
    console.log(router.currentRoute.path);
    if (router.currentRoute.path == '/globaldrugs/analysis') {
      params = _.assign({}, params, {
        isAnaly: 1
      })
    }
    // 增加条件筛选-多级筛选接口
    // 接口并行，添加catch任一接口异常正常执行判断，
    let arrAxios = [
      window
        .Axios({
          method: "get",
          url: `/api/${dbname}/secondoption`,
          params: _.assign({}, Payload, params)
        })
        .catch(errCode => {
          return {
            data: {
              code: errCode
            }
          };
        })
    ];
    // 首次只增加药物报告-适应症，故添加判断report数据库请求多级筛选接口
    if (dbname === "report") {
      arrAxios.push(
        window
          .Axios({
            method: "get",
            url: `/api/${dbname}/morefilter`,
            params: _.assign({}, Payload, params)
          })
          .catch(errCode => {
            return {
              data: {
                code: errCode
              }
            };
          })
      );
      arrAxios.push(
        window
          .Axios({
            method: "get",
            url: `/api/${dbname}/morefilterleixing`,
            params: _.assign({}, Payload, params)
          })
          .catch(errCode => {
            return {
              data: {
                code: errCode
              }
            };
          })
      );
    }

    if (dbname === "globaldrugs") {
      // 单独请求全球药物2.0的条件筛选适应症数据
      arrAxios.push(
        window
          .Axios({
            method: "get",
            url: `/api/${dbname}/morefilter`,
            params: _.assign({}, Payload, params)
          })
          .catch(errCode => {
            return {
              data: {
                code: errCode
              }
            };
          })
      );
      window
        .Axios({
          method: "get",
          url: "/api/globaldrugs/highOption",
          params: _.assign({}, Payload, params)
        }).then(res => {
          if (res.data.code === 200 && res.data) {
            state.commit("highFilters", res.data.data);
          }
        })
      window
        .Axios({
          method: "get",
          url: "/api/globaldrugs/analyCount",
          params: _.assign({}, Payload, params)
        })
        .then(res => {
          if (res.data.code === 200 && res.data) {
            let data = res.data.data;
            state.commit("dataCount", data);
          } else {
            state.commit("dataCount", 0);
          }
        }).catch(err => {
          console.log(err);
          state.commit("dataCount", 0);
        })
    }

    window.Axios.all(arrAxios).then(
      window.Axios.spread((res, hres, thres) => {
        store.commit("searchLoading", false);
        let data = res.data;
        let GroupList = {};
        let HotList = {};
        if (hres && hres.data.code === 200 && hres.data.data) {
          // 单独判断全球药物2.0
          if (dbname === "globaldrugs") {
            GroupList = _.assign({}, GroupList, hres.data.data.GroupList);
          } else {
            GroupList = _.assign({}, GroupList, hres.data.data);
            GroupList = _.assign({}, GroupList, thres.data.data);
          }

        }
        if (data.code === 200 && data.data) {
          GroupList = _.assign({}, GroupList, data.data.GroupList);
          if (state.state.hot_filter_filed) {
            HotList = _.assign({}, HotList, data.data.HotList);
          }
        }
        console.log(GroupList);
        if (router.currentRoute.path === "/globaldrugs/analysis") {
          state.commit("filtersAnaly", GroupList);
        } else {
          state.commit("filters", GroupList);
        }
        if (state.state.hot_filter_filed) {
          state.commit("hot_filter_filed", HandleHotList(data.data.HotList));
        }

        if (router.currentRoute.path === "/globaldrugs/analysis") {
          // 全球药物2.0 智能分析顶部筛选条件面板的加载效果
          state.commit("filtersAnalyLoading", false);
        }
      })
    );


  };

  // 融资条件筛选
  Vue.prototype.getTrzSearchParams = (dbname, state, Payload, listType, Param) => {
    let params = {};


    //本次搜索与上次搜索参数相同不需要更新筛选列表
    if (isEqual(dbname, Payload) && !state.state.refreshFilter) {
      return;
    }

    store.commit("searchLoading", true);
    // 增加条件筛选-多级筛选接口
    // 接口并行，添加catch任一接口异常正常执行判断，
    let arrAxios = [
      window
        .Axios({
          method: "get",
          url: `/api/${dbname}/secondoption`,
          params: _.assign({}, Payload, params)
        })
        .catch(errCode => {
          return {
            data: {
              code: errCode
            }
          };
        })
    ];

    window.Axios.all(arrAxios).then(
      window.Axios.spread((res, hres, thres) => {
        store.commit("searchLoading", false);
        let data = res.data;
        let GroupList = {};
        let HotList = {};
        if (hres && hres.data.code === 200 && hres.data.data) {
          GroupList = _.assign({}, GroupList, hres.data.data);
          GroupList = _.assign({}, GroupList, thres.data.data);
        }
        if (data.code === 200 && data.data) {
          GroupList = _.assign({}, GroupList, data.data.GroupList);
          if (state.state.hot_filter_filed) {
            HotList = _.assign({}, HotList, data.data.HotList);
          }
        }
        state.commit("filters", GroupList);
      })
    );
  };
  //特殊库需要统计搜索词的方法,调用方式参考 一致性评价进度库 或 医院销售数据库
  (Vue.prototype.keywordStatistics = (params, obj) => {
    params = JSON.parse(JSON.stringify(params));
    let search = [];
    _.forIn(params, (value, key) => {
      let item = obj[key],
        typeOf = typeof item;
      if (typeOf === "string" && value) {
        search.push(`${key}=${item},${value}`);
      } else if (typeOf === "object") {
        let findObj = _.find(item.option, {
          value: value
        });
        if (findObj) {
          search.push(`${key}=${item.label},${findObj.label}`);
        }
      }
    });

    params = _.assign(params, {
      searchname_zh: search.length ? search.join("$") : null
    });
    return params;
  }),
    (Vue.prototype.getTabLabel = function (label, num) {
      return num ? `${label}(${num})` : label;
    });
  Vue.prototype.getExtendList = function (dbname, data) {
    if (!data) return;
    window
      .Axios({
        method: "get",
        url: `/api/${dbname}/extendlistfun?${data}`
      })
      .then(res => {
        if (res.data.data) {
          let data = res.data.data;
          console.log(data);
          if (data instanceof Array && data.length) {
            this.extendList = data;
            if (this.hasOwnProperty("hasExtend")) this.hasExtend = true;
          } else {
            if (this.hasOwnProperty("hasExtend")) this.hasExtend = false;
            this.extendList = [];
          }
        }
      })
      .catch(err => {
        if (this.hasOwnProperty("hasExtend")) this.hasExtend = false;
        this.extendList = [];
      });
  };
  Vue.prototype.echartsResize = debounce(
    function (className) {
      let list = document.getElementsByClassName(className);
      if (list.length > 0) {
        for (let item of list) {
          Echarts.getInstanceByDom(item) &&
            Echarts.getInstanceByDom(item).resize();
        }
      }
    },
    200, {
    leading: false, // 指定在延迟开始前调用
    trailing: true // 指定在延迟结束后调用
  }
  );

  Vue.prototype.echartsClear = function (className) {
    let list = document.getElementsByClassName(className);
    if (list.length > 0) {
      for (let item of list) {
        Echarts.getInstanceByDom(item) &&
          Echarts.getInstanceByDom(item).clear();
      }
    }
  };

  //前端日志统计
  Vue.prototype.frontEndLog = function (routes, params) {
    let date = new Date();
    let months =
      date.getMonth() + 1 < 10 ?
        "0" + (date.getMonth() + 1) :
        date.getMonth() + 1;
    let dates = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    let obj = {
      userName: this.vueGetCookie("userName"),
      browers: navigator.userAgent.toLowerCase(),
      beginRouter: routes,
      reportDate: `${date.getFullYear()}-${months}-${dates} ${date.getSeconds()}}`,
      fileds: window.location.hostname,
      info: params
    };
    try {
      indexDB(obj);
    } catch (error) {
      console.log(error);
    }
  };

  // 判断数据类型
  const toType = obj => {
    return {}.toString
      .call(obj)
      .match(/\s([a-zA-Z]+)/)[1]
      .toLowerCase();
  };

  // 数据过滤空值
  const filterNull = o => {
    for (let key in o) {
      if (o[key] == null) delete o[key];
      if (toType(o[key]) === "string") {
        o[key] = o[key].trim();
        if (o[key] === "") delete o[key];
      } else if (toType(o[key]) === "object") {
        o[key] = filterNull(o[key]);
        if (JSON.stringify(o[key]) === "{}") delete o[key];
      } else if (toType(o[key]) === "array") {
        o[key] = filterNull(o[key]);
        o[key] = o[key].filter(arr => arr);
        if (o[key].length === 0) delete o[key];
      }
    }
    return o;
  };

  Vue.prototype.toType = toType;
  Vue.prototype.filterNull = filterNull;
  Vue.prototype.isEmpty = function (t) {
    // 先处理一些怪异的类型
    if (t === null || t === undefined || t === NaN) return false;
    // 获得构造器名称
    let type = t.constructor.name;
    // 处理对应的类型
    let funcs = {
      String: e => {
        return !!e.length
      },
      Object: e => {
        return !!Object.keys(e).length
      },
      Array: e => {
        return !!e.length
      },
      Number: e => {
        return true
      }
    }
    return funcs[type](t);
  }

  Vue.prototype.ToText = function (HTML) {
    if (!HTML) return '';
    var input = HTML;
    return input.replace(/<(style|script|iframe)[^>]*?>[\s\S]+?<\/\1\s*>/gi, '').replace(/<[^>]+?>/g, '').replace(/\s+/g, ' ').replace(/ /g, ' ').replace(/>/g, ' ');
  }
};

const getCount = (dbname, state, Payload) => {
  window
    .Axios({
      method: "get",
      url: `/api/${dbname}/extendCount`,
      params: _.assign({}, Payload, {
        accesstoken: GETCOOKIEFUN("accesstoken")
      })
    })
    .then(res => {
      let data = res.data;
      if (data.code === 200 && data.data) {
        state.commit("extendCount", data.data.ExtendCount);
      }
    })
    .catch(() => { });
};

let isEqual = (dbname, param, isSave = true) => {
  let boolen = false;
  if (requestParams[dbname]) {
    let removeList = ["page", "order", "pageSize", "accesstoken"];
    let params = _.omit(param, removeList);
    let rq = _.omit(requestParams[dbname], removeList);
    boolen = _.isEqual(params, rq);
  }
  if (isSave) {
    requestParams[dbname] = _.cloneDeep(param);
  }
  return boolen;
};

//获取时间周期内的日志并提交
let indexDB = obj => {
  let content = null;
  let dbName = "FElog";
  // 数据库数据结果
  let db;
  // 打开数据库
  let DBOpenRequest = window.indexedDB.open("FElog", 2.9);
  // 如果数据库打开失败
  DBOpenRequest.onerror = function (event) {
    logError("数据库打开失败");
  };
  DBOpenRequest.onsuccess = function (event) {
    // 存储数据结果
    db = DBOpenRequest.result;
  };
  // 下面事情执行于：数据库首次创建版本，或者window.indexedDB.open传递的新版本（版本数值要比现在的高）
  DBOpenRequest.onupgradeneeded = function (event) {
    db = event.target.result;
    db.onerror = function (event) {
      logError("数据库打开失败");
    };

    // 创建一个数据库存储对象
    var objectStore = db.createObjectStore(dbName, {
      keyPath: "id",
      autoIncrement: true
    });

    // 定义存储对象的数据项
    objectStore.createIndex("id", "id", {
      unique: true
    });
  };
  let method = {
    // 添加数据
    add: function (newItem) {
      var transaction = db.transaction([dbName], "readwrite");
      // 打开已经存储的数据对象
      var objectStore = transaction.objectStore(dbName);
      // 添加到数据对象中
      var objectStoreRequest = objectStore.add(newItem);
      objectStoreRequest.onsuccess = function (event) {
        console.log("新增成功！");
      };
    },
    // 更新数据
    update: function (id, data) {
      // 编辑数据
      var transaction = db.transaction([dbName], "readwrite");
      // 打开已经存储的数据对象
      var objectStore = transaction.objectStore(dbName);
      // 获取存储的对应键的存储对象
      var objectStoreRequest = objectStore.get(id);
      // 获取成功后替换当前数据
      objectStoreRequest.onsuccess = function (event) {
        // 当前数据
        var myRecord = objectStoreRequest.result;
        // 遍历替换
        for (var key in data) {
          if (typeof myRecord[key] != "undefined") {
            myRecord[key] = data[key];
          }
        }
        // 更新数据库存储数据
        objectStore.put(myRecord);
      };
    },
    // 删除数据
    del: function (id) {
      // 打开已经存储的数据对象
      var objectStore = db
        .transaction([dbName], "readwrite")
        .objectStore(dbName);
      // 直接删除
      var objectStoreRequest = objectStore.delete(id);
      // 删除成功后
    },
    // 通过主键key单个记录数据,主键是前面开始设置的相应key值
    get: function (key) {
      var transaction = db.transaction([dbName], "readwrite");
      var store = transaction.objectStore(dbName);
      var request = store.get(key);
      request.onerror = function () {
        console.error("getDataByKey error");
      };
      request.onsuccess = function (e) {
        var result = e.target.result;
        console.log("查找数据成功");
        console.log(result);
      };
    },
    // 遍历数据表
    cursor: function () {
      var transaction = db.transaction([dbName], "readwrite");
      var store = transaction.objectStore(dbName);
      var request = store.openCursor(); //打开游标
      var arr = [];
      request.onsuccess = function (e) {
        var cursor = e.target.result;
        if (cursor) {
          arr.push(cursor.value);
          cursor.continue();
        }
        localStorage.setItem("indexDB", JSON.stringify(arr));
      };
    }
  };
  setTimeout(() => {
    let log = JSON.parse(localStorage.getItem("indexDB"));
    //删除indexDB历史记录
    if (log) {
      for (let i = 0; i < log.length; i++) {
        method.del(log[i].id);
      }
    }
    //添加最新日志
    method.add(obj);
    //遍历日志
    method.cursor();
    // console.log('--------------------------------------')
    // console.log(log)
  }, 500);
};

export default func;
