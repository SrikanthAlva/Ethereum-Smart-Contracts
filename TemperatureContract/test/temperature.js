const Temperature = artifacts.require("Temperature");

contract('Temperature', async() => {

    it("should be deployed", async() => {
        var temperature = await Temperature.deployed();
        assert(temperature.address != "");
    });

    it("should set and get temperature", async() => {
        var temperature = await Temperature.deployed();
        temperature.setTemp(23);
        var temp = await temperature.getTemp();
        assert(temp, 23);
    });

})