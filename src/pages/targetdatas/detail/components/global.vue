<template>
  <div class="table-ul">
    <ul class="ul1">
      <li>药物名称</li>
      <li class="flex1">临床前</li>
      <li class="flex1">临床申请</li>

      <li class="flex1">临床Ⅰ期</li>
      <li class="flex1">临床Ⅱ期</li>
      <li class="flex1">临床Ⅲ期</li>
      <li class="flex1">注册申请</li>
      <li class="flex1">批准上市</li>
      <li class="flex1">撤市</li>
      <li>
        <p class="flag-p">市场销售</p>
        <span style="font-size: 12px">(单位：万元)</span>
      </li>
      <li>原研单位</li>
    </ul>
    <div>
      <ul
        v-for="(item, ix) in globalData"
        :class="['ul2', !ix && !loadingBen && dataid == item.id ? 'ben' : '']"
        :key="ix"
        class="ul2"
      >
        <li>
          <div class="only" :title="item.name + item.englishname">
            <router-link
              tag="a"
              :to="{ path: '/report/' + item.id }"
              class="no-underline cl-blue"
              target="_blank"
            >
              {{ item.name }} {{ item.englishname }}
            </router-link>
          </div>
          <div class="height20">
            <span class="colbg" v-if="item.zclx1 == '是'" title="中国1类药"
              >中国1类药</span
            >
            <span
              :class="['color' + item.worldstatus_int]"
              :title="item.higheststatus"
              v-if="item.worldstatus_int !== 1"
              >{{ item.worldstatus }}</span
            >
          </div>
        </li>
        <li class="flex1 flex2 flex-l">
          <span :class="{ bg7: item.worldstatus_int === 4 }"></span>
          <div
            :class="[
              'block',
              'block-l',
              item.worldstatus_int === 4 ? 'block-r' : '',
            ]"
            :style="{
              background:
                item.worldstatus_int >= 4 && item.worldstatus_int < 11
                  ? '#e4ebfb'
                  : '#f2f2f2',
              color: '#666',
            }"
            :title="item.worldstatus_int === 4 ? item.worldstatus : ''"
          >
            {{ item.worldstatus_int === 4 ? item.worldstatus : "" }}
          </div>
        </li>
        <li class="flex1 flex2">
          <span :class="{ bg6: item.worldstatus_int === 5 }"></span>
          <div
            :class="['block', item.worldstatus_int === 5 ? 'block-r' : '']"
            :style="{
              background:
                item.worldstatus_int >= 5 && item.worldstatus_int < 11
                  ? '#c8d6f8'
                  : '#f2f2f2',
              color: '#666',
            }"
            :title="item.worldstatus_int === 5 ? item.worldstatus : ''"
          >
            {{ item.worldstatus_int === 5 ? item.worldstatus : "" }}
          </div>
        </li>
        <li class="flex1 flex2">
          <span :class="{ bg5: item.worldstatus_int === 6 }"></span>
          <div
            :class="['block', item.worldstatus_int === 6 ? 'block-r' : '']"
            :style="{
              background:
                item.worldstatus_int >= 6 && item.worldstatus_int < 11
                  ? '#acc2f5'
                  : '#f2f2f2',
              color: '#666',
            }"
            :title="item.worldstatus_int === 6 ? item.worldstatus : ''"
          >
            {{ item.worldstatus_int === 6 ? item.worldstatus : "" }}
          </div>
        </li>
        <li class="flex1 flex2">
          <span :class="{ bg4: item.worldstatus_int === 7 }"></span>
          <div
            :class="['block', item.worldstatus_int === 7 ? 'block-r' : '']"
            :style="{
              background:
                item.worldstatus_int >= 7 && item.worldstatus_int < 11
                  ? '#91adf1'
                  : '#f2f2f2',
              overflow: item.worldstatus_int <= 3 ? 'inherit' : 'hidden',
            }"
            :title="
              item.worldstatus_int === 7 ||
              item.worldstatus_int === 1 ||
              item.worldstatus_int === 2 ||
              item.worldstatus_int === 3
                ? item.worldstatus
                : ''
            "
          >
            <span
              style="color: #333; position: relative; left: -4px"
              v-if="item.worldstatus_int <= 3"
            >
              {{ item.worldstatus_int === 1 ? "无研发进展报道" : "" }}
              {{ item.worldstatus_int === 2 ? item.worldstatus : "" }}
              {{ item.worldstatus_int === 3 ? item.worldstatus : "" }}
              {{ item.worldstatus_int === 11 ? "" : "" }}
            </span>
            {{ item.worldstatus_int === 7 ? item.worldstatus : "" }}
          </div>
        </li>
        <li class="flex1 flex2">
          <span :class="{ bg3: item.worldstatus_int === 8 }"></span>
          <div
            :class="['block', item.worldstatus_int === 8 ? 'block-r' : '']"
            :style="{
              background:
                item.worldstatus_int >= 8 && item.worldstatus_int < 11
                  ? '#638beb'
                  : '#f2f2f2',
            }"
            :title="item.worldstatus_int === 8 ? item.worldstatus : ''"
          >
            {{ item.worldstatus_int === 8 ? item.worldstatus : "" }}
          </div>
        </li>
        <li class="flex1 flex2">
          <span :class="{ bg2: item.worldstatus_int === 9 }"></span>
          <div
            :class="['block', item.worldstatus_int === 9 ? 'block-r' : '']"
            :style="{
              background:
                item.worldstatus_int >= 9 && item.worldstatus_int < 11
                  ? '#4877e8'
                  : '#f2f2f2',
            }"
            :title="item.worldstatus_int === 9 ? item.worldstatus : ''"
          >
            {{ item.worldstatus_int === 9 ? item.worldstatus : "" }}
          </div>
        </li>
        <li class="flex1 flex2 flex-r">
          <span :class="{ bg1: item.worldstatus_int === 10 }"></span>
          <div
            class="block block-r"
            :style="{
              background:
                item.worldstatus_int >= 10 && item.worldstatus_int < 11
                  ? '#91c332'
                  : '#f2f2f2',
            }"
            :title="item.worldstatus_int === 10 ? item.worldstatus : ''"
          >
            {{ item.worldstatus_int === 10 ? item.worldstatus : "" }}
          </div>
        </li>
        <li class="flex1 cheshi">
          <template v-if="item.worldstatus_int === 11">
            <span></span>
            <div class="block1" :title="item.worldstatus">
              {{ item.worldstatus }}
            </div>
          </template>
        </li>
        <li
          style="
            display: inline-flex;
            align-items: center;
            justify-content: center;
          "
        >
          {{ item.sales ? item.sales : "" }}
          <span
            v-if="item.sales != '' && item.sales != ': '"
            @click="vueExtendTo('/ypxs?ylbm_eq=' + item.ylbm)"
            class="link-a"
            style="margin-left: 10px"
          >
            更多
          </span>
          <span style="margin-left: 10px" v-else>{{
            item.sales ? item.sales : ""
          }}</span>
        </li>
        <li>
          <span :title="item.originatorcompany">{{
            item.originatorcompany ? item.originatorcompany : "/"
          }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      obj: {
        无研发进展报道: 0, // 空值
        暂停: 0,
        停止: 0,
        撤市: 8,
        已上市: 7, // 临时批准
        注册申请: 6,
        预注册申请: 5,
        临床Ⅲ期: 4, // 停止(临床Ⅲ期)
        临床Ⅱ期: 3, // 停止(临床Ⅱ期) 临床Ⅱ期（停止）
        临床Ⅰ期: 2, // 临床
        临床前: 1,
      },
    };
  },
  // computed: {

  // },
  // watch: {

  // },
  props: {
    globalData: {
      default: [],
      type: Array,
    },
    loadingBen: {
      default: false,
      type: Boolean,
    },
    dataid: {
      default: "",
      type: String | Number,
    },
    years: {
      default: "",
      type: String | Number,
    },
  },
  // methods: {

  // },
  // created: {

  // }
};
</script>

