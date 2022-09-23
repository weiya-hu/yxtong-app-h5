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
        <el-tooltip effect="light" placement="top">
          <div slot="content">当前药物最新年份的全球销售额</div>
          <!-- <span>
            <i class="el-icon-question cl-green"></i>
          </span> -->
        </el-tooltip>
      </li>
      <li>原研单位</li>
    </ul>
    <div>
      <ul
        v-for="(item, ix) in globalData"
        :key="ix"
        :class="[
          'ul2',
          page == 1 && !ix && !loadingBen && dataid == item.id ? '' : '',
        ]"
      >
        <!-- 药物名称 -->
        <li>
          <div class="only" :title="item.name + item.englishname">
            <router-link
              tag="a"
              :to="{ path: `/${router}/` + item.id }"
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
              :class="['color' + item.worldstatusorder]"
              :title="item.higheststatus"
              v-if="item.worldstatusorder !== 1"
              >{{ item.worldstatus }}</span
            >
          </div>
        </li>
        <!-- 临床前 -->
        <li class="flex1 flex2 flex-l">
          <!-- <span :class="{ bg7: item.worldstatusorder === 4 }"></span> -->
          <img style="width:11px;height:14px" src="~@/assets/imgs/targets/shi7.png" v-show="item.worldstatusorder === 4" alt="">
          <div
            :class="[
              'block',
              'block-l',
              item.worldstatusorder === 4 ? 'block-r' : '',
            ]"
            :style="{
              background:
                item.worldstatusorder >= 4 && item.worldstatusorder < 11
                  ? '#e4ebfb'
                  : '#f2f2f2',
              color: '#666',
            }"
            :title="item.worldstatusorder === 4 ? item.worldstatus : ''"
          >
            {{ item.worldstatusorder === 4 ? item.worldstatus : "" }}
          </div>
        </li>
        <!-- 临床Ⅰ期 -->
        <!-- 临床申请 -->
        <li class="flex1 flex2">
          <!-- <span :class="{ bg6: item.worldstatusorder === 5 }"></span> -->
          <img style="width:11px;height:14px" src="~@/assets/imgs/targets/shi6.png" v-show="item.worldstatusorder === 5" alt="">
          <div
            :class="['block', item.worldstatusorder === 5 ? 'block-r' : '']"
            :style="{
              background:
                item.worldstatusorder >= 5 && item.worldstatusorder < 11
                  ? '#c8d6f8'
                  : '#f2f2f2',
              color: '#666',
            }"
            :title="item.worldstatusorder === 5 ? item.worldstatus : ''"
          >
            {{ item.worldstatusorder === 5 ? item.worldstatus : "" }}
          </div>
        </li>
        <!-- 临床Ⅱ期 -->
        <!-- 临床Ⅰ期 -->
        <li class="flex1 flex2">
          <!-- <span :class="{ bg5: item.worldstatusorder === 6 }"></span> -->
          <img style="width:11px;height:14px" src="~@/assets/imgs/targets/shi5.png" v-show="item.worldstatusorder === 6" alt="">
          <div
            :class="['block', item.worldstatusorder === 6 ? 'block-r' : '']"
            :style="{
              background:
                item.worldstatusorder >= 6 && item.worldstatusorder < 11
                  ? '#acc2f5'
                  : '#f2f2f2',
              color: '#666',
            }"
            :title="item.worldstatusorder === 6 ? item.worldstatus : ''"
          >
            {{ item.worldstatusorder === 6 ? item.worldstatus : "" }}
          </div>
        </li>
        <!-- 临床Ⅲ期 -->
        <!-- 临床Ⅱ期 -->
        <li class="flex1 flex2">
          <!-- <span :class="{ bg4: item.worldstatusorder === 7 }"></span> -->
          <img style="width:11px;height:14px" src="~@/assets/imgs/targets/shi4.png" v-show="item.worldstatusorder === 7" alt="">
          <div
            :class="['block', item.worldstatusorder === 7 ? 'block-r' : '']"
            :style="{
              background:
                item.worldstatusorder >= 7 && item.worldstatusorder < 11
                  ? '#91adf1'
                  : '#f2f2f2',
              overflow: item.worldstatusorder <= 3 ? 'inherit' : 'hidden',
            }"
            :title="
              item.worldstatusorder === 7 ||
              item.worldstatusorder === 1 ||
              item.worldstatusorder === 2 ||
              item.worldstatusorder === 3
                ? item.worldstatus
                : ''
            "
          >
            <span
              style="color: #333; position: relative; left: -4px"
              v-if="item.worldstatusorder <= 3"
            >
              {{ item.worldstatusorder === 1 ? "无研发进展报道" : "" }}
              {{ item.worldstatusorder === 2 ? item.worldstatus : "" }}
              {{ item.worldstatusorder === 3 ? item.worldstatus : "" }}
              {{ item.worldstatusorder === 11 ? "" : "" }}
            </span>
            {{ item.worldstatusorder === 7 ? item.worldstatus : "" }}
          </div>
        </li>
        <!-- 预注册申请 -->
        <!-- 临床Ⅲ期 -->
        <li class="flex1 flex2">
          <!-- <span :class="{ bg3: item.worldstatusorder === 8 }"></span> -->
          <img style="width:11px;height:14px" src="~@/assets/imgs/targets/shi3.png" v-show="item.worldstatusorder === 8" alt="">
          <div
            :class="['block', item.worldstatusorder === 8 ? 'block-r' : '']"
            :style="{
              background:
                item.worldstatusorder >= 8 && item.worldstatusorder < 11
                  ? '#638beb'
                  : '#f2f2f2',
            }"
            :title="item.worldstatusorder === 8 ? item.worldstatus : ''"
          >
            {{ item.worldstatusorder === 8 ? item.worldstatus : "" }}
          </div>
        </li>
        <!-- 注册申请 -->
        <li class="flex1 flex2">
          <!-- <span :class="{ bg2: item.worldstatusorder === 9 }"></span> -->
          <img style="width:11px;height:14px" src="~@/assets/imgs/targets/shi2.png" v-show="item.worldstatusorder === 9" alt="">
          <div
            :class="['block', item.worldstatusorder === 9 ? 'block-r' : '']"
            :style="{
              background:
                item.worldstatusorder >= 9 && item.worldstatusorder < 11
                  ? '#4877e8'
                  : '#f2f2f2',
            }"
            :title="item.worldstatusorder === 9 ? item.worldstatus : ''"
          >
            {{ item.worldstatusorder === 9 ? item.worldstatus : "" }}
          </div>
        </li>
        <!-- 批准上市 -->
        <li class="flex1 flex2 flex-r">
          <!-- <span :class="{ bg1: item.worldstatusorder === 10 }"></span> -->
          <img style="width:11px;height:14px" src="~@/assets/imgs/targets/shi1.png" v-show="item.worldstatusorder === 10" alt="">
          <div
            class="block block-r"
            :style="{
              background:
                item.worldstatusorder >= 10 && item.worldstatusorder < 11
                  ? '#91c332'
                  : '#f2f2f2',
            }"
            :title="item.worldstatusorder === 10 ? item.worldstatus : ''"
          >
            {{ item.worldstatusorder === 10 ? item.worldstatus : "" }}
          </div>
        </li>
        <!-- 撤市 -->
        <li class="flex1 cheshi">
          <template v-if="item.worldstatusorder === 11">
            <span></span>
            <div class="block1" :title="item.worldstatus">
              {{ item.worldstatus }}
            </div>
          </template>
        </li>
        <!-- 市场销售 -->
        <li>
          {{ item.ypxs.value ? item.ypxs.value : "/" }}
          <span
            v-if="item.ypxs.value"
            @click="vueExtendTo('/ypxs?ylbm_eq=' + item.ylbm)"
            class="link-a"
            style="margin-left: 10px"
          >
            更多
          </span>
        </li>
        <!-- 原研单位 -->
        <li>
          <div :title="item.originatorcompany">
            {{ item.originatorcompany ? item.originatorcompany : "/" }}
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  // computed: {

  // },
  // watch: {

  // },
  props: {
    isExport: {
      type: Boolean,
      default: false,
    },
    globalData: {
      default: [],
      type: Array,
    },
    years: {
      default: "",
      type: String | Number,
    },
    page: {
      default: 1,
      type: String | Number,
    },
    loadingBen: {
      default: false,
      type: Boolean,
    },
    dataid: {
      default: "",
      type: String | Number,
    },
    router: {
      default: "newdrug",
      type: String,
    },
  },
  mounted() {},
  // methods: {

  // },
  // created: {

  // }
};
</script>

