<template>
  <div class="trz-report" :style="{ 'padding-top': loading ? '0' : '48px' }">
    <LoadingGif :className="'fullscreen-loading'" :loadFlag="loading"></LoadingGif>
    <div class="header-trz-report" :style="{ display: loading ? 'none' : 'block' }">
      <div class="header-content">
        <div class="logo">
          <img src="~@/assets/imgs/trz/logo.png" @click="linkTo('/home')" />
        </div>
        <div class="report-header">
          <div class="left-container">
            <div class="title">投融资分析报告</div>
            <el-select v-model="country" @change="countryChange" disabled size="mini" class="select-sort1"
              popper-class="popper-class">
              <el-option label="全球" value="全球"></el-option>
              <el-option label="中国" value="中国"></el-option>
            </el-select>
            <el-select v-model="date_type" @change="date_typeChange" disabled size="mini" class="select-sort2"
              popper-class="popper-class">
              <el-option label="按年分析" :value="1"></el-option>
              <el-option label="按季度分析" :value="2"></el-option>
              <el-option label="按月分析" :value="3"></el-option>
              <el-option label="全部" :value="4"></el-option>
            </el-select>
            <el-select v-if="date_type !== 4" v-model="date_year" @change="date_yearChange" disabled size="mini"
              class="select-sort3" popper-class="popper-class">
              <el-option v-for="(option, index) in years" :key="index" :title="option.label" :label="option.label"
                :value="option.value">
              </el-option>
            </el-select>
            <el-select v-if="date_type !== 1 && date_type !== 4" v-model="date_month" @change="date_monthChange"
              disabled size="mini" class="select-sort4" popper-class="popper-class">
              <el-option v-for="(option, index) in dates" :key="index" :title="option.label" :label="option.label"
                :value="option.value">
              </el-option>
            </el-select>
          </div>
          <div class="right-container">
            <div class="pdf-report" @click="getPDF" v-if="!loading">
              导出PDF
            </div>
            <div class="pdf-report" @click="getPDFnew" v-if="!loading && isDev">
              导出PDF2
            </div>
          </div>
        </div>
      </div>
    </div>
    <div id="pdf-part1" ref="pdfBox">
      <div class="trz-title-bg">
        <span class="title">{{ basic.title }}</span>
      </div>
      <!-- 行业数据概览 -->
      <div v-if="Object.values(basic).length > 0" class="chart_top">
        <span class="title">行业数据概览</span>
        <div class="newtotals">
          <div class="newtotals-scroll">
            <ul class="total-item">
              <li class="li1">事件</li>
              <li class="li2">
                总计
                <span>{{ basic.event.current_total }}</span>件
              </li>
              <li class="li3" v-html="basic.event.month_on_month_str"></li>
            </ul>
            <ul class="total-item">
              <li class="li1">金额</li>
              <li class="li2">
                总计
                <span>{{ basic.amount.current_total }}</span>{{ basic.amount.unit
                }}<el-tooltip placement="top" effect="light">
                  <div slot="content">
                    单位：人民币<br />
                    金额计算排除了未披露的数据。
                  </div>
                  <img src="~@/assets/imgs/trz/question.png" height="14" width="14" style="
                      cursor: pointer;
                      margin-left: 6px;
                      position: relative;
                      top: -2px;
                    " />
                </el-tooltip>
              </li>
              <li class="li3" v-html="basic.amount.month_on_month_str"></li>
            </ul>
            <ul class="total-item">
              <li class="li1">企业</li>
              <li class="li2">
                总计
                <span>{{ basic.company.current_total }}</span>家
              </li>
              <li class="li3" v-html="basic.company.year_on_year_str"></li>
            </ul>
            <ul class="total-item">
              <li class="li1">机构</li>
              <li class="li2">
                总计
                <span>{{ basic.jigou.current_total }}</span>家
              </li>
              <li class="li3" v-html="basic.jigou.year_on_year_str"></li>
            </ul>
            <ul class="total-item">
              <li class="li1">地区</li>
              <li class="li2">
                总计
                <span>{{ basic.province.current_total }}</span>个
              </li>
              <li class="li3" v-html="basic.province.year_on_year_str"></li>
            </ul>
            <ul class="total-item">
              <li class="li1">行业</li>
              <li class="li2">
                总计
                <span>{{ basic.industries.current_total }}</span>个
              </li>
            </ul>
            <ul class="total-item">
              <li class="li1">关键词</li>
              <li class="li2">
                总计
                <span>{{ basic.keywords.current_total }}</span>个
              </li>
              <li class="li3" v-html="basic.keywords.year_on_year_str"></li>
            </ul>
          </div>
          <div class="describe" style="margin-bottom: 40px" v-html="basic.describe"></div>
        </div>
      </div>
      <!-- 整体趋势 -->
      <div v-if="ztqsShow" class="ztqs module" style="flex-direction: column">
        <span class="title">{{ ztqsTitle }}</span>
        <div class="container">
          <div id="ztqs" class="chart"></div>
          <div class="describe" v-html="ztqsObj.describe"></div>
        </div>
      </div>
      <!-- 行业分布概况 -->
      <div v-if="hyfbShow" class="hyfb module" style="flex-direction: column">
        <span class="title">行业分布概况</span>
        <div class="container" style="flex-direction: row-reverse">
          <div id="hyfb" class="chart"></div>
          <div class="describe" v-html="hyfbObj.describe"></div>
        </div>
      </div>
      <!-- 关键词分布概况 -->
      <div v-if="gjcfbShow" class="gjcfb module" style="flex-direction: column">
        <span class="title">关键词分布概况</span>
        <div class="container">
          <div id="gjcfb" class="chart"></div>
          <div class="describe" v-html="gjcfbObj.describe"></div>
        </div>
      </div>
      <!-- 轮次分布概况 -->
      <div v-if="lcfbShow" class="lcfb module" style="flex-direction: column">
        <span class="title">轮次分布概况</span>
        <div class="container" style="flex-direction: row-reverse">
          <div id="lcfb" class="chart"></div>
          <div class="describe" v-html="lcfbObj.describe"></div>
        </div>
      </div>
      <!-- 时间分布情况 -->
      <div class="sjfb module" style="flex-direction: column">
        <span class="title">时间分布情况</span>
        <div class="container">
          <div id="sjfb" class="chart"></div>
          <div class="describe" v-html="sjfbObj.describe"></div>
        </div>
      </div>

      <!-- 事件在行业与轮次的分布情况 -->
      <div v-if="sjInHYAndLCfbShow" class="sjInHYAndLCfb module" style="height: unset; flex-direction: column">
        <span class="title">事件在行业与轮次的分布情况</span>
        <div class="container" style="flex-direction: column">
          <div id="sjInHYAndLCfb" class="chart" style="width: 100%; height: 400px"></div>
          <div class="describe" style="
              width: 100%;
              justify-content: center;
              margin-top: 20px;
              margin-bottom: 30px;
            " v-html="sjInHYAndLCfbObj.describe"></div>
        </div>
      </div>
      <!-- 事件规模占比情况 -->
      <div v-if="sjgmzbShow" class="sjgmzb module" style="flex-direction: column">
        <span class="title">事件规模占比情况</span>
        <div class="container" style="flex-direction: row-reverse">
          <div id="sjgmzb" class="chart" style="width: 600px"></div>
          <div class="describe" style="width: 530px" v-html="sjgmzbObj.describe"></div>
        </div>
      </div>
      <!-- 地域分布情况 -->
      <div v-if="dyfbShow" class="dyfb module" style="height: unset; flex-direction: column">
        <span class="title">地域分布情况</span>
        <div class="container" style="flex-direction: column">
          <div class="special">
            <div id="dyfb" style="width: 550px" class="chart"></div>
            <div class="line"></div>
            <div id="dyfbMap" style="width: 550px" class="chart"></div>
          </div>
          <div class="describe" style="width: 100%; margin-top: 10px; margin-bottom: 30px" v-html="dyfbObj.describe">
          </div>
        </div>
      </div>
      <!-- 融资企业榜单 -->
      <div v-if="rzqyShow" class="rzqy module" style="height: unset; flex-direction: column">
        <span class="title">融资企业榜单</span>
        <div class="container" style="flex-direction: column">
          <div class="special">
            <div class="rzqyCount">
              <div class="title">融资企业TOP10（数量）</div>
              <div id="rzqyCount" style="width: 550px; height: 400px" class="chart"></div>
            </div>
            <div class="line"></div>
            <div class="rzqyAmount">
              <div class="title">融资企业TOP10（金额）</div>
              <div id="rzqyAmount" style="width: 550px; height: 400px" class="chart"></div>
            </div>
          </div>
          <div class="describe" style="width: 100%; margin-top: 10px; margin-bottom: 30px" v-html="rzqyObj.describe">
          </div>
        </div>
      </div>
      <!-- 投资机构榜单 -->
      <div v-if="tzjgShow" class="tzjg module" style="height: unset; flex-direction: column">
        <span class="title">投资机构榜单</span>
        <div class="container" style="flex-direction: column">
          <div class="special">
            <div class="tzjgCount">
              <div class="title">投资数量TOP10</div>
              <div id="tzjgCount" style="width: 550px; height: 400px" class="chart"></div>
            </div>
            <div class="line"></div>
            <div class="tzjgAmount">
              <div class="title">管理基金TOP10</div>
              <div id="tzjgAmount" style="width: 550px; height: 400px" class="chart"></div>
            </div>
          </div>
          <div class="describe" style="width: 100%; margin-top: 10px; margin-bottom: 30px" v-html="tzjgObj.describe">
          </div>
        </div>
      </div>
      <!-- IPO热门关键词 -->
      <div v-if="IPOKeywordShow" class="IPOKeyword module" style="height: unset; flex-direction: column">
        <span class="title">IPO热门关键词</span>
        <div class="container" style="justify-content: center">
          <table class="IPOKeywordTable" border="1" cellspacing="0"
            v-if="IPOKeywordObj.list && IPOKeywordObj.list.length > 0">
            <thead>
              <th>关键词</th>
              <th>IPO事件数量</th>
            </thead>
            <tr v-for="(item, index) in IPOKeywordObj.list" :key="index">
              <th>{{ item.title }}</th>
              <th>{{ item.total }}</th>
            </tr>
          </table>

          <div style="
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: start;
              margin-left: 115px;
            ">
            <div class="describe" style="width: 500px" v-html="IPOKeywordObj.describe"></div>
            <div class="tips">*同一事件可能包含多个关键词</div>
          </div>
        </div>
      </div>

      <!-- 底部 -->
      <div class="report-footer" :style="{ 'margin-top': loading ? '150px' : '0' }">
        <div class="footer-container">
          <div class="footer-slogen">
            药智咨询提供医药行业市场解读、前景预估等咨询服务，欢迎垂询。
          </div>
          <div class="avatar-container">
            <div class="avatar-item">
              <img src="~@/assets/imgs/trz/tianjuan-avatar.png" class="avatar" />
              <div class="info">
                <div style="display: flex; align-items: end; margin-bottom: 14px">
                  <span class="name">田娟</span>
                  <span class="office">商务总监</span>
                </div>
                <p class="company">重庆药智企业管理咨询有限公司</p>
                <div class="phone">
                  <span>17318481316</span>
                  <span>13350326061</span>
                </div>
                <p class="email">tianjuan@yaozh.com</p>
              </div>
              <img src="~@/assets/imgs/trz/tianjuan-qrcode.png" class="qrcode" />
            </div>
            <div class="line"></div>
            <div class="avatar-item">
              <img src="~@/assets/imgs/trz/xujianhua-avatar.png" class="avatar" />
              <div class="info">
                <div style="display: flex; align-items: end; margin-bottom: 14px">
                  <span class="name">许建华</span>
                  <span class="office">市场总监</span>
                </div>
                <p class="company">重庆药智企业管理咨询有限公司</p>
                <div class="phone">
                  <span>15730336280</span>
                </div>
                <p class="email">xujianhua@yaozh.com</p>
              </div>
              <img src="~@/assets/imgs/trz/xujianhua-qrcode.png" class="qrcode" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <template v-if="false">
      <pdf-template :basic="basic" :ztqsShow="ztqsShow" :ztqsTitle="ztqsTitle" :hyfbShow="hyfbShow"
        :gjcfbShow="gjcfbShow" :lcfbShow="lcfbShow" :sjInHYAndLCfbShow="sjInHYAndLCfbShow" :sjgmzbShow="sjgmzbShow"
        :dyfbShow="dyfbShow" :rzqyShow="rzqyShow" :tzjgShow="tzjgShow" :IPOKeywordShow="IPOKeywordShow" />
    </template>
  </div>
