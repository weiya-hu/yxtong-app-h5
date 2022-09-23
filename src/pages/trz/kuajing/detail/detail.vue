<template>
  <div class="rongzi-detail">
    <custom-header></custom-header>
    <LoadingGif
      :className="'fullscreen-loading'"
      :loadFlag="loading"
    ></LoadingGif>
    <div class="detail-container">
      <div class="container-top">
        <div style="display: flex; align-items: center; margin-bottom: 14px">
          <div class="title">
            项目名称：{{
              infoObj.guifan_item ? infoObj.guifan_item : infoObj.item
            }}
            <span
              v-if="
                infoObj.applicationscenarios &&
                infoObj.applicationscenarios.length > 0
              "
              class="tag1 tag-provice"
              v-for="item in infoObj.applicationscenarios"
              :key="item"
            >
              {{ item }}
            </span>
            <span
              v-if="
                infoObj.therapeuticarea && infoObj.therapeuticarea.length > 0
              "
              class="tag1 tag-provice"
              v-for="item in infoObj.therapeuticarea"
              :key="item"
            >
              {{ item }}
            </span>
            <span
              v-if="infoObj.concept && infoObj.concept.length > 0"
              class="tag"
              v-for="item in infoObj.concept"
              :key="item + 1"
              @click="searchKeywords(item)"
            >
              {{ item }}
            </span>
          </div>
        </div>
        <div class="touzifang" v-if="infoObj.area">
          <span>授权区域/合作企业总部：</span>
          <div style="color: #333">
            {{ infoObj.area }}
          </div>
        </div>
      </div>
      <div class="cards">
        <div class="left-content">
          <div class="card">
            <div class="summary-list">
              <div
                v-for="(item, index) in navs"
                :key="index"
                :class="['summary-item', activeNav == index && 'active']"
                @click="positionPanel(index)"
              >
                {{ item }}
              </div>
            </div>
          </div>
        </div>
        <div
          class="middle-content"
          v-if="showSJGY === true || showGSXX === true"
        >
          <div class="card" v-if="showSJGY === true">
            <div class="card-title">
              <div>
                <img
                  src="~@/assets/imgs/trz/summary.png"
                  class="speacker"
                  width="16"
                  height="13"
                />
                项目概要
              </div>
            </div>
            <div class="content">
              <div class="left-info">
                <div class="summary-item" v-if="infoObj.time">
                  <div><span>时</span><span>间：</span></div>
                  <span style="color: #333">{{ infoObj.time }}</span>
                </div>
                <div
                  class="summary-item"
                  v-if="
                    infoObj.transferorArr && infoObj.transferorArr.length > 0
                  "
                >
                  <div>卖方/合作方：</div>
                  <a
                    class="touzifang-item"
                    v-for="(item, index) in infoObj.transferorArr"
                    style="color: #09144f"
                    :key="index"
                    :class="{ 'no-click': !item.jgWyuid && !item.gsWyuid }"
                    @click="toDetail(item)"
                    >{{ item.name }}</a
                  >
                </div>
                <div
                  class="summary-item"
                  v-if="infoObj.buyerArr && infoObj.buyerArr.length > 0"
                >
                  <div>买方/合作方：</div>
                  <a
                    class="touzifang-item"
                    v-for="(item, index) in infoObj.buyerArr"
                    style="color: #09144f"
                    :key="index"
                    :class="{ 'no-click': !item.jgWyuid && !item.gsWyuid }"
                    @click="toDetail(item)"
                    >{{ item.name }}</a
                  >
                </div>
                <div class="summary-item">
                  <div>
                    <span>交</span><span>易</span><span>金</span
                    ><span>额：</span>
                  </div>
                  <span style="color: #333"
                    >总金额{{ infoObj.guifan_totalamount }}</span
                  >，
                  <span style="color: #333"
                    >首付款{{ infoObj.guifan_downpayment }}</span
                  >
                </div>
                <div class="summary-item" v-if="infoObj.area">
                  <div style="width: 165px">
                    <span>授权区域/合作企业总部：</span>
                  </div>
                  <div class="area">
                    {{ infoObj.area }}
                  </div>
                </div>

                <div
                  class="summary-item"
                  v-if="
                    infoObj.guifanname ||
                    infoObj.brandname ||
                    infoObj.brandname_en
                  "
                >
                  <div><span>药</span><span>物：</span></div>
                  <span
                    class="text"
                    @click="
                      goComprehensiveSearch(
                        infoObj.guifanname || infoObj.brandname || infoObj.brandname_en,
                        'drug'
                      )
                    "
                    >{{
                      infoObj.guifanname ||
                      infoObj.brandname ||
                      infoObj.brandname_en
                    }}</span
                  >
                </div>

                <div
                  class="summary-item"
                  v-if="infoObj.targets_abbr || infoObj.targets"
                >
                  <div><span>靶</span><span>点：</span></div>
                  <span
                    class="text"
                    @click="
                      goComprehensiveSearch(
                        infoObj.targets_abbr || infoObj.targets,
                        'targets'
                      )
                    "
                    >{{ infoObj.targets_abbr || infoObj.targets }}</span
                  >
                </div>
              </div>
            </div>
            <div class="content2">
              <div
                class="info-item"
                v-if="
                  infoObj.applicationscenarios &&
                  infoObj.applicationscenarios.length > 0
                "
              >
                <div class="info-label">关键词</div>
                <div class="info-desc">
                  {{ infoObj.applicationscenarios.join(" ") }}
                </div>
              </div>

              <div
                class="info-item"
                v-if="
                  infoObj.therapeuticarea && infoObj.therapeuticarea.length > 0
                "
              >
                <div class="info-label">疾病领域</div>
                <div class="info-desc">
                  {{ infoObj.therapeuticarea.join(" ") }}
                </div>
              </div>

              <div class="info-item" v-if="infoObj.type_item">
                <div class="info-label">项目类型</div>
                <div class="info-desc">
                  {{ infoObj.type_item }}
                </div>
              </div>

              <div
                class="info-item"
                v-if="infoObj.guifan_cooperationtype || infoObj.cooperationtype"
              >
                <div class="info-label">合作类型</div>
                <div class="info-desc">
                  {{
                    infoObj.guifan_cooperationtype === '授权/许可' && infoObj.cooperationtype ? `${infoObj.guifan_cooperationtype}-${infoObj.cooperationtype}`:infoObj.guifan_cooperationtype
                  }}
                </div>
              </div>

              <div class="info-item" v-if="infoObj.product">
                <div class="info-label">产品</div>
                <div class="info-desc">
                  {{ infoObj.product }}
                </div>
              </div>

              <div
                class="info-item"
                v-if="
                  infoObj.guifan_developmentstatus || infoObj.developmentstatus
                "
              >
                <div class="info-label">产品进度</div>
                <div class="info-desc">
                  {{
                    infoObj.guifan_developmentstatus ||
                    infoObj.developmentstatus
                  }}
                </div>
              </div>
            </div>
          </div>
          <div
            class="card"
            v-if="
              (gsxx.transferor && gsxx.transferor.length > 0) ||
              (gsxx.buyer && gsxx.buyer.length > 0)
            "
          >
            <div class="card-title">
              <div>
                <img
                  src="~@/assets/imgs/cpy.png"
                  class="speacker"
                  width="14"
                  height="16"
                />公司信息
              </div>
            </div>
            <div class="company">
              <h4 class="company-title" v-if="gsxx.transferor.length > 0">
                转让方
              </h4>
              <div
                class="company-info"
                v-for="(item, index) in gsxx.transferor"
                :key="'buy' + index"
              >
                <label v-if="item.companyname" class="key">名称：</label>
                <span v-if="item.companyname" class="value">{{
                  item.companyname
                }}</span>
                <label
                  class="key"
                  v-if="item.country || item.province || item.city"
                  >地区：</label
                >
                <span
                  class="value"
                  v-if="item.country || item.province || item.city"
                >
                  <span v-if="item.country">{{ item.country }}</span>
                  <span v-if="item.province">-{{ item.province }}</span>
                  <span v-if="item.city">-{{ item.city }}</span>
                </span>
                <label v-if="item.description" class="key">公司简介：</label>
                <span class="value" v-if="item.description">{{
                  item.description
                }}</span>
                <router-link
                  :to="{ path: '/trz/qiye/' + item.wyuid }"
                  target="_blank"
                  >查看该公司详细信息</router-link
                >
              </div>
              <h4 class="company-title" v-if="gsxx.buyer.length > 0">受让方</h4>
              <div
                class="company-info"
                v-for="(item, index) in gsxx.buyer"
                :key="'saler' + index"
              >
                <label v-if="item.companyname" class="key">名称：</label>
                <span v-if="item.companyname" class="value">{{
                  item.companyname
                }}</span>
                <label
                  class="key"
                  v-if="item.country || item.province || item.city"
                  >地区：</label
                >
                <span
                  class="value"
                  v-if="item.country || item.province || item.city"
                >
                  <span v-if="item.country">{{ item.country }}</span>
                  <span v-if="item.province">-{{ item.province }}</span>
                  <span v-if="item.city">-{{ item.city }}</span>
                </span>
                <label v-if="item.description" class="key">公司简介：</label>
                <span class="value" v-if="item.description">{{
                  item.description
                }}</span>
                <router-link
                  :to="{ path: '/trz/qiye/' + item.wyuid }"
                  target="_blank"
                  >查看该公司详细信息</router-link
                >
              </div>
            </div>
          </div>
        </div>
        <div class="right-content">
          <div class="card">
            <div class="card-title">
              <div>
                <img
                  src="~@/assets/imgs/trz/speaker.png"
                  class="speacker"
                  width="16"
                  height="13"
                />
                相关报道
              </div>
              <div
                class="refresh-btn"
                @click="goToNewsList"
                v-if="newsCount > 6"
              >
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
import LoadingGif from "@/components/common/globalCom/loading-gif";
import MiddleScroll from "@/components/common/trz/middle.scroll.js";

