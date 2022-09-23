<template>
  <div class="detail-items">
    <!-- 药效学/药动学 -->
    <div class="detail-item">
      <div class="item-title">
        <span class="text">药效学/药动学</span>
      </div>
      <div class="table-box">
        <table class="table-left-head">
          <tr v-if="res.targetsarr.pharmacodynamics">
            <td>药效学</td>
            <td>
              <span v-html="res.targetsarr.pharmacodynamics"></span>
            </td>
          </tr>
          <tr v-if="res.targetsarr.mechanism_of_action">
            <td>作用机制</td>
            <td>
              <span v-html="res.targetsarr.mechanism_of_action"></span>
            </td>
          </tr>
          <tr v-if="res.targetsarr.protein">
            <td>蛋白结合</td>
            <td>
              <span v-html="res.targetsarr.protein"></span>
            </td>
          </tr>
          <tr v-if="res.targetsarr.halflife">
            <td>半衰期</td>
            <td>
              <span v-html="res.targetsarr.halflife"></span>
            </td>
          </tr>
          <tr v-if="res.targetsarr.toxicity">
            <td>毒理</td>
            <td>
              <span v-html="res.targetsarr.toxicity"></span>
            </td>
          </tr>
          <tr v-if="res.targetsarr.absorption">
            <td>吸收</td>
            <td>
              <span v-html="res.targetsarr.absorption"></span>
            </td>
          </tr>
          <tr v-if="res.targetsarr.volume">
            <td>分布</td>
            <td>
              <span v-html="res.targetsarr.volume"></span>
            </td>
          </tr>
          <tr v-if="res.targetsarr.metabolism">
            <td>代谢</td>
            <td>
              <span v-html="res.targetsarr.metabolism"></span>
            </td>
          </tr>
          <tr v-if="res.targetsarr.route">
            <td>排泄</td>
            <td>
              <span v-html="res.targetsarr.route"></span>
            </td>
          </tr>
          <tr v-if="res.targetsarr.clearance">
            <td>清除</td>
            <td>
              <span v-html="res.targetsarr.clearance"></span>
            </td>
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
