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

function Level1Scene() {
    // remember that assets size must be in power of 2
    this.kPlatformTexture = "assets/Taco/platform.png";
    this.kKelvin = "assets/Taco/kelvinSpriteRun.png";
    this.kBG = "assets/Taco/scene_example.png";
    this.kUIButton = "assets/UI/button.png";
    this.kSprites = "assets/Taco/SpriteSheet.png";
    this.kSprites2 = "assets/Taco/spritesheet2.png";
    this.kHealthBar = "assets/UI/lives.png";
    this.kWBPanel = "assets/Taco/WornWhiteboard.png";
    this.kGreenPipe = "assets/Taco/GreenPipe.png";
    this.kSceneFile = "assets/Taco/Level1.json";
    this.kParticleTexture = "assets/Taco/particle.png";
    this.kCoin = "assets/Taco/coin.png";
    this.kAlert = "assets/Taco/alert.png";
    this.kGoomba = "assets/Taco/goomba.png";
    
    // NewMobs
    this.kPatrol = "assets/Taco/NewMobs/Patrol.png";
    this.kCannon = "assets/Taco/NewMobs/Cannon.png";
    this.kFlier = "assets/Taco/NewMobs/Flier.png";
    this.kSmasher = "assets/Taco/NewMobs/Smasher.png";
    
    var layersFolder = "lakeMountains";
    //background layers
    this.kBg1 = "assets/Taco/" + layersFolder + "/1_1.png";
    this.kBg2 = "assets/Taco/" + layersFolder + "/1_2.png";
    this.kBg3 = "assets/Taco/" + layersFolder + "/1_3.png";
    this.kBg4 = "assets/Taco/" + layersFolder + "/1_4.png";
    this.kBg5 = "assets/Taco/" + layersFolder + "/1_5.png";
    
    this.mBg1 = null;
    this.mBg2 = null;
    this.mBg3 = null;
    this.mBg4 = null;
    this.mBg5 = null;
    
    // Audio 
    this.kAudIntro = "assets/Taco/Audio/WhatIsThisPlace.wav";
    this.kAudHurt1 = "assets/Taco/Audio/Ouch.wav";
    this.kAudHurt2 = "assets/Taco/Audio/ThatHurt.wav";
    this.kAudPow0 = "assets/Taco/Audio/AhMuchBetter.wav";
    this.kAudPow1 = "assets/Taco/Audio/IFeelPowerful.wav";
    this.kAudPow2 = "assets/Taco/Audio/WhereIsMyPointerThinging.wav";
    this.kAudBG = "assets/Taco/Audio/Worldmap.mp3";
    this.kAudJump = "assets/Taco/Audio/jump.wav";
    
    // The camera to view the scene
    this.mCamera = null;
    this.mMinimapCam = null;

    this.mAllObjs = null;
    this.mAllNonPhysObj = null;
    this.mAllPlatform = null;
    this.mAllStoryPanels = null;
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
    this.mPauseBackground = null;

    this.backButton = null;
    this.MainMenuButton = null;
    
}
gEngine.Core.inheritPrototype(Level1Scene, GameScene);

Level1Scene.prototype.loadScene = function () {
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
    gEngine.Textures.loadTexture(this.kAlert);
    gEngine.Textures.loadTexture(this.kGoomba);
    gEngine.Textures.loadTexture(this.kPatrol);
    gEngine.Textures.loadTexture(this.kCannon);
    gEngine.Textures.loadTexture(this.kFlier);
    gEngine.Textures.loadTexture(this.kSmasher);
    
    gEngine.AudioClips.loadAudio(this.kAudIntro);
    gEngine.AudioClips.loadAudio(this.kAudHurt1);
    gEngine.AudioClips.loadAudio(this.kAudHurt2);
    gEngine.AudioClips.loadAudio(this.kAudPow0);
    gEngine.AudioClips.loadAudio(this.kAudPow1);
    gEngine.AudioClips.loadAudio(this.kAudPow2);
    gEngine.AudioClips.loadAudio(this.kAudBG);
    gEngine.AudioClips.loadAudio(this.kAudJump);
    gEngine.TextFileLoader.loadTextFile(this.kSceneFile, gEngine.TextFileLoader.eTextFileType.eTextFile);
    document.getElementById("particle").style.display="block"; //display the instruction below
};

