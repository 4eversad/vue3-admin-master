import { ElMessage, ElMessageBox } from "element-plus";
export const confirm = (params) => {
  ElMessageBox.confirm(
    params.content,
    params.tip || "提示",
    {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      type: 'warning',
      center: true,
    }).then(() => {
      // params.fn(params.index) ? params.index : params.fn() 
      if(params.fn) {
        const fn = params.fn;
        if(params.payload) {
          console.log(params.payload);
          
          const payload = params.payload;
          console.log(payload);
          
          fn(payload)
        }
      }
          
      
     
    })
    .catch(() => {

    })
    
  
}
