const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    name: { type: "String", required: true },
    email: { type: "String", unique: true, required: true },
    password: { type: "String", required: true },
    pic: {
      type: "String",
      default:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAMFBMVEXg4OC9vb3f39/Kysrc3Ny+vr7Q0NDHx8fNzc3ExMTU1NTV1dXY2NjBwcG6urrLy8vXjdnDAAAEKElEQVR4nO3d63KrIBQF4IAIBgXf/22P5GpbEwGVzfasb6bTv6zhoiCQywUAAAAAAAAAAAAAAAAAAAAAAABgiVTW6k5bqyR1UQ6gbOP8RAgR/rnGKuoi7ao3bcg251vTUxdrN/31d7xHyOs5Miq3nO+W0Z2grXaf890ydtQF3Eh+aKDzpsp6YFXtSr6gZdxSh4h8wUBd0FwqMqAQTGtRxjTRR0Pl2Rev0QGFuFIXNsfKY+Injg+N2FHmid9ok9JGA3bt1Ka00cBb6iIncokBhXDURU7Tp1bhVIm8JhqpvTBg1RPj32bmOL3Z6PRGymysMVl1aKiLHU+mj6SB4/N2qnIa6dRM+XTEITMhnze3rIFmSqipCx6tywooBJ8JxvkTNpkJG+qCRzt/HZ4/oc5MyGcszZg7BYzmT+d/p0lYKZ3jtGqaMwHmNQXOmx/yGWj+hzn++ddp0pdLmS1iTDLqkLrIiZLHGlbjTJC8VMNokeYhsScyemN7SVtRZLSS+JLUTvm10SDlsc/qYf8WPYni2AnvbGRCZs/6uT4qINsaDIb1mWLLZ6V7kTQrexMNy1H0B/tne/AsX8u4C77J7kNG33b8K/BO6oV9wt7ps+S7Ud30ivOMOf13HdOH/DdqsF1jjGk6O5wwHgAAAAAAAMBFymn2a3U3Nk1jpr8xXDswKHmGVYwwrzeu9Y/LBmarNEHrDOf5vhy0ccKvnnT2whk9sKvOYUz+BjzyWftW+iqydgyJq2bQYnPjcQlpt8R7hax2pV91m+M9Q1a5XDysfGRKDGlqG3f2zVdfRpW3n3TNtZa2Kse96+/Jj1W8CHz7Aro5YgVfUNe+Ym/OSP0VPGInwla0OxmS7r7IRXlnxsEt9BWRalufPOYZsYTmLqnMYyN5WoqA5WowINieWTYgwVmFpswg8+YLHzDNOE+xOWLR1xtZPF9QsivmHmXepmA7zTu4tV252RRNFRasxKLP+rlih0wzDzJvV2xPf+5x++1KzTLybhDaQ6lJRt4NQnsodafb+evw/GNp5FGY/RU8XFN8ZhGUnV1QDDZlr46keDMtvMZfvisWP+GWeWNZLorD7Id9j1kMOJYPWGw9+BaQaE244IowTcByEQlvPSkTkfRal9Wfr9jOE99bc/hwQ/bh6eXgT4g1XLife8FenCpurTnwS3ctZ/XVQeONr2ZDzVGrbxV0wbdh/wmjq6SFPsmdp/2+qWI71A/Dl18fS85XWwU+6L0G1baKZ8QStc9HqaaeIfQvtbk7+qrzBRvrsfp8gfp0W8tq9fG5DkRak7yp3Qtj63tAfKG0Wz0QNIvnXeXnLBYpa+IeH63h+8Oyt9NdX+pyqjuOp7p+kaq/H2Lzs98D9vcja/2pfvtYDb21WndaW9vzPXQIAAAAAAAAAAAAAAAAAAAAAAAAh/oHOVI0YSQb7ewAAAAASUVORK5CYII=",
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Compare entered password vs password stored in db while logging in
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Before saving to database encrypt the password
userSchema.pre("save", async function (next) {
  if (!this.isModified) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

module.exports = User;
