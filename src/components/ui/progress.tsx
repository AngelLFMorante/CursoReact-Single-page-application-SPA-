import * as React from "react"
import { Progress as ProgressPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

function Progress({
  className,
  value,
  activeColor = 'bg-primary',
  ...props
  // si añadimos parametros nuevos y dice que no existe en la implementacion de progrees podemos poner & {parametro add}
}: React.ComponentProps<typeof ProgressPrimitive.Root> & { activeColor?: string; }) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "relative flex h-1.5 w-full items-center overflow-x-hidden rounded-full bg-muted",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn(activeColor, ' h-full w-full flex-1 transition-all')} //se ha puesto cn para tailwind
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }
