import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { withKnobs } from '@storybook/addon-knobs'
import MaxButton from './MaxButton'
import { colors } from '@static/theme'
storiesOf('buttons/MaxButton', module)
  .addDecorator(withKnobs)
  .add('maxButton', () => (
    <div style={{ backgroundColor: colors.navy.component, padding: '10px' }}>
      <MaxButton onClick={action('clicked')} />
    </div>
  ))
  .add('maxButton:disabled', () => (
    <div style={{ backgroundColor: colors.navy.component, padding: '10px' }}>
      <MaxButton disabled={true} onClick={action('clicked disabled')} />
    </div>
  ))
