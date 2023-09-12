import { PropsWithChildren } from "react";

export function NavButton({ children, buttonProps, classNames = [], liClassNames = [] }: PropsWithChildren & { buttonProps?: any, classNames?: string[], liClassNames?: string[] }) {
  classNames.push('textButton');
  return <li className={liClassNames.join(' ')}>
    <button className={classNames.join(' ')} {...buttonProps}>
      {children}
    </button>
  </li>
}
