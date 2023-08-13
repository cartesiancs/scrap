import { MySQLConnect, AppDataSource } from '../databases/db.js'
import { Quotation } from "../databases/entity/Quotation.js";


const quotationModel = {
    create: async function ({ uuid, title, description, author, publishYear, coverImage, url, type }) {
        try {
            const quotationValues = new Quotation()
            quotationValues.uuid = uuid
            quotationValues.title = title
            quotationValues.description = description
            quotationValues.author = author
            quotationValues.publishYear = publishYear
            quotationValues.coverImage = coverImage
            quotationValues.url = url
            quotationValues.type = type

    
            const userRepository = AppDataSource.getRepository(Quotation);
            await userRepository.save(quotationValues)
            return { status: 1 }
    
        } catch (err) {
            console.log(err)
            return { status: 0 }
        }
    },
    
    

}

export { quotationModel }