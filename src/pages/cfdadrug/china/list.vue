<template>
  <div>
    <el-tabs :value="activeTabName" @tab-click="handleClickTag" :before-leave="removeSwitch" class="la-list zhuce-list">
      <el-tab-pane :label="getTabLabel('按批准文号/注册证号浏览', extendCount.shoulihao_count)" name="base">
        <BaseTable></BaseTable>
      </el-tab-pane>
      <el-tab-pane :disabled="nopms.name_view" :label="getTabLabel('按药品名称浏览' ,extendCount.yaopingming_count)"
        name="nameGroup">
        <nameTable></nameTable>
      </el-tab-pane>
      <el-tab-pane :disabled="nopms.qy_view" :label="getTabLabel('按企业名称浏览' ,extendCount.qiyeming_count)"
        name="qiyeNameGroup">
        <qyTable></qyTable>
      </el-tab-pane>
      <el-tab-pane :label="getTabLabel('历史数据查询' ,extendCount.historyCount)" name="history_data">
        <qyTable></qyTable>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import BaseTable from './children/BaseTable'
import nameTable from './children/nameTable'
import qyTable from './children/qyTable'

import { mapState } from 'vuex'

export default {
  components: {
    BaseTable,
    nameTable,
    qyTable
  },
  data() {
    return {
    }
  },
  computed: {
    //同时获取多个属性
    ...mapState({
      activeTabName: state => state.CfdaDrug.tabname,
      res1: state => state.CfdaDrug.res1,
      res2: state => state.CfdaDrug.res2,
      res3: state => state.CfdaDrug.res3,
      extendCount: state => state.CfdaDrug.extendCount,
      nopms: state => state.CfdaDrug.nopms,
      allBase: state => state.CfdaDrug.allBase,
      conditions: state => state.CfdaDrug.conditions,
      putong: (state) => state.CfdaDrug.putong,
      groups: (state) => state.CfdaDrug.groups,
      filters: (state) => state.CfdaDrug.filters,
      gaoji: (state) => state.CfdaDrug.gaoji,
      shaixuan: (state) => state.CfdaDrug.shaixuan
    }),
    /* noData(){
      return !this.res1.res&&!this.res2.res&&!this.res3.res
    } */
  },
  /* watch:{
    //从智能分析返回列表刷新
    $route:{
      handler(){
        if(this.$route.path==='/cfdadrug/list'){
          //智能分析重新搜索清空列表数据tab无法自动复位
          let tabname= this.activeTabName
          Store.commit('CfdaDrug/tabname','')
          Store.commit('CfdaDrug/tabname',tabname)
          this.noData && Store.dispatch('CfdaDrug/nomalSearch',{queryToPutong: false,tabs:true})
        }
      },
      immediate:true
    }
  }, */
  methods: {
    removeSwitch(activeName, oldActiveName) {
      return !(activeName === 'history_data')
    },
    handleClickTag(tab, event) {
      let gas = ''
      if (tab.name === 'nameGroup') {
        gas = 'vip_cfdadrug_yaopin'
      } else if (tab.name === 'history_data') {
        gas = 'vip_cfdadrug_history'
      } else {
        gas = 'vip_cfdadrug_qiye'
      }
      if (gas) {
        window.ga("send", "event", "tab", "click", gas)
        window._paq.push(['trackEvent', 'tab', 'click', gas,])
      }
      if (tab.name === 'history_data') {
        let tempPutong = _.cloneDeep(this.putong),
          tempShaixuan = _.cloneDeep(this.shaixuan),
          tempGaoji = _.cloneDeep(this.gaoji),
          tempGroups = _.cloneDeep(this.groups),
          putongFilterArr = ['name', 'qiyemingcheng', 'pizhunwenhao'],
          shaixuanFilterArr = ['tp', 'type', 'guifanjixing'],
          gaojiFilterArr = [
            'name', 'brandname', 'qiyemingcheng', 'pizhunwenhao',
            'yuanpizhunwenhao', 'authorizationday', 'jixing',
            'guige', 'benweima', 'type', 'tp'
          ],
          putong = {},
          shaixuan = {},
          filter_condition = '',
          gaoji = {},
          groups = {};

        // 如果搜索了普通搜索
        if (Object.keys(this.putong).length > 0) {
          // 开始遍历普通搜索的键值属性并和中国上市和历史数据库公共普通搜索的字段进行比对
          // 如果是存在的话，那么就向putong对象中追加参数
          for (const [key, val] of Object.entries(this.putong)) {
            putongFilterArr.forEach(item => {
              if (key === item) {
                putong[key] = val;
              }
            })
          }
        }

        // 如果搜索了条件搜索
        if (Object.keys(this.shaixuan).length > 0) {
          for (const [key, val] of Object.entries(this.groups)) {
            if (val.length > 0) {
              groups[key] = val;
            }
          }
          // 开始遍历普通搜索的键值属性并和中国上市和历史数据库公共普通搜索的字段进行比对
          // 如果是存在的话，那么就向putong对象中追加参数
          for (const [key, val] of Object.entries(groups)) {
            shaixuanFilterArr.forEach(item => {
              if (key === item) {
                if (key === 'tp') {
                  shaixuan[key] = val.map(v => v.toString())
                } else {
                  shaixuan[key] = val;
                }
              }
            })
          }
          filter_condition = JSON.stringify(shaixuan)
        }

        // 如果搜索了高级搜索
        if (Object.keys(this.gaoji).length > 0) {
          // 开始遍历普通搜索的键值属性并和中国上市和历史数据库公共普通搜索的字段进行比对
          // 如果是存在的话，那么就向putong对象中追加参数
          for (const [key, val] of Object.entries(this.gaoji)) {
            gaojiFilterArr.forEach(item => {
              if (key === item) {
                gaoji[key] = val;
              }
            })
          }
        }

        console.log(putong, filter_condition, shaixuan, groups, this.gaoji, gaoji)
        let query = {
          ...putong
        }

        if (this.isEmpty(filter_condition)) {
          query['filter_condition'] = filter_condition;
        }

        if (this.conditions.length > 0) {
          let gaojiObj = {}
          this.conditions.forEach(item => {
            if (this.isEmpty(item.value)) {
              gaojiObj[item.name] = item.value;
            }
          })
          query = { ...gaojiObj, ...query };
        }
        let { href } = this.$router.resolve({
          path: "/pijian_jinkou_olddata",
          query
        });
        window.open(href, "_blank");
        return;
      }
      let path = tab.name === "base" ? "/api/cfdadrug" : ("/api/cfdadrug/" + tab.name)
      Store.commit("CfdaDrug/path", path)
      Store.commit("CfdaDrug/tabname", tab.name)
      if ((tab.name === "base" && !_.keys(this.res1.res).length) || (tab.name === "nameGroup" && !_.keys(this.res2.res).length) || (tab.name === "qiyeNameGroup" && !_.keys(this.res3.res).length)) {
        Store.dispatch('CfdaDrug/nomalSearch', { path: path, queryToPutong: false })
      }
    }
  },
  created() {
    setTimeout(() => {
      const hashLocation = sessionStorage.getItem("hashLocation");//缓存中获取当前页面的路由名称
      // 注意, 这里使用全路径匹配,在hash模式中,因为地址会携带#,所以页面报告中的url需要重新覆盖一下, 将#去除
      window._paq.push(['setCustomUrl', "https://" + hashLocation]);//覆盖页面报告的url，可以自定义页面url，加上本页面路由
      window._paq.push(['trackPageView', this.allBase.dbname]);//页面名称,可以自定义页面名称
      window._paq.push(['setDocumentTitle', this.allBase.dbname])
    }, 1000);
  },
  mounted() {
    // $('.el-tabs__active-bar').css('width','84px')
  }
}
</script>

<style lang="less">
@import "~@/assets/less/var.less";

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
</style>
