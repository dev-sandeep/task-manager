/**
 * responsible for handling the request from the todo list
 */

var onKeyupHandler = () => {

}

var onSavePress = () => {

}

var onMarkDonePress = () => {

}

var onRemovePress = () => {

}

var init = () => {
  $("#dialog").dialog();
}

$(document).ready(function(){
  init();
  $("#dialog").dialog();
});


///////////////////////

var pushList = () => {

}

var changeListStatus = () => {

}

var calculateDay = () => {

}

var calculateTime = () => {

}

var clearAllSetInterval = () => {

}

var deleteItem = () => {

}

// var timeIntervalArr = [];

// var getTime = (offset = 0, type = 'time') => {
//   let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
//   var d = new Date();
//   var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
//   var date = new Date(utc + (3600000 * offset));

//   if (type == 'time') {
//     return twoDigit(date.getHours()) + ":" + (twoDigit(date.getMinutes())) + ":" + twoDigit(date.getSeconds());
//   } else {
//     return twoDigit(date.getDate()) + "." + months[date.getMonth()] + "." + twoDigit(date.getFullYear());
//   }

// }

// var twoDigit = (num) => {
//   if (num < 10)
//     return '0'.toString() + num;
//   return num;
// }

// var pushDate = (data) => {
//   var time = getTime(data['offset']);
//   var date = getTime(data['offset'], 'date');
//   var place = data['text'];
//   var str = `
//   <tr>
//     <td width='90%'>
//         <span class="time">${time}</span>
//         <div class="day">${date}</div>
//         <div class="city">${place}</div>
//     </td>
//     <td width='10%'>
//         <button class="delete" offset=${data['offset']}>x</button>
//     </td>
//   </tr>`;
//   return str;
// }

// var ticker = () => {
//   chrome.storage.sync.get("data", function (resp) {
//     var data = resp.data;
//     try {
//       data = JSON.parse(data);
//       if (data && Object.keys(data).length != 0) {
//         var timeInterval = setInterval(() => {
//           $('.tbl').html('');
//           var ctr = 0, str = '';
//           // data = data.reverse();
//           for (var i in data) {
//             if (ctr++ < 4)
//               str += pushDate(data[i]);
//           }

//           // $('.tbl').html('');
//           $('.tbl').html(str);
//           deleteListner();

//         }, 1000);

//         timeIntervalArr.push(timeInterval);
//       }
//     } catch (e) {
//       console.log(e);
//     }
//   });
// }

// var refresh = () => {
//   location.reload()
// }

// var deleteListner = () => {
//   $('.delete').on('click', function () {
//     var self = this;
//     var offset = $(this).attr('offset');

//     /* traverse from the stored list and remove the one with the following offset */
//     chrome.storage.sync.get("data", function (resp) {
//       var data = resp.data;
//       data = JSON.parse(data);

//       var finalData = data.filter((e) => {
//         return e.offset != offset;
//       });

//       chrome.storage.sync.set({ "data": JSON.stringify(finalData) }, function () {
//         refresh();
//       });
//     });
//   });
// }

// $(document).ready(() => {
//   ticker();

//   /* push all the data into select-option */
//   $.getJSON("../scripts/timezone.json", function (json) {

//     for (var i in json) {
//       $('select').append("<option value=" + json[i].offset + " data='" + JSON.stringify(json[i]) + "'>" + json[i].offset + "  |  " + json[i].value + "</option>");
//     }
//   });

//   /* add event listners to select opptions */
//   $('select').on('change', () => {
//     var optionVal = $('option:selected').attr('data');
//     try {
//       optionVal = JSON.parse(optionVal);

//       chrome.storage.sync.get("data", function (resp) {
//         var data = resp.data;
//         console.log("data", data);
//         try {
//           if (data && Object.keys(data).length != 0) {
//             data = JSON.parse(data);
//           } else {
//             data = [];
//           }

//           data = [optionVal, ...data];
//           if (data.length > 4) {
//             data.pop();
//           }

//           chrome.storage.sync.set({ "data": JSON.stringify(data) }, function () {
//             if (chrome.runtime.error) {
//               console.log("Runtime error.");
//             } else {
//               refresh();
//             }
//           });
//         } catch (e) {
//           console.log(e);
//         }

//       });
//     } catch (e) {
//       console.log(e);
//     }
//   });
// });