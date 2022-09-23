<template>
  <div class="detail-items" id="sspz">
    <DetailPzlc :ylbm="ylbm" :jspdf="jspdf" :pizhunHis="pizhunHis"></DetailPzlc>
    <!-- API信息 -->
    <div class="detail-items" style="margin-top: 10px">
      <div class="detail-item">
        <div class="item-title">
          <span class="text">
            上市批准信息
            <!-- <span class="num">{{allCount}}</span> -->
          </span>
        </div>
        <div style="padding: 0 10px 10px 10px">
          <!-- 中国 -->
          <div v-show="chinaData.res.count">
            <div class="tabs">
              <img class="flag" src="/static/imgs/state/icons/China.png" />
              <span class="tab-pane">
                中国
                <span v-if="chinaData.res.count"
                  >({{ chinaData.res.count }})</span
                >

                <el-tooltip class="" effect="zhuce" placement="right">
                  <div slot="content">
                    <p>不含批文已过期数据。</p>
                  </div>
                  <i
                    class="el-icon-question cl-green"
                    style="margin-left: 4px; line-height: 28px"
                  ></i>
                </el-tooltip>
              </span>
              <span
                class="export"
                v-if="!sspzchina"
                @click="maxTotal(chinaData.exportUrl, chinaData.res.count)"
              >
                <i class="iconfont">&#xe605;</i> 导出
              </span>
            </div>
            <div class="china_content">
              <!-- 自定义加载界面 -->
              <LoadingGif
                :className="'list-in-loading'"
                :classNameImg="'little-size-loading'"
                :loadFlag="loading1"
                v-if="loading1"
                :delayTime="0"
              ></LoadingGif>
              <pdfTable
                v-else-if="sspzchina"
                :headerList="chinaData.tableHead"
                :dataList="chinaData.res.res"
              />
              <!-- 加载完成显示部分 -->
              <el-table
                :data="chinaData.res.res"
                stripe
                fixed
                border
                class="table"
                style="width: 100%"
                v-else
              >
                <el-table-column
                  v-for="item in chinaData.tableHead"
                  :prop="item.prop"
                  :min-width="item.width"
                  :key="item.prop"
                  :label="item.label"
                  align="center"
                >
                  <template slot-scope="scope">
                    <div v-if="item.prop === 'drugid'">
                      <router-link
                        tag="a"
                        class="cl-blue"
                        :to="
                          '/cfdadrug/' +
                          (scope.row.link.tp == 1
                            ? 'detail'
                            : 'jkdetail/' +
                              scope.row.link.id +
                              '?pizhunwenhao=' +
                              scope.row.drugid)
                        "
                        target="_blank"
                        >{{ scope.row.drugid || "/" }}</router-link
                      >
                    </div>
                    <div v-else>
                      {{ scope.row[item.prop] || "/" }}
                    </div>
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination
                v-if="chinaData.res.count > 10 && !sspzchina"
                layout="total, prev, pager, next"
                @current-change="cnCurrentChange"
                :current-page="cnParam.page"
                :page-size="cnParam.pageSize"
                :total="chinaData.res.count"
              ></el-pagination>
            </div>
          </div>

          <div class="line" v-if="chinaData.res.count"></div>

          <!-- 中国台湾 -->
          <div v-show="chinaTwData.res.count">
            <div class="tabs">
              <img class="flag" src="/static/imgs/state/icons/China.png" />
              <span class="tab-pane">
                中国台湾
                <span v-if="chinaTwData.res.count"
                  >({{ chinaTwData.res.count }})</span
                >
              </span>
              <span
                class="export"
                v-if="!sspztw"
                @click="maxTotal(chinaTwData.exportUrl, chinaTwData.res.count)"
              >
                <i class="iconfont">&#xe605;</i> 导出
              </span>
            </div>
            <div class="china_content">
              <!-- 自定义加载界面 -->
              <LoadingGif
                :className="'list-in-loading'"
                :classNameImg="'little-size-loading'"
                :loadFlag="loadingtw"
                v-if="loadingtw"
                :delayTime="0"
              ></LoadingGif>
              <pdfTable
                v-else-if="sspztw"
                :headerList="chinaTwData.tableHead"
                :dataList="chinaTwData.res.res"
              />
              <!-- 加载完成显示部分 -->
              <el-table
                :data="chinaTwData.res.res"
                stripe
                fixed
                border
                class="table"
                style="width: 100%"
                v-else
              >
                <el-table-column
                  v-for="item in chinaTwData.tableHead"
                  :prop="item.prop"
                  :min-width="item.width"
                  :key="item.prop"
                  :label="item.label"
                  align="center"
                >
                  <template slot-scope="scope">
                    <div v-if="item.prop === 'drugid'">
                      <router-link
                        tag="a"
                        class="cl-blue"
                        :to="'/taiwan/' + scope.row.link.id"
                        target="_blank"
                        >{{ scope.row.drugid || "/" }}</router-link
                      >
                    </div>
                    <div v-else>
                      {{ scope.row[item.prop] || "/" }}
                    </div>
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination
                v-if="chinaTwData.res.count > 10 && !sspztw"
                layout="total, prev, pager, next"
                @current-change="twCurrentChange"
                :current-page="twParam.page"
                :page-size="twParam.pageSize"
                :total="chinaTwData.res.count"
              ></el-pagination>
            </div>
          </div>

          <div class="line" v-if="chinaTwData.res.count"></div>

          <!-- 美国 -->
          <div v-show="usData.res.count">
            <div class="tabs">
              <img
                class="flag"
                src="/static/imgs/state/icons/United States of America.png"
              />
              <span class="tab-pane">
                美国
                <span v-if="usData.res.count">({{ usData.res.count }})</span>
              </span>
              <span
                class="export"
                v-if="!sspzus"
                @click="maxTotal(usData.exportUrl, usData.res.count)"
              >
                <i class="iconfont">&#xe605;</i> 导出
              </span>
            </div>

            <div class="us_content">
              <!-- 自定义加载界面 -->
              <LoadingGif
                :className="'list-in-loading'"
                :classNameImg="'little-size-loading'"
                :loadFlag="loading2"
                v-if="loading2"
                :delayTime="0"
              ></LoadingGif>
              <pdfTable
                v-else-if="sspzus"
                :headerList="usData.tableHead"
                :dataList="usData.res.res"
              />
              <!-- 加载完成显示部分 -->
              <el-table
                :data="usData.res.res"
                stripe
                fixed
                border
                class="table"
                style="width: 100%"
                v-else
              >
                <el-table-column
                  v-for="item in usData.tableHead"
                  :prop="item.prop"
                  :min-width="item.width"
                  :key="item.prop"
                  :label="item.label"
                  align="center"
                  style="padding-left: 35px"
                >
                  <template slot-scope="scope">
                    <div v-if="item.prop === 'drugid'">
                      <router-link
                        tag="a"
                        class="cl-blue"
                        :to="`/fdadrugnew/${scope.row.link.id}`"
                        target="_blank"
                        >{{ scope.row.drugid || "/" }}</router-link
                      >
                    </div>
                    <div v-else>{{ scope.row[item.prop] || "/" }}</div>
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination
                v-if="usData.res.count > 10 && !sspzus"
                layout="total, prev, pager, next"
                @current-change="usCurrentChange"
                :current-page="usParam.page"
                :page-size="usParam.pageSize"
                :total="usData.res.count"
              ></el-pagination>
            </div>
          </div>

          <div class="line" v-if="usData.res.count"></div>

          <!-- 欧盟 -->
          <div v-show="euData.res.count">
            <div class="tabs">
              <img
                class="flag"
                src="/static/imgs/state/icons/European Patent Office.png"
              />
              <span class="tab-pane">
                欧盟
                <span v-if="euData.res.count">({{ euData.res.count }})</span>
              </span>
              <span
                class="export"
                v-if="!sspzeu"
                @click="maxTotal(euData.exportUrl, euData.res.count)"
              >
                <i class="iconfont">&#xe605;</i> 导出
              </span>
            </div>
            <div class="eu_content">
              <!-- 自定义加载界面 -->
              <LoadingGif
                :className="'list-in-loading'"
                :classNameImg="'little-size-loading'"
                :loadFlag="loading3"
                v-if="loading3"
                :delayTime="0"
              ></LoadingGif>
              <pdfTable
                v-else-if="sspzeu"
                :headerList="euData.tableHead"
                :dataList="euData.res.res"
              />
              <!-- 加载完成显示部分 -->
              <el-table
                :data="euData.res.res"
                stripe
                fixed
                border
                class="table"
                style="width: 100%"
                v-else
              >
                <el-table-column
                  v-for="item in euData.tableHead"
                  :prop="item.prop"
                  :min-width="item.width"
                  :key="item.prop"
                  :label="item.label"
                  align="center"
                >
                  <template slot-scope="scope">
                    <div v-if="item.prop === 'drugid'">
                      <!-- epyp -->
                      <router-link
                        tag="a"
                        class="cl-blue"
                        :to="`/epyp/emadetail/${scope.row.link.id}`"
                        target="_blank"
                        v-if="scope.row.source.includes('EMA')"
                        >{{ scope.row.drugid || "/" }}</router-link
                      >
                      <!-- hma -->
                      <router-link
                        tag="a"
                        class="cl-blue"
                        :to="`/epyp/hmadetail/${scope.row.link.id}`"
                        target="_blank"
                        v-if="scope.row.source.includes('HMA')"
                        >{{ scope.row.drugid || "/" }}</router-link
                      >
                    </div>
                    <div v-else>{{ scope.row[item.prop] || "/" }}</div>
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination
                v-if="euData.res.count > 10 && !sspzeu"
                layout="total, prev, pager, next"
                @current-change="euCurrentChange"
                :current-page="euParam.page"
                :page-size="euParam.pageSize"
                :total="euData.res.count"
              ></el-pagination>
            </div>
          </div>

          <div class="line" v-if="euData.res.count"></div>

          <!-- 日本 -->
          <div v-show="jpData.res.count">
            <div class="tabs">
              <img class="flag" src="/static/imgs/state/icons/Japan.png" />
              <span class="tab-pane">
                日本
                <span v-if="jpData.res.count">({{ jpData.res.count }})</span>
              </span>
              <span
                class="export"
                v-if="!sspzjp"
                @click="maxTotal(jpData.exportUrl, jpData.res.count)"
              >
                <i class="iconfont">&#xe605;</i> 导出
              </span>
            </div>
            <div class="jp_content">
              <!-- 自定义加载界面 -->
              <LoadingGif
                :className="'list-in-loading'"
                :classNameImg="'little-size-loading'"
                :loadFlag="loading4"
                v-if="loading4"
                :delayTime="0"
              ></LoadingGif>
              <pdfTable
                v-else-if="sspzjp"
                :headerList="jpData.tableHead"
                :dataList="jpData.res.res"
              />
              <!-- 加载完成显示部分 -->
              <el-table
                :data="jpData.res.res"
                stripe
                fixed
                border
                class="table"
                style="width: 100%"
                v-else
              >
                <el-table-column
                  v-for="item in jpData.tableHead"
                  :prop="item.prop"
                  :min-width="item.width"
                  :key="item.prop"
                  :label="item.label"
                  align="center"
                >
                  <template slot-scope="scope">
                    <div v-if="item.prop === 'drugid'">
                      <router-link
                        tag="a"
                        class="cl-blue"
                        :to="`/pmda/${scope.row.link.id}`"
                        target="_blank"
                        >{{ scope.row.drugid || "/" }}</router-link
                      >
                    </div>
                    <div v-else>{{ scope.row[item.prop] || "/" }}</div>
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination
                v-if="jpData.res.count > 10 && !sspzjp"
                layout="total, prev, pager, next"
                @current-change="jpCurrentChange"
                :current-page="jpParam.page"
                :page-size="jpParam.pageSize"
                :total="jpData.res.count"
              ></el-pagination>
            </div>
          </div>

          <div class="line" v-if="jpData.res.count"></div>

          <!-- 其他国家或地区 -->
          <div v-show="otherData.res.count">
            <div class="tabs">
              <!-- <img class="flag" src="/static/imgs/state/icons/Japan.png" /> -->
              <span class="tab-pane">
                其他国家或地区
                <span v-if="otherData.res.count"
                  >({{ otherData.res.count }})</span
                >
              </span>
              <span
                class="export"
                v-if="!sspzother"
                @click="maxTotal(otherData.exportUrl, otherData.res.count)"
              >
                <i class="iconfont">&#xe605;</i> 导出
              </span>
            </div>
            <div class="jp_content">
              <!-- 自定义加载界面 -->
              <LoadingGif
                :className="'list-in-loading'"
                :classNameImg="'little-size-loading'"
                :loadFlag="loading5"
                v-if="loading5"
                :delayTime="0"
              ></LoadingGif>
              <pdfTable
                v-else-if="sspzother"
                :headerList="otherData.tableHead"
                :dataList="otherData.res.res"
              />
              <!-- 加载完成显示部分 -->
              <el-table
                :data="otherData.res.res"
                stripe
                fixed
                border
                class="table"
                style="width: 100%"
                v-else
              >
                <el-table-column
                  v-for="item in otherData.tableHead"
                  :prop="item.prop"
                  :min-width="item.width"
                  :key="item.prop"
                  :label="item.label"
                  align="center"
                >
                  <template slot-scope="scope">
                    <div v-if="item.prop === 'source'">
                      <router-link
                        tag="a"
                        class="cl-blue"
                        :to="`${sourceHandler(scope.row)}`"
                        target="_blank"
                        >{{ scope.row.source || "/" }}</router-link
                      >
                    </div>
                    <div v-else>{{ scope.row[item.prop] || "/" }}</div>
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination
                v-if="otherData.res.count > 10 && !sspzother"
                layout="total, prev, pager, next"
                @current-change="otherCurrentChange"
                :current-page="otherParam.page"
                :page-size="otherParam.pageSize"
                :total="otherData.res.count"
              ></el-pagination>
            </div>
          </div>
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
import DetailPzlc from "./pzlc";
const chinaFiled = tablehead.drugreport.sspz.china;
const usFiled = tablehead.drugreport.sspz.us;
const euFiled = tablehead.drugreport.sspz.eu;
const jpFiled = tablehead.drugreport.sspz.jp;
const otherFiled = tablehead.drugreport.sspz.other;
const countriesFiled = tablehead.drugreport.sspz.countries;

