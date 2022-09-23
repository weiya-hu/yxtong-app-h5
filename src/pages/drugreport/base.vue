<template>
  <Main class="">
    <!-- 保存条件 - 输入名称 弹出框 -->
    <el-dialog class="dialog-saved" :visible.sync="savedPopVisible" :modal-append-to-body="false">
      <div slot="title" class="dialog-header">保存条件</div>
      <SavedPop @closeSavedPop="closeSavedPop" vuex_name="DrugReport"></SavedPop>
    </el-dialog>

    <!-- 高级搜索弹出框 -->
    <el-dialog :visible.sync="dialogFormVisible" :modal-append-to-body="false" width="815px">
      <div slot="title" class="dialog-header">高级搜索</div>

      <Advanced :dialogFormVisible="dialogFormVisible" vuex_name="DrugReport" api_name="report" route1="list"
        @closeAdvancedDialog="closeAdvancedDialog" @clearLeft="clearLeft" ref="advanced"></Advanced>
    </el-dialog>

    <div slot="left">
      <!-- 普通搜索项 -->
      <template v-for="(item, index) in vueHandleInitPutong(nomal_filed)">
        <Normal vuex_name="DrugReport" api_name="report" :item="item" :key="index" ref="ileft"></Normal>
      </template>
      <div class="special-search">
        <!-- 普通搜索按钮 & 高级搜索入口 -->
        <div class="advanced-search" style="padding-left: 0px; padding-right: 0px">
          <!-- 高级搜索 -->
          <span class="fr adva-icon">
            <em class="iconfont">&#xe67a;</em><a @click.prevent="handleAdvancedClick()"
              :class="{ 'abandon-click-method': nopms.gjss }">高级搜索</a>
            <el-tooltip class="item" effect="light" placement="right" v-if="helpInfo.high_holder">
              <div slot="content" v-html="helpInfo.high_holder"></div>
              <i class="el-icon-question cl-green"></i>
            </el-tooltip>
            <img src="/static/imgs/newProjectGuide/new.png" v-if="is_show_new" @click.prevent="handleAdvancedClick()"
              alt="高级搜索" class="new-img" />
          </span>
          <!-- 普通搜索 -->
          <el-button class="advanced-search-btn" type="primary" size="mini" round @click="nomalSearch">搜索</el-button>
        </div>
        <i class="el-icon-search"></i>
        <a @click.prevent="handleCiGuanClick()" :class="{ 'abandon-click-method': nopms.getcg }">词冠查询</a>
        <el-tooltip class="item" style="padding: 0px" effect="light" placement="right">
          <div slot="content">
            可通过词冠（干、尾）及其中文释义、英文释义进行辅助检索
          </div>
          <i class="el-icon-question cl-green"></i>
        </el-tooltip>
      </div>
      <!-- 热点筛选条件 -->
      <HotFilter vuex_name="DrugReport" route1="list" route2="analy"></HotFilter>
      <!-- 条件筛选（普通/高级搜索之后的二次筛选） -->
      <Filters vuex_name="DrugReport"></Filters>
      <!-- 保存的条件 -->
      <Saved vuex_name="DrugReport" api_name="report"></Saved>
      <!-- 历史搜索 -->
    </div>
    <div solt="content" class="la-right">
      <!-- 新手引导 -->
      <div class="new-guide" v-if="showGlobaldrugsListGuide">
        <div :style="{
          left: step1Position && step1Position.left + 'px',
          top: step1Position && step1Position.top + 'px'
        }" :class="['guide-bg', `guide-step${guideStep}`]"></div>

        <div v-if="guideStep == 0" class="guide-content0">
          <img src="/static/imgs/trz/trz_tips.png" alt="" />
          <div class="info">
            <h4>全球药物2.0内测上线</h4>
            <div class="info-footer">
              <div @click="handleNextStep">立即前往</div>
              <span @click="handleKnow">继续使用当前版本</span>
            </div>
          </div>
        </div>
      </div>
      <!-- 顶部 -->
      <section class="sec1 clearfix">
        <span class="database-name">{{ allBase.dbname }}</span>
        <!-- <span class="database-num" v-if="extendCount">{{extendCount | formatNumber}}</span> -->
        <div class="sec1-right">
          <!-- <div :class="{'top-help-wrap':update_conf.log}">

            <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item ><a href="/home">首页</a></el-breadcrumb-item>
              <el-breadcrumb-item v-if="allBase.catname">{{allBase.catname}}</el-breadcrumb-item>
              <el-breadcrumb-item><a :href="'/' + allBase.dbename">{{allBase.dbname}}</a></el-breadcrumb-item>
            </el-breadcrumb>
          </div> -->
          <div class="top-update-wrap">
            <el-tooltip class="help-tip" effect="light" placement="bottom"
              v-if="helpInfo.remark ? helpInfo.remark : ''">
              <div slot="content">
                <el-scrollbar>
                  <div class="tip-content" v-html="helpInfo.remark ? helpInfo.remark : ''"></div>
                </el-scrollbar>
                <a class="btn default" v-if="helpInfo.url" :href="helpInfo.url" target="_blank">帮助中心</a>
              </div>
              <span><i class="el-icon-warning cl-green pr5"></i>帮助</span>
            </el-tooltip>
            {{ update_conf.log }}

            <el-breadcrumb separator-class="el-icon-arrow-right" v-if="allBase.dbname">
              <el-breadcrumb-item><a href="/home">首页</a></el-breadcrumb-item>
              <el-breadcrumb-item>{{ allBase.dbname }}</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
        </div>
      </section>
      <section class="sec2">
        <div class="search-body-content">
          <Optioned @showSavedPop="showSavedPop" @clearTheLeft="clearTheLeft" @clearLeft="clearLeft"
            vuex_name="DrugReport"></Optioned>
          <i class="iconfont sh">&#xe60c;</i>
          <!-- List组件 -->
          <List></List>
        </div>
      </section>
    </div>
    <!-- 词冠查询 - 弹框 -->
    <el-dialog :visible.sync="ciguanVisible" :modal-append-to-body="false" width="882px" class="report-special-search">
      <div slot="title" class="dialog-header cgcx">词冠查询</div>
      <!-- 输入 -->
      <div class="special-inputs" v-if="!ciguanResult.length">
        <div class="special-input">
          <label>词冠（干、尾）</label>
          <el-input placeholder="如：zumab" name="ciguanganwei" v-model="ciguanParam.ciguanganwei" clearable></el-input>
        </div>
        <div class="special-input">
          <label>中文释义</label>
          <el-input placeholder="如：抗病毒" name="zwshiyi" v-model="ciguanParam.zwshiyi" clearable></el-input>
        </div>
        <div class="special-input">
          <label>英文释义</label>
          <el-input placeholder="如：antiviral" name="ywshiyi" v-model="ciguanParam.ywshiyi" clearable></el-input>
        </div>
        <div class="alert">
          <!-- 暂无结果 -->
          <div class="wrong wrong1" @click="hideWrongAlerts()">
            <span>暂无结果</span>
          </div>
        </div>
      </div>
      <!-- 结果 -->
      <div class="special-results" v-else>
        <el-checkbox-group v-model="ciguanList">
          <el-table :data="ciguanResult" height="400" style="width: 100%">
            <el-table-column prop="ciguanganwei" label="词冠（干、尾）" width="220px">
              <template slot-scope="scope">
                <el-checkbox :label="scope.row.ciguanganwei"></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column prop="zwshiyi" label="中文释义"> </el-table-column>
            <el-table-column prop="ywshiyi" label="英文释义"> </el-table-column>
          </el-table>
        </el-checkbox-group>
      </div>
      <!-- 底部操作栏目也需要跟随是输入或结果来切换 -->
      <div slot="footer" class="dialog-footer">
        <div v-if="!ciguanResult.length">
          <el-button @click="specialSearch({ opt: 1 })" type="primary" round class="dialog-query">查 询</el-button>
          <el-button @click="clearCgParam" round class="dialog-query border-color">清 空</el-button>
        </div>
        <div v-else>
          <el-button @click="specialNomalSearch" type="primary" round class="dialog-query">搜 索</el-button>
          <el-button @click="handleCgReturn" round class="dialog-query border-color">返 回</el-button>
        </div>
      </div>
    </el-dialog>
  </Main>
