<template>
  <div class="card-item">
    <div class="list">
      <div v-if="list.length>0" v-for="(listItem,listIndex) in list" :key="listItem.data_id+(listIndex+1)"
        class="list-item">
        <el-popover v-if="isSearch && listItem.detailCount > 0" width="790" placement="bottom"
          popper-class="popper-class" :open-delay="500" trigger="click">
          <div class="lawinfo-modal" v-loading="lawlist.loading">
            <img class="trangle" src="/static/imgs/policies/tooltip.png" alt="" />
            <div class="max-content">
              <el-table tooltip-effect="light" :data="lawlist.currentDatas" style="width: 100%;"
                header-cell-class-name="header-class" cell-class-name="cell-class" class="law-table">
                <el-table-column prop="number" label="序号" :width="50" align="center">
                </el-table-column>
                <el-table-column v-for="item in lawlist.tableHead" :prop="item.field" :width="item.width"
                  :min-width="item.field_width || item.width || 150" :key="item.field" :label="item.label"
                  :header-align="item.align || 'left'" :align="item.align || 'left'"
                  :show-overflow-tooltip="item.field === 'content'">
                  <template slot-scope="{row}">
                    <div v-if="item.field == 'catalogue'" @click="linkDetail(listItem)" style="display: inline;"
                      class="link">
                      {{row[item.field]}}
                    </div>
                    <div v-else-if="item.field === 'content'" @click="linkDetail(listItem)" class="link overflow">
                      {{row[item.field]}}
                    </div>
                    <div v-else class="overflow">
                      {{row[item.field]}}
                    </div>
                  </template>
                </el-table-column>
              </el-table>
              <div class="paganation">
                <el-pagination v-if="lawlist.count>lawlist.pageSize" @current-change="lawlistPageChange"
                  :current-page="lawlist.page" :page-size="lawlist.pageSize" layout="total, prev, pager, next"
                  :total="lawlist.count">
                </el-pagination>
              </div>
            </div>
          </div>

          <div slot="reference" style="display: inline;align-items:center;">
            <span class="title" @click="mouseoverLaws(listItem)" :title="listItem.title">
              <span @click="linkDetail(listItem)" v-html="highlightKeyword(listItem.title)"></span>
              <span class="detailCount" v-if="listItem.detailCount > 0"> ( {{ listItem.detailCount }} 条)</span>
            </span>
            <span class="data_type_cn" :style="data_type_cnBg(listItem.data_type_cn)"
              v-if="isEmpty(listItem.data_type_cn) && data_type_cnShow(listItem.data_type_cn)">{{ listItem.data_type_cn
              }}</span>
          </div>
        </el-popover>
        <div v-else style="display: flex;align-items:center;">
          <div class="title" :title="listItem.title">
            <span @click="linkDetail(listItem)" v-html="highlightKeyword(listItem.title)"></span>
            <span class="detailCount" v-if="listItem.detailCount > 0"> ( {{ listItem.detailCount }} 条)</span>
          </div>
          <span class="data_type_cn" :style="data_type_cnBg(listItem.data_type_cn)"
            v-if="isEmpty(listItem.data_type_cn) && data_type_cnShow(listItem.data_type_cn)">{{ listItem.data_type_cn
            }}</span>
        </div>
        <div class="info-block">
          <div v-if="listItem.tag.length>0" class="tag tags">
            <img src="/static/imgs/policies/tag.png" style="margin-right: 2px" width="12" height="12" />
            <span v-for="tagItem in listItem.tag" @click="linkSearchPage(tagItem)" :key="tagItem" class="tag-text tag"
              style="
                    cursor: pointer;
                    padding: 0 10px;
                    background: #ebeef5;
                  ">
              {{ tagItem}}
            </span>
          </div>

          <div v-if="listItem.pub_dept.length>0" class="tag pub_dept">
            <img src="/static/imgs/policies/company.png" style="margin-right: 2px" width="12" height="12" />
            <span style="display: inline-block;" v-for="(tagItem,tagIndex) in listItem.pub_dept" :key="tagItem"
              class="tag-text">
              {{ formatPub_Dept(tagItem,tagIndex,listItem.pub_dept)}}
            </span>
          </div>

          <div v-if="isEmpty(listItem.pub_num)" class="tag pub_num">
            <img src="/static/imgs/policies/clock.png" style="margin-right: 2px" width="12" height="12" />
            <span class="tag-text">
              {{ listItem.pub_num }}
            </span>
          </div>

          <div v-if="isEmpty(listItem.pub_date_cn)" class="tag pub_date_cn">
            <img src="/static/imgs/policies/clock.png" style="margin-right: 2px" width="12" height="12" />
            <span class="tag-text">
              {{ listItem.pub_date_cn|formatDate}}
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="paganation">
      <el-pagination @current-change="handleCurrentChange($event,tab.key)" :current-page="pageObj[tab.key].page"
        :page-size="pageObj[tab.key].pageSize" layout="total, prev, pager, next, jumper" :total="total">
      </el-pagination>
      <span class="out-of-page cl-red">限于内容篇幅，部分结果未予显示</span>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Moment from "moment"

