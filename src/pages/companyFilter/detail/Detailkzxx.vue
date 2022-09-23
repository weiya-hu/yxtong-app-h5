<template>
  <div class="companyfilter-kzxx" v-waiting="loading">
    <div class="content-title">扩展信息</div>
    <div class="kzxx" v-if="kzxx.length">
      <div
        v-for="item in kzxx"
        :key="item.label"
        class="kzxx-item"
        @click="goKz(item.href, item.label)"
      >
        <span>{{ item.label }}</span>
        <span style="color: #9aa4b8">（{{ item.count }}）</span>
      </div>
    </div>

    <div v-else style="text-align: center; color: #999; margin-top: 200px">
      <img src="/static/imgs/trz/no_data.png" alt="" />
      <div class="text">暂无相关数据</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    extend:""
  },
  data() {
    return {
      kzxx: [],
      loading: true
    };
  },
  watch: {},
  methods: {
    goKz(href, label) {
      _paq.push([
        "trackEvent",
        "button",
        "click",
        "企业版_企业筛选系统_企业详情_扩展信息_" + label,
      ]);
      if (href.indexOf("http") === -1) {
        this.vueExtendTo(href);
      } else {
        window.open(href);
      }
    },
    getKZ() {
      Axios({
        method: "get",
        url: "/api/company_filter/extendlistfun?"+this.extend
      }).then(res => {
        this.loading = false
        if (res.data.code == 200) {
          this.kzxx = res.data.data
        }
      })
    }
  },
  created() {
    this.getKZ()
  },
  mounted() {},
};
</script>

<style lang="less" scoped>
@import "~@/assets/less/var.less";
.companyfilter-kzxx {
  height: 100%;
}
.kzxx {
  padding: 10px;
  display: flex;
}
.kzxx-item {
  padding: 7px 10px;
  background-color: #fafbfd;
  border: 1px solid #ebeef5;
  border-radius: 3px;
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  margin-right: 10px;
  span {
    line-height: 1;
    font-size: 14px;
    color: #333;
  }
  &:hover {
    background-color: #4877E8;
    border-color: #4877E8;
    color: #fff;
    span {
      color: #fff !important;
    }
  }
}
</style>
