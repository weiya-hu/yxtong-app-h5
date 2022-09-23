<template>
  <div class="item saved-options" v-if="storeState.saved_options.length">
    <div class="item-title">
      <span>保存的条件</span>
      <!-- <img width="15" src="~@/assets/imgs/globaldrugs/open_icon.png" alt="">
        <img width="15" src="~@/assets/imgs/globaldrugs/stow_icon.png" alt=""> -->
      <span class="shrink" v-if="isOpen" @click="handleOpen">+</span>
      <span class="shrink" v-else @click="handleStow">-</span>
    </div>
    <ul class="options">
      <!-- 一串搜索条件 -->
      <li
        class="option text-overflow"
        v-for="(option, index) in computed_saved_options"
        :key="index"
      >
        <span
          class="option-detail"
          :title="option.wherename"
          @click="handleSearch(option.whereinfo, vuex_name, storeState)"
        >
          {{ option.wherename }}
        </span>
        <i class="el-icon-delete" @click="handleDeleted(option)"></i>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  props: {
    vuex_name: {
      // 必须！
      type: String,
      default: "",
    },
    api_name: {
      // 必须！
      type: String,
      default: "",
    },
  },
  data() {
    return {
      isOpen: false
    };
  },
  computed: {
    // ...mapState({
    //   storeState: state => state[state][this.vuex_name]
    // }),
    storeState() {
      return Store.state[this.vuex_name];
    },
    computed_saved_options() {
      let data = this.storeState.saved_options
        ? this.storeState.saved_options
        : [];
      return data;
    },
  },
  watch: {},
  created() {
    this.initSaved();
  },
  methods: {
    // 展开
    handleOpen() {
      window.ga("send", "event", "button", "click", "企业版_全球药物_保存条件_展开");
      window._paq.push([
        "trackEvent",
        "button",
        "click",
        "企业版_全球药物_保存条件_展开",
      ]);
      $('.options').show(500)
      this.isOpen = false
    },

    // 收起
    handleStow() {
      window.ga("send", "event", "button", "click", "企业版_全球药物_保存条件_收起");
      window._paq.push([
        "trackEvent",
        "button",
        "click",
        "企业版_全球药物_保存条件_收起",
      ]);
      $('.options').hide(500)
       this.isOpen = true
    },
    initSaved() {
      // console.info( this.api_name)
      window
        .Axios({
          method: "get",
          url: "/api/" + this.api_name + "/savewherelist",
          params: {
            accesstoken: this.vueGetCookie("accesstoken"),
          },
        })
        .then((res) => {
          if (res.status == 200 && res.data.data) {
            let data = res.data.data;
            Store.commit(this.vuex_name + "/saved_options", data);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    handleDeleted(option) {
      window
        .Axios({
          method: "get",
          url: "/api/" + this.api_name + "/delsavewhere",
          params: {
            accesstoken: this.vueGetCookie("accesstoken"),
            id: option.id,
          },
        })
        .then((res) => {})
        .catch((err) => {
          console.log(err);
        })
        .then(this.initSaved);
    },
  },
};
</script>

<style lang="less" scoped>
@import "~@/assets/less/var.less";
.saved-options {
  .item-title {
    display: block;
    height: 40px;
    padding-left: 10px;
    padding-right: 16px;
    font-size: @FontSize;
    background-color: #fff;
    color: #000f32;
    font-weight: 500;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0px 1px 8px 0px rgba(9, 20, 79, 0.1);
    position: relative;

    &::before {
      content: "";
      width: 2px;
      height: 40px;
      background: #002FA7;
      position: absolute;
      left: 0;
      top: 0;
    }

    .shrink {
      display: flex;
      align-items: center;
      width: 15px;
      height: 15px;
      justify-content: center;
      font-size: 12px;
      color: #ffa914;
      border: 1px solid #dbdfe7;
      font-weight: normal;
      cursor: pointer;
      box-sizing: border-box;
    }
  }
  .options {
    padding: 10px;
    padding-right: 17px;
    cursor: pointer;
  }
  .option {
    height: 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    width: 100%;
    // padding: 5px 10px 5px 0px;
    font-size: 12px;
    border-bottom: 1px solid #EBEEF5;
    .option-detail {
      cursor: pointer;
      display: inline-block;
      width: 190px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      color: #333;
      &:hover {
        color: #002FA7;
      }
    }
    .el-icon-delete {
      cursor: pointer;
      float: right;
      font-size: 14px;
      color: #FFA914;
    }

    &:last-child {
      border-bottom: none;
    }
  }
}
</style>
