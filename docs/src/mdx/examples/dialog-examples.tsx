'use client'

import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from 'blackwork'
import { Example } from '../components/example'
import { PropsTable } from '../components/props-table'

const basicCode = `import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from 'blackwork'

export const Example = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes and click save when you are done.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button">Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}`

export const DialogBasicExample = () => (
  <Example title="Usage" code={basicCode}>
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes and click save when you are done.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button type="button">Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </Example>
)

export const DialogPropsTable = () => (
  <PropsTable
    description="The trigger accepts asChild. DialogContent already includes a close button."
    rows={[
      {
        name: 'asChild',
        type: 'boolean',
        defaultValue: 'false',
        description:
          'On DialogTrigger and DialogClose. Merge props onto a real button child.',
      },
      {
        name: 'open',
        type: 'boolean',
        description: 'Controlled open state on Dialog.',
      },
      {
        name: 'defaultOpen',
        type: 'boolean',
        description: 'Uncontrolled initial open state on Dialog.',
      },
      {
        name: 'onOpenChange',
        type: '(open: boolean) => void',
        description: 'Called when the dialog opens or closes.',
      },
    ]}
  />
)
