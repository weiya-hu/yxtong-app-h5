<template>
  <div class="wrapper globalapproval-detail" ref="wrapper">
    <!-- 自定义加载界面 -->
    <LoadingGif :loadFlag="isLoading" v-if="isLoading"></LoadingGif>
    <!-- 加载完成显示部分 -->
    <div class="detail-list" style="padding-top: 50px" v-else>
      <div class="detail-header header-fixed" :style="{ top: (showPromtNotice ? 78 : 48) + 'px' }"
        v-if="data.cname || data.activeingredient">
        <div class="left-top">
          <div class="top-id" :title="data.cname">
            <span v-if="data.cname">{{ data.cname }}</span>
            <span v-if="data.activeingredient">{{
                data.activeingredient
            }}</span>
          </div>
        </div>
      </div>

      <ul class="basic-info">
        <li v-if="
          data.targets_abbr && Object.values(data.targets_abbr).length > 0
        ">
          <label>靶点</label>
          <span style="width: 100%;word-break: break-word;flex-wrap: wrap;" class="t-line5">
            <div v-for="(value, key, index) in data.targets_abbr" :key="index">
              <div style="display: inline-block;" v-if="value !== ''">
                <router-link tag="a" :to="'/targetdatas/' + value" target="_blank">
                  {{
                      key +
                      (index < Object.values(data.targets_abbr).length - 1 ? ";" : "")
                  }} </router-link>
              </div>
              <div v-else>
                <span>
                  {{
                      key +
                      (index < Object.values(data.targets_abbr).length - 1 ? ";" : "")
                  }} </span>
              </div>
            </div>
          </span>
        </li>
        <li v-else-if="data.targets && Object.values(data.targets).length > 0">
          <label>靶点</label>
          <span style="width: 100%;word-break: break-word;flex-wrap: wrap;" class="t-line5">
            <div v-for="(value, key, index) in data.targets" :key="index">
              <div style="display: inline-block;" v-if="value !== ''">
                <router-link tag="a" :to="'/targetdatas/' + value" target="_blank">
                  {{
                      key +
                      (index < Object.values(data.targets).length - 1 ? ";" : "")
                  }} </router-link>
              </div>
              <div v-else>
                <span>
                  {{
                      key +
                      (index < Object.values(data.targets).length - 1 ? ";" : "")
                  }} </span>
              </div>
            </div>
          </span>
        </li>
        <li v-if="data.atcarr && Object.values(data.atcarr).length > 0">
          <label>ATC分类</label>
          <span :style="wordBreak" class="t-line5">
            <div v-for="(item, index) in getAtcNames(data.atc)" :key="item" class="clearfix">
              <span>{{ data.atc }}&nbsp;&nbsp;</span>
              <span>{{ getAtc(item, data.atcarr) }}</span>
              <br v-if="index % 2 != 0" />
            </div>
          </span>
        </li>
        <li v-if="data.desc">
          <label>上市概况</label>
          <span :style="wordBreak" v-html="data.desc"> </span>
        </li>
        <li v-if="
          data.drugscountry.thicker.length > 0 ||
          data.drugscountry.pin.length > 0
        ">
          <label>上市国家</label>
          <div class="ssgj-words" :style="wordBreak">
            <span v-if="
              data.drugscountry.thicker &&
              data.drugscountry.thicker.length > 0
            " v-for="(item, index) in data.drugscountry.thicker" :key="'bold' + index" style="font-weight:bold;"
              class="ssgj-word">{{ item }}</span>
            <span class="ssgj-word" v-if="data.drugscountry.pin && data.drugscountry.pin.length > 0"
              v-for="(item, index) in data.drugscountry.pin" :key="index">{{ item }}</span>
          </div>
        </li>
      </ul>
      <div class="main">
        <div class="left-nav">
          <div class="nav-list nav-event" @click="handleNavClick">
            <a class="nav-item active" :data-index="0" v-if="pzlcData.length > 0">批准历程</a>
            <a class="nav-item" :data-index="1" v-if="ssgjData.length > 0">上市国家</a>
            <a class="nav-item" :data-index="2">剂型分布</a>
            <a class="nav-item" :data-index="3" v-if="qqxsData.length > 0">全球销售</a>
          </div>
        </div>
        <div class="right-list">
          <keep-alive>
            <slide-section :title="'批准历程'" class="the-part part-one" v-if="pzlcData.length > 0 && index === 0">
              <span v-if="report_info && report_info != null && Object.keys(report_info).length > 0" class="go-btn"
                @click="go">
                <img src="@/assets/imgs/go-icon.png" width="16" height="14" /> 原研追踪
              </span> 
              <pzlcDetail :data="pzlcData" />
            </slide-section>
            <slide-section :title="'上市国家'" class="the-part part-two" v-else-if="ssgjData.length > 0 && index === 1">
              <ssgjDetail :name="data.activeingredient" :cname="data.cname" :data="ssgjData" />
            </slide-section>
            <slide-section :title="'剂型分布'" class="the-part part-three" v-else-if="jxfbData.length > 0 && index === 2">
              <jxfbDetail :name="data.activeingredient" :cname="data.cname" :data="jxfbData" />
            </slide-section>
            <slide-section :title="'全球销售'" class="the-part part-four" v-else-if="qqxsData.length > 0 && index === 3">
              <qqxsDetail :data="qqxsData" />
            </slide-section>
          </keep-alive>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LoadingGif from "@/components/common/globalCom/loading-gif";
