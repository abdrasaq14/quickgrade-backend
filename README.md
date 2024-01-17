# NODE-Live-Project

# Create an end point that send OTP to the users email (BE)
Otp for user to send user email, dependency like `speakeasy` will be needed and install it.


## Google Sign-In Endpoint

I have implemented a Google Sign-In endpoint to facilitate user authentication using OAuth2. This endpoint, accessible via a POST request to `/request`, generates an authorization URL for Google OAuth2 authentication. The generated URL includes necessary parameters for offline access, user profile information, and consent prompting.

### Usage

Make a POST request to `http://localhost:3000/request` to obtain the Google Sign-In authorization URL. The response will be a JSON object containing the generated URL under the `url` key.

# Forgot password otp generate
Implemented the logic to generate otp for forget password which will parse the otp to the students' email address. This is accessuble using the route `http://localhost:3000/users/forgot-password`


