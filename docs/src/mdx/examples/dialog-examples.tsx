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
  <Example title="Usage" titleZh="用法" code={basicCode}>
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
    descriptionZh="触发器支持 asChild。DialogContent 已经包含关闭按钮。"
    rows={[
      {
        name: 'asChild',
        type: 'boolean',
        defaultValue: 'false',
        description:
          'On DialogTrigger and DialogClose. Merge props onto a real button child.',
        descriptionZh:
          '用于 DialogTrigger 和 DialogClose，将 props 合并到真正的 button 子节点。',
      },
      {
        name: 'open',
        type: 'boolean',
        description: 'Controlled open state on Dialog.',
        descriptionZh: 'Dialog 的受控打开状态。',
      },
      {
        name: 'defaultOpen',
        type: 'boolean',
        description: 'Uncontrolled initial open state on Dialog.',
        descriptionZh: 'Dialog 非受控模式的初始打开状态。',
      },
      {
        name: 'onOpenChange',
        type: '(open: boolean) => void',
        description: 'Called when the dialog opens or closes.',
        descriptionZh: 'Dialog 打开或关闭时调用。',
      },
    ]}
  />
)
