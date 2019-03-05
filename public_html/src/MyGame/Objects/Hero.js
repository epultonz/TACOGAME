/* File: Hero.js
 *
 * Creates and initializes the Hero
 * overrides the update funciton of GameObject to define
 * simple Dye behavior
 */

/*jslint node: true, vars: true, white: true */
/*global gEngine, GameObject, LightRenderable, IllumRenderable, SpriteAnimateRenderable, vec2 */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function Hero(spriteTexture, atX, atY, lgtSet) {
    this.kDelta = 0.25;
    this.kWidth = 6;
    this.kHeight = 6;
    
    // light renderable
    this.mKelvin = new LightRenderable(spriteTexture);

    this.mKelvin.setColor([1, 1, 1, 0]);
    this.mKelvin.getXform().setPosition(atX, atY);
    //this.mKelvin.getXform().setZPos(1);
    this.mKelvin.getXform().setSize(this.kWidth, this.kHeight);

    this.mHeroState = Hero.eHeroState.eRunRight;
    this.mPreviousHeroState = Hero.eHeroState.eRunLeft;
    
    this.mIsMoving = false;
    this.mCanJump = false;

    this.mKelvin.setSpriteSequence(512,0,128,256,8,0);
    this.mKelvin.setAnimationType(SpriteAnimateRenderable.eAnimationType.eAnimateRight);
    this.mKelvin.setAnimationSpeed(8);         // show each element for mAnimSpeed updates

    //this.mKelvin.addLight(lgtSet.getLightAt(2)); //jeb fix
    //this.mKelvin.addLight(lgtSet.getLightAt(3));
    //this.mKelvin.addLight(lgtSet.getLightAt(2);
    
    this.mMinimapObj = new Renderable();
    this.mMinimapObj.setColor([.2, 1, .2, 0]);
    this.mMinimapObj.getXform().setPosition(atX, atY);
    this.mMinimapObj.getXform().setSize(this.kWidth, this.kHeight);

    GameObject.call(this, this.mKelvin);

    var r = new RigidRectangle(this.getXform(), this.kWidth/1.2 , this.kHeight/1.1 );
    this.setRigidBody(r);
    r.setMass(40);     // high mass so wont get affected by other object much
    r.setRestitution(-0.1); // higher means more bouncy
    r.setFriction(1);   //how much it slides with other object
    r.setInertia(0);    
    
    this.mRbox = r;

    //this.toggleDrawRenderable();
    //this.toggleDrawRigidShape(); // Less noticable that hero is tilting if this is off

    this.kHealthBar = "assets/UI/healthbar.png";
    this.UIHealth = new UIHealthBar(this.kHealthBar,[110,446],[200,25],0);
    
    //Light settings
    this.mLight = new Light();
    this.mKelvin.addLight(this.mLight);
    this.mLight.set2DPosition(this.mKelvin.getXform().getPosition());
    this.mLight.setLightTo(false);
    
    //super saiyan settings
    this.mIsSuper = false;
    
    //shake paramaters
    this.xDelta = .7;
    this.yDelta = .25;
    this.freq = 1;
    this.duration = 30;
    this.mShakeStarted = false;
    this.mShake = null;
    
    //interpolation pet follower
    this.kPet = "assets/UI/healthbar.png"; //using this as pet for now
    this.mPet = new SpriteRenderable(this.kPet);
    this.mPet.setColor([1, 1, 1, 0]);
    this.mPet.getXform().setPosition(atX, atY);
    this.mPet.getXform().setSize(1, 1);
    this.mPet.setElementPixelPositions(0, 32, 0, 32); //left right top bottom
    this.mInterpolatePet = new InterpolateVec2(
            this.mPet.getXform().getPosition(), 120, 0.05);
    
    //deflection
    this.mDeflecting = false;

}
gEngine.Core.inheritPrototype(Hero, GameObject);

Hero.eHeroState = Object.freeze({
    eFaceRight: 0,
    eFaceLeft: 1,
    eRunRight: 2,
    eRunLeft: 3,
    eJumpRight: 4,
    eJumpLeft: 5
});

