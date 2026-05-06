$(document).ready(function() {

    // Share hack
    setTimeout(function () {
        $('.ya-share2__container_mobile').removeClass('ya-share2__container_mobile');
    }, 10);

    // Ресайз окна
    $(window).resize(function() {
        $('.ui-dialog-content').dialog('option', 'position', {my: 'center', at: 'center', of: window});
    });

    // Общие настройки ajax
    $.ajaxSetup({
        type: 'POST',
        async: true,
        dataType: 'json'
    });

    // Ввод только чисел
    function enterOnlyNumbers(input, event)
    {
        var isMinus = ((event.keyCode == 109) || (event.keyCode == 189)) ? true : false;

        if (!event.shiftKey) {
            if (isMinus && !input.val()) {
                return true;
            } else {
                return (((event.keyCode > 47) && (event.keyCode < 58))
                    || ((event.keyCode > 95) && (event.keyCode < 106))
                    || ((event.keyCode > 111) && (event.keyCode < 124))
                    || (event.keyCode == 8) || (event.keyCode == 46)
                    || (event.keyCode == 37) || (event.keyCode == 39)
                    && !isMinus) ? true : false;
            }
        } else {
            return false;
        }
    }

    // Преобразование слова рядом с цифрой
    function wordCount($n, $words)
    {
        var $x = ($xx = $n%100)%10;
        return $words[((($xx > 10) && ($xx < 15)) || !$x || (($x > 4) && ($x < 10))) ? 2 : (($x == 1) ? 0 : 1)];
    }

    // Инициализация подсказок
    $(document).tooltip({track: true});

    // Инициализация слайдера
    $('#slider').slider({
        min: $('#slider').data('min'),
        max: $('#slider').data('max'),
        value: $('#slider').data('val'),
        range: 'min',
        create: function(event, ui) {
            var words = $('#slider-val').data('words').split(',');
            $('#slider-val').text($('#slider').data('val') + ' ' + wordCount($('#slider').data('val'), words));
        },
        slide: function(event, ui) {
            var words = $('#slider-val').data('words').split(',');
            $('#slider-val').text(ui.value + ' ' + wordCount(ui.value, words));

            if (ui.value > 1) {
                $('#number-unique label').fadeIn(200);
            } else {
                $('#number-unique label').fadeOut(200);
            }
            $('#wkwin-count, #ytwin-count').val(ui.value);
        }
    });

    // Сброс подсветки полей с ошибками
    $('form').on('focus', '.err', function() {
        $(this).removeClass('err');
    });

    // Открыть меню в шапке
    $('#header .menu-init').click(function() {
        $(this).toggleClass('hvr');
        $('#header .menu').toggleClass('hvr');
    });

    // Перейти на случайную страницу
    $('#button.main').click(function() {
        var pageList = {
            1: '/number/',
            2: '/password/',
            3: '/question/',
            4: '/ask/',
            5: '/fact/',
            6: '/ticket/',
            7: '/saying/',
            8: '/doings/',
            9: '/wheel/',
            10: '/compliment/',
        };
        var page = Math.floor(10*Math.random()) + 1;

        location = pageList[page];
    });

    // Выбор типа диапазона чисел
    $('#number-from input[name="from"]').change(function() {
        var wrap = $('#number-from');
        var from = $(this).val();

        wrap.find('label').removeClass('sel');
        $(this).closest('label').addClass('sel');

        wrap.find('li').removeClass('sel');
        wrap.find('li.number-from-' + from).addClass('sel');
    });

    // Выбор исключить числа
    $('#number-exclude input[type="checkbox"]').change(function() {
       $(this).parent().next('textarea').toggleClass('sel');
    });

    // Окно api чисел
    $('#number-api').click(function() {
        $('#api-dialog').dialog({
            width: 'auto',
            modal: true,
            draggable: false,
            closeText: ''
        });
    });

    // Окно сохранения чисел
    $('body').on('click' , '#number-save span', function() {
        $('#pay-dialog').dialog({
            width: 'auto',
            modal: true,
            draggable: false,
            closeText: ''
        });
    });

    // Ввод диапазона чисел
    $('#number-start, #number-end').keydown(function(e) {
        return enterOnlyNumbers($(this), e);
    });

    // Отправить форму сохранения
    $('#pay-dialog form').submit(function() {
        $('#pay-dialog').dialog('close');
    });

    // Показать подробности уведомления
    $('#number-pay button').click(function() {
        $('#pay-dialog').dialog({
            width: 'auto',
            modal: true,
            draggable: false,
            closeText: ''
        });
    });
    $('#number-pay button').click();

    // Скрыть уведомление
    $('#number-note i').click(function() {
        $('#number-note').fadeOut(200);
    });

    // Записать видео
    $('#number-record span').click(async function() {
        let stream = await navigator.mediaDevices.getDisplayMedia({
            preferCurrentTab: true
        });

        const mime = MediaRecorder.isTypeSupported("video/webm; codecs=vp9")
            ? "video/webm; codecs=vp9"
            : "video/webm";
        let mediaRecorder = new MediaRecorder(stream, {
            mimeType: mime
        })

        let chunks = [];
        mediaRecorder.addEventListener('dataavailable', function(e) {
            chunks.push(e.data);
        });

        mediaRecorder.addEventListener('stop', function() {
            let blob = new Blob(chunks, {
                type: chunks[0].type
            });
            let url = URL.createObjectURL(blob);

            let a = document.createElement('a');
            a.href = url;
            a.download = 'number.webm';
            a.click();
        });

        mediaRecorder.start();
    });

    // Сгенерировать шутку
    $('#button.joke').click(function() {
        var caption = $('#caption');
        var container = $('#joke');
        var vote = $('#vote');
        var share = $('#share');

        $.ajax({
            url: '/joke/generate/',
            success: function(data) {
                if (!data.error) {
                    caption.text(caption.data('txt'));

                    container.find('.text td').css({'opacity': 0})
                        .text(data.joke.text).animate({'opacity': 1}, 200);

                    vote.removeClass('hidden').attr('data-id', data.joke.id);

                    share.attr('href', data.share);
                }
            }
        });
    });

    // Сгенерировать высказывание
    $('#button.saying').click(function() {
        var caption = $('#caption');
        var container = $('#saying');
        var vote = $('#vote');
        var share = $('#share');

        $.ajax({
            url: '/saying/generate/',
            success: function(data) {
                if (!data.error) {
                    caption.text(caption.data('txt'));

                    container.find('.text td').css({'opacity': 0})
                        .html(data.saying.text + '<span class="author">— ' + data.saying.author + '</span>')
                        .animate({'opacity': 1}, 200);

                    vote.removeClass('hidden').attr('data-id', data.saying.id);

                    share.attr('href', data.share);
                }
            }
        });
    });

    // Сгенерировать факт
    $('#button.fact').click(function() {
        var caption = $('#caption');
        var container = $('#fact');
        var vote = $('#vote');
        var share = $('#share');

        $.ajax({
            url: '/fact/generate/',
            success: function(data) {
                if (!data.error) {
                    caption.text(caption.data('txt'));

                    container.find('.text td').css({'opacity': 0})
                        .text(data.fact.text).animate({'opacity': 1}, 200);

                    vote.removeClass('hidden').attr('data-id', data.fact.id);

                    share.attr('href', data.share);
                }
            }
        });
    });

    // Голосование
    $('#vote span').click(function() {
        var vote = $('#vote');

        var id = vote.attr('data-id');
        var type = vote.attr('data-type');
        var rate = $(this).attr('class');

        $.ajax({
            url: '/' + type + '/vote/',
            data: {'id': id, 'rate': rate},
            success: function(data) {
                if (!data.error) {
                    vote.removeAttr('data-id').addClass('hidden');
                }
            }
        });
    });

    // Сгенерировать предсказание
    $('#button.ask').click(function() {
        var caption = $('#caption');
        var ball = $('#ask').find('.ball');
        var empty = ball.find('.empty');
        var prediction = ball.find('.prediction');
        var question = $('#ask-question');

        empty.fadeIn(250, function() {
            $.ajax({
                url: '/ask/generate/',
                data: {'question': question.val()},
                success: function(data) {
                    if (!data.error) {
                        ball.effect('shake', function () {
                            if (data.ask.question) {
                                caption.text(data.ask.question);
                            } else {
                                caption.text(caption.data('txt'));
                            }
                            question.val('');

                            prediction.html(data.ask.prediction);
                            empty.fadeOut(250);
                        });
                    }
                }
            });
        });
    });

    // Получить последние предсказания
    $('#ask-last span').click(function() {
        $.ajax({
            url: '/ask/last/',
            success: function(data) {
                if (!data.error) {
                    var dlg = $('#ask-dialog');

                    dlg.html('');
                    for (var i in data.last) {
                        dlg.append(
                            '<dl>' +
                            '<dt><b>' + dlg.data('txt1') + '</b> ' + data.last[i].question + '</dt>' +
                            '<dd><b>' + dlg.data('txt2') + '</b> ' + data.last[i].prediction + '</dd>' +
                            '</dl>'
                        );
                    }

                    dlg.dialog({
                        width: 'auto',
                        modal: true,
                        draggable: false,
                        closeText: ''
                    });
                }
            }
        });
    });

    // Сгенерировать вопрос
    $('#button.question').click(function() {
        var container = $('#question');

        $.ajax({
            url: '/question/generate/',
            success: function(data) {
                if (!data.error) {
                    if (!data.question.restart) {
                        container.attr('data-id', data.question.id);
                        container.find('.text span').css({'opacity': 0})
                            .text(data.question.text).animate({'opacity': 1}, 200);
                        container.find('.text i').attr('class', 'lvl-' + data.question.level);

                        for (var i = 1; i <= 4; i++) {
                            var key = 'answer' + String(i);
                            container.find('[data-num="' + i + '"]').attr('class', 'item').text(data.question[key]);
                        }
                    } else {
                        location.reload();
                    }
                }
            }
        });
    });

    // Ответить на вопрос
    $('body').on('click', '#question .answers .item:not(.dis)', function() {
        var container = $('#question');
        var progress = $('#question-progress');
        var elem = $(this);

        var id = container.attr('data-id');
        var number = elem.attr('data-num');

        $.ajax({
            url: '/question/answer/',
            data: {'id': id, 'number': number},
            success: function(data) {
                if (!data.error) {
                    if (true === data.answer.success) {
                        elem.addClass('suc');
                        container.find('.answers .item').addClass('dis');
                    } else if (false === data.answer.success) {
                        elem.addClass('err');
                        container.find('.answers [data-num="' + data.answer.correct + '"]').addClass('suc');
                        container.find('.answers .item').addClass('dis');
                    }

                    progress.find('.correct').text(data.stat.correct);
                    progress.find('.incorrect').text(data.stat.incorrect);

                    var width = 50;
                    if (data.stat.total) {
                        width = 100 * data.stat.correct / data.stat.total;
                    }

                    progress.find('.bar').width(width + '%');
                }
            }
        });
    });

    // Перезапустить вопросы
    $('#question-progress .restart').click(function() {
        $.ajax({
            url: '/question/restart/',
            success: function(data) {
                if (!data.error) {
                    location.reload();
                }
            }
        });
    });

    // Сгенерировать счастливый билет
    $('#button.ticket').click(function() {
        var container = $('#ticket');
        var stat = $('#ticket-stat');

        $.ajax({
            url: '/ticket/generate/',
            success: function(data) {
                if (!data.error) {
                    var newClass = (true == data.lucky) ? 'lucky' : 'unlucky';

                    container.attr('class', newClass);
                    container.find('.wrap').css({'opacity': 0})
                        .text(data.ticket).animate({'opacity': 1}, 200);

                    stat.find('.count').text(data.stat.count);
                    stat.find('.lucky').text(data.stat.lucky);
                }
            }
        });
    });

    // Сгенерировать пароль
    $('#button.password').click(function() {
        var container = $('#password');

        var length = ($('#slider').length) ? $('#slider').slider('value') : 8;
        var numbers = $('#password-numbers input').is(':checked') ? 1 : 0;
        var symbols = $('#password-symbols input').is(':checked') ? 1 : 0;

        $.ajax({
            url: '/password/generate/',
            data: {'length': length, 'numbers': numbers, 'symbols': symbols},
            success: function(data) {
                if (!data.error) {
                    var password = String(data.password);
                    password.split('');

                    var html = '<span class="new">';
                    for (var i = 0;  i < password.length; i ++) {
                        html += '<span>' + password.charAt(i) + '</span>';
                    }
                    html += '</span>';

                    container.find('.new').attr('class', 'cur');
                    container.find('.cur').remove();
                    container.append(html);

                    var i = 1;
                    container.find('.new span').each(function() {
                        $(this)
                            .delay(parseInt(200/password.length)*(i ++))
                            .animate({'bottom': 0}, 200, 'easeOutQuint');
                    });
                }
            }
        });
    });

    // Сгенерировать никнейм
    $('#button.nickname').click(function() {
        var container = $('#nickname');

        var numbers = $('#nickname-numbers input').is(':checked') ? 1 : 0;

        $.ajax({
            url: '/nickname/generate/',
            data: {'numbers': numbers},
            success: function(data) {
                if (!data.error) {
                    var nickname = String(data.nickname.value);
                    nickname.split('');

                    var html = '<span class="new">';
                    for (var i = 0;  i < nickname.length; i ++) {
                        html += '<span>' + nickname.charAt(i) + '</span>';
                    }
                    html += '</span>';

                    container.find('.new').attr('class', 'cur');
                    container.find('.cur').remove();
                    container.append(html);

                    var i = 1;
                    container.find('.new span').each(function() {
                        $(this)
                            .delay(parseInt(200/nickname.length)*(i ++))
                            .animate({'bottom': 0}, 200, 'easeOutQuint');
                    });

                    $('#nickname-title span').attr('title', data.nickname.title);
                    $(document).tooltip({track: true});
                }
            }
        });
    });
	
	// Сгенерировать комплимент
    $('#button.compliment').click(function() {
        var caption = $('#caption');
        var container = $('#compliment');

        var type = $('input[name="for"]:checked').val();

        $.ajax({
            url: '/compliment/generate/',
            data: {'for': type},
            success: function(data) {
                if (!data.error) {
					if (type == 'him') {
						caption.text(caption.data('cap2'));
					} else {
						caption.text(caption.data('cap1'));
					}
					
                    var compliment = String(data.compliment.value);
                    compliment.split('');

                    var html = '<span class="new">';
                    for (var i = 0;  i < compliment.length; i ++) {
                        html += '<span>' + compliment.charAt(i) + '</span>';
                    }
                    html += '</span>';

                    container.find('.new').attr('class', 'cur');
                    container.find('.cur').remove();
                    container.append(html);

                    var i = 1;
                    container.find('.new span').each(function() {
                        $(this)
                            .delay(parseInt(200/compliment.length)*(i ++))
                            .animate({'bottom': 0}, 200, 'easeOutQuint');
                    });
                }
            }
        });
    });
	
	// Скопировать комплимент
	$('#compliment-copy').click(function() {
		var text = $('#caption').text() + ' ' + $('#compliment').text() + '!';
		navigator.clipboard.writeText(text);
		
		$('#compliment-copy span').text('скопированно!');
		setTimeout(function(){ $('#compliment-copy span').text('скопировать'); }, 3000);
	});

    // Сгенерировать город
    $('#button.city').click(function() {
        var caption = $('#caption');
        var container = $('#city');

        var country = $('input[name="country"]:checked').val();

        $.ajax({
            url: '/city/generate/',
            data: {'country': country},
            success: function(data) {
                if (!data.error) {
                    container.find('.city-name').css({'opacity': 0})
                        .text(data.city.city).animate({'opacity': 1}, 200);

                    container.find('.city-country').css({'opacity': 0})
                        .text(data.city.country).animate({'opacity': 1}, 200);

                    container.find('.city-link a').attr('href', data.city.href);
                }
            }
        });
    });

    // Выбор времени определения победителя
    var tz = new Date().getTimezoneOffset();
    $('#ytwin-tz, #santa-tz').val(tz);

    // Определение победителя
    $('#ytwin-form').submit(function() {
        $('#button').attr('type', 'button').addClass('active');

        $('#load-dialog').dialog({
            width: 'auto',
            height: 90,
            modal: true,
            draggable: false,
            closeText: '',
            closeOnEscape : false,
        });
    });

    // Таймер
    var timer = $('#timer');
    if (timer.length) {
        function tickLottTimer() {
            var wait    = parseInt(timer.attr('data-wait'));
            var diff    = wait - 1;
            var days    = Math.floor(diff / 86400);
            var hours   = Math.floor((diff -= days * 86400) / 3600);
            var minutes = Math.floor((diff -= hours * 3600) / 60);
            var seconds = diff - minutes * 60;

            if (wait == 0) {
                timer.text('');
                return false;
            }

            var daysWords    = ['день', 'дня', 'дней'];
            var hoursWords   = ['час', 'часа', 'часов'];
            var minutesWords = ['минуту', 'минуты', 'минут'];
            var secondsWords = ['секунду', 'секунды', 'секунд'];

            timer.text(
                (!days ? '' : days + ' ' + wordCount(days, daysWords) + ' ') +
                ((!days && !hours) ? '' : hours + ' ' + wordCount(hours, hoursWords) + ' ') +
                ((!days && !hours && !minutes) ?  '' : minutes + ' ' + wordCount(minutes, minutesWords) + ' ') +
                seconds + ' ' + wordCount(seconds, secondsWords)
            ).attr('data-wait', wait - 1);

            if ((wait - 1) <= 0) {
                location.reload();
                return false;
            }

            setTimeout(tickLottTimer, 1000);
        }

        tickLottTimer(true);
    }

    // Показать правила
    $('#contest-rules .show-text').click(function() {
        $('#contest-rules .text').stop(true, true).slideToggle();
    });

    // Спинер страницы спасибо
    $('.donate-form .spinner').keydown(function(e) {
        return enterOnlyNumbers($(this), e);
    }).blur(function(e){
		if (parseInt($(this).val()) < $(this).attr('min')) {
			$(this).val($(this).attr('min'));
		}
	}).spinner();

    // Табы в лк
    $('#profile').find('.tabs').tabs({});

    // Работа с контентом в лк
    $('#profile').find('[data-toggle="init-delete"]').click(function () {
        var type = $(this).closest('table').data('type');
        var hash = $(this).closest('tr').data('hash');
        var dlg = $('#delete-' + type);

        dlg.dialog({
            width: '260',
            modal: true,
            draggable: false,
            closeText: ''
        });
        dlg.find('.button').attr('data-hash', hash);
    });
    
    /* Управление в лк */
    $('#delete-number .button, #delete-contest .button').click(function () {
        var type = $(this).attr('data-type');
        var hash = $(this).attr('data-hash');
        var profile = $('#profile');
        var dlg = $('#delete-' + type);

        $.ajax({
            url: "/my/delete/",
            data: {type: type, hash: hash},
            success: function(data) {
                if (data.ok) {
                    profile.find('[data-type="' + type + '"] [data-hash="' + hash + '"]').remove();
                    if (profile.find('[data-type="' + type + '"] tr').length <= 1) {
                        profile.find('[data-type="' + type + '"]').hide().next('p').show();
                    }
                }

                dlg.dialog('close');
            }
        });
    });

    /* Галерея */
    $('a.colorbox').colorbox({
        maxWidth: '95%',
        maxHeight: '95%',
        initialWidth: 200,
        initialHeight: 200,
        opacity: .7
    });

    /* Показать весь текст */
    $('.show-text-all').click(function () {
        $(this)
            .closest('.text-wrap').hide()
            .next('.text-all').show();

        return false;
    });

    $('#ytwin-comments ul').each(function () {
        var elem = $(this);

        if (elem.find('.text').length > 1) {
            var maxW = 0;
            elem.find('.text').each(function () {
                if ($(this).width() > maxW) {
                    maxW = $(this).width();
                }
            });
            elem.find('.text').width(maxW + 10);
        }
    });

    if ($('#doings').length)
    {
        function progressDoings()
        {
            var doings = $('#doings');
            var count = doings.find('.item').length;
            var check = doings.find('.item.checked').length;
            var progress = doings.find('.progress');

            progress.find('.bar').width(Math.round(100*check/count) + '%');
            progress.find('.text span').text(check + '/' + count);
        }

        function getDoingsHash()
        {
            var doings = $('#doings');
            var count = doings.find('.item').length;

            var h = '';
            doings.find('.item').each(function () {
                h += $(this).is('.checked') ? '1' : '0';
            });
            h = h.match(/.{1,10}/g);

            for (var i in h) {
                h[i] = "0".repeat((count < 10 ? count : 10) - h[i].length) + h[i];
                h[i] = parseInt(h[i] + '', 2).toString(36);
                h[i] = h[parseInt(i) + 1] ? "0".repeat(2 - h[i].length) + h[i] : h[i];
                count -= 10;
            }

            return h.join('');
        }

        function initDoingHash()
        {
            var doings = $('#doings');
            var count = doings.find('.item').length;

            var url = new URL(location);
            var h = url.searchParams.get('h');

            if (h) {
                h = h.match(/.{1,2}/g);
                for (var i in h) {
                    h[i] = h[parseInt(i) + 1] ? "0".repeat(2 - h[i].length) + h[i] : h[i];
                    h[i] = parseInt(h[i] + '', 36).toString(2);
                    h[i] = "0".repeat((count < 10 ? count : 10) - h[i].length) + h[i];
                    count -= 10;
                }
                h = h.join('').split('');
            } else {
                h = [1];
            }

            for (var i in h) {
                if (h[i] == '1') {
                    doings.find('.item:eq(' + i + ')').click();
                }
            }
        }

        $('#doings .item').click(function () {
            $(this).toggleClass('checked');
            progressDoings();
        });

        $('#button.doings').click(function() {
            $('#doings .item').removeClass('checked');
            progressDoings();
        });

        $('#doings-share').on('click', 'a', function (e) {
            var elem = $(this);

            var url = new URL(elem.attr('href'));
            url.searchParams.set('url', location.origin + '/doings/?h=' + getDoingsHash());
            elem.attr('href', url.toString());
        });

        initDoingHash();
    }

    $('#santa-actions')
        .on('click', '.add:not(.disable)', function () {
            $('.field .list').each(function () {
                var elem = $(this).find('li:last').clone();
                elem.find('input').val('');
                $(this).append(elem);
            });

            $('.del, .add').removeClass('disable');
            if ($('.field .names li').length >= 50) {
                $('.add').addClass('disable');
            }
        })
        .on('click', '.del:not(.disable)', function () {
            $('.field .list').each(function () {
                $(this).find('li:last').remove();
            });

            $('.del, .add').removeClass('disable');
            if ($('.field .names li').length <= 2) {
                $('.del').addClass('disable');
            }
        });

    $('.account .signin, .account .signup').submit(function(){
        $(this).find('[type="submit"]').attr('value', 'go');
    });

    $('.account .subscribe .pay').hover(function(){
        $(this).closest('.plan').addClass('plan-bg');
    }, function () {
        $(this).closest('.plan').removeClass('plan-bg');
    });
	
	$('.account .menu .sections .list').on('scroll', function () {
		var scrollLeft = $(this)[0].scrollWidth - $(this).scrollLeft();
		console.log(scrollLeft);
		if (scrollLeft < $(this).width() + 30) {
			$(this).parent().addClass('scrolled');
		} else {
			$(this).parent().removeClass('scrolled');
		}
	});
	
	$('.cookies-informer button').on('click', function () {
		$.cookie('cia', '1', {expires: 365, path: '/'});
		$('.cookies-informer').remove();
	});
});