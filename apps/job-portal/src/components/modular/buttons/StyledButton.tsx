/* eslint-disable react/display-name */
import React, { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import { styles } from "./ButtonStyles";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {

    variant?: "primary" | "secondary" | "success" | "warning" | "danger" | "info" | "light" | "dark" | 'theme';
    isDisabled?: boolean;
    strong?: boolean
    children: React.ReactNode
    capital?: boolean
    fluid?: boolean
    // className?: string
};

export const StyledButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (props, ref) => {
        const { isDisabled, variant = "primary", strong, children, capital, fluid, ...rest } = props;

        return <button {...rest} ref={ref} className={styles(props)}>{children}</button>;
    }
);
