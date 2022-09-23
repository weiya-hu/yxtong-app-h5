<template>
  <Main class="zhuce" >
    <!-- 保存条件 - 输入名称 弹出框 -->
    <el-dialog class="dialog-saved" :visible.sync="savedPopVisible" :modal-append-to-body="false">
      <div slot="title" class="dialog-header">
        保存条件
      </div>
      <SavedPop @closeSavedPop="closeSavedPop" vuex_name="Yaopinxiaoshou"></SavedPop>
    </el-dialog>

    <!-- 高级搜索弹出框 -->
    <el-dialog :visible.sync="dialogFormVisible" :modal-append-to-body="false" width="815px">
      <div slot="title" class="dialog-header">
        高级搜索
      </div>
      <Advanced
        :dialogFormVisible="dialogFormVisible"
        vuex_name="Yaopinxiaoshou"
        api_name="ypxs"
        route1="list"
        route2="analy"
        @closeAdvancedDialog="closeAdvancedDialog"
        @clearLeft="clearLeft"
        ref="advanced"></Advanced>
    </el-dialog>

    <!-- 左边部分 -->
    <div slot="left">
      <!-- 普通搜索项 -->
      <template v-for="(item, index) in vueHandleInitPutong(nomal_filed)">
        <Normal
          vuex_name="Yaopinxiaoshou"
          api_name="ypxs"
          :item="item"
          :key="index"
          route1="list"
          route2="analy"
          ref="ileft"></Normal>
      </template>
      <!-- 普通搜索按钮 & 高级搜索入口 -->
      <div class="advanced-search">
        <!-- 高级搜索 -->
        <span class="fr adva-icon">
          <em class="iconfont">&#xe67a;</em><a @click.prevent="handleAdvancedClick()" :class="{'abandon-click-method': nopms.gjss}">高级搜索</a>
          <el-tooltip class="item" effect="light" placement="right" v-if="helpInfo.high_holder">
            <div slot="content" v-html="helpInfo.high_holder"></div>
            <i class="el-icon-question cl-green"></i>
          </el-tooltip>
        </span>
        <!-- 普通搜索 -->
        <el-button class="advanced-search-btn" type="primary" size="mini" round @click="nomalSearch">搜索</el-button>
      </div>
      <!-- 条件筛选（普通/高级搜索之后的二次筛选） -->
      <Filters vuex_name="Yaopinxiaoshou" route1="list" route2="analy"></Filters>
      <!-- 保存的条件 -->
      <Saved vuex_name="Yaopinxiaoshou" api_name="ypxs"></Saved>
      <!-- 历史搜索 -->
    </div>

    <!-- 右边部分 -->
    <div class="la-right">
      <!-- 顶部 -->
      <section class="sec1 clearfix">
        <span class="database-name">{{allBase.dbname}}</span>
        <!-- <span class="database-num" v-if="listCount&&$route.path.split('/')[2]==='list'">{{listCount | formatNumber}}</span> -->
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
            <el-tooltip class="help-tip" effect="light" placement="bottom"  v-if="helpInfo.remark ? helpInfo.remark : ''" >
              <div slot="content">
                <el-scrollbar>
                  <div class="tip-content" v-html="helpInfo.remark ? helpInfo.remark : ''"></div>
                </el-scrollbar>
                <a class="btn default" v-if="helpInfo.url" :href="helpInfo.url" target="_blank">帮助中心</a>
              </div>
              <span><i class="el-icon-warning cl-green pr5"></i>帮助</span>
            </el-tooltip>
            {{update_conf.log}}
          </div>
        </div>
      </section>
      <section class="sec2">
        <!-- <div class="la-body-tab">
          <div class="market_nav">
            <a @click.prevent="navRouteTo(1)" class="nav_one" :class="{'router-link-active': $route.path == '/ypxs/list'}">
              <span class="nav"><i class="iconfont pr5" style="font-size:20px;">&#xe627;</i>销售数据</span>
            </a>
            <a @click.prevent="navRouteTo(2)" class="nav_one" :class="{'router-link-active': $route.path == '/ypxs/analy', 'abandon-click-method': nopms.ksh}">
              <span class="nav"><i class="iconfont pr5" style="font-size:20px;">&#xe643;</i>智能分析</span>
            </a>
          </div>
        </div> -->
        <div class="search-body-content">
          <Optioned
            @showSavedPop="showSavedPop"
            @clearLeft="clearLeft"
            @clearTheLeft="clearTheLeft"
            vuex_name="Yaopinxiaoshou"
            dbname="ypxs"
            route1="list"
            route2="analy">
            <div class="analy fr">
              <span v-show="isShowAnaly">
                <i-wave />
                更多统计，试试<a href="javascript:void(0);" class="cl-blue" @click="getFullScreen">精准分析</a>吧
              </span>
            </div>
          </Optioned>
          <i class="iconfont sh">&#xe60c;</i>
          <!-- &#xe67f; -->
          <keep-alive>
            <router-view></router-view>
          </keep-alive>
        </div>
      </section>
    </div>
    <!-- 全屏效果 -->
    <FullScreen :navs="['药品分析', '企业分析']" :nowNav="nowNav" @close="checkItClose" v-show="nowNav" @changeNowNav="changeNowNav" :titles="'全球畅销药品销售精准分析'">
      <!--
      ①药品分析
      -->
      <div class="fs-page ypfx" slot="药品分析">
        <div class="head">
          <div class="title">{{yp_jh.Name}}</div>
          <div style="margin-left:auto">
            <selectNuit v-model="nuityp" gaKey="yaopinfenxi" title="货币单位" analy />
          </div>
          <div>
            <inputPopover :value="value11">
              <el-autocomplete
                v-model="value11"
                clearable
                :fetch-suggestions="ypfxFetchSuggestions"
                @select="searchByValue11"
                :popper-append-to-body="false"
                suffix-icon="el-icon-search"
              >
                <template slot-scope="{ item }">
                  <div style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;" :title="item.value">{{ item.value }}</div>
                </template>
              </el-autocomplete>
            </inputPopover>
            <!-- <button @click="searchByValue11()">搜索</button> -->
          </div>
        </div>
        <div class="totals" :class="{'totals-less': !yp_jh.Tbyear}">
          <ul class="total-item">
            <li class="li1">商品品种</li>
            <li class="li2"><span>{{yp_jh.Sp | formatNumber}}</span>个</li>
          </ul>
          <ul class="total-item">
            <li class="li1">生产企业</li>
            <li class="li2"><span>{{yp_jh.Qy | formatNumber}}</span>个</li>
          </ul>
          <ul class="total-item">
            <li class="li1">治疗领域</li>
            <li class="li2"><span>{{yp_jh.Zlly | formatNumber}}</span>个</li>
          </ul>
          <ul class="total-item">
            <li class="li1">销售总额（最新年份）</li>
            <li class="li2"><span>{{echartsTooltipMoney(ypxsNuitChange(nuityp,yp_jh.Year))}}</span>{{nuitValueyp}}元</li>
          </ul>
          <ul class="total-item" v-if="yp_jh.Tbyear">
            <li class="li1">销售同比（最新年份）</li>
            <li class="li2"><span>{{Math.floor(yp_jh.Tbyear * 10000) / 100}}%</span></li>
          </ul>
        </div>
        <!-- 销售数据统计 -->
        <div class="column">
          <!-- HEAD -->
          <div class="head">
            <span class="title">销售数据统计</span>
          </div>
          <!-- VIEW -->
          <div class="view xssjtj">
            <el-select v-model="value12" @change="clickSelect12()">
              <el-option label="生产企业（全部）" value=""></el-option>
              <el-option
                v-for="item in yp_selects2"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
            <div class="out-echarts-title" v-if="yp_jh.Name">{{yp_jh.Name + " - " + (value12 ? value12 : "全部企业") + " - 总体销售分析"}}</div>
            <div id="ec-yp-xstj" class="echarts"></div>
            <div class="nodata-box" style="display: none;"></div>
          </div>
        </div>
        <!-- 年度销售分析 -->
        <div class="column">
          <!-- HEAD -->
          <div class="head">
            <span class="title">年度销售分析</span>
          </div>
          <!-- VIEW -->
          <div class="view ndxsfx">
            <el-select v-model="value13" @change="clickSelect13()">
              <el-option label="全部年份" value="0"></el-option>
              <el-option
                v-for="item in yp_selects3"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
            <div class="out-echarts-title" v-if="yp_jh.Name">{{yp_jh.Name + " - " + (value13 != 0 ? value13 + "年" : "全部年份") + " - 销售分析"}}</div>
            <div id="ec-yp-ndfx" class="echarts"></div>
            <div class="nodata-box" style="display: none;"></div>
          </div>
        </div>
      </div>
      <!--
      ②企业分析
      -->
      <div class="fs-page qyfx" slot="企业分析">
        <div class="head">
          <div class="title">{{qy_jh.Name}}</div>
          <div style="margin-left:auto">
            <selectNuit v-model="nuitqy" gaKey="qiyefenxi" title="货币单位" analy />
          </div>
          <div>
            <inputPopover :value="value21">
              <el-autocomplete
                v-model="value21"
                clearable
                :fetch-suggestions="qyfxFetchSuggestions"
                @select="searchByValue21"
                :popper-append-to-body="false"
                suffix-icon="el-icon-search"
              >
                <template slot-scope="{ item }">
                  <div style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;" :title="item.value">{{ item.value }}</div>
                </template>
              </el-autocomplete>
            </inputPopover>
          </div>
        </div>
        <div class="totals" :class="{'totals-less': !qy_jh.Tbyear}">
          <ul class="total-item">
            <li class="li1">商品品种</li>
            <li class="li2"><span>{{qy_jh.Sp | formatNumber}}</span>个</li>
          </ul>
          <ul class="total-item">
            <li class="li1">治疗领域</li>
            <li class="li2"><span>{{qy_jh.Zlly | formatNumber}}</span>个</li>
          </ul>
          <ul class="total-item">
            <li class="li1">销售总额（最新年份）</li>
            <li class="li2"><span>{{echartsTooltipMoney(ypxsNuitChange(nuitqy,qy_jh.Year))}}</span>{{nuitValueqy}}元</li>
          </ul>
          <ul class="total-item" v-if="qy_jh.Tbyear">
            <li class="li1">销售同比（最新年份）</li>
            <li class="li2"><span>{{Math.floor(qy_jh.Tbyear * 10000) / 100}}%</span></li>
          </ul>
        </div>
        <!-- 销售数据统计 -->
        <div class="column">
          <!-- HEAD -->
          <div class="head">
            <span class="title">销售数据统计</span>
          </div>
          <!-- VIEW -->
          <div class="view xssjtj">
            <el-select v-model="value22" @change="clickSelect22()">
              <el-option label="品种名称（全部）" value=""></el-option>
              <el-option
                v-for="item in qy_selects2"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
            <div class="out-echarts-title" v-if="qy_jh.Name">{{qy_jh.Name + " - " + (value22 ? value22 + " - " : "全部品种 - 总体") + "销售分析"}}</div>
            <div id="ec-qy-xstj" class="echarts"></div>
            <div class="nodata-box" style="display: none;"></div>
          </div>
        </div>
        <!-- 年度销售分析 -->
        <div class="column">
          <!-- HEAD -->
          <div class="head">
            <span class="title">年度销售分析</span>
          </div>
          <!-- VIEW -->
          <div class="view ndxsfx">
            <el-select v-model="value23" @change="clickSelect23()">
              <el-option label="全部年份" value="0"></el-option>
              <el-option
                v-for="item in qy_selects3"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
            <div class="out-echarts-title" v-if="qy_jh.Name">{{qy_jh.Name + " - " + (value23 != 0 ? value23+"年" : "全部年份") + " - 销售分析"}}</div>
            <div id="ec-qy-ndfx" class="echarts"></div>
            <div class="nodata-box" style="display: none;"></div>
          </div>
        </div>
      </div>
    </FullScreen>
  </Main>
