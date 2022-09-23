<template>
  <div class="lcsy_items">
    <div class="zcsb_item">
      <div class="item_title">
        <span class="text">国内数据概览</span>
      </div>
      <div class="item_top">
        <div class="checkbox">
          <div class="item active" @click="handleCheckItemClick">试验分期</div>
          <div class="item" @click="handleCheckItemClick">试验状态</div>
          <div class="item" @click="handleCheckItemClick">药品类型</div>
        </div>
        <!-- 试验分期 v-if="Object.keys(lcsyNums.syfq).length"-->
        <div class="content_one active">
          <!-- 列出 -->
          <div class="contents">
            <ul class="content_total" v-for="(item, key, index) in lcsyNums.syfq" :key="index">
              <li class="total_item1">{{item.phase}}</li>
              <li class="total_item2">
                <span>{{item.count}}</span>个
              </li>
            </ul>
          </div>
        </div>
        <!-- 试验状态 -->
        <div class="content_one">
          <!-- 列出 -->
          <div class="contents">
            <ul class="content_total" v-for="(item, key, index) in lcsyNums.syzt" :key="index">
              <li class="total_item1">{{key}}</li>
              <li class="total_item2">
                <span>{{item}}</span>个
              </li>
            </ul>
          </div>
        </div>
        <!-- 药品类型 -->
        <div class="content_one" v-if="Object.keys(lcsyNums.yplx).length">
          <!-- 列出 -->
          <div class="contents">
            <ul class="content_total" v-for="(item, key, index) in lcsyNums.yplx" :key="index">
              <li class="total_item1">{{item.type}}</li>
              <li class="total_item2">
                <span>{{item.count}}</span>个
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="zcsb_item">
      <div class="item_title">
        <span class="text">国内试验情况</span>
      </div>
      <div class="item_content">
        <div class="chart_box">
          <div id="echarts_sz" class="echarts" ref="echarts_sz"></div>
        </div>
        <div class="chart_box">
          <div id="echarts_zl" class="echarts" ref="echarts_zl"></div>
        </div>
      </div>
      <div class="cont"  v-if="lcsyNums.tongji.jxz || lcsyNums.tongji.wc || lcsyNums.tongji.swks || lcsyNums.tongji.zd">
        <div class="item_title1">
          <span class="text active" @click="handleChinaNavClick('进行中')">进行中<span class="num">{{lcsyNums.tongji.jxz}}</span></span>
          <span class="text" @click="handleChinaNavClick('完成')">完成<span class="num">{{lcsyNums.tongji.wc}}</span></span>
          <span class="text" @click="handleChinaNavClick('尚未开始')">尚未开始<span class="num">{{lcsyNums.tongji.swks}}</span></span>
          <span class="text" @click="handleChinaNavClick('暂停中断')">暂停中断<span class="num">{{lcsyNums.tongji.zd}}</span></span>
          <!-- 暂时隐藏导出 -->
          <!-- <span class="export" @click="handleExport(chinaData.exportUrl)"><i class="iconfont">&#xe605;</i> 导出</span> -->
        </div>
        <div class="item_content1">
          <!-- 自定义加载界面 -->
          <LoadingGif :className="'list-in-loading'" :classNameImg="'little-size-loading'" :loadFlag="loading1" v-if="loading1" :delayTime="0"></LoadingGif>
          <!-- 加载完成显示部分 -->
          <el-table
            :data="chinaData.res"
            stripe
            fixed
            class="table"
            style="width: 100%"
            v-else>
            <el-table-column
              v-for="item in chinaData.tableHead"
              :prop="item.prop"
              :min-width="item.width"
              :key="item.prop"
              :label="item.label">
              <template slot-scope="scope">
                <div v-if="item.prop === 'linchuangshiyan.dengjiid'" :title="scope.row.me_id">
                  <router-link style="color:#4b79ec" :to="'/linchuangshiyan/'+scope.row.id">{{ scope.row.me_id }}</router-link>                
                </div>
                <div v-if="item.prop === 'linchuangshiyan.title'">
                  {{ scope.row.title }}
                </div>
                <div v-if="item.prop === 'linchuangshiyan.name'">
                  {{ scope.row.name }}
                </div>
                <div v-if="item.prop === 'linchuangshiyan.type'">
                  {{ scope.row.type}}
                </div>
                <div v-if="item.prop === 'linchuangshiyan.indication'">
                  {{ scope.row.indication }}
                </div>
                <div v-if="item.prop === 'linchuangshiyan.me_status'">
                  {{ scope.row.me_status}}
                </div>
                <div v-if="item.prop === 'linchuangshiyan.phase'">
                  {{ scope.row.phase }}
                </div>
                <div v-if="item.prop === 'linchuangshiyan.institutes'">
                  {{ scope.row.institutes }}
                </div>
                <div v-if="item.prop === 'linchuangshiyan.date'">
                  {{ scope.row.date }}
                </div>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页栏 -->
          <el-pagination
            v-if="chinaData.num > 10"
            @current-change="handleCurrentChange1"
            :current-page="chinaParam.page"
            :page-size="chinaParam.pageSize"
            layout="total, prev, pager, next"
            :total="chinaData.num">
          </el-pagination>
        </div>
      </div>
      
      <div class="cont" v-show="foreignData.num">
        <div class="item_title">
          <span class="text">国外试验情况</span>
        </div>
        <div class="item_content2">
          <!-- 自定义加载界面 -->
          <LoadingGif :className="'list-in-loading'" :classNameImg="'little-size-loading'" :loadFlag="loading2" v-if="loading2" :delayTime="0"></LoadingGif>
          <!-- 加载完成显示部分 -->
          <el-table
            :data="foreignData.res"
            stripe
            fixed
            class="table"
            style="width: 100%"
            v-else>
            <el-table-column
              v-for="item in foreignData.tableHead"
              :prop="item.prop"
              :min-width="item.width"
              :key="item.prop"
              :label="item.label">
              <template slot-scope="scope">
                <div v-if="item.prop === 'zhuceid'">
                  {{ scope.row.zhuceid }}
                </div>
                <div v-if="item.prop === 'phase'">
                  {{ scope.row.phase }}
                </div>
                <div v-if="item.prop === 'condition'">
                  {{ scope.row.condition }}
                </div>
                <div v-if="item.prop === 'exportdate'">
                  {{ scope.row.exportdate }}
                </div>
                <div v-if="item.prop === 'status'">
                  {{ scope.row.status }}
                </div>
                <div v-if="item.prop === 'ptitle'">
                  {{ scope.row.ptitle }}
                </div>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页栏 -->
          <el-pagination
            v-if="foreignData.num > 10"
            @current-change="handleCurrentChange2"
            :current-page="foreignParam.page"
            :page-size="foreignParam.pageSize"
            layout="total, prev, pager, next"
            :total="foreignData.num">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LoadingGif from '@/components/common/globalCom/loading-gif'
