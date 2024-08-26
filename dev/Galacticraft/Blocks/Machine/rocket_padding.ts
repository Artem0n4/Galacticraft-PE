// new GBlock("rocket_padding", [
//   { name: "Padding Rocket", texture: [["landing_pad", 0]], inCreative: true },
// ])
//   .create()
//   .info("Place blocks 3x3\nfor create rocket padding");
// IDRegistry.genBlockID("rocket_padding_completed");
// Block.createBlock("rocket_padding_completed", [
//   {
//     name: "Padding of Rocket",
//     texture: [["landing_pad", 0]],
//     inCreative: false,
//   },
// ]);

// new GBlock("buggy_padding", [
//   {
//     name: "Buggy padding{DEBUG}",
//     texture: [["buggy_pad", 0]],
//     inCreative: false,
//   },
// ]);

// new GBlock("buggy_padding_completed", [
//   { name: "Buggy padding", texture: [["buggy_pad", 0]], inCreative: false },
// ]);

// TileEntity.registerPrototype(BlockID.rocket_padding, {
//   useNetworkItemContainer: true,
//   init: function () {
//     //   for(var i;i<3;i++){

//     if (
//       this.blockSource.getBlockId(this.x, this.y, this.z) ==
//         BlockID.rocket_padding &&
//       this.blockSource.getBlockId(this.x - 1, this.y, this.z) ==
//         BlockID.rocket_padding &&
//       this.blockSource.getBlockId(this.x - 2, this.y, this.z) ==
//         BlockID.rocket_padding &&
//       this.blockSource.getBlockId(this.x, this.y, this.z - 1) ==
//         BlockID.rocket_padding &&
//       this.blockSource.getBlockId(this.x - 1, this.y, this.z - 1) ==
//         BlockID.rocket_padding &&
//       this.blockSource.getBlockId(this.x - 2, this.y, this.z - 1) ==
//         BlockID.rocket_padding &&
//       this.blockSource.getBlockId(this.x, this.y, this.z - 2) ==
//         BlockID.rocket_padding &&
//       this.blockSource.getBlockId(this.x - 1, this.y, this.z - 2) ==
//         BlockID.rocket_padding &&
//       this.blockSource.getBlockId(this.x - 2, this.y, this.z - 2) ==
//         BlockID.rocket_padding &&
//       this.blockSource.getBlockId(this.x - 2, this.y, this.z - 1) ==
//         BlockID.rocket_padding
//       // this.blockSource.getBlockId(this.x - i, this.y, this.z) == BlockID.rocket_padding &&
//       // this.blockSource.getBlockId(this.x - i, this.y, this.z - i) == BlockID.rocket_padding &&
//       // this.blockSource.getBlockId(this.x, this.y, this.z - i) == BlockID.rocket_padding
//     ) {
//       this.blockSource.setBlock(
//         this.x - 1,
//         this.y,
//         this.z - 1,
//         BlockID.rocket_padding_completed
//       );
//     }
//   },
// });

interface ITransportDescriptor {
  model: string;
  texture: string;
}

class Padding {
  protected setPaddingModel(data: int, height: int) {
    Block.setShape(BlockID[this.id], 0, 0, 0, 1, height, 1, data);
    return;
  }

  protected placeFunction(coords, item, block, player, region) {

    for (let i = -1; i <= 1; i++) {
      for (let k = -1; k <= 1; k++) {
        if (i === 0 && k === 0) {
          continue;
        }
        const block = region.getBlock(coords.x + i, coords.y, coords.z + k);
        if (block.id === BlockID[this.id] && block.data === 0) {
         return region.setBlock(coords.x, coords.y, coords.z, BlockID[this.id], 1);
        }
      }
    };
    region.setBlock(coords.x, coords.y + 1, coords.z, BlockID[this.id], 0);
  }
  constructor(protected id: string) {
    const description = {
      name: "block.galacticraft." + id,
      texture: [[id, 0]],
      inCreative: true,
    } as Block.BlockVariation;

    new GBlock(id, [description, description]).create();
    Block.registerPlaceFunctionForID(BlockID[id], this.placeFunction.bind(this));
    this.setPaddingModel(1, 5 / 16);
    this.setPaddingModel(0, 3 / 16);
    const raycastShape = new ICRender.CollisionShape();
    raycastShape.addEntry().addBox(0, 0, 0, 1, 4, 1);
    BlockRenderer.setCustomRaycastShape(BlockID[id], 1, raycastShape);
  }
}

const ROCKET_PADDING = new Padding("rocket_padding");
const BUGGY_PADDING = new Padding("buggy_padding");

class RocketPaddingTile extends TileEntityBase {
  animator: RocketAnimator;
  onItemUse(
    coords: Callback.ItemUseCoordinates,
    item: ItemStack,
    player: number
  ): boolean {
    if (this.blockSource.getBlockData(this.x, this.y, this.z) === 0) {
      Game.message("0");
      return;
    }
    const pos = { x: this.x + 0.5, y: this.y + 0.4, z: this.z + 0.5 };
    const tier = RocketManager.getTierForID(item.id);
    if (!tier) {
      Game.message("it is not rocket: it is a -> " + tier);
      return;
    }
    if (RocketManager.isValid(pos)) {
      return; //TODO: create logic
    }
    Entity.setCarriedItem(
      player,
      item.id,
      item.count - 1,
      item.data,
      item.extra
    );
    RocketManager.create(pos, tier);
    const animator = (this.animator = new RocketAnimator(pos));
    animator.initialize();
    return;
  }
}

TileEntity.registerPrototype(
  BlockID["rocket_padding"],
  new RocketPaddingTile()
);
