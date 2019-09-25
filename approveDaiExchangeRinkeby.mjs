import Web3 from "web3";
import EthTx from "ethereumjs-tx";

// declare const variables for dai token contract address and its abi
const daiTokenAddress = '0x2448eE2641d78CC42D7AD76498917359D961A783';
const daiTokenAbi =
  '[{"name": "Transfer", "inputs": [{"type": "address", "name": "_from", "indexed": true}, {"type": "address", "name": "_to", "indexed": true}, {"type": "uint256", "name": "_value", "indexed": false}], "anonymous": false, "type": "event"}, {"name": "Approval", "inputs": [{"type": "address", "name": "_owner", "indexed": true}, {"type": "address", "name": "_spender", "indexed": true}, {"type": "uint256", "name": "_value", "indexed": false}], "anonymous": false, "type": "event"}, {"outputs": [], "inputs": [{"type": "string", "name": "_name"}, {"type": "string", "name": "_symbol"}, {"type": "uint256", "name": "_decimals"}, {"type": "uint256", "name": "_supply"}], "constant": false, "payable": false, "type": "constructor"}, {"name": "transfer", "outputs": [{"type": "bool", "name": "out"}], "inputs": [{"type": "address", "name": "_to"}, {"type": "uint256", "name": "_value"}], "constant": false, "payable": false, "type": "function", "gas": 74020}, {"name": "transferFrom", "outputs": [{"type": "bool", "name": "out"}], "inputs": [{"type": "address", "name": "_from"}, {"type": "address", "name": "_to"}, {"type": "uint256", "name": "_value"}], "constant": false, "payable": false, "type": "function", "gas": 110371}, {"name": "approve", "outputs": [{"type": "bool", "name": "out"}], "inputs": [{"type": "address", "name": "_spender"}, {"type": "uint256", "name": "_value"}], "constant": false, "payable": false, "type": "function", "gas": 37755}, {"name": "name", "outputs": [{"type": "string", "name": "out"}], "inputs": [], "constant": true, "payable": false, "type": "function", "gas": 6402}, {"name": "symbol", "outputs": [{"type": "string", "name": "out"}], "inputs": [], "constant": true, "payable": false, "type": "function", "gas": 6432}, {"name": "decimals", "outputs": [{"type": "uint256", "name": "out"}], "inputs": [], "constant": true, "payable": false, "type": "function", "gas": 663}, {"name": "totalSupply", "outputs": [{"type": "uint256", "name": "out"}], "inputs": [], "constant": true, "payable": false, "type": "function", "gas": 693}, {"name": "balanceOf", "outputs": [{"type": "uint256", "name": "out"}], "inputs": [{"type": "address", "name": "arg0"}], "constant": true, "payable": false, "type": "function", "gas": 877}, {"name": "allowance", "outputs": [{"type": "uint256", "name": "out"}], "inputs": [{"type": "address", "name": "arg0"}, {"type": "address", "name": "arg1"}], "constant": true, "payable": false, "type": "function", "gas": 1061}]';

// declare a const variable for dai exchange contract address
const daiExchangeAddress = "0x77dB9C915809e7BE439D2AB21032B1b8B58F6891";

// set up Web3 to use Infura as your web3 provider
const web3 = new Web3(
  new Web3.providers.HttpProvider(
    "https://rinkeby.infura.io/v3/[PROJECT_ID]"
  )
);

// declare const variables for your address and private key
const addressFrom = "[YOUR_ADDRESS]";
const privKey =
  "[YOUR_PRIVATE_KEY]";

// instantiate the dai token contract
const daiTokenContract = new web3.eth.Contract(
  JSON.parse(daiTokenAbi),
  daiTokenAddress
);

// declare const variables to pass to the approve function of the dai token contract
const ADDRESS_SPENDER = daiExchangeAddress;
const TOKENS = web3.utils.toHex(1 * 10 ** 18); // 1 DAI

// create the encoded abi of the approve function
const approveEncodedABI = daiTokenContract.methods
  .approve(ADDRESS_SPENDER, TOKENS)
  .encodeABI();

// declare the function to sign a transaction object and send it to the Ethereum network.
function sendSignedTx(transactionObject, cb) {
  let transaction = new EthTx(transactionObject);
  const privateKey = new Buffer.from(privKey, "hex");
  transaction.sign(privateKey);
  const serializedEthTx = transaction.serialize().toString("hex");
  web3.eth.sendSignedTransaction(`0x${serializedEthTx}`, cb);
}

// construct a transaction object and invoke the sendSignedTx function
web3.eth.getTransactionCount(addressFrom).then(transactionNonce => {
  const transactionObject = {
    chainId: 4,
    nonce: web3.utils.toHex(transactionNonce),
    gasLimit: web3.utils.toHex(42000),
    gasPrice: web3.utils.toHex(5000000),
    to: daiTokenAddress,
    from: addressFrom,
    data: approveEncodedABI
  };

  sendSignedTx(transactionObject, function(error, result){
    if(error) return console.log("error ===>", error);
    console.log("sent ===>", result);
  })
}
);
