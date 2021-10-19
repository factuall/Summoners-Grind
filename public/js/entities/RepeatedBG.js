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
        while(Math.abs(this.x - graphics.camera.x) > this.w) this.x -= ((this.x - graphics.camera.x) > 0) ? 32 : -32;
        while(Math.abs(this.y - graphics.camera.y) > this.h) this.y -= ((this.y - graphics.camera.y) > 0) ? 32 : -32;
    }

    renderObject(){
        let tilesList = [];
        for (let iY = -4; iY < (graphics.getScreenHeight() / this.h) + 4; iY++) {
            for (let iX = -4; iX < (graphics.getScreenWidth() / this.w) + 4; iX++) {
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