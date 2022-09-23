import Message from './message.vue'

const MESSAGE = {
  duration: 2000, // 显示的时间
  animateTime: 300, // 动画时间,表示这个组件切换show的动画时间
  install(Vue) {
    if (typeof window !== 'undefined' && window.Vue) {
      Vue = window.Vue
    }
    Vue.component('Message', Message)

    function msg(type, text, callBack) {
      let msg = text
      let duration = MESSAGE.duration
      let VueMessage = Vue.extend({
        render(h) {
          let props = {
            type,
            text: msg,
            show: this.show
          }
          return h('Message', {props})
        },
        data() {
          return {
            show: true
          }
        }
      })
      let newMessage = new VueMessage()
      let vm = newMessage.$mount()
      let el = vm.$el
      let node = document.body.querySelector('.message')
      if (node) {
        document.body.removeChild(node)
      };
      document.body.appendChild(el) // 把生成的提示的dom插入body中
      vm.show = true
      let t1 = setTimeout(() => {
        clearTimeout(t1)
        vm.show = false  //隐藏提示组件，等动画效果过了再从body中移除dom
        let t2 = setTimeout(() => {
          clearTimeout(t2)
          newMessage.$destroy()
          vm = null // 设置为null，好让js垃圾回收算法回收，释放内存
          callBack && (typeof callBack === 'function') && callBack()
        }, MESSAGE.animateTime)
      }, duration)
    }

    //挂载到vue原型上,与el区分，首字母大写
    Vue.prototype.$Message = {
      success(text, callBack) {
        if (!text) return
        msg('success', text, callBack)
      },
      error(text, callBack) {
        if (!text) return
        msg('error', text, callBack)
      },
    }
  }
}
export default MESSAGE