import * as graphics from "/js/graphics.js";
import { Entity } from "/js/entities/bases/Entity.js";

export class RepeatedBG extends Entity {
    constructor(){
        super();
        let sheetImage = new graphics.Sprite("/img/tiles.png");
        this.drawContent = new graphics.SpriteSheet(sheetImage, 30, 30, 32, 32);
        this.x = graphics.camera.x;
        this.y = graphics.camera.y;
        this.w = 32;
        this.h = 32;
        
    }

    updateObject(){
        if(Math.abs(this.x - graphics.camera.x) >= this.w) this.x = graphics.camera.x;
        if(Math.abs(this.y - graphics.camera.y) >= this.h) this.y = graphics.camera.y;
    }

    renderObject(){
        let tilesList = [];
        for (let iY = -2; iY < (graphics.getScreenHeight() / this.h) + 2; iY++) {
            for (let iX = -2; iX < (graphics.getScreenWidth() / this.w) + 2; iX++) {
                tilesList.push(this.getOffsetRenderOutput(iX, iY));
            }
        }

        return tilesList;
    }

    getOffsetRenderOutput(x, y){
        let output = super.renderObject();
        output.x = this.x + (x * this.w);
        output.y = this.y + (y * this.h);
        return output;
    }
}