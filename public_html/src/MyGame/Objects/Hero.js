/* File: Hero.js 
 *
 * Creates and initializes the Hero
 * overrides the update funciton of GameObject to define
 * simple Dye behavior
 */

/*jslint node: true, vars: true, white: true */
/*global gEngine, GameObject, LightRenderable, IllumRenderable */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

/*
function Hero(spriteTexture) {
    this.kDelta = 0.3;

    this.mKelvin = new SpriteAnimateRenderable(spriteTexture);
    this.mKelvin.setSpriteSequence(128,0,128,128,8,0);
    GameObject.call(this, this.mKelvin);
    
    var r = new RigidRectangle(this.getXform(), 5, 7);
    this.setRigidBody(r);
    r.setVelocity(5,5);
    //this.toggleDrawRenderable();
    this.toggleDrawRigidShape();
}
gEngine.Core.inheritPrototype(Hero, WASDObj);

Hero.prototype.update = function () {
    
    
    GameObject.prototype.update.call(this);
    this.mKelvin.updateAnimation();
};
*/

function Hero(spriteTexture, atX, atY, lgtSet) {
    this.kDelta = 0.1;
    this.kWidth = 20;
    this.kHeight = 20;
    
    this.mKelvin = new LightRenderable(spriteTexture);
    
    this.mKelvin.setColor([1, 1, 1, 0]);
    this.mKelvin.getXform().setPosition(atX, atY);
    this.mKelvin.getXform().setZPos(1);
    this.mKelvin.getXform().setSize(this.kWidth, this.kHeight);

    //this.mHeroState = Hero.eHeroState.eRunRight;
    //this.mPreviousHeroState = Hero.eHeroState.eRunLeft;
    this.mIsMoving = false;
    this.mCanJump = false;

    this.mKelvin.setSpriteSequence(128,0,128,128,8,0);
    this.mKelvin.setAnimationType(SpriteAnimateRenderable.eAnimationType.eAnimateRight);
    this.mKelvin.setAnimationSpeed(12);         // show each element for mAnimSpeed updates                               
    
    //this.mKelvin.addLight(lgtSet.getLightAt(2)); //jeb fix
    //this.mKelvin.addLight(lgtSet.getLightAt(3));
    //this.mKelvin.addLight(lgtSet.getLightAt(2));

    GameObject.call(this, this.mKelvin);

    var r = new RigidRectangle(this.getXform(), this.kWidth / 1.9, this.kHeight / 1.1);
    this.setRigidBody(r);
    r.setMass(0.1);
    r.setRestitution(0.3);
    r.setInertia(0);
    r.setFriction(0.7);
    
    this.toggleDrawRenderable();
    this.toggleDrawRigidShape();

}
gEngine.Core.inheritPrototype(Hero, GameObject);

/*
Hero.eHeroState = Object.freeze({
    eFaceRight: 0,
    eFaceLeft: 1,
    eRunRight: 2,
    eRunLeft: 3,
    eJumpRight: 4,
    eJumpLeft: 5
});
*/

Hero.prototype.update = function () {
    GameObject.prototype.update.call(this);


    // control by WASD
    var xform = this.getXform();
    this.mIsMoving = false;
    var v = this.getRigidBody().getVelocity();

    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.A)) {
        if (this.mCanJump === true) {
            //this.mPreviousHeroState = this.mHeroState;
            //this.mHeroState = Hero.eHeroState.eRunLeft;
            this.mIsMoving = true;
        }

        xform.incXPosBy(-this.kDelta);
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.D)) {
        if (this.mCanJump === true) {
            //this.mPreviousHeroState = this.mHeroState;
            //this.mHeroState = Hero.eHeroState.eRunRight;
            this.mIsMoving = true;
        }

        xform.incXPosBy(this.kDelta);
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
            v[1] = 35; // Jump velocity
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
    }

    //this.changeAnimation();
    this.mKelvin.updateAnimation();
    this.mIsMoving = false;
    this.mCanJump = false;
    
};

/*
Hero.prototype.changeAnimation = function () {
    if (this.mHeroState !== this.mPreviousHeroState) {
        switch (this.mHeroState) {
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
            case Hero.eHeroState.eRunLeft:
                this.mKelvin.setSpriteSequence(1688, 0, 140, 180, 6, 0);
                this.mKelvin.getXform().setSize(-this.kWidth, this.kHeight);
                this.mKelvin.setAnimationSpeed(5);
                break;
            case Hero.eHeroState.eRunRight:
                this.mKelvin.setSpriteSequence(1688, 0, 140, 180, 6, 0);
                this.mKelvin.getXform().setSize(this.kWidth, this.kHeight);
                this.mKelvin.setAnimationSpeed(5);
                break;
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
        }
    }
};

*/

Hero.prototype.draw = function (aCamera) {
    GameObject.prototype.draw.call(this, aCamera);
};

Hero.prototype.canJump = function (b) {
    this.mCanJump = b;
};

