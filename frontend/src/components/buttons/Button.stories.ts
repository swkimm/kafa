// Button.stories.tsx
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline'
import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import Button from './Button'

const meta = {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: [
        'default',
        'roundLg',
        'roundFull',
        'outlineWithDarkHover',
        'outlineWithLightHover',
        'reverse',
        'prevNext',
        'icon'
      ]
    },
    label: {
      control: 'text'
    },
    icon: {
      control: 'text'
    },
    onClick: { action: 'clicked' },
    onClickPrev: { action: 'previous button clicked' },
    onClickNext: { action: 'next button clicked' }
  },
  tags: ['autodocs']
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Button'
  }
}

export const RoundLg: Story = {
  args: {
    variant: 'roundLg',
    label: 'Button'
  }
}

export const RoundFull: Story = {
  args: {
    variant: 'roundFull',
    label: 'Button'
  }
}
export const OutlineWithDarkHover: Story = {
  args: {
    variant: 'outlineWithDarkHover',
    label: 'Button'
  }
}

export const OutlineWithLightHover: Story = {
  args: {
    variant: 'outlineWithLightHover',
    label: 'Button'
  }
}

export const Reverse: Story = {
  args: {
    variant: 'reverse',
    label: 'Button'
  }
}

export const PrevNext: Story = {
  args: {
    variant: 'prevNext'
  },
  argTypes: {
    label: {
      table: {
        disable: true
      }
    }
  }
}

export const Icon: Story = {
  args: {
    variant: 'icon',
    label: 'Download',
    icon: React.createElement(ArrowDownTrayIcon, {
      className: 'h-6 w-6 text-gray-500'
    })
  },
  argTypes: {
    icon: { control: { type: 'object' } } // JSX 요소를 입력받기 위한 설정
  }
}
