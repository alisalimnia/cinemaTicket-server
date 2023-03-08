const router = require('express').Router();
const login = require('../controllers/admin/login');
const getProfile = require('../controllers/admin/getProfile');
const createAdmin = require('../controllers/admin/createAdmin');
const updateProfileInfo = require('../controllers/admin/updateProfileInfo');
const resetPass = require('../controllers/admin/resetPass');
const uploadProfilePic = require('../controllers/admin/uploadProfilePic');
const removeProfilePic = require('../controllers/admin/removeProfilePic');
const removeUserProfilePic = require('../controllers/admin/removeUserProfilePic');
const setUserDefaultFullName = require('../controllers/admin/setUserDefaultFullName');

router.post('/login', login);

router.get('/profile', getProfile);

router.post('/create', createAdmin)

router.put('/update', updateProfileInfo)

router.put('/resetPass', resetPass);

router.put('/profilePic/upload', uploadProfilePic);

router.delete('/profilePic/remove', removeProfilePic);

router.delete('/userProfile/:userId/removeProfilePic', removeUserProfilePic);

router.put('/userProfile/:userId/setDefaultFullName', setUserDefaultFullName);

module.exports = router;
