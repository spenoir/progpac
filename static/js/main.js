$(document).ready(function() {
    var $editor = $('.editor textarea')

    $('.code_length').html($editor.val().length);

    $editor.on('keyup', function() { 
        $('.code_length').html($editor.val().length);
    });
});
