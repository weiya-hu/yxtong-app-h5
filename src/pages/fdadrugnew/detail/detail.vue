<template>
  <div class="wrapper" ref="wrapper">
    <!-- 自定义加载界面 -->
    <LoadingGif :loadFlag="isLoading" v-if="isLoading"></LoadingGif>
    <!-- 加载完成显示部分 -->
    <div class="detail-list" v-else>
      <div class="detail-header header-fixed">
        <div class="header-left">
          <div class="left-top">
            <span class="top-id" :title="base_info.drugname">
              {{ base_info.drugname }}
            </span>
            <span class="top-num">{{ base_info.applno }}</span>
            <div class="left-bottom">
              <span
                class="id-green bg-blue"
                v-if="base_info.firstgeneric === '是'"
                >首仿</span
              >
              <span
                class="id-green bg-orange"
                v-if="base_info.chengpishu === '是'"
                >橙皮书</span
              >
              <span
                class="id-green"
                v-if="base_info.submissionpropertytypecode === '是'"
                >孤儿药</span
              >
              <span
                class="id-green bg-blue"
                v-if="base_info.essentialmedicine !== ''"
                >基药</span
              >
              <span
                class="id-green bg-orange"
                v-if="base_info.firstinclass !== ''"
                title="首创新药"
                >首创</span
              >
              <span
                class="id-green"
                v-if="base_info.firstapproved !== ''"
                title="美国首批"
                >首批</span
              >
            </div>
          </div>

          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item><a href="/home">首页</a></el-breadcrumb-item>
            <el-breadcrumb-item
              ><a :href="'/' + allBase.dbename">{{
                allBase.dbname
              }}</a></el-breadcrumb-item
            >
            <el-breadcrumb-item>详情页</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </div>
      <div class="main" style="padding-top: 50px">
        <div class="base-info">
          <div class="base-info-ou">
            <ul class="base-info-in1" style="width: 25%">
              <li>
                <div class="flex">
                  <label>申请号</label>
                  <div class="flex1">
                    <span>{{ base_info.applno }}</span>
                  </div>
                </div>
              </li>
              <li>
                <div class="flex">
                  <label>申请类型</label>
                  <div class="flex1">
                    <span>
                      {{ base_info.appltype }}
                      {{ base_info.appltype_cn }}
                    </span>
                  </div>
                </div>
              </li>
              <li>
                <div class="flex">
                  <label>活性成分</label>
                  <div class="flex1">
                    <span>
                      <router-link
                        v-if="base_info.activeingredient"
                        tag="a"
                        :to="{
                          path: `/fdadrugnew?cname=${base_info.activeingredient}&tabName=nameGroup`,
                        }"
                        target="_blank"
                        class="link-a"
                        >{{ base_info.activeingredient }}</router-link
                      >
                      {{ base_info.cname }}
                    </span>
                  </div>
                </div>
              </li>
              <li>
                <div class="flex">
                  <label>剂型/给药途径</label>
                  <div class="flex1">
                    <span>{{ base_info.route }}</span>
                  </div>
                </div>
              </li>
              <li>
                <div class="flex">
                  <label>申请机构</label>
                  <div class="flex1">
                    <span>
                      <router-link
                        v-if="base_info.sponsorname"
                        tag="a"
                        :to="{
                          path: `/fdadrugnew?sponsorname=${base_info.sponsorname}&tabName=jigouGroup`,
                        }"
                        target="_blank"
                        class="link-a"
                        >{{ base_info.sponsorname }}</router-link
                      >
                      {{
                        base_info.chinesecompany !== "否"
                          ? base_info.chinesecompany
                          : ""
                      }}
                    </span>
                  </div>
                </div>
              </li>
              <li>
                <div class="flex">
                  <label>批准日期</label>
                  <div class="flex1">
                    <span>{{ base_info.submissionstatusdate1 }}</span>
                  </div>
                </div>
              </li>
            </ul>

            <ul class="base-info-in1 flex1">
              <li v-if="base_info.targets.length > 0">
                <div class="flex">
                  <label>靶点全称</label>
                  <div class="flex1">
                    <span
                      v-for="(item, ix) in base_info.targets"
                      style="margin-right: 15px; word-break: break-all"
                      :key="ix"
                    >
                      <span v-if="item.target_url">
                        <router-link
                          tag="a"
                          :to="{ path: item.target_url }"
                          target="_blank"
                          class="link-a"
                          >{{ item.target }}</router-link
                        >
                      </span>
                      <span v-else>{{ item.target }}</span>
                    </span>
                  </div>
                </div>
              </li>
              <li v-if="base_info.targets_abbr.length > 0">
                <div class="flex">
                  <label>靶点简称</label>
                  <div class="flex1">
                    <span
                      v-for="(item, ix) in base_info.targets_abbr"
                      style="margin-right: 15px; word-break: break-all"
                      :key="ix"
                    >
                      <span v-if="item.target_url">
                        <router-link
                          tag="a"
                          :to="{ path: item.target_url }"
                          target="_blank"
                          class="link-a"
                          >{{ item.target }}</router-link
                        >
                      </span>
                      <span v-else>{{ item.target }}</span>
                    </span>
                  </div>
                </div>
              </li>
              <li v-if="base_info.shiyingzheng">
                <div class="flex">
                  <label>适应症</label>
                  <div class="flex1 t-line5">
                    <span>{{ base_info.shiyingzheng }}</span>
                  </div>
                </div>
              </li>
            </ul>
            <div style="width: 40%"></div>
          </div>
          <ul class="base-info-in2">
            <li v-if="base_info.clinical">
              <label>临床试验</label>
              <div class="p-cont t-line5">
                <p>{{ base_info.clinical }}</p>
              </div>
            </li>
            <li v-if="base_info.summary">
              <label>药物概述</label>
              <div class="p-cont t-line5">
                <p>{{ base_info.summary }}</p>
              </div>
            </li>
          </ul>
        </div>
        <div class="classified-in">
          <div class="left-nav">
            <div class="nav-list nav-event" @click="handleNavClick">
              <a class="nav-item active" data-ix="0" v-if="showYpsq()"
                >药品申请与批准</a
              >
              <a class="nav-item" data-ix="1" v-if="ndc.List.length"
                >药品NDC信息</a
              >
              <a class="nav-item" data-ix="2" v-if="ypxxListData.List.length"
                >药品规格信息</a
              >
              <a class="nav-item" data-ix="3" v-if="equivalent.List.length"
                >治疗等效性相关药品信息</a
              >
              <a class="nav-item" data-ix="4" v-if="lsspListData.List.length"
                >原始申请或者临时审批</a
              >
              <a class="nav-item" data-ix="5" v-if="splsListData.List.length"
                >审批历史</a
              >
              <a class="nav-item" data-ix="6" v-if="hasExtend">扩展信息</a>
            </div>
          </div>
          <div class="right-list">
            <slide-section
              :title="'药品申请与批准'"
              class="the-part"
              v-if="showYpsq()"
            >
              <div class="tb-wrap">
                <table class="tb-t">
                  <tr
                    v-if="
                      base_info.chinesecompany !== '否' &&
                      base_info.chinesecompany !== ''
                    "
                  >
                    <td>中国药企</td>
                    <td colspan="3">
                      {{ base_info.chinesecompany }}
                    </td>
                  </tr>

                  <!-- <tr v-if="base_info.marketingstatusid">
                    <td>
                      市场状态
                      <el-tooltip effect="light" placement="right">
                        <div
                          slot="content"
                          v-html="tooltip.marketingstatusid"
                        ></div>
                        <i class="el-icon-question cl-green"></i>
                      </el-tooltip>
                    </td>
                    <td colspan="3">{{ base_info.marketingstatusid }}</td>
                  </tr> -->

                  <tr v-if="base_info.essentialmedicine">
                    <td>
                      基药
                      <el-tooltip effect="light" placement="right">
                        <div
                          slot="content"
                          v-html="tooltip.essentialmedicine"
                        ></div>
                        <i class="el-icon-question cl-green"></i>
                      </el-tooltip>
                    </td>
                    <td colspan="3">{{ base_info.essentialmedicine }}</td>
                  </tr>

                  <tr v-if="base_info.firstinclass">
                    <td>
                      首创新药
                      <el-tooltip effect="light" placement="right">
                        <div slot="content" v-html="tooltip.firstinclass"></div>
                        <i class="el-icon-question cl-green"></i>
                      </el-tooltip>
                    </td>
                    <td colspan="3">{{ base_info.firstinclass }}</td>
                  </tr>

                  <tr v-if="base_info.firstapproved">
                    <td>
                      美国首批
                      <el-tooltip effect="light" placement="right">
                        <div
                          slot="content"
                          v-html="tooltip.firstapproved"
                        ></div>
                        <i class="el-icon-question cl-green"></i>
                      </el-tooltip>
                    </td>
                    <td colspan="3">{{ base_info.firstapproved }}</td>
                  </tr>

                  <tr v-if="base_info.firstgeneric">
                    <td>
                      首仿药
                      <el-tooltip effect="light" placement="right">
                        <div slot="content" v-html="tooltip.firstgeneric"></div>
                        <i class="el-icon-question cl-green"></i>
                      </el-tooltip>
                    </td>
                    <td colspan="3">{{ base_info.firstgeneric }}</td>
                  </tr>

                  <tr v-if="base_info.f505b2">
                    <td>
                      505b2(FDA)
                      <el-tooltip effect="light" placement="right">
                        <div slot="content" v-html="tooltip.f505b2"></div>
                        <i class="el-icon-question cl-green"></i>
                      </el-tooltip>
                    </td>
                    <td colspan="3">{{ base_info.f505b2 }}</td>
                  </tr>

                  <tr v-if="base_info.offexclusiity">
                    <td>
                      非排他性
                      <el-tooltip effect="light" placement="right">
                        <div
                          slot="content"
                          v-html="tooltip.offexclusiity"
                        ></div>
                        <i class="el-icon-question cl-green"></i>
                      </el-tooltip>
                    </td>
                    <td colspan="3">{{ base_info.offexclusiity }}</td>
                  </tr>

                  <tr v-if="base_info.submissionpropertytypecode">
                    <td>孤儿药</td>
                    <td colspan="3">
                      {{ base_info.submissionpropertytypecode }}
                    </td>
                  </tr>

                  <tr v-if="base_info.firstcycle">
                    <td>
                      首轮评审
                      <el-tooltip effect="light" placement="right">
                        <div slot="content" v-html="tooltip.firstcycle"></div>
                        <i class="el-icon-question cl-green"></i>
                      </el-tooltip>
                    </td>
                    <td colspan="3">{{ base_info.firstcycle }}</td>
                  </tr>

                  <tr v-if="base_info.acceleration">
                    <td>
                      加速批准
                      <el-tooltip effect="light" placement="right">
                        <div slot="content" v-html="tooltip.acceleration"></div>
                        <i class="el-icon-question cl-green"></i>
                      </el-tooltip>
                    </td>
                    <td colspan="3">{{ base_info.acceleration }}</td>
                  </tr>

                  <tr v-if="base_info.breakthroughtherapy">
                    <td>
                      突破性疗法
                      <el-tooltip effect="light" placement="right">
                        <div
                          slot="content"
                          v-html="tooltip.breakthroughtherapy"
                        ></div>
                        <i class="el-icon-question cl-green"></i>
                      </el-tooltip>
                    </td>
                    <td colspan="3">{{ base_info.breakthroughtherapy }}</td>
                  </tr>

                  <tr v-if="base_info.priority">
                    <td>
                      优先审评
                      <el-tooltip effect="light" placement="right">
                        <div slot="content" v-html="tooltip.priority"></div>
                        <i class="el-icon-question cl-green"></i>
                      </el-tooltip>
                    </td>
                    <td colspan="3">{{ base_info.priority }}</td>
                  </tr>

                  <tr v-if="base_info.fasttrack">
                    <td>
                      快速审批
                      <el-tooltip effect="light" placement="right">
                        <div slot="content" v-html="tooltip.fasttrack"></div>
                        <i class="el-icon-question cl-green"></i>
                      </el-tooltip>
                    </td>
                    <td colspan="3">{{ base_info.fasttrack }}</td>
                  </tr>

                  <tr v-if="base_info.pdufa">
                    <td>
                      PDUFA
                      <el-tooltip effect="light" placement="right">
                        <div slot="content" v-html="tooltip.pdufa"></div>
                        <i class="el-icon-question cl-green"></i>
                      </el-tooltip>
                    </td>
                    <td colspan="3">{{ base_info.pdufa }}</td>
                  </tr>

                  <tr v-if="base_info.nda">
                    <td>
                      505b2(药智)
                      <el-tooltip effect="light" placement="right">
                        <div slot="content" v-html="tooltip.nda"></div>
                        <i class="el-icon-question cl-green"></i>
                      </el-tooltip>
                    </td>
                    <td colspan="3">{{ base_info.nda }}</td>
                  </tr>
                </table>
              </div>
            </slide-section>

            <slide-section
              :title="'药品NDC信息'"
              class="the-part"
              v-if="ndc.List.length"
            >
              <div class="tb-wrap">
                <el-table
                  :data="ndc.List"
                  stripe
                  fixed
                  class="table"
                  style="width: 100%"
                >
                  <el-table-column
                    v-for="item in ndc.tableHead"
                    :prop="item.prop"
                    :min-width="item.width"
                    :key="item.prop"
                    :label="item.label"
                  >
                    <template slot-scope="scope">
                      <div v-if="item.prop === 'productndc'" :title="scope.row.productndc">
                        <a
                          v-if="scope.row.productndc_url"
                          target="_blank"
                          :href="scope.row.productndc_url"
                          class="link-a1"
                          >{{ scope.row.productndc }}</a
                        >
                        <span v-else>{{ scope.row.productndc }}</span>
                      </div>
                      <template v-else>
                        <div :title="scope.row[item.prop]">{{ scope.row[item.prop] }}</div>
                      </template>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </slide-section>
            <slide-section
              :title="'药品规格信息'"
              class="the-part"
              v-if="ypxxListData.List.length"
            >
              <div class="tb-wrap zjl_unset">
                <el-table
                  :data="ypxxListData.List"
                  stripe
                  fixed
                  class="table"
                  style="width: 100%"
                >
                  <el-table-column
                    v-for="item in ypxxListData.tableHead"
                    :prop="item.prop"
                    :min-width="item.width"
                    :key="item.prop"
                    class="unset"
                    :label="item.label"
                  >
                    <template :slot="item.tips ? 'header' : ''">
                      <span>
                        {{ item.label }}
                        <el-tooltip effect="zhuce" placement="right">
                          <div slot="content" v-html="tooltip[item.prop]"></div>
                          <i
                            class="el-icon-question cl-green"
                            style="margin-left: 4px"
                          ></i>
                        </el-tooltip>
                      </span>
                    </template>
                    <template slot-scope="scope">
                      <div v-if="item.prop === 'patent'">
                        <a
                          class="linkPrimaryColor"
                          v-if="scope.row.patent"
                          target="_blank"
                          :href="scope.row.patent"
                          >查看</a
                        >
                        <span v-else>无</span>
                      </div>
                      <template v-else>
                        <div v-if="item.prop === 'strength'">
                          <a
                            v-if="scope.row[item.prop]"
                            class="linkPrimaryColor"
                            @click.prevent.stop="anchor(scope.row[item.prop])"
                          >
                            {{ scope.row[item.prop] }}
                          </a>
                          <a v-else class="linkPrimaryColor">
                            {{ scope.row[item.prop] }}
                          </a>
                        </div>
                        <div v-else>
                          <div>{{ scope.row[item.prop] }}</div>
                        </div>
                      </template>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </slide-section>
            <slide-section
              :title="'治疗等效性相关药品信息'"
              class="the-part"
              v-if="equivalent.List.length"
            >
              <div class="tb-wrap">
                <div class="label-zl">
                  <span v-if="base_info.activeingredient">
                    <strong>活性成分：</strong>
                    {{ base_info.activeingredient }}
                  </span>
                  <span v-if="base_info.route">
                    <strong>剂型/给药途径：</strong>
                    {{ base_info.route }}
                  </span>
                  <span v-if="base_info.tecode">
                    <strong>
                      等效性代码
                      <el-tooltip effect="light" placement="right">
                        <div slot="content" v-html="tooltip.tecode"></div>
                        <i class="el-icon-question cl-green"></i> </el-tooltip
                      >：
                    </strong>
                    {{ base_info.tecode }}
                  </span>
                </div>
                <div
                  v-for="(items, ix) in equivalent.List"
                  :id="items.strength"
                  :key="ix"
                  class="equiv-lz"
                  :class="{
                    selected: items.strength && curAnchor === items.strength,
                  }"
                >
                  <p>
                    <span>规格</span>
                    <span v-if="items.strength" class="fontw"
                      >（{{ items.strength }}）</span
                    >
                  </p>
                  <el-table
                    :data="items.child"
                    :stripe="curAnchor !== items.strength"
                    :key="items.strength"
                    :id="items.strength"
                    fixed
                    :row-style="TableRowStyle"
                    :header-cell-style="TableHeaderStyle(items.strength)"
                    class="table"
                    style="width: 100%"
                  >
                    <el-table-column
                      v-for="item in equivalent.tableHead"
                      :prop="item.prop"
                      :min-width="item.width"
                      :key="item.prop"
                      :label="item.label"
                    >
                      <template slot-scope="scope">
                        <div v-if="item.prop === 'applno'" :title="scope.row.applno">
                          <a
                            v-if="
                              scope.row.applno_url &&
                              !scope.row.applno_url.includes(base_info.applno)
                            "
                            target="_blank"
                            class="link-a1"
                            :href="scope.row.applno_url"
                            >{{ scope.row.applno }}</a
                          >
                          <span v-else>{{ scope.row.applno }}</span>
                        </div>
                        <template v-else>
                          <div :title="scope.row[item.prop]">{{ scope.row[item.prop] }}</div>
                        </template>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>
            </slide-section>
            <slide-section
              :title="'原始申请或者临时审批'"
              class="the-part"
              v-if="lsspListData.List.length"
            >
              <div class="tb-wrap">
                <el-table
                  :data="lsspListData.List"
                  stripe
                  fixed
                  class="table"
                  style="width: 100%"
                >
                  <el-table-column
                    v-for="item in lsspListData.tableHead"
                    :prop="item.prop"
                    :min-width="item.width"
                    :key="item.prop"
                    :label="item.label"
                  >
                    <template :slot="item.tips ? 'header' : ''">
                      <span>
                        {{ item.label }}
                        <el-tooltip effect="zhuce" placement="right">
                          <div slot="content" v-html="tooltip[item.prop]"></div>
                          <i
                            class="el-icon-question cl-green"
                            style="margin-left: 4px"
                          ></i>
                        </el-tooltip>
                      </span>
                    </template>
                    <template slot-scope="scope">
                      <div v-if="item.prop === 'submissionstatusdate'">
                        {{ scope.row.submissionstatusdate }}
                      </div>
                      <div v-if="item.prop === 'submissiontype'">
                        {{ scope.row.submissiontype }}
                      </div>
                      <div v-if="item.prop === 'submissionstatus'">
                        {{ scope.row.submissionstatus }}
                      </div>
                      <div v-if="item.prop === 'submissionclasscode'">
                        {{ scope.row.submissionclasscode }}
                      </div>
                      <div v-if="item.prop === 'reviewpriority'">
                        {{ scope.row.reviewpriority }}
                      </div>
                      <div
                        v-if="item.prop === 'applicationdocsurl'"
                        style="
                          display: -webkit-box;
                          -webkit-box-orient: horizontal;
                          max-height: unset;
                        "
                      >
                        <span v-html="scope.row.url"></span>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </slide-section>
            <slide-section
              :title="'审批历史'"
              class="the-part"
              v-if="splsListData.List.length"
            >
              <div class="tb-wrap">
                <el-table
                  :data="splsListData.List"
                  stripe
                  fixed
                  class="table"
                  style="width: 100%"
                >
                  <el-table-column
                    v-for="item in splsListData.tableHead"
                    :prop="item.prop"
                    :min-width="item.width"
                    :key="item.prop"
                    :label="item.label"
                  >
                    <template
                      slot-scope="scope"
                      v-if="scope.row.submissiontype !== ''"
                    >
                      <div v-if="item.prop === 'submissionstatusdate'">
                        {{ scope.row.submissionstatusdate }}
                      </div>
                      <div v-if="item.prop === 'submissiontype'">
                        {{ scope.row.submissiontype }}
                      </div>
                      <div v-if="item.prop === 'submissionno'">
                        {{ scope.row.submissionno }}
                      </div>
                      <div v-if="item.prop === 'submissionclasscode'">
                        {{ scope.row.submissionclasscode }}
                      </div>
                      <div
                        v-if="item.prop === 'applicationdocsurl'"
                        style="
                          display: -webkit-box;
                          -webkit-box-orient: horizontal;
                          max-height: unset;
                        "
                      >
                        <span
                          v-for="(item, index) in scope.row.applicationdocsurl"
                          :key="index"
                        >
                          <br v-if="index" />
                          <a
                            :href="item"
                            style="color: #4877e8"
                            target="_blank"
                            v-html="handleAAA(item)"
                          ></a>
                        </span>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </slide-section>
            <slide-section
              :title="'扩展信息'"
              class="the-part"
              v-if="hasExtend"
            >
              <div class="extend-list">
                <ExtendButton
                  v-for="(item, index) in extendList"
                  :key="index"
                  :item="item"
                ></ExtendButton>
              </div>
            </slide-section>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LoadingGif from "@/components/common/globalCom/loading-gif";
