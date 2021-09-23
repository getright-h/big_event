window.addEventListener('load', function () {
    let link_log = document.querySelector('#link_log');
    let link_reg = document.querySelector('#link_reg');
    let login_box = document.querySelector('.login-box');

    let log_form = this.document.querySelector('#log-form');
    let reg_form = this.document.querySelector('#reg-form');

    let reg_box = document.querySelector('.reg-box');
    let reg_btn = document.querySelector('#reg-btn');

    let reg_pwd = document.querySelector('#reg-pwd');
    let repwd = document.querySelector('#repwd');
    let reg_username = this.document.querySelector('#reg-username');

    //切换登录注册按钮
    link_log.addEventListener('click', function () {
        login_box.style.display = 'none';
        reg_box.style.display = 'block';
    })

    link_reg.addEventListener('click', function () {
        reg_box.style.display = 'none';
        login_box.style.display = 'block';
    })

    // 自定义校验规则
    let form = layui.form;
    //自定义弹窗
    layui.use(['layer', 'form'], function () {
        var layer = layui.layer
            , form = layui.form;
    });
    form.verify({
        // 自定义了一个叫做 pwd 校验规则
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        // 校验两次密码是否一致的规则
        repwd: function (value) {
            // 通过形参拿到的是确认密码框中的内容
            // 还需要拿到密码框中的内容
            // 然后进行一次等于的判断
            // 如果判断失败,则return一个提示消息即可


            if (reg_pwd.value !== value) {
                console.log(reg_pwd.value + ',' + value);
                return '两次密码不一致！'
            }
        }
    })

    //注册发送ajax
    reg_btn.addEventListener('click', function (e) {
        e.preventDefault();
        console.log(reg_username.value, repwd.value);
        const xhr = new XMLHttpRequest();

        xhr.open('POST', 'http://api-breakingnews-web.itheima.net/api/reguser');

        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        xhr.send('username=' + reg_username.value + '&password=' + repwd.value)
        //xhr.send('username:' + reg_pwd.value, 'password:' + repwd.value);

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    if (xhr.response.status !== 0) {
                        //字符串对象化
                        let data = JSON.parse(xhr.response);
                        return layer.msg(data.message);
                    }
                    layer.msg('注册成功，请登录！')
                }
            }
        }
        //模拟点击跳转
        link_reg.click();
    })

    //登录发送ajax并获取token

    $('#log-form').submit(function (e) {
        e.preventDefault();
        $.ajax({
            url: '/api/login',
            method: 'POST',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    console.log(res);
                    return layer.msg('登录失败！')
                }
                layer.msg('登录成功！');
                //保存token
                localStorage.setItem('token', res.token);
                location.href = '/后台/大事记案例/index.html';
            }
        })
    })

})