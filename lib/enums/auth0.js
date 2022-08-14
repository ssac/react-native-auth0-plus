"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OobChannel = exports.AuthenticatorType = void 0;
var AuthenticatorType;
(function (AuthenticatorType) {
    AuthenticatorType["oob"] = "oob";
    AuthenticatorType["otp"] = "otp";
    AuthenticatorType["recoveryCode"] = "recovery-code";
    AuthenticatorType["auth0"] = "auth0";
})(AuthenticatorType = exports.AuthenticatorType || (exports.AuthenticatorType = {}));
var OobChannel;
(function (OobChannel) {
    OobChannel["sms"] = "sms";
    OobChannel["voice"] = "voice";
    OobChannel["email"] = "email";
})(OobChannel = exports.OobChannel || (exports.OobChannel = {}));
