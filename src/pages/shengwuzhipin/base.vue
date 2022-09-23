<template>
  <Main class="shengwuzhipin">
    <!-- 保存条件 - 输入名称 弹出框 -->
    <el-dialog
      class="dialog-saved"
      :visible.sync="savedPopVisible"
      :modal-append-to-body="false"
    >
      <div slot="title" class="dialog-header">
        保存条件
      </div>
      <SavedPop
        @closeSavedPop="closeSavedPop"
        vuex_name="Shengwuzhipin"
      ></SavedPop>
    </el-dialog>
    <!-- 高级搜索弹出框 -->
    <el-dialog
      :visible.sync="dialogFormVisible"
      :modal-append-to-body="false"
      width="815px"
    >
      <div slot="title" class="dialog-header">
        高级搜索
      </div>
      <Advanced
        :dialogFormVisible="dialogFormVisible"
        vuex_name="Shengwuzhipin"
        api_name="pqf"
        route1="list"
        route2="analy"
        @closeAdvancedDialog="closeAdvancedDialog"
        @clearLeft="clearLeft"
        ref="advanced"
      ></Advanced>
    </el-dialog>

    <!-- 左边部分 -->
    <div slot="left">
      <!-- 普通搜索项 -->
      <template v-for="(item, index) in vueHandleInitPutong(nomal_filed)">
        <Normal
          vuex_name="Shengwuzhipin"
          api_name="pqf"
          :item="item"
          :key="index"
          route1="list"
          route2="analy"
          ref="ileft"
        ></Normal>
      </template>
      <!-- 普通搜索按钮 & 高级搜索入口 -->
      <div class="advanced-search">
        <!-- 高级搜索 -->
        <span class="fr adva-icon">
          <em class="iconfont">&#xe67a;</em
          ><a
            @click.prevent="handleAdvancedClick()"
            :class="{ 'abandon-click-method': nopms.gjss }"
            >高级搜索</a
          >
          <el-tooltip
            class="item"
            effect="light"
            placement="right"
            v-if="helpInfo.high_holder"
          >
            <div slot="content" v-html="helpInfo.high_holder"></div>
            <i class="el-icon-question cl-green"></i>
          </el-tooltip>
        </span>
        <!-- 普通搜索 -->
        <el-button
          class="advanced-search-btn"
          type="primary"
          size="mini"
          round
          @click="nomalSearch"
          >搜索</el-button
        >
      </div>
      <!-- 条件筛选（普通/高级搜索之后的二次筛选） -->
      <Filters vuex_name="Shengwuzhipin" route1="list" route2="analy"></Filters>
      <!-- 保存的条件 -->
      <Saved vuex_name="Shengwuzhipin" api_name="pqf"></Saved>
      <!-- 历史搜索 -->
    </div>

    <!-- 右边部分 -->
    <div class="la-right">
      <!-- 顶部 -->
      <section class="sec1 clearfix">
        <span class="database-name">{{ allBase.dbname }}</span>
        <!-- <span class="database-num" v-if="baseCount&&$route.path.split('/')[2]==='list'">{{baseCount | formatNumber}}</span> -->
        <div class="sec1-right">
          <!-- <div :class="{'top-help-wrap':update_conf.log}">
            <el-tooltip class="help-tip" effect="light" placement="bottom"  v-if="helpInfo.remark ? helpInfo.remark : ''" >
              <div slot="content">
                <el-scrollbar>
                  <div class="tip-content" v-html="helpInfo.remark ? helpInfo.remark : ''"></div>
                </el-scrollbar>
                <a class="btn default" :href="helpInfo.url" target="_blank">帮助中心</a>
              </div>
              <span><i class="el-icon-warning cl-green pr5"></i>帮助</span>
            </el-tooltip>
            <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item ><a href="/home">首页</a></el-breadcrumb-item>
              <el-breadcrumb-item v-if="allBase.catname">{{allBase.catname}}</el-breadcrumb-item>
              <el-breadcrumb-item><a :href="'/' + allBase.dbename">{{allBase.dbname}}</a></el-breadcrumb-item>
            </el-breadcrumb>
          </div> -->
          <div class="top-update-wrap">
            <el-tooltip
              class="help-tip"
              effect="light"
              placement="bottom"
              v-if="helpInfo.remark ? helpInfo.remark : ''"
            >
              <div slot="content">
                <el-scrollbar>
                  <div
                    class="tip-content"
                    v-html="helpInfo.remark ? helpInfo.remark : ''"
                  ></div>
                </el-scrollbar>
                <a
                  class="btn default"
                  v-if="helpInfo.url"
                  :href="helpInfo.url"
                  target="_blank"
                  >帮助中心</a
                >
              </div>
              <span><i class="el-icon-warning cl-green pr5"></i>帮助</span>
            </el-tooltip>
            {{ update_conf.log }}
          </div>
        </div>
      </section>
      <section class="sec2">
        <!-- <div class="la-body-tab">
          <div class="market_nav">
            <a @click.prevent="navRouteTo(1)" class="nav_one" :class="{'router-link-active': $route.path == '/pqf/list'}">
              <span class="nav"><i class="iconfont pr5" style="font-size:20px;">&#xe627;</i>销售数据</span>
            </a>
            <a @click.prevent="navRouteTo(2)" class="nav_one" :class="{'router-link-active': $route.path == '/pqf/analy', 'abandon-click-method': nopms.ksh}">
              <span class="nav"><i class="iconfont pr5" style="font-size:20px;">&#xe643;</i>智能分析</span>
            </a>
          </div>
        </div> -->
        <div class="search-body-content">
          <Optioned
            @showSavedPop="showSavedPop"
            @clearLeft="clearLeft"
            @clearTheLeft="clearTheLeft"
            vuex_name="Shengwuzhipin"
            dbname="pqf"
            route1="list"
            route2="analy"
          >
            <i class="iconfont sh">&#xe60c;</i>
            <!-- &#xe67f; -->
            <div class="analy fr">
              <span v-show="isShowAnaly">
                <i-wave />
                更多统计，试试<a
                  href="javascript:void(0);"
                  class="cl-blue"
                  @click="showAnaly"
                  >精准分析</a
                >吧
              </span>
            </div>
          </Optioned>
          <keep-alive>
            <router-view></router-view>
          </keep-alive>
        </div>
      </section>
    </div>

    <!-- 定量分析 -->
    <full-screen
      :nowNav="nowNav"
      :navs="navs"
      @changeNowNav="changeNowNav"
      @close="dialogClose"
      :titles="'生物制品销售精准分析'"
      showDesc="根据最小单位折算后统计分析"
    >
      <!-- ①药品分析 -->
      <div class="fs-page ypfx" slot="检品分析">
        <div class="head">
          <div class="title">{{ searchValYp }}</div>
          <div>
            <!-- <el-select v-model="searchDefValYp"
              filterable remote
              :remote-method="ypfxRemote"
            >
              <el-option
                v-for="item in searchListYp"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <button @click="searchByValue1()">搜索</button> -->
            <inputPopover :value="searchDefValYp">
              <el-autocomplete
                v-model="searchDefValYp"
                clearable
                :fetch-suggestions="ypfxFetchSuggestions"
                @select="searchByValue1"
                :popper-append-to-body="false"
                suffix-icon="el-icon-search"
              >
                <template slot-scope="{ item }">
                  <div
                    style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;"
                    :title="item.value"
                  >
                    {{ item.value }}
                  </div>
                </template>
              </el-autocomplete>
            </inputPopover>
          </div>
        </div>
        <div class="totals">
          <ul class="total-item">
            <li class="li1">检品规格</li>
            <li class="li2">
              <span>{{ ypfx.jpgg | formatNumber }}</span
              >个
            </li>
          </ul>
          <ul class="total-item">
            <li class="li1">生产企业</li>
            <li class="li2">
              <span>{{ ypfx.scqy | formatNumber }}</span
              >个
            </li>
          </ul>
          <ul class="total-item">
            <li class="li1">签发年份</li>
            <li class="li2">
              <span>{{ ypfx.qfnf | formatNumber }}</span
              >个
            </li>
          </ul>
          <ul class="total-item">
            <li class="li1">销售量（最新年份）</li>
            <li class="li2">
              <span>{{ ypfx.xsl | formatNumber }}</span>
            </li>
          </ul>
          <ul class="total-item">
            <li class="li1">销售总额（最新年份）</li>
            <li class="li2">
              <span>{{ ypfx.xsze | formatNumber }}</span
              >万元
            </li>
          </ul>
        </div>
        <div class="column">
          <div class="view">
            请选择签发年份：
            <el-select v-model="ypfx.val2">
              <el-option
                v-for="item in ypfx.select2"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <el-button
              v-if="searchValYp"
              class="top-btn"
              type="primary"
              size="mini"
              round
              @click="clickBtn"
              ><i class="iconfont download-icon">&#xe62c;</i>下载数据</el-button
            >
          </div>
        </div>
        <!-- 按企业分析 -->
        <div class="column">
          <!-- HEAD -->
          <div class="head">
            <span class="title">按企业分析</span>
          </div>
          <!-- VIEW -->
          <div class="view xssjtj">
            <div class="chart resizeChart" ref="ypfxChart1"></div>
          </div>
        </div>
        <!-- 按规格分析 -->
        <div class="column">
          <!-- HEAD -->
          <div class="head">
            <span class="title">按规格分析</span>
          </div>
          <!-- VIEW -->
          <div class="view ndxsfx">
            <div class="chart2 resizeChart" ref="ypfxChart2"></div>
            <div class="chart2 chartSwitch">
              <el-tabs value="first" @tab-click="chart3_4">
                <el-tab-pane label="销量" name="first">
                  <div class="switchChart resizeChart" ref="ypfxChart3"></div>
                </el-tab-pane>
                <el-tab-pane label="销售额" name="second">
                  <div class="switchChart resizeChart" ref="ypfxChart4"></div>
                </el-tab-pane>
              </el-tabs>
            </div>
          </div>
        </div>
        <!-- 按签发日期分析(年统计) -->
        <div class="column">
          <!-- HEAD -->
          <div class="head">
            <span class="title">按签发日期分析(年统计)</span>
          </div>
          <!-- VIEW -->
          <div class="view ndxsfx">
            <div
              v-if="this.ypfx.val2 == 'all'"
              class="chart resizeChart"
              ref="ypfxChart5"
              key="ypfxChart5"
            ></div>
            <template v-else>
              <div
                class="chart2 resizeChart"
                ref="ypfxChart6"
                key="ypfxChart6"
              ></div>
              <div class="chart2 chartSwitch">
                <el-tabs value="first" @tab-click="chart7_8">
                  <el-tab-pane label="销量" name="first">
                    <div class="switchChart resizeChart" ref="ypfxChart7"></div>
                  </el-tab-pane>
                  <el-tab-pane label="销售额" name="second">
                    <div class="switchChart resizeChart" ref="ypfxChart8"></div>
                  </el-tab-pane>
                </el-tabs>
              </div>
            </template>
          </div>
        </div>
        <!-- 国产进口分布情况 -->
        <div v-if="this.ypfx.val2 == 'all'" class="column">
          <!-- HEAD -->
          <div class="head">
            <span class="title">国产进口分布情况</span>
          </div>
          <!-- VIEW -->
          <div class="view ndxsfx">
            <div class="chart resizeChart" ref="ypfxChart9"></div>
          </div>
        </div>
      </div>
      <!-- ②企业分析 -->
      <div class="fs-page qyfx" slot="企业分析">
        <div class="head">
          <div class="title">{{ searchValQy }}</div>
          <div>
            <!-- <el-select v-model="searchDefValQy"
              filterable remote
              :remote-method="qyfxRemote"
            >
              <el-option
                v-for="item in searchListQy"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <button @click="searchByValue2()">搜索</button> -->
            <inputPopover :value="searchDefValQy">
              <el-autocomplete
                v-model="searchDefValQy"
                clearable
                :fetch-suggestions="qyfxFetchSuggestions"
                @select="searchByValue2"
                suffix-icon="el-icon-search"
                :popper-append-to-body="false"
              >
                <template slot-scope="{ item }">
                  <div
                    style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;"
                    :title="item.value"
                  >
                    {{ item.value }}
                  </div>
                </template>
              </el-autocomplete>
            </inputPopover>
          </div>
        </div>
        <div class="totals">
          <ul class="total-item">
            <li class="li1">检品数量</li>
            <li class="li2">
              <span>{{ qyfx.jpsl | formatNumber }}</span
              >个
            </li>
          </ul>
          <ul class="total-item">
            <li class="li1">签发年份</li>
            <li class="li2">
              <span>{{ qyfx.qfnf | formatNumber }}</span
              >个
            </li>
          </ul>
          <ul class="total-item">
            <li class="li1">销售量（最新年份）</li>
            <li class="li2">
              <span>{{ qyfx.xsl | formatNumber }}</span>
            </li>
          </ul>
          <ul class="total-item">
            <li class="li1">销售总额（最新年份）</li>
            <li class="li2">
              <span>{{ qyfx.xsze | formatNumber }}</span
              >万元
            </li>
          </ul>
        </div>
        <div class="column">
          <div class="view">
            请选择签发年份：
            <el-select v-model="qyfx.val2">
              <el-option
                v-for="item in qyfx.select2"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <el-button
              v-if="searchDefValQy"
              class="top-btn"
              type="primary"
              size="mini"
              round
              @click="clickBtn"
              ><i class="iconfont download-icon">&#xe62c;</i>下载数据</el-button
            >
          </div>
        </div>
        <!-- 按检品分析 -->
        <div class="column">
          <!-- HEAD -->
          <div class="head">
            <span class="title">按检品分析</span>
          </div>
          <!-- VIEW -->
          <div class="view xssjtj">
            <div class="chart2 resizeChart" ref="qyfxChart1"></div>
            <div class="chart2 chartSwitch">
              <el-tabs value="first" @tab-click="chart2_3">
                <el-tab-pane label="销量" name="first">
                  <div class="switchChart resizeChart" ref="qyfxChart2"></div>
                </el-tab-pane>
                <el-tab-pane label="销售额" name="second">
                  <div class="switchChart resizeChart" ref="qyfxChart3"></div>
                </el-tab-pane>
              </el-tabs>
            </div>
          </div>
        </div>
        <!-- 按签发日期分析(年统计) -->
        <div class="column">
          <!-- HEAD -->
          <div class="head">
            <span class="title">按签发日期分析(年统计)</span>
          </div>
          <!-- VIEW -->
          <div class="view ndxsfx">
            <div
              v-if="this.qyfx.val2 == 'all'"
              class="chart resizeChart"
              ref="qyfxChart4"
              key="qyfxChart4"
            ></div>
            <template v-else>
              <div
                class="chart2 resizeChart"
                ref="qyfxChart5"
                key="qyfxChart5"
              ></div>
              <div class="chart2 chartSwitch">
                <el-tabs value="first" @tab-click="chart6_7">
                  <el-tab-pane label="销量" name="first">
                    <div class="switchChart resizeChart" ref="qyfxChart6"></div>
                  </el-tab-pane>
                  <el-tab-pane label="销售额" name="second">
                    <div class="switchChart resizeChart" ref="qyfxChart7"></div>
                  </el-tab-pane>
                </el-tabs>
              </div>
            </template>
          </div>
        </div>
        <!-- 按类别分析 -->
        <div v-if="this.qyfx.val2 == 'all'" class="column">
          <!-- HEAD -->
          <div class="head">
            <span class="title">按类别分析</span>
          </div>
          <!-- VIEW -->
          <div class="view ndxsfx">
            <div class="chart resizeChart" ref="qyfxChart8"></div>
          </div>
        </div>
      </div>
    </full-screen>
  </Main>
