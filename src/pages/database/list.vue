<template>
  <div class="la-list la-list-database">
    <List :loading="listLoading"
      :nodata="res1 && !res1.length">
      <div class="actions"
        :style="actions">
        <!-- 显示 -->
        <list-check :defaultFiled="defaultFiled"
          vuex_name="Database"
          :showArray="tableHead"
          @changeTableHeader="(list)=>changeTableHeader(this,list)" />
        <!-- 导出 -->
        <Export v-if="$route.path.indexOf('structural')===-1"
          :out_max="base_conf.out_max"
          vuex_name="Database"
          :params="{order:param.order?param.order:''}"
          :api_name="database_name"
          :max_num="extendCount"
          :defaultFiled="exportDefaultFiled"
          outdataAction="base"></Export>
      </div>
      <div class="item_content1">
        <el-table ref="ElTable"
          :data="structuralsType==='3'?resJS:res1"
          :height="tableHeight"
          stripe
          fixed
          class="table"
          @sort-change="sortChange"
          :default-sort="order.base ? defaultSort(order.base) : {}"
          style="width: 100%;z-index:1"
          v-if="show_table">
          <el-table-column v-for="item in tableHead"
            :prop="item.field"
            :key="item.field"
            :min-width="item.field_width?item.field_width:100"
            :class="item.font_style"
            :header-cell-style="item.font_style"
            :fixed="item.is_fixed == '1'"
            :sortable="item.order === '1' ? 'custom' : false">
            <!-- 自定义表头 -->
            <template :slot="1 ? 'header':''" slot-scope="scope">
              <span>
                <!-- item.order ? -42 : -25  -->
                <NewProjectGuide  postion="列表" :newPosition="{ top: -5, right: getPositonRight(item.order,item.statement)}" :onlyKey="item['new_id']" display="inline" compoentsName="字段" :initItem="item" :showMenban="item['is_show_new']">{{item.label}}</NewProjectGuide>
                <!-- <img src="/static/imgs/newProjectGuide/new.png" v-if="item['is_show_new']" style="position: absolute;"/> -->
              </span>
              <el-tooltip v-if="item.statement"
                effect="light"
                placement="right">
                <div slot="content"
                  v-html="item.statement"></div>
                <i class="el-icon-question cl-green" style="margin-left: 4px;line-height: 28px;"></i>
              </el-tooltip>
            </template>
            <template slot-scope="scope">
              <div :title="scope.row[item.field]">
                <!-- 有权限 -->
                <!-- :class="{'link-blue': item.urlstyle === '蓝色', 'link-underline': item.urlstyle === '下划线'}" -->
                <span v-if="vueCheckListPms('Database', item.label)"
                  :class="item.font_style">
                  <!-- 下载 - 超链接(路由) -->
                  <TdCountCheckOut v-if="item.readtype == '超链接(路由)' && item.contentname == '下载'"
                    :itemFather="item"
                    :scopeRowAll="scope.row"
                    :scopeRow="checkOne(item, scope.row)">
                    <div>
                      <div class="download"
                        v-if="scope.row[item.parameter]">
                        <router-link class="fujian"
                          :class="{'link-blue': item.urlstyle === '蓝色', 'link-underline': item.urlstyle === '下划线'}"
                          tag="a"
                          :to="item.uri + scope.row[item.parameter] + (item.linkcs ? item.linkcs : '')"
                          :target="item.target === '新窗口' ? '_blank' : '_self'">
                          <i class="iconfont download-icon">&#xe62c;</i>
                        </router-link>
                      </div>
                      <a v-else-if="item.nodata_content&&item.nodata_url"
                        :target="item.target === '新窗口' ? '_blank' : '_self'"
                        :class="{'link-blue': item.urlstyle === '蓝色', 'link-underline': item.urlstyle === '下划线'}"
                        :href="item.nodata_url">{{ overflowEclips(item.nodata_content,item.fieldmax) }}</a>
                      <div v-else>{{ overflowEclips(item.nodata_content,item.fieldmax) }}</div>
                    </div>
                  </TdCountCheckOut>
                  <!-- 中国上市历史 带标签 -->
                  <TdCountCheckOut v-else-if="database_name==='pijian_jinkou_olddata'&&item.field==='pizhunwenhao'"
                    :itemFather="item"
                    :scopeRowAll="scope.row"
                    :scopeRow="scope.row[item.field]"
                    :loading="listLoading">
                   <span>
                      <router-link v-if="scope.row[item.parameter]"
                        :class="{'link-blue': item.urlstyle === '蓝色', 'link-underline': item.urlstyle === '下划线'}"
                        tag="a"
                        :to="item.uri + scope.row[item.parameter] + (item.linkcs ? item.linkcs : '')"
                        :target="item.target === '新窗口' ? '_blank' : '_self'">
                        {{ overflowEclips(checkOne(item, scope.row),item.fieldmax) }}
                      </router-link>
                      <a v-else-if="item.nodata_content&&item.nodata_url"
                        :target="item.target === '新窗口' ? '_blank' : '_self'"
                        :class="{'link-blue': item.urlstyle === '蓝色', 'link-underline': item.urlstyle === '下划线'}"
                        :href="item.nodata_url">{{ overflowEclips(item.nodata_content,item.fieldmax) }}</a>
                      <span v-else>{{overflowEclips(item.nodata_content,item.fieldmax)}}</span>
                      <!-- <div style="width:100%;"> -->
                        <span
                          class="cfdrug-icon"
                          v-if="scope.row.tp"
                          :title="scope.row.tp=='1'?'国产':'进口'"
                        >{{scope.row.tp=='1'?'国产':'进口'}}</span>
                      <!-- </div> -->
                    </span>
                  </TdCountCheckOut>
                  <!-- 下载 - 超链接(特殊域名) -->
                  <TdCountCheckOut v-else-if="item.readtype == '超链接(特殊域名)' && item.contentname == '下载'"
                    :itemFather="item"
                    :scopeRowAll="scope.row"
                    :scopeRow="checkOne(item, scope.row)">
                    <div>
                      <div class="download"
                        v-if="scope.row[item.parameter]">
                        <a class="fujian"
                          :class="{'link-blue': item.urlstyle === '蓝色', 'link-underline': item.urlstyle === '下划线'}"
                          :href="item.uri + scope.row[item.parameter] + (item.linkcs ? item.linkcs : '')"
                          :target="item.target === '新窗口' ? '_blank' : '_self'">
                          <i class="iconfont download-icon">&#xe62c;</i>
                        </a>
                      </div>
                      <a v-else-if="item.nodata_content&&item.nodata_url"
                        :target="item.target === '新窗口' ? '_blank' : '_self'"
                        :class="{'link-blue': item.urlstyle === '蓝色', 'link-underline': item.urlstyle === '下划线'}"
                        :href="item.nodata_url">{{ overflowEclips(item.nodata_content,item.fieldmax) }}</a>
                      <div v-else>{{ overflowEclips(item.nodata_content,item.fieldmax) }}</div>
                    </div>
                  </TdCountCheckOut>
                  <!-- 下载 - 超链接(存储字段) -->
                  <TdCountCheckOut v-else-if="item.readtype == '超链接(存储字段)' && item.contentname == '下载'"
                    :itemFather="item"
                    :scopeRowAll="scope.row"
                    :scopeRow="checkOne(item, scope.row)">
                    <div>
                      <div class="download"
                        v-if="scope.row[item.parameter]">
                        <a class="fujian"
                          :class="{'link-blue': item.urlstyle === '蓝色', 'link-underline': item.urlstyle === '下划线'}"
                          :href="scope.row[item.parameter] + (item.linkcs ? item.linkcs : '')"
                          :target="item.target === '新窗口' ? '_blank' : '_self'">
                          <i class="iconfont download-icon">&#xe62c;</i>
                        </a>
                      </div>
                      <a v-else-if="item.nodata_content&&item.nodata_url"
                        :target="item.target === '新窗口' ? '_blank' : '_self'"
                        :class="{'link-blue': item.urlstyle === '蓝色', 'link-underline': item.urlstyle === '下划线'}"
                        :href="item.nodata_url">{{ overflowEclips(item.nodata_content,item.fieldmax) }}</a>
                      <div v-else>{{ overflowEclips(item.nodata_content,item.fieldmax) }}</div>
                    </div>
                  </TdCountCheckOut>
                  <!-- 下载 - 单独开发(存储字段) -->
                  <div v-else-if="item.readtype == '单独开发' && item.contentname == '下载'">
                    <div class="download"
                      v-if="scope.row[item.parameter] && scope.row['down'].length>0">
                      <template v-if="scope.row['down'].length == 1">
                        <a :href="(scope.row['down'][0].split('=')[1]).substr(1, (scope.row['down'][0].split('=')[1]).length-8)"
                          target="_blank">
                          <i class="iconfont download-icon">&#xe62c;</i>
                        </a>
                      </template>
                      <template v-else>
                        <i class="iconfont download-icon">&#xe62c;</i>
                        <div class="fujian-cl">
                          <span v-for="html in scope.row['down']"
                            v-html="html"></span>
                        </div>
                      </template>
                    </div>
                    <a v-else-if="item.nodata_content&&item.nodata_url"
                      :href="item.nodata_url">{{ overflowEclips(item.nodata_content,item.fieldmax) }}</a>
                    <div v-else>{{ overflowEclips(item.nodata_content,item.fieldmax) }}</div>
                  </div>

                  <!-- 非下载 - 超链接(路由) -->
                  <TdCountCheckOut v-else-if="item.readtype == '超链接(路由)' && item.contentname != '下载'"
                    :itemFather="item"
                    :scopeRowAll="scope.row"
                    :scopeRow="checkOne(item, scope.row)">
                    <span :title="(item.fieldmax?checkOne(item, scope.row):'')">
                      <router-link v-if="scope.row[item.parameter]"
                        :class="{'link-blue': item.urlstyle === '蓝色', 'link-underline': item.urlstyle === '下划线'}"
                        tag="a"
                        :to="item.uri + scope.row[item.parameter] + (item.linkcs ? item.linkcs : '')"
                        :target="item.target === '新窗口' ? '_blank' : '_self'">
                        {{ overflowEclips(checkOne(item, scope.row),item.fieldmax) }}
                      </router-link>
                      <a v-else-if="item.nodata_content&&item.nodata_url"
                        :target="item.target === '新窗口' ? '_blank' : '_self'"
                        :class="{'link-blue': item.urlstyle === '蓝色', 'link-underline': item.urlstyle === '下划线'}"
                        :href="item.nodata_url">{{ overflowEclips(item.nodata_content,item.fieldmax) }}</a>
                      <span v-else>{{overflowEclips(item.nodata_content,item.fieldmax)}}</span>
                    </span>
                  </TdCountCheckOut>
                  <!-- 非下载 - 超链接(特殊域名) -->
                  <TdCountCheckOut v-else-if="item.readtype == '超链接(特殊域名)' && item.contentname != '下载'"
                    :itemFather="item"
                    :scopeRowAll="scope.row"
                    :scopeRow="checkOne(item, scope.row)">

                    <span>
                      <a v-if="scope.row[item.parameter]"
                        :title="(item.fieldmax?checkOne(item, scope.row):'')"
                        :class="{'link-blue': item.urlstyle === '蓝色', 'link-underline': item.urlstyle === '下划线'}"
                        :href="item.uri + scope.row[item.parameter] + (item.linkcs ? item.linkcs : '')"
                        :target="item.target === '新窗口' ? '_blank' : '_self'">
                        {{ checkOne(item, scope.row) }}
                      </a>
                      <a v-else-if="item.nodata_content&&item.nodata_url"
                        :class="{'link-blue': item.urlstyle === '蓝色', 'link-underline': item.urlstyle === '下划线'}"
                        :href="item.nodata_url"
                        :target="item.target === '新窗口' ? '_blank' : '_self'">{{ overflowEclips(item.nodata_content,item.fieldmax) }}</a>
                      <span v-else
                        :title="(item.fieldmax?checkOne(item, scope.row):'')"
                        v-html="overflowEclips(item.nodata_content,item.fieldmax) ">
                      </span>
                    </span>
                  </TdCountCheckOut>
                  <!-- 非下载 - 超链接(存储字段) -->
                  <TdCountCheckOut v-else-if="item.readtype == '超链接(存储字段)' && item.contentname != '下载'"
                    :itemFather="item"
                    :scopeRowAll="scope.row"
                    :scopeRow="checkOne(item, scope.row)">
                    <span>
                      <a v-if="scope.row[item.parameter]"
                        :title="(item.fieldmax?checkOne(item, scope.row):'')"
                        :class="{'link-blue': item.urlstyle === '蓝色', 'link-underline': item.urlstyle === '下划线'}"
                        :href="((scope.row[item.parameter] + item.linkcs).indexOf('http') > -1 ? '': 'http://') + scope.row[item.parameter] + (item.linkcs ? item.linkcs : '')"
                        :target="item.target === '新窗口' ? '_blank' : '_self'">
                        {{ overflowEclips(checkOne(item, scope.row),item.fieldmax) }}
                      </a>
                      <a v-else-if="item.nodata_content&&item.nodata_url"
                        :target="item.target === '新窗口' ? '_blank' : '_self'"
                        :class="{'link-blue': item.urlstyle === '蓝色', 'link-underline': item.urlstyle === '下划线'}"
                        :href="item.nodata_url">{{ overflowEclips(item.nodata_content,item.fieldmax) }}</a>
                      <span v-else>{{ overflowEclips(item.nodata_content,item.fieldmax) }}</span>
                    </span>
                  </TdCountCheckOut>

                  <!-- 非下载 - 超链接 -->
                  <TdCountCheckOut v-else-if="item.readtype == '超链接' && item.contentname != '下载'"
                    :itemFather="item"
                    :scopeRowAll="scope.row"
                    :scopeRow="checkOne(item, scope.row)">
                    <span>
                      <a v-if="scope.row[item.parameter]"
                        :title="(item.fieldmax?checkOne(item, scope.row):'')"
                        :class="{'link-blue': item.urlstyle === '蓝色', 'link-underline': item.urlstyle === '下划线'}"
                        :href="((scope.row[item.parameter] + item.linkcs).indexOf('http') > -1 ? '': 'http://') + scope.row[item.parameter] + (item.linkcs ? item.linkcs : '')"
                        :target="item.target === '新窗口' ? '_blank' : '_self'">
                        {{ overflowEclips(checkOne(item, scope.row),item.fieldmax) }}
                      </a>
                      <a v-else-if="item.nodata_content&&item.nodata_url"
                        :target="item.target === '新窗口' ? '_blank' : '_self'"
                        :class="{'link-blue': item.urlstyle === '蓝色', 'link-underline': item.urlstyle === '下划线'}"
                        :href="item.nodata_url">{{ overflowEclips(item.nodata_content,item.fieldmax) }}</a>
                      <span v-else>{{ overflowEclips(item.nodata_content,item.fieldmax) }}</span>
                    </span>
                  </TdCountCheckOut>

                  <!-- 后端直传html形式 -->
                  <TdCountCheckOut kaifaType="单独开发"
                    v-else-if="item.readtype == '单独开发'"
                    :itemFather="item"
                    :scopeRowAll="scope.row"
                    :scopeRow="scope.row[item.callbackfield]">
                    <!-- 国外药典/临床诊疗指南单独 -->
                    <template v-if="database_name==='foreign'||database_name==='cpg'">
                      <a v-if="scope.row[item.parameter]"
                        :title="(item.fieldmax?checkOne(item, scope.row):'')"
                        :class="{'link-blue': item.urlstyle === '蓝色', 'link-underline': item.urlstyle === '下划线'}"
                        :target="item.target === '新窗口' ? '_blank' : '_self'"
                        :href="item.uri + scope.row[item.parameter] + (item.linkcs ? item.linkcs : '')">{{ overflowEclips(checkOne(item, scope.row),item.fieldmax) }}</a>
                      <a v-else
                        :target="item.target === '新窗口' ? '_blank' : '_self'"
                        :class="{'link-blue': item.urlstyle === '蓝色', 'link-underline': item.urlstyle === '下划线'}"
                        :href="item.nodata_url">{{item.nodata_content}}</a>
                    </template>
                    <span v-else
                      :title="(item.fieldmax?(scope.row[item.callbackfield] ? scope.row[item.callbackfield] : item.nodata_content):'')"
                      v-html="overflowEclips((scope.row[item.callbackfield] ? scope.row[item.callbackfield] : item.nodata_content),item.fieldmax)"></span>
                  </TdCountCheckOut>
                  <!-- 点击后数据库内部搜索跳转形式 -->
                  <TdCountCheckOut v-else-if="item.readtype == '本字段查询'"
                    :itemFather="item"
                    :scopeRowAll="scope.row"
                    :scopeRow="scope.row[item.field]">
                    <span class="link-underline"
                      @click="resolveTdLink(item.field, scope.row[item.field])"
                      :title="(item.fieldmax?(scope.row[item.field] ? scope.row[item.field] : item.nodata_content):'')"
                      v-html="overflowEclips((scope.row[item.field] ? scope.row[item.field] : item.nodata_content),item.fieldmax)"></span>
                  </TdCountCheckOut>
                  <!-- 假冒企业标志 -->
                  <TdCountCheckOut v-else-if="scope.row.fake=='假冒'&&item.field==='manufacturer'"
                    :itemFather="item"
                    :scopeRowAll="scope.row"
                    :scopeRow="scope.row[item.field]"
                    :loading="listLoading">
                    <span
                    :title="scope.row.manufacturer"
                      v-html=" overflowEclips((scope.row[item.field] ? scope.row[item.field] : item.nodata_content),15)">{{scope.row[item.field]}}</span>
                    <span class="db-fake-icon" :title="scope.row.notice">被假冒</span>
                  </TdCountCheckOut>
                  <!-- 分子式统一处理下标 -->
                  <span v-else-if="item.label==='分子式'" v-html="vueFormulationsFormatter(scope.row[item.field])"></span>
                  <!-- 普通文字形式 -->
                  <TdCountCheckOut v-else
                    :itemFather="item"
                    :scopeRowAll="scope.row"
                    :scopeRow="scope.row[item.field]"
                    :loading="listLoading">
                    <span v-html=" overflowEclips((scope.row[item.field] ? scope.row[item.field] : item.nodata_content),item.fieldmax)"></span>
                  </TdCountCheckOut>
                </span>
                <!-- 无权限 -->
                <span v-else
                  class="abandon-click-method">暂无权限</span>
              </div>
            </template>
          </el-table-column>
        </el-table>

      </div>

    </List>

    <div style="positon: relative;">
      <el-pagination v-if="structuralsType=='3'"
        @size-change="handleSizeChangeJS"
        @current-change="handleCurrentChangeJS"
        :current-page="pegeJS"
        :page-sizes="[20, 30, 50]"
        :page-size="pageSizeJS"
        layout="total, sizes, prev, pager, next"
        :total="extendCount"
        :disabled="nopms.fy"
        :class="{'abandon-click-method': nopms.fy}">
      </el-pagination>
      <el-pagination v-else-if="extendCount"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="param.page"
        :page-sizes="[20, 30, 50]"
        :page-size="param.pageSize"
        layout="total, sizes, prev, pager, next"
        :total="extendCount"
        :disabled="nopms.fy"
        :class="{'abandon-click-method': nopms.fy}">
      </el-pagination>
      <span class="out-of-page cl-red">限于内容篇幅，部分结果未予显示</span>
    </div>
    <!-- 图片弹框 -->
    <div class="List_content">
      <div class="clearfix"></div>
      <div id="maginfy-img-wap"
        class="magnify-img dn"
        title="点击返回">
        <i class="el-icon-close"></i>
        <img id="maginfy-outimg"
          src="">
      </div>
    </div>
  </div>
