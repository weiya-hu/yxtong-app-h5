<template>
  <div class="time-line" id="time-line">
    <!-- 静态数据备份样板 -->
    <!-- <keep-alive> -->
    <!-- <time-node
        v-for="(item, index) in data"
        :key="index"
        :mainName="item.main_name"
        :mainTime="item.main_time"
        :hasTaskDesc="item.task_desc.length !== 0"
        :hasTaskDetail="item.task_detail.length !== 0"
        :taskDesc="item.task_desc"
        :taskDetail="item.task_detail"
        :data="data"
      ></time-node> -->
    <!-- </keep-alive> -->

    <!-- NMPA受理 -->
    <time-node
      id="cfda_shouli"
      v-if="Object.keys(cfdaShouli).length !== 0"
      :mainName="cfdaShouli.label"
      :mainTime="cfdaShouli.date === 0 ? '' : cfdaShouli.date"
      :duringZlsStart="duringZlsStart"
    ></time-node>
    <!-- ！！！费用收到日 -->
    <time-node
      id="cfda_fysdr"
      v-if="Object.keys(fysdr).length !== 0 && fysdr.date && fysdr.label"
      mainName="费用收到日"
      :mainTime="fysdr.date === 0 ? '' : fysdr.date"
    ></time-node>
    <!-- CDE承办 -->
    <time-node
      id="cde_chengban"
      v-if="Object.keys(cde).length !== 0"
      :mainName="cde.label"
      :mainTime="cde.date === 0 ? '' : cde.date"
    ></time-node>
    <!-- 新报任务 -->
    <time-node
      id="cde_xinbao"
      v-if="Object.keys(cdeXinbaoMin).length !== 0"
      :mainName="cdeXinbaoMin.label"
      :mainTime="cdeXinbaoMin.date === 0 ? '' : cdeXinbaoMin.date"
      :taskDesc="cdeXinbaoMin"
    ></time-node>
    <!-- ！！！remarks -->
    <!-- <time-node
      v-if="cdeRemarks.length !== 0"
      v-for="(item, index) in cdeRemarks"
      :key="'cdeRemarks' + index"
      :mainName="item.remarks"
      :mainTime="item.date === 0 ? '':item.date"
    ></time-node> -->
    <!-- 开始技术评审 -->
    <time-node
      id="cde_xinbao_min"
      v-if="Object.keys(cdeXinbaoPinshenMin).length !== 0"
      :diffInfoMin="cdeXinbaoMin"
      :diffInfoPsMin="cdeXinbaoPinshenMin"
      :mainName="cdeXinbaoPinshenMin.label"
      :mainTime="cdeXinbaoPinshenMin.date === 0 ? '' : cdeXinbaoPinshenMin.date"
      :taskDetailZhuanye="cdeXinbaoZhuanye"
      :taskDetailBeizhu="cdeXinbao.beizhu"
      :duringPdsc="duringPdsc"
      :preNode="cdeXinbaoMin.label"
      :noActive="cdeXinbaoPinshenMin.noActive"
    ></time-node>
    <!-- 完成技术评审 -->
    <time-node
      id="cde_xinbao_max"
      v-if="Object.keys(cdeXinbaoPinshenMax).length !== 0"
      :diffInfo="cdeXinbao"
      :mainName="cdeXinbaoPinshenMax.label"
      :mainTime="cdeXinbaoPinshenMax.date === 0 ? '' : cdeXinbaoPinshenMax.date"
      :duringXbspsc="duringXbspsc"
      :noActive="cdeXinbaoPinshenMax.noActive"
    ></time-node>
    <!-- ！！！songda - 补发通知 -->
    <!-- <time-node
      v-if="cdeSongda.length !== 0"
      v-for="(item, index) in cdeSongda"
      :key="'cdeSongda' + index"
      mainName="补发通知"
      :mainTime="item.songda === 0 ? '':item.songda"
    ></time-node> -->
    <!-- 补充 -->
    <div
      :id="'buchong-arr-' + index"
      v-if="cdeBuchong.length"
      v-for="(item, index) in cdeBuchong"
      :key="'cdeBuchong' + index"
    >
      <!-- 补充的进入补充资料任务 -->
      <time-node
        :id="'cde_buchong_' + index"
        v-if="item.min"
        :mainName="item.min.label"
        :mainTime="item.min.date === 0 ? '' : item.min.date"
        :taskDesc="item.min"
      ></time-node>
      <!-- 补充的开始技术评审 -->
      <time-node
        :id="'cde_buchong_min_' + index"
        v-if="item.pingshenMin"
        :mainName="item.pingshenMin.label"
        :mainTime="item.pingshenMin.date === 0 ? '' : item.pingshenMin.date"
        :taskDetailZhuanye="item.zhuanye"
        :taskDetailBeizhu="item.beizhu"
        :preNode="item.min.label"
        :noActive="
          index == cdeBuchong.length - 1 &&
            !item.pingshenMax.date &&
            !item.pingshenMin.date
        "
      ></time-node>
      <!-- 补充的完成技术评审 -->
      <time-node
        :id="'cde_buchong_max_' + index"
        :duringIndex="index"
        v-if="item.pingshenMax"
        :diffInfo="item"
        :mainName="item.pingshenMax.label"
        :mainTime="item.pingshenMax.date === 0 ? '' : item.pingshenMax.date"
        :duringBcspsc="buChongArr[index]"
        :noActive="index == cdeBuchong.length - 1 && !item.pingshenMax.date"
      ></time-node>
    </div>
    <!-- 三合一审评-->
    <div v-if="threeheoneChange" id="threeheoneChange">
      <time-node id="threeheone" :mainName="'三合一审评'"></time-node>

      <time-node
        :id="'threeheone_xcjianchajigou'"
        v-if="
          threeheone.xcjianchajigou !== '已完成现场检查' &&
            threeheone.xcjianchajigou
        "
        :taskDesc="{
          label: threeheone.zhuangtai,
          date: threeheone.jieshoushijian
        }"
        :mainName="threeheone.xcjianchajigou"
        :mainTime="threeheone.xcjianchashijian"
      ></time-node>
      <time-node
        :id="'threeheone_zhuangtai'"
        v-if="threeheone.jieshoushijian"
        :mainName="threeheone.zhuangtai"
        :mainTime="threeheone.jieshoushijian"
      ></time-node>
    </div>
    <!--NMPA审批  -->
    <time-node
      id="cfda"
      v-if="
        Object.keys(cfdaShenpi).length !== 0 ||
          Object.keys(cfdaSpwb).length !== 0 ||
          Object.keys(cfdaYfpj).length !== 0
      "
      :mainName="'NMPA审批'"
    ></time-node>
    <!-- NMPA开始审批 -->
    <time-node
      id="cfda_kssp"
      v-if="Object.keys(cfdaShenpi).length !== 0"
      :mainName="cfdaShenpi.label"
      :mainTime="cfdaShenpi.date === 0 ? '' : cfdaShenpi.date"
    ></time-node>
    <!-- NMPA审批完毕 -->
    <time-node
      id="cfda_spwb"
      v-if="Object.keys(cfdaSpwb).length !== 0"
      :diffInfoArr="[cfdaShenpi, cfdaSpwb]"
      :mainName="cfdaSpwb.label"
      :mainTime="cfdaSpwb.date === 0 ? '' : cfdaSpwb.date"
      :duringSpsc="duringSpsc"
    ></time-node>
    <!-- NMPA已发批件 -->
    <time-node
      id="cfda_yfpj"
      v-if="Object.keys(cfdaYfpj).length !== 0"
      :mainName="cfdaYfpj.label"
      :mainTime="cfdaYfpj.date === 0 ? '' : cfdaYfpj.date"
    ></time-node>
  </div>
