/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./app/src/main/electron/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "../mainRouter.build":
/*!******************************************!*\
  !*** external "./main/mainRouter.build" ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("./main/mainRouter.build");

/***/ }),

/***/ "./app/src/main/electron/commonUtils.ts":
/*!**********************************************!*\
  !*** ./app/src/main/electron/commonUtils.ts ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var CommonUtils = /** @class */ (function () {
    function CommonUtils() {
    }
    CommonUtils.prototype.lpad = function (str, len) {
        var strLen = str.length;
        var result = str;
        if (strLen < len) {
            for (var i = 0; i < len - strLen; i++) {
                result = "0" + result;
            }
        }
        return String(result);
    };
    ;
    CommonUtils.prototype.getPaddedVersion = function (version) {
        var _this = this;
        if (!version) {
            return '';
        }
        var versionStr = String(version);
        var padded = [];
        var splitVersion = versionStr.split('.');
        splitVersion.forEach(function (item) {
            padded.push(_this.lpad(item, 4));
        });
        return padded.join('.');
    };
    CommonUtils.prototype.getArgsParseData = function (argv) {
        console.log('argv', argv);
        var arrRoom = /roomId:(.*)/.exec(argv) || ['', ''];
        var roomId = arrRoom[1];
        if (roomId === 'undefined') {
            roomId = '';
        }
        var regexHardwareId = /openHardwareId:([^&]*)/.exec(argv) || ['', ''];
        var openHardwareId = regexHardwareId[1];
        if (openHardwareId === 'undefined') {
            openHardwareId = '';
        }
        return { roomId: roomId.replace(/\//g, ''), openHardwareId: openHardwareId };
    };
    return CommonUtils;
}());
exports.default = new CommonUtils();


/***/ }),

/***/ "./app/src/main/electron/electronDirectoryPaths.ts":
/*!*********************************************************!*\
  !*** ./app/src/main/electron/electronDirectoryPaths.ts ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = __webpack_require__(/*! electron */ "electron");
var path_1 = __importDefault(__webpack_require__(/*! path */ "path"));
var os_1 = __importDefault(__webpack_require__(/*! os */ "os"));
/**
 * electron 디렉토리 이하는 외부 서브모듈로 사용되지 않는다. 그러므로 getAppPath 를 사용할 수 있다.
 */
var isAsarPacked = (function () { return electron_1.app.getAppPath().indexOf('app.asar') > -1; })();
// project's app directory path
// development: /Users/user/entry_projects/entry-hw/app
// production: /Users/user/entry_projects/entry-hw/dist/mac/Entry_HW.app/Contents/Resources/app.asar
var rootAppPath = (function () { return (isAsarPacked
    ? path_1.default.join(electron_1.app.getAppPath(), 'app')
    : path_1.default.join(electron_1.app.getAppPath(), '..')); })();
var isMacOS = os_1.default.type().includes('Darwin');
exports.default = {
    views: path_1.default.join(rootAppPath, 'src', 'views'),
    config: (function () { return (isAsarPacked
        ? path_1.default.join(rootAppPath, '..', '..', 'config')
        : path_1.default.join(rootAppPath, '..', 'config')); })(),
    server: (function () {
        var subDirPath = isMacOS ? 'mac' : 'win';
        var fileName = isMacOS ? 'server.txt' : 'server.exe';
        return isAsarPacked
            ? path_1.default.join(rootAppPath, '..', '..', fileName)
            : path_1.default.join(rootAppPath, 'server', subDirPath, fileName);
    })(),
    validator: (function () {
        if (!isAsarPacked) {
            return undefined;
        }
        else if (isMacOS) {
            return path_1.default.join(rootAppPath, '..', '..', 'validator.txt');
        }
        else {
            return path_1.default.join(rootAppPath, '..', '..', 'validator.exe');
        }
    })(),
};


/***/ }),

/***/ "./app/src/main/electron/functions/checkUpdate.ts":
/*!********************************************************!*\
  !*** ./app/src/main/electron/functions/checkUpdate.ts ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = __webpack_require__(/*! electron */ "electron");
