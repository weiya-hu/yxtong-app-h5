<template>
  <div class="trz">
    <div class="bg">
      <header-trz></header-trz>
      <search-trz></search-trz>
    </div>
    <div class="news">
      <div class="news-box">
        <div v-for="(item, index) in newsList" :key="index" class="news-wrap">
          <router-link
            class="title"
            :to="`/trz/news/${item.data_id}`"
            tag="a"
            target="_blank"
            :title="item.title"
            >{{ item.title }}</router-link
          >
          <div class="time">{{ item.time }}</div>
        </div>
      </div>
    </div>

    <!-- IPO资讯 和 投融资事件 -->
    <div class="section-node" v-if="isLoading === false">
      <!-- IPO -->
      <div class="section-box">
        <div class="top">
          <span class="text">最新IPO资讯</span>
          <span class="more" @click="goNewsList('IPO资讯')">查看更多</span>
        </div>

        <div class="section-ipo">
          <div v-for="(item, index) in ipoList" :key="index" class="ipo-node">
            <!-- ipo时间 -->
            <div class="ipo-left">
              <div class="year">{{ item.timeYear }}</div>
              <!-- <div class="time">{{ item.time }}</div> -->
            </div>
            <!-- ipo点 -->
            <div class="ipo-dot">
              <div class="ipo-line"></div>
            </div>
            <!-- ipo具体信息 -->
            <div class="ipo-right">
              <router-link
                class="title"
                :to="`/trz/news/${item.data_id}`"
                tag="a"
                target="_blank"
                >{{ item.title }}</router-link
              >
              <div class="digest" v-if="item.digest">
                <div>{{ item.digest }}</div>
              </div>
              <div v-if="item.source" class="source">
                <img src="../../../static/imgs/trz/ipo_source.png" alt="" />
                来源：{{ item.source }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 投融资事件 -->
      <div class="section-box section-box2">
        <div class="top">
          <span class="text">最新投融资/并购事件</span>
          <router-link
            :to="`/trz/rongzi`"
            target="_blank"
            class="more"
            @click.native="goRongzi"
            >查看更多</router-link
          >
        </div>

        <div class="section-trzbg">
          <div
            v-for="(item, index) in trzbgList"
            :key="index"
            class="trzbg-node"
          >
            <!-- trzbg时间 -->
            <div class="trzbg-left">
              <div class="year">{{ item.time }}</div>

              <!-- trzbg实心点 -->
              <div class="trzbg-dot">
                <div class="trzbg-line"></div>
              </div>
            </div>

            <!-- trzbg具体信息 -->
            <div v-for="(txt, i) in item.list" :key="i" class="trzbg-child">
              <div class="child-left">
                <!-- <div class="time">{{ txt.time }}</div> -->
              </div>
              <!-- trzbg空心心点 -->
              <div class="child-dot">
                <div class="child-line"></div>
              </div>
              <div class="child-right">
                <!-- 投资信息 -->
                <div v-if="Object.keys(txt.tourongzi).length > 0">
                  <div class="child-tz">投资</div>
                  <div
                    class="info"
                    @click="goToDetails(txt.tourongzi, 'rongzi')"
                  >
                    <div
                      v-if="
                        txt.tourongzi.shortname &&
                        txt.tourongzi.shortname.length > 0
                      "
                      class="tzf"
                    >
                      <span>融资方：</span>
                      <div>
                        <a
                          v-for="(item, i) in txt.tourongzi.shortname"
                          :key="i"
                          @click.stop="goToListDetail(item)"
                          :class="{
                            'no-click': !item.gsWyuid && !item.jgWyuid,
                          }"
                          >{{ item.name }}</a
                        >
                        <span class="color9">{{ txt.tourongzi.round }}</span>
                        <span class="color9" v-if="txt.tourongzi.guifan_amount!=='未披露'">{{
                          txt.tourongzi.guifan_amount
                        }}</span>
                      </div>
                    </div>
                    <div
                      v-if="
                        txt.tourongzi.investors &&
                        txt.tourongzi.investors.length > 0
                      "
                      class="tzf"
                    >
                      <span>投资方：</span>
                      <div>
                        <a
                          @click.stop="goToListDetail(item)"
                          v-for="(item, i) in txt.tourongzi.investors"
                          :class="{
                            'no-click': !item.gsWyuid && !item.jgWyuid,
                          }"
                          :key="i"
                          >{{ item.name }}</a
                        >
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 并购信息 -->
                <div v-if="Object.keys(txt.binggou).length > 0">
                  <div class="child-bg">并购</div>
                  <div
                    class="info"
                    @click="goToDetails(txt.binggou, 'binggou')"
                  >

                    <div
                      v-if="
                        txt.binggou.shortname &&
                        txt.binggou.shortname.length > 0
                      "
                      class="tzf"
                    >
                      <span style="width: 45px">卖方：</span>
                      <div>
                        <a
                          @click.stop="goToListDetail(item)"
                          v-for="(item, i) in txt.binggou.shortname"
                          :class="{
                            'no-click': !item.gsWyuid && !item.jgWyuid,
                          }"
                          :key="i"
                          >{{ item.name }}</a
                        >
                         <span class="color9" v-if="txt.binggou.guifan_amount!=='未披露'">{{
                          txt.binggou.guifan_amount
                        }}</span>
                      </div>
                    </div>
                    <div
                      v-if="
                        txt.binggou.acquirer && txt.binggou.acquirer.length > 0
                      "
                      class="tzf"
                    >
                      <span style="width: 45px">买方：</span>
                      <div>
                        <a
                          @click.stop="goToListDetail(item)"
                          v-for="(item, i) in txt.binggou.acquirer"
                          :class="{
                            'no-click': !item.gsWyuid && !item.jgWyuid,
                          }"
                          :key="i"
                          >{{ item.name }}</a
                        >
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

    <LoadingGif
      style="min-height: calc(100vh - 439px)"
      :className="'list-in-loading'"
      :classNameImg="'little-size-loading'"
      :loadFlag="isLoading"
      v-if="isLoading"
    ></LoadingGif>

    <!-- 订阅推送建议反馈 -->
    <div class="tips-box" :style="{ left: tipsLeft + 'px' }">
      <div class="text" @click="goSubscribe">
        订阅<br />推送
        <img
          class="code"
          src="../../../static/imgs/wechart/code.png"
          alt=""
          @mouseleave="codeMouseleave"
        />
      </div>
      <div class="text" @click="handleOutClick()">建议<br />反馈</div>

      <div class="text"><a :href="helpUrl" target="_blank" style="color: #fff;">帮助<br/>中心</a></div>

      <!-- 订阅建议引导功能 -->
      <transition name="fade">
        <div class="tips-guide" v-if="showTrzTips">
          <p>
            ①点击“<span>订阅推送</span>”，扫码关注“药智数据服务”微信公众号，绑定账号即可随时掌握最新动态~
          </p>
          <p>
            ②点击“<span>建议反馈</span>”，吐槽一下不好用的地方或和我们说一说您想要的功能吧！
          </p>
          <p>
            ③点击“<span>帮助中心</span>”，帮助您快速了解投资格局。
          </p>
          <div @click="handleTipsKnow">我已知晓</div>
        </div>
      </transition>
    </div>

    <footer-trz></footer-trz>

    <!-- 新手引导 -->
    <div class="new-guide" v-if="showTrzNewGuide">
      <div
        :style="{ marginLeft: marginLeft + 'px', left: tipsLeft - 10 + 'px' }"
        :class="['guide-bg', `guide-step${guideStep}`]"
      ></div>

      <!-- 开始教程 -->
      <div v-if="guideStep == 0" class="guide-content0">
        <img src="../../../static/imgs/trz/trz_tips.png" alt="" />
        <div class="info">
          <h4>欢迎使用投资格局</h4>
          <p>下面请跟随小智快速熟悉吧！</p>

          <div class="info-footer">
            <div @click="handleNextStep">开始教程</div>
            <span @click="handleKnow">我已知晓，直接跳过</span>
          </div>
        </div>
      </div>

      <!-- 数据库导航 -->
      <div
        v-if="guideStep == 1"
        class="guide-content1 fadeInUp"
        :style="{ marginLeft: marginLeft + 'px' }"
      >
        <img src="../../../static/imgs/trz/trz_line.png" alt="" />
        <div class="info">
          <p>
            这里是数据库导航，在这里能够快速找到所有数据库<br />也可以直接进入数据分析模块ヾ(@^▽^@)ノ
          </p>
          <div class="info-footer">
            <div @click="handleNextStep">下一步({{ guideStep }}/5)</div>
            <span @click="handleKnow">我已知晓，直接跳过</span>
          </div>
        </div>
      </div>

      <!-- 数据库检索 -->
      <div v-if="guideStep == 2" class="guide-content2 fadeInUp">
        <img src="../../../static/imgs/trz/trz_line.png" alt="" />
        <div class="info">
          <p>
            在这里可以一键检索所有数据信息，也可以切换到感兴趣的分类<br />进行精确检索，点击热门搜索可以直接查看结果
          </p>
          <div class="info-footer">
            <div @click="handleNextStep">下一步({{ guideStep }}/5)</div>
            <span @click="handleKnow">我已知晓，直接跳过</span>
          </div>
        </div>
      </div>

      <!-- 数据库检索 -->
      <div v-if="guideStep == 3" class="guide-content3 fadeInUp">
        <img src="../../../static/imgs/trz/trz_line.png" alt="" />
        <div class="info">
          <p>在这里可以看到最近4条新闻动态，点击进入新闻详情页~</p>
          <div class="info-footer">
            <div @click="handleNextStep">下一步({{ guideStep }}/5)</div>
            <span @click="handleKnow">我已知晓，直接跳过</span>
          </div>
        </div>
      </div>

      <!-- ipo资讯 -->
      <div v-if="guideStep == 4" class="guide-content4 fadeInUp">
        <div class="info">
          <p>
            这里是最新的IPO资讯和投融资/并购事件，关注事件可以看这里哦~
            <br />点击“查看更多”进入列表页面查看更多事件
          </p>
          <div class="info-footer">
            <div @click="handleNextStep">下一步({{ guideStep }}/5)</div>
            <span @click="handleKnow">我已知晓，直接跳过</span>
          </div>
        </div>
        <img src="../../../static/imgs/trz/trz_line.png" alt="" />
      </div>

      <!-- 订阅 -->
      <div
        v-if="guideStep == 5"
        class="guide-content5 fadeInUp"
        :style="{ left: tipsLeft - 450 + 'px' }"
      >
        <div class="info">
          <p>
            点击这里可以订阅事件更新信息，扫码关注“<span
              style="color: #e7af2f; font-weight: bold"
              >药智数据服务</span
            >”
            <br />微信公众号，绑定账号即可随时掌握最新动态~<br />您在使用过程中有任何问题或建议也可以在线反馈或留言哟~
          </p>
          <div class="info-footer">
            <div @click="handleKnow">完成教程</div>
          </div>
        </div>
        <img src="../../../static/imgs/trz/trz_line.png" alt="" />
      </div>
    </div>
  </div>
