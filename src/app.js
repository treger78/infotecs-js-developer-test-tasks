const initCollage = async () => {
    const requestImages = await fetch('https://dog.ceo/api/breeds/image/random/3');
    const response = await requestImages.json();

    const collage = document.getElementById('collage');

    response.message.forEach(image => {
        const img = document.createElement('img');

        img.src = image;

        collage.append(img);
    });
};

initCollage();
