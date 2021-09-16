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

class Animation{
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

class AnimationController{
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