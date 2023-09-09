import { PropsWithChildren } from "react";

export function NavButton({ children, buttonProps }: PropsWithChildren & { buttonProps?: any}) {
return <li>
  <button className="textButton" {...buttonProps}>
    {children}
  </button>
</li>
}