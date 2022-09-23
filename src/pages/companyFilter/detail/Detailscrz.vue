<template>
  <div class="companyfilter-scrz">
    <div class="content-title">
      生产认证
      <!-- <el-tooltip
        class="desc"
        effect="light"
        content="企业报告功能复用，关联方式有调整。位置：企业报告-知识产权-生产认证"
        placement="top-start"
      >
        <span class="section-ico-qa"></span>
      </el-tooltip> -->
    </div>
    <div class="scrz">
      <el-tabs @tab-click="handleClickTag" ref="tabs" v-model="activeName">
        <el-tab-pane label="GMP认证" name="GMP认证">
          <span slot="label">
            GMP认证
            <span style="color: #9aa4b8"> ({{ gmp.count }}) </span>
          </span>
          <el-table :data="gmp.datas" v-waiting="gmp.loading">
            <el-table-column
              v-for="item in gmp.tableHead"
              :prop="item.field"
              :min-width="item.field_width || item.width || 150"
              :key="item.field"
              :label="item.label"
            >
            <template slot-scope="{row}">
              <div :title="row[item.field]">
                {{row[item.field]}}
              </div>
            </template>
            </el-table-column>
          </el-table>
          <el-pagination
            v-if="gmp.count>10"
            @current-change="gmpPageChange"
            :current-page="gmp.page"
            :page-size="10"
            layout="total, prev, pager, next, jumper"
            :total="gmp.count"
          >
          </el-pagination>
        </el-tab-pane>
        <el-tab-pane label="参比制剂备案" name="参比制剂备案">
          <span slot="label">
            参比制剂备案
            <span style="color: #9aa4b8"> ({{ zjba.count }}) </span>
          </span>
          <el-table :data="zjba.datas" v-waiting="zjba.loading">
            <el-table-column
              v-for="item in zjba.tableHead"
              :prop="item.field"
              :min-width="item.field_width || item.width || 150"
              :key="item.field"
              :label="item.label"
            >
            <template slot-scope="{row}">
              <div :title="row[item.field]">
                {{row[item.field]}}
              </div>
            </template>
            </el-table-column>
          </el-table>
          <el-pagination
            v-if="zjba.count>10"
            @current-change="zjbaPageChange"
            :current-page="zjba.page"
            :page-size="10"
            layout="total, prev, pager, next, jumper"
            :total="zjba.count"
          >
          </el-pagination>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeName: "",
      gmp: {
        datas: [],
        page: 1,
        count: 0,
        loading: false,
        tableHead: [
          { label: "证书编号", field: "zhengshubianhao" },
          { label: "认证范围", field: "renzhengfanwei" },
          { label: "认证版本", field: "gmpbanben" },
          { label: "发证日期", field: "fazhengriqi" },
          { label: "有效期截止日", field: "jiezhiriqi" },
        ],
      },
      zjba: {
        datas: [],
        page: 1,
        count: 0,
        loading: false,
        tableHead: [
          { label: "备案编号", field: "no" },
          { label: "备案类型", field: "type" },
          { label: "通用名(拟评价)", field: "name" },
          { label: "剂型(拟评价)", field: "form" },
          { label: "规格(拟评价)", field: "strength" },
          { label: "通用名(拟参比)", field: "name2" },
          { label: "剂型(拟参比)", field: "form2" },
          { label: "规格(拟参比)", field: "strength2" },
          { label: "持证商", field: "holder" },
          { label: "生成厂/产地", field: "company2" },
          { label: "备案时间", field: "date" },
        ],
      },
    };
  },
  watch: {},
  methods: {
    gmpPageChange(page = 1) {
      // /company_filter/gmplist
      this.gmp.loading = true;
      Axios({
        method: 'get',
        url: '/api/company_filter/gmplist',
        params: {
          page,
          pageSize: 10,
          id: this.$route.params.id
        }
      }).then(res => {
      this.gmp.loading = false;
        if (res.data.code == 200 ) {
          this.gmp.datas = res.data.data.res;
          this.gmp.count = res.data.data.count;
          this.gmp.page = res.data.data.page;
        }
      })
    },
    zjbaPageChange(page = 1) {
       this.zjba.loading = true;
      Axios({
        method: 'get',
        url: '/api/company_filter/orangebeilist',
        params: {
          page,
          pageSize: 10,
          id: this.$route.params.id
        }
      }).then(res => {
       this.zjba.loading = false;
        if (res.data.code == 200 ) {
          this.zjba.datas = res.data.data.res;
          this.zjba.count = res.data.data.count;
          this.zjba.page = res.data.data.page;
        }
      })
    },
    handleClickTag(tab, event) {
      this.resetActivePosition(this.$refs.tabs.$el);
      if (this.activeName == '') {
        this.gmpPageChange()
      } else {
        this.zjbaPageChange()
      }
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
  },
  created() {},
  mounted() {
    this.gmpPageChange()
    this.zjbaPageChange()
    setTimeout(() => {
      this.activeName = "GMP认证";
      this.resetActivePosition(this.$refs.tabs.$el);
    }, 200);
  },
};
</script>

<style lang="less" scoped>
@import "~@/assets/less/var.less";
@import url(./public.less);
.companyfilter-scrz {
}
.scrz {
  padding: 10px;
}

</style>
