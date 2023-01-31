import {
  OnTransactionHandler,
  OnRpcRequestHandler,
} from '@metamask/snap-types';
import { hasProperty, isObject, Json } from '@metamask/utils';

// The API endpoint.
const MODEL_API_ENDPOINT = 'http://127.0.0.1:5000/';
const CURRENT_DATA_ENDPOINT = 'https://api.owlracle.info/v3/eth/gas?accept=70';

export const onRpcRequest: OnRpcRequestHandler = async ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  origin,
  request,
}) => {
  switch (request.method) {
    case 'hello': {
      return 'world!';
    }

    case 'get_state': {
      let state = await wallet.request({
        method: 'snap_manageState',
        params: ['get'],
      });
      if (!state) {
        state = { txnData: [] };
        // initialize state if empty and set default data
        await wallet.request({
          method: 'snap_manageState',
          params: ['update', state],
        });
      }
      return state;
    }

    default: {
      throw new Error('Method not found.');
    }
  }
};

export const onTransaction: OnTransactionHandler = async ({ transaction }) => {
  let state = await wallet.request({
    method: 'snap_manageState',
    params: ['get'],
  });

  if (!state) {
    state = { txnData: [] };
    // initialize state if empty and set default data
    await wallet.request({
      method: 'snap_manageState',
      params: ['update', state],
    });
  }

  const insights: { type: string; params?: Json } = {
    type: 'Gas Fee estimation',
  };

  if (
    !isObject(transaction) ||
    !hasProperty(transaction, 'data') ||
    typeof transaction.data !== 'string'
  ) {
    console.warn('unknown transaction type');
    return { insights };
  }

  // update the state with current transactions
  (state as any).txnData.push({
    from: transaction.from,
    to: transaction.to,
    value: transaction.value,
    timestamp: Date.now(),
  });

  await wallet.request({
    method: 'snap_manageState',
    params: ['update', state],
  });

  const response = await fetch(`${MODEL_API_ENDPOINT}`, {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const currentData = await fetch(CURRENT_DATA_ENDPOINT, {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('API request failed');
  }

  const data = await response.json();
  const current = await currentData.json();

  insights.params = {
    'Average Gas needed': current.avgGas,
    'Current Min per Gas Fee (Gwei)': current.speeds[0].baseFee,
    'Current Max per Gas Fee (Gwei)':
      current.speeds[0].maxFeePerGas + current.speeds[0].maxPriorityFeePerGas,
    'min fee required(Gwei)': current.avgGas * current.speeds[0].baseFee,
    'max fee required(Gwei)':
      current.avgGas *
      (current.speeds[0].maxFeePerGas + current.speeds[0].maxPriorityFeePerGas),
    'expected per gas price(Gwei)': data.expected_cost,
    'expected total gas fee (Gwei)': data.expected_cost * current.avgGas,
    'suggested waiting time': data.suggested_wait,
  };

  return { insights };
};