export default {
  props: {
    // tab数据源
    tabs: {
      type: Array,
      default: () => []
    },
    // 当前tab对象 包含tab名称、数量
    tab: {
      type: Object,
      default: () => ({})
    },
    // 列表数据源
    list: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      page: 1,
      pageSize: 10,
      lawlistLoading: false,
      lawlist: {
        data_id: '',
        currentDatas: [],
        page: 1,
        pageSize: 10,
        count: 0,
        loading: true,
        tableHead: [
          { label: "目录", width: 100, field: "catalogue", align: 'center' },
          { label: "条文内容", field: "content" },
        ],
      },  // 条文内容列表
      cardList: [],
      tabData: [],
      activeNames: [],    // 当前激活的面板(如果是手风琴模式，绑定值类型需要为string，否则为array)
    }
  },
  computed: {
    ...mapState({
      isSearch: (state) => state.Policies.isSearch,
      showPromtNotice: (state) => state.showPromtNotice,
      pageObj: (state) => state.Policies.pageObj,
      parent_type: (state) => state.Policies.parent_type,
      total: (state) => state.Policies.total,
      putong: (state) => state.Policies.putong,
      param: (state) => state.Policies.param,
    })
  },
  filters: {
    formatDate(val) {
      return Moment(val).format("YYYY-MM-DD");
    }
  },
  mounted() {
  },
  methods: {
    data_type_cnShow(data_type_cn) {
      return ['失效', '部分失效', '已被修改', '尚未生效'].includes(data_type_cn)
    },
    data_type_cnBg(data_type_cn) {
      let color = {
        '失效': '#C14A27',
        '部分失效': '#DF9008',
        '已被修改': '#002FA7',
        '尚未生效': '#9AA4B8'
      }
      return `background: ${color[data_type_cn]}`
    },
    indexMethod(index) {
      const page = this.lawlist.page
      const pageSize = this.lawlist.pageSize
      // 当前页数 - 1 * 每页数据条数 + index + 1 
      return (page - 1) * pageSize + index + 1
    },
    lawlistPageChange(page = 1) {
      this.lawlist.page = page;
      this.mouseoverLaws(null, this.lawlist.page);
    },
    // 标题移入交互
    mouseoverLaws: _.throttle(function (item, page) {
      this.lawlist.loading = true;
      this.lawlist.currentDatas = []
      if (!this.isEmpty(page)) {
        this.lawlist.page = 1;
        this.lawlist.pageSize = 10;
        this.lawlist.count = 0;
        this.lawlist.data_id = item.data_id;
      }
      let params = {
        page: this.lawlist.page,
        pageSize: this.lawlist.pageSize,
        data_id: this.lawlist.data_id
      };
      params = _.assign(this.param, params, {
        accesstoken: GETCOOKIEFUN("accesstoken")
      })
      window
        .Axios({
          method: "get",
          url: "/api/policies/lawlist",
          params
        })
        .then((res) => {
          if (res.data.data && res.data.data.res) {
            this.lawlist.currentDatas = res.data.data.res;
            this.lawlist.count = res.data.data.count;
          }
          this.lawlist.loading = false;
        }).catch((err) => {
          console.error(err);
          this.lawlist.loading = false;
        })
    }, 500),
    highlightKeyword(title) {
      function findAll(str, x) {
        var results = [];
        var len = str.length;
        var pos = 0;
        while (pos < len) {
          pos = str.indexOf(x, pos);
          if (pos === -1) break;
          results.push(pos);
          pos = pos + 1;
        }
        return results;
      }
      let text = "";
      function highlight(txt, value) {
        var found = findAll(txt, value);
        // 如果找到了关键词，则加入高亮显示
        if (found.length > 0) {
          for (var i = 0; i < txt.length; i++) {
            for (var j in found) {
              if (i == found[j]) {
                text = txt
                  .split(value)
                  .join(`<span class="keyword">${value}</span>`);
              }
            }
          }
        } else {
          // 没有找到就用原本的title
          text = txt;
        }
      }
      highlight(title, this.putong.keywords);
      return text;
    },
    async linkSearchPage(value) {
      let conditions = [];
      if (value) {
        conditions.push({
          accurate: false,
          atcs_sel: undefined,
          is_show_new: undefined,
          label: "标签",
          logic: "_and",
          name: "tag",
          new_content: undefined,
          new_id: undefined,
          new_type: "1",
          show: undefined,
          statement: undefined,
          type: undefined,
          value: value,
        })
      }
      await Store.commit('Policies/conditions', conditions);
      await Store.commit('Policies/gaoji', this.conditions)
      await Store.dispatch("Policies/nomalSearch");
    },
    linkDetail(obj) {
      let routes = ['commondetail', 'lawdetail', 'guiddetail'],
        path = `/policies/${routes[obj.detail_type]}/${obj.data_id}`
      if (this.isEmpty(this.putong.keywords)) {
        path += `?keywords=${this.putong.keywords}`
      }
      const { href } = this.$router.resolve({
        path,
      });
      window.open(href, "_blank");
    },
    formatPub_Dept(tagItem, tagIndex, pub_dept) {
      return tagItem + (tagIndex < pub_dept.length - 1 ? "、" : "");
    },
    handleCurrentChange(val, key) {
      if (val * this.pageObj[key].pageSize <= 1500) {
        $(".out-of-page").hide();
        Store.commit('Policies/listLoading', true);
        let obj = _.cloneDeep(this.pageObj);
        obj[key].page = val;
        Store.commit('Policies/pageObj', obj);
        this.$emit('handleCurrentChange', obj, key)
      } else {
        $(".out-of-page").show();
      }
    },
    formattedNumber(num) {
      // flag用于判断数字是正数还是负数（true负数）
      let flag = false;
      if (!num) {
        return "";
      }
      if (num < 0) {
        num = Math.abs(num);
        flag = true;
      }
      var num = num.toString();
      let numArry = num.split(".");
      let intPart = Math.trunc(num); // 获取整数部分
      let intPartFormat = intPart
        .toString()
        .replace(/(\d)(?=(?:\d{3})+$)/g, "$1,"); // 将整数部分逢三一断
      var result = "";
      if (numArry[1]) {
        result = intPartFormat + `.${numArry[1]}`;
      } else {
        result = intPartFormat;
      }
      return flag ? `-${result}` : result;
    },
    handlerClick(obj) {
      // this.activeNames = []
      this.activeNames.push(obj.key);
      Store.commit('Policies/parent_type', obj.key);
      this.$emit('handleCurrentChange', obj, this.pageObj[obj.key])
    }
  },
}
</script>

