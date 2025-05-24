// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {AgriSupplyChain} from "../src/FARM.sol";

contract script is Script {
    AgriSupplyChain public supply;

    function run() public {
        vm.startBroadcast();

        supply = new AgriSupplyChain();

        vm.stopBroadcast();
    }
}
