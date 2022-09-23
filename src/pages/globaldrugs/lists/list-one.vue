<template>
  <div class="la-list globaldrugs-list">
    <List :loading="listLoading" :nodata="res1 && !res1.length">
      <div class="actions">
        <span
          class="action-btn"
          :class="{ 'abandon-click-method': nopms && nopms.visualization }"
          @click="sendGa"
        >
          <img
            src="~@/assets/imgs/globaldrugs/fx_icon.png"
            width="14px"
            alt=""
          />
          智能分析
        </span>
        <span
          class="action-btn"
          :class="{ 'abandon-click-method': nopms && nopms.compare }"
          @click="goToContrast"
        >
          <img
            src="~@/assets/imgs/globaldrugs/db_icon.png"
            width="14px"
            alt=""
          />
          对比
        </span>
        <span class="action-btn" :class="{ 'abandon-click-method': nopms && nopms.rss }" @click="handleActionsClick('订阅')">
          <img
            src="~@/assets/imgs/globaldrugs/dy_icon.png"
            width="14px"
            alt=""
          />
          订阅
        </span>

        <span
          class="action-btn"
          @click="handleActionsClick('AI推荐')"
          style="color: #9aa4b8"
        >
          <img
            src="~@/assets/imgs/globaldrugs/ai_icon.png"
            width="14px"
            alt=""
          />
          AI推荐
        </span>

        <!-- 显示 -->
        <list-check
          :defaultFiled="defaultFiled"
          vuex_name="Globaldrugs"
          :showArray="tableHead"
          @changeTableHeader="(list) => changeTableHeader(this, list)"
        />
        <!-- 导出 -->
        <Export
          :out_max="allBase.out_max"
          vuex_name="Globaldrugs"
          api_name="globaldrugs"
          :max_num="extendCount.baseCount"
          :defaultFiled="exportDefaultFiled"
          outdataAction="base"
        ></Export>
      </div>

      <div class="table-box" style="position: relative">
        <el-table
          :data="res1"
          stripe
          fixed
          ref="ElTable"
          :height="tableHeight"
          @sort-change="sortChange"
          :default-sort="order.apply ? defaultSort(order.apply) : {}"
          v-if="show_table"
          @selection-change="handleSelectionChange"
          :row-key="getRowKeys"
          @cell-click="handleCellClick"
        >
          <el-table-column
            v-for="item in tableHead"
            :prop="item.prop"
            :min-width="item.field_width || item.width || 100"
            :key="item.prop"
            :sortable="item.sort"
            :fixed="item.is_fixed == '1'"
            :label="item.label"
          >
            <template :slot="1 ? 'header' : ''" slot-scope="scope">
              <NewProjectGuide
                postion="列表"
                :newPosition="{
                  top: -5,
                  right: getPositonRight(item.order, item.statement),
                }"
                :onlyKey="item['new_id']"
                display="inline"
                compoentsName="字段"
                :initItem="item"
                :showMenban="item['is_show_new']"
                >{{ item.label }}</NewProjectGuide
              >
              <!-- <TableHeadFilter
              @confirm="confirm(item.prop,$event)"
              :options="[{label:'选项1'},{label:'选项2'},{label:'选项3'},]"
              >
              <span slot="name">
                <NewProjectGuide
                  postion="列表"
                  :newPosition="{
                    top: -5,
                    right: getPositonRight(item.order, item.statement),
                  }"
                  :onlyKey="item['new_id']"
                  display="inline"
                  compoentsName="字段"
                  :initItem="item"
                  :showMenban="item['is_show_new']"
                  >{{ item.label }}</NewProjectGuide
                >
              </span>
              </TableHeadFilter> -->
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
              <div v-if="vueCheckListPms('Globaldrugs', item.label)">
                <!-- 药品名称 -->
                <template v-if="item.prop === 'drugname_standard'">
                  <div>
                    <a
                      tag="a"
                      class="cl-blue"
                      @click="
                        goToDetail(
                          scope.row.hash_drugname_standard,
                          scope.row.hash_company
                        )
                      "
                      :title="
                        scope.row.zwname + ' ' + scope.row.drugname_standard
                      "
                      >{{ scope.row.zwname }}
                      {{ scope.row.drugname_standard }}</a
                    >
                  </div>
                  <div class="drugname-tag">
                    <span v-if="scope.row.shangshi == 1">中国上市</span>
                    <span v-if="scope.row.yxsp == 1">优先审评</span>
                    <span v-if="scope.row.tpxzl == 1">突破性治疗</span>
                  </div>
                </template>

                <!-- 药品分类 -->
                <template v-else-if="item.prop === 'leixing2'">
                  <div class="leixing2" :title="scope.row.leixing2">
                    {{ scope.row.leixing2 || "-" }}
                  </div>
                </template>
                <!-- 靶点 -->
                <template v-else-if="item.prop === 'targets_abbr'">
                  <template v-if="scope.row.targets_abbr">
                    <el-popover
                      placement="right"
                      width="260"
                      :open-delay="500"
                      trigger="hover"
                      v-for="(tar, index) in scope.row.targets_abbr_arr"
                      :key="index"
                    >
                      <div
                        class="globaldrugs-company-content"
                        v-loading="targetCardLoading"
                      >
                        <img
                          class="trangle"
                          src="/static/imgs/globaldrugs/tooltip.png"
                          alt=""
                        />
                        <div class="max-content">
                          <div class="content">
                            <span class="title">靶点简称：</span
                            ><span class="info">{{
                              targetCard.targets_abbr || "-"
                            }}</span>
                          </div>

                          <div class="content">
                            <span class="title">靶点全称：</span
                            ><span class="info">{{
                              targetCard.targets || "-"
                            }}</span>
                          </div>

                          <div class="content">
                            <span class="title" style="width: 90px"
                              >作用机制分类：</span
                            ><span class="info"
                              >{{ targetCard.actions || "-" }}
                            </span>
                          </div>

                          <div class="content">
                            <span class="title" style="width: 90px"
                              >最高研发阶段：</span
                            ><span class="info"
                              >{{ targetCard.phase || "-" }}
                            </span>
                          </div>

                          <div class="link-box">
                            <a
                              v-if="targetCard.drugname_count"
                              tag="a"
                              @click="goToListOne(tar.name)"
                              target="_blank"
                              >药物：{{ targetCard.drugname_count }}</a
                            >

                            <a
                              v-if="targetCard.indication_count"
                              tag="a"
                              @click="goTarget(tar.hash_name, '适应症')"
                              target="_blank"
                              >适应症：{{ targetCard.indication_count }}</a
                            >

                            <a
                              v-if="targetCard.news"
                              tag="a"
                              @click="goTarget(tar.hash_name, '新闻资讯')"
                              target="_blank"
                              >新闻资讯：{{ targetCard.news }}</a
                            >
                          </div>

                          <a
                            tag="a"
                            @click="goTarget(tar.hash_name)"
                            target="_blank"
                            class="look-detail"
                            >查看详情</a
                          >
                        </div>
                      </div>

                      <span
                        slot="reference"
                        @mouseover="mouseoverTarget(tar.name)"
                        @click="goTarget(tar.hash_name)"
                        style="cursor: pointer; color: #002fa7"
                        >{{ tar.name
                        }}<span
                          v-if="index !== scope.row.targets_abbr_arr.length - 1"
                          >;</span
                        >
                      </span>
                    </el-popover>
                  </template>
                  <span v-else>{{ scope.row.targets_original || "-" }}</span>
                </template>

                <!-- 研发单位 -->
                <template v-else-if="item.prop === 'company_standard'">
                  <div
                    class="company_standard"
                    v-if="scope.row.company_standard"
                  >
                    <p class="title">原研单位：</p>

                    <div>
                      <span
                        v-for="(item, i) in scope.row.company_standard"
                        :key="i"
                      >
                        <el-popover
                          placement="right"
                          width="260"
                          :open-delay="500"
                          trigger="hover"
                        >
                          <div
                            class="globaldrugs-company-content"
                            v-loading="companyCardLoading"
                          >
                            <img
                              class="trangle"
                              src="/static/imgs/globaldrugs/tooltip.png"
                              alt=""
                            />
                            <div class="max-content">
                              <div class="content">
                                <span class="title">企业名称：</span
                                ><span class="info">{{
                                  companyCard.qiyemingcheng || item.name
                                }}</span>
                              </div>

                              <div class="content">
                                <span class="title">融资轮次：</span
                                ><span class="info">{{
                                  companyCard.rongzileixing || "-"
                                }}</span>
                              </div>

                              <div class="content" v-if="companyCard.guobie">
                                <span class="title">企业地区：</span
                                ><span class="info"
                                  >{{ companyCard.guobie }}
                                  <span v-if="companyCard.shengfen"
                                    >-{{ companyCard.shengfen }}</span
                                  >
                                  <span v-if="companyCard.chengshi"
                                    >-{{ companyCard.chengshi }}</span
                                  >
                                </span>
                              </div>

                              <div class="link-box">
                                <a
                                  v-if="companyCard.drugname_count"
                                  tag="a"
                                  @click="goCompany(item.hash_name, '研发管线')"
                                  target="_blank"
                                  >管线：{{ companyCard.drugname_count }}</a
                                >

                                <a
                                  v-if="companyCard.news"
                                  tag="a"
                                  @click="goCompany(item.hash_name, '新闻资讯')"
                                  target="_blank"
                                  >新闻资讯：{{ companyCard.news }}</a
                                >

                                <router-link
                                  v-if="
                                    companyCard.tourongzi &&
                                    Object.keys(companyCard.tourongzi).length >
                                      0
                                  "
                                  tag="a"
                                  :to="
                                    '/trz/qiye/' + companyCard.tourongzi.wyuid
                                  "
                                  target="_blank"
                                  >投融资：{{
                                    companyCard.tourongzi.doc_count
                                  }}</router-link
                                >
                              </div>

                              <a
                                tag="a"
                                @click="goCompany(item.hash_name)"
                                target="_blank"
                                class="look-detail"
                                >查看详情</a
                              >
                            </div>
                          </div>

                          <span
                            slot="reference"
                            @mouseover="mouseover(item.name)"
                            @click="goCompany(item.hash_name)"
                            style="cursor: pointer"
                            >{{ item.name }}
                          </span>
                        </el-popover>
                        <span
                          v-if="i !== scope.row.company_standard.length - 1"
                          >;</span
                        >
                      </span>
                    </div>
                  </div>

                  <el-popover
                    placement="left"
                    width="260"
                    trigger="hover"
                    v-if="scope.row.coo_company"
                  >
                    <div class="globaldrugs-company-content">
                      <img
                        class="trangle"
                        src="/static/imgs/globaldrugs/tooltip.png"
                        alt=""
                      />
                      <div class="max-content">
                        <div class="content">
                          <span class="title" style="color: #5c6973"
                            >合作企业：</span
                          ><span class="info" style="color: #5c6973">
                            <div
                              v-for="(
                                item, index
                              ) in scope.row.coo_company.split(';')"
                              :key="item"
                            >
                              {{ item
                              }}<span
                                v-if="
                                  index !==
                                  scope.row.coo_company.split(';').length - 1
                                "
                                >;</span
                              >
                            </div>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div slot="reference" class="indication-zy indication-ypz">
                      <span class="title" style="width: 65px">合作企业：</span
                      ><span class="content">{{ scope.row.coo_company }}</span>
                    </div>
                  </el-popover>

                  <el-popover
                    placement="left"
                    width="260"
                    trigger="hover"
                    v-if="scope.row.per_company"
                  >
                    <div class="globaldrugs-company-content">
                      <img
                        class="trangle"
                        src="/static/imgs/globaldrugs/tooltip.png"
                        alt=""
                      />
                      <div class="max-content">
                        <div class="content">
                          <span class="title" style="color: #5c6973"
                            >许可单位：</span
                          ><span class="info" style="color: #5c6973">
                            <div
                              v-for="(
                                item, index
                              ) in scope.row.per_company.split(';')"
                              :key="item"
                            >
                              {{ item
                              }}<span
                                v-if="
                                  index !==
                                  scope.row.per_company.split(';').length - 1
                                "
                                >;</span
                              >
                            </div>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div slot="reference" class="indication-zy indication-ypz">
                      <span class="title" style="width: 65px">许可单位：</span
                      ><span class="content">{{ scope.row.per_company }}</span>
                    </div>
                  </el-popover>
                </template>

                <!-- 适应症 -->
                <template v-else-if="item.prop === 'indication_standard'">
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
                          <span class="title" style="width: 70px; color: #333"
                            >在研({{scope.row.zaiyan_indication.split(';').length}})：</span
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
                                  scope.row.zaiyan_indication.split(';')
                                    .length -
                                    1
                                "
                                >;</span
                              >
                            </div>
                          </span>
                        </div>

                        <div class="content" v-if="scope.row.pizhun_indication">
                          <span
                            class="title"
                            style="width: 70px; color: #5c6973"
                            >已批准({{scope.row.pizhun_indication.split(';').length}})：</span
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
                                  scope.row.pizhun_indication.split(';')
                                    .length -
                                    1
                                "
                                >;</span
                              >
                            </div>
                          </span>
                        </div>

                        <div
                          class="content"
                          v-if="scope.row.zhongzhi_indication"
                        >
                          <span
                            class="title"
                            style="width: 70px; color: #5c6973"
                            >终止({{scope.row.zhongzhi_indication.split(';').length}})：</span
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

                <!-- 全球最高阶段 -->
                <template v-else-if="item.prop === 'phase1'">
                  <div v-if="scope.row.phase1 === '批准上市'" class="phase">
                    <div>{{ scope.row.phase1 }}</div>
                    <span v-if="scope.row.phase1_date"
                      >({{ scope.row.phase1_date }})</span
                    >
                  </div>

                  <span v-else>{{ scope.row.phase1 || "-" }}</span>
                </template>

                <!-- 中国最高阶段 -->
                <template v-else-if="item.prop === 'phase2'">
                  <div v-if="scope.row.phase2 === '批准上市'" class="phase">
                    <div>{{ scope.row.phase2 }}</div>
                    <span v-if="scope.row.phase2_date"
                      >({{ scope.row.phase2_date }})</span
                    >
                  </div>

                  <span v-else>{{ scope.row.phase2 || "-" }}</span>
                </template>

                <!-- 中国最高阶段 -->
                <template v-else-if="item.prop === 'date'">
                  <div v-if="scope.row.date">
                    {{ scope.row.date.substring(0, 10) }}
                  </div>
                </template>

                <template v-else
                  ><span :title="scope.row[item.prop]">{{
                    scope.row[item.prop] || "-"
                  }}</span></template
                >
              </div>
              <span v-else class="abandon-click-method">暂无权限</span>
            </template>
          </el-table-column>
          <el-table-column type="selection" width="55" reserve-selection>
          </el-table-column>
        </el-table>

        <!-- 立即对比按钮 -->
        <div
          class="table-db"
          :class="{ 'abandon-click-method': nopms && nopms.compare }"
          @click="goToContrast"
        >
          <img
            src="~@/assets/imgs/globaldrugs/table_db_icon.png"
            width="16"
            height="16"
            alt=""
          />
          <span class="number">{{ multipleSelection.length }}</span>
          立即对比
        </div>
      </div>

      <div style="positon: relative">
        <el-pagination
          v-if="extendCount.baseCount"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="param.page"
          :page-sizes="[20, 30, 50]"
          :page-size="param.pageSize"
          layout="total, sizes, prev, pager, next"
          :total="extendCount.baseCount"
          :disabled="nopms.fy"
          :class="{ 'abandon-click-method': nopms.fy }"
        >
        </el-pagination>
        <span class="out-of-page cl-red">限于内容篇幅，部分结果未予显示</span>
      </div>

      <alert-wrong ref="alertWrong"></alert-wrong>
    </List>
  </div>
