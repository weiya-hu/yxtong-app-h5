<template>
  <div class="psbg">
    <div class="part-title">评审报告</div>
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
  </div>
</template>

<script>
export default {
  name: "pdf-psbg",
  data() {
    return {
      res: [],
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
  methods: {
    getTagsArr(tagStr) {
      let arr = String(tagStr).split(";;");
      return arr;
    },
    getDoc(page = 1) {
      let param = {
        name: this.drugname_standard,
        page: page || this.page,
        pageSize: 5,
      };
      return Axios({
        method: "get",
        url: "/api/doc",
        params: _.assign(param, {
          accesstoken: GETCOOKIEFUN("accesstoken"),
        }),
      }).then((res) => {
        if (res.data.code == 200 && this.isEmpty(res.data.data)) {
          this.res = res.data.data.List.res || [];
          this.count = res.data.data.List.count || 0;
          this.page = res.data.data.List.page || 1;
        }
      });
    },
  },
  async mounted() {
    await this.getDoc(1);
    if (this.res.length == 0) {
        this.$root.$emit('hide-page','全球药品评审报告')
    }
    this.$root.$emit("load-page", "全球药品评审报告");
  },
};
</script>

<style lang="less" scoped>
.part-title {
  font-size: 22px;
  font-weight: bold;
  color: #002fa7;
  margin-bottom: 10px;
  border-left: 4px solid #002fa7;
  line-height: 1;
  padding-left: 5px;
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
</style>