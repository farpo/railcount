import { world, system, MinecraftBlockTypes } from "@minecraft/server";
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
        this.lenght = 1;
        this.current = new RailLoc(Math.floor(x), Math.floor(y), Math.floor(z));
        this.previous = this.current;
    }
    run(p) {
        while (this.next()) {
            this.lenght++;
        }
        p.location.x = this.current.x;
        p.location.y = this.current.y;
        p.location.z = this.current.z;
        return this.lenght.toString();
    }
    next() {
        let b = this.d.getBlock(this.current);
        if (b !== undefined) {
            if (b.permutation.type === MinecraftBlockTypes.rail || b.permutation.type === MinecraftBlockTypes.goldenRail) {
                let next;
                if (this.isValid(this.current.offset(-1, 0, 0), Dir.LC)) {
                    next = this.current.offset(-1, 0, 0);
                }
                else if (this.isValid(this.current.offset(-1, 1, 0), Dir.LUP)) {
                    next = this.current.offset(-1, 1, 0);
                }
                else if (this.isValid(this.current.offset(-1, -1, 0), Dir.LC)) {
                    next = this.current.offset(-1, -1, 0);
                }
                else if (this.isValid(this.current.offset(1, 0, 0), Dir.RC)) {
                    next = this.current.offset(1, 0, 0);
                }
                else if (this.isValid(this.current.offset(1, 1, 0), Dir.RUP)) {
                    next = this.current.offset(1, 1, 0);
                }
                else if (this.isValid(this.current.offset(1, -1, 0), Dir.RC)) {
                    next = this.current.offset(1, -1, 0);
                }
                else if (this.isValid(this.current.offset(0, 0, 1), Dir.BC)) {
                    next = this.current.offset(0, 0, 1);
                }
                else if (this.isValid(this.current.offset(0, 1, 1), Dir.BUP)) {
                    next = this.current.offset(0, 1, 1);
                }
                else if (this.isValid(this.current.offset(0, -1, 1), Dir.BC)) {
                    next = this.current.offset(0, -1, 1);
                }
                else if (this.isValid(this.current.offset(0, 0, -1), Dir.FC)) {
                    next = this.current.offset(0, 0, -1);
                }
                else if (this.isValid(this.current.offset(0, 1, -1), Dir.FUP)) {
                    next = this.current.offset(0, 1, -1);
                }
                else if (this.isValid(this.current.offset(0, -1, -1), Dir.FC)) {
                    next = this.current.offset(0, -1, -1);
                }
                else {
                    return false;
                }
                this.previous = this.current;
                this.current = next;
                return true;
            }
            return false;
        }
        return false;
    }
    isValid(loc, dir) {
        let b = this.d.getBlock(this.current);
        let mb = this.d.getBlock(this.current);
        if (mb !== undefined || b !== undefined) {
            if (mb?.permutation.type === MinecraftBlockTypes.rail || mb?.permutation.type === MinecraftBlockTypes.goldenRail) {
                let s = b?.permutation.getState("rail_direction");
                if (typeof s === "number") {
                    world.sendMessage(s?.toString() + " " + this.current.x.toString() + " " + " " + this.current.y.toString() + " " + this.current.z.toString());
                }
                if (this.previous.compare(loc)) {
                    return false;
                }
                else {
                    switch (dir) {
                        case Dir.FUP:
                            if (s === 4) {
                                return true;
                            }
                            else {
                                return false;
                            }
                            break;
                        case Dir.FC:
                            if (s === 5 || s === 0 || s === 8 || s === 9) {
                                return true;
                            }
                            else {
                                return false;
                            }
                            break;
                        case Dir.BUP:
                            if (s === 5) {
                                return true;
                            }
                            else {
                                return false;
                            }
                            break;
                        case Dir.BC:
                            if (s === 4 || s === 0 || s === 6 || s === 7) {
                                return true;
                            }
                            else {
                                return false;
                            }
                            break;
                            break;
                        case Dir.LUP:
                            if (s === 3) {
                                return true;
                            }
                            else {
                                return false;
                            }
                            break;
                        case Dir.LC:
                            if (s === 1 || s === 2 || s === 8 || s === 7) {
                                return true;
                            }
                            else {
                                return false;
                            }
                            break;
                        case Dir.RUP:
                            if (s === 2) {
                                return true;
                            }
                            else {
                                return false;
                            }
                            break;
                        case Dir.RC:
                            if (s === 1 || s === 3 || s === 6 || s === 9) {
                                return true;
                            }
                            else {
                                return false;
                            }
                            break;
                        default:
                            return false;
                            break;
                    }
                }
            }
            return false;
        }
        return false;
    }
}
let tickIndex = 0;
const loc = new RailLoc(50, 20, 10);
function mainTick() {
    try {
        tickIndex++;
        if (tickIndex === 100) {
            world.getDimension("overworld").runCommandAsync("say Hello starter!");
            world.beforeEvents.chatSend.subscribe(async (eventData) => {
                if (eventData.message === "po") {
                    const p = eventData.sender;
                    const counter = new RailIterator(p.location.x, p.location.y, p.location.z, p.dimension);
                    world.sendMessage(counter.run(eventData.sender).toString());
                    world.sendMessage("op");
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
