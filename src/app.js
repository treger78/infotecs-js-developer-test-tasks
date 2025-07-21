import  { Pagination } from "./pagination.js";

const MODAL = document.getElementById('modal');

let allUsers = [];
let sortMode = 'global'; // 'global' или 'page'
let currentSort = {
    column: null,
    direction: 'asc',
};

const getUsers = async () => {
    try {
        const response = await fetch('https://dummyjson.com/users?limit=0');

        if (!response.ok) throw new Error(`Error during request users ${response.status}`);

        const { users } = await response.json();

        return users;
    } catch (error) {
        console.error('Error fetching users: ', error);

        return [];
    }
};

const transformUsers = (users) => {
    const formatAddress = (obj) => {
        if (!obj) return '';

        return [
            obj.address,
            obj.city,
            obj.country,
            obj.postalCode,
            obj.state,
            obj.stateCode,
        ].filter(Boolean).join(', ');
    };

    const formatCoordinates = (coordinates) => {
        return coordinates?.lat && coordinates?.lng ? `${coordinates.lat}, ${coordinates.lng}` : undefined;
    };

    return users.map((user) => {
        return {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            maidenName: user.maidenName,
            age: user.age,
            gender: user.gender,
            email: user.email,
            phone: user.phone,
            username: user.username,
            password: user.password,
            birthDate: user.birthDate,
            image: user.image,
            bloodGroup: user.bloodGroup,
            height: user.height,
            weight: user.weight,
            eyeColor: user.eyeColor,
            hairColor: user.hair.color,
            hairType: user.hair.type,
            university: user.university,
            userAddress: formatAddress(user.address),
            userCoordinates: formatCoordinates(user.address?.coordinates),
            macAddress: user.macAddress,
            ip: user.ip,
            role: user.role,
            ein: user.ein,
            ssn: user.ssn,
            userAgent: user.userAgent,
            companyName: user.company?.name,
            companyDepartment: user.company?.department,
            companyTitle: user.company?.title,
            companyAddress: formatAddress(user.company?.address),
            companyCoordinates: formatCoordinates(user.company?.address?.coordinates),
            bankCardNumber: user.bank?.cardNumber,
            bankCardExpire: user.bank?.cardExpire,
            bankCardType: user.bank?.cardType,
            bankCurrency: user.bank?.currency,
            bankIban: user.bank?.iban,
            cryptoCoin: user.crypto?.coin,
            cryptoWallet: user.crypto?.wallet,
            cryptoNetwork: user.crypto?.network,
        }
    });
};

const getPostsByUserID = async (userID) => {
    try {
        const response = await fetch(`https://dummyjson.com/users/${userID}/posts?limit=0`);

        if (!response.ok) throw new Error(`Error during request users posts ${response.status}`);

        return await response.json();
    } catch (error) {
        console.error('Error fetching posts: ', error);

        return [];
    }
};

const renderTheadData = (thDataArray, pagination) => {
    const theadRow = document.getElementById('users-table-thead-row');
    const fragment = document.createDocumentFragment();

    theadRow.innerHTML = '';

    thDataArray.forEach(columnKey => {
        const th = document.createElement('th');

        th.textContent = columnKey;
        th.style.cursor = 'pointer';

        th.addEventListener('click', () => {
            const newDirection = currentSort.column === columnKey && currentSort.direction === 'asc' 
                ? 'desc' 
                : 'asc';
            
            currentSort = {
                column: columnKey,
                direction: newDirection,
            };

            sortTable(pagination);
        });

        fragment.appendChild(th);
    });

    theadRow.appendChild(fragment);
};

const renderTbodyData = (users) => {
    const tbody = document.getElementById('users-table-tbody');
    const fragment = document.createDocumentFragment();

    tbody.innerHTML = '';

    users.forEach(user => {
        const tr = document.createElement('tr');

        Object.entries(user).forEach(element => {
            const key = element[0];
            const value = element[1];

            const td = document.createElement('td');

            td.textContent = value;
            td.className = key;

            tr.appendChild(td);
        });

        fragment.appendChild(tr);
    });

    tbody.appendChild(fragment);
};

const sortTable = (pagination) => {
    if (!currentSort.column) return;

    // Запоминаем текущую страницу перед сортировкой
    const prevPage = pagination.currentPage;

    if (sortMode === 'global') {
        // Сортировка всех данных
        allUsers.sort((a, b) => compareValues(a, b, currentSort));

        // Возвращаемся на ту же страницу (если она существует)
        const totalPages = pagination.getTotalPages();
        const newPage = Math.min(prevPage, totalPages);

        pagination.goToPage(newPage);

        renderTbodyData(pagination.getPaginatedData(allUsers));
    } else {
        // Сортировка только текущей страницы
        const currentPageData = pagination.getPaginatedData(allUsers);

        currentPageData.sort((a, b) => compareValues(a, b, currentSort));

        renderTbodyData(currentPageData);
    }

    updateSortIndicator();
};

