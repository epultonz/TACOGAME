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

function Level1Scene() {
    // remember that assets size must be in power of 2
    this.kPlatformTexture = "assets/Taco/platform.png";
    this.kKelvin = "assets/Taco/kelvinSpriteRun.png";
    this.kBG = "assets/Taco/scene_example.png";
    this.kUIButton = "assets/UI/button.png";
    this.kSprites = "assets/Taco/SpriteSheet.png";
    this.kHealthBar = "assets/UI/lives.png";
    this.kWBPanel = "assets/Taco/WornWhiteboard.png";
    this.kGreenPipe = "assets/Taco/GreenPipe.png";
    this.kSceneFile = "assets/Taco/Level1.json";
    this.kParticleTexture = "assets/Taco/particle.png";
    this.kCoin = "assets/Taco/coin.png";
    // The camera to view the scene
    this.mCamera = null;
    this.mMinimapCam = null;

    this.mAllObjs = null;
    this.mAllNonPhysObj = null;
    this.mAllPlatform = null;
    this.mPipe = null;
    this.LevelSelect = null;
    
    this.mMsg = null;
    this.mScore = null;
    
    this.mKelvin = null;
    this.mSceneBG = null;

    this.mCodeBox = null;
    
    this.mTimer = null;
    this.mLastPos = null;

    this.backButton = null;
    this.MainMenuButton = null;
    
}
gEngine.Core.inheritPrototype(Level1Scene, Scene);

Level1Scene.prototype.loadScene = function () {
    gEngine.Textures.loadTexture(this.kPlatformTexture);
    gEngine.Textures.loadTexture(this.kKelvin);
    gEngine.Textures.loadTexture(this.kBG);
    gEngine.Textures.loadTexture(this.kUIButton);
    gEngine.Textures.loadTexture(this.kSprites);
    gEngine.Textures.loadTexture(this.kHealthBar);
    gEngine.Textures.loadTexture(this.kWBPanel);
    gEngine.Textures.loadTexture(this.kGreenPipe);
    gEngine.Textures.loadTexture(this.kParticleTexture);
    gEngine.Textures.loadTexture(this.kCoin);
    gEngine.TextFileLoader.loadTextFile(this.kSceneFile, gEngine.TextFileLoader.eTextFileType.eTextFile);
    //document.getElementById("particle").style.display="block"; //display the instruction below
};

