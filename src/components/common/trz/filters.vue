<template>
  <transition name="el-zoom-in-top" appear>
    <div v-if="hasFilters">
      <div
        class="filter item"
        :class="{
          'abandon-click-method': nopms && nopms.tjsx,
          'is-disabled': nopms && nopms.tjsx,
        }"
      >
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
                  <template slot="title">
                    <span>{{ getFiltersCname(key) }}</span>
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

                  <!-- 多级下拉 -->
                  <div
                    v-if="
                      key === 'country' ||
                      key === 'applicationscenarios' ||
                      key === 'technology' ||
                      key === 'guifan_therapeuticarea' ||
                      key === 'product' ||
                      key === 'guifan_cooperationtype'
                    "
                    style="position: relative"
                  >
                    <div v-show="searchLoading" class="trees-loading">
                      <span class="turn"></span>
                    </div>
                    <el-input
                      placeholder="输入关键字进行过滤"
                      v-model="filterText[key]"
                      @input="filterChange(index, key)"
                      @change="filterChange(index, key)"
                    >
                    </el-input>
                    <div class="trees">
                      <el-tree
                        node-key="key"
                        class="filter-tree"
                        :class="{
                          applicationscenarios: key === 'applicationscenarios',
                        }"
                        :data="filters[key]"
                        :props="{ children: 'children', label: 'label' }"
                        show-checkbox
                        :default-checked-keys="getDefaultCheckedKey(key)"
                        :default-expanded-keys="defaultExpanded"
                        :filter-node-method="filterNode"
                        @check="
                          (data, checkTree) =>
                            checkGA(key, data, index, checkTree)
                        "
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
                        :check-strictly="key !== 'technology'"
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
                      <span class="num">({{ type.doc_count }})</span>
                    </el-checkbox>
                  </el-checkbox-group>
                  <div
                    class="controls"
                    v-if="
                      filters[key].length > filter_default_len &&
                      key !== 'country' &&
                      key !== 'applicationscenarios' &&
                      key !== 'technology' &&
                      key !== 'guifan_therapeuticarea' &&
                      key !== 'product' &&
                      key !== 'guifan_cooperationtype'
                    "
                  >
                    <a
                      class="show-more pr20"
                      href="javascript:;"
                      @click="showMore"
                    >
                      <span>更多</span>
                      <i class="icon el-icon-d-arrow-right"></i>
                      <!-- <i class="icon el-icon-d-arrow-left"></i> -->
                    </a>

                    <!-- <el-button
                      class="control-filter"
                      size="mini"
                      type="primary"
                      @click="searchFilter"
                      >筛选</el-button
                    > -->
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
  },
  data() {
    return {
      defaultExpanded: [],
      defaultExpanded2: [],
      filterText: {
        country: "",
        applicationscenarios: "",
        guifan_therapeuticarea: '',
        product: '',
        technology: "",
        guifan_cooperationtype: ''
      },
      filterText2: "",
      checked: {},
      activeNames: [],
      filterList: [],
      filter_default_len: FILTER_DEFAULT_SHOW_LENGTH,
      filterKeys: [],
      city: [],
      province: [],
      country: [],
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
    shaixuan() {
      return Store.state[this.vuex_name].shaixuan;
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
      let arr = _.orderBy(this.filters1, ["sort"], ["desc"]),
        keys = [];
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
    getDefaultCheckedKey(key) {
      console.log(key);
      if (key === "country") {
        let arr = [...this.country, ...this.province, ...this.city];
        return arr;
      } else if (key === "applicationscenarios" || key === "technology" || key === 'guifan_therapeuticarea' || key ==='product' || key === 'guifan_cooperationtype') {
        return this.checked[key];
      }
    },
    handlerTreeData(key) {},
    checkChange(data, checkTree, checkTreeChild, index, key) {
      console.log(data, checkTree, checkTreeChild, index, key);
      if (
        data.filed === "city" ||
        data.filed === "province" ||
        data.filed === "country"
      ) {
        let nodes = this.$refs["tree" + index][0].getCheckedNodes();
        this.city = [];
        this.province = [];
        this.country = [];
        this.checked["city"] = [];
        this.checked["country"] = [];
        this.checked["province"] = [];
        nodes.map((v) => {
          if (v.filed === "city") {
            this.city.push(v.key);
            this.checked["city"] = [...new Set(this.city)];
          } else if (v.filed === "province") {
            this.province.push(v.key);
            this.checked["province"] = [...new Set(this.province)];
          } else if (v.filed === "country") {
            this.country.push(v.key);
            this.checked["country"] = [...new Set(this.country)];
          }
        });
      } else {
        this.checked[key] = this.$refs["tree" + index][0].getCheckedKeys();
      }

      //  console.log(nodes,this.city,this.province,this.country)

      console.log(this.checked);
    },
    filterChange(index, key) {
      this.$refs["tree" + index][0].filter(this.filterText[key]);
    },
    filterNode(value, data) {
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
      console.log(this.groups);
      for (let key in this.filters) {
        this.$set(
          this.checked,
          key,
          this.groups == undefined ? [] : this.groups[key] || []
        );
      }
      for (const [key, val] of Object.entries(this.filters)) {
        console.log(this.filters1, this.filters);
        this.filters1.forEach((item2) => {
          item2.sort = Number(item2.sort);
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
      if (this.checked.country) this.country = this.checked.country;
      if (this.groups.province) {
        this.checked["province"] = this.groups.province;
        this.province = this.groups.province;
        let shaixuan = this.storeState.match_shaixuan_values;
        this.province.map((v) => {
          shaixuan["province"] = shaixuan["province"]
            ? shaixuan["province"]
            : {};
          shaixuan["province"][v] = v;
        });
        Store.commit(
          this.vuex_name + "/match_shaixuan_values",
          _.assign({}, this.storeState.match_shaixuan_values, shaixuan)
        );
      }
      console.log(this.filters);
      console.log(this.checked);
      // this.initActive()
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
      console.log(key, data, checkTree);
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
        this.vuex_name + "_filter_condition_" + key + "_" + data.label,
      ]);
      // debugger
      let shaixuan = this.storeState.match_shaixuan_values;
      if (checkTree && checkTree.checkedNodes.length > 0) {
        checkTree.checkedNodes.map((v) => {
          if (v.filed === "city") {
            shaixuan["city"] = shaixuan["city"] ? shaixuan["city"] : {};
            shaixuan["city"][v.key] = v.label;
          } else if (v.filed === "province") {
            shaixuan["province"] = shaixuan["province"]
              ? shaixuan["province"]
              : {};
            shaixuan["province"][v.key] = v.label;
          } else if (v.filed === "country") {
            shaixuan[key] = shaixuan[key] ? shaixuan[key] : {};
            shaixuan["country"][v.key] = v.label;
          } else {
            shaixuan[key] = shaixuan[key] ? shaixuan[key] : {};
            shaixuan[key][data.key] = data.label;
          }
        });
      } else {
        shaixuan[key] = shaixuan[key] ? shaixuan[key] : {};
        shaixuan[key][data.key] = data.label;
      }
      // if (data.filed === 'city') {
      //   shaixuan['city'] = shaixuan['city'] ? shaixuan['city'] : {};
      //   shaixuan['city'][data.key] = data.label;
      // } else if (data.filed === 'province') {
      //   shaixuan['province'] = shaixuan['province'] ? shaixuan['province'] : {};
      //   shaixuan['province'][data.key] = data.label;
      // } else {
      //   shaixuan[key] = shaixuan[key] ? shaixuan[key] : {};
      //   shaixuan[key][data.key] = data.label;
      // }
      console.log(this.checked);
      Store.commit(
        this.vuex_name + "/match_shaixuan_values",
        _.assign({}, this.storeState.match_shaixuan_values, shaixuan)
      );
      console.log(shaixuan);
    },
    nodeExpand(d, a, f) {
      let start = document.querySelector(".trees").scrollLeft;
      let end = a.level > 1 ? a.level * 18 + 6 : 24;

      this._easeout(start, end, 2, function (value) {
        document.querySelector(".trees").scrollLeft = value;
      });
    },
    nodeCollapse(d, a, f) {
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
  },
  watch: {
    filters: {
      handler() {
        this.init();
      },
      immediate: true,
    },
    groups() {
      this.filterText = {
        country: "",
        applicationscenarios: "",
        guifan_therapeuticarea: '',
        guifan_cooperationtype: '',
        product: '',
        technology: "",
      };
      this.init();
    },
    searchLoading(val) {
      if (!val) {
        this.defaultExpanded = this.checked["country"];
        this.defaultExpanded = this.checked["applicationscenarios"];
        this.defaultExpanded = this.checked["guifan_therapeuticarea"];
        this.defaultExpanded = this.checked["guifan_cooperationtype"];
        this.defaultExpanded = this.checked["product"];
        this.defaultExpanded = this.checked["technology"];
      }
    },
    shaixuan: {
      deep: true, //深度监听设置为 true
      handler(newV, oldV) {
        if (Object.keys(newV).length === 0) {
          this.country = [];
          this.province = [];
          this.city = [];
          delete this.checked["city"];
          delete this.checked["province"];
        }
      },
    },
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
  },
  mounted() {
    // 默认展开第一个
    let arr = _.orderBy(this.filters1, ["sort"], ["desc"]),
      keys = [];
    arr.sort(function (a, b) {
      return b.sort - a.sort;
    });
    arr.forEach((item) => {
      keys.push(item.field);
    });
    console.log(arr);
    this.activeNames.push(keys[0]);
  },
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
  margin-top: 20px;
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
    padding: 10px 10px 0 10px;
    font-size: 13px;
  }

  /deep/ .el-collapse-item__wrap {
    border: 0;
  }

  .el-collapse-item {
    background: #f5f8fc;
    margin-bottom: 10px;
    box-sizing: border-box;
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

    /deep/.el-collapse-item__header {
      height: 28px;
      line-height: 28px;
      color: #09144f;
      font-size: 14px;
      background: #f5f8fc;
      padding: 0px 10px;
      font-weight: 600;
      border-bottom: none;
      &.is-active {
        color: #09144f;
      }
    }

    /deep/.el-collapse-item__arrow {
      color: #b5c3d3;
      line-height: 28px;
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
    /deep/ .el-checkbox__label {
      font-size: 13px;
      color: #333;
    }
  }
  .el-checkbox + .el-checkbox {
    margin-left: 0px;
  }
  .num {
    color: #333;
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

  /deep/ .el-checkbox__input.is-checked .el-checkbox__inner {
    background-color: #3556b9;
    border-color: #3556b9;
  }

  /deep/ .el-checkbox__input.is-checked + .el-checkbox__label {
    color: #3556b9;
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
  color: @NoPmsColor!important;
  text-decoration: none !important;
  &:hover {
    color: @NoPmsColor!important;
  }
  * {
    cursor: not-allowed !important;
  }
}

.applicationscenarios {
  /deep/ .el-tree-node__expand-icon.is-leaf {
    display: none;
  }
}
</style>
