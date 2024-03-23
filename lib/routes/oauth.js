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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const google_auth_library_1 = require("google-auth-library");
dotenv_1.default.config();
const BACKEND_URL = process.env.BACKEND_URL;
const router = express_1.default.Router();
function getUserData(accessToken) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`);
            const data = yield response.json();
            console.log('data: ', data);
            return data;
        }
        catch (error) {
            console.log('Error with getting user data');
        }
    });
}
router.get('/', function (req, res, next) {
    const code = req.query.code;
    try {
        const redirectUrl = `${BACKEND_URL}/oauth`;
        const oAuth2Client = new google_auth_library_1.OAuth2Client(process.env.CLIENT_ID, process.env.CLIENT_SECRET, redirectUrl);
        oAuth2Client
            .getToken(code)
            .then((response) => __awaiter(this, void 0, void 0, function* () {
            oAuth2Client.setCredentials(response.tokens);
            console.log('Tokens acquired.');
            const user = oAuth2Client.credentials;
            console.log('creadentials: ', user);
            const userData = yield getUserData(user.access_token);
            // Handle userData
            res.json({ userData });
            console.log('userData: ', userData);
        }))
            .catch((error) => {
            console.log(error);
        });
    }
    catch (error) {
        console.log('Unexpected error');
    }
});
exports.default = router;