export default {
  components: {
    LoadingGif,
    pdfTable,
    DetailKzxx,
    DetailPzlc,
  },
  props: {
    extendList: Array,
    res: {
      type: Object,
    },
    ylbm: {
      type: String,
    },
    sspzchina: {
      type: Object,
    },
    sspztw: {
      type: Object,
    },
    sspzus: {
      type: Object,
    },
    sspzeu: {
      type: [Object, Array],
    },
    sspzjp: {
      type: Object,
    },
    sspzother: {
      type: Object,
    },
    pizhunHis: {
      type: Object,
    },
    jspdf: {
      type: Boolean,
    },
  },
  data() {
    return {
      loading1: true,
      loading2: true,
      loading3: true,
      loading4: true,
      loading5: true,
      loadingtw: true,
      newArray: [],
      showArray: [],
      chinaData: {
        res: {},
        tableHead: chinaFiled,
        exportUrl: "/api/report/globalapproval?outdata=1&source=中国",
      },
      chinaTwData: {
        res: {},
        tableHead: chinaFiled,
        exportUrl: "/api/report/globalapproval?outdata=1&source=中国台湾",
      },
      usData: {
        res: {},
        tableHead: usFiled,
        exportUrl: "/api/report/globalapproval?outdata=1&source=美国",
      },
      euData: {
        res: {},
        tableHead: euFiled,
        exportUrl: "/api/report/globalapproval?outdata=1&source=欧盟",
      },
      jpData: {
        res: {},
        tableHead: jpFiled,
        exportUrl: "/api/report/globalapproval?outdata=1&source=日本",
      },
      otherData: {
        res: {},
        tableHead: otherFiled,
        exportUrl: "/api/report/globalapproval?outdata=1&source=其他",
      },
      allParam: {
        pageSize: 10,
        page: 1,
      },
      cnParam: {
        pageSize: 10,
        page: 1,
      },
      twParam: {
        pageSize: 10,
        page: 1,
      },
      euParam: {
        pageSize: 10,
        page: 1,
      },
      usParam: {
        pageSize: 10,
        page: 1,
      },
      jpParam: {
        pageSize: 10,
        page: 1,
      },
      otherParam: {
        pageSize: 10,
        page: 1,
      },
    };
  },
  watch: {},
  methods: {
    sourceHandler(row) {
      let url = "";
      if (row.source === "美国") {
        url = `/fdadrugnew/${row.link.id}`;
      } else if (row.source === "欧盟EMA") {
        url = `/epyp/emadetail/${row.link.id}`;
      } else if (row.source === "欧盟HMA") {
        url = `/epyp/hmadetail/${row.link.id}`;
      } else if (row.source === "日本") {
        url = `/pmda/${row.link.id}`;
      } else if (row.source === "英国") {
        url = `/uk/${row.link.id}`;
      } else if (row.source === "中国台湾") {
        url = `/taiwan/${row.link.id}`;
      } else if (row.source === "德国") {
        url = `/germany/${row.link.id}`;
      } else if (row.source === "加拿大") {
        url = `/canada/${row.link.id}`;
      } else if (row.source === "法国") {
        url = `/france/${row.link.id}`;
      } else if (row.source === "印度") {
        url = `/india/${row.link.id}`;
      } else if (row.source === "韩国") {
        url = `/korean/${row.link.id}`;
      }
      return url;
    },
    showKZXX() {
      let flag = false;
      if (this.jspdf) {
        flag = false;
      } else {
        flag = true;
      }
      return flag;
    },
    LoadChinaData(obj) {
      if (this.sspzchina) {
        this.chinaData.res = this.sspzchina;
        this.loading1 = false;
        return;
      }
      return window
        .Axios({
          method: "get",
          url: "/api/report/globalapproval",
          params: _.assign(
            {},
            {
              englishname: this.res.englishname,
              ylbm: this.ylbm,
              source: "中国",
              accesstoken: GETCOOKIEFUN("accesstoken"),
            },
            this.cnParam
          ),
        })
        .then((res) => {
          this.loading1 = false;
          this.chinaData.res = res.data.data;
        });
    },
    LoadChinaTwData(obj) {
      if (this.sspztw) {
        this.chinaTwData.res = this.sspztw;
        this.loadingtw = false;
        return;
      }
      return window
        .Axios({
          method: "get",
          url: "/api/report/globalapproval",
          params: _.assign(
            {},
            {
              englishname: this.res.englishname,
              ylbm: this.ylbm,
              source: "中国台湾",
              accesstoken: GETCOOKIEFUN("accesstoken"),
            },
            this.twParam
          ),
        })
        .then((res) => {
          this.loadingtw = false;
          this.chinaTwData.res = res.data.data;
        });
    },
    LoadUsData() {
      if (this.sspzus) {
        this.usData.res = this.sspzus;
        this.loading2 = false;
        return;
      }
      return window
        .Axios({
          method: "get",
          url: "/api/report/globalapproval",
          params: _.assign(
            {},
            {
              englishname: this.res.englishname,
              ylbm: this.ylbm,
              source: "美国",
              accesstoken: GETCOOKIEFUN("accesstoken"),
            },
            this.usParam
          ),
        })
        .then((res) => {
          this.loading2 = false;
          this.usData.res = res.data.data;
        });
    },
    LoadEuData() {
      if (this.sspzeu) {
        this.euData.res = this.sspzeu;
        this.loading3 = false;
        return;
      }
      return window
        .Axios({
          method: "get",
          url: "/api/report/globalapproval",
          params: _.assign(
            {},
            {
              englishname: this.res.englishname,
              ylbm: this.ylbm,
              source: "欧盟",
              accesstoken: GETCOOKIEFUN("accesstoken"),
            },
            this.euParam
          ),
        })
        .then((res) => {
          this.loading3 = false;
          this.euData.res = res.data.data;
        });
    },
    LoadJpData() {
      if (this.sspzjp) {
        this.jpData.res = this.sspzjp;
        this.loading4 = false;
        return;
      }
      return window
        .Axios({
          method: "get",
          url: "/api/report/globalapproval",
          params: _.assign(
            {},
            {
              englishname: this.res.englishname,
              ylbm: this.ylbm,
              source: "日本",
              accesstoken: GETCOOKIEFUN("accesstoken"),
            },
            this.jpParam
          ),
        })
        .then((res) => {
          this.loading4 = false;
          this.jpData.res = res.data.data;
        });
    },
    LoadOtherData() {
      if (this.sspzother) {
        this.otherData.res = this.sspzother;
        this.loading5 = false;
        return;
      }
      return window
        .Axios({
          method: "get",
          url: "/api/report/globalapproval",
          params: _.assign(
            {},
            {
              englishname: this.res.englishname,
              ylbm: this.ylbm,
              source: "其他",
              accesstoken: GETCOOKIEFUN("accesstoken"),
            },
            this.otherParam
          ),
        })
        .then((res) => {
          this.loading5 = false;
          this.otherData.res = res.data.data;
        });
    },
    chunk(arr, num) {
      //每十个截取一次
      let j = 0,
        o = j;
      while (j < arr.length) {
        j += num;
        this.newArray.push(arr.slice(o, j));
        o = j;
      }
      return this.newArray;
    },
    changePage(idx) {
      this.showArray = this.newArray[idx - 1];
    },
    //总数超过1000提示
    maxTotal(url, total) {
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
          "&englishname=" +
          this.res.englishname +
          "&ylbm=" +
          this.ylbm +
          "&accesstoken=" +
          GETCOOKIEFUN("accesstoken")
      );
    },
    cnCurrentChange(val) {
      this.loading1 = true;
      this.cnParam.page = val;
      this.LoadChinaData();
    },
    twCurrentChange(val) {
      this.loadingtw = true;
      this.twParam.page = val;
      this.LoadChinaTwData();
    },
    usCurrentChange(val) {
      this.loading2 = true;
      this.usParam.page = val;
      this.LoadUsData();
    },
    euCurrentChange(val) {
      this.loading3 = true;
      this.euParam.page = val;
      this.LoadEuData();
    },
    jpCurrentChange(val) {
      this.loading4 = true;
      this.jpParam.page = val;
      this.LoadJpData();
    },
    otherCurrentChange(val) {
      this.loading5 = true;
      this.otherParam.page = val;
      this.LoadOtherData();
    },
    crCurrentChange(val) {
      this.loading5 = true;
      this.allParam.page = val;
      // this.LoadCountriesData();
    },
    loadData() {
      Promise.all([
        this.LoadChinaData(),
        this.LoadChinaTwData(),
        this.LoadUsData(),
        this.LoadEuData(),
        this.LoadJpData(),
        this.LoadOtherData(),
      ]).then((res) => {
        let isShow =
          this.chinaData.res.length > 0 ||
          this.chinaTwData.res.length > 0 ||
          this.usData.res.length > 0 ||
          this.euData.res.length > 0 ||
          this.jpData.res.length > 0;
        console.log(isShow);
        this.$emit("showSSPZ", isShow);
      });
    },
  },
  mounted() {
    // this.LoadCountriesData();
    this.loadData();
  },
};
</script>
<style lang="less" scoped>
@import "~@/assets/less/var.less";
@import "../css/com.less";

.line {
  height: 1px;
  background: #dfe5f1;
  width: 100%;
  margin-top: 20px;
}

.export {
  display: inline-block;
  width: 66px;
  height: 24px;
  line-height: 24px;
  background: #4877e8;
  border-radius: 4px;
  font-size: 14px;
  color: #fff;
  text-align: center;
  margin-bottom: 5px;
  cursor: pointer;
}

.tabs {
  position: relative;
  width: auto;
  font-size: 14px;
  margin: 25px 0 10px 0;
  height: 30px;
  line-height: 30px;

  .flag {
    vertical-align: middle;
  }

  .tab-pane {
    padding-left: 6px;
    color: @PrimaryColor;
    font-size: 16px;
    font-weight: 600;
    color: #545b6d;

    .num {
    }
  }

  .export {
    position: absolute;
    right: 0px;
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
</style>
