/* File: Patrol.js 
 *
 * Creates and initializes the Patrol
 * overrides the update funciton of GameObject to define
 * simple Dye behavior
 */

/*jslint node: true, vars: true, white: true */
/*global gEngine, GameObject, LightRenderable, IllumRenderable, SpriteAnimateRenderable */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function Patrol(spriteTexture, atX, atY, heroRef) {
    this.kWidth = 6;
    this.kHeight = 6;
    this.mHeroRef = heroRef;
    this.mRigdRect = null;
    
    // Vars for patrolling
    this.mPatrolDelta = 0.2;
    this.mPatrolLeftPoint = atX - 15;
    this.mPatrolRightPoint = atX + 6;
    this.mMoveLeft = true;
    this.mVelocity = 12.5;
    
    // sprite renderable 
    this.mPatrol = new SpriteRenderable(spriteTexture);
    this.mPatrol.setColor([1, 1, 1, 0]);
    this.mPatrol.getXform().setPosition(atX, atY);
    this.mPatrol.getXform().setSize(this.kWidth, this.kHeight);
    this.mPatrol.setElementPixelPositions(130,130+180,0,0+180);
    
    this.mMinimapObj = new Renderable();
    this.mMinimapObj.setColor([1, .2, .2, 0]);
    this.mMinimapObj.getXform().setPosition(atX, atY);
    this.mMinimapObj.getXform().setSize(this.kWidth, this.kHeight);
    
    GameObject.call(this, this.mPatrol); // Finish construction via GameObject constructor
    
    this.mRigdRect = new RigidRectangle(this.mPatrol.getXform(), this.kWidth , this.kHeight);
    this.mRigdRect.setMass(0);
    this.mRigdRect.setVelocity(-this.mVelocity, 0);
    this.setRigidBody(this.mRigdRect);
    this.toggleDrawRigidShape();
    
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
    
    //alert("Left?" + this.mMoveLeft + " Limits:" + this.mPatrolLeftPoint + "_" +
    //        this.mPatrolRightPoint + " Cur:" + currPos[0]);
    
    if(this.mMoveLeft) // If we're moving left
    {
        xForm.setPosition(currPos[0] - this.mPatrolDelta, currPos[1]);
        if(currPos[0] <= this.mPatrolLeftPoint)
        {
            this.mRigdRect.setVelocity(this.mVelocity, 0);
            this.mMoveLeft = false;
        }
    }
    else // Otherwise, we're moving right
    {
        xForm.setPosition(currPos[0] + this.mPatrolDelta, currPos[1]);
        if(currPos[0] >= this.mPatrolRightPoint)
        {
            this.mRigdRect.setVelocity(-this.mVelocity, 0);
            this.mMoveLeft = true;
        }
    }
    
    // Update the game object after moving
    GameObject.prototype.update.call(this);
    
    // Test for collision with hero
    /*
     * eCollideLeft: 1,
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
        /*
        alert("collideStatus: " + collideStatus);
        if(((collideStatus & 1) === 1) || 
                ((collideStatus & 2) === 2))
        {
            alert("sidehit");
        }*/
        
        // Determine if its a top hit primarily or a left hit primarily
        // by checking if the hero's bot bound is within the top 10% of the top of the patrol
        // i.e. its top 10% Y range -- same for left/right bound and left/right 10% X range
        // In case of tie, go for tophit
        
       // alert("UpDown stuff- HminY:" + heroBox.minY + " -BoxMaxY:" + thisBox.maxY)
        
        // Check top hit first
        if(heroBox.minY() > (thisBox.maxY() - (this.kHeight / 10)))
        {
            return false; // as the object should be deleted
        }
        
        // Check side hits- else is there to break ties between top and left+right
        else if ( (heroBox.maxX() < (thisBox.minX() + (this.kWidth / 10))) || 
                  (heroBox.minX() > (thisBox.maxX() - (this.kWidth / 10)))   )
        {
            this.mHeroRef.tookDamage();
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