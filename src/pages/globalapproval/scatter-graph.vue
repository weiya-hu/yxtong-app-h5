<template>
  <div class="scatter-graph">
    <LoadingGif :loadFlag="isloading" v-if="isloading"></LoadingGif>
    <Main>
      <div slot="left">
        <Search ref="scatter-search" :value="keyword" :types="types" :areas="areas"
          :areas_formulation="areas_formulation" :filter_loading="filter_loading" @input="inputChange"
          @checkChange="checkedChange" @checkChange2="checkedChange2" @search="search" />
      </div>
      <div class="la-right">
        <section class="sec1 clearfix">
          <div style="display: flex;justify-content: space-between;align-items: center;">
            <span class="database-name">全球上市药品筛选系统</span>
            <div class="top-update-wrap">
              <el-tooltip class="help-tip" effect="light" placement="bottom"
                v-if="help_conf.remark ? help_conf.remark : ''">
                <div slot="content">
                  <el-scrollbar>
                    <div class="tip-content" v-html="help_conf.remark ? help_conf.remark : ''"></div>
                  </el-scrollbar>
                  <a class="btn default" v-if="help_conf.url" :href="help_conf.url" target="_blank">帮助中心</a>
                </div>
                <span><i class="el-icon-warning cl-green pr5"></i>帮助</span>
              </el-tooltip>
              {{ update_conf.log }}
            </div>
          </div>
          <div class="sec1-right"></div>
        </section>
        <section class="sec2">
          <div class="tool-bar">
            <div class="left-tool">
              <div class="tool-filters" v-if="
                selected_types.length > 0 ||
                  selected_areas.length > 0 ||
                  noSelected_areas.length > 0 ||
                  selected_areas_formulation.length.length > 0 ||
                  noSelected_areas_formulation.length > 0
              ">
                <!-- <template v-if="selected_typesArr.length > 0 || selected_areasArr.length > 0">
                  已选条件：
                  <el-tag
                    size="mini"
                    v-for="type in selected_typesArr"
                    :key="type.value"
                    >{{ type.label }}</el-tag
                  >

                  <el-tag
                    size="mini"
                    :type="area.checked == -1 ? 'danger' : 'success'"
                    v-for="area in selected_areasArr"
                    :key="area.value"
                    >{{ area.checked == -1 ? "排除:" : ""
                    }}{{ area.label }}</el-tag
                  >
                  <el-button
                    type="warning"
                    plain
                    size="mini"
                    icon="el-icon-delete"
                    @click="clearFiter"
                    >清空</el-button
                  >
                </template> -->
                <div class="la-optioned clearfix" :class="{
                  'option-min-height': '36px'
                }">
                  <div class="optioned main" style="padding: 0;">
                    <!-- <span
        v-if="Object.keys(storeState.putong).length > 0 || (storeState.gaoji && storeState.gaoji.words) || (storeState.fourth && storeState.fourth.fourth_condition)"
        class="iconfont">&#xe615;</span> -->
                    <!-- 关联查询搜索 -->
                    <span>已选条件：</span>
                    <div class="optioned screen" v-if="selected_types.length > 0">
                      <span class="btn option">
                        <span class="tj">剂型:
                          <span :title="getSourceText(selected_typesArr)">
                            {{
                            handleCutLength(getSourceText(selected_typesArr))
                            }}
                          </span>
                        </span>
                        <span class="el-icon-close" @click="handleSourceCloseClick(0)"></span>
                      </span>
                    </div>
                    <!-- 全球上市条件筛选国家或地区特殊处理 -->
                    <div class="optioned screen" v-if="
                      selected_areas.length > 0 || noSelected_areas.length > 0
                    ">
                      <span class="btn option">
                        <span class="tj">国家或地区(按活性成分) :
                          <span :title="getSourceText(selected_areasArr)">
                            {{
                            handleCutLength(getSourceText(selected_areasArr))
                            }}
                          </span>
                        </span>
                        <span class="el-icon-close" @click="handleSourceCloseClick(1)"></span>
                      </span>
                    </div>
                    <!-- 全球上市条件筛选国家或地区特殊处理 -->
                    <div class="optioned screen" v-if="
                      selected_areas_formulation.length > 0 || noSelected_areas_formulation.length > 0
                    ">
                      <span class="btn option">
                        <span class="tj">国家或地区(按制剂) :
                          <span :title="getSourceText(selected_areas_formulationArr)">
                            {{
                            handleCutLength(getSourceText(selected_areas_formulationArr))
                            }}
                          </span>
                        </span>
                        <span class="el-icon-close" @click="handleSourceCloseClick(2)"></span>
                      </span>
                    </div>
                    <!-- 保存 & 清空 -->
                    <div class="wrap-add-del" v-if="
                      selected_types.length > 0 || selected_areas.length > 0 || selected_areas_formulationArr.length>0
                    ">
                      <span class="btn clear-options" @click="handleAllCloseClick"><i class="el-icon-delete pr5"></i>
                        清空</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="rebackList" @click="rebackList">返回列表</div>
              <div class="tool-out" @click="exportHandler">
                <a class="action-btn" href="javascript:void;">
                  <i class="iconfont">&#xe641;</i>导出
                </a>
              </div>
            </div>
          </div>

          <!-- 如果是IE的话就不显示该组件，此处必须用异步组件 否则页面会崩溃 -->
          <scatterGraphComponent :scatterData="scatterData" :infoObj="infoObj" v-if="!isIE"></scatterGraphComponent>
          <notSupportIE v-else></notSupportIE>
        </section>
      </div>
    </Main>
  </div>
