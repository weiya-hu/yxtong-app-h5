<template>
  <div class="wrapper" ref="wrapper">
    <!-- 自定义加载界面 -->
    <LoadingGif :loadFlag="isLoading" v-if="isLoading"></LoadingGif>
    <!-- 加载完成显示部分 -->
    <div class="detail-list" v-else>
      <div class="detail-header" v-if="the_main_title">
        <div class="header-left">
          <div class="left-top">
            <span class="top-id" v-if="the_main_title" :title="the_main_title">{{ the_main_title }}</span>
            <div class="left-bottom" v-if="the_second_title">
              <span class="bottom-name">{{ the_second_title }}</span>
            </div>
          </div>
        </div>

        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item ><a href="/home">首页</a></el-breadcrumb-item>
          <el-breadcrumb-item><a :href="'/' + allBase.dbename">{{allBase.dbname}}</a></el-breadcrumb-item>
          <el-breadcrumb-item>详情页</el-breadcrumb-item>
        </el-breadcrumb>

      </div>
      <div v-else style="margin-bottom: 10px"></div>
      <!-- ① 通用详情页 -->
      <div class="main">
        <!-- 基本信息 -->
        <slide-section :title="'基本信息'" v-if="Object.keys(table_data).length">
          <div class="tb-wrap">
            <table class="tb-t">
              <tr
                v-for="(item, key, index) in table_data"
                :key="index"
                v-if="item.value || item.nodata_hide != '1'"
              >
                <td>
                  <NewProjectGuide
                    position="initial"
                    postion="详情"
                    :onlyKey="item['new_id']"
                    :key="new Date().getTime()"
                    display="inline"
                    :projectName="key"
                    compoentsName="字段"
                    :initItem="item"
                    :showMenban="item['is_show_new']"
                  >{{ key }}</NewProjectGuide>
                  <!-- <NewProjectGuide :onlyKey="key+'_1604468806662'" :initItem="item" :showMenban="(index%2)==0">{{key}}</NewProjectGuide> -->
                  <!-- {{key}} -->
                  <el-tooltip v-if="item.statement" effect="light" placement="right">
                    <div slot="content" v-html="item.statement"></div>
                    <i class="el-icon-question cl-green"></i>
                  </el-tooltip>
                </td>
                <td>
                  <span v-if="vueCheckDetailPms('Database', key)">
                    <!-- 非下载 - 超链接(路由) -->
                    <tdCountCheckOut
                      v-if="
                        item.readtype == '超链接(路由)' &&
                        item.contentname != '下载'
                      "
                      :itemFather="item"
                      :scopeRowAll="detail_data"
                      :scopeRow="checkOne(item, detail_data)"
                    >
                      <span
                        :title="
                          item.fieldmax ? checkOne(item, detail_data) : ''
                        "
                      >
                        <router-link
                          v-if="item.uri"
                          :class="{
                            'link-blue': item.urlstyle === '蓝色',
                            'link-underline': item.urlstyle === '下划线',
                          }"
                          tag="a"
                          :to="
                            item.uri +
                            detail_data[item.parameter] +
                            (item.linkcs ? item.linkcs : '')
                          "
                          :target="
                            item.target === '新窗口' ? '_blank' : '_self'
                          "
                        >
                          {{
                            overflowEclips(
                              checkOne(item, detail_data),
                              item.fieldmax
                            )
                          }}
                        </router-link>
                        <span v-else>
                          {{
                            overflowEclips(
                              checkOne(item, detail_data),
                              item.fieldmax
                            )
                          }}
                        </span>
                      </span>
                    </tdCountCheckOut>
                    <!-- 非下载 - 超链接(特殊域名) -->
                    <tdCountCheckOut
                      v-else-if="
                        item.readtype == '超链接(特殊域名)' &&
                        item.contentname != '下载'
                      "
                      :itemFather="item"
                      :scopeRowAll="detail_data"
                      :scopeRow="checkOne(item, detail_data)"
                    >
                      <span>
                        <a
                          v-if="item.uri"
                          :title="
                            item.fieldmax ? checkOne(item, detail_data) : ''
                          "
                          :class="{
                            'link-blue': item.urlstyle === '蓝色',
                            'link-underline': item.urlstyle === '下划线',
                          }"
                          :href="
                            item.uri +
                            detail_data[item.parameter] +
                            (item.linkcs ? item.linkcs : '')
                          "
                          :target="
                            item.target === '新窗口' ? '_blank' : '_self'
                          "
                        >
                          {{
                            overflowEclips(
                              checkOne(item, detail_data),
                              item.fieldmax
                            )
                          }}
                        </a>
                        <span
                          v-else
                          :title="
                            item.fieldmax ? checkOne(item, detail_data) : ''
                          "
                        >
                          {{
                            overflowEclips(
                              checkOne(item, detail_data),
                              item.fieldmax
                            )
                          }}
                        </span>
                      </span>
                    </tdCountCheckOut>
                    <!-- 非下载 - 超链接(存储字段) -->
                    <tdCountCheckOut
                      v-else-if="
                        item.readtype == '超链接(存储字段)' &&
                        item.contentname != '下载'
                      "
                      :itemFather="item"
                      :scopeRowAll="detail_data"
                      :scopeRow="checkOne(item, detail_data)"
                    >
                      <span>
                        <a
                          v-if="detail_data[item.parameter]"
                          :class="{
                            'link-blue': item.urlstyle === '蓝色',
                            'link-underline': item.urlstyle === '下划线',
                          }"
                          :href="
                            ((
                              detail_data[item.parameter] + item.linkcs
                            ).indexOf('http') > -1
                              ? ''
                              : 'http://') +
                            detail_data[item.parameter] +
                            (item.linkcs ? item.linkcs : '')
                          "
                          :target="
                            item.target === '新窗口' ? '_blank' : '_self'
                          "
                          :title="
                            item.fieldmax ? checkOne(item, detail_data) : ''
                          "
                        >
                          {{
                            overflowEclips(
                              checkOne(item, detail_data),
                              item.fieldmax
                            )
                          }}
                        </a>
                        <span
                          v-else
                          :title="
                            item.fieldmax ? checkOne(item, detail_data) : ''
                          "
                        >
                          {{
                            overflowEclips(
                              checkOne(item, detail_data),
                              item.fieldmax
                            )
                          }}
                        </span>
                      </span>
                    </tdCountCheckOut>
                    <!-- 下载 - 超链接(路由) -->
                    <tdCountCheckOut
                      v-else-if="
                        item.readtype == '超链接(路由)' &&
                        item.contentname == '下载'
                      "
                      :itemFather="item"
                      :scopeRowAll="detail_data"
                      :scopeRow="checkOne(item, detail_data)"
                    >
                      <div>
                        <div class="download">
                          <router-link
                            class="fujian"
                            :class="{
                              'link-blue': item.urlstyle === '蓝色',
                              'link-underline': item.urlstyle === '下划线',
                            }"
                            tag="a"
                            :to="
                              item.uri +
                              detail_data[item.parameter] +
                              (item.linkcs ? item.linkcs : '')
                            "
                            :target="
                              item.target === '新窗口' ? '_blank' : '_self'
                            "
                          >
                            <i class="iconfont download-icon">&#xe62c;</i>
                          </router-link>
                        </div>
                      </div>
                    </tdCountCheckOut>
                    <!-- 下载 - 超链接(特殊域名) -->
                    <tdCountCheckOut
                      v-else-if="
                        item.readtype == '超链接(特殊域名)' &&
                        item.contentname == '下载'
                      "
                      :itemFather="item"
                      :scopeRowAll="detail_data"
                      :scopeRow="checkOne(item, detail_data)"
                    >
                      <div>
                        <div class="download">
                          <a
                            class="fujian"
                            :class="{
                              'link-blue': item.urlstyle === '蓝色',
                              'link-underline': item.urlstyle === '下划线',
                            }"
                            :href="
                              item.uri +
                              detail_data[item.parameter] +
                              (item.linkcs ? item.linkcs : '')
                            "
                            :target="
                              item.target === '新窗口' ? '_blank' : '_self'
                            "
                          >
                            <i class="iconfont download-icon">&#xe62c;</i>
                          </a>
                        </div>
                      </div>
                    </tdCountCheckOut>
                    <!-- 下载 - 超链接(存储字段) -->
                    <tdCountCheckOut
                      v-else-if="
                        item.readtype == '超链接(存储字段)' &&
                        item.contentname == '下载'
                      "
                      :itemFather="item"
                      :scopeRowAll="detail_data"
                      :scopeRow="checkOne(item, detail_data)"
                    >
                      <div>
                        <div class="download">
                          <a
                            class="fujian"
                            :class="{
                              'link-blue': item.urlstyle === '蓝色',
                              'link-underline': item.urlstyle === '下划线',
                            }"
                            :href="
                              ((
                                detail_data[item.parameter] + item.linkcs
                              ).indexOf('http') > -1
                                ? ''
                                : 'http://') +
                              detail_data[item.parameter] +
                              (item.linkcs ? item.linkcs : '')
                            "
                            :target="
                              item.target === '新窗口' ? '_blank' : '_self'
                            "
                          >
                            <i class="iconfont download-icon">&#xe62c;</i>
                          </a>
                        </div>
                      </div>
                    </tdCountCheckOut>
                    <!-- 下载 - 超链接 -->
                    <tdCountCheckOut
                      v-else-if="item.readtype == '超链接'"
                      :itemFather="item"
                      :scopeRowAll="detail_data"
                      :scopeRow="checkOne(item, detail_data)"
                    >
                      <div>
                        <div class="download">
                          <a
                            class="fujian"
                            :class="{
                              'link-blue': item.urlstyle === '蓝色',
                              'link-underline': item.urlstyle === '下划线',
                            }"
                            :href="
                              ((
                                detail_data[item.parameter] + item.linkcs
                              ).indexOf('http') > -1
                                ? ''
                                : 'http://') +
                              detail_data[item.parameter] +
                              (item.linkcs ? item.linkcs : '')
                            "
                            :target="
                              item.target === '新窗口' ? '_blank' : '_self'
                            "
                          >
                            {{
                              overflowEclips(
                                checkOne(item, detail_data),
                                item.fieldmax
                              )
                            }}
                          </a>
                        </div>
                      </div>
                    </tdCountCheckOut>
                    <!-- 后端直传html形式 -->
                    <!-- <tdCountCheckOut  v-else-if="item.readtype == '单独开发' " :itemFather="item" :scopeRowAll="detail_data" :scopeRow="detail_data[item.parameter] ? detail_data[item.parameter] : item.nodata_content"> -->
                    <!-- <tdCountCheckOut  v-else-if="item.readtype == '单独开发' " :itemFather="item" :scopeRowAll="detail_data" :scopeRow="detail_data[item.field.split(':')[0]] ? detail_data[item.field.split(':')[0]] : item.nodata_content"> -->
                    <!-- 单独开发取的值不一样 -->

                    <tdCountCheckOut
                      kaifaType="单独开发"
                      v-else-if="item.readtype == '单独开发'"
                      :itemFather="item"
                      :scopeRowAll="detail_data"
                      :scopeRow="
                        detail_data[item.callbackfield]
                          ? detail_data[item.callbackfield]
                          : item.nodata_content
                      "
                    >
                      <!-- 马丁代尔单独 -->
                      <template
                        v-if="
                          database_name === 'martindale' &&
                          !detail_data[item.parameter]
                        "
                      >
                        <a
                          :target="
                            item.target === '新窗口' ? '_blank' : '_self'
                          "
                          :class="{
                            'link-blue': item.urlstyle === '蓝色',
                            'link-underline': item.urlstyle === '下划线',
                          }"
                          :href="item.uri"
                        >{{ item.contentname }}</a>
                      </template>
                      <span
                        v-else
                        :title="
                          item.fieldmax
                            ? detail_data[item.callbackfield]
                              ? detail_data[item.callbackfield]
                              : item.nodata_content
                            : ''
                        "
                        v-html="
                          overflowEclips(
                            detail_data[item.callbackfield]
                              ? detail_data[item.callbackfield]
                              : item.nodata_content,
                            item.fieldmax
                          )
                        "
                      ></span>
                    </tdCountCheckOut>
                    <!-- 假冒企业标志 -->
                    <TdCountCheckOut
                      v-else-if="
                        key === '生产企业' &&
                        table_data['假冒'] &&
                        table_data['假冒'].value === '假冒'
                      "
                      :itemFather="item"
                      :scopeRowAll="detail_data"
                      :scopeRow="item.value"
                    >
                      <span
                        class="db-faker-label"
                        :title="detail_data.notice"
                        v-html="overflowEclips(item.value, item.fieldmax)"
                      ></span>
                    </TdCountCheckOut>
                    <!-- 分子式统一处理下标 -->
                    <span v-else-if="key === '分子式'" v-html="vueFormulationsFormatter(item.value)"></span>
                    <!-- 普通文字形式 -->
                    <tdCountCheckOut
                      v-else
                      :itemFather="item"
                      :scopeRowAll="detail_data"
                      :scopeRow="item.value"
                    >
                      <span
                        :title="item.fieldmax ? item.value : ''"
                        v-html="overflowEclips(item.value, item.fieldmax)"
                      ></span>
                    </tdCountCheckOut>
                  </span>
                  <!-- </span> -->

                  <span v-else class="abandon-click-method">暂无权限</span>
                </td>
              </tr>
            </table>
          </div>
        </slide-section>

        <!-- 正文 -->
        <slide-section :title="'正文'" v-if="the_main_content">
          <div class="tb-wrap">
            <CountPage
              id="the_main_content"
              :itemFather="the_main_contentImg"
              :value="the_main_content"
            />
          </div>
        </slide-section>

        <!-- 其他模块(接口自定义) -->
        <!--  -->
        <slide-section :title="the_main_userChangeImg.label || ''" v-if="the_main_userChange">
          <div class="tb-wrap">
            <CountPage
              id="the_main_userChange"
              :itemFather="the_main_userChangeImg"
              :value="the_main_userChange"
            />
          </div>
        </slide-section>

        <!-- 其他模块(横式表格) -->
        <slide-section
          :title="table.title"
          v-for="(table, index) in other_modules"
          :key="index"
          v-if="other_modules && other_modules.length"
        >
          <div class="tb-wrap">
            <el-table :data="table.data" stripe fixed>
              <el-table-column v-for="(item, index1) in table.head" :key="index1" :label="item">
                <template slot-scope="scope">
                  <div v-if="handleOtherTableScope(scope, item)">
                    <span>{{ handleOtherTableScopeContent(scope, item) }}</span>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </slide-section>
        <!-- 其他模块(横式表格)接口另外请求 -->
        <slide-section
          :title="table.title"
          v-for="(table, index) in other_modules_table"
          :key="table.data[table.head[0].field]"
          v-if="
            table.data.length > 0 ||
            (!table.nodata_hide &&
              table.nodata_hide != '1')
          "
        >
          <div class="tb-wrap" v-if="other_modules_table.modeltyle === '横式表格'">
            <el-table
              :data="table.data"
              @sort-change="(column) => sortCateChange(column, index)"
              stripe
              fixed
            >
              <el-table-column
                v-for="(item, index1) in table.head"
                :key="Math.floor(Math.random() * 100)"
                :prop="item.field"
                :min-width="item.min_width ? item.min_width : 100"
                :sortable="item.order_field ? true : false"
                :label="item.label"
              >
                <template :slot="1 ? 'header' : ''" slot-scope="scope">
                  {{ item.label }}
                  <el-tooltip v-if="item.statement" class effect="zhuce" placement="right">
                    <div slot="content" v-html="item.statement"></div>
                    <i
                      class="el-icon-question cl-green"
                      style="margin-left: 4px;line-height: 28px;"
                    ></i>
                  </el-tooltip>
                </template>
                <template slot-scope="scope">
                  <a
                    v-if="item.href"
                    target="_blank"
                    :href="scope.row[item.href]"
                    class="link-blue"
                  >{{ scope.row[item.href] ? '查看' : '' }}</a>
                  <span v-else :title="scope.row[item.field]" v-html="scope.row[item.field]"></span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </slide-section>
        <!-- 其他模块(竖式表格)接口另外请求 -->
        <slide-section
          :title="table.title"
          v-for="(table, index) in other_modules_table_horizon"
          :key="table.data[table.head[0].field]"
          v-if="
            other_modules_table_horizon[0].data.length > 0 ||
            (!other_modules_table_horizon.nodata_hide &&
              other_modules_table_horizon.nodata_hide != '1')
          "
        >
          <div class="tb-wrap" v-if="other_modules_table_horizon.modeltyle === '竖式表格'">
            <table class="tb-t">
              <tr v-for="(item, index) in table.head" :key="index">
                <td>
                  <NewProjectGuide
                    position="initial"
                    postion="详情"
                    :onlyKey="item['new_id']"
                    :key="new Date().getTime()"
                    display="inline"
                    :projectName="item.label"
                    compoentsName="字段"
                    :initItem="item"
                    :showMenban="item['is_show_new']"
                  >{{ item.label }}</NewProjectGuide>
                  <el-tooltip v-if="item.statement" effect="light" placement="right">
                    <div slot="content" v-html="item.statement"></div>
                    <i class="el-icon-question cl-green"></i>
                  </el-tooltip>
                </td>
                <td>
                  <span v-if="item.href == ''">
                    {{
                      table.data[0][item.field]
                    }}
                  </span>
                  <a
                    v-else
                    target="_blank"
                    :href="item.href"
                    class="link-blue"
                  >{{ table.data[0][item.field] }}</a>
                </td>
              </tr>
            </table>
          </div>
        </slide-section>
        <!-- 扩展信息 -->
        <slide-section :title="'扩展信息'" v-if="extendList.length">
          <div class="extend-list">
            <ExtendButton v-for="(item, index) in extendList" :key="index" :item="item"></ExtendButton>
          </div>
        </slide-section>
      </div>
    </div>
    <!-- 图片弹框 -->
    <div class="detail_content">
      <div class="clearfix"></div>
      <div id="maginfy-img-wap" class="magnify-img dn" title="点击返回">
        <i class="el-icon-close"></i>
        <img id="maginfy-outimg" src />
      </div>
    </div>
  </div>
