export const veCredAbi = [
    { name: 'CommitOwnership', inputs: [{ type: 'address', name: 'admin', indexed: false }], anonymous: false, type: 'event' },
    { name: 'ApplyOwnership', inputs: [{ type: 'address', name: 'admin', indexed: false }], anonymous: false, type: 'event' },
    {
        name: 'Deposit',
        inputs: [
            { type: 'address', name: 'provider', indexed: true },
            { type: 'uint256', name: 'value', indexed: false },
            { type: 'uint256', name: 'locktime', indexed: true },
            { type: 'int128', name: 'type', indexed: false },
            { type: 'uint256', name: 'ts', indexed: false }
        ],
        anonymous: false,
        type: 'event'
    },
    {
        name: 'Withdraw',
        inputs: [
            { type: 'address', name: 'provider', indexed: true },
            { type: 'uint256', name: 'value', indexed: false },
            { type: 'uint256', name: 'ts', indexed: false }
        ],
        anonymous: false,
        type: 'event'
    },
    {
        name: 'Supply',
        inputs: [
            { type: 'uint256', name: 'prevSupply', indexed: false },
            { type: 'uint256', name: 'supply', indexed: false }
        ],
        anonymous: false,
        type: 'event'
    },
    {
        outputs: [],
        inputs: [
            { type: 'address', name: 'token_addr' },
            { type: 'string', name: '_name' },
            { type: 'string', name: '_symbol' },
            { type: 'string', name: '_version' }
        ],
        stateMutability: 'nonpayable',
        type: 'constructor'
    },
    { name: 'commit_transfer_ownership', outputs: [], inputs: [{ type: 'address', name: 'addr' }], stateMutability: 'nonpayable', type: 'function', gas: 37597 },
    { name: 'apply_transfer_ownership', outputs: [], inputs: [], stateMutability: 'nonpayable', type: 'function', gas: 38497 },
    { name: 'commit_smart_wallet_checker', outputs: [], inputs: [{ type: 'address', name: 'addr' }], stateMutability: 'nonpayable', type: 'function', gas: 36307 },
    { name: 'apply_smart_wallet_checker', outputs: [], inputs: [], stateMutability: 'nonpayable', type: 'function', gas: 37095 },
    { name: 'get_last_user_slope', outputs: [{ type: 'int128', name: '' }], inputs: [{ type: 'address', name: 'addr' }], stateMutability: 'view', type: 'function', gas: 2569 },
    {
        name: 'user_point_history__ts',
        outputs: [{ type: 'uint256', name: '' }],
        inputs: [
            { type: 'address', name: '_addr' },
            { type: 'uint256', name: '_idx' }
        ],
        stateMutability: 'view',
        type: 'function',
        gas: 1672
    },
    { name: 'locked__end', outputs: [{ type: 'uint256', name: '' }], inputs: [{ type: 'address', name: '_addr' }], stateMutability: 'view', type: 'function', gas: 1593 },
    { name: 'checkpoint', outputs: [], inputs: [], stateMutability: 'nonpayable', type: 'function', gas: 37052342 },
    {
        name: 'deposit_for',
        outputs: [],
        inputs: [
            { type: 'address', name: '_addr' },
            { type: 'uint256', name: '_value' }
        ],
        stateMutability: 'nonpayable',
        type: 'function',
        gas: 74279891
    },
    {
        name: 'create_lock',
        outputs: [],
        inputs: [
            { type: 'uint256', name: '_value' },
            { type: 'uint256', name: '_unlock_time' }
        ],
        stateMutability: 'nonpayable',
        type: 'function',
        gas: 74281465
    },
    { name: 'increase_amount', outputs: [], inputs: [{ type: 'uint256', name: '_value' }], stateMutability: 'nonpayable', type: 'function', gas: 74280830 },
    { name: 'increase_unlock_time', outputs: [], inputs: [{ type: 'uint256', name: '_unlock_time' }], stateMutability: 'nonpayable', type: 'function', gas: 74281578 },
    { name: 'withdraw', outputs: [], inputs: [], stateMutability: 'nonpayable', type: 'function', gas: 37223566 },
    { name: 'balanceOf', outputs: [{ type: 'uint256', name: '' }], inputs: [{ type: 'address', name: 'addr' }], stateMutability: 'view', type: 'function' },
    {
        name: 'balanceOf',
        outputs: [{ type: 'uint256', name: '' }],
        inputs: [
            { type: 'address', name: 'addr' },
            { type: 'uint256', name: '_t' }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        name: 'balanceOfAt',
        outputs: [{ type: 'uint256', name: '' }],
        inputs: [
            { type: 'address', name: 'addr' },
            { type: 'uint256', name: '_block' }
        ],
        stateMutability: 'view',
        type: 'function',
        gas: 514333
    },
    { name: 'totalSupply', outputs: [{ type: 'uint256', name: '' }], inputs: [], stateMutability: 'view', type: 'function' },
    { name: 'totalSupply', outputs: [{ type: 'uint256', name: '' }], inputs: [{ type: 'uint256', name: 't' }], stateMutability: 'view', type: 'function' },
    { name: 'totalSupplyAt', outputs: [{ type: 'uint256', name: '' }], inputs: [{ type: 'uint256', name: '_block' }], stateMutability: 'view', type: 'function', gas: 812560 },
    { name: 'changeController', outputs: [], inputs: [{ type: 'address', name: '_newController' }], stateMutability: 'nonpayable', type: 'function', gas: 36907 },
    { name: 'token', outputs: [{ type: 'address', name: '' }], inputs: [], stateMutability: 'view', type: 'function', gas: 1841 },
    { name: 'supply', outputs: [{ type: 'uint256', name: '' }], inputs: [], stateMutability: 'view', type: 'function', gas: 1871 },
    {
        name: 'locked',
        outputs: [
            { type: 'int128', name: 'amount' },
            { type: 'uint256', name: 'end' }
        ],
        inputs: [{ type: 'address', name: 'arg0' }],
        stateMutability: 'view',
        type: 'function',
        gas: 3359
    },
    { name: 'epoch', outputs: [{ type: 'uint256', name: '' }], inputs: [], stateMutability: 'view', type: 'function', gas: 1931 },
    {
        name: 'point_history',
        outputs: [
            { type: 'int128', name: 'bias' },
            { type: 'int128', name: 'slope' },
            { type: 'uint256', name: 'ts' },
            { type: 'uint256', name: 'blk' }
        ],
        inputs: [{ type: 'uint256', name: 'arg0' }],
        stateMutability: 'view',
        type: 'function',
        gas: 5550
    },
    {
        name: 'user_point_history',
        outputs: [
            { type: 'int128', name: 'bias' },
            { type: 'int128', name: 'slope' },
            { type: 'uint256', name: 'ts' },
            { type: 'uint256', name: 'blk' }
        ],
        inputs: [
            { type: 'address', name: 'arg0' },
            { type: 'uint256', name: 'arg1' }
        ],
        stateMutability: 'view',
        type: 'function',
        gas: 6079
    },
    { name: 'user_point_epoch', outputs: [{ type: 'uint256', name: '' }], inputs: [{ type: 'address', name: 'arg0' }], stateMutability: 'view', type: 'function', gas: 2175 },
    { name: 'slope_changes', outputs: [{ type: 'int128', name: '' }], inputs: [{ type: 'uint256', name: 'arg0' }], stateMutability: 'view', type: 'function', gas: 2166 },
    { name: 'controller', outputs: [{ type: 'address', name: '' }], inputs: [], stateMutability: 'view', type: 'function', gas: 2081 },
    { name: 'transfersEnabled', outputs: [{ type: 'bool', name: '' }], inputs: [], stateMutability: 'view', type: 'function', gas: 2111 },
    { name: 'name', outputs: [{ type: 'string', name: '' }], inputs: [], stateMutability: 'view', type: 'function', gas: 8543 },
    { name: 'symbol', outputs: [{ type: 'string', name: '' }], inputs: [], stateMutability: 'view', type: 'function', gas: 7596 },
    { name: 'version', outputs: [{ type: 'string', name: '' }], inputs: [], stateMutability: 'view', type: 'function', gas: 7626 },
    { name: 'decimals', outputs: [{ type: 'uint256', name: '' }], inputs: [], stateMutability: 'view', type: 'function', gas: 2231 },
    { name: 'future_smart_wallet_checker', outputs: [{ type: 'address', name: '' }], inputs: [], stateMutability: 'view', type: 'function', gas: 2261 },
    { name: 'smart_wallet_checker', outputs: [{ type: 'address', name: '' }], inputs: [], stateMutability: 'view', type: 'function', gas: 2291 },
    { name: 'admin', outputs: [{ type: 'address', name: '' }], inputs: [], stateMutability: 'view', type: 'function', gas: 2321 },
    { name: 'future_admin', outputs: [{ type: 'address', name: '' }], inputs: [], stateMutability: 'view', type: 'function', gas: 2351 }
]

export const routerAbi = [
    {
        inputs: [
            { internalType: 'address', name: '_factory', type: 'address' },
            { internalType: 'address', name: '_WETH', type: 'address' }
        ],
        stateMutability: 'nonpayable',
        type: 'constructor'
    },
    { inputs: [], name: 'WETH', outputs: [{ internalType: 'address', name: '', type: 'address' }], stateMutability: 'view', type: 'function' },
    {
        inputs: [
            { internalType: 'address', name: 'tokenA', type: 'address' },
            { internalType: 'address', name: 'tokenB', type: 'address' },
            { internalType: 'uint256', name: 'amountADesired', type: 'uint256' },
            { internalType: 'uint256', name: 'amountBDesired', type: 'uint256' },
            { internalType: 'uint256', name: 'amountAMin', type: 'uint256' },
            { internalType: 'uint256', name: 'amountBMin', type: 'uint256' },
            { internalType: 'address', name: 'to', type: 'address' },
            { internalType: 'uint256', name: 'deadline', type: 'uint256' }
        ],
        name: 'addLiquidity',
        outputs: [
            { internalType: 'uint256', name: 'amountA', type: 'uint256' },
            { internalType: 'uint256', name: 'amountB', type: 'uint256' },
            { internalType: 'uint256', name: 'liquidity', type: 'uint256' }
        ],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [
            { internalType: 'address', name: 'token', type: 'address' },
            { internalType: 'uint256', name: 'amountTokenDesired', type: 'uint256' },
            { internalType: 'uint256', name: 'amountTokenMin', type: 'uint256' },
            { internalType: 'uint256', name: 'amountETHMin', type: 'uint256' },
            { internalType: 'address', name: 'to', type: 'address' },
            { internalType: 'uint256', name: 'deadline', type: 'uint256' }
        ],
        name: 'addLiquidityETH',
        outputs: [
            { internalType: 'uint256', name: 'amountToken', type: 'uint256' },
            { internalType: 'uint256', name: 'amountETH', type: 'uint256' },
            { internalType: 'uint256', name: 'liquidity', type: 'uint256' }
        ],
        stateMutability: 'payable',
        type: 'function'
    },
    { inputs: [], name: 'factory', outputs: [{ internalType: 'address', name: '', type: 'address' }], stateMutability: 'view', type: 'function' },
    {
        inputs: [
            { internalType: 'uint256', name: 'amountOut', type: 'uint256' },
            { internalType: 'uint256', name: 'reserveIn', type: 'uint256' },
            { internalType: 'uint256', name: 'reserveOut', type: 'uint256' }
        ],
        name: 'getAmountIn',
        outputs: [{ internalType: 'uint256', name: 'amountIn', type: 'uint256' }],
        stateMutability: 'pure',
        type: 'function'
    },
    {
        inputs: [
            { internalType: 'uint256', name: 'amountIn', type: 'uint256' },
            { internalType: 'uint256', name: 'reserveIn', type: 'uint256' },
            { internalType: 'uint256', name: 'reserveOut', type: 'uint256' }
        ],
        name: 'getAmountOut',
        outputs: [{ internalType: 'uint256', name: 'amountOut', type: 'uint256' }],
        stateMutability: 'pure',
        type: 'function'
    },
    {
        inputs: [
            { internalType: 'uint256', name: 'amountOut', type: 'uint256' },
            { internalType: 'address[]', name: 'path', type: 'address[]' }
        ],
        name: 'getAmountsIn',
        outputs: [{ internalType: 'uint256[]', name: 'amounts', type: 'uint256[]' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            { internalType: 'uint256', name: 'amountIn', type: 'uint256' },
            { internalType: 'address[]', name: 'path', type: 'address[]' }
        ],
        name: 'getAmountsOut',
        outputs: [{ internalType: 'uint256[]', name: 'amounts', type: 'uint256[]' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            { internalType: 'uint256', name: 'amountA', type: 'uint256' },
            { internalType: 'uint256', name: 'reserveA', type: 'uint256' },
            { internalType: 'uint256', name: 'reserveB', type: 'uint256' }
        ],
        name: 'quote',
        outputs: [{ internalType: 'uint256', name: 'amountB', type: 'uint256' }],
        stateMutability: 'pure',
        type: 'function'
    },
    {
        inputs: [
            { internalType: 'address', name: 'tokenA', type: 'address' },
            { internalType: 'address', name: 'tokenB', type: 'address' },
            { internalType: 'uint256', name: 'liquidity', type: 'uint256' },
            { internalType: 'uint256', name: 'amountAMin', type: 'uint256' },
            { internalType: 'uint256', name: 'amountBMin', type: 'uint256' },
            { internalType: 'address', name: 'to', type: 'address' },
            { internalType: 'uint256', name: 'deadline', type: 'uint256' }
        ],
        name: 'removeLiquidity',
        outputs: [
            { internalType: 'uint256', name: 'amountA', type: 'uint256' },
            { internalType: 'uint256', name: 'amountB', type: 'uint256' }
        ],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [
            { internalType: 'address', name: 'token', type: 'address' },
            { internalType: 'uint256', name: 'liquidity', type: 'uint256' },
            { internalType: 'uint256', name: 'amountTokenMin', type: 'uint256' },
            { internalType: 'uint256', name: 'amountETHMin', type: 'uint256' },
            { internalType: 'address', name: 'to', type: 'address' },
            { internalType: 'uint256', name: 'deadline', type: 'uint256' }
        ],
        name: 'removeLiquidityETH',
        outputs: [
            { internalType: 'uint256', name: 'amountToken', type: 'uint256' },
            { internalType: 'uint256', name: 'amountETH', type: 'uint256' }
        ],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [
            { internalType: 'address', name: 'token', type: 'address' },
            { internalType: 'uint256', name: 'liquidity', type: 'uint256' },
            { internalType: 'uint256', name: 'amountTokenMin', type: 'uint256' },
            { internalType: 'uint256', name: 'amountETHMin', type: 'uint256' },
            { internalType: 'address', name: 'to', type: 'address' },
            { internalType: 'uint256', name: 'deadline', type: 'uint256' }
        ],
        name: 'removeLiquidityETHSupportingFeeOnTransferTokens',
        outputs: [{ internalType: 'uint256', name: 'amountETH', type: 'uint256' }],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [
            { internalType: 'address', name: 'token', type: 'address' },
            { internalType: 'uint256', name: 'liquidity', type: 'uint256' },
            { internalType: 'uint256', name: 'amountTokenMin', type: 'uint256' },
            { internalType: 'uint256', name: 'amountETHMin', type: 'uint256' },
            { internalType: 'address', name: 'to', type: 'address' },
            { internalType: 'uint256', name: 'deadline', type: 'uint256' },
            { internalType: 'bool', name: 'approveMax', type: 'bool' },
            { internalType: 'uint8', name: 'v', type: 'uint8' },
            { internalType: 'bytes32', name: 'r', type: 'bytes32' },
            { internalType: 'bytes32', name: 's', type: 'bytes32' }
        ],
        name: 'removeLiquidityETHWithPermit',
        outputs: [
            { internalType: 'uint256', name: 'amountToken', type: 'uint256' },
            { internalType: 'uint256', name: 'amountETH', type: 'uint256' }
        ],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [
            { internalType: 'address', name: 'token', type: 'address' },
            { internalType: 'uint256', name: 'liquidity', type: 'uint256' },
            { internalType: 'uint256', name: 'amountTokenMin', type: 'uint256' },
            { internalType: 'uint256', name: 'amountETHMin', type: 'uint256' },
            { internalType: 'address', name: 'to', type: 'address' },
            { internalType: 'uint256', name: 'deadline', type: 'uint256' },
            { internalType: 'bool', name: 'approveMax', type: 'bool' },
            { internalType: 'uint8', name: 'v', type: 'uint8' },
            { internalType: 'bytes32', name: 'r', type: 'bytes32' },
            { internalType: 'bytes32', name: 's', type: 'bytes32' }
        ],
        name: 'removeLiquidityETHWithPermitSupportingFeeOnTransferTokens',
        outputs: [{ internalType: 'uint256', name: 'amountETH', type: 'uint256' }],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [
            { internalType: 'address', name: 'tokenA', type: 'address' },
            { internalType: 'address', name: 'tokenB', type: 'address' },
            { internalType: 'uint256', name: 'liquidity', type: 'uint256' },
            { internalType: 'uint256', name: 'amountAMin', type: 'uint256' },
            { internalType: 'uint256', name: 'amountBMin', type: 'uint256' },
            { internalType: 'address', name: 'to', type: 'address' },
            { internalType: 'uint256', name: 'deadline', type: 'uint256' },
            { internalType: 'bool', name: 'approveMax', type: 'bool' },
            { internalType: 'uint8', name: 'v', type: 'uint8' },
            { internalType: 'bytes32', name: 'r', type: 'bytes32' },
            { internalType: 'bytes32', name: 's', type: 'bytes32' }
        ],
        name: 'removeLiquidityWithPermit',
        outputs: [
            { internalType: 'uint256', name: 'amountA', type: 'uint256' },
            { internalType: 'uint256', name: 'amountB', type: 'uint256' }
        ],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [
            { internalType: 'uint256', name: 'amountOut', type: 'uint256' },
            { internalType: 'address[]', name: 'path', type: 'address[]' },
            { internalType: 'address', name: 'to', type: 'address' },
            { internalType: 'uint256', name: 'deadline', type: 'uint256' }
        ],
        name: 'swapETHForExactTokens',
        outputs: [{ internalType: 'uint256[]', name: 'amounts', type: 'uint256[]' }],
        stateMutability: 'payable',
        type: 'function'
    },
    {
        inputs: [
            { internalType: 'uint256', name: 'amountOutMin', type: 'uint256' },
            { internalType: 'address[]', name: 'path', type: 'address[]' },
            { internalType: 'address', name: 'to', type: 'address' },
            { internalType: 'uint256', name: 'deadline', type: 'uint256' }
        ],
        name: 'swapExactETHForTokens',
        outputs: [{ internalType: 'uint256[]', name: 'amounts', type: 'uint256[]' }],
        stateMutability: 'payable',
        type: 'function'
    },
    {
        inputs: [
            { internalType: 'uint256', name: 'amountOutMin', type: 'uint256' },
            { internalType: 'address[]', name: 'path', type: 'address[]' },
            { internalType: 'address', name: 'to', type: 'address' },
            { internalType: 'uint256', name: 'deadline', type: 'uint256' }
        ],
        name: 'swapExactETHForTokensSupportingFeeOnTransferTokens',
        outputs: [],
        stateMutability: 'payable',
        type: 'function'
    },
    {
        inputs: [
            { internalType: 'uint256', name: 'amountIn', type: 'uint256' },
            { internalType: 'uint256', name: 'amountOutMin', type: 'uint256' },
            { internalType: 'address[]', name: 'path', type: 'address[]' },
            { internalType: 'address', name: 'to', type: 'address' },
            { internalType: 'uint256', name: 'deadline', type: 'uint256' }
        ],
        name: 'swapExactTokensForETH',
        outputs: [{ internalType: 'uint256[]', name: 'amounts', type: 'uint256[]' }],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [
            { internalType: 'uint256', name: 'amountIn', type: 'uint256' },
            { internalType: 'uint256', name: 'amountOutMin', type: 'uint256' },
            { internalType: 'address[]', name: 'path', type: 'address[]' },
            { internalType: 'address', name: 'to', type: 'address' },
            { internalType: 'uint256', name: 'deadline', type: 'uint256' }
        ],
        name: 'swapExactTokensForETHSupportingFeeOnTransferTokens',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [
            { internalType: 'uint256', name: 'amountIn', type: 'uint256' },
            { internalType: 'uint256', name: 'amountOutMin', type: 'uint256' },
            { internalType: 'address[]', name: 'path', type: 'address[]' },
            { internalType: 'address', name: 'to', type: 'address' },
            { internalType: 'uint256', name: 'deadline', type: 'uint256' }
        ],
        name: 'swapExactTokensForTokens',
        outputs: [{ internalType: 'uint256[]', name: 'amounts', type: 'uint256[]' }],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [
            { internalType: 'uint256', name: 'amountIn', type: 'uint256' },
            { internalType: 'uint256', name: 'amountOutMin', type: 'uint256' },
            { internalType: 'address[]', name: 'path', type: 'address[]' },
            { internalType: 'address', name: 'to', type: 'address' },
            { internalType: 'uint256', name: 'deadline', type: 'uint256' }
        ],
        name: 'swapExactTokensForTokensSupportingFeeOnTransferTokens',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [
            { internalType: 'uint256', name: 'amountOut', type: 'uint256' },
            { internalType: 'uint256', name: 'amountInMax', type: 'uint256' },
            { internalType: 'address[]', name: 'path', type: 'address[]' },
            { internalType: 'address', name: 'to', type: 'address' },
            { internalType: 'uint256', name: 'deadline', type: 'uint256' }
        ],
        name: 'swapTokensForExactETH',
        outputs: [{ internalType: 'uint256[]', name: 'amounts', type: 'uint256[]' }],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [
            { internalType: 'uint256', name: 'amountOut', type: 'uint256' },
            { internalType: 'uint256', name: 'amountInMax', type: 'uint256' },
            { internalType: 'address[]', name: 'path', type: 'address[]' },
            { internalType: 'address', name: 'to', type: 'address' },
            { internalType: 'uint256', name: 'deadline', type: 'uint256' }
        ],
        name: 'swapTokensForExactTokens',
        outputs: [{ internalType: 'uint256[]', name: 'amounts', type: 'uint256[]' }],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    { stateMutability: 'payable', type: 'receive' }
]

export const erc20 = [
    {
        inputs: [
            { internalType: 'string', name: '_name', type: 'string' },
            { internalType: 'string', name: '_symbol', type: 'string' },
            { internalType: 'uint8', name: '_decimals', type: 'uint8' },
            { internalType: 'address', name: '_owner', type: 'address' }
        ],
        stateMutability: 'nonpayable',
        type: 'constructor'
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: 'address', name: 'owner', type: 'address' },
            { indexed: true, internalType: 'address', name: 'spender', type: 'address' },
            { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' }
        ],
        name: 'Approval',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: 'address', name: 'oldOwner', type: 'address' },
            { indexed: true, internalType: 'address', name: 'newOwner', type: 'address' },
            { indexed: true, internalType: 'uint256', name: 'effectiveTime', type: 'uint256' }
        ],
        name: 'LogChangeDCRMOwner',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: 'bytes32', name: 'txhash', type: 'bytes32' },
            { indexed: true, internalType: 'address', name: 'account', type: 'address' },
            { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' }
        ],
        name: 'LogSwapin',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: 'address', name: 'account', type: 'address' },
            { indexed: true, internalType: 'address', name: 'bindaddr', type: 'address' },
            { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' }
        ],
        name: 'LogSwapout',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: 'address', name: 'from', type: 'address' },
            { indexed: true, internalType: 'address', name: 'to', type: 'address' },
            { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' }
        ],
        name: 'Transfer',
        type: 'event'
    },
    { inputs: [], name: 'DOMAIN_SEPARATOR', outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }], stateMutability: 'view', type: 'function' },
    { inputs: [], name: 'PERMIT_TYPEHASH', outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }], stateMutability: 'view', type: 'function' },
    {
        inputs: [
            { internalType: 'bytes32', name: 'txhash', type: 'bytes32' },
            { internalType: 'address', name: 'account', type: 'address' },
            { internalType: 'uint256', name: 'amount', type: 'uint256' }
        ],
        name: 'Swapin',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [
            { internalType: 'uint256', name: 'amount', type: 'uint256' },
            { internalType: 'address', name: 'bindaddr', type: 'address' }
        ],
        name: 'Swapout',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    { inputs: [], name: 'TRANSFER_TYPEHASH', outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }], stateMutability: 'view', type: 'function' },
    {
        inputs: [
            { internalType: 'address', name: '', type: 'address' },
            { internalType: 'address', name: '', type: 'address' }
        ],
        name: 'allowance',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            { internalType: 'address', name: 'spender', type: 'address' },
            { internalType: 'uint256', name: 'value', type: 'uint256' }
        ],
        name: 'approve',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [
            { internalType: 'address', name: 'spender', type: 'address' },
            { internalType: 'uint256', name: 'value', type: 'uint256' },
            { internalType: 'bytes', name: 'data', type: 'bytes' }
        ],
        name: 'approveAndCall',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    { inputs: [{ internalType: 'address', name: '', type: 'address' }], name: 'balanceOf', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
    { inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }], name: 'changeDCRMOwner', outputs: [{ internalType: 'bool', name: '', type: 'bool' }], stateMutability: 'nonpayable', type: 'function' },
    { inputs: [], name: 'decimals', outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }], stateMutability: 'view', type: 'function' },
    { inputs: [], name: 'name', outputs: [{ internalType: 'string', name: '', type: 'string' }], stateMutability: 'view', type: 'function' },
    { inputs: [{ internalType: 'address', name: '', type: 'address' }], name: 'nonces', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
    { inputs: [], name: 'owner', outputs: [{ internalType: 'address', name: '', type: 'address' }], stateMutability: 'view', type: 'function' },
    {
        inputs: [
            { internalType: 'address', name: 'target', type: 'address' },
            { internalType: 'address', name: 'spender', type: 'address' },
            { internalType: 'uint256', name: 'value', type: 'uint256' },
            { internalType: 'uint256', name: 'deadline', type: 'uint256' },
            { internalType: 'uint8', name: 'v', type: 'uint8' },
            { internalType: 'bytes32', name: 'r', type: 'bytes32' },
            { internalType: 'bytes32', name: 's', type: 'bytes32' }
        ],
        name: 'permit',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    { inputs: [], name: 'symbol', outputs: [{ internalType: 'string', name: '', type: 'string' }], stateMutability: 'view', type: 'function' },
    { inputs: [], name: 'totalSupply', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
    {
        inputs: [
            { internalType: 'address', name: 'to', type: 'address' },
            { internalType: 'uint256', name: 'value', type: 'uint256' }
        ],
        name: 'transfer',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [
            { internalType: 'address', name: 'to', type: 'address' },
            { internalType: 'uint256', name: 'value', type: 'uint256' },
            { internalType: 'bytes', name: 'data', type: 'bytes' }
        ],
        name: 'transferAndCall',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [
            { internalType: 'address', name: 'from', type: 'address' },
            { internalType: 'address', name: 'to', type: 'address' },
            { internalType: 'uint256', name: 'value', type: 'uint256' }
        ],
        name: 'transferFrom',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [
            { internalType: 'address', name: 'target', type: 'address' },
            { internalType: 'address', name: 'to', type: 'address' },
            { internalType: 'uint256', name: 'value', type: 'uint256' },
            { internalType: 'uint256', name: 'deadline', type: 'uint256' },
            { internalType: 'uint8', name: 'v', type: 'uint8' },
            { internalType: 'bytes32', name: 'r', type: 'bytes32' },
            { internalType: 'bytes32', name: 's', type: 'bytes32' }
        ],
        name: 'transferWithPermit',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'nonpayable',
        type: 'function'
    }
]
