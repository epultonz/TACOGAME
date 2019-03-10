/*jslint node: true, vars: true */
/*global GameScene, vec2, gEngine */
/* find out more about jslint: http://www.jslint.com/help.html */

GameScene.prototype.parseCamera = function (camInfo) {
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

GameScene.prototype.parseObjects = function (sceneInfo) {
    //parse patrols
    var patrols = sceneInfo.Patrol;
    var i, pos, patrol;
    for (i = 0; i < patrols.length; i++) {
        pos = patrols[i].Pos;
        patrol = new Patrol(this.kSprites, pos[0], pos[1], this.mKelvin);
        this.mAllObjs.addToSet(patrol);
        this.mAllPlatform.addToSet(patrol);
        
    }
   
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
    
    //parse fliers
    var fliers = sceneInfo.Flier;
    var i, pos, flier;
    for (i = 0; i < fliers.length; i++) {
        pos = fliers[i].Pos;    
        flier = new Flier(this.kSprites, pos[0], pos[1], this.mKelvin, this.mAllNonPhysObj);
        this.mAllObjs.addToSet(flier);  
    }
    
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
    
    //parse coins
    var coins = sceneInfo.Coin;
    var i, pos, coin;
    for (i = 0; i < coins.length; i++) {
        pos = coins[i].Pos;
        coin = new Coin(this.kCoin, pos[0], pos[1], this.mKelvin);
        this.mAllNonPhysObj.addToSet(coin);
        
    }
    
    //parse powerups
    var pu = sceneInfo.Powerup;
    
    
    // scene background
    var background = sceneInfo.SceneBG[0];
    var pos = background.Pos;
    var size = background.Size;
    
    this.mSceneBG = new LightRenderable(this.kBG);
    this.mSceneBG.getXform().setSize(size[0],size[1]);
    this.mSceneBG.getXform().setPosition(pos[0],pos[1]);
    this.mSceneBG.addLight(this.mKelvin.getSuperLight());
    this.mBG = new TiledGameObject(this.mSceneBG);
    
    
    //story panels
    var storyPanels = sceneInfo.StoryPanel;
    var i, pos, width, txt, spawnX, spawnY, panel;
    for (i = 0; i < storyPanels.length; i++) {
        pos = storyPanels[i].Pos;    
        width = storyPanels[i].Width;
        txt = storyPanels[i].text;
        spawnX = storyPanels[i].stubX;
        spawnY = storyPanels[i].stubY;
        
        this.mTutoPanel = new StoryPanel(this.kWBPanel,spawnX, spawnY, width, 
            this.mCamera, this.mKelvin, txt);
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

GameScene.prototype.createBounds = function() {
    var x = 15, w = 30, y = 0;
    for (x = 15; x < 120; x+=30)
        this.platformAt(x, y, w, 0);
 
};

// Make the platforms
GameScene.prototype.platformAt = function (x, y, w, rot) {
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
GameScene.prototype.backSelect = function(){
    this.LevelSelect="Back";
    gEngine.GameLoop.stop();
};
// menu button UI
GameScene.prototype.mainSelect = function(){
    this.LevelSelect="Main";
    gEngine.GameLoop.stop();
};

GameScene.prototype.createPipe = function(){
    var g = new TextureRenderable(this.kGreenPipe);
    var xf = g.getXform();
    xf.setSize(10,20);
    xf.setPosition(95,-4);

    var o = new GameObject(g);
    var r = new RigidRectangle(xf,10,20);
    o.setRigidBody(r);

    r.setMass(0);

    this.mAllObjs.addToSet(o);
    this.mAllPlatform.addToSet(o);

    return o;
};

GameScene.prototype.checkWinLose = function(){
    // Win conditions
    var canWarp = false;
    if(this.mKelvin.getXform().getXPos() >= 93 && this.mKelvin.getXform().getXPos() <= 97 &&
            this.mCodeBox.getSolve()){
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

GameScene.prototype.drawMain = function() {
    this.mCamera.setupViewProjection();
    var i;
    /*
    var pos = this.mSceneBG.getXform().getPosition();
    for(i=0; i<4; i++) {
        this.mSceneBG.draw(this.mCamera);
        pos[0] += 100;
    }
    pos[0] = 0;
    */
    this.mBG.draw(this.mCamera);
    this.mAllObjs.draw(this.mCamera);
    this.mAllNonPhysObj.draw(this.mCamera);

    this.MainMenuButton.draw(this.mCamera);
    this.backButton.draw(this.mCamera);

    this.mTutoPanel.draw(this.mCamera);
    this.mCodeBox.draw(this.mCamera);
    
    this.mMsg.draw(this.mCamera);
    this.mScore.draw(this.mCamera);
};

GameScene.prototype.drawMap = function() {
    
    this.mMinimapCam.setupViewProjection();

    //this.mSceneBG.draw(this.mMinimapCam);
    this.mBG.draw(this.mMinimapCam);
    this.mAllObjs.draw(this.mMinimapCam);
    this.mAllNonPhysObj.draw(this.mMinimapCam);

    this.mMsg.draw(this.mMinimapCam);
    
    
};

GameScene.prototype.createParticle = function(atX, atY) {
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

GameScene.prototype.checkFall = function() {
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



