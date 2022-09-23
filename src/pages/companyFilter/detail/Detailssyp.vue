<template>
  <div class="companyfilter-ssyp">
    <div class="content-title">
      上市药品
      <!-- <el-tooltip
        class="desc"
        effect="light"
        content="企业报告功能复用，关联方式有调整。位置：企业报告-知识产权-生产认证"
        placement="top-start"
      >
        <span class="section-ico-qa"></span>
      </el-tooltip> -->
    </div>
    <div class="ssyp" v-waiting="ssyp_loading">
      <div v-if="tabs.length">
        <div class="ssyp-title">国内上市药品</div>
        <el-tabs
          class="inner-cards"
          @tab-click="handleClickTag"
          ref="tabs"
          v-model="activeName"
        >
          <el-tab-pane v-for="item in tabs" :key="item.key" :name="item.key">
            <span slot="label">
              {{ item.name }}
              <span style="color: #9aa4b8"> ({{ item.doc_count }}) </span>
            </span>
            <div class="table-detail-container" v-waiting="tableloading">
              <div class="yp-table flex1">
                <el-table
                  :data="datas"
                  ref="yptable"
                  @row-click="rowClick"
                  style="
                    width: 100%;
                    height: 100%;
                    border-left: 1px solid #ebeef5;
                  "
                >
                  <el-table-column
                    width="120"
                    label="时间"
                    prop="authorizationday"
                  >
                    <template slot-scope="{ row }">
                      <div :title="row.authorizationday">
                        {{ row.authorizationday || "-" }}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="药品名称" prop="name">
                    <template slot-scope="{ row }">
                      <div :title="row.name">
                        {{ row.name || "-" }}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="药品类型" prop="type">
                    <template slot-scope="{ row }">
                      <div :title="row.type">
                        {{ row.type || "-" }}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="治疗领域" prop="atc">
                    <template slot-scope="{ row }">
                      <div :title="row.atc">
                        {{ row.atc || "-" }}
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <div class="yp-desc flex1">
                <div style="height: 36px; background: #ebeef580"></div>
                <div class="yp-desc-content">
                  <div class="item">
                    <span class="item-label">药品详情：</span>
                    <span
                      class="item-content"
                      style="font-size: 14px; font-weight: bold"
                      >{{ drug_base.name }}</span
                    >
                  </div>
                  <div class="item" v-if="drug_base.pizhunwenhao">
                    <span class="item-label">批准文号：</span>
                    <span class="item-content">{{
                      drug_base.pizhunwenhao
                    }}</span>
                  </div>
                  <div class="item" v-if="drug_base.englishname">
                    <span class="item-label">产品名称（英文）：</span>
                    <span class="item-content">{{
                      drug_base.englishname
                    }}</span>
                  </div>
                  <div class="item" v-if="drug_base.brandname">
                    <span class="item-label">商品名：</span>
                    <span class="item-content">{{ drug_base.brandname }}</span>
                  </div>
                  <div class="item" v-if="drug_base.shengchanqiye">
                    <span class="item-label">生产单位：</span>
                    <span class="item-content">{{
                      drug_base.shengchanqiye
                    }}</span>
                  </div>
                  <div class="item" v-if="drug_base.guige">
                    <span class="item-label">规格：</span>
                    <span class="item-content">{{ drug_base.guige }}</span>
                  </div>
                  <div class="item" v-if="drug_base.jixing">
                    <span class="item-label">剂型：</span>
                    <span class="item-content">{{ drug_base.jixing }}</span>
                  </div>
                  <div class="item" v-if="drug_base.type">
                    <span class="item-label">产品类型：</span>
                    <span class="item-content">{{ drug_base.type }}</span>
                  </div>
                  <div class="item" v-if="drug_base.authorizationday">
                    <span class="item-label">批准日期：</span>
                    <span class="item-content">{{
                      drug_base.authorizationday
                    }}</span>
                  </div>
                  <div class="item" v-if="drug_base.benweima">
                    <span class="item-label">药品本位码：</span>
                    <span class="item-content">{{ drug_base.benweima }}</span>
                  </div>
                  <div class="item" v-if="drug_base.address">
                    <span class="item-label">生产地址：</span>
                    <span class="item-content">{{ drug_base.address }}</span>
                  </div>
                </div>
              </div>
            </div>
            <el-pagination
              v-if="count>10"
              @current-change="PageChange"
              :current-page="page"
              :page-size="10"
              layout="total, prev, pager, next, jumper"
              :total="count"
            >
            </el-pagination>
          </el-tab-pane>
        </el-tabs>
      </div>

      <div v-else style="text-align: center; color: #999; margin-top: 200px">
        <img src="/static/imgs/trz/no_data.png" alt="" />
        <div class="text">暂无相关数据</div>
      </div>
    </div>
  </div>
