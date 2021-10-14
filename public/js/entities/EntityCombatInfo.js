import { Entity } from './bases/Entity.js';
import * as graphics from "/js/graphics.js";

export class CombatEntityInfo extends Entity{
    constructor(owner){
        super();
        this.h = 8;
        this.w = 64;
        this.owner = owner;
        this.healthBar = new Entity();
        this.healthBar.w = 60;
        this.healthBar.h = 6;
        this.healthBar.drawContent = "#ff0000";
        this.healthText = new Entity();
        this.healthText.drawContent = new graphics.TextSprite("100%", "monospace", 15, "#ffffff");
    }
    updateObject(deltaTime){
        let healthPercentage = this.owner.health / this.owner.maxHealth;
        this.setCentralPosition(this.owner.ox, this.owner.y - 10);
        this.healthBar.setCentralPosition(this.x + (this.healthBar.w / 2) + 2, this.oy);
        this.healthBar.w = 60 * healthPercentage;
        this.healthText.setPosition(this.ox - ((this.healthText.drawContent.text.toString().length * this.healthText.drawContent.size) / 4), this.y + 9);
        this.healthText.drawContent.text = this.owner.health;
        super.updateObject(deltaTime);
    }
    /*renderObject(){
        if(this.owner.health < this.owner.maxHealth){
            super.renderObject();
            this.healthBar.renderObject();
            this.healthText.renderObject();   
        }
    }*/
}