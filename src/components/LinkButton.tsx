import type { ReactNode } from "react";

interface LinkButtonProps {
    href: string,
    children: ReactNode,
    className?: string
}

const LinkButton = (props: LinkButtonProps) => {
    const defaultClasses = "flex items-center cursor-pointer no-underline hover:text-blue-600";
    const combinedClasses = props.className || defaultClasses;
    
    return (
        <a className={combinedClasses} href={props.href}>
            {props.children}
        </a>
    );
};

export default LinkButton;