<style lang="less" scoped>
@import "~@/assets/less/var.less";

.table-ul {
  width: 880px;
}

.scale {
  transform: scale(0.8);
  position: relative;
  left: -100px;
}
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
    max-width: 60px;
    text-align: center;
  }
  li:first-child {
    width: 150px;
    max-width: 150px;
    text-align: center;
  }
  li:nth-child(10n) {
    width: 120px;
    text-align: center;
    max-width: 120px;
    line-height: 1;
  }
  li:last-child {
    width: 80px;
    text-align: center;
  }
}

.link-a {
  color: #4877e8;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
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
    max-width: 60px;
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
    padding-left: 10px;
    width: 140px;
    max-width: 140px;
    text-align: left;

    div {
      display: block;
      width: 100%;
    }
    .only {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    span {
      display: inline-block;
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
    width: 120px;
    max-width: 120px;
    text-align: center;
    display: flex;
    flex-wrap: wrap;
  }

  li:last-child {
    width: 130px;
    // min-width: 120px;
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
.ben {
  position: relative;

  li {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }
}
.ul2.ben li:first-child {
  margin-left: 30px;
  margin-right: 25px;
}
.ben:before {
  position: absolute;
  content: "";
  top: 22px;
  left: 0;
  height: 22px;
  width: 54px;
  z-index: 9999;
  background: url(~@/assets/imgs/targets/ben.png) no-repeat center center;
}
.flag-p {
  display: inline;
}

@media screen and (max-width: 1350px) {
  .flag-p {
    display: block;
  }
}
</style>
