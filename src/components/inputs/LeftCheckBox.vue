<template>
  <div class="left-check-box">

    <el-checkbox v-model="checkData" @change="saveData">
      <NewProjectGuide  postion="基础" :onlyKey="item['new_id']" :newPosition="{ right: item.statement ? -40 : -26 }" compoentsName="检索功能" :initItem="item" :showMenban="item['is_show_new']">{{item.label}}</NewProjectGuide>
      <!-- {{item.label}} -->
    </el-checkbox>
  </div>
</template>

<script>
export default {
  props: {
    vuex_name: {
      type: String,
      default () {
        return ""
      }
    },
    api_name: {
      type: String,
      default () {
        return ""
      }
    },
    item: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data(){
    return {
      checkData:false
    }
  },
  computed:{
    queryStr() {
      return Store.state[this.vuex_name].queryStr;
    }
  },
  watch:{
    queryStr:{
      handler(val){
        if(val){
          let query = JSON.parse(val).find(item=>item.name==this.item.name)
          this.checkData = query?true:false
        }
      },
      immediate:true,
      deep:true
    }
  },
  created(){
    if(Store.state[this.vuex_name].queryStr){
      let query = JSON.parse(Store.state[this.vuex_name].queryStr).find(item=>item.name==this.item.name)
      if(query)this.checkData = query.value=='是'?true:false
    }

  },
  methods:{
    saveData(){
      if(this.checkData){
        console.log(this.checkData)
        Store.commit(this.vuex_name + "/query", {
          opt: 1,
          param: { name: this.item.name, label: this.item.label, value: '是',type: this.item.type }
        })
        Store.commit(this.vuex_name + "/queryStr", Store.state[this.vuex_name].query)
      }else{
        _.remove(Store.state[this.vuex_name].query, n => {
          let isExist = this.item.name.indexOf(n.name) === 0
          return isExist
        })
        Store.commit(this.vuex_name + "/queryStr", Store.state[this.vuex_name].query)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.left-check-box{
  padding: 8px 14px 0 10px;
  /deep/ .el-checkbox__label{
      font-weight: 400;
  }
}
</style>
