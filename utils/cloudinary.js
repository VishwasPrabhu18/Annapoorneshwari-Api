import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// export const uploadToCloudinary = async (file) => {
//   try {
//     const result = await cloudinary.uploader.upload(file.path);
//     return result;
//   } catch (error) {
//     throw new Error(`Upload failed: ${error.message}`);
//   }
// };

export const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: 'image' },
      (error, result) => {
        if (error) return reject(new Error(`Upload failed: ${error.message}`));
        resolve(result);
      }
    );

    const readable = new Readable();
    readable._read = () => {}; // _read is required but you can noop it
    readable.push(fileBuffer);
    readable.push(null); // End of stream
    readable.pipe(uploadStream);
  });
};
