/* File: HomingProjectile.js 
 *
 * Creates and initializes the HomingProjectile
 * overrides the update funciton of GameObject to define
 * simple Dye behavior
 */

/*jslint node: true, vars: true, white: true */
/*global gEngine, GameObject, LightRenderable, IllumRenderable, SpriteAnimateRenderable, vec2 */
/* find out more about jslint: http://www.jslint.com/help.html */

function HomingProjectile(spriteTexture, atX, atY, heroRef, leftFacing) {
    this.mWidth = 1.25;
    this.mHeight = 2;
    this.mHeroRef = heroRef;
    this.mDelta = 0;
    if(leftFacing)
        this.mDelta = -0.2;
    else
        this.mDelta = 0.2;
    
    // pack variables
    this.mTimer = 300;
    this.mDeadTimer = 20;
    this.mHitHero = false;
    
    // sprite renderable 
    this.mHomingProjectile = new SpriteRenderable(spriteTexture);
    this.mHomingProjectile.setColor([1, 1, 1, 0]);
    this.mHomingProjectile.getXform().setPosition(atX, atY);
    this.mHomingProjectile.getXform().setSize(this.mWidth, this.mHeight);
    this.mHomingProjectile.setElementPixelPositions(510, 595, 23, 153);
    this.mHomingProjectile.getXform().incRotationByDegree(90); // Turn it sideways so the long end is left-right
    
    GameObject.call(this, this.mHomingProjectile);
    this.setCurrentFrontDir(vec2.fromValues(0, -1)); // set "forward" to be down
    this.mRigdRect = new RigidRectangle(this.mHomingProjectile.getXform(), this.mWidth , this.mHeight);
    this.mRigdRect.setMass(0);
    this.mRigdRect.setVelocity(0, 0);
    this.setRigidBody(this.mRigdRect);
    //this.toggleDrawRigidShape();
}
gEngine.Core.inheritPrototype(HomingProjectile, GameObject);

HomingProjectile.prototype.update = function () {
    // Handle normal behavior only if we aren't currently shaking
    if(!this.mHitHero){
        
        // Decrease the lifespan of the pack
        this.mTimer--;

        this.mTargetPosition = this.mHeroRef.getXform().getPosition();        
        
        //set frontdir
        this.rotateObjPointTo(this.mTargetPosition, 0.05); 
        //use front dir to find velocity 
        //change constant to increase velocity
        this.mRigdRect.setVelocity(20*this.getCurrentFrontDir()[0], 20* this.getCurrentFrontDir()[1]);
        //i have no idea but i think its working
        this.mRigdRect.travel();
     
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
        
        // Increase the Homingprojectile's size for now
        var xf = this.getXform();
        var currSize = xf.getSize();
        xf.setSize(currSize[0] * 1.04, currSize[1] * 1.04);
        
        if(this.mDeadTimer <= 0)
            return false;
    }
     
    // Return true if the Homingprojectile is still valid
    return true;
};

HomingProjectile.prototype.draw = function (aCamera) {
    GameObject.prototype.draw.call(this, aCamera);
};
