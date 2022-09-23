<template>
  <div class="data-nav" :style="{ minHeight: `calc(100vh - 40px - 48px - ${ (showPromtNotice ? 30 : 0) + 'px'}` }">
    <div class="dn-title">
      <i class="iconfont font-nav">&#xe601;</i>
      <span class="icon-nav-content">数据导航
        <el-tooltip
          class="item tooltips-position"
          effect="light"
          placement="right"
        >
          <div
            slot="content"
          >呈现关键词模糊匹配到的数据库及对应数据统计，含有关键词所有相关的其他数据统计，例如检索培达替尼，会出现盐酸培达替尼等相关药品数据统计，检索恒瑞，会出现江苏恒瑞、上海恒瑞等相关企业数据统计。</div>
          <i class="el-icon-question cl-green"></i>
        </el-tooltip>
      </span>
    </div>
    <rp-part v-for="(item, index) in data" :key="index" :icon="getIconFont(item.title)" :title="item.title" :array="item._child"></rp-part>
  </div>
</template>

<script>
import RpPart from './rp-part'
import { mapState } from 'vuex'

export default {
  components: {
    RpPart
  },
  data () {
    return {
      totalNum: 0
    }
  },
  computed: {
    ...mapState({
      showPromtNotice: state => state.showPromtNotice
    }),
  },
  methods: {
    getIconFont (label) {
      switch (label)
      {
        case "常用数据库": return "&#xe63f;"; break
        case "药品研发": return "&#xe70b;"; break
        case "生产检验": return "&#xe672;"; break
        case "市场信息": return "&#xe6a1;"; break
        case "合理用药": return "&#xe649;"; break
        case "医疗器械": return "&#xe63d;"; break
        case "中药材": return "&#xe6f5;"; break
        case "保健品": return "&#xe65b;"; break
        case "一致性评价": return "&#xeb4c;"; break
        case "医药化学": return "&#xe6a9;"; break

      }
    }
  },
  props: {
    data: Array
  }
}
</script>

<style lang="less" scoped>
  @import "~@/assets/less/var.less";

  .data-nav {
    box-sizing: border-box;
    // position: relative;
    box-shadow: @BoxShadow;
    margin-top: 10px;
    width: 100%;
    background: #fff;
    // padding: 0px 0px 14px 0px;
    border-radius: 4px;
    padding-bottom: 20px;
    .dn-title {
      // width: 62px;
      display: flex;
      align-items: center;
      height: 40px;
      border-radius: 4px 4px 0 0;
      background-color: #eff2fa;
      // position: absolute;
      // left: -62px;
      // top: 0;
      padding-left: 20px;
      color: @PrimaryColor;
      // display: flex;
      // flex-direction: column;
      // justify-content: center;
      text-align: left;
      line-height: 45px;
      .font-nav {
        font-size: 18px;
        height: 18px;
        line-height: 18px;
        width: 18px;
        float: none;
        // display: block;
        // margin-top: -8px;
        // margin-bottom: -10px;
      }
      .icon-nav-content {
        font-size: 16px;
        float: left;
        margin-left: 10px;
        font-weight: bold;
        // display: block;
        color: @PrimaryColor;
      }
      // &::after {
      //   content: '';
      //   position: absolute;
      //   right: -10px;
      //   top: 0px;
      //   width: 10px;
      //   height: 64px;
      //   background-color: #fff;
      // }
    }
    .dn-desc {
      position: relative;
      margin-top: 10px;
      // padding-bottom: 60px;
      .desc-head {
        width: 100%;
        border-bottom: 2px solid @GrayBackgroundColor;
        .desc-title {
          box-sizing: border-box;
          width: 104px;
          margin-left: 32px;
          border-bottom: 3px solid @PrimaryColor;
          font-size: 14px;
          color: @PrimaryColor;
          padding: 6px 0px 6px 8px;
          overflow: hidden;
          .title-detail {
            font-size: 14px;
            color: @PrimaryColor;
            margin-left: 10px;
          }
        }
      }
      .desc-content {
        padding: 24px 0px 24px 68px;
        line-height: 24px;
        font-size: 12px;
        .content-list {
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-content: flex-start;
          flex-wrap: wrap;
          height: 140px;
          .list-item{
            width: 300px;
            height: 28px;
            line-height: 28px;
            a{
              text-decoration: none;
              .item-detail {
                &:hover {
                  color: @PrimaryColor;
                }
              }
            }
          }
        }
      }
      .desc-more {
        text-align: center;
        min-width: 64px;
        height: 40px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        position: absolute;
        bottom: 10px;
        left: 50%;
        margin-left: -32px;
        cursor: pointer;
        .more-icon {
          font-size: 20px;
          font-weight: bold;
          color: @FontColor4;
        }
        .more-desc {
          font-size: 10px;
          color: @FontColor4;
        }
      }
    }
  }
</style>
