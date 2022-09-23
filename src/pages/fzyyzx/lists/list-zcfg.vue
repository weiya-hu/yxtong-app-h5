<template>
  <div class="la-list">
    <div class="title-box">
      <inputPopover :value="title">
        <el-input placeholder="输入关键字搜索" v-model="title" @keyup.native.enter="changeTitle" @clear="changeTitle"
          clearable>
          <i class="el-icon-search el-input__icon" slot="suffix" @click="changeTitle">
          </i>
        </el-input>
      </inputPopover>
    </div>
    <List :loading="listLoading" :nodata="resZcfg&&!resZcfg.length">
      <div style="height: 400px;">
        <el-table :data="resZcfg" stripe fixed @sort-change="sortChange" :height="400" v-if="show_table">
          <el-table-column v-for="(item,index) in tableHead" :prop="item.prop" :min-width="item.width"
            :width="item.okWidth||null" :key="item.prop" :sortable="item.sort" :label="item.label">
            <template slot-scope="scope">
              <div v-if="item.prop==='title'">
                <span v-if="vueCheckListPms('Yzx',item.label)" class="cell-shoulihao-wrap">
                  <span @click="linkDetail(scope.row)" style="cursor: pointer;"
                    class="cell-shoulihao no-underline cl-blue">
                    {{ scope.row.title}}
                  </span>
                </span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
              <div v-if="item.prop==='pub_dept'">
                <span v-if="vueCheckListPms('Yzx',item.label)">
                  {{ formatPub_Dept(scope.row.pub_dept)}}
                </span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
              <div v-if="item.prop==='pub_date_cn'">
                <span v-if="vueCheckListPms('Yzx',item.label)">{{ scope.row.pub_date_cn}}</span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="param.page"
        :page-sizes="[10,20,30]" :page-size="param.pageSize" layout="total, sizes, prev, pager, next"
        :total="extendCount.BaseCount">
      </el-pagination>
      <span class="out-of-page cl-red">限于内容篇幅，部分结果未予显示</span>
    </List>
  </div>
</template>
<script>
import inputPopover from '@/components/inputs/input-popover'
import List from "@/components/layouts/list"
import { mapState } from 'vuex'
export default {
  components: {
    List,
    inputPopover
  },
  data() {
    return {
      resZcfg: [],
      listLoading: true,
      title: "",
      param: {
        page: 1,
        pageSize: 10,
        order: null,
      },
      extendCount: {
        BaseCount: 0,
        NameCount: 0,
        QiyeCount: 0
      },
      activeTabName: 'first',
      filedVisible: false,
      tableHead: [
        {
          prop: "title",
          label: "法规标题",
          width: 120,
        },
        {
          prop: "pub_dept",
          label: "发布部门",
          width: 80,
        },
        {
          prop: "pub_date_cn",
          label: "发布日期",
          sort: true,
          width: 80,
        }
      ],
      checkallShow: [],
      show_table: true,
    }
  },
  computed: {
    //同时获取多个属性
    ...mapState({
      nopms: state => state.Yzx.nopms,
    }),
  },
  watch: {

  },
  methods: {
    formatPub_Dept(arr) {
      let text = ''
      arr.length > 0 && arr.forEach((item, index) => {
        text += item + (index < arr.length - 1 ? "、" : "")
      })
      return text
    },
    linkDetail(obj) {
      let routes = ['commondetail', 'lawdetail', 'guiddetail']
      const { href } = this.$router.resolve({
        path: `/policies/${routes[obj.detail_type]}/${obj.data_id}`,
      });
      window.open(href, "_blank");
    },
    changeTitle() {
      this.param = { page: 1, pageSize: 10, order: this.param.order }
      this.getPolicies()
    },
    getPolicies() {
      this.listLoading = true
      window.Axios({
        method: "get",
        url: '/api/yzx/policies',
        params: {
          order: this.param.order,
          title: this.title.slice(0, this.inpMaxLen),
          page: this.param.page,
          pageSize: this.param.pageSize,
          accesstoken: GETCOOKIEFUN("accesstoken")
        }
      }).then((res) => {
        this.listLoading = false
        if (res.data.code === 200 && res.data) {
          let data = res.data.data
          this.resZcfg = data.res
          this.extendCount.BaseCount = data.count
          console.log(this.extendCount.BaseCount);
        } else {
          this.resZcfg = []
        }
      }).catch((err) => {
        this.listLoading = false
        console.log(err)
      })
    },
    handleCurrentChange(val) {
      this.param.page = val
      if (val * this.param.pageSize <= 1500) {
        $('.out-of-page').hide()
        this.getPolicies()
      } else {
        $('.out-of-page').show()
      }
    },
    handleSizeChange(val) {
      this.param.pageSize = val
      if (val * this.param.page <= 1500) {
        $('.out-of-page').hide()
        this.getPolicies()
      } else {
        $('.out-of-page').show()
      }
    },
    sortChange(column) {
      let sort
      // column.prop为null时，默认排序
      if (column.prop) {
        if (column.order == "ascending") {
          sort = column.prop + " " + "asc"
        } else if (column.order == "descending") {
          sort = column.prop + " " + "desc"
        } else {
          sort = ""
        }
      }
      this.param.order = sort
      this.getPolicies()
    },
  },
  created() {
    this.getPolicies()
  },
  updated() {
    this.vueTogglePmsTooltip()
  },
}
</script>
<style lang="less">
.la-main.fold-left-side .la-right .db-index-loading {
  width: calc(100vw + 288px) !important;
  left: 0;
}
</style>
<style lang="less" scoped>
.title-box {
  width: 240px;
  margin: 12px 0 12px 28px;
}

.el-input__icon {
  padding-right: 6px;
  line-height: 30px;
  cursor: pointer;
}
</style>
