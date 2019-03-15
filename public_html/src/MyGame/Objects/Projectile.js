/* File: Projectile.js 
 *
 * Creates and initializes the Projectile
 * overrides the update funciton of GameObject to define
 * simple Dye behavior
 */

/*jslint node: true, vars: true, white: true */
/*global gEngine, GameObject, LightRenderable, IllumRenderable, SpriteAnimateRenderable, vec2 */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

/**
 * A projectile is... well, a projectile. It can be "shot" by enemies and collides with the
 * hero, dealing damage to him upon hit.
 * 
 * @param {type} spriteTexture The texturesheet for the projectile's sprite.
 * @param {float} spawnX The X coord to start the object at
 * @param {float} spawnY The Y coord to start the object at
 * @param {Hero} heroRef A reference to the Hero obj
 * @param {Object} spawningRef A reference to the object that spawned the projectile
 * @param {float} delta The speed at which the obj moves- Should be positive for right-wards
 *      and negative for left-wards movement
 * @param {int} timer How many update ticks the projectile should last for.
 * @returns {Projectile}
 */
function Projectile(spriteTexture, spawnX, spawnY, heroRef, spawningRef, delta = 0.4, timer = 300) {
    this.mWidth = 3;
    this.mHeight = 3;
    this.mHeroRef = heroRef;
    this.mSpawningRef = spawningRef;
    this.mDelta = delta;
    
    /**
     * This flag determines if deflects should kill or not.
     * Set it to false to have deflected projectiles go right through their spawners.
     */
    this.mDeflectKill = true;
    
    // pack variables
    this.mTimer = timer;
    this.mDeadTimer = 20;
    this.mDamage = 10; // How much damage the pack deals
    this.mHitHero = false;
    this.mDeflected = false;
    
    // sprite renderable 
    this.mProjectile = new SpriteRenderable(spriteTexture);
    this.mProjectile.setColor([1, 1, 1, .1]);
    this.mProjectile.getXform().setPosition(spawnX, spawnY);
    this.mProjectile.getXform().setSize(this.mWidth, this.mHeight);
    this.mProjectile.setElementPixelPositions(0, 64, 0, 64);
    this.mProjectile.getXform().incRotationByDegree(90); // Turn it sideways so the long end is left-right
    
    // Simplified minimap renderable
    this.mMinimapObj = new Renderable();
    this.mMinimapObj.setColor([1, .6, 1, 1]);
    this.mMinimapObj.getXform().setPosition(spawnX, spawnY);
    this.mMinimapObj.getXform().setSize(this.mWidth, this.mHeight);
    //this.mMinimapObj.getXform().incRotationByDegree(90);
    
    GameObject.call(this, this.mProjectile); // call GameObj constructor to finish construction
}
gEngine.Core.inheritPrototype(Projectile, GameObject);

Projectile.prototype.update = function () {
    // Handle normal behavior only if we aren't currently shaking
    if(!this.mHitHero){
        
        // Decrease the lifespan of the pack
        this.mTimer--;

        // Check for pixel-perfect collisions with hero 
        
        /* Different cases
         * DeflectKill, NoKill
         * NotDeflected(hero), Deflected(Source)
         *
         * Kill + NotDeflect = hit Hero
         * NoKill + NotDeflect = hit Hero
         * Kill + Deflected = hit source
         * NoKill + Deflected = hit nothing
         * 
         * If not deflected, ALWAYS hit hero
         * If deflected, NEVER hit hero
         * If deflected and nokill, dont hit ANYTHING
         */
        
        /*
        var h = [];
        if(this.pixelTouches(this.mHeroRef, h)) // Hit Hero
        {
            if(this.mDeflectKill && this.mDeflected) // If deflected, we're hitting a cannon/flier
                this.mHeroRef.hit();
            else if (!this.mDeflected)// Otherwise, we must be hitting the hero (if not deflected)
                this.mHeroRef.tookDamage(this.mDamage);
            this.mHitHero = true;
            
        }*/
        /*
        else if(!this.mDeflected){ //dont redeflect if already deflected
         
            if(this.mHeroRef.isDeflecting()) {
                var deflectBox = new BoundingBox(this.mHeroRef.getXform().getPosition(),
                    15, 15);
                if (this.getBBox().intersectsBound(deflectBox)) {
                    this.mDeflected = true;
                }
            }
            if(this.mDeflected) {
                this.deflected();
            }
        }*/
        
        if(!this.mDeflected) // Check for hero collision if not deflected
        {
            var h = [];
            if(this.pixelTouches(this.mHeroRef, h))
            {
                this.mHeroRef.tookDamage(this.mDamage);
                this.mHitHero = true;
            }
            else // Dont re-deflect if already deflected
            {
                if(this.mHeroRef.isDeflecting())
                {
                    var deflectBox = new BoundingBox(this.mHeroRef.getXform().getPosition(),
                    15, 15);
                    if (this.getBBox().intersectsBound(deflectBox))
                    {
                    this.mDeflected = true;
                    }
                }
                if(this.mDeflected) {
                    this.deflected();
                }
            }
        }
        else // We must be deflected
        {
            if(this.mDeflectKill) // If we kill on deflect hit, check collision with spawner
            {
                var h = [];
                if(this.pixelTouches(this.mSpawningRef, h))
                {
                    this.mSpawningRef.hit();
                    this.mHitHero = true;
                }
            }
            // Otherwise, don't check any collision at all 
        }
        
        this.move();
        GameObject.prototype.update.call(this);
        
        // Destroyed if the timer is 0
        if(this.mTimer <= 0)
        {
            return false;
        }
    }
    
    // Otherwise, we must be shaking
    else
    {
        this.mDeadTimer--;
        
        // Increase the projectile's size for now
        var xf = this.getXform();
        var currSize = xf.getSize();
        xf.setSize(currSize[0] * 1.04, currSize[1] * 1.04);
        
        if(this.mDeadTimer <= 0)
            return false;
    }
    
    // Move the minimap object to the projectile's position
    var projPos = this.getXform().getPosition();
    this.mMinimapObj.getXform().setPosition(projPos[0], projPos[1]);
    
    // Return true if the projectile is still valid
    return true;
};

Projectile.prototype.checkDeflect = function() {
    
};

Projectile.prototype.deflected = function() {
    this.mDelta = -this.mDelta;
    if(this.mDeflectKill)
        this.mHeroRef = this.mSpawningRef;
    this.mHeroRef.setPetFollowVect(vec2.clone(this.getXform().getPosition()));
    this.mHeroRef.wasDeflected();
};

Projectile.prototype.move = function() {
    var currPos = this.getXform().getPosition();
    this.getXform().setPosition(currPos[0] + this.mDelta, currPos[1]);
};

Projectile.prototype.draw = function (aCamera) {
    GameObject.prototype.draw.call(this, aCamera);
};

Projectile.prototype.drawMini = function (aCamera) {
    this.mMinimapObj.draw(aCamera);
};

Projectile.prototype.setDeflectionKills = function(t) {
    this.mDeflectKill = t;
};