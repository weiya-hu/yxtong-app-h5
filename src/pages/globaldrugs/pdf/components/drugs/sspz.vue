<template>
  <div class="sspz">
    <div class="part-title">上市批准</div>
    <template v-if="LC.length">
      <div class="part-sub-title">批准历程:</div>
      <div class="timeline">
        <div class="lichen">
          <div class="line"></div>
          <div
            v-for="(t, k) in LC"
            :key="k"
            :class="['lc-item', k % 2 == 1 ? 'down' : '']"
          >
            <div class="flex flex-ac">
              <img
                style="width: 12px; height: 12px; margin-right: 5px"
                :src="'/static/imgs/globalapproval/' + handlerIcon(t.source)"
                alt=""
              />
              <span>{{ t.source }}</span>
            </div>
            <div style="color: #5c6973; font-size: 12px">
              {{ t.mindate }}
            </div>
            <div class="dot-sm"></div>
            <div class="dot-line"></div>
            <div class="dot-ll"></div>
          </div>
        </div>
      </div>
    </template>
    <template v-for="(pz, index) in pzhead">
      <div :key="index"
      v-if="pz.state.length>0"
      >
        <div style="display: flex; align-items: center;margin-bottom:10px;margin-top:10px">
          <img
            v-show="pz.icon"
            :src="pz.icon"
            style="width: 21px; margin-right: 5px"
            alt=""
          />
          <span style="color: #333">{{ pz.name }}</span>
        </div>
        <div class="table">
            <table>
                <tr>
                    <th v-for="item in pztablehead" :key="item.field"
                    :style="{width: item.field_width+'px'}"
                    >
                        {{item.label}}
                    </th>
                </tr>
                <tr v-for="(row, idx) in pz.state" :key="idx">
                  <td v-for="(item, index) in pztablehead" :key="index+'_'+idx">
                        <div>
                        {{row[item.field]}}
                    </div>
                  </td>
                </tr>
            </table>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: "pdf-sspz",
  data() {
    return {
      LC: [],
      pzhead: [
        {
          name: "中国",
          key: "中国",
          icon: "/static/imgs/state/icons/China.png",
          state: [],
        },
        {
          name: "中国台湾",
          key: "中国台湾",
          icon: "/static/imgs/state/icons/China.png",
          state: [],
        },
        {
          name: "美国",
          key: "美国",
          icon: "/static/imgs/state/icons/United States of America.png",
          state: [],
        },
        {
          name: "欧盟",
          key: "欧盟",
          icon: "/static/imgs/state/icons/European Patent Office.png",
          state: [],
        },
        {
          name: "日本",
          key: "日本",
          icon: "/static/imgs/state/icons/Japan.png",
          state: [],
        },
        {
          name: "其他国家或地区",
          key: "其他",
          icon: "",
          state: [],
        },
      ],
      // 批准的 table 表头渲染  根据接口来
      pztablehead: [
        {
          label: "批准号",
          statement: "<p>包括中国批准文号及美国申请号等。</p>",
          sort: "20",
          new_type: "1",
          readtype: "默认读取",
          field: "drugid",
          field_width: "100",
        },
        {
          label: "药品名称",
          sort: "19",
          new_type: "1",
          readtype: "默认读取",
          field: "name",
          field_width: "100",
        },
        {
          label: "企业名称",
          sort: "16",
          new_type: "1",
          readtype: "默认读取",
          field: "company",
          field_width: "150",
        },

        {
          label: "剂型",
          sort: "14",
          new_type: "1",
          readtype: "默认读取",
          field: "zwform",
          field_width: "100",
        },
        {
          label: "批准日期",
          sort: "12",
          order: "1",
          order_field: "date",
          new_type: "1",
          readtype: "默认读取",
          field: "date",
          field_width: "150",
        },
        {
          label: "国家或地区",
          sort: "11",
          new_type: "1",
          readtype: "默认读取",
          field: "source",
          field_width: "120",
        },
      ],
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
    base: {
      default: () => ({}),
      type: Object,
    },
  },
  methods: {
    handlerIcon(source) {
      let icon = "";
      switch (source) {
        case "美国":
          icon = "United States of America";
          break;
        case "中国":
        case "中国台湾":
          icon = "China";
          break;
        case "日本":
          icon = "Japan";
          break;
        case "英国":
          icon = "Great Britain";
          break;
        case "法国":
          icon = "France";
          break;
        case "德国":
          icon = "Germany";
          break;
        case "加拿大":
          icon = "Canada";
          break;
        case "印度":
          icon = "India";
          break;
        case "欧盟EMA":
        case "欧盟HMA":
          icon = "Europe";
          break;
        case "韩国":
          icon = "South Korea";
          break;
      }
      icon += ".png";
      return icon;
    },
    getPizun() {
      // /api/globalapproval/infoAggs/activeingredient/dupilumab
      const drugname_standard = this.drugname_standard;
      Axios({
        url:
          "/api/globalapproval/infoAggs/activeingredient/" + drugname_standard,
        params: {
          action: "pizhun",
        },
      }).then((res) => {
        if (res.data.code == 200) {
          this.LC = res.data.data;
        }
      });
    },
    // /api/globalapproval
    getPizunInfo(item, page = 1) {
      return Axios({
        url: "/api/report/globalapproval",
        params: {
          ylbm: this.drugname_standard,
          englishname: this.drugname_standard,
          // company: this.company_standard,
          source: item.key,
          page,
          pageSize: 10,
        },
      });
    },
    getInitState() {
      const requests = this.pzhead.map((item) => {
        // item.loading = true;
        return this.getPizunInfo(item);
      });
      Axios.all(requests).then(
        Axios.spread((...res) => {
          res.forEach((resp, index) => {
            if (resp.data.code == 200) {
              this.pzhead[index].state = resp.data.data.res;
            }
          });
          if (this.pzhead.every(t => t.state.length == 0)) {
            this.$root.$emit("hide-page", "上市批准");
          }
        })
      )
      .finally(() => {
          this.$root.$emit("load-page", "上市批准");
      })
      ;
    },
  },
  mounted() {
    this.getPizun();
    this.getInitState();
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
.part-sub-title {
  font-size: 16px;
  color: #333;
  margin-top: 10px;
  margin-bottom: 10px;
  border-left: 2px solid #002fa7;
  line-height: 1;
  padding-left: 5px;
  margin-left: 10px;
}
.table {
  position: relative;
  padding-left: 10px;
  min-height: 50px;
  table {
    width: 100%;
    border: 1px solid #ebeef5;
    border-collapse: collapse;
    border-spacing: 0;
    th {
      height: 30px;
      background-color: #ebeef5;
      font-size: 12px;
    }
    td {
      padding: 5px;
      border: 1px solid #ebeef5;
      word-break: break-all;
      font-size: 12px;
      & > div {
        font-size: 12px;
        // overflow: hidden;
        // text-overflow: ellipsis;
        // display: -webkit-box;
        // -webkit-line-clamp: 2;
        // -webkit-box-orient: vertical;
      }
    }
  }
}
.timeline {
  overflow: auto;
  position: relative;
}
.lichen {
  background-color: #fafbfd;
  border-radius: 3px;
  height: 155px;
  display: flex;
  width: fit-content;
  padding: 9px 120px;
  box-sizing: border-box;
  position: relative;
  min-width: 100%;
  .line {
    width: 100%;
    height: 1px;
    background-color: #dcdfe6;
    position: absolute;
    top: 50%;
    left: 0;
    z-index: 0;
  }
  .lc-item {
    width: 163px;
    align-self: flex-start;
    display: flex;
    flex-direction: column;
    position: relative;
    z-index: 1;
    user-select: none;
    cursor: pointer;
    &.down {
      align-self: flex-end;
      flex-direction: column-reverse;
    }
    &:hover {
      .dot-ll {
        border-color: #002fa7;
        background-color: #002fa7;
      }
    }
  }
  .flex {
    display: flex;
  }
  .flex-ac {
    align-items: center;
  }
  .dot-sm {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background-color: #002fa7;
    transform: translateX(-50%);
  }
  .dot-line {
    height: 27px;
    border-left: dotted 1px #ebeef5;
  }
  .dot-ll {
    width: 10px;
    height: 10px;
    border: 1px solid #ebeef5;
    box-sizing: border-box;
    border-radius: 50%;
    transform: translateX(-50%);
    background-color: #fff;
  }
}
</style>