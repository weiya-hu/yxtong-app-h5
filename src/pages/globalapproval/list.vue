<template>
  <div class="lists">
    <el-tabs :value="activeTabName" @tab-click="handleClickTag" class="la-list globalapproval-list"
      :before-leave="beforeLeave">
      <el-tab-pane :label="getTabLabel('按药品名称浏览',extendCount.BaseCount)" name="first" class="slh-pane">
        <ListOne></ListOne>
      </el-tab-pane>
      <el-tab-pane :label="getTabLabel('按活性成分浏览',extendCount.NameCount)" name="namegroup" :disabled="nopms.namegroup"
        :class="{'abandon-click-method': nopms.namegroup}">
        <ListTwo></ListTwo>
      </el-tab-pane>
      <el-tab-pane :label="getTabLabel('按企业名称浏览',extendCount.QiyeCount)" name="qiyegroup" :disabled="nopms.qiyegroup"
        :class="{'abandon-click-method': nopms.qiyegroup}">
        <ListThree></ListThree>
      </el-tab-pane>

      <el-tab-pane name="fensantu" :disabled="nopms.cname" :class="{'abandon-click-method': nopms.cname}">>
        <span slot="label" v-if="!nopms.cname"> <img src="../../../static/imgs/fensantu.png" alt=""
            style="vertical-align: middle"> 单品种分析</span>
        <span slot="label" v-else> <img src="../../../static/imgs/fensantu_gray.png" alt=""
            style="vertical-align: middle"> 单品种分析</span>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import ListOne from './lists/list-one'
import ListTwo from './lists/list-two'
import ListThree from './lists/list-three'
import { mapState } from 'vuex'

export default {
  components: {
    ListOne,
    ListTwo,
    ListThree,
  },
  data() {
    return {
    }
  },
  computed: {
    //同时获取多个属性
    ...mapState({
      activeTabName: state => state.Globalapproval.tabname,
      extendCount: state => state.Globalapproval.extendCount,
      res1: state => state.Globalapproval.res1,
      res2: state => state.Globalapproval.res2,
      res3: state => state.Globalapproval.res3,
      nopms: state => state.Globalapproval.nopms,
    }),
    /* noData() {
      return !this.res1.res&&!this.res2.length&&!this.res3.length
    } */
  },
  // watch: {
  //   $route:{
  //     handler(){
  //       if(this.$route.path==='/globalapproval/list'){
  //         //智能分析重新搜索清空列表数据tab无法自动复位
  //         let tabname= this.activeTabName
  //         let path = tabname==="first"?"/api/globalapproval":("/api/globalapproval/"+tabname)
  //         Store.commit('Globalapproval/tabname','')
  //         Store.commit('Globalapproval/tabname',tabname)
  //         Store.dispatch('Globalapproval/nomalSearch',{queryToPutong: false,tabs:true,path:path})
  //       }
  //     },
  //     immediate:true
  //   }
  // },
  methods: {
    beforeLeave(item) {
      return new Promise((resolve, reject) => {
        if (item === 'fensantu') {
          reject()
        } else {
          resolve()
        }
      });
    },
    handleClickTag(tab, event) {
      window.ga("send", "event", "tab", "click", "globalapproval_" + tab.name);
      window._paq.push(['trackEvent', 'tab', "click", "globalapproval_" + tab.name,])


      if (tab.name === 'fensantu') {
        const { href } = this.$router.resolve({
          path: `/globalapproval/scatter-graph`
        });
        window.open(href, "_blank");
      } else {
        let path = tab.name === "first" ? "/api/globalapproval" : ("/api/globalapproval/" + tab.name)
        Store.commit("Globalapproval/tabname", tab.name)
        Store.commit("Globalapproval/path", path)
        if ((tab.name === "first" && !_.keys(this.res1.res).length) || (tab.name === "namegroup" && !_.keys(this.res2).length) || (tab.name === "qiyegroup" && !_.keys(this.res3).length)) {
          Store.dispatch('Globalapproval/nomalSearch', { path: path, queryToPutong: false })
        }

      }
    }
  },
  created() {

  },
  mounted() {
  }
}
</script>

<style lang="less">
@import "~@/assets/less/var.less";

.globalapproval-list {
  .el-tabs__header {
    padding-left: 14px;
    margin: 0px;
  }

  .el-tabs__content {
    overflow: visible;
  }

  .el-tabs__active-bar {
    height: 3px;
    border-radius: 5px;
  }

  .el-tabs__item {
    padding: 0 14px;
  }
}
</style>
