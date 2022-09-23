<template>
  <div class="detail-items">
    <!-- API信息 -->
    <div class="detail-item">
      <div class="item-title">
        <span class="text"
          >药品说明书<span class="num" v-if="isEnd">{{ allCount }}</span></span
        >
      </div>

      <div style="padding: 0 10px 10px 10px">
        <!-- 中国 -->
        <div v-show="chinaData.count">
          <div class="tabs mt12">
            <img class="flag" src="/static/imgs/state/icons/China.png" />
            <span class="tab-pane active">
              中国
              <span class="num" v-if="chinaData.count">{{ chinaData.count }}</span>
            </span>
            <span
              class="export"
              v-if="!instruct"
              @click="maxTotal(exportUrl, chinaData.count, 1)"
            >
              <i class="iconfont">&#xe605;</i> 导出
            </span>
          </div>
          <!-- 自定义加载界面 -->
          <LoadingGif
            :className="'list-in-loading'"
            :classNameImg="'little-size-loading'"
            :loadFlag="loading1"
            v-if="loading1"
            :delayTime="0"
          ></LoadingGif>
          <pdfTable
            v-else-if="instruct"
            :headerList="tableHead"
            :dataList="chinaData.res"
          />
          <!-- 加载完成显示部分 -->
          <el-table
            :data="chinaData.res"
            stripe
            fixed
            border
            class="table"
            style="width: 100%"
            v-else
          >
            <el-table-column
              v-for="item in tableHead"
              :prop="item.prop"
              :min-width="item.width"
              :key="item.prop"
              :label="item.label"
              align="center"
            >
              <template slot-scope="scope">
                <div v-if="item.prop === 'name'">
                  <!-- downcheck为0或3 -->
                  <router-link
                    tag="a"
                    class="cl-blue"
                    :to="'/instruct/' + scope.row.id"
                    target="_blank"
                    v-if="scope.row.xiangqing == 1"
                    >{{ scope.row.name }}</router-link
                  >
                  <!-- downcheck不为0且不为3 -->
                  <span v-else>{{ scope.row.name || "/" }}</span>
                </div>
                <!-- 这里本来是改成zuixinxiugairi的，但后端把zuixinxiugairi的数据替换到date上了，所以无需改动 -->
                <div v-if="item.prop === 'date'">
                  {{ scope.row.date || "/" }}
                </div>
                <div v-if="item.prop === 'source'">
                  {{ scope.row.source || "/" }}
                </div>
                <div v-if="item.prop === 'download'">
                  <!-- <a :href="scope.row.down" v-if="scope.row.down" target="_blank"><i class="el-icon-download"></i></a> -->
                  <div class="download">
                    <div
                      style="padding-left: 10px"
                      v-if="
                        scope.row.down.length === 1 && scope.row.down[0] === ''
                      "
                    >
                      /
                    </div>
                    <template v-else>
                      <!-- 内部资源 zy.yaozh.com -->
                      <template v-if="scope.row.tb == 1 || scope.row.tb == 2">
                        <template v-if="scope.row.down.length == 1">
                          <a
                            :href="dd"
                            class="fujian"
                            target="_blank"
                            v-for="(dd, index) in scope.row.down"
                            :key="index"
                          >
                            <i class="iconfont download-icon">&#xe62c;</i>
                          </a>
                        </template>
                        <template v-else>
                          <div v-if="scope.row.down">
                            <i class="iconfont download-icon">&#xe62c;</i>
                            <div class="fujian-cl">
                              <a
                                :href="dd"
                                class="fujian"
                                target="_blank"
                                v-for="(dd, index) in scope.row.down"
                                :key="index"
                                v-html="'下载' + (index + 1)"
                              ></a>
                            </div>
                          </div>
                          <span v-else>/</span>
                        </template>
                      </template>
                      <!-- 外部资源 -->
                      <template v-if="scope.row.tb == 3">
                        <a
                          v-if="scope.row.down"
                          :href="scope.row.down"
                          class="fujian"
                          target="_blank"
                        >
                          <i class="iconfont download-icon">&#xe62c;</i>
                        </a>
                        <span v-else>/</span>
                      </template>
                    </template>
                  </div>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            v-if="chinaData.count > 10 && !instruct"
            layout="total, prev, pager, next"
            @current-change="handleCurrentChange($event, 1)"
            :current-page="param.page"
            :page-size="param.pageSize"
            :total="chinaData.count"
          >
          </el-pagination>
        </div>

        <!-- 日本 -->
        <div v-show="jpData.count">
          <div class="tabs mt12">
            <img class="flag" src="/static/imgs/state/icons/Japan.png" />
            <span class="tab-pane active">
              日本
              <span class="num" v-if="jpData.count">{{ jpData.count }}</span>
            </span>
            <span
              class="export"
              v-if="!instruct"
              @click="maxTotal(exportUrl, jpData.count, 2)"
            >
              <i class="iconfont">&#xe605;</i> 导出
            </span>
          </div>
          <!-- 自定义加载界面 -->
          <LoadingGif
            :className="'list-in-loading'"
            :classNameImg="'little-size-loading'"
            :loadFlag="loading1"
            v-if="loading1"
            :delayTime="0"
          ></LoadingGif>
          <pdfTable
            v-else-if="instruct"
            :headerList="tableHead"
            :dataList="jpData.res"
          />
          <!-- 加载完成显示部分 -->
          <el-table
            :data="jpData.res"
            stripe
            fixed
            border
            class="table"
            style="width: 100%"
            v-else
          >
            <el-table-column
              v-for="item in tableHead"
              :prop="item.prop"
              :min-width="item.width"
              :key="item.prop"
              :label="item.label"
              align="center"
            >
              <template slot-scope="scope">
                <div v-if="item.prop === 'name'">
                  <!-- downcheck为0或3 -->
                  <router-link
                    tag="a"
                    class="cl-blue"
                    :to="'/instruct/' + scope.row.id"
                    target="_blank"
                    v-if="scope.row.xiangqing == 1"
                    >{{ scope.row.name }}</router-link
                  >
                  <!-- downcheck不为0且不为3 -->
                  <span v-else>{{ scope.row.name || "/" }}</span>
                </div>
                <!-- 这里本来是改成zuixinxiugairi的，但后端把zuixinxiugairi的数据替换到date上了，所以无需改动 -->
                <div v-if="item.prop === 'date'">
                  {{ scope.row.date || "/" }}
                </div>
                <div v-if="item.prop === 'source'">
                  {{ scope.row.source || "/" }}
                </div>
                <div v-if="item.prop === 'download'">
                  <!-- <a :href="scope.row.down" v-if="scope.row.down" target="_blank"><i class="el-icon-download"></i></a> -->
                  <div class="download">
                    <div
                      style="padding-left: 10px"
                      v-if="
                        scope.row.down.length === 1 && scope.row.down[0] === ''
                      "
                    >
                      /
                    </div>
                    <template v-else>
                      <!-- 内部资源 zy.yaozh.com -->
                      <template v-if="scope.row.tb == 1 || scope.row.tb == 2">
                        <template v-if="scope.row.down.length == 1">
                          <a
                            :href="dd"
                            class="fujian"
                            target="_blank"
                            v-for="(dd, index) in scope.row.down"
                            :key="index"
                          >
                            <i class="iconfont download-icon">&#xe62c;</i>
                          </a>
                        </template>
                        <template v-else>
                          <i class="iconfont download-icon">&#xe62c;</i>
                          <div class="fujian-cl">
                            <a
                              :href="dd"
                              class="fujian"
                              target="_blank"
                              v-for="(dd, index) in scope.row.down"
                              :key="index"
                              v-html="'下载' + (index + 1)"
                            ></a>
                          </div>
                        </template>
                      </template>
                      <!-- 外部资源 -->
                      <template v-if="scope.row.tb == 3">
                        <a
                          :href="scope.row.down"
                          class="fujian"
                          target="_blank"
                        >
                          <i class="iconfont download-icon">&#xe62c;</i>
                        </a>
                      </template>
                    </template>
                  </div>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            v-if="jpData.count > 10 && !instruct"
            layout="total, prev, pager, next"
            @current-change="handleCurrentChange($event, 2)"
            :current-page="param.page"
            :page-size="param.pageSize"
            :total="jpData.count"
          >
          </el-pagination>
        </div>

        <!-- 美国 -->
        <div v-show="fdaData.count">
          <div class="tabs mt12">
            <img
              class="flag"
              src="/static/imgs/state/icons/United States of America.png"
            />
            <span class="tab-pane active">
              美国
              <span class="num" v-if="fdaData.count">{{ fdaData.count }}</span>
            </span>
            <span
              class="export"
              v-if="!instruct"
              @click="maxTotal(exportUrl, fdaData.count, 3)"
            >
              <i class="iconfont">&#xe605;</i> 导出
            </span>
          </div>
          <!-- 自定义加载界面 -->
          <LoadingGif
            :className="'list-in-loading'"
            :classNameImg="'little-size-loading'"
            :loadFlag="loading1"
            v-if="loading1"
            :delayTime="0"
          ></LoadingGif>
          <pdfTable
            v-else-if="instruct"
            :headerList="tableHead"
            :dataList="fdaData.res"
          />
          <!-- 加载完成显示部分 -->
          <el-table
            :data="fdaData.res"
            stripe
            fixed
            border
            class="table"
            style="width: 100%"
            v-else
          >
            <el-table-column
              v-for="item in tableHead"
              :prop="item.prop"
              :min-width="item.width"
              :key="item.prop"
              :label="item.label"
              align="center"
            >
              <template slot-scope="scope">
                <div v-if="item.prop === 'name'">
                  <!-- downcheck为0或3 -->
                  <router-link
                    tag="a"
                    class="cl-blue"
                    :to="'/instruct/' + scope.row.id"
                    target="_blank"
                    v-if="scope.row.xiangqing == 1"
                    >{{ scope.row.name }}</router-link
                  >
                  <!-- downcheck不为0且不为3 -->
                  <span v-else>{{ scope.row.name || "/" }}</span>
                </div>
                <!-- 这里本来是改成zuixinxiugairi的，但后端把zuixinxiugairi的数据替换到date上了，所以无需改动 -->
                <div v-if="item.prop === 'date'">
                  {{ scope.row.date || "/" }}
                </div>
                <div v-if="item.prop === 'source'">
                  {{ scope.row.source || "/" }}
                </div>
                <div v-if="item.prop === 'download'">
                  <!-- <a :href="scope.row.down" v-if="scope.row.down" target="_blank"><i class="el-icon-download"></i></a> -->
                  <div class="download">
                    <div
                      style="padding-left: 10px"
                      v-if="
                        scope.row.down.length === 1 && scope.row.down[0] === ''
                      "
                    >
                      /
                    </div>
                    <template v-else>
                      <!-- 内部资源 zy.yaozh.com -->
                      <template v-if="scope.row.tb == 1 || scope.row.tb == 2">
                        <template v-if="scope.row.down.length == 1">
                          <a
                            :href="dd"
                            class="fujian"
                            target="_blank"
                            v-for="(dd, index) in scope.row.down"
                            :key="index"
                          >
                            <i class="iconfont download-icon">&#xe62c;</i>
                          </a>
                        </template>
                        <template v-else>
                          <i class="iconfont download-icon">&#xe62c;</i>
                          <div class="fujian-cl">
                            <a
                              :href="dd"
                              class="fujian"
                              target="_blank"
                              v-for="(dd, index) in scope.row.down"
                              :key="index"
                              v-html="'下载' + (index + 1)"
                            ></a>
                          </div>
                        </template>
                      </template>
                      <!-- 外部资源 -->
                      <template v-if="scope.row.tb == 3">
                        <a
                          :href="scope.row.down"
                          class="fujian"
                          target="_blank"
                        >
                          <i class="iconfont download-icon">&#xe62c;</i>
                        </a>
                      </template>
                    </template>
                  </div>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            v-if="fdaData.count > 10 && !instruct"
            layout="total, prev, pager, next"
            @current-change="handleCurrentChange($event, 3)"
            :current-page="param.page"
            :page-size="param.pageSize"
            :total="fdaData.count"
          >
          </el-pagination>
        </div>

        <!-- 超说明书 -->
        <div v-show="unData.count">
          <div class="tabs mt12">
            <span class="tab-pane active">
              超说明书
              <span class="num" v-if="unData.count">{{ unData.count }}</span>
            </span>
            <span
              class="export"
              v-if="!instruct"
              @click="maxTotal(exportUrl, unData.count, 4)"
            >
              <i class="iconfont">&#xe605;</i> 导出
            </span>
          </div>
          <!-- 自定义加载界面 -->
          <LoadingGif
            :className="'list-in-loading'"
            :classNameImg="'little-size-loading'"
            :loadFlag="loading1"
            v-if="loading1"
            :delayTime="0"
          ></LoadingGif>
          <pdfTable
            v-else-if="instruct"
            :headerList="tableHead"
            :dataList="unData.res"
          />
          <!-- 加载完成显示部分 -->
          <el-table
            :data="unData.res"
            stripe
            fixed
            border
            class="table"
            style="width: 100%"
            v-else
          >
            <el-table-column
              v-for="item in tableHead"
              :prop="item.prop"
              :min-width="item.width"
              :key="item.prop"
              :label="item.label"
              align="center"
            >
              <template slot-scope="scope">
                <div v-if="item.prop === 'name'">
                  <!-- downcheck为0或3 -->
                  <router-link
                    tag="a"
                    class="cl-blue"
                    :to="'/instruct/' + scope.row.id"
                    target="_blank"
                    v-if="scope.row.xiangqing == 1"
                    >{{ scope.row.name }}</router-link
                  >
                  <!-- downcheck不为0且不为3 -->
                  <span v-else>{{ scope.row.name || "/" }}</span>
                </div>
                <!-- 这里本来是改成zuixinxiugairi的，但后端把zuixinxiugairi的数据替换到date上了，所以无需改动 -->
                <div v-if="item.prop === 'date'">
                  {{ scope.row.date || "/" }}
                </div>
                <div v-if="item.prop === 'source'">
                  {{ scope.row.source || "/" }}
                </div>
                <div v-if="item.prop === 'download'">
                  <!-- <a :href="scope.row.down" v-if="scope.row.down" target="_blank"><i class="el-icon-download"></i></a> -->
                  <div class="download">
                    <div
                      style="padding-left: 10px"
                      v-if="
                        scope.row.down.length === 1 && scope.row.down[0] === ''
                      "
                    >
                      /
                    </div>
                    <template v-else>
                      <!-- 内部资源 zy.yaozh.com -->
                      <template v-if="scope.row.tb == 1 || scope.row.tb == 2">
                        <template v-if="scope.row.down.length == 1">
                          <a
                            :href="dd"
                            class="fujian"
                            target="_blank"
                            v-for="(dd, index) in scope.row.down"
                            :key="index"
                          >
                            <i class="iconfont download-icon">&#xe62c;</i>
                          </a>
                        </template>
                        <template v-else>
                          <i class="iconfont download-icon">&#xe62c;</i>
                          <div class="fujian-cl">
                            <a
                              :href="dd"
                              class="fujian"
                              target="_blank"
                              v-for="(dd, index) in scope.row.down"
                              :key="index"
                              v-html="'下载' + (index + 1)"
                            ></a>
                          </div>
                        </template>
                      </template>
                      <!-- 外部资源 -->
                      <template v-if="scope.row.tb == 3">
                        <a
                          :href="scope.row.down"
                          class="fujian"
                          target="_blank"
                        >
                          <i class="iconfont download-icon">&#xe62c;</i>
                        </a>
                      </template>
                      <template v-if="scope.row.tb == 4">
                        <a
                          v-if="scope.row.down"
                          :href="scope.row.down"
                          class="fujian"
                          target="_blank"
                        >
                          <i class="iconfont download-icon">&#xe62c;</i>
                        </a>
                        <span v-else>/</span>
                      </template>
                    </template>
                  </div>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            v-if="unData.count > 10 && !instruct"
            layout="total, prev, pager, next"
            @current-change="handleCurrentChange($event, 4)"
            :current-page="param.page"
            :page-size="param.pageSize"
            :total="unData.count"
          >
          </el-pagination>
        </div>
      </div>
    </div>
    <DetailKzxx v-if="showKZXX()" :extendList="extendList"></DetailKzxx>
  </div>
