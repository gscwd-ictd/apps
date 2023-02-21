import { useAppEndStore } from "../../../store/endorsement.store"
import { AppEndAlertConfirmation } from "./AppEndAlertConfirmation"
import { AppEndAlertSuccess } from "./AppEndAlertSuccess"

type AppEndAlertControllerProps = {
    page: number
}

export const AppEndAlertController = ({ page }: AppEndAlertControllerProps) => {

    const selectedApplicants = useAppEndStore(state => state.selectedApplicants)

    return (<div className="max-h-[90%]">
        {page === 1 && <AppEndAlertConfirmation selectedApplicants={selectedApplicants.length} />}
        {page === 2 && <AppEndAlertSuccess />}
    </div>)
}