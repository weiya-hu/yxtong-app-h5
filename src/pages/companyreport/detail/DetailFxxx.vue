<template>
  <div class="fxxx_items">
    <div class="zcsb_item">
      <!--这个地方有个空白的盒子，是为了暂时隔开上下两个表格-->
      <div class="item_title">
        <span class="text">药品质量不合格公告</span>
        <span class="export"><i class="iconfont">&#xe605;</i>&nbsp;导出</span>
      </div>
      <div class="item_content3">
        <el-table
          :data="ypzlData"
          stripe
          fixed
          class="table"
          style="width: 100%">
          <el-table-column
            v-for="item in tableHead"
            :prop="item.prop"
            :min-width="item.width"
            :key="item.prop"
            :label="item.label">
            <template slot-scope="scope">
              <div v-if="item.prop === 'ypzl.pitchno'">
                {{ scope.row.pitchno }}
              </div>
              <div v-if="item.prop === 'ypzl.name'">
                {{ scope.row.name }}
              </div>
              <div v-if="item.prop === 'ypzl.specification'">
                {{ scope.row.specification }}
              </div>
              <div v-if="item.prop === 'ypzl.unpasseditem'">
                {{ scope.row.unpasseditem }}
              </div>
              <div v-if="item.prop === 'ypzl.regulation'">
                {{ scope.row.regulation }}
              </div>
              <div v-if="item.prop === 'ypzl.reportdate'">
                {{ scope.row.reportdate }}
              </div>
              <div v-if="item.prop === 'ypzl.file'">
                {{ scope.row.file }}
              </div>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页栏 -->
        <el-pagination
          v-if="ypzlData.length > 10"
          @current-change="handleCurrentChange"
          :current-page="param.page"
          :page-size="param.pageSize"
          layout="total, prev, pager, next"
          :total="ypzlData.length">
        </el-pagination>
      </div>

    </div>
  </div>
</template>

<script>
import tablehead from '@/config/tablehead'
const tableFiled = tablehead.companyreport.DetailFxxx

export default {
    props:{
      res:{
        type:Object,
      }
    },
    data(){
      return{
        tabs:{
          tabsWidth: 0,         //tabs
          tabsWapWidth: 0,      //tabs-wap
          tabsSpace: 0,
          marginLeft: 0,
        },
        groupList: [],
        ypzlData: [],
        tableHead: tableFiled,
        activeTab: 'all',
        param: {
          pageSize: 10,
          page: 1,
        }
      }
    },
    created (){
      this.handleAxios()
    },
    watch: {
      groupList () {
        this.$nextTick(() => {
          this.initTabsWidth()
        })
      }
    },
    methods:{
      //获取列表数据
      handleAxios () {
        window.Axios({
          method: 'get',
          url: '/api/company/ypzllist',
          params: _.assign({bm: Store.state.CompanyReport.bm}, this.param)
        }).then(res => {
          if (res.data.code === 200 && res.data) {
            let data = res.data.data
            this.ypzlData = data.res
          }
        })
      },
      // pageSize 改变时会触发
      handleSizeChange(val) {
        this.param.pageSize = val
        this.handleAxios()
      },
      // currentPage 改变时会触发
      handleCurrentChange(val) {
        this.param.page = val
        this.handleAxios()
      },
    },
    mounted () {

    },
}
</script>

<style lang="less">
@import "~@/assets/less/var.less";
.classified-info{
  .fxxx_items{
    box-shadow: @BoxShadowHover;
    background-color: #fff;
    padding-bottom: 50px;
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
      .item_content3{
        height: auto;
        background-color: white;
        .el-table{
          .el-table__header-wrapper{
            padding-left: 34px;
            background-color: #EAEEF9;
            .el-table__header{
              .has-gutter{
                .el-table_3_column_15{
                  width: 169px!important;
                }
              }
            }
          }
          .el-table__body-wrapper{
            .el-table__body{
              .el-table__row td{
                padding-left: 34px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
