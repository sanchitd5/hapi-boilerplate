import DemoBaseRoute from "./demoRoute/demoBaseRoute";
import UserBaseRoute from "./userRoute/userBaseRoute";
import AdminBaseRoute from "./adminRoute/adminBaseRoute";
import UploadBaseRoute from "./uploadRoute/uploadBaseRoute";

const Routes = [].concat(DemoBaseRoute, UserBaseRoute, AdminBaseRoute, UploadBaseRoute);

export default Routes;
