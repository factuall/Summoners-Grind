class Life{
    constructor(){
        this.index = objects.length;
        this.name = "Object";
        this.x = 0; 
        this.y = 0;
        this.w = 50;
        this.h = 50;
        this.c = "#000000";
        this.ox = this.x + (this.w/2);
        this.oy = this.y + (this.h/2);
        this.sprite = "none";
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


}

class Trash extends Life{
    constructor(){
        super();
        this.name = "Trash";
        this.w = 0;
        this.h = 0;
    }
}

class Player extends Life{
    constructor(){
        super();
        this.name = "Player";
        this.c = "#88ff88";
        this.inPosition = true;
        this.underAttack = true;
        //stats
        this.health = 1000;
        this.maxHealth = 1200;
        this.mana = 200;
        this.maxMana = 200;
        //skills
        this.skills = [];
        this.skills.push(new Skill("KeyQ", "Q", 60));
        this.skills.push(new Skill("KeyW", "W", 200));
        this.skills.push(new Skill("KeyE", "E", 300));
        this.skills.push(new Skill("KeyR", "R", 400));
        //sprite
        this.sprite = new Sprite("/img/hipek.png", 50, 50);
    }

    damagePlayer(damage){
        if(this.health >= damage)
        this.health -= damage;

    }

    updatePlayer(){
        this.inPosition = (CollisionDetection(this, cursor));
        if(!this.inPosition){
            let destination = GetFacingVectorCC(this, cursor);
            this.move(-destination.x*4*deltaTime,-destination.y*4*deltaTime);
        }
        this.skills.forEach(playerSkill => {
            playerSkill.clock += deltaTime;
        });

    }

    updateGUI(){
        //health and mana bars
        HPBar.innerHTML = this.health + " / " + this.maxHealth;
        HPBar.style.width = (100 * (this.health / this.maxHealth)) - 1 + "%";
        MPBar.innerHTML = this.mana + " / " + this.maxMana;
        MPBar.style.width = (100 * (this.mana / this.maxMana)) - 1 + "%";
        
        //skills
        this.skills.forEach(function(playerSkill, i){
            SkillsGUI[i].style.backgroundColor = (playerSkill.clock >= playerSkill.cooldown) ? "gray" : "rgb(55,55,55)";
            let timeLeft = (playerSkill.cooldown - playerSkill.clock) / 60;
            SkillsGUI[i].innerHTML = playerSkill.label + ((playerSkill.clock >= playerSkill.cooldown) ? "" : HTMLBEAK + timeLeft.toFixed(1) + "s");
        });
    }

    

    inputKey(e){
        this.skills.forEach(playerSkill => {
            if(e.code == playerSkill.keycode && playerSkill.clock > playerSkill.cooldown){
                playerSkill.clock = 0;
            }
        });
    }
};

class Enemy extends Life{
    constructor(){
        super();
        this.x = 400;
        this.y = 400;
        this.c = "#ff3333";
        this.attackDamage = 20;
        this.attackSpeed = 8;
        this.lastAttack = 0;
        this.name = "Enemy";
        this.enemyname = "Range"
        this.target = "None"
        this.range = 200;
        //melee or range
        this.enemyType = "melee";
        this.sprite = new Sprite("/img/lucznik.png", 50, 50);
    }
    updateEnemy(){
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
        }

        let collided = false;
        objects.forEach(element => {
            if(CollisionDetection(this,element) && element!=this && cursor != element){
                if(element.name == "Player") collided = true;
                if(element.name == "Enemy" && !collided){
                    let destination = GetFacingVector(this, element);
                    this.move(destination.x*deltaTime,destination.y*deltaTime);
                    collided = true;
                }
            }

        });
        if(!CollisionDetection(this,objects[this.target])){
            if(GetDistanceBetweenObjects(this,objects[this.target]) < this.range && this.enemyType == "range"){
                this.tryToAttack();
            }else{
                let destination = GetFacingVector(this, objects[this.target]);
                this.move(-destination.x*deltaTime,-destination.y*deltaTime);
            }
        }else if(this.enemyType == "melee"){
            this.tryToAttack();
        }
        this.lastAttack++;
    }
    
    tryToAttack(){
        if(this.lastAttack > 1000 / this.attackSpeed){
            if(this.enemyType == "melee") {
                this.lastAttack = 0;
                player.damagePlayer(this.attackDamage);
            }else{
                this.lastAttack = 0;
                objects.push(new Projectile(this, objects[this.target], 4, this.attackDamage));
            }
        }

    }
}

class Projectile extends Life{
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
        this.c = "#ffff33";
        this.name = "Projectile";
    }
    
    updateProjectile(){
        let destination = GetFacingVectorCC(this, this.target);
        this.move(-destination.x*deltaTime*this.speed, -destination.y*deltaTime*this.speed);
    
        if(CollisionDetection(this,this.target)){
            if(this.target.name == "Player") this.target.damagePlayer(this.damage);
            objects[this.index] = new Trash();
        }
    }
};