import user from "../model/usermodel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { transporter } from "../lib/nodemail.js";

export const AddUser = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const reqBody = req.body || {};

    if (!reqBody.email) {
      return res.status(400).json({
        success: false,
        message: "email missing",
      });
    }

    const existingUser = await user.findOne({
      email: reqBody.email,
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "already exists",
      });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(reqBody.password, 10);

    const newUser = await user.create({
      name: reqBody.name,
      email: reqBody.email,
      password: hashedPassword,
      contact: reqBody.contact,
      profile: req.file?.filename,
    });

    return res.status(201).json({
      success: true,
      message: "user created",
      data: newUser
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }
};

export const UpdateUser = async (req, res) => {
  try {
    const reqBody = req.body;

    // Hash the password before updating
    const hashedPassword = await bcrypt.hash(reqBody.password, 10);

    await user.updateOne(
      { email: reqBody.email },
      {
        $set: {
          name: reqBody.name,
          password: hashedPassword,
          contact: reqBody.contact,
          profile: req.file?.filename,
        },
      }
    );

    return res.status(200).json({
      message: "Updated successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "something went wrong",
      success: false,
    });
  }
};

export const DeleteUser = async (req, res) => {
  try {
    const reqBody = req.body;
    await user.deleteOne({
      email: reqBody.email
    });
    return res.status(200).json({
      message: "User Deleted successfully", success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "something went wrong", success: false,
    });
  }
};
export const GetUsers = async(req,res)=>{
   try{
      const users = await user.find();

      return res.status(200).json({
         success:true,
         data:users
      });
   }catch(error){
      return res.status(500).json({
         success:false,
         message:"something went wrong"
      });
   }
}
 
export const userLogin = async (req,res)=>{
  try {
    const reqBody = req.body;
    const userData = await user.findOne({
      email: reqBody.email,
    })
    console.log("userData====>>",userData);
    if(userData){
      const isMatch = await bcrypt.compare(reqBody?.password,userData.password)

      if(isMatch){
       const otp = 12345;
      userData.otp=otp;
       userData.otpExpire= new Date(Date.now() + 4.5 * 60 * 1000); 
       await userData.save();
       console.log("otp", otp);
        // try {
        // //   await transporter.sendMail({
        // //     from: process.env.SMTP_EMAIL || 'no-reply@example.com',
        // //     to: userData.email,
        // //     subject: "OTP for login",
        // //     text: "Your OTP has been sent to your email",
        // //     html: `<div style="
        // //   max-width:600px;
        // //   margin:auto;
        // //   font-family:'Segoe UI',sans-serif;
        // //   background:#ffffff;
        // //   border-radius:20px;
        // //   overflow:hidden;
        // //   box-shadow:0 10px 30px rgba(0,0,0,0.1);
        // // ">

        // //   <div style="
        // //     background:linear-gradient(135deg,#4f46e5,#7c3aed);
        // //     padding:30px;
        // //     text-align:center;
        // //     color:white;
        // //   ">
        // //     <h1>Expense Tracker</h1>
        // //     <p>Secure Login Verification</p>
        // //   </div>

        // //   <div style="padding:40px;">
        // //     <h2>Hello 👋</h2>

        // //     <p>
        // //       We received a login request for your account.
        // //       Use the OTP below to continue.
        // //     </p>

        // //     <div style="text-align:center;margin:30px 0;">
        // //       <span style="
        // //         background:#eef2ff;
        // //         color:#4f46e5;
        // //         padding:18px 35px;
        // //         border-radius:15px;
        // //         font-size:34px;
        // //         font-weight:bold;
        // //         letter-spacing:8px;
        // //       ">
        // //         ${otp}
        // //       </span>
        // //     </div>

        // //     <p style="color:red;font-weight:bold;">
        // //       OTP expires in 5 minutes
        // //     </p>

        // //     <p>
        // //       If you didn't request this login,
        // //       please ignore this email.
        // //     </p>
        // //   </div>

        // //   <div style="
        // //     background:#f9fafb;
        // //     text-align:center;
        // //     padding:20px;
        // //     color:#888;
        // //   ">
        // //     © 2026 Expense Tracker
        // //   </div>

        // // </div>`,
        //   // })
        //   // console.log("Email sent successfully to:", userData.email);
        //   await userData.save();
        //   console.log("otp",otp);
        // } catch (mailErr) {
        //   console.error("Failed to send OTP email:", mailErr);
        //   return res.status(500).json({ message: "Failed to send OTP email", success: false, error: String(mailErr) });
        // }
          return res.status(200).json({  message: "OTP sent successfully",
  success: true,
  email: userData.email,
  otp: otp
})
      }else{
        return res.status(400).json({message:"incorrect password", success:false})
      }

    }else{
       return res.status(400).json({message:"user not found", success:false})

    }
  } catch (error) {
    console.log("show error======>>>.",error);
    return res.status(500).json({ message: 'Something went wrong', success: false });
  }
    
}


export const verifyOtp = async (req,res)=>{
  try {
    const reqBody = req.body;
    console.log("reqBody====>>", reqBody);
    const FindUser = await user.findOne({email: reqBody.email});
    
    if(FindUser){
      // Convert both OTP to numbers for comparison
      const storedOtp = Number(FindUser.otp);
      const receivedOtp = Number(reqBody.otp);
      
      if(storedOtp === receivedOtp && FindUser.otpExpire > new Date()){
        FindUser.otp = null;
        FindUser.otpExpire = null;
        await FindUser.save();
        
        const token = jwt.sign(
          { email: reqBody.email, _id: FindUser._id },
          process.env.secretkey,
          { expiresIn: "1d" }
        );
        console.log("OTP verified successfully");
        
        return res.status(200).json({
          message: "Login successfully", 
          success: true, 
          token
        });
      } else {
        console.log("OTP mismatch or expired - Stored:", storedOtp, "Received:", receivedOtp, "Expiry:", FindUser.otpExpire, "Now:", new Date());
        return res.status(400).json({
          message: "Invalid or expired OTP", 
          success: false
        });
      }   
    } else {
      return res.status(400).json({
        message: "User not found",
        success: false
      });
    }
  } catch (error) {
    console.log("Error in verifyOtp:", error);
    return res.status(500).json({ 
      message: 'Something went wrong', 
      success: false 
    });
  }
};
  



export const FindUser = async(req,res)=>{
  try {
    const reqBody = req.user;
    console.log("req.user====", req.user);
    console.log("req.body", reqBody);
    const User = await user.findOne({
      email: reqBody.email
    });

    return res.status(200).json({ message: "successfully find", success: true, User });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Something went wrong', success: false });
  }

}

