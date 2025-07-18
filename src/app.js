const getUsers = async () => {
    try {
        const response = await fetch('https://dummyjson.com/users');

        if (!response.ok) throw new Error('Error during request users');

        return await response.json();
    } catch (error) {
        console.error('Error fetching users:', error);
    }
};

const initUsersTable = async () => {
    const users = await getUsers();

    console.log(users);
};

initUsersTable();
