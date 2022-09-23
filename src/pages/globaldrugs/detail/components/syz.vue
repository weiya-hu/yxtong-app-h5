<template>
  <div class="syz">
    <!-- <LoadingGif :loadFlag="true" v-if="true"/> -->
    <div class="syz-section" v-if="ypz_count">
      <div class="section-title">
        <span>已批准适应症</span>
        <span style="color: #9aa4b8">({{ ypz_count }})</span>：
      </div>
      <div class="section-content">
        <el-table class="yfmx-table" :data="ypz" style="width: 100%">
          <el-table-column
            prop="indication"
            label="适应症"
            sortable
            min-width="300"
          >
            <template slot="header">
              <TableHeadFilter
                name="适应症"
                :offset="-12"
                :props="{ label: 'label' }"
                :options="
                  (ypz_filters['indication'] || []).map((t) => ({ label: t }))
                "
                @confirm="ypz_confirm"
                @cancel="ypz_cancel"
              ></TableHeadFilter>
            </template>
            <template slot-scope="{ row }">
              <el-popover
                placement="right"
                width="250"
                :trigger="row.indication ? 'hover' : 'click'"
              >
                <div>{{ row.indication || "-" }}</div>
                <div slot="reference">{{ row.indication || "-" }}</div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column prop="china" align="center" label="中国">
            <template slot="header" slot-scope="scope">
              <div style="width: 100%">中国</div>
            </template>
            <template slot-scope="{ row }">
              <div v-for="(ot, i) in row.china" :key="i">
                <p>
                  <img
                    v-if="ot.name == '√'"
                    src="/static/imgs/globaldrugs/dui.png"
                    width="16"
                    height="13"
                    alt=""
                  />
                  <span v-if="ot.date">({{ ot.date }})</span>
                </p>
              </div>
              <span v-if="row.china.length == 0">-</span>
            </template>
          </el-table-column>
          <el-table-column prop="usa" align="center" label="美国">
            <template slot="header" slot-scope="scope">
              <div style="width: 100%">美国</div>
            </template>
            <template slot-scope="{ row }">
              <div v-for="(ot, i) in row.usa" :key="i">
                <p>
                  <img
                    v-if="ot.name == '√'"
                    src="/static/imgs/globaldrugs/dui.png"
                    width="16"
                    height="13"
                    alt=""
                  />
                  <span v-if="ot.date">({{ ot.date }})</span>
                </p>
              </div>
              <span v-if="row.usa.length == 0">-</span>
            </template>
          </el-table-column>
          <el-table-column prop="eu" align="center" label="欧盟">
            <template slot="header" slot-scope="scope">
              <div style="width: 100%">欧盟</div>
            </template>
            <template slot-scope="{ row }">
              <div v-for="(ot, i) in row.eu" :key="i">
                <p>
                  <img
                    v-if="ot.name == '√'"
                    src="/static/imgs/globaldrugs/dui.png"
                    width="16"
                    height="13"
                    alt=""
                  />
                  <span v-if="ot.date">({{ ot.date }})</span>
                </p>
              </div>
              <span v-if="row.eu.length == 0">-</span>
            </template>
          </el-table-column>
          <el-table-column prop="jp" align="center" label="日本">
            <template slot="header" slot-scope="scope">
              <div style="width: 100%">日本</div>
            </template>
            <template slot-scope="{ row }">
              <div v-for="(ot, i) in row.jp" :key="i">
                <p>
                  <img
                    v-if="ot.name == '√'"
                    src="/static/imgs/globaldrugs/dui.png"
                    width="16"
                    height="13"
                    alt=""
                  />
                  <span v-if="ot.date">({{ ot.date }})</span>
                </p>
              </div>
              <span v-if="row.jp.length == 0">-</span>
            </template>
          </el-table-column>
          <el-table-column prop="other" label="其他国家或地区">
            <template slot="header" slot-scope="scope">
              <div style="width: 100%">其他国家或地区</div>
            </template>
            <template slot-scope="{ row }">
              <el-popover
                :trigger="row.other.length == 0 ? 'click' : 'hover'"
                width="300"
                placement="left"
              >
                <div>
                  <div v-for="(ot, i) in row.other" :key="i">
                    <p>
                      <i
                        v-if="row.other.status"
                        class="el-icon-check"
                        style="color: #67c23a"
                      ></i>
                      {{ ot.name }}
                      <span v-if="ot.date">({{ ot.date }})</span>
                    </p>
                  </div>
                  <span v-if="row.other.length == 0">-</span>
                </div>
                <div slot="reference">
                  <div v-for="(ot, i) in row.other" :key="i">
                    <p>
                      <i
                        v-if="row.other.status"
                        class="el-icon-check"
                        style="color: #67c23a"
                      ></i>
                      {{ ot.name }}
                      <span v-if="ot.date">({{ ot.date }})</span>
                    </p>
                  </div>
                  <span v-if="row.other.length == 0">-</span>
                </div>
              </el-popover>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="syz-section" v-if="syzyfjz_count">
      <div class="section-title">
        <span>适应症研发进展</span>
        <span style="color: #9aa4b8">({{ syzyfjz_count }})</span>：
      </div>
      <div class="section-content">
        <!-- :height="syzyfjz_count > 10 ? 500 : 100 * syzyfjz_count" -->
        <el-table
          class="yfmx-table"
          :data="syzyfjz"
          v-waiting="syzyfjz_loading"
          @sort-change="syzyfjz_sort_change"
          style="width: 100%"
        >
          <el-table-column prop="indication" sortable label="适应症">
            <template slot="header">
              <TableHeadFilter
                name="适应症"
                :offset="-12"
                :props="{ label: 'label' }"
                :options="
                  (syzyfjz_filters['indication'] || []).map((t) => ({
                    label: t,
                  }))
                "
                @confirm="syzyfjz_confirm"
                @cancel="syzyfjz_cancel"
              ></TableHeadFilter>
            </template>
            <template slot-scope="{ row }">
              <el-popover
                placement="right"
                width="250"
                :trigger="row.indication ? 'hover' : 'click'"
              >
                <div>{{ row.indication || "-" }}</div>
                <div slot="reference">{{ row.indication || "-" }}</div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column min-width="600">
            <template slot="header" slot-scope="scope">
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
                class="line global_line"
                v-if="
                  isEmpty(row.status.global) &&
                  findEnumIndex(row.status.global.num) >= 0
                "
              >
                <div
                  v-for="(c, i) in global_line_map"
                  :key="i"
                  :style="{
                    backgroundColor: c,
                    left: -i * 3 + '%',
                    zIndex: 10 - i,
                  }"
                  v-if="findEnumIndex(row.status.global.num) >= i"
                  class="line-item"
                >
                  <span
                    :class="[
                      'line-item_label',
                      findEnumIndex(row.status.global.num) < 3 ? 'dark' : '',
                    ]"
                    v-if="findEnumIndex(row.status.global.num) == i"
                    style="font-size: 12px"
                    >{{ row.global_status_date }}</span
                  >
                </div>
              </div>
              <div
                class="line china_line"
                v-if="
                  isEmpty(row.status.china) &&
                  findEnumIndex(row.status.china.num) >= 0
                "
              >
                <div
                  v-for="(c, i) in cn_line_map"
                  :key="i"
                  :style="{
                    backgroundColor: c,
                    left: -i * 3 + '%',
                    zIndex: 10 - i,
                  }"
                  v-if="findEnumIndex(row.status.china.num) >= i"
                  class="line-item"
                >
                  <span
                    :class="[
                      'line-item_label',
                      findEnumIndex(row.status.china.num) < 3 ? 'dark' : '',
                    ]"
                    v-if="findEnumIndex(row.status.china.num) == i"
                    style="font-size: 12px"
                    >{{ row.china_status_date }}</span
                  >
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="研发单位">
            <template slot-scope="{ row }">
              <el-popover trigger="hover" placement="left" width="300">
                <div>
                  <div class="yfdw" v-if="row.company_standard.global.length">
                    <div class="label">全球:</div>
                    <div class="c">
                      <p v-for="(t, i) in row.company_standard.global" :key="i">
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
                  </div>
                  <div class="yfdw" v-if="row.company_standard.china.length">
                    <div class="label">中国:</div>
                    <div class="c">
                      <p v-for="(t, i) in row.company_standard.china" :key="i">
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
                  </div>
                </div>
                <div slot="reference">
                  <div class="yfdw" v-if="row.company_standard.global.length">
                    <div class="label">全球:</div>
                    <div class="c">
                      <p
                        class="hidden"
                        v-for="(t, i) in row.company_standard.global"
                        v-if="i == 0"
                        :key="i"
                      >
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
                  </div>
                  <div class="yfdw" v-if="row.company_standard.china.length">
                    <div class="label">中国:</div>
                    <div class="c">
                      <p
                        class="hidden"
                        v-for="(t, i) in row.company_standard.china"
                        v-if="i == 0"
                        :key="i"
                      >
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
                  </div>
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column label="合作企业">
            <template slot-scope="{ row }">
              <el-popover trigger="hover" placement="left" width="300">
                <div>
                  <div class="yfdw" v-if="row.coo_company.global.length">
                    <div class="label">全球:</div>
                    <div class="c">
                      <p v-for="(t, i) in row.coo_company.global" :key="i">
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
                  </div>
                  <div class="yfdw" v-if="row.coo_company.china.length">
                    <div class="label">中国:</div>
                    <div class="c">
                      <p v-for="(t, i) in row.coo_company.china" :key="i">
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
                  </div>
                </div>
                <div slot="reference">
                  <div class="yfdw" v-if="row.coo_company.global.length">
                    <div class="label">全球:</div>
                    <div class="c">
                      <p
                        class="hidden"
                        v-for="(t, i) in row.coo_company.global"
                        v-if="i == 0"
                        :key="i"
                      >
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
                  </div>
                  <div class="yfdw" v-if="row.coo_company.china.length">
                    <div class="label">中国:</div>
                    <div class="c">
                      <p
                        class="hidden"
                        v-for="(t, i) in row.coo_company.china"
                        v-if="i == 0"
                        :key="i"
                      >
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
                  </div>
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column label="许可单位">
            <template slot-scope="{ row }">
              <el-popover trigger="hover" placement="left" width="300">
                <div>
                  <div class="yfdw" v-if="row.per_company.global.length">
                    <div class="label">全球:</div>
                    <div class="c">
                      <p v-for="(t, i) in row.per_company.global" :key="i">
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
                  </div>
                  <div class="yfdw" v-if="row.per_company.china.length">
                    <div class="label">中国:</div>
                    <div class="c">
                      <p v-for="(t, i) in row.per_company.china" :key="i">
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
                  </div>
                </div>
                <div slot="reference">
                  <div class="yfdw" v-if="row.per_company.global.length">
                    <div class="label">全球:</div>
                    <div class="c">
                      <p
                        class="hidden"
                        v-for="(t, i) in row.per_company.global"
                        v-if="i == 0"
                        :key="i"
                      >
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
                  </div>
                  <div class="yfdw" v-if="row.per_company.china.length">
                    <div class="label">中国:</div>
                    <div class="c">
                      <p
                        class="hidden"
                        v-for="(t, i) in row.per_company.china"
                        v-if="i == 0"
                        :key="i"
                      >
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
                  </div>
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <template slot="append">
            <div class="yfjz-append">
              <div class="yfjz-page">
                <el-pagination
                  @current-change="handleSYJZChange"
                  :current-page="syzyfjz_page"
                  :page-size="10"
                  layout="total, prev, next"
                  hide-on-single-page
                  :total="syzyfjz_count"
                >
                </el-pagination>
              </div>
              <div class="yfjz-desc">
                <span class="linebar" style="background-color: #a0b5ef"></span>
                <span style="margin-right: 20px">全球</span>
                <span class="linebar" style="background-color: #85c407"></span>
                <span>中国</span>
              </div>
            </div>
          </template>
        </el-table>
      </div>
    </div>
    <div class="syz-section" v-if="yfmx_loaded" v-waiting="Loading">
      <div class="section-title">
        <span>适应症研发明细：</span>
      </div>
      <div class="section-content">
        <el-table
        ref="yfmx"
        :show-header="yfmx_show_header"
        @sort-change="yfmx_sort_change"
        class="yfmx-table" :data="yfmx" style="width: 100%">
          <el-table-column label="适应症" sortable prop="indication">
            <template slot="header">
              <TableHeadFilter
                name="适应症"
                :offset="-12"
                :props="{ label: 'label' }"
                :options="(yfmx_filtres['indication'] || []) | options"
                :saved_condition="yfmx_saved_condition"
                @confirm="yfmx_confirm('indication', $event)"
                @cancel="yfmx_cancel('indication')"
                prop="indication"
              >
              </TableHeadFilter>
            </template>
            <template slot-scope="{ row }">
              <el-popover
                placement="right"
                width="300"
                :trigger="row.indication ? 'hover' : 'click'"
              >
                <div>{{ row.indication || "-" }}</div>
                <div slot="reference">{{ row.indication || "-" }}</div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column label="研发阶段" sortable prop="phase" width="150">
            <template slot="header">
              <TableHeadFilter
                name="研发阶段"
                :offset="-12"
                :props="{ label: 'label' }"
                :options="
                  (yfmx_filtres['phase'] || []).map((t) => ({
                    label: t,
                  }))"
                  prop="phase"
                  :saved_condition="yfmx_saved_condition"
                @confirm="yfmx_confirm('phase', $event)"
                @cancel="yfmx_cancel('phase')"
              >
              </TableHeadFilter>
            </template>
          </el-table-column>
          <el-table-column label="国家地区" prop="country">
            <template slot="header">
              <TableHeadFilter
                name="国家地区"
                :offset="-12"
                :props="{ label: 'label' }"
                :options="
                  (yfmx_filtres['country'] || []).map((t) => ({
                    label: t,
                  }))
                "
                prop="country"
                :saved_condition="yfmx_saved_condition"
                @confirm="yfmx_confirm('country', $event)"
                @cancel="yfmx_cancel('country')"
              >
              </TableHeadFilter>
            </template>
            <template slot-scope="{ row }">
              <el-popover
                placement="right"
                width="300"
                :trigger="row.country ? 'hover' : 'click'"
              >
                <div>{{ row.country || "-" }}</div>
                <div slot="reference">{{ row.country || "-" }}</div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column label="原研单位" prop="company_standard">
            <template slot="header">
              <TableHeadFilter
                name="原研单位"
                :offset="-12"
                :props="{ label: 'label' }"
                :options="
                  (yfmx_filtres['company_standard'] || []).map((t) => ({
                    label: t,
                  }))
                "
                prop="company_standard"
                :saved_condition="yfmx_saved_condition"
                @confirm="yfmx_confirm('company_standard', $event)"
                @cancel="yfmx_cancel('company_standard')"
              >
              </TableHeadFilter>
            </template>
            <template slot-scope="{ row }">
              <el-popover
                placement="left"
                width="300"
                :trigger="row.company_standard.length == 0 ? 'click' : 'hover'"
              >
                <div>
                  <p v-for="(t, i) in row.company_standard" :key="i">
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
                  <p v-if="row.company_standard.length == 0">-</p>
                </div>
                <div slot="reference">
                  <p v-for="(t, i) in row.company_standard" :key="i">
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
                  <p v-if="row.company_standard.length == 0">-</p>
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column label="合作企业" prop="coo_company">
            <template slot="header">
              <TableHeadFilter
                name="合作企业"
                :offset="-12"
                :props="{ label: 'label' }"
                :options="
                  (yfmx_filtres['coo_company'] || []).map((t) => ({
                    label: t,
                  }))
                "
                prop="coo_company"
                :saved_condition="yfmx_saved_condition"
                @confirm="yfmx_confirm('coo_company', $event)"
                @cancel="yfmx_cancel('coo_company')"
              >
              </TableHeadFilter>
            </template>
            <template slot-scope="{ row }">
              <el-popover
                placement="left"
                width="300"
                :trigger="row.coo_company.length == 0 ? 'click' : 'hover'"
              >
                <div>
                  <p v-for="(t, i) in row.coo_company" :key="i">
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
                  <p v-if="row.coo_company.length == 0">-</p>
                </div>
                <div slot="reference">
                  <p v-for="(t, i) in row.coo_company" :key="i">
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
                  <p v-if="row.coo_company.length == 0">-</p>
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column label="许可单位" prop="per_company">
            <template slot="header">
              <TableHeadFilter
                name="许可单位"
                :offset="-12"
                :props="{ label: 'label' }"
                :options="
                  (yfmx_filtres['per_company'] || []).map((t) => ({
                    label: t,
                  }))
                "
                prop="per_company"
                :saved_condition="yfmx_saved_condition"
                @confirm="yfmx_confirm('per_company', $event)"
                @cancel="yfmx_cancel('per_company')"
              >
              </TableHeadFilter>
            </template>
            <template slot-scope="{ row }">
              <el-popover
                placement="left"
                width="300"
                :trigger="row.per_company.length == 0 ? 'click' : 'hover'"
              >
                <div>
                  <p v-for="(t, i) in row.per_company" :key="i">
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
                  <p v-if="row.per_company.length == 0">-</p>
                </div>
                <div slot="reference">
                  <p v-for="(t, i) in row.per_company" :key="i">
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
                  <p v-if="row.per_company.length == 0">-</p>
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            label="日期"
            prop="date"
            width="120"
          ></el-table-column>
          <el-table-column
            align="center"
            label="关联信息"
            prop="gl"
            width="100"
          >
            <template slot-scope="{ row }">
              <a
                v-if="row.source && row.source_id"
                style="color: #002fa7"
                target="_blank"
                @click="typedJump(row.source, row.source_id, row)"
                >【查看】</a
              >
            </template></el-table-column
          ></el-table
        >
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="yfms_page"
          :page-size="10"
          layout="total, prev, next"
          hide-on-single-page
          :total="yfms_total"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
