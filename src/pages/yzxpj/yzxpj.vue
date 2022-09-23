<template>
  <div id="yzxpj">
    <LoadingGif :loadFlag="isLoading" v-if="isLoading"></LoadingGif>
    <full-screen
      :nowNav="nowNav"
      :navs="navs"
      @changeNowNav="changeNowNav"
      :titles="'一致性评价进度'"
    >
      <div slot="back">
        <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item ><a href="/home">首页</a></el-breadcrumb-item>
          <el-breadcrumb-item>一致性评价</el-breadcrumb-item>
          <el-breadcrumb-item><a href="" class="pointer">一致性评价进度</a></el-breadcrumb-item>
        </el-breadcrumb> -->
        <div class="conf-log" style="display: flex; align-items: center">
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

          <el-breadcrumb
            separator-class="el-icon-arrow-right"
            v-if="allBase.dbname"
          >
            <el-breadcrumb-item><a href="/home">首页</a></el-breadcrumb-item>
            <el-breadcrumb-item>{{ allBase.dbname }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </div>
      <div class="content-box" :slot="nowNav">
        <!-- 无权限提示 -->
        <div
          class="detail-nopms"
          v-if="
            (nopms.nametimeline && nowNav == '药品分析') ||
            (nopms.companytimeline && nowNav == '企业分析')
          "
        >
          <div class="detail-nopms-describe">
            <img src="/static/imgs/zhuce/nopms_icon.jpg" />
            <p>对不起，您暂无该功能权限，需升级权限享用更多功能。</p>
            <p>
              请你联系客服
              <span class="cl-orange fs16 fw-bold">400-678-0778</span>
            </p>
          </div>
        </div>
        <div v-else>
          <div class="search-box">
            {{ nowData.searchLabel }}：
            <el-autocomplete
              v-model="nowData.searchVal"
              clearable
              :fetch-suggestions="nowData.fetchSuggestions"
              :debounce="800"
              :trigger-on-focus="false"
              :popper-append-to-body="false"
              popper-class="yzxpj-autocomplete-class"
              @select="nowData.searchSelect"
              suffix-icon="el-icon-search"
              ref="popoverAutoInput"
            >
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

            <span style="margin-left: 20px">
              分类：
              <Select
                v-show="nowNav === '药品分析'"
                @change="getYpfxData"
                v-model="nameTps"
                :option="tpsOption"
                autoWidth
              />
              <Select
                v-show="nowNav === '企业分析'"
                @change="getQyfxData"
                v-model="companyTps"
                :option="tpsOption"
                autoWidth
              />
            </span>
          </div>
          <div class="jd-box ma tc">
            <div class="fs20">
              <span class="cl-blue fb">{{ nowData.titleName }}</span
              >一致性评价进度
            </div>
            <div class="yzxpj-tag-wrap">
              <div class="yzxpj-tag-item">
                <i class="yzxpj-i-blue"></i><span>一致性评价品种</span>
              </div>
              <div class="yzxpj-tag-item">
                <i class="yzxpj-i-green"></i><span>新注册分类仿制药</span>
              </div>
            </div>
            <!-- 标题 -->
            <ul class="column-title clearfix fs13">
              <li v-for="title in nowData.columnTitle" :key="title">
                {{ title }}
                <el-tooltip
                  class=""
                  effect="zhuce"
                  placement="right"
                  v-if="title == '发件'"
                >
                  <div slot="content">
                    日期为已发件状态<br />日期加结论为批准/不批准状态
                  </div>
                  <i
                    class="el-icon-question cl-green"
                    style="margin-left: 4px"
                  ></i>
                </el-tooltip>
              </li>
            </ul>
            <!-- 内容 -->
            <ul class="data-list">
              <li
                v-for="(obj, index) in nowData.showList"
                :key="index"
                :class="{ 'yzxpj-ul-green': obj.type === 2 }"
              >
                <ul class="clearfix">
                  <li
                    v-for="(value, index) in nowData.columnField"
                    :key="value"
                    :class="{ nodata: !obj[nowData.columnField[index]] }"
                    :title="obj[nowData.columnField[index]]"
                  >
                    {{ overflowEclips(obj[nowData.columnField[index]], 20) }}
                    <span
                      v-if="index === nowData.columnField.length - 1"
                      class="patch"
                    ></span>
                  </li>
                </ul>
              </li>
              <div
                style="line-height: 50px"
                v-if="nowData.showList.length === 0"
              >
                暂无数据
              </div>
            </ul>
          </div>
          <!-- 页码 -->
          <el-pagination
            v-if="nowData.showList.length > 0"
            @current-change="nowData.handleCurrentChange"
            :current-page="nowData.currentPage"
            layout="total, prev, pager, next"
            :page-size="20"
            :total="nowData.dataTotal"
          >
          </el-pagination>
        </div>
      </div>
    </full-screen>
  </div>
</template>

<script>
import LoadingGif from "@/components/common/globalCom/loading-gif";
import FullScreen from "@/components/common/full-screen";
import Select from "@/components/inputs/select";
import { mapState } from "vuex";

export default {
  components: {
    LoadingGif,
    FullScreen,
    Select,
  },
  data() {
    return {
      nowNav: "药品分析",
      navs: ["药品分析", "企业分析"],
      pageSize: 20, // 每页数据量
      ypfx: {
        searchLabel: "药品名称",
        searchVal: this.$route.query.ypname || "苯磺酸氨氯地平片",
        titleName: "", // 大标题的值不能跟随 searchVal 双向绑定，需要手动修改
        fetchSuggestions: this.ypfxFetchSuggestions,
        searchSelect: this.ypfxSearchSelect,
        handleCurrentChange: this.ypfxCurrentPage,
        currentPage: 1,
        dataTotal: 0,
        columnTitle: [
          "企业名称",
          "参比备案",
          "BE备案",
          "开展BE",
          "完成BE",
          "申报",
          "发件",
        ],
        columnField: [
          "company",
          "cbdate",
          "bedate",
          "czdate_all",
          "wcdate_all",
          "sbdate",
          "pzdate",
        ],
        list: [],
      },
      qyfx: {
        searchLabel: "企业名称",
        searchVal: this.$route.query.qyname || "国药集团容生制药有限公司",
        titleName: "", // 大标题的值不能跟随 searchVal 双向绑定，需要手动修改
        fetchSuggestions: this.qyfxFetchSuggestions,
        searchSelect: this.qyfxSearchSelect,
        handleCurrentChange: this.qyfxCurrentPage,
        currentPage: 1,
        dataTotal: 0,
        columnTitle: [
          "药品名称",
          "参比备案",
          "BE备案",
          "开展BE",
          "完成BE",
          "申报",
          "发件",
        ],
        columnField: [
          "name",
          "cbdate",
          "bedate",
          "czdate_all",
          "wcdate_all",
          "sbdate",
          "pzdate",
        ],
        list: [],
      },
      isLoading: true,
      nameTps: "0",
      companyTps: "0",
      tpsOption: [
        { label: "全部", value: "0" },
        { label: "一致性评价品种", value: "1" },
        { label: "新注册分类仿制药", value: "2" },
      ],
    };
  },
  computed: {
    ...mapState({
      allBase: (state) => state.Yzxpj.allBase,
      helpInfo: (state) => state.Yzxpj.helpInfo,
      nopms: (state) => state.Yzxpj.nopms,
      norules: (state) => state.Yzxpj.norules,
      update_conf: (state) => state.Yzxpj.update_conf,
      showPromtNotice: (state) => state.showPromtNotice,
    }),
    nowData() {
      return {
        药品分析: Object.assign(this.ypfx, {
          showList: this.ypfxCurrentList,
        }),
        企业分析: Object.assign(this.qyfx, {
          showList: this.qyfxCurrentList,
        }),
      }[this.nowNav];
    },
    // 分页当前展示的数据
    ypfxCurrentList() {
      return this.ypfx.list.slice(
        this.ypfx.currentPage * this.pageSize - this.pageSize,
        this.ypfx.currentPage * this.pageSize
      );
    },
    qyfxCurrentList() {
      return this.qyfx.list.slice(
        this.qyfx.currentPage * this.pageSize - this.pageSize,
        this.qyfx.currentPage * this.pageSize
      );
    },
  },
  watch: {
    showPromtNotice: {
      handler(val) {
        document.querySelector(".fs-dialog").style.top = val ? "30px" : "0px";
      },
    },
  },
  methods: {
    // 切换左侧的导航
    changeNowNav(name) {
      this.nowNav = name;

      if (name === "药品分析" && this.ypfx.list.length === 0) {
        if (!this.nopms.nametimeline) {
          this.isLoading = true;
          this.ypfxFetchData(this.ypfx.searchVal)
            .then((res) => {
              if (res) {
                this.ypfx.list = res;
                this.ypfx.dataTotal = res.length;
                this.ypfx.titleName = this.ypfx.searchVal;
              }
              this.isLoading = false;
            })
            .catch(() => {
              this.isLoading = false;
            });
        }
      } else if (name === "企业分析" && this.qyfx.list.length === 0) {
        if (!this.nopms.companytimeline) {
          this.isLoading = true;
          this.qyfxFetchData(this.qyfx.searchVal)
            .then((res) => {
              if (res) {
                this.qyfx.list = res;
                this.qyfx.dataTotal = res.length;
                this.qyfx.titleName = this.qyfx.searchVal;
              }
              this.isLoading = false;
            })
            .catch(() => {
              this.isLoading = false;
            });
        }
      }
    },
    // 搜索输入触发函数
    ypfxFetchSuggestions(qs, cb) {
      if (qs.trim()) {
        this.ypfxFetchRemoteData(qs).then((res) => {
          if (res) {
            cb(
              res.reduce((sum, item) => {
                return (
                  sum.push({
                    value: item,
                  }) && sum
                );
              }, [])
            );
          } else {
            cb([]);
          }
        });
      }
    },
    qyfxFetchSuggestions(qs, cb) {
      if (qs.trim()) {
        this.qyfxFetchRemoteData(qs).then((res) => {
          if (res) {
            cb(
              res.reduce((sum, item) => {
                return (
                  sum.push({
                    value: item,
                  }) && sum
                );
              }, [])
            );
          } else {
            cb([]);
          }
        });
      }
    },
    // 远程搜索数据请求
    ypfxFetchRemoteData(name) {
      return Axios.get("/api/yzxjd/input", {
        params: {
          name: name,
          accesstoken: this.vueGetCookie("accesstoken"),
        },
      })
        .then((res) => {
          if (res.status === 200 && res.data.data.length) {
            return res.data.data;
          }
          return false;
        })
        .catch((err) => {
          console.error(err);
        });
    },
    qyfxFetchRemoteData(company) {
      return Axios.get("/api/yzxjd/input", {
        params: {
          company: company,
          accesstoken: this.vueGetCookie("accesstoken"),
        },
      })
        .then((res) => {
          if (res.status === 200 && res.data.data.length) {
            return res.data.data;
          }
          return false;
        })
        .catch((err) => {
          console.error(err);
        });
    },
    // 远程搜索 select 选择
    ypfxSearchSelect(item) {
      if (item.value != this.ypfx.titleName) {
        if (!this.nopms.nametimeline) {
          this.getYpfxData(item);
        }
      }
    },
    getYpfxData(item) {
      this.isLoading = true;
      this.ypfx.currentPage = 1;
      this.ypfxFetchData(this.ypfx.searchVal)
        .then((res) => {
          if (res) {
            this.ypfx.list = res;
            this.ypfx.dataTotal = res.length;
            this.ypfx.titleName = item.value;
          }
          this.isLoading = false;
        })
        .catch(() => {
          this.isLoading = false;
        });
    },
    getQyfxData(item) {
      this.isLoading = true;
      this.qyfx.currentPage = 1;
      this.qyfxFetchData(this.qyfx.searchVal)
        .then((res) => {
          if (res) {
            this.qyfx.list = res;
            this.qyfx.dataTotal = res.length;
            this.qyfx.titleName = item.value;
          }
          this.isLoading = false;
        })
        .catch(() => {
          this.isLoading = false;
        });
    },
    qyfxSearchSelect(item) {
      if (item.value != this.qyfx.titleName) {
        if (!this.nopms.companytimeline) {
          this.getQyfxData(item);
        }
      }
    },
    // 远程数据请求
    ypfxFetchData(name, comprehensive, searchwords) {
      return Axios.get("/api/yzxjd/nametimeline", {
        params: this.keywordStatistics(
          {
            name: name,
            comprehensive: comprehensive,
            searchwords: searchwords,
            tps: this.nameTps,
            accesstoken: GETCOOKIEFUN("accesstoken"),
          },
          { name: "药品名称", tps: { label: "分类", option: this.tpsOption } }
        ),
      })
        .then((res) => {
          if (res.status == 200) {
            return res.data.data.res;
          }
          return false;
        })
        .catch((err) => {
          console.error(err);
        });
    },
    qyfxFetchData(company, comprehensive, searchwords) {
      return Axios.get("/api/yzxjd/companytimeline", {
        params: this.keywordStatistics(
          {
            company: company,
            comprehensive: comprehensive,
            searchwords: searchwords,
            tps: this.companyTps,
            accesstoken: GETCOOKIEFUN("accesstoken"),
          },
          {
            company: "企业名称",
            tps: { label: "分类", option: this.tpsOption },
          }
        ),
      })
        .then((res) => {
          if (res.status == 200) {
            return res.data.data.res;
          }
          return false;
        })
        .catch((err) => {
          console.error(err);
        });
    },
    // 页码切换事件
    ypfxCurrentPage(page) {
      this.ypfx.currentPage = page;
    },
    qyfxCurrentPage(page) {
      this.qyfx.currentPage = page;
    },
  },
  created() {
    // 如果是从综合搜索点击过来的
    // comprehensive 有可能是 company 或者 drug等。
    let comprehensive = "drug";
    if (this.$route.query.comprehensive) {
      comprehensive = this.$route.query.comprehensive;
      if (comprehensive === "drug") {
        this.ypfx.searchVal = this.$route.query.searchwords;
      } else if (comprehensive === "company") {
        this.qyfx.searchVal = this.$route.query.searchwords;
      }
    }

    if (this.$route.query.qyname) {
      if (!this.nopms.companytimeline) {
        this.nowNav = "企业分析";
        this.qyfx.searchVal = this.$route.query.qyname;
        this.qyfxFetchData(this.qyfx.searchVal).then((res) => {
          if (res) {
            this.qyfx.list = res;
            this.qyfx.dataTotal = res.length;
            this.qyfx.titleName = this.qyfx.searchVal;
          }
          this.isLoading = false;
        });
      }
      return false;
    }

    // 根据 cookie
    var tmp = {
      drug: () => {
        Store.dispatch("Yzxpj/getBaseInfo").then(() => {
          if (!this.nopms.nametimeline) {
            // 初始化默认的药品分析数据
            this.ypfxFetchData(
              this.ypfx.searchVal,
              comprehensive,
              this.ypfx.searchVal
            ).then((res) => {
              if (res) {
                this.ypfx.list = res;
                this.ypfx.dataTotal = res.length;
                this.ypfx.titleName = this.ypfx.searchVal;
              }
              this.isLoading = false;
            });
          } else {
            this.isLoading = false;
          }
        });
      },
      company: () => {
        this.nowNav = "企业分析";
        Store.dispatch("Yzxpj/getBaseInfo").then(() => {
          if (!this.nopms.companytimeline) {
            // 初始化默认的药品分析数据
            this.qyfxFetchData(
              this.qyfx.searchVal,
              comprehensive,
              this.qyfx.searchVal
            ).then((res) => {
              if (res) {
                this.qyfx.list = res;
                this.qyfx.dataTotal = res.length;
                this.qyfx.titleName = this.qyfx.searchVal;
              }
              this.isLoading = false;
            });
          } else {
            this.isLoading = false;
          }
        });
      },
    }[comprehensive]();

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
    //let ypname = this.$route.query.ypname
  },
};
</script>

<style lang="less">
.yzxpj-autocomplete-class {
  .el-autocomplete-suggestion__wrap {
    border: 0;
  }
}
.pc-yzxjd {
  .la-menu {
    z-index: 1001;
  }
}

#yzxpj {
  .help-tip {
    padding-right: 10px;
  }

  .fs-dialog {
    min-width: 1280px;
  }

  .fullscreen-loading {
    z-index: 1001;
  }

  .el-autocomplete {
    width: auto;
  }
  .content-box {
    // height: calc(100% - 130px);
    .detail-nopms {
      width: 100%;
      height: 1025px;
      background: url(/static/imgs/yzxpj/name_before.jpg);
    }
  }
  .search-box {
    padding: 15px 18px;
    .el-input__icon.el-icon-search {
      line-height: normal;
    }
  }
  .jd-box {
    min-width: 1100px;
    max-width: 1204px;
    margin-top: 15px;
    overflow: auto;
    .column-title {
      background: #e1e6f0;
      margin-top: 14px;
      line-height: 32px;
      li {
        float: left;
        width: 172px;
      }
    }
    .data-list {
      > li {
        margin-top: 20px;
        &:first-child {
          margin-top: 14px;
        }
      }
      ul {
        li {
          float: left;
          width: 172px;
          height: 20px;
          &:first-child {
            text-align: left;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            box-sizing: border-box;
            padding: 0 10px;
          }
          &:not(:first-child):after {
            content: "";
            position: absolute;
            width: 19px;
            height: 20px;
            right: 0;
            background: url(/static/imgs/others/yzxjd-jt.png);
            z-index: 1;
          }
          &:nth-child(2) {
            position: relative;
            background: #e4ebfc;
            &:after {
              background-position: -100px 0;
            }
            &.nodata:before {
              display: none;
            }
          }
          &:nth-child(3) {
            position: relative;
            background: #c8d6f8;
            &:before {
              content: "";
              width: 19px;
              height: 20px;
              display: inline-block;
              background: #c8d6f8;
              position: absolute;
              left: -19px;
            }
            &:after {
              background-position: -120px 0;
            }
          }
          &:nth-child(4) {
            color: #fff;
            position: relative;
            background: #acc2f5;
            &:before {
              content: "";
              width: 19px;
              height: 20px;
              display: inline-block;
              background: #acc2f5;
              position: absolute;
              left: -19px;
            }
            &:after {
              background-position: -60px 0;
            }
          }
          &:nth-child(5) {
            color: #fff;
            position: relative;
            background: #91adf1;
            &:before {
              content: "";
              width: 19px;
              height: 20px;
              display: inline-block;
              background: #91adf1;
              position: absolute;
              left: -19px;
            }
            &:after {
              background-position: 0 0;
            }
          }
          &:nth-child(6) {
            color: #fff;
            position: relative;
            background: #638beb;
            &:before {
              content: "";
              width: 19px;
              height: 20px;
              display: inline-block;
              background: #638beb;
              position: absolute;
              left: -19px;
            }
            &:after {
              background-position: -20px 0;
            }
          }
          &:nth-child(7) {
            color: #fff;
            position: relative;
            background: #4877e8;
            &:before {
              content: "";
              width: 19px;
              height: 20px;
              display: inline-block;
              background: #4877e8;
              position: absolute;
              left: -19px;
            }
            &:after {
              background-position: -40px 0;
            }
            .patch {
              width: 19px;
              height: 20px;
              display: inline-block;
              background: #fff;
              position: absolute;
              right: 0;
            }
          }
          &.nodata {
            background: #f2f2f2;
            &:before {
              content: "";
              width: 19px;
              height: 20px;
              display: inline-block;
              background: #f2f2f2;
              position: absolute;
              left: -19px;
            }
            &:after {
              background-position: -80px 0;
            }
          }
        }
      }
      .yzxpj-ul-green {
        li {
          &:not(:first-child):after {
            background-image: url(/static/imgs/others/yzxjd-new.png);
          }
          &:nth-child(2) {
            background: #e3f0c7;
          }
          &:nth-child(3) {
            background: #d1e5ad;
            &:before {
              background: #d1e5ad;
            }
          }
          &:nth-child(4) {
            background: #c2de83;
            &:before {
              background: #c2de83;
            }
          }
          &:nth-child(5) {
            background: #b0d561;
            &:before {
              background: #b0d561;
            }
          }
          &:nth-child(6) {
            background: #a0cc40;
            &:before {
              background: #a0cc40;
            }
          }
          &:nth-child(7) {
            background: #8fc31e;
            &:before {
              background: #8fc31e;
            }
          }
          &.nodata {
            background: #f2f2f2;
            &:before {
              background: #f2f2f2;
            }
          }
        }
      }
    }
  }
}
.yzxpj-tag-wrap {
  text-align: right;
  .yzxpj-tag-item {
    display: inline-block;
    margin-left: 30px;
    span {
      display: inline-block;
      vertical-align: middle;
      height: 16px;
    }
    i {
      width: 12px;
      height: 12px;
      display: inline-block;
      vertical-align: middle;
      border-radius: 3px;
      margin-right: 6px;
    }
    .yzxpj-i-blue {
      background: #4877e8;
    }
    .yzxpj-i-green {
      background: #a0cc40;
    }
  }
}
@media screen and (min-device-width: 1026px) and (max-device-width: 1367px) {
  .fs-dialog .menu .nav {
    width: 140px;
  }
  .fs-dialog .right-wrap {
    width: calc(100% - 168px) !important;
    left: 168px;
  }
  #yzxpj .jd-box .column-title li {
    width: 155px;
  }
  #yzxpj .jd-box .data-list ul li {
    width: 155px;
  }
}
</style>

