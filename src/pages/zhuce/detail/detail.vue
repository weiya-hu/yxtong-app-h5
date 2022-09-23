<template>
  <div class="wrapper zhuce-wrapper" ref="wrapper">
    <!-- 自定义加载界面 -->
    <LoadingGif :loadFlag="isLoading" v-if="isLoading"></LoadingGif>
    <!-- 加载完成显示部分 -->
    <div class="detail-list" v-else>
      <div class="detail-header header-fixed">
        <div class="header-left">
          <div class="left-top">
            <div class="top-id" :title="data.shoulihao">
              <span>{{ data.shoulihao }}</span>
            </div>
            <div class="left-bottom">
              <span class="rss-status rss1" style="margin-right: 20px;" @click.prevent="
                handleRss(
                  rssStatus.shoulihao,
                  1,
                  data.shoulihao,
                  data.name,
                  data.qiyemingcheng,
                  'dingyueshoulihao'
                )
              " :class="{ 'abandon-click-method': nopms.rss }" v-if="data.shoulihao != ''">
                <img src="/static/imgs/rss/rss_2.png" v-if="nopms.rss" />
                <img src="/static/imgs/rss/rss_1.png" title="已订阅" v-else-if="!nopms.rss && rssStatus.shoulihao" />
                <el-tooltip v-else class="help-tip" effect="useInfoDark" content="未订阅" placement="bottom">
                  <div class="status_img"></div>
                </el-tooltip>
              </span>
              <div class="bottom-name">
                <span>{{ data.name }}</span>
                <div class="rss-status rss2" @click.prevent="
                  handleRss(
                    rssStatus.name,
                    2,
                    data.shoulihao,
                    data.name,
                    data.qiyemingcheng,
                    'dingyueyaopin'
                  )
                " :class="{ 'abandon-click-method': nopms.rss }" v-if="data.name != ''">
                  <img src="/static/imgs/rss/rss_2.png" v-if="nopms.rss" />
                  <img src="/static/imgs/rss/rss_1.png" title="已订阅" v-else-if="!nopms.rss && rssStatus.name" />
                  <el-tooltip v-else class="help-tip" effect="useInfoDark" content="未订阅" placement="bottom">
                    <div class="status_img"></div>
                  </el-tooltip>
                </div>
              </div>
              <div class="company-name" v-if="data.qiyemingcheng">
                <a :href="
                  '/search?comprehensive=company&searchwords=' +
                  data.qiyemingcheng
                ">{{ data.qiyemingcheng }}</a>
                <span class="rss-status rss3" @click.prevent="
                  handleRss(
                    rssStatus.qiye,
                    4,
                    data.shoulihao,
                    data.name,
                    data.qiyemingcheng,
                    'dingyueqiye'
                  )
                " :class="{ 'abandon-click-method': nopms.rss }" v-if="data.qiyemingcheng != ''">
                  <img src="/static/imgs/rss/rss_2.png" v-if="nopms.rss" />
                  <img src="/static/imgs/rss/rss_1.png" title="已订阅" v-else-if="!nopms.rss && rssStatus.qiye" />

                  <el-tooltip v-else class="help-tip" effect="useInfoDark" content="未订阅" placement="bottom">
                    <div class="status_img"></div>
                  </el-tooltip>
                </span>
              </div>
            </div>
            <span class="id-green bg-green round" style="margin-right: 10px !important; margin-left: 0 !important"
              v-if="data.yxsp === 1 || data.yxsp === 4" title="优先审评">优</span>
            <span class="id-green bg-blue round" style="margin-right: 10px !important; margin-left: 0 !important"
              v-if="data.zdzx" title="重大专项">重</span>
            <span class="id-green bg-orange round" style="margin-left: 0 !important" v-if="data.tspz"
              title="特殊审批">特</span>
            <span class="icon iconfont yzxpj round" style="margin-left: 10px !important" v-if="data.yzxpj == 1"
              title="一致性评价">&#xe686;</span>
            <span class="id-green" style="border-radius: 11px !important" v-if="data.zhuangtai">{{ data.zhuangtai
            }}</span>
          </div>
          <div class="header-right">
            <img src="/static/imgs/zhuce/subscribe-question-icon.png" height="14" width="14" class="question-icon"
              @mouseover="hoverType = true" />
            <div @click.prevent="
              handleRss(
                rssStatus.shoulihao,
                1,
                data.shoulihao,
                data.name,
                data.qiyemingcheng,
                'dingyue'
              )
            " class="dingyue-btn" :class="{
              'dingyue-btn-cancel': !nopms.rss && rssStatus.shoulihao,
            }">
              {{ !nopms.rss && rssStatus.shoulihao ? "取消订阅" : "订阅" }}
            </div>

            <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item><a href="/home">首页</a></el-breadcrumb-item>
              <el-breadcrumb-item><a :href="'/' + allBase.dbename">{{ allBase.dbname }}</a></el-breadcrumb-item>
              <el-breadcrumb-item>详情页</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
        </div>
      </div>
      <div class="main">
        <div class="left-nav" :style="{ top: (showPromtNotice ? 128 : 98) + 'px' }">
          <div class="nav-list nav-event" @click="handleNavClick">
            <a class="nav-item active" v-if="hasPartOne">注册信息</a>
            <a class="nav-item" v-if="
              Object.keys(data.targets).length > 0 ||
              Object.keys(data.targets_abbr).length > 0 ||
              data.indication2 ||
              data.atc
            ">更多信息</a>
            <a class="nav-item" v-if="hasPartTwo">注册时光轴</a>
            <a class="nav-item"
              v-if="data.patent.chiyourenmingcheng || data.patent.pizhunwenhaozhuanli || data.patent.table.length > 0">专利声明</a>
            <a class="nav-item" v-if="hasPartSix">药品研发及市场情况</a>
            <a class="nav-item" v-if="hasPartThree">注册生产现场检查公告</a>
            <a class="nav-item" v-if="hasPartFour">注册生产现场检查进度</a>
            <a class="nav-item" v-if="hasPartFive || nopms.devprocess">药品研发历程</a>
            <a class="nav-item" v-if="hasExtend">扩展信息</a>
          </div>
        </div>
        <div class="right-list">
          <slide-section :title="'注册信息'" class="the-part part-one" v-if="hasPartOne">
            <div class="tb-wrap">
              <table class="tb-t">
                <div class="state-sign" v-if="Boolean(Number(xulie))">
                  <img :src="`/static/imgs/xulie/xulie_${xulie}.jpg`" />
                </div>

                <tr v-if="
                  data.qiyemingcheng &&
                  data.qiyemingcheng !== '无' &&
                  data.qiyemingcheng !== '/' &&
                  data.qiyemingcheng !== '---'
                ">
                  <td>企业名称(NMPA)</td>
                  <td colspan="3">
                    <span v-if="vueCheckDetailPms('Zhuce', '企业名称(NMPA)')">{{
                    data.qiyemingcheng
                    }}</span>
                    <span v-else class="abandon-click-method">暂无权限</span>
                  </td>
                </tr>

                <tr v-if="
                  data.guifanqiyemingcheng &&
                  data.guifanqiyemingcheng !== '无' &&
                  data.guifanqiyemingcheng !== '/' &&
                  data.guifanqiyemingcheng !== '---'
                ">
                  <td>企业名称(CDE)</td>
                  <td colspan="3">
                    <span v-if="vueCheckDetailPms('Zhuce', '企业名称(CDE)')">{{
                    data.guifanqiyemingcheng
                    }}</span>
                    <span v-else class="abandon-click-method">暂无权限</span>
                  </td>
                </tr>

                <tr v-if="
                  data.banlizhuangtai &&
                  data.banlizhuangtai !== '无' &&
                  data.banlizhuangtai !== '/' &&
                  data.banlizhuangtai !== '---'
                ">
                  <td>办理状态(NMPA)</td>
                  <td colspan="3">
                    <span v-if="vueCheckDetailPms('Zhuce', '办理状态(NMPA)')">{{
                    data.banlizhuangtai
                    }}</span>
                    <span v-else class="abandon-click-method">暂无权限</span>
                  </td>
                </tr>

                <tr v-if="
                  data.zhuangtai &&
                  data.zhuangtai !== '无' &&
                  data.zhuangtai !== '/' &&
                  data.zhuangtai !== data.banlizhuangtai &&
                  data.zhuangtaikaishishijian !== data.zhuangtaidate1 &&
                  data.zhuangtai !== '---'
                ">
                  <td>办理状态(药智)</td>
                  <td colspan="3">
                    <span v-if="vueCheckDetailPms('Zhuce', '办理状态(药智)')">{{
                    data.zhuangtai
                    }}</span>
                    <span v-else class="abandon-click-method">暂无权限</span>
                  </td>
                </tr>

                <tr v-if="
                  data.zhuangtaikaishishijian &&
                  data.zhuangtaikaishishijian !== '无' &&
                  data.zhuangtaikaishishijian !== '/' &&
                  data.zhuangtaikaishishijian !== '---'
                ">
                  <td>状态开始时间(NMPA)</td>
                  <td colspan="3">
                    <span v-if="vueCheckDetailPms('Zhuce', '状态开始时间(NMPA)')">{{ data.zhuangtaikaishishijian }}</span>
                    <span v-else class="abandon-click-method">暂无权限</span>
                  </td>
                </tr>

                <tr v-if="
                  data.zhuangtaidate1 &&
                  data.zhuangtaidate1 !== '无' &&
                  data.zhuangtaidate1 !== '/' &&
                  data.zhuangtai !== data.banlizhuangtai &&
                  data.zhuangtaikaishishijian !== data.zhuangtaidate1 &&
                  data.zhuangtaidate1 !== '---'
                ">
                  <td>状态开始时间(药智)</td>
                  <td colspan="3">
                    <span v-if="vueCheckDetailPms('Zhuce', '状态开始时间(药智)')">{{ data.zhuangtaidate1 }}</span>
                    <span v-else class="abandon-click-method">暂无权限</span>
                  </td>
                </tr>

                <tr v-if="
                  data.drugidStatus &&
                  data.drugidStatus !== '无' &&
                  data.drugidStatus !== '/' &&
                  data.drugidStatus !== '---'
                ">
                  <td>申请阶段</td>
                  <td colspan="3">
                    <span v-if="vueCheckDetailPms('Zhuce', '申请阶段')">{{
                    data.drugidStatus
                    }}</span>
                    <span v-else class="abandon-click-method">暂无权限</span>
                  </td>
                </tr>

                <tr v-if="
                  data.chengbanriqi &&
                  data.chengbanriqi !== '无' &&
                  data.chengbanriqi !== '/' &&
                  data.chengbanriqi !== '---'
                ">
                  <td>承办日期</td>
                  <td colspan="3">
                    <span v-if="vueCheckDetailPms('Zhuce', '承办日期')">{{
                    data.chengbanriqi
                    }}</span>
                    <span v-else class="abandon-click-method">暂无权限</span>
                  </td>
                </tr>

                <tr v-if="
                  data.yaopinleixing_1 ||
                  data.zhuceleixing ||
                  data.zhucebanben
                ">
                  <td>
                    注册分类
                    <!-- <el-tooltip class="item tooltips-position" effect="light" placement="right">
                      <div slot="content">2007版指07年及以前颁布的注册分类；2016版 指16年颁布的注册分类（化药）；2020版指20年颁布的新版注册分类；详细的药品注册分类可前往帮助中心了解。</div>
                      <i class="el-icon-question cl-green"></i>
                    </el-tooltip> -->
                  </td>
                  <td colspan="3">
                    <span v-if="vueCheckDetailPms('Zhuce', '注册分类')">
                      <span v-if="data.yaopinleixing_1">{{
                      data.yaopinleixing_1
                      }}</span>
                      <span v-if="data.zhuceleixing">{{
                      data.zhuceleixing
                      }}</span>
                      <span v-if="data.zhucebanben">（{{ data.zhucebanben }}）</span>
                    </span>
                    <span v-else class="abandon-click-method">暂无权限</span>
                  </td>
                </tr>

                <tr v-if="
                  data.guige &&
                  data.guige !== '无' &&
                  data.guige !== '/' &&
                  data.guige !== '---'
                ">
                  <td>规格</td>
                  <td colspan="3">
                    <span v-if="vueCheckDetailPms('Zhuce', '规格')">{{
                    data.guige
                    }}</span>
                    <span v-else class="abandon-click-method">暂无权限</span>
                  </td>
                </tr>

                <tr v-if="
                  data.shenpingrenwufenlei &&
                  data.shenpingrenwufenlei !== '无' &&
                  data.shenpingrenwufenlei !== '/' &&
                  data.shenpingrenwufenlei !== '---'
                ">
                  <td>任务类型</td>
                  <td colspan="3">
                    <span v-if="vueCheckDetailPms('Zhuce', '任务类型')">{{
                    data.shenpingrenwufenlei
                    }}</span>
                    <span v-else class="abandon-click-method">暂无权限</span>
                  </td>
                </tr>

                <tr v-if="
                  data.shenqingleixing_1 &&
                  data.shenqingleixing_1 !== '无' &&
                  data.shenqingleixing_1 !== '/' &&
                  data.shenqingleixing_1 !== '---'
                ">
                  <td>申请类型</td>
                  <td colspan="3">
                    <span v-if="vueCheckDetailPms('Zhuce', '申请类型')">{{
                    data.shenqingleixing_1
                    }}</span>
                    <span v-else class="abandon-click-method">暂无权限</span>
                  </td>
                </tr>

                <tr v-if="data.lcsydjh && data.lcsydjh.length > 0">
                  <td>临床试验登记号</td>
                  <td colspan="3">
                    <span :style="wordBreak" class="t-line5" v-if="vueCheckDetailPms('Zhuce', '临床试验登记号')">
                      <router-link tag="a" :to="'/linchuangshiyan/' + item.id" target="_blank"
                        v-for="(item, index) in data.lcsydjh" :key="index"
                        style="display: inline-block; color: #4877e8">{{ item.me_id }} &nbsp;&nbsp;</router-link>
                    </span>
                    <span v-else class="abandon-click-method">暂无权限</span>
                  </td>
                </tr>

                <tr v-if="data.yzxpj == 1">
                  <td>一致性品种</td>
                  <td colspan="3">
                    <span v-if="vueCheckDetailPms('Zhuce', '一致性品种')">{{
                    data.yzxpj == 1 ? "是" : "否"
                    }}</span>
                    <span v-else class="abandon-click-method">暂无权限</span>
                  </td>
                </tr>

                <tr v-if="data.wftjcbzj && data.wftjcbzj !== '否'">
                  <td>
                    无需开展一致性评价品种
                    <el-tooltip class="item tooltips-position" effect="light" placement="right">
                      <div slot="content" v-html="helpDesc.wftjcbzj"></div>
                      <i class="el-icon-question cl-green"></i>
                    </el-tooltip>
                  </td>
                  <td colspan="3">
                    <span v-if="
                      vueCheckDetailPms('Zhuce', '无需开展一致性评价品种')
                    ">{{ data.wftjcbzj }}</span>
                    <span v-else class="abandon-click-method">暂无权限</span>
                  </td>
                </tr>

                <tr v-if="data.gdcf && data.gdcf !== '否'">
                  <td>
                    过度重复品种
                    <el-tooltip class="item tooltips-position" effect="light" placement="right">
                      <div slot="content" v-html="helpDesc.gdcf"></div>
                      <i class="el-icon-question cl-green"></i>
                    </el-tooltip>
                  </td>
                  <td colspan="3">
                    <span v-if="vueCheckDetailPms('Zhuce', '过度重复品种')">{{
                    data.gdcf
                    }}</span>
                    <span v-else class="abandon-click-method">暂无权限</span>
                  </td>
                </tr>

                <tr v-if="data.lcjxjwxy == 2">
                  <td>
                    临床急需境外新药
                    <el-tooltip class="item tooltips-position" effect="light" placement="right">
                      <div slot="content" v-html="helpDesc.lcjxjwxy"></div>
                      <i class="el-icon-question cl-green"></i>
                    </el-tooltip>
                  </td>
                  <td colspan="3">
                    <span v-if="vueCheckDetailPms('Zhuce', '临床急需境外新药')">{{ data.lcjxjwxy == 2 ? "是" : "否" }}
                    </span>
                    <span v-else class="abandon-click-method">暂无权限</span>
                  </td>
                </tr>

                <tr v-if="data.tpxzl && data.tpxzl !== '否'">
                  <td>是否突破性治疗品种</td>
                  <td colspan="3">
                    <span v-if="vueCheckDetailPms('Zhuce', '是否突破性治疗品种')">{{ data.tpxzl }}</span>
                    <span v-else class="abandon-click-method">暂无权限</span>
                  </td>
                </tr>

                <tr v-if="data.zjxzsp && data.zjxzsp !== '否'">
                  <td>是否直接行政审批</td>
                  <td colspan="3">
                    <span v-if="vueCheckDetailPms('Zhuce', '是否直接行政审批')">{{ data.zjxzsp }}</span>
                    <span v-else class="abandon-click-method">暂无权限</span>
                  </td>
                </tr>

                <tr v-if="data.yxsp == 1 || data.yxsp == 4">
                  <td>
                    是否优先审评品种
                    <el-tooltip class="item tooltips-position" effect="light" placement="right">
                      <div slot="content" v-html="helpDesc.yxsp"></div>
                      <i class="el-icon-question cl-green"></i>
                    </el-tooltip>
                  </td>
                  <td colspan="3">
                    <span v-if="vueCheckDetailPms('Zhuce', '是否优先审评品种')">{{ data.yxsp == 1 || data.yxsp == 4 ? "是" : "否"
                    }}
                      <span v-if="
                        data.yxsply != '否' &&
                        data.yxsply !== '' &&
                        data.yxsp !== 0
                      ">（纳入理由：{{ data.yxsply }}）</span>
                    </span>
                    <span v-else class="abandon-click-method">暂无权限</span>
                  </td>
                </tr>

                <tr v-if="data.tspz == 1">
                  <td>特殊审批品种</td>
                  <td colspan="3">
                    <span v-if="vueCheckDetailPms('Zhuce', '特殊审批品种')">{{
                    data.tspz ? "是" : "否"
                    }}</span>
                    <span v-else class="abandon-click-method">暂无权限</span>
                  </td>
                </tr>

                <tr v-if="data.zdzx == 1">
                  <td>重大专项品种</td>
                  <td colspan="3">
                    <span v-if="vueCheckDetailPms('Zhuce', '重大专项品种')">{{
                    data.zdzx ? "是" : "否"
                    }}</span>
                    <span v-else class="abandon-click-method">暂无权限</span>
                  </td>
                </tr>

                <tr v-if="
                  data.shoufeiqingkuang &&
                  data.shoufeiqingkuang !== '无' &&
                  data.shoufeiqingkuang !== '/' &&
                  data.shoufeiqingkuang !== '---'
                ">
                  <td>收费情况</td>
                  <td colspan="3">
                    <span v-if="vueCheckDetailPms('Zhuce', '收费情况')">{{
                    data.shoufeiqingkuang
                    }}</span>
                    <span v-else class="abandon-click-method">暂无权限</span>
                  </td>
                </tr>

                <tr v-if="
                  data.feiyongdaozhiri &&
                  data.feiyongdaozhiri !== '无' &&
                  data.feiyongdaozhiri !== '/' &&
                  data.feiyongdaozhiri !== '---'
                ">
                  <td>费用收到日</td>
                  <td colspan="3">
                    <span v-if="vueCheckDetailPms('Zhuce', '费用收到日')">{{
                    data.feiyongdaozhiri
                    }}</span>
                    <span v-else class="abandon-click-method">暂无权限</span>
                  </td>
                </tr>

                <tr v-if="
                  data.jianyanbaogaoshoudaori &&
                  data.jianyanbaogaoshoudaori !== '无' &&
                  data.jianyanbaogaoshoudaori !== '/' &&
                  data.jianyanbaogaoshoudaori !== '---'
                ">
                  <td>检验报告收到日</td>
                  <td colspan="3">
                    <span v-if="vueCheckDetailPms('Zhuce', '检验报告收到日')">{{
                    data.jianyanbaogaoshoudaori
                    }}</span>
                    <span v-else class="abandon-click-method">暂无权限</span>
                  </td>
                </tr>

                <tr v-if="
                  data.biaozhunpinhuizhishoudaori &&
                  data.biaozhunpinhuizhishoudaori !== '无' &&
                  data.biaozhunpinhuizhishoudaori !== '/' &&
                  data.biaozhunpinhuizhishoudaori !== '---'
                ">
                  <td>标准品回执收到日</td>
                  <td colspan="3">
                    <span v-if="vueCheckDetailPms('Zhuce', '标准品回执收到日')">{{ data.biaozhunpinhuizhishoudaori }}</span>
                    <span v-else class="abandon-click-method">暂无权限</span>
                  </td>
                </tr>

                <tr v-if="
                  data.tongzhineirong &&
                  data.tongzhineirong !== '无' &&
                  data.tongzhineirong !== '/' &&
                  data.tongzhineirong !== '---'
                ">
                  <td>通知内容</td>
                  <td colspan="3">
                    <span v-if="vueCheckDetailPms('Zhuce', '通知内容')">{{
                    data.tongzhineirong
                    }}</span>
                    <span v-else class="abandon-click-method">暂无权限</span>
                  </td>
                </tr>

                <tr v-if="
                  data.tongzhishijian &&
                  data.tongzhishijian !== '无' &&
                  data.tongzhishijian !== '/' &&
                  data.tongzhishijian !== '---'
                ">
                  <td>通知时间</td>
                  <td colspan="3">
                    <span v-if="vueCheckDetailPms('Zhuce', '通知时间')">{{
                    data.tongzhishijian
                    }}</span>
                    <span v-else class="abandon-click-method">暂无权限</span>
                  </td>
                </tr>

                <tr v-if="data.songda && data.songda.length > 0">
                  <td>
                    送达信息
                    <el-tooltip class="item tooltips-position" effect="light" placement="right">
                      <div slot="content" v-html="helpDesc.deliveryInformation"></div>
                      <i class="el-icon-question cl-green"></i>
                    </el-tooltip>
                  </td>
                  <td colspan="3">
                    <span v-if="vueCheckDetailPms('Zhuce', '送达信息')">
                      <div v-for="(item, index) in data.songda" :key="index">
                        {{ item }}
                      </div>
                    </span>
                    <span v-else class="abandon-click-method">暂无权限</span>
                  </td>
                </tr>

                <tr v-if="
                  data.jielun &&
                  data.jielun !== '无' &&
                  data.jielun !== '/' &&
                  data.jielun !== '---'
                ">
                  <td>
                    审评结论
                    <el-tooltip class="item tooltips-position" effect="light" placement="right">
                      <div slot="content" v-html="helpDesc.jielun"></div>
                      <i class="el-icon-question cl-green"></i>
                    </el-tooltip>
                  </td>
                  <td colspan="3">
                    <div style="display: flex">
                      <span :style="wordBreak" class="t-line5" v-if="vueCheckDetailPms('Zhuce', '审评结论')">{{ data.jielun
                      }}</span>
                      <span v-else class="abandon-click-method">暂无权限</span>
                      <!-- 判断类型是否为预测状态：0(预测)、1(预测结论)、2(预测对的结论)、3(有争议的)  v-if="data.type == '0'" -->
                      <em v-if="data.type == '1' && data.jielun != ''" class="status-fore" title="预测结论">预</em>
                    </div>
                  </td>
                </tr>

                <tr v-if="
                  data.linchuangdate &&
                  data.linchuangdate !== '无' &&
                  data.linchuangdate !== '/' &&
                  data.linchuangdate !== '---'
                ">
                  <td>
                    临床试验默认许可日期
                    <el-tooltip class="item tooltips-position" effect="light" placement="right">
                      <div slot="content" v-html="helpDesc.defaultLicenseDate"></div>
                      <i class="el-icon-question cl-green"></i>
                    </el-tooltip>
                  </td>
                  <td colspan="3">
                    <span v-if="vueCheckDetailPms('Zhuce', '临床试验默认许可日期')">{{ data.linchuangdate }}</span>
                    <span v-else class="abandon-click-method">暂无权限</span>
                  </td>
                </tr>

                <tr v-if="
                  data.qianfadate &&
                  data.qianfadate !== '无' &&
                  data.qianfadate !== '/' &&
                  data.qianfadate !== '---'
                ">
                  <td>批件签发日期</td>
                  <td colspan="3">
                    <span v-if="vueCheckDetailPms('Zhuce', '批件签发日期')">{{
                    data.qianfadate
                    }}</span>
                    <span v-else class="abandon-click-method">暂无权限</span>
                  </td>
                </tr>

                <tr v-if="
                  data.date &&
                  data.date !== '无' &&
                  data.date !== '/' &&
                  data.date !== '---'
                ">
                  <td>结论公示日期</td>
                  <td colspan="3">
                    <span v-if="vueCheckDetailPms('Zhuce', '结论公示日期')">{{
                    data.date
                    }}</span>
                    <span v-else class="abandon-click-method">暂无权限</span>
                  </td>
                </tr>

                <tr v-if="
                  data.report &&
                  data.report !== '无' &&
                  data.report !== '/' &&
                  data.report !== '---'
                ">
                  <td>审评报告</td>
                  <td colspan="3">
                    <template v-if="data.report != ''">
                      <span class="linksBtn" v-if="vueCheckDetailPms('Zhuce', '审评报告')"
                        @click="redirectNewPage(data.report)">查看</span>
                      <span v-else class="abandon-click-method">暂无权限</span>
                    </template>
                    <span v-else>&nbsp;</span>
                  </td>
                </tr>

                <tr v-if="
                  data.instruct &&
                  data.instruct !== '无' &&
                  data.instruct !== '/' &&
                  data.instruct !== '---'
                ">
                  <td>说明书</td>
                  <td colspan="3">
                    <template v-if="data.instruct != ''">
                      <span class="linksBtn" v-if="vueCheckDetailPms('Zhuce', '说明书')"
                        @click="redirectNewPage(data.instruct)">查看</span>
                      <span v-else class="abandon-click-method">暂无权限</span>
                    </template>
                    <span v-else>&nbsp;</span>
                  </td>
                </tr>

                <tr v-if="
                  data.pizhunwenhao &&
                  data.pizhunwenhao !== '无' &&
                  data.pizhunwenhao !== '/' &&
                  data.pizhunwenhao !== '---'
                ">
                  <td>批准文号</td>
                  <td colspan="3">
                    <span v-if="vueCheckDetailPms('Zhuce', '批准文号')">{{
                    data.pizhunwenhao
                    }}</span>
                    <span v-else class="abandon-click-method">暂无权限</span>
                  </td>
                </tr>

                <tr v-if="
                  data.yuanpizhunwenhao &&
                  data.yuanpizhunwenhao !== '无' &&
                  data.yuanpizhunwenhao !== '/' &&
                  data.yuanpizhunwenhao !== '---'
                ">
                  <td>原批准文号</td>
                  <td colspan="3">
                    <span v-if="vueCheckDetailPms('Zhuce', '原批准文号')">{{
                    data.yuanpizhunwenhao
                    }}</span>
                    <span v-else class="abandon-click-method">暂无权限</span>
                  </td>
                </tr>

                <tr v-if="
                  data.indication1 &&
                  data.indication1 !== '无' &&
                  data.indication1 !== '/' &&
                  data.indication1 !== '---'
                ">
                  <td>
                    适应症(受理号)
                    <el-tooltip class="item tooltips-position" effect="light" placement="right">
                      <div slot="content">
                        该受理号对应的适应症，来源临床默示许可、优先审评、临床试验、新闻信息等。
                      </div>
                      <i class="el-icon-question cl-green"></i>
                    </el-tooltip>
                  </td>
                  <td colspan="3">
                    <span :style="wordBreak" class="t-line5" v-if="vueCheckDetailPms('Zhuce', '适应症(受理号)')"
                      v-html="data.indication1"></span>
                    <span v-else class="abandon-click-method">暂无权限</span>
                  </td>
                </tr>

                <tr v-if="
                  data.remarks &&
                  data.remarks !== '无' &&
                  data.remarks !== '/' &&
                  data.remarks !== '---'
                ">
                  <td>备注信息</td>
                  <td colspan="3">
                    <span v-if="vueCheckDetailPms('Zhuce', '备注信息')" v-html="data.remarks"></span>
                    <span v-else class="abandon-click-method">暂无权限</span>
                  </td>
                </tr>
              </table>
            </div>
          </slide-section>

          <slide-section :title="'更多信息'" class="the-part part-one" v-if="
            Object.keys(data.targets).length > 0 ||
            Object.keys(data.targets_abbr).length > 0 ||
            data.indication2 ||
            data.atc
          ">
            <div class="tb-wrap">
              <table class="tb-t">
                <tr v-if="data.atc">
                  <td>ATC分类</td>
                  <td colspan="3">
                    <template v-if="vueCheckDetailPms('Zhuce', 'ATC分类')">
                      <div v-for="(item, index) in getAtcNames(data.atc)" :key="item" class="clearfix">
                        <span>{{ item }}&nbsp;&nbsp;</span><span>{{ getAtc(item, data.atcarr) }}</span>
                        <br v-if="index % 2 != 0" />
                      </div>
                    </template>
                    <span v-else class="abandon-click-method">暂无权限</span>
                  </td>
                </tr>

                <tr v-if="
                  data.indication2 &&
                  data.indication2 !== '无' &&
                  data.indication2 !== '/' &&
                  data.indication2 !== '---'
                ">
                  <td>
                    适应症(品种)
                    <el-tooltip class="item tooltips-position" effect="light" placement="right">
                      <div slot="content">
                        该药品对应的适应症：来源药品说明书。
                      </div>
                      <i class="el-icon-question cl-green"></i>
                    </el-tooltip>
                  </td>
                  <td colspan="3">
                    <span :style="wordBreak" class="t-line5" v-if="vueCheckDetailPms('Zhuce', '适应症(品种)')"
                      v-html="data.indication2"></span>
                    <span v-else class="abandon-click-method">暂无权限</span>
                  </td>
                </tr>

                <tr v-if="
                  data.targets_abbr &&
                  Object.keys(data.targets_abbr).length > 0
                ">
                  <td>靶点简称</td>
                  <td colspan="3">
                    <span :style="wordBreak" class="t-line5" v-if="vueCheckDetailPms('Zhuce', '靶点简称')">
                      <div v-for="(value, key, index) in data.targets_abbr" v-if="value != ''" :key="index" style="
                          width: 27vw;
                          min-width: 270px;
                          overflow: hidden;
                          text-overflow: ellipsis;
                          white-space: nowrap;
                        ">
                        <router-link tag="a" :to="'/targetdatas/' + value" target="_blank" :title="key"
                          style="color: #4877e8">{{ key }}</router-link>
                      </div>
                      <span v-else style="
                          display: inline-block;
                          width: 27vw;
                          min-width: 270px;
                          overflow: hidden;
                          text-overflow: ellipsis;
                          white-space: nowrap;
                        ">{{ key }}</span>
                    </span>
                    <div v-else class="abandon-click-method">暂无权限</div>
                  </td>
                </tr>

                <tr v-if="data.targets && Object.keys(data.targets).length > 0">
                  <td>靶点全称</td>
                  <td colspan="3">
                    <span :style="wordBreak" class="t-line5" v-if="vueCheckDetailPms('Zhuce', '靶点全称')">
                      <div v-for="(value, key, index) in data.targets" v-if="value != ''" :key="index" style="
                          width: 27vw;
                          min-width: 270px;
                          overflow: hidden;
                          text-overflow: ellipsis;
                          white-space: nowrap;
                        ">
                        <router-link tag="a" :to="'/targetdatas/' + value" target="_blank" :title="key"
                          style="color: #4877e8">{{ key }}</router-link>
                      </div>
                      <span v-else style="
                          width: 27vw;
                          display: inline-block;
                          min-width: 270px;
                          overflow: hidden;
                          text-overflow: ellipsis;
                          white-space: nowrap;
                        ">{{ key }}</span>
                    </span>
                    <div v-else class="abandon-click-method">暂无权限</div>
                  </td>
                </tr>

                <tr v-if="isEmpty(data.dailiangcaigou) && data.dailiangcaigou !== '否'">
                  <td>带量采购品种
                    <el-tooltip class="item tooltips-position" effect="light" placement="right">
                      <div slot="content">
                        <p>带量采购是国家药品组织的药品集中采购制度的重大改革，首先由4+7城市试点，目前已在全国范围开展。</p>
                      </div>
                      <i class="el-icon-question cl-green"></i>
                    </el-tooltip>
                  </td>
                  <td colspan="3">
                    <span v-if="vueCheckDetailPms('Zhuce', '带量采购品种')">{{ data.dailiangcaigou }}</span>
                    <span v-else class="abandon-click-method">暂无权限</span>
                  </td>
                </tr>
              </table>
            </div>
          </slide-section>

          <slide-section :title="'注册时光轴'" class="the-part part-two zc-time-node" v-if="hasPartTwo">
            <TimeNode @emitTimeLine="emitTimeLine" @changeLoading="changeLoading" :info="data" v-if="!nopms.timeline" />

            <!-- 时光轴 - 无权限提示 -->
            <div class="detail-nopms" v-else>
              <div class="detail-nopms-describe">
                <img src="/static/imgs/zhuce/nopms_icon.jpg" />
                <p>对不起，您暂无该功能权限，需升级权限享用更多功能。</p>
                <p>
                  请你联系客服
                  <span class="cl-orange fs16 fw-bold">400-678-0778</span>
                </p>
              </div>
            </div>
          </slide-section>

          <slide-section :title="'专利声明'" class="the-part part-one"
            v-if="data.patent.chiyourenmingcheng || data.patent.pizhunwenhaozhuanli || data.patent.table.length > 0">
            <div class="tb-wrap">
              <div class="zl-box" v-if="data.patent.chiyourenmingcheng || data.patent.pizhunwenhaozhuanli">
                <span>
                  被仿制药批准文号/注册证号：<span class="text">{{ data.patent.pizhunwenhaozhuanli }}</span>
                </span>
                <span>
                  被仿制药持有人企业名称：<span class="text">{{ data.patent.chiyourenmingcheng }}</span>
                </span>
              </div>

              <table border="1" cellspacing="0" class="zl-table" v-if="data.patent.table.length > 0">
                <tr>
                  <th v-for="text in zlTableHead" :key="text.prop" :class="{ 'w230': text.prop === 'no' }">{{ text.label
                  }}
                    <el-tooltip class="item tooltips-position" effect="light" placement="right"
                      v-if="text.prop == 'zhuanlishengmingleixing'">
                      <div slot="content">
                        <p>1类：中国上市药品专利信息登记平台中没有被仿制药品相关专利信息（专利信息登记平台登记号、登记的专利号均填写“无”）；</p>
                        <p>2类：中国上市药品专利信息登记平台收录的被仿制药品相关专利权已终止或者被宣告无效，或者仿制药申请人已获得专利权人相关专利实施许可（在备注中注明相应的具体情形）；</p>
                        <p>3类：中国上市药品专利信息登记平台收录有被仿制药品相关专利，仿制药申请人承诺在相应专利权有效期届满之前所申请的仿制药暂不上市；</p>
                        <p>4.1类：中国上市药品专利信息登记平台收录的被仿制药品相关专利权应当被宣告无效；</p>
                        <p>4.2类：仿制药未落入中国上市药品专利信息登记平台收录的被仿制药品相关专利权保护范围。</p>
                      </div>
                      <i class="el-icon-question cl-green"></i>
                    </el-tooltip>
                  </th>
                </tr>
                <tr v-for="(item, i) in data.patent.table" :key="i">
                  <td v-for="key in zlTableHead" :key="key.prop">
                    <div v-html="handlerHTML(i, key.prop)"></div>
                  </td>
                </tr>
              </table>
            </div>
          </slide-section>

          <slide-section :title="'药品研发及市场情况'" class="the-part part-one" v-if="hasPartSix">
            <template v-slot:header>
              <div class="flex justify-flexend" style="height: 26px;position: absolute;right: 10px;">
                <el-button class="time-export" type="primary" size="mini" round
                  @click="linkToShangshigonggao(data.shangshigonggao)">注册批件公告信息</el-button>
              </div>
            </template>
            <div class="tb-wrap">
              <table class="tb-t">
                <tr v-if="handlerField(data.shangshigonggao.yuanyangongsi)">
                  <td>原研单位</td>
                  <td colspan="3">
                    <span v-if="vueCheckDetailPms('Zhuce', '原研单位')">{{
                    data.shangshigonggao.yuanyangongsi
                    }}</span>
                    <span v-else class="abandon-click-method">暂无权限</span>
                  </td>
                </tr>
                <tr v-if="handlerField(data.shangshigonggao.yanfafeiyong)">
                  <td>研发费用（人民币）</td>
                  <td colspan="3">
                    <span v-if="vueCheckDetailPms('Zhuce', '研发费用（人民币）')">{{
                    data.shangshigonggao.yanfafeiyong
                    }}</span>
                    <span v-else class="abandon-click-method">暂无权限</span>
                  </td>
                </tr>
                <tr v-if="handlerField(data.shangshigonggao.sale)">
                  <td>国内本品种年度销售额</td>
                  <td colspan="3">
                    <span v-if="vueCheckDetailPms('Zhuce', '国内本品种年度销售额')">{{
                    data.shangshigonggao.sale
                    }}</span>
                    <span v-else class="abandon-click-method">暂无权限</span>
                  </td>
                </tr>
                <tr v-if="handlerField(data.shangshigonggao.globalsale)">
                  <td>全球本品种年度销售额</td>
                  <td colspan="3">
                    <span v-if="vueCheckDetailPms('Zhuce', '全球本品种年度销售额')">{{
                    data.shangshigonggao.globalsale
                    }}</span>
                    <span v-else class="abandon-click-method">暂无权限</span>
                  </td>
                </tr>
                <tr v-if="handlerField(data.shangshigonggao.itsglobalsale)">
                  <td>公司本品种全球销售额</td>
                  <td colspan="3">
                    <span v-if="vueCheckDetailPms('Zhuce', '公司本品种全球销售额')">{{
                    data.shangshigonggao.itsglobalsale
                    }}</span>
                    <span v-else class="abandon-click-method">暂无权限</span>
                  </td>
                </tr>
                <tr v-if="handlerField(data.shangshigonggao.itshomesale)">
                  <td>公司本品种国内销售额</td>
                  <td colspan="3">
                    <span v-if="vueCheckDetailPms('Zhuce', '公司本品种国内销售额')">{{
                    data.shangshigonggao.itshomesale
                    }}</span>
                    <span v-else class="abandon-click-method">暂无权限</span>
                  </td>
                </tr>
                <tr v-if="handlerField(data.shangshigonggao.jingpin)">
                  <td>竞品情况</td>
                  <td colspan="3">
                    <span v-if="vueCheckDetailPms('Zhuce', '竞品情况')">{{
                    data.shangshigonggao.jingpin
                    }}</span>
                    <span v-else class="abandon-click-method">暂无权限</span>
                  </td>
                </tr>
                <tr v-if="handlerField(data.shangshigonggao.remarks)">
                  <td>备注</td>
                  <td colspan="3">
                    <span v-if="vueCheckDetailPms('Zhuce', '备注')">{{
                    data.shangshigonggao.remarks
                    }}</span>
                    <span v-else class="abandon-click-method">暂无权限</span>
                  </td>
                </tr>
              </table>
            </div>
          </slide-section>

          <slide-section :title="'注册生产现场检查公告'" class="the-part part-three" v-if="hasPartThree">
            <div class="tb-wrap">
              <table class="tb-t">
                <tr v-for="(infos, index) in noticeInfos" :key="index">
                  <td>{{ infos[0].name }}</td>
                  <td>{{ infos[0].state }}</td>
                  <td>{{ infos[1].name }}</td>
                  <td>{{ infos[1].state }}</td>
                </tr>
              </table>
            </div>
          </slide-section>

          <slide-section :title="'注册生产现场检查进度'" class="the-part part-four" v-if="hasPartFour">
            <div class="tb-wrap">
              <div class="time">
                <div class="time-item">
                  <span class="time-name">受理日期：</span>
                  {{ currentStep.shouliriqi }}
                </div>
                <div class="time-item">
                  <span class="time-name">送CDE时间：</span>
                  {{ currentStep.cdeshijian }}
                </div>
              </div>
              <div class="progress-step">
                <div class="steps">
                  <div class="step" v-for="(step, index) in steps" :key="index" :class="{ active: index <= jdstep }">
                    <!-- 右上角勾标识 -->
                    <div class="tick" v-if="index <= jdstep">
                      <i class="iconfont tick-icon">&#xe664;</i>
                    </div>
                    <!-- 圆框前的线 -->
                    <div class="line-before" v-if="index !== 0"></div>
                    <!-- 圆框主体 -->
                    <div class="icon">
                      <i class="iconfont icons" v-html="step.icon"></i>
                    </div>
                    <!-- 圆框后的线 -->
                    <div class="line-after" v-if="index !== steps.length - 1"></div>
                    <!-- 圆框下面的文字 -->
                    <div class="name">{{ step.name }}</div>
                  </div>
                </div>
              </div>
            </div>
          </slide-section>

          <slide-section :title="'药品研发历程'" class="the-part part-five" v-if="hasPartFive || nopms.devprocess">
            <div class="tb-wrap" v-if="!nopms.devprocess">
              <div class="med-info">
                <div class="info-item">
                  <span class="info-name">药品名称：</span>
                  {{ data.name }}
                </div>
                <div class="info-item">
                  <span class="info-name">NMPA企业名称：</span>
                  {{ data.qiyemingcheng }}
                </div>
                <div class="info-item">
                  <span class="info-name">CDE企业名称：</span>
                  {{ data.guifanqiyemingcheng }}
                </div>
              </div>
              <div class="progress-info">
                <div class="up-down">
                  <div class="up" @click="handleUpClick">
                    <i class="iconfont">&#xe718;</i>
                  </div>
                  <div class="md-line"></div>
                  <div class="down" @click="handleDownClick">
                    <i class="iconfont">&#xe719;</i>
                  </div>
                </div>
                <div class="all-info" @scroll="handleAllInfoScroll">
                  <div class="info" v-for="(val1, key1, index1) in devProcess" :key="index1">
                    <div class="info-detail">
                      <div class="info-table">
                        <div class="table-item" v-for="(item, index2) in val1" :key="index2">
                          <div class="time" v-if="index2 === 0 && key1">
                            <span class="year">{{
                            key1.toString().split("；")[0].split("-")[0]
                            }}年</span>
                            <span class="m-d">{{
                            key1.toString().split("；")[0].split("-")[1]
                            }}月{{
                              key1.toString().split("；")[0].split("-")[2]
                              }}日</span>
                          </div>
                          <!-- 没有具体年月日时，则如下显示 -->
                          <div class="time" v-else-if="index2 === 0 && !key1">
                            <span class="m-d">日期不详</span>
                            <span class="year">年份不详</span>
                          </div>
                          <div class="circle" v-if="index2 === 0"></div>
                          <div :class="{
                            'line-one': index2 === 0,
                            'line-other': index2 !== 0,
                          }"></div>
                          <div class="line"></div>
                          <table>
                            <tr>
                              <td v-bind:rowspan="
                                getRowSpan(resetTableObject(item, key1))
                              " class="spe-td">
                                {{ item.drugidStatus }}
                              </td>
                              <td v-for="(val2, index2) in resetTableObject(
                                item,
                                key1
                              )" :key="index2" v-if="index2 >= 0 && index2 < 3" :colspan="val2.col">
                                <span>
                                  {{
                                  $t("lDetail.devProgress." + val2.thename)
                                  }}

                                  <span v-if="
                                    (val2.thename === 'shoulihao' ||
                                      val2.thename === 'me_id' ||
                                      (val2.thename == 'pizhunwenhao' &&
                                        item.pizhunwenhao_type != 0)) &&
                                    item.id
                                  ">
                                    <span v-for="(
                                        txt, txtKey, txti
                                      ) in val2.thevalue" :key="txti">
                                      <router-link class="link" :to="
                                        yflcLink(
                                          item,
                                          val2.thename,
                                          txt,
                                          txtKey
                                        )
                                      " target="_blank">{{ txt }}
                                      </router-link>
                                      <span style="color: #545b6d" v-if="
                                        txti <
                                        Object.keys(val2.thevalue).length - 1
                                      ">
                                        /
                                      </span>
                                    </span>
                                  </span>
                                  <span v-else>
                                    {{ val2.thevalue }}
                                    <span v-if="
                                      item.pijian &&
                                      item.pijian.pizhunwenhao &&
                                      val2.thename == 'jielun'
                                    ">
                                      (批准文号：
                                      <!-- item.pijian.tp = 1 国产 否则进口 -->
                                      <a class="pzh" v-if="item.pijian.xuhao" :href="
                                        item.pijian.tp == 1
                                          ? `/cfdadrug/detail/${item.pijian.xuhao}?pizhunwenhao=${item.pijian.pizhunwenhao}`
                                          : `/cfdadrug/jkdetail/${item.pijian.xuhao}?pizhunwenhao=${item.pijian.pizhunwenhao}`
                                      " target="_blank">{{ item.pijian.pizhunwenhao }}</a>
                                      <span v-else>{{
                                      item.pijian.pizhunwenhao
                                      }}</span>)
                                    </span>
                                  </span>
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td v-for="(val2, index2) in resetTableObject(
                                item,
                                key1
                              )" :key="index2" v-if="index2 >= 3 && index2 < 6" :colspan="val2.col">
                                <span>
                                  {{
                                  $t("lDetail.devProgress." + val2.thename)
                                  }}
                                  <span v-if="
                                    (val2.thename === 'shoulihao' ||
                                      val2.thename === 'me_id' ||
                                      (val2.thename == 'pizhunwenhao' &&
                                        item.pizhunwenhao_type != 0)) &&
                                    item.id
                                  ">
                                    <span v-for="(
                                        txt, txtKey, txti
                                      ) in val2.thevalue" :key="txti">
                                      <router-link class="link" :to="
                                        yflcLink(
                                          item,
                                          val2.thename,
                                          txt,
                                          txtKey
                                        )
                                      " target="_blank">{{ txt }}
                                      </router-link>
                                      <span style="color: #545b6d" v-if="
                                        txti <
                                        Object.keys(val2.thevalue).length - 1
                                      ">
                                        /
                                      </span>
                                    </span>
                                  </span>
                                  <span v-else>
                                    {{ val2.thevalue }}

                                    <span v-if="
                                      item.pijian &&
                                      item.pijian.pizhunwenhao &&
                                      val2.thename == 'jielun'
                                    ">
                                      (批准文号：
                                      <!-- item.pijian.tp = 1 国产 否则进口 -->
                                      <a class="pzh" v-if="item.pijian.xuhao" :href="
                                        item.pijian.tp == 1
                                          ? `/cfdadrug/detail/${item.pijian.xuhao}?pizhunwenhao=${item.pijian.pizhunwenhao}`
                                          : `/cfdadrug/jkdetail/${item.pijian.xuhao}?pizhunwenhao=${item.pijian.pizhunwenhao}`
                                      " target="_blank">{{ item.pijian.pizhunwenhao }}</a>
                                      <span v-else>{{
                                      item.pijian.pizhunwenhao
                                      }}</span>)
                                    </span>
                                  </span>
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td v-for="(val2, index2) in resetTableObject(
                                item,
                                key1
                              )" :key="index2" v-if="index2 >= 6 && index2 < 9" :colspan="val2.col">
                                <span>
                                  {{
                                  $t("lDetail.devProgress." + val2.thename)
                                  }}
                                  <span v-if="
                                    (val2.thename === 'shoulihao' ||
                                      val2.thename === 'me_id' ||
                                      (val2.thename == 'pizhunwenhao' &&
                                        item.pizhunwenhao_type != 0)) &&
                                    item.id
                                  ">
                                    <span v-for="(
                                        txt, txtKey, txti
                                      ) in val2.thevalue" :key="txti">
                                      <router-link class="link" :to="
                                        yflcLink(
                                          item,
                                          val2.thename,
                                          txt,
                                          txtKey
                                        )
                                      " target="_blank">{{ txt }}
                                      </router-link>
                                      <span style="color: #545b6d" v-if="
                                        txti <
                                        Object.keys(val2.thevalue).length - 1
                                      ">
                                        /
                                      </span>
                                    </span>
                                  </span>
                                  <span v-else>
                                    {{ val2.thevalue }}
                                    <span v-if="
                                      item.pijian &&
                                      item.pijian.pizhunwenhao &&
                                      val2.thename == 'jielun'
                                    ">
                                      (批准文号：
                                      <!-- item.pijian.tp = 1 国产 否则进口 -->
                                      <a class="pzh" v-if="item.pijian.xuhao" :href="
                                        item.pijian.tp == 1
                                          ? `/cfdadrug/detail/${item.pijian.xuhao}?pizhunwenhao=${item.pijian.pizhunwenhao}`
                                          : `/cfdadrug/jkdetail/${item.pijian.xuhao}?pizhunwenhao=${item.pijian.pizhunwenhao}`
                                      " target="_blank">{{ item.pijian.pizhunwenhao }}</a>
                                      <span v-else>{{
                                      item.pijian.pizhunwenhao
                                      }}</span>)
                                    </span>
                                  </span>
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td v-for="(val2, index2) in resetTableObject(
                                item,
                                key1
                              )" :key="index2" v-if="index2 >= 9 && index2 < 12" :colspan="val2.col">
                                <span>
                                  {{
                                  $t("lDetail.devProgress." + val2.thename)
                                  }}
                                  <span v-if="
                                    (val2.thename === 'shoulihao' ||
                                      val2.thename === 'me_id' ||
                                      (val2.thename == 'pizhunwenhao' &&
                                        item.pizhunwenhao_type != 0)) &&
                                    item.id
                                  ">
                                    <span v-for="(
                                        txt, txtKey, txti
                                      ) in val2.thevalue" :key="txti">
                                      <router-link class="link" :to="
                                        yflcLink(
                                          item,
                                          val2.thename,
                                          txt,
                                          txtKey
                                        )
                                      " target="_blank">{{ txt }}
                                      </router-link>
                                      <span style="color: #545b6d" v-if="
                                        txti <
                                        Object.keys(val2.thevalue).length - 1
                                      ">
                                        /
                                      </span>
                                    </span>
                                  </span>
                                  <span v-else>
                                    {{ val2.thevalue }}
                                    <span v-if="
                                      item.pijian &&
                                      item.pijian.pizhunwenhao &&
                                      val2.thename == 'jielun'
                                    ">
                                      (批准文号：
                                      <!-- item.pijian.tp = 1 国产 否则进口 -->
                                      <a class="pzh" v-if="item.pijian.xuhao" :href="
                                        item.pijian.tp == 1
                                          ? `/cfdadrug/detail/${item.pijian.xuhao}?pizhunwenhao=${item.pijian.pizhunwenhao}`
                                          : `/cfdadrug/jkdetail/${item.pijian.xuhao}?pizhunwenhao=${item.pijian.pizhunwenhao}`
                                      " target="_blank">{{ item.pijian.pizhunwenhao }}</a>
                                      <span v-else>{{
                                      item.pijian.pizhunwenhao
                                      }}</span>)
                                    </span>
                                  </span>
                                </span>
                              </td>
                            </tr>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- 药品研发历程 - 无权限提示 -->
            <div class="detail-nopms" v-else>
              <!-- <img src="/static/imgs/zhuce/devprocess_before.jpg" class="pic-behind"> -->
              <div class="detail-nopms-describe">
                <img src="/static/imgs/zhuce/nopms_icon.jpg" />
                <p>对不起，您暂无该功能权限，需升级权限享用更多功能。</p>
                <p>
                  请你联系客服
                  <span class="cl-orange fs16 fw-bold">400-678-0778</span>
                </p>
              </div>
            </div>
          </slide-section>

          <slide-section :title="'扩展信息'" class="the-part part-six" v-if="hasExtend">
            <div class="extend-list">
              <ExtendButton v-for="(item, index) in extendList" :key="index" :item="item"></ExtendButton>
            </div>
          </slide-section>
        </div>
      </div>
    </div>
    <la-footer></la-footer>

    <LoadingGif :loadFlag="isExportLoading" v-if="isExportLoading"></LoadingGif>

    <!-- 订阅-首次进入 -->
    <FirstTimeSubscription v-if="show" />
    <!-- 鼠标悬浮到订阅问号 -->
    <SubscriptionModal :hoverType="hoverType" />
  </div>
