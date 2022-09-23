<template>
  <div
    class="la-advanced"
    :class="{ 'la-advanced-policies': vuex_name == 'Policies' }"
  >
    <table class="la-table">
      <!-- conditions种的一个condition展示为一行，一行包括以下四个内容 -->
      <tr v-for="(condition, tr_index) in conditions" :key="tr_index">
        <!-- 1、逻辑选择 - AND/OR/NOT -->
        <td class="logic">
          <Select v-model="condition.logic" :option="logics" />
        </td>
        <!-- 2、类型选择 -->
        <td
          class="label"
          :class="{
            'atc-label': condition.name == 'atc' || condition.name == 'atcb',
          }"
        >
          <Select
            v-model="condition.name"
            @change="typeChange(tr_index, condition)"
            placeholder="请选择类型"
          >
            <el-option
              v-for="(label, index2) in labels"
              :label="label.label"
              :key="index2"
              :value="label.name"
            >
              <span>{{ label.label }}</span>
              <img
                src="/static/imgs/newProjectGuide/new.png"
                v-if="label['is_show_new']"
                alt=""
              />
              <!-- <NewProjectGuide v-if="label['is_show_new']" postion="高级"
                  :onlyKey="label['new_id'] + index2"
                  :newPosition="{top:-5,right:-40}"
                  compoentsName="检索功能"
                  :initItem="label"
                  :showMenban="label['is_show_new']||''"><span> </span></NewProjectGuide> -->
              <el-tooltip
                v-if="label.statement"
                effect="light"
                placement="right"
              >
                <div slot="content" v-html="label.statement"></div>
                <i class="el-icon-question cl-green"></i>
              </el-tooltip>
              <el-tooltip
                v-else-if="
                  label.label == '药理分类' && vuex_name == 'Yaopinxiaoshou'
                "
                effect="light"
                placement="right"
                content="ATC编码分类"
              >
                <i class="el-icon-question cl-green"></i>
              </el-tooltip>
            </el-option>
          </Select>
          <el-tooltip
            v-if="condition.name == 'atc' || condition.name == 'atcb'"
            effect="light"
            placement="right"
            content="ATC分类，即解剖学治疗学及化学分类系统。一个药物可能同时对应多个分类，默认为检索药物的主分类，勾选多分类时可检索多个。"
          >
            <i class="el-icon-question cl-green atc-icon"></i>
          </el-tooltip>
          <!-- {{condition.label}} -->
          <!-- {{trimFun(condition.label).length}} -->
          <!-- :newPosition="{top:-5,right:180-(condition.name.length * 15)}"  -->
          <!-- :newPosition="{top:-5,right:180-(condition.label.length * 17)}"  -->
          <NewProjectGuide
            v-if="condition['is_show_new']"
            postion="高级"
            :onlyKey="condition['new_id']"
            :newPosition="{ top: -5, right: 12.5 - condition.label.length }"
            compoentsName="检索功能"
            :initItem="condition"
            Ldanwei="em"
            :showMenban="condition['is_show_new'] || ''"
            ><span> </span
          ></NewProjectGuide>
          <!-- <NewProjectGuide :onlyKey="'c_16044688066666'+tr_index" display="inline" :initItem="''"></NewProjectGuide> -->
        </td>
        <!-- 3、输入框/选择框/日期选择框 -->
        <td class="value">
          <!-- 高级搜索项 -->
          <template
            v-for="(item, td_index) in advancedfileds"
            v-if="item.name == condition.name"
          >
            <!-- 输入框 - 含搜索提示 -->
            <AutoInput
              v-if="item.type == 'text' && item.search_hint"
              :vuex_name="vuex_name"
              :api_name="api_name"
              :label="item.label"
              :item="item"
              :index="tr_index"
              :accurateCheck="condition.accurate"
              :value="condition.value ? condition.value : ''"
              @updateValue="updateValue"
              @updateAccurate="updateAccurate"
              @advancedSearch="advancedSearch"
              :key="td_index"
              ref="iadvanced"
            >
            </AutoInput>
            <!-- 输入框 -->
            <NormalInput
              v-if="item.type == 'text' && !item.search_hint"
              :vuex_name="vuex_name"
              :label="item.label"
              :item="item"
              :index="tr_index"
              :accurateCheck="condition.accurate"
              :value="condition.value ? condition.value : ''"
              @updateValue="updateValue"
              @updateAccurate="updateAccurate"
              @advancedSearch="advancedSearch"
              :key="td_index"
              ref="iadvanced"
            >
            </NormalInput>
            <!-- 日期选择组件 -->
            <DateRange
              v-if="item.type == 'date'"
              :vuex_name="vuex_name"
              :value="condition.value ? condition.value : ''"
              :index="tr_index"
              @updateValue="updateValue"
              :key="td_index"
              ref="iadvanced"
            ></DateRange>
            <!-- 年份选择组件 -->
            <DateRangeYear
              v-if="item.type == 'date_y'"
              :vuex_name="vuex_name"
              :value="condition.value ? condition.value : ''"
              :index="tr_index"
              @updateValue="updateValue"
              :key="td_index"
              ref="iadvanced"
            ></DateRangeYear>
            <!-- 年月选择组件 -->
            <DateRangeMonth
              v-if="item.type == 'date_m'"
              :vuex_name="vuex_name"
              :value="condition.value ? condition.value : ''"
              :index="tr_index"
              @updateValue="updateValue"
              :key="td_index"
              ref="iadvanced"
            ></DateRangeMonth>
            <Select
              v-if="item.type == 'select'"
              :option="item.value"
              :valueList="
                condition.value
                  ? condition.value.split
                    ? condition.value.split('ღ')
                    : condition.value
                  : []
              "
              :index="tr_index"
              @updateValue="updateValue"
              :key="td_index"
              multiple
              collapseTags
              ref="iadvanced"
            ></Select>
            <CascaderSelect
              v-if="
                checkNameBeginWithAtc(item.name) && item.type == 'fullselect'
              "
              :vuex_name="vuex_name"
              :item="item"
              :value="condition.show ? condition.show : []"
              :option="item.value"
              :index="tr_index"
              @updateValue="updateValue"
              @changeClassify="changeClassify"
              :key="td_index"
              ref="iadvanced"
            >
            </CascaderSelect>
            <NumberRange
              v-if="item.type == 'numerical_interval'"
              :vuex_name="vuex_name"
              :item="item"
              :value="condition.value ? condition.value : ''"
              :option="item.value"
              :index="tr_index"
              @updateValue="updateValue"
              @advancedSearch="advancedSearch"
              :key="td_index"
              ref="iadvanced"
            ></NumberRange>
            <FullSelect
              v-if="
                !checkNameBeginWithAtc(item.name) && item.type == 'fullselect'
              "
              :vuex_name="vuex_name"
              :item="item"
              :value="condition.show ? condition.show : []"
              :option="item.value"
              :index="tr_index"
              @updateValue="updateValue"
              :key="td_index"
              ref="iadvanced"
            ></FullSelect>
          </template>
        </td>
        <!-- 4、添加/删除条件的操作按钮（+/-） -->
        <td class="ctrl">
          <i
            v-if="tr_index != 0"
            class="btn btn-advanced-remove el-icon-minus"
            @click="removeItem(tr_index)"
          ></i>
          <i
            class="btn btn-advanced-add el-icon-plus"
            @click="addItem(tr_index)"
          ></i>
        </td>
      </tr>
    </table>
    <!-- 高级搜索框底部 -->
    <div slot="footer" class="dialog-footer">
      <el-button @click="advancedSearch" type="primary" round class="ad-search"
        >搜 索</el-button
      >
      <el-button @click="clearItem" round class="border-color">清 空</el-button>
    </div>
  </div>
