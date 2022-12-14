<template>
  <div class="main-container" :style="{width: width + 'px',height: height + 'px'}" ref="selfEcharts">
    <div class="wrap-container" :style="{visibility: isChartVisible ? 'visible' : 'hidden',width: width + 'px',height: height + 'px'}">
      <div class="echarts" :style="{width: width + 'px',height: height + 'px'}" :id="randomId"></div>
    </div>
  </div>
</template>

<script>
  import echarts from 'echarts'

  export default {
    name: 'echarts',
    props: {
      option: {
        default () {
          return {};
        }
      },

      width: {
        type: Number,
      },

      height:{
        type: Number,
      },

      // resize 调整标识
      resizeSignature: {
        default: ''
      },

      // 需要注册的地图
      maps: {
        type: Array,
        default () {
          return [];
        }
      },
      // 用于绑定滚动监听的 DOM 元素，不传递时会使用 window, 由于项目的body设置了overflow:hidden属性，这里默认监听el-scrollbar__wrap元素
      scrollDomId: {
        default: 'el-scrollbar__wrap'
      }
    },
    data () {
      return {
        //为该组件生成具有唯一 ID DOM
        randomId: 'echarts' + Date.now() + Math.random(),
        myEcharts: null,
        scrollThrottle: 1000,
        windowResizeThrottle: 500,
        // option 是否不合法
        isOptionAbnormal: false,
        // 滚动事件实名函数
        scrollEvent: _.throttle(()=> {
          this.checkPosition()
        }, this.scrollThrottle),
        // 窗口大小调整事件
        windowResizeEvent: _.throttle(() => {
          this.myEcharts.resize();
        }, this.windowResizeThrottle),
        // 页面是否已经滚动到了合适位置
        isPositionReady: false
      }
    },
    created () {
      /**
       * 如果使用方需要调用地图组件
       * 即注册地图元素
       * 可通过传参的方式传入
       */
      const maps = this.maps;
      if (maps.count !== 0) {
        for (const index in maps) {
          const map = maps[index]
          if (isObject(map) && map['name'] !== undefined && map['data'] !== undefined) {
            echarts.registerMap(map['name'], map['data'])
          }
        }
      }
    },
    computed: {
      /**
       * 获取可滚动的 DOM 元素
       * @returns {Window,DOM}
       */
      onScrollDOM () {
        let scrollDom = window;
        if (this.scrollDomId !== null) {
          const tempDom = document.querySelector('.' + this.scrollDomId)
          if (tempDom !== null) {
            scrollDom = tempDom
          }
        }
        return scrollDom
      },
      isChartVisible () {
        return !this.isOptionAbnormal
      }
    },
    mounted () {
      this.$nextTick(()=> {
      // console.log(this.option)
      // 获取 ehcarts 挂载元素
      const $echartsDOM = document.getElementById(this.randomId)
      if (!$echartsDOM) return

      const myEcharts = echarts.init($echartsDOM, 'yaozh_theme')

      myEcharts.on('click', params => {
          this.echartsClicked(params)
      });
      this.myEcharts = myEcharts
      // 初始化时进行一次检测
      this.checkPosition();
      // this.myEcharts.setOption(this.option, true);

      // 对滚动事件进行监控
      this.onScrollDOM.addEventListener('scroll', this.scrollEvent)

      // 对浏览器窗口大小改变进行监控
      window.addEventListener('resize', this.windowResizeEvent)
      })
    },
    watch: {
      // 对 option 的变化进行监控
      option: {
        handler:(newVal)=>{
          if(newVal) {
            this.checkPosition()
          }
        },
        deep:true
      },

      // 主动调用 resize 的标识
      resizeSignature () {
        this.myEcharts.resize()
      }
    },
    beforeDestroy () {
      window.removeEventListener('resize', this.windowResizeEvent)
      window.removeEventListener('scroll', this.scrollEvent)
    },
    methods: {
      /**
       * 检测窗口滚动位置
       * 用以进行延迟加载
       */
      checkPosition () {
        const windowHeight = document.documentElement.clientHeight || window.innerHeight
        const scrollTop = this.onScrollDOM.scrollTop || document.documentElement.scrollTop || document.body.scrollTop
        const windowBottom = +scrollTop + +windowHeight
        const selfTop = _.get(this.$refs, 'selfEcharts.offsetTop', 0)
        if (windowBottom >= selfTop) {
          this.isPositionReady = true
          this.checkAndSetOption()
          this.onScrollDOM.removeEventListener('scroll', this.scrollEvent)
        }
      },

      /**
       * 对 option 进行检测
       * 并进行 setOption
       */
      checkAndSetOption () {
        const option = this.option
        // console.log(option)
        if (this.isPositionReady !== true) return
        if (isValidOption(option)) {
          this.myEcharts.setOption(option, true)
          this.isOptionAbnormal = false
        } else {
          this.isOptionAbnormal = true
        }
      },

      /**
       * echarts 点击事件
       * @param params
       */
      echartsClicked (params) {
        this.$emit('echarts-clicked', params)
      }
    }
  }

  /**
   * option 是否合法
   * @param option
   * @returns {boolean}
   */
  function isValidOption (option) {
    return isObject(option) && !isEmptyObject(option) &&
    hasSeriesKey(option) &&
    isSeriesArray(option) && !isSeriesEmpty(option)
  }

  /**
   * option 是否是对象
   * @param option
   * @returns {boolean}
   */
  function isObject (option) {
    return Object.prototype.isPrototypeOf(option)
  }

  /**
   * option 是否是空对象
   * @param option
   * @returns {boolean}
   */
  function isEmptyObject (option) {
    return Object.keys(option).length === 0
  }

  /**
   * option 是否含有 series 键
   * @param option
   * @returns {boolean}
   */
  function hasSeriesKey (option) {
    return !!option['series']
  }

  /**
   * option 中 series 是否是数组
   * @param option
   * @returns {boolean}
   */
  function isSeriesArray (option) {
    return Array.isArray(option['series'])
  }

  /**
   * option 中 series 数组是否是空数组
   * @param option
   * @returns {boolean}
   */
  function isSeriesEmpty (option) {
    return option['series'].length === 0
  }
</script>

<style scoped>
  .main-container {
    position: relative;
    /* min-width: 400px !important; */
  }

  .wrap-container {
    position: absolute;
  }

  .wrap-container,
  .echarts {
    width: 100%;
    /* min-width: 400px !important; */
    height: 100%;
  }
</style>
