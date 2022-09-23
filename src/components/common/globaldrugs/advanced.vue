<template>
  <div class="la-advanced global-advanced">
    <div class="global-advanced-box">
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
                v-if="
                  item.type == 'text' &&
                  item.search_hint &&
                  item.name !== 'keywords'
                "
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

              <autoSelect
                v-if="item.name == 'keywords'"
                :vuex_name="vuex_name"
                :api_name="api_name"
                :item="item"
                :index="tr_index"
                :value="condition.value ? condition.value : ''"
                @updateValue="updateValue"
                @advancedSearch="advancedSearch"
                :key="td_index"
                ref="iadvanced"
              ></autoSelect>

              <!-- 输入框 -->
              <NormalInput
                v-if="
                  item.type == 'text' &&
                  !item.search_hint &&
                  item.name !== 'keywords'
                "
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

            <img @click="addItem(tr_index)" src="/static/imgs/globaldrugs/add.png" alt="" width="14">
            <img v-if="tr_index != 0"  @click="removeItem(tr_index)" src="/static/imgs/globaldrugs/reduce.png" alt="" width="14"></img>
            <!-- <i
              v-if="tr_index != 0"
              class="btn btn-advanced-remove el-icon-minus"
              @click="removeItem(tr_index)"
            ></i>
            <i
              class="btn btn-advanced-add el-icon-plus"
              @click="addItem(tr_index)"
            ></i> -->
          </td>
        </tr>
      </table>
      <!-- <div class="la-table filter-box">
        <div>
          <div
            v-for="(item, index) in conditionsFilter"
            :key="index"
            class="filter-label"
          >
            <div class="logic">
              <Select v-model="item.logic" :option="logics" />
            </div>
            <div
              class="label"
              :class="{ tabActive: tabActive === item.name }"
              @click="changeTab(item)"
            >
              {{ item.label }}
            </div>
          </div>
        </div>
        <div class="filter-search">
          <div class="" v-for="(item, index) in conditionsFilter" :key="index">
            <div
              v-show="
                item.name === tabActive && highFilters[item.name].length > 0
              "
            >
              <div
                v-if="
                  item.name === 'leixingbm' ||
                  item.name === 'indication_standard'
                "
              >
                <el-input
                  :placeholder="'输入关键字进行过滤'"
                  v-model="filterText[item.name]"
                  @input="filterChange(index, item.name)"
                  @change="filterChange(index, item.name)"
                >
                </el-input>
                <div class="high-trees">
                  <el-tree
                    :indent="6"
                    node-key="key"
                    class="filter-tree"
                    :data="highFilters[item.name]"
                    :props="{ children: 'children', label: 'label' }"
                    show-checkbox
                    :default-checked-keys="checked[item.name]"
                    :default-expanded-keys="checked[item.name]"
                    :filter-node-method="filterNode"
                    @check="
                      (data, checkTree) =>
                        checkGA2(data, checkTree, item.name, index)
                    "
                    @node-expand="nodeExpand"
                    @node-collapse="nodeCollapse"
                    :ref="'hightree' + index"
                    :check-strictly="
                      item.name !== 'leixingbm' &&
                      item.name !== 'indication_standard'
                    "
                  >
                    <span class="custom-tree-node" slot-scope="{ node, data }">
                      <span>{{ node.label }}</span>
                      <span class="num">({{ data.doc_count }})</span>
                    </span>
                  </el-tree>
                </div>
              </div>

              <el-checkbox-group v-model="checked[item.name]" v-else>
                <el-checkbox
                  v-for="(type, i) in highFilters[item.name]"
                  :label="type.key"
                  :key="i"
                  @change="checkGA(item.name, type, index)"
                >
                  <span>{{ type.label }}</span>
                  <span class="num">({{ type.doc_count }})</span>
                </el-checkbox>
              </el-checkbox-group>
            </div>
            <span
              style="color: #999"
              v-if="
                item.name === tabActive && highFilters[item.name].length <= 0
              "
              >暂无相关筛选数据</span
            >
          </div>
        </div>
      </div> -->
    </div>
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
import autoSelect from "@/components/inputs/auto-select";
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
    autoSelect,
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
      conditionsFilter: [], // 高级搜索条件筛选的搜索条件
      advancedLen: 6,
      cindex: 0, // 维护conditions长度
      value: [], // 存放输入值
      needInitAll: false, // initConditions方法的判断
      needClearAdvanced: false, // 单独判断清空高级搜索的变量
      tabActive: "leixingbm",
      filterText: {
        leixingbm: "",
        indication_standard: "",
      },
      checked: {},
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
    storeState() {
      return Store.state[this.vuex_name];
    },
    normalfiled() {
      return Store.state[this.vuex_name].nomal_filed;
    },
    highFilters() {
      // console.log(Store.state[this.vuex_name].highFilters);
      return Store.state[this.vuex_name].highFilters;
    },
    highGroups() {
      return Store.state[this.vuex_name].highGroups;
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
    // xconditionsFilter() {
    //   return Store.state[this.vuex_name].conditionsFilter;
    // },
    labels() {
      let labels = [];
      _.forEach(this.advancedfileds, function (el) {
        // if (el.type === "text" || el.type === "date") {
          labels.push({
            name: el.name,
            label: el.label,
            statement: el.statement,
            is_show_new: el.is_show_new,
            new_content: el.new_content,
            new_type: el.new_type,
            new_id: el.new_id,
          });
        // }
      });
      return labels;
    },

    filterLabels() {
      let filterLabels = [];
      _.forEach(this.advancedfileds, function (el) {
        if (el.type !== "text" && el.type !== "date") {
          filterLabels.push(el);
        }
      });
      return filterLabels;
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
          "企业版_全球药物_高级搜索"
        );
        window._paq.push([
          "trackEvent",
          "button",
          "click",
          "企业版_全球药物_高级搜索",
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
    highFilters: {
      handler() {
        this.init();
      },
      immediate: true,
    },
    highGroups: {
      handler() {
        this.filterText = {
          leixingbm: "",
          indication_standard: "",
        };
        this.init();
      },
      immediate: true,
      deep: true,
    },
  },
  mounted() {
    //第一次进来没有点击事件
    window.ga("send", "event", "botton", "click", "企业版_全球药物_高级搜索");
    window._paq.push([
      "trackEvent",
      "button",
      "click",
      "企业版_全球药物_高级搜索",
    ]);
  },
  created() {
    //普通搜索有值 且 高级搜索没有值时，把普通搜索条件传进来
    this.initConditions();
    console.log(this.conditions);
  },
  methods: {
    init() {
      // console.log(this.highGroups);
      for (let key in this.highFilters) {
        this.$set(
          this.checked,
          key,
          this.highGroups == undefined ? [] : this.highGroups[key] || []
        );
      }
      // console.log(this.checked);
    },
    checkGA2(data, checkTree, key, index) {
      // console.log(data, checkTree, key, index);
      /**
       * 获取树结构已选节点：如果是父节点下子节点全选则只获取父节点。如果父节点下的子节点未全选则只获取对应勾选的子节点。采用递归获取所需要的节点
       * @param {*} store === this.$refs.tree.store
       * @returns
       */
      let store = this.$refs["hightree" + index][0].store;
      const checkedNodes = [];
      const traverse = function (node) {
        const childNodes = node.root ? node.root.childNodes : node.childNodes;
        childNodes.forEach((child) => {
          // child.checked表示子孙节点被选中了，checked状态的节点不需要继续递归。
          if (child.checked) {
            checkedNodes.push(child.data);
          }
          // child.indeterminate 表示该节点的子孙节点部分被选中。如果是indeterminate的节点，需要继续递归这个过程
          if (child.indeterminate) {
            traverse(child);
          }
        });
      };
      traverse(store);
      this.checked[key] = [];
      checkedNodes.forEach((item) => {
        this.checked[key].push(item.key);
      });

      // console.log(checkedNodes,this.checked[key]);

      // this.$set(this.conditionsFilter, index, {
      //   ...this.conditionsFilter[index],
      //   value: this.checked[key],
      // });
      // console.log(this.conditionsFilter);
      window.ga(
        "send",
        "event",
        "option",
        "click",
        "企业版_全球药物_高级搜索_条件筛选"
      );
      window._paq.push([
        "trackEvent",
        "option",
        "click",
        "企业版_全球药物_高级搜索_条件筛选",
      ]);

      // let shaixuan = this.storeState.match_shaixuan_values_high;
      // shaixuan[key] = shaixuan[key] ? shaixuan[key] : {};
      // shaixuan[key][data.key] = data.label;
      // // console.log(shaixuan);
      // Store.commit(
      //   this.vuex_name + "/match_shaixuan_values_high",
      //   _.assign({}, this.storeState.match_shaixuan_values_high, shaixuan)
      // );
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.toLowerCase().indexOf(value.toLowerCase()) !== -1;
    },
    nodeExpand(d, a, f) {
      let start = document.querySelector(".high-trees").scrollLeft;
      let end = a.level > 1 ? a.level * 18 + 6 : 24;

      this._easeout(start, end, 2, function (value) {
        document.querySelector(".high-trees").scrollLeft = value;
      });
    },
    filterChange(index, key) {
      this.$refs["hightree" + index][0].filter(this.filterText[key]);
    },
    nodeCollapse(d, a, f) {
      let start = document.querySelector(".high-trees").scrollLeft;
      let end = (a.level > 1 ? a.level * 18 + 6 : 24) - (a.level > 1 ? 18 : 24);

      this._easeout(start, end, 2, function (value) {
        document.querySelector(".high-trees").scrollLeft = value;
      });
    },
    _easeout(start, end, rate, callback) {
      var _end = end;
      if (start == end || typeof start != "number") {
        return;
      }
      end = end || 0;
      rate = rate || 2;

      var step = function () {
        start = start + (end - start) / rate;
        if (Math.abs(start - _end) < 1) {
          callback(end, true);
          return;
        }
        callback(start, false);
        requestAnimationFrame(step);
      };
      step();
    },
    //高级筛选中的条件筛选 tab切换事件
    changeTab(item) {
      this.tabActive = item.name;
      this.filterText = {
        leixingbm: "",
        indication_standard: "",
      };
    },

    checkGA(name, data, index) {
      this.$set(this.conditionsFilter, index, {
        ...this.conditionsFilter[index],
        value: this.checked[name],
      });
      console.log(name, data);
      window.ga(
        "send",
        "event",
        "option",
        "click",
        "企业版_全球药物_高级搜索_条件筛选"
      );
      window._paq.push([
        "trackEvent",
        "option",
        "click",
        "企业版_全球药物_高级搜索_条件筛选",
      ]);

      // let shaixuan = this.storeState.match_shaixuan_values_high;

      // shaixuan[name] = shaixuan[name] ? shaixuan[name] : {};
      // shaixuan[name][data.key] = data.label;
      // // console.log(shaixuan);
      // Store.commit(
      //   this.vuex_name + "/match_shaixuan_values_high",
      //   _.assign({}, this.storeState.match_shaixuan_values_high, shaixuan)
      // );
    },

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
      // debugger
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
        this.query.every((item) => item.type !== "check")
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

      // if (this.conditionsFilter.length > 0) {
      //   this.conditionsFilter = this.conditionsFilter;
      // } else {
      //   this.conditionsFilter = [];
      //   this.conditionsFilter = _.cloneDeep(this.filterLabels);
      //   this.conditionsFilter.map((v) => {
      //     v.logic = "_and";
      //     v.value = [];
      //   });
      // }
      // console.log(this.conditionsFilter);
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

      // 清空高级搜索中的条件筛选项
      // this.conditionsFilter = [];
      // this.conditionsFilter = _.cloneDeep(this.filterLabels);
      // this.conditionsFilter.map((v, index) => {
      //   v.logic = "_and";
      //   v.value = [];
      //   if (v.name == "leixingbm" || v.name == "indication_standard") {
      //     this.$refs["hightree" + index][0].setCheckedKeys([]);
      //     // console.log(this.$refs["tree" + index]);
      //   }
      // });
      // // 清空筛选项
      // Store.commit(this.vuex_name + "/highGroups", {});
      // this.tabActive = "leixingbm";
      // console.log(this.conditionsFilter);
    },
    typeChange(index, condition) {
      let conditionObj = _.find(this.labels, { name: condition.name });
      // console.log(conditionObj)
      condition.accurate = false;
      condition.value = "";
      for (var i in conditionObj) {
        condition[i] = conditionObj[i];
      }
      // console.info(conditionObj, condition);
      // condition.label = conditionObj.label;
      // condition.label = conditionObj.label;
      // condition.is_show_new = conditionObj.is_show_new;
    },
    // 高级搜索 搜索
    advancedSearch() {
      this.$emit("closeAdvancedDialog"); // 关闭高级搜索框的event（closeAdvancedDialog） - 在zhuce.vue中使用
      // console.log(this.conditions);
      // 处理参数
      Store.commit(this.vuex_name + "/conditions", this.conditions);
      // Store.commit(this.vuex_name + "/conditionsFilter", this.conditionsFilter);
      Store.commit(this.vuex_name + "/highGroups", this.checked);
      // console.log(this.conditionsFilter);

      // 清空普通搜索项
      Store.commit(this.vuex_name + "/query", []); // 仅清空了Store.state.query，但肉眼仍可见普通搜索已输入的内容
      Store.commit(this.vuex_name + "/putong", []);
      Store.commit(this.vuex_name + "/groups", {});
      Store.commit(this.vuex_name + "/shaixuan", {});
      // Store.commit(this.vuex_name + '/filters', {})
      Store.commit(this.vuex_name + "/gaoji", []);
      Store.commit(this.vuex_name + "/queryStr", "");

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
        "企业版_全球药物_高级搜索_搜索",
      ]);
      window.ga(
        "send",
        "event",
        "botton",
        "click",
        "企业版_全球药物_高级搜索_搜索"
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

.la-advanced.global-advanced {
  padding: 0;
  width: 100%;
  box-sizing: border-box;
  .el-input__inner:focus {
    border-color: #002fa7 !important;
  }

  .global-advanced-box {
    max-height: 510px;
    overflow-y: auto;
  }

  .la-table {
    display: block;
    // max-height: 320px;
    overflow-y: auto;
    width: 100%;

    tr {
      display: block;
      padding: 5px 0px;
    }

    .logic {
      width: 70px;
      padding-right: 18px;

      .el-input__inner {
        color: #002fa7;
      }
    }

    .label {
      width: 170px;

      // padding-right: 30px;
      // margin-right: 30px;
      .la-advenced-select {
        width: 150px;
        display: inline-block;
      }

      .el-input__inner {
        background: #f2f4f9;
      }
    }

    .value {
      width: 450px;
      padding-right: 10px;

      .la-advenced-daterange {
        .el-date-editor.el-input,
        .la-advenced-daterange .el-date-editor.el-input__inner {
          width: 220px;
        }

        .el-date-editor .el-input__inner {
          padding-left: 30px;
        }

        .el-input__icon.el-icon-date {
          color: #ffa500;
        }
      }
    }

    .ctrl {
      img {
        margin-right: 5px;
        vertical-align: middle;
      }
      .btn {
        transition: all 300ms;
        padding: 1px;
        margin: 0px 5px;
        border-radius: 2px;
      }

      .btn-advanced-remove {
        color: #ffa500;
        background-color: #fff;
        border: 1px solid #dbdfe7;
        cursor: pointer;
        font-size: 12px;

        // &:hover {
        //   transition: all 300ms;
        //   background-color: @LightGray;
        //   color: #fff;
        //   font-weight: bold;
        // }
      }

      .btn-advanced-add {
        color: #ffa500;
        background-color: #fff;
        border: 1px solid #dbdfe7;
        cursor: pointer;
        font-size: 12px;

        // &:hover {
        //   transition: all 300ms;
        //   background-color: #FFA500;
        //   color: #fff;
        //   font-weight: bold;
        // }
      }
    }

    .el-input__inner {
      height: 28px;
      line-height: 28px;
      border-radius: 0px;
      padding-left: 8px;
      border-color: #f2f4f9;
      border-radius: 3px;
      color: #333;
      font-size: 13px;
    }
  }

  .filter-box {
    display: flex;
    margin-top: 30px;

    .filter-search {
      width: 560px;
      background: #f2f4f9;
      padding: 16px;
      box-sizing: border-box;

      .el-input {
        width: 240px;
        background: #ffffff;
        box-shadow: 0px 1px 5px 0px rgba(9, 20, 79, 0.1);
        border-radius: 2px;
        margin-bottom: 15px;
      }

      .el-tree {
        background: #f2f4f9;
      }

      .el-checkbox__input.is-checked .el-checkbox__inner,
      .el-checkbox__input.is-indeterminate .el-checkbox__inner {
        background-color: #fff;
        border-color: #ebeef5;
      }
      .el-checkbox__inner {
        border-color: #ebeef5;
      }
      .el-checkbox__input.is-checked + .el-checkbox__label {
        color: #002fa7;
      }
      .el-checkbox.is-checked + .custom-tree-node {
        color: #002fa7;
      }
      .el-checkbox__inner::after {
        border-color: #ffa914;
      }

      .el-tree-node > .el-tree-node__children {
        overflow: initial;
      }

      .el-tree-node__content > .el-checkbox {
        margin-right: 2px;
      }

      .el-tree-node__content > .el-tree-node__expand-icon {
        padding: 5px;
        color: #dcdfe6;
      }

      .el-tree-node__content > .el-tree-node__expand-icon.expanded {
        color: #002ea6;
      }

      .el-tree-node__content > .el-tree-node__expand-icon.is-leaf {
        color: transparent;
      }
    }

    .label {
      background: #f2f4f9;
      border-radius: 3px;
      padding-left: 8px;
      line-height: 28px;
      width: 150px;
      box-sizing: border-box;
      margin-right: 20px;
      cursor: pointer;
    }
    .filter-label {
      display: flex;
      margin-bottom: 8px;
    }

    .filter-label:last-child {
      margin-bottom: 0;
    }

    .tabActive {
      color: #002fa7;
    }
    .item-title {
      display: block;
      height: 30px;
      padding-left: 10px;
      line-height: 30px;
      font-size: @FontSize;
      background-color: @SerchBackgroundColor;
      color: #333;
    }

    .item {
      padding-bottom: 10px;
    }

    .el-collapse {
      border: 0px;
    }

    /deep/ .el-collapse-item__content {
      padding-bottom: 0;
      font-size: @FontSizeSmall;
    }

    .all-group {
      max-height: none !important;
    }

    .el-collapse-item {
      padding: 0px 14px 0 10px;

      .el-checkbox-group {
        // max-height: 21.5 * 6px;
        // /*5是与FILTER_DEFAULT_SHOW_LENGTH的值保持一致*/
        // overflow-y: hidden;

        &.all-group {
          max-height: none;
        }
      }

      .el-checkbox-group.yaowuhuaxiang {
        max-height: none;
      }

      &:last-child {
        .el-collapse-item__header {
          border: 0px;
        }
      }

      /deep/.el-collapse-item__header {
        height: 30px;
        line-height: 30px;
        border-bottom: 1px dashed #dfe5f1;
        margin-bottom: 1px;
        color: #333;
        font-size: @FontSizeSmall;

        &.is-active {
          color: @PrimaryColor;
          border-bottom: none;

          .header-icon {
            color: @PrimaryColor;
          }
        }
      }

      /deep/.el-collapse-item__wrap {
        border-bottom: 1px dashed #f2f4f9;
      }

      /deep/.el-collapse-item__arrow {
        line-height: 30px;
        margin-right: 0;
      }
    }

    /deep/.el-tree-node > .el-tree-node__children {
      overflow: initial;
    }

    /deep/.el-tree-node__content > .el-checkbox {
      margin-right: 2px;
    }

    /deep/.el-tree-node__content > .el-tree-node__expand-icon {
      padding: 5px;
    }

    /deep/.el-input__inner {
      height: 26px;
      font-size: 12px;
      margin-bottom: 5px;
      padding: 0 10px;
    }

    .trees-loading {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.7);
      z-index: 9;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .high-trees {
      position: relative;
      // max-height: 266px;
      // overflow: auto;
    }

    .el-checkbox {
      display: block;
      margin-top: 0;

      .el-checkbox__label {
        font-size: 12px;
      }
    }

    .el-checkbox + .el-checkbox {
      margin-left: 0px;
    }

    .num {
      color: @FontColor3;
    }

    .controls {
      padding: 10px 0px;
    }

    .control-filter {
      padding: 4px 15px;
      border-radius: 4px;
    }
  }
  .el-dialog .el-dialog__body {
    padding: 0;
  }
  .dialog-footer {
    text-align: right;
    padding-right: 20px;
    .el-button.is-round {
      padding: 0;
      width: 80px;
      height: 28px;
      line-height: 28px;
      text-align: center;
      border-radius: 3px;
    }

    .ad-search {
      background-color: #002fa7;
      border-color: #002fa7;
    }

    .border-color {
      background: #c0c4cc;
      color: #ffffff;
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
