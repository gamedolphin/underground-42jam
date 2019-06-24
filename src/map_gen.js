import Phaser from 'phaser';
import { createArray } from './utils.js';

const DEFAULTCONFIG = {
  fillPercent: 50,
  smooth: 5,
  wallThreshold: 100,
  passageRadius: 2,
  width: 100,
  height: 100,
  useRandomSeed: true,
  seed: Date.now().toString()
};


class Room {

  constructor(tiles,map) {
    this.tiles = tiles;
    this.map = map;
    this.size = tiles.length;
    this.connectedRooms = [];
    this.edgeTiles = [];
    this.accessibleFromMainRoom = false;
    this.isMainRoom = false;

    tiles.forEach(tile => {
      let tX = tile.x, tY = tile.y;
      for (let x = tX - 1; x <= tX + 1; x++) {
        for (let y = tY- 1; y <= tY + 1; y++) {
          if(x === tX || y === tY) {
            if(map[x][y] === 1) {
              this.edgeTiles.push(tile);
            }
          }
        }
      }
    });
  }

  static connectRooms(roomA, roomB) {

    if(roomA.accessibleFromMainRoom) {
      roomB.setAccessibleFromMainRoom();
    }
    else if(roomB.accessibleFromMainRoom) {
      roomA.setAccessibleFromMainRoom();
    }

    roomA.connectedRooms.push(roomB);
    roomB.connectedRooms.push(roomA);
  }

  isConnected(otherRoom) {
    return this.connectedRooms.indexOf(otherRoom) > -1;
  }

  static compareSize(roomA, roomB) {
    return roomA.tiles.length - roomB.tiles.length;
  }

  setAccessibleFromMainRoom() {
    if(!this.accessibleFromMainRoom) {
      this.accessibleFromMainRoom = true;
      this.connectedRooms.forEach(room => {
        room.setAccessibleFromMainRoom();
      });
    }
  }
};


class MapGen {

  config = null;

  map = [[]];
  rooms = [];
  walls = [];

  constructor(config) {
    this.config = { ...DEFAULTCONFIG, ...config }; // merge both configs
    this.generateMap();
  }

  generateMap() {
    const { width, height, smooth } = this.config;
    this.map = createArray(width, height);
    this.walls = createArray(width, height);
    this.randomFillMap();

    for (var i = 0; i < smooth; i++) {
      this.smoothMap();
    }

    this.processMap();

    this.setupBorderWalls();
  }

  smoothMap() {
    for (var i = 0; i < this.map.length; i++) {
      for (var j = 0; j < this.map[i].length; j++) {
        let nTiles = this.getSurroundingWallCount(i,j);
        if(nTiles > 4) {
          this.map[i][j] = 1;
        }
        else if(nTiles < 4){
          this.map[i][j] = 0;
        }
      }
    }
  }

