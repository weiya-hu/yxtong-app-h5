<template>
  <div class="wrapper" ref="wrapper">
    <!-- 自定义加载界面 -->
    <LoadingGif :loadFlag="isLoading" v-if="isLoading"></LoadingGif>
    <!-- 加载完成显示部分 -->
    <div class="detail-list" v-else>
      <div class="detail-header">
        <div class="header-left">
          <div class="left-top">
            <span class=" top-id" :title="data.name">{{data.name}}</span>
          </div>
        </div>
      </div>
      <!-- ① 通用详情页 -->
      <div class="main">
        <!-- 基本信息 -->
        <slide-section  :title="'基本信息'">
          <div class="tb-wrap">
            <table class="tb-t">
              <template v-for="(item, index) in field">
                <!-- 不同template是不同的tr格式 -->
                <template v-if="item[0] === 'pjfb'">
                  <template v-if="data.pjfb.length">
                    <tr :key="index" class="pjfb-label">
                      <td :rowspan="data.pjfb.length+1">
                        {{ item[1] }}
                        <el-tooltip class="tooltips-incidentalConditions" effect="light" placement="right">
                          <div slot="content" v-html="helpDesc.batchRelease"></div>
                          <i class="el-icon-question cl-green"></i>
                        </el-tooltip>
                      </td>
                      <td>注册地址</td>
                      <td>申请类别</td>
                      <td>生产单位</td>
                      <td>申请单位</td>
                      <td>代理单位</td>
                      <td>批件发布时间</td>
                      <td>审批结论</td>
                      <td>备注</td>
                    </tr>
                    <!-- 记：嵌套循环，key中两个v-for的变量都要绑定用到 -->
                    <tr v-for="(ite, inde) in data.pjfb" :key="index+'-'+inde" class="pjfb-prop">
                      <!-- 第一个会被css改变背景色，hack一下 -->
                      <td class="dn"></td>
                      <td>{{ data.pjfb[inde]['zcdz'] }}</td>
                      <td>{{ data.pjfb[inde]['sqlb'] }}</td>
                      <td>{{ data.pjfb[inde]['scqy'] }}</td>
                      <td>{{ data.pjfb[inde]['sqqy'] }}</td>
                      <td>{{ data.pjfb[inde]['dlqy'] }}</td>
                      <td>{{ data.pjfb[inde]['pjfbsj'] }}</td>
                      <td>{{ data.pjfb[inde]['spjl'] }}</td>
                      <td>{{ data.pjfb[inde]['bz'] }}</td>
                    </tr>
                  </template>
                </template>
                <template v-else-if="item[0] === 'pjyj'">
                  <template v-if="data['pjyj'].length">
                    <tr :key="index" class="pjyj-label">
                       <td :rowspan="data.pjyj.length+1">
                        {{ item[1] }}
                        <el-tooltip class="tooltips-incidentalConditions" effect="light" placement="right">
                          <div slot="content" v-html="helpDesc.batchMailing"></div>
                          <i class="el-icon-question cl-green"></i>
                        </el-tooltip>
                      </td>
                      <td colspan="5">邮寄地址</td>
                      <td colspan="2">EMS单号</td>
                      <td colspan="1">邮寄日期</td>                      
                    </tr>
                    <!-- 记：嵌套循环，key中两个v-for的变量都要绑定用到 -->
                    <tr v-for="(ite, inde) in data[item[0]]" :key="inde" class="pjyj-prop">
                      <!-- 第一个会被css改变背景色，hack一下 -->
                      <td class="dn"></td>
                      <td colspan="5">{{ ite['yjdz'] }}</td>
                      <td colspan="2">{{ ite['ems'] }}</td>
                      <td colspan="1">{{ ite['yjrq'] }}</td>             
                    </tr>
                  </template>
                </template>
                <!-- <template v-else-if="item[0] === 'pjyj'">
                  <template v-if="data[item[0]].length">
                    <tr :key="index">
                      <td>
                        {{ item[1] }}
                        <el-tooltip class="tooltips-incidentalConditions" effect="light" placement="right">
                          <div slot="content" v-html="helpDesc.batchMailing"></div>
                          <i class="el-icon-question cl-green"></i>
                        </el-tooltip>
                      </td>
                      <td colspan="8">
                        <div>邮寄地址：{{ data[item[0]][0].yjdz }}</div>
                        <div>EMS单号：{{ data[item[0]][0].ems }}</div>
                        <div>邮寄日期：{{ data[item[0]][0].yjrq }}</div>
                      </td>
                    </tr>
                  </template>
                </template> -->
                <template v-else>
                  <tr :key="index" v-if="data[item[0]]">
                    <td>{{ item[1] }}</td>
                    <td colspan="8">
                      {{ data[item[0]] }}
                    </td>
                  </tr>
                </template>
              </template>
            </table>
          </div>
        </slide-section>
        <!-- 扩展信息 -->
        <slide-section  :title="'扩展信息'" v-if="extendList.length">
          <div class="extend-list">
            <ExtendButton v-for="(item, index) in extendList" :key="index" :item="item"></ExtendButton>
          </div>
        </slide-section>
      </div>
    </div>
  </div>
