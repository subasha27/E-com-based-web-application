import { Request, Response } from 'express';
import UserLogins from '../model/userModel';
import { Profile } from 'passport';
import jwt from "jsonwebtoken";

export const handleSuccessCallback = async (req: Request, res: Response) => {
  try {
    const user = req.user as Profile;

    if (!user || !user.emails || user.emails.length === 0) {
      return res.redirect('/sign/auth/google/callback/failure');
    }

    const { displayName, emails } = user;
    const name = displayName || '';
    const email = emails[0].value || '';
    let userToken = "";
    if (email.length > 0) {
      console.log(email)
      const token = jwt.sign(email, process.env.SecretKeyForUser as string);
      userToken = token
    }
    const existingUser = await UserLogins.findOne({ where: { email } });
    let id = 0;
    if (existingUser) {
      // User with the same email exists, update their information
      existingUser.name = name;
      id = existingUser.id
      await existingUser.save();
    } else {
      // User with the same email doesn't exist, create a new user
      const newUser = await UserLogins.create({ name, email });
      id = newUser.id;

    }
    res.setHeader('Content-Type', 'text/html');
    return res.send('Welcome ' + name + '<br>'+ '<br>' + `User Token : ${userToken}` + '<br>' + `ID :${id}`);

  } catch (error) {
    console.error('Error saving user data:', error);
    return res.redirect('/sign/auth/google/callback/failure');
  }
};
