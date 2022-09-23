<template>
  <div class="detail-items">
    <!-- 竞争格局（靶点） -->
    <div class="detail-item">
      <div class="item-title">
        <span class="text">竞争格局（靶点）</span>
      </div>
      <div>
        <div class="tb-wrap">
          <div class="nav-switch">
            <ul>
              <li :class="{ active: yaow == 0 }" @click="switchs(0)">
                同靶点药物进度
              </li>
              <li :class="{ active: yaow == 1 }" @click="switchs(1)">
                同靶点药物分布
              </li>
            </ul>
          </div>
          <div class="choose-opt">
            <label>靶点</label>
            <div class="title-box1">
              <el-select
                v-model="select"
                placeholder="请选择"
                @change="changeValue"
                :popper-append-to-body="false"
              >
                <el-option
                  v-for="(item, index) in targetAbbrHandler()"
                  :key="index"
                  :title="item.name"
                  :label="item.name"
                  :value="item.name"
                >
                </el-option>
              </el-select>
            </div>
            <div class="title-box1">
              <el-autocomplete
                v-model="rname"
                :trigger-on-focus="false"
                placeholder="请输入药物中文/英文名称"
                clearable
                @clear="changeTitle"
                :fetch-suggestions="querySearch"
                @keyup.native.enter="changeTitle"
                @select="changeTitle"
                :popper-append-to-body="false"
                ref="popoverAutoInput"
                ><i
                  class="el-icon-search el-input__icon"
                  slot="suffix"
                  @click="changeTitle"
                >
                </i>
                <template slot-scope="{ item }">
                  <div
                    style="
                      white-space: nowrap;
                      overflow: hidden;
                      text-overflow: ellipsis;
                    "
                    :title="item.value"
                  >
                    {{ item.value }}
                  </div>
                </template>
              </el-autocomplete>
            </div>
            <div class="sp-r">
              <el-tooltip effect="light" placement="top" v-if="yaow == 1">
                <div slot="content">鼠标点击条形图可跳转查询具体数据</div>
                <span><i class="el-icon-question cl-green sixe13"></i></span>
              </el-tooltip>
              <span
                >竞品分析：{{
                  yaow == 0
                    ? "同靶点药物的全球进展"
                    : "同靶点药物的全球进展分布"
                }}</span
              >
            </div>
          </div>
          <div
            class="table-out"
            :style="{
              border: yaow == 1 && !nodata ? '1px solid #DCDFE6' : 'none',
            }"
          >
            <Global
              v-if="!yaow && globalData && globalData.length && jspdf == false"
              :globalData="globalData"
              :years="years"
              :loadingBen="loading"
              :dataid="id"
              :isExport.sync="jspdf"
              router="report"
            />
            <GlobalPDF
              v-if="!yaow && globalData && globalData.length && jspdf == true"
              :globalData="globalData"
              :years="years"
              :loadingBen="loading"
              :dataid="id"
              :isExport.sync="jspdf"
              router="report"
            />
            <China
              router="report"
              v-if="yaow && chinaData && chinaData.length"
              :chinaData="chinaData"
              :targets="select"
            />
            <!-- 无数据 -->
            <div class="nodata-box" v-if="nodata"></div>
            <!-- 加载中 -->
            <LoadingGif
              :className="'loading'"
              :loadFlag="false"
              v-if="false"
            ></LoadingGif>
          </div>

          <!-- 页码 -->
          <el-pagination
            v-if="dataTotal && dataTotal / pageSize > 1 && !yaow"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            layout="total, prev, pager, next"
            :page-size="pageSize"
            :total="dataTotal"
          >
          </el-pagination>
        </div>
      </div>
    </div>
    <DetailKzxx v-if="showKZXX()" :extendList="extendList"></DetailKzxx>
  </div>
</template>