Level1Scene.prototype.unloadScene = function () {
    gEngine.AudioClips.stopBackgroundAudio();
    
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
    gEngine.Textures.unloadTexture(this.kAlert);
    gEngine.Textures.unloadTexture(this.kGoomba);
    gEngine.Textures.unloadTexture(this.kPatrol);
    gEngine.Textures.unloadTexture(this.kCannon);
    gEngine.Textures.unloadTexture(this.kFlier);
    gEngine.Textures.unloadTexture(this.kSmasher);
    gEngine.AudioClips.unloadAudio(this.kAudIntro);
    gEngine.AudioClips.unloadAudio(this.kAudHurt1);
    gEngine.AudioClips.unloadAudio(this.kAudHurt2);
    gEngine.AudioClips.unloadAudio(this.kAudPow0);
    gEngine.AudioClips.unloadAudio(this.kAudPow1);
    gEngine.AudioClips.unloadAudio(this.kAudPow2);
    gEngine.AudioClips.unloadAudio(this.kAudBG);
    gEngine.AudioClips.unloadAudio(this.kAudJump);
    
    gEngine.TextFileLoader.unloadTextFile(this.kSceneFile);
    document.getElementById("particle").style.display="none";
    if(this.LevelSelect==="Back"){
        gScore = 0;
        gEngine.Core.startScene(new MyGame());
    }else if(this.LevelSelect==="Main"){
        gScore = 0;
        gEngine.Core.startScene(new MyGame());
    }else if(this.LevelSelect==="Win")
        gEngine.Core.startScene(new Level2Scene());
    else if(this.LevelSelect==="Lose")
        gEngine.Core.startScene(new LoseScene());
    
};

Level1Scene.prototype.initialize = function () {
    // Step A: set up the cameras
    this.mAllNonPhysObj = new GameObjectSet(); // contains all non-physics objects (bullets)
    this.mAllObjs = new GameObjectSet();    // store all physics object
    this.mAllStoryPanels  = new GameObjectSet();  
    this.mAllPlatform = new GameObjectSet(); //store all platform
    
    
    var jsonString = gEngine.ResourceMap.retrieveAsset(this.kSceneFile);
    var sceneInfo = JSON.parse(jsonString); 
    
    var cams = sceneInfo.Camera;   
    this.mCamera = this.parseCamera(cams[0]); 
    
    // kelvin with set animation
    this.mKelvin = new Hero(this.kKelvin, 10, 10, this.mCamera, null);
    
    this.parseObjects(sceneInfo);
    this.mMinimapCam = this.parseCamera(cams[1]);
    
    //make the parallax background
    this._makeBackground();

    gEngine.DefaultResources.setGlobalAmbientIntensity(3); // game brightness
    gEngine.Physics.incRelaxationCount(15); //time to rest after a physics event

    // the last pipe, for warping to next level
    this.mPipe = this.createPipe(505,10,10,20);

    // For debug
    this.mMsg = new FontRenderable("Status Message");
    this.mMsg.setColor([0, 0, 0, 1]);
    this.mMsg.getXform().setPosition(5, 66);
    this.mMsg.setTextHeight(2);
    
    this.mPauseMsg = new FontRenderable("Game Paused");
    this.mPauseMsg.setColor([.8, .8, .8, 1]);
    this.mPauseMsg.getXform().setPosition(20, 36);
    this.mPauseMsg.setTextHeight(10);
    
    this.mScore = new FontRenderable("Score");
    this.mScore.setColor([0, 0, 0, 1]);
    this.mScore.getXform().setPosition(5, 62);
    this.mScore.setTextHeight(3);
    
    //UI button
    this.backButton = new UIButton(this.kUIButton,this.backSelect,this,[80,576],[160,40],"Go Back",4,[1,1,1,1],[1,1,1,1]);
    this.MainMenuButton = new UIButton(this.kUIButton,this.mainSelect,this,[700,576],[200,40],"Main Menu",4,[1,1,1,1],[1,1,1,1]);
    
    // Dimming background to cue the player that the game is paused
    this.mPauseBackground = new Renderable();
    this.mPauseBackground.getXform().setPosition(250, 50);
    this.mPauseBackground.getXform().setSize(5000,2500);
    this.mPauseBackground.setColor([0,0,0,0.175]);
    
    //gEngine.AudioClips.playACue(this.kAudIntro);
    gEngine.AudioClips.playBackgroundAudio(this.kAudBG);
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
Level1Scene.prototype.draw = function () {
    GameScene.prototype.draw.call(this);
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
Level1Scene.prototype.update = function () {
   GameScene.prototype.update.call(this);
};