<template>
  <div class="news-item">
    <div class="news-item-title">
      <span class="news-tag" v-if="item.sort">{{ item.sort }}</span>
      <div
        style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap"
      >
        <router-link
          class="title-link"
          :to="`/trz/news/${item.data_id}`"
          target="_blank"
          >{{ item.title }}</router-link
        >
      </div>
    </div>
    <div class="news-item-preview" v-if="item.digest">
      {{ item.digest }}
    </div>
    <div class="news-item-info">
      <img src="@/assets/imgs/clock.png" alt="" />
      <span>{{ item.time }}</span>
      <img
        style="margin-left: 20px"
        src="@/assets/imgs/link.png"
        alt=""
        v-if="item.source"
      />
      <span>{{ item.source }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      sort: String,
      source: String,
      title: String,
      digest: String,
      time: String,
      data_id: String,
    },
  },
};
</script>

<style lang="less" scoped>
.news-item {
  position: relative;
  padding: 20px;
  &-info {
    display: flex;
    align-items: center;
    color: #999;
    img {
      width: 14px;
      height: 14px;
      margin-right: 6px;
    }
    span,
    a {
      line-height: 1;
    }
  }
  .news-item-preview {
    max-height: 66px;
    font-size: 14px;
    color: #666;
    font-weight: 400;
    margin-bottom: 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }
  .news-item-title {
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    .title-link {
      font-size: 16px;
      font-weight: 600;
      color: #09144f;
      line-height: 24px;
      &:hover {
        text-decoration: none;
        color: #e7af2f;
      }
    }
    .news-tag {
      font-size: 12px;
      background-color: #3556b9;
      border-radius: 4px;
      color: #fff;
      line-height: 1;
      padding: 5px 6px;
      margin-right: 10px;
      vertical-align: 2px;
      min-width: 85px;
      box-sizing: border-box;
      text-align: center;
    }
  }
  &::after {
    content: " ";
    width: calc(100% - 40px);
    height: 1px;
    border-bottom: 1px dotted #dae0e9;
    position: absolute;
    bottom: 0;
  }
}
</style>
