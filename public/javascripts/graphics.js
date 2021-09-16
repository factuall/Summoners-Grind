//sprite
class Sprite{
    constructor(url, width, height){
        this.url = url;
        this.width = width;
        this.height = height;
        this.image = new Image();
        this.image.src = this.url; 
        this.ready = false;
        this.image.onload = function() {
            this.ready = true;
        };
    }
}