</template>

<script>
import NormalInput from "@/components/inputs/input";
import AutoInput from "@/components/inputs/auto-input";
import Select from "@/components/inputs/select";
import DateRange from "@/components/inputs/date-range";
import DateRangeYear from "@/components/inputs/date-range-year";
import DateRangeMonth from "@/components/inputs/date-range-month";
import CascaderSelect from "@/components/inputs/cascader-select";
import NumberRange from "@/components/inputs/number-range";
import FullSelect from "@/components/inputs/fullselect";
import { mapState } from "vuex";

export default {
  components: {
    NormalInput,
    AutoInput,
    Select,
    DateRange,
    DateRangeYear,
    DateRangeMonth,
    CascaderSelect,
    NumberRange,
    FullSelect,
  },
  props: {
    vuex_name: {
      default: "",
      type: String,
    },
    api_name: {
      default: "",
      type: String,
    },
    route1: {
      default: "",
      type: String,
    },
    route2: {
      default: "",
      type: String,
    },
    route3: {
      default: "",
      type: String,
    },
    route4: {
      default: "",
      type: String,
    },
    dialogFormVisible: {
      default: false,
      type: Boolean,
    },
  },
  data() {
    return {
      logics: [
        {
          label: "AND",
          value: "_and",
        },
        {
          label: "OR",
          value: "_or",
        },
        {
          label: "NOT",
          value: "_not",
        },
      ],
      conditions: [], // 高级搜索条件
      advancedLen: 6,
      cindex: 0, // 维护conditions长度
      value: [], // 存放输入值
      needInitAll: false, // initConditions方法的判断
      needClearAdvanced: false, // 单独判断清空高级搜索的变量
    };
  },
  computed: {
    advancedfileds() {
      return Store.state[this.vuex_name].advanced_filed.map((item) => {
        if (
          item.type === "select" &&
          item.accurate === "精确" &&
          item.name.indexOf("_eq") === -1
        ) {
          item.name = item.name + "_eq";
        }
        return item;
      });
    },
    normalfiled() {
      return Store.state[this.vuex_name].nomal_filed;
    },
    query() {
      return Store.state[this.vuex_name].query;
    },
    route() {
      return this.$route.path.split("/")[2];
    },
    xconditions() {
      // console.log(this.vuex_name, Store.state[this.vuex_name].conditions)
      return Store.state[this.vuex_name].conditions;
    },
    labels() {
      let labels = [];
      _.forEach(this.advancedfileds, function (el) {
        labels.push({
          name: el.name,
          label: el.label,
          statement: el.statement,
          is_show_new: el.is_show_new,
          new_content: el.new_content,
          new_type: el.new_type,
          new_id: el.new_id,
        });
      });
      return labels;
    },
    first_name() {
      return this.advancedfileds[0].name;
    },
    first_label() {
      return this.advancedfileds[0].label;
    },
  },
  watch: {
    dialogFormVisible(n) {
      if (n) {
        window.ga(
          "send",
          "event",
          "botton",
          "click",
          this.api_name + "_advanced_search_outside"
        );
        window._paq.push([
          "trackEvent",
          "button",
          "click",
          this.api_name + "_advanced_search_outside",
        ]);
        this.$refs.iadvanced.forEach((item) => {
          let popitem = item.$refs.inputPop;
          if (popitem) {
            popitem.getPopShow(popitem.value);
          }
        });
      } else {
        this.$refs.iadvanced.forEach((item) => {
          let popitem = item.$refs.inputPop;
          if (popitem) {
            popitem.popShow = false;
          }
        });
      }
    },
  },
  mounted() {
    //第一次进来没有点击事件
    window.ga(
      "send",
      "event",
      "botton",
      "click",
      this.api_name + "_advanced_search_outside"
    );
    window._paq.push([
      "trackEvent",
      "button",
      "click",
      this.api_name + "_advanced_search_outside",
    ]);
  },
  created() {
    //普通搜索有值 且 高级搜索没有值时，把普通搜索条件传进来
    this.initConditions();
  },
  methods: {
    trimFun(val) {
      return val.replace(/(^\s*)|(\s*$)/g, "");
    },
    // 是否以atc开头
    checkNameBeginWithAtc(name) {
      if (String(name).indexOf("atc") == 0) {
        return true;
      } else {
        return false;
      }
    },
    initConditions() {
      let querylen = this.query.length;
      let conditionslen = this.conditions.length;
      let labelslen = this.labels.length;
      let conditionsIsClear = true;
      let advancedIsClear = true;
      let queryHasSearch = false; // 是否属于综合搜索跳转过来的情况
      for (let item of this.query) {
        if (item.name == "comprehensive" || item.name == "searchwords") {
          queryHasSearch = true;
        }
      }

      if (labelslen < this.advancedLen) {
        // 如果初始规定的高级搜索显示条数多于高级搜索总类数，则使之相等
        this.advancedLen = labelslen;
      }

      if (!this.conditions.length) {
        conditionsIsClear = true;
        advancedIsClear = true;
      }

      for (let i = 0; i < this.conditions.length; i++) {
        if (this.conditions[i].value) {
          conditionsIsClear = false;
        }
      }

      for (let i = 0; i < this.xconditions.length; i++) {
        if (this.xconditions[i].value) {
          advancedIsClear = false;
        }
      }

      if (
        querylen != 0 &&
        !queryHasSearch &&
        this.query.every((item) => item.type !== "check") &&
        this.query.every((item) => item.type !== "policiescheck")
      ) {
        // 普通填写 & 无论高级是否填写（且不属于综合搜索跳转过来的情况下！）
        this.conditions = [];
        _.map(this.query, (item) => {
          this.conditions.push({
            logic: "_and",
            name: item.name,
            accurate: item.accurate,
            value: item.value,
            show: item.show,
            atcs_sel: item.atcs_sel,
            label: item.label,
            is_show_new: item.is_show_new,
            new_content: item.new_content,
            new_type: item.new_type,
            new_id: item.new_id,
            type: item.type,
          });
        });
      } else if (
        !advancedIsClear ||
        (!conditionsIsClear &&
          querylen == 0 &&
          conditionslen != 0 &&
          !advancedIsClear)
      ) {
        // 高级搜索还有条件在里面
        this.conditions = [];
        _.map(this.xconditions, (item) => {
          this.conditions.push({
            logic: item.logic,
            name: item.name,
            accurate: item.accurate,
            value: item.value,
            show: item.show,
            atcs_sel: item.atcs_sel,
            label: item.label,
            is_show_new: item.is_show_new,
            new_content: item.new_content,
            new_type: item.new_type,
            new_id: item.new_id,
            type: item.type,
          });
        });
      } else {
        this.conditions = [];
        // console.log(this.labels)
        for (var i = 0; i < this.advancedLen; i++) {
          let defaultcondition = {
            logic: "_and",
            name: this.labels[i].name,
            accurate: false,
            value: "",
            label: this.labels[i].label,
            is_show_new: this.labels[i]["is_show_new"],
            new_content: this.labels[i]["new_content"],
            new_type: this.labels[i]["new_type"],
            new_id: this.labels[i]["new_id"],
            type: this.labels[i].type,
          };
          this.conditions.push(defaultcondition);
        }
      }
      if (!this.conditions.length) {
        this.frontEndLog(location.href, {
          handlerTypeDesc:
            "高级搜索弹框数据记录（点击 高级搜索，没有显示数据（偶然））",
          res: {
            conditions: this.conditions,
            xconditions: this.xconditions,
            advancedfileds: this.advancedfileds,
            advancedfileds1: Store.state[this.vuex_name].advanced_filed,
          },
        });
      }
    },
    // 高级搜索 添加项（+）
    addItem(index) {
      let defaultcondition = {
        logic: "_and",
        name: this.first_name,
        accurate: false,
        value: "",
        label: this.first_label,
      };
      this.cindex++;
      this.conditions.splice(index + 1, 0, defaultcondition);
    },
    // 高级搜索 移除项（-）
    removeItem(index) {
      this.conditions.splice(index, 1);
    },
    // 高级搜素 清空
    clearItem() {
      // this.conditions = []
      // this.cindex = 0
      // this.needInitAll === true
      this.conditions = [];
      for (var i = 0; i < this.advancedLen; i++) {
        let defaultcondition = {
          logic: "_and",
          name: this.labels[i].name,
          is_show_new: this.labels[i].is_show_new,
          new_id: this.labels[i].new_id,
          new_type: this.labels[i].new_type,
          statement: this.labels[i].statement,
          new_content: this.labels[i].new_content,
          accurate: false,
          value: "",
          atcs_sel: false,
          label: this.labels[i].label,
          type: this.labels[i].type,
        };
        this.conditions.push(defaultcondition);
      }
    },
    typeChange(index, condition) {
      let conditionObj = _.find(this.labels, { name: condition.name });
      // console.log(conditionObj)
      condition.accurate = false;
      condition.value = "";
      for (var i in conditionObj) {
        condition[i] = conditionObj[i];
      }
      console.info(conditionObj, condition);
      // condition.label = conditionObj.label;
      // condition.label = conditionObj.label;
      // condition.is_show_new = conditionObj.is_show_new;
    },
    // 高级搜索 搜索
    advancedSearch() {
      this.$emit("closeAdvancedDialog"); // 关闭高级搜索框的event（closeAdvancedDialog） - 在zhuce.vue中使用
      console.log(this.conditions);
      // 处理参数
      Store.commit(this.vuex_name + "/conditions", this.conditions);

      // 清空普通搜索项
      Store.commit(this.vuex_name + "/query", []); // 仅清空了Store.state.query，但肉眼仍可见普通搜索已输入的内容
      Store.commit(this.vuex_name + "/putong", []);
      Store.commit(this.vuex_name + "/groups", {});
      Store.commit(this.vuex_name + "/shaixuan", {});
      // Store.commit(this.vuex_name + '/filters', {})
      Store.commit(this.vuex_name + "/gaoji", []);
      Store.commit(this.vuex_name + "/queryStr", "");

      console.log(this.$route);
      if (this.$route.path === "/policies/home") {
        this.$router.push({ path: "/policies/list" });
        return;
      }

      if (this.route) {
        if (this.route == this.route1) {
          Store.dispatch(this.vuex_name + "/nomalSearch");
        } else if (this.route == this.route2) {
          Store.dispatch(this.vuex_name + "/getKshRes");
        } else if (this.route == this.route3) {
          // analy_amount 获取 销售量数据
          Store.dispatch(this.vuex_name + "/getKshRes", 2);
        } else if (this.route == this.route4) {
          // analy_amount 获取 销售量数据
          Store.dispatch(this.vuex_name + "/getKshRes_Breed");
        }
      } else {
        Store.dispatch(this.vuex_name + "/nomalSearch");
      }
      window._paq.push([
        "trackEvent",
        "button",
        "click",
        this.api_name + "_advanced_search_outside",
      ]);
      window.ga(
        "send",
        "event",
        "botton",
        "click",
        this.api_name + "_advanced_search_outside"
      );
      window._paq.push([
        "trackEvent",
        "button",
        "click",
        this.api_name + "_advanced_search_inside",
      ]);
      window.ga(
        "send",
        "event",
        "botton",
        "click",
        this.api_name + "_advanced_search_inside"
      );
    },
    // 更新高级搜索输入是否精确（一般只针对**药品名称**）
    updateAccurate(index, value, clicked) {
      this.conditions[index].accurate = value;
    },
    // 更新高级搜索输入内容
    updateValue(index, value, arrVal, type) {
      // console.log(index, value, arrVal, type);
      // 判断当前筛选框的value值的length大于0的时候才去存当前的筛选值，否则就为空。（因为下拉多选框value为空的时候是一个空数组，会导致搜索的时候传给后端一个空数据）
      // 【ID1012668】【高级搜索】下拉选项检索问题
      this.conditions[index].value = value && value.length > 0 ? value : "";
      this.conditions[index].type = type;
      if (arrVal !== undefined) {
        this.conditions[index].show = arrVal;
      }
    },
    // 药理分类是否多分类（只针对药理分类）
    changeClassify(index, value) {
      console.log(this.conditions);
      this.conditions[index].atcs_sel = value;
    },
  },
};
</script>

