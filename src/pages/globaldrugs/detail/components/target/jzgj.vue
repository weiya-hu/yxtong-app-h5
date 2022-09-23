<template>
  <div class="target-jzgj">
    <div class="sub-section" v-if="show1">
      <!-- <div class="content-input">
        <span>靶点名称：</span>
        <el-autocomplete v-model="target" :fetch-suggestions="querySearchAsync2" :popper-append-to-body="false"
          clearable ref="popoverAutoInput" @select="handleSelect2">
          <template slot-scope="{ item }">
            <div style="
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                  " :title="item.value">
              {{ item.value }}
            </div>
          </template>
        </el-autocomplete>
      </div> -->
      <div class="sub-section-title">
        <span>药品进度：</span>
      </div>
      <div class="sub-section-content" v-waiting="jd_loading">
        <el-table class="ypjd-table" ref="ypjd" :span-method="SpanMethod" :data="ywjd" style="width: 100%"
          :show-header="ypjd_show_header">
          <el-table-column align="center" width="90" label="药品类型" prop="cate">
            <template slot="header">
              <TableHeadFilter name="药品类型" :offset="-12" :props="{ label: 'label' }" :options="
                (ywjd_filtres['cate'] || []).map((t) => ({
                  label: t,
                }))
              " :saved_condition="ywjd_saved_condition" prop="cate" @confirm="ywjd_confirm('cate', $event)"
                @cancel="ywjd_cancel('cate')">
              </TableHeadFilter>
            </template>
          </el-table-column>
          <el-table-column align="center" min-width="140" label="药品名称" prop="drugname_standard">
            <template slot="header">
              <TableHeadFilter name="药品名称" :offset="-12" :props="{ label: 'label' }" :options="
                (ywjd_filtres['drugname'] || []).map((t) => ({
                  label: t,
                }))
              " :saved_condition="ywjd_saved_condition" prop="drugname" @confirm="ywjd_confirm('drugname', $event)"
                @cancel="ywjd_cancel('drugname')">
              </TableHeadFilter>
            </template>
            <template slot-scope="scope">
              <div>
                <el-tooltip class="overflow" style="width: 100%;" effect="light" placement="right">
                  <div slot="content">
                    <div v-if="scope.row.cate != '联合用药'" class="cl-blue" style="color: #002fa7;cursor: pointer;"
                      @click="linkDrugDetail(scope.row.hash_drugname_standard, scope.row.hash_company_standard)">
                      {{ scope.row.drugname_standard }}
                    </div>
                    <div style="color: #002fa7;" v-else>
                      {{ scope.row.drugname_standard }}
                    </div>
                  </div>
                  <div v-if="scope.row.cate != '联合用药'" class="cl-blue" style="color: #002fa7;cursor: pointer;"
                    @click="linkDrugDetail(scope.row.hash_drugname_standard, scope.row.hash_company_standard)">
                    {{ scope.row.drugname_standard }}
                  </div>
                  <div v-else>
                    {{ scope.row.drugname_standard }}
                  </div>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column min-width="600">
            <template slot="header">
              <div class="cus-head">
                <div>临床前</div>
                <div>临床申请</div>
                <div>临床Ⅰ期</div>
                <div>临床Ⅱ期</div>
                <div>临床Ⅲ期</div>
                <div>注册申请</div>
                <div>批准上市</div>
              </div>
            </template>
            <template slot-scope="{ row }">
              <div class="line" v-if="findEnumIndex(row.worldstatus.status) >= 0">
                <div v-for="(c, i) in global_line_map" :key="c.bg" :style="{
                  backgroundColor: c,
                  left: -i * 3 + '%',
                  zIndex: 10 - i,
                }" class="line-item" v-if="findEnumIndex(row.worldstatus.status) >= i">
                  <span :class="[
                    'line-item_label',
                    findEnumIndex(row.worldstatus.status) < 2 ? 'dark' : '',
                  ]" :style="{
  color: (i <= 2 ? '#35384a' : '#FFF')
}" v-if="findEnumIndex(row.worldstatus.status) == i" style="font-size: 12px">{{
    row.worldstatus.date
}}</span>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" min-width="140" label="适应症" prop="indication">
            <template slot="header">
              <TableHeadFilter name="适应症" :offset="-12" :props="{ label: 'label' }" :options="
                (ywjd_filtres['indication'] || []).map((t) => ({
                  label: t,
                }))
              " :saved_condition="ywjd_saved_condition" prop="indication" @confirm="ywjd_confirm('indication', $event)"
                @cancel="ywjd_cancel('indication')">
              </TableHeadFilter>
            </template>
            <template slot-scope="{ row }">
              <div>
                <el-tooltip class="overflow" style="width: 100%;" effect="light" placement="left">
                  <div slot="content">
                    <div v-html="row.indication"></div>
                  </div>
                  <div class="overflow" v-html="row.indication"></div>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" min-width="140" label="研发企业">
            <template slot="header">
              <TableHeadFilter name="研发企业" :offset="-12" :props="{ label: 'label' }" :options="
                (ywjd_filtres['company'] || []).map((t) => ({
                  label: t,
                }))
              " :saved_condition="ywjd_saved_condition" prop="company" @confirm="ywjd_confirm('company', $event)"
                @cancel="ywjd_cancel('company')">
              </TableHeadFilter>
            </template>
            <template slot-scope="{ row }">
              <div>
                <el-tooltip class="overflow" style="width: 100%;" effect="light" placement="right">
                  <div slot="content">
                    <div v-for="(t, i) in row.company_standard" :key="i">
                      <div v-if="t.have_info" class="cl-blue" style="color: #002fa7;"
                        @click="linkCompanyDetail(row.hash_company_standard)">
                        {{ t.name }}
                      </div>
                      <span v-else>{{ t.name }}</span>
                    </div>
                  </div>
                  <div class="overflow" v-for="(t, i) in row.company_standard" :key="i">
                    <div v-if="t.have_info" class="cl-blue" style="color: #002fa7;"
                      @click="linkCompanyDetail(row.hash_company_standard)">
                      {{ t.name }}
                    </div>
                    <span v-else>{{ t.name }}</span>
                  </div>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination" style="border-left: 0 !important;width: calc(100% - 1px);">
          <el-pagination v-if="ypjd_total > 0 && ypjd_total > jzgjypjd.pageSize"
            @current-change="ypjdhandleCurrentChange" :current-page="jzgjypjd.page" :page-size="jzgjypjd.pageSize"
            layout="total, prev, next" hide-on-single-page :total="ypjd_total">
          </el-pagination>
        </div>
      </div>
    </div>
    <div class="sub-section" v-if="show2">
      <div class="sub-section-title">
        <span>药品分布：</span>
      </div>
      <div class="sub-section-content" v-waiting="fb_loading">
        <div class="charts">
          <div class="chart"
            style="margin-right: 10px;display: flex;justify-content: center;align-items: end;flex-direction: column;">
            <div style="width: 100%;height: 100%;" id="phase-bar-globaldrugs" ref="ypfbdata"></div>
            <div class="tips-box">
              <div class="tips">*其他：包括停止、暂停、撤市、无研发进展报道</div>
            </div>
          </div>
          <div class="chart" id="map-globaldrugs"></div>
          <div class="map-table">
            <el-table :data="formatMapData" class="custom-table">
              <el-table-column v-for="(item, ix) in qyHead" align="center" :prop="item.prop" :key="ix"
                :label="item.label">
                <template slot-scope="scope">
                  <span v-if="item.prop == 'name'" class="underline-span"
                    @click="nextClick({ name: scope.row.name }, item.prop)">{{
                        scope.row[item.prop]
                    }}</span>
                  <span v-else>{{
                      scope.row[item.prop]
                  }}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>

    <div class="sub-section" v-if="show3">
      <div class="sub-section-title">
        <span>中国申报格局：</span>
        <!-- <span style="color: #9aa4b8">({{ ypz_count }})</span>: -->
      </div>
      <div class="sub-section-content" v-waiting="syzsbgjLoading">
        <!-- 中国申报格局数字列表 -->
        <el-table class="sbbj-table" :data="indicationNumData" border fixed>
          <el-table-column v-for="(item, index) in indicationNumThead" :prop="item.prop" :key="index"
            :min-width="item.width" :label="item.label" header-align="center" align="center">
            <!-- 自定义表头 -->
            <template slot="header" slot-scope="scope">
              <div style="line-height: 1;">
                <TableHeadFilter v-if="item.prop === 'drugname'" name="药品名称" :offset="-12" :props="{ label: 'label' }"
                  :options="
                    (zgsbbj_filters['drugname'] || []).map((t) => ({ label: t }))
                  " @confirm="zgsbbj_confirm" :saved_condition="zgsbbj_saved_condition" @cancel="zgsbbj_cancel"
                  prop="drugname">
                </TableHeadFilter>
                <span v-else>{{ item.label }}</span>
              </div>
            </template>
            <template slot-scope="scope">
              <div :title="scope.row[item.prop]">
                <div v-if="
                  [
                    'declare_num',
                    'declare_linchuang',
                    'approval_linchuang',
                    'experimentation',
                    'approval_listed',
                    'consistency_declare',
                    'consistency_approval'
                  ].includes(item.prop)
                " @click="linkList(scope.row, scope.row[item.prop], item.prop)" class="scope-bg" :style="{
  background: getIndicationBg(scope.row[item.prop]),
  color: getIndicationColor(scope.row[item.prop]),
  cursor: scope.row[item.prop] > 0 ? 'pointer' : ''
}">
                  {{
                      scope.row[item.prop] > 0 ? scope.row[item.prop] : ""
                  }}
                </div>
                <div v-else-if="item.prop == 'drugname'" class="scope-bg" style="padding-left: 14px">
                  <p>{{ scope.row.zwname }}{{ scope.row.drugname_standard }}</p>
                  <p>（{{ scope.row.phase.name }}）</p>
                </div>
                <div v-else class="scope-bg" style="padding-left: 14px">
                  {{ scope.row[item.prop] }}
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination" style="border-left: none !important;">
          <el-pagination v-if="indicationInitNumTotal > 0 && indicationInitNumTotal > syzzgsbbjObj.pageSize"
            @current-change="syzbjHandleCurrentChange" :current-page="syzzgsbbjObj.page"
            :page-size="syzzgsbbjObj.pageSize" layout="total, prev, next" hide-on-single-page
            :total="indicationInitNumTotal">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TableHeadFilter from "@/components/common/globaldrugs/table-head-filter";
