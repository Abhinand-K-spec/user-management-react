import User from "../models/users.js";


export const viewUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find({ role: 'user' })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await User.countDocuments({ role: 'user' });

    res.send({
      users,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).send({ error: 'Server error' });
  }
};



export const createUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ error: 'Email already exists' });
    }

    const user = new User({ name, email, password });
    await user.save();
    res.status(201).send({ message: 'User created', user });
  } catch (error) {
    res.status(500).send({ error: 'Server error' });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }
    res.send({ user });
  } catch (error) {
    res.status(500).send({ error: 'Server error' });
  }
};

export const editUser = async (req, res) => {
  const { name, email } = req.body;
  const { id } = req.params;
  try {
    const existingUser = await User.findOne({ email, _id: { $ne: id } });
    if (existingUser) {
      return res.status(400).send({ error: 'Email already exists' });
    }

    const user = await User.findByIdAndUpdate(id, { name, email }, { new: true });
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }
    res.send({ message: 'User updated', user });
  } catch (error) {
    res.status(500).send({ error: 'Server error' });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.send({ message: "User deleted" });
  } catch (error) {
    res.status(500).send({ error: 'Server error' });
  }
};