<script>
import { mapState } from "vuex";
import China from "@/pages/newdrug/detail/components/china";
import Global from "./components/global";
import GlobalPDF from "./components/global-pdf";
import SlideSection from "@/components/common/slide-section";
import LoadingGif from "@/components/common/globalCom/loading-gif";
import DetailKzxx from "./kzxx";
export default {
  components: {
    China,
    Global,
    GlobalPDF,
    SlideSection,
    LoadingGif,
    DetailKzxx,
  },
  props: {
    extendList: Array,
    base_info: {
      type: Object,
    },
    moreData: {
      type: Array,
    },
    which: {
      type: [Number, String],
    },
    isExport: {
      type: Boolean,
    },
    jspdf: {
      type: Boolean,
    },
  },
  data() {
    return {
      res: {},
      select: "",
      yaow: 0,
      dataTotal: 0,
      currentPage: 1,
      page: 1,
      pageSize: 10,
      rname: "",
      chinaData: [],
      globalData: [],
      isLoading: true,
      loading: true,
      nodata: false,
      years: "",
      id: this.$route.params.id,
      scroll: "",
      data: {},
      heightArr: [],
      helpDesc: {
        deliveryInformation:
          "发补通知、通知现场检查、通知电子提交（修改） 、通知审评咨询会等；（2009年初至今的送达事项）",
        defaultLicenseDate: "更新结论的时间",
      },
    };
  },
  computed: {
    ...mapState({
      test: (state) => state.DrugReport.test,
      yfjdParams: (state) => state.DrugReport.yfjdParams,
    }),
  },
  watch: {
    jspdf: {
      handler(newVal, oldVal) {
        console.log(newVal);
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() {
    console.log(this.jspdf);
    this.res = this.base_info;
    if (this.moreData && this.moreData.length > 0) {
      this.yaow = this.which;
      this.loading = false;
      this.moreData.forEach((item) => {
        if (item.ck != undefined) {
          switch (item.ck) {
            case 0:
              item.data.res &&
                item.data.res.length > 0 &&
                item.data.res.forEach((v) => {
                  if (v.worldstatusorder === 2) {
                    v.worldstatusorder = 11;
                  } else if (v.worldstatusorder > 2) {
                    v.worldstatusorder = v.worldstatusorder - 1;
                  }
                });
              this.globalData = item.data.res;
              break;
            case 1:
              this.chinaData =
                item.data.res &&
                item.data.res.length > 0 &&
                item.data.res.reverse();
              break;
          }
        }
      });
    }
    this.handleAxios();
  },
  methods: {
    showKZXX() {
      let flag = false;
      if (this.jspdf) {
        flag = false;
      } else {
        flag = true;
      }
      return flag;
    },
    targetAbbrHandler() {
      if (this.data.targets_abbr != "") return this.data.targets_abbr;
      else return this.data.target;
    },
    handleAxios() {
      // 基本信息
      window
        .Axios({
          method: "get",
          url: "/api/report/" + this.id,
          params: {
            accesstoken: GETCOOKIEFUN("accesstoken"),
            msg_readid: this.id,
          },
        })
        .then((res) => {
          if (res.data.code === 200 && res.data.data) {
            let data = res.data.data;
            this.data = data;
            this.select =
              this.data.targets_abbr && this.data.targets_abbr.length
                ? this.data.targets_abbr[0].name
                : this.data.target && this.data.target.length
                ? this.data.target[0].name
                : "";
          }
          this.dataGet(1);
        })
        .catch((err) => {
          console.log(err);
        })
        .then(this.removeLoading);
    },
    //获取提示词
    querySearch(queryString, callback) {
      window
        .Axios({
          methods: "get",
          url: "/api/report/yfjdinput",
          params: {
            name: this.rname,
            target: this.select,
            accesstoken: this.vueGetCookie("accesstoken"),
          },
        })
        .then((res) => {
          if (res.data == "") {
            callback([]);
          } else {
            let data = [];
            for (let i = 0, l = res.data.data.length; i < l; i++) {
              data.push({ value: res.data.data[i] });
            }
            callback(data);
          }
        })
        .catch((thrown) => {
          console.log("请求出错了");
        });
    },
    changeTitle() {
      this.dataGet(1);
      Store.commit("DrugReport/yfjdParams", {
        page: this.page,
        pageSize: this.pageSize,
        rname: this.rname,
        target: this.select,
        ck: this.yaow,
        readid: this.data.id,
        accesstoken: GETCOOKIEFUN("accesstoken"),
      });
    },
    handleCurrentChange(val) {
      this.page = val;
      this.dataGet(val);
      Store.commit("DrugReport/yfjdParams", {
        page: this.page,
        pageSize: this.pageSize,
        rname: this.rname,
        target: this.select,
        ck: this.yaow,
        readid: this.data.id,
        accesstoken: GETCOOKIEFUN("accesstoken"),
      });
    },
    switchs(val) {
      this.yaow = val;
      this.dataGet(1);
      Store.commit("DrugReport/yfjdParams", {
        page: this.page,
        pageSize: this.pageSize,
        rname: this.rname,
        target: this.select,
        ck: this.yaow,
        readid: this.data.id,
        accesstoken: GETCOOKIEFUN("accesstoken"),
      });
    },
    changeValue(val) {
      this.select = val;
      this.dataGet(1);
      Store.commit("DrugReport/yfjdParams", {
        page: this.page,
        pageSize: this.pageSize,
        rname: this.rname,
        target: this.select,
        ck: this.yaow,
        readid: this.data.id,
        accesstoken: GETCOOKIEFUN("accesstoken"),
      });
    },
    dataGet(page) {
      this.loading = true;
      Store.commit("DrugReport/yfjdParams", {
        page,
        pageSize: this.pageSize,
        rname: this.rname,
        target: this.select,
        ck: this.yaow,
        readid: this.data.id,
        accesstoken: GETCOOKIEFUN("accesstoken"),
      });
      window
        .Axios({
          method: "get",
          url: "/api/report/yfjd",
          params: {
            page: this.page,
            pageSize: this.pageSize,
            rname: this.rname,
            target: this.select,
            ck: this.yaow,
            readid: this.data.id,
            accesstoken: GETCOOKIEFUN("accesstoken"),
          },
        })
        .then((res) => {
          this.nodata = false;
          this.loading = false;

          if (res.data.code === 200) {
            let datas = res.data.data.res ? res.data.data.res : [];
            this.years = res.data.data.year ? res.data.data.year : "";

            if (!datas.length) {
              this.nodata = true;
            }
            if (this.yaow) {
              this.chinaData = datas.reverse();
            } else {
              datas.forEach((v) => {
                if (v.worldstatusorder === 2) {
                  v.worldstatusorder = 11;
                } else if (v.worldstatusorder > 2) {
                  v.worldstatusorder = v.worldstatusorder - 1;
                }
              });
              this.globalData = datas;
            }
            this.currentPage = res.data.data.page ? res.data.data.page : 1;
            this.dataTotal = res.data.data.count ? res.data.data.count : 0;
          } else {
            this.nodata = true;
            this.currentPage = 1;
            this.dataTotal = 0;
          }
        })
        .catch((err) => {
          console.log(err);
        });
      // .then(this.removeLoadingMin)
    },
  },
};
</script>
<style lang="less" scoped>
@import "~@/assets/less/var.less";
@import "~@/assets/less/detailCom.less";
@import "../css/com.less";

// .detail-items {
//   padding-bottom: 10px !important;
// }

.tb-wrap {
  padding: 10px 10px 10px 25px;
}
.nav-switch {
  display: flex;
  justify-content: center;

  ul {
    display: flex;
    padding: 0 100px;
    border-bottom: 3px solid #4877e8;

    li {
      width: 120px;
      text-align: center;
      font-size: 14px;
      height: 28px;
      line-height: 28px;
      cursor: pointer;
    }
    li.active {
      background: #4877e8;
      color: #fff;
    }
  }
}

.wrapper {
  .detail-list {
    .header-right {
      .ywbg {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        margin-bottom: 5px;
        .ywbg-btn {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-left: 6px;
          height: 28px;
          width: 106px;
          font-size: 14px;
          background: #4877e8;
          color: #fff;
          line-height: 28px;
          border-radius: 4px;
          cursor: pointer;

          span {
            margin-left: 8px;
          }
          &:hover {
            opacity: 0.9;
          }
        }
      }
    }
    .main {
      .part0 {
        .fenzi {
          display: inline-block;
          color: #4877e8;
          margin-right: 10px;
        }
        .s-color {
          display: inline-block;
          width: 124px;
          margin-right: 10px;
          line-height: 19px;
          border-radius: 10px;
          text-align: center;
          background: #f2f2f2;
          color: #36364b;
        }
        .s-color1 {
          background: #91c332;
          color: #fff;
        }
        .s-color2 {
          background: #4877e8;
          color: #fff;
        }
        .s-color3,
        .s-color4 {
          background: #638beb;
          color: #fff;
        }
        .s-color5,
        .s-color6 {
          background: #91adf1;
          color: #fff;
        }
        .s-color7,
        .s-color8 {
          background: #acc2f5;
          color: #fff;
        }
        .s-color9,
        .s-color10 {
          background: #c8d6f8;
          color: #36364b;
        }
        .s-color11 {
          background: #e4ebfb;
          color: #36364b;
        }
        .s-color12 {
          background: #ff9a75;
          color: #fff;
        }
        .s-color13 {
          background: #fbc78e;
          color: #fff;
        }
        .s-color14,
        .s-color15,
        .s-color17 {
          background: #f2f2f2;
          color: #36364b;
        }
        .s-color16 {
          background: #56596c;
          color: #fff;
        }
      }
      .part1 {
        .nav-switch {
          display: flex;
          justify-content: center;

          ul {
            display: flex;
            padding: 0 100px;
            border-bottom: 3px solid #4877e8;

            li {
              width: 120px;
              text-align: center;
              font-size: 14px;
              height: 28px;
              line-height: 28px;
              cursor: pointer;
            }
            li.active {
              background: #4877e8;
              color: #fff;
            }
          }
        }
      }
    }
  }
}
.el-pagination {
  padding-bottom: 0;
}
.sixe13 {
  font-size: 13px;
}
.choose-opt {
  margin-top: 30px;
  margin-bottom: 15px;
  display: flex;
  justify-content: flex-start;
  position: relative;
  label {
    margin-right: 8px;
    line-height: 30px;
    font-size: 14px;
  }
  .sp-r {
    color: #999;
    position: absolute;
    right: 0;
    line-height: 30px;
  }
  .title-box1 {
    width: 240px;
    margin-right: 20px;
  }
  /deep/.el-select,
  /deep/.el-autocomplete {
    width: 100%;
  }
  /deep/.el-input__icon {
    padding-right: 6px;
    line-height: 30px;
    cursor: pointer;
  }
}

.nodata-box {
  // position: absolute;
  // top: 0;
  // left: 0;
  height: 300px;
  width: 100%;
  background: #fff url(/static/imgs/nodata.png) center center no-repeat;
}
.table-out {
  // height: 690px;
  min-height: 100px;
  position: relative;

  .loading {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background: rgba(255, 255, 255, 0.7);
  }
}

.header-left {
  justify-content: start !important;
}
</style>
