<template>
  <div class="wrapper cfdadrug-import-detail" ref="wrapper">
    <!-- 自定义加载界面 -->
    <LoadingGif :loadFlag="isLoading" v-if="isLoading"></LoadingGif>
    <!-- 加载完成显示部分 -->
    <div class="detail-list import-detail" v-else>
      <div class="detail-header header-fixed">
        <div class="header-left">
          <div class="left-top">
            <span class="top-id" :title="data.title.zhucezhenghao">{{
                data.title.zhucezhenghao
            }}</span>
            <div class="left-bottom">
              <span class="bottom-name">{{
                  data.title.chanpinmingchengzhongwen
              }}</span>
              <a class="company-name">{{
                  data.title.gongsimingchengzhongwen
              }}</a>
            </div>
            <span class="id-green bg-blue" v-if="data.title.titel.country">{{
                data.title.titel.country
            }}</span>
            <span class="id-green bg-green" v-if="data.title.yblb">{{
                data.title.yblb
            }}</span>
            <span class="id-green bg-orange" v-if="data.title.titel.jiyao">{{
                data.title.titel.jiyao
            }}</span>
            <span class="id-green bg-orange" v-if="data.jbxx.yuanyan == 1">原研</span>
          </div>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item><a href="/home">首页</a></el-breadcrumb-item>
            <el-breadcrumb-item><a :href="'/' + allBase.dbename">{{ allBase.dbname }}</a></el-breadcrumb-item>
            <el-breadcrumb-item>进口详情页</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </div>
      <div class="main">
        <div class="left-nav" :style="{ top: (showPromtNotice ? 128 : 98) + 'px' }">
          <div class="nav-list nav-event" @click="handleNavClick">
            <a class="nav-item active" v-if="hasPartOne">官网信息</a>
            <a class="nav-item" v-if="hasPartTwo">药智信息</a>
            <a class="nav-item" v-if="hasPartThree">国家医保信息</a>
            <a class="nav-item" v-if="hasPatent">专利信息</a>
            <a class="nav-item" v-if="hasExtend">扩展信息</a>
          </div>
        </div>
        <div class="right-list">
          <slide-section :title="'官网信息'" class="the-part" v-if="hasPartOne">
            <div class="tb-wrap">
              <table class="tb-t">
                <tr v-if="data.jbxx.chanpinmingchengzhongwen">
                  <td>药品名称(中文)</td>
                  <td colspan="3">
                    <div class="td-line5">
                      {{ data.jbxx.chanpinmingchengzhongwen }}
                    </div>
                  </td>
                </tr>
                <tr v-if="data.jbxx.chanpinmingchengyingwen">
                  <td>药品名称(英文)</td>
                  <td colspan="3">
                    <div class="td-line5">
                      {{ data.jbxx.chanpinmingchengyingwen }}
                    </div>
                  </td>
                </tr>
                <tr v-if="data.jbxx.chanpinleibie">
                  <td>药品类型</td>
                  <td colspan="3">
                    <div class="td-line5">
                      {{ data.jbxx.chanpinleibie }}
                    </div>
                  </td>
                </tr>
                <tr v-if="data.jbxx.zhucezhenghao">
                  <td>注册证号</td>
                  <td colspan="3">
                    <div class="td-line5">
                      {{ data.jbxx.zhucezhenghao }}
                    </div>
                  </td>
                </tr>
                <tr v-if="data.jbxx.yuanzhucezhenghao">
                  <td>
                    原注册证号
                    <el-tooltip effect="zhuce" placement="right">
                      <div slot="content">再注册前的注册证号。</div>
                      <i class="el-icon-question cl-green" style="margin-left: 4px"></i>
                    </el-tooltip>
                  </td>
                  <td colspan="3">
                    <div class="td-line5">
                      {{ data.jbxx.yuanzhucezhenghao }}
                    </div>
                  </td>
                </tr>
                <tr v-if="data.jbxx.zhucezhenghaobeizhu">
                  <td>注册证号备注</td>
                  <td colspan="3">
                    <div class="td-line5">
                      {{ data.jbxx.zhucezhenghaobeizhu }}
                    </div>
                  </td>
                </tr>
                <tr v-if="data.jbxx.fenbaozhuangpizhunwenhao">
                  <td>分包装批准文号/分包装注册证号</td>
                  <td colspan="3">
                    <div class="td-line5">
                      {{ data.jbxx.fenbaozhuangpizhunwenhao }}
                    </div>
                  </td>
                </tr>
                <tr v-if="data.jbxx.mah">
                  <td>上市许可持有人中文名称</td>
                  <td colspan="3">
                    <div class="td-line5">
                      {{ data.jbxx.mah }}
                    </div>
                  </td>
                </tr>
                <tr v-if="data.jbxx.mahyingwen">
                  <td>上市许可持有人英文名称</td>
                  <td colspan="3">
                    <div class="td-line5">
                      {{ data.jbxx.mahyingwen }}
                    </div>
                  </td>
                </tr>
                <tr v-if="data.jbxx.mahaddresszhongwen">
                  <td>上市许可持有人地址(中文)</td>
                  <td colspan="3">
                    <div class="td-line5">
                      {{ data.jbxx.mahaddresszhongwen }}
                    </div>
                  </td>
                </tr>
                <tr v-if="data.jbxx.mahaddressyingwen">
                  <td>上市许可持有人地址(英文)</td>
                  <td colspan="3">
                    <div class="td-line5">
                      {{ data.jbxx.mahaddressyingwen }}
                    </div>
                  </td>
                </tr>
                <tr v-if="data.jbxx.gongsimingchengzhongwen">
                  <td>公司名称(中文)</td>
                  <td colspan="3">
                    <div class="td-line5">
                      {{ data.jbxx.gongsimingchengzhongwen }}
                    </div>
                  </td>
                </tr>
                <tr v-if="data.jbxx.gongsimingchengyingwen">
                  <td>公司名称(英文)</td>
                  <td colspan="3">
                    <div class="td-line5">
                      {{ data.jbxx.gongsimingchengyingwen }}
                    </div>
                  </td>
                </tr>
                <tr v-if="data.jbxx.dizhizhongwen">
                  <td>地址(中文)</td>
                  <td colspan="3">
                    <div class="td-line5">
                      {{ data.jbxx.dizhizhongwen }}
                    </div>
                  </td>
                </tr>
                <tr v-if="data.jbxx.dizhiyingwen">
                  <td>地址(英文)</td>
                  <td colspan="3">
                    <div class="td-line5">
                      {{ data.jbxx.dizhiyingwen }}
                    </div>
                  </td>
                </tr>
                <tr v-if="data.jbxx.guojiazhongwen">
                  <td>国家/地区(中文)</td>
                  <td colspan="3">
                    <div class="td-line5">
                      {{ data.jbxx.guojiazhongwen }}
                    </div>
                  </td>
                </tr>
                <tr v-if="data.jbxx.guojiayingwen">
                  <td>国家/地区(英文)</td>
                  <td colspan="3">
                    <div class="td-line5">
                      {{ data.jbxx.guojiayingwen }}
                    </div>
                  </td>
                </tr>
                <tr v-if="data.jbxx.shangpinmingzhongwen">
                  <td>商品名(中文)</td>
                  <td colspan="3">
                    <div class="td-line5">
                      {{ data.jbxx.shangpinmingzhongwen }}
                    </div>
                  </td>
                </tr>
                <tr v-if="data.jbxx.shangpinmingyingwen">
                  <td>商品名(英文)</td>
                  <td colspan="3">
                    <div class="td-line5">
                      {{ data.jbxx.shangpinmingyingwen }}
                    </div>
                  </td>
                </tr>
                <tr v-if="data.jbxx.jixingzhongwen">
                  <td>剂型(中文)</td>
                  <td colspan="3">
                    <div class="td-line5">
                      {{ data.jbxx.jixingzhongwen }}
                    </div>
                  </td>
                </tr>
                <tr v-if="data.jbxx.guigezhongwen">
                  <td>规格(中文)</td>
                  <td colspan="3">
                    <div class="td-line5">
                      {{ data.jbxx.guigezhongwen }}
                    </div>
                  </td>
                </tr>
                <tr v-if="data.jbxx.baozhuangguigezhongwen">
                  <td>包装规格(中文)</td>
                  <td colspan="3">
                    <div class="td-line5">
                      {{ data.jbxx.baozhuangguigezhongwen }}
                    </div>
                  </td>
                </tr>
                <tr v-if="data.jbxx.shengchanchangshangzhongwen">
                  <td>生产厂商(中文)</td>
                  <td colspan="3">
                    <div class="td-line5">
                      {{ data.jbxx.shengchanchangshangzhongwen }}
                    </div>
                  </td>
                </tr>
                <tr v-if="data.jbxx.shengchanchangshangyingwen">
                  <td>生产厂商(英文)</td>
                  <td colspan="3">
                    <div class="td-line5">
                      {{ data.jbxx.shengchanchangshangyingwen }}
                    </div>
                  </td>
                </tr>
                <tr v-if="data.jbxx.changshangdizhizhongwen">
                  <td>厂商地址(中文)</td>
                  <td colspan="3">
                    <div class="td-line5">
                      {{ data.jbxx.changshangdizhizhongwen }}
                    </div>
                  </td>
                </tr>
                <tr v-if="data.jbxx.changshangdizhiyingwen">
                  <td>厂商地址(英文)</td>
                  <td colspan="3">
                    <div class="td-line5">
                      {{ data.jbxx.changshangdizhiyingwen }}
                    </div>
                  </td>
                </tr>
                <tr v-if="data.jbxx.changshangguojiazhongwen">
                  <td>厂商国家/地区(中文)</td>
                  <td colspan="3">
                    <div class="td-line5">
                      {{ data.jbxx.changshangguojiazhongwen }}
                    </div>
                  </td>
                </tr>
                <tr v-if="data.jbxx.changshangguojiayingwen">
                  <td>厂商国家/地区(英文)</td>
                  <td colspan="3">
                    <div class="td-line5">
                      {{ data.jbxx.changshangguojiayingwen }}
                    </div>
                  </td>
                </tr>
                <tr v-if="data.jbxx.fazhengriqi">
                  <td>发证日期</td>
                  <td colspan="3">
                    <div class="td-line5">
                      {{ data.jbxx.fazhengriqi }}
                    </div>
                  </td>
                </tr>
                <tr v-if="data.jbxx.youxiaoqijiezhiri">
                  <td>有效期截止日</td>
                  <td colspan="3">
                    <div class="td-line5">
                      {{ data.jbxx.youxiaoqijiezhiri }}
                    </div>
                  </td>
                </tr>
                <tr v-if="data.jbxx.fenbaozhuangqiyemingcheng">
                  <td>分包装企业名称</td>
                  <td colspan="3">
                    <div class="td-line5">
                      {{ data.jbxx.fenbaozhuangqiyemingcheng }}
                    </div>
                  </td>
                </tr>
                <tr v-if="data.jbxx.fenbaozhuangqiyedizhi">
                  <td>分包装企业地址</td>
                  <td colspan="3">
                    <div class="td-line5">
                      {{ data.jbxx.fenbaozhuangqiyedizhi }}
                    </div>
                  </td>
                </tr>
                <tr v-if="data.jbxx.fenbaozhuangwenhaopizhunriqi">
                  <td>分包装文号批准日期</td>
                  <td colspan="3">
                    <div class="td-line5">
                      {{ data.jbxx.fenbaozhuangwenhaopizhunriqi }}
                    </div>
                  </td>
                </tr>
                <tr v-if="data.jbxx.fenbaozhuangwenhaoyouxiaoqijiezhiri">
                  <td>分包装文号有效期截止日期</td>
                  <td colspan="3">
                    <div class="td-line5">
                      {{ data.jbxx.fenbaozhuangwenhaoyouxiaoqijiezhiri }}
                    </div>
                  </td>
                </tr>
                <tr v-if="data.jbxx.benweima">
                  <td>药品本位码</td>
                  <td colspan="3">
                    <div class="td-line5">
                      {{ data.jbxx.benweima }}
                    </div>
                  </td>
                </tr>
                <tr v-if="data.jbxx.benweimabeizhu">
                  <td>药品本位码备注</td>
                  <td colspan="3">
                    <div class="td-line5">
                      {{ data.jbxx.benweimabeizhu }}
                    </div>
                  </td>
                </tr>
              </table>
            </div>
          </slide-section>

          <slide-section :title="'药智信息'" class="the-part" v-if="hasPartTwo">
            <div class="tb-wrap">
              <table class="tb-t">
                <tr v-if="data.jbxx.yspzwh">
                  <td>
                    原始批准文号
                    <el-tooltip effect="zhuce" placement="right">
                      <div slot="content">首次注册的注册证号。</div>
                      <i class="el-icon-question cl-green" style="margin-left: 4px"></i>
                    </el-tooltip>
                  </td>
                  <td colspan="3">
                    <div class="td-line5">
                      {{ data.jbxx.yspzwh }}
                    </div>
                  </td>
                </tr>
                <tr v-if="data.jbxx.yspzsj">
                  <td>原始批准时间</td>
                  <td colspan="3">
                    <div class="td-line5">
                      {{ data.jbxx.yspzsj }}
                    </div>
                  </td>
                </tr>
                <tr v-if="
                  data.jbxx.targets_abbr && data.jbxx.targets_abbr.length > 0
                ">
                  <td>靶点简称</td>
                  <td colspan="3">
                    <div class="td-line5">
                      {{ data.jbxx.targets_abbr }}
                    </div>
                  </td>
                </tr>
                <tr v-if="data.jbxx.targets && data.jbxx.targets.length > 0">
                  <td>靶点全称</td>
                  <td colspan="3">
                    <div class="td-line5">
                      {{ data.jbxx.targets }}
                    </div>
                  </td>
                </tr>
                <tr v-if="data.title.atc || data.title.atc.length > 0">
                  <td>ATC分类</td>
                  <td colspan="3">
                    <div class="td-line5">
                      <div v-for="(item, index) in getAtcNames(data.title.atc)" :key="item" class="clearfix">
                        <span>{{ item }}&nbsp;&nbsp;</span><span>{{ getAtc(item, data.title.atcarr) }}</span>
                        <br v-if="index % 2 != 0" />
                      </div>
                    </div>
                  </td>
                </tr>
                <tr v-if="
                  data.jbxx.shiyingzheng && data.jbxx.shiyingzheng.length > 0
                ">
                  <td>适应症</td>
                  <td colspan="3">
                    <div class="td-line5" v-html="data.jbxx.shiyingzheng"></div>
                  </td>
                </tr>
                <tr v-if="data.jbxx.dailiangcaigou1">
                  <td>
                    带量采购品种
                    <el-tooltip effect="zhuce" placement="right">
                      <div slot="content">
                        带量采购是国家药品组织的药品集中采购制度的重大改革，首先由4+7城市试点，目前已在全国范围开展。
                      </div>
                      <i class="el-icon-question cl-green" style="margin-left: 4px"></i>
                    </el-tooltip>
                  </td>
                  <td colspan="3">
                    <div class="td-line5">
                      <router-link target="_blank" class="under_a" :to="{
                        path: '/dailiangcaigou',
                        query: {
                          fourth_condition: `bianma=${data.jbxx.bianma} _and
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        qiyebianmatz=${data.jbxx.qiyebianmatz} _and guifanguige=${data.jbxx.guifanguige}`,
                        },
                      }" v-if="data.jbxx.dailiangcaigou1 === '已中选'">{{
    data.jbxx.dailiangcaigou1
      ? data.jbxx.dailiangcaigou1
      : "/"
}}</router-link>
                      <div v-else>
                        {{ data.jbxx.dailiangcaigou1 }}
                      </div>
                    </div>
                  </td>
                </tr>
                <tr v-if="data.jbxx.gdcf">
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
                      {{ data.jbxx.gdcf }}
                    </div>
                  </td>
                </tr>
                <tr v-if="data.jbxx.wftjcbzj && data.jbxx.wftjcbzj === 1">
                  <td>
                    无需开展一致性评价品种
                    <el-tooltip effect="zhuce" placement="right">
                      <div slot="content">
                        根据《临床价值明确，无法推荐参比制剂的化学药品目录》分类。
                      </div>
                      <i class="el-icon-question cl-green" style="margin-left: 4px"></i>
                    </el-tooltip>
                  </td>
                  <td colspan="3">
                    <div class="td-line5">
                      {{ data.jbxx.wftjcbzj === 1 ? "是" : "否" }}
                    </div>
                  </td>
                </tr>
                <tr v-if="zcylyShow()">
                  <td>
                    自产原料药厂家
                    <el-tooltip effect="zhuce" placement="right">
                      <div slot="content">
                        既生产原料药又生产该原料药的制剂产品的厂家。
                      </div>
                      <i class="el-icon-question cl-green" style="margin-left: 4px"></i>
                    </el-tooltip>
                  </td>
                  <td colspan="3">
                    <div class="td-line5">
                      {{ data.jbxx.zcyly }}
                    </div>
                  </td>
                </tr>
                <!-- <tr v-if="data.jbxx.changjiashugp !== null">
                  <td>
                    <div class="td-line5">
                      通过一致性评价厂家数
                      <el-tooltip effect="zhuce" placement="right">
                        <div slot="content">
                          包含视同通过。
                        </div>
                        <i class="el-icon-question cl-green" style="margin-left:4px;"></i>
                      </el-tooltip>
                    </div>
                  </td>
                  <td colspan="3">
                    <div class="td-line5">
                      {{ data.jbxx.changjiashugp }}
                    </div>
                  </td>
                </tr> -->
                <tr v-if="data.jbxx.changjiashuat">
                  <td>
                    同成分厂家数
                    <el-tooltip effect="zhuce" placement="right">
                      <div slot="content">活性成分相同的厂家数。</div>
                      <i class="el-icon-question cl-green" style="margin-left: 4px"></i>
                    </el-tooltip>
                  </td>
                  <td colspan="3">
                    <div class="td-line5">
                      {{ data.jbxx.changjiashuat }}
                    </div>
                  </td>
                </tr>

                <tr v-if="data.jbxx.baojianpin">
                  <td>保健药品</td>
                  <td colspan="3">
                    <div class="td-line5">
                      {{ data.jbxx.baojianpin }}
                    </div>
                  </td>
                </tr>
                <tr v-if="data.jbxx.otc">
                  <td>处方/非处方</td>
                  <td colspan="3">
                    <div class="td-line5">
                      {{ data.jbxx.otc }}
                    </div>
                  </td>
                </tr>
                <!-- <tr v-if="data.jbxx.zhuanli">
                  <td>专利信息</td>
                  <td colspan="3">
                    <div class="td-line5">
                      <a v-for="(item, index) in data.jbxx.zhuanli.split(';')" :key="index"
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
                <tr v-if="infos[0].state && infos[0].state!== '/'" v-for="(infos, index) in drugInfos" :key="index">
                  <td>
                    {{ infos[0].name }}
                  </td>
                  <td colspan="3">
                    <div class="td-line5">{{ infos[0].state }}</div>
                  </td>
                </tr>
                <tr v-if="infos[1].state && infos[1].state!== '/'" v-for="(infos, index) in drugInfos" :key="'td2_' + index">
                  <td>
                    {{ infos[1].name }}
                  </td>
                  <td colspan="3">
                    <div class="td-line5">{{ infos[1].state }}</div>
                  </td>
                </tr>
              </table>
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

          <slide-section :title="'扩展信息'" class="the-part" v-if="hasExtend">
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
      atc: [],
      baseInfos: [], //存放基本信息
      drugInfos: [], //存放医疗信息
      zhuanli: {},
      atc: [],
      shoulihao: "",
      devProcess: {}, //时光轴
      devProcesses: [],
      heightArr: [],
      scroll: "",
      hasPartOne: false,
      hasPartTwo: true,
      hasPartThree: true,
      hasExtend: false,
      hasPatent: true, //专利
      extendList: [],
      yfxx: {}
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
      let status = false, jbxx = this.data.jbxx;
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
    handleAxios() {
      window
        .Axios({
          method: "get",
          url: "/api/cfdadrug/jkdetail",
          params: {
            id: this.$route.params.id,
            accesstoken: GETCOOKIEFUN("accesstoken")
          }
        })
        .then(res => {
          if (res.data.code === 200 && res.data.data) {
            let data = res.data.data.GroupList;
            for (let [key, val] of Object.entries(data.jbxx)) {
              data.jbxx[key] = ["/", "无", "否", "非集采品种"].includes(
                data.jbxx[key]
              )
                ? ""
                : data.jbxx[key];
            }
            for (let [key, val] of Object.entries(data.title)) {
              data.title[key] = ["/", "无", "否", "非集采品种"].includes(
                data.title[key]
              )
                ? ""
                : data.title[key];
            }
            this.data = data;
            this.atc = data.atc;
            this.getExtendList("cfdadrug", res.data.data.extendList);
            //右侧国家进口的基础信息获取
            this.hasPartOne = true;
            //右侧国家进口的医保信息获取
            this.hasPartTwo = true;
            this.hasPartThree = data.title.yblb;
            let drugInfos = [
              { name: "编号", state: data.ybxx.yibaoxuhao },
              { name: "分类", state: data.ybxx.yibao },
              { name: "药品名称", state: data.ybxx.name1 },
              { name: "支付适应症", state: data.ybxx.syz }
            ];
            for (let i = 0; i < drugInfos.length; i++) {
              if (i % 2 === 0) {
                this.drugInfos.push([]);
              }
              this.drugInfos[parseInt(i / 2)].push(drugInfos[i]);
            }

            this.zhuanli = res.data.data.GroupList.zhuanli;
            this.hasPatent = this.zhuanli.zlgs.length > 0 || this.zhuanli.zlsm.generic.length > 0 || this.zhuanli.zlsm.other.length > 0;
          }
        })
        .catch(err => {
          console.log(err);
        })
        .then(this.removeLoading);
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
    // 加载完后移除加载界面
    removeLoading() {
      this.isLoading = false;
    },
    ellipsizeTextElement($element) {
      var nodeList = document.querySelectorAll($element);
      var elements = Array.prototype.slice.call(nodeList, 0);
      elements.forEach(function (element) {
        var wordArray = element.innerHTML.split(" ");
        while (element.scrollHeight > element.offsetHeight) {
          wordArray.pop();
          element.innerHTML = wordArray.join(" ") + "...";
        }
      });
    },
    handleScroll() {
      // let top = $(".main").offset().top,
      //   leftNav = $(".left-nav");
      // if (top <= 50) {
      //   leftNav.css("top", (this.showPromtNotice ? 118 : 98) + "px");
      // } else {
      //   leftNav.css("top", (this.showPromtNotice ? 118 : 88) + "px");
      // }
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
    this.ellipsizeTextElement("td");
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

.under_a {
  text-decoration: underline;

  &:hover {
    color: @PrimaryColor;
    font-weight: 600;
  }
}
</style>

<style lang="less">
.pzh {
  color: #4877e8;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
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

.wrapper.cfdadrug-import-detail {
  .detail-header .header-left .left-top {
    width: unset !important;
  }

  .el-breadcrumb {
    display: inline-flex;
    white-space: nowrap;
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
