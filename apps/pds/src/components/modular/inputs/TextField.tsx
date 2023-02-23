import React, { InputHTMLAttributes } from 'react';
// import { inputStyles, spanStyles } from './TextField.styles';

export type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
    error?: boolean;
    helper?: string;
    full?: boolean;
    disable?: boolean;
};

export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>((props, ref) => {
    const { error, helper, disable, full, ...rest } = props;

    return (
        <div>
            {/* <input disabled={disable} {...rest} ref={ref} className={inputStyles(props)} />
            <span className={spanStyles({ error })}>{helper}</span> */}
        </div>
    );
});

TextField.defaultProps = {
    error: false,
    helper: '',
    full: false,
    disable: false,
};