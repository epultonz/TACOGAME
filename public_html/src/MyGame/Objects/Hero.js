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

function Hero(spriteTexture, atX, atY, camRef = null, lgtSet) {
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
    this.mCamRef = camRef;

    this.mKelvin.setSpriteSequence(512,0,128,256,8,0);
    this.mKelvin.setAnimationType(SpriteAnimateRenderable.eAnimationType.eAnimateRight);
    this.mKelvin.setAnimationSpeed(8);         // show each element for mAnimSpeed updates

    //this.mKelvin.addLight(lgtSet.getLightAt(2)); //jeb fix
    //this.mKelvin.addLight(lgtSet.getLightAt(3));
    //this.mKelvin.addLight(lgtSet.getLightAt(2);
    
    this.mMinimapObj = new Renderable();
    this.mMinimapObj.setColor([.2, 1, .2, 1]);
    this.mMinimapObj.getXform().setPosition(atX, atY);
    this.mMinimapObj.getXform().setSize(this.kWidth*1.15, this.kHeight*1.15);

    GameObject.call(this, this.mKelvin);

    var r = new RigidRectangle(this.getXform(), this.kWidth/1.2 , this.kHeight/1.1 );
    this.setRigidBody(r);
    r.setMass(40);     // high mass so wont get affected by other object much
    r.setRestitution(-0.1); // higher means more bouncy
    r.setFriction(0);   //how much it slides with other object
    r.setInertia(0);    
    
    this.mRbox = r;

    //this.toggleDrawRenderable();
    //this.toggleDrawRigidShape(); // Less noticable that hero is tilting if this is off

    this.kHealthBar = "assets/UI/lives.png";
    this.UIHealth = new UIHealthBar(this.kHealthBar,[13,50]);
    
    //Light settings
    this.mLight = new Light();
    this.mKelvin.addLight(this.mLight);
    this.mLight.set2DPosition(this.mKelvin.getXform().getPosition());
    this.mLight.setLightTo(false);
    
    // powerup settings
    this.mIsSuper = false;
    this.mCanDeflect = false;
    /*
     * Set this.mCanDeflect to true if hero should be able to deflect from the start
     */
    
    //shake paramaters
    this.xDelta = .7;
    this.yDelta = .25;
    this.freq = 1;
    this.duration = 45;
    this.mShakeStarted = false;
    this.mShake = null;
    
    //interpolation pet follower
    this.kPet = "assets/UI/lives.png"; //using this as pet for now
    this.mPet = new SpriteRenderable(this.kPet);
    this.mPet.setColor([1, 1, 1, 0]);
    this.mPet.getXform().setPosition(atX, atY);
    this.mPet.getXform().setSize(1, 1);
    this.mPet.setElementPixelPositions(0, 32, 0, 32); //left right top bottom
    this.mInterpolatePet = new InterpolateVec2(
            this.mPet.getXform().getPosition(), 120, 0.05);
    this.mHeroFollowVector = null;
    this.mPetDeflected = true;
    //deflection
    this.mDeflecting = false;
    this.mConfirmedDeflect = false;
    this.mLastDeflectTime = 0;    //time of the last time deflect was used
    this.mDeflectCD = 500;         //cooldown time for deflect
    this.mIsDeflectDown = true;     //is deflect currently cooling down
    this.mParticles = new ParticleGameObjectSet();

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

Hero.prototype.addEmitterToPet = function() {    
    // create an emitter to start emitting particles
    if (this.mCanDeflect) {
        this.mParticles.addEmitterAt(
            this.mPet.getXform().getPosition(), 200, [0,1,0,0],
            this.createParticle);
    } else {
        this.mParticles.addEmitterAt(
            this.mPet.getXform().getPosition(), 200, [1,0,0,0],
            this.createParticle);
    }
    
};


Hero.prototype.update = function () {
    GameObject.prototype.update.call(this);
    if (this.mParticles.size() < 190) {
        this.addEmitterToPet();
    }
    this.mParticles.update();
    // control by WASD
    var xform = this.getXform();
    var kelvPos = xform.getPosition();
    this.mIsMoving = false;
    var v = this.getRigidBody().getVelocity();

    if ((gEngine.Input.isKeyPressed(gEngine.Input.keys.A)) || 
            (gEngine.Input.isKeyPressed(gEngine.Input.keys.Left))){
        this.mPreviousHeroState = this.mHeroState;
        this.mHeroState = Hero.eHeroState.eRunLeft;
        this.mIsMoving = true;
        v[0] = -20;
        this.mKelvin.updateAnimation();
    }
    else if ((gEngine.Input.isKeyPressed(gEngine.Input.keys.D)) || 
            (gEngine.Input.isKeyPressed(gEngine.Input.keys.Right))){
        this.mPreviousHeroState = this.mHeroState;
        this.mHeroState = Hero.eHeroState.eRunRight;
        this.mIsMoving = true;
        v[0] = 20;
        this.mKelvin.updateAnimation();
    } else {
        v[0] = 0;
        
    }
    
    //Testing Purposes Only
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Q)) {
    if (gEngine.Input.isButtonClicked(gEngine.Input.mouseButton.Left))
    {
        var mouseX = this.mCamRef.mouseWCX();
        var mouseY = this.mCamRef.mouseWCY();
        xform.setPosition(mouseX, mouseY);
    }
    }
    
    if (this.mCanJump === true) {
        //if (this.mIsMoving === false) {
            /*
            this.mPreviousHeroState = this.mHeroState;
            if (this.mHeroState === Hero.eHeroState.eRunRight || this.mHeroState === Hero.eHeroState.eJumpRight)
                this.mHeroState = Hero.eHeroState.eFaceRight;
            if (this.mHeroState === Hero.eHeroState.eRunLeft || this.mHeroState === Hero.eHeroState.eJumpLeft)
                this.mHeroState = Hero.eHeroState.eFaceLeft;
            */
        //}
        if ((gEngine.Input.isKeyClicked(gEngine.Input.keys.Space)) || 
                (gEngine.Input.isKeyPressed(gEngine.Input.keys.Up)) || 
                (gEngine.Input.isKeyPressed(gEngine.Input.keys.W))) {
            v[1] = 60; // Jump velocity
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
        if ((gEngine.Input.isKeyPressed(gEngine.Input.keys.S)) || 
                (gEngine.Input.isKeyPressed(gEngine.Input.keys.Down))){
            v[1] = -75;
            this.mIsMoving = true;
        }
        
    }
    
    /*
    // toggle super saiyan mode!!!!!! UWOOOOHHHHHHHHHHHHH
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.E)) {
        if(!this.mIsSuper){
            this.mLight.setLightTo(true);
            this.mIsSuper = true;
        }else{
            this.mLight.setLightTo(false);
            this.mIsSuper = false;
        }
    */
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
    
    
    //----------Pet Interpolation and deflection code-------------------
    //lots of dupliacted and messy code will create methods soon
    
    //if currently has deflect power and deflect currently on cooldown
    
    
    
    
    this._updatePetAndReflect();
    
    this.mLight.set2DPosition(xform.getPosition());
    this.changeAnimation();
    this.UIHealth.update();

    //stop kevin from rotating
    //this.getRbox().setAngularVelocity(0);
    this.mIsMoving = false;
    this.mCanJump = false;

    // Move the minimap object to the hero's position
    
    this.mMinimapObj.getXform().setPosition(kelvPos[0], kelvPos[1]);
    
    
    this.mPet.update();
};

