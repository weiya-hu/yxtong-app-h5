<template>
  <div class="list-tabs">
    <el-tabs :value="activeTabName" @tab-click="handleClickTag">
      <el-tab-pane
        :label="getTabLabel('按品种浏览', extendCount.nameCount)"
        name="groupbyname">
        <ListTwo></ListTwo>
      </el-tab-pane>
      <el-tab-pane
        :label="getTabLabel('按企业浏览' ,extendCount.qiyeCount)"
        name="groupbyqiye"
        :disabled="nopms.groupbyqiye"
        :class="{'abandon-click-method': nopms.groupbyqiye}">
        <ListThree></ListThree>
      </el-tab-pane>
      <el-tab-pane
        :label="getTabLabel('按批文浏览', extendCount.piwenCount)"
        name="groupbypiwen"
        :disabled="nopms.groupbypiwen"
        :class="{'abandon-click-method': nopms.groupbypiwen}">
        <ListOne></ListOne>
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
  computed: {
    //同时获取多个属性
    ...mapState({
      activeTabName: state => state.Yzx.tabname,
      extendCount: state => state.Yzx.extendCount,
      res1: state => state.Yzx.res1,
      res2: state => state.Yzx.res2,
      res3: state => state.Yzx.res3,
      nopms: state => state.Yzx.nopms,
      allBase: state => state.Yzx.allBase,
    })
  },
  methods: {
    handleClickTag (tab,event) {
      window.ga("send","event", "tab", "click","yzx_"+tab.name);
        window._paq.push(['trackEvent', 'tab', 'click', "yzx_"+tab.name,])

      let path = "/api/yzx/"+tab.name
      Store.commit("Yzx/tabname",tab.name)
      Store.commit("Yzx/path",path)
      if ((tab.name === "groupbypiwen" && !_.keys(this.res1.res).length) || (tab.name === "groupbyname" && !_.keys(this.res2).length) || (tab.name === "groupbyqiye" && !_.keys(this.res3).length)) {
        Store.dispatch('Yzx/nomalSearch',{path:path, queryToPutong: false})
      }
    }
  },
  created() {
    setTimeout(() => {
      const hashLocation= sessionStorage.getItem("hashLocation");//缓存中获取当前页面的路由名称
      // 注意, 这里使用全路径匹配,在hash模式中,因为地址会携带#,所以页面报告中的url需要重新覆盖一下, 将#去除
      window._paq.push(['setCustomUrl', "https://" + hashLocation]);//覆盖页面报告的url，可以自定义页面url，加上本页面路由
      window._paq.push(['trackPageView', this.allBase.dbname]);//页面名称,可以自定义页面名称
      window._paq.push(['setDocumentTitle', this.allBase.dbname])
    }, 1000);
  },
  mounted () {
    this.vueRouteFrom("Yzx")
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
