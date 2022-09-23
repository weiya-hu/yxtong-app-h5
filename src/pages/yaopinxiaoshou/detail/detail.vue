<template>
  <div class="wrapper" ref="wrapper">
    <!-- 自定义加载界面 -->
    <LoadingGif :loadFlag="isLoading" v-if="isLoading"></LoadingGif>
    <!-- 加载完成显示部分 -->
    <div class="detail-list" v-else>
      <div class="detail-header header-fixed">
        <div class="header-left">
          <div class="left-top">
            <span class="top-id" :title="head_data.name1">{{
                head_data.name1
            }}</span>
          </div>
          <div class="left-bottom">
            <span class="bottom-name">
              {{ head_data.brandnamecn }}
              <span v-if="head_data.cname">({{ head_data.cname }})</span>
            </span>
            <span class="company-name">
              <a :href="
                '/search?comprehensive=company&searchwords=' +
                head_data.company
              ">{{ head_data.company }}</a>
            </span>
          </div>
        </div>
      </div>
      <div class="main">
        <div class="left-nav" :style="{ top: (showPromtNotice ? 128 : 98) + 'px' }">
          <div class="nav-list nav-event" @click="handleNavClick">
            <a class="nav-item active">销售数据</a>
            <a class="nav-item" v-if="extendList.length">扩展信息</a>
          </div>
        </div>
        <div class="right-list">
          <slide-section :title="'销售数据'" class="the-part">
            <div style="text-align: right; padding: 0 10px">
              <selectNuit v-model="nuit" gaKey="xiangqingye" title="货币单位" analy />
            </div>

            <div id="ec-xsfx"></div>
            <div class="tb-wrap">
              <table class="tb-f1">
                <tr>
                  <th>年份</th>
                  <th>销售额（{{ nuitValue }}元/RMB）</th>
                  <th>销售额（原始）</th>
                  <th>货币单位（原始）</th>
                </tr>
                <tr v-for="(item, index) in table_data" :key="index">
                  <td>{{ item.year }}</td>
                  <td>
                    {{ echartsTooltipMoney(ypxsNuitChange(nuit, item.value)) }}
                  </td>
                  <td>{{ item.oldvalue }}</td>
                  <td>{{ item.oldunit }}</td>
                </tr>
              </table>
            </div>
          </slide-section>

          <slide-section :title="'扩展信息'" class="the-part" v-if="extendList.length">
            <div class="extend-list">
              <ExtendButton v-for="(item, index) in extendList" :key="index" :item="item"></ExtendButton>
            </div>
          </slide-section>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LoadingGif from "@/components/common/globalCom/loading-gif";
import ExtendButton from "@/components/common/extend-button";
import SlideSection from "@/components/common/slide-section";
import selectNuit from "../selectNuit";
import detailScrollMixins from "@/mixins/detailScroll.js";
import { mapState } from "vuex";

