<template>
  <div class="slide-section">
    <div class="header" v-if="title">
      <div class="lc">{{ title }}</div>
      <el-tooltip class="" effect="light" placement="right" v-if="title === '试验历程'">
        <div slot="content">计划日期由试验登记者提供。</div>
        <i class="el-icon-question cl-green" style="margin-left:4px;"></i>
      </el-tooltip>
      <el-tooltip class="" effect="light" placement="right" v-else-if="title === '批准历程'">
        <div slot="content">按照活性成分的最早批准时间排列。</div>
        <i class="el-icon-question cl-green" style="margin-left:4px;"></i>
      </el-tooltip>
      <slot name="header"></slot>
    </div>
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    title: {
      type: String,
      default: ""
    }
  }
};
</script>

<style lang="less" scoped>
@import "~@/assets/less/var.less";
@topbottom: 30px;

.slide-section {
  box-shadow: @BoxShadow;
  margin-bottom: 10px;
  transition: all 500ms;
  border-radius: 4px;
  width: 100%;
  overflow: hidden;

  .header {
    height: 40px;
    line-height: 40px;
    background: @PrimaryBackgroundColor;
    position: relative;
    display: flex;
    align-items: center;

    .lc {
      font-size: 16px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      color: #545b6d;
      margin: 11px 0 12px 20px;
    }
  }

  .content {
    background: #fff;
    // padding: 0 0 0 20px;
  }

  .tb-wrap {
    padding: 10px;

    .td-line2 {
      max-height: 46px;
      overflow-y: auto;
    }

    .td-line3 {
      max-height: 69px;
      overflow-y: auto;
    }

    .td-line5 {
      max-height: 115px;
      overflow-y: auto;
    }
  }

  .tb-t,
  .tb-f {
    width: 100%;
    margin-bottom: 10px;

    tr {
      td {
        box-sizing: border-box;
        height: 32px;
        border: 1px solid @BorderColorNew;
        font-size: 13px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #545b6d;
        line-height: 32px;
        padding: 0 0 0 2%;
        font-size: 13px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #545b6d;

        // max-width: 30vw;
        &:nth-child(odd) {
          min-width: 110px;
          width: 180px;
          background: @DetailTableLeftColor;
        }

        &:nth-child(even) {
          width: 30vw;
          min-width: 270px;
          word-wrap: break-word;
          word-break: break-all;
          white-space: normal;
          background: @DetailTableRightColor;
          line-height: 23px;
        }

        &:nth-child(2n) {
          padding: 0 0 0 2%;
        }
      }
    }
  }

  .extend-list {
    padding: 20px 0 45px 60px;
  }
}

.slide-section.zc-time-node {
  .content {
    padding-left: 0;
  }
}

.slide-section:hover {
  box-shadow: @BoxShadowHover;
  transition: all 500ms;

  .lc {
    color: @PrimaryColor;
    transition: all 500ms;
    position: relative;
  }
}

.the-part {
  position: relative;

  .detail-title {
    position: relative;
    height: 36px;
    padding-left: 35px;
    line-height: 28px;
    border-bottom: 1px solid #dfe5f1;

    >.in {
      position: relative;
      top: 5px;
      display: inline-block;
      padding: 0px 5px;
      font-size: 14px;
      color: #4877e8;
      border-bottom: 3px solid #4877e8;
    }

    >.rela-span {
      position: relative;
      top: 4px;
      left: 6px;
      font-size: 14px;
    }
  }
}

@media screen and (min-width: 1401px) and (max-width: 1600px) {
  .slide-section {
    .content {
      .extend-list {
        padding: 20px 0 45px 60px;
      }
    }
  }
}

@media screen and (max-width: 1400px) {
  .slide-section {
    .content {
      .extend-list {
        padding: 20px 0 45px 60px;
      }
    }
  }
}
</style>