</template>

<script>
import Saved from "@/components/common/saved";
import SavedPop from "@/components/common/saved-pop";
import Optioned from "@/components/common/options";
import Normal from "@/components/common/normal";
import Advanced from "@/components/common/advanced";
import Filters from "@/components/common/filters-config";
import Main from "@/components/layouts/main";
import FullScreen from "@/components/common/full-screen";
import { mapState } from "vuex";
import IWave from "@/components/common/icon-wave";
import inputPopover from "@/components/inputs/input-popover";

export default {
  components: {
    Saved,
    SavedPop,
    Optioned,
    Normal,
    Advanced,
    Filters,
    Main,
    FullScreen,
    IWave,
    inputPopover
  },
  data() {
    return {
      savedPopVisible: false,
      dialogFormVisible: false, //控制高级搜索弹框
      route: this.$route.path.split("/")[2],
      navs: ["检品分析", "企业分析"],
      // ①定量分析 - 药品分析
      ypfx: {
        select2: [{ label: "全部年份", value: "all" }],
        val2: "all",
        jpgg: 0,
        scqy: 0,
        qfnf: 0,
        xsl: 0,
        xsze: 0,
        chart: {
          xszl: {
            // 销售总量
            legend: [],
            x: [],
            yLeftTitle: "",
            yRightTitle: "",
            series: []
          },
          ggxs: {
            // 规格销售
            legend: [],
            x: [],
            yLeftTitle: "",
            yRightTitle: "",
            series: []
          },
          ggxs_xl: {
            // 规格销售-销量
            legend: [],
            series: []
          },
          ggxs_xse: {
            // 规格销售-销售额
            legend: [],
            series: []
          },
          qfsj: {
            // 签发时间
            legend: [],
            x: [],
            yLeftTitle: "",
            yRightTitle: "",
            series: []
          },
          qfsj_jd: {
            // 签发时间-季度
            legend: [],
            x: [],
            yLeftTitle: "",
            yRightTitle: "",
            series: []
          },
          qfsj_xl: {
            // 签发时间-销量
            legend: [],
            series: []
          },
          qfsj_xse: {
            // 签发时间-销售额
            legend: [],
            series: []
          },
          jck: {
            // 进出口
            legend: [],
            x: [],
            yLeftTitle: "",
            yRightTitle: "",
            series: []
          }
        }
      },
      qyfx: {
        select2: [{ label: "全部年份", value: "all" }],
        val2: "all",
        jpsl: 0,
        qfnf: 0,
        xsl: 0,
        xsze: 0,
        chart: {
          xszl: {
            // 销售总量
            legend: [],
            x: [],
            yLeftTitle: "",
            yRightTitle: "",
            series: []
          },
          xszl_xl: {
            // 销售总量-销量
            legend: [],
            series: []
          },
          xszl_xse: {
            // 销售总量-销售额
            legend: [],
            series: []
          },
          qfsj: {
            // 签发时间
            legend: [],
            x: [],
            yLeftTitle: "",
            yRightTitle: "",
            series: []
          },
          qfsj_jd: {
            // 签发时间-季度
            legend: [],
            x: [],
            yLeftTitle: "",
            yRightTitle: "",
            series: []
          },
          qfsj_xl: {
            // 签发时间-销量
            legend: [],
            series: []
          },
          qfsj_xse: {
            // 签发时间-销售额
            legend: [],
            series: []
          },
          jplb: {
            // 检品类别
            legend: [],
            x: [],
            yLeftTitle: "",
            yRightTitle: "",
            series: []
          }
        }
      },
      api_name: "pqf",
      vuex_name: "Shengwuzhipin"
    };
  },
  computed: {
    ...mapState({
      nopms: state => state.Shengwuzhipin.nopms,
      allBase: state => state.Shengwuzhipin.allBase,
      helpInfo: state => state.Shengwuzhipin.helpInfo,
      nomal_filed: state => state.Shengwuzhipin.nomal_filed,
      advanced_filed: state => state.Shengwuzhipin.advanced_filed,
      putong: state => state.Shengwuzhipin.putong,
      baseCount: state => state.Shengwuzhipin.extendCount.listCount,
      nowNav: state => state.Shengwuzhipin.dlfx.nowNav,
      searchValYp: state => state.Shengwuzhipin.dlfx.searchValYp,
      searchValQy: state => state.Shengwuzhipin.dlfx.searchValQy,
      searchListYp: state => state.Shengwuzhipin.dlfx.searchListYp,
      searchListQy: state => state.Shengwuzhipin.dlfx.searchListQy,
      update_conf: state => state.Shengwuzhipin.update_conf
    }),
    searchDefValYp: {
      get() {
        return this.$store.state.Shengwuzhipin.dlfx.searchDefValYp;
      },
      set(val) {
        this.$store.commit("Shengwuzhipin/dlfx_searchDefValYp", val);
      }
    },
    searchDefValQy: {
      get() {
        return this.$store.state.Shengwuzhipin.dlfx.searchDefValQy;
      },
      set(val) {
        this.$store.commit("Shengwuzhipin/dlfx_searchDefValQy", val);
      }
    },
    isShowAnaly() {
      return this.$route.path == "/pqf/analy";
    }
  },
  filters: {
    // 给数字每三位数加一个逗号
    formatNumber(val) {
      val = parseInt(val);
      return val.toString().replace(/(\d)(?=(\d{3})+$)/g, "$1,");
    }
  },
  watch: {
    $route() {
      this.route = this.$route.path.split("/")[2];
    },
    // 定量分析-搜索值的改变，可以触发更新【或者点击搜索的时候】
    searchValYp(newVal, oldVal) {
      if (newVal.trim() != "") {
        this.initData();
      }
    },
    searchValQy(newVal, oldVal) {
      if (newVal.trim() != "") {
        this.initData();
      }
    },
    "ypfx.val2"(newVal, oldVal) {
      this.initData();
    },
    "qyfx.val2"(newVal, oldVal) {
      this.initData();
    }
  },
  created() {
    setTimeout(() => {
      const hashLocation = sessionStorage.getItem("hashLocation"); //缓存中获取当前页面的路由名称
      // 注意, 这里使用全路径匹配,在hash模式中,因为地址会携带#,所以页面报告中的url需要重新覆盖一下, 将#去除
      window._paq.push(["setCustomUrl", "https://" + hashLocation]); //覆盖页面报告的url，可以自定义页面url，加上本页面路由
      window._paq.push(["trackPageView", this.allBase.dbname]); //页面名称,可以自定义页面名称
      window._paq.push(["setDocumentTitle", this.allBase.dbname]);
    }, 1000);
  },
  methods: {
    clickBtn() {
      let url = null;
      let year = "";
      if (this.nowNav == "检品分析") {
        if (this.ypfx.val2 == "all") {
          url = `/api/pqf/viewoutdata?name=${this.searchValYp}`;
        } else {
          url = `/api/pqf/viewoutdata?name=${this.searchValYp}&year=${this.ypfx.val2}`;
        }
      } else if (this.nowNav == "企业分析") {
        if (this.qyfx.val2 == "all") {
          url = `/api/pqf/viewoutdata?qiye=${this.searchDefValQy}`;
        } else {
          url = `/api/pqf/viewoutdata?qiye=${this.searchDefValQy}&year=${this.qyfx.val2}`;
        }
      } else {
        return false;
      }
      this.isloading = true;
      url = url + `&accesstoken=${GETCOOKIEFUN("accesstoken")}`;

      /*使用ajax同步请求，避免回调open被拦截*/
      setTimeout(() => {
        this.isloading = false;
        window.open(url);
        // $.ajax({
        //   method: "get",
        //   dataType: "json",
        //   url: url,
        //   async: false,  //设置为同步请求
        //   success: (res) => {
        //     let data = JSON.parse(res)
        //     let total = data.data.count
        //     if (total>1000) {
        //       this.$Confirm('导出',`当前数据量为<span class="cl-red">${total}</span>条，最大导出量为<span class="cl-red">1000</span>条，是否导出？`,() => {
        //         window.open(url)
        //       })
        //     }else{
        //       window.open(url)
        //     }
        //   }
        // })
      }, 300);
    },
    navRouteTo(index) {
      if (index == 1) {
        this.$router.push({ path: "/pqf/list" });
      } else if (index == 2 && !this.nopms.ksh) {
        window.ga("send", "event", "tab", "click", "pqf_analy");
        window._paq.push(["trackEvent", "tab", "click", "pqf_analy"]);

        this.$router.push({ path: "/pqf/analy" });
      }
    },
    // info: el-tab 切换之前，隐藏的div宽高0会导致 echarts 在初始化的时候 canvas 也是0，需要在div显示之后再绘制
    chart2_3(vm) {
      this.$nextTick(() => {
        if (vm.name === "second") {
          if ($(this.$refs.qyfxChart2).children(".nodata-box").length) {
            $(this.$refs.qyfxChart3).html('<div class="nodata-box"></div>');
            $(this.$refs.qyfxChart3).removeAttr("_echarts_instance_");
          } else {
            this.drawQyfxXszlXse();
          }
        } else {
          if ($(this.$refs.qyfxChart3).children(".nodata-box").length) {
            $(this.$refs.qyfxChart2).html('<div class="nodata-box"></div>');
            $(this.$refs.qyfxChart2).removeAttr("_echarts_instance_");
          } else {
            this.drawQyfxXszlXl();
          }
        }
      });
    },
    chart3_4(vm) {
      this.$nextTick(() => {
        if (vm.name === "second") {
          if ($(this.$refs.ypfxChart3).children(".nodata-box").length) {
            $(this.$refs.ypfxChart4).html('<div class="nodata-box"></div>');
            $(this.$refs.ypfxChart4).removeAttr("_echarts_instance_");
          } else {
            this.drawYpfxGgxsXse();
          }
        } else {
          if ($(this.$refs.ypfxChart4).children(".nodata-box").length) {
            $(this.$refs.ypfxChart3).html('<div class="nodata-box"></div>');
            $(this.$refs.ypfxChart3).removeAttr("_echarts_instance_");
          } else {
            this.drawYpfxGgxsXl();
          }
        }
      });
    },
    chart6_7(vm) {
      this.$nextTick(() => {
        if (vm.name === "second") {
          if ($(this.$refs.qyfxChart6).children(".nodata-box").length) {
            $(this.$refs.qyfxChart7).html('<div class="nodata-box"></div>');
            $(this.$refs.qyfxChart7).removeAttr("_echarts_instance_");
          } else {
            this.drawQyfxQfsjXse();
          }
        } else {
          if ($(this.$refs.qyfxChart7).children(".nodata-box").length) {
            $(this.$refs.qyfxChart6).html('<div class="nodata-box"></div>');
            $(this.$refs.qyfxChart6).removeAttr("_echarts_instance_");
          } else {
            this.drawQyfxQfsjXl();
          }
        }
      });
    },
    chart7_8(vm) {
      this.$nextTick(() => {
        if (vm.name === "second") {
          if ($(this.$refs.ypfxChart7).children(".nodata-box").length) {
            $(this.$refs.ypfxChart8).html('<div class="nodata-box"></div>');
            $(this.$refs.ypfxChart8).removeAttr("_echarts_instance_");
          } else {
            this.drawYpfxQfsjXse();
          }
        } else {
          if ($(this.$refs.ypfxChart8).children(".nodata-box").length) {
            $(this.$refs.ypfxChart7).html('<div class="nodata-box"></div>');
            $(this.$refs.ypfxChart7).removeAttr("_echarts_instance_");
          } else {
            this.drawYpfxQfsjXl();
          }
        }
      });
    },
    // 关闭保存条件框（可能并没有起作用，可有可无）
    closeSavedPop() {
      this.savedPopVisible = false;
    },
    showSavedPop() {
      this.savedPopVisible = true;
    },
    showAnaly() {
      // 智能分析
      let yptop = this.$store.state.Shengwuzhipin.yptop.reverse();
      console.log(yptop);
      this.$store.commit("Shengwuzhipin/dlfx_nowNav", "检品分析");
      this.$store.commit("Shengwuzhipin/dlfx_searchValYp", yptop[0]);
      this.$store.commit(
        "Shengwuzhipin/dlfx_searchListYp",
        yptop.reduce((total, curr) => {
          return (
            total.push({
              label: curr,
              value: curr
            }) && total
          );
        }, [])
      );
    },
    //获取普通搜索
    nomalSearch() {
      Store.commit("Shengwuzhipin/conditions", []);
      //清空高级搜索条件和筛选项
      Store.commit("Shengwuzhipin/groups", {});
      if (this.route == "list") {
        Store.dispatch("Shengwuzhipin/nomalSearch");
      } else if (this.route == "analy") {
        Store.dispatch("Shengwuzhipin/getKshRes");
      }
    },
    // 点击左侧栏中的“高级搜索”触发的事件
    handleAdvancedClick() {
      if (!this.nopms.gjss) {
        this.dialogFormVisible = true;

        if (this.$refs.advanced) {
          // 第一次点击之后才渲染，所以加此判定
          this.$refs.advanced.initConditions();
        }
      }
    },
    // 关闭高级搜索框（可能并没有起作用，可有可无）
    closeAdvancedDialog() {
      this.dialogFormVisible = false;
    },
    // 高级搜索框中：点击搜索后，清空左侧普通搜索内容（仅肉眼）事件
    clearLeft() {
      this.vueClearLeft();
    },
    // 已选条件部分：点击x后，清空左侧对应的普通搜索内容（仅肉眼）事件
    clearTheLeft(option) {
      this.vueClearTheLeft(option);
    },
    // start-定量分析
    changeNowNav(name) {
      this.$store.commit("Shengwuzhipin/dlfx_nowNav", name);
      let tmp;
      switch (name) {
        case "检品分析":
          tmp = this.$store.state.Shengwuzhipin.yptop.slice();
          console.log(this.$store.state.Shengwuzhipin.yptop);
          console.log(tmp);
          if (tmp.length) {
            this.$store.commit("Shengwuzhipin/dlfx_searchValYp", tmp[0]);
            this.$store.commit(
              "Shengwuzhipin/dlfx_searchListYp",
              tmp.reduce((total, curr) => {
                return (
                  total.push({
                    label: curr,
                    value: curr
                  }) && total
                );
              }, [])
            );
            // 清空 qytop
            this.$store.commit("Shengwuzhipin/yptop", []);
          } else if (!this.searchListYp.length) {
            this.getListByYp(1, 20).then(res => {
              if (res.data.code == 200 && res.data.data.List.res.length) {
                tmp = res.data.data.List.res.reduce((total, curr) => {
                  return total.push(curr.name) && total;
                }, []);
                this.$store.commit("Shengwuzhipin/dlfx_searchValYp", tmp[0]);
                this.$store.commit(
                  "Shengwuzhipin/dlfx_searchListYp",
                  tmp.reduce((total, curr) => {
                    return (
                      total.push({
                        label: curr,
                        value: curr
                      }) && total
                    );
                  }, [])
                );
              }
            });
          }

          break;
        case "企业分析":
          tmp = this.$store.state.Shengwuzhipin.qytop.slice().reverse();
          if (tmp.length) {
            this.$store.commit("Shengwuzhipin/dlfx_searchValQy", tmp[0]);
            this.$store.commit(
              "Shengwuzhipin/dlfx_searchListQy",
              tmp.reduce((total, curr) => {
                return (
                  total.push({
                    label: curr,
                    value: curr
                  }) && total
                );
              }, [])
            );
            // 清空 qytop
            this.$store.commit("Shengwuzhipin/qytop", []);
          } else if (!this.searchListQy.length) {
            this.getListByQy(1, 20).then(res => {
              if (res.data.code == 200 && res.data.data.List.res.length) {
                tmp = res.data.data.List.res.reduce((total, curr) => {
                  return total.push(curr.qiye) && total;
                }, []);
                this.$store.commit("Shengwuzhipin/dlfx_searchValQy", tmp[0]);
                this.$store.commit(
                  "Shengwuzhipin/dlfx_searchListQy",
                  tmp.reduce((total, curr) => {
                    return (
                      total.push({
                        label: curr,
                        value: curr
                      }) && total
                    );
                  }, [])
                );
              }
            });
          }
          break;
      }
    },
    getListByYp(page, pageSize) {
      return Axios.get("/api/pqf/listbyname", {
        params: {
          page: page,
          pageSize: pageSize,
          accesstoken: GETCOOKIEFUN("accesstoken")
        }
      }).catch(err => {
        console.error(err);
      });
    },
    getListByQy(page, pageSize) {
      return Axios.get("/api/pqf/listbyqiye", {
        params: {
          page: page,
          pageSize: pageSize,
          accesstoken: GETCOOKIEFUN("accesstoken")
        }
      }).catch(err => {
        console.error(err);
      });
    },
    dialogClose() {
      this.$store.commit("Shengwuzhipin/dlfx_nowNav", "");
    },
    searchByValue1() {
      this.$store.commit("Shengwuzhipin/dlfx_searchValYp", this.searchDefValYp);
    },
    searchByValue2() {
      this.$store.commit("Shengwuzhipin/dlfx_searchValQy", this.searchDefValQy);
    },
    ypfxFetchSuggestions(strQuery, funCallback) {
      if (strQuery.trim() != "") {
        Axios.get("/api/pqf/input", {
          params: {
            name: strQuery.slice(0, this.inpMaxLen),
            accesstoken: GETCOOKIEFUN("accesstoken")
          }
        }).then(res => {
          if (res.status == 200 && res.data.data.length) {
            funCallback(
              res.data.data.reduce((total, curr) => {
                return (
                  total.push({
                    value: curr
                  }) && total
                );
              }, [])
            );
          } else {
            funCallback([]);
          }
        });
      } else {
        funCallback([]);
      }
    },
    qyfxFetchSuggestions(strQuery, funCallback) {
      if (strQuery.trim() != "") {
        Axios.get("/api/pqf/input", {
          params: {
            qiye: strQuery.slice(0, this.inpMaxLen),
            accesstoken: GETCOOKIEFUN("accesstoken")
          }
        }).then(res => {
          if (res.status == 200 && res.data.data.length) {
            funCallback(
              res.data.data.reduce((total, curr) => {
                return (
                  total.push({
                    value: curr
                  }) && total
                );
              }, [])
            );
          } else {
            funCallback([]);
          }
        });
      } else {
        funCallback([]);
      }
    },
    initData() {
      // 被调用有很多种可能：1、点击了具体某个药品或者企业  2、点击了智能分析中的定量分析 3、主动搜索
      switch (this.nowNav) {
        case "检品分析":
          this.ypfxaggs();
          if (this.ypfx.select2.length <= 1) {
            this.yearyp();
          }
          this.viewxszl().then(res => {
            if (res === 0) {
              $(this.$refs.ypfxChart1).html('<div class="nodata-box"></div>');
              $(this.$refs.ypfxChart1).removeAttr("_echarts_instance_");
            } else {
              this.drawYpfxXszl();
            }
          });
          this.viewggxszl().then(res => {
            if (res === 0) {
              $(this.$refs.ypfxChart2).html('<div class="nodata-box"></div>');
              $(this.$refs.ypfxChart2).removeAttr("_echarts_instance_");
              $(this.$refs.ypfxChart3).html('<div class="nodata-box"></div>');
              $(this.$refs.ypfxChart3).removeAttr("_echarts_instance_");
            } else {
              this.drawYpfxGgxs();
              this.drawYpfxGgxsXl();
              this.drawYpfxGgxsXse();
            }
          });
          this.viewdatexszl().then(res => {
            if (res === 0) {
              $(this.$refs.ypfxChart5).html('<div class="nodata-box"></div>');
              $(this.$refs.ypfxChart5).removeAttr("_echarts_instance_");
              $(this.$refs.ypfxChart6).html('<div class="nodata-box"></div>');
              $(this.$refs.ypfxChart6).removeAttr("_echarts_instance_");
              $(this.$refs.ypfxChart7).html('<div class="nodata-box"></div>');
              $(this.$refs.ypfxChart7).removeAttr("_echarts_instance_");
            } else {
              this.drawYpfxQfsj();
              this.drawYpfxQfsjJd();
              this.drawYpfxQfsjXl();
              this.drawYpfxQfsjXse();
            }
          });
          if (this.ypfx.val2 == "all") {
            this.viewjckxszl().then(res => {
              if (res === 0) {
                $(this.$refs.ypfxChart9).html('<div class="nodata-box"></div>');
                $(this.$refs.ypfxChart9).removeAttr("_echarts_instance_");
              } else {
                this.drawYpfxJck();
              }
            });
          }
          break;
        case "企业分析":
          this.qyaggs();
          if (this.qyfx.select2.length <= 1) {
            this.yearqy();
          }
          this.viewqyxsze().then(res => {
            if (res === 0) {
              $(this.$refs.qyfxChart1).html('<div class="nodata-box"></div>');
              $(this.$refs.qyfxChart1).removeAttr("_echarts_instance_");
              $(this.$refs.qyfxChart2).html('<div class="nodata-box"></div>');
              $(this.$refs.qyfxChart2).removeAttr("_echarts_instance_");
            } else {
              this.drawQyfxXszl();
              this.drawQyfxXszlXl();
              this.drawQyfxXszlXse();
            }
          });
          this.viewdatexszl().then(res => {
            if (res === 0) {
              $(this.$refs.qyfxChart4).html('<div class="nodata-box"></div>');
              $(this.$refs.qyfxChart4).removeAttr("_echarts_instance_");
              $(this.$refs.qyfxChart5).html('<div class="nodata-box"></div>');
              $(this.$refs.qyfxChart5).removeAttr("_echarts_instance_");
              $(this.$refs.qyfxChart6).html('<div class="nodata-box"></div>');
              $(this.$refs.qyfxChart6).removeAttr("_echarts_instance_");
            } else {
              this.drawQyfxQfsj();
              this.drawQyfxQfsjJd();
              this.drawQyfxQfsjXl();
              this.drawQyfxQfsjXse();
            }
          });
          if (this.qyfx.val2 == "all") {
            this.viewdatejplb().then(res => {
              if (res === 0) {
                $(this.$refs.qyfxChart8).html('<div class="nodata-box"></div>');
                $(this.$refs.qyfxChart8).removeAttr("_echarts_instance_");
              } else {
                this.drawQyfxJplb();
              }
            });
          }
          break;
      }
    },
    // 还是没构思好【取数据和修改数据应该分开，不应该在取数据的方法里修改外部的数据，谨记】，此处到是影响不大，但以后最好分开做。
    // *** 药品分析-聚合数据 ***
    ypfxaggs() {
      return Axios.get("/api/pqf/ypfxaggs", {
        params: this.keywordStatistics(
          {
            name: this.searchValYp,
            accesstoken: GETCOOKIEFUN("accesstoken")
          },
          { name: this.nowNav }
        )
      })
        .then(res => {
          if (res.data.code == 200 && res.data.data) {
            res = res.data.data;
            this.ypfx = Object.assign(this.ypfx, {
              jpgg: res.guige,
              scqy: res.qiye,
              qfnf: res.date,
              xsl: res.piliang,
              xsze: res.total
            });
          }
        })
        .catch(err => {
          console.error(err);
        });
    },
    // *** 药品分析-年份数据 ***
    yearyp() {
      return Axios.get("/api/pqf/yearyp", {
        params: {
          name: this.searchValYp,
          accesstoken: GETCOOKIEFUN("accesstoken")
        }
      })
        .then(res => {
          if (res.data.code == 200 && res.data.data.length) {
            this.ypfx.select2.push(
              ...res.data.data.reduce((total, curr) => {
                return (
                  total.push({
                    label: curr.dates,
                    value: curr.dates
                  }) && total
                );
              }, [])
            );
            // 年份-默认值
            this.ypfx.val2 =
              (this.ypfx.select2 && this.ypfx.select2[0].value) || "";
          }
        })
        .catch(err => {
          console.error(err);
        });
    },
    // *** 药品分析-按企业分析 ***
    viewxszl() {
      let params = {
        name: this.searchValYp,
        accesstoken: GETCOOKIEFUN("accesstoken")
      };
      if (this.ypfx.val2 != "all") {
        params.year = this.ypfx.val2;
      }
      return Axios.get("/api/pqf/viewxszl", {
        params: params
      })
        .then(res => {
          if (res.data.code == 200 && res.data.data.length) {
            let t = res.data.data.reduce(
              (total, curr) => {
                return (
                  total.x.push(curr.qiye) &&
                  total.xl.push(curr.piliang) &&
                  total.xse.push(curr.total) &&
                  total
                );
              },
              {
                x: [],
                xl: [],
                xse: []
              }
            );
            this.ypfx.chart.xszl = Object.assign(this.ypfx.chart.xszl, {
              legend: ["销量(瓶(支))", "销售额(万元)"],
              x: t.x,
              yLeftTitle: "销量(瓶(支))",
              yRightTitle: "销售额(万元)",
              series: [
                {
                  type: "bar",
                  name: "销量(瓶(支))",
                  data: t.xl
                },
                {
                  type: "line",
                  name: "销售额(万元)",
                  data: t.xse,
                  yAxisIndex: 1
                }
              ]
            });
          } else {
            return 0;
          }
        })
        .catch(err => {
          console.error(err);
        });
    },
    // *** 药品分析-按规格分析 ***
    viewggxszl() {
      let params = {
        name: this.searchValYp,
        accesstoken: GETCOOKIEFUN("accesstoken")
      };
      if (this.ypfx.val2 != "all") {
        params.year = this.ypfx.val2;
      }
      return Axios.get("/api/pqf/viewggxszl", {
        params: params
      })
        .then(res => {
          if (res.data.code == 200 && res.data.data.length) {
            let t = res.data.data.reduce(
              (total, curr) => {
                return (
                  total.x.push(curr.guige) &&
                  total.xl.push(curr.piliang) &&
                  total.xse.push(curr.total) &&
                  total
                );
              },
              {
                x: [],
                xl: [],
                xse: []
              }
            );
            this.ypfx.chart.ggxs = Object.assign(this.ypfx.chart.ggxs, {
              legend: ["销量(瓶(支))", "销售额(万元)"],
              x: t.x,
              yLeftTitle: "销量(瓶(支))",
              yRightTitle: "销售额(万元)",
              series: [
                {
                  type: "bar",
                  name: "销量(瓶(支))",
                  data: t.xl
                },
                {
                  type: "line",
                  name: "销售额(万元)",
                  data: t.xse,
                  yAxisIndex: 1
                }
              ]
            });
            this.ypfx.chart.ggxs_xl = Object.assign(this.ypfx.chart.ggxs_xl, {
              legend: t.x,
              series: [
                {
                  name: "销量",
                  type: "pie",
                  radius: "55%",
                  center: ["50%", "50%"],
                  data: t.x.reduce((total, curr, index) => {
                    return (
                      total.push({
                        value: t.xl[index],
                        name: curr
                      }) && total
                    );
                  }, []),
                  itemStyle: {
                    emphasis: {
                      shadowBlur: 10,
                      shadowOffsetX: 0,
                      shadowColor: "rgba(0, 0, 0, 0.5)"
                    }
                  }
                }
              ]
            });
            this.ypfx.chart.ggxs_xse = Object.assign(this.ypfx.chart.ggxs_xse, {
              legend: t.x,
              series: [
                {
                  name: "销售额",
                  type: "pie",
                  radius: "55%",
                  center: ["50%", "50%"],
                  data: t.x.reduce((total, curr, index) => {
                    return (
                      total.push({
                        value: t.xse[index],
                        name: curr
                      }) && total
                    );
                  }, []),
                  itemStyle: {
                    emphasis: {
                      shadowBlur: 10,
                      shadowOffsetX: 0,
                      shadowColor: "rgba(0, 0, 0, 0.5)"
                    }
                  }
                }
              ]
            });
          } else {
            return 0;
          }
        })
        .catch(err => {
          console.error(err);
        });
    },
    // *** 药品分析-国产进口分布情况 ***
    viewjckxszl() {
      let params = {
        name: this.searchValYp,
        accesstoken: GETCOOKIEFUN("accesstoken")
      };
      return Axios.get("/api/pqf/viewjckxszl", {
        params: params
      })
        .then(res => {
          if (res.data.code == 200 && res.data.data.length) {
            // 第一次循环-数据处理
            let map = new Map();
            res.data.data.forEach((curr, index) => {
              if (map.has(curr.year)) {
                map.get(curr.year).push(Object.assign({}, curr));
              } else {
                map.set(curr.year, [curr]);
              }
            });
            // 第二次循环-数据处理
            let i = 0,
              map2 = new Map(),
              x = [];
            map.forEach((val, key) => {
              x.push(key);
              val.forEach((curr, index) => {
                // 按照 categ 分类
                let a,
                  arr = curr.value.split(";");
                if (map2.has(arr[0])) {
                  a = map2.get(arr[0]);
                } else {
                  a = {
                    piliang: [],
                    total: []
                  };
                  map2.set(arr[0], a);
                }
                a.piliang[i] = arr[1];
                a.total[i] = arr[2];
              });
              i++;
            });
            // 第三次循环-series 构造
            let legend = [],
              tmpSeries = [];
            map2.forEach((val, key) => {
              legend.push(key + "销量(瓶(支))", key + "销售额(万元)");
              tmpSeries.push(
                {
                  type: "line",
                  name: key + "销售额(万元)",
                  data: val.total
                },
                {
                  type: "bar",
                  name: key + "销量(瓶(支))",
                  data: val.piliang,
                  yAxisIndex: 1
                }
              );
            });
            this.ypfx.chart.jck = Object.assign(this.ypfx.chart.jck, {
              yLeftTitle: "销售额(万元)",
              yRightTitle: "销量(瓶(支))",
              legend: legend,
              series: tmpSeries,
              x: x
            });
          } else {
            return 0;
          }
        })
        .catch(err => {
          console.error(err);
        });
    },
    // *** 药品分析-远程搜索 ***
    inputname(name) {
      return Axios.get("/api/pqf/inputname", {
        params: {
          name: name,
          accesstoken: GETCOOKIEFUN("accesstoken")
        }
      }).catch(err => {
        console.error(err);
      });
    },
    // *** 企业分析-聚合数据 ***
    qyaggs() {
      return Axios.get("/api/pqf/qyaggs", {
        params: this.keywordStatistics(
          {
            qiye: this.searchValQy,
            accesstoken: GETCOOKIEFUN("accesstoken")
          },
          { qiye: this.nowNav }
        )
      })
        .then(res => {
          if (res.data.code == 200 && res.data.data) {
            res = res.data.data;
            this.qyfx = Object.assign(this.qyfx, {
              jpsl: res.name,
              qfnf: res.date,
              xsl: res.piliang,
              xsze: res.total
            });
          }
        })
        .catch(err => {
          console.error(err);
        });
    },
    // *** 企业分析-年份数据 ***
    yearqy() {
      return Axios.get("/api/pqf/yearqy", {
        params: {
          name: this.searchValQy,
          accesstoken: GETCOOKIEFUN("accesstoken")
        }
      })
        .then(res => {
          if (res.data.code == 200 && res.data.data.length) {
            this.qyfx.select2.push(
              ...res.data.data.reduce((total, curr) => {
                return (
                  total.push({
                    label: curr.dates,
                    value: curr.dates
                  }) && total
                );
              }, [])
            );
            // 年份-默认值
            this.qyfx.val2 =
              (this.qyfx.select2 && this.qyfx.select2[0].value) || "";
          }
        })
        .catch(err => {
          console.error(err);
        });
    },
    // *** 企业分析-销售总量统计 ***
    viewqyxsze() {
      let params = {
        qiye: this.searchValQy,
        accesstoken: GETCOOKIEFUN("accesstoken")
      };
      if (this.qyfx.val2 != "all") {
        params.year = this.qyfx.val2;
      }
      return Axios.get("/api/pqf/viewqyxsze", {
        params: params
      })
        .then(res => {
          if (res.data.code == 200 && res.data.data.length) {
            let t = res.data.data.reduce(
              (total, curr) => {
                return (
                  total.x.push(curr.name) &&
                  total.xl.push(curr.piliang) &&
                  total.xse.push(curr.total) &&
                  total
                );
              },
              {
                x: [],
                xl: [],
                xse: []
              }
            );
            this.qyfx.chart.xszl = Object.assign(this.qyfx.chart.xszl, {
              legend: ["销量(瓶(支))", "销售额(万元)"],
              x: t.x,
              yLeftTitle: "销量(瓶(支))",
              yRightTitle: "销售额(万元)",
              series: [
                {
                  type: "bar",
                  name: "销量(瓶(支))",
                  data: t.xl
                },
                {
                  type: "line",
                  name: "销售额(万元)",
                  data: t.xse,
                  yAxisIndex: 1
                }
              ]
            });
            this.qyfx.chart.xszl_xl = Object.assign(this.qyfx.chart.xszl_xl, {
              legend: t.x,
              series: [
                {
                  name: "销量",
                  type: "pie",
                  radius: "55%",
                  center: ["50%", "50%"],
                  data: t.x.reduce((total, curr, index) => {
                    return (
                      total.push({
                        value: t.xl[index],
                        name: curr
                      }) && total
                    );
                  }, []),
                  itemStyle: {
                    emphasis: {
                      shadowBlur: 10,
                      shadowOffsetX: 0,
                      shadowColor: "rgba(0, 0, 0, 0.5)"
                    }
                  }
                }
              ]
            });
            this.qyfx.chart.xszl_xse = Object.assign(this.qyfx.chart.xszl_xse, {
              legend: t.x,
              series: [
                {
                  name: "销售额",
                  type: "pie",
                  radius: "55%",
                  center: ["50%", "50%"],
                  data: t.x.reduce((total, curr, index) => {
                    return (
                      total.push({
                        value: t.xse[index],
                        name: curr
                      }) && total
                    );
                  }, []),
                  itemStyle: {
                    emphasis: {
                      shadowBlur: 10,
                      shadowOffsetX: 0,
                      shadowColor: "rgba(0, 0, 0, 0.5)"
                    }
                  }
                }
              ]
            });
          } else {
            return 0;
          }
        })
        .catch(err => {
          console.error(err);
        });
    },
    // *** 企业分析-检品类别分析 ***
    viewdatejplb() {
      let params = {
        qiye: this.searchValQy,
        accesstoken: GETCOOKIEFUN("accesstoken")
      };
      return Axios.get("/api/pqf/viewdatejplb", {
        params: params
      })
        .then(res => {
          let Data = res.data;
          if (Data.code == 200 && Data.data.length) {
            // 数据按照年份升序排列
            function map2() {
              let arrs = [],
                xChange = {};
              Data.data.map(valueOne => {
                valueOne.data.sort((a, b) => {
                  return parseInt(a.year) - parseInt(b.year);
                });
                // 第一次循环-数据处理
                let map = new Map();
                valueOne.data.forEach((curr, index) => {
                  if (map.has(curr.year)) {
                    map.get(curr.year).push(curr);
                  } else {
                    map.set(curr.year, [curr]);
                  }
                });
                // 第二次循环-数据处理
                let i = 0,
                  map2 = new Map();
                map.forEach((val, key) => {
                  if (!xChange[key]) {
                    xChange[key] = key;
                    x.push(key);
                  }
                  val.forEach((curr, index) => {
                    // 按照 categ 分类
                    let a;
                    if (map2.has(curr.categ)) {
                      a = map2.get(curr.categ);
                    } else {
                      a = {
                        piliang: [],
                        total: []
                      };
                      map2.set(curr.categ, a);
                    }
                    a.piliang[i] = curr.piliang;
                    a.total[i] = curr.total;
                  });
                  i++;
                });
                arrs.push(map2);
              });
              return arrs;
            }

            // 第三次循环-series 构造
            let legend = [],
              tmpSeries = [],
              x = [];
            map2().map(map2s => {
              map2s.forEach((val, key) => {
                legend.push(key + "销量(瓶(支))", key + "销售额(万元)");
                tmpSeries.push(
                  {
                    type: "line",
                    name: key + "销售额(万元)",
                    data: val.total
                  },
                  {
                    type: "bar",
                    name: key + "销量(瓶(支))",
                    data: val.piliang,
                    yAxisIndex: 1
                  }
                );
              });
            });

            this.qyfx.chart.jplb = Object.assign(this.qyfx.chart.jplb, {
              yLeftTitle: "销售额(万元)",
              yRightTitle: "销量(瓶(支))",
              legend: legend,
              series: tmpSeries,
              x: x
            });
          } else {
            return 0;
          }
        })
        .catch(err => {
          console.error(err);
        });
    },
    // *** 企业分析-远程搜索 ***
    inputqiye(qiye) {
      return Axios.get("/api/pqf/inputqiye", {
        params: {
          qiye: qiye,
          accesstoken: GETCOOKIEFUN("accesstoken")
        }
      }).catch(err => {
        console.error(err);
      });
    },
    // ***【药品分析 && 企业分析】-签发时间分析 ***
    viewdatexszl() {
      let params;
      switch (this.nowNav) {
        case "检品分析":
          params = {
            name: this.searchValYp
          };
          if (this.ypfx.val2 != "all") {
            params.year = this.ypfx.val2;
          }
          break;
        case "企业分析":
          params = {
            qiye: this.searchValQy
          };
          if (this.qyfx.val2 != "all") {
            params.year = this.qyfx.val2;
          }
          break;
      }
      return Axios.get("/api/pqf/viewdatexszl", {
        params: _.assign(params, {
          accesstoken: GETCOOKIEFUN("accesstoken")
        })
      })
        .then(res => {
          if (res.data.code == 200 && res.data.data.length) {
            let t;
            switch (this.nowNav) {
              case "检品分析":
                if (this.ypfx.val2 == "all") {
                  t = res.data.data.reduce(
                    (total, curr) => {
                      return (
                        total.year.push(curr.year) &&
                        total.piliang.push(curr.piliang) &&
                        total.total.push(curr.total) &&
                        total
                      );
                    },
                    {
                      year: [],
                      piliang: [],
                      total: []
                    }
                  );
                  this.ypfx.chart.qfsj = Object.assign(this.ypfx.chart.qfsj, {
                    legend: ["销量(瓶(支))", "销售额(万元)"],
                    x: t.year,
                    yLeftTitle: "销量(瓶(支))",
                    yRightTitle: "销售额(万元)",
                    series: [
                      {
                        type: "bar",
                        name: "销量(瓶(支))",
                        data: t.piliang
                      },
                      {
                        type: "line",
                        name: "销售额(万元)",
                        data: t.total,
                        yAxisIndex: 1
                      }
                    ]
                  });
                } else {
                  t = res.data.data.reduce(
                    (total, curr) => {
                      return (
                        total.xl.push(curr.piliang) &&
                        total.x.push(curr.quarter + "季度") &&
                        total.xse.push(curr.total) &&
                        total
                      );
                    },
                    {
                      xl: [],
                      x: [],
                      xse: []
                    }
                  );
                  this.ypfx.chart.qfsj_jd = Object.assign(
                    this.ypfx.chart.qfsj_jd,
                    {
                      legend: ["销量(瓶(支))", "销售额(万元)"],
                      x: t.x,
                      yLeftTitle: "销量(瓶(支))",
                      yRightTitle: "销售额(万元)",
                      series: [
                        {
                          type: "bar",
                          name: "销量(瓶(支))",
                          data: t.xl
                        },
                        {
                          type: "line",
                          name: "销售额(万元)",
                          data: t.xse,
                          yAxisIndex: 1
                        }
                      ]
                    }
                  );
                  this.ypfx.chart.qfsj_xl = Object.assign(
                    this.ypfx.chart.qfsj_xl,
                    {
                      legend: t.x,
                      series: [
                        {
                          name: "销量",
                          type: "pie",
                          radius: "55%",
                          center: ["50%", "50%"],
                          data: t.x.reduce((total, curr, index) => {
                            return (
                              total.push({
                                value: t.xl[index],
                                name: curr
                              }) && total
                            );
                          }, []),
                          itemStyle: {
                            emphasis: {
                              shadowBlur: 10,
                              shadowOffsetX: 0,
                              shadowColor: "rgba(0, 0, 0, 0.5)"
                            }
                          }
                        }
                      ]
                    }
                  );
                  this.ypfx.chart.qfsj_xse = Object.assign(
                    this.ypfx.chart.qfsj_xse,
                    {
                      legend: t.x,
                      series: [
                        {
                          name: "销售额",
                          type: "pie",
                          radius: "55%",
                          center: ["50%", "50%"],
                          data: t.x.reduce((total, curr, index) => {
                            return (
                              total.push({
                                value: t.xse[index],
                                name: curr
                              }) && total
                            );
                          }, []),
                          itemStyle: {
                            emphasis: {
                              shadowBlur: 10,
                              shadowOffsetX: 0,
                              shadowColor: "rgba(0, 0, 0, 0.5)"
                            }
                          }
                        }
                      ]
                    }
                  );
                }
                break;
              case "企业分析":
                if (this.qyfx.val2 == "all") {
                  t = res.data.data.reduce(
                    (total, curr) => {
                      return (
                        total.year.push(curr.year) &&
                        total.piliang.push(curr.piliang) &&
                        total.total.push(curr.total) &&
                        total
                      );
                    },
                    {
                      year: [],
                      piliang: [],
                      total: []
                    }
                  );
                  this.qyfx.chart.qfsj = Object.assign(this.qyfx.chart.qfsj, {
                    legend: ["销量(瓶(支))", "销售额(万元)"],
                    x: t.year,
                    yLeftTitle: "销量(瓶(支))",
                    yRightTitle: "销售额(万元)",
                    series: [
                      {
                        type: "bar",
                        name: "销量(瓶(支))",
                        data: t.piliang
                      },
                      {
                        type: "line",
                        name: "销售额(万元)",
                        data: t.total,
                        yAxisIndex: 1
                      }
                    ]
                  });
                } else {
                  t = res.data.data.reduce(
                    (total, curr) => {
                      return (
                        total.xl.push(curr.piliang) &&
                        total.x.push(curr.quarter + "季度") &&
                        total.xse.push(curr.total) &&
                        total
                      );
                    },
                    {
                      xl: [],
                      x: [],
                      xse: []
                    }
                  );
                  this.qyfx.chart.qfsj_jd = Object.assign(
                    this.qyfx.chart.qfsj_jd,
                    {
                      legend: ["销量(瓶(支))", "销售额(万元)"],
                      x: t.x,
                      yLeftTitle: "销量(瓶(支))",
                      yRightTitle: "销售额(万元)",
                      series: [
                        {
                          type: "bar",
                          name: "销量(瓶(支))",
                          data: t.xl
                        },
                        {
                          type: "line",
                          name: "销售额(万元)",
                          data: t.xse,
                          yAxisIndex: 1
                        }
                      ]
                    }
                  );
                  this.qyfx.chart.qfsj_xl = Object.assign(
                    this.qyfx.chart.qfsj_xl,
                    {
                      legend: t.x,
                      series: [
                        {
                          name: "销量",
                          type: "pie",
                          radius: "55%",
                          center: ["50%", "50%"],
                          data: t.x.reduce((total, curr, index) => {
                            return (
                              total.push({
                                value: t.xl[index],
                                name: curr
                              }) && total
                            );
                          }, []),
                          itemStyle: {
                            emphasis: {
                              shadowBlur: 10,
                              shadowOffsetX: 0,
                              shadowColor: "rgba(0, 0, 0, 0.5)"
                            }
                          }
                        }
                      ]
                    }
                  );
                  this.qyfx.chart.qfsj_xse = Object.assign(
                    this.qyfx.chart.qfsj_xse,
                    {
                      legend: t.x,
                      series: [
                        {
                          name: "销售额",
                          type: "pie",
                          radius: "55%",
                          center: ["50%", "50%"],
                          data: t.x.reduce((total, curr, index) => {
                            return (
                              total.push({
                                value: t.xse[index],
                                name: curr
                              }) && total
                            );
                          }, []),
                          itemStyle: {
                            emphasis: {
                              shadowBlur: 10,
                              shadowOffsetX: 0,
                              shadowColor: "rgba(0, 0, 0, 0.5)"
                            }
                          }
                        }
                      ]
                    }
                  );
                }
                break;
            }
          } else {
            return 0;
            // 特别注意：抛出错误，在错误中统一处理，清空数据
          }
        })
        .catch(err => {
          console.error(err);
        });
    },
    // *** 图表绘制-药品分析-销售总量统计 ***
    drawYpfxXszl() {
      if (!this.$refs.ypfxChart1) {
        return;
      }
      let echart = Echarts.init(this.$refs.ypfxChart1, "yaozh_theme");
      echart.clear();
      echart.setOption({
        title: {
          text: "销售统计",
          left: "center"
        },
        tooltip: {
          trigger: "axis"
        },
        grid: {
          containLabel: true
        },
        toolbox: {
          right: 30,
          feature: {
            saveAsImage: { show: true }
          }
        },
        legend: {
          data: this.ypfx.chart.xszl.legend,
          orient: "horizontal",
          bottom: 0,
          left: "center"
          // y 值指的是相对于整幅图表的位置
          // y: 'bottom',
        },
        xAxis: [
          {
            type: "category",
            data: this.ypfx.chart.xszl.x,
            axisPointer: {
              type: "shadow"
            },
            axisLabel: {
              rotate: 45,
              formatter: function(val, index) {
                return val.length > 10 ? val.slice(0, 10) + "..." : val;
              }
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            name: this.ypfx.chart.xszl.yLeftTitle
          },
          {
            type: "value",
            name: this.ypfx.chart.xszl.yRightTitle
          }
        ],
        series: this.ypfx.chart.xszl.series
      });
    },
    // *** 图表绘制-药品分析-规格销售分析 ***
    drawYpfxGgxs() {
      if (!this.$refs.ypfxChart2) {
        return;
      }
      let echart = Echarts.init(this.$refs.ypfxChart2, "yaozh_theme");
      echart.clear();
      echart.setOption({
        title: {
          text: "销售统计",
          left: "center"
        },
        tooltip: {
          trigger: "axis"
        },
        grid: {
          containLabel: true
        },
        toolbox: {
          right: 30,
          feature: {
            saveAsImage: { show: true }
          }
        },
        legend: {
          data: this.ypfx.chart.ggxs.legend,
          orient: "horizontal",
          bottom: 0,
          left: "center"
          // y 值指的是相对于整幅图表的位置
          // y: 'bottom',
        },
        xAxis: [
          {
            type: "category",
            data: this.ypfx.chart.ggxs.x,
            axisPointer: {
              type: "shadow"
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            name: this.ypfx.chart.ggxs.yLeftTitle
          },
          {
            type: "value",
            name: this.ypfx.chart.ggxs.yRightTitle
          }
        ],
        series: this.ypfx.chart.ggxs.series
      });
    },
    // *** 图表绘制-药品分析-规格销售分析-销量 ***
    drawYpfxGgxsXl() {
      if (!this.$refs.ypfxChart3) {
        return;
      }
      $(this.$refs.ypfxChart3).removeAttr("_echarts_instance_");
      let echart = Echarts.init(this.$refs.ypfxChart3, "yaozh_theme");
      echart.clear();
      echart.setOption({
        title: {
          text: "销量占比",
          x: "center"
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        toolbox: {
          right: 30,
          feature: {
            saveAsImage: { show: true }
          }
        },
        legend: {
          type: "scroll",
          left: "center",
          bottom: 0,
          data: this.ypfx.chart.ggxs_xl.legend
        },
        series: this.ypfx.chart.ggxs_xl.series
      });
    },
    // *** 图表绘制-药品分析-规格销售分析-销售额 ***
    drawYpfxGgxsXse() {
      if (!this.$refs.ypfxChart4) {
        return;
      }
      $(this.$refs.ypfxChart4).removeAttr("_echarts_instance_");
      let echart = Echarts.init(this.$refs.ypfxChart4, "yaozh_theme");
      echart.clear();
      echart.setOption({
        title: {
          text: "销售额占比",
          x: "center"
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        toolbox: {
          right: 30,
          feature: {
            saveAsImage: { show: true }
          }
        },
        legend: {
          type: "scroll",
          left: "center",
          bottom: 0,
          data: this.ypfx.chart.ggxs_xse.legend
        },
        series: this.ypfx.chart.ggxs_xse.series
      });
    },
    // *** 图表绘制-药品分析-签发时间分析 ***
    drawYpfxQfsj() {
      if (!this.$refs.ypfxChart5) {
        return;
      }
      let echart = Echarts.init(this.$refs.ypfxChart5, "yaozh_theme");
      echart.clear();
      echart.setOption({
        title: {
          text: "销售统计(年统计)",
          left: "center"
        },
        tooltip: {
          trigger: "axis"
        },
        grid: {
          containLabel: true
        },
        toolbox: {
          right: 30,
          feature: {
            saveAsImage: { show: true }
          }
        },
        legend: {
          data: this.ypfx.chart.qfsj.legend,
          orient: "horizontal",
          bottom: 0,
          left: "center"
          // y 值指的是相对于整幅图表的位置
          // y: 'bottom',
        },
        xAxis: [
          {
            type: "category",
            data: this.ypfx.chart.qfsj.x,
            axisPointer: {
              type: "shadow"
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            name: this.ypfx.chart.qfsj.yLeftTitle
          },
          {
            type: "value",
            name: this.ypfx.chart.qfsj.yRightTitle
          }
        ],
        series: this.ypfx.chart.qfsj.series
      });
    },
    // *** 图表绘制-药品分析-签发时间分析-季度 ***
    drawYpfxQfsjJd() {
      if (!this.$refs.ypfxChart6) {
        return;
      }
      let echart = Echarts.init(this.$refs.ypfxChart6, "yaozh_theme");
      echart.clear();
      echart.setOption({
        title: {
          text: "销售统计(季度统计)",
          left: "center"
        },
        tooltip: {
          trigger: "axis"
        },
        grid: {
          containLabel: true
        },
        toolbox: {
          right: 30,
          feature: {
            saveAsImage: { show: true }
          }
        },
        legend: {
          data: this.ypfx.chart.qfsj_jd.legend,
          orient: "horizontal",
          bottom: 0,
          left: "center"
          // y 值指的是相对于整幅图表的位置
          // y: 'bottom',
        },
        xAxis: [
          {
            type: "category",
            data: this.ypfx.chart.qfsj_jd.x,
            axisPointer: {
              type: "shadow"
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            name: this.ypfx.chart.qfsj_jd.yLeftTitle
          },
          {
            type: "value",
            name: this.ypfx.chart.qfsj_jd.yRightTitle
          }
        ],
        series: this.ypfx.chart.qfsj_jd.series
      });
    },
    // *** 图表绘制-药品分析-签发时间分析-销量 ***
    drawYpfxQfsjXl() {
      if (!this.$refs.ypfxChart7) {
        return;
      }
      $(this.$refs.ypfxChart7).removeAttr("_echarts_instance_");
      let echart = Echarts.init(this.$refs.ypfxChart7, "yaozh_theme");
      echart.clear();
      echart.setOption({
        title: {
          text: "销量占比",
          x: "center"
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        toolbox: {
          right: 30,
          feature: {
            saveAsImage: { show: true }
          }
        },
        legend: {
          type: "scroll",
          left: "center",
          bottom: 0,
          data: this.ypfx.chart.qfsj_xl.legend
        },
        series: this.ypfx.chart.qfsj_xl.series
      });
    },
    // *** 图表绘制-药品分析-签发时间分析-销售额 ***
    drawYpfxQfsjXse() {
      if (!this.$refs.ypfxChart8) {
        return;
      }
      $(this.$refs.ypfxChart8).removeAttr("_echarts_instance_");
      let echart = Echarts.init(this.$refs.ypfxChart8, "yaozh_theme");
      echart.clear();
      echart.setOption({
        title: {
          text: "销售额占比",
          x: "center"
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        toolbox: {
          right: 30,
          feature: {
            saveAsImage: { show: true }
          }
        },
        legend: {
          type: "scroll",
          left: "center",
          bottom: 0,
          data: this.ypfx.chart.qfsj_xse.legend
        },
        series: this.ypfx.chart.qfsj_xse.series
      });
    },
    // *** 图表绘制-药品分析-进出口分析 ***
    drawYpfxJck() {
      if (!this.$refs.ypfxChart9) {
        return;
      }
      let echart = Echarts.init(this.$refs.ypfxChart9, "yaozh_theme");
      echart.clear();
      echart.setOption({
        title: {
          text: "销售统计",
          left: "center"
        },
        tooltip: {
          trigger: "axis"
        },
        grid: {
          containLabel: true
        },
        toolbox: {
          right: 30,
          feature: {
            saveAsImage: { show: true }
          }
        },
        legend: {
          data: this.ypfx.chart.jck.legend,
          orient: "horizontal",
          bottom: 0,
          left: "center"
          // y 值指的是相对于整幅图表的位置
          // y: 'bottom',
        },
        xAxis: [
          {
            type: "category",
            data: this.ypfx.chart.jck.x,
            axisPointer: {
              type: "shadow"
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            name: this.ypfx.chart.jck.yLeftTitle
          },
          {
            type: "value",
            name: this.ypfx.chart.jck.yRightTitle
          }
        ],
        series: this.ypfx.chart.jck.series
      });
    },
    // *** 图表绘制-企业分析-销售总量统计 ***
    drawQyfxXszl() {
      if (!this.$refs.qyfxChart1) {
        return;
      }
      let echart = Echarts.init(this.$refs.qyfxChart1, "yaozh_theme");
      echart.clear();
      echart.setOption({
        title: {
          text: "销售统计",
          left: "center"
        },
        tooltip: {
          trigger: "axis"
        },
        grid: {
          containLabel: true
        },
        toolbox: {
          right: 30,
          feature: {
            saveAsImage: { show: true }
          }
        },
        legend: {
          data: this.qyfx.chart.xszl.legend,
          orient: "horizontal",
          bottom: 0,
          left: "center"
          // y 值指的是相对于整幅图表的位置
          // y: 'bottom',
        },
        xAxis: [
          {
            type: "category",
            data: this.qyfx.chart.xszl.x,
            axisPointer: {
              type: "shadow"
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            name: this.qyfx.chart.xszl.yLeftTitle
          },
          {
            type: "value",
            name: this.qyfx.chart.xszl.yRightTitle
          }
        ],
        series: this.qyfx.chart.xszl.series
      });
    },
    // *** 图表绘制-企业分析-销售总量统计-销量 ***
    drawQyfxXszlXl() {
      if (!this.$refs.qyfxChart2) {
        return;
      }
      $(this.$refs.qyfxChart2).removeAttr("_echarts_instance_");
      let echart = Echarts.init(this.$refs.qyfxChart2, "yaozh_theme");
      echart.clear();
      echart.setOption({
        title: {
          text: "销量占比",
          x: "center"
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        toolbox: {
          right: 30,
          feature: {
            saveAsImage: { show: true }
          }
        },
        legend: {
          type: "scroll",
          left: "center",
          bottom: 0,
          data: this.qyfx.chart.xszl_xl.legend
        },
        series: this.qyfx.chart.xszl_xl.series
      });
    },
    // *** 图表绘制-企业分析-销售总量统计-销售额 ***
    drawQyfxXszlXse() {
      if (!this.$refs.qyfxChart3) {
        return;
      }
      $(this.$refs.qyfxChart3).removeAttr("_echarts_instance_");
      let echart = Echarts.init(this.$refs.qyfxChart3, "yaozh_theme");
      echart.clear();
      echart.setOption({
        title: {
          text: "销售额占比",
          x: "center"
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        toolbox: {
          right: 30,
          feature: {
            saveAsImage: { show: true }
          }
        },
        legend: {
          type: "scroll",
          left: "center",
          bottom: 0,
          data: this.qyfx.chart.xszl_xse.legend
        },
        series: this.qyfx.chart.xszl_xse.series
      });
    },
    // *** 图表绘制-企业分析-签发时间分析 ***
    drawQyfxQfsj() {
      if (!this.$refs.qyfxChart4) {
        return;
      }
      let echart = Echarts.init(this.$refs.qyfxChart4, "yaozh_theme");
      echart.clear();
      echart.setOption({
        title: {
          text: "销售统计(年统计)",
          left: "center"
        },
        tooltip: {
          trigger: "axis"
        },
        grid: {
          containLabel: true
        },
        toolbox: {
          right: 30,
          feature: {
            saveAsImage: { show: true }
          }
        },
        legend: {
          data: this.qyfx.chart.qfsj.legend,
          orient: "horizontal",
          bottom: 0,
          left: "center"
          // y 值指的是相对于整幅图表的位置
          // y: 'bottom',
        },
        xAxis: [
          {
            type: "category",
            data: this.qyfx.chart.qfsj.x,
            axisPointer: {
              type: "shadow"
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            name: this.qyfx.chart.qfsj.yLeftTitle
          },
          {
            type: "value",
            name: this.qyfx.chart.qfsj.yRightTitle
          }
        ],
        series: this.qyfx.chart.qfsj.series
      });
    },
    // *** 图表绘制-企业分析-签发时间分析-季度 ***
    drawQyfxQfsjJd() {
      if (!this.$refs.qyfxChart5) {
        return;
      }
      let echart = Echarts.init(this.$refs.qyfxChart5, "yaozh_theme");
      echart.clear();
      echart.setOption({
        title: {
          text: "销售统计(季度统计)",
          left: "center"
        },
        tooltip: {
          trigger: "axis"
        },
        grid: {
          containLabel: true
        },
        toolbox: {
          right: 30,
          feature: {
            saveAsImage: { show: true }
          }
        },
        legend: {
          data: this.qyfx.chart.qfsj_jd.legend,
          orient: "horizontal",
          bottom: 0,
          left: "center"
          // y 值指的是相对于整幅图表的位置
          // y: 'bottom',
        },
        xAxis: [
          {
            type: "category",
            data: this.qyfx.chart.qfsj_jd.x,
            axisPointer: {
              type: "shadow"
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            name: this.qyfx.chart.qfsj_jd.yLeftTitle
          },
          {
            type: "value",
            name: this.qyfx.chart.qfsj_jd.yRightTitle
          }
        ],
        series: this.qyfx.chart.qfsj_jd.series
      });
    },
    // *** 图表绘制-企业分析-签发时间分析-销量 ***
    drawQyfxQfsjXl() {
      if (!this.$refs.qyfxChart6) {
        return;
      }
      $(this.$refs.qyfxChart6).removeAttr("_echarts_instance_");
      let echart = Echarts.init(this.$refs.qyfxChart6, "yaozh_theme");
      echart.clear();
      echart.setOption({
        title: {
          text: "销量占比",
          x: "center"
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        toolbox: {
          right: 30,
          feature: {
            saveAsImage: { show: true }
          }
        },
        legend: {
          type: "scroll",
          left: "center",
          bottom: 0,
          data: this.qyfx.chart.qfsj_xl.legend
        },
        series: this.qyfx.chart.qfsj_xl.series
      });
    },
    // *** 图表绘制-企业分析-签发时间分析-销售额 ***
    drawQyfxQfsjXse() {
      if (!this.$refs.qyfxChart7) {
        return;
      }
      $(this.$refs.qyfxChart7).removeAttr("_echarts_instance_");
      let echart = Echarts.init(this.$refs.qyfxChart7, "yaozh_theme");
      echart.clear();
      echart.setOption({
        title: {
          text: "销售额占比",
          x: "center"
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        toolbox: {
          right: 30,
          feature: {
            saveAsImage: { show: true }
          }
        },
        legend: {
          type: "scroll",
          left: "center",
          bottom: 0,
          data: this.qyfx.chart.qfsj_xse.legend
        },
        series: this.qyfx.chart.qfsj_xse.series
      });
    },
    // *** 图表绘制-企业分析-签发时间分析-检品类别 ***
    drawQyfxJplb() {
      if (!this.$refs.qyfxChart8) {
        return;
      }
      let echart = Echarts.init(this.$refs.qyfxChart8, "yaozh_theme");
      echart.clear();
      echart.setOption({
        title: {
          text: "销售统计",
          left: "center"
        },
        tooltip: {
          trigger: "axis"
        },
        grid: {
          containLabel: true
        },
        toolbox: {
          right: 30,
          feature: {
            saveAsImage: { show: true }
          }
        },
        legend: {
          data: this.qyfx.chart.jplb.legend,
          orient: "horizontal",
          bottom: 0,
          left: "center"
          // y 值指的是相对于整幅图表的位置
          // y: 'bottom',
        },
        xAxis: [
          {
            type: "category",
            data: this.qyfx.chart.jplb.x,
            axisPointer: {
              type: "shadow"
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            name: this.qyfx.chart.jplb.yLeftTitle
          },
          {
            type: "value",
            name: this.qyfx.chart.jplb.yRightTitle
          }
        ],
        series: this.qyfx.chart.jplb.series
      });
    },
    // end-定量分析
    echartsResizeHandler() {
      let screen_width = window.innerWidth;
      $(".chart,.chart2,.resizeChart").width(screen_width - 440);
      this.echartsResize("resizeChart");
    }
  },
  mounted() {
    Store.dispatch("Shengwuzhipin/getBaseInfo").then(() => {
      this.vueTogglePmsTooltip();
    });
    this.vueRouteFrom("Shengwuzhipin");
    window.addEventListener("resize", this.echartsResizeHandler);
  }
};
</script>

<style lang="less">
@import "~@/assets/less/app.less";
@import "~@/assets/less/var.less";
// start-slot
// .el-table .cell{
//   padding-left: 30px;
//   overflow: hidden !important;
//   display: -webkit-box;
//   -webkit-line-clamp: 2;
//   -webkit-box-orient: vertical;
// }
.fs-page {
  .el-input__icon.el-icon-search {
    line-height: normal;
  }
  @chartHeight: 600px;
  .chart {
    padding: 0 50px 20px;
    height: @chartHeight;
  }
  .chart2 {
    box-sizing: border-box;
    width: 50%;
    height: @chartHeight;
    display: inline-block;
    float: left;
    &.chartSwitch {
      .el-tabs__nav {
        position: relative;
        left: 50%;
        margin-left: -55px;
      }
      .el-tabs__active-bar {
        height: 2px;
      }
      .switchChart {
        height: @chartHeight - 54;
      }
    }
    .el-tabs__header {
      margin: 0px 0px 10px;
    }
  }
  &.ypfx {
    .totals {
      .total-item {
        width: 20%;
      }
    }
  }
  &.qyfx {
    .totals {
      .total-item {
        width: 25%;
      }
    }
  }
  & > .head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 58px;
    padding-right: 40px;
    .title {
      font-size: 15px;
      color: @PrimaryColor;
      margin-left: 18px;
      &::before {
        content: "";
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 8px;
        background: @PrimaryColor;
        margin-right: 10px;
      }
    }
    .el-select {
      margin-right: 10px;
      height: 30px;
    }
    button {
      margin-right: 40px;
      height: 30px;
      line-height: 30px;
      border-radius: 15px;
      font-size: 12px;
      background-color: @PrimaryColor;
      color: #fff;
      border: none;
      width: 70px;
    }
  }
  .totals {
    margin: 20px 0px;
    height: 110px;
    background-color: @White;
    box-shadow: @BoxShadow;
    display: flex;
    justify-content: space-between;
    .total-item {
      display: inline-block;
      // width: 20%;
      min-width: 107px;
      height: 107px;
      text-align: center;
      vertical-align: text-bottom;
      border-bottom: 3px solid @White;
      &:hover {
        color: @PrimaryColor;
        background-color: #eff2fa;
        border-bottom: 3px solid @PrimaryColor;
      }
      .li1 {
        padding-top: 30px;
        font-size: 13px;
        font-weight: 600;
      }
      .li2 {
        font-size: 14px;
        span {
          font-size: 24px;
          color: @PrimaryColor;
        }
      }
    }
  }
  .column {
    width: 100%;
    padding: 10px 0px 20px 0px;
    .clearfix;
    .head {
      display: flex;
      justify-content: space-between;
      box-sizing: border-box;
      height: 32px;
      line-height: 32px;
      border-bottom: 1px solid #dfe5f1;
      margin-bottom: 16px;
      .title {
        display: inline-block;
        margin-left: 32px;
        height: 29px;
        line-height: 29px;
        color: @PrimaryColor;
        font-size: 14px;
        padding: 0px 10px 0px 4px;
        border-bottom: 3px solid @PrimaryColor;
      }
      .more {
        display: inline-block;
        margin-right: 25px;
        color: @PrimaryColor;
        font-size: 13px;
      }
    }
    .view {
      padding-left: 32px;
      padding-right: 28px;
    }
  }
}
// end-slot
.el-dialog {
  border-radius: 20px !important;
}
// .la-left-side{
//   .el-input__inner{
//     height: 30px;
//     line-height: 30px;
//     border-radius: 15px;
//   }
//   .la-input{
//     padding: 0px 15px;
//   }
//   .title{
//     padding: 10px 0px 4px;
//     font-size: 14px;
//     .title-right{
//       float: right;
//       color: @FontColor3;
//     }
//   }
//   .la-date{
//     padding: 0px 15px;
//     .shortcut-date{
//       font-size: @FontSizeSmall;
//       .el-radio{
//         margin-bottom: 10px;
//       }
//       .el-radio+.el-radio{
//         margin: 0px 2px 2px 0px;
//       }
//       .el-radio__label{
//         padding: 0px 2px 0px;
//         margin: 0px 5px;
//         font-size: @FontSizeSmall;
//       }
//     }
//     .date-range{
//       .el-radio__label{
//         padding-left: 4px;
//         font-size: @FontSizeSmall;
//       }
//       .el-input__inner{
//         padding: 0px 0px 0px 20px;
//       }
//       .el-date-editor.el-input, .el-date-editor.el-input__inner{
//         width: 100px;
//       }
//       .el-input__prefix{
//         left: 3px;
//       }
//       .el-input__icon{
//         width: 11px;
//         line-height: 30px;
//       }
//     }
//   }
//   .item{
//     padding-bottom: 20px;
//   }
//   .item-title{
//     display: block;
//     height: 30px;
//     padding-left: 15px;
//     line-height: 30px;
//     font-size: @FontSize;
//     background-color: @PrimaryBackgroundColor;
//   }
//   .el-dialog__header{
//     padding: 20px 0px;
//     font-size: 15px;
//     border-bottom: 1px solid @BorderColor;
//     .dialog-header{
//       padding: 0px 30px;
//     }
//   }
// }
.la-right {
  .sec1 {
    height: 60px;
    line-height: 60px;
    padding-left: 30px;
    text-align: bottom;
    .database-name {
      color: @PrimaryColor;
      font-size: 28px;
    }
    .database-num {
      font-size: 26px;
      font-weight: 900;
    }
    .sec1-right {
      float: right;
      .help-tip {
        padding-right: 10px;
        color: @FontColor;
      }
    }
  }
  .sec2 {
    .market_nav {
      .nav_one {
        width: 50%;
        .nav {
          i {
            font-size: 26px;
            margin-right: 4px;
            font-weight: normal;
          }
        }
      }
    }
    .la-body-tab {
      box-shadow: 0 -4px 5px -3px #c4d3f8;
    }
  }
}
.search-body-content {
  width: 100%;
  position: relative;
  .sh {
    position: absolute;
    right: 26px;
    top: 16px;
    cursor: pointer;
    z-index: 7;
    display: none;
  }
  .analy {
    display: inline-block;
  }
}
// el-dialog遮罩层样式（背景色）
.v-modal {
  background: rgba(102, 102, 102, 0.4);
}

@media screen and (max-width: 1600px) {
  .fs-page {
    .chart2 {
      width: 100%;
      &.chartSwitch {
        margin-top: 50px;
      }
    }
  }
}
</style>
