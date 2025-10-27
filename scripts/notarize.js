const { notarize } = require('electron-notarize');

exports.default = async function notarizing(context) {
  const { electronPlatformName, appOutDir } = context;
  
  if (electronPlatformName !== 'darwin') {
    return;
  }

  const appName = context.packager.appInfo.productFilename;

  // Skip notarization in development or if credentials are missing
  if (process.env.NODE_ENV === 'development' || 
      !process.env.APPLE_ID || 
      !process.env.APPLE_ID_PASSWORD) {
    console.log('Skipping notarization: Missing credentials or development mode');
    return;
  }

  console.log(`Notarizing ${appName}...`);

  return await notarize({
    appBundleId: 'com.rkhs.photo-order-management',
    appPath: `${appOutDir}/${appName}.app`,
    appleId: process.env.APPLE_ID,
    appleIdPassword: process.env.APPLE_ID_PASSWORD,
  });
};
