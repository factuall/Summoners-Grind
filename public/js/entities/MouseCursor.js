import { Entity } from "/js/entities/bases/Entity.js";
import * as graphics from "/js/graphics.js";

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
    }

    updateObject(){
        
    }

    renderObject(){
        //todo render render correctly lol
        this.setCentralPosition(graphics.camera.x + (this.mouseX * graphics.zoom), graphics.camera.y + (this.mouseY * graphics.zoom));
        return super.renderObject();
    }

}