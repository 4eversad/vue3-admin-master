export default {
  namespaced: true,
  state: () => {
    return {
      category_info: [
      /*  { 
        category_name: '',
        title:'',
        content: '',
        date: '',
        administrator:'',
        index:''
      }
        */
      ],
      batchDeleteIndex: []
    }
  },

  getters: {
    administratorName(state, getters, rootState) {
      return rootState.app.username
    }
  },
  mutations: {
    addInfo1(state, payload) {
      state.category_info.push(payload)
      for(let item in state.category_info) {
         // 设置索引
         state.category_info[item].index = item
      }
    },
    deleteInfo1(state, index) {
      // const deletedItem = state.category_info.find(item =>item.index == index);
      const deletedIndex = state.category_info.findIndex(item => item.index == index)
      state.category_info.splice(deletedIndex, 1)
    },
    editInfo(state, payload) {
      // console.log(payload.index);
      const editedInfo = state.category_info.find(item => item.index === payload.index)
      // console.log(editedInfo);
      for(let key in payload) {
        editedInfo[key] = payload[key]
        
      }
      console.log(editedInfo.title);
      
    }

  },
  actions: {
    // 新增分类信息
    addInfo(ctx, payload) {
       ctx.commit('addInfo1', payload)
       
    },
    // 删除分类信息
    deleteInfo(ctx, index) {
      ctx.commit('deleteInfo1', index)
    },
    editInfo({commit}, payload) {
      commit('editInfo', payload)
    }
  }

}