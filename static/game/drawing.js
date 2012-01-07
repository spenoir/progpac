Drawing = (function () {
  return {
    cellDrawer: {
      draw: function(ctx, r, c, x, y, w, h) {
	var xcenter = (x + (w / 2)), ycenter = (y + (h / 2));
	ctx.beginPath();
	ctx.strokeStyle = "#cccccc";
	ctx.moveTo(xcenter, y);
	ctx.lineTo(xcenter, y + h);
	ctx.moveTo(x, ycenter);
	ctx.lineTo(x + w, ycenter);
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
    },

    nullDrawer: {
      draw: function (ctx, r, c, x, y, w, h) {}
    },

    pacpathDrawer: {
      draw: function (ctx, r, c, x, y, w, h, direction) {
	var xcenter = x + (w/2), ycenter = y + (h/2);

	ctx.save();
	ctx.beginPath();
	ctx.strokeStyle = "#ff0000";
	ctx.lineWidth = 3;
	ctx.moveTo(xcenter, ycenter);

	switch(direction) {
	case "n": ctx.lineTo(xcenter, ycenter + h); break;
	case "s": ctx.lineTo(xcenter, ycenter - h); break;
	case "e": ctx.lineTo(xcenter - w, ycenter); break;
	case "w": ctx.lineTo(xcenter + w, ycenter); break;
	default:
	  break;
	}

	ctx.stroke();
	ctx.restore();
      }
    }
  }
})();