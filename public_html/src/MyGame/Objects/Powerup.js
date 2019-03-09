/* File: Powerup.js 
 *
 * Creates and initializes the Powerup
 * overrides the update funciton of GameObject to define
 * simple Dye behavior
 */

/*jslint node: true, vars: true, white: true */
/*global gEngine, GameObject, LightRenderable, IllumRenderable, SpriteAnimateRenderable */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function Powerup(spriteTexture, atX, atY, heroRef) {
    this.kWidth = 3;
    this.kHeight = 3;
    this.mHeroRef = heroRef;
    this.mRespawnTimer = 300;
    this.mRespawningFlag = false;
    this.mSpriteText = spriteTexture;
    
    // sprite renderable 
    this.mPowerup = new SpriteRenderable(spriteTexture);
    this.mPowerup.setColor([1, 1, 1, 0]);
    this.mPowerup.getXform().setPosition(atX, atY);
    this.mPowerup.getXform().setSize(this.kWidth, this.kHeight);
    this.mPowerup.setElementPixelPositions(510, 595, 23, 153);
    
    this.mMinimapObj = new Renderable();
    this.mMinimapObj.setColor([.2, .8, .8, 0]);
    this.mMinimapObj.getXform().setPosition(atX, atY);
    this.mMinimapObj.getXform().setSize(this.kWidth, this.kHeight);
    
    GameObject.call(this, this.mPowerup);   
}
gEngine.Core.inheritPrototype(Powerup, GameObject);

Powerup.prototype.update = function () {
    GameObject.prototype.update.call(this);
    
    var thisBox = this.getBBox();
    var heroBox = this.mHeroRef.getBBox();
    var collideStatus = thisBox.boundCollideStatus(heroBox);
    // Only do collision detection if the powerup isn't still respawning and hero isn't full hp
    if((!this.mRespawningFlag) && (!this.mHeroRef.isAtFullHP()) && (collideStatus !== 0))
    {
        this.mRespawningFlag = true;
        this.mHeroRef.incHP(30);
        return true;
    }
    else // we must be respawning
    {
        this.mRespawnTimer--;
        if(this.mRespawnTimer <= 0)
        {
            this.mRespawnTimer = 300;
            this.mRespawningFlag = false;
        }
    }
    
    // Always return true for now, as this powerup respawns
    return true;
};

Powerup.prototype.draw = function (aCamera) {
    if(!this.mRespawningFlag)
        GameObject.prototype.draw.call(this, aCamera);
};

Powerup.prototype.drawMini = function (aCamera) {
    if(!this.mRespawningFlag)
        this.mMinimapObj.draw(aCamera);
};