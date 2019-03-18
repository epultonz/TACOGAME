/*
 * File: MyGame.js 
 * This is the logic of our game. 
 */

/*jslint node: true, vars: true */
/*global gEngine, Scene, GameObjectset, TextureObject, Camera, vec2,
  FontRenderable, SpriteRenderable, LineRenderable,
  GameObject */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function MyGame() {
    this.kUIButton = "assets/UI/button.png";
    this.kBG = "assets/Taco/lakeMountains/1_1.png";
    
    // The camera to view the scene
    this.mCamera = null;
    
    this.UIText = null;
    this.LevelSelect = null;
    
    this.mBG = null;
    
    this.tacoLevel2Button = null;
    this.tacoLevel1Button = null;
    this.tacoHelpButton = null;
}
gEngine.Core.inheritPrototype(MyGame, Scene);


MyGame.prototype.loadScene = function () {
    gEngine.Textures.loadTexture(this.kUIButton);
    gEngine.Textures.loadTexture(this.kBG);
};

MyGame.prototype.unloadScene = function () {
    gEngine.Textures.unloadTexture(this.kUIButton);
    gEngine.Textures.unloadTexture(this.kBG);
    
    if(this.LevelSelect==="tacoLevel1"){
        gEngine.Core.startScene(new Level1Scene());
    }
    else if(this.LevelSelect==="tacoLevel2"){
        gEngine.Core.startScene(new Level2Scene());
    } 
    else if(this.LevelSelect==="tacoHelp"){
        gEngine.Core.startScene(new HelpScene());
    }
    
};

MyGame.prototype.initialize = function () {
    // Step A: set up the cameras
    this.mCamera = new Camera(
        vec2.fromValues(50, 40), // position of the camera
        100,                     // width of camera
        [0, 0, 800, 600]         // viewport (orgX, orgY, width, height)
    );
    this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
            // sets the background to gray
    gEngine.DefaultResources.setGlobalAmbientIntensity(3);
    
    this.mBG = new TextureRenderable(this.kBG);
    this.mBG.getXform().setPosition(50,40);
    this.mBG.getXform().setSize(120,80);
    
    //this.ParticleButton = new UIButton(this.kUIButton,this.particleSelect,this,[400,400],[600,100],"Particle Demos",8,[1,1,1,1],[0,0,0,1]);
    //this.PhysicsButton = new UIButton(this.kUIButton,this.physicsSelect,this,[400,300],[500,100],"Physics Demo",8,[1,1,1,1],[0,0,0,1]);
    //this.UIButton =  new UIButton(this.kUIButton,this.uiSelect,this,[400,200],[320,100],"UI Demo",8,[1,1,1,1],[0,0,0,1]);
    this.UIText = new UIText("Adventures of Kelvin",[400,600],8,1,0,[0,0,0,1]);
    
    //param: sprite, run when click, return contect to, buttonPos, buttonSize, text, textSize, textColor, textColorClicked
    this.tacoLevel1Button = new UIButton(this.kUIButton,this.tacoLevel1Select,this,[400,400],[350,100],"Level 1",8,[1,1,1,1],[0,0,0,1]);
    this.tacoLevel2Button = new UIButton(this.kUIButton,this.tacoLevel2Select,this,[400,300],[350,100],"Level 2",8,[1,1,1,1],[0,0,0,1]);
    this.tacoHelpButton = new UIButton(this.kUIButton,this.tacoHelpSelect,this,[400,200],[350,100],"Help",8,[1,1,1,1],[0,0,0,1]);
};  

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
MyGame.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray
    
    
    this.mCamera.setupViewProjection();
    this.mBG.draw(this.mCamera);
    
    this.UIText.draw(this.mCamera);
    this.tacoLevel1Button.draw(this.mCamera);
    this.tacoLevel2Button.draw(this.mCamera);
    this.tacoHelpButton.draw(this.mCamera);
};

MyGame.prototype.update = function () {
    //this.ParticleButton.update();
    //this.PhysicsButton.update();
    //this.UIButton.update();
    this.tacoLevel1Button.update();
    this.tacoLevel2Button.update();
    this.tacoHelpButton.update();
};

MyGame.prototype.tacoLevel1Select= function(){
    this.LevelSelect="tacoLevel1";
    gEngine.GameLoop.stop();
};

MyGame.prototype.tacoLevel2Select= function(){
    this.LevelSelect="tacoLevel2";
    gEngine.GameLoop.stop();
};

MyGame.prototype.tacoHelpSelect= function(){
    this.LevelSelect="tacoHelp";
    gEngine.GameLoop.stop();
};