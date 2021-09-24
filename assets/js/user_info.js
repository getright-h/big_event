$(function () {
    let form = layui.form;
    let layer = layui.layer

    form.verify({
        nicename: function (val) {
            if (val.length > 6) {
                return '昵称长度在1-6之间'
            }
        }
    })

    initUserInfo();
    //初始化用户信息
    function initUserInfo () {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败')
                }
                //form.val()给表单赋值
                form.val('formUserInfo', res.data)
            }
        })
    }

    //重置表单信息
    $('#btnReset').on('click', function (e) {
        e.preventDefault();
        //再次ajax请求，覆盖当前填写的信息
        initUserInfo()
    })

    //更新用户信息
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        //发送当前表单信息
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败')
                }
                layer.msg('更新用户信息成功')
                //调用index中初始化用户信息的函数，重新渲染头像，名称
                //window.parent指向内联框架的父级页面
                window.parent.getUserInfo();
            }
        })
    })
})

