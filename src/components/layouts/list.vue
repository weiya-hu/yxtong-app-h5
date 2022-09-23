<template>
  <div>
    <!-- 自定义加载界面 -->
    <LoadingGif :className="'db-index-loading'" :loadFlag="loading"></LoadingGif>
    <div class="not-loading" v-show="!loading">
      <template v-if="nodata">
        <!-- 问题反馈弹出框 -->
        <el-dialog :visible.sync="dialogFeedbackShow" :modal-append-to-body="false" width="820px">
          <div slot="title" class="dialog-header">
            问题反馈
          </div>
          <DialogFeedback @closeDialog="()=>dialogFeedbackShow=false"></DialogFeedback>
        </el-dialog>
        <div class="no-data-msg">
          <img src="/static/imgs/nodata/db-nodata.png">
          <div class="msg">
            <p>对不起，小智已经很努力了，但没有找到对应数据。</p>
            <p>换个关键词试试，或 <a class="link-blue" @click="()=>dialogFeedbackShow=true">反馈</a> 给我们</p>
          </div>
        </div>
      </template>
      <template v-else>

        <slot></slot>

      </template>
    </div>
  </div>
</template>

<script>
  import LoadingGif from '@/components/common/globalCom/loading-gif'
  import DialogFeedback from '@/components/common/dialog-feedback'
  export default {
    components: {
      DialogFeedback,
      LoadingGif
    },
    props: {
      // 是否加载中=》加载中：true，加载完毕：false
      loading: {
        type: Boolean,
        default: () => {
          return true
        }
      },
      // 是否无数据=》无数据：true，有数据：false
      nodata: {
        type: Boolean,
        default: () => {
          return true
        }
      },
      vuex_name: {
        type: String,
      },
      api_name:{
        type: String,
      },
      defaultFiled:{
        type: Array,
      },
      tableHead:{
        type: Array,
      },
      test: {
        type: Boolean,
      },
      Check: {
        type: Boolean,
        default: true
      },
      Export: {
        type: Boolean,
        default: true
      },
      PageSizes: {
        type: Array,
        default: ()=>{
          return [20, 30, 50]
        }
      }
    },
    data () {
      return {
        dialogFeedbackShow: false
      }
    },
    computed: {
    },
    methods: {
    },
    created () {
    },
    watch: {
    }
  }
</script>

<style lang="less" scoped>
@import "~@/assets/less/var.less";
.no-data-msg {
  width: 100%;
  text-align: center;
  padding-top: 140px;
  .msg {
    font-size: 14px;
    color: #9ea8c3;
    line-height: 22px;
    padding-top: 10px;
  }
}
.card-hand{
  display: flex;
  justify-content: flex-end;
  padding: 10px 20px 0;
  box-sizing: border-box;
  .box{
    display: flex;
  }
  .item{
    display: flex;
    align-items: center;
    padding-left: 20px;
    &:hover .txt, &:hover i,&.on .txt, &.on i{
      color: #4877e8;
      cursor: pointer;
    }
    &:hover .txt{
      text-decoration: underline;
    }
  }
  .txt, i{
    color: #999;
  }
  .txt{
    font-size: 14px;
    padding-left: 3px;
  }
  i{
    font-size: 16px;
  }
}
.is-table{
  box-sizing: border-box;
  .no{
    color: #777;
    font-size: 12px;
  }
}
.page-cards,.is-table{
  padding: 10px 20px 0px 20px;
}

</style>
