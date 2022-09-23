<template>
  <div class="wrapper" ref="wrapper">
    <!-- 自定义加载界面 -->
    <LoadingGif :loadFlag="isloading" v-if="isloading"></LoadingGif>
    <div class="detail-list">
      <!-- header -->
      <div class="detail-header header-fixed">
        <div class="header-left">
          <div class="left-top">
            <span class="top-id" :title="dataBase.name || dataBase.qiye">{{
              dataBase.name || dataBase.qiye
            }}</span>
          </div>
          <div class="left-bottom" v-if="dataBase.englishname">
            <span class="bottom-name">{{ dataBase.englishname }}</span>
          </div>
        </div>
        <div class="header-right">
          <div class="breadcrumb-f">
            <el-tooltip
              class="help-tip"
              effect="light"
              placement="bottom"
              v-if="helpInfo.remark ? helpInfo.remark : ''"
            >
              <div slot="content">
                <el-scrollbar>
                  <div
                    class="tip-content"
                    v-html="helpInfo.remark ? helpInfo.remark : ''"
                  ></div>
                </el-scrollbar>
                <a
                  class="btn default"
                  v-if="helpInfo.url"
                  :href="helpInfo.url"
                  target="_blank"
                  >帮助中心</a
                >
              </div>
              <span><i class="el-icon-warning cl-green"></i> 帮助</span>
            </el-tooltip>
            <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item><a href="/home">首页</a></el-breadcrumb-item>
              <el-breadcrumb-item v-if="allBase.catname">{{
                allBase.catname
              }}</el-breadcrumb-item>
              <el-breadcrumb-item
                ><a :href="'/' + allBase.dbename">{{
                  allBase.dbname
                }}</a></el-breadcrumb-item
              >
              <el-breadcrumb-item v-if="dataBase"
                ><span class="FontColor">{{
                  this.bianma ? dataBase.name : dataBase.qiye
                }}</span></el-breadcrumb-item
              >
            </el-breadcrumb>
          </div>
        </div>
      </div>

      <div class="main" style="padding-top: 50px">
        <div class="detail-box">
          <div class="yzx-detail-title" v-if="bianma">
            <div class="head">
              <span class="title">品种信息</span>
            </div>
            <div class="view">
              <table class="tb-f">
                <tr>
                  <td>首家申报企业</td>
                  <td>
                    {{ sjsb.qiyemingcheng || "/"
                    }}<span v-if="sjsb.chengbanriqi"
                      >（{{ sjsb.chengbanriqi }}）</span
                    >
                  </td>
                </tr>
                <tr>
                  <td>首家通过</td>
                  <td>
                    {{ sjtg.qiye || "/"
                    }}<span v-if="sjtg.enddate">（{{ sjtg.enddate }}）</span>
                  </td>
                </tr>
              </table>
            </div>
          </div>
          <div class="yzx-detail-title" v-else>
            <div class="head">
              <span class="title">企业信息</span>
            </div>
            <div class="view">
              <table class="tb-f">
                <tr>
                  <td>首次申报品种</td>
                  <td>
                    {{ sjsb.name || "/"
                    }}<span v-if="sjsb.chengbanriqi"
                      >（{{ sjsb.chengbanriqi }}）</span
                    >
                  </td>
                </tr>
                <tr>
                  <td>首次通过品种</td>
                  <td>
                    {{ sjtg.name || "/"
                    }}<span v-if="sjtg.enddate">（{{ sjtg.enddate }}）</span>
                  </td>
                </tr>
              </table>
            </div>
          </div>

          <div class="yzx-detail-title">
            <div class="head">
              <span class="title">一致性评价进度</span>
            </div>
            <div class="view">
              <div class="newtotals">
                <div
                  class="iconfont newtotals-btn newtotals-left"
                  @click="handleShowScrollLeft"
                >
                  &#xe64e;
                </div>
                <div
                  class="iconfont newtotals-btn newtotals-right"
                  @click="handleShowScrollRight"
                >
                  &#xe64f;
                </div>
                <div class="newtotals-scroll">
                  <ul class="view-item-wrap newtotals-scroll-inner">
                    <li class="view-item-box total-item">
                      <div
                        class="view-item"
                        @click="changeTb('yzx')"
                        :class="{ active: active_catalogue === 'yzx' }"
                      >
                        <div class="center num">{{ bycount.num_yzx }}</div>
                        <div class="center name">全部批文</div>
                      </div>
                    </li>
                    <li class="view-item-box total-item">
                      <div
                        class="view-item"
                        @click="changeTb('orangebei')"
                        :class="{ active: active_catalogue === 'orangebei' }"
                      >
                        <div class="center num">
                          {{ bycount.num_orangebei }}
                        </div>
                        <div class="center name">参比备案</div>
                      </div>
                    </li>
                    <li class="view-item-box total-item">
                      <div
                        class="view-item"
                        @click="changeTb('beian')"
                        :class="{ active: active_catalogue === 'beian' }"
                      >
                        <div class="center num">{{ bycount.num_beian }}</div>
                        <div class="center name">BE备案</div>
                      </div>
                    </li>
                    <li class="view-item-box total-item">
                      <div
                        class="view-item"
                        @click="changeTb('linchuangshiyan')"
                        :class="{
                          active: active_catalogue === 'linchuangshiyan'
                        }"
                      >
                        <div class="center num">
                          {{ bycount.num_linchuangshiyan }}
                        </div>
                        <div class="center name">申报BE试验</div>
                      </div>
                    </li>
                    <li class="view-item-box total-item">
                      <div
                        class="view-item"
                        @click="changeTb('zhuce')"
                        :class="{ active: active_catalogue === 'zhuce' }"
                      >
                        <div class="center num">{{ bycount.num_zhuce }}</div>
                        <div class="center name">申报一致性评价补充申请</div>
                      </div>
                    </li>
                    <li class="view-item-box total-item">
                      <div
                        class="view-item"
                        @click="changeTb('yzxtg')"
                        :class="{ active: active_catalogue === 'yzxtg' }"
                      >
                        <div class="center num">
                          {{ bycount.num_tg }}/{{ bycount.num_stt }}
                        </div>
                        <div class="center name">通过/视同通过</div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              <DetailYzx
                v-bind:isloading.sync="isloading"
                :bianma="bianma"
                :qiyebianmatz="qiyebianmatz"
                :tb="active_catalogue"
                v-if="active_catalogue == 'yzx'"
              />
              <DetailOrangebei
                v-bind:isloading.sync="isloading"
                :bianma="bianma"
                :qiyebianmatz="qiyebianmatz"
                :tb="active_catalogue"
                v-if="active_catalogue == 'orangebei'"
              />
              <DetailBeian
                v-bind:isloading.sync="isloading"
                :bianma="bianma"
                :qiyebianmatz="qiyebianmatz"
                :tb="active_catalogue"
                v-if="active_catalogue == 'beian'"
              />
              <DetailLinchuangshiyan
                v-bind:isloading.sync="isloading"
                :bianma="bianma"
                :qiyebianmatz="qiyebianmatz"
                :tb="active_catalogue"
                v-if="active_catalogue == 'linchuangshiyan'"
              />
              <DetailZhuce
                v-bind:isloading.sync="isloading"
                :bianma="bianma"
                :qiyebianmatz="qiyebianmatz"
                :tb="active_catalogue"
                v-if="active_catalogue == 'zhuce'"
              />
              <DetailYzxtg
                v-bind:isloading.sync="isloading"
                :bianma="bianma"
                :qiyebianmatz="qiyebianmatz"
                :tb="active_catalogue"
                v-if="active_catalogue == 'yzxtg'"
              />
            </div>
          </div>

          <!-- 参比制剂 -->
          <div class="yzx-detail-title" v-if="bianma">
            <div class="head">
              <span class="title">国家公示仿制药参比制剂</span>
            </div>
            <div class="view">
              <Detailrldlist :bianma="bianma" />
            </div>
          </div>

          <!-- 拓展信息 -->
          <div class="yzx-detail-title" v-if="extendList.length">
            <div class="head">
              <span class="title">拓展信息</span>
            </div>
            <div class="view">
              <div class="extend-list">
                <ExtendButton
                  v-for="(item, index) in extendList"
                  :key="index"
                  :item="item"
                ></ExtendButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import LoadingGif from "@/components/common/globalCom/loading-gif";
