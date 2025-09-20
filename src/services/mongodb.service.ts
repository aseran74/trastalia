import { connectDatabase, disconnectDatabase } from '../config/database';
import User, { IUser } from '../models/User';
import Metric, { IMetric } from '../models/Metric';

class MongoDBService {
  private isConnected = false;

  async connect(): Promise<void> {
    if (!this.isConnected) {
      await connectDatabase();
      this.isConnected = true;
    }
  }

  async disconnect(): Promise<void> {
    if (this.isConnected) {
      await disconnectDatabase();
      this.isConnected = false;
    }
  }

  // Métodos para usuarios
  async createUser(userData: Partial<IUser>): Promise<IUser> {
    await this.connect();
    const user = new User(userData);
    return await user.save();
  }

  async getUsers(): Promise<IUser[]> {
    await this.connect();
    return await User.find({ isActive: true }).sort({ createdAt: -1 });
  }

  async getUserById(id: string): Promise<IUser | null> {
    await this.connect();
    return await User.findById(id);
  }

  async updateUser(id: string, updateData: Partial<IUser>): Promise<IUser | null> {
    await this.connect();
    return await User.findByIdAndUpdate(id, updateData, { new: true });
  }

  async deleteUser(id: string): Promise<boolean> {
    await this.connect();
    const result = await User.findByIdAndDelete(id);
    return !!result;
  }

  // Métodos para métricas
  async createMetric(metricData: Partial<IMetric>): Promise<IMetric> {
    await this.connect();
    const metric = new Metric(metricData);
    return await metric.save();
  }

  async getMetrics(category?: string, period?: string): Promise<IMetric[]> {
    await this.connect();
    const filter: any = {};
    if (category) filter.category = category;
    if (period) filter.period = period;
    
    return await Metric.find(filter).sort({ date: -1 });
  }

  async getLatestMetrics(limit: number = 10): Promise<IMetric[]> {
    await this.connect();
    return await Metric.find().sort({ date: -1 }).limit(limit);
  }

  async getMetricsByDateRange(startDate: Date, endDate: Date): Promise<IMetric[]> {
    await this.connect();
    return await Metric.find({
      date: {
        $gte: startDate,
        $lte: endDate
      }
    }).sort({ date: -1 });
  }

  // Métodos de estadísticas
  async getUserStats() {
    await this.connect();
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const adminUsers = await User.countDocuments({ role: 'admin' });
    
    return {
      total: totalUsers,
      active: activeUsers,
      admins: adminUsers,
      inactive: totalUsers - activeUsers
    };
  }

  async getMetricStats() {
    await this.connect();
    const totalMetrics = await Metric.countDocuments();
    const categories = await Metric.distinct('category');
    const periods = await Metric.distinct('period');
    
    return {
      total: totalMetrics,
      categories: categories.length,
      periods: periods.length
    };
  }
}

export default new MongoDBService();
