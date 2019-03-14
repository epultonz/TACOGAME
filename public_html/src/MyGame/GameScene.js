/*
 * File: GameScene.js
 * Main file that we will use to test our Taco game DEMO
 *
 */

/*jslint node: true, vars: true */
/*global gEngine, Scene, GameObjectset, TextureObject, Camera, vec2,
  FontRenderable, SpriteRenderable, LineRenderable,
  GameObj, SpriteAnimateRenderable */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

var gScore = gScore || 0;

function GameScene() {
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
    this.kSceneFile = "assets/Taco/GameScene.json";
    this.kParticleTexture = "assets/Taco/particle.png";
    this.kCoin = "assets/Taco/coin.png";
    // The camera to view the scene
    this.mCamera = null;
    this.mMinimapCam = null;

    this.mAllObjs = null;
    this.mAllNonPhysObj = null;
    this.mAllStoryPanels = null;
    this.mAllPlatform = null;
    this.mAllMinimapPlatform = null;
    this.mPipe = null;
    this.LevelSelect = null;
    
    this.mMsg = null;
    this.mScore = null;
    
    this.mKelvin = null;
    this.mPatrol = null;
    this.mCannons = null;
    this.mFlier = null;
    this.mPowerup = null;
    this.mSceneBG = null;

    this.mCodeBox = null;
    
    this.mTimer = null;
    this.mLastPos = null;

    this.backButton = null;
    this.MainMenuButton = null;
    
}
gEngine.Core.inheritPrototype(GameScene, Scene);

GameScene.prototype.loadScene = function () {
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
    gEngine.TextFileLoader.loadTextFile(this.kSceneFile, gEngine.TextFileLoader.eTextFileType.eTextFile);
    document.getElementById("particle").style.display="block"; //display the instruction below
};

GameScene.prototype.unloadScene = function () {
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
        gEngine.Core.startScene(new LoseScene());
    
};

GameScene.prototype.initialize = function () {
    // Step A: set up the cameras
    this.mAllNonPhysObj = new GameObjectSet(); // contains all non-physics objects (bullets)
    this.mAllStoryPanels  = new GameObjectSet();    // store all physics objects
    this.mAllPlatform = new GameObjectSet(); //store all platform
    this.mAllTerrainSimple = []; // Used to store simple renderables that represent terrain (not enemies)
    this.mAllMinimapPlatform = new GameObjectSet(); // store minimap versions of all platforms
    this.mKelvin = new Hero(this.kKelvin, 10, 10, null);

    var jsonString = gEngine.ResourceMap.retrieveAsset(this.kSceneFile);
    var sceneInfo = JSON.parse(jsonString); 
    
    var cams = sceneInfo.Camera;   
    this.mCamera = this.parseCamera(cams[0]); 
    this.parseObjects(sceneInfo);
    this.mMinimapCam = this.parseCamera(cams[1]);


    gEngine.DefaultResources.setGlobalAmbientIntensity(3); // game brightness
    gEngine.Physics.incRelaxationCount(15); //time to rest after a physics event

    // make the bounds.. platform etc
    //this.createBounds();
    //this.mPipe = this.createPipe(95,-4,10,20);
    
    this.mTimer = Date.now();
    this.mLastPos = this.mKelvin.getXform().getPosition();
    
    // the code box to unlock green pipe
    //@param [stubX,stubY,code]
    //this.mCodeBox = new CodeMechanism(40,85,"1234",this.mKelvin,this.mCamera);

    // For debug
    this.mMsg = new FontRenderable("Status Message");
    this.mMsg.setColor([0, 0, 0, 1]);
    this.mMsg.getXform().setPosition(5, 66);
    this.mMsg.setTextHeight(2);
    
    this.mScore = new FontRenderable("Score");
    this.mScore.setColor([0, 0, 0, 1]);
    this.mScore.getXform().setPosition(5, 63);
    this.mScore.setTextHeight(2);
    
    //UI button
    this.backButton = new UIButton(this.kUIButton,this.backSelect,this,[80,576],[160,40],"Go Back",4,[1,1,1,1],[1,1,1,1]);
    this.MainMenuButton = new UIButton(this.kUIButton,this.mainSelect,this,[700,576],[200,40],"Main Menu",4,[1,1,1,1],[1,1,1,1]);
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
GameScene.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray
    
    this.drawMain();
    this.drawMap();
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
GameScene.prototype.update = function () {
    //get only objects near kelvin
    var objNearKelvin = this._getObjectsNearKelvin();
    //check if a story panel is being touched
    var i;
    var pause = false;
    for (i=0; i < this.mAllStoryPanels.size(); i++) {
        if(this.mAllStoryPanels.getObjectAt(i).update()) {
            pause = true;
            break;
        }
    }
    //check if kelvin can jump
    var collInfo = new CollisionInfo();
        var collided = false;
        var kelvinRbox = this.mKelvin.getRbox();

        for (var i = 0; i < objNearKelvin.size(); i++) {
            var platBox1 = objNearKelvin.getObjectAt(i).getRigidBody();
            collided = kelvinRbox.collisionTest(platBox1,collInfo);
            if (collided) {
                this.mKelvin.canJump(true);
                break;
            }
    }
    this.mKelvin.update();
    //if the game is not paused
    if(!pause) {
        var msg = "";
        var sc = "";

        this.mMsg.getXform().setPosition(this.mCamera.getWCCenter()[0] - 45, 66);
        this.mScore.getXform().setPosition(this.mCamera.getWCCenter()[0] - 45, 63);

        // check if kelvin is on ground. If yes, can jump.
        this.mAllNonPhysObj.update();
        this.mAllPlatform.update();

        this.checkWinLose();
        this.checkFall();

        this.MainMenuButton.update();
        this.backButton.update();

        // nice for debugging
        msg += " Health: " + this.mKelvin.getHP() + " |" + " CanJump " + (collided) + " | ";
    ;
        //msg += " Q (damage), O (Win), L (Lose)";
        msg += "x " + this.mLastPos[0].toPrecision(4) + " " + this.mLastPos[1].toPrecision(4);
        this.mMsg.setText(msg);

        sc += "Score :" + gScore;
        this.mScore.setText(sc);

        this.mCamera.panXWith(this.mKelvin.getXform(), 0);
        this.mCamera.update();

        this.mMinimapCam.panXWith(this.mKelvin.getXform(), 0);
        this.mMinimapCam.update();
    }

    gEngine.Physics.processObjSet(this.mKelvin.getRigidBody(), objNearKelvin);


};

GameScene.prototype._getObjectsNearKelvin = function() {
    var i;
    var objNearKelvin = new GameObjectSet();

    //only do collision processing with objects near kelvin
    //reduces the amount of collision processing from 40+ obj to <5
    for (i =0; i<this.mAllPlatform.size(); i++) {
        var obj = this.mAllPlatform.getObjectAt(i);
        var xPosObj = obj.getXform().getPosition()[0];
        var xPosKelvin = this.mKelvin.getXform().getPosition()[0];
        if(Math.abs(xPosObj - xPosKelvin) < 30) {
            objNearKelvin.addToSet(obj);
        }
    }
    return objNearKelvin;
}