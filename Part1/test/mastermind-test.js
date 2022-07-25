//[assignment] write your own unit test to show that your Mastermind variation circuit is working as expected
const chai = require("chai");
const path = require("path");

const wasm_tester = require("circom_tester").wasm;

const F1Field = require("ffjavascript").F1Field;
const Scalar = require("ffjavascript").Scalar;
exports.p = Scalar.fromString("21888242871839275222246405745257275088548364400416034343698204186575808495617");
const Fr = new F1Field(exports.p);

const buildp=require("circomlibjs").buildPoseidon;

const assert = chai.assert;

describe("MastermindVariation", function () {
  this.timeout(100000000);

  it("should pass the circuit fine", async () => {
    
    const circuit = await wasm_tester(
      "contracts/circuits/MastermindVariation.circom"
    );
    
    await circuit.loadConstraints();

    var poseidon = await buildp();
    var F = poseidon.F;

    const INPUT = {
      pubGuessA: "4",
      pubGuessB: "3",
      pubGuessC: "1",
      pubGuessD: "2",
      pubNumHit: "4",
      pubNumBlow: "0",
      pubSolnHash: "12043960009388920276913035255042950305478806922416569363133657547156223792489",
      privSolnA: "4",
      privSolnB: "3",
      privSolnC: "1",
      privSolnD: "2",
      privSalt: "1234",
    };

    const witness = await circuit.calculateWitness(INPUT, true);
    var poseidon = await buildp();
    var F = poseidon.F;
    const solutionHash = F.toObject(poseidon(["1234", "4", "3", "1","2"]));

    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)));
    assert(Fr.eq(Fr.e(witness[1]), solutionHash));
  });
});
