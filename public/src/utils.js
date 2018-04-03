define(['jquery', 'i18n'], function ($) {
    setPageLanguage(); 

    // 语言选择展开
    $('.language').on('click', function () {
        $('.chooseLanguage').fadeIn(600);
    });
    // 语言关闭
    $('.close').on('click', function () {
        $('.chooseLanguage').fadeOut(600);
    });
    //点击非内容区域关闭语言选择
    $('.chooseLanguage').on('click', function (e) {
        if ($(e.target).hasClass('chooseLanguage')) {
            $(this).fadeOut(600);
        }
    });
    // 选择全球首页后关闭语言并跳转
    $('.clobalHome').on('click', function () {
        $('.chooseLanguage').fadeOut(600);
    });


    // 
    $('.chooseLanguage').on('click', '.section a', function (e) {
        mySetLocalStorage("SELECTLANGUAGETEXT", $(this).text());
        mySetLocalStorage("SELECTLANGUAGETYPE", $(this).attr('data-languagetype'));



        setPageLanguage();

        $('.chooseLanguage').fadeOut(600);

        e.stopPropagation();
    });


    // 用户登录,修改和设置样式操作
    $('.userInfo>li input').on('focus', function () {
        $(this).siblings('img').css('opacity', 1);
    });
    $('.userInfo>li input').on('blur', function () {
        $(this).siblings('img').css('opacity', 0.5);
    });

})