import store from '@/store'

export default {
  namespaced:true,
  state:{
    comprehensive: "drug",
    keywords: "",
    isShowSearchGuide: false, // 控制用户首次使用综合搜索时弹出搜索引导
  },
  getters: {

  },
  mutations: {
    sendKeywords (state, Payload) {
      state.keywords = Payload
    },
    sendComprehensive (state, Payload) {
      state.comprehensive = Payload
    },

    showSearchGuide(state, Payload) {
      state.isShowSearchGuide = Payload
    },

  },
  actions: {

  }
}
