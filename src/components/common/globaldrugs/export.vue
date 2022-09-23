<template>
  <div style="display: inline-block" class="global-export">
    <span
      class="action-btn"
      :class="{ 'abandon-click-method': nopms && nopms.dc }"
      @click="handleActionExport()"
    >
      <img
        src="~@/assets/imgs/globaldrugs/export_icon.png"
        width="14px"
        alt=""
      />
      导出
    </span>
    <!-- 导出 - 框体 -->
    <el-dialog
      class="dialog-actions"
      ref="exportDialog"
      :visible.sync="exportVisible"
      :modal-append-to-body="false"
    >
      <div slot="title" class="dialog-header">导出</div>
      <div>
        <p>
          当前数据量为<span class="cl-red">{{ max_num }}</span
          >条，最大导出量为
          <span class="cl-gray1"
            ><span class="cl-red">{{ out_max ? out_max : 300 }}</span
            >条是否导出？</span
          >
        </p>
        <div><b>导出字段</b></div>
        <div class="offset-top">
          <el-checkbox
            :indeterminate="isIndeterminat"
            v-model="checkallExport"
            @change="handleCheckAllExport"
            >全选</el-checkbox
          >
        </div>
        <div class="check-scroll-wrapper">
          <el-scrollbar>
            <el-checkbox-group v-model="exportArr">
              <table class="fields-table">
                <tbody>
                  <tr v-for="(item, index) in exportDefaultFiled" :key="index">
                    <td style="width: 330px">
                      <el-checkbox
                        :label="item.prop ? item.prop : item.field"
                        >{{ item.label }}</el-checkbox
                      >
                    </td>
                  </tr>
                </tbody>
              </table>
            </el-checkbox-group>
          </el-scrollbar>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button class="blue_listCheck" type="primary" @click="handleExport()">确 认</el-button>
        <el-button style="background: #C0C4CC;color: #fff;" @click="handleExportClose()">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import Axios from 'axios'
