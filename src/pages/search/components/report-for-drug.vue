<template>
  <div class="report-wrapper">
    <LoadingGif :loadFlag="!Object.keys(data).length" :className="'report-dialog'"></LoadingGif>
    <div class="report" :style="{
      minHeight: `calc(100vh - 40px - 48px - ${(showPromtNotice ? 30 : 0) +
        'px'}`
    }" :class="{ fillHeight: !Object.keys(data).length }">
      <div class="rp-title">
        <i class="iconfont font-doc">&#xe600;</i>
        <span class="icon-doc-content">药品概览
          <el-tooltip class="item tooltips-position" effect="light" placement="right">
            <div slot="content">
              呈现关键词精确匹配到的药品概览，概览下的数据统计也与关键词精确匹配。
            </div>
            <i class="el-icon-question cl-green"></i>
          </el-tooltip>
        </span>
      </div>
      <div class="rp-main" v-if="Object.keys(data).length">
        <div class="main-desc">
          <!-- title -->
          <!-- <h2 class="desc-title mt20">{{data.name}}&nbsp;&nbsp;{{data.englishname}} <span v-if="data.zgss">中国上市</span>  </h2> -->
          <div class="desc-title">
            <div class="lan1 clearfix">
              <span class="zh-name fl">{{ data.name }}</span>
              <span class="item item3 fl" v-if="data.chinamarked == 1">中国上市</span>
            </div>
            <div class="lan2" v-if="data.englishname">
              <span class="en-name">{{ data.englishname }}</span>
            </div>
          </div>
          <!-- 注册申报 / 上市批准 / 临床试验 / 销售额度 -->
          <div v-if="
            data.num_zhuce > 0 ||
            data.num_zhuce_year > 0 ||
            data.num_clinical > 0 ||
            data.num_clinical_year > 0 ||
            data.num_omr > 0 ||
            data.num_zh > 0 ||
            (data.num_sales ? data.num_sales.sales > 0 : false)
          " class="main-num">
            <!-- 注册申报 -->
            <div class="num-item item1" v-if="data.num_zhuce > 0 || data.num_zhuce_year > 0">
              <h3 class="item-title">
                <i class="iconfont title-icon">&#xe6a6;</i>
                <span class="title-desc">注册申报</span>
              </h3>
              <div class="num-detail">
                <div v-if="data.num_zhuce > 0">
                  <span class="num-big" id="countup1"></span>
                  <span class="super">个(总)</span>
                </div>
                <span v-if="data.num_zhuce > 0 && data.num_zhuce_year > 0" class="hr">|</span>
                <div v-if="data.num_zhuce_year > 0">
                  <span class="num-big" id="countup2"></span>
                  <span class="super">个(近一年)</span>
                </div>
              </div>
            </div>
            <!-- 临床试验 -->
            <div v-if="data.num_clinical > 0 || data.num_clinical_year > 0" class="num-item item3">
              <h3 class="item-title">
                <i class="iconfont title-icon">&#xe614;</i>
                <span class="title-desc">临床试验</span>
              </h3>
              <div class="num-detail">
                <div v-if="data.num_clinical > 0">
                  <span class="num-big" id="countup3"></span>
                  <span class="super">个(总)</span>
                </div>
                <span v-if="data.num_clinical > 0 && data.num_clinical_year > 0" class="hr">|</span>
                <div v-if="data.num_clinical_year > 0">
                  <span class="num-big" id="countup4"></span>
                  <span class="super">个(近一年)</span>
                </div>
              </div>
            </div>
            <!-- 上市批准 -->
            <div v-if="data.num_omr > 0 || data.num_zh > 0" class="num-item item2">
              <h3 class="item-title">
                <i class="iconfont title-icon">&#xe634;</i>
                <span class="title-desc">上市批准</span>
              </h3>
              <div class="num-detail">
                <div v-if="data.num_omr > 0">
                  <span class="num-big" id="countup5"></span>
                  <span class="super">个(欧美日)</span>
                </div>
                <span v-if="data.num_omr > 0 && data.num_zh > 0" class="hr">|</span>
                <div v-if="data.num_zh > 0">
                  <span class="num-big" id="countup6"></span>
                  <span class="super">个(中国)</span>
                </div>
              </div>
            </div>
            <!-- 销售额度 -->
            <div class="num-item item4" v-if="data.num_sales ? data.num_sales.sales > 0 : false">
              <h3 class="item-title">
                <i class="iconfont title-icon">&#xe610;</i>
                <span class="title-desc">销售额度</span>
                <el-tooltip class="item" effect="light" content="数据来源于大部分全球知名药企年报" placement="top">
                  <i class="el-icon-question cl-green"></i>
                </el-tooltip>
              </h3>
              <div class="num-detail">
                <span class="num-big" id="countup7"></span>
                <span class="sub">万元({{
                    data.num_sales ? data.num_sales.year : "-"
                }}年)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 药物概述 -->
      <div class="rp-desc" v-if="Object.keys(data).length">
        <div class="rp-desc-main" v-if="data.yaowugaishu">
          <div class="desc-head">
            <div class="desc-title">
              <span class="title-detail">药物概述</span>
            </div>
          </div>
          <div class="desc-content">
            <div class="content" v-html="data.yaowugaishu"></div>
            <table class="desc-detail">
              <!-- 药物别名 -->
              <tr>
                <td>药物别名</td>
                <td>
                  <li style="word-wrap:break-word;word-break:break-all;">
                    {{ data.ename || "无" }}
                  </li>
                </td>
              </tr>
              <!-- 原研单位 ename-->
              <tr>
                <td>原研单位</td>
                <td>
                  <li v-for="(item, index) in String(
                    data.originatorcompany
                  ).split(',')" :key="index">
                    {{ data.originatorcompany ? item : "无" }}
                  </li>
                </td>
              </tr>
              <!-- 全球最高状态 -->
              <tr>
                <td>全球最高状态</td>
                <td v-if="data.higheststatus">{{ data.higheststatus }}</td>
                <td v-else>无</td>
              </tr>
              <!-- 药理作用 -->
              <!-- <tr>
                <td>药理作用</td>
                <td v-if="data.categ">
                  {{data.categ}}
                </td>
                <td v-else>无</td>
              </tr>-->
              <tr>
                <td>药理作用</td>
                <td v-if="data.atcarr">
                  <span v-for="(atc, index) in data.atcarr" :key="index">
                    {{ atc.shuoming }}
                    <span v-if="index !== data.atcarr.length - 1">&gt;</span>
                  </span>
                </td>
                <td v-else>无</td>
              </tr>
              <!-- 作用靶点 -->
              <tr>
                <td>作用靶点</td>
                <td v-if="data.targets_abbr || data.target_unique">
                  <span v-if="data.targets_abbr">{{ data.targets_abbr }}</span>
                  <span v-if="data.targets_abbr && data.target_unique">;</span>
                  <span v-if="data.target_unique">{{
                      data.target_unique
                  }}</span>
                </td>
                <td v-else>无</td>
              </tr>
              <!-- 结构式 -->
              <tr>
                <td style="display: flex">结构式</td>
                <td style="height:100%;margin-bottom:0;">
                  <li>
                    <img v-if="data.structpicture" style="display:flex;width: 100%;" :src="data.structpicture" alt="" />
                    <span v-else>无</span>
                  </li>
                </td>
              </tr>
            </table>
          </div>
        </div>
        <!-- 之后需要改为router-link或者连接至指定链接 -->
        <div style="text-align: center;display:flex;align-items: center;">
          <router-link tag="a" :to="{
            path: '/report/' + data.id,
            query: { englishname: data.englishname }
          }" target="_blank" class="desc-more">查看完整报告</router-link>
          <router-link tag="a" :to="{
            path: '/globaldrugs',
            query: { keywords: (data.englishname ? data.englishname : data.name) }
          }" target="_blank" class="desc-more">进入全球药物2.0</router-link>
          <!-- <a
            v-if="data.is_newdrug"
            href="javascript: void(0);"
            @click="ywbgLink(data.is_newdrug)"
            class="desc-more more1"
            >查看新药进展</a
          > -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LoadingGif from "@/components/common/globalCom/loading-gif";
