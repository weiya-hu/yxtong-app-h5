<template>
  <div class="wrapper" ref="wrapper">
    <!-- 自定义加载界面 -->
    <LoadingGif :loadFlag="isLoading" v-if="isLoading"></LoadingGif>
    <!-- 加载完成显示部分 -->
    <div class="detail-list" v-else>
      <div class="main">
        <slide-section :title="'患者信息'" class="the-part part-one">
          <div class="tb-wrap">
            <table class="tb-t">
              <tr>
                <td>报告号</td>
                <td>
                  <span>{{ data.baseInfo.primaryid }}</span>
                </td>
                <td>发送报告的厂商编码名称</td>
                <td>
                  <span>{{ data.baseInfo.mfr_sndr }}</span>
                </td>
                <!-- <td>治疗周期</td>
                <td>
                  <span
                    :style="wordBreak"
                    class="t-line5"
                    v-if="vueCheckDetailPms('Faers', '治疗周期')"
                  >
                    <template v-for="(item, ix) in data.baseInfo.dur">
                      <span
                        :key="ix"
                        v-if="ix < data.baseInfo.dur.length - 1"
                        style="display: flex;width: 95%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;"
                        >{{ item + ";" }}</span
                      >
                      <span
                        v-else
                        :key="ix"
                        style="display: flex;width: 95%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;"
                        >{{ item }}</span
                      >
                    </template>
                  </span>
                  <div v-else class="abandon-click-method">暂无权限</div>
                </td> -->
              </tr>
              <tr>
                <td>病例号</td>
                <td>
                  <span>{{ data.baseInfo.caseid }}</span>
                </td>
                <td>
                  患者疾病转归
                  <el-tooltip
                    class="item tooltips-position"
                    effect="light"
                    placement="right"
                  >
                    <div slot="content" v-html="helpDesc.outc_cod"></div>
                    <i class="el-icon-question cl-green"></i>
                  </el-tooltip>
                </td>
                <td>
                  <span
                    :style="wordBreak"
                    class="t-line5"
                    v-if="vueCheckDetailPms('Faers', '患者疾病转归')"
                  >
                    <div v-for="(item, ix) in data.baseInfo.outc_cod"
                      :key="ix"
                      class="link-a"
                    >
                      <span
                        @click="linkTo(`/faers`, { outc_cod: `${item}` })"
                        v-if="ix < data.baseInfo.outc_cod.length - 1"
                        :title="outc_codComp(item)"
                      >
                        {{ outc_codComp(item) + ";" }}
                      </span>
                      <span
                        v-else
                        @click="linkTo(`/faers`, { outc_cod: `${item}` })"
                        :title="outc_codComp(item)"
                      >
                        {{ outc_codComp(item) }}
                      </span>
                    </div>
                  </span>
                  <div v-else class="abandon-click-method">暂无权限</div>
                </td>
              </tr>
              <tr>
                <td>年龄(岁)</td>
                <td>
                  <span>{{ data.baseInfo.age }}</span>
                </td>
                <td>药物复发反应</td>
                <td>
                  <span
                    :style="wordBreak"
                    class="t-line5"
                    v-if="vueCheckDetailPms('Faers', '药物复发反应')"
                  >
                    <template v-for="(item, ix) in data.baseInfo.drug_rec_act">
                      <span
                        :key="ix"
                        v-if="ix < data.baseInfo.drug_rec_act.length - 1"
                        style="display: flex;width: 95%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;"
                        >{{ item + ";" }}</span
                      >
                      <span
                        v-else
                        :key="ix"
                        style="display: flex;width: 95%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;"
                        >{{ item }}</span
                      >
                    </template>
                  </span>
                  <div v-else class="abandon-click-method">暂无权限</div>
                </td>
              </tr>
              <tr>
                <td>
                  性别
                  <el-tooltip
                    class="item tooltips-position"
                    effect="light"
                    placement="right"
                  >
                    <div slot="content" v-html="helpDesc.sex"></div>
                    <i class="el-icon-question cl-green"></i>
                  </el-tooltip>
                </td>
                <td>
                  <span>{{ sexComp }}</span>
                </td>
                <td>FDA收到最初案例的日期</td>
                <td>
                  <span>{{ data.baseInfo.init_fda_dt }}</span>
                </td>
              </tr>
              <tr>
                <td>
                  体重(kg)
                </td>
                <td>
                  <span>{{ data.baseInfo.me_wt_guifan }}</span>
                </td>
                <td>FDA收到报告日期</td>
                <td>
                  <span>{{ data.baseInfo.fda_dt }}</span>
                </td>
              </tr>
              <tr>
                <td>国家</td>
                <td>
                  <span>{{ data.baseInfo.occr_country }}</span>
                </td>
                <td>
                  报告类型
                  <el-tooltip
                    class="item tooltips-position"
                    effect="light"
                    placement="right"
                  >
                    <div slot="content" v-html="helpDesc.rept_cod"></div>
                    <i class="el-icon-question cl-green"></i>
                  </el-tooltip>
                </td>
                <td>
                  <span>{{ rept_codComp }}</span>
                </td>
              </tr>
              <tr>
                <td>适应症</td>
                <td>
                  <div v-for="(item, ix) in data.baseInfo.indi_pt" :key="ix" class="link-a">
                    <span
                      @click="linkTo(`/faers`, { indi_pt: `${item}` })"
                      v-if="ix < data.baseInfo.indi_pt.length - 1"
                      :title="item"
                    >
                      {{ item + ";" }}
                    </span>
                    <span
                      v-else
                      @click="linkTo(`/faers`, { indi_pt: `${item}` })"
                      :title="item"
                    >
                      {{ item }}
                    </span>
                  </div>
                </td>
                <td>报告来源</td>
                <td>
                  <span
                    :style="wordBreak"
                    class="t-line5"
                    v-if="vueCheckDetailPms('Faers', '报告来源')"
                  >
                    <div v-for="(item, ix) in data.baseInfo.rpsr_cod" :key="ix" class="link-a">
                      <div
                        @click="linkTo(`/faers`, { rpsr_cod: `${item}` })"
                        v-if="ix < data.baseInfo.rpsr_cod.length - 1"
                        :title="rpsr_codComp(item)"
                      >
                        {{ rpsr_codComp(item) + ";" }}
                      </div>
                      <div
                        v-else
                        @click="linkTo(`/faers`, { rpsr_cod: `${item}` })"
                        :title="rpsr_codComp(item)"
                      >
                        {{ rpsr_codComp(item) }}
                      </div>
                    </div>
                  </span>
                  <div v-else class="abandon-click-method">暂无权限</div>
                </td>
              </tr>
              <tr>
                <td>不良事件发生日期</td>
                <td>
                  <span>{{ data.baseInfo.event_dt }}</span>
                </td>
                <td>
                  报告者职业
                  <el-tooltip
                    class="item tooltips-position"
                    effect="light"
                    placement="right"
                  >
                    <div slot="content" v-html="helpDesc.occp_cod"></div>
                    <i class="el-icon-question cl-green"></i>
                  </el-tooltip>
                </td>
                <td>
                    <div
                      class="link-a"
                    >
                      <span @click="linkTo(`/faers`, { occp_cod: `${data.baseInfo.occp_cod}` })">{{ occp_codComp(data.baseInfo.occp_cod) }}</span>
                    </div>
                </td>
              </tr>
              <tr>
                <td>不良事件</td>
                <td>
                  <span
                    :style="wordBreak"
                    class="t-line5"
                    v-if="vueCheckDetailPms('Faers', '不良事件')"
                  >
                    <div v-for="(item, ix) in data.baseInfo.pt" :key="ix" class="link-a">
                      <span
                        @click="linkTo(`/faers`, { pt: `${item}` })"
                        v-if="ix < data.baseInfo.pt.length - 1"
                      >
                        {{ item + ";" }}
                      </span>
                      <span
                        v-else
                        @click="linkTo(`/faers`, { pt: `${item}` })"
                      >
                        {{ item }}
                      </span>
                    </div>
                  </span>
                  <div v-else class="abandon-click-method">暂无权限</div>
                </td>
                <td>文献参考信息</td>
                <td>
                  <span>{{ data.baseInfo.lit_ref }}</span>
                </td>
              </tr>
              <tr>
                <!-- <td>治疗开始日期</td>
                <td>
                  <span
                    :style="wordBreak"
                    class="t-line5"
                    v-if="vueCheckDetailPms('Faers', '治疗开始日期')"
                  >
                    <template v-for="(item, ix) in data.baseInfo.START_DT">
                      <span
                        :key="ix"
                        v-if="ix < data.baseInfo.START_DT.length - 1"
                        style="display: flex;width: 95%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;"
                        >{{ item + ";" }}</span
                      >
                      <span
                        v-else
                        :key="ix"
                        style="display: flex;width: 95%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;"
                        >{{ item }}</span
                      >
                    </template>
                  </span>
                  <div v-else class="abandon-click-method">暂无权限</div>
                </td> -->
                <td>厂商编号</td>
                <td colspan="3">
                  <span>{{ data.baseInfo.mfr_num }}</span>
                </td>
              </tr>
              <tr>
                <!-- <td>治疗结束日期</td>
                <td>
                  <span
                    :style="wordBreak"
                    class="t-line5"
                    v-if="vueCheckDetailPms('Faers', '治疗结束日期')"
                  >
                    <template v-for="(item, ix) in data.baseInfo.END_DT">
                      <span
                        :key="ix"
                        v-if="ix < data.baseInfo.END_DT.length - 1"
                        style="display: flex;width: 95%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;"
                        >{{ item + ";" }}</span
                      >
                      <span
                        v-else
                        :key="ix"
                        style="display: flex;width: 95%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;"
                        >{{ item }}</span
                      >
                    </template>
                  </span>
                  <div v-else class="abandon-click-method">暂无权限</div>
                </td> -->
              </tr>
            </table>
          </div>
        </slide-section>

        <slide-section :title="'药品信息'" class="the-part part-two">
          <div class="tb-wrap">
            <table class="tb-t">
              <tr>
                <!-- <td>药品序列号</td>
                <td>
                  <span
                    :style="wordBreak"
                    class="t-line5"
                    v-if="vueCheckDetailPms('Faers', '药品序列号')"
                  >
                    <template v-for="(item, ix) in data.drugInfo.drug_seq">
                      <span
                        :key="ix"
                        v-if="ix < data.drugInfo.drug_seq.length - 1"
                        style="display: flex;width: 95%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;"
                        >{{ item + ";" }}</span
                      >
                      <span
                        v-else
                        :key="ix"
                        style="display: flex;width: 95%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;"
                        >{{ item }}</span
                      >
                    </template>
                  </span>
                  <div v-else class="abandon-click-method">暂无权限</div>
                </td> -->
                <!-- <td>给药剂量及频次</td>
                <td>
                  <span
                    :style="wordBreak"
                    class="t-line5"
                    v-if="vueCheckDetailPms('Faers', '给药剂量及频次')"
                  >
                    <template v-for="(item, ix) in data.drugInfo.dose_vbm">
                      <span
                        :key="ix"
                        v-if="ix < data.drugInfo.dose_vbm.length - 1"
                        style="display: flex;width: 95%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;"
                        >{{ item + ";" }}</span
                      >
                      <span
                        v-else
                        :key="ix"
                        style="display: flex;width: 95%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;"
                        >{{ item }}</span
                      >
                    </template>
                  </span>
                  <div v-else class="abandon-click-method">暂无权限</div>
                </td> -->
              </tr>
              <tr>
                <td>主要可疑药品</td>
                <td>
                  <span
                    :style="wordBreak"
                    class="t-line5"
                    v-if="vueCheckDetailPms('Faers', '主要可疑药品')"
                  >
                    <div
                      v-for="(item, ix) in data.drugInfo.me_prod_ai_guifan_ps"
                      :key="ix"
                      class="link-a"
                    >
                      <span
                        @click="
                          linkTo(`/faers`, { me_prod_ai_guifan_ps: `${item}` })
                        "
                        v-if="
                          ix < data.drugInfo.me_prod_ai_guifan_ps.length - 1
                        "
                        :title="item"
                      >
                        {{ item + ";" }}
                      </span>
                      <span
                        v-else
                        @click="
                          linkTo(`/faers`, { me_prod_ai_guifan_ps: `${item}` })
                        "
                        :title="item"
                      >
                        {{ item }}
                      </span>
                    </div>
                  </span>
                  <div v-else class="abandon-click-method">暂无权限</div>
                </td>
                <td>
                  相互作用药物
                </td>
                <td>
                  <span
                    :style="wordBreak"
                    class="t-line5"
                    v-if="vueCheckDetailPms('Faers', '相互作用药物')"
                  >
                    <div
                      v-for="(item, ix) in data.drugInfo.me_prod_ai_guifan_i"
                      :key="ix"
                      class="link-a"
                    >
                      <span
                        @click="
                          linkTo(`/faers`, { me_prod_ai_guifan_i: `${item}` })
                        "
                        v-if="ix < data.drugInfo.me_prod_ai_guifan_i.length - 1"
                        :title="item"
                      >
                        {{ item + ";" }}
                      </span>
                      <span
                        v-else
                        div
                        @click="
                          linkTo(`/faers`, { me_prod_ai_guifan_i: `${item}` })
                        "
                        :title="item"
                      >
                        {{ item }}
                      </span>
                    </div>
                  </span>
                  <div v-else class="abandon-click-method">暂无权限</div>
                </td>
                <!-- <td>首次反应的累积剂量</td>
                <td>
                  <span
                    :style="wordBreak"
                    class="t-line5"
                    v-if="vueCheckDetailPms('Faers', '首次反应的累积剂量')"
                  >
                    <template v-for="(item, ix) in data.drugInfo.cum_dose_chr">
                      <span
                        :key="ix"
                        v-if="ix < data.drugInfo.cum_dose_chr.length - 1"
                        style="display: flex;width: 95%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;"
                        >{{ item + ";" }}</span
                      >
                      <span
                        v-else
                        :key="ix"
                        style="display: flex;width: 95%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;"
                        >{{ item }}</span
                      >
                    </template>
                  </span>
                  <div v-else class="abandon-click-method">暂无权限</div>
                </td> -->
                <!-- </tr>
              <tr> -->

                <!-- <td>
                  去激发码
                  <el-tooltip
                    class="item tooltips-position"
                    effect="light"
                    placement="right"
                  >
                    <div slot="content" v-html="helpDesc.rechal"></div>
                    <i class="el-icon-question cl-green"></i>
                  </el-tooltip>
                </td>
                <td>
                  <span
                    :style="wordBreak"
                    class="t-line5"
                    v-if="vueCheckDetailPms('Faers', '去激发码')"
                  >
                    <template v-for="(item, ix) in data.drugInfo.rechal">
                      <span
                        :key="ix"
                        v-if="ix < data.drugInfo.rechal.length - 1"
                        style="display: flex;width: 95%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;"
                        >{{ rechalComp(item) + ";" }}</span
                      >
                      <span
                        v-else
                        :key="ix"
                        style="display: flex;width: 95%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;"
                        >{{ rechalComp(item) }}</span
                      >
                    </template>
                  </span>
                  <div v-else class="abandon-click-method">暂无权限</div>
                </td> -->
              </tr>
              <tr>
                <td>次要可疑药品</td>
                <td>
                  <span
                    :style="wordBreak"
                    class="t-line5"
                    v-if="vueCheckDetailPms('Faers', '次要可疑药品')"
                  >
                    <div
                      v-for="(item, ix) in data.drugInfo.me_prod_ai_guifan_ss"
                      class="link-a"
                      :key="ix"
                    >
                      <span
                        @click="
                          linkTo(`/faers`, { me_prod_ai_guifan_ss: `${item}` })
                        "
                        v-if="
                          ix < data.drugInfo.me_prod_ai_guifan_ss.length - 1
                        "
                        :title="item"
                      >
                        {{ item + ";" }}
                      </span>
                      <span
                        v-else
                        @click="
                          linkTo(`/faers`, { me_prod_ai_guifan_ss: `${item}` })
                        "
                        :title="item"
                      >
                        {{ item }}
                      </span>
                    </div>
                  </span>
                  <div v-else class="abandon-click-method">暂无权限</div>
                </td>
                <td>给药途径</td>
                <td>
                  <span
                    :style="wordBreak"
                    class="t-line5"
                    v-if="vueCheckDetailPms('Faers', '给药途径')"
                  >
                    <div v-for="(item, ix) in data.drugInfo.route" :key="ix" style="
                          width: 27vw;
                          min-width: 270px;
                          overflow: hidden;
                          text-overflow: ellipsis;
                          white-space: nowrap;">
                      <span
                        :title="item"
                        v-if="ix < data.drugInfo.route.length - 1"
                        >{{ item + ";" }}</span
                      >
                      <span
                        v-else
                        :title="item"
                        >{{ item }}</span
                      >
                    </div>
                  </span>
                  <div v-else class="abandon-click-method">暂无权限</div>
                </td>
                <!-- <td>
                  再激发码
                  <el-tooltip
                    class="item tooltips-position"
                    effect="light"
                    placement="right"
                  >
                    <div slot="content" v-html="helpDesc.dechal"></div>
                    <i class="el-icon-question cl-green"></i>
                  </el-tooltip>
                </td>
                <td>
                  <span
                    :style="wordBreak"
                    class="t-line5"
                    v-if="vueCheckDetailPms('Faers', '再激发码')"
                  >
                    <template v-for="(item, ix) in data.drugInfo.dechal">
                      <span
                        :key="ix"
                        v-if="ix < data.drugInfo.dechal.length - 1"
                        style="display: flex;width: 95%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;"
                        >{{ dechalComp(item) + ";" }}</span
                      >
                      <span
                        v-else
                        :key="ix"
                        style="display: flex;width: 95%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;"
                        >{{ dechalComp(item) }}</span
                      >
                    </template>
                  </span>
                  <div v-else class="abandon-click-method">暂无权限</div>
                </td> -->
                <!-- </tr>
              <tr> -->
                <!-- <td>药品批号</td>
                <td>
                  <span
                    :style="wordBreak"
                    class="t-line5"
                    v-if="vueCheckDetailPms('Faers', '药品批号')"
                  >
                    <template v-for="(item, ix) in data.drugInfo.lot_num">
                      <span
                        :key="ix"
                        v-if="ix < data.drugInfo.lot_num.length - 1"
                        style="display: flex;width: 95%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;"
                        >{{ item + ";" }}</span
                      >
                      <span
                        v-else
                        :key="ix"
                        style="display: flex;width: 95%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;"
                        >{{ item }}</span
                      >
                    </template>
                  </span>
                  <div v-else class="abandon-click-method">暂无权限</div>
                </td> -->
                <!-- <td>药品的有效期</td>
                <td>
                  <span
                    :style="wordBreak"
                    class="t-line5"
                    v-if="vueCheckDetailPms('Faers', '药品的有效期')"
                  >
                    <template v-for="(item, ix) in data.drugInfo.exp_dt">
                      <span
                        :key="ix"
                        v-if="ix < data.drugInfo.exp_dt.length - 1"
                        style="display: flex;width: 95%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;"
                        >{{ item + ";" }}</span
                      >
                      <span
                        v-else
                        :key="ix"
                        style="display: flex;width: 95%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;"
                        >{{ item }}</span
                      >
                    </template>
                  </span>
                  <div v-else class="abandon-click-method">暂无权限</div>
                </td> -->
              </tr>
              <tr>
                <td>伴随药物</td>
                <td colspan="3">
                  <span
                    :style="wordBreak"
                    class="t-line5"
                    v-if="vueCheckDetailPms('Faers', '伴随药物')"
                  >
                    <div
                      v-for="(item, ix) in data.drugInfo.me_prod_ai_guifan_c"
                      :key="ix"
                      class="link-a"
                    >
                      <span
                        @click="
                          linkTo(`/faers`, { me_prod_ai_guifan_c: `${item}` })
                        "
                        v-if="ix < data.drugInfo.me_prod_ai_guifan_c.length - 1"
                        :title="item"
                      >
                        {{ item + ";" }}
                      </span>
                      <span
                        v-else
                        @click="
                          linkTo(`/faers`, { me_prod_ai_guifan_c: `${item}` })
                        "
                        :title="item"
                      >
                        {{ item }}
                      </span>
                    </div>
                  </span>
                  <div v-else class="abandon-click-method">暂无权限</div>
                </td>
              </tr>
              <!-- <tr>
                <td>主要可疑药品剂量</td>
                <td>
                  <span
                    :style="wordBreak"
                    class="t-line5"
                    v-if="vueCheckDetailPms('Faers', '主要可疑药品剂量')"
                  >
                    <template v-for="(item, ix) in data.drugInfo.dose_amt">
                      <span
                        :key="ix"
                        v-if="ix < data.drugInfo.dose_amt.length - 1"
                        style="display: flex;width: 95%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;"
                        >{{ item + ";" }}</span
                      >
                      <span
                        v-else
                        :key="ix"
                        style="display: flex;width: 95%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;"
                        >{{ item }}</span
                      >
                    </template>
                  </span>
                  <div v-else class="abandon-click-method">暂无权限</div>
                </td>
                <td>剂量单位</td>
                <td>
                  <span
                    :style="wordBreak"
                    class="t-line5"
                    v-if="vueCheckDetailPms('Faers', '剂量单位')"
                  >
                    <template v-for="(item, ix) in data.drugInfo.dose_unit">
                      <span
                        :key="ix"
                        v-if="ix < data.drugInfo.dose_unit.length - 1"
                        style="display: flex;width: 95%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;"
                        >{{ item + ";" }}</span
                      >
                      <span
                        v-else
                        :key="ix"
                        style="display: flex;width: 95%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;"
                        >{{ item }}</span
                      >
                    </template>
                  </span>
                  <div v-else class="abandon-click-method">暂无权限</div>
                </td>
              </tr>
              <tr>
                <td>剂型</td>
                <td>
                  <span
                    :style="wordBreak"
                    class="t-line5"
                    v-if="vueCheckDetailPms('Faers', '剂型')"
                  >
                    <template v-for="(item, ix) in data.drugInfo.dose_form">
                      <span
                        :key="ix"
                        v-if="ix < data.drugInfo.dose_form.length - 1"
                        style="display: flex;width: 95%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;"
                        >{{ item + ";" }}</span
                      >
                      <span
                        v-else
                        :key="ix"
                        style="display: flex;width: 95%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;"
                        >{{ item }}</span
                      >
                    </template>
                  </span>
                  <div v-else class="abandon-click-method">暂无权限</div>
                </td>
                <td>用药频次</td>
                <td>
                  <span
                    :style="wordBreak"
                    class="t-line5"
                    v-if="vueCheckDetailPms('Faers', '用药频次')"
                  >
                    <template v-for="(item, ix) in data.drugInfo.dose_freq">
                      <span
                        :key="ix"
                        v-if="ix < data.drugInfo.dose_freq.length - 1"
                        style="display: flex;width: 95%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;"
                        >{{ item + ";" }}</span
                      >
                      <span
                        v-else
                        :key="ix"
                        style="display: flex;width: 95%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;"
                        >{{ item }}</span
                      >
                    </template>
                  </span>
                  <div v-else class="abandon-click-method">暂无权限</div>
                </td>
              </tr> -->
            </table>
          </div>
        </slide-section>

        <slide-section
          :title="'扩展信息'"
          class="the-part"
          v-if="extendList && extendList.length"
        >
          <div class="extend-list">
            <ExtendButton
              v-for="(item, index) in extendList"
              :key="index"
              :item="item"
            ></ExtendButton>
          </div>
        </slide-section>
      </div>
    </div>
    <la-footer></la-footer>
  </div>