</template>

<script>
  import LoadingGif from '@/components/common/globalCom/loading-gif'
  import ExtendButton from '@/components/common/extend-button'
  import SlideSection from '@/components/common/slide-section'
  import LaFooter from '@/components/layouts/footer'
  import detailScrollMixins from '@/mixins/detailScroll.js'
  import { mapState } from 'vuex'
  import Axios from 'axios'

  export default {
    components: {
      LoadingGif,
      ExtendButton,
      SlideSection,
      LaFooter,
    },
    mixins: [
      detailScrollMixins
    ],
    data () {
      return {
        isLoading: true,
        field: [
          ['slh', '受理号'],
          ['name', '器械名称'],
          ['sqlx', '申请类型'],
          ['sqqy', '企业名称'],
          ['fysdr', '费用收到日'],
          ['jfsjyjdz', '缴费收据邮寄地址'],
          ['blzt', '审批状态'],
          ['ztkssj', '审批状态开始时间'],
          ['sfqk', '收费情况'],
          ['slrq', '受理日期'],
          ['zs', '主审专家'],
          ['spzt', 'CMDE审评状态'],
          ['pjyj', '批件邮寄'],
          ['pjfb', '批件发布'],
        ],
        data: {},
        extendList: [],
        helpDesc: {
          batchRelease: '审评完成后公布的信息',
          batchMailing: '制证完成后，注册证邮寄信息'
        }
      }
    },
    computed:{
      ...mapState({
          allBase: state => state.Qxzhuce.allBase,
        }),
    },
    methods: {
      fetchDetailData () {
        return window.Axios({
          method: 'get',
          url: '/api'+this.$route.path,
          params: {
            accesstoken: GETCOOKIEFUN("accesstoken")
          }
        }).then(res => {
          if (res.status === 200 && res.data.data) {
            return res.data.data;
          }
          return false;
        }).catch(err => {
          console.error(err);
        })
      },
    },
    watch: {

    },
    created() {
      Store.dispatch("Qxzhuce/getBaseInfo");
      this.fetchDetailData().then((res) => {
        if (res) {
          this.data = res;
          this.getExtendList('qxzhuce',res.extendList)
        }
        this.isLoading = false;
      })
      setTimeout(() => {
        const hashLocation= sessionStorage.getItem("hashLocation");//缓存中获取当前页面的路由名称
        // 注意, 这里使用全路径匹配,在hash模式中,因为地址会携带#,所以页面报告中的url需要重新覆盖一下, 将#去除
        window._paq.push(['setCustomUrl', "https://" + hashLocation]);//覆盖页面报告的url，可以自定义页面url，加上本页面路由
        window._paq.push(['trackPageView', this.allBase.dbname]);//页面名称,可以自定义页面名称
        window._paq.push(['setDocumentTitle', this.allBase.dbname])
      }, 1000);
    },
    mounted() {

    },
    activated() {
    },
    updated() {
    },
  }
</script>

<style lang="less" scoped>
  @import "~@/assets/less/var.less";
  @import "~@/assets/less/app.less";
  @import "~@/assets/less/detailCom.less";

  .wrapper {
    
    // 通用详情页
    .main {
      
      .tb-t {
        
        .pjfb-label { //pjyj
          td:nth-child(n+2){
            width: 180px;
            // border: 0;
            background: #F5F9FC;
            // background: @DetailTableLeftColor;
            font-weight: 400;
            text-align: center;
            padding: 0;
          }
          td:last-child {
            // border-right: 1px solid #d7ddeb !important;
          }
        }
        .pjfb-prop {
          td:nth-child(n+2){
            width: 180px;
            text-align: center;
            // border: 0;
            // background: #FFF;
            background: #fdfdfd;

            font-weight: 400;
            padding: 0px 20px;
            // border-bottom: 1px solid #d7ddeb;
          }
          td:last-child {
            // border-right: 1px solid #d7ddeb;
          }
        }
        .pjyj-label { //pjyj
          td:nth-child(n+2){
            width: 360px;
            // border: 0;
            background: #fdfdfd;
            // background: @DetailTableLeftColor;
            font-weight: 400;
            text-align: center;
            padding: 0;
          }
          //:last-child
          // td {
          //   border-right: 1px solid #d7ddeb !important;
          // }
        }
        .pjyj-prop {
          //:last-child
          td:nth-child(n+2){
            width: 360px;
            // border: 0;
            background: #fdfdfd;
            font-weight: 400;
            text-align: center;
             padding: 0px 20px;
            // border-bottom: 1px solid #d7ddeb;
          }
          // td {
          //   border-right: 1px solid #d7ddeb;
          // }
        }
      }
      
      
    }
    
  }

</style>