import "../../../../../../node_modules/echarts/map/js/world.js"; // 引入世界地图数据
import stateMap from './stateMap'

const defaultFiled = [{
  prop: 'drugname',
  label: "药品名称",
  width: 200,
  checked: true
}, {
  prop: 'declare_num',
  label: "申报企业",
  width: 100,
  checked: true
}, {
  prop: 'declare_linchuang',
  label: "申报临床企业",
  width: 100,
  checked: true
}, {
  prop: 'approval_linchuang',
  label: "批准临床企业",
  width: 100,
  checked: true
}, {
  prop: 'experimentation',
  label: "临床试验申办单位",
  width: 100,
  checked: true
}, {
  prop: 'approval_listed',
  label: "批准上市企业",
  width: 100,
  checked: true
}, {
  prop: 'consistency_declare',
  label: "一致性评价申报企业",
  width: 100,
  checked: true
}, {
  prop: 'consistency_approval',
  label: "一致性评价通过企业",
  width: 100,
  checked: true
}]

// 竞争格局
export default {
  props: {
    base: {
      type: Object
    }
  },
  components: {
    stateMap,
    TableHeadFilter
  },
  data() {
    return {
      ypjd_show_header: true,
      ywjd_saved_condition: "",
      qyHead: [
        {
          prop: "name",
          label: "国家或地区",
          width: 50,
        },
        {
          prop: "value",
          label: "数量",
          width: 50,
        }
      ],
      formatMapData: [],
      syzsbgjLoading: false,
      avg: 0,
      ywjd: [],
      ywjd_span_map: {},
      ywjd_page: 1,
      ypjd_total: 0,
      ywfb: [],
      jzgjypjd: {
        order: null, // 排序
        page: 1, // 页数
        pageSize: 10 // 每页条数
      },
      syzzgsbbjObj: {
        order: null, // 排序
        page: 1, // 页数
        pageSize: 10 // 每页条数
      },
      YPFB: null,
      jd_loading: false,
      fb_loading: false,
      global_line_map: [
        "#E5EFFC",
        "#C6DAFC",
        "#A2C4FE",
        "#82AEFD",
        "#4680F7",
        "#2B68F6",
        "#002FA7",
      ],
      colorData: [
        { color: "#545B6D", bg: "#FAFBFD" },
        { color: "#545B6D", bg: "#E4EAFA" },
        { color: "#FFF", bg: "#C8D6F9" },
        { color: "#FFF", bg: "#ABC2F6" },
        { color: "#FFF", bg: "#92ADF1" },
        { color: "#FFF", bg: "#648AEC" },
        { color: "#FFF", bg: "#4A78E7" },
        { color: "#FFF", bg: "#3556B9" },
      ], // 中国申报格局第一个列表的背景颜色数组
      indicationNumSize: 10, // 默认展示10条数据
      indicationNumMax: 0,
      indicationInitNumTotal: 0,
      indicationNumThead: defaultFiled, //  中国申报格局第一个列表的表头
      indicationStatusSize: 10, // 默认展示10条数据
      indicationNumData: [], // 中国申报格局第一个列表的数量数据
      indicationInitNumData: [], // 中国申报格局第一个列表所有的数据，用来做前端翻页
      ypfb_bar: {
        echarts: null,
        xAxis1_data: [],
        series1_data: [],
        xAxis2_data: [],
        series2_data: []
      },
      ypfb_map: {
        echarts: null,
        xAxis1_data: [],
        series1_data: [],
        xAxis2_data: [],
        series2_data: []
      },
      nameMap: {
        Afghanistan: "阿富汗",
        Singapore: "新加坡",
        Angola: "安哥拉",
        Albania: "阿尔巴尼亚",
        "United Arab Emirates": "阿联酋",
        Argentina: "阿根廷",
        Armenia: "亚美尼亚",
        "French Southern and Antarctic Lands": "法属南半球和南极领地",
        Australia: "澳大利亚",
        Austria: "奥地利",
        Azerbaijan: "阿塞拜疆",
        Burundi: "布隆迪",
        Belgium: "比利时",
        Benin: "贝宁",
        "Burkina Faso": "布基纳法索",
        Bangladesh: "孟加拉国",
        Bulgaria: "保加利亚",
        "The Bahamas": "巴哈马",
        "Bosnia and Herzegovina": "波斯尼亚和黑塞哥维那",
        Belarus: "白俄罗斯",
        Belize: "伯利兹",
        Bermuda: "百慕大",
        Bolivia: "玻利维亚",
        Brazil: "巴西",
        Brunei: "文莱",
        Bhutan: "不丹",
        Botswana: "博茨瓦纳",
        "Central African Republic": "中非共和国",
        Canada: "加拿大",
        Switzerland: "瑞士",
        Chile: "智利",
        China: "中国（总）",
        "Ivory Coast": "象牙海岸",
        Cameroon: "喀麦隆",
        "Democratic Republic of the Congo": "刚果民主共和国",
        "Republic of the Congo": "刚果共和国",
        Colombia: "哥伦比亚",
        "Costa Rica": "哥斯达黎加",
        Cuba: "古巴",
        "Northern Cyprus": "北塞浦路斯",
        Cyprus: "塞浦路斯",
        "Czech Republic": "捷克共和国",
        Germany: "德国",
        Djibouti: "吉布提",
        Denmark: "丹麦",
        "Dominican Republic": "多明尼加共和国",
        Algeria: "阿尔及利亚",
        Ecuador: "厄瓜多尔",
        Egypt: "埃及",
        Eritrea: "厄立特里亚",
        Spain: "西班牙",
        Estonia: "爱沙尼亚",
        Ethiopia: "埃塞俄比亚",
        Finland: "芬兰",
        Fiji: "斐",
        "Falkland Islands": "福克兰群岛",
        France: "法国",
        Gabon: "加蓬",
        "United Kingdom": "英国",
        Georgia: "格鲁吉亚",
        Ghana: "加纳",
        Guinea: "几内亚",
        Gambia: "冈比亚",
        "Guinea Bissau": "几内亚比绍",
        Greece: "希腊",
        Greenland: "格陵兰",
        Guatemala: "危地马拉",
        "French Guiana": "法属圭亚那",
        Guyana: "圭亚那",
        Honduras: "洪都拉斯",
        Croatia: "克罗地亚",
        Haiti: "海地",
        Hungary: "匈牙利",
        Indonesia: "印度尼西亚",
        India: "印度",
        Ireland: "爱尔兰",
        Iran: "伊朗",
        Iraq: "伊拉克",
        Iceland: "冰岛",
        Israel: "以色列",
        Italy: "意大利",
        Jamaica: "牙买加",
        Jordan: "约旦",
        Japan: "日本",
        Kazakhstan: "哈萨克斯坦",
        Kenya: "肯尼亚",
        Kyrgyzstan: "吉尔吉斯斯坦",
        Cambodia: "柬埔寨",
        Kosovo: "科索沃",
        Kuwait: "科威特",
        Laos: "老挝",
        Lebanon: "黎巴嫩",
        Liberia: "利比里亚",
        Libya: "利比亚",
        "Sri Lanka": "斯里兰卡",
        Lesotho: "莱索托",
        Lithuania: "立陶宛",
        Luxembourg: "卢森堡",
        Latvia: "拉脱维亚",
        Morocco: "摩洛哥",
        Moldova: "摩尔多瓦",
        Madagascar: "马达加斯加",
        Mexico: "墨西哥",
        Macedonia: "马其顿",
        Mali: "马里",
        Myanmar: "缅甸",
        Montenegro: "黑山",
        Mongolia: "蒙古",
        Mozambique: "莫桑比克",
        Mauritania: "毛里塔尼亚",
        Malawi: "马拉维",
        Malaysia: "马来西亚",
        Namibia: "纳米比亚",
        "New Caledonia": "新喀里多尼亚",
        Niger: "尼日尔",
        Nigeria: "尼日利亚",
        Nicaragua: "尼加拉瓜",
        Netherlands: "荷兰",
        Norway: "挪威",
        Nepal: "尼泊尔",
        "New Zealand": "新西兰",
        Oman: "阿曼",
        Pakistan: "巴基斯坦",
        Panama: "巴拿马",
        Peru: "秘鲁",
        Philippines: "菲律宾",
        "Papua New Guinea": "巴布亚新几内亚",
        Poland: "波兰",
        "Puerto Rico": "波多黎各",
        "North Korea": "北朝鲜",
        Portugal: "葡萄牙",
        Paraguay: "巴拉圭",
        Qatar: "卡塔尔",
        Romania: "罗马尼亚",
        Russia: "俄罗斯",
        Rwanda: "卢旺达",
        "Western Sahara": "西撒哈拉",
        "Saudi Arabia": "沙特阿拉伯",
        Sudan: "苏丹",
        "South Sudan": "南苏丹",
        Senegal: "塞内加尔",
        "Solomon Islands": "所罗门群岛",
        "Sierra Leone": "塞拉利昂",
        "El Salvador": "萨尔瓦多",
        Somaliland: "索马里兰",
        Somalia: "索马里",
        "Republic of Serbia": "塞尔维亚",
        Suriname: "苏里南",
        Slovakia: "斯洛伐克",
        Slovenia: "斯洛文尼亚",
        Sweden: "瑞典",
        Swaziland: "斯威士兰",
        Syria: "叙利亚",
        Chad: "乍得",
        Togo: "多哥",
        Thailand: "泰国",
        Tajikistan: "塔吉克斯坦",
        Turkmenistan: "土库曼斯坦",
        "East Timor": "东帝汶",
        "Trinidad and Tobago": "特里尼达和多巴哥",
        Tunisia: "突尼斯",
        Turkey: "土耳其",
        "United Republic of Tanzania": "坦桑尼亚",
        Uganda: "乌干达",
        Ukraine: "乌克兰",
        Uruguay: "乌拉圭",
        "United States": "美国",
        Uzbekistan: "乌兹别克斯坦",
        Venezuela: "委内瑞拉",
        Vietnam: "越南",
        Vanuatu: "瓦努阿图",
        "West Bank": "西岸",
        Yemen: "也门",
        "South Africa": "南非",
        Zambia: "赞比亚",
        Korea: "韩国",
        Tanzania: "坦桑尼亚",
        Zimbabwe: "津巴布韦",
        Congo: "刚果",
        "Central African Rep.": "中非",
        Serbia: "塞尔维亚",
        "Bosnia and Herz.": "波黑",
        "Czech Rep.": "捷克",
        "W. Sahara": "西撒哈拉",
        "Lao PDR": "老挝",
        "Dem.Rep.Korea": "朝鲜",
        "Falkland Is.": "福克兰群岛",
        "Timor-Leste": "东帝汶",
        "Solomon Is.": "所罗门群岛",
        Palestine: "巴勒斯坦",
        "N. Cyprus": "北塞浦路斯",
        Aland: "奥兰群岛",
        "Fr. S. Antarctic Lands": "法属南半球和南极陆地",
        Mauritius: "毛里求斯",
        Comoros: "科摩罗",
        "Eq. Guinea": "赤道几内亚",
        "Guinea-Bissau": "几内亚比绍",
        "Dominican Rep.": "多米尼加",
        "Saint Lucia": "圣卢西亚",
        Dominica: "多米尼克",
        "Antigua and Barb.": "安提瓜和巴布达",
        "U.S. Virgin Is.": "美国原始岛屿",
        Montserrat: "蒙塞拉特",
        Grenada: "格林纳达",
        Barbados: "巴巴多斯",
        Samoa: "萨摩亚",
        Bahamas: "巴哈马",
        "Cayman Is.": "开曼群岛",
        "Faeroe Is.": "法罗群岛",
        "IsIe of Man": "马恩岛",
        Malta: "马耳他共和国",
        Jersey: "泽西",
        "Cape Verde": "佛得角共和国",
        "Turks and Caicos Is.": "特克斯和凯科斯群岛",
        "St. Vin. and Gren.": "圣文森特和格林纳丁斯",
      },
      show1: false,
      show2: false,
      show3: false,
      ywjd_filtres: {}, // 药物进度筛选项
      zgsbbj_filters: {},// 中国申报格局筛选项
      zgsbbj_saved_condition: "",
    };
  },
  watch: {
    base: {
      async handler(val) {
        if (val) {
          this.target = this.base.targets_abbr ? this.base.targets_abbr : this.base.targets;
          await this.getJzgjypjd(this.jzgjypjd.page, 2, this.target);
          await this.getJzgjypfb(2, this.target)
          await this.getIndication(this.syzzgsbbjObj.page, 2, this.target);
        }
      },
      deep: true
    },
    show3(val) {
      if (!this.show1 && !this.show2 && !this.show3) {
        this.$root.$emit('hide-section', '竞争格局')
      }
    }
  },
  methods: {
    // 根据接口获取联动后的 tablefilter 
    setTableFilterOptions() {
      Axios({
        method: "get",
        url: '/api/globaldrugs/scapeDrugProgressLink',
        params: {
          target: (this.base.targets_abbr ? this.base.targets_abbr : this.base.targets),
          filter_condition: this.ywjd_saved_condition
        }
      }).then(res => {
        if (res.data.code == 200) {
          this.ywjd_filtres = res.data.data;
          this.ypjd_show_header = false;
          this.$nextTick(() => {
            this.ypjd_show_header = true;
            this.$refs.ypjd.doLayout();
          })
        }
      })
    },
    zgsbbj_confirm(payload) {
      this.syzsbgjLoading = true;
      let strs = payload.map((t) => t.label).join("ღ");
      if (strs) {
        this.zgsbbj_saved_condition = "drugname=" + strs;
      } else {
        this.zgsbbj_saved_condition = "";
      }
      let params = _.assign(
        {
          target: (this.base.targets_abbr ? this.base.targets_abbr : this.base.targets),
          position: 4,
          filter_condition: this.zgsbbj_saved_condition,
        },
        {
          accesstoken: GETCOOKIEFUN("accesstoken"),
        }
      );
      // if (!strs) {
      //   delete params.filter_condition;
      // }
      let get_ypz = Axios({
        method: "get",
        url: "/api/globaldrugs/scape",
        params,
      });
      get_ypz.then((res) => {
        if (res.data.code == 200 && this.isEmpty(res.data.data)) {
          let data = res.data.data;
          this.indicationNumData = data.list ? data.list : [];
          this.indicationInitNumTotal = data.count ? data.count : false;
        }
        this.syzsbgjLoading = false;
      }).catch(err => {
        console.log(err);
        this.syzsbgjLoading = false;
      })
    },
    zgsbbj_cancel() {
      this.syzsbgjLoading = true;
      let params = _.assign(
        {
          target: (this.base.targets_abbr ? this.base.targets_abbr : this.base.targets),
          position: 4,
        },
        {
          accesstoken: GETCOOKIEFUN("accesstoken"),
        }
      );
      let get_ypz = Axios({
        method: "get",
        url: "/api/globaldrugs/scape",
        params,
      });
      get_ypz.then((res) => {
        if (res.data.code == 200 && this.isEmpty(res.data.data)) {
          let data = res.data.data;
          this.indicationNumData = data.list ? data.list : [];
          this.indicationInitNumTotal = data.count ? data.count : false;
        }
        this.syzsbgjLoading = false;
      }).catch(err => {
        console.log(err);
        this.syzsbgjLoading = false;
      })
    },
    // 转换药物明细筛选字符串为对象
    decode_conditions(str) {
      let cache = str || this.ywjd_saved_condition;
      let condition_array = cache.split(" _and ");
      let condition_obj = {};
      condition_array.forEach((item) => {
        if (item) {
          let [key, value] = item.split("=");
          let val = value ? value.split("ღ") : [];
          if (key && key.replace(/\s/g, "")) {
            condition_obj[key] = val;
          }
        }
      });
      return condition_obj;
    },
    // 转换药物明细筛选对象为字符串
    encode_conditions(obj) {
      let str = "";
      Object.keys(obj).forEach((item, index) => {
        if (index) {
          str += " _and ";
        }
        str += item;
        str += "=";
        str += obj[item].join("ღ");
      });
      return str;
    },
    ywjd_confirm(key, nodes) {
      let old_condition = this.decode_conditions();
      if (nodes.length) {
        old_condition[key] = nodes.map((t) => t.label);
      } else {
        delete old_condition[key];
      }
      console.log(old_condition);
      let new_condition = this.encode_conditions(old_condition);
      console.log(new_condition);

      this.ywjd_saved_condition = new_condition;
      console.log(new_condition);
      this.ypjdhandleCurrentChange(1);
      this.setTableFilterOptions()
    },
    ywjd_cancel(key) {
      let old_condition = this.decode_conditions();
      delete old_condition[key];
      let new_condition = this.encode_conditions(old_condition);
      this.ywjd_saved_condition = new_condition;
      console.log(new_condition);
      this.ypjdhandleCurrentChange(1);
      this.setTableFilterOptions()
    },
    linkDrugDetail(drugname_standard, company_standard) {
      window.ga("send", "event", "button", "click",
        "企业版_全球药物_靶点详情_竞争格局_药品进度_跳转药物详情页");
      window._paq.push([
        "trackEvent",
        "button",
        "click",
        "企业版_全球药物_靶点详情_竞争格局_药品进度_跳转药物详情页"
      ]);
      const { href } = this.$router.resolve({
        path: '/globaldrugs/detail',
        query: {
          drugname_standard,
          company_standard
        }
      })
      window.open(href, "_blank")
    },
    linkCompanyDetail(company_standard) {
      window.ga("send", "event", "button", "click",
        "企业版_全球药物_靶点详情_竞争格局_药品进度_跳转企业管线详情页");
      window._paq.push([
        "trackEvent",
        "button",
        "click",
        "企业版_全球药物_靶点详情_竞争格局_药品进度_跳转企业管线详情页"
      ]);
      const { href } = this.$router.resolve({
        path: '/globaldrugs/companyDetail',
        query: {
          company_standard
        }
      })
      window.open(href, "_blank")
    },
    // 中国申报格局点击数字跳转到药物列表页面
    linkList(col, obj, colName) {
      if (obj > 0) {
        let path = "/zhuce",
          query = {
            ylbm_eq: col.ylbm,
            tabName: 'qiyegroup'
          };
        switch (colName) {
          // 申报企业
          case "declare_num":
            break;
          // 申报临床企业
          case "declare_linchuang":
            query.filter_condition = JSON.stringify({
              linchuang: ['L']
            })
            break;
          // 批准临床企业
          case "approval_linchuang":
            query.filter_condition = JSON.stringify({
              xulie: ['3']
            })
            break;
          // 临床试验申办单位
          case "experimentation":
            path = "/linchuangshiyan";
            delete query.ylbm_eq;
            query.fourth_condition = `ylbm=${col.ylbm}`;
            query.tabs = 3;
            break;
          // 批准上市企业
          case "approval_listed":
            path = "/cfdadrug";
            query.fourth_condition = `ylbm=${col.ylbm}`
            query.tabName = "qiyeNameGroup";
            break;
          // 一致性评价申报企业
          case "consistency_declare":
            query.filter_condition = JSON.stringify({
              yzxpj: ['1']
            })
            break;
          // 一致性评价通过企业
          case "consistency_approval":
            query.hot_condition = JSON.stringify({
              yzxtype: ['通过', '视同通过']
            })
            query.ylbm = col.ylbm;
            delete query.ylbm_eq;
            break;
        }
        let { href } = this.$router.resolve({
          path,
          query
        });
        window.open(href, "_blank");
      }
    },
    // 获取中国申报格局第一个列表的数字颜色
    getIndicationColor(num) {
      // this.colorData[Math.ceil(num/Math.ceil(indicationNumMax/10))-1].color
      if (num == 0 || this.indicationNumMax <= 0) {
        return "";
      } else {
        return this.colorData[
          Math.ceil(num / Math.ceil(this.indicationNumMax / 8)) - 1
        ].color;
      }
    },
    // 获取中国申报格局第一个列表的数字背景色
    getIndicationBg(num) {
      // 规则 指定十个颜色，根据最大数据值分区间进行赋色，比如最大数值为10，则一个数字对应一个颜色，比如最大数字是100，则1-10对应第一个颜色、11-20对应第二个颜色...以此类推
      // this.colorData[Math.ceil(num/Math.ceil(indicationNumMax/10))-1].bg
      if (num == 0 || this.indicationNumMax <= 0) {
        return "";
      } else {
        return this.colorData[
          Math.ceil(num / Math.ceil(this.indicationNumMax / 8)) - 1
        ].bg;
      }
    },
    async syzbjHandleCurrentChange(val) {
      window.ga("send", "event", "button", "click",
        "企业版_全球药物_靶点详情_竞争格局_中国申报格局_翻页_" + val);
      window._paq.push([
        "trackEvent",
        "button",
        "click",
        "企业版_全球药物_靶点详情_竞争格局_中国申报格局_翻页_" + val
      ]);
      this.syzzgsbbjObj.page = val;
      this.getIndication(this.syzzgsbbjObj.page, 2, this.target, true);
    },
    // 获取中国申报格局数据
    getIndication(page, type = 1, target, paged) {
      this.syzsbgjLoading = true;
      this.indicationInitNumData = [];
      this.indicationNumMax = 0;
      this.indicationNumSize = 10;
      this.indicationStatusSize = 10;
      window
        .Axios({
          methods: "get",
          url: "/api/globaldrugs/scape",
          params: _.assign(
            {
              target: type == 1 ? this.target : target,
              position: 4,
              page
            },
            {
              accesstoken: GETCOOKIEFUN("accesstoken"),
            }
          ),
        })
        .then((res) => {
          console.log(res);
          if (res.data && res.data.code === 200 && this.isEmpty(res.data.data)) {
            let data = res.data.data;
            this.show3 = true;
            this.indicationInitNumData = data.list ? data.list : [];
            this.indicationInitNumTotal = data.count ? data.count : false;
            if (this.indicationInitNumData.length <= 0) return;
            this.indicationNumMax = data.max;
            let arr = _.cloneDeep(this.indicationInitNumData);
            this.indicationNumData = arr.splice(0, this.indicationNumSize);
            if (!paged) this.zgsbbj_filters = data ? data.filters : {};
            console.log(this.zgsbbj_filters)
            this.syzsbgjLoading = false;
          } else {
            this.syzsbgjLoading = false;
            this.show3 = false;
          }
        }).catch(err => {
          console.log(err);
          this.show3 = false;
          this.syzsbgjLoading = false;
        })
        .finally(() => {
          this.syzsbgjLoading = false;
        });
    },
    SpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == 0) {
        // 第一列
        if (rowIndex == this.ywjd_span_map[row.cate].start) {
          // 类型第一次出现的 index 进行合并
          return {
            rowspan: this.ywjd_span_map[row.cate].colspan,
            colspan: 1,
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0,
          };
        }
      }
    },
    findEnumIndex(num) {
      let enums = [10, 20, 30, 40, 50, 60, 70];
      return enums.findIndex((t) => t == num);
    },
    // 中国申报格局输入框下拉提示点击事件
    handleSelect2(val) {
      this.target = val.value;
      this.getJzgjypjd(this.jzgjypjd.page, 2, this.target);
      this.getIndication(this.syzzgsbbjObj.page, 2, this.target);
    },
    // 药品分布
    getJzgjypfb(type = 1, target) {
      const _that = this;
      this.fb_loading = true;
      Axios({
        url: "/api/globaldrugs/scape",
        params: {
          target: type == 1 ? this.target : target,
          position: 3
        },
      })
        .then((res) => {
          if (res.data.code == 200 && res.data.data.distribution) {
            this.show2 = true;
            this.phase = res.data.data.distribution.phase;
            this.mapData = res.data.data.distribution.map;

            let _len1 = this.phase.length,
              _len2 = this.mapData.length,
              xAxis1_data = [],
              series1_data = [];

            if (_len1 > 0) {
              let phaseColorBlock = [
                {
                  color: '#EBEEF5',
                  label: "其他"
                },
                {
                  color: "#E5EFFC",
                  label: "临床前"
                },
                {
                  color: "#C6DAFC",
                  label: "临床申请"
                },
                {
                  color: "#A2C4FE",
                  label: "临床Ⅰ期"
                },
                {
                  color: "#82AEFD",
                  label: "临床Ⅱ期"
                },
                {
                  color: "#4680F7",
                  label: "临床Ⅲ期"
                },
                {
                  color: "#2B68F6",
                  label: "注册申请"
                },
                {
                  color: "#002FA7",
                  label: "批准上市"
                }];
              this.phase = this.phase.reverse();
              this.phase.length > 0 && this.phase.forEach(item => {
                xAxis1_data.push(item.name);
                let color = phaseColorBlock.filter(phase => phase.label === item.name);
                let obj = {
                  value: item.count,
                  itemStyle: {
                    color: color && color[0].color
                  }
                };
                series1_data.push(obj);
              })

              this.ypfb_bar.xAxis1_data = xAxis1_data;
              this.ypfb_bar.series1_data = series1_data;
              this.drawPhaseBar();

              // this.recordNoData.delete(7);
            } else {
              // this.recordNoData.add(7);
              $("#phase-bar-globaldrugs").html('<div class="nodata-box"></div>');
              $("#phase-bar-globaldrugs").removeAttr("_echarts_instance_");
            }

            if (_len2 > 0) {
              this.formatMapData = [];
              this.mapData.forEach(item => {
                this.formatMapData.push({ name: item.label, value: item.doc_count })
              })
              this.$nextTick(() => {
                _that.worldConfigure(_that.formatMapData);
              })

              window.addEventListener("resize", () => {
                _that.echartsResize("chart");
              });
            } else {
              $("#map-globaldrugs").html('<div class="nodata-box"></div>');
              $("#map-globaldrugs").removeAttr("_echarts_instance_");
            }
            this.fb_loading = false;
          } else {
            this.fb_loading = false;
            this.show2 = false;
          }
        }).catch(err => {
          this.show2 = false;
        })
        .finally(() => {
          this.fb_loading = false;
        });
    },
    drawPhaseBar() {
      const _that = this;
      this.ypfb_bar.echarts = Echarts.init(document.getElementById("phase-bar-globaldrugs"), "westeros");
      this.ypfb_bar.echarts.clear()
      let options = {
        // color: [
        //   "#91C332",
        //   "#91adf1",
        //   "#fbc78e",
        //   "#ff9a75",
        //   "#56596C",
        //   "#E0E0E0",
        // ],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "none",
          },
        },
        // legend: {
        //   textStyle: {
        //     color: "#87A2EE",
        //   },
        //   itemGap: 40,
        //   icon: "rect",
        //   bottom: 20,
        //   itemWidth: 20,
        //   itemHeight: 20,
        //   selector: false,
        //   data: _that.ypfb_bar.xAxis1_data,
        // },
        grid: {
          right: 40,
          top: "10%",
          bottom: "15%",
          containLabel: true,
        },
        xAxis: {
          name: "数量",
          nameTextStyle: {
            color: "#333333",
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: "#DCDFE6",
            },
          },
          axisLabel: {
            show: false,
          },
          type: "value",
        },
        yAxis: {
          name: "研发状态",
          nameTextStyle: {
            color: "#333333",
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: "#DCDFE6",
            },
          },
          axisLabel: {
            color: "#545b6d",
          },
          type: "category",
          data: _that.ypfb_bar.xAxis1_data,
        },
        backgroundColor: "#FAFBFD",
        series: {
          type: "bar",
          barMaxWidth: 30,
          data: _that.ypfb_bar.series1_data
        }
      }
      this.ypfb_bar.echarts.setOption(options);
    },
    // 绘制全部地图
    worldConfigure(worldData) {
      if (!worldData.length) {
        return;
      }
      let _that = this;
      let max = _.maxBy(worldData, "value").value;
      let myChart = Echarts.init(
        document.getElementById("map-globaldrugs"),
        "westeros"
      );
      myChart && myChart.clear();
      myChart.setOption({
        tooltip: {
          trigger: "item",
          formatter: function (params) {
            if (params.name) {
              return `${params.name}<br/>数量：${params.value ? params.value : 0
                }`;
            }
          },
        },
        visualMap: {
          min: 0,
          max: worldData.length ? worldData[0].value : 0,
          left: 30,
          bottom: 0,
          text: ["高", "低"], // 文本，默认为数值文本
          calculable: true,
        },
        backgroundColor: "#FAFBFD",
        series: [{
          type: 'map',
          mapType: "world",
          zoom: 1, //当前视角的缩放比例
          roam: true, //是否开启平游或缩放
          label: {
            normal: {
              show: false
            },
            emphasis: {
              show: false
            }
          },
          nameMap: _that.nameMap,
          data: worldData
        }]
      });
    },
    // 药品进度
    getJzgjypjd(page, type = 1, target, paged) {
      this.jd_loading = true;
      Axios({
        url: "/api/globaldrugs/scape",
        params: {
          target: type == 1 ? this.target : target,
          position: 2,
          page,
          filter_condition: this.ywjd_saved_condition,
        },
      })
        .then((res) => {
          if (res.data.code == 200 && res.data.data.progress) {
            this.show1 = true;
            this.ywjd = res.data.data.progress.list || [];
            // 合并表格用  统计 类型出现的次数和第一次出现的index
            this.ywjd_span_map = res.data.data.progress.list.reduce(
              (p, c, i) => {
                if (p[c.cate]) {
                  p[c.cate]["colspan"] += 1;
                } else {
                  p[c.cate] = {
                    colspan: 1,
                    start: i,
                  };
                }
                return p;
              },
              {}
            );

            this.jzgjypjd.page = res.data.data.progress.page;
            this.ypjd_total = res.data.data.progress.count ? res.data.data.progress.count : false;
            if (!paged) this.ywjd_filtres = res.data.data.progress.filters || {};
            this.jd_loading = false;
          } else {
            this.jd_loading = false;
            this.show1 = false;
          }
        }).catch(err => {
          this.show1 = false;
        })
        .finally(() => {
          this.jd_loading = false;
        });
    },
    ypjdhandleCurrentChange(val) {
      window.ga("send", "event", "button", "click",
        "企业版_全球药物_靶点详情_竞争格局_药品进度_翻页_" + val);
      window._paq.push([
        "trackEvent",
        "button",
        "click",
        "企业版_全球药物_靶点详情_竞争格局_药品进度_翻页_" + val
      ]);
      this.jd_loading = true;
      this.jzgjypjd.page = val;
      this.getJzgjypjd(this.jzgjypjd.page, 1, this.target, true);
    },
  },
  mounted() {
    this.$root.$on("search", (e) => {
      this.target = e;
      this.getJzgjypjd(this.jzgjypjd.page, 2, this.target);
      this.getIndication(this.syzzgsbbjObj.page, 2, this.target);
    });
  },
};
</script>

