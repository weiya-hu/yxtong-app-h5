<template>
  <div class="xw-container">
    <div class="xw-list" v-waiting="loading">
      <div v-for="(item, index) in list" :key="index" class="xw-item">
        <div class="xw-label">
          <p style="font-size: 13px; color: #5c6973">
            {{ timeFormat(item.sourcedate, "YYYY") }}
          </p>
          <p style="font-size: 14px; color: #333">
            {{ timeFormat(item.sourcedate, "MM月DD日") }}
          </p>
        </div>
        <div class="xw-content">
          <p class="xw-title">
            <a v-if="item.sourceurl" :href="item.sourceurl" target="_blank">{{
              item.title
            }}</a>
            <a v-else>{{ item.title }}</a>
            <span class="xw-tag" v-for="t in item.indication" :key="t">{{
              t
            }}</span>
          </p>
          <div class="xw-desc">
            <span>
              <i>药品：</i>
              <span>{{ item.drugname }}</span>
            </span>
            <span v-if="isEmpty(item.company)">
              <i>原研企业：</i>
              <template v-for="(comp, i) in item.company">
                <a
                  v-if="comp.have_info"
                  :key="i"
                  target="_blank"
                  :href="
                    `/globaldrugs/companyDetail?company_standard=` +
                    encodeURIComponent(comp.hash_name)
                  "
                  >{{ comp.name }}</a
                >
                <span :key="i" v-else>{{ comp.name }}</span>
              </template>
            </span>
            <span v-if="isEmpty(item.coo_company)">
              <i>合作企业：</i>
              <template v-for="(comp, i) in item.coo_company">
                <a
                  v-if="comp.have_info"
                  :key="i"
                  target="_blank"
                  :href="
                    `/globaldrugs/companyDetail?company_standard=` +
                    encodeURIComponent(comp.hash_name)
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
      class="paganation"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-size="10"
      layout="total, prev, next"  hide-on-single-page
      :total="total"
    >
    </el-pagination>
  </div>
</template>

<script>
import moment from "moment";
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
    drugname_standard: {
      default: "",
      type: String,
    },
    company_standard: {
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
    timeFormat(t, rule) {
      return moment.unix(t).format(rule);
    },
    handleCurrentChange(e) {
      console.log(e);
      this.getTypedNews(e);
    },
    getTypedNews(page = 1) {
      this.loading = true;
      // const { drugname_standard, company_standard } = this.$route.query;
      console.log(this.name, "list name");
      Axios({
        url: "/api/globaldrugs/drugNews",
        params: {
          drugname_standard: this.drugname_standard,
          company_standard: this.company_standard,
          leixing: this.name,
          coo_company: this.coo_company,
          page,
          pageSize: 10
        },
      })
        .then((res) => {
          if (res.data.code == 200 && this.isEmpty(res.data.data)) {
            this.list = res.data.data.res.list;
            this.page = res.data.data.res.page;
            this.total = res.data.data.res.count;
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
  mounted() {
    this.getTypedNews();
  },
};
</script>

<style scoped lang="less">
@import url(../table-style.less);
.xw-list {
  background-color: #fafbfd;
  padding: 10px;
  min-height: 300px;
  max-height: 500px;
  overflow: auto;
  .xw-item {
    display: flex;
    .xw-label {
      padding-right: 10px;
      text-align: right;
      border-right: 1px solid #ebeef5;
    }
    .xw-content {
      flex: 1;
      padding-left: 10px;
      padding-bottom: 20px;
      .xw-title {
        font-size: 16px;
        color: #333;
        font-weight: bold;
        margin-bottom: 10px;
        display: flex;
        a {
          color: #333;
          word-break: break-all;
          &:hover {
            color: #002fa7;
            text-decoration: none;
          }
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
        }
      }
      .xw-desc {
        font-size: 13px;
        font-style: normal;
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
.el-pagination.paganation {
  border: none;
}
</style>