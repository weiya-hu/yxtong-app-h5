<template>
  <div class="la-optioned clearfix globaldrugs-analy-optioned" :class="{
    'option-min-height': minHeight,
    'option-show':
      Object.keys(storeState.putongAnaly).length ||
      // (storeState.gaoji && storeState.gaoji.words) ||
      // (storeState.gaojifilter && storeState.gaojifilter.filterWords) ||
      // (storeState.fourth && storeState.fourth.fourth_condition) ||
      // (storeState.hot && storeState.hot.hot_condition) ||
      (storeState.shaixuanAnaly && storeState.shaixuanAnaly.filter_condition) ||
      (storeState.filtersSource &&
        storeState.filtersSource.filter((item) => item.checked !== 0).length >
        0),
  }">
    <!-- 保存条件 - 输入名称 弹出框 -->
    <el-dialog class="dialog-saved" :visible.sync="savedPopVisible" :append-to-body="true">
      <div slot="title" class="dialog-header">保存条件</div>
      <SavedPop @closeSavedPop="() => (savedPopVisible = false)" :vuex_name="vuex_name"></SavedPop>
    </el-dialog>
    <!-- 已选条件：普通搜索/高级搜索 合并显示 -->
    <div class="optioned main" v-if="
      Object.keys(storeState.putongAnaly).length ||
      // (storeState.gaoji && storeState.gaoji.words) ||
      // (storeState.gaojifilter && storeState.gaojifilter.filterWords) ||
      // (storeState.fourth && storeState.fourth.fourth_condition) ||
      // (storeState.hot && storeState.hot.hot_condition) ||
      (storeState.shaixuanAnaly && storeState.shaixuanAnaly.filter_condition) ||
      (storeState.filtersSource &&
        storeState.filtersSource.filter((item) => item.checked !== 0).length >
        0)
    ">
      <!-- <span
        v-if="Object.keys(storeState.putongAnaly).length || (storeState.gaoji && storeState.gaoji.words) || (storeState.fourth && storeState.fourth.fourth_condition)"
        class="iconfont">&#xe615;</span> -->
      <!-- 关联查询搜索 -->
      <span style="color: #333333;font-size: 14px;">已选条件：</span>
      <!-- <span v-if="
        (storeState.fourth_checked || {}) &&
        storeState.fourth.fourth_condition
      " class="show-options glcx-option" title="关联查询">
        <span class="btn option">
          <span class="tj">关联查询</span>
          <img src="~@/assets/imgs/globaldrugs/option_icon.png" width="12" class="icon-close"
            @click="handleFourthCloseClick()" />
        </span>
      </span> -->
      <!-- 普通搜索 -->
      <span v-for="(option, key, index) in storeState.putongAnaly
      ? handlePutong(storeState.putongAnaly)
      : {}" :key="index" class="show-options pt-option" :title="getPutongCnameRight(option, key)">
        <!-- <span class="option-logic">AND</span> -->
        <span class="btn option">
          <!-- getPutongCnameLeft(key)+' : '+ -->
          <span class="tj">{{
              getPutongCnameLeft(key) +
              " : " +
              handleCutLength(getPutongCnameRight(option, key))
          }}</span>
          <img src="~@/assets/imgs/globaldrugs/option_icon.png" class="icon-close" width="12"
            @click="handlePutongCloseClick(key)" />
        </span>
      </span>
      <!-- 高级搜索 -->
      <span v-for="(option, index) in storeState.conditionsAnaly
      ? storeState.conditionsAnaly
      : []" :key="index" v-if="
    option.value
      ? option.value instanceof String
        ? Boolean(option.value)
        : Boolean(option.value.length)
      : false
  " class="show-options gj-option" :title="getGaojiCnameRight(option.value, option.name, option)">
        <!-- <span class="option-logic">{{advancedOptionedLogic(option.logic)}}</span> -->
        <span class="btn option">
          <!-- getGaojiCnameLeft(option.name, option.accurate, option.atcs_sel)+' : '+ -->
          <span class="tj">{{
              getGaojiCnameLeft(option.name, option.accurate, option.atcs_sel) +
              " : " +
              handleCutLength(
                getGaojiCnameRight(option.value, option.name, option)
              )
          }}</span>
          <img src="~@/assets/imgs/globaldrugs/option_icon.png" class="icon-close" width="12"
            @click="handleGaojiCloseClick(option)" />
        </span>
      </span>

      <!-- 全球药物高级搜索中的条件筛选 -->
      <!-- <span v-for="(option, index) in storeState.conditionsAnalyFilter
      ? storeState.conditionsAnalyFilter
      : []" :key="index" v-if="
    (option.value
      ? option.value instanceof String
        ? Boolean(option.value)
        : Boolean(option.value.length)
      : false) && vuex_name == 'Globaldrugs'
  " class="show-options gj-option">
        <span class="btn option">
          <span class="tj">
            {{ option.label +
                " : " +
                handleCutLength(
                  getGaojiFilterCnameRight(option.value, option.name, option)
                )
            }}</span>
          <img src="~@/assets/imgs/globaldrugs/option_icon.png" class="icon-close" width="12"
            @click="handleGaojiCloseClick(option)" />
        </span>
      </span> -->

      <!-- 热点筛选 -->
      <!-- <div class="optioned screen" v-if="
        storeState.hot &&
        storeState.hot.hot_condition &&
        getHot(storeState.hot.hot_condition)
      ">
        <span class="show-options hot-option" :title="
          getHot(
            storeState.hot.hot_condition ? storeState.hot.hot_condition : ''
          )
        ">
          <span class="btn option">
            <span class="tj">
              {{
                  " 热点搜索: " +
                  handleCutLength(getHot(storeState.hot.hot_condition))
              }}</span>
            <img src="~@/assets/imgs/globaldrugs/option_icon.png" width="12" class="icon-close"
              @click="handleHotCloseClick" />
          </span>
        </span>
      </div> -->

      <!-- 条件筛选 -->
      <div class="optioned screen" v-if="storeState.shaixuanAnaly && storeState.shaixuanAnaly.filter_condition">
        <!-- <span class="label iconfont">&#xe647;</span> -->
        <span class="btn option" v-for="(option, index) in getShaixuan(
          storeState.shaixuanAnaly.filter_condition
            ? storeState.shaixuanAnaly.filter_condition
            : ''
        )" :key="index" :title="option.value">
          <!-- getShaixuanCnameLeft(option.name)+' : '+ -->
          <span class="tj">{{
              getShaixuanCnameLeft(option.name) +
              " : " +
              handleCutLength(option.value)
          }}</span>
          <img src="~@/assets/imgs/globaldrugs/option_icon.png" width="12" class="icon-close"
            @click="handleShaixuanCloseClick(option.name)" />
        </span>
      </div>

      <!-- 全球上市条件筛选国家或地区特殊处理 -->
      <div class="optioned screen" v-if="
        storeState.filtersSource &&
        storeState.filtersSource.filter((item) => item.checked !== 0).length >
        0
      ">
        <span class="btn option">
          <span class="tj">国家或地区 :
            <span :title="
              getSourceText(
                storeState.filtersSource.filter((item) => item.checked !== 0)
              )
            ">
              {{
                  handleCutLength(
                    getSourceText(
                      storeState.filtersSource.filter(
                        (item) => item.checked !== 0
                      )
                    )
                  )
              }}
            </span>
          </span>
          <img src="~@/assets/imgs/globaldrugs/option_icon.png" width="12" class="icon-close"
            @click="handleSourceCloseClick" />
        </span>
      </div>
      <!-- 保存 & 清空 -->
      <div class="wrap-add-del" v-if="
        Object.keys(storeState.putongAnaly).length ||
        // (storeState.gaoji && storeState.gaoji.words) ||
        // (storeState.gaojifilter && storeState.gaojifilter.filterWords) ||
        // ((storeState.fourth_checked || {}) &&
        //   storeState.fourth.fourth_condition) ||
        // (storeState.hot_checked &&
        //   storeState.hot.hot_condition &&
        //   getHot(storeState.hot.hot_condition)) ||
        (storeState.shaixuanAnaly && storeState.shaixuanAnaly.filter_condition) ||
        (storeState.filtersSource &&
          storeState.filtersSource.filter((item) => item.checked !== 0)
            .length > 0)
      ">
        <!-- <span class="btn save-options" @click="() => (savedPopVisible = true)">保存</span> -->
        <span class="btn clear-options" @click="handleAllCloseClick">清空</span>
      </div>
    </div>

    <!--
      试试智能分析(部分含有) - slot插槽（可参考药品销售数据库示例，截止9月30日，暂时只有药品销售/药品中标/生物制品这三个数据库有定量分析）
     -->
    <!-- <slot
      class="zn-analy fr"
      v-if="(Object.keys(storeState.putongAnaly).length || (storeState.gaoji && storeState.gaoji.words) || (storeState.fourth && storeState.fourth.fourth_condition) || (storeState.shaixuanAnaly && storeState.shaixuanAnaly.filter_condition)) && ($route.path == '/'+dbname+'/'+route2)">
    </slot> -->
    <!-- 智能分析系统开发前，定量分析在智能分析页面一直显示 -->
    <slot></slot>
  </div>
