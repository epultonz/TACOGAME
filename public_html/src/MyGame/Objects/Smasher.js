/* File: Smasher.js 
 *
 * Creates and initializes the Smasher
 * overrides the update funciton of GameObject to define
 * simple Dye behavior
 */

/*jslint node: true, vars: true, white: true */
/*global gEngine, GameObject, LightRenderable, IllumRenderable, SpriteAnimateRenderable */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

/**
 * The Smasher enemy constantly moves upwards, falling rapidly towards its botBound if it reaches
 * the topBound. If it falls onto the Hero, it damages him. The Hero can safely stand on top of
 * the Smasher.
 * 
 * @param {TextureInfo} spriteTexture The texturesheet for the smasher's sprite.
 * @param {float} spawnX The X coord to start the object at
 * @param {float} spawnY The Y coord to start the object at
 * @param {Hero} heroRef A reference to the Hero obj
 * @param {float} topBound The Y coord of the smasher's top boundary
 * @param {float} botBound The Y coord of the smasher's bot boundary
 * @param {float} velocityUp The speed at which the obj rises upwards
 * @param {float} velocityDown The speed at which the obj falls downwards. Should be higher than Up
 * @returns {Smasher} The completed object, ready to be called via update() and draw()
 */
function Smasher(spriteTexture, spawnX, spawnY, heroRef, topBound = (spawnY + 7.5), botBound = (spawnY - 7.5), velocityUp = 10, velocityDown = (velocityUp * -2.5)) {
    this.kWidth = 7;
    this.kHeight = 7;
    this.mHeroRef = heroRef;
    this.mSpriteText = spriteTexture;
    
    this.mTopBound = topBound;
    this.mBottomBound = botBound;
    this.mVelocityUp = velocityUp;
    this.mVelocityDown = velocityDown;
    this.mVelocity = velocityUp;

    
    // sprite renderable 
    this.mSmasher = new SpriteRenderable(spriteTexture);
    this.mSmasher.setColor([1, 1, 1, 0]);
    this.mSmasher.getXform().setPosition(spawnX, spawnY);
    this.mSmasher.getXform().setSize(this.kWidth, this.kHeight);
    this.mSmasher.setElementPixelPositions(0,64,64,128);
    
    this.mMinimapObj = new Renderable();
    this.mMinimapObj.setColor([1, .2, .2, 0]);
    this.mMinimapObj.getXform().setPosition(spawnX, spawnY);
    this.mMinimapObj.getXform().setSize(this.kWidth, this.kHeight);
    GameObject.call(this, this.mSmasher);
    
    var r = new RigidRectangle(this.mSmasher.getXform(), this.kWidth , this.kHeight);
    this.setRigidBody(r);
    r.setMass(1000);
    r.setInertia(0);  
    r.setVelocity(0,this.mVelocityUp);
   // r.setVelocity(0, this.mVelocity);
    //this.toggleDrawRigidShape();
    
}
gEngine.Core.inheritPrototype(Smasher, GameObject);

Smasher.prototype.update = function () {
    var smasherPos = this.getXform().getPosition();
    
    if(smasherPos[1] >= this.mTopBound) {
        this.mVelocity = this.mVelocityDown;
    }else if (smasherPos[1] <= this.mBottomBound) {
        this.mVelocity = this.mVelocityUp;
    }
    
    this._smashHero();
    
    this.getRigidBody().setVelocity(0,this.mVelocity);
    GameObject.prototype.update.call(this);    
    
};

Smasher.prototype._smashHero = function() {
    var thisBox = this.getBBox();
    var heroBox = this.mHeroRef.getBBox();
    var collideStatus = thisBox.boundCollideStatus(heroBox);
    // Only do collision detection if the hero isn't in hitstun/damageboost
    if(!this.mHeroRef.isHurt() && this.mVelocity < 0 && 
        (collideStatus === 8 || collideStatus === 9 || collideStatus === 10)) {
            this.mVelocity = this.mVelocityUp;
            this.mHeroRef.tookDamage(20);
        
    }
};

Smasher.prototype.draw = function (aCamera) {
    GameObject.prototype.draw.call(this, aCamera);
};

Smasher.prototype.drawMini = function (aCamera) {
    this.mMinimapObj.draw(aCamera);
};