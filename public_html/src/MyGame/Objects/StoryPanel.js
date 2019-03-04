/* File: StoryPanel.js 
 *
 * Creates and initializes the StoryPanel object
 * overrides the update function of GameObject
 */

/*jslint node: true, vars: true */
/*global gEngine: false, GameObject: false, SpriteRenderable: false, vec2: false */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function StoryPanel(texture){
    this.mPanel = new TextureRenderable(texture);
    
}
gEngine.Core.inheritPrototype(StoryPanel, GameObject);