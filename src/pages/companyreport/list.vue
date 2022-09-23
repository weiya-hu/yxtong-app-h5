<template>
  <div class="la-list">
    <!-- 自定义加载界面 -->
    <LoadingGif :className="'db-index-loading'" :loadFlag="listLoading" v-if="listLoading"></LoadingGif>
    <!-- 加载完成显示部分 -->
    <div class="not-loading" v-else>
      <template v-if="res1 && !res1.length">
        <!-- 问题反馈弹出框 -->
        <el-dialog :visible.sync="dialogFeedbackShow" :modal-append-to-body="false" width="820px">
          <div slot="title" class="dialog-header">
            问题反馈
          </div>
          <DialogFeedback @closeDialog="closeDialogFeedback"></DialogFeedback>
        </el-dialog>
        <div class="no-data-msg">
          <img src="/static/imgs/nodata/db-nodata.png">
          <div class="msg">
            <p>对不起，小智已经很努力了，但没有找到对应数据。</p>
            <p>换个关键词试试，或 <a class="link-blue" @click="showFeedback()">反馈</a> 给我们</p>
          </div>
        </div>
      </template>


      <!-- 重构 -->
      <template v-else>
        <table class="cards-list" width="100%" >
          <tr class="card" v-for="(item, index) in res1" :key="index">
            <td class="left-info" width="350">
              <div class="logo">
                <div class="wrapper">
                  <img v-if="item.logo" :src="item.logo" @error="picLoadError">
                  <img v-else src="/static/imgs/companyreport/icon_nothing.jpg">
                </div>
              </div>
              <div class="info-lan">
                <div class="name">
                  <router-link tag="a" :to="'/company/' + item.id"  class="company-name" :title="item.qymc" target="_blank">{{item.qymc | formaTitle}}</router-link>
                  <!-- <i class="sc iconfont" @click="handleScClick">&#xe60a;</i> -->
                </div>
                <div class="state-all">
                  <span class="state-icon" v-if="item.qyguojia">{{item.qyguojia}}</span>
                  <span class="state-icon" v-if="item.jyzt">{{item.jyzt}}</span>
                  <span class="state-icon" v-if="item.rzlc">{{item.rzlc}}</span>
                </div>
              </div>
            </td>
            <td class="right-info">
              <div >
                <div class="item">
                  <div class="name">注册申报</div>
                  <div class="num"><span class="number">{{item.count_arr.count_zhuce | formatNumber}}</span><span class="dw">个</span></div>
                </div>
                <div class="hr"></div>
                <div class="item">
                  <div class="name">临床试验</div>
                  <div class="num"><span class="number">{{item.count_arr.count_linchuang | formatNumber}}</span><span class="dw">个</span></div>
                </div>
                <template v-if="infMaxNum>=3">
                  <div class="hr"></div>
                  <div class="item">
                    <div class="name">上市药品</div>
                    <div class="num"><span class="number">{{item.count_arr.count_ssyp | formatNumber}}</span><span class="dw">个</span></div>
                  </div>
                </template>

                <template v-if="infMaxNum>=4">
                  <div class="hr"></div>
                  <div class="item">
                    <div class="name">药品中标</div>
                    <div class="num"><span class="number">{{item.count_arr.count_yaopinzhongbiao | formatNumber}}</span><span class="dw">个</span></div>
                  </div>
                </template>
                <!-- <div class="hr"></div>
                <div class="item">
                  <div class="name">发明专利</div>
                  <div class="num"><span class="number">{{item.count_arr.fmzl | formatNumber}}</span><span class="dw">个</span></div>
                </div> -->
                <template v-if="infMaxNum>=5">
                  <div class="hr"></div>
                  <div class="item">
                    <div class="name">研发排行榜</div>
                    <div
                      class="num"
                      :class="{'top1': item.rank == 1, 'top2': item.rank == 2, 'top3': item.rank == 3,}">
                        <span class="number">{{item.rank ? item.rank : '-'}}</span>
                        <span class="dw" v-if="item.rank">top</span>
                    </div>
                  </div>
                </template>
              </div>
            </td>
            <td width="100" v-if="moreLinkShow==true">
              <router-link tag="div" :to="'/company/' + item.id" class="more-link">
                <div class="more-icon iconfont">&#xe62a;</div>
                <div class="more-msg">查看更多</div>
              </router-link>
            </td>
          </tr>
        </table>
        <!-- 分页栏 -->
        <el-pagination
          v-if="extendCount"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="param.page"
          :page-sizes="[20, 30, 50]"
          :page-size="param.pageSize"
          layout="total, sizes, prev, pager, next"
          :total="extendCount"
          :disabled="nopms.fy"
          :class="{'abandon-click-method': nopms.fy}">
        </el-pagination>
        <span class="out-of-page cl-red">限于内容篇幅，部分结果未予显示</span>

      </template>
    </div>
  </div>
