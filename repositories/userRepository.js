const User = require('../models/user');
const Approval = require('../models/approval');

class UserRepository {
    async getApproval() {
        return await Approval.find();
    }

    async getUsers() {
        return await User.find();
    }

    async deleteUser(id) {
        return await User.deleteOne({id});
    }
    
    async findById(userId) {
        return await User.findById(userId);
    }

    async findByUsername(username) {
        return await User.findOne({ username });
    }

    async createUser(userData) {
        const user = new User(userData);
        return await user.save();
    }

    async updateUser(id, data) {
      try {
        const { 
          name,
          githubLink,
          username,
        } = data
        
        return await User.updateOne({ _id: id }, {
          name: name,
          githubLink: githubLink,
          username: username,
        }, { new: true })
      } catch (e) {
        console.log(e)
      }
    }
    
    async sendToApproval(userData) {
        const user = new Approval(userData);
        return await user.save();
    }
    
    async findAndDeleteApproval(timeStamp) {
        return await Approval.findOneAndDelete({timeStamp: timeStamp});
    }
    
    async findApproval(timeStamp) {
        return await Approval.findOne({timeStamp: timeStamp});
    }
    

}

module.exports = new UserRepository();
