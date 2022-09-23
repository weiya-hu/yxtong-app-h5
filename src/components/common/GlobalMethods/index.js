import Confirm from './Confirm'
import ImgDialog from './ImgDialog'
import Message from './Message'
import Page404 from './Page404'

const install = (Vue) => {
  Vue.use(Confirm);
  Vue.use(ImgDialog);
  Vue.use(Message);
  Vue.use(Page404);
}
export default install