/* File: StoryPanel.js 
 *
 * Creates and initializes the StoryPanel object
 * overrides the update function of GameObject
 */

/*jslint node: true, vars: true */
/*global gEngine: false, GameObject: false, SpriteRenderable: false, vec2: false */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function StoryPanel(texture, spawnX, spawnY, width, camRef, heroRef, lineAry, midScreenY = 20){
    this.mCamRef = camRef;
    this.mHeroRef = heroRef;
    this.mMidScreenY = midScreenY;
    this.mActive = false; // If the panel should be shown or not
    
    this.kAlert = "assets/Taco/alert.png";
    this.mDoneRead = false;
    
    this.mAlert = new SpriteAnimateRenderable(this.kAlert);
    this.mAlert.getXform().setPosition(spawnX,spawnY+5);
    this.mAlert.getXform().setSize(4.5,5.5);
    this.mAlert.setColor([1,1,1,0]);
    this.mAlert.setSpriteSequence(32,0,32,32,2,0);
    this.mAlert.setAnimationSpeed(20);
    
    // the board as background of txt
    this.mPanel = new TextureRenderable(texture);
    this.mPanel.getXform().setSize(width, width/2);
    
    this.mText1 = new FontRenderable(" ");
    this.mText2 = new FontRenderable(" ");
    this.mText3 = new FontRenderable(" ");
    this.mText4 = new FontRenderable(" ");
    
    
    //the text - positions are set in update()
    if(lineAry.length >= 4)
    {
        this.mText4.setText(lineAry[3]);
        this.mText4.setTextHeight(2.2);
    }
    
    if(lineAry.length >= 3)
    {
        this.mText3.setText(lineAry[2]);
        this.mText3.setTextHeight(2.2);
    }
    
    if(lineAry.length >= 2)
    {
        this.mText2.setText(lineAry[1]);
        this.mText2.setTextHeight(2.2);
    }
    
    if(lineAry.length >= 1)
    {
        this.mText1.setText(lineAry[0]);
        this.mText1.setTextHeight(2.2);
    }
    
    //stub in game
    this.mStub = new TextureRenderable(texture);
    this.mStub.getXform().setSize(5.5, 4);
    this.mStub.setColor([1,1,1,0]);
    this.mStub.getXform().setPosition(spawnX, spawnY);
    //this.mStub.getXform().setSize(2,2);
    
    this.mMinimapObj = new Renderable();
    this.mMinimapObj.setColor([.3, .9, .9, 1]);
    this.mMinimapObj.getXform().setPosition(spawnX, spawnY+1);
    this.mMinimapObj.getXform().setSize(3, 3);
    
    GameObject.call(this,this.mPanel);
    
    // bounding box for stub that appears outside
    this.mPanelBBox = this.getBBox();
    this.mPanelBBox.setBounds(this.mStub.getXform().getPosition(),2,2);
    
}
gEngine.Core.inheritPrototype(StoryPanel, GameObject);

StoryPanel.prototype.update = function(){
    GameObject.prototype.update.call(this);
    var camPos = this.mCamRef.getWCCenter();
    var camX = camPos[0];
    
    // tutorial panel bounding box collision
    var heroCollision = this.mPanelBBox.boundCollideStatus(this.mHeroRef.getBBox());
    if(heroCollision !== 0){
        this.mActive = true;
        this.mDoneRead = true;
    }
    else
    {
        this.mActive = false;
    }

    if(this.mActive){
        this.mPanel.getXform().setPosition(camX, this.mMidScreenY+6.25);
   
        //the text
        this.mText1.getXform().setPosition(camX-23,this.mMidScreenY+17);   
        this.mText2.getXform().setPosition(camX-23,this.mMidScreenY+14);  
        this.mText3.getXform().setPosition(camX-23,this.mMidScreenY+11);
        this.mText4.getXform().setPosition(camX-23,this.mMidScreenY+8);
    }
    
    /*
    // Color Flashing
    var c = this.mStub.getColor()[1];
    var d = 0.01;
    if(c < 1){
        this.mStub.setColor([0.5,c+d,0.5,1]);
    }else{ this.mStub.setColor([0.5,0,0.5,1]);}
    */
    /*
    // Alpha Flashing (for Textured version)
    // Makes it brighter (lets more white show)
    var a = this.mStub.getColor()[3];
    var d = 0.005;
    if(a < .3){
        this.mStub.setColor([1,1,1,a+d]);
    }else{ this.mStub.setColor([1,1,1,0]);}
    */
    
    // Exclamation mark appear for unread panel
    if(!this.mDoneRead){
        this.mAlert.updateAnimation();
    }
    
    return true;
};

StoryPanel.prototype.isActive = function(){
    return this.mActive;
};

StoryPanel.prototype.draw = function(aCam){
    this.mStub.draw(aCam);
    if(this.mActive){
        GameObject.prototype.draw.call(this,aCam);
        this.mText1.draw(aCam);
        this.mText2.draw(aCam);
        this.mText3.draw(aCam);
        this.mText4.draw(aCam);
    };
    if(!this.mDoneRead){
        this.mAlert.draw(aCam);
    }
};

StoryPanel.prototype.drawMini = function(aCam)
{
    this.mMinimapObj.draw(aCam);
};