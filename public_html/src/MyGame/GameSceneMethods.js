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
        viewport                  // viewport (orgX, orgY, width, height
    );
    cam.setBackgroundColor(bgColor);
    return cam;
};

GameScene.prototype.parseObjects = function (sceneInfo) {
    
    if(sceneInfo.hasOwnProperty("Patrol")){
        //parse patrols
        var patrols = sceneInfo.Patrol;
        var i, pos, patrol;
        for (i = 0; i < patrols.length; i++) {
            pos = patrols[i].Pos;
            patrol = new Patrol(pos[0], pos[1]+0.5, this.mKelvin);
            //this.mAllObjs.addToSet(patrol);
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
            cannon = new Cannon(this.kSprites2, pos[0], pos[1], this.mKelvin, this.mAllNonPhysObj, facing);
            this.mAllPlatform.addToSet(cannon);
            //this.mAllObjs.addToSet(cannon);
        }
    }

    if(sceneInfo.hasOwnProperty("Flier")){
        //parse fliers
        var fliers = sceneInfo.Flier;
        var i, pos, flier;
        for (i = 0; i < fliers.length; i++) {
            pos = fliers[i].Pos;    
            flier = new Flier(this.kSprites2,this.kSprites, pos[0], pos[1], this.mKelvin, this.mAllNonPhysObj);
            this.mAllPlatform.addToSet(flier);
            //this.mAllObjs.addToSet(flier);
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
            smasher = new Smasher(this.kSprites2, pos[0], pos[1], this.mKelvin, 
                tBound, bBound, uVelocity, dVelocity);
            //this.mAllObjs.addToSet(smasher);
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
        var i, pos, type, respawnFlag, respawnTimer, powerupTimer, mPU;
        for(i = 0; i < pu.length; i++){
            pos = pu[i].Pos;
            type = pu[i].Type;
            respawnFlag = pu[i].respawnFlag;
            respawnTimer = pu[i].respawnTimer;
            powerupTimer = pu[i].powerupTimer;
            
            mPU = new Powerup(this.kSprites2,pos[0],pos[1],this.mKelvin, type,
                respawnFlag, respawnTimer, powerupTimer);
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

            panel = new StoryPanel(this.kWBPanel,spawnX, spawnY, 80, 
                this.mCamera, this.mKelvin, txt);
            this.mAllStoryPanels.addToSet(panel);
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
    
    //parse spawnpoints
    var spawnPoints = sceneInfo.SpawnPoint;
    var i;
    for (i = 0; i < spawnPoints.length; i++)
    {
        
        var spawnPoint = new Renderable();
        var spawnXf = spawnPoint.getXform();
        var spawnPos = spawnPoints[i].Pos;
        spawnPoint.setColor([1, .2, 1, 1]);
        spawnXf.setSize(6, 6);
        spawnXf.setPosition(spawnPos[0], spawnPos[1]);
        //this.mAllTerrainSimple.push(spawnPoint);
        
        this.mSpawnPoints.push(spawnPoints[i].Pos);
    }
    //alert(this.mSpawnPoints);
    
};



GameScene.prototype.createBounds = function() {
    var x = 15, w = 30, y = 0;
    for (x = 15; x < 120; x+=30)
        this.platformAt(x, y, w, 0);
 
};

// Make the platforms
GameScene.prototype.platformAt = function (origX, y, w, rot) {
    //did this so i didnt have to redo the json file
    var x = (origX -(w/2.0))+2.5;
    var h = 5;
    var width = 5;
    var i, deltaY;
    //every block is width of 5 so for w of 30 need 6 blocks
    for(i =0; i < w/5.0; i++) {
        var p = new TextureRenderable(this.kPlatformTexture);
        p.setColor([1, 1, 1, 0]);
        var xf = p.getXform();
        
        xf.setSize(width, h);
        //take into account rotation (shift block in the x and y)
        var rot_rad = rot * (Math.PI/180);
        var deltaX = 5.0*Math.cos(rot_rad);
        deltaY = 5.0*Math.sin(rot_rad);
        var antiWidth = 0; //width/8 - 1;
        xf.setPosition(x+(i*deltaX), 
            y+(i*deltaY)+antiWidth);
        xf.setRotationInDegree(rot);
        var g = new GameObject(p);
        var r = new RigidRectangle(xf, width, h);
        g.setRigidBody(r);
        //g.toggleDrawRenderable();
        //g.toggleDrawRigidShape();

        r.setMass(0);

        //this.mAllObjs.addToSet(g);
        this.mAllPlatform.addToSet(g);
    }
    
    var simplePlat = new Renderable();
    var simpleXf = simplePlat.getXform();
    simpleXf.setSize(w, h);
    simpleXf.setPosition(origX, y+deltaY);
    simpleXf.setRotationInDegree(rot);
        
    this.mAllTerrainSimple.push(simplePlat);
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

GameScene.prototype.createPipe = function(posX,posY,sX,sY){
    var g = new TextureRenderable(this.kGreenPipe);
    var xf = g.getXform();
    xf.setSize(sX,sY);
    xf.setPosition(posX,posY);
    
    var simplePipe = new Renderable();
    var simpleXf = simplePipe.getXform();
    simpleXf.setSize(sX,sY);
    simpleXf.setPosition(posX,posY);

    var o = new GameObject(g);
    var r = new RigidRectangle(xf,sX,sY);
    o.setRigidBody(r);

    r.setMass(0);

    //this.mAllObjs.addToSet(o);
    this.mAllPlatform.addToSet(o);
    this.mAllTerrainSimple.push(simplePipe);

    return o;
};

GameScene.prototype.checkWinLose = function(){
    // Win conditions
    var canWarp = false;
    if(this.mKelvin.getXform().getXPos() >= 503 && this.mKelvin.getXform().getXPos() <= 507){
        canWarp = true;
    }
    if ((gEngine.Input.isKeyClicked(gEngine.Input.keys.S) ||
            (gEngine.Input.isKeyClicked(gEngine.Input.keys.Down))) && canWarp) {
        //this.mKelvin.getXform().setPosition(95,5);
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
    if (hp <= 0 ) {
        this.LevelSelect = "Lose";
        gEngine.GameLoop.stop();
    }
};

GameScene.prototype.drawMain = function() {
    this.mCamera.setupViewProjection();
    this.mBg1.draw(this.mCamera);
    this.mBg2.draw(this.mCamera);
    this.mBg3.draw(this.mCamera);
    this.mBg4.draw(this.mCamera);
    this.mBg5.draw(this.mCamera);
    //this.mAllObjs.draw(this.mCamera);
    this.mKelvin.draw(this.mCamera);
    this.mAllPlatform.draw(this.mCamera);
    this.mAllNonPhysObj.draw(this.mCamera);
    this.mAllStoryPanels.draw(this.mCamera);
    if(this.mCodeBox !== null)
    {
        this.mCodeBox.draw(this.mCamera);
    }
    if(this.mPause)
    {
        this.mPauseBackground.draw(this.mCamera);
    }

    this.MainMenuButton.draw(this.mCamera);
    this.backButton.draw(this.mCamera);

    //this.mCodeBox.draw(this.mCamera);
    
    this.mMsg.draw(this.mCamera);
    this.mScore.draw(this.mCamera);
};


GameScene.prototype.drawMap = function() {
    
    this.mMinimapCam.setupViewProjection();

    //this.mSceneBG.draw(this.mMinimapCam);
    //this.mBG.draw(this.mMinimapCam);
    this.mKelvin.drawMini(this.mMinimapCam);
    this.mAllPlatform.drawMini(this.mMinimapCam);
    this.mAllStoryPanels.drawMini(this.mMinimapCam);
    this.mAllNonPhysObj.drawMini(this.mMinimapCam);
    var i;
    for (i = 0; i < this.mAllTerrainSimple.length; i++) {
        this.mAllTerrainSimple[i].draw(this.mMinimapCam);
    }
    if(this.mCodeBox !== null)
    {
        this.mCodeBox.drawMini(this.mMinimapCam);
    }
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
    // Check if kelvin falls below the level. If yes, deal some damage to him and
    // teleport him to the nearest spawnpoint he's to the right of (or the first
    // if he's jumped off the left side of the map
    var heroXf = this.mKelvin.getXform();
    if(heroXf.getYPos() < -6)
    {
        this.mKelvin.tookDamage(10);
        
        var heroXPos = heroXf.getXPos();
        var targetPoint = 0;
        var i;
        for(i = this.mSpawnPoints.length - 1; i >= 0; i--)
        {
            //alert(i + "  " + this.mSpawnPoints[i]);
            if(heroXPos > this.mSpawnPoints[i][0])
            {
                targetPoint = i;
                break;
            }
        }
        heroXf.setPosition(this.mSpawnPoints[targetPoint][0],
            this.mSpawnPoints[targetPoint][1]);
    }
    
    /*
    //check if kelvin falls. If yes, take damage and spawn at location 2sec b4
    //else, update the last spawn pos
    var t = Date.now();
    if(this.mKelvin.getXform().getYPos() < -5){
        this.mKelvin.tookDamage(10);
        // check if xPos is the same as fall xPos to avoid constant fall
        var pos = this.mKelvin.getXform().getXPos();
        if(this.mLastPos[0] === pos){
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
    */
    
};

//5 layerd parallax background
GameScene.prototype._makeBackground = function() {
    //added tint as projectiles were hard to see (red on red)
    var size = 150;
    var color = [1,1,1,0];
    var bgR1 = new TextureRenderable(this.kBg1);
    bgR1.getXform().setSize(size, 75);
    bgR1.getXform().setPosition(50, 36);
    bgR1.getXform().setZPos(-10);
    bgR1.setColor(color);
    this.mBg1 = new  ParallaxGameObject(bgR1, 15, this.mCamera);
    
    
    var bgR2 = new TextureRenderable(this.kBg2);
    bgR2.getXform().setSize(size, 75);
    bgR2.getXform().setPosition(50, 36);
    bgR2.getXform().setZPos(-9);
    bgR2.setColor(color);
    this.mBg2 = new ParallaxGameObject(bgR2, 9, this.mCamera);
    
    var bgR3 = new TextureRenderable(this.kBg3);
    bgR3.getXform().setSize(size, 75);
    bgR3.getXform().setPosition(50, 36);
    bgR3.getXform().setZPos(-1);
    bgR3.setColor(color);
    this.mBg3 = new ParallaxGameObject(bgR3, 5, this.mCamera);
    
    var bgR4 = new TextureRenderable(this.kBg4);
    bgR4.getXform().setSize(size, 75);
    bgR4.getXform().setPosition(50, 36);
    bgR4.getXform().setZPos(-1);
    bgR4.setColor(color);
    this.mBg4 = new ParallaxGameObject(bgR4, 4, this.mCamera);
    
    var bgR5 = new TextureRenderable(this.kBg5);
    bgR5.getXform().setSize(size, 75);
    bgR5.getXform().setPosition(50, 36);
    bgR5.getXform().setZPos(0);
    bgR5.setColor(color);
    this.mBg5 = new ParallaxGameObject(bgR5, 2, this.mCamera);
};



