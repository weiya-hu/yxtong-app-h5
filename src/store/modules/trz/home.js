import Vue from 'vue'
import Qs from 'qs'
import Lang from '@/i18n/lang/zh-CN.js'
import store from '@/store'
const stateObj = {
    keywords: '',
    comprehensive: "drug",
}
let isMount = true
export default {
    namespaced: true,
    state: Object.assign({}, stateObj),
    mutations: {
        sendKeywords(state, Payload) {
            state.keywords = Payload
        },
        sendComprehensive(state, Payload) {
            state.comprehensive = Payload
        },
    },
    actions: {
    },
    mounted() {
    },
}