import SlideSection from "@/components/common/slide-section";
import ExtendButton from "@/components/common/extend-button";
import LaFooter from "@/components/layouts/footer";
import tablehead from "@/config/tablehead";
import { mapState } from "vuex";
import detailScrollMixins from "@/mixins/detailScroll.js";
const ypxxHead = tablehead.cfdadrug.Detailfdadrugxq;
const lsspHead = tablehead.cfdadrug.Detailyssq;
const splsHead = tablehead.cfdadrug.Detailspls;
const ndcHead = tablehead.cfdadrug.Detailndc;
const equivalentHead = tablehead.cfdadrug.Detailequivalent;

export default {
  components: {
    SlideSection,
    LaFooter,
    ExtendButton,
    LoadingGif,
  },
  mixins: [detailScrollMixins],
  data() {
    return {
      spacingH: 0,
      temActive: 0,
      tooltip: {
        marketingstatusid:
          "暂定批准是指对符合全部批准条件的仿制药申请所采取的行动，但是在申请所参考的上市药物的市场独占权和/或专利期限到期之前，它不被允许在美国合法销售。",
        essentialmedicine:
          "基本药物是美国急诊医疗机构中患者最需要的药物，专门用于严重伤害或疾病以及紧急医疗状况的短期治疗；也着重于包括医学上必需的药物，以便有足够的供应。",
        firstgeneric:
          "FDA首次批准并允许制造商在美国销售此药。FDA认为第一个首仿药对公众健康很重要，并优先审查这些提交的文件。",
        f505b2: "FDA官方统计公布的从2011年至目前最新的505b2数据。",
        nda: "根据行业专家指导从“提交分类”中综合筛选出来的改良型新药。",
        offexclusiity:
          "申请人在这些NDA新药过了保护期之后申请ANDA，但是向FDA提交ANDA之前，需要参考上述三个选项。partI：若提交为ANDA，FDA可立即受理；partII：若提交为ANDA，会涉及到部分法案，需要在此之前与FDA沟通；appendix：从partI、partII删除，已获得FDA的批准。",
        acceleration:
          "加速批准主要适用于病程较长和需要较长的时间才能衡量药物预期的临床效益的环境。",
        breakthroughtherapy:
          "如果一种药物被指定为突破性治疗，FDA将加快这种药物的开发和审查。所有突破性治疗指定的申请将在收到后60天内进行审核，FDA有权利批准或拒绝该申请。",
        priority:
          "优先审评是在提交BLA，NDA或功效补充剂时确定的。如果符合相关标准，则任何药物，包括已获得快速通道名称，突破性疗法名称或正在评估加速批准的药物，都可以进行优先审评。",
        fasttrack:
          "快速审批通道是指用于治疗严重或危及生命的疾病的药物，非临床或临床数据表明有潜力解决严重疾病的未满足医疗需求。",
        submissionclasscode:
          "对于原始(ORIG)的NDA提交，此处提供了新药申请的分类；对于补充(SUPPL)提交，此处描述了FDA批准申请的变更类型。",
        tecode:
          "使用户快速了解FDA是否已将特定批准的药品评估为与其他药学等效性产品具有等效治疗性（第一个字母），并在FDA的评估基础上提供其他信息（第二个字母）。首字母A代表没有生物等效问题，或已解决，B有生物等效问题且尚未解决。第二个字母按照剂型等划分其他信息。",
        referencedrug:
          "简称RLD，是指在FDA批准上市，用于仿制药注册申请的参照药品。通常是具有完整规范的安全性和有效性研究数据的药品。",
        firstinclass:
          "即first-in-class，一种新的和独特的机制来治疗疾病的药物。",
        firstapproved: "在其他国家批准之前在美国首次批准的药物。",
        pdufa:
          'FDA将就每一项申请设置一个审批截止日期(目标日期)，即PDUFA date，为"是"，则该项申请在规定日期截至之内完成了审批。',
        firstcycle:
          "新药的首轮评审有效地防止了将有价值的新疗法推向市场的延误。",
      },

      isLoading: true,
      id: "",
      // steps,
      data: {},
      scroll: "",
      heightArr: [],
      hasPartOne: true,
      hasPartTwo: false,
      hasPartThree: false,
      hasPartFour: false,
      hasExtend: false,
      yfxx: {},
      base_info: {},
      ypxxListData: {
        List: [],
        tableHead: ypxxHead,
      },
      lsspListData: {
        List: [],
        tableHead: lsspHead,
      },
      splsListData: {
        List: [],
        tableHead: splsHead,
      },
      ndc: {
        List: [],
        tableHead: ndcHead,
      },
      equivalent: {
        List: [],
        tableHead: equivalentHead,
      },
      sull: "",
      pass: "", //原始申请url获取的参数
      passtwo: "", //审批历史url获取的参数
      passthree: "",
      extendList: [],
      curAnchor: "", // 当前点击的规格
    };
  },
  computed: {
    ...mapState({
      nopms: (state) => state.Fdadrugnew.nopms,
      allBase: (state) => state.Fdadrugnew.allBase,
      helpInfo: (state) => state.Fdadrugnew.helpInfo,
    }),
  },
  watch: {
    isLoading(val) {
      if (!val) {
        this.$nextTick(function () {
          setTimeout(() => {
            this.spacingH = $(".base-info").outerHeight() + 20;
            this.getPartsHeight();
          }, 0);
        });
      }
    },
  },
  methods: {
    // 判断药品申请与批准显示
    showYpsq() {
      if (
        (this.base_info.chinesecompany && this.base_info.chinesecompany!=='否') ||
        this.base_info.essentialmedicine ||
        this.base_info.firstinclass ||
        this.base_info.firstapproved ||
        this.base_info.firstgeneric ||
        this.base_info.f505b2 ||
        this.base_info.offexclusiity ||
        this.base_info.submissionpropertytypecode ||
        this.base_info.firstcycle ||
        this.base_info.acceleration ||
        this.base_info.breakthroughtherapy ||
        this.base_info.priority ||
        this.base_info.fasttrack ||
        this.base_info.pdufa ||
        this.base_info.nda
      ) {
        return true;
      } else {
        return false;
      }
    },
    TableRowStyle({ row, rowIndex }) {
      return {
        background:
          row.strength && this.curAnchor === row.strength
            ? "rgba(255, 245, 242) !important"
            : "",
      };
    },
    TableHeaderStyle(val) {
      console.log(val);
      return {
        background:
          val != "" && this.curAnchor === val
            ? "rgba(255, 245, 242) !important"
            : "",
      };
    },
    // 锚链接跳转
    anchor(anchorName) {
      console.log(this.curAnchor !== anchorName);
      if (this.curAnchor !== anchorName) {
        this.curAnchor = anchorName;
        // 找到锚点
        const anchorElement = document.getElementById(anchorName);
        // 如果对应id的锚点存在，就跳转到锚点
        if (anchorElement) {
          anchorElement.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
          });
        }
      } else {
        this.curAnchor = "";
      }
    },
    handleNavClick1(e) {
      const index = Number($(e.target).attr("data-ix"));
      $(e.target).parent().children().removeClass("active");
      $(e.target).addClass("active");
      this.temActive = index;
    },
    //控制审批历史里面标签显示的文字
    handleAAA(item) {
      if (item.indexOf("/appletter/") !== -1) {
        return "Letter";
      } else if (item.indexOf("/label/") !== -1) {
        return "Label";
      } else if (item.indexOf("/nda/") !== -1) {
        return "Review";
      }
    },
    //获取详情头部和基本信息的数据
    handleAxiosJbxxList() {
      window
        .Axios({
          method: "get",
          url: "/api/fdadrugnew/detail?id=" + this.$route.params.id,
          params: {
            accesstoken: GETCOOKIEFUN("accesstoken"),
          },
        })
        .then((res) => {
          if (res.data.code === 200 && res.data) {
            let data = res.data.data;
            this.base_info = data.base_info;

            this.ypxxListData.List = data.apply_number_drug_list;
            this.lsspListData.List = data.original_apply_list;
            this.splsListData.List = data.approval_history_list;
            this.equivalent.List = data.equivalent;
            this.ndc.List = data.ndc;
            this.getExtendList("fdadrugnew", data.extendList);
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .then(this.removeLoading);
    },
    // 加载完后移除加载界面
    removeLoading() {
      this.isLoading = false;
    },
  },
  created() {
    if (!this.nopms.xqy) {
      this.handleAxiosJbxxList();
    }

    setTimeout(() => {
      const hashLocation = sessionStorage.getItem("hashLocation"); //缓存中获取当前页面的路由名称
      // 注意, 这里使用全路径匹配,在hash模式中,因为地址会携带#,所以页面报告中的url需要重新覆盖一下, 将#去除
      window._paq.push(["setCustomUrl", "https://" + hashLocation]); //覆盖页面报告的url，可以自定义页面url，加上本页面路由
      window._paq.push(["trackPageView", this.allBase.dbname]); //页面名称,可以自定义页面名称
      window._paq.push(["setDocumentTitle", this.allBase.dbname]);
    }, 1000);
  },
  mounted() {
    Store.dispatch("Fdadrugnew/getBaseInfo");
    const _this = this;
    $(document).click(function (e) {
      var wrapper = $(".selected"); //设置空白以外的目标区域
      if (!wrapper.is(e.target) && wrapper.has(e.target).length === 0) {
        _this.curAnchor = "";
      }
    });
    // this.onScroll()
  },
  activated() {
    this.vueRouteToNoPms(this.nopms.xqy);
  },
  updated() {
    this.vueRouteToNoPms(this.nopms.xqy);
    this.vueTogglePmsTooltip();
  },
};
</script>

<style lang="less" scoped>
@import "~@/assets/less/var.less";
@import "~@/assets/less/detailCom.less";

.flex {
  display: flex;
}

.flex1 {
  flex: 1;
}

.t-line5 {
  max-height: 100px;
  overflow-y: auto;
}

.link-a {
  color: #4877e8;

  &:hover {
    text-decoration: underline;
  }
}

.link-a1 {
  color: #4877e8;
}

.label-zl {
  span {
    margin-right: 30px;
    font-size: 13px;
  }
}

/deep/.selected,
/deep/.anchor {
  background: rgba(255, 245, 242) !important;
}

.equiv-lz {
  margin-top: 20px;

  p {
    font-size: 14px;
    // font-style: italic;
  }

  span.fontw {
    font-weight: 700;
  }
}

/deep/.slide-section .content {
  padding-top: 0 !important;
}

.base-info {
  position: relative;
  padding: 30px;
  margin-bottom: 20px;
  box-shadow: 0px 0px 5px #c4d3f8;
  background: #fff;
  border-radius: 4px;

  .base-info-ou {
    display: flex;
  }

  .base-info-in1 {
    padding: 0 20px;

    > li {
      margin-bottom: 10px;
      line-height: 20px;
      color: #000;
      font-size: 16px;
      position: relative;

      label {
        width: 100px;
        display: inline-block;
        font-size: 14px;
      }

      span {
        color: #35384a;
        font-size: 14px;
      }

      &::before {
        content: " ";
        position: absolute;
        left: -15px;
        top: 8px;
        width: 4px;
        height: 4px;
        background-color: #000;
        border-radius: 50%;
      }
    }
  }

  .base-info-in2 {
    > li {
      display: flex;
      align-items: center;
      margin-top: 15px;
      padding: 20px 20px 20px 0;
      background: #eff2fa;

      label {
        width: 24px;
        padding: 10px;
        background: #4877e8;
        color: #fff;
        text-align: center;
        font-weight: 700;
      }

      .p-cont {
        line-height: 20px;
        padding-left: 20px;
        font-size: 13px;
        flex: 1;

        p {
          word-break: break-all;
        }
      }
    }
  }
}

.left-nav {
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
}
</style>
<style lang="less">
// #anchorTable {
//   /deep/.el-table__body tr:hover>td,
//   /deep/.el-table__body tr.current-row>td {
//     background: rgba(255, 245, 242) !important;
//   }
//  }
</style>
<style scoped>
.zjl_unset >>> .cell {
  -webkit-line-clamp: unset !important;
}

.right-list {
  padding-top: 0 !important;
}
.wrapper .detail-list .detail-header .header-left .left-top {
  width: auto;
}
</style>
