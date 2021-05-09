export const mongoDBConfig = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
  autoIndex: true,
};

// export const mailTransportConfig = 'smtps://user@example.com:topsecret@smtp.example.com';
export const mailTransportConfig = {
  host: process.env.MAIL_HOST,
  secure: false,
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
};