var createLogger_1 = __importDefault(__webpack_require__(/*! ./createLogger */ "./app/src/main/electron/functions/createLogger.ts"));
var logger = createLogger_1.default('CheckUpdate');
exports.default = (function () { return new Promise(function (resolve, reject) {
    var _a = global.sharedObject, updateCheckUrl = _a.updateCheckUrl, hardwareVersion = _a.hardwareVersion;
    var request = electron_1.net.request({
        method: 'POST',
        url: updateCheckUrl,
    });
    var params = {
        category: 'hardware',
        version: hardwareVersion,
    };
    request.setHeader('content-type', 'application/json; charset=utf-8');
    request.write(JSON.stringify(params));
    logger.info("entry hw version check.. " + JSON.stringify(__assign({ url: updateCheckUrl, method: 'POST', contentType: 'application/json; charset=utf-8' }, params)));
    request.on('response', function (response) {
        var buffer = '';
        response.on('error', reject);
        response.on('data', function (chunk) {
            buffer += chunk.toString();
        });
        response.on('end', function () {
            var data = {};
            try {
                data = JSON.parse(buffer);
                data.currentVersion = hardwareVersion;
                logger.info("result: " + JSON.stringify(data));
            }
            catch (e) {
                // nothing to do
            }
            finally {
                resolve(data);
            }
        });
    });
    request.on('error', reject);
    request.end();
}); });


/***/ }),

/***/ "./app/src/main/electron/functions/configInitialize.ts":
/*!*************************************************************!*\
  !*** ./app/src/main/electron/functions/configInitialize.ts ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var package_json_1 = __importDefault(__webpack_require__(/*! ../../../../../package.json */ "./package.json"));
var lodash_1 = __webpack_require__(/*! lodash */ "lodash");
var path_1 = __importDefault(__webpack_require__(/*! path */ "path"));
var fs_1 = __importDefault(__webpack_require__(/*! fs */ "fs"));
var createLogger_1 = __importDefault(__webpack_require__(/*! ./createLogger */ "./app/src/main/electron/functions/createLogger.ts"));
var electronDirectoryPaths_1 = __importDefault(__webpack_require__(/*! ../electronDirectoryPaths */ "./app/src/main/electron/electronDirectoryPaths.ts"));
var electron_1 = __webpack_require__(/*! electron */ "electron");
var logger = createLogger_1.default('ConfigInitialize');
/**
 * 외부 config 파일이 존재하지 않는 경우의 기본값.
 * 아래 로직상 여기에 없는 키는 적용되지 않는다.
 */
var defaultConfigSchema = {
    updateCheckUrl: 'https://playentry.org/api/checkVersion',
    moduleResourceUrl: 'https://playentry.org/modules',
};
/**
 * 외부 설정이 아닌 내부에서 정의되며, 변경될 여지가 없는 하드코드의 경우 이쪽에 선언한다.
 */
var internalConfig = {
    appName: 'hardware',
    hardwareVersion: package_json_1.default.version,
    roomIds: [],
};
// target 에 있는 키만 병합한다.
function mergeExistProperties(target, src) {
    var result = target;
    lodash_1.forEach(src, function (value, key) {
        if (result[key] !== undefined) {
            result[key] = value;
        }
    });
    return result;
}
function getFileConfig(configName) {
    if (configName === void 0) { configName = 'entry'; }
    var getMergedConfig = function (target) { return mergeExistProperties(defaultConfigSchema, target); };
    var configFilePath = path_1.default.resolve(electronDirectoryPaths_1.default.config, "config." + configName + ".json");
    logger.info("load configuration file " + configFilePath + "...");
    var fileData = fs_1.default.readFileSync(configFilePath);
    return getMergedConfig(JSON.parse(fileData));
}
exports.default = (function (cmdConfig) {
    var _a = cmdConfig.config, config = _a === void 0 ? 'entry' : _a, lang = cmdConfig.lang;
    var externalConfig = getFileConfig(config);
    var locale = (lang || externalConfig.language || electron_1.app.getLocale()).substr(0, 2);
    if (locale === 'ja') {
        locale = 'jp';
    }
    var mergedConfig = lodash_1.merge({}, internalConfig, { language: locale }, externalConfig);
    logger.info('configuration applied');
    logger.verbose(lodash_1.reduce(lodash_1.toPairs(mergedConfig), function (result, _a) {
        var key = _a[0], value = _a[1];
        return result + "\n" + key + ": " + value;
    }, 'configuration properties is..'));
    global && (global.sharedObject = mergedConfig);
    return mergedConfig;
});


