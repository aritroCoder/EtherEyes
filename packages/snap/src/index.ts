import {
  OnTransactionHandler,
  OnRpcRequestHandler,
} from '@metamask/snap-types';
import { OnCronjobHandler } from '@metamask/snaps-types';
import { hasProperty, isObject } from '@metamask/utils';
import jsonData from '../config.json';

// Transaction Urgency
let urgency = 60;

// The API endpoint.
const MODEL_API_ENDPOINT = 'http://127.0.0.1:5000/';
const CURRENT_DATA_ENDPOINT = `https://api.owlracle.info/v3/eth/gas?accept=${urgency}&apikey=${jsonData.key}`;

// cronjob notification enabler
let notifToggle = false;

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

      let state: { notifToggle: boolean; urgency: number };

      state = (await wallet.request({
        method: 'snap_manageState',
        params: ['get'],
      })) as { notifToggle: boolean; urgency: number };

      if (!state) {
        state = {
          notifToggle: true,
          urgency,
        };
      }
      state.notifToggle = true;

      await wallet.request({
        method: 'snap_manageState',
        params: ['update', state],
      });

      return notifToggle;
    }

    case 'notif_toggle_false': {
      console.log('Notification toggled to false');
      notifToggle = false; // toggle the notification
      console.log({ notifToggle });

      let state: { notifToggle: boolean; urgency: number };

      state = (await wallet.request({
        method: 'snap_manageState',
        params: ['get'],
      })) as { notifToggle: boolean; urgency: number };

      if (!state) {
        state = {
          notifToggle: false,
          urgency,
        };
      }
      state.notifToggle = false;

      await wallet.request({
        method: 'snap_manageState',
        params: ['update', state],
      });

      return notifToggle;
    }

    case 'set_urgency_35': {
      urgency = 35;

      let state: { notifToggle: boolean; urgency: number };

      state = (await wallet.request({
        method: 'snap_manageState',
        params: ['get'],
      })) as { notifToggle: boolean; urgency: number };

      if (!state) {
        state = {
          notifToggle,
          urgency: 35,
        };
      }
      state.urgency = 35;

      await wallet.request({
        method: 'snap_manageState',
        params: ['update', state],
      });

      return urgency;
    }

    case 'set_urgency_60': {
      urgency = 60;

      let state: { notifToggle: boolean; urgency: number };

      state = (await wallet.request({
        method: 'snap_manageState',
        params: ['get'],
      })) as { notifToggle: boolean; urgency: number };

      if (!state) {
        state = {
          notifToggle,
          urgency: 60,
        };
      }
      state.urgency = 60;

      await wallet.request({
        method: 'snap_manageState',
        params: ['update', state],
      });

      return urgency;
    }

    case 'set_urgency_90': {
      urgency = 90;

      let state: { notifToggle: boolean; urgency: number };

      state = (await wallet.request({
        method: 'snap_manageState',
        params: ['get'],
      })) as { notifToggle: boolean; urgency: number };

      if (!state) {
        state = {
          notifToggle,
          urgency: 90,
        };
      }
      state.urgency = 90;

      await wallet.request({
        method: 'snap_manageState',
        params: ['update', state],
      });

      return urgency;
    }

    case 'set_urgency_100': {
      urgency = 100;

      let state: { notifToggle: boolean; urgency: number };

      state = (await wallet.request({
        method: 'snap_manageState',
        params: ['get'],
      })) as { notifToggle: boolean; urgency: number };

      if (!state) {
        state = {
          notifToggle,
          urgency: 100,
        };
      }
      state.urgency = 100;

      await wallet.request({
        method: 'snap_manageState',
        params: ['update', state],
      });

      return urgency;
    }

    case 'call_api': {
      // get data from state whenever snap is invoked as snaps executions are ephemeral
      let state: { notifToggle: boolean; urgency: number };

      state = (await wallet.request({
        method: 'snap_manageState',
        params: ['get'],
      })) as { notifToggle: boolean; urgency: number };

      if (!state) {
        state = {
          notifToggle,
          urgency,
        };
      }

      notifToggle = state.notifToggle;
      urgency = state.urgency;

      await wallet.request({
        method: 'snap_manageState',
        params: ['update', state],
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
      // get data from state whenever snap is invoked as snaps executions are ephemeral
      let state: { notifToggle: boolean; urgency: number };

      state = (await wallet.request({
        method: 'snap_manageState',
        params: ['get'],
      })) as { notifToggle: boolean; urgency: number };

      if (!state) {
        state = {
          notifToggle,
          urgency,
        };
      }
      notifToggle = state.notifToggle;
      urgency = state.urgency;

      await wallet.request({
        method: 'snap_manageState',
        params: ['update', state],
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

  insights = {
    'Average Gas needed': `The average units of gas needed to do the transaction. Current value is: ${current.avgGas}`,

    'Min fee required': `Total gas fee is calculated as the product of gas units with gas price. This is the amount the user has to pay for the transaction, minimum amount will execute it at slowest speed. Current minimum value is: ${
      (current.avgGas * current.speeds[0].baseFee) / 10 ** 9
    }ETH`,

    'Max fee required': `Total gas fee is calculated as the product of gas units with gas price. This is the amount the user has to pay for the transaction, maximum amount will execute it at fastest speed. Current maximum value is: ${
      (current.avgGas *
        (current.speeds[0].maxFeePerGas +
          current.speeds[0].maxPriorityFeePerGas)) /
      10 ** 9
    }ETH`,

    'Expected gas prices': `
    The total gas fee within 30 minutes is expected to get as low as ${
      (data.low_30_minutes * current.avgGas) / 10 ** 9
    } ETH (saving you upto ${
      current.avgGas *
        (current.speeds[0].maxFeePerGas +
          current.speeds[0].maxPriorityFeePerGas) -
      data.low_30_minutes * current.avgGas
    } Gwei), and within 60 minutes as low as ${
      (data.low_60_minutes * current.avgGas) / 10 ** 9
    } ETH (saving you upto ${
      current.avgGas *
        (current.speeds[0].maxFeePerGas +
          current.speeds[0].maxPriorityFeePerGas) -
      data.low_60_minutes
    } Gwei).\n 
    You should plan your transactions accordingly if you want to save on gas prices during the transaction. To get notified every 3 minutes about gas price you can turn on the notification bell at top right of the snap installation website.`,
  };

  return { insights };
};
