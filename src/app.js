const COLLAGE = document.getElementById('collage');
const MODAL = document.getElementById('modal');
const modalImg = document.getElementById('modal-img');
const selectLimit = document.getElementById('img-limit');

let isPaused = false;

const getImgLimitValue = () => selectLimit.value;

const imgCounter = () => COLLAGE.querySelectorAll('img').length;

const requestImages = async (imgLimitNumber) => {
    try {
        const response = await fetch(`https://dog.ceo/api/breeds/image/random/${imgLimitNumber}`);

        if (!response.ok) throw new Error('Error during request images');

        return await response.json();
    } catch (error) {
        console.error('Error fetching images:', error);

        return { message: [] };
    }
};

const createAndAppendNewImg = (imgArray) => {
    imgArray.forEach(image => {
        const img = document.createElement('img');

        img.src = image;
        img.alt = 'Random dog image';

        COLLAGE.append(img);
    });
};

const updateCollage = async (mode = 'update') => {
    if (isPaused) return;
    if (mode === 'changeLimit') COLLAGE.replaceChildren();

    const response = await requestImages(1);

    if (imgCounter() >= getImgLimitValue()) COLLAGE?.firstChild.remove();

    createAndAppendNewImg(response.message);
};

const imgLimitHandler = () => selectLimit.addEventListener('change', () => updateCollage('changeLimit'));

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
        try {
            const response = await fetch(modalImg.src);
            const blob = await response.blob();

            const blobURL = URL.createObjectURL(blob);
            const a = document.createElement('a');

            a.href = blobURL;
            a.download = 'dog.jpg';
            a.style.display = 'none';

            document.body.append(a);

            a.click();

            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(blobURL);
            }, 100);   
        } catch (error) {
            console.error('Download failed:', error);
        }
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