import { mapState } from "vuex";

export default {
  data() {
    return {};
  },
  props: {
    data: [Object, Array]
  },
  computed: {
    ...mapState({
      showPromtNotice: state => state.showPromtNotice
    })
  },
  watch: {
    data: {
      handler() {
        if (!Object.keys(this.data).length) return;
        this.$nextTick(() => {
          // 数字动效
          let pr = new Promise((resolve, reject) => {
            let options = {
              useEasing: true,
              useGrouping: true,
              separator: ",",
              decimal: "."
            };
            let cu1 = new CountUp(
              "countup1",
              0,
              this.data.num_zhuce ? this.data.num_zhuce : 0,
              0,
              1,
              options
            );
            let cu2 = new CountUp(
              "countup2",
              0,
              this.data.num_zhuce_year ? this.data.num_zhuce_year : 0,
              0,
              1,
              options
            );
            let cu3 = new CountUp(
              "countup3",
              0,
              this.data.num_clinical ? this.data.num_clinical : 0,
              0,
              1,
              options
            );
            let cu4 = new CountUp(
              "countup4",
              0,
              this.data.num_clinical_year ? this.data.num_clinical_year : 0,
              0,
              1,
              options
            );
            let cu5 = new CountUp(
              "countup5",
              0,
              this.data.num_omr ? this.data.num_omr : 0,
              0,
              1,
              options
            );
            let cu6 = new CountUp(
              "countup6",
              0,
              this.data.num_zh ? this.data.num_zh : 0,
              0,
              1,
              options
            );
            let cu7 = new CountUp(
              "countup7",
              0,
              this.data.num_sales ? this.data.num_sales.sales : 0,
              0,
              1,
              options
            );
            cu1.start();
            cu2.start();
            cu3.start();
            cu4.start();
            cu5.start();
            cu6.start();
            cu7.start();
            resolve();
          });
          // 动效完成后设定宽度
          pr.then(() => {
            this.resetWidth();
          });
        });
      },
      deep: true,
      immediate: true
    }
  },
  filters: {},
  methods: {
    // ywbgLink(val) {
    //   window.ga(
    //     "send",
    //     "event",
    //     "button",
    //     "click",
    //     "comprehensivesearchresult_newdrug"
    //   );
    //   window._paq.push([
    //     "trackEvent",
    //     "button",
    //     "click",
    //     "comprehensivesearchresult_newdrug"
    //   ]);

    //   window.open("/newdrug/" + val, "_blank");
    // },
    resetWidth() {
      // 重置左上角四个方块的宽度以适应
      let len = $(".num-item").length;
      for (let i = 0; i < len; i++) {
        let default_width = $(".num-item")
          .eq(i)
          .width();
        let cLen = $(".num-item")
          .eq(i)
          .find(".num-detail span").length;
        let one_width = 0;
        for (let j = 0; j < cLen; j++) {
          let cWidth = $(".num-item")
            .eq(i)
            .find(".num-detail span")
            .eq(j)
            .width();
          one_width += cWidth;
        }

        // 加上margin和padding的宽度
        if (cLen == 5) {
          one_width = one_width + 3 + 3 + 14 + 14;
        } else if (cLen == 2) {
          one_width = one_width + 3;
        }

        if (one_width > default_width) {
          $(".num-item")
            .eq(i)
            .find(".num-detail")
            .width(one_width);
        }
      }
    },
    picLoadError(ev) {
      // 图片加载失败，切换为默认图
      ev.target.src = "/static/imgs/general/no-drug-img.jpg";
    }
  },
  created() { },
  mounted() { },
  components: {
    LoadingGif
  }
};
</script>

