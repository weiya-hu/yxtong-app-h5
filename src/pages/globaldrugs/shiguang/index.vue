<template>
  <div class="wrapper" >
    <div class="detail-header">
      <div class="header-left">
        <h1>全球药物-药品时光轴</h1>
        <span class="name">{{ $route.query.zwname }} {{ $route.query.drugname_standard }}</span>
      </div>
      <div class="header-right">
        <span class="breadcrumb">当前位置：<a :href="'/globaldrugs/list'">全球药物</a> > <font color="#002FA7">药品时光轴</font>
        </span>
      </div>
    </div>
    <div class="container" :style="{ 'min-height': minHeightComp }">
      <div class="container-hd">
        <div class="tab" ref="tab">
          <a class="active" @click="filterdata(0, 0)">全部</a>
          <em>|</em>
          <a @click="filterdata(1, 1)">临床相关</a>
          <em>|</em>
          <a @click="filterdata(2, 2)">注册申请</a>
          <em>|</em>
          <a @click="filterdata(3, 3)">批准上市</a>
          <em>|</em>
          <a @click="filterdata(4, 4)">其他</a>
        </div>
      </div>
      <div class="sglst" style=""
      v-waiting="isLoading"
      >
        <div>
          <div class="row" v-for="(row, index) in sglst" :key="index">
            <div class="item" v-for="(item, index2) in row" :key="index2">
              <div class="dot" :class="item.highlight ? 'highlight' : ''"></div>
              <div class="con">
                <div class="hd">
                  <div class="time strong" v-text="item.date"></div>
                  <div class="gd" v-text="item.sourceleixing"></div>
                </div>
                <div class="bd" v-if="item.type == 'news'">
                  <a class="text" v-text="item.title" :href="item.sourceurl" target="_blank"></a>
                </div>
                <div class="bd" v-if="item.type == 'result'">
                  <div class="control">
                    <label v-if="item.db_type == '全球临床' || item.db_type == '中国临床'">临床进度：</label>
                    <label v-else v-text="item.phase"></label>
                    <div class="maxrow3">
                      <a v-if="item.phase == '撤市'" class="link_blue strong" v-text="item.drugid"></a>
                      <a v-else-if="item.db_type != '全球临床' && item.db_type != '中国临床'" class="link_blue strong"
                        :class="item.link.id ? 'underline' : ''" @click="goDetail(item)" v-text="item.drugid"></a>
                        <a v-else class="link_blue strong" :class="item.link.id ? 'underline' : ''" @click="goDetail(item)"
                          v-text="item.phase + ' ' + item.status"></a>
                        <font color="#9AA4B8" v-if="item.countries" v-text="'（' + item.countries + '）'"></font>
                    </div>
                  </div>
                  <div class="control" v-if="item.indication">
                    <label>适应症：</label>
                    <div v-text="item.indication" class="maxrow3"></div>
                  </div>
                </div>
                <div class="ft">
                  <div class="coo_company" title="合作企业"><template v-for="i in item.coo_company">{{ i.name }} </template>
                  </div>
                  <div class="per_company" title="许可单位"><template v-for="i in item.per_company">{{ i.name }} </template>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>


      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import LoadingGif from "@/components/common/globalCom/loading-gif";

