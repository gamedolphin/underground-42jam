import Phaser from "phaser";
import tiles from './assets/tileset.png';

import MapGen from './map_gen.js';
import MapDraw from './map_draw.js';



const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 3200,
  height: 3200,
  scene: {
    preload: preload,
    create: create,
    update: update
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: true
    }
  }
};

const game = new Phaser.Game(config);

const mapConfig = {
  height: 100,
  width: 100,
  useRandomSeed: true,
  smooth: 10,
  seed: "HELLO",
  wallThreshold: 200
};
var mapGenerator = new MapGen(mapConfig);

function preload() {
  this.load.spritesheet('tiles', tiles, {
    frameWidth: 32,
    frameHeight: 32
  });
}

function create() {
  const { config, map, walls } = mapGenerator;
  mapGenerator.debugDraw(this, 32);
  MapDraw(this,config, map, walls);
}

function update() {
};
