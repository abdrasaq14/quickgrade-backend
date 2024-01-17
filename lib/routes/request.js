"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const google_auth_library_1 = require("google-auth-library");
dotenv_1.default.config();
const router = express_1.default.Router();
/* GET users listing. */
// router.post('/', async(req, res, next) => {
//     try{
//   res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
//   res.header('Referrer-Policy', 'no-referrer-when-downgrade');
//   const redirectUrl = 'http://127.0.0.1:3000/oauth'
//   const oAuth2Client = new OAuth2Client(
//     process.env.CLIENT_ID,
//     process.env.CLIENT_SECRET,
//     redirectUrl
//   );
//   const authorizeUrl = oAuth2Client.generateAuthUrl({
//     access_type: 'offline',
//     scope: 'https://www.googleapis.com/auth/userinfo.profile openid',
//     prompt: 'consent'
//   });
//   res.json({url: authorizeUrl});
//   // res.redirect(authorizeUrl);
//     }catch(error){
//         console.log('Error with signing in with Google');
//     }
// });
router.post('/', function (req, res, next) {
    try {
        res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
        res.header('Referrer-Policy', 'no-referrer-when-downgrade');
        const redirectUrl = 'http://127.0.0.1:3000/oauth';
        const oAuth2Client = new google_auth_library_1.OAuth2Client(process.env.CLIENT_ID, process.env.CLIENT_SECRET, redirectUrl);
        const authorizeUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: 'https://www.googleapis.com/auth/userinfo.profile openid',
            prompt: 'consent',
        });
        res.json({ url: authorizeUrl });
        // res.redirect(authorizeUrl);
    }
    catch (error) {
        console.log('Error with signing in with Google');
    }
});
exports.default = router;
