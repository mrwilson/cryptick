import { createCanvas, loadImage } from 'canvas';

export async function createMetaImage(clue) {
    const config = {
        clue: {
            fontSize: 90,
        },
    };

    const font = 'Arial';

    const imageCanvas = createCanvas(1200, 630);
    const context = imageCanvas.getContext('2d');

    const gradient = context.createLinearGradient(0, 315, 1200, 315);
    gradient.addColorStop(0, '#9bbcabff');
    gradient.addColorStop(0.4, '#9bbcabff');
    gradient.addColorStop(1, 'white');
    context.fillStyle = gradient;
    context.fillRect(0, 0, 1200, 630);

    context.textAlign = 'left';
    context.textBaseline = 'top';

    context.fillStyle = '#286433';

    context.font = `bold 40px ${font}`;
    context.fillText(`Cryptick | Clue of the Day #${clue.id}`, 40, 40);
    context.fillText(
        `${clue.friendlyDate} | Author: ${clue.author_name}`,
        40,
        550,
    );

    context.font = `bold ${config.clue.fontSize}px ${font}`;

    const lines = clue.clue.match(/.{1,23}(?:\s|$)/g);

    lines.forEach((line, index) => {
        context.fillText(
            line,
            50,
            (630 - config.clue.fontSize * lines.length) / 2 +
                config.clue.fontSize * index,
        );
    });

    context.drawImage(await loadImage('./src/logo.png'), 1075, 25, 100, 100);

    return imageCanvas.toBuffer();
}

export async function createSocialMetaImage(clue) {
    const config = {
        size: {
            x: 1080,
            y: 1440,
        },
        clue: {
            fontSize: 130,
        },
    };

    const font = 'Arial';

    const imageCanvas = createCanvas(config.size.x, config.size.y);
    const context = imageCanvas.getContext('2d');

    const gradient = context.createLinearGradient(
        0,
        config.size.y / 2,
        config.size.x,
        config.size.y / 2,
    );
    gradient.addColorStop(0, '#9bbcabff');
    gradient.addColorStop(0.4, '#9bbcabff');
    gradient.addColorStop(1, 'white');
    context.fillStyle = gradient;
    context.fillRect(0, 0, config.size.x, config.size.y);

    context.textAlign = 'left';
    context.textBaseline = 'top';

    context.fillStyle = '#286433';

    context.font = `bold 60px ${font}`;
    context.fillText(`Cryptick | Clue of the Day #${clue.id}`, 40, 40);
    context.fillText(
        `${clue.friendlyDate} | Author: ${clue.author_name}`,
        40,
        config.size.y - 80,
    );

    context.font = `bold ${config.clue.fontSize}px ${font}`;

    const lines = clue.clue.match(/.{1,14}(?:\s|$)/g);

    lines.forEach((line, index) => {
        context.fillText(
            line,
            50,
            (config.size.y - config.clue.fontSize * lines.length) / 2 +
                config.clue.fontSize * index,
        );
    });

    context.drawImage(
        await loadImage('./src/logo.png'),
        config.size.x - 125,
        25,
        100,
        100,
    );

    return imageCanvas.toBuffer();
}
