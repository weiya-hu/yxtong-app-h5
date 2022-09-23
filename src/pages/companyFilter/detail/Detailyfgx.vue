<template>
  <div class="companyfilter-yfgx">
    <div class="content-title line-title">
      <span>研发管线</span>
      <div>
        <span class="title">状态时间：</span>

        <el-date-picker
          v-model="params.start"
          type="date"
          :picker-options="startPickerOptions"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          size="mini"
          @change="handleChangeStart"
          placeholder="选择日期"
          clearable
        >
        </el-date-picker>
        <span style="margin: 0 8px; color: #dfe5f1">-</span>
        <el-date-picker
          v-model="params.end"
          type="date"
          size="mini"
          :picker-options="endPickerOptions"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          @change="handleChangeEnd"
          placeholder="选择日期"
          clearable
        >
        </el-date-picker>

        <span @click="getCompanyLines" class="btn-line">确定</span>
      </div>
    </div>
    <LoadingGif
      :className="'list-in-loading'"
      :classNameImg="'little-size-loading'"
      :loadFlag="isLoading"
      v-if="isLoading"
    ></LoadingGif>
    <div class="line-box" v-else>
      <div class="gsxx-title">研发管线概览</div>
      <el-table
        class="line-table"
        :data="lineTotalData"
        fixed
        :header-cell-style="{
          background: '#F5F6FA',
          color: '#333333',
          fontSize: '14px',
          fontWeight: 'bold',
        }"
      >
        <el-table-column
          v-for="item in lineTotalHead"
          :prop="item.prop"
          :min-width="item.width || 80"
          :key="item.prop"
          :label="item.label"
          :align="'center'"
        >
          <template slot-scope="scope">
            <!-- 地区 -->
            <template v-if="item.prop == 'type'">
              <div
                style="
                  display: flex;
                  align-items: center;
                  justify-content: center;
                "
              >
                <img
                  src="/static/imgs/globaldrugs/glob.png"
                  width="20"
                  height="20"
                  alt=""
                  class="img-map"
                  v-if="scope.row.type.indexOf('全球') > -1"
                />
                <img
                  src="/static/imgs/globaldrugs/cn.png"
                  width="20"
                  height="20"
                  alt=""
                  v-else
                  class="img-map"
                />
                <span>{{ scope.row.type }}</span>
              </div>
            </template>

            <!-- 全部 -->
            <template v-else-if="item.prop == 'allcount'">
              <span>{{ scope.row.allcount }}</span>
            </template>

            <template v-else>
              <span
                v-if="scope.row[item.prop] > 0"
                style="
                  color: #4877E8;
                  cursor: pointer;
                  display: inline-block;
                  padding: 0 7px;
                "
                @click="goToListOne(scope.row, item.prop)"
              >
                {{ scope.row[item.prop] }}
              </span>
              <span v-else>{{ scope.row[item.prop] }}</span>
            </template>
          </template>
        </el-table-column>
      </el-table>

      <div class="gsxx-title" style="display: flex; align-items: center">
        研发管线详情
        <el-tooltip
          class="desc"
          effect="light"
          :content="'此处列表按治疗领域展示，多适应症的药品可能会重复出现。'"
          placement="right"
        >
          <span class="section-ico-qa"></span>
        </el-tooltip>
      </div>
      <el-table
        class="detail-table"
        :data="lineDetailData"
        fixed
        stripe
        :cell-class-name="cellClassFn"
        :span-method="objectSpanMethod"
        :header-cell-style="{
          background: '#F5F6FA',
          color: '#333333',
          fontSize: '14px',
          fontWeight: 'bold',
        }"
      >
        <el-table-column
          v-for="item in lineDetailHead"
          :prop="item.prop"
          :min-width="item.width || 80"
          :key="item.prop"
          :label="item.label"
        >
          <!-- 自定义表头 -->
          <template :slot="'header'" slot-scope="scope">
            <div v-if="item.prop === 'phase'" class="phase-title-box">
              <div>临床前</div>
              <div>临床申请</div>
              <div>临床Ⅰ期</div>
              <div>临床Ⅱ期</div>
              <div>临床Ⅲ期</div>
              <div>注册申请</div>
              <div>批准上市</div>
            </div>
            <span v-else>
              {{ item.label }}
            </span>
          </template>
          <template slot-scope="scope">
            <div>
              <!-- 药品名称 -->
              <template v-if="item.prop === 'drugname_standard'">
                <a
                  tag="a"
                  class="cl-blue"
                  @click="
                    goToDetail(
                      scope.row.hash_drugname_standard,
                      scope.row.hash_company
                    )
                  "
                  :title="scope.row.drugname_standard"
                  >{{ scope.row.drugname_standard }}</a
                >
              </template>

              <!-- 靶点 -->
              <template v-else-if="item.prop === 'targets_abbr'">
                <template v-if="scope.row.targets_abbr">
                  <router-link
                    v-for="(tar, index) in scope.row.targets_abbr_arr"
                    class="link"
                    :key="index"
                    target="_blank"
                    :to="`/globaldrugs/target/detail?target=${encodeURIComponent(
                      tar.hash_name
                    )}`"
                  >
                    {{ tar.name }}
                    <span v-if="index !== scope.row.targets_abbr_arr.length - 1"
                      >;</span
                    >
                  </router-link>
                </template>
                <span v-else>-</span>
              </template>

              <!-- 药品分类 -->
              <template v-else-if="item.prop === 'leixing2'">
                <div
                  :title="scope.row.leixing2"
                  v-if="scope.row.leixing2"
                  class="leixing2"
                >
                  {{ scope.row.leixing2 }}
                </div>
                <span v-else>-</span>
              </template>

              <!-- 适应症 -->
              <template v-else-if="item.prop === 'zaiyan_indication'">
                <el-popover
                  placement="left"
                  width="260"
                  trigger="hover"
                  v-if="
                    scope.row.zaiyan_indication ||
                    scope.row.pizhun_indication ||
                    scope.row.zhongzhi_indication
                  "
                >
                  <div class="globaldrugs-company-content">
                    <img
                      class="trangle"
                      src="/static/imgs/globaldrugs/tooltip.png"
                      alt=""
                    />
                    <div class="max-content">
                      <div class="content" v-if="scope.row.zaiyan_indication">
                        <span class="title" style="width: 52px; color: #333"
                          >在研：</span
                        ><span class="info">
                          <div
                            v-for="(
                              item, index
                            ) in scope.row.zaiyan_indication.split(';')"
                            :key="item"
                          >
                            {{ item }}
                            <span
                              v-if="
                                index !==
                                scope.row.zaiyan_indication.split(';').length -
                                  1
                              "
                              >;</span
                            >
                          </div>
                        </span>
                      </div>

                      <div class="content" v-if="scope.row.pizhun_indication">
                        <span class="title" style="width: 52px; color: #5c6973"
                          >已批准：</span
                        ><span class="info" style="color: #5c6973">
                          <div
                            v-for="(
                              item, index
                            ) in scope.row.pizhun_indication.split(';')"
                            :key="item"
                          >
                            {{ item }}
                            <span
                              v-if="
                                index !==
                                scope.row.pizhun_indication.split(';').length -
                                  1
                              "
                              >;</span
                            >
                          </div>
                        </span>
                      </div>

                      <div class="content" v-if="scope.row.zhongzhi_indication">
                        <span class="title" style="width: 52px; color: #5c6973"
                          >终止：</span
                        ><span class="info" style="color: #5c6973">
                          <div
                            v-for="(
                              item, index
                            ) in scope.row.zhongzhi_indication.split(';')"
                            :key="item"
                          >
                            {{ item }}
                            <span
                              v-if="
                                index !==
                                scope.row.zhongzhi_indication.split(';')
                                  .length -
                                  1
                              "
                              >;</span
                            >
                          </div>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div slot="reference">
                    <div
                      class="indication-zy"
                      v-if="scope.row.zaiyan_indication"
                    >
                      <span class="title">在研：</span
                      ><span class="content">{{
                        scope.row.zaiyan_indication
                      }}</span>
                    </div>
                    <div
                      class="indication-zy indication-ypz"
                      v-if="scope.row.pizhun_indication"
                    >
                      <span class="title" style="width: 52px">已批准：</span
                      ><span class="content">{{
                        scope.row.pizhun_indication
                      }}</span>
                    </div>

                    <div
                      class="indication-zy indication-ypz"
                      v-if="scope.row.zhongzhi_indication"
                    >
                      <span class="title">终止：</span
                      ><span class="content">{{
                        scope.row.zhongzhi_indication
                      }}</span>
                    </div>
                  </div>
                </el-popover>
                <span v-else>-</span>
              </template>

              <!-- 研发阶段 -->
              <template v-else-if="item.prop === 'phase'">
                <div class="line" v-if="scope.row.maxphase_num">
                  <!-- 临床前 -->
                  <div class="item" v-if="scope.row.maxphase_num >= 10">
                    <span v-if="scope.row.maxphase_num == 10">{{
                      scope.row.maxphase_date.substring(0, 10)
                    }}</span>
                  </div>
                  <!-- 临床申请 -->
                  <div class="item" v-if="scope.row.maxphase_num >= 20">
                    <span v-if="scope.row.maxphase_num == 20">{{
                      scope.row.maxphase_date.substring(0, 10)
                    }}</span>
                  </div>
                  <!-- 临床1期 -->
                  <div class="item" v-if="scope.row.maxphase_num >= 30">
                    <span v-if="scope.row.maxphase_num == 30">{{
                      scope.row.maxphase_date.substring(0, 10)
                    }}</span>
                  </div>
                  <!-- 临床2期 -->
                  <div class="item" v-if="scope.row.maxphase_num >= 40">
                    <span v-if="scope.row.maxphase_num == 40">{{
                      scope.row.maxphase_date.substring(0, 10)
                    }}</span>
                  </div>
                  <!-- 临床3期 -->
                  <div class="item" v-if="scope.row.maxphase_num >= 50">
                    <span v-if="scope.row.maxphase_num == 50">{{
                      scope.row.maxphase_date.substring(0, 10)
                    }}</span>
                  </div>
                  <!-- 注册申请 -->
                  <div class="item" v-if="scope.row.maxphase_num >= 60">
                    <span v-if="scope.row.maxphase_num == 60">{{
                      scope.row.maxphase_date.substring(0, 10)
                    }}</span>
                  </div>
                  <!-- 批准上市 -->
                  <div class="item" v-if="scope.row.maxphase_num >= 70">
                    <span v-if="scope.row.maxphase_num == 70">{{
                      scope.row.maxphase_date.substring(0, 10)
                    }}</span>
                  </div>
                </div>
              </template>

              <!-- 合作企业 -->
              <template v-else-if="item.prop === 'coo_company'">
                <template
                  v-if="scope.row.coo_company[0].name"
                  v-for="(item, index) in scope.row.coo_company"
                >
                  <router-link
                    class="link"
                    :key="index"
                    target="_blank"
                    :to="`/globaldrugs/companyDetail?company_standard=${encodeURIComponent(
                      item.hash_name
                    )}`"
                    v-if="item.name && item.is_exist"
                  >
                    {{ item.name }}
                  </router-link>
                  <span v-else :key="index">{{ item.name }}</span>
                  <span
                    :key="index"
                    v-if="index !== scope.row.coo_company.length - 1"
                    >;</span
                  >
                </template>
                <span v-else>-</span>
              </template>
              <span v-else :title="scope.row[item.prop]">{{
                scope.row[item.prop] || "-"
              }}</span>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="params.page"
        :page-size="20"
        layout="total, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import LoadingGif from "@/components/common/globalCom/loading-gif";
export default {
  components: {
    LoadingGif
  },
  props: {
    qiyemingcheng: {
      type: String,
    },
  },
  data() {
    return {
      isLoading: true,
      params: {
        pageSize: 20,
        page: 1,
        start: "",
        end: "",
        id: this.$route.params.id,
      }, // 研发管线参数
      startPickerOptions: {},
      endPickerOptions: {},
      lineTotalData: [], // 研发管线概览数据
      lineTotalHead: [
        {
          prop: "type",
          label: "地区",
          width: 80, //最少宽度
        },
        {
          prop: "allcount",
          label: "全部",
          width: 80, //最少宽度
        },
        {
          prop: "phase1",
          label: "临床前",
          width: 80, //最少宽度
        },
        {
          prop: "phase2",
          label: "临床申请",
          width: 80, //最少宽度
        },
        {
          prop: "phase3",
          label: "临床I期",
          width: 80, //最少宽度
        },
        {
          prop: "phase4",
          label: "临床II期",
          width: 80, //最少宽度
        },
        {
          prop: "phase5",
          label: "临床III期",
          width: 80, //最少宽度
        },
        {
          prop: "phase6",
          label: "注册申请",
          width: 80, //最少宽度
        },
        {
          prop: "phase7",
          label: "批准上市",
          width: 80, //最少宽度
        },
      ], // 研发管线概览表头
      lineDetailData: [], // 研发管线详情数据
      lineDetailHead: [
        {
          prop: "zyly",
          label: "治疗领域",
          width: 100, //最少宽度
        },
        {
          prop: "drugname_standard",
          label: "药品名称",
          width: 120, //最少宽度
        },
        {
          prop: "leixing",
          label: "类型",
          width: 80, //最少宽度
        },
        {
          prop: "leixing2",
          label: "药品分类",
          width: 80, //最少宽度
        },
        {
          prop: "targets_abbr",
          label: "靶点",
          width: 150, //最少宽度
        },
        {
          prop: "zaiyan_indication",
          label: "适应症",
          width: 150, //最少宽度
        },
        {
          prop: "phase",
          label: "研发阶段",
          width: 600, //最少宽度
        },
        {
          prop: "coo_company",
          label: "合作企业",
          width: 120, //最少宽度
        },
      ],
      spanArr: [], // 控制合并项
      position: 0, // 表示数组元素的位置
      total: 0,
      phaseObj: {
        phase1: "10",
        phase2: "20",
        phase3: "30",
        phase4: "40",
        phase5: "50",
        phase6: "60",
        phase7: "70",
      },
    };
  },
  watch: {},
  methods: {
    // 跳转到默认列表页查询
    goToListOne(row, phase) {
      console.log(row, phase);
      window.ga(
        "send",
        "event",
        "button",
        "click",
        "企业版_企业筛选系统_企业详情_研发管线_研发管线概览" +
          (row.type == "中国" ? "中国" : "全球")
      );
      window._paq.push([
        "trackEvent",
        "button",
        "click",
        "企业版_企业筛选系统_企业详情_研发管线_研发管线概览" +
          (row.type == "中国" ? "中国" : "全球"),
      ]);
      let numObj = {};
      if (row.type !== "中国") {
        // 全球最高阶段
        numObj = {
          phase1: [this.phaseObj[phase]],
        };
      } else {
        // 中国最高阶段
        numObj = {
          phase2: [this.phaseObj[phase]],
        };
      }
      let { href } = this.$router.resolve({
        path: "/globaldrugs/list",
        query: {
          company: this.qiyemingcheng,
          filter_condition: JSON.stringify(numObj),
        },
      });
      window.open(href, "_blank");
    },
    // 药品详情
    goToDetail(drugname_standard, company) {
      let routeData = this.$router.resolve({
        path:
          "/globaldrugs/detail?drugname_standard=" +
          encodeURIComponent(drugname_standard) +
          "&company_standard=" +
          encodeURIComponent(company),
      });
      window.open(routeData.href, "_blank");
    },
    // 获取研发管线数据
    getCompanyLines() {
      this.isLoading = true;
      this.spanArr = [];
      this.position = 0;
      window
        .Axios({
          method: "get",
          url: "/api/company_filter/companyLines",
          params: {
            ...this.params,
            accesstoken: GETCOOKIEFUN("accesstoken"),
          },
        })
        .then((res) => {
          this.isLoading = false;
          if (res.data.code === 200 && res.data.data) {
            this.lineTotalData = res.data.data.total;
            this.lineDetailData = res.data.data.detail.res;
            this.rowspan(this.lineDetailData);
            this.total = Number(res.data.data.detail.count);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    handleCurrentChange(e) {
      this.params.page = e;
      this.getCompanyLines();
    },

    // 控制表格合并项
    rowspan(data) {
      data.forEach((item, index) => {
        if (index === 0) {
          this.spanArr.push(1);
          this.position = 0;
        } else {
          if (data[index].zyly === data[index - 1].zyly) {
            this.spanArr[this.position] += 1;
            this.spanArr.push(0);
          } else {
            this.spanArr.push(1);
            this.position = index;
          }
        }
        // console.log(index)
      });
    },
    // 研发管线表格合并方法
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      // 表格合并行
      if (this.lineDetailData.length > 1) {
        if (columnIndex === 0) {
          const _row = this.spanArr[rowIndex];
          const _col = _row > 0 ? 1 : 0;
          return {
            rowspan: _row,
            colspan: _col,
          };
        }
      }
    },

    cellClassFn({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        return "target-bg";
      }
    },
    handleChangeStart() {
      let that = this;
      // 开始时间
      this.startPickerOptions = Object.assign({}, this.startPickerOptions, {
        disabledDate: (time) => {
          let endTime = that.params.end ? that.params.end : "";
          // 若时间有误差，可加减一天1000*3600*24
          return that.params.end != ""
            ? time.getTime() >= new Date(endTime).getTime()
            : false;
        },
      });

      //结束时间
      this.endPickerOptions = Object.assign({}, this.endPickerOptions, {
        disabledDate: (time) => {
          let endTime = that.params.start ? that.params.start : "";
          return that.params.start != ""
            ? time.getTime() < new Date(endTime).getTime() - 1000 * 3600 * 24
            : false;
        },
      });
    },

    handleChangeEnd() {
      let that = this;
      // 开始时间
      this.startPickerOptions = Object.assign({}, this.startPickerOptions, {
        disabledDate: (time) => {
          let endTime = that.params.end ? that.params.end : "";
          endTime =
            endTime.slice(0, 4) +
            "-" +
            endTime.slice(4, 6) +
            "-" +
            endTime.slice(6, 8);
          // 若时间有误差，可加减一天1000*3600*24
          return that.params.end != ""
            ? time.getTime() >= new Date(endTime).getTime()
            : false;
        },
      });

      //结束时间
      this.endPickerOptions = Object.assign({}, this.endPickerOptions, {
        disabledDate: (time) => {
          let endTime = that.params.start ? that.params.start : "";
          endTime =
            endTime.slice(0, 4) +
            "-" +
            endTime.slice(4, 6) +
            "-" +
            endTime.slice(6, 8);
          return that.params.start != ""
            ? time.getTime() < new Date(endTime).getTime() - 1000 * 3600 * 24
            : false;
        },
      });
    },
  },
  mounted() {
    this.getCompanyLines();
  },
};
</script>

<style lang="less">
@import "~@/assets/less/var.less";

.companyfilter-yfgx {
  min-height: 100%;
  .section-ico-qa {
    width: 14px;
    height: 14px;
    display: inline-block;
    background-image: url(/static/imgs/globaldrugs/qa.png);
    background-size: cover;
    margin-left: 5px;
    &:hover {
      background-image: url(/static/imgs/globaldrugs/qa-c.png);
    }
  }
  .target-bg {
    background: #f3f5f9 !important;
  }

  .line-title {
    justify-content: space-between;

    .title {
      font-weight: 400;
    }

    .el-date-editor.el-input {
      width: 130px;
      height: 20px;
      border-radius: 3px;
      border: 1px solid #ebeef5;
      color: #333;
    }
    .el-input--mini .el-input__inner {
      height: 24px;
      line-height: 24px;
      font-size: 12px;
      padding-right: 15px;
      font-weight: normal;
    }

    .el-input--mini .el-input__icon {
      line-height: 24px;
      color: #ffa500;
    }

    .btn-line {
      width: 40px;
      height: 24px;
      line-height: 24px;
      text-align: center;
      background: #ffa914;
      border-radius: 3px;
      font-size: 12px;
      color: #ffffff;
      cursor: pointer;
      display: inline-block;
    }
  }

  .line-box {
    padding: 20px 10px 0 10px;
    box-sizing: border-box;
    .el-table {
      color: #333;
      font-size: 13px;
    }

    .detail-table {
      td,
      th.is-leaf {
        border-bottom: 1px solid #fff;
      }

      .link {
        color: #4877E8;
        font-size: 13px;

        &:hover {
          text-decoration: none;
        }
      }

      .phase-title-box {
        width: 100%;
        display: flex;
        padding: 0;

        div {
          flex: 1;
          padding: 0;
          text-align: center;
          position: relative;
        }
      }

      .line {
        width: 100%;
        white-space: nowrap;
        padding: 3px 0;
        box-sizing: border-box;
        height: 20px;

        .item {
          height: 14px;
          border-radius: 7px;
          width: calc(100% / 6);
          position: relative;
          display: inline-block;
          font-size: 12px;
          span {
            position: absolute;
            left: 60%;
            transform: translateX(-60%);
            line-height: 14px;
          }
        }
        .item:nth-of-type(1) {
          background: #e8f1fe;
          left: 0%;
          color: #35384a;
          z-index: 7;
        }
        .item:nth-of-type(2) {
          background: #cddefd;
          left: -3%;
          color: #35384a;
          z-index: 6;
        }
        .item:nth-of-type(3) {
          background: #afc9fe;
          z-index: 5;
          color: #35384a;
          left: -6%;
        }
        .item:nth-of-type(4) {
          background: #8bb4fa;
          color: #fff;
          z-index: 4;
          left: -9%;
        }
        .item:nth-of-type(5) {
          background: #598dfc;
          color: #fff;
          z-index: 3;
          left: -12%;
        }
        .item:nth-of-type(6) {
          background: #3a79f0;
          color: #fff;
          z-index: 2;
          left: -15%;
        }
        .item:nth-of-type(7) {
          background: #1944b0;
          color: #fff;
          z-index: 1;
          left: -18%;
        }
      }

      .cl-blue {
        font-size: 14px;
        color: #4877E8;
        &:hover {
          text-decoration: none;
        }
      }
    }

    .el-table.detail-table td .cell {
      overflow: unset;
      text-overflow: unset;
      display: block;
      -webkit-line-clamp: unset;
      -webkit-box-orient: unset;
      padding-right: 14px;
    }

    .el-table.detail-table td .cell > div {
      overflow: unset;
      text-overflow: unset;
      display: block;
      -webkit-line-clamp: unset;
      -webkit-box-orient: unset;
      max-height: unset;
    }

    .leixing2 {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
    }

    .line-table {
      margin-bottom: 20px;
      .img-map {
        margin-right: 5px;
      }
    }

    .el-table.line-table td,
    .el-table.line-table th.is-leaf {
      border-bottom: 1px solid #ebeef5;
    }

    .el-table.line-table td:first-child {
      border-left: 1px solid #ebeef5;
    }

    .el-table.line-table td:last-child {
      border-right: 1px solid #ebeef5;
    }

    .el-table.line-table thead th > .cell {
      height: 36px;
      line-height: 36px;
      justify-content: center;
      padding: 0;
    }

    .el-table.detail-table thead th > .cell {
      height: 36px;
      line-height: 36px;
    }

    .el-table.line-table tbody td > .cell {
      padding-left: 0;
    }

    .gsxx-title {
      padding-left: 10px;

      &::before {
        left: 0;
      }
    }

    .indication-zy {
      font-size: 13px;
      margin-bottom: 8px;
      box-sizing: border-box;
      display: flex;

      .title {
        width: 40px;
      }

      .content {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
      }
    }

    .indication-ypz {
      color: #5c6973;
    }
  }
}
</style>
