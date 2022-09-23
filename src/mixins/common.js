export default {
  data () {
    return {
    }
  },
  methods: {
    defaultSort (opt) {
      let str = /^(.+)\s(\w+)$/.exec(opt)
      let prop = str[1]
      let tableHead = this.tableHead || this.defaultFiled
      tableHead && tableHead.forEach(element => {
        //order存的是order_field，column的标识用的是prop需要转换下
        if(element.order_field && element.order_field===prop){
          prop = element.prop
        }
      });
      let defalut = {
        order: str[2] + 'ending',
        prop
      }
      return defalut
    },
    // 多种浏览方式只有默认浏览方式用该方法
    sortChange(column) {
      let vuex_name  = this.vuex_name
      let sort = ''
      let tableHead = this.tableHead || this.defaultFiled
      if(column.order){
        //使用order_field字段排序
        let currentColumn = tableHead.find(item=> item.prop === column.prop)
        if (currentColumn && currentColumn.order_field) {
          sort = currentColumn.order_field +" "+ (column.order=="descending"?"desc":"asc")
        }
      }
      this.param.order = sort;
      Store.commit(`${vuex_name}/order`, Object.assign({}, this.$store.state[vuex_name].order, {base: sort ? sort : null}))
      Store.dispatch(`${vuex_name}/nomalSearch`,{params:this.param})
    }
  }
}
