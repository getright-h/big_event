$(function () {
    let layer = layui.layer;
    let form = layui.form;
    let laypage = layui.laypage;



    //查询参数，之后发送到服务器
    var q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 3, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态
    }
    initTable();
    initCate();

    //获取文章列表
    function initTable () {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败')
                }
                //使用模板引擎渲染页面
                let tplHtml = template('tpl-table', res);
                $('tbody').html(tplHtml);
                //渲染完后，获得文章总数，渲染分页
                renderPage(res.total);
            }
        })
    }

    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 定义补零的函数
    function padZero (n) {
        return n > 9 ? n : '0' + n
    }

    //获取文章分类信息
    function initCate () {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败')
                }
                let tplHtml = template('tpl-cate', res);
                $('[name = cate_id]').html(tplHtml);

                //因为是ajax异步载入数据，layuijs没有监听到此项操作
                //使用form.render()解决
                form.render();
            }
        })
    }

    //筛选按钮
    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        //获取分类，状态选项值
        let cate_id = $('[name = cate_id]').val();
        let state = $('[name = state]').val();
        //复写q
        q.cate_id = cate_id;
        q.state = state;
        //重新渲染
        console.log(q);
        initTable();
    })

    //分页
    function renderPage (total) {
        laypage.render({
            elem: 'pageBox',//存放分页的div
            count: total,//数据总数
            limit: q.pagesize,//每页显示几个条目
            curr: q.pagenum,//默认选中项
            //自定义分页项
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            //分页切换时触发jump回调
            //当调用layerpage时，会自动触发jump函数，继而造成死循环
            jump: function (obj, first) {
                //跟新当前页码
                q.pagenum = obj.curr;
                // 把最新的条目数，赋值到 q 这个查询参数对象的 pagesize 属性中
                q.pagesize = obj.limit
                //触发jump回调的方式有2：
                //1.点击页码，first值为undefined
                //2.调用layerpage.render()，firser值为true
                if (!first) {
                    initTable()
                }
            }
        })
    }

    //删除按钮
    //由于是模板引擎渲染，layui不能侦听到该事件，所以要事件代理绑定
    $('tbody').on('click', '.btn-delete', function (e) {
        //获取自定义属性中绑定的id，删除对应的文章
        let id = $(this).attr('data-id')
        //获取删除按钮的个数
        let del_length = $('.btn-delete').length;
        layer.confirm('确定删除吗?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除失败')
                    }
                    initTable()
                    layer.msg('删除成功');
                    //当前页数据删除后，应该判断是否还有数据，
                    //没有的话就让页数-1，再刷新
                    //判断删除按钮的剩余
                    if (del_length === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            })

            layer.close(index);
        });
    })

    //废案
    //编辑
    // $('tbody').on('click', '.btn-edit', function () {
    // //获取编辑的id
    // let id = $(this).data('id');
    // //id存储到sessionStorage
    // sessionStorage.setItem('id', id)

    // //跳转到文章发布区  form-pub
    // location.href = '/后台/大事记案例/article/art_pub.html';


    // //根据id，ajax获取对应信息
    // // $.ajax({
    // //     method: 'GET',
    // //     url: '/my/article/' + id,

    // //     processData: false,//不处理数据
    // //     contentType: false,//不设置内容类型
    // //     success: function (res) {
    // //         if (res.status !== 0) {
    // //             return layer.msg('获取文章信息失败')
    // //         }
    // //         console.log(1);
    // //         //form.val()给表单赋值
    // //         form.val('formArtPub', res.data)
    // //     }
    // // })

    // })
})