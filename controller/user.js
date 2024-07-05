const  User = require('../model/user');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const apiResponse=require('../helper/apiResponse')
const { setUser } = require('../service/auth');
require("dotenv").config();
const DEFAULT_PAGE_SIZE = process.env.DEFAULT_PAGE_SIZE;
  async function handleGetAllUsers(req, res) {
    try {
      // Extract page and pageSize from request query parameters, with default values
      const page = parseInt(req.body.page) || 1;
      const pageSize = parseInt(req.body.pageSize) || DEFAULT_PAGE_SIZE;
  
      // Calculate the number of documents to skip
      const skip = (page - 1) * pageSize;
  
      // Query the database with pagination and filters
      const allDbUsers = await User.find({ is_active: 1, is_deleted: 0 })
                                   .select('-password -__v')
                                   .skip(skip)
                                   .limit(pageSize);
  
      // Get total number of documents that match the filters
      const totalUsers = await User.countDocuments({ is_active: 1, is_deleted: 0 });
  
      // Calculate total number of pages
      const totalPages = Math.ceil(totalUsers / pageSize);
  
      // Construct the response data
      const responseData = {
        data: allDbUsers,
        page:page,
        pageSize:pageSize,
        totalItems:totalUsers,
        totalPages:totalPages
      };
      if (page > totalPages) {
        return apiResponse.ErrorBadRequestResponseWithData(res, "Requested page exceeds total number of pages",responseData);
      }
  
      return apiResponse.successResponseWithData(res, "User list retrieved successfully", responseData);
    } catch (error) {
      console.log(error);
      return apiResponse.ErrorResponse(res, "Error occurred during API call");
    }
}

async function handleLoginUser(req, res) {
  const { email, password } = req.body;
  try {
    // Check if the user exists in the database
    const user = await User.findOne({ email });
    if (!user) {
      return apiResponse.ErrorResponse(res, 'User not found');
    }
    // Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return apiResponse.ErrorResponse(res, 'Invalid credentials');
    }
    // Generate a JWT token using the authService
    const token = await setUser(user);
    if (!token) {
      return apiResponse.ErrorResponse(res, 'Error generating token');
    }
    // Return success response with the token
    return apiResponse.successResponseWithData(res, 'Login successful', { token });
  } catch (error) {
    console.error(error);
    return apiResponse.ErrorResponse(res, 'Error occurred during API call');
  }
}


async function handleCreateUser(req, res) {
  try {
    // Extract user details from the request body
    const { firstName, lastName, mobile, email, password, roleId, role } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return apiResponse.ErrorResponse(res, "User already exists with provided email id");
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
  
    // Create new user
    const newUser = new User({
      firstName:firstName,
      lastName:lastName,
      mobile:mobile,
      email:email,
      password: hashedPassword,
      roleId:roleId,
      role:role
    });
    // Save user to the database
    const savedUser = await newUser.save();
    return apiResponse.successResponse(res,'User created successfully');
    
  } catch (error) {
    console.error(error);
    return apiResponse.ErrorResponse(res, 'Error occurred during API call');
  }
}


module.exports = {
  handleGetAllUsers,
  handleCreateUser,
  handleLoginUser
};
