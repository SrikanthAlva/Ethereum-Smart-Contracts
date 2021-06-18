pragma solidity 0.8.4;

contract Store {
  
  // Events
  event itemAddedEvent(uint _id, string _name, uint256 _price, address _buyer);
  event itemRemovedEvent(uint _id, string _name, uint256 _price, address _buyer);
  event itemBoughtEvent(uint _id, string _name, uint256 _price, address _buyer);
  
  address owner;
  
  struct Item {
    uint id;
    string name;
    uint price;
    address buyer;
  }
  
  uint itemCount = 0;
  mapping(uint => Item) Items;
  
  constructor() {
    owner = msg.sender;
  }
  
  // Endpoints
  function addItem(string memory _name, uint256 _price) external onlyOwner {
    require(_price > 0);
    
    itemCount++;
    Items[itemCount] = Item(itemCount, _name, _price, address(0)); 
    
    emit itemAddedEvent(itemCount, _name, _price, address(0));
  }
  
  function removeItem(uint _id) external onlyOwner {
    require(_id > 0 && _id <= itemCount);
    Item storage item = Items[_id];
    require(item.price != 0);
    item.price = 0;
    
    emit itemRemovedEvent(_id, item.name, item.price, item.buyer);
  }
  
  function buyItem(uint _id) payable public notOwner {
    require(_id > 0 && _id <= itemCount);
    Item storage item = Items[_id];
    require(item.buyer == address(0) && item.price == msg.value);
    item.buyer = msg.sender;
    item.price = 0;
    payable(owner).transfer(msg.value);
    
    emit itemBoughtEvent(_id, item.name, msg.value, item.buyer);
  }
  
  function getItem(uint _id) external view returns(uint id, string memory name, uint256 price, address buyer){
    require(_id > 0 && _id <= itemCount);
    Item storage item = Items[_id];
    
    return (item.id, item.name, item.price, item.buyer);
  }
  
  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }
  
  modifier notOwner() {
        require(msg.sender != owner);
    _;
  }
}
