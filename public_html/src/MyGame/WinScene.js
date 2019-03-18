/*
 * File: WinScene.js 
 * Show this scene if wins. 
 */

/*jslint node: true, vars: true, white: true */
/*global gEngine, Scene, GameObjectset, TextureObject, Camera, vec2,
  Renderable, TextureRenderable, FontRenderable, SpriteRenderable, LightRenderable, IllumRenderable,
  GameObject, TiledGameObject, ParallaxGameObject, Hero, Minion, Dye, Light */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function WinScene() {
    this.kUIButton = "assets/UI/button.png";
    this.kBG = "assets/Taco/cave/1_1.png";
    // The camera to view the scene
    this.mCamera = null;
    this.mMsg = null;
    this.mBG = null;
    this.MainMenuButton = null;
}
gEngine.Core.inheritPrototype(WinScene, Scene);

WinScene.prototype.loadScene = function () {
    gEngine.Textures.loadTexture(this.kUIButton);
    gEngine.Textures.loadTexture(this.kBG);
};

WinScene.prototype.unloadScene = function() {
    gEngine.Textures.unloadTexture(this.kUIButton);
    gEngine.Textures.unloadTexture(this.kBG);
    // next level to be loaded
    gScore = 0;
    gEngine.Core.startScene(new MyGame());
};

WinScene.prototype.initialize = function () {
    // Step A: set up the cameras
    this.mCamera = new Camera(
        vec2.fromValues(50, 50), // position of the camera
        100,                        // width of camera
        [0, 0, 800, 600],         // viewport (orgX, orgY, width, height)
        2
    );
    this.mCamera.setBackgroundColor([0.5, 0.9, 0.5, 1]);

    this.mMsg = new FontRenderable("This is win screen");
    this.mMsg.setColor([1, 0, 0, 1]);
    this.mMsg.getXform().setPosition(10, 50);
    this.mMsg.setTextHeight(5);
    
    this.mBG = new TextureRenderable(this.kBG);
    this.mBG.getXform().setPosition(50,40);
    this.mBG.getXform().setSize(120,80);
    
    this.MainMenuButton = new UIButton(this.kUIButton,this.mainSelect,this,[700,580],[200,40],"Main Menu",4,[1,1,1,1],[1,1,1,1]);
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
WinScene.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray
    
    
    
    this.mCamera.setupViewProjection();
    this.mBG.draw(this.mCamera);
    
    this.mMsg.setText("YOU WON! CONGRATS~");
    this.mMsg.getXform().setPosition(10, 55);
    this.mMsg.draw(this.mCamera);
    
    var sc = "";
    sc += "Your score is: " + gScore;
    this.mMsg.setText(sc);
    this.mMsg.getXform().setPosition(10, 45);
    this.mMsg.draw(this.mCamera);
    
    this.MainMenuButton.draw(this.mCamera);
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
WinScene.prototype.update = function () {
    this.MainMenuButton.update();
};

// menu button UI
WinScene.prototype.mainSelect = function(){
    gEngine.GameLoop.stop();
};
