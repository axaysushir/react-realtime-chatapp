const users = []
const addUser = ({id, name, room}) => {
    name = name.trim().toLowerCase();
    room = room.trim().toLowerCase();

    const existingUser = users.find((user) => user.name === name && user.room === room);

    if(existingUser) {
        return {error: 'Username is taken'}
    }

    const user = {id, name, room};
    user.push(user);
    return {user};
}

const removeUser = (id) => {
    const index = user.findIndex((user) => user.id === id);
    if (index !== -1){
        return user.splice(index, 1)[0];
    }
}

const getUser = (id) => users.find((user) => user.id == id) ;

const getUserInRoom = (room) => users.filter((user) => user.room == room);

module.exports = {addUser, getUser, removeUser, getUserInRoom}; 
    
