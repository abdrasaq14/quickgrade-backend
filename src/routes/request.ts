import express from 'express';
import dotenv from 'dotenv';
import { OAuth2Client } from 'google-auth-library';
dotenv.config();

const router = express.Router();

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

router.post('/', function (req, res, next): void {
  try {
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.header('Referrer-Policy', 'no-referrer-when-downgrade');

    const redirectUrl = 'http://127.0.0.1:3000/oauth';

    const oAuth2Client = new OAuth2Client(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      redirectUrl,
    );
    const authorizeUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: 'https://www.googleapis.com/auth/userinfo.profile openid',
      prompt: 'consent',
    });

    res.json({ url: authorizeUrl });
    // res.redirect(authorizeUrl);
  } catch (error) {
    console.log('Error with signing in with Google');
  }
});

export default router;
