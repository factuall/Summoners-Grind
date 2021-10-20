import { Entity } from "/js/entities/bases/Entity.js";
import * as mathhelper from "/js/mathhelper.js";
import * as graphics from "/js/graphics.js";
import { objects } from "/js/gamemodule.js";

export class MouseCursor extends Entity{
    constructor(){
        super();
        this.name = "Mouse Cursor";
        this.w = 32;
        this.h = 32;
        this.mouseX = 0;
        this.mouseY = 0;
        let cursorsImage = new graphics.Sprite("/img/cursor.png");
        this.drawContent = new graphics.SpriteSheet(cursorsImage, 7, 20, 32, 32);
        //this.drawContent = "#000000"
        this.currentCursor = 0;
        this.currentFrame = 0;
    }

    updateObject(){
        objects.forEach(obj => {
            if(mathhelper.CollisionDetection(this, obj)){
                if(obj.name == "Enemy") this.requestCursor(CURSOR_AIM);
            }
            
        });
        switch(this.currentCursor){
            case CURSOR_IDLE:
                this.drawContent.currentRow = 3;
                this.drawContent.currentColumn = 0;
                break;
            case CURSOR_AIM:
                this.drawContent.currentRow = 0;
                this.drawContent.currentColumn = 0;
                break;
            case CURSOR_BUSY:
                this.drawContent.currentRow = 2;
                this.drawContent.currentColumn = 0;
                break;
            case CURSOR_ARROW:
                this.drawContent.currentRow = 4;
                this.drawContent.currentColumn = this.currentFrame;
                break;
        }
        this.currentCursor = 0;
    }

    requestCursor(index){
        if(index > this.currentCursor) this.currentCursor = index;
    }

    renderObject(){
        //todo render render correctly lol
        this.setCentralPosition(graphics.camera.x + (this.mouseX * graphics.zoom), graphics.camera.y + (this.mouseY * graphics.zoom));
        return super.renderObject();
    }

}

let counter = 0;
function auto(){
    counter += 1;
    return counter - 1;
}

export const CURSOR_IDLE = auto();
export const CURSOR_AIM = auto();
export const CURSOR_BUSY = auto();
export const CURSOR_ARROW = auto();
export const CURSOR_HAND = auto();
export const CURSOR_STOP = auto();