type id = any
//typeof BlockID[string] | number
class ItemOre {
  item_list: [];
  public id: string;
     constructor(id, stack?, meta?, isTech?) {
       this.id = id;
     }
  public createOre(): any {
      new GItem("ingot_" + this.id + "_sc");
      new GItem("compressed_" + this.id + "_sc");
      Recipes.addFurnace(
        BlockID["ore_" + this.id],
        0,
        ItemID["ingot_" + this.id + "_sc"],
        0
      );
   
  }

 
}