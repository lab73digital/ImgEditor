var App = function () {
    var self = {};
    var minLeft, minTop, maxLeft, maxTop;
    this._init = function () {
        self.canvas = document.getElementById('canvas');
        self.ctx = self.canvas.getContext('2d');
        self.$canvas = $(self.canvas);
        self.$body = $('body');
        self.inputPhoto = document.getElementById('filePhoto');
        self.image = document.createElement('img');
        self.imageLoader = document.getElementById('filePhoto');

        self.canvasOffset = self.$canvas.offset();
        self.offsetX = self.canvasOffset.left;
        self.offsetY = self.canvasOffset.top;
        self.canvasWidth = self.$canvas.width();
        self.canvasHeight = self.$canvas.height();


        self.draggingImage = false;


        self.angleInDegrees = 0;
        self.scaleSize = 1;




        self.imageLoader.addEventListener('change', handleImage, false);

        self.image.onload = function () {
            self.imageWidth = self.image.width;
            self.imageHeight = self.image.height;
            self.imageRight = self.imageX + self.imageWidth;
            self.imageBottom = self.imageY + self.imageHeight;
            self.firstImageX = self.canvasWidth / 2 - self.imageWidth / 2;
            self.firstImageY = self.canvasHeight / 2 - self.imageHeight / 2;
            console.log(self.imageX, self.imageY);

            refreshImg();
        };

        document.getElementById('clockwise').onclick = function () {
            self.angleInDegrees += 15;
            refreshImg();
        };

        document.getElementById('counterclockwise').onclick = function () {
            self.angleInDegrees -= 15;
            refreshImg();
        };

        document.getElementById('scalePlus').onclick = function () {
            self.scaleSize += .1;
            refreshImg();
        };

        document.getElementById('scaleMinus').onclick = function () {
            self.scaleSize -= .1;
            refreshImg();
        };
        self.$canvas.mousedown(function (e) {
            handleMouseDown(e);
        });
        self.$body.mousemove(function (e) {
            handleMouseMove(e);
        });
        self.$body.mouseup(function (e) {
            handleMouseUp(e);
        });
        self.$canvas.mouseout(function (e) {
            handleMouseOut(e);
        });
    };
    this.inputClick = function () {
        self.inputPhoto.click();
    };
    var refreshImg = function () {
        self.ctx.clearRect(0, 0, self.canvasWidth, self.canvasHeight);
        self.ctx.save();
        self.ctx.translate(self.canvasWidth / 2, self.canvasHeight / 2);
        self.ctx.rotate(self.angleInDegrees * Math.PI / 180);
        self.ctx.scale(self.scaleSize, self.scaleSize);
        self.ctx.drawImage(self.image, 0, 0, self.image.width, self.image.height, self.imageX, self.imageY, self.imageWidth, self.imageHeight);
        self.ctx.restore();
    };
    var handleImage = function (e) {
        var reader = new FileReader();
        reader.onload = function (event) {
            self.image.src = event.target.result;
            $('.uploader').hide();
        };
        if(e.target.files.length) {
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    var hitCanvas = function(x, y) {
        return (x > self.offsetX && x < self.offsetX + self.canvasWidth && y > self.offsetY && y < self.offsetY + self.canvasHeight);
    };

    var handleMouseDown = function(e){
        self.startX = parseInt(e.clientX - self.offsetX);
        self.startY = parseInt(e.clientY - self.offsetY);
        self.draggingImage = hitCanvas(parseInt(e.clientX), parseInt(e.clientY));
    };

    var handleMouseUp = function(e){
        self.draggingImage = false;
        refreshImg();
    };

    var handleMouseOut = function(e){
        /*handleMouseUp(e);*/
    };

    var handleMouseMove = function(e){
        if (self.draggingImage) {

            self.mouseX = parseInt(e.clientX - self.offsetX);
            self.mouseY = parseInt(e.clientY - self.offsetY);

            // move the image by the amount of the latest drag
            self.dx = self.mouseX - self.startX;
            self.dy = self.mouseY - self.startY;
            self.imageX += self.dx;
            self.imageY += self.dy;
            self.imageRight += self.dx;
            self.imageBottom += self.dy;
            // reset the startXY for next time
            self.startX = self.mouseX;
            self.startY = self.mouseY;

            // redraw the image with border
            refreshImg();

        }
    };

};
var app = new App();
$(function () {
    app._init();
});