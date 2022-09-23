<template>
  <div>
    <!-- 高级搜索弹出框 -->
    <el-dialog :visible.sync="dialogFormVisible" :append-to-body="true" width="815px">
      <div slot="title" class="dialog-header">
        高级搜索
      </div>
      <Advanced
        :dialogFormVisible="dialogFormVisible"
        :vuex_name="vuex_name"
        :api_name="api_name"
        :route1="route1"
        :route2="route2"
        @closeAdvancedDialog="()=>dialogFormVisible=false"
        ref="advanced"></Advanced>
    </el-dialog>

    <template v-for="(item, index) in vueHandleInitPutong(nomal_filed)">
      <Normal
        :vuex_name="vuex_name"
        :api_name="api_name"
        :item="item"
        :route1="route1"
        :route2="route2"
        :key="index"
        ref="ileft"></Normal>
    </template>
    <div class="advanced-search">
      <span class="fr adva-icon" v-if="advanced_filed.length">
        <em class="iconfont">&#xe67a;</em><a @click.prevent="handleAdvancedClick()" :class="{'abandon-click-method': nopms.gjss}">高级搜索</a>
        <el-tooltip class="item" effect="light" placement="right" v-if="helpInfo.high_holder">
          <div slot="content" v-html="helpInfo.high_holder"></div>
          <i class="el-icon-question cl-green"></i>
        </el-tooltip>
      </span>
      <el-button class="advanced-search-btn" :class="{'normal-search-btn':!advanced_filed.length}" type="primary" size="mini" round @click="nomalSearch()">搜索</el-button>
    </div>
  </div>
</template>

<script>
  import Normal from '@/components/common/normal'
  import Advanced from '@/components/common/advanced'
  export default{
    components: {
      Normal,
      Advanced
    },
    props: {
      vuex_name: {
        type: String,
      },
      api_name: {
        type: String,
      },
      route1: {
        type: String,
      },
      route2: {
        type: String,
      }
    },
    data () {
      return {
        dialogFormVisible: false,
      }
    },
    computed:{
      nomal_filed(){
        return Store.state[this.vuex_name].nomal_filed
      },
      advanced_filed(){
        return Store.state[this.vuex_name].advanced_filed
      },
      putong(){
        return Store.state[this.vuex_name].putong
      },
      nopms(){
        return Store.state[this.vuex_name].nopms
      },
      helpInfo(){
        return Store.state[this.vuex_name].helpInfo
      }
    },
    methods: {
      //获取普通搜索
      nomalSearch (params) {
        Store.commit(this.vuex_name+"/conditions",[])
        //清空高级搜索条件和筛选项
        Store.commit(this.vuex_name+'/groups',{})
        //化学结构式区分图片拼接方式
        if (this.vuex_name==='Database') {
          if (!params) {
            Store.commit(this.vuex_name+"/setStructuralsType", 0)
          };
        };
        Store.dispatch(this.vuex_name+'/nomalSearch')
      },
      // 高级搜索
      handleAdvancedClick () {
        if (!this.nopms.gjss) {
          this.dialogFormVisible = true
          if (this.$refs.advanced) { // 第一次点击之后才渲染，所以加此判定
            this.$refs.advanced.initConditions()
          }
        }
      },
    },
    mounted(){
    }
  }
</script>

<style lang="less" scoped>
@import "~@/assets/less/var.less";
.dialog-header {
  position: relative;
  height: 20px;
  line-height: 20px;
  padding-left: 20px;
  color: @PrimaryColor;
  font-size: 15px;
  font-weight: bold;
  &::before {
    content: '';
    position: absolute;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: @PrimaryColor;
    top: 50%;
    left: 2px;
    margin-top: -3px;
  }
}
.advanced-search{
  padding: 16px 15px;
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  .adva-icon em, .adva-icon a {
    color: #4877e8;
    font-size: 14px;
  }

  .advanced-search-btn{
    display: inline-block;
    padding: 5px 0px;
    width: 100px;
    box-sizing: border-box
  }
  .normal-search-btn{
    display: inline-block;
    padding: 5px 0px;
    width: 100%;
    box-sizing: border-box
  }
  .fr{
    display: inline-block;
    height: 24px;
    line-height: 24px;
    i{
      display: inline-block;
      padding: 0px;
      margin: 0px;
    }
  }
}
</style>