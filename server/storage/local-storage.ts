import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user' | 'moderator';
  avatar?: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

class LocalStorage {
  private dataDir: string;
  private usersFile: string;

  constructor() {
    this.dataDir = path.join(process.cwd(), 'data');
    this.usersFile = path.join(this.dataDir, 'users.json');
    this.ensureDataDir();
  }

  private ensureDataDir() {
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }
  }

  private readUsers(): User[] {
    try {
      if (fs.existsSync(this.usersFile)) {
        const data = fs.readFileSync(this.usersFile, 'utf8');
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('Error reading users file:', error);
    }
    return [];
  }

  private writeUsers(users: User[]): void {
    try {
      fs.writeFileSync(this.usersFile, JSON.stringify(users, null, 2));
    } catch (error) {
      console.error('Error writing users file:', error);
    }
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const users = this.readUsers();
    return users.find(user => user.email === email) || null;
  }

  async findUserById(id: string): Promise<User | null> {
    const users = this.readUsers();
    return users.find(user => user._id === id) || null;
  }

  async createUser(userData: Omit<User, '_id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const users = this.readUsers();
    const newUser: User = {
      ...userData,
      _id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    users.push(newUser);
    this.writeUsers(users);
    return newUser;
  }

  async updateUser(id: string, updateData: Partial<User>): Promise<User | null> {
    const users = this.readUsers();
    const userIndex = users.findIndex(user => user._id === id);
    
    if (userIndex === -1) return null;
    
    users[userIndex] = {
      ...users[userIndex],
      ...updateData,
      updatedAt: new Date()
    };
    
    this.writeUsers(users);
    return users[userIndex];
  }

  async deleteUser(id: string): Promise<boolean> {
    const users = this.readUsers();
    const filteredUsers = users.filter(user => user._id !== id);
    
    if (filteredUsers.length === users.length) return false;
    
    this.writeUsers(filteredUsers);
    return true;
  }

  async authenticateUser(email: string, password: string): Promise<User | null> {
    const users = this.readUsers();
    const user = users.find(u => u.email === email);
    
    if (!user) return null;
    
    // Verificar contraseña con bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return null;
    
    // Actualizar último login
    user.lastLogin = new Date();
    this.writeUsers(users);
    
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return this.readUsers();
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const users = this.readUsers();
    return users.find(user => user.email === email) || null;
  }

  async seedUsers(): Promise<void> {
    const users = this.readUsers();
    
    if (users.length === 0) {
      // Crear usuarios con contraseñas hasheadas correctamente
      const adminPassword = await bcrypt.hash('admin123', 12);
      const userPassword = await bcrypt.hash('user123', 12);
      const moderatorPassword = await bcrypt.hash('moderator123', 12);
      
      const seedUsers = [
        {
          name: 'Administrador',
          email: 'admin@tailadmin.com',
          password: adminPassword,
          role: 'admin' as const,
          avatar: '',
          isActive: true
        },
        {
          name: 'Usuario Demo',
          email: 'user@tailadmin.com',
          password: userPassword,
          role: 'user' as const,
          avatar: '',
          isActive: true
        },
        {
          name: 'Moderador',
          email: 'moderator@tailadmin.com',
          password: moderatorPassword,
          role: 'moderator' as const,
          avatar: '',
          isActive: true
        }
      ];

      for (const userData of seedUsers) {
        await this.createUser(userData);
      }
      
      console.log('✅ Usuarios de prueba creados en almacenamiento local');
    }
  }
}

export const localStorage = new LocalStorage();
export type { User };
