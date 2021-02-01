// get method
export default (req, res) => {
  const { invicode } = req.cookies;
  const flag = invicode === process.env.INVITATION_CODE || invicode === process.env.ADMIN_SECRET;
  console.log(flag);
  if(flag){
    res.status(200).json({success: true});
  } else {
    res.status(400).json({success: false});
  };
}