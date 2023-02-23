import { PdsAlertSubmitConfirmation } from "./PdsAlertSubmitConfirmation"
import { PdsAlertSubmitFailed } from "./PdsAlertSubmitFailed"
import { PdsAlertSubmitSuccess } from "./PdsAlertSubmitSuccess"

type PdsAlertControllerProps = {
    page: number
    isError: boolean
}

export const PdsAlertController = ({ page, isError }: PdsAlertControllerProps) => {

    return (<div className="max-h-[90%]">
        {page === 1 && <PdsAlertSubmitConfirmation />}
        {(page === 2 && isError === false) && <PdsAlertSubmitSuccess />}
        {(page === 2 && isError === true) && <PdsAlertSubmitFailed />}
    </div>)
}