<style lang="less" scoped>
@import "~@/assets/less/var.less";
@desc-width: 40%;

.report-wrapper {
  position: relative;

  .report {
    box-sizing: border-box;
    box-shadow: @BoxShadow;
    position: relative;
    margin-top: 10px;
    width: 100%;
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
      //   content: "";
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

          .lan1 {
            display: flex;
            align-items: flex-end;

            .zh-name {
              height: 22px;
              line-height: 22px;
              font-size: 22px;
              font-family: Microsoft YaHei;
              font-weight: bold;
              color: #4877e8;
              margin-right: 20px;
            }

            .item:not(:first-child) {
              display: inline-block;
              font-size: 12px;
              height: 20px;
              line-height: 20px;
              border-radius: 10px;
              padding: 0px 10px;
              margin-left: 4px;
              color: #fff;
              float: left;
            }

            .item1 {
              background-color: @Green;
            }

            .item2 {
              background-color: @Blue;
            }

            .item3 {
              background-color: @Orange;
            }
          }

          .lan2 {
            margin-top: 5px;
            margin-bottom: 14px;
            font-size: 12px;
            height: 12px;
            line-height: 12px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #545b6d;

            .en-name {
              display: flex;
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
          width: 290px;
          height: 70px;
          background: #eff2fa;
          border-radius: 3px 3px 3px 3px;

          &:nth-of-type(2n) {
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

            &>div {
              display: flex;
              align-items: flex-end;
            }

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
              color: #4877e8;
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
              height: 11px;
              line-height: 11px;
              font-size: 11px;
              font-family: Microsoft YaHei;
              font-weight: 400;
              color: #626266;
              margin-left: 8px;
            }

            .hr {
              display: flex;
              line-height: 12px;
              height: 12px;
              padding: 0 10px;
              color: #dcdcdc;
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
      margin-top: 4px;

      .desc-head {
        width: 100%;
        height: 28px;
        border-bottom: 1px solid #dfe5f1;

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
        color: #545b6d;
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
            td {
              line-height: 25px;
              font-family: Microsoft YaHei;
              color: #545b6d;
              font-weight: bold;
              margin-bottom: 12px;

              &:nth-child(1) {
                min-width: 80px;
                white-space: nowrap;
              }

              &:nth-child(2) {
                padding-left: 16px;
                line-height: 25px;
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
        background: #4877e8;
        border-radius: 4px;
        font-size: 12px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #ffffff;
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
  background: rgba(255, 255, 255, 0.7);
  text-align: center;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
