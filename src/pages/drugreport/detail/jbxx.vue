<template>
  <div class="detail-items">
    <!-- 药理作用 -->
    <div class="detail-item">
      <div class="item-title">
        <span class="text">基本信息</span>
      </div>
      <div class="table-box">
        <table class="table-left-head">
        <tr>
          <td>靶点全称</td>
          <td
            v-if="
              res.target_unique &&
                res.target_unique.length > 0 &&
                !res.target_unique.includes('')
            "
          >
            <span :style="wordBreak" :class="{ 't-line5': !jspdf }">
              <div v-for="(item, index) in res.target_unique" :key="index">
                <div style="display: inline-block;" v-if="item.hrefid != ''">
                  <router-link
                    tag="a"
                    target="_blank"
                    :style="
                      !jspdf
                        ? 'display: block;width: 100%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;color: rgb(72, 119, 232);'
                        : ''
                    "
                    :to="`/targetdatas/${item.hrefid}`"
                  >
                    {{
                      item.name +
                        (jspdf
                          ? index < res.target_unique.length - 1
                            ? ";"
                            : ""
                          : "") || "/"
                    }}
                  </router-link>
                </div>
                <div v-else>
                  <span
                    :style="
                      !jspdf
                        ? 'display: block;width: 100%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;'
                        : ''
                    "
                  >
                    {{
                      item.name +
                        (jspdf
                          ? index < res.target_unique.length - 1
                            ? ";"
                            : ""
                          : "") || "/"
                    }}
                  </span>
                </div>
              </div>
            </span>
          </td>
          <td v-else>/</td>
        </tr>
        <tr>
          <td>靶点简称</td>
          <td
            v-if="res.targets_abbr.length > 0 && !res.targets_abbr.includes('')"
          >
            <span :style="wordBreak" :class="{ 't-line5': !jspdf }">
              <div v-for="(item, index) in res.targets_abbr" :key="index">
                <div style="display: inline-block;" v-if="item.hrefid != ''">
                  <router-link
                    tag="a"
                    :to="'/targetdatas/' + item.hrefid"
                    target="_blank"
                    :style="
                      !jspdf
                        ? 'display: block;width: 100%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;color: #4877e8;'
                        : ''
                    "
                  >
                    {{
                      item.name +
                        (jspdf
                          ? index < res.targets_abbr.length - 1
                            ? ";"
                            : ""
                          : "") || "/"
                    }}
                  </router-link>
                </div>
                <div v-else>
                  <span
                    :style="
                      !jspdf
                        ? 'display: block;width: 100%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;'
                        : ''
                    "
                  >
                    {{
                      item.name +
                        (jspdf
                          ? index < res.targets_abbr.length - 1
                            ? ";"
                            : ""
                          : "") || "/"
                    }}
                  </span>
                </div>
              </div>
            </span>
          </td>
          <td v-else>/</td>
        </tr>
        <tr>
          <td>已批准适应症</td>
          <td v-if="res.indication_pizhun" v-html="res.indication_pizhun"></td>
          <td v-else>/</td>
        </tr>
        <tr>
          <td>Active适应症</td>
          <td v-if="res.indication" v-html="res.indication"></td>
          <td v-else>/</td>
        </tr>
        <tr>
          <td>Inactive适应症</td>
          <td
            v-if="res.inactiveindications_cn"
            v-html="res.inactiveindications_cn"
          ></td>
          <td v-else>/</td>
        </tr>
        <tr>
          <td>ATC分类</td>
          <td v-if="res.atc">
            <span :style="wordBreak" :class="{ 't-line5': !jspdf }">
              <div
                v-for="(item, index) in getAtcNames(res.atc)"
                :key="item"
                class="clearfix"
              >
                <span>{{ item }}&nbsp;&nbsp;</span>
                <span>{{ getAtc(item, res.atcarr) }}</span>
                <br v-if="index % 2 != 0" />
              </div>
            </span>
          </td>
          <td v-else>/</td>
        </tr>
        <tr>
          <td>其他研发单位</td>
          <td v-if="res.othercompany && !res.othercompany.includes('')">
            <span
              style="display: inline-flex; flex-wrap: wrap; width: 100%"
              :style="wordBreak"
              :class="{ 't-line5': !jspdf }"
            >
              <span
                v-for="(item, index) in res.othercompany"
                v-if="item != ''"
                :key="index"
                :style="
                  !jspdf
                    ? 'display: block;width: 100%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;'
                    : ''
                "
              >
                {{
                  item +
                    (jspdf
                      ? index < res.othercompany.length - 1
                        ? ";"
                        : ""
                      : "") || "/"
                }}
              </span>
            </span>
          </td>
          <td v-else>/</td>
        </tr>
        <tr>
          <td>其他介绍</td>
          <td v-if="!(!res.wikiurl && !res.drugbankurl && !res.keggurl)">
            <a v-if="res.wikiurl" :href="res.wikiurl" target="_blank">WiKi</a>
            <a v-if="res.drugbankurl" :href="res.drugbankurl" target="_blank"
              >DrugBank</a
            >
            <a v-if="res.keggurl" :href="res.keggurl" target="_blank">KEGG</a>
            <span v-else-if="!res.wikiurl && !res.drugbankurl && !res.keggurl"
              >/</span
            >
          </td>
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
    jspdf: {
      type: Boolean
    },
    res: {
      type: Object
    }
  },
  data() {
    return {
      wordBreak: "word-break: break-word;",
      css1: `overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      max-height: 36px;`
    };
  },
  computed: {
    ...mapState({
      pdfHandlerStatus: state => state.DrugReport.pdfHandlerStatus
    })
  },
  mounted() {},
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
    }
  }
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
      padding: 0 0 0 50px;
      height: 33px;
      line-height: 25px;
      border: 1px solid @BorderColorNew;
      font-size: 13px;
      max-width: calc(20vw - 50px);
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
.t-line5 {
  display: block;
  max-height: 130px;
  overflow-y: auto;
}
a {
  color: rgb(72, 119, 232);
}
</style>
