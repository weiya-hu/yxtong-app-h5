<template>
  <transition name="el-zoom-in-top" appear>
    <div v-if="hasFilters">
      <div
        class="filter globaldrug-filter item"
        :class="{
          'abandon-click-method': nopms && nopms.tjsx,
          'is-disabled': nopms && nopms.tjsx,
        }"
      >
        <div class="item-title">
          <span>条件筛选</span>
          <span class="shrink" v-if="isOpen" @click="handleOpen">+</span>
          <span class="shrink" v-else @click="handleStow">-</span>
        </div>
        <el-collapse v-model="activeNames">
          <transition-group name="flip-list" tag="ul" appear>
            <li
              v-for="(key, index) in keys"
              :key="key"
              :class="{ 'last-li': index == keys.length - 1 }"
            >
              <template v-if="filters[key]">
                <el-collapse-item
                  v-if="filters[key].length > 0"
                  :name="key"
                  :key="index"
                  :disabled="nopms && nopms.tjsx"
                >
                  <template slot="title">
                    <NewProjectGuide
                      :onlyKey="filters[key]['new_id']"
                      :newPosition="{
                        right: filters[key].statement ? -40 : -26,
                      }"
                      display="inline"
                      compoentsName="筛选功能"
                      postion="条件"
                      :initItem="filters[key]"
                      :showMenban="filters[key]['is_show_new']"
                      >{{ getFiltersCname(key) }}</NewProjectGuide
                    >

                    <el-tooltip
                      effect="light"
                      placement="right"
                      v-if="filters && filters[key].statement"
                    >
                      <div
                        slot="content"
                        v-html="
                          filters[key].statement ? filters[key].statement : ''
                        "
                      ></div>
                      <i class="el-icon-question cl-green"></i>
                    </el-tooltip>
                  </template>
                  <div
                    v-if="key === 'leixingbm' || key === 'indication_standard'"
                    style="position: relative"
                  >
                    <div v-show="searchLoading" class="trees-loading">
                      <span class="turn"></span>
                    </div>
                    <el-input
                      placeholder="输入关键字进行过滤"
                      v-model="filterText2[key]"
                      @input="filterChange2(index, key)"
                      @change="filterChange2(index, key)"
                    >
                    </el-input>
                    <div class="trees">
                      <el-tree
                        :indent="6"
                        node-key="key"
                        class="filter-tree"
                        :data="filters[key]"
                        :props="{ children: 'children', label: 'label' }"
                        show-checkbox
                        :default-checked-keys="checked[key]"
                        :default-expanded-keys="checked[key]"
                        :filter-node-method="filterNode2"
                        @check="
                          (data, checkTree) =>
                            checkGA2(data, checkTree, key, index)
                        "
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
                        :check-strictly="
                          key !== 'leixingbm' && key !== 'indication_standard'
                        "
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
                      <span>{{ type.label }}</span>
                      <span class="num">({{ type.doc_count }})</span>
                    </el-checkbox>
                  </el-checkbox-group>
                  <!-- <div class="controls">
                    <el-button
                      class="control-filter"
                      size="mini"
                      type="primary"
                      @click="searchFilter"
                      >确定</el-button
                    >
                  </div> -->
                </el-collapse-item>
              </template>
            </li>
          </transition-group>
        </el-collapse>

        <!-- <el-button
          class="control-filter-fixed"
          size="mini"
          type="primary"
          @click="searchFilter"
          >搜索</el-button
        > -->
      </div>
    </div>
  </transition>
</template>

