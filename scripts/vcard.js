var scrollerComplete;
var activeMenu;
var activeWorkPage;
var iexplorer;
var emailValues = new Array();
$(document).ready(function () {
    $('#vcard').fadeIn(200);
    setupStage();
    setupAnchor();
    setupScroller();
    setupMenu();
    setupWork();
    setupNetworks();
    setupContact();
    loadCufon();
    $(window).resize(function () {
        setupStage()
    })
});

function setupStage() {
    marginTop = ($(window).height() - $('#vcard').height()) / 2;
    $('#vcard').css('marginTop', marginTop)
}
function setupAnchor() {
    $(window).bind('hashchange', function () {
        var page = '#' + window.location.hash.slice(1);
        if (page != '#') {
            scrollTo(page)
        }
    })
}
function setupScroller() {
    scrollerComplete = 1;
    contentItems = $(".contentitem").size();
    contentItem_width = $(".contentitem").width();
    scroller_width = contentItem_width * contentItems;
    $("#scroller").width(scroller_width + (contentItems * 30));
    myFile = document.location.toString();
    if (myFile.match('#')) {
        myAnchor = "#" + myFile.split('#')[1];
        $("#menu").children().removeClass('active');
        $("a[href=" + myAnchor + "]").parent().addClass('active');
        scrollTo(myAnchor, 1)
    } else {
        activeMenu = $('#menu').children('li:first').children().attr("href");
        scrollTo(activeMenu, 1)
    }
    $(".contentitem").fadeIn(700)
}
function setupMenu() {
    $("#menu").children().click(function () {
        scrollTo($(this).children().attr('href'))
    })
}
function setupWork() {
    workpages = Math.ceil($(".work").children().size());
    addEmpty = (workpages) - $(".work").children().size();
    for (i = 0; i < addEmpty; i++) {
        $(".work").append('<li></li>')
    }
    $(".work").children('li:nth-child(3n+3)').addClass('last');
    $('#worknavigation').html('');
    if (workpages > 1) {
        for (i = 0; i < workpages; i++) {
            if (i) {
                $('#worknavigation').append('<li>' + (i + 1) + '</li>')
            } else {
                $('#worknavigation').append('<li class="active">' + (i + 1) + '</li>')
            }
        }
        activeWorkPage = 0;
        $("#worknavigation").children().click(function () {
            if (activeWorkPage != $(this).index()) {
                activeWorkPage = $(this).index();
                $("#worknavigation").children().removeClass('active');
                $("#worknavigation").children(':eq(' + activeWorkPage + ')').addClass('active');
                scrollWork(activeWorkPage)
            }
        })
    }
    $(".work").children().hover(function () {
        $(this).children('a').children(".worktitle").animate({
            marginTop: -55
        }, 200);
        $(this).children('a').children("img").animate({
            opacity: 0.5
        }, 200)
    }, function () {
        $(this).children('a').children(".worktitle").animate({
            marginTop: 0
        }, 200);
        $(this).children('a').children("img").animate({
            opacity: 1
        }, 200)
    })
}
function setupNetworks() {
    $(".networks").children('li:nth-child(3n+3)').addClass('last');
    $(".networks").children('li').children('a').children(".content").animate({
        marginLeft: 1
    }, 1);
    $(".networks").children('li').hover(function () {
        $(this).children('a').children(".background").fadeIn(150);
        $(this).children('a').children(".content").animate({
            marginLeft: 5
        }, 150)
    }, function () {
        $(this).children('a').children(".background").fadeOut(150);
        $(this).children('a').children(".content").animate({
            marginLeft: 0
        }, 150)
    })
}
function setupContact() {
    $('input:text[name=name],input:text[name=email],textarea[name=message]').focus(function () {
        $(this).removeClass('error');
        if (!emailValues[$(this).attr('name')]) {
            emailValues[$(this).attr('name')] = $(this).val();
            $(this).val('');
            $(this).css('color', '#555')
        }
        if ($(this).val() == emailValues[$(this).attr('name')]) {
            $(this).val('');
            $(this).css('color', '#555')
        }
    });
    $('input:text[name=name],input:text[name=email],textarea[name=message]').blur(function () {
        if (!$(this).val()) {
            $(this).css('color', '#999');
            $(this).val(emailValues[$(this).attr('name')])
        }
    });
    $('.sendmail').click(function () {
        mail_error = 0;
        mail_name = $('input:text[name=name]').val();
        mail_email = $('input:text[name=email]').val();
        mail_message = $('textarea[name=message]').val();
        if (!mail_name || mail_name == emailValues['name'] || !emailValues['name']) {
            $('input:text[name=name]').addClass('error');
            mail_error = 1
        }
        if (!mail_email || mail_email == emailValues['email'] || !emailValues['email']) {
            $('input:text[name=email]').addClass('error');
            mail_error = 1
        } else {
            if ((mail_email.indexOf('@') < 0) || ((mail_email.charAt(mail_email.length - 4) != '.') && (mail_email.charAt(mail_email.length - 3) != '.'))) {
                $('input:text[name=email]').addClass('error');
                mail_error = 1
            }
        }
        if (!mail_message || mail_message == emailValues['message'] || !emailValues['message']) {
            $('textarea[name=message]').addClass('error');
            mail_error = 1
        }
        if (!mail_error) {
            $.post("sendmail.php", {
                name: mail_name,
                email: mail_email,
                message: mail_message
            }, function (data) {
                $("#email_form").fadeOut(200, function () {
                    $("#email_send").fadeIn(800)
                })
            })
        }
    })
}
function scrollTo(href, direct) {
    if (href != activeMenu) {
        if (scrollerComplete) {
            activeMenu = href;
            $("#menu").children().removeClass('active');
            $("a[href=" + href + "]").parent().addClass('active');
            loadCufon();
            menuId = href.split('#');
            menuIndex = $(".contentitem[id='menu_" + menuId[1] + "']").index();
            contentItem_width = $(".contentitem").width();
            scrollToPos = -((menuIndex * contentItem_width) + (menuIndex * 30));
            document.title = $(".contentitem[id='menu_" + menuId[1] + "']").children('.pagetitle').text();
            if (scrollToPos <= 0) {
                scrollerComplete = 0;
                if (direct) {
                    $("#scroller").css('marginLeft', scrollToPos);
                    scrollerComplete = 1
                } else {
                    if (!iexplorer) {
                        $("#scroller").animate({
                            opacity: 0.4
                        }, 200, function () {
                            $("#scroller").animate({
                                marginLeft: scrollToPos
                            }, 500, function () {
                                $("#scroller").animate({
                                    opacity: 1
                                }, 200, function () {
                                    scrollerComplete = 1
                                })
                            })
                        })
                    } else {
                        $("#scroller").animate({
                            marginLeft: scrollToPos
                        }, 500, function () {
                            scrollerComplete = 1
                        })
                    }
                }
            }
        }
    }
}
function scrollWork(page) {
    scrollY = -(page * 200);
    if (!iexplorer) {
        $("#workscroller").animate({
            opacity: 0.4
        }, 200, function () {
            $("#workscroller").animate({
                marginTop: scrollY
            }, 400, function () {
                $("#workscroller").animate({
                    opacity: 1
                }, 200)
            })
        })
    } else {
        $("#workscroller").animate({
            marginTop: scrollY
        }, 400)
    }
}
function loadCufon() {
    Cufon('.sname', {
        textShadow: '1px 1px 2px #fff'
    });
    Cufon('#menu', {
        textShadow: '1px 1px 2px #fff',
        hover: {
            color: '#555'
        }
    });
    Cufon('.worktitle', {
        textShadow: '1px 1px 2px #fff'
    });
    Cufon('.topic', {
        textShadow: '1px 1px 2px #fff'
    });
    Cufon('h1', {
        textShadow: '1px 1px 2px #fff'
    });
    Cufon('h2', {
        textShadow: '1px 1px 2px #fff'
    });
    Cufon('h3', {
        textShadow: '1px 1px 2px #fff'
    })
}