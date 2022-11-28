export default {
  namespaced: true,
  state: {
    categoryList: [
      /* {
      category: {
      name: '', 
      // id: '1',
      subCategory: [
         {
          name: '',
          // id:11
          } 
       ],
     },
    }, */
        
  ]
  },
  getters: {
    getCateName(state) {
      return state.categoryList.map(item => item.category.name)
      
    }
   
  },
  mutations: {
    // 新增大分类
    addToCategory(state, payload ) {
      let data = {category: {
        name: payload.categoryName,
        subCategory: [
          {
            name: payload.subCategoryName,
          },
        ],
      }};
      state.categoryList.push(data) 
      // console.log(state.categoryList);
      // 设置索引
      for(let i in state.categoryList) {
        state.categoryList[i].category.id = i;
        for(let k in state.categoryList[i].category.subCategory) {
          state.categoryList[i].category.subCategory[k].id = i+k;
        }
      }
    },

    // 新增子级分类
    addSubCategory(state, payload) {
      const currentCategory = state.categoryList.find(item => item.category.id == payload.index)
      const newCategory = {name: payload.data.subCategoryName};
      currentCategory.category.subCategory.push(newCategory)
      // 设置索引
      for(let i in state.categoryList) {
        state.categoryList[i].category.id = i;
        for(let k in state.categoryList[i].category.subCategory) {
          state.categoryList[i].category.subCategory[k].id = i+k;
        }
      }
    },
    // 更新分类
    updateCategory(state, payload) {
      const editCategory = state.categoryList.find(item => item.category.id == payload.index);
      editCategory.category.name = payload.data.categoryName;
    
    },
    // 更新子级分类
    updateSubCategory(state, payload) {
      const editCategory = state.categoryList.find(item => item.category.id == payload.index);
      const editedSubCategory = editCategory.category.subCategory.find(
        (i) => i.id == payload.subIndex
      );
      editedSubCategory.name = payload.data.subCategoryName
    
    },
    removeCategory(state, index) {
      const removeIndex = state.categoryList.findIndex(item => item.category.id == index)
      if(removeIndex != -1) {
        state.categoryList.splice(removeIndex, 1)
      }
      console.log(removeIndex);
    },
    removeSubCategory(state, payload) {
      const {index, subIndex} = payload;
      const category = state.categoryList.find(item =>  item.category.id == index) 
      const subCategoryIndex = category.category.subCategory.findIndex(i => i.id == subIndex)
      category.category.subCategory.splice(subCategoryIndex, 1)
      

    }
  },
  actions: {
    // 添加大分类
    addToCategory(ctx, payload) {
      ctx.commit('addToCategory', payload)
      
    },
    // 添加子级分类
    addSubCategory(ctx, payload) {
      console.log(payload); 
      ctx.commit('addSubCategory', payload)
      
    },
    // 更新大分类
    updateCategory(ctx, payload) {
      // console.log(payload);
      ctx.commit('updateCategory', payload)
    },

    // 更新子级分类
    updateSubCategory(ctx, payload) {
      // console.log(payload);
      ctx.commit('updateSubCategory', payload)
    },
    removeCategory(ctx, payload) {
      ctx.commit('removeCategory', payload)
    },
    removeSubCategory(ctx, payload) {
      ctx.commit('removeSubCategory', payload)
      
    }
  }
}