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

    return App.initContract();
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
      $('.creator').text("Creator: " + creator);
      return trustInstance.heir.call();
    }).then(function(heir) {
      $('.heir').text("Heir: " + heir);
      return trustInstance.usState.call();
    }).then(function(usState) {
      $('.usState').text("US State: " + usState);
      return trustInstance.transferDate.call();
    }).then(function(transferDate) {
      var transferDateHuman = new Date(0);
      transferDateHuman.setUTCSeconds(transferDate);
      $('.transferDate').text("Transfer Date: " + transferDateHuman);
    })
  },

  bindEvents: function() {
    $(document).on('click', '.btn-adopt', App.handleAdopt);
    $(document).on('click', '.btn-create-trust', App.handleCreateTrust);
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
          '0xD48Cc8011633a73E97B753DB16e76F019C2c3AB9', // heir address
          'OR',
          Math.round((new Date()).getTime() / 1000),
          { from: account }
        );
      }).then(function(result) {
        return App.getTrustInfo();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
