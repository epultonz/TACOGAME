/* UIHealthBar.js
 * 
 */

/* global GameObject */

"use strict";

//difficulty 0 for easy, 1 for medium and 2 for hard
function UIHealthBar(sprite, pos, difficulty) {
    this.mHearts = new SpriteRenderable(sprite);
    //3 for easy, 2 for medium, 1 for hard
    var numberOfHearts = [270.0, 170.0, 90.0];
    this.mNumHearts = numberOfHearts[difficulty]; //1:90 2:180 3:270
    this.mHearts.setElementPixelPositions(0,this.mNumHearts, 0, 64);
    this.mHearts.setColor([1, 1, 1, 0]);
    this.mHearts.getXform().setPosition(pos[0], pos[1]);
    this.mWidth = 15 / (difficulty+1);
    this.mPos = [pos[0] - 50, pos[1]];
    this.mHearts.getXform().setSize(this.mWidth, 5);
    var health = [100,60,1]; //easy medium hard
    this.mMaxHP = health[difficulty];
    this.mCurHP = this.mMaxHP;
    this.mPositionChange = null;
};

UIHealthBar.prototype.draw = function(aCamera) {
    //use this to set position to stay even when camera moves
    this.mHearts.getXform().setPosition(aCamera.getWCCenter()[0] + this.mPos[0] - 
        this.mPositionChange, this.mPos[1]);
    this.mHearts.draw(aCamera);
};

/**
 * Update the UIHealthBar
 * @memberOf UIHealthBar
 */
UIHealthBar.prototype.update = function() {
};

/**
 * Set the Max HP
 * @param {int} hp What to set the Max HP to
 * @memberOf UIHealthBar
 */
UIHealthBar.prototype.setMaxHP = function(hp) {
    if(hp > 0)
        this.mMaxHP = hp;
};

/**
 * Set the Current HP
 * @param {type} hp what to set the Current HP
 * @memberOf UIHealthBar
 */
UIHealthBar.prototype.setCurrentHP = function(hp) {
    if(hp < 0)
        this.mCurHP = 0;
    else
        this.mCurHP = hp;
};

/**
 * Get the Max HP
 * @returns {int} The Max HP
 * @memberOf UIHealthBar
 */
UIHealthBar.prototype.getMaxHP = function() {
    return this.mMaxHP;
};

/**
 * Get the Current HP
 * @returns {int} The Current HP
 * @memberOf UIHealthBar
 */
UIHealthBar.prototype.getCurrentHP = function() {
    return this.mCurHP;
};

/**
 * Increment the HP by the passed amount
 * @param {type} hp The amount to increment by
 * @memberOf UIHealthBar
 */
UIHealthBar.prototype.incCurrentHP = function(hp) {
    if(this.mCurHP + hp > this.mMaxHP)
        this.mCurHP = this.mMaxHP; 
    else if(this.mCurHP + hp < 0)
        this.mCurHP = 0; //demo purposes
    else
        this.mCurHP = this.mCurHP + hp;
    
    var heartPercentage = this.mCurHP / this.mMaxHP;
    var newWidth = this.mNumHearts * heartPercentage;
    this.mHearts.setElementPixelPositions(0,newWidth, 0, 64);
    
    var oldWidth = this.mHearts.getXform().getSize()[0];
    var newWidth = this.mWidth * heartPercentage;
    this.mHearts.getXform().setSize(newWidth, 5);
    
    var heartPos = this.mHearts.getXform().getPosition();
    this.mPositionChange += (oldWidth - newWidth)/2.0;
    //heartPos[0] = heartPos[0] - this.mPositionChange;
    

    

    
    
    
};