<template>
  <div style="display: inline-block">
    <span
      class="action-btn"
      :class="{ 'abandon-click-method': nopms && nopms.dc }"
      @click="handleActionExport()"
    >
      <i class="iconfont">&#xe641;</i> 导出
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
        <el-button type="primary" @click="handleExport()">确 认</el-button>
        <el-button @click="handleExportClose()">取 消</el-button>
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
            this.storeState.allBase.dbename + "_export"
          );
          window._paq.push([
            "trackEvent",
            "button",
            "click",
            this.storeState.allBase.dbename + "_export",
          ]);
        } else if (this.vuex_name == "Database") {
          const { params } = this.$route;
          window.ga(
            "send",
            "event",
            "button",
            "click",
            params.dbname + "_export"
          );
          window._paq.push([
            "trackEvent",
            "button",
            "click",
            params.dbname + "_export",
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

      if (this.vuex_name === "Zhuce") {
        let sgroup = _.cloneDeep(this.storeState.shaixuan);

        // 一个筛选条件需要两个字段传值给后端的数据 特殊处理
        // 获取当前的条件筛选项
        let filterStr = sgroup.filter_condition;
        // 将当前条件筛选项用 _and拆分为数组
        let filterArr = filterStr && filterStr.split(" _and ");
        // 将包含zhuangtai的筛选项先排除掉
        let filterRes =
          filterArr &&
          filterArr.filter((filterStr) => {
            return filterStr.indexOf("zhuangtai") < 0;
          });
        // 判断排除zhuangtai筛选项之后的条件筛选如果还存在则用 _and 拼接，如果不存在则重置为空字符串
        if (filterRes && filterRes.length > 0) {
          sgroup.filter_condition = filterRes.join(" _and ");
        } else {
          sgroup.filter_condition = "";
        }

        console.log(filterRes, sgroup);

        let zhuangtai = [],
          guifanzhuangtaizhongwen = [],
          zhuangtaiString = "",
          guifanzhuangtaizhongwenStr = "";

        // 遍历存储好的key值为zhuangtai的所有筛选项
        this.storeState.shaixuanNodes.length > 0 &&
          this.storeState.shaixuanNodes.map((v) => {
            // 判断param后端给出的唯一标识， 当param为zhuangtai时代表当前筛选项为zhuangtai并赋值给zhuangtai数组，否则为guifanzhuangtaizhongwen字段并赋值给guifanzhuangtaizhongwen数组
            if (v.param === "zhuangtai") {
              zhuangtai.push(v.key);
            } else {
              guifanzhuangtaizhongwen.push(v.key);
            }
          });
        // 当zhuangtai筛选项大于0时，_and拼接
        if (zhuangtai.length > 0) {
          zhuangtaiString = `zhuangtai:${_.join(zhuangtai, "ღ")}`;
        }
        // 当guifanzhuangtaizhongwen筛选项大于0时，zhuangtai筛选项>0时，_or拼接
        if (guifanzhuangtaizhongwen.length > 0 && zhuangtai.length > 0) {
          guifanzhuangtaizhongwenStr = `;guifanzhuangtaizhongwen:${_.join(
            guifanzhuangtaizhongwen,
            "ღ"
          )}`;
        }

        // 当guifanzhuangtaizhongwen筛选项大于0时，zhuangtai筛选项<0时，_and拼接
        if (guifanzhuangtaizhongwen.length > 0 && zhuangtai.length === 0) {
          guifanzhuangtaizhongwenStr = `guifanzhuangtaizhongwen:${_.join(
            guifanzhuangtaizhongwen,
            "ღ"
          )}`;
        }
        console.log(guifanzhuangtaizhongwenStr, zhuangtaiString);
        let zhuangtaiStr = "";
        if (zhuangtaiString || guifanzhuangtaizhongwenStr) {
          zhuangtaiStr =
            " _and zhuangtaiStr=" +
            zhuangtaiString +
            guifanzhuangtaizhongwenStr;
        }

        if (sgroup.filter_condition) {
          sgroup.filter_condition = sgroup.filter_condition + zhuangtaiStr;
        } else {
          sgroup.filter_condition = zhuangtaiStr;
        }
        // ..........结束

        //导出条件
        query = Object.assign(
          {},
          this.storeState.order && this.storeState.order[this.outdataAction]
            ? { order: this.storeState.order[this.outdataAction] }
            : {},
          this.storeState.putong,
          sgroup,
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
      } else {
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
      }

      url =
        "/api/" +
        this.api_name +
        `/outdata${this.otherOut}?accesstoken=` +
        GETCOOKIEFUN("accesstoken") +
        "&";
      console.log(query);
      // 全球上市国家和地区(按活性成分)特殊处理
      if (
        this.storeState.filtersSource &&
        this.storeState.filtersSource.length > 0
      ) {
        let sourceAnd = []; // 接收选中的国家或地区
        let sourceNot = []; // 接收排除的国家或地区
        let sourceAndStr = "";
        let sourceNotStr = "";
        _.map(this.storeState.filtersSource, (item, index) => {
          if (item.checked == 1) {
            sourceAnd.push(item.label);
          } else if (item.checked == -1) {
            sourceNot.push(item.label);
          }
        });
        if (sourceAnd.length > 0) {
          if (query.filter_condition) {
            sourceAndStr = ` _and source=${_.join(sourceAnd, "ღ")}`;
          } else {
            sourceAndStr = `source=${_.join(sourceAnd, "ღ")}`;
          }
        }

        if (sourceNot.length > 0) {
          sourceNot.forEach((item, i) => {
            sourceNotStr += ` _not source=${item}`;
          });
        }

        if (query.filter_condition) {
          query.filter_condition =
            query.filter_condition + sourceAndStr + sourceNotStr;
        } else {
          query.filter_condition = sourceAndStr + sourceNotStr;
        }
      }
      // 结束

      // 全球上市国家和地区(按制剂)特殊处理
      if (
        this.storeState.filtersSourceFormulation &&
        this.storeState.filtersSourceFormulation.length > 0
      ) {
        let sourceFormulationAnd = []; // 接收选中的国家或地区
        let sourceFormulationNot = []; // 接收排除的国家或地区
        let sourceFormulationAndStr = "";
        let sourceFormulationNotStr = "";
        _.map(this.storeState.filtersSourceFormulation, (item, index) => {
          if (item.checked == 1) {
            sourceFormulationAnd.push(item.label);
          } else if (item.checked == -1) {
            sourceFormulationNot.push(item.label);
          }
        });
        if (sourceFormulationAnd.length > 0) {
          if (query.filter_condition) {
            sourceFormulationAndStr = ` _and source_formulation=${_.join(
              sourceFormulationAnd,
              "ღ"
            )}`;
          } else {
            sourceFormulationAndStr = `source_formulation=${_.join(
              sourceFormulationAnd,
              "ღ"
            )}`;
          }
        }

        if (sourceFormulationNot.length > 0) {
          sourceFormulationNot.forEach((item, i) => {
            sourceFormulationNotStr += ` _not source_formulation=${item}`;
          });
        }

        if (query.filter_condition) {
          query.filter_condition =
            query.filter_condition +
            sourceFormulationAndStr +
            sourceFormulationNotStr;
        } else {
          query.filter_condition =
            sourceFormulationAndStr + sourceFormulationNotStr;
        }
      }
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
            // if ('download' in document.createElement('a')) { // 非IE下载
            //   const elink = document.createElement('a')
            //   elink.setAttribute("target","_blank");
            //   elink.download = fileName
            //   elink.style.display = 'none'
            //   elink.href = URL.createObjectURL(blob)
            //   document.body.appendChild(elink)
            //   elink.click()
            //   URL.revokeObjectURL(elink.href) // 释放URL 对象
            //   document.body.removeChild(elink)
            // } else { // IE10+下载
            //   navigator.msSaveBlob(blob, fileName)
            // }
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
</style>
