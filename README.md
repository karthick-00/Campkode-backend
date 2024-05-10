Campkode backend

To start git clone https://github.com/karthick-00/Campkode-backend.git/

Then npm install --force

Then go to server directory command: cd server

Then create a .env  file in the same directory as the index.js with the following 

COOKIE_EXPIRESIN=1 

JWT_EXPIRESIN=1h 

ATLAS_STRING='Your atlas string'

CLIENT_ID = 'google client id '

CLIENT_SEC = 'google client secret'

REFRESH_TOKEN = 'Your Refresh Token'

USER = 'Your Gmail'

RESET_TOKEN = 'Your Reset Token'

SECRET_KEY='Your Secret Key'

JWT_EXPIRESIN=1h

COOKIE_EXPIRESIN=1

Then npm run start
