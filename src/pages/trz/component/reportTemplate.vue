<template>
  <div id="pdfbox">
    <div class="menu">
      <h1 class="trz-title">
        {{ basic.title }}
      </h1>
      <ul class="trz-menu">
        <li v-if="Object.values(basic).length > 0" class="trz-menu-item">
          <div class="title">行业数据概览</div>
          <div class="trz-container">
            <div class="newtotals-scroll clearfix">
              <ul class="total-item fl">
                <li class="li1">事件</li>
                <li class="li2">
                  总计
                  <span>{{ basic.event.current_total }}</span
                  >件
                </li>
                <li class="li3" v-html="basic.event.month_on_month_str"></li>
              </ul>
              <ul class="total-item fl">
                <li class="li1">金额</li>
                <li class="li2">
                  总计
                  <span>{{ basic.amount.current_total }}</span
                  >{{ basic.amount.unit }}
                </li>
                <li class="li3" v-html="basic.amount.month_on_month_str"></li>
              </ul>
              <ul class="total-item fl">
                <li class="li1">企业</li>
                <li class="li2">
                  总计
                  <span>{{ basic.company.current_total }}</span
                  >家
                </li>
                <li class="li3" v-html="basic.company.year_on_year_str"></li>
              </ul>
              <ul class="total-item fl">
                <li class="li1">机构</li>
                <li class="li2">
                  总计
                  <span>{{ basic.jigou.current_total }}</span
                  >家
                </li>
                <li class="li3" v-html="basic.jigou.year_on_year_str"></li>
              </ul>
              <ul class="total-item fl">
                <li class="li1">地区</li>
                <li class="li2">
                  总计
                  <span>{{ basic.province.current_total }}</span
                  >个
                </li>
                <li class="li3" v-html="basic.province.year_on_year_str"></li>
              </ul>
              <ul class="total-item fl">
                <li class="li1">行业</li>
                <li class="li2">
                  总计
                  <span>{{ basic.industries.current_total }}</span
                  >个
                </li>
              </ul>
              <ul class="total-item fl">
                <li class="li1">关键词</li>
                <li class="li2">
                  总计
                  <span>{{ basic.keywords.current_total }}</span
                  >个
                </li>
                <li class="li3" v-html="basic.keywords.year_on_year_str"></li>
              </ul>
            </div>
            <div
              class="describe"
              style="margin-bottom: 40px"
              v-html="basic.describe"
            ></div>
          </div>
        </li>
        <li v-if="ztqsShow" class="trz-menu-item">
          <div class="title">{{ ztqsTitle }}</div>
        </li>
        <li v-if="hyfbShow" class="trz-menu-item">
          <div class="title">行业分布概况</div>
        </li>
        <li v-if="gjcfbShow" class="trz-menu-item">
          <div class="title">关键词分布概况</div>
        </li>
        <li v-if="lcfbShow" class="trz-menu-item">
          <div class="title">轮次分布概况</div>
        </li>
        <li class="trz-menu-item">
          <div class="title">时间分布情况</div>
        </li>
        <li v-if="sjInHYAndLCfbShow" class="trz-menu-item">
          <div class="title">事件在行业与轮次的分布情况</div>
        </li>
        <li v-if="sjgmzbShow" class="trz-menu-item">
          <div class="title">事件规模占比情况</div>
        </li>
        <li v-if="dyfbShow" class="trz-menu-item">
          <div class="title">地域分布情况</div>
        </li>
        <li v-if="rzqyShow" class="trz-menu-item">
          <div class="title">融资企业榜单</div>
        </li>
        <li v-if="tzjgShow" class="trz-menu-item">
          <div class="title">投资机构榜单</div>
        </li>
        <li v-if="IPOKeywordShow" class="trz-menu-item">
          <div class="title">IPO热门关键词</div>
        </li>
      </ul>
    </div>
    <!-- 底部 -->
    <div class="footer">
      <div class="slogen">
        药智咨询提供医药行业市场解读、前景预估等咨询服务，欢迎垂询。
      </div>
      <div class="avatar-container clearfix">
        <div class="avatar-item fl clearfix">
          <img src="~@/assets/imgs/trz/tianjuan-avatar.png" class="avatar fl" />
          <div class="info fl">
            <div style="margin-bottom: 14px">
              <span class="name">田娟</span>
              <span class="office">商务总监</span>
            </div>
            <p class="company">重庆药智企业管理咨询有限公司</p>
            <div class="phone">
              <span>17318481316</span>
              <span>13350326061</span>
            </div>
            <p class="email">tianjuan@yaozh.com</p>
          </div>
          <img src="~@/assets/imgs/trz/tianjuan-qrcode.png" class="qrcode fl" />
        </div>
        <div class="line fl"></div>
        <div class="avatar-item fr clearfix">
          <img
            src="~@/assets/imgs/trz/xujianhua-avatar.png"
            class="avatar fl"
          />
          <div class="info fl">
            <div style="margin-bottom: 14px">
              <span class="name">许建华</span>
              <span class="office">市场总监</span>
            </div>
            <p class="company">重庆药智企业管理咨询有限公司</p>
            <div class="phone">
              <span>15730336280</span>
            </div>
            <p class="email">xujianhua@yaozh.com</p>
          </div>
          <img
            src="~@/assets/imgs/trz/xujianhua-qrcode.png"
            class="qrcode fl"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    "basic",
    "ztqsShow",
    "ztqsTitle",
    "hyfbShow",
    "gjcfbShow",
    "lcfbShow",
    "sjInHYAndLCfbShow",
    "sjgmzbShow",
    "dyfbShow",
    "rzqyShow",
    "tzjgShow",
    "IPOKeywordShow",
  ],
};
</script>

