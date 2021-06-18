const Store = artifacts.require("Store");

const Web3 = require('web3');
const web3 = new Web3();
web3.setProvider(new Web3.providers.HttpProvider("http://localhost:8545"));

contract("Store", function(accounts){

  const owner = web3.eth.defaultAccount = accounts[0];
  
  describe("addItem", function(){
    it("should add an item", function(){
      var currentInstance;
      return Store.deployed().then(function(instance){
        currentInstance = instance;
        return currentInstance.addItem("iPhone8", web3.toWei(2, "ether"), {from: owner});
      }).then(function(receipt){
        assert.equal(receipt.logs[0].event, "itemAddedEvent", "should trigger itemAddedEvent");
        return currentInstance.getItem(1);
      }).then(function(data){
        assert.equal(data[0], 1, "should add item id to store and be retrievable by getItem function");
        assert.equal(data[1], "iPhone8", "should add item name to store and be retrievable by getItem function");
        assert.equal(data[2], web3.toWei(2, "ether"), "should add item price to store and be retrievable by getItem function");
        assert.equal(data[3], 0x0, "should add empty item buyer to store and be retrievable by getItem function");
      });
    });
    
    it("should only be available to the owner", function(){
      var currentInstance;
      return Store.deployed().then(function(instance){
        currentInstance = instance;
        return currentInstance.addItem("iPhone8", web3.toWei(1, "ether"), {from: accounts[2]});
      }).then(assert.fail).catch(function(error){
        assert(error.message.indexOf('invalid opcode') >= 0, "should throw error");
      })
    });
    
    it("should not allow sell price of 0 or less", function(){
      var currentInstance;
      return Store.deployed().then(function(instance){
        currentInstance = instance;
        return currentInstance.addItem("Dirty Underwear", 0, {from: owner});
      }).then(assert.fail).catch(function(error){
        assert(error.message.indexOf('invalid opcode') >= 0, "should throw error");
      });
    });
  });
  
  describe("removeItem", function(){
    it("should remove an item", function(){
      var currentInstance;
      return Store.deployed().then(function(instance){
        currentInstance = instance;
        return currentInstance.removeItem(1, {from: owner});
      }).then(function(receipt){
        assert.equal(receipt.logs[0].event, "itemRemovedEvent", "should trigger itemRemovedEvent");
        return currentInstance.buyItem(1, {from: accounts[2], value: web3.toWei(2, "ether")});
      }).then(assert.fail).catch(function(error){
        assert(error.message.indexOf('invalid opcode') >= 0, "should not allow others to buy a removed item using buyItem function");
      });
    });
    
    // item 1 removed
    
    it("should only be available to the owner", function(){
      var currentInstance;
      return Store.deployed().then(function(instance){
        currentInstance = instance;
        currentInstance.addItem("iPhone", web3.toWei(3, "ether"), {from: owner});
      }).then(function(){
        return currentInstance.removeItem(2, {from: accounts[3]});
      }).then(assert.fail).catch(function(error){
        assert(error.message.indexOf('invalid opcode') >= 0, "should throw error on non-owner");
      });
    });
    
    it("should not be able to remove items previously sold", function(){
      var currentInstance;
      return Store.deployed().then(function(instance){
        currentInstance = instance;
        return currentInstance.buyItem(2, {from: accounts[3], value: web3.toWei(3, "ether")});
      }).then(function(){
        return currentInstance.removeItem(2, {from: owner});
      }).then(assert.fail).catch(function(error){
        assert(error.message.indexOf('invalid opcode') >= 0, "should throw error when removing previously sold item");
      });
    });
  });
  
//   item 1 removed
//   item 2 purchased
  
    
  
  describe("buyItem", function(){
    it("should buy item", function(){
      var currentInstance;
      var ownerBalanceBefore;
      var ownerBalanceAfter;
      return Store.deployed().then(function(instance){
        currentInstance = instance;
        return currentInstance.addItem("Shoes", web3.toWei(2.5, "ether"), {from: owner});
      });
      /*
      .then(function(){
        ownerBalanceBefore = web3.fromWei(web3.eth.getBalance(owner), "ether").toNumber();
        return currentInstance.buyItem(3, {from: accounts[4], value: web3.toWei(2.5, "ether")});
      }).then(function(receipt){
        ownerBalanceAfter = web3.fromWei(web3.eth.getBalance(owner), "ether").toNumber();
        assert(ownerBalanceBefore + 2.5 == ownerBalanceAfter, "should tranfer value of sale to owner");
        assert.equal(receipt.logs[0].event, "itemBoughtEvent", "should trigger itemBoughtEvent");
        return currentInstance.getItem(3);
      }).then(function(data){
        assert.equal(data[3], accounts[4], "all data (id, name, price, buyer) on currently bought item should be accesible through getItem function");
      });
      */
    });
  
    
    // item 1 removed
    // item 2 purchased
    // item 3 purchased
    
    it("should not allow owner to buy items", function(){
      var currentInstance;
      return Store.deployed().then(function(instance){
        currentInstance = instance;
        currentInstance.addItem("T-shirt", web3.toWei(2.1, "ether"), {from: owner}); // item 4
        currentInstance.addItem("Pants", web3.toWei(3.2, "ether"), {from: owner});  // item 5
        currentInstance.addItem("Socks", web3.toWei(0.8, "ether"), {from: owner}); // item 6
        currentInstance.addItem("Hat", web3.toWei(1.2, "ether"), {from: owner}); // item 7
        currentInstance.addItem("Sun Glasses", web3.toWei(4, "ether"), {from: owner}); // item 8
        currentInstance.addItem("Ring", web3.toWei(5.1, "ether"), {from: owner}); // item 9
      }).then(function(){
        return currentInstance.buyItem(7, {from: owner, value: web3.toWei(1.2, "ether")});
      }).then(assert.fail).catch(function(error){
        assert(error.message.indexOf('invalid opcode') >= 0, "should throw error if owner tries to use buyItem");
      });
    });
    
    it("should receive an _id that exists in store", function(){
      var currentInstance;
      return Store.deployed().then(function(instance){
        currentInstance = instance;
        return currentInstance.buyItem(100, {from: accounts[2], value: 0});
      }).then(assert.fail).catch(function(error){
        assert(error.message.indexOf('invalid opcode') >= 0, "should throw error if buying item that doesn't exist");
      }).then(function(){
        return currentInstance.buyItem(0, {from: accounts[2], value: 0});
      }).then(assert.fail).catch(function(error){
        assert(error.message.indexOf('invalid opcode') >= 0, "should throw error if buying item that doesn't exist");
      });
    });
    
    it(" Should throw error if `msg.value` is not equal to the price of the item being bought. Should be exact value.", function(){
      var currentInstance;
      return Store.deployed().then(function(instance){
        currentInstance = instance;
       return currentInstance.buyItem(5, {from: accounts[2], value: web3.toWei(3.5, "ether")});
      }).then(assert.fail).catch(function(error){
        assert(error.message.indexOf('invalid opcode') >= 0, " Should throw error if msg.value is not equal to the price of the item being bought. Should be exact value.");
      }).then(function(){
        return currentInstance.buyItem(6, {from: accounts[2], value: web3.toWei(0.6, "ether")});
      }).then(assert.fail).catch(function(error){
        assert(error.message.indexOf('invalid opcode') >= 0, " Should throw error if msg.value is not equal to the price of the item being bought. Should be exact value.");
      });
    });
    
    it("should not be allowed to repurchase already sold items", function(){
      var currentInstance;
      return Store.deployed().then(function(instance){
        currentInstance = instance;
       return currentInstance.buyItem(2, {from: accounts[5], value: web3.toWei(3, "ether")});
      }).then(assert.fail).catch(function(error){
        assert(error.message.indexOf('invalid opcode') >= 0, "should throw error if buying previously sold item");
      });
    });  
  });
  
  describe("getItem", function(){
    it("should getItem", function(){
      var currentInstance;
      return Store.deployed().then(function(instance){
        currentInstance = instance;
       return currentInstance.getItem(8);
      }).then(function(data){
        assert.equal(data[0], 8, "Should be able to get id of item that is currently for sale");
        assert.equal(data[1], "Sun Glasses", "Should be able to get name of item that is currently for sale");
        assert.equal(data[2], web3.toWei(4, "ether"), "Should be able to get price of item that is currently for sale");
        assert.equal(data[3], 0x0, "buyer of item that is currently for sale should be empty");
      }).then(function(){
        currentInstance.buyItem(8, {from: accounts[1], value: web3.toWei(4, "ether")});
      }).then(function(){
        return currentInstance.getItem(8);
      }).then(function(data){
        assert.equal(data[0], 8, "Should be able to get id of item that has been sold");
        assert.equal(data[1], "Sun Glasses", "Should be able to get name of item that has been sold");
        assert.equal(data[2], web3.toWei(4, "ether"), "Should be able to get price of item that has been sold");
        assert.equal(data[3], accounts[1], "Should be able to get buyer address of item that has been sold");
      }).then(function(){
        currentInstance.removeItem(9, {from: owner});
      }).then(function(){
        return currentInstance.getItem(9);
      }).then(function(data){
        assert.equal(data[0], 9, "Should be able to get id of item that has been removed");
        assert.equal(data[1], "Ring", "Should be able to get name of item that has been removed");
        assert.equal(data[2], 0, "price of item that has been removed should be 0");
      });
    });
  });
});
