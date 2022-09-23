<template>
  <div class="trz-home">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  created() {
    this.noPermissionHandler();
  },
  activated() {
    this.noPermissionHandler();
  },
  methods: {
    noPermissionHandler() {
      window
        .Axios({
          method: "get",
          url: "/api/config/view?dbname=cktourongzi",
          params: {
            accesstoken: GETCOOKIEFUN("accesstoken")
          }
        })
        .then(res => {
          if (res.data.code === 200 && res.data.data) {
            let data = res.data.data,
              paths = {
                news: "news",
                map: "map",
                report: "report",
                qiye: "gognsidetails",
                jigou: "jigoudetails",
                kuajing: "kuajing",
                binggou: "binggou",
                rongzi: "tourongzi",
                home: "home"
              };
            if (
              data.norules.exclusive.filter(item =>
                paths[this.$route.path.replace("/trz/", "")].includes(
                  item.action
                )
              ).length > 0
            ) {
              this.$router.replace({
                path: "/trz-no-permission",
                query: {
                  from: "trz"
                }
              });
            }
          }
        });
    }
  }
};
</script>
