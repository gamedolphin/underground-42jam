import Phaser from "phaser";
import MapGen from './map_gen.js';

const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 1200,
  height: 800,
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

const game = new Phaser.Game(config);

const mapConfig = { height: 80, width: 120, useRandomSeed: false, smooth: 10, seed: "HELLO", wallThreshold: 200 };
var mapGenerator = new MapGen(mapConfig);

function preload() {
}

function create() {
  mapGenerator.debugDraw(this);
  console.log(mapGenerator.rooms);
}

function update() {
};
