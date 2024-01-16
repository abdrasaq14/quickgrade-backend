import express from 'express';
import dotenv from 'dotenv';
import { OAuth2Client } from 'google-auth-library';
dotenv.config();

const router = express.Router();

async function getUserData(accessToken: any): Promise<any> {
  try {
    const response = await fetch(
      `https://googleapis.com/oauth2/v3/userinfo?accessToken=${accessToken}`,
    );
    const data = await response.json();
    console.log('data: ', data);
    // return data;
  } catch (error) {
    console.log('Error with getting user data');
  }
}

/* GET home page. */
// router.get('/', async function (req, res, next): Promise<void>{
//   const code: any = req.query.code;
//   try {
//     const redirectUrl = 'http://127.0.0.1:3000/oauth';

//     const oAuth2Client = new OAuth2Client(
//       process.env.CLIENT_ID,
//       process.env.CLIENT_SECRET,
//       redirectUrl,
//     );
//     const response = await oAuth2Client.getToken(code);
//     oAuth2Client.setCredentials(response.tokens);
//     console.log('Tokens acquired.');
//     const user = oAuth2Client.credentials;
//     console.log('creadentials: ', user);
//     await getUserData(user.access_token);

//   } catch (error) {
//     console.log('Error with signing in with Google');
//   }
// });

router.get('/', function (req, res, next): void {
  const code: any = req.query.code;
  try {
    const redirectUrl = 'http://127.0.0.1:3000/oauth';

    const oAuth2Client = new OAuth2Client(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      redirectUrl,
    );

    oAuth2Client
      .getToken(code)
      .then(async (response) => {
        oAuth2Client.setCredentials(response.tokens);
        console.log('Tokens acquired.');
        const user = oAuth2Client.credentials;
        console.log('creadentials: ', user);
        return await getUserData(user.access_token);
      })
      .then(() => {
        // Handle userData
        // For example, you can send a response using res.json({ userData });
      })
      .catch((error) => {
        //   console.log('Error with signing in with Google');
        console.log(error);
      });
  } catch (error) {
    console.log('Unexpected error');
  }
});

export default router;
