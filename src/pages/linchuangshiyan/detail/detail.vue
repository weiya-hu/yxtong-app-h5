<template>
  <div class="wrapper linchuangshiyan-detail" ref="wrapper">
    <!-- 自定义加载界面 -->
    <LoadingGif :loadFlag="isLoading" v-if="isLoading"></LoadingGif>
    <!-- 加载完成显示部分 -->
    <div class="detail-list" v-else>
      <div class="detail-header header-fixed">
        <div class="header-left">
          <div class="left-top">
            <span class=" top-id" :title="data.stitle">{{ data.stitle }}</span>
            <span class="id-green">{{ data.me_status }}</span>
          </div>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item><a href="/home">首页</a></el-breadcrumb-item>
            <el-breadcrumb-item><a :href="'/' + allBase.dbename">{{ allBase.dbname }}</a></el-breadcrumb-item>
            <el-breadcrumb-item>详情页</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </div>
      <div class="main">
        <div
          class="left-nav"
          :style="{ top: (showPromtNotice ? 128 : 98) + 'px' }"
        >
          <div class="nav-list nav-event" @click="handleNavClick">
            <a class="nav-item active">基本信息</a>
            <a class="nav-item" v-if="timeline.length || nopms.timeline"
              >时光轴</a
            >
            <a class="nav-item">临床试验信息</a>
            <a class="nav-item">申办者信息</a>
            <a class="nav-item" v-if="data.zyyjzxx.length > 0 || data.jgxx"
              >研究者信息</a
            >
            <a class="nav-item" v-if="data.llwyh">伦理委员会信息</a>
            <a class="nav-item" v-if="devprocess || nopms.devprocess"
              >研发历程</a
            >
            <a class="nav-item" v-if="extendList && extendList.length"
              >扩展信息</a
            >
          </div>
        </div>
        <div class="right-list">
          <slide-section :title="'基本信息'" class="the-part">
            <div class="tb-wrap">
              <table class="tb-t">
                <tr>
                  <td>登记号</td>
                  <td>
                    <span>{{ data.me_id }}</span>
                  </td>
                  <td>试验状态</td>
                  <td>
                    <span>{{ data.me_status }}</span>
                  </td>
                </tr>
                <tr v-if="data.statusyy">
                  <td>暂停原因</td>
                  <td colspan="3">
                    <span class="t-line5">{{ data.statusyy }}</span>
                  </td>
                </tr>
                <tr>
                  <td>登记日期</td>
                  <td>
                    <span>{{ data.date }}</span>
                  </td>
                  <td>试验分期</td>
                  <td>
                    <span>{{ data.phase }}</span>
                  </td>
                </tr>
                <tr>
                  <td>注册受理号</td>
                  <td>
                    <span
                      v-if="vueCheckDetailPms('Linchuangshiyan', '注册受理号')"
                    >
                      <span v-for="(item, ix) in data.zhuce" :key="ix">
                        <router-link
                          tag="a"
                          :to="'/zhuce/' + item.id"
                          target="_blank"
                          style="display: inline-block; color: #4877e8;"
                          >{{ item.shoulihao }}</router-link
                        >
                        <span v-if="ix < data.zhuce.length - 1">、</span>
                      </span>
                    </span>
                    <span v-else class="abandon-click-method">暂无权限</span>
                  </td>
                  <td>试验机构</td>
                  <td>
                    <span>{{ data.institutes }}</span>
                  </td>
                </tr>
                <tr>
                  <td>申办者单位</td>
                  <td>
                    <span>{{ data.company }}</span>
                  </td>
                  <td>股票代码</td>
                  <td>
                    <span
                      v-if="vueCheckDetailPms('Linchuangshiyan', '股票代码')"
                      >{{ data.gupiaodaima }}</span
                    >
                    <span v-else class="abandon-click-method">暂无权限</span>
                  </td>
                </tr>
                <tr>
                  <td>药品名称</td>
                  <td>
                    <span>{{ data.name_guifan }}</span>
                    <span
                      v-if="
                        vueCheckDetailPms('Linchuangshiyan', '一致性评价品种')
                      "
                      :class="{ 'id-state': data.yzx === '是' }"
                      >{{ data.yzx === "是" ? "一致性评价品种" : "" }}</span
                    >
                    <span v-else class="abandon-click-method">暂无权限</span>
                  </td>
                  <td>药物类型</td>
                  <td>
                    <span>{{ data.type }}</span>
                  </td>
                </tr>
                <tr>
                  <td>联合用药</td>
                  <td>
                    <span>{{ data.lhyy }}</span>
                  </td>
                  <td>器械相关临床试验</td>
                  <td>
                    <span>{{ data.qixie }}</span>
                  </td>
                </tr>
                <tr>
                  <td>靶点全称</td>
                  <td>
                    <span class="t-line5">
                      <div
                        v-for="(value, key, index) in data.targets"
                        v-if="value != ''"
                        :key="index"
                        style="
                          width: 27vw;
                          min-width: 270px;
                          overflow: hidden;
                          text-overflow: ellipsis;
                          white-space: nowrap;"
                      >
                        <router-link
                          tag="a"
                          :to="'/targetdatas/' + value"
                          target="_blank"
                          :title="key"
                          style="color: #4877e8;"
                          >{{ key }}</router-link
                        >
                      </div>
                      <span
                        v-else
                        style="
                          display: inline-block;
                          width: 27vw;
                          min-width: 270px;
                          overflow: hidden;
                          text-overflow: ellipsis;
                          white-space: nowrap;"
                        >{{ key }}</span
                      >
                    </span>
                  </td>
                  <td>靶点简称</td>
                  <td>
                    <span class="t-line5">
                      <div
                        v-for="(value, key, index) in data.targets_abbr"
                        v-if="value != ''"
                        :key="index"
                        style="
                          width: 27vw;
                          min-width: 270px;
                          overflow: hidden;
                          text-overflow: ellipsis;
                          white-space: nowrap;
                        "
                      >
                        <router-link
                          tag="a"
                          :to="'/targetdatas/' + value"
                          target="_blank"
                          :title="key"
                          style="color: #4877e8;"
                          >{{ key }}</router-link
                        >
                      </div>
                      <span
                        v-else
                        style="
                          display: inline-block;
                          width: 27vw;
                          min-width: 270px;
                          overflow: hidden;
                          text-overflow: ellipsis;
                          white-space: nowrap;
                        "
                        >{{ key }}</span
                      >
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>适应症</td>
                  <td colspan="3">
                    <span>{{ data.indication }}</span>
                  </td>
                </tr>
                <tr>
                  <td>试验通俗题目</td>
                  <td colspan="3">
                    <span>{{ data.title }}</span>
                  </td>
                </tr>
                <tr>
                  <td>试验专业题目</td>
                  <td colspan="3">
                    <span>{{ data.stitle }}</span>
                  </td>
                </tr>
                <tr>
                  <td>试验方案编号</td>
                  <td>
                    <span>{{ data.bianhao }}</span>
                  </td>
                  <td>申报类型</td>
                  <td>
                    <span>{{ data.leixing }}</span>
                  </td>
                </tr>
                <tr>
                  <td>试验开始日期</td>
                  <td>
                    <span>{{ data.start }}</span>
                  </td>
                  <td>试验结束日期</td>
                  <td>
                    <span>{{
                      data.end ? data.end : "登记人暂未填写该信息"
                    }}</span>
                  </td>
                </tr>
                <tr v-if="data.down || data.url">
                  <td>详情链接</td>
                  <td colspan="3">
                    <span>
                      <a
                        v-if="data.laiyuan === 'CDE药物临床试验'"
                        :href="
                          'https://zy.yaozh.com/linchuangshiyan/' + data.down
                        "
                        target="_blank"
                        style="display: inline-block; color: #4877e8;"
                        >查看</a
                      >
                      <a
                        v-else-if="data.laiyuan === '中国临床试验注册中心'"
                        :href="data.url"
                        target="_blank"
                        style="display: inline-block; color: #4877e8;"
                        >查看</a
                      >
                    </span>
                  </td>
                </tr>
              </table>
            </div>
          </slide-section>

          <slide-section
            :title="'时光轴'"
            class="the-part part-two"
            v-if="timeline.length || nopms.timeline"
          >
            <div class="tb-wrap" v-if="!nopms.timeline">
              <el-tooltip class="time-tip" effect="light" placement="right">
                <div slot="content">
                  <div class="time-tip-content">
                    <p>
                      <strong>试验总持续用时：</strong
                      ><span
                        >伦理委员会批准到全部临床数据收集工作完成所用的时间</span
                      >
                    </p>
                    <p>
                      <strong>受试者研究用时：</strong
                      ><span
                        >首例受试者入组到最后一例受试者完成给药和全部检查所用的时间</span
                      >
                    </p>
                    <p>
                      <strong>其它：</strong
                      ><span>鼠标移入相邻节点间隔，可查看用时天数</span>
                    </p>
                  </div>
                </div>
                <span><i class="el-icon-question cl-green sz16"></i></span>
              </el-tooltip>
              <ul class="time-line">
                <li
                  v-for="(item, ix) in timeline"
                  :key="ix"
                  :class="
                    item.totalFlag === 1 ||
                    item.totalFlag === 2 ||
                    item.totalFlag === 3
                      ? 'time-line-active'
                      : ''
                  "
                >
                  <!-- <template v-if="item.date.trim() != '登记人暂未填写该信息'"> -->
                  <div
                    class="time-b"
                    v-if="ix"
                    @mouseover="hoverActionTime(ix, 1)"
                    @mouseleave="hoverActionTime(ix, 0)"
                  >
                    <div
                      :class="[
                        'time-b-info',
                        'time-b-info1',
                        item.totalFlag === 3 && item.number === 2
                          ? 'time-b-info2'
                          : ''
                      ]"
                    >
                      <span>用时：{{ item.use_time }}天</span>
                    </div>
                  </div>
                  <div :class="['time-t', `time-t${item.totalFlag}`]">
                    <div class="time-tl">
                      <div
                        v-if="item.total_time"
                        :class="['time-tl-day', colorF1 ? 'time-tl-day1' : '']"
                        @mouseover="hoverAction(1, 1, ix)"
                        @mouseleave="hoverAction(1, 0, ix)"
                      >
                        试验总持续用时：<strong>{{ item.total_time }}</strong
                        >天
                      </div>
                      <div
                        v-if="item.research_time"
                        :class="['time-tl-day', colorF2 ? 'time-tl-day1' : '']"
                        @mouseover="hoverAction(0, 1, ix)"
                        @mouseleave="hoverAction(0, 0, ix)"
                      >
                        受试者研究用时：<strong>{{ item.research_time }}</strong
                        >天
                      </div>
                      <!-- 因历史遗留问题，时间有两种格式 2019-11-11和'已完成' 返回为已完成就影藏时间显示 -->
                      <div
                        :class="[
                          'time-tl-date',
                          !item.numberFlag && item.number === 1
                            ? 'time-tl-date1'
                            : ''
                        ]"
                        :style="{ opacity: item.date == '已完成' ? 0 : 1 }"
                      >
                        {{ item.date }}
                      </div>
                    </div>
                    <div
                      :class="[
                        'quan',
                        !item.numberFlag && item.number === 1 ? 'quan1' : ''
                      ]"
                    ></div>
                    <div class="time-tr">
                      <div
                        :class="[
                          'time-tr-name',
                          !item.numberFlag && item.number === 1
                            ? 'time-tr-name1'
                            : ''
                        ]"
                      >
                        {{ item.key_name }}
                      </div>
                      <div
                        v-if="item.number === 1 && (item.scjl || item.mc)"
                        class="time-tr-seat"
                      ></div>
                      <div v-if="item.number === 1" class="time-tr-info">
                        <template v-if="item.mc"
                          >{{
                            item.mc
                          }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</template
                        >
                        <template v-if="item.scjl"
                          >审查结论：<span>{{ item.scjl }}</span></template
                        >
                      </div>
                    </div>
                  </div>
                  <!-- </template> -->
                </li>
              </ul>
            </div>
            <!-- 无权限提示 -->
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

          <slide-section :title="'临床试验信息'" class="the-part">
            <template v-if="data.purpose">
              <div class="detail-title"><span class="in">试验目的</span></div>
              <div class="tb-wrap">
                <p>{{ data.purpose }}</p>
              </div>
            </template>
            <template v-if="data.sygs">
              <div class="detail-title"><span class="in">试验概述</span></div>
              <div class="tb-wrap">
                <p>{{ data.sygs }}</p>
              </div>
            </template>
            <template v-if="data.dmc">
              <div class="detail-title" style="margin-bottom: 20px;">
                <span class="in"
                  >数据安全监察委员会（DMC）：{{ data.dmc }}</span
                >
              </div>
            </template>
            <div class="detail-title"><span class="in">试验设计</span></div>
            <div class="tb-wrap">
              <table class="tb-t">
                <tr>
                  <td>试验分类</td>
                  <td>
                    <span>{{ data.sort }}</span>
                  </td>
                  <td>试验分期</td>
                  <td>
                    <span>{{ data.phase }}</span>
                  </td>
                </tr>
                <tr>
                  <td>设计类型</td>
                  <td>
                    <span>{{ data.sjlx }}</span>
                  </td>
                  <td>随机化</td>
                  <td>
                    <span>{{ data.sjh }}</span>
                  </td>
                </tr>
                <tr>
                  <td>盲法</td>
                  <td>
                    <span>{{ data.blinding }}</span>
                  </td>
                  <td>试验范围</td>
                  <td>
                    <span>{{ data.fanwei }}</span>
                  </td>
                </tr>
              </table>
            </div>
            <template v-if="data.syy || data.dzy">
              <div class="detail-title"><span class="in">试验分组</span></div>
              <div class="tb-wrap">
                <template v-if="data.syy">
                  <h4 class="h4">试验药</h4>
                  <table class="tb-f1">
                    <tr>
                      <th>序号</th>
                      <th style="min-width: 100px;">名称</th>
                      <th>用法</th>
                    </tr>
                    <tr v-for="(item, ix) in data.syy" :key="ix">
                      <td class="xuhao">{{ ix + 1 }}</td>
                      <td class="mc">{{ item.mc }}</td>
                      <td class="yf">{{ item.yf }}</td>
                    </tr>
                  </table>
                </template>
                <template v-if="data.dzy">
                  <h4 class="h4">对照药</h4>
                  <table class="tb-f1">
                    <tr>
                      <th>序号</th>
                      <th style="min-width: 100px;">名称</th>
                      <th>用法</th>
                    </tr>
                    <tr v-for="(item, ix) in data.dzy" :key="ix">
                      <td class="xuhao">{{ ix + 1 }}</td>
                      <td class="mc">{{ item.mc }}</td>
                      <td class="yf">{{ item.yf }}</td>
                    </tr>
                  </table>
                </template>
              </div>
            </template>

            <template v-if="data.gycs">
              <div class="detail-title"><span class="in">干预措施</span></div>
              <div class="tb-wrap">
                <table class="tb-f1">
                  <tr>
                    <th>组别</th>
                    <th>样本量</th>
                    <th>干预措施</th>
                  </tr>
                  <tr v-for="(item, ix) in data.gycs" :key="ix">
                    <td>{{ item.jb }}</td>
                    <td>{{ item.ybl }}</td>
                    <td>{{ item.gycs }}</td>
                  </tr>
                </table>
              </div>
            </template>

            <template v-if="data.zyzb || data.cyzb">
              <div class="detail-title"><span class="in">终点指标</span></div>
              <div class="tb-wrap">
                <template v-if="data.zyzb">
                  <h4 class="h4">主要终点指标及评价时间</h4>
                  <table class="tb-f1">
                    <tr>
                      <th style="width: 80px;">序号</th>
                      <th>指标</th>
                      <th style="min-width: 150px;">评价时间</th>
                      <th style="min-width: 150px;">终点指标选择</th>
                    </tr>
                    <tr v-for="(item, ix) in data.zyzb" :key="ix">
                      <td>{{ ix + 1 }}</td>
                      <td>{{ item.zb }}</td>
                      <td>{{ item.pjsj }}</td>
                      <td>{{ item.zbxz }}</td>
                    </tr>
                  </table>
                </template>
                <template v-if="data.cyzb">
                  <h4 class="h4">次要终点指标及评价时间</h4>
                  <table class="tb-f1">
                    <tr>
                      <th style="width: 80px;">序号</th>
                      <th>指标</th>
                      <th style="min-width: 150px;">评价时间</th>
                      <th style="min-width: 150px;">终点指标选择</th>
                    </tr>
                    <tr v-for="(item, ix) in data.cyzb" :key="ix">
                      <td>{{ ix + 1 }}</td>
                      <td>{{ item.zb }}</td>
                      <td>{{ item.pjsj }}</td>
                      <td>{{ item.zbxz }}</td>
                    </tr>
                  </table>
                </template>
              </div>
            </template>

            <div class="detail-title">
              <span class="in">受试者信息</span>
              <span
                v-if="data.sszbx"
                style="position: relative;top: 4px;left: 6px;"
                >(为受试者购买试验伤害保险：{{ data.sszbx }})</span
              >
            </div>
            <div class="tb-wrap">
              <table class="tb-t">
                <tr>
                  <td>年龄</td>
                  <td colspan="3">
                    <span>{{ data.age }}</span>
                  </td>
                </tr>
                <tr>
                  <td>性别</td>
                  <td>
                    <span>{{ data.gender }}</span>
                  </td>
                  <td>健康受试者</td>
                  <td>
                    <span>{{ data.jkssz }}</span>
                  </td>
                </tr>
                <tr>
                  <td>目标入组人数</td>
                  <td>
                    <span>{{ data.size }}</span>
                  </td>
                  <td>实际入组人数</td>
                  <td>
                    <span>{{ data.sjrs }}</span>
                  </td>
                </tr>
              </table>
            </div>
            <div class="detail-title"><span class="in">入选标准</span></div>
            <div class="tb-wrap">
              <p v-for="(item, ix) in data.rxbz" :key="ix">
                {{ data.rxbz.length != 1 ? `${ix + 1}、` : "" }}{{ item }}
              </p>
            </div>
            <div class="detail-title"><span class="in">排除标准</span></div>
            <div class="tb-wrap">
              <p v-for="(item, ix) in data.pcbz" :key="ix">
                {{ data.pcbz.length != 1 ? `${ix + 1}、` : "" }}{{ item }}
              </p>
            </div>
          </slide-section>

          <slide-section :title="'申办者信息'" class="the-part">
            <div class="tb-wrap">
              <table class="tb-t">
                <tr>
                  <td>申办者单位</td>
                  <td colspan="3">
                    <span>{{ data.company }}</span>
                  </td>
                </tr>
                <tr>
                  <td>经费来源</td>
                  <td>
                    <span>{{ data.source }}</span>
                  </td>
                  <td>申办联系人</td>
                  <td>
                    <span>{{ data.contact }}</span>
                  </td>
                </tr>
                <tr>
                  <td>申办联系人电话</td>
                  <td>
                    <span>{{ data.sbdh }}</span>
                  </td>
                  <td>申办联系人Email</td>
                  <td>
                    <span>{{ data.sbemail }}</span>
                  </td>
                </tr>
                <tr>
                  <td>申办联系人邮政地址</td>
                  <td>
                    <span>{{ data.sbyzdz }}</span>
                  </td>
                  <td>申办联系人邮编</td>
                  <td>
                    <span>{{ data.sbyb }}</span>
                  </td>
                </tr>
              </table>
            </div>
          </slide-section>

          <slide-section
            :title="'研究者信息'"
            class="the-part"
            v-if="data.zyyjzxx.length > 0 || data.jgxx"
          >
            <div class="detail-title" v-if="data.zyyjzxx.length > 0">
              <span class="in">主要研究者信息</span>
            </div>
            <div class="tb-wrap" v-if="data.zyyjzxx.length > 0">
              <table
                class="tb-t"
                style="margin-bottom: 20px"
                v-for="(item, index) in data.zyyjzxx"
                :key="index"
              >
                <tr>
                  <td>主要研究者姓名</td>
                  <td>
                    <span>{{ item["主要研究者姓名"] }}</span>
                  </td>
                  <td>主要研究者职称</td>
                  <td>
                    <span>{{ item["主要研究者职称"] }}</span>
                  </td>
                </tr>
                <tr>
                  <td>主要研究者电话</td>
                  <td>
                    <span>{{ item["主要研究者电话"] }}</span>
                  </td>
                  <td>主要研究者Email</td>
                  <td>
                    <span>{{ item["主要研究者Email"] }}</span>
                  </td>
                </tr>
                <tr>
                  <td>主要研究者邮政地址</td>
                  <td>
                    <span>{{ item["主要研究者邮政地址"] }}</span>
                  </td>
                  <td>主要研究者邮编</td>
                  <td>
                    <span>{{ item["主要研究者邮编"] }}</span>
                  </td>
                </tr>
                <tr>
                  <td>主要研究者单位名称</td>
                  <td colspan="3">
                    <span>{{ item["主要研究者单位名称"] }}</span>
                  </td>
                </tr>
              </table>
            </div>
            <template v-if="data.jgxx">
              <div class="detail-title">
                <span class="in">各参加机构信息</span>
              </div>
              <div class="tb-wrap">
                <template>
                  <el-table :data="data.jgxx" class="tb-f2">
                    <el-table-column type="index" label="序号" width="80">
                    </el-table-column>
                    <el-table-column prop="jgmc" label="机构名称">
                    </el-table-column>
                    <el-table-column prop="zyyjz" label="主要研究者">
                    </el-table-column>
                    <el-table-column prop="gj" label="国家"> </el-table-column>
                    <el-table-column prop="ss" label="省（州）">
                    </el-table-column>
                    <el-table-column prop="cs" label="城市" width="150">
                    </el-table-column>
                  </el-table>
                </template>
              </div>
            </template>
          </slide-section>

          <slide-section
            :title="'伦理委员会信息'"
            class="the-part"
            v-if="data.llwyh"
          >
            <div class="tb-wrap">
              <table class="tb-f1">
                <tr>
                  <th>序号</th>
                  <th>名称</th>
                  <th>审查结论</th>
                  <th>审查日期</th>
                </tr>
                <tr v-for="(item, ix) in data.llwyh" :key="ix">
                  <td>{{ ix + 1 }}</td>
                  <td>{{ item.mc }}</td>
                  <td>{{ item.scjl }}</td>
                  <td>{{ item.scrq }}</td>
                </tr>
              </table>
            </div>
          </slide-section>

          <slide-section
            :title="'研发历程'"
            class="the-part part-seven"
            v-if="devprocess || nopms.devprocess"
          >
            <div class="tb-wrap" v-if="!nopms.devprocess">
              <!-- <div class="med-info">
                <div class="info-item">
                  <span class="info-name">药品名称：</span>
                  {{}}
                </div>
                <div class="info-item">
                  <span class="info-name">公司：</span>
                  {{}}
                </div>
              </div> -->
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
                  <div
                    class="info"
                    v-for="(val1, key1, index1) in devprocess"
                    :key="index1"
                  >
                    <div class="info-detail">
                      <div class="info-table">
                        <div
                          class="table-item"
                          v-for="(item, index2) in val1"
                          :key="index2"
                        >
                          <div class="time" v-if="index2 === 0 && key1">
                            <span class="year"
                              >{{
                                key1
                                  .toString()
                                  .split("；")[0]
                                  .split("-")[0]
                              }}年</span
                            >
                            <span class="m-d"
                              >{{
                                key1
                                  .toString()
                                  .split("；")[0]
                                  .split("-")[1]
                              }}月{{
                                key1
                                  .toString()
                                  .split("；")[0]
                                  .split("-")[2]
                              }}日</span
                            >
                          </div>
                          <!-- 没有具体年月日时，则如下显示 -->
                          <div class="time" v-else-if="index2 === 0 && !key1">
                            <span class="m-d">日期不详</span>
                            <span class="year">年份不详</span>
                          </div>
                          <div class="circle" v-if="index2 === 0"></div>
                          <div
                            :class="{
                              'line-one': index2 === 0,
                              'line-other': index2 !== 0
                            }"
                          ></div>
                          <div class="line"></div>
                          <table>
                            <tr>
                              <td
                                v-bind:rowspan="
                                  getRowSpan(resetTableObject(item,key1))
                                "
                                class="spe-td"
                              >
                                {{ item.drugidStatus }}
                              </td>
                              <td
                                v-for="(val2, index2) in resetTableObject(item,key1)"
                                :key="index2"
                                v-if="index2 >= 0 && index2 < 3"
                                :colspan="val2.col"
                              >
                                <span>
                                  {{
                                    $t("lDetail.devProgress." + val2.thename)
                                  }}

                                  <span
                                    v-if="
                                      (val2.thename === 'shoulihao' ||
                                        val2.thename === 'me_id' ||
                                        (val2.thename == 'pizhunwenhao' &&
                                          item.pizhunwenhao_type != 0)) &&
                                        item.id
                                    "
                                  >
                                    <span
                                      v-for="(txt,
                                      txtKey,
                                      txti) in val2.thevalue"
                                      :key="txti"
                                    >
                                      <router-link
                                        class="link"
                                        :to="
                                          yflcLink(
                                            item,
                                            val2.thename,
                                            txt,
                                            txtKey
                                          )
                                        "
                                        target="_blank"
                                        >{{ txt }}
                                      </router-link>
                                      <span
                                        style="color:#545B6D;"
                                        v-if="
                                          txti <
                                            Object.keys(val2.thevalue).length -
                                              1
                                        "
                                      >
                                        /
                                      </span>
                                    </span>
                                  </span>
                                  <span v-else>
                                    {{ val2.thevalue }}
                                    <span v-if="item.pijian && item.pijian.pizhunwenhao && val2.thename == 'jielun'">
                                      (批准文号：
                                      <!-- item.pijian.tp = 1 国产 否则进口 -->
                                      <a class="pzh" v-if="item.pijian.xuhao" :href="item.pijian.tp==1 ? `/cfdadrug/detail/${item.pijian.xuhao}?pizhunwenhao=${item.pijian.pizhunwenhao}`: `/cfdadrug/jkdetail/${item.pijian.xuhao}?pizhunwenhao=${item.pijian.pizhunwenhao}`" target="_blank">{{ item.pijian.pizhunwenhao }}</a>
                                      <span v-else>{{ item.pijian.pizhunwenhao }}</span>)
                                    </span>
                                  </span>
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td
                                v-for="(val2, index2) in resetTableObject(item,key1)"
                                :key="index2"
                                v-if="index2 >= 3 && index2 < 6"
                                :colspan="val2.col"
                              >
                                <span>
                                  {{
                                    $t("lDetail.devProgress." + val2.thename)
                                  }}
                                  <span
                                    v-if="
                                      (val2.thename === 'shoulihao' ||
                                        val2.thename === 'me_id' ||
                                        (val2.thename == 'pizhunwenhao' &&
                                          item.pizhunwenhao_type != 0)) &&
                                        item.id
                                    "
                                  >
                                    <span
                                      v-for="(txt,
                                      txtKey,
                                      txti) in val2.thevalue"
                                      :key="txti"
                                    >
                                      <router-link
                                        class="link"
                                        :to="
                                          yflcLink(
                                            item,
                                            val2.thename,
                                            txt,
                                            txtKey
                                          )
                                        "
                                        target="_blank"
                                        >{{ txt }}
                                      </router-link>
                                      <span
                                        style="color:#545B6D;"
                                        v-if="
                                          txti <
                                            Object.keys(val2.thevalue).length -
                                              1
                                        "
                                      >
                                        /
                                      </span>
                                    </span>
                                  </span>
                                  <span v-else>
                                    {{ val2.thevalue }}
                                    <span v-if="item.pijian && item.pijian.pizhunwenhao && val2.thename == 'jielun'">
                                      (批准文号：
                                      <!-- item.pijian.tp = 1 国产 否则进口 -->
                                      <a class="pzh" v-if="item.pijian.xuhao" :href="item.pijian.tp==1 ? `/cfdadrug/detail/${item.pijian.xuhao}?pizhunwenhao=${item.pijian.pizhunwenhao}`: `/cfdadrug/jkdetail/${item.pijian.xuhao}?pizhunwenhao=${item.pijian.pizhunwenhao}`" target="_blank">{{ item.pijian.pizhunwenhao }}</a>
                                      <span v-else>{{ item.pijian.pizhunwenhao }}</span>)
                                    </span>
                                  </span>
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td
                                v-for="(val2, index2) in resetTableObject(item, key1)"
                                :key="index2"
                                v-if="index2 >= 6 && index2 < 9"
                                :colspan="val2.col"
                              >
                                <span>
                                  {{
                                    $t("lDetail.devProgress." + val2.thename)
                                  }}
                                  <span
                                    v-if="
                                      (val2.thename === 'shoulihao' ||
                                        val2.thename === 'me_id' ||
                                        (val2.thename == 'pizhunwenhao' &&
                                          item.pizhunwenhao_type != 0)) &&
                                        item.id
                                    "
                                  >
                                    <span
                                      v-for="(txt,
                                      txtKey,
                                      txti) in val2.thevalue"
                                      :key="txti"
                                    >
                                      <router-link
                                        class="link"
                                        :to="
                                          yflcLink(
                                            item,
                                            val2.thename,
                                            txt,
                                            txtKey
                                          )
                                        "
                                        target="_blank"
                                        >{{ txt }}
                                      </router-link>
                                      <span
                                        style="color:#545B6D;"
                                        v-if="
                                          txti <
                                            Object.keys(val2.thevalue).length -
                                              1
                                        "
                                      >
                                        /
                                      </span>
                                    </span>
                                  </span>
                                  <span v-else>
                                    {{ val2.thevalue }}
                                    <span v-if="item.pijian && item.pijian.pizhunwenhao && val2.thename == 'jielun'">
                                      (批准文号：
                                      <!-- item.pijian.tp = 1 国产 否则进口 -->
                                      <a class="pzh" v-if="item.pijian.xuhao" :href="item.pijian.tp==1 ? `/cfdadrug/detail/${item.pijian.xuhao}?pizhunwenhao=${item.pijian.pizhunwenhao}`: `/cfdadrug/jkdetail/${item.pijian.xuhao}?pizhunwenhao=${item.pijian.pizhunwenhao}`" target="_blank">{{ item.pijian.pizhunwenhao }}</a>
                                      <span v-else>{{ item.pijian.pizhunwenhao }}</span>)
                                    </span>
                                  </span>
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td
                                v-for="(val2, index2) in resetTableObject(item,key1)"
                                :key="index2"
                                v-if="index2 >= 9 && index2 < 12"
                                :colspan="val2.col"
                              >
                                <span>
                                  {{
                                    $t("lDetail.devProgress." + val2.thename)
                                  }}
                                  <span
                                    v-if="
                                      (val2.thename === 'shoulihao' ||
                                        val2.thename === 'me_id' ||
                                        (val2.thename == 'pizhunwenhao' &&
                                          item.pizhunwenhao_type != 0)) &&
                                        item.id
                                    "
                                  >
                                    <span
                                      v-for="(txt,
                                      txtKey,
                                      txti) in val2.thevalue"
                                      :key="txti"
                                    >
                                      <router-link
                                        class="link"
                                        :to="
                                          yflcLink(
                                            item,
                                            val2.thename,
                                            txt,
                                            txtKey
                                          )
                                        "
                                        target="_blank"
                                        >{{ txt }}
                                      </router-link>
                                      <span
                                        style="color:#545B6D;"
                                        v-if="
                                          txti <
                                            Object.keys(val2.thevalue).length -
                                              1
                                        "
                                      >
                                        /
                                      </span>
                                    </span>
                                  </span>
                                  <span v-else>
                                    {{ val2.thevalue }}
                                    <span v-if="item.pijian && item.pijian.pizhunwenhao && val2.thename == 'jielun'">
                                      (批准文号：
                                      <!-- item.pijian.tp = 1 国产 否则进口 -->
                                      <a class="pzh" v-if="item.pijian.xuhao" :href="item.pijian.tp==1 ? `/cfdadrug/detail/${item.pijian.xuhao}?pizhunwenhao=${item.pijian.pizhunwenhao}`: `/cfdadrug/jkdetail/${item.pijian.xuhao}?pizhunwenhao=${item.pijian.pizhunwenhao}`" target="_blank">{{ item.pijian.pizhunwenhao }}</a>
                                      <span v-else>{{ item.pijian.pizhunwenhao }}</span>)
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
            <!-- 无权限提示 -->
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
    </div>
    <la-footer></la-footer>
  </div>
