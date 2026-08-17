'use client'

import {
  Button,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from 'blackwork'
import { Example } from '../components/example'
import { PropsTable } from '../components/props-table'

const basicCode = `import {
  Button,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from 'blackwork'

export const Example = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open sheet</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Inspect item</SheetTitle>
          <SheetDescription>
            Side panels stay attached to one edge of the viewport.
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  )
}`

const sidesCode = `import { Button, Sheet, SheetContent, SheetTrigger } from 'blackwork'

export const Example = () => {
  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">Left</Button>
        </SheetTrigger>
        <SheetContent side="left">...</SheetContent>
      </Sheet>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">Right</Button>
        </SheetTrigger>
        <SheetContent side="right">...</SheetContent>
      </Sheet>
    </>
  )
}`

export const SheetBasicExample = () => (
  <Example title="Usage" code={basicCode}>
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open sheet</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Inspect item</SheetTitle>
          <SheetDescription>
            Side panels stay attached to one edge of the viewport.
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  </Example>
)

export const SheetSidesExample = () => (
  <Example title="Sides" code={sidesCode}>
    {(['left', 'right', 'top', 'bottom'] as const).map((side) => (
      <Sheet key={side}>
        <SheetTrigger asChild>
          <Button variant="outline">{side}</Button>
        </SheetTrigger>
        <SheetContent side={side}>
          <SheetHeader>
            <SheetTitle>{side}</SheetTitle>
            <SheetDescription>Opened from the {side}.</SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    ))}
  </Example>
)

export const SheetPropsTable = () => (
  <PropsTable
    rows={[
      {
        name: 'side',
        type: '"top" | "right" | "bottom" | "left"',
        defaultValue: '"right"',
        description: 'Edge the panel slides from. Set on SheetContent.',
      },
      {
        name: 'closeButtonVisible',
        type: 'boolean',
        defaultValue: 'true',
        description:
          'Corner close button on SheetContent. Set false when you provide your own.',
      },
      {
        name: 'asChild',
        type: 'boolean',
        defaultValue: 'false',
        description: 'On SheetTrigger and SheetClose. Requires a button child.',
      },
      {
        name: 'open',
        type: 'boolean',
        description: 'Controlled open state on Sheet.',
      },
      {
        name: 'onOpenChange',
        type: '(open: boolean) => void',
        description: 'Called when the sheet opens or closes.',
      },
    ]}
  />
)
