import Phaser from 'phaser';
import WallTile from './tiles/wall_tile.js';
import { createArray } from './utils.js';

const size = 10;
const Image_Dic = {
  CORNER_BOTTOM_LEFT: [97],
  CORNER_BOTTOM_RIGHT: [97],
  CORNER_TOP_RIGHT:[149],
  CORNER_TOP_LEFT: [154],
  CORNER_BOTTOM_RIGHT_SPECIAL: [164],
  CORNER_BOTTOM_LEFT_SPECIAL: [165],
  CORNER_TOP_RIGHT_SPECIAL: [111],
  CORNER_TOP_LEFT_SPECIAL: [96],
  TOP: [97,99,102,103,104,105,122,123],
  RIGHT: [127,143,159],
  LEFT: [112,128,144],
  BOTTOM: [161,162,163],
  NONE: [0]
};

//6+
const tileDic = {
  127: Image_Dic.CORNER_TOP_LEFT_SPECIAL, //
  208: Image_Dic.CORNER_TOP_LEFT, //
  223: Image_Dic.CORNER_TOP_RIGHT_SPECIAL, //
  105: Image_Dic.CORNER_TOP_RIGHT, //
  232: Image_Dic.CORNER_TOP_RIGHT, //
  233: Image_Dic.CORNER_TOP_RIGHT, //
  104: Image_Dic.CORNER_TOP_RIGHT, //
  244: Image_Dic.CORNER_TOP_LEFT, //
  240: Image_Dic.CORNER_TOP_LEFT, //
  212: Image_Dic.CORNER_TOP_LEFT, //
  254: Image_Dic.CORNER_BOTTOM_RIGHT_SPECIAL, //
  11: Image_Dic.CORNER_BOTTOM_RIGHT, //
  251: Image_Dic.CORNER_BOTTOM_LEFT_SPECIAL, //
  22: Image_Dic.CORNER_BOTTOM_LEFT, //
  63: Image_Dic.TOP, //
  159: Image_Dic.TOP, //
  150: Image_Dic.TOP, //
  31: Image_Dic.TOP, //
  15: Image_Dic.TOP, //
  47: Image_Dic.TOP, //
  43: Image_Dic.TOP, //
  23: Image_Dic.TOP, //
  151: Image_Dic.TOP, //
  214 : Image_Dic.RIGHT, //
  215 : Image_Dic.RIGHT, //
  246 : Image_Dic.RIGHT, //
  107: Image_Dic.LEFT, //
  111: Image_Dic.LEFT, //
  235: Image_Dic.LEFT, //
  248: Image_Dic.BOTTOM, //
  249: Image_Dic.BOTTOM, //
  252: Image_Dic.BOTTOM, //
  255: Image_Dic.NONE //
};

const drawMap = (scene,config, data, walls) => {

  const { height, width } = config;
  const map = scene.make.tilemap({
    tileWidth: 32,
    tileHeight: 32,
    height, width
  });

  const tileset = map.addTilesetImage("tiles", null, 32, 32);
  const wallLayer = map.createBlankDynamicLayer("Walls", tileset);

  for (var x = 0; x < width; x++) {
    for (var y = 0; y < height; y++) {
      let wallTile = walls[x][y];
      if(wallTile > 0) {
        let ar = tileDic[wallTile];
        let tileSp = !!ar ? ar[Math.floor(Math.random()*ar.length)] : ar;
        wallLayer.putTileAt(tileSp,x,y);
      }
    }
  }
};

export default drawMap;
