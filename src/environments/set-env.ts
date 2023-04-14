const setEnv = () => {
    const fs = require('fs');
    const writeFile = fs.writeFile;
    // Configure Angular `environment.ts` file path
    const targetPath = './src/environments/environment.ts';
    require('dotenv').config({
      path: 'src/environments/.env'
    });
    // `environment.ts` file structure
    const envConfigFile = `export const environment = {
      apiKey: '${process.env.API_KEY}',
      firebaseUrl: '${process.env.FIRE_SHOP}',
      production: false,
    };`;

    console.log('The file `environment.ts` will be written with the following content: \n');
    writeFile(targetPath, envConfigFile, (err) => {
      if (err) {
        console.error(err);
        throw err;
      } else {
        console.log(`Angular environment.ts file generated correctly at ${targetPath} \n`);
      }
    });
};
  
setEnv();
