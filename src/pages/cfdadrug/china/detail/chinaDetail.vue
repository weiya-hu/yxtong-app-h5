<template>
  <div class="wrapper cfdadrug-china-detail" ref="wrapper">
    <!-- 自定义加载界面 -->
    <LoadingGif :loadFlag="isLoading" v-if="isLoading"></LoadingGif>
    <!-- 加载完成显示部分 -->
    <div class="detail-list china-detail" v-else>
      <div class="detail-header header-fixed">
        <div class="header-left">
          <div class="left-top">
            <span class="top-id" :title="data.pizhunwenhao">{{
                data.pizhunwenhao
            }}</span>
            <div class="left-bottom">
              <span class="bottom-name">{{ data.name }}</span>
              <span class="company-name">{{ data.shengchanqiye }}</span>
            </div>
            <span class="id-green bg-blue">{{ data.titel.country }}</span>
            <span class="id-green bg-green" v-if="data.titel.yblb">{{
                data.titel.yblb
            }}</span>
            <span class="id-green bg-orange" v-if="data.titel.jiyao">{{
                data.titel.jiyao
            }}</span>
            <span class="id-green bg-orange" v-if="jbxx.yuanyan == 1">原研</span>
          </div>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item><a href="/home">首页</a></el-breadcrumb-item>
            <el-breadcrumb-item><a :href="'/' + allBase.dbename">{{ allBase.dbname }}</a></el-breadcrumb-item>
            <el-breadcrumb-item>国产详情页</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </div>
      <div class="main">
        <div class="left-nav" :style="{ top: (showPromtNotice ? 128 : 98) + 'px' }">
          <div class="nav-list nav-event" @click="handleNavClick">
            <a class="nav-item active" v-if="hasPartOne">官网信息</a>
            <a class="nav-item" v-if="hasPartTwo">药智信息</a>
            <a class="nav-item" v-if="hasPartThree">国家医保信息</a>
            <a class="nav-item" v-if="hasPartFive || nopms.devprocess">研发历程</a>
            <a class="nav-item" v-if="hasPatent">专利信息</a>
            <a class="nav-item" v-if="hasExtend">扩展信息</a>
          </div>
        </div>
        <div class="right-list">
          <slide-section :title="'官网信息'" class="the-part" v-if="hasPartOne">
            <div class="tb-wrap">
              <table class="tb-t">
                <tr v-if="jbxx.name">
                  <td>药品名称（中文）</td>
                  <td colspan="3">
                    <div class="td-line5">
                      {{ jbxx.name }}
                    </div>
                  </td>
                </tr>
                <tr v-if="jbxx.englishname">
                  <td>药品名称（英文）</td>
                  <td colspan="3">
                    <div class="td-line5">
                      {{ jbxx.englishname }}
                    </div>
                  </td>
                </tr>
                <tr v-if="jbxx.brandname">
                  <td>商品名（中文）</td>
                  <td colspan="3">
                    <div class="td-line5">
                      {{ jbxx.brandname }}
                    </div>
                  </td>
                </tr>
                <tr v-if="jbxx.type">
                  <td>药品类型</td>
                  <td colspan="3">
                    <div class="td-line5">
                      {{ jbxx.type }}
                    </div>
                  </td>
                </tr>
                <tr v-if="jbxx.pizhunwenhao">
                  <td>批准文号</td>
                  <td colspan="3">
                    <div class="td-line5">
                      {{ jbxx.pizhunwenhao }}
                    </div>
                  </td>
                </tr>
                <tr v-if="jbxx.guifanjixing">
                  <td>剂型</td>
                  <td colspan="3">
                    <div class="td-line5">
                      {{ jbxx.guifanjixing }}
                    </div>
                  </td>
                </tr>
                <tr v-if="jbxx.guige">
                  <td>规格</td>
                  <td colspan="3">
                    <div class="td-line5">
                      {{ jbxx.guige }}
                    </div>
                  </td>
                </tr>
                <tr v-if="jbxx.mah">
                  <td>上市许可持有人</td>
                  <td colspan="3">
                    <div class="td-line5">{{ jbxx.mah }}</div>
                  </td>
                </tr>
                <tr v-if="jbxx.mahaddresszhongwen">
                  <td>上市许可持有人地址</td>
                  <td colspan="3">
                    <div class="td-line5">
                      {{ jbxx.mahaddresszhongwen }}
                    </div>
                  </td>
                </tr>
                <tr v-if="jbxx.shengchanqiye">
                  <td>生产企业</td>
                  <td colspan="3">
                    <div class="td-line5">
                      {{ jbxx.shengchanqiye }}
                    </div>
                  </td>
                </tr>
                <tr v-if="jbxx.authorizationday">
                  <td>批准日期</td>
                  <td colspan="3">
                    <div class="td-line5">
                      {{ jbxx.authorizationday }}
                    </div>
                  </td>
                </tr>
                <tr v-if="jbxx.address">
                  <td>生产地址</td>
                  <td colspan="3">
                    <div class="td-line5">
                      {{ jbxx.address }}
                    </div>
                  </td>
                </tr>
                <tr v-if="jbxx.yuanpizhunwenhao">
                  <td>
                    原批准文号
                    <el-tooltip effect="zhuce" placement="right">
                      <div slot="content">再注册前的批准文号。</div>
                      <i class="el-icon-question cl-green" style="margin-left: 4px"></i>
                    </el-tooltip>
                  </td>
                  <td colspan="3">
                    <div class="td-line5">
                      {{ jbxx.yuanpizhunwenhao }}
                    </div>
                  </td>
                </tr>
                <tr v-if="jbxx.benweima">
                  <td>药品本位码</td>
                  <td colspan="3">
                    <div class="td-line5">
                      {{ jbxx.benweima }}
                    </div>
                  </td>
                </tr>
                <tr v-if="jbxx.remarks">
                  <td>药品本位码备注</td>
                  <td colspan="3">
                    <div class="td-line5">
                      {{ jbxx.remarks }}
                    </div>
                  </td>
                </tr>
              </table>
            </div>
          </slide-section>

          <slide-section :title="'药智信息'" class="the-part" v-if="hasPartTwo">
            <div class="tb-wrap">
              <table class="tb-t">
                <tr v-if="jbxx.yspzwh">
                  <td>
                    原始批准文号
                    <el-tooltip effect="zhuce" placement="right">
                      <div slot="content">首次批准的批准文号。</div>
                      <i class="el-icon-question cl-green" style="margin-left: 4px"></i>
                    </el-tooltip>
                  </td>
                  <td colspan="3">
                    <div class="td-line5">
                      {{ jbxx.yspzwh }}
                    </div>
                  </td>
                </tr>
                <tr v-if="jbxx.yspzsj">
                  <td>原始批准时间</td>
                  <td colspan="3">
                    <div class="td-line5">
                      {{ jbxx.yspzsj }}
                    </div>
                  </td>
                </tr>
                <tr v-if="jbxx.targets_abbr && jbxx.targets_abbr.length > 0">
                  <td>靶点简称</td>
                  <td colspan="3">
                    <div class="td-line5">
                      {{ jbxx.targets_abbr }}
                    </div>
                  </td>
                </tr>
                <tr v-if="jbxx.targets">
                  <td>靶点全称</td>
                  <td colspan="3">
                    <div class="td-line5">
                      {{ jbxx.targets }}
                    </div>
                  </td>
                </tr>
                <tr v-if="data.atc || data.atcarr.length > 0">
                  <td>ATC分类</td>
                  <td colspan="3">
                    <div class="td-line5">
                      <div v-for="(item, index) in getAtcNames(data.atc)" :key="item" class="clearfix">
                        <span>{{ item }}&nbsp;&nbsp;</span><span>{{ getAtc(item, data.atcarr) }}</span>
                        <br v-if="index % 2 != 0" />
                      </div>
                    </div>
                  </td>
                </tr>
                <tr v-if="jbxx.shiyingzheng">
                  <td>适应症</td>
                  <td colspan="3">
                    <div class="td-line5" v-html="jbxx.shiyingzheng"></div>
                  </td>
                </tr>
                <tr v-if="jbxx.dailiangcaigou1">
                  <td>
                    <div class="td-line5">
                      带量采购品种
                      <el-tooltip effect="zhuce" placement="right">
                        <div slot="content">
                          带量采购是国家药品组织的药品集中采购制度的重大改革，首先由4+7城市试点，目前已在全国范围开展。
                        </div>
                        <i class="el-icon-question cl-green" style="margin-left: 4px"></i>
                      </el-tooltip>
                    </div>
                  </td>
                  <td colspan="3">
                    <div class="td-line5">
                      <router-link target="_blank" class="under_a" :to="{
                        path: '/dailiangcaigou',
                        query: {
                          fourth_condition: `bianma=${jbxx.bianma} _and
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                qiyebianmatz=${jbxx.qiyebianmatz} _and guifanguige=${jbxx.guifanguige}`,
                        },
                      }" v-if="jbxx.dailiangcaigou1 === '已中选'">{{
    jbxx.dailiangcaigou1 ? jbxx.dailiangcaigou1 : "/"
}}</router-link>
                      <div v-else>
                        {{ jbxx.dailiangcaigou1 ? jbxx.dailiangcaigou1 : "/" }}
                      </div>
                    </div>
                  </td>
                </tr>
                <tr v-if="data.gdcf">
                  <td>
                    过度重复品种
                    <el-tooltip effect="zhuce" placement="right">
                      <div slot="content">
                        根据中国药学会发布的过度重复药品提示性公告标记分类。过度重复：同一药品已获批准文号企业数在20家以上；获批企业数≤3家：指在该药品大类是过度重复品种，但药品当前剂型已有批准文号企业数≤3家。
                      </div>
                      <i class="el-icon-question cl-green" style="margin-left: 4px"></i>
                    </el-tooltip>
                  </td>
                  <td colspan="3">
                    <div class="td-line5">
                      {{ data.gdcf }}
                    </div>
                  </td>
                </tr>
                <tr v-if="data.wftjcbzj && data.wftjcbzj == 1">
                  <td>
                    无需开展一致性评价品种
                    <el-tooltip effect="zhuce" placement="right">
                      <div slot="content">
                        根据《临床价值明确，无法推荐参比制剂的化学药品目录》分类。
                      </div>
                      <i class="el-icon-question cl-green" style="margin-left: 4px"></i>
                    </el-tooltip>
                  </td>
                  <td colspan="3">{{ data.wftjcbzj == 1 ? "是" : "否" }}</td>
                </tr>
                <tr v-if="zcylyShow()">
                  <td>
                    <div class="td-line5">
                      自产原料药厂家
                      <el-tooltip effect="zhuce" placement="right">
                        <div slot="content">
                          既生产原料药又生产该原料药的制剂产品的厂家。
                        </div>
                        <i class="el-icon-question cl-green" style="margin-left: 4px"></i>
                      </el-tooltip>
                    </div>
                  </td>
                  <td colspan="3">
                    <div class="td-line5">
                      {{ jbxx.zcyly }}
                    </div>
                  </td>
                </tr>
                <!-- <tr v-if="jbxx.changjiashugp!==null">
                  <td>
                    <div class="td-line5">
                      通过一致性评价厂家数
                      <el-tooltip effect="zhuce" placement="right">
                        <div slot="content">
                          包含视同通过。
                        </div>
                        <i
                          class="el-icon-question cl-green"
                          style="margin-left:4px;"
                        ></i>
                      </el-tooltip>
                    </div>
                  </td>
                  <td colspan="3">
                    <div class="td-line5">
                      {{ jbxx.changjiashugp }}
                    </div>
                  </td>
                </tr> -->
                <tr v-if="jbxx.changjiashuat">
                  <td>
                    <div class="td-line5">
                      同成分厂家数
                      <el-tooltip effect="zhuce" placement="right">
                        <div slot="content">活性成分相同的厂家数。</div>
                        <i class="el-icon-question cl-green" style="margin-left: 4px"></i>
                      </el-tooltip>
                    </div>
                  </td>
                  <td colspan="3">
                    <div class="td-line5">
                      {{ jbxx.changjiashuat }}
                    </div>
                  </td>
                </tr>

                <tr v-if="jbxx.baojianpin">
                  <td>
                    <div class="td-line5">保健药品</div>
                  </td>
                  <td colspan="3">
                    <div class="td-line5">
                      {{ jbxx.baojianpin }}
                    </div>
                  </td>
                </tr>
                <tr v-if="jbxx.otc">
                  <td>处方/非处方</td>
                  <td colspan="3">
                    <div class="td-line5">
                      {{ jbxx.otc }}
                    </div>
                  </td>
                </tr>
                <!-- <tr v-if="data.zhuanli">
                  <td>专利信息</td>
                  <td colspan="3">
                    <div class="td-line5">
                      <a v-for="(item, index) in data.zhuanli.split(';')" :key="index"
                        :href="`https://patent.yaozh.com/list?words=KWS=${item}&sourceType=cn`" target="_blank"
                        class="cl-blue">
                        {{ item }} &nbsp;
                      </a>
                    </div>
                  </td>
                </tr> -->
              </table>
            </div>
          </slide-section>

          <slide-section :title="'国家医保信息'" class="the-part" v-if="hasPartThree">
            <div class="tb-wrap">
              <table class="tb-t">
                <tr v-if="isEmpty(drugInfos.yibaoxuhao) && drugInfos.yibaoxuhao !== '/'">
                  <td>编号</td>
                  <td colspan="3">
                    <div class="td-line5">
                      {{ drugInfos.yibaoxuhao ? drugInfos.yibaoxuhao : "/" }}
                    </div>
                  </td>
                </tr>
                <tr v-if="isEmpty(drugInfos.name1) && drugInfos.name1 !== '/'">
                  <td>药品名称</td>
                  <td colspan="3">
                    <div class="td-line5">
                      {{ drugInfos.name1 ? drugInfos.name1 : "/" }}
                    </div>
                  </td>
                </tr>
                <tr v-if="isEmpty(drugInfos.yibao) ">
                  <td>分类</td>
                  <td colspan="3" v-if="drugInfos.yibao == '/'">非医保信息</td>
                  <td colspan="3" v-else>
                    <div class="td-line5">
                      {{ drugInfos.yibao ? drugInfos.yibao : "/" }}
                    </div>
                  </td>
                </tr>
                
                <tr v-if="isEmpty(drugInfos.syz)  && drugInfos.syz !== '/'">
                  <td>支付适应症</td>
                  <td colspan="3">
                    <div class="td-line5">
                      {{ drugInfos.syz ? drugInfos.syz : "/" }}
                    </div>
                  </td>
                </tr>
              </table>
            </div>
          </slide-section>

          <slide-section :title="'研发历程'" class="the-part part-five" v-if="hasPartFive || nopms.devprocess">
            <div class="tb-wrap" v-if="!nopms.devprocess">
              <div class="med-info">
                <div class="info-item">
                  <span class="info-name">药品名称：</span>{{ data.name ? data.name : "/" }}
                </div>
                <div class="info-item">
                  <span class="info-name">公司：</span>
                  {{ data.shengchanqiye ? data.shengchanqiye : "/" }}
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
            <!-- 研发历程 - 无权限提示 -->
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

          <slide-section :title="'专利信息'" class="the-part part-patent" v-if="hasPatent">
            <div class="tb-wrap">
              <h3 v-if="zhuanli.zlgs.length > 0">专利信息公示</h3>
              <div v-for="(item, index) in zhuanli.zlgs" v-if="zhuanli.zlgs.length > 0" :key="'zlgs_' + index">
                <div v-if="zhuanli.zlgs.length > 1" class="detail-title"><span class="in">专利信息{{ (index + 1) }}</span>
                </div>
                <table class="tb-t">
                  <tr v-if="item.zlh">
                    <td class="th">相关专利号</td>
                    <td colspan="5">
                      <a :href="`https://patent${urlHandler()}.yaozh.com/list?words=KWS=` + item.zlh" class="pzh"
                        target="_blank">{{
                            item.zlh
                        }}</a>
                    </td>
                  </tr>
                  <tr v-if="item.zlmc">
                    <td class="th">专利名称</td>
                    <td colspan="5">{{ item.zlmc }}</td>
                  </tr>
                  <tr v-if="item.zlqr">
                    <td class="th">专利权人</td>
                    <td colspan="5">{{ item.zlqr }}</td>
                  </tr>
                  <tr v-if="item.zlbxkr">
                    <td class="th">专利被许可人</td>
                    <td colspan="5">{{ item.zlbxkr }}</td>
                  </tr>
                  <tr v-if="item.zlsxr">
                    <td class="th">专利授权日期</td>
                    <td colspan="5">{{ item.zlsxr }}</td>
                  </tr>
                  <tr v-if="item.zlFjList.length > 0">
                    <td class="th">授权证明文件</td>
                    <td colspan="5">
                      <div class="file-box">
                        <a target="_blank" v-for="(subItem, subIndex) in item.zlFjList" :key="'zlFjList' + subIndex"
                          :href="'https://zy.yaozh.com/zgss/pdf/' + subItem">文件{{ (subIndex + 1) }}：{{ subItem }}</a>
                      </div>
                    </td>
                  </tr>
                  <tr v-if="item.ssxkcyr">
                    <td class="th">上市许可持有人与专利权人的关系</td>
                    <td colspan="5">{{ item.ssxkcyr }}</td>
                  </tr>
                  <tr v-if="item.detatil.length > 0">
                    <td colspan="6">药品与相关专利权利要求的对应关系</td>
                  </tr>
                  <tr v-if="item.detatil.length > 0">
                    <td class="th tc">序号</td>
                    <td class="th tc">权利要求项编号</td>
                    <td class="th tc">专利类型</td>
                    <td class="th tc">专利保护期届满日期</td>
                    <td class="th tc">状态</td>
                    <td class="th tc">备注</td>
                  </tr>
                  <tr v-if="item.detatil.length > 0" v-for="(subItem, subIndex) in item.detatil" :key="subIndex">
                    <td class="tc">{{ (subIndex + 1) }}</td>
                    <td class="tc">{{ subItem.qlyqxbh }}</td>
                    <td class="tc">{{ subItem.patentType }}</td>
                    <td class="tc">{{ subItem.jmrq }}</td>
                    <td class="tc">{{ subItem.patentStatus }}</td>
                    <td class="tc">{{ subItem.bz }}</td>
                  </tr>
                </table>
              </div>

              <h3 v-if="zhuanli.zlsm.generic.length > 0 || zhuanli.zlsm.other.length > 0">专利声明</h3>
              <div v-if="zhuanli.zlsm.generic.length > 0 || zhuanli.zlsm.other.length > 0" class="detail-title"><span
                  class="in">被仿制药等相关信息</span></div>

              <table v-if="zhuanli.zlsm.generic.length > 0" class="tb-t">
                <tr>
                  <td style="text-align: center;padding: 0 !important;" class="th">序号</td>
                  <td style="text-align: center;padding: 0 !important;" class="th">登记的专利号</td>
                  <td style="text-align: center;padding: 0 !important;" class="th">登记的权力要求项编号</td>
                  <td style="text-align: center;padding: 0 !important;" class="th">专利声明类型

                    <el-tooltip class="item" effect="light" placement="right">
                      <div slot="content" v-html="zlsmDesc"></div>
                      <i class="el-icon-question cl-green"></i>
                    </el-tooltip>
                  </td>
                  <td style="text-align: center;padding: 0 !important;" class="th">备注</td>
                </tr>
                <tr v-if="zhuanli.zlsm.generic.length > 0" v-for="(subItem, subIndex) in zhuanli.zlsm.generic"
                  :key="'generic' + subIndex">
                  <td class="tc w80">{{ (subIndex + 1) }}</td>
                  <td class="tc">
                    <a v-if="isEmpty(subItem.djdzlh) && subItem.djdzlh != '无' && subItem.djdzlh != '/'"
                      :href="`https://patent${urlHandler()}.yaozh.com/list?words=KWS=` + subItem.djdzlh" class="pzh"
                      target="_blank">
                      {{ subItem.djdzlh }}
                    </a>
                    <span v-else>{{ subItem.djdzlh }}</span>
                  </td>
                  <td class="tc">{{ subItem.qlyqxbh }}</td>
                  <td class="tc">{{ subItem.zlsmlx }}</td>
                  <td class="tc">{{ subItem.bz }}</td>
                </tr>
              </table>

              <div v-if="zhuanli.zlsm.other.length > 0" class="detail-title"><span
                  class="in">化学仿制药/中药同名同方药/生物类似药信息</span></div>
              <table v-if="zhuanli.zlsm.other.length > 0" class="tb-t">
                <tr>
                  <td style="text-align: center;padding: 0 !important;" class="th">药品名称</td>
                  <td style="text-align: center;padding: 0 !important;" class="th">规格</td>
                  <td style="text-align: center;padding: 0 !important;" class="th">受理号</td>
                  <td style="text-align: center;padding: 0 !important;" class="th">注册分类</td>
                  <td style="text-align: center;padding: 0 !important;" class="th">申请人名称</td>
                  <td style="text-align: center;padding: 0 !important;" class="th">申请人地址</td>
                  <td style="text-align: center;padding: 0 !important;" class="th">联系人</td>
                </tr>
                <tr v-if="zhuanli.zlsm.other.length > 0" v-for="(subItem, subIndex) in zhuanli.zlsm.other"
                  :key="'other' + subIndex">
                  <td class="tc">{{ subItem.ypmc }}</td>
                  <td class="tc">{{ subItem.gg }}</td>
                  <td class="tc" @click="linkToZhuce(subItem)"><span class="pzh">{{ subItem.slh }}</span></td>
                  <td class="tc">{{ subItem.zclx }}</td>
                  <td class="tc">{{ subItem.qymc }}</td>
                  <td class="tc">{{ subItem.txdz }}</td>
                  <td class="tc">{{ subItem.lxr }}</td>
                </tr>
              </table>


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
  </div>
