export type UserData = {
    id: string,
    userName: string;
    roomName: string;
}

//記錄使用者資訊

export default class UserService {
    private userMap: Map<string, UserData>
    constructor (){
        this.userMap = new Map();
    }

    addUser(data: UserData) {
        this.userMap.set(data.id, data)
    }

    removeUser(id: string) {
        this.userMap.has(id) && this.userMap.delete(id);
    }

    getUser(id: string) {
        if(!this.userMap.has(id)) return null;
        return this.userMap.get(id) || null
    }

    userDataInfoHandler(id: string, userName: string, roomName: string): UserData {
        return {
            id,
            userName,
            roomName
        }
    }
}