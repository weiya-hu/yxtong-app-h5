<template>
  <div class="la-input">
    <div class="title">

      <label class="title-label">
        <NewProjectGuide  postion="基础" display="inline" :newPosition="{ right: initItem.statement ? -40 : -26 }" :onlyKey="initItem['new_id']"  compoentsName="检索功能" :initItem="initItem" :showMenban="initItem['is_show_new']">{{initItem.label}}</NewProjectGuide>
      </label>
      <!-- <label class="title-label">{{initItem.label}}</label> -->
      <el-tooltip v-if="initItem.field=='barmc' && initItem.label=='企业名称' && vuex_name == 'Qxba'" effect="light" placement="right">
        <div slot="content" v-html="helpDesc.nameOfCompany"></div>
        <i class="el-icon-question cl-green"></i>
      </el-tooltip>
      <el-tooltip v-if="initItem.statement"
        effect="light"
        placement="right"
        >
        <div slot="content" v-html="initItem.statement"></div>
        <i class="el-icon-question cl-green"></i>
      </el-tooltip>
      <el-checkbox v-if="initItem.accurate==='精确'" class="title-right" @change="nameChange" v-model="accurateValue" size="mini">精确</el-checkbox>
    </div>
    <inputPopover :value="value">
      <!-- 无自动提示的输入框 - （普通搜索）受理号 -->
      <el-input
        :data-name="initItem.field"
        v-model="value"
        @keyup.native.enter="getEnterKey()"
        @input="resetValue(value)"
        :placeholder="initItem.placeholder"
        clearable>
      </el-input>
    </inputPopover>
  </div>
</template>

<script>
import inputPopover from '@/components/inputs/input-popover'
const defaultItem = {
  name: "",
  type: "text",
  label: "",
  placeholder: "",
  accurate: "",
  search_hint: "",
  value: "",
  statement: ""
};
export default {
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
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      accurateValue: false,
      value: '',
      helpDesc: {
        nameOfCompany: '该器械申请备案的公司'
      }
    }
  },
  computed: {
    //经过格式化后的item
    initItem() {
      return Object.assign({}, defaultItem, this.item)
    },
    vuexQuery() {
      return Store.state[this.vuex_name].queryStrAnaly;
    }
  },
  watch: {
    accurateValue() {
      this.nameChange();
    },
    vuexQuery: {
      handler(val) {
        var array = JSON.parse(val);
        this.value = "";
        for (var i = 0; i < array.length; i++) {
          if (this.initItem.name === array[i].name) {
            this.value = array[i].value
          }
        }
      },
      deep:true
    }
  },
  methods: {
    nameChange() {
      // if (this.initItem.value) {
        Store.commit(this.vuex_name + "/queryAnaly", {
          opt: 1,
          param: {
            name: this.initItem.name,
            label: this.initItem.label,
            accurate: this.accurateValue,
            value: this.initItem.value,
            type: this.initItem.type
          }
        })
        Store.commit(this.vuex_name + "/queryStrAnaly", Store.state[this.vuex_name].queryAnaly)
      // }
    },
    resetValue(value) {
      this.initItem.value = _.trim(value)
      this.nameChange()
    },
    getEnterKey() {
      this.$emit("nomalSearch")
    },
  },
  created() {
    // 初始是否精确
    if (this.item.initAccurate) {
      this.accurateValue = true
    }

    //解决左侧input搜索后，时间列表和视图分析 切换时有一个页面input为空
    try{
      var array = JSON.parse(this.vuexQuery);
      for (var i = 0; i < array.length; i++) {
        if (this.initItem.name === array[i].name) {
          this.value = array[i].value
        }
      }
    }catch(err){

    }

  },
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/var.less";


.la-input {
  padding: 0 14px 0 10px;

  .title {
    padding: 10px 0px 4px;
    font-size: 14px;
    color: #333;
    .title-right {
      float: right;
      color: @FontColor3;
    }
  }
  .el-input__inner{
    background-color: @InputBgColor;
  }
}
.el-autocomplete {
  width: 100%;
}
</style>
