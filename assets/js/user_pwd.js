$(function () {
    let form = layui.form;

    //密码校验
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6-12位'],
        samePwd: function (val) {
            if (val === $('[name = oldPwd]').val()) {
                return '新旧密码不能一样'
            }
        },
        rePwd: function (val) {
            if (val !== $('[name = newPwd]').val()) {
                return '两次密码不一样'
            }
        }
    })

    //提交重置密码
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('密码更新失败')
                }
                layui.layer.msg('密码更新成功');

                //重置表单，使用原生的方法，要把jq对象转换成dom对象
                $('.layui-form')[0].reset();
            }
        })
    })
})