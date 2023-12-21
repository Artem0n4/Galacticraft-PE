
abstract class Machine extends TileEntityBase implements EnergyModule {
  readonly window: UI.StandartWindow;
  constructor(window) {
    super();
    this.window = window;
  }
  public connectingWire(): any {}
  public getScreenByName(): UI.StandartWindow {
    return this.window;
  }
  defaultValues = {
    energy: 0,
  };
  public useNetworkItemContainer: true;
  public getCapacity(): number {
    return this.data.energyMax;
  }
  public energyTick(type: string, src: EnergyTileNode): void {
    let output = Math.min(1, this.data.energy);
    this.data.energy += src.add(output) - output;
  }
  public energyReceive(type: string, amount: number, voltage: number): number {
    amount = Math.min(amount, this.data.energyMax / 2);
    var add = Math.min(amount, this.getCapacity() - this.data.energy);
    this.data.energy += add;
    return add;
  }

  public setWrenchable(id): any {
    if (id == ItemID.machine_wrench) {
      alert("DEGUG WORK OF WRENCHABLE");
      this.blockSource.setBlock(
        this.x,
        this.y,
        this.z,
        this.blockID,
        this.blockSource.getBlockData(this.x, this.y, this.z) + 1
      );
    }
  }
  public hasRecipe(number: number, array): boolean {
    for (var s; s < number; s++) {
      var slot = this.container.getSlot("slot" + s);
      for (var i in array) {
        var recipe = array[i];
      }
      var result = recipe["slot_" + s];
      if (slot == result) {
        return true;
      }
    }
  };
//   onTick(): void {
//       if(this.getSlot(8,compressorRecipe)){
//         alert("work?")
//       }
//   }
}