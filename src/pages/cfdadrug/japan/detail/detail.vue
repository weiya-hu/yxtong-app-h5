<template>
  <div class="wrapper">
    <!-- 自定义加载界面 -->
    <LoadingGif :loadFlag="isLoading" v-if="isLoading"></LoadingGif>
    <!-- 加载完成显示部分 -->
    <div class="detail-list" v-else>
      <div class="detail-header">
        <div class="header-left">
          <div class="left-top">
            <span class="top-id" :title="jbxx.name">{{ jbxx.name }}</span>
            <!-- <span class="id-state">{{jbxx.Source}}</span> -->
          </div>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item><a href="/home">首页</a></el-breadcrumb-item>
            <el-breadcrumb-item
              ><a :href="'/' + allBase.dbename">{{
                allBase.dbname
              }}</a></el-breadcrumb-item
            >
            <el-breadcrumb-item>详情页</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </div>
      <div class="main">
        <slide-section :title="'基本信息'">
          <div class="tb-wrap">
            <table class="tb-t">
              <tr>
                <td>商品名称(日文)</td>
                <td>{{ jbxx.tname }}</td>
              </tr>
              <tr>
                <td>活性成分(日文)</td>
                <td>{{ jbxx.name }}</td>
              </tr>
              <tr>
                <td>活性成分(英文)</td>
                <td>{{ jbxx.jan }}</td>
              </tr>
              <tr>
                <td>活性成分(中文)</td>
                <td>{{ jbxx.cname }}</td>
              </tr>
              <tr>
                <td>批准号</td>
                <td>{{ jbxx.approvalnumber }}</td>
              </tr>
              <tr>
                <td>上市日期</td>
                <td>{{ jbxx.date }}</td>
              </tr>
              <tr>
                <td>日本商品分类号</td>
                <td>{{ jbxx.classificationcode }}</td>
              </tr>
              <tr>
                <td>药效分类</td>
                <td>{{ jbxx.producttypename }}</td>
              </tr>

              <tr>
                <td>ATC分类</td>
                <td>
                  <div
                    v-for="(item, index) in getAtcNames(jbxx.atc)"
                    :key="item"
                    class="clearfix"
                  >
                    <span>{{ item }}&nbsp;&nbsp;</span
                    ><span>{{ getAtc(item, jbxx.atcarr) }}</span>
                    <br v-if="index % 2 != 0" />
                  </div>
                </td>
              </tr>

              <tr>
                <td>制造商与经销商</td>
                <td>{{ jbxx.company }}</td>
              </tr>
              <tr>
                <td>剂型</td>
                <td>{{ jbxx.zwform ? jbxx.zwform : "" }}</td>
              </tr>
              <tr>
                <td>说明书</td>
                <td>
                  <a
                    v-if="jbxx.pdf_url"
                    class="cl-blue"
                    target="_blank"
                    :href="jbxx.pdf_url"
                    >查看</a
                  >
                </td>
              </tr>
              <tr>
                <td>用药指南</td>
                <td>
                  <a
                    v-if="jbxx.guide_url"
                    class="cl-blue"
                    target="_blank"
                    :href="jbxx.guide_url"
                    >查看</a
                  >
                </td>
              </tr>
              <tr>
                <td>if文件</td>
                <td style="padding-left: 50px">
                  <div v-if="jbxx.if_url" class="download-box">
                    <template v-if="jbxx.if_url.split(';').length == 1">
                      <a
                        v-for="(item, idx) in jbxx.if_url.split(';')"
                        :key="item"
                        v-if="item"
                        :href="item"
                        class="cl-blue attachment"
                        target="_blank"
                        style="width: 26px"
                      >
                        <i class="iconfont icon-xiazai"></i>
                      </a>
                    </template>
                    <template v-else>
                      <i class="iconfont cl-blue icon-xiazai"></i>
                      <div class="attachments">
                        <a
                          v-for="(item, index) in jbxx.if_url.split(';')"
                          :key="item"
                          v-if="item"
                          :href="item"
                          class="cl-blue attachment"
                          target="_blank"
                          >下载{{ index + 1 }}</a
                        >&nbsp;
                      </div>
                    </template>
                  </div>
                </td>
              </tr>
              <tr>
                <td>审查报告书</td>
                <td>
                  <div v-if="jbxx.review_url" class="download-box">
                    <i class="iconfont cl-blue icon-xiazai"></i>
                    <div class="attachments">
                      <template v-if="jbxx.review_url.split(';').length === 1">
                        <a
                          v-for="item in jbxx.review_url.split(';')"
                          :key="item"
                          v-if="item"
                          :href="item"
                          class="cl-blue attachment"
                          target="_blank"
                          >报告</a
                        >
                      </template>

                      <template v-else>
                        <a
                          v-for="(item, index) in jbxx.review_url.split(';')"
                          :key="item"
                          v-if="item"
                          :href="item"
                          class="cl-blue attachment"
                          target="_blank"
                          >报告{{ index + 1 }}</a
                        >
                      </template>

                      &nbsp;
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td>申请资料概要</td>
                <td>
                  <div v-if="jbxx.spc" class="download-box">
                    <i class="iconfont cl-blue icon-xiazai"></i>
                    <div class="attachments">
                      <a
                        v-for="(item, index) in jbxx.spc.split(';')"
                        :key="item"
                        v-if="item"
                        :href="item"
                        class="cl-blue attachment"
                        target="_blank"
                        >下载{{ index + 1 }}</a
                      >&nbsp;
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td>蓝皮书数据表</td>
                <td>
                  <div v-if="jbxx.blue_url" class="download-box">
                    <i class="iconfont cl-blue icon-xiazai"></i>
                    <div class="attachments">
                      <a
                        v-for="(item, index) in jbxx.blue_url.split(';')"
                        :key="item"
                        v-if="item"
                        :href="item"
                        class="cl-blue attachment"
                        target="_blank"
                        >下载{{ index + 1 }}</a
                      >&nbsp;
                    </div>
                  </div>
                </td>
              </tr>
            </table>
          </div>
        </slide-section>
        <!-- 扩展信息开始 -->
        <slide-section :title="'扩展信息'" v-if="hasExtend">
          <div class="extend-list">
            <ExtendButton
              v-for="(item, index) in extendList"
              :key="index"
              :item="item"
            ></ExtendButton>
          </div>
        </slide-section>
      </div>
      <la-footer></la-footer>
    </div>
  </div>
