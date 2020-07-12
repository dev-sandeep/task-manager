/**
 * responsible for handling the request from the todo list
 */

const TASK_DATA = 'tak_data';
var onSavePress = () => {
  let dateTime = $("#date-time").val();
  if (!dateTime) {
    errorDialog("<h3>Task without a deadline, is a dead task!</h3>");
    return;
  }

  let minutes = moment(dateTime).diff(moment(), "minutes");

  //get all the values
  let taskObj = {
    name: $("#task-input").val(),
    dateTime,
    isDone: false,
    id: moment().unix(),
    minutes
  }

  pushList(taskObj);
  setAlarm(taskObj.id, minutes);
  // console.log(taskObj);

  //all done
  $("#task-input").val('');
}

var onMarkDonePressListner = () => {
  $('.done-td').click(function () {
    var btnId = $(this).attr("btn-id");
    chrome.storage.sync.get(["task_data"], function (result) {
      var task = result["task_data"];

      for (var key in task) {
        if (task[key]['id'] == btnId)
          task[key]['isDone'] = true;
      }

      chrome.storage.sync.set({ task_data: task }, function () {
        refreshList();
      });
    });
  });

  $('.refresh-td').click(function () {
    var btnId = $(this).attr("btn-id");
    chrome.storage.sync.get(["task_data"], function (result) {
      var task = result["task_data"], name;

      for (var key in task) {
        if (task[key]['id'] == btnId) {
          name = task[key]['name'];
          //remove from list
          task = task.filter((obj) => obj.id != btnId);
          chrome.storage.sync.set({ task_data: task }, function () {
          });
          $("#task-input").val(name)
          openDialog();
        }
      }
    });
  });
}

var onRemovePressListner = () => {
  $('.delete-td').click(function () {
    var btnId = $(this).attr("btn-id");
    chrome.storage.sync.get(["task_data"], function (result) {
      var task = result["task_data"];

      task = task.filter((obj) => obj.id != btnId);

      chrome.storage.sync.set({ task_data: task }, function () {
        if (task.length == 0) {
          location.reload();
        } else {
          refreshList();
        }

        deleteAlarm(btnId);
      });
    });
  });
}

var defaultDateTime = () => {
  var dateTime = getDateTime();
  console.log(dateTime);
  $("#date-time").val(dateTime);
}

var errorDialog = (message) => {
  $("#error-message").html(message);
  $("#dialog-error").dialog({
    modal: true,
    buttons: {
      Close: function () {
        $(this).dialog("close");
      }
    }
  }
  );
}

var openDialog = () => {
  var taskVal = $("#task-input").val();
  if (!taskVal) {
    errorDialog("Task can not be empty");
    return;
  }

  var dialog = $("#dialog").dialog({
    modal: true,
    buttons: {
      Save: function () {
        onSavePress();
        $(this).dialog("close");
      }
    }
  });

  $("#deadline-form").on("submit", function () {
    onSavePress();
    dialog.dialog("close");
  })

  defaultDateTime();
}

var addSaveBtnListner = () => {
  $("#save-task").click(() => {
    var task = $("#task-input").val();
    openDialog();
  });
}

var enterPressListner = () => {
  $("#task-input").keypress(function (e) {
    if (e.which == 13) {
      openDialog();
    }
  });
}

var init = () => {
  addSaveBtnListner();
  enterPressListner();
  $(document).tooltip();
}

var diffFormat = (minutes) => {
  return {
    days: Math.floor(minutes / (24 * 60)),
    hours: Math.floor((minutes % (24 * 60)) / 60),
    minutes: Math.floor((minutes % (24 * 60)) % 60)
  }
}


var increaseBadgeCount = () => {
  chrome.browserAction.getBadgeText({}, (count) => {
    console.log("count", count);
    if (count) {
      count = parseInt(count);
      count++;
    } else {
      count = 1;
    }

    chrome.browserAction.setBadgeText({ text: count.toString() });

  });
}
var setBadgeCount = (txt) => {
  chrome.browserAction.setBadgeText({ text: txt.toString() });
}

var clearBadgeCount = () => {
  chrome.browserAction.setBadgeText({ text: "" });
}

var setAlarm = (id, minutes) => {
  chrome.alarms.create(id.toString(), {
    when: Date.now() + minutes * 60 * 1000//ts
  });
}

var deleteAlarm = (id) => {
  chrome.alarms.clear(id.toString());
}

$(document).ready(function () {
  init();
  refreshList();
  // bgProcess();
  clearBadgeCount();
});


///////////////////////

