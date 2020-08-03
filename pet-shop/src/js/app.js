// var Web3 = require('web3');
// var web3;

App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    // Load pets.
    $.getJSON('../pets.json', function(data) {
      var petsRow = $('#petsRow');
      var petTemplate = $('#petTemplate');

      for (i = 0; i < data.length; i ++) {
        petTemplate.find('.panel-title').text(data[i].name);
        petTemplate.find('img').attr('src', data[i].picture);
        petTemplate.find('.pet-breed').text(data[i].breed);
        petTemplate.find('.pet-age').text(data[i].age);
        petTemplate.find('.pet-location').text(data[i].location);
        petTemplate.find('.btn-adopt').attr('data-id', data[i].id);

        petsRow.append(petTemplate.html());
      }
    });

    return await App.initWeb3();
  },

  initWeb3: async function() {
    if (typeof web3 !== undefined) {
      ethereum.enable().then(() => {
        App.web3Provider = new Web3('ws://127.0.0.1:8545');
        // App.web3Provider = new Web3(web3.currentProvider);
        // App.web3Provider = new Web3.providers.WebsocketProvider('ws://localhost:8545');
        // web3 = new Web3(web3.currentProvider);
        // window.web3 = new Web3(window.web3.currentProvider);
        // web3 = new Web3(Web3.givenProvider);
        console.log("here");
        console.log(App.web3Provider);
      });
    }
    else {
      // App.web3Provider = new Web3.providers.HttpProvider("http://localhost:8545");
      App.web3Provider = new Web3.providers.WebsocketProvider('ws://localhost:8545');

      // web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
      console.log("HERE");
    }
    // web3 = new Web3(App.web3Provider);
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("Adoption.json", (data) => {
      var adoptionArtifact = data;
      App.contracts.adoption = TruffleContract(adoptionArtifact);
      // App.contracts.setProvider(App.web3Provider);
      App.contracts.adoption.setProvider(App.web3Provider);
      // web3.setProvider(App.web3Provider);
      return App.markAdopted();
    })
    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-adopt', App.handleAdopt);
  },

  markAdopted: function(adopters, account) {
    App.contracts.adoption.deployed().then((instance) => {
      return instance.getAdopters.call();
    })
    .then((adopters) => {
      for (let i = 0; i < adopters.length; i++) {
        if (!web3.toBigNumber(adopters[i]).isZero()) {
          $('.panel-pet').eq(i).find("button").text("Success").attr("disabled", true);
        }
      }
    })
    .catch((error) => {
      console.log(error.message);
    })
  },

  handleAdopt: function(event) {
    event.preventDefault();

    var petId = parseInt($(event.target).data('id'));

    web3.eth.getAccounts((error, accounts) => {
      if (error) {
        console.log(error);
      }

      App.contracts.adoption.deployed().then((instance) => {
        return instance.adopt.sendTransaction(petId, {from: accounts[0]})
      }).then((result) => {
        return App.markAdopted();
      }).catch((error) => {
        console.log(error.message);
      })
    });
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
