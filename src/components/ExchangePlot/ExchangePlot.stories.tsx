import React from 'react'
import { storiesOf } from '@storybook/react'
import { withKnobs } from '@storybook/addon-knobs'
import ExchangePlot from './ExchangePlot'
import { BN } from '@project-serum/anchor'

storiesOf('ui/exchangePlot', module)
  .addDecorator(withKnobs)
  .add('default', () => (
    <div style={{ width: 500 }}>
      <ExchangePlot
        tokenName='xBTC'
        supply={{ val: new BN(123456789), scale: 6 }}
        maxSupply={{ val: new BN(123456789), scale: 6 }}
        assetAddress='qwertyuiopasdfghjklzxcvbnm'
        price={{ val: new BN(123456789), scale: 6 }}
      />
    </div>
  ))