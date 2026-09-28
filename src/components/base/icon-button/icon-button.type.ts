import type { ComponentPropsWithRef, ReactNode } from 'react';

import type { Button } from '@heroui/react';

type ButtonProps = ComponentPropsWithRef<typeof Button>;

export interface IconButtonProps extends Omit<ButtonProps, 'children' | 'isIconOnly'> {
  /** Accessible label AND default tooltip text. */
  label: string;
  /** Override the tooltip content if it should differ from the aria-label. */
  tooltip?: ReactNode;
  children: ReactNode;
}