</template>

<script>
  import List from "@/components/layouts/list"
  import Export from "@/components/common/export"
  import TdCountCheckOut from "./tdCountCheckOut"
  import listCheck from "@/components/common/list-check"
  import { mapState } from "vuex"
  import commonMixins from '@/mixins/common.js'
  import setTableHMixins from '@/mixins/setTableH.js'

  export default {
    components: {
      List,
      Export,
      TdCountCheckOut,
      listCheck
    },
    mixins: [
      commonMixins,
      setTableHMixins
    ],
    data() {
      return {
        pegeJS: 1,
        pageSizeJS: 20,
        resJS: [],
        tableHead: [],
        checkallShow: [],
        show_table: true,
        pagePromise: null,
        defaultFiled: [],
        ElTableData: null,
        changeStyle: 'margin-top:-30px;position:static',
        tableHeight: document.documentElement.clientHeight-48-60-35-88,
        actions: 'position:static;float:right;padding:0 15px;'
      }
    },
    computed: {
      ...mapState({
        database_name: state => state.Database.database_name,
        base_conf: state => state.Database.base_conf,
        tableconf: state => state.Database.tableconf,
        extendCount: state => state.Database.extendCount,
        putong: state => state.Database.putong,
        gaoji: state => state.Database.gaoji,
        shaixuan: state => state.Database.shaixuan,
        param: state => state.Database.param,
        listLoading: state => state.Database.listLoading,
        //res1: state => _.keys(state.Database.res1).length ? state.Database.res1 : [],
        nopms: state => state.Database.nopms,
        structuralsType: state => state.Database.structuralsType,
        structuralsParams: state => state.Database.structuralsParams,
        order: state => state.Database.order
      }),
      res1: {
        get: function () {
          return _.keys(Store.state.Database.res1).length ? Store.state.Database.res1 : []
        },
        set: function () {
          Store.commit('Database/res1', val)
        }
      },
      exportDefaultFiled() {
        let arr = []
        for (let item of this.tableconf) {
          if(this.database_name==='pijian_jinkou_olddata'&&item.field==='tp'){
            continue
          }
          arr.push(item)
        }
        return arr
      },
    },
    // safari浏览器回到当前页面会导致样式错乱问题，由于使用了keepalive所以需要在activated生命周期中在调一次计算方法
    activated() {
      this.registerEven();
    },
    watch: {
      res1: {
        handler(val) {
          if (this.structuralsType === '3') {
            this.resJS = val
            this.handleCurrentChangeJS(1)
          }
          this.$nextTick(() => {
            this.registerEven()
          })
        },
        immediate: true
      },
      tableHead: {
        handler(val) {
          this.$nextTick(() => {
            this.registerEven()
          });
        },
        immediate: true,
      },
      tableconf(val){
        let arr = []
        for (let item of this.tableconf) {
          if(this.database_name==='pijian_jinkou_olddata'&&item.field==='tp'){
            continue
          }
          arr.push(item)
        }
        this.defaultFiled = arr
        this.init()
      },
    },
    methods: {
      // 动态计算new标签的right间距(order为排序标签，statement为提示问号)
      getPositonRight(order, statement) {
        if (order && !statement) {
          return -42
        } else if (!order && statement) {
          return -40
        } else if (order && statement) {
          return -58
        } else {
          return -25
        }
      },

      resolveTdLink(type_id, key_word) {
        window.open(`/${this.database_name}?${type_id}=${key_word}`, "_blank")
      },
      checkOne(item, row) {
        if (item.contentname) {
          return item.contentname
        } else if (!item.contentname && row[item.parameter] && item.field == 'NULL') {
          return row[item.parameter]
        } else if (!item.contentname && item.field != 'NULL') {
          return row[item.field]
        }
      },
      init() {
        //初始化表头
        this.tableHead = this.defaultFiled.reduce((res, item) => {
          if (item.checked) {
            res.push(item)
          }
          return res
        }, [])
      },
      handleCurrentChange(val) {
        this.param.page = val
        if (val * this.param.pageSize <= 1500) {
          $('.out-of-page').hide()
          if (this.structuralsType) {
            _.assign(this.param, this.structuralsParams)
            Store.dispatch('Database/nomalSearch', { params: this.param, type: 'post' })
          } else {
            Store.dispatch('Database/nomalSearch', { params: this.param })
          };
        } else {
          $('.out-of-page').show()
        }
      },
      handleSizeChange(val) {
        this.param.page = 1
        this.param.pageSize = val
        if (val * this.param.page <= 1500) {
          $('.out-of-page').hide()
          if (this.structuralsType) {
            _.assign(this.param, this.structuralsParams)
            Store.dispatch('Database/nomalSearch', { params: this.param, type: 'post' })
          } else {
            Store.dispatch('Database/nomalSearch', { params: this.param })
          };
        } else {
          $('.out-of-page').show()
        }
      },
      //前端分页方法
      handleCurrentChangeJS(val) {
        this.pegeJS = val
        this.changePageJS()
      },
      handleSizeChangeJS(val) {
        this.pageSizeJS = val
        this.changePageJS()
      },
      changePageJS() {
        let pageStart = (this.pegeJS - 1) * this.pageSizeJS
        this.resJS = this.res1.slice(pageStart, pageStart + this.pageSizeJS)
      },
      sortChange(column) {
        let sort
        let property = column.prop
        this.tableHead.forEach(element => {
          if(element.field === column.prop && element.order_field){
            property = element.order_field
          }
        });
        // column.order为null时，不排序
        if (column.order) {
          sort = property + " " + (column.order == "descending" ? "desc" : "asc")
        }
        this.param.order = sort
        Store.commit('Database/order', Object.assign({}, this.$store.state.Database.order, { base: sort ? sort : null }))
        Store.dispatch('Database/nomalSearch', { params: this.param })
      },
    },
    created() {
    },
    mounted() {
      // this.registerEven()
    },
    updated() {
      if (this.param.pageSize * this.param.page <= 1500) {
        $('.out-of-page').hide()
      } else {
        $('.out-of-page').show()
      }
      this.vueTogglePmsTooltip()
    },
  }
