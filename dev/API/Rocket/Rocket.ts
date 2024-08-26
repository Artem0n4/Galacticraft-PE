interface IRocketDescriptor {
  fuel: int;
  tier: int;
  animation: Animation.Base;
}

abstract class RocketManager {
  protected constructor() {}
  public static visualList: {
    tier: int;
    texture: string;
    model: RenderMesh;
    scale?: number;
  }[] = [];
  public static tierList: int[] = [];
  public static data: Map<Vector, IRocketDescriptor> = new Map();
  public static create(pos: Vector, tier: int, animation?: Animation.Base) {
    if (RocketManager.data.get(pos) === undefined) {
      RocketManager.data.set(pos, {
        fuel: 0,
        tier,
        animation: animation || RocketAnimator.createAnimation(pos, tier),
      });
    }
  }
  public static get(pos: Vector) {
    return RocketManager.data.get(pos);
  }
  public static isValid(pos: Vector) {
    return !!RocketManager.data.get(pos);
  }
  public static updateFuel(pos: Vector, fuel: int) {
    if (this.isValid(pos)) {
      RocketManager.data.get(pos).fuel = fuel;
    }
  }
  public static getTierForID(id: int) {
    let item = IDRegistry.getIdInfo(id).split(":")[1];
    Game.message(item);

    if (!item.startsWith("rocket_tier")) {
      return null;
    }
    Game.message(item.split("_")[2]);
    return Number(item.split("_")[2]);
  }
}

class RocketAnimator {
  public animation: Animation.Base;
  protected isLinked: boolean = false;
  public static createAnimation(pos: Vector, tier: int) {
    const validData = RocketManager.visualList.find((v) => v.tier === tier);
    if (!validData) {
      throw new java.lang.RuntimeException();
    }
    const animation = new Animation.Base(pos.x + 0.5, pos.y + 0.3, pos.z + 0.5);
    animation.describe({
      mesh: validData.model,
      skin: "terrain-atlas/" + validData.texture + ".png",
      scale: validData.scale,
    });
    return animation;
  }
  constructor(public pos: Vector) {
    const animation = RocketManager.get(pos).animation;
    if (!animation) {
      throw new java.lang.RuntimeException(
        "RocketAnimator: animation is not defined"
      );
    }
    this.animation = animation;
  }
  public initialize() {
    this.animation.load();
  }
  public linkAnimation(player: int) {
    if (!this.isLinked) {
      return;
    }
    this.isLinked = true;
    let pos = Entity.getPosition(player);
    Threading.initThread("thread.galacticraft.rocket_linker", () => {
      while (pos.y < 512) {
        java.lang.Thread.sleep(20);
        pos = Entity.getPosition(player);
        this.animation.setPos(this.pos.x, pos.y, this.pos.z);
      }
    });
  }
}

class Rocket {
  public transferList: string[];
  public tier: int;
  public item: GItem;
  public texture: string;
  public model: string;
  public scale: number;
  constructor(
    importParams: Partial<RenderMesh.ImportParams> = { scale: [1, 1, 1] }
  ) {
    this.item = new GItem("rocket_tier_" + this.tier, 1);
    RocketManager.tierList[this.tier] = this.tier;
    RocketManager.visualList.push({
      tier: this.tier,
      texture: this.texture,
      model: Modeller.constructRenderMesh(this.model, importParams),
      scale: this.scale || 1,
    });
  }
}

class RocketTier_1 extends Rocket {
  public tier: number = 0;
  public texture: string = "GalacticraftCore/rocket_tier_1";
  public model: string = "rocket_tier_1";
}

const Rocket1 = new RocketTier_1();
