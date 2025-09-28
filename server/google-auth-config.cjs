const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');

// Obtener el modelo User existente o crear uno si no existe
let User;
try {
  User = mongoose.model('User');
} catch (error) {
  // Si el modelo no existe, crearlo
  const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    googleId: String,
    role: { type: String, default: 'user' },
    avatar: String,
    isActive: { type: Boolean, default: true },
    lastLogin: Date,
    points: { type: Number, default: 0 },
    logisticsLevel: String,
    reputation: { type: Number, default: 0 }
  }, { timestamps: true });
  
  User = mongoose.model('User', UserSchema);
}

// Configuración de Google OAuth
const configureGoogleAuth = () => {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:3002/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      console.log('🔍 Google OAuth - Perfil recibido:', profile.id);
      
      // Buscar usuario existente por Google ID o email
      let user = await User.findOne({ 
        $or: [
          { googleId: profile.id },
          { email: profile.emails[0].value }
        ]
      });

      if (user) {
        // Usuario existe, actualizar Google ID si no lo tiene
        if (!user.googleId) {
          user.googleId = profile.id;
          user.avatar = profile.photos[0]?.value || user.avatar;
          await user.save();
        }
        console.log('✅ Usuario existente encontrado:', user.email);
        return done(null, user);
      } else {
        // Crear nuevo usuario
        user = new User({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          avatar: profile.photos[0]?.value || '',
          role: 'user',
          isActive: true,
          points: 100, // Puntos de bienvenida
          lastLogin: new Date()
        });

        await user.save();
        console.log('✅ Nuevo usuario creado:', user.email);
        return done(null, user);
      }
    } catch (error) {
      console.error('❌ Error en Google OAuth:', error);
      return done(error, null);
    }
  }));

  // Serialización del usuario para la sesión
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
};

module.exports = configureGoogleAuth;