<style lang="less">
.card-item {

  .el-pagination {
    padding: 15px 10px 15px 0;

    .el-select .el-input {
      width: 75px;
    }

    .el-pager li {
      min-width: 28px;
      height: 28px;
      line-height: 28px;
      background: #ffffff;
      border-radius: 4px;
      border: 1px solid #dcdfe6;
      color: #5c6973;
      font-size: 14px;
      font-weight: normal;
    }

    .more {
      margin-left: 8px;
      border: 0 !important;
    }

    .el-icon-more::before {
      color: #DDDDDD;
    }

    .el-pagination__total {
      font-size: 13px;
      color: #5c6973;
      height: 28px;
      line-height: 28px;
    }

    .el-select .el-input .el-input__inner {
      border-radius: 4px;
      border-color: #dcdfe6;
      height: 28px;
      color: #5c6973;
    }

    .btn-prev,
    .btn-next {
      width: 28px;
      height: 28px;
      background: #ffffff;
      border-radius: 4px;
      border: 1px solid #dcdfe6;
      color: #5c6973;
    }

    .btn-next {
      margin-left: 8px;
    }

    .el-pager {
      .number {
        height: 28px;
        line-height: 28px;
        background: #ffffff;
        border-radius: 4px;
        border: 1px solid #dcdfe6;
        color: #666;
        margin-left: 8px;
        font-size: 14px;
        font-weight: normal;
      }

      .active {
        background: #002fa7;
        color: #ffffff;
      }
    }
  }

  .el-tabs__item.is-active>span {
    color: #182462;
    font-weight: 500;
  }

  .el-collapse {
    border: 0 !important;

    .el-collapse-item {
      &:not(:first-child) {
        margin-top: 20px;
      }

      .el-collapse-item__header {
        font-size: 16px;
        color: #182462;
        position: relative;
        height: 40px;
        line-height: 40px;
        box-shadow: 0px 1px 10px 0px rgba(9, 20, 79, 0.1);
        border-radius: 3px 3px 0px 0px;
        padding-left: 10px;
        border: 0 !important;

        .num {
          color: #5c6973;
          font-size: 16px;
          margin-left: 5px;
        }

        .el-collapse-item__arrow {
          margin-right: 0 !important;
        }

        .el-icon-arrow-right {
          width: 14px;
          height: 9px;
          background: url(/static/imgs/policies/right-icon.png) no-repeat center;
          background-size: cover;
          transform: rotate(90deg);
          position: absolute;
          right: 10px;
          top: calc(50% - 5px);

          &.is-active {
            transform: rotate(180deg) !important;
          }

          &::before {
            content: "" !important;
          }
        }
      }

      .el-collapse-item__wrap {
        border: 0 !important;
      }

      .el-collapse-item__content {
        background: #fafbfd;
        border-radius: 3px;
        padding: 15px 10px 20px 10px;
      }
    }
  }

  .list {
    // overflow-y: scroll;
    padding-left: 13px;

    .list-item {

      &:not(:first-child) {
        border-top: 1px dashed #DCDFE6;
        margin-top: 15px;
        margin-bottom: 15px;
        padding-top: 15px;
      }

      .data_type_cn {
        padding: 2px 10px;
        font-size: 12px;
        font-weight: 400;
        color: #FFFFFF;
        border-radius: 2px;
        margin-left: 10px;
      }

      .title {
        height: 22px;
        line-height: 22px;
        font-size: 14px;
        font-weight: 500;
        color: #182462;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        position: relative;
        max-width: 85%;

        .detailCount {
          &:hover {
            font-weight: 600;
            color: #df9008 !important;
            background: none !important;
            border-bottom: 1px solid #df9008;
            cursor: pointer;
          }
        }

        span:hover {
          // font-weight: 600;
          // color: #df9008 !important;
          // background: none !important;
          // border-bottom: 1px solid #df9008;
          cursor: pointer;

          .keyword {
            font-weight: 600;
            color: #df9008 !important;
            background: none !important;
          }
        }
      }

      .info-block {
        width: 100%;
        display: flex;
        // align-items: center;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-top: 6px;

        .tag {
          height: 16px;
          line-height: 16px;
          // display: flex;
          // align-items: center;
          // display: inline-flex;

          img {
            vertical-align: middle;
          }

          // &:nth-of-type(2) {
          //   display: inline-flex;
          //   align-items: center;
          // }

          &:first-child {
            width: auto;
            max-width: 100%;
            flex-shrink: 0;

            .tag-text {
              &:not(:first-child) {
                margin-left: 5px;
              }
            }
          }

          &.tags,
          &.pub_dept {
            width: auto;
            max-width: 100%;
            flex-shrink: 0;
          }

          &.pub_date_cn,
          &.pub_num {
            width: auto;
            flex-shrink: 1;
            min-width: 0;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            display: block;
          }

          &:not(:first-child) {
            margin-left: 15px;
          }

          .tag-text {
            height: 12px;
            line-height: 12px;
            font-size: 12px;
            font-weight: 400;
            color: #5c6973;
            border-radius: 2px;
            white-space: nowrap;
          }

          .tag-text.tag:hover {
            color: #fff;
            background: #DF9008 !important;
          }
        }
      }
    }
  }

  .paganation {
    .out-of-page {
      left: 0 !important;
    }
  }

  .keyword {
    background: #DF9008;
    color: #FFF;
  }
}

