<template>
  <div class="la-input">
    <div class="title">
      <div class="flex">
        <label class="title-label">
          <NewProjectGuide postion="基础" :onlyKey="initItem['new_id']"
            :newPosition="{ right: initItem.statement ? -40 : -26 }" display="inline" compoentsName="检索功能"
            :initItem="initItem" :showMenban="initItem['is_show_new']">{{ initItem.label }}</NewProjectGuide>
        </label>
        <el-tooltip v-if="initItem.statement" effect="light" placement="right">
          <div slot="content" v-html="initItem.statement"></div>
          <span class="section-ico-qa"></span>
        </el-tooltip>
        <el-tooltip v-else-if="initItem.field == 'qiyemingcheng' && initItem.label == '企业名称' && vuex_name == 'Zhuce'"
          effect="light" placement="right">
          <div slot="content" v-html="helpDesc.baseSearch"></div>
          <span class="section-ico-qa"></span>
        </el-tooltip>
      </div>
      <el-checkbox v-if="initItem.accurate === '精确'" class="title-right" @change="nameChange" v-model="accurateValue"
        size="mini">精确</el-checkbox>
    </div>
    <inputPopover :value="value" :accurate="accurateValue">
      <!-- 有自动提示的输入框 - （普通搜索）药品名称、企业名称 -->
      <el-autocomplete :data-name="initItem.field" v-model="value" @keyup.native.enter="getEnterKey()"
        @input="resetValue(value)" :title="(item.placeholder + '').length > 10 ? item.placeholder : ''"
        :placeholder="item.placeholder" :fetch-suggestions="querySearchAsync" :popper-append-to-body="false" clearable
        ref="popoverAutoInput">
        <template slot-scope="{ item }">
          <div style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;" :title="item.value">{{ item.value
          }}</div>
        </template>
      </el-autocomplete>
    </inputPopover>
  </div>

</template>

<script>
// import newProjectGuide from "@/components/common/newProjectGuide";
import inputPopover from '@/components/inputs/input-popover';
const defaultItem = {
  name: "",
  type: "text",
  label: "",
  placeholder: "",
  accurate: "",
  search_hint: "",
  value: "",
  statement: ""
};
export default {
  props: {
    vuex_name: {
      type: String,
      default() {
        return ""
      }
    },
    api_name: {
      type: String,
      default() {
        return ""
      }
    },
    item: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  components: {
    inputPopover,
    // newProjectGuide
  },
  data() {
    return {
      accurateValue: false,
      // IE内核的浏览器，在 el-autocomplete  使用了 placeholder 之后，会在页面初次加载的时候就触发 input 事件，导致 resetValue 被调用。
      // once: true,
      value: "",
      helpDesc: {
        baseSearch: '源于NMPA（非cde登记企业名称）'
      }
    }
  },
  computed: {
    //经过格式化后的item
    initItem() {
      return Object.assign({}, defaultItem, this.item)
    },
    vuexQuery() {
      return Store.state[this.vuex_name].queryStrAnaly;
    }
  },
  watch: {
    vuexQuery: {
      handler(val) {
        var array = JSON.parse(val)
        this.value = "";
        this.accurateValue = false
        for (var i = 0; i < array.length; i++) {
          if (this.initItem.name === array[i].name) {
            this.value = array[i].value
            this.accurateValue = array[i].accurate
          }
        }
      },
      deep: true
    },
    value() {
      // 每次更改值之前先将输入建议数组清空 防止脏数据产生
      this.$refs.popoverAutoInput.suggestions = [];
    },
    //搜索框显示name
    vuexQuery: {
      handler(val) {
        var array = JSON.parse(val)
        this.value = "";
        this.accurateValue = false
        for (var i = 0; i < array.length; i++) {
          if (this.initItem.name === array[i].name) {
            this.value = array[i].value
            this.accurateValue = array[i].accurate
          }
        }
      },
      deep: true
    }
  },
  methods: {
    //获取提示词
    querySearchAsync(queryString, callback) {
      // 限制2个级以上的字符在做搜索提示
      if (queryString.length < 2) {
        callback([]);
        return
      }
      var list = []
      var param = Qs.parse(this.initItem.name + "=" + queryString.slice(0, this.accurateValue ? this.inpMaxLenJq : this.inpMaxLen)); //解决参数键值不能为变量
      let _queryString = ""
      if (queryString.slice(0, this.accurateValue ? this.inpMaxLenJq : this.inpMaxLen) == '') {
        callback([]);
        return;
      }
      if (_queryString != queryString) {
        _queryString = queryString;

        // search_hint有值且包含/使用传值路径请求
        let url
        if (this.initItem.search_hint.search('/') === -1) {
          url = "/api/" + this.api_name + '/input';
        } else {
          url = "/api/" + this.initItem.search_hint
        }
        window.Axios({
          methods: "get",
          url: url,
          params: _.assign({ accesstoken: this.vueGetCookie("accesstoken") }, param)
        }).then(res => {
          if (res.data == "") {
            callback([])
          } else {
            let data = [];
            for (let i = 0, l = res.data.data.length; i < l; i++) {
              data.push({ value: res.data.data[i] })
            }
            callback(data)
          }
        })
          .catch(thrown => {
            console.log("请求出错了")
          })
        this.resetValue(queryString);
      }
    },
    nameChange() {
      // if (this.initItem.value) {
      Store.commit(this.vuex_name + "/queryAnaly", {
        opt: 1,
        param: {
          name: this.initItem.name,
          label: this.initItem.label,
          accurate: this.accurateValue,
          value: this.initItem.value,
          type: this.initItem.type
        }
      })
      Store.commit(this.vuex_name + "/queryStrAnaly", Store.state[this.vuex_name].queryAnaly)
      // }
    },
    resetValue(value) {
      this.initItem.value = _.trim(value)
      this.nameChange()
    },
    getEnterKey() {
      this.$emit("nomalSearch")
    },
    getQueryString(name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
      var r = window.location.search.substr(1).match(reg);
      if (r != null) {
        return unescape(r[2]);
      }
      return null;
    }
  },
  created() {
    // 初始是否精确
    // let queryString = location.search.substring(1).split('&')
    // console.log(this.initItem)
    if (this.item.initAccurate) {
      this.accurateValue = true
    }

    //解决左侧input搜索后，时间列表和视图分析 切换时有一个页面input为空
    try {
      var array = JSON.parse(this.vuexQuery);
      for (var i = 0; i < array.length; i++) {
        if (this.initItem.name === array[i].name) {
          this.value = array[i].value
        }
      }
    } catch (err) {

    }
  },
  mounted() {
    this.inputPopMouseleave(this)
  }
}
</script>

<style lang="less">
@import "~@/assets/less/var.less";

.la-input {
  padding: 0 14px 0 10px;

  .title {
    padding: 10px 0px 4px;
    font-size: 14px;
    color: #333;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .flex {
      display: flex;
      align-items: center;
    }

    .title-right {
      float: right;
      color: @FontColor3;
    }
  }

  .el-autocomplete {
    width: 100%;

    .el-input__inner {
      background-color: @InputBgColor;
    }
  }

  .section-ico-qa {
    width: 14px;
    height: 14px;
    display: block;
    background-image: url(/static/imgs/globaldrugs/qa.png);
    background-size: cover;
    margin-left: 5px;

    &:hover {
      background-image: url(/static/imgs/globaldrugs/qa-c.png);
    }
  }
}
</style>