</template>

<script>
import LoadingGif from "@/components/common/globalCom/loading-gif";
import NoData from "@/components/common/trz/noData";
import jspdf from "@/mixins/jspdf_new.js";
import jspdf_core from "@/mixins/jspdf_core.js";
import pdfTemplate from "../component/reportTemplate";
import Moment from "moment";
import "../../../../node_modules/echarts/map/js/world.js"; // 引入世界地图数据
export default {
  components: {
    LoadingGif,
    NoData,
    pdfTemplate
  },
  mixins: [jspdf, jspdf_core],
  data() {
    return {
      number: 100000000,
      isDev: /dev|local/.test(location.hostname), // 是否为开发环境
      wordCount: 4, // 字数
      startValue: 0,
      endValue: 8,
      dataZoomHeight: 25, // dataZoom高度
      loading: true,
      basic: {},
      ztqsTitle: "",
      ztqsObj: {}, // 整体趋势
      ztqsShow: true,
      hyfbObj: {}, // 行业分布
      hyfbShow: true,
      gjcfbObj: {}, // 关键词分布概况
      gjcfbShow: true,
      lcfbObj: {}, // 轮次分布概况
      lcfbShow: true,
      sjfbObj: {}, // 时间分布
      sjfbShow: true,
      sjInHYAndLCfbObj: {}, // 事件在行业与轮次的分布情况
      sjInHYAndLCfbShow: true,
      sjgmzbObj: {}, // 事件规模占比情况
      sjgmzbShow: true,
      dyfbObj: {}, // 投融资地域分布情况
      dyfbShow: true,
      rzqyObj: {}, // 融资企业榜单
      rzqyShow: true,
      tzjgObj: {}, // 投资机构榜单
      tzjgShow: true,
      IPOKeywordObj: {}, // IPO热门关键词
      IPOKeywordShow: true,
      country: "",
      date_type: "",
      date_year: "",
      date_month: "",
      years: [],
      dates: [],
      xAixsUnit: "月",
      query: {
        accesstoken: GETCOOKIEFUN("accesstoken"),
        country: "",
        date_type: "",
        date_year: "",
        date_month: ""
      }
    };
  },
  watch: {
    country: {
      handler(val) {
        this.query.country = val;
      },
      deep: true
    },
    date_type: {
      handler(val) {
        this.date_year = ""
        this.date_month = ""
        this.query.date_type = val;
        // this.dates = [];
        // this.date_month = "";
        switch (val) {
          case 1:
            this.xAixsUnit = "月";
            break;
          case 2:
            this.xAixsUnit = "季度";
            // this.dates = [
            //   {
            //     label: "Q1",
            //     value: 1
            //   },
            //   {
            //     label: "Q2",
            //     value: 2
            //   },
            //   {
            //     label: "Q3",
            //     value: 3
            //   },
            //   {
            //     label: "Q4",
            //     value: 4
            //   }
            // ];
            // this.date_month = this.dates[
            //   Math.floor((new Date().getMonth() + 1) / 3)
            // ].value;
            // this.taskSlice();
            break;
          case 3:
            this.xAixsUnit = "月";
            // for (let index = 12; index > 0; index--)
            // this.dates.push({
            //   label: index,
            //   value: index
            // });
            this.date_month = new Date().getMonth();
            // this.taskSlice();
            break;
        }
        this.$nextTick(() => {
          // 处理select下拉框由点击触发改为鼠标移入触发。
          for (let i = 1; i < 5; i++) {
            $(`.select-sort${i} .el-input.is-disabled`).removeClass(
              "is-disabled"
            );
            $(`.select-sort${i}`).hover(
              () => {
                $(`.select-sort${i} .el-select-dropdown.el-popper`).show(
                  100
                );
                $(`.select-sort${i} .el-select-dropdown.el-popper`).css({
                  top: "20px"
                });
              },
              () => {
                $(`.select-sort${i} .el-select-dropdown.el-popper`).css({
                  display: "none"
                });
              }
            );
          }
        });
      },
      deep: true
    },
    date_year: {
      handler(val) {
        this.query.date_year = val;
      },
      deep: true
    },
    date_month: {
      handler(val) {
        this.query.date_month = val;
      },
      deep: true
    }
  },
  beforeDestroy() {
    window.removeEventListener("resize", () => {
      let domArr = [
        "ztqs",
        "hyfb",
        "gjcfb",
        "lcfb",
        "sjInHYAndLCfb",
        "sjgmzb",
        "dyfb",
        "dyfbMap",
        "rzqyCount",
        "rzqyAmount",
        "rzqyAmount"
      ];
      domArr.forEach(dom => this.echartsResize(dom));
    });
    window.removeEventListener("scroll", this.handleScrolls);
  },
  async mounted() {
    if (this.$route.name == "database_trz_index") {
      $(".header-trz-report").addClass("transparent");
      $(".header-trz-report").addClass("home-head");
      window.addEventListener("scroll", this.handleScrolls, true);
    }
    this.country = "中国";
    this.date_type = 1;
    await this.getYear();
    await this.taskSlice();
    window.addEventListener("resize", () => {
      let domArr = [
        "ztqs",
        "hyfb",
        "gjcfb",
        "lcfb",
        "sjInHYAndLCfb",
        "sjgmzb",
        "dyfb",
        "dyfbMap",
        "rzqyCount",
        "rzqyAmount",
        "rzqyAmount"
      ];
      domArr.forEach(dom => this.echartsResize(dom));
    });
  },
  methods: {
    // 获取年份数据项
    async getYear(type) {
      const that = this,
        res = await window
          .Axios({
            method: "get",
            url: "/api/tourongzi_report/getYear",
            params: {
              accesstoken: GETCOOKIEFUN("accesstoken"),
              date_type: this.date_type
            }
          })
          .catch(err => {
            console.log(err);
          });
      // if (res.data.code === 200 && res.data.data) {

      let data = res.data.data;
      this.years = [];
      this.dates = [];
      switch (this.date_type) {
        case 1:
          data.forEach(item => {
            this.years.push({
              label: item.year,
              value: item.year
            });
          });
          if (!type) this.date_year = this.years[0].value;
          break;
        case 2:
        case 3:
          data.forEach(item => {
            this.years.push({
              label: item.year,
              value: item.year,
            });
          });
          if (!type) this.date_year = this.years[0].value;
          let arr = data.filter(item => item.year == this.date_year)
          if (this.date_type == 2) {
            arr && arr[0].month.forEach(item => {
              this.dates.push({
                label: 'Q' + item,
                value: item,
              });
            })
          } else if (this.date_type == 3) {
            arr && arr[0].month.forEach(item => {
              this.dates.push({
                label: item,
                value: item,
              });
            })
          }
          if (type != 'month') this.date_month = this.dates[0].value;
          break;
      }
      this.$nextTick(() => {
        // 处理select下拉框由点击触发改为鼠标移入触发。
        for (let i = 1; i < 5; i++) {
          $(`.select-sort${i} .el-input.is-disabled`).removeClass(
            "is-disabled"
          );
          $(`.select-sort${i}`).hover(
            () => {
              $(`.select-sort${i} .el-select-dropdown.el-popper`).show(200);
              $(`.select-sort${i} .el-select-dropdown.el-popper`).css({
                top: "20px"
              });
            },
            () => {
              $(`.select-sort${i} .el-select-dropdown.el-popper`).css({
                display: "none"
              });
            }
          );
        }
      });
      // 处理结束
      // this.taskSlice();
    },
    getPDF() {
      window.ga("send", "event", "button", "click", "viptrz_report_export");
      window._paq.push([
        "trackEvent",
        "button",
        "click",
        "viptrz_report_export"
      ]);
      this.loading = true;
      const _this = this;
      setTimeout(async () => {
        console.time("导出耗时");
        let start = new Date().getTime(),
          title = `${_this.date_year
            }年医疗健康行业投融资分析报告${Moment().format(
              "YYYYMMDD"
            )}-药智投资格局`;
        var res1 = await _this.htmlConvertImg("#pdf-part1", title, 1),
          // res2 = await _this.htmlConvertImg("#pdf-part2", title, 2),
          // res3 = await _this.htmlConvertImg("#pdf-part3", title, 3),
          // res2 = await _this.htmlConvertImg("#pdf-part2", title, 2),
          images = [...res1];
        let during = new Date().getTime() - start;
        console.log(during, "：截图耗时");
        // images  实际上是个数组 ，里面是 canvas的标签。
        console.timeEnd("导出耗时");
        await _this.pdfed(images, title);
        _this.loading = false;
        return;
      }, 0);
    },
    async getPDFnew() {
      window.ga("send", "event", "button", "click", "viptrz_report_export");
      window._paq.push([
        "trackEvent",
        "button",
        "click",
        "viptrz_report_export"
      ]);
      this.loading = true;
      setTimeout(async () => {
        await this.init({
          fontfaces: [
            "Helvetica Neue",
            "Helvetica",
            "PingFang SC",
            "Hiragino Sans GB",
            "Noto Sans CJK SC",
            "WenQuanYi Micro Hei",
            "Arial",
            "sans-serif"
          ]
        });
        await this.generate(
          document.querySelector("#pdfbox"),
          `${this.date_year}年医疗健康行业投融资分析报告${Moment().format(
            "YYYYMMDD"
          )}-药智投资格局`,
          0.49
        );
        this.loading = false;
      }, 1400);
    },
    taskSlice() {
      this.loading = true;
      Promise.all([
        this.handlerGetIndustryOverview(),
        this.handlerGetTrendStatistical(),
        this.handlerGetIndustryDistribution(),
        this.handlerGetKeyWordStatistics(),
        this.handlerGetRoundsStatistics(),
        this.getTimeDistribution(),
        this.getIndustryRoundsDistribution(),
        this.getEventRatioDistribution(),
        this.getRegionalDistribution(),
        this.getCompanyTopDistribution(),
        this.getJigouTopDistribution(),
        this.getKeywordsTopDistribution()
      ])
        .then(res => {
          this.loading = false;
        })
        .catch(err => {
          console.log(err);
          this.loading = false;
        });
    },
    handleScrolls() {
      if (this.$route.name == "database_trz_index") {
        let top = document.querySelector(".el-scrollbar__wrap").scrollTop;
        if (top > $(".header-trz-report").height()) {
          $(".header-trz-report").removeClass("transparent");
        } else {
          $(".header-trz-report").addClass("transparent");
        }
      }
    },
    linkTo(path) {
      if (path != this.$route.path)
        this.$router.push({
          path
        });
    },
    echartsResize(id) {
      let echart = Echarts.getInstanceByDom(document.getElementById(id));
      echart && echart.resize();
    },
    countryChange(val) {
      if (![2, 3].includes(this.date_type)) {
        this.country = val;
        this.taskSlice();
      }
    },
    async date_typeChange(val) {
      this.date_type = val;
      if ([1, 2, 3].includes(this.date_type)) await this.getYear();
      // if ([1, 4].includes(this.date_type))
      await this.taskSlice();
    },
    async date_yearChange(val) {
      this.date_year = val;
      await this.getYear('year');
      // if (this.date_type === 1)
      await this.taskSlice();
    },
    async date_monthChange(val) {
      this.date_month = val;
      await this.getYear('month');
      // if ([2, 3].includes(this.date_type))
      await this.taskSlice();
    },
    // 行业数据概览
    async handlerGetIndustryOverview() {
      const that = this,
        res = await window
          .Axios({
            method: "get",
            url: "/api/tourongzi_report/getIndustryOverview",
            params: this.query
          })
          .catch(err => {
            console.log(err);
          });

      this.basic = {};
      if (res.data.code === 200 && res.data.data) {
        let data = res.data.data;
        this.basic = data;
        this.basic.describe = `<div>${data.describe}</div>`;
      }
    },
    // 整体趋势
    async handlerGetTrendStatistical() {
      const that = this,
        res = await window
          .Axios({
            method: "get",
            url: "/api/tourongzi_report/getTrendStatistical",
            params: this.query
          })
          .catch(err => {
            console.log(err);
          });
      let domID = "ztqs";
      if (Echarts.getInstanceByDom(document.getElementById(domID))) {
        Echarts.getInstanceByDom(document.getElementById(domID)).clear();
      }
      that.ztqsTitle = "";
      that.ztqsObj = {};
      console.log(
        res.data.data && Object.values(res.data.data).length > 0,
        Object.values(res.data.data).length
      );
      that.ztqsShow = res.data.data && Object.values(res.data.data).length > 0;

      if (res.data.code === 200 && res.data.data) {
        let data = res.data.data;
        let xAxis = data.event.map(item => item.title),
          amountUnit = data.unit.amount,
          eventUnit = data.unit.event,
          series = data.amount.map(item => item.value), // 总金额
          series2 = data.event.map(item => item.value), // 事件数
          option = {
            tooltip: {
              trigger: "axis",
              formatter(params) {
                let maoHao = "：",
                  str = "";
                params.forEach(item => {
                  if (item.seriesName === "事件数") {
                    str += `${item.axisValue +
                      "<br />" +
                      item.seriesName +
                      maoHao +
                      item.data}${eventUnit}`;
                  }
                  if (item.seriesName === "总金额") {
                    str +=
                      (params.length === 2 ? `<br />` : ``) +
                      `${item.seriesName +
                      maoHao +
                      that.thousandFormatter(item.data)}${amountUnit}`;
                  }
                });
                return str;
              }
            },
            grid: {
              top: 40,
              left: 20,
              right: 60,
              bottom: xAxis && xAxis.length < 10 ? 10 : 30,
              containLabel: true
            },
            legend: {
              data: ["事件数", "总金额"]
            },
            xAxis: {
              type: "category",
              data: xAxis,
              // boundaryGap: false, // 两边不留白
              nameTextStyle: {
                color: "#66666"
              },
              axisTick: {
                alignWithLabel: true
              }
            },
            yAxis: [
              {
                type: "value",
                name: "事件数",
                nameLocation: "end",
                nameTextStyle: {
                  color: "#66666"
                }
              },
              {
                type: "value",
                name: "金额(亿元)",
                splitLine: {
                  lineStyle: {
                    color: "#DAE0E9",
                    type: "dotted"
                  }
                },
                axisLabel: {
                  show: true,
                  formatter(params) {
                    return params / that.number;
                  }
                },
                nameTextStyle: {
                  color: "#66666"
                }
              }
            ],
            series: [
              {
                name: "事件数",
                type: "line",
                data: series2
              },
              {
                name: "总金额",
                type: "line",
                yAxisIndex: 1,
                data: series
              }
            ]
          };
        if (xAxis && xAxis.length > 10) {
          option.dataZoom = {
            show: xAxis.length > 10,
            startValue: xAxis.length - 10,
            endValue: xAxis.length - 1,
            handleIcon:
              "M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z",
            handleSize: "80%",
            handleStyle: {
              color: "#fff",
              shadowBlur: 3,
              shadowColor: "rgba(0, 0, 0, 0.6)",
              shadowOffsetX: 2,
              shadowOffsetY: 2
            },
            zoomOnMouseWheel: true,
            moveOnMouseMove: true,
            top: "bottom",
            height: that.dataZoomHeight //这里可以设置dataZoom的尺寸
          };
        }
        that.ztqsTitle = data.title;
        that.ztqsObj = data;
        that.ztqsObj.describe = `<div>${data.describe}</div>`;
        let chart = Echarts.init(document.getElementById(domID), "customed");
        chart.setOption(option);
      }
    },
    // 行业分布概况
    async handlerGetIndustryDistribution() {
      const that = this,
        res = await window
          .Axios({
            method: "get",
            url: "/api/tourongzi_report/getIndustryDistribution",
            params: this.query
          })
          .catch(err => {
            console.log(err);
          });
      let domID = "hyfb";
      if (Echarts.getInstanceByDom(document.getElementById(domID))) {
        Echarts.getInstanceByDom(document.getElementById(domID)).clear();
      }
      that.hyfbObj = {};
      that.hyfbShow = res.data.data && Object.values(res.data.data).length > 0;

      if (res.data.code === 200 && res.data.data) {
        let data = res.data.data;
        let xAxis = data.list.map(item => item.title),
          series = data.list.map(item => item.event_total), // 事件数
          series2 = data.list.map(item => item.amount), // 融资额
          option = {
            tooltip: {
              trigger: "axis",
              formatter(params) {
                let maoHao = "：",
                  str = "";
                params.forEach(item => {
                  if (item.seriesName === "事件数") {
                    str += `${item.axisValue +
                      "<br />" +
                      item.seriesName +
                      maoHao +
                      item.data}件`;
                  }
                  if (item.seriesName === "融资额") {
                    str +=
                      (params.length === 2 ? `<br />` : ``) +
                      `${item.seriesName +
                      maoHao +
                      that.thousandFormatter(item.data)}元`;
                  }
                });
                return str;
              }
            },
            grid: {
              top: 40,
              left: 20,
              right: 60,
              bottom: xAxis && xAxis.length < that.endValue + 1 ? 10 : 30,
              containLabel: true
            },
            legend: {
              data: ["事件数", "融资额"]
            },
            xAxis: [
              {
                type: "category",
                data: xAxis,
                axisTick: {
                  alignWithLabel: true
                },
                axisLabel: {
                  interval: 0,
                  color: "#66666",
                  formatter(value) {
                    return value && value.length > 6
                      ? value.slice(0, 6) + "..."
                      : value;
                  }
                }
              }
            ],
            yAxis: [
              {
                type: "value",
                name: "事件数",
                nameLocation: "end",
                nameTextStyle: {
                  color: "#66666"
                }
              },
              {
                type: "value",
                name: "金额(亿元)",
                splitLine: {
                  lineStyle: {
                    color: "#DAE0E9",
                    type: "dotted"
                  }
                },
                axisLabel: {
                  show: true,
                  formatter(params) {
                    return params / that.number;
                  }
                },
                nameTextStyle: {
                  color: "#66666"
                }
              }
            ],
            barMaxWidth: 80,
            series: [
              {
                name: "事件数",
                barGap: 0, // 堆叠柱状图合并
                type: "bar",
                data: series
              },
              {
                name: "融资额",
                type: "bar",
                yAxisIndex: 1,
                data: series2
              }
            ]
          };
        if (xAxis && xAxis.length > that.endValue + 1) {
          option.dataZoom = {
            show: xAxis.length > that.endValue + 1,
            startValue: that.startValue,
            endValue: that.endValue,
            handleIcon:
              "M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z",
            handleSize: "80%",
            handleStyle: {
              color: "#fff",
              shadowBlur: 3,
              shadowColor: "rgba(0, 0, 0, 0.6)",
              shadowOffsetX: 2,
              shadowOffsetY: 2
            },
            zoomOnMouseWheel: true,
            moveOnMouseMove: true,
            top: "bottom",
            height: that.dataZoomHeight //这里可以设置dataZoom的尺寸
          };
        }
        that.hyfbObj = data;
        that.hyfbObj.describe = `<div>${data.describe}</div>`;
        let chart = Echarts.init(document.getElementById(domID), "customed");
        chart.setOption(option);
      }
    },
    // 关键词分布概况
    async handlerGetKeyWordStatistics() {
      const that = this,
        res = await window
          .Axios({
            method: "get",
            url: "/api/tourongzi_report/getKeyWordStatistics",
            params: this.query
          })
          .catch(err => {
            console.log(err);
          });
      let domID = "gjcfb";
      if (Echarts.getInstanceByDom(document.getElementById(domID))) {
        Echarts.getInstanceByDom(document.getElementById(domID)).clear();
      }
      that.gjcfbObj = {};
      that.gjcfbShow = res.data.data && Object.values(res.data.data).length > 0;

      if (res.data.code === 200 && res.data.data) {
        let data = res.data.data;
        let xAxis = data.list.map(item => item.title),
          series = data.list.map(item => item.event_total), // 事件数
          series2 = data.list.map(item => item.amount), // 融资额
          option = {
            tooltip: {
              trigger: "axis",
              formatter(params) {
                let maoHao = "：",
                  str = "";
                params.forEach(item => {
                  if (item.seriesName === "事件数") {
                    str += `${item.axisValue +
                      "<br />" +
                      item.seriesName +
                      maoHao +
                      item.data}件`;
                  }
                  if (item.seriesName === "融资额") {
                    str +=
                      (params.length === 2 ? `<br />` : ``) +
                      `${item.seriesName +
                      maoHao +
                      that.thousandFormatter(item.data)}元`;
                  }
                });
                return str;
              }
            },
            grid: {
              top: 40,
              left: 20,
              right: 60,
              bottom: xAxis && xAxis.length < that.endValue + 1 ? 10 : 30,
              containLabel: true
            },
            legend: {
              data: ["事件数", "融资额"]
            },
            xAxis: [
              {
                type: "category",
                data: xAxis,
                axisTick: {
                  alignWithLabel: true
                },
                axisLabel: {
                  interval: 0,
                  color: "#66666",
                  formatter(value) {
                    return value && value.length > 6
                      ? value.slice(0, 6) + "..."
                      : value;
                  }
                }
              }
            ],
            yAxis: [
              {
                type: "value",
                name: "事件数",
                nameLocation: "end",
                nameTextStyle: {
                  color: "#66666"
                }
              },
              {
                type: "value",
                name: "金额(亿元)",
                splitLine: {
                  lineStyle: {
                    color: "#DAE0E9",
                    type: "dotted"
                  }
                },
                axisLabel: {
                  show: true,
                  formatter(params) {
                    return params / that.number;
                  }
                },
                nameTextStyle: {
                  color: "#66666"
                }
              }
            ],
            barMaxWidth: 80,
            series: [
              {
                name: "事件数",
                type: "bar",
                data: series
              },
              {
                name: "融资额",
                type: "bar",
                barGap: 0, // 堆叠柱状图合并
                yAxisIndex: 1,
                data: series2
              }
            ]
          };

        if (xAxis && xAxis.length > that.endValue + 1) {
          option.dataZoom = {
            show: xAxis.length > that.endValue + 1,
            startValue: that.startValue,
            endValue: that.endValue,
            handleIcon:
              "M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z",
            handleSize: "80%",
            handleStyle: {
              color: "#fff",
              shadowBlur: 3,
              shadowColor: "rgba(0, 0, 0, 0.6)",
              shadowOffsetX: 2,
              shadowOffsetY: 2
            },
            zoomOnMouseWheel: true,
            moveOnMouseMove: true,
            top: "bottom",
            height: that.dataZoomHeight //这里可以设置dataZoom的尺寸
          };
        }
        that.gjcfbObj = data;
        that.gjcfbObj.describe = `<div>${data.describe}</div>`;
        let chart = Echarts.init(document.getElementById(domID), "customed");
        chart.setOption(option);
      }
    },
    // 轮次分布概况
    async handlerGetRoundsStatistics() {
      const that = this,
        res = await window
          .Axios({
            method: "get",
            url: "/api/tourongzi_report/getRoundsStatistics",
            params: this.query
          })
          .catch(err => {
            console.log(err);
          });
      let domID = "lcfb";
      if (Echarts.getInstanceByDom(document.getElementById(domID))) {
        Echarts.getInstanceByDom(document.getElementById(domID)).clear();
      }
      that.lcfbObj = {};
      that.lcfbShow = res.data.data && Object.values(res.data.data).length > 0;

      if (res.data.code === 200 && res.data.data) {
        let data = res.data.data;
        let xAxis = data.list.map(item => item.title),
          series = data.list.map(item => item.event_total), // 事件数
          series2 = data.list.map(item => item.amount), // 融资额
          option = {
            tooltip: {
              trigger: "axis",
              formatter(params) {
                let maoHao = "：",
                  str = "";
                params.forEach(item => {
                  if (item.seriesName === "事件数") {
                    str += `${item.axisValue +
                      "<br />" +
                      item.seriesName +
                      maoHao +
                      item.data}件`;
                  }
                  if (item.seriesName === "融资额") {
                    str +=
                      (params.length === 2 ? `<br />` : ``) +
                      `${item.seriesName +
                      maoHao +
                      that.thousandFormatter(item.data)}元`;
                  }
                });
                return str;
              }
            },
            grid: {
              top: 40,
              left: 20,
              right: 60,
              bottom: xAxis && xAxis.length < that.endValue + 1 ? 10 : 30,
              containLabel: true
            },
            legend: {
              data: ["事件数", "融资额"]
            },
            xAxis: [
              {
                type: "category",
                data: xAxis,
                axisTick: {
                  alignWithLabel: true
                },
                axisLabel: {
                  interval: 0,
                  color: "#66666",
                  formatter(value) {
                    return value && value.length > 6
                      ? value.slice(0, 6) + "..."
                      : value;
                  }
                }
              }
            ],
            yAxis: [
              {
                type: "value",
                name: "事件数",
                nameLocation: "end",
                nameTextStyle: {
                  color: "#66666"
                }
              },
              {
                type: "value",
                name: "金额(亿元)",
                splitLine: {
                  lineStyle: {
                    color: "#DAE0E9",
                    type: "dotted"
                  }
                },
                axisLabel: {
                  show: true,
                  formatter(params) {
                    return params / that.number;
                  }
                },
                nameTextStyle: {
                  color: "#66666"
                }
              }
            ],
            barMaxWidth: 80,
            series: [
              {
                name: "事件数",
                type: "bar",
                data: series
              },
              {
                name: "融资额",
                type: "bar",
                barGap: 0, // 堆叠柱状图合并
                yAxisIndex: 1,
                data: series2
              }
            ]
          };

        if (xAxis && xAxis.length > that.endValue + 1) {
          option.dataZoom = {
            show: xAxis.length > that.endValue + 1,
            startValue: that.startValue,
            endValue: that.endValue,
            handleIcon:
              "M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z",
            handleSize: "80%",
            handleStyle: {
              color: "#fff",
              shadowBlur: 3,
              shadowColor: "rgba(0, 0, 0, 0.6)",
              shadowOffsetX: 2,
              shadowOffsetY: 2
            },
            zoomOnMouseWheel: true,
            moveOnMouseMove: true,
            top: "bottom",
            height: that.dataZoomHeight //这里可以设置dataZoom的尺寸
          };
        }
        that.lcfbObj = data;
        that.lcfbObj.describe = `<div>${data.describe}</div>`;
        let chart = Echarts.init(document.getElementById(domID), "customed");
        chart.setOption(option);
      }
    },
    // 时间分布情况
    async getTimeDistribution() {
      const that = this,
        res = await window
          .Axios({
            method: "get",
            url: "/api/tourongzi_report/getTimeDistribution",
            params: this.query
          })
          .catch(err => {
            console.log(err);
          });
      let domID = "sjfb";
      if (Echarts.getInstanceByDom(document.getElementById(domID))) {
        Echarts.getInstanceByDom(document.getElementById(domID)).clear();
      }
      that.sjfbObj = {};
      that.sjfbShow = res.data.data && Object.values(res.data.data).length > 0;

      if (res.data.code === 200 && res.data.data) {
        let data = res.data.data;
        let xAxis = data.event.map(item => item.title),
          series1 = data.event.map(item => item.value),
          series2 = data.amount.map(item => item.value),
          option = {
            tooltip: {
              trigger: "axis",
              formatter(params) {
                let maoHao = "：",
                  str = "";
                params.forEach(item => {
                  if (item.seriesName === "事件数") {
                    str += `${item.axisValue +
                      "<br />" +
                      item.seriesName +
                      maoHao +
                      item.data}件`;
                  }
                  if (item.seriesName === "融资额") {
                    str +=
                      (params.length === 2 ? `<br />` : ``) +
                      `${item.seriesName +
                      maoHao +
                      that.thousandFormatter(item.data)}元`;
                  }
                });
                return str;
              }
            },
            legend: {
              data: ["事件数", "融资额"]
            },
            grid: {
              top: 40,
              left: 0,
              right: 20,
              bottom: 10,
              containLabel: true
            },
            xAxis: [
              {
                type: "category",
                nameTextStyle: {
                  color: "#66666"
                },
                boundaryGap: true,
                data: xAxis,
                axisTick: {
                  alignWithLabel: true
                },
                axisLabel: {
                  interval: 0
                }
              }
            ],
            yAxis: [
              {
                type: "value",
                name: "事件数",
                nameLocation: "end",
                nameTextStyle: {
                  color: "#66666"
                }
              },
              {
                type: "value",
                name: "金额(亿元)",
                splitLine: {
                  lineStyle: {
                    color: "#DAE0E9",
                    type: "dotted"
                  }
                },
                axisLabel: {
                  show: true,
                  formatter(params) {
                    return params / that.number;
                  }
                },
                nameTextStyle: {
                  color: "#66666"
                }
              }
            ],
            barMaxWidth: 80,
            series: [
              {
                name: "事件数",
                type: "bar",
                data: series1
              },
              {
                name: "融资额",
                type: "line",
                yAxisIndex: 1,
                data: series2
              }
            ]
          };
        that.sjfbObj = data;
        that.sjfbObj.describe = `<div>${data.describe}</div>`;
        let chart = Echarts.init(document.getElementById(domID), "customed");
        chart.setOption(option);
      }
    },
    // 事件在行业与轮次的分布情况
    async getIndustryRoundsDistribution() {
      const that = this,
        res = await window
          .Axios({
            method: "get",
            url: "/api/tourongzi_report/getIndustryRoundsDistribution",
            params: this.query
          })
          .catch(err => {
            console.log(err);
          });
      let domID = "sjInHYAndLCfb";
      if (Echarts.getInstanceByDom(document.getElementById(domID))) {
        Echarts.getInstanceByDom(document.getElementById(domID)).clear();
      }
      that.sjInHYAndLCfbObj = {};
      if (res.data.data.describe && res.data.data.list.length > 0)
        that.sjInHYAndLCfbShow = true;
      else that.sjInHYAndLCfbShow = false;

      if (res.data.code === 200 && res.data.data) {
        let data = res.data.data;
        let xAxis = data.rounds,
          yAxis = data.industry,
          series = []; // 事件数
        data.list &&
          data.list.length > 0 &&
          data.list.forEach((item, i) => {
            item.total = Number(item.total);
            let x = xAxis.findIndex(value => value === item.rounds),
              y = data.industry.findIndex(value => value === item.industry),
              value = item.total;
            series.push([x, y, value || "-"]);
          });
        let max_value = _.maxBy(data.list, "total").total,
          option = {
            grid: {
              top: 0,
              right: 55
            },
            xAxis: {
              type: "category",
              data: xAxis,
              splitArea: {
                show: true
              },
              axisLabel: {
                rotate: 45
              },
              axisLine: {
                lineStyle: {
                  color: "#aaa"
                }
              },
              splitLine: {
                show: true,
                lineStyle: {
                  color: "#c6daf0"
                }
              }
            },
            yAxis: {
              type: "category",
              data: yAxis,
              splitArea: {
                show: true
              },
              axisLabel: {
                interval: 0
              },
              axisTick: {
                show: false
              },
              axisLine: {
                lineStyle: {
                  color: "#aaa"
                }
              },
              splitLine: {
                show: true,
                lineStyle: {
                  color: "#c6daf0"
                }
              }
            },
            visualMap: [
              {
                calculable: true,
                realtime: true,
                min: 0,
                max: max_value, //根据具体最大值来确定
                top: 0,
                right: 0,
                align: "left",
                itemHeight: 333,
                itemWidth: 10
              }
            ],
            series: [
              {
                type: "heatmap",
                data: series,
                label: {
                  show: true,
                  color: "#000",
                  fontWeight: "bold",
                  formatter: function (params) {
                    if (Number(params.value[2]) > 0) {
                      return params.value[2];
                    } else {
                      return "0";
                    }
                  }
                },
                itemStyle: {
                  emphasis: {
                    shadowBlur: 10,
                    shadowColor: "rgba(0, 0, 0, 0.5)"
                  }
                }
              }
            ]
          };
        that.sjInHYAndLCfbObj = data;
        that.sjInHYAndLCfbObj.describe = `<div>${data.describe}</div>`;
        let chart = Echarts.init(document.getElementById(domID), "customed");
        chart.setOption(option);
      }
    },
    // 事件规模占比情况
    async getEventRatioDistribution() {
      const that = this,
        res = await window
          .Axios({
            method: "get",
            url: "/api/tourongzi_report/getEventRatioDistribution",
            params: this.query
          })
          .catch(err => {
            console.log(err);
          });
      this.sjgmzbObj = {};
      let domID = "sjgmzb";
      if (Echarts.getInstanceByDom(document.getElementById(domID))) {
        Echarts.getInstanceByDom(document.getElementById(domID)).clear();
      }
      that.sjgmzbShow =
        res.data.data && Object.values(res.data.data).length > 0;

      if (res.data.code === 200 && res.data.data) {
        let data = res.data.data;
        let legend = data.list.map(item => item.title),
          series = [];
        data.list.forEach(item => {
          series.push({
            name: item.title,
            value: item.values
          });
        });
        let option = {
          tooltip: {
            trigger: "item"
          },
          legend: {
            type: "scroll",
            align: "left",
            left: "center",
            top: "bottom",
            icon: "circle", //  这个字段控制形状  类型包括 circle 圆形，triangle 三角形，diamond 四边形，arrow 变异三角形，none 无
            itemWidth: 9, // 设置宽度
            itemHeight: 9, // 设置高度
            data: legend
          },
          series: [
            {
              type: "pie",
              radius: "60%",
              center: ["50%", "50%"],
              label: {
                normal: {
                  show: true,
                  position: "outside",
                  formatter: "{b} {d}%"
                }
              },
              data: series,
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: "rgba(0, 0, 0, 0.5)"
                }
              }
            }
          ]
        };
        let chart = Echarts.init(document.getElementById(domID), "customed");
        chart.setOption(option);
        this.sjgmzbObj = data.list;
        this.sjgmzbObj.describe = `<div>${res.data.data.describe}</div>`;
      }
    },
    // 绘制世界地图
    worldConfigure(worldData) {
      let that = this;
      var newArr = [];
      for (var i = 0; i < worldData.length; i++) {
        let c = worldData[i];
        var json = {
          name: c.country,
          value: parseInt(c.doc_count),
          amount: c.amount
        };
        newArr.push(json);
      }
      let max = _.maxBy(newArr, "value").value;
      let myChart = null;
      if (Echarts.getInstanceByDom(document.getElementById("dyfbMap"))) {
        myChart = Echarts.getInstanceByDom(document.getElementById("dyfbMap"));
      } else {
        myChart = Echarts.init(document.getElementById("dyfbMap"), "customed");
      }
      myChart.setOption({
        tooltip: {
          trigger: "item",
          formatter: function (params) {
            let obj = params.data;
            if (obj) {
              return `
                ${params.name}<br/>
                数量：${obj.value ? obj.value : 0}件<br/>
                金额：${that.thousandFormatter(obj.amount)}元
              `;
            } else {
              return `
                ${params.name}<br/>
                数量：0件<br/>
                金额：0元
              `;
            }
          }
        },
        nameMap: {
          Afghanistan: "阿富汗",
          Singapore: "新加坡",
          Angola: "安哥拉",
          Albania: "阿尔巴尼亚",
          "United Arab Emirates": "阿联酋",
          Argentina: "阿根廷",
          Armenia: "亚美尼亚",
          "French Southern and Antarctic Lands": "法属南半球和南极领地",
          Australia: "澳大利亚",
          Austria: "奥地利",
          Azerbaijan: "阿塞拜疆",
          Burundi: "布隆迪",
          Belgium: "比利时",
          Benin: "贝宁",
          "Burkina Faso": "布基纳法索",
          Bangladesh: "孟加拉国",
          Bulgaria: "保加利亚",
          "The Bahamas": "巴哈马",
          "Bosnia and Herzegovina": "波斯尼亚和黑塞哥维那",
          Belarus: "白俄罗斯",
          Belize: "伯利兹",
          Bermuda: "百慕大",
          Bolivia: "玻利维亚",
          Brazil: "巴西",
          Brunei: "文莱",
          Bhutan: "不丹",
          Botswana: "博茨瓦纳",
          "Central African Republic": "中非共和国",
          Canada: "加拿大",
          Switzerland: "瑞士",
          Chile: "智利",
          China: "中国",
          "Ivory Coast": "象牙海岸",
          Cameroon: "喀麦隆",
          "Democratic Republic of the Congo": "刚果民主共和国",
          "Republic of the Congo": "刚果共和国",
          Colombia: "哥伦比亚",
          "Costa Rica": "哥斯达黎加",
          Cuba: "古巴",
          "Northern Cyprus": "北塞浦路斯",
          Cyprus: "塞浦路斯",
          "Czech Republic": "捷克共和国",
          Germany: "德国",
          Djibouti: "吉布提",
          Denmark: "丹麦",
          "Dominican Republic": "多明尼加共和国",
          Algeria: "阿尔及利亚",
          Ecuador: "厄瓜多尔",
          Egypt: "埃及",
          Eritrea: "厄立特里亚",
          Spain: "西班牙",
          Estonia: "爱沙尼亚",
          Ethiopia: "埃塞俄比亚",
          Finland: "芬兰",
          Fiji: "斐",
          "Falkland Islands": "福克兰群岛",
          France: "法国",
          Gabon: "加蓬",
          "United Kingdom": "英国",
          Georgia: "格鲁吉亚",
          Ghana: "加纳",
          Guinea: "几内亚",
          Gambia: "冈比亚",
          "Guinea Bissau": "几内亚比绍",
          Greece: "希腊",
          Greenland: "格陵兰",
          Guatemala: "危地马拉",
          "French Guiana": "法属圭亚那",
          Guyana: "圭亚那",
          Honduras: "洪都拉斯",
          Croatia: "克罗地亚",
          Haiti: "海地",
          Hungary: "匈牙利",
          Indonesia: "印度尼西亚",
          India: "印度",
          Ireland: "爱尔兰",
          Iran: "伊朗",
          Iraq: "伊拉克",
          Iceland: "冰岛",
          Israel: "以色列",
          Italy: "意大利",
          Jamaica: "牙买加",
          Jordan: "约旦",
          Japan: "日本",
          Kazakhstan: "哈萨克斯坦",
          Kenya: "肯尼亚",
          Kyrgyzstan: "吉尔吉斯斯坦",
          Cambodia: "柬埔寨",
          Kosovo: "科索沃",
          Kuwait: "科威特",
          Laos: "老挝",
          Lebanon: "黎巴嫩",
          Liberia: "利比里亚",
          Libya: "利比亚",
          "Sri Lanka": "斯里兰卡",
          Lesotho: "莱索托",
          Lithuania: "立陶宛",
          Luxembourg: "卢森堡",
          Latvia: "拉脱维亚",
          Morocco: "摩洛哥",
          Moldova: "摩尔多瓦",
          Madagascar: "马达加斯加",
          Mexico: "墨西哥",
          Macedonia: "马其顿",
          Mali: "马里",
          Myanmar: "缅甸",
          Montenegro: "黑山",
          Mongolia: "蒙古",
          Mozambique: "莫桑比克",
          Mauritania: "毛里塔尼亚",
          Malawi: "马拉维",
          Malaysia: "马来西亚",
          Namibia: "纳米比亚",
          "New Caledonia": "新喀里多尼亚",
          Niger: "尼日尔",
          Nigeria: "尼日利亚",
          Nicaragua: "尼加拉瓜",
          Netherlands: "荷兰",
          Norway: "挪威",
          Nepal: "尼泊尔",
          "New Zealand": "新西兰",
          Oman: "阿曼",
          Pakistan: "巴基斯坦",
          Panama: "巴拿马",
          Peru: "秘鲁",
          Philippines: "菲律宾",
          "Papua New Guinea": "巴布亚新几内亚",
          Poland: "波兰",
          "Puerto Rico": "波多黎各",
          "North Korea": "北朝鲜",
          Portugal: "葡萄牙",
          Paraguay: "巴拉圭",
          Qatar: "卡塔尔",
          Romania: "罗马尼亚",
          Russia: "俄罗斯",
          Rwanda: "卢旺达",
          "Western Sahara": "西撒哈拉",
          "Saudi Arabia": "沙特阿拉伯",
          Sudan: "苏丹",
          "South Sudan": "南苏丹",
          Senegal: "塞内加尔",
          "Solomon Islands": "所罗门群岛",
          "Sierra Leone": "塞拉利昂",
          "El Salvador": "萨尔瓦多",
          Somaliland: "索马里兰",
          Somalia: "索马里",
          "Republic of Serbia": "塞尔维亚",
          Suriname: "苏里南",
          Slovakia: "斯洛伐克",
          Slovenia: "斯洛文尼亚",
          Sweden: "瑞典",
          Swaziland: "斯威士兰",
          Syria: "叙利亚",
          Chad: "乍得",
          Togo: "多哥",
          Thailand: "泰国",
          Tajikistan: "塔吉克斯坦",
          Turkmenistan: "土库曼斯坦",
          "East Timor": "东帝汶",
          "Trinidad and Tobago": "特里尼达和多巴哥",
          Tunisia: "突尼斯",
          Turkey: "土耳其",
          "United Republic of Tanzania": "坦桑尼亚",
          Uganda: "乌干达",
          Ukraine: "乌克兰",
          Uruguay: "乌拉圭",
          "United States": "美国",
          Uzbekistan: "乌兹别克斯坦",
          Venezuela: "委内瑞拉",
          Vietnam: "越南",
          Vanuatu: "瓦努阿图",
          "West Bank": "西岸",
          Yemen: "也门",
          "South Africa": "南非",
          Zambia: "赞比亚",
          Korea: "韩国",
          Tanzania: "坦桑尼亚",
          Zimbabwe: "津巴布韦",
          Congo: "刚果",
          "Central African Rep.": "中非",
          Serbia: "塞尔维亚",
          "Bosnia and Herz.": "波黑",
          "Czech Rep.": "捷克",
          "W. Sahara": "西撒哈拉",
          "Lao PDR": "老挝",
          "Dem.Rep.Korea": "朝鲜",
          "Falkland Is.": "福克兰群岛",
          "Timor-Leste": "东帝汶",
          "Solomon Is.": "所罗门群岛",
          Palestine: "巴勒斯坦",
          "N. Cyprus": "北塞浦路斯",
          Aland: "奥兰群岛",
          "Fr. S. Antarctic Lands": "法属南半球和南极陆地",
          Mauritius: "毛里求斯",
          Comoros: "科摩罗",
          "Eq. Guinea": "赤道几内亚",
          "Guinea-Bissau": "几内亚比绍",
          "Dominican Rep.": "多米尼加",
          "Saint Lucia": "圣卢西亚",
          Dominica: "多米尼克",
          "Antigua and Barb.": "安提瓜和巴布达",
          "U.S. Virgin Is.": "美国原始岛屿",
          Montserrat: "蒙塞拉特",
          Grenada: "格林纳达",
          Barbados: "巴巴多斯",
          Samoa: "萨摩亚",
          Bahamas: "巴哈马",
          "Cayman Is.": "开曼群岛",
          "Faeroe Is.": "法罗群岛",
          "IsIe of Man": "马恩岛",
          Malta: "马耳他共和国",
          Jersey: "泽西",
          "Cape Verde": "佛得角共和国",
          "Turks and Caicos Is.": "特克斯和凯科斯群岛",
          "St. Vin. and Gren.": "圣文森特和格林纳丁斯"
        },
        toolbox: {
          show: true,
          orient: "vertical",
          left: "right",
          top: "center"
        },
        visualMap: {
          max,
          left: "0",
          realtime: true,
          top: "bottom",
          text: ["高", "低"], // 文本，默认为数值文本
          calculable: true
        },
        roamController: {
          show: true,
          left: "right",
          mapTypeControl: {
            world: true
          }
        },
        series: [
          {
            type: "map",
            mapType: "world",
            roam: false,
            // itemStyle:{
            //     normal:{
            //         color:'#000',
            //         borderColor:'rgba(100,149,237,1)',
            //         borderWidth:0.5,
            //         areaColor: 'black',
            //         areaStyle:{
            //             color: '#000000'
            //         }
            //     }
            // },
            label: {
              show: false,
              color: "rgb(0, 0, 0)"
            },
            data: newArr
          }
        ]
      });
    },

    // 绘制中国地图
    chinaConfigure(data) {
      let that = this;
      let series = [];
      data.length > 0 &&
        data.forEach(item => {
          if (item.doc_count > 0 && item.province) {
            series.push({
              name: item.province,
              value: parseInt(item.doc_count),
              amount: item.amount
            });
          }
        });
      let max = _.maxBy(series, "value").value,
        option = {
          tooltip: {
            trigger: "item",
            formatter: function (params) {
              let obj = params.data;
              if (obj) {
                return `
                ${params.name}<br/>
                数量：${obj.value ? obj.value : 0}件<br/>
                金额：${that.thousandFormatter(obj.amount)}元
              `;
              } else {
                return `
                ${params.name}<br/>
                数量：0件<br/>
                金额：0元
              `;
              }
            }
          },
          visualMap: {
            max,
            left: "0",
            realtime: true,
            top: "bottom",
            text: ["高", "低"], // 文本，默认为数值文本
            calculable: true
          },
          series: [
            {
              type: "map",
              mapType: "china",
              // left: "10%",
              // right: "10%",
              // top: '5%',
              // bottom: '5%',
              label: {
                normal: {
                  show: false
                },
                emphasis: {
                  show: true
                }
              },
              data: series
            }
          ]
        };

      let myChart = null;
      if (Echarts.getInstanceByDom(document.getElementById("dyfbMap"))) {
        myChart = Echarts.getInstanceByDom(document.getElementById("dyfbMap"));
      } else {
        myChart = Echarts.init(document.getElementById("dyfbMap"), "customed");
      }
      myChart.setOption(option);
    },
    // 地域分布情况
    async getRegionalDistribution() {
      const that = this,
        res = await window
          .Axios({
            method: "get",
            url: "/api/tourongzi_report/getRegionalDistribution",
            params: this.query
          })
          .catch(err => {
            console.log(err);
          });
      that.dyfbObj = {};
      let domID = "dyfb";
      if (Echarts.getInstanceByDom(document.getElementById(domID))) {
        Echarts.getInstanceByDom(document.getElementById(domID)).clear();
      }
      if (res.data.data.describe && res.data.data.list.length > 0)
        that.dyfbShow = true;
      else that.dyfbShow = false;

      if (res.data.code === 200 && res.data.data) {
        let data = res.data.data;
        let xAxis = data.list.map(item => item.title),
          series = data.list.map(item => item.event_total), // 事件数
          series2 = data.list.map(item => item.amount), // 融资额
          labelOption = {
            show: true,
            position: "insideBottom",
            distance: 15,
            align: "center",
            verticalAlign: "middle",
            rotate: 0,
            fontSize: 12,
            rich: {
              name: {
                textBorderColor: "#fff"
              }
            }
          },
          option = {
            tooltip: {
              trigger: "axis",
              formatter(params) {
                let maoHao = "：",
                  str = "";
                params.forEach(item => {
                  if (item.seriesName === "事件数") {
                    str += `${item.axisValue +
                      "<br />" +
                      item.seriesName +
                      maoHao +
                      item.data}件`;
                  }
                  if (item.seriesName === "融资额") {
                    str +=
                      (params.length === 2 ? `<br />` : ``) +
                      `${item.seriesName +
                      maoHao +
                      that.thousandFormatter(item.data)}元`;
                  }
                });
                return str;
              }
            },
            grid: {
              top: 40,
              left: 20,
              bottom: xAxis && xAxis.length < that.endValue + 1 ? 10 : 30,
              containLabel: true
            },
            legend: {
              data: ["事件数", "融资额"]
            },
            xAxis: [
              {
                type: "category",
                data: xAxis,
                axisTick: {
                  alignWithLabel: true
                },
                axisLabel: {
                  interval: 0,
                  color: "#66666",
                  formatter(value) {
                    return value && value.length > 6
                      ? value.slice(0, 6) + "..."
                      : value;
                  }
                }
              }
            ],
            yAxis: [
              {
                type: "value",
                name: "事件数",
                nameLocation: "end",
                nameTextStyle: {
                  color: "#66666"
                }
              },
              {
                type: "value",
                name: "金额(亿元)",
                splitLine: {
                  lineStyle: {
                    color: "#DAE0E9",
                    type: "dotted"
                  }
                },
                axisLabel: {
                  show: true,
                  formatter(params) {
                    return params / that.number;
                  }
                },
                nameTextStyle: {
                  color: "#66666"
                }
              }
            ],
            barMaxWidth: 80,
            series: [
              {
                name: "事件数",
                barGap: 0, // 堆叠柱状图合并
                label: labelOption,
                type: "bar",
                data: series
              },
              {
                name: "融资额",
                type: "bar",
                yAxisIndex: 1,
                data: series2
              }
            ]
          },
          mapData = [];
        if (xAxis && xAxis.length > that.endValue + 1) {
          option.dataZoom = {
            show: xAxis.length > that.endValue + 1,
            startValue: that.startValue,
            endValue: that.endValue,
            handleIcon:
              "M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z",
            handleSize: "80%",
            handleStyle: {
              color: "#fff",
              shadowBlur: 3,
              shadowColor: "rgba(0, 0, 0, 0.6)",
              shadowOffsetX: 2,
              shadowOffsetY: 2
            },
            zoomOnMouseWheel: true,
            moveOnMouseMove: true,
            top: "bottom",
            height: that.dataZoomHeight //这里可以设置dataZoom的尺寸
          };
        }
        if (that.country === "中国") {
          data.list &&
            data.list.length > 0 &&
            data.list.forEach(item => {
              if (item.title) {
                mapData.push({
                  province: item.title,
                  amount: item.amount,
                  doc_count: item.event_total
                });
              }
            });
          that.chinaConfigure(mapData);
        } else if (that.country === "全球") {
          data.list &&
            data.list.length > 0 &&
            data.list.forEach(item => {
              if (item.title) {
                mapData.push({
                  country: item.title,
                  amount: item.amount,
                  doc_count: item.event_total
                });
              }
            });
          that.worldConfigure(mapData);
        }
        that.dyfbObj = data;
        that.dyfbObj.describe = `<div>${res.data.data.describe}</div>`;
        let chart = Echarts.init(document.getElementById(domID), "customed");
        chart.setOption(option);
      }
    },
    linkDetail(url, wyuid) {
      let { href } = this.$router.resolve({
        path: `/trz/${url}/` + wyuid
      });
      window.open(href, "_blank");
    },
    // 融资企业榜单
    async getCompanyTopDistribution() {
      const that = this,
        res = await window
          .Axios({
            method: "get",
            url: "/api/tourongzi_report/getCompanyTopDistribution",
            params: this.query
          })
          .catch(err => {
            console.log(err);
          });
      that.rzqyObj = {};
      let domID = "rzqyCount",
        domID2 = "rzqyAmount";
      if (Echarts.getInstanceByDom(document.getElementById(domID))) {
        Echarts.getInstanceByDom(document.getElementById(domID)).clear();
      }
      if (Echarts.getInstanceByDom(document.getElementById(domID2))) {
        Echarts.getInstanceByDom(document.getElementById(domID2)).clear();
      }
      that.rzqyShow = res.data.data && Object.values(res.data.data).length > 0;

      if (res.data.code === 200 && res.data.data) {
        let data = res.data.data;
        let event_list = data.event_list.reverse(),
          amount_list = data.amount_list.reverse(),
          yAxis1 = event_list.map(item => item.title),
          yAxis2 = amount_list.map(item => item.title),
          series1 = event_list.map(item => Number(item.event_total)),
          series11 = event_list.map(item => item.amount),
          series2 = amount_list.map(item => Number(item.event_total)),
          series22 = amount_list.map(item => item.amount),
          option1 = {
            tooltip: {
              trigger: "axis",
              formatter(params) {
                let maoHao = "：",
                  str = "";
                params.forEach(item => {
                  if (item.seriesName === "数量") {
                    str += `${item.axisValue +
                      "<br />" +
                      item.seriesName +
                      maoHao +
                      item.data}件`;
                  }
                  if (item.seriesName === "金额") {
                    str +=
                      (params.length === 2 ? `<br />` : ``) +
                      `${item.seriesName +
                      maoHao +
                      that.thousandFormatter(item.data)}元`;
                  }
                });
                return str;
              }
            },
            legend: {
              align: "left",
              left: "center",
              top: "bottom",
              data: ["数量", "金额"]
            },
            grid: {
              top: 10,
              left: 20,
              right: 80,
              bottom: 30,
              containLabel: true
            },
            xAxis: [
              {
                type: "value",
                // axisLabel: {
                //   color: "#999"
                // },
                axisTick: {
                  alignWithLabel: true
                }
              },
              {
                type: "value",
                name: "金额（亿元）",
                nameTextStyle: {
                  color: "#333"
                },
                axisLabel: {
                  show: true,
                  formatter(params) {
                    return params / that.number;
                  }
                },
                axisTick: {
                  alignWithLabel: true
                }
              }
            ],
            yAxis: {
              type: "category",
              data: yAxis1,
              triggerEvent: true,
              nameTextStyle: {
                color: "#999"
              },
              axisLabel: {
                show: true,
                formatter(value) {
                  return that.labelLenLimit(value);
                }
              }
            },
            series: [
              {
                name: "数量",
                type: "bar",
                barGap: 0,
                data: series1
              },
              {
                name: "金额",
                type: "bar",
                xAxisIndex: 1,
                data: series11
              }
            ]
          },
          option2 = {
            tooltip: {
              trigger: "axis",
              formatter(params) {
                let maoHao = "：",
                  str = "";
                params.forEach(item => {
                  if (item.seriesName === "数量") {
                    str += `${item.axisValue +
                      "<br />" +
                      item.seriesName +
                      maoHao +
                      item.data}件`;
                  }
                  if (item.seriesName === "金额") {
                    str +=
                      (params.length === 2 ? `<br />` : ``) +
                      `${item.seriesName +
                      maoHao +
                      that.thousandFormatter(item.data)}元`;
                  }
                });
                return str;
              }
            },
            legend: {
              align: "left",
              left: "center",
              top: "bottom",
              data: ["数量", "金额"]
            },
            grid: {
              top: 10,
              left: 20,
              right: 80,
              bottom: 30,
              containLabel: true
            },
            xAxis: [
              {
                type: "value",
                // axisLabel: {
                //   color: "#999"
                // },
                axisTick: {
                  alignWithLabel: true
                }
              },
              {
                type: "value",
                name: "金额（亿元）",
                nameTextStyle: {
                  color: "#333"
                },
                axisLabel: {
                  show: true,
                  formatter(params) {
                    return params / that.number;
                  }
                },
                axisTick: {
                  alignWithLabel: true
                }
              }
            ],
            yAxis: {
              type: "category",
              triggerEvent: true,
              data: yAxis2,
              nameTextStyle: {
                color: "#999"
              },
              axisLabel: {
                show: true,
                formatter(value) {
                  return that.labelLenLimit(value);
                }
              }
            },
            series: [
              {
                name: "数量",
                type: "bar",
                barGap: 0,
                data: series2
              },
              {
                name: "金额",
                type: "bar",
                xAxisIndex: 1,
                data: series22
              }
            ]
          };
        let chart = Echarts.init(document.getElementById(domID), "customed");
        chart.setOption(option1);
        // 防止重复触发点击事件
        if (chart._$handlers.click) {
          chart._$handlers.click.length = 0;
        }
        chart.on("click", function (params) {
          if (params.componentType == "yAxis") {
            let arr = data.event_list.filter(
              item => item.title === params.value
            );
            if (arr.length > 0 && arr[0].wyuid)
              that.linkDetail("qiye", arr[0].wyuid);
          }
        });
        that.rzqyObj = data;
        that.rzqyObj.describe = `<div>${res.data.data.describe}</div>`;
        let chart2 = Echarts.init(document.getElementById(domID2), "customed");
        chart2.setOption(option2);
        // 防止重复触发点击事件
        if (chart2._$handlers.click) {
          chart2._$handlers.click.length = 0;
        }
        chart2.on("click", function (params) {
          if (params.componentType == "yAxis") {
            let arr = data.amount_list.filter(
              item => item.title === params.value
            );
            if (arr.length > 0 && arr[0].wyuid)
              that.linkDetail("qiye", arr[0].wyuid);
          }
        });
      }
    },
    // 投资机构榜单
    async getJigouTopDistribution() {
      const that = this,
        res = await window
          .Axios({
            method: "get",
            url: "/api/tourongzi_report/getJigouTopDistribution",
            params: this.query
          })
          .catch(err => {
            console.log(err);
          });
      that.tzjgObj = {};
      let domID = "tzjgCount",
        domID2 = "tzjgAmount";
      if (Echarts.getInstanceByDom(document.getElementById(domID))) {
        Echarts.getInstanceByDom(document.getElementById(domID)).clear();
      }
      if (Echarts.getInstanceByDom(document.getElementById(domID2))) {
        Echarts.getInstanceByDom(document.getElementById(domID2)).clear();
      }
      that.tzjgShow = res.data.data && Object.values(res.data.data).length > 0;

      if (res.data.code === 200 && res.data.data) {
        let data = res.data.data;
        let event_list = data.event_list.reverse(),
          amount_list = data.amount_list.reverse(),
          yAxis1 = event_list.map(item => item.title),
          yAxis2 = amount_list.map(item => item.title),
          series1 = event_list.map(item => Number(item.event_total)),
          series22 = amount_list.map(item => item.amount),
          option1 = {
            tooltip: {
              trigger: "axis",
              formatter(params) {
                let maoHao = "：";
                return `${params[0].axisValue +
                  "<br />" +
                  params[0].seriesName +
                  maoHao +
                  params[0].data}件`;
              }
            },
            grid: {
              top: 10,
              left: 20,
              right: 80,
              bottom: 10,
              containLabel: true
            },
            xAxis: [
              {
                type: "value",
                name: "数量（件）",
                nameTextStyle: {
                  color: "#333"
                },
                axisTick: {
                  alignWithLabel: true
                }
              }
            ],
            yAxis: {
              type: "category",
              triggerEvent: true,
              data: yAxis1,
              nameTextStyle: {
                color: "#999"
              },
              axisLabel: {
                show: true,
                formatter(value) {
                  return that.labelLenLimit(value);
                }
              }
            },
            series: [
              {
                name: "数量",
                type: "bar",
                barGap: 0,
                data: series1
              }
            ]
          },
          option2 = {
            tooltip: {
              trigger: "axis",
              formatter(params) {
                let maoHao = "：";
                return `${params[0].axisValue +
                  "<br />" +
                  params[0].seriesName +
                  maoHao +
                  that.thousandFormatter(params[0].data)}元`;
              }
            },
            grid: {
              top: 10,
              left: 20,
              right: 80,
              bottom: 10,
              containLabel: true
            },
            xAxis: [
              {
                type: "value",
                name: "金额（亿元）",
                nameTextStyle: {
                  color: "#333"
                },
                axisLabel: {
                  show: true,
                  formatter(params) {
                    return params / that.number;
                  }
                },
                axisTick: {
                  alignWithLabel: true
                }
              }
            ],
            yAxis: {
              type: "category",
              data: yAxis2,
              triggerEvent: true,
              nameTextStyle: {
                color: "#999"
              },
              axisLabel: {
                show: true,
                formatter(value) {
                  return that.labelLenLimit(value);
                }
              }
            },
            series: [
              {
                name: "金额",
                type: "bar",
                data: series22
              }
            ]
          };
        that.tzjgObj = data;
        that.tzjgObj.describe = `<div>${res.data.data.describe}</div>`;
        let chart = Echarts.init(document.getElementById(domID), "customed");
        chart.setOption(option1);
        // 防止重复触发点击事件
        if (chart._$handlers.click) {
          chart._$handlers.click.length = 0;
        }
        chart.on("click", function (params) {
          if (params.componentType == "yAxis") {
            let arr = data.event_list.filter(
              item => item.title === params.value
            );
            if (arr.length > 0 && arr[0].wyuid)
              that.linkDetail("jigou", arr[0].wyuid);
          }
        });
        let chart2 = Echarts.init(document.getElementById(domID2), "customed");
        chart2.setOption(option2);
        //防止重复触发点击事件
        if (chart2._$handlers.click) {
          chart2._$handlers.click.length = 0;
        }
        chart2.on("click", function (params) {
          if (params.componentType == "yAxis") {
            let arr = data.amount_list.filter(
              item => item.title === params.value
            );
            if (arr.length > 0 && arr[0].wyuid)
              that.linkDetail("jigou", arr[0].wyuid);
          }
        });
      }
    },
    // IPO热门关键词
    async getKeywordsTopDistribution() {
      const that = this,
        res = await window
          .Axios({
            method: "get",
            url: "/api/tourongzi_report/getKeywordsTopDistribution",
            params: this.query
          })
          .catch(err => {
            console.log(err);
          });
      that.IPOKeywordObj = {};
      that.IPOKeywordShow =
        res.data.data && Object.values(res.data.data).length > 0;

      if (res.data.code === 200 && res.data.data) {
        let data = res.data.data;
        that.IPOKeywordObj = data;
        that.IPOKeywordObj.describe = `<div>${data.describe}</div>`;
      }
    }
  }
};
</script>

