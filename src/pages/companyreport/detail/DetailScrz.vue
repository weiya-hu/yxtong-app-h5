<template>
  <div class="zcsb_items">
    <div class="zcsb_item">
      <div class="item_title">
        <span class="text">数据概览</span>
      </div>
      <div class="item_title1">
        <span>
          <span class="text active" @click="handleNavClick" v-show="num1">GMP认证<span class="num">{{num1}}</span></span>
          <span class="text" @click="handleNavClick" v-show="num2">参比制剂备案<span class="num">{{num2}}</span></span>
        </span>
        <!-- 暂时隐藏导出 -->
        <!-- <span class="export" @click="handleExport(exportUrl)"><i class="iconfont">&#xe605;</i> 导出</span> -->
      </div>
      <div class="item_content5">
        <!-- 自定义加载界面 -->
        <LoadingGif :className="'list-in-loading'" :classNameImg="'little-size-loading'" :loadFlag="loading1" v-if="loading1" :delayTime="0"></LoadingGif>
        <!-- 加载完成显示部分 -->
        <el-table
          :data="nowData.res"
          stripe
          fixed
          class="table"
          style="width: 100%"
          v-else>
          <el-table-column
            v-for="item in tableHead"
            :prop="item.prop"
            :min-width="item.width"
            :width="item.okWidth"
            :key="item.prop"
            :label="item.label">
            <template slot-scope="scope">
              <!-- GMP认证 -->
              <div v-if="item.prop === 'zhengshubianhao'">
                {{ scope.row.zhengshubianhao }}
              </div>
              <div v-if="item.prop === 'renzhengfanwei'">
                {{ scope.row.renzhengfanwei }}
              </div>
              <div v-if="item.prop === 'gmpbanben'">
                {{ scope.row.gmpbanben }}
              </div>
              <div v-if="item.prop === 'fazhengriqi'">
                {{ scope.row.fazhengriqi }}
              </div>
              <div v-if="item.prop === 'jiezhiriqi'">
                {{ scope.row.jiezhiriqi }}
              </div>
              <!-- 参比制剂备案 -->
              <div v-if="item.prop === 'no'">
                {{ scope.row.no }}
              </div>
              <div v-if="item.prop === 'type'">
                {{ scope.row.type }}
              </div>
              <div v-if="item.prop === 'name'">
                {{ scope.row.name }}
              </div>
              <div v-if="item.prop === 'form'">
                {{ scope.row.form }}
              </div>
              <div v-if="item.prop === 'strength'">
                {{ scope.row.strength }}
              </div>
              <div v-if="item.prop === 'name2'">
                {{ scope.row.name2 }}
              </div>
              <div v-if="item.prop === 'form2'">
                {{ scope.row.form2 }}
              </div>
              <div v-if="item.prop === 'strength2'">
                {{ scope.row.strength2 }}
              </div>
              <div v-if="item.prop === 'number'">
                {{ scope.row.number }}
              </div>
              <div v-if="item.prop === 'holder'">
                {{ scope.row.holder }}
              </div>
              <div v-if="item.prop === 'company2'">
                {{ scope.row.company2 }}
              </div>
              <div v-if="item.prop === 'date'">
                {{ scope.row.date }}
              </div>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页栏 -->
        <el-pagination
          v-if="allNum > 10"
          @current-change="handleCurrentChange"
          :current-page="param.page"
          :page-size="param.pageSize"
          layout="total, prev, pager, next"
          :total="allNum">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import LoadingGif from '@/components/common/globalCom/loading-gif'
import tablehead from '@/config/tablehead'
const oneHead = tablehead.companyreport.DetailScrz1
const twoHead = tablehead.companyreport.DetailScrz2

