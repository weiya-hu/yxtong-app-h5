<template>
  <div class="wrapper" ref="wrapper">
    <!-- 自定义加载界面 -->
    <LoadingGif :loadFlag="isLoading" v-if="isLoading"></LoadingGif>
    <!-- 加载完成显示部分 -->
    <div class="detail-list" v-else>
      <div class="detail-header header-fixed">
        <div class="header-left">
          <div class="left-top">
            <span class=" top-id" :title="headData.trade_name">{{
              headData.trade_name
            }}</span>
            <span class="top-num">{{ headData.appl_no }}</span>
            <span class="id-green">{{ headData.appl_type }}</span>
          </div>
        </div>
      </div>
      <div class="main">
        <div
          class="left-nav"
          :style="{ top: (showPromtNotice ? 128 : 98) + 'px' }"
        >
          <div class="nav-list nav-event" @click="handleNavClick">
            <a class="nav-item active" v-if="hasPartOne">基本信息</a>
            <a class="nav-item" v-if="hasPartTwo">与本品相关的专利信息</a>
            <a class="nav-item" v-if="hasPartFourth"
              >与本品相关的历史专利信息</a
            >
            <a class="nav-item" v-if="hasPartThree"
              >与本品相关的市场专营保护信息</a
            >
            <a class="nav-item" v-if="hasExtend">扩展信息</a>
          </div>
        </div>
        <div class="right-list">
          <slide-section :title="'基本信息'" class="the-part" v-if="hasPartOne">
            <div class="tb-wrap">
              <table class="tb-t">
                <tr>
                  <td>商品名</td>
                  <td>{{ baseData.trade_name }}</td>
                  <td>英文活性成分</td>
                  <td>{{ baseData.ingredient }}</td>
                </tr>
                <tr>
                  <td>申请类型</td>
                  <td>{{ baseData.appl_type }}</td>
                  <td>活性成分</td>
                  <td>{{ baseData.cname }}</td>
                </tr>
                <tr>
                  <td>产品号</td>
                  <td>{{ baseData.product_no }}</td>
                  <td>申请号</td>
                  <td>{{ baseData.appl_no }}</td>
                </tr>
                <tr>
                  <td>规格/剂量</td>
                  <td>{{ baseData.strength }}</td>
                  <td>剂型/给药途径</td>
                  <td>{{ baseData.df_route }}</td>
                </tr>
                <tr>
                  <td>批准时间</td>
                  <td>{{ baseData.pzendtime }}</td>
                  <td>申请机构</td>
                  <td>{{ baseData.applicant }}</td>
                </tr>
                <tr>
                  <td>市场状态</td>
                  <td>{{ baseData.type }}</td>
                  <td>参比制剂</td>
                  <td>{{ baseData.rld }}</td>
                </tr>
                <tr>
                  <td>等效性代码</td>
                  <td>
                    <span
                      class="detail-click-to-popup"
                      @click="detailClickToPopup(baseData.te_code, 1)"
                    >
                      {{ baseData.te_code }}
                    </span>
                  </td>
                  <td>标准制剂</td>
                  <td>{{ baseData.rs }}</td>
                </tr>
              </table>
            </div>
          </slide-section>

          <slide-section
            :title="'与本品相关的专利信息'"
            class="the-part"
            v-if="hasPartTwo"
          >
            <!-- 表格 -->
            <div class="tb-wrap">
              <el-table
                :data="zlxxData.List"
                stripe
                fixed
                class="table"
                style="width: 100%"
              >
                <el-table-column
                  v-for="item in zlxxHead"
                  :prop="item.prop"
                  :min-width="item.width"
                  :key="item.prop"
                  :label="item.label"
                >
                  <template slot-scope="scope">
                    <div v-if="item.prop === 'appl_no'">
                      {{ scope.row.appl_no }}
                    </div>
                    <div v-if="item.prop === 'product_no'">
                      {{ scope.row.product_no }}
                    </div>
                    <div v-if="item.prop === 'patent_no'">
                      <a
                        :href="
                          'http://patft.uspto.gov/netacgi/nph-Parser?patentnumber=' +
                            scope.row.patent_no.split('*')[0]
                        "
                        target="_blank"
                        class="cl-blue"
                      >
                        {{ scope.row.patent_no }}
                      </a>
                    </div>
                    <div v-if="item.prop === 'zhuanliendtime'">
                      {{ scope.row.zhuanliendtime }}
                    </div>
                    <div v-if="item.prop === 'drug_substance_flag'">
                      {{ scope.row.drug_substance_flag }}
                    </div>
                    <div v-if="item.prop === 'drug_product_flag'">
                      {{ scope.row.drug_product_flag }}
                    </div>
                    <div v-if="item.prop === 'patent_use_code'">
                      <span
                        class="detail-click-to-popup"
                        @click="
                          detailClickToPopup(scope.row.patent_use_code, 2)
                        "
                      >
                        {{ scope.row.patent_use_code }}
                      </span>
                    </div>
                    <div v-if="item.prop === 'delist_flag'">
                      {{ scope.row.delist_flag }}
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </slide-section>

          <slide-section
            :title="'与本品相关的历史专利信息'"
            class="the-part"
            v-if="hasPartFourth"
          >
            <!-- 表格 -->
            <div class="tb-wrap">
              <el-table
                :data="zlhisData.List"
                stripe
                fixed
                class="table"
                style="width: 100%"
              >
                <el-table-column
                  v-for="item in zlhisHead"
                  :prop="item.prop"
                  :min-width="item.width"
                  :key="item.prop"
                  :label="item.label"
                >
                  <template slot-scope="scope">
                    <div v-if="item.prop === 'appl_no'">
                      {{ scope.row.appl_no }}
                    </div>
                    <div v-if="item.prop === 'product_no'">
                      {{ scope.row.product_no }}
                    </div>
                    <div v-if="item.prop === 'patent_no'">
                      <a
                        :href="
                          `https://patent.yaozh.com/list?words=KWS=US${
                            scope.row.patent_no.split('*')[0]
                          }&sourceType=all&ga_source=vip&ga_name=fdaproducts`
                        "
                        target="_blank"
                        class="cl-blue"
                      >
                        {{ scope.row.patent_no }}
                      </a>
                    </div>
                    <div v-if="item.prop === 'patent_expire_date_text'">
                      {{ scope.row.patent_expire_date_text }}
                    </div>
                    <div v-if="item.prop === 'drug_substance_flag'">
                      {{ scope.row.drug_substance_flag }}
                    </div>
                    <div v-if="item.prop === 'drug_product_flag'">
                      {{ scope.row.drug_product_flag }}
                    </div>
                    <div v-if="item.prop === 'patent_use_code'">
                      <span
                        class="detail-click-to-popup"
                        @click="
                          detailClickToPopup(scope.row.patent_use_code, 2)
                        "
                      >
                        {{ scope.row.patent_use_code }}
                      </span>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </slide-section>

          <slide-section
            :title="'与本品相关的市场专营保护信息'"
            class="the-part"
            v-if="hasPartThree"
          >
            <div class="tb-wrap">
              <el-table
                :data="bhxxData.List"
                stripe
                fixed
                class="table"
                style="width: 100%"
              >
                <el-table-column
                  v-for="item in bhxxHead"
                  :prop="item.prop"
                  :min-width="item.width"
                  :key="item.prop"
                  :label="item.label"
                >
                  <template slot-scope="scope">
                    <div v-if="item.prop === 'appl_no'">
                      {{ scope.row.appl_no }}
                    </div>
                    <div v-if="item.prop === 'product_no'">
                      {{ scope.row.product_no }}
                    </div>
                    <div v-if="item.prop === 'exclusivity_code'">
                      <span
                        class="detail-click-to-popup"
                        @click="
                          detailClickToPopup(scope.row.exclusivity_code, 3)
                        "
                      >
                        {{ scope.row.exclusivity_code }}
                      </span>
                    </div>
                    <div v-if="item.prop === 'exclusivity_endtime'">
                      {{ scope.row.exclusivity_endtime }}
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </slide-section>

          <slide-section
            :title="'扩展信息'"
            class="the-part part-four"
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
      <!-- 弹出框 -->
      <el-dialog
        class="dialog-saved"
        :visible.sync="detailPopVisible"
        :modal-append-to-body="false"
      >
        <div slot="title" class="dialog-header">
          {{ detail_popup_title }}
        </div>
        <el-table :data="detail_popup" stripe fixed>
          <el-table-column
            v-for="(item, index) in detail_popup_head"
            :prop="item.prop"
            :key="index"
            :label="item.label"
          >
            <template slot-scope="scope">
              <div v-if="handleOtherTableScope(scope, item)">
                <span :title="handleOtherTableScopeContent(scope, item)">{{
                  handleOtherTableScopeContent(scope, item)
                }}</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import LoadingGif from "@/components/common/globalCom/loading-gif";
