// export const PublishSetup = async (req, res) => {
//     try {
//       const { userId } = req.params;
//       const { text, image, video } = req.body;
//       const user = await UserModel.findById(userId);

//       if (!text || (!image && !video)) {
//         return res.status(400).json("Text and either an image or video are required");
//       }

//       let media;
//       if (image) {
//         media = await cloudinary.uploader.upload(image, { upload_preset: "EQUITY_EAGLE" });
//       } else {
//         media = await cloudinary.uploader.upload(video, { upload_preset: "EQUITY_EAGLE" });
//       }

//       const newSetup = new SetupModel({
//         userId: userId,
//         username: user.username,
//         profile: user.username,
//         text: text,
//       });

//       if (image) {
//         newSetup.image = media;
//       } else {
//         newSetup.video = media;
//       }

//       const publishedSetup = await newSetup.save();
//       res.status(201).json(publishedSetup);
//     } catch (error) {
//       console.log({ error: error.message });
//       return res.status(500).json({ error: error.message });
//     }
//   };
