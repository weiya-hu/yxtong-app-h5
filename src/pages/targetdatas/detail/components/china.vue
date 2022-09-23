<template>
  <div class="table-ul">
    <ul class="ul1">
      <li>药物名称</li>
      <li>申报企业</li>
      <li>申报临床企业</li>
      <li>批准临床企业</li>
      <li>临床试验申办单位</li>
      <li>批准上市企业</li>
      <li>一致性评价申报企业</li>
      <li>一致性评价通过企业</li>
    </ul>
    <div>
      <ul class="ul2" v-for="(item, ix) in chinaData" :key="ix">
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
        <li>
          <div
            class="bgs"
            :style="{
              background: `rgba(93, 135, 235, ${
                item.maxNum ? item.count_sbqy / item.maxNum : 0
              })`
            }"
          >
            <router-link
              v-if="Number(item.count_sbqy)"
              tag="a"
              :to="{ path: `/zhuce?ylbm=${item.ylbm}&tabName=qiyegroup` }"
              target="_blank"
              :class="{ colorF: item.count_sbqy / item.maxNum == 1 }"
            >
              {{ item.count_sbqy }}
            </router-link>
            <span v-else>0</span>
          </div>
        </li>
        <li>
          <div
            class="bgs"
            :style="{
              background: `rgba(93, 135, 235, ${
                item.maxNum ? item.count_sblcqy / item.maxNum : 0
              })`
            }"
          >
            <router-link
              v-if="Number(item.count_sblcqy)"
              tag="a"
              :to="{
                path:
                  `/zhuce?ylbm=${item.ylbm}&tabName=qiyegroup&filter_condition=` +
                  JSON.stringify({ linchuang: ['L'] })
              }"
              target="_blank"
              :class="{ colorF: item.count_sblcqy / item.maxNum == 1 }"
            >
              {{ item.count_sblcqy }}
            </router-link>
            <span v-else>0</span>
          </div>
        </li>
        <li>
          <div
            class="bgs"
            :style="{
              background: `rgba(93, 135, 235, ${
                item.maxNum ? item.count_pzlcqy / item.maxNum : 0
              })`
            }"
          >
            <router-link
              v-if="Number(item.count_pzlcqy)"
              tag="a"
              :to="{
                path:
                  `/zhuce?ylbm=${item.ylbm}&tabName=qiyegroup&filter_condition=` +
                  JSON.stringify({ xulie: ['3'] })
              }"
              target="_blank"
              :class="{ colorF: item.count_pzlcqy / item.maxNum == 1 }"
            >
              {{ item.count_pzlcqy }}
            </router-link>
            <span v-else>0</span>
          </div>
        </li>
        <li>
          <div
            class="bgs"
            :style="{
              background: `rgba(93, 135, 235, ${
                item.maxNum ? item.count_lcsysbdw / item.maxNum : 0
              })`
            }"
          >
            <a
              v-if="Number(item.count_lcsysbdw)"
              href="javascript: void();"
              @click.prevent="
                vueExtendTo(
                  `/linchuangshiyan?ylbm=${item.ylbm}&tabName=qiyegroup&tabs=3`
                )
              "
              target="_blank"
              :class="{ colorF: item.count_lcsysbdw / item.maxNum == 1 }"
            >
              {{ item.count_lcsysbdw }}
            </a>
            <!-- <router-link v-if="Number(item.count_lcsysbdw)" tag="a" :to="{path: `/linchuangshiyan?ylbm=${item.ylbm}&tabName=qiyegroup`}" target="_blank" :class="{colorF: item.count_lcsysbdw / item.maxNum==1}">
              {{ item.count_lcsysbdw }}
            </router-link> -->
            <span v-else>0</span>
          </div>
        </li>
        <li>
          <div
            class="bgs"
            :style="{
              background: `rgba(93, 135, 235, ${
                item.maxNum ? item.count_pzssqy / item.maxNum : 0
              })`
            }"
          >
            <router-link
              v-if="Number(item.count_pzssqy)"
              tag="a"
              :to="{
                path: `/cfdadrug/list?fourth_condition=ylbm=${item.ylbm}`
              }"
              target="_blank"
              :class="{ colorF: item.count_pzssqy / item.maxNum == 1 }"
            >
              {{ item.count_pzssqy }}
            </router-link>
            <span v-else>0</span>
          </div>
        </li>
        <li>
          <div
            class="bgs"
            :style="{
              background: `rgba(93, 135, 235, ${
                item.maxNum ? item.count_yzxpjqy / item.maxNum : 0
              })`
            }"
          >
            <router-link
              v-if="Number(item.count_yzxpjqy)"
              tag="a"
              :to="{
                path:
                  `/zhuce?ylbm=${item.ylbm}&tabName=qiyegroup&filter_condition=` +
                  JSON.stringify({ yzxpj: ['1'] })
              }"
              target="_blank"
              :class="{ colorF: item.count_yzxpjqy / item.maxNum == 1 }"
            >
              {{ item.count_yzxpjqy }}
            </router-link>
            <span v-else>0</span>
          </div>
        </li>
        <li>
          <div
            class="bgs"
            :style="{
              background: `rgba(93, 135, 235, ${
                item.maxNum ? item.count_yzxpjtgqy / item.maxNum : 0
              })`
            }"
          >
            <router-link
              v-if="Number(item.count_yzxpjtgqy)"
              tag="a"
              :to="{
                path:
                  '/zhuce?tabName=qiyegroup&hot_condition=' +
                  JSON.stringify({ yzxtype: ['通过', '视同通过'] }) +
                  '&ylbm=' +
                  item.ylbm
              }"
              target="_blank"
              :class="{ colorF: item.count_yzxpjtgqy / item.maxNum == 1 }"
            >
              {{ item.count_yzxpjtgqy }}
            </router-link>
            <span v-else>0</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: [],
      maxNum: 1
    };
  },
  // computed: {

  // },
  // watch: {

  // },
  props: {
    chinaData: {
      default: [],
      type: Array
    }
  },
  methods: {}
  // created() {

  // }
};
</script>

<style lang="less" scoped>
@import "~@/assets/less/var.less";
.table-ul {
  // margin-top: 30px;
}
.ul1 {
  display: flex;
  align-items: center;
  background: #e1e6f0;
  height: 40px;
  font-size: 13px;
  color: #35384a;
  font-weight: 700;

  li:nth-child(1n + 2) {
    flex: 1;
    text-align: center;
  }
  li:first-child {
    padding-left: 30px;
    width: 200px;
    text-align: left;
  }
}
.ul2 {
  display: flex;
  height: 64px;
  border-bottom: 1px solid #dfe5f1;
  border-left: 1px solid #dfe5f1;
  border-right: 1px solid #dfe5f1;

  li:nth-child(1n + 2) {
    flex: 1;
    text-align: center;
    margin-left: 1px;
    padding: 20px 0;
    .bgs {
      line-height: 24px;
      font-size: 13px;
      font-weight: 700;
      color: #35384a;
    }
    a {
      text-decoration: underline;
    }
    a.colorF {
      color: #fff;
    }
  }
  li:first-child {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-left: 30px;
    padding-right: 10px;
    width: 200px;
    text-align: left;
    .only {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    span {
      display: inline-block;
      padding: 0 12px;
      background: @Green;
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
      background: #acc2f5;
    }
    span.color4 {
      background: #ff9a75;
    }
    span.color5 {
      color: #666;
      background: #e4ebfb;
    }
    span.color6 {
      color: #666;
      background: #c8d6f8;
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
      background: #56596c;
    }
    span.color11 {
      background: #91c332;
    }
  }
}
</style>
