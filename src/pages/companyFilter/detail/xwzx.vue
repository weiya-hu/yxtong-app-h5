<template>
  <div class="xw-container">
    <div class="xw-list" v-waiting="loading">
      <div v-for="(item, index) in list" :key="index" class="xw-item">
        <div class="xw-label">
          <p style="font-size: 13px; color: #5c6973">
            {{ item.sourcedate.substring(0, 5) }}
          </p>
          <p style="font-size: 16px; color: #333">
            {{ item.sourcedate.substring(5, 11) }}
          </p>
        </div>
        <div class="xw-content">
          <p class="xw-title">
            <a :href="item.sourceurl" target="_blank" v-if="item.sourceurl">{{
              item.title
            }}</a>
            <span v-else class="no-link">{{ item.title }}</span>
            <template v-if="item.indication">
              <span
                class="xw-tag"
                v-for="t in item.indication.split(';')"
                :key="t"
                >{{ t }}</span
              >
            </template>
            <template v-if="item.target">
              <span
                class="xw-tag"
                v-for="text in item.target.split(';')"
                :key="text"
                >{{ text }}</span
              >
            </template>
          </p>
          <div class="xw-desc">
            <span>
              <i>药品：</i>
              <a @click="goToDetail(item.hash_drugname, item.hash_company_standard)">{{ item.drugname }}</a>
            </span>
            <span>
              <i>原研企业：</i>
              <template v-for="(comp, i) in item.company">
                <a
                  v-if="comp.is_exist"
                  :key="i"
                  target="_blank"
                  :href="
                    `/globaldrugs/companyDetail?company_standard=` + encodeURIComponent(comp.hash_name)
                  "
                  >{{ comp.name }}</a
                >
                <span :key="i" v-else>{{ comp.name }}</span>
              </template>
            </span>
            <span v-if="item.coo_company">
              <i>合作企业：</i>
              <template v-for="(comp, i) in item.coo_company">
                <a
                  v-if="comp.is_exist"
                  :key="i"
                  target="_blank"
                  :href="
                    `/globaldrugs/companyDetail?company_standard=` + encodeURIComponent(comp.hash_name)
                  "
                  >{{ comp.name }}</a
                >
                <span :key="i" v-else>{{ comp.name }}</span>
              </template>
            </span>
            <span v-if="item.per_company">
              <i>许可单位：</i>
              <template v-for="(comp, i) in item.per_company">
                <a
                  v-if="comp.is_exist"
                  :key="i"
                  target="_blank"
                  :href="
                    `/globaldrugs/companyDetail?company_standard=` + encodeURIComponent(comp.hash_name)
                  "
                  >{{ comp.name }}</a
                >
                <span :key="i" v-else>{{ comp.name }}</span>
              </template>
            </span>
          </div>
        </div>
      </div>
    </div>
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-size="20"
      layout="total, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
  </div>
</template>

<script>
// 新闻列表 带分页 接口请求
export default {
  props: {
    name: {
      default: "default",
      type: String,
    },
    coo_company: {
      default: "",
      type: String,
    },
  },
  data() {
    return {
      page: 0,
      total: 0,
      list: [],
      loading: false,
    };
  },
  methods: {
    handleCurrentChange(e) {
      console.log(e);
      this.getTypedNews(e);
    },
    getTypedNews(page) {
      this.loading = true;
      Axios({
        url: "/api/company_filter/news",
        params: {
          id: this.$route.params.id,
          leixing: this.name,
          page: page
        },
      })
        .then((res) => {
          if (res.data.code == 200 && this.isEmpty(res.data.data)) {
            this.list = res.data.data.res;
            this.page = res.data.data.page;
            this.total = res.data.data.count;
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },

     // 药品详情
    goToDetail(drugname_standard,company_standard) {
      console.log(drugname_standard,company_standard);
      let routeData = this.$router.resolve({
        path: "/globaldrugs/detail?drugname_standard=" + encodeURIComponent(drugname_standard) + '&company_standard=' + encodeURIComponent(company_standard),
      });
      window.open(routeData.href, "_blank");
    },
  },
  mounted() {
    this.getTypedNews();
  },
};
</script>

<style scoped lang="less">
// @import url(../table-style.less);
.xw-list {
  background-color: #fafbfd;
  padding: 10px;
  height: calc(100vh - 390px);
  overflow: auto;
  .xw-item {
    display: flex;
    .xw-label {
      padding-right: 10px;
      text-align: right;
      border-right: 1px solid #ebeef5;
      width: 80px;
    }
    .xw-content {
      flex: 1;
      padding-left: 10px;
      padding-bottom: 20px;
      .xw-title {
        font-size: 16px;
        color: #333;
        font-weight: bold;
        margin-bottom: 8px;
        display: flex;
        a {
          color: #333;
          &:hover {
            color: #002fa7;
            text-decoration: none;
          }
        }
        .no-link {
          color: #333;
        }
        .xw-tag {
          color: #002fa7;
          padding: 4px 10px;
          font-size: 12px;
          line-height: 1;
          display: inline-block;
          border: 1px solid #002fa7;
          border-radius: 3px;
          margin-left: 10px;
          white-space: nowrap;
          align-self: flex-start;
          font-weight: normal;
        }
      }
      .xw-desc {
        font-size: 13px;
        font-style: normal;
        a{
          color: #333;

          &:hover {
            color: #002fa7;
            text-decoration: none;
          }
        }
        span {
          margin-right: 15px;
          color: #333;
          i {
            color: #9aa4b8;
            font-style: normal;
          }
        }
      }
    }
  }
}
</style>
