<template>
  <div class="fxxx_items">
    <div class="zcsb_item">

      <div class="item_content">
        <el-table
          :data="data"
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
              <div v-if="item.prop === 'shoulihao'">
                <span v-if="vueCheckListPms('Yzx', item.label)">
                  <router-link tag="a" :to="{path:'/zhuce/' + scope.row.id}" class="cell-shoulihao no-underline cl-blue" target="_blank">
                    {{ scope.row.shoulihao||'/' }}
                  </router-link>
                </span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
              <div v-if="item.prop === 'name'">
                <span v-if="vueCheckListPms('Yzx', item.label)">
                  {{ scope.row.name||'/' }}
                </span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
              <div v-if="item.prop === 'yaopinleixing_1'">
                <span v-if="vueCheckListPms('Yzx', item.label)">
                   <span v-if="scope.row.yaopinleixing_1||scope.row.zhuceleixing">{{ scope.row.yaopinleixing_1 }}{{ scope.row.zhuceleixing }}</span>
                   <span v-else>/</span>
                </span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
              <div v-if="item.prop === 'chengbanriqi'">
                <span v-if="vueCheckListPms('Yzx', item.label)">
                  {{ scope.row.chengbanriqi||'/' }}
                </span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
              <div v-if="item.prop === 'banlizhuangtai'">
                <span v-if="vueCheckListPms('Yzx', item.label)">
                  {{ scope.row.banlizhuangtai||'/' }}
                </span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
              <div v-if="item.prop === 'zhuangtaikaishishijian'">
                <span v-if="vueCheckListPms('Yzx', item.label)">
                  {{ scope.row.zhuangtaikaishishijian||'/' }}
                </span>
              </div>
              <div v-if="item.prop === 'qiyemingcheng'">
                <span v-if="vueCheckListPms('Yzx', item.label)">
                  {{ scope.row.qiyemingcheng||'/' }}
                </span>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页栏 -->
        <el-pagination
          v-if="pageData.count > 10"
          @current-change="handleCurrentChange"
          :current-page="params.page"
          :page-size="params.pageSize"
          layout="total, prev, pager, next"
          :total="pageData.count">
        </el-pagination>
      </div>

    </div>
  </div>
</template>

<script>

export default {
    props:{
      bianma:{
        type:String,
      },
      qiyebianmatz:{
        type:String,
      },
      tb:{
        type:String,
      },
    },
    data(){
      return{
        params:{
          pageSize: 10,
          page: 1,
          tb: this.tb,
          accesstoken: GETCOOKIEFUN("accesstoken")
        },
        tabs:{
          tabsWidth: 0,         //tabs
          tabsWapWidth: 0,      //tabs-wap
          tabsSpace: 0,
          marginLeft: 0,
        },
        groupList: [],
        data: [],
        pageData: {},
        tableHead_pz: [
          {
            prop: "shoulihao",
            label: "受理号",
            width: 150, //最少宽度
          }, {
            prop: "qiyemingcheng",
            label: "NMPA企业名称",
            width: 150, //最少宽度
          }, {
            prop: "yaopinleixing_1",
            label: "注册类型",
            width: 150, //最少宽度
          }, {
            prop: "chengbanriqi",
            label: "承办日期",
            width: 150, //最少宽度
          }, {
            prop: "banlizhuangtai",
            label: "办理状态",
            width: 150, //最少宽度
          }, {
            prop: "zhuangtaikaishishijian",
            label: "状态开始时间",
            width: 150, //最少宽度
          },
        ],
        activeTab: 'all',
      }
    },
    computed:{
      tableHead () {
        let tableHead_qy = this.tableHead_pz.slice(0)
        tableHead_qy[1] = {
          prop: "name",
          label: "药品名称",
          width: 150,
        }
        return this.qiyebianmatz ? tableHead_qy : this.tableHead_pz
      }
    },
    created (){

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
        this.$emit('update:isloading',true);
        if (this.bianma) {
          this.params.bianma = this.bianma
        }else{
          this.params.qiyebianmatz = this.qiyebianmatz
        }
        window.Axios({
          method: 'get',
          url: '/api/yzx/bylist',
          params: this.params
        }).then(res => {
          this.$emit('update:isloading',false);
          if (res.data.code === 200 && res.data) {
            let data = res.data.data
            this.data = data.res
            this.pageData = data
          }
        })
      },
      // pageSize 改变时会触发
      handleSizeChange(val) {
        this.$emit('update:isloading',true);
        this.params.pageSize = val
        this.handleAxios()
      },
      // currentPage 改变时会触发
      handleCurrentChange(val) {
        this.$emit('update:isloading',true);
        this.params.page = val
        this.handleAxios()
      },
    },
    mounted () {
      this.handleAxios()
    },
}
</script>

<style lang="less" scoped>
@import "./css/com.less";
</style>
