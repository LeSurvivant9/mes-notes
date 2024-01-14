import React from 'react';
import {Button} from "@/components/ui/button";
import {HashLoader} from "react-spinners";

interface SubmitButtonProps {
    isPending?: boolean;
    children?: React.ReactNode;
}

const SubmitButton = ({children, isPending}: SubmitButtonProps) => {

    return (
        <Button disabled={isPending} type={"submit"}
                className={"cursor-pointer gap-x-2 content-center items-center justify-between"}>
            {isPending ? (<HashLoader size={25} color={"#ffff"}/>) : ''}{children}
        </Button>
    )
};

export default SubmitButton;