<script>
import { mapState } from "vuex";
import VCheckBox from "@/pages/globalapproval/scatter-graph/components/Checkbox";
//筛选条件默认显示数 修改此值 需要修改对应的css值
const FILTER_DEFAULT_SHOW_LENGTH = 6;
export default {
  components: { VCheckBox },
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
  },
  data() {
    return {
      isOpen: false, // 默认展开
      defaultExpanded2: [],
      filterText2: {
        leixingbm: "",
        indication_standard: "",
      },
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
        epypTips: "此功能只针对于筛选HMA批准上市的相关数据。",
      },
      filterKeys: [],
      sourceValue: 0,
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
      return Store.state[this.vuex_name].filters;
    },
    filters1() {
      return Store.state[this.vuex_name].filters1;
    },
    groups() {
      return Store.state[this.vuex_name].groups;
    },
    nopms() {
      return Store.state[this.vuex_name].nopms;
    },
    keys() {
      this.filters1.forEach((item2) => {
        item2.sort = Number(item2.sort);
      });
      let arr = _.orderBy(this.filters1, ["sort"], ["desc"]),
        keys = [];
      console.log(arr);
      arr.forEach((item) => {
        keys.push(item.field);
      });
      return Store.state[this.vuex_name].filtersList || keys;
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
    },
  },
  methods: {
    // 展开
    handleOpen() {
      window.ga(
        "send",
        "event",
        "button",
        "click",
        "企业版_全球药物_条件筛选_展开"
      );
      window._paq.push([
        "trackEvent",
        "button",
        "click",
        "企业版_全球药物_条件筛选_展开",
      ]);
      $(".el-collapse").show(500);
      this.isOpen = false;
    },

    // 收起
    handleStow() {
      window.ga(
        "send",
        "event",
        "button",
        "click",
        "企业版_全球药物_条件筛选_收起"
      );
      window._paq.push([
        "trackEvent",
        "button",
        "click",
        "企业版_全球药物_条件筛选_收起",
      ]);
      $(".el-collapse").hide(500);
      this.isOpen = true;
    },

    handlerTreeData(key) {},
    checkChange(data, checkTree, checkTreeChild, index, key) {
      if (key === "zhuangtai" && this.vuex_name == "Zhuce") {
        let nodes = this.$refs["tree" + index][0].getCheckedNodes();
        Store.commit(this.vuex_name + "/shaixuanNodes", nodes);
        // console.log(nodes);
      }
      let checkedKeys = this.$refs["tree" + index][0].getCheckedKeys();

      if (key === "typeLevel") {
        checkedKeys.map((v, i) => {
          if (v.indexOf("__") < 0) {
            checkedKeys.splice(i, 1);
          }
        });
      }
      console.log(checkedKeys);
      this.checked[key] = checkedKeys;
      console.log(data);
    },
    checkChange2(data, checkTree, checkTreeChild, index, key) {
      // this.checked[key] = this.$refs["tree2" + index][0].getCheckedKeys();
    },
    filterChange2(index, key) {
      this.$refs["tree2" + index][0].filter(this.filterText2[key]);
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
      console.log(this.checked);
      for (const [key, val] of Object.entries(this.filters)) {
        // console.log(this.filters1, this.filters);
        this.filters1.forEach((item2) => {
          item2.sort = Number(item2.sort);
          // 特殊处理全球上市国家与地区条件筛选
          if (
            this.vuex_name === "Globalapproval" &&
            key === "source" &&
            item2.field === "source"
          ) {
            this.filters[key] = this.filters[key].map((v) => ({
              label: v.label,
              key: v.key,
              doc_count: v.doc_count,
              checked: 0,
            }));
          }

          if (key === item2.field && item2.statement) {
            this.filters[key].statement = item2.statement;
            this.filters[key].sort = item2.sort;
          }
          if (key === item2.field && item2.is_show_new) {
            this.filters[key].is_show_new = item2.is_show_new;
            this.filters[key].field = item2.field;
            this.filters[key].label = item2.label;
            this.filters[key].name = item2.name;
            this.filters[key].new_content = item2.new_content;
            this.filters[key].new_id = item2.new_id;
            this.filters[key].new_time = item2.new_time;
            this.filters[key].new_type = item2.new_type;
            this.filters[key].sort = item2.sort;
            this.filters[key].type = item2.type;
          }
        });
      }
      console.log(this.filters);
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

    checkGA(key, data, index, checkTree) {
      console.log(checkTree);
      this.defaultExpanded = [];
      window.ga("send", "event", "option", "click", "企业版_全球药物_条件筛选");
      window._paq.push([
        "trackEvent",
        "option",
        "click",
        "企业版_全球药物_条件筛选",
      ]);
      let shaixuan = this.storeState.match_shaixuan_values;

      shaixuan[key] = shaixuan[key] ? shaixuan[key] : {};
      shaixuan[key][data.key] = data.label;
      console.log(shaixuan);
      Store.commit(
        this.vuex_name + "/match_shaixuan_values",
        _.assign({}, this.storeState.match_shaixuan_values, shaixuan)
      );
    },
    checkGA2(data, checkTree, key, index) {
      console.log(data, checkTree, key, index);
      /**
       * 获取树结构已选节点：如果是父节点下子节点全选则只获取父节点。如果父节点下的子节点未全选则只获取对应勾选的子节点。采用递归获取所需要的节点
       * @param {*} store === this.$refs.tree.store
       * @returns
       */
      let store = this.$refs["tree2" + index][0].store;
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
      console.log(checkedNodes, this.checked);
      this.defaultExpanded2 = [];
      window.ga("send", "event", "option", "click", "企业版_全球药物_条件筛选");
      window._paq.push([
        "trackEvent",
        "option",
        "click",
        "企业版_全球药物_条件筛选",
      ]);

      let shaixuan = this.storeState.match_shaixuan_values;
      shaixuan[key] = shaixuan[key] ? shaixuan[key] : {};
      shaixuan[key][data.key] = data.label;
      console.log(shaixuan);
      Store.commit(
        this.vuex_name + "/match_shaixuan_values",
        _.assign({}, this.storeState.match_shaixuan_values, shaixuan)
      );
    },
    nodeExpand2(d, a, f) {
      let start = document.querySelector(".trees").scrollLeft;
      let end = a.level > 1 ? a.level * 18 + 6 : 24;

      this._easeout(start, end, 2, function (value) {
        document.querySelector(".trees").scrollLeft = value;
      });
    },
    nodeCollapse2(d, a, f) {
      let start = document.querySelector(".trees").scrollLeft;
      let end = (a.level > 1 ? a.level * 18 + 6 : 24) - (a.level > 1 ? 18 : 24);

      this._easeout(start, end, 2, function (value) {
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

    // scrollEvent() {
    //   let tempDom = document.querySelector(".la-left-side .el-scrollbar__wrap");
    //   let scrollTop = tempDom.scrollTop;
    //   if (scrollTop > 10) {
    //     $(".control-filter-fixed").css({
    //       display: "block",
    //     });
    //   } else {
    //     $(".control-filter-fixed").css({
    //       display: "none",
    //     });
    //   }
    // },
  },
  watch: {
    filters: {
      handler() {
        this.init();
      },
      immediate: true,
    },
    groups() {
      (this.filterText2 = {
        leixingbm: "",
        indication_standard: "",
      }),
        this.init();
    },
    searchLoading(val) {
      if (!val) {
        this.defaultExpanded2 = this.checked["leixingbm"];
        this.defaultExpanded2 = this.checked["indication_standard"];
      }
    },
  },
  updated() {
    this.vueTogglePmsTooltip();
  },
  mounted() {
    // let tempDom = document.querySelector(".la-left-side .el-scrollbar__wrap");
    // tempDom.addEventListener("scroll", this.scrollEvent);
  },
  // beforeDestroy() {
  //   window.removeEventListener("scroll", this.scrollEvent);
  // },
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

.filter.globaldrug-filter {
  .item-title {
    display: block;
    height: 40px;
    padding-left: 10px;
    padding-right: 16px;
    font-size: @FontSize;
    background-color: #fff;
    color: #000f32;
    font-weight: 500;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0px 1px 8px 0px rgba(9, 20, 79, 0.1);
    position: relative;

    &::before {
      content: "";
      width: 2px;
      height: 40px;
      background: #002fa7;
      position: absolute;
      left: 0;
      top: 0;
    }

    .shrink {
      display: flex;
      align-items: center;
      width: 15px;
      height: 15px;
      justify-content: center;
      font-size: 12px;
      color: #ffa914;
      border: 1px solid #dbdfe7;
      font-weight: normal;
      cursor: pointer;
      box-sizing: border-box;
    }
  }

  .last-li {
    /deep/ .el-collapse-item .el-collapse-item__header {
      &::after {
        background: transparent;
      }
    }
  }

  .item {
    padding-bottom: 10px;
  }

  .el-collapse {
    border: 0px;
    padding: 10px 0;
    box-sizing: border-box;
    // background: #fafbfd;
  }

  /deep/ .el-collapse-item__content {
    padding-bottom: 0;
    font-size: @FontSizeSmall;
    background: #fafbfd;
  }

  .all-group {
    max-height: none !important;
  }

  .el-collapse-item {
    padding: 0px;

    .el-checkbox-group {
      // max-height: 21.5 * 6px;
      // /*5是与FILTER_DEFAULT_SHOW_LENGTH的值保持一致*/
      // overflow-y: hidden;
      padding: 0 16px 5px 10px;

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
      border-bottom: none;
      margin-bottom: 1px;
      color: #333;
      font-size: @FontSizeSmall;
      font-weight: normal;
      padding: 0 16px 0 10px;
      position: relative;
      background: #fff;
      &::after {
        content: "";
        width: 90%;
        height: 1px;
        background: #ebeef5;
        position: absolute;
        bottom: 0;
        left: 10px;
      }

      &.is-active {
        color: #002fa7;
        border-bottom: none;

        &::after {
          background: transparent;
        }

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
      font-weight: 500;
      font-size: 16px;
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
    color: #a9adb7;
  }

  /deep/.el-tree-node__content > .el-tree-node__expand-icon.expanded {
    color: #002ea6;
  }

  /deep/.el-tree-node__content > .el-tree-node__expand-icon.is-leaf {
    color: transparent;
  }

  /deep/.el-input__inner {
    font-size: 12px;
    margin: 5px 16px 5px 10px;
    width: 90%;
    padding: 0 10px;
    height: 28px;
    box-shadow: 0px 1px 5px 0px rgba(9, 20, 79, 0.1);
    border-radius: 2px;
    border: none;
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
    // max-height: 266px;
    // overflow: auto;
    .el-tree {
      background: #fafbfd;
    }
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
    padding: 10px 0px 5px 10px;
    background: #fafbfd;
  }

  .show-more {
    // padding-right: 20px;

    .icon {
      transform: rotate(90deg);
      -ms-transform: rotate(90deg);
      /* IE 9 */
      -moz-transform: rotate(0deg);
      /* Firefox */
      -webkit-transform: rotate(90deg);
      /* Safari 和 Chrome */
      -o-transform: rotate(90deg);
      /* Opera */
    }
  }

  .control-filter {
    padding: 4px 8px;
    border-radius: 4px;
    background: #ffa914;
    border-color: #ffa914;
  }

  .control-filter-fixed {
    width: 94px;
    height: 28px;
    background: #002fa7;
    box-shadow: 0px 1px 8px 0px rgba(9, 20, 79, 0.1);
    border-radius: 2px;
    position: fixed;
    z-index: 10;
    bottom: 10px;
    left: 19px;
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
  cursor: not-allowed !important;
  color: @NoPmsColor !important;

  * {
    cursor: not-allowed !important;
    color: @NoPmsColor !important;
  }
}

.abandon-click-method,
.yyxs-abandon-click-method {
  cursor: not-allowed !important;
  color: @NoPmsColor !important;
  text-decoration: none !important;

  &:hover {
    color: @NoPmsColor !important;
  }

  * {
    cursor: not-allowed !important;
  }
}
</style>
