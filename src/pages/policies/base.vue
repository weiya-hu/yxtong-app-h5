<template>
  <div>
    <Main class="policies-base">
      <!-- 保存条件 - 输入名称 弹出框 -->
      <el-dialog class="dialog-saved" :visible.sync="savedPopVisible" :modal-append-to-body="false">
        <div slot="title" class="dialog-header">保存条件</div>
        <SavedPop @closeSavedPop="closeSavedPop" vuex_name="Policies"></SavedPop>
      </el-dialog>

      <!-- 高级搜索弹出框 -->
      <el-dialog :visible.sync="dialogFormVisible" :modal-append-to-body="false" width="815px">
        <div slot="title" class="dialog-header">高级搜索</div>

        <Advanced :dialogFormVisible="dialogFormVisible" vuex_name="Policies" api_name="policies" route1="list"
          @closeAdvancedDialog="closeAdvancedDialog" @clearLeft="clearLeft" ref="advanced"></Advanced>
      </el-dialog>

      <!-- 左边部分 -->
      <div slot="left" style="position: relative">
        <!-- 普通搜索项 -->
        <template v-for="(item, index) in vueHandleInitPutong(nomal_filed)">
          <Normal @nomalSearch="nomalSearch" vuex_name="Policies" api_name="policies" :item="item" route1="list"
            :key="index" ref="ileft"></Normal>
        </template>

        <!-- 普通搜索按钮 & 高级搜索入口 -->
        <div class="advanced-search">
          <!-- 高级搜索 -->
          <span class="fr adva-icon">
            <a @click.prevent="handleAdvancedClick()" :class="{ 'abandon-click-method': nopms.gjss }"
              class="gjss">高级检索模式</a>
            <el-tooltip class="item" effect="light" placement="right" v-if="helpInfo.high_holder">
              <div slot="content" v-html="helpInfo.high_holder"></div>
              <img src="../../assets/imgs/policy/proplem.png" alt="" style="vertical-align: middle" />
            </el-tooltip>
          </span>
          <!-- 普通搜索 -->
          <el-button class="advanced-search-btn" type="primary" size="mini" round @click="nomalSearch">搜索</el-button>
        </div>

        <!-- 条件筛选 -->
        <Filters vuex_name="Policies" route1="list" ref="policiesFilter"></Filters>

        <!-- 保存的条件 -->
        <Saved vuex_name="Policies" api_name="policies"></Saved>
        <!-- 历史搜索 -->
      </div>
      <div class="la-right">
        <List></List>
      </div>
    </Main>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Main from "@/components/layouts/main";
