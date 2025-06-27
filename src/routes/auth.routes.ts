import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { verifyToken } from "../middlewares/verifyToken";

const router = Router();
/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User registration and authentication endpoints
 */

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account and sends an OTP for verification email
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstname
 *               - lastname
 *               - email
 *               - phonenumber
 *               - role
 *             properties:
 *               firstname:
 *                 type: string
 *                 example: John
 *               lastname:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               phonenumber:
 *                 type: string
 *                 example: "+1234567890"
 *               role:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["user"]  # Can also be ["admin"] or ["user", "admin"]
 *     responses:
 *       200:
 *         description: Registration successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token for authentication
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: INVALID_INPUT
 *                 message:
 *                   type: string
 *                   example: Invalid email format
 *       401:
 *         description: User already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: USER_EXISTS
 *                 message:
 *                   type: string
 *                   example: User already exists
 */

router.post("/register", authController.signup);

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User registration and authentication endpoints
 */

/**
 * @swagger
 * /users/register/verify:
 *   post:
 *     summary: Verify user OTP
 *     description: Verifies the OTP sent to the user's email and completes the registration process
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - otp
 *               - token
 *             properties:
 *               otp:
 *                 type: string
 *                 example: "123456"
 *               token:
 *                 type: string
 *                 description: JWT token received during registration
 *                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     responses:
 *       200:
 *         description: OTP verification successful and user created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User  successfully registered"
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: INVALID_INPUT
 *                 message:
 *                   type: string
 *                   example: "Invalid OTP format"
 *       401:
 *         description: Invalid OTP
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: INVALID_OTP
 *                 message:
 *                   type: string
 *                   example: "Invalid OTP"
 *       409:
 *         description: OTP expired
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: OTP_EXPIRED
 *                 message:
 *                   type: string
 *                   example: "OTP expired, new OTP has been sent to your registered email address"
 */
router.post("/register/verify", authController.verify);

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User registration and authentication endpoints
 */

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: User login
 *     description: Authenticates a user and returns a JWT token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful, returns JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token for authentication
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: USER_NOT_FOUND
 *                 message:
 *                   type: string
 *                   example: "User  does not exist, please create an account"
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: INVALID_CREDENTIALS
 *                 message:
 *                   type: string
 *                   example: "Invalid credentials"
 */
router.post("/login", authController.login);

router.post("/addrolespermission", authController.addrolepermission);

/**
 * @swagger
 * /instructor/details:
 *   post:
 *     tags:
 *       - Instructor
 *     summary: Add instructor details
 *     description: Add or update details for an instructor
 *     parameters:
 *       - in: cookie
 *         name: token
 *         description: JWT token for authentication
 *         required: true
 *         schema:
 *           type: string
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     requestBody:
 *       required: true
 *       description: Instructor details to be added/updated
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               qualification:
 *                 type: string
 *                 description: Instructor's qualifications/certifications
 *                 example: "PhD in Computer Science"
 *               bio:
 *                 type: string
 *                 description: Short biography of the instructor
 *                 example: "Experienced software engineer with 10+ years in web development"
 *               experience:
 *                 type: string
 *                 description: Years of experience or notable experience
 *                 example: "10 years"
 *             required:
 *               - qualification
 *               - bio
 *               - experience
 *     responses:
 *       200:
 *         description: Instructor details successfully added/updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Instructor details updated successfully"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 */  
router.post("/instructor/details",verifyToken(["instructor"]), authController.instructorDetails);

export default router;
