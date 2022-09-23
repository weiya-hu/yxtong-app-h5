import Vue from 'vue'
import Qs from 'qs'
import Lang from '@/i18n/lang/zh-CN.js'
import store from '@/store'
import router from '@/router'

const stateObj = {
  allBase: {},
  helpInfo: {},
  update_conf: [],
  tableconf:[],
  listLoading: true, // 控制表格中数据的加载清空
  analyLoading: true,
  error: 0, // 错误码
  tabname: 'first', // 表示目前处于按那种方式浏览/first（药品名称）/namegroup（活性成分）/qiyegroup（企业名称）
  path: '/api/globalapproval', // 维护当前搜索请求接口
  //普通查询
  nomal_filed: [], // 普通搜索列举项（来源于API的原始数据）
  query: [], // 已选普通搜索查询条件 格式请查看readme.md
  queryStr:"", // 由于监听不到数组变化，需监听query时，转成字符串
  putong: {}, // 普通搜索查询条件所用的储存对象（主要用于API前的处理）
  //高级查询
  advanced_filed: [], // 高级搜索列举项（来源于API的原始数据）
  conditions: [], // 已选高级搜索查询条件 格式请查看readme.md
  gaoji: {}, // 高级搜索查询条件所用的储存对象（主要用于API前的处理）
  //二次筛选
  filters: [], // 条件筛选结果
  filters1: [], // 添加问号标注添加条件筛选
  filtersSource: [], // 存储条件筛选国家和地区(按活性成分)的筛选项
  filtersSourceFormulation: [], // 存储条件筛选国家和地区(按制剂)的筛选项
  groups: {}, // 已选筛选条件
  shaixuan: {}, // 条件筛选所用的储存对象（主要用于API前的处理）
  //热点查询
  hot_filter_filed: {}, // 热门信息筛选列举项（来源于API的原始数据）
  hot_checked: {}, // 已选热门筛选条件
  hot: {}, // 热门筛选条件所用的储存对象（主要用于API前的处理）
  //关联查询
  fourth: {},
  iffirstCommonIn:true,//连接跳转搜索进这个界面
  fourth_checked: {},
  // 查询出的数量
  extendCount: {
    BaseCount: 0,
    NameCount: 0,
    QiyeCount: 0
  },
  res1: {}, // 按药品名称查询的结果
  res2: [], // 按活性成分查询的结果
  res3: [], // 按企业名称查询的结果
  pageSize: '20', // 当前页显示条数（条/页）
  order: {}, // 查询的排序规则
  slh_param: { // 按药品名称查询页的附加参数
    order: null, // 排序
    page: 1, // 页数
    pageSize: 20 // 每页条数
  },
  ypmc_param: { // 按活性成分查询页的附加参数
    order: null, // 排序
    page: 1, // 页数
    pageSize: 20 // 每页条数
  },
  qy_param: { // 按企业查询页的附加参数
    order: null, // 排序
    page: 1, // 页数
    pageSize: 20 // 每页条数
  },
  // 可视化结果
  kshRes: {noClear:true},
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
  isGetCount:true,
  norules: {},
  accurateValue: false  // 精确查询
}
export default {
  namespaced: true,
  state: Object.assign({}, stateObj),
  mutations: {
    reset (state, Payload) {
      store.state.Zhuce = Object.assign({}, stateObj)
    },
    nopms (state, Payload) {
      state.nopms = Payload
    },
    norules (state, Payload) {
      state.norules = Payload
    },
    fourth_condition (state, Payload) {
      state.fourth_condition = Payload
    },
    fourth_checked (state, Payload) {
      state.fourth_checked = Payload
    },
    fourth (state, Payload) {

      if(Payload instanceof Array){
        this.iffirstCommonIn = true;
      }else{
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
      state.fourth = fourth_condition ? {"fourth_condition": fourth_condition} : {}
      // console.log(fourth_condition)
    },
    allBase (state, Payload) {
      state.allBase = Payload
    },
    tableconf(state, Payload) {
      state.tableconf = Payload
    },
    helpInfo (state, Payload) {
      state.helpInfo = Payload
    },
    update_conf(state, Payload) {
      state.update_conf = Payload
    },
    saved_options (state, Payload) {
      state.saved_options = Payload
    },
    search_api_param (state, Payload) {
      let obj = _.omit(Payload, ['order', 'page', 'pageSize'])
      state.search_api_param = obj
    },
    match_putong (state, Payload) {
      // state.match_putong = Payload
      for (let item of Payload) {
        _.set(state.match_putong, item.name, item.label)
      }
    },
    match_gaoji (state, Payload) {
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
    match_hot_key (state,Payload) {
      let obj_keyvalue = {}
     _.map(Payload,(value,key)=>{


     })
    },
    listLoading (state, Payload) {
      state.listLoading = Payload
    },
    analyLoading (state, Payload) {
      state.analyLoading = Payload
    },
    error (state, Payload) {
      state.error = Payload
    },
    tabname (state, Payload) {
      state.tabname = Payload
    },
    extendCount (state, Payload) {
      state.extendCount = Payload
    },
    // 普通搜索项
    nomalFiled (state, Payload) {
      state.nomal_filed = Payload
    },
    query (state, Payload) {
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
    queryStr (state) {
      state.queryStr = JSON.stringify(state.query)
    },
    putong (state, Payload) {
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
    conditions (state, Payload) {
      state.conditions = Payload
    },
    gaoji (state, Payload) {

      let words = ''
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
    groups (state, Payload) {
      state.groups = Payload
    },
    shaixuan (state, Payload) {
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
        state.shaixuan = {'filter_condition': group}
      } else {
        state.shaixuan = {}
      }
    },
    hot_checked (state,Payload) {
      state.hot_checked = Payload
    },
    hot (state,Payload) {
      let hotcheckeds = ''
      _.map(Payload,(item,index)=>{

        if (item.length > 0) { // 去空
          if (hotcheckeds == '') {
            hotcheckeds = index + '=' + _.join(item, 'ღ')
          } else {
            hotcheckeds += ' ' + '_and' + ' ' + index + '=' + _.join(item, 'ღ')
          }
        }
      })
      if (hotcheckeds != '') {
        state.hot = {'hot_condition':hotcheckeds}
      } else {
        state.hot = {}
      }
    },
    path (state, Payload) {
      state.path = Payload
    },
    order (state, Payload) {
      state.order = Payload
    },


    // 高级搜索项
    advancedFiled (state, Payload) {
      state.advanced_filed = Payload
    },
    // 条件筛选结果项
    filters (state, Payload) {
      console.log(Payload)
      state.filters = Payload
    },
    // 条件筛选结果项
    filters1 (state, Payload) {
      state.filters1 = Payload
    },
    //
    filtersSource(state, Payload) {
      console.log(Payload)
      state.filtersSource = Payload
    },
    filtersSourceFormulation(state, Payload) {
      state.filtersSourceFormulation = Payload
    },
    // 热门信息筛选项
    hot_filter_filed (state, Payload) {
      state.hot_filter_filed = Payload
    },
    /*
     * 注册数据 - API数据
     */
    // 按药品名称查询的API数据
    res1 (state, Payload) {
      state.res1 = Payload
    },
    // 按活性成分查询的API数据
    res2 (state, Payload) {
      state.res2 = Payload
    },
    // 按企业名称查询的API数据
    res3 (state, Payload) {
      state.res3 = Payload
    },
    // 智能分析 - 可视化的获取API数据
    kshRes (state, Payload) {
      state.kshRes = Payload
    },
    // 设置精确查询复选框
    setAccurateValue (state, Payload) {
      state.accurateValue = Payload
    }
  },
  actions: {
    reset (state, Payload) {
      state.commit('handleReset')
    },
    // 普通搜索 和 高级搜索 通用方法
    nomalSearch (state, Payload) {//type为1时是为了
      // console.log(state.state)
      // return false;
      if(!this.iffirstCommonIn){
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

      // 特殊处理条件筛选国家或地区(按活性成分)筛选
      let sourceAnd = [] // 接收选中的国家或地区
      let sourceNot = [] // 接收排除的国家或地区
      let sourceAndStr = ''
      let sourceNotStr = ''
      let filtersSource = state.state.filtersSource
      console.log(filtersSource);
      if (filtersSource.length>0) {
        _.map(filtersSource, (item, index) => {
          if (item.checked == 1) {
            sourceAnd.push(item.label)
          } else if (item.checked == -1) {
            sourceNot.push(item.label)
          }
        })
        if (sourceAnd.length>0) {
          if (sgroup.filter_condition) {
            sourceAndStr = ` _and source=${_.join(sourceAnd, 'ღ')}`
          } else {
            sourceAndStr = `source=${_.join(sourceAnd, 'ღ')}`
          }
        }

        if (sourceNot.length>0) {
          sourceNot.forEach((item, i) => {
            sourceNotStr += ` _not source=${item}`
          });
        }

        if (sgroup.filter_condition) {
          sgroup.filter_condition = sgroup.filter_condition + sourceAndStr + sourceNotStr
        } else {
          sgroup.filter_condition = sourceAndStr + sourceNotStr
        }
      }

      // 特殊处理条件筛选国家或地区(按制剂)筛选
      let sourceFormulationAnd = [] // 接收选中的国家或地区
      let sourceFormulationNot = [] // 接收排除的国家或地区
      let sourceFormulationAndStr = ''
      let sourceFormulationNotStr = ''
      let filtersSourceFormulation = state.state.filtersSourceFormulation
      console.log(filtersSourceFormulation);
      if (filtersSourceFormulation.length>0) {
        _.map(filtersSourceFormulation, (item, index) => {
          if (item.checked == 1) {
            sourceFormulationAnd.push(item.label)
          } else if (item.checked == -1) {
            sourceFormulationNot.push(item.label)
          }
        })
        if (sourceFormulationAnd.length>0) {
          if (sgroup.filter_condition) {
            sourceFormulationAndStr = ` _and source_formulation=${_.join(sourceFormulationAnd, 'ღ')}`
          } else {
            sourceFormulationAndStr = `source_formulation=${_.join(sourceFormulationAnd, 'ღ')}`
          }
        }

        if (sourceFormulationNot.length>0) {
          sourceFormulationNot.forEach((item, i) => {
            sourceFormulationNotStr += ` _not source_formulation=${item}`
          });
        }

        if (sgroup.filter_condition) {
          sgroup.filter_condition = sgroup.filter_condition + sourceFormulationAndStr + sourceFormulationNotStr
        } else {
          sgroup.filter_condition = sourceFormulationAndStr + sourceFormulationNotStr
        }
      }


      console.log(sgroup)
      let sfourth = state.state.fourth
      let shot = state.state.hot
      if (state.state.gaoji.words) {
        param = (Payload && Payload.params) ? _.assign({}, sfourth, swords, sgroup, shot, Payload.params) : _.assign({}, sfourth, swords, sgroup, shot, {page: 1, pageSize: state.state[(state.state.tabname==='first'?'slh':state.state.tabname==='namegroup'?'ypmc':'qy')+'_param'].pageSize})
      } else {
        param = (Payload && Payload.params) ? _.assign({}, sfourth, sparam, sgroup, shot, Payload.params) : _.assign({}, sfourth, sparam, sgroup, shot, {page: 1, pageSize: state.state[(state.state.tabname==='first'?'slh':state.state.tabname==='namegroup'?'ypmc':'qy')+'_param'].pageSize})
      }

      //关键词统计方法
      param = _.assign(param,this.vue.searchKeywords(state.state,Payload))

      // 当没有跟其他参数时，正常搜索，回到第一页
      if (!Payload||Payload===state.state.putong) {
        // state.commit("extendCount", {
        //   BaseCount: 0,
        //   NameCount: 0,
        //   QiyeCount: 0
        // })
        !this.vue.isEqual('globalapproval',param,false) && state.dispatch("getKshRes",{noClear:true})
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
        state.commit('res1', [])
        state.commit('res2', [])
        state.commit('res3', [])
        state.commit('order', {})
      }
      state.commit('search_api_param', paramAfter)
      // state.dispatch("getKshRes")
      // if (Qs.stringify(state.state.search_api_param) != Qs.stringify(param)) {
      this.vue.getSearchParams('globalapproval',state,param,null,Payload)

      if (router.currentRoute.query.tabName) {
        if (param.words) param.words = param.words.split("ylbm")[0] + "ylbm" + param.words.split("ylbm")[1];
      }
      console.log(window.location.href)
      if (window.location.href.indexOf('analy')>-1) {
        return false
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

          //二级列表数据关联到一级列表数据
          let addSecData = state.state.tabname!='first' && data.res ? data.res.map((item)=>{
            item.second = {}
            return item
          }) : []

          // 千分位配置设置开始（千分位举例：123,456每三位逗号隔开）
          await this.vue.thousandSet(data.res, 'Globalapproval').then(value=>{
            data.res = value
            console.log(value)
          })
          // 千分位配置设置结束

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
            default:
              state.commit('res1', data ? data : [])
              break
          }
          that.frontEndLog(that.$route.path, {
            handlerType: 'refresh',
            handlerTypeDesc: '数据库详情点击扩展跳转无数据',
            count: data.length,
            token: GETCOOKIEFUN("accesstoken")
          })
        }

        if (res.data.code == 404) {
          let data=res.data.data
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
    // 获取分组下的列表信息（在“按活性成分浏览”、“按企业名称浏览”中每一项的下拉项中有用到）
    getGroupRes (state, Payload) {
      // 高级搜索不为空则使用高级搜索
      let param = {} // 储存axios获取数据的API参数

      let sparam = state.state.putong
      let swords = state.state.gaoji
      let sgroup = _.cloneDeep(state.state.shaixuan)

      // 特殊处理条件筛选国家或地区筛选
      let sourceAnd = [] // 接收选中的国家或地区
      let sourceNot = [] // 接收排除的国家或地区
      let sourceAndStr = ''
      let sourceNotStr = ''
      let filtersSource = state.state.filtersSource
      if (filtersSource.length>0) {
        _.map(filtersSource, (item, index) => {
          if (item.checked == 1) {
            sourceAnd.push(item.label)
          } else if (item.checked == -1) {
            sourceNot.push(item.label)
          }
        })
        if (sourceAnd.length>0) {
          if (sgroup.filter_condition) {
            sourceAndStr = ` _and source=${_.join(sourceAnd, 'ღ')}`
          } else {
            sourceAndStr = `source=${_.join(sourceAnd, 'ღ')}`
          }
        }

        if (sourceNot.length>0) {
          sourceNot.forEach((item, i) => {
            sourceNotStr += ` _not source=${item}`
          });
        }

        if (sgroup.filter_condition) {
          sgroup.filter_condition = sgroup.filter_condition + sourceAndStr + sourceNotStr
        } else {
          sgroup.filter_condition = sourceAndStr + sourceNotStr
        }
      }

      // 特殊处理条件筛选国家或地区(按制剂)筛选
      let sourceFormulationAnd = [] // 接收选中的国家或地区
      let sourceFormulationNot = [] // 接收排除的国家或地区
      let sourceFormulationAndStr = ''
      let sourceFormulationNotStr = ''
      let filtersSourceFormulation = state.state.filtersSourceFormulation
      console.log(filtersSourceFormulation);
      if (filtersSourceFormulation.length>0) {
        _.map(filtersSourceFormulation, (item, index) => {
          if (item.checked == 1) {
            sourceFormulationAnd.push(item.label)
          } else if (item.checked == -1) {
            sourceFormulationNot.push(item.label)
          }
        })
        if (sourceFormulationAnd.length>0) {
          if (sgroup.filter_condition) {
            sourceFormulationAndStr = ` _and source_formulation=${_.join(sourceFormulationAnd, 'ღ')}`
          } else {
            sourceFormulationAndStr = `source_formulation=${_.join(sourceFormulationAnd, 'ღ')}`
          }
        }

        if (sourceFormulationNot.length>0) {
          sourceFormulationNot.forEach((item, i) => {
            sourceFormulationNotStr += ` _not source_formulation=${item}`
          });
        }

        if (sgroup.filter_condition) {
          sgroup.filter_condition = sgroup.filter_condition + sourceFormulationAndStr + sourceFormulationNotStr
        } else {
          sgroup.filter_condition = sourceFormulationAndStr + sourceFormulationNotStr
        }
      }
      console.log(sgroup)
      let sfourth = state.state.fourth
      let shot = state.state.hot

      if (state.state.gaoji.words) {
        param = (Payload && Payload.params) ? _.assign({},Payload.params, sfourth, swords, sgroup, shot, Payload.params) : _.assign({}, sfourth, swords, sgroup, shot, {page: 1, pageSize: state.state.param.pageSize})
      } else {
        param = (Payload && Payload.params) ? _.assign({},Payload.params, sfourth, sparam, sgroup, shot, Payload.params) : _.assign({}, sfourth, sparam, sgroup, shot, {page: 1, pageSize: state.state.param.pageSize})
      }

      return window.Axios({
        method: 'get',
        url: Payload.path,
        params: param
      })
    },
    // 获取普通 或 高级搜索项
    getFiled (state) {
      return window.Axios({
        method: 'get',
        url: '/api/config/search?dbname=globalapproval'
      }).then(res => {
        if(!_.isObject(res.data.data)||!_.isArray(res.data.data.normal)){
          this.vue.frontEndLog(location.href, {
            handlerTypeDesc: '普通搜索条件数据错误',
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
    getKshRes(state, Payload) {

      state.commit('kshRes',Payload?Payload:true)
    },
    // 获取智能分析中的可视化数据
    getKshResMethods (state, Payload) {
      if(!Payload) state.commit('analyLoading', true)

      let param = {} // 储存axios获取数据的API参数

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

      // 特殊处理条件筛选国家或地区筛选
      let sourceAnd = [] // 接收选中的国家或地区
      let sourceNot = [] // 接收排除的国家或地区
      let sourceAndStr = ''
      let sourceNotStr = ''
      let filtersSource = state.state.filtersSource
      if (filtersSource.length>0) {
        _.map(filtersSource, (item, index) => {
          if (item.checked == 1) {
            sourceAnd.push(item.label)
          } else if (item.checked == -1) {
            sourceNot.push(item.label)
          }
        })
        if (sourceAnd.length>0) {
          if (sgroup.filter_condition) {
            sourceAndStr = ` _and source=${_.join(sourceAnd, 'ღ')}`
          } else {
            sourceAndStr = `source=${_.join(sourceAnd, 'ღ')}`
          }

        }

        if (sourceNot.length>0) {
          sourceNot.forEach((item, i) => {
            sourceNotStr += ` _not source=${item}`
          });
        }

        if (sgroup.filter_condition) {
          sgroup.filter_condition = sgroup.filter_condition + sourceAndStr + sourceNotStr
        } else {
          sgroup.filter_condition = sourceAndStr + sourceNotStr
        }
      }
      let sfourth = state.state.fourth
      let shot = state.state.hot

      if (state.state.gaoji.words) {
        // 高级搜索条件 条件筛选条件 传过来的附加条件（如果有的话 => page pageSize order） - 进行组合
        param = _.assign({}, sfourth, swords, sgroup,shot)
      } else {
        // 普通搜索条件 条件筛选条件 传过来的附加条件（如果有的话 => page pageSize order） - 进行组合
        param = _.assign({}, sfourth, sparam, sgroup,shot)
      }
      //有调用getSearchParams方法isEqual加参false防止接口重复调用
      if(!state.state.kshRes.noClear&&!this.vue.isEqual('globalapproval',param,false)){
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
      //关键词统计方法
      param = _.assign(param,this.vue.searchKeywords(state.state))
      let paramAfter = _.omit(param, ['order', 'page', 'pageSize'])
      state.commit('search_api_param', paramAfter)

      // state.dispatch("nomalSearch")
      if(Payload) {
        param = Object.assign(param,Payload)
      }else{
        this.vue.getSearchParams('globalapproval',state,param)
      }

      // this.vue.getSearchParams('globalapproval',state,param,'visualization')
      return window.Axios({
        method: 'get',
        url: '/api/globalapproval/visualization',
        params: _.assign(param, {
          accesstoken: GETCOOKIEFUN("accesstoken")
        })
      }).then(res => {
        if (res.data.code === 200 && res.data.data) {
          let data = res.data.data ? res.data.data : {}
          console.log(data);
          if(!Payload) state.commit('analyLoading', false)
          return Promise.resolve(data)
        }
      }).catch(err => {
        state.commit('analyLoading', false)
      })
    },
    getBaseInfo (state, Payload) {
      return window.Axios({
        method: 'get',
        url: '/api/config/view?dbname=globalapproval',
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
              case '高级搜索': state.state.nopms.gjss = true; break
              case '条件筛选': state.state.nopms.tjsx = true; break
              // case '可视化': state.state.nopms.ksh = true; break
              case '详情页': state.state.nopms.xqy = true; break
              case '导出(默认300)': state.state.nopms.dc = true; break
              case '翻页(最大75)': state.state.nopms.fy = true; break
              case '热点搜索': state.state.nopms.rdss = true; break
            }
          }

          for (let item of state.state.norules.exclusive) {
            switch (item.action) {
              case 'rss': state.state.nopms.rss = true; break
              case 'namegroup': state.state.nopms.namegroup = true; break
              case 'qiyegroup': state.state.nopms.qiyegroup = true; break
              case 'cname': state.state.nopms.cname = true; break
              case 'devprocess': state.state.nopms.devprocess = true; break
              case 'visualization': state.state.nopms.visualization = true; break // 智能分析权限控制
              // case 'read': state.state.nopms.read = true; break
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