</template>
<script>
import TooltipBD from "@/components/common/globalCom/target-tooltip";
import List from "@/components/layouts/list";
import Export from "@/components/common/globaldrugs/export";
import listCheck from "@/components/common/globaldrugs/list-check";
import AlertWrong from "./alert.vue";
import { mapState } from "vuex";
import commonMixins from "@/mixins/common.js";
import setTableHMixins from "@/mixins/setTableH.js";
import TableHeadFilter from "@/components/common/globaldrugs/table-head-filter";

export default {
  components: {
    TooltipBD,
    List,
    Export,
    listCheck,
    AlertWrong,
    TableHeadFilter,
  },
  mixins: [commonMixins, setTableHMixins],
  data() {
    return {
      vuex_name: "Globaldrugs",
      activeTabName: "first",
      defaultFiled: [],
      exportDefaultFiled: [],
      tableHead: [],
      show_table: true,
      tableHeight:
        document.documentElement.clientHeight - 48 - 60 - 60 - 50 - 88,
      multipleSelection: [], // 表格勾选项
      getRowKeys(row) {
        return row.drugname_standard + row.company;
      },
      companyCard: {}, // 研发单位卡片信息
      targetCard: {}, // 靶点卡片信息
      targetCardLoading: false,
      companyCardLoading: false,
    };
  },
  computed: {
    //同时获取多个属性
    ...mapState({
      allBase: (state) => state.Globaldrugs.allBase,
      tableconf: (state) => state.Globaldrugs.tableconf,
      res1: (state) =>
        _.keys(state.Globaldrugs.res1).length ? state.Globaldrugs.res1.res : [],
      errorcode: (state) => state.Globaldrugs.error,
      listLoading: (state) => state.Globaldrugs.listLoading,
      putong: (state) => state.Globaldrugs.putong,
      gaoji: (state) => state.Globaldrugs.gaoji,
      shaixuan: (state) => state.Globaldrugs.shaixuan,
      extendCount: (state) => state.Globaldrugs.extendCount,
      param: (state) => state.Globaldrugs.ypll_param, // 附加参数(存于vuex内)
      nopms: (state) => state.Globaldrugs.nopms,
      order: (state) => state.Globaldrugs.order,
    }),
  },
  mounted() {
    // window.addEventListener("resize", () => {
    //   this.registerEven();
    // });
  },
  // safari浏览器回到当前页面会导致样式错乱问题，由于使用了keepalive所以需要在activated生命周期中在调一次计算方法
  activated() {
    let tempTableconf = _.cloneDeep(this.tableconf),
      actionName = `${
        this.vuex_name[0].toUpperCase() + this.vuex_name.substr(1)
      }/tableconf`; // 第一个字母转大写
    this.$store.commit(actionName, []);
    this.$store.commit(actionName, tempTableconf);
    this.registerEven();
  },
  watch: {
    res1: {
      handler() {
        this.$nextTick(() => {
          this.registerEven();
        });
      },
      immediate: true,
    },
    tableHead: {
      handler() {
        this.$nextTick(() => {
          this.registerEven();
        });
      },
      immediate: true,
    },
    multipleSelection: {
      handler(val) {
        // console.log(val);
        if (val.length > 0) {
          $(".table-db").show(300);
        } else {
          $(".table-db").hide(300);
        }
      },
      deep: true,
      immediate: true,
    },
    tableconf(n) {
      n.forEach((item) => {
        item.checked = item.hidden === undefined;
        item.prop = item.field;
      });
      //后台控制列表宽度
      this.defaultFiled = this.tableheaderCombain(n, n);
      this.exportDefaultFiled = this.defaultFiled;
      this.init();
    },
  },
  methods: {
    handleActionsClick(name) {
      window.ga(
        "send",
        "event",
        "button",
        "click",
        "企业版_全球药物_列表_" + name
      );
      window._paq.push([
        "trackEvent",
        "button",
        "click",
        "企业版_全球药物_列表_" + name,
      ]);
      if (name == "订阅" && this.nopms && !this.nopms.rss) {
        let routeData = this.$router.resolve({
          path: `/usercenter/take/new`,
          query: {
            source: "globaldrugs",
          },
        });
        window.open(routeData.href, "_blank");
      }
      if (name == "AI推荐") {
        this.$refs.alertWrong.changeAlert();
      }
    },
    // 表格勾选change事件
    handleSelectionChange(val) {
      // 需求是只允许选择10条数据用作对比
      if (val.length <= 10) {
        this.multipleSelection = val.slice(0, 10);
      } else {
        this.$message.warning("超出可选择数量，最多选择10条对比数据！");
        const delRow = val.slice(10, val.length);
        console.log(delRow);
        delRow.forEach((row) => {
          this.$refs.ElTable.toggleRowSelection(row, false);
        });
      }
      console.log(this.multipleSelection);
    },

    // 点击单元格选中
    handleCellClick(row, column, cell, event) {
      if (column.type === "selection") {
        this.$refs.ElTable.toggleRowSelection(row);
      }
    },

    // 研发单位卡片移入交互
    mouseover(item) {
      console.log(item);
      this.companyCardLoading = true;
      this.companyCard = {};
      window
        .Axios({
          method: "get",
          url: "/api/globaldrugs/companyCard",
          params: {
            company: item,
          },
        })
        .then((res) => {
          this.companyCardLoading = false;
          if (res.data.data) {
            this.companyCard = res.data.data;
          }
        });
    },

    // 靶点卡片移入交互
    mouseoverTarget(item) {
      console.log(item);
      this.targetCardLoading = true;
      this.targetCard = {};
      window
        .Axios({
          method: "get",
          url: "/api/globaldrugs/targetCard",
          params: {
            target: item,
          },
        })
        .then((res) => {
          this.targetCardLoading = false;
          if (res.data.data) {
            this.targetCard = res.data.data;
          }
        });
    },

    // 靶点点击传参到列表页查询
    goToListOne(item) {
      let routeData = this.$router.resolve({
        path: "/globaldrugs/list?targets=" + encodeURIComponent(item),
      });
      window.open(routeData.href, "_blank");
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

    // 公司详情
    goCompany(item, activeModule) {
      let query = {};
      if (activeModule) {
        query = {
          company_standard: item,
          activeModule: activeModule,
        };
      } else {
        query = {
          company_standard: item,
        };
      }
      console.log(query);
      let routeData = this.$router.resolve({
        path: "/globaldrugs/companyDetail",
        query: {
          ...query,
        },
      });
      window.open(routeData.href, "_blank");
    },

    goTarget(item, activeModule) {
      let path;
      if (activeModule) {
        path =
          "/globaldrugs/target/detail?target=" +
          encodeURIComponent(item) +
          "&activeModule=" +
          activeModule;
      } else {
        path = "/globaldrugs/target/detail?target=" + encodeURIComponent(item);
      }
      let routeData = this.$router.resolve({
        path: path,
      });
      window.open(routeData.href, "_blank");
    },

    confirm(nodes, key) {
      console.log(nodes, key);
    },
    // 动态计算new标签的right间距(order为排序标签，statement为提示问号)
    getPositonRight(order, statement) {
      if (order && !statement) {
        return -42;
      } else if (!order && statement) {
        return -40;
      } else if (order && statement) {
        return -58;
      } else {
        return -25;
      }
    },
    // 跳转到智能分析
    sendGa() {
      if (this.nopms && !this.nopms.visualization) {
        window.ga(
          "send",
          "event",
          "button",
          "click",
          "企业版_全球药物_列表_智能分析"
        );
        window._paq.push([
          "trackEvent",
          "button",
          "click",
          "企业版_全球药物_列表_智能分析",
        ]);
        let routeData = this.$router.resolve({
          path: "/globaldrugs/analysis",
          query: {
            ...this.putong,
          },
        });
        window.open(routeData.href, "_blank");
      }
    },

    // 跳转到对比页面
    goToContrast() {
      if (this.nopms && !this.nopms.compare) {
        window.ga(
          "send",
          "event",
          "button",
          "click",
          "企业版_全球药物_列表_对比"
        );
        window._paq.push([
          "trackEvent",
          "button",
          "click",
          "企业版_全球药物_列表_对比",
        ]);
        if (this.multipleSelection.length > 0) {
          let arr = [];
          let obj = {};
          this.multipleSelection.map((v) => {
            obj = {
              company_standard: v.company,
              drugname_standard: v.drugname_standard,
            };
            arr.push(obj);
          });
          console.log(arr);
          localStorage.setItem("globaldrugsContrast", JSON.stringify(arr));
        } else {
          localStorage.removeItem("globaldrugsContrast");
        }

        let routeData = this.$router.resolve({
          path: "/globaldrugs/contrast",
        });
        window.open(routeData.href, "_blank");
      }
    },

    init() {
      this.tableHead = this.defaultFiled.reduce((res, item) => {
        if (item.checked && !item.hide) {
          res.push(item);
        }
        return res;
      }, []);
    },
    handleCurrentChange(val) {
      this.param.page = val;
      if (val * this.param.pageSize <= 1500) {
        $(".out-of-page").hide();
        Store.dispatch("Globaldrugs/nomalSearch", { params: this.param });
      } else {
        $(".out-of-page").show();
      }
    },
    handleSizeChange(val) {
      this.param.page = 1;
      this.param.pageSize = val;
      if (val * this.param.page <= 1500) {
        $(".out-of-page").hide();
        Store.dispatch("Globaldrugs/nomalSearch", { params: this.param });
      } else {
        $(".out-of-page").show();
      }
    },
  },
  updated() {
    this.vueTogglePmsTooltip();
  },
};
</script>
<style lang="less">
@import "~@/assets/less/var.less";
@import "~@/assets/less/app.less";
.el-tooltip__popper.is-zhuce {
  min-width: 200px;
  div {
    max-height: 400px;
    overflow-y: auto;
  }

  .indication-content {
    font-size: 13px;
    box-sizing: border-box;
    display: flex;

    .title {
      width: 40px;
    }

    .info {
      flex: 1;
    }
  }
}

// // 设置箭头样式
// .el-tooltip__popper[x-placement^="right"] .popper__arrow {
//   // 控制边框颜色
//   border-right-color: #fff !important;
// }

// .el-tooltip__popper[x-placement^="right"] .popper__arrow:after {
//   border-right-color: #fff !important;
// }

// .el-tooltip__popper[x-placement^="left"] .popper__arrow {
//   border-left-color: #fff !important;
// }

// .el-tooltip__popper[x-placement^="left"] .popper__arrow:after {
//   border-left-color: #fff !important;
// }

// .el-tooltip__popper[x-placement^="top"] .popper__arrow {
//   border-top-color: #fff !important;
// }

// .el-tooltip__popper[x-placement^="top"] .popper__arrow:after {
//   border-top-color: #fff !important;
// }

// .el-tooltip__popper[x-placement^="bottom"] .popper__arrow {
//   border-bottom-color: #fff !important;
// }

// .el-tooltip__popper[x-placement^="bottom"] .popper__arrow:after {
//   border-bottom-color: #fff !important;
// }

.el-table {
  .cell {
    overflow: visible;
    // padding-left: 30px;
  }
}
// el-dialog遮罩层样式（背景色）
.v-modal {
  background: rgba(102, 102, 102, 0.8);
}
.globaldrugs-company-content {
  font-size: 12px;
  position: relative;

  .max-content {
    max-height: 400px;
    overflow-y: auto;
  }

  .trangle {
    width: 8px;
    height: 8px;
    position: absolute;
    right: -12px;
    top: -12px;
  }
  .content {
    margin-bottom: 10px;
    display: flex;

    .title {
      color: #9aa4b8;
      width: 65px;
    }

    .info {
      color: #333333;
      flex: 1;
      word-break: break-all;
    }
  }
  .content:last-child {
    margin-bottom: 0px;
  }

  .link-box {
    display: flex;
    flex-wrap: wrap;
    a {
      display: inline-block;
      padding: 4px 5px;
      box-sizing: border-box;
      background: #ebeef5;
      border-radius: 2px;
      border: 1px solid #dcdfe6;
      margin-right: 10px;
      margin-bottom: 5px;
      &:hover {
        text-decoration: none;
      }
    }
  }

  .look-detail {
    display: inline-block;
    padding: 4px 5px;
    box-sizing: border-box;
    background: #002fa7;
    border-radius: 2px;
    color: #fff;
    font-size: 12px;
    margin-top: 15px;
    &:hover {
      text-decoration: none;
    }
  }
}
.globaldrugs-list {
  .leixing2 {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }
  a:hover {
    text-decoration: none !important;
  }
  .actions {
    top: -50px;
  }
  .actions .action-btn {
    font-size: 14px;
    margin-right: 10px;
    &:hover {
      color: #002fa7;
    }
    img {
      vertical-align: middle;
      position: relative;
      top: -1px;
    }
  }

  .el-table thead {
    color: #333;
    font-weight: bold;
  }
  .el-table--striped .el-table__body tr.el-table__row--striped td {
    background-color: #f5f8fc;
  }

  .el-table {
    color: #333;

    .el-table__body tr.hover-row.el-table__row--striped:hover > td,
    .el-table__body tr.hover-row > td {
      background-color: #ebeef5 !important;
    }

    .el-checkbox__input.is-checked .el-checkbox__inner {
      background-color: #ffffff;
      border-color: #c0c4cc;
      width: 14px;
      height: 14px;
    }

    .el-checkbox__inner::after {
      border-color: #ffa914;
    }

    .el-checkbox__inner {
      background-color: #ffffff !important;
      border-color: #c0c4cc !important;
      width: 14px;
      height: 14px;

      &::before {
        background-color: #ffa914 !important;
      }
    }
  }

  .el-table .cell {
    padding: 0 0 0 10px;
  }

  .el-table td .cell {
    overflow: unset;
    text-overflow: unset;
    display: block;
    -webkit-line-clamp: unset;
    -webkit-box-orient: unset;
  }

  .el-table td .cell > div {
    overflow: unset;
    text-overflow: unset;
    display: block;
    -webkit-line-clamp: unset;
    -webkit-box-orient: unset;
    max-height: unset;
  }

  .el-table tbody td > .cell {
    padding: 15px 10px 15px 10px;
  }

  .cl-blue {
    font-size: 14px;
    font-weight: bold;
    color: #333;
    &:hover {
      color: #002fa7;
    }
  }

  .drugname-tag {
    span {
      padding: 0 6px;
      height: 20px;
      border-radius: 3px;
      border: 1px solid #002fa7;
      color: #002fa7;
      font-size: 12px;
      margin-top: 5px;
      box-sizing: border-box;
      display: inline-block;
    }
  }

  .targets_abbr {
    font-size: 13px;
    color: #002fa7;
    cursor: pointer;
  }

  .indication-zy {
    font-size: 13px;
    box-sizing: border-box;
    display: flex;

    .title {
      width: 40px;
    }

    .content {
      margin-bottom: 8px;
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
    font-size: 12px;
  }

  .company_standard {
    color: #333;
    font-size: 13px;
    display: flex;
    margin-bottom: 5px;
    .title {
      width: 65px;
    }

    > div {
      flex: 1;
      // overflow: hidden;
      // text-overflow: ellipsis;
      // display: -webkit-box;
      // -webkit-line-clamp: 3;
      // -webkit-box-orient: vertical;
      span {
        color: #002fa7;
        // cursor: pointer;
      }

      .no-link {
        color: #333;
        cursor: unset !important;
      }
    }
  }

  .coo_company {
    font-size: 12px;

    div {
      color: #5c6973;
    }
  }

  .phase {
    div {
      font-size: 13px;
      font-weight: bold;
      color: #002fa7;
    }

    span {
      font-size: 12px;
      color: #5c6973;
    }
  }

  .table-db {
    position: absolute;
    background: #ffa914;
    color: #fff;
    box-shadow: 0px 1px 6px 0px rgba(9, 20, 79, 0.1);
    border-radius: 3px;
    padding: 4px 6px;
    top: 45%;
    right: 10px;
    font-size: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    display: none;
    z-index: 9999;

    img {
      margin-right: 5px;
      vertical-align: middle;
    }

    .number {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      color: #ffa914;
      background: #fff;
      font-size: 12px;
      text-align: center;
      line-height: 14px;
      position: absolute;
      left: 10px;
      bottom: 2px;
      transform: scale(0.8);
    }
  }

  .el-pagination {
    padding: 15px 10px 15px 0;
    .el-select .el-input {
      width: 75px;
    }
    .el-pager li {
      min-width: 28px;
      height: 28px;
      line-height: 28px;
      background: #ffffff;
      border-radius: 4px;
      border: 1px solid #dcdfe6;
      color: #5c6973;
      font-size: 14px;
      font-weight: normal;
    }

    .more {
      margin-left: 8px;
    }

    .el-pagination__total {
      font-size: 13px;
      color: #5c6973;
      height: 28px;
      line-height: 28px;
    }

    .el-select .el-input .el-input__inner {
      border-radius: 4px;
      border-color: #dcdfe6;
      height: 28px;
      color: #5c6973;
    }

    .btn-prev,
    .btn-next {
      width: 28px;
      height: 28px;
      background: #ffffff;
      border-radius: 4px;
      border: 1px solid #dcdfe6;
      color: #5c6973;
    }

    .btn-next {
      margin-left: 8px;
    }

    .el-pager {
      .number {
        height: 28px;
        line-height: 28px;
        background: #ffffff;
        border-radius: 4px;
        border: 1px solid #dcdfe6;
        color: #666;
        margin-left: 8px;
        font-size: 14px;
        font-weight: normal;
      }

      .active {
        background: #002fa7;
        color: #ffffff;
      }
    }
  }
}
@media screen and (max-width: 1400px) {
  .la-list.globaldrugs-list {
    .actions {
      width: 195px;
      overflow: hidden;
      line-height: 17px;
      // text-align: right;
      top: -58px;

      .action-btn {
        margin-right: 10px;
      }
    }
  }
}
</style>
