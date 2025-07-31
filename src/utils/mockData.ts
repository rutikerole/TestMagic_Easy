export interface User {           // interface => It ensures every object in your array follows the same shape
    email:string;
    password:string;
    role:"admin"|"tester";
}

export const users: User[] = [   // Hey — this users array should always contain only User objects.
    { email: 'admin@testmagic.com', password: 'admin123', role: 'admin' },
    { email: 'tester@testmagic.com', password: 'tester123', role: 'tester' },
]