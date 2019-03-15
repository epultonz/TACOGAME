/*
 * File: LoseScene2.js 
 * Show this scene if Kelvin loses in level 2. 
 */

/*jslint node: true, vars: true, white: true */
/*global gEngine, Scene, GameObjectset, TextureObject, Camera, vec2,
  Renderable, TextureRenderable, FontRenderable, SpriteRenderable, LightRenderable, IllumRenderable,
  GameObject, TiledGameObject, ParallaxGameObject, Hero, Minion, Dye, Light, LoseScene */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function LoseScene2() {
    LoseScene.call(this);
}
gEngine.Core.inheritPrototype(LoseScene2, LoseScene);

LoseScene2.prototype.unloadScene = function() {
    gEngine.Textures.unloadTexture(this.kUIButton);
    gScore = 0;
    // next level to be loaded
    if(this.LevelSelect==="Retry")
        gEngine.Core.startScene(new Level2Scene());
    else if(this.LevelSelect==="Main")
        gEngine.Core.startScene(new MyGame());
};