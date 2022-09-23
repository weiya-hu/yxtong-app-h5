<template>
  <div class="rp-part">
    <div class="part-head">
      <div class="part-title">
        <span class="title-detail">{{ title }}</span>
      </div>
    </div>
    <div class="part-content">
      <ul class="content-list">
        <li class="list-item" v-for="(item, index) in array" :key="index">
          <span class="item-link" @click="pushRoute(item.href)">
            <span>{{ item.title + `${item.internal ? "(内)" : ""}` }}</span>
            <span class="cl-blue">{{ item.count }}</span>
          </span>
        </li>
        <li class="list-item" v-if="pharmaceuticalPatents.count">
          <span
            class="item-link"
            @click="redirectPatent(pharmaceuticalPatents.href)"
          >
            <span
              >{{ pharmaceuticalPatents.title }}&nbsp;&nbsp;&nbsp;&nbsp;</span
            >
            <span class="ft14"
              ><span class="iconfont ft14">&#xe60b;</span></span
            >
          </span>
        </li>

        <li class="list-item" v-if="medicalDevice.isShow">
          <span
            class="item-link"
            @click="redirectPatent(medicalDevice.href)"
          >
            <span
              >{{ medicalDevice.title }}&nbsp;&nbsp;&nbsp;&nbsp;</span
            >
            <span class="ft14"
              ><span class="iconfont ft14">&#xe60b;</span></span
            >
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pharmaceuticalPatents: {
        title: "医药专利",
        count: 0,
        href: ""
      },
      medicalDevice: {
        title: '器械专利',
        isShow: false,
        href: ""
      }
    };
  },
  props: {
    icon: {
      type: String,
      default: "&#xe600;"
    },
    title: {
      type: String,
      default: "暂无"
    },
    array: {
      type: Array,
      default: []
    }
  },
  methods: {
    // 链接到数据库
    pushRoute(href) {
      // 直接用window.open带参数跳转到指定页面后，会造成参数乱码问题，所以改成VUE的方式跳转
      const routeData = this.$router.resolve({
        path: href,
        query: {
          comprehensive: this.$route.query.comprehensive,
          searchwords: this.$route.query.searchwords
        }
      });
      window.open(routeData.href, "_blank");
      // window.open(`/${href}?comprehensive=${this.$route.query.comprehensive}&searchwords=${this.$route.query.searchwords}`, '_blank')
    },
    redirectPatent(href) {
      window.open(href, "_blank");
    },
    patentData() {
      let tp = "";
      let reg = new RegExp("[\\u4E00-\\u9FFF]+", "g");
      let words = this.$route.query.searchwords;
      let hosts =
        location.host.indexOf("dev") > -1
          ? "patent-dev.yaozh.com"
          : "patent.yaozh.com";
      let api = this.PATAPI_PROXY;
      tp = reg.test(this.$route.query.searchwords) ? "cn" : "all";
      // Axios.get(`${api}/dbtotal?sourceType=${tp}&words=${encodeURIComponent(words)}&accesstoken=${this.vueGetCookie('accesstoken')}`)
      // .then((res) => {
      //   if (res.data.code === 200 && res.data.data) {
      //     let data = res.data.data
      var comprehensive = this.$route.query.comprehensive;
      if (comprehensive == "drug") {
        this.pharmaceuticalPatents.href = `https://${hosts}/list?sourceType=${tp}&words=${encodeURIComponent(
          "MDS=" + words + " OR TTL=" + words + " OR ABST=" + words
        )}&ga_source=vip_${comprehensive}&ga_name=patent`;
      } else {
        this.pharmaceuticalPatents.href = `https://${hosts}/list?sourceType=${tp}&words=${encodeURIComponent(
          "KWS=" + words
        )}&ga_source=vip_${comprehensive}&ga_name=patent`;
      }
      if (
        this.title == "药品研发" &&
        (comprehensive == "drug" || comprehensive == "company")
      ) {
        this.pharmaceuticalPatents.count = 1;
      } else {
        this.pharmaceuticalPatents.count = 0;
      }

      // 医疗器械增加器械专利外链
      if (this.title == "医疗器械" && comprehensive == "devices") {
        this.medicalDevice.isShow = true
        this.medicalDevice.href = `https://${hosts}/list?sourceType=${tp}&words=${encodeURIComponent(
          "KWS=" + words
        )}&fields=&page=1&sort=&group=&pageSize=20&numberPriority=0&ga_source=vip_${comprehensive}&ga_name=patent`
      } else {
        this.medicalDevice.isShow = false
        this.medicalDevice.href = ''
      }

      // this.pharmaceuticalPatents.count = data;
      //   }
      // }).catch((err) => {
      //   console.log(err)
      // })
    }
  },
  mounted() {
    if (this.title === "药品研发" || this.title === '医疗器械') {
      this.patentData();
    }
    // console.info(this.$route.query.comprehensive)
  }
};
</script>

<style lang="less" scoped>
@import "~@/assets/less/var.less";

.rp-part {
  position: relative;
  .ft14 {
    font-size: 14px;
  }
  .part-head {
    height: 35px;
    overflow: hidden;
    width: 100%;
    border-bottom: 1px solid #dfe5f1;
    .part-title {
      margin-top: 4px;
      box-sizing: border-box;
      font-size: 14px;
      color: @PrimaryColor;
      .title-detail {
        margin-left: 20px;
        padding-bottom: 10px;
        font-size: 14px;
        color: @PrimaryColor;
        border-bottom: 2px solid @PrimaryColor;
      }
    }
  }
  .part-content {
    padding: 20px 0px 10px 48px;
    line-height: 24px;
    font-size: 13px;
    .content-list {
      display: flex;
      align-content: flex-start;
      flex-wrap: wrap;
      .list-item {
        position: relative;
        box-sizing: border-box;
        display: flex;
        padding-left: 12px;
        height: 14px;
        line-height: 14px;
        margin-bottom: 14px;

        .item-link {
          display: inline-block;
          cursor: pointer;
          text-decoration: none;
          & > span {
            cursor: pointer;
            height: 13px;
            line-height: 13px;
            font-size: 13px;
            font-family: Microsoft YaHei;
            font-weight: 400;
          }

          .cl-blue {
            margin-left: 12px;
          }
        }
        &::before {
          content: "";
          position: absolute;
          top: 4px;
          left: 0px;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background-color: @FontColor;
        }
        &:hover {
          &::before {
            background-color: @PrimaryColor;
          }
          .item-link {
            color: @PrimaryColor;
          }
        }
      }
    }
  }
  .part-more {
    text-align: center;
    min-width: 64px;
    height: 40px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: absolute;
    bottom: 10px;
    left: 50%;
    margin-left: -32px;
    cursor: pointer;
    .more-icon {
      font-size: 20px;
      font-weight: bold;
      color: @FontColor4;
    }
    .more-part {
      font-size: 10px;
      color: @FontColor4;
    }
  }
}

@media screen and (max-width: 1440px) {
  .list-item {
    width: 50%;
  }
}

@media screen and (min-width: 1440px) {
  .list-item {
    width: 50%;
  }
}

@media screen and (min-width: 1920px) {
  .list-item {
    width: 25%;
  }
}
</style>
