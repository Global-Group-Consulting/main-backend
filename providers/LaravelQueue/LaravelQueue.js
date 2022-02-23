"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.LaravelQueue = exports.JobOptions = exports.QueueOptions = exports.LaravelJob = exports.AvailableJob = void 0;
var mysql_1 = require("mysql");
var lodash_1 = require("lodash");
var php_serialization_1 = require("php-serialization");
var AvailableJob = /** @class */ (function () {
    function AvailableJob() {
    }
    return AvailableJob;
}());
exports.AvailableJob = AvailableJob;
var LaravelJob = /** @class */ (function () {
    function LaravelJob() {
    }
    return LaravelJob;
}());
exports.LaravelJob = LaravelJob;
var QueueOptions = /** @class */ (function () {
    function QueueOptions() {
    }
    return QueueOptions;
}());
exports.QueueOptions = QueueOptions;
var JobOptions = /** @class */ (function () {
    function JobOptions() {
    }
    return JobOptions;
}());
exports.JobOptions = JobOptions;
var LaravelQueue = /** @class */ (function () {
    function LaravelQueue(config) {
        var _this = this;
        this.config = config;
        this.mySqlConnection = (0, mysql_1.createConnection)(config.db);
        this.connectionReady = new Promise(function (resolve, reject) {
            _this.mySqlConnection.connect(function (err) {
                if (err) {
                    reject();
                    throw err;
                }
                console.log("[LARAVEL_QUE] - Module ready!");
                _this.fetchAvailableJobs().then(function () {
                    console.log("[LARAVEL_QUE] - Available jobs fetched!");
                    resolve(true);
                });
            });
        });
    }
    LaravelQueue.prototype.query = function (sql) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this.mySqlConnection.query(sql, function (err, result) {
                            if (err) {
                                return reject(err);
                            }
                            resolve(result);
                        });
                    })];
            });
        });
    };
    LaravelQueue.prototype.fetchAvailableJobs = function () {
        return __awaiter(this, void 0, void 0, function () {
            var sql, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sql = "SELECT *\n                 FROM job_lists";
                        return [4 /*yield*/, this.query(sql)];
                    case 1:
                        result = _a.sent();
                        this.availableJobs = result.map(function (el) {
                            return __assign(__assign({}, el), { name: el["class"].slice(el["class"].lastIndexOf("\\") + 1) });
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    LaravelQueue.prototype.getJob = function (job) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                result = this.availableJobs.find(function (el) { return el.name === job; });
                if (!result) {
                    return [2 /*return*/, Promise.reject("Unknown job: " + job)];
                }
                return [2 /*return*/, Promise.resolve(result)];
            });
        });
    };
    LaravelQueue.prototype.pushTo = function (jobName, payload, options) {
        return __awaiter(this, void 0, void 0, function () {
            var encodedPayload, job, data, sql;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.connectionReady];
                    case 1:
                        _a.sent();
                        encodedPayload = new Buffer(JSON.stringify(payload)).toString('base64');
                        return [4 /*yield*/, this.getJob(jobName)];
                    case 2:
                        job = _a.sent();
                        data = this.prepareData(job, encodedPayload, options);
                        sql = "INSERT INTO jobs (queue, payload, attempts, available_at, created_at)\n                 VALUES ('" + data.queue + "',\n                         " + (0, mysql_1.escape)(data.payload) + ",\n                         " + data.attempts + ",\n                         " + data.available_at + ",\n                         " + data.created_at + ")";
                        return [4 /*yield*/, this.query(sql)];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    LaravelQueue.prototype.prepareData = function (reqJob, payload, options) {
        var _a;
        var mainObj = {
            "uuid": this.generateUUID(),
            "displayName": reqJob["class"],
            "job": "Illuminate\\Queue\\CallQueuedHandler@call",
            "maxTries": null,
            "maxExceptions": null,
            "failOnTimeout": false,
            "backoff": null,
            "timeout": null,
            "retryUntil": null,
            "data": {
                commandName: reqJob["class"],
                command: ""
            }
        };
        var commandObj = (_a = {},
            _a[reqJob.payloadKey] = payload !== null && payload !== void 0 ? payload : {},
            _a["job"] = null,
            _a["connection"] = null,
            _a["queue"] = (options === null || options === void 0 ? void 0 : options.queue) || reqJob.queueName || null,
            _a["chainConnection"] = null,
            _a["chainQueue"] = null,
            _a["chainCatchCallbacks"] = null,
            _a["delay"] = null,
            _a["afterCommit"] = null,
            _a["middleware"] = [],
            _a["chained"] = [],
            _a);
        var job = new php_serialization_1.Class(reqJob["class"]);
        this.prepareForSerialization(commandObj, job, [reqJob.payloadKey], reqJob["class"]);
        mainObj.data.command = (0, php_serialization_1.serialize)(job, "object");
        return {
            queue: (options === null || options === void 0 ? void 0 : options.queue) || reqJob.queueName || "default",
            payload: JSON.stringify(mainObj),
            attempts: 0,
            available_at: Math.floor(Date.now() / 1000),
            created_at: Math.floor(Date.now() / 1000)
        };
    };
    LaravelQueue.prototype.prepareForSerialization = function (data, container, privateKeys, className) {
        var _this = this;
        Object.keys(data).forEach(function (key) {
            var value = data[key];
            var type = "string";
            if (value && value instanceof Array) {
                type = "array";
                value = new php_serialization_1.Class("");
                _this.prepareForSerializationArray(data[key], value);
            }
            else if (value && value.constructor.name === "Object") {
                type = "array";
                value = new php_serialization_1.Class("");
                _this.prepareForSerialization(data[key], value, privateKeys);
            }
            else if (!value) {
                type = "null";
            }
            else if (typeof value === "number") {
                type = "float";
            }
            container.__addAttr__(key, "string", value, type, privateKeys.includes(key) ? "protected" : null);
        });
    };
    LaravelQueue.prototype.prepareForSerializationArray = function (data, container) {
        var _this = this;
        data.forEach(function (el, index) {
            var type = "string";
            var value = el;
            if (el && el.constructor.name === "Object") {
                type = "array";
                value = new php_serialization_1.Class("");
                _this.prepareForSerialization(el, value, []);
            }
            else if (typeof el === "number") {
                type = "float";
            }
            container.__addAttr__(index, "integer", value, type);
        });
    };
    LaravelQueue.prototype.generateUUID = function () {
        var d = (0, lodash_1.now)();
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + (0, lodash_1.random)(16)) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    };
    ;
    return LaravelQueue;
}());
exports.LaravelQueue = LaravelQueue;
/*

const queue = new LaravelQueue()

queue.pushTo("SendEmail", {
  firstName: "Mario",
  lastname: "Rossi",
  test: [
    "pipp", "pluto",
    {
      "oggetto": 11231231232
    }
  ]
}, {
  queue: "club.staging"
});
*/
