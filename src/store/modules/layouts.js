import Vue from 'vue'
import store from '@/store'

export default {
  namespaced:true,
  state:{ 
    side_fold:true, //左侧框显隐
    client_width: 1900, //window.innerWidth
    msgBellShow: false, // 用于 components/layouts/header.vue 组件 ，全局激活 消息通知铃铛。
    font_loaded: false,
  },
  mutations: { 
    client_width(state, Payload) {
      state.client_width = Payload 
    },
    side_fold(state, Payload) {
      state.side_fold = Payload 
    },
    msgBellShow (state, Payload) {
      state.msgBellShow = Payload 
    },
    fontLoaded (state) {
      state.font_loaded = true;
    }
  },
  actions: {

  }
}