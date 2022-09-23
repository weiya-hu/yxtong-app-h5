<template>
  <div>
    <el-tabs :value="activeTabName" @tab-click="handleClickTag" class="la-list">
      <el-tab-pane
        :label="getTabLabel('按发布时间浏览', extendCount.listCount)"
        name="index"
        class="slh-pane">
        <ListOne></ListOne>
      </el-tab-pane>
      <el-tab-pane
        :label="getTabLabel('按药品名称浏览', extendCount.nameCount)"
        name="getnamelist"
        :disabled="nopms.namegroup"
        :class="{'abandon-click-method': nopms.namegroup}">
        <ListTwo></ListTwo>
      </el-tab-pane>
      <el-tab-pane
        :label="getTabLabel('按企业名称浏览', extendCount.qiyeCount)"
        name="getqiyelist"
        :disabled="nopms.qiyegroup"
        :class="{'abandon-click-method': nopms.qiyegroup}">
        <ListThree></ListThree>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import ListOne from './lists/list-one'
import ListTwo from './lists/list-two'
import ListThree from './lists/list-three'
import { mapState } from 'vuex'

export default{
  components:{
    ListOne,
    ListTwo,
    ListThree,
  },
  data (){
    return {

    }
  },
  /* watch: {
    $route:{
      handler(){
        if(this.$route.path==='/yaopinzhongbiao/list'){
          //智能分析重新搜索清空列表数据tab无法自动复位
          let tabname= this.activeTabName
          Store.commit('Yaopinzhongbiao/tabname','')
          Store.commit('Yaopinzhongbiao/tabname',tabname)
          this.noData && Store.dispatch('Yaopinzhongbiao/nomalSearch',{queryToPutong: false,tabs:true})
        }
      },
      immediate:true
    }
  }, */
  computed: {
    //同时获取多个属性
    ...mapState({
      nopms: state => state.Yaopinzhongbiao.nopms,
      activeTabName: state => state.Yaopinzhongbiao.tabname,
      extendCount: state => state.Yaopinzhongbiao.extendCount,
      res1: state => state.Yaopinzhongbiao.res1,
      res2: state => state.Yaopinzhongbiao.res2,
      res3: state => state.Yaopinzhongbiao.res3,
      allBase: state => state.Yaopinzhongbiao.allBase,
    }),
    /* noData() {
      return !this.res1.res&&!this.res2.length&&!this.res3.length
    } */
  },
  methods: {
    handleClickTag (tab,event) {
      window.ga("send","event", "tab", "click","yaopinzhongbiao_"+tab.name);
      window._paq.push(['trackEvent', 'tab',"click", "yaopinzhongbiao_"+tab.name, ])

      let path = tab.name==="index"?"/api/yaopinzhongbiao/":("/api/yaopinzhongbiao/"+tab.name)
      Store.commit("Yaopinzhongbiao/tabname",tab.name)
      Store.commit("Yaopinzhongbiao/path",path)
      if ((tab.name === "index" && !_.keys(this.res1.res).length) || (tab.name === "getnamelist" && !_.keys(this.res2).length) || (tab.name === "getqiyelist" && !_.keys(this.res3).length)) {
        Store.dispatch('Yaopinzhongbiao/nomalSearch',{path:path, queryToPutong: false})
      }
    }
  },
  created () {
    setTimeout(() => {
      const hashLocation= sessionStorage.getItem("hashLocation");//缓存中获取当前页面的路由名称
      // 注意, 这里使用全路径匹配,在hash模式中,因为地址会携带#,所以页面报告中的url需要重新覆盖一下, 将#去除
      window._paq.push(['setCustomUrl', "https://" + hashLocation]);//覆盖页面报告的url，可以自定义页面url，加上本页面路由
      window._paq.push(['trackPageView', this.allBase.dbname]);//页面名称,可以自定义页面名称
      window._paq.push(['setDocumentTitle', this.allBase.dbname])
    }, 1000);
  }
}
</script>

<style lang="less">
@import "~@/assets/less/var.less";
.el-tabs__header{
  padding-left: 14px;
  margin: 0px;
}
.el-tabs__content{
  overflow: visible;
}
.el-tabs__active-bar{
  height: 3px;
  border-radius: 5px;
}

.el-tabs__item {
  padding: 0 14px;
}
</style>
