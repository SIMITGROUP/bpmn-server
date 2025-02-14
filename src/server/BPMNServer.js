"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BPMNServer = void 0;
const Logger_1 = require("../common/Logger");
const Engine_1 = require("./Engine");
const Cron_1 = require("./Cron");
const events_1 = require("events");
process.on('uncaughtException', function (err) {
    console.log('***************BPMNServer UNCAUGHT ERROR***********', err);
    BPMNServer.getInstance().error = err;
    return;
});
const fs = require('fs');
/**
 *	The main class of Server Layer
 *	provides the full functionalities:
 *
 *		at start of the app:
 *			new BPMNServer(configuration,options);
 *
 *		after that point:
 *
 *			BPMNServer.engine.start(...)
 *			BPMNServer.engine.invoke(...)
 *			BPMNServer.dataStore.findInstances(...)
 *			BPMNServer.dataStore.findItems(...)
 */
class BPMNServer {
    /**
     * Server Constructor
     *
     * @param configuration	see
     * @param logger
     */
    constructor(configuration, logger, options = {}) {
        if (logger == null) {
            logger = new Logger_1.Logger({});
        }
        this.listener = new events_1.EventEmitter();
        this.logger = logger;
        this.configuration = configuration;
        this.cron = new Cron_1.Cron(this);
        this.engine = new Engine_1.Engine(this);
        this.cache = configuration.cacheManager(this);
        this.dataStore = configuration.dataStore(this);
        this.definitions = configuration.definitions(this);
        this.appDelegate = configuration.appDelegate(this);
        BPMNServer.instance = this;
        this.appDelegate.startUp(options);
        if (options['cron'] == false) {
            return;
        }
        else {
            this.cron.start();
        }
    }
    static getVersion() {
        const configPath = __dirname + '/../../package.json';
        if (fs.existsSync(configPath)) {
            var configuration = JSON.parse(fs.readFileSync(configPath, 'utf8'));
            var _version = configuration['version'];
            return _version;
        }
        else
            return 'cannot locate package.json current: ' + __dirname + ' path ' + configPath;
    }
    static get engine() {
        return BPMNServer.getInstance().engine;
    }
    static getInstance() {
        if (!BPMNServer.instance) {
            throw Error("BPMN Server Not initialized");
        }
        return BPMNServer.instance;
    }
}
exports.BPMNServer = BPMNServer;
//# sourceMappingURL=BPMNServer.js.map