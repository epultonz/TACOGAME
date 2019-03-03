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

    // The camera to view the scene
    this.mCamera = null;

    this.mAllObjs = null;
    this.mAllPlatform = null;
    this.LevelSelect = null;

    this.mMsg = null;

    this.mKelvin = null;
    this.mPatrol = null;
    this.mCannons = null;
    this.mSceneBG = null;

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
    //document.getElementById("particle").style.display="block"; //display the instruction below
};

TacoDemo.prototype.unloadScene = function () {
    gEngine.Textures.unloadTexture(this.kPlatformTexture);
    gEngine.Textures.unloadTexture(this.kKelvin);
    gEngine.Textures.unloadTexture(this.kBG);
    gEngine.Textures.unloadTexture(this.kUIButton);
    gEngine.Textures.unloadTexture(this.kSprites);
    gEngine.Textures.unloadTexture(this.kHealthBar);
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
    gEngine.DefaultResources.setGlobalAmbientIntensity(3); // game brightness
    gEngine.Physics.incRelaxationCount(15); //time to rest after a physics event

    this.mAllObjs = new GameObjectSet();    // store all physics object
    this.mAllPlatform = new GameObjectSet(); //store all platform

    // make the bounds.. platform etc
    this.createBounds();

    // kelvin with set animation
    this.mKelvin = new Hero(this.kKelvin, 10, 15, null);
    this.mAllObjs.addToSet(this.mKelvin);

    // init Patrol
    this.mPatrol = new Patrol(this.kSprites, 35, 23, this.mKelvin);
    this.mAllObjs.addToSet(this.mPatrol);

    // init cannon
    this.mCannons = new Cannon(this.kSprites, 85, 23);
    this.mAllObjs.addToSet(this.mCannons);

    // scene background
    this.mSceneBG = new TextureRenderable(this.kBG);
    this.mSceneBG.getXform().setSize(100,50);
    this.mSceneBG.getXform().setPosition(50,30);

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

    this.MainMenuButton.draw(this.mCamera);
    this.backButton.draw(this.mCamera);

    this.mMsg.draw(this.mCamera);
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
TacoDemo.prototype.update = function () {
    var delta = 0.3;
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

    this.mAllObjs.update();

    // Process collision of all the physic objects
    gEngine.Physics.processCollision(this.mAllObjs,[]);


    this.MainMenuButton.update();
    this.backButton.update();

    // nice for debugging
    msg += " Relaxation count: " + gEngine.Physics.getRelaxationCount() + " ";
    this.mMsg.setText(msg);

};

TacoDemo.prototype.createBounds = function() {
    var x = 15, w = 30, y = 4;
    for (x = 15; x < 120; x+=30)
        this.platformAt(x, y, w, 0);

    var x = 30, w = 30, y = 18;
    this.platformAt(x,y,w,0);
    this.platformAt(80,y,w,0);
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
