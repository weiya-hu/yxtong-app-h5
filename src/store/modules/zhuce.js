import Vue from 'vue'
import Qs from 'qs'
import Lang from '@/i18n/lang/zh-CN.js'
import store from '@/store'
import router from '@/router'
import _ from 'lodash'
const stateObj = {
  allBase: {},
  helpInfo: {},
  update_conf: [],
  tableconf: [],
  listLoading: true, // 控制表格中数据的加载清空
  analyLoading: true,
  topLoading: true,
  analyLoadingBreed: false,
  topLoadingBreed: false,
  error: 0, // 错误码
  tabname: 'first', // 表示目前处于按那种方式浏览/first（受理号）/namegroup（药品名称）/qiyegroup（企业名称）
  path: '/api/zhuce', // 维护当前搜索请求接口
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
  shaixuanNodes: [], // 储存一个筛选条件需要两个字段传值给后端的数据
  shaixuan: {}, // 条件筛选所用的储存对象（主要用于API前的处理）
  //热点查询
  hot_filter_filed: {}, // 热门信息筛选列举项（来源于API的原始数据）
  hot_filter_filedCopy: {}, // 用于已选条件展示使用
  hot_checked: {}, // 已选热门筛选条件
  hot: {}, // 热门筛选条件所用的储存对象（主要用于API前的处理）
  //关联查询
  fourth: {},
  iffirstCommonIn: true, //连接跳转搜索进这个界面
  fourth_checked: {},
  // 查询出的数量
  extendCount: {
    BaseCount: 0,
    NameCount: 0,
    QiyeCount: 0,
    Species: 0
  },
  speciesProdevCount: 0, // 品种申报进展数量
  res1: {}, // 按受理号查询的结果
  res2: [], // 按药品名称查询的结果
  res3: [], // 按企业名称查询的结果
  res4: [], // 按品种浏览查询的结果
  res5: [], // 品种申报进展
  pageSize: '20', // 当前页显示条数（条/页）
  order: {}, // 查询的排序规则
  slh_param: { // 按受理号查询页的附加参数
    order: null, // 排序
    page: 1, // 页数
    pageSize: 20 // 每页条数
  },
  ypmc_param: { // 按药品名称查询页的附加参数
    order: null, // 排序
    page: 1, // 页数
    pageSize: 20 // 每页条数
  },
  qy_param: { // 按企业查询页的附加参数
    order: null, // 排序
    page: 1, // 页数
    pageSize: 20 // 每页条数
  },
  species_param: { // 按品种查询页的附加参数
    order: null, // 排序
    page: 1, // 页数
    pageSize: 20 // 每页条数
  },
  speciesProdev_param: { // 品种申报进展
    order: null, // 排序
    page: 1, // 页数
    pageSize: 20 // 每页条数
  },
  // 可视化结果
  kshRes: {
    noClear: true
  },
  chengbanriqiType: 'year', // 日期类型-按受理号统计
  chengbanriqiTypeBreed: 'year', // 日期类型-按品种统计
  param: {}, // 用于申报趋势切换日期类型-按受理号统计
  paramBreed: {}, // 用于申报趋势切换日期类型-按品种统计
  // 基础数量统计-按受理号统计
  base: {},
  // 基础数量统计 统计数量较慢的产品和申报企业-按受理号统计
  base2: {},
  // 申报趋势-按受理号统计
  pizhun: [],
  // 申报趋势-按受理号统计
  shenbaoshuliang: [],
  // 申报数量-按受理号统计
  shenbaobanli: [],
  // 申请类型-按受理号统计
  shenqingleixing: [],
  // 药品类型-按受理号统计
  yaopinleixing: [],
  // 审评结论-按受理号统计
  xulie: [],
  // 办理状态-按受理号统计
  guifanzhuangtaizhongwen: [],
  // ATC分类-按受理号统计
  atc: [],
  // 剂型-按受理号统计
  guifanjixing: [],
  // 企业排名-按受理号统计
  guifanqiyezhongbiao: [],
  // 申报地区-按受理号统计
  shengfen: [],
  // 基础数量统计-按品种统计
  baseBreed: {},
  // 申报趋势-按受理号统计
  pizhunBreed: [],
  // 申报趋势-按受理号统计
  shenbaoshuliangBreed: [],
  // 申报数量-按受理号统计
  shenbaobanliBreed: [],
  // 申请类型-按受理号统计
  shenqingleixingBreed: [],
  // 药品类型-按受理号统计
  yaopinleixingBreed: [],
  // 审评结论-按受理号统计
  xulieBreed: [],
  // 办理状态-按受理号统计
  guifanzhuangtaizhongwenBreed: [],
  // ATC分类-按受理号统计
  atcBreed: [],
  // 剂型-按受理号统计
  guifanjixingBreed: [],
  // 企业排名-按受理号统计
  guifanqiyezhongbiaoBreed: [],
  // 申报地区-按受理号统计
  shengfenBreed: [],
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
  accurateValue: false // 精确查询
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
    topLoading(state, Payload) {
      state.topLoading = Payload
    },
    analyLoadingBreed(state, Payload) {
      state.analyLoadingBreed = Payload
    },
    topLoadingBreed(state, Payload) {
      state.topLoadingBreed = Payload
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
    speciesProdevCount(state, Payload) {
      state.speciesProdevCount = Payload
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
            let atcs_sel = Payload[i].atcs_sel

            // atc多分类，如果存在参数值默认为1，与后台约定好的
            if (atcs_sel) {
              obj.atcs_sel = 1
            }
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
    shaixuanNodes(state, Payload) {
      state.shaixuanNodes = Payload
      console.log(state.shaixuanNodes);
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
    res4(state, Payload) {
      state.res4 = Payload
    },
    // 品种申报进展
    res5(state, Payload) {
      state.res5 = Payload
    },
    // 智能分析 - 可视化的获取API数据
    kshRes(state, Payload) {
      state.kshRes = Payload
    },
    // 基础数量统计-按受理号统计
    base(state, Payload) {
      state.base = Payload
    },
    // 基础数量统计
    base2(state, Payload) {
      state.base2 = Payload
    },
    chengbanriqiType(state, Payload) {
      state.chengbanriqiType = Payload
    },
    chengbanriqiTypeBreed(state, Payload) {
      state.chengbanriqiTypeBreed = Payload
    },
    param(state, Payload) {
      state.param = Payload
    },
    // 申报趋势
    pizhun(state, Payload) {
      state.pizhun = Payload
    },
    // 申报趋势
    shenbaoshuliang(state, Payload) {
      state.shenbaoshuliang = Payload
    },
    // 申报数量
    shenbaobanli(state, Payload) {
      state.shenbaobanli = Payload
    },
    // 申请类型
    shenqingleixing(state, Payload) {
      state.shenqingleixing = Payload
    },
    // 药品类型
    yaopinleixing(state, Payload) {
      state.yaopinleixing = Payload
    },
    // 审评结论
    xulie(state, Payload) {
      state.xulie = Payload
    },
    // 办理状态
    guifanzhuangtaizhongwen(state, Payload) {
      state.guifanzhuangtaizhongwen = Payload
    },
    // ATC分类
    atc(state, Payload) {
      state.atc = Payload
    },
    // 剂型
    guifanjixing(state, Payload) {
      state.guifanjixing = Payload
    },
    // 企业排名
    guifanqiyezhongbiao(state, Payload) {
      state.guifanqiyezhongbiao = Payload
    },
    // 申报地区
    shengfen(state, Payload) {
      state.shengfen = Payload
    },
    // 基础数量统计-按品种统计
    baseBreed(state, Payload) {
      state.baseBreed = Payload
    },
    paramBreed(state, Payload) {
      state.paramBreed = Payload
    },
    // 申报趋势
    pizhunBreed(state, Payload) {
      state.pizhunBreed = Payload
    },
    // 申报趋势
    shenbaoshuliangBreed(state, Payload) {
      state.shenbaoshuliangBreed = Payload
    },
    // 申报数量
    shenbaobanliBreed(state, Payload) {
      state.shenbaobanliBreed = Payload
    },
    // 申请类型
    shenqingleixingBreed(state, Payload) {
      state.shenqingleixingBreed = Payload
    },
    // 药品类型
    yaopinleixingBreed(state, Payload) {
      state.yaopinleixingBreed = Payload
    },
    // 审评结论
    xulieBreed(state, Payload) {
      state.xulieBreed = Payload
    },
    // 办理状态
    guifanzhuangtaizhongwenBreed(state, Payload) {
      state.guifanzhuangtaizhongwenBreed = Payload
    },
    // ATC分类
    atcBreed(state, Payload) {
      state.atcBreed = Payload
    },
    // 剂型
    guifanjixingBreed(state, Payload) {
      state.guifanjixingBreed = Payload
    },
    // 企业排名
    guifanqiyezhongbiaoBreed(state, Payload) {
      state.guifanqiyezhongbiaoBreed = Payload
    },
    // 申报地区
    shengfenBreed(state, Payload) {
      state.shengfenBreed = Payload
    },
    // 设置精确查询复选框
    setAccurateValue(state, Payload) {
      state.accurateValue = Payload
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
        // console.log("查询内容：",state.state.query)
        state.commit('putong', state.state.query)
      }
      state.commit('gaoji', state.state.conditions)
      state.commit('shaixuan', state.state.groups)
      state.commit('hot', state.state.hot_checked)
      // state.commit('fourth', state.state.fourth_checked)
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

        console.log(filterRes, sgroup);

        let zhuangtai = [],
          guifanzhuangtaizhongwen = [],
          zhuangtaiString = '',
          guifanzhuangtaizhongwenStr = ''
        console.log(state.state.shaixuanNodes);
        // 遍历存储好的key值为zhuangtai的所有筛选项
        state.state.shaixuanNodes.length > 0 && state.state.shaixuanNodes.map(v => {
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
        console.log(guifanzhuangtaizhongwenStr, zhuangtaiString);
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
      let sfourth = state.state.fourth
      let shot = state.state.hot
      if (state.state.gaoji.words) {
        param = (Payload && Payload.params) ? _.assign({}, sfourth, swords, sgroup, shot, Payload.params) : _.assign({}, sfourth, swords, sgroup, shot, {
          page: 1,
          pageSize: state.state[(state.state.tabname === 'first' ? 'slh' : state.state.tabname === 'namegroup' ? 'ypmc' : state.state.tabname === 'qiyegroup' ? 'qy' : state.state.tabname === 'speciesgroup' ? 'species' : 'speciesProdev') + '_param'].pageSize
        })
      } else {
        param = (Payload && Payload.params) ? _.assign({}, sfourth, sparam, sgroup, shot, Payload.params) : _.assign({}, sfourth, sparam, sgroup, shot, {
          page: 1,
          pageSize: state.state[(state.state.tabname === 'first' ? 'slh' : state.state.tabname === 'namegroup' ? 'ypmc' : state.state.tabname === 'qiyegroup' ? 'qy' : state.state.tabname === 'speciesgroup' ? 'species' : 'speciesProdev') + '_param'].pageSize
        })
      }

      //关键词统计方法
      param = _.assign(param, this.vue.searchKeywords(state.state, Payload))

      // 当没有跟其他参数时，正常搜索，回到第一页
      if (!Payload || Payload === state.state.putong) {
        // state.commit("extendCount", {
        //   BaseCount: 0,
        //   NameCount: 0,
        //   QiyeCount: 0
        // })
        if (!this.vue.isEqual('zhuce', param, false)) {
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
        state.state.slh_param.page = 1
        state.state.slh_param.order = null
        state.state.ypmc_param.page = 1
        state.state.ypmc_param.order = null
        state.state.qy_param.page = 1
        state.state.qy_param.order = null
        state.state.species_param.page = 1
        state.state.species_param.order = null
        state.state.speciesProdev_param.page = 1
        state.state.speciesProdev_param.order = null
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
      // state.dispatch("getKshRes")
      // if (Qs.stringify(state.state.search_api_param) != Qs.stringify(param)) {
      // 当存在排序的时候 不去调用条件筛选接口
      if (param.order == null) {
        this.vue.getSearchParams('zhuce', state, param, null, Payload)
      }

      if (router.currentRoute.query.tabName) {
        if (param.words) param.words = param.words.split("ylbm")[0] + "ylbm" + param.words.split("ylbm")[1];
      }

      let that = this
      return window.Axios({
        method: 'get',
        url: state.state.path,
        params: _.assign(param, {
          accesstoken: GETCOOKIEFUN("accesstoken")
        })
      }).then(async res => {
        if (res.data.data) {
          let data = res.data.data
          let dataLen = _.keys(data).length
          state.commit('error', 0)
          let addSecData
          //二级列表数据关联到一级列表数据
          if (state.state.tabname !== 'speciesProdev') {
            addSecData = state.state.tabname != 'first' && data.List ? data.List.map((item) => {
              item.second = {}
              return item
            }) : []
          } else {
            state.commit('speciesProdevCount', data.List.count)
          }

          // 千分位配置设置开始（千分位举例：123,456每三位逗号隔开）
          await this.vue.thousandSet(data.List.res, 'Zhuce').then(value => {
            data.List.res = value
            console.log(value)
          })
          // 千分位配置设置结束

          switch (state.state.tabname) {
            case 'first':
              state.commit('res1', data.List ? data.List : [])
              break
            case 'namegroup':
              state.commit('res2', addSecData)
              break
            case 'qiyegroup':
              state.commit('res3', addSecData)
              break
            case 'speciesgroup':
              state.commit('res4', addSecData)
              break
            case 'speciesProdev':
              state.commit('res5', data.List.res)
              break
            default:
              state.commit('res1', data.List ? data.List : [])
              break
          }
          that.frontEndLog(that.$route.path, {
            handlerType: 'refresh',
            handlerTypeDesc: '数据库详情点击扩展跳转无数据',
            count: data.List.length,
            token: GETCOOKIEFUN("accesstoken")
          })
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
    // 获取分组下的列表信息（在“按药品名称浏览”、“按企业名称浏览”中每一项的下拉项中有用到）
    getGroupRes(state, Payload) {
      // 高级搜索不为空则使用高级搜索
      let param = {} // 储存axios获取数据的API参数

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

        console.log(filterRes, sgroup);

        let zhuangtai = [],
          guifanzhuangtaizhongwen = [],
          zhuangtaiString = '',
          guifanzhuangtaizhongwenStr = ''

        // 遍历存储好的key值为zhuangtai的所有筛选项
        state.state.shaixuanNodes.length > 0 && state.state.shaixuanNodes.map(v => {
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
        console.log(guifanzhuangtaizhongwenStr, zhuangtaiString);

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
        url: '/api/config/search?dbname=zhuce'
      }).then(res => {
        if (!_.isObject(res.data.data) || !_.isArray(res.data.data.normal)) {
          this.vue.frontEndLog(location.href, {
            handlerTypeDesc: '注册普通搜索条件数据错误',
            res: res
          })
        }
        if (res.data.code === 200 && res.data.data) {
          let data = res.data.data
          // 普通搜索项
          state.commit('nomalFiled', data.normal)
          state.commit('match_putong', data.normal)
          // console.log(data.filter);
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
    // 基础数量统计
    getBase(state, param) {
      return state.dispatch('commonAxios', {
        param,
        action: 'base'
      })
    },
    // 申报趋势
    getPizhun(state, param) {
      return state.dispatch('commonAxios', {
        param,
        action: 'pizhun'
      })
    },
    // 申报趋势
    getShenbaoshuliang(state, param) {
      return state.dispatch('commonAxios', {
        param,
        action: 'shenbaoshuliang'
      });
    },
    // 申报数量
    getShenbaobanli(state, param) {
      return state.dispatch('commonAxios', {
        param,
        action: 'shenbaobanli'
      });
    },
    // 申请类型
    getShenqingleixing(state, param) {
      return state.dispatch('commonAxios', {
        param,
        action: 'shenqingleixing'
      });
    },
    // 药品类型
    getYaopinleixing(state, param) {
      return state.dispatch('commonAxios', {
        param,
        action: 'yaopinleixing'
      });
    },
    // 审评结论
    getXulie(state, param) {
      return state.dispatch('commonAxios', {
        param,
        action: 'xulie'
      });
    },
    // 办理状态
    getGuifanzhuangtaizhongwen(state, param) {
      return state.dispatch('commonAxios', {
        param,
        action: 'guifanzhuangtaizhongwen'
      });
    },
    // ATC分类
    getAtc(state, param) {
      return state.dispatch('commonAxios', {
        param,
        action: 'atc'
      });
    },
    // 剂型
    getGuifanjixing(state, param) {
      return state.dispatch('commonAxios', {
        param,
        action: 'guifanjixing'
      });
    },
    // 企业排名
    getGuifanqiyezhongbiao(state, param) {
      return state.dispatch('commonAxios', {
        param,
        action: 'guifanqiyezhongbiao'
      });
    },
    // 申报地区
    getShengfen(state, param) {
      return state.dispatch('commonAxios', {
        param,
        action: 'shengfen'
      });
    },
    // 基础数量统计
    getBaseBreed(state, param) {
      return state.dispatch('commonAxios', {
        param,
        type: 2,
        action: 'index'
      })
    },
    // 申报趋势
    getPizhunBreed(state, param) {
      return state.dispatch('commonAxios', {
        param,
        type: 2,
        action: 'trend'
      })
    },
    // 申报趋势
    getShenbaoshuliangBreed(state, param) {
      return state.dispatch('commonAxios', {
        param,
        type: 2,
        action: 'trend'
      });
    },
    // 申报数量
    getShenbaobanliBreed(state, param) {
      return state.dispatch('commonAxios', {
        param,
        type: 2,
        action: 'num'
      });
    },
    // 申请类型
    getShenqingleixingBreed(state, param) {
      return state.dispatch('commonAxios', {
        param,
        type: 2,
        action: 'type'
      });
    },
    // 药品类型
    getYaopinleixingBreed(state, param) {
      return state.dispatch('commonAxios', {
        param,
        type: 2,
        action: 'drugtype'
      });
    },
    // 审评结论
    getXulieBreed(state, param) {
      return state.dispatch('commonAxios', {
        param,
        type: 2,
        action: 'conclusion'
      });
    },
    // 办理状态
    getGuifanzhuangtaizhongwenBreed(state, param) {
      return state.dispatch('commonAxios', {
        param,
        type: 2,
        action: 'status'
      });
    },
    // ATC分类
    getAtcBreed(state, param) {
      return state.dispatch('commonAxios', {
        param,
        type: 2,
        action: 'atc'
      });
    },
    // 剂型
    getGuifanjixingBreed(state, param) {
      return state.dispatch('commonAxios', {
        param,
        type: 2,
        action: 'dosage'
      });
    },
    // 企业排名
    getGuifanqiyezhongbiaoBreed(state, param) {
      return state.dispatch('commonAxios', {
        param,
        type: 2,
        action: 'rank'
      });
    },
    // 申报地区
    getShengfenBreed(state, param) {
      return state.dispatch('commonAxios', {
        param,
        type: 2,
        action: 'area'
      });
    },
    // 获取智能分析中的可视化数据
    async getKshRes(state) {
      console.time('开始')
      state.commit('topLoading', true)
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

        console.log(filterRes, sgroup);

        let zhuangtai = [],
          guifanzhuangtaizhongwen = [],
          zhuangtaiString = '',
          guifanzhuangtaizhongwenStr = ''

        // 遍历存储好的key值为zhuangtai的所有筛选项
        state.state.shaixuanNodes.length > 0 && state.state.shaixuanNodes.map(v => {
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
        console.log(guifanzhuangtaizhongwenStr, zhuangtaiString);
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
      if (!state.state.kshRes.noClear && !this.vue.isEqual('zhuce', param, false)) {
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
        state.state.species_param.page = 1
        state.state.species_param.order = null
        state.state.speciesProdev_param.page = 1
        state.state.speciesProdev_param.order = null
      }
      //关键词统计方法
      param = _.assign(param, this.vue.searchKeywords(state.state))
      let paramAfter = _.omit(param, ['order', 'page', 'pageSize'])
      state.commit('search_api_param', paramAfter)
      // state.dispatch("nomalSearch")
      this.vue.getSearchParams('zhuce', state, param, 'visualizationNew')

      state.commit('param', param)

      // 基础数量统计
      state.dispatch('getBase', _.cloneDeep(_.assign(param, {
          ismore: 1
        })))
        .then(baseData => {
          if (baseData.data.code === 200 && baseData.data.data) {
            let data = baseData.data.data;
            state.commit('base2', data)
          }
        }).catch(err => {
          console.log(err)
        })

      let axiosList = [
        // 基础数量统计
        state.dispatch('getBase', _.cloneDeep(_.assign(param, {
          ismore: 0
        }))),
        // 申报趋势
        state.dispatch('getPizhun', _.cloneDeep(_.assign(param, {
          chengbanriqiType: state.state.chengbanriqiType
        }))),
        // 申报趋势
        state.dispatch('getShenbaoshuliang', _.cloneDeep(_.assign(param, {
          chengbanriqiType: state.state.chengbanriqiType
        }))),
        // 申报数量
        state.dispatch('getShenbaobanli', param),
        // 申请类型
        state.dispatch('getShenqingleixing', param),
        // 药品类型
        state.dispatch('getYaopinleixing', param),
        // 审评结论
        state.dispatch('getXulie', param),
        // 办理状态
        state.dispatch('getGuifanzhuangtaizhongwen', param),
        // ATC分类
        state.dispatch('getAtc', param),
        // 剂型
        state.dispatch('getGuifanjixing', param),
        // 企业排名
        state.dispatch('getGuifanqiyezhongbiao', param),
        // 申报地区
        state.dispatch('getShengfen', param)
      ];
      try {
        let res = await Promise.all(axiosList);
        res.forEach((item, i) => {
          if (item.data.code === 200 && item.data.data) {
            let data = item.data.data,
              actions = [
                'base',
                'pizhun',
                'shenbaoshuliang',
                'shenbaobanli',
                'shenqingleixing',
                'yaopinleixing',
                'xulie',
                'guifanzhuangtaizhongwen',
                'atc',
                'guifanjixing',
                'guifanqiyezhongbiao',
                'shengfen'
              ]
            state.commit(actions[i], data)
          }
        })
        state.commit('topLoading', false)
        state.commit('analyLoading', false)
        console.timeEnd('开始')
      } catch (error) {
        state.commit('topLoading', false)
        state.commit('analyLoading', false)
        console.log(error);
      }
    },
    // 获取智能分析中按品种统计的可视化数据
    async getKshRes_Breed(state) {
      console.time('开始')
      state.commit('topLoadingBreed', true)
      state.commit('analyLoadingBreed', true)

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

        console.log(filterRes, sgroup);

        let zhuangtai = [],
          guifanzhuangtaizhongwen = [],
          zhuangtaiString = '',
          guifanzhuangtaizhongwenStr = ''

        // 遍历存储好的key值为zhuangtai的所有筛选项
        state.state.shaixuanNodes.length > 0 && state.state.shaixuanNodes.map(v => {
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
        console.log(guifanzhuangtaizhongwenStr, zhuangtaiString);
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

      let sfourth = state.state.fourth
      let shot = state.state.hot

      if (state.state.gaoji.words) {
        // 高级搜索条件 条件筛选条件 传过来的附加条件（如果有的话 => page pageSize order） - 进行组合
        param = _.assign({}, sfourth, swords, sgroup, shot)
      } else {
        // 普通搜索条件 条件筛选条件 传过来的附加条件（如果有的话 => page pageSize order） - 进行组合
        param = _.assign({}, sfourth, sparam, sgroup, shot)
      }
      //有调用getSearchParams方法isEqual加参false防止接口重复调用
      if (!state.state.kshRes.noClear && !this.vue.isEqual('zhuce', param, false)) {
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
        state.state.species_param.page = 1
        state.state.species_param.order = null
        state.state.speciesProdev_param.page = 1
        state.state.speciesProdev_param.order = null
      }
      //关键词统计方法
      param = _.assign(param, this.vue.searchKeywords(state.state))
      let paramAfter = _.omit(param, ['order', 'page', 'pageSize'])
      state.commit('search_api_param', paramAfter)
      // state.dispatch("nomalSearch")
      this.vue.getSearchParams('zhuce', state, param, 'visualizationNew')

      state.commit('paramBreed', param)

      let baseList = [
        // 基础数量统计
        state.dispatch('getBaseBreed', {
          ...param,
          index_subset: 0
        }),
        // 基础数量统计
        state.dispatch('getBaseBreed', {
          ...param,
          index_subset: 1
        }),
        // 基础数量统计
        state.dispatch('getBaseBreed', {
          ...param,
          index_subset: 2
        }),
        // 基础数量统计
        state.dispatch('getBaseBreed', {
          ...param,
          index_subset: 3
        })
      ]

      try {
        let res = await Promise.all(baseList),
          tmpBase = {};
        res.forEach((item, i) => {
          if (item.data.code === 200 && item.data.data) {
            let data = item.data.data;
            tmpBase = {
              ...data,
              ...tmpBase
            };
          }
        })
        state.commit('baseBreed', tmpBase);
        state.commit('topLoadingBreed', false)
      } catch (error) {
        state.commit('topLoadingBreed', false)
        console.log(error);
      }

      let axiosList = [
        // 申报趋势
        state.dispatch('getPizhunBreed', {
          ..._.cloneDeep(_.assign(param, {
            chengbanriqiType: state.state.chengbanriqiTypeBreed
          })),
          trend_subset: 0
        }),
        // 申报趋势
        state.dispatch('getShenbaoshuliangBreed', {
          ..._.cloneDeep(_.assign(param, {
            chengbanriqiType: state.state.chengbanriqiTypeBreed
          })),
          trend_subset: 1
        }),
        // 申报数量
        state.dispatch('getShenbaobanliBreed', param),
        // 申请类型
        state.dispatch('getShenqingleixingBreed', param),
        // 药品类型
        state.dispatch('getYaopinleixingBreed', param),
        // 审评结论
        state.dispatch('getXulieBreed', param),
        // 办理状态
        state.dispatch('getGuifanzhuangtaizhongwenBreed', param),
        // ATC分类
        state.dispatch('getAtcBreed', param),
        // 剂型
        state.dispatch('getGuifanjixingBreed', param),
        // 企业排名
        state.dispatch('getGuifanqiyezhongbiaoBreed', param),
        // 申报地区
        state.dispatch('getShengfenBreed', param)
      ];
      try {
        let res = await Promise.all(axiosList);
        res.forEach((item, i) => {
          if (item.data.code === 200 && item.data.data) {
            let data = item.data.data,
              actions = [
                'pizhunBreed',
                'shenbaoshuliangBreed',
                'shenbaobanliBreed',
                'shenqingleixingBreed',
                'yaopinleixingBreed',
                'xulieBreed',
                'guifanzhuangtaizhongwenBreed',
                'atcBreed',
                'guifanjixingBreed',
                'guifanqiyezhongbiaoBreed',
                'shengfenBreed'
              ]
            state.commit(actions[i], data)
          }
        })
        state.commit('topLoadingBreed', false)
        state.commit('analyLoadingBreed', false)
        console.timeEnd('开始')
      } catch (error) {
        state.commit('topLoadingBreed', false)
        state.commit('analyLoadingBreed', false)
        console.log(error);
      }
    },
    getBaseInfo(state, Payload) {
      return window.Axios({
        method: 'get',
        url: '/api/config/view?dbname=zhuce',
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
              case 'speciesgroup':
                state.state.nopms.speciesgroup = true;
                break
              case 'speciesProdev':
                state.state.nopms.speciesProdev = true;
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
