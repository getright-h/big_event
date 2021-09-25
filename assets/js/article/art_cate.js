$(function () {
    let layer = layui.layer;
    let form = layui.form;
    initArtCateList();

    //获取文章分类列表
    function initArtCateList () {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                //模板引擎，模板的id + data
                let htmlStr = template('tpl-table', res);
                //把遍历后的模板嵌入dom
                $('tbody').html(htmlStr);
            }
        })
    }

    //添加文章类别按钮
    //存储弹窗的索引，之后根据索引，关闭对应的弹出层
    var indexAdd = null
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '350px'],
            title: '在线调试',
            content: $('#dialog-add').html(),
        })
    })

    //类别提交按钮
    //因为弹出层时动态添加的，不能直接监听submit事件
    //用事件代理监听
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('添加失败')
                }
                //刷新文章类别列表
                initArtCateList();
                layer.msg('添加成功');
                // 根据索引，关闭对应的弹出层
                layer.close(indexAdd)
            }
        })
    })

    //编辑按钮
    //同样的事件代理
    let indexEdit = null;
    $('tbody').on('click', '.btn-edit', function (e) {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '350px'],
            title: '在线调试',
            content: $('#dialog-edit').html(),
        })
        //h5 自定义属性
        let id = $(this).data('id');
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                //form.val()导入对应信息到表单中
                //res.data保存了当前id的类别信息
                form.val('form-edit', res.data)
            }
        })
    })

    //编辑按钮的提交
    //同样的事件代理
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('编辑失败')
                }
                //刷新文章类别列表
                initArtCateList();
                layer.msg('编辑成功')
                //关闭弹窗
                layer.close(indexEdit)
            }
        })
    })

    //删除按钮
    //删除按钮的提交
    //事件代理同上
    $('tbody').on('click', '.btn-delete', function (e) {
        e.preventDefault();
        //获取当前id
        let id = $(this).attr('data-id')
        layer.confirm('确定要删除吗?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除失败')
                    }
                    initArtCateList();
                    layer.msg('删除成功');
                    layer.close(index);
                }
            })

        });
    })
})