<template>
  <div class="la-number">
    <div class="number-range">
      <el-input
        v-model="dateval[0]"
        type="number"
        :min="0"
        :max="max"
        @keyup.native.enter="getEnterKey()"
        @input="updateValue"
        :placeholder="item.placeholder?item.placeholder:'请输入自然数'"
        clearable>
      </el-input>
      <span>-</span>
      <el-input
        v-model="dateval[1]"
        type="number"
        :min="0"
        :max="max"
        @keyup.native.enter="getEnterKey()"
        @input="updateValue"
        :placeholder="item.placeholder?item.placeholder:'请输入自然数'"
        clearable>
      </el-input>
    </div>
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
    value: {
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
    },
    index: {
      type: Number,
    }
  },
  data() {
    return {
      dateval: this.value?this.value.split(':'):['',''],
      max: '9999999999',
    }
  },
  computed: {
    defaulval() {
      //传入普通搜索条件
        if (this.value!="") {
        var value = _.split(this.value,':',2)
        return [value[0], value[1]]
      }
    },
  },
  watch: {

  },
  methods: {
    getEnterKey() {
      this.$emit("advancedSearch")
    },
    numSlice(i) {
      let len = this.max.length
      if(this.dateval[i].length>len){
        this.dateval[i] = this.dateval[i].slice(0,len)
      }
    },
    updateValue () {
      this.numSlice(0)
      this.numSlice(1)
      let datevalStart = this.dateval[0],
      datevalEnd = this.dateval[1];
      if (datevalStart===''&&datevalEnd!=='') {
        datevalStart = '0'
      };
      if (datevalStart!==''&&datevalEnd==='') {
        datevalEnd = '0'
      };
      let date = datevalStart + ":" + datevalEnd;
      if (date == ":") { // 左右侧全部清空后，避免带入":"符号进去
        date = ""
      }
      this.$emit("updateValue", this.index, date)
    },
  },
  created() {
    //用于默认传值
    if (this.value!="") {
      var value = _.split(this.value,':',2)
      this.defaulval[0] = value[0]
      this.defaulval[1] = value[1]
    }
  },
}
</script>

<style lang="less">
@import "~@/assets/less/var.less";
.la-number{
  .number-range{
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
    font-size: @FontSizeSmall;
    .el-radio__label {
      padding-left: 4px;
      font-size: @FontSizeSmall;
    }
    .el-input--suffix {
      width: 148px!important;
    }
    .el-input__inner {
      padding-left: 15px!important;
      padding-right: 25px!important;
      width: 148px;
    }
    .el-date-editor.el-input,
    .el-date-editor.el-input__inner {
      width: calc(50% - 8px)!important;
    }
    .el-input__prefix {
      left: 8px!important;
    }
    .el-input__icon {
      line-height: 100%;
    }
  }
}
</style>
