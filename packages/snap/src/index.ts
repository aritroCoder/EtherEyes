import {
  OnTransactionHandler,
  OnRpcRequestHandler,
} from '@metamask/snap-types';
import { OnCronjobHandler } from '@metamask/snaps-types';
import { hasProperty, isObject, Json } from '@metamask/utils';

// Transaction Urgency
let urgency = 60;

// The API endpoint.
const API_KEY = '57418dae76c24975b8c8c60e23bb6370';
const MODEL_API_ENDPOINT = 'http://127.0.0.1:5000/';
const CURRENT_DATA_ENDPOINT = `https://api.owlracle.info/v3/eth/gas?accept=${urgency}&apikey=${API_KEY}`;

// cronjob notification enabler
let notifToggle = false;

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

    case 'notif_toggle_true': {
      console.log('Notification toggled to true');
      notifToggle = true; // toggle the notification
      console.log({ notifToggle });
      return notifToggle;
    }

    case 'notif_toggle_false': {
      console.log('Notification toggled to false');
      notifToggle = false; // toggle the notification
      console.log({ notifToggle });
      return notifToggle;
    }

    case 'set_urgency_35': {
      urgency = 35;
      return urgency;
    }

    case 'set_urgency_60': {
      urgency = 60;
      return urgency;
    }

    case 'set_urgency_90': {
      urgency = 90;
      return urgency;
    }

    case 'set_urgency_100': {
      urgency = 100;
      return urgency;
    }

    case 'call_api': {
      console.log(
        `Called inside custom api call: notifToggle = ${notifToggle}`,
      );
      const currentData = await fetch(CURRENT_DATA_ENDPOINT, {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const current = await currentData.json();
      return wallet.request({
        method: 'snap_notify',
        params: [
          {
            type: 'native',
            message: `Current gasfee is ${current.speeds[0].baseFee} Gwei`,
          },
        ],
      });
    }

    default: {
      throw new Error('Method not found.');
    }
  }
};

export const onCronjob: OnCronjobHandler = async ({ request }) => {
  switch (request.method) {
    case 'exampleMethodOne': {
      console.log({ notifToggle });
      if (notifToggle) {
        const currentData = await fetch(CURRENT_DATA_ENDPOINT, {
          method: 'get',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const current = await currentData.json();
        return wallet.request({
          method: 'snap_notify',
          params: [
            {
              type: 'native',
              message: `Current gasfee is ${current.speeds[0].baseFee} Gwei`,
            },
          ],
        });
      }
      return 0; // basically do nothing
    }

    default:
      throw new Error('Method not found.');
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
