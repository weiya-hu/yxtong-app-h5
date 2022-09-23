<template>
  <div class="syz">
    <div class="part-title">适应症</div>
    <template v-if="ypz.length">
      <div class="part-sub-title">已批准适应症:</div>
      <div class="table">
        <table>
          <tr>
            <th>适应症</th>
            <th>中国</th>
            <th>美国</th>
            <th>欧盟</th>
            <th>日本</th>
            <th>其他国家或地区</th>
          </tr>
          <tr v-for="(row, i) in ypz" :key="i">
            <td>
              <div>{{ row.indication }}</div>
            </td>
            <td>
              <div style="text-align: center" v-if="row.china.length == 0">
                -
              </div>
              <div v-for="(ot, j) in row.china" :key="j">
                {{ ot.name }} <span v-if="ot.date">({{ ot.date }})</span>
              </div>
            </td>
            <td>
              <div style="text-align: center" v-if="row.usa.length == 0">-</div>
              <div v-for="(ot, j) in row.usa" :key="j">
                {{ ot.name }} <span v-if="ot.date">({{ ot.date }})</span>
              </div>
            </td>
            <td>
              <div style="text-align: center" v-if="row.eu.length == 0">-</div>
              <div v-for="(ot, j) in row.eu" :key="j">
                {{ ot.name }} <span v-if="ot.date">({{ ot.date }})</span>
              </div>
            </td>
            <td>
              <div style="text-align: center" v-if="row.jp.length == 0">-</div>
              <div v-for="(ot, j) in row.jp" :key="j">
                {{ ot.name }} <span v-if="ot.date">({{ ot.date }})</span>
              </div>
            </td>
            <td>
              <div style="text-align: center" v-if="row.other.length == 0">
                -
              </div>
              <div v-for="(ot, j) in row.other" :key="j">
                {{ ot.name }} <span v-if="ot.date">({{ ot.date }})</span>
              </div>
            </td>
          </tr>
        </table>
      </div>
    </template>

    <template v-if="yfjz.length">
      <div class="part-sub-title">适应症研发进展:</div>
      <div class="table">
        <table>
          <tr>
            <th style="width: 120px">适应症</th>
            <th style="width: 420px">
              <div class="combine-head">
                <div>临床前</div>
                <div>临床申请</div>
                <div>临床Ⅰ期</div>
                <div>临床Ⅱ期</div>
                <div>临床Ⅲ期</div>
                <div>注册申请</div>
                <div>批准上市</div>
              </div>
            </th>
            <th style="width: 67px">研发单位</th>
            <th style="width: 67px">合作企业</th>
            <th style="width: 67px">许可单位</th>
          </tr>
          <tr v-for="(row, idx) in yfjz" :key="idx">
            <td>
              <div>{{ row.indication }}</div>
            </td>
            <td>
              <div
                class="line global_line"
                v-if="
                  isEmpty(row.status.global) &&
                  findEnumIndex(row.status.global.num) >= 0
                "
              >
                <div
                  v-for="(c, i) in global_line_map"
                  :key="i"
                  :style="{
                    backgroundColor: c,
                    left: -i * 3 + '%',
                    zIndex: 10 - i,
                  }"
                  v-if="findEnumIndex(row.status.global.num) >= i"
                  class="line-item"
                >
                  <span
                    :class="[
                      'line-item_label',
                      findEnumIndex(row.status.global.num) < 3 ? 'dark' : '',
                    ]"
                    v-if="findEnumIndex(row.status.global.num) == i"
                    style="font-size: 12px"
                  >
                    <i>{{ row.global_status_date }}</i>
                  </span>
                </div>
              </div>
              <div
                class="line china_line"
                v-if="
                  isEmpty(row.status.china) &&
                  findEnumIndex(row.status.china.num) >= 0
                "
              >
                <div
                  v-for="(c, i) in cn_line_map"
                  :key="i"
                  :style="{
                    backgroundColor: c,
                    left: -i * 3 + '%',
                    zIndex: 10 - i,
                  }"
                  v-if="findEnumIndex(row.status.china.num) >= i"
                  class="line-item"
                >
                  <span
                    :class="[
                      'line-item_label',
                      findEnumIndex(row.status.china.num) < 3 ? 'dark' : '',
                    ]"
                    v-if="findEnumIndex(row.status.china.num) == i"
                    style="font-size: 12px"
                    ><i>{{ row.china_status_date }}</i></span
                  >
                </div>
              </div>
            </td>
            <td>
              <div class="yfdw" v-if="row.company_standard.global.length">
                <div class="label">全球:</div>
                <div class="c">
                  <p
                    class="hidden"
                    v-for="(t, i) in row.company_standard.global"
                    :key="i"
                  >
                    <span>{{ t.name }}</span>
                  </p>
                </div>
              </div>
              <div class="yfdw" v-if="row.company_standard.china.length">
                <div class="label">中国:</div>
                <div class="c">
                  <p
                    class="hidden"
                    v-for="(t, i) in row.company_standard.china"
                    :key="i"
                  >
                    <span>{{ t.name }}</span>
                  </p>
                </div>
              </div>
            </td>
            <td>
              <div class="yfdw" v-if="row.coo_company.global.length">
                <div class="label">全球:</div>
                <div class="c">
                  <p
                    class="hidden"
                    v-for="(t, i) in row.coo_company.global"
                    :key="i"
                  >
                    <span>{{ t.name }}</span>
                  </p>
                </div>
              </div>
              <div class="yfdw" v-if="row.coo_company.china.length">
                <div class="label">中国:</div>
                <div class="c">
                  <p
                    class="hidden"
                    v-for="(t, i) in row.coo_company.china"
                    :key="i"
                  >
                    <span>{{ t.name }}</span>
                  </p>
                </div>
              </div>
            </td>
            <td>
              <div class="yfdw" v-if="row.per_company.global.length">
                <div class="label">全球:</div>
                <div class="c">
                  <p
                    class="hidden"
                    v-for="(t, i) in row.per_company.global"
                    :key="i"
                  >
                    <span>{{ t.name }}</span>
                  </p>
                </div>
              </div>
              <div class="yfdw" v-if="row.per_company.china.length">
                <div class="label">中国:</div>
                <div class="c">
                  <p
                    class="hidden"
                    v-for="(t, i) in row.per_company.china"
                    :key="i"
                  >
                    <span>{{ t.name }}</span>
                  </p>
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td colspan="5">
              <div class="desc">
                <div class="linebar" style="background-color: #a0b5ef"></div>
                <div class="text">全球</div>
                <div class="linebar" style="background-color: #85c407"></div>
                <div class="text">中国</div>
              </div>
            </td>
          </tr>
        </table>
      </div>
    </template>

    <template v-if="yfmx.length">
      <div class="part-sub-title">适应症研发明细:</div>
      <div class="table">
        <table>
          <tr>
            <th>适应症</th>
            <th style="width: 60px">研发阶段</th>
            <th style="width: 60px">国家地区</th>
            <th style="width: 100px">原研单位</th>
            <th style="width: 100px">合作企业</th>
            <th style="width: 100px">许可单位</th>
            <th style="width: 75px">日期</th>
          </tr>
          <tr v-for="(row, idx) in yfmx" :key="idx">
            <td>
              <div>{{ row.indication || "-" }}</div>
            </td>
            <td>
              <div>{{ row.phase || "-" }}</div>
            </td>
            <td>
              <div>{{ row.country || "-" }}</div>
            </td>
            <td>
              <div>
                <p v-for="(t, i) in row.company_standard" :key="i">
                  <span>{{ t.name }}</span>
                </p>
                <p v-if="row.company_standard.length == 0">-</p>
              </div>
            </td>
            <td>
              <div>
                <p v-for="(t, i) in row.coo_company" :key="i">
                  <span>{{ t.name }}</span>
                </p>
                <p v-if="row.coo_company.length == 0">-</p>
              </div>
            </td>
            <td>
              <div>
                <p v-for="(t, i) in row.per_company" :key="i">
                  <span>{{ t.name }}</span>
                </p>
                <p v-if="row.per_company.length == 0">-</p>
              </div>
            </td>
            <td>
              <div>
                {{ row.date || "-" }}
              </div>
            </td>
          </tr>
        </table>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: "pdf-syz",
  props: {
    drugname_standard: {
      default: "",
      type: String,
    },
    company_standard: {
      default: "",
      type: String,
    },
    base: {
      default: () => ({}),
      type: Object,
    },
  },
  data() {
    return {
      ypz: [],
      yfjz: [],
      yfmx: [],
      global_line_map: [
        "#E5EFFE",
        "#C7DAFC",
        "#A6C3FD",
        "#7EABF9",
        "#4680FB",
        "#246AEE",
        "#002FA7",
      ],
      cn_line_map: [
        "#E1FBAE",
        "#CDF67C",
        "#BAE665",
        "#A7D356",
        "#86D252",
        "#74C600",
        "#5DB81B",
      ],
    };
  },
  methods: {
    findEnumIndex(num) {
      let enums = [10, 20, 30, 40, 50, 60, 70];
      return enums.findIndex((t) => t == num);
    },
    dataGet() {
      let drugname = this.drugname_standard;
      let company = this.company_standard;
      let get_ypz = Axios({
        method: "get",
        url: "/api/globaldrugs/drugindication",
        params: _.assign(
          {
            drugname_standard: drugname,
            company_standard: company,
            position: 1,
          },
          {
            accesstoken: GETCOOKIEFUN("accesstoken"),
          }
        ),
      });
      let get_syzyfjz = Axios({
        method: "get",
        url: "/api/globaldrugs/drugindication",
        params: _.assign(
          {
            drugname_standard: drugname,
            company_standard: company,
            position: 2,
            page: 1,
          },
          {
            accesstoken: GETCOOKIEFUN("accesstoken"),
          }
        ),
      });
      let get_yfmx = Axios({
        method: "get",
        url: "/api/globaldrugs/drugindication",
        params: _.assign(
          {
            drugname_standard: drugname,
            company_standard: company,
            position: 3,
            pageSize: 10,
          },
          {
            accesstoken: GETCOOKIEFUN("accesstoken"),
          }
        ),
      });
      return Axios.all([get_ypz, get_syzyfjz, get_yfmx]).then(
        Axios.spread((ypz, yfjz, yfmx) => {
          if (ypz.data.code == 200 && this.isEmpty(ypz.data.data)) {
            this.ypz = ypz.data.data.approved
              ? ypz.data.data.approved.list
              : [];
          }
          if (yfjz.data.code == 200 && this.isEmpty(yfjz.data.data)) {
            this.yfjz = yfjz.data.data.progress
              ? yfjz.data.data.progress.list
              : [];
          }
          if (yfmx.data.code == 200 && this.isEmpty(yfmx.data.data)) {
            this.yfmx = yfmx.data.data.detail ? yfmx.data.data.detail.list : [];
          }
        })
      );
    },
  },
  async mounted() {
    await this.dataGet();
    if ((this.ypz.length+this.yfjz.length+this.yfmx.length) == 0) {
      this.$root.$emit('hide-page','适应症')
    }
          this.$root.$emit("load-page", "适应症");
  },
};
</script>