</template>

<script>
import LoadingGif from "@/components/common/globalCom/loading-gif";
import SlideSection from "@/components/common/slide-section";
import LaFooter from "@/components/layouts/footer";
import { mapState } from "vuex";
import ExtendButton from "@/components/common/extend-button";
import detailScrollMixins from "@/mixins/detailScroll.js";
export default {
  components: {
    SlideSection,
    LaFooter,
    ExtendButton,
    LoadingGif,
  },
  mixins: [detailScrollMixins],
  data() {
    return {
      hasExtend: false,
      isLoading: true,
    };
  },
  computed: {
    ...mapState({
      nopms: (state) => state.Pmda.nopms,
      allBase: (state) => state.Pmda.allBase,
      helpInfo: (state) => state.Pmda.helpInfo,
    }),
  },
  methods: {
    // 加载基本信息
    loadJbxx() {
      window
        .Axios({
          method: "get",
          url: "/api" + this.$route.path,
          params: {
            accesstoken: GETCOOKIEFUN("accesstoken"),
          },
        })
        .then((res) => {
          if (res.data.code == 200 && res.data.data) {
            this.jbxx = Object.assign({}, this.jbxx, res.data.data);
            this.removeLoading();
            this.getExtendList("pmda", res.data.data.extendList);
          }
        });
    },
    // 加载完后移除加载界面
    removeLoading() {
      this.isLoading = false;
    },

    // 获取atc的中文
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
    getAtcNames(name) {
      return name ? name.replace(/\s+/g, "").split(";") : [];
    },
  },
  created() {
    if (!this.nopms.xqy) {
      this.loadJbxx();
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
    Store.dispatch("Pmda/getBaseInfo");
  },
  activated() {
    this.vueRouteToNoPms(this.nopms.xqy);
  },
  updated() {
    this.vueRouteToNoPms(this.nopms.xqy);
    this.vueTogglePmsTooltip();
  },
};
</script>

<style lang="less" scoped>
@import "~@/assets/less/var.less";
@import "~@/assets/less/detailCom.less";

/deep/.slide-section {
  .tb-t,
  .tb-f {
    tr {
      td {
        box-sizing: border-box;
        height: 32px;
        border: 1px solid @BorderColorNew;
        font-size: 13px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #545b6d;
        line-height: 32px;
        padding: 0 0 0 50px !important;
        font-size: 13px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #545b6d;
        max-width: 30vw !important;
        &:nth-child(odd) {
          min-width: 180px !important;
          width: 230px !important;
          background: @DetailTableLeftColor;
        }
        &:nth-child(even) {
          max-width: 20vw !important;
          width: auto !important;
          min-width: auto !important;
          word-wrap: break-word;
          word-break: break-all;
          white-space: normal;
          background: @DetailTableRightColor;
          line-height: 23px;
        }
        &:nth-child(2n) {
          padding: 0 0 0 60px !important;
        }
      }
    }
  }
}
.wrapper .detail-list .detail-header .header-left .left-top {
  width: auto;
}
</style>
