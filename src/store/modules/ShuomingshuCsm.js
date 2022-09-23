import Vue from 'vue'
import Qs from 'qs'
import Lang from '@/i18n/lang/zh-CN.js'
import store from '@/store'

export default {
  namespaced: true,
    state: {
    listLoading: true, // 控制表格中数据的加载清空
    error: 0, // 错误码
    path: '/api/unlabeleduse', // 维护当前搜索请求接口
    nomal_filed: [], // 普通搜索列举项
    advanced_filed: [], // 高级搜索列举项
    // 查询出的数量
    extendCount: 0,
    param: {
      pageSize: 20,
      page: 1,
      order:null
    },
    res1: {}, // 数据结果
    query: [], // 已选普通搜索查询条件 格式请查看readme.md
    queryStr: "",
    putong: {}, // 普通搜索查询条件所用的储存对象（主要用于API前的处理）
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
    search_api_param: {},
    saved_options: [],
    allBase: {},
    tableconf:[],
    helpInfo: {},
    update_conf: [],
    fourth: {}, // 关联查询条件所用的储存对象（主要用于API前的处理）
    fourth_checked: {}, // 关联查询已选条件所用的储存对象
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
    fourth_checked(state, Payload) {
      state.fourth_checked = Payload
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
    match_putong(state, Payload) {
      // state.match_putong = Payload
      for (let item of Payload) {
        _.set(state.match_putong, item.name, item.label)
        _.set(state.match_putong, item.name + '_eq', item.label + '(精确)')
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
    /*
     * 注册数据 - API数据
     */
    // 按受理号查询的API数据
    res1(state, Payload) {
      state.res1 = Payload;
    },
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

      // 再处理query=>putong 和 conditions=>gaoji
      // if (state.state.query && state.state.query.length != 0) {
        // state.commit("putong", state.state.query)
        state.commit("fourth", state.state.fourth_checked)
      // }
      if (Payload && !Payload.queryToPutong) { // 不把query的状态传给putong
      } else {
        // console.log("查询内容：",state.state.query)
        state.commit('putong', state.state.query)
      }
      let sparam = state.state.putong
      let sfourth = state.state.fourth

      param = (Payload && Payload.params) ? _.assign({}, sfourth, sparam, Payload.params, state.state.param) : _.assign({}, sfourth, sparam, {page: 1, pageSize: state.state.param.pageSize})

      //关键词统计方法
      param = _.assign(param,this.vue.searchKeywords(state.state,Payload))

      state.commit("search_api_param", param)

      // 当没有跟其他参数时，正常搜索，回到第一页
      if (!Payload) {
        state.commit("paramPage", 1)
      }

      return window.Axios({
        method: 'get',
        url: state.state.path,
        params: _.assign(param, {
          accesstoken: GETCOOKIEFUN("accesstoken")
        })
      }).then(res => {
        if (res.data.code === 200 && res.data) {
          let data = res.data.data
          state.commit("error", 0)
          if (data.List.count || data.List.count === 0) {
            state.commit("extendCount", data.List.count)
          } else {
            state.commit("extendCount", 0)
          }

          state.commit("res1", data.List.res ? data.List.res : [])

          state.commit("listLoading", false)

          return res
        } else if (res.data.code == 404){
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
        url: '/api/config/search?dbname=unlabeleduse'
      }).then(res => {
        if (res.data.code === 200 && res.data) {
          // 普通搜索项
          state.commit("nomalFiled", res.data.data.normal)
          state.commit("match_putong", res.data.data.normal)
        }
      })
    },
    getBaseInfo (state, Payload) {
      return window.Axios({
        method: 'get',
        url: '/api/config/view?dbname=unlabeleduse',
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
              case 'namegroup': state.state.nopms.namegroup = true; break;
              case 'qiyegroup': state.state.nopms.qiyegroup = true; break;
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