import tablehead from "@/config/tablehead"
const chinaHead = tablehead.companyreport.DetailLcsy1 // 国内试验情况
const foreignHead = tablehead.companyreport.DetailLcsy2 // 国外试验情况

export default {
  components: {
    LoadingGif
  },
  data () {
    return {
      bm: Store.state.CompanyReport.bm,
      mestatusint: 1, // 国内试验情况分类 1进行中 2完成 3尚未开始 4暂停中断
      chinaData: { // 国内试验情况 数据
        res: [],
        num: 0,
        tableHead: chinaHead,
        exportUrl: ""
      },
      foreignData: { // 国外试验情况 数据
        res: [],
        num: 0,
        tableHead: foreignHead,
        exportUrl: ""
      },
      chinaParam: {
        pageSize: 10,
        page: 1,
      },
      foreignParam: {
        pageSize: 10,
        page: 1,
      },
      lcsyNums: { // 临床试验顶部三栏的数据 & 国内试验情况数量的数据（存于tongji中）
        tongji: {}, // 统计
        syfq: {},
        syzt: {},
        yplx: {},
      },
      echartsData: {},
      echartsSyzData: [], // echarts - 适应症占比饼形图最终数据
      echartsSyflData: [],// echarts - 实验分类占比饼形图最终数据
      loading1: true,
      loading2: true,
    };
  },
  created() {
    this.handleNumsData()
    this.handleChinaData()
    this.handleForeignData()
  },
  watch: {

  },
  methods: {
    handleEchartsData () {
      this.handleSyzData()
      this.handleSyflData()
    },
    // 适应症占比 - 数据处理
    handleSyzData () {
      let data = this.echartsData.indication

      for (let key in data) {
        let obj = {
          value: data[key].count,
          name: data[key].indication
        }
        this.echartsSyzData.push(obj)
      }
    },
    // 实验分类占比 - 数据处理
    handleSyflData () {
      let data = this.echartsData.sort

      for (let item of data) {
        let obj = {
          value: item.count,
          name: item.sort
        }
        this.echartsSyflData.push(obj)
      }
    },
    async handleEchartsDraw () {
      await this.handleEchartsData()
      this.drawSyzPie()
      this.drawSyflPie()
    },
    // 适应症占比 - 饼形图
    drawSyzPie() {
      let dom = this.$refs.echarts_sz;
      this.myChart = Echarts.init(dom, 'yaozh_theme');
      this.myChart.setOption({
        tooltip: {
          trigger: "item",
          formatter: function (obj) {
            let regex = /.{1,20}/g, arr, str = '';
                while (arr = regex.exec(obj.name)) {
                  str += arr[0]+'<br>';
                }
                return str.slice(0, -4) + ':' + obj.percent + '%';
          }
        },
        series: [
          {
            type: "pie",
            radius: "55%",
            avoidLabelOverlap: false,
            center: "50%",
            label: {
              normal: {
                formatter: "{b}{d}%"
              }
            },
            data: this.echartsSyzData,
            label: {
                formatter: function (obj) {
                    return obj.name.length > 20 ? obj.name.slice(0, 20)+'...' : obj.name;
                }
            }
          }
        ],
        title: {
          text: "适应症占比（前10）",
          x: "center",
          bottom: "20px",
          textStyle: {
            fontSize: "12",
            color: "#646A7A"
          },
          fontSize: "8"
        },
        fontSize: "14"
      });
    },
    // 实验分类占比 - 饼形图
    drawSyflPie() {
      let dom = this.$refs.echarts_zl;
      this.myChart1 = Echarts.init(dom, 'yaozh_theme');
      this.myChart1.setOption({
        tooltip: {
          trigger: "item",
          formatter: "{b}:{d}%"
        },
        series: [
          {
            type: "pie",
            radius: "55%",
            avoidLabelOverlap: false,
            center: "50%",
            label: {
              normal: {
                formatter: "{b}{d}%"
              }
            },
            data: this.echartsSyflData,
          }
        ],
        title: {
          text: "实验分类占比",
          x: "center",
          bottom: "20px",
          textStyle: {
            fontSize: "12",
            color: "#646A7A"
          },
          fontSize: "8"
        },
        fontSize: "14"
      });
    },
    //获取国内聚合 & 获取echarts原始数据
    async handleNumsData() {
      await window.Axios({
        method: "get",
        url: "/api/company/lcsy",
        params: {
          bm: this.bm
        }
      }).then(res => {
        if (res.data.code === 200 && res.data) {
          let data = res.data.data
          let getSyzt = {}

          for (let key in data.tongji) {
            switch (key)
            {
              case "swks": _.assign(getSyzt, {"尚未开始": data.tongji.swks}); break;
              case "jxz": _.assign(getSyzt, {"进行中": data.tongji.jxz}); break;
              case "zd": _.assign(getSyzt, {"暂停中断": data.tongji.zd}); break;
              case "wc": _.assign(getSyzt, {"完成": data.tongji.wc}); break;
            }
          }

          this.lcsyNums = {
            tongji: data.tongji,
            syfq: data.tongji.phase,
            syzt: getSyzt,
            yplx: data.tongji.type,
          }
          // 国内试验情况：初始数量为进行中的数量
          this.chinaData.num = data.tongji.jxz
          this.echartsData = data.view
        }
      })
      // 获取数据 => 处理数据 => 绘制echarts
      this.handleEchartsDraw()
    },
    //获取国内列表数据
    handleChinaData() {
      window.Axios({
        method: "get",
        url: "/api/company/lcsylist",
        params: _.assign({
          bm: this.bm,
          mestatusint: this.mestatusint
        }, this.chinaParam)
      }).then(res => {
        if (res.data.code === 200 && res.data) {
          this.loading1 = false
          let data = res.data.data
          this.chinaData.res = data.res
        } else {
          this.loading1 = false
          this.chinaData.res = []
        }
      })
    },
    //获取国外列表数据
    handleForeignData() {
      window.Axios({
        method: "get",
        url: "/api/company/gwlcsylist",
        params: _.assign({
          bm: this.bm
        }, this.foreignParam)
      }).then(res => {
        if (res.data.code === 200 && res.data) {
          this.loading2 = false
          let data = res.data.data
          this.foreignData.res = data.res
          this.foreignData.num = data.count
        } else {
          this.loading2 = false
          this.foreignData.res = []
          this.foreignData.num = 0
        }
      });
    },
    // 点击国内试验情况的导航条切换显示
    handleChinaNavClick (text) {
      this.loading1 = true
      
      // 3进行中 2完成 1尚未开始 4暂停中断
      if (text.indexOf('进行中') !== -1) {
        if (this.mestatusint !== 1) {
          this.chinaParam.page = 1 // 切换后回到第一页，未切换不改变页码
        }
        this.mestatusint = 1 // 切换状态
        this.chinaData.num = this.lcsyNums.tongji.jxz
        $('.item_title1>.text').removeClass('active')
        $('.item_title1>.text').eq(0).addClass('active')
        this.handleChinaData()
      } else if (text.indexOf('完成') !== -1) {
        if (this.mestatusint !== 2) {
          this.chinaParam.page = 1 // 切换后回到第一页，未切换不改变页码
        }
        this.mestatusint = 2 // 切换状态
        this.chinaData.num = this.lcsyNums.tongji.wc
        $('.item_title1>.text').removeClass('active')
        $('.item_title1>.text').eq(1).addClass('active')
        this.handleChinaData()
      } else if (text.indexOf('尚未开始') !== -1) {
        if (this.mestatusint !== 3) {
          this.chinaParam.page = 1 // 切换后回到第一页，未切换不改变页码
        }
        this.mestatusint = 3 // 切换状态
        this.chinaData.num = this.lcsyNums.tongji.swks
        $('.item_title1>.text').removeClass('active')
        $('.item_title1>.text').eq(2).addClass('active')
        this.handleChinaData()
      } else if (text.indexOf('暂停中断') !== -1) {
        if (this.mestatusint !== 4) {
          this.chinaParam.page = 1 // 切换后回到第一页，未切换不改变页码
        }
        this.mestatusint = 4 // 切换状态
        this.chinaData.num = this.lcsyNums.tongji.zd
        $('.item_title1>.text').removeClass('active')
        $('.item_title1>.text').eq(3).addClass('active')
        this.handleChinaData()
      }
    },
    // 国内试验情况 pageSize 改变时会触发
    handleSizeChange1(val) {
      this.loading1 = true
      this.chinaParam.pageSize = val
      this.handleChinaData()
    },
    // 国内试验情况 currentPage 改变时会触发
    handleCurrentChange1(val) {
      this.loading1 = true
      this.chinaParam.page = val
      this.handleChinaData()
    },
    // 国外试验情况 pageSize 改变时会触发
    handleSizeChange2(val) {
      this.loading2 = true
      this.foreignParam.pageSize = val
      this.handleForeignData()
    },
    // 国外试验情况 currentPage 改变时会触发
    handleCurrentChange2(val) {
      this.loading2 = true
      this.foreignParam.page = val
      this.handleForeignData()
    },
    handleExport(url) {
      //用于测试的接口
      url = "/api/company/outdata?"
      //导出条件
      window.open(url);
    },
    handleCheckItemClick (event) {
      let dom = event.target
      let index = $(dom).index()
      $(".checkbox .item").removeClass("active")
      $(".checkbox .item").eq(index).addClass("active")
      $(".item_top .content_one").removeClass("active")
      $(".item_top .content_one").eq(index).addClass("active")
    },
  },
  mounted() {

  }
}
</script>

