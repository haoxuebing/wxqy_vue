export const formatDate = function (date) {
    if (date != null) {
      var date = new Date(parseInt(date.replace("/Date(", "").replace(")/", ""), 10));
      //月份为0-11，所以+1，月份小于10时补个0
      var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
      var currentDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      return date.getFullYear() + "-" + month + "-" + currentDate;
    }
    return "";
  }