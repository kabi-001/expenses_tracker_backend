import useraccounts from "../model/usermodel.js";

export const CreateNewImage = async (req, res) => {
  try {

    console.log("-----", req.file?.filename);

    await useraccounts.create({
      profile: req.file?.filename
    });

    return res.status(201).json({
      success: true,
      message: "create new image"
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong"
    });

  }
};