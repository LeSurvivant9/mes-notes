import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { z } from "zod";
import { UserSchema } from "@/schemas";

interface UserInfoProps {
  user?: z.infer<typeof UserSchema>;
  label: string;
}

export const UserInfo = ({ user, label }: UserInfoProps) => {
  return (
    <Card className={"relative mx-4 mb-4 w-screen shadow-md"}>
      <CardHeader>
        <p className={"text-2xl font-semibold text-center"}>{label}</p>
      </CardHeader>
      <CardContent className={"space-y-4"}>
        <div
          className={
            "flex flex-row items-center justify-between rounded-lg border p-3 shadow-md"
          }
        >
          <p className={"text-sm font-medium"}>ID</p>
          <p
            className={
              "truncate text-s max-w-[180pxx] font-mono p-1 bg-slate-100 rounded-md"
            }
          >
            {user?.id}
          </p>
        </div>
        <div
          className={
            "flex flex-row items-center justify-between rounded-lg border p-3 shadow-md"
          }
        >
          <p className={"text-sm font-medium"}>Name</p>
          <p
            className={
              "truncate text-s max-w-[180pxx] font-mono p-1 bg-slate-100 rounded-md"
            }
          >
            {user?.name}
          </p>
        </div>
        <div
          className={
            "flex flex-row items-center justify-between rounded-lg border p-3 shadow-md"
          }
        >
          <p className={"text-sm font-medium"}>Email</p>
          <p
            className={
              "truncate text-s max-w-[180pxx] font-mono p-1 bg-slate-100 rounded-md"
            }
          >
            {user?.email}
          </p>
        </div>
        <div
          className={
            "flex flex-row items-center justify-between rounded-lg border p-3 shadow-md"
          }
        >
          <p className={"text-sm font-medium"}>Role</p>
          <p
            className={
              "truncate text-s max-w-[180pxx] font-mono p-1 bg-slate-100 rounded-md"
            }
          >
            {user?.role}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