</template>

<script>
import LoadingGif from "@/components/common/globalCom/loading-gif";
import ExtendButton from "@/components/common/extend-button";
import SlideSection from "@/components/common/slide-section";
import LaFooter from "@/components/layouts/footer";
import tdCountCheckOut from "../tdCountCheckOut";
import CountPage from "./CountPage";
import detailScrollMixins from "@/mixins/detailScroll.js";
import { mapState } from "vuex";

export default {
  components: {
    LoadingGif,
    ExtendButton,
    SlideSection,
    LaFooter,
    CountPage,
    tdCountCheckOut,
  },
  mixins: [detailScrollMixins],
  data() {
    return {
      isLoading: true,
      detail_data: {},
      table_data: {}, // 单表的处理后数据
      dbname: this.$route.params.dbname, // 数据库类型名称，如hmap、qixiebiaozhun等
      id: this.$route.params.id, //具体对应编号
      the_main_title: "", // 主标题
      the_second_title: "", // 副标题
      the_main_content: "", // 正文
      the_main_contentImg: {}, // 正文对应的所有 模块值
      the_main_userChange: "", // 其他模块(用户自定义) - 总
      the_main_userChangeImg: {}, //其他模块(用户自定义) 对应的所有 模块值
      other_modules: [], // 其他模块(横式表格) - 总
      other_modules_table: [], // 其他模块(横式表格)-接口自定义 - 总
      other_modules_table_horizon: [],
      other_modules_table_horizonFlag: 0,
      other_modules_tableFlag: 0,
      extendList: [],
    };
  },
  computed: {
    ...mapState({
      nopms: (state) => state.Database.nopms,
      base_conf: (state) => state.Database.base_conf,
      help_conf: (state) => state.Database.help_conf,
      extend_conf: (state) => state.Database.extend_conf,
      info_conf: (state) => state.Database.info_conf,
      tableconf: (state) => state.Database.tableconf,
      database_name: (state) => state.Database.database_name,
      allBase: state => state.Database.allBase,
    }),
  },

  watch: {},
  methods: {
    sortCateChange(column, index) {
      let prop = column.prop;
      let sort;
      // prop为null时，默认排序
      if (prop) {
        if (column.order == "ascending") {
          sort = prop + " " + "asc";
        } else if (column.order == "descending") {
          sort = prop + " " + "desc";
        } else {
          sort = "";
        }
      }

      this.tableAxios(index, this.other_modules_table[index], sort);
    },
    handleOtherTableScope(scope, option) {
      for (let key in scope.row) {
        if (key == option) {
          return true;
        }
      }
    },
    handleOtherTableScopeContent(scope, option) {
      for (let key in scope.row) {
        if (key == option) {
          return scope.row[key] ? scope.row[key] : "";
        }
      }
    },
    checkOne(item, row) {
      if (item.contentname) {
        return item.contentname;
      } else if (
        !item.contentname &&
        row[item.parameter] &&
        item.field == "NULL"
      ) {
        return row[item.parameter];
      } else if (!item.contentname && item.field != "NULL") {
        return row[item.field];
      }
    },
    getUriArr(val, uri) {
      let arr = [];
      let valArr = String(val).split(";");
      let uriArr = _.replace(String(uri), "!", "").split(";");
      for (let index in valArr) {
        let obj = {
          value: valArr[index],
          label: uriArr[index],
        };
        arr.push(obj);
      }
      return arr;
    },
    checkUriType(url) {
      if (String(url).indexOf("!") == 0) {
        return true;
      } else {
        return false;
      }
    },
    handleAxios() {
      let dbname = this.dbname === "structural" ? "structurals" : this.dbname;
      window
        .Axios({
          method: "get",
          url: "/api/" + dbname + "/" + this.id,
          params: {
            accesstoken: GETCOOKIEFUN("accesstoken"),
          },
        })
        .then((res) => {
          if (res.data.code === 200 && res.data.data) {
            let data = res.data.data;
            this.detail_data = this.dbname === "chufang" ? data.List : data;
            this.getExtendList(dbname, data.extendList);
            this.handleData();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    tableAxiosCommon(opt, order, order_arr) {
      let length = 0;
      if (order === "横式表格") length = this.other_modules_tableFlag++;
      else if (order === "竖式表格")
        length = this.other_modules_table_horizonFlag++;

      let dbname = this.dbname === "structural" ? "structurals" : this.dbname;
      let tmpOrder = order;
      if (["竖式表格", "横式表格"].includes(tmpOrder)) tmpOrder = null;
      else tmpOrder = order;
      const _this = this;
      window
        .Axios({
          method: "get",
          url: "/api/" + dbname + "/horizontal",
          params: {
            id: this.id,
            order: tmpOrder,
          },
        })
        .then((res) => {
          if (res.data.code === 200 && res.data.data) {
            let data = res.data.data;
            opt.data = data[opt.txtkey];
            for (let i = 0; i < order_arr.length; i++) {
              let tmpItem = order_arr[i];
              if (tmpItem === "横式表格") {
                _this.other_modules_table.splice(length, 1, opt);
                _this.$set(_this.other_modules_table, "modeltyle", tmpItem);
                _this.$set(
                  _this.other_modules_table,
                  "nodata_hide",
                  opt.nodata_hide
                );
              } else if (tmpItem === "竖式表格") {
                _this.other_modules_table_horizon.splice(length, 1, opt);
                _this.$set(
                  _this.other_modules_table_horizon,
                  "modeltyle",
                  tmpItem
                );
                _this.$set(
                  _this.other_modules_table_horizon,
                  "nodata_hide",
                  opt.nodata_hide
                );
              }
            }
            // console.log(_this.other_modules_table, _this.other_modules_table_horizon);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    handleData() {
      let the_title = "",
        the_table = [],
        the_head = [],
        flag = false,
        tmpItem = null,
        order_arr = [];
      for (let item of this.info_conf) {
        let notMatch = true;
        //let handledField = item.field != 'NULL' ? String(item.field).split(":")[0] : item.parameter
        let handledField =
          item.field != "NULL"
            ? item.readtype == "单独开发"
              ? item.callbackfield
              : String(item.field).split(":")[0]
            : item.parameter;
        for (let key in this.detail_data) {
          if (handledField == key) {
            notMatch = false;
            if (item.modeltyle == "主标题") {
              // 设置主标题
              this.the_main_title = this.detail_data[key];
              if (item.isrepeat == "1") {
                // 如果要重复
                _.set(this.table_data, item.label, {
                  value: this.detail_data[key],
                  field: item.field,
                  special_img: item.special_img,
                  imgSize: item.imgSize,
                  num_down: item.num_down,
                  uri: item.uri,
                  target: item.target,
                  urlstyle: item.urlstyle,
                  parameter: item.parameter,
                  linkcs: item.linkcs,
                  nodata_hide: item.nodata_hide,
                  special: item.special,
                  contentname: item.contentname,
                  readtype: item.readtype,
                  callbackfield: item.callbackfield,
                  fieldmax: item.fieldmax,
                  statement: item.statement,
                });
              }
            } else if (item.modeltyle == "副标题") {
              // 设置副标题
              this.the_second_title = this.detail_data[key];
              if (item.isrepeat == "1") {
                // 如果要重复
                _.set(this.table_data, item.label, {
                  value: this.detail_data[key],
                  special_img: item.special_img,
                  imgSize: item.imgSize,
                  num_down: item.num_down,
                  field: item.field,
                  uri: item.uri,
                  target: item.target,
                  urlstyle: item.urlstyle,
                  parameter: item.parameter,
                  linkcs: item.linkcs,
                  nodata_hide: item.nodata_hide,
                  special: item.special,
                  contentname: item.contentname,
                  readtype: item.readtype,
                  callbackfield: item.callbackfield,
                  fieldmax: item.fieldmax,
                  statement: item.statement,
                });
              }
            } else if (item.modeltyle == "其他模块(接口自定义)") {
              this.the_main_userChange = this.detail_data[key];
              this.the_main_userChangeImg = item;
              if (item.isrepeat == "1") {
                // 如果要重复
                _.set(this.table_data, item.label, {
                  value: this.detail_data[key],
                  special_img: item.special_img,
                  imgSize: item.imgSize,
                  num_down: item.num_down,
                  field: item.field,
                  uri: item.uri,
                  target: item.target,
                  urlstyle: item.urlstyle,
                  parameter: item.parameter,
                  linkcs: item.linkcs,
                  nodata_hide: item.nodata_hide,
                  special: item.special,
                  contentname: item.contentname,
                  readtype: item.readtype,
                  callbackfield: item.callbackfield,
                  fieldmax: item.fieldmax,
                  statement: item.statement,
                });
              }
            } else if (item.modeltyle == "正文") {
              // 设置正文
              this.the_main_content = this.detail_data[key];
              this.the_main_contentImg = item;
              if (item.isrepeat == "1") {
                // 如果要重复
                _.set(this.table_data, item.label, {
                  value: this.detail_data[key],
                  special_img: item.special_img,
                  imgSize: item.imgSize,
                  num_down: item.num_down,
                  field: item.field,
                  uri: item.uri,
                  target: item.target,
                  urlstyle: item.urlstyle,
                  parameter: item.parameter,
                  linkcs: item.linkcs,
                  nodata_hide: item.nodata_hide,
                  special: item.special,
                  contentname: item.contentname,
                  readtype: item.readtype,
                  callbackfield: item.callbackfield,
                  fieldmax: item.fieldmax,
                  statement: item.statement,
                });
              }
            } else if (item.modeltyle == "其他模块(横式表格)") {
              // 设置其他模块(横式表格)
              let the_key = String(item.funname).split(":")[0];
              let the_title = item.label;
              let the_table = this.detail_data[the_key];
              let the_head = [];
              for (let key in the_table[0]) {
                the_head.push(key);
              }
              let obj = {
                title: the_title,
                head: the_head,
                data: the_table,
              };
              this.other_modules.push(obj);
            } else {
              _.set(this.table_data, item.label, {
                value: this.detail_data[key],
                special_img: item.special_img,
                imgSize: item.imgSize,
                num_down: item.num_down,
                field: item.field,
                uri: item.uri,
                target: item.target,
                urlstyle: item.urlstyle,
                parameter: item.parameter,
                linkcs: item.linkcs,
                nodata_hide: item.nodata_hide,
                special: item.special,
                contentname: item.contentname,
                readtype: item.readtype,
                callbackfield: item.callbackfield,
                fieldmax: item.fieldmax,
                is_show_new: item.is_show_new,
                new_content: item.new_content,
                new_type: item.new_type,
                new_id: item.new_id,
                statement: item.statement,
              });
            }
          }
        }
        if (["横式表格", "竖式表格"].includes(item.modeltyle)) {
          delete this.table_data[item.label];
          flag = true;
          tmpItem = item;
          the_title = tmpItem.label;
          the_table = [];
          order_arr.push(item.modeltyle);
          item.horizontal_form.forEach(
            (item) => (item.sort = Number(item.sort))
          );
          item.horizontal_form = _.orderBy(
            item.horizontal_form,
            ["sort"],
            ["desc"]
          );
          the_head = item.horizontal_form;
        }

        this.isLoading = false;
        if (flag) {
          const _this = this;
          let obj = {
            title: the_title,
            head: the_head,
            data: the_table,
            txtkey: tmpItem.frontend_keyname,
          };
          if (tmpItem.nodata_hide) obj.nodata_hide = tmpItem.nodata_hide;
          _this.tableAxiosCommon(obj, tmpItem.modeltyle, order_arr);
          // 接口调用之后要将状态值重置为false，否则会重复渲染
          flag = false;
        }
        // 如果没有匹配的
        // if (notMatch) {
        //   _.set(this.table_data, item.label, {
        //     "value": '',
        //     "field": item.field,
        //     "uri": item.uri,
        //     "target": item.target,
        //     "urlstyle": item.urlstyle,
        //     "parameter": item.parameter,
        //     "linkcs": item.linkcs,
        //     "nodata_hide": item.nodata_hide,
        //     "special": item.special,
        //     "contentname": item.contentname,
        //     "readtype": item.readtype,
        //     "statement": item.statement,
        //   })
        // }
      }
    },
  },
  created() {
    if (this.dbname === "chufang") {
      this.handleAxios();
    }
    Store.dispatch("Database/getConf", this.$route.path).then(() => {
      this.handleAxios();
    });
    setTimeout(() => {
      const hashLocation = sessionStorage.getItem("hashLocation"); //缓存中获取当前页面的路由名称
      // 注意, 这里使用全路径匹配,在hash模式中,因为地址会携带#,所以页面报告中的url需要重新覆盖一下, 将#去除
      window._paq.push(["setCustomUrl", "https://" + hashLocation]); //覆盖页面报告的url，可以自定义页面url，加上本页面路由
      window._paq.push(["trackPageView", this.base_conf.dbname]); //页面名称,可以自定义页面名称
      window._paq.push(["setDocumentTitle", this.base_conf.dbname]);
    }, 1000);
    localStorage.setItem(
      //newProjectGuide 组件需要的东西
      "newProjectGuideArr",
      JSON.stringify([])
    );
    localStorage.setItem("domPosition", "");
  },
  mounted() { },
  activated() {
    //this.vueRouteToNoPms(this.nopms.xqy)
  },
  updated() {
    //this.vueRouteToNoPms(this.nopms.xqy)
    this.vueTogglePmsTooltip();
    $("#the_main_content>a").css({
      color: "#4877e8",
    });
  },
};
</script>

<style lang="less" scoped>
@import "~@/assets/less/var.less";
@import "~@/assets/less/app.less";
@import "~@/assets/less/detailCom.less";

.detail_content {
  #maginfy-img-wap {
    position: fixed;
    left: 0px;
    top: 0px;
    z-index: 1100;
    width: 100vw;
    height: 100vh;
    line-height: 100vh;
    text-align: center;
    background: rgba(102, 102, 102, 0.4);
    overflow: auto;
    .el-icon-close {
      position: absolute;
      right: 20px;
      top: 10px;
      color: #fff;
      font-size: 40px;
    }
    img {
      vertical-align: middle;
    }
  }
}

#the_main_content {
  font-size: 13px;
  a {
    span {
      color: blue;
    }
  }
}
.wrapper {
  .main {
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
  }
}

.wrapper .detail-list .detail-header .header-left .left-top {
  width: auto;
}

.db-faker-label {
  position: relative;
  &::after {
    position: absolute;
    right: -60px;
    top: -2px;
    line-height: 20px;
    font-size: 13px;
    display: block;
    border-radius: 10px;
    content: "被假冒";
    width: 55px;
    height: 20px;
    background: #f56e6b;
    color: #fff;
    text-align: center;
  }
}

.top-id {
  max-width: 80vw !important;
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
/deep/.el-table tbody td > .cell {
  padding: 8px 0 4px 14px !important;
}
</style>
