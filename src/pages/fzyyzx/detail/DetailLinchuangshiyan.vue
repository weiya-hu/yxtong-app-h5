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
              <div v-if="item.prop === 'me_id'">
                <span v-if="vueCheckListPms('Yzx', item.label)">
                  <router-link tag="a" :to="{path:'/linchuangshiyan/' + scope.row.id}" class="cell-shoulihao no-underline cl-blue" target="_blank">
                    {{ scope.row.me_id||'/' }}
                  </router-link>
                </span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
              <div v-if="item.prop === 'title'">
                <span v-if="vueCheckListPms('Yzx', item.label)">
                  {{ scope.row.title||'/' }}
                </span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
              <div v-if="item.prop === 'name'">
                <span v-if="vueCheckListPms('Yzx', item.label)">
                  {{ scope.row.name||'/' }}
                </span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
              <div v-if="item.prop === 'me_status'">
                <span v-if="vueCheckListPms('Yzx', item.label)">
                  {{ scope.row.me_status||'/' }}
                </span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
              <div v-if="item.prop === 'phase'">
                <span v-if="vueCheckListPms('Yzx', item.label)">
                  {{ scope.row.phase||'/' }}
                </span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
              <div v-if="item.prop === 'indication'">
                <span v-if="vueCheckListPms('Yzx', item.label)">
                  {{ scope.row.indication||'/' }}
                </span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
              <div v-if="item.prop === 'date'">
                <span v-if="vueCheckListPms('Yzx', item.label)">
                  {{ scope.row.date||'/' }}
                </span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
              <div v-if="item.prop === 'institutes'">
                <span v-if="vueCheckListPms('Yzx', item.label)">
                  {{ scope.row.institutes||'/' }}
                </span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
              <div v-if="item.prop === 'company'">
                <span v-if="vueCheckListPms('Yzx', item.label)">
                  {{ scope.row.company||'/' }}
                </span>
                <span v-else class="abandon-click-method">暂无权限</span>
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
            prop: "me_id",
            label: "登记号",
            width: 150, //最少宽度
          }, {
            prop: "title",
            label: "试验题目",
            width: 150, //最少宽度
          }, {
            prop: "me_status",
            label: "试验状态",
            width: 150, //最少宽度
          }, {
            prop: "phase",
            label: "试验分期",
            width: 150, //最少宽度
          }, {
            prop: "indication",
            label: "适应症",
            width: 150, //最少宽度
          }, {
            prop: "date",
            label: "登记日期",
            width: 150, //最少宽度
          }, {
            prop: "company",
            label: "申办单位",
            width: 150, //最少宽度
          }, {
            prop: "institutes",
            label: "试验机构",
            width: 150, //最少宽度
          },
        ],
        tableHead_qy: [
          {
            prop: "me_id",
            label: "登记号",
            width: 150, //最少宽度
          }, {
            prop: "title",
            label: "试验题目",
            width: 150, //最少宽度
          }, {
            prop: "name",
            label: "药品名称",
            width: 150, //最少宽度
          }, {
            prop: "me_status",
            label: "试验状态",
            width: 150, //最少宽度
          }, {
            prop: "phase",
            label: "试验分期",
            width: 150, //最少宽度
          }, {
            prop: "indication",
            label: "适应症",
            width: 150, //最少宽度
          }, {
            prop: "date",
            label: "登记日期",
            width: 150, //最少宽度
          }, {
            prop: "institutes",
            label: "试验机构",
            width: 150, //最少宽度
          },
        ],
        activeTab: 'all',
      }
    },
    computed:{
      tableHead () {
        return this.qiyebianmatz ? this.tableHead_qy : this.tableHead_pz
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
