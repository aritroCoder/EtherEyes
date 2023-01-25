import { OnTransactionHandler } from '@metamask/snap-types';
import {
  hasProperty,
  isObject,
  Json,
  remove0x,
  add0x,
  bytesToHex,
} from '@metamask/utils';
import { decode } from '@metamask/abi-utils';

// The API endpoint to get a list of functions by 4 byte signature.
const API_ENDPOINT =
  'https://www.4byte.directory/api/v1/signatures/?hex_signature=';

/* eslint-disable camelcase */
type FourByteSignature = {
  id: number;
  created_at: string;
  text_signature: string;
  hex_signature: string;
  bytes_signature: string;
};
/* eslint-enable camelcase */

export const onTransaction: OnTransactionHandler = async ({ transaction }) => {
  const insights: { type: string; params?: Json } = {
    type: 'unknown transaction',
  };
  if (
    !isObject(transaction) ||
    !hasProperty(transaction, 'data') ||
    typeof transaction.data !== 'string'
  ) {
    console.warn('unknown transaction type');
    return { insights };
  }

  // parse the txn data

  const transactionData = remove0x(transaction.data);
  const functionSignature = transactionData.slice(0, 8);

  // fetch data from 4bytes

  const response = await fetch(`${API_ENDPOINT}${add0x(functionSignature)}`, {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('4byte.directory API request failed');
  }

  const { results } = (await response.json()) as {
    results: FourByteSignature[];
  };

  const [functionTextSignature] = results
    .sort((a, b) => a.created_at.localeCompare(b.created_at))
    .map((value) => value.text_signature);

  if (!functionTextSignature) {
    console.warn('unknown transaction type');
    return { insights };
  }

  insights.type = functionTextSignature;

  // decode parameters

  const parameterTypes = functionTextSignature
    .slice(
      functionTextSignature.indexOf('(') + 1,
      functionTextSignature.indexOf(')'),
    )
    .split(',');

  const decoded = decode(parameterTypes, add0x(transactionData.slice(8)));

  insights.params = decoded.map(normalizeAbiValue)

  return { insights };
  // return {insights}
};

/**
 * The ABI decoder returns certain which are not JSON serializable. This
 * function converts them to strings.
 *
 * @param value - The value to convert.
 * @returns The converted value.
 */
function normalizeAbiValue(value: unknown): Json {
  if (Array.isArray(value)) {
    return value.map(normalizeAbiValue);
  }

  if (value instanceof Uint8Array) {
    return bytesToHex(value);
  }

  if (typeof value === 'bigint') {
    return value.toString();
  }

  return value as Json;
}
