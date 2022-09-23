<template>
  <div class="la-auto-select">
    <div class="title">
      <label class="title-label">
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
      <el-checkbox
        v-if="initItem.accurate === '精确'"
        class="title-right"
        @change="nameChange"
        v-model="accurateValue"
        size="mini"
        >精确</el-checkbox
      >
    </div>
    <el-select
      v-model="value"
      :remote-method="remoteMethod"
      :loading="loading"
      filterable
      remote
      clearable
      :reserve-keyword="false"
      :placeholder="initItem.placeholder"
      @change="resetValue"
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
  },
  data() {
    return {
      accurateValue: false,
      // IE内核的浏览器，在 el-autocomplete  使用了 placeholder 之后，会在页面初次加载的时候就触发 input 事件，导致 resetValue 被调用。
      // once: true,
      value: "",
      options: [],
      loading: false,
    };
  },
  computed: {
    //经过格式化后的item
    initItem() {
      return Object.assign({}, defaultItem, this.item);
    },
    vuexQuery() {
      return Store.state[this.vuex_name].queryStrAnaly;
    },
  },
  watch: {
    vuexQuery: {
      handler(val) {
        var array = JSON.parse(val);
        this.value = "";
        this.accurateValue = false;
        for (var i = 0; i < array.length; i++) {
          if (this.initItem.name === array[i].name) {
            this.value = array[i].value;
            this.accurateValue = array[i].accurate;
          }
        }
      },
      deep: true,
    },
    value() {
      // 每次更改值之前先将输入建议数组清空 防止脏数据产生
      this.options = [];
    },
    //搜索框显示name
    vuexQuery: {
      handler(val) {
        var array = JSON.parse(val);
        this.value = "";
        this.accurateValue = false;
        for (var i = 0; i < array.length; i++) {
          if (this.initItem.name === array[i].name) {
            this.value = array[i].value;
            this.accurateValue = array[i].accurate;
          }
        }
      },
      deep: true,
    },
  },
  methods: {
    //获取提示词
    remoteMethod(queryString) {
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
    nameChange() {
      // if (this.initItem.value) {
      Store.commit(this.vuex_name + "/queryAnaly", {
        opt: 1,
        param: {
          name: this.initItem.name,
          label: this.initItem.label,
          accurate: this.accurateValue,
          value: this.initItem.value,
          type: this.initItem.type,
        },
      });
      Store.commit(
        this.vuex_name + "/queryStrAnaly",
        Store.state[this.vuex_name].queryAnaly
      );
      // }
    },
    resetValue(value) {
      this.initItem.value = _.trim(value);
      this.nameChange();
    },
    getEnterKey() {
      this.$emit("nomalSearch");
    },
  },
  created() {
    // 初始是否精确
    // let queryString = location.search.substring(1).split('&')
    // console.log(this.initItem)
    if (this.item.initAccurate) {
      this.accurateValue = true;
    }

    //解决左侧input搜索后，时间列表和视图分析 切换时有一个页面input为空
    try {
      var array = JSON.parse(this.vuexQuery);
      for (var i = 0; i < array.length; i++) {
        if (this.initItem.name === array[i].name) {
          this.value = array[i].value;
        }
      }
    } catch (err) {}
  },
  mounted() {},
};
</script>

<style lang="less">
@import "~@/assets/less/var.less";
.el-select-dropdown {
  max-width: 264px !important;
}
.la-auto-select {
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

  .el-select {
    width: 100%;
    outline: none;
  }
  .el-select .el-input.is-focus .el-input__inner {
    border-color: #ebeef5;
  }
}
</style>
