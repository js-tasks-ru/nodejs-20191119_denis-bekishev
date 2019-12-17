const LocalStrategy = require('passport-local').Strategy;
const User = require('../../models/User');

module.exports = new LocalStrategy(
    {
      session: false,
      usernameField: 'email',
    },
    async (email, password, done) => {
      const user = await User.findOne({email});
      if (!user) done(null, false, 'Нет такого пользователя');
      if (!await user.checkPassword(password)) done(null, false, 'Неверный пароль');

      done(null, user);
      // done(null, false, 'Стратегия подключена, но еще не настроена');
    }
);