Hero.prototype.update = function () {
    GameObject.prototype.update.call(this);

    // control by WASD
    var xform = this.getXform();
    this.mIsMoving = false;
    var v = this.getRigidBody().getVelocity();

    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.A)) {
        //if (this.mCanJump === true) {
            this.mPreviousHeroState = this.mHeroState;
            this.mHeroState = Hero.eHeroState.eRunLeft;
            this.mIsMoving = true;
        //}
        //make less movement in air
        if(!this.mCanJump){
            v[0] = -10; // i dont think it works :'(
        } else {
            v[0] = -20;
        }

        this.mKelvin.updateAnimation();
    }
    else if (gEngine.Input.isKeyPressed(gEngine.Input.keys.D)) {
        //if (this.mCanJump === true) {
            this.mPreviousHeroState = this.mHeroState;
            this.mHeroState = Hero.eHeroState.eRunRight;
            this.mIsMoving = true;
        //}
        //make less movement in air
        if(!this.mCanJump){
            v[0] = 10;
        } else {
            v[0] = 20;
        }
        this.mKelvin.updateAnimation();
    } else {
        v[0] = 0;
    }
    
    if (this.mCanJump === true) {
        if (this.mIsMoving === false) {
            /*
            this.mPreviousHeroState = this.mHeroState;
            if (this.mHeroState === Hero.eHeroState.eRunRight || this.mHeroState === Hero.eHeroState.eJumpRight)
                this.mHeroState = Hero.eHeroState.eFaceRight;
            if (this.mHeroState === Hero.eHeroState.eRunLeft || this.mHeroState === Hero.eHeroState.eJumpLeft)
                this.mHeroState = Hero.eHeroState.eFaceLeft;
            */
        }
        if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Space)) {
            v[1] = 27.5; // Jump velocity
            /*
            this.mPreviousHeroState = this.mHeroState;
            if (this.mHeroState === Hero.eHeroState.eRunRight
                    || this.mHeroState === Hero.eHeroState.eFaceRight)
                this.mHeroState = Hero.eHeroState.eJumpRight;
            if (this.mHeroState === Hero.eHeroState.eRunLeft
                    || this.mHeroState === Hero.eHeroState.eFaceLeft)
                this.mHeroState = Hero.eHeroState.eJumpLeft;
            */
            this.mIsMoving = true;
        }
    } else {
        if (gEngine.Input.isKeyPressed(gEngine.Input.keys.S)) {
            v[1] = -50;
            this.mIsMoving = true;
        }
        
    }
    
    // toggle super saiyan mode!!!!!! UWOOOOHHHHHHHHHHHHH
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.E)) {
        if(!this.mIsSuper){
            this.mLight.setLightTo(true);
            this.mIsSuper = true;
        }else{
            this.mLight.setLightTo(false);
            this.mIsSuper = false;
        }
    }
    if(this.mIsSuper){this.goSuper();}

    if(this.mShakeStarted) {
        var c = this.mKelvin.getColor();
        
        if(this.mShake.shakeDone()){
            this.mShake = null;
            this.mShakeStarted = false;
            this.getXform().setSize(this.kWidth,this.kHeight);
            
            c[3] = 0; //restore color back to normal
            this.mKelvin.setColor([1,1,1,0]);
        } else {
            var size = this.getXform().getSize();

            this.mShake.setRefCenter(size);
            this.mShake.updateShakeState();
            var newPos = this.mShake.getCenter();
            this.getXform().setSize(newPos[0],newPos[1]);
            
            // continuosly change color tint for effect
            //c = [1,0,0,0.2];
            this.mKelvin.setColor([1,0,0,0.4]);
            var ca = c[3] + 0.05;
            if (ca > 1) {
                ca = 0;
            }
            c[3] = ca;
        }
    }
    
    this.mDeflecting = gEngine.Input.isKeyClicked(gEngine.Input.keys.I);
    
    
    this.mLight.set2DPosition(xform.getPosition());
    this.changeAnimation();
    this.UIHealth.update();

    //stop kevin from rotating
    //this.getRbox().setAngularVelocity(0);
    this.mIsMoving = false;
    this.mCanJump = false;

    // Move the minimap object to the hero's position
    var kelvPos = xform.getPosition();
    this.mMinimapObj.getXform().setPosition(kelvPos[0], kelvPos[1]);
    
    this._updateInterp();
    this.mPet.update();
};

