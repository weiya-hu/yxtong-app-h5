<template>
  <div class="newProjectGuide" :style="{ display: display,'padding':'0px' }">
    <span class="newProjectGuide_prite">
      <slot></slot>
      <span
        v-if="showMenban"
        slot="reference"
        class="green tips"
        ref="tips_mengban"
        :id="'zjl_' + onlyKey"
        :style="{
          top: ((newPosition && newPosition.top) || -2) +'px',
          right: ((newPosition && newPosition.right) || -24) + (Ldanwei|| 'px'),
          position: position || 'absolute',
        }"
        @click.stop="handleClick"
      >
        <img src="/static/imgs/newProjectGuide/new.png" alt="" style="cursor: pointer;"/>
      </span>
    </span>
  </div>
</template>

<script>
import { Store } from "vuex";
export default {
  name: "newProjectGuide",
  data() {
    return {
      visible: false,
      allId: [],
      // showIdFirstDelet:"",
      dbname: "",
      datarunYDistance: 0,
      new_typeD: {
        3: "优化",
        2: "新增",
      },
      isMouseover: false // 用于判断鼠标是否移入到当前new标签(true移入，false移出)
    };
  },
  props: [
    "showMenban", // 是否展示弹框 boolean
    "initItem", // 传进来的值 对象
    "onlyKey", // 保证弹框唯一 字符串
    "display", // 弹框属性 字符串
    "compoentsName", //组件放的位置
    "projectName", // 当initItem。label 为空的时候
    "runYDistance", //y轴偏移量，主要是高级收索里面的内容
    "postion", // 埋点位置
    "newPosition",//new位置
    "Ldanwei", // 移动单位
    "position", //new定位方式
    "isClick", // 是否有点击事件
  ],
  mounted() {
    this.$nextTick(()=> {
      setTimeout(()=> {
        this.setInit();
      },1000)
    })
  },
  watch: {
    onlyKey(){
      // this.$nextTick(()=> {
        this.setInit();
      // })
    }
  },
  methods: {
    // 鼠标点击事件
    handleClick() {
      // isClick为false时禁止点击事件
      if (this.isClick === false) return
      let path = this.$route.path.split('/')[1]
      // 取出本地存储已经引导过的new标签id数组
      let arr = JSON.parse(localStorage.getItem(this.$route.params.dbname ? this.$route.params.dbname : path))
      if(arr) {
        // 根据当前移入的new标签的id找到对应的数组下标
        let index = arr.indexOf(this.onlyKey)
        // 判断下标是否为-1，如果不为-1删除当前的下标对应的id
        index !== -1 ? arr.splice(index,1) : ''
        // 将新数组重新存储到本地local
        localStorage.setItem(this.$route.params.dbname ? this.$route.params.dbname : path ,JSON.stringify(arr))
        // 鼠标移入将isMouseover赋值为true,用于改变鼠标移入的样式
        this.isMouseover = true
        // 调用弹出提示框的具体方法
        this.setInit()
      }
    },

    setInit(){
      if (this.onlyKey && this.showMenban) {

        this.runYDistance ? (this.datarunYDistance = this.runYDistance) : "";
        // console.info(this.onlyKey)
        // console.info(JSON.stringify())
        this.$nextTick(()=> {
          let getBoundingClientRect = this.$refs.tips_mengban.getBoundingClientRect();
          // console.info(getBoundingClientRect.left &&
          //   getBoundingClientRect.top &&
          //   getBoundingClientRect.right)
          if (
            getBoundingClientRect.left &&
            getBoundingClientRect.top &&
            getBoundingClientRect.right
          ) {
            let id = this.onlyKey;
            let dbname = this.$route.params.dbname ? this.$route.params.dbname : this.$route.path.split('/')[1];
            this.dbname = dbname;
            let dbnameLocal = this.getLocalStore(dbname);
            let NoShowIdArr = dbnameLocal ? dbnameLocal : [];
            let first = this.getItemVal("first");

            if (!NoShowIdArr.includes(id)) {
              //判断弹框展示与不展示
              // if (!first) {
              //防止dom渲染定位错误
              setTimeout(() => {
                this.setDomfunc(id);
              }, 500);
              // } else {
              //   this.setDomfunc(id);
              // }
            }
          }
        })
      }
    },
    setDomfunc(id) {
      this.setItemVal(id, "set");
      if ($(`#${id}`).length == 0) {
        this.creatTips(id);
      }
    },
    showMenbanTips(val) {
      //显示数组为的第一个值的弹框
      let _this = this;
      let first = this.getItemVal("first").val;
      // console.info(val , first)
      if (val == first) {
        let dom = $(`#${first}`);
        if (!dom) {
          return false;
        } else {
          // let zjl_All_mengban = $(`#zjl_All_mengban`);
          if ($(`#zjl_All_mengban`).length == 0) {
            $("#app").append(
              $(
                `<div id="zjl_All_mengban" class="zjl_All_mengban" style="background: ${this.isMouseover === true ? 'rgba(0, 0, 0, 0)': 'rgba(0, 0, 0, 0.5)'}"></div>`
              )
            );
            // setTimeout(()=>{
            let zjl_All_mengbanLi = $(`#zjl_All_mengban`);
            zjl_All_mengbanLi.show();
            zjl_All_mengbanLi.click(function () {
              // console.info($(".newProjectGuide_show:visible .close"));
              $(".newProjectGuide_show:visible .close").click();
              // if(!_this.getItemVal("first").val){
              //   $(this).hide();
              // }
            });
            // },100)
            dom.show();
          } else {
            $(`#zjl_All_mengban`).show();
          }
        }
      } else {
        return false;
      }
    },
    creatTips(id) {
      //创建弹框
      let _this = this;
      let tips_mengban = this.$refs.tips_mengban;
      let positon = tips_mengban.getBoundingClientRect();
      let time = new Date().getTime();
      let $_tips_mengban = $(tips_mengban);
      // console.info(JSON.stringify(tips_mengban.getBoundingClientRect()));
      // height 弹出框初始基础高度
      let height = 206
      // console.log((this.initItem.new_content.length-32)/16)
      // 暂时使用 通过字符串长度动态设置弹出框的初始高度 (因为弹出框容器的宽度是定死的，所以能确定一行显示16个字符，初始height为205包含两行字符的高度，所以在记录商数的时候要用new_content的长度先减去32再去除以16取商数quotient)
      let quotient = (this.initItem.new_content.length-32) / 16
      console.log(quotient,this.initItem.new_content.length)
      if (quotient>0 && quotient<=1) {
        // 当quotient在大于0且小于等于1的时候，在初始弹窗的205基础上加一行的高度为20
        height = height + 20
      }else if (quotient>1 && quotient<=2) {
        // 当quotient在大于1且小于等于2的时候，在初始弹窗的205基础上加两行的高度为20*2
        height = height + 20*2
      }else if (quotient>2 && quotient<=3) {
        // 当quotient在大于2且小于等于3的时候，在初始弹窗的205基础上加三行的高度为20*3
        height = height + 20*3
      }else if (quotient>3) {
        // 当quotient在大于3的时候，在初始弹窗的205基础上加四行的高度为20*4
        height = height + 20*4
      }
      let posiFuncNow = _this.setTipPosition(
        {
          clientWidth: document.body.clientWidth || window.screen.availWidth,
          clientHeight: document.body.clientHeight || window.screen.availHeight,
        },
        positon,
        {
          width: 235,
          height: height,
        }
      );
      let posiFunc = null;

      try {
        //为了弹框移动
        let domPosition = localStorage.getItem("domPosition");
        let newProjectGuideArrD = _this.getLocalStore("newProjectGuideArr");
        let newProjectGuideArrLength = newProjectGuideArrD
          ? newProjectGuideArrD.length
          : 0;
        localStorage.setItem("domPosition", JSON.stringify(posiFuncNow));
        if (domPosition && newProjectGuideArrLength > 1) {
          posiFunc = JSON.parse(domPosition);
        } else {
          posiFunc = posiFuncNow;
          // localStorage.setItem("domPosition",'')
        }
      } catch (error) {
        console.log(error);
        posiFunc = posiFuncNow;
      }

      // _this.setPosition
      // console.info(posiFunc, id);
      const {
        initItem,
        new_typeD,
        compoentsName,
        projectName,
        datarunYDistance,
      } = _this;
      $("#app").append(`
        <div id="${id}" class="zjl_tips newProjectGuide_show">
          <div style="transform:translate(${posiFunc.left}px, ${
        posiFunc.top + datarunYDistance
      }px);box-shadow: ${this.isMouseover ? '0px 1px 5px 2px rgba(82, 92, 255, 0.15)' : 'unset'}" class="zjl_tips_c newProjectGuide_context">
            <div class="context">
              <div class="closeX zjl_tipsClose_${time}"><img style="margin-top:2px" src="/static/imgs/newProjectGuide/close.png" alt=""/></div>
              <div class="flex">
                <div><img src="/static/imgs/newProjectGuide/${initItem.new_type == 3 ? 'good':'add'}.png" alt=""/></div>
                <div class="gryName add">${new_typeD[initItem.new_type]}：</div>
              </div>
              <div class="flex italic">
                <div class="blueName" title="${initItem.label}">${initItem.label || projectName} &nbsp;</div>
                <div class="gryName selectWt">${compoentsName}</div>
              </div>
              <div class="text">
                ${initItem.new_content}
              </div>
            </div>
            <div class="context_btn">
              <span class="btnLeft" id="zjl_runClose_${time}">跳过</span>
              <button class="close zjl_tipsClose_${time}">好的</button>
            </div>
          </div>
          <div class="single" style="transform:translate(${posiFunc.xS}px, ${
        posiFunc.yS + datarunYDistance
      }px)  rotate(45deg);box-shadow: ${this.isMouseover ? '0px 1px 5px 2px rgba(82, 92, 255, 0.15)' : 'unset'}"></div>
        </div>
      `);
      // if(id)
      $(`#zjl_runClose_${time}`).click(function () {
        //点击调过
        try {
          let arr = _this.getLocalStore("newProjectGuideArr");
          if (!arr) {
            return;
          } else {
            arr.forEach((val, index) => {
              _this.setLocalItem(_this.dbname, val);
            });
            let showIdFirstDelet = localStorage.getItem("showIdFirstDelet");
            _this.setLocalItem(_this.dbname, showIdFirstDelet);
            // ga("send","event", "button", "click", "zhuce_"+_this.compoentsName+"_close")
            ga(
              "send",
              "event",
              "button",
              "click",
               _this.dbname+"_" + _this.postion + "_skip"
            );
            _paq.push([
              "trackEvent",
              "button",
              "click",
               _this.dbname+"_" + _this.postion + "_skip",
            ]);
          }
          _this.removeAllTips();
        } catch (error) {
          _this.removeAllTips();
        }
        this.isMouseover = false
      });

      $(`.zjl_tipsClose_${time}`).click(function () {
        try {
          // console.info(123);
          _this.setLocalItem(_this.dbname, id);
          ga(
            "send",
            "event",
            "button",
            "click",
            _this.dbname+"_" + _this.postion + "_close"
          );
          _paq.push([
            "trackEvent",
            "button",
            "click",
             _this.dbname+"_" + _this.postion + "_close",
          ]);
          $(`#${id}`).hide(100);
          let arr = _this.setItemVal(id, "del");
          // console.info(arr);
          let ShowId = _this.getItemVal();
          // _this.showIdFirstDelet= ShowId.val;
          localStorage.setItem("showIdFirstDelet", ShowId.val);
          // _this.setLocalItem(_this.dbname, _this.showIdFirstDelet);
          if (!ShowId.arr.length && !ShowId.val) {
            $(`#zjl_All_mengban`).hide(100);
          }
          if (ShowId.val) {
            // setTimeout(()=>{
            let posi = null;
            let setPosi = function (needVal) {
              let posiLi = null;
              let needDom = document.getElementById(`zjl_${needVal.val}`);
              if (needDom) {
                return (posiLi = needDom.getBoundingClientRect());
              } else {
                let getItemVal = _this.getItemVal();
                if (!getItemVal.arr.length && !getItemVal.val) {
                  $(`#zjl_All_mengban`).hide(100);
                  return false;
                }
                setPosi(getItemVal);
              }
            };
            posi = setPosi(ShowId);
            if (!posi) {
              return;
            }

            let showDom = $(`#${ShowId.val}`);
            showDom.show();

            let zjl_tips_c = $(`#${ShowId.val} .zjl_tips_c`)[0];
            let zjl_tips_cObj = {
              width: zjl_tips_c.clientWidth,
              height: zjl_tips_c.clientHeight,
            };
            let posiFunc = _this.setTipPosition(
              {
                clientWidth: document.body.clientWidth,
                clientHeight: document.body.clientHeight,
              },
              posi,
              zjl_tips_cObj
            );

            $(zjl_tips_c).css({
              transform: `translate(${posiFunc.left}px, ${posiFunc.top}px)`,
            });
            $(`#${ShowId.val} .single`).css({
              transform: `translate(${posiFunc.xS}px, ${posiFunc.yS}px) rotate(45deg)`,
            });
          } else {
            _this.removeAllTips();
          }
        } catch (error) {
          _this.removeAllTips();
        }
        this.isMouseover = false
      });

      _this.showMenbanTips(id);
    },
    setTipPosition(client, domInfo, showDomInfo) {
      //动态计算位置函数
      //位置设置
      let posi = {};
      console.info(client, domInfo, showDomInfo);
      let flag = true;
      if (domInfo.right + showDomInfo.width > client.clientWidth) {
        if (domInfo.right > client.clientWidth) {
          posi.left = client.clientWidth - showDomInfo.width - 10;
          posi.xS = client.clientWidth - 26;
          flag = false;
        } else {
          posi.left = domInfo.left - showDomInfo.width - 10;
          posi.xS = domInfo.left - 26;
          flag = false;
        }
      } else {
        posi.left = domInfo.right + 10;
        posi.xS = domInfo.right + 6;
      }

      if (domInfo.bottom + showDomInfo.height >= client.clientHeight) {
        if (domInfo.bottom > client.clientHeight) {
          posi.top = client.clientHeight - showDomInfo.height - 10;
          posi.yS = client.clientHeight - 26;
        } else {
          posi.top = domInfo.top - showDomInfo.height - 10;
          posi.yS = domInfo.top - 26;
        }
        if (flag) {
          posi.left = posi.left - 80;
          posi.xS = posi.xS - 26;
        } else {
          posi.left = posi.left + 80;
          posi.xS = posi.xS + 26;
        }
      } else {
        posi.top = domInfo.top - 10;
        posi.yS = domInfo.top;
      }
      console.log(posi)
      return posi;
    },
    getLocalStore(name) {
      let newProjectGuideArr = localStorage.getItem(name);
      if (!newProjectGuideArr) {
        return false;
      } else {
        newProjectGuideArr = JSON.parse(newProjectGuideArr);
      }
      return newProjectGuideArr;
    },
    getItemVal(flag) {
      //获取newProjectGuideArr的值
      //获取local里面的值
      let newProjectGuideArr = this.getLocalStore("newProjectGuideArr");
      // console.log(newProjectGuideArr)
      if (!newProjectGuideArr) {
        return false;
      }
      // // 因获取到的id数组是根据页面数据渲染的优先顺序，不符合产品规定的 (基础搜索->热点搜索->条件筛选->列表字段)顺序，所以需要单独处理排序
      // let normal = [] // 接受基础搜索id
      // let hot = [] // 接收热点搜索id
      // let filter = [] // 接收条件搜索id
      // let tableconf = [] // 接收列表字段id
      // newProjectGuideArr.map(item=> {
      //   if (item.indexOf('normal') !== -1) {
      //     normal.push(item)
      //   } else if (item.indexOf('hot') !== -1) {
      //     hot.push(item)
      //   } else if (item.indexOf('filter') !== -1) {
      //     filter.push(item)
      //   } else if (item.indexOf('tableconf') !== -1) {
      //     tableconf.push(item)
      //   }
      // })
      // // console.log(normal, hot, filter, tableconf)
      // newProjectGuideArr = [...normal, ...hot, ...filter, ...tableconf]
      // console.log(newProjectGuideArr)
      let val = null;
      if (flag == "first") {
        val = newProjectGuideArr[0];
      } else {
        val = newProjectGuideArr.shift();
        localStorage.setItem(
          "newProjectGuideArr",
          JSON.stringify(newProjectGuideArr)
        );
      }
      return {
        val,
        arr: newProjectGuideArr,
      };
    },
    setLocalItem(name, val) {
      let newProjectGuideArr = this.getLocalStore(name);
      if (!newProjectGuideArr) {
        newProjectGuideArr = [];
      }

      if (newProjectGuideArr.includes(val)) {
        return;
      } else {
        newProjectGuideArr.push(val);
        localStorage.setItem(name, JSON.stringify(newProjectGuideArr));
      }
    },
    setItemVal(val, flag) {
      //设置local里面的值
      let newProjectGuideArr = this.getLocalStore("newProjectGuideArr");
      if (!newProjectGuideArr) {
        newProjectGuideArr = [];
      }

      if (flag == "set" && val) {
        if (!newProjectGuideArr.includes(val)) {
          newProjectGuideArr.push(val);
        }
      } else if (flag == "del") {
        newProjectGuideArr = newProjectGuideArr.filter((item, key) => {
          return item != val;
        });
      }else{
        return
      }

      localStorage.setItem(
        "newProjectGuideArr",
        JSON.stringify(newProjectGuideArr)
      );

      return newProjectGuideArr;
    },
    removeAllTips() {
      $(".newProjectGuide_show").remove();
      $("#zjl_All_mengban").remove();
      localStorage.setItem("newProjectGuideArr", JSON.stringify([]));
    },
  },
};
</script>

