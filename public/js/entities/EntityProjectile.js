import { Entity } from './bases/Entity.js';

export class Projectile extends Entity{
    constructor(source, target, speed, damage){
        super();
        this.source = source;
        this.target = target;
        this.speed = speed;
        this.damage = damage;
        this.w = 10;
        this.h = 10;
        this.x = source.ox - (this.w / 2);
        this.y = source.oy - (this.h / 2);
        this.updateCetralPosition();
        this.drawContent = "#ffff33";
        this.name = "Projectile";
        //tempAudioSrc('/sounds/spell_ice.wav');
    }
    
    updateObject(deltaTime){
        let destination = mathhelper.GetFacingVectorC(this, this.target);
        this.move(-destination.x*deltaTime*this.speed, -destination.y*deltaTime*this.speed);
    
        if(mathhelper.CollisionDetection(this,this.target)){
            this.target.dealDamage(this.damage);
            objects[this.index] = new Trash();
        }
    }
}