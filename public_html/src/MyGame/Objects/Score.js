/*
 * File: Score.js
 * Keep track of score 
 *
 */
/*jslint node: true, vars: true */
/*global gEngine: false, GameObject: false, SpriteRenderable: false, vec2: false, UIText: false */
/* find out more about jslint: http://www.jslint.com/help.html */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

var gScore = gScore || 0;

function Score() {
    //@param [text, ViewPortPosition, size, hAlign, vAlign, color]
    this.scoreText = new UIText("Score",[400,500],8,null,null,[1,1,1,1]);
    this.scoreText.setText(gScore);
}

Score.prototype.draw = function(aCam){
    this.scoreText.draw(aCam);
};

Score.prototype.update = function(){
    
};