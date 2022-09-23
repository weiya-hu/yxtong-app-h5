<template>
  <div>
    <el-tabs :value="activeTabName" @tab-click="handleClickTag" class="la-list">
      <el-tab-pane
        :label="getTabLabel('按登记号浏览',extendCount.BaseCount)"
        name="basegroup"
        class="slh-pane">
        <ListOne></ListOne>
      </el-tab-pane>
      <el-tab-pane
        :label="getTabLabel('按药品名称浏览',extendCount.NameCount)"
        name="namegroup"
        :disabled="nopms.namegroup"
        :class="{'abandon-click-method': nopms.namegroup}">
        <ListTwo></ListTwo>
      </el-tab-pane>
      <el-tab-pane
        :label="getTabLabel('按申办单位浏览',extendCount.QiyeCount)"
        name="qiyegroup"
        :disabled="nopms.qiyegroup"
        :class="{'abandon-click-method': nopms.qiyegroup}">
        <ListThree></ListThree>
      </el-tab-pane>
      <el-tab-pane
        :label="getTabLabel('按试验机构浏览',extendCount.SyjgCount)"
        name="syjggroup"
        :disabled="nopms.syjggroup"
        :class="{'abandon-click-method': nopms.syjggroup}">
        <ListFour></ListFour>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import ListOne from './lists/list-one'
import ListTwo from './lists/list-two'
import ListThree from './lists/list-three'
import ListFour from './lists/list-four'
import { mapState } from 'vuex'

export default{
  components:{
    ListOne,
    ListTwo,
    ListThree,
    ListFour
  },
  data (){
    return {
    }
  },
  /* watch: {
    $route:{
      handler(){
        if(this.$route.path==='/linchuangshiyan/list'&&this.noData){
          //智能分析重新搜索清空列表数据tab无法自动复位
          let tabname= this.activeTabName
          Store.commit('Linchuangshiyan/tabname','')
          Store.commit('Linchuangshiyan/tabname',tabname)
          this.noData && Store.dispatch('Linchuangshiyan/nomalSearch',{queryToPutong: false,tabs:true})
        }
      },
      immediate:true
    }
  }, */
  computed: {
    //同时获取多个属性
    ...mapState({
      activeTabName: state => state.Linchuangshiyan.tabname,
      extendCount: state => state.Linchuangshiyan.extendCount,
      res1: state => state.Linchuangshiyan.res1,
      res2: state => state.Linchuangshiyan.res2,
      res3: state => state.Linchuangshiyan.res3,
      res4: state => state.Linchuangshiyan.res4,
      nopms: state => state.Linchuangshiyan.nopms,
      allBase: state => state.Linchuangshiyan.allBase,
    }),
    /* noData() {
      return !this.res1.res&&!this.res2.length&&!this.res3.length&&!this.res4.length
    } */
  },
  methods: {
    handleClickTag (tab,event) {
      let path = "/api/linchuangshiyan/"+tab.name
      window.ga("send", "event", "tab", "click", "linchuangshiyan_"+tab.name)
      window._paq.push(['trackEvent', 'tab', 'click',"linchuangshiyan_"+tab.name])

      Store.commit("Linchuangshiyan/tabname",tab.name)
      Store.commit("Linchuangshiyan/path",path)
      if ((tab.name === "basegroup" && !_.keys(this.res1).length) || (tab.name === "namegroup" && !_.keys(this.res2).length) || (tab.name === "qiyegroup" && !_.keys(this.res3).length) || (tab.name === "syjggroup" && !_.keys(this.res4).length)) {
        Store.dispatch('Linchuangshiyan/nomalSearch',{path:path, queryToPutong: false})
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
  },
  mounted () {
    setTimeout(() => {
      if (location.href.indexOf("tabs%3D") > -1) {
        let tabs = location.href.substring(location.href.indexOf("tabs%3D") + 7);
        if (tabs) this.handleClickTag({ name: 'qiyegroup' }, null);
      }
    }, 2000);
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
