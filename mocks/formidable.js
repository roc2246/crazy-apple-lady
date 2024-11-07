export const mockForm = vi.fn(() => {
    return {
      parse: (req, cb) => {
        const err = null; // or an error object, if you want to simulate an error
        const fields = { name:[] }; // Mock data for fields
        const files = { images: [] };

        for (let x = 0; x < fs.readdirSync(mockImagesPath).length; x++) {
          const obj = {
            filepath: path.join(
              mockImagesPath,
              fs.readdirSync(mockImagesPath)[x]
            ),
            originalFilename: fs.readdirSync(mockImagesPath)[x],
          };
          files.images.push(obj);
          fields.name.push(obj.originalFilename)
        }

        cb(err, fields, files);
      },
    };
  });