</template>

<script>
import LoadingGif from "@/components/common/globalCom/loading-gif";
import pdfTable from "../pdfReport/table";
import tablehead from "@/config/tablehead";
import DetailKzxx from "./kzxx";
const tableFiled = tablehead.drugreport.instruct;

export default {
  components: {
    LoadingGif,
    pdfTable,
    DetailKzxx,
  },
  props: {
    extendList: Array,
    /* res:{
        type:Object,
      }, */
    ylbm: {
      type: String,
    },
    instruct: {
      type: Object | Array,
    },
    jspdf: {
      type: Boolean,
    },
  },
  data() {
    return {
      chinaData: {
        res: [],
      },
      jpData: {
        res: [],
      },
      fdaData: {
        res: [],
      },
      unData: {
        res: [],
      },
      res: {},
      tableHead: tableFiled,
      exportUrl: "/api/report/instruct?outdata=1",
      loading1: true,
      nodata: false,
      param: {
        pageSize: 10,
        page: 1,
      },
      isEnd: false,
      allCount: null,
    };
  },
  created() {
    this.loadData(1);
    this.loadData(2);
    this.loadData(3);
    this.loadData(4);
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
    loadData(tb) {
      if (tb == 1) {
        this.isEnd = false;
        this.allCount = 0;
      }
      return window
        .Axios({
          method: "get",
          url: "/api/report/instruct",
          params: _.assign(
            {},
            { ylbm: this.ylbm, tb, accesstoken: GETCOOKIEFUN("accesstoken") },
            this.param
          ),
        })
        .then((res) => {
          if (res.data.code == 404) {
            this.nodata = true;
          } else if (res.data.code == 200) {
            this.nodata = false;
            console.log(this.allCount);
            switch (tb) {
              case 1:
                this.chinaData = res.data.data;
                this.allCount += res.data.data.count;
                console.log(this.chinaData);
                break;
              case 2:
                this.jpData = res.data.data;
                this.allCount += res.data.data.count;
                break;
              case 3:
                this.fdaData = res.data.data;
                this.allCount += res.data.data.count;
                break;
              case 4:
                this.unData = res.data.data;
                this.allCount += res.data.data.count;
                this.isEnd = true;
                break;
            }
          } else {
            this.nodata = true;
          }
          this.loading1 = false;
        });
    },
    //总数超过1000提示
    maxTotal(url, total, tb) {
      url = url + "&tb=" + tb;
      if (total > 1000) {
        this.$Confirm(
          "导出",
          `当前数据量为<span class="cl-red">${total}</span>条，最大导出量为<span class="cl-red">1000</span>条，是否导出？`,
          () => {
            this.handleExport(url);
          }
        );
      } else {
        this.handleExport(url);
      }
    },
    handleExport(url) {
      window.open(
        url +
          "&ylbm=" +
          this.ylbm +
          "&accesstoken=" +
          GETCOOKIEFUN("accesstoken")
      );
    },
    handleCurrentChange(val, tb) {
      this.loading1 = true;
      this.param.page = val;
      this.loadData(tb);
    },
  },
};
</script>

