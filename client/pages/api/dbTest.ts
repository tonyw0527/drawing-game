import dbConnect from '../../utils/dbConnect';
import bookModel from '../../models/User';

export const config = {
  api: {
    externalResolver: true,
  },
}

// properties
// req.method, req.cookies, req.query
export default (req, res) => {
  dbConnect();

  bookModel.find((err, data) => {
      if(err){
          res.status(400).json({ success: false, msg: "db query error." })
          return;
      } else {
          res.status(200).json({ success: true, msg: "db query success", data: data});
      }
  });
}