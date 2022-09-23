<template>
  <div class="la-list">
    <!-- 自定义加载界面 -->
    <LoadingGif
      :className="'db-index-loading'"
      :loadFlag="listLoading"
      v-if="listLoading"
    ></LoadingGif>
    <!-- 加载完成显示部分 -->
    <div class="not-loading" v-else>
      <template v-if="res1 && !res1.length">
        <!-- 问题反馈弹出框 -->
        <el-dialog
          :visible.sync="dialogFeedbackShow"
          :modal-append-to-body="false"
          width="820px"
        >
          <div slot="title" class="dialog-header">问题反馈</div>
          <DialogFeedback @closeDialog="closeDialogFeedback"></DialogFeedback>
        </el-dialog>
        <div class="no-data-msg">
          <img src="/static/imgs/nodata/db-nodata.png" />
          <div class="msg">
            <p>对不起，小智已经很努力了，但没有找到对应数据。</p>
            <p>
              换个关键词试试，或
              <a class="link-blue" @click="showFeedback()">反馈</a> 给我们
            </p>
          </div>
        </div>
      </template>

      <!-- 重构 -->
      <template v-else>
        <div class="docs-list">
          <div class="doc" v-for="(oneDoc, idx) in res1" :key="idx">
            <div class="handle-btns">
              <span
                v-if="oneDoc.down"
                class="btn download"
                @click="handleDocDownload(oneDoc.down)"
                ><i class="iconfont">&#xe62c;</i>下载(原文)</span
              >
              <span
                v-if="oneDoc.down1"
                class="btn download"
                @click="handleDocDownload(oneDoc.down1)"
                ><i class="iconfont">&#xe62c;</i>下载(中文)</span
              >
              <!-- <span class="btn collect"><i class="iconfont">&#xe65a;</i>收藏</span> -->
            </div>
            <div class="head">
              <div
                class="head-msg"
                :title="
                  oneDoc.typezh
                    ? oneDoc.type + '(' + oneDoc.typezh + ')'
                    : oneDoc.type
                "
              >
                <!-- <span class="type" v-if="oneDoc.tb">{{oneDoc.tb == 1 ? 'EMA' : 'FDA'}}</span> -->
                <router-link
                  :to="{ path: '/doc/' + oneDoc.id, query: { tb: oneDoc.tb } }"
                  class="name"
                  target="_blank"
                  >{{ oneDoc.type }}
                  <span v-if="oneDoc.typezh"
                    >({{ oneDoc.typezh }})</span
                  ></router-link
                >
              </div>
              <div class="head-sub">
                <template v-if="oneDoc.tb == 3">
                  <span class="name-cname" v-if="oneDoc.name"
                    ><i class="iconfont">&#xe650;</i>药品名称：{{
                      oneDoc.name
                    }}</span
                  >
                </template>
                <template v-else>
                  <span class="name-cname" v-if="oneDoc.name && oneDoc.cname"
                    ><i class="iconfont">&#xe650;</i>药品名称：{{
                      oneDoc.name
                    }}[{{ oneDoc.cname }}]</span
                  >
                </template>
                <span class="sponsor" v-if="oneDoc.sponsor"
                  ><i class="iconfont">&#xe651;</i>申请方：{{
                    oneDoc.sponsor
                  }}</span
                >
                <span class="date" v-if="oneDoc.date"
                  ><i class="iconfont">&#xe675;</i>发布日期：{{
                    oneDoc.date
                  }}</span
                >
              </div>
            </div>
            <div class="main-con">
              <router-link
                :to="{ path: '/doc/' + oneDoc.id, query: { tb: oneDoc.tb } }"
                class="content"
                v-html="oneDoc.txt"
                target="_blank"
              ></router-link>
            </div>
            <div class="list-bottom">
              <span class="type" v-if="oneDoc.tb">{{
                oneDoc.tb | tbFilter
              }}</span>
              <span
                class="type"
                v-if="oneDoc.tag"
                v-for="(tag, idxt) in getTagsArr(oneDoc.tag)"
                :key="idxt"
                >{{ tag }}</span
              >
              <router-link
                :to="{ path: '/doc/' + oneDoc.id, query: { tb: oneDoc.tb } }"
                class="kw-more"
                v-if="oneDoc.num"
                target="_blank"
              >
                相同关键词还有其它<span class="much">{{ oneDoc.num }}</span
                >处定位<span class="arrows">&gt;&gt;</span>
              </router-link>
            </div>
            <!-- <div class="head-tags">
              <span class="tag" v-for="(tag, idxt) in getTagsArr(oneDoc.tag)" :key="idxt">{{tag}}</span>
              <router-link :to="{path: '/doc/' + oneDoc.id, query: {tb: oneDoc.tb}}" class="kw-more" v-if="oneDoc.num" target="_blank">
              相同关键词还有其它{{oneDoc.num}}处定位<span class="arrows">&gt;&gt;</span>
              </router-link>
            </div> -->
          </div>
        </div>
        <!-- 分页栏 -->
        <el-pagination
          v-if="extendCount"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="param.page"
          :page-size="param.pageSize"
          layout="total, sizes, prev, pager, next"
          :total="extendCount"
          :disabled="nopms.fy"
          :class="{ 'abandon-click-method': nopms.fy }"
        >
        </el-pagination>
        <span class="out-of-page cl-red">限于内容篇幅，部分结果未予显示</span>
      </template>
    </div>
  </div>
