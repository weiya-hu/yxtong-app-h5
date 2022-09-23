<template>
  <div class="wrapper">
    <!-- 自定义加载界面 -->
    <LoadingGif :loadFlag="isLoading" v-if="isLoading"></LoadingGif>
    <!-- 加载完成显示部分 -->
    <div class="detail-list" v-else>
      <div class="detail-header">
        <div class="header-left">
          <div class="left-top">
            <span class="top-id" :title="baseInfos.title">{{
              baseInfos.title
            }}</span>
            <span class="id-green">{{ baseInfos.type }}</span>
          </div>
        </div>
      </div>
      <div class="main">
        <div class="sections">
          <div class="header">
            <span>事件概要</span>
          </div>
          <div class="con">
            <div class="detail">
              <span class="smail-title">事件时间：</span>
              <span class="smail-con">{{ baseInfos.date }}</span>
            </div>
            <div class="detail">
              <span class="smail-title">事件描述：</span>
              <span class="smail-con">{{ baseInfos.description }}</span>
            </div>
            <div class="detail" v-if="baseInfos.money">
              <span class="smail-title">交易金额：</span>
              <span class="smail-con" v-if="!isNaN(baseInfos.money)"
                >{{ baseInfos.money }}万元</span
              >
              <span class="smail-con" v-else>{{ baseInfos.money }}</span>
            </div>
            <div class="detail" v-if="baseInfos.proportion">
              <span class="smail-title">股权比例：</span>
              <span class="smail-con">{{ baseInfos.proportion }}</span>
            </div>
          </div>
        </div>
        <div class="sections" v-if="qiyeInfos">
          <div class="header">
            <span>企业信息</span>
          </div>
          <div class="con">
            <div class="detail detailone">
              <div class="logo">
                <img v-if="qiyeInfos.logo" :src="qiyeInfos.logo" />
                <img v-else src="/static/imgs/companyreport/icon_nothing.jpg" />
              </div>
              <div class="company">
                <div class="company-title">{{ qiyeInfos.qymc }}</div>
                <div v-if="qiyeInfos.qybq" class="qybq">
                  <span v-for="(item, index) in qybqArr" :key="index">{{
                    item
                  }}</span>
                </div>
              </div>
            </div>
            <div class="detail detailtwo">
              <span class="smail-title lt1">企业简介：</span>
              <span class="smail-con lt2" v-if="qiyeInfos.qyjj">{{
                qiyeInfos.qyjj
              }}</span>
              <span class="smail-con lt2" v-else>暂未公布</span>
            </div>
            <div class="detail">
              <span class="smail-title">企业类型：</span>
              <span class="smail-con" v-if="qiyeInfos.qylx">{{
                qiyeInfos.qylx
              }}</span>
              <span class="smail-con" v-else>暂未公布</span>
            </div>
            <div class="detail">
              <span class="smail-title">成立时间：</span>
              <span class="smail-con" v-if="qiyeInfos.clrq">{{
                qiyeInfos.clrq
              }}</span>
              <span class="smail-con" v-else>暂未公布</span>
            </div>
            <div class="detailthree">
              <a :href="'/company/' + qiyeInfos.id" class="more" target="_blank"
                >更多企业信息</a
              >
            </div>
          </div>
        </div>
        <div class="sections" v-if="timelineInfos.length">
          <div class="header">
            <span>投融资时光轴</span>
          </div>
          <div class="timeline-con">
            <div class="time-line">
              <div
                class="time-con"
                v-for="(list, idx) in timelineInfos"
                :key="idx"
              >
                <div class="node-left">
                  <span class="node-time">{{ list.date }}</span>
                  <span class="node-type">{{ list.type }}</span>
                </div>
                <div class="node"></div>
                <div class="node-right">
                  <el-tooltip
                    class="help-tip"
                    effect="useInfoDark"
                    :content="list.funders"
                    placement="bottom"
                  >
                    <span class="node-czf">出资方：{{ list.funders }}</span>
                  </el-tooltip>

                  <span class="node-money" v-if="!isNaN(list.money)"
                    >金额（RMB）：{{ list.money }}万元</span
                  >
                  <span class="node-money" v-else
                    >金额（RMB）：{{ list.money }}</span
                  >
                  <span class="node-lc">轮次：{{ list.round }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <la-footer></la-footer>
    </div>
  </div>
</template>

<script>
import LoadingGif from "@/components/common/globalCom/loading-gif";
import SlideSection from "@/components/common/slide-section";
import LaFooter from "@/components/layouts/footer";
import ExtendButton from "@/components/common/extend-button";
import detailScrollMixins from "@/mixins/detailScroll.js";

import { mapState } from "vuex";

export default {
  components: {
    LoadingGif,
    SlideSection,
    LaFooter,
    ExtendButton
  },
  mixins: [detailScrollMixins],
  data() {
    return {
      isLoading: true,
      title: {},
      id: "",
      baseInfos: {}, //存放基本信息
      qiyeInfos: [], //存放企业信息
      timelineInfos: [], //存放时光轴信息
      qybqArr: [] //企业标签
    };
  },
  computed: {
    ...mapState({
      allBase: state => state.Trz.allBase,
      helpInfo: state => state.Trz.helpInfo,
      nopms: state => state.Trz.nopms
    })
  },
  methods: {
    handleAxios() {
      window
        .Axios({
          method: "get",
          url: "/api/Trz/" + this.$route.params.id,
          params: {
            accesstoken: GETCOOKIEFUN("accesstoken")
          }
        })
        .then(res => {
          if (res.data.code === 200 && res.data.data) {
            let data = res.data.data;
            this.baseInfos = data;
            this.qiyeInfos = data.qiye[0];
            this.timelineInfos = data.trz;

            let qybq = data.qiye[0].qybq;
            this.qybqArr = qybq.split(";");
          }
        })
        .catch(err => {
          console.log(err);
        })
        .then(this.removeLoading);
    },
    // 加载完后移除加载界面
    removeLoading() {
      this.isLoading = false;
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
    Store.dispatch("Trz/getBaseInfo");
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
.wrapper {
  .detail-list {
    .main {
      margin-bottom: 20px;
      box-shadow: 0px 0px 5px #c4d3f8;

      .sections {
        width: 100%;
        background: #fff;

        .header {
          border-bottom: 1px solid @BorderColor;
          span {
            display: inline-block;
            margin-top: 12px;
            padding: 0 8px;
            margin-left: 20px;
            font-size: 16px;
            color: @PrimaryColor;
            border-bottom: 2px solid @PrimaryColor;
          }
        }
        .con {
          padding: 20px 0;
          .detail {
            margin-left: 60px;
            margin-bottom: 10px;
            width: 90%;
            .smail-title {
              color: @PrimaryColor;
              font-size: 14px;
            }
            .smail-con {
              color: @FontColor;
              font-size: 13px;
            }
          }
          .detailone {
            overflow: hidden;
            // height:60px;
            .logo {
              float: left;
              padding: 5px;
              border: 1px solid #eff2fa;
              img {
                width: 60px;
                height: 60px;
                vertical-align: top;
              }
            }
            .company {
              float: left;
              margin-left: 10px;
              .company-title {
                font-size: 20px;
                color: @PrimaryColor;
              }
              .qybq {
                font-size: 12px;
                color: @PrimaryColor;
                margin-top: 8px;
                span {
                  display: inline-block;
                  height: 20px;
                  line-height: 20px;
                  padding: 0 8px;
                  border: 1px solid @PrimaryColor;
                  border-radius: 10px;
                  margin-right: 4px;
                }
              }
            }
          }
          .detailtwo {
            overflow: hidden;
            margin-top: 20px;
            .lt1 {
              float: left;
              width: 74px;
            }
            .lt2 {
              float: left;
              width: 93%;
              text-align: justify;
            }
          }
          .detailthree {
            margin-left: 100px;
            margin-top: 30px;
            .more {
              // padding-top:20px;
              font-size: 14px;
              cursor: pointer;
              color: @PrimaryColor;
              // text-decoration: underline;
              border-bottom: 1px solid @PrimaryColor;
              text-decoration: none;
            }
          }
        }
        .timeline-con {
          margin-left: 100px;
          .time-line {
            padding: 40px 0 50px 0;
            .time-con {
              .node-left {
                display: inline-block;
                height: 52px;
                line-height: 52px;
                width: 124px;
                .node-time {
                  font-size: 13px;
                  color: @FontColor;
                  margin-right: 4px;
                }
                .node-type {
                  display: inline-block;
                  padding: 0 12px;
                  border-radius: 10px;
                  height: 20px;
                  line-height: 20px;
                  color: @PrimaryColor;
                  border: 1px solid @PrimaryColor;
                }
              }
              .node {
                display: inline-block;
                width: 2px;
                height: 52px;
                line-height: 52px;
                background: @PrimaryColor;
                margin: 0 26px 0 16px;
                &:after {
                  content: "";
                  display: inline-block;
                  width: 10px;
                  height: 10px;
                  border-radius: 50%;
                  background: @PrimaryColor;
                  margin-left: -4px;
                }
              }
              .node-right {
                display: inline-block;
                font-size: 13px;
                color: @FontColor;
                height: 52px;
                line-height: 52px;
                .node-czf {
                  display: inline-block;
                  width: 200px;
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                  line-height: normal;
                  position: relative;
                  top: 4px;
                  cursor: pointer;
                }
                .node-money {
                  display: inline-block;
                  width: 200px;
                  margin: 0 40px 0 40px;
                  line-height: normal;
                }
                .node-lc {
                  display: inline-block;
                  line-height: normal;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
