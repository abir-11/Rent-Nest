import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { IUser } from "./tenant.interface"
import config from "../../config";


const createUserDB = async (payload: IUser) => {
    const { name, email, password, profilePhoto, phoneNumber, gender } = payload;
    const isUserExist = await prisma.user.findUnique({
        where: {
            email
        }
    })

    if (isUserExist) {
        throw new Error("User Already Exists");
    }
    const hasPassword = await bcrypt.hash(password, Number(config.bcrypt_salt_rounds));

    const createUSer = await prisma.user.create({
        data: {
            name,
            email,
            password: hasPassword,
            phoneNumber
        }
    });

    await prisma.profile.create({
        data: {
            userId: createUSer.id,
            profilePhoto,
            gender
        }
    })

    const user = await prisma.user.findUniqueOrThrow({
        where: {
            id: createUSer.id,
            email: createUSer.email || email
        },
        omit: {
            password: true
        },
        include: {
            profiles: true
        }
    })
    return user;
}

export const tenantService = {
    createUserDB
}