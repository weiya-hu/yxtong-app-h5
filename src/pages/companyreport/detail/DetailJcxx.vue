<template>
  <div class="detail-jcxx">
    <!-- 1 - 企业概括 -->
    <div class="column">
      <!-- HEAD -->
      <div class="head">
        <span class="title">企业概括</span>
      </div>
      <!-- VIEW -->
      <div class="view qygk">
        <table class="tb-f">
          <tr>
            <td>企业介绍</td>
            <td colspan="3" class="td-across">{{qygk.qyjj ? qygk.qyjj : '无'}}</td>
          </tr>
          <tr>
            <td>企业类型</td>
            <td>{{qygk.qylx ? qygk.qylx : '无'}}</td>
            <td>所属区域</td>
            <td>{{qygk.qyqy ? qygk.qyqy : '无'}}</td>
          </tr>
          <tr>
            <td>英文名称</td>
            <td>{{qygk.ywmc ? qygk.ywmc : '无'}}</td>
            <td>企业标签</td>
            <td>{{qygk.qybq ? qygk.qybq : '无'}}</td>
          </tr>
        </table>
      </div>
    </div>
    <!-- 2 - 工商信息 -->
    <div class="column">
      <!-- HEAD -->
      <div class="head">
        <span class="title">工商信息</span>
      </div>
      <!-- VIEW -->
      <div class="view gsxx">
        <table class="tb-f">
          <tr>
            <td>法定代表人</td>
            <td>{{qygk.fddb ? qygk.fddb : '无'}}</td>
            <td>经营状态</td>
            <td>{{qygk.jyzt ? qygk.jyzt : '无'}}</td>
          </tr>
          <tr>
            <td>统一社会信用代码</td>
            <td>{{qygk.xydm ? qygk.xydm : '无'}}</td>
            <td>组织机构代码</td>
            <td>{{qygk.jgdm ? qygk.jgdm : '无'}}</td>
          </tr>
          <tr>
            <td>成立日期</td>
            <td>{{qygk.clrq ? qygk.clrq : '无'}}</td>
            <td>营业期限</td>
            <td>{{qygk.yyqx ? qygk.yyqx : '无'}}</td>
          </tr>
          <tr>
            <td>注册号</td>
            <td>{{qygk.gszch ? qygk.gszch : '无'}}</td>
            <td>注册资本</td>
            <td>{{qygk.zczb ? qygk.zczb : '无'}}</td>
          </tr>
          <tr>
            <td>发照日期</td>
            <td>{{qygk.fzrq ? qygk.fzrq : '无'}}</td>
            <td>登记机关</td>
            <td>{{qygk.djjg ? qygk.djjg : '无'}}</td>
          </tr>
          <tr>
            <td>企业地址</td>
            <td colspan="3" class="td-across">{{qygk.qydz ? qygk.qydz : '无'}}</td>
          </tr>
          <tr>
            <td>经营范围</td>
            <td colspan="3" class="td-across">{{qygk.jyfw ? qygk.jyfw : '无'}}</td>
          </tr>
        </table>
      </div>
    </div>
    <!-- 3 - 关联企业 -->
    <div class="column">
      <!-- HEAD -->
      <div class="head">
        <span class="title">关联企业</span>
      </div>
      <!-- VIEW -->
      <div class="view glqy">
        <!-- 标签栏 -->
        <div class="tabs">
          <!-- 子企业、父企业、兄弟企业 等 - 标签 -->   
              <!-- :class="{'active1': jcxxData.glqy_active == 1, 'active2': jcxxData.glqy_active == 2, 'active3': jcxxData.glqy_active == 3, 'active4': jcxxData.glqy_active == 4, 'active5': jcxxData.glqy_active == 5, 'active6': jcxxData.glqy_active == 6, 'active7': jcxxData.glqy_active == 7, 'active8': jcxxData.glqy_active == 8}" -->
          <div
            class="qy-nav tab"
            :class="{'active': GroupListTrue[index] }"
            v-for="(item, index) in jcxxData.groupList"
            :key="index"
            @click="handleTpsCheck(item,index)">
              <span class="name">{{item.name}}</span>
              <span class="num">{{item.value}}</span>
          </div>
        </div>
        <!-- 自定义加载界面 -->
        <LoadingGif :className="'list-in-loading'" :classNameImg="'little-size-loading'" :loadFlag="loading1" v-if="loading1" :delayTime="0"></LoadingGif>
        <!-- 加载完成显示部分 -->
        <!-- 标签对应的视图栏 -->
        <div class="tab-view zqy" v-else>
          <el-table
            :data="jcxxData.res.res"
            stripe
            fixed
            class="table"
            style="width: 100%">
            <el-table-column
              v-for="item in jcxxData.tableHead"
              :prop="item.prop"
              :min-width="item.width"
              :key="item.prop"
              :label="item.label">
                <template slot-scope="scope">
                  <div v-if="item.prop === 'qymc'">
                    <router-link tag="a" :to="'/company/' + scope.row.id" v-if="scope.row.qyzs == '1'" target="_blank">{{ scope.row.qymc }}</router-link>
                    <span v-else>{{ scope.row.qymc }}</span>
                  </div>
                  <div v-if="item.prop === 'fddb'">
                    {{ scope.row.fddb }}
                  </div>
                  <div v-if="item.prop === 'jyzt'">
                    {{ scope.row.jyzt }}
                  </div>
                  <div v-if="item.prop === 'jyfw'">
                    {{ scope.row.jyfw }}
                  </div>
                </template>
            </el-table-column>
          </el-table>
          <!-- 分页栏 -->
          <el-pagination
            v-if="jcxxData.glqy_num > 10"
            @current-change="handleCurrentChange"
            :current-page="param.page"
            :page-size="param.pageSize"
            layout="total, prev, pager, next"
            :total="jcxxData.glqy_num">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import LoadingGif from '@/components/common/globalCom/loading-gif'
