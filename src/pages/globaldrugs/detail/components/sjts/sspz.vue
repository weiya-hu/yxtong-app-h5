<template>
  <div class="sspz">
    <div class="notify">
      数据说明： 此处数据来自全球上市药品筛选系统，立即
      <a
        href="/globalapproval/list?ga_source=vip&ga_name=globaldrugs_sjts"
        target="_blank"
        onclick="_paq.push(['trackEvent', 'button', 'click', '全球药物2.0_数据透视_上市批准_进入数据库', ])"
        >进入数据库</a
      >
      查看更多数据。
    </div>
    <!-- 暂时隐藏 -->
    <div
      class="sub-section"
      v-waiting="timeline_loading"
      v-show="timeline_loading ^ (LC.length > 0)"
    >
      <div class="sub-section-title">
        <span>批准历程</span>
        <el-tooltip
          class="desc"
          effect="light"
          content="按照活性成分的最早批准时间排列。"
          placement="top-start"
        >
          <img
            style="width: 14px; height: 14px"
            src="/static/imgs/globaldrugs/qa.png"
            alt=""
          />
        </el-tooltip>
        <a
          v-if="qqsy_show"
          :href="`/globalapproval/detail?activeingredient=` + drugname_standard"
          target="_blank"
          onclick="_paq.push(['trackEvent', 'button', 'click', '全球药物2.0_数据透视_上市批准_全球视野', ])"
          class="qqsy_btn"
          >全球视野</a
        >
      </div>
      <div class="sub-section-content">
        <div class="timeline" v-waiting="timeline_loading">
          <div class="lichen">
            <div class="line"></div>
            <div
              v-for="(t, k) in LC"
              :key="k"
              :class="['lc-item', k % 2 == 1 ? 'down' : '']"
            >
              <div class="flex flex-ac">
                <img
                  style="width: 12px; height: 12px; margin-right: 5px"
                  :src="'/static/imgs/globalapproval/' + handlerIcon(t.source)"
                  alt=""
                />
                <span>{{ t.source }}</span>
              </div>
              <div style="color: #5c6973; font-size: 12px">
                {{ t.mindate }}
              </div>
              <div class="dot-sm"></div>
              <div class="dot-line"></div>
              <div class="dot-ll"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="sub-section" v-waiting="glob_loading" v-if="pzheadshow">
      <div class="sub-section-title">
        <span>批准信息</span>
      </div>
      <div class="sub-section-content">
        <div
          v-for="(pz, index) in pzhead"
          :key="index"
          v-show="pz.total"
          class="pz-section"
        >
          <div class="pz-section-title">
            <div style="display: flex; align-items: center">
              <img
                v-show="pz.icon"
                :src="pz.icon"
                style="width: 21px; margin-right: 5px"
                alt=""
              />
              <span style="color: #333">{{ pz.name }}</span>
              <span style="color: #9aa4b8">（{{ pz.total }}）</span>
              <el-tooltip
                v-if="pz.notify"
                class="desc"
                effect="light"
                :content="pz.notify"
                placement="top-start"
              >
                <img
                  style="width: 13px; height: 13px"
                  src="/static/imgs/globaldrugs/qa.png"
                  alt=""
                />
              </el-tooltip>
            </div>
            <div>
              <!-- <span>导出</span> -->
            </div>
          </div>
          <div class="pz-section-content">
            <el-table
              v-waiting="pz.loading"
              :data="pz.state"
              class="sspz-table"
              style="width: 100%"
            >
              <el-table-column
                v-for="item in pztablehead"
                :prop="item.field"
                :min-width="item.field_width || item.width || 100"
                :key="item.field"
                :label="item.label"
              >
                <template :slot="1 ? 'header' : ''" slot-scope="scope">
                  <span>
                    {{ item.label }}
                  </span>
                  <el-tooltip
                    v-if="item.statement"
                    class=""
                    effect="zhuce"
                    placement="right"
                  >
                    <div slot="content" v-html="item.statement"></div>
                    <i
                      class="el-icon-question cl-green"
                      style="margin-left: 4px; line-height: 28px"
                    ></i>
                  </el-tooltip>
                </template>
                <template slot-scope="scope">
                  <div
                    v-if="vueCheckListPms('Globalapproval', item.label)"
                    :title="scope.row[item.field]"
                  >
                    <!-- drugid字段需要配合source字段点击跳转到对应数据库的详情页 -->
                    <template v-if="item.field === 'drugid'">
                      <template v-if="scope.row.link.id">
                        <span
                          class="drugid link-underline"
                          @click="goDetail(scope.row)"
                          >{{ scope.row[item.field] || "—" }}</span
                        >
                      </template>
                      <span v-else>{{ scope.row[item.field] || "—" }}</span>
                    </template>

                    <template v-else-if="item.field === 'activeingredient'">
                      <router-link
                        :to="`/globalapproval/detail?activeingredient=${scope.row['activeingredient']}`"
                        tag="a"
                        target="_blank"
                        style="color: #4877e8"
                        >{{ scope.row["activeingredient"] }}</router-link
                      >
                    </template>
                    <template v-else-if="item.field == 'fensantu'">
                      <router-link
                        :to="`/globalapproval/scatter-graph?keyword=${scope.row['activeingredient']}`"
                        tag="a"
                        target="_blank"
                        style="color: #4877e8"
                        v-if="scope.row['activeingredient']"
                      >
                        查看</router-link
                      >
                    </template>
                    <template v-else
                      ><span>{{ scope.row[item.field] }}</span>
                    </template>
                  </div>
                  <span v-else class="abandon-click-method">暂无权限</span>
                </template>
              </el-table-column>
              <template slot="append">
                <el-pagination
                  @current-change="handleCurrentChange(pz, index, $event)"
                  :current-page="pz.page"
                  :page-size="10"
                  layout="total, prev, next"
                  hide-on-single-page
                  :total="pz.total"
                >
                </el-pagination>
              </template>
            </el-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
