import store from "../store" 
export function getToken() {
  if (store.state.app.token ) {
    return true
  }
  else {
    return false
  }
}
export function removeToken() {
  if(store.state.app.token) {
    store.commit('app/REMOVE_TOKEN')

  }
}
export function removeUsername() {
  if(store.state.app.username) {
    store.commit('app/REMOVE_USERNAME')
  }
}