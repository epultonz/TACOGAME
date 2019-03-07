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
    
    this.yPos = atY;
    this.touchUp = false;
    
    // sprite renderable 
    this.mFlier = new SpriteRenderable(spriteTexture);
    this.mFlier.setColor([1, 1, 1, 0]);
    this.mFlier.getXform().setPosition(atX, atY);
    this.mFlier.getXform().setSize(this.kWidth, this.kHeight);
    this.mFlier.setElementPixelPositions(598,598+104,2,2+180);
    
    this.mMinimapObj = new Renderable();
    this.mMinimapObj.setColor([1, .2, .2, 0]);
    this.mMinimapObj.getXform().setPosition(atX, atY);
    this.mMinimapObj.getXform().setSize(this.kWidth, this.kHeight);
    
    GameObject.call(this, this.mFlier);   
    
    var r = new RigidRectangle(this.getXform(), this.kWidth , this.kHeight );
    this.setRigidBody(r);
    r.setMass(0);
    //this.toggleDrawRigidShape();
}
gEngine.Core.inheritPrototype(Flier, GameObject);

Flier.prototype.update = function () {
    GameObject.prototype.update.call(this);
    
    this.mShootTimer--;
    if(this.mShootTimer <= 0)
    {
        this.mShootTimer = 500;
        var currPos = this.getXform().getPosition();
        var bullet = new HomingProjectile(this.mSpriteText,currPos[0], currPos[1], this.mHeroRef, true);
        this.mSetRef.addToSet(bullet);
    }
    
    //bobbing up/down 
    var fPos = this.mFlier.getXform().getYPos();
    var fDownTarget = this.yPos-7;
    var delta = 0.05;
    if(this.touchUp){
        this.mFlier.getXform().incYPosBy(-delta);
    }else if(!this.touchUp){
        this.mFlier.getXform().incYPosBy(delta);
    }
    if(fPos >= this.yPos){
        this.touchUp = true;
    } else if(fPos <= fDownTarget){this.touchUp = false;}
};

Flier.prototype.draw = function (aCamera) {
    GameObject.prototype.draw.call(this, aCamera);
};

Flier.prototype.drawMini = function (aCamera) {
    this.mMinimapObj.draw(aCamera);
};