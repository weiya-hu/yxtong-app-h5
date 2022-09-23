<template>
  <div class="detail-items">
    <!-- API信息 -->
    <div class="detail-item">
      <div class="item-title">
        <span class="text">API信息</span>
      </div>
      <div class="table-box">
        <table class="table-left-head">
          <tr>
            <td>化学名称</td>
            <td
              :style="{ padding: jspdf ? 0 : '0 50px' }"
              v-if="res.api.chemicalname"
            >
              <span v-html="res.api.chemicalname"></span>
            </td>
            <td v-else>/</td>
          </tr>
          <tr>
            <td>CAS登记号</td>
            <td v-if="res.api.cas" v-html="res.api.cas"></td>
            <td v-else>/</td>
          </tr>
          <tr>
            <td>分子式</td>
            <td v-if="res.api.formulations">
              <span
                v-html="vueFormulationsFormatter(res.api.formulations)"
              ></span>
            </td>
            <td v-else>/</td>
          </tr>
          <tr>
            <td>分子量</td>
            <td
              v-if="res.api.formulaweight"
              v-html="res.api.formulaweight"
            ></td>
            <td v-else>/</td>
          </tr>
        </table>
      </div>
    </div>
    <DetailKzxx v-if="showKZXX()" :extendList="extendList"></DetailKzxx>
  </div>
</template>

<script>
import { mapState } from "vuex";
import DetailKzxx from "./kzxx";
export default {
  components: { DetailKzxx },
  props: {
    extendList: Array,
    res: {
      type: Object,
    },
    jspdf: {
      type: Boolean,
    },
  },
  data() {
    return {
      css1: `overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      max-height: 36px;`,
    };
  },
  computed: {
    ...mapState({
      test: (state) => state.DrugReport.test,
    }),
  },
  mounted() {
    console.log(this.jspdf);
  },
  methods: {
    showKZXX() {
      let flag = false;
      if (this.jspdf) {
        flag = false;
      } else {
        flag = true;
      }
      return flag;
    },
    // 获取atc的中文
    getAtc(name, arr) {
      let str = "";
      if (arr) {
        for (let index in arr[name]) {
          str += arr[name][index].shuoming + " > ";
        }
        str = _.trimEnd(str, " > "); // 去除最后多余的" > "
      }
      return str;
    },
    getAtcNames(name) {
      return name ? name.replace(/\s+/g, "").split(";") : [];
    },
  },
};
</script>
<style lang="less" scoped>
@import "~@/assets/less/var.less";
@import "../css/com.less";
.table-box {
  padding: 10px;
  box-sizing: border-box;
}
.table-left-head {
  box-sizing: border-box;
  width: 100%;
  tr {
    width: 100%;
    height: 34px;
    td {
      box-sizing: border-box;
      padding: 0 50px;
      height: 33px;
      line-height: 25px;
      border: 1px solid @BorderColorNew;
      font-size: 13px;
      &:nth-child(odd) {
        min-width: 180px;
        width: 230px;
      }
      &:first-child {
        white-space: nowrap;
        background: @DetailTableLeftColor;
        font-weight: bold;
      }
      &:nth-child(2) {
        background: @DetailTableRightColor;
      }
    }
  }
}
// .detail-items {
//   padding-bottom: 10px !important;
// }
</style>
