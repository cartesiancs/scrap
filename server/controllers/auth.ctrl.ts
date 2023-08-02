import { userService } from '../services/users.serv.js';
import { userModel } from '../models/users.model.js';

import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import passport from "passport";
import oauth from '../config/oauth.js';
import server from '../config/server.js';


const GOOGLE_CLIENT_ID = oauth["GOOGLE"].GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = oauth["GOOGLE"].GOOGLE_CLIENT_SECRET
const GOOGLE_IS_ENABLE = oauth["GOOGLE"].IS_ENABLE

const URI = server[process.env.NODE_ENV].uri


passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: `${URI}/api/auth/google/callback`,
    userProfile: "https://www.googleapis.com/oauth2/userinfo"
  },
  async function(accessToken, refreshToken, profile, cb) {
    console.log(accessToken, refreshToken, profile, profile.id)
    const userId = profile.id

    const getUserPasswordHash = await userService.encryptPassword(accessToken)
    const userPasswordHash = getUserPasswordHash.userPasswordHash
    const userEmail = profile.emails[0].value
    const provider = 'google'
    
    const isDuplicate = await userModel.read({
      userId: profile.id
    })

    if (isDuplicate.status == 0) {
        let data = await userModel.create({
          userId: userId,
          userPasswordHash: userPasswordHash,
          userEmail: userEmail,
          provider: provider
        })
    }

    let createdToken = await userService.grantToken(userId);

    return cb(null, {
        profile: profile,
        token: createdToken.userJwtToken
    });
  }
));

const authController = {
    login: async function (req, res) {
        try {
            const userId = Buffer.from(req.body.user_id, "base64").toString('utf8');
            const userPassword = Buffer.from(req.body.user_pw, "base64").toString('utf8');
        
            const userInfo = await userModel.read({ userId: userId })
            const result = await userService.comparePassword({ 
                userPassword: userPassword,
                userPasswordHash: userInfo.user.userPassword
            })

            if (userInfo.user.userAuthLevel == 0) {
                return res.status(401).json({status: -1})
            }

            if (result.status == 0) {
                return res.status(401).json({status: -1})
            }

            const getJwtToken = await userService.grantToken({ userId: userId });
            const createdToken = getJwtToken.userJwtToken

            if (getJwtToken.status == 0) {
                return res.status(401).json({status: -1})
            }

            res.status(200).json({status:1, token: createdToken})

        } catch (error) {
            res.status(401).json({status:0})
        }
    },


    me: async function (req, res) {
        const token = req.headers['x-access-token'];
        const data = await userService.transformTokentoUserid({ token: token })
        res.status(200).json({status:1, user_id:data})
    }
}


const oauthController = {
    authGoogle: passport.authenticate('google', { scope: ['profile', 'email'] }),
    authGoogleCallback: passport.authenticate('google', { failureRedirect: '/auth/login', session: false }),

    isEnable: async function  (req, res) {
        return res.send({
            isEnable: {
                google: GOOGLE_IS_ENABLE
            }
        })
    },
    
    callback: async function  (req, res) {
        console.log("CONT", req.user.token)

        res.cookie('user', req.user.token, { maxAge: 900000, httpOnly: false });

        return res.redirect('/')
    }

}


export { authController, oauthController }