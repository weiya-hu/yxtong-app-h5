import Vue from 'vue'
import Qs from 'qs'
import store from '@/store'

const stateObj = {
  allBase: {},
  helpInfo: {},
  update_conf: [],
  tableconf: [],
  listLoading: true, // 控制表格中数据的加载清空
  topLoading: true,
  analyLoading: true,
  error: 0, // 错误码
  tabname: 'first', // 表示目前处于按那种方式浏览/first（按登记号浏览）/conditions1group（按疾病领域）/interventions1group（按干预药物）/sponsor1group(按申报者合作者)/clinicalresultsgroup(按临床结果)
  path: '/api/clinical', // 维护当前搜索请求接口
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
  filters: [], // 条件筛选结果
  filters1: [], // 添加问号标注添加条件筛选
  groups: {}, // 已选筛选条件
  shaixuan: {}, // 条件筛选所用的储存对象（主要用于API前的处理）
  //热点查询
  hot_filter_filed: {}, // 热门信息筛选列举项（来源于API的原始数据）
  hot_filter_filedCopy: {},
  hot_checked: {}, // 已选热门筛选条件
  hot: {}, // 热门筛选条件所用的储存对象（主要用于API前的处理）
  //关联查询
  fourth: {},
  iffirstCommonIn: true, //连接跳转搜索进这个界面
  fourth_checked: {},
  // 查询出的数量
  extendCount: {
    BaseCount: 0,
    Conditions1Count: 0,
    Interventions1Count: 0,
    Sponsor1Count: 0,
    ClinicalresultsCount: 0
  },
  // 基础数量统计
  base: {},
  // 申报趋势
  received: [],
  // 试验分期
  phases: [],
  // 研究类型
  study_guifan: [],
  // 疾病领域 TOP10
  conditions1_guifan: [],
  // 干预药物类别 TOP10
  interventions1_guifan: [],
  // 申办/合作单位 TOP20
  sponsor2: [],
  jblyLevel: 1,
  gyywlbLevel: 1,
  res1: {}, // 按登记号
  res2: [], // 按疾病领域
  res3: [], // 按干预药物类别
  res4: [], // 按申办者合作者
  res5: [], // 按申办者合作者
  pageSize: '20', // 当前页显示条数（条/页）
  order: {}, // 查询的排序规则
  djh_param: { // 按登记号查询页的附加参数
    order: null, // 排序
    page: 1, // 页数
    pageSize: 20 // 每页条数
  },
  jbly_param: { // 按疾病领域查询页的附加参数
    order: null, // 排序
    page: 1, // 页数
    pageSize: 20 // 每页条数
  },
  gyyw_param: { // 按干预药物查询页的附加参数
    order: null, // 排序
    page: 1, // 页数
    pageSize: 20 // 每页条数
  },
  sbz_param: { // 按申办者合作者查询页的附加参数
    order: null, // 排序
    page: 1, // 页数
    pageSize: 20 // 每页条数
  },
  lcjg_param: { // 按临床结果查询页的附加参数
    order: null, // 排序
    page: 1, // 页数
    pageSize: 20 // 每页条数
  },
  cate_param: {
    name: null,
    cate: null,
    type: 'conditions',
    order: null, // 排序
    page: 1, // 页数
    pageSize: 20 // 每页条数
  },
  param: {},
  cate_param_one: '',
  cateCount: 0,
  cateNum: [],
  cateList: {},
  changeBox: 'szm',
  cateLabelObj: {
    conditions: '疾病领域',
    interventions: '药物干预',
    rare: '罕见病',
    dietary: '膳食补充剂',
    sponsor: '申办者/合作者',
    locations: '地区',
  },
  mapGeoJson: {},
  // 可视化结果
  kshRes: {},
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
  norules: {},
  queryData: {},
  // 可视化结果
  kshRes: {
    noClear: true
  },
}
export default {
  namespaced: true,
  state: Object.assign({}, stateObj),
  mutations: {
    queryData(state, Payload) {
      console.log(Payload);
      state.queryData = Payload
    },
    param(state, Payload) {
      state.param = Payload
    },
    reset(state, Payload) {
      store.state.clinical = Object.assign({}, stateObj)
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
    topLoading(state, Payload) {
      state.topLoading = Payload
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

      let words = ''
      let atcs_sel = false
      _.map(Payload, (item, index) => {
        if (item.value) { // 去空
          if (item.atcs_sel) {
            atcs_sel = true
          };
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
      if (Object.keys(state.hot_filter_filedCopy).length <= 0) {
        state.hot_filter_filedCopy = Payload
      }
    },
    /*
     * 全球临床 - API数据
     */
    // 按登记号查询的API数据
    res1(state, Payload) {
      state.res1 = Payload
    },
    // 按疾病领域查询的API数据
    res2(state, Payload) {
      state.res2 = Payload
    },
    // 按干预药物查询的API数据
    res3(state, Payload) {
      state.res3 = Payload
    },
    // 按申办者合作者查询的API数据
    res4(state, Payload) {
      state.res4 = Payload
    },
    // 按临床结果查询的API数据
    res5(state, Payload) {
      state.res5 = Payload
    },
    // 智能分析 - 可视化的获取API数据
    kshRes(state, Payload) {
      state.kshRes = Payload
    },
    param(state, Payload) {
      state.param = Payload
    },
    // 基础数量统计-按受理号统计
    base(state, Payload) {
      state.base = Payload
    },
    // 登记趋势
    received(state, Payload) {
      state.received = Payload
    },
    // 试验分期
    phases(state, Payload) {
      state.phases = Payload
    },
    // 研究类型
    study_guifan(state, Payload) {
      state.study_guifan = Payload
    },
    // 疾病领域 TOP10
    conditions1_guifan(state, Payload) {
      state.conditions1_guifan = Payload
    },
    // 干预药物类别 TOP10
    interventions1_guifan(state, Payload) {
      state.interventions1_guifan = Payload
    },
    // 申办/合作单位 TOP20
    sponsor2(state, Payload) {
      state.sponsor2 = Payload
    },
    jblyLevel(state, Payload) {
      state.jblyLevel = Payload
    },
    gyywlbLevel(state, Payload) {
      state.gyywlbLevel = Payload
    },
    cateList(state, Payload) {
      state.cateList = Payload
    },
    cate_param(state, Payload) {
      state.cate_param = Payload
    },
    cateNum(state, Payload) {
      state.cateNum = Payload
    },
    cateCount(state, Payload) {
      state.cateCount = Payload
    },
    changeBox(state, Payload) {
      state.changeBox = Payload
    },
    cate_param_one(state, Payload) {
      state.cate_param_one = Payload
    },
    mapGeoJson(state, Payload) {
      state.mapGeoJson = Payload
    },
  },
  actions: {
    reset(state, Payload) {
      state.commit('handleReset')
    },
    // 普通搜索 和 高级搜索 通用方法
    nomalSearch(state, Payload) { //type为1时是为了
      console.log(Payload);
      state.commit('listLoading', true)
      if (!this.iffirstCommonIn) {
        state.commit("fourth", state.state.fourth_checked);
      }
      this.iffirstCommonIn = false;

      // 确定api的url
      if (Payload !== undefined) {
        if (Payload.path) {
          state.commit('path', Payload.path)
        }
      }
      let param = {} // 储存axios获取数据的API参数
      if (Payload && !Payload.queryToPutong) { // 不把query的状态传给putong
      } else {
        // console.log("查询内容：",state.state.query)
        state.commit('putong', state.state.query)
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
          pageSize: state.state[(state.state.tabname === 'first' ? 'djh' : state.state.tabname === 'conditions1group' ? 'jbly' : state.state.tabname === 'interventions1group' ? 'gyyw' : state.state.tabname === 'sponsor1group' ? 'sbz' : 'lcjg') + '_param'].pageSize
        })
      } else {
        param = (Payload && Payload.params) ? _.assign({}, sfourth, sparam, sgroup, shot, Payload.params) : _.assign({}, sfourth, sparam, sgroup, shot, {
          page: 1,
          pageSize: state.state[(state.state.tabname === 'first' ? 'djh' : state.state.tabname === 'conditions1group' ? 'jbly' : state.state.tabname === 'interventions1group' ? 'gyyw' : state.state.tabname === 'sponsor1group' ? 'sbz' : 'lcjg') + '_param'].pageSize
        })
      }
      //关键词统计方法
      param = _.assign(param, this.vue.searchKeywords(state.state, Payload))
      console.log(param);
      console.log(sgroup);
      // 疾病领域、干预药物、申办者合作者特殊传参
      if (sgroup.filter_condition) {
        if ((sgroup.filter_condition.indexOf('conditions1_guifan') !== -1 || sgroup.filter_condition.indexOf('interventions1_guifan') !== -1) || sgroup.filter_condition.indexOf('sponsor1_guifan') !== -1) {

          if (sgroup.filter_condition.indexOf('conditions1_guifan') == -1) {
            delete state.state.queryData.conditions2
          }

          if (sgroup.filter_condition.indexOf('interventions1_guifan') == -1) {
            delete state.state.queryData.interventions2
          }

          if (sgroup.filter_condition.indexOf('sponsor1_guifan') == -1) {
            delete state.state.queryData.sponsor2
          }

          param = _.assign(param, state.state.queryData)
        } else {
          state.state.queryData = {}
        }
      } else {
        state.state.queryData = {}
      }


      // 当没有跟其他参数时，正常搜索，回到第一页
      if (!Payload || Payload === state.state.putong) {
        if (!this.vue.isEqual('clinical', param, false)) {
          state.commit('kshRes', {
            noClear: true
          })
        }

        state.commit('res1', [])
        state.commit('res2', [])
        state.commit('res3', [])
        state.commit('res4', [])
        state.commit('res5', [])
        state.commit('order', {})
        state.state.djh_param.page = 1
        state.state.djh_param.order = null
        state.state.jbly_param.page = 1
        state.state.jbly_param.order = null
        state.state.gyyw_param.page = 1
        state.state.gyyw_param.order = null
        state.state.sbz_param.page = 1
        state.state.sbz_param.order = null
        state.state.lcjg_param.page = 1
        state.state.lcjg_param.order = null
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

      // if (Qs.stringify(state.state.search_api_param) != Qs.stringify(param)) {
      if (param.order == null) {
        this.vue.getSearchParams('clinical', state, param, null, Payload)
      }

      let that = this
      return window.Axios({
        method: 'get',
        // url: state.state.path,
        url: state.state.path,
        params: _.assign(param, {
          accesstoken: GETCOOKIEFUN("accesstoken")
        })
      }).then(res => {

        if (res.data.data) {
          let data = res.data.data
          let dataLen = _.keys(data).length
          state.commit('error', 0)
          //二级列表数据关联到一级列表数据
          let addSecData = state.state.tabname != 'first' && data.res ? data.res.map((item) => {
            item.second = {}
            return item
          }) : []
          switch (state.state.tabname) {
            case 'first':
              state.commit('res1', data.List ? data.List : [])
              break
            case 'conditions1group':
              state.commit('res2', addSecData)
              break
            case 'interventions1group':
              state.commit('res3', addSecData)
              break
            case 'sponsor1group':
              state.commit('res4', addSecData)
              break
            case 'clinicalresultsgroup':
              state.commit('res5', addSecData)
              break
            default:
              state.commit('res1', data.List ? data.List : [])
              break
          }
        }

        if (res.data.code == 404) {
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
    getCatestand(state, Payload) {
      let param = _.assign({}, state.state.cate_param, Payload && Payload.params)
      state.commit('cate_param', _.assign({}, param, {
        is_visual: null
      }))
      state.commit('cate_param_one', param.type)
      // state.commit('listLoading', true)
      state.commit('cateList', {})

      let params = this.vue.keywordStatistics(param, {
        name: state.state.cateLabelObj[state.state.cate_param_one]
      })
      if (params.searchname_zh) {
        params.searchname_zh = params.searchname_zh.replace(',', `,${params.cate ? (params.type === 'locations' ? '按区域' : '按类别') : '按首字母顺序'}_`)
      }

      return window.Axios({
        method: 'get',
        url: '/api/clinical/catestand',
        params
      }).then(res => {

        if (res.data.data) {
          let data = res.data.data
          let dataLen = _.keys(data).length
          state.commit('error', 0)
          if (dataLen) {
            state.commit('cateCount', data.List.count)
            state.commit('cateList', data.List ? data.List : {})
          }
        }

        if (res.data.code == 404) {
          state.commit('cateList', {})
          state.commit('error', 404)
        }
        state.commit('listLoading', false)
        return res
      }).catch((res) => {
        state.commit('cateList', {})
        state.commit('error', 500)
        state.commit('listLoading', false)
        return res
      })
    },
    getSydqData(state, Payload) {
      if (Payload.action == 'locations1_guifan') {
        state.commit('cate_param_one', Payload)

        return window.Axios({
          method: 'get',
          url: '/api/clinical/visualization',
          params: Payload
        }).then(res => {

          if (res.data.code === 200) {
            res.data.data.forEach(item => item.name = item.label)
            state.commit('cateNum', res.data.data)
          }

          if (res.data.code == 404) {
            state.commit('cateNum', [])
            state.commit('error', 404)
          }
          return res
        }).catch((res) => {
          state.commit('cateNum', [])
          state.commit('error', 500)
          return res
        })
      } else if (Payload.action == 'locations2_guifan') {
        let param = _.assign({}, state.state.cate_param, Payload && Payload.params)
        state.commit('cate_param', _.assign({}, param, {
          is_visual: null
        }))
        state.commit('cate_param_one', param.type)
        state.commit('cateList', {})

        let params = this.vue.keywordStatistics(param, {
          name: state.state.cateLabelObj[state.state.cate_param_one]
        })
        if (params.searchname_zh) {
          params.searchname_zh = params.searchname_zh.replace(',', `,${params.cate ? (params.type === 'locations' ? '按区域' : '按类别') : '按首字母顺序'}_`)
        }

        return window.Axios({
          method: 'get',
          url: '/api/clinical/visualization',
          params: Payload
        }).then(res => {

          if (res.data.data) {
            let data = res.data.data
            let dataLen = _.keys(data).length
            state.commit('error', 0)
            if (dataLen) {
              data.forEach(item => {
                item.title = item.locations2_guifan
                delete item.locations2_guifan
              })
              state.commit('cateCount', data.length)
              console.log(data);
              let tmpData = {
                count: data.length,
                res: data
              }
              state.commit('cateList', tmpData ? tmpData : {})
            }
          }

          if (res.data.code == 404) {
            state.commit('cateList', {})
            state.commit('error', 404)
          }
          return res
        }).catch((res) => {
          state.commit('cateList', {})
          state.commit('error', 500)
          return res
        })
      }
    },
    // getCate(state, Payload) {
    //   state.commit('listLoading', true)
    //   state.commit('cate_param_one', Payload)

    //   return window.Axios({
    //     method: 'get',
    //     url: '/api/clinical/cate',
    //     params: {
    //       type: Payload
    //     }
    //   }).then(res => {

    //     if (res.data.code === 200) {
    //       state.commit('cateNum', res.data.data)
    //     }

    //     if (res.data.code == 404) {
    //       state.commit('cateNum', [])
    //       state.commit('error', 404)
    //     }
    //     state.commit('listLoading', false)
    //     return res
    //   }).catch((res) => {
    //     state.commit('cateNum', [])
    //     state.commit('error', 500)
    //     state.commit('listLoading', false)
    //     return res
    //   })
    // },
    // 获取tab切换的数据
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

      // 疾病领域、干预药物、申办者合作者特殊传参
      if (sgroup.filter_condition) {
        if ((sgroup.filter_condition.indexOf('conditions1_guifan') !== -1 || sgroup.filter_condition.indexOf('interventions1_guifan') !== -1) || sgroup.filter_condition.indexOf('sponsor1_guifan') !== -1) {

          if (sgroup.filter_condition.indexOf('conditions1_guifan') == -1) {
            delete state.state.queryData.conditions2
          }

          if (sgroup.filter_condition.indexOf('interventions1_guifan') == -1) {
            delete state.state.queryData.interventions2
          }

          if (sgroup.filter_condition.indexOf('sponsor1_guifan') == -1) {
            delete state.state.queryData.sponsor2
          }

          param = _.assign(param, state.state.queryData)
        } else {
          state.state.queryData = {}
        }
      } else {
        state.state.queryData = {}
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
        url: '/api/config/search?dbname=clinical'
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
    // 模块通用请求
    commonAxios(state, {
      param,
      action
    }) {
      let params = _.cloneDeep(_.assign(param, {
        accesstoken: GETCOOKIEFUN("accesstoken"),
        action
      }));
      return window.Axios({
        method: 'get',
        url: '/api/clinical/visualization',
        params
      })
    },
    // 基础数量统计
    getBase(state, param) {
      return state.dispatch('commonAxios', {
        param,
        action: 'base'
      })
    },
    // 登记趋势
    getReceived(state, param) {
      return state.dispatch('commonAxios', {
        param,
        action: 'received'
      })
    },
    // 试验分期
    getPhases(state, param) {
      return state.dispatch('commonAxios', {
        param,
        action: 'phases'
      })
    },
    // 研究类型
    getStudy_guifan(state, param) {
      return state.dispatch('commonAxios', {
        param,
        action: 'study_guifan'
      })
    },
    // 疾病领域 TOP10
    getConditions1_guifan(state, param) {
      let action = param.action == 'second_conditions1_guifan' ? 'second_conditions1_guifan' : 'conditions1_guifan'
      if (state.state.jblyLevel == 1) {
        action = 'conditions1_guifan'
      } else if (state.state.jblyLevel == 2) {
        action = 'second_conditions1_guifan'
      }
      console.log(action);
      return state.dispatch('commonAxios', {
        param,
        action
      })
    },
    // 干预药物类别 TOP10
    getInterventions1_guifan(state, param) {
      let action = param.action == 'second_interventions1_guifan' ? 'second_interventions1_guifan' : 'interventions1_guifan'
      if (state.state.gyywlbLevel == 1) {
        action = 'interventions1_guifan'
      } else if (state.state.gyywlbLevel == 2) {
        action = 'second_interventions1_guifan'
      }
      return state.dispatch('commonAxios', {
        param,
        action
      })
    },
    // 申办/合作单位 TOP20
    getSponsor2(state, param) {
      return state.dispatch('commonAxios', {
        param,
        action: 'sponsor2'
      })
    },
    // 获取智能分析中的可视化数据
    async getKshRes(state) {
      console.time('开始')
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
      let sgroup = _.cloneDeep(state.state.shaixuan)
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
      }
      let sfourth = state.state.fourth
      let shot = state.state.hot
      if (state.state.gaoji.words != '') {
        // 高级搜索条件 条件筛选条件 传过来的附加条件（如果有的话 => page pageSize order） - 进行组合
        param = _.assign({}, sfourth, swords, sgroup, shot)
      } else {
        // 普通搜索条件 条件筛选条件 传过来的附加条件（如果有的话 => page pageSize order） - 进行组合
        param = _.assign({}, sfourth, sparam, sgroup, shot)
      }
      //有调用getSearchParams方法isEqual加参false防止接口重复调用
      if (!state.state.kshRes.noClear && !this.vue.isEqual('clinical', param, false)) {
        state.commit('res1', [])
        state.commit('res2', [])
        state.commit('res3', [])
        state.commit('res4', [])
        state.commit('res5', [])
        state.commit('order', {})
      }
      //关键词统计方法
      param = _.assign(param, this.vue.searchKeywords(state.state))
      let paramAfter = _.omit(param, ['order', 'page', 'pageSize'])
      state.commit('search_api_param', paramAfter)
      // state.dispatch("nomalSearch")
      this.vue.getSearchParams('clinical', state, param, 'visualization')

      // 疾病领域、干预药物、申办者合作者特殊传参
      if (sgroup.filter_condition) {
        if ((sgroup.filter_condition.indexOf('conditions1_guifan') !== -1 || sgroup.filter_condition.indexOf('interventions1_guifan') !== -1) || sgroup.filter_condition.indexOf('sponsor1_guifan') !== -1) {

          if (sgroup.filter_condition.indexOf('conditions1_guifan') == -1) {
            delete state.state.queryData.conditions2
          }

          if (sgroup.filter_condition.indexOf('interventions1_guifan') == -1) {
            delete state.state.queryData.interventions2
          }

          if (sgroup.filter_condition.indexOf('sponsor1_guifan') == -1) {
            delete state.state.queryData.sponsor2
          }

          param = _.assign(param, state.state.queryData)
        } else {
          state.state.queryData = {}
        }
      } else {
        state.state.queryData = {}
      }

      state.commit('param', param)

      // 试验地区
      state.dispatch('getSydqData', _.cloneDeep(_.assign(param, {
        action: 'locations1_guifan'
      })))

      let axiosList = [
        // 基础数量统计
        state.dispatch('getBase', param),
        // 登记趋势
        state.dispatch('getReceived', param),
        // 试验分期
        state.dispatch('getPhases', param),
        // 研究类型
        state.dispatch('getStudy_guifan', param),
        // 疾病领域 TOP10
        state.dispatch('getConditions1_guifan', _.cloneDeep(_.assign(param, { level: state.state.jblyLevel }))),
        // 干预药物类别 TOP10
        state.dispatch('getInterventions1_guifan', _.cloneDeep(_.assign(param, { level: state.state.gyywlbLevel }))),
        // 申办/合作单位 TOP20
        state.dispatch('getSponsor2', param)
      ];
      try {
        let res = await Promise.all(axiosList);
        res.forEach((item, i) => {
          if (item.data.code === 200 && item.data.data) {
            let data = item.data.data,
              actions = [
                'base',
                'received',
                'phases',
                'study_guifan',
                'conditions1_guifan',
                'interventions1_guifan',
                'sponsor2'
              ]
            state.commit(actions[i], data)
          }
        })
        state.commit('analyLoading', false)
        console.timeEnd('开始')
      } catch (error) {
        state.commit('analyLoading', false)
        console.log(error);
      }
    },
    getBaseInfo(state, Payload) {
      return window.Axios({
        method: 'get',
        url: '/api/config/view?dbname=clinical',
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
              case 'conditions1group':
                state.state.nopms.conditions1group = true;
                break
              case 'interventions1group':
                state.state.nopms.interventions1group = true;
                break
              case 'sponsor1group':
                state.state.nopms.sponsor1group = true;
                break
              case 'clinicalresultsgroup':
                state.state.nopms.clinicalresultsgroup = true;
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