/***/ }),

/***/ "./app/src/main/electron/functions/createLogger.ts":
/*!*********************************************************!*\
  !*** ./app/src/main/electron/functions/createLogger.ts ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logPath = void 0;
var winston_1 = __webpack_require__(/*! winston */ "winston");
var electron_1 = __webpack_require__(/*! electron */ "electron");
var winston_daily_rotate_file_1 = __importDefault(__webpack_require__(/*! winston-daily-rotate-file */ "winston-daily-rotate-file"));
var path_1 = __importDefault(__webpack_require__(/*! path */ "path"));
var combine = winston_1.format.combine, timestamp = winston_1.format.timestamp, printf = winston_1.format.printf;
var _logPath = path_1.default.join(electron_1.app.getPath('appData'), 'entry-hw', 'logs');
var logger = winston_1.createLogger({
    level: 'verbose',
    format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), printf(function (_a) {
        var level = _a.level, message = _a.message, label = _a.label, timestamp = _a.timestamp;
        return "[" + label + "][" + level + "][" + timestamp + "]: " + message;
    })),
    transports: [
        new winston_1.transports.Console(),
    ],
    exitOnError: false,
});
if (false) {}
exports.logPath = _logPath;
exports.default = (function (labelName) { return logger.child({ label: labelName }); });


/***/ }),

/***/ "./app/src/main/electron/functions/parseCommandLine.ts":
/*!*************************************************************!*\
  !*** ./app/src/main/electron/functions/parseCommandLine.ts ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var createLogger_1 = __importDefault(__webpack_require__(/*! ./createLogger */ "./app/src/main/electron/functions/createLogger.ts"));
var lodash_1 = __webpack_require__(/*! lodash */ "lodash");
var logger = createLogger_1.default('ParseCommandLine');
var properties = {
    flag: [
        ['debug', 'd'],
    ],
    pair: [
        ['config', 'c'],
        ['lang', 'l'],
    ],
};
var result = {};
function parseFlags(key) {
    for (var i = 0; i < properties.flag.length; i++) {
        var _a = properties.flag[i], fullName = _a[0], alias = _a[1];
        if ("--" + fullName === key || "-" + alias === key) {
            result[fullName] = true;
            return;
        }
    }
}
function parsePair(key, value) {
    if (!value) {
        return;
    }
    for (var i = 0; i < properties.pair.length; i++) {
        var _a = properties.pair[i], fullName = _a[0], alias = _a[1];
        if ("--" + fullName === key || "-" + alias === key) {
            result[fullName] = value;
            return;
        }
    }
}
exports.default = (function (argv) {
    result = {};
    for (var i = 0; i < argv.length; i++) {
        var _a = argv[i].split('='), key = _a[0], value = _a[1];
        parseFlags(key);
        parsePair(key, value);
    }
    logger.info(lodash_1.reduce(lodash_1.toPairs(result), function (result, _a) {
        var key = _a[0], value = _a[1];
        return result + "\n" + key + ": " + value;
    }, 'parsed commandLine config is..'));
    return result;
});


/***/ }),

/***/ "./app/src/main/electron/functions/registerGlobalShortcut.ts":
/*!*******************************************************************!*\
  !*** ./app/src/main/electron/functions/registerGlobalShortcut.ts ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = __webpack_require__(/*! electron */ "electron");
exports.default = (function () {
    var inspectorShortcut;
    if (process.platform === 'darwin') {
        inspectorShortcut = 'Command+Alt+i';
    }
    else {
        inspectorShortcut = 'Control+Shift+i';
    }
    electron_1.globalShortcut.register(inspectorShortcut, function () {
        var content = electron_1.webContents.getFocusedWebContents();
        if (content) {
            content.isDevToolsOpened() ? content.closeDevTools() : content.openDevTools();
        }
    });
});


/***/ }),

/***/ "./app/src/main/electron/index.ts":
/*!****************************************!*\
  !*** ./app/src/main/electron/index.ts ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = __webpack_require__(/*! electron */ "electron");
