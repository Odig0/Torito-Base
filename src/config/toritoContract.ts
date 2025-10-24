// Configuración del contrato Torito en Base Sepolia
export const TORITO_CONTRACT_ADDRESS = '0xfABd28A44392D93807f1B6E2E5aE93CC487447E6' as `0x${string}`;
export const BASE_SEPOLIA_CHAIN_ID = 84532;

// ABI simplificado del contrato Torito con las funciones principales
export const TORITO_ABI = [
  // Funciones de lectura (view)
  {
    inputs: [
      { internalType: 'address', name: '', type: 'address' },
      { internalType: 'address', name: '', type: 'address' },
    ],
    name: 'supplies',
    outputs: [
      { internalType: 'address', name: 'owner', type: 'address' },
      { internalType: 'uint256', name: 'scaledBalance', type: 'uint256' },
      { internalType: 'address', name: 'token', type: 'address' },
      {
        internalType: 'enum Torito.SupplyStatus',
        name: 'status',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '', type: 'address' },
      { internalType: 'bytes32', name: '', type: 'bytes32' },
    ],
    name: 'borrows',
    outputs: [
      { internalType: 'address', name: 'owner', type: 'address' },
      { internalType: 'uint256', name: 'borrowedAmount', type: 'uint256' },
      { internalType: 'address', name: 'collateralToken', type: 'address' },
      { internalType: 'bytes32', name: 'fiatCurrency', type: 'bytes32' },
      { internalType: 'uint256', name: 'totalRepaid', type: 'uint256' },
      {
        internalType: 'enum Torito.BorrowStatus',
        name: 'status',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'currency', type: 'bytes32' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'convertCurrencyToUSD',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'currency', type: 'bytes32' },
      { internalType: 'uint256', name: 'usdAmount', type: 'uint256' },
    ],
    name: 'convertUSDToCurrency',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes32', name: 'currency', type: 'bytes32' }],
    name: 'dynamicBorrowRate',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },

  // Funciones de escritura (transacciones)
  {
    inputs: [
      { internalType: 'address', name: 'token', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'supply',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'collateralToken', type: 'address' },
      { internalType: 'uint256', name: 'borrowAmount', type: 'uint256' },
      { internalType: 'bytes32', name: 'fiatCurrency', type: 'bytes32' },
    ],
    name: 'borrow',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'currency', type: 'bytes32' },
      { internalType: 'uint256', name: 'repaymentAmount', type: 'uint256' },
    ],
    name: 'repayLoan',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },

  // Eventos
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'user', type: 'address' },
      { indexed: false, internalType: 'address', name: 'token', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'totalAmount', type: 'uint256' },
    ],
    name: 'SupplyUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'user', type: 'address' },
      { indexed: false, internalType: 'bytes32', name: 'currency', type: 'bytes32' },
      { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'totalAmount', type: 'uint256' },
    ],
    name: 'BorrowUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'user', type: 'address' },
      { indexed: false, internalType: 'bytes32', name: 'currency', type: 'bytes32' },
      { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'remainingAmount', type: 'uint256' },
    ],
    name: 'LoanRepaid',
    type: 'event',
  },
] as const;

// Dirección del token USDT en Base Sepolia
// TODO: Reemplazar con la dirección real del token USDT cuando esté disponible
// Por ahora usando una dirección placeholder - el balance se mostrará en ETH
export const USDT_TOKEN_ADDRESS = '0x0000000000000000000000000000000000000000' as `0x${string}`;

// Helper para convertir string a bytes32 (para currency)
export function stringToBytes32(text: string): `0x${string}` {
  // Convertir texto a hex y pad a 32 bytes
  const hex = text
    .split('')
    .map((c) => c.charCodeAt(0).toString(16).padStart(2, '0'))
    .join('');
  return `0x${hex.padEnd(64, '0')}` as `0x${string}`;
}

// Helper para convertir bytes32 a string
export function bytes32ToString(bytes: string): string {
  const hex = bytes.replace('0x', '');
  let str = '';
  for (let i = 0; i < hex.length; i += 2) {
    const code = Number.parseInt(hex.slice(i, i + 2), 16);
    if (code === 0) break;
    str += String.fromCharCode(code);
  }
  return str;
}
