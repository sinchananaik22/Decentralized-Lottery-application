// /* eslint-disable no-unused-vars */
// /* eslint-disable react-hooks/exhaustive-deps */
// // import web3 from './web3';
// import { useEffect, useState } from 'react';
// import './App.css';
// import lottery from './lottery';
// import {Toaster} from 'react-hot-toast';
// import {toast} from 'react-hot-toast';
// import web3, { getWeb3 } from './web3';

// function App() {
//   const [manager, setManager] = useState('');
//   const [players, setPlayers] = useState([]);
//   const [balance, setBalance] = useState('');

//   const [value, setValue] = useState('');

//   const handleSubmit=async(e)=>{
//     e.preventDefault();
//     if(value<1){
//       toast.error("Please enter a amount more than 1 ether")
//       return
//     }
//     console.log(value);

//     const accounts = await web3.eth.getAccounts(); // to get the accounts
//     await lottery.methods.enter().send({
//       from: accounts[0],
//       value: web3.utils.toWei(value, 'ether'),
//     });

//     toast.success("Entered the lottery successfully")
//     setValue("")
//   }

//   const pickWinner = async () => {
//     const accounts = await web3.eth.getAccounts();
//     await lottery.methods.pickWinner().send({
//       from: accounts[0],
//     });
//     toast.success("Winner has been picked")
//   }



//   useEffect(() => {
//     const getManager = async () => {
//       const manage = await lottery.methods.manager().call();
//       setManager(manage);

//       const players = await lottery.methods.getPlayers().call();
//       setPlayers(players);

//       const balance = await web3.eth.getBalance(lottery.options.address);
//       setBalance(balance);

//     };
//     getManager();
    
//   }, []);


//   return (
//     <>
//     <Toaster />
//       <div className='main'>
//         <img src="/block.png" alt="blockchain logo" />
//         <h2>Lottery Contract</h2>
//       </div>
//       <div className='container'>
//         <div className="upper-layer">
//           <p>This contract is managed by <span className='red'>{manager ? manager : "Loading..."}</span></p>
//           <p>There are currently <span className='red'>{players.length}</span> people entered in the lottery</p>
//           <p>Current balance is <span className='red'>{web3.utils.fromWei(balance, 'ether')}</span> ether</p>
//         </div>
//         <div className='lower-layer'>
//           <div className='heading'>
//             <h3>Want to try your Luck?</h3>
//           </div>
//           <div>
//             <form onSubmit={handleSubmit}>
//               <div className='spacing'>
//               <label htmlFor="">Amount of Ether to Enter :</label>
//               <input type="text" value={value} onChange={(e)=>setValue(e.target.value)} />
//               </div>
//               <div className="bttn">
//               <button className='btn' type='submit'>Enter Lottery</button>
//               </div>
//             </form>
//           </div>
//           <hr className='style'/>
//           <div>
//             <div className="heading">
//               <h3>Pick a Winner?</h3>
//             </div>
//             <div className="bttn">
//               <button className='btn' onClick={pickWinner}>Pick a Winner</button>
//             </div>
//           </div>
//         </div>


//       </div>
//     </>
//   );
// }

// export default App;


/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import './App.css';
import lottery from './lottery';
import {Toaster} from 'react-hot-toast';
import {toast} from 'react-hot-toast';
import web3, { getWeb3 } from './web3';

// Hardcoded accounts - replace with your actual additional account addresses
const HARDCODED_ACCOUNTS = [
  "0x6E26BA9791950A627122C06E32f5eF2Cc9bF6FaC",  // Your current account
  "0x2ac36C58C556BC6acF79461279783F0458d19c42",  // Replace with your second account
  "0x20E9FD1ba664Af11b0bE42Fb101507F2C4CA659c"   // Replace with your third account
];

