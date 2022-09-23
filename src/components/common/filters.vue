<template>
  <transition name="el-zoom-in-top" appear>
    <div v-if="hasFilters">
      <div
        class="filter item"
        :class="{
          'abandon-click-method': nopms && nopms.tjsx,
          'is-disabled': nopms && nopms.tjsx
        }"
      >
        <span class="item-title">条件筛选</span>
        <el-collapse v-model="activeNames">
          <transition-group name="flip-list" tag="ul" appear>
            <li v-for="(key, index) in keys" :key="key">
              <template v-if="filters[key]">
                <el-collapse-item
                  v-if="filters[key].length > 0"
                  :name="key"
                  :key="index"
                  :disabled="nopms && nopms.tjsx"
                >
                  <template
                    slot="title"
                    v-if="getFiltersCname(key) == '特殊情况批准'"
                  >
                    {{ getFiltersCname(key) }}
                    <el-tooltip
                      class="tooltips-incidentalConditions"
                      effect="light"
                      placement="right"
                    >
                      <div
                        slot="content"
                        v-html="helpDesc.exceptionalCase"
                      ></div>
                      <i class="el-icon-question cl-green"></i>
                    </el-tooltip>
                  </template>
                  <template
                    slot="title"
                    v-else-if="
                      getFiltersCname(key) == '附带条件批准' &&
                        vuex_name == 'Epyp'
                    "
                  >
                    {{ getFiltersCname(key) }}
                    <el-tooltip
                      class="tooltips-incidentalConditions"
                      effect="light"
                      placement="right"
                    >
                      <div
                        slot="content"
                        v-html="helpDesc.incidentalConditions"
                      ></div>
                      <i class="el-icon-question cl-green"></i>
                    </el-tooltip>
                  </template>
                  <template
                    slot="title"
                    v-else-if="
                      getFiltersCname(key) == '国产/进口' && vuex_name == 'Qxss'
                    "
                  >
                    {{ getFiltersCname(key) }}
                    <el-tooltip
                      class="tooltips-incidentalConditions"
                      effect="light"
                      placement="right"
                    >
                      <div
                        slot="content"
                        v-html="helpDesc.domesticOrImport"
                      ></div>
                      <i class="el-icon-question cl-green"></i>
                    </el-tooltip>
                  </template>
                  <template
                    slot="title"
                    v-else-if="
                      getFiltersCname(key) == '剂型' && vuex_name == 'Epyp'
                    "
                  >
                    {{ getFiltersCname(key) }}
                    <el-tooltip
                      class="tooltips-incidentalConditions"
                      effect="light"
                      placement="right"
                    >
                      <div slot="content" v-html="helpDesc.epypTips"></div>
                      <i class="el-icon-question cl-green"></i>
                    </el-tooltip>
                  </template>
                  <template
                    slot="title"
                    v-else-if="
                      getFiltersCname(key) == '等效性代码' &&
                        vuex_name == 'FdaDrug'
                    "
                  >
                    {{ getFiltersCname(key) }}
                    <el-tooltip effect="light" placement="right">
                      <div slot="content" v-html="helpDesc.dengxiao"></div>
                      <i class="el-icon-question cl-green"></i>
                    </el-tooltip>
                  </template>
                  <template
                    slot="title"
                    v-else-if="
                      getFiltersCname(key) == '参比药物' &&
                        vuex_name == 'FdaDrug'
                    "
                  >
                    {{ getFiltersCname(key) }}
                    <el-tooltip effect="light" placement="right">
                      <div slot="content" v-html="helpDesc.canbi"></div>
                      <i class="el-icon-question cl-green"></i>
                    </el-tooltip>
                  </template>
                  <template slot="title" v-else>
                    {{ getFiltersCname(key) }}
                    <el-tooltip
                      effect="light"
                      placement="right"
                      v-if="tooltip && tooltip[key]"
                    >
                      <div slot="content" v-html="tooltip[key]"></div>
                      <i class="el-icon-question cl-green"></i>
                    </el-tooltip>
                  </template>
                  <!--
                    增加树形控件，实现多级条件筛选
                    首次只增加药物报告-适应症（zh-CN.js中唯一值syzbm），故没有添加路由判断，后期统一后需要额外调整判断
                    注意虽fun.js条件筛选公用方法getSearchParams接口拆分，但值合并为条件筛选一级查询条件，故此没有额外添加组件，方便取值赋值
                    多级不方便实现更多展示所以添加了高度，带滚动条展示，并在下面更多处添加了判断key!=='syzbm'
                    -->
                  <div v-if="key === 'syzbm'" style="position: relative;">
                    <div v-show="searchLoading" class="trees-loading">
                      <span class="turn"></span>
                    </div>
                    <el-input
                      placeholder="输入关键字进行过滤"
                      v-model="filterText"
                      @input="filterChange(index)"
                      @change="filterChange(index)"
                    >
                    </el-input>
                    <div class="trees">
                      <el-tree
                        node-key="key"
                        class="filter-tree"
                        :data="filters[key]"
                        :props="{ children: 'children', label: 'label' }"
                        show-checkbox
                        :default-checked-keys="checked[key]"
                        :default-expanded-keys="defaultExpanded"
                        :filter-node-method="filterNode"
                        @check="(data, checkTree) => checkGA(key, data, index)"
                        @node-expand="nodeExpand"
                        @node-collapse="nodeCollapse"
                        @check-change="
                          (data, checkTree, checkTreeChild) =>
                            checkChange(
                              data,
                              checkTree,
                              checkTreeChild,
                              index,
                              key
                            )
                        "
                        :ref="'tree' + index"
                        check-strictly
                      >
                        <span
                          class="custom-tree-node"
                          slot-scope="{ node, data }"
                        >
                          <span>{{ node.label }}</span>
                          <span class="num">({{ data.doc_count }})</span>
                        </span>
                      </el-tree>
                    </div>
                  </div>
                  <div
                    v-else-if="key === 'leixingbm'"
                    style="position: relative;"
                  >
                    <div v-show="searchLoading" class="trees-loading">
                      <span class="turn"></span>
                    </div>
                    <el-input
                      placeholder="输入关键字进行过滤"
                      v-model="filterText2"
                      @input="filterChange2(index)"
                      @change="filterChange2(index)"
                    >
                    </el-input>
                    <div class="trees">
                      <el-tree
                        node-key="key"
                        class="filter-tree"
                        :data="filters[key]"
                        :props="{ children: 'children', label: 'label' }"
                        show-checkbox
                        :default-checked-keys="checked[key]"
                        :default-expanded-keys="defaultExpanded2"
                        :filter-node-method="filterNode2"
                        @check="(data, checkTree) => checkGA2(key, data, index)"
                        @node-expand="nodeExpand2"
                        @node-collapse="nodeCollapse2"
                        @check-change="
                          (data, checkTree, checkTreeChild) =>
                            checkChange2(
                              data,
                              checkTree,
                              checkTreeChild,
                              index,
                              key
                            )
                        "
                        :ref="'tree2' + index"
                        check-strictly
                      >
                        <span
                          class="custom-tree-node"
                          slot-scope="{ node, data }"
                        >
                          <span>{{ node.label }}</span>
                          <span class="num">({{ data.doc_count }})</span>
                        </span>
                      </el-tree>
                    </div>
                  </div>

                  <el-checkbox-group v-model="checked[key]" v-else>
                    <el-checkbox
                      v-for="(type, index) in filters[key]"
                      :label="type.key"
                      :key="index"
                      @change="checkGA(key, type)"
                    >
                      <!-- <span v-if="type.key !== type.label">[{{type.key}}]</span> -->
                      <span>{{ type.label }}</span>
                      <!-- 松松那边说他那边在后台把数据去掉了 但是前端依旧有括号出现 所以这里前端增加判断 2022-05-24 15:24
                      2022-5-25 15:31 王成说不上品种销售额的条件筛选 -->
                      <span class="num">({{ type.doc_count }})</span>
                    </el-checkbox>
                  </el-checkbox-group>
                  <div class="controls">
                    <a
                      v-if="
                        filters[key].length > filter_default_len &&
                          key !== 'syzbm' &&
                          key !== 'leixingbm'
                      "
                      class="show-more pr20"
                      href="javascript:;"
                      @click="showMore"
                    >
                      <span>更多</span>
                      <i class="icon el-icon-d-arrow-right"></i>
                      <!-- <i class="icon el-icon-d-arrow-left"></i> -->
                    </a>
                    <el-button
                      class="control-filter"
                      size="mini"
                      type="primary"
                      @click="searchFilter"
                      >筛选</el-button
                    >
                  </div>
                </el-collapse-item>
              </template>
            </li>
          </transition-group>
        </el-collapse>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapState } from "vuex";
