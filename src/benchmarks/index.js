const Benchmark = require("benchmark");

const suite = new Benchmark.Suite();

suite
  .add("Gen1", async () => {
    await SomeFunction1();
  })
  .add("Gen2", async () => {
    await SomeFunction2();
  })
  .on("cycle", (event) => {
    console.log(String(event.target));
  })
  .on("complete", function () {
    console.log(`Fastest is ${this.filter("fastest").map("name")}`);
  })
  .run({ async: true });
