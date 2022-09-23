<template>
  <div class="wrapper">
    <!-- 自定义加载界面 -->
    <LoadingGif :loadFlag="loading" v-if="loading"></LoadingGif>
    <!-- 加载完成显示部分 -->
    <div class="detail-list" v-else>
      <div class="main">
        <div class="mian-inf">
          <div class="logo">
            <div class="detail-list">
              <img v-if="base_info.logo" :src="base_info.logo" @error="picLoadError">
              <img v-else src="/static/imgs/companyreport/icon_nothing.jpg" >
            </div>
          </div>
          <div class="name-all">
            <span class="name text-overflow" :title="base_info.qymc">{{base_info.qymc}}</span>
            <span class="state-icon addr" v-if="base_info.qyguojia">{{base_info.qyguojia}}</span>
            <span class="state-icon state" v-if="base_info.jyzt">{{base_info.jyzt}}</span>
            <span class="state-icon xingzhi" v-if="base_info.rzlc">{{base_info.rzlc}}</span>
          </div>
          <div class="left-info">
            <div class="url">
              <span>企业官网：</span>
              <a :href="'http://' + base_info.qygw" target="_blank" v-if="base_info.qygw">{{base_info.qygw}}</a>
              <span v-else>无</span>
              <i class="iconfont" v-if="base_info.qygw">&#xe6e6;</i>
            </div>
            <div class="tell">
              <span>联系电话：</span>
              <span>{{base_info.lxdh ? base_info.lxdh : '无'}}</span>
            </div>
            <div class="email">
              <span>电子邮箱：</span>
              <span>{{base_info.email ? base_info.email : '无'}}</span>
            </div>
          </div>
          <div class="right-info">
            <div class="item">
              <div class="name">注册申报</div>
              <div class="num"><span class="number">{{count_arr.count_zcsb | formatNumber}}</span><span class="dw">个</span></div>
            </div>
            <div class="hr"></div>
            <div class="item">
              <div class="name">临床试验</div>
              <div class="num"><span class="number">{{count_arr.count_lcsy | formatNumber}}</span><span class="dw">个</span></div>
            </div>
            <div class="hr"></div>
            <div class="item">
              <div class="name">上市药品</div>
              <div class="num"><span class="number">{{count_arr.count_ssyp | formatNumber}}</span><span class="dw">个</span></div>
            </div>
            <div class="hr"></div>
            <div class="item">
              <div class="name">药品中标</div>
              <div class="num"><span class="number">{{count_arr.count_ypzb | formatNumber}}</span><span class="dw">个</span></div>
            </div>
            <!-- <div class="hr"></div>
            <div class="item">
              <div class="name">发明专利</div>
              <div class="num"><span class="number">{{13 | formatNumber}}</span><span class="dw">个</span></div>
            </div> -->
          </div>
          <!-- <div class="right-handle">
            <div class="double-btn">
              <div class="click-btn guanzhu iconfont">&#xe655; 关注</div>
              <div class="click-btn jiankong iconfont">&#xe67e; 监控</div>
            </div>
            <div class="download-btn">下载报告</div>  
          </div> -->
        </div>
        <div class="classified">
          <!-- 左侧导航条 -->
          <div class="catalogues">
            <!-- 企业信息 -->
            <div class="catalogue active">
              <div class="out-catalogue" @click="openCatas">
                企业信息
              </div>
              <div class="inner-catalogue iconfont active" @click="openInfo">&#xe757;企业分析</div>
              <div class="inner-catalogue iconfont" @click="openInfo">&#xe757;基础信息</div>
            </div>
            <!-- 市场销售 -->
            <div class="catalogue" v-if="count_arr.count_ssyp || count_arr.count_nbsj || count_arr.count_ypxs || count_arr.count_ypzb">
              <div class="out-catalogue" @click="openCatas">
                市场销售
              </div>
              <div class="inner-catalogue iconfont" @click="openInfo" v-if="count_arr.count_ssyp">&#xe757;上市药品</div>
              <div class="inner-catalogue iconfont" @click="openInfo" v-if="count_arr.count_nbsj">&#xe757;年报数据</div>
              <div class="inner-catalogue iconfont" @click="openInfo" v-if="count_arr.count_ypxs">&#xe757;药品销售</div>
              <div class="inner-catalogue iconfont" @click="openInfo" v-if="count_arr.count_ypzb">&#xe757;中标信息</div>
            </div>
            <!-- 药物研发 -->
            <div class="catalogue" v-if="count_arr.count_zcsb || count_arr.count_lcsy">
              <div class="out-catalogue" @click="openCatas">
                药物研发
              </div>
              <div class="inner-catalogue iconfont" @click="openInfo" v-if="count_arr.count_zcsb">&#xe757;注册申报</div>
              <div class="inner-catalogue iconfont" @click="openInfo" v-if="count_arr.count_lcsy">&#xe757;临床试验</div>
            </div>
            <!-- 知识产权 -->
            <div class="catalogue" v-if="count_arr.count_scrz">
              <div class="out-catalogue" @click="openCatas">
                知识产权
              </div>
              <!-- <div class="inner-catalogue iconfont" @click="openInfo" v-if="count_arr.count_zlbj">&#xe757;专利布局</div> -->
              <div class="inner-catalogue iconfont" @click="openInfo" v-if="count_arr.count_scrz">&#xe757;生产认证</div>
            </div>
            <!-- 拓展分析 -->
            <div class="catalogue" v-if="count_arr.count_fxfx || extendList.length">
              <div class="out-catalogue" @click="openCatas">
                拓展分析
              </div>
              <div class="inner-catalogue iconfont" @click="openInfo" v-if="count_arr.count_fxfx">&#xe757;风险信息</div>
              <div class="inner-catalogue iconfont" @click="openInfo" v-if="extendList.length">&#xe757;扩展信息</div>
            </div>
          </div>
          <!-- 类似router-view的具体页面 -->
          <div class="classified-info">
            <DetailQyfx v-if="active_catalogue == 'qyfx'"></DetailQyfx>
            <DetailJcxx v-if="active_catalogue == 'jcxx'"></DetailJcxx>
            <DetailSsyp v-if="active_catalogue == 'ssyp'"></DetailSsyp>
            <DetailNbsj v-if="active_catalogue == 'nbsj'"></DetailNbsj>
            <DetailYpxs v-if="active_catalogue == 'ypxs'"></DetailYpxs>
            <DetailZbxx v-if="active_catalogue == 'zbxx'"></DetailZbxx>
            <DetailZcsb v-if="active_catalogue == 'zcsb'"></DetailZcsb>
            <DetailLcsy v-if="active_catalogue == 'lcsy'"></DetailLcsy>
            <!-- <DetailZlbj v-if="active_catalogue == 'zlbj'"></DetailZlbj> -->
            <DetailScrz v-if="active_catalogue == 'scrz'"></DetailScrz>
            <DetailFxxx v-if="active_catalogue == 'fxxx'"></DetailFxxx>
            <DetailKzxx v-if="active_catalogue == 'kzxx'" :extendList="extendList"></DetailKzxx>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import DetailJcxx from './DetailJcxx'
  import DetailQyfx from './DetailQyfx'
  import DetailSsyp from './DetailSsyp'
  import DetailNbsj from './DetailNbsj'
  import DetailYpxs from './DetailYpxs'
  import DetailZbxx from './DetailZbxx'
  import DetailZcsb from './DetailZcsb'
  import DetailLcsy from './DetailLcsy'
  // import DetailZlbj from './DetailZlbj'
  import DetailScrz from './DetailScrz'
  import DetailFxxx from './DetailFxxx'
  import DetailKzxx from './DetailKzxx'
  import { mapState } from 'vuex'

  import LoadingGif from '@/components/common/globalCom/loading-gif'
  import detailScrollMixins from '@/mixins/detailScroll.js'

  export default {
    components:{
      DetailJcxx,
      DetailQyfx,
      DetailSsyp,
      DetailNbsj,
      DetailYpxs,
      DetailZbxx,
      DetailZcsb,
      DetailLcsy,
      // DetailZlbj,
      DetailScrz,
      DetailFxxx,
      DetailKzxx,
      LoadingGif
    },
    mixins: [
      detailScrollMixins
    ],
    data () {
      return {
        loading: true,
        catalogues: {
          qyfx: '企业分析',
          jcxx: '基础信息',
          ssyp: '上市药品',
          nbsj: '年报数据',
          ypxs: '药品销售',
          zbxx: '中标信息',
          zcsb: '注册申报',
          lcsy: '临床试验',
          // zlbj: '专利布局',
          scrz: '生产认证',
          fxxx: '风险信息',
          kzxx: '扩展信息',
        },
        base_info: {},
        count_arr: {
          count_zcsb: 0,
          count_lcsy: 0,
          count_ssyp: 0,
          count_ypzb: 0,
          // 分隔
          count_zlbj: 1, // 暂时设为1=>true
          count_fxfx: 0,
          count_nbsj: 0,
          count_scrz: 0,
          count_ypxs: 0,
        },
        extendList: [],
        // ylbm:'',
        active_catalogue:"qyfx" //默认进入详情页显示 企业分析页 - qyfx
      }
    },
    computed: {
      ...mapState({
        nopms: state => state.CompanyReport.nopms,
        allBase: state => state.CompanyReport.allBase,
        helpInfo: state => state.CompanyReport.helpInfo,
      }),
    },
    watch: {
      // $route () {
      //   this.handleAxios()
      // },
      base_info () {
        this.$nextTick(() => {
          this.loading = false
        })
      },
    },
    filters: {
      // 给数字每三位数加一个逗号
      formatNumber (val) {
        val = parseInt(val)
        return val.toString().replace(/(\d)(?=(\d{3})+$)/g, '$1,')
      }
    },
    methods: {
      async handleAxios () {
        let id = this.$route.path.split("/")[2]
        await window.Axios({
          method: 'get',
          url: '/api/company/' + id,
          params: {
            accesstoken: GETCOOKIEFUN("accesstoken")
          }
        }).then(res => {
          if (res.data.code === 200 && res.data) {
            let data = res.data.data
            this.base_info = data
            this.getExtendList('company',data.extendList)

            _.set(this.count_arr, "count_zcsb", data.count_arr.count_zhuce)
            _.set(this.count_arr, "count_lcsy", data.count_arr.count_linchuang)
            _.set(this.count_arr, "count_ssyp", data.count_arr.count_ssyp)
            _.set(this.count_arr, "count_ypzb", data.count_arr.count_yaopinzhongbiao)

            Store.commit("CompanyReport/bm", data.qiyebianmatz)
          }
        }).catch(err => {
          console.log(err)
        })

        window.Axios({
          method: 'get',
          url: '/api/company/nav',
          params: {
            bm: Store.state.CompanyReport.bm
          }
        }).then(res => {
          if (res.data.code === 200 && res.data) {
            let data = res.data.data

            _.set(this.count_arr, "count_fxfx", data.List.res.fxfx)
            _.set(this.count_arr, "count_nbsj", data.List.res.nbsj)
            _.set(this.count_arr, "count_scrz", data.List.res.scrz)
            _.set(this.count_arr, "count_ypxs", data.List.res.ypxs)
          }
        }).catch(err => {
          console.log(err)
        })
      },
      openCatas (event) {
        $(event.target).parent().siblings('.catalogue').removeClass('active')
        $(event.target).parent().addClass('active')
      },
      openInfo (event) {
        let length = Object.keys(this.catalogues).length
        $('.inner-catalogue').removeClass('active')
        $(event.target).addClass('active')
        for (let i = 0; i < length; i++) {
          if ($(event.target).text().indexOf(Object.values(this.catalogues)[i]) !== -1) {
            this.active_catalogue = Object.keys(this.catalogues)[i]
          }
        }
      },
      handleScroll () {
        const h = $('.detail-header').height()
        const h1 = $('.mian-inf').height()
        const scrollTop = $('.wrapper').offset().top
        
        if(scrollTop < -h1+20) {
          $('.catalogues').css({"top": h + 20 + 15 + 48, "left": 10, "position": "fixed"})
        } else {
          $('.catalogues').css({"top": 0, "left": 0, "position": "absolute"})
        }
      },
      onScroll () {
        window.addEventListener('scroll', this.handleScroll,true)
      },
      picLoadError (ev) { // 图片加载失败，切换为默认图
        ev.target.src = "/static/imgs/companyreport/icon_nothing.jpg"
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
      Store.dispatch("CompanyReport/getBaseInfo")
      this.onScroll()
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
  @import "~@/assets/less/app.less";
  @import "~@/assets/less/detailCom.less";
.wrapper {
  .detail-list{
    margin-top: 10px;
    .mian-h{
      position: fixed;
      width: calc(100% - 51px);
      top: 48;
      right: 0;
      padding: 0 20px 20px;
      z-index: 2;
      box-sizing: border-box;
    }
    .mian-inf{
      border-radius: 4px;
      height: 136px;
      position: relative;
      padding: 20px 100px 20px 166px;
      box-shadow: @BoxShadow;
      background-color: #fff;
      // display: flex;
      // justify-content: flex-start;
      // flex-wrap: nowrap;
      .logo {
        float: left;
        position: absolute;
        left: 30px;
        top: 18px;
        width: 122px;
        height: 122px;
        border: 2px solid #eff2fa;
        overflow: hidden;
        padding:5px;
        .detail-list{
          width: 122px;
          height: 122px;
          display: inline-block;
          z-index:1;
          position: relative;
          overflow: hidden;
          img {
            position:absolute;
            top:0;
            bottom:0;
            left:0;
            right:0;
            width:100%;
            margin:auto;
            z-index: -1;
            *zoom:1;
          }
        }
        .detail-list:before {
          content: "";
          display: inline-block;
          padding-bottom: 100%;
          width: 0.1px;	/*必须要有数值，否则无法把高度撑起来*/
          vertical-align: middle;
        } 
      }
      .name-all {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex-wrap: nowrap;
        margin-bottom: 10px;
        margin-left: 30px;
        .name {
          display: inline-block;
          font-size: 23px;
          line-height: 1;
          color: @PrimaryColor;
          font-weight: bold;
          margin-right: 30px;
          max-height: 36px;
          max-width: 345px;
        }
        .state-icon {
          display: inline-block;
          height: 20px;
          line-height: 20px;
          color: #fff;
          font-size: 12px;
          padding: 0px 10px;
          border-radius: 10px;
          margin: 0px 10px;
        }
        .addr {
          background: #90c31f;
        }
        .state {
          background: #4877e8;
        }
        .xingzhi {
          background: #ff9601;
        }
      }
      .left-info {
        float: left;
        overflow: hidden;
        height: 100px;
        margin-left: 30px;
        
        .url {
          height: 30px;
          line-height: 30px;
          font-size: 14px;
          a {
            display: inline-block;
            color: @PrimaryColor;
          }
          i {
            display: inline-block;
            margin-left: 4px;
            font-size: 12px;
          }
        }
        .tell {
          height: 30px;
          line-height: 30px;
          font-size: 14px;
        }
        .email {
          height: 30px;
          line-height: 30px;
          font-size: 14px;
        }
      }
      .right-info {
        float: right;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: nowrap;
        overflow: hidden;
        height: 100px;
        min-width: 754px;
        margin: 0px 10px;
        box-sizing: border-box;
        .item {
          width: 150px;
          text-align: center;
          .name {
            font-weight: bold;
            font-size: 14px;
          }
          .num {
            display: flex;
            justify-content: center;
            .number {
              font-size: 28px;
              font-weight: bold;
              color: @PrimaryColor;
              margin-right: 6px;
            }
            .dw {
              font-weight: bold;
              font-size: 14px;
              padding-top: 5px;
            }
          }
        }
        .hr {
          height: 26px;
          width: 0px;
          border-left: 1px solid #6f7584;
        }
      }
      .right-handle {
        position: absolute;
        right: 36px;
        top: 18px;
        width: 164px;
        height: 136px;
        .double-btn {
          display: flex;
          justify-content: space-between;
          margin: 20px 0px;
          .click-btn {
            box-sizing: border-box;
            text-align: center;
            color: @PrimaryColor;
            font-size: 15px;
            width: 78px;
            height: 25px;
            line-height: 25px;
            border-radius: 13px;
            border: 1px solid @PrimaryColor;
            cursor: pointer;
            &:hover {
              color: #fff;
              background: @PrimaryColor;
            }
          }
        }
        .download-btn {
          width: 100%;
          height: 46px;
          background: @PrimaryColor;
          border-radius: 5px;
          color: #fff;
          font-size: 13px;
          text-align: center;
          line-height: 46px;
          cursor: pointer;
          transition: all 300ms;
          &:hover {
            box-shadow: 0px 5px 15px 0px @PrimaryColor;
            transition: all 300ms;
          }
        }
      }
    }
    .classified{
      position: relative;
      margin-top: 20px;
      .catalogues{
        position: absolute;
        left: 0;
        top: 0;
        .catalogue {
          border-radius: 4px;
          &.active {
            .out-catalogue {
              border-radius: 4px;
              border-left: 4px solid @PrimaryColor;
              background-color: #fff;
              box-shadow: @BoxShadow;
              color: @PrimaryColor;
              border-bottom: 1px dashed transparent;
            }
            .inner-catalogue {
              display: block;
            }
          }
          .out-catalogue{
            border-radius: 4px;
            font-size: 14px;
            box-sizing: border-box;
            width: 180px;
            padding-left: 20px;
            line-height: 39px;
            border-left: 4px solid @PrimaryBackgroundColor;
            border-bottom: 1px dashed #dfe5f1;
            cursor: pointer;
            &:hover{
              border-left: 4px solid @PrimaryColor;
              border-bottom: 0px;
              background-color: #fff;
              box-shadow: @BoxShadow;
              border-bottom: 1px dashed transparent;
            }
          }
          .inner-catalogue {
            border-radius: 4px;
            padding-left: 40px;
            font-size: 13px;
            box-sizing: border-box;
            width: 180px;
            // padding-left: 50px;
            line-height: 40px;
            border-left: 4px solid @PrimaryBackgroundColor;
            border-bottom: 1px dashed @BorderColor;
            cursor: pointer;
            display: none;
            i {
              display: inline-block;
              cursor: pointer;
            }
            span {
              display: inline-block;
              cursor: pointer;
            }
            &.active,&:hover{
              color: @PrimaryColor;
            }
          }
        }
      } 
      .classified-info{
        // box-shadow: @BoxShadow;
        margin-left: 190px;
        // background-color: @White;
        // min-height: 600px;
        margin-bottom: 50px;
      }  
    }
  }
}

@media screen and (max-width: 1600px) {
  .wrapper {
    .detail-list{
      .mian-inf{
        .right-info{
          min-width: 500px;
        }
      }
    }
  }
}
@media screen and (max-width: 1440px) {
  .wrapper {
    .detail-list{
      .mian-inf{
        padding-right: 10px;
        .right-info{
          min-width: 300px;
        }
      }
    }
  }
}
</style>