export default {
  components: {
    LoadingGif,
    ExtendButton,
    SlideSection,
    selectNuit
  },
  mixins: [detailScrollMixins],
  data() {
    return {
      nuit: "1",
      head_data: {},
      table_data: [],
      view_data: {},
      isLoading: true,
      id: this.$route.path.split("/")[2],
      heightArr: [],
      echarts_data: {
        echarts: null,
        xAxis_data: [],
        yAxis_data1: [],
        yAxis_data2: []
      },
      extendList: []
    };
  },
  computed: {
    ...mapState({
      allBase: state => state.Yaopinxiaoshou.allBase,
      helpInfo: state => state.Yaopinxiaoshou.helpInfo,
      nopms: state => state.Yaopinxiaoshou.nopms
    }),
    nuitValue() {
      let value = "";
      switch (this.nuit) {
        case "1":
          value = "万";
          break;
        case "100":
          value = "百万";
          break;
        case "1000":
          value = "千万";
          break;
        case "10000":
          value = "亿";
          break;
      }
      return value;
    }
  },
  watch: {
    nuit() {
      this.dealEchartsData();
    },
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
    handleScroll() {
      // let top = $(".main").offset().top,
      //   leftNav = $(".left-nav");
      // if (top <= 50) {
      //   leftNav.css("top", (this.showPromtNotice ? 118 : 98) + "px");
      // } else {
      //   leftNav.css("top", (this.showPromtNotice ? 118 : 88) + "px");
      // }
    },
    dealEchartsData() {
      let ecData = this.view_data.list;
      let _len = ecData.length;
      let xAxis_data = [];
      let yAxis_data1 = [];
      let yAxis_data2 = [];

      if (_len > 0) {
        for (var i = 0; i < _len; i++) {
          xAxis_data.push(ecData[i].year);
          yAxis_data1.push(this.ypxsNuitChange(this.nuit, ecData[i].value));
          if (i !== 0) {
            let tb = (
              (ecData[i].value - ecData[i - 1].value) /
              ecData[i - 1].value
            ).toFixed(4);
            yAxis_data2.push(tb * 100);
          } else {
            yAxis_data2.push(null);
          }
        }
        this.echarts_data.xAxis_data = xAxis_data;
        this.echarts_data.yAxis_data1 = yAxis_data1;
        this.echarts_data.yAxis_data2 = yAxis_data2;
      }

      this.drawEcharts();
    },
    drawEcharts() {
      var _that = this;
      _that.echarts_data.echarts = Echarts.init(
        document.getElementById("ec-xsfx"),
        "yaozh_theme"
      );
      _that.echarts_data.echarts.setOption({
        tooltip: {
          trigger: "axis",
          formatter: params => {
            //实现设计图上的提示样式
            let str = params[0].name + "<br>";
            _.map(params, item => {
              if (item.seriesType == "bar") {
                let seriesname = item.seriesName.split(":");
                str +=
                  '<span style="display: inline-block;height: 6px;width: 6px;border-radius: 50%;margin-right:5px; background-color:' +
                  item.color +
                  '"></span>' +
                  "销售额（" +
                  this.nuitValue +
                  "元/RMB）: " +
                  this.echartsTooltipMoney(item.value) +
                  "<br>";
              } else if (item.seriesType == "line" && item.value) {
                str +=
                  '<span style="display: inline-block;height: 6px;width: 6px;border-radius: 50%;margin-right:5px; background-color:' +
                  item.color +
                  '"></span>' +
                  "同比: " +
                  item.value.toFixed(2) +
                  "% <br>";
              }
            });
            return str;
          }
        },
        grid: {
          containLabel: true,
          bottom: 90
        },
        legend: {
          data: [
            {
              name: `销售额（${this.nuitValue}元/RMB）`,
              icon: "circle"
            },
            {
              name: "同比（%）"
            }
          ],
          bottom: 30
        },
        xAxis: [
          {
            type: "category",
            name: "销售年份",
            nameLocation: "center",
            nameTextStyle: {
              padding: [15, 0, 0, 0]
            },
            data: this.echarts_data.xAxis_data,
            axisPointer: {
              type: "shadow"
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            name: `销售额（${this.nuitValue}元/RMB）`,
            nameLocation: "center",
            nameGap: 50,
            axisLabel: {
              formatter: function (value) {
                if (value.toString().length >= 4) {
                  return value / 1000 + "k";
                } else {
                  return value;
                }
              }
            },
            splitLine: {
              show: false
            }
          },
          {
            type: "value",
            name: "同比（%）",
            nameLocation: "center",
            nameGap: 50,
            splitLine: {
              show: false
            },
            axisLabel: {
              formatter: function (value) {
                return value + "%";
              }
            }
          }
        ],
        series: [
          {
            name: `销售额（${this.nuitValue}元/RMB）`,
            type: "bar",
            barWidth: 38,
            data: this.echarts_data.yAxis_data1,
            label: {
              show: true,
              position: "top",
              formatter: function (value) {
                let rt = (value.data / 1000).toFixed(1);
                return rt + "k";
              }
            }
          },
          {
            name: "同比（%）",
            type: "line",
            yAxisIndex: 1,
            data: this.echarts_data.yAxis_data2
          }
        ],
        title: {
          text: this.view_data.title + "-销售分析",
          x: "center",
          top: 0,
          textStyle: {
            fontSize: "16",
            color: "#646A7A"
          },
          fontSize: "8"
        },
        fontSize: "14"
      });
    },
    handleAxios() {
      window
        .Axios({
          method: "get",
          url: "/api/ypxs/" + this.id,
          params: {
            accesstoken: GETCOOKIEFUN("accesstoken")
          }
        })
        .then(res => {
          if (res.data.code === 200 && res.data.data) {
            let data = res.data.data;
            this.head_data = data.Title;
            this.table_data = data.Table;
            this.view_data = data.View;
            this.getExtendList("ypxs", data.extendList);
          }
        })
        .catch(err => {
          console.log(err);
          this.removeLoading;
        })
        .then(this.removeLoading)
        .then(this.dealEchartsData)
        .then(this.resetSomeStyles)
        .then(this.getPartsHeight)
        .then(this.addAnimation);
    },
    resetSomeStyles() {
      // 使up-down的中间线长度自适应
      $(".up-down .md-line").css({ height: $(".progress-info").height() });
      // 使down的颜色根据是否有滚动条适应
      if ($(".up-down .md-line").height() < 500) {
        $(".up-down .down i").css({ color: "#a9adb7" });
      } else {
        $(".up-down .down i").css({ color: "#626262" });
      }
    },
    // 加载完后移除加载界面
    removeLoading() {
      this.isLoading = false;
    },
    // 加载完后，state-sign盖章样式动画效果
    addAnimation() {
      $(".state-sign").css({
        visibility: "visible",
        transform: "scale(1)",
        transition: "all 300ms cubic-bezier(.75,0,1,1)"
      });
    }
  },
  created() {
    if (!this.nopms.xq) {
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
    Store.dispatch("Yaopinxiaoshou/getBaseInfo");
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

.wrapper {
  .detail-list {
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
      }
    }
  }
}

.header-left {
  justify-content: start !important;
}

.left-bottom {
  margin-left: 0 !important;
  width: 100%;
}

.left-top {
  width: unset !important;
}
</style>