// 上市批准
export default {
  name: "sspz",
  data() {
    return {
      timeline_loading: false,
      namemap: {
        us: "美国",
        cn: "中国",
        de: "德国",
        en: "英国",
        cntw: "中国台湾",
        jp: "日本",
      },
      imgmap: {
        美国: "/static/imgs/globaldrugs/detail/us.png",
        中国: "/static/imgs/globaldrugs/detail/cn.png",
        德国: "/static/imgs/globaldrugs/detail/de.png",
        英国: "/static/imgs/globaldrugs/detail/en.png",
        中国台湾: "/static/imgs/globaldrugs/detail/cn.png",
        日本: "/static/imgs/state/icons/Japan.png",
        欧盟EMA: "/static/imgs/state/icons/European Union.png",
        欧盟HMA: "/static/imgs/state/icons/European Union.png",
      },
      LC: [],
      qqsy_show: false,
      // 上市批准 板块
      pzhead: [
        {
          name: "中国",
          key: "中国",
          icon: "/static/imgs/state/icons/China.png",
          state: [],
          loading: false,
          num: 6,
          page: 0,
          total: 0,
          notify: "不含批文已过期数据。",
        },
        {
          name: "中国台湾",
          key: "中国台湾",
          icon: "/static/imgs/state/icons/China.png",
          state: [],
          loading: false,
          num: 6,
          page: 0,
          total: 0,
          notify: "",
        },
        {
          name: "美国",
          key: "美国",
          icon: "/static/imgs/state/icons/United States of America.png",
          state: [],
          loading: false,
          num: 6,
          page: 0,
          total: 0,
          notify: "",
        },
        {
          name: "欧盟",
          key: "欧盟",
          icon: "/static/imgs/state/icons/European Patent Office.png",
          state: [],
          loading: false,
          num: 6,
          page: 0,
          total: 0,
          notify: "",
        },
        {
          name: "日本",
          key: "日本",
          icon: "/static/imgs/state/icons/Japan.png",
          state: [],
          loading: false,
          num: 6,
          page: 0,
          total: 0,
          notify: "",
        },
        {
          name: "其他国家或地区",
          key: "其他",
          icon: "",
          state: [],
          loading: false,
          num: 6,
          page: 0,
          total: 0,
          notify: "",
        },
      ],
      // 批准的 table 表头渲染  根据接口来
      pztablehead: [
        {
          label: "批准号",
          statement: "<p>包括中国批准文号及美国申请号等。</p>",
          sort: "20",
          new_type: "1",
          readtype: "默认读取",
          field: "drugid",
          field_width: "150",
        },
        {
          label: "药品名称",
          sort: "19",
          new_type: "1",
          readtype: "默认读取",
          field: "name",
          field_width: "200",
        },
        {
          label: "企业名称",
          sort: "16",
          new_type: "1",
          readtype: "默认读取",
          field: "company",
          field_width: "200",
        },

        {
          label: "剂型",
          sort: "14",
          new_type: "1",
          readtype: "默认读取",
          field: "zwform",
          field_width: "100",
        },
        {
          label: "批准日期",
          sort: "12",
          order: "1",
          order_field: "date",
          new_type: "1",
          readtype: "默认读取",
          field: "date",
          field_width: "150",
        },
        {
          label: "国家或地区",
          sort: "11",
          new_type: "1",
          readtype: "默认读取",
          field: "source",
          field_width: "120",
        },
      ],
      glob_loading: false,
    };
  },
  computed: {
    ...mapState({
      nopms: (state) => state.Globalapproval.nopms,
    }),
    pzheadshow() {
      let total = this.pzhead.reduce((p, c) => p + (c.total || 0), 0);
      return total;
    },
  },
  methods: {
    goDetail(row) {
      let urlObj = {
        path: "",
      };
      if (row.source === "中国") {
        // tip 1国产
        if (row.link.tp == 1) {
          urlObj.path = `/cfdadrug/detail/${row.link.id}`;
          urlObj.query = {
            pizhunwenhao: row.link.pizhunwenhao,
          };
        } else {
          urlObj.path = `/cfdadrug/jkdetail/${row.link.id}`;
          urlObj.query = {
            pizhunwenhao: row.link.pizhunwenhao,
          };
        }
      } else if (row.source === "美国") {
        urlObj.path = `/fdadrugnew/${row.link.id}`;
      } else if (row.source === "欧盟EMA") {
        urlObj.path = `/epyp/emadetail/${row.link.id}`;
      } else if (row.source === "欧盟HMA") {
        urlObj.path = `/epyp/hmadetail/${row.link.id}`;
      } else if (row.source === "日本") {
        urlObj.path = `/pmda/${row.link.id}`;
      } else if (row.source === "英国") {
        urlObj.path = `/uk/${row.link.id}`;
      } else if (row.source === "中国台湾") {
        urlObj.path = `/taiwan/${row.link.id}`;
      } else if (row.source === "德国") {
        urlObj.path = `/germany/${row.link.id}`;
      } else if (row.source === "加拿大") {
        urlObj.path = `/canada/${row.link.id}`;
      } else if (row.source === "法国") {
        urlObj.path = `/france/${row.link.id}`;
      } else if (row.source === "印度") {
        urlObj.path = `/india/${row.link.id}`;
      } else if (row.source === "韩国") {
        urlObj.path = `/korean/${row.link.id}`;
      }
      let routeData = this.$router.resolve(urlObj);
      window.open(routeData.href, "_blank");
      console.log(row);
    },
    handlerIcon(source) {
      let icon = "";
      switch (source) {
        case "美国":
          icon = "United States of America";
          break;
        case "中国":
        case "中国台湾":
          icon = "China";
          break;
        case "日本":
          icon = "Japan";
          break;
        case "英国":
          icon = "Great Britain";
          break;
        case "法国":
          icon = "France";
          break;
        case "德国":
          icon = "Germany";
          break;
        case "加拿大":
          icon = "Canada";
          break;
        case "印度":
          icon = "India";
          break;
        case "欧盟EMA":
        case "欧盟HMA":
          icon = "Europe";
          break;
        case "韩国":
          icon = "South Korea";
          break;
      }
      icon += ".png";
      return icon;
    },
    handleCurrentChange(item, index, e) {
      this.pzhead[index].loading = true;
      this.getPizunInfo(item, e).then((res) => {
        if (res.data.code == 200) {
          this.pzhead[index].state = res.data.data.res;
          this.pzhead[index].total = res.data.data.count || 0;
          this.pzhead[index].page = res.data.data.page;
        }
        this.pzhead[index].loading = false;
      });
    },
    // /api/globalapproval
    getPizunInfo(item, page = 1) {
      return Axios({
        url: "/api/report/globalapproval",
        params: {
          ylbm: this.drugname_standard,
          englishname: this.drugname_standard,
          // company: this.company_standard,
          source: item.key,
          page,
          pageSize: 10,
        },
      });
    },
    getPizun() {
      // /api/globalapproval/infoAggs/activeingredient/dupilumab
      this.timeline_loading = true;
      const drugname_standard = this.drugname_standard;
      Axios({
        url:
          "/api/globalapproval/infoAggs/activeingredient/" + drugname_standard,
        params: {
          action: "pizhun",
        },
      }).then((res) => {
        this.timeline_loading = false;
        if (res.data.code == 200) {
          this.LC = res.data.data;
          Axios({
            url:
              "/api/globalapproval/read/activeingredient/" + drugname_standard,
          }).then((res) => {
            if (res.data.code == 200) {
              this.qqsy_show = true;
            }
          });
        }
      });
    },
    getInitState() {
      const requests = this.pzhead.map((item) => {
        // item.loading = true;
        return this.getPizunInfo(item);
      });
      this.glob_loading = true;
      Axios.all(requests).then(
        Axios.spread((...res) => {
          this.glob_loading = false;
          res.forEach((resp, index) => {
            if (resp.data.code == 200) {
              this.pzhead[index].state = resp.data.data.res;
              this.pzhead[index].total = resp.data.data.count;
              this.pzhead[index].page = resp.data.data.page;
            }
            // this.pzhead[index].loading = false;
          });
        })
      );
    },
    getTableConf() {
      // /api/config/view?dbname=globalapproval
      Axios({
        url: "/api/config/view?dbname=globalapproval",
      }).then((res) => {
        if (res.data.code == 200) {
          this.pztablehead = res.data.data.tableconf.filter(
            (t) => t.hidden != 1
          );
        }
      });
    },
  },
  props: {
    drugname_standard: {
      default: "",
      type: String,
    },
    company_standard: {
      default: "",
      type: String,
    },
  },
  mounted() {
    this.getPizun();
    // this.getTableConf();
    this.getInitState();
  },
};
</script>

