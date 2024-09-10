'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var core$1 = require('@angular/core');
var core = require('@ionic-native/core');

var Printer = /** @class */ (function (_super) {
    tslib.__extends(Printer, _super);
    function Printer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Checks whether the device is capable of printing (uses `check()` internally)
     * @returns {Promise<boolean>}
     */
    Printer.prototype.isAvailable = function () {
        return this.check().then(function (res) { return Promise.resolve(res.avail); });
    };
    Printer.prototype.check = function () {
        var _this = this;
        return (function () {
            if (core.checkAvailability(_this) === true) {
                return core.getPromise(function (resolve) {
                    Printer.getPlugin().canPrintItem(function (avail, count) {
                        resolve({ avail: avail, count: count });
                    });
                });
            }
        })();
    };
    Printer.prototype.pick = function () { return core.cordova(this, "pick", {}, arguments); };
    Printer.prototype.print = function (content, options) { return core.cordova(this, "print", { "successIndex": 2, "errorIndex": 4 }, arguments); };
    Printer.pluginName = "Printer";
    Printer.plugin = "cordova-plugin-printer";
    Printer.pluginRef = "cordova.plugins.printer";
    Printer.repo = "https://github.com/katzer/cordova-plugin-printer";
    Printer.platforms = ["Android", "iOS", "Windows"];
    Printer.decorators = [
        { type: core$1.Injectable }
    ];
    return Printer;
}(core.IonicNativePlugin));

exports.Printer = Printer;
