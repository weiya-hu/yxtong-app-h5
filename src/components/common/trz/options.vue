<template>
  <div
    class="la-optioned clearfix"
    :class="{
      'option-min-height': minHeight,
      'option-show':
        Object.keys(storeState.putong).length ||
        (storeState.shaixuan && storeState.shaixuan.filter_condition) || (storeState.fourth && storeState.fourth.fourth_condition)
    }"
  >
    <!-- 已选条件：普通搜索 -->
    <div
      class="optioned main"
      v-if="
        Object.keys(storeState.putong).length ||
          (storeState.shaixuan && storeState.shaixuan.filter_condition) || (storeState.fourth && storeState.fourth.fourth_condition)
      "
    >
      <div style="flex: 1;margin-right: 10px;">
        <span
          v-if="(storeState.fourth_checked || {}) && storeState.fourth.fourth_condition"
          class="show-options glcx-option"
          title="关联查询">
          <span class="btn option">
            <span class="tj">关联查询</span>
          </span>
        </span>
        <!-- 普通搜索 -->
        <span
          v-for="(option, key, index) in storeState.putong
            ? handlePutong(storeState.putong)
            : {}"
          :key="index"
          class="show-options pt-option"
          :title="getPutongCnameRight(option, key)"
          v-if="key !== 'trzType'"
        >
          <span class="btn option">
            <span class="tj">
              <span class="title">{{ getPutongCnameLeft(key) }}：</span
              >{{ handleCutLength(getPutongCnameRight(option, key)) }}</span
            >
            <!-- <span class="el-icon-close" @click="handlePutongCloseClick(key)"></span> -->
          </span>
        </span>

        <!-- 条件筛选 -->
        <span
          class="screen"
          v-if="storeState.shaixuan && storeState.shaixuan.filter_condition"
        >
          <span
            class="btn option"
            v-for="(option, index) in getShaixuan(
              storeState.shaixuan.filter_condition
                ? storeState.shaixuan.filter_condition
                : ''
            )"
            :key="index"
            :title="option.value"
          >
            <span class="tj">
              <span class="title"
                >{{ getShaixuanCnameLeft(option.name) }}：</span
              >{{ handleCutLength(option.value) }}</span
            >
            <!-- <span class="el-icon-close" @click="handleShaixuanCloseClick(option.name)"></span> -->
          </span>
        </span>
      </div>
      <!-- 清空 -->
      <div
        class="wrap-add-del"
        v-if="
          Object.keys(storeState.putong).length ||
            (storeState.shaixuan && storeState.shaixuan.filter_condition) || (storeState.fourth && storeState.fourth.fourth_condition)
        "
      >
        <span class="clear-options" @click="handleAllCloseClick"
          ><i class="el-icon-delete pr5"></i> 清除所有筛选条件</span
        >
      </div>
    </div>
    <slot></slot>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  props: {
    vuex_name: {
      // 必须！
      type: String,
      default: ""
    },
    minHeight: {
      //列表有tabs为false，列表无tabs为true
      type: Boolean
    }
  },
  data() {
    return {
      route: this.$route.path.split("/")[2]
    };
  },
  computed: {
    // ...mapState({
    //   storeState: state => state[this.vuex_name]
    // }),
    storeState() {
      return Store.state[this.vuex_name];
    }
  },
  watch: {
    $route() {
      this.route = this.$route.path.split("/")[2];
    }
  },
  methods: {
    handleCutLength(str) {
      let len = String(str).length;
      let arr = [];
      let ret = "";
      if (len > 40) {
        arr = String(str).split("");
        arr.splice(40, len - 40, "...");
        ret = arr && arr.join("");
      } else {
        ret = str;
      }

      //已选条件的筛选值显示为数字的日志埋点
      let obj = {
        handlerType: "click",
        handlerTypeDesc: "筛选条件查询问题（显示数字、吉非替尼查询为空）",
        filter: str,
        token: GETCOOKIEFUN("accesstoken")
      };
      this.frontEndLog(this.$route.path, obj);
      return ret;
    },
    handlePutong(options) {
      let final = {};
      let putongHasSearch = false;
      let the_key = "";

      if (putongHasSearch) {
        _.set(final, the_key, options["searchwords"]);
      }

      // 除综合搜索外的其他普通搜索
      for (let key in options) {
        if (
          key != "comprehensive" &&
          key != "searchwords" &&
          key != "atcs_sel"
        ) {
          _.set(final, key, options[key]);
        }
      }
      // 由于联级选择的特殊性，在返回前还需要再次处理
      return final;
    },
    advancedOptionedLogic(logic) {
      switch (logic) {
        case "_and":
          return "AND";
          break;
        case "_or":
          return "OR";
          break;
        case "_not":
          return "NOT";
          break;
      }
    },
    // 普通 主标题的英文名 返回 中文名
    getPutongCnameLeft(option) {
      if (option === "trzType") return;
      let putong = this.storeState.putong;
      if (this.storeState.nomal_filed.length === 0) {
        return "";
      }
      for (let key in this.storeState.match_putong) {
        if (_.replace(option, "_eq", "") == key) {
          let sign = option.indexOf("_eq") > -1 ? "(精确)" : "";
          if (key === "atc") {
            sign = putong.atcs_sel === 1 ? "(多分类)" : "";
          }
          return this.storeState.match_putong[key] + sign;
        }
      }
    },
    getPutongCnameRight(option, key) {
      // 因为精确搜索在字段名后面加了_eq导致匹配不上，所以这里先判断_eq存在先删除_eq在比较
      if (key.indexOf("_eq")) {
        key = key.replace("_eq", "");
      }
      let subQuery = this.storeState.queryStr
        ? JSON.parse(this.storeState.queryStr)
        : "";
      let isSel;
      for (let i = 0; i < subQuery.length; i++) {
        let item = subQuery[i];
        if (item.value == option && item.selectLabel) {
          isSel = true;
          option = item.selectLabel;
        } else if (key === item.name && item.type === "check") {
          return;
        } else if (key === item.name && item.type === "fullselect") {
          isSel = true;
          // 选项类型为fullselect多级下拉且name不为atc的时候需要特殊处理
          // normal_val用于存储过滤后value对应的lable值
          let normal_val = [];
          // 将value值转换为数组，便于后续操作
          item.value = item.value.split("⊙");
          for (let index in item.value) {
            // 遍历普通搜索列表数据
            this.storeState.nomal_filed.map(val => {
              // 匹配普通搜索列表数据和当前选中项name相等的项
              if (item.name === val.name) {
                // 调用 获取普通搜索多级下拉中文label值的方法
                this.getPutongZh(val.value, item.value, normal_val, index);
              }
            });
          }
          option = normal_val.join(">");
        } else {
          isSel = false;
        }
      }
      if (!isSel) {
        option = String(option).replace(/⊙/g, ">");
        option = String(option).replace(/ღ/g, "，");
      }
      return option;
    },

    // 获取普通搜索多级下拉中文label值
    getPutongZh(data, value_arr, normal_val, index) {
      // 根据value值过滤对应的label值，只需要对应的label值
      for (var i = 0, len = data.length; i < len; i++) {
        // 匹配对应的value值
        if (data[i].value == value_arr[index]) {
          // value_arr[index] = data[i].label
          // 将匹配到的label值push到normal_val，用于保存匹配项的数据
          normal_val.push(data[i].label);
        }
        // 因children层级无限制，所以采用递归
        if (data[i].children) {
          this.getPutongZh(data[i].children, value_arr, normal_val, index);
        }
      }
    },

    // 将条件筛选中的拼音替换为对应的中文
    getShaixuanCnameLeft(option) {
      if (this.vuex_name === "Database") {
        let baseObj = _.find(this.storeState.filters1, { name: option });
        return baseObj.label;
      } else {
        for (let key in this.storeState.match_shaixuan) {
          if (option == key) {
            return this.storeState.match_shaixuan[key];
          }
        }
      }
    },
    // 由于groupsOptions.filter_condition是所有条件形成的字符串，需要用此方法处理返回一个数组来循环
    getShaixuan(f_condition) {
      let str = f_condition;
      let arr = str.split(" _and ");
      let shaixuanArr = [];
      for (let i = 0; i < arr.length; i++) {
        let name = arr[i].split("=")[0];
        let value = arr[i].split("=")[1];
        let value_arr = value.split("ღ");
        // filters_val用于存储过滤后key对应的lable值
        let filters_val = [];
        name = this.vuex_name === "Database" ? name.replace("_eq", "") : name;
        for (let index in value_arr) {
          // debugger
          if (Object.keys(this.storeState.match_shaixuan_values).length && name!=='technology') {
            // value_arr[index] = this.storeState.match_shaixuan_values[name][value_arr[index]]
            filters_val[index] = this.storeState.match_shaixuan_values[name][
              value_arr[index]
            ];
          } else {
            for (let key in this.storeState.filters) {
              if (name == key) {
                // 调用获取条件筛选中文名的方法
                this.getFliterZh(
                  this.storeState.filters[key],
                  value_arr,
                  filters_val,
                  index
                );
              }
            }
          }
        }
        value = filters_val.join("，");
        shaixuanArr.push({ name: name, value: value });
      }
      return shaixuanArr;
    },

    // 获取条件筛选中文名（label）的方法
    getFliterZh(data, value_arr, filters_val, index) {
      // 根据key值过滤对应的label值，只需要对应的label值
      for (var i = 0, len = data.length; i < len; i++) {
        // 匹配对应的key值
        if (data[i].key == value_arr[index]) {
          // value_arr[index] = data[i].label
          // 将匹配到的label值push到filters_val，用于保存匹配项的数据
          filters_val.push(data[i].label);
        }
        // 因children层级无限制，所以采用递归
        if (data[i].children) {
          this.getFliterZh(data[i].children, value_arr, filters_val, index);
        }
      }
    },
    handleAllCloseClick() {
      console.log($(".keywords"));
      $(".keywords").val();
      console.log(this.storeState.putong);
      if (this.storeState.query) {
        Store.commit(this.vuex_name + "/query", []);
      }
      if (this.storeState.putong) {
        Store.commit(this.vuex_name + "/putong", {});
      }
      if (this.storeState.groups) {
        this.storeState.groups = {};
        Store.commit(this.vuex_name + "/groups", []);
      }
      if (this.storeState.fourth_checked) {
        this.storeState.fourth_checked = {}
        Store.commit(this.vuex_name + "/fourth_checked", {})
      }
      if (this.storeState.fourth) {
        this.storeState.fourth = {}
        Store.commit(this.vuex_name + "/fourth", {})
      }
      Store.commit(this.vuex_name + "/shaixuan", {});
      Store.commit(this.vuex_name + "/queryStr", this.storeState.query);
      Store.dispatch(this.vuex_name + "/nomalSearch", this.storeState.putong);
    }
  },
  mounted() {}
};
</script>

<style lang="less" scoped>
@import "~@/assets/less/app.less";
@import "~@/assets/less/var.less";

/* 已选条件 - 样式 start */
.la-optioned {
  padding: 0 20px 0px 20px;
  background-color: #fff;
  .btn {
    display: inline-block;
    box-sizing: border-box;
    height: 24px;
    padding: 0px 6px;
    margin-right: 14px;
    line-height: 24px;
    border-radius: 4px;
    color: @White;
  }
  .optioned {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid #dae0e9;
    box-sizing: border-box;

    .option {
      box-sizing: border-box;
      font-size: 13px;
      color: @FontColor;
      display: inline-block;
      .tj {
        display: inline-block;
        color: #333;

        .title {
          color: #999;
        }
      }
    }
    .show-options {
      .option-logic {
        display: inline-block;
        color: #c0c4cf;
      }
    }
  }
  .wrap-add-del {
    display: inline-block;
    .clear-options {
      color: #3556b9;
      font-size: 13px;
      cursor: pointer;
      &:hover {
        text-decoration: underline;
      }
    }
  }
}
/* 已选条件 - 样式 end */
</style>
