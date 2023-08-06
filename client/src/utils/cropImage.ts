

class CropImage {
    canvas: any
    ctx: any
    constructor({ imageUrl }) {
        this.canvas = document.createElement("canvas")
        this.ctx = this.canvas.getContext("2d")

        this.drawImage({ imageUrl: imageUrl })
    }

    drawImage({ imageUrl }) {
        let image = new Image()
        image.src = imageUrl
        image.onload = () => {
            this.ctx.drawImage(image, 0, 0)
        }
    }

    cropImage() {
        
    }
}

export { CropImage }