.popper-class.el-popper {
  padding: 0 !important;
  border-bottom: 1px solid #002FA7;
}

.law-table.el-table {

  /deep/.el-table--border::after,
  /deep/.el-table--group::after,
  /deep/.el-table::before {
    background: unset !important;
  }

  .header-class {

    &:nth-of-type(1),
    &:nth-of-type(2) {
      .cell {
        justify-content: center;
      }
    }

    th {
      height: 49px;
      line-height: 49px;
      background: #FFF !important;
    }

    .cell {
      height: 49px;
      font-size: 14px;
      font-weight: 600;
      color: #333333;
      line-height: 49px;
      background: #FFF;
      border-bottom: 1px solid #DCDFE6;
    }
  }

  .cell-class {
    height: 48px;
    line-height: 48px;

    &:nth-child(3) {
      .cell {
        padding-right: 43px;
      }
    }

    .cell>div {
      font-size: 14px;
      font-weight: 400;
      color: #333333;
    }

    .overflow {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      display: block;
    }

    .link:hover {
      // font-weight: 600;
      color: #df9008 !important;
      background: none !important;
      border-bottom: 1px solid #df9008;
      cursor: pointer;
      display: block;
    }

  }

  .el-table__row:not(:last-child) {
    .cell-class {
      border-bottom: 1px dashed #DCDFE6;
    }
  }
}
</style>

