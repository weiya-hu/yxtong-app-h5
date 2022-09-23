<template>
  <div class="companyfilter-gsxx">
    <div class="content-title">企业概览</div>
    <div class="qygl" v-if="business && business.overview">
      <!-- 电话、邮箱、网址、地址 -->
      <div class="qygl-box">
        <div class="box-info">
          <span class="title">电话：</span>
          <span class="text">{{ business.overview.phone || "-" }}</span>
        </div>

        <div class="box-info">
          <span class="title">邮箱：</span>
          <span class="text">{{ business.overview.email || "-" }}</span>
        </div>

        <div class="box-info">
          <span class="title">网址：</span>
          <span class="text">
            <a
              :href="
                business.overview.url.indexOf('http') > -1
                  ? business.overview.url
                  : 'http://' + business.overview.url
              "
              v-if="business.overview.url"
              target="_blank"
              >{{ business.overview.url }}</a
            >
            <span v-else>-</span>
          </span>
        </div>

        <div class="box-info">
          <span class="title">地址：</span>
          <span class="text">{{ business.overview.dizhi || "-" }}</span>
        </div>
      </div>
      <div class="box-jianjie">
        <input id="exp1" class="exp" type="checkbox" />
        <span class="title">简介：</span>
        <span class="text">
          <label class="btn" for="exp1"></label>
          {{ business.overview.qiyejianjie || "-" }}
        </span>
      </div>
    </div>

    <!-- 工商注册信息 -->
    <div class="gsxx-title">工商注册信息</div>
    <table class="tb-t" v-if="business && business.registration">
      <tr>
        <td>企业名称</td>
        <td>
          <span>{{ business.registration.qiyemingcheng || "-" }}</span>
        </td>
        <td>统一社会信用代码</td>
        <td>
          <span>{{ business.registration.xinyongdaima || "-" }}</span>
        </td>
      </tr>
      <tr>
        <td>法定代表人</td>
        <td>
          <span>{{ business.registration.faren || "-" }}</span>
        </td>
        <td>经营状态</td>
        <td>
          <span>{{ business.registration.zhuangtai || "-" }}</span>
        </td>
      </tr>
      <tr>
        <td>成立日期</td>
        <td>
          <span>{{ business.registration.chengliriqi || "-" }}</span>
        </td>
        <td>行政区划</td>
        <td>
          <span v-if="business.registration.shengfen || business.registration.chengshi"
            >{{ business.registration.shengfen
            }}{{ business.registration.chengshi }}</span
          >

          <span v-else>-</span>
        </td>
      </tr>
      <tr>
        <td>注册资本</td>
        <td>
          <span>{{ business.registration.zhucezibenyuanshi || "-" }}</span>
        </td>
        <td>企业类型</td>
        <td>
          <span>{{ business.registration.qiyeleixing || "-" }}</span>
        </td>
      </tr>
      <tr>
        <td>所属行业</td>
        <td>
          <span>{{ business.registration.hangye || "-" }}</span>
        </td>
        <td>工商注册号</td>
        <td>
          <span>{{ business.registration.gongshangzhuceid || "-" }}</span>
        </td>
      </tr>
      <tr>
        <td>组织机构代码</td>
        <td>
          <span>{{ business.registration.zuzhijiegoudaima || "-" }}</span>
        </td>
        <td>纳税人识别号</td>
        <td>
          <span>{{ business.registration.nashuishibiehao || "-" }}</span>
        </td>
      </tr>
      <tr>
        <td>曾用名</td>
        <td>
          <span>{{ business.registration.qiyezengyongming || "-" }}</span>
        </td>
        <td>参保人数</td>
        <td>
          <span>{{
            business.registration.canbaorenshu > 0
              ? business.registration.canbaorenshu
              : "-" || "-"
          }}</span>
        </td>
      </tr>
      <tr>
        <td>经营范围</td>
        <td colspan="3">
          <span>{{ business.registration.jingyingfanwei || "-" }}</span>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  props: {
    business: {
      type: Object,
    },
  },
  data() {
    return {};
  },
  watch: {},
  methods: {},
  created() {},
  mounted() {},
};
</script>

<style lang="less">
@import "~@/assets/less/var.less";

.companyfilter-gsxx {
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
              color: #4877E8;
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
          box-shadow: inset calc(100px - 999vw) calc(30px - 999vw) 0 0 #fafbfd;
          margin-left: -100px;
        }
      }

      .btn {
        float: right;
        clear: both;
        margin-left: 10px;
        font-size: 14px;
        color: #4877E8;
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
</style>
