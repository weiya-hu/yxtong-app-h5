<template>
  <div class="wrapper">
    <!-- 自定义加载界面 -->
    <LoadingGif :loadFlag="isLoading" v-if="isLoading"></LoadingGif>
    <!-- 加载完成显示部分 -->
    <div class="detail-list" v-else>
      <div class="detail-header">
        <div class="header-left">
          <div class="left-top">
            <span class="top-id" :title="data.pinm">{{data.pinm}}</span>
          </div>
        </div>
      </div>
      <div class="main">
        <slide-section  :title="'基础信息'">
          <div class="tb-wrap">
            <table class="tb-t">
              <tr>
                <td>分子式</td>
                <td v-html="vueFormulationsFormatter(data.fzs)"></td>
                <td>CAS登记号</td>
                <td>{{data.casn ? data.casn : "/"}}</td>
              </tr>
              <tr>
                <td>分子量</td>
                <td>{{data.fzl}}</td>
                <td>分子编号</td>
                <td>{{data.en}}</td>
              </tr>
              <tr>
                <td>元素组成</td>
                <td colspan="3">{{data.yszc}}</td>
              </tr>
              <tr>
                <td>结构式</td>
                <td colspan="3">
                  <img :src="data.casimg" @error="picLoadError" class="img-jiegoushi">
                </td>
              </tr>
            </table>
          </div>
        </slide-section>
        <slide-section  :title="'合成路线'" v-if="hasPartTwo">
          <div class="tb-wrap">
            <el-tabs>
              <el-tab-pane v-for="(item, index) in hecheng" :key="index" :label="'合成路线' + (index + 1)">
                <table class="tb-t">
                  <tr v-if="item.zjtbh">
                    <td>该中间体在本合成路线中的序号：</td>
                    <td v-html="item.zjtbh"></td>
                  </tr>
                  <tr>
                    <td>合成路线图</td>
                    <td>
                      <img :src="'http:' + item.casimg" @error="picLoadError" class="img-hechengluxian">
                    </td>
                  </tr>
                  <tr v-if="item.hectxt">
                    <td>合成路线说明</td>
                    <td v-html="item.hectxt"></td>
                  </tr>
                  <tr>
                    <td>参考文献</td>
                    <td>
                      <div v-for="(wx, index1) in item.refs" :key="index1">
                        <span>【{{wx.wxh}}】</span>
                        <span v-html="wx.wxtxt"></span>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>中间体</td>
                    <td style="padding: 0 0 0 50px;">
                      <table class="tb-t-in">
                        <tr>
                          <td style="width: 80px">中间体序号</td>
                          <td>分子编号</td>
                          <td style="width: 330px">品名</td>
                          <td>CAS号</td>
                          <td>分子式</td>
                          <td style="width: 80px">供应商</td>
                        </tr>
                        <tr v-for="(fzk, index2) in item.fzk" :key="index2">
                          <td>{{fzk.zjtbh}}</td>
                          <td>{{fzk.en}}</td>
                          <td>
                            <router-link tag="a" :to="'/fzk1/' + fzk.id" target="_blank" class="cl-blue limit-pinming">{{fzk.pinm}}</router-link>
                          </td>
                          <td>{{fzk.casn}}</td>
                          <td v-html="vueFormulationsFormatter(fzk.fzs)"></td>
                          <td>
                            <a :href="fzk.xq" class="cl-blue" target="_blank" v-if="fzk.xq">详情</a>
                            <span v-else style="color: #aaa; cursor: not-allowed">详情</span>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td>合成目标</td>
                    <td>
                      <router-link tag="a" :to="'/ywfzk/' + item.hcmb.id" target="_blank" class="cl-blue">{{item.hcmb.inn}}</router-link>
                    </td>
                  </tr>
                </table>
              </el-tab-pane>
            </el-tabs>
          </div>
        </slide-section>
        <slide-section  :title="'扩展信息'" v-if="hasExtend">
          <div class="extend-list">
            <ExtendButton v-for="(item, index) in extendList" :key="index" :item="item"></ExtendButton>
          </div>
        </slide-section>
      </div>
      <la-footer></la-footer>
    </div>
  </div>
</template>

