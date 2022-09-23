import Vue from 'vue'
import Qs from 'qs'
import Lang from '@/i18n/lang/zh-CN.js'
import store from '@/store'

export default {
  namespaced: true,
  state: {
    allBase: {},
    tableconf:[],
    helpInfo: {},
    update_conf: [],
    listLoading: true, // 控制表格中数据的加载清空
    analyLoading: true,
    error: 0, // 错误码
    tabname: "first", // 表示目前处于按那种方式浏览/first（受理号）/getnamelist（药品名称）/getqiyelist（企业名称）
    path: '/api/chufang', // 维护当前搜索请求接口
    nomal_filed: [], // 普通搜索列举项
    advanced_filed: [], // 高级搜索列举项
    listCount: 0,
    // 查询出的数量
    extendCount: {
      listCount: 0,
      nameCount: 0,
      qiyeCount: 0
    },
    currentPage: 1,
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
    pageSize: "20", // 当前页显示条数（条/页）
    order: {}, // 查询的排序规则
    // svalue: [], // 高级搜索中：select组件的选择value
    slh_param: { // 按受理号查询页的附加参数
      order:null, // 排序
      page:1, // 页数
      pageSize: 20, // 每页条数
    },
    ypmc_param: { // 按药品名称查询页的附加参数
      order:null, // 排序
      page:1, // 页数
      pageSize: 20, // 每页条数
    },
    qy_param: { // 按企业查询页的附加参数
      order: null, // 排序
      page:1, // 页数
      pageSize: 20, // 每页条数
    },
    param: {
      order:null,
      page:1,
      pageSize: 20,
    },
    cascaderQuery: [],
    selectQuery: [],
    // 可视化结果
    kshRes: {noClear:true},
    kshTotal: {},

    // 定量分析
    ypfx: [],   // 仅用于从其他组件点击的时候，因为跨组件共享数据，其他时候 通组件 都没有用这个，都是组件内调用方法的
    qiyefx: [], // 仅用于从其他组件点击的时候，因为跨组件共享数据，其他时候 通组件 都没有用这个，都是组件内调用方法的
    // qiyefxClick: 0,
    yptop: [], // 存储 定量分析药品排行当前搜索值
    qytop: [], // 存储 定量分析企业排行当前搜索值
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
    //   'guifanjixing': '药品剂型',
    //   'first': '中标地区',
    // },
    match_shaixuan: Lang.fields.zcycf.filters,
    match_shaixuan_values: {},
    search_api_param: {},
    saved_options: [],
    fourth: {},
    iffirstCommonIn:true,//连接跳转搜索进这个界面
    fourth_checked: {},
    nopms: {
      'list': [],
      'detail': [],
    },
    norules: {},
    judge: true
  },
  mutations: {
    nopms(state, Payload) {
      state.nopms = Payload
    },
    judge(state, Payload) {
      state.judge = Payload
    },
    currentPage(state, Payload) {
      state.currentPage = Payload
    },
    cascaderQuery(state, Payload) {
      state.cascaderQuery = Payload
    },
    selectQuery(state, Payload) {
      state.selectQuery = Payload
    },
    norules(state, Payload) {
      state.norules = Payload
    },
    fourth(state, Payload) {

      if(Payload instanceof Array){
        this.iffirstCommonIn = true;
      }else{
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
      state.fourth = fourth_condition ? {"fourth_condition": fourth_condition} : {}

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
    match_shaixuan_values(state, Payload) {
      state.match_shaixuan_values = Payload
    },
    // 定量分析
    ypfx(state, Payload) {
      state.ypfx = Payload
    },
    qiyefx(state, Payload) {
      state.qiyefx = Payload
    },
    yptop(state, Payload) {
      state.yptop = Payload;
    },
    qytop(state, Payload) {
      state.qytop = Payload;
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
    listCount(state, Payload) {
      state.listCount = Payload
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
        state.query = Payload
      }
      // Vue.set(state,'query',theQuery)
    },
    queryStr (state) {
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
            words = item.value.length ? (item.logic + ' ' + (item.accurate ? item.name + '_eq' : item.name) + '=' + (_.isArray(item.value) ? _.join(_.map(item.value, (n) => { return n }), 'ღ') : item.value)) : ''
          } else {
            words += item.value.length ? (' ' + item.logic + ' ' + (item.accurate ? item.name + '_eq' : item.name) + '=' + (_.isArray(item.value) ? _.join(_.map(item.value, (n) => { return n }), 'ღ') : item.value)) : ''
          }
        }
      })
      state.gaoji = atcs_sel ? {'words': words, 'atcs_sel': 1} : {'words': words}
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
        //return {filter_condition: Qs.stringify(group,{ encodeValuesOnly: false })}
        state.shaixuan = {"filter_condition": group}
      } else {
        state.shaixuan = {}
      }

    },
    fourth_condition (state, Payload) {
      state.fourth_condition = Payload
    },
    fourth_checked (state,Payload) {
      state.fourth_checked = Payload
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
    paramPage(state, Payload) {
      state.param.page = Payload
    },
    paramPagesize(state, Payload) {
      state.param.pageSize = Payload
    },
    /*
     * 注册数据 - API数据
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
    kshRes(state, Payload) {
      state.kshRes = Payload;
    },
    kshTotal(state, Payload) {
      state.kshTotal = Payload;
      // 更新顶部的数据库数据条数
      // state.extendCount = Object.assign(state.extendCount, {
      //   listCount: Payload.yc
      // })
    }
  },
  actions: {
    // 普通搜索 和 高级搜索 通用方法
    nomalSearch(state, Payload) {

      if(!this.iffirstCommonIn){
        state.commit("fourth", state.state.fourth_checked);
      }
      this.iffirstCommonIn = false;

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
      state.commit("gaoji", state.state.conditions)
      state.commit("shaixuan", state.state.groups)
      let sparam = state.state.putong
      let swords = state.state.gaoji
      let sgroup = state.state.shaixuan
      let sfourth = state.state.fourth

      if (state.state.gaoji.words) {
        param = (Payload && Payload.params) ? _.assign({}, sfourth, swords, sgroup, Payload.params) : _.assign({}, sfourth, swords, sgroup, {page: 1, pageSize: state.state.param.pageSize})
      } else {
        param = (Payload && Payload.params) ? _.assign({}, sfourth, sparam, sgroup, Payload.params) : _.assign({}, sfourth, sparam, sgroup, {page: 1, pageSize: state.state.param.pageSize})
      }
      //关键词统计方法
      param = _.assign(param,this.vue.searchKeywords(state.state,Payload))

      for (let [key, val] of Object.entries(param)) {
        if (val == "undefined" || val == undefined) delete param[key];
      }

      if (!Payload||Payload===state.state.putong) {
        state.commit('kshRes', {noClear:true})
        state.commit('res1', [])
        state.commit('res2', [])
        state.commit('res3', [])
        state.commit('order', {})
        state.state.slh_param.page = 1
        state.state.slh_param.order = null
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

      return window.Axios({
        method: 'get',
        url: state.state.path,
        params: _.assign(param, {
          accesstoken: GETCOOKIEFUN("accesstoken")
        })
      }).then(res => {
        if (res.data.code === 200) {
          state.commit("error", 0)
          if(location.pathname === '/chufang/list'){
            state.commit("listCount", res.data.data.count)
          }

          state.commit("currentPage", res.data.data.page ? res.data.data.page : 1)
          state.commit("res1", res.data.data.res ? res.data.data.res : [])

          state.commit("listLoading", false)
          // 改变extendCount
        //   if (res.data.data.ExtendCount) {
        //     state.commit("extendCount", _.keys(res.data.data).length ? res.data.data.ExtendCount : {
        //       listCount: 0,
        //       nameCount: 0,
        //       qiyeCount: 0,
        //     })
        //   }

        //   // 改变filters
        //   state.commit("filters", _.keys(res.data.data).length ? res.data.data.GroupList : {})
        //   if (_.keys(state.state.match_shaixuan_values).length == 0) {
        //     state.commit("match_shaixuan_values", _.keys(res.data.data).length ? res.data.data.GroupList : {})
        //   }

        //   switch(state.state.tabname){
        //     case "first":
        //       state.commit("res1", res.data.data.List)
        //       break
        //     case "getnamelist":
        //       state.commit("res2", res.data.data.List.res)
        //       break
        //     case "getqiyelist":
        //       state.commit("res3", res.data.data.List.res)
        //       break
        //   }
        //   state.commit("listLoading", false)
        //   return res
        // } else {
        //   // 显示数值归零
        //   state.commit("extendCount", {
        //     listCount: 0,
        //     nameCount: 0,
        //     qiyeCount: 0
        //   })

        //   state.commit("error", 404)
        //   state.commit("listLoading", false)
        }else{
          state.commit("error", res.data.code)
          if(location.pathname === '/chufang/list'){
            state.commit("listCount", 0)
          }
          state.commit("listLoading", false)
        }
      }).catch((res) => {
        // state.commit("extendCount", {
        //   listCount: 0,
        //   nameCount: 0,
        //   qiyeCount: 0
        // })
        state.commit("error", 500)
        state.commit("listCount", 0)
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

      // param = (Payload && Payload.params) ? _.assign({}, Payload.params) : {}

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

      // 药理分类-过滤底4层
      let del = (m) => {
        m.forEach(e => {
          if(e.label === '药理分类'){
            e.value.forEach((e1, x1) => {
              if(e1.children){
                e1.children.forEach(e2 => {
                  if(e2.children){
                    e2.children.forEach(e3 => {
                      if(e3.children){
                        delete e3.children

                      }
                    })
                  }
                })
              }
            })
          }
        })
        return m
      }

      return window.Axios({
        method: 'get',
        url: '/api/config/search?dbname=chufang'
      }).then(res => {
        if (res.data.code === 200 && res.data) {
          // 普通搜索项
          state.commit("nomalFiled", del(res.data.data.normal))
          state.commit("match_putong", del(res.data.data.normal))
        }
      })
    },
    // 获取智能分析中的可视化数据
    getKshRes(state) {
      state.commit("judge", false)

      state.commit("analyLoading", true)
      if(!state.state.kshRes.noClear){
        state.commit('res1', [])
        state.commit('res2', [])
        state.commit('res3', [])
        state.commit('order', {})
        state.state.slh_param.page = 1
        state.state.slh_param.order = null
        state.state.ypmc_param.page = 1
        state.state.ypmc_param.order = null
        state.state.qy_param.page = 1
        state.state.qy_param.order = null
      }
      let param = {} // 储存axios获取数据的API参数
      // state.state.putong = {}
      // state.state.gaoji = {}

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
      //关键词统计方法
      param = _.assign(param,this.vue.searchKeywords(state.state))
      let paramAfter = _.omit(param, ['order', 'page', 'pageSize'])
      state.commit('search_api_param', paramAfter)
      // apidb.yaozh.com/chufang/tj       中成药处方统计接口
      // apidb.yaozh.com/chufang/ylfl     中成药处方药理分类接口
      // apidb.yaozh.com/chufang/ycfl     中成药处方药材分类接口
      /* window.Axios({
        method: 'get',
        url: state.state.path,
        params: _.assign(param, {
          accesstoken: GETCOOKIEFUN("accesstoken")
        })
      }).then(res => {
        if(res.data.code === 200){
          state.commit("listCount", res.data.data.count)
        }else{
          state.commit("listCount", 0)
        }
      }) */

      return window.Axios.all([
        (()=>{return window.Axios.get('/api/chufang/tj', {params: param});})(),
        (()=>{return window.Axios.get('/api/chufang/ylfl', {params: param});})(),
        (()=>{return window.Axios.get('/api/chufang/ycfl', {params: param});})(),
      ])
      .then(window.Axios.spread((tj, ylfl, ycfl) => {
        if(tj.data.code === 200){
          state.commit('kshTotal', tj.data.data.res)
        }else{

          state.commit("listCount", 0)
          state.commit('kshTotal', {})
        }

        state.commit("kshRes", {
          ylfl: ylfl.data.data,
          ycfl: ycfl.data.data
        })

        state.commit("analyLoading", false)
      }))
      .catch(err => {
        console.log(err)
        state.commit("analyLoading", false)
      })

    },
    getBaseInfo (state, Payload) {
      return window.Axios({
        method: 'get',
        url: '/api/config/view?dbname=chufang',
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
            switch (item.name)
            {
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
            switch (item.action)
            {
              case 'rss': state.state.nopms.rss = true; break;
              case 'getnamelist': state.state.nopms.namegroup = true; break;
              case 'getqiyelist': state.state.nopms.qiyegroup = true; break;
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
