
const serverController = {
    get: async function (req, res) {

        const serverVersion = process.env.npm_package_version
        const serverMode = process.env.NODE_ENV

    
        res.status(200).json({
            status: 1,
            server: {
                version: serverVersion,
                mode: serverMode
            }
        })
    }
}



export { serverController }