function App() {
  const [manager, setManager] = useState('');
  const [players, setPlayers] = useState([]);
  const [balance, setBalance] = useState('');
  const [value, setValue] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState('');

  // Load accounts on component mount
  useEffect(() => {
    const loadAccounts = async () => {
      try {
        // Ensure we have permission to access accounts
        await getWeb3();
        
        // Get accounts from MetaMask
        const metaMaskAccounts = await web3.eth.getAccounts();
        console.log("MetaMask accounts:", metaMaskAccounts);
        
        // Use hardcoded accounts instead of just MetaMask accounts
        setAccounts(HARDCODED_ACCOUNTS);
        
        if (HARDCODED_ACCOUNTS.length > 0 && !selectedAccount) {
          setSelectedAccount(HARDCODED_ACCOUNTS[0]);
        }
      } catch (error) {
        console.error("Failed to load accounts:", error);
        toast.error("Failed to load accounts");
      }
    };
    
    loadAccounts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (value < 0.01) {
      toast.error("Please enter an amount more than 0.01 ether");
      return;
    }
    
    if (!selectedAccount) {
      toast.error("Please select an account first");
      return;
    }

    try {
      console.log(`Entering lottery from account: ${selectedAccount} with ${value} ether`);
      
      // If using hardcoded accounts that aren't in MetaMask, you might need to handle this differently
      // The following code assumes the selected account is accessible via MetaMask
      await lottery.methods.enter().send({
        from: selectedAccount,
        value: web3.utils.toWei(value, 'ether'),
      });
      
      toast.success("Entered the lottery successfully");
      setValue("");
      
      // Refresh contract data after entry
      refreshContractData();
    } catch (error) {
      console.error("Error entering lottery:", error);
      toast.error("Failed to enter lottery");
    }
  };

  // Rest of your code...

  const pickWinner = async () => {
    if (!selectedAccount) {
      toast.error("Please select an account first");
      return;
    }

    try {
      await lottery.methods.pickWinner().send({
        from: selectedAccount,
      });
      toast.success("Winner has been picked");
      
      // Refresh contract data after picking winner
      refreshContractData();
    } catch (error) {
      console.error("Error picking winner:", error);
      toast.error("Failed to pick winner");
    }
  };

  // Function to refresh contract data
  const refreshContractData = async () => {
    try {
      const manage = await lottery.methods.manager().call();
      setManager(manage);

      const playersList = await lottery.methods.getPlayers().call();
      setPlayers(playersList);

      const contractBalance = await web3.eth.getBalance(lottery.options.address);
      setBalance(contractBalance);
    } catch (error) {
      console.error("Error refreshing contract data:", error);
    }
  };

  useEffect(() => {
    const getContractInfo = async () => {
      await refreshContractData();
    };
    
    getContractInfo();
  }, []);

  // Function to handle account selection change
  const handleAccountChange = (e) => {
    setSelectedAccount(e.target.value);
  };

  return (
    <>
      <Toaster />
      <div className='main'>
        <img src="/block.png" alt="blockchain logo" />
        <h2>Lottery Contract</h2>
      </div>
      <div className='container'>
        <div className="upper-layer">
          <p>This contract is managed by <span className='red'>{manager ? manager : "Loading..."}</span></p>
          <p>There are currently <span className='red'>{players.length}</span> people entered in the lottery</p>
          <p>Current balance is <span className='red'>{web3.utils.fromWei(balance, 'ether')}</span> ether</p>
          
          {/* Account selector dropdown */}
          <div className="account-selector">
            <label>Select Account: </label>
            <select 
              value={selectedAccount} 
              onChange={handleAccountChange}
              className="account-dropdown"
            >
              {accounts.length === 0 && <option value="">Loading accounts...</option>}
              {accounts.map((account, index) => (
                <option key={index} value={account}>
                  {account}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className='lower-layer'>
          <div className='heading'>
            <h3>Want to try your Luck?</h3>
          </div>
          <div>
            <form onSubmit={handleSubmit}>
              <div className='spacing'>
                <label htmlFor="">Amount of Ether to Enter :</label>
                <input type="text" value={value} onChange={(e)=>setValue(e.target.value)} />
              </div>
              <div className="bttn">
                <button className='btn' type='submit'>Enter Lottery</button>
              </div>
            </form>
          </div>
          <hr className='style'/>
          <div>
            <div className="heading">
              <h3>Pick a Winner?</h3>
            </div>
            <div className="bttn">
              <button className='btn' onClick={pickWinner}>Pick a Winner</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;