<style scoped lang="less">
#pdfbox {
  width: 1200px;
}
.menu {
  text-align: center;
  padding: 0;
  .trz-title {
    font-size: 30px;
    margin: 0;
    height: 120px;
    line-height: 120px;
    background-color: #152261;
    color: #fff;
  }
  .trz-menu {
    .trz-menu-item {
      border: 1px solid transparent;
      .title {
        font-size: 24px;
        color: #0d1a62;
        font-weight: bold;
        margin: 40px auto 20px auto;
      }
    }
  }
}
.clearfix::after {
  display: table;
  clear: both;
  content: "";
}
.fl {
  float: left;
}
.fr {
  float: right;
}
.footer {
  background-color: #050e40;
  padding-top: 20px;
  height: 213px;
  .slogen {
    text-align: center;
    height: 28px;
    line-height: 28px;
    font-size: 20px;
    font-weight: 600;
    color: #ffffff;
    margin-bottom: 38px;
  }
  .avatar {
    width: 96px;
    height: 96px;
    margin-right: 18px;
  }
  .qrcode {
    width: 85px;
    height: 84px;
  }
  .info {
    margin-right: 40px;
    color: #fff;
    .name {
      height: 20px;
      line-height: 20px;
      font-size: 20px;
      font-weight: 600;
      color: #ffffff;
      margin-right: 10px;
    }
    .office {
      height: 14px;
      line-height: 14px;
      font-size: 14px;
      font-weight: 400;
      color: #ffffff;
    }
    .company {
      height: 14px;
      line-height: 14px;
      font-size: 14px;
      font-weight: 600;
      color: #ffffff;
      margin-bottom: 6px;
    }
    .phone {
      height: 14px;
      font-size: 14px;
      font-weight: 300;
      color: #ffffff;
      line-height: 14px;
      margin-bottom: 4px;
    }
    .email {
      height: 13px;
      line-height: 13px;
      font-size: 14px;
      font-weight: 300;
      color: #ffffff;
    }
  }
  .line {
    width: 1px;
    height: 105px;
    background: #49537f;
    margin-left: 75px;
  }
  .avatar-item {
    margin: 0 50px;
  }
}
.newtotals-scroll {
    background: #f6f8fc;
    overflow: hidden;
    position: relative;
    margin-bottom: 20px;
    .total-item {
      width: 150px;
      margin: 0 10px;
    }
}
</style>