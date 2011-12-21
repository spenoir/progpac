Drawing = (function () {
  return {
    cellDrawer: {
      draw: function(ctx, r, c, x, y, w, h) {
	var radius = 3

	ctx.beginPath();
	ctx.strokeStyle = "#cccccc",
	ctx.moveTo(x, y + radius);
	ctx.lineTo(x, y + h - radius);
	ctx.quadraticCurveTo(x, y + h, x + radius, y + h);
	ctx.lineTo(x + w - radius, y + h);
	ctx.quadraticCurveTo(x + w, y + h, x + w, y + h - radius);
	ctx.lineTo(x + w, y + radius);
	ctx.quadraticCurveTo(x + w, y, x + w - radius, y);
	ctx.lineTo(x + radius, y);
	ctx.quadraticCurveTo(x, y, x, y + radius);
	ctx.stroke();
      }
    },

    wallDrawer: {
      draw: function (ctx, r, c, x, y, w, h) {
      	ctx.beginPath();
      	ctx.fillStyle = "#000000";
	ctx.rect(x + 1, y + 1, w-2, h-2);
      	ctx.fill();
      }
    },

    pacmanDrawer: {
      draw: function (ctx, r, c, x, y, w, h, direction) {
	var centerX = x + (w/2), centerY = y + (h/2);
      	ctx.beginPath();
      	ctx.fillStyle = "#ff0000";
      	ctx.arc(centerX, centerY, (w/2), 0, Math.PI * 2, true);
      	ctx.fill();

	var grotX = centerX, grotY = centerY;
	switch(direction) {
	case "n": grotY -= (h/4); break;
	case "s": grotY += (h/4); break;
	case "e": grotX += (w/4); break;
	case "w": grotX -= (w/4); break;
	default:
	  break;
	}

	ctx.beginPath();
	ctx.fillStyle = "#000000";
	ctx.arc(grotX, grotY, 2, 0, Math.PI * 2, true);
	ctx.fill();
      }
    },

    pointDrawer: {
      draw: function (ctx, r, c, x, y, w, h) {
      	ctx.beginPath();
      	ctx.fillStyle = "#00DD00";
      	ctx.arc(x + (w/2), y + (h/2), 4, 0, Math.PI * 2, true);
      	ctx.fill();
      }
    },

    otherPointDrawer: {
      draw: function (ctx, r, c, x, y, w, h) {
      	ctx.beginPath();
      	ctx.fillStyle = "#000000";
      	ctx.arc(x + (w/2), y + (h/2), 5, 0, Math.PI * 2, true);
      	ctx.fill();
      }
    }
  }
})();