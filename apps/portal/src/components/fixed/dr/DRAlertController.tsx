import { useDrStore } from "../../../store/dr.store"
import { DRAlertConfirmation } from "./DRAlertConfirmation"
import { DRAlertSuccess } from "./DRAlertSuccess"

type DRAlertControllerProps = {
    page: number
}

export const DRAlertController = ({ page }: DRAlertControllerProps) => {

    const action = useDrStore(state => state.action)


    return (<div className="max-h-[90%]">
        {page === 1 && <DRAlertConfirmation action={action} />}
        {page === 2 && <DRAlertSuccess />}
    </div>)
}