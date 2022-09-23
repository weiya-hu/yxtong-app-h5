<template>
  <div
    v-if="hasFilters"
    class="filter item"
    :class="{
      'abandon-click-method': nopms && nopms.tjsx,
      'is-disabled': nopms && nopms.tjsx
    }"
  >
    <span class="item-title">条件筛选</span>
    <!-- {{keys}} -->
    <el-collapse>
      <template v-for="(key, index) in keys">
        <el-collapse-item
          v-if="filters[key].data.length > 0"
          :name="key"
          :key="index"
          :disabled="nopms && nopms.tjsx"
        >
          <template slot="title">
            <NewProjectGuide
              :onlyKey="filters[key]['new_id']"
              :newPosition="{
                right: filterContrast(filters[key].label) ? -40 : -26
              }"
              display="inline"
              compoentsName="筛选功能"
              postion="条件"
              :initItem="filters[key]"
              :showMenban="filters[key]['is_show_new']"
              >{{ filters[key].label }}</NewProjectGuide
            >
            <!-- {{filters[key].label}} -->
            <el-tooltip
              v-if="filterContrast(filters[key].label)"
              effect="light"
              placement="right"
            >
              <div
                slot="content"
                v-html="filterContrast(filters[key].label)"
              ></div>
              <i class="el-icon-question cl-green"></i>
            </el-tooltip>
          </template>
          <el-checkbox-group v-model="checked[key]" @change="handleChange">
            <el-checkbox
              v-for="type in filters[key].data"
              :label="type.key"
              :key="type.key"
              @change="changeBox(key, type)"
            >
              <!-- <span v-if="type.key !== type.label">[{{type.key}}]</span> -->
              <span>{{ type.label }}</span>
              <span class="num">({{ type.doc_count }})</span>
            </el-checkbox>
          </el-checkbox-group>
          <div class="controls">
            <a
              v-if="filters[key].data.length > filter_default_len"
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
    </el-collapse>
  </div>
</template>

<script>
import { mapState } from "vuex";
//筛选条件默认显示数 修改此值 需要修改对应的css值
const FILTER_DEFAULT_SHOW_LENGTH = 5;
export default {
  props: {
    vuex_name: {
      // 必须！
      type: String,
      default: ""
    }
  },
  data() {
    return {
      checked: {},
      filter_default_len: FILTER_DEFAULT_SHOW_LENGTH
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
      // console.info(Store.state[this.vuex_name].filters)
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
      return Object.keys(this.filters);
    },
    hasFilters() {
      let FIE = false;
      if (this.filters && Object.keys(this.filters).length) {
        for (let key in this.filters) {
          if (this.filters[key].data.length) {
            FIE = true;
          }
        }
      }
      return FIE;
    }
  },
  mounted() {},
  methods: {
    init() {
      let _this = this;
      for (let key in this.filters) {
        this.$set(
          this.checked,
          key,
          this.groups == undefined ? [] : this.groups[key] || []
        );
      }
      _this.filters1.forEach(element => {
        let key = element.field;
        if (_this.filters[key]) {
          _this.filters[key] = Object.assign({}, element, _this.filters[key]);
        }
      });
      // console.log(this.filters)
    },
    handleChange() {
      this.$emit("change", this.checked);
    },
    changeBox(type, obj) {
      let shaixuan = this.storeState.match_shaixuan_values;
      shaixuan[type] = shaixuan[type] ? shaixuan[type] : {};
      shaixuan[type][obj.key] = obj.label;
      Store.commit(
        this.vuex_name + "/match_shaixuan_values",
        _.assign({}, this.storeState.match_shaixuan_values, shaixuan)
      );

      this.checked[obj.label];
      const { params } = this.$route;
      if (params.dbname) {
        window.ga(
          "send",
          "event",
          "option",
          "click",
          params.dbname + "_filter_condition_" + type + "_" + obj.label
        );
        window._paq.push([
          "trackEvent",
          "option",
          "click",
          params.dbname + "_filter_condition_" + type + "_" + obj.label
        ]);
      }
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
      Store.dispatch(this.vuex_name + "/nomalSearch");
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
    filterContrast(txt) {
      let arrFiter = this.filters1.filter((el, ix, arr) => {
        return el.label === txt;
      });
      return arrFiter.length ? arrFiter[0].statement : false;
    }
  },
  watch: {
    filters() {
      this.init();
    },
    groups() {
      this.init();
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
  // &.abandon-click-method {
  //   .el-collapse-item {
  //     pointer-events: none;
  //     .el-collapse-item__header {
  //       color: @NoPmsColor!important;
  //     }
  //   }
  // }

  /deep/ .el-collapse-item__content {
    padding-bottom: 0;
    font-size: @FontSizeSmall;
  }

  .el-collapse {
    border: 0px;
  }
  .el-collapse-item {
    padding: 0px 14px 0 10px;
    .el-checkbox-group {
      max-height: 24 * 5px; /*5是与FILTER_DEFAULT_SHOW_LENGTH的值保持一致*/
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
    // &.is-active {
    //   border-left: 2px solid @PrimaryColor;
    //   padding-left: 18px;
    // }
    /deep/.el-collapse-item__header {
      height: 30px;
      line-height: 30px;
      border-bottom: 1px dashed #DFE5F1;
      margin-bottom: 1px;
      color: #333;
      font-size: @FontSizeSmall;
      &.is-active {
        color: @PrimaryColor;
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
  .el-checkbox {
    display: block;
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

  .green {
    color: #90c31f;
  }
}

.is-disabled {
  cursor: not-allowed !important;
  color: @NoPmsColor !important;
  * {
    color: @NoPmsColor !important;
    cursor: not-allowed !important;
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
</style>