</template>

<script>
import Saved from '@/components/common/saved'
import SavedPop from '@/components/common/saved-pop'
import Optioned from "@/components/common/options"
import Normal from "@/components/common/normal"
import Advanced from "@/components/common/advanced"
import Filters from "@/components/common/filters-config"
import Main from "@/components/layouts/main"
import FullScreen from "@/components/common/full-screen"
import selectNuit from './selectNuit'
import { mapState } from "vuex"
import IWave from '@/components/common/icon-wave'
import inputPopover from '@/components/inputs/input-popover'

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
    selectNuit,
    inputPopover
  },
  data() {
    return {
      nuityp: '1',
      nuitqy: '1',
      // 暂时存放 - v-model - start
      value11: "",
      value12: "",
      value13: "",
      value21: "",
      value22: "",
      value23: "",
      // 暂时存放 - v-model - end
      savedPopVisible: false,
      dialogFormVisible: false, //控制高级搜索弹框
      route: this.$route.path.split("/")[2],
      // ①定量分析 - 药品分析
      yp_jh: {},
      // yp_selects1: [],
      // yp_selects2: [],
      // yp_selects3: [],
      yp_xstj: {},
      ec_yp_xstj: {
        echarts: null,
        legend_data: [],
        xAxis_data: [],
        yAxis_data: [],
        series_data: []
      },
      yp_ndfx: {},
      ec_yp_ndfx: {
        echarts: null,
        xAxis_data: [],
        series_data: []
      },
      // ②定量分析 - 企业分析
      qy_jh: {},
      // qy_selects1: [],
      // qy_selects2: [],
      // qy_selects3: [],
      qy_xstj: {},
      ec_qy_xstj: {
        echarts: null,
        legend_data: [],
        xAxis_data: [],
        yAxis_data: [],
        series_data: []
      },
      qy_ndfx: {},
      ec_qy_ndfx: {
        echarts: null,
        xAxis_data: [],
        series_data: []
      },
      api_name: 'ypxs',
      vuex_name: 'Yaopinxiaoshou'
    }
  },
  created() {
    // this.axiosYpAll()
    // this.axiosQyAll()
    setTimeout(() => {
      const hashLocation= sessionStorage.getItem("hashLocation");//缓存中获取当前页面的路由名称
      // 注意, 这里使用全路径匹配,在hash模式中,因为地址会携带#,所以页面报告中的url需要重新覆盖一下, 将#去除
      window._paq.push(['setCustomUrl', "https://" + hashLocation]);//覆盖页面报告的url，可以自定义页面url，加上本页面路由
      window._paq.push(['trackPageView', this.allBase.dbname]);//页面名称,可以自定义页面名称
      window._paq.push(['setDocumentTitle', this.allBase.dbname])
    }, 1000);
  },
  mounted() {
    Store.commit("Yaopinxiaoshou/nowNav", "")
    Store.dispatch("Yaopinxiaoshou/getBaseInfo").then(() => {
      this.vueTogglePmsTooltip()
    })

    this.vueRouteFrom("Yaopinxiaoshou")
    window.addEventListener('resize', this.echartsResizeHandler);
  },
  computed: {
    ...mapState({
      nopms: state => state.Yaopinxiaoshou.nopms,
      allBase: state => state.Yaopinxiaoshou.allBase,
      helpInfo: state => state.Yaopinxiaoshou.helpInfo,
      yp_selects1: state => state.Yaopinxiaoshou.yp_selects1,
      yp_selects2: state => state.Yaopinxiaoshou.yp_selects2,
      yp_selects3: state => state.Yaopinxiaoshou.yp_selects3,
      qy_selects1: state => state.Yaopinxiaoshou.qy_selects1,
      qy_selects2: state => state.Yaopinxiaoshou.qy_selects2,
      qy_selects3: state => state.Yaopinxiaoshou.qy_selects3,
      default_fenxi_yp_name: state => state.Yaopinxiaoshou.default_fenxi_yp_name,
      default_fenxi_qy_name: state => state.Yaopinxiaoshou.default_fenxi_qy_name,
      fenxi_yp_name: state => state.Yaopinxiaoshou.fenxi_yp_name,
      fenxi_qy_name: state => state.Yaopinxiaoshou.fenxi_qy_name,
      nowNav: state => state.Yaopinxiaoshou.nowNav,
      nomal_filed: state => state.Yaopinxiaoshou.nomal_filed,
      putong: state => state.Yaopinxiaoshou.putong,
      listCount: state => state.Yaopinxiaoshou.extendCount.listCount,
      update_conf: state => state.Yaopinxiaoshou.update_conf,
    }),
    isShowAnaly () {
      return this.route == 'analy'
    },
    nuitValueyp(){
      let value = ''
      switch(this.nuityp){
        case '1':
          value = '万'
          break;
        case '100':
          value = '百万'
          break;
        case '1000':
          value = '千万'
          break;
        case '10000':
          value = '亿'
          break;
      }
      return value
    },
    nuitValueqy(){
      let value = ''
      switch(this.nuitqy){
        case '1':
          value = '万'
          break;
        case '100':
          value = '百万'
          break;
        case '1000':
          value = '千万'
          break;
        case '10000':
          value = '亿'
          break;
      }
      return value
    }
  },
  filters: {
    // 给数字每三位数加一个逗号
    formatNumber(val) {
      val = parseInt(val);
      return val||val===0?val.toString().replace(/(\d)(?=(\d{3})+$)/g, "$1,"):'';
    }
  },
  watch: {
    nuityp() {
      this.drawYpXstj()
      this.drawYpNdfx()
    },
    nuitqy() {
      this.drawQyXstj()
      this.drawQyNdfx()
    },
    $route() {
      this.route = this.$route.path.split("/")[2];
    },
    nowNav(to, from) {
      if (from !== "" && to === "药品分析") {
        // Store.commit("Yaopinxiaoshou/yp_selects1", [])
        // this.value11 = ''
        // Store.commit("Yaopinxiaoshou/fenxi_yp_name", this.default_fenxi_yp_name)
        this.axiosYpAll()
      } else if (from !== "" && to === "企业分析") {
        // Store.commit("Yaopinxiaoshou/qy_selects1", [])
        // this.value21 = ''
        // Store.commit("Yaopinxiaoshou/fenxi_qy_name", this.default_fenxi_qy_name)
        this.axiosQyAll()
      } else {
        return
      }
    },
    // value12() {
    //   this.axiosYpXstj()
    // },
    // value13() {
    //   this.axiosYpNdfx()
    // },
    // value22() {
    //   this.axiosQyXstj()
    // },
    // value23() {
    //   this.axiosQyNdfx()
    // },
    fenxi_yp_name(to, from) {
      Store.commit("Yaopinxiaoshou/yp_selects2", [])
      Store.commit("Yaopinxiaoshou/yp_selects3", [])
      if (this.nowNav === '药品分析') {
        this.value12 = ""
        // this.value13 = ""
      } else {
        Store.commit("Yaopinxiaoshou/yp_selects1", [])
        this.value11 = ""
        this.value12 = ""
        // this.value13 = ""
      }
      this.axiosYpAll()
    },
    fenxi_qy_name(to, from) {
      Store.commit("Yaopinxiaoshou/qy_selects2", [])
      Store.commit("Yaopinxiaoshou/qy_selects3", [])
      if (this.nowNav === '企业分析') {
        this.value22 = ""
        // this.value23 = ""
      } else {
        Store.commit("Yaopinxiaoshou/qy_selects1", [])
        this.value21 = ""
        this.value22 = ""
        // this.value23 = ""
      }
      this.axiosQyAll()
    },
  },
  methods: {
    navRouteTo (index) {
      if (index == 1) {
        this.$router.push({ path: '/ypxs/list'})
      } else if (index == 2 && !this.nopms.ksh) {
        window.ga("send","event", "tab", "click", "ypxs_analy");
        window._paq.push(['trackEvent', 'tab',"click", 'ypxs_analy', ])

        this.$router.push({ path: '/ypxs/analy'})
      }
    },
    // url param 参数过滤，如果值为空就不要这个参数，传入 obj
    paramDelNull (obj) {
      return Object.keys(obj).reduce((total, curr) => {
        if (obj[curr] && (obj[curr]+'').trim() != '') {
          total[curr] = obj[curr];
        }
        return total
      }, {})
    },
    clickSelect12 () {
      this.axiosYpXstj()
    },
    clickSelect13 () {
      this.axiosYpNdfx()
    },
    clickSelect22 () {
      this.axiosQyXstj()
    },
    clickSelect23 () {
      this.axiosQyNdfx()
    },
    // 关闭保存条件框（可能并没有起作用，可有可无）
    closeSavedPop () {
      this.savedPopVisible = false
    },
    showSavedPop () {
      this.savedPopVisible = true
    },
    getFullScreen () {
      Store.commit("Yaopinxiaoshou/nowNav", "药品分析")
      // Store.commit("Yaopinxiaoshou/fenxi_yp_name", "(carbidopa;levodopa;entacapone)/entacapone")
      // Store.commit("Yaopinxiaoshou/fenxi_qy_name", "ABBOTT LABORATORIES(雅培)")
      this.analyDlfx()
    },
    analyDlfx() {
      this.axiosYpAll()
    },
    changeNowNav(name) {
      Store.commit("Yaopinxiaoshou/nowNav", name)
    },
    searchByValue11() {
      const zancun1 = this.value11
      const zancun2 = this.yp_selects1
      const zancun3 = this.yp_selects2
      const zancun4 = this.yp_selects3
      // 通过value11来搜索
      Store.commit("Yaopinxiaoshou/fenxi_yp_name", this.value11)
      this.value11 = zancun1
      Store.commit("Yaopinxiaoshou/yp_selects1", zancun2)
      Store.commit("Yaopinxiaoshou/yp_selects2", zancun3)
      Store.commit("Yaopinxiaoshou/yp_selects3", zancun4)
      // this.axiosYpAll()
    },
    searchByValue21() {
      const zancun1 = this.value21
      const zancun2 = this.qy_selects1
      const zancun3 = this.qy_selects2
      const zancun4 = this.qy_selects3
      // 通过value21来搜索
      Store.commit("Yaopinxiaoshou/fenxi_qy_name", this.value21)
      this.value21 = zancun1
      Store.commit("Yaopinxiaoshou/qy_selects1", zancun2)
      Store.commit("Yaopinxiaoshou/qy_selects2", zancun3)
      Store.commit("Yaopinxiaoshou/qy_selects3", zancun4)
      // this.axiosQyAll()
    },
    // 定量分析
    // ①定量分析 - 药品分析
    // 定量分析 - 药品分析 - 搜索建议
    ypfxFetchSuggestions(strQuery, funCallback){
      if (strQuery.trim() != '') {
        Axios.get('/api/ypxs/input', {
          params: {
            name: strQuery.slice(0,this.inpMaxLen),
            accesstoken: GETCOOKIEFUN("accesstoken")
          }
        }).then((res) => {
          if (res.status == 200 && res.data.data.length) {
            funCallback(res.data.data.reduce((total, curr) => {
              return total.push({
                value: curr,
              }) && total;
            }, []))
          } else {
            funCallback([]);
          }
        })
      } else {
        funCallback([]);
      }
    },
    // 定量分析 - 药品分析 - 归总
    axiosYpAll() {
      this.axiosYpJh().then(() => {
        this.axiosYpXstj()
        this.axiosYpNdfx()
      })
    },
    // 定量分析 - 药品分析 - 集合部分
    axiosYpJh() {
      return window.Axios({
        method: "get",
        url: "/api/ypxs/getdlfx",
        params: _.assign(this.paramDelNull(
          this.fenxi_yp_name ? this.keywordStatistics({
            name: this.fenxi_yp_name,
          },{name: this.nowNav}) : {}
        ), {
          accesstoken: GETCOOKIEFUN("accesstoken")
        })
      }).then(res => {
        if (res.data.code === 200 && res.data) {
          let data = res.data.data
          this.yp_jh = data
          // if (this.yp_selects1.length === 0) {
            Store.commit("Yaopinxiaoshou/yp_selects1", data.Select ? data.Select : [])
            this.value11 = this.yp_selects1[0]
          // }
          // if (this.yp_selects2.length === 0) {
            Store.commit("Yaopinxiaoshou/yp_selects2", data.name_Select ? data.name_Select : [])
            // this.value12 = this.yp_selects2[0] //销售数据统计默认全部
          // }
          // if (this.yp_selects3.length === 0) {
            Store.commit("Yaopinxiaoshou/yp_selects3", data.year_Select ? data.year_Select : [])
            this.value13 = this.yp_selects3[0]
          // }



        }
      })
      .catch(err => {
        console.log(err);
      });
    },
    // 定量分析 - 药品分析 - 销售统计(包含ECHARTS绘制前的数据处理)
    axiosYpXstj() {
      // 先复原
      if (this.ec_yp_xstj.echarts) {
        this.ec_yp_xstj.echarts.dispose()
      }
      this.ec_yp_xstj = {
        echarts: null,
        legend_data: [],
        xAxis_data: [],
        yAxis_data: [],
        series_data: []
      }
      // 获取数据
      window.Axios({
        method: "get",
        url: "/api/ypxs/getxstj",
        params: _.assign(this.paramDelNull(
          this.value12 ?
          (this.fenxi_yp_name ? {name: this.fenxi_yp_name, company: this.value12} : {company: this.value12})
          : (this.fenxi_yp_name ? {name: this.fenxi_yp_name} : {})
        ), {
          accesstoken: GETCOOKIEFUN("accesstoken")
        }),
      }).then(res => {
          $('.xssjtj').children('.nodata-box').hide()
        if (res.data.code === 200 && res.data) {
          let data = res.data.data
          this.yp_xstj = data

          // ECHARTS数据处理
          let the_list = this.yp_xstj.List ? this.yp_xstj.List : []
          let one_ins = [] // 存放legend
          for (let i = 0; i < the_list.length; i++) { // 每一个i为一年
            this.ec_yp_xstj.xAxis_data.push(the_list[i].year)

            let item_data = the_list[i].data ? the_list[i].data : ""
            if (item_data) {
              let arr = item_data.split('ღ')
              for (let j = 0; j < arr.length; j++) {
                let one_name = arr[j].split(':')[0]
                let one_other = arr[j].split(':')[1]
                let one_num = one_other.split('-')[0]
                let one_company = one_other.split('-')[1]
                let one_in = one_name + '(' + one_company+ ')'
                if (_.indexOf(one_ins, one_in) === -1) { // 禁止重复
                  one_ins.push(one_in)
                }
              }
            }
          }

          let all_nums = []
          for (let k = 0; k < one_ins.length; k++) {
            all_nums.push([])
            for (let l = 0; l < the_list.length; l++) {
              all_nums[k].push(0)
            }
          }
          for (let m = 0; m < the_list.length; m++) { // 每一个i为一年
            let item_data = the_list[m].data ? the_list[m].data : ""
            let arr = item_data.split('ღ')
            if (item_data) {
              for (let n = 0; n < arr.length; n++) {
                let one_name = arr[n].split(':')[0]
                let one_other = arr[n].split(':')[1]
                let one_num = one_other.split('-')[0]
                let one_company = one_other.split('-')[1]
                let one_in = one_name + '(' + one_company+ ')'
                let index = _.indexOf(one_ins, one_in)
                if (index !== -1) {
                  all_nums[index][m] = one_num
                }
              }
            }
          }

          for (let o = 0; o < one_ins.length; o++) {
            let obj = {
              name: one_ins[o],
              type: "bar",
              stack: "总量",
              label: {
                normal: {
                  show: false
                }
              },
              data: all_nums[o]
            }
            this.ec_yp_xstj.series_data.push(obj)
          }
          this.ec_yp_xstj.legend_data = one_ins

          // 计算同比
          let tb_all = []
          let year_all = []
          for (let p = 0; p < the_list.length; p++) {
            let year_one = 0
            for (let q = 0; q < one_ins.length; q++) {
              year_one += Number(all_nums[q][p]?all_nums[q][p]:0)
            }
            year_all.push(year_one)
          }

          for (let r = 0; r < the_list.length; r++) {
            if (r > 0) {
              if (year_all[r] === 0 || year_all[r - 1] === 0) {
                tb_all.push(null)
              } else {
                let tb_floor = (year_all[r] - year_all[r - 1]) / year_all[r - 1]
                let tb = Math.floor(tb_floor * 10000) /100
                tb_all.push(tb)
              }
            } else {
              tb_all.push(null)
            }
          }
          this.ec_yp_xstj.yAxis_data = tb_all
          this.ec_yp_xstj.series_data.push({
            name: '同比（%）',
            type: 'line',
            yAxisIndex: 1,
            data: this.ec_yp_xstj.yAxis_data
          })

          this.drawYpXstj()
        }else{
          $('.xssjtj').children('.nodata-box').show()
        }
      }).catch(err => {
        console.log(err);
      })
    },
    // 定量分析 - 药品分析 - 销售统计 - 绘制ECHARTS
    drawYpXstj() {
      let series_data = _.map(this.ec_yp_xstj.series_data,(item)=>{
        return {
          name:item.name,
          type:item.type,
          stack:item.stack,
          label:item.label,
          yAxisIndex:item.yAxisIndex,
          data:_.map(item.data,(items) => {
            return item.type === "line" ? items : this.ypxsNuitChange(this.nuityp,items)
          })
        }
      })
      this.ec_yp_xstj.echarts = Echarts.init(document.getElementById("ec-yp-xstj"), 'yaozh_theme');
      this.ec_yp_xstj.echarts.setOption({
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          },
          formatter:(params,ticket)=>{
            //实现设计图上的提示样式
            let str = params[0].name+'<br>'
            _.map(params,item=>{
              if (item.seriesType=="bar") {
                str = str + ((item.value) ? '<span style="display: inline-block;height: 6px;width: 6px;border-radius: 50%;margin-right:5px; background-color:'+item.color+'"></span>'+ item.seriesName + ": "+this.echartsTooltipMoney(item.value)+'<br>' : '')
              }else if(item.seriesType=="line" && item.value){
                str = str + ((item.value) ? '<span style="display: inline-block;height: 6px;width: 6px;border-radius: 50%;margin-right:5px; background-color:'+item.color+'"></span>'+ item.seriesName + "："+item.value+'<br>' : '')
              }
            })
            return str
          },
        },
        legend: {
          show: false,
          type: "scroll",
          data: this.ec_yp_xstj.legend_data
        },
        grid: {
          containLabel: true
        },
        yAxis: [
          {
            type: 'value',
            name: `销售额（${this.nuitValueyp}元/RMB）`,
            axisLabel: {
              formatter: (value) => {
                return (value / 1000) + 'k'
              },
            },
            splitLine: {show: false}, // 去除网格线
          },
          {
            type: 'value',
            name: '同比（%）',
            axisLabel: {
              formatter: '{value}%'
            },
            splitLine:{show: false},//去除网格线
          }
        ],
        xAxis: {
          // name: "销售年份",
          // nameLocation: "center",
          // nameGap: 30,
          type: "category",
          data: this.ec_yp_xstj.xAxis_data,
        },
        series: series_data,
      });
    },
    // 定量分析 - 药品分析 - 年度分析(包含ECHARTS绘制前的数据处理)
    axiosYpNdfx() {
      // 先复原
      if (this.ec_yp_ndfx.echarts) {
        this.ec_yp_ndfx.echarts.dispose()
      }
      this.ec_yp_ndfx = {
        echarts: null,
        xAxis_data: [],
        series_data: []
      }
      // 获取数据
      window.Axios({
        method: "get",
        url: "/api/ypxs/getndfx",
        params: _.assign(this.paramDelNull(
          this.fenxi_yp_name ? {name: this.fenxi_yp_name, year: this.value13} : {year: this.value13}
        ), {
          accesstoken: GETCOOKIEFUN("accesstoken")
        }),
      }).then(res => {
        $('.ndxsfx').children('.nodata-box').hide()
        if (res.data.code === 200 && res.data) {
          let data = res.data.data
          this.yp_ndfx = data

          // ECHARTS数据处理
          let the_list = this.yp_ndfx.List ? this.yp_ndfx.List : []
          let one_ins = []
          let one_nums = []
          for (let i = 0; i < the_list.length; i++) {
            one_ins.push(the_list[i].company)
            one_nums.push(the_list[i].num)
          }

          this.ec_yp_ndfx.xAxis_data = one_ins
          this.ec_yp_ndfx.series_data = one_nums

          this.drawYpNdfx()
        }else{
          $('.ndxsfx').children('.nodata-box').show()
        }
      }).catch(err => {
        console.log(err);
      })
    },
    // 定量分析 - 药品分析 - 年度分析 - 绘制ECHARTS
    drawYpNdfx() {
      let series_data = _.map(this.ec_yp_ndfx.series_data,(item)=>{
        return this.ypxsNuitChange(this.nuityp,item)
      })
      this.ec_yp_ndfx.echarts = Echarts.init(document.getElementById("ec-yp-ndfx"), 'yaozh_theme');
      this.ec_yp_ndfx.echarts.setOption({
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          },
          formatter:(params,ticket)=>{
            let data = params[0]
            return `${data.name}<br />销售额: ${this.echartsTooltipMoney(data.value)}（${this.nuitValueyp}元）`
          },
        },
        grid: {
          containLabel: true
        },
        yAxis: [
          {
            type: 'value',
            name: `销售额（${this.nuitValueyp}元/RMB）`,
            axisLabel: {
              formatter: (value) => {
                return (value / 1000) + 'k'
              },
            },
          }
        ],
        xAxis: {
          // name: "商品名称",
          // nameLocation: "center",
          // nameGap: 30,
          type: "category",
          axisLabel: {
            interval: 0,
            rotate: 45,
            formatter: function(value) {
              if (value.length > 12) {
                return value.substring(0, 12) + "...";
              } else {
                return value;
              }
            },
          },
          data: this.ec_yp_ndfx.xAxis_data,
        },
        dataZoom: this.ec_yp_ndfx.xAxis_data.length > 10 ? [
            {
                type: 'slider',
                show: true,
                xAxisIndex: [0],
                startValue: 0,
                endValue: 9
            }
        ] : null,
        series: [
          {
            type: "bar",
            stack: "总量",
            label: {
              show: true,
              position: "top",
              formatter: (value) => {
                if (parseInt(value.value).toString().length >= 4) {
                  return this.echartsTooltipMoney(parseInt(value.value / 1000)) + "k"
                } else {
                  return this.echartsTooltipMoney(value.value)
                }
              },
            },
            data: series_data,
          }
        ],
      });
    },
    // ②定量分析 - 企业分析
    // 定量分析 - 企业分析 - 搜索建议
    qyfxFetchSuggestions(strQuery, funCallback){
      if (strQuery.trim() != '') {
        Axios.get('/api/ypxs/input', {
          params: {
            company: strQuery.slice(0,this.inpMaxLen),
            accesstoken: GETCOOKIEFUN("accesstoken")
          }
        }).then((res) => {
          if (res.status == 200 && res.data.data.length) {
            funCallback(res.data.data.reduce((total, curr) => {
              return total.push({
                value: curr,
              }) && total;
            }, []))
          } else {
            funCallback([]);
          }
        })
      } else {
        funCallback([]);
      }
    },
    // 定量分析 - 企业分析 - 归总
    axiosQyAll() {
      this.axiosQyJh().then(() => {
        this.axiosQyXstj()
        this.axiosQyNdfx()
      })
    },
    // 定量分析 - 企业分析 - 集合部分
    axiosQyJh() {
      return window.Axios({
        method: "get",
        url: "/api/ypxs/getqydlfx",
        params: _.assign(this.paramDelNull(
          this.fenxi_qy_name ? this.keywordStatistics({
            company: this.fenxi_qy_name
          },{company:this.nowNav}) : {}
        ), {
          accesstoken: GETCOOKIEFUN("accesstoken")
        }),
      }).then(res => {
        if (res.data.code === 200 && res.data) {
          let data = res.data.data
          this.qy_jh = data
          if (this.qy_selects1.length === 0) {
            Store.commit("Yaopinxiaoshou/qy_selects1", data.Select)
            this.value21 = this.qy_selects1[0]
          }
          // if (this.qy_selects2.length === 0) {
            Store.commit("Yaopinxiaoshou/qy_selects2", data.name_Select)
          //   this.value22 = this.qy_selects2[0] // 销售数据统计默认全部
          // }
          // if (this.qy_selects3.length === 0) {
            Store.commit("Yaopinxiaoshou/qy_selects3", data.year_Select)
            this.value23 = this.qy_selects3[0]
          // }
        }
      })
      .catch(err => {
        console.log(err);
      })
    },
    // 定量分析 - 企业分析 - 销售统计(包含ECHARTS绘制前的数据处理)
    axiosQyXstj() {
      // 先复原
      if (this.ec_qy_xstj.echarts) {
        this.ec_qy_xstj.echarts.dispose()
      }
      this.ec_qy_xstj = {
        echarts: null,
        legend_data: [],
        xAxis_data: [],
        yAxis_data: [],
        series_data: []
      }
      // 获取数据
      window.Axios({
        method: "get",
        url: "/api/ypxs/getqyxstj",
        params: _.assign(this.paramDelNull(
          this.value22 ?
          (this.fenxi_qy_name ? {company: this.fenxi_qy_name, name: this.value22} : {name: this.value22})
          : (this.fenxi_qy_name ? {company: this.fenxi_qy_name} : {})
        ), {
          accesstoken: GETCOOKIEFUN("accesstoken")
        }),
      }).then(res => {
          $('.xssjtj').children('.nodata-box').hide()
        if (res.data.code === 200 && res.data) {
          let data = res.data.data
          this.qy_xstj = data

          // ECHARTS数据处理
          let the_list = this.qy_xstj.List ? this.qy_xstj.List : []
          let one_ins = [] // 存放legend
          for (let i = 0; i < the_list.length; i++) { // 每一个i为一年
            this.ec_qy_xstj.xAxis_data.push(the_list[i].year)

            let item_data = the_list[i].data ? the_list[i].data : ""
            if (item_data) {
              let arr = item_data.split('ღ')
              for (let j = 0; j < arr.length; j++) {
                let one_in = arr[j].split(':')[0]
                let one_num = arr[j].split(':')[1]
                if (_.indexOf(one_ins, one_in) === -1) { // 禁止重复
                  one_ins.push(one_in)
                }
              }
            }
          }

          let all_nums = []
          for (let k = 0; k < one_ins.length; k++) {
            all_nums.push([])
            for (let l = 0; l < the_list.length; l++) {
              all_nums[k].push(0)
            }
          }
          for (let m = 0; m < the_list.length; m++) { // 每一个i为一年
            let item_data = the_list[m].data ? the_list[m].data : ""
            let arr = item_data.split('ღ')
            if (item_data) {
              for (let n = 0; n < arr.length; n++) {
                let one_in = arr[n].split(':')[0]
                let one_num = arr[n].split(':')[1]
                let index = _.indexOf(one_ins, one_in)
                if (index !== -1) {
                  all_nums[index][m] = one_num
                }
              }
            }
          }

          for (let o = 0; o < one_ins.length; o++) {
            let obj = {
              name: one_ins[o],
              type: "bar",
              stack: "总量",
              label: {
                normal: {
                  show: false
                }
              },
              data: all_nums[o]
            }
            this.ec_qy_xstj.series_data.push(obj)
          }
          this.ec_qy_xstj.legend_data = one_ins

          // 计算同比
          let tb_all = []
          let year_all = []
          for (let p = 0; p < the_list.length; p++) {
            let year_one = 0
            for (let q = 0; q < one_ins.length; q++) {
              year_one += Number(all_nums[q][p] ? all_nums[q][p] : 0)
            }
            year_all.push(year_one)
          }

          for (let r = 0; r < the_list.length; r++) {
            if (r > 0) {
              if (year_all[r] === 0 || year_all[r - 1] === 0) {
                tb_all.push(null)
              } else {
                let tb_floor = (year_all[r] - year_all[r - 1]) / year_all[r - 1]
                let tb = Math.floor(tb_floor * 10000) /100
                tb_all.push(tb)
              }
            } else {
              tb_all.push(null)
            }
          }
          this.ec_qy_xstj.yAxis_data = tb_all
          this.ec_qy_xstj.series_data.push({
            name: '同比（%）',
            type: 'line',
            yAxisIndex: 1,
            data: this.ec_qy_xstj.yAxis_data
          })

          this.drawQyXstj()
        }else{
          $('.xssjtj').children('.nodata-box').show()
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 定量分析 - 企业分析 - 销售统计 - 绘制ECHARTS
    drawQyXstj() {
      let series_data = _.map(this.ec_qy_xstj.series_data,(item)=>{
        return {
          name:item.name,
          type:item.type,
          stack:item.stack,
          label:item.label,
          yAxisIndex:item.yAxisIndex,
          data:_.map(item.data,(items) => {
            return item.type === "line" ? items : this.ypxsNuitChange(this.nuitqy,items)
          })
        }
      })
      this.ec_qy_xstj.echarts = Echarts.init(document.getElementById("ec-qy-xstj"), 'yaozh_theme');
      this.ec_qy_xstj.echarts.setOption({
        tooltip: {
          position: function(pos, params, dom, rect, size) {
            // 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧。
            var obj = { top: 20 };
            obj[["left", "right"][+(pos[0] < size.viewSize[0] / 2)]] = 5;
            return obj;
          },
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          },
          formatter:(params,ticket)=>{
            //实现设计图上的提示样式
            let str = params[0].name+'<br>'
            _.map(params,item=>{
              if (item.seriesType=="bar") {
                str = str + ((item.value) ? '<span style="display: inline-block;height: 6px;width: 6px;border-radius: 50%;margin-right:5px; background-color:'+item.color+'"></span>'+ item.seriesName + ": "+this.echartsTooltipMoney(item.value)+'<br>'  : '')
              }else if(item.seriesType=="line" && item.value){
                str = str + ((item.value) ? '<span style="display: inline-block;height: 6px;width: 6px;border-radius: 50%;margin-right:5px; background-color:'+item.color+'"></span>'+ item.seriesName + "："+item.value+'<br>' : '')
              }
            })
            return str
          },
        },
        legend: {
          show: false,
          type: "scroll",
          data: this.ec_qy_xstj.legend_data
        },
        grid: {
          containLabel: true
        },
        yAxis: [
          {
            type: 'value',
            name: `销售额（${this.nuitValueqy}元/RMB）`,
            axisLabel: {
              formatter: (value) => {
                return (value / 1000) + 'k'
              },
            },
            splitLine: {show: false}, // 去除网格线
          },
          {
            type: 'value',
            name: '同比（%）',
            axisLabel: {
              formatter: '{value}%'
            },
            splitLine:{show: false},//去除网格线
          }
        ],
        xAxis: {
          // name: "销售年份",
          // nameLocation: "center",
          // nameGap: 30,
          type: "category",
          data: this.ec_qy_xstj.xAxis_data,
        },
        series: series_data,
      });
    },
    // 定量分析 - 企业分析 - 年度分析(包含ECHARTS绘制前的数据处理)
    axiosQyNdfx() {
      // 先复原
      if (this.ec_qy_ndfx.echarts) {
        this.ec_qy_ndfx.echarts.dispose()
      }
      this.ec_qy_ndfx = {
        echarts: null,
        xAxis_data: [],
        series_data: []
      }
      // 获取数据
      window.Axios({
        method: "get",
        url: "/api/ypxs/getqyndfx",
        params: _.assign(this.paramDelNull(
          this.fenxi_qy_name ? {company: this.fenxi_qy_name, year: this.value23} : {year: this.value23}
        ), {
          accesstoken: GETCOOKIEFUN("accesstoken")
        }),
      }).then(res => {
          $('.ndxsfx').children('.nodata-box').hide()
        if (res.data.code === 200 && res.data) {
          let data = res.data.data
          this.qy_ndfx = data

          // ECHARTS数据处理
          let the_list = this.qy_ndfx.List ? this.qy_ndfx.List : []
          let one_ins = []
          let one_nums = []
          for (let i = 0; i < the_list.length; i++) {
            one_ins.push(the_list[i].brandname)
            one_nums.push(the_list[i].num)
          }

          this.ec_qy_ndfx.xAxis_data = one_ins
          this.ec_qy_ndfx.series_data = one_nums

          this.drawQyNdfx()
        }else{
          $('.ndxsfx').children('.nodata-box').show()
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 定量分析 - 企业分析 - 年度分析 - 绘制ECHARTS
    drawQyNdfx() {
      let series_data = _.map(this.ec_qy_ndfx.series_data,(item)=>{
        return this.ypxsNuitChange(this.nuitqy,item)
      })
      this.ec_qy_ndfx.echarts = Echarts.init(document.getElementById("ec-qy-ndfx"), 'yaozh_theme');
      this.ec_qy_ndfx.echarts.setOption({
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          },
          formatter:(params)=>{
            let data = params[0]
            return `${data.name}<br />销售额: ${this.echartsTooltipMoney(data.value)}（${this.nuitValueqy}元）`
          },
        },
        grid: {
          containLabel: true
        },
        yAxis: [
          {
            type: 'value',
            name: `销售额（${this.nuitValueqy}元/RMB）`,
            axisLabel: {
              formatter: (value) => {
                return (value / 1000) + 'k'
              },
            },
          }
        ],
        xAxis: {
          // name: "企业名称",
          // nameLocation: "center",
          // nameGap: 30,
          type: "category",
          axisLabel: {
            interval: 0,
            rotate: 45,
            formatter: function(value) {
              if (value.length > 12) {
                return value.substring(0, 12) + "...";
              } else {
                return value;
              }
            },
          },
          data: this.ec_qy_ndfx.xAxis_data,
        },
        dataZoom:  this.ec_qy_ndfx.xAxis_data.length > 10 ?[
            {
                type: 'slider',
                show: true,
                xAxisIndex: [0],
                startValue: 0,
                endValue: 9
            }
        ] : null,
        series: [
          {
            type: "bar",
            stack: "总量",
            label: {
              show: true,
              position: "top",
              formatter:(value) => {
                if (parseInt(value.value).toString().length >= 4) {
                  return this.echartsTooltipMoney(parseInt(value.value / 1000)) + "k"
                } else {
                  return this.echartsTooltipMoney(value.value)
                }
              },
            },
            data: series_data,
          }
        ],
      });
    },
    // ALL - 定量分析 - 全屏显示关闭/隐藏
    checkItClose() {
      // 响应full-screen.vue组件中的$emit("close")及此组件中的@close="checkItClose"
      Store.commit("Yaopinxiaoshou/nowNav", "")
    },
    //获取普通搜索
    nomalSearch() {
      Store.commit("Yaopinxiaoshou/conditions", [])
      //清空高级搜索条件和筛选项
      Store.commit("Yaopinxiaoshou/groups", {})
      if (this.route == "list") {
        Store.dispatch("Yaopinxiaoshou/nomalSearch")
      } else if (this.route == "analy") {
        Store.dispatch("Yaopinxiaoshou/getKshRes")
      }
    },
    // 点击左侧栏中的“高级搜索”触发的事件
    handleAdvancedClick() {
      if (!this.nopms.gjss) {
        this.dialogFormVisible = true;
        if (this.$refs.advanced) {
          // 第一次点击之后才渲染，所以加此判定
          this.$refs.advanced.initConditions()
        }
      }
    },
    // 关闭高级搜索框（可能并没有起作用，可有可无）
    closeAdvancedDialog() {
      this.dialogFormVisible = false;
    },
    // 高级搜索框中：点击搜索后，清空左侧普通搜索内容（仅肉眼）事件
      clearLeft () {
        this.vueClearLeft()
      },
      // 已选条件部分：点击x后，清空左侧对应的普通搜索内容（仅肉眼）事件
      clearTheLeft (option) {
        this.vueClearTheLeft(option)
      },
      echartsResizeHandler() {
        let screen_width = window.innerWidth;
        $(".fs-dialog .echarts").width(screen_width - 440);
      }
  }
}
</script>

<style lang="less">
@import "~@/assets/less/app.less";
@import "~@/assets/less/var.less";
// slot
.fs-page {
  .el-input__icon.el-icon-search {
    line-height: normal;
  }
  &.ypfx {
    .totals {
      .total-item {
        width: 20%;
      }
      &.totals-less {
        .total-item {
          width: 25%!important;
        }
      }
    }
  }
  &.qyfx {
    .totals {
      .total-item {
        width: 25%;
      }
      &.totals-less {
        .total-item {
          width: 33.3%!important;
        }
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
      .out-echarts-title {
        text-align: center;
        font-size: 16px;
        font-weight: bold;
      }
    }
  }
}
.xssjtj,
.ndxsfx{
  position: relative;
  .nodata-box{
    position: absolute;
    bottom: 0;
    left: 0;
    background-color: #FFF;
    height: calc(100% - 30px);
  }
}
// ECHARTS - 宽高
// 药品分析 - 销售数据统计
#ec-yp-xstj {
  box-sizing: border-box;
  padding: 0px 50px;
  width: 100%;
  height: 600px;
}
// 企业分析 - 年度销售分析
#ec-qy-ndfx {
  box-sizing: border-box;
  padding: 0px 50px;
  width: 100%;
  height: 600px;
}
#ec-qy-xstj {
  box-sizing: border-box;
  padding: 0px 50px;
  width: 100%;
  height: 600px;
}
// 企业分析 - 年度销售分析
#ec-yp-ndfx {
  box-sizing: border-box;
  padding: 0px 50px;
  width: 100%;
  height: 600px;
}
.el-dialog {
  border-radius: 20px !important;
}
// .la-left-side {
//   .el-input__inner {
//     height: 30px;
//     line-height: 30px;
//     border-radius: 15px;
//   }
//   .la-input {
//     padding: 0px 15px;
//   }
//   .title {
//     padding: 10px 0px 4px;
//     font-size: 14px;
//     .title-right {
//       float: right;
//       color: @FontColor3;
//     }
//   }
//   .la-date {
//     padding: 0px 15px;
//     .shortcut-date {
//       font-size: @FontSizeSmall;
//       .el-radio {
//         margin-bottom: 10px;
//       }
//       .el-radio + .el-radio {
//         margin: 0px 2px 2px 0px;
//       }
//       .el-radio__label {
//         padding: 0px 2px 0px;
//         margin: 0px 5px;
//         font-size: @FontSizeSmall;
//       }
//     }
//     .date-range {
//       .el-radio__label {
//         padding-left: 4px;
//         font-size: @FontSizeSmall;
//       }
//       .el-input__inner {
//         padding: 0px 0px 0px 20px;
//       }
//       .el-date-editor.el-input,
//       .el-date-editor.el-input__inner {
//         width: 100px;
//       }
//       .el-input__prefix {
//         left: 3px;
//       }
//       .el-input__icon {
//         width: 11px;
//         line-height: 30px;
//       }
//     }
//   }
//   .item {
//     padding-bottom: 20px;
//   }
//   .item-title {
//     display: block;
//     height: 30px;
//     padding-left: 15px;
//     line-height: 30px;
//     font-size: @FontSize;
//     background-color: @PrimaryBackgroundColor;
//   }
//   .el-dialog__header {
//     padding: 20px 0px;
//     font-size: 15px;
//     border-bottom: 1px solid @BorderColor;
//     .dialog-header {
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
    .la-body-tab{
          box-shadow:0 -4px 5px -3px #c4d3f8;
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
  background: rgba(102,102,102, .4);
}
</style>
