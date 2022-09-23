import Vue from 'vue'
import VueI18n from 'vue-i18n'
import VueCookie from 'vue-cookie'
import cn from './lang/zh-CN'
import en from './lang/en'

Vue.use(VueI18n)

const messages = {
  cn,
  en
}
const i18n = new VueI18n({
  locale: VueCookie.get('lang') || 'cn',
  messages
})

export default i18n
