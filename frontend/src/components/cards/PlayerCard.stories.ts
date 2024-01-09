// PlayerCard.stories.ts
import { RosterType } from '@/commons/interfaces/roster/roster'
import type { Meta, StoryObj } from '@storybook/react'
import PlayerCard from './PlayerCard'

// Ensure this path is correct

const meta: Meta = {
  title: 'Components/PlayerCard',
  component: PlayerCard,
  parameters: {
    docs: {
      story: {
        inline: false,
        iframeHeight: 600
      }
    }
  },
  argTypes: {
    playerData: {
      control: 'object',
      description: 'Data for the player card'
    },
    onClick: {
      action: 'clicked',
      description: 'Function to handle click events'
    }
  },
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof PlayerCard>

export const Default: Story = {
  args: {
    playerData: {
      id: 1,
      name: '홍길동',
      globalName: 'Hong Gildong',
      profileImgUrl: '/people_alt.webp',
      rosterType: RosterType.Athlete, // Use enum value here
      Athlete: {
        backNumber: 10,
        position: {
          offence: 'Striker',
          defense: 'Goalkeeper',
          special: 'Captain'
        },
        weight: 80,
        height: 180
      }
    },
    onClick: () => console.log('Player clicked')
  }
}