<style lang="less">
@import "~@/assets/less/app.less";
@import "~@/assets/less/var.less";

.la-advanced {
  padding: 20px;
  width: 100%;
  box-sizing: border-box;

  .la-table {
    display: block;
    max-height: 320px;
    overflow-y: auto;
    width: 100%;

    tr {
      display: block;
      padding: 8px 0px;
    }

    .logic {
      width: 80px;
      padding-right: 30px;
    }

    .label {
      width: 240px;

      // padding-right: 30px;
      // margin-right: 30px;
      .la-advenced-select {
        width: 210px;
        display: inline-block;
      }
    }

    .value {
      width: 310px;
      padding-right: 10px;
    }

    .ctrl {
      .btn {
        transition: all 300ms;
        padding: 1px;
        margin: 0px 5px;
        border-radius: 2px;
      }

      .btn-advanced-remove {
        color: @LightGray;
        background-color: #fff;
        border: 1px solid @LightGray;
        cursor: pointer;

        &:hover {
          transition: all 300ms;
          background-color: @LightGray;
          color: #fff;
          font-weight: bold;
        }
      }

      .btn-advanced-add {
        color: @PrimaryColor;
        background-color: #fff;
        border: 1px solid @PrimaryColor;
        cursor: pointer;

        &:hover {
          transition: all 300ms;
          background-color: @PrimaryColor;
          color: #fff;
          font-weight: bold;
        }
      }
    }

    .el-input__inner {
      height: 30px;
      line-height: 30px;
      border-radius: 0px;
    }
  }

  .dialog-footer {
    .el-button.is-round {
      width: 150px;
      padding: 7px 40px;
      border-radius: 4px;
    }
  }
}

.atc-label {
  position: relative;
}

.atc-icon {
  position: absolute;
  top: 50%;
  left: 80px;
  transform: translateY(-50%);
}
</style>
