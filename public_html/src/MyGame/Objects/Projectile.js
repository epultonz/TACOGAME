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
    this.mWidth = 1.25;
    this.mHeight = 2;
    this.mHeroRef = heroRef;
    this.mDelta = 0;
    if(leftFacing)
        this.mDelta = -0.4;
    else
        this.mDelta = 0.4;
    
    // pack variables
    this.mTimer = 300;
    this.mDeadTimer = 20;
    this.mHitHero = false;
    
    // sprite renderable 
    this.mProjectile = new SpriteRenderable(spriteTexture);
    this.mProjectile.setColor([1, 1, 1, 0]);
    this.mProjectile.getXform().setPosition(atX, atY);
    this.mProjectile.getXform().setSize(this.mWidth, this.mHeight);
    this.mProjectile.setElementPixelPositions(510, 595, 23, 153);
    this.mProjectile.getXform().incRotationByDegree(90); // Turn it sideways so the long end is left-right
    
    GameObject.call(this, this.mProjectile);
    
    /*
    this.mRigdRect = new RigidRectangle(this.mProjectile.getXform(), this.mWidth , this.mHeight);
    this.mRigdRect.setMass(0);
    this.mRigdRect.setVelocity(0, 0);
    this.setRigidBody(this.mRigdRect);
    this.toggleDrawRigidShape();
    */
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
        xf.setSize(currSize[0] * 1.04, currSize[1] * 1.04);
        
        if(this.mDeadTimer <= 0)
            return false;
    }
    
    // Return true if the projectile is still valid
    return true;
};

Projectile.prototype.draw = function (aCamera) {
    GameObject.prototype.draw.call(this, aCamera);
};