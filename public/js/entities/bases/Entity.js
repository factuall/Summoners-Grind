export class Entity{
    constructor(){
        this.index = 0;
        this.entityType = "Entity";
        this.name = "Object";
        this.x = 0; 
        this.y = 0;
        this.w = 50;
        this.h = 50;
        this.ox = this.x + (this.w/2);
        this.oy = this.y + (this.h/2);
        this.drawContent = "#000000";
    }

    updateCetralPosition(){
        this.ox = this.x + (this.w/2);
        this.oy = this.y + (this.h/2);
    }

    move(x,y){
        this.x += x;
        this.y += y;
        this.updateCetralPosition();
    }

    setPosition(x,y){
        this.x = x;
        this.y = y;
        this.updateCetralPosition();
    }

    setCentralPosition(x,y){
        this.ox = x;
        this.oy = y;
        this.x = this.ox - (this.w/2);
        this.y = this.oy - (this.h/2);
    }

    renderObject(){
        return({
            x: this.x,
            y: this.y,
            w: this.w,
            h: this.h,
            drawContent: this.drawContent
        });
    }

    updateObject(deltaTime){
        
    }

    bundle(){
        return this;
    }
}