<template>
  <div class="ypsms">
    <div class="part-title">药品说明书</div>
    <template v-for="(pz, index) in pzhead">
      <div :key="index" v-if="pz.total" class="pz-section">
        <div class="pz-section-title">
          <div style="display: flex; align-items: center">
            <img :src="pz.icon" style="width: 21px; margin-right: 5px" alt="" />
            <span style="color: #333">{{ pz.name }}</span>
            <span style="color: #9aa4b8">（{{ pz.total }}）</span>
          </div>
        </div>
        <div class="pz-section-content">
          <div class="table">
            <table>
              <tr>
                <th v-for="item in pz.tablehead" :key="item.field"
                :style="{width: item.field_width+'px'}"
                >
                  {{ item.label }}
                </th>
              </tr>
              <tr v-for="(row, idx) in pz.state" :key="idx">
                <td v-for="item in pz.tablehead" :key="item.field + '_' + idx">
                  <div v-if="index == 'cn'" :title="row[item.field]">
                    <div v-if="item.field == 'name'">
                      <div class="table-name">
                        <a v-if="row.xiangqing === 1" class="cl-blue"
                          >{{ row.name
                          }}{{
                            row.shangpinname ? `(${row.shangpinname})` : ""
                          }}</a
                        >
                        <a v-if="row.xiangqing === 0" class="cl-blue"
                          >{{ row.name
                          }}{{
                            row.shangpinname ? `(${row.shangpinname})` : ""
                          }}</a
                        >
                        <span
                          class="instruct-icon icon-green"
                          v-if="row.xiangqing == 0"
                          title="图片"
                          >图</span
                        >
                        <span
                          class="instruct-icon icon-yellow"
                          v-else-if="row.xiangqing === 1"
                          title="文本"
                          >文</span
                        >
                        <span
                          class="instruct-icon"
                          v-if="row.yibao"
                          title="国家医保"
                          >医保</span
                        >
                        <!-- <span v-else>{{ row.name }}</span> -->
                      </div>
                    </div>
                    <div v-else-if="item.field == 'zuixinxiugairi'">
                      {{ row.zuixinxiugairi ? row.zuixinxiugairi : "/" }}
                    </div>

                    <!-- 放开后显示包装图片 -->
                    <div v-else-if="item.field == 'urls'">请在网页版查看</div>

                    <div v-else>
                      <span
                        v-if="vueCheckListPms('ShuomingshuZg', item.label)"
                        >{{ row[item.field] }}</span
                      >
                      <span v-else class="abandon-click-method">暂无权限</span>
                    </div>
                  </div>
                  <div v-else-if="index == 'us'" :title="row[item.field]">
                    <div v-if="item.field == 'drugname'">
                      <a v-if="row.docurl" class="cl-blue">{{
                        row.drugname
                      }}</a>
                      <span v-else>{{ row.drugname }}</span>
                    </div>
                    <div v-else>
                      {{ row[item.field] }}
                    </div>
                  </div>
                  <div v-else-if="index == 'jp'" :title="row[item.field]">
                    <!-- {{index+defaultFiled[index].label+""}} -->
                    <div
                      v-if="item.label == '药品名称' && item.field == 'name'"
                    >
                      <a v-if="row.file_path" class="cl-blue">{{ row.name }}</a>
                      <span v-else>{{ row[item.field] }}</span>
                    </div>
                    <div v-else>{{ row[item.field] }}</div>
                  </div>
                  <div v-else :title="row[item.field]">
                    <div
                      v-if="item.label == '药品名称' && item.field == 'name'"
                    >
                      <a v-if="row.id" class="cl-blue">{{ row.name }}</a>
                      <span v-else>{{ row.name }}</span>
                    </div>
                    <div v-else>{{row[item.field]}}</div>
                  </div>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: "pdf-ypsms",
  data() {
    return {
      pzhead: {
        cn: {
          name: "中国",
          key: "instruct",
          icon: "/static/imgs/state/icons/China.png",
          num: 6,
          page: 0,
          total: 0,
          tablehead: [],
          state: [],
          loading: false,
        },
        us: {
          name: "美国",
          key: "fdalabel",
          icon: "/static/imgs/state/icons/United States of America.png",
          num: 6,
          page: 0,
          total: 0,
          tablehead: [],
          state: [],
          loading: false,
        },
        jp: {
          name: "日本",
          key: "jp_shuomingshu",
          icon: "/static/imgs/state/icons/Japan.png",
          num: 6,
          page: 0,
          total: 0,
          tablehead: [],
          state: [],
          loading: false,
        },
        uni: {
          name: "超说明书",
          key: "unlabeleduse",
          icon: "/static/imgs/state/icons/China.png",
          num: 6,
          page: 0,
          total: 0,
          tablehead: [],
          state: [],
          loading: false,
        },
      },
      // 批准的 table 表头渲染  根据接口来
      pztablehead: [
        { label: "药品名称", key: "ypmc" },
        { label: "来源", key: "ly" },
        { label: "更新时间", key: "gxsj" },
        { label: "文件下载", key: "download" },
      ],
    };
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
  methods: {
    // 获取 表头
    // /api/config/view?dbname=instruct
    getTableHead() {
      const requests = Object.values(this.pzhead).map((t) =>
        Axios({
          url: "/api/config/view?dbname=" + t.key,
        })
      );
      Axios.all(requests).then(
        Axios.spread((cn, us, jp, uni) => {
          if (cn.data.code == 200)
            this.pzhead.cn.tablehead = cn.data.data.tableconf.filter(
              (t) => t.hidden != 1
            );
          if (us.data.code == 200)
            this.pzhead.us.tablehead = us.data.data.tableconf.filter(
              (t) => t.hidden != 1
            );
          if (jp.data.code == 200)
            this.pzhead.jp.tablehead = jp.data.data.tableconf.filter(
              (t) => t.hidden != 1
            );
          if (uni.data.code == 200)
            this.pzhead.uni.tablehead = uni.data.data.tableconf.filter(
              (t) => t.hidden != 1
            );
        })
      );
    },
    // /api/instruct 中国说明书
    getChinaInstruct(page = 1) {
      // const { drugname_standard, company_standard } = this.$route.query;
      this.pzhead.cn.page = page;
      this.pzhead["cn"].loading = true;
      return Axios({
        url: "/api/instruct",
        params: {
          name: this.drugname_standard,
          // source: this.company_standard,
          page,
          pageSize: 10,
        },
      });
    },
    // /api/fdalabel 美国说明书
    getUsInstruct(page = 1) {
      const { drugname_standard, company_standard } = this.$route.query;
      this.pzhead["us"].loading = true;

      return Axios({
        url: "/api/fdalabel",
        params: {
          drugname: this.drugname_standard,
          // sponsorapplicant: this.company_standard,
          page,
          pageSize: 10,
        },
      });
    },
    // /api/jp_shuomingshu 日本说明书
    getJpInstruct(page = 1) {
      // const { drugname_standard, company_standard } = this.$route.query;
      this.pzhead["jp"].loading = true;

      return Axios({
        url: "/api/jp_shuomingshu",
        params: {
          name: this.drugname_standard,
          // commany_name: this.company_standard,
          page,
          pageSize: 10,
        },
      });
    },
    // /api/unlabeleduse 超级说明书
    getUniInstruct(page = 1) {
      // const { drugname_standard, company_standard } = this.$route.query;
      this.pzhead["uni"].loading = true;
      return Axios({
        url: "/api/unlabeleduse",
        params: {
          name: this.drugname_standard,
          page,
          pageSize: 10,
        },
      });
    },

    getPageState() {
      Axios.all([
        this.getChinaInstruct(),
        this.getUsInstruct(),
        this.getJpInstruct(),
        this.getUniInstruct(),
      ])
        .then(
          Axios.spread((cn, us, jp, uni) => {
            if (cn.data.code == 200) {
              this.pzhead.cn.state = cn.data.data.List.res;
              this.pzhead.cn.total = cn.data.data.List.count;
            }
            if (us.data.code == 200) {
              this.pzhead.us.state = us.data.data.List.res;
              this.pzhead.us.total = us.data.data.List.count;
              this.pzhead.us.page = us.data.data.List.page;
            }
            if (jp.data.code == 200) {
              this.pzhead.jp.state = jp.data.data.List.res;
              this.pzhead.jp.total = jp.data.data.List.count;
              this.pzhead.jp.page = jp.data.data.List.page;
            }
            if (uni.data.code == 200) {
              this.pzhead.uni.state = uni.data.data.List.res;
              this.pzhead.uni.total = uni.data.data.List.count;
              this.pzhead.uni.page = uni.data.data.List.page;
            }
          })
        )
        .finally(() => {
          this.pzhead["cn"].loading = false;
          this.pzhead["us"].loading = false;
          this.pzhead["jp"].loading = false;
          this.pzhead["uni"].loading = false;
        });
    },
  },
  async mounted() {
    this.getTableHead();
    await this.getPageState();
    let state_arr = Object.values(this.pzhead);
    if (state_arr.every(item => item.state.length == 0)) {
        this.$root.$emit('hide-page','药品说明书')
    }
          this.$root.$emit("load-page", "药品说明书");
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
.pz-section {
  margin-bottom: 10px;
  &-title {
    padding: 10px 0;
    display: flex;
    justify-content: space-between;
  }
}
.instruct-icon {
  background-color: #4877e8;
  color: #fff;
  border-radius: 10px;
  padding: 0px 10px;
  display: inline-block;
  font-size: 12px;
  // height: 20px;
  line-height: 14px;
}
.icon-orange {
  background-color: #f77d54;
}
.icon-yellow {
  background-color: rgba(245, 166, 35);
}
.icon-green {
  background-color: #90c31f;
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
.cl-blue {
  color: #4877e8;
}
</style>