import { Between, FindOptionsOrder, Like } from "typeorm";
import { MySQLConnect, AppDataSource } from '../databases/db.js'
import { Feed } from "../databases/entity/Feed.js";

type SelectRangeType = {
    idxStart: number
    order?: any
    range: number
}

type SelectType = {
    idx?: number
    userId?: string
}

const feedModel = {
    get: async function ({ idxStart, order, range }: SelectRangeType) {
        try {
            
            const feedRepository = AppDataSource.getRepository(Feed);
            const getFeed = await feedRepository.createQueryBuilder('feed')
            .limit(range)
            .offset(idxStart)
            .orderBy("feed.date", order)
            .leftJoin("feed.owner", "user")
            .leftJoin("feed.quotation", "quotation")
            .addSelect(['user.userId', 'user.userAuthLevel', 'user.userDisplayName'])
            .addSelect(['quotation.title', 'quotation.description', 'quotation.author', 'quotation.publishYear', 'quotation.coverImage', 'quotation.url', 'quotation.type'])

            .getMany()
    
            return { status: 1, result: getFeed }

        } catch (err) {
            throw Error(err)
        }
    },

    getBy: async function ({ idx, userId }: SelectType) {
        try {

            const paramsWhereIndex = ["feed.idx", "user.userId"]
            const paramsIndex = ["idx", "userId"]

            const paramsData = [idx, userId]

            let setData = {}
            let where = ''

            for (let index = 0; index < paramsData.length; index++) {
                if (paramsData[index] != undefined) {
                    setData[paramsIndex[index]] = paramsData[index]
                    where = `${paramsWhereIndex[index]} = :${paramsIndex[index]}`
                }
            }

            const feedRepository = AppDataSource.getRepository(Feed);
            const getFeed = await feedRepository.createQueryBuilder('feed')
            .orderBy("feed.date", "DESC")
            .leftJoin("feed.owner", "user")
            .leftJoin("feed.quotation", "quotation")
            .addSelect(['user.userId', 'user.userAuthLevel', 'user.userDisplayName'])
            .addSelect(['quotation.title', 'quotation.description', 'quotation.author', 'quotation.publishYear', 'quotation.coverImage', 'quotation.url', 'quotation.type'])
            .where(where, setData)
            .getMany()

    
            return { status: 1, result: getFeed }

        } catch (err) {
            throw Error(err)
        }
    },

    insert: async function ({ thought, quotationText, quotationUUID, owner, date, type }) {
        try {
            const feedRepository = AppDataSource.getRepository(Feed);
            const insertFeed = await feedRepository.createQueryBuilder()
                .insert()
                .into(Feed)
                .values([
                    { 
                        thought: thought, 
                        quotationText: quotationText,
                        quotation: quotationUUID,
                        owner: owner, 
                        date: date, 
                        type: type 
                    }
                ])
                .execute()
    
            return { status: 1 }

        } catch (err) {
            throw Error(err)
        }
    },
    
    delete: async function ({ idxFeed, owner }) {
        try {
            const feedRepository = AppDataSource.getRepository(Feed);
            const deleteFeed = await feedRepository.createQueryBuilder('feed')
                .delete()
                .from(Feed)
                .where("idx = :idx AND owner = :owner", { idx: idxFeed, owner: owner })
                .execute()

            return { status: 1 }

        } catch (err) {
            throw Error(err)
        }
    },
    
    update: async function ({ idxFeed, thought, owner }) {
        try {
            const feedRepository = AppDataSource.getRepository(Feed);
            const updateFeed = await feedRepository.createQueryBuilder()
            .update(Feed)
            .set({ thought: thought })
            .where("idx = :idx AND owner = :owner", { idx: idxFeed, owner: owner })
            .execute()

            return { status: 1 }

        } catch (err) {
            throw Error(err)
        }
    },


    search: async function ({ sentence }) {
        try {
            const feedRepository = AppDataSource.getRepository(Feed);
            const searchFeed = await feedRepository.findBy({
                quotationText: Like(`%${sentence}%`)
            });

            return { status: 1, result: searchFeed }

        } catch (err) {
            throw Error(err)
        }
    },
}

export { feedModel }