<template>
  <div class="kzxx">
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
</template>

<script>
export default {
  name: "kzxx",
  data() {
    return {
      kzxx: [],
    };
  },
  props: {
    base: {
      defautl:() => ({}),
      type: Object,
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
  methods: {
    goKz(href, label) {
      _paq.push([
        "trackEvent",
        "button",
        "click",
        "企业版_全球药物_药物详情_扩展信息_" + label,
      ]);
      if (href.indexOf('http') === -1) {
        this.vueExtendTo(href)
      } else {
        window.open(href)
      }
    },
  },
  mounted() {
    // /api/report/extendlistfun
    Axios({
      url: "/api/globaldrugs/extendlistfun?"+this.base.extendList,
    }).then((res) => {
      if (res.data.code == 200 && this.isEmpty(res.data.data)) {
        this.kzxx = res.data.data;
      } else {
        this.$root.$emit("hide-section", "扩展信息");
      }
    });
  },
};
</script>

<style scoped lang="less">
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
}
</style>