var path_1 = __importDefault(__webpack_require__(/*! path */ "path"));
var fs_1 = __importDefault(__webpack_require__(/*! fs */ "fs"));
var serverProcessManager_1 = __importDefault(__webpack_require__(/*! ./serverProcessManager */ "./app/src/main/electron/serverProcessManager.ts"));
var windowManager_1 = __importDefault(__webpack_require__(/*! ./windowManager */ "./app/src/main/electron/windowManager.ts"));
var commonUtils_1 = __importDefault(__webpack_require__(/*! ./commonUtils */ "./app/src/main/electron/commonUtils.ts"));
// functions
var parseCommandLine_1 = __importDefault(__webpack_require__(/*! ./functions/parseCommandLine */ "./app/src/main/electron/functions/parseCommandLine.ts"));
var configInitialize_1 = __importDefault(__webpack_require__(/*! ./functions/configInitialize */ "./app/src/main/electron/functions/configInitialize.ts"));
var registerGlobalShortcut_1 = __importDefault(__webpack_require__(/*! ./functions/registerGlobalShortcut */ "./app/src/main/electron/functions/registerGlobalShortcut.ts"));
var checkUpdate_1 = __importDefault(__webpack_require__(/*! ./functions/checkUpdate */ "./app/src/main/electron/functions/checkUpdate.ts"));
var mainRouter_build_1 = __importDefault(__webpack_require__(/*! ../mainRouter.build */ "../mainRouter.build"));
var createLogger_1 = __importDefault(__webpack_require__(/*! ./functions/createLogger */ "./app/src/main/electron/functions/createLogger.ts"));
var logger = createLogger_1.default('electron/index.ts');
var mainWindow = undefined;
var mainRouter = null;
var entryServer = null;
var autoOpenHardwareId = '';
var roomIds = [];
if (!electron_1.app.requestSingleInstanceLock()) {
    logger.verbose('App is already running');
    electron_1.app.quit();
    process.exit(0);
}
else {
    logger.info('Entry HW started.');
    electron_1.app.on('window-all-closed', function () {
        electron_1.app.quit();
    });
    electron_1.app.on('open-url', function (event, url) {
        var openHardwareId = commonUtils_1.default.getArgsParseData(url).openHardwareId;
        setTimeout(function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!mainRouter) return [3 /*break*/, 2];
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 500); })];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 0];
                    case 2:
                        mainRouter.selectHardware(openHardwareId);
                        return [2 /*return*/];
                }
            });
        }); }, 1000);
    });
    // 어플리케이션을 중복 실행했습니다. 주 어플리케이션 인스턴스를 활성화 합니다.
    electron_1.app.on('second-instance', function (event, argv, workingDirectory) {
        var parseData = {
            roomId: '',
            openHardwareId: '',
        };
        var entryHwCustomSchema = argv.find(function (arg) { return arg.indexOf('entryhw:') > -1; });
        if (entryHwCustomSchema) {
            parseData = commonUtils_1.default.getArgsParseData(entryHwCustomSchema);
        }
        if (mainWindow) {
            logger.verbose('[second-instance] mainWindow restored');
            if (mainWindow.isMinimized()) {
                mainWindow.restore();
            }
            mainWindow.focus();
            if (mainWindow.webContents && parseData) {
                var roomId = parseData.roomId, openHardwareId = parseData.openHardwareId;
                if (roomIds.indexOf(roomId) === -1) {
                    logger.info("[second-instance] roomId " + roomId + " pushed");
                    roomIds.push(roomId);
                }
                mainRouter.addRoomId(roomId);
                if (openHardwareId) {
                    mainRouter.selectHardware(openHardwareId);
                }
            }
        }
    });
    electron_1.ipcMain.on('reload', function () {
        logger.info('Entry HW reload.');
        entryServer.close();
        electron_1.app.relaunch();
        electron_1.app.exit(0);
    });
    electron_1.app.commandLine.appendSwitch('enable-experimental-web-platform-features', 'true');
    electron_1.app.commandLine.appendSwitch('disable-renderer-backgrounding');
    electron_1.app.commandLine.appendSwitch('enable-web-bluetooth');
    electron_1.app.setAsDefaultProtocolClient('entryhw');
    electron_1.app.once('ready', function () {
        electron_1.Menu.setApplicationMenu(null);
        var argv = process.argv.slice(1);
        var commandLineOptions = parseCommandLine_1.default(argv);
        var configuration = configInitialize_1.default(commandLineOptions);
        var configRoomIds = configuration.roomIds;
        roomIds = configRoomIds || [];
        var customSchemaArgvIndex = argv.indexOf('entryhw:');
        if (customSchemaArgvIndex > -1) {
            var _a = commonUtils_1.default.getArgsParseData(argv[customSchemaArgvIndex]), roomId = _a.roomId, openHardwareId = _a.openHardwareId;
            if (roomId) {
                logger.info("roomId " + roomId + " detected");
                roomIds.push(roomId);
            }
            if (openHardwareId) {
                autoOpenHardwareId = openHardwareId;
            }
        }
        windowManager_1.default.createMainWindow({ debug: commandLineOptions.debug });
        mainWindow = windowManager_1.default.mainWindow;
        windowManager_1.default.createAboutWindow(mainWindow);
        registerGlobalShortcut_1.default();
        entryServer = new serverProcessManager_1.default();
        // @ts-ignore
        mainRouter = new mainRouter_build_1.default(mainWindow, entryServer, {
            rootAppPath:  false && false,
        });
        if (autoOpenHardwareId) {
            setTimeout(function () {
                mainRouter.selectHardware(autoOpenHardwareId);
            }, 1000);
        }
    });
    electron_1.ipcMain.on('hardwareForceClose', function () {
        windowManager_1.default.mainWindowCloseConfirmed = true;
        mainWindow === null || mainWindow === void 0 ? void 0 : mainWindow.close();
    });
    electron_1.ipcMain.on('closeAboutWindow', function () {
        windowManager_1.default.aboutWindow && windowManager_1.default.aboutWindow.hide();
    });
    electron_1.ipcMain.on('showMessageBox', function (e, msg) {
        electron_1.dialog.showMessageBoxSync({
            type: 'none',
            message: msg,
            detail: msg,
        });
    });
    electron_1.ipcMain.on('openAboutWindow', function () {
        windowManager_1.default.aboutWindow && windowManager_1.default.aboutWindow.show();
    });
    electron_1.ipcMain.handle('checkUpdate', function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, checkUpdate_1.default()];
            case 1: return [2 /*return*/, _a.sent()];
        }
    }); }); });
    electron_1.ipcMain.handle('getOpenSourceText', function () { return __awaiter(void 0, void 0, void 0, function () {
        var openSourceFile;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    openSourceFile = path_1.default.resolve(__dirname, '..', 'OPENSOURCE.md');
                    return [4 /*yield*/, fs_1.default.promises.readFile(openSourceFile, 'utf8')];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); });
}
process.on('uncaughtException', function (error) {
    var whichButtonClicked = electron_1.dialog.showMessageBoxSync({
        type: 'error',
        title: 'Unexpected Error',
        message: 'Unexpected Error',
        detail: error.toString(),
        buttons: ['ignore', 'exit'],
    });
    logger.error('Entry HW uncaughtException occurred', error.message, error.stack);
    if (whichButtonClicked === 1) {
        process.exit(-1);
    }
});


