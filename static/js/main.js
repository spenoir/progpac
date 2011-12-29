function count_code() {
    var code = $('.editor textarea').val();

    return $.map(code.split("\n"), function(element) {
        return element.replace(/\s/g,"")
    }).join("").length;
}

$(document).ready(function() {
    var $editor = $('.editor textarea')
    var $code_counter = $('.code-size')
    
    var code_lenght = count_code();
    $code_counter.html(code_lenght);

    $editor.on('keyup', function() { 
        $code_counter.html(count_code());
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
