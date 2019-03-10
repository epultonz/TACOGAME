/* UIHealthBar.js
 * 
 */

/* global GameObject */

"use strict";


function UIHealthBar(sprite, pos) {
    this.mHearts = new SpriteRenderable(sprite);
    this.mHearts.setElementPixelPositions(0,270, 0, 64);
    this.mHearts.setColor([1, 1, 1, 0]);
    this.mHearts.getXform().setPosition(pos[0], pos[1]);
    this.mWidth = 15;
    this.mHearts.getXform().setSize(this.mWidth, 5);
    this.mMaxHP = 100;
    this.mCurHP = this.mMaxHP;
};

UIHealthBar.prototype.draw = function(aCamera) {
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
    var newWidth = 270.0 * heartPercentage;
    this.mHearts.setElementPixelPositions(0,newWidth, 0, 64);
    
    var oldWidth = this.mHearts.getXform().getSize()[0];
    var newWidth = this.mWidth * heartPercentage;
    this.mHearts.getXform().setSize(newWidth, 5);
    
    var heartPos = this.mHearts.getXform().getPosition();
    heartPos[0] = heartPos[0] - ((oldWidth - newWidth)/2.0);
    

    

    
    
    
};