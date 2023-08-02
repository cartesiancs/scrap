import { MySQLConnect, AppDataSource } from '../databases/db.js'

import { User } from "../databases/entity/User.js";

type updateType = {
    set: { 
        userAuthLevel?: number, 
        userDisplayName?: string
    }, 

    where: { 
        query: string, 
        data: any
    } 
}

const userModel = {
    create: async function ({ userId, userPasswordHash, userEmail, provider }) {
        try {
            const userValues = new User()
            userValues.userId = userId
            userValues.userPassword = userPasswordHash
            userValues.userEmail = userEmail
            userValues.userAuthLevel = 1
            userValues.userDisplayName = userId
            userValues.provider = provider
            userValues.createAt = new Date()

    
            const userRepository = AppDataSource.getRepository(User);
            await userRepository.save(userValues)
            return { status: 1 }
    
        } catch (err) {
            console.log(err)
            return { status: 0 }
        }
    },
    
    read: async function ({ userId, userEmail }: any) {
        try {
            const userRepository = AppDataSource.getRepository(User);
            const getUser = await userRepository
                .createQueryBuilder("user")
                .where("user.userId = :id OR user.userEmail = :email", { id: userId, email: userEmail })
                .getOne()
    
            const status = getUser == null ? 0 : 1
            return { status: status, user: getUser }
        } catch (err) {
            console.log(err)
            throw Error(err)
        }
    },

    
    update: async function ({ set: { userAuthLevel, userDisplayName }, where: { query, data } }: updateType) {
        try {
            const paramsSetIndex = ["userAuthLevel", "userDisplayName"]
            const paramsSetData = [userAuthLevel, userDisplayName]

            let setData = {}

            for (let index = 0; index < paramsSetIndex.length; index++) {
                if (paramsSetData[index] != undefined) {
                    setData[paramsSetIndex[index]] = paramsSetData[index]
                }
            }

            const userRepository = AppDataSource.getRepository(User);
            const updateUser = await userRepository
            .createQueryBuilder()
            .update(User)
            .set(setData)
            .where(query, data)
            .execute()
    
    
            return updateUser
        } catch (err) {
            console.log(err)
            throw Error(err)
        }
    }
    

}

export { userModel }