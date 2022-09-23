<template>
  <div class="report" :class="{ 'fillHeight': !Object.keys(data).length }"
    :style="{ minHeight: `calc(100vh - 40px - 48px - ${(showPromtNotice ? 30 : 0) + 'px'}` }">
    <LoadingGif :loadFlag="!Object.keys(data).length" :className="'report-dialog'"></LoadingGif>
    <div class="rp-title">
      <i class="iconfont font-doc">&#xe600;</i>
      <span class="icon-doc-content">企业概览
        <el-tooltip class="item tooltips-position" effect="light" placement="right">
          <div slot="content">呈现关键词精确匹配到的企业概览，概览下的数据统计也与关键词精确匹配。</div>
          <i class="el-icon-question cl-green"></i>
        </el-tooltip>
      </span>
    </div>
    <div class="rp-main" v-if="Object.keys(data).length">
      <div class="main-desc">
        <div class="desc-title">
          <div class="lan1 clearfix">
            <span class="zh-name fl">{{ data.qiyemingcheng }}</span>
            <span v-if="isEmpty(data.qiyeyingwenmingcheng)" class="en-name">{{ data.qiyeyingwenmingcheng }}</span>
          </div>
          <div class="lan2">
            <span class="item item1" style="margin-left:0;" v-if="isEmpty(data.chengshi)">{{ data.chengshi }}</span>
            <span class="item item2" v-for="(item, index) in data.tags" :key="index" v-if="isEmpty(data.tags)">
              {{ item }}
            </span>
            <span class="item item3" v-if="isEmpty(data.rongzileixing)">{{ data.rongzileixing }}</span>
          </div>
        </div>

        <!-- 注册申报 / 上市批准 / 临床试验 / 销售额度 -->
        <div class="main-num">
          <!-- 注册申报 -->
          <div class="num-item item1">
            <h3 class="item-title"><i class="iconfont title-icon">&#xe6a6;</i><span class="title-desc">注册申报</span></h3>
            <div class="num-detail">
              <span class="num-big" id="countup1"></span><span class="super">个</span>
              <!-- <span class="hr">|</span>
              <span class="num-big" id="countup2"></span><span class="super">个(近一年)</span> -->
            </div>
          </div>
          <!-- 临床试验 -->
          <div class="num-item item3">
            <h3 class="item-title"><i class="iconfont title-icon">&#xe614;</i><span class="title-desc">临床试验</span></h3>
            <div class="num-detail">
              <span class="num-big" id="countup3"></span><span class="super">个</span>
              <!-- <span class="hr">|</span>
              <span class="num-big" id="countup4"></span><span class="super">个(近一年)</span> -->
            </div>
          </div>
          <!-- 上市批准 -->
          <div class="num-item item2">
            <h3 class="item-title"><i class="iconfont title-icon">&#xe634;</i><span class="title-desc">上市批准</span></h3>
            <div class="num-detail">
              <span class="num-big" id="countup5"></span><span class="super">个</span>
              <!-- <span class="hr">|</span>
              <span class="num-big" id="countup6"></span><span class="super">个(欧美日)</span> -->
            </div>
          </div>
          <!-- 销售额度 -->
          <!-- <div class="num-item item4">
            <h3 class="item-title"><i class="iconfont title-icon">&#xe7b5;</i><span class="title-desc">药品中标</span></h3>
            <div class="num-detail">
              <span class="num-big" id="countup7"></span><span class="super">个(总)</span>
            </div>
          </div> -->
        </div>
      </div>

    </div>
    <!-- 药物概述 -->
    <div class="rp-desc" v-if="Object.keys(data).length">
      <div class="rp-desc-main">
        <div class="desc-head">
          <div class="desc-title">
            <span class="title-detail">企业简介</span>
          </div>
        </div>
        <div class="desc-content">
          <div class="content" v-html="data.qiyejianjie"></div>
          <table class="desc-detail">
            <!-- 企业网址 -->
            <tr>
              <td>企业网址</td>
              <td v-if="data.url"><a :href="'http://' + data.url" target="_blank">{{ data.url }}</a></td>
              <td v-else>无</td>
            </tr>
            <!-- 成立日期 -->
            <tr>
              <td>成立日期</td>
              <td v-if="data.chengliriqi">{{ data.chengliriqi }}</td>
              <td v-else>无</td>
            </tr>
            <!-- 法定代表 -->
            <tr>
              <td>法定代表</td>
              <td v-if="data.faren">{{ data.faren }}</td>
              <td v-else>无</td>
            </tr>
            <!-- 注册资本 -->
            <tr>
              <td>注册资本</td>
              <td v-if="data.zhucezibenyuanshi">{{ data.zhucezibenyuanshi }}</td>
              <td v-else>无</td>
            </tr>
            <!-- 产品类型 -->
            <tr>
              <td>产品类型</td>
              <td v-if="data.biaoqianzhi">{{ data.biaoqianzhi }}</td>
              <td v-else>无</td>
            </tr>
            <!-- 企业标志 -->
            <tr>
              <td style="display: flex">企业标志</td>
              <td style="height:100%;margin-bottom:0;">
                <li>
                  <img v-if="data.logo" style="display:flex;width: 100%;" :src="data.logo" alt="">
                  <span v-else>无</span>
                </li>
              </td>
            </tr>
          </table>
        </div>
      </div>
      <!-- 之后需要改为router-link或者连接至指定链接 -->
      <router-link tag="a" :to="{ path: '/company_filter/' + data.qyid }" target="_blank" class="desc-more">查看企业详情
      </router-link>
    </div>
  </div>