</template>

<script>
import LoadingGif from "@/components/common/globalCom/loading-gif";
import List from "@/components/layouts/list";
import Export from "@/components/common/export";
import SlideSection from "@/components/common/slide-section";
import LaFooter from "@/components/layouts/footer";
import ExtendButton from "@/components/common/extend-button";
import { mapState } from "vuex";
import detailScrollMixins from "@/mixins/detailScroll";

export default {
  components: {
    List,
    Export,
    LoadingGif,
    SlideSection,
    LaFooter,
    ExtendButton
  },
  mixins: [detailScrollMixins],
  data() {
    return {
      colorF1: false,
      colorF2: false,
      isLoading: true,
      data: {},
      timeline: [],
      total: 0,
      devprocess: null,
      extendList: [], // 扩展信息
      posi: "position:static;text-align:right;padding:0 15px;",
      currentPage: 1,
      pageSize: 10,
      paramStr: {},
      wordBreak: "word-break: break-word;",
      helpDesc: {
        occp_cod:
          "职业类型的缩写解释,MD-医生,PH-药剂师,OT-其他卫生专家,LW-律师,CN-消费者。",
        rept_cod:
          "报告提交类型的代码解释。EXP-加速(15天)、PER-定期(不加速)、DIR-直接提交。",
        sex: "患者性别的代码解释。M-男,F-女,UNK-未知。",
        outc_cod:
          "疾病转归代码解释。DE-死亡,LT-危及生命,HO-导致病人住院或延长住院时间,DS-造成永久性残疾,CA-先天性畸形,RI-需作处置以防永久性伤害,OT-其他重要医学事件。",
        rechal:
          "指示停止药物治疗后反应是否减弱(Y-阳性,N-阴性,U-未知,D-不适用)。",
        dechal:
          "重新开始药物治疗后是否再次发生反应(Y-阳性,N-阴性,U-未知,D-不适用)。"
      }
    };
  },
  computed: {
    ...mapState({
      allBase: state => state.Faers.allBase,
      helpInfo: state => state.Faers.helpInfo,
      nopms: state => state.Faers.nopms,
      param: state => state.Faers.param // 附加参数(存于vuex内)
    }),
    age_grpComp() {
      const obj = {
        N: "新生儿",
        I: "婴儿",
        C: "儿童",
        T: "青少年",
        A: "成人",
        E: "老年"
      };
      return obj[this.data.drugInfo.age_grp];
    },
    sexComp() {
      const obj = {
        M: "男",
        F: "女",
        UNK: "未知"
      };
      return obj[this.data.baseInfo.sex];
    },
    rept_codComp() {
      const obj = {
        EXP: "加速(15天)",
        PER: "定期(不加速)",
        DIR: "直接提交"
      };
      return obj[this.data.baseInfo.rept_cod];
    }
  },
  watch: {
  showPromtNotice(val) {
      if (val) {
        if ($(".left-nav").css("top")) {
          $(".left-nav").css("top", "128px");
        }
      } else {
        if ($(".left-nav").css("top")) $(".left-nav").css("top", "98px");
      }
    }
  },
  methods: {
    linkTo(path, query) {
      const { href } = this.$router.resolve({
        path,
        query
      });
      window.open(href, "_blank");
    },
    occp_codComp(item) {
      const obj = {
        MD: "医生",
        PH: "药剂师",
        OT: "其他卫生专家",
        LW: "律师",
        CN: "消费者"
      };
      return obj[item];
    },
    dechalComp(item) {
      const obj = {
        Y: "阳性",
        N: "阴性",
        U: "未知",
        D: "不适用"
      };
      return obj[item];
    },
    rechalComp(item) {
      const obj = {
        Y: "阳性",
        N: "阴性",
        U: "未知",
        D: "不适用"
      };
      return obj[item];
    },
    rpsr_codComp(item) {
      const obj = {
        FGN: "国外",
        SDY: "研究",
        LIT: "文献",
        CSM: "消费者",
        HP: "卫生专业人员",
        UF: "用户设施",
        CR: "公司代表",
        DT: "经销商",
        OTH: "其他"
      };
      return obj[item];
    },
    outc_codComp(item) {
      const obj = {
        DE: "死亡",
        LT: "危及生命",
        HO: "导致病人住院或延长住院时间",
        DS: "造成永久性残疾",
        CA: "先天性畸形",
        RI: "需作处置以防永久性伤害",
        OT: "其他重要医学事件"
      };
      return obj[item];
    },
    splitHandler(datas) {
      let text = "";
      datas &&
        datas.length > 0 &&
        datas.forEach((item, i) => {
          text += item + (i < datas.length - 1 ? `;` : ``);
        });
      return text;
    },
    handleSizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    gaEvent(url) {
      window.open(url, "_blank");
    },
    async handleAxios() {
      // 详情信息
      await window
        .Axios({
          method: "get",
          url: "/api/faers/read/id/" + this.$route.params.id,
          params: {
            accesstoken: GETCOOKIEFUN("accesstoken")
          }
        })
        .then(res => {
          if (res.data.code === 200 && res.data.data) {
            let data = res.data.data;
            this.data = data;
            this.getExtendList("faers", this.data.extendList);
          }
        })
        .then(this.removeLoading)
        .catch(err => {
          console.log(err);
        });
    },
    // 加载完后移除加载界面
    removeLoading() {
      this.isLoading = false;
    }
  },
  created() {
    if (!this.nopms.xqy) {
      this.handleAxios();
    }
    setTimeout(() => {
      const hashLocation = sessionStorage.getItem("hashLocation"); //缓存中获取当前页面的路由名称
      // 注意, 这里使用全路径匹配,在hash模式中,因为地址会携带#,所以页面报告中的url需要重新覆盖一下, 将#去除
      window._paq.push(["setCustomUrl", "https://" + hashLocation]); //覆盖页面报告的url，可以自定义页面url，加上本页面路由
      window._paq.push(["trackPageView", this.allBase.dbname]); //页面名称,可以自定义页面名称
      window._paq.push(["setDocumentTitle", this.allBase.dbname]);
    }, 1000);
  },
  mounted() {
    Store.dispatch("Faers/getBaseInfo");
  },
  activated() {
    this.vueRouteToNoPms(this.nopms.xqy);
  },
  updated() {
    this.vueRouteToNoPms(this.nopms.xqy);
    this.vueTogglePmsTooltip();
  }
};
</script>