Level1Scene.prototype.unloadScene = function () {
    gEngine.Textures.unloadTexture(this.kPlatformTexture);
    gEngine.Textures.unloadTexture(this.kKelvin);
    gEngine.Textures.unloadTexture(this.kBG);
    gEngine.Textures.unloadTexture(this.kUIButton);
    gEngine.Textures.unloadTexture(this.kSprites);
    gEngine.Textures.unloadTexture(this.kHealthBar);
    gEngine.Textures.unloadTexture(this.kWBPanel);
    gEngine.Textures.unloadTexture(this.kGreenPipe);
    gEngine.Textures.unloadTexture(this.kParticleTexture);
    gEngine.Textures.unloadTexture(this.kCoin);
    gEngine.TextFileLoader.unloadTextFile(this.kSceneFile);
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

Level1Scene.prototype.initialize = function () {
    // Step A: set up the cameras
    this.mAllNonPhysObj = new GameObjectSet(); // contains all non-physics objects (bullets)
    this.mAllObjs = new GameObjectSet();    // store all physics object
    this.mAllPlatform = new GameObjectSet(); //store all platform
    
    // kelvin with set animation
    this.mKelvin = new Hero(this.kKelvin, 10, 10, null);
    this.mAllObjs.addToSet(this.mKelvin);
    
    var jsonString = gEngine.ResourceMap.retrieveAsset(this.kSceneFile);
    var sceneInfo = JSON.parse(jsonString); 
    
    var cams = sceneInfo.Camera;   
    this.mCamera = this.parseCamera(cams[0]); 
    this.parseObjects(sceneInfo);
    this.mMinimapCam = this.parseCamera(cams[1]);


    gEngine.DefaultResources.setGlobalAmbientIntensity(3); // game brightness
    gEngine.Physics.incRelaxationCount(15); //time to rest after a physics event

    // the last pipe, for warping to next level
    this.mPipe = this.createPipe(505,10,10,20);
    
    this.mTimer = Date.now();
    this.mLastPos = this.mKelvin.getXform().getPosition();

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
Level1Scene.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray
    
    this.drawMain();
    this.drawMap();
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
Level1Scene.prototype.update = function () {
    var msg = "";
    var sc = "";
    
    this.mMsg.getXform().setPosition(this.mCamera.getWCCenter()[0] - 45, 66);
    this.mScore.getXform().setPosition(this.mCamera.getWCCenter()[0] - 45, 63);
    
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
        this.mKelvin.tookDamage(15);
    }
    this.checkWinLose();
    
    // Process collision of all the physic objects
    gEngine.Physics.processCollision(this.mAllObjs,[]);
    
    //the update collision
    this.mAllObjs.update();
    this.mAllNonPhysObj.update();
    
    //check fall
    this.checkFall();
    
    this.MainMenuButton.update();
    this.backButton.update();

    // nice for debugging
    msg += " Health: " + this.mKelvin.getHP() + " |";
    msg += " CanJump status: " + collided + " |";
    //msg += " Q (damage), O (Win), L (Lose)";
    msg += "x " + this.mLastPos[0] + " " + this.mLastPos[1];
    this.mMsg.setText(msg);
    
    sc += "Score :" + gScore;
    this.mScore.setText(sc);
    
    this.mCamera.panXWith(this.mKelvin.getXform(), 0);
    this.mCamera.update();
    
    this.mMinimapCam.panXWith(this.mKelvin.getXform(), 0);
    this.mMinimapCam.update();

};

Level1Scene.prototype.parseCamera = function (camInfo) {
    var cxy = camInfo.Center;
    
    var cx = Number(cxy[0]);
    var cy = Number(cxy[1]);
    var w = Number(camInfo.Width);
    
    var i;
    var viewport = [1,1,1,1];
    
    for (i = 0; i < 4; i++) {

        viewport[i] = Number(camInfo.Viewport[i]);
    }
    i = 0;
    var bgColor = [1,1,1,1];
    for (i = 0; i < 4; i++) {
        bgColor[i] = Number(camInfo.BgColor[i]);
    }
    

    var cam = new Camera(
        vec2.fromValues(cx, cy),  // position of the camera
        w,                        // width of camera
        viewport                  // viewport (orgX, orgY, width, height)
        );
    cam.setBackgroundColor(bgColor);
    return cam;
};

Level1Scene.prototype.parseObjects = function (sceneInfo) {
    
    if(sceneInfo.hasOwnProperty("Patrol")){
        //parse patrols
        var patrols = sceneInfo.Patrol;
        var i, pos, patrol;
        for (i = 0; i < patrols.length; i++) {
            pos = patrols[i].Pos;
            patrol = new Patrol(this.kSprites, pos[0], pos[1], this.mKelvin);
            this.mAllObjs.addToSet(patrol);
            this.mAllPlatform.addToSet(patrol);

        }
    }
     
    if(sceneInfo.hasOwnProperty("Cannon")){
        //parse cannons
        var cannons = sceneInfo.Cannon;
        var i, pos, cannon, facing;
        for (i = 0; i < cannons.length; i++) {
            pos = cannons[i].Pos;    
            facing = cannons[i].Facing;
            // init cannon
            cannon = new Cannon(this.kSprites, pos[0], pos[1], this.mKelvin, this.mAllNonPhysObj, facing);
            this.mAllObjs.addToSet(cannon);
            this.mAllPlatform.addToSet(cannon);
        }
    }

    if(sceneInfo.hasOwnProperty("Flier")){
        //parse fliers
        var fliers = sceneInfo.Flier;
        var i, pos, flier;
        for (i = 0; i < fliers.length; i++) {
            pos = fliers[i].Pos;    
            flier = new Flier(this.kSprites, pos[0], pos[1], this.mKelvin, this.mAllNonPhysObj);
            this.mAllObjs.addToSet(flier);  
        }
    }
    
    
    if(sceneInfo.hasOwnProperty("Smasher")){
        //parse smashers
        var smashers = sceneInfo.Smasher;
        var i, pos, bBound, tBound, uVelocity, dVelocity, smasher;
        for (i = 0; i < smashers.length; i++) {
            pos = smashers[i].Pos;    
            bBound = smashers[i].botBound;
            tBound = smashers[i].topBound;
            uVelocity = smashers[i].velocityUp;
            dVelocity = smashers[i].velocityDown;

            // init smashers
            smasher = new Smasher(this.kSprites, pos[0], pos[1], this.mKelvin, 
                tBound, bBound, uVelocity, dVelocity);
            this.mAllObjs.addToSet(smasher);
            this.mAllPlatform.addToSet(smasher);
        }
    }
    
    
    if(sceneInfo.hasOwnProperty("Coin")){
        //parse coins
        var coins = sceneInfo.Coin;
        var i, pos, coin;
        for (i = 0; i < coins.length; i++) {
            pos = coins[i].Pos;
            coin = new Coin(this.kCoin, pos[0], pos[1], this.mKelvin);
            this.mAllNonPhysObj.addToSet(coin);

        }
    }
    

    
    if(sceneInfo.hasOwnProperty("Powerup")){
        //parse powerups
        var pu = sceneInfo.Powerup;
        var i, pos, mPU;
        for(i = 0; i < pu.length; i++){
            pos = pu[i].Pos;
            mPU = new Powerup(this.kSprites,pos[0],pos[1],this.mKelvin);
            this.mAllNonPhysObj.addToSet(mPU);
        }
    }

    
    // scene background
    var background = sceneInfo.SceneBG[0];
    var pos = background.Pos;
    var size = background.Size;
    
    this.mSceneBG = new LightRenderable(this.kBG);
    this.mSceneBG.getXform().setSize(size[0],size[1]);
    this.mSceneBG.getXform().setPosition(pos[0],pos[1]);
    this.mSceneBG.addLight(this.mKelvin.getSuperLight());
    this.mBG = new TiledGameObject(this.mSceneBG);
    
    if(sceneInfo.hasOwnProperty("StoryPanel")){
        //story panels
        var storyPanels = sceneInfo.StoryPanel;
        var i, txt, spawnX, spawnY, panel;
        for (i = 0; i < storyPanels.length; i++) {  
            txt = storyPanels[i].text;
            spawnX = storyPanels[i].stubX;
            spawnY = storyPanels[i].stubY;

            panel = new StoryPanel(this.kWBPanel,spawnX, spawnY, 70, 
                this.mCamera, this.mKelvin, txt);
            this.mAllNonPhysObj.addToSet(panel);
        }
    }

    
    if(sceneInfo.hasOwnProperty("GreenPipe")){
        //parse green pipes
        var pipes = sceneInfo.GreenPipe;
        var i, pos, size, pipe;
        for (i = 0; i < pipes.length; i++) {
            pos = pipes[i].Pos;    
            size = pipes[i].Size;
            pipe = this.createPipe(pos[0],pos[1],size[0],size[1]);
        }
    }
    
    //parse platforms
    var platforms = sceneInfo.Platform;
    var i, pos, w, rot;
    for (i = 0; i < platforms.length; i++) {
        pos = platforms[i].Pos;    
        w = platforms[i].W;
        rot = platforms[i].Rot;
        this.platformAt(pos[0],pos[1],w,rot);
    }
    
};

// Make the platforms
Level1Scene.prototype.platformAt = function (x, y, w, rot) {
    var h = w / 8;
    var p = new TextureRenderable(this.kPlatformTexture);
    var xf = p.getXform();

    var g = new GameObject(p);
    var r = new RigidRectangle(xf, w, h);
    g.setRigidBody(r);
    //g.toggleDrawRenderable();
    //g.toggleDrawRigidShape();

    r.setMass(0);
    xf.setSize(w, h);
    xf.setPosition(x, y);
    xf.setRotationInDegree(rot);

    this.mAllObjs.addToSet(g);
    this.mAllPlatform.addToSet(g);
};
// back button UI
Level1Scene.prototype.backSelect = function(){
    this.LevelSelect="Back";
    gEngine.GameLoop.stop();
};
// menu button UI
Level1Scene.prototype.mainSelect = function(){
    this.LevelSelect="Main";
    gEngine.GameLoop.stop();
};

Level1Scene.prototype.createPipe = function(posX,posY,sX,sY){
    var g = new TextureRenderable(this.kGreenPipe);
    var xf = g.getXform();
    xf.setSize(sX,sY);
    xf.setPosition(posX,posY);

    var o = new GameObject(g);
    var r = new RigidRectangle(xf,sX,sY);
    o.setRigidBody(r);

    r.setMass(0);

    this.mAllObjs.addToSet(o);
    this.mAllPlatform.addToSet(o);

    return o;
};

Level1Scene.prototype.checkWinLose = function(){
    // Win conditions
    var canWarp = false;
    if(this.mKelvin.getXform().getXPos() >= 503 && this.mKelvin.getXform().getXPos() <= 507){
        canWarp = true;
    }
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.S) && canWarp) {
        //this.mKelvin.getXform().setPosition(95,5);
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

Level1Scene.prototype.drawMain = function() {
    this.mCamera.setupViewProjection();
    
    this.mBG.draw(this.mCamera);
    this.mAllObjs.draw(this.mCamera);
    this.mAllNonPhysObj.draw(this.mCamera);

    this.MainMenuButton.draw(this.mCamera);
    this.backButton.draw(this.mCamera);
    
    this.mMsg.draw(this.mCamera);
    this.mScore.draw(this.mCamera);
};

Level1Scene.prototype.drawMap = function() {
    
    this.mMinimapCam.setupViewProjection();

    //this.mSceneBG.draw(this.mMinimapCam);
    this.mBG.draw(this.mMinimapCam);
    this.mAllObjs.draw(this.mMinimapCam);
    this.mAllNonPhysObj.draw(this.mMinimapCam);

    this.mMsg.draw(this.mMinimapCam);
    
};

Level1Scene.prototype.createParticle = function(atX, atY) {
    var life = 30 + Math.random() * 200;
    var p = new ParticleGameObject("assets/Taco/particle.png", atX, atY, life);
    p.getRenderable().setColor([1, 0, 0, 1]);
    
    // size of the particle
    var r = .5 + (Math.random() * (1-.5));   //(Math.random * (max-min)) + min
    p.getXform().setSize(r, r);
    
    // final color
    var fr = 3.5 + Math.random();
    var fg = 0.4 + 0.1 * Math.random();
    var fb = 0.3 + 0.1 * Math.random();
    p.setFinalColor([fr, fg, fb, 0.6]);
    
    // velocity on the particle
    var fx = 10 * Math.random() - 20 * Math.random();
    var fy = 10 * Math.random();
    p.getParticle().setVelocity([fx, fy]);
    
    // size delta
    p.setSizeDelta(0.98);
    
    return p;
};

Level1Scene.prototype.checkFall = function() {
    //check if kelvin falls. If yes, take damage and spawn at location 2sec b4
    //else, update the last spawn pos
    var t = Date.now();
    if(this.mKelvin.getXform().getYPos() < -5){
        this.mKelvin.tookDamage(10);
        // check if xPos is the same as fall xPos to avoid constant fall
        if(this.mLastPos[0] === this.mKelvin.getXform().getXPos()){
            this.mKelvin.getXform().setPosition(this.mLastPos[0]-20,this.mLastPos[1]+5);
        } else {
            this.mKelvin.getXform().setPosition(this.mLastPos[0],this.mLastPos[1]+5);
        }
        
    } else {
        var t2 = this.mTimer + 2000;
        if(t > t2){
            var p = this.mKelvin.getXform().getPosition();
            this.mLastPos = [p[0],p[1]];
            this.mTimer = Date.now();
        }
    }
    
};



