import { PropsWithChildren } from "react";

export function NavButton({ children, buttonProps, classNames = [] }: PropsWithChildren & { buttonProps?: any, classNames?: string[] }) {
  classNames.push('textButton');
  return <li>
    <button className={classNames.join(' ')} {...buttonProps}>
      {children}
    </button>
  </li>
}
