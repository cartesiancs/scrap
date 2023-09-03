

import { feedModel } from '../models/feeds.model.js';
import { quotationModel } from '../models/quotation.model.js';


import { userService } from '../services/users.serv.js'
import sanitizeHtml from 'sanitize-html';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';




const feedController = {
    get: async function  (req, res) {
        let idx = Number(req.params.idx) || 0;
        let isRange = String(req.query.isrange) || 'false'
        let order = String(req.query.order || 'ASC')

        let allowOrder = ['ASC', 'DESC']

        let idxRange = Number(req.query.range) || 0;
        let idxMaxRange = 50

        let idxStart = idx || 0;
        let idxEnd = idxStart + idxRange || idx;
        let resultFeed;

        if (allowOrder.indexOf(order) == -1) {
            return res.status(404).json({data:'', msg:'Not Found'})
        }

        if (idxRange > idxMaxRange) {
            idxRange = idxMaxRange
        }

    
        if (isRange == 'true') {
            resultFeed = await feedModel.get({ idxStart, order, range: idxRange })
        } else {
            resultFeed = await feedModel.getBy({ idx: idx })
        }
    
        if (Array.isArray(resultFeed) && resultFeed.length === 0) {
            res.status(404).json({data:'', msg:'Not Found'})
        } else {
            res.status(200).json({data: resultFeed})
        }
    },
    

    insert: async function  (req, res) {
        let token = req.headers['x-access-token'];
        let now = dayjs();
    
        let getUserId = await userService.transformTokentoUserid({ token: token });

        let thought = sanitizeHtml(req.body.thought);
        let quotationText = sanitizeHtml(req.body.quotationText);
        let quotationTitle = sanitizeHtml(req.body.quotationTitle);
        let quotationDescription = sanitizeHtml(req.body.quotation.description);
        let quotationAuthor = sanitizeHtml(req.body.quotation.author);
        let quotationPublishYear = sanitizeHtml(req.body.quotation.publishYear);
        let quotationCoverImage = sanitizeHtml(req.body.quotation.coverImage);
        let quotationUrl = sanitizeHtml(req.body.quotation.url);
        let quotationType = Number(sanitizeHtml(req.body.quotation.type));

        let quotationUUID = uuidv4()

        let owner = getUserId.userId
        let date = now.format("YYYY.MM.DD.HH.mm.ss"); 
        let type = 1;
    
        if (req.body.thought > 1000 || req.body.quotationText > 1000) {
            return res.status(401).json({status:0})
        }


        await quotationModel.create({
            uuid: quotationUUID,
            title: quotationTitle,
            description: quotationDescription,
            author: quotationAuthor,
            publishYear: quotationPublishYear,
            coverImage: quotationCoverImage,
            url: quotationUrl,
            type: quotationType
        })


        let data: any = await feedModel.insert({ 
            thought: thought, 
            quotationText: quotationText, 
            quotationUUID: quotationUUID, 
            owner: owner, 
            date: date, 
            type: type 
        })

    
        if (data.status == 1) {
            res.status(200).json({status:1})
        } else {
            res.status(401).json({status:0})
        }
    },
    
    
    delete: async function (req, res) {
        let token = req.headers['x-access-token'];
    
        let idxFeed = req.params.idx;
        let getUserId = await userService.transformTokentoUserid({ token: token });
    
        let owner =  getUserId.userId
    
        let data: any = await feedModel.delete({ idxFeed, owner })
    
        if (data.status == 1) {
            res.status(200).json({status:1})
        } else {
            res.status(401).json({status:0})
        }
    },
    
    
    update: async function (req, res) {
        let token = req.headers['x-access-token'];
    
        let idxFeed = Number(req.params.idx);
        let thought = sanitizeHtml(req.body.content);
        let getUserId = await userService.transformTokentoUserid({ token: token });
        let owner = getUserId.userId
        
        let data: any = await feedModel.update({ idxFeed, thought, owner })
    
        if (data.status == 1) {
            res.status(200).json({status:1})
        } else {
            res.status(401).json({status:0})
        }
    },

    search: async function (req, res) {    
        let sentence = sanitizeHtml(req.params.sentence);
        
        let data: any = await feedModel.search({ sentence })
    
        if (data.status == 1) {
            res.status(200).json({status:1, data: data.result })
        } else {
            res.status(401).json({status:0})
        }
    },
}


const feedUserController = {
    get: async function  (req, res) {
        const userId = String(req.params.userId)
        const resultFeed = await feedModel.getBy({ userId: userId })
    
        if (Array.isArray(resultFeed) && resultFeed.length === 0) {
            res.status(404).json({data:'', msg:'Not Found'})
        } else {
            res.status(200).json({data: resultFeed})
        }
    },
}

const feedBookController = {
    get: async function  (req, res) {
        const bookTitle = String(req.params.bookTitle)
        const resultFeed = await feedModel.getBook({ title: bookTitle })
    
        if (Array.isArray(resultFeed) && resultFeed.length === 0) {
            res.status(404).json({data:'', msg:'Not Found'})
        } else {
            res.status(200).json({data: resultFeed})
        }
    },
}

export { feedController, feedUserController, feedBookController }