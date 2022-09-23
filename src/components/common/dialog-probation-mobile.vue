<template>
  <div class="form-boxout">
    <div class="formhead">
      <span>试用申请</span>
      <van-icon class="one-close" name="cross" @click="closeEvent" />
    </div>
    <div class="form-box" v-if="!isHandled">
      <!-- 试用申请弹出框 - 内部 -->
      <div class="dialog-body3">
        <img src="@/assets/imgs/shiyonghbg.png" />
      </div>
      <!-- 试用申请表单提交 -->
      <div class="dialog-body4">
        <div class="vant-box-only">
          <div class="vant-spec" v-if="sms.prompt">
            <p v-html="sms.prompt"></p>
          </div>
          <p class="tishi" v-if="nametips">
            该账号未注册，请先<a
              href="https://www.yaozh.com/register?ga_source=vip&ga_position=registered_4"
              class="cl-blue"
              target="_blank"
              >注册</a
            >
          </p>
          <van-cell-group>
            <van-field
              label-width="68px"
              v-model="shenqingForm.name"
              :error-message="em.name"
              label="账号"
              placeholder="请输入药智网账号"
              :right-icon="tipsIcon.name"
              @blur="checkName"
            >
              <template slot="label">
                <span style="color: #f00">*</span> 账号
              </template>
            </van-field>

            <van-field
              label-width="68px"
              v-model="shenqingForm.email"
              :error-message="em.email"
              label="企业邮箱"
              placeholder="请填写企业邮箱"
              :right-icon="tipsIcon.email"
              @blur="checkEmail()"
            >
              <template slot="label">
                <span style="color: #f00">*</span> 企业邮箱
              </template>
            </van-field>

            <van-field
              label-width="68px"
              v-model="shenqingForm.surname"
              :error-message="em.surname"
              label="姓名"
              placeholder="请输入姓名"
              :right-icon="tipsIcon.surname"
              @blur="checkText('surname', '姓名')"
            >
              <template slot="label">
                <span style="color: #f00">*</span> 姓名
              </template>
            </van-field>

            <van-field
              label-width="68px"
              v-model="shenqingForm.company"
              :error-message="em.company"
              label="公司"
              placeholder="请输入公司名称"
              :right-icon="tipsIcon.company"
              @blur="checkText('company', '公司名称')"
            >
              <template slot="label">
                <span style="color: #f00">*</span> 公司
              </template>
            </van-field>


            <!-- <van-field
              label-width="68px"
              v-model="shenqingForm.qq"
              :error-message="em.qq"
              label="QQ"
              placeholder="请输入QQ号码"
              :right-icon="tipsIcon.qq"
              type="number"
              @blur="checkQQ()"
            >
              <template slot="label">
                <span style="color: #f00">*</span> QQ
              </template>
            </van-field> -->

            <van-field
              label-width="68px"
              v-model="shenqingForm.department"
              :error-message="em.department"
              label="部门"
              placeholder="请输入部门名称"
              :right-icon="tipsIcon.department"
              @blur="checkText('department', '部门名称')"
            >
              <template slot="label">
                <span style="color: #f00">*</span> 部门
              </template>
            </van-field>

            <div class="selcet" style="margin-bottom: 20px">
              <div class="selcetlabel">
                <span style="color: #f00">*</span> 地区
              </div>
              <div style="flex: 1">
                <el-select v-model="shenqingForm.lacation" placeholder="请选择">
                  <el-option
                    v-for="item in shenqingLacation1"
                    :key="item.value"
                    :label="item.text"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
                <!-- <van-dropdown-menu>
                  <van-dropdown-item v-model="shenqingForm.lacation" :options="shenqingLacation1" />
                </van-dropdown-menu> -->
              </div>
            </div>



            <!-- <van-field
              label-width="68px"
              v-model="shenqingForm.position"
              :error-message="em.position"
              label="职位"
              placeholder="请输入职位名称"
              :right-icon="tipsIcon.position"
              @blur="checkText('position', '职位名称')"
            >
              <template slot="label">
                <span style="color: #f00">*</span> 职位
              </template>
            </van-field> -->
            <div class="selcet">
              <div class="selcetlabel">
                <span style="color: #f00">*</span> 手机
              </div>
              <div style="flex: 1">
               <el-input
                  v-model="shenqingForm.phone"
                  placeholder="请输入手机号码"
                  class="input-phone"
                  @blur="checkPhone()"
                >
                  <el-select
                    v-model="shenqingForm.country"
                    class="select-area"
                    slot="prepend"
                    placeholder="请选择"
                    @change="selectChange"
                  >
                    <el-option
                      v-for="item in areaNum"
                      :key="item.short"
                      :label="'+' + item.tel"
                      :value="item.tel"
                    >
                      <span>{{ item.name }}+{{ item.tel }}</span>
                    </el-option>
                  </el-select>
                </el-input>
                <i class="van-icon van-icon-cross" v-if="em.phone" style="position: absolute;top: 9px;right: 4px;"></i>
                <span class="van-field__error-message" v-if="em.phone" style="position: absolute;display: block;">{{em.phone}}</span>
              </div>
            </div>

            <!-- <van-field
              label-width="68px"
              v-model="shenqingForm.phone"
              :error-message="em.phone"
              label="手机"
              placeholder="请输入手机号码"
              type="tel"
              :right-icon="tipsIcon.phone"
              @blur="checkPhone()"
            >
              <template slot="label">
                <span style="color: #f00">*</span> 手机
              </template>
            </van-field> -->
            <van-field
              label-width="68px"
              v-model="shenqingForm.vcode"
              :error-message="em.vcode"
              label="验证码"
              placeholder="请输入验证码"
              :right-icon="tipsIcon.vcode"
              type="number"
              @blur="checkVcode('vcode', '验证码')"
              class="yzm"
            >
              <template slot="label">
                <span style="color: #f00">*</span> 验证码
              </template>
              <van-button
                slot="button"
                :disabled="sms.codeBtnBan"
                size="small"
                type="primary"
                @click="sendCode()"
                >{{ sms.codeBtnText || t.b }}</van-button
              >
            </van-field>
          </van-cell-group>
          <!-- <div style="padding-left: 90px;color: #999;">填写企业邮箱，可以提高试用申请通过率。</div> -->
          <div class="input-content1">
            <button
              type="button"
              class="content1-submit"
              @click="handleSubmit2('shenqingForm')"
            >
              提交
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="dialog-body5" v-if="isHandled">
      <div class="dialog-content">
        <div class="content">
          <div class="picture">
            <img
              :class="successOrfaile ? 'img' : 'img_fail'"
              :src="
                successOrfaile
                  ? require('@/assets/imgs/sysq_sucess.jpg')
                  : require('@/assets/imgs/sysq_filed.png')
              "
            />
          </div>
          <div class="content-word">
            <div class="words-one">
              <p :class="successOrfaile ? 'success-word' : 'filed-word'">
                {{ successOrfaile ? "提交成功!" : "提交失败!" }}
              </p>
              <p class="success-word-one">
                {{ successOrfaile ? "我们会尽快和您联系。" : failMark }}
              </p>
            </div>
            <div class="word-two">
              <!-- <div class="success-word-one">
                <div class="success-diot"></div>
                <div class="success-words">每个ID号一个月内有4次申请试用机会。</div>
              </div> -->
              <div class="success-word-one">
                <p class="success-words">
                  <span class="slots"></span
                  >每个ID号短期内（24小时）只能申请一次试用。
                </p>
              </div>
              <div class="success-word-two">
                <p class="success-words">
                  <span class="slots"></span
                  >若试用申请未通过或者试用资格过期，可加入qq群（<a
                    href="https://jq.qq.com/?_wv=1027&k=QdERVSz5"
                    target="_blank"
                    style="color: #f77d54"
                    >666700878</a
                  >）。
                </p>
              </div>
              <div class="success-word-three">
                <p class="success-words">
                  <span class="slots"></span
                  >如有任何疑问，请拨打药智网客服热线：<span
                    style="color: #f77d54"
                    >400-678-0778</span
                  >。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import crypto from "crypto-js";
