function AnimatedImg(img, drawX, drawY, scale)
{
    this.drawX = drawX;
    this.drawY = drawY;
    this.scale = scale;
    this.img = img;

    this.chunks = new Array(this.img.width);
    for(var i=0;i<this.chunks.length;i++)
    {
        this.chunks[i] = new Array(this.img.height);
    }

    for(var x=0;x<this.chunks.length;x++)
    {
        for(var y = 0;y<this.chunks[x].length;y++)
        {
            this.chunks[x][y]=0;
        }
    }


    this.render = function(context)
    {
        var imgWidth = this.img.naturalWidth * this.scale;
        var imgHeight = this.img.naturalHeight * this.scale;
        
        context.drawImage(this.img, 0,0,this.img.naturalWidth, this.img.naturalHeight, this.drawX, this.drawY,imgWidth, imgHeight);
        
    }
}