<style lang="less" scoped>
@import "~@/assets/less/var.less";
@import "~@/assets/less/detailCom.less";

@FontsizeSmall: 13px;
@FontsizeSmallBold: bold;
/deep/.header-fixed {
  position: unset !important;
}

.span-a {
  cursor: pointer;
  color: #4877e8;
  &:hover {
    text-decoration: underline;
  }
}

.action-btn {
  cursor: pointer;
  &:hover {
    color: #4877e8;
  }
}

.wrapper {
  .detail-list {
    .main {
      margin-top: 10px;
      .left-nav {
        transition: none !important;
      }
      .right-list {
        .the-part {
          .tb-wrap {
            .id-state {
              display: inline-block;
              padding: 0 12px;
              background: @Green;
              border-radius: 10px;
              height: 20px;
              line-height: 20px;
              color: #fff;
            }
            .tb-f1 {
              position: relative;
              margin-bottom: 10px;
              width: 100%;
              tr {
                height: 33px;
                line-height: 33px;

                th {
                  border: 1px solid @BorderColorNew;
                  font-size: @FontsizeSmall;
                  background: @DetailTableLeftColor;
                  font-weight: @FontsizeSmallBold;
                }
                td {
                  border: 1px solid @BorderColorNew;
                  font-size: @FontsizeSmall;
                  background: @DetailTableRightColor;
                  padding: 0 20px;
                  text-align: center;
                }

                .xuhao {
                  width: 20px;
                }
                .mc {
                  // width: 80px;
                }
                .yf {
                  text-align: left;
                }
              }
            }
            .tb-f2 {
              position: relative;
              margin-bottom: 10px;
              width: 100%;
              border-top: 1px solid @BorderColorNew;
              border-right: 1px solid @BorderColorNew;

              /deep/tr {
                height: 33px;
                line-height: 33px;

                /deep/th {
                  padding: 0;
                  border-left: 1px solid @BorderColorNew;
                  border-bottom: 1px solid @BorderColorNew;
                  font-size: @FontsizeSmall;
                  background: @DetailTableLeftColor;
                  font-weight: @FontsizeSmallBold;
                }
                /deep/td {
                  border-left: 1px solid @BorderColorNew;
                  border-bottom: 1px solid @BorderColorNew;
                  font-size: @FontsizeSmall;
                  background: @DetailTableRightColor;
                  padding: 0 20px;
                  text-align: center;
                }
              }

              /deep/.cell {
                padding: 0;
                text-align: center;
              }
            }
            /deep/.tb-f2.el-table:before {
              height: 0;
            }
            .h4 {
              font-size: 14px;
              font-weight: bold;
              height: 33px;
              line-height: 33px;
            }
            p {
              font-size: 13px;
            }
          }
        }
      }
    }
  }
}

/deep/.cell {
  max-height: 46px !important;
}
@media screen and (max-width: 1400px) {
  .wrapper
    .detail-list
    .main
    .right-list
    .part-two
    .time-line
    > li
    .time-tr
    .time-tr-info {
    width: 350px;
  }
}

/deep/.content {
  padding-bottom: 0 !important;
}

/deep/.el-pagination {
  padding-bottom: 50px !important;
}
/deep/.el-table {
  height: unset !important;
}

/deep/.slide-section .tb-t tr td[data-v-fddb5996]:nth-child(odd),
.slide-section .tb-f tr td[data-v-fddb5996]:nth-child(odd) {
  width: 200px;
}
.flex {
  display: flex;
}
.flex1 {
  flex: 1;
}
.t-line5 {
  display: block;
  max-height: 115px !important;
  overflow-y: auto;
}
.link-a {
  display: block;
  width: 27vw;
  min-width: 270px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #4877e8;

  span {
    cursor: pointer;
  }

  &:hover {
    text-decoration: underline;
  }
}
</style>
