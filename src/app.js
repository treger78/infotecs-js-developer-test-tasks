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

//TODO: подумать стоит ли действительно преобразовывать данные
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

const renderTheadData = (thDataArray) => {
    const theadRow = document.getElementById('users-table-thead-row');
    const fragment = document.createDocumentFragment();

    thDataArray.forEach(element => {
        const th = document.createElement('th');

        th.textContent = element;

        fragment.appendChild(th);
    });

    theadRow.appendChild(fragment);
};

const renderTbodyData = (users) => {
    const tbody = document.getElementById('users-table-tbody');
    const fragment = document.createDocumentFragment();

    users.forEach(user => {
        const tr = document.createElement('tr');

        Object.values(user).forEach(value => {
            const td = document.createElement('td');

            td.textContent = value;

            tr.appendChild(td);
        });

        fragment.appendChild(tr);
    });

    tbody.appendChild(fragment);
};

const initUsersTable = async () => {
    const users = transformUsers(await getUsers());

    renderTheadData(Object.keys(users[0]));
    renderTbodyData(users);

    //const posts = await getPostsByUserID(2);
    //console.log(posts);
};

initUsersTable();
