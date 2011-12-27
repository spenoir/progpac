$(document).ready(function() {
    var $editor = $('.editor textarea')
    var $code_counter = $('.code-size')
    
    $code_counter.html($editor.val().length);

    $editor.on('keyup', function() { 
        $code_counter.html($editor.val().length);
    });

    $('.modal').modal({
        keyboard: true
    });
    
    $('.modal').find('.close, .secondary').click(function() {
        $(this).parents('.modal').modal('hide');
    });
});

function success() {
    $('.modal').modal('show');
}
