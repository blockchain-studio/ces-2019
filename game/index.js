const App = {

  contractAddress: function() {
    return "0xbf17193dec74ae4ed78f9b8e1c0a551322255c8b";
  },

  initContract: function () {
    var RocksideFlagContract = web3.eth.contract([
      {
        "constant": true,
        "inputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "name": "captured",
        "outputs": [
          {
            "name": "",
            "type": "bool"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "name",
            "type": "bytes32"
          }
        ],
        "name": "captureTheFlag",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "name": "whoAddress",
            "type": "address"
          },
          {
            "indexed": false,
            "name": "whoName",
            "type": "bytes32"
          }
        ],
        "name": "LogCaptured",
        "type": "event"
      }
    ]);

    this.rocksideFlag = RocksideFlagContract.at(this.contractAddress());

    App.initAccount()
  },

  initAccount: function () {
    const app = this

    web3.eth.getAccounts(function (err, accs) {
      if (err != null) {
        alert('There was an error fetching your accounts.')
        return
      }

      if (accs.length === 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.")
        return
      }

      accounts = accs
      account = accounts[0]

      app.wallOfFame()
    })
  },

  wallOfFame: function () {
    var meta;
    const app = this;
    var events = this.rocksideFlag.allEvents({fromBlock: 0, toBlock: 'latest'});
    
    events.get(function(error, logs){
        var oldBossList = "";
        var currentBossName;
        var currentBossAddress;
        var index = 0;

        if(logs.length > 0)
        {
          logs.forEach(function(entry) {
            index++
            var separator = (oldBossList)?", ":""
            oldBossList = window.web3.toUtf8(entry['args']['whoName']) + separator + oldBossList

            if(index == logs.length) {
              currentBossName = window.web3.toUtf8(entry['args']['whoName'])
              currentBossAddress = entry['args']['whoAddress']
            }
          });
          const oldBossElement = document.getElementById('oldBoss')
          oldBossElement.innerHTML = "<strong>Wall of fame: </strong>" + oldBossList
          app.setBoss(currentBossAddress, currentBossName);
        }
        else
        {
          app.setBoss(undefined, 'Nobody');
        }
      })
  },

  capture: function () {

    const name = document.getElementById('name').value
    this.setAppStatus('Initiating transaction... (please wait ⏳)')

    const app = this;
    this.rocksideFlag.captureTheFlag(name.normalize('NFD').replace(/[\u0300-\u036f]/g, ""), {value: 0}, function(err, result){

        var url = App.etherscanBaseUrl()+"/tx/"+result;
        app.displayRocker('transactionWait')

        app.setAppStatus("👉 Wait for transaction to be mined, check it <a target='_blank' href="+url+">on Etherscan</a>")
       
        app.getTransactionReceiptMined(result).then(function (receipt) {
          app.setAppStatus("🎉 Your transaction is confirmed: <a target='_blank' href="+url+">Here</a>")
           app.setBoss(account, name)
        });
    });
  },

  setBoss: function (currentBossAddress, currentBossName) {

    const currentBossElement = document.getElementById('currentBoss')

    if(currentBossAddress == account){
      currentBossElement.innerHTML = "omg <strong>"+ currentBossName+"</strong>, you run the CES Wind Turbine ! 👏"
      const beforeCaptureState = document.getElementById('beforeCaptureState')
      beforeCaptureState.style.visibility = 'hidden';
      this.displayRocker('userHasTheGuitar')
    } else {
      if(currentBossAddress){
        currentBossElement.innerHTML = "<strong>" + currentBossName + "</strong> runs the CES Wind Turbine ⚡";
        this.displayRocker('anotherUserHasTheGuitar')
      } else {
        currentBossElement.innerHTML = "<strong>Be the first</strong> to run the CES Wind Turbine ⚡";
        this.displayRocker('nobodyHasTheGuitar')
      }
      this.beforeCaptureMode()
    }
  },

  checkNetwork: function(actualNetwork)
  {

    var expectedNetwork = 3; // Ropsten

    if(expectedNetwork != actualNetwork)
    {
      this.setTechStatus("⚠️ Please connect to Ethereum Ropsten Network")
      return false;
    }
    return true;
  },

  noMetamask: function()
  {
    this.setTechStatus("⚠️ Please Install <a target='_blank' href='https://metamask.io'>Metamask</a> and come back !")
    const beforeCaptureState = document.getElementById('beforeCaptureState')
    beforeCaptureState.style.visibility = 'hidden';
    this.displayRocker('noMetamask')
  },

  setAppStatus: function (message) {
    const status = document.getElementById('appStatus')
    appStatus.innerHTML = message
  },

  setTechStatus: function (message) {
    const techStatus = document.getElementById('techStatus')
    techStatus.innerHTML = message
    techStatus.style.visibility = 'visible';
  },

  getTransactionReceiptMined: function(txHash, interval) {
    const app = this;
    const transactionReceiptAsync = function(resolve, reject) {
          web3.eth.getTransactionReceipt(txHash, (error, receipt) => {
              if (error) {
                  reject(error);
              } else if (receipt == null) {
                  setTimeout(
                      () => transactionReceiptAsync(resolve, reject),
                      interval ? interval : 500);
              } else {
                  resolve(receipt);
              }
          });
      };

      if (Array.isArray(txHash)) {
          return Promise.all(txHash.map(
            oneTxHash => self.getTransactionReceiptMined(oneTxHash, interval)));
      } else if (typeof txHash === "string") {
          return new Promise(transactionReceiptAsync);
      } else {
        throw new Error("Invalid Type: " + txHash);
      }
  },

  displayRocker: function(name) {
    const anotherUserHasTheGuitar = document.getElementById('anotherUserHasTheGuitar')
    const nobodyHasTheGuitar = document.getElementById('nobodyHasTheGuitar')
    const transactionWait = document.getElementById('transactionWait')
    const userHasTheGuitar = document.getElementById('userHasTheGuitar')
    const noMetamask = document.getElementById('noMetamask')

    anotherUserHasTheGuitar.style.display = (name=='anotherUserHasTheGuitar')?'block':'hidden';
    nobodyHasTheGuitar.style.display = (name=='nobodyHasTheGuitar')?'block':'hidden';
    transactionWait.style.display = (name=='transactionWait')?'block':'hidden';
    userHasTheGuitar.style.display = (name=='userHasTheGuitar')?'block':'hidden';
    noMetamask.style.display = (name=='noMetamask')?'block':'hidden';
  },

  etherscanBaseUrl: function() {
    return "https://ropsten.etherscan.io";
  },

  beforeCaptureMode: function () {
    const beforeCaptureState = document.getElementById('beforeCaptureState')
    beforeCaptureState.style.visibility = 'visible';
  },

  init: function() {
    web3.version.getNetwork((err, netId) => {
      if(App.checkNetwork(netId))
      {
        App.initContract();
      }
    });
  },
}

window.App = App

window.addEventListener('load', async () => {
    // Modern dapp browsers...
    if (window.ethereum) {
        web3 = new Web3(ethereum);
        try {
            // Request account access if needed
            await ethereum.enable();
            App.init();
        } catch (error) {
            // User denied account access...
        }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
        window.web3 = new Web3(web3.currentProvider);
        App.init();
    }
    else {
        App.noMetamask();
    }
});

