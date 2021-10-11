const User = require('../../models/User');

module.exports = async function authenticate(strategy, email, displayName, done) {
  if (email) {
    const user = await User.findOne({email});

    if (!user) {
      User.create({email, displayName})
        .then(newUser => done( null, newUser ))
        .catch(err => done(err));
    }
    else {
      done(null, user);
    }
  }
  else {
    done(null, false, 'Не указан email');
  }
};
