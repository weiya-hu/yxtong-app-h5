import Vue from 'vue'
import Qs from 'qs'
import Lang from '@/i18n/lang/zh-CN.js'
import store from '@/store'
import router from '@/router'

const stateObj = {
  allBase: {},
  helpInfo: {},
  update_conf: [],
  tableconf: [],
  listLoading: true, // 控制表格中数据的加载清空
  analyLoading: true,
  error: 0, // 错误码
  tabname: 'first', // 表示目前处于按那种方式浏览/first（按企业浏览）
  path: '/api/company_filter', // 维护当前搜索请求接口
  //普通查询
  nomal_filed: [], // 普通搜索列举项（来源于API的原始数据）
  query: [], // 已选普通搜索查询条件 格式请查看readme.md
  queryStr: "", // 由于监听不到数组变化，需监听query时，转成字符串
  putong: {}, // 普通搜索查询条件所用的储存对象（主要用于API前的处理）
  //高级查询
  advanced_filed: [], // 高级搜索列举项（来源于API的原始数据）
  conditions: [], // 已选高级搜索查询条件 格式请查看readme.md
  gaoji: {}, // 高级搜索查询条件所用的储存对象（主要用于API前的处理）
  //二次筛选
  filters: {}, // 条件筛选结果（来源于API的原始数据）
  filters1: [], // 添加问号标注添加条件筛选
  groups: {}, // 已选筛选条件
  shaixuan: {}, // 条件筛选所用的储存对象（主要用于API前的处理）
  //热点查询
  hot_filter_filed: {}, // 热门信息筛选列举项（来源于API的原始数据）
  hot_filter_filedCopy:{},
  hot_checked: {}, // 已选热门筛选条件
  hot: {}, // 热门筛选条件所用的储存对象（主要用于API前的处理）
  //关联查询
  fourth: {},
  iffirstCommonIn: true, //连接跳转搜索进这个界面
  fourth_checked: {},
  // 查询出的数量
  extendCount: {
    baseCount: 0,
    NameCount: 0,
    QiyeCount: 0,
    SyjgCount: 0
  },
  res1: {}, // 按企业浏览查询的结果
  res2: [], // 按药品名称查询的结果
  res3: [], // 按企业名称查询的结果
  res4: [], // 按试验机构查询的结果
  pageSize: '20', // 当前页显示条数（条/页）
  order: {}, // 查询的排序规则
  qy_param: { // 按企业查询页的附加参数
    order: null, // 排序
    page: 1, // 页数
    pageSize: 20 // 每页条数
  },
  ypmc_param: { // 按药品名称查询页的附加参数
    order: null, // 排序
    page: 1, // 页数
    pageSize: 20 // 每页条数
  },
  syjg_param: { // 按企业查询页的附加参数
    order: null, // 排序
    page: 1, // 页数
    pageSize: 20 // 每页条数
  },
  // 可视化结果 默认值防止列表内容被清空
  kshRes: {
    noClear: true
  },
  // 匹配 主要用于已选条件显示需要
  match_putong: {
    'comprehensive_drug': '综合搜索（药品）',
    'comprehensive_company': '综合搜索（企业）',
    'comprehensive_devices': '综合搜索（医疗器械）',
    'comprehensive_chinesemedicine': '综合搜索（中药材）',
    'comprehensive_targets': '综合搜索（靶点）',
    'comprehensive_disease': '综合搜索（疾病）'
  },
  match_gaoji: {},
  match_shaixuan: {},
  match_shaixuan_values: {},
  search_api_param: {},
  saved_options: [],
  nopms: {
    'list': [],
    'detail': []
  },
  isGetCount: true,
  norules: {}
}
export default {
  namespaced: true,
  state: Object.assign({}, stateObj),
  mutations: {
    reset(state, Payload) {
      store.state.Zhuce = Object.assign({}, stateObj)
    },
    nopms(state, Payload) {
      state.nopms = Payload
    },
    norules(state, Payload) {
      state.norules = Payload
    },
    fourth_condition(state, Payload) {
      state.fourth_condition = Payload
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

      let fourth_condition = ''
      _.map(Payload, (item, index) => {
        if (index == 0) {
          fourth_condition = item.logic + ' ' + item.name + '=' + item.value
        } else {
          fourth_condition += ' ' + item.logic + ' ' + item.name + '=' + item.value
        }
      })
      state.fourth = fourth_condition ? {
        "fourth_condition": fourth_condition
      } : {}
      // console.log(fourth_condition)
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
    match_shaixuan(state, Payload) {
      state.match_shaixuan = Payload
    },
    match_shaixuan_values(state, Payload) {
      state.match_shaixuan_values = Payload
    },
    match_hot_key(state, Payload) {
      let obj_keyvalue = {}
      _.map(Payload, (value, key) => {


      })
    },
    listLoading(state, Payload) {
      state.listLoading = Payload
    },
    analyLoading(state, Payload) {
      state.analyLoading = Payload
    },
    error(state, Payload) {
      state.error = Payload
    },
    tabname(state, Payload) {
      state.tabname = Payload
    },
    extendCount(state, Payload) {
      state.extendCount = Payload
    },
    // 普通搜索项
    nomalFiled(state, Payload) {
      state.nomal_filed = Payload
    },
    query(state, Payload) {
      // opt=1增加条件 或 替换已有条件
      if (Payload.opt && Payload.opt == 1) {
        if (state.query.length == 0) {
          state.query.push(Payload.param)
        } else {
          for (let i = 0, l = state.query.length; i < l; i++) {
            if (Payload.param.name == state.query[i].name) {
              if (Payload.param.value == '' || Payload.param.value == ':' || Payload.param.value == undefined) { // **清除**此条件
                // 将无效的输入条件移除
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
      //console.log(Payload)
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

      let words = '',
        atcs_sel = 0;
      _.map(Payload, (item, index) => {
        if (item.value) { // 去空
          if (item.atcs_sel == true) atcs_sel = 1;
          if (index == 0) {
            words = item.value.length ? (item.logic + ' ' + (item.accurate ? item.name + '_eq' : item.name) + '=' + (_.isArray(item.value) ? _.join(_.map(item.value, (n) => {
              return n
            }), 'ღ') : item.value)) : ''
          } else {
            words += item.value.length ? (' ' + item.logic + ' ' + (item.accurate ? item.name + '_eq' : item.name) + '=' + (_.isArray(item.value) ? _.join(_.map(item.value, (n) => {
              return n
            }), 'ღ') : item.value)) : ''
          }
        }
      })
      let obj = {
        'words': words
      };
      if (atcs_sel == 1) obj.atcs_sel = atcs_sel;
      state.gaoji = obj;
    },
    groups(state, Payload) {
      state.groups = Payload
    },
    shaixuan(state, Payload) {
      let group = ''

      _.map(Payload, (item, index) => {
        if (item.length > 0) { // 去空
          if (group == '') {
            group = index + '=' + _.join(item, 'ღ')
          } else {
            group += ' ' + '_and' + ' ' + index + '=' + _.join(item, 'ღ')
          }
        }
      })

      if (group != '') {
        state.shaixuan = {
          'filter_condition': group
        }
      } else {
        state.shaixuan = {}
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
    path(state, Payload) {
      state.path = Payload
    },
    order(state, Payload) {
      state.order = Payload
    },


    // 高级搜索项
    advancedFiled(state, Payload) {
      state.advanced_filed = Payload
    },
    // 条件筛选结果项
    filters(state, Payload) {
      state.filters = Payload
    },
    // 条件筛选结果项
    filters1(state, Payload) {
      state.filters1 = Payload
    },
    // 热门信息筛选项
    hot_filter_filed(state, Payload) {
      state.hot_filter_filed = Payload
      if (Object.keys(state.hot_filter_filedCopy).length<=0) {
        state.hot_filter_filedCopy = Payload
      }
    },
    /*
     * 注册数据 - API数据
     */
    // 按受理号查询的API数据
    res1(state, Payload) {
      state.res1 = Payload
    },
    // 按药品名称查询的API数据
    res2(state, Payload) {
      state.res2 = Payload
    },
    // 按企业名称查询的API数据
    res3(state, Payload) {
      state.res3 = Payload
    },
    // 按试验机构查询的API数据
    res4(state, Payload) {
      state.res4 = Payload
    },
    // 智能分析 - 可视化的获取API数据
    kshRes(state, Payload) {
      state.kshRes = Payload
    }
  },
  actions: {
    reset(state, Payload) {
      state.commit('handleReset')
    },
    // 普通搜索 和 高级搜索 通用方法
    nomalSearch(state, Payload) { //type为1时是为了
      // console.log(state.state)
      // return false;
      if (!this.iffirstCommonIn) {
        state.commit("fourth", state.state.fourth_checked);
      }
      this.iffirstCommonIn = false;

      state.commit('listLoading', true)
      // 确定api的url
      if (Payload !== undefined) {
        if (Payload.path) {
          state.commit('path', Payload.path)
        }
      }
      let param = {} // 储存axios获取数据的API参数
      if (Payload && !Payload.queryToPutong) { // 不把query的状态传给putong
      } else {
        console.log("查询内容：", state.state.query)
        if (Object.keys(state.state.putong).length == 0 && router.currentRoute.query.englishname) {
          let obj = {
            accurate: false,
            label: "药物名称",
            name: "name",
            type: "text",
            value: router.currentRoute.query.englishname
          }
          state.state.query.push(obj);
          state.commit("queryStr", [obj]);
          state.commit('putong', state.state.query)
        } else {
          state.commit('putong', state.state.query)
        }
      }
      state.commit('gaoji', state.state.conditions)
      state.commit('shaixuan', state.state.groups)
      state.commit('hot', state.state.hot_checked)

      // state.commit('fourth', state.state.fourth_checked)
      let sparam = state.state.putong
      let swords = state.state.gaoji
      let sgroup = state.state.shaixuan
      let sfourth = state.state.fourth
      let shot = state.state.hot

      if (state.state.gaoji.words) {
        param = (Payload && Payload.params) ? _.assign({}, sfourth, swords, sgroup, shot, Payload.params) : _.assign({}, sfourth, swords, sgroup, shot, {
          page: 1,
          pageSize: state.state[(state.state.tabname === 'first' ? 'qy' : state.state.tabname === 'namegroup' ? 'ypmc' : 'qy') + '_param'].pageSize
        })
      } else {
        param = (Payload && Payload.params) ? _.assign({}, sfourth, sparam, sgroup, shot, Payload.params) : _.assign({}, sfourth, sparam, sgroup, shot, {
          page: 1,
          pageSize: state.state[(state.state.tabname === 'first' ? 'qy' : state.state.tabname === 'namegroup' ? 'ypmc' : 'qy') + '_param'].pageSize
        })
      }

      //关键词统计方法
      param = _.assign(param, this.vue.searchKeywords(state.state, Payload))

      if (param.fourth_condition && param.fourth_condition.indexOf("tabName") > -1) {
        param.fourth_condition.replace('_eq=', '')
        param.fourth_condition = param.fourth_condition.replace('ylbm=', 'ylbm_eq=')
      }

      // 当没有跟其他参数时，正常搜索，回到第一页
      if (!Payload || Payload === state.state.putong) {
        !this.vue.isEqual('company_filter', param, false) && state.commit('kshRes', {
          noClear: true
        })
        state.commit('res1', [])
        state.commit('res2', [])
        state.commit('res3', [])
        state.commit('res4', [])
        state.commit('order', {})
        state.state.ypmc_param.page = 1
        state.state.ypmc_param.order = null
        state.state.qy_param.page = 1
        state.state.qy_param.order = null
        state.state.syjg_param.page = 1
        state.state.syjg_param.order = null
      }

      let paramAfter = _.omit(param, ['order', 'page', 'pageSize'])
      if (Qs.stringify(state.state.search_api_param) != Qs.stringify(paramAfter)) {
        state.commit('res1', [])
        state.commit('res2', [])
        state.commit('res3', [])
        state.commit('res4', [])
        state.commit('order', {})
      }
      state.commit('search_api_param', paramAfter)

      // state.dispatch("getKshRes")
      // console.log(param);
      // console.log(state.state.putong);
      // console.log(state.state.conditions);
      // if (param.name) {
      //   delete param.searchwords
      //   delete param.comprehensive
      //   delete state.state.putong.searchwords
      //   delete state.state.putong.comprehensive
      // }
      // if (Qs.stringify(state.state.search_api_param) != Qs.stringify(param)) {
      this.vue.getSearchParams('company_filter', state, param, null, Payload)
      return window.Axios({
        method: 'get',
        url:state.state.path,
        params: _.assign(param, {
          accesstoken: GETCOOKIEFUN("accesstoken")
        })
      }).then(res => {
        if (res.data.data) {
          let data = res.data.data
          let dataLen = _.keys(data).length
          state.commit('error', 0)

          //二级列表数据关联到一级列表数据
          let addSecData = data.res ? data.res.map((item) => {
            item.second = {}
            return item
          }) : []

          switch (state.state.tabname) {
            case 'first':
              state.commit('res1', data ? data : [])
              break
            case 'namegroup':
              state.commit('res2', addSecData)
              break
            case 'qiyegroup':
              state.commit('res3', addSecData)
              break
            case 'syjggroup':
              state.commit('res4', addSecData)
              break
            default:
              state.commit('res1', data ? data : [])
              break
          }
        }

        if (res.data.code === 404) {
          let data = res.data.data
          state.commit('error', 404)
        }
        state.commit('listLoading', false)
        return res
      }).catch((res) => {
        state.commit('error', 500)
        state.commit('listLoading', false)
        return res
      })
      // }
    },
    // 获取分组下的列表信息（在“按药品名称浏览”、“按企业名称浏览”中每一项的下拉项中有用到）
    getGroupRes(state, Payload) {
      // 高级搜索不为空则使用高级搜索
      let param = {} // 储存axios获取数据的API参数

      let sparam = state.state.putong
      let swords = state.state.gaoji
      let sgroup = state.state.shaixuan
      let sfourth = state.state.fourth
      let shot = state.state.hot

      if (state.state.gaoji.words) {
        param = (Payload && Payload.params) ? _.assign({}, Payload.params, sfourth, swords, sgroup, shot, Payload.params) : _.assign({}, sfourth, swords, sgroup, shot, {
          page: 1,
          pageSize: state.state.param.pageSize
        })
      } else {
        param = (Payload && Payload.params) ? _.assign({}, Payload.params, sfourth, sparam, sgroup, shot, Payload.params) : _.assign({}, sfourth, sparam, sgroup, shot, {
          page: 1,
          pageSize: state.state.param.pageSize
        })
      }

      return window.Axios({
        method: 'get',
        url: Payload.path,
        params: param
      })
    },
    // 获取普通 或 高级搜索项
    getFiled(state) {
      return window.Axios({
        method: 'get',
        url: '/api/config/search?dbname=company_filter'
      }).then(res => {
        if (res.data.code === 200 && res.data.data) {
          let data = res.data.data
          // 普通搜索项
          state.commit('nomalFiled', data.normal)
          state.commit('match_putong', data.normal)
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
    getKshRes(state) {
      state.commit('analyLoading', true)

      let param = {} // 储存axios获取数据的API参数
      state.state.putong = {}
      state.state.gaoji = {}

      // if (state.state.query && state.state.query.length != 0) {
      state.commit('putong', state.state.query)
      // }

      state.commit('gaoji', state.state.conditions)
      state.commit('shaixuan', state.state.groups)
      state.commit('fourth', state.state.fourth_checked)
      state.commit('hot', state.state.hot_checked)

      let sparam = state.state.putong
      let swords = state.state.gaoji
      let sgroup = state.state.shaixuan
      let sfourth = state.state.fourth
      let shot = state.state.hot

      if (state.state.gaoji.words) {
        // 高级搜索条件 条件筛选条件 传过来的附加条件（如果有的话 => page pageSize order） - 进行组合
        param = _.assign({}, sfourth, swords, sgroup, shot)
      } else {
        // 普通搜索条件 条件筛选条件 传过来的附加条件（如果有的话 => page pageSize order） - 进行组合
        param = _.assign({}, sfourth, sparam, sgroup, shot)
      }
      if (!state.state.kshRes.noClear && !this.vue.isEqual('company_filter', param, false)) {
        state.commit('res1', [])
        state.commit('res2', [])
        state.commit('res3', [])
        state.commit('res4', [])
        state.commit('order', {})
        state.state.ypmc_param.page = 1
        state.state.ypmc_param.order = null
        state.state.qy_param.page = 1
        state.state.qy_param.order = null
        state.state.syjg_param.page = 1
        state.state.syjg_param.order = null
      }
      //关键词统计方法
      param = _.assign(param, this.vue.searchKeywords(state.state))
      let paramAfter = _.omit(param, ['order', 'page', 'pageSize'])
      state.commit('search_api_param', paramAfter)
      // state.dispatch("nomalSearch")
      this.vue.getSearchParams('company_filter', state, param, 'visualization')
      return window.Axios({
        method: 'get',
        url: '/api/company_filter/visualization',
        params: _.assign(param, {
          accesstoken: GETCOOKIEFUN("accesstoken")
        })
      }).then(res => {
        if (res.data.code === 200 && res.data.data) {
          let data = res.data.data

          state.commit('kshRes', data)
          state.commit('analyLoading', false)
        }
      }).catch(err => {
        console.log(err)
        state.commit('analyLoading', false)
      })
    },
    getBaseInfo(state, Payload) {
      return window.Axios({
        method: 'get',
        url: '/api/config/view?dbname=company_filter',
        params: {
          accesstoken: GETCOOKIEFUN("accesstoken")
        }
      }).then(res => {
        if (res.data.code === 200 && res.data.data) {
          let data = res.data.data
          if (data.baseconf.dbname) {
            store.commit('Normal/names', {
              'name': data.baseconf.dbename,
              'dbname': data.baseconf.dbname
            })
          }
          state.commit('allBase', data.baseconf) //
          state.commit('tableconf', data.tableconf)
          state.commit('helpInfo', data.helpconf)
          state.commit("update_conf", data.updatelog)
          // 权限处理 start
          state.commit('norules', data.norules)
          for (let item of state.state.norules.common) {
            switch (item.name) {
              case '高级搜索':
                state.state.nopms.gjss = true;
                break
              case '条件筛选':
                state.state.nopms.tjsx = true;
                break
              case '可视化':
                state.state.nopms.ksh = true;
                break
              case '详情页':
                state.state.nopms.xqy = true;
                break
              case '导出(默认300)':
                state.state.nopms.dc = true;
                break
              case '翻页(最大75)':
                state.state.nopms.fy = true;
                break
              case '热点搜索':
                state.state.nopms.rdss = true;
                break
            }
          }

          for (let item of state.state.norules.exclusive) {
            switch (item.action) {
              case 'rss':
                state.state.nopms.rss = true;
                break
              case 'namegroup':
                state.state.nopms.namegroup = true;
                break
              case 'qiyegroup':
                state.state.nopms.qiyegroup = true;
                break
              case 'syjggroup':
                state.state.nopms.syjggroup = true;
                break
              case 'timeline':
                state.state.nopms.timeline = true;
                break
              case 'devprocess':
                state.state.nopms.devprocess = true;
                break
            }
          }

          state.state.nopms.list = data.norules.list
          state.state.nopms.detail = data.norules.detail
          // 权限处理 end
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
