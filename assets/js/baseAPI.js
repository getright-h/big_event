//每次调用ajax发送请求时，jq都会调用此函数，opitons可以拿到我们提供的配置对象
$.ajaxPrefilter(function (options) {
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url;
    //判断需要验证的请求头,包含my字段的为需要验证
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    //在 complete 回调函数中，可以使用 res.responseJSON 拿到服务器响应回来的数据
    //解决没有登录，强制跳转index问题
    options.complete = function (res) {
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            localStorage.removeItem('token');
            location.href = '/后台/大事记案例/login.html';
        }
    }
})