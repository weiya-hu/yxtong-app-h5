import Qs from 'qs'
import Vue from 'vue'
import store from '@/store'

function getCookieAccesstokenFun() {
  // let token = '';

  // state.commit("getCookieAccesstoken");
  let name = "accesstoken"
  var cookieArr = document.cookie.split("; ") // 使用"; "分割Cookie
  var cva = [], temp
  //循环的得到Cookie名称与值
  for (let i = 0; i < cookieArr.length; i++) {
    temp = cookieArr[i].split("=") // 用"="分割Cookie的名称与值
    cva[temp[0]] = unescape(temp[1])
  }
  // if (name) {
  //如果有name则输出这个name的Cookie值
  // ~token = cva[name]
  // }
  console.info(cva[name])
  return cva[name] || '';
}

export default {
  namespaced: true,
  state: {
    menuList: [],
    xxtzNumLoading: true,
    dytjLoading: true,
    loading: true,
    // (guideFlagsRenew stepNumHome renewTipsAPP questionClose) 引导>问卷>弹窗广告>消息通知  //或者//  引导>弹窗广告>VIP过期提醒>消息通知
    guideFlagsRenew: false, // 新手引导关闭标识
    stepNumHome: false, // home页视频关闭标识
    renewTipsAPP: false, // 过期提醒弹窗关闭标识
    questionClose: false, // 问卷弹窗关闭标识
    questionDialog: false, // 问卷接口返回后显示标识
    needGuideShow: false,
    accesstoken: getCookieAccesstokenFun() || '',
    userName: '', // 用户名
    uid: '', // 用户对应的唯一id
    xxtzData: {}, // 消息通知的数据
    xxtzNum: 0, // 消息通知的数量(未读)
    xxtzNumUnread: 0,
    dyglData: {}, // 订阅管理的数据
    dyglAllNum: 0,//订阅管理所有条数
    dyglNum: 0, // 订阅管理的数量(未读)
    dytjData: {}, // 订阅条件的数据
    accountData: {}, // 个人信息的数据
    accountDataEmail: '',
    RemoteLogin: false,//异地登录控制,强制登录
    errorEducationTimeOut: null,
    errorEducation: { show: false, msg: '', code: '' },//接口异常调用
    RemoteLoginR: false,//异地登录控制,重新登录
    RemoteLoginInfo: {},//异地登陆信息展示
    accountInputs: { // 个人信息的需要input的部分（v-model绑定）
      model_qymc: '',
      model_bm: '',
      model_lxr: '',
      model_lxdh: '',
      model_lxdz: '',
    },
    headerMsg: {},
    userInfo: {},
    isFangDa: true
  },
  mutations: {
    menuList(state, Payload) {
      state.menuList = Payload;
    },
    xxtzNumLoading(state, Payload) {
      state.xxtzNumLoading = Payload;
    },
    dytjLoading(state, Payload) {
      state.dytjLoading = Payload;
    },
    loading(state, Payload) {
      state.loading = Payload;
    },
    userInfo(state, Payload) {
      state.userInfo = Payload;
    },
    isFangDa(state, Payload) {
      state.isFangDa = Payload;
    },
    getCookieAccesstoken(state, Payload) {
      if (!state.accesstoken) {
        let name = "accesstoken"
        var cookieArr = document.cookie.split("; ") // 使用"; "分割Cookie
        var cva = [], temp
        //循环的得到Cookie名称与值
        for (let i = 0; i < cookieArr.length; i++) {
          temp = cookieArr[i].split("=") // 用"="分割Cookie的名称与值
          cva[temp[0]] = unescape(temp[1])
        }
        if (name) {
          //如果有name则输出这个name的Cookie值
          state.accesstoken = cva[name]
        }
      }
    },
    RemoteLogin(state, Payload) {//异地登录
      // console.info(Payload)
      if (Payload) {
        state.errorEducation.show = false;
      }
      state.RemoteLogin = Payload
    },
    errorEducation(state, Payload) {//登录异常提示
      if (state.RemoteLogin) {
        Payload.show = false;
      } else {
        console.info(Payload)
        state.errorEducation.show = Payload.show;
        delete Payload.show;

        if (state.errorEducationTimeOut) {
          return
        } else {
          for (var i in Payload) {
            state.errorEducation[i] = Payload[i];
          }
          state.errorEducationTimeOut = setTimeout(() => {
            clearTimeout(state.errorEducationTimeOut);
            state.errorEducationTimeOut = null;
          }, 10000)
        }
      }

    },
    RemoteLoginR(state, Payload) {//异地登录
      console.info(Payload)
      state.RemoteLoginR = Payload
    },
    RemoteLoginInfo(state, Payload) {//异地登录信息展示
      state.RemoteLoginInfo = Payload
    },

    accesstoken(state, Payload) {
      state.accesstoken = Payload
    },
    userName(state, Payload) {
      state.userName = Payload
    },
    uid(state, Payload) {
      state.uid = Payload
    },
    headerMsg(state, Payload) {
      // console.log(Payload)
      state.headerMsg = Payload
    },
    xxtzNum(state, Payload) {
      state.xxtzNum = Payload
    },
    xxtzNumUnread(state, Payload) {
      state.xxtzNumUnread = Payload
    },
    dyglNum(state, Payload) {
      state.dyglNum = Payload
    },
    dyglAllNum(state, Payload) {
      state.dyglAllNum = Payload
    },
    xxtzData(state, Payload) {
      state.xxtzData = Payload
    },
    dyglData(state, Payload) {
      state.dyglData = Payload
    },
    dytjData(state, Payload) {
      state.dytjData = Payload
    },
    accountData(state, Payload) {
      state.accountData = Payload
    },
    accountDataEmail(state, Payload) {
      state.accountDataEmail = Payload
    },
    accountInputs(state, Payload) {
      state.accountInputs = Payload
    },
    stepNumHome(state, Payload) {
      state.stepNumHome = Payload
    },
    guideFlagsRenew(state, Payload) {
      state.guideFlagsRenew = Payload
    },
    renewTipsAPP(state, Payload) {
      state.renewTipsAPP = Payload
    },
    questionDialog(state, Payload) {
      state.questionDialog = Payload
    },
    questionClose(state, Payload) {
      state.questionClose = Payload
    },
    needGuideShow(state, Payload) {
      state.needGuideShow = Payload
    },
  },
  actions: {
    needGuideShowA(state, Payload) {
      state.commit("needGuideShow", Payload)
    },
    questionCloseA(state, Payload) {
      state.commit("questionClose", Payload)
    },
    questionDialogA(state, Payload) {
      state.commit("questionDialog", Payload)
    },
    guideFlagsRenewA(state, Payload) {
      state.commit("guideFlagsRenew", Payload)
    },
    stepNumHomeA(state, Payload) {
      state.commit("stepNumHome", Payload)
    },
    renewTipsAPPA(state, Payload) {
      state.commit("renewTipsAPP", Payload)
    },
    // 获取消息通知的数据
    handleHeaderMsgAxios(state, Payload) {
      // state.commit("getCookieAccesstoken") // getCookieAccesstokenFun
      window.Axios({
        method: 'post',
        url: '/api/rss/msg',
        params: _.assign({
          // accesstoken: getCookieAccesstokenFun(),
          accesstoken: state.state.accesstoken,
        }, Payload)
      }).then((res) => {
        if (res.data.code === 200 && res.data) {
          let data = res.data.data
          state.commit("headerMsg", data)
          state.commit("xxtzNum", data.count) // 确定消息通知总数
          state.commit("xxtzNumUnread", data.unread_count) // 未读消息通知总数
        }
        state.commit("xxtzNumLoading", false);
      }).catch((err) => {
        console.log(err)
        state.commit("xxtzNumLoading", false);
      })
    },
    // 获取消息通知的数据
    handleXxtzAxios(state, Payload) {
      // state.commit("getCookieAccesstoken")
      window.Axios({
        method: 'post',
        url: '/api/rss/msg',
        params: _.assign({
          // accesstoken: getCookieAccesstokenFun(),
          accesstoken: state.state.accesstoken,
        }, Payload)
      }).then((res) => {
        if (res.data.code === 200 && res.data) {
          let data = res.data.data
          state.commit("xxtzData", data)
          state.commit("xxtzNum", data.count) // 确定消息通知总数
          state.commit("xxtzNumUnread", data.unread_count) // 未读消息通知总数
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    // 获取订阅管理的数据
    handleDyglAxios(state, Payload) {
      state.commit("getCookieAccesstoken")
      window.Axios({
        method: 'post',
        url: '/api/rss',
        params: _.assign({
          // accesstoken: getCookieAccesstokenFun(),
          accesstoken: state.state.accesstoken,
        }, Payload)
      }).then((res) => {
        if (res.data.code === 200 && res.data) {
          let data = res.data.data
          state.commit("dyglData", data)
          state.commit("dyglNum", data.unread_count) // 确定消息通知未读总数
          state.commit("dyglAllNum", data.count) // 确定消息通知总数
        }
        state.commit('loading', false)
      }).catch((err) => {
        console.log(err)
        state.commit('loading', false)
      })
    },
    // 获取订阅条件的数据
    handleDytjAxios(state, Payload) {
      state.commit("getCookieAccesstoken")
      window.Axios({
        method: 'post',
        url: '/api/rss/where',
        params: _.assign({
          // accesstoken: getCookieAccesstokenFun(),
          accesstoken: state.state.accesstoken,
        }, Payload)
      })
        .then((res) => {
          if (res.data.code === 200 && res.data) {
            let data = res.data.data
            state.commit("dytjData", data)
          } else {
            state.commit("dytjData", {})
          }
          state.commit('dytjLoading', false)
        }).catch((err) => {
          console.log(err)
          state.commit('dytjLoading', false)
        })
    },
    // 获取个人信息的数据
    handleAccountAxios(state, Payload) {
      state.commit("getCookieAccesstoken")
      return window.Axios({
        method: 'post',
        url: '/api/usercenter/userinfo',
        params: {
          // accesstoken: getCookieAccesstokenFun(),
          accesstoken: state.state.accesstoken,
        }
      }).then((res) => {
        if (res.data.code === 200 && res.data) {
          let data = res.data.data
          this.vue.vueSetCookie('userID', data.uid)
          state.commit("uid", data.uid)
          state.commit("userName", data.username)
          state.commit("accountData", Object.assign({}, state.state.accountData, data))
          state.commit("accountDataEmail", data.email)
          // 输入绑定框的数据
          state.commit("accountInputs", {
            model_qymc: data.comname,
            model_bm: data.department,
            model_lxr: data.truename,
            model_lxdh: data.comtel,
            model_lxdz: data.address,
          })
          localStorage.setItem('gradeId', data.grade_id)
        }
      }).catch((err) => {
        console.log(err)
      })
    }
  }
}