<style lang="less" scoped>
@import "~@/assets/less/var.less";

.ul1 {
  display: flex;
  align-items: center;
  background: #e1e6f0;
  height: 40px;
  font-size: 13px;
  color: #35384a;
  font-weight: 700;

  li.flex1 {
    flex: 1;
    min-width: 80px;
    text-align: center;
  }
  li:first-child {
    padding-left: 30px;
    padding-right: 10px;
    width: 160px;
    min-width: 160px;
    text-align: left;
  }
  li:nth-child(10n) {
    width: 200px;
    text-align: center;
    min-width: 116px;
    line-height: 1;
  }
  li:last-child {
    width: 120px;
    padding: 0 10px;
    text-align: center;
  }
}
.ul2 {
  display: flex;
  padding: 12px 0;
  border-bottom: 1px solid #dfe5f1;
  border-left: 1px solid #dfe5f1;
  border-right: 1px solid #dfe5f1;
  height: 40px;

  li.flex1 {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex-direction: column;
    flex: 1;
    min-width: 80px;
    text-align: center;
    color: #fff;

    > span {
      height: 14px;
      width: 11px;
    }
    span.bg7 {
      background: url(~@/assets/imgs/targets/shi7.png) no-repeat center center;
    }
    span.bg6 {
      background: url(~@/assets/imgs/targets/shi6.png) no-repeat center center;
    }
    span.bg5 {
      background: url(~@/assets/imgs/targets/shi5.png) no-repeat center center;
    }
    span.bg4 {
      background: url(~@/assets/imgs/targets/shi4.png) no-repeat center center;
    }
    span.bg3 {
      background: url(~@/assets/imgs/targets/shi3.png) no-repeat center center;
    }
    span.bg2 {
      background: url(~@/assets/imgs/targets/shi2.png) no-repeat center center;
    }
    span.bg1 {
      background: url(~@/assets/imgs/targets/shi1.png) no-repeat center center;
    }
    .block-l {
      border-top-left-radius: 20px;
      border-bottom-left-radius: 20px;
    }
    .block-r {
      border-top-right-radius: 20px;
      border-bottom-right-radius: 20px;
    }
  }
  li.flex2:before {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 20px;
    background: #f2f2f2;
  }
  li.flex-l:before {
    border-top-left-radius: 20px;
    border-bottom-left-radius: 20px;
  }
  li.flex-r:before {
    border-top-right-radius: 20px;
    border-bottom-right-radius: 20px;
  }
  li:first-child {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-left: 30px;
    padding-right: 10px;
    width: 160px;
    min-width: 160px;
    text-align: left;
    .only {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    span {
      display: inline-block;
      padding: 0 12px;
      border-radius: 10px;
      height: 20px;
      line-height: 20px;
      color: #fff;
    }
    .height20 {
      height: 20px;
    }
    .colbg {
      border: 1px solid #4877e8;
      color: #4877e8;
      background: none;
      box-sizing: border-box;
    }
    span.color2 {
      background: #fbc78e;
    }
    span.color3 {
      background: #ff9a75;
    }
    span.color4 {
      color: #666;
      background: #e4ebfb;
    }
    span.color5 {
      color: #666;
      background: #c8d6f8;
    }
    span.color6 {
      color: #666;
      background: #acc2f5;
    }
    span.color7 {
      background: #91adf1;
    }
    span.color8 {
      background: #638beb;
    }
    span.color9 {
      background: #4877e8;
    }
    span.color10 {
      background: #91c332;
    }
    span.color11 {
      background: #56596c;
    }
  }
  li:nth-child(10n) {
    width: 200px;
    min-width: 116px;
    text-align: center;
    line-height: 40px;
  }
  li:last-child {
    width: 120px;
    // min-width: 120px;
    padding: 0 10px;
    text-align: center;
    overflow: hidden !important;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    /*! autoprefixer: off */
    -webkit-box-orient: vertical;
    /* autoprefixer: on */
    word-break: break-all;
  }
  .block {
    position: relative;
    height: 20px;
    line-height: 20px;
    width: 100%;
    background: #f2f2f2;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .cheshi {
    span {
      height: 14px;
      width: 11px;
      background: url(~@/assets/imgs/targets/shi0.png) no-repeat center center;
    }
    .block1 {
      position: relative;
      height: 20px;
      line-height: 20px;
      width: 80%;
      background: #56596c;
      border-radius: 20px;
    }
  }
}
.flag-p {
  display: inline;
}

.link-a {
  color: #4877e8;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
}

@media screen and (max-width: 1350px) {
  .flag-p {
    display: block;
  }
}
.ben {
  background: #f5f9fc;
  position: relative;
}
.ben:before {
  content: "";
  position: absolute;
  top: 22px;
  left: -22px;
  height: 22px;
  width: 54px;
  background: url(~@/assets/imgs/targets/ben.png) no-repeat center center;
}
</style>
