import { Entity } from "/js/entities/bases/Entity.js";

export class Hitbox extends Entity{
    constructor(owner){
        super();
        this.owner = owner;
        this.name = "Hitbox";
        this.w = owner.w + 50;
        this.h = owner.h + 50;
        this.drawContent = "#00ff0000";
    }

    updateObject(){
        this.setCentralPosition(this.owner.ox, this.owner.oy);
    }
}