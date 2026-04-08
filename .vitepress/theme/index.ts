import DefaultTheme from 'vitepress/theme'
import './style.css'
import Home from './components/Home.vue' // <--- 1. 引入组件

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.component('Home', Home) // <--- 2. 注册组件，名字叫 'Home'
  }
}