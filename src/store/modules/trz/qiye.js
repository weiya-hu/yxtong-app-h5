// 药品不良反应检测信息分析预警系统
import Vue from "vue";
import Qs from "qs";
import Lang from "@/i18n/lang/zh-CN.js";
import store from "@/store";
const stateObj = {
  listLoading: true, // 控制表格中数据的加载清空
  analyLoading: true, // 智能分析diglog
  error: 0, // 错误码
  path: "/api/tourongzi_qiye", // 维护当前搜索请求接口
  nomal_filed: [{
      field: "companyname|applicationscenarios|concept",
      label: "关键词检索",
      name: "keywords",
      placeholder: "企业名称/标签及药品/靶点/疾病等",
      type: "text"
    },
    {
      field: "establishmenttime",
      label: "成立时间",
      name: "establishmenttime",
      type: "date"
    }
  ], // 普通搜索列举项
  advanced_filed: [], // 高级搜索列举项
  // 查询出的数量
  extendCount: 0,
  param: {
    sort: "1",
    pageSize: 20,
    page: 1
  },
  res: {}, // 数据结果
  query: [], // 已选普通搜索查询条件 格式请查看readme.md
  queryStr: "", // 由于监听不到数组变化，需监听query时，转成字符串
  putong: {}, // 普通搜索查询条件所用的储存对象（主要用于API前的处理）
  conditions: [], // 已选高级搜索查询条件 格式请查看readme.md
  gaoji: {}, // 高级搜索查询条件所用的储存对象（主要用于API前的处理）
  groups: {}, // 已选筛选条件
  shaixuan: {},
  filters: {}, // 条件筛选结果
  filters1: [{
      field: "applicationscenarios",
      label: "关键词",
      name: "applicationscenarios",
      sort: "102",
      type: "text"
    },
    {
      field: "technology",
      label: "行业",
      name: "technology",
      sort: "101",
      type: "text"
    },
    {
      field: "round",
      label: "融资轮次",
      name: "round",
      sort: "100",
      type: "text"
    },
    {
      field: "country",
      label: "企业地区",
      name: "country",
      sort: "99",
      type: "text"
    },
    {
      field: "people",
      label: "企业人数",
      name: "people",
      sort: "90",
      type: "text"
    }
    // {
    //   field: "industries",
    //   label: "优势领域",
    //   name: "industries",
    //   sort: "98",
    //   type: "text",
    // },{
    //   field: "concept",
    //   label: "产品定位",
    //   name: "concept",
    //   sort: "97",
    //   type: "text",
    // },{
    //   field: "technology",
    //   label: "技术支持",
    //   name: "technology",
    //   sort: "96",
    //   type: "text",
    // },{
    //   field: "applicationscenarios",
    //   label: "应用方向",
    //   name: "applicationscenarios",
    //   sort: "95",
    //   type: "text",
    // }
  ], // 添加问号标注添加条件筛选
  hot_filter_filed: {}, // 热门信息筛选列举项（来源于API的原始数据）
  hot_checked: {}, // 已选热门筛选条件
  hot: {}, // 热门筛选条件所用的储存对象（主要用于API前的处理）
  pageSize: "20", // 当前页显示条数（条/页）
  order: {}, // 查询的排序规则
  // 匹配
  match_putong: {
    comprehensive_drug: "综合搜索（药品）",
    comprehensive_company: "综合搜索（企业）",
    comprehensive_devices: "综合搜索（医疗器械）",
    comprehensive_chinesemedicine: "综合搜索（中药材）",
    comprehensive_targets: "综合搜索（靶点）",
    comprehensive_disease: "综合搜索（疾病）"
  },
  match_gaoji: {},
  match_shaixuan: [],
  match_shaixuan_values: {},
  search_api_param: {},
  saved_options: [],
  allBase: {},
  tableconf: [],
  helpInfo: {},
  update_conf: [],
  fourth: {},
  iffirstCommonIn: true, // 连接跳转搜索进这个界面
  fourth_checked: {},
  nopms: {
    list: [],
    detail: []
  },
  isGetCount: false,
  norules: {}
};
let isMount = true;
export default {
  namespaced: true,
  state: Object.assign({}, stateObj),
  mutations: {
    nopms(state, Payload) {
      state.nopms = Payload;
    },
    analyLoading(state, status) {
      state.analyLoading = status;
    },
    norules(state, Payload) {
      state.norules = Payload;
    },
    fourth(state, Payload) {
      if (Payload instanceof Array) {
        this.iffirstCommonIn = true;
      } else {
        this.iffirstCommonIn = false;
      }

      let fourth_condition = "";
      _.map(Payload, (item, index) => {
        if (index == 0) {
          fourth_condition = item.logic + " " + item.name + "=" + item.value;
        } else {
          fourth_condition +=
            " " + item.logic + " " + item.name + "=" + item.value;
        }
      });
      state.fourth = fourth_condition ? {
        fourth_condition: fourth_condition
      } : {};
    },
    allBase(state, Payload) {
      state.allBase = Payload;
    },
    tableconf(state, Payload) {
      state.tableconf = Payload;
    },
    helpInfo(state, Payload) {
      state.helpInfo = Payload;
    },
    update_conf(state, Payload) {
      state.update_conf = Payload;
    },
    saved_options(state, Payload) {
      state.saved_options = Payload;
    },
    search_api_param(state, Payload) {
      let obj = _.omit(Payload, ["order", "page", "pageSize"]);
      state.search_api_param = obj;
    },
    match_putong(state, Payload) {
      // state.match_putong = Payload
      for (let item of Payload) {
        _.set(state.match_putong, item.name, item.label);
      }
    },
    match_gaoji(state, Payload) {
      // state.match_gaoji = Payload
      for (let item of Payload) {
        _.set(state.match_gaoji, item.name, item.label);
      }
    },
    match_shaixuan(state, Payload) {
      state.match_shaixuan = Payload;
    },
    match_shaixuan_values(state, Payload) {
      state.match_shaixuan_values = Payload;
    },
    listLoading(state, Payload) {
      state.listLoading = Payload;
    },
    error(state, Payload) {
      state.error = Payload;
    },
    extendCount(state, Payload) {
      state.extendCount = Payload;
    },
    paramPage(state, Payload) {
      state.param.page = Payload;
    },
    paramPagesize(state, Payload) {
      state.param.pageSize = Payload;
    },
    query(state, Payload) {
      // opt=1增加条件 或 替换已有条件
      if (Payload.opt && Payload.opt == 1) {
        if (state.query.length == 0) {
          state.query.push(Payload.param);
        } else {
          for (let i = 0, l = state.query.length; i < l; i++) {
            if (Payload.param.name == state.query[i].name) {
              if (
                Payload.param.value == "" ||
                Payload.param.value == ":" ||
                Payload.param.value == undefined
              ) {
                // **清除**此条件
                //将无效的输入条件移除
                _.remove(state.query, n => {
                  return n.name.indexOf(Payload.param.name) == 0;
                });
              } else {
                // **替代**此条件
                state.query[i] = Payload.param;
              }
              break;
            } else {
              if (i == l - 1) {
                state.query.push(Payload.param);
                break;
              }
            }
          }
        }
      } else {
        state.query = Payload;
      }
      // Vue.set(state,'query',theQuery)
    },
    queryStr(state) {
      state.queryStr = JSON.stringify(state.query);
    },
    putong(state, Payload) {
      if (Payload) {
        if (Payload.length) {
          let obj = {};
          for (let i = 0; i < Payload.length; i++) {
            let iname = Payload[i].name;
            let ilabel = Payload[i].label;
            let iaccurate = Payload[i].accurate;
            let pivalue = Payload[i].value;

            if (pivalue) {
              _.set(obj, iaccurate ? iname + "_eq" : iname, pivalue);
            } else {
              _.omit(obj, iaccurate ? iname + "_eq" : iname);
            }
          }
          delete obj.trzType;
          console.log(obj);
          state.putong = obj;
        } else {
          state.putong = {};
        }
      }
    },
    conditions(state, Payload) {
      state.conditions = Payload;
    },
    gaoji(state, Payload) {
      let words = "";
      let atcs_sel = false;
      _.map(Payload, (item, index) => {
        if (item.value) {
          // 去空
          if (item.atcs_sel) {
            atcs_sel = true;
          }
          if (index == 0) {
            words = item.value.length ?
              item.logic +
              " " +
              (item.accurate ? item.name + "_eq" : item.name) +
              "=" +
              (_.isArray(item.value) ?
                _.join(
                  _.map(item.value, n => {
                    return n;
                  }),
                  "ღ"
                ) :
                item.value) :
              "";
          } else {
            words += item.value.length ?
              " " +
              item.logic +
              " " +
              (item.accurate ? item.name + "_eq" : item.name) +
              "=" +
              (_.isArray(item.value) ?
                _.join(
                  _.map(item.value, n => {
                    return n;
                  }),
                  "ღ"
                ) :
                item.value) :
              "";
          }
        }
      });
      state.gaoji = atcs_sel ? {
        words: words,
        atcs_sel: 1
      } : {
        words: words
      };
    },
    groups(state, Payload) {
      state.groups = Payload;
    },
    shaixuan(state, Payload) {
      let group = "";

      _.map(Payload, (item, index) => {
        if (item.length > 0) {
          // 去空
          if (group == "") {
            group = index + "=" + _.join(item, "ღ");
          } else {
            group += " " + "_and" + " " + index + "=" + _.join(item, "ღ");
          }
        }
      });

      if (group != "") {
        //return {filter_condition: Qs.stringify(group,{ encodeValuesOnly: false })}
        state.shaixuan = {
          filter_condition: group
        };
      } else {
        state.shaixuan = {};
      }
    },
    fourth_condition(state, Payload) {
      state.fourth_condition = Payload;
    },
    fourth_checked(state, Payload) {
      state.fourth_checked = Payload;
    },
    hot_checked(state, Payload) {
      state.hot_checked = Payload;
    },
    hot(state, Payload) {
      let hotcheckeds = "";
      _.map(Payload, (item, index) => {
        if (item.length > 0) {
          // 去空
          if (hotcheckeds == "") {
            hotcheckeds = index + "=" + _.join(item, "ღ");
          } else {
            hotcheckeds += " " + "_and" + " " + index + "=" + _.join(item, "ღ");
          }
        }
      });

      if (hotcheckeds != "") {
        state.hot = {
          hot_condition: hotcheckeds
        };
      } else {
        state.hot = {};
      }
    },
    // 热门信息筛选项
    hot_filter_filed(state, Payload) {
      state.hot_filter_filed = Payload;
    },
    path(state, Payload) {
      state.path = Payload;
    },
    // 普通搜索项
    nomalFiled(state, Payload) {
      state.nomal_filed = Payload;
    },
    // 高级搜索项
    advancedFiled(state, Payload) {
      state.advanced_filed = Payload;
    },
    // 条件筛选结果项
    filters(state, Payload) {
      state.filters = Payload;
    },
    // 条件筛选结果项
    filters1(state, Payload) {
      state.filters1 = Payload;
    },
    // 列表数据
    res(state, Payload) {
      console.log(Payload);
      state.res = Payload;
    },
    resetListParams(state) {
      state.res = [];
      state.param.page = 1;
    }
  },
  actions: {
    // 普通搜索 和 高级搜索 通用方法
    nomalSearch(state, Payload) {
      state.commit("listLoading", true);
      // 确定api的url
      if (Payload !== undefined) {
        if (Payload.path) {
          state.commit("path", Payload.path);
        }
      }

      let param = {}; // 储存axios获取数据的API参数
      if (Payload && !Payload.queryToPutong) {
        // 不把query的状态传给putong
      } else {
        // console.log("查询内容：",state.state.query)
        state.commit("putong", state.state.query);
      }
      state.commit("gaoji", state.state.conditions);
      state.commit("shaixuan", state.state.groups);
      state.commit("hot", state.state.hot_checked);

      let sparam = state.state.putong;
      let swords = state.state.gaoji;
      let sgroup = state.state.shaixuan;
      let sfourth = state.state.fourth;
      let shot = state.state.hot;
      // .replace('ssxkcyr', 'ismah')

      if (state.state.gaoji.words) {
        param =
          Payload && Payload.params ?
          _.assign({}, sfourth, swords, sgroup, shot, Payload.params) :
          _.assign({}, sfourth, swords, sgroup, shot);
      } else {
        param =
          Payload && Payload.params ?
          _.assign({}, sfourth, sparam, sgroup, shot, Payload.params) :
          _.assign({}, sfourth, sparam, sgroup, shot);
      }

      if (!Payload || Payload === state.state.putong) {
        // 当没有跟其他参数时，正常搜索，回到第一页
        state.commit("resetListParams");
        // !this.vue.isEqual('tourongzi_qiye/index',param,false) && state.dispatch("getKshRes",{noClear:true})
      }
      //关键词统计方法
      param = _.assign(param, this.vue.searchKeywords(state.state, Payload));

      // if(typeof(param.hot_condition) != 'undefined') {
      //   param.hot_condition = (param.hot_condition).replace('ssxkcyr', 'ismah')
      // }

      state.commit("search_api_param", param);
      if (this.vue.vueGetCookie("from_qiyedetails_home")) {
        param["from_qiyedetails_home"] = this.vue.vueGetCookie(
          "from_qiyedetails_home"
        );
      }
      param = _.assign(param, state.state.param);

      this.vue.getTrzSearchParams(
        "tourongzi_qiye",
        state,
        param,
        null,
        Payload
      );
      // 这一步操作用于企业版后台统计用户搜索词 开始
      if (Object.keys(sparam).length > 0) {
        console.log(
          this.vue.keywordStatistics(sparam, {
            keywords: "关键词检索",
            establishmenttime: "成立时间"
          })
        );
        let obj = this.vue.keywordStatistics(sparam, {
          keywords: "关键词检索",
          establishmenttime: "成立时间"
        });
        param.searchname_zh = obj.searchname_zh;
      }
      // 这一步操作用于企业版后台统计用户搜索词 结束
      return window
        .Axios({
          method: "get",
          url: state.state.path,
          params: _.assign(param, {
            accesstoken: GETCOOKIEFUN("accesstoken")
          })
        })
        .then(res => {
          if (this.vue.vueGetCookie("from_qiyedetails_home")) {
            this.vue.vueDelCookie("from_qiyedetails_home");
          }
          if (res.data.code === 200 && res.data) {
            // debugger
            let res_data = res.data.data;
            state.commit("error", 0);
            if (res_data.count || res_data.count === 0) {
              state.commit("extendCount", res_data.count);
            } else {
              state.commit("extendCount", 0);
            }
            state.commit("res", res_data.res ? res_data.res : []);

            state.commit("listLoading", false);

            return res;
          } else if (res.data.code == 404) {
            // 显示数值归零
            state.commit("extendCount", 0);
            state.commit("error", 404);
            state.commit("listLoading", false);
          }
        })
        .catch(res => {
          // 显示数值归零
          state.commit("extendCount", 0);
          state.commit("res", []);
          state.commit("error", 500);
          state.commit("listLoading", false);
          return res.data.code;
        });
    },
    // 获取普通 或 高级搜索项
    getFiled(state) {
      state.commit("match_putong", state.state.nomal_filed);
      let match_shaixuan_Obj = {};
      state.state.filters1.length > 0 &&
        state.state.filters1.forEach(item => {
          match_shaixuan_Obj[item.field] = item.label;
        });
      match_shaixuan_Obj.province = "地区(省份)";
      match_shaixuan_Obj.city = "地区(城市)";
      console.log(match_shaixuan_Obj);
      state.commit("match_shaixuan", match_shaixuan_Obj);
      //  return window.Axios({
      //   method: 'get',
      //   url: '/api/config/search?dbname=tourongzi_qiye'
      // }).then(res => {
      //   if (res.data.code === 200 && res.data) {
      //     // 普通搜索项
      //     let normal
      //     state.commit("nomalFiled", res.data.data.normal)
      //     state.commit("match_putong", res.data.data.normal)
      //     state.commit("filters1", res.data.data.filter)
      //     let match_shaixuan_Obj = {};
      //     res.data.data.filter.length > 0 && res.data.data.filter.forEach(item => {
      //       match_shaixuan_Obj[item.field] = item.label;
      //     })
      //     console.log(match_shaixuan_Obj);
      //     state.commit("match_shaixuan", match_shaixuan_Obj)
      //   }
      // })
    },
    getBaseInfo(state, Payload) {
      return window
        .Axios({
          method: "get",
          url: "/api/config/view?dbname=tourongzi_qiye",
          params: {
            accesstoken: GETCOOKIEFUN("accesstoken")
          }
        })
        .then(res => {
          if (res.data.code === 200 && res.data.data) {
            let data = res.data.data;
            if (data.baseconf.dbname) {
              store.commit("Normal/names", {
                name: data.baseconf.dbename,
                dbname: data.baseconf.dbname
              });
            }

            state.commit("allBase", data.baseconf);
            state.commit("tableconf", data.tableconf);
            state.commit("helpInfo", data.helpconf);
            state.commit("update_conf", data.updatelog);
            // 权限处理 start
            state.commit("norules", data.norules);
            for (let item of state.state.norules.common) {
              switch (item.name) {
                case "高级搜索":
                  state.state.nopms.gjss = true;
                  break;
                case "条件筛选":
                  state.state.nopms.tjsx = true;
                  break;
                case "可视化":
                  state.state.nopms.ksh = true;
                  break;
                case "详情页":
                  state.state.nopms.xqy = true;
                  break;
                case "导出(默认300)":
                  state.state.nopms.dc = true;
                  break;
                case "翻页(最大75)":
                  state.state.nopms.fy = true;
                  break;
                case "热点搜索":
                  state.state.nopms.rdss = true;
                  break;
              }
            }

            for (let item of state.state.norules.exclusive) {
              switch (item.action) {
                case "rss":
                  state.state.nopms.rss = true;
                  break;
                case "devprocess":
                  state.state.nopms.devprocess = true;
                  break;
                case "nameGroup":
                  state.state.nopms.name_view = true;
                  break;
                case "qiyeNameGroup":
                  state.state.nopms.qy_view = true;
                  break;
              }
            }

            state.state.nopms.list = data.norules.list;
            state.state.nopms.detail = data.norules.detail;
            // 权限处理 end
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  mounted() {
    console.log(state);
  }
};
