import GenericService from './genericService';

import ForgetPasswordService from './forgetPasswordService';

export default {
  UserService: new GenericService('User'),
  ForgetPasswordService,
  AdminService: new GenericService('Admin')
};
