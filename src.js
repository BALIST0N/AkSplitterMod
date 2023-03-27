"use strict";

Object.defineProperty(exports, "__esModule", { value: true });

class AkSplitterMod 
{   
    postDBLoad(container) 
    {
        const logger = container.resolve("WinstonLogger");
        const modLoader = container.resolve("PreAkiModLoader");
        const items = container.resolve("DatabaseServer").getTables().templates.items;
        const handbook = container.resolve("DatabaseServer").getTables().templates.handbook.Items;
        const locales = container.resolve("DatabaseServer").getTables().locales.global;
        const traders = container.resolve("DatabaseServer").getTables().traders;
        const quests = container.resolve("DatabaseServer").getTables().templates.quests;
        const globalsPresets = container.resolve("DatabaseServer").getTables().globals["ItemPresets"];
        const bots =  container.resolve("DatabaseServer").getTables().bots.types;


        /*************************************  DATA  ********************************************/
        const fs = require('fs');
        let replacedItems = [];
        
        fs.readdirSync(__dirname + "/items",{ withFileTypes: true }).forEach(file => 
        {
            if(file.name != "new") //remove the folder name in the list
            {
                replacedItems.push(file.name);
            }

        });

        let mod_handguard_slot = require("./slot_mod.json");

        const akWeaponFamillyIds = //akweapon familly who use standard sized gastubes
        [
            "5ac66d2e5acfc43b321d4b53", //ak-100 familly + ak74 familly
            "5bf3e0490db83400196199af",
            "5ac66d725acfc43b321d4b60",
            "5644bd2b4bdc2d3b4c8b4572",
            "5ac66cb05acfc40198510a10",
            "5bf3e03b0db834001d2c4a9c",
            "5ac66d9b5acfc4001633997a",
            "5ac4cd105acfc40016339859",
            "5ac66d015acfc400180ae6e4",
            "5ab8e9fcd8ce870019439434",

            "59d6088586f774275f37482f", //AKM
            "5a0ec13bfcdbcb00165aa685", //AKMN
            "59ff346386f77477562ff5e2", //AKMS
            "5abcbc27d8ce8700182eceeb", //AKMSN

            "59e6152586f77473dc057aa1", //vepr-136
            "59e6687d86f77411d949b251", //vpo-209
        ]

        const weaponToReplace = //these weapons have new bundles for having a mod_handguard slot (in the .bundle file)   
        {

            "59d6088586f774275f37482f":"weapons/weapon_izhmash_akm_762x39_new.bundle",
            "5a0ec13bfcdbcb00165aa685":"weapons/weapon_izhmash_akmn_762x39_new.bundle",
            "59ff346386f77477562ff5e2":"weapons/weapon_izhmash_akms_762x39_new.bundle",
            "5abcbc27d8ce8700182eceeb":"weapons/weapon_izhmash_akmsn_762x39_new.bundle",
            "59e6687d86f77411d949b251":"weapons/weapon_molot_akm_vpo_209_366tkm_new.bundle",
            "59e6152586f77473dc057aa1":"weapons/weapon_molot_vepr_km_vpo_136_762x39_new.bundle",
            "628a60ae6b1d481ff772e9c8":"weapons/weapon_rifle_dynamics_704_762x39_new.bundle",
            "59984ab886f7743e98271174":"weapons/weapon_izhmash_pp-19-01_9x19_new.bundle",
            "59f9cabd86f7743a10721f46":"weapons/weapon_izhmash_saiga_9_9x19_new.bundle",

            /*  
            "57dc2fa62459775949412633", //aks-74u
            "583990e32459771419544dd2", //aks-74un
            "5839a40f24597726f856b511", //aks-74ub
            */
        }


        //since both array have akm familly values inside, we must concat and delete duplicates
        const entireAkFamily = [...new Set([...akWeaponFamillyIds, ...Object.keys(weaponToReplace)])];


        const gasblocks = //list of standard gastubes where you can add non special uppers
        [
            "5a01ad4786f77450561fda02",     //vdm cs custom cut
            "59c6633186f7740cf0493bb9",     //ak-74 gas tube
            "59d64ec286f774171d1e0a42",     //akm 6P1 gas tube
            "59e649f986f77411d949b246",     //molot gastube
            "59ccd11386f77428f24a488f"      //vityaz gas tube
        ];


        const newUpperHanguards= 
        [
            "handguard_ak_caa_quad_rail_polymer_upper",
            "handguard_ak_izhmash_ak74_std_plum_upper",
            "handguard_ak_khyber_swiss_grather_upper",
            "handguard_ak_izhmash_ak74_std_wood_upper",
            "handguard_ak_izhmash_ak74m_std_plastic_upper",
            "handguard_ak_izhmash_akm_std_wood_upper",
            "handguard_ak_molot_vepr_km_vpo_136_upper",
            "handguard_ak_molot_vepr_km_vpo_209_upper",
            "handguard_ak_magpul_moe_ak_blk_upper",
            "handguard_ak_magpul_moe_ak_fde_upper",
            "handguard_ak_magpul_moe_ak_od_upper",
            "handguard_ak_magpul_moe_ak_plm_upper",
            "handguard_ak_magpul_moe_ak_sg_upper"
        ]

        const linkLowerAndUpper = //hanguards with special uppers that don't une standard gasblock locking system
        {
            "5cf4e3f3d7f00c06595bc7f0":"handguard_ak_545_design_red_heat_agressor_upper",
            "59fb375986f7741b681b81a6":"handguard_ak_krebs_ufm_akm_long_upper", 
            "5a9d56c8a2750c0032157146":"handguard_ak_strike_industries_trax_1_upper",
            "5f6331e097199b7db2128dc2":"handguard_ak_tdi_x47_upper",
            "5c17664f2e2216398b5a7e3c":"handguard_ak_vltor_cmrd_upper",
            "5648b4534bdc2d3d1c8b4580":"handguard_ak_zenit_b19_upper",
            "5efaf417aeb21837e749c7f2":"handguard_ak_zenit_b31_upper",
            "6389f1dfc879ce63f72fc43e":"handguard_ak_cnc_guns_ov_gp_upper"
        }

        const newLowersFromGastubes = 
        [
            "handguard_ak_troy_vent_hole_lower",
            "handguard_ak_vs_vs_33c_lower",
            "handguard_ak_vs_vs_33c_wht_lower",
            "handguard_slr_ion_lite_704"
        ]




        //*******************************  CODE AND DATA **************************************** */


        //importing modifed weapon bundles
        for (const [key, value] of Object.entries(weaponToReplace)) 
        {
            items[key]._props.Prefab.path = value;
        }


        //replace original handguards by lowers or gasBlocks 
        replacedItems.forEach(filename => 
        {
            let replacedItem = require("./items/" + filename);
            items[replacedItem._id] = replacedItem;

        });

        //add gasblocks to normal ak's
        akWeaponFamillyIds.forEach(ak =>
        {
            items[ak]._props.Slots.find(slot => slot._name == "mod_gas_block")._props["filters"][0].Filter = 
            [
                "5a01ad4786f77450561fda02",
                "59c6633186f7740cf0493bb9",
                "59d64ec286f774171d1e0a42",
                "59e649f986f77411d949b246",
                "5b237e425acfc4771e1be0b6",
                "59ccfdba86f7747f2109a587",
                "5cf656f2d7f00c06585fb6eb"
            ]
            
        });


        //enabling mod_handguard slot on each ak
        entireAkFamily.forEach(ak => 
        {
            mod_handguard_slot._id = "mod_handguard_id_"+ak;
            mod_handguard_slot._parent = ak;
            items[ak]._props.Slots.push( mod_handguard_slot );
        })


        //remove current handguards on standard gasblocks and fill new upper handguards
        gasblocks.forEach(gb => 
        {
            items[gb]._props.Slots.find(slot => slot._name == "mod_handguard")._required = false;

            if(gb == "5a01ad4786f77450561fda02") //if its  vdm cutted tube
            { 
                //remove the entire slot
                items[gb]._props.Slots = [];
                items[gb]._props.Weight = 0.096;
            }
            else
            {
                //add new uppers ids
                items[gb]._props.Slots.find(slot => slot._name == "mod_handguard")._props["filters"][0].Filter = newUpperHanguards;
                //modify prefab path for injecting new bundle
                items[gb]._props.Prefab.path = "gasblock/"+items[gb]._name+"_new.bundle";

            }
        });


               

        //create new lowers handguards item from separated gasblocks bundles
        newLowersFromGastubes.forEach(lower => 
        {
            let LowerToAddData = require("./items/new/"+lower+".json");

            handbook.push(LowerToAddData.handbook);
            items[lower] = LowerToAddData.item;

            for (const [lang, localeData] of Object.entries(locales)) //foreach lang
            {
                for (const [entry, text] of Object.entries(LowerToAddData.locale)) //and for each entry to add in a locale file
                {
                    locales[lang][entry] = text;
                }                
            }
        });


        //create new upper items from separated default handguards
        newUpperHanguards.concat(Object.values(linkLowerAndUpper)).forEach(upper => 
        {
            let upperToAddData = require("./items/new/"+upper+".json");
            handbook.push(upperToAddData.handbook);
            items[upper] = upperToAddData.item;

            for (const [lang, localeData] of Object.entries(locales)) 
            {
                for (const [entry, text] of Object.entries(upperToAddData.locale)) 
                {
                    locales[lang][entry] = text;
                }                
            }
        })  

        //gp-25 remove new gasblock conflicts
        delete items["62e7e7bbe6da9612f743f1e0"]._props.ConflictingItems[items["62e7e7bbe6da9612f743f1e0"]._props.ConflictingItems.indexOf("5cf656f2d7f00c06585fb6eb")];
        delete items["62e7e7bbe6da9612f743f1e0"]._props.ConflictingItems[items["62e7e7bbe6da9612f743f1e0"]._props.ConflictingItems.indexOf("5cf656f2d7f00c06585fb6eb")];


        /********************************* Script for modifying presets ************************************************/

        for(let preset in globalsPresets)
        {
            let parentItem = globalsPresets[preset]._items.find(item => item._id == globalsPresets[preset]._parent );

            if(entireAkFamily.indexOf(parentItem._tpl) != -1 ) //if the preset base weapon  is an ak family weapon
            {   
                let oldHandguard = globalsPresets[preset]._items.find(item => item.slotId == "mod_handguard" )
                if( oldHandguard?.parentId !== undefined)
                {
                    globalsPresets[preset]._items.find(item => item.slotId == "mod_handguard" ).parentId = parentItem._id;
                    
                    let newUpper = oldHandguard._tpl;
                    let actualHandguard = items[oldHandguard._tpl]._name;

                    newUpperHanguards.forEach(upper => 
                    {
                        if(upper.includes(actualHandguard) == true )
                        {
                            newUpper = upper;
                        }
                    });

                    globalsPresets[preset]._items.push(
                    {
                        "_id": (Math.random() * 0xffffffffffffffffffffffff).toString(16),
                        "_tpl": newUpper,
                        "parentId": globalsPresets[preset]._items.find(item => item.slotId == "mod_gas_block" )._id,
                        "slotId": "mod_handguard"
                    });

                }
                else
                {
                    globalsPresets[preset]._items.push({
                        "_id": (Math.random() * 0xffffffffffffffffffffffff).toString(16),
                        "_tpl": "handguard_slr_ion_lite_704",
                        "parentId": parentItem._id,
                        "slotId": "mod_handguard"
                      });
                }
                
            }
        }



        /************************************ TRADERS ASSORT FIXING *********************************/
        for(let trader in traders)
        {
            if(traders[trader].base.nickname != "caretaker" && trader != "ragfair")
            {
                for(let assortItem in traders[trader].assort.items)
                {
                    if(entireAkFamily.indexOf(traders[trader].assort.items[assortItem]._tpl) != -1 ) //if the preset base weapon  is an ak family weapon
                    {   
                        let weaponId = traders[trader].assort.items[assortItem]._id;

                        if(traders[trader].assort.items[assortItem]._tpl == "628a60ae6b1d481ff772e9c8")
                        {
                            traders[trader].assort.items.push(
                            {
                                "_id": (Math.random() * 0xffffffffffffffffffffffff).toString(16),
                                "_tpl": "handguard_slr_ion_lite_704",
                                "parentId": weaponId,
                                "slotId": "mod_handguard"
                            });
                        }
                        else
                        {
                            let childs = traders[trader].assort.items.filter(assortItem2 => assortItem2.parentId == weaponId);
    
                            childs.forEach(child =>
                            {
                                childs = childs.concat(traders[trader].assort.items.filter(assortItem2 => assortItem2.parentId == child._id))
                            });
    
                            childs = WeaponFixer(childs,weaponId);
                            
                            childs.forEach(child => 
                            {   
                                let index = traders[trader].assort.items.findIndex(item => item._id == child._id)
                                if(index > -1)
                                {
                                    traders[trader].assort.items[index] = child;
                                }
                                else
                                {
                                    traders[trader].assort.items.push(child);
                                }
    
                            })
                        }

                    }
                }
            }

        }
        
        /***********************************************  BOT GENERATION FIXING ****************************************/
        
        let botTypeModsData = {};
        let gasblocksToChanges = [];
        let lowerAndUppers =
        {            
            "handguard_ak_caa_quad_rail_polymer":"handguard_ak_caa_quad_rail_polymer_upper",
            "handguard_ak_izhmash_ak74_std_plum":"handguard_ak_izhmash_ak74_std_plum_upper",
            "handguard_ak_tdi_akm_l":"handguard_ak_khyber_swiss_grather_upper",
            "handguard_ak_tdi_akm_l_gld":"handguard_ak_khyber_swiss_grather_upper",
            "handguard_ak_tdi_akm_l_red":"handguard_ak_khyber_swiss_grather_upper",
            "handguard_ak_izhmash_ak74_std_wood":"handguard_ak_izhmash_ak74_std_wood_upper",
            "handguard_ak_izhmash_ak74m_std_plastic":"handguard_ak_izhmash_ak74m_std_plastic_upper",
            "handguard_ak_izhmash_ak100_rail_plastic":"handguard_ak_izhmash_ak74m_std_plastic_upper",
            "handguard_ak_cugir_arms_factory_wasr_10_63_std":"handguard_ak_izhmash_akm_std_wood_upper",
            "handguard_ak_izhmash_akm_std_wood":"handguard_ak_izhmash_akm_std_wood_upper",
            "handguard_ak_molot_vepr_km_vpo_136":"handguard_ak_molot_vepr_km_vpo_136_upper",
            "handguard_ak_molot_vepr_km_vpo_209":"handguard_ak_molot_vepr_km_vpo_209_upper",
            "handguard_ak_magpul_moe_ak_blk":"handguard_ak_magpul_moe_ak_blk_upper",
            "handguard_ak_magpul_moe_ak_fde":"handguard_ak_magpul_moe_ak_fde_upper",
            "handguard_ak_magpul_moe_ak_od":"handguard_ak_magpul_moe_ak_od_upper",
            "handguard_ak_magpul_moe_ak_plm":"handguard_ak_magpul_moe_ak_plm_upper",
            "handguard_ak_magpul_moe_ak_sg":"handguard_ak_magpul_moe_ak_sg_upper",
            "handguard_ak_zenit_b10":"handguard_ak_izhmash_ak74m_std_plastic_upper"
        }


        /* so i will try to explain what's goin on and what's the logic : 
        for every bot  -> find all AK plateforms weapons -> get all gasblocks allowed for each weapons 
        -> get a list of allowed handgaurd and store it & we need to modify gasblocks childs at the same time
        -> then replace gasblock list by a upper handguards list
        */

        for(let botType in bots)
        {
            for(let weapon in bots[botType].inventory.mods)
            {
                if(entireAkFamily.indexOf(weapon) != -1 ) //if the preset base weapon is an ak family weapon
                {
                    bots[botType].inventory.mods[weapon]["mod_handguard"] = []; //create the handguard slot for ak weapon
                    
                    bots[botType].inventory.mods[weapon]["mod_gas_block"].forEach( gasblock => 
                    {
                        if(bots[botType].inventory.mods[gasblock] !== undefined) //if there is a filter for this mod then
                        {
                            
                            if(bots[botType].inventory.mods[gasblock].hasOwnProperty("mod_handguard") == true) //check if the gasblock has handguard slot
                            {
                                if(gasblock == "5a01ad4786f77450561fda02") //vdm cs gas tube
                                {
                                    delete bots[botType].inventory.mods[gasblock]; //remove it we do,'t need to modify something
                                }
                                else
                                {
                                    bots[botType].inventory.mods[gasblock]["mod_handguard"].forEach(handguard =>
                                    {
                                        if( bots[botType].inventory.mods[weapon]["mod_handguard"].includes(handguard) == false)
                                        {
                                            bots[botType].inventory.mods[weapon]["mod_handguard"].push(handguard); //store the gasblock handguard into the weapon slot
                                        }
                                    });
                                    gasblocksToChanges.push(gasblock); //store gasblocks for removing and replacing new handguards later
                                }

                            }
                            else // its a railed gastube combo
                            {
                                
                                switch(items[gasblock]._name)
                                {
                                    case "gas_block_ak_troy_top_bottom_vent_hole_combo":
                                        if( bots[botType].inventory.mods[weapon]["mod_handguard"].includes("handguard_ak_troy_vent_hole_lower") == false)
                                        {
                                            bots[botType].inventory.mods[weapon]["mod_handguard"].push("handguard_ak_troy_vent_hole_lower");
                                            delete bots[botType].inventory.mods[gasblock]["mod_tactical"];
                                            delete bots[botType].inventory.mods[gasblock]["mod_mount_000"];
                                            delete bots[botType].inventory.mods[gasblock]["mod_mount_001"];
                                            delete bots[botType].inventory.mods[gasblock]["mod_mount_002"];
                                        }
                                        break;

                                    case "gas_block_ak_vs_vs_33c_wht":
                                        if( bots[botType].inventory.mods[weapon]["mod_handguard"].includes("handguard_ak_vs_vs_33c_wht_lower") == false)
                                        {
                                            bots[botType].inventory.mods[weapon]["mod_handguard"].push("handguard_ak_vs_vs_33c_wht_lower");
                                            delete bots[botType].inventory.mods[gasblock]["mod_foregrip"];
                                            delete bots[botType].inventory.mods[gasblock]["mod_mount_000"];
                                            delete bots[botType].inventory.mods[gasblock]["mod_mount_001"];
                                            delete bots[botType].inventory.mods[gasblock]["mod_mount_002"];

                                            let index = bots[botType].inventory.mods[weapon]["mod_gas_block"].indexOf("5d4aab30a4b9365435358c55")
                                            bots[botType].inventory.mods[weapon]["mod_gas_block"][index] = "5cf656f2d7f00c06585fb6eb";
                                        }
                                        break;

                                    case "gas_block_ak_vs_vs_33c":
                                        if( bots[botType].inventory.mods[weapon]["mod_handguard"].includes("handguard_ak_vs_vs_33c_lower") == false)
                                        {
                                            bots[botType].inventory.mods[weapon]["mod_handguard"].push("handguard_ak_vs_vs_33c_lower");
                                            delete bots[botType].inventory.mods[gasblock]["mod_foregrip"];
                                            delete bots[botType].inventory.mods[gasblock]["mod_mount_000"];
                                            delete bots[botType].inventory.mods[gasblock]["mod_mount_001"];
                                            delete bots[botType].inventory.mods[gasblock]["mod_mount_002"];
                                        }
                                        break;

                                    case "gas_block_akp_slr_ak_railed_gas_tube":
                                        if( bots[botType].inventory.mods[weapon]["mod_handguard"].includes("handguard_slr_ion_lite_704") == false)
                                        {
                                            bots[botType].inventory.mods[weapon]["mod_handguard"].push("handguard_slr_ion_lite_704");
                                            delete bots[botType].inventory.mods[gasblock]["mod_foregrip"];
                                            delete bots[botType].inventory.mods[gasblock]["mod_mount_000"];
                                            delete bots[botType].inventory.mods[gasblock]["mod_mount_001"];

                                        }
                                        break;
                                }
                            }
                        }
                        else //its a rd-704
                        {
                            bots[botType].inventory.mods[weapon]["mod_handguard"].push("handguard_slr_ion_lite_704");
                        }
                    })
                    
                    bots[botType].inventory.mods[weapon]["mod_handguard"].forEach(handguard => //loop for deleting non existant anymore slots on handguards 
                    {
                        let slotsNames = [];
                        items[handguard]._props.Slots.forEach(handguardSlot =>
                        {
                            slotsNames.push(handguardSlot._name);//get a lot of existing slots on the items json
                        })

                        if(bots[botType].inventory.mods[handguard] !== undefined )
                        {
                            Object.keys(bots[botType].inventory.mods[handguard]).forEach(key => 
                            {
                                if(slotsNames.includes(key) == false ) //if the slot on the filter doesn't exist anymore on the json 
                                {   
                                    delete bots[botType].inventory.mods[handguard][key]; //delete it : ) 
                                }
                            });
                        }
                    })
                }
            }

            let uppersToAdd = []; 
            gasblocksToChanges.forEach(gasblock => //loop to add uppers handguard to compatibles gasblock
            {
                
                if(bots[botType].inventory.mods[gasblock] === undefined ) //this can happen, just add it 
                {
                    bots[botType].inventory.mods[gasblock] = {"mod_handguard":[]}
                }
                
                if(bots[botType].inventory.mods[gasblock].hasOwnProperty("mod_handguard") == false)
                {
                    //nothing should pass here 
                }
                
                bots[botType].inventory.mods[gasblock]["mod_handguard"].forEach(handguard => 
                {
                    //check compatibility for a type of handguard
                    if(lowerAndUppers[items[handguard]._name] !== undefined && uppersToAdd.indexOf( lowerAndUppers[items[handguard]._name] ) == -1) 
                    {   
                        uppersToAdd.push( lowerAndUppers[items[handguard]._name] ); //add upper to the list, need to add later since we need all handguards for every weapon
                    }
                    else
                    {
                        if(Object.keys(linkLowerAndUpper).includes(items[handguard]._name) == true) //if its a special handguard that doesn't use gasblock locking system
                        {
                            bots[botType].inventory.mods[handguard]["mod_handguard"] = linkLowerAndUpper[handguard];//in that case we can push it directly into the handguard filter
                        }
                    }
                })
            })
            
            gasblocksToChanges.forEach(gasblock => 
            {
                bots[botType].inventory.mods[gasblock]["mod_handguard"] = uppersToAdd; //directly replace lower list by the new upper list

            });

            //botTypeModsData[botType] = bots[botType].inventory.mods 
        }
          
        //fs.writeFileSync(__dirname + "/bot_mods.json", JSON.stringify(botTypeModsData, null, 4) );
        //bots = botTypeModsData //<- for testing purposes 


        /******************************************************* QUESTS REWARDS FIXING SCRIPT **********************************************************/

        for(let quest in quests)
        {
            quests[quest].rewards["Success"].filter(reward => reward.type == "Item").forEach(reward => 
            {
                if(reward.items.find(itemReward => entireAkFamily.indexOf(itemReward._tpl) != -1 ) !== undefined )
                {
                    reward.items = WeaponFixer(reward.items,reward.target);
                    //console.log(quests[quest].QuestName + " -> "+  items[reward.items[0]._tpl]._name );
                }
            })
        }


        /***************************************** FUNCTIONS **************************************************/
        

        function WeaponFixer(weapon,weaponParentId)
        {
            let baseweapon = weapon.find(weaponPart => entireAkFamily.indexOf(weaponPart._tpl) != -1 );
            if( baseweapon !== undefined && baseweapon._tpl == "628a60ae6b1d481ff772e9c8")
            {
                weapon.push(
                {
                    "_id": (Math.random() * 0xffffffffffffffffffffffff).toString(16),
                    "_tpl": "handguard_slr_ion_lite_704",
                    "parentId": baseweapon._id,
                    "slotId": "mod_handguard"
                });
            }
            else
            {
                let upperToAdd = {};
                weapon.forEach(weaponPart => 
                {
                    if(weaponPart.slotId == "mod_handguard")
                    {
                        weaponPart.parentId = weaponParentId
                        let upperHandguard = newUpperHanguards.find(upper => upper.includes(items[weaponPart._tpl]._name))
                        if(upperHandguard !== undefined)
                        {
                            upperToAdd = 
                            {
                                "_id": (Math.random() * 0xffffffffffffffffffffffff).toString(16),
                                "_tpl": upperHandguard,
                                "parentId": weapon.find(weaponPart2 => weaponPart2.slotId == "mod_gas_block")._id ,
                                "slotId": "mod_handguard"
                            };
                        }
                        else
                        {
                            upperHandguard = linkLowerAndUpper[weaponPart._tpl];
                            upperToAdd = 
                            {
                                "_id": (Math.random() * 0xffffffffffffffffffffffff).toString(16),
                                "_tpl": upperHandguard,
                                "parentId": weaponPart._id,
                                "slotId": "mod_handguard"
                            };
                        }
                    }
                });
    
                if(Object.keys(upperToAdd).length > 0 )
                {
                    weapon.push(upperToAdd);
                }
            }

            return weapon;
        }

    }

}

module.exports = { mod: new AkSplitterMod() };