import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const CredentialManager = await ethers.getContractFactory("CredentialManager");
  const credentialManager = await CredentialManager.deploy();
  await credentialManager.waitForDeployment();

  const address = await credentialManager.getAddress();
  console.log("CredentialManager deployed to:", address);
  
  // Add deployer as issuer (deployer is already owner and issuer by default)
  console.log("Deployer is now an issuer");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