import SlideSection from "@/components/common/slide-section";
import ExtendButton from "@/components/common/extend-button";
import LaFooter from "@/components/layouts/footer";
import tablehead from "@/config/tablehead";
import detailScrollMixins from "@/mixins/detailScroll.js";
import { mapState } from "vuex";
const detailHead1 = tablehead.orange.FdaProductsDetail1;
const detailHead2 = tablehead.orange.FdaProductsDetail2;
const detailHead3 = tablehead.orange.FdaProductsDetail3;

export default {
  components: {
    LoadingGif,
    SlideSection,
    LaFooter,
    ExtendButton
  },
  mixins: [detailScrollMixins],
  data() {
    return {
      isLoading: true,
      detailPopVisible: false,
      detail_popup_title: "",
      detail_popup_head: [],
      detail_popup: [],
      id: "",
      // steps,
      data: {},
      scroll: "",
      heightArr: [],
      hasPartOne: true,
      hasPartTwo: false,
      hasPartThree: false,
      hasPartFourth: false,
      hasExtend: false,
      extendList: [],
      headData: {},
      baseData: {},
      zlxxData: {},
      zlxxHead: detailHead1,
      bhxxData: {},
      bhxxHead: detailHead2,
      zlhisData: {},
      zlhisHead: detailHead3
    };
  },
  computed: {
    ...mapState({
      nopms: state => state.FdaProducts.nopms,
      allBase: state => state.FdaProducts.allBase,
      helpInfo: state => state.FdaProducts.helpInfo
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
    handleScroll() {
      // let top = $(".main").offset().top,
      //   leftNav = $(".left-nav");
      // if (top <= 50) {
      //   leftNav.css("top", (this.showPromtNotice ? 118 : 98) + "px");
      // } else {
      //   leftNav.css("top", (this.showPromtNotice ? 118 : 88) + "px");
      // }
    },
    detailClickToPopup(option, type) {
      this.detail_popup = [];
      let suffix = "";
      let suffix_query = "";
      this.detailPopVisible = true;

      if (type == 1) {
        this.detail_popup_title = "等效性代码";
        this.detail_popup_head = [
          {
            prop: "tecode",
            label: "代码"
          },
          {
            prop: "tecode_en",
            label: "英文定义"
          },
          {
            prop: "tecode_cn",
            label: "中文定义"
          }
        ];
        suffix = "tecode";
        suffix_query = "tecode";
      } else if (type == 2) {
        this.detail_popup_title = "专利用途码";
        this.detail_popup_head = [
          {
            prop: "code",
            label: "代码"
          },
          {
            prop: "definition",
            label: "定义"
          }
        ];
        suffix = "code";
        suffix_query = "patent_use_code";
      } else if (type == 3) {
        this.detail_popup_title = "专营保护码";
        this.detail_popup_head = [
          {
            prop: "exclusivity_code",
            label: "代码"
          },
          {
            prop: "definition",
            label: "定义"
          }
        ];
        suffix = "exclusivitycode";
        suffix_query = "exclusivity_code";
      }

      window
        .Axios({
          method: "get",
          url: "/api/fdaproducts/" + suffix + "?" + suffix_query + "=" + option
        })
        .then(res => {
          if (res.data.code == 200 && res.data.data) {
            this.detail_popup.push(res.data.data);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleOtherTableScope(scope, option) {
      console.log(scope.row);
      for (let key in scope.row) {
        if (key == option.prop) {
          return true;
        }
      }
    },
    handleOtherTableScopeContent(scope, option) {
      console.log(scope.row);

      for (let key in scope.row) {
        if (key == option.prop) {
          return scope.row[key] ? scope.row[key] : "";
        }
      }
    },
    handleAxiosAll() {
      return Axios.all([
        (() => {
          return Axios.get("/api/fdaproducts/" + this.$route.params.id, {
            params: { accesstoken: GETCOOKIEFUN("accesstoken") }
          });
        })(),
        (() => {
          return Axios.get("/api/fdaproducts/getzlxx", {
            params: { id: this.$route.params.id }
          });
        })(),
        (() => {
          return Axios.get("/api/fdaproducts/getbhxx", {
            params: { id: this.$route.params.id }
          });
        })(),
        (() => {
          return Axios.get("/api/fdaproducts/getZlhis", {
            params: { id: this.$route.params.id }
          });
        })()
      ])
        .then(
          Axios.spread((base, zlxx, bhxx, zlhis) => {
            if (base.data.code === 200 && base.data.data) {
              let data = base.data.data;
              this.headData = data.Titel;
              this.baseData = data.List;
              this.getExtendList("fdaproducts", data.extendList);
            }

            if (zlxx.data.code === 200 && zlxx.data.data) {
              let data = zlxx.data.data;
              this.zlxxData = data;
              if (data.List && data.List.length) {
                this.hasPartTwo = true;
              }
            }

            if (bhxx.data.code === 200 && bhxx.data.data) {
              let data = bhxx.data.data;
              this.bhxxData = data;
              if (data.List && data.List.length) {
                this.hasPartThree = true;
              }
            }

            if (zlhis.data.code === 200 && zlhis.data.data) {
              let data = zlhis.data.data;
              this.zlhisData = data;
              if (data.List && data.List.length) {
                this.hasPartFourth = true;
              }
            }
          })
        )
        .catch(err => {
          console.log(err);
        });
    },
    // 加载完后移除加载界面
    removeLoading() {
      this.isLoading = false;
    }
  },
  created() {
    if (!this.nopms.xqy) {
      this.handleAxiosAll().then(() => {
        this.removeLoading();
      });
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
    Store.dispatch("FdaProducts/getBaseInfo");
    window.addEventListener("scroll", this.handleScroll, true);
  },
  activated() {
    // this.vueRouteToNoPms(this.nopms.xqy)
  },
  updated() {
    // this.vueRouteToNoPms(this.nopms.xqy)
    // this.vueTogglePmsTooltip()
  }
};
</script>

<style lang="less" scoped>
@import "~@/assets/less/var.less";
@import "~@/assets/less/detailCom.less";

.wrapper {
  .detail-list {
    .the-part {
      .detail-click-to-popup {
        cursor: pointer;
        color: @PrimaryColor;
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
}
</style>