</template>

<script>
import HeaderTrz from "@/components/layouts/trz/header";
import FooterTrz from "@/components/layouts/footer-trz";
import SearchTrz from "@/components/layouts/search-trz";
import LoadingGif from "@/components/common/globalCom/loading-gif";
import { mapState } from "vuex";
import sha1 from "sha1";
import UUID from "uuid-js";

export default {
  components: {
    HeaderTrz,
    SearchTrz,
    FooterTrz,
    LoadingGif,
  },
  data() {
    return {
      ipoList: [],
      trzbgList: [],
      newsList: [],
      isLoading: false,
      showTrzNewGuide: false, // 控制新手引导弹窗显示隐藏
      marginLeft: 0,
      guideStep: 0, // 新手引导步骤数
      tipsLeft: 0,
      requestError: true,
      showTrzTips: false, // 控制订阅反馈的引导弹窗显示隐藏
      tipsTimer: null, // 订阅反馈引导弹窗的定时器对象
      helpUrl: '', // 帮助中心URL
    };
  },
  computed: {
    ...mapState({
      username: (state) => state.UserCenter.accountData.username,
      grade_name: (state) => state.UserCenter.accountData.grade_name,
      accountData: (state) => state.UserCenter.accountData,
    }),
  },
  created() {
    this.getIpoList();
    this.getTrzbgList();
  },
  mounted() {
    this.getLineHeight();
    this.getNewsList();
    this.getHelpUrl()

    this.$nextTick(() => {
      let timer = setTimeout(() => {
        if (!localStorage.getItem("showTrzNewGuide") && this.requestError) {
          this.showTrzNewGuide = true;
          this.getGuidLeft();
        }
        clearTimeout(timer);
      }, 2000);
    });
    this.getGuidLeft();

    if (localStorage.getItem("showTrzNewGuide")) {
      this.tipsTime();
    }
    let _this = this;
    window.onresize = function () {
      _this.getGuidLeft();
    };
  },
  activated() {
    this.getGuidLeft();
    let _this = this;
    window.onresize = function () {
      _this.getGuidLeft();
    };
  },
  watch: {
    guideStep() {
      switch (this.guideStep) {
        case 1:
          $(".menu>span").eq(1).addClass("hover");
          $(".menu>span").eq(0).addClass("active");
          break;
        case 2:
          $(".menu>span").eq(1).removeClass("hover");
          break;
        case 3:
          $(".news-box .news-wrap").eq(0).addClass("active");
          break;
        case 4:
          $(".news-box .news-wrap").eq(0).removeClass("active");
          $(".section-ipo .ipo-node").eq(0).addClass("active");
          break;
        case 5:
          $(".section-ipo .ipo-node").eq(0).removeClass("active");
          break;
      }
    },
  },
  methods: {
    // 获取帮助中心跳转链接
    getHelpUrl() {
      window
        .Axios({
          method: "get",
          url: "/api/tourongzi_report/helptext",
          params: {
            accesstoken: GETCOOKIEFUN("accesstoken"),
          },
        })
        .then((res) => {
          if (res.data.code === 200 && res.data.data) {
            this.helpUrl = res.data.data.url
          }
        });
    },

    // 获取左边距
    getGuidLeft() {
      this.$nextTick(() => {
        console.log(1123123);
        this.marginLeft = $(".menu").offset().left - 10;
        this.tipsLeft = 1220 + (window.innerWidth - 1200) / 2;
      });
    },
    // 获取新闻列表
    getNewsList() {
      window
        .Axios({
          method: "get",
          url: "/api/tourongzi_search/finReport",
          params: {
            accesstoken: GETCOOKIEFUN("accesstoken"),
          },
        })
        .then((res) => {
          if (res.data.code === 200 && res.data.data) {
            this.newsList = res.data.data;
          }
        });
    },

    // 获取ipo资讯
    getIpoList() {
      this.isLoading = true;
      window
        .Axios({
          method: "get",
          url: "/api/tourongzi_search/latestIPO",
          params: {
            accesstoken: GETCOOKIEFUN("accesstoken"),
          },
        })
        .then((res) => {
          this.isLoading = false;
          if (res.data.code === 200 && res.data.data) {
            this.ipoList = res.data.data;
            this.requestError = true;
          }
        })
        .then(this.getLineHeight) // 动态计算高度
        .catch((err) => {
          console.log(err);
          this.requestError = false;
        });
    },

    // 获取最新投融资并购事件数据
    getTrzbgList() {
      window
        .Axios({
          method: "get",
          url: "/api/tourongzi_search/touandbing",
          params: {
            accesstoken: GETCOOKIEFUN("accesstoken"),
          },
        })
        .then((res) => {
          if (res.data.code === 200 && res.data.data) {
            this.trzbgList = res.data.data;
          }
        })
        .then(this.getLineHeight); // 动态计算高度
    },

    // 融资并购事件跳转到对应的详情页
    goToDetails(obj, val) {
      console.log(obj, val);
      let pathUrl = "";
      if (val === "rongzi") {
        pathUrl = `/trz/rongzi/${obj.data_id}`;
      } else {
        pathUrl = `/trz/binggou/${obj.data_id}`;
      }
      const { href } = this.$router.resolve({
        path: pathUrl,
      });
      window.open(href, "_blank");
    },

    goToListDetail(val) {
      let path = "";
      console.log(val);
      if (!val.gsWyuid && !val.jgWyuid) return false;
      // 如果gsWyuid存在跳转到企业详情
      if (val.gsWyuid) path = `/trz/qiye/${val.gsWyuid}`;

      // 如果jgWyuid存在跳转到企业详情
      if (val.jgWyuid) path = `/trz/jigou/${val.jgWyuid}`;

      let routeData = this.$router.resolve({
        path: path,
      });
      window.open(routeData.href, "_blank");
    },

    // ipo资讯跳转
    goNewsList(val) {
      window.ga("send", "event", "button", "click", "viptrz_home_moreIPO");
      window._paq.push([
        "trackEvent",
        "button",
        "click",
        "viptrz_home_moreIPO",
      ]);
      let routeData = this.$router.resolve({
        path: "/trz/news",
        query: {
          filter_condition: JSON.stringify({ category: [`${val}`] }),
        },
      });
      window.open(routeData.href, "_blank");
    },

    goRongzi() {
      window.ga(
        "send",
        "event",
        "button",
        "click",
        "viptrz_home_moretourongzi"
      );
      window._paq.push([
        "trackEvent",
        "button",
        "click",
        "viptrz_home_moretourongzi",
      ]);
    },

    // 获取ipo和投融资并购事件的线条高度
    getLineHeight() {
      this.$nextTick(() => {
        // 动态设置ipo时光轴点下面的线的高度
        let heightArr = [];
        let nodeNum = $(".ipo-node").length;

        $(".ipo-node").each(function () {
          heightArr.push($(this).height() - 10);
        });

        $(".ipo-dot .ipo-line").each(function (index) {
          if (index === nodeNum - 1) {
            $(this).css({ height: heightArr[index] });
          } else {
            $(this).css({ height: heightArr[index] });
          }
        });

        // 动态设置投融资并购事件的时光轴点下面的线的高度
        let heightArrTrz = [];
        let nodeNumTrz = $(".trzbg-node .trzbg-child").length;

        $(".trzbg-node .trzbg-child").each(function () {
          heightArrTrz.push($(this).height() - 10);
        });

        $(".child-dot .child-line").each(function (index) {
          if (index === nodeNumTrz - 1) {
            $(this).css({ height: heightArrTrz[index] - 30 });
          } else {
            $(this).css({ height: heightArrTrz[index] });
          }
        });
        console.log(heightArrTrz);
      });
    },

    // 我已知晓，直接跳过点击事件
    handleKnow() {
      localStorage.setItem("showTrzNewGuide", "showTrzNewGuide");
      this.showTrzNewGuide = false;
      this.tipsTime();
    },

    // 新手教程下一步点击事件
    handleNextStep() {
      this.guideStep++;
    },

    // 建议反馈打开客服
    handleOutClick() {
      window.ga("send", "event", "button", "click", "vip_home_corner_zixun");
      window._paq.push([
        "trackEvent",
        "button",
        "click",
        "vip_home_corner_zixun",
      ]);

      let _this = this;
      let random = UUID.create().toString();
      let sign_str = `nonce=${random}&timestamp=${new Date().getTime()}&web_token=${
        _this.accountData.email || _this.accountData.uid
      }`;
      console.info(sign_str + "&2314e6df23cb93264629bbfa10e67c77");
      let sha1Result = sha1(
        sign_str + "&2314e6df23cb93264629bbfa10e67c77"
      ).toUpperCase();

      window.open(
        `https://1537030.udesk.cn/im_client/?web_plugin_id=103301&agent_id=208981&group_id=300631&c_name=${encodeURI(
          _this.username || "咨询客户"
        )}&c_desc=${encodeURI(_this.grade_name || "暂无描述")}&c_email=${
          _this.accountData.email
        }&${sign_str}&signature=${sha1Result}`,
        "_blank"
      );
    },

    // 二维码默认显示，鼠标移入再移出则隐藏
    codeMouseleave() {
      $(".code").css({
        display: "none",
      });
    },

    // 去订阅页面
    goSubscribe() {
      let routeData = this.$router.resolve({
        path: `/usercenter/take/new`,
        query: {
          source: "rongzi",
        },
      });
      window.open(routeData.href, "_blank");
    },

    // 订阅反馈引导 点击我已知晓方法
    handleTipsKnow() {
      localStorage.setItem("showTrzTips", "showTrzTips");
      this.showTrzTips = false;
      clearInterval(this.tipsTimer);
    },

    // 订阅 反馈的 显示定时器方法
    tipsTime() {
      // 当新手弹窗关闭showTrzNewGuide为false  且 订阅 反馈的 弹窗不在内存里面
      if (!this.showTrzNewGuide && !localStorage.getItem("showTrzTips")) {
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
    },
  },
};
</script>

<style lang="less" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.la-app .la-app-main {
  overflow: visible !important;
}
.trz {
  min-height: 100vh;
  .bg {
    height: 320px;
    background: url("/static/imgs/trz/banner-trz-home.png") no-repeat center;
    background-size: 100% 100%;
  }

  .news {
    height: 80px;
    background: #09144f;
    padding: 15px 0;
    box-sizing: border-box;

    .news-box {
      width: 1200px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;

      .news-wrap {
        width: 45%;
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;

        .title {
          font-size: 14px;
          color: #ffffff;
          width: 450px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          &:hover {
            color: #e7af2f;
            text-decoration: none;
          }
        }

        .time {
          font-size: 14px;
          color: #999999;
          white-space: nowrap;
        }
      }

      .news-wrap.active {
        .title {
          color: #e7af2f;
        }
      }
    }
  }

  // IPO资讯 和 投融资事件样式开始
  .section-node {
    display: flex;
    width: 1200px;
    min-height: calc(100vh - 511px);
    margin: 40px auto 30px auto;

    .section-box {
      width: 600px;
      border-radius: 4px;

      .top {
        display: flex;
        justify-content: space-between;
        width: 100%;
        height: 32px;
        line-height: 32px;
        padding: 0 20px;
        box-sizing: border-box;
        background: #182462;
        border-radius: 4px;

        .text {
          font-size: 16px;
          font-weight: 600;
          color: #ffffff;
        }

        .more {
          font-size: 14px;
          color: #e7af2f;
          cursor: pointer;

          &:hover {
            text-decoration: none;
          }
        }
      }

      .section-ipo,
      .section-trzbg {
        margin-top: 30px;

        .ipo-node {
          display: flex;

          .ipo-left {
            width: 100px;
            position: relative;
            top: -5px;

            .year {
              font-size: 14px;
              color: #666;
            }

            .time {
              font-size: 16px;
              font-weight: 600;
              color: #666;
            }
          }

          .ipo-dot {
            width: 11px;
            height: 11px;
            border-radius: 50%;
            background: #ffffff;
            border: 1px solid #182462;
            position: relative;
            box-sizing: border-box;

            .ipo-line {
              position: absolute;
              background: #dbe0e8;
              width: 1px;
              height: 36px;
              left: 4px;
              top: 10px;
            }
          }

          .ipo-right {
            flex: 1;
            margin-left: 20px;
            margin-bottom: 30px;
            width: 469px;

            .title {
              display: block;
              width: 460px;
              font-size: 16px;
              font-weight: 600;
              color: #0d1a62;
              line-height: 20px;
              margin-bottom: 6px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              &:hover {
                color: #e7af2f;
                text-decoration: none;
              }
            }

            .digest {
              background: #f6f8fc;
              border-radius: 4px;
              padding: 6px 10px;
              box-sizing: border-box;
              color: #666;
              font-size: 14px;

              > div {
                max-height: 66px;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 3;
                -webkit-box-orient: vertical;
              }
            }

            .source {
              display: flex;
              align-items: center;
              margin-top: 10px;
              color: #999;

              img {
                width: 12px;
                margin-right: 6px;
              }
            }
          }
        }

        .ipo-node.active {
          .ipo-right {
            .title {
              color: #e7af2f;
            }
          }
        }
      }

      // 投融资并购事件样式
      .section-trzbg {
        .trzbg-node {
          .trzbg-left {
            display: flex;
            margin-bottom: 30px;

            .year {
              font-size: 14px;
              color: #666;
              position: relative;
              top: -5px;
              width: 100px;
            }
          }

          .trzbg-dot {
            width: 11px;
            height: 11px;
            border-radius: 50%;
            background: #182462;
            position: relative;

            .trzbg-line {
              position: absolute;
              background: #dbe0e8;
              width: 1px;
              height: 42px;
              left: 5px;
              top: 11px;
            }
          }

          .trzbg-child {
            display: flex;

            .child-left {
              width: 100px;
              position: relative;
              top: -5px;
              text-align: right;

              .time {
                font-size: 16px;
                font-weight: 600;
                color: #666;
                margin-right: 30px;
              }
            }

            .child-dot {
              width: 11px;
              height: 11px;
              border-radius: 50%;
              background: #ffffff;
              border: 1px solid #182462;
              position: relative;
              box-sizing: border-box;
              position: relative;

              .child-line {
                position: absolute;
                background: #dbe0e8;
                width: 1px;
                height: 36px;
                left: 4px;
                top: 10px;
              }
            }

            .child-right {
              flex: 1;
              margin-left: 20px;
              margin-bottom: 30px;
              font-size: 14px;
              color: #666;

              .child-tz {
                width: 56px;
                height: 28px;
                line-height: 28px;
                background: #3556b9;
                border-radius: 4px;
                font-size: 14px;
                font-weight: 600;
                color: #ffffff;
                text-align: center;
                position: relative;
                top: -10px;
              }

              .child-bg {
                width: 56px;
                height: 28px;
                line-height: 28px;
                background: #e7af2f;
                border-radius: 4px;
                font-size: 14px;
                font-weight: 600;
                color: #ffffff;
                text-align: center;
                position: relative;
                top: -10px;
              }

              .info {
                padding: 6px 10px;
                box-sizing: border-box;
                background: #f6f8fc;
                border-radius: 4px;
                cursor: pointer;
                &:hover {
                  background: #dbe0e8;
                }

                .tzf {
                  display: flex;
                  justify-content: space-between;

                  span {
                    width: 60px;
                  }
                  div {
                    flex: 1;
                    max-height: 66px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                  }
                }

                a {
                  color: #182462;
                  margin-right: 8px;
                }

                .color9 {
                  color: #999;
                }

                .no-click {
                  text-decoration: none;
                  cursor: unset;
                }
              }
            }
          }
        }
      }
    }

    .section-box2 {
      width: 500px;
      margin-left: 100px;
    }
  }
  // IPO资讯 和 投融资事件样式结束

  // 新手引导样式
  .new-guide {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 9999;
    min-width: 1280px;
    // background: rgba(0, 0, 0, 0.3)

    .fadeInUp {
      -webkit-animation-name: fadeInUp;
      animation-name: fadeInUp;
    }

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
    .guide-bg {
      box-shadow: 0 0 0 10000px rgba(0, 0, 0, 0.7);
      border-radius: 4px;
    }

    .guide-step0 {
      width: 460px;
      height: 200px;
      padding: 40px;
      box-sizing: border-box;
      background: #ffffff;
      border-radius: 4px;
      position: fixed;
      top: 50% !important;
      left: 50% !important;
      transform: translate(-50%, -50%);
      margin-left: 0 !important;
    }

    .guide-content0 {
      display: flex;
      align-items: center;
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);

      img {
        width: 88px;
        height: 112px;
        margin-right: 30px;
      }

      .info {
        h4 {
          font-size: 20px;
          font-weight: 600;
          color: #182462;
          margin-bottom: 10px;
          line-height: 20px;
        }

        p {
          font-size: 16px;
          line-height: 16px;
          color: #666666;
          margin-bottom: 20px;
        }

        &-footer {
          display: flex;
          align-items: center;

          div {
            width: 100px;
            height: 36px;
            line-height: 36px;
            text-align: center;
            background: #3556b9;
            border-radius: 4px;
            font-size: 16px;
            color: #ffffff;
            margin-right: 20px;
            cursor: pointer;
          }

          span {
            font-size: 14px;
            color: #666666;
            cursor: pointer;
          }
        }
      }
    }

    .guide-step1 {
      width: 645px;
      height: 92px;
      margin-top: 10px;
    }

    .guide-content1,
    .guide-content2,
    .guide-content3,
    .guide-content4,
    .guide-content5 {
      position: relative;
      top: -30px;
      animation-duration: 1s;
      animation-fill-mode: forwards;

      img {
        width: 12px;
        height: 102px;
        margin-left: 30px;
      }

      .info {
        p {
          font-size: 20px;
          color: #ffffff;
          line-height: 30px;
        }
        &-footer {
          display: flex;
          align-items: center;
          margin-top: 20px;

          div {
            width: 110px;
            height: 36px;
            line-height: 36px;
            text-align: center;
            background: #e7af2f;
            border-radius: 4px;
            font-size: 16px;
            color: #182462;
            margin-right: 30px;
            cursor: pointer;
          }

          span {
            font-size: 16px;
            color: #ffffff;
            cursor: pointer;
          }
        }
      }
    }

    .guide-step2 {
      width: 580px;
      height: 130px;
      margin: 130px auto 0 auto !important;
    }

    .guide-content2 {
      width: 580px;
      margin: 0 auto 0 auto !important;
      top: -40px;
    }

    .guide-step3,
    .guide-step4 {
      width: 1220px;
      height: 78px;
      margin: 322px auto 0 auto !important;
    }

    .guide-content3 {
      width: 515px;
      margin: -10px auto 0 auto !important;

      img {
        margin-left: 250px;
      }
    }

    .guide-step4 {
      height: 332px;
      margin-top: 430px !important;
    }

    .guide-content4 {
      position: relative;
      width: 860px;
      margin: -500px auto 0 auto !important;

      .info {
        margin-left: 260px;
      }
      img {
        transform: rotate(180deg);
        margin-top: 12px;
        margin-left: 475px;
      }
    }

    .guide-step5 {
      width: 186px;
      height: 190px;
      position: fixed;
      bottom: 32px;
      margin-left: 0 !important;
    }

    .guide-content5 {
      position: fixed;
      bottom: 245px;
      top: auto;
      width: 545px;
      height: 146px;
      img {
        transform: rotate(180deg);
        margin-top: 12px;
        position: absolute;
        right: 30px;
        bottom: -50px;
      }
    }
  }

  // 建议反馈样式
  .tips-box {
    position: fixed;
    bottom: 50px;

    .text {
      width: 50px;
      text-align: center;
      background: #3556b9;
      color: #fff;
      padding: 5px 0;
      box-sizing: border-box;
      border-radius: 4px 4px 0 0;
      margin-top: 5px;
      cursor: pointer;

      a:hover {
        text-decoration: none;
      }
    }

    .text:nth-child(2) {
      border-radius: 0;
    }

    .text:nth-child(3) {
      border-radius: 0 0 4px 4px;
    }

    .code {
      width: 110px;
      position: absolute;
      top: 5px;
      left: 60px;
    }

    .text:nth-child(1):hover {
      .code {
        display: block !important;
      }
    }

    .tips-guide {
      width: 244px;
      padding: 10px;
      box-sizing: border-box;
      position: absolute;
      top: -245px;
      left: -180px;
      background: #fff;
      box-shadow: 0px 1px 10px 0px rgba(9, 20, 79, 0.19);
      border: 1px solid #e7af2f;
      border-radius: 4px;

      p {
        color: #666666;
        font-size: 13px;
        line-height: 20px;
        margin-bottom: 10px;

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
      bottom: -6px;
      right: 27px;
      transform: translate(-50%) rotate(135deg);
      background: #fff;
      border-top: 1px solid #e7af2f;
      border-right: 1px solid #e7af2f;
    }
  }

  @media screen and (max-width: 1600px) {
    .tips-box {
      right: 20px;
      left: auto !important;

      .code {
        left: -120px;
      }
    }

    .new-guide {
      .guide-step5 {
        right: 10px;
        position: fixed;
        left: auto !important;
      }

      .guide-content5 {
        left: auto !important;
        right: 40px;
      }
    }
  }
}
</style>
