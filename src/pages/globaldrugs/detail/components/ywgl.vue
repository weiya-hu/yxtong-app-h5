<template>
  <div class="ywgl">
    <div class="ywgl-up">
      <div class="flex1 ywinfo">
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
                  <el-popover
                    placement="right"
                    width="260"
                    :trigger="item.name?'hover':''"
                    :key="index"
                    :open-delay="500"
                    v-if="item.have_info"
                  >
                    <div v-loading="companyCardLoading" class="globaldrugs-company-content">
                      <div class="trangle"></div>

                      <div class="content">
                        <span class="title">企业名称：</span
                        ><span class="info">{{
                          companyCard.qiyemingcheng || "-"
                        }}</span>
                      </div>

                      <div class="content">
                        <span class="title">融资轮次：</span
                        ><span class="info">{{
                          companyCard.rongzileixing || "-"
                        }}</span>
                      </div>

                      <div class="content" v-if="companyCard.guobie">
                        <span class="title">企业地区：</span
                        ><span class="info"
                          >{{ companyCard.guobie }}
                          <span v-if="companyCard.shengfen"
                            >-{{ companyCard.shengfen }}</span
                          >
                          <span v-if="companyCard.chengshi"
                            >-{{ companyCard.chengshi }}</span
                          >
                        </span>
                      </div>

                      <div class="link-box">
                        <router-link
                          v-if="companyCard.drugname_count"
                          tag="a"
                          :to="
                            '/globaldrugs/companyDetail' +
                            '?company_standard=' +
                            encodeURIComponent(companyCard.hash_qiyemingcheng) +
                            '&activeModule=研发管线'
                          "
                          onclick="_paq.push(['trackEvent', 'button', 'click', '企业版_全球药物_药物详情_药物概览_企业卡片_查看企业管线',item.name ])"

                          target="_blank"
                          >管线：{{ companyCard.drugname_count }}</router-link
                        >

                        <router-link
                          v-if="companyCard.news"
                          tag="a"
                          :to="
                            '/globaldrugs/companyDetail' +
                            '?company_standard=' +
                            encodeURIComponent(companyCard.hash_qiyemingcheng) +
                            '&activeModule=新闻资讯'
                          "
                          onclick="_paq.push(['trackEvent', 'button', 'click', '企业版_全球药物_药物详情_药物概览_企业卡片_查看企业新闻资讯',item.name ])"

                          target="_blank"
                          >新闻资讯：{{ companyCard.news }}</router-link
                        >

                        <router-link
                          v-if="companyCard.trzInfo"
                          tag="a"
                          :to="'/trz/qiye/' + companyCard.trzInfo.wyuid"
                          target="_blank"
                          onclick="_paq.push(['trackEvent', 'button', 'click', '企业版_全球药物_药物详情_药物概览_企业卡片_查看企业投融资',item.name ])"

                          >投融资：{{
                            companyCard.trzInfo.doc_count
                          }}</router-link
                        >
                      </div>

                      <router-link
                        tag="a"
                        :to="
                          '/globaldrugs/companyDetail' +
                          '?company_standard=' +
                          encodeURIComponent(companyCard.hash_qiyemingcheng)
                        "
                        onclick="_paq.push(['trackEvent', 'button', 'click', '企业版_全球药物_药物详情_药物概览_原研企业跳转企业详情_'+item.name ])"
                        target="_blank"
                        class="look-detail"
                        >查看详情</router-link
                      >
                    </div>

                    <span
                      slot="reference"
                      @mouseover="getCompanyInfo(item.name, 1)"
                      @click="goCompany(item.hash_name, '原研企业')"
                      style="cursor: pointer"
                      class="hover-link"
                      >{{ item.name }}
                    </span>
                  </el-popover>
                  <span v-else class="no-link" :key="index">
                    {{ item.name }}</span
                  >
                  <span v-if="index !== base.company.company_standard.length - 1"
                          >;</span
                        >
                </template>
              </div>
            </div>
            <div class="flex item" v-if="base.company.coo_company.length">
              <span class="label">合作：</span>
              <div class="content">
                <template v-for="(item, index) in base.company.coo_company">
                  <el-popover
                    placement="right"
                    width="260"
                    :trigger="item.name?'hover':''"
                    :key="index"
                    :open-delay="500"
                    v-if="item.have_info"
                  >
                    <div v-loading="companyCardLoading" class="globaldrugs-company-content">
                      <div class="trangle"></div>

                      <div class="content">
                        <span class="title">企业名称：</span
                        ><span class="info">{{
                          companyCard.qiyemingcheng || "-"
                        }}</span>
                      </div>

                      <div class="content">
                        <span class="title">融资轮次：</span
                        ><span class="info">{{
                          companyCard.rongzileixing || "-"
                        }}</span>
                      </div>

                      <div class="content" v-if="companyCard.guobie">
                        <span class="title">企业地区：</span
                        ><span class="info"
                          >{{ companyCard.guobie }}
                          <span v-if="companyCard.shengfen"
                            >-{{ companyCard.shengfen }}</span
                          >
                          <span v-if="companyCard.chengshi"
                            >-{{ companyCard.chengshi }}</span
                          >
                        </span>
                      </div>

                      <div class="link-box">
                        <router-link
                          v-if="companyCard.drugname_count"
                          tag="a"
                          :to="
                            '/globaldrugs/companyDetail' +
                            '?company_standard=' +
                            encodeURIComponent(companyCard.hash_qiyemingcheng) +
                            '&activeModule=研发管线'
                          "
                          onclick="_paq.push(['trackEvent', 'button', 'click', '企业版_全球药物_药物详情_药物概览_企业卡片_查看企业管线',item.name ])"

                          target="_blank"
                          >管线：{{ companyCard.drugname_count }}</router-link
                        >

                        <router-link
                          v-if="companyCard.news"
                          tag="a"
                          :to="
                            '/globaldrugs/companyDetail' +
                            '?company_standard=' +
                            encodeURIComponent(companyCard.hash_qiyemingcheng) +
                            '&activeModule=新闻资讯'
                          "
                          onclick="_paq.push(['trackEvent', 'button', 'click', '企业版_全球药物_药物详情_药物概览_企业卡片_查看企业新闻资讯',item.name ])"

                          target="_blank"
                          >新闻资讯：{{ companyCard.news }}</router-link
                        >

                        <router-link
                          v-if="companyCard.trzInfo"
                          tag="a"
                          :to="'/trz/qiye/' + companyCard.trzInfo.wyuid"
                          target="_blank"
                          onclick="_paq.push(['trackEvent', 'button', 'click', '企业版_全球药物_药物详情_药物概览_企业卡片_查看企业投融资',item.name ])"

                          >投融资：{{
                            companyCard.trzInfo.doc_count
                          }}</router-link
                        >
                      </div>

                      <router-link
                        tag="a"
                        :to="
                          '/globaldrugs/companyDetail' +
                          '?company_standard=' +
                          encodeURIComponent(companyCard.hash_qiyemingcheng)
                        "
                        onclick="_paq.push(['trackEvent', 'button', 'click', '企业版_全球药物_药物详情_药物概览_合作企业跳转企业详情_'+item.name ])"
                        target="_blank"
                        class="look-detail"
                        >查看详情</router-link
                      >
                    </div>

                    <span
                      slot="reference"
                      @mouseover="getCompanyInfo(item.name)"
                      @click="goCompany(item.hash_name, '合作企业')"
                      style="cursor: pointer"
                      class="hover-link"
                      >{{ item.name }}
                    </span>
                  </el-popover>
                  <span v-else class="no-link" :key="index">
                    {{ item.name }}</span
                  >
                  <span v-if="index !== base.company.coo_company.length - 1"
                          >;</span
                        >
                </template>
              </div>
            </div>
            <div class="flex item" v-if="base.company.per_company.length">
              <span class="label">许可：</span>
              <div class="content">
                <template v-for="(item, index) in base.company.per_company">
                  <el-popover
                    placement="right"
                    width="260"
                    :trigger="item.name?'hover':''"
                    :key="index"
                    :open-delay="500"
                    v-if="item.have_info"
                  >
                    <div 
                    v-loading="companyCardLoading"
                    class="globaldrugs-company-content">
                      <div class="trangle"></div>

                      <div class="content">
                        <span class="title">企业名称：</span
                        ><span class="info">{{
                          companyCard.qiyemingcheng || "-"
                        }}</span>
                      </div>

                      <div class="content">
                        <span class="title">融资轮次：</span
                        ><span class="info">{{
                          companyCard.rongzileixing || "-"
                        }}</span>
                      </div>

                      <div class="content" v-if="companyCard.guobie">
                        <span class="title">企业地区：</span
                        ><span class="info"
                          >{{ companyCard.guobie }}
                          <span v-if="companyCard.shengfen"
                            >-{{ companyCard.shengfen }}</span
                          >
                          <span v-if="companyCard.chengshi"
                            >-{{ companyCard.chengshi }}</span
                          >
                        </span>
                      </div>

                      <div class="link-box">
                        <router-link
                          v-if="companyCard.drugname_count"
                          tag="a"
                          :to="
                            '/globaldrugs/companyDetail' +
                            '?company_standard=' +
                            encodeURIComponent(companyCard.hash_qiyemingcheng) +
                            '&activeModule=研发管线'
                          "
                          onclick="_paq.push(['trackEvent', 'button', 'click', '企业版_全球药物_药物详情_药物概览_企业卡片_查看企业管线',item.name ])"
                          target="_blank"
                          >管线：{{ companyCard.drugname_count }}</router-link
                        >

                        <router-link
                          v-if="companyCard.news"
                          tag="a"
                          :to="
                            '/globaldrugs/companyDetail' +
                            '?company_standard=' +
                            encodeURIComponent(companyCard.hash_qiyemingcheng) +
                            '&activeModule=新闻资讯'
                          "
                          onclick="_paq.push(['trackEvent', 'button', 'click', '企业版_全球药物_药物详情_药物概览_企业卡片_查看企业新闻',item.name ])"
                          target="_blank"
                          >新闻资讯：{{ companyCard.news }}</router-link
                        >

                        <router-link
                          v-if="companyCard.trzInfo"
                          tag="a"
                          :to="'/trz/qiye/' + companyCard.trzInfo.wyuid"
                          target="_blank"
                          onclick="_paq.push(['trackEvent', 'button', 'click', '企业版_全球药物_药物详情_药物概览_企业卡片_查看企业投融资',item.name ])"
                          >投融资：{{
                            companyCard.trzInfo.doc_count
                          }}</router-link
                        >
                      </div>

                      <router-link
                        tag="a"
                        onclick="_paq.push(['trackEvent', 'button', 'click', '企业版_全球药物_药物详情_药物概览_许可企业跳转企业详情_'+item.name ])"
                        :to="
                          '/globaldrugs/companyDetail' +
                          '?company_standard=' +
                          encodeURIComponent(companyCard.hash_qiyemingcheng)
                        "
                        target="_blank"
                        class="look-detail"
                        >查看详情</router-link
                      >
                    </div>

                    <span
                      slot="reference"
                      @mouseover="getCompanyInfo(item.name)"
                      @click="goCompany(item.hash_name, '许可企业')"
                      style="cursor: pointer"
                      class="hover-link"
                      >{{ item.name }}
                    </span>
                  </el-popover>
                  <span v-else class="no-link" :key="index">
                    {{ item.name }}</span
                  >
                  <span v-if="index !== base.company.per_company.length - 1"
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
                <more-text :lineHeight="20">
                  <span
                  class="tag"
                  v-for="(t, i) in base.indication['已批准']"
                  :key="'已批准_' + i"
                >
                  {{ t }}
                  {{ i < base.indication["已批准"].length - 1 ? ";" : "" }}
                </span>
                </more-text>
              </div>
            </div>
            <div
              class="flex item"
              v-if="base.indication['在研'] && isEmpty(base.indication['在研'])"
            >
              <span class="label blue">在研</span>
              <div class="content flex flex1">
                <more-text :lineHeight="20">
                  <span
                  class="tag"
                  v-for="(t, i) in base.indication['在研']"
                  :key="'在研_' + i"
                >
                  {{ t }}
                  {{ i < base.indication["在研"].length - 1 ? ";" : "" }}
                </span>
                </more-text>
              </div>
            </div>
            <div
              class="flex item"
              v-if="base.indication['终止'] && isEmpty(base.indication['终止'])"
            >
              <span class="label red">终止</span>
              <div class="content flex flex1">
                <more-text :lineHeight="20">
                  <span
                  class="tag"
                  v-for="(t, i) in base.indication['终止']"
                  :key="'终止_' + i"
                >
                  {{ t }}
                  {{ i < base.indication["终止"].length - 1 ? ";" : "" }}
                </span>
                </more-text>
              </div>
            </div>
          </div>
        </div>
        <div class="info-item" v-if="!(base.worldstatus['global']['name'] == '' && base.worldstatus['china']['name'] == '')">
          <div class="label">最高研发阶段：</div>
          <div class="content" style="display:flex;align-items:center;">
            <p>
              <div v-for="(t, k) in base.worldstatus"
              @click="linkYwlist(t, k)"
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
            <el-popover
              placement="right"
              width="260"
              :open-delay="500"
              v-for="badian in base.targets"
              :trigger="badian?'hover':''"
              :key="badian"
            >
              <div 
              v-loading="targetCardLoading"
              class="globaldrugs-company-content">
                <div class="trangle"></div>

                <div class="content">
                  <span class="title">靶点简称：</span
                  ><span class="info">{{
                    targetCard.targets_abbr || "-"
                  }}</span>
                </div>

                <div class="content">
                  <span class="title">靶点全称：</span
                  ><span class="info">{{ targetCard.targets || "-" }}</span>
                </div>

                <div class="content">
                  <span class="title" style="width: 90px">作用机制分类：</span
                  ><span class="info">{{ targetCard.actions || "-" }} </span>
                </div>

                <div class="content">
                  <span class="title" style="width: 90px">最高研发阶段：</span
                  ><span class="info">{{ targetCard.phase || "-" }} </span>
                </div>

                <div class="link-box">
                  <router-link
                    v-if="targetCard.drugname_count"

                    tag="a"
                    :to="
                      '/globaldrugs/list' +
                      '?targets=' +
                      encodeURIComponent(targetCard.targets_abbr)
                    "
                    onclick="_paq.push(['trackEvent', 'button', 'click', '企业版_全球药物_药物详情_药物概览_靶点卡片_查看靶点相关药品',badian ])"
                    target="_blank"
                    >药物：{{ targetCard.drugname_count }}</router-link
                  >

                  <router-link
                    v-if="targetCard.indication_count"
                    tag="a"
                    :to="
                      '/globaldrugs/target/detail' +
                      '?target=' +
                      encodeURIComponent(targetCard.hash_targets_abbr) +
                      '&activeModule=适应症'
                    "
                    onclick="_paq.push(['trackEvent', 'button', 'click', '企业版_全球药物_药物详情_药物概览_靶点卡片_查看靶点相关适应症',badian ])"
                    target="_blank"
                    >适应症：{{ targetCard.indication_count }}</router-link
                  >

                  <router-link
                    v-if="targetCard.news"
                    tag="a"
                    :to="
                      '/globaldrugs/target/detail' +
                      '?target=' +
                      encodeURIComponent(targetCard.hash_targets_abbr) +
                      '&activeModule=新闻资讯'
                    "
                    onclick="_paq.push(['trackEvent', 'button', 'click', '企业版_全球药物_药物详情_药物概览_靶点卡片_查看靶点相关新闻',badian ])"
                    target="_blank"
                    >新闻资讯：{{ targetCard.news }}</router-link
                  >
                </div>

                <router-link
                  tag="a"
                  :to="
                    '/globaldrugs/target/detail' +
                    '?target=' +
                    encodeURIComponent(targetCard.hash_targets_abbr)
                  "
                  onclick="_paq.push(['trackEvent', 'button', 'click', '企业版_全球药物_药物详情_药物概览_靶点卡片_查看靶点详情' ])"
                  target="_blank"
                  class="look-detail"
                  >查看详情</router-link
                >
              </div>
              <div
                class="badian"
                slot="reference"
                @mouseover="getTargetInfo(badian)"
                @click="goTarget(base.targets_map[badian])"
              >
                {{ badian }}
              </div>
            </el-popover>
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
        <div
          class="info-item"
          v-if="
            isEmpty(base.pharmaco) &&
            Object.values(base.pharmaco).some((t) => !!t)
          "
        >
          <div class="label">药效学/药动学：</div>
          <div class="content">
            <a
              href="javascript:void(0)"
              @click="dialogVisible = true"
              onclick="_paq.push(['trackEvent', 'button', 'click', '企业版_全球药物_药物详情_药物概览_药效学/药动学' ])"
              class="link"
              >【查看】</a
            >
          </div>
        </div>
      </div>
      <div class="flex1 ywhuaxue">
        <div class="huaxue">
          <div v-if="isEmpty(base.structpicture) && !structpictureerr" style="position: relative;
