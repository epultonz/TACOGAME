/* File: Cannon.js 
 *
 * Creates and initializes the Cannon
 * overrides the update funciton of GameObject to define
 * simple Dye behavior
 */

/*jslint node: true, vars: true, white: true */
/*global gEngine, GameObject, LightRenderable, IllumRenderable, SpriteAnimateRenderable */
/* find out more about jslint: http://www.jslint.com/help.html */

function Smasher(spriteTexture, atX, atY, heroRef, topBound) {
    this.kWidth = 7;
    this.kHeight = 7;
    this.mHeroRef = heroRef;

    this.mShootTimer = 300;
    this.mSpriteText = spriteTexture;

    
    // sprite renderable 
    this.mCannon = new SpriteRenderable(spriteTexture);
    this.mCannon.setColor([1, 1, 1, 0]);
    this.mCannon.getXform().setPosition(atX, atY);
    this.mCannon.getXform().setSize(this.kWidth, this.kHeight);
    this.mCannon.setElementPixelPositions(318,318+172,8,8+158);
    
    this.mMinimapObj = new Renderable();
    this.mMinimapObj.setColor([1, .2, .2, 0]);
    this.mMinimapObj.getXform().setPosition(atX, atY);
    this.mMinimapObj.getXform().setSize(this.kWidth, this.kHeight);
    this.mTopBound = atY + topBound;
    this.mBottomBound = atY+1;
    GameObject.call(this, this.mCannon);
    
    var r = new RigidRectangle(this.mCannon.getXform(), this.kWidth , this.kHeight );
    this.setRigidBody(r);
    r.setMass(1000);
    r.setInertia(0);  
    r.setVelocity(0,10);
    this.mVelocity = 10;
   // r.setVelocity(0, this.mVelocity);
    //this.toggleDrawRigidShape();
    
}
gEngine.Core.inheritPrototype(Smasher, GameObject);

Smasher.prototype.update = function () {
    var smasherPos = this.getXform().getPosition();
    
    
    if(smasherPos[1] >= this.mTopBound) {
        this.mVelocity = -25;
    }else if (smasherPos[1] <= this.mBottomBound) {
        this.mVelocity = 10;
    }
    
    this._smashHero();
    
    this.getRigidBody().setVelocity(0,this.mVelocity);
    GameObject.prototype.update.call(this);
    
    

    //update rigid rectangle as not using velocity
    

    
};

Smasher.prototype._smashHero = function() {
    var thisBox = this.getBBox();
    var heroBox = this.mHeroRef.getBBox();
    var collideStatus = thisBox.boundCollideStatus(heroBox);
    // Only do collision detection if the hero isn't in hitstun/damageboost
    if(!this.mHeroRef.isHurt() && 
        (collideStatus === 8 || collideStatus === 9 || collideStatus === 10)) {
            this.mVelocity = 10;
            this.mHeroRef.tookDamage(20);
        
    }
};

Smasher.prototype.draw = function (aCamera) {
    GameObject.prototype.draw.call(this, aCamera);
};

Smasher.prototype.drawMini = function (aCamera) {
    this.mMinimapObj.draw(aCamera);
};