App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    return await App.initWeb3();
  },

  initWeb3: async function() {
    // Modern dapp browsers...
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        // Request account access
        await window.ethereum.request({ method: "eth_requestAccounts" });;
      } catch (error) {
        // User denied account access...
        console.error("User denied account access")
      }
    }

    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    }

    // If no injected web3 instance is detected, fall back to Ganache
    else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }

    web3 = new Web3(App.web3Provider);

    App.initTransak();

    return App.initContract();
  },

  initTransak: function() {
    let transak = new TransakSDK.default({
      apiKey: 'b2ce2203-845f-4e9b-80fa-b8ee54e62ba5',
      environment: 'STAGING',
      hostURL: window.location.origin,
      widgetHeight: '625px',
      widgetWidth: '500px',
      // Examples of some of the customization parameters you can pass
      defaultFiatAmount: '99',
      fiatCurrency: 'USD',
      cryptoCurrencyCode: 'ETH',
      walletAddress: '0x860A7555653810d0F86b942563cFC4374e4E7a77',
      // themeColor: '[COLOR_HEX]',
      // email: '',
      // redirectURL: ''
    });

    transak.init();

    // To get all the events
    transak.on(transak.ALL_EVENTS, (data) => {
      console.log(data);
    });

    // This will trigger when the user marks payment is made.
    transak.on(transak.EVENTS.TRANSAK_ORDER_SUCCESSFUL, (orderData) => {
      console.log(orderData);
      transak.close();
    });
  },

  initContract: function() {
    $.getJSON('Trust.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with @truffle/contract
      var TrustArtifact = data;
      App.contracts.Trust = TruffleContract(TrustArtifact);

      // Set the provider for our contract
      App.contracts.Trust.setProvider(App.web3Provider);

      // Use our contract to retrieve and mark the adopted pets
      return App.getTrustInfo();
    });

    return App.bindEvents();
  },

  getTrustInfo: function() {
    var trustInstance;

    var creator;
    var heir;
    var usState;
    var transferDate;

    App.contracts.Trust.deployed().then(function(instance) {
      trustInstance = instance;

      return trustInstance.creator.call();
    }).then(function(creator) {
      $('.creator').text(creator);
      return trustInstance.heir.call();
    }).then(function(heir) {
      $('.heir').text(heir);
      return trustInstance.usState.call();
    }).then(function(usState) {
      $('.usState').text(usState);
      return trustInstance.transferDate.call();
    }).then(function(transferDate) {
      var transferDateHuman = new Date(0);
      transferDateHuman.setUTCSeconds(transferDate);
      $('.transferDate').text(transferDateHuman);

      web3.eth.getAccounts(function(error, accounts) {
        var account = accounts[0];

        web3.eth.getBalance(account, function(error, balance) {
          $('.balance').text(web3.fromWei(balance, "ether") + " ETH");
        })
      });
    })
  },

  bindEvents: function() {
    $(document).on('click', '.btn-adopt', App.handleAdopt);
    $(document).on('click', '.btn-create-trust', App.handleCreateTrust);
    $(document).on('click', '.btn-fund', App.handleFund);
  },

  markAdopted: function() {
    var adoptionInstance;

    App.contracts.Adoption.deployed().then(function(instance) {
      adoptionInstance = instance;

      return adoptionInstance.getAdopters.call();
    }).then(function(adopters) {
      for (i = 0; i < adopters.length; i++) {
        if (adopters[i] !== '0x0000000000000000000000000000000000000000') {
          $('.panel-pet').eq(i).find('button').text('Success').attr('disabled', true);
        }
      }
    }).catch(function(err) {
      console.log(err.message);
    });
  },

  handleAdopt: function(event) {
    event.preventDefault();

    var petId = parseInt($(event.target).data('id'));

    var adoptionInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
    
      var account = accounts[0];
    
      App.contracts.Adoption.deployed().then(function(instance) {
        adoptionInstance = instance;
    
        // Execute adopt as a transaction by sending account
        return adoptionInstance.adopt(petId, {from: account});
      }).then(function(result) {
        return App.markAdopted();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  handleCreateTrust: function(event) {
    event.preventDefault();

    var heirInput = $('#heirInput').val();
    var usStateInput = $('#usStateInput').val();
    var age = parseInt($('#age').val());
    var heirDobRaw = $('#heirDob').val();
    var year = heirDobRaw.substring(0, 4);
    var month = heirDobRaw.substring(5, 7);
    var day = heirDobRaw.substring(8, 10);
    var heirDob = new Date(year, month - 1, day);

    var trustInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Trust.deployed().then(function(instance) {
        trustInstance = instance;

        // Execute init as a transaction by sending account
        return trustInstance.initContract(
          heirInput, // heir address
          usStateInput,
          Math.round(heirDob.getTime() / 1000) + age*31536000,
          { from: account }
        );
      }).then(function(result) {
        return App.getTrustInfo();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  handleFund: function(event) {
    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      web3.eth.sendTransaction({
        from: '0x73Cc560a5b02792e10468C2b3615e09179f9ebb3',
        to: '0x860A7555653810d0F86b942563cFC4374e4E7a77',
        value: web3.toWei(1, 'ether'),
        gasLimit: 21000,
        gasPrice: 20000000000,
      }, function(error, result) {
        if (error) {
          console.log(error);
        } else {
          console.log('SUCCESS');
        }
      });
    });
  }

};

$(function() {
  $(window).load(function() {
    App.init();

    setInterval(function() {
      $('.current-time').text(
        (new Date()).toString()
      );
    }, 1000);
  });
});