<style scoped lang="less">
@import url(../table-style.less);

.target-jzgj {
  padding: 10px;
  position: relative;

  .line {
    width: 100%;
    white-space: nowrap;
    padding: 3px 0;
    box-sizing: border-box;
    height: 20px;

    &-item {
      height: 14px;
      border-radius: 7px;
      width: calc(100% / 6);
      position: relative;
      display: inline-block;

      .line-item_label {
        font-size: 12px;
        color: #fff;
        position: absolute;
        line-height: 14px;
        right: 8px;

        &.dark {
          color: #002fa7;
        }
      }
    }
  }
}

.charts {
  display: flex;
  justify-content: space-between;

  .chart {
    width: calc((100% - 10px) / 2);
    height: 350px;
    border-radius: 3px;
  }
}

/deep/.el-table td .cell {
  overflow: visible;
  text-overflow: unset;

  &>div {
    text-overflow: unset;
  }

  .bd_num_box {
    text-align: center;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;

    &.light {
      color: #fff;
    }
  }

  .content-input {
    padding-left: 10px;
    margin-bottom: 20px;

    span {
      font-weight: 600;
      font-size: 14px;
    }

    .el-input {
      width: 200px;
      font-weight: 600;
      font-size: 14px;

      .el-input__inner {
        padding-left: 8px;
      }
    }
  }

  /deep/.el-pagination {
    border: none !important;
  }
}
</style>

