//sprite
export class Sprite{
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

export class TextSprite{
    constructor(text, font, size, color){
        this.text = text;
        this.font = font;
        this.size = size;
        this.color = color;
    }
    getStyle(){
        return this.size + "px " + this.font;
    }
}

export class Camera{
    constructor(x, y, w, h){
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
    }
    getViewPosition(objX, objY){
        let objViewX = objX - this.x;
        let objViewY = objY - this.y;
        return {
            objViewX: objViewX,
            objViewY: objViewY
        };
    }
    getView(){
        return{
            xA: this.x,
            yA: this.y,
            xB: this.x + this.width,
            yB: this.y + this.height
        };
    }
}

export class Animation{
    constructor(frames, delay, loop){
        this.currentFrame = 0;
        this.frames = frames;
        this.delay = delay;
        this.loop = loop;
        this.playing = false;
        this.clock = 0;
    }
    getCurrentSprite(){
        return this.frames[this.currentFrame];
    }
    playAnimation(){
        this.playing = true;
        this.currentFrame = 0;
        this.clock = 0;
    }
    stopAnimation(){
        this.playing = false;
    }
    toggleAnimation(){
        this.playing != this.playing;
    }
    updateAnimation(deltaTime){
        if(this.playing){
            if(this.clock <= this.delay){
                this.clock += deltaTime;
            }else{
                this.currentFrame++;
                this.clock = 0;
            }
        }
    }
} 

export class AnimationController{
    constructor(animations, currentAnimation){
        this.animations = animations; 
        this.currentAnimation = currentAnimation;
        this.sprite = animations[0].getCurrentSprite();
    }
    getCurrentAnimation(){
        return this.animations[this.currentAnimation];
    }
    getCurrentSprite(){
        return this.sprite;
    }
    controllerUpdate(deltaTime){
        this.animations[this.currentAnimation].updateAnimation(deltaTime);
        this.sprite = this.animations[this.currentAnimation].getCurrentSprite();
    }
    playAnimation(index){
        this.currentAnimation = index;
        this.animations[this.currentAnimation]
    }
}

export function getScreenWidth() {
    return Math.max(
      document.body.scrollWidth,
      document.documentElement.scrollWidth,
      document.body.offsetWidth,
      document.documentElement.offsetWidth,
      document.documentElement.clientWidth
    );
  }
  
export function getScreenHeight() {
    return Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight,
        document.documentElement.clientHeight
    );
}