</template>

<script>
import Main from "@/components/layouts/main";
import Search from "./scatter-graph/components/Search";
import Filter from "./scatter-graph/filterState";
import notSupportIE from "@/components/common/not-supportIE.vue";
import { mapState } from "vuex";
import LoadingGif from "@/components/common/globalCom/loading-gif";
const scatterGraphComponent = () => ({
  component: import(
    "@/components/common/globalapproval/scatter-graph-component.vue"
  ),
  delay: 200
});

export default {
  name: "qqywfst",
  data() {
    return {
      update_conf: {},
      help_conf: {},
      isloading: true,
      isIE: window.isIEAndLtIE11,
      scatterData: []
    };
  },
  components: { Main, Search, scatterGraphComponent, notSupportIE, LoadingGif },
  mixins: [Filter],
  mounted() {
    Store.dispatch("Globalapproval/getBaseInfo").then(() => {
      this.vueTogglePmsTooltip()
    })
    this.getBaseInfo();
  },
  methods: {
    handleSourceCloseClick(type) {
      let activeFilter = this.$refs["scatter-search"].activeFilter;
      // 剂型
      if (type == 0) {
        this.$refs["scatter-search"].types = this.$refs[
          "scatter-search"
        ].types.map(item => (item.checked = false));
        // 收起左侧剂型手风琴
        if (activeFilter.includes("type"))
          activeFilter = activeFilter.filter(item => item != "type");
      } else if (type == 1) {
        // 国家或地区(按活性成分)
        this.$refs["scatter-search"].areas = this.$refs[
          "scatter-search"
        ].areas.map(item => (item.checked = 0));
        // 收起左侧国家或地区手风琴
        if (activeFilter.includes("area"))
          activeFilter = activeFilter.filter(item => item != "area");
      } else if (type == 2) {
        // 国家或地区(按制剂)
        this.$refs["scatter-search"].areas_formulation = this.$refs[
          "scatter-search"
        ].areas_formulation.map(item => (item.checked = 0));
        // 收起左侧国家或地区手风琴
        if (activeFilter.includes("areas_formulation"))
          activeFilter = activeFilter.filter(item => item != "areas_formulation");
      }
      this.$refs["scatter-search"].activeFilter = activeFilter;
      this.inputChange(this.keyword);
      this.$nextTick(() => {
        this.search(this.types, this.areas, this.areas_formulation);
      });
    },
    handleAllCloseClick() {
      let activeFilter = this.$refs["scatter-search"].activeFilter;
      // 剂型
      this.$refs["scatter-search"].types = this.$refs[
        "scatter-search"
      ].types.map(item => (item.checked = false));
      console.log(this.$refs["scatter-search"].types);
      // 收起左侧剂型手风琴
      if (activeFilter.includes("type"))
        activeFilter = activeFilter.filter(item => item != "type");

      // 国家或地区(按活性成分)
      this.$refs["scatter-search"].areas = this.$refs[
        "scatter-search"
      ].areas.map(item => (item.checked = 0));
      // 收起左侧国家或地区手风琴
      if (activeFilter.includes("area"))
        activeFilter = activeFilter.filter(item => item != "area");

      // 国家或地区(按制剂)
      this.$refs["scatter-search"].areas_formulation = this.$refs[
        "scatter-search"
      ].areas_formulation.map(item => (item.checked = 0));
      console.log(this.$refs["scatter-search"].areas_formulation);
      // 收起左侧国家或地区手风琴
      if (activeFilter.includes("areas_formulation"))
        activeFilter = activeFilter.filter(item => item != "areas_formulation");
      this.$refs["scatter-search"].activeFilter = activeFilter;
      this.inputChange(this.keyword);
      this.search(
        this.$refs["scatter-search"].types,
        this.$refs["scatter-search"].areas,
        this.$refs["scatter-search"].areas_formulation
      );
    },
    handleCutLength(str) {
      let len = String(str).length > 0;
      let arr = [];
      let ret = "";
      if (len > 40) {
        arr = String(str).split("");
        arr.splice(40, len - 40, "...");
        ret = arr.join("");
      } else {
        ret = str;
      }

      //已选条件的筛选值显示为数字的日志埋点
      let obj = {
        handlerType: "click",
        handlerTypeDesc: "筛选条件查询问题（显示数字、吉非替尼查询为空）",
        filter: str,
        token: GETCOOKIEFUN("accesstoken")
      };
      this.frontEndLog(this.$route.path, obj);
      return ret;
    },
    // 获取全球上市国家
    getSourceText(arr) {
      console.log(arr);
      let strArr = [];
      arr.map(v => {
        if (v.checked == 1) {
          strArr.push(v.label);
        } else if (v.checked == -1) {
          let str = "";
          if (!strArr.includes("排除")) str += "排除";
          str += `${v.label}`;
          strArr.push(str);
        }
      });
      return strArr.join(",");
    },
    rebackList() {
      this.$router.push({
        path: "/globalapproval/list"
      });
    },
    async getDefaultCname() {
      const res = await window
        .Axios({
          method: "get",
          url: "/api/globalapproval/defaultCname",
          params: {
            accesstoken: GETCOOKIEFUN("accesstoken")
          }
        })
        .catch(err => {
          console.log(err);
        });

      if (res.data.code === 200 && res.data.data) {
        let data = res.data.data;
        this.keyword = data;
        this.$refs["scatter-search"].handleSelect(this.keyword); // 默认选中一个关键词
      }
    },
    getBaseInfo() {
      return window
        .Axios({
          method: "get",
          url: "/api/config/view?dbname=globalapproval",
          params: {
            accesstoken: GETCOOKIEFUN("accesstoken")
          }
        })
        .then(res => {
          if (res.data.code === 200 && res.data.data) {
            let data = res.data.data;
            this.helpInfo = data.helpconf;
            this.update_conf = data.updatelog;
            if (
              data.norules.exclusive.filter(item => item.action == "cname")
                .length == 0
            ) {
              if (this.$route.query && this.$route.query.keyword) {
                this.searchObj.keyword = this.$route.query.keyword;
                this.keyword = this.searchObj.keyword;
                this.isloading = true;
                this.$refs["scatter-search"].handleSelect(this.keyword); // 默认选中一个关键词
                setTimeout(() => {
                  this.$nextTick(() => {
                    this.isloading = false;
                  });
                }, 0);
              } else {
                this.getDefaultCname();
              }
            } else {
              this.$router.push({
                path: "/no-permission"
              });
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style lang="less" scoped>
@import "~@/assets/less/var.less";

.scatter-graph {
  .sec2 {
    height: calc(100vh - 46px);

    .tool-bar {
      width: 100%;
      display: flex;
      align-items: center;
      position: relative;

      .left-tool {
        display: flex;
        width: 100%;
        align-items: flex-end;
      }

      .tool-out {
        width: 50px;
        position: absolute;
        right: 10px;
        cursor: pointer;
      }

      .el-tag {
        margin-right: 5px;
      }
    }

    .rebackList {
      width: 86px;
      margin: 10px 0 0 20px;
      height: 24px;
      background: #f4a622;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 400;
      color: #ffffff;
      line-height: 14px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
    }
  }

  /deep/.fullscreen-loading {
    z-index: 999 !important;
  }
}
</style>

<style lang="less" scoped>
@import "~@/assets/less/app.less";
@import "~@/assets/less/var.less";

/* 已选条件 - 样式 start */
.la-optioned {
  padding: 0 0 0px 14px;
  background-color: #fff;

  .btn {
    display: inline-block;
    box-sizing: border-box;
    height: 24px;
    padding: 0px 6px;
    margin: 0 3px;
    line-height: 24px;
    border-radius: 4px;
    color: @White;
  }

  .optioned {
    position: relative;
    // padding-left: 20px;
    display: inline-block;

    .label {
      position: absolute;
      left: 4px;
      top: 2px;
    }

    .option {
      // width: 110px;
      box-sizing: border-box;
      font-size: 12px;
      color: @FontColor;
      background-color: #f6f8fc;
      border: 1px solid @BorderColor;
      margin-bottom: 1px;
      display: inline-block;

      // margin-top: 10px;
      &:hover {
        background-color: #eaeef9;
      }

      .tj {
        // width: 80px;
        display: inline-block;
      }

      .el-icon-close {
        font-weight: bold;
        cursor: pointer;

        &:hover {
          color: @PrimaryColor;
        }
      }
    }

    .show-options {
      .option-logic {
        display: inline-block;
        color: #c0c4cf;
      }
    }
  }

  .wrap-add-del {
    display: inline-block;

    .clear-options {
      background-color: #97a2bf;
      cursor: pointer;

      &:hover {
        background: Lighten(#97a2bf, 10%);
      }
    }
  }
}

/* 已选条件 - 样式 end */
</style>
