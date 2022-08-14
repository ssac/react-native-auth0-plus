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
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var auth0_1 = require("../enums/auth0");
var default_1 = /** @class */ (function () {
    function default_1(clientId, domain) {
        this.clientId = clientId;
        this.domain = domain;
    }
    default_1.prototype.querySmsAuthenticators = function (_a) {
        var mfa_token = _a.mfa_token;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                return [2 /*return*/, this.queryAuthenticators({
                        mfa_token: mfa_token,
                        oob_channel: auth0_1.OobChannel.sms,
                        authenticator_type: auth0_1.AuthenticatorType.oob,
                    })];
            });
        });
    };
    default_1.prototype.queryEmailAuthenticators = function (_a) {
        var mfa_token = _a.mfa_token;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                return [2 /*return*/, this.queryAuthenticators({
                        mfa_token: mfa_token,
                        oob_channel: auth0_1.OobChannel.email,
                        authenticator_type: auth0_1.AuthenticatorType.oob,
                    })];
            });
        });
    };
    /**
     * List all authenticators of a client.
     * @param {String} mfa_token: The MFA token responsed from Auth0 from last `mfa_required` error.
     * @param {String} oob_channel: (Optional) Which OOB channel of query authenticators should be filtered.
     * @param {String} authenticator_type: (Optional) Which authenticator type of query authenticators should be filtered.
     * @returns The suitable authenticators
     */
    default_1.prototype.queryAuthenticators = function (_a) {
        var mfa_token = _a.mfa_token, oob_channel = _a.oob_channel, authenticator_type = _a.authenticator_type;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                return [2 /*return*/, axios_1.default
                        .get("https://".concat(this.domain, "/mfa/authenticators"), {
                        headers: {
                            authorization: "Bearer ".concat(mfa_token),
                            'content-type': 'application/json',
                        },
                    })
                        .then(function (resp) {
                        var data = resp.data;
                        var result = [];
                        for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
                            var item = data_1[_i];
                            if (!item.active) {
                                continue;
                            }
                            if (!!authenticator_type && item.authenticator_type !== authenticator_type) {
                                continue;
                            }
                            if (!!oob_channel && item.oob_channel !== oob_channel) {
                                continue;
                            }
                            result.push(item);
                        }
                        return result;
                    })];
            });
        });
    };
    /**
     * Associate user and his phone number.
     * @param {String} mfa_token: The token get from last `mfa_required` error.
     * @param {String} phone_number: The phone number of client used to receive sms code.
     * @returns {String} The OOB Code will be to attached to next confirmation request.
     */
    default_1.prototype.associatePhone = function (_a) {
        var mfa_token = _a.mfa_token, phone_number = _a.phone_number;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                return [2 /*return*/, this.associate({
                        mfa_token: mfa_token,
                        phone_number: phone_number,
                        authenticator_types: [auth0_1.AuthenticatorType.oob],
                        oob_channels: [auth0_1.OobChannel.sms],
                    })];
            });
        });
    };
    default_1.prototype.associateEmail = function (_a) {
        var mfa_token = _a.mfa_token, email = _a.email;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                return [2 /*return*/, this.associate({
                        mfa_token: mfa_token,
                        email: email,
                        authenticator_types: [auth0_1.AuthenticatorType.oob],
                        oob_channels: [auth0_1.OobChannel.email],
                    })];
            });
        });
    };
    /**
     *
     * @param {String} mfa_token: The token get from last `mfa_required` error.
     * @param {String} phone_number: (Optional) The phone number of client used to receive sms code, required only for sms authenticator.
     * @param {Array} oob_channels: List of OOB channel, e.g. sms, voice.
     * @param {Array} authenticator_types: List of authenticator types, e.g. oob, otp.
     * @returns General associate response data of auth0.
     */
    default_1.prototype.associate = function (_a) {
        var mfa_token = _a.mfa_token, phone_number = _a.phone_number, email = _a.email, oob_channels = _a.oob_channels, authenticator_types = _a.authenticator_types;
        return __awaiter(this, void 0, void 0, function () {
            var options;
            return __generator(this, function (_b) {
                options = {
                    method: 'POST',
                    url: "https://".concat(this.domain, "/mfa/associate"),
                    headers: {
                        authorization: "Bearer ".concat(mfa_token),
                        'content-type': 'application/json',
                    },
                    data: __assign(__assign({ authenticator_types: authenticator_types, oob_channels: oob_channels }, (phone_number ? { phone_number: phone_number } : null)), (email ? { email: email } : null)),
                };
                return [2 /*return*/, axios_1.default.request(options).then(function (response) {
                        return response.data;
                    })];
            });
        });
    };
    /**
     * Send a challenge with user's phone sms
     * @param {String} authenticator_id: The authenticator id of sms authenticator.
     * @param {String} mfa_token: The MFA token from last `mfa_required` error.
     * @returns {String} OOB Code that needed to pass to next authentication request.
     */
    default_1.prototype.challengeOob = function (_a) {
        var authenticator_id = _a.authenticator_id, mfa_token = _a.mfa_token;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                return [2 /*return*/, this.challenge({
                        authenticator_id: authenticator_id,
                        mfa_token: mfa_token,
                        challenge_type: auth0_1.AuthenticatorType.oob,
                    }).then(function (respData) {
                        return respData.oob_code;
                    })];
            });
        });
    };
    /**
     * General chellenge function to send challenge to auth0 server.
     * @param {String} authenticator_id: The authenticator id of sms authenticator.
     * @param {String} mfa_token: The MFA token from last `mfa_required` error.
     * @param {String} challenge_type: Challenge Type, 'oob' or 'otp'
     * @returns General challenge response data from Auth0 server.
     */
    default_1.prototype.challenge = function (_a) {
        var authenticator_id = _a.authenticator_id, mfa_token = _a.mfa_token, challenge_type = _a.challenge_type;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                return [2 /*return*/, axios_1.default
                        .post("https://".concat(this.domain, "/mfa/challenge"), {
                        client_id: this.clientId,
                        challenge_type: challenge_type,
                        authenticator_id: authenticator_id,
                        mfa_token: mfa_token,
                    })
                        .then(function (resp) { return resp.data; })];
            });
        });
    };
    default_1.prototype.confirmOobChallenge = function (_a) {
        var mfa_token = _a.mfa_token, oob_code = _a.oob_code, binding_code = _a.binding_code;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                return [2 /*return*/, axios_1.default
                        .post("https://".concat(this.domain, "/oauth/token"), {
                        grant_type: 'http://auth0.com/oauth/grant-type/mfa-oob',
                        client_id: this.clientId,
                        mfa_token: mfa_token,
                        oob_code: oob_code,
                        binding_code: binding_code,
                    })
                        .then(function (response) {
                        return response.data;
                    })];
            });
        });
    };
    return default_1;
}());
exports.default = default_1;