<style lang="less">
@import "~@/assets/less/var.less";

.trz-report {
  padding-top: 48px;

  .el-input__inner {
    background: #09144f !important;
    border: 1px solid #dae0e9 !important;
    color: #ffffff !important;
    height: 24px !important;
    line-height: 24px !important;
  }

  .el-select .el-input .el-select__caret {
    color: #b5c3d3 !important;
  }

  &.home-head {
    height: 64px;

    .header-content {
      width: 1200px;
    }
  }

  &.home-head {
    height: 64px;

    .header-content {
      width: 1200px;
    }
  }

  .header-trz-report {
    height: 48px;
    display: flex;
    align-items: center;
    position: fixed;
    width: 100%;
    min-width: 1200px;
    z-index: 999;
    background: rgb(9, 20, 79);
    padding: 0 20px;
    top: 0;
    left: 0;
    box-sizing: border-box;

    @keyframes fadeInUp {
      from {
        opacity: 0;
        -webkit-transform: translate3d(0, 45%, 0);
        transform: translate3d(0, 45%, 0);
      }

      to {
        opacity: 1;
        -webkit-transform: none;
        transform: none;
      }
    }

    &.transparent {
      background: transparent;
    }

    .fadeInUp {
      -webkit-animation-name: fadeInUp;
      animation-name: fadeInUp;
    }

    .header-content {
      height: 44px;
      width: 1200px;
      min-width: 1200px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      position: relative;

      .logo {
        display: flex;
        align-items: center;
        margin-right: 50px;

        img {
          width: auto;
          height: 34px;

          &:hover {
            cursor: pointer;
          }
        }
      }

      .report-header {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .left-container {
          display: flex;
          align-items: center;

          .title {
            font-size: 18px;
            color: #ffffff;
            margin-right: 20px;
          }

          div[class*="select-sort"] {
            width: 110px;
            height: 24px;
            border-radius: 4px;

            &:not(:last-child) {
              margin-right: 20px;
            }
          }
        }

        .right-container {
          .pdf-report {
            display: inline-flex;
            justify-content: center;
            align-items: center;
            width: 80px;
            height: 28px;
            background: #e7af2f;
            border-radius: 4px;
            font-size: 14px;
            color: #182462;
            cursor: pointer;
          }
        }
      }
    }
  }

  .chart_top {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 372px;

    .title {
      margin: 40px auto 20px auto;
      height: 24px;
      font-size: 24px;
      line-height: 24px;
      font-weight: 600;
      color: #0d1a62;
    }

    .newtotals {
      width: 1200px;
      margin: 0 auto;
      overflow: hidden;
      display: flex;
      justify-content: center;
      flex-direction: column;
      position: relative;
      border-radius: 4px;

      .newtotals-scroll {
        width: 100%;
        background: #f6f8fc;
        overflow: hidden;
        position: relative;
        margin-bottom: 20px;
        display: flex;
        justify-content: space-between;

        .newtotals-scroll-inner {
          position: absolute;
          width: 100%;
          top: 0px;
          left: 0px;
          height: 100%;
          display: flex;
          justify-content: flex-start;
          flex-wrap: nowrap;
        }
      }

      .describe {
        font-size: 16px;
        color: #333333;
        line-height: 24px;
      }

      .newtotals-arrow {
        display: none;
        height: 170px;
        line-height: 170px;
        width: 30px;
        color: @PrimaryColor;
        font-size: 20px;
        text-align: center;
        position: absolute;
        top: 0px;
        cursor: pointer;

        &:hover {
          background-color: rgba(222, 222, 222, 0.5);
        }
      }

      .newtotals-left {
        left: 0px;
      }

      .newtotals-right {
        right: 0px;
      }

      .newtotals-disabled {
        color: #aaa;
        cursor: normal;

        &:hover {
          background-color: transparent;
        }
      }

      .total-item {
        box-sizing: border-box;
        width: 150px;
        text-align: center;
        vertical-align: text-bottom;
        border-bottom: 3px solid @White;

        // &:hover {
        //   color: @PrimaryColor;
        //   background-color: #eff2fa;
        //   border-bottom: 3px solid @PrimaryColor;
        // }
        .li1 {
          padding-top: 20px;
          font-weight: 600;
          height: 16px;
          line-height: 16px;
          font-size: 16px;
          font-weight: 600;
          color: #182462;
        }

        .li2 {
          font-size: 14px;
          display: flex;
          justify-content: center;
          align-items: end;
          white-space: nowrap;
          flex-wrap: nowrap;
          margin: 17px 0 7px 0;
          line-height: 16px;
          font-size: 13px;
          font-weight: 400;
          color: #666666;

          span {
            height: 20px;
            line-height: 20px;
            font-size: 20px;
            font-weight: 600;
            color: #3556b9;
          }
        }

        .li3 {
          height: 16px;
          line-height: 20px;
          font-size: 13px;
          font-weight: 400;
          color: #666666;
          margin-bottom: 20px;
        }
      }
    }
  }

  .up {
    color: #e7af2f;
  }

  .down {
    color: #75d7b6;
  }

  .highlight {
    color: #e7af2f;
    font-size: 20px;
  }

  .trz-title-bg {
    display: block;
    text-align: center;
    width: 100%;
    height: 120px;
    line-height: 120px;
    background: rgb(21, 34, 97);

    .title {
      height: 28px;
      font-size: 30px;
      color: #ffffff;
      line-height: 28px;
    }
  }

  .module {
    display: flex;
    align-items: center;

    .chart {
      height: 250px;
      width: 900px;
    }

    .describe {
      width: 430px;
      height: 100%;
      font-size: 16px;
      font-weight: 400;
      color: #333333;
      line-height: 24px;
      display: flex;
      align-items: center;
    }

    .container {
      width: 1200px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-evenly;

      .special {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .line {
          width: 1px;
          height: 160px;
          background: #dae0e9;
        }

        .rzqyCount,
        .rzqyAmount,
        .tzjgCount,
        .tzjgAmount {
          display: flex;
          flex-direction: column;
          align-items: center;

          .title {
            height: 16px;
            line-height: 16px;
            font-size: 16px;
            font-weight: 600;
            color: #333333;
            margin-bottom: 20px;
          }
        }
      }
    }
  }

  .module:nth-child(odd) {
    background: #f6f8fc;
  }

  .ztqs,
  .gjcfb,
  .sjfb,
  .sjgmzb,
  .rzqy,
  .IPOKeyword {
    width: 100%;
    height: 350px;

    .title {
      margin-top: 40px;
      height: 24px;
      line-height: 24px;
      font-size: 24px;
      font-weight: 600;
      color: #0d1a62;
      margin-bottom: 20px;
    }
  }

  .IPOKeyword {
    .IPOKeywordTable {
      width: 300px;
      border-color: #dae0e9;
      margin-bottom: 30px;

      thead,
      tr th {
        height: 34px;
        font-size: 14px;
        font-weight: 600;
        color: #333333;
        line-height: 14px;
      }

      thead {
        line-height: 34px;
      }

      tr th {
        font-weight: 400;
      }
    }

    .tips {
      margin-top: 20px;
      height: 11px;
      line-height: 11px;
      font-size: 14px;
      font-weight: 400;
      color: #999999;
    }
  }

  .hyfb,
  .lcfb,
  .sjInHYAndLCfb,
  .dyfb,
  .tzjg {
    width: 100%;
    height: 350px;

    .title {
      margin-top: 40px;
      height: 24px;
      line-height: 24px;
      font-size: 24px;
      font-weight: 600;
      color: #0d1a62;
      margin-bottom: 20px;
    }
  }

  .report-footer {
    width: 100%;
    height: 213px;
    background: #050e40;

    .footer-container {
      width: 1200px;
      min-width: 1200px;
      margin: 0 auto;
      padding-top: 20px;
      text-align: center;

      .footer-slogen {
        height: 28px;
        line-height: 28px;
        font-size: 20px;
        font-weight: 600;
        color: #ffffff;
        margin-bottom: 38px;
      }

      .avatar-container {
        height: 105px;
        display: flex;
        justify-content: space-around;

        .line {
          width: 1px;
          height: 105px;
          background: #49537f;
        }

        .avatar-item {
          display: flex;
          align-items: center;

          .avatar {
            width: 96px;
            height: 96px;
            margin-right: 18px;
          }

          .qrcode {
            width: 85px;
            height: 84px;
          }

          .info {
            margin-right: 40px;
            display: flex;
            flex-direction: column;
            align-items: start;

            .name {
              height: 20px;
              line-height: 20px;
              font-size: 20px;
              font-weight: 600;
              color: #ffffff;
              margin-right: 10px;
            }

            .office {
              height: 14px;
              line-height: 14px;
              font-size: 14px;
              font-weight: 400;
              color: #ffffff;
            }

            .company {
              height: 14px;
              line-height: 14px;
              font-size: 14px;
              font-weight: 600;
              color: #ffffff;
              margin-bottom: 6px;
            }

            .phone {
              height: 14px;
              font-size: 14px;
              font-weight: 300;
              color: #ffffff;
              line-height: 14px;
              margin-bottom: 4px;

              span:not(:last-child) {
                margin-right: 10px;
              }
            }

            .email {
              height: 13px;
              line-height: 13px;
              font-size: 14px;
              font-weight: 300;
              color: #ffffff;
            }
          }
        }
      }
    }
  }

  .fullscreen-loading {
    top: 0;
    height: 100%;
  }
}

/deep/.el-input--mini .el-input__inner {
  height: 24px;
  color: #09144f;
  // font-weight: bold;
}

.el-select-dropdown__item.selected {
  color: #09144f;
}

.el-select-dropdown__item {
  border-bottom: 1px dashed #dae0e9;
  margin: 0 10px;
  padding: 0 4px;
}

.el-select-dropdown__item:last-child {
  border: none;
}

.el-select-dropdown__item.hover,
.el-select-dropdown__item:hover {
  background-color: #fff;
}

.el-select-dropdown__item:hover {
  color: #e7af2f;
}

.el-select-dropdown__item {
  font-size: 12px;
}

.select-sort {
  width: 90px;
  margin-left: 20px;
}
</style>
