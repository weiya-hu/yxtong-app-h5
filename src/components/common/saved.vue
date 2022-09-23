<template>
  <div class="item saved-options" v-if="storeState.saved_options.length">
    <span class="item-title">保存的条件</span>
    <ul class="options">
      <!-- 一串搜索条件 -->
      <li class="option text-overflow" v-for="(option, index) in computed_saved_options" :key="index">
        <span class="option-detail" :title="option.wherename" @click="handleSearch(option.whereinfo, vuex_name, storeState)">
          {{option.wherename}}
        </span>
        <i class="el-icon-delete" @click="handleDeleted(option)"></i>
      </li>
    </ul>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  export default{
    props: {
      vuex_name: { // 必须！
        type: String,
        default: ''
      },
      api_name: { // 必须！
        type: String,
        default: ''
      },
    },
    data () {
      return {

      }
    },
    computed:{
      // ...mapState({
      //   storeState: state => state[state][this.vuex_name]
      // }),
      storeState () {
        return Store.state[this.vuex_name]
      },
      computed_saved_options () {
        let data = this.storeState.saved_options ? this.storeState.saved_options : []
        return data
      },
    },
    watch: {

    },
    created () {
      this.initSaved()
    },
    methods: {
      initSaved () {
        // console.info( this.api_name)
        window.Axios({
          method: 'get',
          url: '/api/'+ this.api_name +'/savewherelist',
          params: {
            accesstoken: this.vueGetCookie("accesstoken"),
          }
        }).then(res => {
          if (res.status == 200 && res.data.data) {
            let data = res.data.data
            Store.commit(this.vuex_name + '/saved_options', data)
          }
        }).catch(err => {
          console.log(err)
        })
      },
      handleDeleted (option) {
        window.Axios({
          method: 'get',
          url: '/api/'+ this.api_name +'/delsavewhere',
          params: {
            accesstoken: this.vueGetCookie("accesstoken"),
            id: option.id,
          }
        }).then(res => {

        }).catch(err => {
          console.log(err)
        }).then(this.initSaved)
      },
    }
  }
</script>

<style lang="less" scoped>
@import "~@/assets/less/var.less";
.saved-options {
  .item-title {
    display: block;
    height: 30px;
    padding-left: 10px;
    line-height: 30px;
    font-size: @FontSize;
    background-color: @SerchBackgroundColor;
    color: #333;
  }
  .options {
    padding: 10px 14px 10px 10px;
    cursor: pointer;
  }
  .option {
    height: 16px;
    line-height: 16px;
    position: relative;
    display: inline-block;
    width: 100%;
    // padding: 5px 10px 5px 0px;
    font-size: 12px;
    .option-detail {
      cursor: pointer;
      display: inline-block;
      width: 190px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      &:hover {
        color: @PrimaryColor;
      }
    }
    .el-icon-delete {
      cursor: pointer;
      float: right;
      font-size: 14px;
      &:hover {
        color: @PrimaryColor;
        font-weight: bold;
      }
    }
  }
}
</style>