</template>

<script>
import LoadingGif from '@/components/common/globalCom/loading-gif'
import DialogFeedback from '@/components/common/dialog-feedback';
import { mapState } from 'vuex'
export default {
  components: {
    LoadingGif,
    DialogFeedback,
  },
  data () {
    return {
      dialogFeedbackShow: false,
      infMaxNum: 6,
      moreLinkShow: true,
    }
  },
  computed: {
    ...mapState({
      side_fold: state => state.Layouts.side_fold,
      client_width: state => state.Layouts.client_width,
      nopms: state => state.CompanyReport.nopms,
      param: state => state.CompanyReport.param,
      extendCount: state => state.CompanyReport.extendCount,
      listLoading: state => state.CompanyReport.listLoading,
      res1: state => _.keys(state.CompanyReport.res1).length ? state.CompanyReport.res1 : [],
    })
  },
  methods: {
    closeDialogFeedback () {
      this.dialogFeedbackShow = false
    },
    showFeedback () {
      this.dialogFeedbackShow = true
    },
    //获取列表中的企业数据
    // loadListData (obj) {
    //   let param = _.assign({}, obj, this.param)
    //   Axios({
    //     method: 'get',
    //     url: "/api/company",
    //     params: param
    //   }).then(res=>{
    //     let data = res.data.data
    //     this.firstLoadData = data.List
    //   })
    // },

    //获取显示列数
    SetInfMaxNum () {
      // var other_width = this.side_fold ? 630+250:630;   //630为除了right-info的剩余宽度
      // if (this.client_width>0) {
      //   if (this.client_width<1410) {
      //     this.infMaxNum = Math.floor((this.client_width - other_width)/106) //106一个item的宽度
      //     if (this.infMaxNum<5) {
      //       this.moreLinkShow = false;
      //       other_width = other_width-100;
      //       this.infMaxNum = Math.floor((this.client_width - other_width)/106) //106一个item的宽度
      //     }else{
      //       this.moreLinkShow = true;
      //     }

      //   }else{
      //     this.infMaxNum = Math.floor((this.client_width - other_width)/106) //106一个item的宽度
      //     this.moreLinkShow = true;
      //   }

      // }

    },
    // 点击收藏按钮触发
    handleScClick () {
      // 是否收藏的样式变化处理
      $(event.target).toggleClass('active')
     // TODO: 是否收藏的逻辑处理
    },
    handleCurrentChange (val) {
      this.param.page = val
      if (val * this.param.pageSize <= 1500) {
        $('.out-of-page').hide()
        Store.dispatch('CompanyReport/nomalSearch',{params:this.param})
      } else {
        $('.out-of-page').show()
      }
    },
    handleSizeChange (val) {
      this.param.page = 1
      this.param.pageSize = val
      if (val * this.param.page <= 1500) {
        $('.out-of-page').hide()
        Store.dispatch('CompanyReport/nomalSearch',{params:this.param})
      } else {
        $('.out-of-page').show()
      }
    },
    picLoadError (ev) { // 图片加载失败，切换为默认图
      ev.target.src = "/static/imgs/companyreport/icon_nothing.jpg"
    },
  },
  filters: {
    // 给数字每三位数加一个逗号
    formatNumber (val) {
      val = parseInt(val)
      return val.toString().replace(/(\d)(?=(\d{3})+$)/g, '$1,')
    },
    //标题长度超过12个字用省略号表示
    formaTitle (title) {
      if (title.length>12) {
        return title.substr(0, 12)+"..."
      }else{
        return title
      }
    }
  },
  created() {
    // this.handleAxios()
    // this.loadListData()
  },
  mounted() {
    this.SetInfMaxNum()
  },
  updated () {
    if (this.param.pageSize * this.param.page <= 1500) {
      $('.out-of-page').hide()
    } else {
      $('.out-of-page').show()
    }
    this.vueTogglePmsTooltip()
  },
  watch:{
    side_fold ()  {
      this.SetInfMaxNum()
    },
    client_width ()  {
      this.SetInfMaxNum()
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/var.less";

.la-list {
  .not-loading {
    .cards-list {
      width: 100%;
      padding: 0px 10px 0 14px;
      border-collapse:separate;
      border-spacing: 0px 12px;
      table-layout:fixed;
      word-break:break-all;
      .card {
        width: 100%;
        height: 90px;
        box-shadow: @BoxShadow;
        padding: 10px;
        transition: all 100ms;
        &:last-child {
          margin-bottom: 0;
        }
        .left-info {
          width: 350px;
          position: relative;
          .logo {
            position: absolute;
            left: 10px;
            top: 10px;
            z-index: 1;
            width: 70px;
            height: 70px;
            box-sizing: border-box;
            border: 1px solid #eff2fa;
            padding:5px;
            background-color: white;
            .wrapper{
              width: 60px;
              height: 60px;
              img {
                max-width: 60px;
                max-height: 60px;
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
            .wrapper:before {
              content: "";
              display: inline-block;
              padding-bottom: 100%;
              width: 0.1px; /*必须要有数值，否则无法把高度撑起来*/
              vertical-align: middle;
            }

          }
          .info-lan {
            height: 70px;
            margin-left: 100px;
            .name {
              display: flex;
              justify-content: flex-start;
              margin-bottom: 14px;
              a.company-name {
                display: inline-block;
                color: @PrimaryColor;
                font-size: 18px;
                margin-right: 14px;
                width:auto;
              }
              i.sc {
                display: inline-block;
                cursor: pointer;
                color: #97a2bf;
                font-size: 18px;
                transition: all 300ms;
                &:hover {
                  transition: all 300ms;
                  color: #f77d54;
                }
                &.active {
                  transition: all 300ms;
                  color: #f77d54!important;
                }
              }
            }
            .state-all {
              display: flex;
              justify-content: flex-start;
              align-items: center;
              flex-wrap: nowrap;
              .state-icon {
                display: inline-block;
                box-sizing: border-box;
                padding: 0px 10px;
                margin-right: 4px;
                border: 1px solid @PrimaryColor;
                height: 20px;
                line-height: 20px;
                border-radius: 10px;
                color: @PrimaryColor;
                font-size: 12px;
              }
            }
          }
        }
        .right-info {
          height: 70px;
          text-align: center;
          overflow: hidden;
          white-space: nowrap;
          .item {
            display: inline-block;
            width: 104px;
            text-align: center;
            .name {
              font-weight: bold;
              font-size: 13px;
            }
            .num {
              display: flex;
              justify-content: center;
              .number {
                font-size: 23px;
                font-weight: bold;
                margin-right: 6px;
              }
              .dw {
                font-weight: bold;
                font-size: 14px;
                padding-top: 4px;
              }
            }
            // 第一名的num样式
            .top1 {
              color: #fa5821!important;
            }
            // 第二名的num样式
            .top2 {
              color: #fe9876!important;
            }
            // 第三名的num样式
            .top3 {
              color: #fac68d!important;
            }
          }
          .hr {
            display: inline-block;
            height: 22px;
            width: 0px;
            border-left: 1px solid #6f7584;
          }
        }
        .more-link {
          height: 70px;
          color: @PrimaryColor;
          cursor: pointer;
          text-align: center;
          .more-icon {
            font-size: 30px;
            width: 100px;
            height: 45px;
            line-height: 45px;
            cursor: pointer;
          }
          .more-msg {
            font-size: 13px;
            cursor: pointer;
          }
        }
        // 移入效果
        &:hover {
          background: @PrimaryColor;
          color: #fff;
          transition: all 100ms;
          .left-info {
            color: #fff;
            .info-lan {
              .name {
                a {
                  color: #fff;
                }
              }
              .state-all {
                .state-icon {
                  border-color: #fff;
                  color: #fff;
                }
              }
            }
          }
          .more-link {
            * {
              color: #fff;
            }
          }
          .right-info {
            .hr {
              border-left: 1px solid #fff;
            }
          }
        }
      }
    }
  }
}

</style>
