var Overlay = {};
Overlay.Shapes = {};

(function() {

  var id = 82764;
  var ctx;
  var can;
  var overlayColor = 'rgba(0, 0, 0, 0.70)';
  var Shapes = Overlay.Shapes;

  this.init = function () {
    can = $('<canvas/>', {
      id: id,
    })
    .appendTo('body')
    .css({
      'display': 'block',
      'position': 'fixed',
      'top': 0,
      'left': 0,
      'z-index': 16232
    })[0];
    ctx = can.getContext('2d');
    this.refresh();
    window.addEventListener('resize', this.refresh, false);
  };

  this.refresh = function () {
    can.width = window.innerWidth;
    can.height = window.innerHeight;
    draw(ctx);
  };

  function draw (ctx) {
    drawOverlay(ctx);
    drawShape(Shapes.Ellipse, ctx, 'btn2', {type: 'normal'});
    drawShape(Shapes.Ellipse, ctx, 'btn4', {type: 'proportional'});
  }

  function drawShape (shape, ctx, id, config) {
    component = $('#' + id)
    offset = component.offset();
    x = offset.left - $(window).scrollLeft();
    y = offset.top - $(window).scrollTop();
    w = component.innerWidth()
    h = component.innerHeight()

    shape.draw(ctx, config, x, y, w, h);
  }

  function drawOverlay (ctx) {
    ctx.save();
    ctx.fillStyle = overlayColor;
    ctx.fillRect(0, 0, can.width, can.height);
    ctx.restore();
  }


}).call(Overlay);
Overlay.Shapes.Ellipse = {};

(function() {

  this.draw = function (ctx, config, x, y, w, h) {
    var ellipse;
    if (config.type === 'normal') {
      ellipse = getEllipseDimension(w, h);
    }
    else if (config.type === 'proportional') {
      ellipse = getEllipseDimensionWithSameProportion(w, h);
    }
    drawEllipse(ctx, x + w / 2, y + h / 2, ellipse.width, ellipse.height);
  };


  getEllipseDimensionWithSameProportion = function (rectWidth, rectHeight) {
    return {width: 2 * rectWidth / Math.sqrt(2), height: 2 * rectHeight / Math.sqrt(2)};
  }

  getEllipseDimension = function (rectWidth, rectHeight) {
    testEllipseWidth = function (ellipseWidth, rectWidth, rectHeight) {
      return (rectWidth * rectWidth / (4 * ellipseWidth * ellipseWidth) + 
             rectHeight * rectHeight / ((2 * ellipseWidth + rectHeight - rectWidth) * (2 * ellipseWidth + rectHeight - rectWidth)));
    }

    width1 = 0.5 * rectWidth;
    width2 = width1 * 2;
    while (testEllipseWidth(width2, rectWidth, rectHeight) > 1) {
      width2 = width2 * 2;
    }

    while (width2 - width1 > 1) {
      width3 = Math.round((width1 + width2) / 2);
      if (testEllipseWidth(width3, rectWidth, rectHeight) > 1)
        width1 = width3;
      else
        width2 = width3;
    }

    if (1 - testEllipseWidth(width2, rectWidth, rectHeight) > 1 - testEllipseWidth(width1, rectWidth, rectHeight)) {
      width = width1;
    }
    else {
      width = width2;
    }

    width *= 2;
    height = width - rectWidth + rectHeight;

    return { width: width, height: height }
  }

  drawEllipse = function (ctx, x, y, width, height) {
    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.translate(x, y);
    ctx.scale(width, height);
    ctx.beginPath()
    ctx.arc(0, 0, 0.5, 0, 2 * Math.PI, false);
    ctx.fill();
    ctx.restore();
  }

}).call(Overlay.Shapes.Ellipse);