const compareValues = (a, b, sortConfig) => {
    let valueA = a[sortConfig.column];
    let valueB = b[sortConfig.column];

    // Обработка отсутствующих значений
    if (valueA === undefined || valueA === null) valueA = '';
    if (valueB === undefined || valueB === null) valueB = '';

    // Для числовых значений
    if (['id', 'age', 'height', 'weight'].includes(sortConfig.column)) {
        valueA = parseFloat(valueA);
        valueB = parseFloat(valueB);

        if (isNaN(valueA)) valueA = 0;
        if (isNaN(valueB)) valueB = 0;
    }
    // Для дат
    else if (sortConfig.column === 'birthDate') {
        try {
            valueA = new Date(valueA).getTime() || 0;
            valueB = new Date(valueB).getTime() || 0;
        } catch {
            valueA = valueB = 0;
        }
    }
    // Для строк
    else {
        valueA = String(valueA).toLowerCase();
        valueB = String(valueB).toLowerCase();

        return sortConfig.direction === 'asc' 
            ? valueA.localeCompare(valueB) 
            : valueB.localeCompare(valueA);
    }

    // Сравнение чисел/дат
    if (valueA < valueB) return sortConfig.direction === 'asc' ? -1 : 1;
    if (valueA > valueB) return sortConfig.direction === 'asc' ? 1 : -1;

    return 0;
};

const updateSortIndicator = () => {
    const headers = document.querySelectorAll('#users-table-thead-row th');
    
    headers.forEach(header => {
        header.classList.remove('sort-asc', 'sort-desc');
        header.textContent = header.textContent.replace(/ [↑↓]$/, '');

        if (header.textContent === currentSort.column) {
            header.classList.add(`sort-${currentSort.direction}`);
            header.textContent += currentSort.direction === 'asc' ? ' ↑' : ' ↓';
        }
    });
};

const clickUserHandler = () => {
    const tbody = document.getElementById('users-table-tbody');

    tbody.addEventListener('click', async (event) => {
        const target = event.target;

        if (target.tagName !== 'TD') return;

        const userID = Number(target.parentElement.querySelector('.id').textContent);

        const { posts } = await getPostsByUserID(userID);

        if (posts.length < 1) {
            MODAL.style.display = 'none';

            return alert('У пользователя пока нет постов!');
        }

        MODAL.style.display = 'flex';

        renderUserPosts(posts);
    });
};

const closeModalHandlers = () => {
    document.getElementById('close-modal-btn').addEventListener('click', () => {
        MODAL.style.display = 'none';
    });

    MODAL.addEventListener('click', (event) => {
        if (event.target.id === 'modal' || event.target.id === 'posts-container') MODAL.style.display = 'none';
    });
};

const renderUserPosts = (posts) => {
    const postsContainer = document.getElementById('posts-container');

    postsContainer.innerHTML = '';

    posts.forEach(post => {
        const article = document.createElement('article');

        article.innerHTML = `
            <div class="post-header">
                <h3 class="post-title">${post.title}</h3>
            </div>
            <div class="post-body">${post.body}</div>
            <div class="post-tags">
                ${post.tags.map(tag => `<span>#${tag}</span>`).join('')}
            </div>
            <div class="post-reactions">
                <span class="likes">
                    <img src="./src/icons/thumbs-up-solid.svg" class="icon">
                    <span class="count">${post.reactions.likes}</span>
                </span>
                <span class="dislikes">
                    <img src="./src/icons/thumbs-down-solid.svg" class="icon">
                    <span class="count">${post.reactions.dislikes}</span>
                </span>
                <span class="views">
                    <img src="./src/icons/eye-solid.svg" class="icon">
                    <span class="count">${post.views}</span>
                </span>
            </div>
        `;

        postsContainer.appendChild(article);
    });
};

const initUsersTable = async () => {
    allUsers = transformUsers(await getUsers());

    const sortCheckbox = document.getElementById('global-sort-checkbox');

    sortCheckbox.addEventListener('change', (event) => {
        sortMode = event.target.checked ? 'global' : 'page';

        if (currentSort.column) sortTable(pagination);
    });

    const pagination = new Pagination({
        onPageChange: () => {
            if (sortMode === 'page' && currentSort.column) {
                // В режиме page при переключении страницы применяем сортировку
                const currentPageData = pagination.getPaginatedData(allUsers);

                currentPageData.sort((a, b) => compareValues(a, b, currentSort));

                renderTbodyData(currentPageData);
            } else {
                // В режиме global просто отображаем данные
                renderTbodyData(pagination.getPaginatedData(allUsers));
            }
        }
    });

    pagination.setTotalItems(allUsers.length);
    pagination.setupPaginationControls();

    renderTheadData(Object.keys(allUsers[0]), pagination);
    renderTbodyData(pagination.getPaginatedData(allUsers));

    clickUserHandler();
    closeModalHandlers();
};

initUsersTable();
