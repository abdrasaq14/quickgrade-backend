import express from 'express'
import dotenv from 'dotenv'
import { OAuth2Client } from 'google-auth-library'
dotenv.config()

const BACKEND_URL = process.env.BACKEND_URL
const router = express.Router()

async function getUserData (accessToken: any): Promise<any> {
  try {
    const response = await fetch(
      `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`
    )
    const data = await response.json()
    console.log('data: ', data)
    return data
  } catch (error) {
    console.log('Error with getting user data')
  }
}

router.get('/', function (req, res, next): void {
  const code: any = req.query.code
  try {
    const redirectUrl = `${BACKEND_URL}/oauth`

    const oAuth2Client = new OAuth2Client(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      redirectUrl
    )

    oAuth2Client
      .getToken(code)
      .then(async (response) => {
        oAuth2Client.setCredentials(response.tokens)
        console.log('Tokens acquired.')
        const user = oAuth2Client.credentials
        console.log('creadentials: ', user)
        const userData = await getUserData(user.access_token)
        // Handle userData
        res.json({ userData })
        console.log('userData: ', userData)
      })
      .catch((error) => {
        console.log(error)
      })
  } catch (error) {
    console.log('Unexpected error')
  }
})

export default router
