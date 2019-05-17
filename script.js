// $('.tab').on('click', function () {
//     $(this).addClass('active').siblings().removeClass('active');
//     var index = $(this).index();
//     $('section').eq(index).fadeIn().siblings().hide();
// })

var tab = (function () {
    var $tab = $('.tab')
    
    var bind = function () {
        $tab.on('click', function () {
            $(this).addClass('active').siblings().removeClass('active');
            var index = $(this).index();
            $('section').eq(index).fadeIn().siblings().hide();
        })
    }

    var init = function () {
        bind()
    }
    return {
        init: init
    }
})()

var General = (function ($) {
    var isToBottom = function ($viewport, $content) {
        return $viewport.height() + $viewport.scrollTop() + 30 > $content.height()
    }
    var createNode = function (data) {
        // console.log(data)
        var $node = $(`
          <div class="item">
            <a href="#">
              <div class="cover">
                <img
                  src="https://img3.doubanio.com/view/photo/s_ratio_poster/public/p480747492.jpg"
                  alt="img"
                  class="post"
                />
              </div>
              <div class="detail">
                <h2 class="title">肖申克的救赎</h2>
                <div class="extra">
                  <span class="score">9.6分</span> / <span class="collect"
                    >1000收藏</span
                  >
                </div>
                <div class="extra">1994 / 犯罪 剧情</div>
                <div class="extra">导演：弗兰克·德拉</div>
                <div class="extra">主演：蒂姆·罗宾逊 摩根·弗里曼</div>
              </div>
            </a>
          </div>
        `)
        $node.find('a').attr('href', data.alt)
        $node.find('.cover img').attr('src', data.images.small)
        $node.find('.detail h2').text(data.title)
        $node.find('.detail .score').text(data.rating.average + '分')
        $node.find('.detail .collect').text(data.collect_count)
        $node.find('.detail .extra').eq(1).text(data.year + ' / ' + data.genres.join(' '))
        $node.find('.detail .extra').eq(2).text('导演：' + data.directors.map(v => v.name).join(' '))
        $node.find('.detail .extra').eq(3).text('主演：' + data.casts.map(v => v.name).join(' '))
        return $node
    }
    return {
        isToBottom: isToBottom,
        createNode: createNode
    }
})(jQuery)

//top250模块
var top250 = (function ($) {
    //元素和变量
    var $container = $('#top250')
    var $content = $container.find('.wrap')
    var $loading = $container.find('.loading')
    var page = 0;
    var count = 10;
    var isLoading = false;
    var isFinish = false;

    //绑定事件
    var bind = function () {
        $container.on('scroll', function () {
            if (General.isToBottom($container, $content) && !isFinish && !isLoading) {
                $loading.show()
                isLoading = true;
                getData(render)
            }
        })
    }

    //请求数据
    var getData = function (callback) {
        $.ajax({
            url: 'https://douban.uieee.com/v2/movie/top250',
            type: 'GET',
            data: {
                start: page * count,
                count: count
            },
            dataType: 'jsonp'
        }).done(function (data) {
            // console.log(data)
            callback(data)
            if (page * count > data.total) {
                isFinish = true;
            }
        }).fail(function (err) {
            // console.log(err)
        }).always(function () {
            $loading.hide();
            isLoading = false;
        })
    }
    //渲染页面
    var render = function (data) {
        data.subjects.forEach(function (subject) {
            var $node = General.createNode(subject)
            $content.append($node)
        })
        page++;
    }

    //初始化
    var init = function () {
        getData(render)
        bind();
    }
    return {
        init: init
    }
})(jQuery)

var usBox = (function ($) {
    //元素和变量
    var $container = $('#us-box')
    var $content = $container.find('.wrap')
    var $loading = $container.find('.loading')
    var page = 0;
    var count = 10;

    //请求数据
    var getData = function (callback) {
        $.ajax({
            url: 'https://douban.uieee.com/v2/movie/us_box',
            type: 'GET',
            data: {
                start: page * count,
                count: count
            },
            dataType: 'jsonp'
        }).done(function (data) {
            // console.log(data)
            callback(data)
            if (page * count > data.total) {
                isFinish = true;
            }
        }).fail(function (err) {
            // console.log(err)
        }).always(function () {
            $loading.hide();
            isLoading = false;
        })
    }

    //渲染页面
    var render = function (data) {
        data.subjects.forEach(function (subjects) {
            var $node = General.createNode(subjects.subject)
            $content.append($node)
        })
        page++;
    }

    //初始化
    var init = function () {
        getData(render)
        // bind();
    }

    return {
        init: init
    }
})(jQuery)

var search = (function ($) {
    //元素和变量
    var $container = $('#search')
    var $content = $container.find('.wrap')
    var $loading = $container.find('.loading')
    var $btn = $container.find('.search-area .button')
    var $input = $container.find('.search-area input')
    var page = 0;
    var count = 10;
    var isLoading = false;
    var isFinish = false;

    //绑定事件
    var bind = function () {
        $btn.on('click', function () {
            $loading.show()
            isLoading = true;
            getData(render)
        })
        $input.on('keyup', function (e) {
            if (e.key === 'Enter') {
                $loading.show()
                isLoading = true;
                getData(render)
            }
        })
        $container.on('scroll', function () {
            if (General.isToBottom($container, $content) && !isFinish && !isLoading) {
                $loading.show()
                isLoading = true;
                getData(render)
            }
        })
    }

    //请求数据
    var getData = function (callback) {
        $.ajax({
            url: 'https://douban.uieee.com/v2/movie/search',
            type: 'GET',
            data: {
                q: $input.val()
            },
            dataType: 'jsonp'
        }).done(function (data) {
            console.log(data)
            callback(data)
            if (page * count > data.total) {
                isFinish = true;
            }
        }).fail(function (err) {
            console.log(err)
        }).always(function () {
            $loading.hide();
            isLoading = false;
        })
    }

    //渲染页面
    var render = function (data) {
        data.subjects.forEach(function (subjects) {
            var $node = General.createNode(subjects.subject)
            $content.append($node)
        })
        page++;
    }
    var init = function () {
        bind();
    }
    return {
        init: init
    }
})(jQuery)

var app = (function ($) {
    var m = $('section');

    function init() {
        tab.init()
        top250.init()
        usBox.init()
        search.init()
    }
    return {
        init: init
    }
})(jQuery);

app.init();