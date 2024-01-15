import React from 'react';
import {Button} from "@/components/ui/button";
import {HashLoader} from "react-spinners";
import {clsx} from "clsx";

interface SubmitButtonProps {
    childrenProps?: string;
    isPending?: boolean;
    children?: React.ReactNode;
}

const SubmitButton = ({children, isPending, childrenProps}: SubmitButtonProps) => {

    return (
        <Button disabled={isPending} type={"submit"}
                className={clsx(childrenProps, "cursor-pointer gap-x-2 content-center items-center justify-center")}>
            {isPending ? (<HashLoader size={25} color={"#ffff"}/>) : ''}{children}
        </Button>
    )
};

export default SubmitButton;