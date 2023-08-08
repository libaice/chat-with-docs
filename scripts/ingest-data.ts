export const run = async () => {
    console.log("hello world");
};

(async () => {
  await run();
  console.log("ingestion complete");
})();
