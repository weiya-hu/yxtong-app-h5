<template>
  <div class="mc">
    <div class="left-nav">
      <router-link to="/usercenter/take/dynamic" class="nav-main-lan"
        >订阅管理</router-link
      >
      <router-link to="/usercenter/take/dynamic" class="nav-lan"
        >订阅动态</router-link
      >
      <router-link to="/usercenter/take/condition" class="nav-lan"
        >订阅条件</router-link
      >
      <router-link to="/usercenter/take/new" class="nav-lan nav-lan-active"
        >新增订阅&nbsp;&nbsp;></router-link
      >
      <div style="margin-top: 20px; padding: 0 20px; font-weight: 400">
        关注药智数据服务号
        <p style="color: #868ea3">随时随地掌握最新动态</p>
      </div>
      <img
        width="96"
        height="96"
        style="margin: 10px 0 0 18px"
        src="../../../../../static/imgs/wechart/code.png"
        alt=""
      />
    </div>
    <!--  -->
    <div class="right-view">
      <!-- PART:新增订阅 -->
      <div class="section">
        <div class="head">
          <div class="title">
            <i class="iconfont">&#xe757;</i><span>新增订阅</span>
          </div>
        </div>
        <div class="sec-view">
          <div class="form">
            <el-form ref="newTakeForm" :model="newTakeForm" label-width="120px">
              <el-form-item label="订阅数据库：">
                <el-select
                  v-model="shujuku"
                  placeholder="请选择数据库"
                  :clearable="true"
                  @change="rssRules"
                >
                  <el-option label="药品注册与受理数据库" value="2"></el-option>
                  <el-option label="投融资事件" value="rongzi"></el-option>
                  <el-option label="并购事件" value="binggou"></el-option>
                  <el-option
                    label="全球药物2.0"
                    value="globaldrugs"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                label="分类："
                v-if="shujuku == 2 || shujuku == '药品注册与受理数据库'"
              >
                <el-radio-group v-model="type">
                  <el-radio :label="1">受理号</el-radio>
                  <el-radio :label="2">药品名称</el-radio>
                  <el-radio :label="3">活性成分</el-radio>
                  <el-radio :label="4">企业名称</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="分类：" v-if="shujuku == '全球药物2.0'||shujuku == 'globaldrugs'">
                <el-radio-group
                  v-model="globaldrugs_type"
                  @change="globaldrugsChange"
                >
                  <el-radio label="药品名称">药品名称</el-radio>
                  <el-radio label="项目名称">项目名称</el-radio>
                  <el-radio label="企业名称">企业名称</el-radio>
                  <el-radio label="靶点名称">靶点名称</el-radio>
                  <el-radio label="适应症名称">适应症名称</el-radio>
                </el-radio-group>
              </el-form-item>

              <el-form-item
                label="分类："
                v-if="shujuku == 'rongzi' || shujuku == 'binggou'"
              >
                <el-radio-group v-model="category" @change="categoryChange">
                  <el-radio :label="'全部'">全部</el-radio>
                  <el-radio :label="'关键词'" @click.native="handleClick"
                    >关键词</el-radio
                  >
                  <el-radio :label="'行业'" @click.native="handleClick"
                    >行业</el-radio
                  >
                  <el-radio
                    :label="'轮次'"
                    v-if="shujuku == 'rongzi'"
                    @click.native="handleClick"
                    >轮次</el-radio
                  >
                  <el-radio :label="'地区'" @click.native="handleClick"
                    >地区</el-radio
                  >
                </el-radio-group>
              </el-form-item>

              <el-form-item
                label="关键词："
                v-if="shujuku == 2 || shujuku == '药品注册与受理数据库'"
                class="gjc"
              >
                <el-autocomplete
                  v-model="slhkeyword"
                  placeholder="请输入准确的受理号"
                  :fetch-suggestions="querySearchAsync"
                  :trigger-on-focus="false"
                  :popper-append-to-body="false"
                  v-if="type == 1"
                  clearable
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
                <el-autocomplete
                  v-model="namekeyword"
                  placeholder="请输入药品名称"
                  :fetch-suggestions="querySearchAsync"
                  :trigger-on-focus="false"
                  v-if="type == 2"
                  :popper-append-to-body="false"
                  clearable
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
                <el-autocomplete
                  v-model="hxcfkeyword"
                  placeholder="请输入中文活性成分"
                  :fetch-suggestions="querySearchAsync"
                  :trigger-on-focus="false"
                  v-if="type == 3"
                  :popper-append-to-body="false"
                  clearable
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
                <el-autocomplete
                  v-model="qymckeyword"
                  placeholder="请输入企业名称"
                  :fetch-suggestions="querySearchAsync"
                  :trigger-on-focus="false"
                  v-if="type == 4"
                  :popper-append-to-body="false"
                  clearable
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
                <el-checkbox v-model="is_like" v-if="type == 3">
                  模糊
                  <el-tooltip effect="zhuce" placement="right">
                    <div slot="content">
                      勾选模糊时可订阅含有该关键词的所有活性成分，其中包括该活性成分相关的复方、酸根等。
                    </div>
                    <i
                      class="el-icon-question cl-green"
                      style="margin-left: 4px; line-height: 28px"
                    ></i>
                  </el-tooltip>
                </el-checkbox>
              </el-form-item>
              <el-form-item
                label="关键词："
                v-if="shujuku == '全球药物2.0'||shujuku=='globaldrugs'"
                class="gjc"
              >
                <el-autocomplete
                  size="mini"
                  v-model="ywmc"
                  :fetch-suggestions="querySearch"
                  placeholder="请输入内容"
                  :trigger-on-focus="false"
                  @select="handleSelect"
                  clearable
                >
                  <template slot-scope="{ item }">
                    <div class="drug-item">
                      <div :title="item.value" class="drug-item_durgname">
                        {{ item.value }}
                      </div>
                    </div>
                  </template>
                </el-autocomplete>
              </el-form-item>
              <el-form-item label="接收频率：">
                <el-radio-group v-model="rate">
                  <el-radio :label="1" value="1">{{
                    shujuku == 2 || shujuku == "药品注册与受理数据库"
                      ? "有状态变化时"
                      : "有数据新增时"
                  }}</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="接收方式：">
                <el-checkbox-group v-model="mode">
                  <el-checkbox :label="2" disabled>系统接收</el-checkbox>
                  <br />
                  <el-checkbox :label="3">
                    <span>邮件接收&nbsp;</span>
                    <el-input
                      v-model="email"
                      placeholder="请输入您的邮箱号"
                    ></el-input>
                  </el-checkbox>
                </el-checkbox-group>

                <el-checkbox v-model="send_wx"
                  >关注药智数据服务号，随时随地掌握最新动态。</el-checkbox
                >
                <img
                  width="96"
                  height="96"
                  style="display: block; margin-left: 15px"
                  src="../../../../../static/imgs/wechart/code.png"
                  alt=""
                />
              </el-form-item>

              <el-form-item>
                <el-button
                  type="primary"
                  @click="submitForm('newTakeForm')"
                  class="tj-btn"
                  >提交</el-button
                >
              </el-form-item>
            </el-form>
          </div>
        </div>
        <!-- 各类提示 -->
        <div class="alert" @click="hideAlerts()">
          <!-- 订阅成功 -->
          <div class="right right1">
            <span>订阅成功</span>
          </div>
          <!-- 关键词不能为空 -->
          <div class="wrong wrong1">
            <span>关键词不能为空</span>
          </div>
          <!-- 您已经订阅过该关键词 -->
          <div class="wrong wrong2">
            <span>您已经订阅过该关键词</span>
          </div>
          <!-- 请输入正确的关键词 -->
          <div class="wrong wrong3">
            <span>请输入正确的关键词</span>
          </div>
          <!-- 请选择接收方式 -->
          <div class="wrong wrong4">
            <span>请选择接收方式</span>
          </div>
          <!-- 请输入邮箱 -->
          <div class="wrong wrong5">
            <span>请输入邮箱</span>
          </div>
          <!-- 请输入正确的邮箱 -->
          <div class="wrong wrong6">
            <span>请输入正确的邮箱</span>
          </div>

          <!-- 该功能正在建设中 -->
          <div class="wrong wrong7">
            <span>该功能正在建设中</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      ywmc: "",
      shujuku: "药品注册与受理数据库",
      type: 1,
      globaldrugs_type: '药品名称',// 全球药物的订阅分类
      // keyword: '',
      slhkeyword: "", //分开绑定 输入框的值
      namekeyword: "",
      hxcfkeyword: "",
      qymckeyword: "",
      rate: 1,
      mode: [2, 3], // TODO:暂时隐藏邮件接收，所以暂时从数组中删掉3
      email: "",
      category: "全部", // 投融资并购分类
      send_wx: true,
      is_like: false,
      param: {
        page: 1,
        pageSize: 10,
      },
    };
  },
  computed: {
    ...mapState({
      accesstoken: (state) => state.UserCenter.accesstoken,
      accountDataEmail: (state) => state.UserCenter.accountDataEmail,
    }),
    newTakeForm() {
      return _.assign(
        {},
        { shujuku: this.shujuku },
        { type: this.type },
        // {keyword: this.keyword},
        { slhkeyword: this.slhkeyword },
        { namekeyword: this.namekeyword },
        { hxcfkeyword: this.hxcfkeyword },
        { qymckeyword: this.qymckeyword },
        { rate: this.rate },
        { send_wx: this.send_wx },
        { is_like: this.is_like },
        { mode: this.mode },
        { email: this.email },
        { category: this.category }
      );
    },
  },
  props: ["time"],
  watch: {
    email() {},
    $route(olds, news) {
      this.hideAlerts();
      $(".alert").find(".right").fadeOut();
      $(".alert").find(".wrong").fadeOut();
      if (olds.path.indexOf("/usercenter/take/new") == 0) {
        this.rssRules();
      }
    },
  },
  created() {
    // if (this.$route.query.source === "rongzi") {
    //   this.shujuku = "投融资事件";
    // } else if (this.$route.query.source === "binggou") {
    //   this.shujuku = "并购事件";
    // }
    setTimeout(() => {
      const hashLocation = sessionStorage.getItem("hashLocation"); //缓存中获取当前页面的路由名称
      // 注意, 这里使用全路径匹配,在hash模式中,因为地址会携带#,所以页面报告中的url需要重新覆盖一下, 将#去除
      window._paq.push(["setCustomUrl", "https://" + hashLocation]); //覆盖页面报告的url，可以自定义页面url，加上本页面路由
      window._paq.push(["trackPageView", "账号管理"]); //页面名称,可以自定义页面名称
      window._paq.push(["setDocumentTitle", "账号管理"]);
    }, 1000);
  },
  methods: {
    querySearch(query, cb) {
      if (query.length < 2) {
        cb([]);
        return;
      }
      Axios({
        method: "get",
        url: "/api/globaldrugs/input",
        params: _.assign(
          {
            drugname1: query,
            is_rss: 1
          },
          {
            accesstoken: GETCOOKIEFUN("accesstoken"),
          }
        ),
      }).then((res) => {
        if (res.data.code == 200) {
          let r = res.data.data.map((t) => {
            return { value: t.drugname_standard };
          });
          cb(r);
        } else {
          cb([]);
        }
      });
    },
    //获取提示词
    querySearchAsync(queryString, callback) {
      var list = [];
      let type_str = "shoulihao";
      switch (this.type) {
        case 1:
          type_str = "shoulihao";
          break;
        case 2:
          type_str = "name";
          break;
        case 3:
          type_str = "zwylbm";
          break;
        case 4:
          type_str = "qiyemingcheng";
          break;
      }
      var param = Qs.parse(type_str + "=" + queryString); // 解决参数键值不能为变量
      let _queryString = "";
      if (_queryString != queryString) {
        _queryString = queryString;
        let url = "/api/rss/zhuceinput";
        window
          .Axios({
            methods: "get",
            url: url,
            params: param,
          })
          .then((res) => {
            if (res.data == "") {
              callback([]);
            } else {
              let data = [];
              for (let i = 0, l = res.data.data.length; i < l; i++) {
                data.push({ value: res.data.data[i] });
              }
              callback(data);
            }
          })
          .catch((thrown) => {
            console.log("请求出错了");
          });
        // this.resetValue(queryString)
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let otherParams = {}; // 非必须条件

          switch (this.type) {
            case 1:
              _.assign(otherParams, { shoulihao: this.slhkeyword });
              break;
            case 2:
              _.assign(otherParams, { name: this.namekeyword });
              break;
            case 3:
              _.assign(otherParams, { zwylbm: this.hxcfkeyword });
              break;
            case 4:
              _.assign(otherParams, { qiyemingcheng: this.qymckeyword });
              break;
            default:
              _.assign(otherParams, { shoulihao: this.slhkeyword });
              break;
          }

          let send_email;
          if (_.indexOf(this.mode, 3) !== -1) {
            // 接收方式为邮箱时
            send_email = this.email;
          }

          let testEmailReg = new RegExp(
            /^[0-9A-Za-z][\.-_-0-9A-Za-z]*@[0-9A-Za-z]+(\.[0-9A-Za-z]+)+$/
          ); // 验证邮箱格式
          let isEmailRight = testEmailReg.test(this.email); // 邮箱格式是否正确

          // if (this.email && isEmailRight && this.mode.length) {

          // }
          if (_.indexOf(this.mode, 3) !== -1 && this.email && !isEmailRight) {
            // 请输入正确的邮箱
            this.toggleAlert("wrong6");
          } else if (_.indexOf(this.mode, 3) !== -1 && !this.email) {
            // 请输入邮箱
            this.toggleAlert("wrong5");
          } else if (!this.mode.length) {
            // 请选择接收方式
            this.toggleAlert("wrong4");
          } else {
            let dbname = "";
            switch (this.shujuku) {
              case "药品注册与受理数据库":
                dbname = "zhuce";
                break;
              case 2:
                dbname = "zhuce";
                break;
              case "rongzi":
                dbname = "tourongzi";
                break;
              case "binggou":
                dbname = "binggou";
                break;
              case "globaldrugs":
                dbname = "globaldrugs";
                break;
            }
            if (this.shujuku == 'globaldrugs') {
              otherParams['keywords'] = this.ywmc;
              otherParams['category'] = this.globaldrugs_type;
            }
            window
              .Axios({
                method: "get",
                url: "/api/rss/addwhere",
                params: _.assign(
                  {
                    accesstoken: this.vueGetCookie("accesstoken"),
                    dbname: dbname,
                    send_type: this.mode.length === 2 ? 1 : this.mode[0], // 必须
                    subscribe_type: this.rate, // 必须
                    send_wx: this.send_wx ? 1 : 0,
                    is_like: this.is_like ? 1 : 0,
                    send_email: send_email,
                  },
                  this.shujuku != "rongzi" && this.shujuku != "binggou"
                    ? otherParams
                    : {}
                ),
              })
              .then((res) => {
                console.log(res);
                if (res.data.code === 200) {
                  this.toggleAlert("right1");
                  setTimeout(() => {
                    this.$router.push({
                      path: "/usercenter/take/condition",
                    });
                    Store.dispatch("UserCenter/handleDytjAxios", this.param); //解决路由后跳转后第一次进入订阅条件页面 不显示刚才订阅的问题
                  }, 2000);
                } else if (res.data.code === 10002) {
                  // 关键词不能为空
                  this.toggleAlert("wrong1");
                } else if (res.data.code === 10003) {
                  // 您已经订阅过该关键词
                  this.toggleAlert("wrong2");
                } else if (res.data.code === 10004) {
                  // 请输入正确关键词
                  this.toggleAlert("wrong3");
                }
              })
              .catch((err) => {
                console.log(err);
              });
          }
        } else {
          // console.log("添加订阅出错")
          return false;
        }
      });
      setTimeout(() => {
        //表单提交后 清空之前搜索的关键字
        // this.slhkeyword=''
        // this.namekeyword=''
        // this.hxcfkeyword=''
        // this.qymckeyword=''
      }, 3000);
    },
    toggleAlert(cls) {
      // 切换alert提示
      $(".alert").fadeIn();
      $(".alert")
        .find("." + cls)
        .fadeIn();
      setTimeout(() => {
        $(".alert").fadeOut();
        $(".alert")
          .find("." + cls)
          .fadeOut();
      }, 2000);
    },
    hideAlerts() {
      $(".alert").hide();
    },
    rssFrom() {
      if (this.vueGetCookie("rss_type")) {
        // 从注册数据库rss未订阅跳转传值过来
        this.type = Number(this.vueGetCookie("rss_type"));
        let fromkey = this.vueGetCookie("rss_keyword");
        let fromkeyObj = JSON.parse(fromkey);
        this.slhkeyword = fromkeyObj.shoulihao;
        this.namekeyword = fromkeyObj.name;
        this.hxcfkeyword = fromkey.hxcf;
        this.qymckeyword = fromkeyObj.qiyemingcheng;
        this.vueDelCookie("rss_type");
        this.vueDelCookie("rss_keyword");
      }
    },
    rssRules(val) {
      console.log(this.shujuku, val, 'rssRules');
      //进入当前页面判断是否有订阅权限
      window
        .Axios({
          url: "/api/rss/rssrules",
          method: "post",
          params: {
            accesstoken: this.vueGetCookie("accesstoken"),
          },
        })
        .then((res) => {
          if ((res.data.code = 200)) {
            if (!res.data.data[0].have_rule) {
              this.$router.push({
                path: "/no-permission",
              });
            }
            if (val === 'globaldrugs' && !res.data.data[1].have_rule) {
              this.$router.push({
                path: "/no-permission",
              });
            }
          }
        });
    },
    rssQuery() {
      const { source, cate = 1, key } = this.$route.query;
      if (source) {
        this.shujuku = source;
        this.ywmc = key || '';
      }
    },

    // 投融资并购分类change事件
    categoryChange(val) {
      // 如果筛选项不等于全部的话 弹窗提示该功能正在建设中。
      if (val !== "全部") {
        this.toggleAlert("wrong7");
        this.category = "全部";
      }
    },
    globaldrugsChange(val) {
      if (val != 1) {
        this.toggleAlert("wrong7");
        this.globaldrugs_type = '药品名称';
      }
    },

    handleClick() {
      // 统计事件
      window.ga("send", "event", "button", "click", "viptrz_dingyue_more");
      window._paq.push([
        "trackEvent",
        "button",
        "click",
        "viptrz_dingyue_more",
      ]);
    },
    handleSelect(e) {
      this.ywmc = e.value
    },
  },
  mounted() {
    setTimeout(() => {
      this.email = this.accountDataEmail;
    }, 2000);

    this.rssRules();
    this.rssFrom();
    this.rssQuery();
  },
  updated() {
    this.rssFrom();
  },
};
</script>

