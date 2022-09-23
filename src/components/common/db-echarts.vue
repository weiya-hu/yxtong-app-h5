<template>
  <div class="chart-box">
    <div class="chart-title">{{ title }}
      <el-tooltip v-if="statement" class="" effect="zhuce" placement="right">
        <div slot="content" v-html="statement"></div>
        <i class="el-icon-question cl-green" style="margin-left: 4px; line-height: 28px"></i>
      </el-tooltip>

      <span style="margin-left: 30px;" v-if="title == '同品种国家排行'">{{ gjCname }}</span>
      <span style="margin-left: 30px;" v-if="title == '同品种上市趋势'">{{ shCname }}</span>
    </div>
    <!-- 插槽 - 插入echarts（最好是具名id） -->
    <slot></slot>
  </div>
</template>

<script>
export default {
  data() {
    return {

    }
  },
  props: {
    gjCname: {
      type: String,
      default: () => {
        return ''
      }
    },
    shCname: {
      type: String,
      default: () => {
        return ''
      }
    },
    statement: {
      type: String,
      default: () => {
        return ''
      }
    },
    title: {
      type: String,
      default: () => {
        return ''
      }
    }
  },
  mounted() {

  },
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/app.less";
@import "~@/assets/less/var.less";

.chart-box {
  box-sizing: border-box;
  position: relative;
  display: inline-block;
  margin: 5px 0px;
  width: calc(50% - 5px);
  background-color: @White;
  box-shadow: @BoxShadow;
  overflow: hidden;
  transition: all 300ms;
  border-radius: 4px;

  &:nth-child(1) {
  }

  canvas {
    width: 100% !important;
  }

  .chart-title {
    box-sizing: border-box;
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    padding-left: 10px;
    line-height: 40px;
    background-color: @GrayBackgroundColor;
    border-radius: 3px 3px 0 0;

    &::before {
      content: '';
      display: block;
      position: absolute;
      width: 6px;
      height: 40px;
      background-color: @PrimaryColor;
      left: 0;
      top: 0;

      border-radius: 3px;
    }

    // border-left: 5px solid @PrimaryColor;
  }

  .cp-echarts {}

  &:hover {
    transition: all 300ms;
    box-shadow: @BoxShadowHover;
  }

  &:last-child {
    margin-bottom: 0;
  }
}

@media screen and (max-width: 1500px) {
  .chart-box {
    width: 100%;
  }
}
</style>
