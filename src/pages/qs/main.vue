<template>
  <div class="wq-main">
    <LoadingGif
      :className="'list-in-loading'"
      :classNameImg="'little-size-loading'"
      :loadFlag="isloading"
      v-if="isloading"
      :delayTime="0"
    ></LoadingGif>
    <template v-else>
      <h1 class="title">{{ form.name }}</h1>
      <el-form ref="wqform" label-position="top" :model="form">
        <el-form-item
          v-for="(item, index) in form.questions"
          :key="index"
          :label="index + 1 + '.' + item.name"
          :prop="`questions[${index}].value`"
          :rules="{ required: item.required, message: '回答不能为空', trigger: 'blur' }"
        >
          <template v-if="item.type == 'radio'">
            <el-radio-group v-model="item.value">
              <div class="selects">
                <div
                  class="select-item"
                  v-for="(rd, j) in item.options"
                  :key="j"
                >
                  <el-radio 
                  :label="rd.value"
                  >
                    {{ rd.name
                    }}<input
                      class="other-input"
                      v-if="rd.is_blank"
                      v-model="item.extra"
                      type="text"
                    />
                  </el-radio>
                </div>
              </div>
            </el-radio-group>
          </template>
          <template v-if="item.type == 'checkbox'">
            <el-checkbox-group v-model="item.value" @change="changeHandler">
              <div class="selects">
                <div
                  class="select-item"
                  v-for="(rd, j) in item.options"
                  :key="j"
                >
                  <el-checkbox 
                  :label="rd.value"
                  >
                    {{ rd.name
                    }}<input
                      class="other-input"
                      v-if="rd.is_blank"
                      v-model="item.extra"
                      type="text"
                    />
                  </el-checkbox>
                </div>
              </div>
            </el-checkbox-group>
          </template>
          <template v-if="item.type == 'textarea'">
            <el-input
              type="textarea"
              :rows="3"
              placeholder="请输入内容"
              v-model="item.value"
            />
          </template>
        </el-form-item>
        <el-form-item v-if="form.questions.length">
          <div style="text-align: center">
            <el-button type="primary" style="width: 100px" @click="submit"
              >提交</el-button
            >
          </div>
        </el-form-item>
      </el-form>
    </template>
  </div>
</template>

<script>
import Axios from "axios";
import moment from "moment";
import LoadingGif from "@/components/common/globalCom/loading-gif";

export default {
  name: "qa",
  data() {
    return {
      form: {
        questions: [],
        name: "问卷标题",
      },
      rules: {},
      isloading: true,
    };
  },
  components: {
    LoadingGif,
  },
  methods: {
    changeHandler(e) {
      console.log(e);
    },
    submit() {
      this.$refs["wqform"].validate((valid) => {
        console.log(valid);
        if (valid) {
          const token = this.$route.params.token;
          const source = this.$route.query.source || 1;

          const answerData = this.form.questions.map((t) => {
            // 这里 用户 填了 但是没有勾选 就要处理了
            const blank_item = t.options.find(k => k.is_blank)?t.options.find(k => k.is_blank).value:''; 
            return {
              filed_id: t.id,
              answer: t.type === 'checkbox'?t.value.join(','):t.value,
              blank: (blank_item && t.value.includes(blank_item))?t.extra:'',
            };
          });
          Axios.post("/api/questionnaire/submit", {
            token,
            source,
            data: JSON.stringify(answerData),
          }).then((res) => {
            if (res.data.code === 200 ){
              this.$router.push("/qs/stoped?s=ok");
            } else {
              this.$message({
                message:res.data.msg || '提交失败！',
                type:"warning"
              })
            }
          });
          
        } else {
          console.log("error submit!!");
          setTimeout(() => {
            document
              .querySelector(".el-form-item__error")
              .scrollIntoView({ block: "end" });
          }, 150);
          return false;
        }
      });
    },
    getQustions() {
      const token = this.$route.params.token;
      Axios.get("/api/questionnaire/lists?token=" + token).then((res) => {
        this.isloading = false;
        if (res.data.code === 200) {
          this.form.questions = res.data.data.map((item) => {
            return {
              ...item,
              value: item.type === "checkbox" ? [] : "",
              extra: "",
            };
          });
        }
      });
    },
  },
  created() {
    const token = this.$route.params.token;
    Axios.get("/api/questionnaire/userInfo?token="+token).then((res) => {
      if (res.data.code === 200) {
        if (res.data.data.is_answer) {
          this.$router.push("/qs/stoped?s=visited");
        }
        if (
          (res.data.data.vipendtime &&
          moment.duration(moment(res.data.data.vipendtime).diff()).days() < -4) 
          || !res.data.data.vipendtime
        ) {
          this.$router.push("/qs/stoped");
        } 
        this.form.name = res.data.data.title || '问卷标题';
      } else {
        this.$router.push("/qs/stoped");
      }
    });
    this.getQustions();
  },
};
</script>

<style lang="less" scoped>
.wq-main {
  padding: 44px 70px 95px;
  .title {
    text-align: center;
    font-size: 26px;
    color: #4877e8;
    line-height: 22px;
    margin-bottom: 40px;
  }
}
/deep/.el-row {
  width: 100%;
}
/deep/.el-radio-group {
  display: block;
}
/deep/.el-radio {
  min-height: 30px;
  font-size: 14px;
  display: inline-flex;
}
/deep/.el-radio__inner {
  width: 16px;
  height: 16px;
}
/deep/.el-checkbox__inner {
  width: 16px;
  height: 16px;
}
/deep/.el-radio__input.is-checked .el-radio__inner {
  background-color: #fff;
  &::after {
    background-color: #4877e8;
    width: 8px;
    height: 8px;
  }
}
/deep/.el-checkbox {
  min-height: 30px;
  font-size: 14px;
  display: inline-flex;
}
/deep/.el-checkbox__label {
  line-height: 19px;
  white-space: normal;
  padding-left: 8px;
  font-size: 14px;
}
/deep/.el-radio__label {
  line-height: 19px;
  white-space: normal;
  padding-left: 8px;
  font-size: 14px;
}
/deep/.el-textarea__inner {
  margin-bottom: 5px;
}
/deep/.el-form-item__label {
  font-weight: bold;
  color: #333;
  font-size: 16px;
  line-height: 22px;
  padding-bottom: 16px;
}
/deep/.el-form-item {
  margin-bottom: 30px;
}
/deep/.el-checkbox__input.is-checked .el-checkbox__inner {
  background-color: #fff;
  &::after {
    border-color: #4877e8;
    height: 9px;
    width: 4px;
    left: 5px;
  }
}
/deep/.el-form-item__content {
  line-height: 30px;
}
.other-input {
  width: 100px;
  border: none;
  border-bottom: 1px solid #5f5b6d;
}
.selects {
  display: flex;
  flex-wrap: wrap;
}
.select-item {
  width: 25%;
  position: relative;
  padding: 0 10px;
  margin-bottom: 8px;
  box-sizing: border-box;
}
@media only screen and (max-width: 768px) {
  .wq-main {
    padding: 24px;
    .title {
      font-size: 22px;
    }
  }
  .select-item {
    width: 100%;
  }
  /deep/.el-form-item__label {
    font-size: 14px;
  }
  /deep/.el-checkbox__label {
    font-size: 12px;
  }
  /deep/.el-radio__label {
    font-size: 12px;
  }
}
</style>