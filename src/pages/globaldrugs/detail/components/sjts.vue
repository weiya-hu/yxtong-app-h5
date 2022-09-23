<template>
  <div class="xwzx">
    <el-tabs @tab-click="handleClickTag" ref="tabs" v-model="activeName">
      <template v-for="(item, key) in xwzx">
        <!-- 根据数量 判断是否展示板块 tab -->
        <!-- ((key == 'zlbj'&&showZlbj)?true: -->
        <el-tab-pane
          v-if="
            count_map[key] ? true : key == 'zlbj' && showZlbj ? true : false
          "
          :key="key"
          :name="key"
        >
          <span slot="label">
            {{ item.name }}
            <span v-if="key != 'zlbj'" style="color: #9aa4b8">{{
              count_map[key] ? `(${count_map[key]})` : ``
            }}</span>
          </span>
          <template v-if="item.component && key == activeName">
            <component
              v-if="key == 'zhuce'"
              :drugids="base.drugids ? base.drugids : ''"
              :is="item.component"
              :idx="key"
              :drugname_standard="drugname_standard"
              :company_standard="company_standard"
            />
            <component
              v-else
              :is="item.component"
              :base="base"
              :drugname_standard="drugname_standard"
              :company_standard="company_standard"
              :idx="key"
            />
          </template>
          <span v-else>
            {{ item.name }}
          </span>
        </el-tab-pane>
      </template>
    </el-tabs>
  </div>
</template>

<script>
// 数据透视
import Zgzcsb from "./sjts/zgzcsb";
import Sspz from "./sjts/sspz";
import Scxs from "./sjts/scxs";
import Ypbz from "./sjts/ypbz";
import Ypsms from "./sjts/ypsms";
import Zbxx from "./sjts/zbxx";
import Csco from "./sjts/csco";
import Zlbj from "./sjts/zlbj";
import Psbg from "./sjts/psbg";
export default {
  name: "yaowu-sjts",
  data() {
    return {
      activeName: "",
      xwzx: {
        zhuce: {
          name: "中国注册申报",
          component: Zgzcsb,
        },
        globalapproval: {
          name: "上市批准",
          component: Sspz,
        },
        zlbj: {
          name: "专利布局",
          component: Zlbj,
        },
        csco: {
          name: "CSCO指南",
          component: Csco,
        },
        ypxs: {
          name: "市场销售",
          component: Scxs,
        },
        yaopinzhongbiao: {
          name: "中标信息",
          component: Zbxx,
        },
        doc: {
          name: "全球药品评审报告",
          component: Psbg,
        },
        instruct: {
          name: "药品说明书",
          component: Ypsms,
        },
        biaozhun: {
          name: "药品标准",
          component: Ypbz,
        },
      },
      count_map: {},
      showZlbj: true,
    };
  },
  watch: {
    activeName: {
      handler(val) {
        this.xwzx[val] &&
          _paq.push([
            "trackEvent",
            "button",
            "click",
            "企业版_全球药物_药物详情_数据透视_TAB点击_" + this.xwzx[val].name,
          ]);
      },
      immediate: true,
    },
  },
  props: {
    base: {
      default: () => ({}),
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
  async mounted() {
    // const { drugname_standard, company_standard } = this.$route.query;
    // /globaldrugs/drugDataInsightCount
    await Axios({
      url: "/api/globaldrugs/drugDataInsightCount",
      params: {
        // drugids:this.base.drugids,
        drugname_standard: this.drugname_standard,
        // company_standard: this.company_standard,
      },
    }).then((res) => {
      if (res.data.code == 200) {
        let count_map = {};
        res.data.data.forEach((item) => {
          count_map[item.key] = item.doc_count;
        });
        this.count_map = count_map;
        if (this.isEmpty(count_map)) {
          this.activeName = Object.keys(count_map)[0];
        } else {
          this.activeName = "zlbj";
        }
      } else {
        this.activeName = "zlbj";
      }
    }).catch(e => {
        console.log(e)
        this.activeName = "zlbj";
    });

    await Axios.all([this.getZlData(1, "cn"), this.getZlData(1, "all")]).then(
      Axios.spread((cnres, allres) => {
        let cntotal = 0;
        let alltotal = 0;
        console.log(cnres, allres);
        if (cnres.data.code == 200) {
          cntotal = cnres.data.data.totle;
        }
        if (allres.data.code == 200) {
          alltotal = allres.data.data.totle;
        }
        if (cntotal + alltotal > 0) {
          // console.log(cntotal+alltotal)
          // this.$set(this.count_map, 'zlbj', cntotal+alltotal)
        } else {
          this.showZlbj = false;
        }
      })
    );
    if (!this.showZlbj && !this.isEmpty(this.count_map)) {
      this.$root.$emit("hide-section", "数据透视");
    }
    this.$root.$on("showZlbj", (e) => {
      this.showZlbj = e;
      if (!e && !this.isEmpty(this.count_map)) {
        this.$root.$emit("hide-section", "数据透视");
      }
    });
  },
  methods: {
    handleClickTag(tab, event) {
      this.resetActivePosition(this.$refs.tabs.$el);
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
    // /lineat/dblist
    getZlData(page = 1, type = "all") {
      return Axios({
        url: "/lineat/dblist",
        params: {
          sort: "publicationdate=desc",
          words: "KWS=" + this.drugname_standard,
          sourceType: type,
          pageSize: 10,
          page,
        },
      });
    },
  },
};
</script>

<style scoped lang="less">
@import url(./table-style.less);
.xwzx {
  padding: 10px;
  position: relative;
  min-height: 200px;
}
</style>