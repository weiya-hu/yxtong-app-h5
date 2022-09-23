<template>
    <section :class="classObject">

      <div v-show="!hide.left&&!unshow" class="la-left-side">
        <el-scrollbar>
          <slot name="left"></slot>
        </el-scrollbar>
      </div>

      <div @click="handleToggleFold('left')" class="side-fold" v-if="!unshow">
        <i class="arrow-left"></i>
        <i class="arrow-right"></i>
      </div>

      <slot></slot>

    </section>
</template>

<script>
  import { mapState } from 'vuex'
  import setTableHMixins from '@/mixins/setTableH.js'
  export default {
    props: {
      unshow: {
        type: Boolean,
      },
    },
    components: {

    },
    mixins: [
      setTableHMixins
    ],
    data() {
      return {
        fold: {
          left: null
        },
        hide: {
          left: null
        },
        pathArr:[]
      }
    },
    computed: {
      ...mapState({
        showPromtNotice: state => state.showPromtNotice
      }),
      classObject () {
        var base = {
          'la-main': true,
          'fold-left-side': (!this.unshow&&!this.fold.left)||this.unshow
        }
        return base
      }
    },
    watch:{
      $route:{
        handler(){
          if(this.pathArr.indexOf(this.$route.path)!==-1){
            this.pathArr.push(this.$route.path)
          }else{
            if(this.hide.left||this.unshow){
              return
            }
          }
          this.fold.left = !!this.$slots.left
          this.hide.left = !this.$slots.left
        },
        deep:true,
        immediate:true
      },
      showPromtNotice: {
        handler(val) {
          this.$nextTick(()=> {
            document.querySelector(".la-left-side").style.top = (val ? 78 : 48) + 'px';
            document.querySelector(".la-left-side .el-scrollbar__view>div").style.paddingBottom = (val ? 40 : 0) + 'px';
          })
        },
        deep:true,
        immediate:true
      }
    },
    methods: {
      handleToggleFold (direction) {
        this.hide[direction] = this.fold[direction]
        this.fold[direction] = !this.fold[direction]
        Store.commit("Layouts/side_fold",!this.fold.left);
        setTimeout(() => {
          this.calHtable()
        }, 300)
      },
      sets() {

      },
      updateWidth (type) { //var:win 则为窗口大小改变;
        if (type=="win") {
          Store.commit("Layouts/client_width",window.innerWidth);
        }

      }
    },
    mounted() {
      this.updateWidth("win")
      //窗口变化重新计算尺寸
      window.onresize = ()=>{
        return this.updateWidth("win")
      };
    },
  }
</script>

<style lang="less">
@import "~@/assets/less/var.less";

.el-scrollbar {
  height: 100%;
  overflow: visible;
}
// .el-scrollbar__wrap {
//   overflow-x:hidden;
// }
.la-main{
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  position: relative;

  &.fold-left-side{
    .la-left-side{
      transition: all 300ms 50ms;
      left: -288px;
    }
    .side-fold{
      transition: all 300ms 50ms;
      left: 1px;
      background-color: #97A2BE!important;

      .arrow-left {display: none;}
      .arrow-right {display: inline-block;}
      &:hover{
        color: @White!important;
        background-color: Lighten(#35384a, 10%)!important;
      }
    }
    .la-right {
      transition: all 300ms 50ms;
      padding-left: 10px!important;
      .db-index-loading {
        transition: all 300ms 50ms;
        width: 100vw !important;
        left: 0 !important;
      }
    }
  }
  .la-left-side {
    width: @LeftSideWidth;
    height: calc(100% - 48px);
    position: fixed;
    // left: 51px;
    box-sizing: border-box;
    background-color: @White;
    transition: all 300ms 50ms;
    box-shadow: @BoxShadow;
    z-index: 1000;

    .el-scrollbar__wrap {
      overflow: auto;
      scrollbar-width: none;
      -ms-overflow-style: none;
    }
  }
  .side-fold{
    transition: all 300ms 50ms;
    position: absolute;
    left: 288px;
    top: 50%;
    transform: translateY(-36px);
    width: 8px;
    height: 36px;
    line-height: 36px;
    background-color: #97A2BE;
    color: #fff;
    cursor: pointer;

    &:hover{
      color: @White;
      background-color: Lighten(#35384a, 10%);
    }
    .arrow-left {
      width: 0;
      height: 0;
      border-top: 6px solid transparent;
      border-right: 7px solid #F0F3FA;
      border-bottom: 6px solid transparent;
      display: inline-block;
    }
    .arrow-right {
      width: 0;
      height: 0;
      border-top: 6px solid transparent;
      border-left: 7px solid #F0F3FA;
      border-bottom: 6px solid transparent;
      display: none;
    }
  }
  .unshow{
    display: none;
  }
  .la-right {
    transition: all 300ms 50ms;
    width: 100%;
    height: 100%;
    padding-left: @LeftSideWidth + 10px;
    padding-right: 10px;
    padding-bottom: 10px;
    box-sizing: border-box;
    .sec2 {
      background: #fff;
      border-radius: 4px;
      box-shadow: @BoxShadow;

      .db-index-loading {
        transition: all 300ms 50ms;
        //置于提示窗下
        z-index: 1997;
        position: fixed;
        top: 48px;
        left: 288px;
        width: calc(100vw - @LeftSideWidth);
        height: calc(100vh - 48px);
        background: rgba(254, 254, 254, .7);
        text-align: center;
        overflow: hidden;
        img {
          position: absolute;
          top: 50%;
          left: 50%;
          margin-left: -75px;
          margin-top: -60px;
          padding: 0px!important;
        }
      }

      .no-data-msg {
        width: 100%;
        text-align: center;
        padding-top: 140px;
        padding-bottom: 50px;
        .msg {
          font-size: 14px;
          color: #9ea8c3;
          line-height: 22px;
          padding-top: 10px;
          p {
            margin: 0px;
            a {
              color: @PrimaryColor;
            }
          }
        }
      }
    }
  }
}

@media screen and (max-width: 1280px) {
  .la-main .la-left-side {
    width: 260px;
  }

  .la-main .la-right {
    padding-left: 270px;
  }

  .la-main .side-fold {
    left: 260px;
  }

  .la-main .la-right .sec2 .db-index-loading {
    left: 260px;
    width: calc(100vw - 260px);
  }
}
</style>
