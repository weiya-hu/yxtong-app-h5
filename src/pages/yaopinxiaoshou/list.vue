<template>
  <div>
    <el-tabs :value="activeTabName" @tab-click="handleClickTag" class="la-list">
      <el-tab-pane
        :label="getTabLabel('按销售年份浏览',extendCount.listCount)"
        name="first"
        class="slh-pane">
        <ListOne></ListOne>
      </el-tab-pane>
      <el-tab-pane
        :label="getTabLabel('按药品通用名浏览',extendCount.nameCount)"
        name="getnamelist"
        :disabled="nopms.namegroup"
        :class="{'abandon-click-method': nopms.namegroup}">
        <ListTwo></ListTwo>
      </el-tab-pane>
      <el-tab-pane
        :label="getTabLabel('按企业名称浏览',extendCount.qiyeCount)"
        name="getqylist"
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
        if(this.$route.path==='/ypxs/list'){
          //智能分析重新搜索清空列表数据tab无法自动复位
          let tabname= this.activeTabName
          Store.commit('Yaopinxiaoshou/tabname','')
          Store.commit('Yaopinxiaoshou/tabname',tabname)
          this.noData && Store.dispatch('Yaopinxiaoshou/nomalSearch',{queryToPutong: false,tabs:true})
        }
      },
      immediate:true
    }
  }, */
  computed: {
    //同时获取多个属性
    ...mapState({
      activeTabName: state => state.Yaopinxiaoshou.tabname,
      extendCount: state => state.Yaopinxiaoshou.extendCount,
      res1: state => state.Yaopinxiaoshou.res1,
      res2: state => state.Yaopinxiaoshou.res2,
      res3: state => state.Yaopinxiaoshou.res3,
      nopms: state => state.Yaopinxiaoshou.nopms,
      allBase: state => state.Yaopinxiaoshou.allBase,
    }),
    /* noData() {
      return !this.res1.res&&!this.res2.res&&!this.res3.res
    } */
  },
  created () {
    setTimeout(() => {
      const hashLocation= sessionStorage.getItem("hashLocation");//缓存中获取当前页面的路由名称
      // 注意, 这里使用全路径匹配,在hash模式中,因为地址会携带#,所以页面报告中的url需要重新覆盖一下, 将#去除
      window._paq.push(['setCustomUrl', "https://" + hashLocation]);//覆盖页面报告的url，可以自定义页面url，加上本页面路由
      window._paq.push(['trackPageView', this.allBase.dbname]);//页面名称,可以自定义页面名称
      window._paq.push(['setDocumentTitle', this.allBase.dbname])
    }, 1000);
  },
  methods: {
    handleClickTag (tab,event) {
      window.ga("send","event", "tab", "click","ypxs_"+tab.name);
      window._paq.push(['trackEvent', 'tab',"click", "ypxs_"+tab.name, ])

      let path = tab.name === "first" ? "/api/ypxs/" : ("/api/ypxs/" + tab.name)
      Store.commit("Yaopinxiaoshou/tabname", tab.name)
      Store.commit("Yaopinxiaoshou/path",path)
      if ((tab.name === "first" && !_.keys(this.res1.res).length) || (tab.name === "getnamelist" && !_.keys(this.res2.res).length) || (tab.name === "getqylist" && !_.keys(this.res3.res).length)) {
        Store.dispatch('Yaopinxiaoshou/nomalSearch', {path: path, queryToPutong: false})
      }
    }
  },
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
