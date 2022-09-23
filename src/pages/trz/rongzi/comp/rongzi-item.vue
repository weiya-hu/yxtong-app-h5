<template>
  <div class="rongzi-item">
    <div class="rongzi-item_left">
      <div class="left-time">
        <div>{{ item.time.slice(0, 4) }}</div>
        <div style="font-weight: 600">
          {{ item.time.slice(5, item.time.length) }}
        </div>
      </div>
      <div class="left-info">
        <div class="left-info-title">
          <router-link
            :to="`/trz/rongzi/${item.data_id}`"
            target="_blank"
            class="title"
            >{{ item.shortname }}
            <span v-if="item.round && item.round!=='未公开'">{{ item.round }}</span>
            <span v-if="item.guifan_amount">成功融资，金额{{ item.guifan_amount }}</span>
          </router-link>
          <span class="tag" v-if="item.applicationscenarios.length>0" v-for="(txt,i) in item.applicationscenarios" :key="i">{{ txt }}</span>
          <span class="tag1" v-if="item.province">{{ item.province }}</span>
        </div>
        <div class="left-info-touzifang" v-if="item.investorsArr && item.investorsArr.length>0">
          <span class="label">投资方：</span>
          <span
            v-for="touzifang in item.investorsArr"
            :key="touzifang.name"
            class="touzifang-item"
            :class="{'no-click': !touzifang.jgWyuid && !touzifang.gsWyuid}"
            @click="toDetail(touzifang)"
            >{{ touzifang.name }}</span
          >
        </div>
      </div>
    </div>
    <div class="rongzi-item_right">
      <div v-if="item.financingpurpose">
        <span class="label">融资目的：</span>
        <span>{{ item.financingpurpose }}</span>
      </div>
      <div v-if="item.title">
        <span class="label">事件描述：</span>
        <span>{{ item.title }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "rongzi-item",
  created() {
    // console.log(this.item);
  },
  props: {
    item: {
      time: String,
      title: String,
      shortname: String,
      guifan_amount: String,
      round: String,
      province: String,
      touzifang: Array,
      financingpurpose: String,
    },
  },
  methods: {
    // 跳转到机构列表查询关键词
    toDetail(val) {
      let path = ''
      console.log(val)
      if (!val.gsWyuid && !val.jgWyuid) return false
      // 如果gsWyuid存在跳转到企业详情
      if (val.gsWyuid) path = `/trz/qiye/${val.gsWyuid}`

      // 如果jgWyuid存在跳转到企业详情
      if (val.jgWyuid) path = `/trz/jigou/${val.jgWyuid}`
      const { href } = this.$router.resolve({
        path: path
      });
      window.open(href, "_blank");
    },
  },
};
</script>

<style lang="less" scoped>
.rongzi-item {
  position: relative;
  padding: 10px 20px;
  padding-right: 50px;
  display: flex;
  justify-content: space-between;
  &_left {
    display: flex;
    flex: 1;
    align-items: center;
    min-width: 720px;
    .left-info-title {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
    }
    .title {
      font-size: 16px;
      font-weight: 600;
      color: #09144f;
      &:hover {
        text-decoration: none;
        color: #E7AF2F;
      }
    }
    .tag {
      font-size: 12px;
      color: #fff;
      font-weight: normal;
      line-height: 1;
      padding: 5px;
      background-color: #3556b9;
      margin-left: 10px;
      border-radius: 4px;
    }

    .tag1 {
      font-size: 12px;
      color: #fff;
      font-weight: normal;
      line-height: 10px;
      padding: 5px;
      margin-left: 10px;
      border-radius: 4px;
      border: 1px solid #3556b9;
      color: #3556b9;
      box-sizing: border-box;
    }

    .left-time {
      width: 90px;
      font-size: 14px;
      color: #666;
    }

    .left-info {
      flex: 1;
    }

    .left-info-touzifang {
      font-size: 14px;
    }
    .touzifang-item {
      margin-right: 10px;
      color: #09144f;
      cursor: pointer;
      &:hover {
        text-decoration: none;
        color: #e7af2f;
      }
    }

    .no-click {
      &:hover {
        color: #09144f;
      }
    }
  }
  .rongzi-item_right {
    color: #333;
    font-size: 13px;
    flex: 1;
    overflow: hidden;
    display: flex;
    justify-content: space-evenly;
    flex-direction: column;
    > div {
      width: calc(100% - 50px);
      white-space: nowrap;
      margin-left: 50px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .label {
    font-size: 13px;
    color: #666;
  }
  &::after {
    content: "";
    width: calc(100% - 40px);
    border-bottom: 1px dotted #dae0e9;
    position: absolute;
    bottom: 0;
  }
  &:hover {
    background-color: #f5f8fc;
  }
}
</style>
