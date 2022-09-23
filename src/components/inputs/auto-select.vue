<template>
  <div class="auto-select">
    <el-select
      id="nameWordsGj"
      v-model="valueData"
      :remote-method="remoteMethod"
      :loading="loading"
      filterable
      remote
      clearable
      :reserve-keyword="false"
      :placeholder="initItem.placeholder"
      @change="resetValue"
      @click.native="nameSelChange"
      @clear="clearSelFn"
    >
      <el-option-group
        v-for="group in options"
        :key="group.label"
        :label="group.label"
      >
        <el-option
          v-for="item in group.options"
          :key="item"
          :label="item"
          :value="item"
        >
        </el-option>
      </el-option-group>
    </el-select>
  </div>
</template>

<script>
const defaultItem = {
  name: "",
  type: "text",
  label: "",
  placeholder: "",
  accurate: "",
  search_hint: "",
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
    api_name: {
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
    value: {
      type: String,
      default() {
        return "";
      }
    },
    index: {
      type: Number,
    },
  },
  data() {
    return {
      accurateValue: false,
      // IE内核的浏览器，在 el-autocomplete  使用了 placeholder 之后，会在页面初次加载的时候就触发 input 事件，导致 resetValue 被调用。
      // once: true,
      valueData: this.value,
      options: [],
      loading: false,
    };
  },
  computed: {
    //经过格式化后的item
    initItem() {
      return Object.assign({}, defaultItem, this.item);
    },
  },
  watch: {
    value() {
      this.valueData = this.value
      // 每次更改值之前先将输入建议数组清空 防止脏数据产生
      this.options = [];
    },
  },
  methods: {
    //获取提示词
    remoteMethod(queryString) {
      this.resetValue(queryString);
      // 限制2个级以上的字符在做搜索提示
      if (queryString.length < 2) {
        return;
      }
      if (queryString) {
        // search_hint有值且包含/使用传值路径请求
        let url = "/api/globaldrugs/input";
        this.loading = true;
        window
          .Axios({
            methods: "get",
            url: url,
            params: {
              accesstoken: this.vueGetCookie("accesstoken"),
              keywords: queryString,
            },
          })
          .then((res) => {
            this.loading = false;
            if (res.data.data) {
              this.options = res.data.data;
            }
          })
          .catch((thrown) => {
            this.loading = false;
            console.log("请求出错了");
          });
      }
    },
    resetValue(value) {
      this.$emit("updateValue", this.index, _.trim(value));
    },
    getEnterKey() {
      $(".autocompletePop").hide();
      this.$emit("advancedSearch");
    },
    clearSelFn() {
      $("#nameWordsGj").val("");
    },
    nameSelChange() {
      $("#nameWordsGj").val(this.value);
    },
  },
  created() {
  },
  mounted() {},
};
</script>

<style lang="less">
@import "~@/assets/less/var.less";
.el-select-dropdown {
  max-width: 264px !important;
}
.auto-select {
  width: 100%;
  .title {
    padding: 10px 0px 4px;
    font-size: 14px;
    color: #333;
    .title-right {
      float: right;
      color: @FontColor3;
    }
  }

  .el-select {
    width: 100%;
    outline: none;
  }
  .el-select .el-input.is-focus .el-input__inner {
    border-color: #ebeef5;
  }

  .el-select .el-input .el-input__inner{
    cursor: revert;
  }
}
</style>
