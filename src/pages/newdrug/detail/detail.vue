<template>
  <div class="wrapper" ref="wrapper">
    <!-- 自定义加载界面 -->
    <LoadingGif :loadFlag="isLoading" v-if="isLoading"></LoadingGif>
    <!-- 加载完成显示部分 -->
    <div class="detail-list" v-else>
      <div class="detail-header">
        <div class="header-left">
          <div class="left-top">
            <span
              class="top-id"
              :title="data.name ? data.name : data.englishname"
              >{{ data.name ? data.name : data.englishname }}</span
            >
            <div class="left-bottom" v-if="data.name">
              <span class="bottom-name fontw">{{
                data.name ? data.englishname : ""
              }}</span>
            </div>
            <span class="id-green" v-if="data.is_zgss">中国上市</span>
            <span
              class="id-green bg-orange"
              v-if="data.worldstatus"
              :title="'全球最高状态：' + data.higheststatus"
              >{{ data.worldstatus }}</span
            >
          </div>
        </div>
        <div class="header-right">
          <div class="ywbg" v-if="data.reportid && data.ylbm">
            <el-tooltip effect="light" placement="left">
              <div slot="content">可查看该药物的详细完整数据信息报告</div>
              <span><i class="el-icon-question cl-green"></i></span>
            </el-tooltip>
            <div
              class="ywbg-btn"
              @click="ywbgLink(data.reportid, 'newdrug_detail_righttop')"
            >
              <img src="~@/assets/imgs/ywbg.png" />
              <span>药物报告</span>
            </div>
          </div>
        </div>
      </div>
      <div class="main">
        <slide-section :title="'基本信息'" class="the-part part0">
          <div class="detail-title"><span class="in">药物信息</span></div>
          <div class="tb-wrap">
            <table class="tb-t">
              <tr>
                <td>中文名称</td>
                <td>
                  <a
                    style="color: #4877e8"
                    v-if="data.reportid && data.name && data.ylbm"
                    href="javascript:;"
                    @click="ywbgLink(data.reportid, 'newdrug_detail_name')"
                    >{{ data.name }}</a
                  >
                  <span v-else>{{ data.name ? data.name : "/" }}</span>
                </td>
                <td>中文别名</td>
                <td>
                  <span>{{ data.zwbiem ? data.zwbiem : "/" }}</span>
                </td>
              </tr>
              <tr>
                <td>英文名称</td>
                <td>
                  <a
                    style="color: #4877e8"
                    v-if="
                      data.reportid &&
                      !data.name &&
                      data.englishname &&
                      data.ylbm
                    "
                    href="javascript:;"
                    @click="
                      ywbgLink(data.reportid, 'newdrug_detail_englishname')
                    "
                    >{{ data.englishname }}</a
                  >
                  <span v-else>{{
                    data.englishname ? data.englishname : "/"
                  }}</span>
                </td>
                <td>英文别名</td>
                <td>
                  <span>{{ data.ename ? data.ename : "/" }}</span>
                </td>
              </tr>
              <tr>
                <td>化学名称</td>
                <td>
                  <span>{{ data.chemicalname ? data.chemicalname : "/" }}</span>
                </td>
                <td>cas号</td>
                <td>
                  <span>{{ data.cas ? data.cas : "/" }}</span>
                </td>
              </tr>
              <tr>
                <td>分子式</td>
                <td>
                  <span
                    v-html="
                      data.formulations
                        ? vueFormulationsFormatter(data.formulations)
                        : '/'
                    "
                  ></span>
                </td>
                <td>分子量</td>
                <td>
                  <span>{{
                    data.formulaweight ? data.formulaweight : "/"
                  }}</span>
                </td>
              </tr>
              <tr>
                <td>ATC分类</td>
                <td colspan="3">
                  <div v-if="data.atc">
                    <p v-for="(item, ix) in Object.keys(data.atcarr)" :key="ix">
                      <router-link
                        tag="a"
                        :to="'/atc?num=' + item"
                        target="_blank"
                        class="fenzi"
                        >{{ item }}</router-link
                      >
                      <span
                        v-for="(items, ixs) in data.atcarr
                          ? data.atcarr[item]
                          : []"
                        :key="ixs"
                      >
                        {{ items.shuoming }}
                        <span v-if="data.atcarr[item].length - 1 !== ixs">
                          >
                        </span>
                      </span>
                    </p>
                  </div>
                  <span v-else>/</span>
                </td>
              </tr>
              <tr>
                <td>中国首批上市时间</td>
                <td>
                  <span>{{ data.fistapproval_CH || "/" }}</span>
                </td>
                <td>美国首批上市时间</td>
                <td>
                  <span>{{ data.fistapproval_USA || "/" }}</span>
                </td>
              </tr>
              <tr>
                <td>日本首批上市时间</td>
                <td>
                  <span>{{ data.fistapproval_JP || "/" }}</span>
                </td>
                <td>欧盟首批上市时间</td>
                <td>
                  <span>{{ data.fistapproval_EU || "/" }}</span>
                </td>
              </tr>
            </table>
          </div>
          <div class="detail-title"><span class="in">靶点、适应症</span></div>
          <div class="tb-wrap">
            <table class="tb-t">
              <tr>
                <td>靶点全称</td>
                <td>
                  <div
                    class="td-line5"
                    v-if="data.target && data.target.length"
                  >
                    <p v-for="(item, ix) in data.target" :key="ix">
                      <router-link
                        tag="a"
                        :to="'/targetdatas/' + item.hrefid"
                        target="_blank"
                        style="display: inline-block; color: #4877e8"
                        v-if="item.hrefid"
                        >{{ item.name
                        }}{{
                          ix + 1 < data.target.length ? ";" : ""
                        }}</router-link
                      >
                      <span v-else
                        >{{ item.name
                        }}{{ ix + 1 < data.target.length ? ";" : "" }}</span
                      >
                    </p>
                  </div>
                  <span v-else>/</span>
                </td>
                <td>靶点简称</td>
                <td>
                  <div
                    class="td-line5"
                    v-if="data.targets_abbr && data.targets_abbr.length"
                  >
                    <p v-for="(item, ix) in data.targets_abbr" :key="ix">
                      <router-link
                        tag="a"
                        :to="'/targetdatas/' + item.hrefid"
                        target="_blank"
                        style="display: inline-block; color: #4877e8"
                        v-if="item.hrefid"
                        >{{ item.name
                        }}{{
                          ix + 1 < data.targets_abbr.length ? ";" : ""
                        }}</router-link
                      >
                      <span v-else
                        >{{ item.name
                        }}{{
                          ix + 1 < data.targets_abbr.length ? ";" : ""
                        }}</span
                      >
                    </p>
                  </div>
                  <span v-else>/</span>
                </td>
              </tr>
              <tr>
                <td>在研适应症</td>
                <td>
                  <div
                    class="td-line5"
                    v-if="
                      data.activeindications && data.activeindications.length
                    "
                  >
                    <p v-for="(item, ix) in data.activeindications" :key="ix">
                      {{ item
                      }}{{ ix + 1 < data.activeindications.length ? ";" : "" }}
                    </p>
                  </div>
                  <span v-else>/</span>
                </td>
                <td>非在研适应症</td>
                <td>
                  <div
                    class="td-line5"
                    v-if="
                      data.inactiveIndications &&
                      data.inactiveIndications.length
                    "
                  >
                    <p v-for="(item, ix) in data.inactiveIndications" :key="ix">
                      {{ item
                      }}{{
                        ix + 1 < data.inactiveIndications.length ? ";" : ""
                      }}
                    </p>
                  </div>
                  <span v-else>/</span>
                </td>
              </tr>
              <tr>
                <td>适应症进展</td>
                <td colspan="3">
                  <div
                    class="td-line5"
                    v-if="
                      data.developmentphases && data.developmentphases.length
                    "
                  >
                    <div
                      v-for="(item, ix) in data.developmentphases"
                      :key="ix"
                      style="display: flex; align-items: flex-start"
                    >
                      <span :class="['s-color', 's-color' + item.sid]">{{
                        item.title
                      }}</span>
                      <p style="flex: 1">{{ item.content }}</p>
                    </div>
                  </div>
                  <span v-else>/</span>
                </td>
              </tr>
            </table>
          </div>
          <div class="detail-title"><span class="in">企业信息</span></div>
          <div class="tb-wrap">
            <table class="tb-t">
              <tr>
                <td>原研单位</td>
                <td>
                  <div
                    class="td-line5"
                    v-if="
                      data.originatorcompany_02 &&
                      data.originatorcompany_02.length
                    "
                  >
                    <p
                      v-for="(item, ix) in data.originatorcompany_02"
                      :key="ix"
                    >
                      {{ item
                      }}{{
                        ix + 1 < data.originatorcompany_02.length ? ";" : ""
                      }}
                    </p>
                  </div>
                  <span v-else>/</span>
                </td>
                <td>非在研公司</td>
                <td>
                  <div
                    class="td-line5"
                    v-if="
                      data.inactivecompanies && data.inactivecompanies.length
                    "
                  >
                    <p v-for="(item, ix) in data.inactivecompanies" :key="ix">
                      {{ item
                      }}{{ ix + 1 < data.inactivecompanies.length ? ";" : "" }}
                    </p>
                  </div>
                  <span v-else>/</span>
                </td>
              </tr>
              <tr>
                <td>研发公司</td>
                <td colspan="3">
                  <div
                    class="td-line5"
                    v-if="data.othercompany && data.othercompany.length"
                  >
                    <p v-for="(item, ix) in data.othercompany" :key="ix">
                      {{ item
                      }}{{ ix + 1 < data.othercompany.length ? ";" : "" }}
                    </p>
                  </div>
                  <span v-else>/</span>
                </td>
              </tr>
            </table>
          </div>
        </slide-section>

        <slide-section
          :title="'研发进展'"
          class="the-part part1"
          v-if="
            (data.target && data.target.length) ||
            (data.targets_abbr && data.targets_abbr.length)
          "
        >
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
                  >
                    <el-option
                      v-for="(option, index) in data.targets_abbr.length
                        ? data.targets_abbr
                        : data.target"
                      :key="index"
                      :title="option.name"
                      :label="option.name"
                      :value="option.name"
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
                :popper-append-to-body="false"
                    @select="changeTitle"
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
                    <span
                      ><i class="el-icon-question cl-green sixe13"></i
                    ></span>
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
                  v-if="!yaow && globalData.length"
                  :globalData="globalData"
                  :years="years"
                  :page="currentPage"
                  :loadingBen="loading"
                  :dataid="data.id ? data.id : ''"
                />
                <China
                  v-if="yaow && chinaData.length"
                  :chinaData="chinaData"
                  :targets="select"
                />

                <!-- 无数据 -->
                <div class="nodata-box" v-if="nodata"></div>
                <!-- 加载中 -->
                <LoadingGif
                  :className="'loading'"
                  :loadFlag="loading"
                  v-if="loading"
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
        </slide-section>

        <a href="#" name="part8"></a>
        <slide-section
          :title="'扩展信息'"
          class="the-part part-eight"
          v-if="extendList && extendList.length"
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
    <la-footer></la-footer>
  </div>
