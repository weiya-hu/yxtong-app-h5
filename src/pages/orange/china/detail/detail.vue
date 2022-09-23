<template>
  <div class="wrapper" ref="wrapper">
    <!-- 自定义加载界面 -->
    <LoadingGif :loadFlag="isLoading" v-if="isLoading"></LoadingGif>
    <!-- 加载完成显示部分 -->
    <div class="detail-list" v-else>
      <div class="detail-header header-fixed">
        <div class="header-left">
          <div class="left-top">
            <span class="top-id" :title="detail_title.name">{{
              detail_title.name
            }}</span>
            <span class="top-name">{{ detail_title.cname }}</span>
            <span class="id-green">{{ detail_title.jixing }}</span>
          </div>
        </div>
      </div>
      <div class="main">
        <div
          class="left-nav"
          :style="{ top: (showPromtNotice ? 128 : 98) + 'px' }"
        >
          <div class="nav-list nav-event" @click="handleNavClick">
            <a class="nav-item active">基本信息</a>
            <a class="nav-item" v-if="detail_b.length">BCS分类（美国）</a>
            <a class="nav-item" v-if="detail_c.length">BCS分类（WHO）</a>
            <a class="nav-item" v-if="detail_d.length">NMPA公布参比制剂</a>
            <a class="nav-item" v-if="detail_e.length">药智推荐参比</a>
            <a class="nav-item" v-if="detail_f.length">参比制剂备案信息</a>
            <a class="nav-item" v-if="extendList.length">扩展信息</a>
          </div>
        </div>
        <div class="right-list">
          <slide-section :title="'基本信息'" class="the-part">
            <div class="tb-wrap">
              <table class="tb-t">
                <tr>
                  <td>规格</td>
                  <td>{{ detail_a.guige }}</td>
                </tr>
                <tr>
                  <td>本剂型原研</td>
                  <td>{{ detail_a.originalc }}</td>
                </tr>
                <tr>
                  <td>活性成分（英语）</td>
                  <td>{{ detail_a.ename }}</td>
                </tr>
                <tr>
                  <td>美国参比</td>
                  <td>{{ detail_a.rldf }}</td>
                </tr>
                <tr>
                  <td>日本参比</td>
                  <td>{{ detail_a.rldj }}</td>
                </tr>
                <tr>
                  <td>一致性评价复核机构</td>
                  <td>{{ detail_a.remarks }}</td>
                </tr>
                <tr>
                  <td>BE豁免或简化</td>
                  <td>{{ detail_a.exempt }}</td>
                </tr>
                <tr>
                  <td>简述</td>
                  <td>{{ detail_a.agency }}</td>
                </tr>
              </table>
            </div>
          </slide-section>

          <slide-section
            :title="'BCS分类（美国）'"
            class="the-part"
            v-if="this.detail_b.length"
          >
            <div class="tb-wrap">
              <el-table :data="detail_b" stripe fixed>
                <el-table-column
                  v-for="(item, index) in detailTableHead1"
                  :key="index"
                  :prop="item.prop"
                  :min-width="item.width"
                  :label="item.label"
                >
                  <template slot-scope="scope">
                    <span v-html="scope.row[item.prop]"></span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </slide-section>

          <slide-section
            :title="'BCS分类（WHO）'"
            class="the-part"
            v-if="this.detail_c.length"
          >
            <div class="tb-wrap">
              <el-table :data="detail_c" stripe fixed>
                <el-table-column
                  v-for="(item, index) in detailTableHead2"
                  :key="index"
                  :prop="item.prop"
                  :min-width="item.width"
                  :label="item.label"
                >
                  <template slot-scope="scope">
                    <span v-html="scope.row[item.prop]"></span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </slide-section>

          <slide-section
            :title="'NMPA公布参比制剂'"
            class="the-part"
            v-if="this.detail_d.length"
          >
            <div class="tb-wrap">
              <el-table :data="detail_d" stripe fixed>
                <el-table-column
                  v-for="(item, index) in detailTableHead3"
                  :key="index"
                  :prop="item.prop"
                  :min-width="item.width"
                  :label="item.label"
                >
                  <template slot-scope="scope">
                    <span>{{ scope.row[item.prop] }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </slide-section>

          <slide-section
            :title="'药智推荐参比'"
            class="the-part"
            v-if="this.detail_e.length"
          >
            <div class="tb-wrap">
              <el-table :data="detail_e" stripe fixed>
                <el-table-column
                  v-for="(item, index) in detailTableHead4"
                  :key="index"
                  :prop="item.prop"
                  :min-width="item.width"
                  :label="item.label"
                >
                  <template slot-scope="scope">
                    <span>{{ scope.row[item.prop] }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </slide-section>

          <slide-section
            :title="'参比制剂备案信息'"
            class="the-part"
            v-if="this.detail_f.length"
          >
            <div class="tb-wrap">
              <el-table :data="detail_f" stripe fixed>
                <el-table-column
                  v-for="(item, index) in detailTableHead5"
                  :key="index"
                  :prop="item.prop"
                  :min-width="item.width"
                  :label="item.label"
                >
                  <template slot-scope="scope">
                    <span>{{ scope.row[item.prop] }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </slide-section>

          <slide-section
            :title="'扩展信息'"
            class="the-part"
            v-if="extendList.length"
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
</template>

<script>
import LoadingGif from "@/components/common/globalCom/loading-gif";
import SlideSection from "@/components/common/slide-section";
import ExtendButton from "@/components/common/extend-button";
import tablehead from "@/config/tablehead";
import detailScrollMixins from "@/mixins/detailScroll.js";
import { mapState } from "vuex";
const tableHead1 = tablehead.orange.chinaDetail1;
const tableHead2 = tablehead.orange.chinaDetail2;
const tableHead3 = tablehead.orange.chinaDetail3;
const tableHead4 = tablehead.orange.chinaDetail4;
const tableHead5 = tablehead.orange.chinaDetail5;

export default {
  components: {
    LoadingGif,
    SlideSection,
    ExtendButton
  },
  mixins: [detailScrollMixins],
  data() {
    return {
      isLoading: true,
      scroll: 0,
      data: {},
      detail_title: {},
      detail_a: {},
      detail_b: [],
      detail_c: [],
      detail_d: [],
      detail_e: [],
      detail_f: [],
      heightArr: [],
      extendList: [], // 扩展信息
      detailTableHead1: tableHead1,
      detailTableHead2: tableHead2,
      detailTableHead3: tableHead3,
      detailTableHead4: tableHead4,
      detailTableHead5: tableHead5
    };
  },
  computed: {
    ...mapState({
      allBase: state => state.Orangebook.allBase,
      helpInfo: state => state.Orangebook.helpInfo,
      nopms: state => state.Orangebook.nopms
    })
  },
  watch: {
   showPromtNotice(val) {
      if (val) {
        if ($(".left-nav").css("top")) {
          $(".left-nav").css("top", "128px");
        }
      } else {
        if ($(".left-nav").css("top")) $(".left-nav").css("top", "98px");
      }
    }
  },
  methods: {
    handleAxios() {
      // 由于获取devprocess的异步数据时，需要此处的ajax获取到this.shoulihao之后，所以需要await其完成后
      window
        .Axios({
          method: "get",
          url: "/api/orangebook/" + this.$route.params.id,
          params: {
            accesstoken: GETCOOKIEFUN("accesstoken")
          }
        })
        .then(res => {
          if (res.data.code === 200 && res.data.data) {
            let data = res.data.data;
            let datas = data.GroupList;
            this.getExtendList("orangebook", data.extendList);

            this.detail_title = datas.title;
            this.detail_a = datas.list;
            this.detail_b = datas.bcs_usa;
            this.detail_c = datas.bcs_who;
            this.detail_d = datas.cfda;
            this.detail_e = datas.yzcb;
            this.detail_f = datas.cbba;
          }
        })
        .then(this.removeLoading());
    },
    // 加载完后移除加载界面
    removeLoading() {
      setTimeout(() => {
        this.isLoading = false;
      }, 2000);
    },
    handleScroll() {
      // let top = $(".main").offset().top,
      //   leftNav = $(".left-nav");
      // if (top <= 50) {
      //   leftNav.css("top", (this.showPromtNotice ? 118 : 98) + "px");
      // } else {
      //   leftNav.css("top", (this.showPromtNotice ? 118 : 88) + "px");
      // }
    }
  },
  created() {
    if (!this.nopms.xqy) {
      this.handleAxios();
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
    Store.dispatch("Orangebook/getBaseInfo");
    window.addEventListener("scroll", this.handleScroll, true);
  },
  activated() {
    this.vueRouteToNoPms(this.nopms.xqy);
  },
  updated() {
    this.vueRouteToNoPms(this.nopms.xqy);
    this.vueTogglePmsTooltip();
  }
};
</script>

<style lang="less" scoped>
@import "~@/assets/less/var.less";
@import "~@/assets/less/detailCom.less";
.tb-wrap {
  td {
    height: 34px !important;
  }
}
/deep/.cell {
  max-height: 44px;
}
/deep/.slide-section {
  .tb-t,
  .tb-f {
    tr {
      td {
        box-sizing: border-box;
        height: 32px;
        border: 1px solid @BorderColorNew;
        font-size: 13px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #545b6d;
        line-height: 32px;
        padding: 0 0 0 50px !important;
        font-size: 13px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #545b6d;
        max-width: 30vw !important;
        &:nth-child(odd) {
          min-width: 180px !important;
          width: 230px !important;
          background: @DetailTableLeftColor;
        }
        &:nth-child(even) {
          max-width: 20vw !important;
          width: auto !important;
          min-width: auto !important;
          word-wrap: break-word;
          word-break: break-all;
          white-space: normal;
          background: @DetailTableRightColor;
          line-height: 23px;
        }
        &:nth-child(2n) {
          padding: 0 0 0 60px !important;
        }
      }
    }
  }
}
@media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
  .left-bottom,
  .bottom-name,
  .id-green {
    display: block !important;
  }
}
</style>
