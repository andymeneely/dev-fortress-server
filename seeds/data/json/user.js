const DefaultUserData = [
  {
    user: {
      name: 'Andy',
      username: 'professor',
      is_admin: false,
    },
    email: {
      address: 'professor@address.com',
      verified: true,
    },
    password: {
      password_hash: '$2a$10$cQdFPw67dAF0ICqAJSAey.zHT5whddjk.nva6YwTwXckMW04htDwG',
      valid: true,
    },
    user_role: [
      {
        role_id: 1,
      },
    ],
  },
  {
    user: {
      name: 'Admin',
      username: 'admin',
      is_admin: true,
    },
    email: {
      address: 'admin@admin.com',
      verified: false,
    },
    password: {
      password_hash: '$2a$10$cQdFPw67dAF0ICqAJSAey.zHT5whddjk.nva6YwTwXckMW04htDwG',
      valid: true,
    },
    user_role: [
    ],
  },
];

module.exports = {
  DefaultUserData,
};
