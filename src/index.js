import Random from "./random.js";
// Creating the sketch itself
const sketch = (p5) => {
    let xspacing = 10; // Distance between each horizontal location
    let w; // Width of entire wave
    let theta = 0.0; // Start angle at 0
    let amplitude = 25.0; // Height of wave
    let period = 40.0; // How many pixels before the wave repeats
    let dx; // Value for incrementing x
    let yvalues; // Using an array to store height values for the wave
    let block_height = 2;
    let bg_color = 'white';
    let colorCounter = 5;

    let colorPattern = [
        [ '#5D0399','#0033AF','#0BEA0B','#E3F21A','#FA5002','#E30702' ],
        [ '#A890C3','#E5A4BE','#FAD4C8','#F9F4C2','#C9E9C6'],
        // relax
        [ '#FDF8E2','#FFDDD3','#F3BFB3','#5EA9BE','#9ACDE0','#CBE1EF' ],
        // sporty candy
        [ '#4F008E','#CD0BA9','#FF8331','#F2DD15','#2E2DE8' ],
    ];

	p5.setup = () => {
		// Creating and positioning the canvas
		const canvas = p5.createCanvas(400, 400);
        canvas.parent("app");

        w = p5.width + xspacing;

        period = r.random_num(1, 3) * 100;
        // random PI
        dx = (p5.PI / period) * xspacing;
        yvalues = new Array(Math.floor(w / xspacing));

        calcWave();

        p5.background(bg_color);
        
        renderWave();
	};

    const calcWave = () => {
        // Increment theta (try different values for
        // 'angular velocity' here)
        theta += 0.02;
        theta = r.random_int(-1, 1) / 100;
      
        amplitude = r.random_int(30, 70);
        // For every x value, calculate a y value with sine function
        let x = theta;
        for (let i = 0; i < yvalues.length; i++) {
            yvalues[i] = Math.sin(x) * amplitude;
            x += dx;
        }
    }
      
    const renderWave = () => {
        // var startColor = p5.color(r.random_int(100, 255), r.random_int(100, 255), r.random_int(100, 255));
        // var endColor = p5.color(r.random_int(100, 255), r.random_int(100, 255), r.random_int(100, 255));
        var cp = r.random_choice(colorPattern);
        var startColor = p5.color(cp[0]); //p5.color(r.random_choice(r.random_choice(colorPattern)));


        var endColor = p5.color(cp[cp.length -1]); //p5.color(r.random_choice(r.random_choice(colorPattern)));
        var rand_case = r.random_int(0, 3);
        
        // A simple way to draw the wave with an ellipse at each location
        for (let x = 0; x < yvalues.length; x++) {
            if (x % colorCounter == 0 && current_color) {
                startColor = current_color;
                endColor = p5.color(r.random_choice(r.random_choice(colorPattern)));
            }

            var current_color = setColor(x % colorCounter, startColor, endColor);
            
            var mid_pt = p5.height / 2 + yvalues[x];
            var height = pattern(rand_case, yvalues.length, x) + (block_height * 2);

            setGradient(x * xspacing, (mid_pt - height) / block_height, height , current_color, p5.color(bg_color));
        }
    } 

    const setColor = (x, c1, c2) => {
        let inter = p5.map(x, 0, colorCounter, 0, 1);
        return p5.lerpColor(c1, c2, inter);
    }

    const setGradient = (x, y, h, c1, c2) => {
        for (let i = y; i <= y + h; i++) {
            let inter = p5.map(i, y, y + h, 0, 1);
            let c = p5.lerpColor(c1, c2, inter);
            p5.stroke(p5.color(255,255,255,50));
            p5.fill(c); 
            p5.rect(x, i * block_height, xspacing, block_height);
        }
    }

    const pattern = (val, maxHeight, x) => {
        switch (val) {
            case 1:
                // min > max
                return block_height * x;
            case 2:
                // max > min
                return block_height * (maxHeight - x);
            case 3:
                // max > min > max
                return Math.abs(block_height * (maxHeight/2 - x) * 2);
            // case 4:
            //     // min > max > min
            //     return x < maxHeight/2 ? block_height * x * 1.5: block_height * (maxHeight - x) * 1.5;
            default:
                // static height
                return p5.height / 3 / block_height;
        }
    }
};

new p5(sketch);

function genTokenData(projectNum) {
    let data = {};
    let hash = "0x";
    for (var i = 0; i < 64; i++) {
        hash += Math.floor(Math.random() * 16).toString(16);
    }
    data.hash = hash;
    data.tokenId = (projectNum * 1000000 + Math.floor(Math.random() * 1000)).toString();
    return data;
}

let tokenData = genTokenData(123);
// tokenData.hash = '0x1c0215fc20b522a19fbda098c64596a6223d15dffeff248486b35d0f842fd95f';
let r = new Random(tokenData);