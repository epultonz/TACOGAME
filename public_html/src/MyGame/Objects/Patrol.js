/* File: Patrol.js 
 *
 * Creates and initializes the Patrol
 * overrides the update funciton of GameObject to define
 * simple Dye behavior
 */

/*jslint node: true, vars: true, white: true */
/*global gEngine, GameObject, LightRenderable, IllumRenderable, SpriteAnimateRenderable, gScore */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

/**
 * The Patrol enemy goes back and forth between its left and right boundaries, damages
 * + knocks back the hero if it runs into him with its left or right sides, and dies if
 * the hero "stomps" on it by landing on top of it.
 * 
 * 
 * @param {float} spawnX The X coord to start the object at
 * @param {float} spawnY The Y coord to start the object at
 * @param {Hero} heroRef A reference to the Hero obj
 * @param {float} patrolDelta The speed at which the obj moves
 * @param {float} leftBound The X coord of the patrol's left boundary
 * @param {float} rightBound The X coord of the patrol's right boundary
 * @param {boolean} moveLeft Boolean stating if the patrol starts off going left (true) or right (false)
 * @returns {Patrol} The completed object, ready to be called via update() and draw()
 */
function Patrol(spawnX, spawnY, heroRef, patrolDelta = 0.225,
        leftBound = (spawnX - 10), rightBound = (spawnX + 10), moveLeft = true) {
    this.kWidth = 6;
    this.kHeight = 6;
    this.mHeroRef = heroRef;
    this.mRigdRect = null;
    
    // Vars for patrolling
    this.mPatrolDelta = patrolDelta;
    this.mPatrolLeftXBound = leftBound;
    this.mPatrolRightXBound = rightBound;
    this.mMoveLeft = moveLeft;
    this.mVelocity = 12.5;
    
    this.kGoomba = "assets/Taco/goomba.png";
    
    // sprite renderable 
    this.mPatrol = new SpriteAnimateRenderable(this.kGoomba);
    this.mPatrol.setColor([1, 1, 1, 0]);
    this.mPatrol.getXform().setPosition(spawnX, spawnY);
    this.mPatrol.getXform().setSize(this.kWidth, this.kHeight);
    this.mPatrol.setSpriteSequence(64,0,64,64,2,0);
    this.mPatrol.setAnimationSpeed(20);
    
    // simplified minimap renderable
    this.mMinimapObj = new Renderable();
    this.mMinimapObj.setColor([1, .2, .2, 1]);
    this.mMinimapObj.getXform().setPosition(spawnX, spawnY);
    this.mMinimapObj.getXform().setSize(this.kWidth, this.kHeight);
    
    GameObject.call(this, this.mPatrol); // Finish construction via GameObject constructor
    
    // Physics variables for knocking the hero back
    this.mRigdRect = new RigidRectangle(this.mPatrol.getXform(), this.kWidth , this.kHeight);
    this.mRigdRect.setMass(0);
    this.mRigdRect.setVelocity(-this.mVelocity, 0);
    this.setRigidBody(this.mRigdRect);
    //this.toggleDrawRigidShape();
    
    /*
    var vx = (Math.random() - 0.5);
    var vy = (Math.random() - 0.5);
    var speed = 20 + Math.random() * 10;
    r.setVelocity(vx * speed, vy * speed);
    this.setRigidBody(r);
    this.toggleDrawRenderable();
    this.toggleDrawRigidShape();
    */
    
}
gEngine.Core.inheritPrototype(Patrol, GameObject);

Patrol.prototype.update = function () {
    var xForm = this.mPatrol.getXform();
    var currPos = xForm.getPosition();
    
    if(this.mMoveLeft) // If we're moving left
    {
        xForm.setPosition(currPos[0] - this.mPatrolDelta, currPos[1]);
        if(currPos[0] <= this.mPatrolLeftXBound)
        {
            this.mRigdRect.setVelocity(this.mVelocity, 0);
            this.mMoveLeft = false;
        }
    }
    else // Otherwise, we're moving right
    {
        xForm.setPosition(currPos[0] + this.mPatrolDelta, currPos[1]);
        if(currPos[0] >= this.mPatrolRightXBound)
        {
            this.mRigdRect.setVelocity(-this.mVelocity, 0);
            this.mMoveLeft = true;
        }
    }
    this.mPatrol.updateAnimation();
    
    // Update the game object after moving
    GameObject.prototype.update.call(this);
    
    // Test for collision with hero
    /*
    eCollideLeft: 1,
    eCollideRight: 2,
    eCollideTop: 4,
    eCollideBottom: 8,
    eInside : 16,
    eOutside: 0
    */
    var thisBox = this.getBBox();
    var heroBox = this.mHeroRef.getBBox();
    var collideStatus = thisBox.boundCollideStatus(heroBox);
    
    // Only do collision detection if the hero isn't in hitstun/damageboost
    if(!this.mHeroRef.isHurt() && (collideStatus !== 0))
    {        
        // Determine if its a top hit primarily or a left hit primarily
        // by checking if the hero's bot bound is within the top 10% of the top of the patrol
        // i.e. its top 10% Y range -- same for left/right bound and left/right 10% X range
        // In case of tie, go for tophit
        
        // Check top hit first
        var heroYVelocity = this.mHeroRef.getRigidBody().getVelocity()[1];
        if(heroYVelocity < 0 && 
                (heroBox.minY() > (thisBox.maxY() - (this.kHeight / 10))))
        {
            gScore += 30;
            return false; // as the object should be deleted
        }
        
        // Check side hits- else is there to break ties between top and left+right
        else if ( (heroBox.maxX() < (thisBox.minX() + (this.kWidth / 10))) || 
                  (heroBox.minX() > (thisBox.maxX() - (this.kWidth / 10)))   )
        {
            this.mHeroRef.tookDamage(12.5);
        }
    }

    // Move the minimap object to the patrol's position
    var patrolPos = this.getXform().getPosition();
    this.mMinimapObj.getXform().setPosition(patrolPos[0], patrolPos[1]);

    // return true if the object isn't defeated
    return true;
};

Patrol.prototype.draw = function (aCamera) {
    GameObject.prototype.draw.call(this, aCamera);
};

Patrol.prototype.drawMini = function (aCamera) {
    this.mMinimapObj.draw(aCamera);
};