export default {
  components: {
    LoadingGif
  },
  data() {
    return {
      //nodata: null,
      isLoading: true,
      tab: 0,
      sglst: [],
      target: ''
    };
  },
  computed: {
    ...mapState({
      showPromtNotice: state => state.showPromtNotice,
    }),
    minHeightComp() {
      return 'calc(100vh - 58px - 48px - ' + (this.showPromtNotice ? '40px' : '10px') + ')'
    }
  },
  watch: {},
  methods: {
    //一维数组转换为二维数组
    arrTrans(num, arr) {
      const iconsArr = [];
      arr.forEach((item, index) => {
        const page = Math.floor(index / num);
        if (!iconsArr[page]) {
          iconsArr[page] = [];
        }
        iconsArr[page].push(item);
      });
      return iconsArr;
    },
    //筛选数据
    filterdata(index, type) {
      let dom = this.$refs.tab;
      $(dom).children('a').eq(index).addClass('active').siblings('a').removeClass('active');
      this.dataGet(type);
    },
    // drugid点击跳转到对应数据库详情页
    goDetail(row) {
      console.log(row)
      let urlObj = {
        path: "",
      };

      if ((row.db_type.indexOf('注册') != -1 || row.db_type.indexOf('临床申请') != -1) && row.link.id) {
        urlObj.path = `/zhuce/${row.link.id}`;
      } else if (row.db_type == '全球临床' && row.link.id) {
        urlObj.path = `/clinical/${row.link.id}`;
      } else if (row.db_type == '中国临床' && row.link.id) {
        urlObj.path = `/linchuangshiyan/${row.link.id}`;
      } else if (row.link.id) {
        if (row.countries === "中国") {
          // tip 1国产
          if (row.link.tp == 1) {
            urlObj.path = `/cfdadrug/detail/${row.link.id}`;
            urlObj.query = {
              pizhunwenhao: row.link.pizhunwenhao,
            };
          } else {
            urlObj.path = `/cfdadrug/jkdetail/${row.link.id}`;
            urlObj.query = {
              pizhunwenhao: row.link.pizhunwenhao,
            };
          }
        } else if (row.countries === "美国") {
          //console.log(row.link)
          urlObj.path = `/fdadrugnew/${row.link.id}`;
        } else if (row.countries === "欧盟EMA") {
          urlObj.path = `/epyp/emadetail/${row.link.id}`;
        } else if (row.countries === "欧盟HMA") {
          urlObj.path = `/epyp/hmadetail/${row.link.id}`;
        } else if (row.countries === "日本") {
          urlObj.path = `/pmda/${row.link.id}`;
        } else if (row.countries === "英国") {
          urlObj.path = `/uk/${row.link.id}`;
        } else if (row.countries === "中国台湾") {
          urlObj.path = `/taiwan/${row.link.id}`;
        } else if (row.countries === "德国") {
          urlObj.path = `/germany/${row.link.id}`;
        } else if (row.countries === "加拿大") {
          urlObj.path = `/canada/${row.link.id}`;
        } else if (row.countries === "法国") {
          urlObj.path = `/france/${row.link.id}`;
        } else if (row.countries === "印度") {
          urlObj.path = `/india/${row.link.id}`;
        } else if (row.countries === "韩国") {
          urlObj.path = `/korean/${row.link.id}`;
        }
      }
      if (urlObj.path) {
        let routeData = this.$router.resolve(urlObj);
        window.open(routeData.href, "_blank");
      }
      //console.log(row);
    },
    //获取数据
    dataGet(type) {
      this.isLoading = true;
      const { drugname_standard, company_standard } = this.$route.query;

      window.Axios({
        method: "get",
        url: "/api/globaldrugs/drugTimeline",
        params: {
          drugname_standard, // 药品标准名称
          company_standard, // 企业标准名称
          from_detail: 0, // 是否是药品详情请求
          rangetype: type // 0 全部 1临床相关 2注册申请 3批准上市
        },
      })
        .then((res) => {
          if (res.data.code = 200) {
            this.sglst = this.arrTrans(7, res.data.data.list);
            console.log(res.data.data.list)
          }
          //this.nodata = false;
          this.isLoading = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  created() {
  },
  mounted() {
    Store.dispatch("Globaldrugs/getBaseInfo").then(() => {
      this.vueTogglePmsTooltip();
      document.title = this.$store.state.Globaldrugs.allBase.dbname+"-药品时光轴";
    });
    this.target = this.$route.query.drugname_standard
    this.dataGet(0)
  },
};
</script>

<style lang="less" scoped>
.wrapper {
  padding: 0 10px;
}

.wrapper * {
  box-sizing: border-box;
}

.detail-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-left {}

.header-left h1 {
  display: inline-block;
  font-size: 20px;
  font-weight: bold;
  color: #333;
  line-height: 30px;
  margin-right: 5px;
}

.header-left .name {
  display: inline-block;
  border-radius: 3px;
  border: 1px solid #DCDFE6;
  font-size: 13px;
  line-height: 28px;
  padding: 0 10px 0 10px;
  background: #FAFBFD;
}

.header-left .name em {
  display: inline-block;
  width: 18px;
  height: 18px;
  line-height: 18px;
  vertical-align: -5px;
  margin-left: 15px;
  background: url(/static/imgs/globaldrugs/shiguang/headtag.png);
}

.header-right {
  text-align: right;
}

.header-right .breadcrumb {
  font-size: 12px;
}

.container {
  background-color: #fff;
  padding: 10px;
}

.container-hd {
  border-bottom: 1px solid #EBEEF5;
}

.tab {
  padding: 7px 0;
  line-height: 16px;
}

.tab>a {
  position: relative;
  color: #333;
  font-size: 14px;
}

.tab>a.active {
  font-weight: 700;
  text-decoration: none;
}

.tab>a.active:after {
  content: '';
  position: absolute;
  bottom: -9px;
  left: 0;
  width: 100%;
  height: 3px;
  border-radius: 2px;
  background-color: #002FA7;
}

.tab>em {
  font-style: normal;
  color: #EBEEF5;
  font-size: 16px;
  margin: 0 10px;
}

.sglst {
  width: 100%;
  padding: 10px 0;
  box-sizing: border-box;
  overflow: hidden;
  min-height: calc(100vh - 147px);
}

.sglst * {
  box-sizing: border-box;
}

.sglst .row {
  clear: both;
  position: relative;
  padding: 0 10%;
  position: relative;
  height: 350px;
}

.sglst .item {
  position: relative;
  width: 14.2857%;
  float: left;
  height: 350px;
}

.sglst .item {
  height: 8px;
  background: #002fa7;
  top: 175px;
}

.sglst .item .dot {
  z-index: 11;
  position: absolute;
  left: 50%;
  top: -6px;
  width: 18px;
  height: 18px;
  border: 1px solid #dbdfe6;
  border-radius: 50%;
  background: #fff;
  margin-left: -8px;
}

.sglst .item .dot:after {
  z-index: 12;
  content: '';
  position: absolute;
  left: 50%;
  top: -6px;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  margin: 10px 0 0 -5px;
  background: #dbdfe6;
}

.sglst .item .dot.highlight {
  border-color: #fda814;
}

.sglst .item .dot.highlight:after {
  background: #fda814;
}

.sglst .item .con {
  position: absolute;
  z-index: 10;
  width: 180%;
  left: -40%;
  text-align: left;
  padding: 10px 8px;
  background: #FFFFFF;
  box-shadow: 0px 1px 10px 0px rgba(0, 47, 167, 0.15);
}

.sglst .item .con:before {
  content: '';
  position: absolute;
  width: 0px;
  height: 0px;
  border: 8px solid transparent;
  left: 50%;
  margin-left: -7px;
}

.sglst .item:nth-child(even) .con:before {
  bottom: -14px;
  border-bottom-color: transparent;
  border-top-color: #fff;
}

.sglst .item:nth-child(odd) .con:before {
  top: -14px;
  border-bottom-color: #fff;
  position: absolute;
}

.sglst .item:nth-child(even) .con {
  bottom: 0;
  margin-bottom: 25px;
}

.sglst .item:nth-child(odd) .con {
  top: 0;
  margin-top: 25px;
}

.sglst .row:nth-child(even) .item {
  float: right;
}

.sglst .row:nth-child(even):before {
  content: " ";
  position: absolute;
  top: 50%;
  left: 3%;
  width: 7%;
  height: 342px;
  border-style: solid;
  border-width: 8px;
  border-color: #002fa7 transparent transparent #002fa7;
  border-radius: 28px 0 0 28px;
}

.sglst .row:nth-child(odd):before {
  content: " ";
  position: absolute;
  bottom: 50%;
  margin-bottom: -8px;
  left: 3%;
  width: 7%;
  height: 28px;
  border-style: solid;
  border-width: 8px;
  border-radius: 0 0 0 28px;
  border-color: transparent transparent #002fa7 #002fa7;
}

.sglst .row:nth-child(odd):after {
  content: " ";
  position: absolute;
  top: 50%;
  right: 3%;
  width: 7%;
  height: 342px;
  border-style: solid;
  border-width: 8px;
  border-color: #002fa7 #002fa7 transparent transparent;
  border-radius: 0 28px 28px 0;
}

.sglst .row:nth-child(even):after {
  content: " ";
  position: absolute;
  bottom: 50%;
  margin-bottom: -8px;
  right: 3%;
  width: 7%;
  height: 28px;
  border-style: solid;
  border-width: 8px;
  border-radius: 0 0 28px 0;
  border-color: transparent #002fa7 #002fa7 transparent;
}

.sglst .row:nth-child(1):before {
  border-radius: 0;
  border-left: none;
}

.sglst .row:nth-last-child(1):before {
  border-left-color: transparent;
}

.sglst .row:nth-last-child(1):before {
  border-left-color: transparent;
}

.sglst .row:nth-last-child(1):after {
  border-right-color: transparent;
}

.sglst .row:nth-last-child(1):nth-child(even):before {
  border-top-color: transparent;
}

.sglst .row:nth-last-child(1):nth-child(odd):after {
  border-top-color: transparent;
}

.sglst .row:nth-last-child(1):nth-child(even) .item:nth-last-child(1):after {
  content: '';
  position: absolute;
  left: -18px;
  top: -6px;
  width: 0px;
  height: 0px;
  border: 10px solid transparent;
  border-right-color: #002fa7;
}

.sglst .row:nth-last-child(1):nth-child(odd) .item:nth-last-child(1):after {
  content: '';
  position: absolute;
  right: -18px;
  top: -6px;
  width: 0px;
  height: 0px;
  border: 10px solid transparent;
  border-left-color: #002fa7;
}

.sglst .item .con .hd {
  display: flex;
  justify-content: space-between;
  line-height: 16px;
  margin-bottom: 12px;
}

.sglst .item .con .time {
  font-size: 14px;
  color: #333;
}

.sglst .item .con .link_blue {
  color: #002FA7;
  text-decoration: none;
  cursor: default;
}

.sglst .item .con .link_blue.underline:hover {
  text-decoration: underline;
  cursor: pointer;
}

.sglst .item .con .strong {
  font-weight: 700
}

.sglst .item .con .gd {
  display: block;
  font-size: 12px;
  color: #9AA4B8;
}

.sglst .item .con .maxrow3 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
  line-height: 1.2;
}

.sglst .item .con .ft {
  font-size: 12px;
  margin-top: 10px;
}

.sglst .item .con .ft .coo_company {
  margin-right: 10px;
}

.sglst .item .con .ft div {
  padding-left: 19px;
  line-height: 12px;
  margin-bottom: 5px;
  background-repeat: no-repeat;
}

.sglst .item .con .ft .coo_company {
  background-image: url(/static/imgs/globaldrugs/shiguang/coo_company.png);
}

.sglst .item .con .ft .per_company {
  background-image: url(/static/imgs/globaldrugs/shiguang/per_company.png);
}

.sglst .item .con .text {
  display: block;
  font-size: 13px;
  line-height: 20px;
  height: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.sglst .item .con .control {
  line-height: 16px;
  font-size: 12px;
  margin-bottom: 4px;
  display: flex;
}

.sglst .item .con .control>label {
  min-width: 120px;
  min-width: 62px;
}
</style>
