import page404 from './page404.vue'
const SHOW404 = {
  install(Vue) {
    if (typeof window !== 'undefined' && window.Vue) {
      Vue = window.Vue
    }
    Vue.component('page404', page404)

    Vue.prototype.$show404 = () => {
      let VueMessage = Vue.extend({
        render(h) {
          return h('page404')
        },
      })
      let newMessage = new VueMessage()
      let vm = newMessage.$mount()
      let el = vm.$el
      let is404 = $('body').children().hasClass('page-404')
      if(!is404){
        document.body.appendChild(el)
      }
    }
  }
}
export default SHOW404