Hero.prototype._updateInterp = function(){
    var heroPos = this.getXform().getPosition();

    
    var xComp1 = (heroPos[0] - 2); //distance from hero
    var yComp1 = (heroPos[1] + 4); //distnance form hero in the y

    var heroFollowVector = vec2.fromValues(xComp1, yComp1);
    
   
    this.mInterpolatePet.setFinalValue(heroFollowVector);
    this.mInterpolatePet.updateInterpolation();
};

Hero.prototype.changeAnimation = function () {
    if (this.mHeroState !== this.mPreviousHeroState) {
        switch (this.mHeroState) {
            /*
            case Hero.eHeroState.eFaceLeft:
                this.mKelvin.setSpriteSequence(1508, 0, 140, 180, 3, 0);
                this.mKelvin.getXform().setSize(-this.kWidth, this.kHeight);
                this.mKelvin.setAnimationSpeed(20);
                break;
            case Hero.eHeroState.eFaceRight:
                this.mKelvin.setSpriteSequence(1508, 0, 140, 180, 3, 0);
                this.mKelvin.getXform().setSize(this.kWidth, this.kHeight);
                this.mKelvin.setAnimationSpeed(20);
                break;
            */
            case Hero.eHeroState.eRunLeft:
                this.mKelvin.setSpriteSequence(256,0,128,256,8,0);
                this.mKelvin.getXform().setSize(this.kWidth, this.kHeight);
                this.mKelvin.setAnimationSpeed(8);
                break;
            case Hero.eHeroState.eRunRight:
                this.mKelvin.setSpriteSequence(512,0,128,256,8,0);
                this.mKelvin.getXform().setSize(this.kWidth, this.kHeight);
                this.mKelvin.setAnimationSpeed(8);
                break;
            /*    
            case Hero.eHeroState.eJumpLeft:
                this.mKelvin.setSpriteSequence(2048, 0, 140, 180, 10, 0);
                this.mKelvin.getXform().setSize(-this.kWidth, this.kHeight);
                this.mKelvin.setAnimationSpeed(4);
                break;
            case Hero.eHeroState.eJumpRight:
                this.mKelvin.setSpriteSequence(2048, 0, 140, 180, 10, 0);
                this.mKelvin.getXform().setSize(this.kWidth, this.kHeight);
                this.mKelvin.setAnimationSpeed(4);
                break;
            */
        }
    }
};


Hero.prototype.draw = function (aCamera) {
    this.mPet.draw(aCamera);
    this.UIHealth.draw(aCamera);
    GameObject.prototype.draw.call(this, aCamera);
};

Hero.prototype.drawMini = function (aCamera) {
    this.mMinimapObj.draw(aCamera);
};

Hero.prototype.canJump = function (b) {
    this.mCanJump = b;
};

Hero.prototype.isDeflecting = function() {
    return this.mDeflecting;
};

Hero.prototype.getRbox = function() {
    return this.mRbox;
};

Hero.prototype.isHurt = function() {
    return this.mShakeStarted;
};

//decrement UIhealth bar and shake mKelvin
Hero.prototype.tookDamage = function (damage) {
    // Only get hit if he hasn't been recently and not in Super mode
    if(this.mShakeStarted === false && !this.mIsSuper) 
    {
        this.UIHealth.incCurrentHP(-damage);
        var size = this.getXform().getSize();

        this.mShake = new ObjectShake(size,this.xDelta,
                this.yDelta,this.freq,this.duration);

        this.mShakeStarted = true;
    }  
};

// increment the hero's HP by some amount. Sets to max if it would go over it
Hero.prototype.incHP = function (hpAmt) {
    if((this.UIHealth.getCurrentHP() + hpAmt) >= this.UIHealth.getMaxHP())
        this.UIHealth.setCurrentHP(this.UIHealth.getMaxHP());
    else
        this.UIHealth.incCurrentHP(hpAmt); 
};

Hero.prototype.getHP = function () {
    return this.UIHealth.getCurrentHP();
};

Hero.prototype.isAtFullHP = function () {
    return (this.UIHealth.getCurrentHP() === this.UIHealth.getMaxHP());
};

Hero.prototype.goSuper = function(){
    var s = this.mLight.getIntensity();
    var a = 0.1;
    if (s >= 5) {
        s = 0;
    }
    this.mLight.setIntensity(s+a);
};