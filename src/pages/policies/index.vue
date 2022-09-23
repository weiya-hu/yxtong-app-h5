 <template>
  <div
    class="policies-home"
    :style="{
      minHeight: showPromtNotice ? 'calc(100vh - 78px)' : 'calc(100vh - 48px)',
      paddingTop: showPromtNotice ? '78px' : '48px',
    }"
  >
    <!-- 自定义加载界面 -->
    <LoadingGif :loadFlag="isLoading" v-if="isLoading"></LoadingGif>
    <!-- 搜索模块 -->
    <div class="policies-top">
      <div class="policies-search">
        <el-checkbox-group v-model="keywordsType" :min="1">
          <el-checkbox
            v-for="item in keywordsTypeList"
            :label="item.type"
            :key="item.type"
            >{{ item.name }}</el-checkbox
          >
        </el-checkbox-group>
        <div class="search-box">
          <el-input
            placeholder="请输入关键词"
            v-model="keywords"
            id="searchinput"
            @keyup.enter.native="handleSearch"
          >
          </el-input>
          <div class="serach-high-btn" @click="handleAdvancedClick">
            高级搜索
          </div>
          <div class="serach-btn" @click="handleSearch"></div>
        </div>

        <div class="search-hot" v-if="searchHotTagList.length > 0">
          <img src="/static/imgs/policies/hot.png" alt="" />
          <span class="hot-title">热门搜索：</span>
          <span
            class="hot-tag"
            v-for="item in searchHotTagList"
            :key="item"
            @click="handleHotSearch(item)"
            >{{ item }}</span
          >
        </div>
      </div>
    </div>
    <!-- 最新发布、热门标签 -->
    <div class="policies-middle">
      <!-- 最新发布 -->
      <div class="policies-new">
        <div class="title">
          <h4>最新发布</h4>
          <div @click="lookMore">查看更多</div>
        </div>

        <template>
          <div v-for="item in newList" :key="item.data_id" class="new-box">
            <!-- 日期 -->
            <div class="new-date">
              <div class="year">{{ item.pub_date_cn.substring(0, 4) }}</div>
              <div class="date">
                {{ item.pub_date_cn.substring(5, 10).replace(/-/, "/") }}
              </div>
            </div>
            <!-- 内容 -->
            <div class="new-content">
              <h4
                class="content-title"
                :title="item.title"
                @click="toDetail(item.data_id, item.detail_type, '最新发布')"
              >
                {{ item.title }}
              </h4>
              <div class="content-tag">
                <div class="tag-wapper">
                  <div v-if="item.tag.length > 0" class="box-tag">
                    <img
                      src="/static/imgs/policies/tag.png"
                      width="12"
                      alt=""
                    />
                    <span
                      class="tag"
                      v-for="txt in item.tag"
                      :key="txt"
                      @click="handleTagClick(txt, '最新发布')"
                      >{{ txt }}</span
                    >
                  </div>
                  <div v-if="item.pub_dept.length > 0" class="box-dept">
                    <img
                      src="/static/imgs/policies/dept.png"
                      width="12"
                      alt=""
                    />
                    <span class="dept" v-for="(t, i) in item.pub_dept" :key="t"
                      >{{ t
                      }}<span v-if="i !== item.pub_dept.length - 1"
                        >、</span
                      ></span
                    >
                  </div>
                </div>

                <div v-if="item.pub_num" class="box-num">
                  <img src="/static/imgs/policies/num.png" width="12" alt="" />
                  <span>{{ item.pub_num }}</span>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>

      <!-- 热门标签 -->
      <div class="policies-tag">
        <div class="tag-top">
          <div class="title">
            <img src="/static/imgs/policies/hot.png" width="15" alt="" />
            热门标签
          </div>

          <div class="tag-box">
            <div v-for="(item, index) in hotTagList" :key="index" class="tag">
              <div class="text">
                <span
                  class="num"
                  :style="{
                    color:
                      index == 0
                        ? '#F98055'
                        : index == 1
                        ? '#7DCBF0'
                        : index == 2
                        ? '#E7AF2F'
                        : '#9AA4B8',
                  }"
                  >{{ index + 1 < 10 ? `0${index + 1}` : index + 1 }}</span
                >
                <span
                  class="txt"
                  @click="handleTagClick(item.tag, '热门标签')"
                  :style="{
                    fontWeight:
                      index == 0 || index == 1 || index == 2 ? '500' : '400',
                  }"
                  >{{ item.tag }}</span
                >
              </div>
              <div class="count">
                {{ item.doc_count }}
              </div>
            </div>
          </div>
        </div>

        <a
          href="https://report.yaozh.com/"
          target="_blank"
          style="width: 310px; height: 230px; margin-top: 10px; display: block"
        >
          <img
            src="/static/imgs/policies/banner.jpg"
            alt=""
            style="width: 100%; height: 100%; border-radius: 3px"
          />
        </a>
      </div>
    </div>

    <!-- 发展历程 -->
    <div class="policies-bottom">
      <div class="title">
        <h4>发展历程</h4>
        <a href="https://www.yaozh.com/zt/dsj" target="_blank"
          >医药研发大事年表</a
        >
      </div>

      <div class="policies-ypzc">
        <span class="ypzc-title">药品注册</span>
        <div class="year">
          <span>选择年份：</span>
          <el-select
            v-model="year"
            type="mini"
            @change="handleYearChange"
            v-if="years.length"
          >
            <el-option
              v-for="(item, index) in years"
              :key="index"
              :value="item"
            >
            </el-option>
          </el-select>
        </div>
      </div>

      <div class="ypzc-content">
        <div class="year">
          {{ ypzcData.currentYear }}年
          <span class="circle"></span>
        </div>

        <div class="ypzc-wapper">
          <div
            v-for="(item, index) in ypzcData.res"
            :key="index"
            class="content-box"
          >
            <div class="date">
              {{ item.pub_date_cn.substring(5, 10).replace(/-/, "/") }}
            </div>

            <div class="info">
              <span>{{ item.pub_dept.join("、") }}</span
              >发布了<span
                class="info-title"
                @click="
                  toDetail(item.data_id, item.detail_type, '发展历程_药品注册')
                "
                >{{ item.title }}</span
              >
            </div>
          </div>
        </div>
      </div>
      <!-- 年份切换 -->
      <div class="year-switch" v-if="ypzcData.lastYear || ypzcData.nextYear">
        <div
          class="last-yaer"
          v-if="ypzcData.lastYear"
          @click="handleClickYear(ypzcData.lastYear, '上一年')"
        >
          <i class="el-icon-arrow-left"></i>
          上一年
        </div>
        <div
          class="next-year"
          v-if="ypzcData.nextYear"
          @click="handleClickYear(ypzcData.nextYear, '下一年')"
        >
          下一年
          <i class="el-icon-arrow-right"></i>
        </div>
      </div>
    </div>

    <!-- footer -->
    <div class="policies-footer">
      Copyright © 2009-{{ fullYear }} YAOZH.COM All Rights Reserved
    </div>

    <!-- 高级搜索弹出框 -->
    <el-dialog
      :visible.sync="dialogFormVisible"
      :modal-append-to-body="false"
      width="815px"
    >
      <div slot="title" class="dialog-header">高级搜索</div>

      <Advanced
        :dialogFormVisible="dialogFormVisible"
        vuex_name="Policies"
        api_name="policies"
        route1="list"
        @closeAdvancedDialog="closeAdvancedDialog"
        @clearLeft="clearLeft"
        ref="advanced"
      ></Advanced>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import LoadingGif from "@/components/common/globalCom/loading-gif";
