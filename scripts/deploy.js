const hre = require("hardhat");
const fs = require("fs");
const path = require("path");
const { Web3Storage, File, Blob } = require("web3.storage");

async function main() {
  const WebNft = await hre.ethers.getContractFactory("WebNft");
  const webNft = await WebNft.deploy();

  await webNft.deployed();

  console.log("web nft deployed to:", webNft.address);

  const html = await fs.readFileSync(
    path.join(__dirname, "..", "assets", "index.html")
  );

  const storage = new Web3Storage({
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDJlMTM4YUQ1RmNFMkZBZTM1MTYyZERBYzc2RjFGY0IxQzNmMjA5N0QiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjU0MTY3NTA5ODIsIm5hbWUiOiJTdHJlYW1GaSB0ZXN0In0.ozLCEZhE-AhP2rAWmt162sLn3TbGM-AIeZAoqwXhoP0",
  });

  const cid = await storage.put([new File([html], "index.html")]);

  const url = `https://${cid}.ipfs.w3s.link`;

  const metadata = {
    name: "Test web NFT on YT",
    description: "This is a test description",
    animation_url: url,
  };

  const blob = new Blob([JSON.stringify(metadata)], {
    type: "application/json",
  });

  const metadataCid = await storage.put([new File([blob], "metadata.json")]);

  const txn = await webNft.functions.safeMint(
    "0xb05e879CA443eaDce5d2d7D5B256cb8624a46FbA",
    `https://${metadataCid}.ipfs.w3s.link/metadata.json`
  );

  await txn.wait();
  console.log("NFT minted!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
