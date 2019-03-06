/* File: StoryPanel.js 
 *
 * Creates and initializes the StoryPanel object
 * overrides the update function of GameObject
 */

/*jslint node: true, vars: true */
/*global gEngine: false, GameObject: false, SpriteRenderable: false, vec2: false */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function StoryPanel(texture,atX,atY,w,text,stubX,stubY){
    // the board as background of txt
    this.mPanel = new TextureRenderable(texture);
    this.mPanel.getXform().setPosition(atX,atY);
    this.mPanel.getXform().setSize(w,w);
    
    //the text
    this.mText1 = new FontRenderable(text);
    this.mText1.getXform().setPosition(atX-21,atY+17);
    this.mText1.setTextHeight(2);
    
    this.mText2 = new FontRenderable(" ");
    this.mText2.getXform().setPosition(atX-21,atY+14);
    this.mText2.setTextHeight(2);
    
    this.mText3 = new FontRenderable(" ");
    this.mText3.getXform().setPosition(atX-21,atY+11);
    this.mText3.setTextHeight(2);
    
    this.mText4 = new FontRenderable(" ");
    this.mText4.getXform().setPosition(atX-21,atY+8);
    this.mText4.setTextHeight(2);
    
    //stub in game
    this.mStub = new Renderable();
    this.mStub.setColor([0.5,0,0.5,1]);
    this.mStub.getXform().setPosition(stubX,stubY);
    this.mStub.getXform().setSize(2,2);
    
    this.mActive = false;
    
    GameObject.call(this,this.mPanel);
    
    // bounding box for stub that appears outside
    this.mPanelBBox = this.getBBox();
    this.mPanelBBox.setBounds(this.mStub.getXform().getPosition(),2,2);
    
}
gEngine.Core.inheritPrototype(StoryPanel, GameObject);

StoryPanel.prototype.update = function(){
    GameObject.prototype.update.call(this);
    
};

StoryPanel.prototype.draw = function(aCam){
    if(this.mActive){
        GameObject.prototype.draw.call(this,aCam);
        this.mText1.draw(aCam);
        this.mText2.draw(aCam);
        this.mText3.draw(aCam);
        this.mText4.draw(aCam);
    };
    this.mStub.draw(aCam);
};

StoryPanel.prototype.actFlag = function(a){
    this.mActive = a;
};

StoryPanel.prototype.getPanelBBox = function(){
    return this.mPanelBBox;
};

StoryPanel.prototype.setText1 = function(s){
    this.mText1.setText(s);
};

StoryPanel.prototype.setText2 = function(s1, s2, s3){
    this.mText2.setText(s1);
    this.mText3.setText(s2);
    this.mText4.setText(s3);
};