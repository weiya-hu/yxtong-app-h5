import Vue from 'vue'
import Qs from 'qs'
import Lang from '@/i18n/lang/zh-CN.js'
import store from '@/store'
import {
  stat
} from 'fs';

export default {
  namespaced: true,
  state: {
    listLoading: true, // 控制表格中数据的加载清空
    error: 0, // 错误码
    path: '/api/instruct', // 维护当前搜索请求接口
    nomal_filed: [], // 普通搜索列举项
    advanced_filed: [], // 高级搜索列举项
    // 查询出的数量
    extendCount: 0,
    cardExtendCount: 0,
    tabname: 'table', // table表格视图，card卡片式
    param: {
      pageSize: 20,
      page: 1,
    },
    cardParam: {
      pageSize: 20,
      page: 1,
    },
    res1: {}, // 表格数据结果
    res2: {}, // 卡片数据结果
    query: [], // 已选普通搜索查询条件 格式请查看readme.md
    queryStr: "",
    putong: [], // 普通搜索查询条件所用的储存对象（主要用于API前的处理）
    conditions: [], // 已选高级搜索查询条件 格式请查看readme.md
    gaoji: {}, // 高级搜索查询条件所用的储存对象（主要用于API前的处理）
    order: {}, // 查询的排序规则
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
    search_api_param: {},
    saved_options: [],
    allBase: {},
    tableconf: [],
    helpInfo: {},
    update_conf: [],
    fourth: {}, // 关联查询条件所用的储存对象（主要用于API前的处理）
    iffirstCommonIn: true, //连接跳转搜索进这个界面
    fourth_checked: {}, // 关联查询已选条件所用的储存对象
    nopms: {
      'list': [],
      'detail': [],
    },
    norules: {},
    groups: {}, // 已选筛选条件
    shaixuan: {},
    match_shaixuan: [],
    match_shaixuan_values: {},
    filters: [], // 条件筛选结果
    filters1: [], // 添加问号标注添加条件筛选
  },
  mutations: {
    // 条件筛选结果项
    filters1(state, Payload) {
      state.filters1 = Payload
    },
    filters(state, Payload) {
      state.filters = Payload
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
    listLoading(state, Payload) {
      state.listLoading = Payload
    },
    error(state, Payload) {
      state.error = Payload;
    },
    extendCount(state, Payload) {
      state.extendCount = Payload
    },
    cardExtendCount(state, Payload) {
      state.cardExtendCount = Payload
    },
    paramPage(state, Payload) {
      state.param.page = Payload
    },
    paramPagesize(state, Payload) {
      state.param.pageSize = Payload
    },
    base_conf(state, Payload) {
      state.base_conf = Payload
    },
    extend_conf(state, Payload) {
      state.extend_conf = Payload
    },
    info_conf(state, Payload) {
      state.info_conf = Payload
    },
    tableconf(state, Payload) {
      state.tableconf = Payload
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
    groups(state, Payload) {
      state.groups = Payload
    },
    match_shaixuan(state, Payload) {
      state.match_shaixuan = Payload
    },
    match_shaixuan_values(state, Payload) {
      state.match_shaixuan_values = Payload
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
        state.shaixuan = {
          "filter_condition": group
        }
      } else {
        state.shaixuan = {}
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
      state.gaoji = atcs_sel ? {
        'words': words,
        'atcs_sel': 1
      } : {
        'words': words
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
    /*
     *
     */
    // 表格数据
    res1(state, Payload) {
      state.res1 = Payload;
    },
    // 卡片数据
    res2(state, Payload) {
      state.res2 = Payload;
    },
    tabname(state, Payload) {
      state.tabname = Payload
    },
  },
  actions: {
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
      }

      let param = {} // 储存axios获取数据的API参数
      // state.state.putong = {}
      // state.state.gaoji = {}

      // 再处理query=>putong 和 conditions=>gaoji
      // if (state.state.query && state.state.query.length != 0) {
      // state.commit("putong", state.state.query)
      // }
      if (Payload && !Payload.queryToPutong) { // 不把query的状态传给putong
      } else {
        // console.log("查询内容：",state.state.query)
        state.commit('putong', state.state.query)
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
          pageSize: state.state[state.state.tabname === 'table' ? 'param' : 'cardParam'].pageSize
        })
      } else {
        param = (Payload && Payload.params) ? _.assign({}, sfourth, sparam, sgroup, Payload.params) : _.assign({}, sfourth, sparam, sgroup, {
          page: 1,
          pageSize: state.state[state.state.tabname === 'table' ? 'param' : 'cardParam'].pageSize
        })
      }
      //关键词统计方法
      param = _.assign(param, this.vue.searchKeywords(state.state, Payload))

      // 当没有跟其他参数时，正常搜索，回到第一页
      if (!Payload || Payload === state.state.putong) {
        state.commit('res1', [])
        state.commit('res2', [])
        state.commit('order', {})
        state.state.param.page = 1
        state.state.cardParam.page = 1
      }

      let paramAfter = _.omit(param, ['order', 'page', 'pageSize'])
      if (Qs.stringify(state.state.search_api_param) != Qs.stringify(paramAfter)) {
        state.commit('res1', [])
        state.commit('res2', [])
        state.commit('order', {})
      }
      state.commit('search_api_param', paramAfter)

      this.vue.getSearchParams('instruct', state, param)
      // 卡片式单独添加参数
      if (state.state.tabname === 'card') {
        param.only_xiuding = 2
      } else {
        delete param.only_xiuding
      }
      return window.Axios({
        method: 'get',
        url: state.state.path,
        params: _.assign(param, {
          accesstoken: GETCOOKIEFUN("accesstoken")
        })
      }).then(res => {
        if (res.data.code === 200 && res.data) {
          let _data = res.data.data
          let data = _data.List
          state.commit("error", 0)

          switch (state.state.tabname) {
            case 'table':
              state.commit('res1', data.res ? data.res : [])
              if (data.count || data.count === 0) {
                state.commit("extendCount", data.count)
              } else {
                state.commit("extendCount", 0)
              }
              break
            case 'card':
              state.commit('res2', data.res ? data.res : [])
              if (data.count || data.count === 0) {
                state.commit("cardExtendCount", data.count)
              } else {
                state.commit("cardExtendCount", 0)
              }
              break
          }

          state.commit("listLoading", false)

          return res
        } else if (res.data.code == 404) {
          // 显示数值归零
          state.commit("extendCount", 0)
          state.commit("cardExtendCount", 0)
          state.commit("res1", [])
          state.commit("res2", [])
          state.commit("error", 404)
          state.commit("listLoading", false)
        }
      }).catch((res) => {
        state.commit("extendCount", 0)
        state.commit("cardExtendCount", 0)
        state.commit("res1", [])
        state.commit("res2", [])
        state.commit("error", 500)
        state.commit("listLoading", false)
        return res.data.code
      })
    },
    // 获取普通 或 高级搜索项
    getFiled(state) {
      return window.Axios({
        method: 'get',
        url: '/api/config/search?dbname=instruct'
      }).then(res => {
        if (res.data.code === 200 && res.data) {
          let data = res.data.data
          // 普通搜索项
          state.commit("filters1", data.filter)
          state.commit("nomalFiled", data.normal)
          state.commit("match_putong", data.normal)
          let match_shaixuan_Obj = {};
          data.filter.length > 0 && data.filter.forEach(item => {
            match_shaixuan_Obj[item.field] = item.label;
          })
          console.log(match_shaixuan_Obj);
          state.commit("match_shaixuan", match_shaixuan_Obj)
        }
      })
    },
    getBaseInfo(state, Payload) {
      return window.Axios({
        method: 'get',
        url: '/api/config/view?dbname=instruct',
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
              case 'namegroup':
                state.state.nopms.namegroup = true;
                break;
              case 'qiyegroup':
                state.state.nopms.qiyegroup = true;
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
