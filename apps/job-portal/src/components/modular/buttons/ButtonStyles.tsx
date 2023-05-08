import cx from 'classnames'
import { ButtonProps } from './StyledButton'


export const styles = ({ variant, strong, capital, fluid, disabled }: ButtonProps) => {
    return cx({

        'border px-3 py-2 text-sm shadow rounded-lg': true,
        'border bg-gray-300 cursor-not-allowed text-white': disabled,
        'w-full': fluid,
        'uppercase': capital,
        'font-bold': strong,
        'bg-blue-400 text-white active:scale-90': variant === 'primary' && !disabled,
        'bg-green-400  text-white active:scale-90': variant === 'secondary' && !disabled,
        'bg-green-600 text-white active:scale-90': variant === 'success' && !disabled,
        'bg-orange-400 text-white active:scale-90': variant === 'warning' && !disabled,
        'bg-red-600 text-white active:scale-90': variant === 'danger' && !disabled,
        'bg-white text-gray-400 active:scale-90': variant === 'light' && !disabled,
        'bg-gray-700 text-white active:scale-90': variant === 'dark' && !disabled,
        'bg-indigo-700 text-white active:scale-90': variant === 'theme' && !disabled,
        'font-semibold': strong
    })
}