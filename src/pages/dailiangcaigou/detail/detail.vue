<template>
  <div class="wrapper" ref="wrapper">
    <!-- 自定义加载界面 -->
    <LoadingGif :loadFlag="isLoading" v-if="isLoading"></LoadingGif>
    <!-- 加载完成显示部分 -->
    <div class="detail-list" v-else>
      <div class="detail-header header-fixed">
        <div class="header-left">
          <div class="left-top">
            <span class="top-id" :title="data.name">{{ data.jbxx.name }}</span>
            <span style="margin-right:20px;">{{
              data.jbxx.shengchanqiye
            }}</span>
            <span class="id-green">{{ data.jbxx.guige }}</span>
            <span class="id-green">{{ data.pici.type }}</span>
          </div>
        </div>
      </div>
      <div class="main">
        <div
          class="left-nav"
          :style="{ top: (showPromtNotice ? 128 : 98) + 'px' }"
        >
          <div class="nav-list nav-event" @click="handleNavClick">
            <a class="nav-item active">基本信息</a>
            <a class="nav-item">各省市约定采购量</a>
            <a class="nav-item">批次信息</a>
            <a class="nav-item">扩展信息</a>
          </div>
        </div>
        <div class="right-list">
          <slide-section :title="'基本信息'" class="the-part part-one">
            <div class="tb-wrap">
              <table class="tb-t">
                <tr>
                  <td>药品名称</td>
                  <td>
                    <span>{{ data.jbxx.name }}</span>
                  </td>
                  <td>商品名</td>
                  <td>
                    <span>{{ data.jbxx.brandname }}</span>
                  </td>
                </tr>
                <tr>
                  <td>生产企业</td>
                  <td>
                    <span>{{ data.jbxx.shengchanqiye }}</span>
                  </td>
                  <td>原研单位</td>
                  <td>
                    <span>{{ data.jbxx.yuanyan }}</span>
                  </td>
                </tr>
                <tr>
                  <td>剂型</td>
                  <td>
                    <span>{{ data.jbxx.jixing }}</span>
                  </td>
                  <td>规格</td>
                  <td>
                    <span>{{ data.jbxx.guige }}</span>
                  </td>
                </tr>
                <tr>
                  <td>包装转换比</td>
                  <td>
                    <span>{{ data.jbxx.baozhuanguige2 }}</span>
                  </td>
                  <td>中选价（元）</td>
                  <td>
                    <span>{{ data.jbxx.feiyong }}</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    中选单价（元）
                    <el-tooltip
                      class="item tooltips-position"
                      effect="light"
                      placement="right"
                    >
                      <div slot="content" v-html="helpDesc.danjia"></div>
                      <i class="el-icon-question cl-green"></i>
                    </el-tooltip>
                  </td>
                  <td>
                    <span>{{ data.jbxx.danjia }}</span>
                  </td>
                  <td>最高有效申报价（元）</td>
                  <td>
                    <span>{{ data.jbxx.xianjia }}</span>
                  </td>
                </tr>
                <tr>
                  <td>降幅</td>
                  <td>
                    <span>{{ data.jbxx.jiangfu }}</span>
                  </td>
                  <td>批次</td>
                  <td>
                    <span>{{ data.jbxx.type }}</span>
                  </td>
                </tr>
                <tr>
                  <td>采购量（万片/支/袋）</td>
                  <td>
                    <span>{{ data.jbxx.amount }}</span>
                  </td>
                  <td>采购周期</td>
                  <td>
                    <span>{{ data.jbxx.cycle }}</span>
                  </td>
                </tr>
                <tr>
                  <td>供应地区</td>
                  <td>
                    <span>{{ data.jbxx.first_zong }}</span>
                  </td>
                  <td>品种中选企业（家）</td>
                  <td>
                    <span>{{ data.jbxx.pzzxqy_num }}</span>
                  </td>
                </tr>
                <tr v-if="data.jbxx.beigong">
                  <td>备供地区</td>
                  <td>
                    <span>{{ data.jbxx.beigong }}</span>
                  </td>
                </tr>
              </table>
            </div>
          </slide-section>

          <slide-section :title="'各省市约定采购量'" class="the-part part-two">
            <List
              :loading="false"
              :nodata="data.province && !data.province.length"
            >
              <div class="actions" :style="posi">
                <!-- 导出数据 -->
                <span class="action-btn" @click="exportEvent">
                  <span class="icon iconfont">&#xe641;</span>
                  导出数据
                </span>
                <!-- 可视化分析 -->
                <span
                  :class="{
                    'abandon-click-method': nopms && nopms.dailiangcaigoujzfx,
                    'action-btn': true
                  }"
                  @click="sendGa"
                >
                  <span class="icon iconfont">&#xe643;</span>
                  可视化分析
                </span>
              </div>
              <!-- :height="offsetHeihgt" -->
              <!-- :min-width="item.width"
                  :width="item.okWidth || null" -->
              <el-table
                :data="
                  data.province.slice(
                    (currentPage - 1) * pageSize,
                    currentPage * pageSize
                  )
                "
                stripe
                fixed
                ref="ElTable"
              >
                <el-table-column
                  v-for="item in exportDefaultFiled"
                  :prop="item.prop"
                  :min-width="item.minWidth || 100"
                  :width="item.width || null"
                  :key="item.prop"
                  :label="item.label"
                >
                </el-table-column>
              </el-table>
              <div style="positon: relative">
                <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="currentPage"
                  :page-sizes="[10, 30, 50]"
                  :page-size="pageSize"
                  layout="total, sizes, prev, pager, next"
                  :total="total"
                  :disabled="nopms.fy"
                  :class="{ 'abandon-click-method': nopms.fy }"
                >
                </el-pagination>
                <span class="out-of-page cl-red"
                  >限于内容篇幅，部分结果未予显示</span
                >
              </div>
            </List>
          </slide-section>

          <slide-section :title="'批次信息'" class="the-part part-three">
            <div class="tb-wrap">
              <table class="tb-t">
                <tr>
                  <td>批次</td>
                  <td>
                    <span>{{ data.pici.type }}</span>
                  </td>
                  <td>采购品种（个）</td>
                  <td>
                    <span>{{ data.pici.zhaobiaopinzhong }}</span>
                  </td>
                </tr>
                <tr>
                  <td>中选品种（个）</td>
                  <td>
                    <span>{{ data.pici.zhongxuanpinzhong }}</span>
                  </td>
                  <td>中选企业（家）</td>
                  <td>
                    <span>{{ data.pici.guifanqiyezhongbiao }}</span>
                  </td>
                </tr>
                <tr>
                  <td>平均降幅</td>
                  <td>
                    <span>{{ data.pici.avg }}</span>
                  </td>
                  <td>发布日期</td>
                  <td>
                    <span>{{ data.pici.approvaldate }}</span>
                  </td>
                </tr>
                <tr>
                  <td>文件来源</td>
                  <td colspan="3">
                    <span @click="gaEvent(data.pici.url)" class="span-a">{{
                      data.pici.source
                    }}</span>
                  </td>
                </tr>
              </table>
            </div>
          </slide-section>

          <slide-section
            :title="'扩展信息'"
            class="the-part"
            v-if="extendList && extendList.length"
          >
            <div class="extend-list">
              <ExtendButton
                v-for="(item, index) in extendList"
                :key="index"
                :item="item"
              ></ExtendButton>
            </div>
          </slide-section>
        </div>
      </div>
    </div>
    <la-footer></la-footer>
  </div>
