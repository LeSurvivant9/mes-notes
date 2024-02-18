import { CardWrapper } from "@/components/auth/card-wrapper";
import { FaExclamationTriangle } from "react-icons/fa";

export const ErrorCard = () => {
  return (
    <CardWrapper
      headerLabel={"Oops! Quelque chose s'est mal passé."}
      backButtonLabel={"Retour à la connexion"}
      backButtonHref={"/auth/login"}
    >
      <div className={"w-full flex items-center justify-center"}>
        <FaExclamationTriangle className={"text-destructive"} />
      </div>
    </CardWrapper>
  );
};
