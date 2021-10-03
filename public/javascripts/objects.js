class Entity{
    constructor(){
        this.index = objects.length;
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
        drawObject(this.x, this.y, this.w, this.h, this.drawContent);
    }

    updateObject(){
        
    }
}

class Trash extends Entity{
    constructor(){
        super();
        this.entityType = "TrashEntity";
        this.name = "Trash";
        this.w = 0;
        this.h = 0;
    }
}

class CombatEntity extends Entity{
    constructor(){
        super();
        this.entityType = "CombatEntity";
        //stats
        this.maxHealth = 1200;
        this.maxMana = 200;
        this.health = this.maxHealth;
        this.mana = this.maxMana;
        this.moveSpeed = 4;
        //combat
        this.target = "None"
        this.range = 200;
        this.combatType = "range";
        this.attackDamage = 20;
        this.attackSpeed = 20;
        this.lastAttack = 0;
        //combat //important only if combat type is range
        this.projectileSpeed = 4;
    }

    dealDamage(damage){
        if(this.health >= damage)
        this.health -= damage;

    }

    tryToAttack(){
        if(this.lastAttack > (1000 / this.attackSpeed)){
            if(this.combatType == "melee") {
                this.lastAttack = 0;
                objects[this.target].dealDamage(this.attackDamage);
            }else{
                this.lastAttack = 0;
                objects.push(new Projectile(this, objects[this.target], this.projectileSpeed, this.attackDamage));
            }
        }
    }

    combatTarget(){
        if(this.target != "None"){
            if(objects[this.target].health <= 0) {
                this.target = "None";
                return;
            }
            let collided = false;
            objects.forEach(element => {
                if(CollisionDetection(this,element) && element!=this && cursor != element){
                    if(element.name == this.target.name) collided = true;
                    if(element.entityType == "CombatEntity" && !collided){
                        let destination = GetFacingVector(this, element);
                        this.move(destination.x*deltaTime,destination.y*deltaTime);
                    }
                }
    
            });
            if(!CollisionDetection(this,objects[this.target])){
                if(GetDistanceBetweenObjects(this,objects[this.target]) < this.range && this.combatType == "range"){
                    this.tryToAttack();
                }else{
                    let destination = GetFacingVector(this, objects[this.target]);
                    this.move(-destination.x*this.moveSpeed*deltaTime,-destination.y*this.moveSpeed*deltaTime);
                }
            }else if(this.combatType == "melee"){
                this.tryToAttack();
            }
        }
    }

    updateObject(){
        this.lastAttack++;
    }
}

class Player extends CombatEntity{
    constructor(){
        super();
        this.name = "Player";
        this.inPosition = true;
        this.underAttack = true;
        //skills
        this.skills = [];
        this.skills.push(new Skill("SkillQ", 0, 60));
        this.skills.push(new Skill("SkillW", 1, 200));
        this.skills.push(new Skill("SkillE", 2, 300));
        this.skills.push(new Skill("SkillR", 3, 400));
        //sprite
        this.drawContent = new Sprite("/img/hipek.png", 50, 50);
        //camera flag
        this.cameraFollow = true;
    }

    updateObject(){
        if(this.state == "move"){
            this.inPosition = (CollisionDetection(this, cursor));
            if(!this.inPosition){
                let destination = GetFacingVectorCC(this, cursor);
                this.move(-destination.x*4*deltaTime,-destination.y*4*deltaTime);
            }
            this.skills.forEach(playerSkill => {
                playerSkill.clock += deltaTime;
            });
        }else if(this.state == "target"){
            this.combatTarget();
            if(this.target == "None"){
                this.state = "move";
                cursor.x = this.x;
                cursor.y = this.y;
            }
        }
        super.updateObject();
    }

    renderObject(){
        super.renderObject();
        /************GUI***********/
        //health and mana bars
        HPBar.innerHTML = this.health + " / " + this.maxHealth;
        if(this.health > 0) HPBar.style.width = (100 * (this.health / this.maxHealth)) - 1 + "%";
        else HPBar.style.width = "0px";
        MPBar.innerHTML = this.mana + " / " + this.maxMana;
        if(this.mana > 0) MPBar.style.width = (100 * (this.mana / this.maxMana)) - 1 + "%";
        else MPBar.style.width = "0px";
        //skills
        this.skills.forEach(function(playerSkill, i){
            playerSkill.updateSkillLabel();
            SkillsGUI[i].style.filter = (playerSkill.clock >= playerSkill.cooldown) ? "brightness(100%)" : "brightness(50%)";
            let timeLeft = (playerSkill.cooldown - playerSkill.clock) / 60;
            SkillsGUI[i].innerHTML = playerSkill.label + ((playerSkill.clock >= playerSkill.cooldown) ? "" : HTMLBEAK + timeLeft.toFixed(1) + "s");
        });        
    }

    tryTarget(object){
        if(object.name == "Enemy"){
            this.target = object.index;
            return true;
        }
        return false;
    }

    stopTargetting(){
        this.target = "None";
    }

    playerInput(e){
        this.skills.forEach(playerSkill => {
            if(e.type == playerSkill.keybind && playerSkill.clock > playerSkill.cooldown){
                playerSkill.clock = 0;
            }
        });
    }
}

class Enemy extends CombatEntity{
    constructor(){
        super();
        this.x = 400;
        this.y = 400;
        this.name = "Enemy";
        this.enemyname = "Range"
        //stats
        this.health = 20;
        this.maxHealth = 20;
        this.mana = 200;
        this.maxMana = 200;
        this.moveSpeed = 1;
        //combat
        this.range = 200;
        this.attackDamage = 20;
        this.attackSpeed = 8;
        //sprite
        this.drawContent = new Sprite("/img/lucznik.png", 50, 50);
    }
    updateObject(){
        if(this.health > 0){
            if(this.target == "None"){
                let closest;
                let closestDist = Number.MAX_SAFE_INTEGER;
                objects.forEach(element => {
                    if(element.name == "Player" || element.name == "Ally"){
                        let distance = GetDistanceBetweenObjects(this, element);
                        if(distance < closestDist){
                            closestDist = distance;
                            closest = element.index;
                        }
                    }
                });
    
                this.target = closest;
            }else{
                this.combatTarget();
            }
            super.updateObject();
        }
    }
}

class Projectile extends Entity{
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
    }
    
    updateObject(){
        let destination = GetFacingVectorC(this, this.target);
        this.move(-destination.x*deltaTime*this.speed, -destination.y*deltaTime*this.speed);
    
        if(CollisionDetection(this,this.target)){
            this.target.dealDamage(this.damage);
            objects[this.index] = new Trash();
        }
    }
}