import tablehead from '@/config/tablehead'
const jcxxFiled = tablehead.companyreport.DetailJcxx
export default {
  components: {
    LoadingGif
  },
  props: {
    res:{
      type:Object,
    },
  },
  data () {
    return {
      id: this.$route.path.split("/")[2],
      tabs: {
        tabsWidth: 0,         //tabs
        tabsWapWidth: 0,      //tabs-wap
        tabsSpace:0,
        marginLeft:0,
      },
      GroupList: [],
      GroupListTrue: [true],
      listRes: {},
      activeTab: 'all',
      value: '',
      jcxxData: {
        res: {},
        groupList: [],
        tableHead: jcxxFiled,
        exportUrl: '',
        glqy_num: 0,
        glqy_active: 1,
      },
      qygk: {},
      param: {
        tps: 'zqy',
        pageSize: 10,
        page: 1,
      },
      loading1: true,
      // jcxxData.glqy_num: 0, // 激活中关联企业对应的数量
    }
  },
  methods: {
    // 获取api数据
    handleAxiosId () {
      window.Axios({
        method: 'get',
        url: '/api/company/'+ this.id,
        params: {
          accesstoken: GETCOOKIEFUN("accesstoken")
        }
      }).then(res => {
        if (res.data.code === 200 && res.data) {
          let data = res.data.data
          this.qygk = data
          this.jcxxData.groupList = data.qyabout
        }
      })
    },
    handleAxiosJcxx () {
      window.Axios({
        method: 'get',
        url: '/api/company/jcxx',
        params: _.assign({id: this.id}, this.param)
      }).then(res => {
        if (res.data.code === 200 && res.data) {
          this.loading1 = false
          let data = res.data.data
          this.jcxxData.res = data.List
          // 根据选择企业类别更新glqy_num的值
          switch (this.param.tps)
          {
            case 'zqy': this.jcxxData.glqy_num = data.List ? data.List.count : 0; this.jcxxData.glqy_active = 1; break;
            case 'fqy': this.jcxxData.glqy_num = data.List ? data.List.count : 0; this.jcxxData.glqy_active = 2; break;
            case 'jzqy': this.jcxxData.glqy_num = data.List ? data.List.count : 0; this.jcxxData.glqy_active = 3; break;
            case 'hzqy': this.jcxxData.glqy_num = data.List ? data.List.count : 0; this.jcxxData.glqy_active = 4; break;
            case 'xdqy': this.jcxxData.glqy_num = data.List ? data.List.count : 0; this.jcxxData.glqy_active = 5; break;
            case 'sqy': this.jcxxData.glqy_num = data.List ? data.List.count : 0; this.jcxxData.glqy_active = 6; break;
            case 'lyqy': this.jcxxData.glqy_num = data.List ? data.List.count : 0; this.jcxxData.glqy_active = 7; break;
            case 'hyqy': this.jcxxData.glqy_num = data.List ? data.List.count : 0; this.jcxxData.glqy_active = 8; break;
          }      
        }
      })
    },
    // pageSize 改变时会触发
    handleSizeChange(val) {
      this.param.pageSize = val
      this.handleAxiosJcxx()
    },
    // currentPage 改变时会触发
    handleCurrentChange(val) {
      this.param.page = val
      this.handleAxiosJcxx()
    },
    // 点击切换子企业、兄弟企业、父企业等
    handleTpsCheck (item,index) {
      this.GroupListTrue = [];
      this.GroupListTrue[index] = true;
      switch (item.name)
      {
        case '子企业': this.param.tps = 'zqy'; break;
        case '父企业': this.param.tps = 'fqy'; break;
        case '竞争企业': this.param.tps = 'jzqy'; break;
        case '兄弟企业': this.param.tps = 'xdqy'; break;
        case '合作企业': this.param.tps = 'hzqy'; break;
        case '孙企业': this.param.tps = 'sqy'; break;
        case '联营企业': this.param.tps = 'lyqy'; break;
        case '合营企业': this.param.tps = 'hyqy'; break;
        default: this.param.tps = 'zqy'; break;
      }
      this.param.page = 1 // 默认第一页
      this.loading1 = true
      this.handleAxiosJcxx()
    },
  },
  created () {
    this.handleAxiosId()
    this.handleAxiosJcxx()
  },
  mounted() {

  },
}
</script>

