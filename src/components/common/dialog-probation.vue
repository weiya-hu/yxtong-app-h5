<template>
  <div>
    <div class="form-box" v-if="!isHandled">
      <!-- 试用申请弹出框 - 内部 -->

      <div class="dialog-body3">
        <div class="dialog-content">
          <div class="content">
            <img src="@/assets/imgs/sysqimg.jpg" />
          </div>
        </div>
      </div>

      <!-- 试用申请表单提交 -->
      <div class="dialog-body4">
        <!-- <form id="formShenqing"> -->
        <el-form
          :model="shenqingForm"
          status-icon
          :rules="shenqingRules"
          ref="shenqingForm"
          :hide-required-asterisk="true"
          label-width="70px"
          id="formShenqing"
        >
          <div class="input-content1">
            <ul class="input-one">
              <li class="input-box1">
                <el-form-item
                  label="账号"
                  prop="name"
                  :hide-required-asterisk="true"
                >
                  <el-input
                    v-model="shenqingForm.name"
                    placeholder="请输入药智网账号"
                  ></el-input>
                  <div slot="error" class="input-sq-name-error">
                    <span v-if="sqNameError == 1"
                      >该账号未注册，请先<a
                        href="https://www.yaozh.com/register?ga_source=vip&ga_position=registered_4"
                        class="cl-blue"
                        target="_blank"
                        >注册</a
                      ></span
                    >
                    <span v-if="sqNameError == 2">请输入账号</span>
                  </div>
                </el-form-item>
              </li>
              <li class="input-box1">
                <el-form-item class="email-item" prop="email">
                  <div class="email-title">企业邮箱</div>
                  <el-input
                    v-model="shenqingForm.email"
                    placeholder="请填写企业邮箱"
                    @blur="checkEmail"
                  ></el-input>
                  <!-- <el-tooltip
                    class=""
                    effect="zhuce"
                    placement="top"
                    style="position: absolute; right: -20px; top: 4px;"
                  >
                    <div slot="content">
                      填写企业邮箱，可以提高试用申请通过率。
                    </div>
                    <i
                      class="el-icon-question cl-green"
                      style="line-height: 28px"
                    ></i>
                  </el-tooltip> -->
                  <!-- <span v-if="ischeckEmail" class="el-form-item__error"
                    >请输入正确的邮箱地址</span
                  > -->
                </el-form-item>
              </li>
            </ul>
          </div>
          <div class="input-content1">
            <ul class="input-one">
              <li class="input-box1">
                <el-form-item label="姓名" prop="surname">
                  <el-input
                    v-model="shenqingForm.surname"
                    placeholder="请输入姓名"
                  ></el-input>
                </el-form-item>
              </li>

              <li class="input-box1">
                <el-form-item label="公司" prop="company">
                  <el-autocomplete
                    v-model="shenqingForm.company"
                    @input="resetValue(shenqingForm.company)"
                    :fetch-suggestions="querySearchAsync"
                    title="请输入公司名称"
                    placeholder="请输入公司名称"
                    @select="handleSelect"
                    ref="popoverAutoInput"
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
                    </template></el-autocomplete
                  >
                </el-form-item>
              </li>
            </ul>
          </div>

          <div class="input-content1">
            <ul class="input-one">
              <li class="input-box1">
                <el-form-item label="部门" prop="department">
                  <el-input
                    v-model="shenqingForm.department"
                    placeholder="请输入部门名称"
                  ></el-input>
                </el-form-item>
              </li>
              <li class="input-box1">
                <el-form-item label="地区" prop="lacation">
                  <el-select
                    v-model="shenqingForm.lacation"
                    placeholder="请选择地区"
                  >
                    <el-option
                      v-for="(item, index) in shenqingLacations"
                      :key="index"
                      :label="item"
                      :value="item"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </li>
            </ul>
          </div>

          <div class="input-content1">
            <ul class="input-one">
              <li class="input-box1">
                <el-form-item label="手机" prop="phone">
                  <el-input
                    v-model="shenqingForm.phone"
                    placeholder="请输入手机号码"
                    class="input-phone"
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
                </el-form-item>
              </li>

              <li class="input-box1 spec">
                <el-form-item label="验证码" prop="vcode">
                  <el-input
                    v-model="shenqingForm.vcode"
                    placeholder="请输入验证码"
                  ></el-input>
                  <el-button
                    type="primary"
                    class="checkout"
                    :disabled="sms.codeBtnBan"
                    @click="sendCode"
                    >{{ sms.codeBtnText || t.b }}</el-button
                  >
                </el-form-item>
                <div class="prom-spec" v-if="sms.prompt">
                  <p v-html="sms.prompt"></p>
                </div>
              </li>
            </ul>
          </div>

          <!-- <div class="input-content1">
            <ul class="input-one">


            </ul>
          </div> -->
          <!-- <div class="input-content1">
            <ul class="input-one">
              <li class="input-box1">
                <el-form-item label="QQ" prop="qq">
                  <el-input
                    v-model="shenqingForm.qq"
                    placeholder="请输入QQ号码"
                  ></el-input>
                </el-form-item>
              </li>
              <li class="input-box1">
                <el-form-item label="职位" prop="position">
                  <el-input
                    v-model="shenqingForm.position"
                    placeholder="请输入职位名称"
                  ></el-input>
                </el-form-item>
              </li>
            </ul>
          </div> -->
          <div class="input-content1">
            <button
              type="button"
              class="content1-submit"
              @click="handleSubmit2('shenqingForm', serviceGa)"
            >
              提交
            </button>
          </div>
        </el-form>
        <!-- </form> -->
      </div>
    </div>
    <div v-if="isHandled">
      <div class="dialog-body5">
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
                <span :class="successOrfaile ? 'success-word' : 'filed-word'">{{
                  successOrfaile ? "提交成功!" : "提交失败!"
                }}</span>
                <span class="success-word-one">{{
                  successOrfaile ? "我们会尽快和您联系" : failMark
                }}</span>
              </div>
              <div class="word-two">
                <!-- <div class="success-word-one">
                  <div class="success-diot"></div>
                  <div class="success-words">每个ID号一个月内有4次申请试用机会。</div>
                </div> -->
                <div class="success-word-one">
                  <div class="success-diot"></div>
                  <div class="success-words">
                    每个ID号短期内（24小时）只能申请一次试用。
                  </div>
                </div>
                <div class="success-word-two">
                  <div class="success-diot"></div>
                  <div class="success-words">
                    若试用申请未通过或者试用资格过期，可加入qq群（<a
                      href="https://jq.qq.com/?_wv=1027&k=QdERVSz5"
                      target="_blank"
                      style="color: red"
                      >666700878</a
                    >）<br />获取更多试用机会。
                  </div>
                </div>
                <div class="success-word-three">
                  <div class="success-diot"></div>
                  <div class="success-words">
                    如有任何疑问，请拨打药智网客服热线：400-678-0778
                  </div>
                </div>
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
  props: {
    serviceGa: {
      //客服页面加ga事件
      type: String,
      default: () => {
        return "";
      },
    },
  },
  data() {
    // 必填
    let checkRequired = (rule, value, callback) => {
      if (value) {
        return callback();
      } else {
        callback(new Error(rule.message));
      }
    };
    //申请试用-检查qq
    let checkQQ = (rule, value, callback) => {
      let testQQReg = new RegExp(/^[1-9][0-9]{4,10}/); // 验证手机号
      let isQQRight = testQQReg.test(value); // 手机号是否正确
      if (value) {
        if (isQQRight) {
          callback();
        } else {
          callback(new Error("请输入正确的QQ号码"));
        }
      } else {
        callback(new Error("请输入QQ号码"));
      }
    };
    // 申请试用 - 检验账号
    let checkName = (rule, value, callback) => {
      if (value) {
        window
          .Axios({
            method: "post",
            url: "/api/user/usercheckForyaozh",
            params: {
              name: value,
            },
          })
          .then((res) => {
            if (res.data.code == 200) {
              this.sqNameError = 0;
              return callback();
            } else {
              this.sqNameError = 1;
              callback(new Error());
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        this.sqNameError = 2;
        callback(new Error());
      }
    };
    // 申请试用 - 检验手机号
    let checkPhone = (rule, value, callback) => {
      if (value) {
        this.isPhoneRight = true;
        return callback();
      } else {
        this.isPhoneRight = false;
        callback(new Error("请输入手机号码"));
      }
      // let testPhoneReg = new RegExp(/^[1][3,4,5,6,7,8,9][0-9]{9}$/) // 验证手机号
      // let isPhoneRight = testPhoneReg.test(value) // 手机号是否正确
      // if (value) {
      //   // if (isPhoneRight) {
      //   //   this.isPhoneRight = true
      //   //   callback()
      //   // } else {
      //   //   this.isPhoneRight = false
      //   //   callback(new Error('请输入正确的手机号码'))
      //   // }
      // } else {
      //     this.isPhoneRight = false
      //   callback(new Error('请输入手机号码'))
      // }
    };
    // 申请试用 - 检验邮箱
    let checkEmail = (rule, value, callback) => {
      let testEmailReg = new RegExp(
        /^[0-9A-Za-z][\.-_0-9A-Za-z]*@[0-9A-Za-z]+(\.[0-9A-Za-z]+)+$/
      ); // 验证邮箱格式
      let isEmailRight = testEmailReg.test(value); // 邮箱格式是否正确
      if (value) {
        if (isEmailRight) {
          callback();
        } else {
          callback(new Error("请输入正确的邮箱地址"));
        }
      } else {
        callback(new Error("请填写企业邮箱"));
      }
    };
    // 申请试用 - 检验验证码
    let checkCode = (rule, value, callback) => {
      if (value) {
        if (this.shenqingForm.phone) {
          Axios.get("/api/user/checkvcode", {
            params: {
              mobile: this.shenqingForm.phone,
              vcode: value,
            },
          })
            .then((res) => {
              if (res.data.code == 200) {
                this.sms.prompt = "";
                callback();
              } else {
                this.sms.prompt = "";
                callback(new Error(res.data.msg));
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
      } else {
        this.sms.prompt = "";
        callback(new Error("请输入验证码"));
      }
    };
    // 申请试用 - 检验验证码
    // let checkCodeChange = (rule, value, callback) => {

    //   if (value) {
    //     this.sms.prompt = ''
    //     callback()
    //   } else {
    //     // this.sms.prompt = ''
    //     callback(new Error('请输入验证码'))
    //   }
    // };
    return {
      checkPhoneFun: checkPhone,
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
      // 申请试用
      shenqingForm: {
        // v-model对应
        name: "",
        country: "86",
        lacation: "",
        surname: "",
        company: "",
        phone: "",
        department: "",
        email: "",
        // qq: "",
        // position: "",
        vcode: "",
        type: 4,
      },
      ischeckEmail: false, // 提示邮箱格式
      areaNum: areaNum.areaNum,
      country: "中华人民共和国+86", // 用于存储手机区号选项值
      tel: "86", // 用于短信验证码
      sqNameError: 0, // 申请试用-账号-错误-类别
      shenqingRules: {
        // 验证规则
        name: [{ required: true, validator: checkName, trigger: "blur" }],
        lacation: [
          {
            required: true,
            validator: checkRequired,
            message: "请选择公司所在地区",
            trigger: "change",
          },
        ],
        surname: [
          {
            required: true,
            validator: checkRequired,
            message: "请输入姓名",
            trigger: ["blur", "change"],
          },
        ],
        company: [
          {
            required: true,
            validator: checkRequired,
            message: "请输入公司名称",
            trigger: "blur",
          },
        ],
        // qq: [
        //   { required: true, validator: checkQQ, trigger: ["blur", "change"] }
        // ],
        phone: [
          {
            required: true,
            validator: checkPhone,
            trigger: ["blur", "change"],
          },
        ],
        department: [
          {
            required: true,
            validator: checkRequired,
            message: "请输入部门名称",
            trigger: "blur",
          },
        ],
        email: [
          {
            required: true,
            validator: checkEmail,
            trigger: ["blur", "change"],
          },
        ],
        // position: [
        //   {
        //     required: true,
        //     validator: checkRequired,
        //     message: "请输入职位名称",
        //     trigger: "blur"
        //   }
        // ],
        vcode: [
          { required: true, validator: checkCode, trigger: "blur" },
          // { validator: checkCodeChange, trigger: 'change' }
        ],
      },
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
        m: "验证码错误",
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
  watch: {
    "shenqingForm.company"(newVal, oldVal) {
      // 每次更改值之前先将输入建议数组清空 防止脏数据产生
      this.$refs.popoverAutoInput.suggestions = [];
    },
  },
  mounted() {
    this.handleuserInfo();
  },
  methods: {
    checkEmail() {
      let testEmailReg = new RegExp(
        /^[0-9A-Za-z][\.-_0-9A-Za-z]*@[0-9A-Za-z]+(\.[0-9A-Za-z]+)+$/
      ); // 验证邮箱格式
      let isEmailRight = testEmailReg.test(this.shenqingForm.email); // 邮箱格式是否正确
      if (this.shenqingForm.email) {
        if (isEmailRight) {
          this.ischeckEmail = false;
        } else {
          this.ischeckEmail = true;
        }
      } else {
        this.ischeckEmail = false;
      }
    },
    resetValue(value) {
      this.shenqingForm.company = _.trim(this.shenqingForm.company);
    },
    async querySearchAsync(queryString, cb) {
      if (!queryString) {
        cb();
        return;
      }
      const _this = this;
      await Axios.post("/api/user/getkeydowmcompany", {
        keywords: queryString,
      })
        .then((res) => {
          let data = res.data.data;
          if (res.data.code == 200) {
            let arr = [];
            console.log(data);
            data &&
              data.length > 0 &&
              data.forEach((item) => {
                arr.push({
                  value: item,
                });
              });
            cb(arr);
          } else {
            cb();
          }
        })
        .catch((err) => {
          console.log(err);
          cb();
        });
    },
    handleSelect(item) {
      console.log(item);
    },
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
              lacation: _data.province || "",
              surname: "",
              company: _data.comname || "",
              phone: _data.mobile || "",
              department: "",
              email: _data.email || "",
              // qq: _data.qq_num || "",
              // position: "",
              vcode: "",
              type: 4,
              country: "86",
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 短信登录-发送短信验证码
    async sendCode() {
      if (this.isPhoneRight) {
        // 如果手机号格式正确
        await this.getTimeStamp();

        let timeStamp = this.timeStamp;
        let randStr = Math.random().toString(36).slice(2);
        this.sms.codeBtnBan = true;
        this.sms.codeBtnText = this.t.f;
        this.sms.prompt = "";
        this.shenqingForm.vcode = "";
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
              this.sms.prompt = "";
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
        // console.info(this.shenqingForm)
        this.$refs["shenqingForm"].validateField("phone");
        // this.shenqingForm
        // this.checkPhoneFun('',this.shenqingForm.phone,function(){})
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
    handleSubmit2(formName, a) {
      console.log(window.location.href, document.title);
      //客服中心申请加ga
      window.ga("send", "event", "button", "click", a);
      window._paq.push(["trackEvent", "button", "click", a]);

      let _this = this;
      this.$refs[formName].validate((valid) => {
        if (valid && this.ischeckEmail === false) {
          this.sms.prompt = "";
          let dataForm = _.cloneDeep(this.shenqingForm);
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
                this.sms.prompt = _data.msg;
                this.shenqingForm.vcode = "";
                return;
              }
              // 11014 验证码错误提示
              if (_data.code == 11037) {
                this.sms.prompt = _data.msg;
                this.shenqingForm.vcode = "";
                return;
              }
              this.sms.prompt = "";

              if (_data.code == 200) {
                _this.successOrfaile = true;
              } else {
                _this.successOrfaile = false;
                // 目前仅保留40002的提示
                _this.failMark =
                  _data.code == 40002
                    ? "此账号今日已提交，客服会尽快与您联系，请稍等"
                    : "";
                // _this.failMark =
                //   _data.code == 40001
                //     ? "此IP今日已提交，客服会尽快与您联系，请稍等"
                //     : _data.code == 40002
                //     ? "此账号今日已提交，客服会尽快与您联系，请稍等"
                //     : _data.code == 40003
                //     ? "申请次数超过4次，若有试用申请，请联系客服"
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
                type: 4,
                country: "86",
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
      });
    },
  },
};
</script>

<style lang="less" scoped>
@import "~@/assets/less/app.less";
@import "~@/assets/less/var.less";

.el-select-dropdown__item {
  padding-left: 15px;
}
.form-box {
  width: 750px;
  margin: 0 auto;
}
.dialog-body3 {
  height: 163px;
  .dialog-content {
    .content {
      width: 100%;
      float: left;
      padding-left: 47px;
      .img {
        width: 644px;
        height: 163px;
      }
    }
  }
}
.dialog-body4 {
  margin-top: 20px;
  height: 320px;

  /deep/ .el-input__inner {
    padding: 0 10px;
  }

  /deep/.el-form-item.is-required .el-form-item__label:before {
    color: #f00;
  }
  .el-select {
    width: 100%;
  }

  /deep/ .el-input-group__prepend {
    background-color: #fff;
    border-radius: 4px;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    border: 1px solid #dfe5f1;
    border-right: transparent;
    border-left: transparent;
    box-sizing: border-box;
  }

  .input-phone {
    /deep/ .el-input__suffix {
      top: -4px;
    }
  }

  .email-item {
    /deep/ .el-form-item__content {
      display: flex;
      margin-left: 0 !important;

      .email-title {
        width: 90px;
        text-align: right;
        padding-right: 12px;
        box-sizing: border-box;
        position: relative;

        &::before {
          content: "*";
          color: #f00;
          margin-right: 4px;
          position: absolute;
          left: -5px;
          top: 1px;
        }
      }

      .el-form-item__error {
        margin-left: 70px;
      }
    }
  }

  .select-area {
    width: 81px;
    background-color: #fff;
    border-radius: 4px;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    border: 1px solid #dfe5f1;
    border-right: transparent;
    box-sizing: border-box;

    /deep/ .el-input__validateIcon {
      display: none !important;
    }

    /deep/ .el-input__suffix {
      top: 0;
    }
  }

  .input-content {
    width: 734px;
    height: 60px;
    margin-left: 46px;
    margin-top: 20px;
    float: left;
    .input-sq-name-error {
      color: #f56c6c;
      font-size: 12px;
      line-height: 1;
      padding-top: 4px;
      padding-left: 16px;
      position: absolute;
      top: 100%;
      left: 0;
    }
    .input-one {
      width: 100%;
      height: 30px;
      .input-box1 {
        position: relative;
        width: 309px;
        margin-right: 20px;
        height: 100%;
        float: left;

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

  /deep/.el-autocomplete {
    width: 100%;
  }
  .input-content1 {
    width: 734px;
    height: 60px;
    margin-left: 46px;
    float: left;

    .spec {
      /deep/.el-form-item__content {
        display: flex;
        align-items: center;
      }
      /deep/.el-input {
        flex: 1;
      }
      .checkout {
        width: 100px;
        height: 30px;
        margin-left: 10px;
        line-height: 30px;
        border-radius: 4px;
        color: #fff;
        font-size: 13px;
        padding: 0;
      }
    }
    .prom-spec {
      position: absolute;
      top: 40px;
      width: 100%;
      height: 22px;
      padding-left: 85px;
      font-size: 12px;
      color: #f56c6c;
      background: #fff;
      z-index: 9;
      box-sizing: border-box;
      span {
        pointer-events: none;
      }
    }
    .input-sq-name-error {
      color: #f56c6c;
      font-size: 12px;
      line-height: 1;
      padding-top: 4px;
      padding-left: 10px;
      position: absolute;
      top: 100%;
      left: 0;
    }
    /deep/.el-form-item__error {
      padding-left: 10px;
    }
    .input-one {
      width: 100%;
      height: 30px;
      .input-box1 {
        position: relative;
        width: 309px;
        margin-right: 20px;
        height: 100%;
        float: left;
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
    .content1-submit {
      width: 264px;
      height: 30px;
      background: @PrimaryColor;
      color: white;
      outline: none;
      line-height: 30px;
      text-align: center;
      border: none;
      border-radius: 4px;
      margin-left: 180px;
      margin-top: 8px;
      transition: all 100ms;
      &:hover {
        background-color: Lighten(@PrimaryColor, 5%);
        transition: all 100ms;
      }
    }
  }
}
.dialog-body5 {
  margin-top: 120px;
  height: 374px;
  // .dialog-content{
  //   text-align: center;
  //   height: 200px;
  //   .content{
  //     // width: 100%;
  //     // height: 200px;
  //     display: inline-block;
  //     // float: left;
  //     // padding-left: 47px;
  //     text-align: left;
  .dialog-content {
    height: 200px;
    .content {
      width: 750px;
      margin: 0 auto;
      .picture {
        float: left;
        .img {
          width: 160px;
          height: 200px;
          float: left;
        }
        .img_fail {
          width: 173px;
          height: 171px;
          margin-top: 30px;
        }
      }
      .content-word {
        height: 140px;
        margin: 0px 0 0 8px;
        padding-top: 7px;
        float: left;
        .words-one {
          height: 50px;
          .success-word {
            font-size: 34px;
            color: @PrimaryColor;
            line-height: 50px;
            font-weight: 800;
            margin-right: 10px;
          }
          .filed-word {
            font-size: 34px;
            color: @Orange;
            line-height: 50px;
            font-weight: 800;
            margin-right: 10px;
          }
          .success-word-one {
            font-size: 18px;
            line-height: 50px;
          }
        }
        .word-two {
          padding-top: 22px;
          .success-word-one {
            overflow: hidden;
            .success-diot {
              width: 6px;
              height: 6px;
              background-color: #555b6d;
              border-radius: 50%;
              margin-top: 10px;
              float: left;
            }
            .success-words {
              font-size: 14px;
              line-height: 30px;
              margin-left: 10px;
              color: #555b6d;
              float: left;
            }
          }
          .success-word-two,
          .success-word-three {
            overflow: hidden;
            .success-diot {
              width: 6px;
              height: 6px;
              border-radius: 50%;
              background-color: #555b6d;
              margin-top: 10px;
              float: left;
            }
            .success-words {
              width: 430px;
              font-size: 14px;
              line-height: 30px;
              margin-left: 10px;
              color: #555b6d;
              float: left;
            }
          }
        }
      }
    }
  }
}
</style>
