(function () {
  var generateLog = function () {
    var cookies = {};
    var href = location.href;
    var yaozh_user = "",
      yaozh_userId = "",
      yaozh_logintime = "",
      yaozh_uidhas = "",
      yaozh_mylogin = "",
      accesstoken = "";
    document.cookie.split(";").forEach((t) => {
      let c = t.trim().split("=");
      cookies[c[0]] = c[1];
    });
    var now = new Date();
    yaozh_user = cookies.yaozh_user || 0;
    yaozh_userId = cookies.yaozh_userId  || 0;
    yaozh_logintime = cookies.yaozh_logintime  || 0;
    yaozh_uidhas = cookies.yaozh_uidhas  || 0;
    yaozh_mylogin = cookies.yaozh_mylogin  || 0;
    accesstoken = cookies.accesstoken  || 0;
    timestamp = now.getTime()
    return {
        href,
        yaozh_user,
        yaozh_userId,
        yaozh_logintime,
        yaozh_uidhas,
        yaozh_mylogin,
        accesstoken,
        timestamp
    }
  };

  var addLog = function() {
      var log = JSON.parse(window.localStorage.getItem('yz_login_state_log'));
      if (log&&log.length==100) {
          log.shift();
      }
      if (!log) {
        log = []
      }
      log.push(generateLog())
      window.localStorage.setItem('yz_login_state_log', JSON.stringify(log))
  }
  window.setLogSync = addLog;
  addLog()
})();
