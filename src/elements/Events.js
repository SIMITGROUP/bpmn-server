"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoundaryEvent = exports.ThrowEvent = exports.CatchEvent = exports.EndEvent = exports.StartEvent = exports.Event = void 0;
const _1 = require(".");
const behaviours_1 = require("./behaviours");
const __1 = require("../../");
const interfaces_1 = require("../interfaces");
class Event extends _1.Node {
    hasMessage() {
        return this.getBehaviour(behaviours_1.Behaviour_names.MessageEventDefinition);
    }
    hasSignal() {
        return this.getBehaviour(behaviours_1.Behaviour_names.SignalEventDefinition);
    }
    hasTimer() {
        return this.getBehaviour(behaviours_1.Behaviour_names.TimerEventDefinition);
    }
    /**
     *
     * 	using token: check if fromEventBasedGateway;	if yes cancel all other events
     *
     * @param item
     */
    start(item) {
        const _super = Object.create(null, {
            start: { get: () => super.start }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return _super.start.call(this, item);
        });
    }
    end(item, cancel = false) {
        const _super = Object.create(null, {
            end: { get: () => super.end }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return yield _super.end.call(this, item, cancel);
        });
    }
    get canBeInvoked() { return true; }
}
exports.Event = Event;
class CatchEvent extends Event {
    get isCatching() { return true; }
    get requiresWait() {
        return true; // return this.hasMessage(); 
    }
    get canBeInvoked() {
        return true; // return this.hasMessage();
    }
    start(item) {
        const _super = Object.create(null, {
            start: { get: () => super.start }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return _super.start.call(this, item);
        });
    }
}
exports.CatchEvent = CatchEvent;
class BoundaryEvent extends Event {
    get isCatching() { return true; }
    constructor(id, process, type, def) {
        super(id, process, type, def);
        this.isCancelling = true;
        if ((typeof this.def['cancelActivity'] !== 'undefined') && (this.def['cancelActivity'] === false))
            this.isCancelling = false;
    }
    get requiresWait() {
        return true;
    }
    get canBeInvoked() {
        return true;
    }
    start(item) {
        const _super = Object.create(null, {
            start: { get: () => super.start }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return _super.start.call(this, item);
        });
    }
    run(item) {
        const _super = Object.create(null, {
            run: { get: () => super.run }
        });
        return __awaiter(this, void 0, void 0, function* () {
            if (item.token.parentToken.currentItem.status == interfaces_1.ITEM_STATUS.end) // in cancelling mode
                return;
            var ret = _super.run.call(this, item);
            if (this.isCancelling) {
                item.token.log('BoundaryEvent(' + this.id + ').run: isCancelling .. parentToken: ' + item.token.parentToken.id);
                item.token.parentToken.currentItem.status = interfaces_1.ITEM_STATUS.end; //force status so it would not run
                /* fix bug #86
                 */
                item.status = interfaces_1.ITEM_STATUS.end;
                yield item.token.parentToken.terminate();
            }
            return ret;
        });
    }
}
exports.BoundaryEvent = BoundaryEvent;
class ThrowEvent extends Event {
    /**
     *
     * 	using token: check if fromEventBasedGateway;	if yes cancel all other events
     */
    get isCatching() { return false; }
    start(item) {
        const _super = Object.create(null, {
            start: { get: () => super.start }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return yield _super.start.call(this, item);
        });
    }
    run(item) {
        return __awaiter(this, void 0, void 0, function* () {
            return __1.NODE_ACTION.end;
        });
    }
}
exports.ThrowEvent = ThrowEvent;
class EndEvent extends Event {
    get isCatching() { return false; }
    end(item) {
        return super.end(item);
    }
}
exports.EndEvent = EndEvent;
class StartEvent extends Event {
    start(item) {
        const _super = Object.create(null, {
            start: { get: () => super.start }
        });
        return __awaiter(this, void 0, void 0, function* () {
            if (this.def.$attrs && this.def.$attrs["camunda:initiator"]) {
                const initiator = this.def.$attrs["camunda:initiator"];
                item.token.data[initiator] = item.userId;
            }
            return yield _super.start.call(this, item);
        });
    }
    get isCatching() { return true; }
}
exports.StartEvent = StartEvent;
//# sourceMappingURL=Events.js.map