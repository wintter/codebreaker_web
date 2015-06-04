function start_new_game() {
    $('.change_number li a').click(false);
    $('.hint').click(false);
    $('.answer_comparison').append('<div class="font_size_14 font_opensans color_black"><span>Would you like start new game?<br/>' +
    '<a class="color_green font_size_20 new" href="#"><i class="glyphicon glyphicon-ok"> </i></a> <a class="color_red font_size_20 exit" href="#"><i class="glyphicon glyphicon-remove"> </i></a> </span></div>')
}
function save_result() {
    $.post("/save_result", function() {
    });
}
$(document).on('click', '.change_number li a', function() {
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
                    save_result();
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
$(document).on('ready',function() {
    $('[data-toggle="popover"]').popover();
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
$(document).on('click', '.login', function() {
   $('.login_input').removeClass('display_none');
   $('.login_button').removeClass('display_none');
});
$(document).on('click', '.logout', function() {
    $.post( "/logout", function( data ) {
        location.reload();
    });
});
$(document).on('click', '.login_button', function() {
   var name = $('.login_input').val();
   if (name.length == 0) { return false; }
    $.ajax({
        data: {username: name},
        type: "POST",
        url: "/add_session",
        success: function() {
            location.reload();
        }
    });
});
/*$(document).on('click', '.save_result', function() {
    var name = $('.input_name').val();
    $.ajax({
        data: {username: name},
        type: "POST",
        url: "/save_result",
        success: function(response) {
            console.log(response);
        }
    });
});*/
$(document).on('click', '.score', function() {
    var user = $('.user_name').text();
    $('.container-for-results').html('<tr style="font-weight:bold;"><td></td><td>Name</td><td>Attempts</td><td>Date</td></tr>');
    $.ajax({
        type: "POST",
        url: "/load_result",
        success: function(response) {
            $.each($.parseJSON(response), function(index, value) {
                var tr = user == value.username ? '<tr class="info"><td><i class="glyphicon glyphicon-user"> </i> </td>' : '<tr><td></td>'
                $('.container-for-results').append(tr + '<td>'+value.username+'</td><td>'+value.attempt+'</td><td>'+value.time+'</td></tr>')
            });
            $('.modal').modal('show');
        }
    });
});