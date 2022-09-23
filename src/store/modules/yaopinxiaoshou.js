import Vue from 'vue'
import Qs from 'qs'
import store from '@/store'

export default {
  namespaced: true,
  state: {
    source: 1,
    nowNav: '', // 定量分析打开选择项
    listLoading: true, // 控制表格中数据的加载清空
    analyLoading: true,
    error: 0, // 错误码
    tabname: "first", // 表示目前处于按那种方式浏览/first（销售年份）/getnamelist（药品通用名）/getqylist（企业名称）
    path: '/api/ypxs', // 维护当前搜索请求接口
    nomal_filed: [], // 普通搜索列举项
    advanced_filed: [], // 高级搜索列举项
    // 按销售年份浏览/按药品通用名浏览/按企业名称浏览 - 查询出的数量
    extendCount: {
      listCount: 0,
      nameCount: 0,
      qiyeCount: 0
    },
    res1: {}, // 按受理号查询的结果
    res2: [], // 按药品名称查询的结果
    res3: [], // 按企业名称查询的结果
    query: [], // 已选普通搜索查询条件 格式请查看readme.md
    queryStr: "",
    putong: {}, // 普通搜索查询条件所用的储存对象（主要用于API前的处理）
    conditions: [], // 已选高级搜索查询条件 格式请查看readme.md
    gaoji: {}, // 高级搜索查询条件所用的储存对象（主要用于API前的处理）
    groups: {}, // 已选筛选条件
    shaixuan: {},
    filters: {}, // 条件筛选结果
    filters1: {}, // 条件筛选结果
    pageSize: "20", // 当前页显示条数（条/页）
    order: {}, // 查询的排序规则
    // svalue: [], // 高级搜索中：select组件的选择value
    xsnf_param: { // 按销售年份查询页的附加参数
      order: null, // 排序
      page: 1, // 页数
      pageSize: 20, // 每页条数
    },
    ypmc_param: { // 按药品通用名查询页的附加参数
      order: null, // 排序
      page: 1, // 页数
      pageSize: 20, // 每页条数
    },
    qy_param: { // 按企业查询页的附加参数
      order: null, // 排序
      page: 1, // 页数
      pageSize: 20, // 每页条数
    },
    // 可视化结果
    kshResNum: {},
    kshRes1: [],
    kshRes2: [],
    kshRes3: [],
    kshRes4: [],
    // 定量分析
    default_fenxi_yp_name: '(carbidopa;levodopa;entacapone)/entacapone',
    default_fenxi_qy_name: 'ABBOTT LABORATORIES(雅培)',
    fenxi_yp_name: '', // (carbidopa;levodopa;entacapone)/entacapone
    from: '', // 区分analy和list中点过去的药品分析、企业分析 解决问题：【ID1013147】、【ID1010426】
    fenxi_qy_name: '', // ABBOTT LABORATORIES(雅培)
    fenxi_yp: [], // 药品分析
    fenxi_qy: [], // 企业分析
    yp_selects1: [],
    yp_selects2: [],
    yp_selects3: [],
    qy_selects1: [],
    qy_selects2: [],
    qy_selects3: [],
    // 匹配
    match_putong: {
      'comprehensive_drug': '综合搜索（药品）',
      'comprehensive_company': '综合搜索（企业）',
      'comprehensive_devices': '综合搜索（医疗器械）',
      'comprehensive_chinesemedicine': '综合搜索（中药材）',
      'comprehensive_targets': '综合搜索（靶点）',
      'comprehensive_disease': '综合搜索（疾病）',
    },
    match_gaoji: {},
    // match_shaixuan: {
    //   'year': '数据年份',
    // },
    match_shaixuan: {},
    match_shaixuan_values: {},
    search_api_param: {},
    saved_options: [],
    allBase: {},
    tableconf: [],
    helpInfo: {},
    update_conf: [],
    fourth: {},
    nopms: {
      'list': [],
      'detail': [],
    },
    isGetCount: true,
    norules: {},
    noClear: true
  },
  mutations: {
    nopms(state, Payload) {
      state.nopms = Payload
    },
    norules(state, Payload) {
      state.norules = Payload
    },
    fourth(state, Payload) {
      let fourth_condition = ""
      _.map(Payload, (item, index) => {
        if (index == 0) {
          fourth_condition = item.logic + ' ' + item.name + "=" + item.value
        } else {
          fourth_condition += ' ' + item.logic + ' ' + item.name + "=" + item.value
        }
      })
      state.fourth = fourth_condition ? { "fourth_condition": fourth_condition } : {}
    },
    allBase(state, Payload) {
      state.allBase = Payload
    },
    tableconf(state, Payload) {
      state.tableconf = Payload
    },
    helpInfo(state, Payload) {
      state.helpInfo = Payload
    },
    update_conf(state, Payload) {
      state.update_conf = Payload
    },
    yp_selects1(state, Payload) {
      let arr = []
      for (let item of Payload) {
        arr.push(item)
      }
      state.yp_selects1 = arr
    },
    yp_selects2(state, Payload) {
      let arr = []
      for (let item of Payload) {
        arr.push(item)
      }
      state.yp_selects2 = arr
    },
    yp_selects3(state, Payload) {
      let arr = []
      for (let item of Payload) {
        arr.push(item)
      }
      state.yp_selects3 = arr
    },
    qy_selects1(state, Payload) {
      let arr = []
      for (let item of Payload) {
        arr.push(item)
      }
      state.qy_selects1 = arr
    },
    qy_selects2(state, Payload) {
      let arr = []
      for (let item of Payload) {
        arr.push(item)
      }
      state.qy_selects2 = arr
    },
    qy_selects3(state, Payload) {
      let arr = []
      for (let item of Payload) {
        arr.push(item)
      }
      state.qy_selects3 = arr
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
      state.match_shaixuan = Payload
    },
    match_shaixuan_values(state, Payload) {
      state.match_shaixuan_values = Payload
    },
    fenxi_yp_name(state, Payload) {
      state.fenxi_yp_name = Payload
    },
    from(state, Payload) {
      state.from = Payload
    },
    fenxi_qy_name(state, Payload) {
      state.fenxi_qy_name = Payload
    },
    fenxi_yp(state, Payload) {
      state.fenxi_yp = Payload
    },
    fenxi_qy(state, Payload) {
      state.fenxi_qy = Payload
    },
    nowNav(state, Payload) {
      state.nowNav = Payload
    },
    source(state, Payload) {
      state.source = Payload
    },
    listLoading(state, Payload) {
      state.listLoading = Payload
    },
    analyLoading(state, Payload) {
      state.analyLoading = Payload
    },
    error(state, Payload) {
      state.error = Payload;
    },
    tabname(state, Payload) {
      state.tabname = Payload
    },
    extendCount(state, Payload) {
      state.extendCount = Payload
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
            words = item.value.length ? (item.logic + ' ' + (item.accurate ? item.name + "_eq" : item.name) + "=" + (_.isArray(item.value) ? _.join(_.map(item.value, (n) => { return n }), 'ღ') : item.value)) : ''
          } else {
            words += item.value.length ? (' ' + item.logic + ' ' + (item.accurate ? item.name + "_eq" : item.name) + "=" + (_.isArray(item.value) ? _.join(_.map(item.value, (n) => { return n }), 'ღ') : item.value)) : ''
          }
        }
      })
      state.gaoji = atcs_sel ? { 'words': words, 'atcs_sel': 1 } : { 'words': words }
    },
    groups(state, Payload) {
      state.groups = Payload
    },
    shaixuan(state, Payload) {
      let group = ""

      _.map(Payload, (item, index) => {
        if (item.length > 0) { // 去空
          if (group == "") {
            group = index + "=" + _.join(item, 'ღ')
          } else {
            group += ' ' + "_and" + ' ' + index + "=" + _.join(item, 'ღ')
          }
        }
      })

      if (group != "") {
        state.shaixuan = { "filter_condition": group }
      } else {
        state.shaixuan = {}
      }

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
      state.filters = Payload
    },
    // 条件筛选结果项
    filters1(state, Payload) {
      state.filters1 = Payload
    },
    noClear(state, Payload) {
      state.noClear = Payload
    },
    /*
     * 药品销售 - API数据
     */
    // 按受理号查询的API数据
    res1(state, Payload) {
      state.res1 = Payload;
    },
    // 按药品名称查询的API数据
    res2(state, Payload) {
      state.res2 = Payload;
    },
    // 按企业名称查询的API数据
    res3(state, Payload) {
      state.res3 = Payload;
    },
    // 智能分析 - 可视化的获取API数据
    kshRes1(state, Payload) {
      state.kshRes1 = Payload;
    },
    kshRes2(state, Payload) {
      state.kshRes2 = Payload;
    },
    kshRes3(state, Payload) {
      state.kshRes3 = Payload;
    },
    kshRes4(state, Payload) {
      state.kshRes4 = Payload;
    },
    kshResNum(state, Payload) {
      state.kshResNum = Payload;
    }
  },
  actions: {
    // 普通搜索 和 高级搜索 通用方法
    nomalSearch(state, Payload) {
      state.commit("listLoading", true)
      // 确定api的url
      if (Payload !== undefined) {
        if (Payload.path) {
          state.commit("path", Payload.path)
        }
      }
      let param = {} // 储存axios获取数据的API参数
      // state.state.putong = {}
      // state.state.gaoji = {}
      // state.state.shaixuan = {}
      // if (state.state.query && state.state.query.length != 0) {
      if (Payload && !Payload.queryToPutong) { // 不把query的状态传给putong
      } else {
        state.commit("putong", state.state.query)
      }
      // }
      state.commit("gaoji", state.state.conditions)
      state.commit("shaixuan", state.state.groups)
      let sparam = state.state.putong
      let swords = state.state.gaoji
      let sgroup = state.state.shaixuan
      let sfourth = state.state.fourth

      if (state.state.gaoji.words) {
        param = (Payload && Payload.params) ? _.assign({}, sfourth, swords, sgroup, Payload.params) : _.assign({}, sfourth, swords, sgroup, { page: 1, pageSize: state.state[(state.state.tabname === 'first' ? 'xsnf' : state.state.tabname === 'getnamelist' ? 'ypmc' : 'qy') + '_param'].pageSize })
      } else {
        param = (Payload && Payload.params) ? _.assign({}, sfourth, sparam, sgroup, Payload.params) : _.assign({}, sfourth, sparam, sgroup, { page: 1, pageSize: state.state[(state.state.tabname === 'first' ? 'xsnf' : state.state.tabname === 'getnamelist' ? 'ypmc' : 'qy') + '_param'].pageSize })
      }

      //关键词统计方法
      param = _.assign(param, this.vue.searchKeywords(state.state, Payload))

      // 当没有跟其他参数时，正常搜索，回到第一页
      if (!Payload || Payload === state.state.putong) {
        if (!this.vue.isEqual('ypxs', param, false)) {
          state.commit("kshResNum", {})
          state.commit("kshRes1", [])
          state.commit("kshRes2", [])
          state.commit("kshRes3", [])
          state.commit("kshRes4", [])
          state.commit("kshRes4", [])
          state.commit("noClear", true)
          //清除智能分析旧数据用于返回智能分析重新拉取
        }

        state.commit("res1", [])
        state.commit("res2", [])
        state.commit("res3", [])
        state.commit('order', {})
        state.state.xsnf_param.page = 1
        state.state.xsnf_param.order = null
        state.state.ypmc_param.page = 1
        state.state.ypmc_param.order = null
        state.state.qy_param.page = 1
        state.state.qy_param.order = null
      }

      let paramAfter = _.omit(param, ['order', 'page', 'pageSize'])
      if (Qs.stringify(state.state.search_api_param) != Qs.stringify(paramAfter)) {
        state.commit("res1", [])
        state.commit("res2", [])
        state.commit("res3", [])
        state.commit('order', {})
      }

      state.commit("search_api_param", paramAfter)
      this.vue.getSearchParams('ypxs', state, param, null, Payload)
      return window.Axios({
        method: 'get',
        url: state.state.path,
        params: _.assign(param, {
          accesstoken: GETCOOKIEFUN("accesstoken")
        })
      }).then(res => {
        if (res.data.code === 200 && res.data) {
          state.commit("error", 0)

          // 改变extendCount
          // if (_.keys(res.data.data).length) {
          //   if (res.data.data.ExtendCount){// 有数据且有ExtendCount时（一般是第一页）
          //     state.commit("extendCount", res.data.data.ExtendCount)
          //   }
          // } else {
          //   state.commit("extendCount", {
          //     listCount: 0,
          //     nameCount: 0,
          //     qiyeCount: 0,
          //   })
          // }

          //二级列表数据关联到一级列表数据
          let addSecData = res.data.data.List
          addSecData.res = addSecData.res ? addSecData.res.map((item) => {
            item.second = {}
            return item
          }) : []
          switch (state.state.tabname) {
            case "first":
              state.commit("res1", addSecData)
              break
            case "getnamelist":
              state.commit("res2", addSecData)
              break
            case "getqylist":
              state.commit("res3", addSecData)
              break
            default:
              state.commit("res1", addSecData)
              break
          }
          state.commit("listLoading", false)
          return res
        } else if (res.data.code == 404) {
          // 显示数值归零
          // state.commit("extendCount", {
          //   listCount: 0,
          //   nameCount: 0,
          //   qiyeCount: 0,
          // })

          state.commit("error", 404)
          state.commit("listLoading", false)
        }
      }).catch((res) => {
        // state.commit("extendCount", {
        //   listCount: 0,
        //   nameCount: 0,
        //   qiyeCount: 0,
        // })
        state.commit("error", 500)
        state.commit("listLoading", false)
        return res.data.code
      })
    },
    // 获取分组下的列表信息（在“按药品名称浏览”、“按企业名称浏览”中每一项的下拉项中有用到）
    getGroupRes(state, Payload) {
      // 高级搜索不为空则使用高级搜索
      let param = {} // 储存axios获取数据的API参数
      if (state.state.gaoji.words) {
        // 高级搜索条件 条件筛选条件 传过来的附加条件（如果有的话 => page pageSize order） - 进行组合
        param = (Payload && Payload.params) ? _.assign({}, state.state.gaoji, state.state.shaixuan, Payload.params) : _.assign({}, state.state.gaoji, state.state.shaixuan)
      } else if (state.state.putong) {
        // 普通搜索条件 条件筛选条件 传过来的附加条件（如果有的话 => page pageSize order） - 进行组合
        param = (Payload && Payload.params) ? _.assign({}, state.state.putong, state.state.shaixuan, Payload.params) : _.assign({}, state.state.putong, state.state.shaixuan)
      } else if (state.state.shaixuan.filter_condition) {
        // 条件筛选条件 传过来的附加条件（如果有的话 => page pageSize order） - 进行组合
        param = (Payload && Payload.params) ? _.assign({}, state.state.shaixuan, Payload.params) : _.assign({}, state.state.shaixuan)
      }

      return window.Axios({
        method: 'get',
        url: Payload.path,
        params: param
      }).then(res => {
        if (res.data.code == 200) {
          return res
        } else if (res.data.code == 404) {
          return 404
        }
      }).catch(res => {
        return res.data.code
      })
    },
    // 获取普通 或 高级搜索项
    getFiled(state) {
      return window.Axios({
        method: 'get',
        url: '/api/config/search?dbname=ypxs'
      }).then(res => {
        if (res.data.code === 200 && res.data) {
          let data = res.data.data
          // 普通搜索项
          state.commit("nomalFiled", data.normal)
          state.commit("match_putong", data.normal)
          state.commit("filters1", data.filter)
          let match_shaixuan_Obj = {};
          data.filter.length > 0 && data.filter.forEach(item => {
            match_shaixuan_Obj[item.field] = item.label;
          })
          state.commit("match_shaixuan", match_shaixuan_Obj)
        }
      })
    },
    // 获取智能分析中的可视化数据
    getKshRes(state, Payload) {
      state.commit("analyLoading", true)

      let param = {} // 储存axios获取数据的API参数
      state.state.putong = {}
      state.state.gaoji = {}

      // if (state.state.query && state.state.query.length != 0) {
      state.commit("putong", state.state.query)
      // }

      state.commit("gaoji", state.state.conditions)
      state.commit("shaixuan", state.state.groups)

      let sparam = state.state.putong
      let swords = state.state.gaoji
      let sgroup = state.state.shaixuan
      let sfourth = state.state.fourth

      if (state.state.gaoji.words) {
        // 高级搜索条件 条件筛选条件 传过来的附加条件（如果有的话 => page pageSize order） - 进行组合
        param = _.assign({}, sfourth, swords, sgroup)
      } else {
        // 普通搜索条件 条件筛选条件 传过来的附加条件（如果有的话 => page pageSize order） - 进行组合
        param = _.assign({}, sfourth, sparam, sgroup)
      }
      if (!state.state.noClear && !this.vue.isEqual('ypxs', param, false)) {
        console.log(state.state);
        state.commit("res1", [])
        state.commit("res2", [])
        state.commit("res3", [])
        state.commit('order', {})
        state.state.xsnf_param.page = 1
        state.state.xsnf_param.order = null
        state.state.ypmc_param.page = 1
        state.state.ypmc_param.order = null
        state.state.qy_param.page = 1
        state.state.qy_param.order = null
      }
      //关键词统计方法
      param = _.assign(param, this.vue.searchKeywords(state.state))
      let paramAfter = _.omit(param, ['order', 'page', 'pageSize'])
      state.commit('search_api_param', paramAfter)
      // 获取顶部总计
      // state.dispatch("nomalSearch")

      param = _.assign(param, {
        accesstoken: GETCOOKIEFUN("accesstoken")
      })
      if (Payload) {
        param = Object.assign(param, Payload)
      } else {
        this.vue.getSearchParams('ypxs', state, param)
      }
      let spxxParam = Object.assign(param, { source: state.state.source })
      console.log(spxxParam);
      return window.Axios.all([
        (() => { return window.Axios.get('/api/ypxs/getanalysis', { params: param }); })(),
        (() => { return window.Axios.get('/api/ypxs/getspxx', { params: spxxParam }); })(),
        (() => { return window.Axios.get('/api/ypxs/getqyxx', { params: param }); })(),
        (() => { return window.Axios.get('/api/ypxs/getndxx', { params: param }); })(),
        (() => { return window.Axios.get('/api/ypxs/getatc', { params: param }); })(),
      ]).then(window.Axios.spread((kshResNum, kshRes1, kshRes2, kshRes3, kshRes4) => {
        // 此 API 没有返回 分组筛选数据，暂且注释
        // state.commit("filters", _.keys(res.data.data).length ? res.data.data.GroupList : {})
        state.commit("kshResNum", kshResNum.data.data.List)
        state.commit("kshRes1", kshRes1.data.data.List.res ? kshRes1.data.data.List.res.reverse() : [])
        state.commit("kshRes2", kshRes2.data.data.List.res ? kshRes2.data.data.List.res.reverse() : [])
        state.commit("kshRes3", kshRes3.data.data.List.res)
        state.commit("kshRes4", kshRes4.data.data.lsit)
        state.commit("analyLoading", false)
        state.commit("noClear", false)
      })).catch(err => {
        console.log(err)
        state.commit("analyLoading", false)
      })
    },
    getBaseInfo(state, Payload) {
      return window.Axios({
        method: 'get',
        url: '/api/config/view?dbname=ypxs',
        params: {
          accesstoken: GETCOOKIEFUN("accesstoken")
        }
      }).then(res => {
        if (res.data.code === 200 && res.data.data) {
          let data = res.data.data
          if (data.baseconf.dbname) {
            store.commit("Normal/names", {
              "name": data.baseconf.dbename,
              "dbname": data.baseconf.dbname
            })
          }
          state.commit("tableconf", data.tableconf)
          state.commit("allBase", data.baseconf)
          state.commit("helpInfo", data.helpconf)
          state.commit("update_conf", data.updatelog)
          // 权限处理 start
          state.commit("norules", data.norules)
          for (let item of state.state.norules.common) {
            switch (item.name) {
              case '高级搜索': state.state.nopms.gjss = true; break;
              case '条件筛选': state.state.nopms.tjsx = true; break;
              case '可视化': state.state.nopms.ksh = true; break;
              case '详情页': state.state.nopms.xqy = true; break;
              case '导出(默认300)': state.state.nopms.dc = true; break;
              case '翻页(最大75)': state.state.nopms.fy = true; break;
              case '热点搜索': state.state.nopms.rdss = true; break;
            }
          }

          for (let item of state.state.norules.exclusive) {
            switch (item.action) {
              case 'rss': state.state.nopms.rss = true; break;
              case 'getnamelist': state.state.nopms.namegroup = true; break;
              case 'getqylist': state.state.nopms.qiyegroup = true; break;
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
