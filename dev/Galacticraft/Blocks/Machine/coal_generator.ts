new GBlock("coal_generator", [{
    name: "Coal Generator", texture: [["Machine", 0], ["Machine", 0], ["Machine", 0], ["Coal Generator", 0], ["Machine Output", 0], ["Machine Output", 0]], inCreative: true
}, {
    name: "Coal Generator", texture: [["Machine", 0], ["Machine", 0], ["Machine", 0], ["Coal Generator", 0], ["Machine Output", 0], ["Machine Output", 0]], inCreative: false
}, {
    name: "Coal Generator", texture: [["Machine", 0], ["Machine", 0], ["Machine", 0], ["Coal Generator", 0], ["Machine Output", 0], ["Machine Output", 0]], inCreative: false
}], STONE).info("4 sJ/ s");


// if(__config__.getBool("Difficulty.Machine.Heating")==true){
let CoalGeneratorUI = new UI.StandartWindow(
    {
        standard: {
            header: {
                text: {
                    text: Translation.translate("Coal Generator")
                },
            },
            inventory: {
                standard: true
            },
            background: {
                standard: true
            }
        },
        drawing: [
            //     {
            //     type: "bitmap",
            //     x: 402,
            //     y: 45,
            //     scale: 3.4,
            //   bitmap: 
            //         "generators.coalscale1"

            //     },
            {
                type: "bitmap",
                x: 490,
                y: 110,
                bitmap: "arrow_bar_1",
                scale: 4.2


            }],
        elements: {
            coal_slot: {
                type: "slot",
                x: 400,
                y: 110,
                bitmap: "coalslot",
                size: 70
            },
            progress_scale: {
                type: "scale",
                x: 490,
                y: 110,
                scale: 4.2,
                direction: 0,
                bitmap: "arrow_bar_scale",
                clicker: {
                    onClick: function () {
                        RV && RV.RecipeTypeRegistry.openRecipePage("generator 2");
                    }
                }
            },



            EnergyText: {
                type: "text",
                x: 400,
                y: 190,
                width: 100,
                height: 30,
                text: "Energy type is not defined"
            },
            Status: {
                type: "text",
                x: 400,
                y: 220,
                width: 100,
                height: 30,
                text: "Status: energy is not defined"
            },
            // FiringStatus: {
            //     type: "text",
            //     x: 545,
            //     y: 55,
            //     width: 100,
            //     height: 30,
            //     text: "Burning: %"
            // },
        }
    });

const CoalFactory = new RecipeFactory();
CoalFactory.set({"coal_slot": {
    id: VanillaItemID.coal, count: 1, data: 0, extra: null
}})

class CoalGenerator extends Generator {

    public defaultValues = {
        energy: 0,
        energyMax: 3000,
        burningMax: 3000,
        burning: 0,
        active: false
    };
   public static isCoal(slot: name, container: ItemContainer, data: TileEntity['data']): void {

        const _slot = container.getSlot(slot);
        for (const i in CoalFactory.storage) {
            const recipe = RecipeFactory.get(container, CoalFactory.storage[i]); 
          //  if (_slot.id === burnItems[i].id && data.burning != data.burningMax) {
            if (recipe("coal_slot", "id") && data.burning !== data.burningMax) {
                data.burning += data.burningMax;
            
                _slot.count--

                data.active = true;
            }
        }
        if (data.burning === data.burningMax && data.active === true && data.energy <= data.energyMax) { 
            data.energy += 1 }
        if (data.energy === data.energyMax) { data.active = false; data.burning = 0 }

    }
    
    public onTick(): void {
        this.container.sendChanges();
        this.container.validateAll();

      

        CoalGenerator.isCoal("coal_slot", this.container, this.data)
        

        this.container.setScale("progress_scale", this.data.energy / this.data.energyMax);


        this.container.setText("EnergyText", "Gj :" + this.data.energy + " / " + this.getCapacity());


        if (this.data.energy > 0) {
            if(World.getThreadTime() % 15 === 0) {
                Particles.addParticle(
                    EParticleType.FLAME, this.x + 0.5,
                    this.y + 0.5,
                    this.z + 0.5,
                    Math.random() / 20,
                    Math.random() / 20,
                    Math.random() / 20);
            }
            this.container.setText("Status", Translation.translate("Status: working"));
        }
        else {
            this.container.setText("Status", Translation.translate("Status: fuel empty"));

        };

        if (this.data.energy >= this.data.energyMax) {
            this.container.setText("Status", Translation.translate("Status: storage full"));
           
        }
    };

}


SpacesMachine.registerStandartMachine(BlockID.coal_generator, new CoalGenerator(CoalGeneratorUI))

// StorageInterface.createInterface(BlockID.coal_generator, {
//     slots: {
//         "coalSlot": {
//             input: true,
//             side: "down",
//             isValid: function (item, side) {
//                 return SpacesMachine.getCoal();
//             }
//         },
//     }
// });
