<template>
  <div class="trz-left-check-box">
     <el-checkbox-group v-model="checkData" @change="saveData">
      <el-checkbox v-for="(txt, index) in item.value" :key="index" :label="txt.value">{{txt.label}}</el-checkbox>
    </el-checkbox-group>
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
      checkData: []
    }
  },
  computed:{
    queryStr() {
      return Store.state[this.vuex_name].query;
    }
  },
  watch:{
  },
  created(){
    for (var i = 0; i < this.queryStr.length; i++) {
      if (this.item.name === this.queryStr[i].name) {
        this.checkData = this.queryStr[i].value.split(',')
      }
    }
  },
  methods:{
    saveData(data){
      console.log(data)
      if(data){
        Store.commit(this.vuex_name + "/query", {
          opt: 1,
          param: { name: this.item.name, label: this.item.label, value: data.join(','),type: this.item.type }
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
.trz-left-check-box{
  padding: 8px 14px 0 10px;
  /deep/ .el-checkbox__label{
      font-weight: 400;
  }

  /deep/ .el-checkbox+.el-checkbox {
    margin-left: 10px;
  }
  /deep/ .el-checkbox__input.is-checked+.el-checkbox__label {
    color: #3556B9;
  }

  /deep/ .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
    background-color: #3556B9;
    border-color: #3556B9;
  }
}
</style>