</template>

<script>
import LoadingGif from "@/components/common/globalCom/loading-gif";
import DialogFeedback from "@/components/common/dialog-feedback";
import { mapState } from "vuex";
export default {
  components: {
    LoadingGif,
    DialogFeedback,
  },
  data() {
    return {
      dialogFeedbackShow: false,
    };
  },
  computed: {
    ...mapState({
      nopms: (state) => state.Doc.nopms,
      param: (state) => state.Doc.param,
      extendCount: (state) => state.Doc.extendCount,
      listLoading: (state) => state.Doc.listLoading,
      res1: (state) => (_.keys(state.Doc.res1).length ? state.Doc.res1 : []),
      allBase: (state) => state.Doc.allBase,
    }),
  },
  methods: {
    downlinkZhHanlder(downlink) {},
    closeDialogFeedback() {
      this.dialogFeedbackShow = false;
    },
    showFeedback() {
      this.dialogFeedbackShow = true;
    },
    handleCurrentChange(val) {
      this.param.page = val;
      if (val * this.param.pageSize <= 1500) {
        $(".out-of-page").hide();
        Store.dispatch("Doc/nomalSearch", { params: this.param });
      } else {
        $(".out-of-page").show();
      }
    },
    handleSizeChange(val) {
      this.param.page = 1;
      this.param.pageSize = val;
      if (val * this.param.page <= 1500) {
        $(".out-of-page").hide();
        Store.dispatch("Doc/nomalSearch", { params: this.param });
      } else {
        $(".out-of-page").show();
      }
    },
    picLoadError(ev) {
      // 图片加载失败，切换为默认图
      ev.target.src = "/static/imgs/Doc/icon_nothing.jpg";
    },
    getTagsArr(tagStr) {
      let arr = String(tagStr).split(";;");
      return arr;
    },
    handleDocDownload(downloadLink) {
      window.open(downloadLink);
    },
  },
  filters: {
    // 给数字每三位数加一个逗号
    formatNumber(val) {
      val = parseInt(val);
      return val.toString().replace(/(\d)(?=(\d{3})+$)/g, "$1,");
    },
    //标题长度超过12个字用省略号表示
    formaTitle(title) {
      if (title.length > 12) {
        return title.substr(0, 12) + "...";
      } else {
        return title;
      }
    },
    tbFilter(type) {
      let types = ["EMA", "FDA", "CDE", "PMDA"];
      return types[type - 1];
    },
  },
  created() {
    // this.handleAxios()
    // this.loadListData()
    setTimeout(() => {
      const hashLocation = sessionStorage.getItem("hashLocation"); //缓存中获取当前页面的路由名称
      // 注意, 这里使用全路径匹配,在hash模式中,因为地址会携带#,所以页面报告中的url需要重新覆盖一下, 将#去除
      window._paq.push(["setCustomUrl", "https://" + hashLocation]); //覆盖页面报告的url，可以自定义页面url，加上本页面路由
      window._paq.push(["trackPageView", this.allBase.dbname]); //页面名称,可以自定义页面名称
      window._paq.push(["setDocumentTitle", this.allBase.dbname]);
    }, 1000);
  },
  mounted() {},
  updated() {
    if (this.param.pageSize * this.param.page <= 1500) {
      $(".out-of-page").hide();
    } else {
      $(".out-of-page").show();
    }
    this.vueTogglePmsTooltip();
  },
};
</script>

