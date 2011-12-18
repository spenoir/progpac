$(document).ready(function() {
    
    var canvas = $('canvas')[0];
    var lines = $('canvas').html().split("\n")

    if (canvas.getContext) {
        var ctx = canvas.getContext("2d");

        $.each(lines, function(i, line) {
            $.each(line, function(j, element) {
                if (element == ".") {
                    ctx.fillStyle="#FF0000";
                    ctx.fillRect(j*22, i*22, 22, 22);
                } else {
                    ctx.fillStyle="#FF00FF";
                    ctx.fillRect(j*22, i*22, 22, 22);
                }
            });
        });
    }
    
});
