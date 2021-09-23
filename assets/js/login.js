window.addEventListener('load', function () {
    let link_log = document.querySelector('#link_log');
    let link_reg = document.querySelector('#link_reg');
    let login_box = document.querySelector('.login-box');
    let reg_box = document.querySelector('.reg-box');

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
    form.verify({
        pwd: [/^[\s]{6,12}$/, '密码6-12位，不包含空格']
    })
})