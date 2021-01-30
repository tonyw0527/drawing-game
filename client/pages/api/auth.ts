// get method
export default (req, res) => {
  const { invicode } = req.cookies;

  if(invicode === process.env.INVITATION_CODE){
    res.status(200).json({success: true});
  } else {
    res.statsus(400).json({success: false});
  };
}