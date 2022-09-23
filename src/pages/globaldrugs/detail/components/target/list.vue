<template>
  <div class="xw-container">
    <div class="xw-list" v-waiting="loading">
      <div v-for="(item, index) in list" :key="index" class="xw-item">
        <div class="xw-label">
          <p style="font-size: 13px; color: #5c6973">{{ handlerYear(item.sourcedate) }}</p>
          <p style="font-size: 14px; color: #333">{{ handlerDate(item.sourcedate) }}</p>
        </div>
        <div class="xw-content">
          <p class="xw-title">
            <a v-if="item.sourceurl" target="_blank" :href="item.sourceurl">{{ item.title }}</a>
            <span v-else>{{ item.title }}</span>
            <span class="xw-tag" v-for="t in item.indication" :key="t">{{ t }}</span>
            <span class="xw-tag" v-for="t in item.target" :key="t.hash_name">{{ t.name }}</span>
          </p>
          <div class="xw-desc">
            <span>
              <i>药品：</i>
              <span v-if="item.hash_drugname" class="link"
                @click="linkDrugDetail(item.hash_drugname, item.hash_company)">
                {{ item.drugname }}
              </span>
              <span v-else>
                {{ item.drugname }}
              </span>
            </span>
            <span>
              <i>原研企业：</i>
              <template v-for="(comp, i) in item.company">
                <span v-if="comp.have_info" class="link" :key="i" @click="linkCompanyDetail(comp.hash_name)">{{
                    comp.name
                }}
                </span>
                <span :key="i" v-else>{{ comp.name }}</span>
              </template>
            </span>
            <span v-if="isEmpty(item.coo_company)">
              <i>合作企业：</i>
              <template v-for="(comp, i) in item.coo_company">
                <span v-if="comp.have_info" class="link" :key="i" @click="linkCompanyDetail(comp.hash_name)">{{
                    comp.name
                }}
                </span>
                <span :key="i" v-else>{{ comp.name }}</span>
              </template>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Moment from "moment"
// 新闻列表 带分页 接口请求
export default {
  props: {
    base: {
      default: () => ({}),
      type: Object,
    },
    name: {
      default: "default",
      type: String,
    },
    coo_company: {
      default: '',
      type: String,
    },
    treeData: {
      type: Object
    }
  },
  data() {
    return {
      page: 0,
      total: 0,
      list: [],
      loading: false
    };
  },
  watch: {
    treeData: {
      handler(val) {
        this.list = this.treeData.list;
        this.page = this.treeData.page;
        this.total = this.treeData.count;
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    linkDrugDetail(drugname_standard, company_standard) {
      window.ga("send", "event", "button", "click",
        "企业版_全球药物_靶点详情_新闻资讯_跳转到药品详情页");
      window._paq.push([
        "trackEvent",
        "button",
        "click",
        "企业版_全球药物_靶点详情_新闻资讯_跳转到药品详情页"
      ]);
      const { href } = this.$router.resolve({
        path: '/globaldrugs/detail',
        query: {
          drugname_standard,
          company_standard
        }
      })
      window.open(href, "_blank")
    },
    linkCompanyDetail(company_standard) {
      window.ga("send", "event", "button", "click",
        "企业版_全球药物_靶点详情_新闻资讯_跳转到企业管线详情页");
      window._paq.push([
        "trackEvent",
        "button",
        "click",
        "企业版_全球药物_靶点详情_新闻资讯_跳转到企业管线详情页"
      ]);
      const { href } = this.$router.resolve({
        path: '/globaldrugs/companyDetail',
        query: {
          company_standard
        }
      })
      window.open(href, "_blank")
    },
    handlerYear(sourcedate) {
      return Moment.unix(sourcedate).format('YYYY')
    },
    handlerDate(sourcedate) {
      return Moment.unix(sourcedate).format('MM月DD日')
    },
    handleCurrentChange(e) {
      this.getTypedNews(e)
    },
    getTypedNews(page) {
      this.loading = true;
      Axios({
        url: "/api/globaldrugs/targetNews",
        params: {
          target: (this.base.targets_abbr ? this.base.targets_abbr : this.base.targets),
          leixing: this.name,
        },
      })
        .then((res) => {
          if (res.data.code == 200 && this.isEmpty(res.data.data)) {
          }
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }
};
</script>

<style scoped lang="less">
@import url(../table-style.less);

.xw-list {
  background-color: #fafbfd;
  padding: 10px;
  min-height: 300px;

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

          &:hover {
            color: #002fa7;
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

  .link {
    color: #002fa7;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>