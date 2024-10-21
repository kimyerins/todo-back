const User = require("../model/User");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const userController = {};

userController.createUser = async (req, res) => {
  try {
    const { email, name, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      throw new Error("이미 가입이 된 유저 입니다.");
    }
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);
    const newUser = new User({ email, name, password: hash });
    await newUser.save();
    res.status(200).json({ status: "sucess" });
    console.log("hash", hash);
  } catch (error) {
    res.status(400).json({ status: "fail", error });
  }
};

userController.loginWithEmail = async (req, res) => {
  try {
    // 2.이메일 패스워드 정보 읽어오기
    // 3.이메일을 가지고 유저정보 가져오기
    // 4.이 유저의 디비에 있는 패스워드와 프론트엔드가 보낸 패스워드가 같은지 비교
    // 5.맞으면 토큰발행, 틀리면 에러베세지 보냄
    // 6.응답으로 유저정보 + 토큰을보냄
    const { email, password } = req.body;
    const user = await User.findOne({ email }, "-createdAt -updatedAt -v");
    if (user) {
      const isMath = bcrypt.compareSync(password, user.password);
      if (isMath) {
        const token = user.generateToken();
        return res.status(200).json({ status: "sucess", user, token });
      }
      throw new Error("아이디 또는 비밀번호가 일치하지 않습니다.");
    }
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};

userController.getUser = async (req, res) => {
  try {
    const { userId } = req;
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("can not find user");
    }
    res.status(200).json({ status: "sucess", user });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};

module.exports = userController;

//미들웨어
