<template>
  <div class="jzgj">
    <div class="sub-section">
      <div class="sub-section-title">
        <span>靶点统计：</span>
      </div>
      <div class="sub-section-content">
        <el-table
          class="bdtj-table ypjd-table"
          :data="bdtj"
          style="width: 100%"
        >
          <el-table-column align="center" label="靶点名称" prop="name">
            <template slot-scope="{ row }">
              <el-popover
                v-if="row.name != '总计'"
                trigger="hover"
                width="250"
                placement="right"
              >
                <div>
                  <a
                    style="color: #002fa7"
                    target="_blank"
                    v-if="row.name != '总计'"
                    @click="goBadian(row)"
                    >{{ row.name }}</a
                  >
                  <span v-else>{{ row.name }}</span>
                </div>
                <div slot="reference">
                  <a
                    style="color: #002fa7"
                    target="_blank"
                    v-if="row.name != '总计'"
                    @click="goBadian(row)"
                    >{{ row.name }}</a
                  >
                  <span v-else>{{ row.name }}</span>
                </div>
              </el-popover>
              <span v-else>{{ row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            header-align="center"
            label="临床前"
            prop="status10"
          >
            <template slot="header">
              <span>临床前</span>
            </template>
            <template slot-scope="{ row, $index }">
              <div
                :class="[
                  'bd_num_box',
                  $index < bdtj.length - 1 && row.status10 / avg > 3
                    ? 'light'
                    : '',
                  $index < bdtj.length - 1 && row.status10 > 0
                    ? 'hover-bd-link'
                    : '',
                ]"
                :style="{
                  backgroundColor:
                    $index < bdtj.length - 1 &&
                    (bd_map[Math.floor(row.status10 / avg)] || '#3556B9'),
                }"
                @click="$index < bdtj.length - 1 && goList(row, 10)"
              >
                <span v-if="row.status10 <= 0" style="color: #5c6973">{{
                  row.status10
                }}</span>
                <span v-else>{{ row.status10 }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            header-align="center"
            label="临床申请"
            prop="status20"
          >
            <template slot="header">
              <span>临床申请</span>
            </template>
            <template slot-scope="{ row, $index }">
              <div
                :class="[
                  'bd_num_box',
                  $index < bdtj.length - 1 && row.status20 / avg > 3
                    ? 'light'
                    : '',
                  $index < bdtj.length - 1 && row.status20 > 0
                    ? 'hover-bd-link'
                    : '',
                ]"
                :style="{
                  backgroundColor:
                    $index < bdtj.length - 1 &&
                    (bd_map[Math.floor(row.status20 / avg)] || '#3556B9'),
                }"
                @click="$index < bdtj.length - 1 && goList(row, 20)"
              >
                <span v-if="row.status20 <= 0" style="color: #5c6973">{{
                  row.status20
                }}</span>

                <span v-else>{{ row.status20 }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            header-align="center"
            label="临床Ⅰ期"
            prop="status30"
          >
            <template slot="header">
              <span>临床Ⅰ期</span>
            </template>
            <template slot-scope="{ row, $index }">
              <div
                :class="[
                  'bd_num_box',
                  $index < bdtj.length - 1 && row.status30 / avg > 3
                    ? 'light'
                    : '',
                  $index < bdtj.length - 1 && row.status30 > 0
                    ? 'hover-bd-link'
                    : '',
                ]"
                :style="{
                  backgroundColor:
                    $index < bdtj.length - 1 &&
                    (bd_map[Math.floor(row.status30 / avg)] || '#3556B9'),
                }"
                @click="$index < bdtj.length - 1 && goList(row, 30)"
              >
                <span v-if="row.status30 <= 0" style="color: #5c6973">{{
                  row.status30
                }}</span>
                <span v-else>{{ row.status30 }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            header-align="center"
            label="临床Ⅱ期"
            prop="status40"
          >
            <template slot="header">
              <span>临床Ⅱ期</span>
            </template>
            <template slot-scope="{ row, $index }">
              <div
                :class="[
                  'bd_num_box',
                  $index < bdtj.length - 1 && row.status40 / avg > 3
                    ? 'light'
                    : '',
                  $index < bdtj.length - 1 && row.status40 > 0
                    ? 'hover-bd-link'
                    : '',
                ]"
                :style="{
                  backgroundColor:
                    $index < bdtj.length - 1 &&
                    (bd_map[Math.floor(row.status40 / avg)] || '#3556B9'),
                }"
                @click="$index < bdtj.length - 1 && goList(row, 40)"
              >
                <span v-if="row.status40 <= 0" style="color: #5c6973">{{
                  row.status40
                }}</span>
                <span v-else>{{ row.status40 }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            header-align="center"
            label="临床Ⅲ期"
            prop="status50"
          >
            <template slot="header">
              <span>临床Ⅲ期</span>
            </template>
            <template slot-scope="{ row, $index }">
              <div
                :class="[
                  'bd_num_box',
                  $index < bdtj.length - 1 && row.status50 / avg > 3
                    ? 'light'
                    : '',
                  $index < bdtj.length - 1 && row.status50 > 0
                    ? 'hover-bd-link'
                    : '',
                ]"
                :style="{
                  backgroundColor:
                    $index < bdtj.length - 1 &&
                    (bd_map[Math.floor(row.status50 / avg)] || '#3556B9'),
                }"
                @click="$index < bdtj.length - 1 && goList(row, 50)"
              >
                <span v-if="row.status50 <= 0" style="color: #5c6973">{{
                  row.status50
                }}</span>
                <span v-else>{{ row.status50 }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            header-align="center"
            label="注册申请"
            prop="status60"
          >
            <template slot="header">
              <span>注册申请</span>
            </template>
            <template slot-scope="{ row, $index }">
              <div
                :class="[
                  'bd_num_box',
                  $index < bdtj.length - 1 && row.status60 / avg > 3
                    ? 'light'
                    : '',
                  $index < bdtj.length - 1 && row.status60 > 0
                    ? 'hover-bd-link'
                    : '',
                ]"
                :style="{
                  backgroundColor:
                    $index < bdtj.length - 1 &&
                    (bd_map[Math.floor(row.status60 / avg)] || '#3556B9'),
                }"
                @click="$index < bdtj.length - 1 && goList(row, 60)"
              >
                <span v-if="row.status60 <= 0" style="color: #5c6973">{{
                  row.status60
                }}</span>
                <span v-else>{{ row.status60 }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            header-align="center"
            label="批准上市"
            prop="status70"
          >
            <template slot="header">
              <span>批准上市</span>
            </template>
            <template slot-scope="{ row, $index }">
              <div
                :class="[
                  'bd_num_box',
                  $index < bdtj.length - 1 && row.status70 / avg > 3
                    ? 'light'
                    : '',
                  $index < bdtj.length - 1 && row.status70 > 0
                    ? 'hover-bd-link'
                    : '',
                ]"
                :style="{
                  backgroundColor:
                    $index < bdtj.length - 1 &&
                    (bd_map[Math.floor(row.status70 / avg)] || '#3556B9'),
                }"
                @click="$index < bdtj.length - 1 && goList(row, 70)"
              >
                <span v-if="row.status70 <= 0" style="color: #5c6973">{{
                  row.status70
                }}</span>
                <span v-else>{{ row.status70 }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            header-align="center"
            label="其他"
            prop="status0"
          >
            <template slot="header">
              <span>其他</span>
            </template>
            <template slot-scope="{ row, $index }">
              <div
                :class="[
                  'bd_num_box',
                  $index < bdtj.length - 1 && row.status0 / avg > 3
                    ? 'light'
                    : '',
                ]"
                :style="{
                  backgroundColor:
                    $index < bdtj.length - 1 &&
                    (bd_map[Math.floor(row.status0 / avg)] || '#3556B9'),
                }"
                @click="$index < bdtj.length - 1 && goList(row, 0)"
              >
                <span v-if="row.status0 <= 0" style="color: #5c6973">{{
                  row.status0
                }}</span>
                <span v-else>{{ row.status0 }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="总计"
            align="center"
            header-align="center"
            prop="total"
          >
            <template slot="header">
              <span>总计</span>
            </template>
            <template slot-scope="{ row, $index }">
              <span v-if="row.total" style="color: #002fa7">{{
                row.total
              }}</span>
              <span v-else style="color: #5c6973">{{ row.total }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="sub-section">
      <div class="sub-section-title">
        <span>药品进度：</span>
      </div>
      <div
        v-if="ywjd_loaded"
        class="sub-section-content"
        v-waiting="jd_loading"
      >
        <el-table
          class="ypjd-table"
          :span-method="SpanMethod"
          :data="ywjd"
          ref="ywjd"
          :show-header="ywjd_show_header"
          style="width: 100%"
        >
          <el-table-column min-width="140" label="药品类型" prop="cate">
            <template slot="header">
              <TableHeadFilter
                name="药品类型"
                :offset="-12"
                :props="{ label: 'label' }"
                :options="
                  (ywjd_filtres['cate'] || []).map((t) => ({
                    label: t,
                  }))
                "
                prop="cate"
                :saved_condition="ywjd_saved_condition"
                @confirm="ywjd_confirm('cate', $event)"
                @cancel="ywjd_cancel('cate')"
              >
              </TableHeadFilter>
            </template>
          </el-table-column>
          <el-table-column
            min-width="140"
            label="药品名称"
            prop="drugname_standard"
          >
            <template slot="header">
              <TableHeadFilter
                name="药品名称"
                :offset="-12"
                :props="{ label: 'label' }"
                :options="
                  (ywjd_filtres['drugname'] || []).map((t) => ({
                    label: t,
                  }))
                "
                prop="drugname"
                :saved_condition="ywjd_saved_condition"
                @confirm="ywjd_confirm('drugname', $event)"
                @cancel="ywjd_cancel('drugname')"
              >
              </TableHeadFilter>
            </template>
            <template slot-scope="{ row }">
              <el-popover
                v-if="row.cate != '联合用药'"
                trigger="hover"
                width="250"
                placement="right"
              >
                <a
                  :href="
                    '/globaldrugs/detail?drugname_standard=' +
                    encodeURIComponent(row.hash_drugname_standard) +
                    '&company_standard=' +
                    encodeURIComponent(row.hash_company_standard)
                  "
                  style="color: #002fa7; word-break: break-all"
                  target="_blank"
                  >{{ row.drugname_standard }}</a
                >
                <a
                  slot="reference"
                  :href="
                    '/globaldrugs/detail?drugname_standard=' +
                    encodeURIComponent(row.hash_drugname_standard) +
                    '&company_standard=' +
                    encodeURIComponent(row.hash_company_standard)
                  "
                  style="color: #002fa7"
                  target="_blank"
                  >{{ row.drugname_standard }}</a
                >
              </el-popover>
              <el-popover v-else trigger="hover" width="250" placement="right">
                <span style="word-break: break-all">{{
                  row.drugname_standard
                }}</span>
                <span slot="reference">{{ row.drugname_standard }}</span>
              </el-popover>
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
              <div
                class="line"
                v-if="findEnumIndex(row.worldstatus.status) >= 0"
              >
                <div
                  v-for="(c, i) in global_line_map"
                  :key="c"
                  :style="{
                    backgroundColor: c,
                    left: -i * 3 + '%',
                    zIndex: 10 - i,
                  }"
                  class="line-item"
                  v-if="findEnumIndex(row.worldstatus.status) >= i"
                >
                  <span
                    :class="[
                      'line-item_label',
                      findEnumIndex(row.worldstatus.status) < 3 ? 'dark' : '',
                    ]"
                    v-if="findEnumIndex(row.worldstatus.status) == i"
                    :style="{
                      'font-size': '12px',
                      left: `calc((97% - 70px) / 1.3)`,
                    }"
                    >{{ row.worldstatus.date }}</span
                  >
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column min-width="140" label="适应症" prop="indication">
            <template slot="header">
              <TableHeadFilter
                name="适应症"
                :offset="-12"
                :props="{ label: 'label' }"
                :options="
                  (ywjd_filtres['indication'] || []).map((t) => ({
                    label: t,
                  }))
                "
                prop="indication"
                :saved_condition="ywjd_saved_condition"
                @confirm="ywjd_confirm('indication', $event)"
                @cancel="ywjd_cancel('indication')"
              >
              </TableHeadFilter>
            </template>
            <template slot-scope="{ row }">
              <el-popover
                placement="left"
                width="300"
                :trigger="row.indication ? 'hover' : ''"
              >
                <div v-html="row.indication"></div>
                <div slot="reference" v-html="row.indication"></div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column min-width="140" label="研发企业">
            <template slot="header">
              <TableHeadFilter
                name="研发企业"
                :offset="-12"
                :props="{ label: 'label' }"
                :options="
                  (ywjd_filtres['company'] || []).map((t) => ({
                    label: t,
                  }))
                "
                prop="company"
                :saved_condition="ywjd_saved_condition"
                @confirm="ywjd_confirm('company', $event)"
                @cancel="ywjd_cancel('company')"
              >
              </TableHeadFilter>
            </template>
            <template slot-scope="{ row }">
              <el-popover
                placement="left"
                width="300"
                :trigger="row.company_standard.length ? 'hover' : ''"
              >
                <div>
                  <p v-for="(t, i) in row.company_standard" :key="i">
                    <!-- :title="t.name" -->
                    <a
                      v-if="t.have_info"
                      style="color: #002fa7"
                      target="_blank"
                      :href="
                        `/globaldrugs/companyDetail?company_standard=` +
                        encodeURIComponent(t.hash_name)
                      "
                    >
                      {{ t.name }}
                    </a>
                    <span v-else>{{ t.name }}</span>
                  </p>
                </div>
                <div slot="reference">
                  <p v-for="(t, i) in row.company_standard" :key="i">
                    <!-- :title="t.name" -->
                    <a
                      v-if="t.have_info"
                      style="color: #002fa7"
                      target="_blank"
                      :href="
                        `/globaldrugs/companyDetail?company_standard=` +
                        encodeURIComponent(t.hash_name)
                      "
                    >
                      {{ t.name }}
                    </a>
                    <span v-else>{{ t.name }}</span>
                  </p>
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <template slot="append">
            <el-pagination
              @current-change="handleCurrentChange"
              :current-page="ywjd_page"
              :page-size="10"
              layout="total, prev, next"
              hide-on-single-page
              :total="ywjd_total"
            >
            </el-pagination>
          </template>
        </el-table>
      </div>
    </div>
    <div class="sub-section">
      <div class="sub-section-title">
        <span>药品分布：</span>
      </div>
      <div class="sub-section-content" v-waiting="fb_loading">
        <div class="charts">
          <div class="charts-notify">
            *其他：包括停止、暂停、撤市、无研发进展报道
          </div>
          <div class="chart" id="phase-bar-globaldrugs" ref="ypfbdata"></div>
          <div class="chart" id="map-globaldrugs"></div>
          <div class="map-table">
            <el-table :data="formatMapData" class="custom-table" height="200px">
              <el-table-column
                v-for="(item, ix) in qyHead"
                :prop="item.prop"
                :key="ix"
                :label="item.label"
              >
                <template slot-scope="scope">
                  <span
                    v-if="item.prop == 'name'"
                    class="underline-span"
                    @click="nextClick({ name: scope.row.name }, item.prop)"
                    >{{ scope.row[item.prop] }}</span
                  >
                  <span v-else>{{ scope.row[item.prop] }}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "../../../../../node_modules/echarts/map/js/world.js";