Hero.prototype._updateInterp = function(){
    this.mInterpolatePet.setFinalValue(this.mHeroFollowVector);
    this.mInterpolatePet.updateInterpolation();
};

Hero.prototype.setPetFollowVect = function(newVect) {
    this.mHeroFollowVector = newVect;
};

Hero.prototype.wasDeflected = function() {
    this.mConfirmedDeflect = true;
};

Hero.prototype.getCanDeflect = function() {
    return this.mCanDeflect;
};

Hero.prototype.setCanDeflect = function(bool) {
    this.mCanDeflect = bool;
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
    //this.mPet.draw(aCamera);
    this.UIHealth.draw(aCamera);
    if (this.mParticles !== null) {
        this.mParticles.draw(aCamera);
    }
    this.mKelvin.draw(aCamera);
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

Hero.prototype.getHP = function () {
    return this.UIHealth.getCurrentHP();
};

Hero.prototype.incHP = function (i) {
    this.UIHealth.incCurrentHP(i);
};

Hero.prototype.getSuper = function()
{
    return this.mIsSuper;
};

Hero.prototype.goSuper = function(){
    var s = this.mLight.getIntensity();
    var a = 0.05;
    if (s >= 2) {
        s = 0.2;
    }
    this.mLight.setIntensity(s+a);
};

Hero.prototype.activateSuper = function(){
    if(!this.mIsSuper){
        this.mLight.setLightTo(true);
        this.mIsSuper = true;
        
        var s = this.mLight.getIntensity();
        var a = 0.05;
        if (s >= 2) {
            s = 0.2;
            }
        this.mLight.setIntensity(s+a);
        
    }else{
        this.mLight.setLightTo(false);
        this.mIsSuper = false;
    }
};

Hero.prototype.createParticle = function(atX, atY, color) {
    var life = 10 + (Math.random() * (20-10));
    var p = new ParticleGameObject("assets/Taco/particle.png", atX, atY, life);
    p.getRenderable().setColor(color);
        
    // size of the particle
    var r = .5 + (Math.random() * (1.5-.5));   //(Math.random * (max-min)) + min
    p.getXform().setSize(r, r);
    
    // final color
    var fr = color[0];
    var fg = color[1];
    var fb = color[2];
    p.setFinalColor([fr, fg, fb, 0.1]);
    
    // velocity on the particle
    var fx = -4 + (Math.random() * (8));
    var fy = -4 + (Math.random() * (8));
    p.getParticle().setVelocity([fx, fy]);
    p.getParticle().setAcceleration([fx,fy]);
    p.getParticle().setDrag(.8);

    // size delta
    p.setSizeDelta(0.9);
    
    return p;
};

Hero.prototype.getSuperLight = function() {
    return this.mLight;
};

Hero.prototype._updatePetAndReflect = function() {
    if(this.mCanDeflect && !this.mDeflecting){
 
        // only check I input if not currently deflecting and deflect power on
        if ((gEngine.Input.isKeyClicked(gEngine.Input.keys.I)) || 
                (gEngine.Input.isKeyPressed(gEngine.Input.keys.NumpadZero)) ||
                (gEngine.Input.isKeyPressed(gEngine.Input.keys.Control)) ||
                (gEngine.Input.isKeyPressed(gEngine.Input.keys.Q)) ||
                (gEngine.Input.isKeyPressed(gEngine.Input.keys.E)) ||
                (gEngine.Input.isKeyPressed(gEngine.Input.keys.R))) {
            //check if cooldown done, if so start reflect
            if(this.mIsDeflectDown
                && (Date.now() - this.mLastDeflectTime >= this.mDeflectCD)) 
            {    
                //has the pet made contact?
                this.mPetDeflected = false;
                //deflect initiated
                this.mDeflecting = true;
                //cooldown off
                this.mIsDeflectDown = false; //turn off cooldown if cooldowned
            }

        }   
    }
    
    //if deflect succesful move pet to projectile
    if(this.mCanDeflect && !this.mIsDeflectDown && !this.mPetDeflected 
            && this.mConfirmedDeflect) {
        this.mInterpolatePet.configInterpolation(.5, 120);
        
        this._updateInterp();
        
        if(Math.abs(this.mHeroFollowVector[0] -
                this.mInterpolatePet.getValue()[0]) < 0.2) {
            this.mPetDeflected = true;
            this.mLastDeflectTime = Date.now();
            this.mIsDeflectDown = true;
            this.mConfirmedDeflect = false;   //projectile sets this to true when in reflect Bbox
        }
    //if the deflect missed then move pet to defualt blocking position (front of kelvin)
    } else if (this.mCanDeflect && !this.mIsDeflectDown && !this.mPetDeflected) {
        var heroPos = this.getXform().getPosition();

    
        var xComp1 = (heroPos[0] + 4); //distance from hero
        var yComp1 = (heroPos[1] + 2); //distnance form hero in the y
 
        this.mHeroFollowVector = vec2.fromValues(xComp1, yComp1);
        this.mInterpolatePet.configInterpolation(.5, 120);
        this._updateInterp();
        
        if(Math.abs(this.mHeroFollowVector[0] -
                this.mInterpolatePet.getValue()[0]) < 0.5) {
            this.mLastDeflectTime = Date.now();
            this.mPetDeflected = true;
            this.mIsDeflectDown = true;
        }
    //if the pet has finished deflect move back to side of kelvin
    } else {
        this.mDeflecting = false;   //no longer deflecting
        var heroPos = this.getXform().getPosition();

        var xComp1 = (heroPos[0] - 2); //distance from hero
        var yComp1 = (heroPos[1] + 4); //distnance form hero in the y
 
        this.mHeroFollowVector = vec2.fromValues(xComp1, yComp1);
        this.mInterpolatePet.configInterpolation(.1, 120);
        this._updateInterp();

    }
    //-------------------end of pet code-------------------
}