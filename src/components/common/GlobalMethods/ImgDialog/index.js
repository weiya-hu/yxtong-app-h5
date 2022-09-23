import imgDialog from './imgDialog.vue'

const IMGDIALOG = {
  install(Vue) {
    if (typeof window !== 'undefined' && window.Vue) {
      Vue = window.Vue
    }
    Vue.component('imgDialog', imgDialog)

    Vue.prototype.$Img = (url) => {
      let VueImg = Vue.extend({
        render(h) {
          let props = {
            url,
          }
          return h('imgDialog', {props})
        },
        data() {
          return {
            show: true
          }
        }
      })
      let newVueImg = new VueImg()
      let vm = newVueImg.$mount()
      let el = vm.$el
      document.body.appendChild(el)
    }
  }
}
export default IMGDIALOG