/***/ }),

/***/ "./app/src/main/electron/serverProcessManager.ts":
/*!*******************************************************!*\
  !*** ./app/src/main/electron/serverProcessManager.ts ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var cross_spawn_1 = __importDefault(__webpack_require__(/*! cross-spawn */ "cross-spawn"));
var fs_1 = __importDefault(__webpack_require__(/*! fs */ "fs"));
var createLogger_1 = __importDefault(__webpack_require__(/*! ./functions/createLogger */ "./app/src/main/electron/functions/createLogger.ts"));
var electronDirectoryPaths_1 = __importDefault(__webpack_require__(/*! ./electronDirectoryPaths */ "./app/src/main/electron/electronDirectoryPaths.ts"));
var logger = createLogger_1.default('electron/server');
var ServerProcessManager = /** @class */ (function () {
    function ServerProcessManager(router) {
        try {
            // this.childProcess = new Server();
            var serverBinaryPath = electronDirectoryPaths_1.default.server;
            logger.info("EntryServer try to spawn.. " + serverBinaryPath);
            fs_1.default.accessSync(serverBinaryPath);
            this.childProcess = cross_spawn_1.default(serverBinaryPath, [], {
                stdio: ['ignore', 'inherit', 'inherit', 'ipc'],
                detached: true,
            });
            logger.info('EntryServer spawned successfully');
            this.router = router;
        }
        catch (e) {
            logger.error('Error occurred while spawn Server Process.', e);
            throw new Error('Error occurred while spawn Server Process. make sure it exists same dir path');
        }
    }
    ServerProcessManager.prototype.setRouter = function (router) {
        this.router = router;
    };
    ServerProcessManager.prototype.open = function () {
        this._receiveFromChildEventRegister();
        this._sendToChild('open');
        // this.childProcess.open();
    };
    ServerProcessManager.prototype.close = function () {
        this.childProcess && this.childProcess.kill();
    };
    ServerProcessManager.prototype.addRoomIdsOnSecondInstance = function (roomId) {
        // this.childProcess.addRoomId(roomId);
        this.currentRoomId = roomId;
        this._sendToChild('addRoomId', roomId);
    };
    ServerProcessManager.prototype.disconnectHardware = function () {
        // this.childProcess.disconnectHardware();
        this._sendToChild('disconnectHardware');
    };
    ServerProcessManager.prototype.send = function (data) {
        // this.childProcess.sendToClient(data);
        this._sendToChild('send', data);
    };
    /**
     * @param methodName{string}
     * @param message{Object?}
     * @private
     */
    ServerProcessManager.prototype._sendToChild = function (methodName, message) {
        this._isProcessLive() && this.childProcess.send({
            key: methodName,
            value: message,
        });
    };
    ServerProcessManager.prototype._receiveFromChildEventRegister = function () {
        // this.childProcess.on('cloudModeChanged', (mode) => {
        //     this.router.notifyCloudModeChanged(mode);
        // });
        // this.childProcess.on('runningModeChanged', (mode) => {
        //     this.router.notifyServerRunningModeChanged(mode);
        // });
        // this.childProcess.on('message', (message) => {
        //     this.router.handleServerData(message);
        // });
        // this.childProcess.on('close', () => {
        var _this = this;
        // });
        this.childProcess && this.childProcess.on('message', function (message) {
            var key = message.key, value = message.value;
            switch (key) {
                case 'cloudModeChanged': {
                    _this.router.notifyCloudModeChanged(value);
                    break;
                }
                case 'runningModeChanged': {
                    _this.router.notifyServerRunningModeChanged(value);
                    break;
                }
                case 'data': {
                    _this.router.handleServerData(value);
                    break;
                }
                case 'connection': {
                    _this.router.handleServerSocketConnected();
                    break;
                }
                case 'close': {
                    if (!_this.currentRoomId || _this.currentRoomId === value) {
                        _this.router.handleServerSocketClosed();
                    }
                    break;
                }
                default: {
                    console.error('unhandled pkg server message', key, value);
                }
            }
        });
    };
    ServerProcessManager.prototype._isProcessLive = function () {
        return this.childProcess &&
            !this.childProcess.killed &&
            this.childProcess.connected &&
            this.childProcess.channel;
    };
    return ServerProcessManager;
}());
exports.default = ServerProcessManager;


