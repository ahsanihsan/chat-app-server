const sanitizeUser = user => ({
  fullName: user.fullName,
  email: user.email,
  accountBalance: user.accountBalance,
  myId: user._id
});

module.exports = sanitizeUser;