<style scoped lang="less">
.part-title {
  font-size: 22px;
  font-weight: bold;
  color: #002fa7;
  margin-bottom: 10px;
  border-left: 4px solid #002fa7;
  line-height: 1;
  padding-left: 5px;
}
.part-sub-title {
  font-size: 16px;
  color: #333;
  margin-top: 10px;
  margin-bottom: 10px;
  border-left: 2px solid #002fa7;
  line-height: 1;
  padding-left: 5px;
  margin-left: 10px;
}
.table {
  position: relative;
  padding-left: 10px;
  min-height: 50px;
  table {
    width: 100%;
    border: 1px solid #ebeef5;
    border-collapse: collapse;
    border-spacing: 0;
    th {
      height: 30px;
      background-color: #ebeef5;
      font-size: 12px;
    }
    td {
      padding: 5px;
      border: 1px solid #ebeef5;
      word-break: break-all;
      font-size: 12px;
      & > div {
        font-size: 12px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
      }
    }
  }
}
.combine-head {
  display: flex;
  width: 420px;
  div {
    width: 60px;
  }
}
.line {
  width: 100%;
  white-space: nowrap;
  padding: 3px 0;
  box-sizing: border-box;
  height: 20px;
  &-item {
    height: 14px;
    border-radius: 7px;
    width: calc(100% / 6);
    position: relative;
    display: inline-flex;
    &:last-child {
      z-index: 10 !important;
    }
    .line-item_label {
      font-size: 12px;
      color: #fff;
      position: absolute;
      line-height: 14px;
      right: calc(20%);
    }
  }
}
.global_line {
  .dark {
    color: #35384a;
  }
}
.china_line {
  .dark {
    color: #35384a;
  }
}
.linebar {
  width: 30px;
  height: 3px;
  border-radius: 2px;
  margin-right: 5px;
}
.desc {
  display: flex !important;
  justify-content: flex-end;
  align-items: center;
}
.desc > .text {
  margin-right: 10px;
}
</style>