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
exports.authenticate = void 0;
function authenticate(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const email = req.session.email || req.user;
        console.log('email', email);
        try {
            if (!email) {
                console.log('no email');
                res.json({ unathorized: 'unathorized' });
            }
            else {
                req.session.email = email;
                next();
            }
        }
        catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Unauthorized' });
        }
    });
}
exports.authenticate = authenticate;
;
