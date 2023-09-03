

import axios from "axios"
import Cookies from 'js-cookie'


const AppAPI = {
    async getServerVersion() {
        let response = await axios.request({
            method: 'get',
            url: `/api/server`,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            responseType: 'json'
        })
    
    
        return response.data
    },
}

const FeedAPI = {
    async getFeed(feedIdx, fetchParams) {
        let response = await axios.request({
            method: 'get',
            url: `/api/feeds/${feedIdx}`,
            params: fetchParams,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            responseType: 'json'
        })
    
    
        return response.data
    },

    async getUserFeed(userId) {
        let response = await axios.request({
            method: 'get',
            url: `/api/feeds/user/${userId}`,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            responseType: 'json'
        })
    
    
        return response.data
    },
    
    async insertFeed({ thought, quotationText, quotationTitle, quotation: { description, author, publishYear, coverImage, url, type} }) {
        let token = Cookies.get("user")
    
        let response = await axios.request({
            method: 'post',
            url: `/api/feeds`,
            data: {
                thought: thought,
                quotationText: quotationText,
                quotationTitle: quotationTitle,
                quotation: { 
                    description: description, 
                    author: author, 
                    publishYear: publishYear, 
                    coverImage: coverImage, 
                    url: url, 
                    type: type 
                } 
            },
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "x-access-token": token
    
            },
            responseType: 'json'
        })
    
        return response.data
    },
    
    
    async deleteFeed(idx) {
        let token = Cookies.get("user")
        
        let response = await axios.request({
            method: 'delete',
            url: `/api/feeds/${idx}`,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "x-access-token": token
    
            },
            responseType: 'json'
        })
    
        return response.data
    },
    
    
    async search({ sentence }) {
        let token = Cookies.get("user")
        
        let response = await axios.request({
            method: 'get',
            url: `/api/feeds/search/${sentence}`,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "x-access-token": token
    
            },
            responseType: 'json'
        })
    
        return response.data
    },
    
    
    async searchBook({ bookTitle }) {
        let token = Cookies.get("user")
        
        let response = await axios.request({
            method: 'get',
            url: `/api/feeds/search/book/${decodeURI(bookTitle)}`,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "x-access-token": token
    
            },
            responseType: 'json'
        })
    
        return response.data
    }
}

const AuthAPI = {

    async login({ userId, userPw }) {
        let response = await axios.request({
            method: 'post',
            url: `/api/auth/login`,
            data: {
              user_id: userId,
              user_pw: userPw
            },
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            responseType: 'json'
          })
      
        return response.data 
    },

    async signup({ userId, userPw, userEmail }) {
        
      let response = await axios.request({
        method: 'post',
        url: `/api/users`,
        data: {
          user_id: userId,
          user_pw: userPw,
          user_email: userEmail
        },
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        responseType: 'json'
      })
    
      return response.data
    }

}

const UserAPI = {
    async remove(userId) {
        let token = Cookies.get("user")
    
        let response = await axios.request({
            method: 'delete',
            url: `/api/users/${userId}`,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "x-access-token": token
            },
            responseType: 'json'
        })
    
        return response.data
    },

    async get(userId) {    
        let response = await axios.request({
            method: 'get',
            url: `/api/users/${userId}`,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            responseType: 'json'
        })
    
        return response.data
    },

    async update({ displayName }) {  
        let token = Cookies.get("user")

        let response = await axios.request({
            method: 'put',
            url: `/api/users/`,
            data: {
                userDisplayName: displayName
            },
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "x-access-token": token
            },
            responseType: 'json'
        })
    
        return response.data
    }
}

const OauthAPI = {
    async isEnable() {
        
      let response = await axios.request({
        method: 'get',
        url: `/api/auth/oauth/isEnable`,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        responseType: 'json'
      })
    
      return response.data
    }
}

const OcrAPI = {
    async requestOCR({ formData }) {

        const application = await AppAPI.getServerVersion()
        const ocrUrl = application.server.mode == 'development' ? 'http://localhost:8000/recognize' : 'https://ocr.scrap.devent.kr/recognize'
        console.log(ocrUrl)

        let response = await axios.request({
            method: 'post',
            url: ocrUrl,
            headers: {
                "Content-Type": "multipart/form-data"
            },
            data: formData
        });

        return response.data
    }
}

const BookAPI = {
    async get({ title }) {
        let response = await axios.request({
            method: 'get',
            url: `/api/book/${title}`,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            responseType: 'json'
        })
    
        return response.data
    },
}


export { FeedAPI, AuthAPI, UserAPI, OauthAPI, OcrAPI, BookAPI }
