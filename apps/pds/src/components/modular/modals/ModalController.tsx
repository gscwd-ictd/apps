import { createContext, useContext } from "react";

type ModalControllerProps = {
    page: number;
    action: 'create' | 'update'
}

export const ModalInitialLoadState = createContext(false)

export const ModalController = ({ page, action }: ModalControllerProps): JSX.Element => {

    // const { workExperience } = useContext(PDSContext)

    return <></>
}