function generateRandomColors(colorArray, colorCount) {
    var saturation 		= 0.5;
    var value 			= 0.95;
    var transparency	= 0.4;
    var hue             = 0;
    var goldenRatio 	= 0.618033988749895;

    for (var i = 0; i < colorCount; i++) {
        if (hue == 0) {
            hue = Math.random();
        }   

        hue += goldenRatio;
        hue %= 1;

        var hsvToRgb = function (h,s,v) {
        var	h_i	= Math.floor(h*6),
            f 	= h*6 - h_i,
            p	= v * (1-s),
            q	= v * (1-f*s),
            t	= v * (1-(1-f)*s),
            r	= 255,
            g	= 255,
            b	= 255;
        switch(h_i) {
            case 0:	r = v, g = t, b = p;	break;
            case 1:	r = q, g = v, b = p;	break;
            case 2:	r = p, g = v, b = t;	break;
            case 3:	r = p, g = q, b = v;	break;
            case 4: r = t, g = p, b = v;	break;
            case 5: r = v, g = p, b = q;	break;
                    }
        return [Math.floor(r*256),Math.floor(g*256),Math.floor(b*256)];
        };

        var rgb = hsvToRgb(hue,saturation,value);
        colorArray.push("rgba(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + "," + transparency + ")");
    };

    return colorArray;
}