import { mapState } from "vuex";
import areaNum from "@/config/areaNum";
export default {
  props: {},
  data() {
    return {
      isHandled: false,
      successOrfaile: true, //默认成功
      failMark: "",
      shenqingLacations: [
        "北京市",
        "天津市",
        "河北省",
        "山西省",
        "内蒙古自治区",
        "辽宁省",
        "吉林省",
        "黑龙江省",
        "上海市",
        "江苏省",
        "浙江省",
        "安徽省",
        "福建省",
        "江西省",
        "山东省",
        "河南省",
        "湖北省",
        "湖南省",
        "广东省",
        "广西壮族自治区",
        "海南省",
        " 重庆市",
        "四川省",
        "贵州省",
        "云南省",
        "西藏自治区",
        "陕西省",
        "甘肃省",
        "青海省",
        "宁夏回族自治区",
        "新疆维吾尔自治区",
        "香港特别行政区",
        "澳门特别行政区",
        "中国台湾",
        "其它",
      ],
      shenqingLacation1: [
        {
          text: "北京市",
          value: "北京市",
        },
        {
          text: "天津市",
          value: "天津市",
        },
        {
          text: "河北省",
          value: "河北省",
        },
        {
          text: "山西省",
          value: "山西省",
        },
        {
          text: "内蒙古自治区",
          value: "内蒙古自治区",
        },
        {
          text: "辽宁省",
          value: "辽宁省",
        },
        {
          text: "吉林省",
          value: "吉林省",
        },
        {
          text: "黑龙江省",
          value: "黑龙江省",
        },
        {
          text: "上海市",
          value: "上海市",
        },
        {
          text: "江苏省",
          value: "江苏省",
        },
        {
          text: "浙江省",
          value: "浙江省",
        },
        {
          text: "安徽省",
          value: "安徽省",
        },
        {
          text: "福建省",
          value: "福建省",
        },
        {
          text: "江西省",
          value: "江西省",
        },
        {
          text: "山东省",
          value: "山东省",
        },
        {
          text: "河南省",
          value: "河南省",
        },
        {
          text: "湖北省",
          value: "湖北省",
        },
        {
          text: "湖南省",
          value: "湖南省",
        },
        {
          text: "广东省",
          value: "广东省",
        },
        {
          text: "广西壮族自治区",
          value: "广西壮族自治区",
        },
        {
          text: "海南省",
          value: "海南省",
        },
        {
          text: "重庆市",
          value: "重庆市",
        },
        {
          text: "四川省",
          value: "四川省",
        },
        {
          text: "贵州省",
          value: "贵州省",
        },
        {
          text: "云南省",
          value: "云南省",
        },
        {
          text: "西藏自治区",
          value: "西藏自治区",
        },
        {
          text: "陕西省",
          value: "陕西省",
        },
        {
          text: "甘肃省",
          value: "甘肃省",
        },
        {
          text: "青海省",
          value: "青海省",
        },
        {
          text: "宁夏回族自治区",
          value: "宁夏回族自治区",
        },
        {
          text: "新疆维吾尔自治区",
          value: "新疆维吾尔自治区",
        },
        {
          text: "香港特别行政区",
          value: "香港特别行政区",
        },
        {
          text: "澳门特别行政区",
          value: "澳门特别行政区",
        },
        {
          text: "中国台湾",
          value: "中国台湾",
        },
        {
          text: "其它",
          value: "其它",
        },
      ],
      nametips: false,
      // 申请试用
      shenqingForm: {
        // v-model对应
        name: "",
        lacation: "其它",
        surname: "",
        company: "",
        phone: "",
        department: "",
        email: "",
        // qq: "",
        // position: "",
        vcode: "",
        country: "86",
        type: navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == "micromessenger" ? 3 : 5,
      },
      areaNum: areaNum.areaNum,
      country: "中华人民共和国+86",
      tel: "86", // 用于短信验证码
      em: {
        // 错误提示
        name: "",
        lacation: "",
        surname: "",
        company: "",
        phone: "",
        department: "",
        email: "",
        // qq: "",
        // position: "",
        vcode: "",
      },
      tipsIcon: {
        // 错误提示
        name: "",
        lacation: "",
        surname: "",
        company: "",
        phone: "",
        department: "",
        email: "",
        // qq: "",
        // position: "",
        vcode: "",
      },
      sqNameError: 0, // 申请试用-账号-错误-类别
      timeStamp: null,
      isPhoneRight: false,
      // **********************************
      // 定义文字
      t: {
        b: "点击获取",
        f: "正在发送...",
        g: "短信发送失败",
        h: "账户不能为空",
        i: "密码不符合规范",
        q: "请输入密码",
        j: "手机号不能为空",
        k: "手机号格式错误",
        l: "验证码不能为空",
        m: "验证码错误，请重新输入",
        n: "登录成功，正在跳转...",
        o: "验证码已过期，重新发送",
        // o: '该账号暂未开通药智数据企业版权限，<a href="https://www.yaozh.com/register/" target="_blank">申请试用</a>或<a href="https://www.yaozh.com/register/" target="_blank">联系客服</a>',
      },
      sms: {
        prompt: "",
        codeBtnText: "",
        codeBtnBan: false,
      },
    };
  },
  computed: {},
  watch: {},
  mounted() {
    this.handleuserInfo();
  },
  methods: {
    // 手机区号改变事件
    selectChange(val) {
       // tel字段用于短信验证码
      this.tel = val;

      // 按产品指定的格式赋值：中国+86
      let obj = this.areaNum.find((item, index, arr) => {
        return item.tel == val;
      });
      this.country = `${obj.name}+${obj.tel}`;
      console.log(this.country);
    },

    handleuserInfo() {
      let _this = this;
      window
        .Axios({
          method: "get",
          url: "/api/handle/userInfo",
        })
        .then((res) => {
          if (res.data.code == 200) {
            let _data = res.data.data;
            // console.info(res.data)
            _this.$set(_this, "shenqingForm", {
              // v-model对应
              name: _data.username || "",
              lacation: _data.province || "其它",
              surname: "",
              company: _data.comname || "",
              phone: _data.mobile || "",
              department: "",
              email: _data.email || "",
              // qq: _data.qq_num || "",
              // position: "",
              vcode: "",
              country: "86",
              type: navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == "micromessenger" ? 3 : 5,
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    checkPhone() {
      // let testPhoneReg = new RegExp(/^[1][3,4,5,6,7,8,9][0-9]{9}$/) // 验证手机号
      // let isPhoneRight = testPhoneReg.test(this.shenqingForm.phone) // 手机号是否正确
      if (this.shenqingForm.phone) {
        this.em.phone = "";
        this.tipsIcon.phone = "success";
        return true;
      } else {
        this.tipsIcon.phone = "cross";
        // this.em.phone = this.shenqingForm.phone ? "请输入正确手机号码" : '请输入手机号码'
        this.em.phone = "请输入手机号码";
        return false;
      }
    },
    // checkQQ() {
    //   // let testReg = new RegExp(/^\/d+$/) // 验证QQ
    //   // let isPRight = testReg.test(this.shenqingForm.qq) // 手机号是否正确
    //   if (this.shenqingForm.qq.length > 4) {
    //     this.em.qq = "";
    //     this.tipsIcon.qq = "success";
    //   } else {
    //     this.tipsIcon.qq = "cross";
    //     this.em.qq = this.shenqingForm.qq ? "请输入正确QQ号码" : "请输入QQ号码";
    //   }
    // },
    checkEmail() {
      let testEmailReg = new RegExp(
        /^[0-9A-Za-z][\.-_0-9A-Za-z]*@[0-9A-Za-z]+(\.[0-9A-Za-z]+)+$/
      ); // 验证邮箱格式
      let isEmailRight = testEmailReg.test(this.shenqingForm.email); // 邮箱格式是否正确
      if (this.shenqingForm.email) {
        if (isEmailRight) {
          this.em.email = "";
          this.tipsIcon.email = "success";
        } else {
          this.tipsIcon.email = "cross";
          this.em.email = "请输入正确邮箱"
        }
      } else {
        this.em.email = "请填写企业邮箱";
        this.tipsIcon.email = "";
      }

    },
    checkText(name, txt) {
      if (this.shenqingForm[name]) {
        this.em[name] = "";
        this.tipsIcon[name] = "success";
      } else {
        this.tipsIcon[name] = "cross";
        this.em[name] = "请输入" + txt;
      }
    },
    checkName() {
      if (this.shenqingForm.name) {
        return window
          .Axios({
            method: "post",
            url: "/api/user/usercheckForyaozh",
            params: {
              name: this.shenqingForm.name,
            },
          })
          .then((res) => {
            if (res.data.code == 200) {
              this.em.name = "";
              this.tipsIcon.name = "success";
              this.nametips = false;
              // this.sqNameError = 0
              // return callback()
            } else {
              this.tipsIcon.name = "cross";
              this.em.name = "该账号未注册，请先注册";
              this.nametips = true;
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        this.tipsIcon.name = "cross";
        this.em.name = "请输入账号";
        this.nametips = false;
      }
    },
    checkVcode() {
      this.sms.prompt = "";
      if (this.shenqingForm.vcode) {
        if (this.checkPhone()) {
          Axios.get("/api/user/checkvcode", {
            params: {
              mobile: this.shenqingForm.phone,
              vcode: this.shenqingForm.vcode,
            },
          })
            .then((res) => {
              if (res.data.code == 200) {
                this.em.vcode = "";
                this.tipsIcon.vcode = "success";
              } else {
                this.shenqingForm.vcode = "";
                this.tipsIcon.vcode = "cross";
                this.em.vcode = res.data.msg;
              }
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          this.tipsIcon.vcode = "cross";
          this.shenqingForm.vcode = "";
          this.em.vcode = "请输入验证码";
        }
      } else {
        this.tipsIcon.vcode = "cross";
        this.em.vcode = "请输入验证码";
      }
    },
    // 短信登录-发送短信验证码
    async sendCode() {
      this.sms.prompt = "";
      this.shenqingForm.vcode = "";
      this.tipsIcon.vcode = "";
      this.em.vcode = "";
      if (this.checkPhone()) {
        // 如果手机号格式正确
        await this.getTimeStamp();

        let timeStamp = this.timeStamp;
        let randStr = Math.random().toString(36).slice(2);
        this.sms.codeBtnBan = true;
        this.sms.codeBtnText = this.t.f;
        Axios.post("/api/user/postmobilecodeno", {
          mobile: this.shenqingForm.phone,
          timeStamp: timeStamp,
          randStr: randStr,
          country: this.tel,
          signature: this.getSignature([timeStamp + "", randStr, "newdb"]),
        })
          .then((res) => {
            if (res.data.code == 200 && res.data.code == 200) {
              let t = 60;
              this.sms.codeBtnText = t + "s重新获取";
              let interval = setInterval(() => {
                t--;
                if (t > 0) {
                  this.sms.codeBtnText = t + "s重新获取";
                } else {
                  clearInterval(interval);
                  this.sms.codeBtnText = this.t.b;
                  this.sms.codeBtnBan = false;
                }
              }, 1000);
            } else {
              this.sms.prompt = res.data.msg;
              this.sms.codeBtnText = this.t.b;
              this.sms.codeBtnBan = false;
            }
          })
          .catch((err) => {
            console.error(err);
            this.sms.prompt = this.t.g;
            this.sms.codeBtnText = this.t.b;
            this.sms.codeBtnBan = false;
          });
      } else {
        // this.$refs['shenqingForm'].validateField('phone')
        this.checkText("phone", "手机号码");
      }
    },
    //获取后台时间戳，仅获取短信用
    getTimeStamp() {
      return Axios.get("/api/user/getTime").then((res) => {
        let data = res.data;
        if (data.code === 200) {
          this.timeStamp = data.data.time;
        }
      });
    },
    // 时间戳+随机字符串 生成签名
    // getSignature (strArr) {
    //   let str = strArr.sort((a, b) => {
    //     a = a.charCodeAt(0);
    //     b = b.charCodeAt(0);
    //     return a-b;
    //   }).join('');
    //   return crypto.MD5(crypto.SHA1(str).toString()).toString().toUpperCase();
    // },
    // 提交申请 - 提交按钮事件
    async handleSubmit2(formName) {
      window.ga(
        "send",
        "event",
        "button",
        "click",
        "vip_mobile_applyforatrial_success"
      );
      window._paq.push([
        "trackEvent",
        "button",
        "click",
        "vip_mobile_applyforatrial_success",
      ]);
      let _this = this;

      await this.checkName();
      await this.checkVcode();
      this.checkText("surname", "姓名");
      this.checkPhone();
      // this.checkQQ();
      this.checkEmail();
      // console.log(this.shenqingForm.lacation)
      this.checkText("company", "公司名称");
      this.checkText("department", "部门名称");
      // this.checkText("position", "职位名称");
      let em = _.cloneDeep(this.em)
      delete em.email
      console.log(em);
      let allflag = Object.keys(em).every((v) => {
        return !em[v];
      });

      // this.$refs[formName].validate((valid) => {
      if (allflag) {
        this.sms.prompt = "";
        let dataForm = _.cloneDeep(this.shenqingForm);
        dataForm.type = this.$route.query.type ? this.$route.query.type : dataForm.type
        dataForm.country = this.country;
        dataForm.source_url = window.location.href;
        dataForm.source_title = document.title;
        window
          .Axios({
            url: "/api/viptrial",
            method: "post",
            data: dataForm,
          })
          .then((res) => {
            let _data = res.data;

            // 11014 验证码过期提示
            if (_data.code == 11014) {
              this.sms.prompt = this.t.o;
              this.shenqingForm.vcode = "";
              this.tipsIcon.vcode = "cross";
              return;
            }
            // 11037 验证码错误提示
            if (_data.code == 11037) {
              this.sms.prompt = this.t.m;
              this.shenqingForm.vcode = "";
              this.tipsIcon.vcode = "cross";
              return;
            }
            this.sms.prompt = "";

            if (_data.code == 200) {
              _this.successOrfaile = true;
            } else {
              _this.successOrfaile = false;
              // 目前仅保留40002的提示
              _this.failMark = _data.code == 40002
                    ? "此账号今日已提交，客服会尽快与您联系，请稍等"
                    : ""
              // _this.failMark =
              //   _data.code == 40001
              //     ? "此IP今日已提交，我们会尽快和您联系。"
              //     : _data.code == 40002
              //     ? "此账号今日已提交，我们会尽快和您联系。"
              //     : _data.code == 40003
              //     ? "申请次数超过4次，我们会尽快和您联系。"
              //     : "";
            }

            this.isHandled = true;

            // 提交成功后重置
            this.shenqingForm = {
              name: "",
              lacation: "",
              surname: "",
              company: "",
              phone: "",
              department: "",
              email: "",
              // position: "",
              // qq: "",
              vcode: "",
              country: "86",
              type: navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == "micromessenger" ? 3 : 5,
            };
            this.country = "中华人民共和国+86";
            this.tel = "86";
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        console.log("error submit!!");
        return false;
      }
      // })
    },
    closeEvent() {
      if (!this.isHandled) {
        this.$emit("closeDialog");
      } else {
        if (this.successOrfaile) {
          this.$emit("closeDialog");
        } else {
          this.isHandled = false;
        }
      }
    },
  },
};
</script>

<style lang="less" scoped>
@import "~@/assets/less/app.less";
@import "~@/assets/less/var.less";
@import "~@/assets/less/vant.less";
.el-select-dropdown__item {
  padding-left: 20px;
}

.form-boxout {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: #fff;
  overflow: hidden;
  // height: calc(100vh);
  overflow-y: auto;
  -webkit-overflow-scrolling: auto;
  // z-index: 1;

  .formhead {
    position: relative;
    padding: 15px;
    padding-left: 30px;
    font-size: 15px;
    color: #4877e8;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: space-between;
    z-index: 999;

    .one-close {
      font-size: 18px;
      color: #454c60;
    }
  }
  .formhead:before {
    content: "";
    width: 6px;
    height: 6px;
    background-color: #4877e8;
    border-radius: 50%;
    position: absolute;
    top: 50%;
    left: 15px;
    transform: translate(0, -50%);
  }

  /deep/.el-form-item__error {
    padding-top: 0;
  }
  /deep/.el-input__inner {
    -webkit-user-select: auto !important;
    height: 30px;
    // border-radius: 4px;
    border: 1px solid #b3bbcc;
    box-sizing: border-box;
  }

  .el-select-dropdown__item {
    padding-left: 15px;
  }
  .form-box {
    padding: 0 15px 30px;
  }

  .dialog-body3 {
    width: 100%;
    text-align: center;

    img {
      width: auto;
      height: auto;
      max-width: 100%;
      max-height: 100%;
    }
  }
  .dialog-body4 {
    margin-top: 20px;

    .el-select {
      width: 100%;
    }
    .input-content {
      .input-sq-name-error {
        color: #f56c6c;
        font-size: 12px;
        line-height: 1;
        padding-left: 16px;
        position: absolute;
        top: 100%;
        left: 0;
      }

      .input-one {
        .input-box1 {
          position: relative;
          margin-top: 10px;
          .need-shenqing {
            position: absolute;
            top: 0px;
            left: 0px;
            color: #f00;
            height: 40px;
            line-height: 40px;
          }
          .input-xin {
            width: 5px;
            height: 5px;
            background-color: #fe0b0c;
            border-radius: 50%;
            margin-top: 10px;
            float: left;
          }
          .input-word {
            width: 42px;
            height: 28px;
            float: left;
            text-align: center;
            line-height: 28px;
          }
          .input-name {
            width: 262px;
            height: 30px;
            float: left;
            .name-one {
              width: 260px;
              height: 28px;
              outline: none;
            }
            .layui-input {
              width: 260px;
              height: 28px;
              outline: none;
            }
            .layui-input1 {
              width: 260px;
              height: 28px;
              outline: none;
            }
            .text-style {
              color: red;
            }
          }
        }
        .input-box2 {
          width: 483px;
        }
        .input_box2_zc {
          float: left;
          line-height: 40px;
          .zc_a {
            color: @PrimaryColor;
          }
        }
      }
    }
    .input-content1 {
      .spec {
        /deep/.el-form-item__content {
          display: flex;
          align-items: center;
        }
        /deep/.el-input {
          flex: 1;
        }
        .checkout {
          width: 90px;
          height: 30px;
          margin-left: 5px;
          line-height: 30px;
          border-radius: 4px;
          color: #fff;
          font-size: 13px;
        }
      }
      .prom-spec {
        position: absolute;
        top: 36px;
        width: 100%;
        height: 18px;
        padding-left: 80px;
        line-height: 18px;
        font-size: 12px;
        color: #f56c6c;
        background: #fff;
        z-index: 9;
        box-sizing: border-box;
      }
      .input-sq-name-error {
        color: #f56c6c;
        font-size: 12px;
        line-height: 1;
        padding-left: 16px;
        position: absolute;
        top: 100%;
        left: 0;
      }
      /deep/.el-form-item__error {
        padding-left: 16px;
      }
      .input-one {
        .input-box1 {
          position: relative;
          margin-top: 10px;
          .need-shenqing {
            position: absolute;
            top: 0px;
            left: 0px;
            color: #f00;
            height: 40px;
            line-height: 40px;
          }
          .input-xin {
            width: 5px;
            height: 5px;
            background-color: #fe0b0c;
            border-radius: 50%;
            margin-top: 10px;
            float: left;
          }
          .input-word {
            width: 42px;
            height: 28px;
            float: left;
            text-align: center;
            line-height: 28px;
          }
          .input-name {
            width: 262px;
            height: 30px;
            float: left;
            .name-one {
              width: 260px;
              height: 28px;
              outline: none;
            }
            .layui-input {
              width: 260px;
              height: 28px;
              outline: none;
            }
            .layui-input1 {
              width: 260px;
              height: 28px;
              outline: none;
            }
            .text-style {
              color: red;
            }
          }
        }
      }
    }
  }
  .content1-submit {
    width: 100%;
    height: 36px;
    margin-top: 10px;
    line-height: 36px;
    background: @PrimaryColor;
    color: white;
    outline: none;
    text-align: center;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    transition: all 100ms;
    &:hover {
      background-color: Lighten(@PrimaryColor, 5%);
      transition: all 100ms;
    }
  }
  .dialog-body5 {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    padding: 15px;
    background: #fff;
    .dialog-content {
      margin-top: 60px;
      .content {
        .picture {
          text-align: center;
          .img {
            width: 140px;
            height: 180px;
          }
          .img_fail {
            width: 153px;
            height: 151px;
          }
        }
        .content-word {
          padding-top: 7px;
          text-align: center;
          .words-one {
            .success-word {
              font-size: 34px;
              color: @PrimaryColor;
              line-height: 50px;
              font-weight: 800;
              margin-right: 10px;
            }
            .filed-word {
              font-size: 30px;
              color: @Orange;
              line-height: 50px;
              font-weight: 800;
              margin-right: 10px;
            }
            .success-word-one {
              font-size: 20px;
              font-weight: 700;
              line-height: 1.3;
            }
          }
          .word-two {
            padding-top: 22px;

            .success-word-one,
            .success-word-two,
            .success-word-three {
              overflow: hidden;
              display: flex;
              justify-content: center;
              align-items: center;

              .success-words {
                margin-bottom: 15px;
                font-size: 14px;
                margin-left: 10px;
                color: #555b6d;
                line-height: 1.3;
                .slots {
                  position: relative;
                  top: -2px;
                  left: -6px;
                  display: inline-block;
                  width: 4px;
                  height: 4px;
                  background-color: #555b6d;
                  border-radius: 50%;
                }
              }
            }
          }
        }
      }
    }
  }
}
.vant-box-only {
  position: relative;

  .tishi {
    position: absolute;
    top: 30px;
    left: 80px;
    width: 100%;
    color: #f56c6c;
    background: #fff;
    z-index: 9;
  }
  .vant-spec {
    position: absolute;
    top: 180px;
    left: 80px;
    right: 0;
    z-index: 10;
    line-height: 20px;
    color: #f56c6c;
    background: #fff;
  }
  /deep/.van-field__control {
    border-radius: 4px;
    height: 30px;
    line-height: 30px;
    border: 1px solid #b3bbcc;
    padding: 0 12px;
    padding-right: 22px;
    -webkit-appearance: none;
  }
  /deep/.van-field__error-message {
    padding-left: 13px;
    color: #f56c6c;
    line-height: 20px;
  }
  /deep/.van-cell-group > .van-cell {
    height: 50px;
    padding: 0;
  }
  /deep/.van-button--small {
    width: 100px;
    height: 30px;
    line-height: 30px;
    border-radius: 4px;
    color: #fff;
    font-size: 13px;
    background-color: #4877e8;
    border: 1px solid #4877e8;
  }
  /deep/.van-dropdown-menu__bar {
    width: 100%;
    justify-content: flex-start;
    height: 30px;
    line-height: 30px;
    border: 1px solid #b3bbcc;
    border-radius: 15px;
    box-shadow: none;
  }

  /deep/.van-dropdown-menu__title {
    position: relative;
    box-sizing: border-box;
    max-width: 100%;
    padding: 0 16px;
    color: #323233;
    font-size: 14px;
    line-height: 30px;
    flex: 1;
    box-sizing: border-box;
  }
  /deep/.van-dropdown-menu__title::after {
    position: absolute;
    top: 50%;
    right: 9px;
    margin-top: -10px;
    border: 1px solid;
    border-color: transparent transparent #b3bbcc #b3bbcc;
    -webkit-transform: rotate(-45deg);
    transform: rotate(-45deg);
    opacity: 0.8;
    content: "";
    height: 10px;
    width: 10px;
  }
  /deep/.van-field__right-icon {
    position: absolute;
    right: 6px;
    top: 3px;
    padding: 0;
    right: 12px;
  }
  .yzm {
    /deep/.van-field__right-icon {
      right: 120px;
    }
  }
  /deep/.van-icon-cross {
    color: #ef1010;
    font-size: 14px;
  }
  /deep/.van-icon-success {
    color: #90c320;
  }
  /deep/.van-cell:after {
    border-bottom: none;
  }
  /deep/.van-field__label {
    text-align: right;
    margin-right: 10px;
    line-height: 30px;
  }
  /deep/.van-hairline--top-bottom:after,
  .van-hairline-unset--top-bottom:after {
    border-width: 0;
  }
  /deep/.van-dropdown-item__option {
    padding-left: 100px;
  }
  .selcet {
    display: flex;
    padding: 0;
    margin-bottom: 20px;
    position: relative;

    .selcetlabel {
      width: 68px;
      font-size: 14px;
      line-height: 30px;
      text-align: right;
      margin-right: 10px;
    }
  }
  /deep/ .el-input-group__prepend {
    border: 0;
    top: 1px;
  }
  .select-area {
    width: 81px !important;
    height: 30px;
    background-color: #fff;
    border-radius: 4px;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    border: 1px solid #b3bbcc;
    border-right: transparent;
    box-sizing: border-box;

    /deep/ .el-input__validateIcon {
      display: none !important;
    }

    /deep/ .el-input__suffix {
      top: 0;
    }

    /deep/ .el-input__inner {
      border: 0;
    }
  }
}
</style>
