import {
  OnTransactionHandler,
  OnRpcRequestHandler,
} from '@metamask/snap-types';
import { OnCronjobHandler } from '@metamask/snaps-types';
import { hasProperty, isObject } from '@metamask/utils';
import jsonData from '../key.json';
import { panel, heading, text } from '@metamask/snaps-ui';

// Transaction Urgency
let urgency = 60;

// The API endpoint.
const MODEL_API_ENDPOINT = 'http://127.0.0.1:5000/';
const CURRENT_DATA_ENDPOINT = `https://api.owlracle.info/v3/eth/gas?accept=${urgency}&apikey=${jsonData.key}`;

// cronjob notification enabler
let notifToggle = false;

// store predicted lowest eth
let lowEth = 0;

export const onRpcRequest: OnRpcRequestHandler = async ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  origin,
  request,
}) => {
  switch (request.method) {
    case 'notif_toggle_true': {
      console.log('Notification toggled to true');
      notifToggle = true; // toggle the notification
      console.log({ notifToggle });

      let state: { notifToggle: boolean; urgency: number; lowEth: number };

      state = (await snap.request({
        method: 'snap_manageState',
        params: { operation: 'get' },
      })) as { notifToggle: boolean; urgency: number; lowEth: number };

      if (!state) {
        state = {
          notifToggle: true,
          urgency,
          lowEth,
        };
      }
      state.notifToggle = true;

      await snap.request({
        method: 'snap_manageState',
        params: { operation: 'update', newState: state },
      });

      return notifToggle;
    }

    case 'notif_toggle_false': {
      console.log('Notification toggled to false');
      notifToggle = false; // toggle the notification
      console.log({ notifToggle });

      let state: { notifToggle: boolean; urgency: number; lowEth: number };

      state = (await snap.request({
        method: 'snap_manageState',
        params: { operation: 'get' },
      })) as { notifToggle: boolean; urgency: number; lowEth: number };

      if (!state) {
        state = {
          notifToggle: false,
          urgency,
          lowEth,
        };
      }
      state.notifToggle = false;

      await snap.request({
        method: 'snap_manageState',
        params: { operation: 'update', newState: state },
      });

      return notifToggle;
    }

    case 'set_urgency_35': {
      urgency = 35;

      let state: { notifToggle: boolean; urgency: number; lowEth: number };

      state = (await snap.request({
        method: 'snap_manageState',
        params: { operation: 'get' },
      })) as { notifToggle: boolean; urgency: number; lowEth: number };

      if (!state) {
        state = {
          notifToggle,
          urgency: 35,
          lowEth,
        };
      }
      state.urgency = 35;

      await snap.request({
        method: 'snap_manageState',
        params: {operation: 'update', newState: state},
      });

      return urgency;
    }

    case 'set_urgency_60': {
      urgency = 60;

      let state: { notifToggle: boolean; urgency: number; lowEth: number };

      state = (await snap.request({
        method: 'snap_manageState',
        params: {operation: 'get'},
      })) as { notifToggle: boolean; urgency: number; lowEth: number };

      if (!state) {
        state = {
          notifToggle,
          urgency: 60,
          lowEth,
        };
      }
      state.urgency = 60;

      await snap.request({
        method: 'snap_manageState',
        params: {operation: 'update', newState: state},
      });

      return urgency;
    }

    case 'set_urgency_90': {
      urgency = 90;

      let state: { notifToggle: boolean; urgency: number; lowEth: number };

      state = (await snap.request({
        method: 'snap_manageState',
        params: {operation:'get'},
      })) as { notifToggle: boolean; urgency: number; lowEth: number };

      if (!state) {
        state = {
          notifToggle,
          urgency: 90,
          lowEth,
        };
      }
      state.urgency = 90;

      await snap.request({
        method: 'snap_manageState',
        params: {operation: 'update', newState: state},
      });

      return urgency;
    }

    case 'set_urgency_100': {
      urgency = 100;

      let state: { notifToggle: boolean; urgency: number; lowEth: number };

      state = (await snap.request({
        method: 'snap_manageState',
        params: {operation: 'get'},
      })) as { notifToggle: boolean; urgency: number; lowEth: number };

      if (!state) {
        state = {
          notifToggle,
          urgency: 100,
          lowEth,
        };
      }
      state.urgency = 100;

      await snap.request({
        method: 'snap_manageState',
        params: {operation: 'update', newState: state},
      });

      return urgency;
    }

    case 'call_api': {
      // get data from state whenever snap is invoked as snaps executions are ephemeral
      let state: { notifToggle: boolean; urgency: number; lowEth: number };

      state = (await snap.request({
        method: 'snap_manageState',
        params: {operation: 'get'},
      })) as { notifToggle: boolean; urgency: number; lowEth: number };

      if (!state) {
        state = {
          notifToggle,
          urgency,
          lowEth,
        };
      }

      notifToggle = state.notifToggle;
      urgency = state.urgency;
      lowEth = state.lowEth;

      await snap.request({
        method: 'snap_manageState',
        params: {operation: 'update', newState: state},
      });

      console.log(
        `Called inside custom api call: notifToggle = ${notifToggle} and urgency = ${urgency}`,
      );
      const currentData = await fetch(CURRENT_DATA_ENDPOINT, {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const current = await currentData.json();
      if (Math.abs(current.speeds[0].baseFee - lowEth) < urgency / 38) {
        return snap.request({
          method: 'snap_notify',
          params:{
              type: 'native',
              message: `Gasfee is low! Pay now at ${current.speeds[0].baseFee} Gwei`,
            },
        });
      }
      return snap.request({
        method: 'snap_notify',
        params:{
            type: 'native',
            message: `Current gasfee is ${current.speeds[0].baseFee} Gwei`,
          },
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
      // get data from state whenever snap is invoked as snaps executions are ephemeral
      let state: { notifToggle: boolean; urgency: number; lowEth: number };

      state = (await snap.request({
        method: 'snap_manageState',
        params: {operation: 'get'},
      })) as { notifToggle: boolean; urgency: number; lowEth: number };

      if (!state) {
        state = {
          notifToggle,
          urgency,
          lowEth,
        };
      }
      notifToggle = state.notifToggle;
      urgency = state.urgency;
      lowEth = state.lowEth;

      await snap.request({
        method: 'snap_manageState',
        params: {operation: 'update', newState: state},
      });

      console.log({ notifToggle });
      if (notifToggle) {
        const currentData = await fetch(CURRENT_DATA_ENDPOINT, {
          method: 'get',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const current = await currentData.json();
        if (Math.abs(current.speeds[0].baseFee - lowEth) < urgency / 38) {
          return snap.request({
            method: 'snap_notify',
            params: {
                type: 'native',
                message: `Gasfee is low! Pay now at ${current.speeds[0].baseFee} Gwei`,
              },
          });
        }
        return snap.request({
          method: 'snap_notify',
          params: {
              type: 'native',
              message: `Current gasfee is ${current.speeds[0].baseFee} Gwei`,
            },
        });
      }
      return 0; // basically do nothing
    }

    default:
      throw new Error('Method not found.');
  }
};

export const onTransaction: OnTransactionHandler = async ({ transaction }) => {
  let state: { notifToggle: boolean; urgency: number; lowEth: number };

  state = (await snap.request({
    method: 'snap_manageState',
    params: {operation: 'get'},
  })) as { notifToggle: boolean; urgency: number; lowEth: number };

  if (!state) {
    state = {
      notifToggle,
      urgency,
      lowEth,
    };
  }

  let insights: any = {
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

  state.lowEth = Math.min(data.low_30_minutes, data.low_60_minutes);

  await snap.request({
    method: 'snap_manageState',
    params: {operation: 'update', newState: state},
  });

  insights = [
    {
      value: `__Average Gas Limit: Current value:__ ${current.avgGas}`,
    },
    
    {
      value: `__Estimated current gas price: Current value (Base + Priority):__ ${
        current.speeds[0].baseFee + current.speeds[0].maxPriorityFeePerGas
      } GWei; Base Fee: ${current.speeds[0].baseFee} GWei`,
    },
    
    {
      value: `__Forecasted Avg Gas price (for the next 30 mins):__ 
      Gas price within 30 minutes is expected to get as low as: ${data.low_30_minutes} GWei`,
    },

    {  
      value: `__Forecasted Avg Gas price (for the next 60 mins): Gas price within 60 minutes is expected to get as low as:__ ${Math.min(
          data.low_30_minutes,
          data.low_60_minutes,
        )} GWei`,
    },

    {
      value: `__Expected savings in 30 mins (For average gas limit):__ 
      ${
        current.avgGas *
        (current.speeds[0].baseFee +
          current.speeds[0].maxPriorityFeePerGas -
          data.low_30_minutes)
      } GWei`,
    },

    {
      value: `__Expected savings in 60 mins (For average gas limit):__ ${
      current.avgGas *
      (current.speeds[0].baseFee +
        current.speeds[0].maxPriorityFeePerGas -
        Math.min(data.low_30_minutes, data.low_60_minutes))
      } GWei`,
    },
  ];

  return {
    content: panel([
      heading('My Transaction Insights'),
      text('Here are the insights:'),
      ...(insights.map((insight: {value: string})=>text(insight.value)))
    ])
  };
};