</template>

<script>
import LoadingGif from '@/components/common/globalCom/loading-gif'
import { mapState } from 'vuex'

export default {
  data() {
    return {

    }
  },
  props: {
    data: [Object, Array]
  },
  watch: {
    data: {
      handler() {
        if (!Object.keys(this.data).length) return
        this.$nextTick(() => {
          // 数字动效
          let pr = new Promise((resolve, reject) => {
            let options = {
              useEasing: true,
              useGrouping: true,
              separator: ',',
              decimal: '.',
            };
            let cu1 = new CountUp('countup1', 0, this.data.zhuceshu ? this.data.zhuceshu : 0, 0, 1, options);
            // let cu2 = new CountUp('countup2', 0, this.data.count_arr.count_zhuce_year ? this.data.count_arr.count_zhuce_year : 0, 0, 1, options);
            let cu3 = new CountUp('countup3', 0, this.data.linchuangshu ? this.data.linchuangshu : 0, 0, 1, options);
            // let cu4 = new CountUp('countup4', 0, this.data.count_arr.count_linchuang_year ? this.data.count_arr.count_linchuang_year : 0, 0, 1, options);
            let cu5 = new CountUp('countup5', 0, this.data.shangshiyaopinshu ? this.data.shangshiyaopinshu : 0, 0, 1, options);
            // let cu6 = new CountUp('countup6', 0, this.data.count_arr.count_ssyp_gw ? this.data.count_arr.count_ssyp_gw : 0, 0, 1, options);
            let cu7 = new CountUp('countup7', 0, this.data.yaopinzhongbiaoshu ? this.data.yaopinzhongbiaoshu : 0, 0, 1, options);
            // let cu8 = new CountUp('countup8', 0, this.data.count_arr.count_yaopinzhongbiao_year ? this.data.count_arr.count_yaopinzhongbiao_year : 0, 0, 1, options);
            cu1.start();
            // cu2.start();
            cu3.start();
            // cu4.start();
            cu5.start();
            // cu6.start();
            cu7.start();
            // cu8.start();
            resolve()
          })
          // 动效完成后设定宽度
          pr.then(() => {
            // this.resetWidth()
          })
        })
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    ...mapState({
      showPromtNotice: state => state.showPromtNotice
    }),
  },
  components: {
    LoadingGif
  },
  filters: {

  },
  methods: {
    resetWidth() {
      // 重置左上角四个方块的宽度以适应
      let len = $(".num-item").length
      for (let i = 0; i < len; i++) {
        let default_width = $(".num-item").eq(i).width()
        let cLen = $(".num-item").eq(i).find(".num-detail span").length
        let one_width = 0
        for (let j = 0; j < cLen; j++) {
          let cWidth = $(".num-item").eq(i).find(".num-detail span").eq(j).width()
          one_width += cWidth
        }

        // 加上margin和padding的宽度
        if (cLen == 5) {
          one_width = one_width + 3 + 3 + 14 + 14
        } else if (cLen == 2) {
          one_width = one_width + 3
        }

        if (one_width > default_width) {
          $(".num-item").eq(i).find(".num-detail").width(one_width)
        }
      }
    },
    picLoadError(ev) { // 图片加载失败，切换为默认图
      ev.target.src = "/static/imgs/general/no-drug-img.jpg"
    },
  },
  mounted() {

  },
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/var.less";
@desc-width: 40%;

.report {
  box-sizing: border-box;
  box-shadow: @BoxShadow;
  position: relative;
  margin-top: 10px;
  width: 628px;
  background: #fff;
  padding: 0px 0px 14px 0px;
  border-radius: 4px;

  .rp-title {
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

    .font-doc {
      font-size: 18px;
      height: 18px;
      line-height: 18px;
      width: 18px;
      float: none;
      // display: block;
      // margin-top: -8px;
      // margin-bottom: -10px;
    }

    .icon-doc-content {
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

  .rp-main {
    // display: flex;
    justify-content: space-between;
    padding-left: 20px;

    .main-desc {
      position: relative;

      // padding-left: 30px;
      // padding-right: 8px;
      // width: 35%;
      .desc-title {
        margin-top: 14px;
        margin-bottom: 10px;
        display: flex;
        flex-direction: column;

        .lan1 {
          display: flex;
          align-items: flex-start;
          flex-direction: column;
          flex-wrap: wrap;

          .zh-name {
            height: 22px;
            line-height: 22px;
            font-size: 22px;
            font-family: Microsoft YaHei;
            font-weight: bold;
            color: #4877E8;
            margin-right: 20px;
          }

          .en-name {
            display: flex;
          }
        }

        .lan2 {
          margin-top: 5px;
          font-size: 12px;
          line-height: 12px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #545B6D;

          .item {
            display: inline-block;
            font-size: 12px;
            line-height: 12px;
            border-radius: 3px;
            padding: 4px 6px;
            margin-left: 4px;
            color: #fff;
            float: left;
            white-space: nowrap;
          }

          .item1 {
            background-color: #FFA914;
          }

          .item2 {
            color: #333333;
            background-color: #DFE5F1;
          }

          .item3 {
            background-color: #9DCC40;
          }
        }
      }
    }

    .main-num {
      position: relative;
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;

      .num-item {
        box-sizing: border-box;
        padding: 16px 0 0 20px;
        width: calc((100% - 18px - 20px) / 3);
        height: 70px;
        background: #EFF2FA;
        border-radius: 3px 3px 3px 3px;

        &:not(:first-child) {
          margin-left: 6px;
        }

        .item-title {
          display: flex;
          font-size: 14px;
          height: 14px;
          line-height: 14px;
          margin-bottom: 10px;
        }

        .num-detail {
          display: flex;
          align-items: flex-end;
          height: 22px;

          // overflow: hidden;
          .item-title {
            .title-icon {
              font-weight: normal;
            }

            .title-desc {
              margin-left: 5px;
              font-size: 15px;
            }
          }

          .num-big {
            display: flex;
            height: 22px;
            line-height: 22px;
            font-size: 18px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #4877E8;
          }

          .super {
            margin-left: 10px;
            height: 11px;
            line-height: 11px;
            font-size: 11px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #626266;
            margin-bottom: 1px;
            white-space: nowrap;
          }

          .sub {
            display: inline-block;
            vertical-align: sub;
            font-size: 7px;
            margin-left: 3px;
            margin-top: 19px;
          }

          .hr {
            display: flex;
            line-height: 12px;
            height: 12px;
            padding: 0 10px;
            color: #DCDCDC;
          }
        }
      }

      .item1 {
        margin-bottom: 6px;
      }

      .item2 {
        margin-bottom: 6px;
      }
    }
  }

  .rp-desc {
    position: relative;
    padding-bottom: 20px;

    .desc-head {
      width: 100%;
      height: 28px;
      border-bottom: 1px solid #DFE5F1;
      ;

      .desc-title {
        box-sizing: border-box;
        font-size: 14px;
        color: @PrimaryColor;
        padding-left: 8px;

        .title-detail {
          font-size: 14px;
          color: @PrimaryColor;
          margin-left: 10px;
          border-bottom: 2px solid @PrimaryColor;
          padding-bottom: 8px;
        }
      }
    }

    .desc-content {
      padding: 14px 18px 0 20px;
      font-size: 12px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #545B6D;
      line-height: 20px;

      .content {
        line-height: 20px;
        font-size: 12px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 4; //向显示多少行就给多大值
        -webkit-box-orient: vertical;
      }

      .desc-detail {
        margin-top: 14px;
        font-size: 12px;

        tr {
          display: flex;

          td {
            line-height: 13px;
            font-family: Microsoft YaHei;
            color: #545B6D;
            font-weight: bold;
            margin-bottom: 12px;

            &:nth-child(1) {
              min-width: 80px;
              white-space: nowrap;
            }

            &:nth-child(2) {
              padding-left: 16px;
              line-height: 12px;
              font-size: 12px;
              font-weight: 400;
            }
          }
        }
      }
    }

    .desc-more {
      margin: 20px 0 0 20px;
      transition: all 200ms;
      text-decoration: none;
      width: 100px;
      height: 28px;
      line-height: 28px;
      background: #4877E8;
      border-radius: 4px;
      font-size: 12px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #FFFFFF;
      display: flex;
      justify-content: center;
      align-items: center;

      &:hover {
        transition: all 200ms;
        background-color: Lighten(@PrimaryColor, 10%);
      }

      &:active {
        transition: all 200ms;
        background-color: Darken(@PrimaryColor, 10%);
      }
    }
  }
}

.fillHeight {
  height: 100vh;
}

.report-dialog {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 299;
  width: calc(100% - 51px);
  height: calc(100% - 48px);
  background: rgba(255, 255, 255, .7);
  text-align: center;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