<style lang="less" scoped>
.el-table--border::after,
.el-table--group::after,
.el-table::before {
  background: unset !important;
}

/deep/.el-pagination {
  .btn-prev,
  .btn-next {
    height: 28px;
    width: 28px;
    line-height: 28px;
    padding-right: 0px;
    padding-left: 0px;
    border: 1px solid #dfe5f1;
    border-radius: 4px;
    margin-right: 8px;
  }

  .el-pager li {
    min-width: 28px;
    height: 28px;
    line-height: 28px;
    border: 1px solid #dfe5f1;
    border-radius: 4px;
    margin-right: 8px;
    background-color: #fff;
    font-weight: normal;
  }

  .el-pager li.active {
    color: #fff;
    background-color: #3556b9;
  }

  .el-pagination__total {
    min-width: 28px;
    height: 28px;
    line-height: 28px;
  }

  .el-input__inner {
    border-radius: 4px;
    font-size: 13px;
  }
}

.el-pagination {
  padding: 15px 10px 15px 0;

  .el-select .el-input {
    width: 75px;
  }

  .el-pager li {
    min-width: 28px;
    height: 28px;
    line-height: 28px;
    background: #ffffff;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    color: #5c6973;
    font-size: 14px;
    font-weight: normal;
  }

  .more {
    margin-left: 8px;
    border: 0 !important;
  }

  .el-icon-more::before {
    color: #DDDDDD;
  }

  .el-pagination__total {
    font-size: 13px;
    color: #5c6973;
    height: 28px;
    line-height: 28px;
  }

  .el-select .el-input .el-input__inner {
    border-radius: 4px;
    border-color: #dcdfe6;
    height: 28px;
    color: #5c6973;
  }

  .btn-prev,
  .btn-next {
    width: 28px;
    height: 28px;
    background: #ffffff;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    color: #5c6973;
  }

  .btn-next {
    margin-left: 8px;
  }

  .el-pager {
    .number {
      height: 28px;
      line-height: 28px;
      background: #ffffff;
      border-radius: 4px;
      border: 1px solid #dcdfe6;
      color: #666;
      margin-left: 8px;
      font-size: 14px;
      font-weight: normal;
    }

    .active {
      background: #002fa7;
      color: #ffffff;
    }
  }
}

.lawinfo-modal {
  position: relative;
  box-shadow: 0 1px 20px 0 rgba(9, 20, 79, .3);

  .el-pagination {
    margin-left: 10px;
  }

  .trangle {
    width: 22px;
    height: 22px;
    position: absolute;
    right: 0;
    top: 0;
    z-index: 99;
  }

  .link {
    font-size: 13px;
    font-weight: 400;
    color: #4877E8;
    cursor: pointer;
    overflow: unset;
  }

  .overflow {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    display: block;
  }

  .td-line2 {
    height: 38px;
    font-size: 13px;
    font-weight: 400;
    color: #545B6D;
    line-height: 19px;
    max-height: unset;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    text-overflow: ellipsis;
  }
}
</style>