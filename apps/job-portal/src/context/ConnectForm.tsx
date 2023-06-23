import { useFormContext } from 'react-hook-form'

type ConnectFormProps = {
  children: any
}

export const ConnectForm = ({ children }: ConnectFormProps): JSX.Element => {
  const methods = useFormContext()

  return children({ ...methods })
}