</script>

<style lang="less" scoped>
@import "~@/assets/less/var.less";
// ipad 层级太深样式不能继承
/deep/ .el-table td .cell > div>span {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  max-height: 35px;
}
// @import "~@/assets/less/app.less";
.List_content {
  #maginfy-img-wap {
    position: fixed;
    left: 0px;
    top: 0px;
    z-index: 1100;
    width: 100vw;
    height: 100vh;
    line-height: 100vh;
    text-align: center;
    background: rgba(102,102,102, .4);
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

.la-list-database {
  .item_top {
    height: 190px;
    padding: 28px 20px 21px 35px;
    display: flex;
    .content_one {
      margin: 0px 5px;
      flex-grow: 1;
      background-color: #f5f8fb;
      padding-right: 30px;
      float: left;
      .content_title {
        padding-top: 15px;
        .content_shenbao {
          width: 140px;
          height: 40px;
          margin: 0 auto;
          line-height: 40px;
          .shenbao_left {
            width: 30px;
            height: 1px;
            background: #4a77e8;
            margin-top: 17px;
            float: left;
          }
          .shenbao_word {
            margin: 0 10px;
            float: left;
            font-size: 14px;
            color: #4a77e8;
          }
        }
      }
      .contents {
        width: 100%;
        padding-left: 34px;
        display: flex;
        .content_total {
          flex-grow: 1;
          width: 52px;
          height: 94px;
          text-align: center;
          float: left;
          margin-right: 36px;
          .total_item1 {
            padding-top: 10px;
            font-size: 12px;
          }
          .total_item2 {
            padding-top: 14px;
            span {
              font-size: 20px;
              color: #4a77e8;
            }
          }
        }
      }
    }
    .content_two {
      margin-left: 12px;
      background-color: #f5f8fb;
      float: left;
      .content_title {
        padding-top: 15px;
        .content_shenbao {
          width: 140px;
          height: 40px;
          margin: 0 auto;
          line-height: 40px;
          .shenbao_left {
            width: 30px;
            height: 1px;
            background: #4a77e8;
            margin-top: 17px;
            float: left;
          }
          .shenbao_word {
            margin: 0 10px;
            float: left;
            font-size: 14px;
            color: #4a77e8;
          }
        }
      }
      .contents {
        background: #5f88eb;
        padding-left: 34px;
        .content_total {
          width: 52px;
          height: 94px;
          text-align: center;
          float: left;
          margin-right: 40px;
          .total_item1 {
            padding-top: 10px;
            font-size: 12px;
          }
          .total_item2 {
            padding-top: 14px;
            span {
              font-size: 20px;
              color: #4a77e8;
            }
          }
        }
      }
    }
    .content_three {
      margin-left: 12px;
      background-color: #f5f8fb;
      float: left;
      .content_title {
        padding-top: 15px;
        .content_shenbao {
          width: 140px;
          height: 40px;
          margin: 0 auto;
          line-height: 40px;
          .shenbao_left {
            width: 30px;
            height: 1px;
            background: #4a77e8;
            margin-top: 17px;
            float: left;
          }
          .shenbao_word {
            margin: 0 10px;
            float: left;
            font-size: 14px;
            color: #4a77e8;
          }
        }
      }
      .contents {
        background: #5f88eb;
        padding-left: 34px;
        .content_total {
          width: 52px;
          height: 94px;
          text-align: center;
          float: left;
          margin-right: 42px;
          .total_item1 {
            padding-top: 10px;
            font-size: 12px;
          }
          .total_item2 {
            padding-top: 14px;
            span {
              font-size: 20px;
              color: #4a77e8;
            }
          }
        }
      }
    }
  }
  .item_content {
    height: 408px;
    padding-left: 34px;
    .chart_box {
      background-color: white;
      float: left;
      .echarts {
        width: 760px;
        height: 400px;
      }
    }
  }
  .item_content1 {
    height: auto;
    background-color: white;
    .el-table {
      .el-table__header-wrapper {
        padding-left: 34px;
        background-color: #eaeef9;
        .el-table__header {
          .has-gutter {
            .el-table_3_column_15 {
              width: 169px !important;
            }
          }
        }
      }
      .el-table__body-wrapper,
      .el-table__fixed-body-wrapper {
        .el-table__body {
          .el-table__row td {
            padding-left: 34px;
            .cfdrug-icon {
              background-color: @Blue;
              color: #fff;
              border-radius: 10px;
              padding: 0px 10px;
              display: inline-block;
              font-size: 12px;
              // height: 20px;
              line-height: 14px;
            }
          }
        }
      }
    }
    .shallow {
      color: #7b8190;
    }
    .bold {
      font-weight: 700;
    }
  }
}
.item_content1 {
  .label {
    text-align: center;
    line-height: 30px;
    margin-left: 30px;
  }
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
.la-list {
  .actions {
    position: static;
    float: right;
    padding: 0 15px 0 0;
  }
}
.db-fake-label{
  display: inline-block;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  width: 100%;
  position: relative;
}
.db-fake-icon{
    line-height: 14px;
    font-size: 12px;
    display: inline-block;
    border-radius: 10px;
    width: 55px;
    // height: 20px;
    background: #f56e6b;
    color: #fff;
    text-align: center;
  }
</style>
