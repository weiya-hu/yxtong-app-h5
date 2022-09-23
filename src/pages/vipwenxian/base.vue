<template>
    <div>
        <!-- 自定义加载界面 -->
        <LoadingGif :loadFlag="isLoading" v-if="isLoading"></LoadingGif>
        <!-- 加载完成显示部分 -->
        <div class="main-wrap" v-else>
            <MainTop :title="title" :countShow="false"/>

            <div class="detail-type-sections">
              <!-- {{permission}} -->
                <div class="detail-type" v-for="(item, index) in othervipcategory" :key="index" >
                    <div class="header">
                        <div class="add-border"></div>
                        <div class="lc">{{item.name}}</div>
                    </div>
                    <div class="content" >
                      <span v-for="(children, index) in item.children" :key="index">
                        <router-link v-if="children.select == 2" tag='a' :changedata="permission.length" :to="permission.includes(children.name)?{path: `/literature/detail/${item.id}?cur=${children.id}&name=${item.name}`}:'#'" :target="permission.includes(children.name)?'_blank':'_self'" :class="permission.includes(children.name) ? '' : 'abandon-click-method'" >{{children.name}}</router-link>
                        <a  v-if="children.select == 1" :href="permission.includes(children.name)?children.textarea:'#'" :target="permission.includes(children.name)?'_blank':'_self'" :class="permission.includes(children.name) ? '' : 'abandon-click-method'" @click="handle('ebsco')">{{children.name}}</a>
                      </span>
                    </div>
                </div>
                <!-- <div class="detail-type" >
                    <div class="header">
                        <div class="add-border"></div>
                        <div class="lc">国外期刊文献数据库</div>
                    </div>
                    <div class="content" >
                        <a :href="permission.includes('EBSCO数据库')?'https://www.ebsco.com/':'#'" :target="permission.includes('EBSCO数据库')?'_blank':'_self'" :class="permission.includes('EBSCO数据库') ? '' : 'abandon-click-method'" @click="handle('ebsco')">EBSCO数据库</a>

                    </div>
                </div>
                <div class="detail-type" >
                    <div class="header">
                        <div class="add-border"></div>
                        <div class="lc">其他数据库入口</div>
                    </div>
                    <div class="content" >
                        <router-link  tag='a' :to="permission.includes('国内外批准新药查询')?{path: '/literature/other'+'?'+1}:'#'" :target="permission.includes('国内外批准新药查询')?'_blank':'_self'" :class="permission.includes('国内外批准新药查询') ? '' : 'abandon-click-method'">国内外批准新药查询</router-link>
                    </div>
                </div> -->
            </div>
            <div class="footer">
                <p><i class="el-icon-warning cl-green pr5"></i>帮助为了您更好的查询，如以上数据库用户名和密码不能登录，请及时与我们联系，电话：<span>023-62988285</span> <a href="tencent://message/?uin=2102176267&Site=&Menu=yes">客服QQ</a>或发邮件至<a href="mailto:yaozh99@163.com?subject=邮件标题&body=邮件内容">yaozh99@163.com</a></p>
                <p>如果出现页面打不开的情况，请尝试清空浏览器数据，方法见<a href="https://jingyan.baidu.com/article/8065f87fc59f1723312498f1.html" target="_blank">清空浏览器数据</a></p>
            </div>
            <!-- <router-view></router-view> -->
        </div>
    </div>
</template>

<script>
import LoadingGif from '@/components/common/globalCom/loading-gif'
import MainTop from '@/components/common/main-top'
import { mapState } from 'vuex'

export default {
    data(){
        return{
            title: "文献"
        }
    },
    components: {
        LoadingGif,
        MainTop,
    },
    computed: {
    ...mapState({
        permission: state => state.Vipwenxian.permission,
        othervipcategory: state => state.Vipwenxian.othervipcategory,
        isLoading: state => state.Vipwenxian.isLoading,
      }),
    },

    methods:{


        handle(a){
            // console.log(a)
            window.ga("send", "event", "button", "vip_qiyeban",a)
            window._paq.push(['trackEvent', 'button', 'vip_qiyeban',a, ])

        }
    },
    created(){
        this.$store.commit("Vipwenxian/accesstoken",this.vueGetCookie("accesstoken"));
        this.$store.dispatch("Vipwenxian/getOthervipcategory")
        setTimeout(() => {
            const hashLocation= sessionStorage.getItem("hashLocation");//缓存中获取当前页面的路由名称
            // 注意, 这里使用全路径匹配,在hash模式中,因为地址会携带#,所以页面报告中的url需要重新覆盖一下, 将#去除
            window._paq.push(['setCustomUrl', "https://" + hashLocation]);//覆盖页面报告的url，可以自定义页面url，加上本页面路由
            window._paq.push(['trackPageView', '文献']);//页面名称,可以自定义页面名称
            window._paq.push(['setDocumentTitle', '文献'])
        }, 1000);
    },
    updated(){
        this.vueTogglePmsTooltip()
    },
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/app.less";
@import "~@/assets/less/var.less";
.main-wrap{
    width: 100%;
    padding: 0 10px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    .detail-type-sections{
        .detail-type{
            margin-bottom: 10px;
            box-shadow: 0px 0px 5px #c4d3f8;
            &:hover{
                box-shadow: 0px 0px 10px 2px #c4d3f8;
            }
            &:hover .header .lc{
                color: @PrimaryColor;
            }
            .header {
                width: 100%;
                height: 40px;
                line-height: 40px;
                background: @PrimaryBackgroundColor;
                position: relative;
                .add-border {
                    position: absolute;
                    left: 0;
                    top: 0;
                    height: 100%;
                    width: 4px;
                    background: transparent;
                    border-radius: 2px;
                }
                .lc {
                    display: inline-block;
                    font-weight: bold;
                    font-size: 16px;
                    margin-left: 20px;
                    color: #545b6d;
                }
            }
            .content{
                background:#fff;
                a{
                    display:inline-block;
                    width:170px;
                    text-align:center;
                    font-size:13px;
                    height:30px;
                    line-height:30px;
                    border-radius:30px;
                    border:1px solid @PrimaryColor;
                    margin:35px 30px 45px 0;
                    color:@PrimaryColor;
                    cursor:pointer;
                    &:first-child{
                        margin-left:100px;
                    }
                    &:hover{
                        color:#fff;
                        background:@PrimaryColor;
                    }
                }
                .abandon-click-method{
                    border:1px solid #c0c4cc !important;
                    &:hover{
                        background:#fff;
                    }
                }
            }
        }
    }
    .footer{
        color: #545b6d;
        font-size:13px;
        margin-top:20px;
        p{

            line-height:20px;
            margin:0;
            margin-left:20px;
            i{
                margin-right:4px;
            }
            span{
                color:@PrimaryColor;
            }
            a{
            color:@PrimaryColor;
            }
            &:last-child{
                margin-left:38px;
            }

        }
    }
}
</style>
