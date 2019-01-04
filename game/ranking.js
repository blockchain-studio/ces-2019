const App = {
    contractAddress: function() {
        return '0xbf17193dec74ae4ed78f9b8e1c0a551322255c8b';
        //return "0x73ea8612b3407ee2f999dcbb68c9140df08a144b";
    },

    initContract: function() {
        var RocksideFlagContract = window.web3.eth.contract([
            {
                constant: true,
                inputs: [
                    {
                        name: '',
                        type: 'address',
                    },
                ],
                name: 'captured',
                outputs: [
                    {
                        name: '',
                        type: 'bool',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            {
                constant: false,
                inputs: [
                    {
                        name: 'name',
                        type: 'bytes32',
                    },
                ],
                name: 'captureTheFlag',
                outputs: [],
                payable: false,
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                anonymous: false,
                inputs: [
                    {
                        indexed: true,
                        name: 'whoAddress',
                        type: 'address',
                    },
                    {
                        indexed: false,
                        name: 'whoName',
                        type: 'bytes32',
                    },
                ],
                name: 'LogCaptured',
                type: 'event',
            },
        ]);

        this.rocksideFlag = RocksideFlagContract.at(this.contractAddress());
    },

    getBlockNumber: async function() {
        return new Promise(function(resolve, reject) {
            window.web3.eth.getBlockNumber(function(error, result) {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });
    },

    getNetwork: async function() {
        return new Promise(function(resolve, reject) {
            window.web3.version.getNetwork((error, netId) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(netId);
                }
            });
        });
    },

    initRank: function(name, address) {
        return { name: name, address: address, point: 0, isCurrent: false };
    },

    getAllEvents: async function(events) {
        return new Promise(function(resolve, reject) {
            events.get(function(error, logs) {
                if (error) {
                    reject(error);
                } else {
                    resolve(logs);
                }
            });
        });
    },

    calculateRanking: async function() {
        const app = this;
        var events = this.rocksideFlag.allEvents({ fromBlock: 0, toBlock: 'latest' });

        var result = [];

        const logs = await this.getAllEvents(events);
        const currentBlock = await this.getBlockNumber();
        var index = 0;
        if (logs.length > 0) {
            var previousEntry = null;
            var hallOfFame = [];
            const kWhByBlock = 2.8;

            logs.forEach(function(entry) {
                index++;

                if (index == logs.length) {
                    currentBossName = window.web3.toUtf8(entry['args']['whoName']);
                    currentBossAddress = entry['args']['whoAddress'];
                    numberOfBlock = currentBlock - entry['blockNumber'];

                    if (hallOfFame[currentBossAddress] == undefined) {
                        hallOfFame[currentBossAddress] = app.initRank(currentBossName, currentBossAddress);
                    }

                    hallOfFame[currentBossAddress].name = currentBossName;
                    hallOfFame[currentBossAddress].point += numberOfBlock * kWhByBlock;
                    hallOfFame[currentBossAddress].isCurrent = true;
                }

                if (previousEntry != null) {
                    previousBossName = window.web3.toUtf8(previousEntry['args']['whoName']);
                    previousBossAddress = previousEntry['args']['whoAddress'];
                    numberOfBlock = entry['blockNumber'] - previousEntry['blockNumber'];

                    if (hallOfFame[previousBossAddress] == undefined) {
                        hallOfFame[previousBossAddress] = app.initRank(previousBossName, previousBossAddress);
                    }

                    hallOfFame[previousBossAddress].name = previousBossName;
                    hallOfFame[previousBossAddress].point += numberOfBlock * kWhByBlock;
                }

                previousEntry = entry;
            });

            result = Object.values(hallOfFame);

            result.sort(function(a, b) {
                return b.point - a.point;
            });
        }
        return result;
    },

    checkNetwork: function(actualNetwork) {
        var expectedNetwork = 3; // Ropsten

        if (expectedNetwork != actualNetwork) {
            this.setTechStatus('⚠️ Please connect to Ethereum Ropsten Network');
            return false;
        }
        return true;
    },

    setTechStatus: function(message) {
        const techStatus = document.getElementById('techStatus');
        techStatus.innerHTML = message;
        techStatus.style.visibility = 'visible';
    },

    noMetamask: function() {
        this.setTechStatus("⚠️ Please Install <a target='_blank' href='https://metamask.io'>Metamask</a> and come back !");
        const beforeCaptureState = document.getElementById('beforeCaptureState');
        beforeCaptureState.style.visibility = 'hidden';
        this.displayRocker('noMetamask');
    },

    init: async function() {
        var netId = await App.getNetwork();
        if (App.checkNetwork(netId)) {
            App.initContract();
        }
    },

    runCheckingLoop: function(callback) {
        clearInterval(this.oldInterval);
        callback();
        this.oldInterval = setInterval(() => {
            callback();
        }, 5000);
    },

    populateViews: function(data) {
        var defaultLi = $($('.ratingList li')[0]).clone();
        console.log('TE<sTST', defaultLi[0]);
        $('.ratingList').html('');

        var totalKwh = data.reduce((previous, current) => {
            return previous + current.point;
        }, 0);
        var currentUserRank = 0;
        var currentUser = data.filter((item, index) => {
            if (item.isCurrent) {
                currentUserRank = index + 1;
            }
            return item.isCurrent;
        })[0];

        data.forEach((item, index) => {

            var data = $($(defaultLi[0]).clone());
            data.find('.rank').html(index + 1 + '.');
            data.find('.avatar').css('background-image', 'url(https://avatars.io/twitter/' + item.name + ')');
            data.find('.twitterLink').attr('href', 'https://twitter.com/' + item.name);
            data.find('.twitterAt').html('@' + item.name);
            data.find('.addressLink').attr('href', 'https://ropsten.etherscan.io/address/' + item.address);
            data.find('.userScore').html('⚡ ' + item.point.toFixed(0) + ' kWh');
            data.find('.currentProgress').width((item.point / totalKwh) * 100 + '%');
            if (item.isCurrent) {
                data.addClass('current');
            }
            $('.ratingList').append(data);
        });

        var content = $('.content');
        content.find('.avatar').css('background-image', 'url(https://avatars.io/twitter/' + currentUser.name + ')');
        content.find('.text').html('@' + currentUser.name);
        
        //content.find('.score').html('⚡ ' + currentUser.point.toFixed(0) + ' kWh');
        content.find('.position').html(currentUserRank + getRankText(currentUserRank));

        content.find('.score')
            .find('.profileAddress')
            .html('⚡ ' + currentUser.point.toFixed(0) + ' kWh')
            .attr('href', 'https://ropsten.etherscan.io/address/' + currentUser.address);

        $('#wrapper').show();
    },
};

window.App = App;

window.addEventListener('load', async () => {

  window.web3 = new Web3(new Web3.providers.HttpProvider("https://demo.rockside.io/api/nodes/rpc/D1ycTxpjtu4rAQnM"));

  try {
      // Request account access if needed
      //await ethereum.enable();
      await App.init();
      App.runCheckingLoop(async () => {
          const result = await App.calculateRanking();
          App.populateViews(result);
      });
  } catch (error) {
      // User denied account access...
      console.log(error);
  }
});

function getRankText(rank) {
    switch (rank) {
        case 1:
            return 'st';
        case 2:
            return 'nd';
        case 3:
            return 'rd';
        default:
            return 'th';
    }
}
