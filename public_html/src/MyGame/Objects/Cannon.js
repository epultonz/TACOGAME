/* File: Cannon.js 
 *
 * Creates and initializes the Cannon
 * overrides the update funciton of GameObject to define
 * simple Dye behavior
 */

/*jslint node: true, vars: true, white: true */
/*global gEngine, GameObject, LightRenderable, IllumRenderable, SpriteAnimateRenderable */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!


/**
 * The Cannon is a stationary object that the Hero can jump on without taking damage that
 * periodically shoots projectiles in its facing direction.
 *
 * @param {TextureInfo} spriteTexture The texturesheet for the cannon's sprite. Should be extended to have
 *     a "mirrored" sprite version as well so the patrol can flip between left/right facing.
 * @param {float} spawnX The X coord to start the object at
 * @param {float} spawnY The Y coord to start the object at
 * @param {Hero} heroRef A reference to the Hero obj
 * @param {GameObjectSet} setRef A reference to the set for Projectiles to become a part of
 * @param {int} shootTimer The amount of update ticks between projectile shots. Normally updates 60 times a second
 * @param {int} projectileTimer The amount of update ticks for projectiles to stay on screen
 * @param {float} projectileDelta The delta to give projectiles (how fast they move)
 *      should ALWAYS be positive!
 * @param {boolean} facingLeft Boolean to show if the cannon is facing left (true) or right (false)
 * @returns {Cannon}
 */
function Cannon(spriteTexture, spawnX, spawnY, heroRef, setRef, shootTimer = 300,
        projectileTimer = 300, projectileDelta = 0.4, facingLeft = true) {
    this.kWidth = 7;
    this.kHeight = 7;
    this.mHeroRef = heroRef;
    this.mSetRef = setRef;
    this.mShootTimerMax = shootTimer;
    this.mShootTimerCurr = shootTimer;
    this.mSpriteText = spriteTexture;
    this.mProjectileTimer = projectileTimer;
    this.mProjectileDelta = projectileDelta;
    this.mFacingLeft = facingLeft;
    
    // sprite renderable 
    this.mCannon = new SpriteRenderable(spriteTexture);
    this.mCannon.setColor([1, 1, 1, 0]);
    this.mCannon.getXform().setPosition(spawnX, spawnY);
    this.mCannon.getXform().setSize(this.kWidth, this.kHeight);
    this.mCannon.setElementPixelPositions(318,318+172,8,8+158);
    
    // simplified minimap renderable
    this.mMinimapObj = new Renderable();
    this.mMinimapObj.setColor([1, .2, .2, 0]);
    this.mMinimapObj.getXform().setPosition(spawnX, spawnY);
    this.mMinimapObj.getXform().setSize(this.kWidth, this.kHeight);
    
    GameObject.call(this, this.mCannon);
    
    // Physics vars so the hero can stand on the Cannon
    var r = new RigidRectangle(this.getXform(), this.kWidth , this.kHeight );
    this.setRigidBody(r);
    r.setMass(0);
    //this.toggleDrawRigidShape();
    
}
gEngine.Core.inheritPrototype(Cannon, GameObject);

Cannon.prototype.update = function () {
    GameObject.prototype.update.call(this);
    
    // Subtract one from the timer, and shoot if it's 0 (or less in case of glitch)
    this.mShootTimerCurr--;
    if(this.mShootTimerCurr <= 0)
    {
        this.mShootTimerCurr = this.mShootTimerMax;
        var currPos = this.getXform().getPosition();
        
        // Give a positive delta if going right, negative if going left
        var delta = this.mProjectileDelta;
        if(this.mFacingLeft)
            delta = 0 - delta;
        
        var bullet = new Projectile(this.mSpriteText,currPos[0], currPos[1], this.mHeroRef, delta, this.mProjectileTimer);
        this.mSetRef.addToSet(bullet);
    }
};

Cannon.prototype.draw = function (aCamera) {
    GameObject.prototype.draw.call(this, aCamera);
};

Cannon.prototype.drawMini = function (aCamera) {
    this.mMinimapObj.draw(aCamera);
};