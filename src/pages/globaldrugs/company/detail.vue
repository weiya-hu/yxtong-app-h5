<template>
  <div class="globaldrugs-company">
    <!-- 自定义加载界面 -->
    <LoadingGif :loadFlag="isLoading" v-if="isLoading"></LoadingGif>
    <!-- 顶部信息 -->
    <div class="company-head">
      <div style="display: flex; align-items: center">
        <template v-if="detailInfo.gsxx && detailInfo.gsxx.guobie !== '中国'">
          <img
            :src="
              (detailInfo.gsxx && detailInfo.gsxx.logo) ||
              '/static/imgs/globaldrugs/company/logo.png'
            "
            alt=""
          />
        </template>
        <template v-else>
          <img
            v-if="detailInfo.gsxx && detailInfo.gsxx.logo"
            :src="detailInfo.gsxx.logo"
            alt=""
          />
          <div v-else class="logo-box">
            {{
              detailInfo.qiyemingcheng
                ? detailInfo.qiyemingcheng.substring(0, 2)
                : ""
            }}<br />
            {{
              detailInfo.qiyemingcheng
                ? detailInfo.qiyemingcheng.substring(2, 4)
                : ""
            }}
          </div>
        </template>
        <div class="head-info">
          <h3 class="title">
            {{ detailInfo.qiyemingcheng }}
          </h3>
          <div class="tags" v-if="detailInfo.biaoqianzhi && detailInfo.biaoqianzhi.length">
            <span
              class="tag"
              :class="{
                tag1: item.type == 1,
                tag3: item.type == 6,
              }"
              v-if="detailInfo.biaoqianzhi.length > 0"
              v-for="(item, index) in detailInfo.biaoqianzhi"
              :key="index"
              >{{ item.type == 1 ? "主营：" : "" }}{{ item.val }}</span
            >
          </div>
          <div class="info">
            <div
              class="info-box"
              v-if="detailInfo.gsxx && detailInfo.gsxx.faren"
            >
              <span>法定代表人：</span
              ><span class="color3">{{ detailInfo.gsxx.faren }}</span>
            </div>
            <div
              class="info-box"
              v-if="detailInfo.gsxx && detailInfo.gsxx.zhucezibenyuanshi"
            >
              <span>注册资本：</span
              ><span class="color3">{{
                detailInfo.gsxx.zhucezibenyuanshi
              }}</span>
            </div>
            <div
              class="info-box"
              v-if="detailInfo.gsxx && detailInfo.gsxx.xinyongdaima"
            >
              <span>统一社会信用代码：</span
              ><span class="color3">{{ detailInfo.gsxx.xinyongdaima }}</span>
            </div>
          </div>
        </div>
      </div>

      <el-breadcrumb
        separator-class="el-icon-arrow-right"
        v-if="allBase.dbname"
      >
        <el-breadcrumb-item><a href="/home">首页</a></el-breadcrumb-item>
        <el-breadcrumb-item
          ><a :href="'/globaldrugs'">{{
            allBase.dbname
          }}</a></el-breadcrumb-item
        >
        <el-breadcrumb-item>企业详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="company-main">
      <div class="company-menu" v-if="isMenuCollapse">
        <div class="menu">
          <div
            v-for="item in menuNav"
            :key="item.name"
            :class="[
              'menu-item',
              menuActive == item.name ? 'menu-item_active' : '',
              detailInfo.gsxx &&
              Object.keys(detailInfo.gsxx).length == 0 &&
              item.name == '工商信息'
                ? 'menu-none'
                : '',
              xwzxTab.length == 0 && item.name == '新闻资讯' ? 'menu-none' : '',
              lineTotalData.length == 0 &&
              lineDetailData.length == 0 &&
              item.name == '研发管线'
                ? 'menu-none'
                : '',
              jyxxres.length == 0 && item.name == '交易信息' ? 'menu-none' : '',
            ]"
            @click="changeTab(item.name)"
          >
            <img :src="item.icon" alt="" class="ico" />
            <img :src="item.activeIcon" alt="" class="ico ico-acitve" />
            <span class="name">{{ item.name }}</span>
          </div>
        </div>
      </div>

      <div
        class="menu-collapse"
        @click="isMenuCollapse = !isMenuCollapse"
        :class="{ 'menu-shrink': !isMenuCollapse }"
      >
        <i class="arrow-left"></i>
        <i class="arrow-right"></i>
      </div>

      <div
        class="company-content company-cpbj"
        :class="{ 'company-content-shrink': !isMenuCollapse }"
        v-show="menuActive === '产品布局'"
      >
        <div class="content-title">
          全球新药产品布局
          <el-tooltip
            class="desc"
            effect="light"
            :content="'只展示原研单位的产品管线，暂未展示合作企业的产品管线。'"
            placement="right"
          >
            <span class="section-ico-qa"></span>
          </el-tooltip>
        </div>

        <el-tabs
          v-model="activeName"
          @tab-click="handleClickTab"
          ref="companyTabs"
        >
          <el-tab-pane label="查看全部" name="全部">
            <cpbj-all
              @hideCpbj="hideCpbj"
              :qiyemingcheng="detailInfo.qiyemingcheng"
              ref="cpbjAll"
            ></cpbj-all>
          </el-tab-pane>
          <el-tab-pane label="只看国外" name="国外">
            <cpbj-word
              ref="cpbjWord"
              :qiyemingcheng="detailInfo.qiyemingcheng"
            ></cpbj-word>
          </el-tab-pane>
          <el-tab-pane label="只看国内" name="中国">
            <cpbj-china
              ref="cpbjChina"
              :qiyemingcheng="detailInfo.qiyemingcheng"
            ></cpbj-china>
          </el-tab-pane>
        </el-tabs>
      </div>

      <!-- 研发管线 -->
      <div
        class="company-content company-line"
        :class="{ 'company-content-shrink': !isMenuCollapse }"
        v-if="menuActive === '研发管线'"
      >
        <div class="content-title line-title">
          <span>研发管线</span>
          <div>
            <span class="title">状态时间：</span>

            <el-date-picker
              v-model="params.start"
              type="date"
              :picker-options="startPickerOptions"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              size="mini"
              @change="handleChangeStart"
              placeholder="选择日期"
              clearable
            >
            </el-date-picker>
            <span style="margin: 0 8px; color: #dfe5f1">-</span>
            <el-date-picker
              v-model="params.end"
              type="date"
              size="mini"
              :picker-options="endPickerOptions"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              @change="handleChangeEnd"
              placeholder="选择日期"
              clearable
            >
            </el-date-picker>

            <span @click="getCompanyLines" class="btn-line">确定</span>
          </div>
        </div>

        <div class="line-box" v-waiting="lineLoading">
          <div class="gsxx-title">研发管线概览</div>
          <el-table
            class="line-table"
            :data="lineTotalData"
            fixed
            :header-cell-style="{
              background: '#F5F6FA',
              color: '#333333',
              fontSize: '14px',
              fontWeight: 'bold',
            }"
          >
            <el-table-column
              v-for="item in lineTotalHead"
              :prop="item.prop"
              :min-width="item.width || 80"
              :key="item.prop"
              :label="item.label"
              :align="'center'"
            >
              <template slot-scope="scope">
                <!-- 地区 -->
                <template v-if="item.prop == 'type'">
                  <div
                    style="
                      display: flex;
                      align-items: center;
                      justify-content: center;
                    "
                  >
                    <img
                      src="/static/imgs/globaldrugs/glob.png"
                      width="20"
                      height="20"
                      alt=""
                      class="img-map"
                      v-if="scope.row.type.indexOf('全球') > -1"
                    />
                    <img
                      src="/static/imgs/globaldrugs/cn.png"
                      width="20"
                      height="20"
                      alt=""
                      v-else
                      class="img-map"
                    />
                    <span>{{ scope.row.type }}</span>
                  </div>
                </template>

                <!-- 全部 -->
                <template v-else-if="item.prop == 'allcount'">
                  <span>{{ scope.row.allcount }}</span>
                </template>

                <template v-else>
                  <span
                    v-if="scope.row[item.prop] > 0"
                    style="
                      color: #002fa7;
                      cursor: pointer;
                      display: inline-block;
                      padding: 0 7px;
                    "
                    @click="goToListOne(scope.row, item.prop)"
                  >
                    {{ scope.row[item.prop] }}
                  </span>
                  <span v-else>{{ scope.row[item.prop] }}</span>
                </template>
              </template>
            </el-table-column>
          </el-table>

          <div class="gsxx-title" style="display: flex; align-items: center">
            研发管线详情
            <el-tooltip
              class="desc"
              effect="light"
              :content="'此处列表按治疗领域展示，多适应症的药品可能会重复出现。'"
              placement="right"
            >
              <span class="section-ico-qa"></span>
            </el-tooltip>
          </div>
          <el-table
            class="detail-table"
            :data="lineDetailData"
            fixed
            stripe
            :cell-class-name="cellClassFn"
            :span-method="objectSpanMethod"
            :header-cell-style="{
              background: '#F5F6FA',
              color: '#333333',
              fontSize: '14px',
              fontWeight: 'bold',
            }"
            :show-header="isShowHeader"
          >
            <el-table-column
              v-for="item in lineDetailHead"
              :prop="item.prop"
              :min-width="item.width || 80"
              :key="item.prop"
              :label="item.label"
            >
              <!-- 自定义表头 -->
              <template :slot="'header'" slot-scope="scope">
                <TableHeadFilter
                  v-if="item.isSearch"
                  :name="item.label"
                  :prop="item.prop"
                  :props="{ label: 'label', key: 'key' }"
                  :options="yfgxFilters[item.prop]"
                  :saved_condition="filterWords"
                  :offset="-5"
                  @confirm="yfgx_confirm(item.prop, $event)"
                  @cancel="yfgx_cancel(item.prop)"
                  ref="headerFilter"
                >
                </TableHeadFilter>
                <div v-else-if="item.prop === 'phase'" class="phase-title-box">
                  <div>临床前</div>
                  <div>临床申请</div>
                  <div>临床Ⅰ期</div>
                  <div>临床Ⅱ期</div>
                  <div>临床Ⅲ期</div>
                  <div>注册申请</div>
                  <div>批准上市</div>
                </div>
                <span v-else>
                  {{ item.label }}
                </span>
              </template>
              <template slot-scope="scope">
                <div>
                  <!-- 药品名称 -->
                  <template v-if="item.prop === 'drugname_standard'">
                    <a
                      tag="a"
                      class="cl-blue"
                      @click="
                        goToDetail(
                          scope.row.hash_drugname_standard,
                          scope.row.hash_company
                        )
                      "
                      :title="scope.row.drugname_standard"
                      >{{ scope.row.drugname_standard }}</a
                    >
                  </template>

                  <!-- 靶点 -->
                  <template v-else-if="item.prop === 'targets_abbr'">
                    <template v-if="scope.row.targets_abbr">
                      <router-link
                        v-for="(tar, index) in scope.row.targets_abbr_arr"
                        class="link"
                        :key="index"
                        target="_blank"
                        :to="`/globaldrugs/target/detail?target=${encodeURIComponent(
                          tar.hash_name
                        )}`"
                      >
                        {{ tar.name }}
                        <span
                          v-if="index !== scope.row.targets_abbr_arr.length - 1"
                          >;</span
                        >
                      </router-link>
                    </template>
                    <span v-else>-</span>
                  </template>

                  <!-- 药品分类 -->
                  <template v-else-if="item.prop === 'leixing2'">
                    <div
                      :title="scope.row.leixing2"
                      v-if="scope.row.leixing2"
                      class="leixing2"
                    >
                      {{ scope.row.leixing2 }}
                    </div>
                    <span v-else>-</span>
                  </template>

                  <!-- 适应症 -->
                  <template v-else-if="item.prop === 'indication_standard'">
                    <el-popover
                      placement="left"
                      width="260"
                      trigger="hover"
                      v-if="
                        scope.row.zaiyan_indication ||
                        scope.row.pizhun_indication ||
                        scope.row.zhongzhi_indication
                      "
                    >
                      <div class="globaldrugs-company-content">
                        <img
                          class="trangle"
                          src="/static/imgs/globaldrugs/tooltip.png"
                          alt=""
                        />
                        <div class="max-content">
                          <div
                            class="content"
                            v-if="scope.row.zaiyan_indication"
                          >
                            <span class="title" style="width: 52px; color: #333"
                              >在研：</span
                            ><span class="info">
                              <div
                                v-for="(
                                  item, index
                                ) in scope.row.zaiyan_indication.split(';')"
                                :key="item"
                              >
                                {{ item }}
                                <span
                                  v-if="
                                    index !==
                                    scope.row.zaiyan_indication.split(';')
                                      .length -
                                      1
                                  "
                                  >;</span
                                >
                              </div>
                            </span>
                          </div>

                          <div
                            class="content"
                            v-if="scope.row.pizhun_indication"
                          >
                            <span
                              class="title"
                              style="width: 52px; color: #5c6973"
                              >已批准：</span
                            ><span class="info" style="color: #5c6973">
                              <div
                                v-for="(
                                  item, index
                                ) in scope.row.pizhun_indication.split(';')"
                                :key="item"
                              >
                                {{ item }}
                                <span
                                  v-if="
                                    index !==
                                    scope.row.pizhun_indication.split(';')
                                      .length -
                                      1
                                  "
                                  >;</span
                                >
                              </div>
                            </span>
                          </div>

                          <div
                            class="content"
                            v-if="scope.row.zhongzhi_indication"
                          >
                            <span
                              class="title"
                              style="width: 52px; color: #5c6973"
                              >终止：</span
                            ><span class="info" style="color: #5c6973">
                              <div
                                v-for="(
                                  item, index
                                ) in scope.row.zhongzhi_indication.split(';')"
                                :key="item"
                              >
                                {{ item }}
                                <span
                                  v-if="
                                    index !==
                                    scope.row.zhongzhi_indication.split(';')
                                      .length -
                                      1
                                  "
                                  >;</span
                                >
                              </div>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div slot="reference">
                        <div
                          class="indication-zy"
                          v-if="scope.row.zaiyan_indication"
                        >
                          <span class="title">在研：</span
                          ><span class="content">{{
                            scope.row.zaiyan_indication
                          }}</span>
                        </div>
                        <div
                          class="indication-zy indication-ypz"
                          v-if="scope.row.pizhun_indication"
                        >
                          <span class="title" style="width: 52px">已批准：</span
                          ><span class="content">{{
                            scope.row.pizhun_indication
                          }}</span>
                        </div>

                        <div
                          class="indication-zy indication-ypz"
                          v-if="scope.row.zhongzhi_indication"
                        >
                          <span class="title">终止：</span
                          ><span class="content">{{
                            scope.row.zhongzhi_indication
                          }}</span>
                        </div>
                      </div>
                    </el-popover>
                    <span v-else>-</span>
                  </template>

                  <!-- 研发阶段 -->
                  <template v-else-if="item.prop === 'phase'">
                    <div class="line" v-if="scope.row.maxphase_num">
                      <!-- 临床前 -->
                      <div class="item" v-if="scope.row.maxphase_num >= 10">
                        <span v-if="scope.row.maxphase_num == 10">{{
                          scope.row.maxphase_date.substring(0, 10)
                        }}</span>
                      </div>
                      <!-- 临床申请 -->
                      <div class="item" v-if="scope.row.maxphase_num >= 20">
                        <span v-if="scope.row.maxphase_num == 20">{{
                          scope.row.maxphase_date.substring(0, 10)
                        }}</span>
                      </div>
                      <!-- 临床1期 -->
                      <div class="item" v-if="scope.row.maxphase_num >= 30">
                        <span v-if="scope.row.maxphase_num == 30">{{
                          scope.row.maxphase_date.substring(0, 10)
                        }}</span>
                      </div>
                      <!-- 临床2期 -->
                      <div class="item" v-if="scope.row.maxphase_num >= 40">
                        <span v-if="scope.row.maxphase_num == 40">{{
                          scope.row.maxphase_date.substring(0, 10)
                        }}</span>
                      </div>
                      <!-- 临床3期 -->
                      <div class="item" v-if="scope.row.maxphase_num >= 50">
                        <span v-if="scope.row.maxphase_num == 50">{{
                          scope.row.maxphase_date.substring(0, 10)
                        }}</span>
                      </div>
                      <!-- 注册申请 -->
                      <div class="item" v-if="scope.row.maxphase_num >= 60">
                        <span v-if="scope.row.maxphase_num == 60">{{
                          scope.row.maxphase_date.substring(0, 10)
                        }}</span>
                      </div>
                      <!-- 批准上市 -->
                      <div class="item" v-if="scope.row.maxphase_num >= 70">
                        <span v-if="scope.row.maxphase_num == 70">{{
                          scope.row.maxphase_date.substring(0, 10)
                        }}</span>
                      </div>
                    </div>
                  </template>

                  <!-- 合作企业 -->
                  <template v-else-if="item.prop === 'coo_company'">
                    <template
                      v-if="scope.row.coo_company[0].name"
                      v-for="(item, index) in scope.row.coo_company"
                    >
                      <router-link
                        class="link"
                        :key="index"
                        target="_blank"
                        :to="`/globaldrugs/companyDetail?company_standard=${encodeURIComponent(
                          item.hash_name
                        )}`"
                        v-if="item.name && item.is_exist"
                      >
                        {{ item.name }}
                      </router-link>
                      <span v-else :key="index">{{ item.name }}</span>
                      <span
                        :key="index"
                        v-if="index !== scope.row.coo_company.length - 1"
                        >;</span
                      >
                    </template>
                    <span v-else>-</span>
                  </template>
                  <span v-else :title="scope.row[item.prop]">{{
                    scope.row[item.prop] || "-"
                  }}</span>
                </div>
              </template>
            </el-table-column>
          </el-table>

          <el-pagination
            @current-change="handleCurrentChange"
            :current-page="params.page"
            :page-size="20"
            layout="total, prev, pager, next, jumper"
            :total="total"
          >
          </el-pagination>
        </div>
      </div>

      <!-- 新闻资讯 -->
      <div
        :class="{ 'company-content-shrink': !isMenuCollapse }"
        class="company-content company-xwzx"
        v-if="menuActive === '新闻资讯'"
      >
        <div class="content-title">新闻资讯</div>
        <div class="xwzx">
          <el-tabs
            v-model="activeNameNews"
            @tab-click="handleClickNewTab"
            ref="newTabs"
          >
            <el-tab-pane
              v-for="(item, key) in xwzxTab"
              :key="key"
              :label="item.sourceleixing + `(${item.doc_count})`"
              :name="item.sourceleixing"
            >
              <span slot="label">
                {{ item.sourceleixing }}
                <span class="num" v-if="item.doc_count"
                  >({{ item.doc_count }})</span
                >
              </span>
              <xwzx
                v-if="item.sourceleixing == activeNameNews"
                :name="item.sourceleixing"
              />
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>

      <!-- 交易信息 -->
      <div
        class="company-content"
        :class="{ 'company-content-shrink': !isMenuCollapse }"
        v-if="menuActive === '交易信息'"
      >
        <div class="content-title">
          交易信息
          <el-tooltip
            class="desc"
            effect="light"
            :content="'该企业相关的药品/项目交易信息。'"
            placement="right"
          >
            <span class="section-ico-qa"></span>
          </el-tooltip>
        </div>

        <Jyxx :qiyemingcheng="detailInfo.qiyemingcheng"></Jyxx>
      </div>

      <!-- 工商信息 -->
      <div
        class="company-content company-gsxx"
        :class="{ 'company-content-shrink': !isMenuCollapse }"
        v-if="menuActive === '工商信息'"
      >
        <div class="content-title">企业概览</div>
        <div class="qygl">
          <!-- 电话、邮箱、网址、地址 -->
          <div class="qygl-box">
            <div class="box-info">
              <span class="title">电话：</span>
              <span class="text">{{ detailInfo.gsxx.phone || "-" }}</span>
            </div>

            <div class="box-info">
              <span class="title">邮箱：</span>
              <span class="text">{{ detailInfo.gsxx.email || "-" }}</span>
            </div>

            <div class="box-info">
              <span class="title">网址：</span>
              <span class="text">
                <a
                  :href="
                    detailInfo.gsxx.url.indexOf('http') > -1
                      ? detailInfo.gsxx.url
                      : 'http://' + detailInfo.gsxx.url
                  "
                  v-if="detailInfo.gsxx.url"
                  target="_blank"
                  >{{ detailInfo.gsxx.url }}</a
                >
                <span v-else>-</span>
              </span>
            </div>

            <div class="box-info">
              <span class="title">地址：</span>
              <span class="text">{{ detailInfo.gsxx.dizhi || "-" }}</span>
            </div>
          </div>
          <div class="box-jianjie">
            <input id="exp1" class="exp" type="checkbox" />
            <span class="title">简介：</span>
            <span class="text">
              <label class="btn" for="exp1"></label>
              {{ detailInfo.gsxx.qiyejianjie || "-" }}
            </span>
          </div>
        </div>

        <!-- 工商注册信息 -->
        <div class="gsxx-title">工商注册信息</div>
        <table class="tb-t">
          <tr>
            <td>企业名称</td>
            <td>
              <span>{{ detailInfo.gsxx.qiyemingcheng || "-" }}</span>
            </td>
            <td>统一社会信用代码</td>
            <td>
              <span>{{ detailInfo.gsxx.xinyongdaima || "-" }}</span>
            </td>
          </tr>
          <tr>
            <td>法定代表人</td>
            <td>
              <span>{{ detailInfo.gsxx.faren || "-" }}</span>
            </td>
            <td>经营状态</td>
            <td>
              <span>{{ detailInfo.gsxx.zhuangtai || "-" }}</span>
            </td>
          </tr>
          <tr>
            <td>成立日期</td>
            <td>
              <span>{{ detailInfo.gsxx.chengliriqi || "-" }}</span>
            </td>
            <td>行政区划</td>
            <td>
              <span
                >{{ detailInfo.gsxx.shengfen
                }}{{ detailInfo.gsxx.chengshi }}</span
              >
            </td>
          </tr>
          <tr>
            <td>注册资本</td>
            <td>
              <span>{{ detailInfo.gsxx.zhucezibenyuanshi || "-" }}</span>
            </td>
            <td>企业类型</td>
            <td>
              <span>{{ detailInfo.gsxx.qiyeleixing || "-" }}</span>
            </td>
          </tr>
          <tr>
            <td>所属行业</td>
            <td>
              <span>{{ detailInfo.gsxx.hangye || "-" }}</span>
            </td>
            <td>工商注册号</td>
            <td>
              <span>{{ detailInfo.gsxx.gongshangzhuceid || "-" }}</span>
            </td>
          </tr>
          <tr>
            <td>组织机构代码</td>
            <td>
              <span>{{ detailInfo.gsxx.zuzhijiegoudaima || "-" }}</span>
            </td>
            <td>纳税人识别号</td>
            <td>
              <span>{{ detailInfo.gsxx.nashuishibiehao || "-" }}</span>
            </td>
          </tr>
          <tr>
            <td>曾用名</td>
            <td>
              <span>{{ detailInfo.gsxx.qiyezengyongming || "-" }}</span>
            </td>
            <td>参保人数</td>
            <td>
              <span>{{
                detailInfo.gsxx.canbaorenshu > 0
                  ? detailInfo.gsxx.canbaorenshu
                  : "-" || "-"
              }}</span>
            </td>
          </tr>
          <tr>
            <td>经营范围</td>
            <td colspan="3">
              <span>{{ detailInfo.gsxx.jingyingfanwei || "-" }}</span>
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import LoadingGif from "@/components/common/globalCom/loading-gif";
import CpbjAll from "./components/cpbj-all";
import CpbjChina from "./components/cpbj-china";
import CpbjWord from "./components/cpbj-word";
import Xwzx from "./components/xwzx";
import TableHeadFilter from "@/components/common/globaldrugs/table-head-filter";
import Jyxx from "./components/jyxx";
export default {
  components: {
    LoadingGif,
    CpbjAll,
    CpbjChina,
    CpbjWord,
    Xwzx,
    TableHeadFilter,
    Jyxx,
  },
  data() {
    return {
      isMenuCollapse: true,
      isLoading: true,
      isHideCpbj: false,
      detailInfo: {},
      menuNav: [
        {
          name: "产品布局",
          icon: "/static/imgs/globaldrugs/company/cpbj.png",
          activeIcon: "/static/imgs/globaldrugs/company/cpbj_active.png",
        },
        {
          name: "研发管线",
          icon: "/static/imgs/globaldrugs/company/yfgx.png",
          activeIcon: "/static/imgs/globaldrugs/company/yfgx_active.png",
        },
        {
          name: "新闻资讯",
          icon: "/static/imgs/globaldrugs/company/xwzx.png",
          activeIcon: "/static/imgs/globaldrugs/company/xwzx_active.png",
        },
        {
          name: "交易信息",
          icon: "/static/imgs/globaldrugs/company/jyxx.png",
          activeIcon: "/static/imgs/globaldrugs/company/jyxx_active.png",
        },
        {
          name: "工商信息",
          icon: "/static/imgs/globaldrugs/company/gsxx.png",
          activeIcon: "/static/imgs/globaldrugs/company/gsxx_active.png",
        },
      ],
      menuActive: "产品布局",
      activeName: "全部", // 全球新药产品布局激活选项，默认为全部
      params: {
        pageSize: 20,
        page: 1,
        start: "",
        end: "",
        company_standard: this.$route.query.company_standard,
      }, // 研发管线参数
      startPickerOptions: {},
      endPickerOptions: {},
      lineLoading: true,
      lineTotalData: [], // 研发管线概览数据
      lineTotalHead: [
        {
          prop: "type",
          label: "地区",
          width: 80, //最少宽度
        },
        {
          prop: "allcount",
          label: "全部",
          width: 80, //最少宽度
        },
        {
          prop: "phase1",
          label: "临床前",
          width: 80, //最少宽度
        },
        {
          prop: "phase2",
          label: "临床申请",
          width: 80, //最少宽度
        },
        {
          prop: "phase3",
          label: "临床I期",
          width: 80, //最少宽度
        },
        {
          prop: "phase4",
          label: "临床II期",
          width: 80, //最少宽度
        },
        {
          prop: "phase5",
          label: "临床III期",
          width: 80, //最少宽度
        },
        {
          prop: "phase6",
          label: "注册申请",
          width: 80, //最少宽度
        },
        {
          prop: "phase7",
          label: "批准上市",
          width: 80, //最少宽度
        },
      ], // 研发管线概览表头
      lineDetailData: [], // 研发管线详情数据
      lineDetailHead: [
        {
          prop: "zyly",
          label: "治疗领域",
          isSearch: true,
          width: 120, //最少宽度
        },
        {
          prop: "drugname_standard",
          label: "药品名称",
          isSearch: true,
          width: 140, //最少宽度
        },
        {
          prop: "leixing",
          label: "类型",
          isSearch: true,
          width: 100, //最少宽度
        },
        {
          prop: "leixing2",
          label: "药品分类",
          isSearch: true,
          width: 100, //最少宽度
        },
        {
          prop: "targets_abbr",
          label: "靶点",
          isSearch: true,
          width: 150, //最少宽度
        },
        {
          prop: "indication_standard",
          label: "适应症",
          isSearch: true,
          width: 150, //最少宽度
        },
        {
          prop: "phase",
          label: "研发阶段",
          width: 600, //最少宽度
        },
        {
          prop: "coo_company",
          label: "合作企业",
          width: 120, //最少宽度
        },
      ],
      spanArr: [], // 控制合并项
      position: 0, // 表示数组元素的位置
      activeNameNews: "", // 新闻资讯激活tab
      loadingNews: false,
      xwzxTab: [], // 新闻资讯tab切换项
      total: 0,
      phaseObj: {
        phase1: "10",
        phase2: "20",
        phase3: "30",
        phase4: "40",
        phase5: "50",
        phase6: "60",
        phase7: "70",
      },
      yfgxFilters: {}, // 研发管线表头过滤数据
      filterWords: "", // 研发管线表头已筛选数据
      isShowHeader: true,
      jyxxres: [],
    };
  },
  computed: {
    //同时获取多个属性
    ...mapState({
      activeTabName: (state) => state.Globaldrugs.tabname,
      allBase: (state) => state.Globaldrugs.allBase,
      showPromtNotice: (state) => state.showPromtNotice,
    }),
  },
  watch: {
    showPromtNotice(val) {
      if (val) {
        $(".globaldrugs-company").css("height", "calc(100vh - 78px)");
      } else {
        $(".globaldrugs-company").css("height", "calc(100vh - 48px)");
      }
    },
    // 监听展开收起状态，调用图表的resize方法。
    isMenuCollapse(val) {
      if (this.activeName == "全部") {
        this.$refs.cpbjAll.allResize();
      } else if (this.activeName == "国外") {
        this.$refs.cpbjWord.wordResize();
      } else {
        this.$refs.cpbjChina.chinaResize();
      }
    }
  },
  methods: {
    // 跳转到默认列表页查询
    goToListOne(row, phase) {
      console.log(row, phase);
      window.ga(
        "send",
        "event",
        "button",
        "click",
        "企业版_全球药物2.0_企业详情_研发管线_研发管线概览" +
          (row.type == "中国" ? "中国" : "全球")
      );
      window._paq.push([
        "trackEvent",
        "button",
        "click",
        "企业版_全球药物2.0_企业详情_研发管线_研发管线概览" +
          (row.type == "中国" ? "中国" : "全球"),
      ]);
      let numObj = {};
      if (row.type !== "中国") {
        // 全球最高阶段
        numObj = {
          phase1: [this.phaseObj[phase]],
        };
      } else {
        // 中国最高阶段
        numObj = {
          phase2: [this.phaseObj[phase]],
        };
      }
      let { href } = this.$router.resolve({
        path: "/globaldrugs/list",
        query: {
          company: this.detailInfo.qiyemingcheng,
          filter_condition: JSON.stringify(numObj),
        },
      });
      window.open(href, "_blank");
    },
    // 药品详情
    goToDetail(drugname_standard, company) {
      let routeData = this.$router.resolve({
        path:
          "/globaldrugs/detail?drugname_standard=" +
          encodeURIComponent(drugname_standard) +
          "&company_standard=" +
          encodeURIComponent(company),
      });
      window.open(routeData.href, "_blank");
    },
    hideCpbj(val) {
      this.isHideCpbj = val;
    },

    // 导航点击切换
    changeTab(name) {
      this.menuActive = name;
      if (this.menuActive == "产品布局") {
        this.$refs.cpbjAll.allResize();
      }
    },
    // 产品布局tab切换数据
    handleClickTab(name) {
      this.resetActivePosition(this.$refs.companyTabs.$el);
      this.activeName = name.name;
      console.log(this.activeName);
      if (this.activeName == "全部") {
        this.$refs.cpbjAll.allResize();
      } else if (this.activeName == "国外") {
        this.$refs.cpbjWord.wordResize();
      } else {
        this.$refs.cpbjChina.chinaResize();
      }
    },
    handleClickNewTab() {
      this.resetActivePosition(this.$refs.newTabs.$el);
    },
    resetActivePosition($el) {
      this.$nextTick(() => {
        const activeEl = $el.querySelector(".el-tabs__item.is-active");
        const lineEl = $el.querySelector(".el-tabs__active-bar");
        const style = getComputedStyle(activeEl);
        const pl = style.paddingLeft.match(/\d+/)[0] * 1;
        const pr = style.paddingRight.match(/\d+/)[0] * 1;
        const w = style.width.match(/\d+/)[0] * 1;
        lineEl.style.transform =
          "translateX(" + (activeEl.offsetLeft + pl) + "px)";
        lineEl.style.width = w - pl - pr + "px";
      });
    },
    // 获取顶部数据和公司信息数据
    getCompanyInfo() {
      window
        .Axios({
          method: "get",
          url: "/api/globaldrugs/companyInfo",
          params: {
            company_standard: this.$route.query.company_standard,
            accesstoken: GETCOOKIEFUN("accesstoken"),
          },
        })
        .then((res) => {
          this.isLoading = false;
          if (res.data.code === 200 && res.data.data) {
            this.detailInfo = res.data.data;
            this.getJyxx();
          } else {
            this.detailInfo = {};
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 获取研发管线数据
    getCompanyLines() {
      this.lineLoading = true;
      this.spanArr = [];
      this.position = 0;
      window
        .Axios({
          method: "get",
          url: "/api/globaldrugs/companyLines",
          params: {
            ...this.params,
            accesstoken: GETCOOKIEFUN("accesstoken"),
            filterWords: this.filterWords,
          },
        })
        .then((res) => {
          this.lineLoading = false;
          if (res.data.code === 200 && res.data.data) {
            this.lineTotalData = res.data.data.total;
            this.lineDetailData = res.data.data.detail.res;
            this.rowspan(this.lineDetailData);
            this.total = Number(res.data.data.detail.count);

            this.$nextTick(() => {
              // 研发管线数据请求完之后再请求表头筛选的数据
              this.getTHeadSearch("drugname_standard"); // 药品名称
              this.getTHeadSearch("zyly"); // 治疗领域
              this.getTHeadSearch("leixing"); // 类型
              this.getTHeadSearch("leixing2"); // 药品分类
              this.getTHeadSearch("indication_standard"); // 适应症
              this.getTHeadSearch("targets_abbr"); // 靶点
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    handleCurrentChange(e) {
      this.params.page = e;
      this.getCompanyLines();
    },

    // 研发管线过滤数据请求
    getTHeadSearch(field) {
      window
        .Axios({
          method: "get",
          url: "/api/globaldrugs/companyFieldGroup",
          params: {
            field: field,
            company_standard: this.$route.query.company_standard,
            strat: this.params.start,
            end: this.params.end,
            filterWords: this.filterWords,
            accesstoken: GETCOOKIEFUN("accesstoken"),
          },
        })
        .then((res) => {
          if (res.data.code === 200 && res.data.data) {
            this.yfgxFilters[field] = res.data.data[field];
            this.isShowHeader = false;
            this.$nextTick(() => {
              this.isShowHeader = true;
            });
          }
        });
    },

    yfgx_confirm(key, nodes) {
      let old_condition = this.decode_conditions();
      if (nodes.length) {
        old_condition[key] = nodes.map((t) => t.key);
      } else {
        delete old_condition[key];
      }
      console.log(old_condition);
      let new_condition = this.encode_conditions(old_condition);
      console.log(new_condition);

      this.filterWords = new_condition;
      console.log(new_condition);
      this.handleCurrentChange(1);
    },

    yfgx_cancel(key) {
      let old_condition = this.decode_conditions();
      delete old_condition[key];
      let new_condition = this.encode_conditions(old_condition);
      this.filterWords = new_condition;
      console.log(new_condition);
      this.handleCurrentChange(1);
    },

    // 转换研发管线筛选字符串为对象
    decode_conditions(str) {
      let cache = str || this.filterWords;
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
    // 转换研发管线筛选对象为字符串
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

    // 控制表格合并项
    rowspan(data) {
      data.forEach((item, index) => {
        if (index === 0) {
          this.spanArr.push(1);
          this.position = 0;
        } else {
          if (data[index].zyly === data[index - 1].zyly) {
            this.spanArr[this.position] += 1;
            this.spanArr.push(0);
          } else {
            this.spanArr.push(1);
            this.position = index;
          }
        }
        // console.log(index)
      });
    },
    // 研发管线表格合并方法
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      // 表格合并行
      if (this.lineDetailData.length > 1) {
        if (columnIndex === 0) {
          const _row = this.spanArr[rowIndex];
          const _col = _row > 0 ? 1 : 0;
          return {
            rowspan: _row,
            colspan: _col,
          };
        }
      }
    },

    cellClassFn({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        return "target-bg";
      }
    },

    handleChangeStart() {
      let that = this;
      // 开始时间
      this.startPickerOptions = Object.assign({}, this.startPickerOptions, {
        disabledDate: (time) => {
          let endTime = that.params.end ? that.params.end : "";
          // 若时间有误差，可加减一天1000*3600*24
          return that.params.end != ""
            ? time.getTime() >= new Date(endTime).getTime()
            : false;
        },
      });

      //结束时间
      this.endPickerOptions = Object.assign({}, this.endPickerOptions, {
        disabledDate: (time) => {
          let endTime = that.params.start ? that.params.start : "";
          return that.params.start != ""
            ? time.getTime() < new Date(endTime).getTime() - 1000 * 3600 * 24
            : false;
        },
      });
    },

    handleChangeEnd() {
      let that = this;
      // 开始时间
      this.startPickerOptions = Object.assign({}, this.startPickerOptions, {
        disabledDate: (time) => {
          let endTime = that.params.end ? that.params.end : "";
          endTime =
            endTime.slice(0, 4) +
            "-" +
            endTime.slice(4, 6) +
            "-" +
            endTime.slice(6, 8);
          // 若时间有误差，可加减一天1000*3600*24
          return that.params.end != ""
            ? time.getTime() >= new Date(endTime).getTime()
            : false;
        },
      });

      //结束时间
      this.endPickerOptions = Object.assign({}, this.endPickerOptions, {
        disabledDate: (time) => {
          let endTime = that.params.start ? that.params.start : "";
          endTime =
            endTime.slice(0, 4) +
            "-" +
            endTime.slice(4, 6) +
            "-" +
            endTime.slice(6, 8);
          return that.params.start != ""
            ? time.getTime() < new Date(endTime).getTime() - 1000 * 3600 * 24
            : false;
        },
      });
    },

    // 获取新闻资讯分类数据
    getXwzx() {
      this.loadingNews = true;
      Axios({
        url: "/api/globaldrugs/companyNewsCate",
        params: {
          company_standard: this.$route.query.company_standard,
        },
      })
        .then((res) => {
          if (res.data.code == 200 && this.isEmpty(res.data.data)) {
            this.xwzxTab = res.data.data;
            this.activeNameNews = res.data.data[0].sourceleixing || "";
          } else {
            this.xwzxTab = [];
          }
        })
        .finally(() => {
          this.loadingNews = false;
        });
    },
    // 查询交易信息是否有数据
    getJyxx() {
      window
        .Axios({
          method: "get",
          url: "/api/globaldrugs/tradingInfo",
          params: {
            page: 1,
            pageSize: 10,
            qiyemingcheng: this.detailInfo.qiyemingcheng,
            accesstoken: GETCOOKIEFUN("accesstoken"),
          },
        })
        .then((res) => {
          if (res.data.code === 200 && res.data.data) {
            this.jyxxres = res.data.data.res;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  created() {},
  async mounted() {
    await Store.dispatch("Globaldrugs/getBaseInfo");
    document.title = `${this.allBase.dbname}-企业详情`;
    if (this.$route.query.activeModule) {
      this.menuActive = this.$route.query.activeModule;
    }
    await this.getCompanyInfo();
    await this.getCompanyLines();
    await this.getXwzx();
  },
};
</script>

<style lang="less">
@import "~@/assets/less/var.less";
.globaldrugs-company-content {
  font-size: 12px;
  position: relative;

  .max-content {
    max-height: 400px;
    overflow-y: auto;
  }

  .trangle {
    width: 8px;
    height: 8px;
    position: absolute;
    right: -12px;
    top: -12px;
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
}
.globaldrugs-company {
  height: calc(100vh - 48px);

  .el-loading-mask {
    background-color: rgba(255, 255, 255, 1);
    height: 100%;
  }

  .target-bg {
    background: #f3f5f9 !important;
  }

  .el-pagination {
    padding-left: 0;
    padding-top: 14px;

    .el-pager li {
      min-width: 28px;
      height: 28px;
      line-height: 28px;
      background: #ffffff;
      border-radius: 4px;
      border: 1px solid #dcdfe6;
      color: #5c6973;
    }

    .more {
      margin-left: 8px;
    }

    .el-pagination__total {
      font-size: 13px;
      color: #5c6973;
      height: 28px;
      line-height: 28px;
    }

    .el-select .el-input .el-input__inner {
      border-radius: 4px;
      border-color: #dcdfe6;
      height: 28px;
      color: #5c6973;
    }

    .btn-prev,
    .btn-next {
      width: 28px;
      height: 28px;
      background: #ffffff;
      border-radius: 4px;
      border: 1px solid #dcdfe6;
      color: #5c6973;
    }

    .btn-next {
      margin-left: 8px;
    }

    .el-pager {
      .number {
        height: 28px;
        line-height: 28px;
        background: #ffffff;
        border-radius: 4px;
        border: 1px solid #dcdfe6;
        color: #666;
        margin-left: 8px;
        font-weight: normal;
      }

      .active {
        background: #002fa7;
        color: #ffffff;
      }
    }
  }

  .el-table--striped .el-table__body tr.el-table__row--striped td {
    background: #fafbfd;
  }
  .el-table {
    .el-table__body tr.el-table__row--striped:hover > td,
    .el-table__body tr:hover > td {
      background-color: #ebeef5 !important;
    }
  }

  .el-tabs--bottom .el-tabs__item.is-bottom:nth-child(2),
  .el-tabs--bottom .el-tabs__item.is-top:nth-child(2),
  .el-tabs--top .el-tabs__item.is-bottom:nth-child(2),
  .el-tabs--top .el-tabs__item.is-top:nth-child(2) {
    padding-left: 0 !important;
  }
  .el-tabs--bottom .el-tabs__item.is-bottom:last-child,
  .el-tabs--bottom .el-tabs__item.is-top:last-child,
  .el-tabs--top .el-tabs__item.is-bottom:last-child,
  .el-tabs--top .el-tabs__item.is-top:last-child {
    padding-right: 0 !important;
  }
  .list-in-loading {
    height: calc(100vh - 220px);
  }

  .el-breadcrumb__inner a {
    color: #002fa7 !important;
  }

  .fullscreen-loading {
    background: #ffffff;
  }

  .section-ico-qa {
    width: 14px;
    height: 14px;
    display: inline-block;
    background-image: url(/static/imgs/globaldrugs/qa.png);
    background-size: cover;
    margin-left: 5px;
    &:hover {
      background-image: url(/static/imgs/globaldrugs/qa-c.png);
    }
  }

  .company-head {
    width: 100%;
    padding: 15px 10px;
    box-sizing: border-box;
    background: #ffffff;
    box-shadow: 0px 1px 10px 0px rgba(9, 20, 79, 0.1);
    display: flex;
    align-items: center;
    justify-content: space-between;
    img {
      width: 68px;
      height: 68px;
      border-radius: 3px;
      border: 1px solid #ebeef5;
      box-sizing: border-box;
      margin-right: 14px;
    }

    .logo-box {
      width: 68px;
      height: 68px;
      background: #002fa7;
      color: #fff;
      font-size: 18px;
      font-weight: 600;
      letter-spacing: 3px;
      border-radius: 3px;
      border: 1px solid #ebeef5;
      margin-right: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .head-info {
      .title {
        font-size: 20px;
        font-weight: 600;
        color: #000f32;
      }

      .tags {
        margin-bottom: 5px;
        max-width: 900px;
        display: flex;
        flex-wrap: wrap;

        .tag {
          padding: 0 8px;
          height: 20px;
          border-radius: 3px;
          border: 1px solid #002fa7;
          box-sizing: border-box;
          font-size: 12px;
          color: #002fa7;
          margin-right: 10px;
          display: inline-block;
          margin-top: 3px;
        }

        .tag1 {
          background: #002fa7;
          color: #fff;
        }

        .tag3 {
          border: 1px solid #1D881A;
          color: #1D881A;
        }
      }

      .info {
        display: flex;

        .info-box {
          margin-right: 10px;
          padding-right: 10px;
          border-right: 1px solid #ebeef5;
          color: #5c6973;
          font-size: 12px;
        }

        .info-box:nth-of-type(3) {
          border-right: none;
        }

        .color3 {
          color: #333;
          font-size: 13px;
        }
      }
    }
  }

  .company-main {
    height: calc(100% - 130px);
    display: flex;
    padding-top: 10px;
    background-color: #f5f8fc;
    position: relative;

    .menu-collapse {
      transition: all 300ms 50ms;
      position: fixed;
      left: 181px;
      top: 55%;
      transform: translateY(-36px);
      width: 8px;
      height: 36px;
      line-height: 36px;
      background-color: #97a2be;
      color: #fff;
      cursor: pointer;

      &:hover {
        color: @White;
        background-color: Lighten(#35384a, 10%);
      }
      .arrow-left {
        width: 0;
        height: 0;
        border-top: 6px solid transparent;
        border-right: 7px solid #f0f3fa;
        border-bottom: 6px solid transparent;
        display: inline-block;
      }
      .arrow-right {
        width: 0;
        height: 0;
        border-top: 6px solid transparent;
        border-left: 7px solid #f0f3fa;
        border-bottom: 6px solid transparent;
        display: none;
      }
    }

    .menu-shrink {
      transition: all 300ms 50ms;
      left: 1px;
      background-color: #97a2be !important;
      .arrow-left {
        display: none;
      }
      .arrow-right {
        display: inline-block;
      }
      &:hover {
        color: @White!important;
        background-color: Lighten(#35384a, 10%) !important;
      }
    }

    .company-menu {
      width: 180px;
      margin-right: 10px;
      background: #ffffff;
      box-shadow: 0px 1px 10px 0px rgba(9, 20, 79, 0.1);
      border-radius: 0px 3px 0px 0px;

      .menu {
        &-item {
          padding: 0 10px;
          height: 40px;
          display: flex;
          align-items: center;
          position: relative;
          user-select: none;
          cursor: pointer;

          &:after {
            width: calc(100% - 20px);
            border-bottom: 1px solid #ebeef5;
            content: "";
            display: "block";
            position: absolute;
            bottom: 0;
            left: 10px;
          }

          .ico {
            width: 14px;
            margin-right: 10px;
          }

          .ico-acitve {
            display: none;
          }

          .name {
            font-size: 14px;
            color: #333333;
            line-height: 14px;
          }
        }

        &-none {
          display: none;
        }

        &-item_active {
          box-shadow: 0px 1px 8px 0px rgba(9, 20, 79, 0.1);

          .name {
            font-weight: 500;
          }

          &:after {
            position: absolute;
            top: 0;
            left: 0;
            border-bottom: none;
            width: 2px;
            height: 100%;
            background-color: #002fa7;
          }
          .ico {
            display: none;
          }
          .ico-acitve {
            display: block;
          }
        }
      }
    }

    .gsxx-title {
      font-size: 14px;
      padding-left: 20px;
      color: #333333;
      position: relative;
      margin-bottom: 10px;
      font-weight: 600;

      &::before {
        content: "";
        width: 2px;
        height: 14px;
        background: #002fa7;
        border-radius: 1px;
        position: absolute;
        left: 10px;
        top: 4px;
      }
    }

    .company-content {
      width: calc(100% - 200px);
      overflow: auto;
      position: relative;
      background: #ffffff;
      box-shadow: 0px 1px 10px 0px rgba(9, 20, 79, 0.1);
      border-radius: 3px;

      .content-title {
        height: 34px;
        display: flex;
        align-items: center;
        background: #f5f6fa;
        font-size: 14px;
        font-weight: bold;
        color: #333333;
        padding: 0 10px;

        .title {
          font-weight: 400;
        }

        .el-date-editor.el-input {
          width: 130px;
          height: 20px;
          border-radius: 3px;
          border: 1px solid #ebeef5;
          color: #333;
        }
        .el-input--mini .el-input__inner {
          height: 24px;
          line-height: 24px;
          font-size: 12px;
          padding-right: 15px;
          font-weight: normal;
        }

        .el-input--mini .el-input__icon {
          line-height: 24px;
          color: #ffa500;
        }

        .btn-line {
          width: 40px;
          height: 24px;
          line-height: 24px;
          text-align: center;
          background: #ffa914;
          border-radius: 3px;
          font-size: 12px;
          color: #ffffff;
          cursor: pointer;
          display: inline-block;
        }
      }

      .line-title {
        justify-content: space-between;
      }
    }

    .company-content-shrink {
      width: calc(100% - 20px);
      margin-left: 10px;
    }
    // 产品布局
    .company-cpbj {
      .el-tabs {
        padding: 10px;
        box-sizing: border-box;
        font-size: 14px;

        .el-tabs__header {
          border-bottom: 1px solid #ebeef5;
        }
        .el-tabs__item {
          font-weight: 400;
          color: #333333;
          padding: 0 10px;
          &::after {
            content: "";
            width: 1px;
            height: 14px;
            background: #ebeef5;
            position: absolute;
            right: 0px;
            top: 14px;
          }
        }
        .el-tabs__item:last-child {
          &::after {
            content: "";
            width: 1px;
            height: 14px;
            background: transparent;
            position: absolute;
            right: 0px;
            top: 14px;
          }
        }
        .el-tabs__item.is-active {
          font-weight: bold;
          color: #000f32;
        }

        .el-tabs__active-bar {
          background-color: #002fa7;
          height: 3px;
          border-radius: 2px;
        }

        // .el-tabs__item.is-top:nth-child(2) {
        //   padding-left: 0 !important;
        // }
      }
    }

    // 研发管线
    .company-line {
      .line-box {
        padding: 20px 10px;
        box-sizing: border-box;
        .el-table {
          color: #333;
          font-size: 13px;
        }

        .detail-table {
          td,
          th.is-leaf {
            border-bottom: 1px solid #fff;
          }

          .link {
            color: #002fa7;
            font-size: 13px;

            &:hover {
              text-decoration: none;
            }
          }

          .phase-title-box {
            width: 100%;
            display: flex;
            padding: 0;

            div {
              flex: 1;
              padding: 0;
              text-align: center;
              position: relative;
            }
          }

          .line {
            width: 100%;
            white-space: nowrap;
            padding: 3px 0;
            box-sizing: border-box;
            height: 20px;

            .item {
              height: 14px;
              border-radius: 7px;
              width: calc(100% / 6);
              position: relative;
              display: inline-block;
              font-size: 12px;
              span {
                position: absolute;
                left: 60%;
                transform: translateX(-60%);
                line-height: 14px;
              }
            }
            .item:nth-of-type(1) {
              background: #e8f1fe;
              left: 0%;
              color: #35384a;
              z-index: 7;
            }
            .item:nth-of-type(2) {
              background: #cddefd;
              left: -3%;
              color: #35384a;
              z-index: 6;
            }
            .item:nth-of-type(3) {
              background: #afc9fe;
              z-index: 5;
              color: #35384a;
              left: -6%;
            }
            .item:nth-of-type(4) {
              background: #8bb4fa;
              color: #fff;
              z-index: 4;
              left: -9%;
            }
            .item:nth-of-type(5) {
              background: #598dfc;
              color: #fff;
              z-index: 3;
              left: -12%;
            }
            .item:nth-of-type(6) {
              background: #3a79f0;
              color: #fff;
              z-index: 2;
              left: -15%;
            }
            .item:nth-of-type(7) {
              background: #1944b0;
              color: #fff;
              z-index: 1;
              left: -18%;
            }
          }

          .cl-blue {
            font-size: 14px;
            color: #002fa7;
            &:hover {
              text-decoration: none;
            }
          }
        }

        .el-table.detail-table td .cell {
          overflow: unset;
          text-overflow: unset;
          display: block;
          -webkit-line-clamp: unset;
          -webkit-box-orient: unset;
          padding-right: 14px;
        }

        .el-table.detail-table td .cell > div {
          overflow: unset;
          text-overflow: unset;
          display: block;
          -webkit-line-clamp: unset;
          -webkit-box-orient: unset;
          max-height: unset;
        }

        .leixing2 {
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
        }

        .line-table {
          margin-bottom: 20px;
          .img-map {
            margin-right: 5px;
          }
        }

        .el-table.line-table td,
        .el-table.line-table th.is-leaf {
          border-bottom: 1px solid #ebeef5;
        }

        .el-table.line-table td:first-child {
          border-left: 1px solid #ebeef5;
        }

        .el-table.line-table td:last-child {
          border-right: 1px solid #ebeef5;
        }

        .el-table.line-table thead th > .cell {
          height: 36px;
          line-height: 36px;
          justify-content: center;
          padding: 0;
        }

        .el-table.detail-table thead th > .cell {
          height: 36px;
          line-height: 36px;
        }

        .el-table.line-table tbody td > .cell {
          padding-left: 0;
        }

        .gsxx-title {
          padding-left: 10px;

          &::before {
            left: 0;
          }
        }

        .indication-zy {
          font-size: 13px;
          margin-bottom: 8px;
          box-sizing: border-box;
          display: flex;

          .title {
            width: 40px;
          }

          .content {
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
          }
        }

        .indication-ypz {
          color: #5c6973;
        }
      }
    }

    // 新闻资讯
    .company-xwzx {
      .el-tabs {
        padding: 10px;
        box-sizing: border-box;
        font-size: 14px;

        .el-tabs__header {
          border-bottom: 1px solid #ebeef5;
        }
        .el-tabs__item {
          font-weight: 400;
          padding: 0 10px;
          color: #333;
          position: relative;
          &:hover {
            color: #000f32;
          }

          .num {
            color: #9aa4b8 !important;
          }

          &::after {
            content: "";
            width: 1px;
            height: 14px;
            background: #ebeef5;
            position: absolute;
            right: 0px;
            top: 14px;
          }
        }

        .el-tabs__item:last-child {
          &::after {
            content: "";
            width: 1px;
            height: 14px;
            background: transparent;
            position: absolute;
            right: 0px;
            top: 14px;
          }
        }

        .el-tabs__item.is-active {
          color: #000f32;

          .num {
            color: #5c6973 !important;
            font-weight: bold;
          }
        }
        .el-tabs__item.is-active {
          font-weight: bold;
          color: #000f32;
        }

        .el-tabs__active-bar {
          background-color: #002fa7;
          height: 3px;
          border-radius: 2px;
        }
      }
    }

    // 工商信息
    .company-gsxx {
      .qygl {
        margin: 10px;
        padding: 10px;
        box-sizing: border-box;
        background: #fafbfd;
        border-radius: 3px;

        .qygl-box {
          display: flex;
          flex-wrap: wrap;
          border-bottom: 1px solid #ebeef5;

          .box-info {
            padding-left: 14px;
            margin-bottom: 10px;
            box-sizing: border-box;
            .title {
              color: #5c6973;
              font-size: 14px;
              position: relative;

              &::after {
                content: "";
                width: 4px;
                height: 4px;
                background: #545b6d;
                position: absolute;
                left: -12px;
                top: 6px;
                border-radius: 50%;
              }
            }

            .text {
              color: #333333;
              font-size: 14px;
              font-weight: 600;

              a {
                color: #333333;

                &:hover {
                  color: #002fa7;
                  text-decoration: none;
                }
              }
            }
          }
          .box-info:nth-of-type(1),
          .box-info:nth-of-type(3) {
            width: 30%;
          }

          .box-info:nth-of-type(2),
          .box-info:nth-of-type(4) {
            width: 70%;
          }
        }

        .box-jianjie {
          padding: 10px 10px 10px 14px;
          box-sizing: border-box;
          display: flex;
          overflow: hidden;
          .title {
            color: #5c6973;
            font-size: 14px;
            position: relative;
            width: 45px;

            &::after {
              content: "";
              width: 4px;
              height: 4px;
              background: #545b6d;
              position: absolute;
              left: -12px;
              top: 8px;
              border-radius: 50%;
            }
          }

          .text {
            flex: 1;
            color: #333333;
            font-size: 14px;
            overflow: hidden;
            text-overflow: ellipsis;
            text-align: justify;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            position: relative;

            &::before {
              content: "";
              height: calc(100% - 24px);
              float: right;
            }

            &::after {
              content: "";
              width: 999vw;
              height: 999vw;
              position: absolute;
              box-shadow: inset calc(100px - 999vw) calc(30px - 999vw) 0 0
                #fafbfd;
              margin-left: -100px;
            }
          }

          .btn {
            float: right;
            clear: both;
            margin-left: 10px;
            font-size: 14px;
            color: #002fa7;
            cursor: pointer;
            margin-top: 2px;
          }
          .btn::before {
            content: "【展开】";
          }
          .exp {
            display: none;
          }

          .exp:checked + .title + .text {
            -webkit-line-clamp: 999;
          }
          .exp:checked + .title + .text::after {
            visibility: hidden;
          }
          .exp:checked + .title + .text .btn::before {
            content: "【收起】";
          }
        }
      }

      .tb-t {
        width: calc(100% - 20px);
        margin: 0 10px 10px 10px;

        tr {
          td {
            box-sizing: border-box;
            height: 32px;
            border: 1px solid #ebeef5;
            font-size: 13px;
            font-weight: 400;
            color: #333333;
            line-height: 32px;
            padding: 8px 8px 8px 2%;

            // max-width: 30vw;
            &:nth-child(odd) {
              min-width: 110px;
              width: 180px;
              background: #fafbfd;
            }

            &:nth-child(even) {
              width: 30vw;
              min-width: 270px;
              word-wrap: break-word;
              word-break: break-all;
              white-space: normal;
              background: #fff;
              line-height: 23px;
            }

            &:nth-child(2n) {
              padding: 8px 8px 8px 2%;
              color: #5c6973;
            }
          }
        }
      }
    }
  }
}
</style>
