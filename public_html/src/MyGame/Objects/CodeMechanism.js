/* File: CodeMechanism.js 
 *
 * Creates and initializes the CodeMechanism object
 * overrides the update function of GameObject
 */

/*jslint node: true, vars: true */
/*global gEngine: false, GameObject: false, SpriteRenderable: false, vec2: false */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function CodeMechanism(stubX,stubY,code,hero,aCam1){
    
    this.mHeroRef = hero;
    this.mCam = aCam1;
    
    //the text
    this.mText = new FontRenderable("Key in passcode:");
    this.mText.getXform().setPosition(38,30);
    this.mText.setTextHeight(2);
    
    //stub in game
    this.mStub = new Renderable();
    this.mStub.setColor([1,0,0,1]);
    this.mStub.getXform().setPosition(stubX,stubY);
    this.mStub.getXform().setSize(4,4);
    
    this.mMinimapObj = new Renderable();
    this.mMinimapObj.setColor([.3, .9, .9, 1]);
    this.mMinimapObj.getXform().setPosition(stubX, stubY);
    this.mMinimapObj.getXform().setSize(6, 6);
    
    this.mActive = false;
    this.mSolved = false;
    this.mCode = code;
    
    GameObject.call(this,this.mStub);
    
    // bounding box for stub that appears outside
    this.mStubBBox = this.getBBox();
    this.mStubBBox.setBounds(this.mStub.getXform().getPosition(),2,2);
    
    //@param [position, textSize, width, color, textColor, callback, context] 
    this.mUICodeBox = new UITextBox([280,240],6,40,[1,1,1,1],[0,0,0,1],this.UICodeText,this);
    
}
gEngine.Core.inheritPrototype(CodeMechanism, GameObject);

CodeMechanism.prototype.update = function(){
    GameObject.prototype.update.call(this);
    if(this.mActive && !this.mSolved){
        this.mUICodeBox.update(this.mCam);
    };
    
    var heroCollision = this.mStubBBox.boundCollideStatus(this.mHeroRef.getBBox());
    if(heroCollision !== 0){
        this.mActive = true;
    }
    else
    {
        this.mActive = false;
    }
    
};

CodeMechanism.prototype.draw = function(aCam){
    GameObject.prototype.draw.call(this,aCam);
    if(this.mActive){
        this.mText.draw(aCam);
        this.mUICodeBox.draw(aCam);
    };
};

CodeMechanism.prototype.drawMini = function(aCam)
{
    this.mMinimapObj.draw(aCam);
};

CodeMechanism.prototype.UICodeText = function(){
    var val = this.mUICodeBox.getEnteredValue();
    if(this.mCode === val){
        this.mStub.setColor([0,1,0,1]);
        this.mSolved = true;
    } else if(this.mCode !== val){
        this.mStub.setColor([1,0,0,1]);
    }
};

CodeMechanism.prototype.getSolve = function() {
    return this.mSolved;
};