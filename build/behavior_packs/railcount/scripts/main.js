import { world, system, MinecraftBlockTypes } from "@minecraft/server";
//Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
//The execution policy stuff
var Dir;
(function (Dir) {
    Dir[Dir["FUP"] = 0] = "FUP";
    Dir[Dir["FC"] = 1] = "FC";
    Dir[Dir["BUP"] = 2] = "BUP";
    Dir[Dir["BC"] = 3] = "BC";
    Dir[Dir["LUP"] = 4] = "LUP";
    Dir[Dir["LC"] = 5] = "LC";
    Dir[Dir["RUP"] = 6] = "RUP";
    Dir[Dir["RC"] = 7] = "RC";
})(Dir || (Dir = {}));
function checkStateAndLoc(p) {
    const b = p.dimension.getBlock(p.location);
    if (b !== undefined) {
        let n = b.permutation.getState("rail_direction");
        if (typeof n === "number") {
            world.sendMessage(n + " : " + p.location.x + " " + p.location.y + " " + p.location.z);
        }
    }
}
function randomNumberBetween(min, max) {
    return Math.random() * (max - min) + min;
}
let randomNumber = randomNumberBetween(1, 10);
console.log(randomNumber);
class RailLoc {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    compare(v) {
        if (this.x === v.x && this.y === v.y && this.z === v.z) {
            return true;
        }
        else {
            return false;
        }
    }
    offset(x, y, z) {
        return new RailLoc(this.x + x, this.y + y, this.z + z);
    }
}
class RailIterator {
    constructor(x, y, z, d) {
        this.d = d;
        this.lenght = 0;
        this.current = new RailLoc(Math.floor(x), Math.floor(y), Math.floor(z));
        this.previous = new RailLoc(0, -64, 0);
    }
    run(p) {
        while (this.next()) {
            this.lenght++;
        }
        this.d.runCommandAsync("tp @a " + this.current.x.toString() + " " + this.current.y.toString() + " " + this.current.z.toString());
        return this.lenght.toString();
    }
    next() {
        let b = this.d.getBlock(this.current);
        if (b !== undefined) {
            let s = b?.permutation.getState("rail_direction");
            if (typeof s === "number") {
                let next = this.current;
                switch (s) {
                    case 0:
                        next = this.validate(this.current.offset(0, 0, 1), this.current.offset(0, 0, -1));
                        break;
                    case 1:
                        next = this.validate(this.current.offset(-1, 0, 0), this.current.offset(1, 0, 0));
                        break;
                    case 2:
                        next = this.validate(this.current.offset(-1, 0, 0), this.current.offset(1, 1, 0));
                        break;
                    case 3:
                        next = this.validate(this.current.offset(-1, 1, 0), this.current.offset(1, 0, 0));
                        break;
                    case 4:
                        next = this.validate(this.current.offset(0, 1, -1), this.current.offset(0, 0, 1));
                        break;
                    case 5:
                        next = this.validate(this.current.offset(0, 1, 1), this.current.offset(0, 0, -1));
                        break;
                    case 6:
                        next = this.validate(this.current.offset(0, 0, 1), this.current.offset(1, 0, 0));
                        break;
                    case 7:
                        next = this.validate(this.current.offset(0, 0, 1), this.current.offset(-1, 0, 0));
                        break;
                    case 8:
                        next = this.validate(this.current.offset(0, 0, -1), this.current.offset(-1, 0, 0));
                        break;
                    case 9:
                        next = this.validate(this.current.offset(0, 0, -1), this.current.offset(1, 0, 0));
                        break;
                }
                if (next !== false) {
                    this.previous = this.current;
                    this.current = next;
                    return true;
                }
            }
        }
        return false;
    }
    validate(loc1, loc2) {
        let down1 = loc1.offset(0, -1, 0);
        let down2 = loc2.offset(0, -1, 0);
        if (!loc1.compare(this.previous) && this.isRail(loc1)) {
            return loc1;
        }
        else if (!loc2.compare(this.previous) && this.isRail(loc2)) {
            return loc2;
        }
        else if (!down1.compare(this.previous) && this.isRail(down1)) {
            return down1;
        }
        else if (!down2.compare(this.previous) && this.isRail(down2)) {
            return down2;
        }
        else {
            return false;
        }
    }
    isRail(loc) {
        let b = this.d.getBlock(loc);
        if (b !== undefined) {
            if (b?.permutation.type === MinecraftBlockTypes.rail || b?.permutation.type === MinecraftBlockTypes.goldenRail) {
                return true;
            }
        }
        return false;
    }
}
let tickIndex = 0;
let counter;
function mainTick() {
    try {
        tickIndex++;
        if (tickIndex === 100) {
            world.getDimension("overworld").runCommandAsync("say Hello starter!");
            world.beforeEvents.chatSend.subscribe(async (eventData) => {
                const p = eventData.sender;
                if (eventData.message === "po") {
                    counter = new RailIterator(p.location.x, p.location.y, p.location.z, p.dimension);
                    world.sendMessage(counter.run(eventData.sender).toString());
                    world.sendMessage("op");
                }
                else if (eventData.message === "co") {
                    world.sendMessage(counter.run(eventData.sender).toString());
                    world.sendMessage("op");
                    checkStateAndLoc(eventData.sender);
                }
            });
        }
    }
    catch (e) {
        console.warn("Script error: " + e);
    }
    system.run(mainTick);
}
system.run(mainTick);

//# sourceMappingURL=../../_railcountDebug/main.js.map
