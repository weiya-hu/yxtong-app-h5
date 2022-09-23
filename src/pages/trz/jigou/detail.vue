<template>
  <div class="jigou-detail">
    <custom-header></custom-header>
    <LoadingGif
      :className="'fullscreen-loading'"
      :loadFlag="loading"
    ></LoadingGif>
    <div class="detail-container">
      <div class="container-top">
        <div
          class="title"
          v-if="
            infoObj.companyname ||
              infoObj.nature ||
              infoObj.province ||
              infoObj.stage ||
              infoObj.context
          "
        >
          {{ infoObj.companyname }}
          <div class="tag1" v-if="infoObj.nature">{{ infoObj.nature }}</div>
          <div class="tag" v-if="infoObj.province">{{ infoObj.province }}</div>
        </div>
        <div class="touzifang" v-if="infoObj.stage">
          投资阶段：<span style="color: #333;">{{ infoObj.stage }}</span>
        </div>
        <div class="rongzi-target" v-if="infoObj.context">
          <label style="white-space:nowrap;">机构简介：</label>
          <span
            :title="infoObj.context"
            style="color: #333;
              max-height: 40px;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
              overflow: hidden;"
            >{{ infoObj.context }}</span
          >
        </div>
      </div>
      <div class="cards">
        <div class="left-content">
          <div class="card" style="width: 230px;">
            <div class="summary-list">
              <a
                v-for="(item, index) in navs"
                :key="index"
                :class="['summary-item', activeNav == index && 'active']"
                @click="positionPanel(index)"
              >
                {{ item }}
              </a>
            </div>
          </div>
        </div>
        <div
          class="middle-content"
          v-if="
            showTZFX === true ||
              showGLJJ === true ||
              showTZSJ === true ||
              showXXXX === true
          "
          ref="middleContent"
        >
          <!-- 投资分析图表<el-tooltip
                  content="统计全部数据，不随左侧筛选变化。"
                  placement="top"
                  effect="light"
                >
                  <img
                    src="~@/assets/imgs/trz/question.png"
                    height="14"
                    width="14"
                    style="cursor: pointer"/></el-tooltip
              > -->
          <div class="card" v-if="showTZFX === true" id="part1">
            <div class="card-title">
              <div>
                <img
                  class="speacker"
                  src="~@/assets/imgs/tongji.png"
                  width="15"
                  height="14"
                  alt=""
                />
                投资分析
              </div>
              <el-select
                size="mini"
                disabled
                v-model="selectYear"
                @change="selectChange"
                class="select-sort"
                popper-class="popper-class"
              >
                <el-option label="近一年" value="year"></el-option>
                <el-option label="全部" value="all"></el-option>
              </el-select>
            </div>
            <div class="charts">
              <div class="chart1">
                <div id="chart1" class="chart1">
                  <NoData class="no-chart" v-if="allCount === 0"></NoData>
                </div>
                <div class="chart1-tips">
                  {{ selectYear == "year" ? "近一年" : "" }}投资数据(总计{{
                    allCount
                  }})
                </div>
              </div>
              <div class="line"></div>
              <div class="chart2">
                <div id="chart2" class="chart2">
                  <NoData class="no-chart" v-if="dqfbLen === 0"></NoData>
                </div>
                <div class="chart1-tips">
                  {{ selectYear == "year" ? "近一年" : "" }}投资地区分布(中国)
                </div>
              </div>
              <div class="chart3">
                <div id="chart3" class="chart1">
                  <NoData class="no-chart" v-if="tzlcLen === 0"></NoData>
                </div>
                <div class="chart1-tips">
                  {{ selectYear == "year" ? "近一年" : "" }}投资轮次数量
                </div>
              </div>
              <div class="line"></div>
              <div class="chart4">
                <div id="chart4" class="chart1">
                  <NoData class="no-chart" v-if="tzgmLen === 0"></NoData>
                </div>
                <div class="chart1-tips">
                  {{
                    selectYear == "year" ? "近一年" : ""
                  }}独立投资规模(金额)数量
                </div>
              </div>
              <div class="chart5">
                <div id="chart5" class="chart1">
                  <NoData class="no-chart" v-if="tzhyLen === 0"></NoData>
                </div>
                <div class="chart1-tips">
                  {{ selectYear == "year" ? "近一年" : "" }}投资行业占比
                </div>
              </div>
              <div class="line"></div>
              <div class="chart6">
                <div id="chart6" class="chart1">
                  <NoData class="no-chart" v-if="tzgxLen === 0"></NoData>
                </div>
                <div class="chart1-tips">
                  {{ selectYear == "year" ? "近一年" : "" }}投资关键词TOP10
                </div>
              </div>
            </div>
          </div>
          <!-- 管理基金 -->
          <div
            class="card"
            v-if="showGLJJ === true"
            id="part2"
            style="padding-bottom: 0;"
          >
            <div class="card-title">
              <div>
                <img
                  src="~@/assets/imgs/cpy.png"
                  class="speacker"
                  width="14"
                  height="16"
                />管理基金
                <span class="sub-title"
                  >（{{ gljjObj.length }}支基金总金额<i>{{
                    thousandFormatter(infoObj.total_amount) || 0
                  }}</i
                  >）</span
                >
              </div>
            </div>
            <div class="company">
              <div
                class="company-item"
                v-for="(item, index) in gljjObj"
                :key="index"
              >
                <h4 class="company-title">
                  <span class="title-num">{{ index + 1 }}</span>
                  {{ item.name }}
                </h4>
                <div class="company-info">
                  <div class="item">
                    <span class="key">筹集资金：</span>
                    <span class="value">{{ item.fund }}</span>
                  </div>
                  <div class="item">
                    <span class="key">状态：</span>
                    <span class="value">{{ item.state }}</span>
                  </div>
                  <div class="item">
                    <span class="key">成立时间：</span>
                    <span class="value">{{ item.establishmenttime }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- 投资事件 -->
          <div class="card" v-if="showTZSJ === true" id="part3">
            <div class="card-title">
              <div>
                <img
                  src="~@/assets/imgs/trz/touzishijian.png"
                  class="speacker"
                  width="14"
                  height="13"
                />投资事件
              </div>
            </div>
            <div class="event-box" v-if="tzsjObj">
              <evt-item
                v-for="(item, index) in tzsjObj"
                :key="index"
                :eventObj="item"
              ></evt-item>
            </div>
            <div class="more-event" @click="goToRongzi" v-if="tzsjCount > 8">
              查看更多
            </div>
          </div>
          <!-- 详细信息 -->
          <div class="card" v-if="showXXXX === true" id="part4">
            <div class="card-title">
              <div>
                <img
                  src="~@/assets/imgs/trz/summary.png"
                  class="speacker"
                  width="14"
                  height="14"
                />
                详细信息
              </div>
            </div>
            <div class="content">
              <div class="left-info">
                <div
                  class="summary-item"
                  v-if="
                    infoObj.companyname ||
                      infoObj.shortname ||
                      infoObj.foreignnames
                  "
                >
                  <div>
                    <span>机</span>
                    <span>构</span>
                    <span>名</span>
                    <span>称：</span>
                  </div>
                  <span>
                    <span v-if="infoObj.companyname">
                      {{ infoObj.companyname }}
                    </span>
                    <span v-if="infoObj.shortname"
                      >-{{ infoObj.shortname }}</span
                    >
                    <span v-if="infoObj.foreignnames">
                      -{{ infoObj.foreignnames }}
                    </span>
                  </span>
                </div>
                <div class="summary-item" v-if="infoObj.establishmenttime">
                  <div>
                    <span>成</span>
                    <span>立</span>
                    <span>时</span>
                    <span>间：</span>
                  </div>
                  {{ infoObj.establishmenttime }}
                </div>
                <div class="summary-item" v-if="infoObj.registrationplace">
                  <div>
                    <span>注</span>
                    <span>册</span>
                    <span>地</span>
                    <span>点：</span>
                  </div>
                  {{ infoObj.registrationplace }}
                </div>
                <div class="summary-item" v-if="infoObj.headoffice">
                  <div>
                    <span>机</span>
                    <span>构</span>
                    <span>总</span>
                    <span>部：</span>
                  </div>
                  {{ infoObj.headoffice }}
                </div>
                <div class="summary-item" v-if="infoObj.people">
                  <div>
                    <span>人</span>
                    <span>数：</span>
                  </div>
                  {{ infoObj.people }}
                </div>
              </div>
              <div class="left-info">
                <div class="summary-item" v-if="infoObj.phone">
                  <div>
                    <span>联</span>
                    <span>系</span>
                    <span>电</span>
                    <span>话：</span>
                  </div>
                  {{ infoObj.phone }}
                </div>
                <div class="summary-item" v-if="infoObj.fax">
                  <div>
                    <span>传</span>
                    <span>真：</span>
                  </div>
                  {{ infoObj.fax }}
                </div>
                <div class="summary-item" v-if="infoObj.postalcode">
                  <div>
                    <span>邮</span>
                    <span>编：</span>
                  </div>
                  {{ infoObj.postalcode }}
                </div>
                <div class="summary-item" v-if="infoObj.address">
                  <div>
                    <span>联</span>
                    <span>系</span>
                    <span>地</span>
                    <span>址：</span>
                  </div>
                  {{ infoObj.address }}
                </div>
                <div class="summary-item" v-if="infoObj.companyurl">
                  <div>
                    <span>网</span>
                    <span>址：</span>
                  </div>
                  <a :href="infoObj.companyurl" class="link" target="_blank">{{
                    infoObj.companyurl
                  }}</a>
                </div>
              </div>
              <!-- <div class="right-rongzi">
                B+轮成功融资
                <div class="rongzi-money">{{ infoObj.rongziMoney }}万元</div>
              </div> -->
            </div>
            <div class="content2">
              <div class="info-item" v-if="infoObj.context">
                <div class="info-label">机构简介</div>
                <div class="info-desc">
                  {{ infoObj.context }}
                </div>
              </div>
              <div class="info-item" v-if="infoObj.nature">
                <div class="info-label">机构性质</div>
                <div class="info-desc">{{ infoObj.nature }}</div>
              </div>
              <div class="info-item" v-if="infoObj.stage">
                <div class="info-label">投资阶段</div>
                <div class="info-desc">{{ infoObj.stage }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="right-content">
          <div class="card">
            <div class="card-title" style="justify-content: space-between;">
              <div>
                <img
                  src="~@/assets/imgs/trz/speaker.png"
                  class="speacker"
                  width="16"
                  height="13"
                />
                最新动态
              </div>
              <div class="refresh-btn" @click="linkToNews" v-if="newsCount > 6">
                查看更多
              </div>
            </div>
            <div class="content">
              <div class="news-list">
                <div
                  class="news-item"
                  v-for="(item, index) in newsList"
                  :key="index"
                >
                  <div
                    style="
                      overflow: hidden;
                      text-overflow: ellipsis;
                      white-space: nowrap;
                      margin-bottom: 10px;
                    "
                  >
                    <router-link
                      :to="{ path: '/trz/news/' + item.data_id }"
                      class="news-text"
                      target="_blank"
                      :title="item.title"
                      >{{ item.title }}</router-link
                    >
                  </div>
                  <div class="news-info">
                    <div class="news-date">
                      <img
                        src="~@/assets/imgs/trz/clock.png"
                        class="clock"
                        width="14"
                        height="14"
                        v-if="item.regtime"
                      />{{ item.regtime }}
                    </div>
                    <div class="news-source">
                      <img
                        src="~@/assets/imgs/trz/pin.png"
                        class="pin"
                        width="13"
                        height="14"
                        v-if="item.source"
                      />{{ item.source }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CustomHeader from "@/components/layouts/trz/header";
import EvtItem from "./comp/evt-item.vue";
import LoadingGif from "@/components/common/globalCom/loading-gif";
import MiddleScroll from "@/components/common/trz/middle.scroll.js";
import NoData from "@/components/common/trz/noData";
export default {
  components: { CustomHeader, EvtItem, LoadingGif, NoData },
  mixins: [MiddleScroll],
  data() {
    return {
      selectYear: "", // 年份选择
      navs: ["投资分析", "管理基金", "投资事件", "详细信息"],
      showGLJJ: true, // 管理基金模块 是否显示模块，如果404就隐藏该模块
      showTZFX: true, // 显示投资分析模块
      showTZSJ: true, // 显示投资事件模块
      showXXXX: true, // 显示详细信息模块
      rzlcCur: 0, // 融资历程当前下标
      infoObj: {},
      gljjObj: [],
      tzsjObj: [],
      newsList: [],
      activeNav: 0,
      tzsjCount: 8,
      showTzsjMore: true,
      loading: false,
      newsCount: 0,
      tzsjLen: 0,
      dqfbLen: 0,
      tzlcLen: 0,
      tzgmLen: 0,
      tzhyLen: 0,
      tzgxLen: 0,
      allCount: 0,
      // echartsCount: 0,
      allWyuid: ""
    };
  },
  mounted() {
    // 处理select下拉框由点击触发改为鼠标移入触发。
    $(".select-sort .el-input.is-disabled").removeClass("is-disabled");
    $(".select-sort").hover(
      () => {
        // this.$refs.elSelect.visible = false
        // this.$refs.elSelect.selectOption()
        $(".el-select-dropdown.el-popper").show(200);
        $(".el-select-dropdown.el-popper").css({
          top: "30px"
        });
      },
      () => {
        // this.$refs.elSelect.handleClose()
        $(".el-select-dropdown.el-popper").css({
          display: "none"
        });
      }
    );
    // 处理结束
    this.handlerDetail();
    this.handlerChart2();
    this.handlerChart3();
    this.handlerChart4();
    this.handlerChart5();
    this.handlerChart6();
    window.addEventListener("resize", () => {
      this.echartsResize("chart1");
      this.echartsResize("chart2");
      this.echartsResize("chart3");
      this.echartsResize("chart4");
      this.echartsResize("chart5");
      this.echartsResize("chart6");
    });
    window.addEventListener("scroll", this.handleTabFix);
  },
  beforeDestroy() {
    window.removeEventListener("resize", () => {
      this.echartsResize("chart1");
      this.echartsResize("chart2");
      this.echartsResize("chart3");
      this.echartsResize("chart4");
      this.echartsResize("chart5");
      this.echartsResize("chart6");
    });
    window.removeEventListener("scroll", this.handleTabFix);
  },
  methods: {
    selectChange(val) {
      if (val === "year") {
        window.ga(
          "send",
          "event",
          "button",
          "click",
          "viptrz_jigouanaly_oneyear"
        );
        window._paq.push([
          "trackEvent",
          "button",
          "click",
          "viptrz_jigouanaly_oneyear"
        ]);
      } else {
        window.ga("send", "event", "button", "click", "viptrz_jigouanaly_all");
        window._paq.push([
          "trackEvent",
          "button",
          "click",
          "viptrz_jigouanaly_all"
        ]);
      }
      this.selectYear = val;
      this.handlerChart1(this.selectYear);
      this.handlerChart2(this.selectYear);
      this.handlerChart3(this.selectYear);
      this.handlerChart4(this.selectYear);
      this.handlerChart5(this.selectYear);
      this.handlerChart6(this.selectYear);
      console.log(this.selectYear);
    },
    // 投资事件查看更多跳转到融资列表页
    goToRongzi() {
      let routeData = this.$router.resolve({
        path: "/trz/rongzi",
        query: {
          fourth_condition: `investoruid=${this.infoObj.wyuid}`
        }
      });
      window.open(routeData.href, "_blank");
    },

    // 投资事件
    async handlerTZSJ(pageSize) {
      let params = {
        wyuid: this.infoObj.wyuid,
        accesstoken: GETCOOKIEFUN("accesstoken")
      };
      if (pageSize) {
        params.pageSize = pageSize;
      } else {
        params.pageSize = 8;
      }
      await window
        .Axios({
          method: "get",
          url: "/api/jigoudetails/tzsj",
          params
        })
        .then(res => {
          if (res.data.code === 200 && res.data.data) {
            let data = res.data.data.res;
            this.tzsjObj = data;
            this.tzsjCount = res.data.data.count;
            this.init();
          } else {
            this.showTZSJ = false;
            this.navs.splice(this.navs.indexOf("投资事件"), 1);
          }
        })
        .catch(err => {
          console.log(err);
          this.showTZSJ = false;
          this.navs.splice(this.navs.indexOf("投资事件"), 1);
        });
    },
    // 管理基金列表
    async handlerGLJJ() {
      await window
        .Axios({
          method: "get",
          url: "/api/jigoudetails/gljj",
          params: {
            twourl: this.infoObj.twourl,
            wyuid: this.infoObj.wyuid,
            // twourl: "/pe/v6366/",
            accesstoken: GETCOOKIEFUN("accesstoken")
          }
        })
        .then(res => {
          if (res.data.code === 200 && res.data.data) {
            let data = res.data.data.res;
            this.gljjObj = data;
          } else {
            this.showGLJJ = false;
            this.navs.splice(this.navs.indexOf("管理基金"), 1);
          }
        })
        .catch(err => {
          console.log(err);
          this.showGLJJ = false;
          this.navs.splice(this.navs.indexOf("管理基金"), 1);
        });
    },
    linkToNews() {
      let routeData = this.$router.resolve({
        path: "/trz/news",
        query: {
          fourth_condition: `wyuid=${this.infoObj.wyuid}`
        }
      });
      window.open(routeData.href, "_blank");
    },
    async handlerDetail() {
      this.loading = true;
      await window
        .Axios({
          method: "get",
          url: "/api/jigoudetails/read",
          params: {
            wyuid: this.$route.params.id,
            id: this.$route.params.id,
            accesstoken: GETCOOKIEFUN("accesstoken")
          }
        })
        .then(res => {
          this.loading = false;
          if (res.data.code === 200 && res.data.data) {
            let data = res.data.data;
            if (Object.values(data).length > 0) {
              this.infoObj = data;
              this.selectChange(this.infoObj.fenxiType);
              this.handlerGLJJ();
              this.handlerNews();
              this.handlerTZSJ();
            } else {
              this.showXXXX = false;
              this.navs.splice(this.navs.indexOf("详细信息"), 1);
            }
            this.$nextTick(() => {
              $(".left-content .card").css(
                "height",
                `calc(100vh - ${$(".container-top").height() +
                  20 +
                  5 +
                  70 +
                  10}px)`
              );
            });
          } else {
            this.showXXXX = false;
            this.navs.splice(this.navs.indexOf("详细信息"), 1);
          }
        })
        .catch(err => {
          console.log(err);
          this.showXXXX = false;
          this.navs.splice(this.navs.indexOf("详细信息"), 1);
        });
    },
    // 最新动态
    async handlerNews() {
      await window
        .Axios({
          method: "get",
          url: "/api/jigoudetails/news",
          params: {
            wyuid: this.infoObj.wyuid,
            // TODO 暂时写死用于绑定数据wyuid
            // wyuid: "76155e33b2bae3c2da5c071a479504fe",
            accesstoken: GETCOOKIEFUN("accesstoken")
          }
        })
        .then(res => {
          if (res.data.code === 200 && res.data.data) {
            let data = res.data.data.res;
            this.newsCount = res.data.data.count;
            this.newsList = data;
            this.allWyuid = res.data.data.allWyuid;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    echartsResize(id) {
      let echart = Echarts.getInstanceByDom(document.getElementById(id));
      echart && echart.resize();
    },
    // 近一年投资数据(总计30)
    async handlerChart1(fenxiType) {
      let params = {
        wyuid: this.$route.params.id,
        action: "tzsj",
        accesstoken: GETCOOKIEFUN("accesstoken")
      };
      if (fenxiType) {
        params.fenxiType = fenxiType;
      }
      await window
        .Axios({
          method: "get",
          url: "/api/jigoudetails/tzfxAggs",
          params
        })
        .then(res => {
          if (res.data.code === 200 && res.data.data) {
            this.tzsjLen = res.data.data.all_count;
            if (res.data.data.all_count > 0) {
              this.allCount = res.data.data.all_count;
              let data = res.data.data.res,
                xAxis = data.map(item => item.moth),
                series = data.map(item => item.doc_count),
                option = {
                  tooltip: {
                    trigger: "axis",
                    axisPointer: {
                      // 坐标轴指示器，坐标轴触发有效
                      type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
                    }
                  },
                  dataZoom: [
                    {
                      show: data.length > 12 && fenxiType == "all",
                      startValue: data.length - 12,
                      endValue: data.length - 1,
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
                      height: 20 //这里可以设置dataZoom的尺寸
                    }
                  ],
                  grid: {
                    top: 40,
                    left: 20,
                    right: 40,
                    bottom: xAxis && xAxis.length < 12 ? 10 : 40,
                    containLabel: true
                  },
                  xAxis: [
                    {
                      type: "category",
                      name: fenxiType == "year" ? "月" : "年",
                      nameTextStyle: {
                        color: "#66666"
                      },
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
                    }
                  ]
                };

              Echarts.init(
                document.getElementById("chart1"),
                "customed"
              ).setOption(option);
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 近一年投资地区分布(中国)
    async handlerChart2(fenxiType) {
      await window
        .Axios({
          method: "get",
          url: "/api/jigoudetails/tzfxAggs",
          params: {
            wyuid: this.$route.params.id,
            // wyuid: "28b58b9fb1407cc0a35f89b062bdc731",
            action: "dqfb",
            fenxiType: fenxiType,
            accesstoken: GETCOOKIEFUN("accesstoken")
          }
        })
        .then(res => {
          if (res.data.code === 200 && res.data.data) {
            this.dqfbLen = res.data.data.res.length || 0;
            if (res.data.data.res && res.data.data.res.length > 0) {
              let data = res.data.data.res,
                series = [];
              data &&
                data.length > 0 &&
                data.forEach(item => {
                  if (item.doc_count > 0 && item.province) {
                    // if (item.province.includes("省"))
                    //   item.province = item.province.replace("省", "");
                    if (item.province.includes("市"))
                      item.province = item.province.replace("市", "");
                    let provinces = {
                      内蒙古自治区: "内蒙古",
                      广西壮族自治区: "广西",
                      西藏自治区: "西藏",
                      宁夏回族自治区: "宁夏",
                      新疆维吾尔自治区: "新疆",
                      香港特别行政区: "香港",
                      澳门特别行政区: "澳门"
                    };
                    if (provinces[item.province])
                      item.province = provinces[item.province];
                    series.push({
                      name: item.province,
                      value: parseInt(item.doc_count)
                    });
                  }
                });
              let max = _.maxBy(series, "value").value,
                min = _.minBy(series, "value").value,
                option = {
                  tooltip: {
                    trigger: "item",
                    formatter: function(params) {
                      return `${params.name}：${
                        params.value ? params.value : 0
                      }`;
                    }
                  },
                  visualMap: {
                    max,
                    left: "60",
                    top: "bottom",
                    text: ["高", "低"], // 文本，默认为数值文本
                    calculable: true
                  },
                  series: [
                    {
                      type: "map",
                      mapType: "china",
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

              Echarts.init(
                document.getElementById("chart2"),
                "customed"
              ).setOption(option);
            }
          }
        })
        .catch(err => {
          console.log(err);
          // this.echartsCount += 1;
        });
    },
    // 近一年投资轮次数量
    async handlerChart3(fenxiType) {
      await window
        .Axios({
          method: "get",
          url: "/api/jigoudetails/tzfxAggs",
          params: {
            wyuid: this.$route.params.id,
            action: "tzlc",
            fenxiType: fenxiType,
            accesstoken: GETCOOKIEFUN("accesstoken")
          }
        })
        .then(res => {
          if (res.data.code === 200 && res.data.data) {
            this.tzlcLen = res.data.data.res.length || 0;
            if (res.data.data.res.length > 0) {
              let data = res.data.data.res,
                xAxis = data.map(item => item.round),
                series = data.map(item => item.doc_count),
                option = {
                  tooltip: {
                    trigger: "axis",
                    axisPointer: {
                      // 坐标轴指示器，坐标轴触发有效
                      type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
                    }
                  },
                  grid: {
                    top: 40,
                    left: 20,
                    right: 20,
                    bottom: xAxis && xAxis.length < 10 ? 10 : 25,
                    containLabel: true
                  },
                  xAxis: [
                    {
                      type: "category",
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
                    }
                  ]
                };
              if (xAxis && xAxis.length > 10) {
                option.dataZoom = {
                  show: xAxis.length > 10,
                  startValue: 0,
                  endValue: 9,
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
                  left: "center", // 组件离容器左侧的距离,'left', 'center', 'right','20%'
                  top: "bottom", // 组件离容器上侧的距离,'top', 'middle', 'bottom','20%'
                  right: "auto", // 组件离容器右侧的距离,'20%'
                  bottom: "auto", // 组件离容器下侧的距离,'20%'
                  height: 20 //这里可以设置dataZoom的尺寸
                };
              }

              Echarts.init(
                document.getElementById("chart3"),
                "customed"
              ).setOption(option);
            } else {
              // this.echartsCount += 1;
            }
          } else {
            // this.echartsCount += 1;
          }
        })
        .catch(err => {
          console.log(err);
          // this.echartsCount += 1;
        });
    },
    // 近一年独立投资规模(金额)数量
    async handlerChart4(fenxiType) {
      await window
        .Axios({
          method: "get",
          url: "/api/jigoudetails/tzfxAggs",
          params: {
            wyuid: this.$route.params.id,
            action: "tzgm",
            fenxiType: fenxiType,
            accesstoken: GETCOOKIEFUN("accesstoken")
          }
        })
        .then(res => {
          if (res.data.code === 200 && res.data.data) {
            this.tzgmLen = res.data.data.res.length || 0;
            if (res.data.data.res.length > 0) {
              let data = res.data.data.res,
                xAxis = data.map(item => item.label),
                series = data.map(item => item.doc_count),
                option = {
                  tooltip: {
                    trigger: "axis",
                    axisPointer: {
                      // 坐标轴指示器，坐标轴触发有效
                      type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
                    }
                  },
                  grid: {
                    top: 40,
                    left: 20,
                    right: 20,
                    bottom: 10,
                    containLabel: true
                  },
                  xAxis: [
                    {
                      type: "category",
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
                    }
                  ]
                };

              Echarts.init(
                document.getElementById("chart4"),
                "customed"
              ).setOption(option);
            } else {
              // this.echartsCount += 1;
            }
          } else {
            // this.echartsCount += 1;
          }
        })
        .catch(err => {
          console.log(err);
          // this.echartsCount += 1;
        });
    },
    // 近一年投资行业占比
    async handlerChart5(fenxiType) {
      await window
        .Axios({
          method: "get",
          url: "/api/jigoudetails/tzfxAggs",
          params: {
            wyuid: this.$route.params.id,
            action: "tzhy",
            fenxiType: fenxiType,
            accesstoken: GETCOOKIEFUN("accesstoken")
          }
        })
        .then(res => {
          if (res.data.code === 200 && res.data.data) {
            this.tzhyLen = res.data.data.res.length || 0;
            if (res.data.data.res.length > 0) {
              let data = res.data.data.res,
                legend = data.map(item => item.label),
                series = [];
              data.forEach(item => {
                series.push({
                  name: item.label,
                  value: item.doc_count
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
                        formatter: "{b}{d}%"
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
              Echarts.init(
                document.getElementById("chart5"),
                "customed"
              ).setOption(option);
            } else {
              // this.echartsCount += 1;
            }
          } else {
            // this.echartsCount += 1;
          }
        })
        .catch(err => {
          console.log(err);
          // this.echartsCount += 1;
        });
    },
    // 近一年投资关键词TOP10
    async handlerChart6(fenxiType) {
      await window
        .Axios({
          method: "get",
          url: "/api/jigoudetails/tzfxAggs",
          params: {
            wyuid: this.$route.params.id,
            action: "tzgx",
            fenxiType: fenxiType,
            accesstoken: GETCOOKIEFUN("accesstoken")
          }
        })
        .then(res => {
          if (res.data.code === 200 && res.data.data) {
            this.tzgxLen = res.data.data.res.length || 0;
            if (res.data.data.res.length > 0) {
              let data = _.orderBy(res.data.data.res, ["doc_count"], ["asc"]),
                that = this,
                yAxis = data.map(item => item.label),
                series = data.map(item => item.doc_count),
                option = {
                  tooltip: {
                    trigger: "axis",
                    axisPointer: {
                      type: "shadow"
                    }
                  },
                  grid: {
                    top: 20,
                    left: 20,
                    right: 20,
                    bottom: 10,
                    containLabel: true
                  },
                  xAxis: {
                    type: "value",
                    axisTick: {
                      alignWithLabel: true
                    },
                    axisLabel: {
                      interval: 0
                    }
                  },
                  yAxis: {
                    type: "category",
                    data: yAxis,
                    nameTextStyle: {
                      color: "#66666"
                    },
                    axisLabel: {
                      show: true,
                      color: "#66666",
                      formatter(value) {
                        return that.labelLenLimit(value);
                      }
                    }
                  },
                  barMaxWidth: 80,
                  series: [
                    {
                      name: "投资数量",
                      type: "bar",
                      data: series
                    }
                  ]
                };

              Echarts.init(
                document.getElementById("chart6"),
                "customed"
              ).setOption(option);
            } else {
              // // this.echartsCount += 1;
              // this.navs.splice(this.navs.indexOf("投资分析"), 1);
              // this.showTZFX = this.echartsCount !== 6;
            }
          } else {
            // // this.echartsCount += 1;
            // this.navs.splice(this.navs.indexOf("投资分析"), 1);
            // this.showTZFX = this.echartsCount !== 6;
          }
        })
        .catch(err => {
          console.log(err);
          // // this.echartsCount += 1;
          // this.navs.splice(this.navs.indexOf("投资分析"), 1);
          // console.log(this.echartsCount);
          // this.showTZFX = this.echartsCount !== 6;
        });
    },
    // 左侧按钮定位事件
    positionPanel(index) {
      // document.getElementById("panel-" + id).scrollIntoView();
      this.goTop(index);
    }
  }
};
</script>

<style lang="less" scoped>
.jigou-detail {
  min-width: 1280px;
  .detail-container {
    width: calc(100vw - 10px);
    min-height: calc(100vh - 70px);
    margin: 68px 10px 0 0;

    .container-top {
      margin-bottom: 20px;
      display: flex;
      flex-flow: column;
    }

    .touzifang-item {
      display: flex;
      height: 13px;
      line-height: 20px;
      font-size: 13px;
      font-weight: 400;
      color: #09144f;
      margin-right: 10px;
    }

    .touzifang {
      line-height: 20px;
      font-size: 13px;
      font-weight: 400;
      color: #666666;
      display: flex;
    }

    .rongzi-target {
      line-height: 20px;
      font-size: 13px;
      font-weight: 400;
      display: flex;
      color: #666666;
      margin: 6px 0 0px 0;
      width: calc(100vw - 360px);
      min-width: 1000px;
    }

    .title,
    .touzifang,
    .rongzi-target {
      padding-left: 20px;
    }

    .title {
      display: flex;
      align-items: center;
      height: 18px;
      line-height: 18px;
      font-size: 18px;
      font-weight: 600;
      color: #333333;
      margin-bottom: 14px;

      .tag {
        padding: 0 10px;
        height: 20px;
        border-radius: 4px;
        border: 1px solid #3556b9;
        color: #3556b9;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 12px;
        line-height: 12px;
        font-weight: 400;
        margin-left: 10px;
      }

      .tag1 {
        font-size: 12px;
        color: #fff;
        font-weight: normal;
        line-height: 1;
        padding: 5px;
        background-color: #3556b9;
        border-radius: 4px;
        margin-left: 10px;
      }
    }

    .clock,
    .pin {
      margin-right: 6px;
    }

    .second-title {
      display: flex;
      align-items: center;
      height: 14px;
      line-height: 14px;
      font-size: 12px;
      font-weight: 400;
      color: #999999;
      margin-bottom: 20px;

      .pin {
        margin-left: 20px;
      }
    }

    .cards {
      display: flex;
      min-width: 1200px;
      .left-content,
      .middle-content {
        margin-right: 10px;
      }

      .left-content {
        width: 230px;
        padding: 5px 0 0 0;
        box-sizing: border-box;
        .card {
          height: calc(100vh - 84px);
          padding-bottom: 0;
        }
      }

      .middle-content {
        width: calc(100vw - 560px);
        min-width: 800px;
        height: calc(100vh - 200px);
        overflow-y: auto;
        padding: 5px;
        box-sizing: border-box;

        .charts {
          position: relative;
          width: 100%;
          display: flex;
          flex-wrap: wrap;
          justify-content: space-evenly;
          align-items: center;
          .chart1 {
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .chart1-tips {
            height: 18px;
            line-height: 18px;
            font-size: 13px;
            font-weight: 400;
            color: #666666;
            display: flex;
            justify-content: center;
            align-items: center;

            img {
              margin-left: 6px;
            }
          }
          #chart1,
          #chart2,
          #chart3,
          #chart4,
          #chart5,
          #chart6 {
            height: 260px;
            width: calc((100vw - 600px) / 2);
            min-width: 300px;
            box-sizing: border-box;
            display: inline-block;
          }
          .line {
            width: 1px;
            height: 220px;
            background: #dae0e9;
          }
        }

        .content {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          .left-info {
            width: 50%;
            .summary-item {
              display: flex;
              align-items: baseline;
              margin-bottom: 10px;
              color: #333;
              div {
                width: 70px;
                height: 14px;
                line-height: 14px;
                font-size: 14px;
                font-weight: 400;
                color: #666666;
                display: flex;
                justify-content: space-between;
              }
              .link {
                line-height: 14px;
                font-size: 14px;
                font-weight: 400;
                color: #3556b9;
                text-decoration: none;
              }
            }
          }

          .right-rongzi {
            width: 200px;
            height: 84px;
            background: #f5f8fc;
            border-radius: 4px;
            border: 1px solid #dae0e9;
            font-size: 16px;
            font-weight: 400;
            color: #666666;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            .rongzi-money {
              margin-top: 6px;
              height: 26px;
              line-height: 26px;
              font-size: 26px;
              font-weight: 600;
              color: #e7af2f;
            }
          }
        }

        .content2 {
          width: 100%;

          .info-item {
            margin-left: 20px;
            display: flex;
            width: calc(100% - 40px);
            border-radius: 4px;
            border: 1px solid #dae0e9;
            &:not(:last-child) {
              margin-bottom: 10px;
            }
            .info-label {
              width: 96px;
              min-height: 34px;
              background: #dae0e9;
              border-radius: 4px 0px 0px 4px;
              display: flex;
              justify-content: center;
              align-items: center;
              font-size: 14px;
              font-weight: 400;
              color: #333333;
              line-height: 20px;
            }

            .info-desc {
              display: flex;
              flex: 1;
              align-items: center;
              margin-left: 20px;
              margin-right: 20px;
              font-size: 14px;
              font-weight: 400;
              color: #333333;
              line-height: 20px;
              padding: 6px 0;
              box-sizing: border-box;
            }
          }
        }

        .card {
          width: 100%;
        }
      }
      .card {
        width: calc(100vw - 560px);
        padding-bottom: 20px;
        background: #ffffff;
        box-shadow: 0px 1px 6px 0px rgba(9, 20, 79, 0.19);
        border-radius: 4px;
        position: relative;
        &:not(:last-child) {
          margin-bottom: 10px;
        }

        // &:hover > .card-title::before {
        //   content: " ";
        //   position: absolute;
        //   top: 0;
        //   left: 0;
        //   height: 36px;
        //   width: 2px;
        //   background: #e7af2f;
        // }

        .card-title {
          width: calc(100% - 40px);
          height: 16px;
          line-height: 36px;
          background: #f5f8fc;
          border-radius: 4px 4px 0px 0px;
          padding: 10px 20px;
          font-size: 16px;
          font-weight: 600;
          color: #0d1a62;
          display: flex;
          align-items: center;
          .sub-title {
            font-size: 13px;
            color: #666;
            font-weight: 400;
            i {
              color: #e7af2f;
              font-style: normal;
            }
          }
          .refresh-btn {
            height: 14px;
            line-height: 14px;
            font-size: 14px;
            font-weight: 400;
            color: #3556b9;
            cursor: pointer;
          }
        }
        .summary-list {
          .summary-item {
            height: 14px;
            line-height: 14px;
            font-size: 14px;
            font-weight: 400;
            color: #09144f;
            padding: 12px 20px;
            border-left: 2px solid #fff;
            cursor: pointer;
            position: relative;
            display: block;
            text-decoration: none;
            &::after {
              content: "";
              width: calc(100% - 40px);
              position: absolute;
              bottom: 0;
              left: 20px;
              border-bottom: 1px dashed #dae0e9;
            }
            &.active,
            &:hover {
              background-color: #f5f8fc;
              border-left: 2px solid #e7af2f;
            }
          }
        }
        .content {
          padding: 20px 20px 10px 20px;
          font-size: 14px;
          font-weight: 400;
          color: #999999;
          line-height: 20px;
          .news-list {
            margin-top: 10px;
            .news-item {
              &:not(:last-child) {
                padding-bottom: 10px;
                margin-bottom: 10px;
                border-bottom: 1px dotted #dae0e9;
              }
              .news-text {
                line-height: 20px;
                font-size: 13px;
                font-weight: 400;
                color: #333333;
                margin-bottom: 10px;
                cursor: pointer;
                &:hover {
                  color: #e7af2f;
                  text-decoration: none;
                }
              }
              .news-info {
                display: flex;
                justify-content: space-between;
                align-items: center;
                height: 14px;
                line-height: 14px;
                font-size: 12px;
                font-weight: 400;
                color: #999999;

                .news-date,
                .news-source {
                  display: flex;
                  align-items: center;
                }
              }
            }

            .news-more-btn {
              width: 120px;
              height: 28px;
              background: #3556b9;
              border-radius: 4px;
              margin: 20px auto 10px auto;
              font-size: 14px;
              font-weight: 400;
              color: #ffffff;
              line-height: 20px;
              display: flex;
              justify-content: center;
              align-items: center;
              cursor: pointer;
            }
          }
        }

        .btn-area {
          width: calc(100% - 40px);
          border-top: 1px dotted #dae0e9;
          margin-top: 108px;
          height: 60px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;

          .btn {
            height: 22px;
            line-height: 22px;
            font-size: 14px;
            font-weight: 400;
            color: #333333;
            cursor: pointer;
            text-decoration: none;

            .prev {
              color: #e7af2f;
            }

            .next {
              color: #09144f;
            }
          }
        }
      }
      .right-content {
        padding: 5px 0;
        box-sizing: border-box;
      }
      .right-content .card {
        width: 300px;
        padding-bottom: 0;
        .content {
          padding: 10px 20px;
        }
      }
    }
    .speacker {
      margin-right: 6px;
    }
  }
}
.company {
  padding: 20px 20px 0;
  .company-item {
    padding-bottom: 20px;
    .company-title {
      font-size: 14px;
      color: #333;
      font-weight: 600;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      .title-num {
        width: 18px;
        height: 18px;
        background-color: #3556b9;
        font-size: 12px;
        color: #fff;
        border-radius: 50%;
        text-align: center;
        margin-right: 6px;
      }
    }
    .company-info {
      min-height: 36px;
      border: 1px solid #dae0e9;
      display: flex;
      padding: 0 20px;
      border-radius: 4px;
      margin-bottom: 20px;
      .item {
        display: flex;
        align-items: center;
        font-size: 14px;
        margin-right: 30px;
        .key {
          color: #666;
          white-space: nowrap;
        }
        .value {
          color: #333;
        }
        a {
          white-space: nowrap;
          text-decoration: none;
          color: #3e5dbc;
        }
      }
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
.event-box {
  padding: 20px 20px 0;
  display: flex;
  flex-wrap: wrap;
}
.more-event {
  width: 110px;
  height: 28px;
  line-height: 28px;
  font-size: 14px;
  color: #3556b9;
  border: 1px solid #3556b9;
  border-radius: 4px;
  text-align: center;
  cursor: pointer;
  user-select: none;
  margin: 10px auto 0;
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