import { mapState } from "vuex";
import LoadingGif from "@/components/common/globalCom/loading-gif";
export default {
  components: {
    LoadingGif,
  },
  props: {
    vuex_name: {
      // 例如：注册数据库为Zhuce
      default: "",
      type: String,
    },
    api_name: {
      // 例如：注册数据库为zhuce
      default: "",
      type: String,
    },
    max_num: {
      // 当前数据量，例如：注册数据库中按受理号查询为extendCount.BaseCount
      default: 0,
      type: Number,
    },
    out_max: {
      // 最大导出条数，默认为300
      default: 300,
      type: Number,
    },
    defaultFiled: {
      default: [],
      type: Array,
    },
    outdataAction: {
      default: "base",
      type: String,
    },
    params: {
      type: Object,
    },
    otherOut: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      exportVisible: false,
      isIndeterminat: false,
      checkallExport: false,
      exportArr: [],
    };
  },
  computed: {
    storeState() {
      return Store.state[this.vuex_name];
    },
    nopms() {
      return Store.state[this.vuex_name].nopms;
    },
    exportDefaultFiled() {
      let defaultAtt = this.defaultFiled.filter((item) => {
        return item.prop !== "fensantu";
      });
      let arr = [];
      for (let item of defaultAtt) {
        arr.push(item);
      }
      return arr;
    },
  },
  methods: {
    setScrollHeight() {
      this.$nextTick(() => {
        let el =
          this.$refs.exportDialog.$el.getElementsByClassName(
            "el-scrollbar__wrap"
          );
        el[0].style.maxHeight = window.screen.availHeight - 80 - 280 + "px";
      });
    },
    init() {
      //初始化表头和显示像
      this.exportArr = this.exportDefaultFiled.reduce((res, item) => {
        if (item.checked) {
          res.push(item.prop ? item.prop : item.field);
        }
        return res;
      }, []);
    },
    // 导出的全选
    handleCheckAllExport() {
      if (this.checkallExport) {
        this.exportArr = this.exportDefaultFiled.reduce((res, item) => {
          res.push(item.prop ? item.prop : item.field);
          return res;
        }, []);
      } else {
        this.exportArr = [];
      }
      this.isIndeterminat = false;
    },
    handleActionExport() {
      if (this.nopms && !this.nopms.dc) {
        this.exportVisible = true;
        if (this.storeState.allBase) {
          window.ga(
            "send",
            "event",
            "button",
            "click",
            "企业版_全球药物_列表_导出"
          );
          window._paq.push([
            "trackEvent",
            "button",
            "click",
            "企业版_全球药物_列表_导出",
          ]);
        }
      }
    },
    handleExportClose() {
      this.exportVisible = false;
    },
    handleExport() {
      let column = [],
        query = {},
        url = "";
      if (this.exportArr.length < 2) {
        this.$Message.error("请至少勾选两个字段");
        return false;
      }
      _.map(this.exportDefaultFiled, (item) => {
        for (let pt of this.exportArr) {
          if (pt == (item.prop ? item.prop : item.field)) {
            column.push(
              (item.prop ? item.prop : item.field) + "=" + item.label
            );
            break;
          }
        }
      });

      //导出条件
      query = Object.assign(
        {},
        this.storeState.order && this.storeState.order[this.outdataAction]
          ? { order: this.storeState.order[this.outdataAction] }
          : {},
        this.storeState.putong,
        this.storeState.shaixuan,
        this.storeState.hot,
        {
          outdata_action: this.outdataAction,
          outdata_column: _.join(column, ","),
        },
        {
          fourth_condition: this.storeState.fourth
            ? this.storeState.fourth.fourth_condition
            : "",
        }
      );

      url =
        "/api/" +
        this.api_name +
        `/outdata${this.otherOut}?accesstoken=` +
        GETCOOKIEFUN("accesstoken") +
        "&";
      console.log(query);

      // 结束
      if (this.params) {
        query = Object.assign(query, this.params);
      }

      let urlEncode =
        url +
        Qs.stringify(
          this.storeState.gaoji && this.storeState.gaoji.words
            ? this.storeState.gaoji
            : {}
        ) +
        "&" +
        Qs.stringify(query);
      window.open(decodeURI(urlEncode));
      let timeOutId = setTimeout(() => {
        Store.commit(this.vuex_name + "/listLoading", true);
      }, 1000);
      // this.downloadFile(urlEncode);
      window
        .Axios({
          method: "get",
          url: urlEncode,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          responseType: "arraybuffer", //arraybuffer/blob//加上格式，二进制
        })
        .then((res) => {
          clearTimeout(timeOutId);
          Store.commit(this.vuex_name + "/listLoading", false);
          let name = res.headers["file_name_urlencode"];
          const { data } = res;
          if (name) {
            const blob = new Blob([res.data], {
              type: "application/zip;charset=utf-8",
            });
            const fileName =
              decodeURIComponent(name) || (dbname || "数据库") + ".xls"; //下载的文件名称及其后缀，后缀要和后台保持的一致
            let objectURL = window.URL.createObjectURL(blob);
            window.URL.revokeObjectURL(objectURL); // 释放内存
          }
        })
        .catch((err) => {
          clearTimeout(timeOutId);
          Store.commit(this.vuex_name + "/listLoading", false);
          console.info(err);
        });
      this.exportVisible = false;
    },
  },
  created() {
    this.init();
  },
  watch: {
    exportVisible: {
      handler(val) {
        if (val) {
          this.setScrollHeight();
        }
      },
    },
    exportArr(to, now) {
      // console.info(this.checkallShow)
      if (to.length >= this.exportDefaultFiled.length) {
        this.checkallExport = true;
      } else {
        this.checkallExport = false;
      }
    },
  },

  updated() {
    this.vueTogglePmsTooltip();
  },
};
</script>

<style lang="less" scoped>
@import "~@/assets/less/var.less";

.action-btn {
  margin-right: 0 !important;
  &:hover {
    color: @PrimaryColor;
  }
}

.global-export {
  /deep/ .el-checkbox__input.is-checked .el-checkbox__inner,
  /deep/ .el-checkbox__input.is-indeterminate .el-checkbox__inner {
    background-color: #fff;
    border-color: #ebeef5;
  }
  /deep/ .el-checkbox__inner {
    border-color: #ebeef5;
  }
  /deep/ .el-checkbox__input.is-checked + .el-checkbox__label {
    color: #002fa7;
  }
  /deep/ .el-checkbox__inner::after {
    border-color: #ffa914;
  }

  .el-dialog .el-dialog__header .dialog-header {
    color: #333;
    font-size: 16px;

    &::before {
      background-color: #333;
    }
  }

  .blue_listCheck {
    background-color: #002fa7;
    border-radius: 3px;
  }
}
</style>