export default {
  components: {
    LoadingGif
  },
  data () {
    return {
      exportUrl: "",
      num1: 0,
      num2: 0,
      allNum: 0,
      which: 1, // 区别正处于哪一种表内：1是GMP认证；2是参比制剂备案
      tableHead: oneHead,
      nowData: {},
      param: {
        pageSize: 20,
        page: 1,
      },
      loading1: true,
    }
  },
  created() {
    this.getNumsByAxios()
    this.handleGmpAxios()
  },
  methods: {
    getNumsByAxios () {
      window.Axios({
        method: "get",
        url: "/api/company/scrz",
        params: {
          bm: Store.state.CompanyReport.bm
        }
      }).then(res => {
        if (res.data.code === 200 && res.data) {
          let data = res.data.data
          this.allNum = data.tongji.gmp // 默认GMP显示
          this.num1 = data.tongji.gmp // GMP认证数量
          this.num2 = data.tongji.orangebei // 参比制剂备案数量
        }
      })
    },
    handleGmpAxios () {
      window.Axios({
        method: "get",
        url: "/api/company/gmplist",
        params: _.assign({bm: Store.state.CompanyReport.bm}, this.param)
      }).then(res => {
        if (res.data.code === 200 && res.data) {
          this.loading1 = false
          let data = res.data.data
          this.nowData = data
        }
      })
    },
    handleOrangeAxios () {
      window.Axios({
        method: "get",
        url: "/api/company/orangebeilist",
        params: _.assign({bm: Store.state.CompanyReport.bm}, this.param)
      }).then(res => {
        if (res.data.code === 200 && res.data) {
          this.loading1 = false
          let data = res.data.data
          this.nowData = data
        }
      })
    },
    handleExport (url) {
      //用于测试的接口
      url = "/api/zhuce/outdata?";
      //导出条件
      window.open(url);
    },
    // pageSize 改变时会触发
    handleSizeChange(val) {
      this.loading1 = true
      this.param.pageSize = val
      if (this.which === 1) {
        this.handleGmpAxios()
      } else if (this.which === 2) {
        this.handleOrangeAxios()
      }
    },
    // currentPage 改变时会触发
    handleCurrentChange(val) {
      this.loading1 = true
      this.param.page = val
      if (this.which === 1) {
        this.handleGmpAxios()
      } else if (this.which === 2) {
        this.handleOrangeAxios()
      }
    },
    handleNavClick (event) {
      this.loading1 = true
      let dom = event.target
      let text = dom.innerText
      this.param.page = 1
      if (text.indexOf('GMP认证') !== -1) {
        $('.item_title1 .text').eq(0).addClass('active')
        $('.item_title1 .text').eq(1).removeClass('active')
        this.tableHead = oneHead
        this.allNum = this.num1
        this.which = 1
        this.handleGmpAxios()
      } else if (text.indexOf('参比制剂备案') !== -1) {
        $('.item_title1 .text').eq(0).removeClass('active')
        $('.item_title1 .text').eq(1).addClass('active')
        this.tableHead = twoHead
        this.allNum = this.num2
        this.which = 2
        this.handleOrangeAxios()
      }
    },
  }
}
</script>

<style lang="less">
@import "~@/assets/less/var.less";
.classified-info {
  .zcsb_items {
    border-radius: 4px;
    box-shadow: @BoxShadowHover;
    background-color: #fff;
    padding-bottom:50px;
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
            font-family: "iconfont"!important;
            font-size: 16px;
            font-style: normal;
            -webkit-font-smoothing: antialiased;
          }
        }
      }
      .item_title1 {
        position: relative;
        height: 36px;
        padding-left: 34px;
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
          &:nth-of-type(2) {
            margin-left: 20px;
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
      .item_content1 {
        height: auto;
        background-color: white;
        // padding-bottom:30px;
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
      .item_content5 {
        height: auto;
        background-color: white;
        .el-table {
          .el-table__header-wrapper {
            background-color: #eaeef9;
            .cell {
              padding-left: 40px;
            }
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
              .el-table__row td .cell {
                padding-left: 40px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