  setupBorderWalls() {
    let { map, walls } = this;
    const { height, width } = this.config;
    let vals = [];
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        if(map[i][j] === 1) {
          walls[i][j] = this.getSurroundingWalls(map,i,j);
          vals.push(walls[i][j]);
        }
        else {
          walls[i][j] = 0;
        }
      }
    }

    function onlyUnique(value, index, self) {
      return self.indexOf(value) === index;
    }

    let unique = vals.filter(onlyUnique).sort((a,b) => a-b);

    console.log(unique);

    // let a = [];
    // let specialNums = [208,220,216,144,217,215,81,97,189,193,145,205];
    // let specialCorners = [];

    // for (let i = 0; i < width; i++) {
    //   for (let j = 0; j < height; j++) {
    //     let wallTile = walls[i][j];
    //     if(wallTile === 15) {
    //       let tileNum = this.getSurroundingWalls(walls,i,j);

    //       if(specialNums.indexOf(tileNum) > -1) {
    //         specialCorners.push({ x: i, y: j, tileNum });
    //       }
    //       else {
    //         a.push(tileNum);
    //       }
    //     }
    //   }
    // }

    // for (var k = 0; k < specialCorners.length; k++) {
    //   let corner = specialCorners[k];
    //   walls[corner.x][corner.y] = corner.tileNum;
    // }

    // let unique = a.filter(onlyUnique).sort((a,b) => a-b);

    // console.log(unique);
  }

  getSurroundingWalls(map,x,y) {
    const { height, width } = this.config;

    const vals = [1,2,4,8,16,32,64,128];
    let count = 0;
    let ans = 0;
    for (var j = y-1; j <= y+1; j++) {
      for (var i = x-1; i <= x+1; i++) {
        if(i==x && j==y) continue;
        let pow = vals[count];
        let obj = -1;
        if(i<0 || j < 0 || i >= width || j >= height)  {
          obj = 1;
        }
        // else if(i !==x && j !== y) {
        //   let signX = i-x;
        //   let signY = j-y;
        //   let xPos = i-signX;
        //   let yPos = j-signY;
        //   if(xPos < 0 || xPos >= width || yPos < 0 || yPos >= height) {
        //     obj = 0;
        //   }
        //   else if(map[xPos][j] === 1 && map[i][yPos] === 1){
        //     obj = 1;
        //   }
        // }
        else {
          obj = map[i][j];
        }
        ans += obj * pow;
        count+=1;
      }
    }

    return ans;

    // let up = y - 1 < 0 ? 1 : map[x][y-1];
    // let up_right = y - 1 < 0 && x + 1 >= width ? 2 : map[x+1][y-1] * 2;
    // let right = x + 1 >= width ? 2 : map[x+1][y] * 2;
    // let down = y + 1 >= height ? 4 : map[x][y+1] * 4;
    // let left = x - 1 < 0 ? 8 : map[x-1][y] * 8;

    // return up + right + down + left;
  }

  getSurroundingWallCount(x,y) {
    let map = this.map;
    let wallCount = 0;
    const { height, width } = this.config;

    for (var nX = x - 1; nX <= x + 1; nX++) {
      for (var nY = y - 1; nY <= y + 1; nY++) {
        if(nX !== x || nY !== y) {
          if(nX >= 0 && nX < width && nY >=0 && nY < height) {
            wallCount += map[nX][nY];
          }
          else {
            wallCount += 1;
          }
        }
      }
    }

    return wallCount;
  }

  processMap() {
    const { wallThreshold } = this.config;
    let { map } = this;
    let regions = this.getRegions(0);
    regions.forEach(region => {
      if(region.length < wallThreshold) {
        region.forEach(tile => {
          map[tile.x][tile.y] = 1;
        });
      }
      else {
        let room = new Room(region, map);
        this.rooms.push(room);
      }
    });
    this.rooms.sort(Room.compareSize);
    this.rooms[this.rooms.length - 1].isMainRoom = true;
    this.rooms[this.rooms.length - 1].accessibleFromMainRoom = true;
    this.connectClosestRooms(this.rooms);
  }

  connectClosestRooms(rooms, forceAccessFromMainRoom = false) {

    let roomListA = [];
    let roomListB = [];

    if(forceAccessFromMainRoom) {
      rooms.forEach(room => {
        if(room.accessibleFromMainRoom) {
          roomListB.push(room);
        }
        else {
          roomListA.push(room);
        }
      });
    }
    else {
      roomListA = rooms;
      roomListB = rooms;
    }

    let bestDistance = 10000;
    let bestTileA = null;
    let bestTileB = null;
    let bestRoomA = null;
    let bestRoomB = null;
    let foundConnection = false;
    roomListA.forEach(roomA => {
      if(!forceAccessFromMainRoom) {
        foundConnection = false;
        if(roomA.connectedRooms.length > 0) {
          return;
        }
      }

      roomListB.forEach(roomB => {
        if(roomA === roomB || roomA.isConnected(roomB)) {
          return;
        }

        for (var tileIndexA = 0; tileIndexA < roomA.edgeTiles.length; tileIndexA++) {
          for (var tileIndexB = 0; tileIndexB < roomB.edgeTiles.length; tileIndexB++) {
            let tileA = roomA.edgeTiles[tileIndexA];
            let tileB = roomB.edgeTiles[tileIndexB];
            let distance = Math.pow(tileA.x - tileB.x,2) + Math.pow(tileA.y - tileB.y,2);

            if(distance < bestDistance || !foundConnection) {
              bestDistance = distance;
              foundConnection = true;
              bestTileA = tileA;
              bestTileB = tileB;
              bestRoomA = roomA;
              bestRoomB = roomB;
            }
          }
        }
      });
      if(foundConnection && !forceAccessFromMainRoom) {
        this.createPassage(bestRoomA, bestRoomB, bestTileA, bestTileB);
      }
    });

    if(foundConnection && !forceAccessFromMainRoom) {
      this.createPassage(bestRoomA, bestRoomB, bestTileA, bestTileB);
      if(!forceAccessFromMainRoom) {
        this.connectClosestRooms(rooms, true);
      }
    }

    if(!forceAccessFromMainRoom) {
      this.connectClosestRooms(rooms, true);
    }
  }


  createPassage(roomA, roomB, tileA, tileB) {
    const { passageRadius } = this.config;
    Room.connectRooms(roomA, roomB);
    let road = this.getLine(tileA, tileB);

    road.forEach(tile => {
      this.drawCircle(tile, passageRadius);
    });
  }

  drawCircle(tile, radius) {
    const r2 = radius*radius;
    for (var x = -radius; x <= radius; x++) {
      for (var y = -radius; y <= radius; y++) {
        if(x*x + y*y < r2) {
          let drawX = tile.x + x;
          let drawY = tile.y + y;
          if(this.isInRange(drawX, drawY)) {
            this.map[drawX][drawY] = 0;
          }
        }
      }
    }
  }

  getLine(from, to) {
    let tiles = [];
    let x = from.x;
    let y = from.y;
    let inverted = false;

    let dx = to.x - from.x;
    let dy = to.y - from.y;

    let step = Math.sign(dx);
    let gradientStep = Math.sign(dy);

    let longest = Math.abs(dx);
    let shortest = Math.abs(dy);

    if(longest < shortest) {
      inverted = true;
      longest = Math.abs(dy);
      shortest = Math.abs(dx);

      step = Math.sign(dy);
      gradientStep = Math.sign(dx);
    }

    let gradientAcc = Math.floor(longest/2);

    for (var i = 0; i < longest; i++) {
      tiles.push({ x, y });

      if(inverted) {
        y += step;
      }
      else {
        x += step;
      }

      gradientAcc += shortest;
      if (gradientAcc >= longest) {
        if(inverted) {
          x += gradientStep;
        }
        else {
          y += gradientStep;
        }
        gradientAcc -= longest;
      }
    }
    return tiles;
  }

  getRegions(tileType) {
    let { width, height } = this.config;
    const { map } = this;
    let regions = [];
    let mapFlags = createArray(width, height);

    for (var x = 0; x < width; x++) {
      for (var y = 0; y < height; y++) {
        if(!mapFlags[x][y] && map[x][y] === tileType) {
          let region = this.getRegionTiles(x,y,mapFlags);
          regions.push(region);
        }
        else {
          mapFlags[x][y] = 1;
        }
      }
    }


    return regions;
  }

  getRegionTiles(tX,tY,mapFlags) {
    const { width, height } = this.config;
    const { map } = this;

    let tiles = [{ x: tX, y: tY }];
    let tileType = map[tX][tY];
    mapFlags[tX][tY] = 1;

    for (let x = tX - 1; x <= tX + 1; x++) {
      for (let y = tY- 1; y <= tY + 1; y++) {
        if(x === tX || y === tY) {
          if(this.isInRange(x,y) && !mapFlags[x][y] && map[x][y] === tileType) {
            var otherTiles = this.getRegionTiles(x,y,mapFlags);
            otherTiles.forEach(tile => {
              tiles.push(tile);
              mapFlags[tile.x][tile.y] = 1;
            });
          }
        }
      }
    }
    return tiles;
  }

  isInRange(x,y) {
    const { height, width } = this.config;
    return x >= 0 && x < width && y >=0 && y < height;
  }

  randomFillMap() {
    const { useRandomSeed, seed, height, width, fillPercent } = this.config;
    var prng = useRandomSeed ? new Phaser.Math.RandomDataGenerator() : new Phaser.Math.RandomDataGenerator(seed);


    for (var i = 0; i < width; i++) {
      for (var j = 0; j < height; j++) {
        if (i === 0 || i === width - 1 || j === 0 || j === height - 1) {
          this.map[i][j] = 1;
        }
        else {
          this.map[i][j] = prng.between(0,100) > fillPercent ? 1 : 0;
        }
      }
    }
  }

  drawDebugSquare(graphic,x,y,height,width,color) {
    graphic.fillStyle(color, 1);
    graphic.fillRect(x,y,height, width);
  }

  debugDraw(scene, size) {
    var graphic = scene.add.graphics();
    const emptyColor = 0x333333;
    const fillColor = 0x000000;
    for (var i = 0; i < this.map.length; i++) {
      for (var j = 0; j < this.map[i].length; j++) {
        const color = this.map[i][j] === 1 ? fillColor : emptyColor;
        this.drawDebugSquare(graphic, i*size, j*size, size, size, color);
      }
    }
  }
};

export default MapGen;
