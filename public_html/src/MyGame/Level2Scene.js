/*
 * File: GameScene.js
 * Main file that we will use to test our Taco game DEMO
 *
 */

/*jslint node: true, vars: true */
/*global gEngine, Scene, GameObjectset, TextureObject, Camera, vec2,
  FontRenderable, SpriteRenderable, LineRenderable,
  GameObj, SpriteAnimateRenderable, GameScene */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

var gScore = gScore || 0;

function Level2Scene() {
    // remember that assets size must be in power of 2
    this.kPlatformTexture = "assets/Taco/platform.png";
    this.kKelvin = "assets/Taco/kelvinSpriteRun.png";
    this.kBG = "assets/Taco/cavern.png";
    this.kUIButton = "assets/UI/button.png";
    this.kSprites = "assets/Taco/SpriteSheet.png";
    this.kSprites2 = "assets/Taco/spritesheet2.png";
    this.kHealthBar = "assets/UI/lives.png";
    this.kWBPanel = "assets/Taco/WornWhiteboard.png";
    this.kGreenPipe = "assets/Taco/GreenPipe.png";
    this.kSceneFile = "assets/Taco/Level2.json";
    this.kParticleTexture = "assets/Taco/particle.png";
    this.kCoin = "assets/Taco/coin.png";
    
    //background layers
    this.kBg1 = "assets/Taco/caveBackgrounds/1_1.png";
    this.kBg2 = "assets/Taco/caveBackgrounds/1_2.png";
    this.kBg3 = "assets/Taco/caveBackgrounds/1_3.png";
    this.kBg4 = "assets/Taco/caveBackgrounds/1_4.png";
    this.kBg5 = "assets/Taco/caveBackgrounds/1_5.png";
    
    this.mBg1 = null;
    this.mBg2 = null;
    this.mBg3 = null;
    this.mBg4 = null;
    this.mBg5 = null;
    
    
    // The camera to view the scene
    this.mCamera = null;
    this.mMinimapCam = null;

    this.mAllObjs = null;
    this.mAllNonPhysObj = null;
    this.mAllPlatform = null;
    this.mAllStoryPanels  = null;
    this.mAllTerrainSimple = [];
    this.mSpawnPoints = [];
    this.mPipe = null;
    this.LevelSelect = null;
    
    this.mMsg = null;
    this.mPauseMsg = null;
    this.mScore = null;
    
    this.mKelvin = null;
    this.mSceneBG = null;

    this.mCodeBox = null;
    
    this.mTimer = null;
    this.mPause = false;
    this.mLastPos = null;

    this.backButton = null;
    this.MainMenuButton = null;
    
}
gEngine.Core.inheritPrototype(Level2Scene, GameScene);

Level2Scene.prototype.loadScene = function () {
    gEngine.Textures.loadTexture(this.kPlatformTexture);
    gEngine.Textures.loadTexture(this.kKelvin);
    gEngine.Textures.loadTexture(this.kBG);
    gEngine.Textures.loadTexture(this.kUIButton);
    gEngine.Textures.loadTexture(this.kSprites);
    gEngine.Textures.loadTexture(this.kSprites2);
    gEngine.Textures.loadTexture(this.kHealthBar);
    gEngine.Textures.loadTexture(this.kWBPanel);
    gEngine.Textures.loadTexture(this.kGreenPipe);
    gEngine.Textures.loadTexture(this.kParticleTexture);
    gEngine.Textures.loadTexture(this.kCoin);
    gEngine.Textures.loadTexture(this.kBg1);
    gEngine.Textures.loadTexture(this.kBg2);
    gEngine.Textures.loadTexture(this.kBg3);
    gEngine.Textures.loadTexture(this.kBg4);
    gEngine.Textures.loadTexture(this.kBg5);
    gEngine.TextFileLoader.loadTextFile(this.kSceneFile, gEngine.TextFileLoader.eTextFileType.eTextFile);
    document.getElementById("particle").style.display="block"; //display the instruction below
};

