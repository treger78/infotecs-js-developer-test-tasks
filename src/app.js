const COLLAGE = document.getElementById('collage');
const MODAL = document.getElementById('modal');
const modalImg = document.getElementById('modal-img');
const selectLimit = document.getElementById('imgLimit');

let isPaused = false;

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
    if (isPaused) return;
    if (mode === 'changeLimit') COLLAGE.replaceChildren();

    const response = await requestImages(1);

    if (imgCounter() >= getImgLimitValue()) COLLAGE.firstChild.remove();

    createAndAppendNewImg(response.message);
};

const imgLimitHandler = () => selectLimit.addEventListener('change', () => updateCollage(mode = 'changeLimit'));

const imgClickHanlder = () => {
    COLLAGE.addEventListener('click', (event) => {
        const target = event.target;

        if (target.tagName !== 'IMG') return;

        modalImg.src = target.src;
        MODAL.style.display = 'flex';
        isPaused = true;
    });
};

const closeModalHandlers = () => {
    document.getElementById('close-modal-btn').addEventListener('click', () => {
        MODAL.style.display = 'none';
        isPaused = false;
    });

    MODAL.addEventListener('click', (event) => {
        if (event.target.id === 'modal') {
            MODAL.style.display = 'none';
            isPaused = false;
        }
    });
};

const downloadBtnHandler = () => {
    document.getElementById('download-btn').addEventListener('click', async () => {
        const response = await fetch(modalImg.src);
        const blob = await response.blob();

        const blobURL = URL.createObjectURL(blob);
        const a = document.createElement('a');

        a.href = blobURL;
        a.download = 'dog.jpg';

        document.body.append(a);

        a.click();

        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(blobURL);
        }, 100);
    });
};

const initCollage = async () => {
    const response = await requestImages(getImgLimitValue());

    createAndAppendNewImg(response.message);

    imgClickHanlder();
    closeModalHandlers();
    downloadBtnHandler();
    imgLimitHandler();

    setInterval(() => {
        updateCollage();
    }, 3000);
};

initCollage();