border: 1px solid #EBEEF5;border-radius: 3px;">
            <div class="preview flex" @click="showPreview = true" onclick="_paq.push(['trackEvent', 'button', 'click', '企业版_全球药物_药物详情_药物概览_全屏查看分子式' ])">
              <template v-if="!structpictureerr">
                <img src="@/assets/imgs/globaldrugs/quanpin_icon.png" alt="" />
              <span style="line-height: 1">全屏查看</span>
              </template>
              <image-viewer
                v-if="showPreview"
                :on-close="closeViewer"
                :url-list="[base.structpicture]"
              >
              
              </image-viewer>
            </div>
            <el-image
              style="width: 240px; height: 240px"
              :src="base.structpicture"
              fit="scale-down"
              @error="structpictureerr = true"
            >
            <div slot="error" class="image-slot" style="width: 100%;
    height: 100%;
    text-align: center;
    line-height: 240px;
    font-size: 50px;">
              <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
          </div>
          <div class="huaxue-desc">
            <!-- <div
              style="margin-bottom: 20px"
              class="huaxue-item"
              v-if="isEmpty(base.chemicalname)"
            >
              <div class="huaxue-item_label">化学名称：</div>
              <div class="huaxue-item_content hxmc">
                <span>{{ base.chemicalname }}</span>
              </div>
              <div
                v-show="showToggleHXMC"
                class="more-content"
                @click="toggleVisit"
              >
                <span></span>
                <i class="icon el-icon-d-arrow-right"></i>
              </div>
            </div> -->
            <div
              style="margin-bottom: 20px"
              class="huaxue-item"
              v-if="isEmpty(base.chemicalname)"
            >
              <div class="huaxue-item_label">化学名称：</div>
              <div class="huaxue-item_content">
                <more-text :content="base.chemicalname"/>
              </div>
            </div>
            <div class="huaxue-item" v-if="isEmpty(base.cas)">
              <div class="huaxue-item_label">CAS登记号：</div>
              <div class="huaxue-item_content">{{ base.cas }}</div>
            </div>
            <div class="huaxue-item" v-if="isEmpty(base.formulations)">
              <div class="huaxue-item_label">分子式：</div>
              <div class="huaxue-item_content">{{ base.formulations }}</div>
            </div>
            <div class="huaxue-item" v-if="isEmpty(base.formulaweight)">
              <div class="huaxue-item_label">分子量：</div>
              <div class="huaxue-item_content">{{ base.formulaweight }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="ywgl-down">
      <div class="info-item" v-if="isEmpty(base.summary)">
        <div class="label bold">药品概述：</div>
        <div class="content">
          <span v-html="base.summary">
          </span>
          <img
            style="
              display: none;
              vertical-align: middle;
              cursor: pointer;
            "
            width="17px"
            height="16px"
            src="@/assets/imgs/globaldrugs/edit_icon.png"
            alt=""
            @click="$root.$emit('handleOutClick1')"
            onclick="_paq.push(['trackEvent', 'button', 'click', '企业版_全球药物_药物详情_药物概览_意见反馈' ])"
          />
        </div>
      </div>
    </div>
    <el-dialog
      title="药效学/药动学"
      :modal="false"
      :visible.sync="dialogVisible"
    >
      <div class="pop-desc">
        <template v-for="(name, key) in pop_desc_map">
          <div v-if="base.pharmaco[key]" class="pop-desc-item" :key="key">
            <div class="pop-desc-item_label">{{ name }}:</div>
            <div class="pop-desc-item_content">
              {{ base.pharmaco[key] && base.pharmaco[key] }}
            </div>
          </div>
        </template>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 药物概览 板块
import ImageViewer from "@/components/common/image-previewer";
import MoreText from "@/components/common/more-text";
export default {
  name: "yaowu-gailan",
  components: { ImageViewer, MoreText },
  props: {
    base: {
      default: () => ({}),
      type: Object,
    },
  },
  data() {
    return {
      dialogVisible: false,
      structpictureerr: false,
      showPreview: false,
      pop_desc_map: {
        pharmacodynamics: "药效学",
        mechanism_of_action: "作用机制",
        protein: "蛋白结晶",
        halflife: "半衰期",
        toxicity: "毒理",
        absorption: "吸收",
        volume: "分布",
        metabolism: "代谢",
        route: "排泄",
        clearance: "清除",
      },
      targetCard: {},
      targetCardLoading: false,
      companyCard: {}, // 研发单位卡片信息
      companyCardLoading: false,
      showToggleHXMC: false,
    };
  },
  methods: {
    linkYwlist(obj, type) {
      let numObj = {};
      if (type == "global") {
        // 全球最高阶段
        numObj = {
          phase1: [String(obj.num)],
        };
      } else if (type == "china") {
        // 中国最高阶段
        numObj = {
          phase2: [String(obj.num)],
        };
      }
      let company_str = this.base.company.company_standard
        .map((t) => t.name)
        .join(";");
      _paq.push([
        "trackEvent",
        "button",
        "click",
        "企业版_全球药物_药物详情_药物概览_最高研发阶段",
      ]);
      let { href } = this.$router.resolve({
        path: "/globaldrugs",
        query: {
          drugname: this.base.ylbm,
          company: company_str,
          filter_condition: JSON.stringify(numObj),
        },
      });

      window.open(href, "_blank");
    },
    goTarget(item) {
      _paq.push([
        "trackEvent",
        "button",
        "click",
        "企业版_全球药物_药物详情_药物概览_靶点卡片_查看靶点详情",
        item,
      ]);
      let routeData = this.$router.resolve({
        path: "/globaldrugs/target/detail?target=" + encodeURIComponent(item),
      });
      window.open(routeData.href, "_blank");
    },
    closeViewer() {
      this.showPreview = false;
    },
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
    getTargetInfo(target) {
      this.targetCardLoading = true;
      this.targetCard = {};
      _paq.push([
        "trackEvent",
        "button",
        "click",
        "企业版_全球药物_药物详情_药物概览_靶点卡片_获取靶点卡片信息",
        target,
      ]);
      Axios({
        url: "/api/globaldrugs/targetCard",
        params: {
          target: target,
        },
      })
        .then((res) => {
          if (res.data.data) {
            this.targetCard = res.data.data;
          }
        })
        .finally(() => {
          this.targetCardLoading = false;
        });
    },
    getCompanyInfo(company, original = 0) {
      _paq.push([
        "trackEvent",
        "button",
        "click",
        "企业版_全球药物_药物详情_药物概览_查询企业_" + company,
      ]);
      this.companyCardLoading = true;
      this.companyCard = {};
      Axios({
        url: "/api/globaldrugs/companyCard",
        params: {
          company: company,
          is_original: original
        },
      })
        .then((res) => {
          if (res.data.data) {
            this.companyCard = res.data.data;
          }
        })
        .finally(() => {
          this.companyCardLoading = false;
        });
    },
    // 公司详情
    goCompany(item, qy) {
      _paq.push([
        "trackEvent",
        "button",
        "click",
        "企业版_全球药物_药物详情_药物概览_" + qy + "跳转企业详情_" + item,
      ]);
      let routeData = this.$router.resolve({
        path:
          "/globaldrugs/companyDetail?company_standard=" +
          encodeURIComponent(item),
      });
      window.open(routeData.href, "_blank");
    },
    //toggleVisit
    toggleVisit() {
      $(".hxmc").toggleClass("visible");
      $(".more-content").toggleClass("shouqi");
    },
  },
  watch: {
    "base.chemicalname": {
      handler(val) {
        if (val) {
          this.$nextTick(() => {
            console.log($(".hxmc span").height());
            if ($(".hxmc span").height() > 54) {
              this.showToggleHXMC = true;
            } else {
              this.showToggleHXMC = false;
            }
          });
        }
      },
      immediate: true,
    },
  },
};
</script>

<style scoped lang="less">
.ywgl {
  padding: 10px;

  .no-link {
    font-weight: normal;
  }
  .ywgl-up {
    display: flex;
    color: #333;
  }
  .flex1 {
    flex: 1;
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
      .link {
        color: #002fa7;
        text-decoration: none;
      }
      .badian {
        padding: 4px 10px;
        border-radius: 2px;
        border: 1px solid #dcdfe6;
        margin-right: 10px;
        color: #002fa7;
        line-height: 1;
        white-space: nowrap;
        &:hover {
          border-color: #002fa7;
          background-color: #002fa7;
          color: #fff;
          cursor: pointer;
        }
      }
    }
  }
  .ywgl-down {
    background-color: #fafbfd;
    margin-top: 10px;
    & > .label {
      font-weight: bold;
    }
    & > .content {
      flex: 1;
      word-break: break-all;
      font-size: 12px;
    }
  }
  .bold {
    font-weight: bold;
  }
  .ywhuaxue {
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    .huaxue {
      width: 100%;
      max-width: 634px;
      background-color: #fafbfd;
      border-radius: 3px;
      display: flex;
      align-items: center;
      align-self: flex-end;
      .preview {
        position: absolute;
        font-size: 12px;
        right: 7px;
        top: 7px;
        align-items: center;
        cursor: pointer;
        img {
          width: 14px;
          height: 14px;
          margin-right: 5px;
        }
      }
      .huaxue-desc {
        flex: 1;
      }
    }
    .huaxue-item {
      display: flex;
      margin-bottom: 10px;
      position: relative;
      &_label {
        font-weight: 500;
        width: 90px;
        text-align: right;
      }
      &_content {
        flex: 1;
        word-break: break-all;
        line-height: 18px;
        &.hxmc {
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          max-height: 54px;
          &.visible {
            max-height: unset;
            display: block;
            -webkit-line-clamp: unset;
            -webkit-box-orient: unset;
            overflow: visible;
            text-overflow: visible;
          }
        }
      }
      .more-content {
        position: absolute;
        bottom: -18px;
        left: 90px;
        cursor: pointer;
        color: #002fa7;
        &::before {
          content: "更多";
        }
        i {
          transform: rotate(90deg);
        }
        &.shouqi {
          i {
            transform: rotate(-90deg);
          }
          &::before {
            content: "收起";
          }
        }
      }
    }
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
.flex-dc {
  flex-direction: column;
}
/deep/.el-image__inner {
  width: 100%;
  height: 100%;
  background-color: #fff;
  border-radius: 3px;
  // border: 1px solid #ebeef5;
}
.pop-desc {
  height: 600px;
  overflow: auto;
  .pop-desc-item {
    display: flex;
    margin-bottom: 15px;
    &_label {
      width: 80px;
      font-weight: bold;
    }
    &_content {
      flex: 1;
      font-size: 12px;
    }
  }
}
.globaldrugs-company-content {
  font-size: 12px;
  position: relative;
  min-height: 140px;
  .trangle {
    width: 0;
    height: 0;
    border-top: 8px solid #002fa7;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-radius: 4px;
    transform: rotate(-135deg);
    position: absolute;
    right: -16px;
    top: -14px;
  }
  .content {
    margin-bottom: 10px;
    display: flex;

    .title {
      color: #9aa4b8;
      width: 65px;
    }

    .info {
      color: #333333;
      flex: 1;
      word-break: break-all;
    }
  }

  .link-box {
    display: flex;
    align-items: center;
    a {
      display: inline-block;
      padding: 4px 5px;
      box-sizing: border-box;
      background: #ebeef5;
      border-radius: 2px;
      border: 1px solid #dcdfe6;
      margin-right: 10px;
      white-space: nowrap;
      &:hover {
        text-decoration: none;
      }
    }
  }

  .look-detail {
    display: inline-block;
    padding: 4px 5px;
    box-sizing: border-box;
    background: #002fa7;
    border-radius: 2px;
    color: #fff;
    font-size: 12px;
    margin-top: 15px;
    &:hover {
      text-decoration: none;
    }
  }
}
.zgyf-item {
  margin-right: 5px;
  &:hover span:last-child {
    text-decoration: underline;
  }
}
.spss-item:not(:last-child):after {
  content: "，";
}
</style>