Level2Scene.prototype.unloadScene = function () {
    gEngine.Textures.unloadTexture(this.kPlatformTexture);
    gEngine.Textures.unloadTexture(this.kKelvin);
    gEngine.Textures.unloadTexture(this.kBG);
    gEngine.Textures.unloadTexture(this.kUIButton);
    gEngine.Textures.unloadTexture(this.kSprites);
    gEngine.Textures.unloadTexture(this.kSprites2);
    gEngine.Textures.unloadTexture(this.kHealthBar);
    gEngine.Textures.unloadTexture(this.kWBPanel);
    gEngine.Textures.unloadTexture(this.kGreenPipe);
    gEngine.Textures.unloadTexture(this.kParticleTexture);
    gEngine.Textures.unloadTexture(this.kCoin);
    gEngine.Textures.unloadTexture(this.kBg1);
    gEngine.Textures.unloadTexture(this.kBg2);
    gEngine.Textures.unloadTexture(this.kBg3);
    gEngine.Textures.unloadTexture(this.kBg4);
    gEngine.Textures.unloadTexture(this.kBg5);
    
    gEngine.TextFileLoader.unloadTextFile(this.kSceneFile);
    document.getElementById("particle").style.display="none";
    if(this.LevelSelect==="Back"){
        gScore = 0;
        gEngine.Core.startScene(new MyGame());
    }else if(this.LevelSelect==="Main"){
        gScore = 0;
        gEngine.Core.startScene(new MyGame());
    }else if(this.LevelSelect==="Win")
        gEngine.Core.startScene(new WinScene());
    else if(this.LevelSelect==="Lose")
        gEngine.Core.startScene(new LoseScene2());
    
};

