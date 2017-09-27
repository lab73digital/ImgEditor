var App = function () {
    var self = {};
    this._init = function () {
        self.canvas = document.getElementById('canvas');
        self.ctx = self.canvas.getContext('2d');
        self.$canvas = $(self.canvas);
        self.$overlay = $('.overlay');
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
        self.scaleSize = 0;


        self.imageLoader.addEventListener('change', handleImage, false);

        self.image.onload = function () {
            self.imageWidth = self.image.width;
            self.imageHeight = self.image.height;
            self.firstImageX = self.canvasWidth / 2;
            self.firstImageY = self.canvasHeight / 2;
            self.imageX = self.firstImageX;
            self.imageY = self.firstImageY;

            refreshBorders();

            refreshImg();
        };

        document.getElementById('clockwise').onclick = function () {
            self.angleInDegrees += 5;
            refreshImgPosition(1);
            refreshImg();
        };

        document.getElementById('counterclockwise').onclick = function () {
            self.angleInDegrees -= 5;
            refreshImgPosition(1);
            refreshImg();
        };

        document.getElementById('getImg').onclick = function () {
            getImg();
        };
        document.getElementById('flip').onclick = function () {
            flip();
        };

        document.getElementById('scalePlus').onclick = function () {
            scalePlus();
        };
        document.getElementById('scalePlus').onmousedown = function () {
            self.scalePlusInterval = setInterval(scalePlus, 50);
        };
        document.getElementById('scaleMinus').onclick = function () {
            scaleMinus();
        };
        document.getElementById('scaleMinus').onmousedown = function () {
            self.scaleMinusInterval = setInterval(scaleMinus, 50);
        };

        self.$overlay.mousedown(function (e) {
            handleMouseDown(e);
        });
        self.$body.mousemove(function (e) {
            handleMouseMove(e);
        });
        self.$body.mouseup(function (e) {
            handleMouseUp(e);
            clearInterval(self.scaleMinusInterval);
            clearInterval(self.scalePlusInterval);
        });
        self.$overlay.mouseout(function (e) {
            handleMouseOut(e);
        });
    };
    this.inputClick = function () {
        self.inputPhoto.click();
    };
    var getImg = function () {
        refreshImg(true);
        self.img = document.createElement('img');
        self.img.src = self.canvas.toDataURL();
        document.body.appendChild(self.img);
        refreshImg(false);
    };
    var flip = function () {
        if (self.flipX === -1) {
            self.flipX = 1;
            self.flip = false;
        } else {
            self.flipX = -1;
            self.flip = true;
        }
        self.flipY = 1;
        refreshImg();
    };
    var scaleMinus = function () {
        self.scaleMinus = -.02;
        self.scaleSize = self.scaleSize + self.scaleMinus;
        refreshScale();
        refreshBorders();
        refreshImgPosition();
        refreshImg();
    };
    var scalePlus = function () {
        self.scalePlus = .02;
        self.scaleSize = self.scaleSize + self.scalePlus;
        refreshScale();
        refreshBorders();
        refreshImgPosition();
        refreshImg();
    };
    var refreshScale = function () {
        self.imageWidth = self.image.width + (self.image.width * self.scaleSize);
        self.imageHeight = self.image.height + (self.image.height * self.scaleSize);
    };
    var refreshBorders = function () {
        self.minLeft = -(self.imageWidth * .2);
        self.minTop = -(self.imageHeight * .2);
        self.maxLeft = self.canvasWidth + (self.imageWidth * .2);
        self.maxTop = self.canvasHeight + (self.imageHeight * .2);
    };
    var refreshImgPosition = function () {
        if (self.imageX >= self.maxLeft) {
            self.imageX = self.maxLeft;
        }
        if (self.imageY >= self.maxTop) {
            self.imageY = self.maxTop;
        }
        if (self.imageX <= self.minLeft) {
            self.imageX = self.minLeft;
        }
        if (self.imageY <= self.minTop) {
            self.imageY = self.minTop;
        }
    };
    var refreshImg = function (getImg) {
        self.ctx.clearRect(0, 0, self.canvasWidth, self.canvasHeight);
        self.ctx.save();
        self.ctx.translate(self.imageX, self.imageY);
        self.ctx.scale(self.flipX, self.flipY);
        self.ctx.rotate(self.angleInDegrees * Math.PI / 180);
        if(getImg){
            var img = document.getElementById('ava-soccer');
            self.ctx.drawImage(self.image, -self.imageWidth / 2, -self.imageHeight / 2, self.imageWidth, self.imageHeight);
            self.ctx.restore();
            self.ctx.drawImage(img, 0, 0, img.width, img.height);
        } else {
            self.ctx.drawImage(self.image, -self.imageWidth / 2, -self.imageHeight / 2, self.imageWidth, self.imageHeight);
        }
        self.ctx.restore();
    };
    var handleImage = function (e) {
        var reader = new FileReader();
        reader.onload = function (event) {
            self.image.src = event.target.result;
            $('.uploader').hide();
        };
        if (e.target.files.length) {
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    var hitCanvas = function (x, y) {
        return (x > self.offsetX && x < self.offsetX + self.canvasWidth && y > self.offsetY && y < self.offsetY + self.canvasHeight);
    };

    var handleMouseDown = function (e) {
        self.startX = parseInt(e.clientX - self.offsetX);
        self.startY = parseInt(e.clientY - self.offsetY);
        self.draggingImage = hitCanvas(parseInt(e.clientX), parseInt(e.clientY));
    };

    var handleMouseUp = function (e) {
        self.draggingImage = false;
    };

    var handleMouseOut = function (e) {
        /*handleMouseUp(e);*/
    };

    var handleMouseMove = function (e) {
        if (self.draggingImage) {
            self.mouseX = parseInt(e.clientX - self.offsetX);
            self.mouseY = parseInt(e.clientY - self.offsetY);

            // move the image by the amount of the latest drag

            self.dx = self.mouseX - self.startX;
            self.dy = self.mouseY - self.startY;
            self.imageX += self.dx;
            self.imageY += self.dy;
            if (self.imageX >= self.maxLeft) {
                self.imageX = self.maxLeft;
            }
            if (self.imageY >= self.maxTop) {
                self.imageY = self.maxTop;
            }
            if (self.imageX <= self.minLeft) {
                self.imageX = self.minLeft;
            }
            if (self.imageY <= self.minTop) {
                self.imageY = self.minTop;
            }
            // reset the startXY for next time
            self.startX = self.mouseX;
            self.startY = self.mouseY;
            refreshImg();

        }
    };

};
var app = new App();
$(function () {
    app._init();
    $('#fblogin').on('click', function () {
        FB.login(function(response) {
            if (response.status === 'connected') {
                // Logged into your app and Facebook.
                console.log(response);
            } else {
                // The person is not logged into this app or we are unable to tell.
                console.log(response);
            }
        });
    });
    $('#fblogout').on('click', function () {
        FB.logout(function(response) {
            // Person is now logged out
            console.log(response);
        });
    });
});