<style lang="less" scoped>
@import "~@/assets/less/var.less";
/deep/.el-input input::-webkit-input-placeholder {
  font-weight: normal;
}
/deep/.el-checkbox__label {
  font-size: 13px;
}
.mc {
  .right-view {
    width: 1020px;
    float: none !important;
    .section {
      // position: relative;
      .sec-view {
        display: flex;
        justify-content: center;
        .form {
          // width: 500px;
          .el-form {
            .el-form-item {
              .el-form-item__content {
                .el-select {
                  width: 100%;
                }
                .el-input {
                  width: 100%;
                }
                .el-autocomplete {
                  width: 100%;
                }
                .el-checkbox__label {
                  .el-input {
                    width: 320px;
                  }
                }
              }
            }

            .gjc {
              /deep/ .el-form-item__content {
                display: flex;

                .el-checkbox {
                  margin-left: 10px;
                }
              }
            }
          }
        }
      }
      .alert {
        z-index: 9999;
        display: none;
        width: 175px;
        height: 105px;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-top: -52.5px;
        margin-left: -87.5px;
        .right {
          position: relative;
          width: 175px;
          height: 105px;
          background: url("/static/imgs/usercenter/alert/right.png") no-repeat;
          span {
            position: absolute;
            bottom: 22px;
            left: 0px;
            width: 100%;
            text-align: center;
            color: #fff;
            font-size: 14px;
            font-weight: bold;
          }
        }
        .wrong {
          position: relative;
          width: 175px;
          height: 105px;
          background: url("/static/imgs/usercenter/alert/wrong.png") no-repeat;
          span {
            position: absolute;
            bottom: 22px;
            left: 0px;
            width: 100%;
            text-align: center;
            color: #fff;
            font-size: 14px;
            font-weight: bold;
          }
        }
        div {
          display: none;
        }
      }
    }
  }
}
.tj-btn {
  height: 30px;
  line-height: 30px;
  border-radius: 4px;
  width: 120px;
  padding: 0;
}
/deep/.el-radio__inner::after {
  background-color: #4877e8;
  width: 7px;
  height: 7px;
}
/deep/.el-radio__input.is-checked .el-radio__inner {
  background: #ffffff;
}
</style>