export default {
  mixins: [MiddleScroll],
  components: { CustomHeader, LoadingGif },
  data() {
    return {
      navs: ["项目概要", "公司信息"],
      showSJGY: true, // 显示项目概要模块
      showGSXX: true, // 显示投资关系模块
      infoObj: {},
      gsxx: {},
      newsList: [],
      activeNav: 0,
      loading: false,
      newsCount: 0,
    };
  },
  mounted() {
    this.handlerDetail();
  },
  methods: {
    searchKeywords(keywords) {
      let routeData = this.$router.resolve({
        path: "/trz/kuajing",
        query: {
          keywords: keywords,
        },
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
          url: "/api/kuajing/gsxx",
          params: {
            transferoruid: this.infoObj.transferoruid,
            // acquireruid: "d61909406f7211e8af536546bca6a47d",
            buyeruid: this.infoObj.buyeruid,
            accesstoken: GETCOOKIEFUN("accesstoken"),
          },
        })
        .then((res) => {
          if (res.data.code === 200 && res.data.data) {
            let data = res.data.data;
            this.gsxx = data;
            if (
              this.gsxx.transferor &&
              this.gsxx.transferor.length == 0 &&
              this.gsxx.buyer &&
              this.gsxx.buyer.length == 0
            ) {
              this.showGSXX = false;
              this.navs.splice(this.navs.indexOf("公司信息"), 1);
            }
          } else {
            this.showGSXX = false;
            this.navs.splice(this.navs.indexOf("公司信息"), 1);
          }
        })
        .catch((err) => {
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
          url: "/api/kuajing/read",
          params: {
            id: this.$route.params.id,
            accesstoken: GETCOOKIEFUN("accesstoken"),
          },
        })
        .then((res) => {
          this.loading = false;
          if (res.data.code === 200 && res.data.data) {
            let data = res.data.data;
            this.infoObj = data;
            this.$nextTick(() => {
              $(".left-content .card").css(
                "height",
                `calc(100vh - ${
                  $(".container-top").height() + 20 + 5 + 65 + 10
                }px)`
              );
            });
            this.handlerGSXX();
            this.handlerNews();
          } else {
            this.showSJGY = false;
            this.navs.splice(this.navs.indexOf("项目概要"), 1);
          }
        })
        .catch((err) => {
          console.log(err);
          this.showSJGY = false;
          this.navs.splice(this.navs.indexOf("项目概要"), 1);
        });
    },
    // 最新动态
    async handlerNews() {
      await window
        .Axios({
          method: "get",
          url: "/api/kuajing/news",
          params: {
            transferoruid: this.infoObj.transferoruid,
            buyeruid: this.infoObj.buyeruid,
            dataId: this.infoObj.data_id,
            accesstoken: GETCOOKIEFUN("accesstoken"),
          },
        })
        .then((res) => {
          if (res.data.code === 200 && res.data.data) {
            let data = res.data.data.res;
            this.newsCount = res.data.data.count;
            this.newsList = data;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    // 跳转到新闻列表页
    goToNewsList() {
      let routeData = this.$router.resolve({
        path: "/trz/news",
        query: {
          fourth_condition: `surl=${this.infoObj.news}`,
        },
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
        path: path,
      });
      window.open(href, "_blank");
    },

    // 链接到企业版综合搜索页
    goComprehensiveSearch(searchwords,comprehensive) {
      const routeData = this.$router.resolve({
        path: '/search',
        query: {
          comprehensive: comprehensive,
          searchwords: searchwords,
          source: 1
        }
      });
      window.open(routeData.href, "_blank");
    },
  },
};
</script>

<style lang="less" scoped>
.rongzi-detail {
  min-width: 1280px;
  .detail-container {
    width: calc(100vw - 10px);
    min-height: calc(100vh - 65px);
    margin: 64px 10px 0 0;
    min-width: 1280px;
    .container-top {
      margin-bottom: 20px;
      display: flex;
      flex-flow: column;
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
      cursor: unset;
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
        width: 150px;
      }
    }

    .rongzi-target {
      height: 13px;
      line-height: 20px;
      font-size: 13px;
      font-weight: 400;
      color: #666666;
      margin: 6px 0 20px 0;
      width: calc(100vw - 360px);
      min-width: 1000px;
    }

    .title,
    .touzifang,
    .rongzi-target {
      padding-left: 20px;
    }

    .title {
      line-height: 18px;
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
        padding: 5px 0;
        box-sizing: border-box;
        .card {
          width: 100%;
          min-width: 230px;
          height: calc(100vh - 205px);
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
              > div:first-child {
                width: 90px;
                height: 14px;
                line-height: 14px;
                font-size: 14px;
                font-weight: 400;
                color: #666666;
                display: flex;
                justify-content: space-between;
              }

              .text {
                color: #09144f;
                cursor: pointer;
                &:hover {
                  text-decoration: underline;
                }
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
