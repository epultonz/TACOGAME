/* File: Flier.js 
 *
 * Creates and initializes the Flier
 * overrides the update funciton of GameObject to define
 * simple Dye behavior
 */

/*jslint node: true, vars: true, white: true */
/*global gEngine, GameObject, LightRenderable, IllumRenderable, SpriteAnimateRenderable */
/* find out more about jslint: http://www.jslint.com/help.html */

function Flier(spriteTexture, atX, atY, heroRef, setRef) {
    this.kWidth = 3;
    this.kHeight = 5.25;
    this.mHeroRef = heroRef;
    this.mSetRef = setRef;
    this.mShootTimer = 500;
    this.mSpriteText = spriteTexture;
    
    // sprite renderable 
    this.mFlier = new SpriteRenderable(spriteTexture);
    this.mFlier.setColor([1, 1, 1, 0]);
    this.mFlier.getXform().setPosition(atX, atY);
    this.mFlier.getXform().setSize(this.kWidth, this.kHeight);
    this.mFlier.setElementPixelPositions(598,598+104,2,2+180);
    
    GameObject.call(this, this.mFlier);   
}
gEngine.Core.inheritPrototype(Flier, GameObject);

Flier.prototype.update = function () {
    GameObject.prototype.update.call(this);
    
    this.mShootTimer--;
    if(this.mShootTimer <= 0)
    {
        this.mShootTimer = 500;
        var currPos = this.getXform().getPosition();
        var bullet = new Projectile(this.mSpriteText,currPos[0], currPos[1], this.mHeroRef, true);
        this.mSetRef.addToSet(bullet);
    }
};

Flier.prototype.draw = function (aCamera) {
    GameObject.prototype.draw.call(this, aCamera);
};