import Saved from "@/components/common/saved";
import SavedPop from "@/components/common/saved-pop";
import Normal from "@/components/common/normal";
import Advanced from "@/components/common/advanced";
import Filters from "@/components/common/policies/filters-config";
import List from "./list";
export default {
  components: {
    List,
    Main,
    Saved,
    SavedPop,
    Normal,
    Advanced,
    Filters,
  },
  computed: {
    ...mapState({
      helpInfo: (state) => state.Policies.helpInfo,
      allBase: (state) => state.Policies.allBase,
      nomal_filed: (state) => state.Policies.nomal_filed,
      advanced_filed: (state) => state.Policies.advanced_filed,
      putong: (state) => state.Policies.putong,
      nopms: (state) => state.Policies.nopms,
      showPromtNotice: (state) => state.showPromtNotice,
    }),
  },
  data() {
    return {
      savedPopVisible: false,
      dialogFormVisible: false, //控制高级搜索弹框
      route: this.$route.path.split("/")[2],
      basic: {},
      api_name: "policies",
    };
  },
  watch: {
    showPromtNotice(val) {
      if (val) {
        $(".policies-base .la-left-side").css("paddingBottom", "85px");
      } else {
        $(".policies-base .la-left-side").css("paddingBottom", "55px");
      }
    },
  },
  methods: {
    //获取普通搜索
    nomalSearch() {
      window.ga(
        "send",
        "event",
        "tab",
        "click",
        "企业版_政策法规_普通搜索_搜索"
      );
      window._paq.push([
        "trackEvent",
        "tab",
        "click",
        "企业版_政策法规_普通搜索_搜索",
      ]);
      // Store.commit("Globaldrugs/conditions", []);
      //清空高级搜索条件和筛选项
      // Store.commit("Globaldrugs/groups", {});
      if (this.route == "list") {
        // Store.dispatch("Globaldrugs/nomalSearch");
        this.$refs.policiesFilter.searchFilter();
      }
    },
    // 关闭保存条件框
    closeSavedPop() {
      this.savedPopVisible = false;
    },
    showSavedPop() {
      this.savedPopVisible = true;
    },
    // 点击左侧栏中的“高级搜索”触发的事件
    handleAdvancedClick() {
      if (!this.nopms.gjss) {
        this.dialogFormVisible = true;

        if (this.$refs.advanced) {
          // 第一次点击之后才渲染，所以加此判定
          this.$refs.advanced.initConditions();
        }
      }
      window.ga(
        "send",
        "event",
        "botton",
        "click",
        "advanced_search",
        "search"
      );
      window._paq.push([
        "trackEvent",
        "botton",
        "click",
        "advanced_search",
        "search",
      ]);
    },
    // 关闭高级搜索框（可能并没有起作用，可有可无）
    closeAdvancedDialog() {
      this.dialogFormVisible = false;
    },
    // 高级搜索框中：点击搜索后，清空左侧普通搜索内容（仅肉眼）事件
    clearLeft() {
      this.vueClearLeft();
    },
  },
  mounted() {
    Store.dispatch("Policies/getBaseInfo").then(() => {
      this.vueTogglePmsTooltip();
    });
    this.vueRouteFrom("Policies");
  },
};
</script>
<style lang="less">
.policies-base {
  .el-dialog .el-dialog__header .dialog-header {
    color: #09144f;

    &::before {
      background-color: #09144f;
    }
  }

  .el-dialog .el-dialog__header .el-dialog__headerbtn .el-dialog__close {
    color: #09144f !important;
  }

  .dialog-footer {

    .el-button:focus,
    .el-button:hover {
      color: #09144f;
      border-color: #dfe5f1;
    }

    .ad-search {
      background-color: #09144f;
      border-color: #09144f;

      &:hover {
        color: #fff;
      }
    }
  }

  .btn-advanced-add {
    color: #09144f !important;
    background-color: #fff;
    border: 1px solid #09144f !important;

    &:hover {
      color: #fff !important;
      background-color: #09144f !important;
    }
  }

  .el-input.is-focus .el-input__inner,
  .el-input__inner:focus {
    border-color: #09144f;
  }

  .la-left-side {
    padding-bottom: 55px;
    background-color: #fafbfd !important;
    margin-top: 10px;

    .gjss {
      color: #002fa7;
      font-weight: 500;
      position: relative;
      font-size: 14px;

      &:hover {
        text-decoration: none;
      }
    }

    .gjss::after {
      content: "";
      width: 84px;
      height: 1px;
      background: #002fa7;
      position: absolute;
      bottom: -4px;
      left: 0;
    }

    .la-input .title {
      font-size: 14px;
      font-weight: 500;
      color: #333333;
    }

    .la-input .el-input {
      font-size: 14px;
    }

    .la-input .el-input .el-input__inner {
      border-radius: 3px;
      border-color: #dcdfe6;
    }

    .el-checkbox__input.is-checked .el-checkbox__inner,
    .el-checkbox__input.is-indeterminate .el-checkbox__inner {
      background-color: #df9008;
      border-color: #df9008;
    }

    .el-checkbox__inner {
      border-color: #9aa4b8;
      width: 14px;
      height: 14px;
      margin-right: 5px;
      position: relative;
      top: -1px;
    }

    .el-checkbox__input.is-checked+.el-checkbox__label,
    .el-checkbox__input.is-checked+.el-checkbox__label .num {
      color: #df9008 !important;
    }

    .el-checkbox.is-checked+.custom-tree-node,
    .el-checkbox.is-checked+.custom-tree-node .num {
      color: #df9008 !important;
    }

    .custom-tree-node {
      font-size: 14px;
    }

    .el-checkbox__inner::after {
      border-color: #fff;
    }

    .el-checkbox__label {
      font-size: 14px;
      color: #333333;
      font-weight: 400;
    }
  }

  .advanced-search {
    position: fixed;
    z-index: 10;
    bottom: 5px;
    left: 0;
    width: 288px;
    box-sizing: border-box;
    align-items: center;
    background: #fff;
  }

  .advanced-search-btn {
    background: #182462;
    padding: 7px 0px;
    font-size: 14px;
  }

  @media screen and (max-width: 1280px) {
    .advanced-search {
      width: 260px;
    }
  }
}

.pc-policies-list {
  .la-app-main {
    background: #F5F8FC !important;
  }
}
</style>