import store from "@/store";
import route from "@/router"
import Axios from "axios";

export default {
  namespaced: true,
  state: {
    dataCount: 0,
    bdrdTableLoading: true,
    bdrdShowMore: true,
    syzrdShowMore: true,
    bdfxLoading: true,
    syzfxLoading: true,
    filtersAnalyLoading: true,
    panelIndex: 0,
    yfjdParams: {},
    pdfHandlerStatus: false, // 默认不展开详情页字段，显示省略号
    listLoading: true, // 控制表格中数据的加载清空
    analyLoading: true,
    error: 0, // 错误码
    tabname: 'first',
    path: "/api/globaldrugs", // 维护当前搜索请求接口
    extendCount: {
      baseCount: 0,
      projectCount: 0,
      companyCount: 0,
      targetCount: 0,
      indicationCount: 0,
    },
    topphase: {},// 最高研发阶段
    ypfxLeixingbm: {},// 药品分类
    ypfxYplx: {}, // 药品类型
    ypfxTssp: {},// 特殊审评
    ypfxZlly: {},// 治疗领域
    ypfxBdph: {},// 靶点排行
    ypfxYpzsyzph: {},// 已批准适应症排行
    ypfxZysyzph: {},// 在研适应症排行
    ypfxZzsyzph: {},// 终止适应症排行
    ypfxYydwph: {}, // 原研单位排行

    topphaseLoading: true,// 最高研发阶段
    ypfxLeixingbmLoading: true,// 药品分类
    ypfxYplxLoading: true, // 药品类型
    ypfxTsspLoading: true,// 特殊审评
    ypfxZllyLoading: true,// 治疗领域
    ypfxBdphLoading: true,// 靶点排行
    ypfxYpzsyzphLoading: true,// 已批准适应症排行
    ypfxZysyzphLoading: true,// 在研适应症排行
    ypfxZzsyzphLoading: true,// 终止适应症排行
    ypfxYydwphLoading: true, // 原研单位排行

    ypfxBdzyjzfl: {},// 靶点作用机制分类
    ypfxBdlx: {},// 靶点类型
    ypfxBdzgyfjd: {}, // 靶点最高研发阶段
    ypfxBdrdSelect: [],// 靶点热度 - 研发阶段下拉框数据项
    ypfxSyzrdSelect: [],// 适应症热度 - 研发阶段下拉框数据项
    ypfxBdrd: [],// 研发阶段列表数据
    ypfxBdrd_param: {
      order: null, // 排序
      page: 1, // 页数
      pageSize: 10 // 每页条数
    },
    syzfxSyzrd_param: {
      order: null, // 排序
      page: 1, // 页数
      pageSize: 10 // 每页条数
    },
    syzfxZlly: [],// 适应症治疗领域
    syzfxSyzlx: [],// 适应症类型
    syzfxSyzzgyfjd: [],// 适应症最高研发阶段
    syzfxSyzrd: [],// 适应症热度
    paramAnaly: {},
    ypll_param: { // 按药品浏览查询页的附加参数
      order: null, // 排序
      page: 1, // 页数
      pageSize: 20 // 每页条数
    },
    xmjz_param: { // 项目进展查询页的附加参数
      order: null, // 排序
      page: 1, // 页数
      pageSize: 20 // 每页条数
    },
    qyll_param: { // 按企业浏览查询页的附加参数
      order: null, // 排序
      page: 1, // 页数
      pageSize: 20 // 每页条数
    },
    bdll_param: { // 按靶点浏览查询页的附加参数
      order: null, // 排序
      page: 1, // 页数
      pageSize: 20 // 每页条数
    },
    syzll_param: { // 按适应症查询页的附加参数
      order: null, // 排序
      page: 1, // 页数
      pageSize: 20 // 每页条数
    },
    //高级查询
    advanced_filed: [], // 高级搜索列举项（来源于API的原始数据）
    advanced_filedAnaly: [], // 高级搜索列举项（来源于API的原始数据）
    highFilters: {}, // 高级搜索条件筛选数据
    highGroups: {},
    order: {},
    nomal_filed: [], // 普通搜索项
    nomal_filedAnaly: [],
    query: [],
    queryAnaly: [],
    queryStr: "", // 由于监听不到数组变化，需监听query时，转成字符串
    queryStrAnaly: "", // 由于监听不到数组变化，需监听query时，转成字符串
    putong: {},
    putongAnaly: {},
    groups: {}, // 已选筛选条件
    groupsAnaly: {},
    shaixuanNodesAnaly: [], // 储存一个筛选条件需要两个字段传值给后端的数据
    shaixuan: {},
    shaixuanAnaly: {},
    //热点查询
    hot_filter_filed: {}, // 热门信息筛选列举项（来源于API的原始数据）
    hot_filter_filedCopy: {}, // 用于已选条件展示使用
    hot_checked: {}, // 已选热门筛选条件
    hot: {}, // 热门筛选条件所用的储存对象（主要用于API前的处理）
    filters: {}, // 条件筛选结果
    filters1: [], // 添加问号标注添加条件筛选
    filtersAnaly: {}, // 条件筛选结果
    filters1Analy: [], // 添加问号标注添加条件筛选
    res1: {}, // 按药品浏览
    res2: {}, // 项目进展
    res3: {}, // 按企业浏览
    res4: {}, // 按靶点浏览
    res5: {}, // 按适应症浏览
    iffirstCommonIn: true, //连接跳转搜索进这个界面
    // 匹配
    match_putong: {
      comprehensive_drug: "综合搜索（药品）",
      comprehensive_company: "综合搜索（企业）",
      comprehensive_devices: "综合搜索（医疗器械）",
      comprehensive_chinesemedicine: "综合搜索（中药材）",
      comprehensive_targets: "综合搜索（靶点）",
      comprehensive_disease: "综合搜索（疾病）"
    },
    // 匹配
    match_putongAnaly: {
      comprehensive_drug: "综合搜索（药品）",
      comprehensive_company: "综合搜索（企业）",
      comprehensive_devices: "综合搜索（医疗器械）",
      comprehensive_chinesemedicine: "综合搜索（中药材）",
      comprehensive_targets: "综合搜索（靶点）",
      comprehensive_disease: "综合搜索（疾病）"
    },
    // match_shaixuan: {
    //   'compound': '复方药',
    //   'worldstatus': '全球最高状态',
    //   'zclx1': '中国1类药',
    // },
    match_shaixuan: {},
    match_shaixuanAnaly: {},
    match_shaixuan_values: {},
    // match_shaixuan_values_high: {}, // 高级搜索中的条件筛选选项，用于已选条件回显
    match_shaixuan_valuesAnaly: {},
    search_api_param: {},
    search_api_paramAnaly: {},
    saved_options: [],
    allBase: {},
    tableconf: [],
    helpInfo: {},
    update_conf: [],
    fourth: {},
    nopms: {
      list: [],
      detail: []
    },
    gaoji: {}, // 高级搜索查询条件所用的储存对象（主要用于API前的处理）
    gaojifilter: {}, // 高级搜索条件筛选查询条件所用的储存对象（主要用于API前的处理）
    gaojiAnaly: {},
    match_gaoji: {},
    match_gaojiAnaly: {},
    norules: {},
    conditions: [], // 已选高级搜索查询条件 格式请查看readme.md
    conditionsFilter: [], // 已选高级搜索条件筛选数据
    conditionsAnaly: [], // 已选高级搜索查询条件 格式请查看readme.md
    isGetCount: true,
    // 可视化结果
    kshRes: {
      noClear: true
    },
  },
  mutations: {
    dataCount(state, Payload) {
      state.dataCount = Payload;
    },
    panelIndex(state, Payload) {
      state.panelIndex = Payload;
    },
    filtersAnalyLoading(state, Payload) {
      state.filtersAnalyLoading = Payload;
    },
    bdrdShowMore(state, Payload) {
      state.bdrdShowMore = Payload;
    },
    syzrdShowMore(state, Payload) {
      state.syzrdShowMore = Payload;
    },
    bdfxLoading(state, Payload) {
      state.bdfxLoading = Payload;
    },
    syzfxLoading(state, Payload) {
      state.syzfxLoading = Payload;
    },
    yfjdParams(state, Payload) {
      state.yfjdParams = Payload;
    },
    paramAnaly(state, Payload) {
      state.paramAnaly = Payload
    },
    topphase(state, Payload) {
      state.topphase = Payload
    },
    ypfxLeixingbm(state, Payload) {
      state.ypfxLeixingbm = Payload
    },
    ypfxYplx(state, Payload) {
      state.ypfxYplx = Payload
    },
    ypfxTssp(state, Payload) {
      state.ypfxTssp = Payload
    },
    ypfxZlly(state, Payload) {
      state.ypfxZlly = Payload
    },
    ypfxBdph(state, Payload) {
      state.ypfxBdph = Payload
    },
    ypfxYpzsyzph(state, Payload) {
      state.ypfxYpzsyzph = Payload
    },
    ypfxZysyzph(state, Payload) {
      state.ypfxZysyzph = Payload
    },
    ypfxZzsyzph(state, Payload) {
      state.ypfxZzsyzph = Payload
    },
    ypfxYydwph(state, Payload) {
      state.ypfxYydwph = Payload
    },

    topphaseLoading(state, Payload) {
      state.topphaseLoading = Payload
    },
    ypfxLeixingbmLoading(state, Payload) {
      state.ypfxLeixingbmLoading = Payload
    },
    ypfxYplxLoading(state, Payload) {
      state.ypfxYplxLoading = Payload
    },
    ypfxTsspLoading(state, Payload) {
      state.ypfxTsspLoading = Payload
    },
    ypfxZllyLoading(state, Payload) {
      state.ypfxZllyLoading = Payload
    },
    ypfxBdphLoading(state, Payload) {
      state.ypfxBdphLoading = Payload
    },
    ypfxYpzsyzphLoading(state, Payload) {
      state.ypfxYpzsyzphLoading = Payload
    },
    ypfxZysyzphLoading(state, Payload) {
      state.ypfxZysyzphLoading = Payload
    },
    ypfxZzsyzphLoading(state, Payload) {
      state.ypfxZzsyzphLoading = Payload
    },
    ypfxYydwphLoading(state, Payload) {
      state.ypfxYydwphLoading = Payload
    },

    ypfxBdzyjzfl(state, Payload) {
      state.ypfxBdzyjzfl = Payload
    },
    syzfxZlly(state, Payload) {
      state.syzfxZlly = Payload
    },
    syzfxSyzlx(state, Payload) {
      state.syzfxSyzlx = Payload
    },
    syzfxSyzzgyfjd(state, Payload) {
      state.syzfxSyzzgyfjd = Payload
    },
    syzfxSyzrd(state, Payload) {
      state.syzfxSyzrd = Payload
    },
    ypfxBdlx(state, Payload) {
      state.ypfxBdlx = Payload
    },
    ypfxBdzgyfjd(state, Payload) {
      state.ypfxBdzgyfjd = Payload
    },
    ypfxBdrdSelect(state, Payload) {
      state.ypfxBdrdSelect = Payload
    },
    ypfxSyzrdSelect(state, Payload) {
      state.ypfxSyzrdSelect = Payload
    },
    ypfxBdrd(state, Payload) {
      state.ypfxBdrd = Payload
    },
    ypfxBdrd_param(state, Payload) {
      state.ypfxBdrd_param = Payload
    },
    syzfxSyzrd_param(state, Payload) {
      state.syzfxSyzrd_param = Payload
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
    gaojifilter(state, Payload) {
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
      state.gaojifilter = atcs_sel ? {
        filterWords: words,
        atcs_sel: 1
      } : {
        filterWords: words
      };
    },
    gaojiAnaly(state, Payload) {
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
      state.gaojiAnaly = atcs_sel ? {
        words: words,
        atcs_sel: 1
      } : {
        words: words
      };
    },
    conditions(state, Payload) {
      state.conditions = Payload;
    },
    conditionsFilter(state, Payload) {
      state.conditionsFilter = Payload;
    },
    conditionsAnaly(state, Payload) {
      state.conditionsAnaly = Payload;
    },
    match_gaoji(state, Payload) {
      // state.match_gaoji = Payload
      for (let item of Payload) {
        _.set(state.match_gaoji, item.name, item.label);
      }
    },
    match_gaojiAnaly(state, Payload) {
      // state.match_gaoji = Payload
      for (let item of Payload) {
        _.set(state.match_gaojiAnaly, item.name, item.label);
      }
    },
    // 高级搜索项
    advancedFiled(state, Payload) {
      state.advanced_filed = Payload;
    },
    // 高级搜索项
    advancedFiledAnaly(state, Payload) {
      state.advanced_filedAnaly = Payload;
    },
    analyLoading(state, Payload) {
      state.analyLoading = Payload
    },
    nopms(state, Payload) {
      state.nopms = Payload;
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
    order(state, Payload) {
      state.order = Payload;
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
    search_api_paramAnaly(state, Payload) {
      let obj = _.omit(Payload, ["order", "page", "pageSize"]);
      state.search_api_paramAnaly = obj;
    },
    match_putong(state, Payload) {
      // state.match_putong = Payload
      for (let item of Payload) {
        _.set(state.match_putong, item.name, item.label);
      }
    },
    match_putongAnaly(state, Payload) {
      // state.match_putong = Payload
      for (let item of Payload) {
        _.set(state.match_putongAnaly, item.name, item.label);
      }
    },
    match_shaixuan(state, Payload) {
      state.match_shaixuan = Payload;
    },
    match_shaixuanAnaly(state, Payload) {
      state.match_shaixuanAnaly = Payload;
    },
    match_shaixuan_values(state, Payload) {
      state.match_shaixuan_values = Payload;
    },
    // match_shaixuan_values_high(state, Payload) {
    //   state.match_shaixuan_values_high = Payload;
    //   console.log(state.match_shaixuan_values_high);
    // },
    match_shaixuan_valuesAnaly(state, Payload) {
      state.match_shaixuan_valuesAnaly = Payload;
    },
    pdfHandlerStatus(state, Payload) {
      state.tpdfHandlerStatusest = Payload;
    },
    listLoading(state, Payload) {
      state.listLoading = Payload;
    },
    error(state, Payload) {
      state.error = Payload;
    },
    path(state, Payload) {
      state.path = Payload;
    },
    nomalFiled(state, Payload) {
      state.nomal_filed = Payload;
    },
    highFilters(state, Payload) {
      state.highFilters = Payload;
    },
    highGroups(state, Payload) {
      state.highGroups = Payload;
    },
    nomalFiledAnaly(state, Payload) {
      state.nomal_filedAnaly = Payload;
    },
    tabname(state, Payload) {
      state.tabname = Payload
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
    // 按药品浏览查询的API数据
    res1(state, Payload) {
      state.res1 = Payload
    },
    // 项目进展查询的API数据
    res2(state, Payload) {
      state.res2 = Payload
    },
    // 按企业浏览查询的API数据
    res3(state, Payload) {
      state.res3 = Payload
    },
    // 按靶点浏览查询的API数据
    res4(state, Payload) {
      state.res4 = Payload
    },
    // 按适应症查询的API数据
    res5(state, Payload) {
      state.res5 = Payload
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
    },
    queryAnaly(state, Payload) {
      // opt=1增加条件 或 替换已有条件
      if (Payload.opt && Payload.opt == 1) {
        if (state.queryAnaly.length == 0) {
          state.queryAnaly.push(Payload.param);
        } else {
          for (let i = 0, l = state.queryAnaly.length; i < l; i++) {
            if (Payload.param.name == state.queryAnaly[i].name) {
              if (
                Payload.param.value == "" ||
                Payload.param.value == ":" ||
                Payload.param.value == undefined
              ) {
                // **清除**此条件
                //将无效的输入条件移除
                _.remove(state.queryAnaly, n => {
                  return n.name.indexOf(Payload.param.name) == 0;
                });
              } else {
                // **替代**此条件
                state.queryAnaly[i] = Payload.param;
              }
              break;
            } else {
              if (i == l - 1) {
                state.queryAnaly.push(Payload.param);
                break;
              }
            }
          }
        }
      } else {
        state.queryAnaly = Payload;
      }
    },
    queryStr(state) {
      state.queryStr = JSON.stringify(state.query);
    },
    queryStrAnaly(state) {
      state.queryStrAnaly = JSON.stringify(state.queryAnaly);
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
            let atcs_sel = Payload[i].atcs_sel;
            //atc多分类
            if (atcs_sel) {
              obj.atcs_sel = 1;
            }

            if (pivalue) {
              _.set(obj, iaccurate ? iname + "_eq" : iname, pivalue);
            } else {
              _.omit(obj, iaccurate ? iname + "_eq" : iname);
            }
          }
          console.log(obj);
          state.putong = obj;
        } else {
          state.putong = {};
        }
      }
    },
    putongAnaly(state, Payload) {
      if (Payload) {
        if (Payload.length) {
          let obj = {};
          for (let i = 0; i < Payload.length; i++) {
            let iname = Payload[i].name;
            let ilabel = Payload[i].label;
            let iaccurate = Payload[i].accurate;
            let pivalue = Payload[i].value;
            let atcs_sel = Payload[i].atcs_sel;
            //atc多分类
            if (atcs_sel) {
              obj.atcs_sel = 1;
            }

            if (pivalue) {
              _.set(obj, iaccurate ? iname + "_eq" : iname, pivalue);
            } else {
              _.omit(obj, iaccurate ? iname + "_eq" : iname);
            }
          }
          state.putongAnaly = obj;
        } else {
          state.putongAnaly = {};
        }
      }
    },
    groups(state, Payload) {
      state.groups = Payload;
    },
    shaixuanNodesAnaly(state, Payload) {
      state.shaixuanNodesAnaly = Payload
    },
    groupsAnaly(state, Payload) {
      state.groupsAnaly = Payload;
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
        state.shaixuan = {
          filter_condition: group
        };
      } else {
        state.shaixuan = {};
      }
    },
    shaixuanAnaly(state, Payload) {
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
        state.shaixuanAnaly = {
          filter_condition: group
        };
      } else {
        state.shaixuanAnaly = {};
      }
    },
    hot_checked(state, Payload) {
      state.hot_checked = Payload
    },
    hot(state, Payload) {
      let hotcheckeds = ''
      _.map(Payload, (item, index) => {
        if (item.length > 0) { // 去空
          if (hotcheckeds == '') {
            hotcheckeds = index + '=' + _.join(item, 'ღ')
          } else {
            hotcheckeds += ' ' + '_and' + ' ' + index + '=' + _.join(item, 'ღ')
          }
        }
      })
      if (hotcheckeds != '') {
        state.hot = {
          'hot_condition': hotcheckeds
        }
      } else {
        state.hot = {}
      }
    },
    // 条件筛选结果
    filters(state, Payload) {
      state.filters = Payload;
    },
    // 条件筛选结果项
    filters1(state, Payload) {
      state.filters1 = Payload;
    },
    // 条件筛选结果
    filtersAnaly(state, Payload) {
      state.filtersAnaly = Payload;
    },
    // 条件筛选结果项
    filters1Analy(state, Payload) {
      state.filters1Analy = Payload;
    },
    // 热门信息筛选项
    hot_filter_filed(state, Payload) {
      state.hot_filter_filed = Payload
      if (Object.keys(state.hot_filter_filedCopy).length <= 0) {
        state.hot_filter_filedCopy = Payload
      }
    },
  },
  actions: {
    // 模块通用请求
    commonAxios(state, {
      param,
      type,
      action
    }) {
      let params = _.cloneDeep(_.assign(param, {
        accesstoken: GETCOOKIEFUN("accesstoken"),
        action
      })),
        url = '/api/zhuce/visualizationNew';
      if (type == 1) {
        url = '/api/zhuce/visualizationNew'; // 按受理号智能分析
      } else if (type == 2) {
        url = '/api/zhuce/visualizationSpecies'; // 按品种智能分析
      }
      if (!type && ['pizhun', 'shenbaoshuliang'].includes(action)) params = _.cloneDeep(_.assign(params, state.state.param))
      return window.Axios({
        method: 'get',
        url,
        params
      })
    },
    getTopphase(state, param) {
      let params = _.cloneDeep(_.assign(param, {
        accesstoken: GETCOOKIEFUN("accesstoken")
      }))
      console.log(params, param);
      return window.Axios({
        methods: "get",
        url: "/api/globaldrugs/topphase",
        params
      })
    },
    getYpfxLeixingbm(state, param) {
      let params = _.cloneDeep(_.assign(param, {
        accesstoken: GETCOOKIEFUN("accesstoken")
      }))
      return window.Axios({
        methods: "get",
        url: "/api/globaldrugs/ypfxLeixingbm",
        params
      })
    },
    getYpfxYplx(state, param) {
      let params = _.cloneDeep(_.assign(param, {
        accesstoken: GETCOOKIEFUN("accesstoken")
      }))
      return window.Axios({
        methods: "get",
        url: "/api/globaldrugs/ypfxYplx",
        params
      })
    },
    getYpfxTssp(state, param) {
      let params = _.cloneDeep(_.assign(param, {
        accesstoken: GETCOOKIEFUN("accesstoken")
      }))
      return window.Axios({
        methods: "get",
        url: "/api/globaldrugs/ypfxTssp",
        params
      })
    },
    getYpfxZlly(state, param) {
      let params = _.cloneDeep(_.assign(param, {
        accesstoken: GETCOOKIEFUN("accesstoken")
      }))
      return window.Axios({
        methods: "get",
        url: "/api/globaldrugs/ypfxZlly",
        params
      }).catch(err => console.log(err))
    },
    getYpfxBdph(state, param) {
      let params = _.cloneDeep(_.assign(param, {
        accesstoken: GETCOOKIEFUN("accesstoken")
      }))
      return window.Axios({
        methods: "get",
        url: "/api/globaldrugs/ypfxBdph",
        params
      })
    },
    getYpfxYpzsyzph(state, param) {
      let params = _.cloneDeep(_.assign(param, {
        accesstoken: GETCOOKIEFUN("accesstoken")
      }))
      return window.Axios({
        methods: "get",
        url: "/api/globaldrugs/ypfxYpzsyzph",
        params
      })
    },
    getYpfxZysyzph(state, param) {
      let params = _.cloneDeep(_.assign(param, {
        accesstoken: GETCOOKIEFUN("accesstoken")
      }))
      return window.Axios({
        methods: "get",
        url: "/api/globaldrugs/ypfxZysyzph",
        params
      })
    },
    getYpfxZzsyzph(state, param) {
      let params = _.cloneDeep(_.assign(param, {
        accesstoken: GETCOOKIEFUN("accesstoken")
      }))
      return window.Axios({
        methods: "get",
        url: "/api/globaldrugs/ypfxZzsyzph",
        params
      })
    },
    getYpfxYydwph(state, param) {
      let params = _.cloneDeep(_.assign(param, {
        accesstoken: GETCOOKIEFUN("accesstoken")
      }))
      return window.Axios({
        methods: "get",
        url: "/api/globaldrugs/ypfxYydwph",
        params
      })
    },
    getYpfxBdzyjzfl(state, param) {
      let params = _.cloneDeep(_.assign(param, {
        accesstoken: GETCOOKIEFUN("accesstoken")
      }))
      return window.Axios({
        methods: "get",
        url: "/api/globaldrugs/ypfxBdzyjzfl",
        params
      })
    },
    getYpfxBdlx(state, param) {
      let params = _.cloneDeep(_.assign(param, {
        accesstoken: GETCOOKIEFUN("accesstoken")
      }))
      return window.Axios({
        methods: "get",
        url: "/api/globaldrugs/ypfxBdlx",
        params
      })
    },
    getYpfxBdzgyfjd(state, param) {
      let params = _.cloneDeep(_.assign(param, {
        accesstoken: GETCOOKIEFUN("accesstoken")
      }))
      return window.Axios({
        methods: "get",
        url: "/api/globaldrugs/ypfxBdzgyfjd",
        params
      })
    },
    getYpfxBdrdSelect(state, param) {
      let params = _.cloneDeep(_.assign(param, {
        accesstoken: GETCOOKIEFUN("accesstoken")
      }))
      return window.Axios({
        methods: "get",
        url: "/api/globaldrugs/ypfxBdrdSelect",
        params
      })
    },
    getYpfxSyzrdSelect(state, param) {
      let params = _.cloneDeep(_.assign(param, {
        accesstoken: GETCOOKIEFUN("accesstoken")
      }))
      return window.Axios({
        methods: "get",
        url: "/api/globaldrugs/ypfxBdrdSelect",
        params
      })
    },
    getYpfxBdrd(state, param) {
      let params = _.cloneDeep(_.assign(param, state.state.ypfxBdrd_param, {
        accesstoken: GETCOOKIEFUN("accesstoken")
      }));
      return window.Axios({
        methods: "get",
        url: "/api/globaldrugs/ypfxBdrd",
        params
      })
    },
    getSyzfxZlly(state, param) {
      let params = _.cloneDeep(_.assign(param, {
        accesstoken: GETCOOKIEFUN("accesstoken")
      }));
      return window.Axios({
        methods: "get",
        url: "/api/globaldrugs/syzfxZlly",
        params
      })
    },
    getSyzfxSyzlx(state, param) {
      let params = _.cloneDeep(_.assign(param, {
        accesstoken: GETCOOKIEFUN("accesstoken")
      }));
      return window.Axios({
        methods: "get",
        url: "/api/globaldrugs/syzfxSyzlx",
        params
      })
    },
    getSyzfxSyzzgyfjd(state, param) {
      let params = _.cloneDeep(_.assign(param, {
        accesstoken: GETCOOKIEFUN("accesstoken")
      }));
      return window.Axios({
        methods: "get",
        url: "/api/globaldrugs/syzfxSyzzgyfjd",
        params
      })
    },
    getSyzfxSyzrd(state, param) {
      let params = _.cloneDeep(_.assign(param, state.state.syzfxSyzrd_param, {
        accesstoken: GETCOOKIEFUN("accesstoken")
      }));
      return window.Axios({
        methods: "get",
        url: "/api/globaldrugs/syzfxSyzrd",
        params
      })
    },
    yfjdParams(state, Payload) {
      state.commit("yfjdParams", Payload);
    },
    // 普通搜索 和 高级搜索 通用方法
    nomalSearch(state, Payload) {
      state.commit("listLoading", true);
      if (!this.iffirstCommonIn) {
        state.commit("fourth", state.state.fourth_checked);
      }
      this.iffirstCommonIn = false;
      // 确定api的url
      if (Payload !== undefined) {
        if (Payload.path) {
          state.commit("path", Payload.path);
        }
      }
      let param = {}; // 储存axios获取数据的API参数
      // state.state.putong = {}
      // state.state.shaixuan = {}

      // 避免ename和其他普通搜索添加同时被带入搜索
      if (state.state.query.length > 1) {
        _.remove(state.state.query, function (n) {
          return n.name == "ename";
        });
      }
      // if (state.state.query && state.state.query.length != 0) {
      // state.commit("putong", state.state.query)
      // }
      if (Payload && !Payload.queryToPutong) {
        // 不把query的状态传给putong
      } else {
        // console.log("查询内容：",state.state.query)
        state.commit("putong", state.state.query);
      }
      state.commit("gaoji", state.state.conditions);
      state.commit("gaojifilter", state.state.conditionsFilter);
      state.commit("shaixuan", state.state.groups);
      state.commit('hot', state.state.hot_checked)
      let swords = state.state.gaoji;
      let sfilterWords = state.state.gaojifilter
      let sparam = state.state.putong;
      let sgroup = state.state.shaixuan;
      let sfourth = state.state.fourth;
      let shot = state.state.hot
      console.log(sfilterWords);
      if (state.state.gaoji.words || state.state.gaojifilter.filterWords) {
        param = (Payload && Payload.params) ? _.assign({}, sfourth, swords, sfilterWords, sgroup, shot, Payload.params) : _.assign({}, sfourth, swords, sfilterWords, sgroup, shot, {
          page: 1,
          pageSize: state.state[(state.state.tabname === 'first' ? 'ypll' : state.state.tabname === 'projectGroup' ? 'xmjz' : state.state.tabname === 'companyGroup' ? 'qyll' : state.state.tabname === 'targetGroup' ? 'bdll' : 'syzll') + '_param'].pageSize
        })
      } else {
        param = (Payload && Payload.params) ? _.assign({}, sfourth, sparam, sgroup, shot, Payload.params) : _.assign({}, sfourth, sparam, sgroup, shot, {
          page: 1,
          pageSize: state.state[(state.state.tabname === 'first' ? 'ypll' : state.state.tabname === 'projectGroup' ? 'xmjz' : state.state.tabname === 'companyGroup' ? 'qyll' : state.state.tabname === 'targetGroup' ? 'bdll' : 'syzll') + '_param'].pageSize
        })
      }
      //关键词统计方法
      param = _.assign(param, this.vue.searchKeywords(state.state, Payload))

      // 当没有跟其他参数时，正常搜索，回到第一页
      if (!Payload || Payload === state.state.putong) {
        // if (!this.vue.isEqual('globaldrugs', param, false)) {
        //   state.commit('kshRes', {
        //     noClear: true
        //   })
        // }

        state.commit('res1', [])
        state.commit('res2', [])
        state.commit('res3', [])
        state.commit('res4', [])
        state.commit('res5', [])
        state.commit('order', {})
        state.state.ypll_param.page = 1
        state.state.ypll_param.order = null
        state.state.xmjz_param.page = 1
        state.state.xmjz_param.order = null
        state.state.qyll_param.page = 1
        state.state.qyll_param.order = null
        state.state.bdll_param.page = 1
        state.state.bdll_param.order = null
        state.state.syzll_param.page = 1
        state.state.syzll_param.order = null
      }
      let paramAfter = _.omit(param, ['order', 'page', 'pageSize'])
      if (Qs.stringify(state.state.search_api_param) != Qs.stringify(paramAfter)) {
        state.commit('res1', [])
        state.commit('res2', [])
        state.commit('res3', [])
        state.commit('res4', [])
        state.commit('res5', [])
        state.commit('order', {})
      }
      state.commit('search_api_param', paramAfter)
      if (param.order == null) {
        this.vue.getSearchParams('globaldrugs', state, param, null, Payload)
      }
      // this.vue.getSearchParams("globaldrugs", state, param);
      return window
        .Axios({
          method: "get",
          url: state.state.path,
          params: _.assign(param, {
            accesstoken: GETCOOKIEFUN("accesstoken")
          })
        })
        .then(async res => {
          if (res.data.code === 200 && res.data) {
            let data = res.data.data;
            state.commit("error", 0);
            //二级列表数据关联到一级列表数据
            let addSecData = (state.state.tabname != 'first' || state.state.tabname != 'projectGroup') && data.res ? data.res.map((item) => {
              item.second = {}
              return item
            }) : []
            switch (state.state.tabname) {
              case 'first':
                state.commit('res1', data ? data : [])
                break
              case 'projectGroup':
                console.log(data);
                state.commit('res2', data ? data : [])
                break
              case 'companyGroup':
                state.commit('res3', addSecData)
                break
              case 'targetGroup':
                state.commit('res4', addSecData)
                break
              case 'indicationGroup':
                state.commit('res5', addSecData)
                break
              default:
                state.commit('res1', data.List ? data.List : [])
                break
            }

            state.commit("listLoading", false);
            return res;
          } else if (res.data.code == 404) {
            state.commit("error", 404);
            state.commit("listLoading", false);
          }
        })
        .catch(res => {
          state.commit("error", 500);
          state.commit("listLoading", false);
          return res.data.code;
        });
    },
    // 获取智能分析中的可视化数据
    async getKshRes(state) {
      console.time('开始')
      state.commit('analyLoading', true)
      // state.commit('bdfxLoading', true)
      // state.commit('syzfxLoading', true)

      let param = {} // 储存axios获取数据的API参数
      state.state.putongAnaly = {}
      state.state.gaojiAnaly = {}

      state.commit('putongAnaly', state.state.queryAnaly)

      state.commit('gaojiAnaly', state.state.conditionsAnaly)
      state.commit('shaixuanAnaly', state.state.groupsAnaly)

      let sparam = state.state.putongAnaly
      let swords = state.state.gaojiAnaly
      let sgroup = _.cloneDeep(state.state.shaixuanAnaly)
      if (Object.keys(sgroup).length > 0) {
        // 一个筛选条件需要两个字段传值给后端的数据 特殊处理
        // 获取当前的条件筛选项
        let filterStr = sgroup.filter_condition
        // 将当前条件筛选项用 _and拆分为数组
        let filterArr = filterStr && filterStr.split(" _and ")
        // 将包含zhuangtai的筛选项先排除掉
        let filterRes = filterArr && filterArr.filter((filterStr) => {
          return filterStr.indexOf('zhuangtai') < 0;
        });
        // 判断排除zhuangtai筛选项之后的条件筛选如果还存在则用 _and 拼接，如果不存在则重置为空字符串
        if (filterRes && filterRes.length > 0) {
          sgroup.filter_condition = filterRes.join(" _and ")
        } else {
          sgroup.filter_condition = ''
        }

        let zhuangtai = [],
          guifanzhuangtaizhongwen = [],
          zhuangtaiString = '',
          guifanzhuangtaizhongwenStr = ''

        // 遍历存储好的key值为zhuangtai的所有筛选项
        state.state.shaixuanNodesAnaly.length > 0 && state.state.shaixuanNodesAnaly.map(v => {
          // 判断param后端给出的唯一标识， 当param为zhuangtai时代表当前筛选项为zhuangtai并赋值给zhuangtai数组，否则为guifanzhuangtaizhongwen字段并赋值给guifanzhuangtaizhongwen数组
          if (v.param === 'zhuangtai') {
            zhuangtai.push(v.key)
          } else {
            guifanzhuangtaizhongwen.push(v.key)
          }
        })
        // 当zhuangtai筛选项大于0时，_and拼接
        if (zhuangtai.length > 0) {
          zhuangtaiString = `zhuangtai:${_.join(zhuangtai, 'ღ')}`
        }
        // 当guifanzhuangtaizhongwen筛选项大于0时，zhuangtai筛选项>0时，_or拼接
        if (guifanzhuangtaizhongwen.length > 0 && zhuangtai.length > 0) {
          guifanzhuangtaizhongwenStr = `;guifanzhuangtaizhongwen:${_.join(guifanzhuangtaizhongwen, 'ღ')}`
        }

        // 当guifanzhuangtaizhongwen筛选项大于0时，zhuangtai筛选项<0时，_and拼接
        if (guifanzhuangtaizhongwen.length > 0 && zhuangtai.length === 0) {
          guifanzhuangtaizhongwenStr = `guifanzhuangtaizhongwen:${_.join(guifanzhuangtaizhongwen, 'ღ')}`
        }
        let zhuangtaiStr = '';
        if (zhuangtaiString || guifanzhuangtaizhongwenStr) {
          if (sgroup.filter_condition) {
            zhuangtaiStr = ' _and zhuangtaiStr=' + zhuangtaiString + guifanzhuangtaizhongwenStr
          } else {
            zhuangtaiStr = 'zhuangtaiStr=' + zhuangtaiString + guifanzhuangtaizhongwenStr
          }
        }
        if (sgroup.filter_condition) {
          sgroup.filter_condition = sgroup.filter_condition + zhuangtaiStr
        } else {
          sgroup.filter_condition = zhuangtaiStr
        }

        // ..........结束
      }
      if (state.state.gaojiAnaly.words != '') {
        // 高级搜索条件 条件筛选条件 传过来的附加条件（如果有的话 => page pageSize order） - 进行组合
        param = _.assign({}, swords, sgroup)
      } else {
        // 普通搜索条件 条件筛选条件 传过来的附加条件（如果有的话 => page pageSize order） - 进行组合
        param = _.assign({}, sparam, sgroup)
      }
      //有调用getSearchParams方法isEqual加参false防止接口重复调用
      // if (!state.state.kshRes.noClear && !this.vue.isEqual('globaldrugs', param, false)) {
      //   state.commit('res1', [])
      //   state.commit('res2', [])
      //   state.commit('res3', [])
      //   state.commit('order', {})
      //   state.state.slh_paramAnaly.page = 1
      //   state.state.slh_paramAnaly.order = null
      //   state.state.ypmc_paramAnaly.page = 1
      //   state.state.ypmc_paramAnaly.order = null
      //   state.state.qy_paramAnaly.page = 1
      //   state.state.qy_paramAnaly.order = null
      //   state.state.species_paramAnaly.page = 1
      //   state.state.species_paramAnaly.order = null
      // }
      //关键词统计方法
      param = _.assign(param, this.vue.searchKeywords(state.state))
      let paramAfter = _.omit(param, ['order', 'page', 'pageSize'])
      state.commit('search_api_paramAnaly', paramAfter)
      // state.dispatch("nomalSearch")
      console.log(param, paramAfter);
      this.vue.getSearchParams('globaldrugs', state, param, 'visualizationNew')
      state.commit('paramAnaly', param)

      console.log(state);

      switch (state.state.panelIndex) {
        case 0:
          state.commit('topphaseLoading', true)
          state.commit('ypfxLeixingbmLoading', true)
          state.commit('ypfxYplxLoading', true)
          state.commit('ypfxTsspLoading', true)
          state.commit('ypfxYpzsyzphLoading', true)
          state.commit('ypfxZysyzphLoading', true)
          state.commit('ypfxZzsyzphLoading', true)
          state.commit('ypfxYydwphLoading', true)
          state.commit('ypfxYplxLoading', true)
          state.commit('ypfxTsspLoading', true)
          state.commit('ypfxYpzsyzphLoading', true)
          state.commit('ypfxZysyzphLoading', true)
          state.commit('ypfxZzsyzphLoading', true)
          state.commit('ypfxYydwphLoading', true)
          state.commit('ypfxZllyLoading', true)
          state.commit('ypfxBdphLoading', true)
          let axiosList = [
            // 最高研发阶段
            state.dispatch('getTopphase', param),
            // 药品分类
            state.dispatch('getYpfxLeixingbm', param)
          ],
            axiosList2 = [
              // 药品类型
              state.dispatch('getYpfxYplx', param),
              // 特殊审评
              state.dispatch('getYpfxTssp', param),
              // 靶点、治疗领域
              // 已批准适应症排行
              state.dispatch('getYpfxYpzsyzph', param),
              // 在研适应症排行
              state.dispatch('getYpfxZysyzph', param),
              // 终止适应症排行
              state.dispatch('getYpfxZzsyzph', param),
              // 原研单位排行
              state.dispatch('getYpfxYydwph', param)
            ],
            axiosList3 = [
              // 治疗领域
              state.dispatch('getYpfxZlly', param),
              // 靶点排行
              state.dispatch('getYpfxBdph', param)
            ]

          const that = this;
          try {
            Axios.all(axiosList).then(
              await Axios.spread((
                topphaseRes,
                ypfxLeixingbmRes,
              ) => {
                console.log(topphaseRes, ypfxLeixingbmRes);
                if (topphaseRes.data.code == 200 && this.vue.isEmpty(topphaseRes.data.data)) {
                  let data = topphaseRes.data.data;
                  state.commit('topphase', data)
                  state.commit('topphaseLoading', false)
                } else {
                  state.commit('topphaseLoading', false)
                }

                if (ypfxLeixingbmRes.data.code == 200 && this.vue.isEmpty(ypfxLeixingbmRes.data.data)) {
                  let data = ypfxLeixingbmRes.data.data;
                  state.commit('ypfxLeixingbm', data)
                  state.commit('ypfxLeixingbmLoading', false)
                } else {
                  state.commit('ypfxLeixingbmLoading', false)
                }
                state.commit('analyLoading', false)
                console.timeEnd('开始')
              })
            ).catch(err => {
              state.commit('topphaseLoading', false)
              state.commit('ypfxLeixingbmLoading', false)
              state.commit('analyLoading', false)
            })
          } catch (error) {
            console.log(error);
            state.commit('topphaseLoading', false)
            state.commit('ypfxLeixingbmLoading', false)
            state.commit('analyLoading', false)
          }
          try {
            Axios.all(axiosList2).then(
              await Axios.spread((
                ypfxYplxRes,
                ypfxTsspRes,
                ypfxYpzsyzphRes,
                ypfxZysyzphRes,
                ypfxZzsyzphRes,
                ypfxYydwphRes
              ) => {
                if (ypfxYplxRes.data.code == 200 && this.vue.isEmpty(ypfxYplxRes.data.data)) {
                  let data = ypfxYplxRes.data.data;
                  state.commit('ypfxYplx', data)
                  state.commit('ypfxYplxLoading', false)
                } else {
                  state.commit('ypfxYplxLoading', false)
                }

                if (ypfxTsspRes.data.code == 200 && this.vue.isEmpty(ypfxTsspRes.data.data)) {
                  let data = ypfxTsspRes.data.data;
                  state.commit('ypfxTssp', data)
                  state.commit('ypfxTsspLoading', false)
                } else {
                  state.commit('ypfxTsspLoading', false)
                }

                if (ypfxYpzsyzphRes.data.code == 200 && this.vue.isEmpty(ypfxYpzsyzphRes.data.data)) {
                  let data = ypfxYpzsyzphRes.data.data;
                  state.commit('ypfxYpzsyzph', data)
                  state.commit('ypfxYpzsyzphLoading', false)
                } else {
                  state.commit('ypfxYpzsyzphLoading', false)
                }

                if (ypfxZysyzphRes.data.code == 200 && this.vue.isEmpty(ypfxZysyzphRes.data.data)) {
                  let data = ypfxZysyzphRes.data.data;
                  state.commit('ypfxZysyzph', data)
                  state.commit('ypfxZysyzphLoading', false)
                } else {
                  state.commit('ypfxZysyzphLoading', false)
                }

                if (ypfxZzsyzphRes.data.code == 200 && this.vue.isEmpty(ypfxZzsyzphRes.data.data)) {
                  let data = ypfxZzsyzphRes.data.data;
                  state.commit('ypfxZzsyzph', data)
                  state.commit('ypfxZzsyzphLoading', false)
                } else {
                  state.commit('ypfxZzsyzphLoading', false)
                }

                if (ypfxYydwphRes.data.code == 200 && this.vue.isEmpty(ypfxYydwphRes.data.data)) {
                  let data = ypfxYydwphRes.data.data;
                  console.log(data);
                  state.commit('ypfxYydwph', data)
                  state.commit('ypfxYydwphLoading', false)
                } else {
                  state.commit('ypfxYydwphLoading', false)
                }
              })
            ).catch(err => {
              console.log(err);
              state.commit('ypfxYplxLoading', false)
              state.commit('ypfxTsspLoading', false)
              state.commit('ypfxYpzsyzphLoading', false)
              state.commit('ypfxZysyzphLoading', false)
              state.commit('ypfxZzsyzphLoading', false)
              state.commit('ypfxYydwphLoading', false)
            })
          } catch (error) {
            console.log(error);
            state.commit('ypfxYplxLoading', false)
            state.commit('ypfxTsspLoading', false)
            state.commit('ypfxYpzsyzphLoading', false)
            state.commit('ypfxZysyzphLoading', false)
            state.commit('ypfxZzsyzphLoading', false)
            state.commit('ypfxYydwphLoading', false)
          }
          try {
            Axios.all(axiosList3).then(
              await Axios.spread((
                ypfxZllyRes,
                ypfxBdphRes,
              ) => {
                if (ypfxZllyRes.data.code == 200 && this.vue.isEmpty(ypfxZllyRes.data.data)) {
                  let data = ypfxZllyRes.data.data;
                  state.commit('ypfxZlly', data)
                  state.commit('ypfxZllyLoading', false)
                } else {
                  state.commit('ypfxZllyLoading', false)
                }

                if (ypfxBdphRes.data.code == 200 && this.vue.isEmpty(ypfxBdphRes.data.data)) {
                  let data = ypfxBdphRes.data.data;
                  state.commit('ypfxBdph', data)
                  state.commit('ypfxBdphLoading', false)
                } else {
                  state.commit('ypfxBdphLoading', false)
                }

              })
            ).catch(err => {
              console.log(err);
              state.commit('ypfxZllyLoading', false)
              state.commit('ypfxBdphLoading', false)

            })
          } catch (error) {
            console.log(error);
            state.commit('ypfxZllyLoading', false)
            state.commit('ypfxBdphLoading', false)

          }
          break;
        case 1:
          state.commit('bdfxLoading', true)
          try {
            let axiosList2 = [
              // 靶点作用机制分类
              state.dispatch('getYpfxBdzyjzfl', param),
              // 靶点类型
              state.dispatch('getYpfxBdlx', param),
              // 靶点最高研发阶段
              state.dispatch('getYpfxBdzgyfjd', param),
              // 研发阶段下拉选项框数据项
              state.dispatch('getYpfxBdrdSelect', param),
              // 研发阶段列表
              state.dispatch('getYpfxBdrd', param),
            ]

            let res2 = await Promise.all(axiosList2);
            for (let i = 0; i < res2.length; i++) {
              let item = res2[i];
              if (item.data.code === 200 && item.data.data) {
                let data = item.data.data,
                  actions = [
                    'ypfxBdzyjzfl',
                    'ypfxBdlx',
                    'ypfxBdzgyfjd',
                    'ypfxBdrdSelect',
                    'ypfxBdrd'
                  ]
                if (i == res2.length - 1) {
                  state.commit('bdrdShowMore', data.length >= state.state.ypfxBdrd_param.pageSize)
                }
                state.commit(actions[i], data)
              }
            }
            state.commit('bdfxLoading', false)
            console.timeEnd('开始')
          } catch (error) {
            state.commit('bdfxLoading', false)
            console.log(error);
          }
          break;
        case 2:
          state.commit('syzfxLoading', true)
          try {
            let axiosList3 = [
              // 治疗领域
              state.dispatch('getSyzfxZlly', param),
              // 适应症类型
              state.dispatch('getSyzfxSyzlx', param),
              // 适应症最高研发阶段
              state.dispatch('getSyzfxSyzzgyfjd', param),
              // 研发阶段下拉选项框数据项
              state.dispatch('getYpfxSyzrdSelect', param),
              // 适应症热度
              state.dispatch('getSyzfxSyzrd', param),
            ]

            let res3 = await Promise.all(axiosList3);
            for (let i = 0; i < res3.length; i++) {
              let item = res3[i];
              if (item.data.code === 200 && item.data.data) {
                let data = item.data.data,
                  actions = [
                    'syzfxZlly',
                    'syzfxSyzlx',
                    'syzfxSyzzgyfjd',
                    'ypfxSyzrdSelect',
                    'syzfxSyzrd'
                  ]
                if (i == res3.length - 1) {
                  state.commit('syzrdShowMore', data.length >= state.state.syzfxSyzrd_param.pageSize)
                }
                state.commit(actions[i], data)
              }
            }
            state.commit('syzfxLoading', false)
            console.timeEnd('开始')
          } catch (error) {
            state.commit('syzfxLoading', false)
            console.log(error);
          }
          break;
      }
    },
    getGroupRes(state, Payload) {
      // 高级搜索不为空则使用高级搜索
      let param = {} // 储存axios获取数据的API参数

      let sparam = state.state.putong
      let swords = state.state.gaoji
      let sfilterWords = state.state.gaojifilter
      let sgroup = state.state.shaixuan
      let sfourth = state.state.fourth
      let shot = state.state.hot

      if (state.state.gaoji.words || state.state.gaojifilter.filterWords) {
        param = (Payload && Payload.params) ? _.assign({}, Payload.params, sfourth, swords, sfilterWords, sgroup, shot, Payload.params) : _.assign({}, sfourth, swords, sfilterWords, sgroup, shot, { page: 1, pageSize: state.state.param.pageSize })
      } else {
        param = (Payload && Payload.params) ? _.assign({}, Payload.params, sfourth, sparam, sgroup, shot, Payload.params) : _.assign({}, sfourth, sparam, sgroup, shot, { page: 1, pageSize: state.state.param.pageSize })
      }

      return window.Axios({
        method: 'get',
        url: Payload.path,
        params: param
      })
    },
    getFiled(state) {
      return window
        .Axios({
          method: "get",
          url: "/api/config/search?dbname=globaldrugs"
        })
        .then(res => {
          if (res.data.code === 200 && res.data) {
            let data = res.data.data;

            if (route.currentRoute.path === '/globaldrugs/analysis') {
              // 普通搜索项
              state.commit("nomalFiledAnaly", res.data.data.normal);
              state.commit('match_putongAnaly', data.normal)
              state.commit("filters1Analy", data.filter);
              let match_shaixuanAnaly_Obj = {};
              data.filter.length > 0 &&
                data.filter.forEach(item => {
                  match_shaixuanAnaly_Obj[item.field] = item.label;
                });
              state.commit("match_shaixuanAnaly", match_shaixuanAnaly_Obj);
            } else {
              // 普通搜索项
              state.commit("nomalFiled", res.data.data.normal);
              state.commit('match_putong', data.normal)
              // state.commit(
              //   "match_putong",
              //   res.data.data.normal.concat([
              //     {
              //       label: "词冠（干、尾）",
              //       name: "ename",
              //       placeholder: "",
              //       type: "text"
              //     }
              //   ])
              // );
              state.commit("filters1", data.filter);
              let match_shaixuan_Obj = {};
              data.filter.length > 0 &&
                data.filter.forEach(item => {
                  match_shaixuan_Obj[item.field] = item.label;
                });
              state.commit("match_shaixuan", match_shaixuan_Obj);
            }
          }
        });
    },
    getBaseInfo(state, Payload) {
      return window
        .Axios({
          method: "get",
          url: "/api/config/view?dbname=globaldrugs",
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

            state.commit("tableconf", data.tableconf);
            state.commit("allBase", data.baseconf);
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
                  state.state.nopms.visualization = true;
                  break;
                case "详情页":
                  state.state.nopms.read = true;
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
                case 'visualization':
                  state.state.nopms.visualization = true;
                  break
                case 'companygroup':
                  state.state.nopms.companygroup = true;
                  break
                case 'projectgroup':
                  state.state.nopms.projectgroup = true;
                  break
                case 'targetgroup':
                  state.state.nopms.targetgroup = true;
                  break
                case 'indicationgroup':
                  state.state.nopms.indicationgroup = true;
                  break
                case 'compare':
                  state.state.nopms.compare = true;
                  break
                case "getcg":
                  state.state.nopms.getcg = true;
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
  }
};
