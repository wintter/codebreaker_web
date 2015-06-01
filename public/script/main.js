function start_new_game() {
    $('.change_number li a').click(false);
    $('.hint').click(false);
    $('.answer_comparison').append('<div class="font_size_14 font_opensans color_black"><span>Would you like start new game?<br/>' +
    '<a class="color_green font_size_20 new" href="#"><i class="glyphicon glyphicon-ok"> </i></a> <a class="color_red font_size_20 exit" href="#"><i class="glyphicon glyphicon-remove"> </i></a> </span></div>')
}
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
                    $('[data-toggle="tooltip"]').tooltip('destroy');
                    $('.answer_comparison').html('<span class="color_red font_size_25">'+response+'</span>');
                    start_new_game();
                } else if (response == '++++') {
                    $('[data-toggle="tooltip"]').tooltip('destroy');
                    $('.answer_comparison').html('<span class="color_green font_size_25">You win!</span>');
                    $('#emitter').pburst('burst_part', 200);
                    start_new_game();
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
$(document).on('click', '.exit', function() {
    $( ".codebreaker-container" ).slideToggle( "slow", function() {
        $(".after_exit").html('<div class="text_center" style="margin-top:300px;"><img src="public/image/Goodbye.gif" /></div>');
        $(".after_exit" ).animate({
            fontSize: "3em",
            borderWidth: "10px"
        }, 500 );
    });
});
$(document).on('click', '.new', function() {
    location.reload();
});