<style scoped lang="less">
@import url(../table-style.less);
.qqsy_btn {
  position: absolute;
  right: 10px;
  font-size: 12px;
  background-color: #002fa7;
  color: #fff;
  text-decoration: none;
  width: 60px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  border-radius: 3px;
}
.sspz {
  padding: 10px;
  position: relative;
  .notify {
    font-size: 13px;
    a {
      color: #002fa7;
      text-decoration: underline;
      // font-size: 14px;
    }
  }
  span {
    line-height: 1;
  }
  .sub-section-title {
    display: flex;
    align-items: center;
    font-size: 14px;
    img {
      margin-left: 5px;
    }
  }
  .timeline {
    overflow: auto;
    position: relative;
  }
  .lichen {
    background-color: #fafbfd;
    border-radius: 3px;
    height: 155px;
    display: flex;
    width: fit-content;
    padding: 9px 120px;
    box-sizing: border-box;
    position: relative;
    min-width: 100%;
    .line {
      width: 100%;
      height: 1px;
      background-color: #dcdfe6;
      position: absolute;
      top: 50%;
      left: 0;
      z-index: 0;
    }
    .lc-item {
      width: 163px;
      align-self: flex-start;
      display: flex;
      flex-direction: column;
      position: relative;
      z-index: 1;
      user-select: none;
      cursor: pointer;
      &.down {
        align-self: flex-end;
        flex-direction: column-reverse;
      }
      &:hover {
        .dot-ll {
          border-color: #002fa7;
          background-color: #002fa7;
        }
      }
    }
    .flex {
      display: flex;
    }
    .flex-ac {
      align-items: center;
    }
    .dot-sm {
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background-color: #002fa7;
      transform: translateX(-50%);
    }
    .dot-line {
      height: 27px;
      border-left: dotted 1px #ebeef5;
    }
    .dot-ll {
      width: 10px;
      height: 10px;
      border: 1px solid #ebeef5;
      box-sizing: border-box;
      border-radius: 50%;
      transform: translateX(-50%);
      background-color: #fff;
    }
  }
  .pz-section {
    margin-bottom: 10px;
    &-title {
      padding: 10px 0;
      display: flex;
      justify-content: space-between;
    }
  }
}
/deep/.sspz-table.el-table {
  tbody td > .cell {
    padding: 8px 14px;
  }
  .link-underline {
    display: inline;
  }
}
</style>
