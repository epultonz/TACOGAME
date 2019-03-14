/* File: HomingProjectile.js 
 *
 * Creates and initializes the HomingProjectile
 * overrides the update funciton of GameObject to define
 * simple Dye behavior
 */

/*jslint node: true, vars: true, white: true */
/*global gEngine, GameObject, LightRenderable, IllumRenderable, SpriteAnimateRenderable, vec2, Projectile */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

/**
 * A homing projectile is one that chases the hero in addition to damaging him. Should
 * have a shorter timer than normal projectiles.
 * 
 * @param {type} spriteTexture The texturesheet for the projectile's sprite.
 * @param {float} spawnX The X coord to start the object at
 * @param {float} spawnY The Y coord to start the object at
 * @param {Hero} heroRef A reference to the Hero obj
 * @param {Obj} spawningRef A reference to the enemy that shot this projectile (a flier)
 * @param {float} delta The speed at which the obj moves- should ALWAYS be positive
 *      since that'll determine its chase speed
 * @param {int} timer How many update ticks the projectile should last for.
 * @returns {HomingProjectile}
 */
function HomingProjectile(spriteTexture, spawnX, spawnY, heroRef, spawningRef, delta = 0.4, timer = 140) {
    /*
     * this.mWidth = 1.25;
    this.mHeight = 2;
    this.mHeroRef = heroRef;
    this.mDelta = delta;
    
    // pack variables
    this.mTimer = timer;
    this.mDeadTimer = 20;
    this.mHitHero = false;
    this.mDeflected = false;
    
    // sprite renderable 
    this.mProjectile = new SpriteRenderable(spriteTexture);
    this.mProjectile.setColor([1, 1, 1, 0]);
    this.mProjectile.getXform().setPosition(spawnX, spawnY);
    this.mProjectile.getXform().setSize(this.mWidth, this.mHeight);
    this.mProjectile.setElementPixelPositions(510, 595, 23, 153);
    this.mProjectile.getXform().incRotationByDegree(90); // Turn it sideways so the long end is left-right
    
    // Simplified minimap renderable
    this.mMinimapObj = new Renderable();
    this.mMinimapObj.setColor([.8, .8, .2, 0]);
    this.mMinimapObj.getXform().setPosition(spawnX, spawnY);
    this.mMinimapObj.getXform().setSize(this.kWidth, this.kHeight);
    this.mMinimapObj.getXform().incRotationByDegree(90);
    
    GameObject.call(this, this.mProjectile); // call GameObj constructor to finish construction
     */
    // Projectile Constructor call + Homing-Specific stuff
    Projectile.call(this, spriteTexture, spawnX, spawnY, heroRef, spawningRef, delta, timer);
    this.mDamage = 5; // How much damage the pack deals
    this.mProjectile.getXform().incRotationByDegree(-90); // Turn it back so that the projectile is top-bottom facing
    this.mMinimapObj.getXform().incRotationByDegree(-90);
    this.setCurrentFrontDir(vec2.fromValues(0, 1)); // set "forward" to be up
    
    this.mRigdRect = new RigidRectangle(this.mProjectile.getXform(), this.mWidth , this.mHeight);
    this.mRigdRect.setMass(0);
    this.mRigdRect.setVelocity(0, 0);
    this.setRigidBody(this.mRigdRect);
}
gEngine.Core.inheritPrototype(HomingProjectile, Projectile);

HomingProjectile.prototype.update = function () {
    //var returnBool =
    return Projectile.prototype.update.call(this);
    //this.mMinimapObj.rotateObjPointTo(this.mSpawningRef.getXform().getPosition(), 1);
    //return returnBool;
};

HomingProjectile.prototype.deflected = function() {
    // give a minimum duration to projectiles about to expire
    if(this.mTimer < 75)
        this.mTimer = 75;
    
    //rotate and point to spawnRef
    this.rotateObjPointTo(this.mSpawningRef.getXform().getPosition(), 1);   
    
    this.mHeroRef.setPetFollowVect(vec2.clone(this.getXform().getPosition()));
    //lets pet know that an actual deflection occured and to move to the projectile
    this.mHeroRef.wasDeflected();
    
    if(this.mDeflectKill)
        this.mHeroRef = this.mSpawningRef;
};

HomingProjectile.prototype.move = function() {
    if (!this.mDeflected)
    {
        this.mTargetPosition = this.mHeroRef.getXform().getPosition();
        //set frontdir
        this.rotateObjPointTo(this.mTargetPosition, 0.1);   
    }
    
    //use front dir to find velocity
    //change constant to increase velocity
    this.mRigdRect.setVelocity(20 * this.getCurrentFrontDir()[0], 20 * this.getCurrentFrontDir()[1]);
    //i have no idea but i think its working
    this.mRigdRect.travel();
};
