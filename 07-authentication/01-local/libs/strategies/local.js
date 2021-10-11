const LocalStrategy = require('passport-local').Strategy;

const User = require('../../models/User');

module.exports = new LocalStrategy(
    {usernameField: 'email', session: false},
    async function(email, password, done) {
      // done(null, false, 'Стратегия подключена, но еще не настроена');

      const user = await User.findOne({email});

      if (user) {
        if ( await user.checkPassword(password) ) {
          done(null, user);
        }
        else {
          done(null, false, 'Неверный пароль');
        }
      }
      else {
        done(null, false, 'Нет такого пользователя');
      }
    },
);
