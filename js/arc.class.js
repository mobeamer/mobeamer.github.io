function Arc(centerX, centerY, radius)
{
    this.centerX = centerX;
    this.centerY = centerY;
    this.radius = radius;

    this.startArc = 1 * Math.PI;
    this.endArc = 2 * Math.PI;
    this.currStartArc = this.startArc;
    this.currEndArc = this.startArc;
    this.arcSpeed = .01;
    this.debug = false;

    this.render = function(context)
    {
        if(this.currEndArc < 2 * Math.PI)
        {
            this.currEndArc+=this.arcSpeed;
        }
        else
        {
            this.currStartArc+=this.arcSpeed;

            if(this.currStartArc > 2 * Math.PI)
            {
                this.currStartArc = 1 * Math.PI;
                this.currEndArc = 1 * Math.PI;
            }
        }

        
        context.globalAlpha = 0.5;
        context.lineWidth = 20;
        context.strokeStyle = "white";
        context.beginPath();

        context.arc(this.centerX, this.centerY, this.radius, this.currStartArc, this.currEndArc);
        context.stroke();                
        context.globalAlpha = 1;

        if(this.debug)
        {
            context.lineWidth = 1;
            context.strokeRect(this.centerX - this.radius, this.centerY - this.radius, this.radius * 2, this.radius);

            context.beginPath();
            context.arc(100,this.centerY,this.radius,1 * Math.PI,2 * Math.PI);
            context.stroke();

            context.font = "10px Trebuchet MS";
            context.fillText(this.currStartArc.toFixed(2), this.centerX + this.radius + 30, this.centerY - this.radius/2);
            context.fillText(this.currEndArc.toFixed(2), this.centerX + this.radius + 30, this.centerY - this.radius/2 + 15);
        }
                
    }
}
