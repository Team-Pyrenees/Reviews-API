module.exports.generateDate = () => {
  let dateObj = new Date();
  let month = dateObj.getUTCMonth() + 1; //months from 1-12
  let day = dateObj.getUTCDate();
  let year = dateObj.getUTCFullYear();

  if (Number(day) < 10) {
    day = '0' + day;
  }
  if (Number(month) < 10) {
    month = '0' + month;
  }
  newdate = year + "-" + month + "-" + day;
  return newdate;
}