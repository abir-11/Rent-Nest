import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { IProfileUpdate, IUser } from "./tenant.interface"
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

const getMe = async (userId: string) => {
    const user = await prisma.user.findUniqueOrThrow({
        where: {
            id: userId
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
const updateMyProfile = async (userId: string, payload: IProfileUpdate) => {
    const { name, profilePhoto, bio, address, phoneNumber } = payload;

    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
            name,
            phoneNumber
        },
        omit: {
            password: true
        }
    });

    const updatedProfile = await prisma.profile.upsert({
        where: { 
            userId: userId 
        },
        create: {
            userId: userId, 
            profilePhoto,
            bio,
            address
        },
        update: {
            profilePhoto,
            bio,
            address
        }
    });

    return {
        ...updatedUser,
        profiles: updatedProfile
    };
}

export const tenantService = {
    createUserDB,
    getMe,
    updateMyProfile
}