<style lang="less">
@CellHeight: 34px;

.target-jzgj {
  .sbbj-table {
    border-left: none;

    .el-table__body-wrapper .cell {
      min-height: @CellHeight;
    }

    thead th>.cell {
      display: flex;
      justify-content: center;
    }

    td .cell {
      padding: 0 !important;
      -webkit-line-clamp: unset !important;

      div {
        height: @CellHeight;
        line-height: @CellHeight;
        max-height: unset !important;
        -webkit-line-clamp: unset !important;
      }

      &>.line {
        overflow: unset !important;
        text-overflow: unset !important;
      }
    }
  }

  .el-table_5_column_154 {
    .cell>div>div {
      padding-left: 0 !important;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
    }


    .scope-bg {

      &:last-child {
        display: inline-block;
        padding: 0 12px;
        border-radius: 10px;
        height: 20px;
        line-height: 20px;
      }
    }
  }

  // 药品名称那一列
  .el-table_5_column_126 {

    .scope-bg {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      // line-height: 18px !important;
      height: unset !important;

      p:first-child {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 100%;
      }
    }
  }

  .custom-table {
    margin-top: 30px;
    max-height: 250px;
    overflow-y: auto !important;

    td {
      padding: 0 !important;
    }

    .cell {
      padding: 0 !important;
      display: flex !important;
      justify-content: center;
      align-items: center;
    }
  }

  .sub-section-content {
    min-height: 300px;
  }

  .pagination {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: calc(100% - 2px);
    margin: 0 auto;
    border-left: 1px solid #EBEEF5 !important;
    border-right: 1px solid #EBEEF5 !important;
    border-bottom: 1px solid #EBEEF5 !important;
  }

  .tips-box {
    margin-right: 11px;

    .tips {
      float: right;
      height: 12px;
      line-height: 12px;
      font-size: 12px;
      font-weight: 400;
      color: #9AA4B8;
    }
  }

  .el-pagination:last-child {
    border-right: none;
  }

  .el-table__body-wrapper {

    .cell:hover,
    .scope-bg:hover {
      background: #eff2fa !important;
      color: #000 !important;
    }
  }

  .el-table--enable-row-hover .el-table__body tr:hover>td {
    background-color: transparent !important;
  }

  .overflow {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    display: block;
  }

  .ypjd-table,
  .sbbj-table {
    thead th>.cell {
      justify-content: center;
    }
  }

  .cl-blue {
    color: #002fa7;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }

  .el-table tbody tr td:last-child {
    padding-right: 0 !important;
  }

  .nodata-box {
    background: url('~@/assets/imgs/globaldrugs/analy/chart-nodata.png') no-repeat center;
    background-size: 275px 251px;
    width: 100%;
    height: 100%;
  }
}
</style>