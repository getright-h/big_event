//每次调用ajax发送请求时，jq都会调用此函数，opitons可以拿到我们提供的配置对象
$.ajaxPrefilter(function (options) {
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url;
})