import DetailYzx from "./DetailYzx";
import DetailOrangebei from "./DetailOrangebei";
import DetailBeian from "./DetailBeian";
import DetailLinchuangshiyan from "./DetailLinchuangshiyan";
import DetailZhuce from "./DetailZhuce";
import DetailYzxtg from "./DetailYzxtg";
import Detailrldlist from "./Detailrldlist";
import ExtendButton from "@/components/common/extend-button";
import detailScrollMixins from "@/mixins/detailScroll.js";

export default {
  components: {
    LoadingGif,
    DetailYzx,
    DetailOrangebei,
    DetailBeian,
    DetailLinchuangshiyan,
    DetailZhuce,
    DetailYzxtg,
    Detailrldlist,
    ExtendButton
  },
  mixins: [detailScrollMixins],
  data() {
    return {
      bianma: "",
      name: "",
      qiyebianmatz: "",
      isloading: true,
      dataBase: {},
      bycount: {
        num_yzx: 0,
        num_orangebei: 0,
        num_beian: 0,
        num_linchuangshiyan: 0,
        num_zhuce: 0,
        num_tg: 0,
        num_stt: 0
      },
      active_catalogue: "yzx",
      sjsb: {},
      sjtg: {},
      extendList: [] // 扩展信息
    };
  },
  computed: {
    ...mapState({
      allBase: state => state.Yzx.allBase,
      helpInfo: state => state.Yzx.helpInfo,
      nopms: state => state.Yzx.nopms
    })
  },
  watch: {},
  methods: {
    initShowScroll() {
      let outterWidth = Number($(".newtotals").width());
      let num = 6;
      let maxNum = parseInt((outterWidth - 60) / 204);
      if (204 * num <= outterWidth) {
        $(".newtotals-left").hide();
        $(".newtotals-right").hide();
        $(".newtotals .total-item").css({
          width: 65 / num + "%"
        });
      } else {
        $(".newtotals-left").show();
        $(".newtotals-right").show();
        $(".newtotals-scroll").css({
          width: 204 * maxNum,
          margin: "auto"
        });
        $(".newtotals-scroll-inner").css({
          width: 220 * num
        });
        $(".newtotals .total-item").css({
          width: 190
        });
      }
    },
    handleShowScrollLeft() {
      let pointer = Number(
        _.replace($(".newtotals-scroll-inner").css("left"), "px", "")
      );
      if (pointer != 0 && pointer % 204 == 0) {
        $(".newtotals-scroll-inner").animate(
          {
            left: pointer + 204
          },
          300
        );
      }
    },
    handleShowScrollRight() {
      let outterWidth = Number($(".newtotals").width());
      let num = Number($(".newtotals .total-item").length);
      let maxNum = parseInt((outterWidth - 60) / 204);
      let pointer = Number(
        _.replace($(".newtotals-scroll-inner").css("left"), "px", "")
      );
      if (pointer != 204 * (maxNum - num) && pointer % 204 == 0) {
        $(".newtotals-scroll-inner").animate(
          {
            left: pointer - 204
          },
          300
        );
      }
    },
    changeTb(val) {
      this.active_catalogue = val;
    },
    getQuery() {
      let query = this.$route.query;
      this.bianma = query.bianma;
      this.name = query.name;
      this.qiyebianmatz = query.qiyebianmatz;
    },
    getRead() {
      window
        .Axios({
          method: "get",
          url: "/api/yzx/read",
          params: {
            name: this.name,
            tps: this.bianma ? "name" : "qiye",
            accesstoken: GETCOOKIEFUN("accesstoken")
          }
        })
        .then(res => {
          if (res.data.code === 200 && res.data) {
            let data = res.data.data;
            this.dataBase = data.base;
            this.getExtendList("yzx", data.extendList);
            if (data.sjsb) {
              this.sjsb = data.sjsb;
            }
            if (data.sjtg) {
              this.sjtg = data.sjtg;
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getBycount() {
      window
        .Axios({
          method: "get",
          url: "/api/yzx/bycount",
          params: {
            bianma: this.bianma,
            qiyebianmatz: this.qiyebianmatz,
            accesstoken: GETCOOKIEFUN("accesstoken")
          }
        })
        .then(res => {
          //this.isloading = false
          if (res.data.code === 200 && res.data) {
            let data = res.data.data;
            this.bycount = data;
            this.initShowScroll();
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  created() {
    Store.dispatch("Yzx/getBaseInfo");
    this.getQuery();
    this.getRead();
    this.getBycount();
    //this.initShowScroll()
    setTimeout(() => {
      const hashLocation = sessionStorage.getItem("hashLocation"); //缓存中获取当前页面的路由名称
      // 注意, 这里使用全路径匹配,在hash模式中,因为地址会携带#,所以页面报告中的url需要重新覆盖一下, 将#去除
      window._paq.push(["setCustomUrl", "https://" + hashLocation]); //覆盖页面报告的url，可以自定义页面url，加上本页面路由
      window._paq.push(["trackPageView", this.allBase.dbname]); //页面名称,可以自定义页面名称
      window._paq.push(["setDocumentTitle", this.allBase.dbname]);
    }, 1000);
  },
  mounted() {
    //this.initShowScroll()
  },
  updated() {
    //this.initShowScroll()
  }
};
</script>
<style lang="less" scoped>
@import "~@/assets/less/var.less";
@import "~@/assets/less/detailCom.less";

.detail-box {
  box-shadow: 0 0 5px #c4d3f8;
  background: #fff;
  margin-bottom: 20px;
}

.yzx-detail-title {
  width: 100%;
  padding: 20px 0 30px;

  .head {
    border-bottom: 1px solid #dfe5f1;
    padding: 0 40px;
    height: 26px;
    .title {
      color: #4877e8;
      font-size: 14px;
      border-bottom: 3px solid #4877e8;
      padding-bottom: 4px;
    }
  }
  .view {
    padding: 0 40px;
    margin-top: 30px;
    .extend-list {
      padding-bottom: 10px;
    }
  }
}
.tb-f {
  width: 100%;
}
.tb-f tr td {
  padding: 0 10px 0 18px;
  box-sizing: border-box;
  border: 1px solid #d7ddeb;
  line-height: 34px;
  height: 34px;
}
.tb-f tr td span {
  color: #999;
}
.tb-f tr td:nth-of-type(odd) {
  width: 9%;
  font-size: 12px;
  background: #f6f8fc;
}
.tb-f tr td:nth-of-type(2n) {
  background: #fdfdfd;
  width: 41%;
}
.view-item-wrap {
  margin: 0 -7px 0 -7px;
  height: 106px;
  width: 1600px;
  .view-item-box {
    float: left;
    width: 192px;
    padding: 0 7px;
    .active {
      position: relative;
      background: @PrimaryColor;
      .num,
      .name {
        color: #fff;
      }
      &:before {
        content: "";
        position: absolute;
        width: 20px;
        height: 20px;
        bottom: -3px;
        left: 50%;
        background: @PrimaryColor;
        margin-left: -10px;
        transform: rotate(45deg);
      }
    }
  }
}
.view-item {
  background: @BackgroundColor;
  padding: 16px 0;
  cursor: pointer;
  border-radius: 3px;
  transition: 0.2s;
  &:hover {
    background: @PrimaryColor;
    .num,
    .name {
      color: #fff;
    }
  }
  .center {
    text-align: center;
    font-size: 13px;
  }
  .num {
    font-size: 24px;
    color: @PrimaryColor;
  }
}
.newtotals {
  height: 109px;
  position: relative;
  overflow: hidden;
}
.newtotals-scroll-inner {
  width: 1800px;
  height: 100%;
  position: absolute;
  left: 0;
}
.newtotals-scroll {
  height: 100%;
  position: relative;
  overflow: hidden;
}

.newtotals-btn {
  position: absolute;
  top: 50%;
  margin-top: -19px;
  cursor: pointer;
  /*display: none;*/
}
.newtotals-left {
  left: 1px;
}
.newtotals-right {
  right: 1px;
}

.left-top {
  width: auto !important;
}
</style>