<style lang="less" scoped>
@import "~@/assets/less/var.less";

.la-list {
  .not-loading {
    // padding: 10px 0px 30px 0px;
    .docs-list {
      box-sizing: border-box;
      width: 100%;
      padding: 0px 10px 0 14px;
      .doc {
        position: relative;
        transition: all 300ms;
        // width: calc(100% - 48px);
        box-shadow: @BoxShadow;
        margin: 10px 0;
        padding: 10px;
        &:hover {
          transition: all 300ms;
          box-shadow: @BoxShadowHover;
          .handle-btns {
            display: block;
          }
        }
        .handle-btns {
          display: none;
          position: absolute;
          top: 20px;
          right: 30px;
          .btn {
            transition: all 100ms;
            display: inline-block;
            font-size: 14px;
            cursor: pointer;
            &:hover {
              transition: all 100ms;
              color: @PrimaryColor;
            }
          }
          .download {
            margin-right: 6px;
          }
          // .collect {

          // }
        }
        .head {
          .head-msg {
            // height:20px;
            // line-height:20px;
            padding-right: 180px;
            margin-bottom: 10px;
            // .type {
            //   display: inline-block;
            //   height: 20px;
            //   line-height: 20px;
            //   border: 1px solid #dfe5f1;
            //   background-color: #f6f8fc;
            //   border-radius: 11px;
            //   padding: 0px 16px;
            //   margin-right: 4px;
            // }
            .name {
              font-size: 18px;
              color: @PrimaryColor;
              margin-right: 30px;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              line-height: 20px;
              // text-decoration: none;
            }
          }
          .head-sub {
            height: 15px;
            line-height: 15px;
            color: #35384a;
            font-size: 13px;
            margin-bottom: 10px;
            .name-cname {
              margin-right: 20px;
              i {
                color: #4877e8;
              }
            }
            .sponsor {
              margin-right: 20px;
              i {
                color: #4877e8;
                font-size: 15px;
              }
            }
            .date {
              i {
                color: #4877e8;
                font-size: 15px;
              }
            }
          }

          // .head-tags {
          //   margin-bottom: 15px;
          //   .tag {
          //     display: inline-block;
          //     height: 20px;
          //     line-height: 20px;
          //     color: @PrimaryColor;
          //     border: 1px solid @PrimaryColor;
          //     border-radius: 11px;
          //     transition: all 100ms;
          //     padding: 0px 10px;
          //     margin-right: 5px;
          //     &:hover {
          //       transition: all 100ms;
          //       color: #fff;
          //       background-color: @PrimaryColor;
          //     }
          //   }
          // }
        }
        .main-con {
          max-height: 72px;
          line-height: 24px;
          overflow: hidden;
          &:before {
            float: left;
            width: 5px;
            content: "";
            height: 72px;
          }
          &:after {
            float: right;
            content: "...";
            height: 24px;
            line-height: 24px;
            width: 3em;
            margin-left: -3em;
            position: relative;
            left: 100%;
            top: -26px;
            padding-right: 5px;
            background-color: #fff;
          }
          .content {
            float: right;
            margin-left: -5px;
            width: 100%;
            font-size: 12px;
            text-align: justify;
          }
        }
        .list-bottom {
          position: relative;
          .type {
            display: inline-block;
            height: 20px;
            line-height: 20px;
            border: 1px solid #4877e8;
            border-radius: 11px;
            padding: 0px 16px;
            color: #4877e8;
            margin: 10px 4px 0 0;
          }
          .kw-more {
            display: inline-block;
            margin-top: 10px;
            font-size: 13px;
            text-decoration: none;
            position: absolute;
            right: 10px;
            .much {
              color: #4877e8;
            }
            .keyword {
              color: #f77d55;
            }
            .arrows {
              transition: all 300ms;
            }
            &:hover {
              font-weight: bold;
              .arrows {
                transition: all 300ms;
                display: inline-block;
                margin-left: 6px;
                letter-spacing: 6px;
              }
            }
          }
        }
      }
    }
  }
}
@media screen and (max-width: 1920px) {
}
</style>
