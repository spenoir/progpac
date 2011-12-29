function setup_code_counter() {
    var $code_size = $('.code-size');
    var $code_maxsize = $('.code-maxsize');
    var code = $('.editor textarea').val();

    var code_length = $.map(code.split("\n"), function(element) {
        return element.replace(/\s/g,"")
    }).join("").length;

    $code_size.html(code_length);

    if ($code_size.html() > $code_maxsize.html()) {
        $code_size.css('color', "#B94A48")
    } else {
        $code_size.css('color', "#468847")
    }
}

$(document).ready(function() {
    setup_code_counter();

    $('.editor textarea').on('keyup', function() { 
        setup_code_counter();
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