</template>

<script>
import LoadingGif from "@/components/common/globalCom/loading-gif";
import SlideSection from "@/components/common/slide-section";
import LaFooter from "@/components/layouts/footer";
import ExtendButton from "@/components/common/extend-button";
import China from "./components/china";
import Global from "./components/global";
import detailScrollMixins from "@/mixins/detailScroll.js";
import { mapState } from "vuex";

export default {
  components: {
    LoadingGif,
    SlideSection,
    LaFooter,
    ExtendButton,
    China,
    Global,
  },
  mixins: [detailScrollMixins],
  data() {
    return {
      select: "",
      yaow: 0,
      dataTotal: 0,
      currentPage: 1,
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
      extendList: [], // 扩展信息
      helpDesc: {
        deliveryInformation:
          "发补通知、通知现场检查、通知电子提交（修改） 、通知审评咨询会等；（2009年初至今的送达事项）",
        defaultLicenseDate: "更新结论的时间",
      },
    };
  },
  computed: {
    ...mapState({
      allBase: (state) => state.Newdrug.allBase,
      helpInfo: (state) => state.Newdrug.helpInfo,
      nopms: (state) => state.Newdrug.nopms,
    }),
  },
  watch: {},
  methods: {
    //获取提示词
    querySearch(queryString, callback) {
      window
        .Axios({
          methods: "get",
          url: "/api/newdrug/yfjdinput",
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
    ywbgLink(val, str) {
      window.ga("send", "event", "button", "click", str);
      window._paq.push(["trackEvent", "button", "click", str]);

      window.open("/report/" + val);
    },
    changeValue(val) {
      this.select = val;
      this.dataGet(1);
    },
    switchs(val) {
      this.yaow = val;
      this.dataGet(1);
    },
    changeTitle() {
      this.dataGet(1);
    },
    handleCurrentChange(val) {
      this.dataGet(val);
    },
    dataGet(page) {
      this.loading = true;
      window
        .Axios({
          method: "get",
          url: "/api/newdrug/yfjd",
          params: {
            page,
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
    async handleAxios() {
      // 基本信息
      await window
        .Axios({
          method: "get",
          url: "/api/newdrug/" + this.id,
          params: {
            accesstoken: GETCOOKIEFUN("accesstoken"),
            msg_readid: this.$route.query.msg_readid,
          },
        })
        .then((res) => {
          if (res.data.code === 200 && res.data.data) {
            let data = res.data.data;
            this.data = data;
            this.getExtendList("newdrug", data.extendList);
            this.select =
              this.data.targets_abbr && this.data.targets_abbr.length
                ? this.data.targets_abbr[0].name
                : this.data.target && this.data.target.length
                ? this.data.target[0].name
                : "";
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .then(this.removeLoading);

      this.dataGet(1);
    },
    // 加载完后移除加载界面
    removeLoading() {
      this.isLoading = false;
    },
    // 加载完后移除加载
    removeLoadingMin() {
      this.loading = false;
    },
  },
  created() {
    this.handleAxios();
    setTimeout(() => {
      const hashLocation = sessionStorage.getItem("hashLocation"); //缓存中获取当前页面的路由名称
      // 注意, 这里使用全路径匹配,在hash模式中,因为地址会携带#,所以页面报告中的url需要重新覆盖一下, 将#去除
      window._paq.push(["setCustomUrl", "https://" + hashLocation]); //覆盖页面报告的url，可以自定义页面url，加上本页面路由
      window._paq.push(["trackPageView", this.allBase.dbname]); //页面名称,可以自定义页面名称
      window._paq.push(["setDocumentTitle", this.allBase.dbname]);
    }, 1000);
  },
  mounted() {
    this.inputPopMouseleave(this);
    Store.dispatch("Newdrug/getBaseInfo");
  },
};
</script>

<style lang="less" scoped>
@import "~@/assets/less/var.less";
@import "~@/assets/less/detailCom.less";

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
  width: 100%;
}
.left-top {
  width: auto !important;
}
</style>