</template>

<script>
import SavedPop from "@/components/common/saved-pop";
import { mapState } from "vuex";
export default {
  props: {
    vuex_name: {
      // 必须！
      type: String,
      default: "",
    },
    dbname: {
      // 没有定量分析不要绑定此属性！（可参考药品销售数据库示例，截止9月30日，暂时只有药品销售/药品中标/生物制品这三个数据库有定量分析）
      type: String,
      default: "",
    },
    route1: {
      // 同route2，route3，含有可视化分析才绑定这三个属性（比如注册有list/analy/qb，而其他大多数只有两个属性，route3不绑定）
      type: String,
      default: "",
    },
    route2: {
      type: String,
      default: "",
    },
    route3: {
      type: String,
      default: "",
    },
    route4: {
      type: String,
      default: "",
    },
    minHeight: {
      //列表有tabs为false，列表无tabs为true
      type: Boolean,
    },
  },
  components: {
    SavedPop,
  },
  data() {
    return {
      route: this.$route.path.split("/")[2],
      savedPopVisible: false,
    };
  },
  computed: {
    // ...mapState({
    //   storeState: state => state[this.vuex_name]
    // }),
    storeState() {
      return Store.state[this.vuex_name];
    },
  },
  watch: {
    $route() {
      this.route = this.$route.path.split("/")[2];
    },
  },
  methods: {
    handleCutLength(str) {
      let len = String(str).length;
      let arr = [];
      let ret = "";
      if (len > 40) {
        arr = String(str).split("");
        arr.splice(40, len - 40, "...");
        ret = arr.join("");
      } else {
        ret = str;
      }

      //已选条件的筛选值显示为数字的日志埋点
      let obj = {
        handlerType: "click",
        handlerTypeDesc: "筛选条件查询问题（显示数字、吉非替尼查询为空）",
        filter: str,
        token: GETCOOKIEFUN("accesstoken"),
      };
      this.frontEndLog(this.$route.path, obj);
      return ret;
    },
    handlePutong(options) {
      let final = {};
      let putongHasSearch = false;
      let the_key = "";

      // 先将综合搜索set进对象中，确保循环时显示在第一位
      for (let key in options) {
        if (key == "comprehensive") {
          the_key = "comprehensive_" + options[key];
          putongHasSearch = true;
          break;
        }
      }
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
      let putong = this.storeState.putongAnaly;
      if (this.storeState.nomal_filedAnaly.length === 0) {
        return "";
      }
      for (let key in this.storeState.match_putongAnaly) {
        if (_.replace(option, "_eq", "") == key) {
          let sign = option.indexOf("_eq") > -1 ? "(精确)" : "";
          if (key === "atc") {
            sign = putong.atcs_sel === 1 ? "(多分类)" : "";
          }
          return this.storeState.match_putongAnaly[key] + sign;
        }
      }
    },
    getPutongCnameRight(option, key) {
      // 因为精确搜索在字段名后面加了_eq导致匹配不上，所以这里先判断_eq存在先删除_eq在比较
      if (key.indexOf("_eq")) {
        key = key.replace("_eq", "");
      }
      let subQuery = this.storeState.queryStrAnaly
        ? JSON.parse(this.storeState.queryStrAnaly)
        : "";
      let isSel;
      for (let i = 0; i < subQuery.length; i++) {
        let item = subQuery[i];
        if (item.value == option && item.selectLabel) {
          isSel = true;
          option = item.selectLabel;
        } else if (key === item.name && item.type === "check") {
          isSel = true;
          option = "是";
        } else if (
          key === item.name &&
          item.type === "fullselect" &&
          item.name !== "atc"
        ) {
          isSel = true;
          // 选项类型为fullselect多级下拉且name不为atc的时候需要特殊处理
          // normal_val用于存储过滤后value对应的lable值
          let normal_val = [];
          // 将value值转换为数组，便于后续操作
          item.value = item.value.split("⊙");
          for (let index in item.value) {
            // 遍历普通搜索列表数据
            this.storeState.nomal_filedAnaly.map((val) => {
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

    // 高级 主标题的英文名 返回 中文名
    getGaojiCnameLeft(option, isAccurate, atcs_sel) {
      // for (let key in this.storeState.match_gaoji) {
      //   if (option == key) {
      //     let sign = isAccurate ? '(精确)' : atcs_sel ? '(多分类)' : ''
      //     return this.storeState.match_gaoji[key] + sign
      //   }
      // }
      let left_name = "";
      let type = "";
      /* if (label) {
          let sign = isAccurate ? '(精确)' : atcs_sel ? '(多分类)' : ''
          left_name = label+sign
        }else{ */
      this.storeState.advanced_filed.forEach((item) => {
        if (option === item.name) {
          let sign = isAccurate ? "(精确)" : atcs_sel ? "(多分类)" : "";
          left_name = item.label + sign;
          type = item.type;
        }
      });
      //}

      return left_name;
    },
    // 高级 已选的label
    getGaojiCnameRight(option, name, obj) {
      console.log(option, name, obj)
      if (_.isArray(option)) {
        // select组件
        let arr = [];
        for (let val of option) {
          for (let ad_option of this.storeState.advanced_filed) {
            if (name == ad_option.name) {
              for (let op_val of ad_option.value) {
                if (op_val.value == val) {
                  arr.push(op_val.label);
                }
              }
            }
          }
        }
        let str = arr.join("，");
        return str;
      } else if (obj.type === "fullselect") {
        // 多级下拉组件
        // 将value值转换为数组，便于后续操作
        option = option.split("⊙");
        let filters_val = [];
        for (let index in option) {
          // 遍历普通搜索列表数据
          this.storeState.advanced_filed.map((val) => {
            // 匹配普通搜索列表数据和当前选中项name相等的项
            if (name === val.name) {
              // 调用 获取普通搜索多级下拉中文label值的方法
              this.getPutongZh(val.value, option, filters_val, index);
            }
          });
        }
        return filters_val.join(",");
      } else {
        // 非select组件 - 字符串
        option = option.replace(/⊙/g, ">");
        option = option.replace(/ღ/g, "，");
        return option;
      }
    },

    // 全球药物高级搜索中的条件筛选 已选的label
    getGaojiFilterCnameRight(option, name, obj) {
      console.log(option, name, obj);
      if (name !== 'leixingbm' && name !== 'indication_standard') {
        let arr = [];
        for (let val of option) {
          for (let ad_option in this.storeState.highFilters) {
            if (name == ad_option) {
              for (let op_val of this.storeState.highFilters[ad_option]) {
                if (op_val.key == val) {
                  arr.push(op_val.label);
                }
              }
            }
          }
        }
        let str = arr.join("，");
        return str;
      } else {

      }
    },

    // 获取高级搜索多级下拉中文label值
    getGaojiZh(data, option, filters_val) {
      // 根据option值过滤对应的label值，只需要对应的label值
      for (var i = 0, len = data.length; i < len; i++) {
        // 匹配option对应的label值
        if (option == data[i].value) {
          // 将匹配到的label值push到filters_val，用于保存匹配项的数据
          filters_val.push(data[i].label);
        }
        // 因children层级无限制，所以采用递归
        if (data[i].children) {
          this.getGaojiZh(data[i].children, option, filters_val);
        }
      }
      // console.log(data, option, filters_val)
    },

    // 将条件筛选中的拼音替换为对应的中文
    getShaixuanCnameLeft(option) {
      if (this.vuex_name === "Database") {
        let baseObj = _.find(this.storeState.filters1Analy, { name: option });
        return baseObj.label;
      } else {
        for (let key in this.storeState.match_shaixuanAnaly) {
          if (option == key) {
            return this.storeState.match_shaixuanAnaly[key];
          }
        }
      }
    },
    // 由于groupsAnalyOptions.filter_condition是所有条件形成的字符串，需要用此方法处理返回一个数组来循环
    getShaixuan(f_condition) {
      console.log(f_condition);
      // 因为注册库百办理状态是由两个字段组成，传参跟其他条件筛选存在差异，所以这里需要单独做操作。
      if (f_condition.indexOf("zhuangtaiStr=zhuangtai:") > -1) {
        f_condition = f_condition.replace(
          "zhuangtaiStr=zhuangtai:",
          "zhuangtai="
        );
      }

      if (f_condition.indexOf(";guifanzhuangtaizhongwen:") > -1) {
        f_condition = f_condition.replace(";guifanzhuangtaizhongwen:", "ღ");
      }

      if (f_condition.indexOf("zhuangtaiStr=guifanzhuangtaizhongwen:") > -1) {
        f_condition = f_condition.replace(
          "zhuangtaiStr=guifanzhuangtaizhongwen:",
          "zhuangtai="
        );
      }
      console.log(f_condition);
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
          if (
            Object.keys(this.storeState.match_shaixuan_valuesAnaly).length &&
            name !== "leixingbm" &&
            name !== "indication_standard"
          ) {
            // value_arr[index] = this.storeState.match_shaixuan_valuesAnaly[name][value_arr[index]]
            console.log(this.storeState.match_shaixuan_valuesAnaly);
            if (this.storeState.match_shaixuan_valuesAnaly[name]) {
              filters_val[index] =
                this.storeState.match_shaixuan_valuesAnaly[name][value_arr[index]];
            }
          } else {
            for (let key in this.storeState.filtersAnaly) {
              if (name == key) {
                // for (let one_val of this.storeState.filtersAnaly[key]) {
                //   if (one_val.key == value_arr[index]) {
                //     value_arr[index] = one_val.label
                //   }
                // }
                // 调用获取条件筛选中文名的方法
                this.getFliterZh(
                  this.storeState.filtersAnaly[key],
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

    //获取热门
    getHot(h_condition) {
      console.log(h_condition);
      let str = h_condition;
      let arr = str.split(" _and ");
      let hotArr = [];
      for (let i = 0, l = arr.length; i < l; i++) {
        let key = arr[i].split("=")[0];
        let value = arr[i].split("=")[1];
        let value_arr = value.split("ღ");
        let fileds = this.storeState.hot_filter_filedCopy[key];
        for (let j = 0, len = value_arr.length; j < len; j++) {
          if (fileds) {
            for (let index = 0, len = fileds.length; index < len; index++) {
              if (value_arr[j] == fileds[index].key) {
                hotArr.push(fileds[index].label);
              }
            }
          }
        }
      }
      return hotArr.join("，");
    },
    handlePutong1(option) {
      _.remove(this.storeState.queryAnaly, (item) => {
        // 如果筛选条件是关键词 并且是综合搜索的话 就删掉关键词
        // 综合查询等到用户点击关闭按钮后才删除
        if (option && item.name === option.split("_")[0]) {
          if (
            (item.name === "comprehensive" || item.name === "searchwords") &&
            (option === "comprehensive_drug" ||
              "comprehensive_company" ||
              "comprehensive_devices" ||
              "comprehensive_chinesemedicine" ||
              "comprehensive_targets" ||
              "comprehensive_disease")
          ) {
            _.unset(this.storeState.putongAnaly, "comprehensive");
            _.unset(this.storeState.putongAnaly, "searchwords");
            return true;
          }

          // if (item.name === 'searchwords' && (option === 'comprehensive_drug' || 'comprehensive_company' || 'comprehensive_devices' || 'comprehensive_chinesemedicine' || 'comprehensive_targets' || 'comprehensive_disease')) {
          //   _.unset(this.storeState.putongAnaly, 'searchwords');
          //   return true;
          // }
        }

        // 如果当前点击的条件在左侧筛选菜单存在 则删除
        if (item.accurate) {
          if (item.name + "_eq" === option) {
            _.unset(this.storeState.putongAnaly, option);
            return true;
          } else {
            _.unset(this.storeState.putongAnaly, option);
          }
        } else {
          if (item.name === option) {
            _.unset(this.storeState.putongAnaly, option);
            return true;
          } else {
            _.unset(this.storeState.putongAnaly, option);
          }
        }

        // 如果在已选的条件里面没有 也删除
        if (item.accurate) {
          if (!this.storeState.putongAnaly[item.name + "_eq"]) {
            return true;
          }
        } else {
          if (!this.storeState.putongAnaly[item.name]) {
            return true;
          }
        }
      });
      console.log(this.storeState.putongAnaly);
      Store.commit(this.vuex_name + "/queryStrAnaly", this.storeState.queryAnaly);
    },
    // 点击 × 符号：处理普通搜索条件的单个清除
    async handlePutongCloseClick(option) {
      await Store.commit(this.vuex_name + "/putongAnaly", this.storeState.queryAnaly);
      this.handlePutong1(option);
      this.handleShaixuan1();
      if (Object.keys(this.storeState.putongAnaly).length === 1) {
        _.unset(this.storeState.putongAnaly, option);
      }
      if (this.route) {
        if (this.route == this.route1) {
          Store.dispatch(
            this.vuex_name + "/nomalSearch",
            this.storeState.putongAnaly
          );
        } else if (this.route == this.route2) {
          if (this.vuex_name === "Yyxs") {
            Store.dispatch(this.vuex_name + "/getKshRes");
            return;
          }
          Store.dispatch(this.vuex_name + "/getKshRes", this.storeState.putongAnaly);
        } else if (this.route == this.route3 && this.vuex_name === "Yyxs") {
          Store.dispatch(this.vuex_name + "/getKshRes", 2);
        } else if (this.route == this.route3 && this.vuex_name === "Zhuce") {
          Store.dispatch(this.vuex_name + "/getKshRes");
        } else if (this.route == this.route4 && this.vuex_name === "Zhuce") {
          Store.dispatch(this.vuex_name + "/getKshRes_Breed");
        }
      } else {
        Store.dispatch(this.vuex_name + "/nomalSearch", this.storeState.putongAnaly);
      }
    },
    // 点击 × 符号：处理高级搜索条件的单个清除
    handleGaojiCloseClick(option) {
      // console.log(option)
      _.remove(this.storeState.conditionsAnaly, (n) => {
        return n.name == option.name && n.value == option.value;
      });

      Store.commit(this.vuex_name + "/gaoji", {});
      this.handlePutong1();
      this.handleShaixuan1();
      if (this.route) {
        if (this.route == this.route1) {
          Store.dispatch(this.vuex_name + "/nomalSearch");
        } else if (this.route == this.route2) {
          Store.dispatch(this.vuex_name + "/getKshRes");
        } else if (this.route == this.route3 && this.vuex_name === "Yyxs") {
          Store.dispatch(this.vuex_name + "/getKshRes", 2);
        } else if (this.route == this.route3 && this.vuex_name === "Zhuce") {
          Store.dispatch(this.vuex_name + "/getKshRes");
        } else if (this.route == this.route4 && this.vuex_name === "Zhuce") {
          Store.dispatch(this.vuex_name + "/getKshRes_Breed");
        }
      } else {
        Store.dispatch(this.vuex_name + "/nomalSearch");
      }
    },
    // 点击 × 符号：清除所有关联查询
    handleFourthCloseClick() {
      // this.storeState.fourth_checked = {};
      // this.storeState.fourth = {};
      this.handlePutong1();
      this.handleShaixuan1();
      if (this.route) {
        if (this.route == this.route1) {
          console.log("list: ", this.vuex_name + "/nomalSearch");
          Store.dispatch(this.vuex_name + "/nomalSearch");
        } else if (this.route == this.route2) {
          if (this.vuex_name === "Yyxs") {
            Store.dispatch(this.vuex_name + "/getKshRes");
            return;
          }
          Store.dispatch(this.vuex_name + "/getKshRes");
        } else if (this.route == this.route3 && this.vuex_name === "Yyxs") {
          Store.dispatch(this.vuex_name + "/getKshRes", 2);
        } else if (this.route == this.route3 && this.vuex_name === "Zhuce") {
          Store.dispatch(this.vuex_name + "/getKshRes");
        } else if (this.route == this.route4 && this.vuex_name === "Zhuce") {
          Store.dispatch(this.vuex_name + "/getKshRes_Breed");
        }
      } else {
        Store.dispatch(this.vuex_name + "/nomalSearch");
      }
    },
    handleShaixuan1() {
      if (this.storeState.groupsAnaly) {
        Object.keys(this.storeState.groupsAnaly).forEach((item) => {
          if (this.storeState.shaixuanAnaly) {
            if (this.storeState.shaixuanAnaly.filter_condition) {
              !this.storeState.shaixuanAnaly.filter_condition.includes(item) &&
                _.set(this.storeState.groupsAnaly, item, []);
            } else {
              _.set(this.storeState.groupsAnaly, item, []);
            }
          }
        });
      }
    },
    // 点击 × 符号：处理筛选条件的单个清除
    handleShaixuanCloseClick(option) {
      _.set(this.storeState.groupsAnaly, option, []);
      this.handlePutong1();
      this.handleShaixuan1();
      if (this.vuex_name == "Zhuce") {
        Store.commit(this.vuex_name + "/shaixuanNodes", []);
      }
      if (this.route) {
        if (this.route == this.route1) {
          Store.dispatch(this.vuex_name + "/nomalSearch");
        } else if (this.route == this.route2) {
          Store.dispatch(this.vuex_name + "/getKshRes");
        } else if (this.route == this.route3 && this.vuex_name === "Yyxs") {
          Store.dispatch(this.vuex_name + "/getKshRes", 2);
        } else if (this.route == this.route3 && this.vuex_name === "Zhuce") {
          Store.dispatch(this.vuex_name + "/getKshRes");
        } else if (this.route == this.route4 && this.vuex_name === "Zhuce") {
          Store.dispatch(this.vuex_name + "/getKshRes_Breed");
        }
      } else {
        Store.dispatch(this.vuex_name + "/nomalSearch");
      }
    },

    // 清除全球上市国家地区筛选
    handleSourceCloseClick() {
      this.storeState.filtersSource = [];
      this.handlePutong1();
      this.handleShaixuan1();
      if (this.route) {
        if (this.route == this.route1) {
          Store.dispatch(this.vuex_name + "/nomalSearch");
        } else if (this.route == this.route2) {
          Store.dispatch(this.vuex_name + "/getKshRes");
        }
      } else {
        Store.dispatch(this.vuex_name + "/nomalSearch");
      }
    },

    // 获取全球上市国家
    getSourceText(arr) {
      let strArr = [];
      arr.map((v) => {
        if (v.checked == 1) {
          strArr.push(v.label);
        } else if (v.checked == -1) {
          strArr.push(`排除${v.label}`);
        }
      });

      return strArr.join(",");
    },

    // 点击 × 符号：清除所有热点条件
    handleHotCloseClick() {
      this.storeState.hot_checked = [];
      this.handlePutong1();
      this.handleShaixuan1();
      console.log(this.route, this.route2, this.route4);
      if (this.route) {
        if (this.route == this.route1) {
          Store.dispatch(this.vuex_name + "/nomalSearch");
        } else if (this.route == this.route2) {
          Store.dispatch(this.vuex_name + "/getKshRes");
        } else if (this.route == this.route3 && this.vuex_name === "Yyxs") {
          Store.dispatch(this.vuex_name + "/getKshRes", 2);
        } else if (this.route == this.route4 && this.vuex_name === "Zhuce") {
          Store.dispatch(this.vuex_name + "/getKshRes_Breed");
        }
      } else {
        Store.dispatch(this.vuex_name + "/nomalSearch");
      }
    },
    handleAllCloseClick() {
      console.log(this.storeState.putongAnaly);
      if (this.storeState.queryAnaly) {
        //this.storeState.queryAnaly = []
        Store.commit(this.vuex_name + "/queryAnaly", []);
      }
      if (this.storeState.putongAnaly) {
        Store.commit(this.vuex_name + "/putong", {});
        //this.storeState.putongAnaly = {}
      }
      if (this.storeState.conditionsAnaly) {
        // this.storeState.conditionsAnaly = []
        Store.commit(this.vuex_name + "/conditionsAnaly", []);
      }
      // if (this.storeState.gaoji) {
      //   // this.storeState.gaoji = {}
      //   Store.commit(this.vuex_name + "/gaoji", {});
      // }
      if (this.storeState.groupsAnaly) {
        this.storeState.groupsAnaly = {};
        Store.commit(this.vuex_name + "/groupsAnaly", {});
      }
      if (this.storeState.shaixuanAnaly) {
        this.storeState.shaixuanAnaly = {};
        Store.commit(this.vuex_name + "/shaixuanAnaly", {});
      }
      // if (this.storeState.fourth_checked) {
      //   this.storeState.fourth_checked = {};
      //   Store.commit(this.vuex_name + "/fourth_checked", {});
      // }
      // if (this.storeState.fourth) {
      //   this.storeState.fourth = {};
      //   Store.commit(this.vuex_name + "/fourth", {});
      // }
      if (this.storeState.hot_checked) {
        this.storeState.hot_checked = [];
        Store.commit(this.vuex_name + "/hot_checked", []);
      }

      if (this.storeState.filtersSource) {
        this.storeState.filtersSource = [];
        Store.commit(this.vuex_name + "/filtersSource", []);
      }
      if (this.vuex_name == "Zhuce") {
        Store.commit(this.vuex_name + "/shaixuanNodes", []);
      }
      Store.commit(this.vuex_name + "/queryStrAnaly", this.storeState.queryAnaly);
      if (this.route) {
        if (this.route == this.route1) {
          Store.dispatch(
            this.vuex_name + "/nomalSearch",
            this.storeState.putongAnaly
          );
        } else if (this.route == this.route2) {
          if (this.vuex_name === "Yyxs") {
            Store.dispatch(this.vuex_name + "/getKshRes");
            return;
          }
          Store.dispatch(this.vuex_name + "/getKshRes", this.storeState.putongAnaly);
        } else if (this.route == this.route3 && this.vuex_name === "Yyxs") {
          Store.dispatch(this.vuex_name + "/getKshRes", 2);
        } else if (this.route == this.route3 && this.vuex_name === "Zhuce") {
          Store.dispatch(this.vuex_name + "/getKshRes");
        } else if (this.route == this.route4 && this.vuex_name === "Zhuce") {
          Store.dispatch(this.vuex_name + "/getKshRes_Breed");
        }
      } else {
        Store.dispatch(this.vuex_name + "/nomalSearch", this.storeState.putongAnaly);
      }
    },
  },
  mounted() { },
};
</script>

<style lang="less" scoped>
@import "~@/assets/less/app.less";
@import "~@/assets/less/var.less";

/* 已选条件 - 样式 start */
.la-optioned.globaldrugs-analy-optioned {
  padding: 0 10px 0px 14px;
  background-color: #fff;
  position: relative;
  z-index: 1;
  border-radius: 4px 4px 0 0;

  .btn {
    display: inline-block;
    box-sizing: border-box;
    height: 20px;
    padding: 0px 6px;
    margin: 0 3px;
    line-height: 20px;
    border-radius: 4px;
    color: @White;
  }

  .optioned {
    position: relative;
    // padding-left: 20px;
    display: inline-block;
    padding: 10px 0 5px 0;

    .label {
      position: absolute;
      left: 4px;
      top: 2px;
    }

    .option {
      // width: 110px;
      box-sizing: border-box;
      font-size: 12px;
      color: #002FA7;
      background-color: #f0f2f9;
      border: 1px solid #DCDFE6;
      margin-bottom: 1px;
      display: inline-block;
      border-radius: 2px;
      line-height: 16px;

      // margin-top: 10px;
      &:hover {
        background-color: #eaeef9;
      }

      .tj {
        // width: 80px;
        display: inline-block;
      }

      .icon-close {
        margin-left: 5px;
        vertical-align: middle;
        cursor: pointer;
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

    .save-options {
      background-color: #FFA914;
      cursor: pointer;
      padding: 0 8px;
      line-height: 20px;

      &:hover {
        background: Lighten(#FFA914, 10%);
      }
    }

    .clear-options {
      background-color: #C0C4CC;
      cursor: pointer;
      padding: 0 8px;
      line-height: 20px;

      &:hover {
        background: Lighten(#C0C4CC, 10%);
      }
    }
  }
}

.option-show {
  padding-bottom: 10px;
}

/* 已选条件 - 样式 end */
</style>
