<template>
  <div class="fs-dialog" :class="{ hide: nowNav === '' }">
    <div class="fs-header">
      <h1>
        {{ titles }}
      </h1>
      <slot name="back">
        <span class="esc-btn" @click="handleDialogOut()">返回</span>
      </slot>
    </div>
    <div class="cont">
      <div class="menu">
        <div
          class="nav"
          v-for="(item, index) in navs"
          :key="index"
          :class="{ active: item === nowNav }"
          @click="navToContent(item, index)"
        >
          {{ item }}
        </div>
      </div>
      <div
        class="right-wrap"
        v-for="(item, index) in navs"
        :key="index"
        :class="{ hide: item !== nowNav }"
      >
        <!-- <div class="right-wrap-in"> -->
        <div class="wrap-head">
          <span class="head-title"
            >{{ item }}
            <el-tooltip v-if="showDesc" effect="light" placement="right">
              <div slot="content" v-html="showDesc"></div>
              <i class="el-icon-question cl-green"></i> </el-tooltip
          ></span>
        </div>
        <div class="wrap-in">
          <slot class="wrap-content" :name="item"></slot>
        </div>
        <!-- </div> -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    // 不为空就显示说明文字
    showDesc: {
      type: String
    },
    titles: {
      type: String,
      default: ""
    },
    nowNav: {
      // 当前栏目（同时还控制全屏的显示与隐藏）=>建议：放在父组件对应的vuex的state内
      type: String,
      default: ""
    },
    navs: {
      // 导航条类目
      type: Array,
      default: []
    }
  },
  watch: {},
  methods: {
    navToContent(name, index) {
      // 点击导航条类目，左右对应的激活情况改变
      this.$emit("changeNowNav", name);
      this.nowNav = name;
    },
    handleDialogOut() {
      // 点击隐藏（关闭）全屏=>（需要在引用此组件的父组件添加一个emit的对应方法，并在组件内@close=对应方法，这个对应的方法需要控制vuex内的nowNav为空字符串）
      this.$emit("close");
    }
  },
  created() {}
};
</script>

<style lang="less">
@import "~@/assets/less/app.less";
@import "~@/assets/less/var.less";
.hide {
  display: none;
}
.fs-dialog {
  padding: 0 10px 10px 10px;
  position: absolute;
  z-index: 1000;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background-color: @PrimaryBackgroundColor;
  overflow: auto;
  box-sizing: border-box;

  .fs-header {
    height: 40px;
    line-height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    h1 {
      font-size: 18px;
      font-weight: bold;
      margin: 0;
    }
    .esc-btn {
      align-self: flex-end;
      font-size: 13px;
      line-height: 1;
      cursor: pointer;
    }
    .conf-log {
      font-size: 12px;
      color: #999;
      line-height: 1;
      text-align: right;
    }
    .top-update-wrap {
      margin-right: 0;
    }
    .el-breadcrumb {
      padding-right: 0;
    }
  }
  .cont {
    display: flex;
    justify-content: space-between;
    position: relative;
  }
  .menu {
    .nav {
      width: 180px;
      padding-left: 20px;
      line-height: 40px;
      border-left: 4px solid @PrimaryBackgroundColor;
      border-bottom: 1px dashed @BorderColor;
      cursor: pointer;
      font-size: 14px;
      box-sizing: border-box;
      &.active,
      &:hover {
        border-left: 4px solid @PrimaryColor;
        border-bottom: 0px;
        background-color: #fff;
        box-shadow: @BoxShadow;
      }
    }
  }
  .right-wrap {
    flex: 1;
    margin-left: 10px;
    box-shadow: @BoxShadow;
    box-sizing: border-box;
    .right-wrap-in {
      box-shadow: @BoxShadow;
      box-sizing: border-box;
    }
    .wrap-in {
      background: #fff;
      padding-bottom: 1px;
    }
    .wrap-head {
      padding-left: 20px;
      line-height: 40px;

      .head-title {
        font-size: 14px;
      }
    }
  }
}
@media screen and (min-device-width: 1026px) and (max-device-width: 1367px) {
  .fs-dialog .menu .nav {
    width: 140px;
  }
  .fs-dialog .right-wrap {
    width: calc(100% - 168px) !important;
    left: 168px;
  }
  #yzxpj .jd-box .column-title li {
    width: 155px;
  }
  #yzxpj .jd-box .data-list ul li {
    width: 155px;
  }
}
</style>