<style lang="less" scoped>
@import "~@/assets/less/var.less";
@import "../css/com.less";

.download {
  position: relative;
  &:hover {
    .download-icon {
      transition: all 100ms;
      background-color: @PrimaryColor;
      color: #fff;
    }
    .fujian-cl {
      transition: all 500ms;
      transform: translateX(0px);
      width: auto;
      opacity: 1;
    }
  }
  .download-icon {
    transition: all 100ms;
    z-index: 10;
    display: inline-block;
    position: relative;
    // top: 0px;
    // right: 0px;
    width: 26px;
    height: 26px;
    line-height: 26px;
    background-color: #fff;
    color: @PrimaryColor;
    font-size: 12px;
    text-align: center;
    border-radius: 13px;
    font-size: 16px;
  }
  .fujian-cl {
    transition: all 500ms;
    transform: translateX(-10px);
    z-index: 9;
    opacity: 0;
    position: absolute;
    left: 30px;
    top: 0px;
    width: 0px;
    max-width: 144px;
    max-height: 20px;
    border-radius: 10px;
    margin-top: 3px;
    background-color: @GrayBackgroundColor;
    overflow: hidden;
    display: flex;
    justify-content: flex-start;
    flex-wrap: nowrap;
    .fujian {
      min-width: 44px;
      height: 20px;
      line-height: 20px;
      font-size: 12px;
      text-align: center;
      cursor: pointer;
      &:hover {
        color: @PrimaryColor;
      }
    }
  }
}
/deep/.el-table tbody td .cell {
  padding: 8px 0 8px 14px !important;
  line-height: 18px !important;
}
.tabs {
  position: relative;
  height: 30px;
  width: auto;
  padding: 0 0 10px 20px;
  font-size: 14px;
  line-height: 30px;
  .flag {
    vertical-align: middle;
  }
  .tab-pane {
    padding: 0px 10px;
    color: @PrimaryColor;
    .num {
      padding: 1px 5px;
      margin-left: 5px;
      border-radius: 15px;
      border: 1px solid @PrimaryColor;
    }
  }
  .export {
    position: absolute;
    right: 0px;
    display: inline-block;
    width: 66px;
    height: 24px;
    line-height: 24px;
    background: #4877E8;
    border-radius: 4px;
    font-size: 14px;
    color: #fff;
    text-align: center;
    margin-bottom: 10px;
    cursor: pointer;
  }
}
.china_content {
  .el-table {
    .el-table__header-wrapper {
      padding-left: 34px !important;
      background-color: #eaeef9;
    }
    th {
      padding-left: 35px;
    }
    .cell {
      padding-left: 35px;
    }
    .el-table__body-wrapper {
      .el-table__body {
        .el-table__row td {
          padding-left: 34px !important;
        }
      }
    }
  }
}
.us_content {
  .el-table {
    // padding-left: 35px;
    .el-table__header-wrapper {
      padding-left: 34px !important;
      background-color: #eaeef9;
    }
  }
}
// .detail-items {
//   padding-bottom: 10px !important;
// }

.mt12 {
  margin-top: 12px;
}

.mt20 {
  margin-top: 20px;
}
</style>
