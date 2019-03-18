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
    this.mText = new FontRenderable("Input the passcode:");
    this.mText.setColor([.8, .8, .8, 1]);
    this.mText.getXform().setPosition(stubX,stubY);
    this.mText.setTextHeight(3);
    
    this.kSafe = "assets/Taco/safe.png";
    
    //stub in game
    this.mStub = new TextureRenderable(this.kSafe);
    this.mStub.setColor([1,1,1,0]);
    this.mStub.getXform().setPosition(stubX,stubY);
    this.mStub.getXform().setSize(5,5);
    
    // Dimming background to cue the player that the game is paused
    this.mBackground = new Renderable();
    this.mBackground.getXform().setPosition(stubX,stubY);
    this.mBackground.getXform().setSize(5000,2500);
    this.mBackground.setColor([0,0,0,0.175]);
    
    this.mMinimapObj = new Renderable();
    this.mMinimapObj.setColor([.3, .9, .9, 1]);
    this.mMinimapObj.getXform().setPosition(stubX, stubY+.2);
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
        var camCent = this.mCam.getWCCenter();
        this.mText.getXform().setPosition(camCent[0]-14.5, 31);
    }
    else
    {
        if(!this.mSolved)
        {
            this.mStub.setColor([1,1,1,0]);
            this.mText.setText("Input the passcode:");
        }
        this.mActive = false;
    }
    
};

CodeMechanism.prototype.draw = function(aCam){
    GameObject.prototype.draw.call(this,aCam);
    if(this.mActive){
        this.mBackground.draw(aCam);
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
        this.mStub.setColor([.2,1,.2,.4]);
        this.mSolved = true;
        this.mText.setText("Correct: Pipe Unlocked!");
    } else if(this.mCode !== val){
        this.mStub.setColor([1,.2,.2,.2]);
        this.mText.setText("Incorrect Passcode");
    }
};

CodeMechanism.prototype.getSolve = function() {
    return this.mSolved;
};

CodeMechanism.prototype.isActive = function() {
    return this.mActive;
};