<template>
  <div class="psbg">
    <!-- <LoadingGif :loadFlag="loading" v-if="loading" /> -->
    <div class="notify">
      数据说明： 此处数据来自全球药品审评报告，立即
      <a href="/doc?ga_source=vip&ga_name=globaldrugs_sjts" target="_blank"
      onclick="_paq.push(['trackEvent', 'button', 'click', '全球药物2.0_数据透视_全球药品审评报告_进入数据库', ])"
        >进入数据库</a
      >
      查看更多数据。
    </div>
    <div class="list" v-waiting="loading">
      <div class="list-item" v-for="(oneDoc, idx) in res" :key="idx">
        <div class="flex flex-ac">
          <div class="name">
            <router-link
              :to="{ path: '/doc/' + oneDoc.id, query: { tb: oneDoc.tb } }"
              target="_blank"
              >{{ oneDoc.type }}
              <span v-if="oneDoc.typezh"
                >({{ oneDoc.typezh }})</span
              ></router-link
            >
          </div>
          <div class="download">
            <a :href="oneDoc.down" target="_blank" v-if="oneDoc.down"
              ><i class="iconfont"></i>下载（原文）</a
            >
            <a :href="oneDoc.down1" target="_blank" v-if="oneDoc.down1"
              ><i class="iconfont"></i>下载（中文）</a
            >
          </div>
        </div>
        <div class="head-sub">
          <template v-if="oneDoc.tb == 3">
            <span class="name-cname" v-if="oneDoc.name"
              ><i class="iconfont">&#xe650;</i>药品名称：{{ oneDoc.name }}</span
            >
          </template>
          <template v-else>
            <span class="name-cname" v-if="oneDoc.name && oneDoc.cname"
              ><i class="iconfont">&#xe650;</i>药品名称：{{ oneDoc.name }}[{{
                oneDoc.cname
              }}]</span
            >
          </template>
          <span class="sponsor" v-if="oneDoc.sponsor"
            ><i class="iconfont">&#xe651;</i>申请方：{{ oneDoc.sponsor }}</span
          >
          <span class="date" v-if="oneDoc.date"
            ><i class="iconfont">&#xe675;</i>发布日期：{{ oneDoc.date }}</span
          >
        </div>
        <div class="tags">
          <div
            class="tag"
            v-for="(tag, idxt) in getTagsArr(oneDoc.tag)"
            v-if="oneDoc.tag"
            :key="idxt"
          >
            {{ tag }}
          </div>
        </div>
      </div>
    </div>
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-size="5"
      layout="total, prev, next"
      hide-on-single-page
      :total="count"
    >
    </el-pagination>
  </div>
</template>

<script>
import LoadingGif from "@/components/common/globalCom/loading-gif";

// 评审报告
export default {
  name: "psbg",
  data() {
    return {
      count: 0,
      page: 1,
      res: [],
      name: "",
      loading: false,
    };
  },
  props: {
    drugname_standard: {
      default: "",
      type: String,
    },
    company_standard: {
      default: "",
      type: String,
    },
  },
  components: { LoadingGif },
  methods: {
    getTagsArr(tagStr) {
      let arr = String(tagStr).split(";;");
      return arr;
    },
    handleCurrentChange(e) {
      this.getDoc(e);
    },
    getDoc(page) {
      this.loading = true;
      let param = {
        name: this.name,
        page: page || this.page,
        pageSize: 5,
      };
      Axios({
        method: "get",
        url: "/api/doc",
        params: _.assign(param, {
          accesstoken: GETCOOKIEFUN("accesstoken"),
        }),
      }).then((res) => {
        console.log(res);
        if (res.data.code == 200) {
          this.res = res.data.data.List.res || [];
          this.count = res.data.data.List.count || 0;
          this.page = res.data.data.List.page || 1;
        }
        this.loading = false;
      });
    },
  },
  mounted() {
    this.name = this.drugname_standard;
    this.getDoc();
  },
};
</script>

<style scoped lang="less">
@import url(../table-style.less);
.list {
  min-height: 500px;
}
.notify {
  font-size: 13px;
  a {
    color: #002fa7;
    text-decoration: underline;
    // font-size: 14px;
  }
}
.list-item {
  padding: 10px;
  border-bottom: 1px solid #ebeef5;
  box-sizing: border-box;
  transition: 0.3s;
  &:hover {
    cursor: pointer;
    box-shadow: 0px 1px 10px 0px rgba(9, 20, 79, 0.1);
    border-bottom-color: transparent;
    .name a {
      color: #002fa7;
    }
  }
}
.name {
  flex: 1;
  font-size: 18px;
  font-weight: bold;
}
.head-sub {
  margin-bottom: 15px;
  .name-cname {
    margin-right: 10px;
    .iconfont {
      color: #002fa7;
    }
  }
}
.flex {
  display: flex;
}
.flex-ac {
  align-items: center;
}
.tags {
  display: flex;
}
.tag {
  padding: 4px 10px;
  border: 1px solid #002fa7;
  color: #002fa7;
  border-radius: 3px;
  line-height: 1;
  margin-right: 10px;
}
/deep/.el-pagination {
  border-left: none;
  border-right: none;
}
</style>