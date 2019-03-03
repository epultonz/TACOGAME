/* File: Cannon.js 
 *
 * Creates and initializes the Cannon
 * overrides the update funciton of GameObject to define
 * simple Dye behavior
 */

/*jslint node: true, vars: true, white: true */
/*global gEngine, GameObject, LightRenderable, IllumRenderable, SpriteAnimateRenderable */
/* find out more about jslint: http://www.jslint.com/help.html */

function Cannon(spriteTexture,atX,atY) {
    this.kWidth = 6;
    this.kHeight = 6;
    
    // sprite renderable 
    this.mCannon = new SpriteRenderable(spriteTexture);
    this.mCannon.setColor([1, 1, 1, 0]);
    this.mCannon.getXform().setPosition(atX, atY);
    this.mCannon.getXform().setSize(this.kWidth, this.kHeight);
    this.mCannon.setElementPixelPositions(315,315+180,0+180);
    
    GameObject.call(this, this.mCannon);
    
    var r = new RigidRectangle(this.getXform(), this.kWidth , this.kHeight );
    this.setRigidBody(r);
    
    
}
gEngine.Core.inheritPrototype(Cannon, GameObject);

Cannon.prototype.update = function () {
    GameObject.prototype.update.call(this);
};

Cannon.prototype.draw = function (aCamera) {
    GameObject.prototype.draw.call(this, aCamera);
};