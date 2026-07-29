import { prisma } from "../../lib/prisma"

const getAllUser = async (adminId: string) => {

    if (!adminId) {
        throw new Error("Admin ID is required");
    }

    const admin = await prisma.user.findUnique({
        where: {
            id: adminId
        }
    });

    if (!admin) {
        throw new Error("Admin user not found");
    }

    if (admin.role !== "ADMIN") {
        throw new Error(
            "You are not admin. Only admin can get all users"
        );
    }

    const users = await prisma.user.findMany({
        omit: {
            password: true
        },
        orderBy: {
            createdAt: "desc"
        }
    });

    return users;
};

export const adminService={
    getAllUser
}