/* 
 * File: ObjectShake.js
 * Defines a damped simple harmonic motion to simulate object shakee
 * A copy of CameraShake but for Object
 * 
 * 
 * AN ATTEMPT FOR HERO SHAKE EVENT
 * REMEMBER TO DELETE THIS IF NOT IN USE!
 * 
 * 
 */

/*jslint node: true, vars: true, bitwise: true */
/*global gEngine, vec2, ShakePosition */
/* find out more about jslint: http://www.jslint.com/help.html */
"use strict";

//
////
// damped simple harmonic shake motion
//
function ObjectShake(position, xDelta, yDelta, shakeFrequency, shakeDuration) {
    this.mOrgCenter = vec2.clone(position);
    this.mShakeCenter = vec2.clone(this.mOrgCenter);
    this.mShake = new ShakePosition(xDelta, yDelta, shakeFrequency, shakeDuration);
}

ObjectShake.prototype.updateShakeState = function () {
    var s = this.mShake.getShakeResults();
    vec2.add(this.mShakeCenter, this.mOrgCenter, s);
};

ObjectShake.prototype.shakeDone = function () {
    return this.mShake.shakeDone();
};

ObjectShake.prototype.getCenter = function () { return this.mShakeCenter; };
ObjectShake.prototype.setRefCenter = function (c) {
    this.mOrgCenter[0] = c[0];
    this.mOrgCenter[1] = c[1];
};