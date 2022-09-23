<template>
  <div class="table-select" :class="{'table-select-analy':analy}">
    <span class="table-select-title" v-if="title">{{title}}</span>
    <el-select
      class="table-sel"
      v-model="valueChild"
      @change="updateValue">
      <el-option
        v-for="item in unitOption"
        :key="item.value"
        :label="item.label"
        :value="item.value"
        :popper-append-to-body="false">
      </el-option>
    </el-select>
  </div>
</template>

<script>

export default{
  props: {
    value: {
      type: String
    },
    title: {
      type: String
    },
    gaKey: {
      type: String
    },
    analy: {
      type: Boolean
    }
  },
  components:{

  },
  model: {
    prop: 'value',
    event: 'change'
  },
  data (){
    return {
      valueChild: this.value,
      unitOption:[{label:"销售额(万元RMB)",value:"1"},{label:"销售额(百万元RMB)",value:"100"},{label:"销售额(千万元RMB)",value:"1000"},{label:"销售额(亿元RMB)",value:"10000"}]
    }
  },
  computed: {

  },
  methods: {
    updateValue(value){
      ga("send", "event", "button", "click","vip_ypxs_"+ this.gaKey +"_danweiqiehuan")
      window._paq.push(['trackEvent', 'button',"click", "vip_ypxs_"+ this.gaKey +"_danweiqiehuan", ])

      this.$emit("change",value)
    }
  },
}
</script>

<style lang="less" scoped>
.table-select {
  display: inline-flex;
  padding: 0;
  vertical-align: middle;
}
.table-sel {
  padding: 0;
  width: 130px;
  /deep/.el-input__inner {
    border: none;
    background: unset;
    padding: 0;
  }
  /deep/.el-input--suffix {
    padding: 0;
  }
}
.table-select-title {
  font-size: 14px;
  line-height: 30px;
  margin-right: 10px;
}
.table-select-analy {
  .table-sel {
    border: 1px solid #b3bbcc;
    border-radius: 4px;
    padding: 0 10px;
  }
}
</style>
