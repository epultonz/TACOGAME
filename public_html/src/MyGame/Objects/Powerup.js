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

// type is the type of powerup this is: 0 for healing, 1 for super saiyan, 2 for deflection
// respawnFlag and Timer is for respawning powerups - set it to false to delete it once picked up
// powerupTimer is how long a powerup (i.e. invuln) should last - Flag is if it's active
function Powerup(spriteTexture, atX, atY, heroRef, type = 0, respawnFlag = true, respawnTimer = 300, powerupTimer = 480) {
    this.kWidth = 3;
    this.kHeight = 3;
    this.mHeroRef = heroRef;
    this.mRespawnTimerCurr = respawnTimer;
    this.mRespawnTimerMax = respawnTimer;
    this.mWillRespawn = respawnFlag;
    this.mRespawningFlag = false;
    this.mSpriteText = spriteTexture;
    this.mPowerType = type;
    this.mPowerupActiveFlag = false;
    this.mPowerupTimerCurr = powerupTimer;
    this.mPowerupTimerMax = powerupTimer;
    
    // sprite renderable 
    this.mPowerup = new SpriteRenderable(spriteTexture);
    
    this.mPowerup.getXform().setPosition(atX, atY);
    this.mPowerup.getXform().setSize(this.kWidth, this.kHeight);
    
    // Different colors for different powerup types
    if(type === 0){
        this.mPowerup.setColor([0, 1, 0, .2]);
        this.mPowerup.setElementPixelPositions(64, 128, 128, 192);
    }else if(type === 1){
        this.mPowerup.setColor([0, 0, 1, .2]);
        this.mPowerup.setElementPixelPositions(64, 128, 64, 128);
    }else if(type === 2){
        this.mPowerup.setColor([1, 0, 0, .2]);
        this.mPowerup.setElementPixelPositions(0, 64, 128, 192);
    }else
        this.mPowerup.setColor([1, 1, 1, 0]);
    
    this.mMinimapObj = new Renderable();
    this.mMinimapObj.setColor([.9, .9, .3, 1]);
    this.mMinimapObj.getXform().setPosition(atX, atY);
    this.mMinimapObj.getXform().setSize(this.kWidth, this.kHeight);
    
    GameObject.call(this, this.mPowerup);   
}
gEngine.Core.inheritPrototype(Powerup, GameObject);

Powerup.prototype.update = function () {
    GameObject.prototype.update.call(this);
    
    if(this.mPowerupActiveFlag) // If we currently have a powerup running...
    {
        this.mPowerupTimerCurr--;
        if(this.mPowerupTimerCurr === 0) // If the powerup's timer is over...
        {
            if(this.mPowerType === 1) // Invulnerability should be turned off
                this.mHeroRef.activateSuper();
            if(this.mPowerType === 2) {
                this.mHeroRef.setCanDeflect(false);
            }
                    
            if(!this.mWillRespawn) // If it shouldn't respawn, delete it after ending its powerup
                return false;
            else // If it should, then reset the variables for another round to occur
            {
                this.mPowerupActiveFlag = false;
                this.mPowerupTimerCurr = this.mPowerupTimerMax;
            }
        }
    }
    
    // Only check collision if we aren't respawning AND we don't have a powerup running atm
    else if(!this.mRespawningFlag)
    {
        var thisBox = this.getBBox();
        var heroBox = this.mHeroRef.getBBox();
        var collideStatus = thisBox.boundCollideStatus(heroBox);

        if(this.mPowerType === 0) // Healing
        {
            // If the hero isn't at full, and the hero's colliding with pack
            if((this.mHeroRef.getHP() !== 100) && (collideStatus !== 0))
            {
                this.mHeroRef.incHP(40);
               
                if(!this.mWillRespawn)
                    return false; 
                else
                {
                    this.mRespawningFlag = true;
                    return true;
                }
            }
        }

        else if (this.mPowerType === 1) // Invulnerability
        {
            // If the hero's colliding with pack
            if(collideStatus !== 0)
            {
                // Activate super and wait till the timer runs out to turn it off
                this.mHeroRef.activateSuper();
                this.mPowerupActiveFlag = true;
                // Respawn flag always activated- if unnecessary, it'll never come up
                // as the powerup will be deleted before respawning calculations take place
                this.mRespawningFlag = true;
                return true;
            }
        }
        
        if(this.mPowerType === 2) // Deflecting
        {
            // If the hero can't already deflect and is colliding with pack
            if((!this.mHeroRef.getCanDeflect()) && (collideStatus !== 0))
            {
                this.mHeroRef.setCanDeflect(true);
                this.mPowerupActiveFlag = true;
                // Respawn flag always activated- if unnecessary, it'll never come up
                // as the powerup will be deleted before respawning calculations take place
                this.mRespawningFlag = true;
                return true;
            }
        }
    }
    
    
    else if (this.mRespawningFlag) // if respawning...
    {
        this.mRespawnTimerCurr--;
        if(this.mRespawnTimerCurr <= 0)
        {
            this.mRespawnTimerCurr = this.mRespawnTimerMax;
            this.mRespawningFlag = false;
        }
    }
    
    // Always return true if we reach the end- non-respawning powerups always return false on pickup
    return true;
};

Powerup.prototype.draw = function (aCamera) {
    // Only draw if it isn't respawning or currently in use by hero
    if((!this.mRespawningFlag) && (!this.mPowerupActiveFlag))
        GameObject.prototype.draw.call(this, aCamera);
};

Powerup.prototype.drawMini = function (aCamera) {
    if((!this.mRespawningFlag) && (!this.mPowerupActiveFlag))
        this.mMinimapObj.draw(aCamera);
};