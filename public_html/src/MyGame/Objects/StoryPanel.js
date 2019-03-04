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
    this.mText = new FontRenderable(text);
    this.mText.getXform().setPosition(atX-21,atY+17);
    this.mText.setTextHeight(2);
    
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
        this.mText.draw(aCam);
    };
    this.mStub.draw(aCam);
};

StoryPanel.prototype.actFlag = function(a){
    this.mActive = a;
};

StoryPanel.prototype.getPanelBBox = function(){
    return this.mPanelBBox;
};