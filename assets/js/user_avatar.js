$(function () {
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    //文件上传按钮
    $('#btnChooseImage').on('click', function () {
        $('#file').click();
    })

    //上传图片到裁剪区
    $('#file').on('change', function (e) {
        //e.target.files[0]可以拿到选择的图片
        let fileList = e.target.files;

        if (fileList.length === 0) {
            return layui.layer.msg('请选择图片')
        }

        //1.获取图片
        let file = fileList[0];
        //2.把文件转化位路径
        let imgURL = URL.createObjectURL(file);
        //3.先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`：
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', imgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域

        //上传
        $('#btnLoadImage').on('click', function (e) {
            e.preventDefault();
            //将裁剪后的图片，输出为 base64 格式的字符串
            var dataURL = $image
                .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                    width: 100,
                    height: 100
                })
                .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串

            $.ajax({
                method: 'POST',
                url: '/my/update/avatar',
                data: {
                    avatar: dataURL
                },
                success: function (res) {
                    if (res.status !== 0) {
                        return layui.layer.msg('上传失败')
                    }
                    layui.layer.msg('上传成功')
                    //重新渲染
                    window.parent.getUserInfo();
                }
            })

        })
    })
})