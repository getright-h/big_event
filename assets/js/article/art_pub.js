$(function () {
    let layer = layui.layer;
    let form = layui.form;
    initCate();
    // getSession();

    //废案
    // let sessionId = null;
    // if (sessionId !== null) {
    //     //根据id编辑文章
    //     $.ajax({
    //         method: 'GET',
    //         url: '/my/article/' + sessionId,

    //         processData: false,//不处理数据
    //         contentType: false,//不设置内容类型
    //         success: function (res) {
    //             if (res.status !== 0) {
    //                 return layer.msg('获取文章信息失败')
    //             }
    //             console.log(11);
    //             //form.val()给表单赋值
    //             form.val('formArtPub', res.data)
    //         }
    //     })
    // }

    // //获得编辑文章的id
    // function getSession () {
    //     sessionId = sessionStorage.getItem('id');
    // }


    //加载文章类别
    function initCate () {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取失败')
                }
                let tplHtml = template('cate-tpl', res);
                $('[name=cate_id]').html(tplHtml)
                //重新渲染
                form.render()
            }
        })
    }

    // 初始化富文本编辑器
    initEditor()

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)



    //绑定上传按钮
    $('#btnChooseCover').on('click', function () {
        $('#inputFile').click()
    })
    //change监听上传
    $('#inputFile').on('change', function (e) {
        //获取上传的对象列表
        let files = e.target.files;
        if (files.length === 0) {
            return layer.msg('请选择图片')
        }
        //拿到用户选择的文件
        var file = e.target.files[0]
        //根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(file)
        //先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`：
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
        //将裁剪后的图片，输出为文件
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
            })
    })

    //定义发布文章的状态
    let art_state = '已发布';
    //存为草稿按钮
    $('#btnSave2').on('click', function () {
        art_state = '草稿';
    })
    //提交按钮
    $('#form-pub').on('submit', function (e) {
        e.preventDefault();
        //基于form表单快速序列化，创建一个formdata对象，并把jq对象dom化
        let form_pub = new FormData($(this)[0]);
        //追加state数据
        form_pub.append('state', art_state);

        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作

                //追加cover_img
                form_pub.append('cover_img', blob)

                pulishArticle(form_pub);
            })


    })

    //发布
    function pulishArticle (form_pub) {


        //ajax
        //注意：formData对象再jq中，一定要设置jquery中不处理数据，不设置内容类型，否则报错
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: form_pub,
            processData: false,//不处理数据
            contentType: false,//不设置内容类型
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('发布失败')
                }
                layer.msg('发布成功');
                location.href = '/后台/大事记案例/article/art_list.html'
            }
        })
    }
})