</template>

<script>
import LoadingGif from "@/components/common/globalCom/loading-gif";
import SlideSection from "@/components/common/slide-section";
import TimeLine from "./components/time-line";
import TimeNode from "./components/time.vue";
import FirstTimeSubscription from "./components/first-time-subscription.vue";
import SubscriptionModal from "./components/subscription-modal.vue";
import LaFooter from "@/components/layouts/footer";
import ExtendButton from "@/components/common/extend-button";
import detailScrollMixins from "@/mixins/detailScroll.js";
import { mapState } from "vuex";

// PART 4 注册生产现场检查进度 的每一步的名称和对应iconfont
let steps = [
  {
    name: "待企业提交申请表",
    icon: "&#xe717;",
  },
  {
    name: "制定检查方案",
    icon: "&#xe632;",
  },
  {
    name: "组织现场检查",
    icon: "&#xe63e;",
  },
  {
    name: "待审核结论",
    icon: "&#xe606;",
  },
  {
    name: "报告已转药审中心",
    icon: "&#xe6dc;",
  },
];

export default {
  components: {
    LoadingGif,
    SlideSection,
    TimeLine,
    LaFooter,
    ExtendButton,
    TimeNode,
    FirstTimeSubscription,
    SubscriptionModal,
  },
  mixins: [detailScrollMixins],
  data() {
    return {
      show: false,
      hoverType: false,
      isLoading: true,
      isExportLoading: false,
      id: this.$route.params.id,
      shoulihao: "",
      xulie: 0,
      steps,
      scroll: "",
      data: {},
      atc: [],
      noticeInfos: [],
      hasPartOne: false,
      hasPartTwo: true,
      hasPartThree: false,
      hasPartFour: false,
      hasPartFive: false,
      hasPartSix: false,
      hasExtend: false,
      currentStep: [],
      jdstep: 0,
      devProcess: {},
      devProcesses: [],
      heightArr: [],
      extendList: [], // 扩展信息
      rssStatus: {}, // 订阅状态
      helpDesc: {
        deliveryInformation:
          "发补通知、通知现场检查、通知电子提交（修改） 、通知审评咨询会等；（2009年初至今的送达事项）",
        defaultLicenseDate: "更新结论的时间",
        jielun: "带“预”为药智预测结论，仅供参考",
        gdcf: "根据中国药学会发布的过度重复药品提示性公告标记分类。过度重复：同一药品已获批准文号企业数在20家以上   ； 获批企业数≤3家 ：指在该药品大类是过度重复品种，但药品当前剂型已有批准文号企业数≤3家。",
        wftjcbzj: "根据《临床价值明确，无法推荐参比制剂的化学药品目录》分类。",
        yxsp: "纳入优先审评审批的情形详细解释可查看帮助中心。",
        lcjxjwxy: "数据来源于CDE官网公示的临床急需境外新药名单。 ",
      },
      wordBreak: "word-break: break-word;",
      zlTableHead: [{
        prop: "no",
        label: "序号",
      }, {
        prop: "dengjizhuanlihao",
        label: "登记的专利号",
      }, {
        prop: "dengjibianhao",
        label: "登记的权力要求项编号",
      }, {
        prop: "zhuanlishengmingleixing",
        label: "专利声明类型",
      }, {
        prop: "remarks",
        label: "备注",
      },]
    };
  },
  computed: {
    ...mapState({
      allBase: (state) => state.Zhuce.allBase,
      helpInfo: (state) => state.Zhuce.helpInfo,
      nopms: (state) => state.Zhuce.nopms,
      showPromtNotice: (state) => state.showPromtNotice,
    }),
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
    },
  },
  methods: {
    linkToShangshigonggao(obj) {
      let development = "";
      if (
        location.href.includes("vip-dev") ||
        location.href.includes("vip-local")
      )
        development = "-dev";
      window.open(
        `https://vip${development}.yaozh.com/shangshigonggao/${obj.id}`,
        "_blank"
      );
    },
    handlerField(field) {
      return field &&
        field !== '无' &&
        field !== '/' &&
        field !== '---'
    },
    handlerHTML(index, prop) {
      return this.data.patent.table[index][prop] ? this.data.patent.table[index][prop] : "";
    },
    // 获取atc的中文
    getAtc(name, arr) {
      let str = "";
      if (arr) {
        for (let index in arr[name]) {
          str += arr[name][index].shuoming + " > ";
        }
        str = _.trimEnd(str, " > "); // 去除最后多余的" > "
      }
      return str;
    },
    getAtcNames(name) {
      return name ? name.replace(/\s+/g, "").split(";") : [];
    },

    //跳转审评报告或说明书页面
    redirectNewPage(pages) {
      window.open(pages, "_blank");
    },
    yflcLink(item, val, txt, txtKey) {
      console.log(item, val, txt, txtKey);
      let url;
      if (val === "shoulihao") {
        url = "/zhuce/";
      }
      if (val === "me_id") {
        url = "/linchuangshiyan/";
      }
      if (val === "pizhunwenhao") {
        if (item.pizhunwenhao_type == 1) {
          return `/cfdadrug/detail/${txtKey}?pizhunwenhao=${encodeURI(txt)}`;
        } else if (item.pizhunwenhao_type == 2) {
          return `/pijian_jinkou_olddata/${txtKey}`;
        } else {
          return true;
        }
      }
      return url + txtKey;
    },
    // 判断有误订阅权限 有可跳转 无不可跳转
    handleRss(rsss, type, shoulihao, name, qiyemingcheng, ga) {
      window.ga(
        "send",
        "event",
        "button",
        "click",
        "vip_zhuce_xiangqingye_" + ga
      );
      window._paq.push([
        "trackEvent",
        "button",
        "click",
        "vip_zhuce_xiangqingye_" + ga,
      ]);

      let dataObj = {
        shoulihao: shoulihao,
        name: name,
        qiyemingcheng: qiyemingcheng,
      };
      if (!this.nopms.rss) {
        if (rsss) {
          //新页面打开
          let routeData = this.$router.resolve({
            path: "/usercenter/take/condition",
          });
          window.open(routeData.href, "_blank");
        } else {
          this.vueSetCookie("rss_type", type);
          this.vueSetCookie("rss_keyword", JSON.stringify(dataObj));
          let routeData = this.$router.resolve({
            path: "/usercenter/take/new",
          });
          window.open(routeData.href, "_blank");
        }
      }
    },
    handleUpClick(e) {
      let scrollTop = $(".all-info").scrollTop();
      if (scrollTop > 0) {
        $(".all-info").animate({ scrollTop: scrollTop - 200 }, 500);
      }
    },
    handleDownClick(e) {
      let scrollTop = $(".all-info").scrollTop();

      $(".all-info").animate({ scrollTop: scrollTop + 200 }, 500);
    },
    handleAllInfoScroll(e) {
      $(e.target).scroll(function () {
        var divHeight = $(this).height();
        var nScrollHeight = $(this)[0].scrollHeight;
        var nScrollTop = $(this)[0].scrollTop;
        if (nScrollTop + divHeight >= nScrollHeight) {
          $(".up-down .down i").css({ color: "#a9adb7" });
        } else if (nScrollTop === 0) {
          $(".up-down .up i").css({ color: "#a9adb7" });
        } else {
          $(".up-down .up i").css({ color: "#626262" });
          $(".up-down .down i").css({ color: "#626262" });
        }
      });
    },
    async handleAxios() {
      // 由于获取devprocess的异步数据时，需要此处的ajax获取到this.shoulihao之后，所以需要await其完成后
      await window
        .Axios({
          method: "get",
          url: "/api/zhuce/" + this.id,
          params: {
            accesstoken: GETCOOKIEFUN("accesstoken"),
            msg_readid: this.$route.query.msg_readid,
          },
        })
        .then((res) => {
          if (res.data.code === 200 && res.data.data) {
            this.show = true;
            let data = res.data.data;
            this.data = data;
            this.atc = data.atc;
            this.xulie = data.xulie;
            this.shoulihao = data.shoulihao;
            this.getExtendList("zhuce", data.extendList);
            this.rssStatus = data.rss;
            // PART 1
            this.hasPartOne = true;

            // PART 3
            if (data.nyxcjc.length !== 0) {
              this.hasPartThree = true;
              let noticeInfo = [
                { name: "检查日期", state: data.nyxcjc[0].jianchariqi },
                { name: "检查员", state: data.nyxcjc[0].jianchayuan },
                { name: "经办人", state: data.nyxcjc[0].jingbanren },
                { name: "受理日期", state: data.nyxcjc[0].shouliriqi },
              ];
              for (let j = 0; j < noticeInfo.length; j++) {
                if (j % 2 === 0) {
                  this.noticeInfos.push([]);
                }
                this.noticeInfos[parseInt(j / 2)].push(noticeInfo[j]);
              }
            } else {
              this.hasPartThree = false;
            }

            // PART 4
            this.currentStep = data.xcjc[data.xcjc.length - 1];
            if (data.xcjc.length) {
              this.hasPartFour = true;
              console.log(this.currentStep.jindu);
              switch (this.currentStep.jindu) {
                case "报告已转药审中心":
                  this.jdstep = 4;
                  break;
                case "待审核结论":
                  this.jdstep = 3;
                  break;
                case "组织现场检查":
                  this.jdstep = 2;
                  break;
                case "制定检查方案":
                  this.jdstep = 1;
                  break;
                case "待企业提交申请表":
                  this.jdstep = 0;
                  break;
              }
            } else {
              this.hasPartFour = false;
            }

            if (Object.keys(data.shangshigonggao).length > 0) {
              this.hasPartSix = true;
            } else {
              this.hasPartSix = false;
            }
          }
        })
        .catch((err) => {
          console.log(err);
          this.show = false;
        });
      // PART 5
      // 获取药品研发历程的数据
      window
        .Axios({
          method: "get",
          url: "/api/zhuce/devprocess",
          params: {
            id: this.id,
            accesstoken: GETCOOKIEFUN("accesstoken"),
          },
        })
        .then((res) => {
          if (res.data.code === 200 && res.data.data) {
            let data = res.data.data;
            this.devProcess = data;
            this.hasPartFive = true;
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .then(this.removeLoading)
        .then(this.resetSomeStyles)
        .then(this.addAnimation);
    },
    resetSomeStyles() {
      // 使up-down的中间线长度自适应
      $(".up-down .md-line").css({ height: $(".progress-info").height() });
      // 使down的颜色根据是否有滚动条适应
      if ($(".up-down .md-line").height() < 500) {
        $(".up-down .down i").css({ color: "#a9adb7" });
      } else {
        $(".up-down .down i").css({ color: "#626262" });
      }
    },
    // 加载完后移除加载界面
    removeLoading() {
      this.isLoading = false;
    },
    // 加载完后，state-sign盖章样式动画效果
    addAnimation() {
      $(".state-sign").css({
        visibility: "visible",
        transform: "scale(1)",
        transition: "all 300ms cubic-bezier(.75,0,1,1)",
      });
    },
    sortKeys(obj) {
      let arr1 = [
        "shoulihao",
        "name",
        "qiyemingcheng",
        "chengbanriqi",
        "zhuceleixing",
        "shenqingleixing_1",
        "banlizhuangtai",
        "zhuangtaikaishishijian",
        "jielun",
        "drugidStatus",
      ];
      let arr2 = [
        "name",
        "shengchanqiye",
        "guige",
        "pizhunwenhao",
        "pizhunwenhao_id",
        "drugidTime",
        "yuanpizhunwenhao",
        "drugidStatus",
      ];
      let arr4 = [
        "shoulihao",
        "name",
        "zhuceleixing",
        "shenqingleixing_1",
        "chengbanriqi",
        "qiyemingcheng",
        "banlizhuangtai",
        "zhuangtaikaishishijian",
        "jielun",
        "me_id",
        "title",
        "company",
        "phase",
        "me_status",
        "start",
        "end",
        "drugidStatus",
      ];
      let current = [];
      let copy = {};
      switch (obj.drugidStatus) {
        case "上市申请":
          current = arr1;
          break;
        case "上市信息":
          current = arr2;
          break;
        default:
          current = arr4;
      }
      current.forEach((item) => {
        if (obj.hasOwnProperty(item) && obj[item]) {
          copy[item] = obj[item];
        }
      });
      return current.length ? copy : obj;
    },
    emitTimeLine(data) {
      this.hasPartTwo = data;
    },

    changeLoading(val) {
      this.isExportLoading = val;
    },
    // 循环前处理相关数据，并返回数组形式
    resetTableObject(obj2, key1) {
      let arr = [];
      let obj = this.sortKeys(obj2);
      // 若研发历程展示过程中，药品名称和企业与顶端展示的NMPA企业名称或CDE企业名称一致时，需隐藏研发历程中的药品名称和企业；不一致时需要展示药品、企业名称信息内容。
      if (
        obj.shengchanqiye ==
        (this.data.qiyemingcheng || this.data.guifanqiyemingcheng)
      ) {
        delete obj.shengchanqiye;
      }

      if (
        obj.company ==
        (this.data.qiyemingcheng || this.data.guifanqiyemingcheng)
      ) {
        delete obj.company;
      }

      if (
        obj.qiyemingcheng ==
        (this.data.qiyemingcheng || this.data.guifanqiyemingcheng)
      ) {
        delete obj.qiyemingcheng;
      }

      if (obj.name == this.data.name) {
        delete obj.name;
      }

      // 状态开始时间zhuangtaikaishishijian、承办日期chengbanriqi、批准日期drugidTime、开始时间 start  当这几个时间和左侧显示的总时间相等的时候则不显示。
      // key1 为左侧时间
      if (obj.zhuangtaikaishishijian == key1) delete obj.zhuangtaikaishishijian;
      if (obj.chengbanriqi == key1) delete obj.chengbanriqi;
      if (obj.drugidTime == key1) delete obj.drugidTime;
      if (obj.start == key1) delete obj.start;

      for (let key in obj) {
        if (obj["drugidStatus"] == "上市信息") {
          //上市信息类  要显示批准日期  不显示状态开始时间
          if (
            key != "id" &&
            key != "drugid" &&
            key != "drugidStatus" &&
            key != "zhuangtaikaishishijian" &&
            key != "pizhunwenhao_type" &&
            key != "pizhunwenhao_id"
          ) {
            // 将不需要在列表中循环的在此列出
            let new_obj = {
              thename: key,
              thevalue: obj[key],
            };

            arr.push(new_obj);
          }
        } else if (obj["drugidStatus"] != "上市信息") {
          //非上市信息类  不显示批准日期  要显示状态开始时间
          if (
            key != "id" &&
            key != "drugid" &&
            key != "drugidStatus" &&
            key != "drugidTime" &&
            key != "pizhunwenhao_type" &&
            key != "pizhunwenhao_id"
          ) {
            // 将不需要在列表中循环的在此列出
            let new_obj = {
              thename: key,
              thevalue: obj[key],
            };

            arr.push(new_obj);
          }
        }
        // if (key != "id" && key != "drugid" && key != "drugidStatus") {
        //   // 将不需要在列表中循环的在此列出
        //   let new_obj = {
        //     thename: key,
        //     thevalue: obj[key]
        //   };

        //   arr.push(new_obj);
        // }
      }
      let len = arr.length;
      let need_num = len % 3 == 0 ? 0 : 3 - (len % 3);
      if (need_num == 1 || need_num == 2) {
        arr[arr.length - 1].col = need_num + 1;
      }
      return arr;
    },
    //获取 研发历程 详情对应表格第一列合并数
    getRowSpan(obj) {
      let len = obj.length;
      return Math.ceil(len / 3);
    },
    handleScroll() {
      // let top = $(".main").offset().top,
      //   leftNav = $(".left-nav");
      // if (top <= 50) {
      //   leftNav.css("top", (this.showPromtNotice ? 118 : 98) + "px");
      // } else {
      //   leftNav.css("top", (this.showPromtNotice ? 118 : 88) + "px");
      // }
    },
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
    Store.dispatch("Zhuce/getBaseInfo");
    window.addEventListener("scroll", this.handleScroll, true);
  },
  activated() {
    this.vueRouteToNoPms(this.nopms.xqy);
  },
  updated() {
    this.vueRouteToNoPms(this.nopms.xqy);
    this.vueTogglePmsTooltip();
  },
};
</script>

<style lang="less" scoped>
@import "~@/assets/less/var.less";
@import "~@/assets/less/detailCom.less";

.wrapper.zhuce-wrapper {
  .time-export {
    display: inline-block;
    padding: 6px 0px;
    width: 120px;
    box-sizing: border-box;
    border-radius: 4px;
    cursor: pointer;
    z-index: 10;
  }

  .flex {
    display: flex;
  }

  .justify-flexend {
    justify-content: flex-end;
  }

  .fullscreen-loading {
    background: #fff !important;
  }

  .pzh {
    color: #4877e8;
  }

  .t-line5 {
    display: block;
    max-height: 110px;
    overflow-y: auto;
  }

  .detail-list {
    .detail-header {

      // margin-left: 190px;
      .yzxpj {
        font-size: 20px;
        color: rgb(247, 125, 84);
        margin-left: 10px !important;
        margin-right: 10px;
        display: flex;
        align-items: center;
      }

      .rss-status {
        position: relative;
        display: inline-block;
        width: 18px;
        height: 20px;
        cursor: pointer;
        margin-left: 6px;

        img {
          display: block;
        }

        .status_img {
          width: 19px;
          height: 21px;
          background-repeat: no-repeat;
          background-size: cover;
          background-image: url("/static/imgs/rss/rss_0.png");

          &:hover {
            background-image: url("/static/imgs/rss/rss_3.png");
          }
        }
      }

      .rss1 {
        top: 0;
        left: 0;
      }

      .rss2 {
        top: 0;
        left: 0;
      }

      .rss3 {
        top: 0;
        left: 0;
      }

      .header-left {
        .left-top {
          width: auto;
        }
      }

      .header-right {
        display: flex;
        align-items: center;

        .question-icon {
          margin-right: 20px;
          cursor: pointer;
        }

        .dingyue-btn {
          width: 100px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          font-size: 16px;
          border-radius: 4px;
          cursor: pointer;
          color: #fff;
          text-indent: 1.2em;
          background: url(~@/assets/imgs/dy.png) no-repeat 18px center #f56c6c;
          font-weight: 400;
        }

        .dingyue-btn-cancel {
          background-position: 10px center;
          background-color: #999;
        }
      }
    }

    // .detail-header.header-fixed {
    //   width: calc(100vw - 200px);
    // }
    // 主要信息部分
    .main {

      // 右边 - 详细列表
      .right-list {
        .part-one {
          position: relative;

          .linksBtn {
            color: #4877e8;
            cursor: pointer;
          }

          .tb-wrap {
            .status-fore {
              background: #4877e8;
              color: #fff;
              font-size: 12px;
              text-align: center;
              display: inline-block;
              border-radius: 25px;
              font-style: normal;
              margin-left: 4px;
              padding: 1px 6px;
              line-height: 22px;
            }

            .zl-box {
              margin-bottom: 10px;

              >span {
                margin-right: 50px;
              }

              span {
                font-size: 13px;
              }

              .text {
                font-weight: bold;
              }
            }

            .zl-table {
              width: 100%;
              text-align: center;
              border: 1px solid #d7ddeb;
              border-color: #d7ddeb;
              table-layout: fixed;
              font-size: 13px;

              th {
                background: #f6f8fc;
                padding: 5px;
                font-weight: normal;
                height: 40px;
                box-sizing: border-box;
              }

              .w230 {
                width: 230px;
              }

              td {
                padding: 5px;
                word-wrap: break-word;
                word-break: normal;
              }

              tr:nth-child(odd) {
                background: #f5f8fb;
              }
            }
          }

          .tb-t {
            position: relative;
          }

          .state-sign {
            position: absolute;
            top: 0;
            right: 0;
            visibility: hidden;
            transform: scale(2);
          }
        }

        // PART 2 部分 - 时光轴部分
        .part-two {

          //min-width: 1280px;
          .detail-nopms {
            width: 100%;
            height: 540px;
            background: url(/static/imgs/zhuce/timeline_before.jpg);
          }
        }

        // PART 3 部分
        .part-three {
          .tb-wrap {
            .tb-t {
              margin-bottom: 30px;

              tr {
                height: 33px;

                td {
                  border: 1px solid @BorderColorNew;

                  &:nth-child(1) {
                    background: @DetailTableLeftColor;
                    width: 183px;
                    padding-left: 28px;
                  }

                  &:nth-child(2) {
                    background: #fff;
                    width: 336px;
                    padding-left: 35px;
                  }

                  &:nth-child(3) {
                    background: @DetailTableLeftColor;
                    width: 183px;
                    padding-left: 28px;
                  }

                  &:nth-child(4) {
                    background: #fff;
                    width: 336px;
                    padding-left: 35px;
                  }
                }
              }
            }
          }
        }

        // PART 4 部分
        .part-four {
          .tb-wrap {

            // PART 4 时间部分
            .time {
              margin-bottom: 40px;

              .time-item {
                display: inline-block;
                margin-right: 40px;
              }

              .time-name {
                color: @PrimaryColor;
              }
            }

            // PART 4 进度部分
            .progress-step {
              display: flex;
              justify-content: flex-start;
              text-align: center;

              .steps {
                display: flex;
                justify-content: flex-start;
                padding-left: 20px;
                margin-bottom: 50px;

                // 进度已完成 - active
                .active {
                  .line-before {
                    background: @PrimaryColor !important;
                  }

                  .icon {
                    border: 3px solid @PrimaryColor !important;
                    color: @PrimaryColor !important;
                    background: #fff !important;
                  }

                  .line-after {
                    background: @PrimaryColor !important;

                    &::before {
                      background: @PrimaryColor !important;
                    }

                    &::after {
                      background: @PrimaryColor !important;
                    }
                  }
                }

                .step {
                  position: relative;
                  padding-right: 170px;

                  .tick {
                    position: absolute;
                    left: 50px;
                    color: @Green;
                    width: 24px;
                    height: 24px;
                    line-height: 24px;
                    border-radius: 24px;
                    border: 2px solid #fff;
                    background: #fff;

                    .tick-icon {
                      font-size: 24px;
                    }
                  }

                  .line-before {
                    width: 60px;
                    height: 2px;
                    background: @LineColor;
                    display: inline-block;
                    position: absolute;
                    top: 35px;
                    left: -60px;
                  }

                  .icon {
                    display: inline-block;
                    width: 66px;
                    height: 66px;
                    line-height: 66px;
                    border-radius: 66px;
                    border: 3px solid @BorderColor;
                    color: @FontColor2;
                    background: @PrimaryBackgroundColor;

                    .icons {
                      font-size: 30px;
                    }
                  }

                  .line-after {
                    width: 110px;
                    height: 2px;
                    background: @LineColor;
                    display: inline-block;
                    position: absolute;
                    top: 35px;
                    left: 72px;

                    &::before {
                      content: "";
                      display: inline-block;
                      position: absolute;
                      width: 3px;
                      height: 15px;
                      background: @LineColor;
                      border-radius: 2px;
                      top: -2px;
                      right: 5px;
                      transform: rotate(45deg);
                    }

                    &::after {
                      content: "";
                      display: inline-block;
                      position: absolute;
                      width: 3px;
                      height: 15px;
                      background: @LineColor;
                      border-radius: 2px;
                      top: -12px;
                      right: 5px;
                      transform: rotate(135deg);
                    }
                  }

                  .name {
                    font-size: 14px;
                    position: absolute;
                    top: 80px;
                  }

                  &:first-child {
                    .name {
                      left: -20px;
                    }
                  }

                  &:last-child {
                    .name {
                      left: -20px;
                    }
                  }
                }
              }
            }
          }
        }

        // PART 5
        .part-five {
          /deep/.content {
            padding-bottom: 30px;
          }

          .detail-nopms {
            width: 100%;
            height: 630px;
            background: url(/static/imgs/zhuce/devprocess_before.jpg);
          }

          .tb-wrap {
            // 下箭头超出，padding-bottom来抵消
            padding-bottom: 40px;

            .med-info {
              margin-bottom: 60px;
              font-size: 13px;

              .info-item {
                display: inline-block;
                margin-right: 40px;
              }

              .info-name {
                color: @PrimaryColor;
              }
            }

            .progress-info {
              position: relative;

              .up-down {
                position: absolute;
                left: 80px;

                .up {
                  cursor: pointer;
                  position: absolute;
                  top: -32px;
                  left: -17px;
                  width: 36px;
                  height: 36px;
                  line-height: 36px;

                  i {
                    font-size: 36px;
                    color: @FontColor3;
                  }
                }

                .down {
                  cursor: pointer;
                  position: absolute;
                  bottom: -32px;
                  left: -17px;
                  width: 36px;
                  height: 36px;
                  line-height: 36px;

                  i {
                    font-size: 36px;
                    color: @FontColor3;
                  }
                }

                .md-line {
                  height: 500px;
                  width: 2px;
                  background: @FontColor3;
                }
              }

              .all-info {
                max-height: 500px;
                overflow: scroll;
                overflow-x: hidden;

                &::-webkit-scrollbar {
                  display: none;
                }

                .info {
                  margin-bottom: 45px;
                  position: relative;
                  display: flex;
                  justify-content: flex-start;
                  padding-left: 150px;

                  &:last-of-type {
                    margin-bottom: 0px;
                  }

                  .info-detail {
                    .info-table {
                      position: relative;

                      .table-item {
                        position: relative;

                        &:first-child {
                          .line {
                            top: 52%;
                          }
                        }

                        &:last-child {
                          .line {
                            bottom: 50%;
                          }
                        }

                        &:first-of-type {
                          position: relative;

                          .time {
                            width: 75px;
                            position: absolute;
                            top: 50%;
                            left: -150px;
                            display: flex;
                            flex-direction: column;
                            justify-content: flex-start;
                            margin-top: -20px;
                            text-align: center;

                            .m-d {
                              height: 20px;
                              line-height: 20px;
                              font-size: 13px;
                              font-weight: bold;
                            }

                            .year {
                              height: 20px;
                              line-height: 20px;
                            }
                          }
                        }

                        .circle {
                          background: #fff;
                          position: absolute;
                          top: 50%;
                          left: -75px;
                          margin-top: -4px;
                          width: 8px;
                          height: 8px;
                          border-radius: 8px;
                          border: 2px solid @FontColor;
                        }

                        .line-one {
                          display: inline-block;
                          width: 44px;
                          border-bottom: 1px dashed @FontColor;
                          position: absolute;
                          top: 50%;
                          margin-top: 1px;
                          left: -60px;

                          &::after {
                            content: "";
                            display: inline-block;
                            width: 4px;
                            height: 4px;
                            background: @FontColor;
                            border-radius: 4px;
                            position: absolute;
                            top: -2px;
                            right: -7px;
                          }
                        }

                        .line {
                          border-left: 1px dashed @FontColor;
                          position: absolute;
                          top: -10px;
                          bottom: 0;
                          left: -36px;
                        }

                        .line-other {
                          display: inline-block;
                          width: 20px;
                          border-bottom: 1px dashed @FontColor;
                          position: absolute;
                          top: 50%;
                          margin-top: 1px;
                          left: -36px;

                          &::before {
                            content: "";
                            display: inline-block;
                            // height: 50px;
                            border-left: 1px dashed @FontColor;
                            position: absolute;
                            bottom: 0px;
                            left: 0;
                          }

                          &::after {
                            content: "";
                            display: inline-block;
                            width: 4px;
                            height: 4px;
                            background: @FontColor;
                            border-radius: 4px;
                            position: absolute;
                            top: -2px;
                            right: -7px;
                          }
                        }

                        table {
                          margin-bottom: 10px;

                          tr {
                            td {
                              background: @DetailTableRightColor;
                              box-sizing: border-box;
                              border: 1px solid @BorderColorNew;
                              width: 304px;
                              height: 30px;
                              padding-left: 10px;
                              font-size: 13px;

                              &.spe-td {
                                width: 88px;
                                text-align: center;
                                padding-left: 0px;
                                position: relative;
                                color: @PrimaryColor;
                                font-size: 14px;
                                font-weight: bold;

                                &::before {
                                  content: "";
                                  position: absolute;
                                  top: 51%;
                                  left: -10px;
                                  margin-top: -8px;
                                  width: 0;
                                  height: 0;
                                  border-right: 9px solid @BorderColorNew;
                                  border-bottom: 9px solid transparent;
                                  border-top: 9px solid transparent;
                                }

                                &::after {
                                  content: "";
                                  position: absolute;
                                  top: 50%;
                                  left: -9px;
                                  margin-top: -8px;
                                  width: 0;
                                  height: 0;
                                  border-bottom: 8px solid transparent;
                                  border-right: 8px solid @DetailTableRightColor;
                                  border-top: 8px solid transparent;
                                }
                              }
                            }
                          }
                        }

                        &:hover {
                          .time {
                            color: @PrimaryColor;
                          }

                          .circle {
                            border-color: @PrimaryColor;
                          }

                          .line-one {
                            border-color: @PrimaryColor;

                            &::after {
                              background: @PrimaryColor;
                            }
                          }

                          .line-other {
                            border-color: @PrimaryColor;

                            &::before {
                              border-color: @PrimaryColor;
                            }

                            &::after {
                              background: @PrimaryColor;
                            }
                          }

                          table {
                            tr {
                              td {
                                background: @DetailTableFloorColor;

                                &::after {
                                  border-right-color: @DetailTableFloorColor;
                                }
                              }
                            }
                          }
                        }
                      }

                      .link {
                        color: @PrimaryColor;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

.left-bottom {
  margin-left: 0 !important;
}

.round {
  border-radius: 50% !important;
  height: 22px !important;
  width: 22px !important;
  padding: 0 !important;
}

.part-two,
.part-three,
.part-four,
.part-five {
  .tb-wrap {
    padding: 10px 10px 10px 60px !important;
  }
}

.header-left {
  width: 100% !important;
}

@media all and (-ms-high-contrast: none),
(-ms-high-contrast: active) {
  .top-id {
    max-width: 40vw !important;
  }
}

.top-id {
  margin-right: 0 !important;
}

.slide-section .tb-t tr td:nth-child(odd),
.slide-section .tb-f tr td:nth-child(odd) {
  min-width: 180px !important;
  width: 230px !important;
  max-width: 30vw !important;
  padding: 0 0 0 50px !important;
  background: #f6f8fc;
}
</style>