//筛选条件默认显示数 修改此值 需要修改对应的css值
const FILTER_DEFAULT_SHOW_LENGTH = 6;
export default {
  props: {
    vuex_name: {
      // 必须！
      type: String,
      default: ""
    },
    dbname: {
      // 没有定量分析不要绑定此属性！（可参考药品销售数据库示例，截止9月30日，暂时只有药品销售/药品中标/生物制品这三个数据库有定量分析）
      type: String,
      default: ""
    },
    route1: {
      // 同route2，route3，含有可视化分析才绑定这三个属性（比如注册有list/analy/qb，而其他大多数只有两个属性，route3不绑定）
      type: String,
      default: ""
    },
    route2: {
      type: String,
      default: ""
    },
    route3: {
      type: String,
      default: ""
    },
    tooltip: {
      type: Object
    }
  },
  data() {
    return {
      defaultExpanded: [],
      defaultExpanded2: [],
      filterText: "",
      filterText2: "",
      checked: {},
      activeNames: [],
      filterList: [],
      filter_default_len: FILTER_DEFAULT_SHOW_LENGTH,
      helpDesc: {
        incidentalConditions:
          "同时满足以下要求的药品申请，人用药品委员会（CHMP）可以授予有条件批准：申请人可能能够提供全面数据；能够满足未被满足的医疗需求；药品即时使用的收益大于因缺少正常审批的数据而带来的风险。附带条件批准的产品有效期为一年，每年续期一次。",
        exceptionalCase:
          "申请人可以提出申请但无法提供正常申请的有关安全性和有效性的全部数据，原因如下：① 产品的适应症人群太少，难以获得预期的充分数据；② 以当前的科学认知水平无法获得充分数据；③ 搜集这些信息与公认的医学伦理学原则相违背。只作为处方药管理且只在严格的监督下使用。",
        domesticOrImport: "境内注册器械、境外注册器械",
        canbi:
          "简称RLD，是指在我国批准上市，用于仿制药注册申请的参照药品。通常是具有完整规范的安全性和有效性研究数据的药品。",
        dengxiao:
          "目的是能够让使用者快速了解收录的药品是否治疗等效及是否采用了生物等效性试验确定治疗等效。",
        epypTips: "此功能只针对于筛选HMA批准上市的相关数据。"
      }
    };
  },
  computed: {
    storeState() {
      return Store.state[this.vuex_name];
    },
    route() {
      // route 从 data 移动到 computed，防止固化
      return this.$route.path.split("/")[2];
    },
    match_shaixuan() {
      return Store.state[this.vuex_name].match_shaixuan;
    },
    filters() {
      // console.log(Store.state[this.vuex_name].filters);
      return Store.state[this.vuex_name].filters;
    },
    groups() {
      return Store.state[this.vuex_name].groups;
    },
    nopms() {
      return Store.state[this.vuex_name].nopms;
    },
    keys() {
      // console.log(this.filters)
      // console.log(Object.keys(Store.state[this.vuex_name].match_shaixuan))
      return (
        Store.state[this.vuex_name].filtersList ||
        Object.keys(Store.state[this.vuex_name].match_shaixuan)
      );
    },
    hasFilters() {
      let FIE = false;
      if (this.filters && Object.keys(this.filters).length) {
        for (let key in this.filters) {
          if (this.filters[key].length) {
            FIE = true;
          }
        }
      }
      return FIE;
    },
    searchLoading() {
      return Store.state.searchLoading;
    }
  },
  methods: {
    handlerTreeData(key) {
      console.log(this.filters, key, this.filters[key]);
    },
    checkChange(data, checkTree, checkTreeChild, index, key) {
      this.checked[key] = this.$refs["tree" + index][0].getCheckedKeys();
    },
    checkChange2(data, checkTree, checkTreeChild, index, key) {
      this.checked[key] = this.$refs["tree2" + index][0].getCheckedKeys();
    },
    filterChange(index) {
      this.$refs["tree" + index][0].filter(this.filterText);
    },
    filterChange2(index) {
      this.$refs["tree2" + index][0].filter(this.filterText2);
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.toLowerCase().indexOf(value.toLowerCase()) !== -1;
    },
    filterNode2(value, data) {
      if (!value) return true;
      return data.label.toLowerCase().indexOf(value.toLowerCase()) !== -1;
    },
    //添加collapse model值，使路由参数可以展开
    initActive() {
      // this.filterList = []
      _.forEach(this.keys, (item, index) => {
        for (let key in this.groups) {
          if (this.groups[key].length) {
            if (item === key) {
              this.filterList.push(index);
            }
          }
        }
      });
      console.info(this.filterList);
      // console.info(this.filterList)
      // this.activeNames = this.filterList
    },
    init() {
      for (let key in this.filters) {
        this.$set(
          this.checked,
          key,
          this.groups == undefined ? [] : this.groups[key] || []
        );
      }

      // this.initActive()
    },
    handleChange() {
      this.$emit("change", this.checked);
    },
    changeBox(value) {
      this.checked[value.label];
    },
    // 筛选 主标题的英文名 返回 中文名
    getFiltersCname(option) {
      for (let key in this.match_shaixuan) {
        if (option == key) {
          return this.match_shaixuan[key];
        }
      }
    },
    searchFilter() {
      Store.commit(this.vuex_name + "/groups", this.checked);
      if (this.route) {
        if (this.route == this.route1) {
          Store.dispatch(this.vuex_name + "/nomalSearch");
        } else if (this.route == this.route2) {
          Store.dispatch(this.vuex_name + "/getKshRes");
        }
        else if (this.route == this.route3) {
          Store.dispatch(this.vuex_name + "/getKshRes", 2);
        }
      } else {
        Store.dispatch(this.vuex_name + "/nomalSearch");
      }
    },
    showMore(event) {
      let name = "all-group";
      let icon = ["el-icon-d-arrow-right", "el-icon-d-arrow-left"];
      let checkbox_group =
        event.currentTarget.parentElement.parentElement.children[0];
      let className = checkbox_group.className.split(" ");
      let index = className.indexOf(name);
      if (index == -1) {
        className.push(name);
        event.currentTarget.children[0].innerText = "收起";
        event.currentTarget.children[1].className = "icon " + icon[1];
      } else {
        className.splice(index, 1);
        event.currentTarget.children[0].innerText = "更多";
        event.currentTarget.children[1].className = "icon " + icon[0];
      }
      checkbox_group.className = className.join(" ");
    },
    checkGA(key, data, index) {
      this.defaultExpanded = [];
      window.ga(
        "send",
        "event",
        "option",
        "click",
        this.vuex_name + "_filter_condition_" + key + "_" + data.label
      );
      window._paq.push([
        "trackEvent",
        "option",
        "click",
        this.vuex_name + "_filter_condition_" + key + "_" + data.label
      ]);

      let shaixuan = this.storeState.match_shaixuan_values;
      shaixuan[key] = shaixuan[key] ? shaixuan[key] : {};
      shaixuan[key][data.key] = data.label;
      Store.commit(
        this.vuex_name + "/match_shaixuan_values",
        _.assign({}, this.storeState.match_shaixuan_values, shaixuan)
      );
    },
    checkGA2(key, data, index) {
      this.defaultExpanded2 = [];
      window.ga(
        "send",
        "event",
        "option",
        "click",
        this.vuex_name + "_filter_condition_" + key + "_" + data.label
      );
      window._paq.push([
        "trackEvent",
        "option",
        "click",
        this.vuex_name + "_filter_condition_" + key + "_" + data.label
      ]);

      let shaixuan = this.storeState.match_shaixuan_values;
      shaixuan[key] = shaixuan[key] ? shaixuan[key] : {};
      shaixuan[key][data.key] = data.label;
      Store.commit(
        this.vuex_name + "/match_shaixuan_values",
        _.assign({}, this.storeState.match_shaixuan_values, shaixuan)
      );
    },
    nodeExpand(d, a, f) {
      let start = document.querySelector(".trees").scrollLeft;
      let end = a.level > 1 ? a.level * 18 + 6 : 24;

      this._easeout(start, end, 2, function(value) {
        document.querySelector(".trees").scrollLeft = value;
      });
    },
    nodeExpand2(d, a, f) {
      let start = document.querySelector(".trees").scrollLeft;
      let end = a.level > 1 ? a.level * 18 + 6 : 24;

      this._easeout(start, end, 2, function(value) {
        document.querySelector(".trees").scrollLeft = value;
      });
    },
    nodeCollapse(d, a, f) {
      let start = document.querySelector(".trees").scrollLeft;
      let end = (a.level > 1 ? a.level * 18 + 6 : 24) - (a.level > 1 ? 18 : 24);

      this._easeout(start, end, 2, function(value) {
        document.querySelector(".trees").scrollLeft = value;
      });
    },
    nodeCollapse2(d, a, f) {
      let start = document.querySelector(".trees").scrollLeft;
      let end = (a.level > 1 ? a.level * 18 + 6 : 24) - (a.level > 1 ? 18 : 24);

      this._easeout(start, end, 2, function(value) {
        document.querySelector(".trees").scrollLeft = value;
      });
    },
    _easeout(start, end, rate, callback) {
      var _end = end;
      if (start == end || typeof start != "number") {
        return;
      }
      end = end || 0;
      rate = rate || 2;

      var step = function() {
        start = start + (end - start) / rate;
        if (Math.abs(start - _end) < 1) {
          callback(end, true);
          return;
        }
        callback(start, false);
        requestAnimationFrame(step);
      };
      step();
    }
  },
  watch: {
    filters: {
      handler() {
        this.init();
      },
      immediate: true
    },
    groups() {
      this.filterText = "";
      this.filterText2 = "";
      this.init();
    },
    searchLoading(val) {
      if (!val) {
        this.defaultExpanded = this.checked["syzbm"];
        this.defaultExpanded2 = this.checked["leixingbm"];
      }
    }
  },
  mounted() {
    if (this.vuex_name === "Yyxs") {
      this.activeNames = ['tag'];
    }
  },
  updated() {
    this.vueTogglePmsTooltip();
    if ($('.all-group').length>0) {
      let node = $('.all-group')
      node.each(function () {
        if ($(this).next().children('.show-more')[0]) {
          $(this).next().children('.show-more')[0].children[0].innerText = "收起"
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
@import "~@/assets/less/var.less";
.turn {
  height: 20px;
  width: 20px;
  background: url("~@/assets/imgs/icon-loading.png") center center no-repeat;
  animation: turn 1.5s linear infinite;
}
@keyframes turn {
  from {
    transform: rotate(360deg);
  }
  to {
    transform: rotate(0deg);
  }
}
.filter {
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
  // &.abandon-click-method {
  //   .el-collapse-item {
  //     pointer-events: none;
  //     .el-collapse-item__header {
  //       color: @NoPmsColor!important;
  //     }
  //   }
  // }
  .el-collapse {
    border: 0px;
  }
  .el-collapse-item {
    padding: 0px 14px 0 10px;
    .el-checkbox-group {
      max-height: 21 * 6px; /*5是与FILTER_DEFAULT_SHOW_LENGTH的值保持一致*/
      overflow-y: hidden;
      &.all-group {
        max-height: none;
      }
    }

    &:last-child {
      .el-collapse-item__header {
        border: 0px;
      }
    }

    /deep/ .el-collapse-item__content {
      padding-bottom: 0;
      font-size: @FontSizeSmall;
    }

    /deep/.el-collapse-item__header {
      height: 30px;
      line-height: 30px;
      border-bottom: 1px dashed #DFE5F1;
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
      border-bottom: 1px dashed #ebeef5;
    }
    /deep/.el-collapse-item__arrow {
      line-height: 30px;
      margin-right: 0;
    }
  }
  /deep/.el-tree-node > .el-tree-node__children {
    overflow: initial;
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
  .trees {
    position: relative;
    max-height: 266px;
    overflow: auto;
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
  .show-more {
    padding-right: 20px;
    .icon {
      transform: rotate(90deg);
      -ms-transform: rotate(90deg); /* IE 9 */
      -moz-transform: rotate(0deg); /* Firefox */
      -webkit-transform: rotate(90deg); /* Safari 和 Chrome */
      -o-transform: rotate(90deg); /* Opera */
    }
  }
  .control-filter {
    padding: 4px 15px;
    border-radius: 4px;
  }
}
.flip-list-move {
  transition: transform 0.5s;
}
.el-zoom-in-top-enter-active {
  transition: all 0.5s;
}
.el-zoom-in-top-leave-active {
  transition: all 0.5s;
}

.is-disabled {
  color: @NoPmsColor !important;
  cursor: not-allowed !important;
  /deep/.el-collapse-item__header {
    color: @NoPmsColor !important;
    cursor: not-allowed !important;
  }
  * {
    color: @NoPmsColor !important;
    cursor: not-allowed !important;
  }
}
.abandon-click-method, .yyxs-abandon-click-method {
  cursor: not-allowed!important;
  color: @NoPmsColor!important;
  text-decoration: none!important;
  &:hover {
    color: @NoPmsColor!important;
  }
  * {
    cursor: not-allowed!important;
  }
}
</style>