</template>

<script>
import LoadingGif from "@/components/common/globalCom/loading-gif";
import SlideSection from "@/components/common/slide-section";
import LaFooter from "@/components/layouts/footer";
import { mapState } from "vuex";
import ExtendButton from "@/components/common/extend-button";
import detailScrollMixins from "@/mixins/detailScroll.js";
export default {
  components: {
    SlideSection,
    // TimeLine,
    LaFooter,
    ExtendButton,
    LoadingGif
  },
  mixins: [detailScrollMixins],
  data() {
    return {
      zlsmDesc: '1类：中国上市药品专利信息登记平台中没有被仿制药品相关专利信息（专利信息登记平台登记号、登记的专利号均填写“无”）；2类：中国上市药品专利信息登记平台收录的被仿制药品相关专利权已终止或者被宣告无效，或者仿制药申请人已获得专利权人相关专利实施许可（在备注中注明相应的具体情形）；3类：中国上市药品专利信息登记平台收录有被仿制药品相关专利，仿制药申请人承诺在相应专利权有效期届满之前所申请的仿制药暂不上市；4.1类：中国上市药品专利信息登记平台收录的被仿制药品相关专利权应当被宣告无效，4.2类：仿制药未落入中国上市药品专利信息登记平台收录的被仿制药品相关专利权保护范围。申请人承诺对相关声明的真实性、准确性负责。仿制药/中药同名同方药/生物类似药申请被受理后10个工作日内，申请人将声明及声明依据通知上市许可持有人；除邮寄纸质材料外，申请人还将通过上市许可持有人在专利信息登记平台登记的邮箱地址进行声明及声明依据的送达。对相关文书和材料将完整保存。',
      isLoading: true,
      id: "",
      // steps,
      data: {},
      zhuanli: {},
      atc: [],
      jbxx: {}, //存放基本信息
      drugInfos: {}, //存放医疗信息
      shoulihao: "",
      // devProcess: {},//时光轴
      devProcesses: [],
      heightArr: [],
      scroll: "",
      hasPartOne: false,
      hasPartTwo: true,
      hasPartThree: true,
      hasPartFive: false,
      hasPatent: true,  //专利
      hasExtend: false,
      extendList: []
    };
  },
  computed: {
    ...mapState({
      nopms: state => state.CfdaDrug.nopms,
      allBase: state => state.CfdaDrug.allBase,
      helpInfo: state => state.CfdaDrug.helpInfo
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
    urlHandler() {
      let host = '';
      if (
        location.href.includes("vip-dev") ||
        location.href.includes("vip-local")
      ) {
        host = '-dev'
      }
      else {
        host = ''
      }
      return host;
    },
    linkToZhuce(obj) {
      const { href } = this.$router.resolve({
        path: '/zhuce',
        query: {
          name1: obj.slh
        }
      })
      window.open(href, "_blank")
    },
    zcylyShow() {
      let status = false, jbxx = this.jbxx;
      if (!(jbxx.zcyly === '是' && jbxx.guifanjixing === '原料药')) {
        if (jbxx.zcyly) {
          status = true;
        } else {
          status = false;
        }
      }
      return status
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
          return `/cfdadrug/detail/${txtKey}?pizhunwenhao=${encodeURI(txt)}`;
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
    //先获取devprocess的异步数据，再获取研发历程的数据
    async handleAxios() {
      await window
        .Axios({
          method: "get",
          url: "/api/cfdadrug/detail",
          params: {
            id: this.$route.params.id,
            accesstoken: GETCOOKIEFUN("accesstoken")
          }
        })
        .then(res => {
          if (res.data.code === 200 && res.data.data) {
            console.log(res.data.data.GroupList.zhuanli)
            // generic[]  other[]
            //放基本信息的data
            let jbxx = res.data.data.GroupList.jbxx;
            for (let [key, val] of Object.entries(jbxx)) {
              jbxx[key] = jbxx[key] === "/" ? "" : jbxx[key];
              jbxx[key] = jbxx[key] === "否" ? "" : jbxx[key];
              jbxx[key] = jbxx[key] === "非集采品种" ? "" : jbxx[key];
            }
            this.jbxx = jbxx;
            // 获取国家医保信息
            let data = res.data.data.GroupList;
            this.drugInfos = data.ybxx;
            //放表头信息的title
            let title = data.title;
            for (let [key, val] of Object.entries(title)) {
              title[key] = title[key] === "/" ? "" : title[key];
              title[key] = title[key] === "否" ? "" : title[key];
              title[key] = title[key] === "非集采品种" ? "" : title[key];
            }
            this.data = title;
            this.atc = data.atc;
            this.getExtendList("cfdadrug", res.data.data.extendList);
            // PART 1
            this.hasPartOne = true;

            // PART 2
            this.hasPartTwo = true;

            // PART 2
            this.hasPartThree = data.title.yblb;

            this.zhuanli = res.data.data.GroupList.zhuanli;
            this.hasPatent = this.zhuanli.zlgs.length > 0 || this.zhuanli.zlsm.generic.length > 0 || this.zhuanli.zlsm.other.length > 0;
          }
        })
        .catch(err => {
          console.log(err);
        });
      // PART 5
      // 获取研发历程的数据
      window
        .Axios({
          method: "get",
          url: "/api/cfdadrug/devprocess",
          params: {
            id: this.$route.params.id,
            accesstoken: GETCOOKIEFUN("accesstoken")
          }
        })
        .then(res => {
          if (res.data.code === 200 && res.data.data) {
            this.hasPartFive = true;
            let data = res.data.data;
            this.devProcess = data;
          }
        })
        .catch(err => {
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
    // emitTimeLine (data) {
    //   this.hasPartTwo = data
    // }
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
        "drugidStatus"
      ];
      let arr2 = [
        "name",
        "shengchanqiye",
        "guige",
        "pizhunwenhao",
        "pizhunwenhao_id",
        "drugidTime",
        "yuanpizhunwenhao",
        "drugidStatus"
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
        "drugidStatus"
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
      current.forEach(item => {
        if (obj.hasOwnProperty(item) && obj[item]) {
          copy[item] = obj[item];
        }
      });
      return current.length ? copy : obj;
    },
    // 循环前处理相关数据，并返回数组形式
    resetTableObject(obj, key1) {
      let arr = [];
      // let obj = this.sortKeys(obj2);
      // 若研发历程展示过程中，药品名称和企业与顶端展示的企业名称一致时，需隐藏研发历程中的药品名称和企业；不一致时需要展示药品、企业名称信息内容。
      if (obj.shengchanqiye == this.data.shengchanqiye) {
        delete obj.shengchanqiye;
      }

      if (obj.company == this.data.shengchanqiye) {
        delete obj.company;
      }

      if (obj.qiyemingcheng == this.data.shengchanqiye) {
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
        // if (key != "id" && key != "drugid" && key != "drugidStatus" && key != "drugidTime") { // 将不需要在列表中循环的在此列出
        //   let new_obj = {
        //     "thename": key,
        //     "thevalue": obj[key],
        //   }

        //   arr.push(new_obj)
        // }
        if (obj["drugidStatus"] == "上市信息") {
          //上市信息类  要显示批准日期  不显示状态开始时间
          if (
            key != "id" &&
            key != "drugid" &&
            key != "drugidStatus" &&
            key != "zhuangtaikaishishijian" &&
            key != "pizhunwenhao_type" &&
            key != "pizhunwenhao_id" &&
            key != "pijian"
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
            key != "pijian"
          ) {
            // 将不需要在列表中循环的在此列出
            let new_obj = {
              thename: key,
              thevalue: obj[key]
            };

            arr.push(new_obj);
          }
        }
      }

      let len = arr.length;
      let need_num = len % 3 == 0 ? 0 : 3 - (len % 3);
      if (need_num == 1 || need_num == 2) {
        arr[arr.length - 1].col = need_num + 1;
      }

      return arr;
    },
    // 加载完后移除加载界面
    removeLoading() {
      this.isLoading = false;
    },
    //获取 研发历程 详情对应表格第一列合并数
    getRowSpan(obj) {
      let len = obj.length;
      return Math.ceil(len / 3);
    },
    handleScroll() {
      //   let top = $(".main").offset().top,
      //     leftNav = $(".left-nav");
      //   // if (top <= 50) {
      //   //   leftNav.css("top", (this.showPromtNotice ? 118 : 98) + "px");
      //   // } else {
      //   //   leftNav.css("top", (this.showPromtNotice ? 118 : 88) + "px");
      //   // }
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
    Store.dispatch("CfdaDrug/getBaseInfo");
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

<style lang="less">
@import "~@/assets/less/var.less";
@import "~@/assets/less/detailCom.less";

.pzh {
  color: #4877e8;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
}

.part-five {
  .detail-nopms {
    width: 100%;
    height: 540px;
    background: url(/static/imgs/zhuce/timeline_before.jpg);
  }

  .tb-wrap {
    padding-bottom: 40px !important;
    padding-left: 60px !important;

    .med-info {
      margin-bottom: 60px;

      .info-item {
        display: inline-block;
        margin-right: 40px;
        font-size: 13px;
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
                    top: 55%;
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
                    right: -8px;
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
                    // height: 80px;
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
                    right: -8px;
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

.under_a {
  text-decoration: underline;

  &:hover {
    color: @PrimaryColor;
    font-weight: 600;
  }
}

.slide-section .tb-t tr td:nth-child(odd),
.slide-section .tb-f tr td:nth-child(odd) {
  min-width: 180px !important;
  width: 230px !important;
  max-width: 30vw !important;
  padding: 0 0 0 50px !important;
  background: #f6f8fc;
}

.wrapper.cfdadrug-china-detail {
  .detail-header .header-left .left-top {
    width: unset !important;
  }

  .el-breadcrumb {
    display: inline-flex;
    white-space: nowrap;
  }
}


.part-patent {
  h3 {
    margin-bottom: 5px;
  }

  h4 {
    font-weight: 400;
    margin-bottom: 10px;
    font-size: 14px;
  }

  .tb-t tr td,
  .tb-f tr td {
    width: auto;
  }

  .tb-t tr td:nth-child(2n+1),
  .tb-f tr td:nth-child(2n+1) {
    background: #fff;
  }


  table.tb-t tr td:nth-child(n),
  table.tb-f tr td:nth-child(n) {
    min-width: 180px !important;
    width: auto !important;
    max-width: auto !important;
    padding: 0 0 0 50px !important;
    background: #fff;
  }

}

.part-patent.slide-section,
.part-patent.slide-section {
  .tb-t {
    tr {
      td {
        &:nth-child(n) {
          background: #fff !important;
        }

        &.th {
          background: #f6f8fc !important;
          min-width: 230px !important;
        }

        &.tc {
          text-align: center !important;
          padding: 0 20px !important;
        }

        &.w80 {
          width: 80px !important;
        }
      }
    }
  }

  .file-box {
    // padding-top: 8px;
    // padding-bottom: 8px;

    a {
      display: inline-block;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 49%;
      color: #4877e8;
    }
  }

  h3 {
    font-weight: normal;
  }

  h3,
  h4 {
    margin-left: 10px;
  }
}
</style>

<style lang="less">
.part-patent {
  .detail-title {
    position: relative;
    height: 36px;
    padding-left: 5px !important;
    line-height: 28px;
    border-bottom: 1px solid #dfe5f1;

    >.in {
      position: relative;
      top: 5px;
      display: inline-block;
      padding: 0px 5px;
      font-size: 14px;
      color: #4877e8;
      border-bottom: 3px solid #4877e8;
    }

    >.rela-span {
      position: relative;
      top: 4px;
      left: 6px;
      font-size: 14px;
    }
  }
}
</style>