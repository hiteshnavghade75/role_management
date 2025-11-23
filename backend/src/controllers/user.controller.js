import User from "../models/user.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ email: { $ne: req.user.email }}).sort({ createdAt: -1 });

    return res.json({
      success: true,
      users: users.map((u) => ({
        id: u._id,
        email: u.email,
        name: u.name,
        role: u.role,
        status: u.status,
        createdAt: u.createdAt,
      })),
    });
  } catch (err) {
    console.error("Error in getAllUsers:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};

export const createUser = async (req, res) => {
  try {
    const { email, name, role } = req.body;

    if (!email || !name) {
      return res.status(400).json({
        success: false,
        message: "Email and name are required",
      });
    }

    const allowedRoles = ["admin", "user"];
    const finalRole = allowedRoles.includes(role) ? role : "user";

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    const user = await User.create({
      email: email.toLowerCase(),
      name,
      role: finalRole,
      status: "active",
    });

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status,
      },
    });
  } catch (err) {
    console.error("Error in createUser:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to create user",
    });
  }
};

export const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["active", "inactive"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be 'active' or 'inactive'",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.status = status;

    if (status === "inactive") {
      user.otpCode = undefined;
      user.otpExpiresAt = undefined;
    }

    await user.save();

    return res.json({
      success: true,
      message: `User ${status === "active" ? "activated" : "deactivated"} successfully`,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status,
      },
    });
  } catch (err) {
    console.error("Error in updateUserStatus:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to update user status",
    });
  }
};
