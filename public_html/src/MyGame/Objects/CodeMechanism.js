/* File: CodeMechanism.js 
 *
 * Creates and initializes the CodeMechanism object
 * overrides the update function of GameObject
 */

/*jslint node: true, vars: true */
/*global gEngine: false, GameObject: false, SpriteRenderable: false, vec2: false */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function CodeMechanism(atX,atY,w,stubX,stubY,code){
    
    //the text
    this.mText = new FontRenderable("Key in Code");
    this.mText.getXform().setPosition(38,30);
    this.mText.setTextHeight(2);
    
    //stub in game
    this.mStub = new Renderable();
    this.mStub.setColor([0,0,1,1]);
    this.mStub.getXform().setPosition(stubX,stubY);
    this.mStub.getXform().setSize(2,2);
    
    this.mActive = false;
    this.mSolved = false;
    this.mCode = code;
    
    GameObject.call(this,this.mStub);
    
    // bounding box for stub that appears outside
    this.mStubBBox = this.getBBox();
    this.mStubBBox.setBounds(this.mStub.getXform().getPosition(),2,2);
    
    //@param [position, textSize, width, color, textColor, callback, context] 
    this.mUICodeBox = new UITextBox([atX,atY],6,w,[1,1,1,1],[0,0,0,1],this.UICodeText,this);
    
}
gEngine.Core.inheritPrototype(CodeMechanism, GameObject);

CodeMechanism.prototype.update = function(aCam){
    GameObject.prototype.update.call(this);
    if(this.mActive && !this.mSolved){
        this.mUICodeBox.update(aCam);
    };
};

CodeMechanism.prototype.draw = function(aCam){
    GameObject.prototype.draw.call(this,aCam);
    if(this.mActive){
        this.mText.draw(aCam);
        this.mUICodeBox.draw(aCam);
    };
};

CodeMechanism.prototype.actFlag = function(a){
    this.mActive = a;
};

CodeMechanism.prototype.getStubBBox = function(){
    return this.mStubBBox;
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