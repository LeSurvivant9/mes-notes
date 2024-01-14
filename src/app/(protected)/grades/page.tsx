import prisma from "@/lib/prisma";

const GradesPage = async () => {
    const users= await prisma.user.findMany()
    return (
        <div className={"w-full h-full break-words overflow-auto"}>
            {JSON.stringify(users)}
        </div>
    );
};

export default GradesPage;