</template>

<script>
import LoadingGif from "@/components/common/globalCom/loading-gif";
import List from "@/components/layouts/list";
import Export from "@/components/common/export";
import SlideSection from "@/components/common/slide-section";
import LaFooter from "@/components/layouts/footer";
import ExtendButton from "@/components/common/extend-button";
import { mapState } from "vuex";
import detailScrollMixins from "@/mixins/detailScroll";

export default {
  components: {
    List,
    Export,
    LoadingGif,
    SlideSection,
    LaFooter,
    ExtendButton
  },
  mixins: [detailScrollMixins],
  data() {
    return {
      colorF1: false,
      colorF2: false,
      isLoading: true,
      data: {},
      timeline: [],
      total: 0,
      devprocess: null,
      extendList: [], // 扩展信息
      helpDesc: {
        danjia: "按最小制剂单位（元/片、粒、袋、支）"
      },
      posi: "position:static;text-align:right;padding:0 15px;",
      exportDefaultFiled: [
        {
          prop: "name",
          label: "药品名称",
          minWidth: 120
        },
        {
          prop: "first",
          label: "供应省市",
          minWidth: 120
        },
        {
          prop: "guige",
          label: "规格",
          minWidth: 120
        },
        {
          prop: "shengchanqiye",
          label: "生产企业",
          minWidth: 120
        },
        {
          prop: "amount",
          label: "首年约定采购量计算基数（万片/支/袋）",
          minWidth: 250
        },
        {
          prop: "five",
          label: "50%采购量",
          minWidth: 120
        },
        {
          prop: "sex",
          label: "60%采购量",
          minWidth: 120
        },
        {
          prop: "seven",
          label: "70%采购量",
          minWidth: 120
        },
        {
          prop: "eight",
          label: "80%采购量",
          minWidth: 120
        },
        {
          prop: "amount_ck",
          label: "首年约定采购量(参考)",
          minWidth: 180
        }
      ],
      currentPage: 1,
      pageSize: 10,
      paramStr: {}
    };
  },
  computed: {
    ...mapState({
      allBase: state => state.Dailiangcaigou.allBase,
      helpInfo: state => state.Dailiangcaigou.helpInfo,
      nopms: state => state.Dailiangcaigou.nopms,
      param: state => state.Dailiangcaigou.param // 附加参数(存于vuex内)
    })
  },
  watch: {
 showPromtNotice(val) {
      if (val) {
        if ($(".left-nav").css("top")) {
          $(".left-nav").css("top", "128px");
        }
      } else {
        if ($(".left-nav").css("top")) $(".left-nav").css("top", "98px");
      }
    }
  },
  methods: {
    exportEvent() {
      let param = {
          name: this.paramStr.name,
          guige: this.paramStr.guige,
          baozhuanguige: this.paramStr.baozhuanguige,
          packaging: this.paramStr.packaging,
          feiyong: this.paramStr.feiyong,
          shengchanqiye: this.paramStr.shengchanqiye,
          type: this.paramStr.type,
          accesstoken: GETCOOKIEFUN("accesstoken"),
          outdata_column: `name=药品名称,first=供应省市,guige=规格,shengchanqiye=生产企业,amount=首年约定采购量计算基数（万片/支/袋）,five=50%采购量,sex=60%采购量,seven=70%采购量,eight=80%采购量,amount_ck=首年约定采购量(参考)`
        },
        urlEncode = "/api/dailiangcaigou/infooutdata?" + Qs.stringify(param);
      // this.downloadFile(urlEncode);
      window.open(decodeURI(urlEncode));
      window
        .Axios({
          method: "get",
          url: urlEncode,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          responseType: "arraybuffer" //arraybuffer/blob//加上格式，二进制
        })
        .then(res => {
          let name = res.headers["file_name_urlencode"];
          const { data } = res;
          if (name) {
            const blob = new Blob([res.data], {
              type: "application/zip;charset=utf-8"
            });
            const fileName =
              decodeURIComponent(name) || (dbname || "数据库") + ".xls"; //下载的文件名称及其后缀，后缀要和后台保持的一致
            let objectURL = window.URL.createObjectURL(blob);
            window.URL.revokeObjectURL(objectURL); // 释放内存
          }
        });
    },
    sendGa() {
      if (this.nopms.dailiangcaigoujzfx) return;
      window.ga(
        "send",
        "event",
        "button",
        "cilick",
        "dailiangcaigou_details_analysis"
      );
      window._paq.push([
        "trackEvent",
        "button",
        "cilick",
        "dailiangcaigou_details_analysis"
      ]);
      let routeData = this.$router.resolve({
        path: "/dailiangcaigou/analysis",
        query: {
          nav: "药品分析",
          guifanname: this.paramStr.guifanname,
          guifanguige: this.paramStr.guifanguige,
          type: this.paramStr.type,
          guifanqiyezhongbiao: this.paramStr.guifanqiyezhongbiao
        }
      });
      window.open(routeData.href, "_blank");
    },
    handleSizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    gaEvent(url) {
      window.open(url, "_blank");
    },
    async handleAxios() {
      this.paramStr = JSON.parse(this.$route.query.paramStr);
      // 详情信息
      await window
        .Axios({
          method: "get",
          url: "/api/dailiangcaigou/detail",
          params: {
            name: this.paramStr.name,
            guige: this.paramStr.guige,
            baozhuanguige: this.paramStr.baozhuanguige,
            packaging: this.paramStr.packaging,
            feiyong: this.paramStr.feiyong,
            shengchanqiye: this.paramStr.shengchanqiye,
            type: this.paramStr.type,
            accesstoken: GETCOOKIEFUN("accesstoken")
          }
        })
        .then(res => {
          if (res.data.code === 200 && res.data.data) {
            let data = res.data.data;
            this.data = data;
            this.total = this.data.province.length;
            this.getExtendList("dailiangcaigou", data.extendList);
          }
        })
        .then(this.removeLoading)
        .catch(err => {
          console.log(err);
        });
    },
    // 加载完后移除加载界面
    removeLoading() {
      this.isLoading = false;
    },
    handleScroll() {
      // let top = $(".main").offset().top,
      //   leftNav = $(".left-nav");
      // if (top <= 50) {
      //   leftNav.css("top", (this.showPromtNotice ? 118 : 98) + "px");
      // } else {
      //   leftNav.css("top", (this.showPromtNotice ? 118 : 88) + "px");
      // }
    }
  },
  created() {
    if (!this.nopms.xqy) {
      this.handleAxios();
    }
    setTimeout(() => {
      const hashLocation = sessionStorage.getItem("hashLocation"); //缓存中获取当前页面的路由名称
      // 注意, 这里使用全路径匹配,在hash模式中,因为地址会携带#,所以页面报告中的url需要重新覆盖一下, 将#去除
      window._paq.push(["setCustomUrl", "https://" + hashLocation]); //覆盖页面报告的url，可以自定义页面url，加上本页面路由
      window._paq.push(["trackPageView", this.allBase.dbname]); //页面名称,可以自定义页面名称
      window._paq.push(["setDocumentTitle", this.allBase.dbname]);
    }, 1000);
  },
  mounted() {
    Store.dispatch("Dailiangcaigou/getBaseInfo");
    window.addEventListener("scroll", this.handleScroll, true);
  },
  activated() {
    this.vueRouteToNoPms(this.nopms.xqy);
  },
  updated() {
    this.vueRouteToNoPms(this.nopms.xqy);
    this.vueTogglePmsTooltip();
  }
};
</script>

