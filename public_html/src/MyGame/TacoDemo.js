/*
 * File: TacoDemo.js
 * Main file that we will use to test our Taco game DEMO
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
    this.kKelvin = "assets/Taco/kelvinSpriteRun.png";
    this.kBG = "assets/Taco/scene_example.png";
    this.kUIButton = "assets/UI/button.png";
    this.kSprites = "assets/Taco/SpriteSheet.png";
    this.kHealthBar = "assets/UI/healthbar.png";
    this.kWBPanel = "assets/Taco/WornWhiteboard.png";
    this.kGreenPipe = "assets/Taco/GreenPipe.png";

    // The camera to view the scene
    this.mCamera = null;

    this.mAllObjs = null;
    this.mAllNonPhysObj = null;
    this.mAllPlatform = null;
    this.mPipe = null;
    this.LevelSelect = null;

    this.mMsg = null;

    this.mKelvin = null;
    this.mPatrol = null;
    this.mCannons = null;
    this.mFlier = null;
    this.mSceneBG = null;
    
    this.mTutoPanel = null;
    this.mTutoStub = null;

    this.backButton = null;
    this.MainMenuButton = null;

}
gEngine.Core.inheritPrototype(TacoDemo, Scene);

TacoDemo.prototype.loadScene = function () {
    gEngine.Textures.loadTexture(this.kPlatformTexture);
    gEngine.Textures.loadTexture(this.kKelvin);
    gEngine.Textures.loadTexture(this.kBG);
    gEngine.Textures.loadTexture(this.kUIButton);
    gEngine.Textures.loadTexture(this.kSprites);
    gEngine.Textures.loadTexture(this.kHealthBar);
    gEngine.Textures.loadTexture(this.kWBPanel);
    gEngine.Textures.loadTexture(this.kGreenPipe);
    //document.getElementById("particle").style.display="block"; //display the instruction below
};

TacoDemo.prototype.unloadScene = function () {
    gEngine.Textures.unloadTexture(this.kPlatformTexture);
    gEngine.Textures.unloadTexture(this.kKelvin);
    gEngine.Textures.unloadTexture(this.kBG);
    gEngine.Textures.unloadTexture(this.kUIButton);
    gEngine.Textures.unloadTexture(this.kSprites);
    gEngine.Textures.unloadTexture(this.kHealthBar);
    gEngine.Textures.unloadTexture(this.kWBPanel);
    gEngine.Textures.unloadTexture(this.kGreenPipe);
    //document.getElementById("particle").style.display="none";
    if(this.LevelSelect==="Back")
        gEngine.Core.startScene(new MyGame());
    else if(this.LevelSelect==="Main")
        gEngine.Core.startScene(new MyGame());
    else if(this.LevelSelect==="Win")
        gEngine.Core.startScene(new WinScene());
    else if(this.LevelSelect==="Lose")
        gEngine.Core.startScene(new LoseScene());
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
    gEngine.DefaultResources.setGlobalAmbientIntensity(3); // game brightness
    gEngine.Physics.incRelaxationCount(15); //time to rest after a physics event

    this.mAllNonPhysObj = new GameObjectSet(); // contains all non-physics objects (bullets)
    this.mAllObjs = new GameObjectSet();    // store all physics object
    this.mAllPlatform = new GameObjectSet(); //store all platform

    // make the bounds.. platform etc
    this.createBounds();
    this.mPipe = this.createPipe();
    
    // kelvin with set animation
    this.mKelvin = new Hero(this.kKelvin, 10, 15, null);
    this.mAllObjs.addToSet(this.mKelvin);

    // init Patrol
    this.mPatrol = new Patrol(this.kSprites, 35, 23, this.mKelvin);
    this.mAllObjs.addToSet(this.mPatrol);

    // init cannon
    this.mCannons = new Cannon(this.kSprites, 85, 23.5, this.mKelvin, this.mAllNonPhysObj);
    this.mAllObjs.addToSet(this.mCannons);
    
    this.mFlier = new Flier(this.kSprites, 70, 40, this.mKelvin, this.mAllNonPhysObj);
    this.mAllNonPhysObj.addToSet(this.mFlier);

    // scene background
    this.mSceneBG = new TextureRenderable(this.kBG);
    this.mSceneBG.getXform().setSize(100,50);
    this.mSceneBG.getXform().setPosition(50,30);
    
    // tutorial panel. @param(texture,atX,atY,width,txt,stubX,stubY)
    this.mTutoPanel = new StoryPanel(this.kWBPanel,50,20,70,
        "Story Element Panel Demo",15,7);
    
    // For debug
    this.mMsg = new FontRenderable("Status Message");
    this.mMsg.setColor([0, 0, 0, 1]);
    this.mMsg.getXform().setPosition(5, 70);
    this.mMsg.setTextHeight(2);

    //UI button
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

    this.mAllObjs.draw(this.mCamera);
    this.mAllNonPhysObj.draw(this.mCamera);

    this.MainMenuButton.draw(this.mCamera);
    this.backButton.draw(this.mCamera);
    
    this.mTutoPanel.draw(this.mCamera);
    
    this.mMsg.draw(this.mCamera);
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
TacoDemo.prototype.update = function () {
    var msg = "";

    // check if kelvin is on ground. If yes, can jump.
    var collInfo = new CollisionInfo();
    var collided = false;
    for (var i = 0; i < this.mAllPlatform.size(); i++) {
        var platBox = this.mAllPlatform.getObjectAt(i).getRigidBody();
        collided = this.mKelvin.getRbox().collisionTest(platBox,collInfo);
        if (collided) {
            this.mKelvin.canJump(true);
            break;
        }
    }

    //press q to simulate attack
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Q)) {
        this.mKelvin.tookDamage();
    }
    this.checkWinLose();

    this.mAllObjs.update();
    this.mAllNonPhysObj.update();

    // Process collision of all the physic objects
    gEngine.Physics.processCollision(this.mAllObjs,[]);
    
    // tutorial panel bounding box collision
    var bb = this.mTutoPanel.getPanelBBox().boundCollideStatus(this.mKelvin.getBBox());
    if(bb){
        this.mTutoPanel.actFlag(true);
    } else { this.mTutoPanel.actFlag(false); }

    this.MainMenuButton.update();
    this.backButton.update();

    // nice for debugging
    msg += " Health: " + this.mKelvin.getHP() + " |";
    msg += " CanJump status: " + collided + " |";
    msg += " Q (damage), O (Win), L (Lose)";
    this.mMsg.setText(msg);

};

TacoDemo.prototype.createBounds = function() {
    var x = 15, w = 30, y = 4;
    for (x = 15; x < 120; x+=30)
        this.platformAt(x, y, w, 0);

    this.platformAt(30,18,30,0);
    this.platformAt(80,18,30,0);
};

// Make the platforms
TacoDemo.prototype.platformAt = function (x, y, w, rot) {
    var h = w / 8;
    var p = new TextureRenderable(this.kPlatformTexture);
    var xf = p.getXform();

    var g = new GameObject(p);
    var r = new RigidRectangle(xf, w, h);
    g.setRigidBody(r);
    //g.toggleDrawRenderable();
    g.toggleDrawRigidShape();

    r.setMass(0);
    xf.setSize(w, h);
    xf.setPosition(x, y);
    xf.setRotationInDegree(rot);

    this.mAllObjs.addToSet(g);
    this.mAllPlatform.addToSet(g);
};

// back button UI
TacoDemo.prototype.backSelect = function(){
    this.LevelSelect="Back";
    gEngine.GameLoop.stop();
};

// menu button UI
TacoDemo.prototype.mainSelect = function(){
    this.LevelSelect="Main";
    gEngine.GameLoop.stop();
};

TacoDemo.prototype.createPipe = function(){
    var g = new TextureRenderable(this.kGreenPipe);
    var xf = g.getXform();
    xf.setSize(10,20);
    xf.setPosition(95,0);
    
    var o = new GameObject(g);
    var r = new RigidRectangle(xf,10,20);
    o.setRigidBody(r);
    
    r.setMass(0);
    
    this.mAllObjs.addToSet(o);
    this.mAllPlatform.addToSet(o);
    
    return o;
};

TacoDemo.prototype.checkWinLose = function(){
    // Win conditions
    var canWarp = false;
    if(this.mKelvin.getXform().getXPos() >= 93 && this.mKelvin.getXform().getXPos() <= 97){
        canWarp = true;
    }
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.S) && canWarp) {
        this.mKelvin.getXform().setPosition(95,5);
        this.LevelSelect = "Win";
        gEngine.GameLoop.stop();
    }
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.O)) {
        this.LevelSelect = "Win";
        gEngine.GameLoop.stop();
    }
    //lose conditions
    var hp = this.mKelvin.getHP();
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.L ) || hp <= 0 ) {
        this.LevelSelect = "Lose";
        gEngine.GameLoop.stop();
    }
};