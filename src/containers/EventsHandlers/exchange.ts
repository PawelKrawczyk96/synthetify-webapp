import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { assets, exchangeAccount, state } from '@selectors/exchange'
import { status } from '@selectors/solanaConnection'
import { actions } from '@reducers/exchange'
import { Status } from '@reducers/solanaConnection'
import { DEFAULT_PUBLICKEY } from '@consts/static'
import { getCurrentExchangeProgram } from '@web3/programs/exchange'
import { getOracleProgram } from '@web3/programs/oracle'
import { getCurrentSolanaConnection } from '@web3/connection'
import { BN } from '@synthetify/sdk'
import { parsePriceData } from '@pythnetwork/client'

const ExhcangeEvents = () => {
  const dispatch = useDispatch()
  const networkStatus = useSelector(status)
  const exchangeState = useSelector(state)
  const userAccount = useSelector(exchangeAccount)
  const allAssets = useSelector(assets)
  const exchangeProgram = getCurrentExchangeProgram()
  React.useEffect(() => {
    if (
      userAccount.address.equals(DEFAULT_PUBLICKEY) ||
      !exchangeProgram ||
      networkStatus !== Status.Initalized
    ) {
      return
    }
    const connectEvents = () => {
      exchangeProgram.onAccountChange(userAccount.address, a => {
        dispatch(
          actions.setExchangeAccount({
            address: userAccount.address,
            collaterals: a.collaterals.slice(0, a.head),
            debtShares: a.debtShares,
            userStaking: a.userStakingData
          })
        )
      })
    }
    connectEvents()
  }, [dispatch, userAccount.address.toString(), exchangeProgram, networkStatus])

  React.useEffect(() => {
    if (!exchangeProgram || networkStatus !== Status.Initalized) {
      return
    }
    const connectEvents = () => {
      exchangeProgram.onStateChange(state => {
        dispatch(actions.setState(state))
      })
    }
    connectEvents()
  }, [dispatch, exchangeProgram, networkStatus])

  React.useEffect(() => {
    const oracleProgram = getOracleProgram()
    const connection = getCurrentSolanaConnection()

    if (
      allAssets.length === 0 ||
      !oracleProgram ||
      networkStatus !== Status.Initalized ||
      !connection
    ) {
      return
    }
    const connectEvents = () => {
      allAssets.forEach((asset, index) => {
        connection.onAccountChange(asset.feedAddress, accountInfo => {
          const data = parsePriceData(accountInfo.data)
          dispatch(
            actions.setAssetPrice({ tokenIndex: index, price: new BN(data.price * 1e6) })
          )
        })
      })
    }
    connectEvents()
  }, [dispatch, allAssets.length, networkStatus])

  React.useEffect(() => {
    if (
      !exchangeProgram ||
      networkStatus !== Status.Initalized ||
      exchangeState.assetsList.equals(DEFAULT_PUBLICKEY)
    ) {
      return
    }
    const connectEvents = () => {
      exchangeProgram.onAssetsListChange(exchangeState.assetsList, assets => {
        // const parsedData = parseTokenAccountData(accountInfo.data)
        dispatch(actions.mergeAssets(assets.assets.slice(0, assets.headAssets)))
        dispatch(actions.mergeSynthetics(assets.synthetics.slice(0, assets.headSynthetics)))
        dispatch(actions.mergeCollaterals(assets.collaterals.slice(0, assets.headCollaterals)))
      })
    }
    connectEvents()
  }, [dispatch, exchangeState.assetsList.toString(), networkStatus])

  return null
}

export default ExhcangeEvents
