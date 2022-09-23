import Qs from 'qs'
import Vue from 'vue'
import store from '@/store'

export default {
  namespaced:true,
  state:{
    dbname: '',
    names: {}
  },
  mutations: {
    dbname(state, Payload) {
      state.dbname = Payload
      document.title = Payload
    },
    names(state, Payload) {
      _.set(state.names, Payload.name, Payload.dbname)
      document.title = Payload.dbname
    }
  },
  actions: {

  }
}