<style lang="less" scope>
.newProjectGuide {
  .newProjectGuide_prite {
    position: relative;
    .tips {
      position: absolute;
      top: 2px;
      right: -24px;
      height: 12px;
      line-height: 12px !important;
    }
  }
}
.newProjectGuide_show {
  display: none;
  .newProjectGuide_context {
    transition: 0.5s;
    background: white;
    position: fixed;
    z-index: 4001;
    width: 235px;
    // height: 207px;
    background-color: #ffffff;
    border-radius: 4px;
    height: auto;
    padding: 20px 15px;
    box-sizing: border-box;
    .context {
      width: 100%;
      position: relative;
      // overflow: hidden;
      padding-top: 10px;
      .closeX {
        position: absolute;
        width: 20px;
        height: 20px;
        text-align: center;
        line-height: 20px;
        right: 0px;
        top: 0px;
        cursor: pointer;
      }
      .flex {
        display: flex;
        .blueName {
          font-size: 18px;
          font-style: italic;
          font-weight: bold;
          letter-spacing: 0px;
          color: #225ef6;
          max-width: 108px;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
        .selectWt {
          padding-top: 5px;
          margin-left: 5px;
        }
        .italic {
          font-style: italic;
        }
        .add {
          font-size: 16px;
          margin-left: 3px;
        }
        .gryName {
          font-size: 14px;
          font-weight: normal;
          letter-spacing: 0px;
          color: #545b6d;
          font-style: italic;
        }
      }
      .text {
        margin: 10px 0;
        border-top: solid 1px #dfe5f1;
        padding: 10px 0px 10px;
        font-size: 14px;
        line-height: 20px;
        color: #717a91;
        min-height: 61px;
        max-height: 141px;
        overflow-y: auto;
        overflow-x: hidden;
        box-sizing: border-box;
      }
    }

    .context_btn {
      .btnLeft {
        float: left;
        font-size: 14px;
        font-weight: normal;
        font-stretch: normal;
        line-height: 21px;
        letter-spacing: 0px;
        color: #999999;
        cursor: pointer;
      }
      .close {
        float: right;
        width: 56px;
        height: 24px;
        background-color: #225ef6;
        border-radius: 4px;
        font-size: 12px;
        line-height: 24px;
        color: #ffffff;
        border: none;
      }
    }
  }
  .single {
    transition: 0.5s;
    position: fixed;
    width: 20px;
    height: 20px;
    // transform: rotate(90deg);
    background: white;
    z-index: 4000;
  }
}
.zjl_All_mengban {
  position: fixed;
  display: none;
  z-index: 3999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
}
.newProjectGuide {
  display: inline;
  padding-left: 0px;
  .green {
    color: #90c31f;
  }
}
</style>
