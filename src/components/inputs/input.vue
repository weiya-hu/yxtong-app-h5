<template>
  <div class="la-advenced-input">
    <inputPopover appendToBody ref="inputPop" :value="valueData">
      <div v-if="initItem.accurate === '精确'" class="jq">
        <el-input
          v-model="valueData"
          @keyup.native.enter="getEnterKey()"
          @input="resetValue(valueData)"
          :placeholder="initItem.placeholder"
          clearable>
        </el-input>
        <el-checkbox @change="nameChange" v-model="accurateValue">精确</el-checkbox>
      </div>

      <!-- TODO: v-model="value"时，可以绑定普通搜索传值，且可以搜索，清空后搜索也可以（但v-model会警告不要和props绑定）-->
      <!-- :value="value"时，仅能绑定普通搜索传值 -->
      <div v-else class="not-jq">
        <el-input
          v-model="valueData"
          @keyup.native.enter="getEnterKey()"
          @input="resetValue(valueData)"
          :placeholder="placeholder||initItem.placeholder"
          clearable>
        </el-input>
      </div>
    </inputPopover>
  </div>
</template>

<script>
import inputPopover from '@/components/inputs/input-popover'

  const defaultItem = {
    "name": "",
    "type": "text",
    "label": "",
    "placeholder": "",
    "accurate": "",
    "search_hint": "",
    "value": ''
  }
  export default{
    components: {
      inputPopover
    },
    props: {
      vuex_name: {
        type: String,
        default () {
          return ""
        }
      },
      item: {
        type: Object,
        default () {
          return {}
        }
      },
      value: {
        type: String,
        default () {
          return ""
        }
      },
      index: {
        type: Number,
      },
      accurateCheck: {
        type: Boolean,
      },
      placeholder: {
        type: String
      }
    },
    data () {
      return {
        accurateValue: this.accurateCheck,
        valueData:this.value
      }
    },
    computed: {
      //经过格式化后的item
      initItem () {
        return Object.assign({}, defaultItem, this.item)
      },
    },
    watch: {
      value(value){
        this.valueData = value;
      },
      accurateCheck(val){
        this.accurateValue = val
      }
    },
    methods: {
      nameChange () {
        this.$emit("updateAccurate", this.index, this.accurateValue)
      },
      resetValue (value) {
        this.$emit("updateValue", this.index, _.trim(value))
      },
      getEnterKey() {
        this.$emit("advancedSearch")
      },
    }, 
  }
</script>

<style lang="less">
  .jq{
    .el-input{
      width: 250px;
    }
    .el-autocomplete{
      width: auto;
    }
  }
</style>