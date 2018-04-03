// 模块公共配置
require.config({
    baseUrl: '/public',
    paths: {
        jquery: 'assets/jquery/jquery-1.12.4.min',
        template: 'assets/artTemplate/template-web',
        uploadify: 'assets/uploadify/jquery.uploadify.min',
        nprogress: 'assets/nprogress/nprogress',
        echarts: 'assets/echarts/echarts.min',
        ckeditor: 'assets/ckeditor/ckeditor',
        iscroll: 'assets/iscroll/iscroll',
        i18n: 'assets/i18n/jquery.i18n.properties'
    },
    // 如果某个第三方的类库不支持 AMD，通过 shim 
    // 可以实现类似模块的用法
    shim: {
        // 模块有何特点？
        uploadify: {
            // 1、通过 exports 可以将非模块的方法或属性
            // 公开出来（相当于标准模块中 return 的作用）
            // exports: 
            // 2、通过 deps 可以依赖其它模块
            deps: ['jquery']
        },

        ckeditor: {
            // deps: []
            exports: 'CKEDITOR'
        },

        i18n: {

            deps: ['jquery']
        }
    }
});

// 全局执行的
require(['nprogress', 'jquery'], function (NProgress, $) {

    window.$url = "http://192.168.106.42:8088/api/"; //测试版本

    // window.$url = "https://fxmastra.cn/api"; //服务器

    // 关闭浏览器存储
    window.mySetSessionStorage = function (key, data) {
        sessionStorage.setItem(key, data);
    }
    window.myGetSessionStorage = function (key) {
        return sessionStorage.getItem(key);
    }
    window.myRemoveSessionStorage = function (key) {
        sessionStorage.removeItem(key);
    }
    // 永久存储
    window.mySetLocalStorage = function (key, data) {
        localStorage.setItem(key, data);
    }
    window.myGetLocalStorage = function (key) {
        return localStorage.getItem(key);
    }
    window.myRemoveLocalStorage = function (key) {
        localStorage.removeItem(key);
    }
    /**
     * 
     * @param {*文字内容} text 
     * @param {*语言类型} type 
     * @param {*翻译页面} page 
     */
    window.changeLanguage = function (text, type, page) {
        var languageArr = document.querySelectorAll('[data-language]');

        jQuery.i18n.properties({
            name: 'language',
            path: '/public/language/' + page + '/',
            mode: 'both',
            language: type,
            async: true,
            callback: function () {

                $('[data-language]').css('opacity', 1);

                for (var i = 0; i < languageArr.length; i++) {
                    var content = $(languageArr[i]).attr('data-language');

                    // 区别input
                    if ($(languageArr[i])[0].tagName == 'INPUT') {
                        if ($(languageArr[i]).attr('type') == 'submit') {
                            // 提交按钮
                            $(languageArr[i]).val($.i18n.prop(content))
                            continue;
                        }
                        $(languageArr[i]).attr('placeholder', $.i18n.prop(content))
                        continue;
                    }
                    $(languageArr[i]).text($.i18n.prop(content))
                }
            }
        });

    }
    window.setPageLanguage = function () {
        var languageText = myGetLocalStorage('SELECTLANGUAGETEXT') || 'English';
        var languageType = myGetLocalStorage('SELECTLANGUAGETYPE') || 'en';
        var page = $('body').attr('data-page');
        changeLanguage(languageText, languageType, page);

        // 修改切换语言按钮
        $('.language').text(languageText);

        // 中文界面360和应用宝下载按钮显示
        if (languageType == 'zh') {
            $('.n360APP').show().next().show();
            return;
        }
        $('.n360APP').hide().next().hide();

    }

    NProgress.start();
    NProgress.done();
    // 当Ajax请求时，也需要进度显示
    $(document).ajaxStart(function () {
        NProgress.start();
    }).ajaxStop(function () {
        NProgress.done();
    })
});