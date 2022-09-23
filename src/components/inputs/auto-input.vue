<template>
  <div class="la-advenced-auto-input">
    <inputPopover
      appendToBody
      ref="inputPop"
      :value="valueData"
      :accurate="accurateValue"
    >
      <!-- TODO: v-model="value"时，可以双向绑定，且可以搜索，清空后搜索也可以-->
      <div v-if="initItem.accurate === '精确'" class="jq">
        <el-autocomplete
          popper-class="autocompletePop"
          v-model="valueData"
          @keyup.native.enter="getEnterKey"
          @input="resetValue(valueData)"
          :placeholder="initItem.placeholder"
          :fetch-suggestions="querySearchAsync"
          clearable
          ref="popoverAutoInput"
        >
          <template slot-scope="{ item }">
            <div
              style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;"
              :title="item.value"
            >
              {{ item.value }}
            </div>
          </template>
        </el-autocomplete>
        <!-- 只有药物名称（需自动查询补全输入框）需要“精确” -->
        <el-checkbox @change="nameChange" v-model="accurateValue"
          >精确</el-checkbox
        >
      </div>
      <div v-else class="not-jq">
        <el-autocomplete
          popper-class="autocompletePop"
          v-model="valueData"
          @keyup.native.enter="getEnterKey"
          @input="resetValue(valueData)"
          :placeholder="initItem.placeholder"
          :fetch-suggestions="querySearchAsync"
          clearable
          ref="popoverAutoInput"
        >
          <template slot-scope="{ item }">
            <div
              style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;"
              :title="item.value"
            >
              {{ item.value }}
            </div>
          </template>
        </el-autocomplete>
      </div>
    </inputPopover>
  </div>
</template>

<script>
import inputPopover from "@/components/inputs/input-popover";
const defaultItem = {
  name: "",
  type: "text",
  label: "",
  placeholder: "",
  accurate: "",
  search_hint: "",
  value: ""
};
export default {
  components: {
    inputPopover
  },
  props: {
    vuex_name: {
      type: String,
      default() {
        return "";
      }
    },
    item: {
      type: Object,
      default() {
        return {};
      }
    },
    api_name: {
      type: String,
      default() {
        return "";
      }
    },
    value: {
      type: String,
      default() {
        return "";
      }
    },
    index: {
      type: Number
    },
    accurateCheck: {
      type: Boolean
    }
  },
  data() {
    return {
      accurateValue: this.accurateCheck,
      valueData: this.value
    };
  },
  computed: {
    //经过格式化后的item
    initItem() {
      return Object.assign({}, defaultItem, this.item);
    }
  },
  watch: {
    value(value) {
      // 每次更改值之前先将输入建议数组清空 防止脏数据产生
      this.$refs.popoverAutoInput.suggestions = [];
      this.valueData = value;
    },
    accurateCheck(val) {
      this.accurateValue = val;
    }
  },
  methods: {
    //获取提示词
    querySearchAsync(queryString, callback) {
      // 限制2个级以上的字符在做搜索提示
      if (queryString.length<2) {
        callback([]);
        return
      }
      var list = [];
      var param = Qs.parse(
        this.initItem.name + "=" + queryString.slice(0, this.inpMaxLen)
      ); // 解决参数键值不能为变量
      if (queryString.slice(0, this.inpMaxLen) == "") {
        callback([]);
        return;
      }
      let _queryString = "";
      if (_queryString != queryString) {
        _queryString = queryString;

        // search_hint有值且包含/使用传值路径请求
        let url;
        if (this.initItem.search_hint.search("/") === -1) {
          url = "/api/" + this.api_name + "/input";
        } else {
          url = "/api/" + this.initItem.search_hint;
        }

        window
          .Axios({
            methods: "get",
            url: url,
            params: _.assign(
              { accesstoken: this.vueGetCookie("accesstoken") },
              param
            )
          })
          .then(res => {
            if (res.data == "") {
              console.log(1);
              callback([]);
            } else {
              let data = [];
              for (let i = 0, l = res.data.data.length; i < l; i++) {
                data.push({ value: res.data.data[i] });
              }
              console.log(2);
              callback(data);
            }
          })
          .catch(thrown => {
            console.log("请求出错了");
            callback([]);
          });
        // this.resetValue(queryString)
      }
    },
    // handleSelect(item) {
    //   this.resetValue(item.value)
    // },
    nameChange() {
      this.$emit("updateAccurate", this.index, this.accurateValue);
    },
    resetValue(value) {
      this.$emit("updateValue", this.index, _.trim(value));
    },
    getEnterKey(el) {
      $(".autocompletePop").hide();
      this.$emit("advancedSearch");
    }
  },
  mounted() {
    this.inputPopMouseleave(this);
  }
};
</script>

<style lang="less" scoped>
.jq {
  .el-input {
    width: 250px;
  }
  .el-autocomplete {
    width: auto;
  }
}
.not-jq {
  .el-autocomplete {
    width: 100%;
  }
}
</style>