<script>
  import LoadingGif from '@/components/common/globalCom/loading-gif'
  import SlideSection from '@/components/common/slide-section'
  import LaFooter from '@/components/layouts/footer'
  import { mapState } from 'vuex'
  import ExtendButton from '@/components/common/extend-button'
  import detailScrollMixins from '@/mixins/detailScroll.js'
  export default {
    components: {
      LoadingGif,
      SlideSection,
      LaFooter,
      ExtendButton
    },
    mixins: [
      detailScrollMixins
    ],
    data () {
      return {
        isLoading: true,
        data: {},
        hecheng: [],
        id: '',
        extendList: [], // 扩展信息
        hasPartTwo: false,
        hasExtend: false,
      }
    },
    computed: {
      ...mapState({
        nopms: state => state.Ywhc2.nopms,
        allBase: state => state.Ywhc2.allBase,
        helpInfo: state => state.Ywhc2.helpInfo,
      }),
    },
    methods: {
      handleAxios () {
        window.Axios({
          method: 'get',
          url: '/api/fzk1/' + this.$route.params.id,
          params: {
            tp: this.$route.query.tp,
            accesstoken: GETCOOKIEFUN("accesstoken")
          }
        }).then((res) => {
          if (res.data.code === 200 && res.data.data) {
            this.data = res.data.data
            this.hecheng = res.data.data.hc
            this.getExtendList('fzk1',res.data.data.extendList)
            if(res.data.data.hc.length){
              this.hasPartTwo = true
            }
          }

        }).catch((err) => {
          console.log(err)
        }).then(this.removeLoading)
      },
      // 加载完后移除加载界面
      removeLoading () {
        this.isLoading = false
      },
      picLoadError (ev) { // 图片加载失败，切换为默认图
        ev.target.src = "/static/imgs/general/no-drug-img.jpg"
      },
    },
    created () {
      if (!this.nopms.xqy) {
        this.handleAxios()
      }
      setTimeout(() => {
        const hashLocation= sessionStorage.getItem("hashLocation");//缓存中获取当前页面的路由名称
        // 注意, 这里使用全路径匹配,在hash模式中,因为地址会携带#,所以页面报告中的url需要重新覆盖一下, 将#去除
        window._paq.push(['setCustomUrl', "https://" + hashLocation]);//覆盖页面报告的url，可以自定义页面url，加上本页面路由
        window._paq.push(['trackPageView', this.allBase.dbname]);//页面名称,可以自定义页面名称
        window._paq.push(['setDocumentTitle', this.allBase.dbname])
      }, 1000);
    },
    mounted() {
      Store.dispatch("Ywhc2/getBaseInfo")
    },
    activated() {
      this.vueRouteToNoPms(this.nopms.xqy)
    },
    updated() {
      this.vueRouteToNoPms(this.nopms.xqy)
      this.vueTogglePmsTooltip()
    },
  }
</script>

<style lang="less" scoped>
  @import "~@/assets/less/var.less";
  @import "~@/assets/less/detailCom.less";
.wrapper {
  position: relative;
  .img-jiegoushi {
    max-width: 300px;
  }
  .img-hechengluxian {
    max-width: 740px;
  }
  .limit-pinming {
    display: inline-block;
    max-width: 330px;
    white-space: normal;
    word-break: break-word;
  }
  .detail-list {

    .main {

      .el-tabs {
        width: 100%;
      }
      .tb-t {
        width: 100%;
        &>tr{
          &>td {
            box-sizing: border-box;
            border: 1px solid @BorderColorNew;
            font-size:13px;
            height: 34px;
            &:nth-child(1) {
              // 使第一列的文字不换行
              padding-left: 50px;
              width: 184px;
              white-space: nowrap;
              background: @DetailTableLeftColor;
              font-weight:bold;
            }
            &:nth-child(2) {
              padding-left: 50px;
              background: @DetailTableRightColor;
            }
            &:nth-child(3) {
              width: 184px;
              white-space: nowrap;
              background: @DetailTableLeftColor;
            }
            &:nth-child(4) {
              background: @DetailTableRightColor;
            }
          }
        }
        .tb-t-in {
          width: 100%;
          tr {
            width: 100%;
            &:first-of-type {
              td {
                background-color: #F5F8FB;
              }
            }
            td {
              text-align: center;
              border: none;
              background-color: @DetailTableRightColor;
            }
          }
        }
      }
    }
  }
}
</style>
