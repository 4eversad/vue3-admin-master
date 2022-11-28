import { ElMessage } from "element-plus";

export default {
  namespaced: true,
  state: {
      userInfo: [
        /* {
          username: '1',
          realName: '2',
          tel:'3',
          address: '4',
          role: '系统管理员',
          isValid: true,
          index: 0
        },
        */
      ],
      
      
  },
  mutations: {  
    // 添加用户
    addUser(state, payload) {
      state.userInfo.push(payload)
      console.log('添加成功');
      ElMessage({
        type: 'success',
        message: '添加成功'
      })

      // 设置索引
      for(let i in state.userInfo) {
        state.userInfo[i].index = i
      }
    },
    // 删除用户
    deleteUser(state, payload){
      console.log(payload);
      state.userInfo.forEach(item => {
        console.log(item.index);
        
      })
      const deleteIndex = state.userInfo.findIndex(item => item.index === payload.index)
      console.log(deleteIndex);
      console.log(state.userInfo[deleteIndex]);
      
      
      if(deleteIndex > -1) {
        // 找到了
        state.userInfo.splice(deleteIndex, 1)
        console.log(state.userInfo);
        
        console.log(state.userInfo);
      }
      // 重置索引
      for(let i in state.userInfo) {
        state.userInfo[i].index = i
      }
    },

    // 更新用户信息
    updateUser(state, payload) {
      const updateInfo = state.userInfo.find(item => item.index == payload.index)
      for(let key in updateInfo) {
        updateInfo[key] = payload[key];
      }
    }
  }, 
  actions: {
    // 添加用户
    addUser(ctx, payload) {
        console.log( ctx.state.userInfo.findIndex((item) => item.username == payload.username));
       
        if(ctx.state.userInfo.findIndex((item) => item.username == payload.username) != -1) {
          ElMessage({
            type: 'warning',
            message: '该用户已存在,请勿重复添加!'
          })
          return 
        }
        
        ctx.commit('addUser', payload)


    },
    // 删除用户
    deleteUser(ctx, payload){
      ctx.commit('deleteUser', payload)
    },
    // 更新用户信息

    updateUser({commit}, payload) {
      commit('updateUser', payload)
    }
  }
}