</template>

<script>
import LoadingGif from "@/components/common/globalCom/loading-gif";
import SlideSection from "@/components/common/slide-section";
import LaFooter from "@/components/layouts/footer";
import ExtendButton from "@/components/common/extend-button";
import { mapState } from "vuex";
import detailScrollMixins from "@/mixins/detailScroll.js";

export default {
  components: {
    LoadingGif,
    SlideSection,
    LaFooter,
    ExtendButton
  },
  mixins: [detailScrollMixins],
  data() {
    return {
      lineOtherH: 0,
      colorF1: false,
      colorF2: false,

      isLoading: true,
      id: this.$route.params.id,
      data: {},
      timeline: [],
      devprocess: null,
      extendList: [], // 扩展信息
      helpDesc: {
        deliveryInformation:
          "发补通知、通知现场检查、通知电子提交（修改） 、通知审评咨询会等；（2009年初至今的送达事项）",
        defaultLicenseDate: "更新结论的时间"
      }
    };
  },
  computed: {
    ...mapState({
      allBase: state => state.Linchuangshiyan.allBase,
      helpInfo: state => state.Linchuangshiyan.helpInfo,
      nopms: state => state.Linchuangshiyan.nopms
    })
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
    handleScroll() {
      // let top = $(".main").offset().top,
      //   leftNav = $(".left-nav");
      // if (top <= 50) {
      //   leftNav.css("top", (this.showPromtNotice ? 118 : 98) + "px");
      // } else {
      //   leftNav.css("top", (this.showPromtNotice ? 118 : 88) + "px");
      // }
    },
    hoverAction(flag, bool, ix) {
      let num = true;
      let num1 = true;
      this.timeline.forEach((e, i) => {
        if (i >= ix) {
          if (flag) {
            this.colorF1 = bool;
            e.totalFlag = num ? bool : 0;
            if (num1) {
              e.totalFlag = bool ? 3 : 0;
              num1 = false;
            }
            if (e.number === 7) {
              e.totalFlag = bool ? 2 : 0;
              num = false;
            }
          } else {
            this.colorF2 = bool;
            e.totalFlag = num ? bool : 0;
            if (num1) {
              e.totalFlag = bool ? 3 : 0;
              num1 = false;
            }
            if (e.number === 3) {
              e.totalFlag = bool ? 2 : 0;
              num = false;
            }
          }
        }
      });
    },
    hoverActionTime(ix, bool) {
      this.timeline[ix - 1].totalFlag = bool ? 5 : 0;
      this.timeline[ix].useTimeFlag = bool;
      this.timeline[ix].totalFlag = bool ? 4 : 0;
    },
    yflcLink(item, val, txt, txtKey) {
      let url;
      if (val === "shoulihao") {
        url = "/zhuce/";
      }
      if (val === "me_id") {
        url = "/linchuangshiyan/";
      }
      if (val === "pizhunwenhao") {
        if (item.pizhunwenhao_type == 1) {
          return `/cfdadrug/detail/${
            txtKey
          }?pizhunwenhao=${encodeURI(txt)}`;
        } else if (item.pizhunwenhao_type == 2) {
          return `/pijian_jinkou_olddata/${txtKey}`;
        } else {
          return true;
        }
      }
      return url + txtKey;
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
      $(e.target).scroll(function() {
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
      // 基本信息
      await window
        .Axios({
          method: "get",
          url: "/api/linchuangshiyan/" + this.id,
          params: {
            accesstoken: GETCOOKIEFUN("accesstoken"),
            msg_readid: this.$route.query.msg_readid
          }
        })
        .then(res => {
          if (res.data.code === 200 && res.data.data) {
            let data = res.data.data;
            this.data = data;
            if (this.data.zyyjzxx != "") {
              this.data.zyyjzxx = JSON.parse(this.data.zyyjzxx);
            }
            // let arr = []
            // this.data.zyyjzxx.map((item,index)=> {
            //   for (let key in item) {
            //     let obj = {}
            //     obj.name = key
            //     obj.value = item[key]
            //     arr.push(obj)
            //   }
            // })
            // console.log(arr)
            this.getExtendList("linchuangshiyan", data.extendList);
          }
        })
        .catch(err => {
          console.log(err);
        });
      // 时光轴
      window
        .Axios({
          method: "get",
          url: "/api/linchuangshiyan/timeline",
          params: {
            id: this.id,
            accesstoken: GETCOOKIEFUN("accesstoken")
          }
        })
        .then(res => {
          if (res.data.code === 200 && res.data.data) {
            let data = res.data.data;
            if (data && !_.isEmpty(data)) {
              let total = true;
              data.forEach((e, i) => {
                // 用时标识
                e.useTimeFlag = 0;
                e.totalFlag = 0;

                // 伦理审查标识
                if (e.number === 1 && total) {
                  e.numberFlag = 1;
                  total = false;
                }
              });
              this.timeline = data;
            } else {
              this.timeline = [];
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
      // 获取药品研发历程的数据
      window
        .Axios({
          method: "get",
          url: "/api/linchuangshiyan/devprocess",
          params: {
            id: this.id,
            accesstoken: GETCOOKIEFUN("accesstoken")
          }
        })
        .then(res => {
          if (res.data.code === 200 && res.data.data) {
            let data = res.data.data;
            this.devprocess = data && !_.isEmpty(data) ? data : null;
          }
        })
        .catch(err => {
          console.log(err);
        })
        .then(this.removeLoading)
        .then(this.resetSomeStyles);
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
    // 循环前处理相关数据，并返回数组形式
    resetTableObject(obj) {
      let arr = [];
      for (let key in obj) {
        if (obj["drugidStatus"] == "上市信息") {
          //上市信息类  要显示批准日期  不显示状态开始时间
          if (
            key != "id" &&
            key != "drugid" &&
            key != "drugidStatus" &&
            key != "zhuangtaikaishishijian" &&
            key != "pizhunwenhao_type" &&
            key != "pizhunwenhao_id" &&
            key != 'pijian'
          ) {
            // 将不需要在列表中循环的在此列出
            let new_obj = {
              thename: key,
              thevalue: obj[key]
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
            key != "pizhunwenhao_id" &&
            key != 'pijian'
          ) {
            // 将不需要在列表中循环的在此列出
            let new_obj = {
              thename: key,
              thevalue: obj[key]
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
      if (need_num == 1) {
        let new_obj = {
          thename: "none",
          thevalue: ""
        };
        arr.push(new_obj);
      } else if (need_num == 2) {
        let new_obj = {
          thename: "none",
          thevalue: ""
        };
        arr.push(new_obj);
        arr.push(new_obj);
      }
      return arr;
    },
    //获取 研发历程 详情对应表格第一列合并数
    getRowSpan(obj) {
      let len = obj.length;
      return Math.ceil(len / 3);
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
    Store.dispatch("Linchuangshiyan/getBaseInfo");
    window.addEventListener("scroll", this.handleScroll, true);
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
.pzh {
  color: #4877e8;
}
.wrapper {
  .t-line5 {
    display: block;
    max-height: 110px;
    overflow-y: auto;
  }
  .detail-list {
    .main {
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

                th {
                  padding: 0;
                  border-left: 1px solid @BorderColorNew;
                  border-bottom: 1px solid @BorderColorNew;
                  font-size: @FontsizeSmall;
                  background: @DetailTableLeftColor;
                  font-weight: @FontsizeSmallBold;
                }
                td {
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
                justify-content: center;
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
        // PART 2 部分 - 时光轴部分
        .part-two {
          .time-tip {
            position: absolute;
            top: 14px;
            left: 84px;
            .sz16 {
              font-size: 16px;
            }
          }
          .time-line {
            > li {
              position: relative;
              line-height: 1;
              font-size: 13px;
              .time-t {
                position: relative;
                display: flex;
              }
              .time-t4:before,
              .time-t2:before,
              .time-t1:before {
                content: "";
                position: absolute;
                top: 0;
                left: 333px;
                height: 50%;
                width: 2px;
                transform: translate(0, 0);
                background: #90c31f;
                z-index: 2;
              }
              .time-t5:after,
              .time-t3:after,
              .time-t1:after {
                content: "";
                position: absolute;
                bottom: 0;
                left: 333px;
                height: 51%;
                width: 2px;
                transform: translate(0, 0);
                background: #90c31f;
                z-index: 2;
              }
              .time-tl {
                width: 300px;
                display: flex;
                justify-content: flex-end;
                align-items: center;
                .time-tl-day {
                  cursor: pointer;
                  position: relative;
                  margin-right: 40px;
                  color: #868ea3;
                  font-weight: 700;
                  strong {
                    font-size: 16px;
                  }
                }
                .time-tl-day::before {
                  content: "";
                  height: 10px;
                  width: 10px;
                  border-right: 1px solid #dfe5f1;
                  border-top: 1px solid #dfe5f1;
                  position: absolute;
                  right: -10px;
                  top: 2px;
                  transform: rotate(45deg);
                }
                .time-tl-day::after {
                  content: "";
                  height: 0;
                  width: 20px;
                  border-top: 1px dashed #dfe5f1;
                  position: absolute;
                  right: -32px;
                  top: 7px;
                }

                .time-tl-date {
                  font-size: 15px;
                  color: #4877e8;
                }
                .time-tl-date1 {
                  font-size: 13px;
                  color: #868ea3;
                }
              }
              .time-tr {
                display: flex;
                align-items: center;
                justify-content: space-between;
                color: #4877e8;

                .time-tr-name {
                  font-size: 15px;
                  font-weight: 700;
                }
                .time-tr-name1 {
                  font-size: 13px;
                  color: #868ea3;
                }
                .time-tr-seat {
                  min-width: 160px;
                  max-width: 320px;
                  border-top: 1px dashed #dfe5f1;
                }
                .time-tr-info {
                  width: 450px;
                  line-height: 1.5;
                  > span {
                    display: inline-block;
                    background: #90c31f;
                    border-radius: 12px;
                    padding: 2px 8px;
                    line-height: 1;
                    font-size: 12px;
                    color: #fff;
                  }
                }
              }

              .quan {
                margin: 0 20px;
                position: relative;
                width: 28px;
                min-height: 28px;
              }
              .quan:before {
                content: "";
                position: absolute;
                top: 50%;
                left: 0;
                height: 28px;
                width: 28px;
                transform: translate(0, -50%);
                background: #c8d6f8;
                border-radius: 50%;
                z-index: 8;
              }
              .quan:after {
                content: "";
                position: absolute;
                top: 50%;
                left: 4px;
                width: 20px;
                height: 20px;
                transform: translate(0, -50%);
                background: #4878e7;
                border-radius: 50%;
                z-index: 9;
              }
              .quan1 {
                min-height: auto;
              }
              .quan1:before {
                content: "";
                position: absolute;
                top: 0;
                left: 13px;
                height: 0;
                width: 2px;
                transform: translate(0, 0);
                background: #4878e7;
                border-radius: 0;
                z-index: 2;
              }
              .quan1:after {
                top: 50%;
                left: 9px;
                width: 10px;
                height: 10px;
              }
              .time-b {
                position: relative;
                cursor: pointer;

                .time-b-info {
                  width: 335px;
                  box-sizing: border-box;
                  height: 30px;
                  line-height: 30px;
                  text-align: right;
                  border-right: 2px solid #4877e8;
                  position: relative;
                  padding-right: 30px;
                  color: #90c31f;
                  font-size: 12px;
                }
                .time-b-info1 {
                  border-right: 2px solid #90c31f;
                }

                .time-b-info1::before {
                  content: "";
                  height: 10px;
                  width: 10px;
                  border-right: 1px solid #90c31f;
                  border-top: 1px solid #90c31f;
                  position: absolute;
                  right: 20px;
                  top: 9px;
                  transform: rotate(45deg);
                }
                .time-b-info1::after {
                  content: "";
                  height: 0;
                  width: 20px;
                  border-top: 1px dashed #90c31f;
                  position: absolute;
                  right: 0;
                  top: 14px;
                }
              }
            }
            > li::before {
              content: "";
              position: absolute;
              top: 0;
              left: 333px;
              height: 100%;
              width: 2px;
              background: #4878e7;
              z-index: 0;
            }
            > li:first-child:before {
              height: 50%;
              top: 50%;
            }
            > li:last-child:before {
              height: 51%;
            }
            > li.time-line-active {
              .time-tl {
                .time-tl-day1 {
                  color: #90c31f;
                }
                .time-tl-day1:before {
                  border-right: 1px solid #90c31f;
                  border-top: 1px solid #90c31f;
                }
                .time-tl-day1:after {
                  border-top: 1px dashed #90c31f;
                }
                .time-tl-date {
                  color: #90c31f;
                }
              }
              .time-tr {
                .time-tr-name {
                  color: #90c31f;
                }
              }
              .quan:before {
                background: #dfedb8;
              }
              .quan:after {
                background: #90c31f;
              }
              .quan1:before {
                background: #90c31f;
              }
              .quan1:after {
                background: #90c31f;
              }
              .time-b {
                .time-b-info {
                  border-right: 2px solid #90c31f;
                }
                .time-b-info2 {
                  border-right: 2px solid #4878e7;
                }
              }
            }
          }

          .detail-nopms {
            width: 100%;
            height: 538px;
            background: url(/static/imgs/zhuce/timeline_zglcsy.png) no-repeat;
          }
        }

        // PART 7
        .part-seven {
          // /deep/.content {
          //   padding-top: 40px;
          // }
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
              font-size: @FontsizeSmall;
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
              padding-top: 30px;
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
                            top: 51%;
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
                          width: 50px;
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
                            right: -2px;
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
                              font-size: @FontsizeSmall;
                              &.spe-td {
                                width: 88px;
                                text-align: center;
                                padding-left: 0px;
                                position: relative;
                                color: @PrimaryColor;
                                font-size: 14px;
                                font-weight: bold;
                                &::before {
                                  // content: '';
                                  // position: absolute;
                                  // left: -10px;
                                  // top: 50%;
                                  // margin-top: -8px;
                                  // border-top: 8px solid transparent;
                                  // border-right: 10px solid @DetailTableRightColor;
                                  // border-bottom: 8px solid transparent;
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
</style>


<style lang="less">
.wrapper.linchuangshiyan-detail {
  .detail-header .header-left .left-top {
    width: unset !important;
  }

  .el-breadcrumb {
    display: inline-flex;
    white-space: nowrap;
  }
}
</style>