</template>

<script>
import Vue from "vue";
import TimeNode from "./time-node";

export default {
  components: {
    TimeNode
  },
  data() {
    return {
      id: this.$route.params.id,
      // 总数据
      data: {},
      // lineArr: [],
      cfdaShouli: {}, //NMPA受理
      fysdr: {}, //费用收到日
      cde: {}, //CDE承办
      cdeXinbao: {}, //新报任务
      cdeXinbaoMin: {}, //新报任务
      cdeRemarks: [],
      cdeXinbaoPinshenMin: {}, //开始技术评审
      cdeXinbaoPinshenMax: {}, //完成技术评审
      cdeXinbaoZhuanye: {},
      cdeSongda: [],
      cdeBuchong: [],
      // cdeBuchongZhuanye:[],
      // cdeXinbaoTaskYx: {}, //CDE新报任务开始审批专业详情 - 药学
      // cdeXinbaoTaskLc: {}, //CDE新报任务开始审批专业详情 - 临床
      // cdeXinbaoTaskYldl: {}, //CDE新报任务开始审批专业详情 - 药理毒理
      // cdeXinbaoTaskWeiqidong: {}, //CDE新报任务开始审批专业详情 - 未启动 - 统一设置
      cfdaShenpi: {}, //NMPA审批开始
      cfdaYfpj: {}, //NMPA已发批件
      cfdaSpwb: {}, //NMPA审批完毕
      // during
      duringSpsc: 0,
      buChongArr: [],
      duringXbspsc: 0,
      duringPdsc: 0,
      duringZlsStart: false,
      // 三合一评审
      threeheone: {},
      threeheoneChange: null
    };
  },
  computed: {},
  methods: {
    // ！！！通用方法
    // 计算天数差
    getDateDiff(sDate1, sDate2) {
      //sDate1和sDate2是yyyy-mm-dd格式
      let aDate, oDate1, oDate2, iDays;
      aDate = sDate1.split("-");
      oDate1 = new Date(aDate[1] + "/" + aDate[2] + "/" + aDate[0]); //转换为mm-dd-yyyy格式
      aDate = sDate2.split("-");
      oDate2 = new Date(aDate[1] + "/" + aDate[2] + "/" + aDate[0]);
      iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24); //把相差的毫秒数转换为天数
      return iDays;
    },
    // 异步获取后端数据并做处理
    handleAxios() {
      window
        .Axios({
          method: "get",
          url: "/api/zhuce/timeline",
          params: {
            id: this.id,
            accesstoken: GETCOOKIEFUN("accesstoken")
          }
        })
        .then(res => {
          if (res.data.code === 200 && res.data.data) {
            let data = res.data.data;
            this.data = data;

            // NMPA受理
            if (data.shouli) {
              this.cfdaShouli = data.shouli;
            }

            // 费用收到日
            if (data.feiyongdaozhiri) {
              this.fysdr = data.feiyongdaozhiri;
            }
            // CDE承办
            if (data.chengbanriqi) {
              this.cde = data.chengbanriqi;
            }
            // 若NMPA受理时间大于费用收到日时间或CDE承办时间，隐藏NMPA受理时间
            if (
              data.shouli.date > data.feiyongdaozhiri.date ||
              data.shouli.date > data.chengbanriqi.date
            ) {
              this.cfdaShouli.date = 0;
            }
            // 三合一评审
            if (data.chengbanriqi) {
              this.threeheone = data.threeheone || {};
              this.threeheoneChange = data.threeheone;
            }
            // 新报
            if (data.xinbao) {
              this.cdeXinbao = data.xinbao;

              // 进入新报任务
              if (this.cdeXinbao.min) {
                this.cdeXinbaoMin = this.cdeXinbao.min;
              }
              // 开始技术评审
              if (this.cdeXinbao.pingshenMin) {
                this.cdeXinbaoPinshenMin = this.cdeXinbao.pingshenMin;
              }
              // 完成技术评审
              if (this.cdeXinbao.pingshenMax) {
                this.cdeXinbaoPinshenMax = this.cdeXinbao.pingshenMax;
                // console.log(data.buchong)
                // console.log(data.buchong.length)
                let pingshenAfter =
                  !data.buchong &&
                  !(data.songda && data.songda.length > 0) &&
                  !(data.remarks && data.remarks.length > 0);
                this.cdeXinbaoPinshenMax.noActive =
                  !this.cdeXinbao.pingshenMax.date && pingshenAfter;
                this.cdeXinbaoPinshenMin.noActive =
                  !this.cdeXinbao.pingshenMin.date &&
                  !this.cdeXinbao.pingshenMax.date &&
                  pingshenAfter;
              }
              // 新报任务的开始审评的专业
              if (this.cdeXinbao.zhuanye) {
                this.cdeXinbaoZhuanye = this.cdeXinbao.zhuanye;
              }
            }

            // remarks
            if (data.remarks) {
              this.cdeRemarks = data.remarks;
            }

            // songda
            if (data.songda) {
              this.cdeSongda = data.songda;
            }
            // 补充
            if (data.buchong) {
              _.map(data.buchong, one_buchong => {
                this.cdeBuchong.push(one_buchong);
              });
            }

            // NMPA 开始审批
            if (data.cfda_zaishenpin) {
              this.cfdaShenpi = data.cfda_zaishenpin;
            }
            // NMPA 已发批件
            if (data.cfda_yifapijian) {
              this.cfdaYfpj = data.cfda_yifapijian;
            }

            // this.cdeXinbaoTaskYldl = data.xinbao.yaoliduli instanceof Array ? {} : data.xinbao.yaoliduli
            // this.cdeXinbaoTaskYx = data.xinbao.yaoxue instanceof Array ? {} : data.xinbao.yaoxue
            // this.cdeXinbaoTaskLc = data.xinbao.linchuang instanceof Array ? {} : data.xinbao.linchuang
            // this.cdeXinbaoTaskWeiqidong = data.xinbao.zhuanyemax instanceof Object ? data.xinbao.zhuanyemax : {}
            // NMPA 审评完毕
            if (data.cfda_shenpinwanbi) {
              this.cfdaSpwb = data.cfda_shenpinwanbi;
            }

            /*
             * 在$nextTick中，插入remark和songda这些节点
             */
            this.$nextTick(() => {
              // 承办日期 - theDay
              // let timeCbrq = this.fysdr.date
              // let dayCbrq = new Date(timeCbrq)
              // let theDayCbrq = parseInt(Math.abs(dayCbrq) / 1000 / 60 / 60 / 24)

              // 开始插入费用收到日、remarks、songda这三类DOM
              // 费用收到日 - 遍历插入
              // let indexCbrq = -1
              // for (let time of beforeTimeArr) {
              //   if (time === 0 || theDayCbrq > time ) {
              //     indexCbrq++
              //   }
              // }

              /*
               * 一、remarks
               */
              // 1、remarks - theDay
              let remarksTimeArr = []; //获取remarks中的时间戳的数组
              // 将ramarks中的时间戳存入数组
              for (let i = 0; i < this.cdeRemarks.length; i++) {
                let time = this.cdeRemarks[i].date;
                let day = new Date(time);
                let theDay = parseInt(Math.abs(day) / 1000 / 60 / 60 / 24);
                remarksTimeArr.push(theDay);
              }
              // 2、获取已有的节点时间戳
              let beforeNodeNum = $(".node").length;

              let beforeTimeArr = [];
              for (let i = 0; i < beforeNodeNum; i++) {
                let time = $(".node")
                  .eq(i)
                  .find(".concrete-time")
                  .text();

                let day = new Date(time || 0);
                let theDay = parseInt(Math.abs(day) / 1000 / 60 / 60 / 24);
                beforeTimeArr.push(theDay ? theDay : 0);
              }
              // 3、remarks - 多个遍历插入
              let remarksGetNum = 0;
              for (let remarkTime of remarksTimeArr) {
                remarksGetNum++;
                let indexRemark = -1;
                let makeStop = 0; // 设定一个值来判定是否遇到了除“费用收到日”以外的更大的时间戳值
                let meetFysdr = -1; // 设定一个值来使其为1时，可避免遇到“费用收到日”比所需对比时间大的情况
                for (let time of beforeTimeArr) {
                  meetFysdr++;
                  if (
                    !makeStop &&
                    (time === 0 || remarkTime >= time || meetFysdr === 1)
                  ) {
                    indexRemark++;
                  } else if (remarkTime < time) {
                    makeStop++;
                  }
                }
                let leftContent = this.cdeRemarks[remarksGetNum - 1].date;
                let rightContent = this.cdeRemarks[remarksGetNum - 1].remarks;
                let rightUrl = this.cdeRemarks[remarksGetNum - 1].url;
                let sources = this.cdeRemarks[remarksGetNum - 1].laiyuan;
                let yxsply = this.cdeRemarks[remarksGetNum - 1].yxsply
                  ? this.cdeRemarks[remarksGetNum - 1].yxsply
                  : null;
                let rightHtml = rightUrl
                  ? `<div  class='part-name part-name-url' title='${sources}'>${rightContent} <span style="margin-left:10px;font-weight: bold;">${
                      yxsply ? `纳入理由：${yxsply}` : ""
                    }</span><span onClick='ga("send", "event", "button", "click","vip_zhuce_shiguangzhou_remarks_url");window.open("${rightUrl}")' class="iconfont iconfont-link-btn">&#xe617;</span></div>`
                  : `<div class='part-name' title='${sources}'>${rightContent}<span style="margin-left:10px;font-weight: bold;">${
                      yxsply ? `纳入理由：${yxsply}` : ""
                    }</span></div>`;
                let addNode = `<div class='node node-blue little-node'>
                <div class='node-left'>
                  <div class='concrete-time'>${leftContent}</div>
                </div>
                <div class='dot little-dot'>
                  <div class='line'></div>
                </div>
                <div class='node-right'>
                  <div class='content'>
                    <div class='first-part'>
                      ${rightHtml}
                    </div>
                  </div>
                </div>
              <div>`;
                $(".node")
                  .eq(indexRemark - 1 + remarksGetNum)
                  .after(addNode);
              }

              /*
               * 二、songda
               */
              // 1、songda - theDay
              let songdaTimeArr = []; //获取songda中的时间戳的数组
              // 将songda中的时间戳存入数组
              for (let i = 0; i < this.cdeSongda.length; i++) {
                let time = this.cdeSongda[i].songda;
                let day = new Date(time || 0);
                let theDay = parseInt(Math.abs(day) / 1000 / 60 / 60 / 24);
                songdaTimeArr.push(theDay);
              }
              // 2、插入remarks后节点数改变，需要重新获取节点数
              let beforeSongdaNodeNum = $(".node").length;
              let beforeSongdaTimeArr = [];
              for (let i = 0; i < beforeSongdaNodeNum; i++) {
                let time = $(".node")
                  .eq(i)
                  .find(".concrete-time")
                  .text();
                let day = new Date(time || 0);
                let theDay = parseInt(Math.abs(day) / 1000 / 60 / 60 / 24);
                beforeSongdaTimeArr.push(theDay ? theDay : 0);
              }

              // 3、songda - 多个遍历插入
              let songdaGetNum = 0;
              beforeSongdaTimeArr[0] = 0;
              for (let songdaTime of songdaTimeArr) {
                songdaGetNum++;
                let indexSongda = -1;
                let makeStop = 0; // 设定一个值来判定是否遇到了除“费用收到日”以外的更大的时间戳值
                let meetFysdr = -1; // 设定一个值来使其为1时，可避免遇到“费用收到日”比所需对比时间大的情况
                for (let time of beforeSongdaTimeArr) {
                  if (
                    !makeStop &&
                    (time === 0 || songdaTime >= time || meetFysdr === 1)
                  ) {
                    indexSongda++;
                  } else if (songdaTime < time) {
                    makeStop++;
                  }
                  // console.info(indexSongda+"=====++++++>")
                }
                // console.info(indexSongda,songdaGetNum+"=====>")
                let leftContent = this.cdeSongda[songdaGetNum - 1].songda;
                // let rightContent = this.cdeSongda[songdaGetNum - 1].xxx
                let addNode = `<div class='node node-blue little-node'>
                <div class='node-left'>
                  <div class='concrete-time'>${leftContent}</div>
                </div>
                <div class='dot little-dot'>
                  <div class='line'></div>
                </div>
                <div class='node-right'>
                  <div class='content'>
                    <div class='first-part'>
                      <div class='part-name'>CDE送达通知</div>
                    </div>
                  </div>
                </div>
              <div>`;
                $(".node")
                  .eq(indexSongda - 1 + songdaGetNum)
                  .after(addNode);
              }

              // 确定并显示“总历时”
              let finalNodeNum = $(".node").length;
              let finalTimeArr = [];
              let zlsStartBefore = -1;
              let zlsStart = -1;
              let zlsStartGet = 0;
              let zlsEndBefore = finalNodeNum - 1;
              let zlsEnd = -1;
              let zlsEndGet = 0;
              // 确定开始有时间的index
              for (let i = 0; i < finalNodeNum; i++) {
                zlsStartBefore++;
                let time = $(".node")
                  .eq(i)
                  .find(".concrete-time")
                  .text();

                let day = new Date(time);
                let theDay = parseInt(Math.abs(day) / 1000 / 60 / 60 / 24);

                finalTimeArr.push(theDay ? theDay : 0);

                if (theDay) {
                  zlsStartGet++;
                  zlsEnd = i; // 确定最后有时间的index
                }
                if (zlsStartGet === 1) {
                  zlsStart = zlsStartBefore;
                }
              }
              // 确定最后有时间的index  之前开发的存在问题

              // for (let i = finalNodeNum - 1; i >= 0; i--) {
              //   zlsEndBefore--
              //   let time = $('.node').eq(i).find('.concrete-time').text()

              //   let day = new Date(time)
              //   let theDay = parseInt(Math.abs(day) / 1000 / 60 / 60 / 24)

              //   if (theDay) {
              //     zlsEndGet++
              //   }
              //   if (zlsEndGet === 1) {
              //     zlsEnd = zlsEndBefore + 1
              //   }
              // }

              // 计算总历时
              let startDay = $(".node")
                .eq(zlsStart)
                .find(".concrete-time")
                .text();
              let endDay = $(".node")
                .eq(zlsEnd)
                .find(".concrete-time")
                .text();

              let zonglishiBefore = this.getDateDiff(startDay, endDay);
              let zonglishi = Boolean(zonglishiBefore) ? zonglishiBefore : 0;

              let zonglishiDom = `<div id="during-zls" class="during-time">
              <span class="name">总历时：<span class="num">${zonglishi}</span>天</span>
              <span class="point-arrow"></span>
            </div>`;
              $(".node")
                .eq(zlsStart)
                .find(".concrete-time")
                .before(zonglishiDom);
              let zlsEndId = $(".node")
                .eq(zlsEnd)
                .attr("id");

              // 总历时 - hover
              // let that = this
              // 审批时长 - hover
              let buchongArrLength = Object.keys(this.cdeBuchong).length;
              $("#during-zls").hover(
                function() {
                  if (Boolean(endDay)) {
                    $("#during-zls")
                      .parents(".node")
                      /* .removeClass('node-blue')
                .removeClass('node-green')
                .removeClass('node-green-blue') */
                      .addClass("node-green");

                    $("#during-zls")
                      .parents(".node")
                      .nextUntil("#" + zlsEndId)
                      /* .removeClass('node-blue')
                .removeClass('node-green')
                .removeClass('node-gray')
                .removeClass('node-green-blue') */
                      .addClass("node-green");

                    for (let i = 0; i < buchongArrLength; i++) {
                      $("#buchong-arr-" + i)
                        .find(".node")
                        /* .removeClass('node-blue')
                  .removeClass('node-green')
                  .removeClass('node-gray')
                  .removeClass('node-green-blue') */
                        .addClass("node-green");
                    }

                    $("#during-zls")
                      .parents(".node")
                      .siblings("#" + zlsEndId)
                      .removeClass("node-blue")
                      .removeClass("node-green")
                      .removeClass("node-gray")
                      .removeClass("node-green-blue")
                      .addClass("node-green-blue");
                  } else {
                    $("#during-zls")
                      .parents(".node")
                      .removeClass("node-blue")
                      .removeClass("node-green")
                      .removeClass("node-green-blue")
                      .addClass("node-green-blue");
                  }
                },
                function() {
                  if (Boolean(endDay)) {
                    $("#during-zls")
                      .parents(".node")
                      //.removeClass('node-blue')
                      .removeClass("node-green");
                    /* .removeClass('node-green-blue')
                .addClass('node-blue') */

                    $("#during-zls")
                      .parents(".node")
                      .nextUntil("#" + zlsEndId)
                      //.removeClass('node-blue')
                      .removeClass("node-green");
                    /* .removeClass('node-gray')
                .removeClass('node-green-blue')
                .addClass('node-blue') */

                    for (let i = 0; i < buchongArrLength; i++) {
                      if ($("#buchong-arr-" + i)) {
                        $("#buchong-arr-" + i)
                          .find(".node")
                          //.removeClass('node-blue')
                          .removeClass("node-green");
                        /* .removeClass('node-gray')
                    .removeClass('node-green-blue')
                    .addClass('node-blue') */
                      }
                    }

                    $("#" + zlsEndId)
                      .removeClass("node-blue")
                      .removeClass("node-green")
                      .removeClass("node-gray")
                      .removeClass("node-green-blue")
                      .addClass("node-blue");
                  } else {
                    $("#during-zls")
                      .parents(".node")
                      .removeClass("node-blue")
                      .removeClass("node-green")
                      .removeClass("node-green-blue")
                      .addClass("node-blue");
                  }
                }
              );
            });
          }
        })
        .catch(err => {
          console.log(err);
        })
        .then(this.handleHasPart) // 判定是否有时光轴这一PART
        .then(this.resetSomeStyles) // 获取数据后重置部分样式
        .then(this.shenpiDuring) // 计算左侧审批时长
        .then(this.buchongDuring) // 计算左侧补充审评时长
        .then(this.xinbaoDuring) // 计算左侧新报审评时长
        .then(this.paiduiDuring); // 计算左侧排队时长
      // .then(this.getNodeNum)
    },
    handleHasPart() {
      let hasPart = false;
      if (Object.keys(this.data).length !== 0) {
        hasPart = true;
      } else {
        hasPart = false;
      }
      // 向父组件传值
      this.$emit("emitTimeLine", hasPart);
    },
    // 加载页面时完善所需样式
    resetSomeStyles() {
      // 设置点下面的线的长度
      let heightArr = [];
      let nodeNum = $(".node").length;

      $(".node").each(function() {
        heightArr.push($(this).height());
      });
      $(".dot .line").each(function(index) {
        if (index === nodeNum - 1) {
          $(this).css({ height: 0 });
        } else {
          $(this).css({ height: heightArr[index] });
        }
      });
    },
    // getNodeNum () {
    //   let allNodeNum = $('.node').length
    // },
    shenpiDuring() {
      // NMPA 开始审批 => NMPA 审批完毕
      let cfdaDateMax = this.cfdaSpwb.date;
      let cfdaDateMin = this.cfdaShenpi.date;

      if (cfdaDateMax && cfdaDateMin) {
        let cfdaDateDiff = this.getDateDiff(cfdaDateMin, cfdaDateMax);
        this.duringSpsc = Number(cfdaDateDiff) + 1;
      }
    },
    buchongDuring() {
      // 补充 开始技术审评 => 完成技术审评
      let buChongNum = Object.keys(this.cdeBuchong).length;

      for (let i = 0; i < buChongNum; i++) {
        let bcDateMax = this.cdeBuchong[i].pingshenMax.date;
        let bcDateMin = this.cdeBuchong[i].pingshenMin.date;

        if (bcDateMax && bcDateMin) {
          let bcDateDiff = this.getDateDiff(bcDateMin, bcDateMax);

          this.buChongArr.push(Number(bcDateDiff) + 1);
        } else {
          this.buChongArr.push(0);
        }
      }
    },
    xinbaoDuring() {
      // 新报 开始技术审评 => 完成技术审评
      let xbDateMax = this.cdeXinbaoPinshenMax.date;
      let xbDateMin = this.cdeXinbaoPinshenMin.date;

      if (xbDateMax && xbDateMin) {
        let xbDateDiff = this.getDateDiff(xbDateMin, xbDateMax);

        this.duringXbspsc = Number(xbDateDiff) + 1;
      }
    },
    paiduiDuring() {
      let pdDateMax = this.cdeXinbaoPinshenMin.date;
      let pdDateMin = this.cdeXinbaoMin.date;
      if (pdDateMax && pdDateMin) {
        let pdDateDiff = this.getDateDiff(pdDateMin, pdDateMax);

        this.duringPdsc = Number(pdDateDiff) + 1;
      }
    }
  },
  created() {
    this.handleAxios();
  },
  beforeMount() {},
  mounted() {
    // 浏览器宽度变化等情况下，动态设置点下面的线的长度
    window.onresize = function() {
      let heightArr = [];
      let nodeNum = $(".node").length;

      $(".node").each(function() {
        heightArr.push($(this).height());
      });
      $(".dot .line").each(function(index) {
        if (index === nodeNum - 1) {
          $(this).css({ height: 0 });
        } else {
          $(this).css({ height: heightArr[index] });
        }
      });
    };
  }
};
</script>

<style lang="less">
@import "~@/assets/less/var.less";

.time-line {
  padding: 20px 0 20px 60px;
}
</style>
