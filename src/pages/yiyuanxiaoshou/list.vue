<template>
  <div>
    <el-tabs :value="activeTabName" @tab-click="handleClickTag" class="la-list">
      <el-tab-pane
        :label="getTabLabel('按销售年份浏览', extendCount.listCount)"
        name="listyear"
        class="slh-pane">
        <ListOne></ListOne>
      </el-tab-pane>
      <el-tab-pane
        :label="getTabLabel('按药品名称浏览', extendCount.nameCount)"
        name="listname"
        :disabled="nopms.listname"
        :class="{'abandon-click-method': nopms.listname}">
        <ListTwo></ListTwo>
      </el-tab-pane>
      <el-tab-pane
        :label="getTabLabel('按活性成分浏览', extendCount.zwylbmCount)"
        name="listzwylbm"
        :disabled="nopms.listzwylbm"
        :class="{'abandon-click-method': nopms.listzwylbm}">
        <ListFour></ListFour>
      </el-tab-pane>
      <el-tab-pane
        :label="getTabLabel('按企业名称浏览', extendCount.qiyeCount)"
        name="listqiye"
        :disabled="nopms.listqiye"
        :class="{'abandon-click-method': nopms.listqiye}">
        <ListThree></ListThree>
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
      handler() {
        if(this.$route.path==='/yyxs/list'){
          //智能分析重新搜索清空列表数据tab无法自动复位
          let tabname= this.activeTabName
          Store.commit('Yyxs/tabname','')
          Store.commit('Yyxs/tabname',tabname)
          this.noData && Store.dispatch('Yyxs/nomalSearch',{queryToPutong: false,tabs:true})
        }
      },
      immediate: true
    }
  }, */
  computed: {
    //同时获取多个属性
    ...mapState({
      activeTabName: state => state.Yyxs.tabname,
      extendCount: state => state.Yyxs.extendCount,
      res1: state => state.Yyxs.res1,
      res2: state => state.Yyxs.res2,
      res3: state => state.Yyxs.res3,
      res4: state => state.Yyxs.res4,
      nopms: state => state.Yyxs.nopms,
      allBase: state => state.Yyxs.allBase,
    }),
    /* noData() {
      return !this.res1.res&&!this.res2.res&&!this.res3.res&&!this.res4.res
    } */
  },
  methods: {
    handleClickTag (tab,event) {
      window.ga("send","event", "tab", "click","yyxs_"+tab.name);
      window._paq.push(['trackEvent', 'tab',"click", "yyxs_"+tab.name, ])

      let path = "/api/yyxs/"+tab.name
      Store.commit("Yyxs/tabname",tab.name)
      Store.commit("Yyxs/path",path)
      if ((tab.name === "listname" && !_.keys(this.res2.res).length) || (tab.name === "listqiye" && !_.keys(this.res3).length) || (tab.name === "listyear" && !_.keys(this.res1).length) || (tab.name === "listzwylbm" && !_.keys(this.res4).length)) {
        Store.dispatch('Yyxs/nomalSearch',{path:path, queryToPutong: false})
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

.la-list{
  background-color: #fff;
}
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