var pushList = (obj) => {
  //get the data
  chrome.storage.sync.get(["task_data"], function (result) {
    var task;
    if (!result || !result["task_data"] || !Array.isArray(result["task_data"])) {
      task = [];
    } else {
      task = result["task_data"];
    }

    task = [...task, obj];
    chrome.storage.sync.set({ task_data: task }, function () {
      refreshList();
    });

  });
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

var bgProcess = () => {
  chrome.runtime.sendMessage({
    msg: "notify",
    data: {
      subject: "Loading",
      content: "Just completed!"
    }
  });
}

var refreshList = () => {
  chrome.storage.sync.get(["task_data"], function (result) {
    var task;
    if (!result || !result["task_data"] || !Array.isArray(result["task_data"])) {
      task = [];
    } else {
      task = result["task_data"];
    }

    loadList(task);
    onMarkDonePressListner();
    onRemovePressListner();
  });
}

var loadList = (data) => {
  if (!data || data.length == 0) {
    errorDialog("<h3> Hello, Create your first task and let the magic begin!</h3>");
    return;
  }

  //compare saved time to now
  for (var key in data) {
    data[key]['minutes'] = moment(data[key]['dateTime']).diff(moment(), "minutes");
  }

  data = data.sort(function (a, b) {
    return a.minutes - b.minutes
  });

  loadHTMLList(data);
}

var loadHTMLList = (data) => {

  //clear existing list
  $("#main-table").html("");
  var positiveMin = '';
  var negativeMin = '';
  var missedDeadline = '';
  var time;
  for (var key in data) {
    time = diffFormat(data[key]['minutes']);
    if (data[key]['minutes'] > 0 && !data[key]['isDone']) {
      positiveMin += `
        <tr class="single-col">
          <td width="70%" class="list-text ${time.days == 0 ? 'task-color-today' : 'task-color-other'}">${data[key]['name']}</td>
          <td class="" width="13%">
          <div class="tooltip">
            <a href="#" title="${twoDigit(time.days)} Day(s) ${twoDigit(time.hours)} hours ${twoDigit(time.minutes)} minutes to the task deadline">
            <span class="days">${twoDigit(time.days)} Day(s)</span>
              <span class="time">${twoDigit(time.hours)}:${twoDigit(time.minutes)}
            </td>
            <td class="center done-td" width="5%" btn-id="${data[key]['id']}"> 
            <button class="done">
            <img src="../images/icons/check-1.svg" />
            </button>
            </td>
            </div>
        </tr>
      `;
    } else {
      if (!data[key]['isDone']) {
        missedDeadline += `
        <tr class="single-col">
        <td width="70%" class="list-text ${data[key]['isDone'] ? 'task-color-done' : 'task-color-times-up'}">${data[key]['name']}</td>
        <td class="center refresh-td" width="13%" btn-id="${data[key]['id']}"> 
          <button class="refresh">
          <a href="#" title="Alas! The deadline is already missed">
            <img src="../images/icons/refresh.svg" />
          </a>
          </button>
        </td>
      
        <td class="center ${data[key]['isDone'] ? 'delete-td' : 'done-td'}" width="10%" btn-id="${data[key]['id']}"> <button class="done">${data[key]['isDone'] ? '<img src="../images/icons/cross.svg" />' : '  <img src="../images/icons/check-1.svg" />'}</button></td>
    </tr>
        `;
      } else {
        negativeMin += `
      <tr class="single-col ${data[key]['isDone'] ? 'finished' : ''}">
          <td width="70%" class="list-text ${data[key]['isDone'] ? 'task-color-done' : 'task-color-times-up'}">${data[key]['name']}</td>
          <td class="center refresh-td" width="13%" btn-id="${data[key]['id']}"> 
            <button class="refresh">
              <a href="#" title="Alas! The deadline is already missed">
                <img src="../images/icons/refresh.svg" />
              </a>
            </button>
        </td>
          <td class="center ${data[key]['isDone'] ? 'delete-td' : 'done-td'}" width="10%" btn-id="${data[key]['id']}"> <button class="done">${data[key]['isDone'] ? '<img src="../images/icons/cross.svg" />' : '  <img src="../images/icons/check-1.svg" />'}</button></td>
      </tr>
    `;
      }

    }
  }

  $("#main-table").html(missedDeadline);
  $("#main-table").append(positiveMin);
  $("#main-table").append(negativeMin);
}
///////////////////////////
var getDateTime = () => {
  return moment().format('YYYY-MM-DDTHH:mm');
}

async function setter(key, data) {
  chrome.storage.sync.set({ TASK_DATA: (data) }, function () {
    console.log("value set");
    return true;
  });
}

async function getter(key) {
  chrome.storage.sync.get(key, function (resp) {
    if (resp && Array.isArray(resp)) {
      return (resp);
    }
  });
}

var twoDigit = (num) => {
  if (num < 10)
    return '0'.toString() + num;
  return num;
}
