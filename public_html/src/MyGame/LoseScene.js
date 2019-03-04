/*
 * File: LoseScene.js 
 * Show this scene if wins. 
 */

/*jslint node: true, vars: true, white: true */
/*global gEngine, Scene, GameObjectset, TextureObject, Camera, vec2,
  Renderable, TextureRenderable, FontRenderable, SpriteRenderable, LightRenderable, IllumRenderable,
  GameObject, TiledGameObject, ParallaxGameObject, Hero, Minion, Dye, Light */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function LoseScene() {
    this.kUIButton = "assets/UI/button.png";
    
    // The camera to view the scene
    this.mCamera = null;
    this.mMsg = null;
    this.LevelSelect = null;
    
    this.retryButton = null;
    this.MainMenuButton = null;
}
gEngine.Core.inheritPrototype(LoseScene, Scene);

LoseScene.prototype.loadScene = function () {
    gEngine.Textures.loadTexture(this.kUIButton);
};

LoseScene.prototype.unloadScene = function() {
    gEngine.Textures.unloadTexture(this.kUIButton);
    // next level to be loaded
    if(this.LevelSelect==="Retry")
        gEngine.Core.startScene(new TacoDemo());
    else if(this.LevelSelect==="Main")
        gEngine.Core.startScene(new MyGame());
};

LoseScene.prototype.initialize = function () {
    // Step A: set up the cameras
    this.mCamera = new Camera(
        vec2.fromValues(50, 50), // position of the camera
        100,                        // width of camera
        [0, 0, 800, 600],         // viewport (orgX, orgY, width, height)
        2
    );
    this.mCamera.setBackgroundColor([0.5, 0.5, 0.9, 1]);

    this.mMsg = new FontRenderable("This is lose screen");
    this.mMsg.setColor([1, 0, 0, 1]);
    this.mMsg.getXform().setPosition(10, 50);
    this.mMsg.setTextHeight(5);
    
    this.MainMenuButton = new UIButton(this.kUIButton,this.mainSelect,this,[700,580],[200,40],"Main Menu",4,[1,1,1,1],[1,1,1,1]);
    this.retryButton = new UIButton(this.kUIButton,this.retrySelect,this,[80,580],[160,40],"Try Again",4,[1,1,1,1],[1,1,1,1]);
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
LoseScene.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray
    
    this.mCamera.setupViewProjection();
    this.mMsg.setText("You died. Try again?");
    this.mMsg.getXform().setPosition(10, 55);
    this.mMsg.draw(this.mCamera);
    
    this.mMsg.setText("Or back to Menu");
    this.mMsg.getXform().setPosition(10, 45);
    this.mMsg.draw(this.mCamera);
    
    this.MainMenuButton.draw(this.mCamera);
    this.retryButton.draw(this.mCamera);
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
LoseScene.prototype.update = function () {
    this.MainMenuButton.update();
    this.retryButton.update();
};

// menu button UI
LoseScene.prototype.mainSelect = function(){
    this.LevelSelect="Main";
    gEngine.GameLoop.stop();
};

LoseScene.prototype.retrySelect = function(){
    this.LevelSelect="Retry";
    gEngine.GameLoop.stop();
};

