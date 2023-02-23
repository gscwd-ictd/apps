import { PermanentAddressBI } from './PermanentAddress'
import { ResidentialAddressBI } from './ResidentialAddress'

export const AddressBI = (): JSX.Element => {
  return (
    <>
      <ResidentialAddressBI />
      <PermanentAddressBI />
    </>
  )
}
