<template>
  <div class="wtjd-box">
    <div class="search-box">
      <div class="search-item">
        <el-select
          clearable
          v-model="type"
          placeholder="请选择分类"
          @change="getBwbd"
        >
          <el-option
            v-for="item in groupList"
            :key="item.type"
            :label="item.type"
            :value="item.type"
          >
          </el-option>
        </el-select>
      </div>
      <div class="search-item">
        <inputPopover :value="question">
          <el-input
            placeholder="输入关键字搜索"
            v-model="question"
            @keyup.native.enter="getBwbd"
            @clear="getBwbd"
            clearable
          >
            <i
              class="el-icon-search el-input__icon"
              slot="suffix"
              @click="getBwbd"
            >
            </i>
          </el-input>
        </inputPopover>
      </div>
    </div>
    <List :loading="listLoading" :nodata="listData && !listData.length">
      <div class="content-box">
        <div
          class="content-item"
          v-for="(item, index) in listData"
          :key="index"
        >
          <p class="question">
            Q : {{ item.question }} <span>{{ item.type }}</span>
          </p>
          <p class="answer">A : {{ item.answer }}</p>
        </div>
      </div>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="param.page"
        :page-sizes="[10, 15, 20]"
        :page-size="param.pageSize"
        layout="total, sizes, prev, pager, next"
        :total="extendCount.BaseCount"
      >
      </el-pagination>
    </List>
  </div>
</template>
<script>
import inputPopover from "@/components/inputs/input-popover";
import List from "@/components/layouts/list";
import { mapState } from "vuex";
export default {
  components: {
    List,
    inputPopover,
  },
  data() {
    return {
      listLoading: true,
      type: "",
      groupList: "",
      question: "",
      listData: [],
      param: {
        page: 1,
        pageSize: 10,
      },
      extendCount: {
        BaseCount: 0,
      },
    };
  },
  computed: {
    ...mapState({
      nopms: (state) => state.Yzx.nopms,
    }),
  },
  watch: {},
  methods: {
    handleSizeChange(val) {
      this.param.pageSize = val;
      this.getBwbd();
    },
    handleCurrentChange(val) {
      this.param.page = val;
      this.getBwbd();
    },
    getBwbd() {
      this.listLoading = true;
      window
        .Axios({
          method: "get",
          url: "/api/yzx/bwbd",
          params: {
            type: this.type,
            question: this.question.slice(0, this.inpMaxLen),
            page: this.param.page,
            pageSize: this.param.pageSize,
            accesstoken: GETCOOKIEFUN("accesstoken"),
          },
        })
        .then((res) => {
          this.listLoading = false;
          if (res.data.code === 200 && res.data) {
            let data = res.data.data;
            if (!this.groupList) {
              this.groupList = data.GroupList;
            }
            this.listData = data.res;
            this.extendCount.BaseCount = data.count;
          }
        })
        .catch((err) => {
          this.listLoading = false;
          console.log(err);
        });
    },
  },
  mounted() {
    this.getBwbd();
  },
  updated() {},
};
</script>
<style lang="less" scoped>
@import "~@/assets/less/var.less";
.search-box {
  margin: 12px 0 12px 30px;
  clear: both;
  overflow: hidden;
}
.search-item {
  width: 200px;
  float: left;
  margin-right: 6px;
}
.content-item {
  padding: 0 30px;
  margin-bottom: 20px;
  span {
    color: @PrimaryColor;
    border: 1px solid @PrimaryColor;
    padding: 4px 10px;
    border-radius: 14px;
  }
  .answer {
    margin-top: 5px;
    color: #999;
  }
}
.content-item:last-child {
  margin-bottom: 0;
}
.wtjd-box {
  p {
    font-size: 13px;
  }
}
.question {
  font-weight: bold;
  span {
    margin-left: 5px;
    font-weight: normal;
  }
}
.el-input__icon {
  padding-right: 6px;
  line-height: 30px;
  cursor: pointer;
}
</style>
