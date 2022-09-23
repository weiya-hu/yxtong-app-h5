<template>
  <div class="rongzi-detail">
    <custom-header></custom-header>
    <LoadingGif :className="'fullscreen-loading'" :loadFlag="loading"></LoadingGif>
    <div class="detail-container">
      <div class="container-top">
        <div>
          <div class="title" v-if="infoObj.time || infoObj.acquirer || infoObj.shortname">
            {{ formatterTitle() }}
            <!-- <span
            class="tag"
            v-if="
              infoObj.applicationscenarios &&
                infoObj.applicationscenarios.length > 0
            "
            v-for="(txt, i) in infoObj.applicationscenarios"
            :key="txt"
            @click="searchKeywords(txt)"
            >{{ txt }}</span
          > -->
            <span class="tag1 tag-provice" v-if="infoObj.province">{{
                infoObj.province
            }}</span>
            <span v-if="infoObj.concept && infoObj.concept.length > 0" class="tag"
              v-for="(item, index) in infoObj.concept" :key="item" @click="searchKeywords(item)">
              {{ item }}
            </span>
          </div>
          <div class="touzifang" v-if="infoObj.purposeofm_a">
            <span>并购目的：</span>
            <div style="
                color: #333;
                max-height: 40px;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
                overflow: hidden;
                flex: 1;
              " :title="infoObj.purposeofm_a">
              {{ infoObj.purposeofm_a }}
            </div>
          </div>

          <div class="rongzi-target" v-if="infoObj.guifan_amount_format">
            交易金额：
            <span style="color: #333">{{ infoObj.guifan_amount_format }}</span>
          </div>
        </div>

        <div class="subscribe" :class="{ subscribed: infoObj.is_rss === 1 }" @click="subscribe(infoObj.is_rss)">
          {{ infoObj.is_rss === 1 ? "已订阅" : "订阅" }}

          <!-- 订阅建议引导功能 -->
          <transition name="fade">
            <div class="tips-guide" v-if="showTrzTips">
              <p>
                点击“<span>订阅</span>”，扫码关注“药智数据服务”微信公众号，绑定账号即可随时掌握最新动态~
              </p>
              <div @click.stop="handleTipsKnow">我已知晓</div>
            </div>
          </transition>
        </div>
      </div>
      <div class="cards">
        <div class="left-content">
          <div class="card">
            <div class="summary-list">
              <div v-for="(item, index) in navs" :key="index" :class="['summary-item', activeNav == index && 'active']"
                @click="positionPanel(index)">
                {{ item }}
              </div>
            </div>
          </div>
        </div>
        <div class="middle-content" v-if="showSJGY === true || showGSXX === true">
          <div class="card" v-if="showSJGY === true">
            <div class="card-title">
              <div>
                <img src="~@/assets/imgs/trz/summary.png" class="speacker" width="16" height="13" />
                事件概要
              </div>
            </div>
            <div class="content">
              <div class="left-info">
                <div class="summary-item" v-if="infoObj.time">
                  <div><span>时</span><span>间：</span></div>
                  {{ infoObj.time }}
                </div>
                <div class="summary-item" v-if="infoObj.acquirerArr && infoObj.acquirerArr.length > 0">
                  <div><span>买</span><span>方：</span></div>
                  <a class="touzifang-item" v-for="(item, index) in infoObj.acquirerArr" style="color: #09144f"
                    :key="index" :class="{ 'no-click': !item.jgWyuid && !item.gsWyuid }" @click="toDetail(item)">{{
                        item.name
                    }}</a>
                </div>
                <div class="summary-item" v-if="infoObj.shortnameArr && infoObj.shortnameArr.length > 0">
                  <div><span>卖</span><span>方：</span></div>
                  <a class="touzifang-item" v-for="(item, index) in infoObj.shortnameArr" style="color: #09144f"
                    :key="index" :class="{ 'no-click': !item.jgWyuid && !item.gsWyuid }" @click="toDetail(item)">{{
                        item.name
                    }}</a>
                </div>
                <div class="summary-item" v-if="infoObj.amount">
                  <div>
                    <span>交</span><span>易</span><span>金</span><span>额：</span>
                  </div>
                  <span style="color: #333">{{
                      infoObj.real_amount
                  }}</span>
                </div>
                <div class="summary-item" v-if="infoObj.country || infoObj.province || infoObj.city">
                  <div>
                    <span>交</span><span>易</span><span>地</span><span>区：</span>
                  </div>
                  <div class="area">
                    <div v-if="infoObj.country">{{ infoObj.country }}</div>
                    <div v-if="infoObj.province">-{{ infoObj.province }}</div>
                    <div v-if="infoObj.city">-{{ infoObj.city }}</div>
                  </div>
                </div>
              </div>
              <!-- <div class="right-rongzi">
                B+轮成功融资
                <div class="rongzi-money">{{ infoObj.rongziMoney }}万元</div>
              </div> -->
            </div>
            <div class="content2">
              <div class="info-item" v-if="infoObj.title">
                <div class="info-label">事件描述</div>
                <div class="info-desc">
                  {{ infoObj.title }}
                </div>
              </div>
              <div class="info-item" v-if="infoObj.purposeofm_a">
                <div class="info-label">并购目的</div>
                <div class="info-desc">
                  {{ infoObj.purposeofm_a }}
                </div>
              </div>

              <div class="info-item" v-if="infoObj.technology">
                <div class="info-label">行业</div>
                <div class="info-desc">
                  {{ infoObj.technology }}
                </div>
              </div>

              <div class="info-item" v-if="
                infoObj.applicationscenarios &&
                infoObj.applicationscenarios.length > 0
              ">
                <div class="info-label">关键词</div>
                <div class="info-desc">
                  {{ infoObj.applicationscenarios.join(" ") }}
                </div>
              </div>
            </div>
          </div>
          <div class="card" v-if="
            (gsxx.binggou && gsxx.binggou.length > 0) ||
            (gsxx.company && gsxx.company.length > 0)
          ">
            <div class="card-title">
              <div>
                <img src="~@/assets/imgs/cpy.png" class="speacker" width="14" height="16" />公司信息
              </div>
            </div>
            <div class="company">
              <h4 class="company-title" v-if="gsxx.binggou.length > 0">
                买方公司
              </h4>
              <div class="company-info" v-for="(item, index) in gsxx.binggou" :key="'buy' + index">
                <label v-if="item.companyname" class="key">名称：</label>
                <span v-if="item.companyname" class="value">{{
                    item.companyname
                }}</span>
                <label class="key" v-if="item.country || item.province || item.city">地区：</label>
                <span class="value" v-if="item.country || item.province || item.city">
                  <span v-if="item.country">{{ item.country }}</span>
                  <span v-if="item.province">-{{ item.province }}</span>
                  <span v-if="item.city">-{{ item.city }}</span>
                </span>
                <label v-if="item.description" class="key">公司简介：</label>
                <span class="value" v-if="item.description">{{
                    item.description
                }}</span>
                <router-link :to="{ path: '/trz/qiye/' + item.wyuid }" target="_blank">查看该公司详细信息</router-link>
              </div>
              <h4 class="company-title" v-if="gsxx.company.length > 0">
                卖方公司
              </h4>
              <div class="company-info" v-for="(item, index) in gsxx.company" :key="'saler' + index">
                <label v-if="item.companyname" class="key">名称：</label>
                <span v-if="item.companyname" class="value">{{
                    item.companyname
                }}</span>
                <label class="key" v-if="item.country || item.province || item.city">地区：</label>
                <span class="value" v-if="item.country || item.province || item.city">
                  <span v-if="item.country">{{ item.country }}</span>
                  <span v-if="item.province">-{{ item.province }}</span>
                  <span v-if="item.city">-{{ item.city }}</span>
                </span>
                <label v-if="item.description" class="key">公司简介：</label>
                <span class="value" v-if="item.description">{{
                    item.description
                }}</span>
                <router-link :to="{ path: '/trz/qiye/' + item.wyuid }" target="_blank">查看该公司详细信息</router-link>
              </div>
            </div>
          </div>
        </div>
        <div class="right-content">
          <div class="card">
            <div class="card-title">
              <div>
                <img src="~@/assets/imgs/trz/speaker.png" class="speacker" width="16" height="13" />
                相关报道
              </div>
              <div class="refresh-btn" @click="goToNewsList" v-if="newsCount > 6">
                查看更多
              </div>
            </div>
            <div class="content">
              <div class="news-list">
                <div class="news-item" v-for="(item, index) in newsList" :key="index">
                  <div style="
                      overflow: hidden;
                      text-overflow: ellipsis;
                      white-space: nowrap;
                      margin-bottom: 10px;
                    ">
                    <router-link :to="{ path: '/trz/news/' + item.data_id }" class="news-text" target="_blank"
                      :title="item.title">{{ item.title }}</router-link>
                  </div>
                  <div class="news-info">
                    <div class="news-date">
                      <img src="~@/assets/imgs/trz/clock.png" class="clock" width="14" height="14"
                        v-if="item.regtime" />{{ item.regtime }}
                    </div>
                    <div class="news-source">
                      <img src="~@/assets/imgs/trz/pin.png" class="pin" width="13" height="14" v-if="item.source" />{{
                          item.source
                      }}
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
import LoadingGif from "@/components/common/globalCom/loading-gif";
import MiddleScroll from "@/components/common/trz/middle.scroll.js";

