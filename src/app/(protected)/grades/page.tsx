import {db} from "@/lib/db";

const GradesPage = async () => {
    const users= await db.user.findMany()
    return (
        <div>
            {JSON.stringify(users)}
        </div>
    );
};

export default GradesPage;