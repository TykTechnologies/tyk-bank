exports.getAllUsers = () => `
    query {
        users {
            id name
        }
    }
`;