/*
 * File: TacoDemo.js 
 * Main file that we will use to test our Taco game DEMO
 * 
 * 
 * 
 */

/*jslint node: true, vars: true */
/*global gEngine, Scene, GameObjectset, TextureObject, Camera, vec2,
  FontRenderable, SpriteRenderable, LineRenderable,
  GameObj, SpriteAnimateRenderable */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function TacoDemo() {
    // remember that assets size must be in power of 2
    this.kPlatformTexture = "assets/Taco/platform.png";
    this.kKelvin = "assets/Taco/kelvin_run.png";
    this.kBG = "assets/Taco/scene_example.png";
    this.kUIButton = "assets/UI/button.png";
    
    // The camera to view the scene
    this.mCamera = null;

    
    this.LevelSelect = null;
    
    this.mKelvin = null;
    this.mSceneBG = null;
    this.mPlatforms = null;
    
    this.backButton = null;
    this.MainMenuButton = null;
    
}
gEngine.Core.inheritPrototype(TacoDemo, Scene);

TacoDemo.prototype.loadScene = function () {
    gEngine.Textures.loadTexture(this.kPlatformTexture);
    gEngine.Textures.loadTexture(this.kKelvin);
    gEngine.Textures.loadTexture(this.kBG);
    gEngine.Textures.loadTexture(this.kUIButton);
    //document.getElementById("particle").style.display="block"; I dont know what this does
};

TacoDemo.prototype.unloadScene = function () {
    gEngine.Textures.unloadTexture(this.kPlatformTexture);
    gEngine.Textures.unloadTexture(this.kKelvin);
    gEngine.Textures.unloadTexture(this.kBG);
    gEngine.Textures.unloadTexture(this.kUIButton);
    //document.getElementById("particle").style.display="none";
    if(this.LevelSelect==="Back")
        gEngine.Core.startScene(new MyGame());
    else if(this.LevelSelect==="Main")
        gEngine.Core.startScene(new MyGame());
};

TacoDemo.prototype.initialize = function () {
    // Step A: set up the cameras
    this.mCamera = new Camera(
        vec2.fromValues(50, 40), // position of the camera
        100,                     // width of camera
        [0, 0, 800, 600]         // viewport (orgX, orgY, width, height)
    );
    this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
            // sets the background to gray
    gEngine.DefaultResources.setGlobalAmbientIntensity(3);
    
    this.mPlatforms = new GameObjectSet();
    this.createBounds();
    
    // kelvin with set animation
    this.mKelvin = new SpriteAnimateRenderable(this.kKelvin);
    this.mKelvin.getXform().setPosition(10,35);
    this.mKelvin.setColor([1,1,1,0]);
    this.mKelvin.getXform().setSize(20,20);
    this.mKelvin.setSpriteSequence(128,0,128,128,8,0);
    this.mKelvin.setAnimationType(SpriteAnimateRenderable.eAnimationType.eAnimateRight);
    this.mKelvin.setAnimationSpeed(12);
    
    // scene background
    this.mSceneBG = new TextureRenderable(this.kBG);
    this.mSceneBG.getXform().setSize(100,50);
    this.mSceneBG.getXform().setPosition(50,30);
    
    this.backButton = new UIButton(this.kUIButton,this.backSelect,this,[80,580],[160,40],"Go Back",4,[1,1,1,1],[1,1,1,1]);
    this.MainMenuButton = new UIButton(this.kUIButton,this.mainSelect,this,[700,580],[200,40],"Main Menu",4,[1,1,1,1],[1,1,1,1]);
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
TacoDemo.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    this.mCamera.setupViewProjection();
    
    this.mSceneBG.draw(this.mCamera);
    this.mKelvin.draw(this.mCamera);
    
    this.mPlatforms.draw(this.mCamera);
    this.MainMenuButton.draw(this.mCamera);
    this.backButton.draw(this.mCamera);
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
TacoDemo.prototype.update = function () {
    var delta = 0.3;
    
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.W)) {
        this.mKelvin.getXform().incYPosBy(delta);
        this.mKelvin.updateAnimation();
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.A)) {
        this.mKelvin.getXform().incXPosBy(-delta);
        this.mKelvin.updateAnimation();
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.S)) {
        this.mKelvin.getXform().incYPosBy(-delta);
        this.mKelvin.updateAnimation();
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.D)) {
        this.mKelvin.getXform().incXPosBy(delta);
        this.mKelvin.updateAnimation();
    }
    
    this.MainMenuButton.update();
    this.backButton.update();
};

TacoDemo.prototype.createBounds = function() {
    var x = 15, w = 30, y = 4;
    for (x = 15; x < 120; x+=30) 
        this.platformAt(x, y, w, 0);
};

TacoDemo.prototype.platformAt = function (x, y, w, rot) {
    var h = w / 8;
    var p = new TextureRenderable(this.kPlatformTexture);
    var xf = p.getXform();
    
    var g = new GameObject(p);
    var r = new RigidRectangle(xf, w, h);
    g.setRigidBody(r);
    
    r.setMass(0);
    xf.setSize(w, h);
    xf.setPosition(x, y);
    xf.setRotationInDegree(rot);
    this.mPlatforms.addToSet(g);
};

TacoDemo.prototype.backSelect = function(){
    this.LevelSelect="Back";
    gEngine.GameLoop.stop();
};

TacoDemo.prototype.mainSelect = function(){
    this.LevelSelect="Main";
    gEngine.GameLoop.stop();
};
