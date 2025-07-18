const COLLAGE = document.getElementById('collage');
const selectLimit = document.getElementById('imgLimit');

const getImgLimitValue = () => selectLimit.value;

const imgCounter = () => document.querySelectorAll('img').length;

const requestImages = async (imgLimitNumber) => {
    return (await fetch(`https://dog.ceo/api/breeds/image/random/${imgLimitNumber}`)).json();
};

const createAndAppendNewImg = (imgArray) => {
    imgArray.forEach(image => {
        const img = document.createElement('img');

        img.src = image;

        COLLAGE.append(img);
    });
};

const updateCollage = async (mode = 'update') => {
    if (mode === 'changeLimit') COLLAGE.replaceChildren();

    const response = await requestImages(1);

    if (imgCounter() >= getImgLimitValue()) COLLAGE.firstChild.remove();

    createAndAppendNewImg(response.message);
};

const imgLimitHandler = () => selectLimit.addEventListener('change', () => updateCollage(mode = 'changeLimit'));

const initCollage = async () => {
    const response = await requestImages(getImgLimitValue());

    createAndAppendNewImg(response.message);

    imgLimitHandler();

    setInterval(() => {
        updateCollage();
    }, 3000);
};

initCollage();
