<template>
  <div class="companyfilter-glqy" v-waiting="isLoading">
    <div class="content-title">关联企业</div>
    <div v-if="tabList.length">
      <el-tabs v-model="activeName" @tab-click="handleClickTab" ref="glqytab">
        <el-tab-pane
          v-for="(item, key) in tabList"
          :key="key"
          :label="item.name + `(${item.doc_count})`"
          :name="item.key"
        >
          <span slot="label">
            {{ item.name }}
            <span class="num">({{ item.doc_count }})</span>
          </span>

          <el-table
            v-if="item.key == activeName"
            class="line-table"
            :data="tableList"
            :height="388"
            fixed
            border
            :header-cell-style="{
              background: '#F5F6FA',
              color: '#333333',
              fontSize: '14px',
              fontWeight: 'bold',
            }"
          >
            <el-table-column
              v-for="item in tableHead"
              :prop="item.prop"
              :key="item.prop"
              :label="item.label"
            >
            </el-table-column>
          </el-table>
          <el-pagination
            v-if="total"
            @current-change="handleCurrentChange"
            :current-page="params.page"
            :page-size="10"
            layout="total, prev, pager, next, jumper"
            :total="total"
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
</template>

<script>
export default {
  data() {
    return {
      isLoading: true,
      activeName: "",
      tabList: [],
      tableList: [],
      tableHead: [
        {
          prop: "qymc",
          label: "企业名称",
        },
        {
          prop: "jyfw",
          label: "经营范围",
        },
      ],
      total: 0,
      params: {
        pageSize: 10,
        page: 1,
      },
    };
  },
  watch: {},
  methods: {
    // 获取关联企业顶部切换tab
    getGlqyTab() {
      window
        .Axios({
          method: "get",
          url: "/api/company_filter/linkCompany",
          params: {
            id: this.$route.params.id,
            accesstoken: GETCOOKIEFUN("accesstoken"),
          },
        })
        .then((res) => {
          this.isLoading = false;
          if (res.data.code === 200 && res.data.data) {
            this.tabList = res.data.data;
            this.activeName = this.tabList[0].key;
            this.getGlqyList();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    // 获取关联企业表格数据
    getGlqyList() {
      // this.isLoading = true;
      window
        .Axios({
          method: "get",
          url: "/api/company_filter/linkCompanyDetail",
          params: {
            id: this.$route.params.id,
            key: this.activeName,
            ...this.params,
            accesstoken: GETCOOKIEFUN("accesstoken"),
          },
        })
        .then((res) => {
          this.isLoading = false;
          if (res.data.code === 200 && res.data.data) {
            this.tableList = res.data.data.res;
            this.total = res.data.data.count;
          } else {
            this.tableList = [];
            this.total = 0;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    handleCurrentChange(e) {
      this.params.page = e;
      this.getGlqyList();
    },

    // 顶部切换事件
    handleClickTab(tab) {
      this.resetActivePosition(this.$refs.glqytab.$el);
      this.params = {
        pageSize: 10,
        page: 1,
      };
      this.getGlqyList();
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
  mounted() {
    this.getGlqyTab();
  },
};
</script>

<style lang="less">
@import "~@/assets/less/var.less";

.companyfilter-glqy {
  height: 100%;
  .el-table thead th > .cell {
    height: 36px;
    line-height: 36px;
    color: #333;
  }

  .el-table td,
  .el-table th.is-leaf {
    border-bottom: 1px solid #ebeef5;
  }
}
</style>
