'use client';

import { Button, Tooltip } from '@heroui/react';

import type { IconButtonProps } from './icon-button.type';

/**
 * Accessibility-first wrapper around HeroUI's icon-only Button.
 *
 * Enforces the design rule that every icon-only button must carry an aria-label
 * AND be wrapped in a Tooltip. Use this everywhere an icon-only button is
 * needed so we don't rely on per-call-site discipline.
 */
export function IconButton({ children, label, tooltip, ...buttonProps }: IconButtonProps) {
  return (
    <Tooltip>
      <Button aria-label={label} isIconOnly {...buttonProps}>
        {children}
      </Button>
      <Tooltip.Content>{tooltip ?? label}</Tooltip.Content>
    </Tooltip>
  );
}