export default {
  mixins: [MiddleScroll],
  components: { CustomHeader, LoadingGif },
  data() {
    return {
      navs: ["事件概要", "公司信息"],
      showSJGY: true, // 显示事件概要模块
      showGSXX: true, // 显示投资关系模块
      infoObj: {},
      gsxx: {},
      newsList: [],
      activeNav: 0,
      loading: false,
      newsCount: 0,
      showTrzTips: false, // 控制订阅引导显示隐藏
      tipsTimer: null // 订阅引导弹窗的定时器对象
    };
  },
  mounted() {
    this.handlerDetail();
  },
  methods: {
    searchKeywords(keywords) {
      let routeData = this.$router.resolve({
        path: "/trz/binggou",
        query: {
          keywords: keywords
        }
      });
      window.open(routeData.href, "_blank");
    },
    // 左侧按钮定位事件
    positionPanel(index) {
      // document.getElementById("panel-" + id).scrollIntoView();
      this.goTop(index);
    },
    // 公司信息
    async handlerGSXX() {
      await window
        .Axios({
          method: "get",
          url: "/api/binggou/gsxx",
          params: {
            acquireruid: this.infoObj.acquireruid,
            // acquireruid: "d61909406f7211e8af536546bca6a47d",
            companyuid: this.infoObj.companyuid,
            accesstoken: GETCOOKIEFUN("accesstoken")
          }
        })
        .then(res => {
          if (res.data.code === 200 && res.data.data) {
            let data = res.data.data;
            this.gsxx = data;
            if (
              this.gsxx.binggou &&
              this.gsxx.binggou.length == 0 &&
              this.gsxx.company &&
              this.gsxx.company.length == 0
            ) {
              this.showGSXX = false;
              this.navs.splice(this.navs.indexOf("公司信息"), 1);
            }
          } else {
            this.showGSXX = false;
            this.navs.splice(this.navs.indexOf("公司信息"), 1);
          }
        })
        .catch(err => {
          console.log(err);
          this.showGSXX = false;
          this.navs.splice(this.navs.indexOf("公司信息"), 1);
        });
    },
    formatterTitle() {
      let text = "";
      if (this.infoObj.time) {
        this.infoObj.time.split("-").forEach((item, index) => {
          let arr = ["年", "月", "日"];
          text += item + arr[index];
        });
      }
      if (this.infoObj.acquirer) text += "," + this.infoObj.acquirer + "并购";
      if (this.infoObj.shortname) text += this.infoObj.shortname;
      return text;
    },
    // 获取详情
    async handlerDetail() {
      this.loading = true;
      await window
        .Axios({
          method: "get",
          url: "/api/binggou/read",
          params: {
            id: this.$route.params.id,
            accesstoken: GETCOOKIEFUN("accesstoken")
          }
        })
        .then(res => {
          this.loading = false;
          if (res.data.code === 200 && res.data.data) {
            let data = res.data.data;
            this.infoObj = data;
            // this.infoObj.concept = [
            //   "肿瘤",
            //   "心血管疾病",
            //   "神经系统疾病",
            //   "口腔科",
            //   "皮肤科",
            //   "传染科",
            //   "药物概念"
            // ];
            this.handlerGSXX();
            this.handlerNews();
            this.$nextTick(() => {
              // // 如果未订阅的话 要先移出内存
              // if(this.infoObj.is_rss === 0) {
              //   localStorage.removeItem("showBinggouDetailTips")
              // }
              $(".left-content .card").css(
                "height",
                `calc(100vh - ${$(".container-top").height() +
                20 +
                5 +
                72 +
                10}px)`
              );
              this.tipsTime();
            });
          } else {
            this.showSJGY = false;
            this.navs.splice(this.navs.indexOf("事件概要"), 1);
          }
        })
        .catch(err => {
          console.log(err);
          this.showSJGY = false;
          this.navs.splice(this.navs.indexOf("事件概要"), 1);
        });
    },
    // 最新动态
    async handlerNews() {
      await window
        .Axios({
          method: "get",
          url: "/api/binggou/news",
          params: {
            companyuid: this.infoObj.companyuid,
            acquireruid: this.infoObj.acquireruid,
            dataId: this.infoObj.data_id,
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
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 跳转到新闻列表页
    goToNewsList() {
      let routeData = this.$router.resolve({
        path: "/trz/news",
        query: {
          fourth_condition: `surl=${this.infoObj.newssources}`
        }
      });
      window.open(routeData.href, "_blank");
    },

    toDetail(val) {
      let path = "";
      console.log(val);
      if (!val.gsWyuid && !val.jgWyuid) return false;
      // 如果gsWyuid存在跳转到企业详情
      if (val.gsWyuid) path = `/trz/qiye/${val.gsWyuid}`;

      // 如果jgWyuid存在跳转到企业详情
      if (val.jgWyuid) path = `/trz/jigou/${val.jgWyuid}`;
      const { href } = this.$router.resolve({
        path: path
      });
      window.open(href, "_blank");
    },

    // 跳转到订阅功能
    subscribe(val) {
      let routeData;
      //  1已订阅，0未订阅
      if (val === 1) {
        routeData = this.$router.resolve({
          path: `/usercenter/take/condition`
        });
      } else {
        routeData = this.$router.resolve({
          path: `/usercenter/take/new`,
          query: {
            source: "binggou"
          }
        });
      }
      window.open(routeData.href, "_blank");
    },

    // 订阅反馈引导 点击我已知晓方法
    handleTipsKnow() {
      localStorage.setItem("showBinggouDetailTips", "showBinggouDetailTips");
      this.showTrzTips = false;
      clearInterval(this.tipsTimer);
    },

    // 订阅 显示定时器方法
    tipsTime() {
      // 当未订阅 且 订阅的弹窗不在内存里面
      if (
        this.infoObj.is_rss === 0 &&
        !localStorage.getItem("showBinggouDetailTips")
      ) {
        // 引导弹窗每隔30秒显示,每次显示30秒
        this.showFun();
        this.tipsTimer = setInterval(() => {
          this.showTrzTips = false;
          this.showFun();
        }, 60000);
      }
    },

    showFun() {
      setTimeout(() => {
        this.showTrzTips = true;
      }, 30000);
    }
  }
};
</script>

<style lang="less" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to

/* .fade-leave-active below version 2.1.8 */
  {
  opacity: 0;
}

.rongzi-detail {
  min-width: 1280px;

  .detail-container {
    width: calc(100vw - 10px);
    min-height: calc(100vh - 72px);
    margin: 68px 10px 0 0;
    min-width: 1280px;

    .container-top {
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .subscribe {
        margin-right: 20px;
        width: 120px;
        height: 36px;
        line-height: 36px;
        text-align: center;
        background: #e7af2f;
        border-radius: 4px;
        font-size: 16px;
        font-weight: 600;
        color: #ffffff;
        cursor: pointer;
        position: relative;

        .tips-guide {
          width: 244px;
          padding: 10px;
          box-sizing: border-box;
          position: absolute;
          bottom: -130px;
          right: 0;
          background: #fff;
          box-shadow: 0px 1px 10px 0px rgba(9, 20, 79, 0.19);
          border: 1px solid #e7af2f;
          border-radius: 4px;
          z-index: 999;

          p {
            color: #666666;
            font-size: 13px;
            line-height: 20px;
            margin-bottom: 10px;
            text-align: left;

            span {
              color: #3556b9;
            }
          }

          div {
            width: 72px;
            height: 26px;
            line-height: 26px;
            text-align: center;
            border-radius: 4px;
            border: 1px solid #dfe5f1;
            font-size: 13px;
            color: #666666;
            cursor: pointer;
          }
        }

        .tips-guide::after {
          content: " ";
          width: 10px;
          height: 10px;
          position: absolute;
          top: -6px;
          right: 27px;
          transform: translate(-50%) rotate(-45deg);
          background: #fff;
          border-top: 1px solid #e7af2f;
          border-right: 1px solid #e7af2f;
        }
      }

      .subscribed {
        background: #3556b9;
      }
    }

    .touzifang-item {
      display: flex;
      line-height: 20px;
      font-size: 13px;
      font-weight: 400;
      color: #09144f;
      margin-right: 10px;
    }

    .no-click {
      text-decoration: none;
    }

    .touzifang {
      line-height: 20px;
      font-size: 13px;
      font-weight: 400;
      color: #666666;
      width: calc(100vw - 360px);
      min-width: 1000px;
      display: flex;

      span {
        width: 65px;
      }
    }

    .rongzi-target {
      height: 13px;
      line-height: 20px;
      font-size: 13px;
      font-weight: 400;
      color: #666666;
      margin-top: 6px;
      width: calc(100vw - 360px);
      min-width: 1000px;
    }

    .title,
    .touzifang,
    .rongzi-target {
      padding-left: 20px;
    }

    .title {
      line-height: 30px;
      font-size: 18px;
      font-weight: 600;
      color: #333333;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      width: calc(100vw - 360px);
      min-width: 1000px;
    }

    // .tag {
    //   padding: 0 10px;
    //   height: 20px;
    //   border-radius: 4px;
    //   border: 1px solid #3556b9;
    //   display: flex;
    //   justify-content: center;
    //   align-items: center;
    //   font-size: 12px;
    //   line-height: 12px;
    //   font-weight: 400;
    //   color: #3556b9;
    //   margin-left: 10px;
    //   &:hover {
    //     color: #fff;
    //     background-color: #3556b9;
    //   }
    // }

    .tag {
      font-size: 12px;
      font-weight: normal;
      line-height: 1;
      padding: 4px 7px;
      margin-left: 10px;
      border-radius: 4px;
      color: #9ca8b9;
      border: 1px solid #e4eaf3;
      cursor: pointer;
      box-sizing: border-box;

      &:hover {
        color: #fff;
        background-color: #3556b9;
      }
    }

    .tag1 {
      font-size: 12px;
      font-weight: normal;
      line-height: 1;
      padding: 4px 7px;
      margin-left: 10px;
      border-radius: 4px;
      color: #3556b9;
      border: 1px solid #3556b9;
      cursor: pointer;
      box-sizing: border-box;

      &:hover {
        color: #fff;
        background-color: #3556b9;
      }
    }

    .tag-provice {
      cursor: unset;

      &:hover {
        color: #3556b9;
        border: 1px solid #3556b9;
        background-color: #fff;
      }
    }

    .concepts {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      line-height: 20px;

      .concept {
        margin-left: 10px;
        height: 18px;
        padding: 0 5px;
        border-radius: 4px;
        border: 1px solid #e4eaf3;
        font-size: 12px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: 400;
        color: #9ca8b9;
        cursor: pointer;

        &:hover {
          background: #3556b9;
          color: #ffffff;
        }
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
          height: calc(100vh - 155px);
          padding-bottom: 0;
        }
      }

      .middle-content {
        width: calc(100vw - 560px);
        min-width: 1100px;
        height: calc(100vh - 205px);
        padding: 5px;

        .card {
          padding-bottom: 20px;
          min-width: 1100px;
        }

        .content {
          display: flex;
          justify-content: space-between;
          align-items: center;

          .left-info {
            .summary-item {
              display: flex;
              align-items: center;
              margin-bottom: 10px;

              >div:first-child {
                width: 70px;
                height: 14px;
                line-height: 14px;
                font-size: 14px;
                font-weight: 400;
                color: #666666;
                display: flex;
                justify-content: space-between;
              }

              .area {
                height: 14px;
                line-height: 14px;
                font-size: 14px;
                font-weight: 400;
                color: #333333;
                display: flex;
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
              padding: 6px 0;
              box-sizing: border-box;
              font-size: 14px;
              color: #333333;
            }
          }
        }
      }

      .card {
        width: 100%;
        background: #ffffff;
        box-shadow: 0 1px 10px 0px rgba(9, 20, 79, 0.19);
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
          justify-content: space-between;
          align-items: center;
          cursor: pointer;

          .refresh-btn {
            height: 14px;
            line-height: 14px;
            font-size: 14px;
            font-weight: 400;
            color: #3556b9;
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
  padding: 20px;
  padding-bottom: 0;
  min-width: 1070px;

  .company-title {
    font-size: 16px;
    color: #333;
    font-weight: 600;
    margin-bottom: 10px;
  }

  .company-info {
    min-height: 36px;
    border: 1px solid #dae0e9;
    padding: 0 20px;
    border-radius: 4px;
    margin-bottom: 20px;
    line-height: 34px;
    font-size: 14px;

    &:last-child {
      justify-content: flex-end;
    }

    .key {
      color: #666;
      white-space: nowrap;

      &:not(:first-child) {
        margin-left: 20px;
      }
    }

    .value {
      color: #333;
    }

    a {
      white-space: nowrap;
      text-decoration: none;
      margin-left: 20px;
      color: #3e5dbc;
    }
  }
}
</style>
