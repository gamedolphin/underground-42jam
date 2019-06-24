import Phaser from 'phaser';

let wallGfx = null;
let physicsGroup = null;
const wallColor = 0x333333;

class WallTile extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, size) {
    if(wallGfx === null) {
      let gfx = scene.make.graphics(0,0);
      gfx.fillStyle(wallColor, 1);
      gfx.fillRect(0,0,size,size);
      wallGfx = gfx.generateTexture('wallTile');
      physicsGroup = scene.physics.add.staticGroup();
      gfx.destroy();
    }

    super(scene,x*size,y*size,'wallTile');
    this.scene = scene;
    // this.scene.add.existing(this);

    physicsGroup.add(this);
    this.setOrigin(0,0);
  }
};

export default WallTile;
