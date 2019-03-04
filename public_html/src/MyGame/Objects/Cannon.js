/* File: Cannon.js 
 *
 * Creates and initializes the Cannon
 * overrides the update funciton of GameObject to define
 * simple Dye behavior
 */

/*jslint node: true, vars: true, white: true */
/*global gEngine, GameObject, LightRenderable, IllumRenderable, SpriteAnimateRenderable */
/* find out more about jslint: http://www.jslint.com/help.html */

function Cannon(spriteTexture, atX, atY, heroRef, setRef) {
    this.kWidth = 7;
    this.kHeight = 7;
    this.mHeroRef = heroRef;
    this.mSetRef = setRef;
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
    
    GameObject.call(this, this.mCannon);
    
    var r = new RigidRectangle(this.getXform(), this.kWidth , this.kHeight );
    this.setRigidBody(r);
    r.setMass(0);
    this.toggleDrawRigidShape();
    
}
gEngine.Core.inheritPrototype(Cannon, GameObject);

Cannon.prototype.update = function () {
    GameObject.prototype.update.call(this);
    
    this.mShootTimer--;
    if(this.mShootTimer <= 0)
    {
        this.mShootTimer = 300;
        var currPos = this.getXform().getPosition();
        var bullet = new Projectile(this.mSpriteText,currPos[0], currPos[1], this.mHeroRef, true);
        this.mSetRef.addToSet(bullet);
    }
};

Cannon.prototype.draw = function (aCamera) {
    GameObject.prototype.draw.call(this, aCamera);
};

Cannon.prototype.drawMini = function (aCamera) {
    this.mMinimapObj.draw(aCamera);
};