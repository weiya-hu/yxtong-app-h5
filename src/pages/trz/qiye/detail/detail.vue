<template>
  <div class="rongzi-detail">
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
              infoObj.round ||
              infoObj.city ||
              (infoObj.concept && infoObj.concept.length > 0)
          "
        >
          {{ infoObj.companyname }}
          <div class="tag-round" v-if="infoObj.round">
            {{ infoObj.round }}
          </div>
          <!-- <span
          class="tag"
          v-if="
            infoObj.applicationscenarios &&
              infoObj.applicationscenarios.length > 0
          "
          v-for="txt in infoObj.applicationscenarios"
          :key="txt"
          @click="searchKeywords(txt)"
          >{{ txt }}</span
        > -->
          <div class="tag1 tag-provice" v-if="infoObj.province">
            {{ infoObj.province }}
          </div>
          <span
            class="tag"
            v-if="infoObj.concept && infoObj.concept.length > 0"
            v-for="item in infoObj.concept"
            :key="item"
            @click="searchKeywords(item)"
          >
            {{ item }}
          </span>
        </div>
        <div class="rongzi-target" v-if="infoObj.context">
          <span>企业简介：</span>
          <div
            style="color: #333;
              max-height: 40px;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
              overflow: hidden; flex: 1;"
            :title="infoObj.context"
          >
            {{ infoObj.context }}
          </div>
        </div>
      </div>
      <div class="cards">
        <div class="left-content">
          <div class="card">
            <div class="summary-list">
              <div
                v-for="(item, index) in navs"
                :key="item"
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
          v-if="showRZLC === true || showXXXX === true"
        >
          <div class="card" v-if="showRZLC === true" id="panel-rzlc">
            <div class="card-title">
              <div>
                <img
                  src="~@/assets/imgs/trz/licheng.png"
                  class="speacker"
                  width="13"
                  height="14"
                />
                融资历程
              </div>
            </div>
            <div class="content">
              <div class="rzlc" v-if="rzlcList.length">
                <div class="rzlc-warp" ref="rzlcwarp" id="rzlcwarp">
                  <div class="rzlc-scroll">
                    <div
                      class="rzlc-item"
                      v-for="(item, i) in rzlcList"
                      :key="item.id"
                      :class="i === rzlcCur ? 'active' : ''"
                    >
                      <div class="inner">
                        <div class="hd">
                          <span v-if="item.time">{{ item.time }}</span>
                          <em v-if="item.round">{{ item.round }}</em>
                          <a
                            v-if="item.data_id"
                            :href="'/trz/rongzi/' + item.data_id"
                            target="_blank"
                            >查看详情</a
                          >
                        </div>
                        <div class="bd">
                          <div class="info">
                            <label
                              ><span>融</span><span>资</span><span>金</span
                              ><span>额：</span></label
                            >
                            <div v-if="item.guifan_amount">
                              <span class="money">{{
                                item.guifan_amount
                              }}</span>
                            </div>
                          </div>
                          <div class="info">
                            <label
                              ><span>投</span><span>资</span
                              ><span>人：</span></label
                            >
                            <div>{{ item.investors }}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="rzlc-btn-area">
                  <div
                    class="rzlc-btn btn-prev"
                    :class="rzlcCur == 0 ? 'disabled' : ''"
                    @click="rzlcScroll(0)"
                  ></div>
                  <div
                    class="rzlc-btn btn-next"
                    :class="rzlcCur == rzlcList.length - 1 ? 'disabled' : ''"
                    @click="rzlcScroll(1)"
                  ></div>
                </div>
              </div>
              <div class="rzlc-nodata" v-else></div>
            </div>
          </div>
          <!-- <div class="card" id="panel-zycy">
            <div class="card-title">
              <div>
                <img
                  src="~@/assets/imgs/trz/zhuyaochengyuan.png"
                  class="speacker"
                  width="14"
                  height="14"
                />
                主要成员
              </div>
            </div>
            <div class="content">
              <div class="zycy-list" v-if="zycy.length">
                <div class="info-item" v-for="(item, i) in zycy" :key="i">
                  <div class="info-label">成员{{ i + 1 }}</div>
                  <div class="info f16">{{ item.name }}</div>
                  <div class="info">{{ item.zw }}</div>
                  <div class="info">{{ item.bl }}</div>
                </div>
              </div>
              <div class="rzlc-nodata" v-else></div>
            </div>
          </div>
          <div class="card" id="panel-gdxx">
            <div class="card-title">
              <div>
                <img
                  src="~@/assets/imgs/trz/gudongxinxi.png"
                  class="speacker"
                  width="14"
                  height="14"
                />
                股东信息
              </div>
            </div>
            <div class="content">
              <div class="gdxx-list" v-if="gdxx.length">
                <div class="info-item" v-for="(item, i) in gdxx" :key="i">
                  <div class="info-label">股东{{ i + 1 }}</div>
                  <div class="info f16">{{ item.name }}</div>
                  <div class="info">{{ item.bl }}</div>
                  <div class="info">{{ item.cz }}</div>
                  <div class="info">{{ item.time }}</div>
                </div>
              </div>
              <div class="rzlc-nodata" v-else></div>
            </div>
          </div> -->
          <div class="card" v-if="showXXXX === true" id="panel-xxxx">
            <div class="card-title">
              <div>
                <img
                  src="~@/assets/imgs/trz/xiangxixinxi.png"
                  class="speacker"
                  width="14"
                  height="14"
                />
                详细信息
              </div>
            </div>
            <div class="content">
              <div class="rz-detail">
                <div class="info-list">
                  <div class="summary-item" v-if="infoObj.companyname">
                    <div>
                      <span>企</span><span>业</span><span>名</span
                      ><span>称：</span>
                    </div>
                    {{ infoObj.companyname }}
                  </div>
                  <div class="summary-item" v-if="infoObj.phone">
                    <div>
                      <span>联</span><span>系</span><span>电</span
                      ><span>话：</span>
                    </div>
                    {{ infoObj.phone }}
                  </div>
                  <div class="summary-item" v-if="infoObj.establishmenttime">
                    <div>
                      <span>成</span><span>立</span><span>时</span
                      ><span>间：</span>
                    </div>
                    {{ infoObj.establishmenttime }}
                  </div>
                  <div class="summary-item" v-if="infoObj.email">
                    <div><span>邮</span><span>箱：</span></div>
                    {{ infoObj.email }}
                  </div>
                  <div class="summary-item" v-if="infoObj.city">
                    <div><span>地</span><span>点：</span></div>
                    {{ infoObj.city }}
                  </div>
                  <div class="summary-item" v-if="infoObj.address">
                    <div>
                      <span>联</span><span>系</span><span>地</span
                      ><span>址：</span>
                    </div>
                    {{ infoObj.address }}
                  </div>
                  <div class="summary-item"></div>
                  <div class="summary-item" v-if="infoObj.companyurl">
                    <div><span>网</span><span>址：</span></div>
                    <a
                      :href="infoObj.companyurl"
                      class="link"
                      target="_blank"
                      >{{ infoObj.companyurl }}</a
                    >
                  </div>
                </div>
                <div class="content2" v-if="infoObj.context">
                  <div class="info-item">
                    <div class="info-label">企业介绍</div>
                    <div class="info text">{{ infoObj.context }}</div>
                  </div>
                  <div
                    class="info-item"
                    v-if="infoObj.technology && infoObj.technology.length > 0"
                  >
                    <div class="info-label">行业</div>
                    <div class="info text">
                      {{ infoObj.technology.join(" ") }}
                    </div>
                  </div>

                  <div
                    class="info-item"
                    v-if="
                      infoObj.applicationscenarios &&
                        infoObj.applicationscenarios.length > 0
                    "
                  >
                    <div class="info-label">关键词</div>
                    <div class="info text">
                      {{ infoObj.applicationscenarios.join(" ") }}
                    </div>
                  </div>

                  <div
                    class="info-item"
                    v-if="
                      infoObj.related_drugs
                    "
                  >
                    <div class="info-label">相关药物</div>
                    <div class="info text">
                      {{ infoObj.related_drugs }}
                    </div>
                  </div>

                  <div
                    class="info-item"
                    v-if="
                      infoObj.related_targets
                    "
                  >
                    <div class="info-label">相关靶点</div>
                    <div class="info text">
                      {{ infoObj.related_targets }}
                    </div>
                  </div>

                  <div
                    class="info-item"
                    v-if="
                      infoObj.related_diseases_indications
                    "
                  >
                    <div class="info-label">相关疾病/适应症</div>
                    <div class="info text">
                      {{ infoObj.related_diseases_indications }}
                    </div>
                  </div>
                </div>
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
                最新资讯
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
                  :key="item.title"
                >
                  <!-- <div class="news-text" @click="linkToNew(item.data_id)" :title="item.title">{{ item.title }}</div> -->
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
                        v-if="item.time"
                      />{{ item.time }}
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
import MiddleScroll from "@/components/common/trz/middle.scroll.js";
import LoadingGif from "@/components/common/globalCom/loading-gif";
export default {
  components: { CustomHeader, LoadingGif },
  mixins: [MiddleScroll],
  data() {
    return {
      navs: ["融资历程", "详细信息"],
      showRZLC: true, // 显示融资历程模块
      showXXXX: true, // 显示详细信息模块
      rzlcCur: 0, // 融资历程当前下标
      rzlcList: [], // 融资历程数据
      zycy: [],
      gdxx: [],
      infoObj: {},
      newsList: [],
      newsCount: 0,
      activeNav: 0,
      loading: false
    };
  },
  mounted() {
    this.handlerDetail();
  },
  methods: {
    searchKeywords(keywords) {
      let routeData = this.$router.resolve({
        path: "/trz/qiye",
        query: {
          keywords: keywords
        }
      });
      window.open(routeData.href, "_blank");
    },
    linkToNews() {
      let routeData = this.$router.resolve({
        path: "/trz/news",
        query: {
          fourth_condition: `wyuid=${this.$route.params.id}`
        }
      });
      window.open(routeData.href, "_blank");
    },
    async handlerDetail() {
      this.loading = true;
      await window
        .Axios({
          method: "get",
          url: "/api/tourongzi_qiye/read",
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
            this.infoObj = data.info;
            this.$nextTick(() => {
              $(".left-content .card").css(
                "height",
                `calc(100vh - ${$(".container-top").height() +
                  20 +
                  5 +
                  72 +
                  10}px)`
              );
            });
            this.handlerNews();
            // this.infoObj.concept = [
            //   "肿瘤",
            //   "心血管疾病",
            //   "神经系统疾病",
            //   "口腔科",
            //   "皮肤科",
            //   "传染科",
            //   "药物概念"
            // ];
            this.rzlcList = _.orderBy(data.fun_history.res, ["time"], ["asc"]);
            if (this.rzlcList.length > 0) {
              setTimeout(() => {
                // 融资历程初始化
                if (this.rzlcList.length) {
                  this.rzlcCur = this.rzlcList.length - 1;
                  this.rzlcScrollPosition();
                  this.$refs.rzlcwarp.style.visibility = "visible";
                }
              }, 0);
            } else {
              this.showRZLC = this.rzlcList.length > 0;
              this.navs.splice(this.navs.indexOf("融资历程"), 1);
            }
          } else {
            this.showRZLC = false;
            this.showXXXX = false;
            this.navs.splice(this.navs.indexOf("融资历程"), 1);
            this.navs.splice(this.navs.indexOf("公司信息"), 1);
          }
        })
        .catch(err => {
          console.log(err);
          this.showRZLC = false;
          this.showXXXX = false;
          this.navs.splice(this.navs.indexOf("融资历程"), 1);
          this.navs.splice(this.navs.indexOf("公司信息"), 1);
        });
    },
    // 最新动态
    async handlerNews() {
      await window
        .Axios({
          method: "get",
          url: "/api/tourongzi_qiye/index",
          params: {
            action: "latestNews",
            wyuid: this.$route.params.id,
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
    // 左侧按钮定位事件
    positionPanel(index) {
      // document.getElementById("panel-" + id).scrollIntoView();
      this.goTop(index);
    },
    // 融资历程左右按钮事件
    rzlcScroll(flag) {
      if (
        (flag && this.rzlcCur == this.rzlcList.length - 1) ||
        (!flag && this.rzlcCur == 0)
      ) {
        return;
      }
      if (flag) {
        this.rzlcCur++;
      } else {
        this.rzlcCur--;
      }
      this.rzlcScrollPosition();
    },
    // 融资历程定位
    rzlcScrollPosition() {
      this.$refs.rzlcwarp.scrollLeft = 170 * this.rzlcCur - 340;
    }
  }
};
</script>

<style lang="less" scoped>
.nodata {
  width: 100%;
  padding: 80px 0;
  background: url("/static/imgs/trz/no_data.png") no-repeat center center;
}
.rzlc {
  width: 100%;
  position: relative;
  overflow: hidden;
  &:after {
    content: "";
    position: absolute;
    left: 0;
    top: 184px;
    width: 100%;
    height: 1px;
    z-index: 1;
    background: #dae0e9;
  }
}
.rzlc-warp {
  width: 100%;
  overflow: hidden;
  position: relative;
  z-index: 2;
  visibility: hidden;
}
.rzlc-scroll {
  white-space: nowrap;
  padding: 170px 85px; // 170px100px
  position: relative;
  z-index: 1;
}
.rzlc-item {
  position: relative;
  margin: 0 84px;
  height: 1px;
  background-color: #dae0e9;
  display: inline-block;
  transition: all 0.05s ease-in;
  * {
    transition: all 0.05s ease-in;
  }
  z-index: 2;
  .inner {
    width: 320px;
    height: 122px;
    overflow: hidden;
    position: absolute;
    left: -165px;
    border: 1px solid #dae0e9;
    background-color: #fff;
    font-size: 13px;
    z-index: 5;
    border-radius: 4px;
    .hd {
      height: 20px;
      line-height: 20px;
      background-color: #f5f8fc;
      color: #333;
      padding: 7px 18px;
      a {
        color: #3556b9;
        float: right;
      }
      em {
        display: inline-block;
        font-style: normal;
        height: 20px;
        line-height: 20px;
        border-radius: 4px;
        border: 1px solid #3556b9;
        padding: 0 15px;
        font-size: 13px;
        color: #3556b9;
        text-align: center;
        margin-left: 8px;
      }
    }
    .bd {
      padding: 7px 18px;
      .info {
        line-height: 1.75;
        width: 100%;
        display: flex;
        label {
          width: 68px;
          color: #666;
          display: flex;
          justify-content: space-between;
          flex-shrink: 0;
        }
        .money {
          color: #e7af2f;
          font-size: 18px;
          vertical-align: middle;
          display: inline-block;
          margin-top: -5px;
        }
        > div {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }
  &:before {
    content: "";
    position: absolute;
    left: 5px;
    width: 1px;
    z-index: 1;
    background: #dae0e9;
    height: 50px;
  }
  &:after {
    content: "";
    position: absolute;
    top: -5px;
    left: 0;
    width: 10px;
    height: 10px;
    background-color: #fff;
    border: 1px solid #3556b9;
    border-radius: 50%;
    z-index: 2;
  }
  &:nth-child(even) {
    &:before {
      top: -50px;
    }
    .inner {
      top: -170px;
    }
  }
  &:nth-child(odd) {
    &:before {
      top: 0;
    }
    .inner {
      top: 50px;
    }
  }
  &.active {
    .inner {
      border-color: #3556b9;
      .hd {
        background-color: #3556b9;
        color: #fff;
        a {
          color: #fff;
        }
        em {
          color: #fff;
          border-color: #fff;
        }
      }
    }
    &:before {
      background: #3556b9;
    }
    &:after {
      width: 15px;
      height: 15px;
      background: url("~@/assets/imgs/trz/dot.png") no-repeat;
      top: -7px;
      left: -3px;
    }
  }
}
.rzlc-btn-area {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  .rzlc-btn {
    // position: absolute;
    // bottom: 0;
    &:first-child {
      margin-right: 20px;
    }
    width: 28px;
    height: 28px;
    z-index: 10;
    background-image: url("~@/assets/imgs/trz/rzlc-btn.png");
    background-repeat: no-repeat;
    cursor: pointer;
    &.disabled {
      cursor: default;
    }
    &.btn-prev {
      // right: 42px;
      background-position: 0 0;
      &.disabled {
        background-position: 0 -76px !important;
      }
      &:hover {
        background-position: 0 -152px;
      }
    }
    &.btn-next {
      // right: 0;
      background-position: 0 -38px;
      &.disabled {
        background-position: 0 -114px !important;
      }
      &:hover {
        background-position: 0 -190px;
      }
    }
  }
}

.info-item {
  display: flex;
  width: calc(100% - 40px);
  border-radius: 4px;
  border: 1px solid #dae0e9;
  line-height: 32px;
  justify-content: left;
  width: 100%;
  &:not(:last-child) {
    margin-bottom: 10px;
  }
  .info-label {
    width: 115px;
    flex-shrink: 0;
    min-height: 34px;
    background: #dae0e9;
    border-radius: 4px 0px 0px 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    font-size: 14px;
    font-weight: 400;
    color: #333333;
    &.blue {
      color: #fff;
      background: #3556b9ff;
    }
  }
  .info {
    font-size: 14px;
    margin-left: 20px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: #333333ff;
    text-align: left;
    max-height: 110px;
    overflow-y: auto;
    &.text {
      white-space: normal;
      font-size: 14px;
      font-weight: 400;
      color: #333333;
      line-height: 20px;
      padding: 6px 0;
      box-sizing: border-box;
    }
  }
  .f16 {
    font-size: 16px;
    font-weight: 700;
  }
}

.gdxx-list,
.zycy-list {
  width: 100%;
  padding: 20px 0;
}
.zycy-list .info-item .info {
  &:nth-child(2) {
    width: 20%;
  }
  &:nth-child(3) {
    width: 20%;
  }
  &:nth-child(4) {
    flex: 1;
  }
}
.gdxx-list .info-item .info {
  &:nth-child(2) {
    flex: 1;
  }
  &:nth-child(3) {
    width: 15%;
  }
  &:nth-child(4) {
    width: 15%;
  }
  &:nth-child(5) {
    width: 15%;
  }
}

.rz-detail {
  display: block;
  width: 100%;
}

.rongzi-detail {
  min-width: 1280px;
  .detail-container {
    width: calc(100vw - 10px);
    min-height: calc(100vh - 72px);
    margin: 68px 10px 0 0;
    min-width: 1280px;

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

    .tag-round {
      font-size: 12px;
      color: #fff;
      font-weight: normal;
      line-height: 1;
      padding: 5px;
      background-color: #3556b9;
      margin-left: 10px;
      border-radius: 4px;
    }
    .touzifang-item {
      display: flex;
      height: 13px;
      line-height: 13px;
      font-size: 13px;
      font-weight: 400;
      color: #09144f;
      margin-right: 10px;
    }

    .touzifang {
      line-height: 13px;
      font-size: 13px;
      font-weight: 400;
      color: #666666;
      display: flex;
    }

    .rongzi-target {
      line-height: 20px;
      font-size: 13px;
      font-weight: 400;
      color: #666;
      margin: 6px 0 20px 0;
      width: calc(100vw - 360px);
      min-width: 1000px;
      display: flex;
      span {
        width: 65px;
      }
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
    }

    .concepts {
      display: flex;
      align-items: center;
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
          padding-bottom: 0;
        }
      }

      .middle-content {
        width: calc(100% - 560px);
        height: calc(100vh - 170px);
        min-width: 720px;
        overflow: auto;
        padding: 5px;
        box-sizing: border-box;
        position: relative;
        .card {
          padding-bottom: 20px;
        }
        .content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          .info-list {
            display: flex;
            flex-wrap: wrap;
            .summary-item {
              display: flex;
              align-items: center;
              margin-bottom: 10px;
              width: 49.5%;
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
        }
        .content2 {
          width: 100%;
          margin-top: 10px;
        }
      }

      .card {
        width: 100%;
        background: #ffffff;
        box-shadow: 0 1px 6px 0px rgba(9, 20, 79, 0.19);
        border-radius: 4px;
        position: relative;
        &:not(:last-child) {
          margin-bottom: 10px;
        }
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
          padding: 20px 20px 0 20px;
          font-size: 14px;
          font-weight: 400;
          color: #333333ff;
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
                font-size: 13px;
                font-weight: 400;
                color: #333333;
                margin-bottom: 10px;
                cursor: pointer;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
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
</style>
