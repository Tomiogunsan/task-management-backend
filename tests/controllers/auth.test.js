/* eslint-disable no-undef */
const authController = require('../../controllers/authController');
const User = require('../../models/userModel');
const jwt = require('../../utils/signToken');

jest.mock('../../models/userModel');
jest.mock('../../utils/signToken', () => ({
  signToken: jest.fn().mockReturnValue('mocked-token'),
}));

const req = {
  body: {
    name: 'test',
    email: 'test',
    password: 'test',
    passwordConfirm: 'test',
  },
};
const res = {
  status: jest.fn((x) => x),
  json: jest.fn((x) => x),
};

it('should signup a new user as team-member by default', async () => {
  User.findOne.mockReturnValue(null);
  const mockUser = {
    _id: 1,
    email: req.body.email,
    password: 'hashed-password',
  };
  User.create.mockResolvedValue(mockUser);
  jwt.signToken.mockReturnValue('mocked-token');
  await authController.signup(req, res);
});
