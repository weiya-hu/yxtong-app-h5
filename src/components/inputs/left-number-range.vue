<template>
  <div class="la-left-number">
    <div class="title">
      <label class="title-label">
        <!-- {{initItem.label}} -->
        <NewProjectGuide
          postion="基础"
          :onlyKey="initItem['new_id']"
          :newPosition="{ right: initItem.statement ? -40 : -26 }"
          display="inline"
          compoentsName="检索功能"
          :initItem="initItem"
          :showMenban="initItem['is_show_new']"
          >{{ initItem.label }}</NewProjectGuide
        >
      </label>
      <el-tooltip v-if="initItem.statement" effect="light" placement="right">
        <div slot="content" v-html="initItem.statement"></div>
        <i class="el-icon-question cl-green"></i>
      </el-tooltip>
    </div>
    <div class="number-range">
      <el-input
        v-model="dateval[0]"
        type="number"
        :min="0"
        :max="max"
        @keyup.native.enter="getEnterKey()"
        @input="updateValue"
        :placeholder="item.placeholder ? item.placeholder : '请输入自然数'"
        clearable
      >
      </el-input>
      <span>-</span>
      <el-input
        v-model="dateval[1]"
        type="number"
        :min="0"
        :max="max"
        @keyup.native.enter="getEnterKey()"
        @input="updateValue"
        :placeholder="item.placeholder ? item.placeholder : '请输入自然数'"
        clearable
      >
      </el-input>
    </div>
  </div>
</template>

<script>
const defaultItem = {
  name: "",
  type: "numerical_interval",
  label: "",
  placeholder: "",
  value: "",
  statement: "",
};
export default {
  props: {
    vuex_name: {
      type: String,
      default() {
        return "";
      },
    },
    item: {
      type: Object,
      default() {
        return {};
      },
    },
    index: {
      type: Number,
    },
  },
  data() {
    return {
      dateval: ["", ""],
      max: "9999999999",
    };
  },
  computed: {
    //经过格式化后的item
    initItem() {
      return Object.assign({}, defaultItem, this.item)
    },
    vuexQuery() {
      return Store.state[this.vuex_name].queryStr;
    }
  },
  watch: {},
  methods: {
    getEnterKey() {
      this.$emit("nomalSearch");
    },
    numSlice(i) {
      let len = this.max.length;
      if (this.dateval[i].length > len) {
        this.dateval[i] = this.dateval[i].slice(0, len);
      }
    },
    updateValue() {
      this.numSlice(0);
      this.numSlice(1);
      let datevalStart = this.dateval[0],
        datevalEnd = this.dateval[1];
      if (datevalStart === "" && datevalEnd !== "") {
        datevalStart = "0";
      }
      if (datevalStart !== "" && datevalEnd === "") {
        datevalEnd = "0";
      }
      let date = datevalStart + ":" + datevalEnd;
      if (date == ":") {
        // 左右侧全部清空后，避免带入":"符号进去
        date = "";
      }

      Store.commit(this.vuex_name + "/query", {
        opt: 1,
        param: { name: this.initItem.name, label: this.initItem.label, value: date, type:"numerical_interval" }
      });

    },
  },
  created() {
    //用于默认传值
    if (this.item.value) {
      this.dateval[0] = this.item.value.split(":")[0]
      this.dateval[1] = this.item.value.split(":")[1]
    }
  },
};
</script>

<style lang="less">
@import "~@/assets/less/var.less";
.la-left-number {
  padding: 0 14px 0 10px;

  .title {
    padding: 10px 0px 4px;
    font-size: 12px;
    color: #333;
    .title-right {
      float: right;
      color: @FontColor3;
    }
  }
  .number-range {
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
      width: calc(50% - 8px) !important;
    }
    .el-input__inner {
      padding-left: 10px !important;
      padding-right: 20px !important;
      width: 100%;
    }
    .el-date-editor.el-input,
    .el-date-editor.el-input__inner {
      width: calc(50% - 8px) !important;
    }
    .el-input__prefix {
      left: 8px !important;
    }
    .el-input__icon {
      line-height: 100%;
    }
  }
}
</style>
