/* File: Flier.js 
 *
 * Creates and initializes the Flier
 * overrides the update funciton of GameObject to define
 * simple Dye behavior
 */

/*jslint node: true, vars: true, white: true */
/*global gEngine, GameObject, LightRenderable, IllumRenderable, SpriteAnimateRenderable */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

/**
 * 
 * @param {TextureInfo} spriteTexture The texturesheet for the flier's sprite. Should be extended to have
 *     a "mirrored" sprite version as well so the flier can flip between left/right facing.
 * @param {float} spawnX The X coord to start the object at
 * @param {float} spawnY The Y coord to start the object at
 * @param {Hero} heroRef A reference to the Hero obj
 * @param {GameObjectSet} setRef A reference to the set for Projectiles to become a part of
 * @param {int} shootTimer The amount of update ticks between projectile shots. Normally updates 60 times a second
 * @param {int} projectileTimer The amount of update ticks for projectiles to stay on screen
 * @param {float} projectileDelta The delta to give projectiles (how fast they move)
 *      should ALWAYS be positive!
 * @param {float} patrolDelta the speed at which the flier should be patrolling
 * @param {float} patrolDist the furthest distance away from the spawn a flier should patrol to
 * @param {int} patrolTimer the amount of time between switching patrol target locations
 * @returns {Flier}
 */
function Flier(spriteTexture, spawnX, spawnY, heroRef, setRef, shootTimer = 500,
        projectileTimer = 180, projectileDelta = 0.4, patrolDelta = 0.025,
        patrolDist = 15, patrolTimer = 400) {
    // Renderable Vars
    this.mSpriteText = spriteTexture;
    this.kWidth = 3;
    this.kHeight = 5.25;
    
    // Projectile Vars
    this.mHeroRef = heroRef;
    this.mSetRef = setRef;
    this.mShootTimerCurr = shootTimer;
    this.mShootTimerMax = shootTimer;
    this.mProjectileTimer = projectileTimer;
    this.mProjectileDelta = projectileDelta;
    
    // Interpolating/Patroling vars
    this.mSpawnX = spawnX;
    this.mSpawnY = spawnY;
    this.mPatrolDelta = patrolDelta;
    this.mPatrolDist = patrolDist;
    this.mPatrolTimerCurr = 0;
    this.mPatrolTimerMax = patrolTimer;
    
    
    // sprite renderable 
    this.mFlier = new SpriteRenderable(spriteTexture);
    this.mFlier.setColor([1, 1, 1, 0]);
    this.mFlier.getXform().setPosition(spawnX, spawnY);
    this.mFlier.getXform().setSize(this.kWidth, this.kHeight);
    this.mFlier.setElementPixelPositions(598,598+104,2,2+180);
    
    // Interpolation vars for patrolling
    this.mInterpolatePos = new InterpolateVec2(
            this.mFlier.getXform().getPosition(), patrolTimer, patrolDelta);
    this.mTargetPos = [spawnX, spawnY];
    
    this.mMinimapObj = new Renderable();
    this.mMinimapObj.setColor([1, .2, .2, 0]);
    this.mMinimapObj.getXform().setPosition(spawnX, spawnY);
    this.mMinimapObj.getXform().setSize(this.kWidth, this.kHeight);
    
    GameObject.call(this, this.mFlier);   
    
    /*
    var r = new RigidRectangle(this.getXform(), this.kWidth , this.kHeight );
    this.setRigidBody(r);
    r.setMass(0);
    */
    //this.toggleDrawRigidShape();
}
gEngine.Core.inheritPrototype(Flier, GameObject);

Flier.prototype.update = function () {
    GameObject.prototype.update.call(this);
    
    // get the current position for projectile spawning and patrolling
    var currPos = this.getXform().getPosition();
    
    this.mShootTimerCurr--;
    if(this.mShootTimerCurr <= 0)
    {
        this.mShootTimerCurr = this.mShootTimerMax;
        var bullet = new HomingProjectile(this.mSpriteText,currPos[0], currPos[1], this.mHeroRef, true);
        this.mSetRef.addToSet(bullet);
    }
    
    // Patrol randomly within a square around its spawn
    this.mPatrolTimerCurr--;
    if (this.mPatrolTimerCurr <= 0)
    {
        var timerVariation = (this.mPatrolTimerMax / 5) * (Math.random() - 0.5);
        this.mPatrolTimerCurr = this.mPatrolTimerMax + timerVariation;
        this.mInterpolatePos = new InterpolateVec2(this.mFlier.getXform().getPosition(), 
                this.mPatrolTimerMax, this.mPatrolDelta);
        
        var newX = this.mSpawnX + (this.mPatrolDist * (Math.random() - 0.5));
        var newY = this.mSpawnY + (this.mPatrolDist * (Math.random() - 0.5));
        
        var targetVect = vec2.fromValues(newX, newY);
        this.mInterpolatePos.setFinalValue(targetVect);
    }
    
    // Finally, update the interpolation
    this.mInterpolatePos.updateInterpolation();
    
    /*
    //bobbing up/down 
    var fPos = this.mFlier.getXform().getYPos();
    var fDownTarget = this.yPos-7;
    var delta = 0.05;
    if(this.touchUp){
        this.mFlier.getXform().incYPosBy(-delta);
    }else if(!this.touchUp){
        this.mFlier.getXform().incYPosBy(delta);
    }
    if(fPos >= this.yPos){
        this.touchUp = true;
    } else if(fPos <= fDownTarget){this.touchUp = false;}
    */
};

Flier.prototype.draw = function (aCamera) {
    GameObject.prototype.draw.call(this, aCamera);
};

Flier.prototype.drawMini = function (aCamera) {
    this.mMinimapObj.draw(aCamera);
};