import SlideSection from "@/components/common/slide-section";
import ssgjDetail from "./components/ssgj2";
import jxfbDetail from "./components/jxfb2";
import pzlcDetail from "./components/pzlc";
import qqxsDetail from "./components/qqxs";
import { mapState } from "vuex";

export default {
  components: {
    ssgjDetail,
    jxfbDetail,
    pzlcDetail,
    qqxsDetail,
    LoadingGif,
    SlideSection
  },
  data() {
    return {
      report_info: {
        id: '',
        englishname: '',
        pinn: ''
      },
      ylbm: '',
      index: 0,
      ssgjData: [],
      jxfbData: [],
      pzlcData: [],
      qqxsData: [],
      isLoading: true,
      hasPartOne: true,
      hasPartTwo: false,
      hasPartThree: false,
      hasPartFour: false,
      hasPartFive: false,
      hasExtend: false,
      wordBreak: "word-break: break-word;",
      css1: `overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      max-height: 36px;`,
      activeingredient: this.$route.query.activeingredient,
      data: {
        cname: "",
        activeingredient: ""
      },
      IDs: ["guojia"]
    };
  },
  computed: {
    ...mapState({
      showPromtNotice: state => state.showPromtNotice
    })
  },
  watch: {
    showPromtNotice: {
      handler(val) {
        this.$nextTick(() => {
          if (val) $(".left-nav").css("top", $(".left-nav").css("top") + 30);
        });
        if (document.querySelector(".header-fixed"))
          document.querySelector(".header-fixed").style.top =
            (val ? 78 : 48) + "px";
      }
    }
  },
  mounted() {
    Store.dispatch("Globalapproval/getBaseInfo");
    window.addEventListener("scroll", this.handleScroll, true);
    if (this.$route.query.activeingredient) {
      this.handlerDetail();
    }
  },
  methods: {
    go() {
      const { href } = this.$router.resolve({
        path: `/report/${this.report_info.id}`,
        query: {
          pinn: this.report_info.pinn,
          englishname: this.report_info.englishname
        }
      })
      window.open(href, '_blank');
    },
    handleNavClick(e) {
      let index = $(e.target).attr("data-index");
      this.index = parseInt(index);

      $(e.target)
        .parent()
        .children()
        .removeClass("active");
      $(e.target).addClass("active");
    },
    handleScroll() {
      // let top = $(".main").offset().top,
      //   leftNav = $(".left-nav");
      // if (top <= 50) {
      //   leftNav.css("top", (this.showPromtNotice ? 118 : 98) + "px");
      // } else {
      //   leftNav.css("top", (this.showPromtNotice ? 118 : 88) + "px");
      // }
    },
    getAtcNames(name) {
      return name ? name.replace(/\s+/g, "").split(";") : [];
    },
    getAtc(name, arr) {
      let str = "";
      if (arr) {
        for (let index in arr[name]) {
          str += arr[name][index].shuoming + " > ";
        }
        str = _.trimEnd(str, " > "); // 去除最后多余的" > "
      }
      return str;
    },
    async handlerDetail() {
      const res = await window
        .Axios({
          method: "get",
          url: `/api/globalapproval/read/activeingredient/${this.activeingredient}`,
          params: {
            accesstoken: GETCOOKIEFUN("accesstoken")
          }
        })
        .catch(err => {
          console.log(err);
          this.isLoading = false;
        });

      if (res.data.code === 200 && res.data.data) {
        let data = res.data.data;
        this.data = data;
        this.report_info = data.report_info;
        this.handlerPZLC();
        this.handlerSSGJ();
        this.handlerJXFB();
        this.handlerQQXS();
      } else {
        this.isLoading = false;
      }
    },
    // 批准历程
    async handlerPZLC() {
      const _this = this;
      const res = await window
        .Axios({
          method: "get",
          url: `/api/globalapproval/infoAggs/activeingredient/${this.activeingredient}`,
          params: {
            accesstoken: GETCOOKIEFUN("accesstoken"),
            action: "pizhun"
          }
        })
        .catch(err => {
          console.log(err);
          _this.isLoading = false;
          _this.pzlcData = [];
        });

      let data = res.data.data;
      if (res.data.code === 200 && res.data.data) {
        _this.pzlcData = data;
        _this.isLoading = false;
        _this.$nextTick(() => {
          let headerHeight = $(".basic-info").height() + 128;
          $(".right-list").css(
            "height",
            "calc(100vh - " + headerHeight + "px)"
          );
        });
      } else {
        _this.pzlcData = data;
        _this.isLoading = false;
        _this.$nextTick(() => {
          let headerHeight = $(".basic-info").height() + 128;
          $(".right-list").css(
            "height",
            "calc(100vh - " + headerHeight + "px)"
          );
        });
      }
    },
    // 上市国家
    async handlerSSGJ() {
      const _this = this;
      const res = await window
        .Axios({
          method: "get",
          url: `/api/globalapproval/infoAggs/activeingredient/${this.activeingredient}`,
          params: {
            accesstoken: GETCOOKIEFUN("accesstoken"),
            action: "guojia"
          }
        })
        .catch(err => {
          console.log(err);
          _this.ssgjData = [];
        });

      let data = res.data.data;
      if (res.data.code === 200 && res.data.data) {
        let formatData = data => {
          data.length > 0 &&
            data.map(item => {
              item.name = _.cloneDeep(item.label);
              item.children = _.cloneDeep(item.child);
              delete item.label;
              delete item.child;
              if (item.children && item.children.length > 0) {
                if (item.children.length > 10) {
                  item.children = item.children.slice(0, 10);
                  item.children.push({
                    children: [],
                    doc_count: "0",
                    key: "name",
                    name: "查看更多"
                  });
                }
                formatData(item.children);
              }
            });
        };
        formatData(data);

        // 如果超过两层级就自动收起
        // echarts.util.each(data, function(datum, index) {
        //   index % 2 === 0 && (datum.collapsed = true);
        // });
        data = { name: _this.data.cname, children: data };
        data.children.forEach(item => {
          if (item.children && item.children.length > 10) {
            item.children[item.children.length - 1].name = "查看更多";
          }
          item.children.forEach(subItem => {
            subItem.parent = item.name;
          });
        });
        _this.ssgjData = [data];
        console.log(_this.ssgjData)
      } else {
        _this.ssgjData = data;
      }
    },
    // 剂型分布
    async handlerJXFB() {
      const _this = this;
      const res = await window
        .Axios({
          method: "get",
          url: `/api/globalapproval/infoAggs/activeingredient/${this.activeingredient}`,
          params: {
            accesstoken: GETCOOKIEFUN("accesstoken"),
            action: "zwform"
          }
        })
        .catch(err => {
          console.log(err);
          _this.jxfbData = [];
        });

      let data = res.data.data;
      if (res.data.code === 200 && res.data.data) {
        let formatData = data => {
          data.length > 0 &&
            data.map(item => {
              item.name = _.cloneDeep(item.label);
              item.children = _.cloneDeep(item.child);
              delete item.label;
              delete item.child;
              if (item.children && item.children.length > 0) {
                if (item.children.length > 10) {
                  item.children = item.children.slice(0, 10);
                  item.children.push({
                    children: [],
                    doc_count: "0",
                    key: "name",
                    name: "查看更多"
                  });
                }
                formatData(item.children);
              }
            });
        };
        formatData(data);

        // 如果超过两层级就自动收起
        // echarts.util.each(data, function(datum, index) {
        //   index % 2 === 0 && (datum.collapsed = true);
        // });
        data = { name: _this.data.cname, children: data };
        data.children.forEach(item => {
          if (item.children && item.children.length > 10) {
            item.children[item.children.length - 1].name = "查看更多";
          }
          item.children.forEach(subItem => {
            subItem.parent = item.name;
          });
        });
        _this.jxfbData = [data];
        _this.$nextTick(() => {
          let headerHeight = $(".basic-info").height() + 128;
          $(".right-list").css(
            "height",
            "calc(100vh - " + headerHeight + "px)"
          );
        });
      } else {
        _this.jxfbData = data;
        _this.$nextTick(() => {
          let headerHeight = $(".basic-info").height() + 128;
          $(".right-list").css(
            "height",
            "calc(100vh - " + headerHeight + "px)"
          );
        });
      }
    },
    // 全球销售
    async handlerQQXS() {
      const _this = this;
      const res = await window
        .Axios({
          method: "get",
          url: `/api/globalapproval/infoAggs/activeingredient/${this.activeingredient}`,
          params: {
            accesstoken: GETCOOKIEFUN("accesstoken"),
            action: "ypxs"
          }
        })
        .catch(err => {
          console.log(err);
          _this.qqxsData = [];
        });

      let data = res.data.data;
      if (res.data.code === 200 && res.data.data) {
        _this.qqxsData = data;
      } else {
        _this.qqxsData = data;
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import "~@/assets/less/var.less";
@import "~@/assets/less/detailCom.less";

.globalapproval-detail {
  height: 100%;

  .detail-header {
    height: 40px;
    display: flex;
    align-items: center;

    .top-id {
      height: 18px;
      font-size: 18px;
      font-weight: 600;
      color: #545b6d;
      line-height: 18px;

      &:not(:last-child) {
        margin-left: 15px;
      }
    }
  }

  .basic-info {
    padding: 10px 10px 10px 30px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    flex-direction: column;
    height: fit-content;
    background: #ffffff;
    box-shadow: 0px 1px 8px 0px #d8e2fa;
    border-radius: 4px;

    .ssgj-words {
      display: flex;
      flex-wrap: wrap;

      .ssgj-word {
        display: flex;
        flex-wrap: wrap;

        &:not(:first-child) {
          margin-left: 10px;
        }
      }
    }

    li {
      display: flex;
      line-height: 30px;
      color: #545b6d;
      font-size: 16px;
      width: 100%;
      position: relative;

      /deep/.highlight {
        font-weight: 600;
      }

      &:before {
        content: " ";
        position: absolute;
        left: -12px;
        top: 12px;
        width: 4px;
        height: 4px;
        background-color: #545b6d;
        border-radius: 50%;
      }

      >label {
        display: flex;
        width: 60px;
        font-size: 14px;
        height: inherit;
        white-space: nowrap;
        margin-right: 50px;
      }

      .atc-fl {
        float: left;
        height: auto;
      }

      span {
        display: inline-flex;
        color: @FontColor;
        height: inherit;
        font-size: 13px;
      }

      a {
        color: @PrimaryColor;
        padding-right: 5px;
        font-size: 14px;
      }

      .icon-dui {
        color: @Green;
        padding-left: 5px;
      }
    }
  }

  // 主要信息部分
  .main {
    margin-top: 10px;
    display: flex;

    .left-nav {
      position: unset !important;
    }

    // 右边 - 详细列表
    .right-list {
      width: calc(100vw - 210px);
      min-width: 1200px;
      margin-left: 10px;
      padding-top: 0 !important;
      padding-left: unset !important;

      .border-box {
        width: calc(100% - 20px);
        height: calc(100% - 20px);
        border: 1px solid #dfe5f1;

        .chart {
          width: 100%;
          height: 100%;
        }
      }
    }
  }

  .t-line5 {
    display: block;
    max-height: 130px;
    overflow-y: auto;
  }

  .slide-section .the-part /deep/.part-two {
    position: relative;
  }

  .go-btn {
    display: flex;
    align-items: center;
    padding: 2px 10px;
    line-height: 24px;
    background: #4877E8;
    border-radius: 4px;
    font-size: 14px;
    color: #fff;
    text-align: center;
    margin-bottom: 5px;
    margin-right: 10px;
    cursor: pointer;
    position: absolute;
    right: 0;
    top: 6px;

    img {
      margin-right: 4px;
    }
  }
}

/deep/.slide-section .content {
  padding: 0 !important;
  height: calc(100% - 40px);
}

/deep/.slide-section.part-two,
/deep/.slide-section.part-three {
  height: calc(100% - 10px);
}
</style>