/***/ }),

/***/ "./app/src/main/electron/windowManager.ts":
/*!************************************************!*\
  !*** ./app/src/main/electron/windowManager.ts ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = __webpack_require__(/*! electron */ "electron");
var path_1 = __importDefault(__webpack_require__(/*! path */ "path"));
var createLogger_1 = __importDefault(__webpack_require__(/*! ./functions/createLogger */ "./app/src/main/electron/functions/createLogger.ts"));
var electronDirectoryPaths_1 = __importDefault(__webpack_require__(/*! ./electronDirectoryPaths */ "./app/src/main/electron/electronDirectoryPaths.ts"));
var viewDirectoryPath = electronDirectoryPaths_1.default.views;
var logger = createLogger_1.default('electron/windowManager.ts');
exports.default = new (/** @class */ (function () {
    function class_1() {
        /*
        하드웨어 메인 윈도우는 하드웨어 연결중인 경우는 꺼지지 않도록 기획되었다.
        그러므로 close native event 가 발생했을 때, 렌더러에 다시 물어본 후
        해당 값을 세팅 한 뒤 다시 close 를 호출 하는 식으로 종료한다.
         */
        this.mainWindowCloseConfirmed = false;
        this.aboutWindow = undefined;
        this.mainWindow = undefined;
    }
    class_1.prototype.createAboutWindow = function (parent) {
        var _this = this;
        logger.verbose('about window created');
        this.aboutWindow = new electron_1.BrowserWindow({
            parent: parent,
            width: 380,
            height: 290,
            resizable: false,
            movable: false,
            center: true,
            frame: false,
            modal: true,
            show: false,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
                preload: path_1.default.join(viewDirectoryPath, '..', 'preload', 'preload.bundle.js'),
            },
        });
        this.aboutWindow.loadURL("file:///" + path_1.default.resolve(viewDirectoryPath, 'about.html'));
        this.aboutWindow.on('closed', function () {
            _this.aboutWindow = undefined;
        });
    };
    class_1.prototype.createMainWindow = function (_a) {
        var _this = this;
        var debug = _a.debug;
        var _b = global.sharedObject, hardwareVersion = _b.hardwareVersion, language = _b.language;
        var title = language === 'ko' ? '엔트리 하드웨어 v' : 'Entry Hardware v';
        this.mainWindow = new electron_1.BrowserWindow({
            width: 800,
            height: 670,
            minWidth: 420,
            title: title + hardwareVersion,
            webPreferences: {
                backgroundThrottling: false,
                nodeIntegration: false,
                contextIsolation: false,
                preload: path_1.default.join(viewDirectoryPath, '..', 'preload', 'preload.bundle.js'),
            },
        });
        this.mainWindow.loadURL("file:///" + path_1.default.resolve(viewDirectoryPath, 'index.html'));
        if (debug) {
            this.mainWindow.webContents.openDevTools();
        }
        this.mainWindow.setMenu(null);
        this.mainWindow.on('close', function (e) {
            var _a;
            if (!_this.mainWindowCloseConfirmed) {
                e.preventDefault();
                logger.verbose('EntryHW close rejected. confirm connection close');
                (_a = _this.mainWindow) === null || _a === void 0 ? void 0 : _a.webContents.send('hardwareCloseConfirm');
            }
        });
        this.mainWindow.on('closed', function () {
            _this.mainWindow = undefined;
        });
        logger.verbose("main window created. title: " + (title + hardwareVersion));
    };
    return class_1;
}()))();


