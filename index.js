const express = require('express');
const app = express();
const { createCanvas, loadImage, registerFont } = require('canvas');



const otfFontPath = 'ara.otf';
registerFont(otfFontPath, { family: 'Regular' });

// /prodimage?img=https://ae01.alicdn.com/kf/Hf75336cbf1d64ebf9e0e57db12f06d13t/Torx-Cross-Pentalobe-Android.jpg&titel=123&normal=10.00&points=20.00&superd=30.00&limited=40.00&shipping=50.00&shippingcomp=AliExpress Standard Shipping&shippingest=60-20&store=Factory Direct Collected Store
app.get('/prodimage', async (req, res) => {
    const { img, titel, normal, points, superd, limited, shipping, shippingcomp, shippingest, store } = req.query;
    try {
        
        const squareImagePath = img;
        const squareImage = loadImage(squareImagePath);
        
        const backgroundImagePath = 'back.png';
        const backgroundImage = loadImage(backgroundImagePath);

const canvasWidth = 1920;
const canvasHeight = 1080;
const canvas = createCanvas(canvasWidth, canvasHeight);
const ctx = canvas.getContext('2d');

Promise.all([squareImage, backgroundImage]).then(([squareImg, backgroundImg]) => {
    ctx.drawImage(backgroundImg, 0, 0, canvasWidth, canvasHeight);

    const squareSize = 650;
    const scaledSquareImage = resizeImage(squareImg, squareSize, squareSize);

    const centerX = 1544;
    const centerY = 424;
    const xPos = centerX - squareSize / 2;
    const yPos = centerY - squareSize / 2;

    const borderRadius = 53;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(xPos + borderRadius, yPos);
    ctx.arcTo(xPos + squareSize, yPos, xPos + squareSize, yPos + squareSize, borderRadius);
    ctx.arcTo(xPos + squareSize, yPos + squareSize, xPos, yPos + squareSize, borderRadius);
    ctx.arcTo(xPos, yPos + squareSize, xPos, yPos, borderRadius);
    ctx.arcTo(xPos, yPos, xPos + squareSize, yPos, borderRadius);
    ctx.closePath();
    ctx.clip();

    ctx.drawImage(scaledSquareImage, xPos, yPos, squareSize, squareSize);
    ctx.restore();

    const rtlText = titel;
    const font = '60px Regular';
    const textColor = 'white';
    const maxWidth = 1200;

    ctx.font = font;
    ctx.fillStyle = textColor;
    ctx.textAlign = 'end';
    ctx.textBaseline = 'middle';
    ctx.direction = 'rtl';

    const lines = wrapText(rtlText, ctx, ctx.font, maxWidth);
    const lineHeight = parseInt(font, 10);

    const textX = 1190;
    let textY = 130;

    lines.forEach((line) => {
        ctx.fillText(line, textX, textY);
        textY += lineHeight;
    });

    const textData = [
       // { text: '$30.00', x: 1190, y: 130 }, // titel
        { text: `$${normal}`, x: 386, y: 374 , size: 90, color: 'white'}, // normal
        { text: `$${points}`, x: 302, y: 504 , size: 90, color: 'white'}, // points
        { text: `$${superd}`, x: 278, y: 633 , size: 90, color: 'white'}, // superd
        { text: `$${limited}`, x: 313, y: 763 , size: 90, color: 'white'}, // limited
        { text: `الشحن ${shipping}`, x: 1544, y: 888 , size: 50, color: 'white'}, // shipping
        { text: `مع ${shippingcomp}`, x: 1544, y: 950 , size: 50, color: 'white'}, // shippingComp
        { text: `يتوقع الوصول خلال ${shippingest} يوم`, x: 1544, y: 1015 , size: 50, color: 'white'}, // shippingEst
        //{ text: '$30.00', x: 1190, y: 130 }, // stars
       //{ text: '$30.00', x: 1190, y: 130 }, // rates
        //{ text: '$30.00', x: 1190, y: 130 }, // sales
        { text: store, x: 1544, y: 54 , size: 55, color: 'white'}, // store
    ];
    textData.forEach((data) => {
        ctx.font = `${data.size}px Regular`;
        ctx.fillStyle = data.color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(data.text, data.x, data.y, );
        data.y += data.size;
    });

    const resultDataUrl = canvas.toDataURL('image/jpeg');
    const resultBuffer = Buffer.from(resultDataUrl.split(',')[1], 'base64');
    
    res.status(200).contentType('image/jpeg').send(resultBuffer);
});
    } catch (error) {
        console.error('Error generating image:', error);
        res.status(500).send('Internal Server Error');
    }
});

function resizeImage(image, width, height) {
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0, width, height);
    return canvas;
}

function wrapText(text, ctx, font, maxWidth) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const width = ctx.measureText(currentLine + ' ' + word).width;

        if (width <= maxWidth) {
            currentLine += ' ' + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }

    lines.push(currentLine);
    return lines;
}

app.listen(3000, () => {
    console.log(`Server is running at 3000`);
});