<template>
  <!-- 搜索左侧 热点搜索 -->
  <transition name="el-zoom-in-top" appear>
    <div
      class="hot-filter item"
      v-if="hasHotFilters"
      :class="{ 'abandon-click-method': nopms && nopms.rdss }"
    >
      <div class="item-title">
        <span>热点搜索</span>
        <!-- <img width="15" src="~@/assets/imgs/globaldrugs/open_icon.png" alt="">
        <img width="15" src="~@/assets/imgs/globaldrugs/stow_icon.png" alt=""> -->
        <span class="shrink" v-if="isOpen" @click="handleOpen">+</span>
        <span class="shrink" v-else @click="handleStow">-</span>
      </div>
      <div class="hot-filter-box">
        <div class="hot-filter-lists">
          <div class="filter-lists_box">
            <div v-for="(key, index) in keys" :key="index">
              <el-checkbox-group v-model="checked[key]">
                <el-checkbox
                  :disabled="nopms && nopms.rdss"
                  v-for="item in hot_filed[key]"
                  :label="item.key"
                  :key="item.key"
                  @change="handleCheckedChange(item.key, item.param)"
                >
                  <span>
                    <!-- {{item.label}} -->
                    <NewProjectGuide
                      postion="热点"
                      :onlyKey="item['new_id']"
                      display="inline"
                      compoentsName="条件筛选"
                      :initItem="item"
                      :showMenban="item['is_show_new']"
                      >{{ item.label }}</NewProjectGuide
                    >
                  </span>
                  <span class="num">({{ item.doc_count }})</span>
                </el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
        </div>
        <el-button
          class="control-filter"
          :disabled="nopms && nopms.rdss"
          size="mini"
          type="primary"
          @click="search"
          >确定
        </el-button>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapState } from "vuex";
export default {
  props: {
    vuex_name: {
      //必须有
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
      checked: {}, // 存储数据
      isOpen: false, // 默认展开
    };
  },
  computed: {
    ...mapState({
      allBase: (state) => state.Zhuce.allBase,
      helpInfo: (state) => state.Zhuce.helpInfo,
      nomal_filed: (state) => state.Zhuce.nomal_filed,
      advanced_filed: (state) => state.Zhuce.advanced_filed,
      baseCount: (state) => state.Zhuce.extendCount.BaseCount,
      putong: (state) => state.Zhuce.putong,
      nopms: (state) => state.Zhuce.nopms,
      norules: (state) => state.Zhuce.norules,
    }),
    route() {
      // route 从 data 移动到 computed，防止固化
      return this.$route.path.split("/")[2];
    },
    hot_filed() {
      return Store.state[this.vuex_name].hot_filter_filed;
    },
    hot_checked() {
      return Store.state[this.vuex_name].hot_checked;
    },
    keys() {
      return _.keys(this.hot_filed);
    },
    nopms() {
      return Store.state[this.vuex_name].nopms;
    },
    hasHotFilters() {
      let FIE = false;
      if (this.hot_filed && Object.keys(this.hot_filed).length) {
        for (let key in this.hot_filed) {
          if (this.hot_filed[key].length) {
            FIE = true;
          }
        }
      }
      return FIE;
    },
  },
  methods: {
    init() {
      for (let key in this.hot_filed) {
        this.$set(
          this.checked,
          key,
          this.hot_checked == undefined
            ? new Array()
            : this.hot_checked[key] || new Array()
        );
      }
    },
    //搜索
    search() {
      if (this.nopms && this.nopms.rdss) {
        return false;
      }
      Store.commit(this.vuex_name + "/hot_checked", this.checked);
      if (this.route) {
        if (this.route == this.route1) {
          Store.dispatch(this.vuex_name + "/nomalSearch");
        } else if (this.route == this.route2) {
          Store.dispatch(this.vuex_name + "/getKshRes");
        } else if (this.route == this.route3) {
          Store.dispatch(this.vuex_name + "/getKshRes");
        } else if (this.route == this.route4) {
          if (this.vuex_name == "Zhuce") {
            Store.dispatch(this.vuex_name + "/getKshRes_Breed");
          }
        }
      } else {
        Store.dispatch(this.vuex_name + "/nomalSearch");
      }
    },
    handleCheckedChange(key, param) {
      window.ga(
        "send",
        "event",
        "option",
        "click",
        "企业版_全球药物_热点搜索"
      );
      window._paq.push([
        "trackEvent",
        "option",
        "click",
        "企业版_全球药物_热点搜索"
      ]);
    },

    // 展开
    handleOpen() {
      window.ga("send", "event", "button", "click", "企业版_全球药物_热点搜索_展开");
      window._paq.push([
        "trackEvent",
        "button",
        "click",
        "企业版_全球药物_热点搜索_展开",
      ]);
      $('.hot-filter-box').show(500)
      this.isOpen = false
    },

    // 收起
    handleStow() {
      window.ga("send", "event", "button", "click", "企业版_全球药物_热点搜索_收起");
      window._paq.push([
        "trackEvent",
        "button",
        "click",
        "企业版_全球药物_热点搜索_收起",
      ]);
      $('.hot-filter-box').hide(500)
       this.isOpen = true
    },
  },
  created() {
    this.init();
  },
  watch: {
    hot_filed() {
      this.init();
    },
    hot_checked() {
      this.init();
    },
  },
};
</script>

<style lang="less" scoped>
@import "~@/assets/less/var.less";

.item {
  // padding-bottom: 10px;
}

.hot-filter {
  .hot-filter-box {
    background: #FAFBFD;
    padding-bottom: 10px;
  }
  .hot-filter-lists {
    padding: 10px 14px 10px 10px;
    overflow: hidden;

    .filter-lists_box {
      overflow-x: auto;
      width: 205px;
    }
  }

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
      background: #002FA7;
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
    margin-left: 18px;
    font-size: @FontSizeSmall;
    border-radius: 4px;
    padding: 4px 8px;
    border-radius: 4px;
    background: #FFA914;
    border-color: #FFA914;
  }
}

.el-zoom-in-top-enter-active {
  transition: all 0.5s;
}

.el-zoom-in-top-leave-active {
  transition: all 0.5s;
}
</style>

