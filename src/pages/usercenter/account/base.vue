<template>
  <div class="mc">
    <div class="left-nav">
      <router-link to="/usercenter/account" class="nav-main-lan"
        >账号管理&nbsp;&nbsp;&nbsp;&nbsp;></router-link
      >
    </div>
    <!--  -->
    <div class="right-view">
      <!-- PART:账号信息 -->
      <div class="section">
        <div class="head">
          <div class="title">
            <i class="iconfont">&#xe757;</i><span>账号信息</span>
          </div>
        </div>
        <div class="sec-view">
          <!-- 用户名 -->
          <el-row :gutter="24" class="one-row">
            <el-col :span="7">
              <div class="left">
                <span class="left-title">用户名：</span>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="right">{{ data.username }}</div>
            </el-col>
          </el-row>
          <!-- 密码 （修改密码） -->
          <el-row :gutter="24" class="one-row">
            <el-col :span="7">
              <div class="left">
                <span class="left-title">密码：</span>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="right">
                <span>********</span>
              </div>
            </el-col>
            <el-col :span="3" class="ta-right">
              <a
                class="cl-blue"
                href="https://www.yaozh.com/member/uppwd/"
                target="_blank"
                >修改密码</a
              >
              <span class="iconfont iconfont-link-btn">&#xe617;</span>
            </el-col>
          </el-row>
          <!-- 安全验证（左有） - 邮箱 -->
          <el-row :gutter="24" class="one-row">
            <el-col :span="7">
              <div class="left">
                <span class="iconfont" style="color: #90c320">&#xe635;</span>
                <span class="left-title"> 安全验证：</span>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="right">
                <div
                  style="
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                  "
                  :title="data.email"
                >
                  邮箱：&nbsp;&nbsp;&nbsp;{{ data.email }}
                </div>
              </div>
            </el-col>
            <el-col :span="3" class="ta-right">
              <a
                class="cl-blue"
                href="https://www.yaozh.com/member/bdemailp/?s=x"
                target="_blank"
                >修改邮箱</a
              >
              <span class="iconfont iconfont-link-btn">&#xe617;</span>
            </el-col>
          </el-row>
          <!-- 安全验证（左无） - 手机 -->
          <el-row :gutter="24" class="one-row">
            <el-col :span="7">
              <div class="left">&nbsp;</div>
            </el-col>
            <el-col :span="8">
              <div class="right">
                <span>手机：&nbsp;&nbsp;&nbsp;{{ data.mobile }}</span>
              </div>
            </el-col>
            <el-col :span="3" class="ta-right">
              <a
                class="cl-blue"
                href="https://www.yaozh.com/member/bdphone/?s=x"
                target="_blank"
                >立即绑定</a
              >
              <span class="iconfont iconfont-link-btn">&#xe617;</span>
            </el-col>
          </el-row>
          <!-- 会员等级 -->
          <el-row :gutter="24" class="one-row">
            <el-col :span="7">
              <div class="left">
                <span class="left-title">会员等级：</span>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="right">{{ data.grade_name }}</div>
            </el-col>
          </el-row>
          <!-- 会员期限 -->
          <el-row :gutter="24" class="one-row">
            <el-col :span="7">
              <div class="left">
                <span class="left-title">会员期限：</span>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="right">
                {{ data.starttime }}&nbsp;至&nbsp;{{ data.endtime }}
              </div>
            </el-col>
          </el-row>
          <!-- 企业名称 - 可修改 -->
          <el-row :gutter="24" class="one-row">
            <el-col :span="7">
              <div class="left">
                <span class="left-title">企业名称：</span>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="right">
                <input
                  type="text"
                  class="acount-input"
                  v-model="inputs.model_qymc"
                />
              </div>
            </el-col>
          </el-row>
          <!-- 部门 - 可修改 -->
          <el-row :gutter="24" class="one-row">
            <el-col :span="7">
              <div class="left">
                <span class="left-title">部门：</span>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="right">
                <input
                  type="text"
                  class="acount-input"
                  v-model="inputs.model_bm"
                />
              </div>
            </el-col>
          </el-row>
          <!-- 联系人 - 可修改 -->
          <el-row :gutter="24" class="one-row">
            <el-col :span="7">
              <div class="left">
                <span class="left-title">联系人：</span>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="right">
                <input
                  type="text"
                  class="acount-input"
                  v-model="inputs.model_lxr"
                />
              </div>
            </el-col>
          </el-row>
          <!-- 联系电话 - 可修改 -->
          <el-row :gutter="24" class="one-row">
            <el-col :span="7">
              <div class="left">
                <span class="left-title">联系电话：</span>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="right">
                <input
                  type="text"
                  class="acount-input"
                  v-model="inputs.model_lxdh"
                />
              </div>
            </el-col>
          </el-row>
          <!-- 联系地址 - 可修改 -->
          <el-row :gutter="24" class="one-row">
            <el-col :span="7">
              <div class="left">
                <span class="left-title">联系地址：</span>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="right">
                <input
                  type="text"
                  class="acount-input"
                  v-model="inputs.model_lxdz"
                />
              </div>
            </el-col>
          </el-row>
          <!-- 提交更改 -->
          <el-button
            type="primary"
            round
            size="medium"
            class="tj-btn"
            @click="submitChange"
            >提交</el-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {};
  },
  computed: {
    ...mapState({
      uid: (state) => state.UserCenter.uid,
      data: (state) => state.UserCenter.accountData,
      inputs: (state) => state.UserCenter.accountInputs,
    }),
  },
  created() {
    setTimeout(() => {
      const hashLocation = sessionStorage.getItem("hashLocation"); //缓存中获取当前页面的路由名称
      // 注意, 这里使用全路径匹配,在hash模式中,因为地址会携带#,所以页面报告中的url需要重新覆盖一下, 将#去除
      window._paq.push(["setCustomUrl", "https://" + hashLocation]); //覆盖页面报告的url，可以自定义页面url，加上本页面路由
      window._paq.push(["trackPageView", "账号管理"]); //页面名称,可以自定义页面名称
      window._paq.push(["setDocumentTitle", "账号管理"]);
    }, 1000);
  },
  methods: {
    async submitChange() {
      await window
        .Axios({
          method: "post",
          url: "/api/usercenter/usersave",
          params: {
            accesstoken: this.vueGetCookie("accesstoken"),
            comname: this.inputs.model_qymc,
            department: this.inputs.model_bm,
            truename: this.inputs.model_lxr,
            comtel: this.inputs.model_lxdh,
            address: this.inputs.model_lxdz,
          },
        })
        .then((res) => {
          if (res.data.code === 200) {
            this.$message({
              message: "修改成功!",
              type: "success",
            });
          } else {
            this.$message({
              message: "提交失败!",
              type: "error",
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });

      Store.dispatch("UserCenter/handleAccountAxios");
    },
  },
};
</script>

<style lang="less" scoped>
@import "~@/assets/less/app.less";
@import "~@/assets/less/var.less";
.ta-right {
  text-align: right;
  a {
    font-size: 14px;
  }
  .iconfont-link-btn {
    font-size: 12px;
  }
}

.mc {
  .right-view {
    .section {
      .sec-view {
        position: relative;
        width: 100%;
        padding-top: 18px;
        padding-bottom: 80px;
        .one-row {
          margin-top: 16px;
          margin-bottom: 16px;
          // height: 30px;
          line-height: 30px;
          .left {
            text-align: right;
            font-size: 14px;
          }
          .right {
            font-size: 13px;
            color: #97a2bf;
            .acount-input {
              box-sizing: border-box;
              height: 30px;
              width: 100%;
              // background: #f6f8fc;
              background-color: #fff;
              border: 1px solid #dfe5f1;
              padding: 8px 10px;
              &:focus {
                background: #fff;
              }
            }
          }
        }
        .tj-btn {
          position: absolute;
          bottom: 10px;
          left: 36%;
          width: 120px;
          height: 30px;
          line-height: 30px;
          border-radius: 4px;
          padding: 0px;
          margin: 15px auto;
          color: #fff;
        }
      }
    }
  }
}
</style>
