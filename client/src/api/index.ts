

import axios from "axios"
import Cookies from 'js-cookie'

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
    
    async insertFeed({ thought, quotationText, quotationOrigin }) {
        let token = Cookies.get("user")
    
        let response = await axios.request({
            method: 'post',
            url: `/api/feeds`,
            data: {
                thought: thought,
                quotationText: quotationText,
                quotationOrigin: quotationOrigin
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
        
        let response = await axios.request({
            method: 'post',
            url: 'http://localhost:9040/recognize',
            // url: 'https://ocr.scrap.devent.kr/recognize',
            headers: {
                "Content-Type": "multipart/form-data"
            },
            data: formData
        });

        return response.data
    }
}

export { FeedAPI, AuthAPI, UserAPI, OauthAPI, OcrAPI }