</template>
<script>
import Saved from "@/components/common/saved";
import SavedPop from "@/components/common/saved-pop";
import Normal from "@/components/common/normal";
import Filters from "@/components/common/filters-config";
import HotFilter from "@/components/common/hot-filter";
import Optioned from "@/components/common/options";
import Advanced from "@/components/common/advanced";
import Main from "@/components/layouts/main";
import List from "./list";
import { mapState } from "vuex";

export default {
  components: {
    Advanced,
    Saved,
    SavedPop,
    Filters,
    HotFilter,
    Normal,
    Optioned,
    Main,
    List,
  },
  data() {
    return {
      step1Position: {},
      guideStep: 0, // 新手引导步骤数
      showGlobaldrugsListGuide: false, // 控制新手引导弹窗显示隐藏
      dialogFormVisible: false, //控制高级搜索弹框
      ciguanVisible: false,
      savedPopVisible: false,
      ciguanParam: {
        ciguanganwei: "",
        zwshiyi: "",
        ywshiyi: "",
      },
      ciguanResult: [],
      ciguanList: [],
      vuex_name: "DrugReport",
      api_name: "report",
      isShowNew: false,
    };
  },
  computed: {
    ...mapState({
      nopms: (state) => state.DrugReport.nopms,
      allBase: (state) => state.DrugReport.allBase,
      helpInfo: (state) => state.DrugReport.helpInfo,
      nomal_filed: (state) => state.DrugReport.nomal_filed,
      advanced_filed: (state) => state.DrugReport.advanced_filed,
      extendCount: (state) => state.DrugReport.extendCount,
      query: (state) => state.DrugReport.query,
      putong: (state) => state.DrugReport.putong,
      update_conf: (state) => state.DrugReport.update_conf,
    }),
    // 判断高级搜索旁边的new标签是否显示
    is_show_new() {
      Store.state[this.vuex_name].advanced_filed.map((item) => {
        if (item.is_show_new === 1) {
          this.isShowNew = true;
        }
      });
      return this.isShowNew;
    },
  },
  created() {
    // Store.commit("Zhuce/reset")
    setTimeout(() => {
      // console.log(`created: ${this.allBase.dbname}`)
      const hashLocation = sessionStorage.getItem("hashLocation"); //缓存中获取当前页面的路由名称
      // 注意, 这里使用全路径匹配,在hash模式中,因为地址会携带#,所以页面报告中的url需要重新覆盖一下, 将#去除
      window._paq.push(["setCustomUrl", "https://" + hashLocation]); //覆盖页面报告的url，可以自定义页面url，加上本页面路由
      window._paq.push(["trackPageView", this.allBase.dbname]); //页面名称,可以自定义页面名称
      window._paq.push(["setDocumentTitle", this.allBase.dbname]);
    }, 1000);
  },
  mounted() {
    this.$nextTick(() => {
      let timer = setTimeout(() => {
        if (!localStorage.getItem("showGlobaldrugsListGuide")) {
          this.showGlobaldrugsListGuide = true;
          this.getGuidLeft();
        }
        clearTimeout(timer);
      }, 0);
    });
    Store.dispatch("DrugReport/getBaseInfo").then(() => {
      this.vueTogglePmsTooltip();
    });
    this.vueRouteFrom("DrugReport");
  },
  methods: {
    // 继续使用当前版本
    handleKnow() {
      window._paq.push(['trackEvent', 'button', 'click', '全球药物列表_继续使用',])

      localStorage.setItem("showGlobaldrugsListGuide", "showGlobaldrugsListGuide");
      this.showGlobaldrugsListGuide = false;
    },

    // 立即前往按钮
    handleNextStep() {
      window._paq.push(['trackEvent', 'button', 'click', '全球药物列表_立即前往',])

      localStorage.setItem("showGlobaldrugsListGuide", "showGlobaldrugsListGuide");
      this.showGlobaldrugsListGuide = false;

      const { href } = this.$router.resolve({
        path: '/globaldrugs',
        query: {
          ga_source: "vip",
          ga_name: "report_list"
        }
      })
      window.open(href, "_blank")
    },
    // 获取左边距
    getGuidLeft() {
      let id = `#step${this.guideStep}`
      if ($(id).offset()) {
        this.step1Position = $(id).offset();
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
    // 点击左侧栏中的“词冠搜索”触发的事件
    handleCiGuanClick() {
      if (!this.nopms.gjss) {
        this.ciguanVisible = true;
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
      window.ga(
        "send",
        "event",
        "botton",
        "click",
        "advanced_search",
        "search"
      );
      window._paq.push([
        "trackEvent",
        "botton",
        "click",
        "advanced_search",
        "search",
      ]);
    },
    // 关闭高级搜索框（可能并没有起作用，可有可无）
    closeAdvancedDialog() {
      this.dialogFormVisible = false;
    },
    toggleAlert(cls) {
      // 切换alert提示
      $(".alert").fadeIn();
      $(".alert")
        .find("." + cls)
        .fadeIn();
      setTimeout(() => {
        $(".alert").fadeOut();
        $(".alert")
          .find("." + cls)
          .fadeOut();
      }, 2000);
    },
    hideWrongAlerts() {
      $(".alert").hide();
    },
    // 关闭保存条件框（可能并没有起作用，可有可无）
    closeSavedPop() {
      this.savedPopVisible = false;
    },
    showSavedPop() {
      this.savedPopVisible = true;
    },
    //获取普通搜索
    nomalSearch() {
      //清空高级搜索条件和筛选项
      Store.commit("DrugReport/groups", {});
      Store.dispatch("DrugReport/nomalSearch");
    },
    // 高级搜索框中：点击搜索后，清空左侧普通搜索内容（仅肉眼）事件
    clearLeft() {
      this.vueClearLeft();
    },
    // 已选条件部分：点击x后，清空左侧对应的普通搜索内容（仅肉眼）事件
    clearTheLeft(option) {
      this.vueClearTheLeft(option);
    },
    // 词冠查询内 - 点击“查询”
    specialSearch() {
      window
        .Axios({
          method: "get",
          url: "/api/report/getcg",
          params: _.assign(this.ciguanParam, {
            accesstoken: GETCOOKIEFUN("accesstoken"),
          }),
        })
        .then((res) => {
          if (res.data.code == 200 && res.data.data) {
            let data = res.data.data;
            this.ciguanResult = data.res;
          } else {
            this.toggleAlert("wrong1");
          }
        });
    },
    // // 词冠查询内 - 点击“清空”
    clearCgParam() {
      this.ciguanParam = {
        ciguanganwei: "",
        zwshiyi: "",
        ywshiyi: "",
      };
    },
    // 词冠查询内 - 点击“搜索”
    specialNomalSearch() {
      if (this.ciguanList.length) {
        Store.commit("DrugReport/query", []);
        Store.commit("DrugReport/groups", {});
        Store.commit("DrugReport/query", {
          opt: 1,
          param: {
            name: "ename",
            label: "词冠（干、尾）",
            accurate: false,
            value: this.ciguanList.join(","),
          },
        });
      } else {
        Store.commit("DrugReport/query", []);
      }
      Store.dispatch("DrugReport/nomalSearch");
      // 词冠搜索需要清空左边已填写的内容（逻辑&视觉）
      this.clearLeft();
      this.handleCgReturn();

      this.ciguanVisible = false;
    },
    // 词冠查询内 - 点击“返回”
    handleCgReturn() {
      let len1 = this.ciguanResult.length;
      this.ciguanResult.splice(0, len1);

      let len2 = this.ciguanList.length;
      this.ciguanList.splice(0, len2);
    },
  },
  watch: {},
  filters: {
    // 给数字每三位数加一个逗号
    formatNumber(val) {
      val = parseInt(val);
      return val.toString().replace(/(\d)(?=(\d{3})+$)/g, "$1,");
    },
  },
};
</script>
<style lang="less">
@import "~@/assets/less/var.less";

.special-search {
  padding: 10px 14px 10px 10px;
  font-size: 14px;

  .normal-search-btn {
    display: inline-block;
    padding: 5px 0px;
    width: 100%;
    box-sizing: border-box;
    margin-bottom: 10px;
    border-radius: 4px;
  }
}

// .la-left-side{
//   width: 250px;
//   .title{
//     padding: 10px 0px 4px;
//     font-size: 14px;
//     .title-label{

//     }
//     .title-right{
//       float: right;
//       color: @FontColor3;
//     }
//   }

//   .special-search{
//     padding: 20px 15px;
//     font-size: 14px;
//     .normal-search-btn{
//       display: inline-block;
//       padding: 5px 0px;
//       width: 100%;
//       box-sizing: border-box;
//       margin-bottom: 10px;
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
//     background-color: #F7F8FC;

//   }
//   .special-results{
//     .el-checkbox-group{
//       .el-table td{
//       }
//     }
//   }
//   .saved-options,.search-history{
//     .options{
//       cursor: pointer;
//       padding: 10px 15px;
//     }
//     .option{
//       position: relative;
//       display: inline-block;
//       width: 180px;
//       padding: 5px 20px 5px 0px;
//       font-size: 12px;
//       overflow: hidden;
//       text-overflow: ellipsis;
//       white-space: nowrap;
//       .el-icon-delete{
//         position: absolute;
//         right: 0px;
//       }
//     }
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
.report-special-search {
  .el-dialog__header {
    border-bottom: 1px solid @BorderColor;

    .cgcx {
      font-size: 14px !important;
    }
  }

  .special-inputs {
    position: relative;

    .special-input {
      padding: 10px 50px;

      label {
        display: inline-block;
        width: 100px;
      }

      .el-input {
        width: 400px;

        input {
          border-radius: 0px;
        }
      }
    }

    .alert {
      z-index: 9999;
      display: none;
      width: 175px;
      height: 105px;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-top: -52.5px;
      margin-left: -87.5px;

      .right {
        position: relative;
        width: 175px;
        height: 105px;
        background: url("/static/imgs/usercenter/alert/right.png") no-repeat;

        span {
          position: absolute;
          bottom: 22px;
          left: 0px;
          width: 100%;
          text-align: center;
          color: #fff;
          font-size: 14px;
          font-weight: bold;
        }
      }

      .wrong {
        position: relative;
        width: 175px;
        height: 105px;
        background: url("/static/imgs/usercenter/alert/wrong.png") no-repeat;

        span {
          position: absolute;
          bottom: 22px;
          left: 0px;
          width: 100%;
          text-align: center;
          color: #fff;
          font-size: 14px;
          font-weight: bold;
        }
      }

      div {
        display: none;
      }
    }
  }

  .special-result {}

  .dialog-footer {
    padding: 30px 50px;
    height: 30px;

    .dialog-query {
      float: left;
      width: 146px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      padding: 0;
    }
  }
}

.la-right {

  // 新手引导样式
  .new-guide {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 9999;
    min-width: 1280px;
    // background: rgba(0, 0, 0, 0.3)

    .fadeInUp {
      -webkit-animation-name: fadeInUp;
      animation-name: fadeInUp;
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        -webkit-transform: translate3d(0, 45%, 0);
        transform: translate3d(0, 45%, 0);
      }

      to {
        opacity: 1;
        -webkit-transform: none;
        transform: none;
      }
    }

    .guide-bg {
      box-shadow: 0 0 0 10000px rgba(0, 0, 0, 0.7);
      border-radius: 4px;
      position: absolute;
    }

    .guide-step0 {
      width: 460px;
      height: 200px;
      padding: 40px;
      box-sizing: border-box;
      background: #ffffff;
      border-radius: 4px;
      position: fixed;
      top: 50% !important;
      left: 50% !important;
      transform: translate(-50%, -50%);
      margin-left: 0 !important;
    }

    .guide-content0 {
      display: flex;
      align-items: center;
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);

      img {
        width: 88px;
        height: 112px;
        margin-right: 30px;
      }

      .info {
        h4 {
          font-size: 20px;
          font-weight: 600;
          color: #182462;
          margin-bottom: 10px;
          line-height: 20px;
        }

        p {
          font-size: 16px;
          line-height: 16px;
          color: #666666;
          margin-bottom: 20px;
        }

        &-footer {
          display: flex;
          align-items: center;

          div {
            width: 100px;
            height: 36px;
            line-height: 36px;
            text-align: center;
            background: #3556b9;
            border-radius: 4px;
            font-size: 16px;
            color: #ffffff;
            margin-right: 20px;
            cursor: pointer;
          }

          span {
            font-size: 14px;
            color: #666666;
            cursor: pointer;
          }
        }
      }
    }

    .guide-step1 {
      width: 645px;
      height: 40px;
    }
  }

  .sec1 {
    height: 60px;
    line-height: 60px;
    text-align: bottom;
    padding-left: 30px;

    .database-name {
      // padding-left: 50px;
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
      }
    }
  }

  .sec2 {
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
    }
  }
}

.new-img {
  position: absolute;
  top: 0;
  cursor: pointer;
}
</style>
