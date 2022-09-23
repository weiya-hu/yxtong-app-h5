import Vue from 'vue'
import Qs from 'qs'
import Lang from '@/i18n/lang/zh-CN.js'
import store from '@/store'

export default {
  namespaced: true,
    state: {
    listLoading: true, // 控制表格中数据的加载清空
    analyLoading: true,
    error: 0, // 错误码
    // tabname: "first", // 表示目前处于按那种方式浏览/first（受理号）/listbyname（药品名称）/listbyqiye（企业名称）
    path: '/api/tourongzi', // 维护当前搜索请求接口
    nomal_filed: [], // 普通搜索列举项
    advanced_filed: [], // 高级搜索列举项
    // 查询出的数量
    extendCount: 0,
    res1: [], //查询的结果
    // res1: {}, // 按受理号查询的结果
    // res2: [], // 按药品名称查询的结果
    // res3: [], // 按企业名称查询的结果
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
    sx_params:{
      order: null, // 排序
      page: 1, // 页数
      pageSize: 20 // 每页条数
    },
    // 可视化结果
    kshRes: {
      noClear:true,
      trqs:[],
      funders:[],
      szfph: [],
      lczb: [],
      dqzb: [],
    },
    kshTotal: {},
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
    match_shaixuan: Lang.fields.tourongzi.filters,
    match_shaixuan_values: {},
    search_api_param: {},
    saved_options: [],
    allBase: {},
    tableconf:[],
    helpInfo: {},
    update_conf: [],
    fourth: {},
    nopms: {
      'list': [],
      'detail': [],
    },
    norules: {},
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
    listLoading(state, Payload) {
      state.listLoading = Payload
    },
    analyLoading(state, Payload) {
      state.analyLoading = Payload
    },
    error(state, Payload) {
      state.error = Payload;
    },
    // tabname(state, Payload) {
    //   state.tabname = Payload
    // },
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
              if (Payload.param.value == '' || Payload.param.value == "0:0" || Payload.param.value == undefined) { // **清除**此条件
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
            words = item.value.length ? (item.logic + ' ' + (item.accurate ? item.name + "_eq" : item.name) + "=" + (_.isArray(item.value) ? _.join(_.map(item.value, (n) => {return n}), 'ღ') : item.value)) : ''
          } else {
            words += item.value.length ? (' ' + item.logic + ' ' + (item.accurate ? item.name + "_eq" : item.name) + "=" + (_.isArray(item.value) ? _.join(_.map(item.value, (n) => {return n}), 'ღ') : item.value)) : ''
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
    /*
     * 注册数据 - API数据
     */
    // 按受理号查询的API数据
    res1(state, Payload) {
      state.res1 = Payload;
    },
    // 按药品名称查询的API数据
    // res2(state, Payload) {
    //   state.res2 = Payload;
    // },
    // // 按企业名称查询的API数据
    // res3(state, Payload) {
    //   state.res3 = Payload;
    // },
    // 智能分析 - 可视化的获取API数据
    kshRes(state, Payload) {
      state.kshRes = Payload;
    },
    kshTotal(state, Payload) {
      state.kshTotal = Payload;
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
        // state.commit("putong", state.state.query)
        if (Payload && !Payload.queryToPutong) {
          // console.log('尚未搜索就切换不需要putong参数')
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
        param = (Payload && Payload.params) ? _.assign({}, sfourth, swords, sgroup, Payload.params) : _.assign({}, sfourth, swords, sgroup, {page: 1, pageSize: state.state.sx_params.pageSize})
      } else {
        param = (Payload && Payload.params) ? _.assign({}, sfourth, sparam, sgroup, Payload.params) : _.assign({}, sfourth, sparam, sgroup, {page: 1, pageSize: state.state.sx_params.pageSize})
      }
      //关键词统计方法
      param = _.assign(param,this.vue.searchKeywords(state.state,Payload))

      // 当没有跟其他参数时，正常搜索，回到第一页
      if (!Payload||Payload===state.state.putong) {
        if(!this.vue.isEqual('tourongzi',param,false)){
          state.commit("kshRes",{
            noClear:true,
            trqs:[],
            funders:[],
            szfph: [],
            lczb: [],
            dqzb: [],
          })
        }

        state.state.sx_params.page = 1;
        state.commit("res1", [])
        state.commit('order', {})
        state.state.sx_params.order = null
      }


      let paramAfter = _.omit(param, ['order', 'page', 'pageSize'])
      if (Qs.stringify(state.state.search_api_param) != Qs.stringify(paramAfter)) {
        state.commit("res1", [])
        state.commit('order', {})
        state.state.sx_params.order = null
        // state.commit("res2", [])
        // state.commit("res3", [])
      }
      state.commit("search_api_param", paramAfter)
      this.vue.getSearchParams('tourongzi',state,param,null,Payload)

      return window.Axios({
        method: 'get',
        url: state.state.path,
        params: _.assign(param, {
          accesstoken: GETCOOKIEFUN("accesstoken")
        })
      }).then(res => {
        if (res.data.code === 200 && res.data.code == 200) {
          state.commit("error", 0)
          // 改变extendCount
          if (res.data.data.List) {
            // console.log( _.keys(res.data.data).length)
            // console.log(res.data.data.List.count)
            state.commit("extendCount", _.keys(res.data.data).length ? res.data.data.List.count : 0)
          }

        //   switch(state.state.tabname){
        //     case "first":
        //       state.commit("res1", res.data.data.List)
        //       break
        //     case "listbyname":
        //       state.commit("res2", res.data.data.List.res)
        //       break
        //     case "listbyqiye":
        //       state.commit("res3", res.data.data.List.res)
        //       break
        //   }
          state.commit("res1", res.data.data.List)
          state.commit("listLoading", false)
          return res
        } else {
          // 显示数值归零
          state.commit("extendCount", 0)

          state.commit("error", 404)
          state.commit("listLoading", false)
        }
      }).catch((res) => {
        state.commit("extendCount", 0)
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
      return window.Axios({
        method: 'get',
        url: '/api/config/search?dbname=tourongzi'
      }).then(res => {
        if (res.data.code === 200 && res.data) {
          // 普通搜索项
          state.commit("nomalFiled", res.data.data.normal)
          state.commit("match_putong", res.data.data.normal)
        }
      })
    },
    // 获取智能分析中的可视化数据
    getKshRes(state) {
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
      if(!state.state.kshRes.noClear && !this.vue.isEqual('tourongzi',param,false)){
        state.state.sx_params.page = 1;
        state.commit("res1", [])
        state.commit('order', {})
        state.state.sx_params.order = null
      }
      //关键词统计方法
      param = _.assign(param,this.vue.searchKeywords(state.state))

      //state.dispatch('nomalSearch')

      window.Axios({
        method: 'get',
        url: '/api/tourongzi/visualization',
        params: _.assign(param, {
          accesstoken: GETCOOKIEFUN("accesstoken")
        })
      }).then(res => {
        if (res.data.code === 200 && res.data) {
          state.commit('kshTotal', res.data.data.aggs)
          state.commit("kshRes", {
            trqs:res.data.data.trqs,
            funders: res.data.data.funders,
            szfph: res.data.data.szfph,
            lczb: res.data.data.lczb,
            dqzb: res.data.data.dqzb,
          })
        }
        //console.log(this.kshRes)
        state.commit("analyLoading", false)
      }).catch(err => {
        console.log(err)
        state.commit("analyLoading", false)
      })

      // param = _.assign(param, {
      //   accesstoken: GETCOOKIEFUN("accesstoken")
      // })

      // return window.Axios.all([
      //   (()=>{return window.Axios.get('/api/pqf/spphxsl', {params: param});})(),
      //   (()=>{return window.Axios.get('/api/pqf/qyphxsl', {params: param});})(),
      //   (()=>{return window.Axios.get('/api/pqf/spphxse', {params: param});})(),
      //   (()=>{return window.Axios.get('/api/pqf/qyphxse', {params: param});})(),
      //   (()=>{return window.Axios.get('/api/pqf/ndxs', {params: param});})(),
      //   (()=>{return window.Axios.get('/api/pqf/jplb', {params: param});})(),
      // ]).then(window.Axios.spread((spphxsl, qyphxsl, spphxse, qyphxse, ndxs, jplb) => {
      //   // 此 API 没有返回 分组筛选数据，暂且注释
      //   // state.commit("filters", _.keys(res.data.data).length ? res.data.data.GroupList : {})
      //   state.commit("kshRes", {
      //     spphxsl: spphxsl.data.data.res,
      //     qyphxsl: qyphxsl.data.data.res,
      //     spphxse: spphxse.data.data.res,
      //     qyphxse: qyphxse.data.data.res,
      //     ndxs: ndxs.data.data.res,
      //     jplb: jplb.data.data.res,
      //   })
      //   state.commit("analyLoading", false)
      // })).catch(err => {
      //   console.log(err)
      //   state.commit("analyLoading", false)
      // })
    },



    getBaseInfo (state, Payload) {
      return window.Axios({
        method: 'get',
        url: '/api/config/view?dbname=tourongzi',
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
              case 'listbyname': state.state.nopms.namegroup = true; break;
              case 'listbyqiye': state.state.nopms.qiyegroup = true; break;
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
    // start-定量分析

    // end-定量分析
  }
}
