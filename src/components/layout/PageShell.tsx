import { forwardRef, type ReactNode } from 'react';

type PageShellProps = {
  children: ReactNode;
};

const PageShell = forwardRef<HTMLElement, PageShellProps>(function PageShell(
  { children },
  ref,
) {
  return <main ref={ref}>{children}</main>;
});

export default PageShell;
