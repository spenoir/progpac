$(document).ready(function() {
    $('.editor textarea').on('keyup', function() { 
        $('.code_length').html(
            'Code length: '+ $(this).val().length
        );
    });
});
