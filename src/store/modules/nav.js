const PinyinMatch = require("pinyin-match")

const stateObj = {
  navMapData: [], // 初始化数据
  allNavMapList: [], // 遍历最小总数据
  navMapList: [], // 筛选数据
  keyValue: "", // 搜索词
}
const handleNavData = (_this,data)=>{
  let userGradeId = _this.state.UserCenter.accountData.grade_id
  let isInside = _this.vue.insideUserList.indexOf(userGradeId) > -1
  let menuList = []
  data.forEach((item) => {
    let iconList = _.find(_this.vue.iconConfig,{label:item.label})
    item.icon = iconList&&iconList.icon?iconList.icon:''
    let obj = {label:item.label,icon:item.icon,group:[]}
    item.groupList[0].group.forEach((items) => {
      if (isInside) {
        if (items.internal) {
          items.label += "（内）"
        }
      } else {
        if(items.internal) {
          return 
        }
      }
      obj.group.push(items)
    })
    menuList.push(obj)
  })
  return menuList
}
export default {
  namespaced: true,
  state: Object.assign({}, stateObj),
  mutations: {
    setKeyValue (state, Payload){
      state.keyValue = Payload
    },
    setNavMap (state, Payload) {
      state.navMapData = handleNavData(this,Payload)
    },
    updateValue(state,Payload) {
      Payload = String(Payload).toUpperCase()
      let list = []
      let allNavMapList = []
      let initList = JSON.parse(JSON.stringify(state.navMapData))
      initList.forEach((item)=>{
          let clist = []
          item.group.forEach((items)=>{
              if(items.label.toUpperCase().indexOf(Payload)>-1||PinyinMatch.match(items.label,Payload)){
                clist.push(items)
                allNavMapList.push(items)
              }
          })
          if(clist.length>0){
              list.push(_.assign(item,{group:clist}))
          }
      })
      state.allNavMapList = allNavMapList
      state.navMapList = list
    },
  },
  actions: {
    getNavMapData (state) {
      return window.Axios.get('/api/config/navsitemap')
      .then((res) => {
        if (res.data.code == 200) {
          let data = res.data.data
          state.commit('setNavMap', data)
        } 
      }).catch((err) => {
        console.log(err)
      })
    },
  }
}
