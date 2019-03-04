/* File: Projectile.js 
 *
 * Creates and initializes the Projectile
 * overrides the update funciton of GameObject to define
 * simple Dye behavior
 */

/*jslint node: true, vars: true, white: true */
/*global gEngine, GameObject, LightRenderable, IllumRenderable, SpriteAnimateRenderable */
/* find out more about jslint: http://www.jslint.com/help.html */

function Projectile(spriteTexture, atX, atY, heroRef, leftFacing) {
    this.mWidth = 2;
    this.mHeight = 1.25;
    this.mHeroRef = heroRef;
    this.mDelta = 0;
    if(leftFacing)
        this.mDelta = -0.4;
    else
        this.mDelta = 0.4;
    
    // pack variables
    this.mTimer = 300;
    this.mDeadTimer = 30;
    this.mHitHero = false;
    
    // sprite renderable 
    this.mProjectile = new SpriteRenderable(spriteTexture);
    this.mProjectile.setColor([1, 1, 1, 0]);
    this.mProjectile.getXform().setPosition(atX, atY);
    this.mProjectile.getXform().setSize(this.mWidth, this.mHeight);
    this.mProjectile.setElementPixelPositions(510, 595, 23, 153);
    
    GameObject.call(this, this.mProjectile);
    
    this.mRigdRect = new RigidRectangle(this.mProjectile.getXform(), this.mWidth , this.mHeight);
    this.mRigdRect.setMass(0);
    this.mRigdRect.setVelocity(this.mDelta, 0);
    this.setRigidBody(this.mRigdRect);
    this.toggleDrawRigidShape();
}
gEngine.Core.inheritPrototype(Projectile, GameObject);

Projectile.prototype.update = function () {
    // Handle normal behavior only if we aren't currently shaking
    if(!this.mHitHero){
        
        // Decrease the lifespan of the pack
        this.mTimer--;

        var currPos = this.getXform().getPosition();
        this.getXform().setPosition(currPos[0] + this.mDelta, currPos[1]);
        GameObject.prototype.update.call(this);

        // Check for pixel-perfect collisions with hero            
        var h = [];
        if(this.pixelTouches(this.mHeroRef, h)) // Hit Hero
        {
            this.mHeroRef.tookDamage();
            this.mHitHero = true;
        }

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
        xf.setSize(currSize[0] * 1.05, currSize[1] * 1.05);
        
        if(this.mDeadTimer <= 0)
            return false;
    }
    
    // Return true if the projectile is still valid
    return true;
};

Projectile.prototype.draw = function (aCamera) {
    GameObject.prototype.draw.call(this, aCamera);
};











/**
 * Updates the dyepack.
 * @returns {Boolean} False if the pack is no longer valid and should be deleted
 *  (i.e. if it's out of bounds, if its lifespan is up, etc)
 */
DyePack.prototype.update = function () {
  
    // Handle normal behavior only if we aren't currently shaking
    if(!this.mShakeStarted){
        
        // Decrease the lifespan of the pack
        this.mTimer--;
    
        // Handle movement (D key slowing + actually moving forward)    
        if (gEngine.Input.isKeyPressed(gEngine.Input.keys.D)) {
            this.incSpeedBy(this.mPackAccel);
        }
        GameObject.prototype.update.call(this);  // default moving forward
    
        // Shake if S is clicked or we have collision with a Patrol head
        var hitEvent = false;        
        
        // Shake if S is clicked
        if (gEngine.Input.isKeyClicked(gEngine.Input.keys.S))
        {
            hitEvent = true;
        }
        // Check for pixel-perfect collisions with patrols
        else
        {
            var patrolAry = this.mPatrolSetRef.getPatrolAry(); // Get the full ary of Patrols
            for(var i = 0; i < patrolAry.length; i++)
            {
                //reset dyepack bounding box
                this.mBoundBox.setBounds(this.mPack.getXform().getPosition(),2,3.5);
                
                // Get all 3 objects in a Patrol- 0 is Head, 1 is Wing1, 2 is Wing2
                var patrolObjectsAry = patrolAry[i].getObjectAry();
                // Variable for outputting the wc collision position, but we don't use it
                var h = [];
                if(this.pixelTouches(patrolObjectsAry[0], h)) // Hit Head
                {
                    hitEvent = true;
                    patrolAry[i].headWasHit();
                    break;
                }
                if(this.pixelTouches(patrolObjectsAry[1], h)) // Hit Wing1
                {
                    hitEvent = true;
                    patrolAry[i].wingWasHit(true); // true = hitting wing1
                    break;
                }
                if(this.pixelTouches(patrolObjectsAry[2], h)) // Hit Wing2
                {
                    hitEvent = true;
                    patrolAry[i].wingWasHit(false); // false = hitting wing2
                    break;
                }
                if(patrolAry[i].getPatrolBound().boundCollideStatus(this.mBoundBox) !== 0){
                    this.incSpeedBy(this.mPackAccel);
                };
            }
        }
        
        if(hitEvent) // If we've hit (or S is pressed), start shaking
        {
            this.mShake = new ObjectShake(this.getXform().getPosition(), this.xDelta,
                this.yDelta, this.freq, this.duration);
            this.mShakeStarted = true;
        }
        
        // Check if the object should be destroyed
        
        // Destroyed if Speed is less than 0
        if(this.getSpeed() <= 0)
        {
            return false;
        }
        // Destroyed if out of camera bounds
        if(this.mCamRef.collideWCBound(this.getXform(), 1) === 0)
        {
            return false;
        }
        // Destroyed if the timer is 0
        if(this.mTimer <= 0)
        {
            return false;
        }
    }
    
    // Otherwise, we must be shaking
    else
    {
        // Update the shake status and set the dyepack position to it
        this.mShake.updateShakeState();
        var newCent = this.mShake.getCenter();
        this.getXform().setPosition(newCent[0], newCent[1]);
        
        // Destroyed after shaking
        if(this.mShake.shakeDone())
        {
            return false;    
        }
    }
    
    // Return true if the dyePack is still valid
    return true;
};
