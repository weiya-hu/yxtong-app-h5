<template>
  <div class="ypsms">
    <div class="notify">
      数据说明： 此处数据来自药品说明书，立即
      <a href="/instruct?ga_source=vip&ga_name=globaldrugs_sjts" target="_blank"
      onclick="_paq.push(['trackEvent', 'button', 'click', '全球药物2.0_数据透视_药品说明书_进入数据库', ])"
        >进入数据库</a
      >
      查看更多数据。
    </div>
    <template v-for="(pz, index) in pzhead">
      <div :key="index" v-if="pz.total" class="pz-section">
        <div class="pz-section-title">
          <div style="display: flex; align-items: center">
            <img :src="pz.icon" style="width: 21px; margin-right: 5px" alt="" />
            <span style="color: #333">{{ pz.name }}</span>
            <span style="color: #9aa4b8">（{{ pz.total }}）</span>
          </div>
          <div>
            <!-- <span>导出</span> -->
          </div>
        </div>
        <div class="pz-section-content">
          <el-table
            v-waiting="pz.loading"
            :subname="index"
            :data="pz.state"
            style="width: 100%"
          >
            <el-table-column
              v-for="item in pz.tablehead"
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
              <!-- 中国 -->
              <template slot-scope="scope">
                <div v-if="index == 'cn'" :title="scope.row[item.field]">
                  <div v-if="item.field == 'name'">
                    <div class="table-name">
                      <a
                        v-if="scope.row.xiangqing === 1"
                        class="cl-blue"
                        @click="
                          handleCardClick(scope.row.id, scope.row.xiangqing)
                        "
                        >{{ scope.row.name
                        }}{{
                          scope.row.shangpinname
                            ? `(${scope.row.shangpinname})`
                            : ""
                        }}</a
                      >
                      <a
                        v-if="scope.row.xiangqing === 0"
                        class="cl-blue"
                        href="javascript:void;"
                        @click="downloadFile(scope.row.down)"
                        >{{ scope.row.name
                        }}{{
                          scope.row.shangpinname
                            ? `(${scope.row.shangpinname})`
                            : ""
                        }}</a
                      >
                      <span
                        class="instruct-icon icon-green"
                        v-if="scope.row.xiangqing == 0"
                        title="图片"
                        >图</span
                      >
                      <span
                        class="instruct-icon icon-yellow"
                        v-else-if="scope.row.xiangqing === 1"
                        title="文本"
                        >文</span
                      >
                      <span
                        class="instruct-icon"
                        v-if="scope.row.yibao"
                        title="国家医保"
                        >医保</span
                      >
                      <!-- <span v-else>{{ scope.row.name }}</span> -->
                    </div>
                  </div>
                  <div
                    v-else-if="item.field == 'zuixinxiugairi'"
                    :title="getAllXiugairi(scope.row.xiugairi)"
                  >
                    {{
                      scope.row.zuixinxiugairi ? scope.row.zuixinxiugairi : "/"
                    }}
                  </div>

                  <!-- 放开后显示包装图片 -->
                  <div v-else-if="item.field == 'urls'">
                    <imgShow
                      :url="scope.row.urls ? scope.row.urls : scope.row.url"
                    ></imgShow>
                  </div>

                  <div v-else>
                    <span v-if="vueCheckListPms('ShuomingshuZg', item.label)">{{
                      scope.row[item.field]
                    }}</span>
                    <span v-else class="abandon-click-method">暂无权限</span>
                  </div>
                </div>
                <div v-else-if="index == 'us'" :title="scope.row[item.field]">
                  <div v-if="item.field == 'drugname'">
                    <a
                      v-if="scope.row.docurl"
                      class="cl-blue"
                      :href="scope.row.docurl"
                      target="_blank"
                      >{{ scope.row.drugname }}</a
                    >
                    <span v-else>{{ scope.row.drugname }}</span>
                  </div>
                  <div v-else>
                    {{ scope.row[item.field] }}
                  </div>
                </div>
                <div v-else-if="index == 'jp'" :title="scope.row[item.field]">
                  <!-- {{index+defaultFiled[index].label+""}} -->
                  <div v-if="item.label == '药品名称' && item.field == 'name'">
                    <a
                      v-if="scope.row.file_path"
                      class="cl-blue"
                      :href="'//zy.yaozh.com/' + scope.row.file_path"
                      target="_blank"
                      >{{ scope.row.name }}</a
                    >
                    <span v-else>{{ scope.row[item.field] }}</span>
                  </div>
                  <div v-else>{{ scope.row[item.field] }}</div>
                </div>
                <div v-else :title="scope.row[item.field]">
                  <div v-if="item.label == '药品名称' && item.field == 'name'">
                    <a
                      v-if="scope.row.id"
                      class="cl-blue"
                      :href="'/unlabeleduse/' + scope.row.id"
                      target="_blank"
                      >{{ scope.row.name }}</a
                    >
                    <span v-else>{{ scope.row.name }}</span>
                  </div>
                  <div v-else>
                    {{scope.row[item.field]}}
                  </div>
                </div>
              </template>
            </el-table-column>
            <template slot="append">
              <el-pagination
                @current-change="handleCurrentChange(index, $event)"
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
    </template>
  </div>
</template>

<script>
import imgShow from "@/components/common/imgShow";

// 药品说明书
export default {
  name: "ypsms",
  components: { imgShow },
  data() {
    return {
      // 上市批准 板块
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
  methods: {
    handleCurrentChange(index, e) {
      const datamap = {
        cn: this.getChinaInstruct,
        us: this.getUsInstruct,
        jp: this.getJpInstruct,
        uni: this.getUniInstruct,
      };
      this.pzhead[index].loading = true;
      datamap[index](e).then((res) => {
        this.pzhead[index].loading = false;
        if (res.data.code == 200) {
          this.pzhead[index].state = res.data.data.List.res;
          this.pzhead[index].total = res.data.data.List.count;
          this.pzhead[index].page = res.data.data.List.page || e;
        }
      });
    },
    getAllXiugairi(arr) {
      let str = "";
      arr.forEach((element, index) => {
        str += element;
        if (index !== arr.length - 1) {
          str += ",";
        }
      });
      return str;
    },
    handleCardClick(id, type) {
      if (type && type === 1) {
        let href = "/instruct/" + id;
        window.open(href, "_blank");
      }
    },
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
      return Axios.all([
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
  mounted() {
    this.getTableHead();
    this.getPageState();
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
};
</script>

<style scoped lang="less">
@import url(../table-style.less);
@import "~@/assets/less/var.less";
.notify {
  font-size: 13px;
  a {
    color: #002fa7;
    text-decoration: underline;
    // font-size: 14px;
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
.instruct-icon {
  background-color: @Blue;
  color: #fff;
  border-radius: 10px;
  padding: 0px 10px;
  display: inline-block;
  font-size: 12px;
  // height: 20px;
  line-height: 14px;
}
.icon-orange {
  background-color: @Orange;
}
.icon-yellow {
  background-color: rgba(245, 166, 35);
}
.icon-green {
  background-color: @Green;
}
</style>