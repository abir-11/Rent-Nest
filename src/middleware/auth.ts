
import { Request } from 'express';
import { Role } from '../../prisma/generated/prisma/enums';

declare global{
    namespace Express{
        interface   Request{
            user?:{
                email:string,
                name:string,
                id:string,
                role:Role
            }
        }
    }
}