import Advanced from "@/components/common/advanced";
export default {
  components: {
    LoadingGif,
    Advanced,
  },
  computed: {
    //同时获取多个属性
    ...mapState({
      showPromtNotice: (state) => state.showPromtNotice,
      advanced_filed: (state) => state.Policies.advanced_filed,
      nopms: (state) => state.Policies.nopms,
    }),
  },
  data() {
    return {
      vuex_name: "Policies",
      dialogFormVisible: false, //控制高级搜索弹框
      isLoading: true,
      keywordsType: ["title", "tag"],
      keywordsTypeList: [
        {
          name: "标题",
          type: "title",
        },
        {
          name: "标签",
          type: "tag",
        },
        {
          name: "正文",
          type: "content",
        },
      ],
      keywords: "",
      searchHotTagList: [],
      newList: [], // 最新发布数据
      hotTagList: [], // 热门标签
      years: [], // 年份列表
      year: "", // 某一年
      ypzcData: {},
      fullYear: new Date().getFullYear(),
    };
  },
  methods: {
    // 获取搜索热词
    getSearchHotTagList() {
      window
        .Axios({
          method: "get",
          url: "/api/search/hot?type=policies",
          params: {
            accesstoken: GETCOOKIEFUN("accesstoken"),
          },
        })
        .then((res) => {
          if (res.data.code === 200 && res.data.data) {
            this.searchHotTagList = res.data.data;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 获取最新发布
    getNewList() {
      this.isLoading = true;
      window
        .Axios({
          method: "get",
          url: "/api/policies/newest",
          params: {
            accesstoken: GETCOOKIEFUN("accesstoken"),
            page: 1,
            pageSize: 10,
          },
        })
        .then((res) => {
          this.isLoading = false;
          if (res.data.code === 200 && res.data.data) {
            this.newList = res.data.data.res;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    // 最新发布查看更多
    lookMore() {
      window.ga(
        "send",
        "event",
        "button",
        "click",
        "企业版_政策法规_最新发布_查看更多_查看更多"
      );
      window._paq.push([
        "trackEvent",
        "button",
        "click",
        "企业版_政策法规_最新发布_查看更多_查看更多",
      ]);
      this.$router.push({ path: "/policies/list" });
    },

    // 获取热门标签
    getHotTagList() {
      window
        .Axios({
          method: "get",
          url: "/api/policies/tags",
          params: {
            accesstoken: GETCOOKIEFUN("accesstoken"),
          },
        })
        .then((res) => {
          if (res.data.code === 200 && res.data.data) {
            this.hotTagList = res.data.data;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    // 获取药品注册年份
    getYears() {
      window
        .Axios({
          method: "get",
          url: "/api/policies/devyear",
          params: {
            accesstoken: GETCOOKIEFUN("accesstoken"),
          },
        })
        .then((res) => {
          if (res.data.code === 200 && res.data.data) {
            this.years = res.data.data;
            this.year = res.data.data[0] || "";
            this.getYpzcData();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    // 获取药品注册列表数据
    getYpzcData() {
      window
        .Axios({
          method: "get",
          url: "/api/policies/devlist",
          params: {
            accesstoken: GETCOOKIEFUN("accesstoken"),
            year: this.year,
          },
        })
        .then((res) => {
          if (res.data.code === 200 && res.data.data) {
            this.ypzcData = res.data.data;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    handleYearChange() {
      window.ga(
        "send",
        "event",
        "button",
        "click",
        `企业版_政策法规_发展历程_药品注册_选择年份`
      );
      window._paq.push([
        "trackEvent",
        "button",
        "click",
        `企业版_政策法规_发展历程_药品注册_选择年份`,
      ]);
      this.getYpzcData();
    },

    // 上一年下一年点击事件
    handleClickYear(year, text) {
      window.ga(
        "send",
        "event",
        "button",
        "click",
        `企业版_政策法规_发展历程_药品注册_${text}`
      );
      window._paq.push([
        "trackEvent",
        "button",
        "click",
        `企业版_政策法规_发展历程_药品注册_${text}`,
      ]);
      this.year = year;
      this.getYpzcData();
    },

    // 跳转到详情页
    toDetail(id, type, text) {
      window.ga(
        "send",
        "event",
        "button",
        "click",
        `企业版_政策法规_${text}_详情页跳转`
      );
      window._paq.push([
        "trackEvent",
        "button",
        "click",
        `企业版_政策法规_${text}_详情页跳转`,
      ]);
      let path;
      if (type == 0) {
        path = `/policies/commondetail/${id}`;
      } else if (type == 1) {
        path = `/policies/lawdetail/${id}`;
      } else {
        path = `/policies/guiddetail/${id}`;
      }
      let routeData = this.$router.resolve({
        path: path,
      });
      window.open(routeData.href, "_blank");
    },

    // 点击左侧栏中的“高级搜索”触发的事件
    handleAdvancedClick() {
      if (!this.nopms.gjss) {
        this.dialogFormVisible = true;

        if (this.$refs.advanced) {
          // 第一次点击之后才渲染，所以加此判定
          this.$refs.advanced.initConditions();
        }
      }
      window.ga(
        "send",
        "event",
        "botton",
        "click",
        "advanced_search",
        "search"
      );
      window._paq.push([
        "trackEvent",
        "botton",
        "click",
        "advanced_search",
        "search",
      ]);
    },

    // 关闭高级搜索框（可能并没有起作用，可有可无）
    closeAdvancedDialog() {
      this.dialogFormVisible = false;
    },
    // 高级搜索框中：点击搜索后，清空左侧普通搜索内容（仅肉眼）事件
    clearLeft() {
      this.vueClearLeft();
    },

    // 关键词检索触发的点击事件
    async handleSearch() {
      // if (this.keywords) {
      await Store.commit(this.vuex_name + "/query", {
        opt: 1,
        param: {
          name: "keywords",
          label: "关键词检索",
          value: this.keywords,
          type: "text",
        },
      });
      await Store.commit(this.vuex_name + "/query", {
        opt: 1,
        param: {
          name: "keywordsType",
          label: "",
          value: this.keywordsType.join(","),
          type: "policiescheck",
        },
      });
      await Store.commit(
        this.vuex_name + "/queryStr",
        Store.state[this.vuex_name].query
      );
      await this.$router.push({ path: "/policies/list" });

      console.log(Store.state[this.vuex_name].query);
    },
    // 热门搜索
    async handleHotSearch(item) {
      this.keywordsType = ["title", "tag"];
      this.keywords = item;
      if (this.keywords) {
        await Store.commit(this.vuex_name + "/query", {
          opt: 1,
          param: {
            name: "keywords",
            label: "关键词检索",
            value: this.keywords,
            type: "text",
          },
        });
        await Store.commit(this.vuex_name + "/query", {
          opt: 1,
          param: {
            name: "keywordsType",
            label: "",
            value: this.keywordsType.join(","),
            type: "policiescheck",
          },
        });
        await Store.commit(
          this.vuex_name + "/queryStr",
          Store.state[this.vuex_name].query
        );
        await this.$router.push({ path: "/policies/list" });
      }
    },

    // 标签点击跳转
    async handleTagClick(item, text) {
      window.ga(
        "send",
        "event",
        "button",
        "click",
        `企业版_政策法规_${text}_标签`
      );
      window._paq.push([
        "trackEvent",
        "button",
        "click",
        `企业版_政策法规_${text}_标签`,
      ]);
      let tagArr = [],
        tagObj = {
          accurate: false,
          label: "标签",
          logic: "_and",
          name: "tag",
          new_type: "1",
          value: item,
        };
      tagArr.push(tagObj);

      await Store.commit(this.vuex_name + "/conditions", tagArr);

      await this.$router.push({ path: "/policies/list" });
    },
  },
  mounted() {
    this.getSearchHotTagList();
    this.getNewList();
    this.getHotTagList();
    this.getYears();
    Store.dispatch("Policies/getBaseInfo").then(() => {
      this.vueTogglePmsTooltip();
    });
    this.vueRouteFrom("Policies");
    localStorage.setItem("firstInPolicies", true);
    this.$nextTick(() => {
      setTimeout(() => {
        console.log(document.getElementById("searchinput"));
        document.getElementById("searchinput").focus();
      }, 500);
    });
  },
};
</script>
<style lang="less" scoped>
.el-select-dropdown__item.selected {
  color: #182462 !important;
}
.policies-home {
  background: #f5f8fc;

  .dialog-header {
    color: #09144f;

    &::before {
      background-color: #09144f;
    }
  }

  /deep/ .el-dialog__close:hover {
    color: #09144f !important;
  }

  /deep/ .dialog-footer {
    .el-button:focus,
    .el-button:hover {
      color: #09144f;
      border-color: #dfe5f1;
    }

    .ad-search {
      background-color: #09144f;
      border-color: #09144f;
      &:hover {
        color: #fff;
      }
    }
  }

  /deep/ .btn-advanced-add {
    color: #09144f !important;
    background-color: #fff;
    border: 1px solid #09144f !important;

    &:hover {
      color: #fff !important;
      background-color: #09144f !important;
    }
  }

  /deep/ .el-input.is-focus .el-input__inner,
  /deep/ .el-input__inner:focus {
    border-color: #09144f;
  }

  .policies-top {
    height: 252px;
    background: #09144f;
    position: relative;

    .policies-search {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);

      .el-checkbox-group {
        margin-left: 30px;
        /deep/ .el-checkbox__label {
          color: #ffffff;
          font-size: 14px;
          font-weight: 400;
        }
        /deep/ .el-checkbox__input.is-checked + .el-checkbox__label {
          color: #e7af2f;
        }
        /deep/ .el-checkbox__inner {
          width: 14px;
          height: 14px;
          background-color: #3c4979;
          border-color: transparent;
        }

        /deep/ .el-checkbox__input.is-checked .el-checkbox__inner,
        /deep/ .el-checkbox__input.is-indeterminate .el-checkbox__inner {
          background-color: #e7af2f;
          border-color: #e7af2f;
        }
      }

      .search-box {
        margin: 15px 0;
        position: relative;
        .el-input {
          font-size: 14px;
        }
        /deep/ .el-input__inner {
          width: 560px;
          height: 40px;
          background: #3d4778;
          border-radius: 20px;
          border-color: #3d4778;
          color: #ffffff;
          padding: 0 30px;
          font-size: 14px;
        }

        .serach-btn {
          text-decoration: none;
          position: absolute;
          top: 10px;
          right: 30px;
          width: 20px;
          height: 20px;
          transition: all 300ms;
          transform: scale(1) rotate(0deg);
          background: url("~@/assets/imgs/trz/search-trz.png") no-repeat center;
          background-size: 20px 20px;
          cursor: pointer;
        }

        .serach-high-btn {
          font-size: 14px;
          font-weight: 500;
          color: #e7af2f;
          text-decoration: underline;
          position: absolute;
          right: -80px;
          top: 10px;
          cursor: pointer;
        }
      }

      .search-hot {
        margin-left: 30px;
        width: 500px;
        img {
          width: 12px;
          height: 14px;
          vertical-align: text-bottom;
        }

        .hot-title {
          font-size: 14px;
          font-weight: 400;
          color: #b5c3d3;
        }

        .hot-tag {
          font-weight: 400;
          color: #ffffff;
          font-size: 14px;
          margin-right: 10px;
          cursor: pointer;

          &:hover {
            color: #df9008;
            text-decoration: underline;
          }
        }
      }
    }
  }

  .policies-middle {
    width: 1200px;
    height: 690px;
    margin: 10px auto;
    display: flex;

    .policies-new {
      width: 880px;
      padding: 0 20px;
      box-sizing: border-box;
      background: #ffffff;
      box-shadow: 0px 1px 10px 0px rgba(9, 20, 79, 0.1);
      border-radius: 3px;

      .title {
        height: 45px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #ebeef5;

        h4 {
          font-size: 18px;
          font-weight: 500;
          color: #182462;
          position: relative;

          &::before {
            content: "";
            position: absolute;
            width: 72px;
            height: 3px;
            background: #182462;
            border-radius: 2px;
            left: 0;
            bottom: -8px;
          }
        }

        div {
          cursor: pointer;
          font-size: 14px;
          color: #9aa4b8;
        }
      }

      .new-box {
        display: flex;
        margin: 19px 0;

        .new-date {
          text-align: right;
          margin-right: 20px;
          .year {
            font-size: 13px;
            font-weight: 400;
            color: #5c6973;
            line-height: 18px;
          }

          .date {
            font-size: 16px;
            font-weight: 400;
            color: #333333;
            line-height: 22px;
          }
        }
        .new-content {
          .content-title {
            width: 770px;
            margin-bottom: 4px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            font-weight: 500;
            color: #182462;
            line-height: 20px;
            font-size: 14px;
            cursor: pointer;

            &:hover {
              font-weight: 600;
              color: #df9008;
              text-decoration: underline;
            }
          }

          .content-tag {
            display: flex;

            .tag-wapper {
              display: flex;
              width: auto;
              max-width: 100%;
              flex-shrink: 0;
            }

            .box-tag {
              width: auto;
              max-width: 100%;
              flex-shrink: 0;
              margin-right: 10px;

              .tag {
                display: inline-block;
                height: 20px;
                line-height: 20px;
                text-align: center;
                padding: 0 10px;
                background: #ebeef5;
                border-radius: 2px;
                margin-right: 5px;
                cursor: pointer;
                color: #5c6973;

                &:hover {
                  background: #df9008;
                  color: #fff;
                }
              }
            }

            .box-dept {
              width: auto;
              flex-shrink: 1;
              min-width: 0;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              margin-right: 10px;

              .dept {
                color: #5c6973;
              }
            }

            .box-tag,
            .box-dept,
            .box-num {
              img {
                margin-right: 2px;
                position: relative;
                top: 1px;
              }
            }

            .box-num {
              width: auto;
              flex-shrink: 1;
              min-width: 0;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
          }
        }
      }
    }

    .policies-tag {
      margin-left: 10px;
      width: 310px;

      .tag-top {
        background: #ffffff;
        box-shadow: 0px 1px 10px 0px rgba(9, 20, 79, 0.1);
        border-radius: 3px;
      }

      .title {
        height: 45px;
        display: flex;
        align-items: center;
        padding: 0 20px;
        background: #ffffff;
        box-shadow: 0px 1px 10px 0px rgba(9, 20, 79, 0.1);
        font-size: 18px;
        font-weight: 500;
        color: #182462;
        img {
          margin-right: 8px;
        }
      }

      .tag-box {
        height: 388px;

        .tag {
          display: flex;
          justify-content: space-between;
          padding: 0 20px;
          box-sizing: border-box;
          margin: 16px 0;

          .num,
          .count {
            color: #9aa4b8;
            font-size: 14px;
          }

          .txt {
            color: #333333;
            font-size: 14px;
            margin-left: 10px;
            cursor: pointer;

            &:hover {
              color: #df9008;
              text-decoration: underline;
            }
          }
        }
      }
    }
  }

  .policies-bottom {
    width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    background: #ffffff;
    box-sizing: border-box;
    box-shadow: 0px 1px 10px 0px rgba(9, 20, 79, 0.1);
    border-radius: 3px;

    .title {
      height: 46px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #ebeef5;

      h4 {
        font-size: 18px;
        font-weight: 500;
        color: #182462;
        position: relative;

        &::before {
          content: "";
          position: absolute;
          width: 72px;
          height: 3px;
          background: #182462;
          border-radius: 2px;
          left: 0;
          bottom: -8px;
        }
      }

      a {
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        color: #182462;

        &:hover {
          color: #df9008;
          text-decoration: underline;
        }
      }
    }

    .policies-ypzc {
      margin-top: 20px;
      margin-bottom: 5px;
      height: 40px;
      box-shadow: 0px 1px 10px 0px rgba(9, 20, 79, 0.1);
      border-radius: 3px 3px 0px 0px;
      padding: 0 20px;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .ypzc-title {
        font-size: 16px;
        font-weight: 500;
        color: #182462;
      }

      .year {
        font-size: 14px;
        color: #5c6973;
      }

      .el-select {
        width: 100px;
      }

      /deep/ .el-input {
        font-size: 13px;

        .el-input__inner {
          height: 20px;
          border-radius: 3px;
          border: 1px solid #dcdfe6;
          color: #333333;
        }

        .el-select__caret {
          color: #9aa4b8;
        }
      }
    }

    .ypzc-content {
      background: #fafbfd;
      border-radius: 0px 0px 3px 3px;
      padding: 10px 20px 10px 20px;

      .year {
        font-size: 20px;
        font-weight: 500;
        color: #9aa4b8;
        display: flex;
        align-items: center;

        .circle {
          display: inline-block;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          border: 1px solid #9aa4b8;
          margin-left: 4px;
        }
      }

      .ypzc-wapper {
        position: relative;
        &::before {
          content: "";
          height: calc(100% + 20px);
          position: absolute;
          width: 1px;
          background: #ebeef5;
          top: -11px;
          left: 75px;
        }
      }

      .content-box {
        display: flex;
        padding: 7px 0 7px 25px;

        .date {
          color: #5c6973;
          font-size: 14px;
          margin-right: 24px;
          line-height: 20px;
        }

        .info {
          font-size: 14px;
          color: #333333;
          line-height: 20px;

          .info-title {
            font-weight: 500;
            color: #182462;
            cursor: pointer;
            box-sizing: border-box;
            line-height: 20px;

            &:hover {
              font-size: 14px;
              color: #df9008;
              text-decoration: underline;
            }
          }
        }
      }
    }

    .year-switch {
      padding: 20px 0;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #ffffff;

      .last-yaer,
      .next-year {
        width: 80px;
        height: 28px;
        line-height: 28px;
        background: #ebeef5;
        color: #5c6973;
        cursor: pointer;
        box-sizing: border-box;
        transition-duration: 0.3s;
        transition-timing-function: ease-in-out;
        transition-delay: 0s;
        transition-property: all;
        i {
          color: #5c6973;
        }

        &:hover {
          background: #182462;
          color: #fff;
          i {
            color: #fff;
          }
        }
      }

      .last-yaer {
        border-radius: 3px 0px 0px 3px;
        margin-right: 2px;
        padding-left: 10px;
      }

      .next-year {
        padding-left: 20px;
        border-radius: 0px 3px 3px 0px;
      }
    }
  }

  .policies-footer {
    width: 100%;
    height: 40px;
    line-height: 40px;
    margin-top: 10px;
    text-align: center;
    font-size: 14px;
    color: #f6f8fc;
    background: #050e40;
  }
}
</style>
