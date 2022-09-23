<template>
  <div class="trz-news">
    <THeader />
    <TContent>
      <LoadingGif
        :className="'fullscreen-loading'"
        :loadFlag="listLoading"
      ></LoadingGif>
      <!-- 左边部分 -->
      <div slot="left" style="position: relative">
        <!-- 普通搜索项 -->
        <template v-for="(item, index) in vueHandleInitPutong(nomal_filed)">
          <Normal
            vuex_name="TrzNews"
            api_name="tourongzi_news"
            :item="item"
            :key="index"
            ref="ileft"
          ></Normal>
        </template>

        <!-- 条件筛选 -->
        <Filters vuex_name="TrzNews" ref="newsFilter"></Filters>

        <!-- 搜索按钮 -->
        <el-button
          class="news-search-btn"
          type="primary"
          size="mini"
          round
          @click="nomalSearch"
          >搜索</el-button
        >
      </div>
      <div class="la-right">
        <div class="page-content">
          <div
            style="
              display: flex;
              justify-content: space-between;
              align-items: center;
            "
          >
            <h4 class="part-title">新闻动态</h4>
            <el-tooltip
              class="help-tip"
              effect="light"
              placement="bottom"
              v-if="helpUrl.remark ? helpUrl.remark : ''"
            >
              <div slot="content">
                <el-scrollbar>
                  <div
                    class="tip-content"
                    style="font-size: 13px"
                    v-html="helpUrl.remark ? helpUrl.remark : ''"
                  ></div>
                </el-scrollbar>
                <a
                  class="btn default"
                  v-if="helpUrl.url"
                  :href="helpUrl.url"
                  target="_blank"
                  >帮助中心</a
                >
              </div>
              <span><i class="el-icon-warning cl-green pr5"></i>帮助</span>
            </el-tooltip>
          </div>
          <div class="part-main">
            <div class="part-left">
              <!-- 已选条件 -->
              <Optioned vuex_name="TrzNews"></Optioned>
              <div class="left-main">
                <!-- 新闻列表 -->
                <div
                  class="left-lists"
                  :style="{ 'min-height': newsMinHeight }"
                  v-if="res.length > 0"
                >
                  <news-item
                    v-for="(item, index) in res"
                    :key="index"
                    :item="item"
                  >
                  </news-item>
                </div>
                <NoData
                  v-else
                  :style="{ 'min-height': newsMinHeight }"
                ></NoData>
                <div class="left-paganation">
                  <el-pagination
                    @current-change="handleCurrentChange"
                    :current-page="param.page"
                    :page-size="param.pageSize"
                    layout="total, prev, pager, next, jumper"
                    :total="Number(extendCount)"
                  >
                  </el-pagination>
                </div>
              </div>
            </div>
            <div class="part-right">
              <div style="position: fixed;">
                <!-- 热点新闻 -->
                <div class="part-right-sider">
                  <div class="sider-title">
                    <img
                      class="title-ico"
                      style="width: 12px; height: 16px"
                      src="@/assets/imgs/hot.png"
                      alt=""
                    />
                    <span class="bold">热点新闻</span>
                  </div>
                  <div class="sider-list">
                    <div
                      class="sider-list-item"
                      v-for="(item, index) in hotNews"
                      :key="item.id"
                    >
                      <span class="num">{{ index + 1 }}</span>
                      <router-link
                        class="link"
                        :to="'/trz/news/' + item.data_id"
                        :title="item.title"
                        target="_blank"
                        >{{ item.title }}</router-link
                      >
                    </div>
                  </div>
                </div>
                <!-- 新闻热搜榜 -->
                <div class="part-right-sider">
                  <div class="sider-title">
                    <img
                      class="title-ico"
                      style="width: 14px; height: 14px"
                      src="@/assets/imgs/rank.png"
                      alt=""
                    />
                    <span class="bold">新闻热搜榜</span>
                  </div>
                  <div class="sider-list">
                    <div
                      class="sider-list-item"
                      v-for="(item, index) in hotSearch"
                      :key="item.id"
                    >
                      <span class="num">{{ index + 1 }}</span>
                      <span class="link" @click="toNewsList(item.label)">{{
                        item.label
                      }}</span>
                      <span class="count">{{ item.doc_count }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TContent>
  </div>
</template>
<script>
import { mapState } from "vuex";
import THeader from "@/components/layouts/trz/header";
import TContent from "@/components/layouts/main";
import NewsItem from "./comp/news-item";
import Normal from "@/components/common/trz/normal";
import Filters from "@/components/common/trz/filters";
import Optioned from "@/components/common/trz/options";
import NoData from "@/components/common/trz/noData";
import LoadingGif from "@/components/common/globalCom/loading-gif";
export default {
  components: {
    THeader,
    TContent,
    NewsItem,
    Normal,
    Filters,
    Optioned,
    NoData,
    LoadingGif,
  },
  data() {
    return {
      hotNews: [],
      hotSearch: [],
      newsMinHeight: "calc(100vh - 148px)",
      helpUrl: {}
    };
  },
  computed: {
    ...mapState({
      nomal_filed: (state) => state.TrzNews.nomal_filed,
      putong: (state) => state.TrzNews.putong,
      shaixuan: (state) => state.TrzNews.shaixuan,
      res: (state) =>
        _.keys(state.TrzNews.res).length ? state.TrzNews.res : [],
      extendCount: (state) => state.TrzNews.extendCount,
      param: (state) => state.TrzNews.param, // 附加参数(存于vuex内)
      listLoading: (state) => state.TrzNews.listLoading,
    }),
  },
  watch: {
    putong: {
      deep: true, //深度监听设置为 true
      handler(newV) {
        this.$nextTick(() => {
          setTimeout(() => {
            let h = $(".la-optioned").outerHeight();
            let h2 = `calc(100vh - ${148 + h}px)`;
            this.newsMinHeight = h2;
          }, 500);
        });
      },
    },
    shaixuan: {
      deep: true, //深度监听设置为 true
      handler(newV) {
        this.$nextTick(() => {
          setTimeout(() => {
            let h = $(".la-optioned").outerHeight();
            let h2 = `calc(100vh - ${148 + h}px)`;
            this.newsMinHeight = h2;
          }, 500);
        });
      },
    },
    res: {
      deep: true, //深度监听设置为 true
      handler(newV) {
        this.$nextTick(() => {
          setTimeout(() => {
            let h = $(".la-optioned").outerHeight();
            let h2 = `calc(100vh - ${148 + h}px)`;
            this.newsMinHeight = h2;
          }, 500);
        });
      },
    },
  },
  mounted() {
    // Store.dispatch("TrzRongzi/getBaseInfo").then(() => {
    //   this.vueTogglePmsTooltip()
    // })
    this.vueRouteFromTrz("TrzNews");
    this.getHelpUrl()
    this.getHotNews();
    this.getHotSearch();
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
            this.helpUrl = res.data.data;
          }
        });
    },
    // 获取热点新闻
    getHotNews() {
      window
        .Axios({
          method: "get",
          url: "/api/tourongzi_news",
          params: {
            action: "hotNews",
            accesstoken: GETCOOKIEFUN("accesstoken"),
          },
        })
        .then((res) => {
          this.loading = false;
          if (res.data.code === 200 && res.data.data) {
            let data = res.data.data;
            this.hotNews = data;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    // 获取热搜榜
    getHotSearch() {
      window
        .Axios({
          method: "get",
          url: "/api/tourongzi_news",
          params: {
            action: "hotSearch",
            accesstoken: GETCOOKIEFUN("accesstoken"),
          },
        })
        .then((res) => {
          this.loading = false;
          if (res.data.code === 200 && res.data.data) {
            let data = res.data.data;
            this.hotSearch = data;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    toNewsList(val) {
      this.$router.push({
        path: `/trz/news`,
        query: {
          keywords: val,
        },
      });
      this.$router.go(0);
    },
    nomalSearch() {
      this.$refs.newsFilter.searchFilter();
      Store.dispatch("TrzNews/nomalSearch");
    },
    handleCurrentChange(val) {
      this.param.page = val;
      Store.dispatch("TrzNews/nomalSearch", { params: this.param });
    },
  },
};
</script>

<style lang="less" scoped>
@import "../../../assets/less/trz-paganation.less";
@shadow: 0px 1px 10px 0px rgba(9, 20, 79, 0.19);
/deep/ .la-main .side-fold {
  width: 10px;
  top: 50%;
  background: #b5c3d3;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
}
/deep/ .la-main.fold-left-side .side-fold {
  background: #b5c3d3 !important;
}
/deep/ .la-main .side-fold .arrow-right,
/deep/ .la-main .side-fold .arrow-left {
  margin-left: 2px;
}

.trz-news {
  height: 100%;
  min-width: 1280px;
  background: #f5f8fc;
  padding-top: 48px;
}
.news-search-btn {
  width: 80px;
  height: 28px;
  line-height: 28px;
  text-align: center;
  background: #3556b9;
  border-radius: 4px;
  font-size: 14px;
  color: #ffffff;
  padding: 0;
  margin: 15px 0 0 10px;
}
.la-right {
  background-color: #f5f8fc;
}
.page-content {
  position: relative;
  .part-title {
    font-size: 18px;
    font-weight: bold;
    color: #333;
    padding: 10px;
    line-height: 1;
  }
  .part-main {
    display: flex;
    .part-left {
      flex: 1;
      width: 70%;
      display: inline-block;
      min-width: 720px;
      box-shadow: @shadow;
      border-radius: 4px;
      background-color: #fff;
      align-self: flex-start;
    }
    .part-right {
      width: 300px;
      margin-left: 10px;
      display: inline-block;
      background: #f5f8fc;
    }
  }
  .part-right-sider {
    margin-bottom: 10px;
    box-shadow: @shadow;
    border-radius: 4px;
    background-color: #fff;
  }
  .sider-title {
    height: 36px;
    background: #f5f8fc;
    border-radius: 4px 4px 0px 0px;
    line-height: 36px;
    padding: 0 20px;
    display: flex;
    align-items: center;
    .bold {
      font-size: 14px;
      color: #0d1a62;
      font-weight: 600;
      margin-left: 6px;
    }
  }
  .sider-list {
    padding: 10px 0 1px;
    .sider-list-item {
      padding: 0 20px;
      margin-bottom: 10px;
      width: 300px;
      font-size: 13px;
      display: flex;
      box-sizing: border-box;
      .num {
        width: 20px;
        display: inline-block;
      }
      .count {
        min-width: 20px;
        margin-left: 6px;
        text-align: right;
      }
      .link {
        // width: 200px;
        flex: 1;
        color: #666;
        overflow: hidden;
        text-overflow: ellipsis;
        box-sizing: border-box;
        white-space: nowrap;
        cursor: pointer;
        &:hover {
          text-decoration: none;
          color: #e7af2f !important;
        }
      }
      &:nth-child(1) {
        .num {
          color: #e48724;
        }
        .link {
          color: #333;
        }
      }
      &:nth-child(2) {
        .num {
          color: #f7c523;
        }
        .link {
          color: #333;
        }
      }
      &:nth-child(3) {
        .num {
          color: #e4d244;
        }
        .link {
          color: #333;
        }
      }
    }
  }
  .tags {
    display: flex;
    .tag {
      margin-right: 20px;
    }
  }
  .tags-clear {
    display: flex;
    align-items: center;
    cursor: pointer;
    user-select: none;
    > img {
      margin-right: 5px;
    }
    :hover {
      color: #3556b9;
    }
  }
}
</style>
