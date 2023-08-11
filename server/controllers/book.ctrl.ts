import axios from 'axios'


const bookController = {
    get: async function (req, res) {

        const queryBookname = req.params.bookName

        const response = await axios.request( {
            method: 'get',
            url: "https://dapi.kakao.com/v3/search/book",
            headers: {
                Authorization:"KakaoAK 16d7d5274baf67c979f477a02784c05e"
            },
            params: {
                query: queryBookname,
            },
            responseType: 'json'

        });

        let data = []

        response.data.documents.forEach(book => {
            data.push({ 
                title: book.title,
                description: book.contents,
                author: book.authors,
                publishYear: book.datetime,
                coverImage: book.thumbnail,
                url: book.url
            }) 
        })

    
        res.status(200).json({
            status: 1,
            books: data
        })
    }
}



export { bookController }