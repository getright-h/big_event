$(function () {
    let layer = layui.layer;
    getUserInfo()

    //用户退出功能
    $('#quit').on('click', function () {
        layer.confirm('确定要退出吗?', { icon: 3, title: '提示' }, function (index) {

            //清空token，且跳转回登录页
            localStorage.removeItem('token');
            location.href = '/后台/大事记案例/login.html';
            layer.close(index);
        });
    })
})


//获取用户信息
function getUserInfo () {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败！')
            }
            renderAvatar(res.data)
        },
        // complete: function (res) {
        //     console.log(res);
        //     //在 complete 回调函数中，可以使用 res.responseJSON 拿到服务器响应回来的数据
        //     //解决没有登录，强制跳转index问题
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         localStorage.removeItem('token');
        //         location.href = '/后台/大事记案例/login.html';
        //     }
        // }
    })
}


//渲染头像
function renderAvatar (user) {

    //1.获取姓名
    let name = user.nickname || user.username;

    //2.欢迎文本
    $('#welcome').html('欢迎&nbsp;&nbsp' + name);

    //3.渲染头像
    if (user.user_pic !== null) {
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide();
    } else {
        $('.layui-nav-img').hide();
        //如若没有自定义头像则截取首字母为头像,这是字符串
        let first = name[0].toUpperCase();
        $('.text-avatar').show().html(first);
    }
}