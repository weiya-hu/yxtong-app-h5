<template>
  <div class="comprehensive-search">
    <custom-header></custom-header>
    <LoadingGif
      :className="'fullscreen-loading'"
      :loadFlag="listLoading"
    ></LoadingGif>
    <div class="search-result-panel" v-if="resultList.length > 0">
      <div class="search-title">"{{ $route.query.keywords }}"检索结果</div>
      <div class="result-list">
        <div
          class="result-item"
          v-for="(item, index) in resultList"
          :key="index"
        >
          <div v-if="item.list.length > 0">
            <router-link
              :to="{
                path: `/trz/${routers[item.type]}`,
                query: { keywords: $route.query.keywords }
              }"
              class="type"
              target="_blank"
              >{{ item.name }}</router-link
            >
            <div class="content">
              <router-link
                v-for="item2 in item.list"
                :key="item2.id"
                :to="{ path: `/trz/${routers[item.type]}/${item2.id}` }"
                class="lists"
                target="_blank"
              >
                <div
                  v-if="item2.title"
                  class="title"
                  v-html="highlightKeyword(item2.title)"
                ></div>
                <div class="date" v-if="item2.title && item2.time">
                  {{ item2.time }}
                </div>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="no-result" v-else>
      <NoData></NoData>
    </div>
  </div>
</template>

<script>
import CustomHeader from "@/components/layouts/trz/header";
import NoData from "@/components/common/trz/noData";
import LoadingGif from "@/components/common/globalCom/loading-gif";
export default {
  components: { CustomHeader, NoData, LoadingGif },
  data() {
    return {
      resultList: [],
      showResult: false,
      listLoading: false,
      routers: {
        tourongzi: "rongzi",
        binggou: "binggou",
        touzijigou: "jigou",
        qiye: "qiye",
        news: "news",
        kuajing: "kuajing"
      }
    };
  },
  mounted() {
    if (this.$route.query.keywords != undefined)
      // document.title = this.$route.query.keywords;
    this.handlerSearch();
  },
  watch: {
    $route(to) {
      if (to.path === "/trz/comprehensiveSearch") {
        if (this.$route.query.keywords != undefined)
          // document.title = this.$route.query.keywords;
        this.handlerSearch();
      }
    }
  },
  methods: {
    highlightKeyword(title) {
      function findAll(str, x) {
        var results = [];
        var len = str.length;
        var pos = 0;
        while (pos < len) {
          pos = str.indexOf(x, pos);
          if (pos === -1) break;
          results.push(pos);
          pos = pos + 1;
        }
        return results;
      }
      let text = "";
      function highlight(txt, value) {
        var found = findAll(txt, value);
        // 如果找到了关键词，则加入高亮显示
        if (found.length > 0) {
          for (var i = 0; i < txt.length; i++) {
            for (var j in found) {
              if (i == found[j]) {
                text = txt
                  .split(value)
                  .join(`<span style="color: #E7AF2F;">${value}</span>`);
              }
            }
          }
        } else {
          // 没有找到就用原本的title
          text = txt;
        }
      }
      highlight(title, this.$route.query.keywords);
      return text;
    },
    // 综合搜索结果页面
    async handlerSearch() {
      this.listLoading = true;
      await window
        .Axios({
          method: "get",
          url: "/api/tourongzi_search/index",
          params: {
            keyword: this.$route.query.keywords,
            accesstoken: GETCOOKIEFUN("accesstoken")
          }
        })
        .then(res => {
          if (res.data.code === 200 && res.data.data) {
            this.listLoading = false;
            let data = res.data.data;
            this.resultList = data;
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style lang="less" scoped>
.fullscreen-loading {
  background: rgba(255, 255, 255, 1);
}
.comprehensive-search {
  .search-result-panel {
    width: calc(100vw - 60px);
    min-height: calc(100vh - 128px);
    margin: 58px 10px 10px 10px;
    padding: 30px 20px;
    background: #ffffff;
    box-shadow: 0px 1px 10px 0px rgba(9, 20, 79, 0.19);
    border-radius: 4px;

    .search-title {
      height: 24px;
      line-height: 24px;
      font-size: 24px;
      font-weight: 600;
      color: #0d1a62;
      margin-bottom: 30px;
    }

    .result-list {
      display: flex;
      flex-direction: column;
      .result-item {
        font-size: 14px;
        font-weight: 400;
        color: #333333;
        line-height: 24px;
        display: inline-block;

        .type {
          height: 16px;
          line-height: 16px;
          font-size: 16px;
          font-weight: 600;
          color: #333333;
          display: flex;
          margin-bottom: 10px;
        }

        .content {
          padding: 10px 20px;
          width: 1200px;
          min-width: 1200px;
          background: #f6f8fc;
          border-radius: 4px;
          line-height: 24px;
          margin-bottom: 20px;

          .lists {
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: relative;
            text-decoration: none;
            &::before {
              content: " ";
              position: absolute;
              left: -10px;
              top: 10px;
              width: 5px;
              height: 5px;
              background: #182462;
              border-radius: 50%;
            }

            .title {
              color: #333;

              &:hover {
                text-decoration: underline;
              }
            }

            .date {
              min-width: 75px;
              color: #999999;
            }
          }
        }
      }
    }
  }

  .no-result {
    width: calc(100vw - 20px);
    margin: 58px 10px 10px 10px;
    min-height: calc(100vh - 68px);
    background: #ffffff;
    box-shadow: 0px 1px 10px 0px rgba(9, 20, 79, 0.19);
    border-radius: 4px;

    .trz-no-data {
      min-height: calc(100vh - 68px);
    }
  }
}
</style>