/***/ }),

/***/ "./package.json":
/*!**********************!*\
  !*** ./package.json ***!
  \**********************/
/*! exports provided: name, version, description, author, main, scripts, devDependencies, dependencies, default */
/***/ (function(module) {

module.exports = JSON.parse("{\"name\":\"entry-hw\",\"version\":\"1.9.52\",\"description\":\"엔트리 하드웨어 연결 프로그램\",\"author\":\"EntryLabs\",\"main\":\"./app/src/index.bundle.js\",\"scripts\":{\"start\":\"cross-env NODE_ENV=development electron -r source-map-support/register app/src/index.bundle.js --openssl-legacy-provider unset NODE_OPTIONS\",\"start:prod\":\"cross-env NODE_ENV=production electron -r source-map-support/register app/src/index.bundle.js\",\"debug\":\"cross-env NODE_ENV=development electron -r source-map-support/register --inspect app/src/index.bundle.js\",\"test\":\"cross-env NODE_NO_WARNINGS=1 ts-node --files ./cli/connectionTest.ts\",\"script:create\":\"node ./cli/createJson.js\",\"script:resize\":\"node cli/imageResize.js\",\"webpack:dev\":\"cross-env NODE_ENV=development webpack --openssl-legacy-provider\",\"webpack:prod\":\"cross-env NODE_ENV=production webpack\",\"webpack:watch\":\"cross-env NODE_ENV=development webpack -w\",\"update:licence\":\"lcdoc make -o app/OPENSOURCE.md -d 1\",\"dist:win32\":\"cross-env BUILD_MODE=STANDALONE npm run webpack:prod && electron-builder --win --ia32\",\"dist:mac:notarize\":\"cross-env BUILD_MODE=STANDALONE npm run webpack:prod && cross-env NOTARIZE=true CSC_NAME=\\\"Connect Foundation (DLFUSDA3L5)\\\" electron-builder\",\"dist:mac\":\"cross-env BUILD_MODE=STANDALONE npm run webpack:prod && cross-env NOTARIZE=false CSC_NAME=\\\"Connect Foundation (DLFUSDA3L5)\\\" electron-builder\",\"dist:offline\":\"cross-env BUILD_MODE=OFFLINE npm run webpack:prod\",\"rebuild\":\"electron-rebuild -f -w serialport,node-hid\",\"setting\":\"yarn rebuild && yarn webpack:dev\"},\"devDependencies\":{\"@types/cross-spawn\":\"^6.0.1\",\"@types/fs-extra\":\"^8.0.1\",\"@types/inquirer\":\"^6.5.0\",\"@types/lodash\":\"^4.14.149\",\"@types/node-hid\":\"^0.7.3\",\"@types/react\":\"^16.9.9\",\"@types/react-dom\":\"^16.9.2\",\"@types/react-redux\":\"^7.1.5\",\"@types/react-transition-group\":\"^4.2.3\",\"@types/rimraf\":\"^2.0.3\",\"@types/semver\":\"^7.1.0\",\"@types/serialport\":\"^8.0.0\",\"@types/styled-components\":\"^4.1.19\",\"@types/tar\":\"^4.0.3\",\"@types/web-bluetooth\":\"^0.0.5\",\"@typescript-eslint/eslint-plugin\":\"^3.1.0\",\"@typescript-eslint/parser\":\"^3.1.0\",\"babel-eslint\":\"^10.0.3\",\"clean-webpack-plugin\":\"^3.0.0\",\"cross-env\":\"^5.1.3\",\"electron\":\"12.0.2\",\"electron-builder\":\"^22.8.0\",\"electron-notarize\":\"^0.2.1\",\"electron-rebuild\":\"3.2.9\",\"eslint\":\"^6.8.0\",\"file-loader\":\"^5.0.2\",\"immer\":\"^4.0.2\",\"inquirer\":\"^7.0.3\",\"lcdoc\":\"^0.0.2\",\"react\":\"^16.10.2\",\"react-cli\":\"^0.3.1\",\"react-dom\":\"^16.10.2\",\"react-redux\":\"^7.1.1\",\"react-transition-group\":\"^4.3.0\",\"redux\":\"^4.0.4\",\"sharp\":\"^0.30.1\",\"source-map-support\":\"^0.5.19\",\"styled-components\":\"^4.4.0\",\"ts-loader\":\"^7.0.5\",\"ts-node\":\"^8.10.2\",\"typescript\":\"^3.9.5\",\"webpack\":\"^4.43.0\",\"webpack-cli\":\"^3.3.11\",\"webpack-merge\":\"^4.2.2\"},\"dependencies\":{\"cross-spawn\":\"^7.0.0\",\"fs-extra\":\"^8.1.0\",\"lodash\":\"^4.17.19\",\"node-hid\":\"2.1.1\",\"rimraf\":\"^3.0.2\",\"semver\":\"^7.1.1\",\"serialport\":\"9.0.7\",\"socket.io\":\"^2.2.0\",\"socket.io-client\":\"^2.2.0\",\"tar\":\"^6.0.1\",\"winston\":\"^3.2.1\",\"winston-daily-rotate-file\":\"^4.4.2\"}}");

/***/ }),

/***/ "cross-spawn":
/*!******************************!*\
  !*** external "cross-spawn" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("cross-spawn");

/***/ }),

/***/ "electron":
/*!***************************!*\
  !*** external "electron" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("electron");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),

/***/ "lodash":
/*!*************************!*\
  !*** external "lodash" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("lodash");

/***/ }),

/***/ "os":
/*!*********************!*\
  !*** external "os" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("os");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),

/***/ "winston":
/*!**************************!*\
  !*** external "winston" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("winston");

/***/ }),

/***/ "winston-daily-rotate-file":
/*!********************************************!*\
  !*** external "winston-daily-rotate-file" ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("winston-daily-rotate-file");

/***/ })

/******/ });
//# sourceMappingURL=index.bundle.js.map