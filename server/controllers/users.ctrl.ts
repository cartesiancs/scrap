
import { userService } from '../services/users.serv.js';

import { userModel } from '../models/users.model.js';

const userController = {
    create: async function  (req, res) {
        const userId = Buffer.from(req.body.user_id, "base64").toString('utf8');
        const userPassword = Buffer.from(req.body.user_pw, "base64").toString('utf8');
        const userEmail = Buffer.from(req.body.user_email, "base64").toString('utf8');
    
        const isAvailable = await userService.checkAvailableUser({ userId: userId, userEmail: userEmail })
        const getUser = await userModel.read({ userId, userEmail })
        const isDuplicate = getUser.status
    
        if (String(userPassword).length <= 7) {
            return res.status(200).json({status: 2})
        }
        if (isAvailable == 0 || isDuplicate != 0) {
            return res.status(200).json({status:0})
        }
    
        const getUserPasswordHash = await userService.encryptPassword({ userPassword: userPassword })
        const userPasswordHash = getUserPasswordHash.userPasswordHash
    
        await userModel.create({ 
            userId: userId, 
            userPasswordHash: userPasswordHash, 
            userEmail: userEmail,
            provider: "email"
        })
    
        const isGrantAuthorization: any =await userModel.update({ 
            set: {
                userAuthLevel: 1
            },
            where: {
                query: 'userId = :userId',
                data: { userId: userId }
            }
        });

        const getJwtToken = await userService.grantToken({ userId: userId });
        const createdToken = getJwtToken.userJwtToken

        if (isGrantAuthorization.status == 0) {
            return res.status(401).json({status:0})
        }

        res.status(200).json({status:1, token: createdToken})
    },
    
    
    delete: async function (req, res) {
        const userId = req.params.user_id;

        if (req.auth.userId !== userId) {
            return res.status(200).json({status:0})
        }

        const isRevoke: any = await userModel.update({ 
            set: {
                userAuthLevel: 0
            },
            where: {
                query: 'userId = :userId',
                data: { userId: userId }
            }
        });

        if (isRevoke.status == 0) {
            return res.status(200).json({status:0})
        }
    
        res.clearCookie('user')
        res.status(200).json({status:1})
    }, 
    
    
    get: async function (req, res) {
        try {
            let userId = req.params.user_id;
            let userInfo = await userModel.read({ userId: userId });

            if (userInfo.status <= 0) {
                return res.status(200).json({ status: 0 })
            }
    
            let result = {
                userAuth: userInfo.user.userAuthLevel, 
                //user_email: userInfo.user.userEmail, 
                userId: userInfo.user.userId,
                userDisplayName: userInfo.user.userDisplayName

            }

            if (userInfo.user.userAuthLevel <= 0) {
                return res.status(200).json({ status: 0 })
            }
        
            res.status(200).json({ status: 1, data: result })
        } catch (error) {
            res.status(500).json({ status: 0 })
        }
    },

    update: async function (req, res) {
        try {
            const userId = req.auth.userId
            const userUpdateDisplayName = req.body.userDisplayName

            const userInfo = await userModel.read({ userId: userId });

            if (userInfo.status <= 0) {
                return res.status(200).json({ status: 0 })
            }

            if (userInfo.user.userAuthLevel <= 0) {
                return res.status(200).json({ status: 0 })
            }


            const updateUser: any = await userModel.update({ 
                set: {
                    userDisplayName: userUpdateDisplayName
                },
                where: {
                    query: 'userId = :userId',
                    data: { userId: userId }
                }
            });
        
            res.status(200).json({ status: 1 })
        } catch (error) {
            res.status(500).json({ status: 0 })
        }
    },
}


export { userController }