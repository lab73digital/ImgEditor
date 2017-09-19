var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var $canvas = $('#canvas');
var $body = $('body');
var canvasOffset = $canvas.offset();
var offsetX = canvasOffset.left;
var offsetY = canvasOffset.top;
var canvasWidth = $canvas.width();
var canvasHeight = $canvas.height();

var startX;
var startY;

var minLeft, minTop, maxLeft, maxTop;

var pi2 = Math.PI * 2;
var resizerRadius = 8;
var imageX = 50;
var imageY = 50;
var imageWidth, imageHeight, imageRight, imageBottom;
var draggingImage = false;
var inCanvas = false;
var mouseX;
var mouseY;


var img = new Image();
img.onload = function () {
    imageWidth = img.width;
    imageHeight = img.height;
    imageRight = imageX + imageWidth;
    imageBottom = imageY + imageHeight;
    draw(true, false);
};
img.src = 'http://start.parimatch.kz/ggg/img/belts/belt-2-active.png';


function draw(withAnchors, withBorders) {

    // clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // draw the image
    ctx.drawImage(img, 0, 0, img.width, img.height, imageX, imageY, imageWidth, imageHeight);

    // optionally draw the draggable anchors
    if (withAnchors) {
        drawDragAnchor(imageX, imageY);
        drawDragAnchor(imageRight, imageY);
        drawDragAnchor(imageRight, imageBottom);
        drawDragAnchor(imageX, imageBottom);
    }

    // optionally draw the connecting anchor lines
    if (withBorders) {
        ctx.beginPath();
        ctx.moveTo(imageX, imageY);
        ctx.lineTo(imageRight, imageY);
        ctx.lineTo(imageRight, imageBottom);
        ctx.lineTo(imageX, imageBottom);
        ctx.closePath();
        ctx.stroke();
    }

}

function drawDragAnchor(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, resizerRadius, 0, pi2, false);
    ctx.closePath();
    ctx.fill();
}


function hitCanvas(x, y) {
    return (x > offsetX && x < offsetX + canvasWidth && y > offsetY && y < offsetY + canvasHeight);
}


function handleMouseDown(e) {
    startX = parseInt(e.clientX - offsetX);
    startY = parseInt(e.clientY - offsetY);
    draggingImage = hitCanvas(startX, parseInt(e.clientY));
}

function handleMouseUp(e) {
    draggingImage = false;
    draw(true, false);
}

function handleMouseOut(e) {
    /*handleMouseUp(e);*/
}

function handleMouseMove(e) {

    if (draggingImage) {

        mouseX = parseInt(e.clientX - offsetX);
        mouseY = parseInt(e.clientY - offsetY);

        // move the image by the amount of the latest drag
        var dx = mouseX - startX;
        var dy = mouseY - startY;
        imageX += dx;
        imageY += dy;
        imageRight += dx;
        imageBottom += dy;
        // reset the startXY for next time
        startX = mouseX;
        startY = mouseY;

        // redraw the image with border
        draw(false, true);

    }


}


$canvas.mousedown(function (e) {
    handleMouseDown(e);
});
$body.mousemove(function (e) {
    handleMouseMove(e);
});
$body.mouseup(function (e) {
    handleMouseUp(e);
});
$canvas.mouseout(function (e) {
    handleMouseOut(e);
});