</template>

<script>
import { isEmpty } from "@antv/util";

export default {
  data() {
    return {
      activeName: "",
      tabs: [],
      datas: [],
      tableloading: false,
      count: 0,
      page: 1,
      drug_base: {
        name: "",
        pizhunwenhao: "",
        englishname: "",
        brandname: "",
        shengchanqiye: "",
        guige: "",
        jixing: "",
        type: "",
        authorizationday: "",
        benweima: "",
        address: "",
      },
      ssyp_loading: false,
    };
  },
  watch: {},
  methods: {
    PageChange(e) {
      this.getMarketedDrug(e);
    },
    handleClickTag(tab, event) {
      this.resetActivePosition(this.$refs.tabs.$el);
      this.getMarketedDrug();
    },
    resetActivePosition($el) {
      this.$nextTick(() => {
        const activeEl = $el.querySelector(".el-tabs__item.is-active");
        const lineEl = $el.querySelector(".el-tabs__active-bar");
        const style = getComputedStyle(activeEl);
        const pl = style.paddingLeft.match(/\d+/)[0] * 1;
        const pr = style.paddingRight.match(/\d+/)[0] * 1;
        const w = style.width.match(/\d+/)[0] * 1;
        lineEl.style.transform =
          "translateX(" + (activeEl.offsetLeft + pl) + "px)";
        lineEl.style.width = w - pl - pr + "px";
      });
    },
    // /company_filter/marketedDrugCate
    getDrugCate() {
      this.ssyp_loading = true;
      Axios.get(
        "/api/company_filter/marketedDrugCate?id=" + this.$route.params.id
      ).then((res) => {
        this.ssyp_loading = false;
        if (res.data.code == 200 && !isEmpty(res.data.data)) {
          this.tabs = res.data.data.map((t) => ({
            ...t,
            key: t.key == "" ? "all" : t.key,
          }));
          this.activeName = this.tabs[0].key;
          this.$nextTick(() => {
            this.resetActivePosition(this.$refs.tabs.$el);
          });
          this.getMarketedDrug();
        }
      });
    },
    // /company_filter/marketedDrug
    getMarketedDrug(page = 1) {
      this.tableloading = true;
      Axios({
        method: "get",
        url: "/api/company_filter/marketedDrug",
        params: {
          id: this.$route.params.id,
          type: this.activeName == "all" ? "" : this.activeName,
          page,
          pageSize: 10,
        },
      }).then((res) => {
        this.tableloading = false;
        if (res.data.code == 200) {
          this.datas = res.data.data.res;
          this.count = res.data.data.count;
          this.page = res.data.data.page;
          this.drug_base = res.data.data.res[0];
        }
      });
    },
    rowClick(row, col, event) {
      this.drug_base = row;
    },
  },
  created() {},
  mounted() {
    this.getDrugCate();
  },
};
</script>

<style lang="less" scoped >
@import "~@/assets/less/var.less";
@import url(./public.less);
.companyfilter-ssyp {
}
.ssyp {
  padding: 10px;
}
.ssyp-title {
  font-size: 14px;
  margin-bottom: 15px;
  margin-top: 5px;
  line-height: 1;
  padding-left: 9px;
  font-weight: 600;
  color: #333;
  position: relative;
  &::before {
    width: 2px;
    height: 14px;
    background-color: #4877E8;
    content: "";
    border-radius: 1px;
    display: block;
    position: absolute;
    left: 0;
  }
}
.inner-cards {
  border: 1px solid #ebeef5;
  border-radius: 3px;
}
.table-detail-container {
  display: flex;
  .flex1 {
    flex: 1;
    width: 50%;
  }
  .yp-desc {
    .item {
      display: flex;
      word-break: break-all;
      line-height: 30px;
    }
    span.item-label {
      width: 120px;
      display: inline-block;
      text-align: justify;
      font-size: 13px;
      color: #5c6973;
    }
    span.item-content {
      flex: 1;
      word-break: break-all;
      color: #333;
      font-size: 13px;
    }

    .yp-desc-content {
      border: 1px solid #ebeef5;
      height: calc(100% - 36px);
      box-sizing: border-box;
      padding-left: 20px;
      padding-top: 10px;
    }
  }
}
/deep/.el-pagination {
  padding-top: 20px;
  padding-bottom: 10px;
}
/deep/.el-tabs__header {
  border-bottom: none !important;
  margin-bottom: 7px;
  margin-top: -10px;
  .el-tabs__nav-wrap {
    border-bottom: none !important;
  }
}
</style>