import TableHeadFilter from "@/components/common/globaldrugs/table-head-filter";

// 竞争格局
export default {
  data() {
    return {
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
        },
      ],
      avg: 0,
      bdtj: [],
      ywjd: [],
      ywjd_loaded: false,
      ywjd_show_header: true,
      ywjd_span_map: {},
      ywjd_page: 1,
      ywjd_total: 0,
      ywjd_filtres: {}, // 药物进度筛选项
      ywjd_saved_condition: "", // 药物进度 已选条件存储
      ywfb: [],
      global_line_map: [
        "#E5EFFE",
        "#CADAFF",
        "#A3C4FC",
        "#82ABF9",
        "#467FF7",
        "#2C66F6",
        "#002FA7",
      ],
      bd_map: [
        "#FAFBFD",
        "#E4EAFA",
        "#C8D6F9",
        "#ABC2F6",
        "#92ADF1",
        "#648AEC",
        "#4A78E7",
        "#3556B9",
      ],
      YPFB: null,
      jd_loading: false,
      fb_loading: false,
      ypfb_bar: null,
      ypfb_map: null,
      formatMapData: [],
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
      keywords: "",
    };
  },
  components: { TableHeadFilter },
  props: {
    drugname_standard: {
      default: "",
      type: String,
    },
    company_standard: {
      default: "",
      type: String,
    },
  },
  methods: {
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
      let new_condition = this.encode_conditions(old_condition);
      
      this.ywjd_saved_condition = new_condition;
      this.handleCurrentChange(1);
      this.setTableFilterOptions()
    },
    ywjd_cancel(key) {
      let old_condition = this.decode_conditions();
      delete old_condition[key];
      let new_condition = this.encode_conditions(old_condition);
      this.ywjd_saved_condition = new_condition;
      this.handleCurrentChange(1);
      this.setTableFilterOptions()
    },
    setTableFilterOptions() {
      Axios({
        method: "get",
        url: '/api/globaldrugs/scapeDrugProgressLink',
        params: {
          drugname_standard: this.drugname_standard,
          // company_standard: this.company_standard,
          filter_condition: this.ywjd_saved_condition
        }
      }).then(res => {
        if (res.data.code == 200) {
          // 联动 有问题 出发不了 更新，重新挂载组件会导致已选条件丢失 修改非常麻烦。
          this.ywjd_filtres = res.data.data;
          this.ywjd_show_header = false;
          this.$nextTick(() => {
            this.ywjd_show_header = true;
          })
        }
      })
    },
    goBadian(row) {
      _paq.push([
        "trackEvent",
        "button",
        "click",
        "企业版_全球药物_药物详情_竞争格局_靶点统计_查看靶点详情_" + row.name,
      ]);
      window.open(
        "/globaldrugs/target/detail?target=" +
          encodeURIComponent(row.hash_name),
        "_blank"
      );
    },
    toggleAlert(cls) {
      // 切换alert提示
      $(".alert").fadeIn();
      $(".alert")
        .find("." + cls)
        .fadeIn();
      setTimeout(() => {
        $(".alert").fadeOut();
        $(".alert")
          .find("." + cls)
          .fadeOut();
      }, 2000);
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
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      _paq.push([
        "trackEvent",
        "button",
        "click",
        "企业版_全球药物_药物详情_竞争格局_药品进度_表格分页_" + val,
      ]);
      this.jd_loading = true;
      Axios({
        url: "/api/globaldrugs/scape",
        params: {
          drugname_standard: this.drugname_standard,
          position: 2,
          page: val,
          pageSize: 10,
          filter_condition: this.ywjd_saved_condition,
        },
      })
        .then((res) => {
          if (res.data.code == 200) {
            this.ywjd = res.data.data.progress.list;
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

            this.ywjd_page = res.data.data.progress.page;
            this.ywjd_total = res.data.data.progress.count;
          }
        })
        .finally(() => {
          this.jd_loading = false;
        });
    },

    drawPhaseBar(x, s) {
      this.ypfb_bar = Echarts.init(
        document.getElementById("phase-bar-globaldrugs"),
        "westeros"
      );
      this.ypfb_bar.clear();
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
            color: "#87A2EE",
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
          splitLine: {
            show: false,
          },
        },
        yAxis: {
          name: "研发状态",
          nameTextStyle: {
            color: "#87A2EE",
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
          data: x,
          splitLine: {
            show: false,
          },
        },
        backgroundColor: "#FAFBFD",
        series: {
          type: "bar",
          barMaxWidth: 30,
          data: s,
        },
      };
      this.ypfb_bar.setOption(options);
    },
    initState(k) {
      let keywords = k || this.keywords || this.drugname_standard;
      Axios({
        url: "/api/globaldrugs/scape",
        params: {
          drugname_standard: keywords,
          position: 0,
          pageSize: 10,
        },
      }).then((res) => {
        if (res.data.code == 200) {
          if (!this.isEmpty(res.data.data)) {
            // this.$message.error("暂无数据！");
            if (k) {
              this.toggleAlert("wrong1");
            } else {
              this.$root.$emit("hide-section", "竞争格局");
            }
            return;
          }
          this.bdtj = res.data.data.target.list;
          this.avg = Math.ceil(res.data.data.target.max / 8);
          this.ywjd = res.data.data.progress.list;
          this.ywjd_loaded = true;
          // 药物进度合并统计
          this.ywjd_span_map = res.data.data.progress.list.reduce((p, c, i) => {
            if (p[c.cate]) {
              p[c.cate]["colspan"] += 1;
            } else {
              p[c.cate] = {
                colspan: 1,
                start: i,
              };
            }
            return p;
          }, {});
          this.ywjd_filtres = res.data.data.progress.filters;
          this.ywjd_page = res.data.data.progress.page;
          this.ywjd_total = res.data.data.progress.count;

          // 处理图表数据
          let phase = res.data.data.distribution.phase;
          let mapData = res.data.data.distribution.map;

          if (phase.length) {
            let phaseColorBlock = [
              {
                color: "#EBEEF5",
                label: "其他",
              },
              {
                color: "#F0F3FA",
                label: "临床前",
              },
              {
                color: "#E2E7F3",
                label: "临床申请",
              },
              {
                color: "#D9DFF0",
                label: "临床Ⅰ期",
              },
              {
                color: "#CFD9F5",
                label: "临床Ⅱ期",
              },
              {
                color: "#C2CFF2",
                label: "临床Ⅲ期",
              },
              {
                color: "#B4C3ED",
                label: "注册申请",
              },
              {
                color: "#A0B5EF",
                label: "批准上市",
              },
            ];
            phase = phase.reverse();
            let x_axis1_data = [];
            let series1_data = [];
            phase.forEach((item) => {
              x_axis1_data.push(item.name);
              let color = phaseColorBlock.filter(
                (phase) => phase.label === item.name
              );
              let obj = {
                value: item.count,
                itemStyle: {
                  color: color && color[0].color,
                },
              };
              series1_data.push(obj);
            });
            this.drawPhaseBar(x_axis1_data, series1_data);
          }
          if (mapData.length) {
            this.formatMapData = mapData.map((item) => ({
              name: item.label,
              value: item.doc_count,
            }));
            this.worldConfigure(this.formatMapData);
          }
        }
      });
    },
    // 绘制全部地图
    worldConfigure(worldData) {
      if (!worldData.length) {
        return;
      }
      console.log(worldData, "worldData");
      let _that = this;
      let max = _.maxBy(worldData, "value").value;
      this.ypfb_map = Echarts.init(
        document.getElementById("map-globaldrugs"),
        "westeros"
      );
      console.log(this.ypfb_map, "this.ypfb_map");
      this.ypfb_map && this.ypfb_map.clear();
      this.ypfb_map.setOption({
        tooltip: {
          trigger: "item",
          formatter: function (params) {
            if (params.name) {
              return `${params.name}<br/>数量：${
                params.value ? params.value : 0
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
        series: [
          {
            type: "map",
            mapType: "world",
            zoom: 1, //当前视角的缩放比例
            roam: true, //是否开启平游或缩放
            label: {
              normal: {
                show: false,
              },
              emphasis: {
                show: false,
              },
            },
            nameMap: this.nameMap,
            data: worldData,
          },
        ],
      });
    },
    // 去列表页
    goList(row, status) {
      if (row[`status` + status]) {
        let numObj = {
          phase1: [status],
        };
        let { href } = this.$router.resolve({
          path: "/globaldrugs",
          query: {
            drugname: this.drugname_standard,
            targets: row.name,
            filter_condition: JSON.stringify(numObj),
          },
        });
        window.open(href, "_blank");
      }
    },
  },
  mounted() {
    this.initState();
    this.$root.$on("search", (e) => {
      this.keywords = e;
      this.initState(e);
    });
    let _this = this;
    window.onresize = function () {
      _this.ypfb_bar.resize();
      _this.ypfb_map.resize();
    };
  },
};
</script>

<style scoped lang="less">
@import url(./table-style.less);

.jzgj {
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
        // left: calc(20%);
        &.dark {
          color: #35384a;
        }
      }
    }
  }
}
.charts {
  display: flex;
  justify-content: space-between;
  position: relative;
  .chart {
    width: calc((100% - 10px) / 2);
    height: 350px;
    background-color: #fafbfd;
    border-radius: 3px;
    &:first-child {
      border-right: 10px;
    }
  }
  .map-table {
    width: 160px;
    position: absolute;
    right: 0;
    top: 45px;
  }
  .charts-notify {
    color: #5c6973;
    font-size: 12px;
    position: absolute;
    bottom: 12px;
    left: calc(50% - 350px);
    z-index: 1;
  }
}
/deep/.el-table td .cell {
  // overflow: visible;
  // text-overflow: unset;

  & > div {
    // text-overflow: unset;
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
    color: #002fa7;
    &.light {
      color: #fff;
    }
  }
}
/deep/.el-table.bdtj-table {
  overflow: visible;
  tbody tr td:last-child {
    padding-right: 0;
  }
  .el-table__body tr:hover > td {
    background-color: transparent !important;
  }

  .el-table__body-wrapper {
    .cell:hover,
    .bd_num_box:hover {
      background: #eff2fa !important;
      color: #000 !important;
    }
    .bd_num_box span {
      height: 36px;
      line-height: 36px;
    }
  }
  .cell {
    justify-content: center;
    position: relative;
  }
  thead .cell {
    margin-left: -7px;
  }
  .el-table__body td:last-child {
    .cell {
      padding: 8px;
    }
  }
  .el-table__body td:first-child {
    .cell {
      padding: 8px;
    }
  }
  .el-table__body td {
    .cell {
      padding: 0;
      -webkit-line-clamp: 1;
      span {
        -webkit-line-clamp: 1;
      }
    }
  }
  td .cell {
    font-size: 13px;
    color: #333;
    padding: 8px;

    & > div {
      max-height: fit-content;
    }
  }
}
.hover-bd-link {
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
}
.ypjd-table {
  .cell > span {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    max-height: 35px;
  }
}
/deep/.custom-table.el-table {
  .el-table__header-wrapper .el-table__header .cell {
    background-color: #ebeef5;
    font-size: 12px;
    color: #333;
    font-weight: bold;
    height: 28px;
    line-height: 28px;
    padding: 0;
    text-align: center;
    display: block;
  }
  .el-table__body {
    .el-table__row {
      font-size: 12px;
      color: #333;
      .cell {
        height: 28px;
        line-height: 28px;
        min-height: 28px;
        text-align: center;
        padding: 0;
      }
    }
  }
}
</style>
