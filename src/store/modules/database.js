import Vue from 'vue'
import Qs from 'qs'
import Lang from '@/i18n/lang/zh-CN.js'
import store from '@/store'

export default {
  namespaced: true,
  state: {
    allBase: {},
    refreshFilter: false, //强制刷新筛选列表
    resetObj: null,
    listLoading: true, // 控制表格中数据的加载清空
    error: 0, // 错误码
    database_name: '', // 数据库路径名
    path: '', // 维护当前搜索请求接口
    nomal_filed: [], // 普通搜索列举项
    advanced_filed: [], // 高级搜索列举项
    // 查询出的数量
    extendCount: 0,
    param: {
      pageSize: 20,
      page: 1,
      order: null
    },
    res1: {}, // 数据结果
    query: [], // 已选普通搜索查询条件 格式请查看readme.md
    queryStr: "", // 由于监听不到数组变化，需监听query时，转成字符串
    putong: [], // 普通搜索查询条件所用的储存对象（主要用于API前的处理）
    conditions: [], // 已选高级搜索查询条件 格式请查看readme.md
    gaoji: {}, // 高级搜索查询条件所用的储存对象（主要用于API前的处理）
    groups: {}, // 已选筛选条件
    groups_label: {},
    checked: {},
    shaixuan: {},
    filters: [], // 条件筛选结果
    filters1: [], // 添加问号标注添加条件筛选
    pageSize: '20', // 当前页显示条数（条/页）
    order: {}, // 查询的排序规则
    base_conf_nav_show: false,
    base_conf_nav: [],
    base_conf: {}, // 基本信息
    help_conf: {},
    extend_conf: [], // 详情页扩展信息
    info_conf: [], // 详情页基础信息
    tableconf: [], // 首页表头信息
    update_conf: [], // 更新时间信息
    // 匹配（已选条件）
    match_putong: {
      'comprehensive_drug': '综合搜索（药品）',
      'comprehensive_company': '综合搜索（企业）',
      'comprehensive_devices': '综合搜索（医疗器械）',
      'comprehensive_chinesemedicine': '综合搜索（中药材）',
      'comprehensive_targets': '综合搜索（靶点）',
      'comprehensive_disease': '综合搜索（疾病）',
      'comprehensive_food': '综合搜索（食品）',
      'comprehensive_cosmetics': '综合搜索（化妆品）',
    },
    match_gaoji: {},
    match_shaixuan: {},
    match_shaixuan_values: {},
    search_api_param: {},
    saved_options: [],
    fourth: {},
    iffirstCommonIn: true, //连接跳转搜索进这个界面
    fourth_checked: {},
    nopms: {
      'list': [],
      'detail': [],
    },
    norules: {},
    hasHighSearch: false, //当前库是否有高级搜素
    structuralsType: 0, //化学式专用
    structuralsParams: {},
    hot_filter_filed: {},
  },
  mutations: {
    reset(state, Payload) {
      state.resetObj = _.assign({}, state)
    },
    refreshFilter(state, Payload) {
      state.refreshFilter = Payload
    },
    handleReset(state, Payload) {
      // state.resetObj = null
      state.listLoading = true
      state.error = 0
      state.database_name = ''
      state.path = ''
      state.nomal_filed = []
      state.advanced_filed = []
      state.extendCount = 0
      state.param = {
        pageSize: 20,
        page: 1,
        order: null
      }
      state.res1 = {}
      state.query = []
      state.putong = []
      state.conditions = []
      state.gaoji = {}
      state.groups = {}
      state.groups_label = {}
      state.checked = {}
      state.shaixuan = {}
      state.filters = []
      state.pageSize = '20'
      state.order = {}
      state.base_conf = {}
      state.base_conf_nav_show = false
      state.base_conf_nav = []
      state.help_conf = {}
      state.extend_conf = []
      state.info_conf = []
      state.tableconf = []
      state.update_conf = []
      state.match_putong = {
        'comprehensive_drug': '综合搜索（药品）',
        'comprehensive_company': '综合搜索（企业）',
        'comprehensive_devices': '综合搜索（医疗器械）',
        'comprehensive_chinesemedicine': '综合搜索（中药材）',
        'comprehensive_targets': '综合搜索（靶点）',
        'comprehensive_disease': '综合搜索（疾病）',
        'comprehensive_food': '综合搜索（食品）',
        'comprehensive_cosmetics': '综合搜索（化妆品）',
      }
      state.match_gaoji = {}
      state.match_shaixuan = {}
      state.match_shaixuan_values = {}
      state.search_api_param = {}
      state.saved_options = []
      state.fourth = {}
      state.nopms = {
        'list': [],
        'detail': [],
      }
      state.norules = {}
    },
    setHighStatus(state, Payload) {
      state.hasHighSearch = Payload
    },
    nopms(state, Payload) {
      state.nopms = Payload
    },
    norules(state, Payload) {
      state.norules = Payload
    },
    fourth_checked(state, Payload) {
      state.fourth_checked = Payload
    },
    fourth(state, Payload) {
      if (Payload instanceof Array) {
        this.iffirstCommonIn = true;
      } else {
        this.iffirstCommonIn = false;
      }

      let fourth_condition = ""
      _.map(Payload, (item, index) => {
        if (index == 0) {
          fourth_condition = item.logic + ' ' + item.name + "=" + item.value
        } else {
          fourth_condition += ' ' + item.logic + ' ' + item.name + "=" + item.value
        }
      })
      state.fourth = fourth_condition ? {
        "fourth_condition": fourth_condition
      } : {}
    },
    saved_options(state, Payload) {
      state.saved_options = Payload
    },
    search_api_param(state, Payload) {
      let obj = _.omit(Payload, ['order', 'page', 'pageSize'])
      state.search_api_param = obj
    },
    match_putong(state, Payload) {
      // state.match_putong = Payload
      for (let item of Payload) {
        _.set(state.match_putong, item.name, item.label)
      }
    },
    match_gaoji(state, Payload) {
      // state.match_gaoji = Payload
      for (let item of Payload) {
        _.set(state.match_gaoji, item.name, item.label)
      }
    },
    match_shaixuan(state, Payload) {
      // state.match_shaixuan = Payload
      for (let key in Payload) {
        _.set(state.match_shaixuan, key, Payload[key].label)
      }
    },
    match_shaixuan_values(state, Payload) {
      state.match_shaixuan_values = Payload
    },
    listLoading(state, Payload) {
      state.listLoading = Payload
    },
    error(state, Payload) {
      state.error = Payload;
    },
    extendCount(state, Payload) {
      state.extendCount = Payload
    },
    paramPage(state, Payload) {
      state.param.page = Payload
    },
    paramPagesize(state, Payload) {
      state.param.pageSize = Payload
    },
    param(state, Payload) {
      state.param = Payload
    },
    base_conf(state, Payload) {
      state.base_conf = Payload
    },
    base_conf_nav_show(state, Payload) {
      state.base_conf_nav_show = Payload
    },
    base_conf_nav(state, Payload) {
      let navs = []
      if (Payload) {
        let navs_bofore = String(Payload).split(";")
        for (let item of navs_bofore) {
          let obj = {
            "label": String(item).split(":")[0],
            "url": String(item).split(":")[1]
          }
          navs.push(obj)
        }
      }
      state.base_conf_nav = navs
    },
    help_conf(state, Payload) {
      state.help_conf = Payload
    },
    extend_conf(state, Payload) {
      state.extend_conf = Payload
    },
    info_conf(state, Payload) {
      state.info_conf = Payload
    },
    allBase(state, Payload) {
      state.allBase = Payload
    },
    tableconf(state, Payload) {
      for (let item of Payload) {
        if (item.hidden) {
          item = _.assign(item, {
            'checked': false
          })
        } else {
          item = _.assign(item, {
            'checked': true
          })
        }
      }
      state.tableconf = Payload
    },
    update_conf(state, Payload) {
      state.update_conf = Payload
    },
    query(state, Payload) {
      // opt=1增加条件 或 替换已有条件
      if (Payload.opt && Payload.opt == 1) {
        if (state.query.length == 0) {
          state.query.push(Payload.param)
        } else {
          for (let i = 0, l = state.query.length; i < l; i++) {
            if (Payload.param.name == state.query[i].name) {
              if (Payload.param.value == '' || Payload.param.value == ":" || Payload.param.value == undefined) { // **清除**此条件
                //将无效的输入条件移除
                _.remove(state.query, n => {
                  return n.name.indexOf(Payload.param.name) == 0
                })
              } else { // **替代**此条件
                state.query[i] = Payload.param
              }
              break
            } else {
              if (i == l - 1) {
                state.query.push(Payload.param)
                break
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
      state.queryStr = JSON.stringify(state.query)
    },
    putong(state, Payload) {
      if (Payload) {
        if (Payload.length) {
          let obj = {}
          for (let i = 0; i < Payload.length; i++) {
            let iname = Payload[i].name
            let ilabel = Payload[i].label
            let iaccurate = Payload[i].accurate
            let pivalue = Payload[i].value
            let atcs_sel = Payload[i].atcs_sel
            //atc多分类
            if (atcs_sel) {
              obj.atcs_sel = 1
            };

            if (pivalue) {
              _.set(obj, (iaccurate ? iname + '_eq' : iname), pivalue)
            } else {
              _.omit(obj, (iaccurate ? iname + '_eq' : iname))
            }
          }
          state.putong = obj
        } else {
          state.putong = {}
        }
      }
    },
    conditions(state, Payload) {
      state.conditions = Payload
    },
    gaoji(state, Payload) {
      let words = ""
      let atcs_sel = false
      _.map(Payload, (item, index) => {
        if (item.value) { // 去空
          if (item.atcs_sel) {
            atcs_sel = true
          };
          if (index == 0) {
            words = item.value.length ? (item.logic + ' ' + (item.accurate ? item.name + "_eq" : item.name) + "=" + (_.isArray(item.value) ? _.join(_.map(item.value, (n) => {
              return n
            }), 'ღ') : item.value)) : ''
          } else {
            words += item.value.length ? (' ' + item.logic + ' ' + (item.accurate ? item.name + "_eq" : item.name) + "=" + (_.isArray(item.value) ? _.join(_.map(item.value, (n) => {
              return n
            }), 'ღ') : item.value)) : ''
          }
        }
      })
      words = words.trim();
      state.gaoji = atcs_sel ? {
        'words': words,
        'atcs_sel': 1
      } : {
        'words': words
      }
    },
    groups(state, Payload) {
      state.groups = Payload
    },
    groups_label(state, Payload) {
      state.groups_label = Payload
    },
    checked(state, Payload) {
      state.checked = Payload
    },
    shaixuan(state, Payload) {
      let group = ""

      _.map(Payload, (item, index) => {
        index = index.replace('_eq', '')
        if (item.length > 0) { // 去空
          let eqStr = (location.href.includes("yuanliaoxinxi") ? '=' : "_eq=")
          if (group == "") {
            group = index + eqStr + _.join(item, 'ღ')
          } else {
            group += ' ' + "_and" + ' ' + index + eqStr + _.join(item, 'ღ')
          }
        }
      })

      if (group != "") {
        //return {filter_condition: Qs.stringify(group,{ encodeValuesOnly: false })}
        state.shaixuan = {
          "filter_condition": group
        }
      } else {
        state.shaixuan = {}
      }
    },
    fourth_condition(state, Payload) {
      state.fourth_condition = Payload
    },
    fourth_checked(state, Payload) {
      state.fourth_checked = Payload
    },
    database_name(state, Payload) {
      state.database_name = Payload
    },
    path(state, Payload) {
      state.path = Payload
    },
    order(state, Payload) {
      state.order = Payload
    },
    // 普通搜索项
    nomalFiled(state, Payload) {
      state.nomal_filed = Payload
    },
    // 高级搜索项
    advancedFiled(state, Payload) {
      state.advanced_filed = Payload
    },
    // 条件筛选结果
    filters(state, Payload) {
      // for (let key in Payload) {
      //   _.set(state.filters, key, Payload[key].data)
      // }
      state.filters = Payload
    },
    // 添加问号标注添加条件筛选
    filters1(state, Payload) {
      state.filters1 = Payload
    },
    /*
     * 注册数据 - API数据
     */
    // 按受理号查询的API数据
    res1(state, Payload) {
      state.res1 = Payload;
    },
    //化学式专用
    setStructuralsType(state, Payload) {
      state.structuralsType = Payload;
    },
    setStructuralsParams(state, Payload) {
      state.structuralsParams = Payload;
    },
    hot_filter_filed(state, Payload) {
      state.hot_filter_filed = Payload
    },
  },
  actions: {
    reset(state, Payload) {
      state.commit("handleReset")
    },
    // 前置：获取路径名
    getApiAddress(state, Payload) {
      let path = Payload.split('/')[1]
      state.commit("database_name", path)
      state.commit("path", "/api/" + path)
    },
    // 普通搜索 和 高级搜索 通用方法
    nomalSearch(state, Payload) {
      if (!this.iffirstCommonIn) {
        state.commit("fourth", state.state.fourth_checked);
      }
      this.iffirstCommonIn = false;

      state.commit("listLoading", true)
      // 确定api的url
      if (Payload !== undefined) {
        if (Payload.path) {
          state.commit("path", Payload.path)
        }
        if (Payload.hxs) {
          state.commit("paramPage", 1)
        }
      } else {
        state.commit("path", "/api/" + state.state.database_name)
      }

      let param = {} // 储存axios获取数据的API参数
      // state.state.putong = {}
      // state.state.gaoji = {}

      // if (state.state.query && state.state.query.length != 0) {
      // state.commit("putong", state.state.query)
      // state.commit("queryStr")
      // }
      if (Payload && !Payload.queryToPutong) { // 不把query的状态传给putong
      } else {
        // console.log("查询内容：",state.state.query)
        state.commit('putong', state.state.query)
        state.commit("queryStr")
      }

      state.commit("gaoji", state.state.conditions)
      state.commit("shaixuan", state.state.groups)

      let sparam = state.state.putong
      let swords = state.state.gaoji
      let sgroup = state.state.shaixuan
      let sfourth = state.state.fourth

      if (state.state.gaoji.words) {
        param = (Payload && Payload.params) ? _.assign({}, sfourth, swords, sgroup, Payload.params) : _.assign({}, sfourth, swords, sgroup, {
          page: 1,
          pageSize: state.state.param.pageSize
        })
      } else {
        param = (Payload && Payload.params) ? _.assign({}, sfourth, sparam, sgroup, Payload.params) : _.assign({}, sfourth, sparam, sgroup, {
          page: 1,
          pageSize: state.state.param.pageSize
        })
      }

      let tmpObj = this.vue.searchKeywords(state.state, Payload);

      for (let [key, val] of Object.entries(tmpObj)) {
        if (val == "undefined" || val == undefined) delete tmpObj[key];
      }

      //关键词统计方法
      param = _.assign(param, tmpObj);

      let paramAfter = _.omit(param, ['order', 'page', 'pageSize'])
      if (Qs.stringify(state.state.search_api_param) != Qs.stringify(paramAfter)) {
        state.commit("res1", [])
        state.commit('order', {})
        state.state.param.order = null
      }
      state.commit("search_api_param", paramAfter)

      let type = (Payload && Payload.type) ? Payload.type : 'get'
      // 当没有跟其他参数时，正常搜索，或者 结构式检索 回到第一页
      if (!Payload) {
        state.commit("paramPage", 1)
        state.commit("res1", [])
        state.commit('order', {})
        state.state.param.order = null
      }
      //杂质-对照品数据库有搜索条件时加个默认排序
      if (state.state.database_name === 'biaozhundb' && Object.keys(param).filter(key => key !== 'page' && key !== 'pageSize' && key !== 'order').length) {
        if (!param.order) {
          param.order = 'wenjianming desc'
          state.commit("param", Object.assign({}, state.state.param, {
            order: 'wenjianming desc'
          }))
        }
      } else if (state.state.database_name === 'biaozhundb' && state.state.param.order) {
        state.commit("param", Object.assign({}, state.state.param, {
          order: null
        }))
      }
      this.vue.getSearchParams(state.state.database_name, state, param)
      let that = this
      return window.Axios({
        method: type,
        // url: state.state.path === '/api/chufang' ? '/api/zcycf' : state.state.path,
        url: state.state.path,
        params: _.assign(param, {
          accesstoken: GETCOOKIEFUN("accesstoken")
        })
      }).then(async res => {
        if (res.data.code === 200 && res.data) {
          let data = res.data.data
          state.commit("error", 0)
          if (data.count || data.count === 0) {
            state.commit("extendCount", data.count)
          } else {
            state.commit("extendCount", 0)
          }
          state.commit("refreshFilter", false)
          // 千分位配置设置开始（千分位举例：123,456每三位逗号隔开）
          await this.vue.thousandSet(data.res, 'Database').then(value => {
            data.res = value
          })
          // 千分位配置设置结束
          state.commit("res1", data.res ? data.res : [])

          state.commit("listLoading", false)

          //辅助与重点监控用药模块统计量偶现0的情况日志埋点
          if (state.state.database_name == 'monitored') {
            let obj = {
              handlerType: 'refresh',
              handlerTypeDesc: '访问辅助与重点监控用药模块，验证统计量是否正常',
              list: data.count,
              token: GETCOOKIEFUN("accesstoken")
            }
            that.vue.frontEndLog(state.state.path, obj)
          } else if (state.state.database_name == 'biaozhun') {
            let obj = {
              handlerType: 'refresh',
              handlerTypeDesc: '数据库详情点击扩展跳转无数据',
              list: data.count,
              token: GETCOOKIEFUN("accesstoken")
            }
            that.vue.frontEndLog(state.state.path, obj)
          }

          return res
        } else if (res.data.code == 404) {
          // 显示数值归零
          state.commit("extendCount", 0)
          state.commit("res1", [])
          state.commit("error", 404)
          state.commit("listLoading", false)
        }
      }).catch((res) => {
        state.commit("extendCount", 0)
        state.commit("res1", [])
        state.commit("error", 500)
        state.commit("listLoading", false)
        return res.data.code
      })
    },
    // 获取普通 或 高级搜索项
    getFiled(state) {
      return window.Axios({
        method: 'get',
        url: '/api/config/search?dbname=' + state.state.database_name
      }).then(res => {
        if (res.data.code === 200 && res.data) {
          let data = res.data.data
          // 普通搜索项
          let normal = data.normal
          _.forEach(normal, (item) => {
            if (item.type === "select") {
              item.value = _.map(item.value, (obj) => {
                obj.value = obj.value.toString()
                return obj
              })
            };
          })
          state.commit("nomalFiled", normal)
          state.commit("match_putong", normal)
          state.commit("setHighStatus", res.data.data.high)
          // 添加问号标注添加条件筛选
          state.commit("filters1", data.filter)
        }
      })
    },
    // 获取各表头和左栏
    getConf(state, Payload) {
      if (Payload) {
        state.dispatch("getApiAddress", Payload)
      }
      return window.Axios({
        method: 'get',
        url: '/api/config/view?dbname=' + state.state.database_name,
        params: {
          accesstoken: GETCOOKIEFUN("accesstoken")
        }
      }).then(res => {
        if (res.data.code === 200 && res.data) {
          let data = res.data.data
          // 更改document.title
          if (data.baseconf.dbname) {
            store.commit("Normal/dbname", data.baseconf.dbname)
          }
          state.commit('allBase', data.baseconf) //
          state.commit("base_conf", data.baseconf)
          state.commit("help_conf", data.helpconf)
          state.commit("extend_conf", data.extendconf)
          state.commit("info_conf", data.infoconf)
          state.commit("tableconf", data.tableconf)
          state.commit("update_conf", data.updatelog)
          // 设置关联快捷入口
          state.commit("base_conf_nav_show", data.baseconf.open_nav == 1 ? true : false)
          state.commit("base_conf_nav", data.baseconf.nav_link ? data.baseconf.nav_link : "")

          // 权限处理 start
          state.commit("norules", data.norules)
          for (let item of state.state.norules.common) {
            switch (item.name) {
              case '高级搜索':
                state.state.nopms.gjss = true;
                break;
              case '条件筛选':
                state.state.nopms.tjsx = true;
                break;
              case '可视化':
                state.state.nopms.ksh = true;
                break;
              case '详情页':
                state.state.nopms.xqy = true;
                break;
              case '导出(默认300)':
                state.state.nopms.dc = true;
                break;
              case '翻页(最大75)':
                state.state.nopms.fy = true;
                break;
              case '热点搜索':
                state.state.nopms.rdss = true;
                break;
            }
          }

          for (let item of state.state.norules.exclusive) {
            switch (item.action) {
              case 'rss':
                state.state.nopms.rss = true;
                break;
            }
          }

          state.state.nopms.list = data.norules.list
          state.state.nopms.detail = data.norules.detail
          // 权限处理 end
        }
      }).catch(err => {
        console.log(err)
      })
    },
  }
}
