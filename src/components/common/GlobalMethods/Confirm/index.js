import Confirm from './confirm.vue'

const DIALOG = {
  install(Vue) {
    if (typeof window !== 'undefined' && window.Vue) {
      Vue = window.Vue
    }
    Vue.component('Confirm', Confirm)

    function msg(title, text, callBack) {
      let VueMessage = Vue.extend({
        render(h) {
          let props = {
            title,
            text,
            callBack
          }
          return h('Confirm', {props})
        },
        data() {
          return {
            exportVisible: true,
          }
        },
      })
      let newMessage = new VueMessage()
      let vm = newMessage.$mount()
      let el = vm.$el
      document.body.appendChild(el) // 把生成的提示的dom插入body中
    }

    //挂载到vue原型上,与el区分，首字母大写
    Vue.prototype.$Confirm = (title,text,callBack) => {
      msg(title, text, callBack)
    }
  }
}
export default DIALOG