<style lang="less" scoped>
@import "~@/assets/less/var.less";
@import "~@/assets/less/detailCom.less";

@FontsizeSmall: 13px;
@FontsizeSmallBold: bold;

.span-a {
  cursor: pointer;
  color: #4877e8;
  &:hover {
    text-decoration: underline;
  }
}

.action-btn {
  cursor: pointer;
  &:hover {
    color: #4877e8;
  }
}

.wrapper {
  .detail-list {
    .main {
      .left-nav {
        transition: none !important;
      }
      .right-list {
        .the-part {
          .tb-wrap {
            .id-state {
              display: inline-block;
              padding: 0 12px;
              background: @Green;
              border-radius: 10px;
              height: 20px;
              line-height: 20px;
              color: #fff;
            }
            .tb-f1 {
              position: relative;
              margin-bottom: 10px;
              width: 100%;
              tr {
                height: 33px;
                line-height: 33px;

                th {
                  border: 1px solid @BorderColorNew;
                  font-size: @FontsizeSmall;
                  background: @DetailTableLeftColor;
                  font-weight: @FontsizeSmallBold;
                }
                td {
                  border: 1px solid @BorderColorNew;
                  font-size: @FontsizeSmall;
                  background: @DetailTableRightColor;
                  padding: 0 20px;
                  text-align: center;
                }

                .xuhao {
                  width: 20px;
                }
                .mc {
                  // width: 80px;
                }
                .yf {
                  text-align: left;
                }
              }
            }
            .tb-f2 {
              position: relative;
              margin-bottom: 10px;
              width: 100%;
              border-top: 1px solid @BorderColorNew;
              border-right: 1px solid @BorderColorNew;

              /deep/tr {
                height: 33px;
                line-height: 33px;

                /deep/th {
                  padding: 0;
                  border-left: 1px solid @BorderColorNew;
                  border-bottom: 1px solid @BorderColorNew;
                  font-size: @FontsizeSmall;
                  background: @DetailTableLeftColor;
                  font-weight: @FontsizeSmallBold;
                }
                /deep/td {
                  border-left: 1px solid @BorderColorNew;
                  border-bottom: 1px solid @BorderColorNew;
                  font-size: @FontsizeSmall;
                  background: @DetailTableRightColor;
                  padding: 0 20px;
                  text-align: center;
                }
              }

              /deep/.cell {
                padding: 0;
                text-align: center;
              }
            }
            /deep/.tb-f2.el-table:before {
              height: 0;
            }
            .h4 {
              font-size: 14px;
              font-weight: bold;
              height: 33px;
              line-height: 33px;
            }
            p {
              font-size: 13px;
            }
          }
        }
        // PART 2 部分 - 时光轴部分
        .part-two {
          .time-tip {
            position: absolute;
            top: 14px;
            left: 84px;
            .sz16 {
              font-size: 16px;
            }
          }
          .time-line {
            > li {
              position: relative;
              line-height: 1;
              font-size: 13px;
              .time-t {
                position: relative;
                display: flex;
              }
              .time-t4:before,
              .time-t2:before,
              .time-t1:before {
                content: "";
                position: absolute;
                top: 0;
                left: 333px;
                height: 50%;
                width: 2px;
                transform: translate(0, 0);
                background: #90c31f;
                z-index: 2;
              }
              .time-t5:after,
              .time-t3:after,
              .time-t1:after {
                content: "";
                position: absolute;
                bottom: 0;
                left: 333px;
                height: 51%;
                width: 2px;
                transform: translate(0, 0);
                background: #90c31f;
                z-index: 2;
              }
              .time-tl {
                width: 300px;
                display: flex;
                justify-content: flex-end;
                align-items: center;
                .time-tl-day {
                  cursor: pointer;
                  position: relative;
                  margin-right: 40px;
                  color: #868ea3;
                  font-weight: 700;
                  strong {
                    font-size: 16px;
                  }
                }
                .time-tl-day::before {
                  content: "";
                  height: 10px;
                  width: 10px;
                  border-right: 1px solid #dfe5f1;
                  border-top: 1px solid #dfe5f1;
                  position: absolute;
                  right: -10px;
                  top: 2px;
                  transform: rotate(45deg);
                }
                .time-tl-day::after {
                  content: "";
                  height: 0;
                  width: 20px;
                  border-top: 1px dashed #dfe5f1;
                  position: absolute;
                  right: -32px;
                  top: 7px;
                }

                .time-tl-date {
                  font-size: 15px;
                  color: #4877e8;
                }
                .time-tl-date1 {
                  font-size: 13px;
                  color: #868ea3;
                }
              }
              .time-tr {
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: space-between;
                color: #4877e8;

                .time-tr-name {
                  font-size: 15px;
                  font-weight: 700;
                }
                .time-tr-name1 {
                  font-size: 13px;
                  color: #868ea3;
                }
                .time-tr-seat {
                  flex: 1;
                  border-top: 1px dashed #dfe5f1;
                }
                .time-tr-info {
                  width: 450px;
                  line-height: 1.5;
                  > span {
                    display: inline-block;
                    background: #90c31f;
                    border-radius: 12px;
                    padding: 2px 8px;
                    line-height: 1;
                    font-size: 12px;
                    color: #fff;
                  }
                }
              }

              .quan {
                margin: 0 20px;
                position: relative;
                width: 28px;
                min-height: 28px;
              }
              .quan:before {
                content: "";
                position: absolute;
                top: 50%;
                left: 0;
                height: 28px;
                width: 28px;
                transform: translate(0, -50%);
                background: #c8d6f8;
                border-radius: 50%;
                z-index: 8;
              }
              .quan:after {
                content: "";
                position: absolute;
                top: 50%;
                left: 4px;
                width: 20px;
                height: 20px;
                transform: translate(0, -50%);
                background: #4878e7;
                border-radius: 50%;
                z-index: 9;
              }
              .quan1 {
                min-height: auto;
              }
              .quan1:before {
                content: "";
                position: absolute;
                top: 0;
                left: 13px;
                height: 0;
                width: 2px;
                transform: translate(0, 0);
                background: #4878e7;
                border-radius: 0;
                z-index: 2;
              }
              .quan1:after {
                top: 50%;
                left: 9px;
                width: 10px;
                height: 10px;
              }
              .time-b {
                position: relative;
                cursor: pointer;

                .time-b-info {
                  width: 335px;
                  box-sizing: border-box;
                  height: 30px;
                  line-height: 30px;
                  text-align: right;
                  border-right: 2px solid #4877e8;
                  position: relative;
                  padding-right: 30px;
                  color: #90c31f;
                  font-size: 12px;
                }
                .time-b-info1 {
                  border-right: 2px solid #90c31f;
                }

                .time-b-info1::before {
                  content: "";
                  height: 10px;
                  width: 10px;
                  border-right: 1px solid #90c31f;
                  border-top: 1px solid #90c31f;
                  position: absolute;
                  right: 20px;
                  top: 9px;
                  transform: rotate(45deg);
                }
                .time-b-info1::after {
                  content: "";
                  height: 0;
                  width: 20px;
                  border-top: 1px dashed #90c31f;
                  position: absolute;
                  right: 0;
                  top: 14px;
                }
              }
            }
            > li::before {
              content: "";
              position: absolute;
              top: 0;
              left: 333px;
              height: 100%;
              width: 2px;
              background: #4878e7;
              z-index: 0;
            }
            > li:first-child:before {
              height: 50%;
              top: 50%;
            }
            > li:last-child:before {
              height: 51%;
            }
            > li.time-line-active {
              .time-tl {
                .time-tl-day1 {
                  color: #90c31f;
                }
                .time-tl-day1:before {
                  border-right: 1px solid #90c31f;
                  border-top: 1px solid #90c31f;
                }
                .time-tl-day1:after {
                  border-top: 1px dashed #90c31f;
                }
                .time-tl-date {
                  color: #90c31f;
                }
              }
              .time-tr {
                .time-tr-name {
                  color: #90c31f;
                }
              }
              .quan:before {
                background: #dfedb8;
              }
              .quan:after {
                background: #90c31f;
              }
              .quan1:before {
                background: #90c31f;
              }
              .quan1:after {
                background: #90c31f;
              }
              .time-b {
                .time-b-info {
                  border-right: 2px solid #90c31f;
                }
                .time-b-info2 {
                  border-right: 2px solid #4878e7;
                }
              }
            }
          }

          .detail-nopms {
            width: 100%;
            height: 538px;
            background: url(/static/imgs/zhuce/timeline_zglcsy.png) no-repeat;
          }
        }

        // PART 7
        .part-seven {
          .detail-nopms {
            width: 100%;
            height: 630px;
            background: url(/static/imgs/zhuce/devprocess_before.jpg);
          }
          .tb-wrap {
            // 下箭头超出，padding-bottom来抵消
            padding-bottom: 40px;
            .med-info {
              margin-bottom: 60px;
              font-size: @FontsizeSmall;
              .info-item {
                display: inline-block;
                margin-right: 40px;
              }
              .info-name {
                color: @PrimaryColor;
              }
            }
            .progress-info {
              position: relative;
              .up-down {
                position: absolute;
                left: 80px;
                .up {
                  cursor: pointer;
                  position: absolute;
                  top: -32px;
                  left: -17px;
                  width: 36px;
                  height: 36px;
                  line-height: 36px;
                  i {
                    font-size: 36px;
                    color: @FontColor3;
                  }
                }
                .down {
                  cursor: pointer;
                  position: absolute;
                  bottom: -32px;
                  left: -17px;
                  width: 36px;
                  height: 36px;
                  line-height: 36px;
                  i {
                    font-size: 36px;
                    color: @FontColor3;
                  }
                }
                .md-line {
                  height: 500px;
                  width: 2px;
                  background: @FontColor3;
                }
              }
              .all-info {
                max-height: 500px;
                overflow: scroll;
                overflow-x: hidden;
                &::-webkit-scrollbar {
                  display: none;
                }
                .info {
                  margin-bottom: 45px;
                  position: relative;
                  display: flex;
                  justify-content: flex-start;
                  padding-left: 150px;
                  &:last-of-type {
                    margin-bottom: 0px;
                  }
                  .info-detail {
                    .info-table {
                      position: relative;
                      .table-item {
                        position: relative;
                        &:first-of-type {
                          position: relative;
                          .time {
                            width: 75px;
                            position: absolute;
                            top: 50%;
                            left: -150px;
                            display: flex;
                            flex-direction: column;
                            justify-content: flex-start;
                            margin-top: -20px;
                            text-align: center;
                            .m-d {
                              height: 20px;
                              line-height: 20px;
                              font-size: 13px;
                              font-weight: bold;
                            }
                            .year {
                              height: 20px;
                              line-height: 20px;
                            }
                          }
                        }
                        .circle {
                          background: #fff;
                          position: absolute;
                          top: 50%;
                          left: -75px;
                          margin-top: -4px;
                          width: 8px;
                          height: 8px;
                          border-radius: 8px;
                          border: 2px solid @FontColor;
                        }
                        .line-one {
                          display: inline-block;
                          width: 44px;
                          border-bottom: 1px dashed @FontColor;
                          position: absolute;
                          top: 50%;
                          margin-top: 1px;
                          left: -60px;
                          &::after {
                            content: "";
                            display: inline-block;
                            width: 4px;
                            height: 4px;
                            background: @FontColor;
                            border-radius: 4px;
                            position: absolute;
                            top: -2px;
                            right: -2px;
                          }
                        }
                        .line-other {
                          display: inline-block;
                          width: 20px;
                          border-bottom: 1px dashed @FontColor;
                          position: absolute;
                          top: 50%;
                          margin-top: 1px;
                          left: -36px;
                          &::before {
                            content: "";
                            display: inline-block;
                            height: 50px;
                            border-left: 1px dashed @FontColor;
                            position: absolute;
                            bottom: 0px;
                            left: 0;
                          }
                          &::after {
                            content: "";
                            display: inline-block;
                            width: 4px;
                            height: 4px;
                            background: @FontColor;
                            border-radius: 4px;
                            position: absolute;
                            top: -2px;
                            right: -2px;
                          }
                        }
                        table {
                          margin-bottom: 10px;
                          tr {
                            td {
                              background: @DetailTableRightColor;
                              box-sizing: border-box;
                              border: 1px solid @BorderColorNew;
                              width: 304px;
                              height: 30px;
                              padding-left: 10px;
                              font-size: @FontsizeSmall;
                              &.spe-td {
                                width: 88px;
                                text-align: center;
                                padding-left: 0px;
                                position: relative;
                                color: @PrimaryColor;
                                font-size: 14px;
                                font-weight: bold;
                                &::before {
                                  // content: '';
                                  // position: absolute;
                                  // left: -10px;
                                  // top: 50%;
                                  // margin-top: -8px;
                                  // border-top: 8px solid transparent;
                                  // border-right: 10px solid @DetailTableRightColor;
                                  // border-bottom: 8px solid transparent;
                                  content: "";
                                  position: absolute;
                                  top: 51%;
                                  left: -10px;
                                  margin-top: -8px;
                                  width: 0;
                                  height: 0;
                                  border-right: 9px solid @BorderColorNew;
                                  border-bottom: 9px solid transparent;
                                  border-top: 9px solid transparent;
                                }
                                &::after {
                                  content: "";
                                  position: absolute;
                                  top: 50%;
                                  left: -9px;
                                  margin-top: -8px;
                                  width: 0;
                                  height: 0;
                                  border-bottom: 8px solid transparent;
                                  border-right: 8px solid @DetailTableRightColor;
                                  border-top: 8px solid transparent;
                                }
                              }
                            }
                          }
                        }
                        &:hover {
                          .time {
                            color: @PrimaryColor;
                          }
                          .circle {
                            border-color: @PrimaryColor;
                          }
                          .line-one {
                            border-color: @PrimaryColor;
                            &::after {
                              background: @PrimaryColor;
                            }
                          }
                          .line-other {
                            border-color: @PrimaryColor;
                            &::before {
                              border-color: @PrimaryColor;
                            }
                            &::after {
                              background: @PrimaryColor;
                            }
                          }
                          table {
                            tr {
                              td {
                                background: @DetailTableFloorColor;
                                &::after {
                                  border-right-color: @DetailTableFloorColor;
                                }
                              }
                            }
                          }
                        }
                      }
                      .link {
                        color: @PrimaryColor;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

/deep/.cell {
  max-height: 46px !important;
}
@media screen and (max-width: 1400px) {
  .wrapper
    .detail-list
    .main
    .right-list
    .part-two
    .time-line
    > li
    .time-tr
    .time-tr-info {
    width: 350px;
  }
}

/deep/.content {
  padding-bottom: 0 !important;
}

/deep/.el-pagination {
  padding-bottom: 50px !important;
}
/deep/.el-table {
  height: unset !important;
}

/deep/.slide-section .tb-t tr td[data-v-fddb5996]:nth-child(odd),
.slide-section .tb-f tr td[data-v-fddb5996]:nth-child(odd) {
  width: 200px;
}
</style>
