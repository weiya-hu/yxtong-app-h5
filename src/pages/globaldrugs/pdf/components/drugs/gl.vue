<template>
  <div class="gailan">
    <div class="part-title">药品概览</div>
    <div 
    v-if="isEmpty(base.structpicture)"
    class="box" >
        <img class="structpicture" :src="base.structpicture" alt="">
    </div>
    <div class="box">
      <div class="info-item" v-if="isEmpty(base.othername)">
        <div class="label">药品别名：</div>
        <div class="content">
          {{ base.othername }}
        </div>
      </div>
       <div class="info-item" v-if="isEmpty(base.leixing2)">
          <div class="label">药品分类：</div>
          <div class="content">
            {{ base.leixing2 }}
          </div>
        </div>
                <div class="info-item" v-if="isEmpty(base.cate)">
          <div class="label">药品类别：</div>
          <div class="content">{{ base.cate }}</div>
        </div>
        <div class="info-item" v-if="isEmpty(base.company)">
          <div class="label">研发企业：</div>
          <div class="content flex flex-dc yfqy">
            <div
              class="flex item yyqy"
              v-if="base.company.company_standard.length"
            >
              <span class="label">原研：</span>
              <div class="content">
                <template
                  v-for="(item, index) in base.company.company_standard"
                >
                  <span  class="no-link" :key="index">
                    {{ item.name }}</span
                  >
                  <span 
                  :key="index+'sub'"
                  v-if="index !== base.company.company_standard.length - 1"
                          >;</span
                        >
                </template>
              </div>
            </div>
            <div class="flex item" v-if="base.company.coo_company.length">
              <span class="label">合作：</span>
              <div class="content">
                <template v-for="(item, index) in base.company.coo_company">
                  <span class="no-link" :key="index">
                    {{ item.name }}</span
                  >
                  <span 
                  :key="index+'sub'"
                  v-if="index !== base.company.coo_company.length - 1"
                          >;</span
                        >
                </template>
              </div>
            </div>
            <div class="flex item" v-if="base.company.per_company.length">
              <span class="label">许可：</span>
              <div class="content">
                <template v-for="(item, index) in base.company.per_company">
                  <span class="no-link" :key="index">
                    {{ item.name }}</span
                  >
                  <span :key="index+'sub'" v-if="index !== base.company.per_company.length - 1"
                          >;</span
                        >
                </template>
              </div>
            </div>
          </div>
        </div>
        <div class="info-item" v-if="isEmpty(base.indication)">
          <div class="label">适应症：</div>
          <div class="content flex flex-dc syz">
            <div
              class="flex item"
              v-if="
                base.indication['已批准'] && isEmpty(base.indication['已批准'])
              "
            >
              <span class="label green">已批准</span>
              <div class="content flex flex1">
                 <span
                  class="tag"
                  v-for="(t, i) in base.indication['已批准']"
                  :key="'已批准_' + i"
                >
                  {{ t }}
                  {{ i < base.indication["已批准"].length - 1 ? ";" : "" }}
                </span>
              </div>
            </div>
            <div
              class="flex item"
              v-if="base.indication['在研'] && isEmpty(base.indication['在研'])"
            >
              <span class="label blue">在研</span>
              <div class="content flex flex1">
                <span
                  class="tag"
                  v-for="(t, i) in base.indication['在研']"
                  :key="'在研_' + i"
                >
                  {{ t }}
                  {{ i < base.indication["在研"].length - 1 ? ";" : "" }}
                </span>
              </div>
            </div>
            <div
              class="flex item"
              v-if="base.indication['终止'] && isEmpty(base.indication['终止'])"
            >
              <span class="label red">终止</span>
              <div class="content flex flex1">
                <span
                  class="tag"
                  v-for="(t, i) in base.indication['终止']"
                  :key="'终止_' + i"
                >
                  {{ t }}
                  {{ i < base.indication["终止"].length - 1 ? ";" : "" }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="info-item" v-if="!(base.worldstatus['global']['name'] == '' && base.worldstatus['china']['name'] == '')">
          <div class="label">最高研发阶段：</div>
          <div class="content" style="display:flex;align-items:center;">
            <p>
              <div v-for="(t, k) in base.worldstatus"
              :key="k"
              style="cursor:pointer;display:flex;justify-content: center;align-items:center;"
              class="zgyf-item"
              >
              <img v-if="k == 'china' && t.name" style="margin-right: 5px;" src="@/assets/imgs/globaldrugs/detail/china.png"
                height="15" width="15" />
              <img v-if="k == 'global' && t.name" style="margin-right: 5px;" src="@/assets/imgs/globaldrugs/detail/world.png" height="15"
                width="15" />
                <span style="color: #9aa4b8;width: 40px" v-if="t.name"
                  >{{ k == "china" ? "中国" : "全球" }}：</span
                >

                <span v-if="t.name" style="font-weight: bold; margin-right: 5px;flex: 1"
                  >{{ t.name }}
                  <template v-if="t.date">
                    （{{ t.date }}）
                  </template>
                  </span
                >
              </div>
            </p>
          </div>
        </div>
        <div class="info-item" v-if="isEmpty(base.firstmarket)">
          <div class="label">首批上市：</div>
          <div class="content">
            <span class="spss-item" v-if="base.firstmarket.country"
              >{{ base.firstmarket.country }}</span
            >
            <span class="spss-item" v-if="base.firstmarket.date"
              >{{ base.firstmarket.date }}</span
            >
            <span class="spss-item" v-if="base.firstmarket.indication">{{
              base.firstmarket.indication
            }}</span>
          </div>
        </div>
        <div class="info-item" v-if="isEmpty(base.targets)">
          <div class="label">靶点名称：</div>
          <div class="content flex">
            <div
                class="badian"
                v-for="badian in base.targets"
                :key="badian"
              >
                {{ badian }}
              </div>
          </div>
        </div>
        <div class="info-item" v-if="isEmpty(base.atcarr)">
          <div class="label">ATC分类：</div>
          <div class="content">
            <div v-for="(atc, atcname) in base.atcarr" :key="atcname">
              <span style="margin-right: 8px; font-weight: bold">{{
                atcname
              }}</span>
              <span
                style="font-size: 12px"
                v-for="(c, i) in atc"
                :key="atcname + '_' + i"
              >
                {{ i > 0 ? ">" : "" }}{{ c.shuoming }}
              </span>
            </div>
          </div>
        </div>
        <div class="info-item" v-if="isEmpty(base.summary)">
<div class="label bold">药品概述：</div>
        <div class="content">
          <MoreText>
            <span v-html="base.summary">
          </span>
          </MoreText>
        </div>
        </div>
        <div class="info-item" v-if="isEmpty(base.chemicalname)">
            <div class="label">化学名称：</div>
            <div class="content">
            {{ base.chemicalname }}
            </div>
        </div>
        <div class="info-item" v-if="isEmpty(base.cas)">
            <div class="label">CAS登记号：</div>
            <div class="content">
            {{ base.cas }}
            </div>
        </div>
        <div class="info-item" v-if="isEmpty(base.formulations)">
            <div class="label">分子式：</div>
            <div class="content">
            {{ base.formulations }}
            </div>
        </div>
        <div class="info-item" v-if="isEmpty(base.formulaweight)">
            <div class="label">分子量：</div>
            <div class="content">
            {{ base.formulaweight }}
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import MoreText from "@/components/common/more-text";

export default {
  name: "pdf-gailan",
  props: {
    base: {
      default: () => ({}),
      type: Object,
    },
  },
  components:{MoreText},
  methods: {
    isEmpty(t) {
      // 先处理一些怪异的类型
      if (t === null || t === undefined || t === NaN) return false;
      // 获得构造器名称
      let type = t.constructor.name;
      // 处理对应的类型
      let funcs = {
        String: (e) => {
          return !!e.length;
        },
        Object: (e) => {
          return !!Object.keys(e).length;
        },
        Array: (e) => {
          return !!e.length;
        },
        Number: (e) => {
          return true;
        },
      };
      return funcs[type](t);
    },
  },
};
</script>

<style scoped lang="less">
.part-title {
  font-size: 22px;
  font-weight: bold;
  color: #002fa7;
  margin-bottom: 10px;
  border-left: 4px solid #002fa7;
  line-height: 1;
  padding-left: 5px;
}
.info-item {
  display: flex;
  font-size: 13px;
  & > .label {
    background-color: #fafbfd;
    width: 120px;
    text-align: right;
    padding: 5px;
    box-sizing: border-box;
  }
  & > .content {
    flex: 1;
    word-break: break-all;
    padding: 5px;
  }
}
.yfqy {
  font-size: 12px;
  .yyqy {
    .content {
      font-weight: bold;
      .no-link {
        font-weight: bold;
      }
    }
  }
  .item {
    margin-bottom: 10px;
    line-height: 22px;
    &:last-child {
      margin-bottom: 0;
    }
    .label {
      width: 50px;
      font-size: 12px;
      display: inline-block;
      color: #9aa4b8;
    }
    .content {
      flex: 1;
      font-size: 13px;
      // font-weight: bold;
      .hover-link {
        color: #002fa7;
      }
      .hover-link:hover {
        // font-size: 13px;
        // font-weight: bold;
        cursor: pointer;
      }
    }
  }
}
.syz {
  & > .item {
    margin-bottom: 10px;
    margin-right: 5px;
    .label {
      display: inline-block;
      width: 50px;
      height: 20px;
      border-radius: 2px;
      border-width: 1px;
      border-style: solid;
      font-size: 12px;
      text-align: center;
      vertical-align: middle;
      box-sizing: border-box;
      line-height: 18px;
      &.green {
        border-color: #9dcc40;
        color: #9dcc40;
      }
      &.blue {
        border-color: #002fa7;
        color: #002fa7;
      }
      &.red {
        border-color: #c14a27;
        color: #c14a27;
      }
    }
    .content {
      flex-wrap: wrap;
      padding-left: 10px;
      .tag {
        // text-decoration: underline;
        // color: #002fa7;
        // font-weight: bold;
      }
    }
  }
}
.flex {
  display: flex;
}
.flex1 {
  flex: 1;
}
.flex-dc {
  flex-direction: column;
}
.badian {
  padding: 4px 10px;
  border-radius: 2px;
  border: 1px solid #dcdfe6;
  margin-right: 10px;
  color: #002fa7;
  line-height: 1;
  white-space: nowrap;
}
.structpicture {
  width: 240px;
  height: 240px;
  margin: 0 auto;
  display: block;
}
</style>