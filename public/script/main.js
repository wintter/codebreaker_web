$(document).on('click', '.change_number li a', function() {
    $('[data-toggle="popover"]').popover('hide');
    if($('.user_code').text().length >= 4) {
        $('.user_code').text('');
        $('.answer_comparison').text('');
    }
    $('.user_code').text($('.user_code').text()+$(this).text());
    if($('.user_code').text().length == 4) {
        $.ajax({
            data: {val: $('.user_code').text()},
            type: "POST",
            url: "/comparison",
            success: function(response) {
                if(response == 'Game over') {
                    $('[data-toggle="tooltip"]').tooltip('hide');
                    $('.user_code').html('<span style="font-size:14px;color:red;">'+response+'</span>');
                } else if (response == '++++') {
                    $('.user_code').html('<span style="font-size:14px;color:red;">You win</span>');
                } else {
                $('.answer_comparison').text(response);
                }
            }
        });
    }
});
$(document).on('click', '.hint', function() {
    $.ajax({
        url: "/hint",
        success: function(response) {
            if(!response) {
                $('[data-toggle="tooltip"]').tooltip('show');
            }
            $('.user_code').text('');
            $('.answer_comparison').text(response);
        }
    });
});
$(document).ready(function() {
    $('[data-toggle="popover"]').popover('show');
});
