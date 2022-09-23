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
              <div v-if="item.prop === 'tradename'">
                <span v-if="vueCheckListPms('Yzx', item.label)">
                  {{ scope.row.tradename||'/' }}
                </span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
              <div v-if="item.prop === 'ename'">
                <span v-if="vueCheckListPms('Yzx', item.label)">
                  {{ scope.row.ename||'/' }}
                </span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
              <div v-if="item.prop === 'strength'">
                <span v-if="vueCheckListPms('Yzx', item.label)">
                  {{ scope.row.strength||'/' }}
                </span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
              <div v-if="item.prop === 'form'">
                <span v-if="vueCheckListPms('Yzx', item.label)">
                  {{ scope.row.form||'/' }}
                </span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
              <div v-if="item.prop === 'company'">
                <span v-if="vueCheckListPms('Yzx', item.label)">
                  {{ scope.row.company||'/' }}
                </span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
              <div v-if="item.prop === 'list'">
                <span v-if="vueCheckListPms('Yzx', item.label)">
                  {{ scope.row.list||'/' }}
                </span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
              <div v-if="item.prop === 'remarks1'">
                <span v-if="vueCheckListPms('Yzx', item.label)">
                  {{ scope.row.remarks1||'/' }}
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
    },
    data(){
      return{
        params:{
          pageSize: 10,
          page: 1,
          bianma: this.bianma,
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
        tableHead: [
          {
            prop: "tradename",
            label: "商品名",
            width: 150, //最少宽度
          }, {
            prop: "ename",
            label: "英文名称",
            width: 150, //最少宽度
          }, {
            prop: "strength",
            label: "规格",
            width: 150, //最少宽度
          }, {
            prop: "form",
            label: "剂型",
            width: 150, //最少宽度
          }, {
            prop: "company",
            label: "持证商",
            width: 150, //最少宽度
          },
          // {
          //   prop: "list",
          //   label: "289目录",
          //   width: 150, //最少宽度
          // },
          {
            prop: "remarks1",
            label: "备注",
            width: 150, //最少宽度
          },
        ],
        activeTab: 'all',
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
        window.Axios({
          method: "get",
          url: '/api/yzx/rldlist',
          params: this.params
        }).then((res) => {
          this.$emit('update:isloading',false);
          if (res.data.code === 200 && res.data) {
            let data = res.data.data
            this.data = data.res
            this.pageData = data
          }
        }).catch((err) => {
          console.log(err)
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
