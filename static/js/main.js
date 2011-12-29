function count_code() {
    var code = $('.editor textarea').val();

    return $.map(code.split("\n"), function(element) {
        return element.replace(/\s/g,"")
    }).join("").length;
}

$(document).ready(function() {
    var $code_counter = $('.code-size')
    
    $code_counter.html(count_code());

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
