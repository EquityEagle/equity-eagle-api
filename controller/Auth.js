export const RegisterUser = async (req, res) => {
  try {
  } catch (error) {
    console.log({ error: error.message });
    return res.status(500).json({ error: error.message });
  }
};