// import LoadingGif from "@/components/common/globalCom/loading-gif";
import TableHeadFilter from "@/components/common/globaldrugs/table-head-filter";
// 适应症板块
export default {
  name: "yaowu-syz",
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
  components: { TableHeadFilter },
  data() {
    return {
      ypz: [],

      ypz_count: 0,
      ypz_filters: {}, // 已批准适应症 筛选项
      syzyfjx_orders: '', // 适应症研发进展排序条件
      syzyfjz: [],
      syzyfjz_loading: false,
      syzyfjz_page: 1,
      syzyfjz_count: 0,
      syzyfjz_filters: {}, // 适应症研发进展 筛选项
      syzyfjz_saved_condition: "", // 适应症研发进展 已选条件存储，翻页需要使用。
      global_line_map: [
        "#E5EFFE",
        "#C7DAFC",
        "#A6C3FD",
        "#7EABF9",
        "#4680FB",
        "#246AEE",
        "#002FA7",
      ],
      cn_line_map: [
        "#E1FBAE",
        "#CDF67C",
        "#BAE665",
        "#A7D356",
        "#86D252",
        "#74C600",
        "#5DB81B",
      ],
      yfmx: [],
      yfmx_show_header: true,
      yfmx_orders: '', // 适应症研发进展排序条件
      yfmx_loaded: false,
      yfms_page: 1,
      yfms_total: 0,
      yfmx_filtres: {
        indication:[],
        phase:[],
        country:[],
        company_standard: [],
        coo_company:[],
        per_company:[],
      }, // 适应症研发明细筛选项
      yfmx_saved_condition: "", // 适应症研发明细 已选条件存储
      Loading: true,
      yfjz_syz_options: [
        {
          label: "适应症0",
        },
        {
          label: "适应症1",
        },
        {
          label: "适应症2",
        },
        {
          label: "适应症3",
        },
        {
          label: "适应症4",
        },
        {
          label: "适应症5",
        },
      ],
    };
  },
  filters: {
    options(value) {
      return value.map(t => ({label: t}))
    }
  },
  methods: {
    ypz_confirm(payload) {
      let strs = payload.map((t) => t.label).join("ღ");
      let drugname = this.drugname_standard;
      let company = this.company_standard;
      let params = _.assign(
        {
          drugname_standard: drugname,
          company_standard: company,
          position: 1,
          filter_condition: `indication=` + strs,
        },
        {
          accesstoken: GETCOOKIEFUN("accesstoken"),
        }
      );
      if (!strs) {
        delete params.filter_condition;
      }
      let get_ypz = Axios({
        method: "get",
        url: "/api/globaldrugs/drugindication",
        params,
      });
      get_ypz.then((res) => {
        if (res.data.code == 200 && this.isEmpty(res.data.data)) {
          this.ypz = res.data.data.approved ? res.data.data.approved.list : [];
        }
      });
    },
    ypz_cancel() {
      let drugname = this.drugname_standard;
      let company = this.company_standard;
      let params = _.assign(
        {
          drugname_standard: drugname,
          company_standard: company,
          position: 1,
        },
        {
          accesstoken: GETCOOKIEFUN("accesstoken"),
        }
      );
      let get_ypz = Axios({
        method: "get",
        url: "/api/globaldrugs/drugindication",
        params,
      });
      get_ypz.then((res) => {
        if (res.data.code == 200 && this.isEmpty(res.data.data)) {
          this.ypz = res.data.data.approved ? res.data.data.approved.list : [];
        }
      });
    },
    syzyfjz_sort_change({ column, prop, order }) {
      if (prop) {
        this.syzyfjx_orders = `${prop} ${order == 'ascending'?'asc':'desc'}`
      } else {
        this.syzyfjx_orders = ''
      }
      this.handleSYJZChange(1);
    },
    syzyfjz_confirm(payload) {
      this.syzyfjz_loading = true;

      let strs = payload.map((t) => t.label).join("ღ");
      if (strs) {
        this.syzyfjz_saved_condition = "indication=" + strs;
      } else {
        this.syzyfjz_saved_condition = "";
      }
      let drugname = this.drugname_standard;
      let company = this.company_standard;
      let params = _.assign(
        {
          drugname_standard: drugname,
          company_standard: company,
          position: 2,
          page: 1,
          filter_condition: this.syzyfjz_saved_condition,
        },
        {
          accesstoken: GETCOOKIEFUN("accesstoken"),
        }
      );
      // if (!strs) {
      //   delete params.filter_condition;
      // }
      let get_syzyfjz = Axios({
        method: "get",
        url: "/api/globaldrugs/drugindication",
        params,
      });
      get_syzyfjz.then((res) => {
        this.syzyfjz_loading = false;
        if (res.data.code == 200 && this.isEmpty(res.data.data)) {
          this.syzyfjz = res.data.data.progress
            ? res.data.data.progress.list
            : [];
          this.syzyfjz_count = res.data.data.progress
            ? res.data.data.progress.count
            : 0;
        }
      });
    },
    syzyfjz_cancel() {
      this.syzyfjz_saved_condition = "";
      this.handleSYJZChange(1);
    },

    // 转换药物明细筛选字符串为对象
    decode_conditions(str) {
      let cache = str||this.yfmx_saved_condition;
      let condition_array = cache.split(" _and ");
      let condition_obj = {};
      condition_array.forEach((item) => {
        if (item) {
          let [key, value] = item.split("=");
          let val = value ? value.split("ღ") : [];
          if (key&&key.replace(/\s/g,'')) {
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
    yfmx_sort_change({ column, prop, order }) {
      if (prop) {
        this.yfmx_orders = `${prop} ${order == 'ascending'?'asc':'desc'}`
      } else {
        this.yfmx_orders = ''
      }
      this.handleCurrentChange(1);
      this.setTableFilterOptions()
    },
    yfmx_confirm(key, nodes) {
      let old_condition = this.decode_conditions();
      if (nodes.length) {
        old_condition[key] = nodes.map(t => (t.label));
      } else {
        delete old_condition[key];
      }
      let new_condition = this.encode_conditions(old_condition);
      this.yfmx_saved_condition = new_condition;
      console.log(new_condition);
      this.handleCurrentChange(1);
      this.setTableFilterOptions()
    },

    yfmx_cancel(key) {
      let old_condition = this.decode_conditions();
      delete old_condition[key];
      let new_condition = this.encode_conditions(old_condition);
      this.yfmx_saved_condition = new_condition;
      console.log(new_condition);
      this.handleCurrentChange(1);
      this.setTableFilterOptions()
    },

    // 根据接口获取联动后的 tablefilter
    setTableFilterOptions() {
      Axios({
        method: "get",
        url: '/api/globaldrugs/drugIndicationDetailLink',
        params: {
          drugname_standard: this.drugname_standard,
          company_standard: this.company_standard,
          filter_condition: this.yfmx_saved_condition
        }
      }).then(res => {
        if (res.data.code == 200) {
          // 联动 有问题 出发不了 更新，重新挂载组件会导致已选条件丢失 修改非常麻烦。
          this.yfmx_filtres = res.data.data;
          // console.log(this.$refs.yfmx.layout, 'yfmx table')
          this.yfmx_show_header = false;
          this.$nextTick(() => {
            this.yfmx_show_header = true;
          })
        }
      })
    },

    // 根据类型 去跳转 查看的方法
    typedJump(source, id, row) {
      let typeMap = {
        全球临床: "/clinical/" + id,
        中国临床: "/linchuangshiyan/" + id,
        注册: "/zhuce/" + id,
        中国: () => {
          if (row.link.tp == 1) {
            return `/cfdadrug/detail/${row.link.id}?pizhunwenhao=${row.link.pizhunwenhao}`;
          } else {
            return `/cfdadrug/jkdetail/${row.link.id}?pizhunwenhao=${row.link.pizhunwenhao}`;
          }
        },
        美国: `/fdadrugnew/${row.link.id}`,
        欧盟EMA: `/epyp/emadetail/${row.link.id}`,
        欧盟HMA: `/epyp/hmadetail/${row.link.id}`,
        日本: `/pmda/${row.link.id}`,
        英国: `/uk/${row.link.id}`,
        中国台湾: `/taiwan/${row.link.id}`,
        德国: `/germany/${row.link.id}`,
        加拿大: `/canada/${row.link.id}`,
        法国: `/france/${row.link.id}`,
        印度: `/india/${row.link.id}`,
        韩国: `/korean/${row.link.id}`,
      };

      _paq.push([
        "trackEvent",
        "button",
        "click",
        "企业版_全球药物_药物详情_适应症_适应症研发明细_关联信息_" +
          source +
          "_id:" +
          id,
      ]);
      let href =
        typeof typeMap[source] == "function"
          ? typeMap[source]()
          : typeMap[source];
      window.open(href, "_blank");
    },
    async handleCurrentChange(val) {
      _paq.push([
        "trackEvent",
        "button",
        "click",
        "企业版_全球药物_药物详情_适应症_适应症研发明细_翻页_" + val,
      ]);
      this.Loading = true;
      let drugname = this.drugname_standard;
      let company = this.company_standard;
      let params = _.assign(
          {
            drugname_standard: drugname,
            company_standard: company,
            position: 3,
            page: val,
            pageSize: 10,
            filter_condition: this.yfmx_saved_condition,
            order: this.yfmx_orders
          },
          {
            accesstoken: GETCOOKIEFUN("accesstoken"),
          }
        )
      let yfmx_res = await Axios({
        method: "get",
        url: "/api/globaldrugs/drugindication",
        params
      });
      this.Loading = false;
      if (yfmx_res.data.code == 200) {
        this.yfms_total = yfmx_res.data.data.detail
          ? yfmx_res.data.data.detail.count
          : 0;
        this.yfms_page = yfmx_res.data.data.detail
          ? yfmx_res.data.data.detail.page
          : 0;
        this.yfmx = yfmx_res.data.data.detail
          ? yfmx_res.data.data.detail.list
          : [];
      }
    },
    async handleSYJZChange(val = 1) {
      let drugname = this.drugname_standard;
      let company = this.company_standard;
      this.syzyfjz_loading = true;
      let syzyfjz_res = await Axios({
        method: "get",
        url: "/api/globaldrugs/drugindication",
        params: _.assign(
          {
            drugname_standard: drugname,
            company_standard: company,
            position: 2,
            page: val,
            filter_condition: this.syzyfjz_saved_condition,
            order: this.syzyfjx_orders
          },
          {
            accesstoken: GETCOOKIEFUN("accesstoken"),
          }
        ),
      });
      this.syzyfjz_loading = false;
      if (syzyfjz_res.data.code == 200 && this.isEmpty(syzyfjz_res.data.data)) {
        this.syzyfjz_count = syzyfjz_res.data.data.progress
          ? syzyfjz_res.data.data.progress.count
          : 0;
        this.syzyfjz = syzyfjz_res.data.data.progress
          ? syzyfjz_res.data.data.progress.list
          : [];
        this.syzyfjz_page = val;
      }
    },
    findEnumIndex(num) {
      let enums = [10, 20, 30, 40, 50, 60, 70];
      return enums.findIndex((t) => t == num);
    },
  },
  mounted() {
    let drugname = this.drugname_standard;
    let company = this.company_standard;
    let get_ypz = Axios({
      method: "get",
      url: "/api/globaldrugs/drugindication",
      params: _.assign(
        {
          drugname_standard: drugname,
          company_standard: company,
          position: 1,
        },
        {
          accesstoken: GETCOOKIEFUN("accesstoken"),
        }
      ),
    });
    let get_syzyfjz = Axios({
      method: "get",
      url: "/api/globaldrugs/drugindication",
      params: _.assign(
        {
          drugname_standard: drugname,
          company_standard: company,
          position: 2,
          page: this.syzyfjz_page,
        },
        {
          accesstoken: GETCOOKIEFUN("accesstoken"),
        }
      ),
    });
    let get_yfmx = Axios({
      method: "get",
      url: "/api/globaldrugs/drugindication",
      params: _.assign(
        {
          drugname_standard: drugname,
          company_standard: company,
          position: 3,
          pageSize: 10,
        },
        {
          accesstoken: GETCOOKIEFUN("accesstoken"),
        }
      ),
    });
    // 并发请求
    Axios.all([get_ypz, get_syzyfjz, get_yfmx]).then(
      Axios.spread((ypz_res, syzyfjz_res, yfmx_res) => {
        this.Loading = false;
        if (ypz_res.data.code == 200 && this.isEmpty(ypz_res.data.data)) {
          this.ypz_count = ypz_res.data.data.approved
            ? ypz_res.data.data.approved.count
            : 0;
          this.ypz = ypz_res.data.data.approved
            ? ypz_res.data.data.approved.list
            : [];
          this.ypz_filters = ypz_res.data.data.approved
            ? ypz_res.data.data.approved.filters
            : {};
        }

        if (
          syzyfjz_res.data.code == 200 &&
          this.isEmpty(syzyfjz_res.data.data)
        ) {
          this.syzyfjz_count = syzyfjz_res.data.data.progress
            ? syzyfjz_res.data.data.progress.count
            : 0;
          this.syzyfjz = syzyfjz_res.data.data.progress
            ? syzyfjz_res.data.data.progress.list
            : [];
          this.syzyfjz_filters = syzyfjz_res.data.data.progress
            ? syzyfjz_res.data.data.progress.filters
            : {};
        }

        if (yfmx_res.data.code == 200 && this.isEmpty(yfmx_res.data.data)) {
          this.yfms_total = yfmx_res.data.data.detail
            ? yfmx_res.data.data.detail.count
            : 0;
          this.yfms_page = yfmx_res.data.data.detail
            ? yfmx_res.data.data.detail.page
            : 0;
          this.yfmx = yfmx_res.data.data.detail
            ? yfmx_res.data.data.detail.list
            : [];
          this.yfmx_filtres = yfmx_res.data.data.detail
            ? yfmx_res.data.data.detail.filters
            : {};
          this.yfmx_loaded = true;
        }
        if (
          !this.isEmpty(ypz_res.data.data.approved.list) &&
          !this.isEmpty(syzyfjz_res.data.data.progress.list) &&
          !this.isEmpty(yfmx_res.data.data.detail.list)
        ) {
          this.$root.$emit("hide-section", "适应症");
        }
        this.$root.$emit("适应症", {
          count: this.ypz_count + this.syzyfjz_count,
        });
      })
    );
  },
};
</script>

<style scoped lang="less">
@import url(./table-style.less);
.syz {
  padding: 10px;
  position: relative;
  &-section {
    margin-bottom: 10px;
  }
  .section-title {
    padding: 10px;
    line-height: 1;
    font-size: 14px;
    position: relative;
    &::before {
      width: 2px;
      height: 14px;
      display: block;
      content: "";
      background-color: #002fa7;
      position: absolute;
      left: 0;
    }
  }
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
      display: inline-flex;
      .line-item_label {
        font-size: 12px;
        color: #fff;
        position: absolute;
        line-height: 14px;
        right: calc(20%);
      }
    }
  }
  .global_line {
    .dark {
      color: #35384a;
    }
  }
  .china_line {
    .dark {
      color: #35384a;
    }
  }
  .yfjz-append {
    width: 100%;
    min-height: 50px;
    padding: 0 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-left: 1px solid #ebeef5;
    border-right: 1px solid #ebeef5;
    border-bottom: 1px solid #ebeef5;
    box-sizing: border-box;
  }
  .yfjz-page {
    .el-pagination {
      border-bottom: none;
      border-left: none;
      border-right: none;
      padding: 10px 10px 10px 10px;
    }
  }

  .yfjz-desc {
    display: flex;
    align-items: center;
    font-size: 12px;
    .linebar {
      width: 30px;
      height: 3px;
      border-radius: 2px;
      margin-right: 5px;
    }
    span {
      line-height: 1;
    }
  }
}
.yfdw {
  display: flex !important;
  font-size: 12px;
  -webkit-line-clamp: unset;
  max-height: unset;
  width: 100%;
  .label {
    width: 35px;
    white-space: nowrap;
  }
  .c {
    flex: 1;
    width: calc(100% - 35px);
    .hidden {
      display: block;
      width: 100%;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
}
/deep/.el-table {
  // td .cell {
  // overflow: visible;
  // text-overflow: unset;
  // & > div {
  //   text-overflow: unset;
  // }
  tbody tr td:last-child {
    padding-right: 0;
  }
}
/deep/.el-table.yfmx-table {
  td .cell {
    padding: 8px 5px 8px 14px;
  }
  td .cell > span {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    max-height: 35px;
  }
}
</style>