<style lang="less">
@import "~@/assets/less/var.less";
.classified-info {
  .lcsy_items {
    border-radius: 4px;
    box-shadow: @BoxShadowHover;
    background-color: #fff;
    padding-bottom: 20px;
		.el-pagination{
			padding-bottom: 0;
		}
    .zcsb_item {
      .item_title {
        height: 36px;
        padding-left: 35px;
        line-height: 28px;
        border-bottom: 1px solid @BorderColor;
        position: relative;
        .text {
          position: relative;
          top: 5px;
          display: inline-block;
          padding: 0px 5px;
          font-size: 14px;
          color: @PrimaryColor;
          border-bottom: 3px solid @PrimaryColor;
        }
        .export {
          position: absolute;
          right: 25px;
          top: 5px;
          font-size: 12px;
          .iconfont {
            font-family: "iconfont" !important;
            font-size: 16px;
            font-style: normal;
            -webkit-font-smoothing: antialiased;
          }
        }
      }
      .item_top {
        padding: 28px 31px 21px 31px;
        // justify-content: space-between;
        .checkbox {
					margin: 0px auto 14px auto;
					padding: 0px 20px;
					width: 40%;
					border-bottom: 2px solid @PrimaryColor;
					display: flex;
					justify-content: center;
					.item {
						cursor: pointer;
						text-align: center;
						min-width: 120px;
						height: 30px;
						line-height: 30px;
						margin: 0px 2px;
						&.active {
							background-color: @PrimaryColor;
							color: #fff;
						}
						&:hover {
							background-color: @PrimaryColor;
							color: #fff;
						}
					}
				}
        .content_one {
          flex-grow: 1;
          width: 100%;
          background-color: #f5f8fb;
          display: none;
          &.active {
            display: block;
          }
          .contents {
            width: 100%;
            height: 94px;
            padding: 30px 0px;
            display: flex;
            justify-content: space-around;
            // background: #5f88eb;
            .content_total {
              max-width: 100px;
              height: 94px;
              padding: 0px 5px;
              text-align: center;
              overflow: hidden;
              text-overflow:ellipsis;
              white-space: nowrap;
              .total_item1 {
                white-space: nowrap;
                padding-top: 10px;
                font-size: 12px;
              }
              .total_item2 {
                padding-top: 14px;
                span {
                  font-size: 20px;
                  color: #4a77e8;
                }
              }
            }
          }
        }
      }
      .item_content {
        min-height: 410px;
        display: flex;
        justify-content: center;
        .chart_box {
          box-sizing: border-box;
          background-color: white;
          width: 45%;
          margin: 0px 5%;
          .echarts {
            width: 100%!important;
            height: 400px;
          }
        }
      }
      .item_content1 {
        height: auto;
        background-color: white;
        .el-table {
          .el-table__header-wrapper {
            padding-left: 34px;
            background-color: #eaeef9;
            .el-table__header {
              .has-gutter {
                .el-table_3_column_15 {
                  width: 169px!important;
                }
              }
            }
          }
          .el-table__body-wrapper {
            .el-table__body {
              .el-table__row td {
                padding-left: 34px;
              }
            }
          }
        }
      }
      .item_title1 {
        position: relative;
        height: 36px;
        padding-left: 35px;
        line-height: 28px;
        .text {
          position: relative;
          top: 5px;
          display: inline-block;
          padding: 0px 5px;
          font-size: 14px;
          color: #555b6d;
          // color: @PrimaryColor;
          cursor: pointer;
          .num {
            padding: 1px 5px;
            margin-left: 10px;
            border: 1px solid;
            border-radius: 14px;
          }
          &:hover {
            color: @PrimaryColor;
          }
          &.active {
            color: @PrimaryColor!important;
          }
        }
        .export {
          position: absolute;
          right: 25px;
          top: 5px;
          cursor: pointer;
        }
      }
      .item_content2 {
        height: auto;
        background-color: white;
        .el-table {
          .el-table__header-wrapper {
            padding-left: 34px;
            background-color: #eaeef9;
            .el-table__header {
              .has-gutter {
                .el-table_3_column_15 {
                  width: 169px!important;
                }
              }
            }
          }
          .el-table__body-wrapper {
            .el-table__body {
              .el-table__row td {
                padding-left: 34px;
              }
            }
          }
        }
      }
      .cont {
        padding-bottom: 30px;
      }
    }
  }
}
@media screen and (max-width: 1500px) {
  .item_content {
    flex-wrap: wrap;
    .chart_box {
      width: 100%;
    }
  }
}
</style>