Level2Scene.prototype.initialize = function () {
    // Step A: set up the cameras
    this.mAllNonPhysObj = new GameObjectSet(); // contains all non-physics objects (bullets)
    this.mAllStoryPanels = new GameObjectSet();    // store all physics object
    this.mAllPlatform = new GameObjectSet(); //store all platform
    
    this.mAllMinimapPlatform = new GameObjectSet();  
    
    var jsonString = gEngine.ResourceMap.retrieveAsset(this.kSceneFile);
    var sceneInfo = JSON.parse(jsonString); 
    
    var cams = sceneInfo.Camera;   
    this.mCamera = this.parseCamera(cams[0]);
    
    // kelvin with set animation
    this.mKelvin = new Hero(this.kKelvin, 15, 15, this.mCamera, null);
    
    this.parseObjects(sceneInfo);
    this.mMinimapCam = this.parseCamera(cams[1]);
    
    this._makeBackground();

    gEngine.DefaultResources.setGlobalAmbientIntensity(2.5); // game brightness
    gEngine.Physics.incRelaxationCount(15); //time to rest after a physics event

    // the last pipe, for warping to next level
    this.mPipe = this.createPipe(325,5,10,10);
    
    this.mTimer = Date.now();
    this.mLastPos = this.mKelvin.getXform().getPosition();
    
    this.mCodeBox = new CodeMechanism(315,51,"0311",this.mKelvin,this.mCamera);
    
    // For debug
    this.mMsg = new FontRenderable("Status Message");
    this.mMsg.setColor([1, 1, 1, 1]);
    this.mMsg.getXform().setPosition(5, 66);
    this.mMsg.setTextHeight(2);
    
    this.mPauseMsg = new FontRenderable("Game Paused");
    this.mPauseMsg.setColor([.8, .8, .8, 1]);
    this.mPauseMsg.getXform().setPosition(20, 36);
    this.mPauseMsg.setTextHeight(10);
    
    this.mScore = new FontRenderable("Score");
    this.mScore.setColor([1, 1, 1, 1]);
    this.mScore.getXform().setPosition(5, 62);
    this.mScore.setTextHeight(3);
    
    //UI button
    this.backButton = new UIButton(this.kUIButton,this.backSelect,this,[80,576],[160,40],"Go Back",4,[1,1,1,1],[1,1,1,1]);
    this.MainMenuButton = new UIButton(this.kUIButton,this.mainSelect,this,[700,576],[200,40],"Main Menu",4,[1,1,1,1],[1,1,1,1]);
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
Level2Scene.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray
    this.mCamera.setupViewProjection();

    this.mBg1.draw(this.mCamera);
    this.mBg2.draw(this.mCamera);
    this.mBg3.draw(this.mCamera);
    this.mBg4.draw(this.mCamera);
    this.mBg5.draw(this.mCamera);
    
    this.drawMain();
    if(this.mPause)
    {
        this.mPauseMsg.draw(this.mCamera);
    }
    this.drawMap();

    
    
    
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
Level2Scene.prototype.update = function () {
   GameScene.prototype.update.call(this);
   this.mBg1.update();
   this.mBg2.update();
   this.mBg3.update();
   this.mBg4.update();
   this.mBg5.update();
   //this.mCodeBox.update();
};

Level2Scene.prototype.checkWinLose = function(){
    // Win conditions
    var canWarp = false;
    if(this.mKelvin.getXform().getXPos() >= 323 && this.mKelvin.getXform().getXPos() <= 327){
        canWarp = true;
    }
    if ((gEngine.Input.isKeyClicked(gEngine.Input.keys.S) ||
            (gEngine.Input.isKeyClicked(gEngine.Input.keys.Down))) &&
            canWarp && this.mCodeBox.getSolve()) {
        this.LevelSelect = "Win";
        gEngine.GameLoop.stop();
    }
    /*
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.O)) {
        this.LevelSelect = "Win";
        gEngine.GameLoop.stop();
    }*/
    //lose conditions
    var hp = this.mKelvin.getHP();
    if (hp <= 0 || this.mKelvin.getXform().getXPos() > 490) {
        this.LevelSelect = "Lose";
        gEngine.GameLoop.stop();
    }
};

Level2Scene.prototype.drawMain = function() {
    
    GameScene.prototype.drawMain.call(this);
    
    //this.mCodeBox.draw(this.mCamera);
};

Level2Scene.prototype.drawMini = function() {
    GameScene.prototype.drawMini.call(this);
    //this.mCodeBox.drawMini(this.mMinimapCam);
};

Level2Scene.prototype._makeBackground = function() {
    //added tint as projectiles were hard to see (red on red)
    var color = [0,1,1,.2];
    var bgR1 = new TextureRenderable(this.kBg1);
    bgR1.getXform().setSize(100, 75);
    bgR1.getXform().setPosition(50, 36);
    bgR1.getXform().setZPos(-10);
    bgR1.setColor(color);
    this.mBg1 = new  ParallaxGameObject(bgR1, 9, this.mCamera);
    
    
    var bgR2 = new TextureRenderable(this.kBg2);
    bgR2.getXform().setSize(100, 75);
    bgR2.getXform().setPosition(50, 36);
    bgR2.getXform().setZPos(-9);
    bgR2.setColor(color);
    this.mBg2 = new ParallaxGameObject(bgR2, 7, this.mCamera);
    
    var bgR3 = new TextureRenderable(this.kBg3);
    bgR3.getXform().setSize(100, 75);
    bgR3.getXform().setPosition(50, 36);
    bgR3.getXform().setZPos(-1);
    bgR3.setColor(color);
    this.mBg3 = new ParallaxGameObject(bgR3, 5, this.mCamera);
    
    var bgR4 = new TextureRenderable(this.kBg4);
    bgR4.getXform().setSize(100, 75);
    bgR4.getXform().setPosition(50, 36);
    bgR4.getXform().setZPos(-1);
    bgR4.setColor(color);
    this.mBg4 = new ParallaxGameObject(bgR4, 3, this.mCamera);
    
    var bgR5 = new TextureRenderable(this.kBg5);
    bgR5.getXform().setSize(100, 75);
    bgR5.getXform().setPosition(50, 36);
    bgR5.getXform().setZPos(0);
    bgR5.setColor(color);
    this.mBg5 = new ParallaxGameObject(bgR5, 0, this.mCamera);
};

