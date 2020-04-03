function fixDpi(canvasID) 
{
    var dpi = window.devicePixelRatio;
    
    var canvas = document.getElementById(canvasID);

    var style_height = canvas.height;
    
    var style_width = canvas.width;
    //scale the canvas
    canvas.setAttribute('height', style_height * dpi);
    canvas.setAttribute('width', style_width * dpi);
}