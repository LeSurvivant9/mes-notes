import prisma from "@/lib/prisma";

const GradesPage = async () => {
    const users= await prisma.user.findMany()
    return (
        <div>
            {JSON.stringify(users)}
        </div>
    );
};

export default GradesPage;