<style lang="less">
@import "~@/assets/less/var.less";

// 本页的样式
.detail-jcxx {
  border-radius: 4px;
  color: @FontColor;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  box-shadow: @BoxShadow;
  background: #fff;
  padding-bottom: 20px;
}

// 通用的column样式
.column {
  width: 100%;
  padding: 10px 0px 30px 0px;
  .head {
    display: flex;
    justify-content: space-between;
    box-sizing: border-box;
    height: 32px;
    line-height: 32px;
    border-bottom: 1px solid #dfe5f1;
    margin-bottom: 16px;
    .title {
      display: inline-block;
      margin-left: 32px;
      height: 29px;
      line-height: 29px;
      color: @PrimaryColor;
      font-size: 14px;
      padding: 0px 10px 0px 4px;
      border-bottom: 3px solid @PrimaryColor;
    }
    .more {
      display: inline-block;
      margin-right: 25px;
      color: @PrimaryColor;
      font-size: 13px;
    }
  }
  .view {
    padding-left: 32px!important;
    padding-right: 32px;
    .tb-f {
      width: 100%;
      font-size:13px;
      tr {
        td {
          min-height: 38px;
          padding: 10px 10px 10px 18px;
          box-sizing: border-box;
          border: 1px solid @BorderColorNew;
          line-height: 23px;
          &.td-across {
            padding-right: 50px;
          }
          &:nth-of-type(odd) { // 奇数td
            width: 9%;
            font-size: 12px;
            background: @DetailTableLeftColor;
          }
          &:nth-of-type(even) { // 偶数td
            background: @DetailTableRightColor;
            width: 41%;
          }
        }
      }
    }
  }
  // 1、企业概括
  .qygk {
    
  }
  // 2、工商信息
  .gsxx {
    
  }
  // 3、关联企业
  .glqy {
    padding-left: 0px!important;
    padding-right: 0px!important;
    .tabs {
      height: 34px;
      line-height: 34px;
      width: 100%;
      box-sizing: border-box;
      padding-left: 32px;
      display: flex;
      justify-content: flex-start;
      .tab {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex-wrap: nowrap;
        margin-right: 38px;
        font-size: 14px;
        cursor: pointer;
        .name {
          cursor: pointer;
        }
        .num {
          box-sizing: border-box;
          padding: 0 5px;
          border: 1px solid;
          border-radius: 10px;
          height: 20px;
          line-height: 19px;
          margin-left: 4px;
          cursor: pointer;
        }
        &:hover {
          color: @PrimaryColor;
        }
        &.active {
          // &:nth-of-type(1) {
            color: @PrimaryColor;
          // }
        }
        &.active1 {
          &:nth-of-type(1) {
            color: @PrimaryColor;
          }
        }
        &.active2 {
          &:nth-of-type(2) {
            color: @PrimaryColor;
          }
        }
        &.active3 {
          &:nth-of-type(3) {
            color: @PrimaryColor;
          }
        }
        &.active4 {
          &:nth-of-type(4) {
            color: @PrimaryColor;
          }
        }
        &.active5 {
          &:nth-of-type(5) {
            color: @PrimaryColor;
          }
        }
        &.active6 {
          &:nth-of-type(6) {
            color: @PrimaryColor;
          }
        }
        &.active7 {
          &:nth-of-type(7) {
            color: @PrimaryColor;
          }
        }
        &.active8 {
          &:nth-of-type(8) {
            color: @PrimaryColor;
          }
        }
      }
    }
    .el-pagination{
      padding-bottom: 0;
    }
  }
}

// element
.td-element {
  box-sizing: border-box!important;
  padding-left: 22px!important;
}
.th-element {
  box-sizing: border-box!important;
  padding-left: 22px!important;
}
</style>
